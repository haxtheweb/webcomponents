import { expect } from "@open-wc/testing";
import { observable, runInAction } from "mobx";
import {
  buildPublicTools,
  getVisibleItems,
  initHAXcmsWebMCP,
  scoreSearchEntries,
} from "../lib/core/utils/HAXCMSWebMCP.js";

// haxtheweb/issues#3104: public, read-only WebMCP tools.

function makeManifest() {
  return {
    title: "Intro to Biology",
    description: "An open course",
    metadata: {
      site: { settings: {} },
      theme: { regions: { footerPrimary: ["footer"] } },
    },
    items: [
      {
        id: "item-1",
        title: "Getting Started",
        slug: "getting-started",
        location: "pages/item-1/index.html",
        description: "How the course works.",
        metadata: {},
      },
      {
        id: "item-2",
        title: "Photosynthesis",
        slug: "photosynthesis",
        location: "pages/item-2/index.html",
        description: "How plants turn light into energy.",
        metadata: {},
      },
      {
        id: "draft",
        title: "Draft",
        slug: "draft",
        location: "pages/draft/index.html",
        metadata: { published: false },
      },
      {
        id: "hidden",
        title: "Hidden",
        slug: "hidden",
        location: "pages/hidden/index.html",
        metadata: { hideInMenu: "true" },
      },
      {
        id: "footer",
        title: "Footer",
        slug: "footer",
        location: "pages/footer/index.html",
        metadata: {},
      },
    ],
  };
}

function fakeFetch(map) {
  return async (url) => {
    const key = Object.keys(map).find((k) => String(url).endsWith(k));
    if (!key) {
      return { ok: false };
    }
    const body = map[key];
    return {
      ok: true,
      json: async () => body,
      text: async () => body,
    };
  };
}

function toolByName(tools, name) {
  return tools.find((tool) => tool.name === name);
}

describe("HAXCMSWebMCP", () => {
  it("only exposes published, menu-visible, non-region pages", () => {
    const slugs = getVisibleItems(makeManifest()).map((item) => item.slug);
    expect(slugs).to.deep.equal(["getting-started", "photosynthesis"]);
  });

  it("marks every tool read-only and content tools as untrusted", () => {
    const tools = buildPublicTools(() => makeManifest(), fakeFetch({}));
    expect(tools.map((t) => t.name)).to.deep.equal([
      "search_site",
      "get_page",
      "get_site_outline",
      "go_to_page",
    ]);
    tools.forEach((tool) => {
      expect(tool.annotations.readOnlyHint).to.equal(true);
    });
    ["search_site", "get_page", "get_site_outline"].forEach((name) => {
      expect(toolByName(tools, name).annotations.untrustedContentHint).to.equal(
        true,
      );
    });
  });

  it("search_site ranks title matches and never returns hidden pages", async () => {
    const index = [
      {
        title: "Photosynthesis",
        location: "photosynthesis",
        description: "",
        text: "light energy",
      },
      {
        title: "Getting Started",
        location: "getting-started",
        description: "",
        text: "light reading",
      },
      {
        title: "Draft",
        location: "draft",
        description: "",
        text: "photosynthesis draft",
      },
    ];
    const tools = buildPublicTools(
      () => makeManifest(),
      fakeFetch({ "lunrSearchIndex.json": index }),
    );
    const out = JSON.parse(
      await toolByName(tools, "search_site").execute({
        query: "photosynthesis",
      }),
    );
    expect(out.results.map((r) => r.slug)).to.deep.equal(["photosynthesis"]);
    expect(scoreSearchEntries(index, "light")[0].entry.location).to.be.oneOf([
      "photosynthesis",
      "getting-started",
    ]);
  });

  it("get_page returns markdown for visible pages and refuses hidden ones", async () => {
    const tools = buildPublicTools(
      () => makeManifest(),
      fakeFetch({ "pages/item-2/index.md": "## Photosynthesis\n\nPlants." }),
    );
    const page = JSON.parse(
      await toolByName(tools, "get_page").execute({ page: "photosynthesis" }),
    );
    expect(page.markdown).to.contain("Plants.");
    const hidden = JSON.parse(
      await toolByName(tools, "get_page").execute({ page: "draft" }),
    );
    expect(hidden.error).to.contain("No page found");
  });

  it("registers only for anonymous, non-editing visitors on public sites", () => {
    const registered = [];
    const original = globalThis.document.modelContext;
    globalThis.document.modelContext = {
      registerTool(tool, options) {
        registered.push({ tool, signal: options.signal });
      },
    };
    const store = observable({
      manifest: makeManifest(),
      isLoggedIn: false,
      editMode: false,
    });
    const dispose = initHAXcmsWebMCP(store);
    try {
      expect(registered.length).to.equal(4);
      expect(registered.every((r) => !r.signal.aborted)).to.equal(true);
      runInAction(() => {
        store.isLoggedIn = true;
      });
      expect(registered.every((r) => r.signal.aborted)).to.equal(true);
      runInAction(() => {
        store.isLoggedIn = false;
        store.manifest.metadata.site.settings.private = true;
      });
      expect(registered.length).to.equal(4);
    } finally {
      dispose();
      globalThis.document.modelContext = original;
    }
  });
});

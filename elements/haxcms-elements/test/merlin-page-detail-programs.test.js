import { expect } from "@open-wc/testing";
import { toJS } from "mobx";
import { store } from "../lib/core/haxcms-site-store.js";
import { createEditTitleProgram } from "../lib/core/utils/EditTitleProgram.js";
import { createEditSlugProgram } from "../lib/core/utils/EditSlugProgram.js";
import { createEditDescriptionProgram } from "../lib/core/utils/EditDescriptionProgram.js";
import { createEditTagsProgram } from "../lib/core/utils/EditTagsProgram.js";
import { createEditIconProgram } from "../lib/core/utils/EditIconProgram.js";
import { createSharePageProgram } from "../lib/core/utils/SharePageProgram.js";
import { createPageAsDataProgram } from "../lib/core/utils/PageAsDataProgram.js";

// The Merlin (super-daemon) programs that edit the active page's details.
// Each result's value is run by super-daemon as
// value.target[value.method](...value.args); for the edit programs that
// dispatches haxcms-save-node-details on globalThis, which
// haxcms-site-editor.saveNodeDetails() forwards to @site/updateItem with
// { idOrSlug, operation, <field> }. These tests run the results the way
// super-daemon does and check the event the backend would receive, so a
// change to an operation name, field name or target page shows up here.

const SAVE_EVENT = "haxcms-save-node-details";

function makeManifest() {
  return {
    id: "merlin-site",
    title: "Merlin Site",
    metadata: { site: { name: "merlin-site" }, theme: {} },
    items: [
      {
        id: "item-1",
        title: "First page",
        slug: "first-page",
        location: "pages/item-1/index.html",
        order: 0,
        parent: null,
        indent: 0,
        metadata: { tags: "alpha, beta", icon: "icons:home" },
      },
      {
        id: "item-2",
        title: "Second page",
        slug: "second-page",
        location: "pages/item-2/index.html",
        order: 1,
        parent: null,
        indent: 0,
        metadata: { tags: ["one", "two"] },
      },
      {
        id: "item-3",
        title: "",
        slug: "untitled",
        location: "pages/item-3/index.html",
        order: 2,
        parent: null,
        indent: 0,
        metadata: {},
      },
    ],
  };
}

// run a result the way super-daemon does and return the save event details
function runResult(result) {
  const seen = [];
  const listener = (e) => {
    seen.push(e.detail);
  };
  globalThis.addEventListener(SAVE_EVENT, listener);
  try {
    result.value.target[result.value.method](...result.value.args);
  } finally {
    globalThis.removeEventListener(SAVE_EVENT, listener);
  }
  return seen;
}

function expectSaveResult(result, path) {
  expect(result.eventName).to.equal("super-daemon-element-method");
  expect(result.path).to.equal(path);
  expect(result.value.target).to.equal(globalThis);
  expect(result.value.method).to.equal("dispatchEvent");
  const event = result.value.args[0];
  expect(event.type).to.equal(SAVE_EVENT);
  expect(event.bubbles).to.equal(true);
  expect(event.composed).to.equal(true);
  expect(event.cancelable).to.equal(true);
}

function expectDisabled(result, path) {
  expect(result.eventName).to.equal("disabled");
  expect(result.value).to.deep.equal({ disabled: true });
  expect(result.path).to.equal(path);
}

describe("Merlin page detail programs", () => {
  let savedManifest;
  let savedActiveId;

  beforeEach(() => {
    savedManifest = toJS(store.manifest);
    savedActiveId = store.activeId;
    store.manifest = makeManifest();
    store.activeId = "item-1";
  });

  afterEach(() => {
    store.activeId = savedActiveId;
    store.manifest = savedManifest;
  });

  describe("no active page", () => {
    const programs = [
      ["title", createEditTitleProgram, "CMS/edit/title/error"],
      ["slug", createEditSlugProgram, "CMS/edit/slug/error"],
      [
        "description",
        createEditDescriptionProgram,
        "CMS/edit/description/error",
      ],
      ["tags", createEditTagsProgram, "CMS/edit/tags/error"],
      ["icon", createEditIconProgram, "CMS/edit/icon/error"],
      ["share", createSharePageProgram, "CMS/action/share/page/error"],
    ];
    programs.forEach(([name, create, path]) => {
      it(`${name}: returns one disabled result and saves nothing`, async () => {
        store.activeId = null;
        const results = await create({ t: {} })("anything");
        expect(results.length).to.equal(1);
        expectDisabled(results[0], path);
        expect(results[0].title).to.equal("No active page found");
      });
    });

    it("uses the context's translation for the error", async () => {
      store.activeId = null;
      const results = await createEditTitleProgram({
        t: { noActivePageFound: "Keine aktive Seite" },
      })("");
      expect(results[0].title).to.equal("Keine aktive Seite");
    });
  });

  describe("edit title", () => {
    it("saves typed text as the active page's title", async () => {
      const results = await createEditTitleProgram({ t: {} })("New title");
      expect(results.length).to.equal(1);
      expectSaveResult(results[0], "CMS/edit/title/confirm");
      expect(results[0].title).to.equal("Save title: New title");
      expect(runResult(results[0])).to.deep.equal([
        {
          id: "item-1",
          idOrSlug: "item-1",
          operation: "setTitle",
          title: "New title",
        },
      ]);
    });

    it("offers to re-save the current title when nothing is typed", async () => {
      for (const input of ["", "   ", null, undefined]) {
        const results = await createEditTitleProgram({ t: {} })(input);
        expect(results.length).to.equal(1);
        expect(results[0].title).to.equal("Save title: First page");
        expect(runResult(results[0])[0].title).to.equal("First page");
      }
    });

    it("offers nothing when the page has no title and nothing is typed", async () => {
      store.activeId = "item-3";
      const results = await createEditTitleProgram({ t: {} })("");
      expect(results).to.deep.equal([]);
    });

    it("shows replacement patterns in typed text literally", async () => {
      const results = await createEditTitleProgram({ t: {} })("$& and $'");
      expect(results[0].title).to.equal("Save title: $& and $'");
      expect(runResult(results[0])[0].title).to.equal("$& and $'");
    });

    it("targets the page active when the program runs, not when created", async () => {
      const program = createEditTitleProgram({ t: {} });
      store.activeId = "item-2";
      const results = await program("Renamed");
      const detail = runResult(results[0])[0];
      expect(detail.id).to.equal("item-2");
      expect(detail.idOrSlug).to.equal("item-2");
    });

    it("uses translated labels from the context", async () => {
      const results = await createEditTitleProgram({
        t: { saveTitleValue: "Titel speichern: {title}" },
      })("Neu");
      expect(results[0].title).to.equal("Titel speichern: Neu");
    });
  });

  describe("edit slug", () => {
    it("saves typed text as the slug", async () => {
      const results = await createEditSlugProgram({ t: {} })("new-slug");
      expect(results.length).to.equal(1);
      expectSaveResult(results[0], "CMS/edit/slug/confirm");
      expect(results[0].title).to.equal("Save slug: new-slug");
      expect(runResult(results[0])).to.deep.equal([
        {
          id: "item-1",
          idOrSlug: "item-1",
          operation: "setSlug",
          slug: "new-slug",
        },
      ]);
    });

    it("offers nothing until something is typed", async () => {
      expect(await createEditSlugProgram({ t: {} })("")).to.deep.equal([]);
      expect(await createEditSlugProgram({ t: {} })("  ")).to.deep.equal([]);
      expect(await createEditSlugProgram({ t: {} })(null)).to.deep.equal([]);
    });
  });

  describe("edit description", () => {
    it("saves typed text and truncates only the label", async () => {
      const long = "d".repeat(80);
      const results = await createEditDescriptionProgram({ t: {} })(long);
      expect(results.length).to.equal(1);
      expectSaveResult(results[0], "CMS/edit/description/confirm");
      expect(results[0].title).to.equal(
        `Save description: ${"d".repeat(50)}...`,
      );
      expect(runResult(results[0])).to.deep.equal([
        {
          id: "item-1",
          idOrSlug: "item-1",
          operation: "setDescription",
          description: long,
        },
      ]);
    });

    it("does not add an ellipsis to short descriptions", async () => {
      const results = await createEditDescriptionProgram({ t: {} })("Short");
      expect(results[0].title).to.equal("Save description: Short");
    });

    it("clears the description when nothing is typed", async () => {
      for (const input of ["", null, undefined]) {
        const results = await createEditDescriptionProgram({ t: {} })(input);
        expect(results.length).to.equal(1);
        expect(results[0].title).to.equal("Clear description");
        expect(runResult(results[0])[0]).to.deep.equal({
          id: "item-1",
          idOrSlug: "item-1",
          operation: "setDescription",
          description: "",
        });
      }
    });
  });

  describe("edit tags", () => {
    it("saves typed tags as typed", async () => {
      const results = await createEditTagsProgram({ t: {} })("x, y");
      expect(results.length).to.equal(1);
      expectSaveResult(results[0], "CMS/edit/tags/confirm");
      expect(results[0].title).to.equal("Save tags: x, y");
      expect(runResult(results[0])).to.deep.equal([
        {
          id: "item-1",
          idOrSlug: "item-1",
          operation: "setTags",
          tags: "x, y",
        },
      ]);
    });

    it("offers to keep or clear the current tags (string form)", async () => {
      const results = await createEditTagsProgram({ t: {} })("");
      expect(results.length).to.equal(2);
      expectSaveResult(results[0], "CMS/edit/tags/confirm");
      expect(results[0].title).to.equal("Save tags: alpha, beta");
      expect(runResult(results[0])[0].tags).to.equal("alpha, beta");
      expectSaveResult(results[1], "CMS/edit/tags/clear");
      expect(results[1].title).to.equal("Clear all tags");
      expect(runResult(results[1])[0]).to.deep.equal({
        id: "item-1",
        idOrSlug: "item-1",
        operation: "setTags",
        tags: "",
      });
    });

    it("joins tags stored as an array", async () => {
      store.activeId = "item-2";
      const results = await createEditTagsProgram({ t: {} })("");
      expect(results[0].title).to.equal("Save tags: one, two");
      expect(runResult(results[0])[0].tags).to.equal("one, two");
    });

    it("shows a disabled hint when the page has no tags", async () => {
      store.activeId = "item-3";
      const results = await createEditTagsProgram({ t: {} })("");
      expect(results.length).to.equal(1);
      expectDisabled(results[0], "CMS/edit/tags/empty");
      expect(results[0].title).to.equal("No tags set");
    });
  });

  describe("edit icon", () => {
    const probeIcons = ["zz-probe-alpha", "zz-probe-beta-icon"];
    before(async () => {
      const { SimpleIconsetStore } =
        await import("@haxtheweb/simple-icon/lib/simple-iconset.js");
      SimpleIconsetStore.registerManifest([
        { name: "zzprobe", icons: probeIcons },
      ]);
    });

    it("lists matching icons that each save setIcon on the page", async () => {
      const results = await createEditIconProgram({ t: {} })("zz-probe");
      expect(results.map((r) => r.icon)).to.deep.equal([
        "zzprobe:zz-probe-alpha",
        "zzprobe:zz-probe-beta-icon",
      ]);
      expect(results[1].title).to.equal(
        "Zz Probe Beta Icon (zzprobe:zz-probe-beta-icon)",
      );
      expectSaveResult(results[0], "CMS/edit/icon/zzprobe:zz-probe-alpha");
      expect(runResult(results[0])).to.deep.equal([
        {
          id: "item-1",
          idOrSlug: "item-1",
          operation: "setIcon",
          icon: "zzprobe:zz-probe-alpha",
        },
      ]);
    });

    it("matches the search without regard to case", async () => {
      const results = await createEditIconProgram({ t: {} })("ZZ-PROBE-ALPHA");
      expect(results.map((r) => r.icon)).to.deep.equal([
        "zzprobe:zz-probe-alpha",
      ]);
    });

    it("says nothing matched, with the search, when nothing does", async () => {
      const results = await createEditIconProgram({ t: {} })(
        "no-icon-has-this-name",
      );
      expect(results.length).to.equal(1);
      expectDisabled(results[0], "No results");
      expect(results[0].title).to.equal(
        'No icons found for "no-icon-has-this-name"',
      );
    });

    it("shows at most 50 icons and a hint when nothing is typed", async () => {
      const { SimpleIconsetStore } =
        await import("@haxtheweb/simple-icon/lib/simple-iconset.js");
      const filler = [];
      for (let i = 0; i < 60; i++) {
        filler.push(`zz-filler-${String(i).padStart(2, "0")}`);
      }
      SimpleIconsetStore.registerManifest([
        { name: "zzfiller", icons: filler },
      ]);
      const total = SimpleIconsetStore.iconlist.length;
      const results = await createEditIconProgram({ t: {} })("");
      expect(results.length).to.equal(51);
      const hint = results[50];
      expectDisabled(hint, "Hint");
      expect(hint.title).to.equal(
        `Showing 50 of ${total} icons - type to search`,
      );
      // the first 50 are in sorted order
      const shown = results.slice(0, 50).map((r) => r.icon);
      expect(shown).to.deep.equal(
        [...SimpleIconsetStore.iconlist].sort().slice(0, 50),
      );
    });
  });

  describe("share page", () => {
    function shareContext(t = {}) {
      return {
        t,
        getCurrentPageShareLink: (item) =>
          `https://example.com/site/${item.slug}`,
        copied: null,
        copyCurrentPageShareLink(link, title) {
          this.copied = { link, title };
        },
      };
    }

    it("copies the active page's link through the context", async () => {
      const context = shareContext();
      const results = await createSharePageProgram(context)("");
      expect(results.length).to.equal(1);
      const r = results[0];
      expect(r.title).to.equal("Copy link to First page");
      expect(r.more).to.equal("https://example.com/site/first-page");
      expect(r.path).to.equal("CMS/action/share/page/current");
      expect(r.value.target).to.equal(context);
      r.value.target[r.value.method](...r.value.args);
      expect(context.copied).to.deep.equal({
        link: "https://example.com/site/first-page",
        title: "First page",
      });
    });

    it("filters on the title, the link and share words", async () => {
      const program = createSharePageProgram(shareContext());
      expect((await program("FIRST")).length).to.equal(1);
      expect((await program("first-page")).length).to.equal(1);
      expect((await program("copy")).length).to.equal(1);
      expect((await program("url")).length).to.equal(1);
      expect((await program("unrelated words")).length).to.equal(0);
    });

    it("falls back to 'current page' for an untitled page", async () => {
      store.activeId = "item-3";
      const results = await createSharePageProgram(shareContext())("");
      expect(results[0].title).to.equal("Copy link to current page");
      expect(results[0].value.args[1]).to.equal("current page");
    });
  });

  describe("page as data", () => {
    it("lists every format, calling openPageAsDataFormat on the context", async () => {
      const context = { t: {} };
      const results = await createPageAsDataProgram(context)("");
      expect(results.map((r) => r.value.args[0])).to.deep.equal([
        "json",
        "yaml",
        "md",
        "xml",
      ]);
      results.forEach((r) => {
        expect(r.value.target).to.equal(context);
        expect(r.value.method).to.equal("openPageAsDataFormat");
        expect(r.path).to.equal(`>developer/page-as-data/${r.value.args[0]}`);
        expect(r.context).to.deep.equal([">"]);
        expect(r.more).to.equal(
          `Reload this page using ?format=${r.value.args[0]}`,
        );
      });
      expect(results[2].title).to.equal("View page as Markdown");
    });

    it("filters by format, title or tag", async () => {
      const program = createPageAsDataProgram({ t: {} });
      expect((await program("yaml")).map((r) => r.value.args[0])).to.deep.equal(
        ["yaml"],
      );
      expect(
        (await program("  Markdown ")).map((r) => r.value.args[0]),
      ).to.deep.equal(["md"]);
      expect((await program("llm")).length).to.equal(4);
      expect((await program("api")).map((r) => r.value.args[0])).to.deep.equal([
        "json",
      ]);
      expect((await program("nothing-matches")).length).to.equal(0);
    });

    it("matches and labels with translated titles", async () => {
      const program = createPageAsDataProgram({
        t: { viewPageAsFormat: "Seite als {format} anzeigen" },
      });
      const results = await program("anzeigen");
      expect(results.length).to.equal(4);
      expect(results[0].title).to.equal("Seite als JSON anzeigen");
    });
  });
});

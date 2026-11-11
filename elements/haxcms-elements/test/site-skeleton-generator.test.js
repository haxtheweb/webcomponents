import { expect } from "@open-wc/testing";
import { toJS } from "mobx";
import { store } from "../lib/core/haxcms-site-store.js";
import SiteSkeletonGenerator from "../lib/core/utils/site-skeleton-generator.js";

// SiteSkeletonGenerator turns the live site into a skeleton (a reusable site
// template) whose site / build / theme keys are sent straight to createSite
// when someone makes a new site from it. These tests pin that shape: page
// ids are replaced by fresh ones with parents remapped, page content and
// file references come along, and instance-specific values (timestamps,
// analytics ids, canonical overrides) never leak into the template.

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

function page(id, title, parent, order, indent, metadata = {}) {
  return {
    id,
    title,
    slug: `slug-${id}`,
    location: `pages/${id}/index.html`,
    order,
    parent,
    indent,
    metadata,
  };
}

// Root (Child A, Child B (Grandchild)), Second
function makeManifest(overrides = {}) {
  return {
    id: "skeleton-site",
    title: "Skeleton Site",
    description: "A site to copy",
    metadata: {
      site: {
        name: "skeleton-site",
        category: ["course"],
        tags: ["demo", "tests"],
        settings: {
          lang: "en",
          canonical: false,
          gaID: "G-TESTONLY",
          emptyString: "",
          emptyArray: [],
          emptyObject: {},
          nullValue: null,
          publishPagesOn: true,
          created: 1700000000,
          updated: 1700000001,
        },
      },
      theme: {
        element: "polaris-flex-theme",
        variables: { hexCode: "#123456" },
        hexCode: "#abcdef",
        icon: "icons:home",
        regions: { header: [] },
      },
      platform: { audience: "everyone" },
      licensing: { name: "CC BY" },
    },
    items: [
      page("root", "Root", null, 0, 0, {
        published: false,
        tags: ["intro"],
        wordCount: 12,
        difficulty: "easy",
        created: 1,
        updated: 2,
      }),
      page("childA", "Child A", "root", 0, 1),
      page("childB", "Child B", "root", 1, 1, { hideInMenu: true }),
      page("grandchild", "Grandchild", "childB", 0, 2),
      page("second", "Second", null, 1, 0),
    ],
    ...overrides,
  };
}

const PAGE_CONTENT = {
  "pages/root/index.html":
    '<p>Root</p><a href="files/images/cover.png">cover</a>',
  "pages/childA/index.html":
    '<a href="files/docs/syllabus.pdf">Syllabus</a><a href="files/images/cover.png">again</a>',
  "pages/childB/index.html": "<p>No files here</p>",
  "pages/grandchild/index.html":
    '<video-player source="files/media/clip.mp4"></video-player>',
  "pages/second/index.html": "",
};

describe("SiteSkeletonGenerator", () => {
  let savedManifest;
  let savedFetch;
  let fetched;

  beforeEach(() => {
    savedManifest = toJS(store.manifest);
    savedFetch = globalThis.fetch;
    fetched = [];
    // store.loadItemContent() fetches each page's location
    globalThis.fetch = async (url) => {
      const key = String(url);
      fetched.push(key);
      const match = Object.keys(PAGE_CONTENT).find((loc) => key.endsWith(loc));
      if (match === undefined) {
        return new Response("", { status: 404 });
      }
      return new Response(PAGE_CONTENT[match], { status: 200 });
    };
    store.manifest = makeManifest();
  });

  afterEach(() => {
    globalThis.fetch = savedFetch;
    store.manifest = savedManifest;
  });

  describe("naming and descriptions", () => {
    it("uses the site name, falling back to Untitled Skeleton", () => {
      expect(SiteSkeletonGenerator.getSiteMetaName(makeManifest())).to.equal(
        "skeleton-site",
      );
      expect(SiteSkeletonGenerator.getSiteMetaName({})).to.equal(
        "Untitled Skeleton",
      );
      expect(
        SiteSkeletonGenerator.getSiteMetaName({ metadata: { site: {} } }),
      ).to.equal("Untitled Skeleton");
    });

    it("describes the template from the description, then the title", () => {
      expect(
        SiteSkeletonGenerator.getSiteDescription({
          description: "Desc",
          title: "Title",
        }),
      ).to.equal("Template based on Desc");
      expect(
        SiteSkeletonGenerator.getSiteDescription({ title: "Title" }),
      ).to.equal("Template based on Title");
      expect(SiteSkeletonGenerator.getSiteDescription({})).to.equal(
        "Template based on HAX Site",
      );
    });
  });

  describe("site settings", () => {
    it("drops empty values and resets instance-specific settings", () => {
      const settings =
        SiteSkeletonGenerator.extractSiteSettings(makeManifest());
      expect(settings.lang).to.equal("en");
      expect(settings.publishPagesOn).to.equal(true);
      // never carry the source site's analytics id or canonical override
      expect(settings.gaID).to.equal("");
      expect(settings.canonical).to.equal(true);
      expect(settings).to.not.have.property("emptyString");
      expect(settings).to.not.have.property("emptyArray");
      expect(settings).to.not.have.property("emptyObject");
      expect(settings).to.not.have.property("nullValue");
    });

    it("still sets the reset defaults when the site has no settings", () => {
      expect(SiteSkeletonGenerator.extractSiteSettings({})).to.deep.equal({
        canonical: true,
        gaID: "",
      });
    });

    it("cleanSiteSettings removes timestamps without touching the input", () => {
      const original = { lang: "en", created: 1, updated: 2 };
      const cleaned = SiteSkeletonGenerator.cleanSiteSettings(original);
      expect(cleaned).to.deep.equal({ lang: "en" });
      expect(original).to.deep.equal({ lang: "en", created: 1, updated: 2 });
    });

    it("extractSiteMetadata copies licensing / platform and cleans settings", () => {
      const meta = SiteSkeletonGenerator.extractSiteMetadata(makeManifest());
      expect(meta.site.category).to.deep.equal(["course"]);
      expect(meta.site.tags).to.deep.equal(["demo", "tests"]);
      expect(meta.site.settings).to.not.have.property("created");
      expect(meta.site.settings).to.not.have.property("updated");
      expect(meta.licensing).to.deep.equal({ name: "CC BY" });
      expect(meta.platform).to.deep.equal({ audience: "everyone" });
      expect(SiteSkeletonGenerator.extractSiteMetadata({})).to.deep.equal({
        site: { category: [], tags: [], settings: {} },
        licensing: {},
        node: {},
        platform: {},
      });
    });

    it("reads categories and tags with empty fallbacks", () => {
      expect(
        SiteSkeletonGenerator.extractSiteCategories(makeManifest()),
      ).to.deep.equal(["course"]);
      expect(
        SiteSkeletonGenerator.extractSiteTags(makeManifest()),
      ).to.deep.equal(["demo", "tests"]);
      expect(SiteSkeletonGenerator.extractSiteCategories({})).to.deep.equal([]);
      expect(SiteSkeletonGenerator.extractSiteTags({})).to.deep.equal([]);
    });
  });

  describe("theme", () => {
    it("keeps the theme element, variables and any custom theme keys", () => {
      const theme =
        SiteSkeletonGenerator.extractThemeConfiguration(makeManifest());
      expect(theme.element).to.equal("polaris-flex-theme");
      expect(theme.variables).to.deep.equal({ hexCode: "#123456" });
      expect(theme.settings.hexCode).to.equal("#abcdef");
      expect(theme.settings.icon).to.equal("icons:home");
      // non-standard keys pass through untouched
      expect(theme.settings.regions).to.deep.equal({ header: [] });
      // standard keys are not duplicated as custom ones
      expect(
        SiteSkeletonGenerator.extractCustomThemeProperties({
          element: "x",
          variables: {},
          hexCode: "#000",
          cssVariable: "--a",
          icon: "i",
          image: "img",
          extra: 1,
        }),
      ).to.deep.equal({ extra: 1 });
    });

    it("falls back to clean-one when the site has no theme", () => {
      const theme = SiteSkeletonGenerator.extractThemeConfiguration({});
      expect(theme.element).to.equal("clean-one");
      expect(theme.variables).to.deep.equal({});
    });
  });

  describe("page metadata", () => {
    it("getMetadataValue returns the default only when the key is missing", () => {
      const item = { metadata: { published: false, tags: [] } };
      expect(
        SiteSkeletonGenerator.getMetadataValue(item, "published", true),
      ).to.equal(false);
      expect(
        SiteSkeletonGenerator.getMetadataValue(item, "hideInMenu", false),
      ).to.equal(false);
      expect(
        SiteSkeletonGenerator.getMetadataValue({}, "tags", ["x"]),
      ).to.deep.equal(["x"]);
    });

    it("extractRelevantMetadata keeps only the template fields", () => {
      expect(
        SiteSkeletonGenerator.extractRelevantMetadata({
          wordCount: 0,
          difficulty: "hard",
          audience: "staff",
          contentType: "lesson",
          created: 1,
          updated: 2,
          locked: true,
          images: ["a.png"],
        }),
      ).to.deep.equal({
        wordCount: 0,
        difficulty: "hard",
        audience: "staff",
        contentType: "lesson",
      });
    });
  });

  describe("file references", () => {
    it("lists quoted files/ paths that end in an extension", () => {
      const refs = SiteSkeletonGenerator.extractFileReferences(
        '<img src="files/a/b.png"><a href="files/doc.pdf">d</a>' +
          '<a href="files/folder/">no extension</a>' +
          '<a href="https://example.com/files/x.png">remote</a>',
        "files/",
      );
      expect(refs.map((r) => r.path)).to.deep.equal(["a/b.png", "doc.pdf"]);
    });

    it("extractSiteFiles collects and de-duplicates across every page", async () => {
      const files = await SiteSkeletonGenerator.extractSiteFiles();
      expect(files.slice().sort()).to.deep.equal([
        "docs/syllabus.pdf",
        "images/cover.png",
        "media/clip.mp4",
      ]);
    });
  });

  describe("site structure", () => {
    it("gives every page a fresh id and remaps parents to the new ids", async () => {
      const manifest = makeManifest();
      const structure = await SiteSkeletonGenerator.extractSiteStructure(
        manifest.items,
      );
      expect(structure.length).to.equal(manifest.items.length);
      const newIds = structure.map((s) => s.id);
      expect(new Set(newIds).size).to.equal(newIds.length);
      newIds.forEach((id, i) => {
        expect(id).to.match(UUID_RE);
        expect(id).to.not.equal(manifest.items[i].id);
      });
      const byTitle = {};
      structure.forEach((s) => {
        byTitle[s.title] = s;
      });
      expect(byTitle["Root"].parent).to.equal(null);
      expect(byTitle["Second"].parent).to.equal(null);
      expect(byTitle["Child A"].parent).to.equal(byTitle["Root"].id);
      expect(byTitle["Child B"].parent).to.equal(byTitle["Root"].id);
      expect(byTitle["Grandchild"].parent).to.equal(byTitle["Child B"].id);
      // array order, slugs and indent are kept so parents come first
      expect(structure.map((s) => s.slug)).to.deep.equal(
        manifest.items.map((i) => i.slug),
      );
      expect(structure.map((s) => s.indent)).to.deep.equal([0, 1, 1, 2, 0]);
    });

    it("carries page content and the template metadata defaults", async () => {
      const structure = await SiteSkeletonGenerator.extractSiteStructure(
        makeManifest().items,
      );
      expect(structure[0].content).to.equal(
        PAGE_CONTENT["pages/root/index.html"],
      );
      expect(structure[4].content).to.equal("");
      expect(structure[0].metadata).to.deep.equal({
        published: false,
        hideInMenu: false,
        tags: ["intro"],
        wordCount: 12,
        difficulty: "easy",
      });
      // unspecified metadata gets template defaults
      expect(structure[1].metadata).to.deep.equal({
        published: true,
        hideInMenu: false,
        tags: [],
      });
      expect(structure[2].metadata.hideInMenu).to.equal(true);
    });

    it("keeps non-zero orders as they are", async () => {
      const structure = await SiteSkeletonGenerator.extractSiteStructure(
        makeManifest().items,
      );
      // Child B and Second have order 1
      expect(structure[2].order).to.equal(1);
      expect(structure[4].order).to.equal(1);
      expect(structure[0].order).to.equal(0);
    });

    // an explicit order of 0 is kept even when the page is not first
    it("keeps order 0 for first children that are not first in the manifest", async () => {
      const structure = await SiteSkeletonGenerator.extractSiteStructure(
        makeManifest().items,
      );
      expect(structure.map((s) => s.order)).to.deep.equal([0, 0, 1, 0, 1]);
    });
  });

  describe("content id rewriting", () => {
    const tag = "skeleton-hook-probe";
    before(() => {
      if (!globalThis.customElements.get(tag)) {
        globalThis.customElements.define(
          tag,
          class extends HTMLElement {
            haxHooks() {
              return { siteToSkeleton: "haxsiteToSkeleton" };
            }
            haxsiteToSkeleton(details) {
              const old = this.getAttribute("item-id");
              if (details.uuidMap.has(old)) {
                this.setAttribute("item-id", details.uuidMap.get(old));
              }
              this.setAttribute("direction", details.direction);
            }
          },
        );
      }
      if (!globalThis.customElements.get(`${tag}-broken`)) {
        globalThis.customElements.define(
          `${tag}-broken`,
          class extends HTMLElement {
            haxHooks() {
              return { siteToSkeleton: "haxsiteToSkeleton" };
            }
            haxsiteToSkeleton() {
              throw new Error("hook failure");
            }
          },
        );
      }
    });

    it("lets elements with a siteToSkeleton hook rewrite their page ids", () => {
      const map = new Map([["old-1", "new-1"]]);
      const out = SiteSkeletonGenerator.rewriteContentUuids(
        `<p>x</p><${tag} item-id="old-1"></${tag}><${tag} item-id="other"></${tag}>`,
        map,
      );
      expect(out).to.contain('item-id="new-1"');
      expect(out).to.contain('item-id="other"');
      expect(out).to.contain('direction="site-to-skeleton"');
      expect(out).to.not.contain("old-1");
    });

    it("leaves content alone when nothing has the hook", () => {
      const html = '<p>plain</p><unknown-tag item-id="old-1"></unknown-tag>';
      expect(
        SiteSkeletonGenerator.rewriteContentUuids(
          html,
          new Map([["old-1", "new-1"]]),
        ),
      ).to.equal(html);
    });

    it("returns empty and non-string content as is", () => {
      const map = new Map();
      expect(SiteSkeletonGenerator.rewriteContentUuids("", map)).to.equal("");
      expect(SiteSkeletonGenerator.rewriteContentUuids("   ", map)).to.equal(
        "   ",
      );
      expect(SiteSkeletonGenerator.rewriteContentUuids(null, map)).to.equal(
        null,
      );
    });

    it("keeps going when one element's hook throws", () => {
      const map = new Map([["old-1", "new-1"]]);
      const out = SiteSkeletonGenerator.rewriteContentUuids(
        `<${tag}-broken item-id="old-1"></${tag}-broken><${tag} item-id="old-1"></${tag}>`,
        map,
      );
      expect(out).to.contain(`<${tag} item-id="new-1"`);
    });

    it("rewrites ids in page content to the new structure ids", async () => {
      PAGE_CONTENT["pages/second/index.html"] =
        `<${tag} item-id="childB"></${tag}>`;
      try {
        const structure = await SiteSkeletonGenerator.extractSiteStructure(
          makeManifest().items,
        );
        expect(structure[4].content).to.contain(`item-id="${structure[2].id}"`);
      } finally {
        PAGE_CONTENT["pages/second/index.html"] = "";
      }
    });
  });

  describe("generateFromCurrentSite", () => {
    it("throws when there is no site loaded", async () => {
      store.manifest = {};
      let error = null;
      try {
        await SiteSkeletonGenerator.generateFromCurrentSite(true);
      } catch (e) {
        error = e;
      }
      expect(error).to.be.an("error");
      expect(error.message).to.contain("No site data");
    });

    it("builds a skeleton in the createSite shape", async () => {
      const skeleton = await SiteSkeletonGenerator.generateFromCurrentSite();
      expect(Object.keys(skeleton).sort()).to.deep.equal([
        "_skeleton",
        "build",
        "meta",
        "site",
        "theme",
      ]);
      expect(skeleton.meta.type).to.equal("skeleton");
      expect(skeleton.meta.name).to.equal("skeleton-site");
      expect(skeleton.meta.machineName).to.equal("skeleton-site");
      expect(skeleton.meta.priority).to.equal(0);
      expect(skeleton.meta.version).to.equal("1.0.0");
      expect(skeleton.meta.description).to.equal(
        "Template based on A site to copy",
      );
      expect(skeleton.meta.category).to.deep.equal(["course"]);
      expect(skeleton.meta.tags).to.deep.equal(["demo", "tests"]);
      expect(skeleton.meta.useCaseImage).to.contain(
        "theme-polaris-flex-theme-thumb.jpg",
      );
      expect(Number.isNaN(Date.parse(skeleton.meta.created))).to.equal(false);

      expect(skeleton.site.name).to.equal("skeleton-site");
      expect(skeleton.site.theme).to.equal("polaris-flex-theme");
      expect(skeleton.site.settings.gaID).to.equal("");
      expect(skeleton.site.settings.canonical).to.equal(true);
      expect(skeleton.site.platform).to.deep.equal({ audience: "everyone" });

      expect(skeleton.build.type).to.equal("skeleton");
      expect(skeleton.build.structure).to.equal("from-skeleton");
      expect(skeleton.build.items.length).to.equal(5);
      expect(skeleton.build.files.map((f) => f.path).sort()).to.deep.equal([
        "docs/syllabus.pdf",
        "images/cover.png",
        "media/clip.mp4",
      ]);

      // theme variables and settings are merged for createSite
      expect(skeleton.theme.hexCode).to.equal("#abcdef");
      expect(skeleton.theme.icon).to.equal("icons:home");
      expect(skeleton._skeleton.fullThemeConfig).to.deep.equal({
        element: "polaris-flex-theme",
        variables: { hexCode: "#123456" },
      });
    });

    it("leaves the source site's timestamps out of site.settings", async () => {
      const skeleton = await SiteSkeletonGenerator.generateFromCurrentSite();
      expect(skeleton.site.settings).to.not.have.property("created");
      expect(skeleton.site.settings).to.not.have.property("updated");
    });

    it("does not change the live site manifest", async () => {
      const before = JSON.stringify(toJS(store.manifest));
      await SiteSkeletonGenerator.generateFromCurrentSite();
      expect(JSON.stringify(toJS(store.manifest))).to.equal(before);
    });

    it("skips the large-site confirmation when already confirmed", async () => {
      const items = [];
      for (let i = 0; i < 25; i++) {
        items.push(page(`p${i}`, `Page ${i}`, null, i, 0));
      }
      store.manifest = makeManifest({ items });
      const skeleton =
        await SiteSkeletonGenerator.generateFromCurrentSite(true);
      expect(skeleton.build.items.length).to.equal(25);
    });
  });

  describe("download and app-hax helpers", () => {
    it("serialises the skeleton as a JSON blob", async () => {
      const skeleton = { meta: { name: "x" }, build: { items: [] } };
      const blob = SiteSkeletonGenerator.generateDownloadableFile(skeleton);
      expect(blob.type).to.equal("application/json");
      expect(JSON.parse(await blob.text())).to.deep.equal(skeleton);
    });

    it("names the download from a filesystem-safe version of the name", () => {
      let downloaded = null;
      const onClick = (e) => {
        if (e.target && e.target.tagName === "A" && e.target.download) {
          downloaded = e.target.download;
          e.preventDefault();
        }
      };
      document.addEventListener("click", onClick, true);
      try {
        SiteSkeletonGenerator.downloadSkeleton({
          meta: { name: "My Course: Unit 1/2" },
        });
        expect(downloaded).to.equal("my-course--unit-1-2-skeleton.json");
        SiteSkeletonGenerator.downloadSkeleton(
          { meta: { name: "ignored" } },
          "custom.json",
        );
        expect(downloaded).to.equal("custom.json");
      } finally {
        document.removeEventListener("click", onClick, true);
      }
    });
  });
});

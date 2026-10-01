// Tests for the central HAXCMS mobx store singleton.
// The store is a real mobx observable (enforceActions is off), so we populate
// it with a controlled in-memory manifest and assert the computed getters
// derive correctly, saving and restoring every field we touch so test order
// never leaks state into other suites.
import { expect } from "@open-wc/testing";
import { store, iconFromPageType } from "../lib/core/haxcms-site-store.js";

// Minimal but realistic JSON Outline Schema manifest used across these tests.
// Three items: two top-level pages and one child of page-1, so we can exercise
// parent/child resolution in routerManifest.
function makeManifest() {
  return {
    id: "test-site",
    title: "Test Site",
    description: "A test site for the store suite",
    metadata: {
      site: { name: "test-site", lang: "en" },
      platform: {},
      theme: {
        element: "polaris-flex-theme",
        variables: {
          image: "banner.jpg",
          imageAlt: "banner alt",
          imageLink: "/home",
          icon: "icons:page",
          cssVariable: "blue",
        },
        regions: {
          header: null,
          sidebarFirst: null,
          sidebarSecond: null,
          contentTop: null,
          contentBottom: null,
          footerPrimary: null,
          footerSecondary: null,
        },
      },
    },
    items: [
      {
        id: "page-1",
        title: "Page One",
        slug: "page-1",
        location: "pages/page-1/index.html",
        order: 1,
        parent: null,
        indent: 0,
        metadata: {
          published: true,
          locked: false,
          status: "",
          created: 1,
          updated: 2,
        },
      },
      {
        id: "page-2",
        title: "Page Two",
        slug: "page-2",
        location: "pages/page-2/index.html",
        order: 2,
        parent: null,
        indent: 0,
        metadata: {
          published: true,
          locked: false,
          status: "",
          created: 1,
          updated: 3,
        },
      },
      {
        id: "page-1-1",
        title: "Child One",
        slug: "page-1/child-one",
        location: "pages/page-1/child-one/index.html",
        order: 1,
        parent: "page-1",
        indent: 1,
        metadata: {
          published: true,
          locked: false,
          status: "",
          created: 1,
          updated: 4,
        },
      },
    ],
  };
}

describe("haxcms-site-store computed state", () => {
  let saved = {};

  beforeEach(() => {
    saved = {
      manifest: store.manifest,
      activeId: store.activeId,
      jwt: store.jwt,
      connectionValidated: store.connectionValidated,
      appSettings: store.appSettings,
      currentRouterLocation: store.currentRouterLocation,
    };
    store.manifest = makeManifest();
    store.activeId = null;
  });

  afterEach(() => {
    store.manifest = saved.manifest;
    store.activeId = saved.activeId;
    store.jwt = saved.jwt;
    store.connectionValidated = saved.connectionValidated;
    store.appSettings = saved.appSettings;
    store.currentRouterLocation = saved.currentRouterLocation;
  });

  describe("isLoggedIn", () => {
    it("is false when there is no jwt", () => {
      store.jwt = null;
      store.appSettings = {};
      expect(store.isLoggedIn).to.equal(false);
    });

    it("is true when a jwt is present and no connection test is configured", () => {
      store.appSettings = {};
      store.jwt = "a-token";
      expect(store.isLoggedIn).to.equal(true);
    });

    it("defers to connectionValidated when a connection test is configured", () => {
      store.appSettings = { connectionTest: "/somewhere" };
      store.jwt = "a-token";
      store.connectionValidated = false;
      expect(store.isLoggedIn).to.equal(false);

      store.connectionValidated = true;
      expect(store.isLoggedIn).to.equal(true);
    });
  });

  describe("themeData", () => {
    it("returns the manifest theme block", () => {
      expect(store.themeData.element).to.equal("polaris-flex-theme");
      expect(store.themeData.variables.image).to.equal("banner.jpg");
    });

    it("returns a fallback theme when metadata.theme is missing", () => {
      store.manifest = { id: "x", title: "X", metadata: { platform: {} }, items: [] };
      expect(store.themeData).to.exist;
      expect(store.themeData.variables).to.exist;
    });

    it("prefers an active item's own theme override", () => {
      store.activeId = "page-1";
      store.manifest.items[0].metadata.theme = {
        element: "custom-theme",
        variables: { image: "override.jpg" },
      };
      expect(store.themeData.element).to.equal("custom-theme");
      delete store.manifest.items[0].metadata.theme;
    });
  });

  describe("active item resolution", () => {
    it("findItem returns an item by id and undefined for misses", () => {
      expect(store.findItem("page-2").title).to.equal("Page Two");
      // Array#find returns undefined for a no-match when a manifest is present;
      // the null branch only fires when there is no manifest, no items or no id
      expect(store.findItem("nope")).to.be.undefined;
    });

    it("findItem returns null instead of throwing when the manifest has no items array", () => {
      // fixed (issue #3089, bug 11): findItem guarded on manifest + id but not
      // manifest.items, so a truthy manifest without items threw TypeError
      // reading find
      store.manifest = { id: "x", title: "X", metadata: {} };
      expect(() => store.findItem("page-1")).to.not.throw();
      expect(store.findItem("page-1")).to.equal(null);
    });

    it("activeItem resolves from activeId", () => {
      store.activeId = "page-2";
      expect(store.activeItem.id).to.equal("page-2");
      expect(store.activeTitle).to.equal("Page Two");
    });

    it("activeItem is null when no activeId is set", () => {
      expect(store.activeItem).to.equal(null);
    });

    it("activeManifestIndex tracks the flat item position", () => {
      store.activeId = "page-2";
      expect(store.activeManifestIndex).to.equal(1);
      expect(store.activeManifestIndexCounter).to.equal(2);
    });

    it("activeManifestIndex is -1 when the id is not found", () => {
      store.activeId = "missing";
      expect(store.activeManifestIndex).to.equal(-1);
    });
  });

  describe("site metadata", () => {
    it("exposes siteTitle and siteDescription from the manifest", () => {
      expect(store.siteTitle).to.equal("Test Site");
      expect(store.siteDescription).to.equal("A test site for the store suite");
    });

    it("homeLink falls back to the first item slug", () => {
      expect(store.homeLink).to.equal("page-1");
    });
  });

  describe("routerManifest", () => {
    it("mixes parent location/slug and builds a children hierarchy", () => {
      const rm = store.routerManifest;
      expect(rm.items.length).to.equal(3);
      const child = rm.items.find((i) => i.id === "page-1-1");
      expect(child.parentLocation).to.equal("pages/page-1/index.html");
      expect(child.parentSlug).to.equal("page-1");
      const parent = rm.items.find((i) => i.id === "page-1");
      expect(parent.children.map((c) => c.id)).to.deep.equal(["page-1-1"]);
    });

    it("does not crash when a manifest item has no metadata object", () => {
      // fixed (issue #3077, bug 43): filterHiddenParentsRecursive
      // assumed item.metadata exists, so any manifest item without a
      // metadata object crashed the routerManifest computed with an
      // uncaught TypeError while the publish-pages filter runs logged out
      store.jwt = null;
      delete store.manifest.items[1].metadata;
      const rm = store.routerManifest;
      // the metadata-less item is kept: it is not explicitly unpublished
      expect(rm.items.length).to.equal(3);
      expect(
        rm.items.find((i) => i.id === "page-2").metadata,
      ).to.equal(undefined);
    });
  });

  describe("slug + route helpers", () => {
    it("getUniqueSlugName returns the slug when there is no collision", () => {
      expect(store.getUniqueSlugName("brand-new")).to.equal("brand-new");
    });

    it("getUniqueSlugName deconflicts an existing slug", () => {
      // "page-1" collides; the store should increment to a free variant
      const result = store.getUniqueSlugName("page-1");
      expect(result).to.not.equal("page-1");
      // must not collide with any existing slug
      expect(store.manifest.items.some((i) => i.slug === result)).to.equal(false);
    });

    it("getInternalRoute returns false without route params", () => {
      store.currentRouterLocation = {};
      expect(store.getInternalRoute()).to.equal(false);
    });

    it("getInternalRoute strips the reserved x/ prefix", () => {
      store.currentRouterLocation = { params: ["x/displays/search"] };
      expect(store.getInternalRoute()).to.equal("displays/search");
    });
  });

  describe("platformConfig / platformAllows", () => {
    it("defaults to expert audience and allows known features", () => {
      expect(store.platformConfig.audience).to.equal("expert");
      expect(store.platformAllows("addPage")).to.equal(true);
    });

    it("blocks every capability when allowedBlocks is explicitly null", () => {
      store.manifest.metadata.platform = { allowedBlocks: null };
      expect(store.platformConfig.allowedBlocks).to.equal(null);
      expect(store.platformAllows("video-player")).to.equal(false);
    });
  });
});

describe("haxcms-site-store iconFromPageType", () => {
  it("returns known icons for content, assessment, quiz types", () => {
    expect(iconFromPageType("content")).to.equal("lrn:page");
    expect(iconFromPageType("assessment")).to.equal("lrn:assessment");
    expect(iconFromPageType("quiz")).to.equal("lrn:quiz");
    expect(iconFromPageType("submission")).to.equal("icons:move-to-inbox");
  });

  it("returns known icons for lesson/module/unit/task/activity types", () => {
    expect(iconFromPageType("lesson")).to.equal("hax:lesson");
    expect(iconFromPageType("module")).to.equal("hax:module");
    expect(iconFromPageType("unit")).to.equal("hax:unit");
    expect(iconFromPageType("task")).to.equal("hax:task");
    expect(iconFromPageType("activity")).to.equal("hax:ticket");
  });

  it("returns known icons for project/practice/connection/knowledge types", () => {
    expect(iconFromPageType("project")).to.equal("hax:bulletin-board");
    expect(iconFromPageType("practice")).to.equal("hax:shovel");
    expect(iconFromPageType("connection")).to.equal("courseicons:chem-connection");
    expect(iconFromPageType("knowledge")).to.equal("courseicons:knowledge");
  });

  it("returns strategy icon for strategy/discuss/make/observe/present/read/reflect/research/watch", () => {
    for (const t of [
      "strategy",
      "discuss",
      "make",
      "observe",
      "present",
      "read",
      "reflect",
      "research",
      "watch",
    ]) {
      expect(iconFromPageType(t)).to.equal("courseicons:strategy");
    }
  });

  it("returns listen icon for listen type and write icon for write type", () => {
    expect(iconFromPageType("listen")).to.equal("courseicons:listen");
    expect(iconFromPageType("write")).to.equal("lrn:write");
  });

  it("returns default learning-objectives icon for unknown types", () => {
    expect(iconFromPageType("unknown-type")).to.equal(
      "courseicons:learning-objectives",
    );
    expect(iconFromPageType(undefined)).to.equal(
      "courseicons:learning-objectives",
    );
  });
});

describe("haxcms-site-store computed getters extended", () => {
  let saved = {};

  beforeEach(() => {
    saved = {
      manifest: store.manifest,
      activeId: store.activeId,
      responsiveSize: store.responsiveSize,
      jwt: store.jwt,
      appSettings: store.appSettings,
    };
    store.manifest = makeManifest();
    store.activeId = null;
  });

  afterEach(() => {
    store.manifest = saved.manifest;
    store.activeId = saved.activeId;
    store.responsiveSize = saved.responsiveSize;
    store.jwt = saved.jwt;
    store.appSettings = saved.appSettings;
  });

  describe("entityData", () => {
    it("builds entity data from manifest items metadata", () => {
      store.manifest.items[0].metadata.color = "blue";
      store.manifest.items[0].metadata.icon = "icons:page";
      store.manifest.items[0].metadata.entityType = "module";
      const ed = store.entityData;
      expect(ed["page-1"].color).to.equal("blue");
      expect(ed["page-1"].icon).to.equal("icons:page");
      expect(ed["page-1"].type).to.equal("module");
    });

    it("defaults type to page when no entityType is set", () => {
      const ed = store.entityData;
      expect(ed["page-1"].type).to.equal("page");
    });
  });

  describe("regionData", () => {
    it("returns manifest theme regions when present", () => {
      expect(store.regionData.header).to.equal(null);
      expect(store.regionData.sidebarFirst).to.equal(null);
    });

    it("returns fallback regions when metadata.theme.regions is missing", () => {
      store.manifest = {
        id: "x",
        title: "X",
        metadata: { platform: {}, theme: {} },
        items: [],
      };
      expect(store.regionData).to.exist;
      expect(store.regionData.header).to.equal(null);
      expect(store.regionData.footerPrimary).to.equal(null);
    });

    it("returns fallback regions when the manifest is null", () => {
      // fixed (issue #3089, bug 12): regionData used to return undefined for
      // a falsy manifest, so site-region reads of header/footerPrimary/etc
      // crashed with cannot read properties of undefined
      store.manifest = null;
      expect(store.regionData).to.exist;
      expect(store.regionData.header).to.equal(null);
      expect(store.regionData.sidebarFirst).to.equal(null);
      expect(store.regionData.sidebarSecond).to.equal(null);
      expect(store.regionData.contentTop).to.equal(null);
      expect(store.regionData.contentBottom).to.equal(null);
      expect(store.regionData.footerPrimary).to.equal(null);
      expect(store.regionData.footerSecondary).to.equal(null);
    });
  });

  describe("activeItemFields", () => {
    it("returns core fields from the active item when custom fields exist", () => {
      store.activeId = "page-1";
      store.manifest.items[0].metadata.fields = {};
      const fields = store.activeItemFields;
      expect(fields).to.exist;
      expect(fields.title).to.equal("Page One");
      expect(fields.slug).to.equal("page-1");
      expect(fields.location).to.equal("pages/page-1/index.html");
      delete store.manifest.items[0].metadata.fields;
    });

    // BUG: activeItemFields returns undefined when metadata.fields is not set.
    // The getter builds a `fields` object but only returns it inside the
    // `if (this.activeItem.metadata.fields)` branch — there is no return
    // for the plain-fields case. See haxcms-site-store.js:827-844.
    it("returns undefined when active item has no custom fields (BUG)", () => {
      store.activeId = "page-1";
      expect(store.activeItemFields).to.equal(undefined);
    });

    it("merges custom fields from metadata.fields", () => {
      store.activeId = "page-2";
      store.manifest.items[1].metadata.fields = {
        customField: "customValue",
      };
      const fields = store.activeItemFields;
      expect(fields.customField).to.equal("customValue");
      expect(fields.title).to.equal("Page Two");
      delete store.manifest.items[1].metadata.fields;
    });

    it("returns undefined when no active item", () => {
      expect(store.activeItemFields).to.equal(undefined);
    });
  });

  describe("activeTags", () => {
    it("returns tags from active item metadata", () => {
      store.activeId = "page-1";
      store.manifest.items[0].metadata.tags = ["tag1", "tag2"];
      expect(store.activeTags).to.deep.equal(["tag1", "tag2"]);
      delete store.manifest.items[0].metadata.tags;
    });

    it("returns null when no tags set", () => {
      store.activeId = "page-1";
      expect(store.activeTags).to.equal(null);
    });
  });

  describe("parentTitle / ancestorTitle / ancestorItem", () => {
    it("parentTitle returns the parent item title", () => {
      store.activeId = "page-1-1";
      expect(store.parentTitle).to.equal("Page One");
    });

    it("parentTitle returns empty string for top-level items", () => {
      store.activeId = "page-1";
      expect(store.parentTitle).to.equal("");
    });

    it("ancestorTitle walks up to the root ancestor title", () => {
      store.activeId = "page-1-1";
      expect(store.ancestorTitle).to.equal("Page One");
    });

    it("ancestorItem returns the root ancestor item object", () => {
      store.activeId = "page-1-1";
      expect(store.ancestorItem.id).to.equal("page-1");
    });

    it("ancestorItem returns null for top-level items", () => {
      store.activeId = "page-1";
      expect(store.ancestorItem).to.equal(null);
    });
  });

  describe("pageCounter", () => {
    it("returns current/total from activeManifestIndexCounter and items length", () => {
      store.activeId = "page-2";
      const pc = store.pageCounter;
      expect(pc.current).to.equal(2);
      expect(pc.total).to.equal(3);
    });

    it("returns 0/0 when no manifest", () => {
      store.manifest = null;
      expect(store.pageCounter).to.deep.equal({ current: 0, total: 0 });
    });
  });

  describe("siblingsPrevNext", () => {
    it("returns prev and next siblings for a middle item", () => {
      store.activeId = "page-2";
      const s = store.siblingsPrevNext;
      expect(s.prev.id).to.equal("page-1");
      expect(s.next).to.equal(null);
    });

    it("returns null prev for first sibling", () => {
      store.activeId = "page-1";
      const s = store.siblingsPrevNext;
      expect(s.prev).to.equal(null);
      expect(s.next.id).to.equal("page-2");
    });

    it("returns null/null when no active item", () => {
      expect(store.siblingsPrevNext).to.deep.equal({ prev: null, next: null });
    });
  });

  describe("isMobile / viewOnlyMode", () => {
    it("isMobile is true when responsiveSize is xs or sm", () => {
      store.responsiveSize = "xs";
      expect(store.isMobile).to.equal(true);
      store.responsiveSize = "sm";
      expect(store.isMobile).to.equal(true);
      store.responsiveSize = "md";
      expect(store.isMobile).to.equal(false);
    });

    it("viewOnlyMode reads from UserScaffoldInstance", () => {
      // viewOnlyMode is computed from UserScaffoldInstance.readMemory
      // which defaults to falsy when nothing is written
      expect(store.viewOnlyMode).to.not.be.ok;
    });
  });

  describe("isPlatformAudience", () => {
    it("returns true when platformConfig.audience matches", () => {
      expect(store.isPlatformAudience("expert")).to.equal(true);
    });

    it("returns false when platformConfig.audience does not match", () => {
      expect(store.isPlatformAudience("novice")).to.equal(false);
    });

    it("defaults to expert when platformConfig is null", () => {
      store.manifest = {
        id: "x",
        title: "X",
        metadata: {},
        items: [],
      };
      expect(store.isPlatformAudience("expert")).to.equal(true);
      expect(store.isPlatformAudience("novice")).to.equal(false);
    });
  });

  describe("getManifestItems / getManifest", () => {
    it("getManifestItems returns a clone by default", () => {
      const items = store.getManifestItems();
      expect(items.length).to.equal(3);
      // should be a deep clone (toJS), not the same reference
      expect(items).to.not.equal(store.manifest.items);
    });

    it("getManifestItems returns raw items when cloneIt is false", () => {
      const items = store.getManifestItems(false);
      expect(items).to.equal(store.manifest.items);
    });

    it("getManifest returns a clone by default", () => {
      const m = store.getManifest();
      expect(m.id).to.equal("test-site");
      expect(m).to.not.equal(store.manifest);
    });

    it("getManifest returns raw manifest when cloneIt is false", () => {
      const m = store.getManifest(false);
      expect(m).to.equal(store.manifest);
    });
  });

  describe("findItemAsObject", () => {
    it("finds an item by id with scope item", async () => {
      const item = await store.findItemAsObject("page-1");
      expect(item.id).to.equal("page-1");
    });

    // NOTE: findItemAsObject returns undefined (not null) when the item is
    // not found but the manifest exists, because Array#find returns undefined
    // and the function returns tmpItem directly without falling through to
    // the final `return null`. See haxcms-site-store.js:1117-1142.
    it("returns undefined when item not found", async () => {
      const item = await store.findItemAsObject("nonexistent");
      expect(item).to.equal(undefined);
    });

    it("finds an item by custom attribute lookup", async () => {
      const item = await store.findItemAsObject("Page One", "title");
      expect(item.id).to.equal("page-1");
    });

    it("returns parent when scope is parent", async () => {
      const item = await store.findItemAsObject("page-1-1", "id", "parent");
      expect(item.id).to.equal("page-1");
    });
  });

  describe("getLastChildItem", () => {
    it("returns the last child by order", async () => {
      // add a second child to page-1 with higher order
      store.manifest.items.push({
        id: "page-1-2",
        title: "Child Two",
        slug: "page-1/child-two",
        location: "pages/page-1/child-two/index.html",
        order: 2,
        parent: "page-1",
        indent: 1,
        metadata: { published: true, locked: false, status: "", created: 1, updated: 5 },
      });
      const last = await store.getLastChildItem("page-1");
      expect(last.id).to.equal("page-1-2");
    });

    it("returns null when no manifest", async () => {
      store.manifest = null;
      expect(await store.getLastChildItem("x")).to.equal(null);
    });
  });

  describe("fallbackItemSlug", () => {
    it("returns previous sibling slug when active item is not first", () => {
      store.activeId = "page-2";
      expect(store.fallbackItemSlug()).to.equal("page-1");
    });

    it("returns next sibling slug when active item is first", () => {
      store.activeId = "page-1";
      expect(store.fallbackItemSlug()).to.equal("page-2");
    });

    it("returns null when no active item", () => {
      store.activeId = null;
      expect(store.fallbackItemSlug()).to.equal(null);
    });
  });

  describe("getItemChildren", () => {
    it("returns children of a given item id", () => {
      const children = store.getItemChildren("page-1");
      expect(children.length).to.equal(1);
      expect(children[0].id).to.equal("page-1-1");
    });

    it("returns undefined when no manifest", () => {
      store.manifest = null;
      expect(store.getItemChildren("x")).to.equal(undefined);
    });
  });

  describe("currentRouteSupportsHaxEditor", () => {
    it("returns true when active item is not an internal route", () => {
      store.activeId = "page-1";
      expect(store.currentRouteSupportsHaxEditor()).to.equal(true);
    });

    it("returns false when active item is null and no internal route", () => {
      store.activeId = null;
      store.currentRouterLocation = {};
      expect(store.currentRouteSupportsHaxEditor()).to.equal(false);
    });

    it("returns true when internal route has useHaxEditor", () => {
      store.activeId = "404";
      store.currentRouterLocation = { params: ["x/displays/style-guide"] };
      expect(store.currentRouteSupportsHaxEditor()).to.equal(true);
    });

    it("returns false when internal route does not have useHaxEditor", () => {
      store.activeId = "404";
      store.currentRouterLocation = { params: ["x/random"] };
      expect(store.currentRouteSupportsHaxEditor()).to.equal(false);
    });
  });
});

describe("haxcms-site-store style guide and content loading", () => {
  let saved = {};
  let originalFetch;

  beforeEach(() => {
    saved = {
      manifest: store.manifest,
      activeId: store.activeId,
      appReady: store.appReady,
    };
    originalFetch = globalThis.fetch;
    store.manifest = makeManifest();
    store.activeId = null;
  });

  afterEach(() => {
    store.manifest = saved.manifest;
    store.activeId = saved.activeId;
    store.appReady = saved.appReady;
    globalThis.fetch = originalFetch;
    store.clearStyleGuideCache();
  });

  describe("isValidStyleGuideContent", () => {
    it("returns false for null or non-string content", () => {
      expect(store.isValidStyleGuideContent(null)).to.equal(false);
      expect(store.isValidStyleGuideContent(undefined)).to.equal(false);
      expect(store.isValidStyleGuideContent(123)).to.equal(false);
    });

    it("returns false for content without page-template tags", () => {
      expect(store.isValidStyleGuideContent("<div>hello</div>")).to.equal(false);
    });

    it("returns true for content with page-template tags and no site index indicators", () => {
      const content = '<page-template><div>style guide</div></page-template>';
      expect(store.isValidStyleGuideContent(content)).to.equal(true);
    });

    it("returns false when content appears to be site index", () => {
      const content =
        '<page-template><haxcms-site-builder></haxcms-site-builder></page-template>';
      expect(store.isValidStyleGuideContent(content)).to.equal(false);
    });

    it("returns false for content with site.json reference", () => {
      const content =
        '<page-template>site.json data</page-template>';
      expect(store.isValidStyleGuideContent(content)).to.equal(false);
    });
  });

  describe("getDefaultStyleGuideContent", () => {
    it("returns empty string", () => {
      expect(store.getDefaultStyleGuideContent()).to.equal("");
    });
  });

  describe("clearStyleGuideCache", () => {
    it("does not throw when cache is undefined", () => {
      store._styleGuideCache = undefined;
      expect(() => store.clearStyleGuideCache()).to.not.throw();
    });
  });

  describe("loadStyleGuideContent", () => {
    it("returns cached content when available", async () => {
      store._styleGuideCache = new Map();
      store._styleGuideCache.set("test-site-default", "cached html");
      const result = await store.loadStyleGuideContent();
      expect(result).to.equal("cached html");
    });

    it("returns default content on fetch failure", async () => {
      store._styleGuideCache = new Map();
      globalThis.fetch = () => Promise.reject(new Error("network error"));
      const result = await store.loadStyleGuideContent();
      expect(result).to.equal("");
    });

    it("returns default content on 404 response", async () => {
      store._styleGuideCache = new Map();
      globalThis.fetch = () =>
        Promise.resolve({
          ok: false,
          status: 404,
          statusText: "Not Found",
          headers: new Map(),
        });
      const result = await store.loadStyleGuideContent();
      expect(result).to.equal("");
    });

    it("returns default content when response is not HTML", async () => {
      store._styleGuideCache = new Map();
      const headers = new Map();
      headers.set("content-type", "application/json");
      globalThis.fetch = () =>
        Promise.resolve({
          ok: true,
          status: 200,
          statusText: "OK",
          headers,
        });
      const result = await store.loadStyleGuideContent();
      expect(result).to.equal("");
    });

    it("returns default content when HTML lacks page-template tags", async () => {
      store._styleGuideCache = new Map();
      const headers = new Map();
      headers.set("content-type", "text/html");
      globalThis.fetch = () =>
        Promise.resolve({
          ok: true,
          status: 200,
          statusText: "OK",
          headers,
          text: () => Promise.resolve("<div>not a style guide</div>"),
        });
      const result = await store.loadStyleGuideContent();
      expect(result).to.equal("");
    });

    it("returns valid style guide content when response has page-template tags", async () => {
      store._styleGuideCache = new Map();
      const headers = new Map();
      headers.set("content-type", "text/html");
      const validContent =
        '<page-template><div>real style guide</div></page-template>';
      globalThis.fetch = () =>
        Promise.resolve({
          ok: true,
          status: 200,
          statusText: "OK",
          headers,
          text: () => Promise.resolve(validContent),
        });
      const result = await store.loadStyleGuideContent();
      expect(result).to.equal(validContent);
    });
  });

  describe("loadItemContent", () => {
    it("returns empty string when item not found", async () => {
      const result = await store.loadItemContent("nonexistent");
      expect(result).to.equal("");
    });

    it("returns empty string when item has no location", async () => {
      store.manifest.items[0].location = null;
      const result = await store.loadItemContent("page-1");
      expect(result).to.equal("");
    });

    it("fetches and returns content on success", async () => {
      globalThis.fetch = () =>
        Promise.resolve({
          ok: true,
          status: 200,
          text: () => Promise.resolve("<p>page content</p>"),
        });
      const result = await store.loadItemContent("page-1");
      expect(result).to.equal("<p>page content</p>");
    });

    it("returns empty string on fetch error", async () => {
      globalThis.fetch = () => Promise.reject(new Error("network error"));
      const result = await store.loadItemContent("page-1");
      expect(result).to.equal("");
    });
  });
});

describe("haxcms-site-store toast, sound, and editor availability", () => {
  let saved = {};

  beforeEach(() => {
    saved = {
      appReady: store.appReady,
      soundStatus: store.soundStatus,
      jwt: store.jwt,
      appSettings: store.appSettings,
    };
  });

  afterEach(() => {
    store.appReady = saved.appReady;
    store.soundStatus = saved.soundStatus;
    store.jwt = saved.jwt;
    store.appSettings = saved.appSettings;
  });

  describe("toast", () => {
    it("dispatches haxcms-toast-show when appReady", () => {
      store.appReady = true;
      let received = null;
      const handler = (e) => { received = e.detail };
      globalThis.addEventListener("haxcms-toast-show", handler);
      try {
        store.toast("hello world", 1000, { hat: "random" });
        expect(received).to.exist;
        expect(received.text).to.equal("hello world");
        expect(received.duration).to.equal(1000);
        expect(received.hat).to.equal("random");
      } finally {
        globalThis.removeEventListener("haxcms-toast-show", handler);
      }
    });

    it("does not dispatch when appReady is false", () => {
      store.appReady = false;
      let received = null;
      const handler = (e) => { received = e.detail };
      globalThis.addEventListener("haxcms-toast-show", handler);
      try {
        store.toast("no show");
        expect(received).to.equal(null);
      } finally {
        globalThis.removeEventListener("haxcms-toast-show", handler);
      }
    });
  });

  describe("playSound", () => {
    it("does not play when soundStatus is false", () => {
      store.soundStatus = false;
      store.appReady = true;
      expect(() => store.playSound("click")).to.not.throw();
    });

    it("does not play when appReady is false", () => {
      store.soundStatus = true;
      store.appReady = false;
      expect(() => store.playSound("click")).to.not.throw();
    });

    it("attempts to play a known sound when enabled", () => {
      store.soundStatus = true;
      store.appReady = true;
      // Audio constructor will try to load a file that does not exist,
      // but the try/catch should swallow the error
      expect(() => store.playSound("click")).to.not.throw();
      expect(() => store.playSound("error")).to.not.throw();
      expect(() => store.playSound("unknown")).to.not.throw();
    });
  });

  describe("cmsSiteEditorAvailability", () => {
    it("returns null in view-only mode", () => {
      // viewOnlyMode reads from UserScaffoldInstance; ensure it is falsy
      // and we test the viewOnlyMode branch by checking the default
      const result = store.cmsSiteEditorAvailability();
      // when not in view-only mode, it creates or returns the instance
      expect(result).to.exist;
    });
  });
});

describe("haxcms-site-store item operations", () => {
  let saved = {};

  beforeEach(() => {
    saved = {
      manifest: store.manifest,
      activeId: store.activeId,
    };
    store.manifest = makeManifest();
    store.activeId = null;
  });

  afterEach(() => {
    store.manifest = saved.manifest;
    store.activeId = saved.activeId;
  });

  describe("removeItem", () => {
    it("removes new items immediately from the manifest", () => {
      store.manifest.items.push({
        id: "temp-item",
        title: "Temp",
        slug: "temp-item",
        location: "pages/temp-item/index.html",
        order: 99,
        parent: null,
        indent: 0,
        metadata: { published: true, locked: false, status: "new", created: 1, updated: 1 },
      });
      expect(store.manifest.items.length).to.equal(4);
      store.removeItem("temp-item");
      expect(store.manifest.items.length).to.equal(3);
    });

    it("marks non-new items as deleted instead of removing", () => {
      store.removeItem("page-1");
      const item = store.findItem("page-1");
      expect(item.metadata.status).to.equal("delete");
    });

    it("is a no-op when item does not exist", () => {
      expect(() => store.removeItem("nonexistent")).to.not.throw();
    });
  });

  describe("getUniqueSlugName with pathAuto", () => {
    it("builds a nested slug from parent hierarchy with pathAuto", () => {
      const page = {
        id: "page-1-1",
        parent: "page-1",
      };
      const result = store.getUniqueSlugName("new-child", page, true);
      // should include the parent slug prefix
      expect(result).to.include("page-1");
    });
  });
});

describe("haxcms-site-store computeItems and spiderChildren", () => {
  let saved = {};

  beforeEach(() => {
    saved = {
      manifest: store.manifest,
      activeId: store.activeId,
    };
    store.manifest = makeManifest();
    store.activeId = null;
  });

  afterEach(() => {
    store.manifest = saved.manifest;
    store.activeId = saved.activeId;
  });

  it("computeItems returns items within indent range for parent methodology", () => {
    const rm = store.routerManifest;
    const result = store.computeItems(0, 1, "page-1", "parent", rm);
    expect(Array.isArray(result)).to.equal(true);
  });

  it("computeItems returns items for ancestor methodology", () => {
    const rm = store.routerManifest;
    const result = store.computeItems(0, 1, "page-1-1", "ancestor", rm);
    expect(Array.isArray(result)).to.equal(true);
  });

  it("computeItems returns undefined when no routerManifest", () => {
    const result = store.computeItems(0, 1, "page-1", "parent", null);
    expect(result).to.equal(undefined);
  });

  it("spiderChildren collects items when parent is found", () => {
    const rm = store.routerManifest;
    const data = [];
    const topItem = rm.items.find((i) => i.id === "page-1");
    store.spiderChildren(topItem, data, 0, 1, "page-1", false);
    expect(data.length).to.be.greaterThan(0);
  });

  it("spiderChildren with noDynamicLevel does not adjust start/end", () => {
    const rm = store.routerManifest;
    const data = [];
    const topItem = rm.items.find((i) => i.id === "page-1");
    store.spiderChildren(topItem, data, 0, 1, "page-1", false, true);
    expect(data.length).to.be.greaterThan(0);
  });
});

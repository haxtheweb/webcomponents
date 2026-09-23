// Tests for the central HAXCMS mobx store singleton.
// The store is a real mobx observable (enforceActions is off), so we populate
// it with a controlled in-memory manifest and assert the computed getters
// derive correctly, saving and restoring every field we touch so test order
// never leaks state into other suites.
import { expect } from "@open-wc/testing";
import { store } from "../lib/core/haxcms-site-store.js";

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
      // the null branch only fires when there is no manifest or no id
      expect(store.findItem("nope")).to.be.undefined;
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

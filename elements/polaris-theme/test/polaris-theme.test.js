import { html } from "lit";
import { fixture, expect } from "@open-wc/testing";
import "../polaris-theme.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";

function makeManifest() {
  return {
    id: "polaris-test-site",
    title: "Polaris Test Site",
    description: "polaris theme test",
    metadata: {
      site: { name: "polaris-test-site" },
      platform: {},
      theme: {
        element: "polaris-theme",
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
        id: "p1",
        title: "Page One",
        slug: "page-one",
        location: "pages/page-one/index.html",
        order: 1,
        parent: null,
        indent: 0,
        metadata: { published: true, locked: false, status: "" },
      },
    ],
  };
}

describe("polaris-theme test", () => {
  let element;
  let savedManifest;
  let saved = {};
  let SiteActiveTitle;
  let SiteActiveTags;
  let origSiteActiveTitleUpdated;
  let origSiteActiveTagsUpdated;

  // Set up once for the whole file. A bare fixture does not bootstrap the
  // full HAX editor environment, so child components would otherwise throw
  // uncaught errors and fail the run:
  //  - <site-region> reads store.regionData, which is undefined when the
  //    manifest is null. Keep a manifest populated for the whole file so
  //    regionData resolves to an object.
  //  - <site-active-title> and <site-active-tags> call
  //    globalThis.HaxStore.requestAvailability() on an editMode toggle and
  //    abort/disconnect controllers that were never created; a bare fixture
  //    has no HaxStore. Neutralize those lifecycle hooks for the duration of
  //    this file (render + constructor autoruns still run).
  // The manifest intentionally omits theme.variables so the autorun in
  // polaris-theme.js that reads store.themeData.variables does not override
  // the element constructor defaults (image="", imageAlt="", imageLink="")
  // that several tests below assert.
  before(() => {
    savedManifest = store.manifest;
    store.manifest = makeManifest();
    SiteActiveTitle = customElements.get("site-active-title");
    SiteActiveTags = customElements.get("site-active-tags");
    origSiteActiveTitleUpdated = SiteActiveTitle.prototype.updated;
    origSiteActiveTagsUpdated = SiteActiveTags.prototype.updated;
    SiteActiveTitle.prototype.updated = function () {};
    SiteActiveTags.prototype.updated = function () {};
  });

  after(() => {
    store.manifest = savedManifest;
    SiteActiveTitle.prototype.updated = origSiteActiveTitleUpdated;
    SiteActiveTags.prototype.updated = origSiteActiveTagsUpdated;
  });

  beforeEach(async () => {
    saved = {
      activeId: store.activeId,
      editMode: store.editMode,
    };
    store.activeId = null;
    store.editMode = false;
    element = await fixture(html`<polaris-theme></polaris-theme>`);
  });

  afterEach(() => {
    store.activeId = saved.activeId;
    store.editMode = saved.editMode;
  });

  it("should exist as a custom element", () => {
    expect(customElements.get("polaris-theme")).to.exist;
  });

  it("should create an instance", () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("polaris-theme");
  });

  it("should have shadow DOM", () => {
    expect(element.shadowRoot).to.exist;
  });

  it("should have default properties", () => {
    expect(element.searchTerm).to.equal("");
    expect(element.imageAlt).to.equal("");
    expect(element.image).to.equal("");
    expect(element.imageLink).to.equal("");
    expect(element.editMode).to.be.false;
  });

  it("should update properties", async () => {
    element.searchTerm = "test search";
    element.imageAlt = "Test image";
    element.image = "/test.jpg";
    element.imageLink = "/test-link";
    await element.updateComplete;

    expect(element.searchTerm).to.equal("test search");
    expect(element.imageAlt).to.equal("Test image");
    expect(element.image).to.equal("/test.jpg");
    expect(element.imageLink).to.equal("/test-link");
  });

  it("should render basic structure", () => {
    const shadowRoot = element.shadowRoot;
    expect(shadowRoot.querySelector("header")).to.exist;
    expect(shadowRoot.querySelector("nav")).to.exist;
    expect(shadowRoot.querySelector("main")).to.exist;
    expect(shadowRoot.querySelector("aside")).to.exist;
    expect(shadowRoot.querySelector("footer")).to.exist;
  });

  it("should handle edit mode toggle", async () => {
    element.editMode = true;
    await element.updateComplete;
    expect(element.editMode).to.be.true;

    element.editMode = false;
    await element.updateComplete;
    expect(element.editMode).to.be.false;
  });

  it("should handle null property values gracefully", async () => {
    element.image = null;
    await element.updateComplete;

    // Should handle null gracefully
    expect(element.image).to.be.null;
  });

  it("should support multiple instances", async () => {
    const element2 = await fixture(
      html`<polaris-theme image="/test.jpg"></polaris-theme>`,
    );

    expect(element.image).to.equal("");
    expect(element2.image).to.equal("/test.jpg");
  });

  it("should cleanup on disconnection", () => {
    expect(() => element.disconnectedCallback()).to.not.throw;
  });
});

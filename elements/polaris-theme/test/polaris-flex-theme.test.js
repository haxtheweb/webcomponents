// Tests for polaris-flex-theme, focused on the dual sticky-nav pattern:
// an in-flow #primary-nav inside <header> plus a position:fixed mirror that
// is revealed by an IntersectionObserver-driven __navStuck flag. The HAXCMS
// mobx store is populated with an in-memory manifest before each fixture so
// the theme's constructor autoruns (themeData.variables etc.) resolve.
import { fixture, expect, html } from "@open-wc/testing";
import "@haxtheweb/replace-tag/replace-tag.js";
import "../lib/polaris-flex-theme.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";

const LS_KEY = "hax-mobile-menu-menuOpen";

function makeManifest() {
  return {
    id: "flex-test-site",
    title: "Flex Test Site",
    description: "flex theme test",
    metadata: {
      site: { name: "flex-test-site" },
      platform: {},
      theme: {
        element: "polaris-flex-theme",
        variables: { image: "x.jpg", imageAlt: "alt", imageLink: "/x" },
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

describe("polaris-flex-theme", () => {
  let element;
  let savedManifest;
  let saved = {};
  let savedLS;
  let origSiteActiveTagsUpdated;
  let SiteActiveTags;

  // Set up once for the whole file. A bare fixture does not bootstrap the
  // full HAX editor environment, so two reactive children would otherwise
  // throw uncaught errors and fail the run:
  //  - <site-region> reads store.regionData, which is undefined when the
  //    manifest is null. Keep a manifest populated for the whole file so its
  //    autorun never reads .header off undefined between tests.
  //  - <site-active-tags>.updated() calls globalThis.HaxStore.requestAvailability()
  //    on an editMode toggle and aborts a controller that was never created; a
  //    bare fixture has no HaxStore. Neutralize that lifecycle hook for the
  //    duration of this file (render + constructor autoruns still run).
  before(() => {
    savedManifest = store.manifest;
    store.manifest = makeManifest();
    SiteActiveTags = customElements.get("site-active-tags");
    origSiteActiveTagsUpdated = SiteActiveTags.prototype.updated;
    SiteActiveTags.prototype.updated = function () {};
  });

  after(() => {
    store.manifest = savedManifest;
    SiteActiveTags.prototype.updated = origSiteActiveTagsUpdated;
  });

  beforeEach(async () => {
    saved = {
      activeId: store.activeId,
      editMode: store.editMode,
      trayStatus: store.trayStatus,
    };
    savedLS = globalThis.localStorage.getItem(LS_KEY);
    store.activeId = null;
    store.editMode = false;
    store.trayStatus = "";
    element = await fixture(
      html`<polaris-flex-theme></polaris-flex-theme>`,
    );
    // reveal the host so computed-style reads reflect a painted state;
    // the HAXCMSLitElementTheme suite covers the real rAF theme-ready gate
    element.themeReady = true;
    await element.updateComplete;
  });

  afterEach(() => {
    store.activeId = saved.activeId;
    store.editMode = saved.editMode;
    store.trayStatus = saved.trayStatus;
    if (savedLS === null) {
      globalThis.localStorage.removeItem(LS_KEY);
    } else {
      globalThis.localStorage.setItem(LS_KEY, savedLS);
    }
  });

  it("instantiates as a custom element with shadow DOM", () => {
    expect(customElements.get("polaris-flex-theme")).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("polaris-flex-theme");
    expect(element.shadowRoot).to.exist;
  });

  it("defaults __navStuck to false", () => {
    expect(element.__navStuck).to.equal(false);
  });

  it("renders the in-flow header scaffold", () => {
    const sr = element.shadowRoot;
    expect(sr.querySelector("header")).to.exist;
    expect(sr.querySelector(".header-top-menu")).to.exist;
    expect(sr.querySelector("#primary-nav")).to.exist;
    expect(sr.querySelector("site-active-media-banner")).to.exist;
    expect(sr.querySelector("main#main")).to.exist;
    expect(sr.querySelector("footer")).to.exist;
    expect(sr.querySelector(".skip-link")).to.exist;
  });

  it("keeps the in-flow nav inside <header> and the mirror outside it", () => {
    const header = element.shadowRoot.querySelector("header");
    const primary = element.shadowRoot.querySelector("#primary-nav");
    const mirror = element.shadowRoot.querySelector(".sticky-nav-mirror");
    expect(header.contains(primary)).to.equal(true);
    // hero banner stays in normal flow inside the header
    expect(header.contains(element.shadowRoot.querySelector("site-active-media-banner"))).to.equal(true);
    // the fixed mirror is a sibling, not nested in the header
    expect(header.contains(mirror)).to.equal(false);
  });

  it("gives the mirror unique ids that cannot collide with the in-flow nav", () => {
    const mirror = element.shadowRoot.querySelector(".sticky-nav-mirror");
    expect(mirror.querySelector("#haxcmsmobilemenunav-mirror")).to.exist;
    expect(mirror.querySelector("#sitemenu-mirror")).to.exist;
    // in-flow nav keeps its own ids
    expect(element.shadowRoot.querySelector("#haxcmsmobilemenunav")).to.exist;
    expect(element.shadowRoot.querySelector("#sitemenu")).to.exist;
  });

  it("hides the mirror by default (visibility + opacity)", () => {
    const mirror = element.shadowRoot.querySelector(".sticky-nav-mirror");
    expect(mirror.classList.contains("stuck")).to.equal(false);
    expect(getComputedStyle(mirror).visibility).to.equal("hidden");
    expect(getComputedStyle(mirror).opacity).to.equal("0");
  });

  it("drops the fixed mirror below the admin bar when logged in", async () => {
    const mirror = element.shadowRoot.querySelector(".sticky-nav-mirror");
    expect(getComputedStyle(mirror).top).to.equal("0px");
    element.isLoggedIn = true;
    await element.updateComplete;
    expect(element.hasAttribute("is-logged-in")).to.equal(true);
    expect(getComputedStyle(mirror).top).to.equal("64px");
  });

  describe("sticky mirror toggle (IO disconnected for determinism)", () => {
    beforeEach(() => {
      // stop the real IntersectionObserver from racing our manual toggling
      if (element.__navIO) {
        element.__navIO.disconnect();
      }
    });

    it("reveals the mirror and aria-hides the in-flow nav when stuck", async () => {
      element.__navStuck = true;
      await element.updateComplete;
      const mirror = element.shadowRoot.querySelector(".sticky-nav-mirror");
      const primary = element.shadowRoot.querySelector("#primary-nav");
      expect(mirror.classList.contains("stuck")).to.equal(true);
      expect(getComputedStyle(mirror).visibility).to.equal("visible");
      expect(getComputedStyle(mirror).opacity).to.equal("1");
      expect(primary.getAttribute("aria-hidden")).to.equal("true");
    });

    it("hides the mirror and restores the in-flow nav when unstuck", async () => {
      element.__navStuck = true;
      await element.updateComplete;
      element.__navStuck = false;
      await element.updateComplete;
      const mirror = element.shadowRoot.querySelector(".sticky-nav-mirror");
      const primary = element.shadowRoot.querySelector("#primary-nav");
      expect(mirror.classList.contains("stuck")).to.equal(false);
      expect(getComputedStyle(mirror).visibility).to.equal("hidden");
      expect(primary.getAttribute("aria-hidden")).to.equal("false");
    });

    it("suppresses the mirror while in edit mode even if stuck", async () => {
      element.editMode = true;
      element.__navStuck = true;
      await element.updateComplete;
      const mirror = element.shadowRoot.querySelector(".sticky-nav-mirror");
      expect(mirror.classList.contains("stuck")).to.equal(false);
      expect(getComputedStyle(mirror).visibility).to.equal("hidden");
    });

    it("toggles the mobile menu from the mirror hamburger on xs", async () => {
      element.menuOpen = false;
      element.responsiveSize = "xs";
      await element.updateComplete;
      const mirrorBtn = element.shadowRoot.querySelector(
        "#haxcmsmobilemenubutton-mirror",
      );
      expect(mirrorBtn).to.exist;
      // also confirm the in-flow nav got its own hamburger on xs
      expect(element.shadowRoot.querySelector("#haxcmsmobilemenubutton")).to.exist;

      mirrorBtn.click();
      expect(element.menuOpen).to.equal(true);

      mirrorBtn.click();
      expect(element.menuOpen).to.equal(false);
    });
  });

  describe("IntersectionObserver lifecycle", () => {
    it("creates an observer in firstUpdated", () => {
      expect(element.__navIO).to.exist;
      expect(element.__navIO instanceof IntersectionObserver).to.equal(true);
    });

    it("disconnects and nulls the observer on disconnect", () => {
      expect(element.__navIO).to.exist;
      element.disconnectedCallback();
      expect(element.__navIO).to.equal(null);
    });
  });
});

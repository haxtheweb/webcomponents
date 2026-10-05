import { fixture, expect, html } from "@open-wc/testing";
import { PolarisFlexSidebar } from "../lib/polaris-flex-sidebar.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { forceThemeReveal } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeA11yTestHelpers.js";

// coverage for lib/polaris-flex-sidebar.js: the sidebar variant of the flex
// theme. Overrides renderSideBar with an accessible complementary region and
// forces the mobile menu closed when edit mode engages.
function makeManifest() {
  return {
    id: "flex-sidebar-test-site",
    title: "Flex Sidebar Test Site",
    description: "flex sidebar theme test",
    metadata: {
      site: { name: "flex-sidebar-test-site" },
      platform: {},
      theme: {
        element: "polaris-flex-sidebar",
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
        id: "s1",
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

describe("polaris-flex-sidebar", () => {
  let element;
  let savedManifest;
  let savedActiveId;
  let savedLS;
  let SiteActiveTags;
  let origSiteActiveTagsUpdated;

  const LS_KEY = "hax-mobile-menu-menuOpen";

  before(() => {
    savedManifest = store.manifest;
    savedActiveId = store.activeId;
    store.manifest = makeManifest();
    SiteActiveTags = customElements.get("site-active-tags");
    origSiteActiveTagsUpdated = SiteActiveTags.prototype.updated;
    SiteActiveTags.prototype.updated = function () {};
  });

  after(() => {
    store.manifest = savedManifest;
    store.activeId = savedActiveId;
    SiteActiveTags.prototype.updated = origSiteActiveTagsUpdated;
  });

  beforeEach(async () => {
    savedLS = globalThis.localStorage.getItem(LS_KEY);
    // guarantee the constructor default (menu open) regardless of leftovers
    globalThis.localStorage.removeItem(LS_KEY);
    store.activeId = null;
    element = await fixture(
      html`<polaris-flex-sidebar></polaris-flex-sidebar>`,
    );
    await forceThemeReveal(element);
    await new Promise((resolve) => requestAnimationFrame(resolve));
  });

  afterEach(() => {
    if (savedLS === null) {
      globalThis.localStorage.removeItem(LS_KEY);
    } else {
      globalThis.localStorage.setItem(LS_KEY, savedLS);
    }
  });

  it("registers as a custom element with shadow DOM", () => {
    expect(customElements.get("polaris-flex-sidebar")).to.exist;
    expect(PolarisFlexSidebar.tag).to.equal("polaris-flex-sidebar");
    expect(element.shadowRoot).to.exist;
  });

  it("renders the accessible sidebar region with the children block", () => {
    const sr = element.shadowRoot;
    const aside = sr.querySelector('aside[role="complementary"]');
    expect(aside === null).to.equal(false);
    expect(aside.getAttribute("aria-label")).to.equal("Primary Sidebar");
    expect(aside.getAttribute("part")).to.equal("page-primary-sidebar");
    expect(
      aside.getAttribute("itemtype") === "http://schema.org/WPSideBar",
    ).to.equal(true);
    // heading is visually hidden but still exposed
    expect(aside.querySelector("h4.sr-only").textContent.trim()).to.equal(
      "Contents",
    );
    const children = aside.querySelector("site-children-block");
    expect(children === null).to.equal(false);
    expect(children.getAttribute("part")).to.equal("page-children-block");
    expect(children.getAttribute("dynamic-methodology")).to.equal("ancestor");
    // the sidebar sits in-flow before main within the content region
    const inner = sr.querySelector(".site-inner");
    const pos = inner
      .querySelector("aside")
      .compareDocumentPosition(inner.querySelector("main"));
    expect(
      (pos & Node.DOCUMENT_POSITION_FOLLOWING) ===
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).to.equal(true);
  });

  it("keeps the flex theme header scaffold", () => {
    const sr = element.shadowRoot;
    expect(sr.querySelector("header")).to.exist;
    expect(sr.querySelector("#primary-nav")).to.exist;
    expect(sr.querySelector("main#main")).to.exist;
    expect(sr.querySelector("footer")).to.exist;
  });

  it("sizes the sidebar by breakpoint", async () => {
    // wait for ResponsiveUtility's ResizeObserver to settle the host size
    // before driving explicit breakpoints (its callback is async)
    await new Promise((resolve) => setTimeout(resolve, 150));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    // detach the utility's observer for this element so explicit breakpoint
    // driving does not fight its ResizeObserver notification loop
    const details = globalThis.ResponsiveUtility.instance.details;
    const detail = details.find((d) => d && d.element === element);
    if (detail && detail.observer) {
      detail.observer.disconnect();
    }
    const aside = element.shadowRoot.querySelector("aside");
    // the aside is a flex item that shrinks to the available space, so
    // compare relative growth across breakpoints instead of exact pixels
    element.responsiveSize = "lg";
    await element.updateComplete;
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const lgWidth = parseFloat(getComputedStyle(aside).width);
    element.responsiveSize = "xl";
    await element.updateComplete;
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const xlWidth = parseFloat(getComputedStyle(aside).width);
    expect(xlWidth > lgWidth).to.equal(true);
    expect(element.getAttribute("responsive-size")).to.equal("xl");
    // small layouts reflow the sidebar below the content
    element.responsiveSize = "sm";
    await element.updateComplete;
    await new Promise((resolve) => requestAnimationFrame(resolve));
    expect(getComputedStyle(aside).order).to.equal("2");
    expect(element.getAttribute("responsive-size")).to.equal("sm");
  });

  it("force-closes the mobile menu when entering edit mode", async () => {
    // the menu auto-closes on small layouts, so pin it open explicitly
    element.menuOpen = true;
    await element.updateComplete;
    expect(element.menuOpen).to.equal(true);
    element.editMode = true;
    await element.updateComplete;
    expect(element.menuOpen).to.equal(false);
    element.editMode = false;
    await element.updateComplete;
    // leaving edit mode does not reopen the menu by itself
    expect(element.menuOpen).to.equal(false);
  });
});

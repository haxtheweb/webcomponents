import { html, fixture, expect } from "@open-wc/testing";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import {
  forceThemeReveal,
  lockLightColorScheme,
} from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeA11yTestHelpers.js";
import "../example-haxcms-theme.js";

// audits of a fully rendered theme can legitimately exceed mocha's 2000ms
// default under test:all load; give the suite real headroom
describe("ExampleHaxcmsTheme test", function () {
  this.timeout(10000);
  let element;
  let restoreColorScheme;

  before(() => {
    // Lock the light-dark() CSS color scheme so this theme's styles
    // resolve deterministically regardless of the host OS/browser's
    // prefers-color-scheme (see HAXCMSThemeA11yTestHelpers.js). This also
    // addresses the racy color-contrast family previously observed on
    // site-active-title internals (see the "renders the item pagination
    // list" test below).
    restoreColorScheme = lockLightColorScheme();
  });

  after(() => {
    restoreColorScheme();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <example-haxcms-theme title="title"></example-haxcms-theme>
    `);
    await element.updateComplete;
    // deterministically reveal the theme so the audit never races the
    // rAF-gated opacity fade (see HAXCMSThemeA11yTestHelpers.js)
    await forceThemeReveal(element);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    // axe looks the skip link's target up in the document, not the
    // shadow root it lives in, so it cannot see #contentcontainer
    await expect(element).shadowDom.to.be.accessible({
      ignoredRules: ["skip-link"],
    });
  });
});

// Round 8 coverage (#3079): the only uncovered statements were the
// _items pagination loop; drive it through the store singleton
// (save/restore pattern per hax-body/test/hax-store.test.js).
describe("ExampleHaxcmsTheme behavior", () => {
  let element;
  let savedManifest;
  let savedActiveId;
  const tick = (ms) => new Promise((r) => setTimeout(r, ms || 60));

  before(() => {
    savedManifest = store.manifest;
    savedActiveId = store.activeId;
  });

  after(() => {
    store.manifest = savedManifest;
    store.activeId = savedActiveId;
  });

  afterEach(() => {
    store.manifest = savedManifest;
    store.activeId = savedActiveId;
  });

  beforeEach(async () => {
    element = await fixture(html`
      <example-haxcms-theme></example-haxcms-theme>
    `);
    await element.updateComplete;
  });

  it("seeds defaults", () => {
    expect(element.activeId).to.equal(null);
    expect(element._items.length).to.equal(0);
  });

  it("renders the item pagination list with the active item highlighted", async () => {
    store.manifest = {
      title: "Example Site",
      items: [
        { id: "p1", title: "Page One", slug: "/page-one", metadata: {} },
        { id: "p2", title: "Page Two", slug: "/page-two", metadata: {} },
      ],
    };
    store.activeId = "p2";
    await tick();
    await element.updateComplete;
    expect(element.activeId).to.equal("p2");
    expect(element._items.length).to.equal(2);
    const lis = [...element.shadowRoot.querySelectorAll("header ul li")];
    // prev button + two items + next button
    expect(lis.length).to.equal(4);
    const first = element.shadowRoot.querySelector(
      'header ul li a[href="/page-one"]',
    );
    expect(first === null).to.equal(false);
    // each page is one link (no button nested inside it), named with its
    // number and title
    expect(first.querySelector("button")).to.equal(null);
    expect(first.getAttribute("title")).to.equal("Page One");
    expect(first.textContent).to.equal("1");
    expect(first.getAttribute("aria-label")).to.equal("Page 1: Page One");
    expect(first.parentNode.className.includes("active")).to.equal(false);
    const second = element.shadowRoot.querySelector(
      'header ul li a[href="/page-two"]',
    );
    expect(second.textContent).to.equal("2");
    expect(second.getAttribute("aria-current")).to.equal("page");
    expect(second.parentNode.className.includes("active")).to.equal(true);
    expect(
      element.shadowRoot.querySelector(
        'header ul li site-menu-button[type="prev"]',
      ) === null,
    ).to.equal(false);
    expect(
      element.shadowRoot.querySelector(
        'header ul li site-menu-button[type="next"]',
      ) === null,
    ).to.equal(false);
    expect(
      element.shadowRoot.querySelector("main site-active-title") === null,
    ).to.equal(false);
    expect(
      element.shadowRoot.querySelector(
        "article #contentcontainer #slot slot",
      ) === null,
    ).to.equal(false);
    expect(
      element.shadowRoot.querySelector('footer slot[name="footer"]') === null,
    ).to.equal(false);
    // one interactive element per page: a link drawn as a button, with
    // no button nested inside it
    expect(
      element.shadowRoot.querySelectorAll("header ul li a button").length,
    ).to.equal(0);
    expect(
      element.shadowRoot.querySelectorAll("header nav ul li a.page-link")
        .length,
    ).to.equal(2);
  });
});

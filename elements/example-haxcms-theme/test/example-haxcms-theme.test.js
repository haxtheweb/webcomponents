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
    await expect(element).shadowDom.to.be.accessible();
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
    const firstButton = first.querySelector("button");
    expect(firstButton.getAttribute("title")).to.equal("Page One");
    expect(firstButton.textContent).to.equal("1");
    expect(first.parentNode.className.includes("active")).to.equal(false);
    const second = element.shadowRoot.querySelector(
      'header ul li a[href="/page-two"]',
    );
    expect(second.querySelector("button").textContent).to.equal("2");
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
    // OBSERVATION (a11y / markup nesting): item pagination renders
    // <button> inside <a href> — interactive content nested inside
    // interactive content, which HTML disallows as valid interactive
    // descendants of links (a keyboard/AT activation-order concern).
    // Not axe-flagged in this harness (a probe audit only surfaced the
    // known racy color-contrast family on site-active-title internals,
    // with computed values matching no stylesheet state), so recorded as
    // an observation for the round-8 sweep rather than an axe-verified
    // violation; a single interactive element per item would be cleaner.
    expect(
      element.shadowRoot.querySelectorAll("header ul li a button").length,
    ).to.equal(2);
  });
});

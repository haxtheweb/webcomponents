import { fixture, expect, html } from "@open-wc/testing";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import {
  forceThemeReveal,
  lockLightColorScheme,
} from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeA11yTestHelpers.js";

import "../learn-two-theme.js";

// audits of a fully rendered theme can legitimately exceed mocha's 2000ms
// default under test:all load; give the suite real headroom. Previously
// this a11y audit was disabled wholesale (see git history) to work around
// the rAF-gated opacity fade race documented in
// HAXCMSThemeA11yTestHelpers.js; it is re-enabled here using the shared
// harness instead of being left disabled.
describe("learn-two-theme test", function () {
  this.timeout(10000);
  let element;
  let restoreColorScheme;
  let savedManifest;
  let savedActiveId;

  before(() => {
    restoreColorScheme = lockLightColorScheme();
    savedManifest = store.manifest;
    savedActiveId = store.activeId;
    // site-title (rendered inside the theme) reads store.siteTitle, which
    // derives from store.manifest.title; without a seeded manifest it
    // renders an empty <h1>, tripping axe's empty-heading rule.
    store.manifest = {
      id: "learn-two-test",
      title: "Learn Two Test Site",
      metadata: { platform: {}, theme: { variables: {} } },
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
    store.activeId = null;
  });

  after(() => {
    restoreColorScheme();
    store.manifest = savedManifest;
    store.activeId = savedActiveId;
  });

  beforeEach(async () => {
    element = await fixture(html`
      <learn-two-theme title="test-title"></learn-two-theme>
    `);
    await element.updateComplete;
    await forceThemeReveal(element);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("learn-two-theme can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<learn-two-theme .foo=${'bar'}></learn-two-theme>`);
    expect(el.foo).to.equal('bar');
  })
})
*/

/*
// Test if element is mobile responsive
describe('Test Mobile Responsiveness', () => {
    before(async () => {z   
      await setViewport({width: 375, height: 750});
    })
    it('sizes down to 360px', async () => {
      const el = await fixture(html`<learn-two-theme ></learn-two-theme>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('360px');
    })
}) */

/*
// Test if element sizes up for desktop behavior
describe('Test Desktop Responsiveness', () => {
    before(async () => {
      await setViewport({width: 1000, height: 1000});
    })
    it('sizes up to 410px', async () => {
      const el = await fixture(html`<learn-two-theme></learn-two-theme>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<learn-two-theme></learn-two-theme>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

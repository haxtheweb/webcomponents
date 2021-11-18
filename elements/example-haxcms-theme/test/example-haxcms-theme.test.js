// local development and mobx
window.process = window.process || {
  env: {
    NODE_ENV: "development",
  },
};
import { fixture, expect, html } from "@open-wc/testing";

import "../example-haxcms-theme.js";

describe("example-haxcms-theme test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html` <example-haxcms-theme title="test-title"></example-haxcms-theme> `
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("example-haxcms-theme passes accessibility test", async () => {
    const el = await fixture(
      html` <example-haxcms-theme></example-haxcms-theme> `
    );
    await expect(el).to.be.accessible();
  });
  it("example-haxcms-theme passes accessibility negation", async () => {
    const el = await fixture(
      html`<example-haxcms-theme
        aria-labelledby="example-haxcms-theme"
      ></example-haxcms-theme>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("example-haxcms-theme can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<example-haxcms-theme .foo=${'bar'}></example-haxcms-theme>`);
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
      const el = await fixture(html`<example-haxcms-theme ></example-haxcms-theme>`);
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
      const el = await fixture(html`<example-haxcms-theme></example-haxcms-theme>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<example-haxcms-theme></example-haxcms-theme>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

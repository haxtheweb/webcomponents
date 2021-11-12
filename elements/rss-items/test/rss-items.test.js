import { fixture, expect, html } from "@open-wc/testing";

import "../rss-items.js";

describe("rss-items test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html` <rss-items title="test-title"></rss-items> `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("rss-items passes accessibility test", async () => {
    const el = await fixture(html` <rss-items></rss-items> `);
    await expect(el).to.be.accessible();
  });
  it("rss-items passes accessibility negation", async () => {
    const el = await fixture(
      html`<rss-items aria-labelledby="rss-items"></rss-items>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("rss-items can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<rss-items .foo=${'bar'}></rss-items>`);
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
      const el = await fixture(html`<rss-items ></rss-items>`);
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
      const el = await fixture(html`<rss-items></rss-items>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<rss-items></rss-items>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

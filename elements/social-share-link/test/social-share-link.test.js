import { fixture, expect, html } from "@open-wc/testing";

import "../social-share-link.js";

describe("social-share-link test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <social-share-link title="test-title"></social-share-link>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("social-share-link passes accessibility test", async () => {
    const el = await fixture(html` <social-share-link></social-share-link> `);
    await expect(el).to.be.accessible();
  });
  it("social-share-link passes accessibility negation", async () => {
    const el = await fixture(
      html`<social-share-link
        aria-labelledby="social-share-link"
      ></social-share-link>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("social-share-link can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<social-share-link .foo=${'bar'}></social-share-link>`);
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
      const el = await fixture(html`<social-share-link ></social-share-link>`);
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
      const el = await fixture(html`<social-share-link></social-share-link>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<social-share-link></social-share-link>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

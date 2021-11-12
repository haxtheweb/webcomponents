import { fixture, expect, html } from "@open-wc/testing";

import "../lrn-aside.js";

describe("lrn-aside test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html` <lrn-aside title="test-title"></lrn-aside> `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("lrn-aside passes accessibility test", async () => {
    const el = await fixture(html` <lrn-aside></lrn-aside> `);
    await expect(el).to.be.accessible();
  });
  it("lrn-aside passes accessibility negation", async () => {
    const el = await fixture(
      html`<lrn-aside aria-labelledby="lrn-aside"></lrn-aside>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("lrn-aside can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<lrn-aside .foo=${'bar'}></lrn-aside>`);
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
      const el = await fixture(html`<lrn-aside ></lrn-aside>`);
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
      const el = await fixture(html`<lrn-aside></lrn-aside>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<lrn-aside></lrn-aside>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

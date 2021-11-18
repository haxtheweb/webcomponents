import { fixture, expect, html } from "@open-wc/testing";

import "../lrnsys-render-html.js";

describe("lrnsys-render-html test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html` <lrnsys-render-html title="test-title"></lrnsys-render-html> `
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("lrnsys-render-html passes accessibility test", async () => {
    const el = await fixture(html` <lrnsys-render-html></lrnsys-render-html> `);
    await expect(el).to.be.accessible();
  });
  it("lrnsys-render-html passes accessibility negation", async () => {
    const el = await fixture(
      html`<lrnsys-render-html
        aria-labelledby="lrnsys-render-html"
      ></lrnsys-render-html>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("lrnsys-render-html can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<lrnsys-render-html .foo=${'bar'}></lrnsys-render-html>`);
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
      const el = await fixture(html`<lrnsys-render-html ></lrnsys-render-html>`);
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
      const el = await fixture(html`<lrnsys-render-html></lrnsys-render-html>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<lrnsys-render-html></lrnsys-render-html>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

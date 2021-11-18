import { fixture, expect, html } from "@open-wc/testing";

import "../simple-pages.js";

describe("simple-pages test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html` <simple-pages title="test-title"></simple-pages> `
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("simple-pages passes accessibility test", async () => {
    const el = await fixture(html` <simple-pages></simple-pages> `);
    await expect(el).to.be.accessible();
  });
  it("simple-pages passes accessibility negation", async () => {
    const el = await fixture(
      html`<simple-pages aria-labelledby="simple-pages"></simple-pages>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("simple-pages can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<simple-pages .foo=${'bar'}></simple-pages>`);
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
      const el = await fixture(html`<simple-pages ></simple-pages>`);
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
      const el = await fixture(html`<simple-pages></simple-pages>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<simple-pages></simple-pages>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

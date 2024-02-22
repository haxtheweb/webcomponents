import { fixture, expect, html } from "@open-wc/testing";

import "../h5p-element.js";

describe("h5p-element test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <h5p-element title="test-title"></h5p-element>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("h5p-element passes accessibility test", async () => {
    const el = await fixture(html` <h5p-element></h5p-element> `);
    await expect(el).to.be.accessible();
  });
  it("h5p-element passes accessibility negation", async () => {
    const el = await fixture(
      html`<h5p-element aria-labelledby="h5p-element"></h5p-element>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("h5p-element can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<h5p-element .foo=${'bar'}></h5p-element>`);
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
      const el = await fixture(html`<h5p-element ></h5p-element>`);
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
      const el = await fixture(html`<h5p-element></h5p-element>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<h5p-element></h5p-element>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

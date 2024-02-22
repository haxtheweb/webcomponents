import { fixture, expect, html } from "@open-wc/testing";

import "../citation-element.js";

describe("citation-element test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <citation-element title="test-title"></citation-element>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("citation-element passes accessibility test", async () => {
    const el = await fixture(html` <citation-element></citation-element> `);
    await expect(el).to.be.accessible();
  });
  it("citation-element passes accessibility negation", async () => {
    const el = await fixture(
      html`<citation-element
        aria-labelledby="citation-element"
      ></citation-element>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("citation-element can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<citation-element .foo=${'bar'}></citation-element>`);
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
      const el = await fixture(html`<citation-element ></citation-element>`);
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
      const el = await fixture(html`<citation-element></citation-element>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<citation-element></citation-element>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

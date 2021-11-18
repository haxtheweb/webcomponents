import { fixture, expect, html } from "@open-wc/testing";

import "../hal-9000.js";

describe("hal-9000 test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html` <hal-9000 title="test-title"></hal-9000> `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("hal-9000 passes accessibility test", async () => {
    const el = await fixture(html` <hal-9000></hal-9000> `);
    await expect(el).to.be.accessible();
  });
  it("hal-9000 passes accessibility negation", async () => {
    const el = await fixture(
      html`<hal-9000 aria-labelledby="hal-9000"></hal-9000>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("hal-9000 can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<hal-9000 .foo=${'bar'}></hal-9000>`);
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
      const el = await fixture(html`<hal-9000 ></hal-9000>`);
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
      const el = await fixture(html`<hal-9000></hal-9000>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<hal-9000></hal-9000>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

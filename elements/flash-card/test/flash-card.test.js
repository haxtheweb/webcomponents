import { fixture, expect, html } from "@open-wc/testing";

import "../flash-card.js";

describe("flash-card test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html` <flash-card title="test-title"></flash-card> `
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("flash-card passes accessibility test", async () => {
    const el = await fixture(html` <flash-card></flash-card> `);
    await expect(el).to.be.accessible();
  });
  it("flash-card passes accessibility negation", async () => {
    const el = await fixture(
      html`<flash-card aria-labelledby="flash-card"></flash-card>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("flash-card can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<flash-card .foo=${'bar'}></flash-card>`);
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
      const el = await fixture(html`<flash-card ></flash-card>`);
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
      const el = await fixture(html`<flash-card></flash-card>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<flash-card></flash-card>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

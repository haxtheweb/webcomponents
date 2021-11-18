import { fixture, expect, html } from "@open-wc/testing";

import "../a11y-tabs.js";

describe("a11y-tabs test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html` <a11y-tabs title="test-title"></a11y-tabs> `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("a11y-tabs passes accessibility test", async () => {
    const el = await fixture(html` <a11y-tabs></a11y-tabs> `);
    await expect(el).to.be.accessible();
  });
  it("a11y-tabs passes accessibility negation", async () => {
    const el = await fixture(
      html`<a11y-tabs aria-labelledby="a11y-tabs"></a11y-tabs>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("a11y-tabs can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<a11y-tabs .foo=${'bar'}></a11y-tabs>`);
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
      const el = await fixture(html`<a11y-tabs ></a11y-tabs>`);
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
      const el = await fixture(html`<a11y-tabs></a11y-tabs>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<a11y-tabs></a11y-tabs>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

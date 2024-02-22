import { fixture, expect, html } from "@open-wc/testing";

import "../simple-cta.js";

describe("simple-cta test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <simple-cta title="this is my title"></simple-cta>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("simple-cta passes accessibility test", async () => {
    const el = await fixture(html` <simple-cta></simple-cta> `);
    await expect(el).to.be.accessible();
  });
  it("simple-cta passes accessibility negation", async () => {
    const el = await fixture(
      html`<simple-cta aria-labelledby="simple-cta"></simple-cta>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("simple-cta can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<simple-cta .foo=${'bar'}></simple-cta>`);
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
      const el = await fixture(html`<simple-cta ></simple-cta>`);
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
      const el = await fixture(html`<simple-cta></simple-cta>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<simple-cta></simple-cta>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

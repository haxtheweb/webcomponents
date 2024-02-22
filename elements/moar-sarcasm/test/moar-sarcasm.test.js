import { fixture, expect, html } from "@open-wc/testing";

import "../moar-sarcasm.js";

describe("moar-sarcasm test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <moar-sarcasm title="test-title"></moar-sarcasm>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("moar-sarcasm passes accessibility test", async () => {
    const el = await fixture(html` <moar-sarcasm></moar-sarcasm> `);
    await expect(el).to.be.accessible();
  });
  it("moar-sarcasm passes accessibility negation", async () => {
    const el = await fixture(
      html`<moar-sarcasm aria-labelledby="moar-sarcasm"></moar-sarcasm>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("moar-sarcasm can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<moar-sarcasm .foo=${'bar'}></moar-sarcasm>`);
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
      const el = await fixture(html`<moar-sarcasm ></moar-sarcasm>`);
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
      const el = await fixture(html`<moar-sarcasm></moar-sarcasm>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<moar-sarcasm></moar-sarcasm>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

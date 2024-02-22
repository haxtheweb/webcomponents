import { fixture, expect, html } from "@open-wc/testing";

import "../hex-picker.js";

describe("hex-picker test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <hex-picker title="test-title"></hex-picker>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("hex-picker passes accessibility test", async () => {
    const el = await fixture(html` <hex-picker></hex-picker> `);
    await expect(el).to.be.accessible();
  });
  it("hex-picker passes accessibility negation", async () => {
    const el = await fixture(
      html`<hex-picker aria-labelledby="hex-picker"></hex-picker>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("hex-picker can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<hex-picker .foo=${'bar'}></hex-picker>`);
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
      const el = await fixture(html`<hex-picker ></hex-picker>`);
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
      const el = await fixture(html`<hex-picker></hex-picker>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<hex-picker></hex-picker>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

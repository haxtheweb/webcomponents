import { fixture, expect, html } from "@open-wc/testing";

import "../img-pan-zoom.js";

describe("img-pan-zoom test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <img-pan-zoom title="test-title"></img-pan-zoom>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("img-pan-zoom passes accessibility test", async () => {
    const el = await fixture(html` <img-pan-zoom></img-pan-zoom> `);
    await expect(el).to.be.accessible();
  });
  it("img-pan-zoom passes accessibility negation", async () => {
    const el = await fixture(
      html`<img-pan-zoom aria-labelledby="img-pan-zoom"></img-pan-zoom>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("img-pan-zoom can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<img-pan-zoom .foo=${'bar'}></img-pan-zoom>`);
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
      const el = await fixture(html`<img-pan-zoom ></img-pan-zoom>`);
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
      const el = await fixture(html`<img-pan-zoom></img-pan-zoom>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<img-pan-zoom></img-pan-zoom>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

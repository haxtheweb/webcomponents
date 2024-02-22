import { fixture, expect, html } from "@open-wc/testing";

import "../img-view-modal.js";

describe("img-view-modal test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <img-view-modal title="test-title"></img-view-modal>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("img-view-modal passes accessibility test", async () => {
    const el = await fixture(html` <img-view-modal></img-view-modal> `);
    await expect(el).to.be.accessible();
  });
  it("img-view-modal passes accessibility negation", async () => {
    const el = await fixture(
      html`<img-view-modal aria-labelledby="img-view-modal"></img-view-modal>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("img-view-modal can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<img-view-modal .foo=${'bar'}></img-view-modal>`);
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
      const el = await fixture(html`<img-view-modal ></img-view-modal>`);
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
      const el = await fixture(html`<img-view-modal></img-view-modal>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<img-view-modal></img-view-modal>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

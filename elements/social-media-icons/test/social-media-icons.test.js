import { fixture, expect, html } from "@open-wc/testing";

import "../social-media-icons.js";

describe("social-media-icons test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <social-media-icons title="test-title"></social-media-icons>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("social-media-icons passes accessibility test", async () => {
    const el = await fixture(html` <social-media-icons></social-media-icons> `);
    await expect(el).to.be.accessible();
  });
  it("social-media-icons passes accessibility negation", async () => {
    const el = await fixture(
      html`<social-media-icons
        aria-labelledby="social-media-icons"
      ></social-media-icons>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("social-media-icons can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<social-media-icons .foo=${'bar'}></social-media-icons>`);
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
      const el = await fixture(html`<social-media-icons ></social-media-icons>`);
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
      const el = await fixture(html`<social-media-icons></social-media-icons>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<social-media-icons></social-media-icons>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

import { fixture, expect, html } from "@open-wc/testing";

import "../media-image.js";

describe("media-image test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html` <media-image title="test-title"></media-image> `
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("media-image passes accessibility test", async () => {
    const el = await fixture(html` <media-image></media-image> `);
    await expect(el).to.be.accessible();
  });
  it("media-image passes accessibility negation", async () => {
    const el = await fixture(
      html`<media-image aria-labelledby="media-image"></media-image>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("media-image can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<media-image .foo=${'bar'}></media-image>`);
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
      const el = await fixture(html`<media-image ></media-image>`);
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
      const el = await fixture(html`<media-image></media-image>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<media-image></media-image>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

import { fixture, expect, html } from "@open-wc/testing";
/*
import "../aframe-player.js";

describe("aframe-player test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html` <aframe-player title="test-title"></aframe-player> `
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});*/

/*
describe("A11y/chai axe tests", () => {
  it("aframe-player passes accessibility test", async () => {
    const el = await fixture(html` <aframe-player></aframe-player> `);
    await expect(el).to.be.accessible();
  });
  it("aframe-player passes accessibility negation", async () => {
    const el = await fixture(
      html`<aframe-player aria-labelledby="aframe-player"></aframe-player>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("aframe-player can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<aframe-player .foo=${'bar'}></aframe-player>`);
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
      const el = await fixture(html`<aframe-player ></aframe-player>`);
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
      const el = await fixture(html`<aframe-player></aframe-player>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<aframe-player></aframe-player>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

import { fixture, expect, html } from "@open-wc/testing";

import "../unity-webgl.js";

describe("unity-webgl test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<unity-webgl 
      target="${new URL('../demo/example/build web', import.meta.url).href}" 
      compression="unityweb"
      streamingurl="StreamingAssets" 
      companyname="DefaultCompany" 
      productname="test webgl" 
      productversion="0.1"
      width="460px" 
      height="400px" 
      background="#231F20">
    </unity-webgl>`
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("unity-webgl passes accessibility test", async () => {
    const el = await fixture(html` <unity-webgl></unity-webgl> `);
    await expect(el).to.be.accessible();
  });
  it("unity-webgl passes accessibility negation", async () => {
    const el = await fixture(
      html`<unity-webgl aria-labelledby="unity-webgl"></unity-webgl>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("unity-webgl can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<unity-webgl .foo=${'bar'}></unity-webgl>`);
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
      const el = await fixture(html`<unity-webgl ></unity-webgl>`);
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
      const el = await fixture(html`<unity-webgl></unity-webgl>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<unity-webgl></unity-webgl>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

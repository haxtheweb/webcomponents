// local development and mobx
import { fixture, expect, html } from "@open-wc/testing";
import "@haxtheweb/haxcms-elements/lib/core/haxcms-site-builder.js";
describe("haxcms-elements test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<haxcms-site-builder
        id="site"
        file="${new URL("../demo/site.json", import.meta.url).href}"
      ></haxcms-site-builder>`,
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("haxcms-elements passes accessibility test", async () => {
    const el = await fixture(html` <haxcms-elements></haxcms-elements> `);
    await expect(el).to.be.accessible();
  });
  it("haxcms-elements passes accessibility negation", async () => {
    const el = await fixture(
      html`<haxcms-elements
        aria-labelledby="haxcms-elements"
      ></haxcms-elements>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("haxcms-elements can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<haxcms-elements .foo=${'bar'}></haxcms-elements>`);
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
      const el = await fixture(html`<haxcms-elements ></haxcms-elements>`);
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
      const el = await fixture(html`<haxcms-elements></haxcms-elements>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<haxcms-elements></haxcms-elements>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

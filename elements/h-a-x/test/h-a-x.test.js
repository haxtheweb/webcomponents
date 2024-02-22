import { fixture, expect, html } from "@open-wc/testing";

import "../h-a-x.js";
describe("h-a-x test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html` <h-a-x
        app-store='{"url": "${new URL("../demo/appstore.json", import.meta.url)
          .href}"}'
        offset-margin="0px 0px 0px 48px"
        element-align="right"
      >
        <p>This is h-a-x</p>
        <ul>
          <li>You'll love this because...</li>
          <li>You'll love this because...</li>
        </ul>
        <p>This is h-a-x</p>
        <p>This is h-a-x</p>
      </h-a-x>`,
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("h-a-x passes accessibility test", async () => {
    const el = await fixture(html` <h-a-x></h-a-x> `);
    await expect(el).to.be.accessible();
  });
  it("h-a-x passes accessibility negation", async () => {
    const el = await fixture(html`<h-a-x aria-labelledby="h-a-x"></h-a-x>`);
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("h-a-x can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<h-a-x .foo=${'bar'}></h-a-x>`);
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
      const el = await fixture(html`<h-a-x ></h-a-x>`);
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
      const el = await fixture(html`<h-a-x></h-a-x>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<h-a-x></h-a-x>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

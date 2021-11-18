import { fixture, expect, html } from "@open-wc/testing";

import "../cms-hax.js";

describe("cms-hax test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html` <cms-hax title="test-title"></cms-hax> `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("cms-hax passes accessibility test", async () => {
    const el = await fixture(html` <cms-hax></cms-hax> `);
    await expect(el).to.be.accessible();
  });
  it("cms-hax passes accessibility negation", async () => {
    const el = await fixture(
      html`<cms-hax aria-labelledby="cms-hax"></cms-hax>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("cms-hax can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<cms-hax .foo=${'bar'}></cms-hax>`);
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
      const el = await fixture(html`<cms-hax ></cms-hax>`);
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
      const el = await fixture(html`<cms-hax></cms-hax>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<cms-hax></cms-hax>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

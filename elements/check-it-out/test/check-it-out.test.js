import { fixture, expect, html } from "@open-wc/testing";

import "../check-it-out.js";

describe("check-it-out test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html` <check-it-out title="test-title"></check-it-out> `
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("check-it-out passes accessibility test", async () => {
    const el = await fixture(html` <check-it-out></check-it-out> `);
    await expect(el).to.be.accessible();
  });
  it("check-it-out passes accessibility negation", async () => {
    const el = await fixture(
      html`<check-it-out aria-labelledby="check-it-out"></check-it-out>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("check-it-out can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<check-it-out .foo=${'bar'}></check-it-out>`);
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
      const el = await fixture(html`<check-it-out ></check-it-out>`);
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
      const el = await fixture(html`<check-it-out></check-it-out>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<check-it-out></check-it-out>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

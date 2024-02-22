import { fixture, expect, html } from "@open-wc/testing";

import "../simple-autocomplete.js";

describe("simple-autocomplete test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <simple-autocomplete title="test-title"></simple-autocomplete>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("simple-autocomplete passes accessibility test", async () => {
    const el = await fixture(
      html` <simple-autocomplete></simple-autocomplete> `
    );
    await expect(el).to.be.accessible();
  });
  it("simple-autocomplete passes accessibility negation", async () => {
    const el = await fixture(
      html`<simple-autocomplete
        aria-labelledby="simple-autocomplete"
      ></simple-autocomplete>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("simple-autocomplete can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<simple-autocomplete .foo=${'bar'}></simple-autocomplete>`);
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
      const el = await fixture(html`<simple-autocomplete ></simple-autocomplete>`);
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
      const el = await fixture(html`<simple-autocomplete></simple-autocomplete>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<simple-autocomplete></simple-autocomplete>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

import { fixture, expect, html } from "@open-wc/testing";

import "../md-extra-icons.js";

describe("md-extra-icons test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <md-extra-icons title="test-title"></md-extra-icons>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("md-extra-icons passes accessibility test", async () => {
    const el = await fixture(html` <md-extra-icons></md-extra-icons> `);
    await expect(el).to.be.accessible();
  });
  it("md-extra-icons passes accessibility negation", async () => {
    const el = await fixture(
      html`<md-extra-icons aria-labelledby="md-extra-icons"></md-extra-icons>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("md-extra-icons can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<md-extra-icons .foo=${'bar'}></md-extra-icons>`);
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
      const el = await fixture(html`<md-extra-icons ></md-extra-icons>`);
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
      const el = await fixture(html`<md-extra-icons></md-extra-icons>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<md-extra-icons></md-extra-icons>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

import { fixture, expect, html } from "@open-wc/testing";

import "../paper-avatar.js";

describe("paper-avatar test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <paper-avatar title="test-title"></paper-avatar>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("paper-avatar passes accessibility test", async () => {
    const el = await fixture(html` <paper-avatar></paper-avatar> `);
    await expect(el).to.be.accessible();
  });
  it("paper-avatar passes accessibility negation", async () => {
    const el = await fixture(
      html`<paper-avatar aria-labelledby="paper-avatar"></paper-avatar>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("paper-avatar can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<paper-avatar .foo=${'bar'}></paper-avatar>`);
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
      const el = await fixture(html`<paper-avatar ></paper-avatar>`);
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
      const el = await fixture(html`<paper-avatar></paper-avatar>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<paper-avatar></paper-avatar>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

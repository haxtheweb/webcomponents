import { fixture, expect, html } from "@open-wc/testing";

import "../mark-the-words.js";

describe("mark-the-words test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html` <mark-the-words></mark-the-words> `
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("mark-the-words passes accessibility test", async () => {
    const el = await fixture(html` <mark-the-words></mark-the-words> `);
    await expect(el).to.be.accessible();
  });
  it("mark-the-words passes accessibility negation", async () => {
    const el = await fixture(
      html`<mark-the-words aria-labelledby="mark-the-words"></mark-the-words>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("mark-the-words can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<mark-the-words .foo=${'bar'}></mark-the-words>`);
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
      const el = await fixture(html`<mark-the-words ></mark-the-words>`);
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
      const el = await fixture(html`<mark-the-words></mark-the-words>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<mark-the-words></mark-the-words>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

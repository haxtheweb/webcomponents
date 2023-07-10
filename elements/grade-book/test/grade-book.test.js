import { fixture, expect, html } from "@open-wc/testing";

import "../grade-book.js";

describe("grade-book test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html` <grade-book-lite
      accent-color="blue"
      source="googledocs"
      source-data="2PACX-1vQWAKQNyYk6TmE6AaArXZNJY6BZxfbzVb3a1zRVYZzPO0HG-Jcjm4yVHWICVgX9jM8Ef_sKYAv3WnRq"
    >
    </grade-book-lite>`
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("grade-book passes accessibility test", async () => {
    const el = await fixture(html` <grade-book></grade-book> `);
    await expect(el).to.be.accessible();
  });
  it("grade-book passes accessibility negation", async () => {
    const el = await fixture(
      html`<grade-book aria-labelledby="grade-book"></grade-book>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("grade-book can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<grade-book .foo=${'bar'}></grade-book>`);
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
      const el = await fixture(html`<grade-book ></grade-book>`);
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
      const el = await fixture(html`<grade-book></grade-book>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<grade-book></grade-book>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

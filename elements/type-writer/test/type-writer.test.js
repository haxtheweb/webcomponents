import { fixture, expect, html } from "@open-wc/testing";

import "../type-writer.js";

describe("type-writer test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <type-writer title="test-title"></type-writer>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("type-writer passes accessibility test", async () => {
    const el = await fixture(html` <type-writer></type-writer> `);
    await expect(el).to.be.accessible();
  });
  it("type-writer passes accessibility negation", async () => {
    const el = await fixture(
      html`<type-writer aria-labelledby="type-writer"></type-writer>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("type-writer can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<type-writer .foo=${'bar'}></type-writer>`);
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
      const el = await fixture(html`<type-writer ></type-writer>`);
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
      const el = await fixture(html`<type-writer></type-writer>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<type-writer></type-writer>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

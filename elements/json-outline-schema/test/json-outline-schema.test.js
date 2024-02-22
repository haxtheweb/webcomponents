import { fixture, expect, html } from "@open-wc/testing";

import "../json-outline-schema.js";

describe("json-outline-schema test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <json-outline-schema title="test-title"></json-outline-schema>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("json-outline-schema passes accessibility test", async () => {
    const el = await fixture(
      html` <json-outline-schema></json-outline-schema> `
    );
    await expect(el).to.be.accessible();
  });
  it("json-outline-schema passes accessibility negation", async () => {
    const el = await fixture(
      html`<json-outline-schema
        aria-labelledby="json-outline-schema"
      ></json-outline-schema>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("json-outline-schema can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<json-outline-schema .foo=${'bar'}></json-outline-schema>`);
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
      const el = await fixture(html`<json-outline-schema ></json-outline-schema>`);
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
      const el = await fixture(html`<json-outline-schema></json-outline-schema>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<json-outline-schema></json-outline-schema>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

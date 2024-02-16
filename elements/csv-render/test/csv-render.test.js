import { fixture, expect, html } from "@open-wc/testing";

import "../csv-render.js";

describe("csv-render test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <csv-render
        data-source="../demo/demo.csv"
        summary="This shows student scores from the previous 12 month period."
        caption="Student semester scores"
      ></csv-render>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("csv-render passes accessibility test", async () => {
    const el = await fixture(html` <csv-render></csv-render> `);
    await expect(el).to.be.accessible();
  });
  it("csv-render passes accessibility negation", async () => {
    const el = await fixture(
      html`<csv-render aria-labelledby="csv-render"></csv-render>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("csv-render can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<csv-render .foo=${'bar'}></csv-render>`);
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
      const el = await fixture(html`<csv-render ></csv-render>`);
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
      const el = await fixture(html`<csv-render></csv-render>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<csv-render></csv-render>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

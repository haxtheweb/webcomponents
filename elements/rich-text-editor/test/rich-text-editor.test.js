import { fixture, expect, html } from "@open-wc/testing";

import "../rich-text-editor.js";

describe("rich-text-editor test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <rich-text-editor>
        <p>
          I'm the <a href="#top">easiest</a> way to implement editable rich
          text.
        </p>
      </rich-text-editor>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("rich-text-editor passes accessibility test", async () => {
    const el = await fixture(html` <rich-text-editor></rich-text-editor> `);
    await expect(el).to.be.accessible();
  });
  it("rich-text-editor passes accessibility negation", async () => {
    const el = await fixture(
      html`<rich-text-editor
        aria-labelledby="rich-text-editor"
      ></rich-text-editor>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("rich-text-editor can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<rich-text-editor .foo=${'bar'}></rich-text-editor>`);
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
      const el = await fixture(html`<rich-text-editor ></rich-text-editor>`);
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
      const el = await fixture(html`<rich-text-editor></rich-text-editor>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<rich-text-editor></rich-text-editor>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

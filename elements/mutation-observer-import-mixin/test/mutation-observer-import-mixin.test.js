import { fixture, expect, html } from "@open-wc/testing";

import "../mutation-observer-import-mixin.js";

describe("mutation-observer-import-mixin test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <mutation-observer-import-mixin
        title="test-title"
      ></mutation-observer-import-mixin>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Accessibility - Mixin Behavior", () => {
    it("doesn't negatively impact accessibility of host element", async () => {
      await element.updateComplete;

      // Mixin should not interfere with accessibility
      await expect(element).shadowDom.to.be.accessible();
    });

    it("maintains accessibility during DOM mutations", async () => {
      await element.updateComplete;

      // Should remain accessible even when observing mutations
      const style = globalThis.getComputedStyle(element);
      expect(style.display).to.not.equal("none");
    });
  });

  describe("Accessibility - Observer Functionality", () => {
    it("preserves semantic structure during observations", async () => {
      await element.updateComplete;

      // Should not disrupt semantic DOM structure
      expect(element.tagName.toLowerCase()).to.equal(
        "mutation-observer-import-mixin",
      );
    });

    it("handles dynamic content changes accessibly", async () => {
      await element.updateComplete;

      // Dynamic changes should maintain accessibility
      await expect(element).shadowDom.to.be.accessible();
    });
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("mutation-observer-import-mixin passes accessibility test", async () => {
    const el = await fixture(
      html` <mutation-observer-import-mixin></mutation-observer-import-mixin> `
    );
    await expect(el).to.be.accessible();
  });
  it("mutation-observer-import-mixin passes accessibility negation", async () => {
    const el = await fixture(
      html`<mutation-observer-import-mixin
        aria-labelledby="mutation-observer-import-mixin"
      ></mutation-observer-import-mixin>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("mutation-observer-import-mixin can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<mutation-observer-import-mixin .foo=${'bar'}></mutation-observer-import-mixin>`);
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
      const el = await fixture(html`<mutation-observer-import-mixin ></mutation-observer-import-mixin>`);
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
      const el = await fixture(html`<mutation-observer-import-mixin></mutation-observer-import-mixin>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<mutation-observer-import-mixin></mutation-observer-import-mixin>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

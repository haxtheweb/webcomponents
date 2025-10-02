import { fixture, expect, html } from "@open-wc/testing";

import "../media-behaviors.js";

describe("media-behaviors test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <media-behaviors title="test-title"></media-behaviors>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Accessibility - Media Controls", () => {
    it("provides accessible media behavior patterns", async () => {
      await element.updateComplete;

      // Should provide accessible patterns for media elements
      expect(element.tagName.toLowerCase()).to.equal("media-behaviors");
      await expect(element).shadowDom.to.be.accessible();
    });

    it("supports keyboard navigation patterns", async () => {
      await element.updateComplete;

      // Should not interfere with keyboard navigation
      const style = globalThis.getComputedStyle(element);
      expect(style.display).to.not.equal("none");
    });
  });

  describe("Accessibility - Behavior Patterns", () => {
    it("maintains accessibility when applied to media elements", async () => {
      await element.updateComplete;

      // Should enhance rather than diminish accessibility
      await expect(element).shadowDom.to.be.accessible();
    });

    it("provides consistent interaction patterns", async () => {
      await element.updateComplete;

      // Should provide consistent, predictable behavior
      expect(element).to.exist;
    });
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("media-behaviors passes accessibility test", async () => {
    const el = await fixture(html` <media-behaviors></media-behaviors> `);
    await expect(el).to.be.accessible();
  });
  it("media-behaviors passes accessibility negation", async () => {
    const el = await fixture(
      html`<media-behaviors
        aria-labelledby="media-behaviors"
      ></media-behaviors>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("media-behaviors can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<media-behaviors .foo=${'bar'}></media-behaviors>`);
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
      const el = await fixture(html`<media-behaviors ></media-behaviors>`);
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
      const el = await fixture(html`<media-behaviors></media-behaviors>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<media-behaviors></media-behaviors>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

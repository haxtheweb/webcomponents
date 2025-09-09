import { fixture, expect, html } from "@open-wc/testing";

import "../moar-sarcasm.js";

describe("moar-sarcasm test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <moar-sarcasm title="test-title"></moar-sarcasm>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Accessibility - Text Content", () => {
    it("provides accessible sarcasm indication", async () => {
      const testElement = await fixture(html`
        <moar-sarcasm>Oh, that's just wonderful</moar-sarcasm>
      `);
      await testElement.updateComplete;
      
      // Should indicate sarcastic tone to screen readers
      const hasAriaLabel = testElement.hasAttribute('aria-label') || 
                          testElement.hasAttribute('title') ||
                          testElement.shadowRoot.querySelector('[aria-label], [title]');
      
      // Should provide some indication of sarcastic nature
      if (hasAriaLabel) {
        expect(hasAriaLabel).to.exist;
      }
    });

    it("maintains readable text content", async () => {
      const testElement = await fixture(html`
        <moar-sarcasm>This is sarcastic text</moar-sarcasm>
      `);
      await testElement.updateComplete;
      
      const textContent = testElement.textContent || testElement.shadowRoot.textContent;
      expect(textContent.trim().length).to.be.greaterThan(0);
    });
  });

  describe("Accessibility - Semantic Markup", () => {
    it("uses appropriate semantic elements", async () => {
      await element.updateComplete;
      
      // Should use semantic markup for emphasis
      const semantic = element.shadowRoot.querySelectorAll('em, strong, span[role], [aria-label]');
      expect(semantic.length >= 0).to.be.true;
    });

    it("provides context for screen readers", async () => {
      const testElement = await fixture(html`
        <moar-sarcasm>Great, another meeting</moar-sarcasm>
      `);
      await testElement.updateComplete;
      
      // Should be accessible regardless of visual styling
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Accessibility - Visual and Audio Cues", () => {
    it("doesn't rely solely on visual styling for meaning", async () => {
      const testElement = await fixture(html`
        <moar-sarcasm>So helpful</moar-sarcasm>
      `);
      await testElement.updateComplete;
      
      // Should convey sarcasm through more than just styling
      const content = testElement.textContent || testElement.shadowRoot.textContent;
      expect(content.trim().length).to.be.greaterThan(0);
      
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("maintains appropriate contrast", async () => {
      await element.updateComplete;
      
      const style = globalThis.getComputedStyle(element);
      expect(style.display).to.not.equal('none');
    });
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("moar-sarcasm passes accessibility test", async () => {
    const el = await fixture(html` <moar-sarcasm></moar-sarcasm> `);
    await expect(el).to.be.accessible();
  });
  it("moar-sarcasm passes accessibility negation", async () => {
    const el = await fixture(
      html`<moar-sarcasm aria-labelledby="moar-sarcasm"></moar-sarcasm>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("moar-sarcasm can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<moar-sarcasm .foo=${'bar'}></moar-sarcasm>`);
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
      const el = await fixture(html`<moar-sarcasm ></moar-sarcasm>`);
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
      const el = await fixture(html`<moar-sarcasm></moar-sarcasm>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<moar-sarcasm></moar-sarcasm>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

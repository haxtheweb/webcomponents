import { fixture, expect, html } from "@open-wc/testing";
import "../elmsln-loading.js";

describe("ElmslnLoading test", () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<elmsln-loading></elmsln-loading>`);
    await element.updateComplete;
  });

  // Basic functionality tests
  it("instantiates the element correctly", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("elmsln-loading");
  });

  it("has correct default property values", () => {
    expect(element.size).to.equal("medium");
    expect(element.dark).to.be.false;
  });

  // Size variation tests
  it("applies different size variations correctly", async () => {
    const sizes = ["tiny", "small", "medium", "large", "epic"];

    for (const size of sizes) {
      element.size = size;
      await element.updateComplete;

      expect(element.size).to.equal(size);
      expect(element.getAttribute("size")).to.equal(size);
    }
  });

  it("renders simple-icon with correct properties", () => {
    const icon = element.shadowRoot.querySelector("simple-icon");

    expect(icon).to.exist;
    expect(icon.getAttribute("icon")).to.equal("lrn:network");
  });

  // Animation tests
  it("includes CSS animations for spinning effect", () => {
    const styles = element.constructor.styles.toString();

    expect(styles).to.include("@keyframes spin");
    expect(styles).to.include("animation: spin");
    expect(styles).to.include("rotate(60deg)");
  });

  it("applies different animation speeds for different sizes", () => {
    const styles = element.constructor.styles.toString();

    expect(styles).to.include("0.75s ease-out infinite"); // tiny
    expect(styles).to.include("1s ease-out infinite"); // small
    expect(styles).to.include("1.25s ease-out infinite"); // medium/large
    expect(styles).to.include("2s ease-out infinite"); // epic
  });

  // SimpleColors integration tests
  it("extends SimpleColors correctly", () => {
    expect(element.colors).to.exist; // Should inherit from SimpleColors
    expect(element.constructor.styles).to.exist;
  });

  it("handles color property changes", async () => {
    element.color = "blue";
    await element.updateComplete;

    expect(element.color).to.equal("blue");
    // Should trigger _getAccentColor method
  });

  it("processes accent color from color property", async () => {
    element.color = "red-text";
    await element.updateComplete;

    // Should strip -text suffix and set accent color
    expect(element.accentColor).to.equal("red");
  });

  it("passes color properties to simple-icon", async () => {
    element.accentColor = "blue";
    element.contrast = 5;
    element.dark = true;

    await element.updateComplete;

    const icon = element.shadowRoot.querySelector("simple-icon");
    expect(icon.getAttribute("accent-color")).to.equal("blue");
    expect(icon.getAttribute("contrast")).to.equal("5");
    expect(icon.hasAttribute("dark")).to.be.true;
  });

  // Size-specific styling tests
  it("applies correct icon dimensions for tiny size", async () => {
    element.size = "tiny";
    await element.updateComplete;

    const styles = element.constructor.styles.toString();
    expect(styles).to.include("--simple-icon-width: 16px");
    expect(styles).to.include("--simple-icon-height: 16px");
  });

  it("applies correct icon dimensions for small size", async () => {
    element.size = "small";
    await element.updateComplete;

    const styles = element.constructor.styles.toString();
    expect(styles).to.include("--simple-icon-width: 32px");
    expect(styles).to.include("--simple-icon-height: 32px");
  });

  it("applies correct icon dimensions for medium size", async () => {
    element.size = "medium";
    await element.updateComplete;

    const styles = element.constructor.styles.toString();
    expect(styles).to.include("--simple-icon-width: 64px");
    expect(styles).to.include("--simple-icon-height: 64px");
  });

  it("applies correct icon dimensions for large size", async () => {
    element.size = "large";
    await element.updateComplete;

    const styles = element.constructor.styles.toString();
    expect(styles).to.include("--simple-icon-width: 80px");
    expect(styles).to.include("--simple-icon-height: 80px");
  });

  it("applies correct icon dimensions for epic size", async () => {
    element.size = "epic";
    await element.updateComplete;

    const styles = element.constructor.styles.toString();
    expect(styles).to.include("--simple-icon-width: 400px");
    expect(styles).to.include("--simple-icon-height: 400px");
  });

  // Accessibility tests
  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("passes the a11y audit with different sizes", async () => {
    const sizes = ["tiny", "small", "medium", "large", "epic"];

    for (const size of sizes) {
      const testElement = await fixture(
        html`<elmsln-loading size="${size}"></elmsln-loading>`,
      );
      await expect(testElement).shadowDom.to.be.accessible();
    }
  });

  it("passes the a11y audit with color variations", async () => {
    const colorElement = await fixture(html`
      <elmsln-loading color="blue" dark></elmsln-loading>
    `);

    await expect(colorElement).shadowDom.to.be.accessible();
  });

  // Property validation tests
  it("handles boolean dark property", async () => {
    element.dark = true;
    await element.updateComplete;

    expect(element.dark).to.be.true;

    const icon = element.shadowRoot.querySelector("simple-icon");
    expect(icon.hasAttribute("dark")).to.be.true;
  });

  it("handles numeric contrast property", async () => {
    element.contrast = 7;
    await element.updateComplete;

    expect(element.contrast).to.equal(7);

    const icon = element.shadowRoot.querySelector("simple-icon");
    expect(icon.getAttribute("contrast")).to.equal("7");
  });

  // Edge cases and error handling
  it("handles invalid size gracefully", async () => {
    element.size = "invalid-size";
    await element.updateComplete;

    expect(element.size).to.equal("invalid-size");
    // Should not throw or break rendering
    expect(element.shadowRoot.querySelector("simple-icon")).to.exist;
  });

  it("handles empty color value", async () => {
    element.color = "";
    await element.updateComplete;

    expect(element.color).to.equal("");
    // Should not break accent color processing
  });

  it("handles null/undefined properties", async () => {
    element.color = null;
    element.contrast = undefined;
    await element.updateComplete;

    // Should handle gracefully without throwing
    const icon = element.shadowRoot.querySelector("simple-icon");
    expect(icon).to.exist;
  });

  // Performance tests
  it("efficiently handles rapid property changes", async () => {
    const sizes = ["tiny", "small", "medium", "large", "epic"];
    const colors = ["red", "blue", "green", "orange", "purple"];

    const startTime = performance.now();

    for (let i = 0; i < 5; i++) {
      element.size = sizes[i % sizes.length];
      element.color = colors[i % colors.length];
      element.dark = i % 2 === 0;
      await element.updateComplete;
    }

    const endTime = performance.now();
    expect(endTime - startTime).to.be.lessThan(50); // Should be fast
  });

  // Visual state tests
  it("uses the correct network icon", () => {
    const icon = element.shadowRoot.querySelector("simple-icon");
    expect(icon.getAttribute("icon")).to.equal("lrn:network");
  });

  it("maintains consistent icon throughout property changes", async () => {
    element.size = "epic";
    element.color = "blue";
    element.dark = true;

    await element.updateComplete;

    const icon = element.shadowRoot.querySelector("simple-icon");
    expect(icon.getAttribute("icon")).to.equal("lrn:network");
  });

  // Integration tests
  it("integrates with HAX iconsets", () => {
    // Should load required iconsets
    const icon = element.shadowRoot.querySelector("simple-icon");
    expect(icon).to.exist;
    expect(icon.getAttribute("icon")).to.include("lrn:");
  });

  // CSS animation testing
  it("applies webkit animation prefixes for browser compatibility", () => {
    const styles = element.constructor.styles.toString();

    expect(styles).to.include("-webkit-animation:");
    expect(styles).to.include("-moz-animation:");
    expect(styles).to.include("-webkit-keyframes");
    expect(styles).to.include("-moz-keyframes");
  });
});

describe("ElmslnLoading A11y tests", () => {
  it("passes accessibility test with default configuration", async () => {
    const el = await fixture(html`<elmsln-loading></elmsln-loading>`);
    await expect(el).shadowDom.to.be.accessible();
  });

  it("maintains accessibility with complex configuration", async () => {
    const el = await fixture(html`
      <elmsln-loading
        size="large"
        color="blue"
        contrast="7"
        dark
      ></elmsln-loading>
    `);
    await expect(el).shadowDom.to.be.accessible();
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("elmsln-loading can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<elmsln-loading .foo=${'bar'}></elmsln-loading>`);
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
      const el = await fixture(html`<elmsln-loading ></elmsln-loading>`);
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
      const el = await fixture(html`<elmsln-loading></elmsln-loading>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<elmsln-loading></elmsln-loading>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

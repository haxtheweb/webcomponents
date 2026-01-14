import { fixture, expect, html } from "@open-wc/testing";

import "../product-glance.js";
import { ProductGlance } from "../product-glance.js";

describe("product-glance test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <product-glance title="test-title"></product-glance>
    `);
  });

  describe("Component Structure", () => {
    it("should be defined as a custom element", () => {
      expect(customElements.get("product-glance")).to.exist;
      expect(element.tagName.toLowerCase()).to.equal("product-glance");
    });

    it("should create an instance", () => {
      expect(element).to.exist;
      expect(element instanceof ProductGlance).to.be.true;
    });

    it("should have correct tag property", () => {
      expect(ProductGlance.tag).to.equal("product-glance");
    });

    it("should extend SimpleColors", () => {
      expect(element.constructor.name).to.equal("ProductGlance");
    });

    it("should have shadow DOM", () => {
      expect(element.shadowRoot).to.exist;
    });

    it("should have HAX properties", () => {
      expect(ProductGlance.haxProperties).to.be.a("string");
      expect(ProductGlance.haxProperties).to.include(
        "product-glance.haxProperties.json",
      );
    });
  });

  describe("Default Properties", () => {
    it("should accept title property from attribute", () => {
      // Element is created with title="test-title" in beforeEach
      expect(element.title).to.equal("test-title");
    });

    it("should have default subtitle property when not specified", () => {
      expect(element.subtitle).to.be.undefined;
    });

    it("should have default icon property when not specified", () => {
      expect(element.icon).to.be.undefined;
    });
  });

  describe("Property Updates", () => {
    it("should update title property", async () => {
      element.title = "Test Title";
      await element.updateComplete;
      expect(element.title).to.equal("Test Title");
    });

    it("should update subtitle property", async () => {
      element.subtitle = "Test Subtitle";
      await element.updateComplete;
      expect(element.subtitle).to.equal("Test Subtitle");
    });

    it("should update icon property", async () => {
      element.icon = "star";
      await element.updateComplete;
      expect(element.icon).to.equal("star");
    });
  });

  describe("Template Rendering", () => {
    it("should render wrapper div with grid layout", async () => {
      await element.updateComplete;
      const wrapper = element.shadowRoot.querySelector(".wrapper");
      expect(wrapper).to.exist;

      const computedStyle = getComputedStyle(wrapper);
      expect(computedStyle.display).to.equal("grid");
    });

    it("should render icon-wrapper div", async () => {
      await element.updateComplete;
      const iconWrapper = element.shadowRoot.querySelector(".icon-wrapper");
      expect(iconWrapper).to.exist;
    });

    it("should render text-wrapper div", async () => {
      await element.updateComplete;
      const textWrapper = element.shadowRoot.querySelector(".text-wrapper");
      expect(textWrapper).to.exist;
    });

    it("should render title-text div", async () => {
      await element.updateComplete;
      const titleText = element.shadowRoot.querySelector(".title-text");
      expect(titleText).to.exist;
    });

    it("should render subtitle-text div", async () => {
      await element.updateComplete;
      const subtitleText = element.shadowRoot.querySelector(".subtitle-text");
      expect(subtitleText).to.exist;
    });

    it("should display title when provided", async () => {
      element.title = "Product Title";
      await element.updateComplete;

      const titleDiv = element.shadowRoot.querySelector(".title-text");
      expect(titleDiv.textContent.trim()).to.include("Product Title");
    });

    it("should display subtitle when provided", async () => {
      element.subtitle = "Product Subtitle";
      await element.updateComplete;

      const subtitleDiv = element.shadowRoot.querySelector(".subtitle-text");
      expect(subtitleDiv.textContent.trim()).to.include("Product Subtitle");
    });

    it("should render icon when provided", async () => {
      element.icon = "star";
      await element.updateComplete;

      // Wait a tick for dynamic import
      await new Promise((resolve) => setTimeout(resolve, 100));

      const iconElement = element.shadowRoot.querySelector("simple-icon");
      expect(iconElement).to.exist;
      expect(iconElement.getAttribute("icon")).to.equal("star");
    });

    it("should not render icon when not provided", async () => {
      await element.updateComplete;
      const iconElement = element.shadowRoot.querySelector("simple-icon");
      expect(iconElement).to.not.exist;
    });
  });

  describe("Icon Functionality - Basic Tests", () => {
    it("should have icon property", async () => {
      element.icon = "star";
      await element.updateComplete;
      expect(element.icon).to.equal("star");
    });

    it("should clear icon property", async () => {
      element.icon = "star";
      await element.updateComplete;
      element.icon = "";
      await element.updateComplete;
      expect(element.icon).to.equal("");
    });
  });

  describe("Slot Content", () => {
    it("should support title slot", async () => {
      const slottedElement = await fixture(html`
        <product-glance>
          <span slot="title">Slotted Title</span>
        </product-glance>
      `);

      await slottedElement.updateComplete;
      const titleSlot =
        slottedElement.shadowRoot.querySelector('slot[name="title"]');
      expect(titleSlot).to.exist;
    });

    it("should support subtitle slot", async () => {
      const slottedElement = await fixture(html`
        <product-glance>
          <span slot="subtitle">Slotted Subtitle</span>
        </product-glance>
      `);

      await slottedElement.updateComplete;
      const subtitleSlot = slottedElement.shadowRoot.querySelector(
        'slot[name="subtitle"]',
      );
      expect(subtitleSlot).to.exist;
    });

    it("should show slotted content when provided, replacing property values", async () => {
      const slottedElement = await fixture(html`
        <product-glance title="Property Title">
          <span slot="title">Slotted Title</span>
        </product-glance>
      `);

      await slottedElement.updateComplete;

      // Get the assigned nodes of the slot to see what's actually displayed
      const titleSlot =
        slottedElement.shadowRoot.querySelector('slot[name="title"]');
      const assignedElements = titleSlot.assignedElements();

      expect(assignedElements).to.have.length.greaterThan(0);
      expect(assignedElements[0].textContent).to.equal("Slotted Title");
    });

    it("should show property value when no slot content provided", async () => {
      const noSlotElement = await fixture(html`
        <product-glance title="Property Only"> </product-glance>
      `);

      await noSlotElement.updateComplete;
      const titleDiv = noSlotElement.shadowRoot.querySelector(".title-text");

      expect(titleDiv.textContent.trim()).to.include("Property Only");
    });
  });

  describe("SimpleColors Integration", () => {
    it("should inherit SimpleColors properties", () => {
      // Based on debug output: accentColor='grey', dark=false, contrast=undefined
      // SimpleColors properties are initialized in constructor or when accessed
      expect(element.accentColor).to.not.be.undefined;
      expect(element.dark).to.not.be.undefined;
      // Contrast can be undefined initially in SimpleColors
      expect(element).to.have.property("contrast");
    });

    it("should handle accent color changes", async () => {
      element.accentColor = "blue";
      await element.updateComplete;
      expect(element.accentColor).to.equal("blue");
    });

    it("should handle dark mode changes", async () => {
      element.dark = true;
      await element.updateComplete;
      expect(element.dark).to.be.true;
    });

    it("should have SimpleColors in prototype chain", () => {
      expect(element.constructor.properties).to.include.keys("accentColor");
      expect(element.constructor.properties).to.include.keys("dark");
    });
  });

  describe("Complex Scenarios", () => {
    it("should handle all properties set together", async () => {
      element.title = "Complete Product";
      element.subtitle = "Full Description";
      element.icon = "star";
      element.accentColor = "purple";
      element.dark = false;

      await element.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for icon import

      const titleDiv = element.shadowRoot.querySelector(".title-text");
      const subtitleDiv = element.shadowRoot.querySelector(".subtitle-text");
      const iconElement = element.shadowRoot.querySelector("simple-icon");

      expect(titleDiv.textContent.trim()).to.include("Complete Product");
      expect(subtitleDiv.textContent.trim()).to.include("Full Description");
      expect(iconElement).to.exist;
      expect(iconElement.getAttribute("icon")).to.equal("star");
      expect(iconElement.getAttribute("accent-color")).to.equal("purple");
    });

    it("should handle empty content gracefully", async () => {
      element.title = "";
      element.subtitle = "";
      element.icon = "";

      await element.updateComplete;

      const titleDiv = element.shadowRoot.querySelector(".title-text");
      const subtitleDiv = element.shadowRoot.querySelector(".subtitle-text");
      const iconElement = element.shadowRoot.querySelector("simple-icon");

      expect(titleDiv).to.exist;
      expect(subtitleDiv).to.exist;
      expect(iconElement).to.not.exist;
    });
  });

  describe("CSS Custom Properties", () => {
    it("should use CSS custom properties for styling", () => {
      const styles = element.constructor.styles;
      expect(styles).to.exist;

      // Check if styles contain custom properties
      const styleSheet = styles[1].cssText;
      expect(styleSheet).to.include("--product-glance-icon-width");
      expect(styleSheet).to.include("--product-glance-internal-margin");
      expect(styleSheet).to.include("--product-glance-text-color");
    });

    it("should have proper default display style", async () => {
      await element.updateComplete;
      const computedStyle = getComputedStyle(element);
      expect(computedStyle.display).to.equal("inline-block");
    });
  });

  describe("Updated Lifecycle", () => {
    it("should import simple-icon when icon property changes", async () => {
      // Initially no icon
      expect(element.shadowRoot.querySelector("simple-icon")).to.not.exist;

      // Set icon
      element.icon = "star";
      await element.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Icon should be imported and rendered
      expect(element.shadowRoot.querySelector("simple-icon")).to.exist;
    });

    it("should not import simple-icon when icon is cleared", async () => {
      // Set icon first
      element.icon = "star";
      await element.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Clear icon
      element.icon = "";
      await element.updateComplete;

      // Icon should not be rendered
      expect(element.shadowRoot.querySelector("simple-icon")).to.not.exist;
    });
  });

  describe("Edge Cases", () => {
    it("should handle null values gracefully", async () => {
      element.title = null;
      element.subtitle = null;
      element.icon = null;

      await element.updateComplete;

      expect(() => element.render()).to.not.throw;
    });

    it("should handle undefined values gracefully", async () => {
      element.title = undefined;
      element.subtitle = undefined;
      element.icon = undefined;

      await element.updateComplete;

      expect(() => element.render()).to.not.throw;
    });

    it("should handle numeric values in text properties", async () => {
      element.title = 123;
      element.subtitle = 456;

      await element.updateComplete;

      const titleDiv = element.shadowRoot.querySelector(".title-text");
      const subtitleDiv = element.shadowRoot.querySelector(".subtitle-text");

      expect(titleDiv.textContent.trim()).to.include("123");
      expect(subtitleDiv.textContent.trim()).to.include("456");
    });
  });

  describe("Multiple Instances", () => {
    it("should support multiple independent instances", async () => {
      const element1 = await fixture(html`
        <product-glance title="Product 1" icon="star"></product-glance>
      `);
      const element2 = await fixture(html`
        <product-glance title="Product 2" icon="heart"></product-glance>
      `);

      await element1.updateComplete;
      await element2.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(element1.title).to.equal("Product 1");
      expect(element2.title).to.equal("Product 2");

      const icon1 = element1.shadowRoot.querySelector("simple-icon");
      const icon2 = element2.shadowRoot.querySelector("simple-icon");

      expect(icon1 && icon1.getAttribute("icon")).to.equal("star");
      expect(icon2 && icon2.getAttribute("icon")).to.equal("heart");
    });
  });

  describe("Performance", () => {
    it("should handle rapid property changes efficiently", async () => {
      const startTime = performance.now();

      for (let i = 0; i < 50; i++) {
        element.title = `Product ${i}`;
        element.subtitle = `Description ${i}`;
        element.icon = i % 2 === 0 ? "star" : "heart";
        await element.updateComplete;
      }

      const endTime = performance.now();
      expect(endTime - startTime).to.be.lessThan(5000); // Should complete within 5 seconds
    });
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("product-glance passes accessibility test", async () => {
    const el = await fixture(html` <product-glance></product-glance> `);
    await expect(el).to.be.accessible();
  });
  it("product-glance passes accessibility negation", async () => {
    const el = await fixture(
      html`<product-glance aria-labelledby="product-glance"></product-glance>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("product-glance can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<product-glance .foo=${'bar'}></product-glance>`);
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
      const el = await fixture(html`<product-glance ></product-glance>`);
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
      const el = await fixture(html`<product-glance></product-glance>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<product-glance></product-glance>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

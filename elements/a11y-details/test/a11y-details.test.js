import { fixture, expect, html } from "@open-wc/testing";
import "../a11y-details.js";

describe("a11y-details test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <a11y-details>
        <span slot="summary">Click to expand</span>
        <div slot="details">
          <p>This is the detailed content that can be shown or hidden.</p>
          <p>It supports multiple paragraphs and complex content.</p>
        </div>
      </a11y-details>
    `);
  });

  it("basic setup", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("a11y-details");
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Slot functionality", () => {
    it("should have summary slot with correct content", () => {
      const summarySlot = element.shadowRoot.querySelector(
        'slot[name="summary"]',
      );
      expect(summarySlot).to.exist;
      const assignedNodes = summarySlot.assignedNodes({ flatten: true });
      expect(assignedNodes.length).to.be.greaterThan(0);
      expect(assignedNodes[0].textContent).to.equal("Click to expand");
    });

    it("should have details slot with correct content", () => {
      const detailsSlot = element.shadowRoot.querySelector(
        'slot[name="details"]',
      );
      expect(detailsSlot).to.exist;
      const assignedNodes = detailsSlot.assignedNodes({ flatten: true });
      expect(assignedNodes.length).to.be.greaterThan(0);
    });

    it("should have default hidden slot", () => {
      const defaultSlot = element.shadowRoot.querySelector(
        "slot[hidden]:not([name])",
      );
      expect(defaultSlot).to.exist;
    });
  });

  describe("Property type validation with accessibility", () => {
    let testElement;

    beforeEach(async () => {
      testElement = await fixture(html`
        <a11y-details>
          <span slot="summary">Test Summary</span>
          <div slot="details">Test details content</div>
        </a11y-details>
      `);
      await testElement.updateComplete;
    });

    describe("closeText property", () => {
      it("should accept valid string values and maintain accessibility", async () => {
        testElement.closeText = "Hide Details";
        await testElement.updateComplete;
        expect(testElement.closeText).to.equal("Hide Details");
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.closeText = "Close";
        await testElement.updateComplete;
        expect(testElement.closeText).to.equal("Close");
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.closeText = "Less";
        await testElement.updateComplete;
        expect(testElement.closeText).to.equal("Less");
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should accept non-string values but maintain type in JavaScript", async () => {
        testElement.closeText = 123;
        await testElement.updateComplete;
        expect(testElement.closeText).to.equal(123);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.closeText = true;
        await testElement.updateComplete;
        expect(testElement.closeText).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.closeText = null;
        await testElement.updateComplete;
        expect(testElement.closeText).to.equal(null);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.closeText = undefined;
        await testElement.updateComplete;
        expect(testElement.closeText).to.equal(undefined);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should accept falsy values and maintain accessibility", async () => {
        testElement.closeText = "";
        await testElement.updateComplete;
        expect(testElement.closeText).to.equal("");
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.closeText = 0;
        await testElement.updateComplete;
        expect(testElement.closeText).to.equal(0);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.closeText = false;
        await testElement.updateComplete;
        expect(testElement.closeText).to.equal(false);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.closeText).to.equal("");
      });
    });

    describe("openText property", () => {
      it("should accept valid string values and maintain accessibility", async () => {
        testElement.openText = "Show Details";
        await testElement.updateComplete;
        expect(testElement.openText).to.equal("Show Details");
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.openText = "Open";
        await testElement.updateComplete;
        expect(testElement.openText).to.equal("Open");
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.openText = "More";
        await testElement.updateComplete;
        expect(testElement.openText).to.equal("More");
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should accept non-string values but maintain type in JavaScript", async () => {
        testElement.openText = 456;
        await testElement.updateComplete;
        expect(testElement.openText).to.equal(456);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.openText = false;
        await testElement.updateComplete;
        expect(testElement.openText).to.equal(false);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.openText = [];
        await testElement.updateComplete;
        expect(testElement.openText).to.deep.equal([]);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.openText = {};
        await testElement.updateComplete;
        expect(testElement.openText).to.deep.equal({});
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should accept falsy values and maintain accessibility", async () => {
        testElement.openText = "";
        await testElement.updateComplete;
        expect(testElement.openText).to.equal("");
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.openText = null;
        await testElement.updateComplete;
        expect(testElement.openText).to.equal(null);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.openText = undefined;
        await testElement.updateComplete;
        expect(testElement.openText).to.equal(undefined);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.openText).to.equal("");
      });
    });
  });

  describe("Attribute to property mapping", () => {
    it("should set closeText property from close-text attribute", async () => {
      const testElement = await fixture(html`
        <a11y-details close-text="Hide Info">
          <span slot="summary">Summary</span>
          <div slot="details">Details</div>
        </a11y-details>
      `);
      expect(testElement.closeText).to.equal("Hide Info");
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should set openText property from open-text attribute", async () => {
      const testElement = await fixture(html`
        <a11y-details open-text="Show Info">
          <span slot="summary">Summary</span>
          <div slot="details">Details</div>
        </a11y-details>
      `);
      expect(testElement.openText).to.equal("Show Info");
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should reflect closeText property to close-text attribute", async () => {
      const testElement = await fixture(html`
        <a11y-details>
          <span slot="summary">Summary</span>
          <div slot="details">Details</div>
        </a11y-details>
      `);

      testElement.closeText = "Hide Content";
      await testElement.updateComplete;
      expect(testElement.getAttribute("close-text")).to.equal("Hide Content");
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should reflect openText property to open-text attribute", async () => {
      const testElement = await fixture(html`
        <a11y-details>
          <span slot="summary">Summary</span>
          <div slot="details">Details</div>
        </a11y-details>
      `);

      testElement.openText = "Show Content";
      await testElement.updateComplete;
      expect(testElement.getAttribute("open-text")).to.equal("Show Content");
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Accessibility scenarios with different property combinations", () => {
    it("should remain accessible with custom open and close text", async () => {
      const testElement = await fixture(html`
        <a11y-details open-text="Show More" close-text="Show Less">
          <span slot="summary">Information</span>
          <div slot="details">
            <h3>Additional Information</h3>
            <p>This is some detailed information that can be toggled.</p>
          </div>
        </a11y-details>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible with only open text", async () => {
      const testElement = await fixture(html`
        <a11y-details open-text="Expand">
          <span slot="summary">Click to expand</span>
          <div slot="details">Expanded content here.</div>
        </a11y-details>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible with only close text", async () => {
      const testElement = await fixture(html`
        <a11y-details close-text="Collapse">
          <span slot="summary">Click to expand</span>
          <div slot="details">Expanded content here.</div>
        </a11y-details>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible with empty text properties", async () => {
      const testElement = await fixture(html`
        <a11y-details open-text="" close-text="">
          <span slot="summary">Static summary</span>
          <div slot="details">Details content</div>
        </a11y-details>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible with complex slotted content", async () => {
      const testElement = await fixture(html`
        <a11y-details open-text="Show Details" close-text="Hide Details">
          <div slot="summary">
            <strong>Complex Summary</strong>
            <em>with multiple elements</em>
          </div>
          <div slot="details">
            <h2>Detailed Information</h2>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
              <li>Item 3</li>
            </ul>
            <p>Additional paragraph with <a href="#">link</a>.</p>
          </div>
        </a11y-details>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Interactive functionality and accessibility", () => {
    it("should maintain accessibility when toggling details programmatically", async () => {
      const testElement = await fixture(html`
        <a11y-details>
          <span slot="summary">Toggle Me</span>
          <div slot="details">Hidden content</div>
        </a11y-details>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();

      // Test toggle functionality
      if (testElement.toggleOpen) {
        testElement.toggleOpen();
        await testElement.updateComplete;
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.toggleOpen();
        await testElement.updateComplete;
        await expect(testElement).shadowDom.to.be.accessible();
      }
    });

    it("should have proper ARIA attributes and roles", async () => {
      const testElement = await fixture(html`
        <a11y-details>
          <span slot="summary">Accessible Summary</span>
          <div slot="details">Accessible details</div>
        </a11y-details>
      `);
      await testElement.updateComplete;

      const summary = testElement.shadowRoot.querySelector("summary");
      expect(summary).to.exist;
      expect(summary.getAttribute("role")).to.equal("button");
      expect(summary.getAttribute("tabindex")).to.equal("0");

      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle keyboard interactions accessibly", async () => {
      const testElement = await fixture(html`
        <a11y-details>
          <span slot="summary">Keyboard Test</span>
          <div slot="details">Content for keyboard test</div>
        </a11y-details>
      `);
      await testElement.updateComplete;

      const summary = testElement.shadowRoot.querySelector("summary");
      expect(summary).to.exist;

      // Test that the summary is focusable
      summary.focus();
      expect(globalThis.document.activeElement).to.equal(testElement);

      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Dynamic content and slot changes", () => {
    it("should remain accessible when slot content changes", async () => {
      const testElement = await fixture(html`
        <a11y-details>
          <span slot="summary">Original Summary</span>
          <div slot="details">Original details</div>
        </a11y-details>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();

      // Change summary content
      const summaryElement = testElement.querySelector('[slot="summary"]');
      summaryElement.textContent = "Updated Summary";
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();

      // Change details content
      const detailsElement = testElement.querySelector('[slot="details"]');
      detailsElement.innerHTML =
        "<p>Updated details with <strong>formatting</strong></p>";
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible with programmatic text updates", async () => {
      const testElement = await fixture(html`
        <a11y-details>
          <span slot="summary">Summary</span>
          <div slot="details">Details</div>
        </a11y-details>
      `);
      await testElement.updateComplete;

      // Update properties programmatically
      testElement.openText = "View Details";
      testElement.closeText = "Hide Details";
      await testElement.updateComplete;

      expect(testElement.openText).to.equal("View Details");
      expect(testElement.closeText).to.equal("Hide Details");
      await expect(testElement).shadowDom.to.be.accessible();

      // Clear properties
      testElement.openText = "";
      testElement.closeText = "";
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Edge cases and error handling", () => {
    it("should remain accessible with no slotted content", async () => {
      const testElement = await fixture(html` <a11y-details></a11y-details> `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible with only summary slot", async () => {
      const testElement = await fixture(html`
        <a11y-details>
          <span slot="summary">Only summary</span>
        </a11y-details>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible with only details slot", async () => {
      const testElement = await fixture(html`
        <a11y-details>
          <div slot="details">Only details</div>
        </a11y-details>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle malformed or unusual text values", async () => {
      const testElement = await fixture(html`
        <a11y-details>
          <span slot="summary">Test Summary</span>
          <div slot="details">Test details</div>
        </a11y-details>
      `);

      // Test with various unusual values
      const unusualValues = [
        "   \t\n   ", // whitespace
        "<script>alert('test')</script>", // potentially dangerous content
        "\u00A0\u2000\u2001", // various unicode spaces
        "🚀 emoji content 🎉", // emoji
        "Very long text that might cause layout issues or accessibility problems when used as button text for the summary element",
        "Multi\nline\ntext", // multiline
        "Text with 'quotes' and \"double quotes\" and special chars: !@#$%^&*()",
      ];

      for (const value of unusualValues) {
        testElement.openText = value;
        testElement.closeText = value;
        await testElement.updateComplete;

        expect(testElement.openText).to.equal(value);
        expect(testElement.closeText).to.equal(value);
        await expect(testElement).shadowDom.to.be.accessible();
      }
    });

    it("should maintain accessibility with native details elements in default slot", async () => {
      const testElement = await fixture(html`
        <a11y-details>
          <details>
            <summary>Native details summary</summary>
            <p>Native details content</p>
          </details>
        </a11y-details>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("HAX Properties and Integration", () => {
    it("should have haxProperties defined", () => {
      expect(element.constructor.haxProperties).to.exist;
      expect(element.constructor.haxProperties.gizmo).to.exist;
      expect(element.constructor.haxProperties.settings).to.exist;
    });

    it("should maintain accessibility with HAX demo schema", async () => {
      const demoSchema = element.constructor.haxProperties.demoSchema[0];
      const haxTestElement = await fixture(html`
        <a11y-details
          open-text="${demoSchema.properties.openText}"
          close-text="${demoSchema.properties.closeText}"
        >
          ${html([demoSchema.content])}
        </a11y-details>
      `);
      await haxTestElement.updateComplete;
      await expect(haxTestElement).shadowDom.to.be.accessible();
    });
  });
});

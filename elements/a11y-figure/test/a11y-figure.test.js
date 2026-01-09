import { fixture, expect, html } from "@open-wc/testing";
import "../a11y-figure.js";

describe("a11y-figure test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <a11y-figure
        img-src="https://placehold.co/400x300"
        img-alt="Placeholder image"
      >
        <p slot="figcaption">Figure caption text</p>
        <div slot="summary">Image description</div>
        <div slot="details">
          Detailed image description with more information about the image.
        </div>
      </a11y-figure>
    `);
  });

  it("basic setup", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("a11y-figure");
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Slot functionality", () => {
    it("should have figcaption slot with correct content", () => {
      const slot = element.shadowRoot.querySelector('slot[name="figcaption"]');
      expect(slot).to.exist;
      const assignedNodes = slot.assignedNodes({ flatten: true });
      expect(assignedNodes.length).to.be.greaterThan(0);
      expect(assignedNodes[0].textContent).to.equal("Figure caption text");
    });

    it("should have image slot", () => {
      const slot = element.shadowRoot.querySelector('slot[name="image"]');
      expect(slot).to.exist;
    });

    it("should have summary slot", () => {
      // The summary slot is nested within the a11y-details component
      const a11yDetails = element.shadowRoot.querySelector("a11y-details");
      expect(a11yDetails).to.exist;
      // We can't directly test the slot content due to shadow DOM encapsulation,
      // but we can ensure our component passes it correctly
      const slotContainer = element.querySelector('[slot="summary"]');
      expect(slotContainer).to.exist;
      expect(slotContainer.textContent).to.equal("Image description");
    });

    it("should have details slot", () => {
      const slotContainer = element.querySelector('[slot="details"]');
      expect(slotContainer).to.exist;
      expect(slotContainer.textContent).to.contain(
        "Detailed image description",
      );
    });

    it("should have default hidden slot", () => {
      const defaultSlot = element.shadowRoot.querySelector("slot[hidden]");
      expect(defaultSlot).to.exist;
    });
  });

  describe("Property type validation with accessibility", () => {
    let testElement;

    beforeEach(async () => {
      testElement = await fixture(html`
        <a11y-figure>
          <p slot="figcaption">Test Figure</p>
        </a11y-figure>
      `);
      await testElement.updateComplete;
    });

    describe("imgSrc property", () => {
      it("should accept valid URL values and maintain accessibility", async () => {
        testElement.imgSrc = "https://placehold.co/400x300";
        await testElement.updateComplete;
        expect(testElement.imgSrc).to.equal("https://placehold.co/400x300");
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.imgSrc =
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        await testElement.updateComplete;
        expect(testElement.imgSrc).to.equal(
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        );
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.imgSrc = "";
        await testElement.updateComplete;
        expect(testElement.imgSrc).to.equal("");
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should accept non-string values but maintain type in JavaScript", async () => {
        testElement.imgSrc = 123;
        await testElement.updateComplete;
        expect(testElement.imgSrc).to.equal(123);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.imgSrc = true;
        await testElement.updateComplete;
        expect(testElement.imgSrc).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.imgSrc = null;
        await testElement.updateComplete;
        expect(testElement.imgSrc).to.equal(null);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.imgSrc = undefined;
        await testElement.updateComplete;
        expect(testElement.imgSrc).to.equal(undefined);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.imgSrc).to.be.undefined;
      });
    });

    describe("imgAlt property", () => {
      it("should accept string values and maintain accessibility", async () => {
        testElement.imgAlt = "Test alt text";
        await testElement.updateComplete;
        expect(testElement.imgAlt).to.equal("Test alt text");
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.imgAlt = "";
        await testElement.updateComplete;
        expect(testElement.imgAlt).to.equal("");
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.imgAlt =
          "Long descriptive alt text for a complex image that provides context for screen reader users";
        await testElement.updateComplete;
        expect(testElement.imgAlt).to.equal(
          "Long descriptive alt text for a complex image that provides context for screen reader users",
        );
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should accept non-string values but maintain type in JavaScript", async () => {
        testElement.imgAlt = 456;
        await testElement.updateComplete;
        expect(testElement.imgAlt).to.equal(456);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.imgAlt = false;
        await testElement.updateComplete;
        expect(testElement.imgAlt).to.equal(false);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.imgAlt = null;
        await testElement.updateComplete;
        expect(testElement.imgAlt).to.equal(null);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.imgAlt).to.be.undefined;
      });
    });

    describe("__hasDetail property (internal)", () => {
      it("should be set correctly when details or summary slots are used", async () => {
        // No summary or details initially
        expect(testElement.__hasDetail).to.be.false;

        // Add a summary element
        const summaryElem = document.createElement("div");
        summaryElem.setAttribute("slot", "summary");
        summaryElem.textContent = "Test Summary";
        testElement.appendChild(summaryElem);
        await testElement.updateComplete;

        // Test that __hasDetail is now true
        expect(testElement.__hasDetail).to.be.true;
        await expect(testElement).shadowDom.to.be.accessible();

        // Remove the summary element
        testElement.removeChild(summaryElem);

        // Add a details element
        const detailsElem = document.createElement("div");
        detailsElem.setAttribute("slot", "details");
        detailsElem.textContent = "Test Details";
        testElement.appendChild(detailsElem);
        await testElement.updateComplete;

        // Test that __hasDetail remains true
        expect(testElement.__hasDetail).to.be.true;
        await expect(testElement).shadowDom.to.be.accessible();
      });
    });

    // Inherits openText and closeText from a11y-details, so test those too
    describe("inherited openText property", () => {
      it("should accept valid string values and maintain accessibility", async () => {
        testElement.openText = "Show More Details";
        await testElement.updateComplete;
        expect(testElement.openText).to.equal("Show More Details");
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.openText).to.equal("");
      });
    });

    describe("inherited closeText property", () => {
      it("should accept valid string values and maintain accessibility", async () => {
        testElement.closeText = "Hide Details";
        await testElement.updateComplete;
        expect(testElement.closeText).to.equal("Hide Details");
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.closeText).to.equal("");
      });
    });
  });

  describe("Attribute to property mapping", () => {
    it("should set imgSrc property from img-src attribute", async () => {
      const testElement = await fixture(html`
        <a11y-figure img-src="https://placehold.co/200x100">
          <p slot="figcaption">Test Figure</p>
        </a11y-figure>
      `);
      expect(testElement.imgSrc).to.equal("https://placehold.co/200x100");
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should set imgAlt property from img-alt attribute", async () => {
      const testElement = await fixture(html`
        <a11y-figure img-alt="Test alt text">
          <p slot="figcaption">Test Figure</p>
        </a11y-figure>
      `);
      expect(testElement.imgAlt).to.equal("Test alt text");
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Accessibility scenarios with different property combinations", () => {
    it("should remain accessible with image and alt text", async () => {
      const testElement = await fixture(html`
        <a11y-figure
          img-src="https://placehold.co/200x100"
          img-alt="Placeholder image"
        >
          <p slot="figcaption">Simple figure</p>
        </a11y-figure>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible with custom open and close text", async () => {
      const testElement = await fixture(html`
        <a11y-figure
          img-src="https://placehold.co/200x100"
          img-alt="Placeholder image"
          open-text="Show Description"
          close-text="Hide Description"
        >
          <p slot="figcaption">Figure with description</p>
          <div slot="summary">Image Description</div>
          <div slot="details">Detailed description of the image.</div>
        </a11y-figure>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible with only image and no details", async () => {
      const testElement = await fixture(html`
        <a11y-figure
          img-src="https://placehold.co/200x100"
          img-alt="Placeholder image"
        >
          <p slot="figcaption">Figure without details</p>
        </a11y-figure>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible with slotted image instead of src", async () => {
      const testElement = await fixture(html`
        <a11y-figure>
          <img
            slot="image"
            src="https://placehold.co/200x100"
            alt="Slotted placeholder"
          />
          <p slot="figcaption">Figure with slotted image</p>
        </a11y-figure>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible with no image and only description", async () => {
      const testElement = await fixture(html`
        <a11y-figure>
          <p slot="figcaption">Figure without image</p>
          <div slot="summary">Description</div>
          <div slot="details">This figure has description but no image.</div>
        </a11y-figure>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Interactive functionality and accessibility", () => {
    it("should maintain accessibility when interacting with the nested a11y-details", async () => {
      const testElement = await fixture(html`
        <a11y-figure
          img-src="https://placehold.co/200x100"
          img-alt="Placeholder image"
          open-text="Show"
          close-text="Hide"
        >
          <p slot="figcaption">Interactive figure</p>
          <div slot="summary">Description</div>
          <div slot="details">Hidden description content.</div>
        </a11y-figure>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();

      // This is a bit limited since we can't directly access the nested a11y-details component
      // due to shadow DOM encapsulation, but we're testing the setup is accessible
      const nestedA11yDetails =
        testElement.shadowRoot.querySelector("a11y-details");
      expect(nestedA11yDetails).to.exist;
      expect(nestedA11yDetails.getAttribute("open-text")).to.equal("Show");
      expect(nestedA11yDetails.getAttribute("close-text")).to.equal("Hide");
    });
  });

  describe("Edge cases and error handling", () => {
    it("should remain accessible with malformed image URL", async () => {
      const testElement = await fixture(html`
        <a11y-figure img-src="invalid-url" img-alt="Invalid image">
          <p slot="figcaption">Figure with invalid image URL</p>
        </a11y-figure>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible with empty figcaption", async () => {
      const testElement = await fixture(html`
        <a11y-figure
          img-src="https://placehold.co/200x100"
          img-alt="Placeholder image"
        >
          <p slot="figcaption"></p>
        </a11y-figure>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible with no figcaption", async () => {
      const testElement = await fixture(html`
        <a11y-figure
          img-src="https://placehold.co/200x100"
          img-alt="Placeholder image"
        >
        </a11y-figure>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible with missing alt text but still provide a placeholder", async () => {
      const testElement = await fixture(html`
        <a11y-figure img-src="https://placehold.co/200x100">
          <p slot="figcaption">Figure with missing alt text</p>
        </a11y-figure>
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
      expect(element.constructor.haxProperties.demoSchema).to.exist;
    });

    it("should handle HAX image upload integration", () => {
      const haxProps = element.constructor.haxProperties;
      const configItems = haxProps.settings.configure;

      // Verify imgSrc property has haxupload input method
      const imgSrcProp = configItems.find((item) => item.property === "imgSrc");
      expect(imgSrcProp).to.exist;
      expect(imgSrcProp.inputMethod).to.equal("haxupload");

      // Verify imgAlt property exists and is required
      const imgAltProp = configItems.find((item) => item.property === "imgAlt");
      expect(imgAltProp).to.exist;
      expect(imgAltProp.required).to.be.true;
    });

    it("should maintain accessibility with HAX demo schema", async () => {
      const demoSchema = element.constructor.haxProperties.demoSchema[0];
      const haxTestElement = await fixture(html`
        <a11y-figure
          img-src="${demoSchema.properties.imgSrc}"
          img-alt="${demoSchema.properties.imgAlt}"
          open-text="${demoSchema.properties.openText}"
          close-text="${demoSchema.properties.closeText}"
          style="${demoSchema.properties.style}"
        >
          ${html([demoSchema.content])}
        </a11y-figure>
      `);
      await haxTestElement.updateComplete;
      await expect(haxTestElement).shadowDom.to.be.accessible();
    });
  });
});

import { fixture, expect, html } from "@open-wc/testing";
import "../a11y-compare-image.js";

describe("a11y-compare-image test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html` <a11y-compare-image opacity>
        <h2 slot="heading">Matterhorn comparison</h2>
        <p slot="description">
          The image on the top or when slider is moved all the way to the right
          is the
          <span id="cloudy">Matterhorn on a cloudy day without snow</span>. As
          you move the slider to the left, the image below it reveals the
          <span id="snowy">Matterhorn on a clear day with snow</span>.
        </p>
        <img
          slot="top"
          aria-describedBy="cloudy"
          .src="${new URL("../demo/images/Eagle500.jpg", import.meta.url).href}"
          alt="Matterhorn without snow"
        />
        <img
          slot="bottom"
          aria-describedBy="snowy"
          .src="${new URL("../demo/images/Beaver2.jpg", import.meta.url).href}"
          alt="Matterhorn with snow"
        />
      </a11y-compare-image>`,
    );
  });

  it("basic setup", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("a11y-compare-image");
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Slot functionality", () => {
    it("should have heading slot with correct content", () => {
      const slot = element.shadowRoot.querySelector('slot[name="heading"]');
      expect(slot).to.exist;
      expect(slot.assignedNodes({ flatten: true })[0].textContent).to.equal(
        "Matterhorn comparison",
      );
    });

    it("should have description slot with correct content", () => {
      const slot = element.shadowRoot.querySelector('slot[name="description"]');
      expect(slot).to.exist;
      expect(slot.assignedNodes({ flatten: true })[0]).to.exist;
    });

    it("should have top slot for upper image", () => {
      const slot = element.shadowRoot.querySelector('slot[name="top"]');
      expect(slot).to.exist;
    });

    it("should have bottom slot for lower image", () => {
      const slot = element.shadowRoot.querySelector('slot[name="bottom"]');
      expect(slot).to.exist;
    });

    it("should have default slot", () => {
      const defaultSlot = element.shadowRoot.querySelector('slot:not([name])');
      expect(defaultSlot).to.exist;
    });
  });

  describe("Property type validation with accessibility", () => {
    let testElement;

    beforeEach(async () => {
      testElement = await fixture(html`
        <a11y-compare-image>
          <h2 slot="heading">Test Heading</h2>
          <p slot="description">Test description</p>
          <img slot="top" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Top image" />
          <img slot="bottom" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Bottom image" />
        </a11y-compare-image>
      `);
      await testElement.updateComplete;
    });

    describe("activeLayer property", () => {
      it("should accept valid Number values and maintain accessibility", async () => {
        testElement.activeLayer = 1;
        await testElement.updateComplete;
        expect(testElement.activeLayer).to.equal(1);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.activeLayer = 2;
        await testElement.updateComplete;
        expect(testElement.activeLayer).to.equal(2);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.activeLayer = 0;
        await testElement.updateComplete;
        expect(testElement.activeLayer).to.equal(0);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should accept non-Number values but maintain type in JavaScript", async () => {
        testElement.activeLayer = "2";
        await testElement.updateComplete;
        expect(testElement.activeLayer).to.equal("2");
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.activeLayer = true;
        await testElement.updateComplete;
        expect(testElement.activeLayer).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.activeLayer = null;
        await testElement.updateComplete;
        expect(testElement.activeLayer).to.equal(null);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.activeLayer).to.be.undefined;
      });
    });

    describe("opacity property", () => {
      it("should accept boolean values and maintain accessibility", async () => {
        testElement.opacity = true;
        await testElement.updateComplete;
        expect(testElement.opacity).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.opacity = false;
        await testElement.updateComplete;
        expect(testElement.opacity).to.equal(false);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should accept non-boolean values but maintain type in JavaScript", async () => {
        testElement.opacity = "true";
        await testElement.updateComplete;
        expect(testElement.opacity).to.equal("true");
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.opacity = 1;
        await testElement.updateComplete;
        expect(testElement.opacity).to.equal(1);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.opacity = "";
        await testElement.updateComplete;
        expect(testElement.opacity).to.equal("");
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.opacity).to.equal(false);
      });
    });

    describe("label property", () => {
      it("should accept valid string values and maintain accessibility", async () => {
        testElement.label = "Compare these images";
        await testElement.updateComplete;
        expect(testElement.label).to.equal("Compare these images");
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.label = "Image comparison slider";
        await testElement.updateComplete;
        expect(testElement.label).to.equal("Image comparison slider");
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should accept non-string values but maintain type in JavaScript", async () => {
        testElement.label = 123;
        await testElement.updateComplete;
        expect(testElement.label).to.equal(123);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.label = true;
        await testElement.updateComplete;
        expect(testElement.label).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.label = null;
        await testElement.updateComplete;
        expect(testElement.label).to.equal(null);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.label).to.equal("Compare images");
      });
    });

    describe("position property", () => {
      it("should accept valid Number values and maintain accessibility", async () => {
        testElement.position = 25;
        await testElement.updateComplete;
        expect(testElement.position).to.equal(25);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.position = 75;
        await testElement.updateComplete;
        expect(testElement.position).to.equal(75);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.position = 0;
        await testElement.updateComplete;
        expect(testElement.position).to.equal(0);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.position = 100;
        await testElement.updateComplete;
        expect(testElement.position).to.equal(100);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should accept non-Number values but maintain type in JavaScript", async () => {
        testElement.position = "50";
        await testElement.updateComplete;
        expect(testElement.position).to.equal("50");
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.position = true;
        await testElement.updateComplete;
        expect(testElement.position).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.position).to.equal(50);
      });
    });

    describe("__lower property (internal)", () => {
      it("should handle string URLs", async () => {
        testElement.__lower = "https://example.com/image.jpg";
        await testElement.updateComplete;
        expect(testElement.__lower).to.equal("https://example.com/image.jpg");
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle empty or null values", async () => {
        testElement.__lower = "";
        await testElement.updateComplete;
        expect(testElement.__lower).to.equal("");
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.__lower = null;
        await testElement.updateComplete;
        expect(testElement.__lower).to.equal(null);
        await expect(testElement).shadowDom.to.be.accessible();
      });
    });

    describe("__upper property (internal)", () => {
      it("should handle string URLs", async () => {
        testElement.__upper = "https://example.com/image2.jpg";
        await testElement.updateComplete;
        expect(testElement.__upper).to.equal("https://example.com/image2.jpg");
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle empty or null values", async () => {
        testElement.__upper = "";
        await testElement.updateComplete;
        expect(testElement.__upper).to.equal("");
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.__upper = null;
        await testElement.updateComplete;
        expect(testElement.__upper).to.equal(null);
        await expect(testElement).shadowDom.to.be.accessible();
      });
    });

    describe("__markers property (internal)", () => {
      it("should handle array values", async () => {
        testElement.__markers = [25, 50, 75];
        await testElement.updateComplete;
        expect(testElement.__markers).to.deep.equal([25, 50, 75]);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.__markers = [];
        await testElement.updateComplete;
        expect(testElement.__markers).to.deep.equal([]);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.__markers).to.deep.equal([]);
      });
    });
  });

  describe("Attribute to property mapping", () => {
    it("should set activeLayer property from active-layer attribute", async () => {
      const testElement = await fixture(html`
        <a11y-compare-image active-layer="3">
          <h2 slot="heading">Test</h2>
          <img slot="top" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Top" />
          <img slot="bottom" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Bottom" />
        </a11y-compare-image>
      `);
      expect(testElement.activeLayer).to.equal(3);
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should reflect position property to attribute", async () => {
      const testElement = await fixture(html`
        <a11y-compare-image>
          <h2 slot="heading">Test</h2>
          <img slot="top" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Top" />
          <img slot="bottom" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Bottom" />
        </a11y-compare-image>
      `);
      
      testElement.position = 75;
      await testElement.updateComplete;
      expect(testElement.getAttribute('position')).to.equal('75');
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should reflect activeLayer property to active-layer attribute", async () => {
      const testElement = await fixture(html`
        <a11y-compare-image>
          <h2 slot="heading">Test</h2>
          <img slot="top" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Top" />
          <img slot="bottom" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Bottom" />
        </a11y-compare-image>
      `);
      
      testElement.activeLayer = 2;
      await testElement.updateComplete;
      expect(testElement.getAttribute('active-layer')).to.equal('2');
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Accessibility scenarios with different property combinations", () => {
    it("should remain accessible with opacity mode", async () => {
      const testElement = await fixture(html`
        <a11y-compare-image opacity>
          <h2 slot="heading">Opacity Comparison</h2>
          <p slot="description">Compare using opacity mode</p>
          <img slot="top" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Top image" />
          <img slot="bottom" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Bottom image" />
        </a11y-compare-image>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible with custom label", async () => {
      const testElement = await fixture(html`
        <a11y-compare-image label="Custom comparison slider">
          <h2 slot="heading">Custom Label Test</h2>
          <img slot="top" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Top image" />
          <img slot="bottom" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Bottom image" />
        </a11y-compare-image>
      `);
      await testElement.updateComplete;
      expect(testElement.label).to.equal("Custom comparison slider");
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible with different positions", async () => {
      const testElement = await fixture(html`
        <a11y-compare-image position="25">
          <h2 slot="heading">Position Test</h2>
          <img slot="top" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Top image" />
          <img slot="bottom" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Bottom image" />
        </a11y-compare-image>
      `);
      
      await testElement.updateComplete;
      expect(testElement.position).to.equal(25);
      await expect(testElement).shadowDom.to.be.accessible();
      
      // Test position changes
      testElement.position = 75;
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible with multiple images in slots", async () => {
      const testElement = await fixture(html`
        <a11y-compare-image>
          <h2 slot="heading">Multiple Images</h2>
          <p slot="description">Comparison with multiple layers</p>
          <img slot="top" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Top image 1" />
          <img slot="top" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Top image 2" />
          <img slot="bottom" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Bottom image 1" />
          <img slot="bottom" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Bottom image 2" />
        </a11y-compare-image>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Interactive functionality and accessibility", () => {
    it("should handle slider value changes and maintain accessibility", async () => {
      const testElement = await fixture(html`
        <a11y-compare-image>
          <h2 slot="heading">Interactive Test</h2>
          <img slot="top" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Top image" />
          <img slot="bottom" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Bottom image" />
        </a11y-compare-image>
      `);
      await testElement.updateComplete;
      
      // Simulate slider interaction
      const slider = testElement.shadowRoot.querySelector('simple-range-input');
      expect(slider).to.exist;
      
      // Test different positions
      const positions = [0, 25, 50, 75, 100];
      for (const pos of positions) {
        testElement.position = pos;
        await testElement.updateComplete;
        await expect(testElement).shadowDom.to.be.accessible();
      }
    });

    it("should maintain accessibility when toggling opacity mode", async () => {
      const testElement = await fixture(html`
        <a11y-compare-image>
          <h2 slot="heading">Opacity Toggle Test</h2>
          <img slot="top" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Top image" />
          <img slot="bottom" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Bottom image" />
        </a11y-compare-image>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
      
      // Toggle to opacity mode
      testElement.opacity = true;
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
      
      // Toggle back
      testElement.opacity = false;
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Edge cases and error handling", () => {
    it("should remain accessible with missing images", async () => {
      const testElement = await fixture(html`
        <a11y-compare-image>
          <h2 slot="heading">Missing Images Test</h2>
          <p slot="description">Test with no images</p>
        </a11y-compare-image>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible with only one image", async () => {
      const testElement = await fixture(html`
        <a11y-compare-image>
          <h2 slot="heading">Single Image Test</h2>
          <img slot="top" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Only image" />
        </a11y-compare-image>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle extreme position values", async () => {
      const testElement = await fixture(html`
        <a11y-compare-image>
          <h2 slot="heading">Extreme Values Test</h2>
          <img slot="top" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Top image" />
          <img slot="bottom" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Bottom image" />
        </a11y-compare-image>
      `);
      
      // Test extreme values
      const extremeValues = [-10, 0, 100, 150, -100];
      for (const value of extremeValues) {
        testElement.position = value;
        await testElement.updateComplete;
        await expect(testElement).shadowDom.to.be.accessible();
      }
    });
  });
});

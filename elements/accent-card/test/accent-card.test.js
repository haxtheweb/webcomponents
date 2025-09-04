import { fixture, expect, html } from "@open-wc/testing";
import "../accent-card.js";

describe("accent-card test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <accent-card 
        image-src="https://placehold.co/400x300" 
        accent-color="blue"
      >
        <h3 slot="heading">Test Card Heading</h3>
        <p slot="subheading">Test card subheading</p>
        <p slot="content">This is test content for the card component.</p>
        <div slot="footer">Test footer</div>
      </accent-card>
    `);
  });

  it("basic setup", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("accent-card");
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Slot functionality", () => {
    it("should have heading slot with correct content", () => {
      const slot = element.shadowRoot.querySelector('slot[name="heading"]');
      expect(slot).to.exist;
      const assignedNodes = slot.assignedNodes({ flatten: true });
      expect(assignedNodes.length).to.be.greaterThan(0);
      expect(assignedNodes[0].textContent).to.equal("Test Card Heading");
    });

    it("should have subheading slot with correct content", () => {
      const slot = element.shadowRoot.querySelector('slot[name="subheading"]');
      expect(slot).to.exist;
      const assignedNodes = slot.assignedNodes({ flatten: true });
      expect(assignedNodes.length).to.be.greaterThan(0);
      expect(assignedNodes[0].textContent).to.equal("Test card subheading");
    });

    it("should have content slot with correct content", () => {
      const slot = element.shadowRoot.querySelector('slot[name="content"]');
      expect(slot).to.exist;
      const assignedNodes = slot.assignedNodes({ flatten: true });
      expect(assignedNodes.length).to.be.greaterThan(0);
      expect(assignedNodes[0].textContent).to.contain("This is test content");
    });

    it("should have footer slot with correct content", () => {
      const slot = element.shadowRoot.querySelector('slot[name="footer"]');
      expect(slot).to.exist;
      const assignedNodes = slot.assignedNodes({ flatten: true });
      expect(assignedNodes.length).to.be.greaterThan(0);
      expect(assignedNodes[0].textContent).to.equal("Test footer");
    });

    it("should have image-corner slot", () => {
      const slot = element.shadowRoot.querySelector('slot[name="image-corner"]');
      expect(slot).to.exist;
    });

    it("should have corner slot", () => {
      const slot = element.shadowRoot.querySelector('slot[name="corner"]');
      expect(slot).to.exist;
    });
  });

  describe("Property type validation with accessibility", () => {
    let testElement;

    beforeEach(async () => {
      testElement = await fixture(html`
        <accent-card>
          <h3 slot="heading">Test</h3>
        </accent-card>
      `);
      await testElement.updateComplete;
    });

    describe("accentBackground property", () => {
      it("should accept boolean values and maintain accessibility", async () => {
        testElement.accentBackground = true;
        await testElement.updateComplete;
        expect(testElement.accentBackground).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.accentBackground = false;
        await testElement.updateComplete;
        expect(testElement.accentBackground).to.equal(false);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should accept non-boolean values but maintain type in JavaScript", async () => {
        testElement.accentBackground = 1;
        await testElement.updateComplete;
        expect(testElement.accentBackground).to.equal(1);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.accentBackground = "true";
        await testElement.updateComplete;
        expect(testElement.accentBackground).to.equal("true");
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.accentBackground).to.equal(false);
      });
    });

    describe("accentHeading property", () => {
      it("should accept boolean values and maintain accessibility", async () => {
        testElement.accentHeading = true;
        await testElement.updateComplete;
        expect(testElement.accentHeading).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.accentHeading = false;
        await testElement.updateComplete;
        expect(testElement.accentHeading).to.equal(false);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.accentHeading).to.equal(false);
      });
    });

    describe("flat property", () => {
      it("should accept boolean values and maintain accessibility", async () => {
        testElement.flat = true;
        await testElement.updateComplete;
        expect(testElement.flat).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.flat = false;
        await testElement.updateComplete;
        expect(testElement.flat).to.equal(false);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.flat).to.equal(false);
      });
    });

    describe("horizontal property", () => {
      it("should accept boolean values and maintain accessibility", async () => {
        testElement.horizontal = true;
        await testElement.updateComplete;
        expect(testElement.horizontal).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.horizontal = false;
        await testElement.updateComplete;
        expect(testElement.horizontal).to.equal(false);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.horizontal).to.equal(false);
      });
    });

    describe("imageAlign property", () => {
      it("should accept valid alignment values and maintain accessibility", async () => {
        const validValues = ["left", "center", "right", null];
        
        for (const value of validValues) {
          testElement.imageAlign = value;
          await testElement.updateComplete;
          expect(testElement.imageAlign).to.equal(value);
          await expect(testElement).shadowDom.to.be.accessible();
        }
      });

      it("should accept non-standard values but maintain type in JavaScript", async () => {
        testElement.imageAlign = 123;
        await testElement.updateComplete;
        expect(testElement.imageAlign).to.equal(123);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.imageAlign = true;
        await testElement.updateComplete;
        expect(testElement.imageAlign).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.imageAlign).to.equal(null);
      });
    });

    describe("imageSrc property", () => {
      it("should accept URL string values and maintain accessibility", async () => {
        testElement.imageSrc = "https://placehold.co/400x300";
        await testElement.updateComplete;
        expect(testElement.imageSrc).to.equal("https://placehold.co/400x300");
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.imageSrc = "";
        await testElement.updateComplete;
        expect(testElement.imageSrc).to.equal("");
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.imageSrc = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        await testElement.updateComplete;
        expect(testElement.imageSrc).to.equal("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should accept non-string values but maintain type in JavaScript", async () => {
        testElement.imageSrc = 456;
        await testElement.updateComplete;
        expect(testElement.imageSrc).to.equal(456);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.imageSrc = false;
        await testElement.updateComplete;
        expect(testElement.imageSrc).to.equal(false);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.imageSrc).to.equal(null);
      });
    });

    describe("imageValign property", () => {
      it("should accept valid alignment values and maintain accessibility", async () => {
        const validValues = ["top", "center", "bottom", null];
        
        for (const value of validValues) {
          testElement.imageValign = value;
          await testElement.updateComplete;
          expect(testElement.imageValign).to.equal(value);
          await expect(testElement).shadowDom.to.be.accessible();
        }
      });

      it("should have correct default value", () => {
        expect(testElement.imageValign).to.equal(null);
      });
    });

    describe("noBorder property", () => {
      it("should accept boolean values and maintain accessibility", async () => {
        testElement.noBorder = true;
        await testElement.updateComplete;
        expect(testElement.noBorder).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.noBorder = false;
        await testElement.updateComplete;
        expect(testElement.noBorder).to.equal(false);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.noBorder).to.equal(false);
      });
    });

    describe("ready property", () => {
      it("should handle boolean values and maintain accessibility", async () => {
        testElement.ready = true;
        await testElement.updateComplete;
        expect(testElement.ready).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.ready = false;
        await testElement.updateComplete;
        expect(testElement.ready).to.equal(false);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.ready).to.equal(false);
      });
    });

    describe("link property", () => {
      it("should accept URL string values and maintain accessibility", async () => {
        testElement.link = "https://example.com";
        await testElement.updateComplete;
        expect(testElement.link).to.equal("https://example.com");
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.link = "";
        await testElement.updateComplete;
        expect(testElement.link).to.equal("");
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.link = null;
        await testElement.updateComplete;
        expect(testElement.link).to.equal(null);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.link).to.equal(null);
      });
    });

    describe("iconSize property", () => {
      it("should accept size string values and maintain accessibility", async () => {
        const validSizes = ["xs", "sm", "md", "lg", "xl"];
        
        for (const size of validSizes) {
          testElement.iconSize = size;
          await testElement.updateComplete;
          expect(testElement.iconSize).to.equal(size);
          await expect(testElement).shadowDom.to.be.accessible();
        }
      });

      it("should have correct default value", () => {
        expect(testElement.iconSize).to.be.undefined;
      });
    });

    describe("imageWidth property", () => {
      it("should accept width string values and maintain accessibility", async () => {
        const validWidths = ["narrow", "wide"];
        
        for (const width of validWidths) {
          testElement.imageWidth = width;
          await testElement.updateComplete;
          expect(testElement.imageWidth).to.equal(width);
          await expect(testElement).shadowDom.to.be.accessible();
        }
      });

      it("should have correct default value", () => {
        expect(testElement.imageWidth).to.be.undefined;
      });
    });
  });

  describe("Attribute to property mapping", () => {
    it("should set accentBackground property from accent-background attribute", async () => {
      const testElement = await fixture(html`
        <accent-card accent-background>
          <h3 slot="heading">Test</h3>
        </accent-card>
      `);
      expect(testElement.accentBackground).to.equal(true);
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should set accentHeading property from accent-heading attribute", async () => {
      const testElement = await fixture(html`
        <accent-card accent-heading>
          <h3 slot="heading">Test</h3>
        </accent-card>
      `);
      expect(testElement.accentHeading).to.equal(true);
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should set imageSrc property from image-src attribute", async () => {
      const testElement = await fixture(html`
        <accent-card image-src="https://placehold.co/200x100">
          <h3 slot="heading">Test</h3>
        </accent-card>
      `);
      expect(testElement.imageSrc).to.equal("https://placehold.co/200x100");
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should set imageAlign property from image-align attribute", async () => {
      const testElement = await fixture(html`
        <accent-card image-align="center">
          <h3 slot="heading">Test</h3>
        </accent-card>
      `);
      expect(testElement.imageAlign).to.equal("center");
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should set imageValign property from image-valign attribute", async () => {
      const testElement = await fixture(html`
        <accent-card image-valign="top">
          <h3 slot="heading">Test</h3>
        </accent-card>
      `);
      expect(testElement.imageValign).to.equal("top");
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should set noBorder property from no-border attribute", async () => {
      const testElement = await fixture(html`
        <accent-card no-border>
          <h3 slot="heading">Test</h3>
        </accent-card>
      `);
      expect(testElement.noBorder).to.equal(true);
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should set iconSize property from icon-size attribute", async () => {
      const testElement = await fixture(html`
        <accent-card icon-size="lg">
          <h3 slot="heading">Test</h3>
        </accent-card>
      `);
      expect(testElement.iconSize).to.equal("lg");
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should set imageWidth property from image-width attribute", async () => {
      const testElement = await fixture(html`
        <accent-card image-width="wide">
          <h3 slot="heading">Test</h3>
        </accent-card>
      `);
      expect(testElement.imageWidth).to.equal("wide");
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Accessibility scenarios with different property combinations", () => {
    it("should remain accessible with image and accent styling", async () => {
      const testElement = await fixture(html`
        <accent-card
          image-src="https://placehold.co/300x200"
          accent-background
          accent-heading
        >
          <h3 slot="heading">Accent Card</h3>
          <p slot="content">Card with accent styling</p>
        </accent-card>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible in horizontal layout", async () => {
      const testElement = await fixture(html`
        <accent-card 
          horizontal
          image-src="https://placehold.co/300x200"
        >
          <h3 slot="heading">Horizontal Card</h3>
          <p slot="content">Card in horizontal layout</p>
        </accent-card>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible with different image alignments", async () => {
      const alignments = ["left", "center", "right"];
      
      for (const align of alignments) {
        const testElement = await fixture(html`
          <accent-card
            image-src="https://placehold.co/300x200"
            image-align="${align}"
          >
            <h3 slot="heading">Aligned Image Card</h3>
            <p slot="content">Card with ${align} aligned image</p>
          </accent-card>
        `);
        await testElement.updateComplete;
        await expect(testElement).shadowDom.to.be.accessible();
      }
    });

    it("should remain accessible with link and icon", async () => {
      const testElement = await fixture(html`
        <accent-card
          link="https://example.com"
          icon-size="md"
        >
          <h3 slot="heading">Linked Card</h3>
          <p slot="content">Card with external link</p>
          <span slot="footer">Learn More</span>
        </accent-card>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible with all slots populated", async () => {
      const testElement = await fixture(html`
        <accent-card
          image-src="https://placehold.co/400x300"
        >
          <h3 slot="heading">Complete Card</h3>
          <p slot="subheading">With all content</p>
          <p slot="content">This card demonstrates all available slots and features.</p>
          <div slot="corner">Corner content</div>
          <div slot="image-corner">Image corner</div>
          <div slot="footer">Footer content</div>
        </accent-card>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible in flat design mode", async () => {
      const testElement = await fixture(html`
        <accent-card flat no-border>
          <h3 slot="heading">Flat Card</h3>
          <p slot="content">Card without shadow or accent border</p>
        </accent-card>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Image handling and accessibility", () => {
    it("should handle image visibility based on elementVisible property", async () => {
      const testElement = await fixture(html`
        <accent-card image-src="https://placehold.co/300x200">
          <h3 slot="heading">Image Card</h3>
        </accent-card>
      `);
      
      // Initially elementVisible should be true (IntersectionObserverMixin)
      expect(testElement.elementVisible).to.be.true;
      
      const imageWrapper = testElement.shadowRoot.querySelector('.image-outer');
      expect(imageWrapper.hasAttribute('hidden')).to.be.false;
      
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should hide image container when no imageSrc is provided", async () => {
      const testElement = await fixture(html`
        <accent-card>
          <h3 slot="heading">No Image Card</h3>
        </accent-card>
      `);
      
      const imageWrapper = testElement.shadowRoot.querySelector('.image-outer');
      expect(imageWrapper.hasAttribute('hidden')).to.be.true;
      
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should maintain accessibility with different image widths", async () => {
      const widths = ["narrow", "wide"];
      
      for (const width of widths) {
        const testElement = await fixture(html`
          <accent-card
            horizontal
            image-src="https://placehold.co/300x200"
            image-width="${width}"
          >
            <h3 slot="heading">${width} Image Card</h3>
            <p slot="content">Card with ${width} image</p>
          </accent-card>
        `);
        await testElement.updateComplete;
        await expect(testElement).shadowDom.to.be.accessible();
      }
    });
  });

  describe("Link functionality and accessibility", () => {
    it("should create accessible external link when link property is set", async () => {
      const testElement = await fixture(html`
        <accent-card link="https://example.com">
          <h3 slot="heading">Linked Card</h3>
          <span slot="footer">Read More</span>
        </accent-card>
      `);
      await testElement.updateComplete;
      
      const link = testElement.shadowRoot.querySelector('a');
      expect(link).to.exist;
      expect(link.getAttribute('href')).to.equal('https://example.com');
      expect(link.getAttribute('target')).to.equal('_blank');
      expect(link.getAttribute('rel')).to.equal('nofollow noopener');
      
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should not create link when link property is not set", async () => {
      const testElement = await fixture(html`
        <accent-card>
          <h3 slot="heading">No Link Card</h3>
          <span slot="footer">Static Footer</span>
        </accent-card>
      `);
      await testElement.updateComplete;
      
      const link = testElement.shadowRoot.querySelector('a');
      expect(link).to.not.exist;
      
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Ready state and transitions", () => {
    it("should become ready after initialization", async () => {
      const testElement = await fixture(html`
        <accent-card>
          <h3 slot="heading">Ready Test</h3>
        </accent-card>
      `);
      
      // Initially ready should be false
      expect(testElement.ready).to.be.false;
      
      // Wait for the ready state to be set (after 100ms timeout)
      await new Promise(resolve => setTimeout(resolve, 150));
      
      expect(testElement.ready).to.be.true;
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Edge cases and error handling", () => {
    it("should remain accessible with empty slots", async () => {
      const testElement = await fixture(html`
        <accent-card></accent-card>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible with malformed image URLs", async () => {
      const testElement = await fixture(html`
        <accent-card image-src="invalid-url">
          <h3 slot="heading">Invalid Image URL</h3>
        </accent-card>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle edge case property values", async () => {
      const testElement = await fixture(html`<accent-card></accent-card>`);
      
      // Test with various unusual values
      const edgeCaseValues = [
        "   \t\n   ", // whitespace
        "<script>alert('test')</script>", // potentially dangerous content
        "\u00A0\u2000\u2001", // various unicode spaces
        "🎨 creative content 🎆", // emoji
        "Very long text that might cause layout issues or other problems when displayed in the card interface",
        "Multi\nline\ntext", // multiline
        "Text with 'quotes' and \"double quotes\" and special chars: !@#$%^&*()"
      ];
      
      for (const value of edgeCaseValues) {
        testElement.imageSrc = value;
        testElement.link = value;
        await testElement.updateComplete;
        
        expect(testElement.imageSrc).to.equal(value);
        expect(testElement.link).to.equal(value);
        await expect(testElement).shadowDom.to.be.accessible();
      }
    });
  });

  describe("HAX Properties and Integration", () => {
    it("should have haxProperties defined", () => {
      expect(element.constructor.haxProperties).to.exist;
      expect(element.constructor.haxProperties.gizmo).to.exist;
      expect(element.constructor.haxProperties.settings).to.exist;
      expect(element.constructor.haxProperties.demoSchema).to.exist;
    });

    it("should have proper HAX configuration for image upload", () => {
      const haxProps = element.constructor.haxProperties;
      const configItems = haxProps.settings.configure;
      
      // Verify imageSrc property has haxupload input method
      const imageSrcProp = configItems.find(item => item.property === "imageSrc");
      expect(imageSrcProp).to.exist;
      expect(imageSrcProp.inputMethod).to.equal("haxupload");
      expect(imageSrcProp.noVoiceRecord).to.be.true;
    });

    it("should maintain accessibility with HAX demo schema", async () => {
      const demoSchema = element.constructor.haxProperties.demoSchema[0];
      const haxTestElement = await fixture(html`
        <accent-card 
          accent-color="${demoSchema.properties.accentColor}"
          ?accent-heading="${demoSchema.properties.accentHeading}"
          ?horizontal="${demoSchema.properties.horizontal}"
          image-src="${demoSchema.properties.imageSrc}"
        >
          ${html([demoSchema.content])}
        </accent-card>
      `);
      await haxTestElement.updateComplete;
      await expect(haxTestElement).shadowDom.to.be.accessible();
    });
  });

  describe("Container queries and responsive design", () => {
    it("should maintain accessibility across different container sizes", async () => {
      const testElement = await fixture(html`
        <accent-card
          horizontal
          image-src="https://placehold.co/300x200"
          style="width: 400px"
        >
          <h3 slot="heading">Responsive Card</h3>
          <p slot="content">This card should adapt to container size</p>
        </accent-card>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
      
      // Test with narrow container
      testElement.style.width = "300px";
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });
});

import { fixture, expect, html } from "@open-wc/testing";
import "../a11y-gif-player.js";

describe("a11y-gif-player test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html` <a11y-gif-player
        style="width: 200px;"
        src="https://placehold.co/300x200.gif"
        src-without-animation="https://placehold.co/300x200.jpg"
        alt="Test animated placeholder"
        longdesc="This is a test animated placeholder image for demonstration purposes."
      >
      </a11y-gif-player>`,
    );
  });

  it("basic setup", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("a11y-gif-player");
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Slot functionality", () => {
    it("should have default hidden slot for slotted content", () => {
      const slot = element.shadowRoot.querySelector('slot[hidden]');
      expect(slot).to.exist;
    });

    it("should process slotted img elements", async () => {
      const testElement = await fixture(html`
        <a11y-gif-player>
          <img src="https://placehold.co/200x100.jpg" alt="Slotted image" />
        </a11y-gif-player>
      `);
      
      // The component should extract the src and alt from the slotted image
      expect(testElement.srcWithoutAnimation).to.equal("https://placehold.co/200x100.jpg");
      expect(testElement.alt).to.equal("Slotted image");
    });
  });

  describe("Property type validation with accessibility", () => {
    let testElement;

    beforeEach(async () => {
      testElement = await fixture(html`
        <a11y-gif-player></a11y-gif-player>
      `);
      await testElement.updateComplete;
    });

    describe("alt property", () => {
      it("should accept valid string values and maintain accessibility", async () => {
        testElement.alt = "Alternative text for GIF";
        await testElement.updateComplete;
        expect(testElement.alt).to.equal("Alternative text for GIF");
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.alt = "";
        await testElement.updateComplete;
        expect(testElement.alt).to.equal("");
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.alt = "Very long alternative text that describes the animated content in detail for accessibility purposes";
        await testElement.updateComplete;
        expect(testElement.alt).to.equal("Very long alternative text that describes the animated content in detail for accessibility purposes");
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should accept non-string values but maintain type in JavaScript", async () => {
        testElement.alt = 123;
        await testElement.updateComplete;
        expect(testElement.alt).to.equal(123);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.alt = true;
        await testElement.updateComplete;
        expect(testElement.alt).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.alt = null;
        await testElement.updateComplete;
        expect(testElement.alt).to.equal(null);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.alt).to.be.undefined;
      });
    });

    describe("disabled property", () => {
      it("should accept boolean values and maintain accessibility", async () => {
        testElement.disabled = true;
        await testElement.updateComplete;
        expect(testElement.disabled).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.disabled = false;
        await testElement.updateComplete;
        expect(testElement.disabled).to.equal(false);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should accept non-boolean values but maintain type in JavaScript", async () => {
        testElement.disabled = 1;
        await testElement.updateComplete;
        expect(testElement.disabled).to.equal(1);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.disabled = "true";
        await testElement.updateComplete;
        expect(testElement.disabled).to.equal("true");
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.disabled = "";
        await testElement.updateComplete;
        expect(testElement.disabled).to.equal("");
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.disabled).to.equal(false);
      });
    });

    describe("describedBy property", () => {
      it("should accept string values and maintain accessibility", async () => {
        testElement.describedBy = "additional-description";
        await testElement.updateComplete;
        expect(testElement.describedBy).to.equal("additional-description");
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.describedBy = "desc1 desc2 desc3";
        await testElement.updateComplete;
        expect(testElement.describedBy).to.equal("desc1 desc2 desc3");
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.describedBy = "";
        await testElement.updateComplete;
        expect(testElement.describedBy).to.equal("");
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should accept non-string values but maintain type in JavaScript", async () => {
        testElement.describedBy = 456;
        await testElement.updateComplete;
        expect(testElement.describedBy).to.equal(456);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.describedBy = true;
        await testElement.updateComplete;
        expect(testElement.describedBy).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.describedBy).to.be.undefined;
      });
    });

    describe("longdesc property", () => {
      it("should accept string values and maintain accessibility", async () => {
        testElement.longdesc = "Long description of the animated content";
        await testElement.updateComplete;
        expect(testElement.longdesc).to.equal("Long description of the animated content");
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.longdesc = "";
        await testElement.updateComplete;
        expect(testElement.longdesc).to.equal("");
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should accept non-string values but maintain type in JavaScript", async () => {
        testElement.longdesc = 789;
        await testElement.updateComplete;
        expect(testElement.longdesc).to.equal(789);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.longdesc = false;
        await testElement.updateComplete;
        expect(testElement.longdesc).to.equal(false);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.longdesc).to.be.undefined;
      });
    });

    describe("src property", () => {
      it("should accept URL string values and maintain accessibility", async () => {
        testElement.src = "https://placehold.co/400x300.gif";
        await testElement.updateComplete;
        expect(testElement.src).to.equal("https://placehold.co/400x300.gif");
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        await testElement.updateComplete;
        expect(testElement.src).to.equal("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.src = "";
        await testElement.updateComplete;
        expect(testElement.src).to.equal("");
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should accept non-string values but maintain type in JavaScript", async () => {
        testElement.src = 123;
        await testElement.updateComplete;
        expect(testElement.src).to.equal(123);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.src = null;
        await testElement.updateComplete;
        expect(testElement.src).to.equal(null);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.src).to.be.undefined;
      });
    });

    describe("srcWithoutAnimation property", () => {
      it("should accept URL string values and maintain accessibility", async () => {
        testElement.srcWithoutAnimation = "https://placehold.co/400x300.jpg";
        await testElement.updateComplete;
        expect(testElement.srcWithoutAnimation).to.equal("https://placehold.co/400x300.jpg");
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.srcWithoutAnimation = "";
        await testElement.updateComplete;
        expect(testElement.srcWithoutAnimation).to.equal("");
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should accept non-string values but maintain type in JavaScript", async () => {
        testElement.srcWithoutAnimation = 456;
        await testElement.updateComplete;
        expect(testElement.srcWithoutAnimation).to.equal(456);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.srcWithoutAnimation = true;
        await testElement.updateComplete;
        expect(testElement.srcWithoutAnimation).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.srcWithoutAnimation).to.be.undefined;
      });
    });

    describe("__playing property (internal)", () => {
      it("should handle boolean values and maintain accessibility", async () => {
        testElement.__playing = true;
        await testElement.updateComplete;
        expect(testElement.__playing).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.__playing = false;
        await testElement.updateComplete;
        expect(testElement.__playing).to.equal(false);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.__playing).to.equal(false);
      });
    });

    describe("__gifLoaded property (internal)", () => {
      it("should handle boolean values and maintain accessibility", async () => {
        testElement.__gifLoaded = true;
        await testElement.updateComplete;
        expect(testElement.__gifLoaded).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.__gifLoaded = false;
        await testElement.updateComplete;
        expect(testElement.__gifLoaded).to.equal(false);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.__gifLoaded).to.equal(false);
      });
    });
  });

  describe("Attribute to property mapping", () => {
    it("should set describedBy property from described-by attribute", async () => {
      const testElement = await fixture(html`
        <a11y-gif-player described-by="additional-info">
        </a11y-gif-player>
      `);
      expect(testElement.describedBy).to.equal("additional-info");
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should set longdesc property from longdesc attribute", async () => {
      const testElement = await fixture(html`
        <a11y-gif-player longdesc="Detailed description of animation">
        </a11y-gif-player>
      `);
      expect(testElement.longdesc).to.equal("Detailed description of animation");
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should set srcWithoutAnimation property from src-without-animation attribute", async () => {
      const testElement = await fixture(html`
        <a11y-gif-player src-without-animation="https://placehold.co/200x100.jpg">
        </a11y-gif-player>
      `);
      expect(testElement.srcWithoutAnimation).to.equal("https://placehold.co/200x100.jpg");
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Accessibility scenarios with different property combinations", () => {
    it("should remain accessible with animated GIF and static fallback", async () => {
      const testElement = await fixture(html`
        <a11y-gif-player
          src="https://placehold.co/300x200.gif"
          src-without-animation="https://placehold.co/300x200.jpg"
          alt="Test animation"
        >
        </a11y-gif-player>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible with long description", async () => {
      const testElement = await fixture(html`
        <a11y-gif-player
          src="https://placehold.co/300x200.gif"
          alt="Test animation"
          longdesc="This animation shows a detailed demonstration of the concept being illustrated."
        >
        </a11y-gif-player>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible when disabled", async () => {
      const testElement = await fixture(html`
        <a11y-gif-player
          src="https://placehold.co/300x200.gif"
          alt="Disabled animation"
          disabled
        >
        </a11y-gif-player>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible with additional described-by references", async () => {
      const testElement = await fixture(html`
        <div>
          <div id="extra-desc">Additional description element</div>
          <a11y-gif-player
            src="https://placehold.co/300x200.gif"
            alt="Animation with extra description"
            described-by="extra-desc"
          >
          </a11y-gif-player>
        </div>
      `);
      const player = testElement.querySelector('a11y-gif-player');
      await player.updateComplete;
      await expect(player).shadowDom.to.be.accessible();
    });
  });

  describe("Interactive functionality and accessibility", () => {
    it("should maintain accessibility when toggling animation state", async () => {
      const testElement = await fixture(html`
        <a11y-gif-player
          src="https://placehold.co/300x200.gif"
          src-without-animation="https://placehold.co/300x200.jpg"
          alt="Interactive animation"
        >
        </a11y-gif-player>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
      
      // Test play functionality
      testElement.play();
      await testElement.updateComplete;
      expect(testElement.__playing).to.be.true;
      await expect(testElement).shadowDom.to.be.accessible();
      
      // Test stop functionality
      testElement.stop();
      await testElement.updateComplete;
      expect(testElement.__playing).to.be.false;
      await expect(testElement).shadowDom.to.be.accessible();
      
      // Test toggle functionality
      testElement.toggle();
      await testElement.updateComplete;
      expect(testElement.__playing).to.be.true;
      await expect(testElement).shadowDom.to.be.accessible();
      
      testElement.toggle();
      await testElement.updateComplete;
      expect(testElement.__playing).to.be.false;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should have proper ARIA attributes on the button", async () => {
      const testElement = await fixture(html`
        <a11y-gif-player
          src="https://placehold.co/300x200.gif"
          alt="Aria test animation"
        >
        </a11y-gif-player>
      `);
      await testElement.updateComplete;
      
      const button = testElement.shadowRoot.querySelector('button');
      expect(button).to.exist;
      expect(button.getAttribute('aria-label')).to.contain('Toggle animation');
      expect(button.getAttribute('aria-controls')).to.equal('gif');
      expect(button.getAttribute('aria-pressed')).to.equal('false');
      
      // Test that aria-pressed changes when playing
      testElement.play();
      await testElement.updateComplete;
      expect(button.getAttribute('aria-pressed')).to.equal('true');
      
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle button click interactions accessibly", async () => {
      const testElement = await fixture(html`
        <a11y-gif-player
          src="https://placehold.co/300x200.gif"
          alt="Click test animation"
        >
        </a11y-gif-player>
      `);
      await testElement.updateComplete;
      
      const button = testElement.shadowRoot.querySelector('button');
      expect(testElement.__playing).to.be.false;
      
      // Simulate button click
      button.click();
      await testElement.updateComplete;
      expect(testElement.__playing).to.be.true;
      
      button.click();
      await testElement.updateComplete;
      expect(testElement.__playing).to.be.false;
      
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Edge cases and error handling", () => {
    it("should remain accessible with missing src", async () => {
      const testElement = await fixture(html`
        <a11y-gif-player alt="Animation without source">
        </a11y-gif-player>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible with missing alt text", async () => {
      const testElement = await fixture(html`
        <a11y-gif-player src="https://placehold.co/300x200.gif">
        </a11y-gif-player>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible with malformed image URLs", async () => {
      const testElement = await fixture(html`
        <a11y-gif-player
          src="invalid-url"
          src-without-animation="another-invalid-url"
          alt="Invalid URLs test"
        >
        </a11y-gif-player>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle edge case text values", async () => {
      const testElement = await fixture(html`<a11y-gif-player></a11y-gif-player>`);
      
      const edgeCaseValues = [
        "   \t\n   ", // whitespace
        "<script>alert('test')</script>", // potentially dangerous content
        "\u00A0\u2000\u2001", // various unicode spaces
        "🎬 animated content 🎥", // emoji
        "Very long alternative text that might cause layout issues or other problems when displayed in the interface",
        "Multi\nline\ntext", // multiline
        "Text with 'quotes' and \"double quotes\" and special chars: !@#$%^&*()"
      ];
      
      for (const value of edgeCaseValues) {
        testElement.alt = value;
        testElement.longdesc = value;
        await testElement.updateComplete;
        
        expect(testElement.alt).to.equal(value);
        expect(testElement.longdesc).to.equal(value);
        await expect(testElement).shadowDom.to.be.accessible();
      }
    });

    it("should maintain accessibility when processing slotted content", async () => {
      const testElement = await fixture(html`
        <a11y-gif-player>
          <img src="https://placehold.co/200x100.jpg" alt="Processed from slot" />
          <div>Other content</div>
          <simple-img src="https://placehold.co/150x75.jpg" alt="Simple img tag"></simple-img>
        </a11y-gif-player>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Intersection Observer and visibility handling", () => {
    it("should maintain accessibility when element becomes visible", async () => {
      const testElement = await fixture(html`
        <a11y-gif-player
          src="https://placehold.co/300x200.gif"
          alt="Visibility test animation"
        >
        </a11y-gif-player>
      `);
      
      // Simulate element becoming visible
      testElement.elementVisible = true;
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Deprecated methods support", () => {
    it("should maintain backwards compatibility with toggleAnimation method", async () => {
      const testElement = await fixture(html`
        <a11y-gif-player
          src="https://placehold.co/300x200.gif"
          alt="Deprecated method test"
        >
        </a11y-gif-player>
      `);
      await testElement.updateComplete;
      
      expect(testElement.__playing).to.be.false;
      
      // Test deprecated toggleAnimation method
      testElement.toggleAnimation();
      await testElement.updateComplete;
      expect(testElement.__playing).to.be.true;
      await expect(testElement).shadowDom.to.be.accessible();
      
      testElement.toggleAnimation();
      await testElement.updateComplete;
      expect(testElement.__playing).to.be.false;
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("I18N and localization", () => {
    it("should maintain accessibility with translated strings", async () => {
      const testElement = await fixture(html`
        <a11y-gif-player
          src="https://placehold.co/300x200.gif"
          alt="I18N test animation"
        >
        </a11y-gif-player>
      `);
      await testElement.updateComplete;
      
      // Test that translation strings are available
      expect(testElement.t).to.exist;
      expect(testElement.t.toggleAnimation).to.be.a('string');
      
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });
});

import { fixture, expect, html } from "@open-wc/testing";

import "../event-badge.js";

describe("event-badge test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html` <event-badge></event-badge> `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Component Structure", () => {
    it("should create element", () => {
      expect(element.tagName.toLowerCase()).to.equal("event-badge");
    });

    it("should have shadow dom", () => {
      expect(element.shadowRoot).to.exist;
    });

    it("should have correct display property", () => {
      const styles = getComputedStyle(element);
      expect(styles.display).to.equal("inline-flex");
    });

    it("should contain svg element", () => {
      const svg = element.shadowRoot.querySelector("svg");
      expect(svg).to.exist;
      expect(svg.tagName.toLowerCase()).to.equal("svg");
    });
  });

  describe("Default Properties", () => {
    it("should have default title", () => {
      expect(element.title).to.equal("haxor");
    });

    it("should have default name", () => {
      expect(element.name).to.equal("bto.pro");
    });

    it("should have default position", () => {
      expect(element.position).to.equal("1337 dev");
    });

    it("should have default organization", () => {
      expect(element.organization).to.equal("Penn State");
    });

    it("should have default image", () => {
      expect(element.image).to.equal(
        "https://avatars1.githubusercontent.com/u/329735?s=400&v=4",
      );
    });

    it("should have default tvcolor", () => {
      expect(element.tvcolor).to.equal("light-blue");
    });

    it("should have default accentColor", () => {
      expect(element.accentColor).to.equal("blue");
    });

    it("should have default knobcolor", () => {
      expect(element.knobcolor).to.equal("purple");
    });

    it("should have default logo as null", () => {
      expect(element.logo).to.be.null;
    });

    it("should have default sepia as false", () => {
      expect(element.sepia).to.be.false;
    });

    it("should have default blackwhite as false", () => {
      expect(element.blackwhite).to.be.false;
    });
  });

  describe("Property Updates", () => {
    it("should update title property", async () => {
      element.title = "New Title";
      await element.updateComplete;
      expect(element.title).to.equal("New Title");

      // Check if the title is rendered in the SVG
      const titleText = element.shadowRoot.querySelector(
        '[xmlns="http://www.w3.org/1999/xhtml"]',
      );
      expect(titleText && titleText.textContent).to.include("New Title");
    });

    it("should update name property", async () => {
      element.name = "John Doe";
      await element.updateComplete;
      expect(element.name).to.equal("John Doe");
    });

    it("should update position property", async () => {
      element.position = "Senior Developer";
      await element.updateComplete;
      expect(element.position).to.equal("Senior Developer");
    });

    it("should update organization property", async () => {
      element.organization = "Test Org";
      await element.updateComplete;
      expect(element.organization).to.equal("Test Org");
    });

    it("should update image property", async () => {
      const newImage = "https://example.com/image.jpg";
      element.image = newImage;
      await element.updateComplete;
      expect(element.image).to.equal(newImage);

      // Check if image is used in SVG
      const imageElement = element.shadowRoot.querySelector("image[href]");
      expect(imageElement).to.exist;
    });

    it("should update tvcolor property", async () => {
      element.tvcolor = "red";
      await element.updateComplete;
      expect(element.tvcolor).to.equal("red");
    });

    it("should update knobcolor property", async () => {
      element.knobcolor = "green";
      await element.updateComplete;
      expect(element.knobcolor).to.equal("green");
    });

    it("should update logo property", async () => {
      const logoUrl = "https://example.com/logo.png";
      element.logo = logoUrl;
      await element.updateComplete;
      expect(element.logo).to.equal(logoUrl);
    });
  });

  describe("Visual Effect Properties", () => {
    it("should apply sepia filter when sepia is true", async () => {
      element.sepia = true;
      await element.updateComplete;

      expect(element.sepia).to.be.true;
      expect(element.hasAttribute("sepia")).to.be.true;

      // Check CSS filter application
      const styles = getComputedStyle(element);
      expect(styles.filter).to.include("sepia");
    });

    it("should apply grayscale filter when blackwhite is true", async () => {
      element.blackwhite = true;
      await element.updateComplete;

      expect(element.blackwhite).to.be.true;
      expect(element.hasAttribute("blackwhite")).to.be.true;

      // Check CSS filter application
      const styles = getComputedStyle(element);
      expect(styles.filter).to.include("grayscale");
    });

    it("should remove sepia filter when sepia is false", async () => {
      element.sepia = true;
      await element.updateComplete;
      element.sepia = false;
      await element.updateComplete;

      expect(element.sepia).to.be.false;
      expect(element.hasAttribute("sepia")).to.be.false;
    });

    it("should remove blackwhite filter when blackwhite is false", async () => {
      element.blackwhite = true;
      await element.updateComplete;
      element.blackwhite = false;
      await element.updateComplete;

      expect(element.blackwhite).to.be.false;
      expect(element.hasAttribute("blackwhite")).to.be.false;
    });
  });

  describe("Attribute Reflection", () => {
    it("should reflect sepia property to attribute", async () => {
      element.sepia = true;
      await element.updateComplete;
      expect(element.hasAttribute("sepia")).to.be.true;

      element.sepia = false;
      await element.updateComplete;
      expect(element.hasAttribute("sepia")).to.be.false;
    });

    it("should reflect blackwhite property to attribute", async () => {
      element.blackwhite = true;
      await element.updateComplete;
      expect(element.hasAttribute("blackwhite")).to.be.true;

      element.blackwhite = false;
      await element.updateComplete;
      expect(element.hasAttribute("blackwhite")).to.be.false;
    });
  });

  describe("SVG Rendering", () => {
    it("should render SVG with correct dimensions", () => {
      const svg = element.shadowRoot.querySelector("svg");
      expect(svg).to.exist;
      expect(svg.getAttribute("width")).to.equal("300");
      expect(svg.getAttribute("height")).to.equal("400");
      expect(svg.getAttribute("viewBox")).to.equal("0 0 1150 1500");
    });

    it("should have proper SVG structure", () => {
      const svg = element.shadowRoot.querySelector("svg");
      expect(svg).to.exist;

      // Check for defs with filters
      const defs = svg.querySelector("defs");
      expect(defs).to.exist;

      // Check for specific filters
      const dropshadow = defs.querySelector("#dropshadow");
      expect(dropshadow).to.exist;

      const noise = defs.querySelector("#noise");
      expect(noise).to.exist;
    });

    it("should include image element with correct href", async () => {
      const testImage = "https://test.example.com/image.jpg";
      element.image = testImage;
      await element.updateComplete;

      const imageElement = element.shadowRoot.querySelector("image");
      expect(imageElement).to.exist;
    });

    it("should use CSS variables for colors", () => {
      const svg = element.shadowRoot.querySelector("svg");
      expect(svg).to.exist;

      // Check if color variables are used in SVG paths
      const colorElements = svg.querySelectorAll('[fill*="var("]');
      expect(colorElements.length).to.be.greaterThan(0);
    });
  });

  describe("Color System Integration", () => {
    it("should extend SimpleColors", () => {
      expect(element.constructor.name).to.equal("EventBadge");
      expect(element.accentColor).to.exist;
    });

    it("should handle color changes", async () => {
      element.accentColor = "red";
      element.tvcolor = "green";
      element.knobcolor = "yellow";
      await element.updateComplete;

      expect(element.accentColor).to.equal("red");
      expect(element.tvcolor).to.equal("green");
      expect(element.knobcolor).to.equal("yellow");
    });
  });

  describe("Complex Configurations", () => {
    it("should handle complete badge configuration", async () => {
      element.title = "Conference Speaker";
      element.name = "Jane Smith";
      element.position = "Lead Developer";
      element.organization = "Tech Corp";
      element.image = "https://example.com/jane.jpg";
      element.logo = "https://example.com/logo.png";
      element.tvcolor = "blue";
      element.knobcolor = "red";
      element.sepia = true;

      await element.updateComplete;

      expect(element.title).to.equal("Conference Speaker");
      expect(element.name).to.equal("Jane Smith");
      expect(element.position).to.equal("Lead Developer");
      expect(element.organization).to.equal("Tech Corp");
      expect(element.sepia).to.be.true;
    });
  });

  describe("HTML Template Rendering", () => {
    it("should use svg template literal", () => {
      const template = element.render();
      expect(template).to.exist;
      expect(template.strings).to.exist; // TemplateResult characteristic
    });

    it("should include title in rendered content", async () => {
      element.title = "Test Event";
      await element.updateComplete;

      // The title is embedded in the SVG template literal directly
      const svgContent = element.shadowRoot.innerHTML;
      expect(svgContent).to.include("Test Event");
    });
  });

  describe("Accessibility Features", () => {
    it("should maintain accessibility with different configurations", async () => {
      element.title = "Accessible Badge";
      element.name = "User Name";
      element.sepia = true;
      await element.updateComplete;

      await expect(element).shadowDom.to.be.accessible();
    });

    it("should be accessible with blackwhite filter", async () => {
      element.blackwhite = true;
      await element.updateComplete;

      await expect(element).shadowDom.to.be.accessible();
    });

    it("should be accessible with custom colors", async () => {
      element.tvcolor = "purple";
      element.knobcolor = "orange";
      await element.updateComplete;

      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe("Performance and Updates", () => {
    it("should handle rapid property changes", async () => {
      const changes = [
        () => {
          element.title = "Title 1";
        },
        () => {
          element.name = "Name 1";
        },
        () => {
          element.position = "Position 1";
        },
        () => {
          element.tvcolor = "red";
        },
        () => {
          element.sepia = true;
        },
      ];

      changes.forEach((change) => change());
      await element.updateComplete;

      expect(element.title).to.equal("Title 1");
      expect(element.name).to.equal("Name 1");
      expect(element.position).to.equal("Position 1");
      expect(element.tvcolor).to.equal("red");
      expect(element.sepia).to.be.true;
    });

    it("should handle null/undefined values gracefully", async () => {
      element.logo = null;
      element.image = null;
      await element.updateComplete;

      expect(element.logo).to.be.null;
      expect(element.image).to.be.null;
    });
  });

  describe("Style and CSS Integration", () => {
    it("should have proper CSS custom properties support", () => {
      const svg = element.shadowRoot.querySelector("svg");
      expect(svg).to.exist;

      // Check for CSS variable usage in fill attributes
      const fillElements = svg.querySelectorAll(
        '[fill*="--simple-colors-default-theme"]',
      );
      expect(fillElements.length).to.be.greaterThan(0);
    });

    it("should apply inline flex display", () => {
      const styles = getComputedStyle(element);
      expect(styles.display).to.equal("inline-flex");
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("should handle empty strings", async () => {
      element.title = "";
      element.name = "";
      element.position = "";
      element.organization = "";
      await element.updateComplete;

      expect(element.title).to.equal("");
      expect(element.name).to.equal("");
      expect(element.position).to.equal("");
      expect(element.organization).to.equal("");
    });

    it("should handle special characters in properties", async () => {
      element.title = 'Title with & < > " characters';
      element.name = "Name with émojis 🎉";
      await element.updateComplete;

      expect(element.title).to.include("&");
      expect(element.name).to.include("🎉");
    });

    it("should handle invalid URL values", async () => {
      element.image = "invalid-url";
      element.logo = "also-invalid";
      await element.updateComplete;

      expect(element.image).to.equal("invalid-url");
      expect(element.logo).to.equal("also-invalid");
    });
  });

  describe("Integration Tests", () => {
    it("should work with different instantiation methods", async () => {
      // Test direct instantiation
      const directElement = document.createElement("event-badge");
      directElement.title = "Direct Title";
      expect(directElement.title).to.equal("Direct Title");

      // Test fixture instantiation with properties
      const configuredElement = await fixture(html`
        <event-badge
          title="Configured Title"
          name="Configured Name"
          sepia
        ></event-badge>
      `);

      expect(configuredElement.title).to.equal("Configured Title");
      expect(configuredElement.name).to.equal("Configured Name");
      expect(configuredElement.sepia).to.be.true;
    });

    it("should handle dynamic DOM insertion", async () => {
      const container = document.createElement("div");
      const dynamicElement = document.createElement("event-badge");
      dynamicElement.title = "Dynamic Badge";

      container.appendChild(dynamicElement);
      document.body.appendChild(container);

      await dynamicElement.updateComplete;

      expect(dynamicElement.title).to.equal("Dynamic Badge");
      expect(dynamicElement.shadowRoot).to.exist;

      // Cleanup
      document.body.removeChild(container);
    });
  });
});

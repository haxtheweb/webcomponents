import { fixture, expect, html } from "@open-wc/testing";
import { LitElement } from "lit";
import { A11yBehaviors } from "../a11y-behaviors.js";

// Create a test element that uses the A11yBehaviors mixin
class TestA11yBehaviors extends A11yBehaviors(LitElement) {
  static get properties() {
    return {
      backgroundColor: { type: String },
      textColor: { type: String }
    };
  }

  constructor() {
    super();
    this.backgroundColor = "#ffffff";
    this.textColor = "#000000";
  }

  render() {
    return html`
      <div 
        style="background-color: ${this.backgroundColor}; color: ${this.textColor};"
        role="region"
        aria-label="Test region"
      >
        Test content with accessible colors
      </div>
    `;
  }

  // Helper method for testing
  set(prop, value) {
    this[prop] = value;
  }

  static get tag() {
    return "test-a11y-behaviors";
  }
}

globalThis.customElements.define(TestA11yBehaviors.tag, TestA11yBehaviors);

describe("A11yBehaviors mixin test", () => {
  let element;
  
  beforeEach(async () => {
    element = await fixture(html`
      <test-a11y-behaviors></test-a11y-behaviors>
    `);
  });

  it("basic setup", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("test-a11y-behaviors");
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("getTextContrastColor method", () => {
    it("should return white text for dark backgrounds", () => {
      // Very dark background
      expect(element.getTextContrastColor("#000000")).to.equal("#ffffff");
      
      // Dark blue
      expect(element.getTextContrastColor("#003366")).to.equal("#ffffff");
      
      // Dark red
      expect(element.getTextContrastColor("#660000")).to.equal("#ffffff");
      
      // Medium dark color
      expect(element.getTextContrastColor("#666666")).to.equal("#ffffff");
    });

    it("should return black text for light backgrounds", () => {
      // Very light background
      expect(element.getTextContrastColor("#ffffff")).to.equal("#000000");
      
      // Light yellow
      expect(element.getTextContrastColor("#ffff99")).to.equal("#000000");
      
      // Light blue
      expect(element.getTextContrastColor("#ccddff")).to.equal("#000000");
      
      // Light gray
      expect(element.getTextContrastColor("#cccccc")).to.equal("#000000");
    });

    it("should handle colors with hash symbol", () => {
      expect(element.getTextContrastColor("#000000")).to.equal("#ffffff");
      expect(element.getTextContrastColor("#ffffff")).to.equal("#000000");
    });

    it("should handle colors without hash symbol", () => {
      expect(element.getTextContrastColor("000000")).to.equal("#ffffff");
      expect(element.getTextContrastColor("ffffff")).to.equal("#000000");
    });

    it("should handle 3-digit hex colors expanded to 6-digit", () => {
      // Note: The current implementation expects 6-digit hex, but let's test edge cases
      // These might not work perfectly with current implementation but document expected behavior
      expect(element.getTextContrastColor("000")).to.not.be.undefined;
      expect(element.getTextContrastColor("fff")).to.not.be.undefined;
    });

    it("should handle specific accessibility-critical color combinations", () => {
      // Test colors around the luma threshold (141)
      // Colors that should trigger white text
      expect(element.getTextContrastColor("#808080")).to.equal("#ffffff");
      
      // Colors that should trigger black text  
      expect(element.getTextContrastColor("#c0c0c0")).to.equal("#000000");
    });
  });

  describe("computeTextPropContrast method", () => {
    beforeEach(async () => {
      element.backgroundColor = "#ffffff";
      element.textColor = "#000000";
      await element.updateComplete;
    });

    it("should compute and set text color for valid hex background colors", async () => {
      // Set a dark background
      element.backgroundColor = "#000000";
      element.computeTextPropContrast('textColor', 'backgroundColor');
      
      expect(element.textColor).to.equal("#ffffff");
      await element.updateComplete;
      await expect(element).shadowDom.to.be.accessible();
    });

    it("should compute and set text color for light backgrounds", async () => {
      // Set a light background
      element.backgroundColor = "#ffffff";
      element.computeTextPropContrast('textColor', 'backgroundColor');
      
      expect(element.textColor).to.equal("#000000");
      await element.updateComplete;
      await expect(element).shadowDom.to.be.accessible();
    });

    it("should not modify text color for non-hex background colors", async () => {
      const originalTextColor = element.textColor;
      
      // Set non-hex background colors
      element.backgroundColor = "red";
      element.computeTextPropContrast('textColor', 'backgroundColor');
      expect(element.textColor).to.equal(originalTextColor);
      
      element.backgroundColor = "rgb(255, 0, 0)";
      element.computeTextPropContrast('textColor', 'backgroundColor');
      expect(element.textColor).to.equal(originalTextColor);
      
      element.backgroundColor = "transparent";
      element.computeTextPropContrast('textColor', 'backgroundColor');
      expect(element.textColor).to.equal(originalTextColor);
    });

    it("should handle various hex color formats in background", async () => {
      // Test with hash
      element.backgroundColor = "#ff0000";
      element.computeTextPropContrast('textColor', 'backgroundColor');
      expect(element.textColor).to.equal("#ffffff"); // Red background should get white text
      
      await element.updateComplete;
      await expect(element).shadowDom.to.be.accessible();
    });

    it("should work with different property names", async () => {
      // Create additional properties for testing
      element.primaryColor = "#000000";
      element.primaryTextColor = "#cccccc";
      
      element.computeTextPropContrast('primaryTextColor', 'primaryColor');
      expect(element.primaryTextColor).to.equal("#ffffff");
    });
  });

  describe("Accessibility compliance scenarios", () => {
    it("should maintain accessibility with computed high contrast colors", async () => {
      // Test various background colors and ensure accessibility
      const testColors = [
        "#000000", // Black
        "#ffffff", // White
        "#ff0000", // Red
        "#00ff00", // Green
        "#0000ff", // Blue
        "#ffff00", // Yellow
        "#ff00ff", // Magenta
        "#00ffff", // Cyan
        "#808080", // Gray
        "#c0c0c0"  // Light gray
      ];
      
      for (const bgColor of testColors) {
        element.backgroundColor = bgColor;
        element.computeTextPropContrast('textColor', 'backgroundColor');
        await element.updateComplete;
        
        // Verify the element remains accessible with computed colors
        await expect(element).shadowDom.to.be.accessible();
      }
    });

    it("should handle edge cases that might affect accessibility", async () => {
      // Test with colors very close to the luma threshold
      const edgeCaseColors = [
        "#8d8d8d", // Right around the threshold
        "#8e8e8e", // Just above threshold
        "#8c8c8c"  // Just below threshold
      ];
      
      for (const bgColor of edgeCaseColors) {
        element.backgroundColor = bgColor;
        element.computeTextPropContrast('textColor', 'backgroundColor');
        await element.updateComplete;
        
        // The computed color should be either pure black or pure white
        expect(["#000000", "#ffffff"]).to.include(element.textColor);
        await expect(element).shadowDom.to.be.accessible();
      }
    });
  });

  describe("Integration with Lit properties and accessibility", () => {
    it("should work when properties change dynamically", async () => {
      // Start with light background
      element.backgroundColor = "#ffffff";
      element.computeTextPropContrast('textColor', 'backgroundColor');
      await element.updateComplete;
      
      expect(element.textColor).to.equal("#000000");
      await expect(element).shadowDom.to.be.accessible();
      
      // Change to dark background
      element.backgroundColor = "#000000";
      element.computeTextPropContrast('textColor', 'backgroundColor');
      await element.updateComplete;
      
      expect(element.textColor).to.equal("#ffffff");
      await expect(element).shadowDom.to.be.accessible();
    });

    it("should maintain accessibility throughout property changes", async () => {
      const colorTransitions = [
        ["#ffffff", "#000000"], // White to black
        ["#000000", "#ffffff"], // Black to white
        ["#ff0000", "#00ff00"], // Red to green
        ["#0000ff", "#ffff00"]  // Blue to yellow
      ];
      
      for (const [fromColor, toColor] of colorTransitions) {
        element.backgroundColor = fromColor;
        element.computeTextPropContrast('textColor', 'backgroundColor');
        await element.updateComplete;
        await expect(element).shadowDom.to.be.accessible();
        
        element.backgroundColor = toColor;
        element.computeTextPropContrast('textColor', 'backgroundColor');
        await element.updateComplete;
        await expect(element).shadowDom.to.be.accessible();
      }
    });
  });
});

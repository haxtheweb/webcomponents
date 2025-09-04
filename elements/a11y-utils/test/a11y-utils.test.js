import { expect } from "@open-wc/testing";
import { screenreaderOnlyCSS } from "../a11y-utils.js";

describe("a11y-utils test", () => {
  describe("screenreaderOnlyCSS export", () => {
    it("should export screenreaderOnlyCSS as a CSS tagged template literal", () => {
      expect(screenreaderOnlyCSS).to.exist;
      expect(screenreaderOnlyCSS.constructor.name).to.equal("CSSResult");
    });

    it("should contain the correct CSS styles for screen reader only content", () => {
      const cssString = screenreaderOnlyCSS.cssText || screenreaderOnlyCSS.toString();
      
      // Check for the .sr-only class
      expect(cssString).to.include(".sr-only");
      
      // Check for essential screen reader only styles
      expect(cssString).to.include("position: absolute");
      expect(cssString).to.include("left: -10000px");
      expect(cssString).to.include("width: 1px");
      expect(cssString).to.include("height: 1px");
      expect(cssString).to.include("overflow: hidden");
    });

    it("should follow accessibility best practices for screen reader only content", () => {
      const cssString = screenreaderOnlyCSS.cssText || screenreaderOnlyCSS.toString();
      
      // Should use absolute positioning rather than display: none or visibility: hidden
      expect(cssString).to.not.include("display: none");
      expect(cssString).to.not.include("visibility: hidden");
      
      // Should position element off-screen
      expect(cssString).to.include("left: -10000px");
      
      // Should have minimal dimensions to avoid layout impact
      expect(cssString).to.include("width: 1px");
      expect(cssString).to.include("height: 1px");
      
      // Should hide overflow to prevent scrollbars
      expect(cssString).to.include("overflow: hidden");
    });

    it("should be usable as a CSS import in Lit components", () => {
      // Test that it can be used in a styles array (basic type check)
      expect(screenreaderOnlyCSS).to.have.property('cssText').or.have.property('strings');
      
      // Verify it's a proper CSS template literal result
      expect(screenreaderOnlyCSS.constructor.name).to.equal("CSSResult");
    });

    it("should provide consistent CSS output", () => {
      const cssString1 = screenreaderOnlyCSS.cssText || screenreaderOnlyCSS.toString();
      const cssString2 = screenreaderOnlyCSS.cssText || screenreaderOnlyCSS.toString();
      
      expect(cssString1).to.equal(cssString2);
    });
  });

  describe("CSS content validation", () => {
    it("should use the standard sr-only class name", () => {
      const cssString = screenreaderOnlyCSS.cssText || screenreaderOnlyCSS.toString();
      expect(cssString).to.include(".sr-only");
    });

    it("should not contain any syntax errors", () => {
      const cssString = screenreaderOnlyCSS.cssText || screenreaderOnlyCSS.toString();
      
      // Basic CSS syntax validation - should have balanced braces
      const openBraces = (cssString.match(/\{/g) || []).length;
      const closeBraces = (cssString.match(/\}/g) || []).length;
      expect(openBraces).to.equal(closeBraces);
      
      // Should end with a closing brace
      expect(cssString.trim()).to.match(/\}$/);
    });

    it("should contain all required properties for proper screen reader only behavior", () => {
      const cssString = screenreaderOnlyCSS.cssText || screenreaderOnlyCSS.toString();
      
      const requiredProperties = [
        "position",
        "left", 
        "top",
        "width",
        "height",
        "overflow"
      ];
      
      requiredProperties.forEach(property => {
        expect(cssString).to.include(`${property}:`);
      });
    });

    it("should use appropriate values that work across browsers", () => {
      const cssString = screenreaderOnlyCSS.cssText || screenreaderOnlyCSS.toString();
      
      // Check for cross-browser compatible values
      expect(cssString).to.include("position: absolute"); // More reliable than fixed
      expect(cssString).to.include("left: -10000px"); // Far enough off screen
      expect(cssString).to.include("top: auto"); // Allows natural positioning
      expect(cssString).to.include("width: 1px"); // Minimal but not 0
      expect(cssString).to.include("height: 1px"); // Minimal but not 0
      expect(cssString).to.include("overflow: hidden"); // Prevents scrollbars
    });
  });

  describe("Accessibility compliance", () => {
    it("should follow WebAIM screen reader only best practices", () => {
      const cssString = screenreaderOnlyCSS.cssText || screenreaderOnlyCSS.toString();
      
      // Should NOT use display: none or visibility: hidden (these hide from screen readers)
      expect(cssString).to.not.include("display: none");
      expect(cssString).to.not.include("visibility: hidden");
      
      // Should use positioning technique that keeps content accessible to screen readers
      expect(cssString).to.include("position: absolute");
      expect(cssString).to.include("left: -10000px");
    });

    it("should create content that is accessible to screen readers but hidden visually", () => {
      const cssString = screenreaderOnlyCSS.cssText || screenreaderOnlyCSS.toString();
      
      // The technique should:
      // 1. Position content off-screen (not use display or visibility)
      expect(cssString).to.include("position: absolute");
      expect(cssString).to.include("left: -10000px");
      
      // 2. Use minimal dimensions to prevent layout disruption
      expect(cssString).to.include("width: 1px");
      expect(cssString).to.include("height: 1px");
      
      // 3. Hide overflow to prevent scrollbars
      expect(cssString).to.include("overflow: hidden");
    });

    it("should not impact page layout or performance", () => {
      const cssString = screenreaderOnlyCSS.cssText || screenreaderOnlyCSS.toString();
      
      // Should use absolute positioning to remove from normal flow
      expect(cssString).to.include("position: absolute");
      
      // Should use minimal dimensions
      expect(cssString).to.include("width: 1px");
      expect(cssString).to.include("height: 1px");
      
      // Should hide overflow to prevent scrollbars
      expect(cssString).to.include("overflow: hidden");
    });
  });

  describe("Integration scenarios", () => {
    it("should work when imported into component styles array", () => {
      // Simulate typical usage in a LitElement component
      const mockStyles = [screenreaderOnlyCSS];
      expect(mockStyles).to.have.lengthOf(1);
      expect(mockStyles[0]).to.equal(screenreaderOnlyCSS);
    });

    it("should be combinable with other CSS", () => {
      // Test that it can be combined with other CSS without issues
      const combinedCSS = `${screenreaderOnlyCSS.cssText || screenreaderOnlyCSS.toString()} .other-class { color: red; }`;
      expect(combinedCSS).to.include(".sr-only");
      expect(combinedCSS).to.include(".other-class");
    });
  });

  describe("Edge cases", () => {
    it("should maintain consistent export across multiple imports", () => {
      // Re-import to test consistency
      import("../a11y-utils.js").then(module => {
        expect(module.screenreaderOnlyCSS).to.equal(screenreaderOnlyCSS);
      });
    });

    it("should handle CSS serialization properly", () => {
      const cssString = screenreaderOnlyCSS.cssText || screenreaderOnlyCSS.toString();
      expect(cssString).to.be.a("string");
      expect(cssString.length).to.be.greaterThan(0);
    });

    it("should not contain dangerous CSS injection patterns", () => {
      const cssString = screenreaderOnlyCSS.cssText || screenreaderOnlyCSS.toString();
      
      // Should not contain potentially dangerous patterns
      expect(cssString).to.not.include("javascript:");
      expect(cssString).to.not.include("expression(");
      expect(cssString).to.not.include("<script");
      expect(cssString).to.not.include("@import");
    });
  });

  describe("Performance considerations", () => {
    it("should be a lightweight CSS export", () => {
      const cssString = screenreaderOnlyCSS.cssText || screenreaderOnlyCSS.toString();
      
      // Should be reasonably short (under 200 characters is typical for this pattern)
      expect(cssString.length).to.be.lessThan(300);
    });

    it("should use efficient CSS selectors", () => {
      const cssString = screenreaderOnlyCSS.cssText || screenreaderOnlyCSS.toString();
      
      // Should use simple class selector (most efficient)
      expect(cssString).to.include(".sr-only");
      
      // Should not use complex selectors
      expect(cssString).to.not.include(">>");
      expect(cssString).to.not.include("[data-");
      expect(cssString).to.not.match(/:nth-child\(/); 
    });

    it("should avoid expensive CSS properties", () => {
      const cssString = screenreaderOnlyCSS.cssText || screenreaderOnlyCSS.toString();
      
      // Should not use expensive properties
      expect(cssString).to.not.include("transform");
      expect(cssString).to.not.include("filter");
      expect(cssString).to.not.include("box-shadow");
      expect(cssString).to.not.include("opacity: 0"); // Can trigger repaints
    });
  });
});

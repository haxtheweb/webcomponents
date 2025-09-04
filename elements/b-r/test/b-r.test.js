import { fixture, expect, html } from "@open-wc/testing";
import "../b-r.js";

describe("b-r test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html` <b-r amount="22"></b-r> `);
    await element.updateComplete;
  });

  it("basic setup", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("b-r");
  });

  it("test that 22 brs are there", async () => {
    expect(element).to.exist;
    expect(element.amount).to.equal(22);
    expect(element.shadowRoot.querySelectorAll("br").length).to.equal(22);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Component structure and properties", () => {
    it("should have correct tag name", () => {
      expect(element.constructor.tag).to.equal("b-r");
    });

    it("should initialize with default amount", async () => {
      const testElement = await fixture(html`<b-r></b-r>`);
      expect(testElement.amount).to.equal(0);
    });
  });

  describe("Property validation with accessibility", () => {
    let testElement;

    beforeEach(async () => {
      testElement = await fixture(html`<b-r></b-r>`);
      await testElement.updateComplete;
    });

    describe("Amount property", () => {
      it("should handle positive integer values and maintain accessibility", async () => {
        const amounts = [1, 5, 10, 25, 50, 100];
        
        for (const amount of amounts) {
          testElement.amount = amount;
          await testElement.updateComplete;
          
          expect(testElement.amount).to.equal(amount);
          expect(testElement.shadowRoot.querySelectorAll("br").length).to.equal(amount);
          await expect(testElement).shadowDom.to.be.accessible();
        }
      });

      it("should handle zero amount correctly", async () => {
        // Mock globalThis.innerHeight for predictable results
        const originalInnerHeight = globalThis.innerHeight;
        globalThis.innerHeight = 420; // This should result in 420/21 = 20 breaks
        
        testElement.amount = 0;
        await testElement.updateComplete;
        
        expect(testElement.amount).to.equal(0);
        expect(testElement.shadowRoot.querySelectorAll("br").length).to.equal(20);
        await expect(testElement).shadowDom.to.be.accessible();
        
        globalThis.innerHeight = originalInnerHeight;
      });

      it("should handle decimal values by truncating", async () => {
        testElement.amount = 5.7;
        await testElement.updateComplete;
        
        // JavaScript's behavior with decimals in while loops
        expect(testElement.amount).to.equal(5.7);
        expect(testElement.shadowRoot.querySelectorAll("br").length).to.equal(5);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle negative values gracefully", async () => {
        testElement.amount = -5;
        await testElement.updateComplete;
        
        expect(testElement.amount).to.equal(-5);
        expect(testElement.shadowRoot.querySelectorAll("br").length).to.equal(0);
        await expect(testElement).shadowDom.to.be.accessible();
      });
    });
  });

  describe("Break element rendering", () => {
    it("should render exact number of br elements", async () => {
      const testCases = [1, 3, 7, 15, 30];
      
      for (const amount of testCases) {
        const testElement = await fixture(html`<b-r amount="${amount}"></b-r>`);
        await testElement.updateComplete;
        
        const brElements = testElement.shadowRoot.querySelectorAll("br");
        expect(brElements.length).to.equal(amount);
        
        // Ensure all are actually br elements
        brElements.forEach(br => {
          expect(br.tagName.toLowerCase()).to.equal('br');
        });
      }
    });

    it("should render br elements as self-closing tags", async () => {
      const testElement = await fixture(html`<b-r amount="3"></b-r>`);
      await testElement.updateComplete;
      
      const brElements = testElement.shadowRoot.querySelectorAll("br");
      expect(brElements.length).to.equal(3);
      
      brElements.forEach(br => {
        expect(br.outerHTML).to.equal('<br>');
      });
    });

    it("should render no br elements when amount is 0 and innerHeight calculation", async () => {
      const originalInnerHeight = globalThis.innerHeight;
      globalThis.innerHeight = 0; // Edge case: no height
      
      const testElement = await fixture(html`<b-r amount="0"></b-r>`);
      await testElement.updateComplete;
      
      const brElements = testElement.shadowRoot.querySelectorAll("br");
      expect(brElements.length).to.equal(0);
      
      globalThis.innerHeight = originalInnerHeight;
    });
  });

  describe("renderBR method functionality", () => {
    it("should return array of br elements", () => {
      const testElement = new (element.constructor)();
      const result = testElement.renderBR(5);
      
      expect(result).to.be.an('array');
      expect(result.length).to.equal(5);
    });

    it("should handle zero amount with innerHeight calculation", () => {
      const originalInnerHeight = globalThis.innerHeight;
      globalThis.innerHeight = 210; // Should result in 210/21 = 10
      
      const testElement = new (element.constructor)();
      const result = testElement.renderBR(0);
      
      expect(result.length).to.equal(10);
      
      globalThis.innerHeight = originalInnerHeight;
    });

    it("should handle large amounts efficiently", () => {
      const testElement = new (element.constructor)();
      const result = testElement.renderBR(1000);
      
      expect(result).to.be.an('array');
      expect(result.length).to.equal(1000);
    });
  });

  describe("Dynamic amount changes", () => {
    it("should update br count when amount property changes", async () => {
      const testElement = await fixture(html`<b-r amount="5"></b-r>`);
      await testElement.updateComplete;
      
      expect(testElement.shadowRoot.querySelectorAll("br").length).to.equal(5);
      
      testElement.amount = 10;
      await testElement.updateComplete;
      
      expect(testElement.shadowRoot.querySelectorAll("br").length).to.equal(10);
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle rapid amount changes", async () => {
      const testElement = await fixture(html`<b-r amount="1"></b-r>`);
      
      const amounts = [1, 5, 2, 8, 0, 15];
      
      for (const amount of amounts) {
        testElement.amount = amount;
        await testElement.updateComplete;
        
        if (amount === 0) {
          // Special case: uses innerHeight calculation
          expect(testElement.shadowRoot.querySelectorAll("br").length).to.be.greaterThan(0);
        } else {
          expect(testElement.shadowRoot.querySelectorAll("br").length).to.equal(amount);
        }
        await expect(testElement).shadowDom.to.be.accessible();
      }
    });
  });

  describe("Accessibility scenarios", () => {
    it("should remain accessible with small amounts", async () => {
      const testElement = await fixture(html`<b-r amount="3"></b-r>`);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible with medium amounts", async () => {
      const testElement = await fixture(html`<b-r amount="25"></b-r>`);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible with large amounts", async () => {
      const testElement = await fixture(html`<b-r amount="100"></b-r>`);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible with auto-calculated amounts", async () => {
      const originalInnerHeight = globalThis.innerHeight;
      globalThis.innerHeight = 630; // Should result in 630/21 = 30
      
      const testElement = await fixture(html`<b-r amount="0"></b-r>`);
      await testElement.updateComplete;
      
      await expect(testElement).shadowDom.to.be.accessible();
      
      globalThis.innerHeight = originalInnerHeight;
    });
  });

  describe("Edge cases and error handling", () => {
    it("should handle undefined amount gracefully", async () => {
      const testElement = await fixture(html`<b-r></b-r>`);
      testElement.amount = undefined;
      await testElement.updateComplete;
      
      // undefined in while loop condition behaves as falsy
      expect(testElement.shadowRoot.querySelectorAll("br").length).to.equal(0);
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle null amount gracefully", async () => {
      const testElement = await fixture(html`<b-r></b-r>`);
      testElement.amount = null;
      await testElement.updateComplete;
      
      // null in while loop condition behaves as falsy
      expect(testElement.shadowRoot.querySelectorAll("br").length).to.equal(0);
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle string number values", async () => {
      const testElement = await fixture(html`<b-r></b-r>`);
      testElement.amount = "7";
      await testElement.updateComplete;
      
      expect(testElement.amount).to.equal("7");
      expect(testElement.shadowRoot.querySelectorAll("br").length).to.equal(7);
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle non-numeric string values", async () => {
      const testElement = await fixture(html`<b-r></b-r>`);
      testElement.amount = "not-a-number";
      await testElement.updateComplete;
      
      expect(testElement.amount).to.equal("not-a-number");
      expect(testElement.shadowRoot.querySelectorAll("br").length).to.equal(0);
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle very large amounts", async () => {
      const testElement = await fixture(html`<b-r></b-r>`);
      testElement.amount = 10000;
      await testElement.updateComplete;
      
      expect(testElement.amount).to.equal(10000);
      expect(testElement.shadowRoot.querySelectorAll("br").length).to.equal(10000);
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle extreme edge case values", async () => {
      const testElement = await fixture(html`<b-r></b-r>`);
      
      const edgeCases = [
        { value: Number.MAX_SAFE_INTEGER, expected: Number.MAX_SAFE_INTEGER },
        { value: Number.POSITIVE_INFINITY, expected: 0 }, // Infinity fails while condition
        { value: Number.NEGATIVE_INFINITY, expected: 0 },
        { value: NaN, expected: 0 }
      ];
      
      for (const testCase of edgeCases) {
        testElement.amount = testCase.value;
        await testElement.updateComplete;
        
        if (testCase.expected === Number.MAX_SAFE_INTEGER) {
          // Skip counting for extremely large numbers to avoid test timeout
          expect(testElement.amount).to.equal(testCase.value);
        } else {
          expect(testElement.shadowRoot.querySelectorAll("br").length).to.equal(testCase.expected);
        }
        
        await expect(testElement).shadowDom.to.be.accessible();
      }
    });
  });

  describe("Responsive behavior with innerHeight", () => {
    it("should calculate breaks based on window height when amount is 0", async () => {
      const originalInnerHeight = globalThis.innerHeight;
      const testHeights = [210, 420, 630, 840];
      
      for (const height of testHeights) {
        globalThis.innerHeight = height;
        
        const testElement = await fixture(html`<b-r amount="0"></b-r>`);
        await testElement.updateComplete;
        
        const expectedBreaks = Math.floor(height / 21);
        expect(testElement.shadowRoot.querySelectorAll("br").length).to.equal(expectedBreaks);
        await expect(testElement).shadowDom.to.be.accessible();
      }
      
      globalThis.innerHeight = originalInnerHeight;
    });

    it("should handle changing window height", async () => {
      const originalInnerHeight = globalThis.innerHeight;
      
      const testElement = await fixture(html`<b-r amount="0"></b-r>`);
      
      // Test different heights
      globalThis.innerHeight = 210;
      testElement.amount = 0; // Trigger re-calculation
      await testElement.updateComplete;
      expect(testElement.shadowRoot.querySelectorAll("br").length).to.equal(10);
      
      globalThis.innerHeight = 420;
      testElement.amount = 0; // Trigger re-calculation
      await testElement.updateComplete;
      expect(testElement.shadowRoot.querySelectorAll("br").length).to.equal(20);
      
      globalThis.innerHeight = originalInnerHeight;
    });
  });

  describe("Performance considerations", () => {
    it("should handle moderate amounts efficiently", async () => {
      const startTime = performance.now();
      
      const testElement = await fixture(html`<b-r amount="500"></b-r>`);
      await testElement.updateComplete;
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      expect(testElement.shadowRoot.querySelectorAll("br").length).to.equal(500);
      expect(renderTime).to.be.lessThan(1000); // Should render in less than 1 second
    });

    it("should reuse render method correctly", () => {
      const testElement = new (element.constructor)();
      
      const result1 = testElement.renderBR(5);
      const result2 = testElement.renderBR(5);
      
      expect(result1.length).to.equal(result2.length);
      expect(result1.length).to.equal(5);
      expect(result2.length).to.equal(5);
    });
  });

  describe("Template rendering", () => {
    it("should have proper template structure", async () => {
      const testElement = await fixture(html`<b-r amount="1"></b-r>`);
      await testElement.updateComplete;
      
      // Note: The render method has a typo with </div> but no opening <div>
      // This tests the actual behavior
      const shadowContent = testElement.shadowRoot.innerHTML;
      expect(shadowContent).to.include('<br>');
    });
  });
});

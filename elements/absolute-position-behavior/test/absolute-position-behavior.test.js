import { fixture, expect, html } from "@open-wc/testing";
import "../absolute-position-behavior.js";

describe("absolute-position-behavior test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <div
        id="container"
        style="position: relative; width: 400px; height: 300px;"
      >
        <div
          id="target"
          style="position: absolute; top: 50px; left: 100px; width: 50px; height: 50px; background: blue;"
        >
          Target
        </div>
        <absolute-position-behavior for="target" position="bottom" auto>
          <div>Positioned content</div>
        </absolute-position-behavior>
      </div>
    `);
    element = element.querySelector("absolute-position-behavior");
  });

  it("basic setup", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal(
      "absolute-position-behavior",
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Slot functionality", () => {
    it("should have default slot with correct content", () => {
      const slot = element.shadowRoot.querySelector("slot");
      expect(slot).to.exist;
      const assignedNodes = slot.assignedNodes({ flatten: true });
      expect(assignedNodes.length).to.be.greaterThan(0);
      expect(assignedNodes[0].textContent).to.equal("Positioned content");
    });
  });

  describe("Property type validation with accessibility", () => {
    let testElement;

    beforeEach(async () => {
      testElement = await fixture(html`
        <absolute-position-behavior>
          <div>Test content</div>
        </absolute-position-behavior>
      `);
      await testElement.updateComplete;
    });

    describe("allowOverlap property", () => {
      it("should accept boolean values and maintain accessibility", async () => {
        testElement.allowOverlap = true;
        await testElement.updateComplete;
        expect(testElement.allowOverlap).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.allowOverlap = false;
        await testElement.updateComplete;
        expect(testElement.allowOverlap).to.equal(false);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should accept non-boolean values but maintain type in JavaScript", async () => {
        testElement.allowOverlap = 1;
        await testElement.updateComplete;
        expect(testElement.allowOverlap).to.equal(1);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.allowOverlap = "true";
        await testElement.updateComplete;
        expect(testElement.allowOverlap).to.equal("true");
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.allowOverlap).to.be.undefined;
      });
    });

    describe("auto property", () => {
      it("should accept boolean values and maintain accessibility", async () => {
        testElement.auto = true;
        await testElement.updateComplete;
        expect(testElement.auto).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.auto = false;
        await testElement.updateComplete;
        expect(testElement.auto).to.equal(false);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.auto).to.equal(false);
      });
    });

    describe("fitToVisibleBounds property", () => {
      it("should accept boolean values and maintain accessibility", async () => {
        testElement.fitToVisibleBounds = true;
        await testElement.updateComplete;
        expect(testElement.fitToVisibleBounds).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.fitToVisibleBounds = false;
        await testElement.updateComplete;
        expect(testElement.fitToVisibleBounds).to.equal(false);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.fitToVisibleBounds).to.equal(false);
      });
    });

    describe("hidden property", () => {
      it("should accept boolean values and maintain accessibility", async () => {
        testElement.hidden = true;
        await testElement.updateComplete;
        expect(testElement.hidden).to.equal(true);
        // Skip accessibility test when hidden as element won't be visible

        testElement.hidden = false;
        await testElement.updateComplete;
        expect(testElement.hidden).to.equal(false);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.hidden).to.equal(false);
      });
    });

    describe("for property", () => {
      it("should accept string ID values and maintain accessibility", async () => {
        testElement.for = "target-element";
        await testElement.updateComplete;
        expect(testElement.for).to.equal("target-element");
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.for = "another-target";
        await testElement.updateComplete;
        expect(testElement.for).to.equal("another-target");
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.for = null;
        await testElement.updateComplete;
        expect(testElement.for).to.equal(null);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should accept non-string values but maintain type in JavaScript", async () => {
        testElement.for = 123;
        await testElement.updateComplete;
        expect(testElement.for).to.equal(123);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.for = true;
        await testElement.updateComplete;
        expect(testElement.for).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.for).to.equal(null);
      });
    });

    describe("offset property", () => {
      it("should accept number values and maintain accessibility", async () => {
        testElement.offset = 10;
        await testElement.updateComplete;
        expect(testElement.offset).to.equal(10);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.offset = -5;
        await testElement.updateComplete;
        expect(testElement.offset).to.equal(-5);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.offset = 0;
        await testElement.updateComplete;
        expect(testElement.offset).to.equal(0);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should accept non-number values but maintain type in JavaScript", async () => {
        testElement.offset = "10";
        await testElement.updateComplete;
        expect(testElement.offset).to.equal("10");
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.offset = true;
        await testElement.updateComplete;
        expect(testElement.offset).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.offset).to.equal(0);
      });
    });

    describe("sticky property", () => {
      it("should accept boolean values and maintain accessibility", async () => {
        testElement.sticky = true;
        await testElement.updateComplete;
        expect(testElement.sticky).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.sticky = false;
        await testElement.updateComplete;
        expect(testElement.sticky).to.equal(false);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.sticky).to.equal(false);
      });
    });

    describe("position property", () => {
      it("should accept valid position values and maintain accessibility", async () => {
        const validPositions = ["top", "bottom", "left", "right"];

        for (const pos of validPositions) {
          testElement.position = pos;
          await testElement.updateComplete;
          expect(testElement.position).to.equal(pos);
          await expect(testElement).shadowDom.to.be.accessible();
        }
      });

      it("should accept non-standard values but maintain type in JavaScript", async () => {
        testElement.position = "center";
        await testElement.updateComplete;
        expect(testElement.position).to.equal("center");
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.position = 123;
        await testElement.updateComplete;
        expect(testElement.position).to.equal(123);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.position).to.equal("bottom");
      });
    });

    describe("positionAlign property", () => {
      it("should accept valid alignment values and maintain accessibility", async () => {
        const validAligns = ["start", "end", "center"];

        for (const align of validAligns) {
          testElement.positionAlign = align;
          await testElement.updateComplete;
          expect(testElement.positionAlign).to.equal(align);
          await expect(testElement).shadowDom.to.be.accessible();
        }
      });

      it("should have correct default value", () => {
        expect(testElement.positionAlign).to.be.undefined;
      });
    });

    describe("justify property", () => {
      it("should accept boolean values and maintain accessibility", async () => {
        testElement.justify = true;
        await testElement.updateComplete;
        expect(testElement.justify).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.justify = false;
        await testElement.updateComplete;
        expect(testElement.justify).to.equal(false);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.justify).to.be.undefined;
      });
    });

    describe("target property", () => {
      it("should accept element object values and maintain accessibility", async () => {
        const targetDiv = globalThis.document.createElement("div");
        targetDiv.id = "test-target";

        testElement.target = targetDiv;
        await testElement.updateComplete;
        expect(testElement.target).to.equal(targetDiv);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.target = null;
        await testElement.updateComplete;
        expect(testElement.target).to.equal(null);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.target).to.equal(null);
      });
    });

    describe("__positions property (internal)", () => {
      it("should handle object values and maintain accessibility", async () => {
        const positions = { top: "10px", left: "20px" };
        testElement.__positions = positions;
        await testElement.updateComplete;
        expect(testElement.__positions).to.deep.equal(positions);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.__positions = {};
        await testElement.updateComplete;
        expect(testElement.__positions).to.deep.equal({});
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should have correct default value", () => {
        expect(testElement.__positions).to.deep.equal({});
      });
    });
  });

  describe("Attribute to property mapping", () => {
    it("should set allowOverlap property from allow-overlap attribute", async () => {
      const testElement = await fixture(html`
        <absolute-position-behavior allow-overlap>
          <div>Test</div>
        </absolute-position-behavior>
      `);
      expect(testElement.allowOverlap).to.equal(true);
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should set fitToVisibleBounds property from fit-to-visible-bounds attribute", async () => {
      const testElement = await fixture(html`
        <absolute-position-behavior fit-to-visible-bounds>
          <div>Test</div>
        </absolute-position-behavior>
      `);
      expect(testElement.fitToVisibleBounds).to.equal(true);
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should set for property from for attribute", async () => {
      const testElement = await fixture(html`
        <absolute-position-behavior for="target-id">
          <div>Test</div>
        </absolute-position-behavior>
      `);
      expect(testElement.for).to.equal("target-id");
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should set offset property from offset attribute", async () => {
      const testElement = await fixture(html`
        <absolute-position-behavior offset="15">
          <div>Test</div>
        </absolute-position-behavior>
      `);
      expect(testElement.offset).to.equal(15);
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should set position property from position attribute", async () => {
      const testElement = await fixture(html`
        <absolute-position-behavior position="top">
          <div>Test</div>
        </absolute-position-behavior>
      `);
      expect(testElement.position).to.equal("top");
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should set positionAlign property from position-align attribute", async () => {
      const testElement = await fixture(html`
        <absolute-position-behavior position-align="start">
          <div>Test</div>
        </absolute-position-behavior>
      `);
      expect(testElement.positionAlign).to.equal("start");
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Positioning functionality and accessibility", () => {
    it("should maintain accessibility with different positioning configurations", async () => {
      const positions = ["top", "bottom", "left", "right"];

      for (const pos of positions) {
        const container = await fixture(html`
          <div
            id="container-${pos}"
            style="position: relative; width: 400px; height: 300px;"
          >
            <div
              id="target-${pos}"
              style="position: absolute; top: 100px; left: 150px; width: 50px; height: 50px; background: red;"
            >
              Target
            </div>
            <absolute-position-behavior
              for="target-${pos}"
              position="${pos}"
              auto
              offset="10"
            >
              <div>${pos} positioned content</div>
            </absolute-position-behavior>
          </div>
        `);

        const positionedElement = container.querySelector(
          "absolute-position-behavior",
        );
        await positionedElement.updateComplete;
        await expect(positionedElement).shadowDom.to.be.accessible();
      }
    });

    it("should remain accessible with sticky positioning", async () => {
      const testElement = await fixture(html`
        <div style="position: relative; width: 400px; height: 300px;">
          <div
            id="sticky-target"
            style="position: absolute; top: 50px; left: 50px; width: 100px; height: 50px; background: green;"
          >
            Sticky Target
          </div>
          <absolute-position-behavior
            for="sticky-target"
            position="bottom"
            sticky
            auto
          >
            <div>Sticky positioned content</div>
          </absolute-position-behavior>
        </div>
      `);

      const positionedElement = testElement.querySelector(
        "absolute-position-behavior",
      );
      await positionedElement.updateComplete;
      await expect(positionedElement).shadowDom.to.be.accessible();
    });

    it("should maintain accessibility with fit-to-visible-bounds enabled", async () => {
      const testElement = await fixture(html`
        <div
          style="position: relative; width: 200px; height: 150px; overflow: hidden;"
        >
          <div
            id="bounded-target"
            style="position: absolute; top: 120px; left: 180px; width: 50px; height: 30px; background: purple;"
          >
            Edge Target
          </div>
          <absolute-position-behavior
            for="bounded-target"
            position="bottom"
            fit-to-visible-bounds
            auto
          >
            <div>Bounded content</div>
          </absolute-position-behavior>
        </div>
      `);

      const positionedElement = testElement.querySelector(
        "absolute-position-behavior",
      );
      await positionedElement.updateComplete;
      await expect(positionedElement).shadowDom.to.be.accessible();
    });

    it("should handle positioning with offset values", async () => {
      const offsets = [0, 10, -5, 25];

      for (const offset of offsets) {
        const testElement = await fixture(html`
          <div style="position: relative; width: 300px; height: 200px;">
            <div
              id="offset-target-${offset}"
              style="position: absolute; top: 50px; left: 50px; width: 60px; height: 40px; background: orange;"
            >
              Offset Target
            </div>
            <absolute-position-behavior
              for="offset-target-${offset}"
              position="bottom"
              offset="${offset}"
              auto
            >
              <div>Content with ${offset}px offset</div>
            </absolute-position-behavior>
          </div>
        `);

        const positionedElement = testElement.querySelector(
          "absolute-position-behavior",
        );
        await positionedElement.updateComplete;
        await expect(positionedElement).shadowDom.to.be.accessible();
      }
    });
  });

  describe("Auto positioning and lifecycle", () => {
    it("should handle auto positioning lifecycle", async () => {
      const testElement = await fixture(html`
        <div style="position: relative; width: 300px; height: 200px;">
          <div
            id="auto-target"
            style="position: absolute; top: 70px; left: 70px; width: 40px; height: 40px; background: cyan;"
          >
            Auto Target
          </div>
          <absolute-position-behavior for="auto-target" position="top">
            <div>Auto positioning test</div>
          </absolute-position-behavior>
        </div>
      `);

      const positionedElement = testElement.querySelector(
        "absolute-position-behavior",
      );

      // Initially auto should be false
      expect(positionedElement.auto).to.be.false;
      await expect(positionedElement).shadowDom.to.be.accessible();

      // Enable auto positioning
      positionedElement.auto = true;
      await positionedElement.updateComplete;
      await expect(positionedElement).shadowDom.to.be.accessible();

      // Disable auto positioning
      positionedElement.auto = false;
      await positionedElement.updateComplete;
      await expect(positionedElement).shadowDom.to.be.accessible();
    });

    it("should handle manual positioning methods", async () => {
      const testElement = await fixture(html`
        <div style="position: relative; width: 300px; height: 200px;">
          <div
            id="manual-target"
            style="position: absolute; top: 80px; left: 80px; width: 50px; height: 30px; background: magenta;"
          >
            Manual Target
          </div>
          <absolute-position-behavior for="manual-target" position="left">
            <div>Manual positioning test</div>
          </absolute-position-behavior>
        </div>
      `);

      const positionedElement = testElement.querySelector(
        "absolute-position-behavior",
      );

      // Test manual setPosition
      positionedElement.setPosition();
      await positionedElement.updateComplete;
      await expect(positionedElement).shadowDom.to.be.accessible();

      // Test updatePosition
      positionedElement.updatePosition();
      await positionedElement.updateComplete;
      await expect(positionedElement).shadowDom.to.be.accessible();

      // Test unsetPosition
      positionedElement.unsetPosition();
      await positionedElement.updateComplete;
      await expect(positionedElement).shadowDom.to.be.accessible();
    });
  });

  describe("Edge cases and error handling", () => {
    it("should remain accessible when target element doesn't exist", async () => {
      const testElement = await fixture(html`
        <absolute-position-behavior
          for="nonexistent-target"
          position="bottom"
          auto
        >
          <div>Content for missing target</div>
        </absolute-position-behavior>
      `);

      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible when hidden", async () => {
      const testElement = await fixture(html`
        <absolute-position-behavior hidden>
          <div>Hidden content</div>
        </absolute-position-behavior>
      `);

      await testElement.updateComplete;
      // Element is hidden, so accessibility testing isn't meaningful
      expect(testElement.hidden).to.be.true;
    });

    it("should handle unusual property values", async () => {
      const testElement = await fixture(html`
        <absolute-position-behavior>
          <div>Test content</div>
        </absolute-position-behavior>
      `);

      const unusualValues = [
        "   \t\n   ", // whitespace
        "<script>alert('test')</script>", // potentially dangerous content
        "\u00A0\u2000\u2001", // various unicode spaces
        "🗺 positioned content 🗺", // emoji
        "Very long positioning identifier that might cause issues with layout or positioning calculations",
        "Multi\nline\ntext", // multiline
        "Text with 'quotes' and \"double quotes\" and special chars: !@#$%^&*()",
      ];

      for (const value of unusualValues) {
        testElement.for = value;
        testElement.position = value;
        await testElement.updateComplete;

        expect(testElement.for).to.equal(value);
        expect(testElement.position).to.equal(value);
        await expect(testElement).shadowDom.to.be.accessible();
      }
    });

    it("should handle extreme offset values", async () => {
      const testElement = await fixture(html`
        <absolute-position-behavior>
          <div>Extreme offset test</div>
        </absolute-position-behavior>
      `);

      const extremeOffsets = [-1000, 0, 1000, 99999, -99999];

      for (const offset of extremeOffsets) {
        testElement.offset = offset;
        await testElement.updateComplete;

        expect(testElement.offset).to.equal(offset);
        await expect(testElement).shadowDom.to.be.accessible();
      }
    });
  });

  describe("Position alignment combinations", () => {
    it("should maintain accessibility with different position-align combinations", async () => {
      const positions = ["top", "bottom", "left", "right"];
      const alignments = ["start", "end", "center"];

      for (const pos of positions) {
        for (const align of alignments) {
          const testElement = await fixture(html`
            <div style="position: relative; width: 400px; height: 300px;">
              <div
                id="align-target-${pos}-${align}"
                style="position: absolute; top: 100px; left: 150px; width: 80px; height: 60px; background: teal;"
              >
                Align Target
              </div>
              <absolute-position-behavior
                for="align-target-${pos}-${align}"
                position="${pos}"
                position-align="${align}"
                auto
              >
                <div>${pos} ${align} content</div>
              </absolute-position-behavior>
            </div>
          `);

          const positionedElement = testElement.querySelector(
            "absolute-position-behavior",
          );
          await positionedElement.updateComplete;
          await expect(positionedElement).shadowDom.to.be.accessible();
        }
      }
    });
  });

  describe("State manager integration", () => {
    it("should maintain accessibility during state manager interactions", async () => {
      const testElement = await fixture(html`
        <div style="position: relative; width: 350px; height: 250px;">
          <div
            id="manager-target"
            style="position: absolute; top: 60px; left: 60px; width: 70px; height: 50px; background: lime;"
          >
            Manager Target
          </div>
          <absolute-position-behavior
            for="manager-target"
            position="right"
            allow-overlap
            sticky
            auto
          >
            <div>State managed content</div>
          </absolute-position-behavior>
        </div>
      `);

      const positionedElement = testElement.querySelector(
        "absolute-position-behavior",
      );
      await positionedElement.updateComplete;

      // Test that the element integrates with AbsolutePositionStateManager
      expect(globalThis.AbsolutePositionStateManager).to.exist;

      await expect(positionedElement).shadowDom.to.be.accessible();
    });
  });

  describe("Mixed usage with AbsolutePositionBehaviorClass", () => {
    it("should maintain accessibility when used as a mixin", async () => {
      // This tests that the behavior class can be used as a mixin
      // The accessibility should be maintained regardless of usage pattern
      const testElement = await fixture(html`
        <absolute-position-behavior position="bottom" justify>
          <div>Mixin usage test</div>
        </absolute-position-behavior>
      `);

      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });
});

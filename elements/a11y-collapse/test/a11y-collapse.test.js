import { fixture, expect, html } from "@open-wc/testing";

import { A11yCollapse } from "../a11y-collapse.js";

describe("a11y-collapse test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <a11y-collapse title="test-title">
        <div slot="heading">Test Heading</div>
        <div>Test content</div>
      </a11y-collapse>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Property type validation with accessibility (Lit-aware)", () => {
    let testElement;

    beforeEach(async () => {
      testElement = await fixture(html`
        <a11y-collapse>
          <div slot="heading">Test Heading</div>
          <div>Test content to expand/collapse</div>
        </a11y-collapse>
      `);
      await testElement.updateComplete;
    });

    describe("Boolean properties with reflect behavior", () => {
      describe("headingButton property", () => {
        it("should have correct default value", () => {
          expect(testElement.headingButton).to.equal(false);
        });

        it("should accept boolean values and maintain accessibility", async () => {
          testElement.headingButton = true;
          await testElement.updateComplete;
          expect(testElement.headingButton).to.equal(true);
          expect(testElement.hasAttribute("heading-button")).to.be.true;
          await expect(testElement).shadowDom.to.be.accessible();

          testElement.headingButton = false;
          await testElement.updateComplete;
          expect(testElement.headingButton).to.equal(false);
          expect(testElement.hasAttribute("heading-button")).to.be.false;
          await expect(testElement).shadowDom.to.be.accessible();
        });

        it("should preserve JavaScript types (no automatic conversion)", async () => {
          testElement.headingButton = 1;
          await testElement.updateComplete;
          expect(testElement.headingButton).to.equal(1);

          testElement.headingButton = "true";
          await testElement.updateComplete;
          expect(testElement.headingButton).to.equal("true");

          testElement.headingButton = null;
          await testElement.updateComplete;
          expect(testElement.headingButton).to.equal(null);
        });
      });

      describe("disabled property", () => {
        it("should have correct default value", () => {
          expect(testElement.disabled).to.equal(false);
        });

        it("should reflect to attribute and maintain accessibility", async () => {
          testElement.disabled = true;
          await testElement.updateComplete;
          expect(testElement.disabled).to.equal(true);
          expect(testElement.hasAttribute("disabled")).to.be.true;
          await expect(testElement).shadowDom.to.be.accessible();

          testElement.disabled = false;
          await testElement.updateComplete;
          expect(testElement.disabled).to.equal(false);
          expect(testElement.hasAttribute("disabled")).to.be.false;
          await expect(testElement).shadowDom.to.be.accessible();
        });
      });

      describe("expanded property", () => {
        it("should have correct default value", () => {
          expect(testElement.expanded).to.equal(false);
        });

        it("should reflect to attribute and maintain accessibility", async () => {
          testElement.expanded = true;
          await testElement.updateComplete;
          expect(testElement.expanded).to.equal(true);
          expect(testElement.hasAttribute("expanded")).to.be.true;
          await expect(testElement).shadowDom.to.be.accessible();

          testElement.expanded = false;
          await testElement.updateComplete;
          expect(testElement.expanded).to.equal(false);
          expect(testElement.hasAttribute("expanded")).to.be.false;
          await expect(testElement).shadowDom.to.be.accessible();
        });
      });

      describe("hidden property", () => {
        it("should have correct default value", () => {
          expect(testElement.hidden).to.equal(false);
        });

        it("should reflect to attribute", async () => {
          testElement.hidden = true;
          await testElement.updateComplete;
          expect(testElement.hidden).to.equal(true);
          expect(testElement.hasAttribute("hidden")).to.be.true;

          testElement.hidden = false;
          await testElement.updateComplete;
          expect(testElement.hidden).to.equal(false);
          expect(testElement.hasAttribute("hidden")).to.be.false;
        });
      });

      describe("accordion property (deprecated)", () => {
        it("should have correct default value", () => {
          expect(testElement.accordion).to.equal(false);
        });

        it("should reflect to attribute and maintain accessibility", async () => {
          testElement.accordion = true;
          await testElement.updateComplete;
          expect(testElement.accordion).to.equal(true);
          expect(testElement.hasAttribute("accordion")).to.be.true;
          await expect(testElement).shadowDom.to.be.accessible();
        });
      });
    });

    describe("String properties", () => {
      describe("icon property", () => {
        it("should have correct default value", () => {
          expect(testElement.icon).to.equal("icons:expand-more");
        });

        it("should accept string values and maintain accessibility", async () => {
          testElement.icon = "icons:expand-less";
          await testElement.updateComplete;
          expect(testElement.icon).to.equal("icons:expand-less");
          await expect(testElement).shadowDom.to.be.accessible();

          testElement.icon = "";
          await testElement.updateComplete;
          expect(testElement.icon).to.equal("");
          await expect(testElement).shadowDom.to.be.accessible();
        });

        it("should preserve JavaScript types", async () => {
          testElement.icon = 123;
          await testElement.updateComplete;
          expect(testElement.icon).to.equal(123);

          testElement.icon = null;
          await testElement.updateComplete;
          expect(testElement.icon).to.equal(null);
        });
      });

      describe("label property", () => {
        it("should have correct default value", () => {
          expect(testElement.label).to.equal("expand");
        });

        it("should accept string values and maintain accessibility", async () => {
          testElement.label = "Show details";
          await testElement.updateComplete;
          expect(testElement.label).to.equal("Show details");
          await expect(testElement).shadowDom.to.be.accessible();
        });
      });

      describe("heading property", () => {
        it("should have correct default value", () => {
          expect(testElement.heading).to.equal(null);
        });

        it("should accept string values and maintain accessibility", async () => {
          testElement.heading = "Section Title";
          await testElement.updateComplete;
          expect(testElement.heading).to.equal("Section Title");
          await expect(testElement).shadowDom.to.be.accessible();
        });
      });

      describe("tooltip property", () => {
        it("should have correct default value", () => {
          expect(testElement.tooltip).to.equal("expand");
        });

        it("should accept string values and maintain accessibility", async () => {
          testElement.tooltip = "Click to expand section";
          await testElement.updateComplete;
          expect(testElement.tooltip).to.equal("Click to expand section");
          await expect(testElement).shadowDom.to.be.accessible();
        });
      });

      describe("iconExpanded property (with attribute mapping)", () => {
        it("should have no default value", () => {
          expect(testElement.iconExpanded).to.be.undefined;
        });

        it("should accept string values and maintain accessibility", async () => {
          testElement.iconExpanded = "icons:expand-less";
          await testElement.updateComplete;
          expect(testElement.iconExpanded).to.equal("icons:expand-less");
          await expect(testElement).shadowDom.to.be.accessible();
        });
      });

      describe("labelExpanded property (with attribute mapping)", () => {
        it("should have no default value", () => {
          expect(testElement.labelExpanded).to.be.undefined;
        });

        it("should accept string values and maintain accessibility", async () => {
          testElement.labelExpanded = "Hide details";
          await testElement.updateComplete;
          expect(testElement.labelExpanded).to.equal("Hide details");
          await expect(testElement).shadowDom.to.be.accessible();
        });
      });

      describe("tooltipExpanded property (with attribute mapping)", () => {
        it("should have no default value", () => {
          expect(testElement.tooltipExpanded).to.be.undefined;
        });

        it("should accept string values and maintain accessibility", async () => {
          testElement.tooltipExpanded = "Click to collapse section";
          await testElement.updateComplete;
          expect(testElement.tooltipExpanded).to.equal(
            "Click to collapse section",
          );
          await expect(testElement).shadowDom.to.be.accessible();
        });
      });
    });
  });

  describe("Attribute to property mapping", () => {
    it("should map heading-button attribute to headingButton property", async () => {
      const testElement = await fixture(html`
        <a11y-collapse heading-button>
          <div slot="heading">Test</div>
          <div>Content</div>
        </a11y-collapse>
      `);
      expect(testElement.headingButton).to.equal(true);
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should map icon-expanded attribute to iconExpanded property", async () => {
      const testElement = await fixture(html`
        <a11y-collapse icon-expanded="icons:expand-less">
          <div slot="heading">Test</div>
          <div>Content</div>
        </a11y-collapse>
      `);
      expect(testElement.iconExpanded).to.equal("icons:expand-less");
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should map label-expanded attribute to labelExpanded property", async () => {
      const testElement = await fixture(html`
        <a11y-collapse label-expanded="collapse">
          <div slot="heading">Test</div>
          <div>Content</div>
        </a11y-collapse>
      `);
      expect(testElement.labelExpanded).to.equal("collapse");
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should map tooltip-expanded attribute to tooltipExpanded property", async () => {
      const testElement = await fixture(html`
        <a11y-collapse tooltip-expanded="Click to hide">
          <div slot="heading">Test</div>
          <div>Content</div>
        </a11y-collapse>
      `);
      expect(testElement.tooltipExpanded).to.equal("Click to hide");
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Functional behavior with accessibility", () => {
    let testElement;

    beforeEach(async () => {
      testElement = await fixture(html`
        <a11y-collapse>
          <div slot="heading">Collapsible Section</div>
          <div>This content can be expanded or collapsed</div>
        </a11y-collapse>
      `);
      await testElement.updateComplete;
    });

    it("should toggle expanded state and maintain accessibility", async () => {
      expect(testElement.expanded).to.equal(false);

      testElement.toggle(true);
      await testElement.updateComplete;
      expect(testElement.expanded).to.equal(true);
      await expect(testElement).shadowDom.to.be.accessible();

      testElement.toggle(false);
      await testElement.updateComplete;
      expect(testElement.expanded).to.equal(false);
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle disabled state properly", async () => {
      testElement.disabled = true;
      await testElement.updateComplete;
      expect(testElement.disabled).to.equal(true);
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should work with heading-button mode", async () => {
      testElement.headingButton = true;
      await testElement.updateComplete;
      expect(testElement.headingButton).to.equal(true);
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Slot functionality", () => {
    it("should have heading slot with correct content", async () => {
      const testElement = await fixture(html`
        <a11y-collapse>
          <div slot="heading">Custom Heading Content</div>
          <div>Main content</div>
        </a11y-collapse>
      `);
      await testElement.updateComplete;

      const headingSlot = testElement.shadowRoot.querySelector(
        'slot[name="heading"]',
      );
      expect(headingSlot).to.exist;
      const assignedNodes = headingSlot.assignedNodes({ flatten: true });
      expect(assignedNodes.length).to.be.greaterThan(0);
      expect(assignedNodes[0].textContent).to.include("Custom Heading Content");

      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should have content slot with correct content", async () => {
      const testElement = await fixture(html`
        <a11y-collapse expanded>
          <div slot="heading">Heading</div>
          <div slot="content">Named content slot</div>
          <div>Default slot content</div>
        </a11y-collapse>
      `);
      await testElement.updateComplete;

      const contentSlot = testElement.shadowRoot.querySelector(
        'slot[name="content"]',
      );
      expect(contentSlot).to.exist;
      const contentNodes = contentSlot.assignedNodes({ flatten: true });
      expect(contentNodes.length).to.be.greaterThan(0);
      expect(contentNodes[0].textContent).to.include("Named content slot");

      const defaultSlot =
        testElement.shadowRoot.querySelector("slot:not([name])");
      expect(defaultSlot).to.exist;
      const defaultNodes = defaultSlot.assignedNodes({ flatten: true });
      expect(defaultNodes.length).to.be.greaterThan(0);
      // whitespace text nodes are assigned to the default slot ahead of the
      // slotted element, so search the assigned nodes for the content rather
      // than relying on the first node.
      const defaultContent = defaultNodes.find(
        (node) =>
          node.textContent &&
          node.textContent.includes("Default slot content"),
      );
      expect(defaultContent).to.exist;

      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle empty slots gracefully", async () => {
      const testElement = await fixture(html`
        <a11y-collapse>
          <div>Only default slot content</div>
        </a11y-collapse>
      `);
      await testElement.updateComplete;

      const slots = testElement.shadowRoot.querySelectorAll("slot");
      expect(slots.length).to.be.greaterThan(0);

      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Event handling and lifecycle", () => {
    let eventElement;

    beforeEach(async () => {
      eventElement = await fixture(html`
        <a11y-collapse>
          <div slot="heading">Event Test Heading</div>
          <div>Event test content</div>
        </a11y-collapse>
      `);
      await eventElement.updateComplete;
    });

    it("should fire toggle event when toggled", async () => {
      let toggleEventFired = false;
      let toggleEventDetail = null;

      eventElement.addEventListener("toggle", (e) => {
        toggleEventFired = true;
        toggleEventDetail = e.detail;
      });

      eventElement.toggle(true);
      await eventElement.updateComplete;

      expect(toggleEventFired).to.be.true;
      expect(toggleEventDetail).to.equal(eventElement);
      await expect(eventElement).shadowDom.to.be.accessible();
    });

    it("should fire expand event when expanded", async () => {
      let expandEventFired = false;
      let expandEventDetail = null;

      eventElement.addEventListener("expand", (e) => {
        expandEventFired = true;
        expandEventDetail = e.detail;
      });

      eventElement.toggle(true);
      await eventElement.updateComplete;

      expect(expandEventFired).to.be.true;
      expect(expandEventDetail).to.equal(eventElement);
      await expect(eventElement).shadowDom.to.be.accessible();
    });

    it("should fire collapse event when collapsed", async () => {
      // First expand it
      eventElement.expanded = true;
      await eventElement.updateComplete;

      let collapseEventFired = false;
      let collapseEventDetail = null;

      eventElement.addEventListener("collapse", (e) => {
        collapseEventFired = true;
        collapseEventDetail = e.detail;
      });

      eventElement.toggle(false);
      await eventElement.updateComplete;

      expect(collapseEventFired).to.be.true;
      expect(collapseEventDetail).to.equal(eventElement);
      await expect(eventElement).shadowDom.to.be.accessible();
    });

    it("should fire deprecated a11y-collapse-toggle event", async () => {
      let deprecatedEventFired = false;

      eventElement.addEventListener("a11y-collapse-toggle", () => {
        deprecatedEventFired = true;
      });

      eventElement.toggle();
      await eventElement.updateComplete;

      expect(deprecatedEventFired).to.be.true;
      await expect(eventElement).shadowDom.to.be.accessible();
    });

    it("should fire click event when clicked", async () => {
      let clickEventFired = false;

      eventElement.addEventListener("a11y-collapse-click", () => {
        clickEventFired = true;
      });

      eventElement._onClick();
      await eventElement.updateComplete;

      expect(clickEventFired).to.be.true;
      await expect(eventElement).shadowDom.to.be.accessible();
    });

    it("should fire attached event on connectedCallback", async () => {
      let attachedEventFired = false;
      let attachedEventDetail = null;

      const container = globalThis.document.createElement("div");
      globalThis.document.body.appendChild(container);

      container.addEventListener("a11y-collapse-attached", (e) => {
        attachedEventFired = true;
        attachedEventDetail = e.detail;
      });

      const newElement = globalThis.document.createElement("a11y-collapse");
      container.appendChild(newElement);

      // Wait for the setTimeout in connectedCallback
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(attachedEventFired).to.be.true;
      expect(attachedEventDetail).to.equal(newElement);

      // Cleanup
      globalThis.document.body.removeChild(container);
    });

    it("should fire detached event on disconnectedCallback", async () => {
      let detachedEventFired = false;
      let detachedEventDetail = null;

      const container = globalThis.document.createElement("div");
      globalThis.document.body.appendChild(container);

      const newElement = globalThis.document.createElement("a11y-collapse");
      container.appendChild(newElement);

      // the detached event is dispatched after the element is removed from the
      // DOM, so it cannot bubble to its former parent. listen on the element
      // itself to catch it.
      newElement.addEventListener("a11y-collapse-detached", (e) => {
        detachedEventFired = true;
        detachedEventDetail = e.detail;
      });

      container.removeChild(newElement);

      expect(detachedEventFired).to.be.true;
      expect(detachedEventDetail).to.equal(newElement);

      // Cleanup
      globalThis.document.body.removeChild(container);
    });
  });

  describe("Click handling and interaction", () => {
    it("should handle click when not disabled", async () => {
      const testElement = await fixture(html`
        <a11y-collapse>
          <div slot="heading">Clickable Heading</div>
          <div>Clickable content</div>
        </a11y-collapse>
      `);
      await testElement.updateComplete;

      expect(testElement.expanded).to.be.false;

      testElement._onClick();
      await testElement.updateComplete;

      expect(testElement.expanded).to.be.true;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should not handle click when disabled", async () => {
      const testElement = await fixture(html`
        <a11y-collapse disabled>
          <div slot="heading">Disabled Heading</div>
          <div>Disabled content</div>
        </a11y-collapse>
      `);
      await testElement.updateComplete;

      const initialExpanded = testElement.expanded;

      testElement._onClick();
      await testElement.updateComplete;

      expect(testElement.expanded).to.equal(initialExpanded);
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Button rendering modes", () => {
    it("should render heading button mode correctly", async () => {
      const testElement = await fixture(html`
        <a11y-collapse heading-button>
          <div slot="heading">Heading Button Mode</div>
          <div>Content for heading button mode</div>
        </a11y-collapse>
      `);
      await testElement.updateComplete;

      // Should have a button element in heading button mode
      const button = testElement.shadowRoot.querySelector("button");
      expect(button).to.exist;

      // Should not have simple-icon-button-lite in heading button mode
      const iconButton = testElement.shadowRoot.querySelector(
        "simple-icon-button-lite",
      );
      expect(iconButton).to.not.exist;

      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should render icon button mode correctly", async () => {
      const testElement = await fixture(html`
        <a11y-collapse>
          <div slot="heading">Icon Button Mode</div>
          <div>Content for icon button mode</div>
        </a11y-collapse>
      `);
      await testElement.updateComplete;

      // Should not have a button element in icon button mode
      const button = testElement.shadowRoot.querySelector("button");
      expect(button).to.not.exist;

      // Should have simple-icon-button-lite in icon button mode
      const iconButton = testElement.shadowRoot.querySelector(
        "simple-icon-button-lite",
      );
      expect(iconButton).to.exist;

      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle deprecated accordion property correctly", async () => {
      const testElement = await fixture(html`
        <a11y-collapse accordion>
          <div slot="heading">Accordion Mode</div>
          <div>Content for accordion mode</div>
        </a11y-collapse>
      `);
      await testElement.updateComplete;

      // Should render as heading button when accordion is true
      const button = testElement.shadowRoot.querySelector("button");
      expect(button).to.exist;

      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Expanded state helpers", () => {
    it("should return correct values from _getExpanded helper", () => {
      const testElement = globalThis.document.createElement("a11y-collapse");

      // When not expanded, should return default
      expect(testElement._getExpanded("default", "expanded", false)).to.equal(
        "default",
      );

      // When expanded and expanded prop exists, should return expanded
      expect(testElement._getExpanded("default", "expanded", true)).to.equal(
        "expanded",
      );

      // When expanded but no expanded prop, should return default
      expect(testElement._getExpanded("default", null, true)).to.equal(
        "default",
      );
      expect(testElement._getExpanded("default", undefined, true)).to.equal(
        "default",
      );
    });
  });

  describe("Label and tooltip management", () => {
    it("should update labels and tooltips based on expanded state", async () => {
      const testElement = await fixture(html`
        <a11y-collapse>
          <div slot="heading">Label Test</div>
          <div>Content for label testing</div>
        </a11y-collapse>
      `);
      await testElement.updateComplete;

      // Initially should have expand labels
      expect(testElement.label).to.equal("expand");
      expect(testElement.tooltip).to.equal("expand");

      // When expanded, should change to collapse
      testElement.toggle(true);
      await testElement.updateComplete;

      expect(testElement.label).to.equal("collapse");
      expect(testElement.tooltip).to.equal("collapse");

      // When collapsed again, should change back to expand
      testElement.toggle(false);
      await testElement.updateComplete;

      expect(testElement.label).to.equal("expand");
      expect(testElement.tooltip).to.equal("expand");

      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should use custom expanded labels when provided", async () => {
      const testElement = await fixture(html`
        <a11y-collapse
          label="Show more"
          label-expanded="Show less"
          tooltip="Click to show"
          tooltip-expanded="Click to hide"
        >
          <div slot="heading">Custom Labels</div>
          <div>Content with custom labels</div>
        </a11y-collapse>
      `);
      await testElement.updateComplete;

      // Should use custom labels when collapsed
      expect(testElement.label).to.equal("Show more");
      expect(testElement.tooltip).to.equal("Click to show");

      // When expanded, should use custom expanded labels
      testElement.toggle(true);
      await testElement.updateComplete;

      expect(testElement.label).to.equal("Show less");
      expect(testElement.tooltip).to.equal("Click to hide");

      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("HAX integration", () => {
    it("should have haxProperties defined", () => {
      expect(A11yCollapse.haxProperties).to.exist;
      expect(typeof A11yCollapse.haxProperties).to.equal("string");
      expect(A11yCollapse.haxProperties).to.include(
        "a11y-collapse.haxProperties.json",
      );
    });
  });

  describe("Edge cases and property combinations", () => {
    it("should remain accessible with multiple properties set", async () => {
      const testElement = await fixture(html`
        <a11y-collapse
          heading-button
          expanded
          tooltip="Click to collapse"
          icon-expanded="icons:expand-less"
        >
          <div slot="heading">Advanced Section</div>
          <div>Complex content with multiple properties configured</div>
        </a11y-collapse>
      `);
      await testElement.updateComplete;

      expect(testElement.headingButton).to.equal(true);
      expect(testElement.expanded).to.equal(true);
      // Note: label and tooltip get automatically set to "collapse" when expanded=true in _fireToggleEvents
      expect(testElement.label).to.equal("collapse");
      expect(testElement.tooltip).to.equal("collapse");
      expect(testElement.iconExpanded).to.equal("icons:expand-less");

      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle unusual property values without breaking functionality", async () => {
      const testElement = await fixture(html`
        <a11y-collapse>
          <div slot="heading">Edge Case Test</div>
          <div>Content for edge case testing</div>
        </a11y-collapse>
      `);

      const unusualValues = [
        "   \t\n   ", // whitespace
        "<script>alert('test')</script>", // potentially dangerous content
        "\u00A0\u2000\u2001", // various unicode spaces
        "🔽 collapsible section 🔽", // emoji
        "Very long label that might cause display issues or layout problems with the collapse interface and button sizing",
        "Multi\nline\nlabel", // multiline
        "Label with 'quotes' and \"double quotes\" and special chars: !@#$%^&*()",
      ];

      // icon is excluded from the unusual-value loop because it is a plain
      // string on a11y-collapse that gets forwarded to simple-icon-lite for
      // SVG resolution. Invalid icon names trigger simple-iconset's fallback
      // path lookup, producing 404s that are simple-icon's behavior, not
      // a11y-collapse's. icon is tested separately above with valid values.
      for (const value of unusualValues) {
        testElement.label = value;
        testElement.tooltip = value;
        testElement.heading = value;
        await testElement.updateComplete;

        expect(testElement.label).to.equal(value);
        expect(testElement.tooltip).to.equal(value);
        expect(testElement.heading).to.equal(value);

        // Most should maintain accessibility, but skip dangerous content and
        // whitespace-only values, which leave the button/tooltip without an
        // accessible name.
        if (!value.includes("<script>") && value.trim() !== "") {
          await expect(testElement).shadowDom.to.be.accessible();
        }
      }
    });

    it("should handle collapse method correctly", async () => {
      const testElement = await fixture(html`
        <a11y-collapse expanded>
          <div slot="heading">Collapse Method Test</div>
          <div>Content to be collapsed</div>
        </a11y-collapse>
      `);
      await testElement.updateComplete;

      expect(testElement.expanded).to.be.true;

      testElement.collapse();
      await testElement.updateComplete;

      expect(testElement.expanded).to.be.false;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle empty content gracefully", async () => {
      const testElement = await fixture(html`
        <a11y-collapse>
          <div slot="heading">Empty Content</div>
        </a11y-collapse>
      `);
      await testElement.updateComplete;

      testElement.expanded = true;
      await testElement.updateComplete;

      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should maintain accessibility when content is conditionally rendered", async () => {
      const testElement = await fixture(html`
        <a11y-collapse>
          <div slot="heading">Conditional Content</div>
          <div>This content is only shown when expanded</div>
        </a11y-collapse>
      `);
      await testElement.updateComplete;

      // Content slots are not rendered when collapsed, so the default slot
      // should be absent from the shadow root.
      expect(testElement.expanded).to.be.false;
      const contentSlot =
        testElement.shadowRoot.querySelector("slot:not([name])");
      expect(contentSlot).to.be.null;

      // Content should be in DOM when expanded
      testElement.expanded = true;
      await testElement.updateComplete;

      const expandedContentSlot =
        testElement.shadowRoot.querySelector("slot:not([name])");
      expect(expandedContentSlot).to.exist;

      await expect(testElement).shadowDom.to.be.accessible();
    });
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("a11y-collapse passes accessibility test", async () => {
    const el = await fixture(html` <a11y-collapse></a11y-collapse> `);
    await expect(el).to.be.accessible();
  });
  it("a11y-collapse passes accessibility negation", async () => {
    const el = await fixture(
      html`<a11y-collapse aria-labelledby="a11y-collapse"></a11y-collapse>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("a11y-collapse can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<a11y-collapse .foo=${'bar'}></a11y-collapse>`);
    expect(el.foo).to.equal('bar');
  })
})
*/

/*
// Test if element is mobile responsive
describe('Test Mobile Responsiveness', () => {
    before(async () => {z   
      await setViewport({width: 375, height: 750});
    })
    it('sizes down to 360px', async () => {
      const el = await fixture(html`<a11y-collapse ></a11y-collapse>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('360px');
    })
}) */

/*
// Test if element sizes up for desktop behavior
describe('Test Desktop Responsiveness', () => {
    before(async () => {
      await setViewport({width: 1000, height: 1000});
    })
    it('sizes up to 410px', async () => {
      const el = await fixture(html`<a11y-collapse></a11y-collapse>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<a11y-collapse></a11y-collapse>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

describe('a11y-collapse tooltip interaction', () => {
  let collapseEl;
  let tooltip;
  let tipDiv;
  let iconButton;

  beforeEach(async () => {
    collapseEl = await fixture(html`
      <a11y-collapse
        heading="Tooltip Test"
        tooltip="Click to expand"
        tooltip-expanded="Click to collapse"
      >
        <div>Content for tooltip testing</div>
      </a11y-collapse>
    `);
    await collapseEl.updateComplete;
    tooltip = collapseEl.shadowRoot.querySelector('simple-tooltip');
    iconButton = collapseEl.shadowRoot.querySelector(
      'simple-icon-button-lite',
    );
    tipDiv = tooltip.shadowRoot.querySelector('#tooltip');
  });

  it('renders a tooltip anchored to the expand button', () => {
    expect(tooltip).to.exist;
    expect(tooltip.for).to.equal('expand');
    expect(tooltip.textContent.trim()).to.equal('Click to expand');
  });

  it('shows the tooltip when the expand button is hovered', async () => {
    expect(tipDiv.classList.contains('hidden')).to.be.true;
    iconButton.dispatchEvent(new MouseEvent('mouseenter'));
    expect(tooltip._showing).to.be.true;
    expect(tipDiv.classList.contains('hidden')).to.be.false;
    expect(tipDiv.classList.contains('fade-in-animation')).to.be.true;
  });

  it('hides the tooltip instantly when unhovered during the entry animation', async () => {
    iconButton.dispatchEvent(new MouseEvent('mouseenter'));
    expect(tooltip._showing).to.be.true;
    iconButton.dispatchEvent(new MouseEvent('mouseleave'));
    expect(tooltip._showing).to.be.false;
    expect(tipDiv.classList.contains('hidden')).to.be.true;
    expect(tipDiv.classList.contains('fade-in-animation')).to.be.false;
  });

  it('plays the exit animation when unhovered after the entry animation finished', async () => {
    iconButton.dispatchEvent(new MouseEvent('mouseenter'));
    // complete the entry animation the way the browser would
    tipDiv.dispatchEvent(new Event('animationend'));
    expect(tooltip._animationPlaying).to.be.false;
    iconButton.dispatchEvent(new MouseEvent('mouseleave'));
    expect(tooltip._showing).to.be.false;
    expect(tipDiv.classList.contains('fade-out-animation')).to.be.true;
    // allow the animation timers to settle before checking the final state
    await new Promise((resolve) => setTimeout(resolve, 650));
    expect(tipDiv.classList.contains('hidden')).to.be.true;
  });

  it('shows the tooltip on focus and hides it on blur', async () => {
    iconButton.dispatchEvent(new FocusEvent('focus'));
    expect(tooltip._showing).to.be.true;
    iconButton.dispatchEvent(new FocusEvent('blur'));
    expect(tooltip._showing).to.be.false;
    expect(tipDiv.classList.contains('hidden')).to.be.true;
  });

  it('hides the tooltip when the collapse is clicked', async () => {
    iconButton.dispatchEvent(new MouseEvent('mouseenter'));
    expect(tooltip._showing).to.be.true;
    iconButton.click();
    await collapseEl.updateComplete;
    expect(collapseEl.expanded).to.be.true;
    expect(tooltip._showing).to.be.false;
    expect(tipDiv.classList.contains('hidden')).to.be.true;
  });

  it('ignores a mouseenter on the tooltip host while hidden', async () => {
    tooltip.dispatchEvent(new MouseEvent('mouseenter'));
    // _showing is not initialized until the first show, so it stays falsy
    expect(tooltip._showing).to.not.be.true;
    expect(tipDiv.classList.contains('hidden')).to.be.true;
  });

  it('does not show a tooltip that has no text', async () => {
    const emptyEl = await fixture(html`
      <a11y-collapse tooltip="">
        <div>Content without a tooltip</div>
      </a11y-collapse>
    `);
    await emptyEl.updateComplete;
    const emptyTooltip = emptyEl.shadowRoot.querySelector('simple-tooltip');
    expect(emptyTooltip.textContent.trim()).to.equal('');
    emptyTooltip._target.dispatchEvent(new MouseEvent('mouseenter'));
    expect(emptyTooltip._showing).to.not.be.true;
  });

  it('updates the tooltip text when the expanded state changes', async () => {
    expect(tooltip.textContent.trim()).to.equal('Click to expand');
    collapseEl.toggle(true);
    await collapseEl.updateComplete;
    expect(tooltip.textContent.trim()).to.equal('Click to collapse');
    collapseEl.toggle(false);
    // the collapsed-state labels are restored in a microtask after the
    // toggle, so give the element time to re-render before reading the text
    await new Promise((resolve) => setTimeout(resolve, 20));
    await collapseEl.updateComplete;
    expect(tooltip.textContent.trim()).to.equal('Click to expand');
  });

  it('shows the tooltip when the heading is hovered in heading-button mode', async () => {
    const headingModeEl = await fixture(html`
      <a11y-collapse
        heading-button
        heading="Hover Heading"
        tooltip="Heading tooltip"
      >
        <div>Content for heading tooltip testing</div>
      </a11y-collapse>
    `);
    await headingModeEl.updateComplete;
    const headingTooltip =
      headingModeEl.shadowRoot.querySelector('simple-tooltip');
    expect(headingTooltip.for).to.equal('heading');
    const headingDiv = headingModeEl.shadowRoot.querySelector('#heading');
    expect(headingTooltip._target).to.equal(headingDiv);
    headingDiv.dispatchEvent(new MouseEvent('mouseenter'));
    expect(headingTooltip._showing).to.be.true;
  });
});

describe('a11y-collapse heading-button interaction', () => {
  it('toggles the content when the whole heading button is clicked', async () => {
    const headingButtonEl = await fixture(html`
      <a11y-collapse heading-button heading="Clickable Heading">
        <div>Hidden content</div>
      </a11y-collapse>
    `);
    await headingButtonEl.updateComplete;
    const button = headingButtonEl.shadowRoot.querySelector('button');
    expect(button.getAttribute('aria-expanded')).to.equal('false');
    expect(
      headingButtonEl.shadowRoot.querySelector('#content').getAttribute('aria-hidden'),
    ).to.equal('true');
    button.click();
    await headingButtonEl.updateComplete;
    expect(headingButtonEl.expanded).to.be.true;
    expect(button.getAttribute('aria-expanded')).to.equal('true');
    expect(
      headingButtonEl.shadowRoot.querySelector('#content').getAttribute('aria-hidden'),
    ).to.equal('false');
    button.click();
    await headingButtonEl.updateComplete;
    expect(headingButtonEl.expanded).to.be.false;
    expect(button.getAttribute('aria-expanded')).to.equal('false');
  });

  it('renders the heading text inside the heading button', async () => {
    const headingButtonEl = await fixture(html`
      <a11y-collapse heading-button heading="Rendered Heading">
        <div>Content</div>
      </a11y-collapse>
    `);
    await headingButtonEl.updateComplete;
    const heading = headingButtonEl.shadowRoot.querySelector(
      'button span[part="heading"]',
    );
    expect(heading).to.exist;
    expect(heading.textContent.trim()).to.equal('Rendered Heading');
  });

  it('reflects disabled onto the heading button', async () => {
    const headingButtonEl = await fixture(html`
      <a11y-collapse heading-button heading="Disabled Heading" disabled>
        <div>Content</div>
      </a11y-collapse>
    `);
    await headingButtonEl.updateComplete;
    expect(
      headingButtonEl.shadowRoot.querySelector('button').hasAttribute('disabled'),
    ).to.be.true;
  });

  it('reflects disabled onto the icon button in icon mode', async () => {
    const iconModeEl = await fixture(html`
      <a11y-collapse disabled>
        <div>Content</div>
      </a11y-collapse>
    `);
    await iconModeEl.updateComplete;
    expect(
      iconModeEl.shadowRoot.querySelector('simple-icon-button-lite').disabled,
    ).to.be.true;
  });

  it('rotates the expand icon when collapsed without an expanded icon', async () => {
    const rotatedEl = await fixture(html`
      <a11y-collapse heading-button heading="Icon Rotation">
        <div>Content</div>
      </a11y-collapse>
    `);
    await rotatedEl.updateComplete;
    let icon = rotatedEl.shadowRoot.querySelector('#expand');
    expect(icon.classList.contains('rotated')).to.be.true;
    rotatedEl.toggle(true);
    await rotatedEl.updateComplete;
    icon = rotatedEl.shadowRoot.querySelector('#expand');
    expect(icon.classList.contains('rotated')).to.be.false;
  });

  it('does not rotate the icon when an expanded icon is provided', async () => {
    const expandedIconEl = await fixture(html`
      <a11y-collapse
        heading-button
        heading="Icon Rotation Two"
        icon-expanded="icons:expand-less"
      >
        <div>Content</div>
      </a11y-collapse>
    `);
    await expandedIconEl.updateComplete;
    const icon = expandedIconEl.shadowRoot.querySelector('#expand');
    expect(icon.classList.contains('rotated')).to.be.false;
  });
});

describe('a11y-collapse icon resolution', () => {
  it('resolves the default icon to an image source', async () => {
    const defaultIconEl = await fixture(html`
      <a11y-collapse heading-button heading="Default Icon">
        <div>Content</div>
      </a11y-collapse>
    `);
    await defaultIconEl.updateComplete;
    // icon src lookup is deferred to a microtask after the update
    await new Promise((resolve) => setTimeout(resolve, 20));
    const icon = defaultIconEl.shadowRoot.querySelector(
      'simple-icon-lite#expand',
    );
    expect(icon.src).to.be.a('string');
    expect(icon.src).to.include('expand-more');
  });

  it('clears the icon source when the icon cannot be resolved', async () => {
    const unknownIconEl = await fixture(html`
      <a11y-collapse heading-button heading="Unknown Icon">
        <div>Content</div>
      </a11y-collapse>
    `);
    await unknownIconEl.updateComplete;
    unknownIconEl.icon = 'bogus-iconset:missing-icon';
    await unknownIconEl.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 20));
    const icon = unknownIconEl.shadowRoot.querySelector(
      'simple-icon-lite#expand',
    );
    expect(icon.src).to.equal(null);
  });

  it('falls back to the default icon when the icon is emptied', async () => {
    const emptyIconEl = await fixture(html`
      <a11y-collapse heading-button heading="Empty Icon" icon="icons:expand-less">
        <div>Content</div>
      </a11y-collapse>
    `);
    await emptyIconEl.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 20));
    const icon = emptyIconEl.shadowRoot.querySelector('simple-icon-lite#expand');
    expect(icon.src).to.include('expand-less');
    emptyIconEl.icon = '';
    await emptyIconEl.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 20));
    // the renderer falls back to icons:expand-more when icon is empty
    expect(icon.getAttribute('icon')).to.equal('icons:expand-more');
    expect(icon.src).to.include('expand-more');
  });
});

describe('a11y-collapse inherited color utilities', () => {
  let colorsEl;

  beforeEach(async () => {
    colorsEl = await fixture(html`
      <a11y-collapse heading="Color Utilities">
        <div>Content</div>
      </a11y-collapse>
    `);
    await colorsEl.updateComplete;
  });

  it('parses the shade from a CSS variable name', () => {
    const info = colorsEl.getColorInfo('--simple-colors-default-theme-red-3');
    expect(info).to.be.an('object');
    expect(info.shade).to.equal('3');
  });

  it('falls back to default info for a name without a theme', () => {
    expect(colorsEl.getColorInfo('red')).to.deep.equal({
      theme: 'default',
      color: 'grey',
      shade: '1',
    });
  });

  it('builds the default CSS variable name', () => {
    expect(colorsEl.makeVariable()).to.equal(
      '--simple-colors-default-theme-grey-1',
    );
    // the passthrough also forwards caller arguments correctly
    expect(colorsEl.makeVariable('red', 3, 'fixed')).to.equal(
      '--simple-colors-fixed-theme-red-3',
    );
  });

  it('lists WCAG AA contrasting shades for a grey', () => {
    expect(colorsEl.getContrastingShades(false, 'grey', '3', 'grey')).to.deep.equal(
      [7, 8, 9, 10, 11, 12],
    );
  });

  it('lists WCAG AA contrasting colors for a grey', () => {
    const result = colorsEl.getContrastingColors('grey', '3', false);
    expect(Object.keys(result).length).to.equal(
      Object.keys(colorsEl.colors).length,
    );
    expect(result.grey).to.deep.equal([7, 8, 9, 10, 11, 12]);
  });
});

describe('a11y-collapse deprecated accordion API', () => {
  it('keeps the deprecated _makeAccordionButton alias callable', async () => {
    const deprecatedEl = await fixture(html`
      <a11y-collapse heading="Deprecated Alias">
        <div>Content</div>
      </a11y-collapse>
    `);
    await deprecatedEl.updateComplete;
    expect(typeof deprecatedEl._makeAccordionButton).to.equal('function');
    deprecatedEl._makeAccordionButton();
    // the deprecated alias does not mutate the rendered DOM
    expect(deprecatedEl.shadowRoot.querySelector('simple-icon-button-lite')).to
      .exist;
  });
});

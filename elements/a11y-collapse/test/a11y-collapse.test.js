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
          testElement.icon = "icons:keyboard-arrow-down";
          await testElement.updateComplete;
          expect(testElement.icon).to.equal("icons:keyboard-arrow-down");
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
      
      const headingSlot = testElement.shadowRoot.querySelector('slot[name="heading"]');
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
      
      const contentSlot = testElement.shadowRoot.querySelector('slot[name="content"]');
      expect(contentSlot).to.exist;
      const contentNodes = contentSlot.assignedNodes({ flatten: true });
      expect(contentNodes.length).to.be.greaterThan(0);
      expect(contentNodes[0].textContent).to.include("Named content slot");
      
      const defaultSlot = testElement.shadowRoot.querySelector('slot:not([name])');
      expect(defaultSlot).to.exist;
      const defaultNodes = defaultSlot.assignedNodes({ flatten: true });
      expect(defaultNodes.length).to.be.greaterThan(0);
      expect(defaultNodes[0].textContent).to.include("Default slot content");
      
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle empty slots gracefully", async () => {
      const testElement = await fixture(html`
        <a11y-collapse>
          <div>Only default slot content</div>
        </a11y-collapse>
      `);
      await testElement.updateComplete;
      
      const slots = testElement.shadowRoot.querySelectorAll('slot');
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
      
      eventElement.addEventListener('toggle', (e) => {
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
      
      eventElement.addEventListener('expand', (e) => {
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
      
      eventElement.addEventListener('collapse', (e) => {
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
      
      eventElement.addEventListener('a11y-collapse-toggle', () => {
        deprecatedEventFired = true;
      });
      
      eventElement.toggle();
      await eventElement.updateComplete;
      
      expect(deprecatedEventFired).to.be.true;
      await expect(eventElement).shadowDom.to.be.accessible();
    });

    it("should fire click event when clicked", async () => {
      let clickEventFired = false;
      
      eventElement.addEventListener('a11y-collapse-click', () => {
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
      
      const container = globalThis.document.createElement('div');
      globalThis.document.body.appendChild(container);
      
      container.addEventListener('a11y-collapse-attached', (e) => {
        attachedEventFired = true;
        attachedEventDetail = e.detail;
      });
      
      const newElement = globalThis.document.createElement('a11y-collapse');
      container.appendChild(newElement);
      
      // Wait for the setTimeout in connectedCallback
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(attachedEventFired).to.be.true;
      expect(attachedEventDetail).to.equal(newElement);
      
      // Cleanup
      globalThis.document.body.removeChild(container);
    });

    it("should fire detached event on disconnectedCallback", async () => {
      let detachedEventFired = false;
      let detachedEventDetail = null;
      
      const container = globalThis.document.createElement('div');
      globalThis.document.body.appendChild(container);
      
      const newElement = globalThis.document.createElement('a11y-collapse');
      container.appendChild(newElement);
      
      container.addEventListener('a11y-collapse-detached', (e) => {
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
      const button = testElement.shadowRoot.querySelector('button');
      expect(button).to.exist;
      
      // Should not have simple-icon-button-lite in heading button mode
      const iconButton = testElement.shadowRoot.querySelector('simple-icon-button-lite');
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
      const button = testElement.shadowRoot.querySelector('button');
      expect(button).to.not.exist;
      
      // Should have simple-icon-button-lite in icon button mode
      const iconButton = testElement.shadowRoot.querySelector('simple-icon-button-lite');
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
      const button = testElement.shadowRoot.querySelector('button');
      expect(button).to.exist;
      
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Expanded state helpers", () => {
    it("should return correct values from _getExpanded helper", () => {
      const testElement = globalThis.document.createElement('a11y-collapse');
      
      // When not expanded, should return default
      expect(testElement._getExpanded('default', 'expanded', false)).to.equal('default');
      
      // When expanded and expanded prop exists, should return expanded
      expect(testElement._getExpanded('default', 'expanded', true)).to.equal('expanded');
      
      // When expanded but no expanded prop, should return default
      expect(testElement._getExpanded('default', null, true)).to.equal('default');
      expect(testElement._getExpanded('default', undefined, true)).to.equal('default');
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
      expect(typeof A11yCollapse.haxProperties).to.equal('string');
      expect(A11yCollapse.haxProperties).to.include('a11y-collapse.haxProperties.json');
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
        "Label with 'quotes' and \"double quotes\" and special chars: !@#$%^&*()"
      ];
      
      for (const value of unusualValues) {
        testElement.label = value;
        testElement.tooltip = value;
        testElement.heading = value;
        testElement.icon = value;
        await testElement.updateComplete;
        
        expect(testElement.label).to.equal(value);
        expect(testElement.tooltip).to.equal(value);
        expect(testElement.heading).to.equal(value);
        expect(testElement.icon).to.equal(value);
        
        // Most should maintain accessibility, but skip dangerous content
        if (!value.includes('<script>')) {
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
      
      // Content should not be in DOM when collapsed
      expect(testElement.expanded).to.be.false;
      const contentSlot = testElement.shadowRoot.querySelector('slot:not([name])');
      expect(contentSlot.parentElement.parentElement.textContent.trim()).to.equal('');
      
      // Content should be in DOM when expanded
      testElement.expanded = true;
      await testElement.updateComplete;
      
      const expandedContentSlot = testElement.shadowRoot.querySelector('slot:not([name])');
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

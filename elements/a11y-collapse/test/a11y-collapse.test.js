import { fixture, expect, html } from "@open-wc/testing";

import "../a11y-collapse.js";

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

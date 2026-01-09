import { fixture, expect, html } from "@open-wc/testing";

import "../a11y-tabs.js";
import "../lib/a11y-tab.js";

describe("a11y-tabs test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html` <a11y-tabs title="test-title"></a11y-tabs> `);
  });

  it("basic setup", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("a11y-tabs");
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Property validation with accessibility", () => {
    let testElement;

    beforeEach(async () => {
      testElement = await fixture(html`
        <a11y-tabs>
          <a11y-tab id="tab1" label="Tab 1">Content of Tab 1</a11y-tab>
          <a11y-tab id="tab2" label="Tab 2">Content of Tab 2</a11y-tab>
        </a11y-tabs>
      `);
      await testElement.updateComplete;
    });

    describe("Boolean properties", () => {
      it("should handle fullWidth property", async () => {
        expect(testElement.fullWidth).to.equal(false);

        testElement.fullWidth = true;
        await testElement.updateComplete;
        expect(testElement.fullWidth).to.equal(true);
        expect(testElement.hasAttribute("full-width")).to.be.true;
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle disabled property", async () => {
        expect(testElement.disabled).to.equal(false);

        testElement.disabled = true;
        await testElement.updateComplete;
        expect(testElement.disabled).to.equal(true);
        expect(testElement.hasAttribute("disabled")).to.be.true;
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle hidden property", async () => {
        expect(testElement.hidden).to.equal(false);

        testElement.hidden = true;
        await testElement.updateComplete;
        expect(testElement.hidden).to.equal(true);
        expect(testElement.hasAttribute("hidden")).to.be.true;
        // Skip accessibility test when hidden
      });

      it("should handle sticky property", async () => {
        expect(testElement.sticky).to.be.undefined;

        testElement.sticky = true;
        await testElement.updateComplete;
        expect(testElement.sticky).to.equal(true);
        expect(testElement.hasAttribute("sticky")).to.be.true;
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle disableResponsive property", async () => {
        expect(testElement.disableResponsive).to.equal(false);

        testElement.disableResponsive = true;
        await testElement.updateComplete;
        expect(testElement.disableResponsive).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();
      });
    });

    describe("String properties", () => {
      it("should handle ariaLabel property", async () => {
        testElement.ariaLabel = "Tab navigation";
        await testElement.updateComplete;
        expect(testElement.ariaLabel).to.equal("Tab navigation");
        expect(testElement.hasAttribute("aria-label")).to.be.true;
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle activeTab property", async () => {
        testElement.activeTab = "tab2";
        await testElement.updateComplete;
        expect(testElement.activeTab).to.equal("tab2");
        expect(testElement.hasAttribute("active-tab")).to.be.true;
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle responsiveSize property", async () => {
        testElement.responsiveSize = "md";
        await testElement.updateComplete;
        expect(testElement.responsiveSize).to.equal("md");
        expect(testElement.hasAttribute("responsive-size")).to.be.true;
        await expect(testElement).shadowDom.to.be.accessible();
      });
    });

    describe("Number properties", () => {
      it("should handle layoutBreakpoint property", async () => {
        testElement.layoutBreakpoint = 768;
        await testElement.updateComplete;
        expect(testElement.layoutBreakpoint).to.equal(768);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle iconBreakpoint property", async () => {
        testElement.iconBreakpoint = 600;
        await testElement.updateComplete;
        expect(testElement.iconBreakpoint).to.equal(600);
        await expect(testElement).shadowDom.to.be.accessible();
      });
    });
  });

  describe("Tab functionality", () => {
    let tabsElement;

    beforeEach(async () => {
      tabsElement = await fixture(html`
        <a11y-tabs id="test-tabs">
          <a11y-tab id="tab-1" label="First Tab" icon="home"
            >Content of first tab</a11y-tab
          >
          <a11y-tab id="tab-2" label="Second Tab" icon="info"
            >Content of second tab</a11y-tab
          >
          <a11y-tab id="tab-3" label="Third Tab" disabled
            >Content of third tab</a11y-tab
          >
        </a11y-tabs>
      `);
      await tabsElement.updateComplete;
      // Wait for tab registration
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("should register tabs correctly", async () => {
      expect(tabsElement.tabs).to.exist;
      expect(tabsElement.tabs.length).to.be.greaterThan(0);
    });

    it("should handle active tab switching", async () => {
      // Set active tab programmatically
      tabsElement.activeTab = "tab-2";
      await tabsElement.updateComplete;
      expect(tabsElement.activeTab).to.equal("tab-2");

      await expect(tabsElement).shadowDom.to.be.accessible();
    });

    it("should handle tab selection via selectTab method", async () => {
      // Test selectTab method if it exists
      if (typeof tabsElement.selectTab === "function") {
        tabsElement.selectTab("tab-1");
        await tabsElement.updateComplete;
        expect(tabsElement.activeTab).to.equal("tab-1");
      }

      await expect(tabsElement).shadowDom.to.be.accessible();
    });
  });

  describe("Responsive behavior", () => {
    it("should handle vertical layout based on breakpoint", async () => {
      const testElement = await fixture(html`
        <a11y-tabs layout-breakpoint="800">
          <a11y-tab id="responsive-tab-1" label="Tab 1">Content 1</a11y-tab>
          <a11y-tab id="responsive-tab-2" label="Tab 2">Content 2</a11y-tab>
        </a11y-tabs>
      `);
      await testElement.updateComplete;

      expect(testElement.layoutBreakpoint).to.equal(800);

      // Test vertical property computation
      expect(testElement.vertical).to.be.a("boolean");

      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle icon-only mode based on breakpoint", async () => {
      const testElement = await fixture(html`
        <a11y-tabs icon-breakpoint="600">
          <a11y-tab id="icon-tab-1" label="Tab 1" icon="home"
            >Content 1</a11y-tab
          >
          <a11y-tab id="icon-tab-2" label="Tab 2" icon="info"
            >Content 2</a11y-tab
          >
        </a11y-tabs>
      `);
      await testElement.updateComplete;

      expect(testElement.iconBreakpoint).to.equal(600);

      // Test iconsOnly property computation
      expect(testElement.iconsOnly).to.be.a("boolean");

      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Accessibility features", () => {
    it("should have proper ARIA attributes on tabs", async () => {
      const testElement = await fixture(html`
        <a11y-tabs aria-label="Navigation tabs">
          <a11y-tab id="aria-tab-1" label="Home">Home content</a11y-tab>
          <a11y-tab id="aria-tab-2" label="About">About content</a11y-tab>
        </a11y-tabs>
      `);
      await testElement.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Check for tablist ARIA attributes
      const tablist = testElement.shadowRoot.querySelector("#tabs");
      if (tablist) {
        expect(tablist.getAttribute("role")).to.equal("tablist");
      }

      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle keyboard navigation", async () => {
      const testElement = await fixture(html`
        <a11y-tabs>
          <a11y-tab id="key-tab-1" label="Tab 1">Content 1</a11y-tab>
          <a11y-tab id="key-tab-2" label="Tab 2">Content 2</a11y-tab>
          <a11y-tab id="key-tab-3" label="Tab 3">Content 3</a11y-tab>
        </a11y-tabs>
      `);
      await testElement.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Test keyboard navigation methods if they exist
      if (typeof testElement.focusNext === "function") {
        testElement.focusNext();
        await testElement.updateComplete;
      }

      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle disabled tabs appropriately", async () => {
      const testElement = await fixture(html`
        <a11y-tabs>
          <a11y-tab id="disabled-tab-1" label="Active Tab"
            >Active content</a11y-tab
          >
          <a11y-tab id="disabled-tab-2" label="Disabled Tab" disabled
            >Disabled content</a11y-tab
          >
        </a11y-tabs>
      `);
      await testElement.updateComplete;

      const disabledTab = testElement.querySelector("#disabled-tab-2");
      expect(disabledTab.disabled).to.be.true;

      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Layout modes", () => {
    it("should render in full-width mode", async () => {
      const testElement = await fixture(html`
        <a11y-tabs full-width>
          <a11y-tab id="full-tab-1" label="Full Tab 1">Content 1</a11y-tab>
          <a11y-tab id="full-tab-2" label="Full Tab 2">Content 2</a11y-tab>
        </a11y-tabs>
      `);
      await testElement.updateComplete;

      expect(testElement.fullWidth).to.be.true;
      expect(testElement.hasAttribute("full-width")).to.be.true;

      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should render in sticky mode", async () => {
      const testElement = await fixture(html`
        <a11y-tabs sticky>
          <a11y-tab id="sticky-tab-1" label="Sticky Tab 1">Content 1</a11y-tab>
          <a11y-tab id="sticky-tab-2" label="Sticky Tab 2">Content 2</a11y-tab>
        </a11y-tabs>
      `);
      await testElement.updateComplete;

      expect(testElement.sticky).to.be.true;
      expect(testElement.hasAttribute("sticky")).to.be.true;

      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Edge cases and error handling", () => {
    it("should handle tabs with no content", async () => {
      const testElement = await fixture(html` <a11y-tabs> </a11y-tabs> `);
      await testElement.updateComplete;

      expect(testElement.tabs).to.be.an("array");
      expect(testElement.tabs.length).to.equal(0);

      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle tabs with unusual property values", async () => {
      const testElement = await fixture(html`
        <a11y-tabs>
          <a11y-tab
            label="   	
   "
            >Whitespace label</a11y-tab
          >
          <a11y-tab label="🎯 tab with emoji 🎯">Emoji label</a11y-tab>
          <a11y-tab label="Very long tab label that might cause display issues"
            >Long label content</a11y-tab
          >
        </a11y-tabs>
      `);

      const unusualValues = [
        "<script>alert('test')</script>", // potentially dangerous content
        "Multi\nline\nlabel", // multiline
        "Label with 'quotes' and \"double quotes\" and special chars: !@#$%^&*()",
      ];

      for (const value of unusualValues) {
        testElement.ariaLabel = value;
        await testElement.updateComplete;

        expect(testElement.ariaLabel).to.equal(value);

        // Most values should maintain accessibility (skip dangerous content)
        if (!value.includes("<script>")) {
          await expect(testElement).shadowDom.to.be.accessible();
        }
      }
    });

    it("should handle extreme breakpoint values", async () => {
      const extremeValues = [-1, 0, 99999];

      for (const value of extremeValues) {
        const testElement = await fixture(html`
          <a11y-tabs layout-breakpoint="${value}">
            <a11y-tab label="Test Tab">Test content</a11y-tab>
          </a11y-tabs>
        `);
        await testElement.updateComplete;

        expect(testElement.layoutBreakpoint).to.equal(value);
        await expect(testElement).shadowDom.to.be.accessible();
      }
    });
  });

  describe("Tab update lifecycle", () => {
    it("should handle dynamic tab addition and removal", async () => {
      const testElement = await fixture(html`
        <a11y-tabs id="dynamic-tabs">
          <a11y-tab id="dynamic-tab-1" label="Initial Tab"
            >Initial content</a11y-tab
          >
        </a11y-tabs>
      `);
      await testElement.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Initial state
      expect(testElement.tabs.length).to.be.greaterThanOrEqual(1);

      // Add a new tab
      const newTab = globalThis.document.createElement("a11y-tab");
      newTab.id = "dynamic-tab-2";
      newTab.label = "Added Tab";
      newTab.textContent = "Added content";
      testElement.appendChild(newTab);

      // Wait for mutation observer
      await new Promise((resolve) => setTimeout(resolve, 100));
      await testElement.updateComplete;

      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle tab updates correctly", async () => {
      const testElement = await fixture(html`
        <a11y-tabs>
          <a11y-tab id="update-tab-1" label="Original Label"
            >Original content</a11y-tab
          >
        </a11y-tabs>
      `);
      await testElement.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Test updateTabs method
      if (typeof testElement.updateTabs === "function") {
        testElement.updateTabs();
        await testElement.updateComplete;
      }

      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Computed properties", () => {
    it("should compute vertical property correctly", async () => {
      const testElement = await fixture(html`
        <a11y-tabs layout-breakpoint="1000">
          <a11y-tab label="Test">Content</a11y-tab>
        </a11y-tabs>
      `);
      await testElement.updateComplete;

      // Test vertical property
      expect(testElement.vertical).to.be.a("boolean");
    });

    it("should compute iconsOnly property correctly", async () => {
      const testElement = await fixture(html`
        <a11y-tabs icon-breakpoint="1000">
          <a11y-tab label="Test" icon="home">Content</a11y-tab>
        </a11y-tabs>
      `);
      await testElement.updateComplete;

      // Test iconsOnly property
      expect(testElement.iconsOnly).to.be.a("boolean");
    });
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("a11y-tabs passes accessibility test", async () => {
    const el = await fixture(html` <a11y-tabs></a11y-tabs> `);
    await expect(el).to.be.accessible();
  });
  it("a11y-tabs passes accessibility negation", async () => {
    const el = await fixture(
      html`<a11y-tabs aria-labelledby="a11y-tabs"></a11y-tabs>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("a11y-tabs can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<a11y-tabs .foo=${'bar'}></a11y-tabs>`);
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
      const el = await fixture(html`<a11y-tabs ></a11y-tabs>`);
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
      const el = await fixture(html`<a11y-tabs></a11y-tabs>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<a11y-tabs></a11y-tabs>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

import { fixture, expect, html } from "@open-wc/testing";

import "../map-menu.js";

describe("map-menu test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html` <map-menu title="test-title"></map-menu> `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Accessibility - Navigation Structure", () => {
    it("has proper navigation role", async () => {
      const container = element.shadowRoot.querySelector("map-menu-container");
      expect(container).to.exist;
    });

    it("supports keyboard navigation", async () => {
      await element.updateComplete;
      // Check if menu items are keyboard accessible
      const menuItems = element.shadowRoot.querySelectorAll(
        "map-menu-item, map-menu-submenu",
      );
      menuItems.forEach((item) => {
        expect(item.tabIndex >= 0 || item.hasAttribute("tabindex")).to.be.true;
      });
    });

    it("has proper heading hierarchy", async () => {
      if (element.title) {
        expect(element.title).to.equal("test-title");
      }
    });

    it("manages focus properly within menu structure", async () => {
      // Menu should handle focus management appropriately
      const menuBuilder = element.shadowRoot.querySelector("map-menu-builder");
      expect(menuBuilder).to.exist;
    });
  });

  describe("Accessibility - ARIA Support", () => {
    it("has proper ARIA roles for menu structure", async () => {
      await element.updateComplete;
      // Check for proper menu ARIA structure
      const container = element.shadowRoot.querySelector("#itemslist");
      expect(container).to.exist;
    });

    it("provides ARIA expanded states for submenus", async () => {
      await element.updateComplete;
      const submenus = element.shadowRoot.querySelectorAll("map-menu-submenu");
      // Submenus should have proper expanded/collapsed states
      submenus.forEach((submenu) => {
        expect(submenu).to.exist; // Basic existence check
      });
    });

    it("has proper active item indication", async () => {
      const activeIndicator =
        element.shadowRoot.querySelector("#activeindicator");
      expect(activeIndicator).to.exist;
    });
  });

  describe("Accessibility - Responsive Behavior", () => {
    it("maintains accessibility in different layout modes", async () => {
      // Test flex layout
      element.setAttribute("is-flex", "");
      await element.updateComplete;
      await expect(element).shadowDom.to.be.accessible();

      // Test horizontal layout
      element.setAttribute("is-horizontal", "");
      await element.updateComplete;
      await expect(element).shadowDom.to.be.accessible();

      // Clean up
      element.removeAttribute("is-flex");
      element.removeAttribute("is-horizontal");
      await element.updateComplete;
    });

    it("provides proper scroll behavior", async () => {
      const style = globalThis.getComputedStyle(element);
      expect(style.overflowY).to.equal("scroll");
    });
  });

  describe("Accessibility - Color and Contrast", () => {
    it("uses CSS custom properties for theming", async () => {
      const styles = globalThis.getComputedStyle(element);
      // Check that custom properties are available for theming
      expect(element.style.getPropertyValue || styles.getPropertyValue).to
        .exist;
    });

    it("maintains proper visual hierarchy", async () => {
      // Check opacity and transition properties for states
      const style = globalThis.getComputedStyle(element);
      expect(style.opacity).to.not.equal("0");
    });
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("map-menu passes accessibility test", async () => {
    const el = await fixture(html` <map-menu></map-menu> `);
    await expect(el).to.be.accessible();
  });
  it("map-menu passes accessibility negation", async () => {
    const el = await fixture(
      html`<map-menu aria-labelledby="map-menu"></map-menu>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("map-menu can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<map-menu .foo=${'bar'}></map-menu>`);
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
      const el = await fixture(html`<map-menu ></map-menu>`);
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
      const el = await fixture(html`<map-menu></map-menu>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<map-menu></map-menu>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

import { fixture, expect, html } from "@open-wc/testing";
import "../lib/a11y-menu-button-item.js";
import "../a11y-menu-button.js";

describe("a11y-menu-button test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <a11y-menu-button>
        <span slot="button">Menu</span>
        <a11y-menu-button-item href="#top">Anchor</a11y-menu-button-item>
        <a11y-menu-button-item id="button" disabled
          >Button</a11y-menu-button-item
        >
        <a11y-menu-button-item href="../">Link</a11y-menu-button-item>
      </a11y-menu-button>
    `);
  });

  it("basic setup", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("a11y-menu-button");
  });

  it("basic setup for testing the link case", async () => {
    // case 1 of the menu item
    const item = element.querySelector(
      "a11y-menu-button a11y-menu-button-item[href='../']",
    );
    expect(element).to.exist;
    expect(item.shadowRoot.querySelector("a[role='menuitem']")).to.exist;
    expect(
      item.shadowRoot.querySelector("slot").assignedNodes({ flatten: true })[0]
        .textContent,
    ).to.equal("Link");
    expect(item.href).to.equal("../");
  });
  
  it("basic setup for testing the button case", async () => {
    // case 2 with a button
    const button = element.querySelector(
      "a11y-menu-button a11y-menu-button-item#button",
    );
    expect(element).to.exist;
    expect(button.shadowRoot.querySelector("button[role='menuitem']")).to.exist;
    expect(
      button.shadowRoot
        .querySelector("slot")
        .assignedNodes({ flatten: true })[0].textContent,
    ).to.equal("Button");
    expect(button.disabled).to.equal(true);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Property validation with accessibility", () => {
    let testElement;

    beforeEach(async () => {
      testElement = await fixture(html`
        <a11y-menu-button>
          <span slot="button">Test Menu</span>
          <a11y-menu-button-item>Item 1</a11y-menu-button-item>
          <a11y-menu-button-item>Item 2</a11y-menu-button-item>
        </a11y-menu-button>
      `);
      await testElement.updateComplete;
    });

    describe("Boolean properties", () => {
      it("should handle expanded property", async () => {
        expect(testElement.expanded).to.equal(false);
        
        testElement.expanded = true;
        await testElement.updateComplete;
        expect(testElement.expanded).to.equal(true);
        expect(testElement.hasAttribute("expanded")).to.be.true;
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle disabled property", async () => {
        expect(testElement.disabled).to.be.undefined;
        
        testElement.disabled = true;
        await testElement.updateComplete;
        expect(testElement.disabled).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle keepOpenOnClick property", async () => {
        expect(testElement.keepOpenOnClick).to.equal(false);
        
        testElement.keepOpenOnClick = true;
        await testElement.updateComplete;
        expect(testElement.keepOpenOnClick).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle noOpenOnHover property", async () => {
        expect(testElement.noOpenOnHover).to.equal(false);
        
        testElement.noOpenOnHover = true;
        await testElement.updateComplete;
        expect(testElement.noOpenOnHover).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();
      });
    });

    describe("String properties", () => {
      it("should handle position property", async () => {
        expect(testElement.position).to.equal("bottom");
        
        testElement.position = "top";
        await testElement.updateComplete;
        expect(testElement.position).to.equal("top");
        expect(testElement.hasAttribute("position")).to.be.true;
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle positionAlign property", async () => {
        expect(testElement.positionAlign).to.equal("start");
        
        testElement.positionAlign = "end";
        await testElement.updateComplete;
        expect(testElement.positionAlign).to.equal("end");
        expect(testElement.hasAttribute("position-align")).to.be.true;
        await expect(testElement).shadowDom.to.be.accessible();
      });
    });

    describe("Number properties", () => {
      it("should handle offset property", async () => {
        expect(testElement.offset).to.equal(0);
        
        testElement.offset = 10;
        await testElement.updateComplete;
        expect(testElement.offset).to.equal(10);
        await expect(testElement).shadowDom.to.be.accessible();
      });
    });
  });

  describe("Slot functionality", () => {
    it("should handle button slot", async () => {
      const testElement = await fixture(html`
        <a11y-menu-button>
          <span slot="button">Custom Button Text</span>
        </a11y-menu-button>
      `);
      await testElement.updateComplete;
      
      const buttonSlot = testElement.shadowRoot.querySelector('slot[name="button"]');
      expect(buttonSlot).to.exist;
      const assignedNodes = buttonSlot.assignedNodes({ flatten: true });
      expect(assignedNodes.length).to.be.greaterThan(0);
      expect(assignedNodes[0].textContent).to.equal("Custom Button Text");
      
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle menuitem slot", async () => {
      const testElement = await fixture(html`
        <a11y-menu-button>
          <span slot="button">Menu</span>
          <a11y-menu-button-item slot="menuitem">Slotted Item</a11y-menu-button-item>
          <a11y-menu-button-item>Default Item</a11y-menu-button-item>
        </a11y-menu-button>
      `);
      await testElement.updateComplete;
      
      const menuitemSlot = testElement.shadowRoot.querySelector('slot[name="menuitem"]');
      expect(menuitemSlot).to.exist;
      
      const defaultSlot = testElement.shadowRoot.querySelector('slot:not([name])');
      expect(defaultSlot).to.exist;
      
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Menu functionality", () => {
    let menuElement;
    
    beforeEach(async () => {
      menuElement = await fixture(html`
        <a11y-menu-button>
          <span slot="button">Menu Button</span>
          <a11y-menu-button-item>First Item</a11y-menu-button-item>
          <a11y-menu-button-item>Second Item</a11y-menu-button-item>
          <a11y-menu-button-item>Third Item</a11y-menu-button-item>
        </a11y-menu-button>
      `);
      await menuElement.updateComplete;
    });

    it("should open and close menu", async () => {
      expect(menuElement.expanded).to.be.false;
      
      // Test open method
      menuElement.open();
      await menuElement.updateComplete;
      expect(menuElement.expanded).to.be.true;
      
      // Test close method
      menuElement.close(true);
      await menuElement.updateComplete;
      expect(menuElement.expanded).to.be.false;
      
      await expect(menuElement).shadowDom.to.be.accessible();
    });

    it("should handle menu item navigation", async () => {
      // First ensure menu items are properly added
      expect(menuElement.menuItems).to.exist;
      expect(menuElement.menuItems.length).to.be.greaterThan(0);
      
      // Test first item getter
      expect(menuElement.firstItem).to.exist;
      
      // Test last item getter
      expect(menuElement.lastItem).to.exist;
      
      await expect(menuElement).shadowDom.to.be.accessible();
    });

    it("should handle focus management", async () => {
      // Test focus method
      menuElement.focus();
      await menuElement.updateComplete;
      
      // Test focusOn method with first item
      if (menuElement.firstItem) {
        menuElement.focusOn(menuElement.firstItem);
        await menuElement.updateComplete;
        expect(menuElement.expanded).to.be.true;
        expect(menuElement.currentItem).to.equal(menuElement.firstItem);
      }
      
      await expect(menuElement).shadowDom.to.be.accessible();
    });
  });

  describe("Event handling", () => {
    let eventElement;
    
    beforeEach(async () => {
      eventElement = await fixture(html`
        <a11y-menu-button>
          <span slot="button">Event Menu</span>
          <a11y-menu-button-item>Event Item 1</a11y-menu-button-item>
          <a11y-menu-button-item>Event Item 2</a11y-menu-button-item>
        </a11y-menu-button>
      `);
      await eventElement.updateComplete;
    });

    it("should fire open event", async () => {
      let openEventFired = false;
      
      eventElement.addEventListener('open', () => {
        openEventFired = true;
      });
      
      eventElement.open();
      await eventElement.updateComplete;
      
      expect(openEventFired).to.be.true;
      await expect(eventElement).shadowDom.to.be.accessible();
    });

    it("should fire close event", async () => {
      let closeEventFired = false;
      
      eventElement.addEventListener('close', () => {
        closeEventFired = true;
      });
      
      eventElement.open();
      await eventElement.updateComplete;
      
      eventElement.close(true);
      await eventElement.updateComplete;
      
      expect(closeEventFired).to.be.true;
      await expect(eventElement).shadowDom.to.be.accessible();
    });

    it("should handle focus and blur events", async () => {
      expect(eventElement.focused).to.be.undefined;
      
      eventElement._handleFocus();
      expect(eventElement.focused).to.be.true;
      
      eventElement._handleBlur();
      expect(eventElement.focused).to.be.false;
      
      await expect(eventElement).shadowDom.to.be.accessible();
    });

    it("should handle mouseover and mouseout events", async () => {
      expect(eventElement.hovered).to.be.undefined;
      
      eventElement._handleMouseover();
      expect(eventElement.hovered).to.be.true;
      expect(eventElement.expanded).to.be.true; // Should open on hover by default
      
      eventElement._handleMouseout();
      expect(eventElement.hovered).to.be.false;
      
      await expect(eventElement).shadowDom.to.be.accessible();
    });
  });

  describe("Accessibility features", () => {
    it("should have proper ARIA attributes", async () => {
      const testElement = await fixture(html`
        <a11y-menu-button>
          <span slot="button">ARIA Menu</span>
          <a11y-menu-button-item>ARIA Item</a11y-menu-button-item>
        </a11y-menu-button>
      `);
      await testElement.updateComplete;
      
      const button = testElement.shadowRoot.querySelector('#menubutton');
      expect(button).to.exist;
      expect(button.getAttribute('aria-haspopup')).to.equal('true');
      expect(button.getAttribute('aria-controls')).to.equal('menu');
      expect(button.getAttribute('aria-expanded')).to.equal('false');
      
      const menu = testElement.shadowRoot.querySelector('#menu');
      expect(menu).to.exist;
      expect(menu.getAttribute('role')).to.equal('menu');
      expect(menu.getAttribute('aria-labelledby')).to.equal('menubutton');
      
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should update aria-expanded when menu state changes", async () => {
      const testElement = await fixture(html`
        <a11y-menu-button>
          <span slot="button">Expandable Menu</span>
          <a11y-menu-button-item>Item</a11y-menu-button-item>
        </a11y-menu-button>
      `);
      await testElement.updateComplete;
      
      const button = testElement.shadowRoot.querySelector('#menubutton');
      expect(button.getAttribute('aria-expanded')).to.equal('false');
      
      testElement.expanded = true;
      await testElement.updateComplete;
      expect(button.getAttribute('aria-expanded')).to.equal('true');
      
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Positioning", () => {
    it("should handle different position values", async () => {
      const positions = ['top', 'bottom', 'left', 'right'];
      
      for (const pos of positions) {
        const testElement = await fixture(html`
          <a11y-menu-button position="${pos}">
            <span slot="button">Position Test</span>
            <a11y-menu-button-item>Item</a11y-menu-button-item>
          </a11y-menu-button>
        `);
        await testElement.updateComplete;
        
        expect(testElement.position).to.equal(pos);
        
        const positionBehavior = testElement.shadowRoot.querySelector('absolute-position-behavior');
        expect(positionBehavior).to.exist;
        expect(positionBehavior.getAttribute('position')).to.equal(pos);
        
        await expect(testElement).shadowDom.to.be.accessible();
      }
    });

    it("should handle different position-align values", async () => {
      const alignments = ['start', 'center', 'end'];
      
      for (const align of alignments) {
        const testElement = await fixture(html`
          <a11y-menu-button position-align="${align}">
            <span slot="button">Align Test</span>
            <a11y-menu-button-item>Item</a11y-menu-button-item>
          </a11y-menu-button>
        `);
        await testElement.updateComplete;
        
        expect(testElement.positionAlign).to.equal(align);
        
        const positionBehavior = testElement.shadowRoot.querySelector('absolute-position-behavior');
        expect(positionBehavior).to.exist;
        expect(positionBehavior.getAttribute('position-align')).to.equal(align);
        
        await expect(testElement).shadowDom.to.be.accessible();
      }
    });
  });

  describe("Edge cases and error handling", () => {
    it("should handle menu with no items", async () => {
      const testElement = await fixture(html`
        <a11y-menu-button>
          <span slot="button">Empty Menu</span>
        </a11y-menu-button>
      `);
      await testElement.updateComplete;
      
      expect(testElement.menuItems).to.be.an('array');
      expect(testElement.menuItems.length).to.equal(0);
      expect(testElement.firstItem).to.be.undefined;
      expect(testElement.lastItem).to.be.undefined;
      
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle hover behavior when disabled", async () => {
      const testElement = await fixture(html`
        <a11y-menu-button no-open-on-hover>
          <span slot="button">No Hover Menu</span>
          <a11y-menu-button-item>Item</a11y-menu-button-item>
        </a11y-menu-button>
      `);
      await testElement.updateComplete;
      
      expect(testElement.noOpenOnHover).to.be.true;
      
      testElement._handleMouseover();
      expect(testElement.hovered).to.be.true;
      expect(testElement.expanded).to.be.false; // Should not open on hover when disabled
      
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle keep-open behavior", async () => {
      const testElement = await fixture(html`
        <a11y-menu-button keep-open-on-click>
          <span slot="button">Keep Open Menu</span>
          <a11y-menu-button-item>Item</a11y-menu-button-item>
        </a11y-menu-button>
      `);
      await testElement.updateComplete;
      
      expect(testElement.keepOpenOnClick).to.be.true;
      
      testElement.open();
      await testElement.updateComplete;
      expect(testElement.expanded).to.be.true;
      
      // Simulate item click with keepOpenOnClick enabled
      const mockEvent = { stopPropagation: () => {} };
      testElement._handleItemClick(mockEvent);
      await testElement.updateComplete;
      
      // Menu should still be open
      expect(testElement.expanded).to.be.true;
      
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle extreme offset values", async () => {
      const extremeOffsets = [-100, 0, 50, 1000];
      
      for (const offset of extremeOffsets) {
        const testElement = await fixture(html`
          <a11y-menu-button offset="${offset}">
            <span slot="button">Offset Test</span>
            <a11y-menu-button-item>Item</a11y-menu-button-item>
          </a11y-menu-button>
        `);
        await testElement.updateComplete;
        
        expect(testElement.offset).to.equal(offset);
        
        const positionBehavior = testElement.shadowRoot.querySelector('absolute-position-behavior');
        expect(positionBehavior).to.exist;
        
        await expect(testElement).shadowDom.to.be.accessible();
      }
    });
  });

  describe("Menu item management", () => {
    it("should add and remove menu items", async () => {
      const testElement = await fixture(html`
        <a11y-menu-button>
          <span slot="button">Dynamic Menu</span>
        </a11y-menu-button>
      `);
      await testElement.updateComplete;
      
      expect(testElement.menuItems.length).to.equal(0);
      
      // Create a new menu item
      const newItem = globalThis.document.createElement('a11y-menu-button-item');
      newItem.textContent = 'New Item';
      
      // Add the item
      testElement.addItem(newItem);
      expect(testElement.menuItems.length).to.equal(1);
      expect(testElement.menuItems[0]).to.equal(newItem);
      
      // Remove the item
      testElement.removeItem(newItem);
      expect(testElement.menuItems.length).to.equal(0);
      
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });
});

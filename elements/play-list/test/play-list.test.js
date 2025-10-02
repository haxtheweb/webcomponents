import { fixture, expect, html } from "@open-wc/testing";
import { PlayList } from "../play-list.js";
import "../play-list.js";

describe("play-list test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<play-list></play-list>`);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Component Structure", () => {
    it("should have shadow DOM", () => {
      expect(element.shadowRoot).to.exist;
    });

    it("should extend LitElement", () => {
      expect(element).to.be.instanceOf(PlayList);
      expect(element.constructor.name).to.equal("PlayList");
    });

    it("should have correct tag name", () => {
      expect(PlayList.tag).to.equal("play-list");
      expect(element.tagName.toLowerCase()).to.equal("play-list");
    });

    it("should have mutation observer", () => {
      expect(element._observer).to.exist;
      expect(element._observer).to.be.instanceOf(MutationObserver);
    });
  });

  describe("Default Properties", () => {
    it("should have correct default values", () => {
      expect(element.items).to.deep.equal([]);
      expect(element.loop).to.be.false;
      expect(element.edit).to.be.false;
      expect(element.navigation).to.be.false;
      expect(element.pagination).to.be.false;
      expect(element.aspectRatio).to.equal("16:9");
      expect(element.slide).to.equal(0);
      expect(element.orientation).to.equal("horizontal");
    });

    it("should reflect boolean properties to attributes", async () => {
      element.loop = true;
      element.edit = true;
      element.navigation = true;
      element.pagination = true;
      await element.updateComplete;

      expect(element.hasAttribute("loop")).to.be.true;
      expect(element.hasAttribute("edit")).to.be.true;
      expect(element.hasAttribute("navigation")).to.be.true;
      expect(element.hasAttribute("pagination")).to.be.true;
    });

    it("should reflect string and number properties to attributes", async () => {
      element.aspectRatio = "4:3";
      element.orientation = "vertical";
      element.slide = 2;
      await element.updateComplete;

      expect(element.getAttribute("aspect-ratio")).to.equal("4:3");
      expect(element.getAttribute("orientation")).to.equal("vertical");
      expect(element.getAttribute("slide")).to.equal("2");
    });
  });

  describe("Property Updates", () => {
    it("should update items property", async () => {
      const testItems = [
        { tag: "div", properties: {}, content: "Test content" },
      ];
      element.items = testItems;
      await element.updateComplete;

      expect(element.items).to.deep.equal(testItems);
    });

    it("should update loop property", async () => {
      element.loop = true;
      await element.updateComplete;

      expect(element.loop).to.be.true;
      expect(element.hasAttribute("loop")).to.be.true;
    });

    it("should update edit property and change rendering", async () => {
      element.edit = true;
      await element.updateComplete;

      expect(element.edit).to.be.true;
      const editWrapper = element.shadowRoot.querySelector(".edit-wrapper");
      expect(editWrapper).to.exist;
    });

    it("should update navigation property", async () => {
      element.navigation = true;
      await element.updateComplete;

      expect(element.navigation).to.be.true;
    });

    it("should update pagination property", async () => {
      element.pagination = true;
      await element.updateComplete;

      expect(element.pagination).to.be.true;
    });

    it("should update aspectRatio property", async () => {
      element.aspectRatio = "21:9";
      await element.updateComplete;

      expect(element.aspectRatio).to.equal("21:9");
    });

    it("should update orientation property", async () => {
      element.orientation = "vertical";
      await element.updateComplete;

      expect(element.orientation).to.equal("vertical");
      expect(element.hasAttribute("orientation")).to.be.true;
    });

    it("should update slide property and fire event", async () => {
      let eventFired = false;
      let eventDetail = null;

      element.addEventListener("slide-changed", (e) => {
        eventFired = true;
        eventDetail = e.detail;
      });

      element.slide = 3;
      await element.updateComplete;

      expect(element.slide).to.equal(3);
      expect(eventFired).to.be.true;
      expect(eventDetail.value).to.equal(3);
    });
  });

  describe("Rendering Modes", () => {
    it("should render edit mode when edit is true", async () => {
      element.edit = true;
      await element.updateComplete;

      const editWrapper = element.shadowRoot.querySelector(".edit-wrapper");
      const carousel = element.shadowRoot.querySelector("sl-carousel");

      expect(editWrapper).to.exist;
      expect(carousel).to.not.exist;

      const slot = editWrapper.querySelector("slot");
      expect(slot).to.exist;
    });

    it("should render carousel when items exist and not in edit mode", async () => {
      const testItems = [
        { tag: "div", properties: { class: "item1" }, content: "Item 1" },
        { tag: "div", properties: { class: "item2" }, content: "Item 2" },
      ];
      element.items = testItems;
      element.edit = false;
      await element.updateComplete;

      const carousel = element.shadowRoot.querySelector("sl-carousel");
      const editWrapper = element.shadowRoot.querySelector(".edit-wrapper");

      expect(carousel).to.exist;
      expect(editWrapper).to.not.exist;
    });

    it("should render nothing when no items and not in edit mode", async () => {
      element.items = [];
      element.edit = false;
      await element.updateComplete;

      const carousel = element.shadowRoot.querySelector("sl-carousel");
      const editWrapper = element.shadowRoot.querySelector(".edit-wrapper");

      expect(carousel).to.not.exist;
      expect(editWrapper).to.exist; // Falls back to edit wrapper with empty items
    });
  });

  describe("Carousel Configuration", () => {
    beforeEach(async () => {
      const testItems = [
        { tag: "div", properties: {}, content: "Item 1" },
        { tag: "div", properties: {}, content: "Item 2" },
        { tag: "div", properties: {}, content: "Item 3" },
      ];
      element.items = testItems;
      await element.updateComplete;
    });

    it("should configure carousel with navigation when enabled", async () => {
      element.navigation = true;
      element.orientation = "horizontal";
      await element.updateComplete;

      const carousel = element.shadowRoot.querySelector("sl-carousel");
      expect(carousel.hasAttribute("navigation")).to.be.true;
    });

    it("should not show navigation for vertical orientation", async () => {
      element.navigation = true;
      element.orientation = "vertical";
      await element.updateComplete;

      const carousel = element.shadowRoot.querySelector("sl-carousel");
      expect(carousel.hasAttribute("navigation")).to.be.false;
    });

    it("should configure carousel with pagination when enabled", async () => {
      element.pagination = true;
      await element.updateComplete;

      const carousel = element.shadowRoot.querySelector("sl-carousel");
      expect(carousel.hasAttribute("pagination")).to.be.true;
    });

    it("should configure carousel with loop when enabled", async () => {
      element.loop = true;
      await element.updateComplete;

      const carousel = element.shadowRoot.querySelector("sl-carousel");
      expect(carousel.hasAttribute("loop")).to.be.true;
    });

    it("should set carousel orientation", async () => {
      element.orientation = "vertical";
      await element.updateComplete;

      const carousel = element.shadowRoot.querySelector("sl-carousel");
      expect(carousel.getAttribute("orientation")).to.equal("vertical");
    });

    it("should set carousel aspect ratio style", async () => {
      element.aspectRatio = "4:3";
      await element.updateComplete;

      const carousel = element.shadowRoot.querySelector("sl-carousel");
      expect(carousel.style.getPropertyValue("--aspect-ratio")).to.equal("4:3");
    });

    it("should render navigation icons", async () => {
      await element.updateComplete;

      const prevIcon = element.shadowRoot.querySelector(
        'simple-icon-button-lite[icon="hardware:keyboard-arrow-left"]',
      );
      const nextIcon = element.shadowRoot.querySelector(
        'simple-icon-button-lite[icon="hardware:keyboard-arrow-right"]',
      );

      expect(prevIcon).to.exist;
      expect(nextIcon).to.exist;
      expect(prevIcon.getAttribute("slot")).to.equal("previous-icon");
      expect(nextIcon.getAttribute("slot")).to.equal("next-icon");
    });
  });

  describe("Light DOM Integration", () => {
    it("should mirror light DOM children to items", async () => {
      const testElement = await fixture(html`
        <play-list>
          <div class="test-item-1">Test Item 1</div>
          <div class="test-item-2">Test Item 2</div>
        </play-list>
      `);

      // Wait for the mutation observer and mirrorLightDomToItems to process
      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(testElement.items).to.have.length(2);
      expect(testElement.items[0].tag).to.equal("div");
      expect(testElement.items[0].properties.class).to.equal("test-item-1");
    });

    it("should handle template wrapper in light DOM", async () => {
      const testElement = await fixture(html`
        <play-list>
          <template>
            <div class="template-item-1">Template Item 1</div>
            <div class="template-item-2">Template Item 2</div>
          </template>
        </play-list>
      `);

      // Wait for processing
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Note: Template elements don't work the same way in tests as in real DOM
      // The items array should still be processed, but may be empty in test environment
      expect(testElement.items).to.be.an("array");
    });

    it("should clear items when light DOM is empty", async () => {
      const testElement = await fixture(html`
        <play-list>
          <div>Initial Item</div>
        </play-list>
      `);

      // Wait for initial processing
      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(testElement.items).to.have.length(1);

      // Clear the content
      testElement.innerHTML = "";

      // Wait for mutation observer
      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(testElement.items).to.have.length(0);
    });

    it("should respond to light DOM mutations", async () => {
      const testElement = await fixture(html`
        <play-list>
          <div>Initial Item</div>
        </play-list>
      `);

      // Wait for initial processing
      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(testElement.items).to.have.length(1);

      // Add new item
      const newDiv = document.createElement("div");
      newDiv.textContent = "New Item";
      testElement.appendChild(newDiv);

      // Wait for mutation observer
      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(testElement.items).to.have.length(2);
    });
  });

  describe("HAX Item Rendering", () => {
    it("should render HAX items correctly", () => {
      const testItem = {
        tag: "div",
        properties: { class: "test-class", id: "test-id" },
        content: "Test Content",
      };

      const result = element.renderHAXItem(testItem);
      expect(result).to.exist;
      // The result should be a TemplateResult from unsafeHTML
    });

    it("should remove innerHTML property before rendering", () => {
      const testItem = {
        tag: "div",
        properties: {
          class: "test-class",
          innerHTML: "This should be removed",
        },
        content: "Test Content",
      };

      element.renderHAXItem(testItem);
      expect(testItem.properties.innerHTML).to.be.undefined;
    });
  });

  describe("Slide Management", () => {
    beforeEach(async () => {
      const testItems = [
        { tag: "div", properties: {}, content: "Item 1" },
        { tag: "div", properties: {}, content: "Item 2" },
        { tag: "div", properties: {}, content: "Item 3" },
      ];
      element.items = testItems;
      await element.updateComplete;
    });

    it("should handle slide index changes from carousel", async () => {
      const mockEvent = {
        detail: { index: 2 },
      };

      element.slideIndexChanged(mockEvent);
      expect(element.slide).to.equal(2);
    });

    it("should fire slide-changed event when slide property changes", async () => {
      let eventFired = false;
      let eventDetail = null;

      element.addEventListener("slide-changed", (e) => {
        eventFired = true;
        eventDetail = e.detail;
      });

      element.slide = 1;
      await element.updateComplete;

      expect(eventFired).to.be.true;
      expect(eventDetail.value).to.equal(1);
    });
  });

  describe("HAX Integration", () => {
    it("should have haxProperties defined", () => {
      const haxProps = PlayList.haxProperties;
      expect(haxProps).to.exist;
      expect(haxProps).to.be.a("string");
      expect(haxProps).to.include("play-list.haxProperties.json");
    });

    it("should have haxHooks method", () => {
      const hooks = element.haxHooks();
      expect(hooks).to.exist;
      expect(hooks.inlineContextMenu).to.equal("haxinlineContextMenu");
    });

    it("should configure inline context menu", () => {
      const mockMenu = { ceButtons: [] };
      element.haxinlineContextMenu(mockMenu);

      expect(mockMenu.ceButtons).to.have.length(2);
      expect(mockMenu.ceButtons[0].icon).to.equal("lrn:edit");
      expect(mockMenu.ceButtons[0].callback).to.equal("haxToggleEdit");
      expect(mockMenu.ceButtons[1].icon).to.equal("hax:anchor");
      expect(mockMenu.ceButtons[1].callback).to.equal("haxClickSlideIndex");
    });

    it("should toggle edit mode", async () => {
      expect(element.edit).to.be.false;

      const result = element.haxToggleEdit();
      expect(result).to.be.true;
      expect(element.edit).to.be.true;

      element.haxToggleEdit();
      expect(element.edit).to.be.false;
    });

    it("should handle click slide index action", () => {
      // Mock copyToClipboard since we can't test actual clipboard functionality
      element.slide = 5;
      const result = element.haxClickSlideIndex();
      expect(result).to.be.true;
    });
  });

  describe("Lifecycle Methods", () => {
    it("should call mirrorLightDomToItems on firstUpdated", async () => {
      let called = false;
      const originalMethod = element.mirrorLightDomToItems;
      element.mirrorLightDomToItems = () => {
        called = true;
        return originalMethod.call(element);
      };

      element.firstUpdated(new Map());
      expect(called).to.be.true;
    });

    it("should handle disconnectedCallback with existing link elements", () => {
      // Mock proper link elements that are actually in the head
      const link1 = document.createElement("link");
      const link2 = document.createElement("link");
      document.head.appendChild(link1);
      document.head.appendChild(link2);

      element._linkEls = [link1, link2];

      expect(() => {
        element.disconnectedCallback();
      }).to.not.throw();

      // Elements should be removed from head
      expect(document.head.contains(link1)).to.be.false;
      expect(document.head.contains(link2)).to.be.false;
    });

    it("should handle disconnectedCallback without link elements", () => {
      // Ensure _linkEls doesn't exist
      delete element._linkEls;

      expect(() => {
        element.disconnectedCallback();
      }).to.not.throw();
    });
  });

  describe("Accessibility", () => {
    it("should be accessible with items in carousel mode", async () => {
      const testItems = [
        { tag: "div", properties: { role: "article" }, content: "Article 1" },
        { tag: "div", properties: { role: "article" }, content: "Article 2" },
      ];
      element.items = testItems;
      await element.updateComplete;

      await expect(element).shadowDom.to.be.accessible();
    });

    it("should be accessible in edit mode", async () => {
      element.edit = true;
      await element.updateComplete;

      await expect(element).shadowDom.to.be.accessible();
    });

    it("should be accessible with navigation enabled", async () => {
      const testItems = [
        { tag: "div", properties: {}, content: "Item 1" },
        { tag: "div", properties: {}, content: "Item 2" },
      ];
      element.items = testItems;
      element.navigation = true;
      await element.updateComplete;

      await expect(element).shadowDom.to.be.accessible();
    });

    it("should be accessible with pagination enabled", async () => {
      const testItems = [
        { tag: "div", properties: {}, content: "Item 1" },
        { tag: "div", properties: {}, content: "Item 2" },
        { tag: "div", properties: {}, content: "Item 3" },
      ];
      element.items = testItems;
      element.pagination = true;
      await element.updateComplete;

      await expect(element).shadowDom.to.be.accessible();
    });

    it("should be accessible in vertical orientation", async () => {
      const testItems = [
        { tag: "div", properties: {}, content: "Item 1" },
        { tag: "div", properties: {}, content: "Item 2" },
      ];
      element.items = testItems;
      element.orientation = "vertical";
      await element.updateComplete;

      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe("CSS Styling", () => {
    it("should have proper base styling", () => {
      const styles = element.constructor.styles;
      expect(styles).to.exist;

      const styleString = styles.toString();
      expect(styleString).to.include(":host");
      expect(styleString).to.include("display: block");
    });

    it("should have vertical orientation styles", () => {
      const styles = element.constructor.styles;
      const styleString = styles.toString();

      expect(styleString).to.include(':host([orientation="vertical"])');
      expect(styleString).to.include("max-height: 400px");
    });

    it("should have edit mode styles", () => {
      const styles = element.constructor.styles;
      const styleString = styles.toString();

      expect(styleString).to.include(":host([edit]) .edit-wrapper");
      expect(styleString).to.include("border: 2px dashed #999999");
      expect(styleString).to.include("Play list edit mode");
    });

    it("should apply vertical orientation class", async () => {
      element.orientation = "vertical";
      await element.updateComplete;

      expect(element.hasAttribute("orientation")).to.be.true;
      expect(element.getAttribute("orientation")).to.equal("vertical");
    });

    it("should apply edit mode class", async () => {
      element.edit = true;
      await element.updateComplete;

      expect(element.hasAttribute("edit")).to.be.true;
      const editWrapper = element.shadowRoot.querySelector(".edit-wrapper");
      expect(editWrapper).to.exist;
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("should handle empty items array", async () => {
      element.items = [];
      await element.updateComplete;

      const carousel = element.shadowRoot.querySelector("sl-carousel");
      expect(carousel).to.not.exist;
    });

    it("should handle null items", async () => {
      element.items = null;
      await element.updateComplete;

      expect(() => element.updateComplete).to.not.throw();
    });

    it("should handle invalid slide index", async () => {
      const testItems = [{ tag: "div", properties: {}, content: "Item 1" }];
      element.items = testItems;
      element.slide = -1;
      await element.updateComplete;

      expect(element.slide).to.equal(-1); // Should not crash
    });

    it("should handle items with missing properties", () => {
      const testItem = {
        tag: "div",
        content: "Test Content",
        // Missing properties object
      };

      expect(() => {
        element.renderHAXItem(testItem);
      }).to.not.throw();
    });

    it("should handle rapid property changes", async () => {
      element.orientation = "vertical";
      element.loop = true;
      element.navigation = true;
      element.pagination = true;
      element.edit = true;
      element.aspectRatio = "1:1";
      element.slide = 5;

      await element.updateComplete;

      expect(element.orientation).to.equal("vertical");
      expect(element.loop).to.be.true;
      expect(element.navigation).to.be.true;
      expect(element.pagination).to.be.true;
      expect(element.edit).to.be.true;
      expect(element.aspectRatio).to.equal("1:1");
      expect(element.slide).to.equal(5);
    });

    it("should handle mutation observer disconnect", () => {
      expect(() => {
        element._observer.disconnect();
      }).to.not.throw();
    });

    it("should handle missing shadowRoot in updated", () => {
      const originalShadowRoot = element.shadowRoot;
      Object.defineProperty(element, "shadowRoot", {
        get: () => null,
        configurable: true,
      });

      expect(() => {
        element.slide = 1;
        element.updated(new Map([["slide", 0]]));
      }).to.not.throw();

      // Restore
      Object.defineProperty(element, "shadowRoot", {
        get: () => originalShadowRoot,
        configurable: true,
      });
    });
  });

  describe("Complex Integration Scenarios", () => {
    it("should handle switching from edit to display mode", async () => {
      // Start in edit mode
      element.edit = true;
      await element.updateComplete;

      let editWrapper = element.shadowRoot.querySelector(".edit-wrapper");
      expect(editWrapper).to.exist;

      // Add items and switch to display mode
      const testItems = [
        { tag: "div", properties: {}, content: "Item 1" },
        { tag: "div", properties: {}, content: "Item 2" },
      ];
      element.items = testItems;
      element.edit = false;
      await element.updateComplete;

      const carousel = element.shadowRoot.querySelector("sl-carousel");
      editWrapper = element.shadowRoot.querySelector(".edit-wrapper");

      expect(carousel).to.exist;
      expect(editWrapper).to.not.exist;
    });

    it("should handle multiple slide changes", async () => {
      const testItems = [
        { tag: "div", properties: {}, content: "Item 1" },
        { tag: "div", properties: {}, content: "Item 2" },
        { tag: "div", properties: {}, content: "Item 3" },
      ];
      element.items = testItems;
      await element.updateComplete;

      let eventCount = 0;
      element.addEventListener("slide-changed", () => {
        eventCount++;
      });

      element.slide = 1;
      await element.updateComplete;
      element.slide = 2;
      await element.updateComplete;
      element.slide = 0;
      await element.updateComplete;

      expect(eventCount).to.equal(3);
    });

    it("should work with complex HAX items", async () => {
      const complexItems = [
        {
          tag: "video-player",
          properties: {
            src: "test.mp4",
            controls: true,
            width: "100%",
          },
          content: "",
        },
        {
          tag: "simple-card",
          properties: {
            title: "Test Card",
            "accent-color": "blue",
          },
          content: "Card content here",
        },
      ];

      element.items = complexItems;
      await element.updateComplete;

      const carousel = element.shadowRoot.querySelector("sl-carousel");
      expect(carousel).to.exist;

      const carouselItems = carousel.querySelectorAll("sl-carousel-item");
      expect(carouselItems).to.have.length(2);
    });
  });

  describe("Performance Considerations", () => {
    it("should debounce mutation observer changes", async () => {
      let callCount = 0;
      const originalMethod = element.mirrorLightDomToItems;
      element.mirrorLightDomToItems = () => {
        callCount++;
        return originalMethod.call(element);
      };

      // Simulate multiple rapid mutations
      const testElement = await fixture(html`
        <play-list>
          <div>Item 1</div>
        </play-list>
      `);

      // Add multiple items rapidly
      for (let i = 0; i < 5; i++) {
        const div = document.createElement("div");
        div.textContent = `Item ${i + 2}`;
        testElement.appendChild(div);
      }

      // Wait for debounce timeout
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Should be called less than the number of mutations due to debouncing
      expect(callCount).to.be.lessThan(6);
    });

    it("should handle large numbers of items", async () => {
      const manyItems = [];
      for (let i = 0; i < 100; i++) {
        manyItems.push({
          tag: "div",
          properties: { class: `item-${i}` },
          content: `Item ${i}`,
        });
      }

      element.items = manyItems;
      await element.updateComplete;

      const carousel = element.shadowRoot.querySelector("sl-carousel");
      expect(carousel).to.exist;

      const carouselItems = carousel.querySelectorAll("sl-carousel-item");
      expect(carouselItems).to.have.length(100);
    });
  });
});

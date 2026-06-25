import { fixture, expect, html } from "@open-wc/testing";
import { ImageGallery } from "../image-gallery.js";
import "../image-gallery.js";

describe("ImageGallery test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html` <image-gallery></image-gallery> `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Component Structure", () => {
    it("should have shadow DOM", () => {
      expect(element.shadowRoot).to.exist;
    });

    it("should extend LitElement via DDD", () => {
      expect(element).to.be.instanceOf(ImageGallery);
      expect(element.constructor.name).to.equal("ImageGallery");
    });

    it("should have correct tag name", () => {
      expect(ImageGallery.tag).to.equal("image-gallery");
      expect(element.tagName.toLowerCase()).to.equal("image-gallery");
    });

    it("should have mutation observer", () => {
      expect(element._observer).to.exist;
      expect(element._observer).to.be.instanceOf(MutationObserver);
    });
  });

  describe("Default Properties", () => {
    it("should have correct default values", () => {
      expect(element.images).to.deep.equal([]);
      expect(element.edit).to.be.false;
      expect(element.mode).to.equal("grid");
      expect(element.activeIndex).to.equal(0);
    });

    it("should reflect properties to attributes", async () => {
      element.edit = true;
      element.mode = "gallery";
      element.activeIndex = 2;
      await element.updateComplete;

      expect(element.hasAttribute("edit")).to.be.true;
      expect(element.getAttribute("mode")).to.equal("gallery");
      expect(element.getAttribute("active-index")).to.equal("2");
    });
  });

  describe("Edit Mode", () => {
    it("should render edit wrapper when edit is true", async () => {
      element.edit = true;
      await element.updateComplete;

      const editWrapper = element.shadowRoot.querySelector(".edit-wrapper");
      expect(editWrapper).to.exist;

      const slot = editWrapper.querySelector("slot");
      expect(slot).to.exist;
    });

    it("should not render mode layouts when edit is true", async () => {
      element.edit = true;
      await element.updateComplete;

      expect(element.shadowRoot.querySelector(".grid-layout")).to.not.exist;
      expect(element.shadowRoot.querySelector(".masonry-layout")).to.not.exist;
      expect(element.shadowRoot.querySelector(".gallery-layout")).to.not.exist;
    });

    it("should rebuild images when exiting edit mode", async () => {
      element.edit = true;
      await element.updateComplete;

      const img = document.createElement("img");
      img.src = "test.jpg";
      img.alt = "Test";
      element.appendChild(img);
      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(element.images).to.have.length(1);
      expect(element.images[0].src).to.include("test.jpg");
      expect(element.images[0].alt).to.equal("Test");

      element.edit = false;
      await element.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(element.images).to.have.length(1);
      expect(element.images[0].src).to.include("test.jpg");
      expect(element.images[0].alt).to.equal("Test");

      img.remove();
    });
  });

  describe("Grid Mode", () => {
    beforeEach(async () => {
      const img1 = document.createElement("img");
      img1.src = "a.jpg";
      img1.alt = "Image A";
      const img2 = document.createElement("img");
      img2.src = "b.jpg";
      img2.alt = "Image B";
      element.appendChild(img1);
      element.appendChild(img2);
      await new Promise((resolve) => setTimeout(resolve, 150));
      element.mode = "grid";
      await element.updateComplete;
    });

    afterEach(() => {
      element.innerHTML = "";
    });

    it("should render grid layout", async () => {
      const grid = element.shadowRoot.querySelector(".grid-layout");
      expect(grid).to.exist;
    });

    it("should render grid items for each image", async () => {
      const items = element.shadowRoot.querySelectorAll(".grid-item");
      expect(items).to.have.length(2);
    });

    it("should dispatch simple-modal-show on grid item click", async () => {
      let eventFired = false;
      let eventDetail = null;

      element.addEventListener("simple-modal-show", (e) => {
        eventFired = true;
        eventDetail = e.detail;
      });

      const firstItem = element.shadowRoot.querySelector(".grid-item");
      firstItem.click();

      expect(eventFired).to.be.true;
      expect(eventDetail.title).to.equal("Image A");
      expect(eventDetail.elements.content).to.exist;
      expect(eventDetail.elements.content.tagName).to.equal("DIV");
      const modalImg = eventDetail.elements.content.querySelector("img");
      expect(modalImg).to.exist;
      expect(modalImg.getAttribute("src")).to.equal("a.jpg");
    });

    it("should dispatch simple-modal-show on grid item Enter key", async () => {
      let eventFired = false;
      element.addEventListener("simple-modal-show", () => {
        eventFired = true;
      });

      const firstItem = element.shadowRoot.querySelector(".grid-item");
      const event = new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
      });
      firstItem.dispatchEvent(event);

      expect(eventFired).to.be.true;
    });

    it("should be accessible in grid mode", async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe("Masonry Mode", () => {
    beforeEach(async () => {
      const img1 = document.createElement("img");
      img1.src = "a.jpg";
      img1.alt = "Image A";
      const img2 = document.createElement("img");
      img2.src = "b.jpg";
      img2.alt = "Image B";
      element.appendChild(img1);
      element.appendChild(img2);
      await new Promise((resolve) => setTimeout(resolve, 150));
      element.mode = "masonry";
      await element.updateComplete;
    });

    afterEach(() => {
      element.innerHTML = "";
    });

    it("should render masonry layout", async () => {
      const masonry = element.shadowRoot.querySelector(".masonry-layout");
      expect(masonry).to.exist;
    });

    it("should render masonry items for each image", async () => {
      const items = element.shadowRoot.querySelectorAll(".masonry-item");
      expect(items).to.have.length(2);
      expect(items[0].tagName).to.equal("BUTTON");
    });

    it("should dispatch simple-modal-show on masonry item click", async () => {
      let eventFired = false;
      element.addEventListener("simple-modal-show", () => {
        eventFired = true;
      });

      const firstItem = element.shadowRoot.querySelector(".masonry-item");
      firstItem.click();

      expect(eventFired).to.be.true;
    });

    it("should be accessible in masonry mode", async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe("Gallery Mode", () => {
    beforeEach(async () => {
      const img1 = document.createElement("img");
      img1.src = "a.jpg";
      img1.alt = "Image A";
      const img2 = document.createElement("img");
      img2.src = "b.jpg";
      img2.alt = "Image B";
      const img3 = document.createElement("img");
      img3.src = "c.jpg";
      img3.alt = "Image C";
      element.appendChild(img1);
      element.appendChild(img2);
      element.appendChild(img3);
      await new Promise((resolve) => setTimeout(resolve, 150));
      element.mode = "gallery";
      await element.updateComplete;
    });

    afterEach(() => {
      element.innerHTML = "";
    });

    it("should render gallery layout", async () => {
      const gallery = element.shadowRoot.querySelector(".gallery-layout");
      expect(gallery).to.exist;
    });

    it("should render gallery main image", async () => {
      const main = element.shadowRoot.querySelector(".gallery-main img");
      expect(main).to.exist;
      expect(main.getAttribute("src")).to.equal("a.jpg");
      expect(main.alt).to.equal("Image A");
    });

    it("should render thumbnail strip", async () => {
      const thumbnails =
        element.shadowRoot.querySelectorAll(".gallery-thumbnail");
      expect(thumbnails).to.have.length(3);
    });

    it("should mark first thumbnail as active", async () => {
      const firstThumb = element.shadowRoot.querySelector(".gallery-thumbnail");
      expect(firstThumb.classList.contains("active")).to.be.true;
      expect(firstThumb.getAttribute("aria-selected")).to.equal("true");
    });

    it("should change active image on thumbnail click", async () => {
      const thumbnails =
        element.shadowRoot.querySelectorAll(".gallery-thumbnail");
      thumbnails[1].click();
      await element.updateComplete;

      expect(element.activeIndex).to.equal(1);
      const main = element.shadowRoot.querySelector(".gallery-main img");
      expect(main.getAttribute("src")).to.equal("b.jpg");
      expect(main.alt).to.equal("Image B");
    });

    it("should navigate with next arrow button", async () => {
      const nextBtn = element.shadowRoot.querySelector("#next-btn");
      nextBtn.click();
      await element.updateComplete;

      expect(element.activeIndex).to.equal(1);
    });

    it("should navigate with previous arrow button", async () => {
      element.activeIndex = 2;
      await element.updateComplete;

      const prevBtn = element.shadowRoot.querySelector("#prev-btn");
      prevBtn.click();
      await element.updateComplete;

      expect(element.activeIndex).to.equal(1);
    });

    it("should disable previous button at first image", async () => {
      const prevBtn = element.shadowRoot.querySelector("#prev-btn");
      expect(prevBtn.disabled).to.be.true;
    });

    it("should disable next button at last image", async () => {
      element.activeIndex = 2;
      await element.updateComplete;

      const nextBtn = element.shadowRoot.querySelector("#next-btn");
      expect(nextBtn.disabled).to.be.true;
    });

    it("should navigate with ArrowRight keyboard", async () => {
      const event = new KeyboardEvent("keydown", {
        key: "ArrowRight",
        bubbles: true,
      });
      element.dispatchEvent(event);
      await element.updateComplete;

      expect(element.activeIndex).to.equal(1);
    });

    it("should navigate with ArrowLeft keyboard", async () => {
      element.activeIndex = 2;
      await element.updateComplete;

      const event = new KeyboardEvent("keydown", {
        key: "ArrowLeft",
        bubbles: true,
      });
      element.dispatchEvent(event);
      await element.updateComplete;

      expect(element.activeIndex).to.equal(1);
    });

    it("should show alt text as caption in gallery mode", async () => {
      const caption = element.shadowRoot.querySelector(".gallery-caption");
      expect(caption).to.exist;
      expect(caption.textContent).to.equal("Image A");
    });

    it("should not show caption when alt is empty", async () => {
      element.innerHTML = "";
      const img = document.createElement("img");
      img.src = "noalt.jpg";
      img.alt = "";
      element.appendChild(img);
      await new Promise((resolve) => setTimeout(resolve, 150));
      element.activeIndex = 0;
      await element.updateComplete;

      const caption = element.shadowRoot.querySelector(".gallery-caption");
      expect(caption).to.not.exist;
    });

    it("should be accessible in gallery mode", async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe("Light DOM Integration", () => {
    it("should mirror media-image children to images", async () => {
      const testElement = await fixture(html`
        <image-gallery>
          <media-image source="test1.jpg" alt="Test 1"></media-image>
          <media-image source="test2.jpg" alt="Test 2"></media-image>
        </image-gallery>
      `);

      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(testElement.images).to.have.length(2);
      expect(testElement.images[0].src).to.include("test1.jpg");
      expect(testElement.images[0].alt).to.equal("Test 1");
      expect(testElement.images[0].tagName).to.equal("MEDIA-IMAGE");
    });

    it("should mirror plain img children to images", async () => {
      const testElement = await fixture(html`
        <image-gallery>
          <img src="img1.jpg" alt="Img 1" />
          <img src="img2.jpg" alt="Img 2" />
        </image-gallery>
      `);

      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(testElement.images).to.have.length(2);
      expect(testElement.images[0].src).to.include("img1.jpg");
      expect(testElement.images[0].alt).to.equal("Img 1");
      expect(testElement.images[0].tagName).to.equal("IMG");
    });

    it("should ignore non-image children", async () => {
      const testElement = await fixture(html`
        <image-gallery>
          <img src="img1.jpg" alt="Img 1" />
          <div>Not an image</div>
          <img src="img2.jpg" alt="Img 2" />
        </image-gallery>
      `);

      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(testElement.images).to.have.length(2);
    });

    it("should respond to light DOM mutations", async () => {
      const testElement = await fixture(html`
        <image-gallery>
          <img src="initial.jpg" alt="Initial" />
        </image-gallery>
      `);

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(testElement.images).to.have.length(1);

      const newImg = document.createElement("img");
      newImg.src = "new.jpg";
      newImg.alt = "New";
      testElement.appendChild(newImg);

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(testElement.images).to.have.length(2);
      expect(testElement.images[1].src).to.include("new.jpg");
    });

    it("should reset activeIndex when children are removed", async () => {
      const testElement = await fixture(html`
        <image-gallery mode="gallery">
          <img src="a.jpg" alt="A" />
          <img src="b.jpg" alt="B" />
        </image-gallery>
      `);

      await new Promise((resolve) => setTimeout(resolve, 150));
      testElement.activeIndex = 1;
      await testElement.updateComplete;
      expect(testElement.activeIndex).to.equal(1);

      testElement.innerHTML = "";
      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(testElement.activeIndex).to.equal(0);
      expect(testElement.images).to.have.length(0);
    });
  });

  describe("HAX Integration", () => {
    it("should have haxProperties defined", () => {
      const haxProps = ImageGallery.haxProperties;
      expect(haxProps).to.exist;
      expect(haxProps).to.be.a("string");
      expect(haxProps).to.include("image-gallery.haxProperties.json");
    });

    it("should have haxHooks method", () => {
      const hooks = element.haxHooks();
      expect(hooks).to.exist;
      expect(hooks.inlineContextMenu).to.equal("haxinlineContextMenu");
    });

    it("should configure inline context menu", () => {
      const mockMenu = { ceButtons: [] };
      element.haxinlineContextMenu(mockMenu);
      expect(mockMenu.ceButtons).to.have.length(4);
      expect(mockMenu.ceButtons[0].callback).to.equal("haxBreakOutGallery");
      expect(mockMenu.ceButtons[1].callback).to.equal("haxToggleEdit");
      expect(mockMenu.ceButtons[2].callback).to.equal("haxAddImage");
      expect(mockMenu.ceButtons[3].callback).to.equal("haxRemoveLastImage");
    });

    it("should toggle edit mode via haxToggleEdit", () => {
      expect(element.edit).to.be.false;
      const result = element.haxToggleEdit();
      expect(result).to.be.true;
      expect(element.edit).to.be.true;
      element.haxToggleEdit();
      expect(element.edit).to.be.false;
    });

    it("should add image via haxAddImage", () => {
      const result = element.haxAddImage();
      expect(result).to.be.true;
      expect(element.children).to.have.length(1);
      expect(element.children[0].tagName).to.equal("MEDIA-IMAGE");
      expect(element.children[0].getAttribute("source")).to.equal("");
      expect(element.children[0].getAttribute("alt")).to.equal("New image");
    });

    it("should remove last image via haxRemoveLastImage", async () => {
      const img1 = document.createElement("img");
      img1.src = "a.jpg";
      img1.alt = "A";
      const img2 = document.createElement("img");
      img2.src = "b.jpg";
      img2.alt = "B";
      element.appendChild(img1);
      element.appendChild(img2);
      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(element.children).to.have.length(2);
      const result = element.haxRemoveLastImage();
      expect(result).to.be.true;
      expect(element.children).to.have.length(1);
      expect(element.children[0].getAttribute("src")).to.equal("a.jpg");
    });

    it("should break out gallery via haxBreakOutGallery", async () => {
      const testElement = await fixture(html`
        <div>
          <image-gallery slot="col-2">
            <img src="a.jpg" alt="A" />
            <img src="b.jpg" alt="B" />
          </image-gallery>
        </div>
      `);
      const gallery = testElement.querySelector("image-gallery");
      const result = gallery.haxBreakOutGallery();

      expect(result).to.be.true;
      expect(testElement.querySelector("image-gallery")).to.not.exist;
      const images = testElement.querySelectorAll("img");
      expect(images).to.have.length(2);
      expect(images[0].getAttribute("slot")).to.equal("col-2");
      expect(images[1].getAttribute("slot")).to.equal("col-2");
    });

    it("should handle haxBreakOutGallery with no parent", () => {
      const orphan = document.createElement("image-gallery");
      const result = orphan.haxBreakOutGallery();
      expect(result).to.be.false;
    });

    it("should handle haxBreakOutGallery with no images", () => {
      const result = element.haxBreakOutGallery();
      expect(result).to.be.false;
    });

    it("should handle haxRemoveLastImage with no images", () => {
      const result = element.haxRemoveLastImage();
      expect(result).to.be.true;
      expect(element.children).to.have.length(0);
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("should handle empty images in grid mode", async () => {
      element.mode = "grid";
      await element.updateComplete;
      const grid = element.shadowRoot.querySelector(".grid-layout");
      expect(grid).to.exist;
      expect(grid.querySelectorAll(".grid-item")).to.have.length(0);
    });

    it("should handle empty images in gallery mode", async () => {
      element.mode = "gallery";
      await element.updateComplete;
      const gallery = element.shadowRoot.querySelector(".gallery-layout");
      expect(gallery).to.exist;
      expect(gallery.querySelector(".gallery-main img")).to.not.exist;
    });

    it("should clamp activeIndex to bounds", async () => {
      element.appendChild(document.createElement("img"));
      await new Promise((resolve) => setTimeout(resolve, 150));

      element._setActiveIndex(-1);
      expect(element.activeIndex).to.equal(0);

      element._setActiveIndex(100);
      expect(element.activeIndex).to.equal(0);
    });

    it("should handle rapid mode switches", async () => {
      element.mode = "grid";
      await element.updateComplete;
      element.mode = "masonry";
      await element.updateComplete;
      element.mode = "gallery";
      await element.updateComplete;
      element.mode = "grid";
      await element.updateComplete;

      expect(element.mode).to.equal("grid");
      expect(element.shadowRoot.querySelector(".grid-layout")).to.exist;
    });

    it("should handle mutation observer disconnect", () => {
      expect(() => {
        element._observer.disconnect();
      }).to.not.throw();
    });
  });

  describe("Lifecycle Methods", () => {
    it("should update images on firstUpdated", async () => {
      const testElement = await fixture(html`
        <image-gallery>
          <img src="lifecycle.jpg" alt="Lifecycle" />
        </image-gallery>
      `);
      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(testElement.images).to.have.length(1);
      expect(testElement.images[0].src).to.include("lifecycle.jpg");
    });

    it("should handle disconnectedCallback without throwing", () => {
      expect(() => {
        element.disconnectedCallback();
      }).to.not.throw();
    });
  });

  describe("Accessibility", () => {
    it("should be accessible in grid mode with images", async () => {
      const img = document.createElement("img");
      img.src = "a.jpg";
      img.alt = "A";
      element.appendChild(img);
      await new Promise((resolve) => setTimeout(resolve, 150));
      element.mode = "grid";
      await element.updateComplete;
      await expect(element).shadowDom.to.be.accessible();
    });

    it("should be accessible in masonry mode with images", async () => {
      const img = document.createElement("img");
      img.src = "a.jpg";
      img.alt = "A";
      element.appendChild(img);
      await new Promise((resolve) => setTimeout(resolve, 150));
      element.mode = "masonry";
      await element.updateComplete;
      await expect(element).shadowDom.to.be.accessible();
    });

    it("should be accessible in gallery mode with images", async () => {
      const img = document.createElement("img");
      img.src = "a.jpg";
      img.alt = "A";
      element.appendChild(img);
      await new Promise((resolve) => setTimeout(resolve, 150));
      element.mode = "gallery";
      await element.updateComplete;
      await expect(element).shadowDom.to.be.accessible();
    });
  });
});

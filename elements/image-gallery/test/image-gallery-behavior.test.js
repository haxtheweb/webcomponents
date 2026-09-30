import { fixture, expect, html } from "@open-wc/testing";
import "../image-gallery.js";
import { ImageGallery } from "../image-gallery.js";

const flush = (ms = 60) => new Promise((r) => setTimeout(r, ms));

describe("image-gallery behavior gaps", () => {
  let originalHaxStore;

  beforeEach(() => {
    originalHaxStore = globalThis.HaxStore;
  });

  afterEach(() => {
    globalThis.HaxStore = originalHaxStore;
  });

  async function ready() {
    const el = await fixture(html`<image-gallery>
      <media-image
        source="https://placehold.co/200x100"
        alt="first"
      ></media-image>
      <img src="https://placehold.co/100x200" alt="second" />
    </image-gallery>`);
    await el.updateComplete;
    // let the mutation observer's debounce run so images settle
    await flush(150);
    return el;
  }

  it("setActiveIndex delegates and clamps the index", async () => {
    const el = await ready();
    expect(el.images.length).to.equal(2);
    el.setActiveIndex(1);
    expect(el.activeIndex).to.equal(1);
    el.setActiveIndex(99);
    expect(el.activeIndex).to.equal(1);
    el.setActiveIndex(-5);
    expect(el.activeIndex).to.equal(0);
  });

  it("_setActiveIndex resets to zero with no images", async () => {
    const el = await ready();
    el.images = [];
    el._setActiveIndex(3);
    expect(el.activeIndex).to.equal(0);
  });

  it("keydown arrows are ignored outside gallery mode or while editing", async () => {
    const el = await ready();
    el.mode = "masonry";
    el.activeIndex = 1;
    await el.updateComplete;
    el._handleKeydown(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
    expect(el.activeIndex).to.equal(1);
    // edit mode also blocks navigation in gallery mode
    el.mode = "gallery";
    el.edit = true;
    await el.updateComplete;
    el._handleKeydown(new KeyboardEvent("keydown", { key: "ArrowRight" }));
    expect(el.activeIndex).to.equal(1);
    el.edit = false;
    await el.updateComplete;
  });

  it("_getHaxStore returns null when the store accessor throws", async () => {
    const el = await ready();
    globalThis.HaxStore = {
      requestAvailability: () => {
        throw new Error("no store for you");
      },
    };
    expect(el._getHaxStore()).to.equal(null);
  });

  it("_getHaxStore returns null without a global store", async () => {
    const el = await ready();
    globalThis.HaxStore = undefined;
    expect(el._getHaxStore()).to.equal(null);
  });

  it("_resolveHaxEditState consults the active hax body edit mode", async () => {
    const el = await ready();
    expect(el._resolveHaxEditState()).to.equal(false);
    globalThis.HaxStore = {
      requestAvailability: () => ({
        activeHaxBody: { editMode: true },
      }),
    };
    expect(el._resolveHaxEditState()).to.equal(true);
  });

  it("_onDrop forwards file drops to hax-body and refreshes images", async () => {
    const el = await ready();
    el._haxState = true;
    const drops = [];
    globalThis.HaxStore = {
      requestAvailability: () => ({
        __dragTarget: null,
        activeHaxBody: {
          dropEvent: (e) => {
            drops.push(e);
          },
        },
      }),
    };
    const fakeEvent = {
      dataTransfer: {
        files: [{ name: "cat.png" }],
      },
    };
    el._onDrop(fakeEvent);
    expect(drops.length).to.equal(1);
    // the images array got refreshed through the mutation pipeline
    expect(el.images.length).to.equal(2);
  });

  it("_onDrop with no drag target and no files is a no-op", async () => {
    const el = await ready();
    el._haxState = true;
    globalThis.HaxStore = {
      requestAvailability: () => ({ __dragTarget: null }),
    };
    el._onDrop({ dataTransfer: { files: [] } });
    expect(el.images.length).to.equal(2);
    // and outside hax state entirely it returns immediately
    el._haxState = false;
    el._onDrop({ dataTransfer: null });
    expect(el.images.length).to.equal(2);
  });

  it("_onDrop rejects dragged tags that are not images", async () => {
    const el = await ready();
    el._haxState = true;
    let stopped = 0;
    const dragTarget = globalThis.document.createElement("div");
    globalThis.HaxStore = {
      requestAvailability: () => ({ __dragTarget: dragTarget }),
    };
    const fakeEvent = {
      dataTransfer: null,
      stopPropagation: () => stopped++,
      stopImmediatePropagation: () => stopped++,
      preventDefault: () => stopped++,
    };
    el._onDrop(fakeEvent);
    expect(stopped).to.equal(3);
    globalThis.HaxStore = {
      requestAvailability: () => ({ __dragTarget: null }),
    };
  });

  it("_onDrop appends a dragged image element from outside the gallery", async () => {
    const el = await ready();
    el._haxState = true;
    const dragged = globalThis.document.createElement("img");
    dragged.setAttribute("src", "https://placehold.co/50x50");
    dragged.setAttribute("alt", "dropped");
    let stopped = 0;
    globalThis.HaxStore = {
      requestAvailability: () => ({ __dragTarget: dragged }),
    };
    el._onDrop({
      dataTransfer: null,
      stopPropagation: () => stopped++,
      stopImmediatePropagation: () => stopped++,
      preventDefault: () => stopped++,
    });
    expect(el.contains(dragged)).to.equal(true);
    expect(el._newImageElement === dragged).to.equal(true);
    // the highlight flag clears itself after the timeout
    await flush(700);
    expect(el._newImageElement === null).to.equal(true);
    // cleanup the appended node so later fixtures stay isolated
    dragged.remove();
  });

  it("haxBreakOutGallery spreads the images and removes the gallery", async () => {
    const parent = globalThis.document.createElement("div");
    const el = await ready();
    parent.appendChild(el);
    globalThis.document.body.appendChild(parent);
    // no slot attribute: clones must not carry a slot either
    expect(el.getAttribute("slot")).to.equal(null);
    const result = el.haxBreakOutGallery();
    expect(result).to.equal(true);
    expect(parent.querySelector("image-gallery")).to.equal(null);
    expect(parent.querySelectorAll("img").length).to.equal(1);
    expect(parent.querySelectorAll("media-image").length).to.equal(1);
    const clone = parent.querySelector("img");
    expect(clone.getAttribute("slot")).to.equal(null);
    parent.remove();
  });

  it("haxBreakOutGallery preserves the slot attribute on clones", async () => {
    const parent = globalThis.document.createElement("div");
    const el = await ready();
    el.setAttribute("slot", "col-1");
    parent.appendChild(el);
    globalThis.document.body.appendChild(parent);
    expect(el.haxBreakOutGallery()).to.equal(true);
    const clone = parent.querySelector("img");
    expect(clone.getAttribute("slot")).to.equal("col-1");
    parent.remove();
  });

  it("haxBreakOutGallery bails without a parent node", async () => {
    const el = await ready();
    el.remove();
    expect(el.haxBreakOutGallery()).to.equal(false);
  });

  it("haxRemoveLastImage strips the final image and haxAddImage appends one", async () => {
    const el = await ready();
    expect(el.images.length).to.equal(2);
    expect(el.haxRemoveLastImage()).to.equal(true);
    await flush(150);
    expect(el.images.length).to.equal(1);
    expect(el.haxAddImage()).to.equal(true);
    // the newly appended element gets the temporary highlight immediately
    expect(el._newImageElement !== null).to.equal(true);
    await flush(150);
    expect(el.images.length).to.equal(2);
    // the highlight flag clears itself after its 600ms timeout
    await flush(700);
    expect(el._newImageElement === null).to.equal(true);
  });

  it("haxToggleEdit flips edit mode", async () => {
    const el = await ready();
    expect(el.haxToggleEdit()).to.equal(true);
    expect(el.edit).to.equal(true);
    expect(el.haxToggleEdit()).to.equal(true);
    expect(el.edit).to.equal(false);
  });

  it("haxpreProcessNodeToContent clones galleries without the edit flag", async () => {
    const el = await ready();
    el.edit = true;
    const clone = el.haxpreProcessNodeToContent(el);
    expect(clone.hasAttribute("edit")).to.equal(false);
    // non-gallery nodes pass through untouched
    const other = globalThis.document.createElement("div");
    expect(el.haxpreProcessNodeToContent(other)).to.equal(other);
  });

  it("haxHooks maps its lifecycle hooks", async () => {
    const el = await ready();
    const hooks = el.haxHooks();
    expect(Object.keys(hooks).length).to.equal(4);
    expect(hooks.inlineContextMenu).to.equal("haxinlineContextMenu");
  });

  it("exposes haxProperties as a file reference", () => {
    expect(ImageGallery.haxProperties.endsWith(
      "image-gallery.haxProperties.json",
    )).to.equal(true);
  });
});

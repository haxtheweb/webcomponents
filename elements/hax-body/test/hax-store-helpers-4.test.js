import { expect, oneEvent } from "@open-wc/testing";

import { HAXStore } from "../lib/hax-store.js";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";

// helper: restore an own-property mock that shadowed a prototype method
function restoreMethod(obj, key) {
  delete obj[key];
}

describe("hax-store helpers round 4 (gizmo matching + insertion logic)", () => {
  let saved = {};
  function stash(key) {
    if (!(key in saved)) {
      saved[key] = HAXStore[key];
    }
  }
  afterEach(() => {
    for (let key in saved) {
      HAXStore[key] = saved[key];
      delete saved[key];
    }
    if (HAXStore.__OwnMocks) {
      delete HAXStore.__OwnMocks;
    }
  });

  describe("testHook", () => {
    it("returns true for a primitive with a matching primativeHooks entry", () => {
      HAXStore.primativeHooks = { p: { myOp: () => true } };
      const p = globalThis.document.createElement("p");
      expect(HAXStore.testHook(p, "myOp")).to.equal(true);
    });

    it("returns false for a primitive without a matching primativeHooks entry", () => {
      HAXStore.primativeHooks = { p: {} };
      const p = globalThis.document.createElement("p");
      expect(HAXStore.testHook(p, "myOp")).to.equal(false);
    });

    it("returns truthy for an element defining haxHooks with the op", () => {
      const el = {
        haxHooks: () => ({ myOp: "myOpMethod" }),
        myOpMethod: () => true,
      };
      expect(HAXStore.testHook(el, "myOp")).to.equal("myOpMethod");
    });

    it("returns null for a null element (short-circuit value)", () => {
      expect(HAXStore.testHook(null, "myOp")).to.be.null;
    });
  });

  describe("runHook", () => {
    it("runs a primitive hook via primativeHooks", async () => {
      HAXStore.primativeHooks = { p: { myOp: (a, b) => a + b } };
      const p = globalThis.document.createElement("p");
      expect(await HAXStore.runHook(p, "myOp", [1, 2])).to.equal(3);
    });

    it("runs an element hook via the haxHooks mapping", async () => {
      const el = {
        haxHooks: () => ({ myOp: "myOpMethod" }),
        myOpMethod: (a) => a * 2,
      };
      expect(await HAXStore.runHook(el, "myOp", [4])).to.equal(8);
    });

    it("returns false when the hook does not exist", async () => {
      const p = globalThis.document.createElement("p");
      expect(await HAXStore.runHook(p, "nope", [])).to.equal(false);
    });
  });

  describe("_pokeMatchingImgs", () => {
    it("does nothing for null root or missing cleanPath", () => {
      expect(() => HAXStore._pokeMatchingImgs(null, "a.jpg")).to.not.throw();
      const div = globalThis.document.createElement("div");
      expect(() => HAXStore._pokeMatchingImgs(div, "")).to.not.throw();
    });

    it("cache-busts matching img src in light DOM", () => {
      const host = globalThis.document.createElement("div");
      host.innerHTML =
        '<img src="files/a.jpg"><img src="files/b.jpg"><img src="other/a.jpg">';
      HAXStore._pokeMatchingImgs(host, "files/a.jpg");
      const imgs = host.querySelectorAll("img");
      expect(imgs[0].getAttribute("src")).to.contain("files/a.jpg?t=");
      expect(imgs[1].getAttribute("src")).to.equal("files/b.jpg");
      expect(imgs[2].getAttribute("src")).to.contain("other/a.jpg?t=");
    });

    it("pierces shadow roots of nested elements", () => {
      const host = globalThis.document.createElement("div");
      const wrapper = globalThis.document.createElement("section");
      const shadow = wrapper.attachShadow({ mode: "open" });
      shadow.innerHTML = '<img src="files/a.jpg">';
      host.appendChild(wrapper);
      HAXStore._pokeMatchingImgs(host, "files/a.jpg");
      expect(shadow.querySelector("img").getAttribute("src")).to.contain(
        "files/a.jpg?t=",
      );
    });
  });

  describe("refreshMediaSource", () => {
    it("returns early without path or activeHaxBody", async () => {
      expect(await HAXStore.refreshMediaSource("")).to.equal(undefined);
      stash("activeHaxBody");
      HAXStore.activeHaxBody = null;
      expect(await HAXStore.refreshMediaSource("files/a.jpg")).to.equal(
        undefined,
      );
    });

    it("cache-busts raw img elements and shadow imgs of other elements", async () => {
      const body = globalThis.document.createElement("div");
      body.innerHTML = '<img src="files/a.jpg"><p>text</p>';
      const custom = globalThis.document.createElement("my-shadow-host");
      const shadow = custom.attachShadow({ mode: "open" });
      shadow.innerHTML = '<img src="files/a.jpg">';
      body.appendChild(custom);
      stash("activeHaxBody");
      HAXStore.activeHaxBody = body;
      await HAXStore.refreshMediaSource("files/a.jpg?v=2");
      expect(body.querySelector("img").getAttribute("src")).to.contain(
        "files/a.jpg?t=",
      );
      expect(shadow.querySelector("img").getAttribute("src")).to.contain(
        "files/a.jpg?t=",
      );
    });

    it("invokes the mediaSourceUpdated haxHook on elements that define it", async () => {
      class TestMediaEl extends globalThis.HTMLElement {
        constructor() {
          super();
          this.hookCalls = [];
        }
        haxHooks() {
          return { mediaSourceUpdated: "onMediaSourceUpdated" };
        }
        onMediaSourceUpdated(path, store) {
          this.hookCalls.push([path, store]);
        }
      }
      if (!globalThis.customElements.get("test-media-refresh-el")) {
        globalThis.customElements.define("test-media-refresh-el", TestMediaEl);
      }
      const el = globalThis.document.createElement("test-media-refresh-el");
      const body = globalThis.document.createElement("div");
      body.appendChild(el);
      stash("activeHaxBody");
      HAXStore.activeHaxBody = body;
      await HAXStore.refreshMediaSource("files/a.jpg");
      expect(el.hookCalls.length).to.equal(1);
      expect(el.hookCalls[0][0]).to.equal("files/a.jpg");
      expect(el.hookCalls[0][1]).to.equal(HAXStore);
    });
  });

  describe("getSelection / getRange", () => {
    it("uses the selection of the activeHaxBody root when available", () => {
      const p = globalThis.document.createElement("p");
      p.textContent = "hello";
      globalThis.document.body.appendChild(p);
      const sel = globalThis.document.getSelection();
      sel.removeAllRanges();
      const range = globalThis.document.createRange();
      range.selectNodeContents(p);
      sel.addRange(range);
      stash("activeHaxBody");
      HAXStore.activeHaxBody = p;
      expect(HAXStore.getSelection()).to.equal(sel);
      expect(HAXStore.getRange()).to.equal(range);
      p.remove();
      sel.removeAllRanges();
    });

    it("falls back to the window selection without activeHaxBody", () => {
      stash("activeHaxBody");
      HAXStore.activeHaxBody = null;
      expect(HAXStore.getSelection()).to.equal(globalThis.getSelection());
    });

    it("getRange returns the selection itself when it has no ranges", () => {
      const sel = globalThis.document.getSelection();
      sel.removeAllRanges();
      stash("activeHaxBody");
      HAXStore.activeHaxBody = null;
      expect(HAXStore.getRange()).to.equal(sel);
    });
  });

  describe("guessGizmo", () => {
    beforeEach(() => {
      stash("validGizmoTypes");
      stash("gizmoList");
      HAXStore.validGizmoTypes = ["image", "video", "link", "inline", "*"];
      HAXStore.gizmoList = [];
    });

    it("returns [] for undefined guess", () => {
      expect(HAXStore.guessGizmo(undefined, {})).to.deep.equal([]);
    });

    it("returns [] for a guess type that is not valid", () => {
      expect(HAXStore.guessGizmo("bogus", {})).to.deep.equal([]);
    });

    it("matches a gizmo whose handle binds a supplied value", () => {
      HAXStore.gizmoList = [
        {
          tag: "video-player",
          handles: [{ type: "video", source: "source" }],
        },
      ];
      const matches = HAXStore.guessGizmo("video", { source: "a.mp4" });
      expect(matches.length).to.equal(1);
      expect(matches[0].tag).to.equal("video-player");
      expect(matches[0].properties.source).to.equal("a.mp4");
    });

    it("does not match when no handle property lines up with the values", () => {
      HAXStore.gizmoList = [
        {
          tag: "video-player",
          handles: [{ type: "video", source: "source" }],
        },
      ];
      expect(
        HAXStore.guessGizmo("video", { title: "no source here" }),
      ).to.deep.equal([]);
    });

    it("matches on skipPropMatch even without a property match", () => {
      HAXStore.gizmoList = [
        {
          tag: "video-player",
          handles: [{ type: "video", source: "source" }],
        },
      ];
      const matches = HAXStore.guessGizmo("video", {}, true);
      expect(matches.length).to.equal(1);
    });

    it("returns a single exclusive match when preferExclusive and type_exclusive", () => {
      HAXStore.gizmoList = [
        {
          tag: "super-video",
          handles: [{ type: "video", source: "source" }],
        },
        {
          tag: "regular-video",
          handles: [
            { type: "video", source: "source" },
            { type: "video", title: "title" },
          ],
        },
      ];
      HAXStore.gizmoList[0].handles[0].type_exclusive = true;
      const matches = HAXStore.guessGizmo(
        "video",
        { source: "a.mp4" },
        false,
        true,
      );
      expect(matches.length).to.equal(1);
      expect(matches[0].tag).to.equal("super-video");
    });

    it("aggregates keywords from handles and tags and dedupes matched tags", () => {
      HAXStore.gizmoList = [
        {
          tag: "media-image",
          handles: [{ type: "image", source: "source" }],
          tags: ["media", "Image"],
        },
        {
          tag: "media-image",
          handles: [{ type: "image", source: "source" }],
          tags: ["other"],
        },
      ];
      const matches = HAXStore.guessGizmo("image", { source: "a.jpg" });
      expect(matches.length).to.equal(1);
      expect(matches[0].gizmo.keywords).to.deep.equal(["image", "media"]);
    });

    it("binds values.innerHTML into the initial props when present", () => {
      HAXStore.gizmoList = [
        {
          tag: "content-el",
          handles: [{ type: "link", title: "title" }],
        },
      ];
      const matches = HAXStore.guessGizmo("link", {
        innerHTML: "raw html",
        title: "a title",
      });
      expect(matches.length).to.equal(1);
      expect(matches[0].properties.innerHTML).to.equal("raw html");
      expect(matches[0].properties.title).to.equal("a title");
    });

    it("skips gizmos whose meta is hidden or inlineOnly for non-inline guesses", () => {
      HAXStore.gizmoList = [
        {
          tag: "hidden-el",
          handles: [{ type: "image", source: "source" }],
          meta: { hidden: true },
        },
        {
          tag: "inline-only-el",
          handles: [{ type: "image", source: "source" }],
          meta: { inlineOnly: true },
        },
        {
          tag: "ok-el",
          handles: [{ type: "image", source: "source" }],
        },
      ];
      const matches = HAXStore.guessGizmo("image", { source: "a.jpg" });
      expect(matches.length).to.equal(1);
      expect(matches[0].tag).to.equal("ok-el");
    });

    it("allows inlineOnly gizmos when guessing inline", () => {
      HAXStore.gizmoList = [
        {
          tag: "inline-only-el",
          handles: [{ type: "inline", text: "text" }],
          meta: { inlineOnly: true },
        },
      ];
      const matches = HAXStore.guessGizmo("inline", { text: "hi" });
      expect(matches.length).to.equal(1);
      expect(matches[0].tag).to.equal("inline-only-el");
    });

    it("wildcard guess matches the first handle of each gizmo on skipPropMatch", () => {
      HAXStore.gizmoList = [
        { tag: "el-one", handles: [{ type: "image" }, { type: "video" }] },
        { tag: "el-two", handles: [{ type: "link" }] },
      ];
      const matches = HAXStore.guessGizmo("*", {}, true);
      expect(matches.length).to.equal(2);
    });

    it("ignores gizmo entries without handles", () => {
      HAXStore.gizmoList = [{ tag: "no-handles" }, null];
      expect(
        HAXStore.guessGizmo("image", { source: "a.jpg" }, true),
      ).to.deep.equal([]);
    });
  });

  describe("insertLogicFromValues", () => {
    beforeEach(() => {
      stash("validGizmoTypes");
      stash("gizmoList");
      stash("activePlaceHolder");
      stash("activeNode");
      stash("activePlaceHolderOperationType");
      stash("haxAppPicker");
      stash("toast");
      HAXStore.validGizmoTypes = ["image", "video", "audio", "link", "*"];
      HAXStore.gizmoList = [];
      HAXStore.activePlaceHolder = null;
      HAXStore.activeNode = null;
      HAXStore.activePlaceHolderOperationType = null;
      HAXStore.haxAppPicker = { presentOptions: () => {} };
      HAXStore.toast = () => {};
    });

    it("toasts and returns false for upload-only operations", () => {
      const toasts = [];
      HAXStore.toast = (msg) => toasts.push(msg);
      HAXStore.activePlaceHolderOperationType = "upload-only";
      expect(HAXStore.insertLogicFromValues({}, null)).to.equal(false);
      expect(toasts[0]).to.equal("Upload successful!");
      // suspected source bug: the upload-only early return (hax-store.js
      // line ~301-304) exits before the activePlaceHolderOperationType reset
      // at line ~310, so the operation type leaks into the next insert.
      // Asserting current behavior; reported to the lead rather than fixed.
      expect(HAXStore.activePlaceHolderOperationType).to.equal("upload-only");
    });

    it("returns false for wildcard type when failOnAnything", () => {
      expect(
        HAXStore.insertLogicFromValues({ source: "x" }, null, true),
      ).to.equal(false);
    });

    it("drops an image into the active image-gallery", () => {
      const host = globalThis.document.createElement("div");
      const gallery = globalThis.document.createElement("image-gallery");
      const ph = globalThis.document.createElement("p");
      gallery.appendChild(ph);
      host.appendChild(gallery);
      HAXStore.activePlaceHolder = ph;
      const calls = [];
      HAXStore._addImageToImageGallery = (el, src) => {
        calls.push([el, src]);
        return true;
      };
      const result = HAXStore.insertLogicFromValues(
        { source: "files/a.jpg" },
        globalThis.document.createElement("div"),
      );
      expect(result).to.equal(true);
      expect(calls.length).to.equal(1);
      expect(calls[0][0]).to.equal(gallery);
      expect(calls[0][1]).to.equal("files/a.jpg");
      delete HAXStore._addImageToImageGallery;
    });

    it("drops an image into the gallery based on the activeNode", () => {
      const host = globalThis.document.createElement("div");
      const gallery = globalThis.document.createElement("image-gallery");
      const node = globalThis.document.createElement("p");
      gallery.appendChild(node);
      host.appendChild(gallery);
      HAXStore.activeNode = node;
      const calls = [];
      HAXStore._addImageToImageGallery = (el, src) => {
        calls.push([el, src]);
        return true;
      };
      const result = HAXStore.insertLogicFromValues(
        { source: "files/a.jpg" },
        globalThis.document.createElement("div"),
      );
      expect(result).to.equal(true);
      expect(calls.length).to.equal(1);
      delete HAXStore._addImageToImageGallery;
    });

    it("replaces an image in place when the placeholder is an image", () => {
      const host = globalThis.document.createElement("div");
      const img = globalThis.document.createElement("media-image");
      img.setAttribute("source", "files/old.jpg");
      host.appendChild(img);
      HAXStore.activePlaceHolder = img;
      const calls = [];
      HAXStore._replaceImageInPlace = (target, values) => {
        calls.push([target, values]);
        return true;
      };
      const result = HAXStore.insertLogicFromValues(
        { source: "files/new.jpg" },
        globalThis.document.createElement("div"),
      );
      expect(result).to.equal(true);
      expect(calls.length).to.equal(1);
      expect(calls[0][0]).to.equal(img);
      delete HAXStore._replaceImageInPlace;
    });

    it("adds an image to a play-list container", () => {
      const host = globalThis.document.createElement("div");
      const playList = globalThis.document.createElement("play-list");
      const ph = globalThis.document.createElement("p");
      playList.appendChild(ph);
      host.appendChild(playList);
      HAXStore.activePlaceHolder = ph;
      const calls = [];
      HAXStore._addImageToPlayList = (el, src) => {
        calls.push([el, src]);
        return true;
      };
      const result = HAXStore.insertLogicFromValues(
        { source: "files/a.jpg" },
        globalThis.document.createElement("div"),
      );
      expect(result).to.equal(true);
      expect(calls.length).to.equal(1);
      expect(calls[0][0]).to.equal(playList);
      delete HAXStore._addImageToPlayList;
    });

    it("adds audio into an existing media-playlist", () => {
      const host = globalThis.document.createElement("div");
      const playlist = globalThis.document.createElement("media-playlist");
      const ph = globalThis.document.createElement("p");
      playlist.appendChild(ph);
      host.appendChild(playlist);
      HAXStore.activePlaceHolder = ph;
      const calls = [];
      HAXStore._addMediaToMediaPlaylist = (pl, media) => {
        calls.push([pl, media]);
        return true;
      };
      const result = HAXStore.insertLogicFromValues(
        { source: "files/a.mp3", title: "Song" },
        globalThis.document.createElement("div"),
      );
      expect(result).to.equal(true);
      expect(calls.length).to.equal(1);
      expect(calls[0][0]).to.equal(playlist);
      expect(calls[0][1].tagName).to.equal("AUDIO-PLAYER");
      expect(calls[0][1].mediaTitle).to.equal("Song");
      delete HAXStore._addMediaToMediaPlaylist;
    });

    it("wraps a video-player active node into a media-playlist", () => {
      const player = globalThis.document.createElement("video-player");
      globalThis.document.body.appendChild(player);
      HAXStore.activeNode = player;
      const calls = [];
      HAXStore._createMediaPlaylist = (player2, media) => {
        calls.push([player2, media]);
        return true;
      };
      const result = HAXStore.insertLogicFromValues(
        { source: "files/a.mp4" },
        globalThis.document.createElement("div"),
      );
      expect(result).to.equal(true);
      expect(calls.length).to.equal(1);
      expect(calls[0][0]).to.equal(player);
      expect(calls[0][1].tagName).to.equal("VIDEO-PLAYER");
      player.remove();
      delete HAXStore._createMediaPlaylist;
    });

    it("dispatches hax-insert-content for a single matched element", async () => {
      HAXStore.gizmoList = [
        { tag: "video-player", handles: [{ type: "video", source: "source" }] },
      ];
      // keep the context detached so the bubbling event does not hit the
      // connected store singleton and its _haxStoreInsertContent wiring
      const context = globalThis.document.createElement("div");
      const listener = oneEvent(context, "hax-insert-content");
      const result = HAXStore.insertLogicFromValues(
        { source: "files/a.mp4" },
        context,
      );
      expect(result).to.equal(true);
      const e = await listener;
      expect(e.detail.tag).to.equal("video-player");
      expect(e.detail.properties.source).to.equal("files/a.mp4");
    });

    it("links multiple matches when linkOnMultiple", async () => {
      HAXStore.gizmoList = [
        { tag: "a", handles: [{ type: "link", source: "href" }] },
        { tag: "video-player", handles: [{ type: "link", source: "source" }] },
      ];
      const context = globalThis.document.createElement("div");
      const listener = oneEvent(context, "hax-insert-content");
      const result = HAXStore.insertLogicFromValues(
        { source: "https://example.com" },
        context,
        false,
        true,
      );
      expect(result).to.equal(true);
      const e = await listener;
      expect(e.detail.tag).to.equal("a");
    });

    it("hands multiple matches to the app picker when not linking", () => {
      HAXStore.gizmoList = [
        { tag: "el-one", handles: [{ type: "video", source: "source" }] },
        { tag: "el-two", handles: [{ type: "video", source: "source" }] },
      ];
      const presented = [];
      HAXStore.haxAppPicker = {
        presentOptions: (...args) => presented.push(args),
      };
      const result = HAXStore.insertLogicFromValues(
        { source: "files/a.mp4" },
        globalThis.document.createElement("div"),
      );
      expect(result).to.equal(true);
      expect(presented.length).to.equal(1);
      expect(presented[0][1]).to.equal("video");
      expect(presented[0][2]).to.contain("Pick how to present this");
    });

    it("toasts an apology when nothing matches", () => {
      const toasts = [];
      HAXStore.toast = (msg) => toasts.push(msg);
      const result = HAXStore.insertLogicFromValues(
        { source: "weird" },
        globalThis.document.createElement("div"),
      );
      expect(result).to.equal(false);
      expect(toasts[0]).to.contain("doesn't know how to handle");
    });
  });

  describe("applyFileUploadTransform", () => {
    let originalHas, originalCall;
    beforeEach(() => {
      originalHas = MicroFrontendRegistry.has;
      originalCall = MicroFrontendRegistry.call;
      stash("activePlaceHolderOperationType");
      stash("gizmoList");
      stash("validGizmoTypes");
      stash("toast");
      HAXStore.gizmoList = [];
      HAXStore.validGizmoTypes = ["pptx"];
      HAXStore.activePlaceHolderOperationType = null;
      HAXStore.toast = () => {};
      MicroFrontendRegistry.has = () => false;
      MicroFrontendRegistry.call = async () => ({});
    });
    afterEach(() => {
      MicroFrontendRegistry.has = originalHas;
      MicroFrontendRegistry.call = originalCall;
    });

    function makeEvent(response) {
      return { detail: { xhr: { response: JSON.stringify(response) } } };
    }

    it("returns early for missing event parts", async () => {
      expect(await HAXStore.applyFileUploadTransform(null, {})).to.equal(
        undefined,
      );
      expect(await HAXStore.applyFileUploadTransform({}, null)).to.equal(
        undefined,
      );
      expect(await HAXStore.applyFileUploadTransform({}, {})).to.equal(
        undefined,
      );
      expect(
        await HAXStore.applyFileUploadTransform(
          { detail: { xhr: { response: "not json" } } },
          { shadowRoot: { querySelector: () => ({ value: "x.pptx" }) } },
        ),
      ).to.equal(undefined);
    });

    it("returns early without a #url field in the context shadowRoot", async () => {
      const context = { shadowRoot: { querySelector: () => null } };
      expect(
        await HAXStore.applyFileUploadTransform(
          makeEvent({ file: 1 }),
          context,
        ),
      ).to.equal(undefined);
    });

    it("returns early for a wildcard gizmo type", async () => {
      const context = {
        shadowRoot: { querySelector: () => ({ value: "weird" }) },
      };
      HAXStore.validGizmoTypes = ["*"];
      expect(
        await HAXStore.applyFileUploadTransform(makeEvent({}), context),
      ).to.equal(undefined);
    });

    it("returns early when no candidate gizmo matches", async () => {
      const context = {
        shadowRoot: { querySelector: () => ({ value: "a.pptx" }) },
      };
      expect(
        await HAXStore.applyFileUploadTransform(makeEvent({}), context),
      ).to.equal(undefined);
    });

    it("returns early when the candidate tag is not a registered element", async () => {
      HAXStore.gizmoList = [
        {
          tag: "totally-unregistered-el",
          handles: [{ type: "pptx", source: "source" }],
        },
      ];
      const context = {
        shadowRoot: { querySelector: () => ({ value: "a.pptx" }) },
      };
      expect(
        await HAXStore.applyFileUploadTransform(makeEvent({}), context),
      ).to.equal(undefined);
    });

    it("maps a successful transform onto #url and pins the operation type", async () => {
      class XUploadEl extends globalThis.HTMLElement {
        haxHooks() {
          return { processFileUpload: "processFileUploadImpl" };
        }
        processFileUploadImpl() {
          return {
            fileUuid: "uuid-1",
            operation: "convert",
            valueMapping: "data.manifest",
          };
        }
      }
      if (!globalThis.customElements.get("x-upload-transform-el")) {
        globalThis.customElements.define("x-upload-transform-el", XUploadEl);
      }
      HAXStore.gizmoList = [
        {
          tag: "x-upload-transform-el",
          handles: [{ type: "pptx", source: "source" }],
        },
      ];
      const urlEl = { value: "files/deck.pptx" };
      const context = { shadowRoot: { querySelector: () => urlEl } };
      MicroFrontendRegistry.has = (op) => op === "@site/updateFileByUuid";
      MicroFrontendRegistry.call = async () => ({
        status: 200,
        data: { manifest: "files/deck.json" },
      });
      await HAXStore.applyFileUploadTransform(
        makeEvent({ uuid: "uuid-1" }),
        context,
      );
      expect(urlEl.value).to.equal("files/deck.json");
      expect(HAXStore.activePlaceHolderOperationType).to.equal("pptx");
    });

    it("falls back to the transform fallbackType when the op fails", async () => {
      class XUploadFallbackEl extends globalThis.HTMLElement {
        haxHooks() {
          return { processFileUpload: "processFileUploadImpl" };
        }
        processFileUploadImpl() {
          return {
            fileUuid: "uuid-2",
            operation: "convert",
            fallbackType: "document",
          };
        }
      }
      if (!globalThis.customElements.get("x-upload-fallback-el")) {
        globalThis.customElements.define(
          "x-upload-fallback-el",
          XUploadFallbackEl,
        );
      }
      HAXStore.gizmoList = [
        {
          tag: "x-upload-fallback-el",
          handles: [{ type: "pptx", source: "source" }],
        },
      ];
      const toasts = [];
      HAXStore.toast = (msg) => toasts.push(msg);
      const urlEl = { value: "files/deck.pptx" };
      const context = { shadowRoot: { querySelector: () => urlEl } };
      MicroFrontendRegistry.has = () => true;
      MicroFrontendRegistry.call = async () => ({ status: 500 });
      await HAXStore.applyFileUploadTransform(
        makeEvent({ uuid: "uuid-2" }),
        context,
      );
      expect(urlEl.value).to.equal("files/deck.pptx");
      expect(HAXStore.activePlaceHolderOperationType).to.equal("document");
      expect(toasts[0]).to.contain("transform failed");
    });

    it("leaves #url alone when the transform result cannot be mapped", async () => {
      class XUploadNoMapEl extends globalThis.HTMLElement {
        haxHooks() {
          return { processFileUpload: "processFileUploadImpl" };
        }
        processFileUploadImpl() {
          return { fileUuid: "uuid-3", operation: "convert" };
        }
      }
      if (!globalThis.customElements.get("x-upload-nomap-el")) {
        globalThis.customElements.define("x-upload-nomap-el", XUploadNoMapEl);
      }
      HAXStore.gizmoList = [
        {
          tag: "x-upload-nomap-el",
          handles: [{ type: "pptx", source: "source" }],
        },
      ];
      const urlEl = { value: "files/deck.pptx" };
      const context = { shadowRoot: { querySelector: () => urlEl } };
      MicroFrontendRegistry.has = () => true;
      MicroFrontendRegistry.call = async () => ({ status: 200 });
      await HAXStore.applyFileUploadTransform(
        makeEvent({ uuid: "uuid-3" }),
        context,
      );
      expect(urlEl.value).to.equal("files/deck.pptx");
      expect(HAXStore.activePlaceHolderOperationType).to.equal(null);
    });
  });

  describe("_waitForSiteOp", () => {
    let originalHas;
    beforeEach(() => {
      originalHas = MicroFrontendRegistry.has;
    });
    afterEach(() => {
      MicroFrontendRegistry.has = originalHas;
    });

    it("resolves true immediately when the operation is registered", async () => {
      MicroFrontendRegistry.has = (op) => op === "@site/updateFileByUuid";
      expect(await HAXStore._waitForSiteOp("@site/updateFileByUuid")).to.equal(
        true,
      );
    });

    it("resolves false after the timeout when never registered", async () => {
      MicroFrontendRegistry.has = () => false;
      expect(
        await HAXStore._waitForSiteOp("@site/updateFileByUuid", 120),
      ).to.equal(false);
    });
  });

  describe("image and media gallery helpers", () => {
    beforeEach(() => {
      stash("activeHaxBody");
      stash("activePlaceHolder");
      stash("activeNode");
      HAXStore.activePlaceHolder = null;
      HAXStore.activeNode = null;
    });

    it("_isImageElement honors schema gizmo tags that include image", () => {
      stash("elementList");
      HAXStore.elementList = {
        "schema-image-el": { gizmo: { tags: ["Image"] } },
        "schema-other-el": { gizmo: { tags: ["video"] } },
      };
      expect(
        HAXStore._isImageElement(
          globalThis.document.createElement("schema-image-el"),
        ),
      ).to.equal(true);
      expect(
        HAXStore._isImageElement(
          globalThis.document.createElement("schema-other-el"),
        ),
      ).to.equal(false);
    });

    it("_isMediaElement honors schema gizmo tags for media", () => {
      stash("elementList");
      HAXStore.elementList = {
        "schema-media-el": { gizmo: { tags: ["Video"] } },
        "schema-media2-el": { gizmo: { tags: ["audio"] } },
        "schema-media3-el": { gizmo: { tags: ["media"] } },
        "schema-notmedia-el": { gizmo: { tags: ["image"] } },
      };
      expect(
        HAXStore._isMediaElement(
          globalThis.document.createElement("schema-media-el"),
        ),
      ).to.equal(true);
      expect(
        HAXStore._isMediaElement(
          globalThis.document.createElement("schema-media2-el"),
        ),
      ).to.equal(true);
      expect(
        HAXStore._isMediaElement(
          globalThis.document.createElement("schema-media3-el"),
        ),
      ).to.equal(true);
      expect(
        HAXStore._isMediaElement(
          globalThis.document.createElement("schema-notmedia-el"),
        ),
      ).to.equal(false);
    });

    it("_createImageGallery wraps the original image and the new one", () => {
      const host = globalThis.document.createElement("div");
      const original = globalThis.document.createElement("media-image");
      original.setAttribute("slot", "col-1");
      original.card = true;
      host.appendChild(original);
      const replaced = [];
      HAXStore.activeHaxBody = {
        haxReplaceNode: (oldNode, newNode) => {
          replaced.push([oldNode, newNode]);
        },
      };
      HAXStore._createImageGallery(original, "files/new.jpg");
      expect(replaced.length).to.equal(1);
      const gallery = replaced[0][1];
      expect(gallery.tagName).to.equal("IMAGE-GALLERY");
      expect(gallery.getAttribute("slot")).to.equal("col-1");
      expect(gallery.querySelectorAll("media-image").length).to.equal(2);
      expect(HAXStore.activeNode).to.equal(gallery);
      expect(HAXStore.activePlaceHolder).to.equal(null);
    });

    it("_createImageGallery removes a leftover p placeholder", () => {
      const host = globalThis.document.createElement("div");
      const original = globalThis.document.createElement("img");
      host.appendChild(original);
      const tmpP = globalThis.document.createElement("p");
      host.appendChild(tmpP);
      HAXStore.activePlaceHolder = tmpP;
      HAXStore.activeHaxBody = {
        haxReplaceNode: () => {},
      };
      HAXStore._createImageGallery(original, "files/new.jpg");
      expect(host.querySelector("p")).to.equal(null);
    });

    it("_addImageToPlayList copies styling props from the first image", () => {
      const host = globalThis.document.createElement("div");
      const playList = globalThis.document.createElement("play-list");
      const first = globalThis.document.createElement("media-image");
      first.card = true;
      playList.appendChild(first);
      host.appendChild(playList);
      HAXStore.activePlaceHolder = null;
      HAXStore._addImageToPlayList(playList, "files/new.jpg");
      const added = playList.querySelectorAll("media-image")[1];
      expect(added.card).to.equal(true);
      expect(added.source).to.equal("files/new.jpg");
      expect(HAXStore.activeNode).to.equal(playList);
    });

    it("_addImageToImageGallery appends the new image and clears the placeholder", () => {
      const host = globalThis.document.createElement("div");
      const gallery = globalThis.document.createElement("image-gallery");
      host.appendChild(gallery);
      const tmpP = globalThis.document.createElement("p");
      host.appendChild(tmpP);
      HAXStore.activePlaceHolder = tmpP;
      HAXStore._addImageToImageGallery(gallery, "files/new.jpg");
      expect(gallery.querySelectorAll("media-image").length).to.equal(1);
      expect(host.querySelector("p")).to.equal(null);
      expect(HAXStore.activeNode).to.equal(gallery);
    });

    it("_createMediaPlaylist wraps the original player and the new media", () => {
      const host = globalThis.document.createElement("div");
      const player = globalThis.document.createElement("video-player");
      player.setAttribute("slot", "col-2");
      host.appendChild(player);
      const replaced = [];
      HAXStore.activeHaxBody = {
        haxReplaceNode: (oldNode, newNode) => {
          replaced.push([oldNode, newNode]);
        },
      };
      const newMedia = globalThis.document.createElement("video-player");
      HAXStore._createMediaPlaylist(player, newMedia);
      expect(replaced.length).to.equal(1);
      const playlist = replaced[0][1];
      expect(playlist.tagName).to.equal("MEDIA-PLAYLIST");
      expect(playlist.getAttribute("slot")).to.equal("col-2");
      expect(playlist.children.length).to.equal(2);
      expect(HAXStore.activeNode).to.equal(playlist);
    });

    it("_addMediaToMediaPlaylist appends and clears the placeholder", () => {
      const host = globalThis.document.createElement("div");
      const playlist = globalThis.document.createElement("media-playlist");
      host.appendChild(playlist);
      const tmpP = globalThis.document.createElement("p");
      host.appendChild(tmpP);
      HAXStore.activePlaceHolder = tmpP;
      const media = globalThis.document.createElement("audio-player");
      HAXStore._addMediaToMediaPlaylist(playlist, media);
      expect(playlist.children.length).to.equal(1);
      expect(playlist.children[0]).to.equal(media);
      expect(host.querySelector("p")).to.equal(null);
      expect(HAXStore.activeNode).to.equal(playlist);
    });

    it("_createSingleImageGallery inserts a configured play-list", () => {
      const inserted = [];
      HAXStore.activeHaxBody = {
        haxInsert: (tag, content, props) => {
          inserted.push([tag, content, props]);
        },
      };
      HAXStore._createSingleImageGallery("files/a.jpg");
      expect(inserted.length).to.equal(1);
      expect(inserted[0][0]).to.equal("play-list");
      expect(inserted[0][2].pagination).to.equal(true);
      expect(inserted[0][2].loop).to.equal(true);
      // media-image is not a registered custom element in this harness so
      // source is set as a property and does not serialize into innerHTML;
      // assert the gallery carries a media-image child element instead
      expect(inserted[0][1]).to.contain("media-image");
    });
  });
});

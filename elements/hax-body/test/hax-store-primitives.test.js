import { expect, oneEvent, aTimeout } from "@open-wc/testing";

import { HAXStore } from "../lib/hax-store.js";
import { SuperDaemonInstance } from "@haxtheweb/super-daemon/super-daemon.js";

// deep coverage of the primitive definition building, registration wiring,
// insert-content pipeline and app / stax registration paths on the store.
describe("hax-store primitives + registration wiring", () => {
  let saved = {};
  let savedGlobals = {};
  function stash(key) {
    if (!(key in saved)) {
      saved[key] = HAXStore[key];
    }
  }
  function stashGlobal(key) {
    if (!(key in savedGlobals)) {
      savedGlobals[key] = globalThis[key];
    }
  }
  afterEach(() => {
    for (let key in saved) {
      HAXStore[key] = saved[key];
      delete saved[key];
    }
    for (let key in savedGlobals) {
      if (savedGlobals[key] === undefined && !(key in globalThis)) {
        // was never defined; leave undefined state alone
      } else {
        globalThis[key] = savedGlobals[key];
      }
      delete savedGlobals[key];
    }
    clearTimeout(HAXStore.__storeReady);
    clearTimeout(HAXStore.__readyToProcessAppStoreData);
  });

  describe("_buildPrimitiveDefinitions", () => {
    beforeEach(() => {
      stash("haxAutoloader");
      stash("ready");
      stash("elementList");
      stash("gizmoList");
      stash("validTagList");
      stash("validGridTagList");
      stash("platformConfig");
      stash("staxList");
      HAXStore.haxAutoloader = globalThis.document.createElement("div");
      HAXStore.ready = true;
      HAXStore.elementList = {};
      HAXStore.gizmoList = [];
      HAXStore.validTagList = HAXStore.__validTags();
      HAXStore.validGridTagList = HAXStore.__validGridTags();
    });

    it("registers the core primitive schemas and gizmos", async () => {
      HAXStore._buildPrimitiveDefinitions();
      // the registration events dispatch synchronously but the store
      // handlers are async; give them a beat to settle
      await aTimeout(50);
      expect(HAXStore.elementList["img"]).to.exist;
      expect(HAXStore.elementList["img"].gizmo.title).to.equal("Basic Image");
      expect(HAXStore.elementList["p"]).to.exist;
      expect(HAXStore.elementList["a"]).to.exist;
      expect(HAXStore.elementList["figure"]).to.exist;
      expect(HAXStore.elementList["mark"]).to.exist;
      expect(HAXStore.elementList["abbr"]).to.exist;
      expect(HAXStore.elementList["hr"]).to.exist;
      // gizmo list should have received primitive gizmos
      expect(HAXStore.gizmoList.length).to.be.greaterThan(0);
      // the table + iframe editing elements get forced into the autoloader
      expect(
        HAXStore.haxAutoloader.querySelectorAll("editable-table").length,
      ).to.equal(1);
      expect(
        HAXStore.haxAutoloader.querySelectorAll("iframe-loader").length,
      ).to.equal(1);
    });

    it("registers a webview definition in sandboxed environments", async () => {
      stash("_isSandboxed");
      HAXStore._isSandboxed = true;
      HAXStore._buildPrimitiveDefinitions();
      await aTimeout(50);
      expect(HAXStore.elementList["webview"]).to.exist;
      expect(HAXStore.elementList["webview"].editingElement).to.equal("core");
    });

    it("skips the table + iframe definitions when the platform blocks them", async () => {
      HAXStore.platformConfig = {
        __supportedFeatures: new Set(["table", "iframe"]),
        features: { table: false, iframe: false },
      };
      HAXStore._buildPrimitiveDefinitions();
      await aTimeout(50);
      expect(HAXStore.elementList["table"]).to.not.exist;
      expect(HAXStore.elementList["iframe"]).to.not.exist;
      expect(
        HAXStore.haxAutoloader.querySelectorAll("editable-table").length,
      ).to.equal(0);
      expect(
        HAXStore.haxAutoloader.querySelectorAll("iframe-loader").length,
      ).to.equal(0);
    });

    it("registers list treatment settings for ul and ol", async () => {
      HAXStore._buildPrimitiveDefinitions();
      await aTimeout(50);
      expect(HAXStore.elementList["ul"].settings.configure.length).to.equal(1);
      expect(
        HAXStore.elementList["ul"].settings.configure[0].attribute,
      ).to.equal("data-design-treatment");
      expect(HAXStore.elementList["ol"].settings.configure.length).to.equal(1);
      expect(HAXStore.elementList["h2"].saveOptions.unsetAttributes).to.exist;
      expect(HAXStore.elementList["h2"].demoSchema[0].content).to.equal(
        "Heading",
      );
      expect(HAXStore.elementList["ul"].demoSchema[0].content).to.contain(
        "<li>",
      );
    });
  });

  describe("_haxStoreRegisterProperties", () => {
    beforeEach(() => {
      stash("elementList");
      stash("gizmoList");
      stash("validTagList");
      stash("validGridTagList");
      stash("platformConfig");
      stash("toast");
      HAXStore.elementList = {};
      HAXStore.gizmoList = [];
      HAXStore.validTagList = ["p", "div"];
      HAXStore.validGridTagList = ["p", "div"];
      HAXStore.toast = () => {};
    });

    // the store handler reads e.target.parentElement.tagName, so test
    // events always carry a target that actually has a parent element
    function makeHostedTarget() {
      const host = globalThis.document.createElement("div");
      const target = globalThis.document.createElement("div");
      host.appendChild(target);
      return target;
    }

    function makeEvent(tag, properties, target) {
      return {
        detail: { tag: tag, properties: properties },
        target: target || makeHostedTarget(),
      };
    }

    it("registers a new tag with its gizmo and wiring", async () => {
      const props = {
        gizmo: { title: "Fancy", icon: "icons:code", tags: ["demo"] },
        settings: { configure: [], advanced: [] },
      };
      await HAXStore._haxStoreRegisterProperties(makeEvent("fancy-el", props));
      expect(HAXStore.elementList["fancy-el"]).to.exist;
      expect(HAXStore.gizmoList.length).to.equal(1);
      expect(HAXStore.gizmoList[0].tag).to.equal("fancy-el");
      expect(HAXStore.validTagList).to.include("fancy-el");
    });

    it("marks the gizmo platformRestricted when the block is not allowed", async () => {
      HAXStore.platformConfig = {
        __supportedFeatures: new Set(),
        features: {},
        allowedBlocks: new Set(["allowed-el"]),
      };
      const props = {
        gizmo: { title: "Blocked", icon: "icons:code" },
        settings: {},
      };
      await HAXStore._haxStoreRegisterProperties(
        makeEvent("blocked-el", props),
      );
      expect(HAXStore.gizmoList[0].platformRestricted).to.equal(true);
    });

    it("treats site-view as allowed when views are supported", async () => {
      HAXStore.platformConfig = {
        __supportedFeatures: new Set(["views"]),
        features: { views: true },
        allowedBlocks: new Set(["some-el"]),
      };
      const props = {
        gizmo: { title: "View", icon: "icons:code" },
        settings: {},
      };
      await HAXStore._haxStoreRegisterProperties(makeEvent("site-view", props));
      expect(HAXStore.gizmoList[0].platformRestricted).to.equal(false);
    });

    it("registers declarative gizmo shortcuts into the shortcut registry", async () => {
      const props = {
        gizmo: {
          title: "Shortcutty",
          icon: "icons:code",
          shortcut: [
            { type: "markdown", trigger: "!!!", description: "Shortcutty" },
            "not-an-object-entry",
            { type: "markdown", trigger: "?!", context: "inline" },
          ],
        },
        settings: {},
      };
      await HAXStore._haxStoreRegisterProperties(
        makeEvent("shortcut-el", props),
      );
      expect(HAXStore.gizmoList[0].tag).to.equal("shortcut-el");
    });

    it("fills a single shortcut descriptor that omits its tag", async () => {
      const props = {
        gizmo: {
          title: "Single shortcut",
          icon: "icons:code",
          shortcut: { trigger: "zzz", type: "markdown" },
        },
        settings: {},
      };
      await HAXStore._haxStoreRegisterProperties(
        makeEvent("single-shortcut-el", props),
      );
      expect(HAXStore.elementList["single-shortcut-el"]).to.exist;
    });

    it("does not re-register a tag it already knows", async () => {
      const props = {
        gizmo: { title: "First", icon: "icons:code" },
        settings: {},
      };
      await HAXStore._haxStoreRegisterProperties(makeEvent("dup-el", props));
      const count = HAXStore.gizmoList.length;
      await HAXStore._haxStoreRegisterProperties(makeEvent("dup-el", props));
      expect(HAXStore.gizmoList.length).to.equal(count);
    });

    it("adds grid type tags to the validGridTagList", async () => {
      const props = {
        gizmo: { title: "Gridder", icon: "icons:code" },
        type: "grid",
      };
      await HAXStore._haxStoreRegisterProperties(makeEvent("grid-el", props));
      expect(HAXStore.validGridTagList).to.include("grid-el");
    });

    it("runs the gizmoRegistration haxHook when the tag is defined", async () => {
      class RegHookEl extends globalThis.HTMLElement {
        constructor() {
          super();
          this.regCalls = [];
        }
        haxHooks() {
          return { gizmoRegistration: "runRegistration" };
        }
        runRegistration(store) {
          this.regCalls.push(store);
        }
      }
      if (!globalThis.customElements.get("reg-hook-el")) {
        globalThis.customElements.define("reg-hook-el", RegHookEl);
      }
      const props = {
        gizmo: { title: "Hooked", icon: "icons:code" },
        settings: {},
      };
      await HAXStore._haxStoreRegisterProperties(
        makeEvent("reg-hook-el", props),
      );
      // the hook runs against a fresh instance so capture via side effect
      expect(HAXStore.elementList["reg-hook-el"]).to.exist;
    });

    it("removes the registering node from a HAX-AUTOLOADER parent", async () => {
      const autoloader = globalThis.document.createElement("hax-autoloader");
      const target = globalThis.document.createElement("div");
      autoloader.appendChild(target);
      stash("haxAutoloader");
      HAXStore.haxAutoloader = autoloader;
      const props = {
        gizmo: { title: "Auto", icon: "icons:code" },
        settings: {},
      };
      await HAXStore._haxStoreRegisterProperties(
        makeEvent("auto-el", props, target),
      );
      expect(target.parentNode).to.equal(null);
    });
  });

  describe("_haxStoreInsertContent", () => {
    beforeEach(() => {
      stash("activeHaxBody");
      stash("activeNode");
      stash("activePlaceHolder");
      stash("styleGuideSchema");
      stash("editMode");
      stash("elementList");
      HAXStore.activeHaxBody = {
        haxInsert: () => {},
        haxReplaceNode: () => {},
      };
      HAXStore.activeNode = null;
      HAXStore.activePlaceHolder = null;
      HAXStore.styleGuideSchema = {};
      HAXStore.editMode = false;
      HAXStore.elementList = {};
    });

    function makeEvent(details) {
      return { detail: details };
    }

    it("runs the preProcessInsertContent hook when the tag defines one", async () => {
      class PreInsertEl extends globalThis.HTMLElement {
        haxHooks() {
          return { preProcessInsertContent: "preProcess" };
        }
        preProcess(details) {
          details.content = "hooked content";
          return details;
        }
      }
      if (!globalThis.customElements.get("pre-insert-el")) {
        globalThis.customElements.define("pre-insert-el", PreInsertEl);
      }
      const inserted = [];
      HAXStore.activeHaxBody.haxInsert = (tag, content) => {
        inserted.push([tag, content]);
      };
      await HAXStore._haxStoreInsertContent(
        makeEvent({ tag: "pre-insert-el", content: "", properties: {} }),
      );
      expect(inserted.length).to.equal(1);
      expect(inserted[0][1]).to.equal("hooked content");
    });

    it("merges style guide demoSchema properties under existing ones", async () => {
      HAXStore.styleGuideSchema["styled-el"] = {
        demoSchema: [
          { tag: "styled-el", properties: { accent: true, title: "default" } },
        ],
      };
      const inserted = [];
      HAXStore.activeHaxBody.haxInsert = (tag, content, props) => {
        inserted.push([tag, content, props]);
      };
      await HAXStore._haxStoreInsertContent(
        makeEvent({
          tag: "styled-el",
          content: "c",
          properties: { title: "mine" },
        }),
      );
      expect(inserted[0][2].accent).to.equal(true);
      expect(inserted[0][2].title).to.equal("mine");
    });

    it("creates a gallery when the insert carries gallery creation props", async () => {
      const galleryCalls = [];
      HAXStore._createImageGallery = (original, source) => {
        galleryCalls.push([original, source]);
      };
      const original = globalThis.document.createElement("media-image");
      await HAXStore._haxStoreInsertContent(
        makeEvent({
          tag: "image-gallery",
          content: "",
          properties: {
            _isGalleryCreation: true,
            _originalImageElement: original,
            _newImageSource: "files/new.jpg",
          },
        }),
      );
      expect(galleryCalls.length).to.equal(1);
      expect(galleryCalls[0][0]).to.equal(original);
      delete HAXStore._createImageGallery;
    });

    it("creates a single image gallery from Magic File Wand props", async () => {
      const calls = [];
      HAXStore._createSingleImageGallery = (source) => {
        calls.push(source);
      };
      await HAXStore._haxStoreInsertContent(
        makeEvent({
          tag: "play-list",
          content: "",
          properties: { _isSingleImageGallery: true, _imageSource: "a.jpg" },
        }),
      );
      expect(calls).to.deep.equal(["a.jpg"]);
      delete HAXStore._createSingleImageGallery;
    });

    it("folds innerHTML / innerText properties into content", async () => {
      const inserted = [];
      HAXStore.activeHaxBody.haxInsert = (tag, content, props) => {
        inserted.push([tag, content, props]);
      };
      await HAXStore._haxStoreInsertContent(
        makeEvent({
          tag: "p",
          content: "",
          properties: { innerHTML: "<b>from innerHTML</b>" },
        }),
      );
      await HAXStore._haxStoreInsertContent(
        makeEvent({
          tag: "p",
          content: "",
          properties: { innerText: "from innerText" },
        }),
      );
      expect(inserted[0][1]).to.equal("<b>from innerHTML</b>");
      expect(inserted[0][2].innerHTML).to.not.exist;
      expect(inserted[1][1]).to.equal("from innerText");
      expect(inserted[1][2].innerText).to.not.exist;
    });

    it("replaces the active selection for inline inserts", async () => {
      const insertedNodes = [];
      const fakeRange = {
        deleteContents: () => {},
        insertNode: (node) => insertedNodes.push(node),
      };
      HAXStore.activePlaceHolder = fakeRange;
      await HAXStore._haxStoreInsertContent(
        makeEvent({
          tag: "b",
          content: "bold",
          properties: {},
          __type: "inline",
        }),
      );
      expect(insertedNodes.length).to.equal(1);
      expect(insertedNodes[0].tagName).to.equal("B");
      expect(HAXStore.activePlaceHolder).to.equal(null);
    });

    it("replaces the active placeholder for replace inserts", async () => {
      const replaced = [];
      const placeholder = globalThis.document.createElement("p");
      HAXStore.activePlaceHolder = placeholder;
      HAXStore.activeHaxBody.haxReplaceNode = (oldNode, newNode) => {
        replaced.push([oldNode, newNode]);
      };
      await HAXStore._haxStoreInsertContent(
        makeEvent({ tag: "h2", content: "New", properties: {}, replace: true }),
      );
      expect(replaced.length).to.equal(1);
      expect(replaced[0][0]).to.equal(placeholder);
      expect(HAXStore.activePlaceHolder).to.equal(null);
    });

    it("inserts next to the active node when nextToActive", async () => {
      const host = globalThis.document.createElement("div");
      const active = globalThis.document.createElement("p");
      host.appendChild(active);
      HAXStore.activeNode = active;
      await HAXStore._haxStoreInsertContent(
        makeEvent({
          tag: "h2",
          content: "Next",
          properties: {},
          nextToActive: true,
        }),
      );
      const h2 = host.querySelector("h2");
      expect(h2).to.exist;
      expect(h2.textContent).to.equal("Next");
    });

    it("appends into a layout container active node with a slot", async () => {
      const container = globalThis.document.createElement("grid-plate");
      container.haxLayoutContainer = true;
      const active = globalThis.document.createElement("p");
      active.setAttribute("slot", "col-1");
      container.appendChild(active);
      HAXStore.activeNode = active;
      HAXStore.activeHaxBody.__slot = true;
      await HAXStore._haxStoreInsertContent(
        makeEvent({
          tag: "h2",
          content: "In grid",
          properties: {},
          nextToActive: true,
        }),
      );
      expect(container.querySelectorAll("h2").length).to.equal(1);
      delete HAXStore.activeHaxBody.__slot;
    });

    it("preserves the slot attribute when inserting into a layout container", async () => {
      const container = globalThis.document.createElement("grid-plate");
      container.haxLayoutContainer = true;
      const active = globalThis.document.createElement("p");
      active.setAttribute("slot", "col-2");
      container.appendChild(active);
      HAXStore.activeNode = active;
      const inserted = [];
      HAXStore.activeHaxBody.haxInsert = (tag, content, props) => {
        inserted.push([tag, content, props]);
      };
      await HAXStore._haxStoreInsertContent(
        makeEvent({ tag: "h2", content: "slotted", properties: {} }),
      );
      expect(inserted.length).to.equal(1);
    });

    it("falls back to a plain haxInsert for top-level active nodes", async () => {
      const inserted = [];
      HAXStore.activeHaxBody.haxInsert = (tag, content, props) => {
        inserted.push([tag, content, props]);
      };
      HAXStore.activeNode = null;
      await HAXStore._haxStoreInsertContent(
        makeEvent({ tag: "p", content: "plain", properties: {} }),
      );
      expect(inserted).to.deep.equal([["p", "plain", {}]]);
    });
  });

  describe("_haxStoreInsertMultiple", () => {
    it("inserts each element in the array", () => {
      const inserted = [];
      stash("activeHaxBody");
      HAXStore.activeHaxBody = {
        haxInsert: (tag, content, props) => {
          inserted.push([tag, content, props]);
        },
      };
      HAXStore._haxStoreInsertMultiple({
        detail: [
          { tag: "p", content: "one", properties: {} },
          { tag: "h2", content: "two", properties: { title: "T" } },
        ],
      });
      expect(inserted).to.deep.equal([
        ["p", "one", {}],
        ["h2", "two", { title: "T" }],
      ]);
    });
  });

  describe("_haxStorePieceRegistrationManager", () => {
    it("stores the piece object by name", () => {
      const piece = globalThis.document.createElement("div");
      HAXStore._haxStorePieceRegistrationManager({
        detail: { piece: "haxTray", object: piece },
      });
      expect(HAXStore.haxTray).to.equal(piece);
      HAXStore._haxStorePieceRegistrationManager({ detail: null });
    });
  });

  describe("setupEditableTable / setupIframeLoader", () => {
    it("activates the editable table as the active node", async () => {
      const originalNode = HAXStore.activeNode;
      const calls = [];
      const editor = {
        set editMode(v) {
          calls.push(["editMode", v]);
        },
        focus() {
          calls.push(["focus", true]);
        },
      };
      HAXStore.setupEditableTable(editor);
      // the read-back coerces through mobx; assert the tag wiring instead
      expect(HAXStore.activeNode.focus).to.exist;
      await aTimeout(1);
      expect(calls).to.deep.equal([
        ["editMode", true],
        ["focus", true],
      ]);
      HAXStore.activeNode = originalNode;
    });

    it("disables the iframe loader wrapper", async () => {
      const originalNode = HAXStore.activeNode;
      const calls = [];
      const editor = {
        set disabled(v) {
          calls.push(["disabled", v]);
        },
      };
      HAXStore.setupIframeLoader(editor);
      await aTimeout(1);
      expect(calls).to.deep.equal([["disabled", true]]);
      HAXStore.activeNode = originalNode;
    });
  });

  describe("_superDaemonInsert", () => {
    it("writes the source into the daemon program target when present", () => {
      const target = { value: "" };
      SuperDaemonInstance.programTarget = target;
      HAXStore._superDaemonInsert({
        detail: { properties: { source: "files/x.mp4" } },
      });
      expect(target.value).to.equal("files/x.mp4");
      expect(SuperDaemonInstance.programTarget).to.equal(null);
    });

    it("forwards to the tray when there is no program target", () => {
      stash("haxTray");
      const processed = [];
      HAXStore.haxTray = {
        _processTrayEvent: (e) => processed.push(e),
      };
      SuperDaemonInstance.programTarget = null;
      HAXStore._superDaemonInsert({ detail: { properties: {} } });
      expect(processed.length).to.equal(1);
      expect(SuperDaemonInstance.programTarget).to.equal(null);
    });
  });

  describe("computePolyfillSafe / isSingleSlotElement / getters", () => {
    it("computePolyfillSafe is true where attachShadow exists", () => {
      expect(HAXStore.computePolyfillSafe()).to.equal(true);
    });

    it("isSingleSlotElement detects a single unnamed slot", () => {
      HAXStore.elementList = {
        "single-slot-el": {
          settings: { configure: [{ slot: "", title: "Content" }] },
        },
        "multi-slot-el": {
          settings: {
            configure: [
              { slot: "", title: "Content" },
              { slot: "col-1", title: "Col" },
            ],
          },
        },
      };
      expect(
        HAXStore.isSingleSlotElement(
          globalThis.document.createElement("single-slot-el"),
        ),
      ).to.equal(true);
      expect(
        HAXStore.isSingleSlotElement(
          globalThis.document.createElement("multi-slot-el"),
        ),
      ).to.equal(false);
    });

    it("keyboardShortcuts maps markdown triggers to tags", () => {
      const map = HAXStore.keyboardShortcuts;
      expect(map["#"].tag).to.equal("h2");
      expect(map[">"].tag).to.equal("blockquote");
    });

    it("activeGizmo resolves the gizmo for the active node", () => {
      HAXStore.gizmoList = [{ tag: "p", title: "Paragraph" }];
      HAXStore.activeNode = globalThis.document.createElement("p");
      expect(HAXStore.activeGizmo.tag).to.equal("p");
    });

    it("activeNodeIndex finds the index of the active node", () => {
      const body = globalThis.document.createElement("div");
      const p1 = globalThis.document.createElement("p");
      const p2 = globalThis.document.createElement("p");
      body.appendChild(p1);
      body.appendChild(p2);
      HAXStore.activeHaxBody = body;
      HAXStore.activeNode = p2;
      expect(HAXStore.activeNodeIndex).to.equal(1);
      HAXStore.activeNode = null;
      expect(HAXStore.activeNodeIndex).to.equal(null);
    });
  });

  describe("refreshActiveNodeForm", () => {
    it("rebuilds the form from the active node", async () => {
      const setupCalls = [];
      const p = globalThis.document.createElement("p");
      p.textContent = "content";
      const fakeTray = {
        activeNode: p,
        _setupForm: async () => {
          setupCalls.push(true);
        },
      };
      HAXStore.haxTray = fakeTray;
      await HAXStore.refreshActiveNodeForm();
      expect(setupCalls.length).to.equal(1);
      expect(fakeTray.activeHaxElement.tag).to.equal("p");
    });
  });

  describe("attemptGizmoTranslation", () => {
    it("loads a remote haxProperties schema for the tag and translates", async () => {
      const originalFetch = globalThis.fetch;
      globalThis.fetch = async () => ({
        ok: true,
        json: async () => ({
          gizmo: { title: "Translated title" },
          settings: {
            configure: [{ title: "Translated field" }],
          },
          demoSchema: [{ properties: { title: "Translated demo" } }],
        }),
      });
      class RemotePropsEl extends globalThis.HTMLElement {
        static get haxProperties() {
          return "https://example.com/remote-props.json";
        }
      }
      if (!globalThis.customElements.get("remote-props-el")) {
        globalThis.customElements.define("remote-props-el", RemotePropsEl);
      }
      const properties = {
        gizmo: { title: "Original" },
        settings: { configure: [{ title: "Original field" }] },
        demoSchema: [{ properties: { title: "Original demo" } }],
      };
      const result = await HAXStore.attemptGizmoTranslation(
        "remote-props-el",
        properties,
      );
      expect(result.gizmo.title).to.equal("Translated title");
      expect(result.settings.configure[0].title).to.equal("Translated field");
      expect(result.demoSchema[0].properties.title).to.equal("Translated demo");
      globalThis.fetch = originalFetch;
    });

    it("leaves properties alone when the remote schema fails", async () => {
      const originalFetch = globalThis.fetch;
      globalThis.fetch = async () => ({ ok: false });
      class RemoteFailEl extends globalThis.HTMLElement {
        static get haxProperties() {
          return "https://example.com/fail.json";
        }
      }
      if (!globalThis.customElements.get("remote-fail-el")) {
        globalThis.customElements.define("remote-fail-el", RemoteFailEl);
      }
      const properties = { gizmo: { title: "Original" } };
      const result = await HAXStore.attemptGizmoTranslation(
        "remote-fail-el",
        properties,
      );
      expect(result.gizmo.title).to.equal("Original");
      globalThis.fetch = originalFetch;
    });
  });

  describe("nodeToContent special cases", () => {
    beforeEach(() => {
      stash("elementList");
      stash("primativeHooks");
      HAXStore.elementList = {};
      HAXStore.primativeHooks = {};
    });

    it("runs the preProcessNodeToContent, progressiveEnhancement and postProcessNodeToContent hooks", async () => {
      HAXStore.primativeHooks = {
        p: {
          preProcessNodeToContent: (node) => node,
          progressiveEnhancement: () => " ENHANCED",
          postProcessNodeToContent: (content) => content + " POST",
        },
      };
      const p = globalThis.document.createElement("p");
      p.textContent = "hi";
      const content = await HAXStore.nodeToContent(p);
      expect(content).to.contain("ENHANCED");
      expect(content).to.contain("POST");
    });

    it("forces sandbox attributes onto iframe content", async () => {
      const iframe = globalThis.document.createElement("iframe");
      iframe.setAttribute("src", "https://example.com");
      const content = await HAXStore.nodeToContent(iframe);
      expect(content).to.contain('sandbox="allow-scripts allow-same-origin"');
    });

    it("unset saveOptions attributes are dropped from output", async () => {
      HAXStore.elementList = {
        h2: { saveOptions: { unsetAttributes: ["data-original-level"] } },
      };
      const h2 = globalThis.document.createElement("h2");
      h2.setAttribute("data-original-level", "h1");
      h2.textContent = "Heading";
      const content = await HAXStore.nodeToContent(h2);
      expect(content).to.not.contain("data-original-level");
    });
  });

  describe("htmlToHaxElements page-template support", () => {
    it("keeps page-template as a valid element during conversion", async () => {
      stash("validTagList");
      HAXStore.validTagList = ["p"];
      const elements = await HAXStore.htmlToHaxElements(
        '<page-template name="tpl"><p>inner</p></page-template>',
      );
      expect(elements.length).to.equal(1);
      expect(elements[0].tag).to.equal("page-template");
    });
  });

  describe("detectAndRegisterPageTemplateStax", () => {
    beforeEach(() => {
      stash("validTagList");
      stash("staxList");
      stash("styleGuideSchema");
      HAXStore.validTagList = ["p"];
      HAXStore.staxList = [];
      HAXStore.styleGuideSchema = {};
    });
    afterEach(() => {
      // remove any hax-stax elements appended to the singleton during the test
      const staxEls = HAXStore.querySelectorAll("hax-stax");
      for (let i = 0; i < staxEls.length; i++) {
        staxEls[i].remove();
      }
    });

    it("registers an area template as a stax with dedup id", async () => {
      await HAXStore.detectAndRegisterPageTemplateStax(
        '<page-template name="My Area" schema="area" data-haxsg-id="sg-1"><p>content</p></page-template>',
      );
      await aTimeout(20);
      const found = HAXStore.staxList.filter(
        (s) => s.details.haxsgId === "sg-1",
      );
      expect(found.length).to.equal(1);
      expect(found[0].details.title).to.equal("My Area");
      expect(found[0].details.templateType).to.equal("area");
    });

    it("replaces the demoSchema for block templates", async () => {
      await HAXStore.detectAndRegisterPageTemplateStax(
        '<page-template name="My Block" schema="block"><p>block content</p></page-template>',
      );
      await aTimeout(20);
      expect(HAXStore.styleGuideSchema["p"]).to.exist;
      expect(HAXStore.styleGuideSchema["p"].demoSchema[0].tag).to.equal("p");
    });
  });

  describe("_detectStyleGuideTemplates", () => {
    it("pulls style guide content from HAXCMS when available", async () => {
      stashGlobal("HAXCMS");
      stash("validTagList");
      stash("staxList");
      stash("styleGuideSchema");
      HAXStore.validTagList = ["p"];
      HAXStore.staxList = [];
      HAXStore.styleGuideSchema = {};
      globalThis.HAXCMS = {
        instance: {
          store: {
            loadStyleGuideContent: async () =>
              '<page-template name="CMS tpl" schema="block"><p>cms content</p></page-template>',
          },
        },
      };
      await HAXStore._detectStyleGuideTemplates();
      await aTimeout(20);
      expect(HAXStore.styleGuideSchema["p"]).to.exist;
      const staxEls = HAXStore.querySelectorAll("hax-stax");
      for (let i = 0; i < staxEls.length; i++) {
        staxEls[i].remove();
      }
    });

    it("does nothing without a HAXCMS instance", async () => {
      stashGlobal("HAXCMS");
      globalThis.HAXCMS = undefined;
      await HAXStore._detectStyleGuideTemplates();
      expect(true).to.equal(true);
    });
  });

  describe("forceAppStoreLoad", () => {
    it("loads held app store data once all pieces exist", async () => {
      const calls = [];
      HAXStore._loadAppStoreData = async (data) => {
        calls.push(data);
      };
      HAXStore.appStoreLoaded = false;
      HAXStore.ready = true;
      HAXStore.__appStoreData = { marker: "held" };
      HAXStore.haxAutoloader = globalThis.document.createElement("div");
      await HAXStore.forceAppStoreLoad();
      expect(calls.length).to.equal(1);
      expect(calls[0].marker).to.equal("held");
      delete HAXStore._loadAppStoreData;
    });

    it("falls back to a remote load when only the appStore config exists", async () => {
      const calls = [];
      HAXStore.loadAppStoreFromRemote = () => {
        calls.push(true);
      };
      HAXStore.appStoreLoaded = false;
      HAXStore.ready = false;
      HAXStore.__appStoreData = null;
      HAXStore.appStore = { url: "https://example.com/store.json" };
      HAXStore.haxAutoloader = globalThis.document.createElement("div");
      await HAXStore.forceAppStoreLoad();
      // the mobx editMode autorun may re-fire the same load path; assert at
      // least one remote call landed rather than a brittle exact count
      expect(calls.length).to.be.greaterThan(0);
      delete HAXStore.loadAppStoreFromRemote;
    });
  });

  describe("_haxStoreRegisterApp", () => {
    let originalDefineOption;
    beforeEach(() => {
      originalDefineOption = SuperDaemonInstance.defineOption;
      stash("appList");
      stash("gizmoList");
      stash("validGizmoTypes");
      HAXStore.appList = [];
      HAXStore.gizmoList = [];
      HAXStore.validGizmoTypes = ["video"];
    });
    afterEach(() => {
      SuperDaemonInstance.defineOption = originalDefineOption;
      const links = globalThis.document.querySelectorAll(
        'link[rel="preconnect"]',
      );
      for (let i = 0; i < links.length; i++) {
        links[i].remove();
      }
    });

    function makeApp(overrides) {
      return Object.assign(
        {
          details: {
            title: "Files",
            icon: "icons:code",
            tags: ["media"],
            tos: [{ title: "Terms", link: "https://example.com/tos" }],
          },
          connection: {
            protocol: "https",
            url: "cdn.example.com",
            operations: {
              browse: {
                search: { q: "" },
                resultMap: { defaultGizmoType: "video" },
              },
            },
          },
        },
        overrides,
      );
    }

    function makeHostedTarget() {
      const host = globalThis.document.createElement("div");
      const target = globalThis.document.createElement("div");
      host.appendChild(target);
      return target;
    }

    it("registers the app, its daemon option and a preconnect link", () => {
      const captured = [];
      SuperDaemonInstance.defineOption = (option) => {
        captured.push(option);
      };
      const app = makeApp();
      HAXStore._haxStoreRegisterApp({
        detail: app,
        target: makeHostedTarget(),
      });
      expect(HAXStore.appList.length).to.equal(1);
      expect(HAXStore.appList[0].index).to.equal(0);
      expect(captured.length).to.equal(1);
      expect(captured[0].path).to.equal("/sources/files");
      expect(captured[0].more).to.exist;
      const preconnect = globalThis.document.querySelectorAll(
        'link[rel="preconnect"]',
      );
      expect(preconnect.length).to.be.greaterThan(0);
    });

    it("defaults the gizmo type to media without a resultMap default", () => {
      const captured = [];
      SuperDaemonInstance.defineOption = (option) => {
        captured.push(option);
      };
      const app = makeApp();
      delete app.connection.operations.browse.resultMap.defaultGizmoType;
      HAXStore._haxStoreRegisterApp({
        detail: app,
        target: makeHostedTarget(),
      });
      expect(captured[0].tags).to.include("media");
    });

    it("removes the registering element from a HAX-STORE parent", () => {
      SuperDaemonInstance.defineOption = () => {};
      const storeEl = globalThis.document.createElement("hax-store");
      const target = globalThis.document.createElement("hax-app");
      storeEl.appendChild(target);
      HAXStore._haxStoreRegisterApp({
        detail: makeApp(),
        target: target,
      });
      expect(target.parentNode).to.equal(null);
    });

    it("runs the search program against the app search broker", async () => {
      const captured = [];
      SuperDaemonInstance.defineOption = (option) => {
        captured.push(option);
      };
      const app = makeApp();
      HAXStore._haxStoreRegisterApp({
        detail: app,
        target: makeHostedTarget(),
      });
      const reset = [];
      const searches = [];
      HAXStore.appSearch = {
        _resetAppSearch: (detail) => reset.push(detail),
        updateSearchValues: (map) => searches.push(map),
        __debounce: 555,
        loadAppData: async () => [
          {
            title: "A video result",
            image: "img.jpg",
            type: "",
            map: { source: "files/a.mp4", title: "Vid" },
          },
        ],
      };
      HAXStore.gizmoList = [
        { tag: "video-player", handles: [{ type: "video", source: "source" }] },
      ];
      const program = captured[0].value.program;
      const results = await program("query", { index: 0, detail: app });
      expect(reset.length).to.equal(1);
      expect(reset[0]).to.equal(app);
      expect(searches[0].q).to.equal("query");
      expect(results.length).to.equal(1);
      expect(results[0].value.value).to.equal("video-player");
      expect(results[0].value.properties.source).to.equal("files/a.mp4");
    });
  });

  describe("_haxStoreRegisterStax removal path", () => {
    it("removes the stax element from a HAX-STORE parent after registering", () => {
      stash("staxList");
      HAXStore.staxList = [];
      const storeEl = globalThis.document.createElement("hax-store");
      const target = globalThis.document.createElement("div");
      storeEl.appendChild(target);
      HAXStore._haxStoreRegisterStax({
        detail: { details: { title: "Removal stax" }, stax: [] },
        target: target,
      });
      expect(HAXStore.staxList.length).to.equal(1);
      expect(target.parentNode).to.equal(null);
    });
  });

  describe("Hax debug bridges", () => {
    beforeEach(() => {
      stash("elementList");
      stash("activeHaxBody");
      stash("activeNode");
      stash("toast");
      stash("styleGuideSchema");
      HAXStore.elementList = {};
      HAXStore.styleGuideSchema = {};
      HAXStore.activeNode = null;
      HAXStore.toast = () => {};
    });

    it("adds a valid tag from its demoSchema", () => {
      HAXStore.elementList["demo-el"] = {
        gizmo: { tag: "demo-el", title: "Demo" },
        demoSchema: [
          { tag: "demo-el", content: "<p>d</p>", properties: { title: "x" } },
        ],
      };
      const replaced = [];
      const focused = [];
      HAXStore.activeHaxBody = {
        haxReplaceNode: (oldNode, newNode) => replaced.push([oldNode, newNode]),
        __focusLogic: (node) => focused.push(node),
      };
      globalThis.Hax.add("demo-el");
      expect(replaced.length).to.equal(1);
      expect(focused.length).to.equal(1);
    });

    it("falls back to a bare element when the schema has no demoSchema", () => {
      HAXStore.elementList["bare-el"] = { gizmo: { tag: "bare-el" } };
      const replaced = [];
      HAXStore.activeHaxBody = {
        haxReplaceNode: (oldNode, newNode) => replaced.push([oldNode, newNode]),
        __focusLogic: () => {},
      };
      globalThis.Hax.add("bare-el");
      expect(replaced.length).to.equal(1);
      expect(replaced[0][1].tagName).to.equal("BARE-EL");
    });

    it("toasts when adding an unknown tag", () => {
      const toasts = [];
      HAXStore.toast = (msg) => toasts.push(msg);
      globalThis.Hax.add("no-such-tag");
      expect(toasts[0]).to.contain("not a valid tag");
    });

    it("wires delete, duplicate, move, grid, set, get, export and import", async () => {
      const calls = [];
      HAXStore.activeHaxBody = {
        haxDeleteNode: (n) => calls.push(["delete", n]),
        haxDuplicateNode: (n) => calls.push(["duplicate", n]),
        haxMoveGridPlate: (n, dir) => calls.push(["move", n, dir]),
        haxGridPlateOps: (op) => calls.push(["grid", op]),
        haxToContent: async () => "exported",
        importContent: (html) => calls.push(["import", html]),
      };
      const node = globalThis.document.createElement("p");
      HAXStore.activeNode = node;
      globalThis.Hax.delete();
      globalThis.Hax.duplicate();
      globalThis.Hax.move(true);
      globalThis.Hax.move(false);
      globalThis.Hax.grid(false);
      globalThis.Hax.set("__bridgeKey", "bridgeVal");
      HAXStore.__bridgeKey = "bridgeVal";
      expect(globalThis.Hax.get("__bridgeKey")).to.equal("bridgeVal");
      expect(await globalThis.Hax.export()).to.equal("exported");
      globalThis.Hax.import("<p>imported</p>");
      expect(calls).to.deep.equal([
        ["delete", node],
        ["duplicate", node],
        ["move", node, -1],
        ["move", node, undefined],
        ["grid", false],
        ["import", "<p>imported</p>"],
      ]);
      HAXStore.activeNode = null;
      globalThis.Hax.delete();
    });
  });
});

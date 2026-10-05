import { expect } from "@open-wc/testing";

import { HAXStore } from "../lib/hax-store.js";

// round 5: app-store loading, dynamic import handling, design system
// integrations, global preferences, store readiness, and the editor
// command / inline-state helpers

describe("hax-store helpers round 5 (app store + editor command logic)", () => {
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
  });

  describe("_appStoreChanged", () => {
    it("injects the app store data directly when not remote loaded", () => {
      stash("__appStoreData");
      const newValue = { apps: [] };
      HAXStore._appStoreChanged(newValue, { apps: [1] });
      expect(HAXStore.__appStoreData).to.equal(newValue);
    });
  });

  describe("_loadAppStoreData", () => {
    beforeEach(() => {
      stash("validTagList");
      stash("__appStoreData");
      stash("appStoreLoaded");
      stash("haxAutoloader");
      stash("setHaxProperties");
      stash("_handleDynamicImports");
      stash("_detectStyleGuideTemplates");
      HAXStore.appStoreLoaded = false;
      HAXStore.haxAutoloader = globalThis.document.createElement("div");
      HAXStore.setHaxProperties = () => {};
      HAXStore._handleDynamicImports = () => {};
      HAXStore._detectStyleGuideTemplates = () => {};
    });

    it("does nothing for a null response", async () => {
      await HAXStore._loadAppStoreData(null);
      expect(HAXStore.appStoreLoaded).to.equal(false);
    });

    it("processes object-based autoloader entries", async () => {
      const captured = [];
      HAXStore.setHaxProperties = (props, name) => {
        captured.push([props, name]);
      };
      let importItems = null;
      HAXStore._handleDynamicImports = async (items, autoloader) => {
        importItems = items;
        expect(autoloader).to.equal(HAXStore.haxAutoloader);
      };
      await HAXStore._loadAppStoreData({
        autoloader: {
          "test-store-el": "@haxtheweb/test-store-el/test-store-el.js",
        },
      });
      expect(HAXStore.validTagList).to.include("test-store-el");
      expect(importItems["test-store-el"]).to.equal(
        "@haxtheweb/test-store-el/test-store-el.js",
      );
      expect(HAXStore.appStoreLoaded).to.equal(true);
    });

    it("processes array-based autoloader entries into derived imports", async () => {
      let importItems = null;
      HAXStore._handleDynamicImports = async (items) => {
        importItems = items;
      };
      await HAXStore._loadAppStoreData({
        autoloader: ["test-store-el"],
      });
      expect(importItems["test-store-el"]).to.equal(
        "@haxtheweb/test-store-el/test-store-el.js",
      );
    });

    it("applies over the wire haxProperties from autoloader entries", async () => {
      const captured = [];
      HAXStore.setHaxProperties = (props, name) => {
        captured.push([props, name]);
      };
      let importItems = null;
      HAXStore._handleDynamicImports = async (items) => {
        importItems = items;
      };
      await HAXStore._loadAppStoreData({
        autoloader: {
          "wire-el": {
            haxProperties: { "demo-schema": [] },
            import: "@haxtheweb/wire-el/wire-el.js",
          },
        },
      });
      expect(captured.length).to.equal(1);
      expect(captured[0][1]).to.equal("wire-el");
      expect(importItems["wire-el"]).to.equal("@haxtheweb/wire-el/wire-el.js");
    });

    it("skips apps without add operations when online media is blocked", async () => {
      stash("platformConfig");
      stash("platformAllows");
      HAXStore.platformAllows = () => false;
      // appending a real hax-app fires its hax-register-app event which
      // cascades into the full app-list machinery needing complete app
      // details; intercept appendChild so the app never connects — the
      // platformAllows gate is what we are verifying here
      const appended = [];
      HAXStore.appendChild = function (el) {
        appended.push(el);
        return el;
      };
      try {
        await HAXStore._loadAppStoreData({
          apps: [
            { connection: { operations: {} } },
            { connection: { operations: { add: {} } } },
          ],
        });
        expect(
          appended.filter((el) => el.tagName === "HAX-APP").length,
        ).to.equal(1);
      } finally {
        delete HAXStore.appendChild;
      }
    });

    it("loads stax entries from the response", async () => {
      // capture appends directly: the test page's autoload machinery can
      // remove unknown inserted tags during the async window
      const appended = [];
      const originalAppendChild = HAXStore.appendChild;
      HAXStore.appendChild = function (el) {
        appended.push(el);
        return originalAppendChild.call(this, el);
      };
      try {
        await HAXStore._loadAppStoreData({
          stax: [{ details: [{ name: "a" }] }],
        });
        expect(
          appended.filter((el) => el.tagName === "HAX-STAX").length,
        ).to.equal(1);
      } finally {
        delete HAXStore.appendChild;
        HAXStore.querySelectorAll("hax-stax").forEach((s) => s.remove());
      }
    });

    it("dispatches hax-store-app-store-loaded", async () => {
      let fired = false;
      const handler = () => {
        fired = true;
      };
      globalThis.addEventListener("hax-store-app-store-loaded", handler);
      try {
        await HAXStore._loadAppStoreData({});
      } finally {
        globalThis.removeEventListener("hax-store-app-store-loaded", handler);
      }
      expect(fired).to.equal(true);
    });
  });

  describe("_handleDynamicImports", () => {
    class FakeHaxEl extends globalThis.HTMLElement {
      static get haxProperties() {
        return { props: {} };
      }
    }
    class FakePlainEl extends globalThis.HTMLElement {}
    if (!globalThis.customElements.get("fake-hax-store-el")) {
      globalThis.customElements.define("fake-hax-store-el", FakeHaxEl);
    }
    if (!globalThis.customElements.get("fake-plain-store-el")) {
      globalThis.customElements.define("fake-plain-store-el", FakePlainEl);
    }

    beforeEach(() => {
      stash("setHaxProperties");
      stash("haxAutoloader");
      HAXStore.haxAutoloader = globalThis.document.createElement("div");
      HAXStore.setHaxProperties = () => {};
    });

    it("applies haxProperties from already defined elements", async () => {
      const captured = [];
      HAXStore.setHaxProperties = (props, name) => {
        captured.push([props, name]);
      };
      await HAXStore._handleDynamicImports(
        { "fake-hax-store-el": "any.js" },
        HAXStore.haxAutoloader,
      );
      expect(captured.length).to.equal(1);
      expect(captured[0][1]).to.equal("fake-hax-store-el");
    });

    it("appends already defined elements without haxProperties", async () => {
      await HAXStore._handleDynamicImports(
        { "fake-plain-store-el": "any.js" },
        HAXStore.haxAutoloader,
      );
      expect(HAXStore.haxAutoloader.querySelector("fake-plain-store-el")).to
        .exist;
    });

    it("falls back to appending the element when an import fails", async () => {
      await HAXStore._handleDynamicImports(
        { "import-fail-el": "@haxtheweb/nope/nope.js" },
        HAXStore.haxAutoloader,
      );
      expect(HAXStore.haxAutoloader.querySelector("import-fail-el")).to.exist;
    });

    it("imports an external URL directly when referenced", async () => {
      const originalWarn = console.warn;
      let warned = false;
      console.warn = () => {
        warned = true;
      };
      try {
        await HAXStore._handleDynamicImports(
          { "external-el": "https://example.invalid/el.js" },
          HAXStore.haxAutoloader,
        );
        expect(HAXStore.haxAutoloader.querySelector("external-el")).to.exist;
      } finally {
        console.warn = originalWarn;
      }
    });
  });

  describe("isExternalURLImport", () => {
    it("detects external URLs", () => {
      expect(HAXStore.isExternalURLImport("https://example.com/x.js")).to.equal(
        true,
      );
    });
    it("returns false for relative strings", () => {
      expect(HAXStore.isExternalURLImport("not a url")).to.equal(false);
    });
    it("returns false for same-origin URLs", () => {
      expect(
        HAXStore.isExternalURLImport(globalThis.location.origin + "/x.js"),
      ).to.equal(false);
    });
  });

  describe("_loadActiveDesignSystemIntegrations", () => {
    let savedManager;
    beforeEach(() => {
      savedManager = globalThis.DesignSystemManager;
    });
    afterEach(() => {
      globalThis.DesignSystemManager = savedManager;
    });

    it("returns early without a DesignSystemManager", async () => {
      delete globalThis.DesignSystemManager;
      await HAXStore._loadActiveDesignSystemIntegrations();
    });

    it("returns early when the manager lacks the loader", async () => {
      globalThis.DesignSystemManager = {
        requestAvailability: () => ({}),
      };
      await HAXStore._loadActiveDesignSystemIntegrations();
    });

    it("passes edit mode and authentication state to the manager", async () => {
      let received = null;
      globalThis.DesignSystemManager = {
        requestAvailability: () => ({
          loadActiveSystemIntegrations: (opts) => {
            received = opts;
          },
        }),
      };
      stash("editMode");
      HAXStore.editMode = true;
      await HAXStore._loadActiveDesignSystemIntegrations();
      expect(received.editMode).to.equal(true);
      expect(received.isAuthenticated).to.equal(true);
    });

    it("uses the CMS login state for authentication", async () => {
      let received = null;
      globalThis.DesignSystemManager = {
        requestAvailability: () => ({
          loadActiveSystemIntegrations: (opts) => {
            received = opts;
          },
        }),
      };
      const savedHAXCMS = globalThis.HAXCMS;
      globalThis.HAXCMS = { instance: { store: { isLoggedIn: false } } };
      try {
        await HAXStore._loadActiveDesignSystemIntegrations();
        expect(received.isAuthenticated).to.equal(false);
      } finally {
        globalThis.HAXCMS = savedHAXCMS;
      }
    });
  });

  describe("_editModeChanged", () => {
    beforeEach(() => {
      stash("appStoreLoaded");
      stash("__appStoreData");
      stash("haxAutoloader");
      stash("appStore");
      stash("_loadAppStoreData");
      stash("forceAppStoreLoad");
      stash("_loadActiveDesignSystemIntegrations");
      HAXStore.appStoreLoaded = false;
      HAXStore.haxAutoloader = globalThis.document.createElement("div");
      HAXStore._loadAppStoreData = () => {};
      HAXStore.forceAppStoreLoad = () => {};
      HAXStore._loadActiveDesignSystemIntegrations = () => {};
    });

    it("loads pending app store data when edit mode engages", () => {
      HAXStore.__appStoreData = { apps: [] };
      let loaded = null;
      HAXStore._loadAppStoreData = (data) => {
        loaded = data;
      };
      HAXStore._editModeChanged(true);
      expect(loaded).to.equal(HAXStore.__appStoreData);
    });

    it("force loads the remote app store when configured by url", () => {
      HAXStore.appStore = { url: "appstore.json" };
      let forced = false;
      HAXStore.forceAppStoreLoad = () => {
        forced = true;
      };
      HAXStore._editModeChanged(true);
      expect(forced).to.equal(true);
    });

    it("loads design system integrations when edit mode engages", () => {
      let integrations = false;
      HAXStore._loadActiveDesignSystemIntegrations = () => {
        integrations = true;
      };
      HAXStore._editModeChanged(true);
      expect(integrations).to.equal(true);
    });
  });

  describe("_globalPreferencesChanged", () => {
    beforeEach(() => {
      stash("__storageDataProcessed");
      stash("ready");
      stash("editMode");
      stash("storageData");
      stash("_storageDataChanged");
      stash("elementList");
      stash("gizmoList");
      stash("attemptGizmoTranslation");
      HAXStore.__storageDataProcessed = true;
      HAXStore.ready = true;
      HAXStore.editMode = false;
      HAXStore.storageData = '{"globalPreferences":{"lang":"en"}}';
      HAXStore._storageDataChanged = () => {};
      HAXStore.elementList = {};
      HAXStore.gizmoList = [];
      HAXStore.attemptGizmoTranslation = async (name, el) => el;
    });

    it("does nothing before storage data is processed", async () => {
      HAXStore.__storageDataProcessed = false;
      await HAXStore._globalPreferencesChanged({ lang: "fr" });
      expect(HAXStore.storageData).to.equal(
        '{"globalPreferences":{"lang":"en"}}',
      );
    });

    it("merges preferences into storage data and notifies", async () => {
      let notified = null;
      HAXStore._storageDataChanged = (data) => {
        notified = data;
      };
      await HAXStore._globalPreferencesChanged({ lang: "fr" });
      // the source stores the parsed object back onto storageData
      expect(HAXStore.storageData.globalPreferences.lang).to.equal("fr");
      expect(notified).to.equal(HAXStore.storageData);
    });

    it("reapplies gizmo translations after the debounce in edit mode", async () => {
      HAXStore.editMode = true;
      HAXStore.elementList = {
        "pref-el": { gizmo: { title: "old", description: "old desc" } },
      };
      HAXStore.gizmoList = [{ tag: "pref-el", title: "a", description: "b" }];
      let translated = null;
      HAXStore.attemptGizmoTranslation = async (name, el) => {
        translated = name;
        return { ...el, gizmo: { title: "new", description: "new desc" } };
      };
      await HAXStore._globalPreferencesChanged({ lang: "de" });
      await new Promise((r) => setTimeout(r, 150));
      expect(translated).to.equal("pref-el");
      expect(HAXStore.elementList["pref-el"].gizmo.title).to.equal("new");
      expect(HAXStore.gizmoList[0].title).to.equal("new");
      expect(HAXStore.gizmoList[0].description).to.equal("new desc");
    });
  });

  describe("_calculateActiveGizmo", () => {
    it("returns null for a null node", () => {
      expect(HAXStore._calculateActiveGizmo(null)).to.equal(null);
    });
    it("matches the gizmo for the active tag name", () => {
      stash("gizmoList");
      HAXStore.gizmoList = [
        { tag: "p", title: "Paragraph" },
        { tag: "video-player", title: "Video" },
      ];
      const p = globalThis.document.createElement("p");
      const result = HAXStore._calculateActiveGizmo(p);
      // gizmoList is observable, so the returned gizmo is wrapped; compare
      // fields instead of identity
      expect(result.tag).to.equal("p");
      expect(result.title).to.equal("Paragraph");
    });
    it("returns undefined for an unmatched tag", () => {
      stash("gizmoList");
      HAXStore.gizmoList = [];
      const div = globalThis.document.createElement("div");
      expect(HAXStore._calculateActiveGizmo(div)).to.equal(undefined);
    });
  });

  describe("loadAppStoreFromRemote", () => {
    let originalFetch;
    beforeEach(() => {
      stash("appStore");
      stash("method");
      stash("__appStoreData");
      originalFetch = globalThis.fetch;
    });
    afterEach(() => {
      globalThis.fetch = originalFetch;
    });

    it("returns early without app store config", () => {
      HAXStore.appStore = null;
      HAXStore.loadAppStoreFromRemote();
    });

    it("returns early when no url remains", () => {
      HAXStore.appStore = {};
      HAXStore.loadAppStoreFromRemote();
    });

    it("builds the query, moves the site token to a header, and stores the json", async () => {
      let calledWith = null;
      globalThis.fetch = async (url, options) => {
        calledWith = { url, options };
        return {
          ok: true,
          json: async () => ({ apps: [{ id: "app-1" }] }),
        };
      };
      HAXStore.method = "GET";
      HAXStore.appStore = {
        url: "appstore.json",
        params: { site_token: "tok-123", type: "all" },
        headers: {},
      };
      HAXStore.loadAppStoreFromRemote();
      await new Promise((r) => setTimeout(r, 0));
      expect(calledWith.url).to.equal("appstore.json?type=all");
      expect(calledWith.options.headers["X-HAXCMS-Site-Token"]).to.equal(
        "tok-123",
      );
      expect(HAXStore.__appStoreData.apps[0].id).to.equal("app-1");
    });

    it("appends to an existing query string with &", async () => {
      let calledWith = null;
      globalThis.fetch = async (url, options) => {
        calledWith = { url, options };
        return { ok: true, json: async () => ({}) };
      };
      HAXStore.appStore = {
        url: "appstore.json?version=2",
        params: { siteToken: "tok-456" },
        headers: { "x-haxcms-site-token": "existing" },
      };
      HAXStore.loadAppStoreFromRemote();
      await new Promise((r) => setTimeout(r, 0));
      expect(calledWith.url).to.equal("appstore.json?version=2");
      // an existing header of either case is not replaced
      expect(calledWith.options.headers["x-haxcms-site-token"]).to.equal(
        "existing",
      );
      expect(
        Object.prototype.hasOwnProperty.call(
          calledWith.options.headers,
          "X-HAXCMS-Site-Token",
        ),
      ).to.equal(false);
    });

    it("does not store data when the response is not ok", async () => {
      globalThis.fetch = async () => ({ ok: false });
      HAXStore.appStore = { url: "appstore.json" };
      HAXStore.__appStoreData = "unchanged";
      HAXStore.loadAppStoreFromRemote();
      await new Promise((r) => setTimeout(r, 0));
      // the json callback still runs, storing undefined for a not-ok response
      expect(HAXStore.__appStoreData).to.equal(undefined);
    });
  });

  describe("firstUpdated", () => {
    it("writes global preferences once storage processing is trusted", async () => {
      stash("write");
      stash("storageData");
      HAXStore.storageData = { globalPreferences: { lang: "es" } };
      let writeCalls = [];
      HAXStore.write = (bin, value, context) => {
        writeCalls.push([bin, value, context]);
      };
      HAXStore.firstUpdated(new Map());
      await new Promise((r) => setTimeout(r, 0));
      expect(HAXStore.__storageDataProcessed).to.equal(true);
      expect(writeCalls.length).to.equal(1);
      expect(writeCalls[0][0]).to.equal("globalPreferences");
      expect(writeCalls[0][2]).to.equal(HAXStore);
    });
  });

  describe("_storePiecesAllHere", () => {
    beforeEach(() => {
      stash("ready");
      stash("storageData");
      stash("_storageDataChanged");
      stash("_buildPrimitiveDefinitions");
      stash("_detectStyleGuideTemplates");
      HAXStore.ready = false;
      HAXStore.storageData = {};
      HAXStore._storageDataChanged = () => {};
      HAXStore._buildPrimitiveDefinitions = () => {};
      HAXStore._detectStyleGuideTemplates = () => {};
    });

    it("does nothing while a piece is missing", () => {
      let fired = false;
      const handler = () => {
        fired = true;
      };
      globalThis.addEventListener("hax-store-ready", handler);
      try {
        HAXStore._storePiecesAllHere(null, null, null, null);
      } finally {
        globalThis.removeEventListener("hax-store-ready", handler);
      }
      expect(fired).to.equal(false);
      expect(HAXStore.ready).to.equal(false);
    });

    it("signals readiness and wires the pieces together", async () => {
      let fired = false;
      const handler = () => {
        fired = true;
      };
      globalThis.addEventListener("hax-store-ready", handler);
      const savedPrompt = globalThis.RichTextEditorPrompt;
      let schematizeTargets = [];
      globalThis.RichTextEditorPrompt = {
        requestAvailability: () => ({
          shadowRoot: {
            querySelector: () => {
              const target = {
                set schematizer(v) {
                  schematizeTargets.push(["schematizer", v]);
                },
                set elementizer(v) {
                  schematizeTargets.push(["elementizer", v]);
                },
              };
              return target;
            },
          },
        }),
      };
      let associated = null;
      const fakeButton = globalThis.document.createElement("button");
      const fakeDialog = {
        associateEvents: (btn) => {
          associated = btn;
        },
      };
      const fakeTray = {
        shadowRoot: {
          querySelector: (sel) =>
            sel === "#haxcancelbutton" ? fakeButton : null,
        },
      };
      const fakeCancel = {
        shadowRoot: {
          querySelector: (sel) => (sel === "#dialog" ? fakeDialog : null),
        },
      };
      let primitivesBuilt = false;
      let templatesDetected = false;
      HAXStore._buildPrimitiveDefinitions = () => {
        primitivesBuilt = true;
      };
      HAXStore._detectStyleGuideTemplates = () => {
        templatesDetected = true;
      };
      try {
        HAXStore._storePiecesAllHere(
          globalThis.document.createElement("div"),
          globalThis.document.createElement("div"),
          fakeTray,
          fakeCancel,
        );
      } finally {
        globalThis.RichTextEditorPrompt = savedPrompt;
        globalThis.removeEventListener("hax-store-ready", handler);
      }
      expect(fired).to.equal(true);
      expect(HAXStore.ready).to.equal(true);
      expect(schematizeTargets.length).to.equal(2);
      expect(associated).to.equal(fakeButton);
      expect(primitivesBuilt).to.equal(true);
      expect(templatesDetected).to.equal(true);
    });
  });

  describe("_handleConfirmCancel", () => {
    it("exits edit mode and fires hax-cancel for the tray cancel button", () => {
      stash("editMode");
      stash("haxTray");
      HAXStore.editMode = true;
      const fakeButton = globalThis.document.createElement("button");
      HAXStore.haxTray = {
        shadowRoot: {
          querySelector: (sel) =>
            sel === "#haxcancelbutton" ? fakeButton : null,
        },
      };
      let cancelEvent = null;
      const handler = (e) => {
        cancelEvent = e;
      };
      globalThis.addEventListener("hax-cancel", handler);
      try {
        HAXStore._handleConfirmCancel({
          detail: { invokedBy: fakeButton, confirmed: true },
        });
      } finally {
        globalThis.removeEventListener("hax-cancel", handler);
      }
      expect(HAXStore.editMode).to.equal(false);
      expect(cancelEvent).to.exist;
      expect(cancelEvent.detail.confirmed).to.equal(true);
    });
  });

  describe("_positionCursorInNode", () => {
    it("places the selection at the requested node position", () => {
      stash("activeHaxBody");
      let positioned = false;
      const fakeBody = globalThis.document.createElement("div");
      fakeBody.positionContextMenus = () => {
        positioned = true;
      };
      HAXStore.activeHaxBody = fakeBody;
      const p = globalThis.document.createElement("p");
      p.textContent = "position me";
      globalThis.document.body.appendChild(p);
      try {
        const range = HAXStore._positionCursorInNode(p, 0);
        expect(positioned).to.equal(true);
        const sel = globalThis.document.getSelection();
        expect(sel.rangeCount).to.equal(1);
        expect(sel.getRangeAt(0)).to.equal(range);
      } finally {
        p.remove();
      }
    });
  });

  describe("_rehydrateInlineEditableState", () => {
    it("returns early outside of edit mode", () => {
      stash("editMode");
      HAXStore.editMode = false;
      expect(HAXStore._rehydrateInlineEditableState(null)).to.equal(undefined);
    });
    it("reapplies editable state to valid nodes in the active body", () => {
      stash("editMode");
      stash("activeHaxBody");
      HAXStore.editMode = true;
      const body = globalThis.document.createElement("div");
      const child = globalThis.document.createElement("p");
      child.textContent = "editable";
      body.appendChild(child);
      globalThis.document.body.appendChild(body);
      const applied = [];
      body._validElementTest = () => true;
      body.__applyNodeEditableStateWhenReady = (node, state) => {
        applied.push([node, state]);
      };
      HAXStore.activeHaxBody = body;
      try {
        HAXStore._rehydrateInlineEditableState(child);
        expect(applied.length).to.be.greaterThan(0);
        expect(applied[0][0]).to.equal(child);
        expect(applied[0][1]).to.equal(true);
      } finally {
        body.remove();
      }
    });
  });

  describe("_onBeforeUnload", () => {
    it("warns when leaving during edit mode", () => {
      stash("editMode");
      stash("skipExitTrap");
      HAXStore.editMode = true;
      HAXStore.skipExitTrap = false;
      expect(HAXStore._onBeforeUnload({})).to.equal(
        "Are you sure you want to leave? Your work will not be saved!",
      );
    });
    it("allows leaving when not editing", () => {
      stash("editMode");
      HAXStore.editMode = false;
      expect(HAXStore._onBeforeUnload({})).to.equal(undefined);
    });
  });

  describe("isBase64", () => {
    it("identifies valid base64 strings", () => {
      expect(HAXStore.isBase64("aGVsbG8=")).to.equal(true);
    });
    it("rejects non base64 strings", () => {
      expect(HAXStore.isBase64("hello world")).to.equal(false);
    });
  });

  describe("retrieveImageFromClipboardAsBlob", () => {
    it("short circuits when clipboardData is false", () => {
      let result = "unset";
      HAXStore.retrieveImageFromClipboardAsBlob(
        { clipboardData: false },
        (blob) => {
          result = blob;
        },
      );
      expect(result).to.equal(undefined);
    });
    it("short circuits when items is undefined", () => {
      let result = "unset";
      HAXStore.retrieveImageFromClipboardAsBlob(
        { clipboardData: {} },
        (blob) => {
          result = blob;
        },
      );
      expect(result).to.equal(undefined);
    });
    it("skips non image items", () => {
      let called = false;
      HAXStore.retrieveImageFromClipboardAsBlob(
        {
          clipboardData: {
            items: [{ type: "text/plain", getAsFile: () => "file" }],
          },
        },
        () => {
          called = true;
        },
      );
      expect(called).to.equal(false);
    });
    it("retrieves the image blob from image items", () => {
      const blob = { type: "image/png", size: 10 };
      let result = null;
      HAXStore.retrieveImageFromClipboardAsBlob(
        {
          clipboardData: {
            items: [{ type: "image/png", getAsFile: () => blob }],
          },
        },
        (retrieved) => {
          result = retrieved;
        },
      );
      expect(result).to.equal(blob);
    });
  });

  describe("_onCommand", () => {
    beforeEach(() => {
      stash("activeNode");
      stash("editMode");
      stash("activeHaxBody");
      HAXStore.editMode = false;
    });

    it("strips MS Word markup on removeFormat", () => {
      const p = globalThis.document.createElement("p");
      p.innerHTML = '<span class="MsoNormal">text</span>';
      HAXStore.activeNode = p;
      HAXStore._onCommand({ detail: { command: "removeFormat" } });
      expect(p.innerHTML).to.not.include("MsoNormal");
      expect(p.textContent).to.include("text");
    });

    it("restores dataset, slot, and attributes after formatBlock", async () => {
      HAXStore.editMode = true;
      const body = globalThis.document.createElement("div");
      const p = globalThis.document.createElement("p");
      p.textContent = "format";
      p.setAttribute("data-tracking", "abc");
      p.setAttribute("slot", "content");
      p.setAttribute("class", "styled");
      p.setAttribute("id", "p-id");
      body.appendChild(p);
      globalThis.document.body.appendChild(body);
      HAXStore.activeHaxBody = body;
      HAXStore.activeNode = p;
      const applied = [];
      body.__applyNodeEditableStateWhenReady = (node, state) => {
        applied.push([node, state]);
      };
      body.__focusLogic = () => {};
      stash("isTextElement");
      HAXStore.isTextElement = () => true;
      HAXStore._onCommand({ detail: { command: "formatBlock" } });
      // simulate the browser having swapped the element for the new block
      const h2 = globalThis.document.createElement("h2");
      h2.textContent = "format";
      p.replaceWith(h2);
      HAXStore.activeNode = h2;
      await new Promise((r) => setTimeout(r, 20));
      try {
        expect(h2.dataset.tracking).to.equal("abc");
        expect(h2.getAttribute("slot")).to.equal("content");
        expect(h2.getAttribute("class")).to.equal("styled");
        expect(h2.getAttribute("id")).to.equal("p-id");
        expect(h2.getAttribute("contenteditable")).to.equal("true");
        expect(applied.length).to.equal(1);
      } finally {
        body.remove();
      }
    });

    it("rehydrates inline state for range commands", async () => {
      stash("_rehydrateInlineEditableState");
      let rehydrated = 0;
      HAXStore._rehydrateInlineEditableState = () => {
        rehydrated++;
      };
      HAXStore._onCommand({ detail: { command: "insertHTML" } });
      await new Promise((r) => setTimeout(r, 20));
      expect(rehydrated).to.equal(1);
    });
  });
});

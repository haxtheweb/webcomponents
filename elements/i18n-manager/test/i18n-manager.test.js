import { fixture, expect, html } from "@open-wc/testing";
import { I18NManager, I18NManagerStore } from "../i18n-manager.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Save / restore helpers for the I18NManagerStore singleton. The store is
 * created at import time and appended to document.body, so it is always
 * connected during tests. We must never leave its internal collections
 * mutated between tests.
 */
function snapshotStore(store) {
  return {
    elements: store.elements.slice(),
    locales: new Set(store.locales),
    fetchTargets: Object.assign({}, store.fetchTargets),
    lang: store.lang,
    dir: store.dir,
    translationManifest: store.translationManifest,
    manifestLoaded: store.manifestLoaded,
    manifestLoading: store.manifestLoading,
    __ready: store.__ready,
  };
}

function restoreStore(store, snap) {
  store.elements = snap.elements;
  store.locales = snap.locales;
  store.fetchTargets = snap.fetchTargets;
  store.lang = snap.lang;
  store.dir = snap.dir;
  store.translationManifest = snap.translationManifest;
  store.manifestLoaded = snap.manifestLoaded;
  store.manifestLoading = snap.manifestLoading;
  store.__ready = snap.__ready;
  if (store._debounce) {
    clearTimeout(store._debounce);
    store._debounce = null;
  }
}

/**
 * Save / restore document-level lang / dir attributes so tests that mutate
 * them don't bleed into each other.
 */
function snapshotDocumentLang() {
  return {
    htmlLang: globalThis.document.documentElement.getAttribute("lang"),
    htmlDir: globalThis.document.documentElement.getAttribute("dir"),
    htmlXmlLang: globalThis.document.documentElement.getAttribute("xml:lang"),
    htmlXmlDir: globalThis.document.documentElement.getAttribute("xml:dir"),
    bodyLang: globalThis.document.body.getAttribute("lang"),
    bodyDir: globalThis.document.body.getAttribute("dir"),
    bodyXmlLang: globalThis.document.body.getAttribute("xml:lang"),
    bodyXmlDir: globalThis.document.body.getAttribute("xml:dir"),
  };
}

function restoreAttr(el, name, val) {
  if (val === null) {
    el.removeAttribute(name);
  } else {
    el.setAttribute(name, val);
  }
}

function restoreDocumentLang(snap) {
  const html = globalThis.document.documentElement;
  const body = globalThis.document.body;
  restoreAttr(html, "lang", snap.htmlLang);
  restoreAttr(html, "dir", snap.htmlDir);
  restoreAttr(html, "xml:lang", snap.htmlXmlLang);
  restoreAttr(html, "xml:dir", snap.htmlXmlDir);
  restoreAttr(body, "lang", snap.bodyLang);
  restoreAttr(body, "dir", snap.bodyDir);
  restoreAttr(body, "xml:lang", snap.bodyXmlLang);
  restoreAttr(body, "xml:dir", snap.bodyXmlDir);
}

/**
 * Create a canned fetch mock. Returns a function that responds with canned
 * JSON for translation-manifest.json and locale .json files.
 */
function makeFetchMock(manifestData) {
  const calls = [];
  const fn = async (url) => {
    calls.push(url);
    if (url.indexOf("translation-manifest.json") !== -1) {
      return {
        ok: true,
        json: async () => ({ manifest: manifestData }),
      };
    }
    // generic locale file
    return {
      ok: true,
      json: async () => ({ hello: "translated" }),
    };
  };
  fn.calls = calls;
  return fn;
}

// wait helper for setTimeout(0) debounced updates
function nextTick() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("i18n-manager test", () => {
  let element;
  let originalFetch;
  let fetchMock;
  let storeSnap;
  let docSnap;

  beforeEach(async () => {
    // snapshot singleton + document BEFORE creating any fixtures
    storeSnap = snapshotStore(I18NManagerStore);
    docSnap = snapshotDocumentLang();

    // reset singleton to a clean state so events don't double-register
    I18NManagerStore.elements = [];
    I18NManagerStore.locales = new Set([]);
    I18NManagerStore.fetchTargets = {};
    I18NManagerStore.translationManifest = null;
    I18NManagerStore.manifestLoaded = false;
    I18NManagerStore.manifestLoading = false;

    // mock fetch globally to prevent network calls during attribute tests
    originalFetch = globalThis.fetch;
    fetchMock = makeFetchMock({
      "test-el": ["es", "fr"],
      "other-el": ["de"],
      "my-el": ["es"],
      "mb-el": ["es"],
      "t-el": ["es"],
      "good-el": ["es"],
    });
    globalThis.fetch = fetchMock;

    element = await fixture(html`<i18n-manager></i18n-manager>`);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    restoreStore(I18NManagerStore, storeSnap);
    restoreDocumentLang(docSnap);
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  // -------------------------------------------------------------------
  // Construction & static metadata
  // -------------------------------------------------------------------
  describe("construction and static metadata", () => {
    it("instantiates an <i18n-manager> element", () => {
      expect(element).to.be.an.instanceof(I18NManager);
      expect(element.tagName.toLowerCase()).to.equal("i18n-manager");
    });

    it("initialises internal collections in the constructor", () => {
      expect(element.windowControllers).to.exist;
      expect(element.fetchTargets).to.deep.equal({});
      expect(element.elements).to.deep.equal([]);
      expect(element.locales).to.be.an.instanceof(Set);
      expect(element.locales.size).to.equal(0);
      expect(element.translationManifest).to.equal(null);
      expect(element.manifestLoaded).to.equal(false);
      expect(element.manifestLoading).to.equal(false);
    });

    it("exposes static tag returning the tag name", () => {
      expect(I18NManager.tag).to.equal("i18n-manager");
    });

    it("declares lang and dir as observed attributes", () => {
      expect(I18NManager.observedAttributes).to.deep.equal(["lang", "dir"]);
    });
  });

  // -------------------------------------------------------------------
  // documentLang / documentDir getters
  // -------------------------------------------------------------------
  describe("documentLang getter", () => {
    it("reads from <body> lang first", () => {
      globalThis.document.body.setAttribute("lang", "fr");
      globalThis.document.documentElement.setAttribute("lang", "es");
      expect(element.documentLang).to.equal("fr");
    });

    it("reads from <body> xml:lang when lang missing", () => {
      globalThis.document.body.removeAttribute("lang");
      globalThis.document.body.setAttribute("xml:lang", "de");
      globalThis.document.documentElement.setAttribute("lang", "es");
      expect(element.documentLang).to.equal("de");
    });

    it("falls back to <html> lang when body has neither", () => {
      globalThis.document.body.removeAttribute("lang");
      globalThis.document.body.removeAttribute("xml:lang");
      globalThis.document.documentElement.setAttribute("lang", "ja");
      expect(element.documentLang).to.equal("ja");
    });

    it("falls back to <html> xml:lang when html lang missing", () => {
      globalThis.document.body.removeAttribute("lang");
      globalThis.document.body.removeAttribute("xml:lang");
      globalThis.document.documentElement.removeAttribute("lang");
      globalThis.document.documentElement.setAttribute("xml:lang", "zh");
      expect(element.documentLang).to.equal("zh");
    });

    it("falls back to navigator.language when no attributes set", () => {
      globalThis.document.body.removeAttribute("lang");
      globalThis.document.body.removeAttribute("xml:lang");
      globalThis.document.documentElement.removeAttribute("lang");
      globalThis.document.documentElement.removeAttribute("xml:lang");
      expect(element.documentLang).to.equal(globalThis.navigator.language);
    });
  });

  describe("documentDir getter", () => {
    it("reads from <body> dir first", () => {
      globalThis.document.body.setAttribute("dir", "rtl");
      globalThis.document.documentElement.setAttribute("dir", "ltr");
      expect(element.documentDir).to.equal("rtl");
    });

    it("reads from <body> xml:dir when dir missing", () => {
      globalThis.document.body.removeAttribute("dir");
      globalThis.document.body.setAttribute("xml:dir", "rtl");
      globalThis.document.documentElement.setAttribute("dir", "ltr");
      expect(element.documentDir).to.equal("rtl");
    });

    it("falls back to <html> dir when body has neither", () => {
      globalThis.document.body.removeAttribute("dir");
      globalThis.document.body.removeAttribute("xml:dir");
      globalThis.document.documentElement.setAttribute("dir", "rtl");
      expect(element.documentDir).to.equal("rtl");
    });

    it("falls back to <html> xml:dir when html dir missing", () => {
      globalThis.document.body.removeAttribute("dir");
      globalThis.document.body.removeAttribute("xml:dir");
      globalThis.document.documentElement.removeAttribute("dir");
      globalThis.document.documentElement.setAttribute("xml:dir", "rtl");
      expect(element.documentDir).to.equal("rtl");
    });

    it("falls back to ltr when nothing is set", () => {
      globalThis.document.body.removeAttribute("dir");
      globalThis.document.body.removeAttribute("xml:dir");
      globalThis.document.documentElement.removeAttribute("dir");
      globalThis.document.documentElement.removeAttribute("xml:dir");
      expect(element.documentDir).to.equal("ltr");
    });
  });

  // -------------------------------------------------------------------
  // lang / dir property getters & setters
  // -------------------------------------------------------------------
  describe("lang and dir getters/setters", () => {
    it("lang setter sets the attribute and getter reads it", () => {
      element.__ready = false; // prevent async updateLanguage
      element.lang = "es";
      expect(element.getAttribute("lang")).to.equal("es");
      expect(element.lang).to.equal("es");
    });

    it("lang setter with falsy value removes the attribute", () => {
      element.__ready = false;
      element.lang = "es";
      expect(element.hasAttribute("lang")).to.equal(true);
      element.lang = null;
      expect(element.hasAttribute("lang")).to.equal(false);
      expect(element.lang).to.equal(null);
    });

    it("dir setter sets the attribute and getter reads it", () => {
      element.dir = "rtl";
      expect(element.getAttribute("dir")).to.equal("rtl");
      expect(element.dir).to.equal("rtl");
    });

    it("dir setter with falsy value removes the attribute", () => {
      element.dir = "rtl";
      expect(element.hasAttribute("dir")).to.equal(true);
      element.dir = null;
      expect(element.hasAttribute("dir")).to.equal(false);
      expect(element.dir).to.equal(null);
    });
  });

  // -------------------------------------------------------------------
  // connectedCallback / disconnectedCallback
  // -------------------------------------------------------------------
  describe("connectedCallback / disconnectedCallback", () => {
    it("sets __ready to true on connect", () => {
      expect(element.__ready).to.equal(true);
    });

    it("wires a MutationObserver on the document element", () => {
      expect(element._docObserver).to.exist;
    });

    it("updates lang when <html lang> attribute changes via observer", async () => {
      element.__ready = false; // prevent updateLanguage side effects
      globalThis.document.documentElement.setAttribute("lang", "fr");
      // MutationObserver is async; wait a tick
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(element.lang).to.equal("fr");
    });

    it("updates dir when <body dir> attribute changes via observer", async () => {
      globalThis.document.body.setAttribute("dir", "rtl");
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(element.dir).to.equal("rtl");
    });

    it("disconnects observer and aborts window controllers on disconnect", async () => {
      // Use fixture to create a separate element (createElement fails in this
      // browser context because the constructor sets attributes)
      const el = await fixture(html`<i18n-manager></i18n-manager>`);
      expect(el._docObserver).to.exist;
      el.disconnectedCallback();
      expect(el._docObserver).to.equal(null);
      // calling disconnectedCallback again should not throw (observer already null)
      expect(() => el.disconnectedCallback()).to.not.throw();
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
  });

  // -------------------------------------------------------------------
  // changeLanguageEvent
  // -------------------------------------------------------------------
  describe("changeLanguageEvent", () => {
    it("sets lang from event detail when provided", () => {
      element.__ready = false;
      element.changeLanguageEvent({ detail: "de" });
      expect(element.lang).to.equal("de");
    });

    it("falls back to documentLang when no detail is provided", () => {
      element.__ready = false;
      globalThis.document.body.setAttribute("lang", "ja");
      element.changeLanguageEvent({});
      expect(element.lang).to.equal("ja");
    });

    it("falls back to documentLang when event is falsy", () => {
      element.__ready = false;
      globalThis.document.body.setAttribute("lang", "ko");
      element.changeLanguageEvent(null);
      expect(element.lang).to.equal("ko");
    });
  });

  // -------------------------------------------------------------------
  // registerLocalizationEvent
  // -------------------------------------------------------------------
  describe("registerLocalizationEvent", () => {
    it("registers when detail has namespace and localesPath", () => {
      const fakeEvent = {
        detail: {
          namespace: "my-el",
          localesPath: "/locales",
          locales: ["es", "fr"],
        },
      };
      element.registerLocalizationEvent(fakeEvent);
      expect(element.elements.length).to.equal(1);
      expect(element.elements[0].namespace).to.equal("my-el");
    });

    it("does NOT register when detail lacks namespace", () => {
      const fakeEvent = {
        detail: {
          localesPath: "/locales",
          locales: ["es"],
        },
      };
      element.registerLocalizationEvent(fakeEvent);
      expect(element.elements.length).to.equal(0);
    });

    it("does NOT register when detail lacks localesPath", () => {
      const fakeEvent = {
        detail: {
          namespace: "my-el",
          locales: ["es"],
        },
      };
      element.registerLocalizationEvent(fakeEvent);
      expect(element.elements.length).to.equal(0);
    });

    it("normalises detail from context + basePath before registering", () => {
      const fakeContext = globalThis.document.createElement("my-test-el");
      const fakeEvent = {
        detail: {
          context: fakeContext,
          basePath: "/elements/my-test-el",
          locales: ["es"],
        },
      };
      element.registerLocalizationEvent(fakeEvent);
      expect(element.elements.length).to.equal(1);
      expect(element.elements[0].namespace).to.equal("my-test-el");
      expect(element.elements[0].localesPath).to.equal(
        "/elements/my-test-el/../locales",
      );
    });
  });

  // -------------------------------------------------------------------
  // detailNormalize
  // -------------------------------------------------------------------
  describe("detailNormalize", () => {
    it("derives namespace from context.tagName when missing", () => {
      const ctx = globalThis.document.createElement("foo-bar");
      const detail = element.detailNormalize({ context: ctx });
      expect(detail.namespace).to.equal("foo-bar");
    });

    it("does not overwrite an explicit namespace", () => {
      const ctx = globalThis.document.createElement("foo-bar");
      const detail = element.detailNormalize({
        context: ctx,
        namespace: "custom-ns",
      });
      expect(detail.namespace).to.equal("custom-ns");
    });

    it("sets updateCallback to requestUpdate when context has it", () => {
      const ctx = { tagName: "X", requestUpdate: () => {} };
      const detail = element.detailNormalize({ context: ctx });
      expect(detail.updateCallback).to.equal("requestUpdate");
    });

    it("sets updateCallback to render when context has render but no requestUpdate", () => {
      const ctx = { tagName: "X", render: () => {} };
      const detail = element.detailNormalize({ context: ctx });
      expect(detail.updateCallback).to.equal("render");
    });

    it("does not set updateCallback when context has neither", () => {
      const ctx = { tagName: "X" };
      const detail = element.detailNormalize({ context: ctx });
      expect(detail.updateCallback).to.equal(undefined);
    });

    it("derives localesPath from basePath when missing", () => {
      const detail = element.detailNormalize({
        basePath: "/elements/my-el",
        namespace: "my-el",
      });
      expect(detail.localesPath).to.equal("/elements/my-el/../locales");
    });

    it("decodes URI-encoded basePath when deriving localesPath", () => {
      const detail = element.detailNormalize({
        basePath: "/elements/my%20el",
        namespace: "my-el",
      });
      expect(detail.localesPath).to.equal("/elements/my el/../locales");
    });

    it("copies _t snapshot from context.t when context has t", () => {
      const ctx = { tagName: "X", t: { hello: "world" } };
      const detail = element.detailNormalize({ context: ctx });
      expect(ctx._t).to.deep.equal({ hello: "world" });
    });

    it("does not set _t when context has no t", () => {
      const ctx = { tagName: "X" };
      const detail = element.detailNormalize({ context: ctx });
      expect(ctx._t).to.equal(undefined);
    });

    it("copies localesPath from a matching registered element", () => {
      // pre-register an element with same namespace
      element.elements.push({
        namespace: "shared-ns",
        localesPath: "/shared/locales",
        locales: ["es", "fr"],
      });
      const ctx = { tagName: "SHARED-NS" };
      const detail = element.detailNormalize({
        context: ctx,
        namespace: "shared-ns",
        localesPath: "/initial/path",
      });
      expect(detail.localesPath).to.equal("/shared/locales");
      expect(detail.locales).to.deep.equal(["es", "fr"]);
    });

    it("copies localesPath but not locales when match has no locales", () => {
      element.elements.push({
        namespace: "shared-ns",
        localesPath: "/shared/locales",
        locales: null,
      });
      const ctx = { tagName: "SHARED-NS" };
      const detail = element.detailNormalize({
        context: ctx,
        namespace: "shared-ns",
        localesPath: "/initial/path",
      });
      expect(detail.localesPath).to.equal("/shared/locales");
      expect(detail.locales).to.equal(undefined);
    });

    it("returns detail unchanged when no context is provided", () => {
      const detail = element.detailNormalize({
        namespace: "no-ctx",
        localesPath: "/locales",
      });
      expect(detail.namespace).to.equal("no-ctx");
      expect(detail.localesPath).to.equal("/locales");
    });
  });

  // -------------------------------------------------------------------
  // registerLocalization
  // -------------------------------------------------------------------
  describe("registerLocalization", () => {
    it("registers a detail without context when namespace is new", () => {
      element.registerLocalization({
        namespace: "no-ctx-el",
        localesPath: "/locales",
        locales: ["es"],
      });
      expect(element.elements.length).to.equal(1);
      expect(element.elements[0].namespace).to.equal("no-ctx-el");
    });

    it("does not register without context when namespace already exists", () => {
      element.registerLocalization({
        namespace: "no-ctx-el",
        localesPath: "/locales",
        locales: ["es"],
      });
      element.registerLocalization({
        namespace: "no-ctx-el",
        localesPath: "/other/locales",
        locales: ["fr"],
      });
      expect(element.elements.length).to.equal(1);
    });

    it("registers with context when the context object is new", () => {
      const ctx1 = { tagName: "A", t: {} };
      const ctx2 = { tagName: "A", t: {} };
      element.registerLocalization({
        context: ctx1,
        namespace: "a-el",
        localesPath: "/locales",
      });
      element.registerLocalization({
        context: ctx2,
        namespace: "a-el",
        localesPath: "/locales",
      });
      expect(element.elements.length).to.equal(2);
    });

    it("does not register with context when the same context already registered", () => {
      const ctx = { tagName: "A", t: {} };
      element.registerLocalization({
        context: ctx,
        namespace: "a-el",
        localesPath: "/locales",
      });
      element.registerLocalization({
        context: ctx,
        namespace: "a-el",
        localesPath: "/locales",
      });
      expect(element.elements.length).to.equal(1);
    });

    it("adds locales to the this.locales Set", () => {
      element.registerLocalization({
        namespace: "el1",
        localesPath: "/l",
        locales: ["es", "fr", "de"],
      });
      expect(element.locales.has("es")).to.equal(true);
      expect(element.locales.has("fr")).to.equal(true);
      expect(element.locales.has("de")).to.equal(true);
    });

    it("triggers debounced updateLanguage when ready, lang matches, and locale supports it", async () => {
      element.__ready = true;
      element.lang = "es";
      const ctx = {
        tagName: "T",
        t: { hello: "Hello" },
        requestUpdate: () => {},
      };
      element.registerLocalization({
        context: ctx,
        namespace: "t-el",
        localesPath: "/locales",
        locales: ["es", "en"],
      });
      // wait for setTimeout(0) debounce
      await nextTick();
      await nextTick();
      // fetch should have been called for the locale file
      expect(fetchMock.calls.length).to.be.greaterThan(0);
      // the t object should have been updated with fetched data
      expect(ctx.t.hello).to.equal("translated");
    });

    it("does NOT trigger updateLanguage when lang is en and locales do not include en", async () => {
      element.__ready = true;
      element.lang = "en";
      const ctx = {
        tagName: "T",
        t: { hello: "Hello" },
        requestUpdate: () => {},
      };
      element.registerLocalization({
        context: ctx,
        namespace: "t-el",
        localesPath: "/locales",
        locales: ["es", "fr"], // does NOT include en
      });
      await nextTick();
      await nextTick();
      // no fetch calls at all (no manifest load for en, no locale file fetch)
      expect(fetchMock.calls.length).to.equal(0);
    });

    it("triggers updateLanguage for manifest-based elements (no locales) with non-en lang", async () => {
      element.__ready = true;
      element.lang = "es";
      const ctx = {
        tagName: "T",
        t: { hello: "Hello" },
        requestUpdate: () => {},
      };
      element.registerLocalization({
        context: ctx,
        namespace: "t-el",
        localesPath: "/locales",
        // no locales array → manifest-based; "t-el" is in mock manifest
      });
      await nextTick();
      await nextTick();
      expect(fetchMock.calls.length).to.be.greaterThan(0);
      expect(ctx.t.hello).to.equal("translated");
    });

    it("does NOT trigger updateLanguage for manifest-based elements when lang is en", async () => {
      element.__ready = true;
      element.lang = "en";
      const ctx = {
        tagName: "T",
        t: { hello: "Hello" },
        requestUpdate: () => {},
      };
      element.registerLocalization({
        context: ctx,
        namespace: "t-el",
        localesPath: "/locales",
      });
      await nextTick();
      await nextTick();
      const localeCalls = fetchMock.calls.filter(
        (c) => c.indexOf("translation-manifest.json") === -1,
      );
      expect(localeCalls.length).to.equal(0);
    });
  });

  // -------------------------------------------------------------------
  // loadTranslationManifest
  // -------------------------------------------------------------------
  describe("loadTranslationManifest", () => {
    it("fetches and caches the manifest on first call", async () => {
      const result = await element.loadTranslationManifest();
      // loadTranslationManifest extracts data.manifest, so the result is the
      // manifest object itself, not wrapped in a manifest key
      expect(result).to.deep.equal({
        "test-el": ["es", "fr"],
        "other-el": ["de"],
        "my-el": ["es"],
        "mb-el": ["es"],
        "t-el": ["es"],
        "good-el": ["es"],
      });
      expect(element.manifestLoaded).to.equal(true);
      expect(element.manifestLoading).to.equal(false);
      expect(fetchMock.calls.length).to.equal(1);
      expect(fetchMock.calls[0].indexOf("translation-manifest.json")).to.not.equal(
        -1,
      );
    });

    it("short-circuits on second call (manifestLoaded guard)", async () => {
      await element.loadTranslationManifest();
      const callsAfterFirst = fetchMock.calls.length;
      const result = await element.loadTranslationManifest();
      expect(fetchMock.calls.length).to.equal(callsAfterFirst);
      expect(result).to.deep.equal({
        "test-el": ["es", "fr"],
        "other-el": ["de"],
        "my-el": ["es"],
        "mb-el": ["es"],
        "t-el": ["es"],
        "good-el": ["es"],
      });
    });

    it("short-circuits when manifestLoading is true (in-flight guard)", async () => {
      element.manifestLoading = true;
      element.translationManifest = { preloaded: ["xx"] };
      const result = await element.loadTranslationManifest();
      expect(fetchMock.calls.length).to.equal(0);
      expect(result).to.deep.equal({ preloaded: ["xx"] });
    });

    it("sets manifest to {} and manifestLoaded=true when response is not ok", async () => {
      // override fetch to return not-ok response
      globalThis.fetch = async () => ({ ok: false });
      const result = await element.loadTranslationManifest();
      expect(result).to.deep.equal({});
      expect(element.manifestLoaded).to.equal(true);
      expect(element.manifestLoading).to.equal(false);
    });

    it("sets manifest to {} and manifestLoaded=true when fetch throws", async () => {
      globalThis.fetch = async () => {
        throw new Error("network error");
      };
      const result = await element.loadTranslationManifest();
      expect(result).to.deep.equal({});
      expect(element.manifestLoaded).to.equal(true);
      expect(element.manifestLoading).to.equal(false);
    });

    it("uses data.manifest when response json has manifest key", async () => {
      globalThis.fetch = async () => ({
        ok: true,
        json: async () => ({
          manifest: { "custom-el": ["xx", "yy"] },
          _meta: { extra: true },
        }),
      });
      const result = await element.loadTranslationManifest();
      expect(result).to.deep.equal({ "custom-el": ["xx", "yy"] });
      expect(element.translationManifest).to.deep.equal({
        "custom-el": ["xx", "yy"],
      });
    });

    it("defaults to {} when manifest key is missing from response", async () => {
      globalThis.fetch = async () => ({
        ok: true,
        json: async () => ({ _meta: { noManifest: true } }),
      });
      const result = await element.loadTranslationManifest();
      expect(result).to.deep.equal({});
    });
  });

  // -------------------------------------------------------------------
  // hasTranslation
  // -------------------------------------------------------------------
  describe("hasTranslation", () => {
    it("returns false when manifest is not loaded", () => {
      element.manifestLoaded = false;
      expect(element.hasTranslation("test-el", "es")).to.equal(false);
    });

    it("returns false when manifest is null even if manifestLoaded is true", () => {
      element.manifestLoaded = true;
      element.translationManifest = null;
      expect(element.hasTranslation("test-el", "es")).to.equal(false);
    });

    it("returns true when namespace supports the language", () => {
      element.manifestLoaded = true;
      element.translationManifest = { "test-el": ["es", "fr"] };
      expect(element.hasTranslation("test-el", "es")).to.equal(true);
      expect(element.hasTranslation("test-el", "fr")).to.equal(true);
    });

    it("returns a falsy value when namespace does not support the language", () => {
      element.manifestLoaded = true;
      element.translationManifest = { "test-el": ["es", "fr"] };
      // Note: returns false because Array.includes returns false
      expect(element.hasTranslation("test-el", "de")).to.equal(false);
    });

    it("returns a falsy value when namespace is not in manifest", () => {
      element.manifestLoaded = true;
      element.translationManifest = { "test-el": ["es"] };
      // Note: returns undefined because translationManifest[namespace] is
      // undefined and undefined && ... short-circuits to undefined.
      // This is a minor type inconsistency (undefined vs false) but is falsy.
      expect(element.hasTranslation("missing-el", "es")).to.not.equal(true);
    });
  });

  // -------------------------------------------------------------------
  // needsManifest
  // -------------------------------------------------------------------
  describe("needsManifest", () => {
    it("returns false for en", () => {
      expect(element.needsManifest("en")).to.equal(false);
    });

    it("returns false for en-US", () => {
      expect(element.needsManifest("en-US")).to.equal(false);
    });

    it("returns false for en-GB", () => {
      expect(element.needsManifest("en-GB")).to.equal(false);
    });

    it("returns true for es", () => {
      expect(element.needsManifest("es")).to.equal(true);
    });

    it("returns true for fr-CA", () => {
      expect(element.needsManifest("fr-CA")).to.equal(true);
    });

    it("returns a falsy value for null/empty/undefined language", () => {
      // Note: returns null/undefined (falsy) rather than false due to
      // short-circuit evaluation: null && ... → null. Minor type inconsistency.
      expect(element.needsManifest(null)).to.not.equal(true);
      expect(element.needsManifest("")).to.not.equal(true);
      expect(element.needsManifest(undefined)).to.not.equal(true);
    });
  });

  // -------------------------------------------------------------------
  // _fetchJsonTarget
  // -------------------------------------------------------------------
  describe("_fetchJsonTarget", () => {
    it("returns parsed JSON on a successful ok response", async () => {
      globalThis.fetch = async () => ({
        ok: true,
        json: async () => ({ key: "val" }),
      });
      const result = await element._fetchJsonTarget("/some/file.json");
      expect(result).to.deep.equal({ key: "val" });
    });

    it("returns false when response is not ok", async () => {
      globalThis.fetch = async () => ({ ok: false });
      const result = await element._fetchJsonTarget("/some/file.json");
      expect(result).to.equal(false);
    });

    it("returns false when fetch throws", async () => {
      globalThis.fetch = async () => {
        throw new Error("boom");
      };
      const result = await element._fetchJsonTarget("/some/file.json");
      expect(result).to.equal(false);
    });

    it("returns false when response has no json method", async () => {
      globalThis.fetch = async () => ({ ok: true });
      const result = await element._fetchJsonTarget("/some/file.json");
      expect(result).to.equal(false);
    });

    it("returns false when response is falsy", async () => {
      globalThis.fetch = async () => null;
      const result = await element._fetchJsonTarget("/some/file.json");
      expect(result).to.equal(false);
    });
  });

  // -------------------------------------------------------------------
  // loadNamespaceFile
  // -------------------------------------------------------------------
  describe("loadNamespaceFile", () => {
    it("returns undefined when no element matches the namespace", async () => {
      const result = await element.loadNamespaceFile("missing-ns", "es");
      expect(result).to.equal(undefined);
    });

    it("returns {} when no locale support (namespace not in manifest, component doesn't support lang)", async () => {
      element.elements.push({
        namespace: "my-el",
        localesPath: "/locales",
        locales: ["en"], // only en, we request de; "my-el" in manifest supports ["es"] not de
      });
      const result = await element.loadNamespaceFile("my-el", "de");
      expect(result).to.deep.equal({});
    });

    it("fetches exact locale match via manifest support", async () => {
      element.elements.push({
        namespace: "my-el",
        localesPath: "/locales",
        locales: ["es", "en"],
        context: {},
      });
      // "my-el" is in mock manifest with ["es"], so supportsExact will be true
      const result = await element.loadNamespaceFile("my-el", "es");
      expect(result).to.deep.equal({ hello: "translated" });
      expect(
        element.fetchTargets["/locales/my-el.es.json"],
      ).to.deep.equal({ hello: "translated" });
    });

    it("fetches base locale match (e.g. es from es-MX) via manifest support", async () => {
      element.elements.push({
        namespace: "my-el",
        localesPath: "/locales",
        locales: ["es", "en"],
        context: {},
      });
      // "my-el" supports "es" in manifest, so base match for es-MX works
      const result = await element.loadNamespaceFile("my-el", "es-MX");
      expect(result).to.deep.equal({ hello: "translated" });
      expect(
        element.fetchTargets["/locales/my-el.es.json"],
      ).to.deep.equal({ hello: "translated" });
    });

    it("fetches via component locales when manifest not loaded (en lang)", async () => {
      element.elements.push({
        namespace: "comp-el",
        localesPath: "/locales",
        locales: ["en", "es"],
        context: {},
      });
      // "en" does not trigger manifest load, so manifestLoaded stays false
      // and component locales are used as fallback
      const result = await element.loadNamespaceFile("comp-el", "en");
      expect(result).to.deep.equal({ hello: "translated" });
      expect(
        element.fetchTargets["/locales/comp-el.en.json"],
      ).to.deep.equal({ hello: "translated" });
    });

    it("caches fetch results in fetchTargets (second call reuses cache)", async () => {
      element.elements.push({
        namespace: "my-el",
        localesPath: "/locales",
        locales: ["es"],
        context: {},
      });
      let fetchCount = 0;
      globalThis.fetch = async (url) => {
        if (url.indexOf("translation-manifest.json") !== -1) {
          return {
            ok: true,
            json: async () => ({ manifest: { "my-el": ["es"] } }),
          };
        }
        fetchCount++;
        return { ok: true, json: async () => ({ cached: true }) };
      };
      await element.loadNamespaceFile("my-el", "es");
      const countAfterFirst = fetchCount;
      await element.loadNamespaceFile("my-el", "es");
      // second call should reuse cache for locale file
      expect(fetchCount).to.equal(countAfterFirst);
    });

    it("loads manifest first for non-en language when not yet loaded", async () => {
      element.elements.push({
        namespace: "my-el",
        localesPath: "/locales",
        locales: ["es"],
        context: {},
      });
      let manifestCalled = false;
      globalThis.fetch = async (url) => {
        if (url.indexOf("translation-manifest.json") !== -1) {
          manifestCalled = true;
          return {
            ok: true,
            json: async () => ({ manifest: { "my-el": ["es"] } }),
          };
        }
        return { ok: true, json: async () => ({ data: 1 }) };
      };
      await element.loadNamespaceFile("my-el", "es");
      expect(manifestCalled).to.equal(true);
      expect(element.manifestLoaded).to.equal(true);
    });

    it("attempts load for manifest-based element with no locales when needsManifest", async () => {
      element.elements.push({
        namespace: "mb-el",
        localesPath: "/locales",
        // no locales → manifest-based; "mb-el" is in mock manifest with ["es"]
        context: {},
      });
      let localeUrl = null;
      globalThis.fetch = async (url) => {
        if (url.indexOf("translation-manifest.json") !== -1) {
          return {
            ok: true,
            json: async () => ({ manifest: { "mb-el": ["es"] } }),
          };
        }
        localeUrl = url;
        return { ok: true, json: async () => ({ fetched: true }) };
      };
      const result = await element.loadNamespaceFile("mb-el", "es");
      expect(localeUrl).to.not.equal(null);
      expect(result).to.deep.equal({ fetched: true });
    });
  });

  // -------------------------------------------------------------------
  // updateLanguage
  // -------------------------------------------------------------------
  describe("updateLanguage", () => {
    it("is a no-op when lang is falsy", async () => {
      const ctx = {
        tagName: "T",
        t: { a: "b" },
        requestUpdate: () => {},
      };
      element.registerLocalization({
        context: ctx,
        namespace: "t-el",
        localesPath: "/locales",
        locales: ["es"],
      });
      await element.updateLanguage(null);
      // t should not have been modified
      expect(ctx.t).to.deep.equal({ a: "b" });
    });

    it("updates t with fetched locale data for matching elements", async () => {
      const ctx = {
        tagName: "T",
        t: { hello: "Hello", bye: "Bye" },
        requestUpdate: () => {},
      };
      element.registerLocalization({
        context: ctx,
        namespace: "t-el",
        localesPath: "/locales",
        locales: ["es", "en"],
      });
      globalThis.fetch = async (url) => {
        if (url.indexOf("translation-manifest.json") !== -1) {
          return {
            ok: true,
            json: async () => ({ manifest: { "t-el": ["es"] } }),
          };
        }
        return { ok: true, json: async () => ({ hello: "Hola" }) };
      };
      await element.updateLanguage("es");
      expect(ctx.t.hello).to.equal("Hola");
      expect(ctx.t.bye).to.equal("Bye"); // unchanged
    });

    it("resets t to _t fallback for elements that do not support the language", async () => {
      const ctx = {
        tagName: "T",
        t: { hello: "Original" },
        requestUpdate: () => {},
      };
      element.registerLocalization({
        context: ctx,
        namespace: "unsupported-el", // not in mock manifest
        localesPath: "/locales",
        locales: ["en"], // does not include es
      });
      // After registration, detailNormalize sets _t = { hello: "Original" }
      // Now modify t to simulate a prior translation that should be reverted
      ctx.t = { hello: "Changed" };
      // Set manifest as loaded with no support for "unsupported-el"
      element.manifestLoaded = true;
      element.translationManifest = {};
      await element.updateLanguage("es");
      // t should be reset to _t (the original snapshot)
      expect(ctx.t.hello).to.equal("Original");
    });

    it("uses cached fetchTargets on subsequent updateLanguage calls", async () => {
      const ctx = {
        tagName: "T",
        t: { hello: "Hello" },
        requestUpdate: () => {},
      };
      element.registerLocalization({
        context: ctx,
        namespace: "t-el",
        localesPath: "/locales",
        locales: ["es"],
      });
      let fetchCount = 0;
      globalThis.fetch = async (url) => {
        fetchCount++;
        if (url.indexOf("translation-manifest.json") !== -1) {
          return {
            ok: true,
            json: async () => ({ manifest: { "t-el": ["es"] } }),
          };
        }
        return { ok: true, json: async () => ({ hello: "Hola" }) };
      };
      await element.updateLanguage("es");
      const countAfterFirst = fetchCount;
      await element.updateLanguage("es");
      // second call should reuse cache for locale file
      // (manifest may or may not be called again depending on manifestLoaded guard)
      expect(fetchCount).to.equal(countAfterFirst);
    });

    it("calls updateCallback on context after updating t", async () => {
      let updateCalled = false;
      const ctx = {
        tagName: "T",
        t: { hello: "Hello" },
        requestUpdate: () => {
          updateCalled = true;
        },
      };
      element.registerLocalization({
        context: ctx,
        namespace: "t-el",
        localesPath: "/locales",
        locales: ["es"],
      });
      globalThis.fetch = async (url) => {
        if (url.indexOf("translation-manifest.json") !== -1) {
          return {
            ok: true,
            json: async () => ({ manifest: { "t-el": ["es"] } }),
          };
        }
        return { ok: true, json: async () => ({ hello: "Hola" }) };
      };
      await element.updateLanguage("es");
      expect(updateCalled).to.equal(true);
    });

    it("handles errors in element filter gracefully (falls back)", async () => {
      // register an element whose context will cause an error in filter
      const badEl = {
        namespace: "bad-el",
        localesPath: "/locales",
        locales: ["es"],
        context: null, // won't cause error in filter but in fallback
      };
      element.elements.push(badEl);
      // also add a good element
      const ctx = {
        tagName: "T",
        t: { hello: "Hello" },
        requestUpdate: () => {},
      };
      element.registerLocalization({
        context: ctx,
        namespace: "good-el",
        localesPath: "/locales",
        locales: ["es"],
      });
      globalThis.fetch = async (url) => {
        if (url.indexOf("translation-manifest.json") !== -1) {
          return {
            ok: true,
            json: async () => ({ manifest: { "good-el": ["es"] } }),
          };
        }
        return { ok: true, json: async () => ({ hello: "Hola" }) };
      };
      // should not throw
      await element.updateLanguage("es");
      expect(ctx.t.hello).to.equal("Hola");
    });
  });

  // -------------------------------------------------------------------
  // attributeChangedCallback
  // -------------------------------------------------------------------
  describe("attributeChangedCallback", () => {
    it("dispatches lang-changed event when lang attribute changes", () => {
      element.__ready = false;
      let fired = false;
      let firedValue = null;
      element.addEventListener("lang-changed", (e) => {
        fired = true;
        firedValue = e.detail.value;
      });
      element.attributeChangedCallback("lang", "en", "es");
      expect(fired).to.equal(true);
      expect(firedValue).to.equal("es");
    });

    it("dispatches dir-changed event when dir attribute changes", () => {
      let fired = false;
      let firedValue = null;
      element.addEventListener("dir-changed", (e) => {
        fired = true;
        firedValue = e.detail.value;
      });
      element.attributeChangedCallback("dir", "ltr", "rtl");
      expect(fired).to.equal(true);
      expect(firedValue).to.equal("rtl");
    });

    it("triggers updateLanguage when lang changes and __ready is true", async () => {
      element.__ready = true;
      const ctx = {
        tagName: "T",
        t: { hello: "Hello" },
        requestUpdate: () => {},
      };
      element.registerLocalization({
        context: ctx,
        namespace: "t-el",
        localesPath: "/locales",
        locales: ["es"],
      });
      globalThis.fetch = async (url) => {
        if (url.indexOf("translation-manifest.json") !== -1) {
          return {
            ok: true,
            json: async () => ({ manifest: { "t-el": ["es"] } }),
          };
        }
        return { ok: true, json: async () => ({ hello: "Hola" }) };
      };
      element.attributeChangedCallback("lang", "en", "es");
      // updateLanguage is async; wait for it
      await nextTick();
      await nextTick();
      expect(ctx.t.hello).to.equal("Hola");
    });

    it("does NOT trigger updateLanguage when __ready is false", async () => {
      element.__ready = false;
      const ctx = {
        tagName: "T",
        t: { hello: "Hello" },
        requestUpdate: () => {},
      };
      element.registerLocalization({
        context: ctx,
        namespace: "t-el",
        localesPath: "/locales",
        locales: ["es"],
      });
      let fetchCalled = false;
      globalThis.fetch = async () => {
        fetchCalled = true;
        return { ok: true, json: async () => ({}) };
      };
      element.attributeChangedCallback("lang", "en", "es");
      await nextTick();
      expect(fetchCalled).to.equal(false);
    });

    it("does NOT trigger updateLanguage when newValue is falsy", async () => {
      element.__ready = true;
      let fetchCalled = false;
      globalThis.fetch = async () => {
        fetchCalled = true;
        return { ok: true, json: async () => ({}) };
      };
      element.attributeChangedCallback("lang", "es", null);
      await nextTick();
      expect(fetchCalled).to.equal(false);
    });
  });

  // -------------------------------------------------------------------
  // I18NManagerStore singleton
  // -------------------------------------------------------------------
  describe("I18NManagerStore singleton", () => {
    it("is an instance of I18NManager", () => {
      expect(I18NManagerStore).to.be.an.instanceof(I18NManager);
    });

    it("is connected to document.body", () => {
      expect(I18NManagerStore.parentNode).to.equal(globalThis.document.body);
    });

    it("requestAvailability returns the same instance", () => {
      const again = globalThis.I18NManagerStore.requestAvailability();
      expect(again).to.equal(I18NManagerStore);
    });
  });
});

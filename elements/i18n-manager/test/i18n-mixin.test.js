import { fixture, expect, html } from "@open-wc/testing";
import { LitElement } from "lit";
import { I18NMixin, I18NManagerStore } from "../lib/I18NMixin.js";

// Ensure the underlying manager module is loaded and instrumented
import "../i18n-manager.js";

// ---------------------------------------------------------------------------
// Test fixture: a throwaway LitElement subclass using I18NMixin
// ---------------------------------------------------------------------------
class TestI18nElement extends I18NMixin(LitElement) {
  static get tag() {
    return "test-i18n-element";
  }
}
customElements.define(TestI18nElement.tag, TestI18nElement);

// A non-Lit class that only has requestUpdate (to exercise that branch)
class TestRequestUpdateElement extends I18NMixin(HTMLElement) {
  static get tag() {
    return "test-req-update-element";
  }
  requestUpdate() {
    this.__updated = true;
  }
}
customElements.define(TestRequestUpdateElement.tag, TestRequestUpdateElement);

// A non-Lit class that only has render (to exercise the render fallback)
class TestRenderElement extends I18NMixin(HTMLElement) {
  static get tag() {
    return "test-render-element";
  }
  render() {
    this.__rendered = true;
  }
}
customElements.define(TestRenderElement.tag, TestRenderElement);

// A bare class with neither requestUpdate nor render
class TestBareElement extends I18NMixin(HTMLElement) {
  static get tag() {
    return "test-bare-element";
  }
}
customElements.define(TestBareElement.tag, TestBareElement);

// ---------------------------------------------------------------------------
// Helpers (mirrors the pattern in i18n-manager.test.js)
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("I18NMixin", () => {
  let storeSnap;
  let originalFetch;

  beforeEach(() => {
    storeSnap = snapshotStore(I18NManagerStore);
    I18NManagerStore.elements = [];
    I18NManagerStore.locales = new Set([]);
    I18NManagerStore.fetchTargets = {};
    I18NManagerStore.translationManifest = null;
    I18NManagerStore.manifestLoaded = false;
    I18NManagerStore.manifestLoading = false;
    originalFetch = globalThis.fetch;
    globalThis.fetch = async () => ({
      ok: true,
      json: async () => ({ manifest: {} }),
    });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    restoreStore(I18NManagerStore, storeSnap);
  });

  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------
  describe("constructor", () => {
    it("initialises t to {} when the superclass does not define it", async () => {
      const el = await fixture(html`<test-i18n-element></test-i18n-element>`);
      expect(el.t).to.deep.equal({});
    });

    it("preserves a pre-existing t object from the superclass", async () => {
      // create a subclass that sets t in its constructor
      class WithT extends I18NMixin(LitElement) {
        constructor() {
          super();
          this.t = { preset: true };
        }
        static get tag() {
          return "test-with-t";
        }
      }
      customElements.define(WithT.tag, WithT);
      const el = await fixture(html`<test-with-t></test-with-t>`);
      expect(el.t).to.deep.equal({ preset: true });
    });

    it("initialises t to {} for a non-LitElement base", async () => {
      const el = await fixture(html`<test-bare-element></test-bare-element>`);
      expect(el.t).to.deep.equal({});
    });
  });

  // -----------------------------------------------------------------
  // static properties
  // -----------------------------------------------------------------
  describe("static properties", () => {
    it("adds t as an Object property to the subclass", () => {
      expect(TestI18nElement.properties).to.exist;
      expect(TestI18nElement.properties.t).to.exist;
      expect(TestI18nElement.properties.t.type).to.equal(Object);
    });

    it("merges with superclass properties", () => {
      class Parent extends LitElement {
        static get properties() {
          return { foo: { type: String } };
        }
        static get tag() {
          return "test-parent-props";
        }
      }
      customElements.define(Parent.tag, Parent);
      class Child extends I18NMixin(Parent) {
        static get tag() {
          return "test-child-props";
        }
      }
      customElements.define(Child.tag, Child);
      expect(Child.properties.foo).to.exist;
      expect(Child.properties.t).to.exist;
    });
  });

  // -----------------------------------------------------------------
  // registerLocalization
  // -----------------------------------------------------------------
  describe("registerLocalization", () => {
    it("forwards the detail to I18NManagerStore.registerLocalization", async () => {
      const el = await fixture(html`<test-i18n-element></test-i18n-element>`);
      el.registerLocalization({
        namespace: "manual-ns",
        context: el,
        localesPath: "/manual/locales",
        locales: ["es"],
      });
      expect(I18NManagerStore.elements.length).to.equal(1);
      expect(I18NManagerStore.elements[0].namespace).to.equal("manual-ns");
    });

    it("auto-derives namespace from context.tagName when missing", async () => {
      const el = await fixture(html`<test-i18n-element></test-i18n-element>`);
      el.registerLocalization({
        context: el,
        localesPath: "/locales",
        locales: ["es"],
      });
      expect(I18NManagerStore.elements[0].namespace).to.equal(
        "test-i18n-element",
      );
    });

    it("does not overwrite an explicit namespace", async () => {
      const el = await fixture(html`<test-i18n-element></test-i18n-element>`);
      el.registerLocalization({
        context: el,
        namespace: "explicit-ns",
        localesPath: "/locales",
        locales: ["es"],
      });
      expect(I18NManagerStore.elements[0].namespace).to.equal("explicit-ns");
    });

    it("auto-detects updateCallback as requestUpdate for LitElement-based class", async () => {
      const el = await fixture(html`<test-i18n-element></test-i18n-element>`);
      el.registerLocalization({
        context: el,
        localesPath: "/locales",
        locales: ["es"],
      });
      expect(I18NManagerStore.elements[0].updateCallback).to.equal(
        "requestUpdate",
      );
    });

    it("auto-detects updateCallback as requestUpdate for a class with requestUpdate", async () => {
      const el = await fixture(
        html`<test-req-update-element></test-req-update-element>`,
      );
      el.registerLocalization({
        context: el,
        localesPath: "/locales",
        locales: ["es"],
      });
      expect(I18NManagerStore.elements[0].updateCallback).to.equal(
        "requestUpdate",
      );
    });

    it("auto-detects updateCallback as render when only render is available", async () => {
      const el = await fixture(
        html`<test-render-element></test-render-element>`,
      );
      el.registerLocalization({
        context: el,
        localesPath: "/locales",
        locales: ["es"],
      });
      expect(I18NManagerStore.elements[0].updateCallback).to.equal("render");
    });

    it("leaves updateCallback undefined when neither requestUpdate nor render exist", async () => {
      const el = await fixture(html`<test-bare-element></test-bare-element>`);
      el.registerLocalization({
        context: el,
        localesPath: "/locales",
        locales: ["es"],
      });
      expect(I18NManagerStore.elements[0].updateCallback).to.equal(undefined);
    });

    it("does not overwrite an explicit updateCallback", async () => {
      const el = await fixture(html`<test-i18n-element></test-i18n-element>`);
      el.registerLocalization({
        context: el,
        updateCallback: "myCustomCallback",
        localesPath: "/locales",
        locales: ["es"],
      });
      expect(I18NManagerStore.elements[0].updateCallback).to.equal(
        "myCustomCallback",
      );
    });

    it("auto-derives localesPath from basePath when missing", async () => {
      const el = await fixture(html`<test-i18n-element></test-i18n-element>`);
      el.registerLocalization({
        context: el,
        basePath: "/elements/test-i18n-element",
        locales: ["es"],
      });
      expect(I18NManagerStore.elements[0].localesPath).to.equal(
        "/elements/test-i18n-element/../locales",
      );
    });

    it("decodes URI-encoded basePath", async () => {
      const el = await fixture(html`<test-i18n-element></test-i18n-element>`);
      el.registerLocalization({
        context: el,
        basePath: "/path/to/my%20element",
        locales: ["es"],
      });
      expect(I18NManagerStore.elements[0].localesPath).to.equal(
        "/path/to/my element/../locales",
      );
    });

    it("does not overwrite an explicit localesPath", async () => {
      const el = await fixture(html`<test-i18n-element></test-i18n-element>`);
      el.registerLocalization({
        context: el,
        basePath: "/elements/test",
        localesPath: "/explicit/locales",
        locales: ["es"],
      });
      expect(I18NManagerStore.elements[0].localesPath).to.equal(
        "/explicit/locales",
      );
    });

    // NOTE: I18NMixin.registerLocalization guards against missing tagName on
    // context (line 32-37), but I18NManager.detailNormalize (line 173-174) does
    // NOT guard detail.context.tagName before calling .toLowerCase(). So when a
    // plain object context (no tagName) is passed, the mixin won't set the
    // namespace but the store's detailNormalize will throw. This is a genuine
    // bug in i18n-manager.js:174 — reported, not fixed here.
    it("does not throw when context has tagName but no namespace (mixin guard works)", async () => {
      const el = await fixture(html`<test-i18n-element></test-i18n-element>`);
      // context is a real element with tagName, so detailNormalize works
      el.registerLocalization({
        context: el,
        localesPath: "/locales",
        locales: ["es"],
      });
      expect(I18NManagerStore.elements[0].namespace).to.equal(
        "test-i18n-element",
      );
    });

    it("stores a _t snapshot when context has t", async () => {
      const el = await fixture(html`<test-i18n-element></test-i18n-element>`);
      el.t = { hello: "world" };
      el.registerLocalization({
        context: el,
        localesPath: "/locales",
        locales: ["es"],
      });
      expect(I18NManagerStore.elements[0].context._t).to.deep.equal({
        hello: "world",
      });
    });
  });

  // -----------------------------------------------------------------
  // Integration: mixin + store round-trip
  // -----------------------------------------------------------------
  describe("integration with I18NManagerStore", () => {
    it("element registered via mixin appears in store.elements and store.locales", async () => {
      const el = await fixture(html`<test-i18n-element></test-i18n-element>`);
      el.registerLocalization({
        context: el,
        localesPath: "/locales",
        locales: ["es", "fr", "de"],
      });
      expect(I18NManagerStore.elements.length).to.equal(1);
      expect(I18NManagerStore.locales.has("es")).to.equal(true);
      expect(I18NManagerStore.locales.has("fr")).to.equal(true);
      expect(I18NManagerStore.locales.has("de")).to.equal(true);
    });

    it("multiple elements with different contexts both register", async () => {
      const el1 = await fixture(html`<test-i18n-element></test-i18n-element>`);
      const el2 = await fixture(html`<test-i18n-element></test-i18n-element>`);
      el1.registerLocalization({
        context: el1,
        localesPath: "/locales",
        locales: ["es"],
      });
      el2.registerLocalization({
        context: el2,
        localesPath: "/locales",
        locales: ["fr"],
      });
      expect(I18NManagerStore.elements.length).to.equal(2);
    });

    it("same context object does not register twice", async () => {
      const el = await fixture(html`<test-i18n-element></test-i18n-element>`);
      const detail = {
        context: el,
        localesPath: "/locales",
        locales: ["es"],
      };
      el.registerLocalization(detail);
      el.registerLocalization(detail);
      expect(I18NManagerStore.elements.length).to.equal(1);
    });
  });
});

// ---------------------------------------------------------------------------
// i18nDefault / i18nBind: defaults copied from this.t in a constructor
// follow translations that load later, until something else sets them
// ---------------------------------------------------------------------------
class TestDefaultsElement extends I18NMixin(LitElement) {
  static get tag() {
    return "test-i18n-defaults-element";
  }
  static get properties() {
    return {
      ...super.properties,
      closeLabel: { type: String, attribute: "close-label" },
      items: { type: Array },
      heading: { type: String, reflect: true },
    };
  }
  constructor() {
    super();
    this.t = { ...this.t, close: "Close", item: "Item" };
    this.i18nDefault("closeLabel", "close");
    this.i18nDefault("items", (t) => [t.item]);
    this.i18nDefault("heading", "item");
  }
}
customElements.define(TestDefaultsElement.tag, TestDefaultsElement);

describe("I18NMixin i18nDefault / i18nBind", () => {
  it("follows translations that arrive after the constructor", async () => {
    const el = await fixture(
      html`<test-i18n-defaults-element></test-i18n-defaults-element>`,
    );
    expect(el.closeLabel).to.equal("Close");
    el.t = { ...el.t, close: "Cerrar", item: "Elemento" };
    await el.updateComplete;
    expect(el.closeLabel).to.equal("Cerrar");
    expect(el.items).to.deep.equal(["Elemento"]);
  });

  it("leaves values set by an attribute alone", async () => {
    const el = await fixture(
      html`<test-i18n-defaults-element
        close-label="Dismiss"
      ></test-i18n-defaults-element>`,
    );
    el.t = { ...el.t, close: "Cerrar" };
    await el.updateComplete;
    expect(el.closeLabel).to.equal("Dismiss");
  });

  it("leaves an authored attribute alone even when it matches the default", async () => {
    const el = await fixture(
      html`<test-i18n-defaults-element
        close-label="Close"
      ></test-i18n-defaults-element>`,
    );
    el.t = { ...el.t, close: "Cerrar" };
    await el.updateComplete;
    expect(el.closeLabel).to.equal("Close");
  });

  it("keeps translating a reflected property", async () => {
    const el = await fixture(
      html`<test-i18n-defaults-element></test-i18n-defaults-element>`,
    );
    expect(el.getAttribute("heading")).to.equal("Item");
    el.t = { ...el.t, item: "Elemento" };
    await el.updateComplete;
    expect(el.heading).to.equal("Elemento");
    el.t = { ...el.t, item: "Élément" };
    await el.updateComplete;
    expect(el.heading).to.equal("Élément");
    expect(el.getAttribute("heading")).to.equal("Élément");
  });

  it("does not replace list defaults when their text is unchanged", async () => {
    const el = await fixture(
      html`<test-i18n-defaults-element></test-i18n-defaults-element>`,
    );
    const before = el.items;
    el.t = { ...el.t };
    await el.updateComplete;
    expect(el.items).to.equal(before);
  });

  it("stops following once something else sets the value", async () => {
    const el = await fixture(
      html`<test-i18n-defaults-element></test-i18n-defaults-element>`,
    );
    el.closeLabel = "Custom";
    await el.updateComplete;
    el.t = { ...el.t, close: "Fermer" };
    await el.updateComplete;
    expect(el.closeLabel).to.equal("Custom");
  });

  it("binds fields on other objects and reports changes", async () => {
    const el = await fixture(
      html`<test-i18n-defaults-element></test-i18n-defaults-element>`,
    );
    const option = { value: {} };
    let changes = 0;
    el.i18nBind(option.value, "name", "item", () => changes++);
    expect(option.value.name).to.equal("Item");
    el.t = { ...el.t, item: "Elemento" };
    await el.updateComplete;
    expect(option.value.name).to.equal("Elemento");
    expect(changes).to.equal(1);
  });
});

/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { configureHAXCMSSiteApiRegistry } from "@haxtheweb/haxcms-elements/lib/core/utils/haxcms-site-api-registry.js";

/**
 * `haxcms-editor-builder`
 * Figure out what our context is and setup based on that
 *
 * @microcopy - the mental model for this element
 * - something called us asking to provide an authoring solution
 * - we need to decide based on environment if this supports php, nodejs, beaker, a demo or none
 */
class HAXCMSEditorBuilder extends HTMLElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "haxcms-editor-builder";
  }
  /**
   * ready life cycle
   */
  constructor() {
    super();
    this.windowControllers = new AbortController();
    this.__editorUILoadingPromise = null;
    this.__editorLoadedHandler = this.editorLoaded.bind(this);
    globalThis.HAXCMS.requestAvailability().storePieces.editorBuilder = this;
    globalThis.addEventListener(
      "haxcms-site-editor-loaded",
      this.__editorLoadedHandler,
      { signal: this.windowControllers.signal },
    );
    this._syncStoreAppSettings();
    this.applyContext();
  }
  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    this._dedupeEditorUIElements();
    this.dispatchEvent(
      new CustomEvent("haxcms-editor-builder-ready", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this,
      }),
    );
  }
  disconnectedCallback() {
    this.windowControllers.abort();
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
  }
  _syncStoreAppSettings() {
    if (
      globalThis.appSettings &&
      typeof globalThis.appSettings === "object"
    ) {
      store.appSettings = globalThis.appSettings;
      configureHAXCMSSiteApiRegistry(store.appSettings);
    }
  }
  _getEditorUIElements() {
    const elements = [];
    if (!(globalThis.document && globalThis.document.querySelectorAll)) {
      return elements;
    }
    globalThis.document.querySelectorAll("haxcms-site-editor-ui").forEach((el) => {
      elements.push(el);
    });
    return elements;
  }
  _dedupeEditorUIElements() {
    const elements = this._getEditorUIElements();
    if (elements.length === 0) {
      return;
    }
    let keep = null;
    if (
      store.cmsSiteEditor.haxCmsSiteEditorUIElement &&
      elements.includes(store.cmsSiteEditor.haxCmsSiteEditorUIElement)
    ) {
      keep = store.cmsSiteEditor.haxCmsSiteEditorUIElement;
    } else {
      keep = elements[0];
    }
    if (elements.length > 1) {
      elements.forEach((el) => {
        if (el !== keep && el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    }
    store.cmsSiteEditor.haxCmsSiteEditorUIElement = keep;
  }

  _attachEditorUIElement() {
    if (!store.cmsSiteEditor.haxCmsSiteEditorUIElement) {
      return;
    }
    if (store.cmsSiteEditor.haxCmsSiteEditorUIElement.isConnected) {
      return;
    }
    if (this.parentNode) {
      this.parentNode.insertBefore(store.cmsSiteEditor.haxCmsSiteEditorUIElement, this);
    }
    else if (globalThis.document && globalThis.document.body) {
      globalThis.document.body.appendChild(store.cmsSiteEditor.haxCmsSiteEditorUIElement);
    }
    // forces a nice fade in transition
    setTimeout(() => {
      if (store.cmsSiteEditor.haxCmsSiteEditorUIElement) {
        store.cmsSiteEditor.haxCmsSiteEditorUIElement.painting = false;
      }
    }, 600);
  }
  editorLoaded(e) {
    this._dedupeEditorUIElements();
    if (
      (!store.cmsSiteEditor.haxCmsSiteEditorUIElement ||
        !store.cmsSiteEditor.haxCmsSiteEditorUIElement.isConnected) &&
      this._getEditorUIElements().length > 0
    ) {
      store.cmsSiteEditor.haxCmsSiteEditorUIElement = this._getEditorUIElements()[0];
    }
    if (
      store.cmsSiteEditor.haxCmsSiteEditorUIElement &&
      store.cmsSiteEditor.haxCmsSiteEditorUIElement.isConnected
    ) {
      return;
    }
    if (store.cmsSiteEditor.haxCmsSiteEditorUIElement) {
      this._attachEditorUIElement();
      this._dedupeEditorUIElements();
      return;
    }
    if (this.__editorUILoadingPromise) {
      this.__editorUILoadingPromise.then(() => {
        this._dedupeEditorUIElements();
        this._attachEditorUIElement();
      });
      return;
    }
    // prettier-ignore
    this.__editorUILoadingPromise = import(
      "@haxtheweb/haxcms-elements/lib/core/haxcms-site-editor-ui.js"
    ).then(() => {
      if (!store.cmsSiteEditor.haxCmsSiteEditorUIElement) {
        store.cmsSiteEditor.haxCmsSiteEditorUIElement = globalThis.document.createElement(
          "haxcms-site-editor-ui"
        );
        for (var key in store.setupSlots) {
          switch (key) {
            case "haxcms-site-editor-ui-prefix-avatar":
            case "haxcms-site-editor-ui-prefix-buttons":
            case "haxcms-site-editor-ui-suffix-buttons":
            case "haxcms-site-editor-ui-main-menu":
            case "haxcms-site-editor-ui-topbar-character-button":
              for (var key2 in store.setupSlots[key])
              store.cmsSiteEditor.haxCmsSiteEditorUIElement.appendChild(
                store.setupSlots[key][key2]
              );
              break;
          }
        }
      }
      this._attachEditorUIElement();
      this._dedupeEditorUIElements();
    }).finally(() => {
      this.__editorUILoadingPromise = null;
    });
  }
  async applyContext(context = null) {
    if (!this.__appliedContext) {
      this.__appliedContext = true;
      // this allows forced context
      if (context == null) {
        context =
          globalThis.HAXCMS.requestAvailability().getApplicationContext();
      }
      if (["php", "nodejs", "desktop"].includes(context)) {
        // append this script to global scope to show up via window
        // this is a unique case since it's server side generated in HAXCMS
        let script = globalThis.document.createElement("script");
        script.addEventListener("load", this._syncStoreAppSettings.bind(this), {
          once: true,
        });
        // IF we're in a live environment this will always be 2 levels back
        if (
          globalThis.appSettings &&
          globalThis.appSettings.connectionSettings
        ) {
          script.src = globalThis.appSettings.connectionSettings;
        } else {
          script.src = `../../system/api/connectionSettings`;
        }
        await fetch(script.src).then((response) => {
          const contentType = response.headers.get("content-type");
          // verify that we have a js file as that's the only valid response if appending a script tag into DOM
          if (response.ok && contentType.includes("application/javascript")) {
            this.__hasConnectionSettings = true;
            globalThis.document.documentElement.appendChild(script);
            this._syncStoreAppSettings();
          }
        });
      }
      // demo's always fake that they have a connection so we can get the editing UI
      if (context == "demo") {
        this.__hasConnectionSettings = true;
      }
      // dynamic import if this isn't published tho we'll double check
      // that it's valid later
      if (
        !["published", "11ty"].includes(context) &&
        this.__hasConnectionSettings
      ) {
        const basePath =
          new URL("./haxcms-editor-builder.js", import.meta.url).href + "/../";
        // import and set the tag based on the context
        store.cmsSiteEditorBackend.tag = `haxcms-backend-${context}`;
        // delay import slightly to ensure global scope is there
        import(`${basePath}backends/${store.cmsSiteEditorBackend.tag}.js`).then(
          (e) => {
            if (!store.cmsSiteEditorBackend.instance) {
              store.cmsSiteEditorBackend.instance =
                globalThis.document.createElement(
                  store.cmsSiteEditorBackend.tag,
                );
              globalThis.document.body.appendChild(
                store.cmsSiteEditorBackend.instance,
              );
            }
          },
        );
      }
    }
  }
}
globalThis.customElements.define(HAXCMSEditorBuilder.tag, HAXCMSEditorBuilder);
export { HAXCMSEditorBuilder };

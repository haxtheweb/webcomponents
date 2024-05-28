/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";

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
    globalThis.HAXCMS.requestAvailability().storePieces.editorBuilder = this;
    this.applyContext();
    globalThis.addEventListener(
      "haxcms-site-editor-loaded",
      this.editorLoaded.bind(this),
      { signal: this.windowControllers.signal },
    );
  }
  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
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

  editorLoaded(e) {
    if (!store.cmsSiteEditor.haxCmsSiteEditorUIElement) {
      // prettier-ignore
      import(
        "@haxtheweb/haxcms-elements/lib/core/haxcms-site-editor-ui.js"
      ).then(() => {
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
        if (this.parentNode) {
          this.parentNode.insertBefore(store.cmsSiteEditor.haxCmsSiteEditorUIElement, this);
        }
        else {
          globalThis.document.body.appendChild(store.cmsSiteEditor.haxCmsSiteEditorUIElement);
        }
        // forces a nice fade in transition
        setTimeout(() => {
          store.cmsSiteEditor.haxCmsSiteEditorUIElement.painting = false;
        }, 600);
      });
    }
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
          if (response.ok) {
            this.__hasConnectionSettings = true;
            globalThis.document.documentElement.appendChild(script);
          }
        });
      }
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
customElements.define(HAXCMSEditorBuilder.tag, HAXCMSEditorBuilder);
export { HAXCMSEditorBuilder };

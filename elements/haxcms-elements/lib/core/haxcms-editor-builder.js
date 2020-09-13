/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";

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
    window.HAXCMS.requestAvailability().storePieces.editorBuilder = this;
    this.applyContext();
    window.addEventListener(
      "haxcms-site-editor-loaded",
      this.editorLoaded.bind(this)
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
      })
    );
  }
  disconnectedCallback() {
    window.removeEventListener(
      "haxcms-site-editor-loaded",
      this.editorLoaded.bind(this)
    );
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
  }

  editorLoaded(e) {
    if (!store.cmsSiteEditor.haxCmsSiteEditorUIElement) {
      import(
        "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-editor-ui.js"
      );
      store.cmsSiteEditor.haxCmsSiteEditorUIElement = document.createElement(
        "haxcms-site-editor-ui"
      );
      for (var key in store.setupSlots) {
        switch (key) {
          case "haxcms-site-editor-ui-prefix-avatar":
          case "haxcms-site-editor-ui-prefix-buttons":
          case "haxcms-site-editor-ui-suffix-buttons":
            store.cmsSiteEditor.haxCmsSiteEditorUIElement.appendChild(
              store.setupSlots[key]
            );
            break;
        }
      }
      document.body.appendChild(store.cmsSiteEditor.haxCmsSiteEditorUIElement);
      // forces a nice fade in transition
      setTimeout(() => {
        store.cmsSiteEditor.haxCmsSiteEditorUIElement.painting = false;
      }, 5);
    }
  }
  // simple path from a url modifier
  pathFromUrl(url) {
    return url.substring(0, url.lastIndexOf("/") + 1);
  }
  applyContext(context = null) {
    if (!this.__appliedContext) {
      this.__appliedContext = true;
      // this allows forced context
      if (context == null) {
        context = window.HAXCMS.requestAvailability().getApplicationContext();
      }
      if (["php", "nodejs", "desktop"].includes(context)) {
        // append this script to global scope to show up via window
        // this is a unique case since it's server side generated in HAXCMS
        let script = document.createElement("script");
        // IF we're in a live environment this will always be 2 levels back
        if (window.appSettings && window.appSettings.connectionSettings) {
          script.src = window.appSettings.connectionSettings;
        } else {
          script.src = `../../system/api/connectionSettings`;
        }
        fetch(script.src).then((response) => {
          if (response.status != 404) {
            document.documentElement.appendChild(script);
          }
        });
      }
      // dynamic import if this isn't published tho we'll double check
      // that it's valid later
      if (!["published", "11ty"].includes(context)) {
        const basePath = this.pathFromUrl(decodeURIComponent(import.meta.url));
        // import and set the tag based on the context
        store.cmsSiteEditorBackend.tag = `haxcms-backend-${context}`;
        // delay import slightly to ensure global scope is there
        import(`${basePath}backends/${store.cmsSiteEditorBackend.tag}.js`).then(
          (e) => {
            if (!store.cmsSiteEditorBackend.instance) {
              store.cmsSiteEditorBackend.instance = document.createElement(
                store.cmsSiteEditorBackend.tag
              );
              document.body.append(store.cmsSiteEditorBackend.instance);
            }
          }
        );
      }
    }
  }
}
window.customElements.define(HAXCMSEditorBuilder.tag, HAXCMSEditorBuilder);
export { HAXCMSEditorBuilder };

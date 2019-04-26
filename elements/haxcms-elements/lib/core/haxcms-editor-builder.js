/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { PolymerElement } from "@polymer/polymer/polymer-element.js";
import { pathFromUrl } from "@polymer/polymer/lib/utils/resolve-url.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import * as async from "@polymer/polymer/lib/utils/async.js";

/**
 * `haxcms-editor-builder`
 * Figure out what our context is and setup based on that
 *
 * @microcopy - the mental model for this element
 * - something called us asking to provide an authoring solution
 * - we need to decide based on environment if this supports php, beaker or none
 */
class HAXCMSEditorBuilder extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "haxcms-editor-builder";
  }
  /**
   * ready life cycle
   */
  constructor() {
    super();
    this.applyContext();
    window.addEventListener(
      "haxcms-site-editor-loaded",
      this.editorLoaded.bind(this)
    );
  }
  disconnectedCallback() {
    window.removeEventListener(
      "haxcms-site-editor-loaded",
      this.editorLoaded.bind(this)
    );
    super.disconnectedCallback();
  }
  /**
   * Try to get context of what backend is powering this
   */
  getContext() {
    let context = "";
    // figure out the context we need to apply for where the editing creds
    // and API might come from
    if (typeof DatArchive !== typeof undefined) {
      context = "beaker";
    } else if (window.__haxCMSContextPublished === true) {
      context = "published";
    } else if (window.__haxCMSContextNode === true) {
      // @todo add support for node js based back end
      context = "nodejs";
    } else if (window.__haxCMSContextDemo === true) {
      context = "demo";
    } else {
      context = "php";
    }
    return context;
  }
  editorLoaded(e) {
    if (!store.cmsSiteEditor.haxCmsSiteEditorUIElement) {
      import("@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-editor-ui.js");
      store.cmsSiteEditor.haxCmsSiteEditorUIElement = document.createElement(
        "haxcms-site-editor-ui"
      );
      document.body.appendChild(store.cmsSiteEditor.haxCmsSiteEditorUIElement);
      // forces a nice fade in transition
      setTimeout(() => {
        store.cmsSiteEditor.haxCmsSiteEditorUIElement.painting = false;
      }, 5);
    }
  }
  applyContext() {
    let context = this.getContext();
    if (context === "php") {
      // append the php for global scope to show up via window
      // this is a unique case since it's server side generated in HAXCMS/PHP
      let script = document.createElement("script");
      // IF we're in a php environment this will always be 2 levels back
      script.src = `../../haxcms-jwt.php`;
      document.documentElement.appendChild(script);
    }
    // dynamic import if this isn't published
    if (context !== "published") {
      const basePath = pathFromUrl(decodeURIComponent(import.meta.url));
      // import and set the tag based on the context
      store.cmsSiteEditor.tag = `haxcms-backend-${context}`;
      // delay import slightly to ensure global scope is there
      import(`${basePath}backends/${store.cmsSiteEditor.tag}.js`);
    }
  }
}
window.customElements.define(HAXCMSEditorBuilder.tag, HAXCMSEditorBuilder);
export { HAXCMSEditorBuilder };

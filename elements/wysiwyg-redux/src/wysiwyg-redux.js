/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "./lib/wysiwyg-hello.js";

export { WysiwygRedux };
/**
 * `wysiwyg-redux`
 * `a simplified wysiwyg editor`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class WysiwygRedux extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "wysiwyg-redux";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("hello-world", function(e) {
      console.log("hello window");
    });
    this.addEventListener("hello-world", function(e) {
      console.log("hello element");
    });
  }

  ready() {
    super.ready();
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(WysiwygRedux.tag, WysiwygRedux);

/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
/**
 * `layout-builder`
 * @element layout-builder
 * `A new UI for adding content to layouts`
 *
 * @microcopy - language worth noting:
 *  -
 *

 * @polymer
 * @demo demo/index.html
 */
class LayoutBuilder extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "layout-builder";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.id = this._generateUUID();
  }
  _handleAddChild() {
    let lb = document.createElement("layout-builder");
    lb.type = "sub-" + this.type;
    lb.innerHTML = `I am a ${this.type} of ${this.id}.`;
    this.prepend(lb);
  }
  _handleAddSibling() {
    let lb = document.createElement("layout-builder");
    lb.type = this.type;
    lb.innerHTML = `I am a ${this.type} of ${this.id}.`;
    this.parentNode.insertBefore(lb, this.nextSibling);
  }
  /**
   * Generate a UUID
   */
  _generateUUID() {
    let hex = Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
    return this.type + "-ss-s-s-s-sss".replace(/s/g, hex);
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(LayoutBuilder.tag, LayoutBuilder);
export { LayoutBuilder };

/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
import "./lib/hex-a-gon.js";
export { HexagonLoader };
/**
 * `hexagon-loader`
 * `a simple element that is for showing something is loading`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class HexagonLoader extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "hexagon-loader";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    let items = [];
    for (var i = 0; i < this.itemCount; i++) {
      items.push("");
    }
    this.set("items", items);
  }
  /**
   * Color changed
   */
  _colorChanged(newValue, oldValue) {
    if (newValue) {
      this.updateStyles({ "--hexagon-color": newValue });
    }
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(HexagonLoader.tag, HexagonLoader);

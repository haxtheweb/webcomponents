/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "./lib/hex-a-gon.js";
/**
 * `hexagon-loader`
 * `a simple element that is for showing something is loading`
 *
 *
 * @customElement
 * @demo demo/index.html
 */
class HexagonLoader extends LitElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "hexagon-loader";
  }
  /**
   * VanillaJS life cycle
   */
  constructor() {
    super();
    // default for a nice arrangement of items
    this.itemCount = 37;
    this.items = [];
  }
  /**
   * LitElement life cycle - properties changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "color") {
        this._colorChanged(this[propName], oldValue);
      }
      if (propName == "itemCount") {
        this.items = [];
        for (let i = 0; i < this[propName]; i++) {
          this.items.push("");
        }
      }
    });
  }
  /**
   * Color changed
   */
  _colorChanged(newValue, oldValue) {
    if (newValue && window.ShadyCSS) {
      window.ShadyCSS.styleSubtree(this, { "--hexagon-color": newValue });
    }
  }
}
window.customElements.define(HexagonLoader.tag, HexagonLoader);
export { HexagonLoader };

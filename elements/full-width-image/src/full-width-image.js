/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `full-width-image`
 * `full width image that flows beyond boundaries`
 *
 * @microcopy - language worth noting:
 *  - images are best used when stretched across content
 *
 * @demo demo/index.html
 * @customElement full-width-image
 */
class FullWidthImage extends LitElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * convention
   */
  static get tag() {
    return "full-width-image";
  }
  /**
   * LitElement properties changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "source") {
        this._sourceChanged(this[propName]);
      }
    });
  }

  _sourceChanged(newValue) {
    if (typeof newValue !== typeof undefined) {
      this.shadowRoot.querySelector(
        "#image"
      ).style.backgroundImage = `url("${newValue}")`;
    }
  }
}
window.customElements.define("full-width-image", FullWidthImage);
export { FullWidthImage };

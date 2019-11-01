/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/iron-icons/hardware-icons.js";
/**
 * `full-screen-image`
 * `full screen banner image with down arrow`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class FullScreenImage extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "full-screen-image";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.querySelector("#down").addEventListener("click", e => {
      this.nextElementSibling.scrollIntoView({
        block: "start",
        inline: "nearest",
        behavior: "smooth"
      });
    });
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.shadowRoot.querySelector("#down").removeEventListener("click", e => {
      this.nextElementSibling.scrollIntoView({
        block: "start",
        inline: "nearest",
        behavior: "smooth"
      });
    });
  }
}
window.customElements.define(FullScreenImage.tag, FullScreenImage);
export { FullScreenImage };

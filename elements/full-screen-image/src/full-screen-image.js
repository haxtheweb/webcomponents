/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
/**
 * `full-screen-image`
 * @element full-screen-image
 * `full screen banner image with down arrow`
 *
 * @microcopy - language worth noting:
 *  -
 *

 * @polymer
 * @demo demo/index.html
 */
class FullScreenImage extends LitElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * convention
   */
  static get tag() {
    return "full-screen-image";
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.title = "";
    this.subtitle = "";
    this.source = null;
  }
  /**
   * LitElement ready
   */
  firstUpdated() {
    this.shadowRoot.querySelector("#down").addEventListener("click", (e) => {
      this.nextElementSibling.scrollIntoView({
        block: "start",
        inline: "nearest",
        behavior: "smooth",
      });
    });
  }
}
window.customElements.define(FullScreenImage.tag, FullScreenImage);
export { FullScreenImage };

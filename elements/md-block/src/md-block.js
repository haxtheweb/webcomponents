/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `md-block`
 * `a markdown block`
 * @demo demo/index.html
 * @customElement md-block
 */
class MdBlock extends LitElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */
  constructor() {
    super();
    this.markdown = "";
    this.source = "";
    import("@polymer/marked-element/marked-element.js");
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "md-block";
  }
}
window.customElements.define(MdBlock.tag, MdBlock);
export { MdBlock };

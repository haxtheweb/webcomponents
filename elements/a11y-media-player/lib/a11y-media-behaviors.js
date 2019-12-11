/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/responsive-utility/responsive-utility.js";

/**
 * `a11y-media-behaviors`
 * `A set of properties common to player and transcript a11y-media components.`
 *
 * @customElement
 */
class A11yMediaBehaviors extends SimpleColors {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "a11y-media-behaviors";
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties
    };
  }

  constructor() {
    super();
  }
}
window.customElements.define(A11yMediaBehaviors.tag, A11yMediaBehaviors);
export { A11yMediaBehaviors };

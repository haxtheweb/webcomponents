/**
 * Copyright 2019 PSU
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `figure-label`
 * `Figure label element to mark media assets within content.`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @lit-element
 * @demo demo/index.html
 */
class FigureLabel extends LitElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  tag() {
    return "figure-label";
  }
}
customElements.define("figure-label", FigureLabel);

export { FigureLabel };

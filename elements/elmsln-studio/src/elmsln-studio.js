/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "./lib/elmsln-studio-dashboard.js";
import "./lib/elmsln-studio-submissions.js";
import "./lib/elmsln-studio-submission-view.js";

/**
 * `elmsln-studio`
 * Studio App for ELMS:LN
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement elmsln-studio
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
class ElmslnStudio extends LitElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "elmsln-studio";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }
  // static get observedAttributes() {
  //   return [];
  // }
  // disconnectedCallback() {}

  // attributeChangedCallback(attr, oldValue, newValue) {}
}
customElements.define(ElmslnStudio.tag, ElmslnStudio);
export { ElmslnStudio };

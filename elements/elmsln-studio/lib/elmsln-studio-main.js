/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js"
import { outlet } from "lit-element-router";
import { ElmslnStudioUtilities } from "./elmsln-studio-utilities.js";


/**
 * `elmsln-studio-main`
 * Main Content for ELMS:LN Studio
 *
 * @customElement elmsln-studio-main
 * @lit-html
 * @lit-element
 */
class ElmslnStudioMain extends ElmslnStudioUtilities(outlet(LitElement)) {

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "elmsln-studio-main";
  }
  
  //styles function
  static get styles() {
    return  [
      css`
        :host {
          display: block;
          font-family: var(--elmsln-studio-FontFamily, sans-serif); }

        :host([hidden]) {
          display: none; 
        }
      `
    ];
  }
  render() {
    return html`
      <slot></slot>
    `;
  }
  static get properties() {
    return {
      ...super.properties
    }
  }
}
customElements.define("elmsln-studio-main", ElmslnStudioMain);
export { ElmslnStudioMain };

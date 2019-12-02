/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `agency-theme`
 * @demo demo/index.html
 * @customElement agency-theme
 */
class AgencyTheme extends LitElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "agency-theme";
  }
  constructor() {
    super();
    import("./lib/agency-theme-band.js");
    import("./lib/agency-theme-spotlight.js");
  }
}
window.customElements.define(AgencyTheme.tag, AgencyTheme);
export { AgencyTheme };

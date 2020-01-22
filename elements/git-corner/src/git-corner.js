/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";

/**
 * `git-corner`
 * `display a quick link with styling to a repo to help with contributions`
 * @lit-element
 * @demo demo/index.html
 * @customElement git-corner
 */
class GitCorner extends LitElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "git-corner";
  }
}
customElements.define(GitCorner.tag, GitCorner);
export { GitCorner };

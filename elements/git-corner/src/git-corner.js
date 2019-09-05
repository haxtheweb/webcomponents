/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";

/**
 * `git-corner`
 * `display a quick link with styling to a repo to help with contributions`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
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
  /**
   * Register CSS styles
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
      `
    ];
  }

  // life cycle
  constructor() {
    super();
    // put default values here
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }
  /**
   * life cycle, element removed from DOM
   */
  disconnectedCallback() {
    super.disconnectedCallback();
  }
  /**
   * runs on first go
   */
  firstUpdated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {});
  }
  /**
   * updated / notice property changes
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {});
  }
}
customElements.define("git-corner", GitCorner);
export { GitCorner };

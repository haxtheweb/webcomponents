/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import { navigator } from "lit-element-router";

/**
 * `elmsln-studio-link`
 * Navigation Link for ELMS:LN Studio
 *
 * @customElement elmsln-studio-link
 * @lit-html
 * @lit-element
 */
class ElmslnStudioLink extends navigator(LitElement) {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "elmsln-studio-link";
  }

  static get properties() {
    return {
      path: { type: String }
    };
  }
  static get styles() {
    return css`
      a,
      a:link {
        position: relative;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: transparent;
        color: var(--elmsln-studio-link-Color);
        text-decoration: var(--elmsln-studio-link-TextDecoration);
        transition: var(--elmsln-studio-link-Transition);
      }
    `;
  }
  constructor() {
    super();
    this.path = "";
  }
  render() {
    return html`
      <button @click="${this.buttonClick}">
        <slot></slot>
      </button>
    `;
  }
  buttonClick(event) {
    event.preventDefault();
    this.navigate(this.path);
  }
}
customElements.define("elmsln-studio-link", ElmslnStudioLink);
export { ElmslnStudioLink };

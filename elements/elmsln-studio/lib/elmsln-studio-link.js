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
      href: { type: String }
    };
  }
  static get styles() {
    return css`
      a {
        margin: 5px;
      }
    `;
  }
  constructor() {
    super();
    this.href = "";
  }
  render() {
    return html`
      <a href="${this.href}" @click="${this.linkClick}">
        <slot></slot>
      </a>
    `;
  }
  linkClick(event) {
    event.preventDefault();
    this.navigate(this.href);
  }
}
customElements.define("elmsln-studio-link", ElmslnStudioLink);
export { ElmslnStudioLink };

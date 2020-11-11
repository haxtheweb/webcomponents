/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import { navigator } from "lit-element-router";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";

/**
 * `elmsln-studio-button`
 * Navigation Link for ELMS:LN Studio
 *
 * @customElement elmsln-studio-button
 * @lit-html
 * @lit-element
 */
class ElmslnStudioButton extends navigator(LitElement) {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "elmsln-studio-button";
  }

  static get properties() {
    return {
      path: { type: String },
      icon: { type: String },
    };
  }
  static get styles() {
    return css`
      :host {
        display: block;
      }
      :host([hidden]) {
        display: none;
      }
      button {
        border: none;
        background-color: transparent;
        display: flex;
        align-items: center;
        height: 26px;
      }
      button:focus,
      button:hover {
        outline: none;
      }
      iron-icon {
        color: var(--elmsln-studio-button-icon-color);
      }
    `;
  }
  constructor() {
    super();
    this.path = "";
    this.icon = "";
  }

  render() {
    return html`
      <button @click="${this.buttonClick}">
        <slot name="before"></slot>
        <iron-icon
          aria-hidden="true"
          ?hidden="${!this.icon}"
          icon="${this.icon}"
        ></simple-icon>
        <slot></slot>
      </button>
    `;
  }

  buttonClick(event) {
    this.navigate(`${window.ElmslnStudioPath || ""}${this.path}`);
  }
}
customElements.define("elmsln-studio-button", ElmslnStudioButton);
export { ElmslnStudioButton };

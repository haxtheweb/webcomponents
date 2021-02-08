/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import { navigator } from "lit-element-router";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";

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
        color: var(--elmsln-studio-button-icon-color);
      }
      button:focus,
      button:hover {
        outline: none;
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
        ${!this.icon
          ? ""
          : html`
              <simple-icon-lite
                aria-hidden="true"
                icon="${this.icon}"
              ></simple-icon-lite>
            `}
        <slot></slot>
      </button>
    `;
  }

  buttonClick(event) {
    if (!this.disabled) this.navigate(this.path);
  }
}
customElements.define("elmsln-studio-button", ElmslnStudioButton);
export { ElmslnStudioButton };

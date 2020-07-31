/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/iron-icons.js";

/**
 * `elmsln-studio-modal-button`
 * Navigation Link for ELMS:LN Studio
 *
 * @customElement elmsln-studio-modal-button
 * @lit-html
 * @lit-element
 */
class ElmslnStudioModalButton extends LitElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "elmsln-studio-modal-button";
  }

  static get properties() {
    return {
      text: { type: String },
      icon: { type: String },
      callback: { type: String },
      hideText: { type: Boolean, attribute: "hide-text" },
      flexible: { type: Boolean, attribute: "flexible", reflect: true },
      border: { type: Boolean, attribute: "border" },
      align: { type: String, attribute: "border" },
      big: { type: Boolean, attribute: "big" }
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        :host([hidden]),
        *[hidden] {
          display: none !important;
        }
        :host([flexible]) {
          flex: 1 1 auto;
        }
        button {
          border: none;
          background-color: white;
          width: 100%;
        }
        button p {
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        button[alignment="left"] p {
          justify-content: flex-start;
        }
        button[alignment="right"] p {
          justify-content: end;
          flex-direction: row-reverse;
        }
        button[border] {
          border: 1px solid #ddd;
        }
        button > * {
          min-height: 50px;
          line-height: 50px;
        }
        button[big] > * {
          min-height: 75px;
          line-height: 75px;
        }
        .sr-only {
          position: absolute;
          left: -9999999px;
          width: 0;
          overflow: hidden;
        }
      `
    ];
  }
  constructor() {
    super();
    this.hideText = false;
    this.big = false;
    this.icon = false;
    this.flexible = false;
    this.border = false;
    this.align = "center";
  }

  render() {
    return html`
      <button
        id="modal"
        @click="${this.callback}"
        alignment="${this.align}"
        ?big="${this.big}"
        ?border="${this.border}"
        ?flexible="${this.flexible}"
      >
        <p>
          <iron-icon aria-hidden="true" icon="${this.icon}"></iron-icon>
          <span class="${this.hideText && this.icon ? "sr-only" : ""}"
            >${this.text}</span
          >
        </p>
      </button>
    `;
  }
}
customElements.define("elmsln-studio-modal-button", ElmslnStudioModalButton);
export { ElmslnStudioModalButton };

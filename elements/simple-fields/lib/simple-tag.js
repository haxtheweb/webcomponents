import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";

export class SimpleTag extends SimpleColors {
  static get tag() {
    return "simple-tag";
  }
  static get properties() {
    return {
      ...super.properties,
      disabled: {
        type: Boolean,
        reflect: true,
      },
      value: {
        type: String,
      },
      cancelButton: {
        type: Boolean,
        attribute: "cancel-button",
      },
    };
  }
  constructor() {
    super();
    this.cancelButton = false;
    this.disabled = false;
  }
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: inline-flex;
          font-size: 12px;
          margin: 2px;
          color: var(--simple-colors-default-theme-accent-11, #aaaaaa);
          background-color: var(--simple-colors-default-theme-accent-2, white);
          border: 1px solid var(--simple-colors-default-theme-accent-3, #aaaaaa);
          border-radius: 12px;
        }
        div {
          padding: 2px 10px;
          text-align: center;
        }
        :host(:hover),
        :host(:active),
        :host(:focus) {
          color: var(--simple-colors-default-theme-accent-12, #aaaaaa);
          background-color: var(--simple-colors-default-theme-accent-3, white);
        }
        simple-icon-button-lite {
          cursor: pointer;
          color: var(--simple-colors-default-theme-accent-11, #aaaaaa);
          --simple-icon-height: 16px;
          --simple-icon-width: 16px;
        }
        simple-icon-button-lite:hover,
        simple-icon-button-lite:active,
        simple-icon-button-lite:focus {
          color: var(--simple-colors-default-theme-accent-12, #aaaaaa);
        }
      `,
    ];
  }
  render() {
    return html`
      <div>
        <span>${this.value}<slot></slot></span>
        <simple-icon-button-lite
          icon="cancel"
          ?hidden="${this.cancelButton}"
          @click="${this.clickEvent}"
        ></simple-icon-button-lite>
      </div>
    `;
  }
  clickEvent(e) {
    this.dispatchEvent(
      new CustomEvent("simple-tag-clicked", {
        composed: false,
        bubbles: false,
        cancelable: false,
        detail: {
          value: this.value,
        },
      })
    );
  }
}
customElements.define(SimpleTag.tag, SimpleTag);

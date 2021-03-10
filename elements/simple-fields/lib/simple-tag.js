import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";
import {
  SimpleFieldsButtonStyles,
  SimpleFieldsTooltipStyles,
} from "./simple-fields-ui.js";

export class SimpleTag extends LitElement {
  static get tag() {
    return "simple-tag";
  }
  static get properties() {
    return {
      readonly: {
        type: Boolean,
        reflect: true,
      },
      disabled: {
        type: Boolean,
        reflect: true,
      },
      value: {
        type: String,
      },
    };
  }
  constructor() {
    super();
    this.disabled = false;
    this.readonly = false;
  }
  static get styles() {
    return [
      SimpleFieldsButtonStyles,
      SimpleFieldsTooltipStyles,
      css`
        :host {
          display: inline-flex;
          align-items: center;
          background-color: var(
            --simple-fields-button-color,
            var(--simple-fields-color)
          );
          color: var(
            --simple-fields-button-background-color,
            var(--simple-fields-background-color)
          );
          font-size: var(--simple-fields-font-size, 16px);
          font-family: var(--simple-fields-font-family, sans-serif);
          line-height: var(--simple-fields-line-height, 22px);
          border-radius: var(--simple-fields-tag-border-radius, 4px);
          padding: var(--simple-fields-button-padding, 2px)
            calc(2 * var(--simple-fields-button-padding, 2px));
          border-width: 1px;
          border-style: solid;
          border-color: var(
            --simple-fields-fieldset-border-color,
            var(--simple-fields-border-color-light, #ccc)
          );
        }
        simple-icon-button-lite {
          margin-left: 4px;
          --simple-icon-height: var(--simple-fields-font-size, 16px);
          --simple-icon-width: var(--simple-fields-font-size, 16px);
        }
        :host([disabled]):not([readonly]) {
          opacity: 0.5;
        }
      `,
    ];
  }
  render() {
    return html`
      <span>${this.value}<slot></slot></span>
      ${!!this.readonly
        ? ""
        : html`
            <simple-icon-button-lite
              icon="cancel"
              label="Remove ${this.value}"
              @click="${this.removeClick}"
              ?disabled="${this.disabled}"
            ></simple-icon-button-lite>
          `}
    `;
  }
  removeClick(e) {
    this.dispatchEvent(
      new CustomEvent("simple-tag-remove-clicked", {
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

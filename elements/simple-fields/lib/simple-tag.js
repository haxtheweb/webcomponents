import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";

export class SimpleTag extends LitElement {
  static get tag() {
    return "simple-tag";
  }
  static get properties() {
    return {
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
  }
  static get styles() {
    return css`
      :host {
        display: inline-flex;
        font-size: 12px;
        margin: 4px;
        color: grey;
        background-color: white;
        border: 1px solid grey;
      }
      div {
        padding: 4px;
      }
      :host(:hover),
      :host(:active),
      :host(:focus) {
        color: black;
        border: 1px solid black;
      }
      simple-icon-button-lite {
        --simple-icon-height: 16px;
        --simple-icon-width: 16px;
      }
    `;
  }
  render() {
    return html`
      <div>
        <span>${this.value}<slot></slot></span>
        <simple-icon-button-lite
          icon="cancel"
          @click="${this.removeClick}"
        ></simple-icon-button-lite>
      </div>
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

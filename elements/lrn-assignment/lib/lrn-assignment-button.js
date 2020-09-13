import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/paper-button/paper-button.js";
import "@lrnwebcomponents/lrn-icons/lrn-icons.js";
import "@polymer/iron-icon/iron-icon.js";
class LrnAssignmentButton extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        a {
          color: inherit;
          text-decoration: inherit;
        }
        paper-button {
          background: #b0e6f9;
        }
        paper-button[complete] {
          background: #e7ffe7;
        }
        iron-icon {
          margin-left: 8px;
          opacity: 0.8;
        }
      `,
    ];
  }
  /**
   * LitElement render
   */
  render() {
    return html`
      <a href="${this.url}">
        ${this.open
          ? html`
              <paper-button raised open
                >${this.title} <iron-icon icon="lrn-icons:input"></iron-icon
              ></paper-button>
            `
          : ``}
        ${this.complete
          ? html`
              <paper-button raised complete
                >${this.title} <iron-icon icon="lrn-icons:done"></iron-icon
              ></paper-button>
            `
          : ``}
      </a>
    `;
  }
  static get tag() {
    return "lrn-assignment-button";
  }
  constructor() {
    super();
    this.open = false;
    this.complete = false;
  }
  static get properties() {
    return {
      title: { type: String },
      url: { type: String },
      open: {
        type: Boolean,
      },
      complete: {
        type: Boolean,
      },
    };
  }
}
window.customElements.define(LrnAssignmentButton.tag, LrnAssignmentButton);
export { LrnAssignmentButton };

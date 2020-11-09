import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
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
        button {
          background: #b0e6f9;
        }
        button[complete] {
          background: #e7ffe7;
        }
        simple-icon {
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
              <button raised open>
                ${this.title} <simple-icon icon="lrn-icons:input"></simple-icon>
              </button>
            `
          : ``}
        ${this.complete
          ? html`
              <button raised complete>
                ${this.title} <simple-icon icon="lrn-icons:done"></simple-icon>
              </button>
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

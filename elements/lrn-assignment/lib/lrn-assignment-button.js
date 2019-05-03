import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-button/paper-button.js";
import "@lrnwebcomponents/lrn-icons/lrn-icons.js";
import "@polymer/iron-icon/iron-icon.js";
class LrnAssignmentButton extends PolymerElement {
  static get template() {
    return html`
      <style>
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
      </style>
      <a href$="[[url]]">
        <template is="dom-if" if="[[open]]">
          <paper-button raised open
            >[[title]] <iron-icon icon="lrn-icons:input"></iron-icon
          ></paper-button>
        </template>
        <template is="dom-if" if="[[complete]]">
          <paper-button raised complete
            >[[title]] <iron-icon icon="lrn-icons:done"></iron-icon
          ></paper-button>
        </template>
      </a>
    `;
  }

  static get tag() {
    return "lrn-assignment-button";
  }

  static get properties() {
    return {
      title: String,
      url: String,
      open: {
        type: Boolean,
        value: false
      },
      complete: {
        type: Boolean,
        value: false
      }
    };
  }
}
window.customElements.define(LrnAssignmentButton.tag, LrnAssignmentButton);
export { LrnAssignmentButton };

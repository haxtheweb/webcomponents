import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icon/iron-icon.js";
class LrndesignMapmenuItem extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          --lrndesign-mapmenu-item-height: 16px;
        }
        iron-icon {
          --iron-icon-height: var(--lrndesign-mapmenu-item-height);
          display: inline-flex;
        }
      </style>
      <template is="dom-if" if="[[icon]]">
        <iron-icon icon="[[icon]]"></iron-icon>
      </template>
      <span id="title">[[title]]</span>
    `;
  }
  static get tag() {
    return "lrndesign-mapmenu-item";
  }

  static get properties() {
    return {
      icon: {
        type: String,
        value: ""
      },
      title: {
        type: String,
        value: ""
      },
      url: {
        type: String,
        value: ""
      },
      icon: {
        type: String,
        value: ""
      }
    };
  }
}
window.customElements.define(LrndesignMapmenuItem.tag, LrndesignMapmenuItem);
export { LrndesignMapmenuItem };

import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/paper-button/paper-button.js";
import "./hax-item-button-inner.js";
/**
 `hax-app-picker-item`
 An item for displaying in a picker

* @demo demo/index.html
*/
class HaxAppPickerItem extends LitElement {
  constructor() {
    super();
  }
  static get styles() {
    return [
      css`
        :host {
          display: block;
          max-width: 90px;
        }
        paper-button {
          color: black;
          text-transform: none;
          min-width: unset;
          cursor: pointer;
          width: 80px;
          padding: 5px;
          margin: 5px;
          --paper-button-ink-color: var(--hax-ink-color, black);
          -webkit-transition: box-shadow 0.3s;
          -moz-transition: box-shadow 0.3s;
          -ms-transition: box-shadow 0.3s;
          -o-transition: box-shadow 0.3s;
          transition: box-shadow 0.3s;
        }
        paper-button:hover,
        paper-button:focus {
          box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.14),
            0 2px 10px 0 rgba(0, 0, 0, 0.12), 0 6px 2px -4px rgba(0, 0, 0, 0.2);
        }
        paper-button:active {
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
            0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }
      `
    ];
  }
  render() {
    return html`
      <paper-button class="icon">
        <hax-item-button-inner
          color="${this.color}"
          icon="${this.icon}"
          label="${this.label}"
        >
        </hax-item-button-inner>
      </paper-button>
    `;
  }
  static get tag() {
    return "hax-app-picker-item";
  }
  static get properties() {
    return {
      /**
       * Color
       */
      color: {
        type: String
      },
      /**
       * Icon
       */
      icon: {
        type: String
      },
      /**
       * Label
       */
      label: {
        type: String
      }
    };
  }
}
window.customElements.define(HaxAppPickerItem.tag, HaxAppPickerItem);
export { HaxAppPickerItem };

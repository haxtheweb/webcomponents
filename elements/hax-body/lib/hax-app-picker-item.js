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
    this.elevation = 1;
  }
  static get styles() {
    return [
      css`
        :host {
          display: block;
          max-width: 100px;
        }
        :host([elevation="1"]) {
          -webkit-transform: scale(1, 1);
          transform: scale(1, 1);
        }
        :host([elevation="2"]) {
          -webkit-transform: scale(1.4, 1.4);
          transform: scale(1.4, 1.4);
        }
        paper-button {
          color: black;
          text-transform: none;
          min-width: unset;
          cursor: pointer;
          width: 80px;
          padding: 10px;
          margin: 10px;
          box-shadow: none;
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
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("mousedown", this.tapEventOn.bind(this));
    this.addEventListener("mouseover", this.tapEventOn.bind(this));
    this.addEventListener("mouseout", this.tapEventOff.bind(this));
    this.addEventListener("focusin", this.tapEventOn.bind(this));
    this.addEventListener("focusout", this.tapEventOff.bind(this));
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
      },
      /**
       * Elevation off the UI
       */
      elevation: {
        type: Number,
        reflect: true
      }
    };
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      // update hexcolor when color changes
      if (propName === "color") {
        this._getAccentColor(this.color);
      }
    });
  }
  /**
   * special handling for taps on the thing
   */
  tapEventOn(e) {
    this.elevation = 2;
  }
  /**
   * Hover off stop showing the deeper shadow.
   */
  tapEventOff(e) {
    this.elevation = 1;
  }
}
window.customElements.define(HaxAppPickerItem.tag, HaxAppPickerItem);
export { HaxAppPickerItem };

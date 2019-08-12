import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/paper-button/paper-button.js";
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
          display: inline-block;
          color: var(--hax-color-text);
        }
        :host([elevation="1"]) {
          -webkit-transform: scale(1, 1);
          transform: scale(1, 1);
        }
        :host([elevation="2"]) {
          -webkit-transform: scale(1.4, 1.4);
          transform: scale(1.4, 1.4);
        }
        :host > div {
          margin-top: 8px;
          color: var(--hax-color-text);
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .icon {
          cursor: pointer;
          display: flex;
          width: 50px;
          height: 50px;
          padding: 5px;
          margin: 10px;
          color: #ffffff;
          border-radius: 50%;
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
            0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
          -webkit-transition: box-shadow 0.3s;
          -moz-transition: box-shadow 0.3s;
          -ms-transition: box-shadow 0.3s;
          -o-transition: box-shadow 0.3s;
          transition: box-shadow 0.3s;
        }
        .icon:hover,
        .icon:focus {
          box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.14),
            0 2px 10px 0 rgba(0, 0, 0, 0.12), 0 6px 2px -4px rgba(0, 0, 0, 0.2);
        }
        .icon:active {
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
            0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }
        paper-button {
          min-width: unset;
        }
        iron-icon {
          display: inline-flex;
          padding: 0;
          margin: 0;
          width: 36px;
          height: 36px;
        }
      `
    ];
  }
  render() {
    return html`
      <paper-button
        class="icon"
        title="${this.label}"
        style="background-color:${this.hexColor};"
      >
        <iron-icon icon="${this.icon}"></iron-icon>
      </paper-button>
      <div aria-hidden="true">${this.label}</div>
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
       * Class for the color
       */
      hexColor: {
        type: String,
        attribute: "hex-color"
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
        this.hexColor = this._getHexColor(this.color);
      }
    });
  }
  _getHexColor(color) {
    let name = color.replace("-text", "");
    let tmp = new SimpleColors();
    if (tmp.colors[name]) {
      return tmp.colors[name][6];
    }
    return "#000000";
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

import { LitElement, html, css } from "lit-element";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
 * `hax-app-browser-item`
 * `A button on the hax-app-browser display`
 * @microcopy - the mental model for this element
 * - hax-app - data wiring for an app, this element uses the visual side of this
 */
class HAXAppBrowserItem extends LitElement {
  static get tag() {
    return "hax-app-browser-item";
  }
  static get properties() {
    return {
      /**
       * Title
       */
      title: {
        type: String
      },
      /**
       * Index position in the original list of imports
       */
      index: {
        type: Number
      },
      /**
       * Icon for the button, optional.
       */
      icon: {
        type: String
      },
      /**
       * Image for the button, optional.
       */
      image: {
        type: String,
        value: false
      },
      /**
       * MaterializeCSS color name of the item
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
       * Author related to this app
       */
      author: {
        type: String
      },
      /**
       * Description for this.
       */
      description: {
        type: String
      },
      /**
       * Examples, a list of image links, optional.
       */
      examples: {
        type: Array
      },
      /**
       * Status, whether disabled, enabled, or other future states.
       */
      status: {
        type: Array
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
  constructor() {
    super();
    this.elevation = 1;
    import("@polymer/paper-button/paper-button.js");
    import("@polymer/iron-icon/iron-icon.js");
    import("@polymer/iron-image/iron-image.js");
  }
  static get styles() {
    return [
      css`
        :host {
          display: block;
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
          color: var(--hax-color-text);
          text-transform: none;
          background-color: var(--hax-color-bg-accent);
          min-width: unset;
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
        paper-button:hover,
        paper-button:focus {
          box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.14),
            0 2px 10px 0 rgba(0, 0, 0, 0.12), 0 6px 2px -4px rgba(0, 0, 0, 0.2);
        }
        paper-button:active {
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
            0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }
        paper-button iron-icon {
          height: 32px;
          width: 32px;
          color: var(--simple-colors-default-theme-grey-1);
          display: inline-block;
        }
        .item-title {
          margin-top: 8px;
          color: var(--hax-color-text);
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 12px;
          line-height: 12px;
          height: 12px;
          text-align: center;
        }
        .button-inner {
          display: flex;
        }
        .flip-icon {
          transform: rotateY(180deg);
        }
      `
    ];
  }

  render() {
    return html`
      <paper-button
        data-voicecommand="select ${this.title}"
        title="${this.title}"
        style="background-color:${this.hexColor};"
      >
        <div class="button-inner">
          <iron-icon icon="${this.icon}" hidden="${!this.icon}"></iron-icon>
          <iron-image
            src="${this.image}"
            preload=""
            sizing="cover"
            hidden="${!this.image}"
          ></iron-image>
        </div>
      </paper-button>
      <div class="item-title" aria-hidden="true">${this.title}</div>
    `;
  }
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("click", this._fireEvent);
    this.addEventListener("mousedown", this.tapEventOn);
    this.addEventListener("mouseover", this.tapEventOn);
    this.addEventListener("mouseout", this.tapEventOff);
    this.addEventListener("focusin", this.tapEventOn);
    this.addEventListener("focusout", this.tapEventOff);
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
  _getHexColor(color) {
    let name = color.replace("-text", "");
    let tmp = new SimpleColors();
    if (tmp.colors[name]) {
      return tmp.colors[name][6];
    }
    return "#000000";
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      // update hexcolor when color changes
      if (propName === "color") {
        this.hexColor = this._getHexColor(this.color);
      }
    });
  }
  /**
   * Fire an event that includes the eventName of what was just pressed.
   */
  _fireEvent(e) {
    this.dispatchEvent(
      new CustomEvent("hax-app-selected", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this.index
      })
    );
  }
}

customElements.define(HAXAppBrowserItem.tag, HAXAppBrowserItem);
export { HAXAppBrowserItem };

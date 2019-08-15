import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "./hax-shared-styles.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/editor-icons.js";
import "@polymer/iron-icons/device-icons.js";
import "@polymer/iron-icons/hardware-icons.js";
import "@polymer/iron-icons/communication-icons.js";
import "@polymer/iron-icons/social-icons.js";
import "@polymer/iron-icons/av-icons.js";
import "@polymer/iron-icons/maps-icons.js";
import "@polymer/iron-icons/places-icons.js";
import "@polymer/iron-image/iron-image.js";
/**
`hax-item-button-inner`
A button on the hax-gizmo-browser app display

* @demo demo/index.html

@microcopy - the mental model for this element
 - 
*/
class HaxItemButtonInner extends SimpleColors {
  constructor() {
    super();
  }
  static get template() {
    return html`
      <style include="simple-colors-shared-styles hax-shared-styles">
        :host {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .button-inner {
          width: 30px;
          height: 30px;
          padding: 5px;
          background-color: var(--simple-colors-default-theme-accent-7, #000);
          border-radius: 50%;
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
            0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
          -webkit-transition: box-shadow 0.3s;
          -moz-transition: box-shadow 0.3s;
          -ms-transition: box-shadow 0.3s;
          -o-transition: box-shadow 0.3s;
          transition: box-shadow 0.3s;
        }
        .button-inner:hover,
        .button-inner:focus {
          box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.14),
            0 2px 10px 0 rgba(0, 0, 0, 0.12), 0 6px 2px -4px rgba(0, 0, 0, 0.2);
        }
        .button-inner:active {
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
            0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }
        iron-icon {
          width: 30px;
          height: 30px;
          color: var(--simple-colors-default-theme-grey-1, #fff);
        }
        .item-label {
          margin-top: 8px;
          color: var(--simple-colors-default-theme-grey-12, #000);
          width: 70px;
          font-size: 12px;
          line-height: 12px;
          height: 12px;
          text-align: center;
        }
        .flip-icon {
          transform: rotateY(180deg);
        }
      </style>
      <div class="button-inner">
        <iron-icon icon="[[icon]]" hidden$="[[!icon]]"></iron-icon>
        <iron-image
          src="[[image]]"
          preload
          sizing="cover"
          hidden$="[[!image]]"
        ></iron-image>
      </div>
      <div class="item-label">[[label]]</div>
    `;
  }
  static get tag() {
    return "hax-item-button-inner";
  }
  static get properties() {
    return {
      /**
       * label
       */
      label: {
        type: String
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
       * color name of the item
       */
      color: {
        type: String,
        observer: "_getAccentColor"
      }
    };
  }

  _getAccentColor(color) {
    color = color.replace("-text", "");
    if (
      (!this.accentColor || this.accentColor === "grey") &&
      this.colors[color]
    ) {
      this.accentColor = color;
    }
  }
}
window.customElements.define(HaxItemButtonInner.tag, HaxItemButtonInner);
export { HaxItemButtonInner };

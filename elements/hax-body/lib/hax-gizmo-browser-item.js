import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "./hax-shared-styles.js";
import "@polymer/paper-button/paper-button.js";
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
`hax-gizmo-browser-item`
A button on the hax-gizmo-browser app display

* @demo demo/index.html

@microcopy - the mental model for this element
 - 
*/
class HaxGizmoBrowserItem extends SimpleColors {
  constructor() {
    super();
    afterNextRender(this, function() {
      this.addEventListener("mousedown", this.tapEventOn.bind(this));
      this.addEventListener("mouseover", this.tapEventOn.bind(this));
      this.addEventListener("mouseout", this.tapEventOff.bind(this));
      this.addEventListener("focusin", this.tapEventOn.bind(this));
      this.addEventListener("focusout", this.tapEventOff.bind(this));
    });
  }
  static get template() {
    return html`
      <style include="simple-colors-shared-styles hax-shared-styles">
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
          display: flex;
          flex-direction: column;
          align-items: center;
          color: var(--hax-color-text);
          text-transform: none;
          min-width: unset;
          cursor: pointer;
          width: 80px;
          padding: 10px;
          margin: 10px;
          box-shadow: none;
        }
        paper-button .button-inner {
          width: 30px;
          height: 30px;
          padding: 5px;
          background-color: var(
            --simple-colors-default-theme-accent-7,
            var(--hax-color-bg-accent)
          );
          border-radius: 50%;
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
            0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
          -webkit-transition: box-shadow 0.3s;
          -moz-transition: box-shadow 0.3s;
          -ms-transition: box-shadow 0.3s;
          -o-transition: box-shadow 0.3s;
          transition: box-shadow 0.3s;
        }
        paper-button .button-inner:hover,
        paper-button .button-inner:focus {
          box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.14),
            0 2px 10px 0 rgba(0, 0, 0, 0.12), 0 6px 2px -4px rgba(0, 0, 0, 0.2);
        }
        paper-button .button-inner:active {
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
            0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }
        paper-button iron-icon {
          width: 30px;
          height: 30px;
          color: var(--simple-colors-default-theme-grey-1);
        }
        .item-title {
          margin-top: 8px;
          color: var(
            --simple-colors-default-theme-grey-12,
            var(--hax-color-text)
          );
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
      <paper-button on-click="_fireEvent" data-voicecommand$="select [[title]]">
        <div class="button-inner">
          <iron-icon icon="[[icon]]" hidden$="[[!icon]]"></iron-icon>
          <iron-image
            src="[[image]]"
            preload
            sizing="cover"
            hidden$="[[!image]]"
          ></iron-image>
        </div>
        <div class="item-title">[[title]]</div>
      </paper-button>
    `;
  }
  static get tag() {
    return "hax-gizmo-browser-item";
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
       * color name of the item
       */
      color: {
        type: String,
        observer: "_getAccentColor"
      },
      /**
       * Author related to this gizmo
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
       * Tag
       */
      tagToInsert: {
        type: String
      },
      /**
       * Elevation off the UI
       */
      elevation: {
        type: Number,
        value: 1,
        reflectToAttribute: true
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

  /**
   * Fire an event that includes the eventName of what was just pressed.
   */
  _fireEvent(e) {
    let gizmo = {
      tag: this.tagToInsert
    };
    let element = window.HaxStore.haxElementPrototype(gizmo);
    window.HaxStore.write("activeHaxElement", element, this);
  }
}
window.customElements.define(HaxGizmoBrowserItem.tag, HaxGizmoBrowserItem);
export { HaxGizmoBrowserItem };

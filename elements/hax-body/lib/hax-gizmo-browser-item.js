import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@polymer/paper-button/paper-button.js";
import "./hax-shared-styles.js";
/**
`hax-gizmo-browser-item`
A button on the hax-gizmo-browser app display

* @demo demo/index.html

@microcopy - the mental model for this element
 - 
*/
class HaxGizmoBrowserItem extends PolymerElement {
  constructor() {
    super();
    import("@polymer/iron-icons/iron-icons.js");
    import("@polymer/iron-icons/editor-icons.js");
    import("@polymer/iron-icons/device-icons.js");
    import("@polymer/iron-icons/hardware-icons.js");
    import("@polymer/iron-icons/communication-icons.js");
    import("@polymer/iron-icons/social-icons.js");
    import("@polymer/iron-icons/av-icons.js");
    import("@polymer/iron-icons/maps-icons.js");
    import("@polymer/iron-icons/places-icons.js");
    import("@polymer/iron-image/iron-image.js");
  }
  static get template() {
    return html`
      <style include="hax-shared-styles">
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
      </style>
      <paper-button
        on-tap="_fireEvent"
        data-voicecommand$="select [[title]]"
        title="[[title]]"
        style$="background-color:[[hexColor]];"
      >
        <div class="button-inner">
          <iron-icon icon="[[icon]]" hidden$="[[!icon]]"></iron-icon>
          <iron-image
            src="[[image]]"
            preload
            sizing="cover"
            hidden$="[[!image]]"
          ></iron-image>
        </div>
      </paper-button>
      <div class="item-title" aria-hidden="true">[[title]]</div>
    `;
  }
  static get tag() {
    return "hax-gizmo-browser-item";
  }
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      this.addEventListener("mousedown", this.tapEventOn.bind(this));
      this.addEventListener("mouseover", this.tapEventOn.bind(this));
      this.addEventListener("mouseout", this.tapEventOff.bind(this));
      this.addEventListener("focusin", this.tapEventOn.bind(this));
      this.addEventListener("focusout", this.tapEventOff.bind(this));
    });
  }
  disconnectedCallback() {
    this.removeEventListener("mousedown", this.tapEventOn.bind(this));
    this.removeEventListener("mouseover", this.tapEventOn.bind(this));
    this.removeEventListener("mouseout", this.tapEventOff.bind(this));
    this.removeEventListener("focusin", this.tapEventOn.bind(this));
    this.removeEventListener("focusout", this.tapEventOff.bind(this));
    super.disconnectedCallback();
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
        type: String
      },
      /**
       * Class for the color
       */
      hexColor: {
        type: String,
        computed: "_getHexColor(color)"
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

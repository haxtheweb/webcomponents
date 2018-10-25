import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-card/paper-card.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/editor-icons.js";
import "@polymer/iron-icons/device-icons.js";
import "@polymer/iron-icons/hardware-icons.js";
import "@polymer/iron-icons/communication-icons.js";
import "@polymer/iron-icons/social-icons.js";
import "@polymer/iron-icons/av-icons.js";
import "@polymer/iron-icons/places-icons.js";
import "@polymer/iron-icons/maps-icons.js";
import "@polymer/iron-image/iron-image.js";
import "@lrnwebcomponents/materializecss-styles/colors.js";
/**
`hax-app-browser-item`
A button on the hax-app-browser display

@demo demo/index.html

@microcopy - the mental model for this element
 - hax-app - data wiring for an app, this element uses the visual side of this
*/
Polymer({
  _template: html`
    <style include="materializecss-styles-colors">
      :host {
        display: inline-flex;
      }
      :host[elevation="1"] {
        -webkit-transform: scale(1, 1);
        transform: scale(1, 1);
      }
      :host[elevation="2"] {
        -webkit-transform: scale(1.4, 1.4);
        transform: scale(1.4, 1.4);
      }
      paper-card {
        margin: 4px 0;
        border-radius: 10px;
      }
      paper-button {
        color: #000000;
        text-transform: none;
        margin:0;
        background-color: #ffffff;
        height: 72px !important;
        width: 72px !important;
        display: flex;
        border-radius: 10px;
        border-style: solid;
        border-width: 4px;
        font-weight: normal;
      }
      paper-button .item-title {
        font-size: 10px;
      }
      paper-button .button-inner {
        text-align: center;
      }
      paper-button iron-icon {
        height: 32px;
        width: 32px;
        display: inline-block;
      }
      .flip-icon {
        transform: rotateY(180deg);
      }
    </style>
    <paper-card id="card" elevation="[[elevation]]">
      <paper-button id="button" data-voicecommand\$="select [[title]]" class\$="[[color]] lighten-5 [[color]]-border">
        <div class="button-inner">
          <iron-icon icon="[[icon]]" class\$="[[color]]-text text-darken-3" hidden\$="[[!icon]]"></iron-icon>
          <iron-image src="[[image]]" preload="" sizing="cover" hidden\$="[[!image]]"></iron-image>
          <div class="item-title">[[title]]</div>
        </div>
      </paper-button>
    </paper-card>
`,

  is: "hax-app-browser-item",

  listeners: {
    tap: "_fireEvent",
    mousedown: "tapEventOn",
    mouseover: "tapEventOn",
    mouseout: "tapEventOff",
    "button.focusin": "tapEventOn",
    "button.focusout": "tapEventOff"
  },

  properties: {
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
      value: 1,
      reflectToAttribute: true
    }
  },

  /**
   * special handling for taps on the thing
   */
  tapEventOn: function(e) {
    this.elevation = 2;
  },

  /**
   * Hover off stop showing the deeper shadow.
   */
  tapEventOff: function(e) {
    this.elevation = 1;
  },

  /**
   * Fire an event that includes the eventName of what was just pressed.
   */
  _fireEvent: function(e) {
    this.fire("hax-app-selected", this.index);
  }
});

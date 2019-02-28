import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-image/iron-image.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "./hax-shared-styles.js";

/**
`hax-app-browser-item`
A button on the hax-app-browser display

* @demo demo/index.html

@microcopy - the mental model for this element
 - hax-app - data wiring for an app, this element uses the visual side of this
*/
Polymer({
  _template: html`
    <style include="simple-colors hax-shared-styles">
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
        color: var(--simple-colors-default-theme-grey-12);
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
      id="button"
      data-voicecommand\$="select [[title]]"
      title="[[title]]"
      class$="simple-colors-default-theme-[[color]]-4"
    >
      <div class="button-inner">
        <iron-icon icon="[[icon]]" hidden\$="[[!icon]]"></iron-icon>
        <iron-image
          src="[[image]]"
          preload=""
          sizing="cover"
          hidden\$="[[!image]]"
        ></iron-image>
      </div>
    </paper-button>
    <div class="item-title" aria-hidden="true">[[title]]</div>
  `,

  is: "hax-app-browser-item",

  listeners: {
    tap: "_fireEvent",
    mousedown: "tapEventOn",
    mouseover: "tapEventOn",
    mouseout: "tapEventOff",
    focusin: "tapEventOn",
    focusout: "tapEventOff"
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

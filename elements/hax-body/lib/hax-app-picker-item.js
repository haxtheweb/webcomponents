import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/av-icons.js";
import "@polymer/iron-icons/communication-icons.js";
import "@polymer/iron-icons/device-icons.js";
import "@polymer/iron-icons/editor-icons.js";
import "@polymer/iron-icons/hardware-icons.js";
import "@polymer/iron-icons/image-icons.js";
import "@polymer/iron-icons/maps-icons.js";
import "@polymer/iron-icons/notification-icons.js";
import "@polymer/iron-icons/social-icons.js";
import "@polymer/iron-icons/places-icons.js";
import "@lrnwebcomponents/lrn-icons/lrn-icons.js";
import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/paper-ripple/paper-ripple.js";
import "@polymer/paper-toast/paper-toast.js";
import "@polymer/paper-button/paper-button.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/materializecss-styles/lib/colors.js";
import "./hax-shared-styles.js";
/**
 `hax-app-picker-item`
 An item for displaying in a picker

* @demo demo/index.html
*/
Polymer({
  _template: html`
      <style include="materializecss-styles simple-colors hax-shared-styles">
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
          @apply --paper-font-caption;
          margin-top: 8px;
          color: var(--hax-color-text);
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          @apply --hax-app-picker-hax-element-text;
        }
        .icon {
          cursor: pointer;
          display: flex;
          width: 50px;
          height: 50px;
          padding: 5px;
          margin: 10px;
          color: #FFFFFF;
          border-radius: 50%;
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
            0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
          -webkit-transition: box-shadow 0.3s;
          -moz-transition: box-shadow 0.3s;
          -ms-transition: box-shadow 0.3s;
          -o-transition: box-shadow 0.3s;
          transition: box-shadow 0.3s;
          @apply --hax-app-picker-hax-element--icon;
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
          display: block;
          min-width: unset;
        }
        iron-icon {
          display: inline-flex;
          padding: 0;
          margin: 0;
          width: 36px;
          height: 36px;
        }
      </style>
    </custom-style>
    <paper-button id="button" class$="icon [[color]]" title="[[label]]">
      <iron-icon icon="[[icon]]"></iron-icon>
    </paper-button>
    <div aria-hidden="true">[[label]]</div>
  `,

  is: "hax-app-picker-item",

  listeners: {
    mousedown: "tapEventOn",
    mouseover: "tapEventOn",
    mouseout: "tapEventOff",
    focusin: "tapEventOn",
    focusout: "tapEventOff"
  },
  properties: {
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
  }
});

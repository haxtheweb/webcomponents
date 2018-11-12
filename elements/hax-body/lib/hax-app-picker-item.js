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
import "@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
 `hax-app-picker-item`
 An item for displaying in a picker

@demo demo/index.html
*/
Polymer({
  _template: html`
  <custom-style>
    <style is="custom-style" include="materializecss-styles">
      :host {
        display: inline-block;
        color: var(--hax-app-picker-dialog-text-color, #FFFFFF);
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
        color: #FFFFFF;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        @apply --hax-app-picker-hax-element-text;
      }
      .icon {
        cursor: pointer;
        width: 50px;
        height: 50px;
        padding: 4px;
        margin: 0;
        color: white;
        border-radius: 50%;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        -webkit-transition: box-shadow .2s;
        -moz-transition: box-shadow .2s;
        -ms-transition: box-shadow .2s;
        -o-transition: box-shadow .2s;
        transition: box-shadow .2s;
        @apply --hax-app-picker-hax-element--icon;
      }
      .icon:hover, .icon:focus {
        box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.14), 0 2px 10px 0 rgba(0, 0, 0, 0.12), 0 6px 2px -4px rgba(0, 0, 0, 0.2);
      }
      .icon:active {
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
      }
      paper-button {
        display: block;
        min-width: unset;
      }
      iron-icon {
        display: block;
        padding: 0;
        margin: 0;
        width: 40px;
        height: 40px;
      }
      @media screen and (max-width: 550px) {
        .icon {
          width: 32px;
          height: 32px;
          padding: 4px;
        }
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

  behaviors: [simpleColorsBehaviors],

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

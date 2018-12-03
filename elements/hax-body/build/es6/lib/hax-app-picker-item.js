import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/iron-icons/iron-icons.js";
import "../node_modules/@polymer/iron-icons/av-icons.js";
import "../node_modules/@polymer/iron-icons/communication-icons.js";
import "../node_modules/@polymer/iron-icons/device-icons.js";
import "../node_modules/@polymer/iron-icons/editor-icons.js";
import "../node_modules/@polymer/iron-icons/hardware-icons.js";
import "../node_modules/@polymer/iron-icons/image-icons.js";
import "../node_modules/@polymer/iron-icons/maps-icons.js";
import "../node_modules/@polymer/iron-icons/notification-icons.js";
import "../node_modules/@polymer/iron-icons/social-icons.js";
import "../node_modules/@polymer/iron-icons/places-icons.js";
import "../node_modules/@lrnwebcomponents/lrn-icons/lrn-icons.js";
import "../node_modules/@polymer/paper-dialog/paper-dialog.js";
import "../node_modules/@polymer/paper-ripple/paper-ripple.js";
import "../node_modules/@polymer/paper-toast/paper-toast.js";
import "../node_modules/@polymer/paper-button/paper-button.js";
import "../node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";
Polymer({
  _template: html`
    <custom-style>
      <style is="custom-style" include="materializecss-styles simple-colors">
        :host {
          display: inline-block;
          color: var(--hax-app-picker-dialog-text-color, #ffffff);
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
          color: #ffffff;
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
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
            0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
          -webkit-transition: box-shadow 0.2s;
          -moz-transition: box-shadow 0.2s;
          -ms-transition: box-shadow 0.2s;
          -o-transition: box-shadow 0.2s;
          transition: box-shadow 0.2s;
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
  properties: {
    color: { type: String },
    icon: { type: String },
    label: { type: String },
    elevation: { type: Number, value: 1, reflectToAttribute: !0 }
  },
  tapEventOn: function(e) {
    this.elevation = 2;
  },
  tapEventOff: function(e) {
    this.elevation = 1;
  }
});

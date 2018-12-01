import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/paper-button/paper-button.js";
import "../node_modules/@polymer/paper-icon-button/paper-icon-button.js";
import "../node_modules/@polymer/paper-tooltip/paper-tooltip.js";
import "../node_modules/@polymer/iron-icons/iron-icons.js";
import "../node_modules/@polymer/iron-icons/editor-icons.js";
import "../node_modules/@polymer/iron-icons/device-icons.js";
import "../node_modules/@polymer/iron-icons/hardware-icons.js";
import "../node_modules/@polymer/iron-icons/social-icons.js";
import "../node_modules/@polymer/iron-icons/av-icons.js";
import "../node_modules/@polymer/iron-icons/image-icons.js";
import "../node_modules/@polymer/iron-icons/maps-icons.js";
import "../node_modules/@polymer/neon-animation/neon-animation.js";
import "./hax-toolbar-item.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: inline-flex;
      }
      :host([menu]) {
        display: flex;
        width: 100%;
      }
    </style>
    <hax-toolbar-item
      disabled="[[disabled]]"
      light="[[light]]"
      mini="[[mini]]"
      id="button"
      icon="[[icon]]"
      hidden\$="[[!icon]]"
      icon-class="[[iconClass]]"
      on-tap="_fireEvent"
      tooltip="[[label]]"
      tooltip-direction="[[direction]]"
      default="[[default]]"
      menu="[[menu]]"
    >
      <slot></slot>
    </hax-toolbar-item>
  `,
  is: "hax-context-item",
  properties: {
    light: { type: Boolean, value: !1 },
    disabled: { type: Boolean, value: !1, reflectToAttribute: !0 },
    mini: { type: Boolean, value: !1 },
    menu: { type: Boolean, value: !1 },
    direction: { type: String, value: "top" },
    icon: { type: String, value: "editor:text-fields", reflectToAttribute: !0 },
    iconClass: { type: String, value: "", reflectToAttribute: !0 },
    label: { type: String, value: "", reflectToAttribute: !0 },
    eventName: { type: String, value: "button", reflectToAttribute: !0 },
    inputMethod: { type: String, value: null, reflectToAttribute: !0 },
    propertyToBind: { type: String, value: null, reflectToAttribute: !0 },
    slotToBind: { type: String, value: null, reflectToAttribute: !0 },
    description: { type: String, reflectToAttribute: !0 },
    default: { type: Boolean, value: !1 },
    value: { type: String, value: "" }
  },
  _fireEvent: function(e) {
    this.fire("hax-context-item-selected", {
      target: this,
      eventName: this.eventName,
      value: this.value
    });
  }
});

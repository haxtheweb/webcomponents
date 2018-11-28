import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/iron-a11y-keys/iron-a11y-keys.js";
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
import "../node_modules/@lrnwebcomponents/materializecss-styles/lib/colors.js";
import "../node_modules/@polymer/neon-animation/neon-animation.js";
import "./hax-toolbar-item.js";
Polymer({
  _template: html`
    <style include="materializecss-styles-colors">
      :host {
        display: inline-flex;
        box-sizing: border-box;
      }
      :host([menu]) {
        display: flex;
        width: 100%;
      }
    </style>
    <iron-a11y-keys id="a11y" target="[[target]]" keys="enter" on-keys-pressed="_fireEvent"></iron-a11y-keys>
    <hax-toolbar-item corner="[[corner]]" id="button" icon="[[icon]]" hidden\$="[[!icon]]" tooltip-direction="[[direction]]" tooltip="[[label]]" class\$="[[iconClass]]" on-mousedown="_fireEvent" icon-class="[[iconClass]]" mini="[[mini]]" menu="[[menu]]" light="[[light]]">
      <slot></slot>
    </hax-toolbar-item>
`,
  is: "hax-context-item-textop",
  properties: {
    corner: { type: String, value: "" },
    target: { type: Object },
    light: { type: Boolean, value: !1 },
    mini: { type: Boolean, value: !1 },
    menu: { type: Boolean, value: !1 },
    direction: { type: String, value: "top" },
    icon: { type: String, value: "editor:text-fields", reflectToAttribute: !0 },
    iconClass: { type: String, value: "", reflectToAttribute: !0 },
    label: {
      type: String,
      value: "editor:text-fields",
      reflectToAttribute: !0
    },
    eventName: { type: String, value: "button", reflectToAttribute: !0 },
    inputMethod: { type: String, value: null, reflectToAttribute: !0 },
    propertyToBind: { type: String, value: null, reflectToAttribute: !0 },
    slotToBind: { type: String, value: null, reflectToAttribute: !0 },
    description: { type: String, reflectToAttribute: !0 }
  },
  ready: function() {
    this.target = this.$.button;
  },
  _fireEvent: function(e) {
    this.fire("hax-context-item-selected", {
      target: this,
      eventName: this.eventName
    });
  }
});

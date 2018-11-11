import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";
import "../node_modules/@lrnwebcomponents/paper-avatar/paper-avatar.js";
import "../node_modules/@polymer/app-layout/app-layout.js";
import "../node_modules/@polymer/paper-tooltip/paper-tooltip.js";
import "../node_modules/@polymer/paper-button/paper-button.js";
import "../node_modules/@polymer/iron-icons/iron-icons.js";
import "./lrnsys-button-inner.js";
import "./lrnsys-drawer-modal.js";
Polymer({
  _template: html`
    <style is="custom-style" include="simple-colors">
      :host {
        display: block;
        --lrnsys-drawer-color: var(--simple-colors-foreground1);
        --lrnsys-drawer-background-color: var(--simple-colors-background1);
      }
      lrnsys-drawer-modal {
        --lrnsys-drawer-width: 30%;
      }
    </style>
    <paper-button class\$="[[class]]" id="flyouttrigger" on-tap="toggleDrawer" raised="[[raised]]" disabled\$="[[disabled]]" title="[[alt]]">
      <lrnsys-button-inner avatar="[[avatar]]" icon="[[icon]]" text="[[text]]">
        <slot name="button"></slot>
      </lrnsys-button-inner>
    </paper-button>
    <paper-tooltip for="flyouttrigger" animation-delay="0">[[alt]]</paper-tooltip>
    <lrnsys-drawer-modal id="modal" body-append="[[bodyAppend]]" opened="[[opened]]" align="[[align]]" header="[[header]]" heading-class="[[headingClass]]">
      <slot name="header" slot="header"></slot>
      <slot></slot>
    </lrnsys-drawer-modal>
`,
  is: "lrnsys-drawer",
  listeners: {
    mousedown: "tapEventOn",
    mouseover: "tapEventOn",
    mouseout: "tapEventOff"
  },
  behaviors: [simpleColorsBehaviors],
  properties: {
    opened: { type: Boolean, value: !1, reflectToAttribute: !0 },
    raised: { type: Boolean, reflectToAttribute: !0 },
    icon: { type: String },
    avatar: { type: String },
    text: { type: String },
    align: { type: String, value: "left" },
    alt: { type: String, reflectToAttribute: !0 },
    header: { type: String },
    disabled: { type: Boolean, value: !1, reflectToAttribute: !0 },
    hoverClass: { type: String },
    headingClass: { type: String, value: "white-text black" },
    bodyAppend: { type: Boolean, value: !0 },
    focusState: { type: Boolean, value: !1 }
  },
  ready: function() {
    this.__modal = this.$.modal;
  },
  attached: function() {
    document.body.addEventListener(
      "lrnsys-drawer-modal-closed",
      this._accessibleFocus.bind(this)
    );
    this.$.flyouttrigger.addEventListener(
      "focused-changed",
      this.focusToggle.bind(this)
    );
  },
  detached: function() {
    document.body.removeEventListener(
      "lrnsys-drawer-modal-closed",
      this._accessibleFocus.bind(this)
    );
    this.$.flyouttrigger.removeEventListener(
      "focused-changed",
      this.focusToggle.bind(this)
    );
  },
  _accessibleFocus: function(e) {
    if (e.detail === this.__modal) {
      this.$.flyouttrigger.focus();
    }
  },
  tapEventOn: function() {
    const root = this;
    if (typeof root.hoverClass !== typeof void 0) {
      var classes = root.hoverClass.split(" ");
      classes.forEach(function(item) {
        if ("" != item) {
          root.$.flyouttrigger.classList.add(item);
        }
      });
    }
  },
  tapEventOff: function() {
    const root = this;
    if (typeof root.hoverClass !== typeof void 0) {
      var classes = root.hoverClass.split(" ");
      classes.forEach(function(item) {
        if ("" != item) {
          root.$.flyouttrigger.classList.remove(item);
        }
      });
    }
  },
  toggleDrawer: function() {
    this.$.modal.open();
  },
  focusToggle: function() {
    const root = this;
    root.fire("focus-changed", { focus: root.focusState });
    if (typeof root.hoverClass !== typeof void 0) {
      var classes = root.hoverClass.split(" ");
      classes.forEach(function(item) {
        if ("" != item) {
          if (root.focusState) {
            root.$.flyouttrigger.classList.add(item);
          } else {
            root.$.flyouttrigger.classList.remove(item);
          }
        }
      });
    }
    root.focusState = !root.focusState;
  },
  _getTextLabelClass: function() {
    if (!this.avatar && !this.icon) {
      return "text-label-only";
    }
    return "text-label";
  }
});

import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@lrnwebcomponents/paper-avatar/paper-avatar.js";
import "../node_modules/@lrnwebcomponents/lrn-icons/lrn-icons.js";
import "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";
import "../node_modules/@polymer/paper-dialog/paper-dialog.js";
import "../node_modules/@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js";
import "../node_modules/@polymer/paper-tooltip/paper-tooltip.js";
import "../node_modules/@polymer/paper-button/paper-button.js";
import "../node_modules/@polymer/neon-animation/neon-animation.js";
import "../node_modules/@polymer/neon-animation/neon-animations.js";
import "../node_modules/@polymer/iron-icons/iron-icons.js";
import "./lrnsys-dialog-modal.js";
import "./lrnsys-button-inner.js";
Polymer({
  _template: html`
    <style is="custom-style" include="simple-colors">
      :host {
        display: inline-block;
        --lrnsys-dialog-color: var(--simple-colors-foreground1,#000);
        --lrnsys-dialog-background-color: var(--simple-colors-background1);
        --lrnsys-dialog-toolbar-background-color: var(--simple-colors-background3);
        --lrnsys-dialog-secondary-background-color: rgba(255,255,255, 0.7);
      }
      :host([dark]) {
        --lrnsys-dialog-toolbar-background-color: var(--simple-colors-background1);
        --lrnsys-dialog-background-color: var(--simple-colors-background3);
        --lrnsys-dialog-secondary-background-color: rgba(0, 0, 0, 0.7);
      }
    </style>
    <paper-button class\$="[[class]]" id="dialogtrigger" on-tap="toggleDialog" raised="[[raised]]" disabled\$="[[disabled]]" title="[[alt]]" aria-label\$="[[alt]]">
      <lrnsys-button-inner avatar\$="[[avatar]]" icon\$="[[icon]]" text\$="[[text]]">
        <slot name="button"></slot>
      </lrnsys-button-inner>
    </paper-button>
    <paper-tooltip for="dialogtrigger" animation-delay="0" hidden\$="[[!alt]]">[[alt]]</paper-tooltip>
    <lrnsys-dialog-modal id="modal" dynamic-images="[[dynamicImages]]" body-append="[[bodyAppend]]" header="[[header]]" modal="[[modal]]" heading-class="[[headingClass]]" opened\$="[[opened]]">
      <slot name="toolbar-primary" slot="primary"></slot>
      <slot name="toolbar-secondary" slot="secondary"></slot>
      <slot name="header" slot="header"></slot>
      <slot></slot>
    </lrnsys-dialog-modal>
`,
  is: "lrnsys-dialog",
  listeners: {
    mousedown: "tapEventOn",
    mouseover: "tapEventOn",
    mouseout: "tapEventOff",
    "dialogtrigger.focused-changed": "focusToggle"
  },
  behaviors: [simpleColorsBehaviors],
  properties: {
    icon: { type: String },
    raised: { type: Boolean },
    avatar: { type: String },
    text: { type: String },
    alt: { type: String, reflectToAttribute: !0 },
    header: { type: String },
    disabled: { type: Boolean, value: !1 },
    modal: { type: Boolean, value: !1 },
    opened: { type: Boolean, value: !1, reflectToAttribute: !0, notify: !0 },
    hoverClass: { type: String },
    headingClass: { type: String, value: "white-text black" },
    bodyAppend: { type: Boolean, value: !0 },
    dynamicImages: { type: Boolean, value: !1 },
    focusState: { type: Boolean, value: !1 },
    disableAutoFocus: { type: Boolean, value: !1 }
  },
  tapEventOn: function() {
    const root = this;
    if (typeof root.hoverClass !== typeof void 0) {
      var classes = root.hoverClass.split(" ");
      classes.forEach(function(item) {
        if ("" != item) {
          root.$.dialogtrigger.classList.add(item);
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
          root.$.dialogtrigger.classList.remove(item);
        }
      });
    }
  },
  toggleDialog: function() {
    this.$.modal.toggleDialog();
  },
  focusToggle: function() {
    const root = this;
    root.fire("focus-changed", { focus: root.focusState });
    if (typeof root.hoverClass !== typeof void 0) {
      var classes = root.hoverClass.split(" ");
      classes.forEach(function(item) {
        if ("" != item) {
          if (root.focusState) {
            root.$.dialogtrigger.classList.add(item);
          } else {
            root.$.dialogtrigger.classList.remove(item);
          }
        }
      });
    }
    root.focusState = !root.focusState;
  },
  ready: function() {
    this.__modal = this.$.modal;
  },
  attached: function() {
    document.body.addEventListener(
      "lrnsys-dialog-modal-changed",
      this._changeOpen.bind(this)
    );
    if (!this.disableAutoFocus) {
      document.body.addEventListener(
        "lrnsys-dialog-modal-closed",
        this._accessibleFocus.bind(this)
      );
    }
  },
  _accessibleFocus: function(e) {
    if (e.detail === this.__modal) {
      this.$.dialogtrigger.focus();
    }
  },
  _changeOpen: function(e) {
    e.stopPropagation();
    if (e.detail === this.$.modal) {
      this.opened = "iron-overlay-opened" === e.type;
      this.fire("lrnsys-dialog-changed", this);
    }
  }
});

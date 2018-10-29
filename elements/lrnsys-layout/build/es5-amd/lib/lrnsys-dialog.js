define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@lrnwebcomponents/paper-avatar/paper-avatar.js",
  "../node_modules/@lrnwebcomponents/lrn-icons/lrn-icons.js",
  "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js",
  "../node_modules/@polymer/paper-dialog/paper-dialog.js",
  "../node_modules/@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js",
  "../node_modules/@polymer/paper-tooltip/paper-tooltip.js",
  "../node_modules/@polymer/paper-button/paper-button.js",
  "../node_modules/@polymer/neon-animation/neon-animation.js",
  "../node_modules/@polymer/neon-animation/neon-animations.js",
  "../node_modules/@polymer/iron-icons/iron-icons.js",
  "./lrnsys-dialog-modal.js",
  "./lrnsys-button-inner.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_7d837670db3411e894bf75c5e7929da1() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style is="custom-style" include="simple-colors">\n      :host {\n        display: inline-block;\n        --lrnsys-dialog-color: var(--simple-colors-foreground1,#000);\n        --lrnsys-dialog-background-color: var(--simple-colors-background1);\n        --lrnsys-dialog-toolbar-background-color: var(--simple-colors-background3);\n        --lrnsys-dialog-secondary-background-color: rgba(255,255,255, 0.7);\n      }\n      :host[dark] {\n        --lrnsys-dialog-toolbar-background-color: var(--simple-colors-background1);\n        --lrnsys-dialog-background-color: var(--simple-colors-background3);\n        --lrnsys-dialog-secondary-background-color: rgba(0, 0, 0, 0.7);\n      }\n    </style>\n    <paper-button class$="[[class]]" id="dialogtrigger" on-tap="toggleDialog" raised="[[raised]]" disabled$="[[disabled]]" title="[[alt]]" aria-label$="[[alt]]">\n      <lrnsys-button-inner avatar$="[[avatar]]" icon$="[[icon]]" text$="[[text]]">\n        <slot name="button"></slot>\n      </lrnsys-button-inner>\n    </paper-button>\n    <paper-tooltip for="dialogtrigger" animation-delay="0" hidden$="[[!alt]]">[[alt]]</paper-tooltip>\n    <lrnsys-dialog-modal id="modal" dynamic-images="[[dynamicImages]]" body-append="[[bodyAppend]]" header="[[header]]" modal="[[modal]]" heading-class="[[headingClass]]" opened$="[[opened]]">\n      <slot name="toolbar-primary" slot="primary"></slot>\n      <slot name="toolbar-secondary" slot="secondary"></slot>\n      <slot name="header" slot="header"></slot>\n      <slot></slot>\n    </lrnsys-dialog-modal>\n'
      ],
      [
        '\n    <style is="custom-style" include="simple-colors">\n      :host {\n        display: inline-block;\n        --lrnsys-dialog-color: var(--simple-colors-foreground1,#000);\n        --lrnsys-dialog-background-color: var(--simple-colors-background1);\n        --lrnsys-dialog-toolbar-background-color: var(--simple-colors-background3);\n        --lrnsys-dialog-secondary-background-color: rgba(255,255,255, 0.7);\n      }\n      :host[dark] {\n        --lrnsys-dialog-toolbar-background-color: var(--simple-colors-background1);\n        --lrnsys-dialog-background-color: var(--simple-colors-background3);\n        --lrnsys-dialog-secondary-background-color: rgba(0, 0, 0, 0.7);\n      }\n    </style>\n    <paper-button class\\$="[[class]]" id="dialogtrigger" on-tap="toggleDialog" raised="[[raised]]" disabled\\$="[[disabled]]" title="[[alt]]" aria-label\\$="[[alt]]">\n      <lrnsys-button-inner avatar\\$="[[avatar]]" icon\\$="[[icon]]" text\\$="[[text]]">\n        <slot name="button"></slot>\n      </lrnsys-button-inner>\n    </paper-button>\n    <paper-tooltip for="dialogtrigger" animation-delay="0" hidden\\$="[[!alt]]">[[alt]]</paper-tooltip>\n    <lrnsys-dialog-modal id="modal" dynamic-images="[[dynamicImages]]" body-append="[[bodyAppend]]" header="[[header]]" modal="[[modal]]" heading-class="[[headingClass]]" opened\\$="[[opened]]">\n      <slot name="toolbar-primary" slot="primary"></slot>\n      <slot name="toolbar-secondary" slot="secondary"></slot>\n      <slot name="header" slot="header"></slot>\n      <slot></slot>\n    </lrnsys-dialog-modal>\n'
      ]
    );
    _templateObject_7d837670db3411e894bf75c5e7929da1 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_7d837670db3411e894bf75c5e7929da1()
    ),
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
    tapEventOn: function tapEventOn() {
      var root = this;
      if (babelHelpers.typeof(root.hoverClass) !== "undefined") {
        var classes = root.hoverClass.split(" ");
        classes.forEach(function(item) {
          if ("" != item) {
            root.$.dialogtrigger.classList.add(item);
          }
        });
      }
    },
    tapEventOff: function tapEventOff() {
      var root = this;
      if (babelHelpers.typeof(root.hoverClass) !== "undefined") {
        var classes = root.hoverClass.split(" ");
        classes.forEach(function(item) {
          if ("" != item) {
            root.$.dialogtrigger.classList.remove(item);
          }
        });
      }
    },
    toggleDialog: function toggleDialog() {
      this.$.modal.toggleDialog();
    },
    focusToggle: function focusToggle() {
      var root = this;
      root.fire("focus-changed", { focus: root.focusState });
      if (babelHelpers.typeof(root.hoverClass) !== "undefined") {
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
    ready: function ready() {
      this.__modal = this.$.modal;
    },
    attached: function attached() {
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
    _accessibleFocus: function _accessibleFocus(e) {
      if (e.detail === this.__modal) {
        this.$.dialogtrigger.focus();
      }
    },
    _changeOpen: function _changeOpen(e) {
      e.stopPropagation();
      if (e.detail === this.$.modal) {
        this.opened = "iron-overlay-opened" === e.type;
        this.fire("lrnsys-dialog-changed", this);
      }
    }
  });
});

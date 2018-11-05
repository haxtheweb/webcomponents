define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js",
  "../node_modules/@lrnwebcomponents/paper-avatar/paper-avatar.js",
  "../node_modules/@polymer/app-layout/app-layout.js",
  "../node_modules/@polymer/paper-tooltip/paper-tooltip.js",
  "../node_modules/@polymer/paper-button/paper-button.js",
  "../node_modules/@polymer/iron-icons/iron-icons.js",
  "./lrnsys-button-inner.js",
  "./lrnsys-drawer-modal.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_774af300e11a11e8b4f541c7942e7f2e() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style is="custom-style" include="simple-colors">\n      :host {\n        display: block;\n        --lrnsys-drawer-color: var(--simple-colors-foreground1);\n        --lrnsys-drawer-background-color: var(--simple-colors-background1);\n      }\n      lrnsys-drawer-modal {\n        --lrnsys-drawer-width: 30%;\n      }\n    </style>\n    <paper-button class$="[[class]]" id="flyouttrigger" on-tap="toggleDrawer" raised="[[raised]]" disabled$="[[disabled]]" title="[[alt]]">\n      <lrnsys-button-inner avatar="[[avatar]]" icon="[[icon]]" text="[[text]]">\n        <slot name="button"></slot>\n      </lrnsys-button-inner>\n    </paper-button>\n    <paper-tooltip for="flyouttrigger" animation-delay="0">[[alt]]</paper-tooltip>\n    <lrnsys-drawer-modal id="modal" body-append="[[bodyAppend]]" opened="[[opened]]" align="[[align]]" header="[[header]]" heading-class="[[headingClass]]">\n      <slot name="header" slot="header"></slot>\n      <slot></slot>\n    </lrnsys-drawer-modal>\n'
      ],
      [
        '\n    <style is="custom-style" include="simple-colors">\n      :host {\n        display: block;\n        --lrnsys-drawer-color: var(--simple-colors-foreground1);\n        --lrnsys-drawer-background-color: var(--simple-colors-background1);\n      }\n      lrnsys-drawer-modal {\n        --lrnsys-drawer-width: 30%;\n      }\n    </style>\n    <paper-button class\\$="[[class]]" id="flyouttrigger" on-tap="toggleDrawer" raised="[[raised]]" disabled\\$="[[disabled]]" title="[[alt]]">\n      <lrnsys-button-inner avatar="[[avatar]]" icon="[[icon]]" text="[[text]]">\n        <slot name="button"></slot>\n      </lrnsys-button-inner>\n    </paper-button>\n    <paper-tooltip for="flyouttrigger" animation-delay="0">[[alt]]</paper-tooltip>\n    <lrnsys-drawer-modal id="modal" body-append="[[bodyAppend]]" opened="[[opened]]" align="[[align]]" header="[[header]]" heading-class="[[headingClass]]">\n      <slot name="header" slot="header"></slot>\n      <slot></slot>\n    </lrnsys-drawer-modal>\n'
      ]
    );
    _templateObject_774af300e11a11e8b4f541c7942e7f2e = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_774af300e11a11e8b4f541c7942e7f2e()
    ),
    is: "lrnsys-drawer",
    listeners: {
      mousedown: "tapEventOn",
      mouseover: "tapEventOn",
      mouseout: "tapEventOff",
      "flyouttrigger.focused-changed": "focusToggle"
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
    ready: function ready() {
      this.__modal = this.$.modal;
    },
    attached: function attached() {
      document.body.addEventListener(
        "lrnsys-drawer-modal-closed",
        this._accessibleFocus.bind(this)
      );
    },
    _accessibleFocus: function _accessibleFocus(e) {
      if (e.detail === this.__modal) {
        this.$.flyouttrigger.focus();
      }
    },
    tapEventOn: function tapEventOn() {
      var root = this;
      if (babelHelpers.typeof(root.hoverClass) !== "undefined") {
        var classes = root.hoverClass.split(" ");
        classes.forEach(function(item) {
          if ("" != item) {
            root.$.flyouttrigger.classList.add(item);
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
            root.$.flyouttrigger.classList.remove(item);
          }
        });
      }
    },
    toggleDrawer: function toggleDrawer() {
      this.$.modal.open();
    },
    focusToggle: function focusToggle() {
      var root = this;
      root.fire("focus-changed", { focus: root.focusState });
      if (babelHelpers.typeof(root.hoverClass) !== "undefined") {
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
    _getTextLabelClass: function _getTextLabelClass() {
      if (!this.avatar && !this.icon) {
        return "text-label-only";
      }
      return "text-label";
    }
  });
});

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
], function(
  _polymerLegacy,
  _simpleColors,
  _paperAvatar,
  _appLayout,
  _paperTooltip,
  _paperButton,
  _ironIcons,
  _lrnsysButtonInner,
  _lrnsysDrawerModal
) {
  "use strict";
  function _templateObject_77b66f10f32e11e8a99157a68f28c36b() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style is="custom-style" include="simple-colors">\n      :host {\n        display: block;\n        --lrnsys-drawer-color: var(--simple-colors-foreground1);\n        --lrnsys-drawer-background-color: var(--simple-colors-background1);\n      }\n      lrnsys-drawer-modal {\n        --lrnsys-drawer-width: 30%;\n      }\n      paper-button {\n        display:inline-block;\n      }\n    </style>\n    <paper-button class$="[[class]]" id="flyouttrigger" on-tap="toggleDrawer" raised="[[raised]]" disabled$="[[disabled]]" title="[[alt]]">\n      <lrnsys-button-inner avatar="[[avatar]]" icon="[[icon]]" text="[[text]]">\n        <slot name="button"></slot>\n      </lrnsys-button-inner>\n    </paper-button>\n    <paper-tooltip for="flyouttrigger" animation-delay="0">[[alt]]</paper-tooltip>\n    <lrnsys-drawer-modal id="modal" opened="[[opened]]" align="[[align]]" header="[[header]]" heading-class="[[headingClass]]">\n      <slot name="header" slot="header"></slot>\n      <slot></slot>\n    </lrnsys-drawer-modal>\n'
      ],
      [
        '\n    <style is="custom-style" include="simple-colors">\n      :host {\n        display: block;\n        --lrnsys-drawer-color: var(--simple-colors-foreground1);\n        --lrnsys-drawer-background-color: var(--simple-colors-background1);\n      }\n      lrnsys-drawer-modal {\n        --lrnsys-drawer-width: 30%;\n      }\n      paper-button {\n        display:inline-block;\n      }\n    </style>\n    <paper-button class\\$="[[class]]" id="flyouttrigger" on-tap="toggleDrawer" raised="[[raised]]" disabled\\$="[[disabled]]" title="[[alt]]">\n      <lrnsys-button-inner avatar="[[avatar]]" icon="[[icon]]" text="[[text]]">\n        <slot name="button"></slot>\n      </lrnsys-button-inner>\n    </paper-button>\n    <paper-tooltip for="flyouttrigger" animation-delay="0">[[alt]]</paper-tooltip>\n    <lrnsys-drawer-modal id="modal" opened="[[opened]]" align="[[align]]" header="[[header]]" heading-class="[[headingClass]]">\n      <slot name="header" slot="header"></slot>\n      <slot></slot>\n    </lrnsys-drawer-modal>\n'
      ]
    );
    _templateObject_77b66f10f32e11e8a99157a68f28c36b = function _templateObject_77b66f10f32e11e8a99157a68f28c36b() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_77b66f10f32e11e8a99157a68f28c36b()
    ),
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
      this.$.flyouttrigger.addEventListener(
        "focused-changed",
        this.focusToggle.bind(this)
      );
    },
    detached: function detached() {
      document.body.removeEventListener(
        "lrnsys-drawer-modal-closed",
        this._accessibleFocus.bind(this)
      );
      this.$.flyouttrigger.removeEventListener(
        "focused-changed",
        this.focusToggle.bind(this)
      );
    },
    _accessibleFocus: function _accessibleFocus(e) {
      if (e.detail === this.__modal) {
        this.$.flyouttrigger.focus();
      }
    },
    tapEventOn: function tapEventOn(e) {
      var root = this;
      if (
        babelHelpers.typeof(root.hoverClass) !==
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        var classes = root.hoverClass.split(" ");
        classes.forEach(function(item, index) {
          if ("" != item) {
            root.$.flyouttrigger.classList.add(item);
          }
        });
      }
    },
    tapEventOff: function tapEventOff(e) {
      var root = this;
      if (
        babelHelpers.typeof(root.hoverClass) !==
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        var classes = root.hoverClass.split(" ");
        classes.forEach(function(item, index) {
          if ("" != item) {
            root.$.flyouttrigger.classList.remove(item);
          }
        });
      }
    },
    toggleDrawer: function toggleDrawer() {
      this.$.modal.open();
    },
    focusToggle: function focusToggle(e) {
      var root = this;
      root.fire("focus-changed", { focus: root.focusState });
      if (
        babelHelpers.typeof(root.hoverClass) !==
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        var classes = root.hoverClass.split(" ");
        classes.forEach(function(item, index) {
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

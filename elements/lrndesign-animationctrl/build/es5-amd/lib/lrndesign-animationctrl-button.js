define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/paper-button/paper-button.js",
  "../node_modules/@polymer/iron-icon/iron-icon.js"
], function(_polymerLegacy, _paperButton, _ironIcon) {
  "use strict";
  function _templateObject_41a5c160f32d11e8b468dd6b6ed5ee5e() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n      }\n      paper-button {\n        @apply --animationctrl-button;\n      }\n      iron-icon {\n        display: inline-flex;\n      }\n      :host iron-icon[hidden] {\n        display: none;\n      }\n    </style>\n    <paper-button raised="" id="[[name]]" on-tap="_tap">\n      [[name]] \n      <iron-icon icon="[[icon]]" hidden$="[[!icon]]"></iron-icon>\n    </paper-button>\n'
    ]);
    _templateObject_41a5c160f32d11e8b468dd6b6ed5ee5e = function _templateObject_41a5c160f32d11e8b468dd6b6ed5ee5e() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_41a5c160f32d11e8b468dd6b6ed5ee5e()
    ),
    is: "lrndesign-animationctrl-button",
    properties: {
      name: { type: String, value: "buttonid" },
      icon: { type: String, value: !1 }
    },
    _tap: function _tap(e) {
      e.preventDefault();
      this.fire("lrndesign-animationctrl-click", { button: this.name });
    }
  });
});

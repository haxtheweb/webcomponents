define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/iron-icons/iron-icons.js",
  "../node_modules/@polymer/iron-icon/iron-icon.js"
], function(_polymerLegacy, _ironIcons, _ironIcon) {
  "use strict";
  function _templateObject_cb87f410f32e11e8980987e1e9d0e51a() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n        --lrndesign-mapmenu-item-height: 16px;\n      }\n      iron-icon {\n        --iron-icon-height: var(--lrndesign-mapmenu-item-height);\n        display: inline-flex;\n      }\n    </style>\n    <template is="dom-if" if="[[icon]]">\n      <iron-icon icon="[[icon]]"></iron-icon>\n    </template>\n    <span id="title">[[title]]</span>\n'
    ]);
    _templateObject_cb87f410f32e11e8980987e1e9d0e51a = function _templateObject_cb87f410f32e11e8980987e1e9d0e51a() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_cb87f410f32e11e8980987e1e9d0e51a()
    ),
    is: "lrndesign-mapmenu-item",
    properties: babelHelpers.defineProperty(
      {
        icon: { type: String, value: "" },
        title: { type: String, value: "" },
        url: { type: String, value: "" }
      },
      "icon",
      { type: String, value: "" }
    )
  });
});

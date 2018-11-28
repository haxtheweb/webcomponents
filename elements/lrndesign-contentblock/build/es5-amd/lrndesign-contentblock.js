define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-legacy.js"
], function(_exports, _polymerLegacy) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrndesignContentblock = void 0;
  function _templateObject_2d31f740f32c11e89ebc635f9b54f49a() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n  <style>\n      :host {\n        display: inline-block;\n        position: relative;\n        box-sizing: border-box;\n      }\n    </style>\n    <h3>[[title]]</h3>\n    <slot></slot>\n"
    ]);
    _templateObject_2d31f740f32c11e89ebc635f9b54f49a = function _templateObject_2d31f740f32c11e89ebc635f9b54f49a() {
      return data;
    };
    return data;
  }
  var LrndesignContentblock = (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_2d31f740f32c11e89ebc635f9b54f49a()
    ),
    is: "lrndesign-contentblock",
    properties: { title: { type: String } }
  });
  _exports.LrndesignContentblock = LrndesignContentblock;
});

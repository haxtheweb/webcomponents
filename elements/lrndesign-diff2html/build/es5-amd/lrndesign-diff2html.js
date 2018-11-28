define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-legacy.js"
], function(_exports, _polymerLegacy) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrndesignDiff2html = void 0;
  function _templateObject_54ec72a0f32d11e8a502457f7100ae34() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <h2>[[title]]</h2>\n"
    ]);
    _templateObject_54ec72a0f32d11e8a502457f7100ae34 = function _templateObject_54ec72a0f32d11e8a502457f7100ae34() {
      return data;
    };
    return data;
  }
  var LrndesignDiff2html = (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_54ec72a0f32d11e8a502457f7100ae34()
    ),
    is: "lrndesign-diff2html",
    properties: { title: { type: String, value: "lrndesign-diff2html" } }
  });
  _exports.LrndesignDiff2html = LrndesignDiff2html;
});

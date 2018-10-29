define(["./node_modules/@polymer/polymer/polymer-legacy.js"], function(
  _polymerLegacy
) {
  "use strict";
  function _templateObject_3b94e800dbb811e8bb52c1d533326319() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <h2>[[title]]</h2>\n"
    ]);
    _templateObject_3b94e800dbb811e8bb52c1d533326319 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_3b94e800dbb811e8bb52c1d533326319()
    ),
    is: "lrndesign-diff2html",
    properties: { title: { type: String, value: "lrndesign-diff2html" } }
  });
});

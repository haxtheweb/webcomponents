define(["./node_modules/@polymer/polymer/polymer-legacy.js"], function(
  _polymerLegacy
) {
  "use strict";
  function _templateObject_05a1d780e70711e8b860dd95ed7b28cd() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <h2>[[title]]</h2>\n"
    ]);
    _templateObject_05a1d780e70711e8b860dd95ed7b28cd = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_05a1d780e70711e8b860dd95ed7b28cd()
    ),
    is: "lrndesign-diff2html",
    properties: { title: { type: String, value: "lrndesign-diff2html" } }
  });
});

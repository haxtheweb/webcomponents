define(["./node_modules/@polymer/polymer/polymer-legacy.js"], function(
  _polymerLegacy
) {
  "use strict";
  function _templateObject_50d04aa0e11911e89f303934f3dc531c() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <h2>[[title]]</h2>\n"
    ]);
    _templateObject_50d04aa0e11911e89f303934f3dc531c = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_50d04aa0e11911e89f303934f3dc531c()
    ),
    is: "lrnapp-gallery-grid",
    properties: { title: { type: String, value: "lrnapp-gallery-grid" } }
  });
});

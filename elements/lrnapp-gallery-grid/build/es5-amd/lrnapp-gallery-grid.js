define(["./node_modules/@polymer/polymer/polymer-legacy.js"], function(
  _polymerLegacy
) {
  "use strict";
  function _templateObject_c9560550dea811e88afe871fc742e811() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <h2>[[title]]</h2>\n"
    ]);
    _templateObject_c9560550dea811e88afe871fc742e811 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_c9560550dea811e88afe871fc742e811()
    ),
    is: "lrnapp-gallery-grid",
    properties: { title: { type: String, value: "lrnapp-gallery-grid" } }
  });
});

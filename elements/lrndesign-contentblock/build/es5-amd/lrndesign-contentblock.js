define(["./node_modules/@polymer/polymer/polymer-legacy.js"], function(
  _polymerLegacy
) {
  "use strict";
  function _templateObject_013d68e0dbb711e8bfa027af46c4f1de() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n  <style>\n      :host {\n        display: inline-block;\n        position: relative;\n        box-sizing: border-box;\n      }\n    </style>\n    <h3>[[title]]</h3>\n    <slot></slot>\n"
    ]);
    _templateObject_013d68e0dbb711e8bfa027af46c4f1de = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_013d68e0dbb711e8bfa027af46c4f1de()
    ),
    is: "lrndesign-contentblock",
    properties: { title: { type: String } }
  });
});

define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@lrnwebcomponents/oer-schema/oer-schema.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_d27e73d0e70711e88d2ad1797420d7c3() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <oer-schema>\n      <slot></slot>\n    </oer-schema>\n"
    ]);
    _templateObject_d27e73d0e70711e88d2ad1797420d7c3 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_d27e73d0e70711e88d2ad1797420d7c3()
    ),
    is: "lrn-page"
  });
});

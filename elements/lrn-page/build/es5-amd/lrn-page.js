define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@lrnwebcomponents/oer-schema/oer-schema.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_70002d30e5f811e88ac445b5839b4cfb() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <oer-schema>\n      <slot></slot>\n    </oer-schema>\n"
    ]);
    _templateObject_70002d30e5f811e88ac445b5839b4cfb = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_70002d30e5f811e88ac445b5839b4cfb()
    ),
    is: "lrn-page"
  });
});

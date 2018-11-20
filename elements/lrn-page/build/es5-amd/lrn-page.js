define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@lrnwebcomponents/oer-schema/oer-schema.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_b9be3aa0ecf311e88ebb7d40dc5470d1() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <oer-schema>\n      <slot></slot>\n    </oer-schema>\n"
    ]);
    _templateObject_b9be3aa0ecf311e88ebb7d40dc5470d1 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_b9be3aa0ecf311e88ebb7d40dc5470d1()
    ),
    is: "lrn-page"
  });
});

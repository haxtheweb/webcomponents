define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./lib/lrndesign-mapmenu-item.js",
  "./lib/lrndesign-mapmenu-submenu.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_8bc85ee0ecf411e893fb0b59370b06e7() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n    <style>\n      :host {\n        display: block;\n      }\n      #container {\n        padding: 16px 32px;\n      }\n      :host > ::slotted(lrndesign-mapmenu-submenu + lrndesign-mapmenu-submenu) {\n        margin-top: 16px;\n      }\n    </style>\n    <slot></slot>\n"
    ]);
    _templateObject_8bc85ee0ecf411e893fb0b59370b06e7 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_8bc85ee0ecf411e893fb0b59370b06e7()
    ),
    is: "lrndesign-mapmenu",
    properties: {}
  });
});

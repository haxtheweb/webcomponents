define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./lib/lrndesign-mapmenu-item.js",
  "./lib/lrndesign-mapmenu-submenu.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_87d24860e70811e8a6621dd39fb8f1b1() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n    <style>\n      :host {\n        display: block;\n      }\n      #container {\n        padding: 16px 32px;\n      }\n      :host > ::shadow lrndesign-mapmenu-submenu + lrndesign-mapmenu-submenu {\n        margin-top: 16px;\n      }\n    </style>\n    <slot></slot>\n"
    ]);
    _templateObject_87d24860e70811e8a6621dd39fb8f1b1 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_87d24860e70811e8a6621dd39fb8f1b1()
    ),
    is: "lrndesign-mapmenu",
    properties: {}
  });
});

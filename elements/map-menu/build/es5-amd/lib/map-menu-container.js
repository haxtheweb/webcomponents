define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "./map-menu-item.js",
  "./map-menu-submenu.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_9b86d6a0e70811e8a7a94daf23e940c3() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n    <style>\n      :host {\n        display: block;\n      }\n      #container {\n        padding: 16px 32px;\n      }\n      :host > ::shadow map-menu-submenu + map-menu-submenu {\n        margin-top: 16px;\n      }\n    </style>\n    <slot></slot>\n"
    ]);
    _templateObject_9b86d6a0e70811e8a7a94daf23e940c3 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_9b86d6a0e70811e8a7a94daf23e940c3()
    ),
    is: "map-menu-container",
    properties: {}
  });
});

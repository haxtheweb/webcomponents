define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "./map-menu-item.js",
  "./map-menu-submenu.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_38bda450e5f911e88f58a900e4d6e8ab() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n    <style>\n      :host {\n        display: block;\n      }\n      #container {\n        padding: 16px 32px;\n      }\n      :host > ::shadow map-menu-submenu + map-menu-submenu {\n        margin-top: 16px;\n      }\n    </style>\n    <slot></slot>\n"
    ]);
    _templateObject_38bda450e5f911e88f58a900e4d6e8ab = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_38bda450e5f911e88f58a900e4d6e8ab()
    ),
    is: "map-menu-container",
    properties: {}
  });
});

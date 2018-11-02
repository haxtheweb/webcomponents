define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "./map-menu-item.js",
  "./map-menu-submenu.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_85c35de0deaa11e8b01f1db88d870bd0() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n    <style>\n      :host {\n        display: block;\n      }\n      #container {\n        padding: 1em 2em;\n      }\n      :host > ::shadow map-menu-submenu + map-menu-submenu {\n        margin-top: 1em;\n      }\n    </style>\n    <slot></slot>\n"
    ]);
    _templateObject_85c35de0deaa11e8b01f1db88d870bd0 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_85c35de0deaa11e8b01f1db88d870bd0()
    ),
    is: "map-menu-container",
    properties: {}
  });
});

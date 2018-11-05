define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "./map-menu-item.js",
  "./map-menu-submenu.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_00fdf4d0e11b11e8b51fdde26072d36e() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n    <style>\n      :host {\n        display: block;\n      }\n      #container {\n        padding: 1em 2em;\n      }\n      :host > ::shadow map-menu-submenu + map-menu-submenu {\n        margin-top: 1em;\n      }\n    </style>\n    <slot></slot>\n"
    ]);
    _templateObject_00fdf4d0e11b11e8b51fdde26072d36e = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_00fdf4d0e11b11e8b51fdde26072d36e()
    ),
    is: "map-menu-container",
    properties: {}
  });
});

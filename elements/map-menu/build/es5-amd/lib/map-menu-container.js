define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "./map-menu-item.js",
  "./map-menu-submenu.js"
], function(_polymerLegacy, _mapMenuItem, _mapMenuSubmenu) {
  "use strict";
  function _templateObject_d4435db0f32e11e893d6cd2178d4b032() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n    <style>\n      :host {\n        display: block;\n      }\n      #container {\n        padding: 16px 32px;\n      }\n      :host > ::slotted(map-menu-submenu + map-menu-submenu) {\n        margin-top: 16px;\n      }\n    </style>\n    <slot></slot>\n"
    ]);
    _templateObject_d4435db0f32e11e893d6cd2178d4b032 = function _templateObject_d4435db0f32e11e893d6cd2178d4b032() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_d4435db0f32e11e893d6cd2178d4b032()
    ),
    is: "map-menu-container",
    properties: {}
  });
});

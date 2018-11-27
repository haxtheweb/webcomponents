define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "./map-menu-item.js",
  "./map-menu-submenu.js"
], function(_polymerLegacy, _mapMenuItem, _mapMenuSubmenu) {
  "use strict";
  function _templateObject_82f70900f1e611e894ed01deebeec496() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n    <style>\n      :host {\n        display: block;\n      }\n      #container {\n        padding: 16px 32px;\n      }\n      :host > ::slotted(map-menu-submenu + map-menu-submenu) {\n        margin-top: 16px;\n      }\n    </style>\n    <slot></slot>\n"
    ]);
    _templateObject_82f70900f1e611e894ed01deebeec496 = function _templateObject_82f70900f1e611e894ed01deebeec496() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_82f70900f1e611e894ed01deebeec496()
    ),
    is: "map-menu-container",
    properties: {}
  });
});

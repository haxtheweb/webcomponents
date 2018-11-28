define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "./map-menu-item.js",
  "./map-menu-header.js",
  "../node_modules/@polymer/iron-collapse/iron-collapse.js",
  "../node_modules/@polymer/paper-button/paper-button.js"
], function(
  _polymerLegacy,
  _mapMenuItem,
  _mapMenuHeader,
  _ironCollapse,
  _paperButton
) {
  "use strict";
  function _templateObject_d57d3d40f32e11e893d6cd2178d4b032() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n      }\n\n      :host([collapsable])>map-menu-header {\n        cursor: pointer;\n        display: block;\n      }\n\n      #container {\n        margin-left: 16px;\n      }\n\n      #container ::slotted(map-menu-item) {\n        margin-top: .4em;\n      }\n    </style>\n    <map-menu-header avatar-label="[[avatarLabel]]" id="[[id]]" title="[[title]]" label="[[label]]" opened="[[opened]]" url="[[url]]" icon="[[icon]]"></map-menu-header>\n    <iron-collapse id="container">\n      <slot></slot>\n    </iron-collapse>\n'
    ]);
    _templateObject_d57d3d40f32e11e893d6cd2178d4b032 = function _templateObject_d57d3d40f32e11e893d6cd2178d4b032() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_d57d3d40f32e11e893d6cd2178d4b032()
    ),
    is: "map-menu-submenu",
    properties: {
      id: { type: String },
      title: { type: String },
      avatarLabel: { type: String },
      label: { type: String },
      icon: { type: String },
      opened: { type: Boolean, value: !1 },
      collapsable: { type: Boolean, value: !0 },
      expandChildren: { type: Boolean, value: !1 }
    },
    observers: ["_openChanged(opened)"],
    listeners: {
      "child-deactivated": "__childDeactivated",
      "child-activated": "__childActivated",
      "active-item": "__activeChanged",
      "toggle-header": "__toggleHeader",
      "link-clicked": "_headerClickHandler"
    },
    _openChanged: function _openChanged(opened) {
      var target = this.$.container;
      if (opened) target.show();
      if (!opened) target.hide();
    },
    _headerClickHandler: function _headerClickHandler(e) {
      if (!this.opened) {
        this.opened = !this.opened;
      }
    },
    __toggleHeader: function __toggleHeader(e) {
      e.stopPropagation();
      this.opened = !this.opened;
      this.fire("toggle-updated");
    },
    __activeChanged: function __activeChanged(e) {
      this.opened = !0;
    }
  });
});

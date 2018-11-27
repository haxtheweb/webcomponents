define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "./map-menu-submenu.js",
  "./map-menu-item.js"
], function(_polymerLegacy, _mapMenuSubmenu, _mapMenuItem) {
  "use strict";
  function _templateObject_82fab280f1e611e894ed01deebeec496() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n\n    <template id="domRepeat" is="dom-repeat" items="[[items]]" as="item">\n      <template is="dom-if" if="[[__hasChildren(item)]]">\n        <map-menu-submenu title="[[item.title]]" id="[[item.id]]" url="[[item.url]]" icon="[[item.metadata.icon]]" open="[[item.active]]" avatar-label="[[item.avatarLabel]]">\n          <map-menu-builder items="[[item.children]]"></map-menu-builder>\n        </map-menu-submenu>\n      </template>\n      <template is="dom-if" if="[[!__hasChildren(item)]]">\n        <map-menu-item title="[[item.title]]" id="[[item.id]]" url="[[item.url]]" icon="[[item.metadata.icon]]" active-path="[[activePath]]"></map-menu-item>\n      </template>\n    </template>\n'
    ]);
    _templateObject_82fab280f1e611e894ed01deebeec496 = function _templateObject_82fab280f1e611e894ed01deebeec496() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_82fab280f1e611e894ed01deebeec496()
    ),
    is: "map-menu-builder",
    properties: { items: { type: Array, value: [] } },
    __hasChildren: function __hasChildren(item) {
      return 0 < item.children.length;
    },
    _hasActiveChildren: function _hasActiveChildren() {}
  });
});

define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "./map-menu-submenu.js",
  "./map-menu-item.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_b436c0c0dbb911e8ba10c586c462b2d7() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n\n    <template id="domRepeat" is="dom-repeat" items="[[items]]" as="item">\n      <template is="dom-if" if="[[__hasChildren(item)]]">\n        <map-menu-submenu title="[[item.title]]" id="[[item.id]]" url="[[item.url]]" icon="[[item.metadata.icon]]" open="[[item.active]]" avatar-label="[[item.avatarLabel]]">\n          <map-menu-builder items="[[item.children]]"></map-menu-builder>\n        </map-menu-submenu>\n      </template>\n      <template is="dom-if" if="[[!__hasChildren(item)]]">\n        <map-menu-item title="[[item.title]]" id="[[item.id]]" url="[[item.url]]" icon="[[item.metadata.icon]]" active-path="[[activePath]]"></map-menu-item>\n      </template>\n    </template>\n'
    ]);
    _templateObject_b436c0c0dbb911e8ba10c586c462b2d7 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_b436c0c0dbb911e8ba10c586c462b2d7()
    ),
    is: "map-menu-builder",
    properties: { items: { type: Array, value: [] } },
    __hasChildren: function __hasChildren(item) {
      return 0 < item.children.length;
    },
    _hasActiveChildren: function _hasActiveChildren() {}
  });
});

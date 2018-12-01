define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/paper-item/paper-item.js",
  "./hax-context-item-menu.js",
  "./hax-context-item.js"
], function(_polymerLegacy, _paperItem, _haxContextItemMenu, _haxContextItem) {
  "use strict";
  function _templateObject_e69c2df0f51a11e8a8e7334679f4d101() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n        width: 32px;\n      }\n      :host(:hover) {\n        opacity: 1;\n      }\n      hax-context-item {\n        display: block;\n        margin: 6px 0;\n        width: 32px;\n      }\n      .area {\n        width: 32px;\n        float: left;\n        opacity: .5;\n        visibility: visible;\n        transition: .8s all ease;\n      }\n      .area:hover {\n        opacity: 1;\n      }\n    </style>\n    <div class="area">\n      <hax-context-item light="" mini="" icon="arrow-upward" label="Move up" event-name="grid-plate-up" direction="left"></hax-context-item>\n      <hax-context-item light="" mini="" icon="arrow-downward" label="Move down" event-name="grid-plate-down" direction="left"></hax-context-item>\n    </div>\n'
    ]);
    _templateObject_e69c2df0f51a11e8a8e7334679f4d101 = function _templateObject_e69c2df0f51a11e8a8e7334679f4d101() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_e69c2df0f51a11e8a8e7334679f4d101()
    ),
    is: "hax-plate-context"
  });
});

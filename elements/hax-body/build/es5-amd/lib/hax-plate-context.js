define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/paper-item/paper-item.js",
  "./hax-context-item-menu.js",
  "./hax-context-item.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_ebdb7160dbb911e89b94f594419eb4d2() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n        width: 32px;\n      }\n      :host:hover {\n        opacity: 1;\n      }\n      hax-context-item {\n        display: block;\n        margin: 6px 0;\n        width: 32px;\n      }\n      .area {\n        width: 32px;\n        float: left;\n        opacity: .5;\n        visibility: visible;\n        transition: .8s all ease;\n      }\n      .area:hover {\n        opacity: 1;\n      }\n    </style>\n    <div class="area">\n      <hax-context-item light="" mini="" icon="arrow-upward" label="Move up" event-name="grid-plate-up" direction="left"></hax-context-item>\n      <hax-context-item light="" mini="" icon="arrow-downward" label="Move down" event-name="grid-plate-down" direction="left"></hax-context-item>\n    </div>\n'
    ]);
    _templateObject_ebdb7160dbb911e89b94f594419eb4d2 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_ebdb7160dbb911e89b94f594419eb4d2()
    ),
    is: "hax-plate-context"
  });
});

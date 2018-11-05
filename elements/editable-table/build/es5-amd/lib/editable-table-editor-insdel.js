define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/paper-button/paper-button.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_2362ffd0e11a11e8b78cd5fdaca14a96() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n    <style>\n      :host {\n        display: block;\n      }\n      :host paper-button {\n        display: block;\n        text-transform: none;\n        text-align: left;\n      }\n    </style>\n    <paper-button><slot></slot></paper-button>\n"
    ]);
    _templateObject_2362ffd0e11a11e8b78cd5fdaca14a96 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_2362ffd0e11a11e8b78cd5fdaca14a96()
    ),
    is: "editable-table-editor-insdel",
    listeners: { tap: "_onTap" },
    properties: {
      action: { type: String, value: null },
      index: { type: Number, value: null, reflectToAttribute: !0 },
      before: { type: Boolean, value: !1, reflectToAttribute: !0 },
      type: { type: String, value: null }
    },
    _onTap: function _onTap() {
      var root = this,
        action = root.action,
        type = root.type,
        before = root.before,
        index = root.index,
        event = action + "-" + type.toLowerCase();
      if ("insert" === action && before && "Row" === type) {
        index--;
      } else if ("insert" === action && !before && "Row" !== type) {
        index++;
      }
      root.fire(event, index);
    }
  });
});

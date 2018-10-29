define(["../node_modules/@polymer/polymer/polymer-legacy.js"], function(
  _polymerLegacy
) {
  "use strict";
  function _templateObject_afa39980dbb811e8b3503b61fde34881() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n    <style>\n      :host {\n        display: none;\n        clear: both;\n      }\n    </style>\n"
    ]);
    _templateObject_afa39980dbb811e8b3503b61fde34881 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_afa39980dbb811e8b3503b61fde34881()
    ),
    is: "responsive-grid-clear",
    properties: {
      xl: { type: Boolean, value: !1 },
      lg: { type: Boolean, value: !1 },
      md: { type: Boolean, value: !1 },
      sm: { type: Boolean, value: !1 },
      xs: { type: Boolean, value: !1 }
    }
  });
});

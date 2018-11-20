define(["../node_modules/@polymer/polymer/polymer-legacy.js"], function(
  _polymerLegacy
) {
  "use strict";
  function _templateObject_5a64be80ecf311e8a604ede808d8717b() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n    <style>\n      :host {\n        display: none;\n        clear: both;\n      }\n    </style>\n"
    ]);
    _templateObject_5a64be80ecf311e8a604ede808d8717b = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_5a64be80ecf311e8a604ede808d8717b()
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

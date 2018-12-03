define(["../node_modules/@polymer/polymer/polymer-legacy.js"], function(
  _polymerLegacy
) {
  "use strict";
  function _templateObject_4df7a6d0f72011e8896bf72847fe39df() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n  <style>\n    :host {\n      display:none;\n    }\n  </style>\n"
    ]);
    _templateObject_4df7a6d0f72011e8896bf72847fe39df = function _templateObject_4df7a6d0f72011e8896bf72847fe39df() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_4df7a6d0f72011e8896bf72847fe39df()
    ),
    is: "hax-stax",
    properties: { data: { type: Object } },
    attached: function attached() {
      if (
        babelHelpers.typeof(this.data) !==
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        this.fire("hax-register-stax", this.data);
      }
    }
  });
});

define(["../node_modules/@polymer/polymer/polymer-legacy.js"], function(
  _polymerLegacy
) {
  "use strict";
  function _templateObject_99a77220f1e611e8b3a2e3a031c18fd0() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n  <style>\n    :host {\n      display:none;\n    }\n  </style>\n"
    ]);
    _templateObject_99a77220f1e611e8b3a2e3a031c18fd0 = function _templateObject_99a77220f1e611e8b3a2e3a031c18fd0() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_99a77220f1e611e8b3a2e3a031c18fd0()
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

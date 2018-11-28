define(["../node_modules/@polymer/polymer/polymer-legacy.js"], function(
  _polymerLegacy
) {
  "use strict";
  function _templateObject_f1ddf2e0f32e11e8a4700dcc21fbc61a() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n  <style>\n    :host {\n      display:none;\n    }\n  </style>\n  "
    ]);
    _templateObject_f1ddf2e0f32e11e8a4700dcc21fbc61a = function _templateObject_f1ddf2e0f32e11e8a4700dcc21fbc61a() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_f1ddf2e0f32e11e8a4700dcc21fbc61a()
    ),
    is: "hax-app",
    properties: { data: { type: Object } },
    attached: function attached() {
      if (
        babelHelpers.typeof(this.data) !==
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        this.fire("hax-register-app", this.data);
      }
    }
  });
});

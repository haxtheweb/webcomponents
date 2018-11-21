define(["../node_modules/@polymer/polymer/polymer-legacy.js"], function(
  _polymerLegacy
) {
  "use strict";
  function _templateObject_71c27a60edbe11e883a5d91bd26efb3f() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n  <style>\n    :host {\n      display:none;\n    }\n  </style>\n  "
    ]);
    _templateObject_71c27a60edbe11e883a5d91bd26efb3f = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_71c27a60edbe11e883a5d91bd26efb3f()
    ),
    is: "hax-app",
    properties: { data: { type: Object } },
    attached: function attached() {
      if (babelHelpers.typeof(this.data) !== "undefined") {
        this.fire("hax-register-app", this.data);
      }
    }
  });
});

define(["../node_modules/@polymer/polymer/polymer-legacy.js"], function(
  _polymerLegacy
) {
  "use strict";
  function _templateObject_9a346870edcb11e88aa8b5030f652492() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n  <style>\n    :host {\n      display:none;\n    }\n  </style>\n  "
    ]);
    _templateObject_9a346870edcb11e88aa8b5030f652492 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_9a346870edcb11e88aa8b5030f652492()
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

define(["./node_modules/@polymer/polymer/polymer-legacy.js"], function(
  _polymerLegacy
) {
  "use strict";
  function _templateObject_1c0ec750dea911e8843d154719cd548c() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <div id="container"> </div>\n'
    ]);
    _templateObject_1c0ec750dea911e8843d154719cd548c = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_1c0ec750dea911e8843d154719cd548c()
    ),
    is: "lrnsys-render-html",
    properties: { html: { type: String } },
    observers: ["_render(html)"],
    _render: function _render(html) {
      this.$.container.innerHTML = html;
    }
  });
});

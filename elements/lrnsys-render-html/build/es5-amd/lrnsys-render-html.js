define(["./node_modules/@polymer/polymer/polymer-legacy.js"], function(
  _polymerLegacy
) {
  "use strict";
  function _templateObject_f7324df0ecf211e88b3b132d8370e802() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <div id="container"></div>\n'
    ]);
    _templateObject_f7324df0ecf211e88b3b132d8370e802 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_f7324df0ecf211e88b3b132d8370e802()
    ),
    is: "lrnsys-render-html",
    properties: { html: { type: String } },
    observers: ["_render(html)"],
    _render: function _render(html) {
      this.$.container.innerHTML = html;
    }
  });
});

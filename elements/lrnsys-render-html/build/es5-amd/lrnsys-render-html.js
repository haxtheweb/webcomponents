define(["./node_modules/@polymer/polymer/polymer-legacy.js"], function(
  _polymerLegacy
) {
  "use strict";
  function _templateObject_88c162a0f1e511e893597986cf2eb988() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <div id="container"></div>\n'
    ]);
    _templateObject_88c162a0f1e511e893597986cf2eb988 = function _templateObject_88c162a0f1e511e893597986cf2eb988() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_88c162a0f1e511e893597986cf2eb988()
    ),
    is: "lrnsys-render-html",
    properties: { html: { type: String } },
    observers: ["_render(html)"],
    _render: function _render(html) {
      this.$.container.innerHTML = html;
    }
  });
});

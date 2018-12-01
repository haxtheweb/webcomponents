define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js"
], function(_polymerLegacy, _simpleColors) {
  "use strict";
  function _templateObject_e9ea4780f51a11e8a8e7334679f4d101() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style is="custom-style">\n      :host {\n        padding: 0;\n        margin: 0;\n        border-radius: 0;\n        box-sizing: content-box;\n      }\n      :host([disabled]) {\n        opacity: 0.5;\n      }\n      :host(:not([disabled]):focus),\n      :host(:not([disabled]):hover) {\n        cursor: pointer;\n      }\n      :host([disabled]:focus),\n      :host([disabled]:hover) {\n        cursor: not-allowed;\n      }\n      :host([selected]) {\n        outline: 1px solid white;\n      }\n      :host([dark][selected]){\n        outline: 1px solid black;\n      }\n      :host(:focus),\n      :host(:hover) {\n        outline: 1px dotted white;\n      }\n      :host([dark]:focus),\n      :host([dark]:hover) {\n        outline: 1px dotted black;\n      }\n    </style>\n'
    ]);
    _templateObject_e9ea4780f51a11e8a8e7334679f4d101 = function _templateObject_e9ea4780f51a11e8a8e7334679f4d101() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_e9ea4780f51a11e8a8e7334679f4d101()
    ),
    is: "simple-colors-picker-swatch",
    properties: {
      disabled: { type: Boolean, value: !1, reflectToAttribute: !0 },
      hex: { type: String, value: null, reflectToAttribute: !0 },
      label: { type: String, value: null, reflectToAttribute: !0 },
      level: { type: Number, value: null, reflectToAttribute: !0 },
      order: { type: Number, value: null, reflectToAttribute: !0 },
      selected: { type: Boolean, value: !1, reflectToAttribute: !0 }
    },
    ready: function ready() {
      var root = this;
      if (5 < root.level) root.setAttribute("dark", "dark");
      root.style.backgroundColor = root.hex;
      root.addEventListener("click", function(e) {
        root.fire("click-swatch", root);
      });
      root.addEventListener("keyup", function(e) {
        if (13 === e.keyCode || 32 === e.keyCode) {
          root.fire("click-swatch", root);
        } else if (37 === e.keyCode) {
          root.fire("previous-swatch", root);
        } else if (39 === e.keyCode) {
          root.fire("next-swatch", root);
        } else if (38 === e.keyCode) {
          root.fire("next-level", root);
        } else if (40 === e.keyCode) {
          root.fire("previous-level", root);
        }
      });
    }
  });
});

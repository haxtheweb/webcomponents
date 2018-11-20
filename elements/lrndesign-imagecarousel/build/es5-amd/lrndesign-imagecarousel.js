define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@lrnwebcomponents/fancy-carousel/fancy-carousel.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_dc6eff30ecf311e8b4e73f7634b8185e() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <fancy-carousel>\n  <img src="https://app-layout-assets.appspot.com/assets/bg1.jpg">\n  <img src="https://app-layout-assets.appspot.com/assets/bg2.jpg">\n  <img src="https://app-layout-assets.appspot.com/assets/bg3.jpg">\n  <img src="https://app-layout-assets.appspot.com/assets/bg4.jpg">\n</fancy-carousel>\n'
    ]);
    _templateObject_dc6eff30ecf311e8b4e73f7634b8185e = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_dc6eff30ecf311e8b4e73f7634b8185e()
    ),
    is: "lrndesign-imagecarousel",
    properties: { title: { type: String, value: "lrndesign-imagecarousel" } }
  });
});

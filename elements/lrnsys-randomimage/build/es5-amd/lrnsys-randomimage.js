define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@lrnwebcomponents/random-image/random-image.js",
  "@polymer/paper-button/paper-button.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_5a7877f0dbb811e8ab95f1fee208913e() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <div id="image-list">\n      <random-image images-list$="{{images}}"></random-image>\n  </div>\n  <paper-button raised="" on-click="reload">Reload</paper-button>\n'
      ],
      [
        '\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <div id="image-list">\n      <random-image images-list\\$="{{images}}"></random-image>\n  </div>\n  <paper-button raised="" on-click="reload">Reload</paper-button>\n'
      ]
    );
    _templateObject_5a7877f0dbb811e8ab95f1fee208913e = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_5a7877f0dbb811e8ab95f1fee208913e()
    ),
    is: "lrnsys-randomimage",
    properties: {
      images: {
        type: Object,
        notify: !0,
        value: function value() {
          return [];
        }
      }
    },
    reload: function reload() {
      var root = this;
      root.shadowRoot.querySelector(
        "#image-list"
      ).innerHTML = root.shadowRoot.querySelector("#image-list").innerHTML;
    }
  });
});

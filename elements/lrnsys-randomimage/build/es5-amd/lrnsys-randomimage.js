define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@lrnwebcomponents/random-image/random-image.js",
  "./node_modules/@polymer/paper-button/paper-button.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_ca35dad0e5f711e88f85e54277bd445c() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <div id="list">\n      <random-image images-list$="{{images}}"></random-image>\n  </div>\n  <paper-button raised on-click="reload">Reload</paper-button>\n'
    ]);
    _templateObject_ca35dad0e5f711e88f85e54277bd445c = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_ca35dad0e5f711e88f85e54277bd445c()
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
      this;
      this.$.list.innerHTML = this.$.list.innerHTML;
    }
  });
});

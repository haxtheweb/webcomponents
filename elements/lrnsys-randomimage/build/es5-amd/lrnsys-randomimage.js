define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@lrnwebcomponents/random-image/random-image.js",
  "./node_modules/@polymer/paper-button/paper-button.js"
], function(_exports, _polymerLegacy, _randomImage, _paperButton) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrnsysRandomimage = void 0;
  function _templateObject_921e3050f32d11e892d013b1f6c3ded7() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <div id="list">\n      <random-image images-list$="{{images}}"></random-image>\n  </div>\n  <paper-button raised on-click="reload">Reload</paper-button>\n'
    ]);
    _templateObject_921e3050f32d11e892d013b1f6c3ded7 = function _templateObject_921e3050f32d11e892d013b1f6c3ded7() {
      return data;
    };
    return data;
  }
  var LrnsysRandomimage = (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_921e3050f32d11e892d013b1f6c3ded7()
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
    reload: function reload(e) {
      var root = this;
      this.$.list.innerHTML = this.$.list.innerHTML;
    }
  });
  _exports.LrnsysRandomimage = LrnsysRandomimage;
});

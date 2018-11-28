define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-legacy.js"
], function(_exports, _polymerLegacy) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrnContent = void 0;
  function _templateObject_180d1020f32c11e8b57bdbab513962c1() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <div typeof="oer:SupportingMaterial">\n      <h2 property="oer:name" hidden$="[[!title]]">[[title]]</h2>\n      <div property="oer:description">\n        <slot></slot>\n      </div>\n    </div>\n'
    ]);
    _templateObject_180d1020f32c11e8b57bdbab513962c1 = function _templateObject_180d1020f32c11e8b57bdbab513962c1() {
      return data;
    };
    return data;
  }
  var LrnContent = (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_180d1020f32c11e8b57bdbab513962c1()
    ),
    is: "lrn-content",
    properties: { title: { type: String, value: !1 } }
  });
  _exports.LrnContent = LrnContent;
});

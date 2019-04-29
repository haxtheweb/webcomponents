define(["exports","./node_modules/@polymer/polymer/polymer-legacy.js"],function(_exports,_polymerLegacy){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.LrnContent=void 0;function _templateObject_d43756c06a8211e99ad14753bc39b3b1(){var data=babelHelpers.taggedTemplateLiteral(["\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <div typeof=\"oer:SupportingMaterial\">\n      <h2 property=\"oer:name\" hidden$=\"[[!title]]\">[[title]]</h2>\n      <div property=\"oer:description\"><slot></slot></div>\n    </div>\n  "]);_templateObject_d43756c06a8211e99ad14753bc39b3b1=function _templateObject_d43756c06a8211e99ad14753bc39b3b1(){return data};return data}/**
`lrn-content`
  A LRN element for presenting content with a simple heading.
  This is to improve accessibility, consistency, and tag things
  with OER schema.

* @demo demo/index.html
*/var LrnContent=(0,_polymerLegacy.Polymer)({_template:(0,_polymerLegacy.html)(_templateObject_d43756c06a8211e99ad14753bc39b3b1()),is:"lrn-content",properties:{title:{type:String,value:!1}}});_exports.LrnContent=LrnContent});
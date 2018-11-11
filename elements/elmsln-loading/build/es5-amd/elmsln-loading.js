define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@lrnwebcomponents/lrn-icons/lrn-icons.js",
  "./node_modules/@polymer/iron-icon/iron-icon.js",
  "./node_modules/@lrnwebcomponents/materializecss-styles/lib/colors.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_5e2de8f0e5f711e8acd8cbf69ad260ee() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style is="custom-style" include="materializecss-styles-colors">\n      @-moz-keyframes spin { 100% { -moz-transform: rotate(60deg); filter:saturate(10) invert(.9);} }\n      @-webkit-keyframes spin { 100% { -webkit-transform: rotate(60deg); filter:saturate(10) invert(.9);} }\n      @keyframes spin { 100% { -webkit-transform: rotate(60deg); transform:rotate(60deg);} }\n      :host {\n        display: block;\n        -webkit-animation:spin 1.25s ease-out infinite;\n        -moz-animation:spin 1.25s ease-out infinite;\n        animation:spin 1.25s ease-out infinite;\n      }\n      :host([size="tiny"]) {\n        width: 16px;\n        height: 16px;\n        -webkit-animation:spin .75s ease-out infinite;\n        -moz-animation:spin .75s ease-out infinite;\n        animation:spin .75s ease-out infinite;\n      }\n      :host([size="small"]) {\n        width: 32px;\n        height: 32px;\n        -webkit-animation:spin 1s ease-out infinite;\n        -moz-animation:spin 1s ease-out infinite;\n        animation:spin 1s ease-out infinite;\n      }\n      :host([size="medium"]) {\n        width: 64px;\n        height: 64px;\n        -webkit-animation:spin 1.25s ease-out infinite;\n        -moz-animation:spin 1.25s ease-out infinite;\n        animation:spin 1.25s ease-out infinite;\n      }\n      :host([size="large"]) {\n        width: 80px;\n        height: 80px;\n        -webkit-animation:spin 1.25s ease-out infinite;\n        -moz-animation:spin 1.25s ease-out infinite;\n        animation:spin 1.25s ease-out infinite;\n      }\n      :host([size="epic"]) {\n        width: 400px;\n        height: 400px;\n        -webkit-animation:spin 2s ease-out infinite;\n        -moz-animation:spin 2s ease-out infinite;\n        animation:spin 2s ease-out infinite;\n      }\n    </style>\n    <iron-icon icon="lrn:network" class$="[[color]]"></iron-icon>\n'
    ]);
    _templateObject_5e2de8f0e5f711e8acd8cbf69ad260ee = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_5e2de8f0e5f711e8acd8cbf69ad260ee()
    ),
    is: "elmsln-loading",
    properties: {
      color: { type: String, reflectToAttribute: !0 },
      size: { type: String, reflectToAttribute: !0, value: "medium" }
    }
  });
});

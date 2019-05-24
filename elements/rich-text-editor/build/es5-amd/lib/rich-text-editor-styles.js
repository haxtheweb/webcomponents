define(["../node_modules/@polymer/polymer/polymer-element.js"], function(
  _polymerElement
) {
  "use strict";
  function _templateObject_a4de47307cbb11e98cbdc9dc12e6ca7b() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n  <style>\n    :host {\n      --rich-text-editor-bg: #fafafa;\n      --rich-text-editor-button-color: #444;\n      --rich-text-editor-border: 1px solid #ddd;\n      --rich-text-editor-button-border: transparent;\n      --rich-text-editor-button-disabled-color: #666;\n      --rich-text-editor-button-disabled-bg: transparent;\n      --rich-text-editor-button-toggled-color: #222;\n      --rich-text-editor-button-toggled-bg: #ddd;\n      --rich-text-editor-button-hover-color: #000;\n      --rich-text-editor-button-hover-bg: #f0f0f0;\n      --rich-text-editor-picker-border: #fafafa;\n      --rich-text-editor-selection-bg: #b3d9ff;\n    }\n    span {\n      background-color: pink;\n    }\n    .rich-text-editor-selection {\n      background-color: var(--rich-text-editor-selection-bg);\n      @apply --rich-text-editor-content-selection;\n    }\n  </style>\n"
    ]);
    _templateObject_a4de47307cbb11e98cbdc9dc12e6ca7b = function _templateObject_a4de47307cbb11e98cbdc9dc12e6ca7b() {
      return data;
    };
    return data;
  }
  var styleElement = document.createElement("dom-module"),
    css = (0, _polymerElement.html)(
      _templateObject_a4de47307cbb11e98cbdc9dc12e6ca7b()
    );
  styleElement.appendChild(css);
  styleElement.register("rich-text-editor-styles");
});

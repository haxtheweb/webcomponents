define(["../../node_modules/@polymer/polymer/polymer-element.js"], function(
  _polymerElement
) {
  "use strict";
  function _templateObject_a5f1b3007cbb11e98cbdc9dc12e6ca7b() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n  <style>\n    :host {\n      --rich-text-editor-button-min-width: 24px;\n      --rich-text-editor-button-height: 24px;\n      --rich-text-editor-button-margin: 3px;\n      --rich-text-editor-button-padding: 0;\n      --simple-picker-option-size: 18px;\n      --simple-picker-color: var(--rich-text-editor-button-color);\n      --simple-picker-background-color: var(--rich-text-editor-bg);\n      --simple-picker-sample-border-color: var(--rich-text-editor-bg);\n      --simple-picker-border-color: var(--rich-text-editor-button-color);\n      --simple-picker-icon-transform: rotate(0deg);\n      --simple-picker-expanded-icon-transform: rotate(0deg);\n      --rich-text-editor-picker-small: {\n      }\n      --simple-picker-option-null: {\n        display: none;\n      }\n      --simple-picker-sample-null-label: {\n        display: none;\n      }\n    }\n    :host([hidden]) {\n      display: none;\n    }\n    :host .offscreen {\n      position: absolute;\n      left: -999999px;\n      top: 0;\n      height: 0;\n      width: 0;\n      overflow: hidden;\n    }\n    :host(rich-text-editor-emoji-picker),\n    :host(rich-text-editor-symbol-picker) {\n      --simple-picker-option: {\n        width: var(--simple-picker-option-size);\n        max-width: var(--simple-picker-option-size);\n      }\n    }\n    :host paper-tooltip {\n      z-index: 99999;\n    }\n    :host .rtebutton {\n      text-transform: unset;\n      transition: all 0.5s;\n      color: var(--rich-text-editor-button-color);\n      border-color: var(--rich-text-editor-button-border);\n      @apply --rich-text-editor-button;\n    }\n    :host([disabled]) .rtebutton {\n      cursor: not-allowed;\n      color: var(--rich-text-editor-button-disabled-color);\n      background-color: var(--rich-text-editor-button-disabled-bg);\n      @apply --rich-text-editor-button-disabled;\n    }\n    :host .rtebutton[toggled] {\n      color: var(--rich-text-editor-button-toggled-color);\n      background-color: var(--rich-text-editor-button-toggled-bg);\n      @apply --rich-text-editor-button-toggled;\n    }\n    :host .rtebutton:focus,\n    :host .rtebutton:hover {\n      color: var(--rich-text-editor-button-hover-color);\n      background-color: var(--rich-text-editor-button-hover-bg);\n    }\n    :host .rtebutton #icon:not([icon]) {\n      display: none;\n    }\n  </style>\n"
    ]);
    _templateObject_a5f1b3007cbb11e98cbdc9dc12e6ca7b = function _templateObject_a5f1b3007cbb11e98cbdc9dc12e6ca7b() {
      return data;
    };
    return data;
  }
  var styleElement = document.createElement("dom-module"),
    css = (0, _polymerElement.html)(
      _templateObject_a5f1b3007cbb11e98cbdc9dc12e6ca7b()
    );
  styleElement.appendChild(css);
  styleElement.register("rich-text-editor-button-styles");
});

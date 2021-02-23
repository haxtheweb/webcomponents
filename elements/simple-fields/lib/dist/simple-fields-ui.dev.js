"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimpleFieldsFieldsetStyles = exports.SimpleFieldsDescriptionStyles = exports.SimpleFieldsButtonStyles = exports.SimpleFieldsTooltipStyles = exports.SimpleFieldsBaseStyles = void 0;

var _litElement = require("lit-element/lit-element.js");

function _templateObject5() {
  var data = _taggedTemplateLiteral([
    '\n    fieldset {\n      padding: var(--simple-fields-margin-small, 8px)\n        var(--simple-fields-margin, 16px);\n      margin: var(--simple-fields-margin-small, 8px) 0\n        var(--simple-fields-margin, 16px);\n      border: 1px solid var(--simple-fields-border-color-light, #ccc);\n      border-radius: var(--simple-fields-border-radius, 2px);\n      transition: all 0.3s ease-in-out;\n    }\n    :host(:last-of-type) {\n      margin-bottom: 0;\n    }\n    *[part="legend"] {\n      font-family: var(--simple-fields-font-family, sans-serif);\n      font-size: var(--simple-fields-font-size, 16px);\n      line-height: var(--simple-fields-line-height, 22px);\n    }\n    :host([error]) *[part="legend"] {\n      color: var(--simple-fields-error-color, #dd2c00);\n      transition: all 0.3s ease-in-out;\n    }\n  ',
  ]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral([
    "\n    *[part=field-desc],\n    *[part=error-desc],\n    *[part=error-meta]  {\n      color: var(--simple-fields-meta-color);\n      font-size: var(--simple-fields-meta-font-size, 10px);\n      line-height: var(--simple-fields-meta-line-height, 110%);\n    }\n  ",
  ]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    "\n    button, \n    simple-toolbar-button::part(button) {\n      color: var(---simple-fields-button-color, var(---simple-fields-color));\n      background-color: var(--simple-fields-button-background-color, var(---simple-fields-background-color));\n      border-color: var(--simple-fields-button-border-color, var(--simple-fields-border-color, #999));\n      opacity: var(--simple-fields-button-focus-opacity, unset);\n      font-family: var(--simple-fields-detail-font-family);\n      font-size: var(--simple-fields-detail-font-size);\n      line-height: var(--simple-fields-detail-line-height);\n      text-transform: var(--simple-fields-button-text-transform, unset);\n      border-width: 1px;\n      border-radius: var(--simple-fields-border-radius, 2px);\n      padding: var(--simple-fields-button-padding-sm, 1px) var(--simple-fields-button-padding, 2px);\n    }\n    button[aria-pressed=true],\n    simple-toolbar-button[toggled]::part(button) {\n      color: var(---simple-fields-button-toggled-color, unset);\n      background-color: var(--simple-fields-button-toggled-background-color, unset);\n      border-color: var(--simple-fields-button-toggled-border-color, var(--simple-fields-color, currentColor));\n      opacity: var(--simple-fields-button-toggled-opacity, unset);\n\n    }\n    button:focus,\n    button:hover,\n    simple-toolbar-button:focus-within::part(button),\n    simple-toolbar-button:hover::part(button) {\n      color: var(---simple-fields-button-focus-color, unset);\n      background-color: var(--simple-fields-button-focus-background-color, unset);\n      border-color: var(--simple-fields-button-focus-border-color, var(--simple-fields-accent-color, #3f51b5));\n      opacity: var(--simple-fields-button-focus-opacity, unset);\n    }\n    button:disabled,\n    simple-toolbar-button[disabled] {\n      color: var(---simple-fields-button-disabled-color, unset);\n      background-color: var(--simple-fields-button-disabled-background-color, unset);\n      border-color: var(--simple-fields-button-disabled-border-color, unset);\n      opacity: var(--simple-fields-button-disabled-opacity, var(--simple-fields-disabled-opacity, 0.7));\n    }\n  ",
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    "\n    simple-tooltip,\n    simple-toolbar-button::part(tooltip) {\n      font-family: var(--simple-fields-detail-font-family, sans-serif);\n      font-size: var(--simple-fields-tooltip-font-size, var(--simple-fields-detail-font-size, 12px));\n      line-height: var(--simple-fields-tooltip-line-height, var(--simple-fields-detail-line-height, 22px));\n      border-radius: var(--simple-fields-border-radius, var(--simple-fields-tooltip-border-radius, 2px));\n    }\n  ",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '\n    :host {\n      visibility: visible;\n      box-sizing: border-box;\n      display: block;\n      margin: 0 0\n        var(--simple-fields-margin, 16px);\n      padding: 0;\n      font-size: var(--simple-fields-font-size);\n      font-family: var(--simple-fields-font-family, sans-serif);\n      line-height: var(--simple-fields-line-height);\n      font-size: var(--simple-fields-detail-font-size, 12px);\n      font-family: var(--simple-fields-detail-font-family, sans-serif);\n      line-height: var(--simple-fields-detail-line-height, 130%);\n      background-color: var(--simple-fields-background-color, transparent);\n      color: var(--simple-fields-color, currentColor);\n      margin: 0 0\n        var(--simple-fields-field-margin, var(--simple-fields-margin, 16px));\n    }\n    :host([hidden]),\n    :host [hidden],\n    :host([type="hidden"]) {\n      display: none!important;\n    }\n  ',
  ]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }
  return Object.freeze(
    Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })
  );
}

var SimpleFieldsBaseStyles = [(0, _litElement.css)(_templateObject())];
exports.SimpleFieldsBaseStyles = SimpleFieldsBaseStyles;
var SimpleFieldsTooltipStyles = [(0, _litElement.css)(_templateObject2())];
exports.SimpleFieldsTooltipStyles = SimpleFieldsTooltipStyles;
var SimpleFieldsButtonStyles = [].concat(SimpleFieldsTooltipStyles, [
  (0, _litElement.css)(_templateObject3()),
]);
exports.SimpleFieldsButtonStyles = SimpleFieldsButtonStyles;
var SimpleFieldsDescriptionStyles = [(0, _litElement.css)(_templateObject4())];
exports.SimpleFieldsDescriptionStyles = SimpleFieldsDescriptionStyles;
var SimpleFieldsFieldsetStyles = [(0, _litElement.css)(_templateObject5())];
exports.SimpleFieldsFieldsetStyles = SimpleFieldsFieldsetStyles;

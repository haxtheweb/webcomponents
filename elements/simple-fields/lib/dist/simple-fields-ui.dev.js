"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimpleFieldsFieldsetStyles = exports.SimpleFieldsDescriptionStyles = exports.SimpleFieldsButtonStyles = exports.SimpleFieldsTooltipStyles = exports.SimpleFieldsLabelStyles = exports.SimpleFieldsBaseStyles = void 0;

var _litElement = require("lit");

function _templateObject6() {
  var data = _taggedTemplateLiteral([
    '\n    fieldset {\n      padding: var(--simple-fields-margin-small, 8px)\n        var(--simple-fields-margin, 16px);\n      margin: var(--simple-fields-margin-small, 8px) 0\n        var(--simple-fields-margin, 16px);\n      border-width: 1px;\n      border-style: solid;\n      border-color: var(\n        --simple-fields-fieldset-border-color,\n        var(--simple-fields-border-color-light, #ccc)\n      );\n      border-radius: var(--simple-fields-border-radius, 2px);\n      transition: all 0.3s ease-in-out;\n      max-width: calc(100% - 2 * var(--simple-fields-margin, 16px) - 2px);\n    }\n    :host(:last-of-type) {\n      margin-bottom: 0;\n    }\n    *[part="legend"] {\n      font-family: var(--simple-fields-font-family, sans-serif);\n      font-size: var(\n        --simple-fields-legend-font-size,\n        var(--simple-fields-font-size, 16px)\n      );\n      line-height: var(--simple-fields-line-height, 22px);\n      text-transform: var(--simple-fields-legend-text-transform, unset);\n    }\n    :host([error]) *[part="legend"] {\n      color: var(--simple-fields-error-color, #b40000);\n      transition: all 0.3s ease-in-out;\n    }\n  ',
  ]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral([
    '\n    *[part="field-desc"],\n    *[part="error-desc"],\n    *[part="error-meta"] {\n      color: var(--simple-fields-meta-color);\n      font-size: var(--simple-fields-meta-font-size, 10px);\n      line-height: var(--simple-fields-meta-line-height, 110%);\n      opacity: var(--simple-fields-meta-opacity, unset);\n      text-transform: none;\n    }\n    :host:hover *[part="field-desc"],\n    :host:hover-within *[part="error-desc"],\n    :host:hover-within *[part="error-meta"],\n    :host:hover *[part="field-desc"],\n    :host:hover *[part="error-desc"],\n    :host:hover *[part="error-meta"] {\n      color: var(--simple-fields-focus-meta-color);\n      opacity: var(--simple-fields-focus-meta-opacity, unset);\n    }\n  ',
  ]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral([
    '\n    button,\n    button[aria-selected],\n    simple-toolbar-button::part(button),\n    simple-toolbar-menu::part(button) {\n      color: var(--simple-fields-button-color, var(--simple-fields-color));\n      background-color: var(\n        --simple-fields-button-background-color,\n        var(--simple-fields-background-color)\n      );\n      border-width: 1px;\n      border-style: solid;\n      border-color: var(\n        --simple-fields-button-border-color,\n        var(--simple-fields-border-color, #999)\n      );\n      opacity: var(--simple-fields-button-focus-opacity, 1);\n      font-family: var(\n        --simple-fields-button-font-family,\n        var(--simple-fields-font-family, sans-serif)\n      );\n      font-size: var(--simple-fields-button-font-size, 14px);\n      line-height: var(--simple-fields-button-line-height 22px);\n      text-transform: var(--simple-fields-button-text-transform, unset);\n      border-radius: var(--simple-fields-border-radius, 2px);\n      padding: var(--simple-fields-button-padding-sm, 1px)\n        var(--simple-fields-button-padding, 2px);\n      min-height: calc(\n        24px + 2 * var(--simple-fields-button-padding-sm, 2px) + 2px\n      );\n    }\n    simple-toolbar-menu-item > simple-toolbar-button::part(button) {\n      border-color: transparent;\n      border-radius: 0 !important;\n    }\n    simple-toolbar-button.danger::part(button),\n    simple-toolbar-menu.danger::part(button) {\n      background-color: var(\n        --simple-fields-button-danger-color,\n        var(--simple-fields-error-color, #b40000)\n      );\n      color: var(--simple-fields-button-danger-background-color, white);\n    }\n    button[aria-pressed="true"],\n    button[aria-selected="true"],\n    simple-toolbar-button[toggled]::part(button) {\n      color: var(\n        --simple-fields-button-toggled-color,\n        var(--simple-fields-accent-color, #3f51b5)\n      );\n      background-color: var(\n        --simple-fields-button-toggled-background-color,\n        unset\n      );\n      border-color: var(\n        --simple-fields-button-toggled-border-color,\n        var(--simple-fields-color, currentColor)\n      );\n      opacity: var(--simple-fields-button-toggled-opacity, 1);\n    }\n    simple-toolbar-menu-item\n      > simple-toolbar-button.danger:hover::part(button[aria-pressed="true"]),\n    simple-toolbar-menu-item\n      > simple-toolbar-button.danger:focus-within::part(button[aria-pressed="true"]) {\n      background-color: var(\n        --simple-fields-button-danger-color,\n        var(--simple-fields-error-color, #b40000)\n      );\n      color: var(--simple-fields-button-danger-background-color, white);\n      border-color: var(--simple-fields-button-danger-focus-color, #8a0000);\n    }\n    button:focus,\n    button:hover,\n    button[aria-selected="false"]:not([disabled]):focus,\n    button[aria-selected="false"]:not([disabled]):hover,\n    simple-toolbar-button:focus-within::part(button),\n    simple-toolbar-button:hover::part(button),\n    simple-toolbar-menu:focus-within::part(button),\n    simple-toolbar-menu:hover::part(button),\n    simple-toolbar-menu-item > simple-toolbar-button:hover::part(button),\n    simple-toolbar-menu-item\n      > simple-toolbar-button:focus-within::part(button) {\n      color: var(--simple-fields-button-focus-color, unset);\n      background-color: var(\n        --simple-fields-button-focus-background-color,\n        var(--simple-fields-accent-color-light, #d9eaff)\n      );\n      border-color: var(\n        --simple-fields-button-focus-border-color,\n        var(--simple-fields-accent-color, #3f51b5)\n      );\n      opacity: var(--simple-fields-button-focus-opacity, 1);\n      text-decoration: var(--simple-fields-button-focus-text-decoration, unset);\n    }\n    simple-toolbar-menu.danger:focus-within::part(button),\n    simple-toolbar-menu.danger:hover::part(button),\n    simple-toolbar-menu-item > simple-toolbar-button.danger:hover::part(button),\n    simple-toolbar-menu-item\n      > simple-toolbar-button.danger:focus-within::part(button) {\n      background-color: var(--simple-fields-button-danger-focus-color, #8a0000);\n      color: var(--simple-fields-button-danger-background-color, white);\n      border-color: var(--simple-fields-button-danger-focus-color, #8a0000);\n    }\n    button:disabled,\n    button[disabled],\n    simple-toolbar-button[disabled],\n    simple-toolbar-menu[disabled] {\n      color: var(--simple-fields-button-disabled-color, unset);\n      background-color: var(\n        --simple-fields-button-disabled-background-color,\n        unset\n      );\n      border-color: var(--simple-fields-button-disabled-border-color, unset);\n      opacity: var(\n        --simple-fields-button-disabled-opacity,\n        var(--simple-fields-disabled-opacity, 0.7)\n      );\n    }\n  ',
  ]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    "\n    simple-tooltip,\n    simple-toolbar-button::part(tooltip) {\n      text-transform: var(--simple-fields-tooltip-text-transform, unset);\n      font-family: var(\n        --simple-fields-detail-font-family,\n        var(--simple-fields-font-family, sans-serif)\n      );\n      font-size: var(\n        --simple-fields-tooltip-font-size,\n        var(--simple-fields-detail-font-size, 12px)\n      );\n      line-height: var(\n        --simple-fields-tooltip-line-height,\n        var(--simple-fields-detail-line-height, 22px)\n      );\n      border-radius: var(\n        --simple-fields-border-radius,\n        var(--simple-fields-tooltip-border-radius, 2px)\n      );\n    }\n  ",
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n    :host .label-main:after {\n      content: var(--simple-fields-label-flag, "");\n    }\n    :host([focused]) .label-main,\n    :host(:focus-within) .label-main {\n      color: var(--simple-fields-accent-color, #3f51b5);\n      transition: color 0.3s ease-in-out;\n    }\n    .inline {\n      --simple-fields-radio-option-display: flex;\n      --simple-fields-radio-option-flex-wrap: wrap;\n    }\n    label {\n      margin: 0 0 0 0;\n    }\n    .inline label {\n      margin: 0 var(--simple-fields-margin-small, 8px) 0 0;\n      flex: 0 1 var(--simple-fields-label-width, auto);\n    }\n    .inline label,\n    .field-main > div,\n    .field,\n    ::slotted([slot="field"]) {\n      font-size: var(--simple-fields-font-size, 16px);\n      font-family: var(--simple-fields-font-family, sans-serif);\n      line-height: var(--simple-fields-line-height, 22px);\n    }\n  ',
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '\n    :host {\n      visibility: visible;\n      box-sizing: border-box;\n      display: block;\n      margin: 0 0 var(--simple-fields-margin, 16px);\n      padding: 0;\n      font-size: var(--simple-fields-font-size);\n      font-family: var(--simple-fields-font-family, sans-serif);\n      line-height: var(--simple-fields-line-height);\n      font-size: var(--simple-fields-detail-font-size, 12px);\n      font-family: var(--simple-fields-detail-font-family, sans-serif);\n      line-height: var(--simple-fields-detail-line-height, 130%);\n      background-color: var(--simple-fields-background-color, white);\n      color: var(--simple-fields-color, currentColor);\n      margin: 0 0\n        var(--simple-fields-field-margin, var(--simple-fields-margin, 16px));\n    }\n    :host([hidden]),\n    :host [hidden],\n    :host([type="hidden"]) {\n      display: none !important;\n    }\n  ',
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
var SimpleFieldsLabelStyles = [(0, _litElement.css)(_templateObject2())];
exports.SimpleFieldsLabelStyles = SimpleFieldsLabelStyles;
var SimpleFieldsTooltipStyles = [(0, _litElement.css)(_templateObject3())];
exports.SimpleFieldsTooltipStyles = SimpleFieldsTooltipStyles;
var SimpleFieldsButtonStyles = [].concat(SimpleFieldsTooltipStyles, [
  (0, _litElement.css)(_templateObject4()),
]);
exports.SimpleFieldsButtonStyles = SimpleFieldsButtonStyles;
var SimpleFieldsDescriptionStyles = [(0, _litElement.css)(_templateObject5())];
exports.SimpleFieldsDescriptionStyles = SimpleFieldsDescriptionStyles;
var SimpleFieldsFieldsetStyles = [(0, _litElement.css)(_templateObject6())];
exports.SimpleFieldsFieldsetStyles = SimpleFieldsFieldsetStyles;

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HaxUiStyles = exports.HaxTraySimpleModal = exports.HaxTrayBaseStyles = exports.HaxTrayDetailHeadings = exports.HaxTrayDetail = exports.HaxTraySimpleTooltip = exports.HaxTraySimpleFields = exports.HaxTrayUploadField = exports.HaxTrayHexagon = exports.HaxTrayButtonTheme = exports.HaxTrayColors = exports.HaxTraySpacing = exports.HaxTrayText = void 0;

var _litElement = require("lit-element/lit-element.js");

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === "function" &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? "symbol"
        : typeof obj;
    };
  }
  return _typeof(obj);
}

function _templateObject11() {
  var data = _taggedTemplateLiteral(["<slot></slot>"]);

  _templateObject11 = function _templateObject11() {
    return data;
  };

  return data;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }
  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return self;
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true },
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
  return _setPrototypeOf(o, p);
}

function _templateObject10() {
  var data = _taggedTemplateLiteral([
    "\n    simple-modal-template {\n      --simple-modal-z-index: 100000001;\n      --simple-modal-titlebar-color: var(--hax-tray-color);\n      --simple-modal-titlebar-background: var(--hax-tray-color-accent);\n      --simple-modal-titlebar-padding: var(--hax-tray-spacing-xs);\n      --simple-modal-titlebar-height: calc(\n        20px + 2 * var(--hax-tray-spacing-xs)\n      );\n      --simple-modal-content-container-color: var(--hax-tray-color);\n      --simple-modal-content-container-background: var(\n        --hax-tray-background-color\n      );\n      --simple-modal-content-padding: var(--hax-tray-spacing-sm) 0px 0px;\n      --simple-modal-buttons-background: var(--hax-tray-background-color);\n    }\n  ",
  ]);

  _templateObject10 = function _templateObject10() {
    return data;
  };

  return data;
}

function _toConsumableArray(arr) {
  return (
    _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread()
  );
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _iterableToArray(iter) {
  if (
    Symbol.iterator in Object(iter) ||
    Object.prototype.toString.call(iter) === "[object Arguments]"
  )
    return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
}

function _templateObject9() {
  var data = _taggedTemplateLiteral([
    "\n    h4 {\n      font-size: var(--hax-tray-detail-title-font-size);\n    }\n    h5 {\n      font-size: var(--hax-tray-detail-topic-font-size);\n    }\n    h6 {\n      font-size: var(--hax-tray-detail-subtopic-font-size);\n    }\n    h4,\n    h5,\n    h6 {\n      color: var(--hax-tray-color-accent);\n      text-transform: var(--hax-tray-detail-heading-text-transform);\n      font-weight: var(--hax-tray-detail-heading-font-weight);\n      margin: var(--hax-tray-spacing-lg) 0 var(--hax-tray-spacing-xs);\n    }\n  ",
  ]);

  _templateObject9 = function _templateObject9() {
    return data;
  };

  return data;
}

function _templateObject8() {
  var data = _taggedTemplateLiteral([
    '\n    #tray-detail {\n      --hax-tray-detail-title-font-size: var(--hax-tray-font-size-xl);\n      --hax-tray-detail-topic-font-size: var(--hax-tray-font-size-lg);\n      --hax-tray-detail-subtopic-font-size: var(--hax-tray-font-size);\n      --hax-tray-detail-heading-text-transform: capitalize;\n      --hax-tray-detail-heading-font-weight: normal;\n    }\n    #tray-detail h4,\n    #tray-detail h5,\n    #tray-detail h6 {\n      text-transform: var(--hax-tray-detail-heading-text-transform);\n      font-weight: var(--hax-tray-detail-heading-font-weight);\n      margin: var(--hax-tray-spacing-lg) 0 var(--hax-tray-spacing-xs);\n      color: var(--hax-tray-color-accent);\n    }\n    #tray-detail h4 {\n      font-size: var(--hax-tray-detail-title-font-size);\n      margin: var(--hax-tray-spacing-sm) 0 var(--hax-tray-spacing-lg);\n    }\n    #tray-detail h5 {\n      font-size: var(--hax-tray-detail-topic-font-size);\n    }\n    #tray-detail h6 {\n      font-size: var(--hax-tray-detail-subtopic-font-size);\n    }\n    #content-add,\n    #tray-detail[selected-detail="content-add"] {\n      --hax-tray-color-accent: var(--simple-colors-default-theme-purple-8);\n      --hax-tray-color-accent-secondary: var(\n        --simple-colors-default-theme-purple-7\n      );\n      --hax-tray-background-color-accent: var(\n        --simple-colors-default-theme-purple-1\n      );\n    }\n    #content-edit,\n    #tray-detail[selected-detail="content-edit"] {\n      --hax-tray-color-accent: var(--simple-colors-default-theme-pink-8);\n      --hax-tray-color-accent-secondary: var(\n        --simple-colors-default-theme-pink-7\n      );\n      --hax-tray-background-color-accent: var(\n        --simple-colors-default-theme-pink-1\n      );\n    }\n    #media-add,\n    #tray-detail[selected-detail="media-add"] {\n      --hax-tray-color-accent: var(--simple-colors-default-theme-indigo-8);\n      --hax-tray-color-accent-secondary: var(\n        --simple-colors-default-theme-indigo-7\n      );\n      --hax-tray-background-color-accent: var(\n        --simple-colors-default-theme-indigo-1\n      );\n    }\n    #content-map,\n    #tray-detail[selected-detail="content-map"] {\n      --hax-tray-color-accent: var(--simple-colors-default-theme-light-blue-8);\n      --hax-tray-color-accent-secondary: var(\n        --simple-colors-default-theme-light-blue-7\n      );\n      --hax-tray-background-color-accent: var(\n        --simple-colors-default-theme-light-blue-1\n      );\n    }\n    #advanced-settings,\n    #tray-detail[selected-detail="advanced-settings"] {\n      --hax-tray-color-accent: var(--simple-colors-default-theme-green-8);\n      --hax-tray-color-accent-secondary: var(\n        --simple-colors-default-theme-green-7\n      );\n      --hax-tray-background-color-accent: var(\n        --simple-colors-default-theme-green-2\n      );\n    }\n    @media (prefers-color-scheme: dark) {\n      #content-add,\n      #tray-detail[selected-detail="content-add"] {\n        --hax-tray-color-accent: var(--simple-colors-default-theme-purple-5);\n        --hax-tray-color-accent-secondary: var(\n          --simple-colors-default-theme-purple-3\n        );\n        --hax-tray-background-color-accent: #000;\n      }\n      #content-edit,\n      #tray-detail[selected-detail="content-edit"] {\n        --hax-tray-color-accent: var(--simple-colors-default-theme-pink-5);\n        --hax-tray-color-accent-secondary: var(\n          --simple-colors-default-theme-pink-3\n        );\n        --hax-tray-background-color-accent: #000;\n      }\n      #media-add,\n      #tray-detail[selected-detail="media-add"] {\n        --hax-tray-color-accent: var(--simple-colors-default-theme-indigo-5);\n        --hax-tray-color-accent-secondary: var(\n          --simple-colors-default-theme-indigo-3\n        );\n        --hax-tray-background-color-accent: #000;\n      }\n      #content-map,\n      #tray-detail[selected-detail="content-map"] {\n        --hax-tray-color-accent: var(\n          --simple-colors-default-theme-light-blue-5\n        );\n        --hax-tray-color-accent-secondary: var(\n          --simple-colors-default-theme-light-blue-3\n        );\n        --hax-tray-background-color-accent: #000;\n      }\n      #advanced-settings,\n      #tray-detail[selected-detail="advanced-settings"] {\n        --hax-tray-color-accent: var(--simple-colors-default-theme-green-5);\n        --hax-tray-color-accent-secondary: var(\n          --simple-colors-default-theme-green-3\n        );\n        --hax-tray-background-color-accent: #000;\n      }\n    }\n  ',
  ]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  var data = _taggedTemplateLiteral([
    "\n    :host {\n      --simple-tooltip-background: var(--hax-tray-color);\n      --simple-tooltip-text-color: var(--hax-tray-background-color);\n      --simple-tooltip-opacity: 1;\n      --simple-tooltip-delay-in: 0;\n      --simple-tooltip-duration-in: 100ms;\n      --simple-tooltip-duration-out: 0;\n      --simple-tooltip-border-radius: 2px;\n      --simple-tooltip-font-size: var(--hax-tray-font-size-sm);\n    }\n  ",
  ]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral([
    "\n    simple-fields,\n    #tray-detail * {\n      --simple-fields-field-margin: calc(2 * var(--hax-tray-font-size));\n      --simple-fields-font-size: var(--hax-tray-font-size);\n      --simple-fields-line-height: 135%;\n      --simple-fields-detail-font-size: var(--hax-tray-font-size-sm);\n      --simple-fields-detail-line-height: 120%;\n      --simple-fields-margin: var(--hax-tray-spacing);\n      --simple-fields-font-family: var(--hax-tray-font-family);\n      --simple-fields-color: var(--hax-tray-text-color);\n      --simple-fields-accent-color: var(--hax-tray-color-accent);\n      --simple-fields-error-color: var(--hax-tray-color-danger-secondary);\n      --simple-fields-secondary-accent-color: var(\n        --hax-tray-color-accent-secondary\n      );\n      --simple-fields-border-color: var(--hax-tray-color-faded);\n      --simple-toolbar-focus-z-index: var(--hax-tray-focus-z-index);\n    }\n    simple-fields *::part(field-desc),\n    hax-tray-upload::part(description),\n    hax-upload-field::part(description) {\n      opacity: 0.7;\n      font-size: var(--hax-tray-font-size-xs);\n      line-height: 120%;\n    }\n    simple-fields *:focus-within::part(field-desc),\n    hax-upload-field:focus-within::part(description),\n    hax-tray-upload:focus-within::part(description) {\n      opacity: 1;\n    }\n    simple-fields-tabs::part(content) {\n      padding: var(--hax-tray-spacing-sm) 0 0;\n      border: none;\n      margin-left: calc(0 - var(--hax-tray-spacing-sm));\n      margin-right: calc(0 - var(--hax-tray-spacing-sm));\n    }\n    simple-fields-tabs::part(tab),\n    simple-fields-tabs::part(tab-active),\n    simple-fields-tabs::part(tab-disabled),\n    hax-preferences-dialog::part(haxlink),\n    hax-tray-upload::part(option-icon),\n    hax-upload-field::part(option-icon),\n    hax-tray-upload::part(option-icon-selected),\n    hax-upload-field::part(option-icon-selected) {\n      border: 1px solid var(--hax-tray-border-color);\n      text-decoration: none;\n      border-radius: 3px;\n      color: var(--hax-tray-color);\n      background-color: var(--hax-tray-background-color);\n      outline: unset;\n    }\n    simple-fields-tabs::part(tab),\n    simple-fields-tabs::part(tab-active),\n    simple-fields-tabs::part(tab-disabled),\n    hax-preferences-dialog::part(haxlink) {\n      text-transform: capitalize;\n      font-size: var(--hax-tray-font-size-sm);\n      padding: var(--hax-tray-spacing-xs);\n      flex: 1 1 auto;\n    }\n    hax-preferences-dialog::part(haxlink) {\n      font-size: var(--hax-tray-font-size-xl);\n      display: block;\n      padding: var(--hax-tray-spacing-lg);\n    }\n    hax-preferences-dialog::part(haxlink):hover,\n    hax-preferences-dialog::part(haxlink):focus,\n    simple-fields-tabs::part(tab):hover,\n    simple-fields-tabs::part(tab):focus,\n    hax-tray-upload::part(option-icon):hover,\n    hax-upload-field::part(option-icon):hover,\n    hax-tray-upload::part(option-icon):focus,\n    hax-upload-field::part(option-icon):focus {\n      color: var(--hax-tray-color);\n      background-color: var(--hax-tray-background-color-accent);\n      border-color: var(--hax-tray-color-accent);\n    }\n    simple-fields-tabs::part(tab-active),\n    hax-tray-upload::part(option-icon-selected),\n    hax-upload-field::part(option-icon-selected) {\n      background-color: var(--hax-tray-background-color);\n      color: var(--hax-tray-color-accent-secondary);\n      border-color: var(--hax-tray-color-accent-secondary);\n    }\n    simple-fields-tabs::part(tab-disabled) {\n      opacity: 0.5;\n      background-color: rgba(127, 127, 127, 0.2);\n    }\n    simple-fields-tabs::part(content) {\n      border: none;\n    }\n    simple-fields-tab {\n      padding: 0;\n    }\n    simple-fields *::part(fieldset),\n    hax-tray-upload::part(fieldset),\n    hax-upload-field::part(fieldset) {\n      border-color: rgba(127, 127, 127, 0.2);\n    }\n    simple-fields *::part(legend),\n    hax-tray-upload::part(legend),\n    hax-upload-field::part(legend),\n    simple-fields *::part(label),\n    hax-tray-upload::part(label),\n    hax-upload-field::part(label)\n    {\n      text-transform: capitalize;\n    }\n    simple-fields *::part(legend),\n    hax-tray-upload::part(legend),\n    hax-upload-field::part(legend) {\n      font-size: var(--hax-tray-font-size-xs);\n    }\n    hax-tray-upload,\n    hax-upload-field {\n      color: var(--hax-tray-text-color);\n    }\n  ",
  ]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral([
    "\n    hexagon-loader {\n      display: none;\n      margin: 0 auto;\n      z-index: 1000;\n      --hexagon-color: var(--hax-tray-color-accent);\n    }\n    hexagon-loader[loading] {\n      display: block;\n      opacity: 0.8;\n    }\n  ",
  ]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral([
    '\n    :host {\n      text-transform: capitalize;\n    }\n    absolute-position-behavior {\n      color: var(--hax-tray-color);\n      background-color: var(--hax-tray-background-color);\n      border: 1px solid var(--hax-tray-border-color);\n    }\n    button[part="button"] {\n      text-transform: capitalize;\n      font-size: var(--hax-tray-font-size-sm);\n      padding: var(--hax-tray-spacing-sm);\n      color: var(--hax-tray-color);\n      background-color: var(--hax-tray-background-color);\n      border: 1px solid var(--hax-tray-border-color);\n    }\n    :host(:hover) button[part="button"],\n    :host(:focus-within) button[part="button"] {\n      color: var(--hax-tray-color);\n      background-color: var(--hax-tray-background-color-accent);\n      border-color: var(--hax-tray-color-accent);\n    }\n    button[part="button"][aria-pressed="true"] {\n      color: var(--hax-tray-color-accent-secondary);\n      border-color: var(--hax-tray-color-accent-secondary);\n    }\n    :host([feature]) button[part="button"],\n    :host([danger]) button[part="button"] {\n      color: var(--hax-tray-background-color-secondary);\n    }\n    :host([feature]) button[part="button"] {\n      background-color: var(--hax-tray-color-accent);\n      border-color: var(--hax-tray-color-accent);\n    }\n    :host([danger]) button[part="button"] {\n      background-color: var(--hax-tray-color-danger);\n      border-color: var(--hax-tray-color-danger);\n    }\n    :host([feature]) button[part="button"][aria-pressed="true"],\n    :host([danger]) button[part="button"][aria-pressed="true"] {\n      color: var(--hax-tray-background-color);\n    }\n    :host([feature]) button[part="button"][aria-pressed="true"] {\n      background-color: var(--hax-tray-color-accent-secondary);\n      border-color: var(--hax-tray-color-accent);\n    }\n    :host([danger]) button[part="button"][aria-pressed="true"] {\n      background-color: var(--hax-tray-color-danger-secondary);\n      border-color: var(--hax-tray-color-danger);\n    }\n    :host([feature]:hover) button[part="button"],\n    :host([feature]:focus-within) button[part="button"],\n    :host([danger]:hover) button[part="button"],\n    :host([danger]:focus-within) button[part="button"] {\n      color: var(--hax-tray-background-color);\n    }\n    :host([feature]:hover) button[part="button"],\n    :host([feature]:focus-within) button[part="button"] {\n      background-color: var(--hax-tray-color-accent-secondary);\n      border-color: var(--hax-tray-color-accent-secondary);\n    }\n    :host([danger]:hover) button[part="button"],\n    :host([danger]:focus-within) button[part="button"] {\n      background-color: var(--hax-tray-color-danger-secondary);\n      border-color: var(--hax-tray-color-danger-secondary);\n    }\n    :host([large]) button[part="button"] {\n      font-size: var(--hax-tray-font-size);\n      padding: var(--hax-tray-spacing);\n      border-width: 2px;\n    }\n    :host([disabled]) button[part="button"][disabled] {\n      opacity: 0.5;\n      background-color: rgba(127, 127, 127, 0.2);\n    }\n\n    ::part(label) {\n      text-transform: capitalize;\n      margin: var(--hax-tray-spacing-sm);\n    }\n  ',
  ]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    "\n    :host {\n      --hax-tray-color: #222;\n      --hax-tray-color-focus: #000;\n      --hax-tray-color-faded: #444;\n\n      --hax-tray-background-color: #fff;\n      --hax-tray-background-color-secondary: #e8e8e8;\n      --hax-tray-background-color-faded: #b0b8bb;\n\n      --hax-tray-color-accent: #009dc7;\n      --hax-tray-color-accent-secondary: #007999;\n      --hax-tray-background-color-accent: #ddf8ff;\n\n      --hax-tray-color-danger: #ee0000;\n      --hax-tray-color-danger-secondary: #850000;\n      --hax-tray-background-color-danger: #ffdddd;\n\n      --hax-tray-border-color: #ddd;\n    }\n    @media (prefers-color-scheme: dark) {\n      :host {\n        --hax-tray-color: #eeeae6;\n        --hax-tray-color-focus: #fff;\n        --hax-tray-color-faded: #c5c3be;\n\n        --hax-tray-background-color: #333;\n        --hax-tray-background-color-secondary: #111;\n        --hax-tray-background-color-faded: #222;\n\n        --hax-tray-color-accent: #77e2ff;\n        --hax-tray-color-accent-secondary: #00c9ff;\n        --hax-tray-background-color-accent: #000;\n\n        --hax-tray-color-danger: #ff8f8f;\n        --hax-tray-color-danger-secondary: #ff2222;\n        --hax-tray-background-color-danger: #000;\n\n        --hax-tray-border-color: #000;\n      }\n    }\n  ",
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    "\n    :host {\n      --hax-tray-width: 300px;\n      --hax-tray-spacing-xs: 4px;\n      --hax-tray-spacing-sm: calc(1 * var(--hax-tray-spacing-xs, 4px));\n      --hax-tray-spacing: calc(2 * var(--hax-tray-spacing-xs, 4px));\n      --hax-tray-spacing-lg: calc(3 * var(--hax-tray-spacing-xs, 4px));\n      --hax-tray-spacing-xl: calc(4 * var(--hax-tray-spacing-xs, 4px));\n      --hax-tray-focus-z-index: 100000001;\n      --simple-toolbar-focus-z-index: var(--hax-tray-focus-z-index);\n      --a11y-menu-button-focus-z-index: var(--hax-tray-focus-z-index);\n    }\n  ",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    "\n    :host {\n      --hax-tray-font-family: sans-serif;\n      --hax-tray-font-size: 16px;\n      --hax-tray-font-size-sm: 13px;\n      --hax-tray-font-size-xs: 12px;\n      --hax-tray-font-size-lg: calc(1.1 * var(--hax-tray-font-size, 16px));\n      --hax-tray-font-size-xl: calc(1.2 * var(--hax-tray-font-size, 16px));\n    }\n  ",
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

var HaxTrayText = [(0, _litElement.css)(_templateObject())];
exports.HaxTrayText = HaxTrayText;
var HaxTraySpacing = [(0, _litElement.css)(_templateObject2())];
exports.HaxTraySpacing = HaxTraySpacing;
var HaxTrayColors = [(0, _litElement.css)(_templateObject3())];
exports.HaxTrayColors = HaxTrayColors;
var HaxTrayButtonTheme = [(0, _litElement.css)(_templateObject4())];
exports.HaxTrayButtonTheme = HaxTrayButtonTheme;
var HaxTrayHexagon = [(0, _litElement.css)(_templateObject5())];
exports.HaxTrayHexagon = HaxTrayHexagon;
var HaxTrayUploadField = [];
exports.HaxTrayUploadField = HaxTrayUploadField;
var HaxTraySimpleFields = [(0, _litElement.css)(_templateObject6())];
exports.HaxTraySimpleFields = HaxTraySimpleFields;
var HaxTraySimpleTooltip = [(0, _litElement.css)(_templateObject7())];
exports.HaxTraySimpleTooltip = HaxTraySimpleTooltip;
var HaxTrayDetail = [(0, _litElement.css)(_templateObject8())];
exports.HaxTrayDetail = HaxTrayDetail;
var HaxTrayDetailHeadings = [(0, _litElement.css)(_templateObject9())];
exports.HaxTrayDetailHeadings = HaxTrayDetailHeadings;
var HaxTrayBaseStyles = [].concat(
  HaxTrayText,
  HaxTraySpacing,
  HaxTraySimpleFields,
  HaxTraySimpleTooltip,
  HaxTrayHexagon,
  HaxTrayColors
);
exports.HaxTrayBaseStyles = HaxTrayBaseStyles;
var HaxTraySimpleModal = [].concat(_toConsumableArray(HaxTrayBaseStyles), [
  (0, _litElement.css)(_templateObject10()),
]);
/**
 * an empty wrapper to ensure modal content has the same base styles
 *
 * @class HaxBaseStylesWrapper
 * @extends {LitElement}
 */

exports.HaxTraySimpleModal = HaxTraySimpleModal;

var HaxUiStyles =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(HaxUiStyles, _LitElement);

    function HaxUiStyles() {
      _classCallCheck(this, HaxUiStyles);

      return _possibleConstructorReturn(
        this,
        _getPrototypeOf(HaxUiStyles).apply(this, arguments)
      );
    }

    _createClass(
      HaxUiStyles,
      [
        {
          key: "render",
          value: function render() {
            return (0, _litElement.html)(_templateObject11());
          },
        },
      ],
      [
        {
          key: "styles",
          get: function get() {
            return HaxTrayBaseStyles;
          },
        },
        {
          key: "tag",
          get: function get() {
            return "hax-ui-styles";
          },
        },
      ]
    );

    return HaxUiStyles;
  })(_litElement.LitElement);

exports.HaxUiStyles = HaxUiStyles;
window.customElements.define(HaxUiStyles.tag, HaxUiStyles);

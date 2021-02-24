"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HaxUiStyles = exports.HaxTrayDetailHeadings = exports.HaxTrayDetail = exports.HaxComponentStyles = exports.HaxTour = exports.HaxModal = exports.HaxFields = exports.HaxButton = exports.HaxHexagon = exports.HaxUiBaseStyles = exports.HaxUiTour = exports.HaxUiFields = exports.HaxUiTooltip = exports.HaxUiColors = exports.HaxUiSpacing = exports.HaxUiText = void 0;

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

function _templateObject13() {
  var data = _taggedTemplateLiteral(["<slot></slot>"]);

  _templateObject13 = function _templateObject13() {
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

function _templateObject12() {
  var data = _taggedTemplateLiteral([
    "\n    h4 {\n      font-size: var(--hax-tray-detail-title-font-size);\n      color: var(--hax-ui-color-accent-secondary);\n    }\n    h5 {\n      font-size: var(--hax-tray-detail-topic-font-size);\n    }\n    h6 {\n      font-size: var(--hax-tray-detail-subtopic-font-size);\n    }\n    h4,\n    h5,\n    h6 {\n      color: var(--hax-ui-color-accent);\n      text-transform: var(--hax-tray-detail-heading-text-transform);\n      font-weight: var(--hax-tray-detail-heading-font-weight);\n      margin: var(--hax-ui-spacing-lg) 0 var(--hax-ui-spacing-xs);\n    }\n  ",
  ]);

  _templateObject12 = function _templateObject12() {
    return data;
  };

  return data;
}

function _templateObject11() {
  var data = _taggedTemplateLiteral([
    "\n    #tray-detail {\n      --hax-tray-detail-title-font-size: var(--hax-ui-font-size-xl);\n      --hax-tray-detail-topic-font-size: var(--hax-ui-font-size-lg);\n      --hax-tray-detail-subtopic-font-size: var(--hax-ui-font-size);\n      --hax-tray-detail-heading-text-transform: capitalize;\n      --hax-tray-detail-heading-font-weight: normal;\n    }\n    #tray-detail h4,\n    #tray-detail h5,\n    #tray-detail h6 {\n      text-transform: var(--hax-tray-detail-heading-text-transform);\n      font-weight: var(--hax-tray-detail-heading-font-weight);\n      margin: var(--hax-ui-spacing-lg) 0 var(--hax-ui-spacing-xs);\n      color: var(--hax-ui-color-accent);\n    }\n    #tray-detail h4 {\n      font-size: var(--hax-tray-detail-title-font-size);\n      margin: var(--hax-ui-spacing-sm) 0 var(--hax-ui-spacing-lg);\n      color: var(--hax-ui-color-accent-secondary);\n    }\n    #tray-detail h5 {\n      font-size: var(--hax-tray-detail-topic-font-size);\n    }\n    #tray-detail h6 {\n      font-size: var(--hax-tray-detail-subtopic-font-size);\n    }\n  ",
  ]);

  _templateObject11 = function _templateObject11() {
    return data;
  };

  return data;
}

function _templateObject10() {
  var data = _taggedTemplateLiteral([
    "\n    simple-modal-template {\n      --simple-modal-z-index: 100000000;\n      --simple-modal-height: 70vh;\n      --simple-modal-width: 70vw;\n      --simple-modal-titlebar-color: var(--hax-ui-background-color);\n      --simple-modal-titlebar-background: var(--hax-ui-color-accent);\n      --simple-modal-titlebar-padding: var(--hax-ui-spacing-xs);\n      --simple-modal-titlebar-height: calc(20px + 2 * var(--hax-ui-spacing-xs));\n      --simple-modal-content-container-color: var(--hax-ui-color);\n      --simple-modal-content-container-background: var(\n        --hax-ui-background-color\n      );\n      --simple-modal-content-padding: var(--hax-ui-spacing-sm) 0px 0px;\n      --simple-modal-buttons-background: var(--hax-ui-background-color);\n    }\n  ",
  ]);

  _templateObject10 = function _templateObject10() {
    return data;
  };

  return data;
}

function _templateObject9() {
  var data = _taggedTemplateLiteral([
    "\n    simple-fields-tabs {\n      padding: var(--hax-ui-spacing-sm) 0 0;\n      border: none;\n      margin-left: calc(0 - var(--hax-ui-spacing-sm));\n      margin-right: calc(0 - var(--hax-ui-spacing-sm));\n    }\n    simple-fields-tabs::part(tab),\n    simple-fields-tabs::part(tab-active),\n    simple-fields-tabs::part(tab-disabled),\n    hax-preferences-dialog::part(haxlink) {\n      border: 1px solid var(--hax-ui-border-color);\n      text-decoration: none;\n      border-radius: 3px;\n      color: var(--hax-ui-color);\n      background-color: var(--hax-ui-background-color);\n      outline: unset;\n      text-transform: capitalize;\n      font-size: var(--hax-ui-font-size-sm);\n      padding: var(--hax-ui-spacing-xs);\n      flex: 1 1 auto;\n    }\n    simple-fields-tabs::part(tab-active) {\n      color: var(--hax-ui-color-accent);\n    }\n    hax-preferences-dialog::part(haxlink) {\n      font-size: var(--hax-ui-font-size-xl);\n      display: block;\n      padding: var(--hax-ui-spacing-lg);\n    }\n    hax-preferences-dialog::part(haxlink):hover,\n    hax-preferences-dialog::part(haxlink):focus {\n      color: var(--hax-ui-color);\n      background-color: var(--hax-ui-background-color-accent);\n      border-color: var(--hax-ui-color-accent);\n    }\n    simple-fields-tabs::part(tab-disabled) {\n      opacity: 0.5;\n      background-color: rgba(127, 127, 127, 0.2);\n    }\n    simple-fields-tabs::part(content) {\n      border: none;\n    }\n    simple-fields-tab {\n      padding: 0;\n    }\n    simple-fields ::part(label) {\n      text-transform: none;\n      margin: 0;\n    }\n  ",
  ]);

  _templateObject9 = function _templateObject9() {
    return data;
  };

  return data;
}

function _templateObject8() {
  var data = _taggedTemplateLiteral([
    '\n    :host {\n      text-transform: capitalize;\n    }\n    :host[aria-expanded="true"] {\n      border: 1px solid var(--hax-ui-border-color);\n    }\n    absolute-position-behavior {\n      border-color: transparent;\n      color: var(--hax-ui-color);\n      background-color: var(--hax-ui-background-color);\n    }\n    :host([expanded]) absolute-position-behavior {\n      border: 1px solid var(--hax-ui-border-color);\n    }\n    button[part="button"] {\n      text-transform: capitalize;\n      font-size: var(--hax-ui-font-size-sm);\n      padding: var(--hax-ui-spacing-sm);\n      color: var(--hax-ui-color);\n      background-color: var(--hax-ui-background-color);\n      border: 1px solid var(--hax-ui-border-color);\n      border-radius: var(--hax-ui-border-radius);\n    }\n    :host([role="menuitem"]) button[part="button"] {\n      padding: 1px;\n      border-color: transparent;\n    }\n    :host(:hover) button[part="button"],\n    :host(:focus-within) button[part="button"] {\n      color: var(--hax-ui-color);\n      background-color: var(--hax-ui-background-color-accent);\n      border-color: var(--hax-ui-color-accent);\n    }\n    button[part="button"][aria-pressed="true"] {\n      color: var(--hax-ui-color-accent);\n      border-color: var(--hax-ui-color-accent);\n    }\n    :host([feature]) button[part="button"],\n    :host([danger]) button[part="button"] {\n      color: var(--hax-ui-background-color-secondary);\n    }\n    :host([feature]) button[part="button"] {\n      background-color: var(--hax-ui-color-accent);\n      border-color: var(--hax-ui-color-accent);\n    }\n    :host([danger]) button[part="button"] {\n      background-color: var(--hax-ui-color-danger);\n      border-color: var(--hax-ui-color-danger);\n    }\n    :host([feature]) button[part="button"][aria-pressed="true"],\n    :host([danger]) button[part="button"][aria-pressed="true"] {\n      color: var(--hax-ui-background-color);\n    }\n    :host([feature]) button[part="button"][aria-pressed="true"] {\n      background-color: var(--hax-ui-color-accent-secondary);\n      border-color: var(--hax-ui-color-accent);\n    }\n    :host([danger]) button[part="button"][aria-pressed="true"] {\n      background-color: var(--hax-ui-color-danger-secondary);\n      border-color: var(--hax-ui-color-danger);\n    }\n    :host([feature]:hover) button[part="button"],\n    :host([feature]:focus-within) button[part="button"],\n    :host([danger]:hover) button[part="button"],\n    :host([danger]:focus-within) button[part="button"] {\n      color: var(--hax-ui-background-color);\n    }\n    :host([feature]:hover) button[part="button"],\n    :host([feature]:focus-within) button[part="button"] {\n      background-color: var(--hax-ui-color-accent-secondary);\n      border-color: var(--hax-ui-color-accent-secondary);\n    }\n    :host([danger]:hover) button[part="button"],\n    :host([danger]:focus-within) button[part="button"] {\n      background-color: var(--hax-ui-color-danger-secondary);\n      border-color: var(--hax-ui-color-danger-secondary);\n    }\n    :host([large]) button[part="button"] {\n      font-size: var(--hax-ui-font-size);\n      padding: var(--hax-ui-spacing);\n      border-width: 2px;\n    }\n    :host([disabled]) button[part="button"][disabled] {\n      opacity: 0.5;\n      border: 1px solid var(--hax-ui-border-color);\n    }\n\n    *[show-text-label]::part(label) {\n      text-transform: capitalize;\n      margin: var(--hax-ui-spacing-sm);\n    }\n  ',
  ]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  var data = _taggedTemplateLiteral([
    "\n    hexagon-loader {\n      display: none;\n      margin: 0 auto;\n      z-index: 1000;\n    }\n    hexagon-loader[loading] {\n      display: block;\n      opacity: 0.8;\n    }\n  ",
  ]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral([""]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral([
    "\n    body {\n      --simple-fields-field-margin: calc(2 * var(--hax-ui-font-size));\n      --simple-toolbar-focus-z-index: var(--hax-ui-focus-z-index);\n      --simple-fields-font-family: var(--hax-ui-font-family);\n      --simple-fields-font-size: var(--hax-ui-font-size);\n      --simple-fields-line-height: 135%;\n      --simple-fields-detail-font-size: var(--hax-ui-font-size-sm);\n      --simple-fields-detail-line-height: 120%;\n      --simple-fields-margin: var(--hax-ui-spacing);\n      --simple-fields-color: var(--hax-tray-text-color);\n      --simple-fields-accent-color: var(--hax-ui-color-accent);\n      --simple-fields-error-color: var(--hax-ui-color-danger-secondary);\n      --simple-fields-secondary-accent-color: var(\n        --hax-ui-color-accent-secondary\n      );\n      --simple-fields-border-color: var(--hax-ui-color-faded);\n\n      --simple-fields-fieldset-border-color: rgba(127, 127, 127, 0.2);\n      --simple-fields-legend-text-transform: capitalize;\n      --simple-fields-legend-font-size: var(--hax-ui-font-size-xs);\n\n      --simple-fields-meta-font-size: var(--hax-ui-font-size-xs);\n      --simple-fields-meta-line-height: 120%;\n      --simple-fields-meta-opacity: 0.7;\n      --simple-fields-focus-meta-opacity: 1;\n\n      --simple-fields-button-color: var(--hax-ui-color);\n      --simple-fields-button-background-color: var(--hax-ui-background-color);\n      --simple-fields-button-border-color: var(--hax-ui-border-color);\n      --simple-fields-button-text-transform: capitalize;\n      --simple-fields-border-radius: var(--hax-ui-border-radius);\n      --simple-fields-button-padding-sm: var(--hax-ui-spacing-sm);\n      --simple-fields-button-padding: var(--hax-ui-spacing-sm);\n\n      --simple-fields-button-toggled-color: var(--hax-ui-color);\n      --simple-fields-button-toggled-background-color: var(\n        --hax-ui-background-color-accent\n      );\n      --simple-fields-button-toggled-border-color: var(--hax-ui-color-accent);\n\n      --simple-fields-button-focus-color: var(--hax-ui-color);\n      --simple-fields-button-focus-background-color: var(\n        --hax-ui-background-color-accent\n      );\n      --simple-fields-button-focus-border-color: var(--hax-ui-color-accent);\n\n      --simple-fields-button-disabled-color: unset;\n      --simple-fields-button-disabled-background-color: unset;\n      --simple-fields-button-disabled-border-color: unset;\n      --simple-fields-button-disabled-opacity: 0.5;\n      --hexagon-color: var(--hax-ui-color-accent);\n    }\n  ",
  ]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral([
    "\n    body {\n      --simple-tooltip-background: var(--hax-ui-color);\n      --simple-tooltip-text-color: var(--hax-ui-background-color);\n      --simple-tooltip-opacity: 1;\n      --simple-tooltip-delay-in: 0;\n      --simple-tooltip-duration-in: 100ms;\n      --simple-tooltip-duration-out: 0;\n      --simple-tooltip-border-radius: 2px;\n      --simple-tooltip-font-size: var(--hax-ui-font-size-sm);\n    }\n  ",
  ]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    '\n    body {\n      --hax-ui-color: #222;\n      --hax-ui-color-focus: #000;\n      --hax-ui-color-faded: #444;\n\n      --hax-ui-background-color: #fff;\n      --hax-ui-background-color-secondary: #e8e8e8;\n      --hax-ui-background-color-faded: #b0b8bb;\n\n      --hax-ui-color-accent: #009dc7;\n      --hax-ui-color-accent-secondary: #007999;\n      --hax-ui-background-color-accent: #ddf8ff;\n\n      --hax-ui-color-danger: #ee0000;\n      --hax-ui-color-danger-secondary: #850000;\n      --hax-ui-background-color-danger: #ffdddd;\n\n      --hax-ui-border-color: #ddd;\n    }\n    body[hax-ui-theme="haxdark"] {\n      --hax-ui-color: #eeeae6;\n      --hax-ui-color-focus: #fff;\n      --hax-ui-color-faded: #c5c3be;\n\n      --hax-ui-background-color: #333;\n      --hax-ui-background-color-secondary: #111;\n      --hax-ui-background-color-faded: #222;\n\n      --hax-ui-color-accent: #77e2ff;\n      --hax-ui-color-accent-secondary: #00c9ff;\n      --hax-ui-background-color-accent: #000;\n\n      --hax-ui-color-danger: #ff8f8f;\n      --hax-ui-color-danger-secondary: #ff2222;\n      --hax-ui-background-color-danger: #000;\n\n      --hax-ui-border-color: #000;\n    }\n\n    @media (prefers-color-scheme: dark) {\n      body[hax-ui-theme="system"] {\n        --hax-ui-color: #eeeae6;\n        --hax-ui-color-focus: #fff;\n        --hax-ui-color-faded: #c5c3be;\n\n        --hax-ui-background-color: #333;\n        --hax-ui-background-color-secondary: #111;\n        --hax-ui-background-color-faded: #222;\n\n        --hax-ui-color-accent: #77e2ff;\n        --hax-ui-color-accent-secondary: #00c9ff;\n        --hax-ui-background-color-accent: #000;\n\n        --hax-ui-color-danger: #ff8f8f;\n        --hax-ui-color-danger-secondary: #ff2222;\n        --hax-ui-background-color-danger: #000;\n\n        --hax-ui-border-color: #000;\n      }\n    }\n  ',
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    "\n    body {\n      --hax-tray-width: 300px;\n      --hax-ui-spacing-xs: 4px;\n      --hax-ui-border-radius: 2px;\n      --hax-ui-spacing-sm: calc(1 * var(--hax-ui-spacing-xs, 4px));\n      --hax-ui-spacing: calc(2 * var(--hax-ui-spacing-xs, 4px));\n      --hax-ui-spacing-lg: calc(3 * var(--hax-ui-spacing-xs, 4px));\n      --hax-ui-spacing-xl: calc(4 * var(--hax-ui-spacing-xs, 4px));\n      --hax-ui-focus-z-index: 1001;\n      --simple-toolbar-focus-z-index: var(--hax-ui-focus-z-index);\n      --a11y-menu-button-focus-z-index: var(--hax-ui-focus-z-index);\n    }\n  ",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    "\n    body {\n      --hax-ui-font-family: sans-serif;\n      --hax-ui-font-size: 16px;\n      --hax-ui-font-size-sm: 13px;\n      --hax-ui-font-size-xs: 12px;\n      --hax-ui-font-size-lg: calc(1.1 * var(--hax-ui-font-size, 16px));\n      --hax-ui-font-size-xl: calc(1.2 * var(--hax-ui-font-size, 16px));\n    }\n  ",
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

var HaxUiText = [(0, _litElement.css)(_templateObject())];
exports.HaxUiText = HaxUiText;
var HaxUiSpacing = [(0, _litElement.css)(_templateObject2())];
exports.HaxUiSpacing = HaxUiSpacing;
var HaxUiColors = [(0, _litElement.css)(_templateObject3())];
exports.HaxUiColors = HaxUiColors;
var HaxUiTooltip = [(0, _litElement.css)(_templateObject4())];
exports.HaxUiTooltip = HaxUiTooltip;
var HaxUiFields = [(0, _litElement.css)(_templateObject5())];
exports.HaxUiFields = HaxUiFields;
var HaxUiTour = [(0, _litElement.css)(_templateObject6())];
/**
 * controls text spacing and colors throughout Hax UI (but not content)
 */

exports.HaxUiTour = HaxUiTour;
var HaxUiBaseStyles = [].concat(
  HaxUiText,
  HaxUiSpacing,
  HaxUiFields,
  HaxUiTooltip,
  HaxUiColors
);
exports.HaxUiBaseStyles = HaxUiBaseStyles;
var HaxHexagon = [(0, _litElement.css)(_templateObject7())];
exports.HaxHexagon = HaxHexagon;
var HaxButton = [(0, _litElement.css)(_templateObject8())];
exports.HaxButton = HaxButton;
var HaxFields = [(0, _litElement.css)(_templateObject9())];
exports.HaxFields = HaxFields;
var HaxModal = [(0, _litElement.css)(_templateObject10())];
exports.HaxModal = HaxModal;
var HaxTour = [];
/**
 * styles that need to be in the shadowRoot of their parent
 */

exports.HaxTour = HaxTour;
var HaxComponentStyles = [].concat(HaxModal, HaxButton, HaxHexagon, HaxFields);
exports.HaxComponentStyles = HaxComponentStyles;
var HaxTrayDetail = [(0, _litElement.css)(_templateObject11())];
exports.HaxTrayDetail = HaxTrayDetail;
var HaxTrayDetailHeadings = [(0, _litElement.css)(_templateObject12())];
/**
 * an empty wrapper to ensure modal content has the same base styles
 *
 * @class HaxBaseStylesWrapper
 * @extends {LitElement}
 */

exports.HaxTrayDetailHeadings = HaxTrayDetailHeadings;

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
            return (0, _litElement.html)(_templateObject13());
          },
        },
      ],
      [
        {
          key: "styles",
          get: function get() {
            return HaxComponentStyles;
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

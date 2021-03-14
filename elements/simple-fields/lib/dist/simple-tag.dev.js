"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimpleTag = void 0;

var _litElement = require("lit-element/lit-element.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js");

var _simpleFieldsUi = require("./simple-fields-ui.js");

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

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    "\n        :host {\n          display: inline-flex;\n          align-items: center;\n          background-color: var(\n            --simple-fields-button-color,\n            var(--simple-fields-color)\n          );\n          color: var(\n            --simple-fields-button-background-color,\n            var(--simple-fields-background-color)\n          );\n          font-size: var(--simple-fields-font-size, 16px);\n          font-family: var(--simple-fields-font-family, sans-serif);\n          line-height: var(--simple-fields-line-height, 22px);\n          border-radius: var(--simple-fields-tag-border-radius, 4px);\n          padding: var(--simple-fields-button-padding, 2px)\n            calc(2 * var(--simple-fields-button-padding, 2px));\n          border-width: 1px;\n          border-style: solid;\n          border-color: var(\n            --simple-fields-fieldset-border-color,\n            var(--simple-fields-border-color-light, #ccc)\n          );\n        }\n        simple-icon-button-lite {\n          cursor: pointer;\n          margin-left: 4px;\n          --simple-icon-height: var(--simple-fields-font-size, 16px);\n          --simple-icon-width: var(--simple-fields-font-size, 16px);\n        }\n        :host([hidden]) {\n          display: none;\n        }\n        :host([disabled]):not([readonly]) {\n          opacity: 0.5;\n        }\n      ",
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n            <simple-icon-button-lite\n              icon="',
    '"\n              label="Remove ',
    '"\n              ?hidden="',
    '"\n              @click="',
    '"\n              ?disabled="',
    '"\n            ></simple-icon-button-lite>\n          ',
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    "\n      <span>",
    "<slot></slot></span>\n      ",
    "\n    ",
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

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
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

/**
 *
 * @customElement
 * @element simple-tag
 * @class SimpleTag
 * @extends {LitElement}
 * @demo ./demo/tags.html Demo
 */
var SimpleTag =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(SimpleTag, _LitElement);

    _createClass(SimpleTag, null, [
      {
        key: "tag",
        get: function get() {
          return "simple-tag";
        },
      },
      {
        key: "properties",
        get: function get() {
          return {
            readonly: {
              type: Boolean,
              reflect: true,
            },
            icon: {
              type: String,
            },
            disabled: {
              type: Boolean,
              reflect: true,
            },
            value: {
              type: String,
            },
            data: {
              type: Object,
            },
            cancelButton: {
              type: Boolean,
              attribute: "cancel-button",
            },
          };
        },
      },
    ]);

    function SimpleTag() {
      var _this;

      _classCallCheck(this, SimpleTag);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(SimpleTag).call(this)
      );
      _this.data = {};
      _this.icon = "cancel";
      _this.cancelButton = false;
      _this.disabled = false;
      _this.readonly = false;
      return _this;
    }

    _createClass(
      SimpleTag,
      [
        {
          key: "render",
          value: function render() {
            return (0, _litElement.html)(
              _templateObject(),
              this.value,
              !!this.readonly
                ? ""
                : (0, _litElement.html)(
                    _templateObject2(),
                    this.icon,
                    this.value,
                    this.cancelButton,
                    this.clickEvent,
                    this.disabled
                  )
            );
          },
        },
        {
          key: "clickEvent",
          value: function clickEvent(e) {
            this.dispatchEvent(
              new CustomEvent("simple-tag-clicked", {
                composed: false,
                bubbles: false,
                cancelable: false,
                detail: {
                  value: this.value,
                },
              })
            );
          },
        },
      ],
      [
        {
          key: "styles",
          get: function get() {
            return [
              _simpleFieldsUi.SimpleFieldsButtonStyles,
              _simpleFieldsUi.SimpleFieldsTooltipStyles,
              (0, _litElement.css)(_templateObject3()),
            ];
          },
        },
      ]
    );

    return SimpleTag;
  })(_litElement.LitElement);

exports.SimpleTag = SimpleTag;
customElements.define(SimpleTag.tag, SimpleTag);

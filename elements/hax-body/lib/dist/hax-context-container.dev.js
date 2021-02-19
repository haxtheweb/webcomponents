"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HaxContextContainer = void 0;

var _litElement = require("lit-element/lit-element.js");

var _haxUiStyles = require("@lrnwebcomponents/hax-body/lib/hax-ui-styles.js");

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

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n      <div id="inner">\n        <slot></slot>\n      </div>\n    ',
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    "\n        :host {\n          padding: 0;\n          position: absolute;\n          visibility: hidden;\n          opacity: 0;\n          z-index: 1000;\n          display: block;\n          transition: 0.2s opacity ease-in-out;\n          width: 100%;\n          top: var(--hax-context-container-top, 0px);\n        }\n        :host(:hover),\n        :host(:focus-within) {\n          z-index: var(--hax-tray-focus-z-index);\n        }\n        :host([menus-visible]) {\n          position: absolute;\n          visibility: visible;\n          opacity: 1;\n        }\n        :host([menu-sticky]) {\n          position: fixed;\n          top: 0;\n          left: var(--hax-context-container-left, 0px);\n          max-width: var(--hax-context-container-width, 100%);\n        }\n        #inner {\n          width: 100%;\n          position: absolute;\n          bottom: 0;\n          display: flex;\n          align-items: flex-end;\n          justify-content: space-between;\n          top: unset;\n        }\n        :host([below]) #inner {\n          bottom: unset;\n          top: 0;\n        }\n        :host([menu-sticky]) #inner {\n          bottom: unset;\n          top: var(--hax-context-container-target-top, 0px);\n        }\n      ",
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
 * @extends LitElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
var HaxContextContainer =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(HaxContextContainer, _LitElement);

    _createClass(HaxContextContainer, null, [
      {
        key: "styles",

        /**
         * LitElement constructable styles enhancement
         */
        get: function get() {
          return [].concat(_toConsumableArray(_haxUiStyles.HaxTrayBaseStyles), [
            (0, _litElement.css)(_templateObject()),
          ]);
        },
      },
    ]);

    function HaxContextContainer() {
      var _this;

      _classCallCheck(this, HaxContextContainer);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(HaxContextContainer).call(this)
      );
      console.log(_haxUiStyles.HaxTrayBaseStyles);
      return _this;
    }

    _createClass(
      HaxContextContainer,
      [
        {
          key: "render",
          value: function render() {
            return (0, _litElement.html)(_templateObject2());
          },
        },
      ],
      [
        {
          key: "properties",
          get: function get() {
            return {
              menusVisible: {
                type: Boolean,
                attribute: "menus-visible",
                reflect: true,
              },
              menuSticky: {
                type: Boolean,
                attribute: "menu-sticky",
                reflect: true,
              },
              below: {
                type: Boolean,
                attribute: "below",
                reflect: true,
              },
            };
          },
        },
        {
          key: "tag",
          get: function get() {
            return "hax-context-container";
          },
        },
      ]
    );

    return HaxContextContainer;
  })(_litElement.LitElement);

exports.HaxContextContainer = HaxContextContainer;
window.customElements.define(HaxContextContainer.tag, HaxContextContainer);

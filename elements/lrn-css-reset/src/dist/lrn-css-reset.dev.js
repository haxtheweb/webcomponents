"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.LrnCssReset = exports.AttachStylesToHead = exports.LrnCssResetStyles = void 0;

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

function _templateObject2() {
  var data = _taggedTemplateLiteral(["<slot></slot>"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
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

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(receiver);
      }
      return desc.value;
    };
  }
  return _get(target, property, receiver || target);
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
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

function _templateObject() {
  var data = _taggedTemplateLiteral([
    "/* REQUIRED FOR TOOLING DO NOT TOUCH */",
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

/**
 * CSS reset and additional base styles for lrnwebcomponents and apps
 */
var LrnCssResetStyles = [(0, _litElement.css)(_templateObject())];
exports.LrnCssResetStyles = LrnCssResetStyles;

var AttachStylesToHead = function AttachStylesToHead() {
  var styles =
    arguments.length > 0 && arguments[0] !== undefined
      ? arguments[0]
      : LrnCssResetStyles;
  var id =
    arguments.length > 1 && arguments[1] !== undefined
      ? arguments[1]
      : "LrnCssResetStyles";

  if (!window.LrnCssResetStyles) {
    window[id] = document.createElement("div");

    var s = document.createElement("style"),
      _css = LrnCssResetStyles.map(function (st) {
        return st.cssText;
      }).join("");

    s.setAttribute("id", id);
    s.setAttribute("type", "text/css");

    if (s.styleSheet) {
      // IE
      s.styleSheet.cssText = _css;
    } else {
      // the world
      s.appendChild(document.createTextNode(_css));
    }

    document.getElementsByTagName("head")[0].appendChild(s);
  }
};
/**
 * `lrn-css-reset`
 * `an element that applies CSS reset and additional base styles
 * @microcopy - language worth noting:
 *  -
 *
 * @class LrnCssReset
 * @extends {LitElement}
 * @demo demo/index.html
 * @element lrn-css-reset
 */

exports.AttachStylesToHead = AttachStylesToHead;

var LrnCssReset =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(LrnCssReset, _LitElement);

    _createClass(LrnCssReset, null, [
      {
        key: "tag",

        /**
         * Store the tag name to make it easier to obtain directly.
         * @notice function name must be here for tooling to operate correctly
         */
        get: function get() {
          return "lrn-css-reset";
        },
      },
      {
        key: "styles",
        get: function get() {
          return LrnCssResetStyles;
        },
      },
      {
        key: "properties",
        get: function get() {
          return {
            applyToHead: {
              type: Boolean,
              attribute: "apply-to-head",
            },
          };
        },
        /**
         * HTMLElement
         */
      },
    ]);

    function LrnCssReset() {
      _classCallCheck(this, LrnCssReset);

      return _possibleConstructorReturn(
        this,
        _getPrototypeOf(LrnCssReset).call(this)
      );
    }

    _createClass(LrnCssReset, [
      {
        key: "firstUpdated",
        value: function firstUpdated(changedProperties) {
          if (
            _get(_getPrototypeOf(LrnCssReset.prototype), "firstUpdated", this)
          )
            _get(
              _getPrototypeOf(LrnCssReset.prototype),
              "firstUpdated",
              this
            ).call(this, changedProperties);
          if (this.applyToHead)
            AttachStylesToHead(LrnCssResetStyles, "LrnCssResetStyles");
        },
      },
      {
        key: "render",
        value: function render() {
          return (0, _litElement.html)(_templateObject2());
        },
      },
    ]);

    return LrnCssReset;
  })(_litElement.LitElement);

exports.LrnCssReset = LrnCssReset;
customElements.define(LrnCssReset.tag, LrnCssReset);

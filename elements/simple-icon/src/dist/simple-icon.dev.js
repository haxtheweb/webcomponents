"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimpleIcon = void 0;

var _litElement = require("lit-element/lit-element.js");

var _simpleColors = require("@lrnwebcomponents/simple-colors/simple-colors.js");

var _simpleIconLite = require("./lib/simple-icon-lite.js");

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

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key)
        );
      });
    }
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    "\n        feFlood {\n          flood-color: var(\n            --simple-icon-color,\n            var(--simple-colors-default-theme-accent-8, #000000)\n          );\n        }\n        feFlood.contrast-1 {\n          flood-color: var(\n            --simple-icon-color,\n            var(--simple-colors-default-theme-accent-9, #000000)\n          );\n        }\n        feFlood.contrast-2 {\n          flood-color: var(\n            --simple-icon-color,\n            var(--simple-colors-default-theme-accent-10, #000000)\n          );\n        }\n        feFlood.contrast-3 {\n          flood-color: var(\n            --simple-icon-color,\n            var(--simple-colors-default-theme-accent-11, #000000)\n          );\n        }\n        feFlood.contrast-4 {\n          flood-color: var(\n            --simple-icon-color,\n            var(--simple-colors-default-theme-accent-12, #000000)\n          );\n        }\n      ",
  ]);

  _templateObject2 = function _templateObject2() {
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

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '<feFlood class="contrast-',
    '" result="COLOR" />',
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

/**
 * `simple-icon`
 * `Render an SVG based icon`
 *
 * @microcopy - language worth noting:
 *  -
 * @customElement
 * @extends SimpleColors
 * @extends SimpleIconBehaviors
 * @demo demo/index.html
 * @demo demo/button.html Button
 * @demo demo/lite.html Lite
 * @demo demo/button-lite.html Button (Lite)
 * @demo demo/iconset.html Iconset Demo
 * @element simple-icon
 */
var SimpleIcon =
  /*#__PURE__*/
  (function (_SimpleIconBehaviors) {
    _inherits(SimpleIcon, _SimpleIconBehaviors);

    _createClass(
      SimpleIcon,
      [
        {
          key: "feFlood",
          get: function get() {
            return !this.noColorize
              ? (0, _litElement.svg)(_templateObject(), this.contrast)
              : "";
          }, // properties available to the custom element for data binding
        },
      ],
      [
        {
          key: "tag",

          /**
           * This is a convention, not the standard
           */
          get: function get() {
            return "simple-icon";
          },
        },
        {
          key: "styles",
          get: function get() {
            return [].concat(
              _toConsumableArray(
                _get(_getPrototypeOf(SimpleIcon), "styles", this)
              ),
              [(0, _litElement.css)(_templateObject2())]
            );
          },
        },
        {
          key: "properties",
          get: function get() {
            return _objectSpread(
              {},
              _get(_getPrototypeOf(SimpleIcon), "properties", this),
              {
                contrast: {
                  type: Number,
                  attribute: "contrast",
                  reflect: true,
                },
              }
            );
          },
        },
      ]
    );

    function SimpleIcon() {
      var _this;

      _classCallCheck(this, SimpleIcon);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(SimpleIcon).call(this)
      );
      _this.contrast = 0;
      return _this;
    }

    return SimpleIcon;
  })((0, _simpleIconLite.SimpleIconBehaviors)(_simpleColors.SimpleColors));

exports.SimpleIcon = SimpleIcon;
customElements.define(SimpleIcon.tag, SimpleIcon);

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimpleIconLite = exports.SimpleIconBehaviors = void 0;

var _litElement = require("lit");

var _simpleIconset = require("./simple-iconset.js");

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

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    "\n          :host {\n            display: inline-flex;\n            align-items: center;\n            justify-content: center;\n            position: relative;\n            vertical-align: middle;\n            height: var(--simple-icon-height, 24px);\n            width: var(--simple-icon-width, 24px);\n          }\n          :host([hidden]) {\n            display: none;\n          }\n          svg {\n            height: var(--simple-icon-height, 24px);\n            width: var(--simple-icon-width, 24px);\n            max-height: var(--simple-icon-height, 24px);\n            max-width: var(--simple-icon-width, 24px);\n          }\n          feFlood {\n            flood-color: var(--simple-icon-color, currentColor);\n          }\n          svg {\n            pointer-events: none;\n          }\n        ",
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(['<feFlood result="COLOR" />']);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '\n        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">\n          <filter\n            color-interpolation-filters="sRGB"\n            x="0"\n            y="0"\n            height="24px"\n            width="24px"\n          >\n            ',
    '\n            <feComposite operator="in" in="COLOR" in2="SourceAlpha" />\n          </filter>\n          <image\n            xlink:href=""\n            width="24px"\n            height="24px"\n            focusable="false"\n            preserveAspectRatio="xMidYMid meet"\n          ></image>\n        </svg>\n      ',
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

var SimpleIconBehaviors = function SimpleIconBehaviors(SuperClass) {
  return (
    /*#__PURE__*/
    (function (_SuperClass) {
      _inherits(_class, _SuperClass);

      _createClass(
        _class,
        [
          {
            key: "render",
            // render function
            value: function render() {
              return (0, _litElement.svg)(_templateObject(), this.feFlood);
            },
          },
          {
            key: "feFlood",
            get: function get() {
              return !this.noColorize
                ? (0, _litElement.svg)(_templateObject2())
                : "";
            }, // properties available to the custom element for data binding
          },
        ],
        [
          {
            key: "styles",
            get: function get() {
              return [
                _get(_getPrototypeOf(_class), "styles", this) || [],
              ].concat([(0, _litElement.css)(_templateObject3())]);
            },
          },
          {
            key: "properties",
            get: function get() {
              return _objectSpread(
                {},
                _get(_getPrototypeOf(_class), "properties", this),
                {
                  src: {
                    type: String,
                  },
                  noColorize: {
                    type: Boolean,
                    attribute: "no-colorize",
                  },
                  icon: {
                    type: String,
                    attribute: "icon",
                    reflect: true,
                  },
                }
              );
            },
          },
        ]
      );

      function _class() {
        var _this;

        _classCallCheck(this, _class);

        _this = _possibleConstructorReturn(
          this,
          _getPrototypeOf(_class).call(this)
        );
        _this.noColorize = false;
        return _this;
      }

      _createClass(_class, [
        {
          key: "firstUpdated",
          value: function firstUpdated(changedProperties) {
            if (_get(_getPrototypeOf(_class.prototype), "firstUpdated", this)) {
              _get(
                _getPrototypeOf(_class.prototype),
                "firstUpdated",
                this
              ).call(this, changedProperties);
            }

            var randomId = "f-" + Math.random().toString().slice(2, 10);
            this.shadowRoot.querySelector(
              "image"
            ).style.filter = "url(#".concat(randomId, ")");
            this.shadowRoot
              .querySelector("filter")
              .setAttribute("id", randomId);
          },
          /**
           * Set the src by the icon property
           */
        },
        {
          key: "setSrcByIcon",
          value: function setSrcByIcon(context) {
            this.src = _simpleIconset.SimpleIconsetStore.getIcon(
              this.icon,
              context
            );
            return this.src;
          },
        },
        {
          key: "updated",
          value: function updated(changedProperties) {
            var _this2 = this;

            if (_get(_getPrototypeOf(_class.prototype), "updated", this)) {
              _get(_getPrototypeOf(_class.prototype), "updated", this).call(
                this,
                changedProperties
              );
            }

            changedProperties.forEach(function (oldValue, propName) {
              if (propName == "icon") {
                if (_this2[propName]) {
                  _this2.setSrcByIcon(_this2);
                } else {
                  _this2.src = null;
                }
              }

              if (propName == "src") {
                // look this up in the registry
                if (_this2[propName]) {
                  _this2.shadowRoot
                    .querySelector("image")
                    .setAttribute("xlink:href", "".concat(_this2[propName]));
                }
              }
            });
          },
        },
      ]);

      return _class;
    })(SuperClass)
  );
};
/**
 * `simple-icon-lite`
 * `Render an SVG based icon`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @extends LitElement
 * @extends SimpleIconBehaviors
 * @demo demo/lite.html
 * @demo demo/button-lite.html Button (Lite)
 * @element simple-icon-lite
 */

exports.SimpleIconBehaviors = SimpleIconBehaviors;

var SimpleIconLite =
  /*#__PURE__*/
  (function (_SimpleIconBehaviors) {
    _inherits(SimpleIconLite, _SimpleIconBehaviors);

    function SimpleIconLite() {
      _classCallCheck(this, SimpleIconLite);

      return _possibleConstructorReturn(
        this,
        _getPrototypeOf(SimpleIconLite).apply(this, arguments)
      );
    }

    _createClass(SimpleIconLite, null, [
      {
        key: "tag",

        /**
         * This is a convention, not the standard
         */
        get: function get() {
          return "simple-icon-lite";
        },
      },
    ]);

    return SimpleIconLite;
  })(SimpleIconBehaviors(_litElement.LitElement));

exports.SimpleIconLite = SimpleIconLite;
customElements.define(SimpleIconLite.tag, SimpleIconLite);

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimpleIconButtonLite = exports.SimpleIconButtonBehaviors = void 0;

var _litElement = require("lit");

var _simpleColors = require("@lrnwebcomponents/simple-colors/simple-colors.js");

require("./simple-icons.js");

require("./simple-icon-lite.js");

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
    "\n          :host([hidden]) {\n            display: none;\n          }\n          :host {\n            display: inline-flex;\n            align-items: center;\n            justify-content: center;\n            position: relative;\n            vertical-align: middle;\n            border-radius: var(--simple-icon-button-border-radius, 50%);\n            background-color: var(\n              --simple-icon-button-background-color,\n              transparent\n            );\n            padding: 0;\n            margin: 0;\n            color: inherit;\n          }\n          button {\n            color: inherit;\n            cursor: pointer;\n            opacity: var(--simple-icon-button-opacity, 1);\n            border: var(--simple-icon-button-border, 0);\n            border-radius: var(--simple-icon-button-border-radius, 50%);\n            background-color: var(\n              --simple-icon-button-background-color,\n              transparent\n            );\n            padding: var(--simple-icon-button-padding, 0px);\n            margin: 0px;\n            width: 100%;\n          }\n          button[aria-pressed] {\n            opacity: var(--simple-icon-button-toggled-opacity, 1);\n            --simple-icon-button-border: var(\n              --simple-icon-toggled-button-border\n            );\n            --simple-icon-color: var(--simple-icon-button-toggled-color);\n            --simple-icon-button-background-color: var(\n              --simple-icon-button-toggled-background-color\n            );\n          }\n          button:focus,\n          button:hover {\n            opacity: var(--simple-icon-button-focus-opacity, 0.8);\n            --simple-icon-button-border: var(--simple-icon-button-focus-border);\n            --simple-icon-color: var(--simple-icon-button-focus-color);\n            --simple-icon-button-background-color: var(\n              --simple-icon-button-focus-background-color\n            );\n          }\n          button[disabled] {\n            opacity: var(--simple-icon-button-disabled-opacity, 0.5);\n            --simple-icon-button-border: var(\n              --simple-icon-button-disabled-border\n            );\n            --simple-icon-color: var(--simple-icon-button-disabled-color);\n            --simple-icon-button-background-color: var(\n              --simple-icon-button-disabled-background-color\n            );\n            cursor: not-allowed;\n          }\n\n          simple-icon-lite {\n            color: inherit;\n            height: calc(\n              var(--simple-icon-height, 24px) - 2 *\n                var(--simple-icon-button-padding, 0px)\n            );\n            width: calc(\n              var(--simple-icon-width, 24px) - 2 *\n                var(--simple-icon-button-padding, 0px)\n            );\n          }\n        ",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '\n        <button\n          ?autofocus="',
    '"\n          aria-labelledby="',
    '"\n          .aria-pressed="',
    '"\n          controls="',
    '"\n          part="button"\n          ?disabled="',
    '"\n          form="',
    '"\n          label="',
    '"\n          aria-label="',
    '"\n          name="',
    '"\n          .type="',
    '"\n          value="',
    '"\n        >\n          <simple-icon-lite icon=',
    ' part="icon"> </simple-icon-lite>\n        </button>\n      ',
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
 * @class SimpleIconButtonBehaviors
 */
var SimpleIconButtonBehaviors = function SimpleIconButtonBehaviors(SuperClass) {
  return (
    /*#__PURE__*/
    (function (_SuperClass) {
      _inherits(_class, _SuperClass);

      function _class() {
        var _this;

        _classCallCheck(this, _class);

        _this = _possibleConstructorReturn(
          this,
          _getPrototypeOf(_class).call(this)
        );
        _this.ariaLabelledby = "";
        _this.controls = "";
        _this.disabled = false;
        _this.form = "";
        _this.label = "";
        _this.fieldName = "";
        _this.type = "";
        _this.value = "";
        return _this;
      }

      _createClass(
        _class,
        [
          {
            key: "render",
            // render function
            value: function render() {
              return (0, _litElement.html)(
                _templateObject(),
                this.autofocus,
                this.ariaLabelledby,
                this.toggles || this.toggled
                  ? "true"
                  : this.toggles
                  ? "false"
                  : undefined,
                this.controls,
                this.disabled,
                this.form,
                this.label,
                this.label,
                this.fieldName,
                this.type,
                this.value,
                this.icon
              );
            }, // properties available to the custom element for data binding
          },
        ],
        [
          {
            key: "styles",
            get: function get() {
              return [
                _get(_getPrototypeOf(_class), "styles", this) || [],
              ].concat([(0, _litElement.css)(_templateObject2())]);
            },
          },
          {
            key: "properties",
            get: function get() {
              return _objectSpread(
                {},
                _get(_getPrototypeOf(_class), "properties", this),
                {
                  autofocus: {
                    attribute: "autofocus",
                    type: Boolean,
                  },
                  ariaLabelledby: {
                    attribute: "aria-labelledby",
                    type: String,
                  },
                  controls: {
                    attribute: "controls",
                    type: String,
                  },
                  disabled: {
                    attribute: "disabled",
                    type: Boolean,
                  },
                  fieldName: {
                    attribute: "field-name",
                    type: String,
                  },
                  form: {
                    attribute: "form",
                    type: String,
                  },
                  icon: {
                    type: String,
                    reflect: true,
                  },
                  label: {
                    attribute: "label",
                    type: String,
                  },
                  type: {
                    attribute: "type",
                    type: String,
                  },
                  value: {
                    attribute: "value",
                    type: String,
                    reflect: true,
                  },
                  toggles: {
                    attribute: "toggles",
                    type: Boolean,
                    reflect: true,
                  },
                  toggled: {
                    attribute: "toggled",
                    type: Boolean,
                    reflect: true,
                  },
                }
              );
            },
          },
        ]
      );

      return _class;
    })(SuperClass)
  );
};
/**
 * `simple-icon`
 * `Render an SVG based icon`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @extends LitElement
 * @extends SimpleIconButtonBehaviors
 * @demo demo/button-lite.html
 * @element simple-icon
 */

exports.SimpleIconButtonBehaviors = SimpleIconButtonBehaviors;

var SimpleIconButtonLite =
  /*#__PURE__*/
  (function (_SimpleIconButtonBeha) {
    _inherits(SimpleIconButtonLite, _SimpleIconButtonBeha);

    _createClass(SimpleIconButtonLite, null, [
      {
        key: "tag",

        /**
         * This is a convention, not the standard
         */
        get: function get() {
          return "simple-icon-button-lite";
        },
      },
    ]);

    function SimpleIconButtonLite() {
      var _this2;

      _classCallCheck(this, SimpleIconButtonLite);

      _this2 = _possibleConstructorReturn(
        this,
        _getPrototypeOf(SimpleIconButtonLite).call(this)
      );
      _this2.type = "button";
      return _this2;
    }

    return SimpleIconButtonLite;
  })(SimpleIconButtonBehaviors(_litElement.LitElement));

exports.SimpleIconButtonLite = SimpleIconButtonLite;
customElements.define(SimpleIconButtonLite.tag, SimpleIconButtonLite);

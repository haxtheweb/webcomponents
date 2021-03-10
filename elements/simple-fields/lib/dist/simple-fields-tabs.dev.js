"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimpleFieldsTabs = void 0;

var _litElement = require("lit-element/lit-element.js");

var _simpleFieldsFieldset = require("./simple-fields-fieldset.js");

var _a11yTabs = require("@lrnwebcomponents/a11y-tabs/a11y-tabs.js");

require("./simple-fields-tab.js");

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
    "\n        :host {\n          border: 1px solid var(--simple-fields-border-color-light, #ccc);\n          padding: var(--simple-fields-margin-small, 8px)\n            var(--simple-fields-margin-small, 8px)\n            var(--simple-fields-margin, 16px);\n          background-color: var(--simple-fields-background-color, transparent);\n          border-radius: var(--simple-fields-border-radius, 2px);\n        }\n        :host([error]) #tabs .error {\n          color: var(--simple-fields-error-color, #b40000);\n          transition: border 0.5s ease;\n        }\n      ",
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
    '\n      <span class="label',
    '" part="tab-label"\n        >',
    "",
    "</span\n      >\n    ",
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
 * `simple-fields-tabs` takes in a JSON schema of type array and builds a form,
 * exposing a `value` property that represents an array described by the schema.
 *
 * @customElement
 * @group simple-fields
 * @element simple-fields-tabs
 * @extends simple-fields-fieldset
 * @class SimpleFieldsTabs
 * @extends {A11yTabs}
 */
var SimpleFieldsTabs =
  /*#__PURE__*/
  (function (_A11yTabs) {
    _inherits(SimpleFieldsTabs, _A11yTabs);

    function SimpleFieldsTabs() {
      var _this;

      _classCallCheck(this, SimpleFieldsTabs);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(SimpleFieldsTabs).call(this)
      );
      _this.fullWidth = true;
      return _this;
    }

    _createClass(
      SimpleFieldsTabs,
      [
        {
          key: "_tabLabel",

          /**
           * makes tab label
           *
           * @param {string} flag tab's flag
           * @returns object
           * @memberof A11yTabs
           */
          value: function _tabLabel(tab) {
            return (0, _litElement.html)(
              _templateObject(),
              tab.error ? " error" : "",
              tab.label,
              tab.error ? "*" : ""
            );
          },
        },
        {
          key: "tabQuery",

          /**
           * query selector for tabs
           * override this for custom elements that extend a11y-tabs
           *
           * @readonly
           * @memberof A11yTabs
           */
          get: function get() {
            return "simple-fields-tab";
          },
        },
      ],
      [
        {
          key: "tag",
          get: function get() {
            return "simple-fields-tabs";
          },
        },
        {
          key: "styles",
          get: function get() {
            return [].concat(
              _toConsumableArray(this.A11yTabsCoreStyles),
              _toConsumableArray(_simpleFieldsUi.SimpleFieldsButtonStyles),
              [(0, _litElement.css)(_templateObject2())]
            );
          },
        },
        {
          key: "properties",
          get: function get() {
            return _objectSpread(
              {},
              _get(_getPrototypeOf(SimpleFieldsTabs), "properties", this),
              {},
              _simpleFieldsFieldset.SimpleFieldsFieldsetBehaviors.properties
            );
          },
        },
      ]
    );

    return SimpleFieldsTabs;
  })(_a11yTabs.A11yTabs);

exports.SimpleFieldsTabs = SimpleFieldsTabs;
window.customElements.define(SimpleFieldsTabs.tag, SimpleFieldsTabs);

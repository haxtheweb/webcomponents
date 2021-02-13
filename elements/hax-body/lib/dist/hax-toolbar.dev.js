"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HaxToolbarBehaviors = exports.HaxToolbar = void 0;

var _litElement = require("lit-element/lit-element.js");

require("@lrnwebcomponents/hax-body/lib/hax-toolbar-item.js");

require("@lrnwebcomponents/hax-body/lib/hax-context-item.js");

require("@lrnwebcomponents/hax-body/lib/hax-button-menu.js");

require("@lrnwebcomponents/a11y-menu-button/lib/a11y-menu-button-item.js");

var _simpleToolbar = require("@lrnwebcomponents/simple-toolbar/simple-toolbar.js");

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

function _templateObject() {
  var data = _taggedTemplateLiteral([
    "\n          :host {\n            background-color: var(--hax-toolbar-button-bg, #fff);\n            border: 1px solid var(--hax-toolbar-border-color, #ddd);\n            flex: 0 0 auto;\n            display: none;\n\n            --simple-toolbar-button-border-radius: var(\n              --hax-toolbar-button-border-radius,\n              3px\n            );\n            --a11y-menu-button-border-radius: var(\n              --hax-toolbar-button-border-radius,\n              3px\n            );\n            --a11y-menu-button-border-radius: var(\n              --hax-toolbar-menu-button-border-radius,\n              0\n            );\n\n            --simple-toolbar-button-padding: var(\n              --hax-toolbar-button-padding,\n              0\n            );\n            --a11y-menu-button-vertical-padding: var(\n              --hax-toolbar-button-padding,\n              0\n            );\n            --a11y-menu-button-vertical-padding: var(\n              --hax-toolbar-button-padding,\n              0\n            );\n\n            --simple-toolbar-button-bg: var(--hax-toolbar-button-bg, #fff);\n            --a11y-menu-button-bg-color: var(--hax-toolbar-button-bg, #fff);\n            --a11y-menu-button-item-bg-color: var(\n              --hax-toolbar-button-bg,\n              #fff\n            );\n\n            --simple-toolbar-button-hover-bg: var(\n              --hax-toolbar-button-hover-bg,\n              #fff\n            );\n            --a11y-menu-button-focus-bg-color: var(\n              --hax-toolbar-button-hover-bg,\n              #fff\n            );\n            --a11y-menu-button-item-focus-bg-color: var(\n              --hax-toolbar-menu-button-hover-bg,\n              #c4ecff\n            );\n\n            --simple-toolbar-button-color: var(\n              --hax-toolbar-button-color,\n              #444\n            );\n            --a11y-menu-button-color: var(--hax-toolbar-button-color, #444);\n            --a11y-menu-button-item-color: var(\n              --hax-toolbar-button-color,\n              #444\n            );\n\n            --simple-toolbar-button-hover-color: var(\n              --hax-toolbar-button-hover-color,\n              #000\n            );\n            --a11y-menu-button-focus-color: var(\n              --hax-toolbar-button-hover-color,\n              #000\n            );\n            --a11y-menu-button-item-focus-color: var(\n              --hax-toolbar-button-hover-color,\n              #000\n            );\n\n            --simple-toolbar-button-border-color: var(\n              --hax-toolbar-button-border-color,\n              #fff\n            );\n            --a11y-menu-button-border: 1px solid\n              var(--hax-toolbar-button-border-color, #fff);\n            --a11y-menu-button-border: 1px solid\n              var(--hax-toolbar-button-border-color, #fff);\n\n            --simple-toolbar-button-hover-border-color: var(\n              --hax-toolbar-button-hover-border-color,\n              #000\n            );\n            --a11y-menu-button-focus-border: 1px solid\n              var(--hax-toolbar-button-hover-border-color, #000);\n            --a11y-menu-button-item-focus-border: 1px solid\n              var(--hax-toolbar-button-hover-border-color, #000);\n          }\n          :host(.hax-context-visible) {\n            display: flex;\n          }\n          :host([hidden]),\n          :host *[hidden] {\n            display: none !important;\n          }\n          .selected-buttons {\n            transition: 0.1s all ease-in-out;\n            width: 0;\n          }\n          :host([has-selected-text]) .selected-buttons {\n            width: 100%;\n          }\n          hax-context-item-textop,\n          hax-context-item {\n            transition: all 0.2s linear;\n            visibility: visible;\n            opacity: 1;\n          }\n          hax-context-item-textop[hidden],\n          hax-context-item[hidden] {\n            visibility: hidden;\n            opacity: 0;\n          }\n          #buttons {\n            display: flex;\n            flex: 1 1 auto;\n          }\n          #buttons .group {\n            display: flex;\n            flex-wrap: nowrap;\n            flex: 1 1 auto;\n          }\n          ::slotted(*) {\n            pointer-events: all;\n          }\n        ",
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

var HaxToolbarBehaviors = function HaxToolbarBehaviors(SuperClass) {
  return (
    /*#__PURE__*/
    (function (_SimpleToolbarBehavio) {
      _inherits(_class, _SimpleToolbarBehavio);

      _createClass(_class, null, [
        {
          key: "styles",

          /**
           * LitElement constructable styles enhancement
           */
          get: function get() {
            return [].concat(
              _toConsumableArray(_get(_getPrototypeOf(_class), "styles", this)),
              [(0, _litElement.css)(_templateObject())]
            );
          },
        },
      ]);

      function _class() {
        var _this;

        _classCallCheck(this, _class);

        _this = _possibleConstructorReturn(
          this,
          _getPrototypeOf(_class).call(this)
        );
        _this.selected = false;
        _this.inline = false;
        return _this;
      }

      _createClass(_class, null, [
        {
          key: "tag",
          get: function get() {
            return "hax-toolbar";
          },
        },
        {
          key: "properties",
          get: function get() {
            return _objectSpread(
              {},
              _get(_getPrototypeOf(_class), "properties", this),
              {
                /**
                 * See what's selected
                 */
                selected: {
                  type: Boolean,
                  reflect: true,
                },

                /**
                 * This is an inline context menu
                 */
                inline: {
                  type: Boolean,
                  reflect: true,
                },
              }
            );
          },
        },
      ]);

      return _class;
    })((0, _simpleToolbar.SimpleToolbarBehaviors)(SuperClass))
  );
};
/**
 *
 * @customElement
 * @extends HaxToolbarItemBehaviors
 * @extends LitElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */

exports.HaxToolbarBehaviors = HaxToolbarBehaviors;

var HaxToolbar =
  /*#__PURE__*/
  (function (_HaxToolbarBehaviors) {
    _inherits(HaxToolbar, _HaxToolbarBehaviors);

    function HaxToolbar() {
      _classCallCheck(this, HaxToolbar);

      return _possibleConstructorReturn(
        this,
        _getPrototypeOf(HaxToolbar).apply(this, arguments)
      );
    }

    return HaxToolbar;
  })(HaxToolbarBehaviors(_litElement.LitElement));

exports.HaxToolbar = HaxToolbar;
window.customElements.define(HaxToolbar.tag, HaxToolbar);

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HaxToolbarMenu = void 0;

var _litElement = require("lit-element/lit-element.js");

var _simpleToolbarMenu = require("@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-menu.js");

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
    "\n        ::slotted(*) {\n          --simple-toolbar-button-justify: flex-start;\n          --simple-toolbar-button-label-white-space: nowrap;\n          --simple-toolbar-button-padding: 0 var(--hax-tray-spacing-sm);\n        }\n      ",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(['<slot name="menuitem"></slot>']);

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

/**
 * `hax-toolbar-menu`
 * `An icon / button that has support for multiple options via drop down.`
 *
 * @microcopy - the mental model for this element
 * - panel - the flyout from left or right side that has elements that can be placed
 * - button - an item that expresses what interaction you will have with the content.
 *
 * @extends SimpleToolbarMenuBehaviors
 * @element hax-toolbar-menu
 *
 */
var HaxToolbarMenu =
  /*#__PURE__*/
  (function (_SimpleToolbarMenuBeh) {
    _inherits(HaxToolbarMenu, _SimpleToolbarMenuBeh);

    _createClass(HaxToolbarMenu, null, [
      {
        key: "styles",

        /**
         * LitElement constructable styles enhancement
         */
        get: function get() {
          return _toConsumableArray(
            _get(_getPrototypeOf(HaxToolbarMenu), "styles", this)
          );
        },
      },
    ]);

    function HaxToolbarMenu() {
      var _this;

      _classCallCheck(this, HaxToolbarMenu);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(HaxToolbarMenu).call(this)
      );
      _this._blockEvent = false;
      return _this;
    }
    /**
     * template for slotted list items
     *
     * @readonly
     */

    _createClass(
      HaxToolbarMenu,
      [
        {
          key: "listItemTemplate",
          get: function get() {
            return (0, _litElement.html)(_templateObject());
          },
        },
      ],
      [
        {
          key: "simpleButtonThemeStyles",
          get: function get() {
            return _haxUiStyles.HaxTrayButtonTheme;
          },
        },
        {
          key: "simpleButtonCoreStyles",
          get: function get() {
            return [].concat(
              _toConsumableArray(
                _get(
                  _getPrototypeOf(HaxToolbarMenu),
                  "simpleButtonCoreStyles",
                  this
                )
              ),
              [(0, _litElement.css)(_templateObject2())]
            );
          },
        },
        {
          key: "tag",
          get: function get() {
            return "hax-toolbar-menu";
          },
        },
        {
          key: "properties",
          get: function get() {
            return _objectSpread(
              {},
              _get(_getPrototypeOf(HaxToolbarMenu), "properties", this),
              {
                /**
                 * Internal flag to allow blocking the event firing if machine selects tag.
                 */
                _blockEvent: {
                  type: Boolean,
                },

                /**
                 * Name of the event to bubble up as being tapped.
                 * This can be used to tell other elements what was
                 * clicked so it can take action appropriately.
                 */
                eventName: {
                  type: String,
                  attribute: "event-name",
                },
              }
            );
          },
        },
      ]
    );

    return HaxToolbarMenu;
  })(
    (0, _simpleToolbarMenu.SimpleToolbarMenuBehaviors)(_litElement.LitElement)
  );

exports.HaxToolbarMenu = HaxToolbarMenu;
window.customElements.define(HaxToolbarMenu.tag, HaxToolbarMenu);

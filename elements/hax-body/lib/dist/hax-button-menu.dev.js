"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HaxButtonMenu = void 0;

var _litElement = require("lit-element/lit-element.js");

require("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");

var _a11yMenuButton = require("@lrnwebcomponents/a11y-menu-button/a11y-menu-button.js");

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
  var data = _taggedTemplateLiteral(['<slot name="menuitem"></slot>']);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n      <button\n        id="menubutton"\n        aria-haspopup="true"\n        aria-controls="menu"\n        aria-expanded="',
    '"\n      >\n        <simple-icon-lite\n          icon="',
    '"\n          aria-hidden="true"\n          ?hidden=',
    '\n        ></simple-icon-lite>\n        <span class="',
    '"\n          >',
    '</span\n        >\n        <simple-icon-lite\n          id="dropdownicon"\n          icon="arrow-drop-down"\n          aria-hidden="true"\n        ></simple-icon-lite>\n      </button>\n      <simple-tooltip for="menubutton" ?hidden="',
    '"\n        >',
    "</simple-tooltip\n      >\n    ",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    "\n        .sr-only {\n          position: absolute;\n          left: -99999999px;\n          width: 0;\n          height: 0;\n          overflow: hidden;\n        }\n        :host([disabled]) {\n          pointer-events: none;\n        }\n        :host([danger]) {\n          --a11y-menu-button-focus-color: var(\n            --hax-toolbar-button-danger-color,\n            #882222\n          );\n          --a11y-menu-button-focus-border: 1px solid\n            var(--hax-toolbar-button-danger-color, #882222);\n        }\n        button {\n          display: flex;\n          flex-wrap: none;\n          align-items: center;\n          min-width: 42px;\n        }\n        .label {\n          padding: 0 5px;\n        }\n        #dropdownicon {\n          --simple-icon-height: 18px;\n          --simple-icon-width: 18px;\n          margin-left: -2px;\n        }\n        absolute-position-behavior {\n          --a11y-menu-button-border: 1px solid\n            var(--hax-toolbar-button-hover-border-color, #000);\n          z-index: 1001;\n        }\n      ",
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

/**
 * `hax-button-menu`
 * `An icon / button that has support for multiple options via drop down.`
 *
 * @microcopy - the mental model for this element
 * - panel - the flyout from left or right side that has elements that can be placed
 * - button - an item that expresses what interaction you will have with the content.
 *
 * Eextends A11yMenuButtonBehaviors
 * @element hax-button-menu
 *
 */
var HaxButtonMenu =
  /*#__PURE__*/
  (function (_A11yMenuButtonBehavi) {
    _inherits(HaxButtonMenu, _A11yMenuButtonBehavi);

    _createClass(HaxButtonMenu, null, [
      {
        key: "styles",

        /**
         * LitElement constructable styles enhancement
         */
        get: function get() {
          return [].concat(
            _toConsumableArray(
              _get(_getPrototypeOf(HaxButtonMenu), "styles", this)
            ),
            [(0, _litElement.css)(_templateObject())]
          );
        },
      },
    ]);

    function HaxButtonMenu() {
      var _this;

      _classCallCheck(this, HaxButtonMenu);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(HaxButtonMenu).call(this)
      );
      _this._blockEvent = false;
      _this.disabled = false;
      _this.direction = "top";
      _this.label = "";
      return _this;
    }

    _createClass(
      HaxButtonMenu,
      [
        {
          key: "selectedValueChanged",
          value: function selectedValueChanged(e) {
            this.selectedValue = e.detail;
          },
        },
        {
          key: "buttonTemplate",
          get: function get() {
            return (0, _litElement.html)(
              _templateObject2(),
              this.expanded ? "true" : "false",
              this.icon,
              !this.icon,
              !this.icon || this.showTextLabel ? "label" : "sr-only",
              this.label,
              !this.icon,
              this.label
            );
          },
          /**
           * template for slotted list items
           *
           * @readonly
           */
        },
        {
          key: "listItemTemplate",
          get: function get() {
            return (0, _litElement.html)(_templateObject3());
          },
        },
      ],
      [
        {
          key: "tag",
          get: function get() {
            return "hax-button-menu";
          },
        },
        {
          key: "properties",
          get: function get() {
            return _objectSpread(
              {},
              _get(_getPrototypeOf(HaxButtonMenu), "properties", this),
              {
                /**
                 * disabled state
                 */
                disabled: {
                  type: Boolean,
                  reflect: true,
                },

                /**
                 * Internal flag to allow blocking the event firing if machine selects tag.
                 */
                _blockEvent: {
                  type: Boolean,
                },

                /**
                 * Show text label even if an icon is named?
                 */
                showTextLabel: {
                  attribute: "show-text-label",
                  type: Boolean,
                  reflect: true,
                },

                /**
                 * Direction for the tooltip
                 */
                direction: {
                  type: String,
                },

                /**
                 * Icon for the button.
                 */
                icon: {
                  type: String,
                  reflect: true,
                },

                /**
                 * Label for the button.
                 */
                label: {
                  type: String,
                  reflect: true,
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

    return HaxButtonMenu;
  })((0, _a11yMenuButton.A11yMenuButtonBehaviors)(_litElement.LitElement));

exports.HaxButtonMenu = HaxButtonMenu;
window.customElements.define(HaxButtonMenu.tag, HaxButtonMenu);

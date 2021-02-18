"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimpleToolbarMenuBehaviors = exports.SimpleToolbarMenu = void 0;

var _litElement = require("lit-element/lit-element.js");

var _a11yMenuButton = require("@lrnwebcomponents/a11y-menu-button/a11y-menu-button.js");

var _simpleToolbarButton = require("./simple-toolbar-button.js");

require("./simple-toolbar-menu-item.js");

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

function _templateObject5() {
  var data = _taggedTemplateLiteral([
    "\n          :host([expanded]) absolute-position-behavior {\n            border-style: solid;\n            border-width: var(\n              --simple-toolbar-button-border-width,\n              var(--simple-toolbar-border-width, 1px)\n            );\n            border-color: var(\n              --simple-toolbar-button-border-color,\n              var(--simple-toolbar-border-color, inherit)\n            );\n            background-color: var(--simple-toolbar-button-bg, white);\n            box-shadow: var(--simple-toolbar-menu-list-box-shadow, unset);\n          }\n        ",
  ]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral([
    "\n          #menu {\n            width: var(--simple-toolbar-button-width);\n            min-width: var(--simple-toolbar-button-min-width);\n          }\n        ",
  ]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    "\n          #menubutton {\n            display: flex;\n            flex-wrap: none;\n            align-items: center;\n            min-width: 42px;\n          }\n          .label {\n            padding: 0 5px;\n          }\n          #dropdownicon {\n            --simple-icon-height: 18px;\n            --simple-icon-width: 18px;\n            margin-left: -2px;\n          }\n        ",
  ]);

  _templateObject3 = function _templateObject3() {
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

function _templateObject2() {
  var data = _taggedTemplateLiteral(["<slot></slot>"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '\n        <button\n          id="menubutton"\n          aria-haspopup="true"\n          aria-controls="menu"\n          aria-expanded="',
    '"\n          part="button"\n        >\n          ',
    " ",
    '\n          <simple-icon-lite\n            id="dropdownicon"\n            icon="arrow-drop-down"\n            aria-hidden="true"\n          ></simple-icon-lite>\n        </button>\n      ',
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
 * `simple-toolbar-menu`
 * `An icon / button that has support for multiple options via drop down.`
 *
 * @microcopy - the mental model for this element
 * - panel - the flyout from left or right side that has elements that can be placed
 * - button - an item that expresses what interaction you will have with the content.
 *
 * @extends A11yMenuButtonBehaviors
 * @extends SimpleToolbarButtonBehaviors
 * @element simple-toolbar-menu
 *
 */
var SimpleToolbarMenuBehaviors = function SimpleToolbarMenuBehaviors(
  SuperClass
) {
  return (
    /*#__PURE__*/
    (function (_A11yMenuButtonBehavi) {
      _inherits(_class, _A11yMenuButtonBehavi);

      function _class() {
        _classCallCheck(this, _class);

        return _possibleConstructorReturn(
          this,
          _getPrototypeOf(_class).apply(this, arguments)
        );
      }

      _createClass(
        _class,
        [
          {
            key: "buttonTemplate",
            get: function get() {
              return (0, _litElement.html)(
                _templateObject(),
                this.expanded ? "true" : "false",
                this.iconTemplate,
                this.labelTemplate
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
              return (0, _litElement.html)(_templateObject2());
            },
          },
        ],
        [
          {
            key: "simpleButtonCoreStyles",
            get: function get() {
              return [].concat(
                _toConsumableArray(
                  _get(_getPrototypeOf(_class), "simpleButtonCoreStyles", this)
                ),
                [(0, _litElement.css)(_templateObject3())]
              );
            },
          },
          {
            key: "simpleButtonLayoutStyles",
            get: function get() {
              return [].concat(
                _toConsumableArray(
                  _get(
                    _getPrototypeOf(_class),
                    "simpleButtonLayoutStyles",
                    this
                  )
                ),
                [(0, _litElement.css)(_templateObject4())]
              );
            },
          },
          {
            key: "simpleButtonThemeStyles",
            get: function get() {
              return [].concat(
                _toConsumableArray(
                  _get(_getPrototypeOf(_class), "simpleButtonThemeStyles", this)
                ),
                [(0, _litElement.css)(_templateObject5())]
              );
            },
          },
          {
            key: "styles",
            get: function get() {
              return [].concat(
                _toConsumableArray(
                  _get(_getPrototypeOf(_class), "menuButtonCoreStyles", this)
                ),
                _toConsumableArray(this.simpleButtonCoreStyles),
                _toConsumableArray(this.iconStyles),
                _toConsumableArray(this.labelStyles),
                _toConsumableArray(this.tooltipStyles),
                _toConsumableArray(this.simpleButtonLayoutStyles),
                _toConsumableArray(this.simpleButtonThemeStyles)
              );
            },
          },
          {
            key: "tag",
            get: function get() {
              return "simple-toolbar-menu";
            },
          },
          {
            key: "properties",
            get: function get() {
              return _objectSpread(
                {},
                _get(_getPrototypeOf(_class), "properties", this)
              );
            },
          },
        ]
      );

      return _class;
    })(
      (0, _a11yMenuButton.A11yMenuButtonBehaviors)(
        (0, _simpleToolbarButton.SimpleToolbarButtonBehaviors)(SuperClass)
      )
    )
  );
};

exports.SimpleToolbarMenuBehaviors = SimpleToolbarMenuBehaviors;

var SimpleToolbarMenu =
  /*#__PURE__*/
  (function (_SimpleToolbarMenuBeh) {
    _inherits(SimpleToolbarMenu, _SimpleToolbarMenuBeh);

    function SimpleToolbarMenu() {
      _classCallCheck(this, SimpleToolbarMenu);

      return _possibleConstructorReturn(
        this,
        _getPrototypeOf(SimpleToolbarMenu).apply(this, arguments)
      );
    }

    return SimpleToolbarMenu;
  })(SimpleToolbarMenuBehaviors(_litElement.LitElement));

exports.SimpleToolbarMenu = SimpleToolbarMenu;
window.customElements.define(SimpleToolbarMenu.tag, SimpleToolbarMenu);

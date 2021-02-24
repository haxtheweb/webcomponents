"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HaxToolbarItemBehaviors = exports.HaxToolbarItem = void 0;

var _litElement = require("lit-element/lit-element.js");

var _simpleToolbarButton = require("@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-button.js");

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

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    '<simple-tooltip\n        id="tooltip"\n        for="button"\n        ?hidden="',
    '"\n        position="',
    '"\n        fit-to-visible-bounds\n        >',
    "</simple-tooltip\n      >",
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    ' <button\n              id="button"\n              class="simple-toolbar-button"\n              ?disabled="',
    '"\n              ?controls="',
    '"\n              @click="',
    '"\n              @keydown="',
    '"\n              @mousedown="',
    '"\n              tabindex="0"\n              part="button"\n            >\n              ',
    "\n              ",
    "\n            </button>\n            ",
    "",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    ' <button\n              id="button"\n              aria-pressed="',
    '"\n              class="simple-toolbar-button"\n              ?disabled="',
    '"\n              ?controls="',
    '"\n              @click="',
    '"\n              @keydown="',
    '"\n              @mousedown="',
    '"\n              tabindex="0"\n              part="button"\n            >\n              ',
    " ",
    "\n            </button>\n            ",
    "",
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

var HaxToolbarItemBehaviors = function HaxToolbarItemBehaviors(SuperClass) {
  return (
    /*#__PURE__*/
    (function (_SimpleToolbarButtonB) {
      _inherits(_class, _SimpleToolbarButtonB);

      _createClass(_class, null, [
        {
          key: "tag",
          get: function get() {
            return "hax-toolbar-item";
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
        _this.danger = false;
        _this.feature = false;
        _this.menu = false;
        return _this;
      }

      _createClass(
        _class,
        [
          {
            key: "_handleClick",
            value: function _handleClick(e) {},
          },
          {
            key: "_handleKeys",
            value: function _handleKeys(e) {},
          },
          {
            key: "_handleMousedown",
            value: function _handleMousedown(e) {},
          },
          {
            key: "buttonTemplate",

            /**
             * template for button, based on whether or not the button toggles
             *
             * @readonly
             */
            get: function get() {
              return this.toggles
                ? (0, _litElement.html)(
                    _templateObject(),
                    this.isToggled ? "true" : "false",
                    this.disabled,
                    this.controls,
                    this._handleClick,
                    this._handleKeys,
                    this._handleMousedown,
                    this.iconTemplate,
                    this.labelTemplate,
                    this.tooltipTemplate
                  )
                : (0, _litElement.html)(
                    _templateObject2(),
                    this.disabled,
                    this.controls,
                    this._handleClick,
                    this._handleKeys,
                    this._handleMousedown,
                    !this.icon || this.icon == "" ? "" : this.iconTemplate,
                    this.labelTemplate,
                    this.showTextLabel ? "" : this.tooltipTemplate
                  );
            },
            /**
             * current label based on toggled state
             *
             * @readonly
             */
          },
          {
            key: "currentTooltip",
            get: function get() {
              return this._defaultOrToggled(
                this.tooltip,
                this.toggledTooltip,
                this.isToggled
              );
            },
            /**
             * template for button tooltip
             *
             * @readonly
             */
          },
          {
            key: "tooltipTemplate",
            get: function get() {
              return (0, _litElement.html)(
                _templateObject3(),
                !this.currentTooltip && !this.currentLabel,
                this.tooltipDirection || "bottom",
                this.currentTooltip || this.currentLabel
              );
            },
          },
        ],
        [
          {
            key: "properties",
            get: function get() {
              return _objectSpread(
                {},
                _get(_getPrototypeOf(_class), "properties", this),
                {
                  /**
                   * red warning
                   */
                  danger: {
                    type: Boolean,
                    reflect: true,
                  },

                  /**
                   * Name of the event to bubble up as being tapped.
                   * This can be used to tell other elements what was
                   * clicked so it can take action appropriately.
                   */
                  eventName: {
                    type: String,
                    reflect: true,
                    attribute: "event-name",
                  },

                  /**
                   * Inverted display mode
                   */
                  feature: {
                    type: Boolean,
                    reflect: true,
                  },

                  /**
                   * Hover tip text
                   */
                  toggledTooltip: {
                    type: String,
                  },

                  /**
                   * Hover tip text
                   */
                  tooltip: {
                    type: String,
                  },
                }
              );
            },
          },
          {
            key: "simpleButtonThemeStyles",
            get: function get() {
              return _haxUiStyles.HaxButton;
            },
          },
          {
            key: "simpleButtonCoreStyles",
            get: function get() {
              return _get(
                _getPrototypeOf(_class),
                "simpleButtonCoreStyles",
                this
              );
            },
          },
          {
            key: "simpleButtonLayoutStyles",
            get: function get() {
              return _get(
                _getPrototypeOf(_class),
                "simpleButtonLayoutStyles",
                this
              );
            },
          },
          {
            key: "styles",
            get: function get() {
              return _get(_getPrototypeOf(_class), "styles", this);
            },
          },
        ]
      );

      return _class;
    })((0, _simpleToolbarButton.SimpleToolbarButtonBehaviors)(SuperClass))
  );
};
/**
 * `hax-toolbar-item`
 * a button for hax toolbar
 *
 * @customElement
 * @extends HaxToolbarItemBehaviors
 * @extends LitElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */

exports.HaxToolbarItemBehaviors = HaxToolbarItemBehaviors;

var HaxToolbarItem =
  /*#__PURE__*/
  (function (_HaxToolbarItemBehavi) {
    _inherits(HaxToolbarItem, _HaxToolbarItemBehavi);

    function HaxToolbarItem() {
      _classCallCheck(this, HaxToolbarItem);

      return _possibleConstructorReturn(
        this,
        _getPrototypeOf(HaxToolbarItem).apply(this, arguments)
      );
    }

    return HaxToolbarItem;
  })(HaxToolbarItemBehaviors(_litElement.LitElement));

exports.HaxToolbarItem = HaxToolbarItem;
window.customElements.define(HaxToolbarItem.tag, HaxToolbarItem);

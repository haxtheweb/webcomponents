"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HAXTrayButton = void 0;

var _litElement = require("lit-element/lit-element.js");

var _simpleColors = require("@lrnwebcomponents/simple-colors/simple-colors.js");

require("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");

var _haxToolbarItem = require("@lrnwebcomponents/hax-body/lib/hax-toolbar-item.js");

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

/**
 * `hax-tray-button`
 * `A button in the tray`
 */
var HAXTrayButton =
  /*#__PURE__*/
  (function (_HaxToolbarItemBehavi) {
    _inherits(HAXTrayButton, _HaxToolbarItemBehavi);

    _createClass(HAXTrayButton, null, [
      {
        key: "tag",
        get: function get() {
          return "hax-tray-button";
        },
      },
    ]);

    function HAXTrayButton() {
      var _this;

      _classCallCheck(this, HAXTrayButton);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(HAXTrayButton).call(this)
      );
      _this.eventData = null;
      return _this;
    }

    _createClass(
      HAXTrayButton,
      [
        {
          key: "_voiceEvent",
          value: function _voiceEvent(e) {
            this._handleClick(e);

            this.click();
          },
          /**
           * Fire an event that includes the eventName of what was just pressed.
           */
        },
        {
          key: "_handleClick",
          value: function _handleClick(e) {
            console.log("hax-tray-button-click", e, {
              eventName: this.eventName,
              index: this.index,
              value: this.eventData,
            });
            this.dispatchEvent(
              new CustomEvent("hax-tray-button-click", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: {
                  eventName: this.eventName,
                  index: this.index,
                  value: this.eventData,
                },
              })
            );
          },
          /**
           * LitElement life cycle - properties changed
           */
        },
        {
          key: "updated",
          value: function updated(changedProperties) {
            var _this2 = this;

            if (
              _get(_getPrototypeOf(HAXTrayButton.prototype), "updated", this)
            ) {
              _get(
                _getPrototypeOf(HAXTrayButton.prototype),
                "updated",
                this
              ).call(this, changedProperties);
            }

            changedProperties.forEach(function (oldValue, propName) {
              if (propName == "voiceCommand") {
                _this2.dispatchEvent(
                  new CustomEvent("hax-add-voice-command", {
                    bubbles: true,
                    composed: true,
                    cancelable: false,
                    detail: {
                      command: ":name: " + _this2[propName],
                      context: _this2,
                      callback: "_voiceEvent",
                    },
                  })
                );
              }
            });
          },
        },
      ],
      [
        {
          key: "properties",
          get: function get() {
            return _objectSpread(
              {},
              _get(_getPrototypeOf(HAXTrayButton), "properties", this),
              {
                /**
                 * Voice command to append for things that support data-voicecommand.
                 */
                voiceCommand: {
                  type: String,
                  attribute: "voice-command",
                },
                wide: {
                  type: Boolean,
                  reflect: true,
                },

                /**
                 * Index position in the original list of imports
                 */
                index: {
                  type: Number,
                },
                eventData: {
                  type: String,
                  attribute: "event-data",
                },
              }
            );
          },
        },
      ]
    );

    return HAXTrayButton;
  })((0, _haxToolbarItem.HaxToolbarItemBehaviors)(_litElement.LitElement));

exports.HAXTrayButton = HAXTrayButton;
customElements.define(HAXTrayButton.tag, HAXTrayButton);

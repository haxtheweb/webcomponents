"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HaxCeContext = void 0;

var _litElement = require("lit-element/lit-element.js");

var _haxStore = require("./hax-store.js");

require("@lrnwebcomponents/hax-body/lib/hax-context-item.js");

require("@lrnwebcomponents/hax-body/lib/hax-button-menu.js");

require("@lrnwebcomponents/hax-body/lib/hax-button-menu-item.js");

var _haxToolbar = require("@lrnwebcomponents/hax-body/lib/hax-toolbar.js");

var _utils = require("@lrnwebcomponents/utils/utils");

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
  var data = _taggedTemplateLiteral([""]);

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
  var data = _taggedTemplateLiteral([
    ' <hax-context-item\n            action\n            icon="',
    '"\n            label="',
    '"\n            event-name="hax-ce-custom-button"\n            value="',
    '"\n          ></hax-context-item>',
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '\n      <div id="buttons">\n        <hax-context-item\n          action\n          more\n          icon="',
    '"\n          label="',
    ', click to change"\n          ?disabled="',
    '"\n          event-name="hax-transform-node"\n        ></hax-context-item>\n        ',
    '\n        <slot name="primary"></slot>\n        <hax-context-item\n          mini\n          action\n          icon="icons:code"\n          label="Modify HTML source"\n          ?disabled="',
    '"\n          event-name="hax-source-view-toggle"\n        ></hax-context-item>\n        <hax-button-menu icon="add" label="Insert item above or below">\n          <hax-button-menu-item slot="menuitem">\n            <hax-context-item\n              action\n              show-text-label\n              role="menuitem"\n              icon="hardware:keyboard-arrow-up"\n              event-name="insert-above-active"\n              label="Insert item above"\n            ></hax-context-item>\n          </hax-button-menu-item>\n          <hax-button-menu-item slot="menuitem">\n            <hax-context-item\n              action\n              show-text-label\n              role="menuitem"\n              icon="hardware:keyboard-arrow-down"\n              event-name="insert-below-active"\n              label="Insert item below"\n            ></hax-context-item>\n          </hax-button-menu-item>\n        </hax-button-menu>\n        <slot name="secondary"></slot>\n        <slot name="more"></slot>\n      </div>\n      ',
    "\n    ",
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
 * `hax-ce-context`
 * `A context menu that provides common custom-element based authoring options.
 * @microcopy - the mental model for this element
 * - context menu - this is a menu of custom-element based buttons and events for use in a larger solution.
 * @element hax-ce-context
 */
var HaxCeContext =
  /*#__PURE__*/
  (function (_HaxToolbarBehaviors) {
    _inherits(HaxCeContext, _HaxToolbarBehaviors);

    function HaxCeContext() {
      var _this;

      _classCallCheck(this, HaxCeContext);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(HaxCeContext).call(this)
      );
      _this.haxUIElement = true;
      _this.onScreen = false;
      _this.ceButtons = [];
      _this.activeTagName = "";
      _this.activeTagIcon = "hax:paragraph";

      _this.addEventListener(
        "hax-context-item-selected",
        _this.handleCECustomEvent.bind(_assertThisInitialized(_this))
      );

      return _this;
    }

    _createClass(
      HaxCeContext,
      [
        {
          key: "updated",
          value: function updated(changedProperties) {
            var _this2 = this;

            if (
              _get(_getPrototypeOf(HaxCeContext.prototype), "updated", this)
            ) {
              _get(
                _getPrototypeOf(HaxCeContext.prototype),
                "updated",
                this
              ).call(this, changedProperties);
            }

            changedProperties.forEach(function (oldValue, propName) {
              if (propName === "onScreen" && _this2.onScreen) {
                _this2._resetCEMenu();
              }
            });
          },
        },
        {
          key: "render",
          value: function render() {
            return (0, _litElement.html)(
              _templateObject(),
              this.activeTagIcon,
              this.activeTagName,
              this.disableTransform,
              this.ceButtons.map(function (el) {
                return (0,
                _litElement.html)(_templateObject2(), el.icon, el.label, el.callback);
              }),
              !this.sourceView,
              this.moreButton
            );
          },
        },
        {
          key: "handleCECustomEvent",
          value: function handleCECustomEvent(e) {
            var detail = e.detail; // support a simple insert event to bubble up or everything else

            switch (detail.eventName) {
              case "hax-ce-custom-button":
                if (
                  this.activeNode &&
                  typeof this.activeNode[detail.value] === "function"
                ) {
                  if (this.activeNode[detail.value](e)) {
                    _haxStore.HAXStore.refreshActiveNodeForm();
                  }
                }

                break;
            }
          },
        },
        {
          key: "firstUpdated",
          value: function firstUpdated(changedProperties) {
            var _this3 = this;

            if (
              _get(
                _getPrototypeOf(HaxCeContext.prototype),
                "firstUpdated",
                this
              )
            ) {
              _get(
                _getPrototypeOf(HaxCeContext.prototype),
                "firstUpdated",
                this
              ).call(this, changedProperties);
            }

            autorun(function () {
              _this3.activeNode = toJS(_haxStore.HAXStore.activeNode);

              if (_this3.activeNode && _this3.activeNode.classList) {
                _this3._resetCEMenu();
              }
            });
          },
          /**
           * HAX properties changed, update buttons available.
           */
        },
        {
          key: "_resetCEMenu",
          value: function _resetCEMenu() {
            if (this.shadowRoot) {
              (0, _utils.wipeSlot)(this, "*");
            } // reset buttons in-case this element has new ones

            this.ceButtons = [];

            if (_haxStore.HAXStore.activeHaxBody && this.activeNode != null) {
              var schema = _haxStore.HAXStore.haxSchemaFromTag(
                this.activeNode.tagName
              );

              this.sourceView = schema.canEditSource;

              if (!_haxStore.HAXStore.isTextElement(this.activeNode)) {
                // detect if this can be transformed into anything else
                this.disableTransform = !_haxStore.HAXStore.activeHaxBody.canTansformNode(
                  this.activeNode
                );

                if (_haxStore.HAXStore.activeGizmo) {
                  this.activeTagName = _haxStore.HAXStore.activeGizmo.title;
                  this.activeTagIcon = _haxStore.HAXStore.activeGizmo.icon;
                }
              }
            } else {
              this.activeTagName = "";
              this.activeTagIcon = "hax:paragraph";
            } // @see haxHook inlineContextMenu

            _haxStore.HAXStore.runHook(this.activeNode, "inlineContextMenu", [
              this,
            ]);
          },
        },
      ],
      [
        {
          key: "styles",
          get: function get() {
            return [].concat(
              _toConsumableArray(
                _get(_getPrototypeOf(HaxCeContext), "styles", this)
              ),
              [(0, _litElement.css)(_templateObject3())]
            );
          },
        },
        {
          key: "tag",
          get: function get() {
            return "hax-ce-context";
          },
        },
        {
          key: "properties",
          get: function get() {
            return _objectSpread(
              {},
              _get(_getPrototypeOf(HaxCeContext), "properties", this),
              {
                disableTransform: {
                  type: Boolean,
                },
                onScreen: {
                  type: Boolean,
                  attribute: "on-screen",
                  reflect: true,
                },
                sourceView: {
                  type: Boolean,
                },
                activeTagIcon: {
                  type: String,
                },
                activeTagName: {
                  type: String,
                },
                ceButtons: {
                  type: Array,
                },
              }
            );
          },
        },
      ]
    );

    return HaxCeContext;
  })((0, _haxToolbar.HaxToolbarBehaviors)(_litElement.LitElement));

exports.HaxCeContext = HaxCeContext;
window.customElements.define(HaxCeContext.tag, HaxCeContext);

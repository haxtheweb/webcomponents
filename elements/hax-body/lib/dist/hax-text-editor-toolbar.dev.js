"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HaxTextEditorToolbar = void 0;

var _litElement = require("lit-element");

var _richTextEditorToolbar = require("@lrnwebcomponents/rich-text-editor/lib/toolbars/rich-text-editor-toolbar.js");

var _haxTextEditorButton = require("./hax-text-editor-button.js");

var _haxStore = require("./hax-store.js");

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
 * `hax-text-editor-toolbar`
 * `A customized toolbar (with buttons) for HAX`
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
var HaxTextEditorToolbar =
  /*#__PURE__*/
  (function (_RichTextEditorToolba) {
    _inherits(HaxTextEditorToolbar, _RichTextEditorToolba);

    _createClass(
      HaxTextEditorToolbar,
      [
        {
          key: "render",
          // render function
          value: function render() {
            return _get(
              _getPrototypeOf(HaxTextEditorToolbar.prototype),
              "miniTemplate",
              this
            );
          }, // properties available to the custom element for data binding
        },
        {
          key: "tag",

          /**
           * Store the tag name to make it easier to obtain directly.
           * @notice function name must be here for tooling to operate correctly
           */
          value: function tag() {
            return "hax-text-editor-toolbar";
          }, // life cycle
        },
      ],
      [
        {
          key: "styles",
          //styles function
          get: function get() {
            return [
              _get(_getPrototypeOf(HaxTextEditorToolbar), "baseStyles", this),
              _get(_getPrototypeOf(HaxTextEditorToolbar), "miniStyles", this),
            ];
          },
        },
        {
          key: "properties",
          get: function get() {
            return _objectSpread(
              {},
              _get(_getPrototypeOf(HaxTextEditorToolbar), "properties", this),
              {
                __registeredElements: {
                  type: Object,
                },
                __updated: {
                  type: Boolean,
                },
              }
            );
          },
        },
      ]
    );

    function HaxTextEditorToolbar() {
      var _this;

      _classCallCheck(this, HaxTextEditorToolbar);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(HaxTextEditorToolbar).call(this)
      );
      _this.tag = HaxTextEditorToolbar.tag;
      _this.sticky = false;
      _this.config = _this.defaultConfig;
      _this.__registeredElements = [];
      _this.__updated = false;
      return _this;
    }

    _createClass(HaxTextEditorToolbar, [
      {
        key: "firstUpdated",
        value: function firstUpdated(changedProperties) {
          if (
            _get(
              _getPrototypeOf(HaxTextEditorToolbar.prototype),
              "firstUpdated",
              this
            )
          )
            _get(
              _getPrototypeOf(HaxTextEditorToolbar.prototype),
              "firstUpdated",
              this
            ).call(this, changedProperties);
          this.config = this.updateToolbarElements();
          window.addEventListener(
            "hax-store-ready",
            this._handleHaxStoreReady.bind(this)
          );
          window.addEventListener(
            "hax-register-properties",
            this._handleElementRegister.bind(this)
          );
        },
      },
      {
        key: "_handleElementRegister",
        value: function _handleElementRegister(e) {
          var detail = e.detail || {},
            tag = detail.tag || {},
            props = detail.properties || {};

          this._setInlineElement(tag, props);
        },
      },
      {
        key: "_handleHaxStoreReady",
        value: function _handleHaxStoreReady(e) {
          var _this2 = this;

          var elements = _haxStore.HAXStore.elementList || {},
            keys = Object.keys(elements);
          keys.forEach(function (key) {
            return _this2._setInlineElement(key, elemets[key]);
          });
        },
      },
      {
        key: "_setInlineElement",
        value: function _setInlineElement(tag, props) {
          if (
            !tag ||
            !props ||
            !!this.__registeredElements[tag] ||
            tag.indexOf("-") < 0
          )
            return;
          var gizmo = props.gizmo || {},
            handles = gizmo.handles || [],
            inline = handles.filter(function (handle) {
              return handle.type === "inline";
            });

          if (inline.length > 0) {
            this.__registeredElements[tag] = {
              element: props,
              type: "hax-text-editor-button",
            };
            this.__updated = false;
            setTimeout(this.updateToolbarElements.bind(this), 500);
          }
        },
      },
      {
        key: "updateToolbarElements",
        value: function updateToolbarElements() {
          var _this3 = this;

          if (this.__updated) return;
          this.__updated = true;
          var buttons = Object.keys(this.__registeredElements || {}).map(
            function (key) {
              return _this3.__registeredElements[key];
            }
          );
          this.config = [].concat(_toConsumableArray(this.defaultConfig), [
            {
              type: "button-group",
              buttons: buttons,
            },
            this.sourceButtonGroup,
          ]);
          this.updateToolbar();
        },
      },
      {
        key: "defaultConfig",
        get: function get() {
          return [
            this.basicInlineButtonGroup,
            this.linkButtonGroup,
            this.scriptButtonGroup,
            this.listIndentButtonGroup,
          ];
        },
      },
    ]);

    return HaxTextEditorToolbar;
  })(
    (0, _richTextEditorToolbar.RichTextEditorToolbarBehaviors)(
      _litElement.LitElement
    )
  );

exports.HaxTextEditorToolbar = HaxTextEditorToolbar;
customElements.define("hax-text-editor-toolbar", HaxTextEditorToolbar);

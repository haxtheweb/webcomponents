"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.RichTextEditorLink = void 0;

var _litElement = require("lit-element/lit-element.js");

var _richTextEditorPromptButton = require("./rich-text-editor-prompt-button.js");

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
 * `rich-text-editor-link`
 * a link button for rich text editor
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @extends RichTextEditorPromptButtonBehaviors
 * @extends LitElement
 * @element rich-text-editor-link
 * @demo ./demo/buttons.html
 */
var RichTextEditorLink =
  /*#__PURE__*/
  (function (_RichTextEditorPrompt) {
    _inherits(RichTextEditorLink, _RichTextEditorPrompt);

    _createClass(
      RichTextEditorLink,
      [
        {
          key: "render",
          // render function for template
          value: function render() {
            return _get(
              _getPrototypeOf(RichTextEditorLink.prototype),
              "render",
              this
            ).call(this);
          }, // properties available to the custom element for data binding
        },
      ],
      [
        {
          key: "tag",

          /**
           * Store the tag name to make it easier to obtain directly.
           */
          get: function get() {
            return "rich-text-editor-link";
          },
        },
        {
          key: "properties",
          get: function get() {
            return _objectSpread(
              {},
              _get(_getPrototypeOf(RichTextEditorLink), "properties", this),
              {
                /**
                 * allow user to set a target attribute for link
                 */
                allowTarget: {
                  type: Boolean,
                },
              }
            );
          },
        },
      ]
    );

    function RichTextEditorLink() {
      var _this;

      _classCallCheck(this, RichTextEditorLink);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(RichTextEditorLink).call(this)
      );
      _this.fields = [].concat(
        _toConsumableArray(
          _get(
            _getPrototypeOf(RichTextEditorLink.prototype),
            "fields",
            _assertThisInitialized(_this)
          )
        ),
        [
          {
            property: "href",
            title: "Link",
            inputMethod: "url",
            autoValidate: true,
          },
        ]
      );
      _this.command = "createLink";
      _this.icon = "link";
      _this.label = "Link";
      _this.toggledCommand = "unlink";
      _this.toggledIcon = "mdextra:unlink";
      _this.toggledLabel = "Unlink";
      _this.toggles = "true";
      _this.tagsList = "a";
      _this.value = _objectSpread(
        {},
        _get(
          _getPrototypeOf(RichTextEditorLink.prototype),
          "value",
          _assertThisInitialized(_this)
        ),
        {
          href: null,
        }
      );
      _this.shortcutKeys = "ctrl+k";
      return _this;
    }

    _createClass(RichTextEditorLink, [
      {
        key: "updated",
        value: function updated(changedProperties) {
          var _this2 = this;

          if (
            _get(_getPrototypeOf(RichTextEditorLink.prototype), "updated", this)
          )
            _get(
              _getPrototypeOf(RichTextEditorLink.prototype),
              "updated",
              this
            ).call(this, changedProperties);
          changedProperties.forEach(function (oldValue, propName) {
            if (propName === "allowTarget") {
              var fields = [].concat(
                _toConsumableArray(
                  _get(
                    _getPrototypeOf(RichTextEditorLink.prototype),
                    "fields",
                    _this2
                  )
                ),
                [
                  {
                    property: "href",
                    title: "Link",
                    inputMethod: "url",
                    autoValidate: true,
                  },
                ]
              );
              _this2.fields = _this2.allowTarget
                ? _objectSpread({}, fields)
                : _objectSpread({}, fields, {
                    allowTarget: {
                      property: "target",
                      title: "Target",
                      inputMethod: "textfield",
                    },
                  });
            }
          });
        },
        /**
         * overrides RichTextEditorPickerBehaviors
         * so that href property determines
         * whether or not to link or unlink
         *
         * @readonly
         * @memberof RichTextEditorLink
         */
      },
      {
        key: "getValue",

        /**
         * overrides RichTextEditorPickerBehaviors
         * to customize for getting link innerHTML & href properties
         *
         * @param {object} node selected node
         * @memberof RichTextEditorLink
         */
        value: function getValue(node) {
          var target = node || this.rangeElement();
          return _objectSpread(
            {},
            _get(
              _getPrototypeOf(RichTextEditorLink.prototype),
              "getValue",
              this
            ).call(this),
            {
              target:
                this.allowTarget && target.getAttribute
                  ? target.getAttribute("target")
                  : undefined,
              href:
                target && target.getAttribute
                  ? target.getAttribute("href")
                  : undefined,
            }
          );
        },
        /**
         * overrides RichTextEditorPickerBehaviors
         * sets toggle based on whether the selected node has a href
         *
         * @memberof RichTextEditorLink
         */
      },
      {
        key: "setToggled",
        value: function setToggled() {
          this.toggled = !!this.getPropValue("href");
        },
      },
      {
        key: "promptCommandVal",
        get: function get() {
          return this.getPropValue("href") || undefined;
        },
        /**
         * overrides RichTextEditorPickerBehaviors
         * so that isToggled is based on toggled property
         *
         * @readonly
         * @memberof RichTextEditorLink
         */
      },
      {
        key: "isToggled",
        get: function get() {
          return this.toggled;
        },
      },
    ]);

    return RichTextEditorLink;
  })(
    (0, _richTextEditorPromptButton.RichTextEditorPromptButtonBehaviors)(
      _litElement.LitElement
    )
  );

exports.RichTextEditorLink = RichTextEditorLink;
window.customElements.define(RichTextEditorLink.tag, RichTextEditorLink);

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.RichTextEditorEmojiPicker = void 0;

var _litElement = require("lit-element/lit-element.js");

var _richTextEditorPicker = require("./rich-text-editor-picker.js");

require("@lrnwebcomponents/simple-picker/lib/simple-emoji-picker.js");

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
  var data = _taggedTemplateLiteral([""]);

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
    '\n      <label id="listLabel" for="button"> ',
    ' </label>\n      <simple-emoji-picker\n        id="button"\n        id="button"\n        ?allow-null="',
    '"\n        aria-labeledby="listlabel"\n        controls="',
    '"\n        ?disabled="',
    '"\n        .emoji-types="',
    '"\n        @keydown="',
    '"\n        label=""\n        @mouseover="',
    '"\n        tabindex="0"\n        title-as-html\n        ?toggled="',
    '"\n        @value-changed="',
    '"\n      >\n      </simple-emoji-picker>\n      ',
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
 * `rich-text-editor-emoji-picker`
 * an emoji picker for the rich-text-editor
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @extends RichTextEditorPickerBehaviors
 * @extends LitElement
 * @element rich-text-editor-emoji-picker
 * @demo ./demo/buttons.html
 */
var RichTextEditorEmojiPicker =
  /*#__PURE__*/
  (function (_RichTextEditorPicker) {
    _inherits(RichTextEditorEmojiPicker, _RichTextEditorPicker);

    _createClass(
      RichTextEditorEmojiPicker,
      [
        {
          key: "render",
          // render function for template
          // render function for template
          value: function render() {
            return (0, _litElement.html)(
              _templateObject(),
              this.labelTemplate,
              this.allowNull,
              _get(
                _getPrototypeOf(RichTextEditorEmojiPicker.prototype),
                "controls",
                this
              ),
              this.disabled,
              this.emojiTypes,
              this._pickerFocus,
              this._pickerFocus,
              this.toggled,
              this._pickerChange,
              _get(
                _getPrototypeOf(RichTextEditorEmojiPicker.prototype),
                "tooltipTemplate",
                this
              )
            );
          }, // properties available to the custom element for data binding
        },
      ],
      [
        {
          key: "tag",

          /**
           * Store the tag name to make it easier to obtain directly.
           *
           */
          get: function get() {
            return "rich-text-editor-emoji-picker";
          },
        },
        {
          key: "styles",
          get: function get() {
            return [].concat(
              _toConsumableArray(
                _get(_getPrototypeOf(RichTextEditorEmojiPicker), "styles", this)
              ),
              [(0, _litElement.css)(_templateObject2())]
            );
          },
        },
        {
          key: "properties",
          get: function get() {
            return _objectSpread(
              {},
              _get(
                _getPrototypeOf(RichTextEditorEmojiPicker),
                "properties",
                this
              ),
              {
                /**
                 * Emoji types types to include
                 */
                emojiTypes: {
                  name: "emojiTypes",
                  type: Array,
                  attribute: "emoji-types",
                },
              }
            );
          },
        },
      ]
    );

    function RichTextEditorEmojiPicker() {
      var _this;

      _classCallCheck(this, RichTextEditorEmojiPicker);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(RichTextEditorEmojiPicker).call(this)
      );
      _this.emojiTypes = [
        "emotions",
        "people",
        "nature",
        "food",
        "travel",
        "activities",
        "objects",
        "symbols",
        "flags",
      ];
      _this.icon = "editor:insert-emoticon";
      _this.label = "Insert emoji";
      _this.command = "insertHTML";
      return _this;
    }

    _createClass(RichTextEditorEmojiPicker, [
      {
        key: "updated",
        value: function updated(changedProperties) {
          var _this2 = this;

          _get(
            _getPrototypeOf(RichTextEditorEmojiPicker.prototype),
            "updated",
            this
          ).call(this, changedProperties);

          changedProperties.forEach(function (oldValue, propName) {
            if (propName === "titleAsHtml" && !_this2.titleAsHtml)
              _this2.titleAsHtml = true;
          });
        },
        /**
         * overrides RichTextEditorPickerBehaviors
         * since simple-symbol-picker already handles options
         *
         * @memberof RichTextEditorSymbolPicker
         */
      },
      {
        key: "_setOptions",
        value: function _setOptions() {},
      },
    ]);

    return RichTextEditorEmojiPicker;
  })(
    (0, _richTextEditorPicker.RichTextEditorPickerBehaviors)(
      _litElement.LitElement
    )
  );

exports.RichTextEditorEmojiPicker = RichTextEditorEmojiPicker;
window.customElements.define(
  RichTextEditorEmojiPicker.tag,
  RichTextEditorEmojiPicker
);

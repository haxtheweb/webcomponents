"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.RichTextEditorHeadingPicker = void 0;

var _litElement = require("lit-element/lit-element.js");

var _richTextEditorPicker = require("./rich-text-editor-picker.js");

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
 * `rich-text-editor-heading-picker`
 * a heading picker for the rich-text-editor
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @extends RichTextEditorPickerBehaviors
 * @extends LitElement
 * @element rich-text-editor-heading-picker
 * @demo ./demo/buttons.html
 */
var RichTextEditorHeadingPicker =
  /*#__PURE__*/
  (function (_RichTextEditorPicker) {
    _inherits(RichTextEditorHeadingPicker, _RichTextEditorPicker);

    _createClass(
      RichTextEditorHeadingPicker,
      [
        {
          key: "render",
          // render function for template
          value: function render() {
            return _get(
              _getPrototypeOf(RichTextEditorHeadingPicker.prototype),
              "render",
              this
            ).call(this);
          },
        },
      ],
      [
        {
          key: "tag",

          /**
           * Store the tag name to make it easier to obtain directly.
           */
          get: function get() {
            return "rich-text-editor-heading-picker";
          },
        },
        {
          key: "styles",
          get: function get() {
            return _toConsumableArray(
              _get(_getPrototypeOf(RichTextEditorHeadingPicker), "styles", this)
            );
          },
        },
      ]
    );

    function RichTextEditorHeadingPicker() {
      var _this;

      _classCallCheck(this, RichTextEditorHeadingPicker);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(RichTextEditorHeadingPicker).call(this)
      );
      _this.allowNull = true;
      _this.blocks = [
        {
          label: "Paragraph",
          tag: "p",
        },
        {
          label: "Heading 1",
          tag: "h1",
        },
        {
          label: "Heading 2",
          tag: "h2",
        },
        {
          label: "Heading 3",
          tag: "h3",
        },
        {
          label: "Heading 4",
          tag: "h4",
        },
        {
          label: "Heading 5",
          tag: "h5",
        },
        {
          label: "Heading 6",
          tag: "h6",
        },
        {
          label: "Preformatted",
          tag: "pre",
        },
      ];
      _this.command = "formatBlock";
      _this.icon = null;
      _this.label = "Block format";
      _this.tagsList = "p,h1,h2,h3,h4,h5,h6,div,address,blockquote,pre";
      return _this;
    } // properties available to the custom element for data binding

    _createClass(
      RichTextEditorHeadingPicker,
      [
        {
          key: "_setOptions",

          /**
           * overrides RichTextEditorPickerBehaviors
           * to populate picker with allowable blocks
           *
           * @memberof RichTextEditorHeadingPicker
           */
          value: function _setOptions() {
            this.tagsList = this.blocks
              .map(function (block) {
                return block.tag;
              })
              .join(",");
            this.options = [
              [
                {
                  alt: this.label,
                  value: null,
                },
              ],
            ].concat(
              _toConsumableArray(
                this.blocks.map(function (block) {
                  return [
                    {
                      alt: block.label,
                      value: block.tag,
                    },
                  ];
                })
              )
            );
          },
        },
      ],
      [
        {
          key: "properties",
          get: function get() {
            var props = _get(
              _getPrototypeOf(RichTextEditorHeadingPicker),
              "properties",
              this
            );

            delete props.block;
            return _objectSpread({}, props, {
              /**
               * block element options as array of objects,
               * eg. [ { label: "Paragraph", tag: "p" }, { label: "Heading 1", tag: "h1" }, ...]
               *
               */
              blocks: {
                name: "blocks",
                type: Array,
              },
            });
          },
        },
      ]
    );

    return RichTextEditorHeadingPicker;
  })(
    (0, _richTextEditorPicker.RichTextEditorPickerBehaviors)(
      _litElement.LitElement
    )
  );

exports.RichTextEditorHeadingPicker = RichTextEditorHeadingPicker;
window.customElements.define(
  RichTextEditorHeadingPicker.tag,
  RichTextEditorHeadingPicker
);

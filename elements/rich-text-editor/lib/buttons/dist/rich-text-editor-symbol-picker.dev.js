"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.RichTextEditorSymbolPicker = void 0;

var _litElement = require("lit-element/lit-element.js");

var _richTextEditorPicker = require("./rich-text-editor-picker.js");

require("@lrnwebcomponents/simple-picker/lib/simple-symbol-picker.js");

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

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '\n      <label id="listLabel" for="button"> ',
    ' </label>\n      <simple-symbol-picker\n        id="button"\n        ?allow-null="',
    '"\n        aria-labeledby="listlabel"\n        controls="',
    '"\n        ?disabled="',
    '"\n        @keydown="',
    '"\n        label=""\n        @mouseover="',
    '"\n        .symbol-types="',
    '"\n        tabindex="0"\n        title-as-html\n        ?toggled="',
    '"\n        @value-changed="',
    '"\n      >\n      </simple-symbol-picker>\n      ',
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
 * `rich-text-editor-symbol-picker`
 * a symbol picker for the rich-text-editor
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @extends RichTextEditorPickerBehaviors
 * @extends LitElement
 * @element rich-text-editor-symbol-picker
 * @demo ./demo/buttons.html
 */
var RichTextEditorSymbolPicker =
  /*#__PURE__*/
  (function (_RichTextEditorPicker) {
    _inherits(RichTextEditorSymbolPicker, _RichTextEditorPicker);

    _createClass(
      RichTextEditorSymbolPicker,
      [
        {
          key: "render",
          // render function for template
          value: function render() {
            return (0, _litElement.html)(
              _templateObject(),
              this.labelTemplate,
              this.allowNull,
              _get(
                _getPrototypeOf(RichTextEditorSymbolPicker.prototype),
                "controls",
                this
              ),
              this.disabled,
              this._pickerFocus,
              this._pickerFocus,
              this.symbolTypes,
              this.toggled,
              this._pickerChange,
              _get(
                _getPrototypeOf(RichTextEditorSymbolPicker.prototype),
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
            return "rich-text-editor-symbol-picker";
          },
        },
        {
          key: "properties",
          get: function get() {
            return _objectSpread(
              {},
              _get(
                _getPrototypeOf(RichTextEditorSymbolPicker),
                "properties",
                this
              ),
              {
                /**
                 * Symbol types to include
                 */
                symbolTypes: {
                  name: "symbolTypes",
                  type: Array,
                  attribute: "symbol-types",
                },
              }
            );
          },
        },
      ]
    );

    function RichTextEditorSymbolPicker() {
      var _this;

      _classCallCheck(this, RichTextEditorSymbolPicker);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(RichTextEditorSymbolPicker).call(this)
      );
      _this.icon = "editor:functions";
      _this.label = "Insert symbol";
      _this.symbolTypes = ["symbols", "math", "characters", "greek", "misc"];
      _this.command = "insertHTML";
      return _this;
    }
    /**
     * overrides RichTextEditorPickerBehaviors
     * since simple-symbol-picker already handles options
     *
     * @memberof RichTextEditorSymbolPicker
     */

    _createClass(RichTextEditorSymbolPicker, [
      {
        key: "_setOptions",
        value: function _setOptions() {},
      },
    ]);

    return RichTextEditorSymbolPicker;
  })(
    (0, _richTextEditorPicker.RichTextEditorPickerBehaviors)(
      _litElement.LitElement
    )
  );

exports.RichTextEditorSymbolPicker = RichTextEditorSymbolPicker;
window.customElements.define(
  RichTextEditorSymbolPicker.tag,
  RichTextEditorSymbolPicker
);

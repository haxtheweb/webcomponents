"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.RichTextEditorIconPicker = void 0;

var _litElement = require("lit-element/lit-element.js");

var _richTextEditorPicker = require("./rich-text-editor-picker.js");

var _simpleIconPicker = require("@lrnwebcomponents/simple-icon-picker/simple-icon-picker.js");

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
  var data = _taggedTemplateLiteral([
    "\n        #button.show-label::part(label) {\n          padding: 0;\n          margin-right: 0;\n          margin-left: 4px;\n        }\n        #button.show-label::part(sample) {\n          min-height: var(--simple-picker-option-size, 24px);\n          margin-left: calc(-0.125 * var(--simple-picker-icon-size, 16px));\n        }\n        #button.show-label::part(sample-option) {\n          display: none;\n        }\n      ",
  ]);

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
    '\n      <simple-icon-picker\n        id="button"\n        ?allow-null="',
    '"\n        class="rtebutton ',
    "-label ",
    '"\n        .controls="',
    '"\n        ?disabled="',
    '"\n        .icons="',
    '"\n        .excludes="',
    '"\n        .includeSets="',
    '"\n        .excludeSets="',
    '"\n        @keydown="',
    '"\n        .label="',
    '"\n        @mouseover="',
    '"\n        tabindex="0"\n        ?toggled="',
    '"\n        @value-changed="',
    '"\n      >\n      </simple-icon-picker>\n      ',
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
 * `rich-text-editor-icon-picker`
 * an icon picker for the rich-text-editor
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @extends RichTextEditorPickerBehaviors
 * @extends LitElement
 * @element rich-text-editor-icon-picker
 * @demo ./demo/buttons.html
 */
var RichTextEditorIconPicker =
  /*#__PURE__*/
  (function (_RichTextEditorPicker) {
    _inherits(RichTextEditorIconPicker, _RichTextEditorPicker);

    _createClass(
      RichTextEditorIconPicker,
      [
        {
          key: "render",
          // render function for template
          // render function for template
          value: function render() {
            return (0, _litElement.html)(
              _templateObject(),
              this.allowNull,
              this.labelVisibleClass,
              this.toggled ? "toggled" : "",
              _get(
                _getPrototypeOf(RichTextEditorIconPicker.prototype),
                "controls",
                this
              ),
              this.disabled,
              this.icons,
              this.excludes,
              this.includeSets,
              this.excludeSets,
              this._pickerFocus,
              this.currentLabel,
              this._pickerFocus,
              this.toggled,
              this._pickerChange,
              _get(
                _getPrototypeOf(RichTextEditorIconPicker.prototype),
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
            return "rich-text-editor-icon-picker";
          },
        },
        {
          key: "styles",
          get: function get() {
            return [].concat(
              _toConsumableArray(
                _get(_getPrototypeOf(RichTextEditorIconPicker), "styles", this)
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
                _getPrototypeOf(RichTextEditorIconPicker),
                "properties",
                this
              ),
              {},
              _simpleIconPicker.SimpleIconPicker.properties
            );
          },
        },
      ]
    );

    function RichTextEditorIconPicker() {
      var _this;

      _classCallCheck(this, RichTextEditorIconPicker);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(RichTextEditorIconPicker).call(this)
      );
      _this.icon = undefined;
      _this.icons = [];
      _this.excludes = [];
      _this.includeSets = [];
      _this.excludeSets = [];
      _this.label = "Insert icon";
      _this.command = "insertHTML";
      _this.tagsList = "simple-icon-lite";
      return _this;
    }
    /**
     * Picker change
     */

    _createClass(RichTextEditorIconPicker, [
      {
        key: "_pickerChange",
        value: function _pickerChange(e) {
          var val = this._getSelectionType() || "",
            parent = this.__highlight.parentNode;
          this.commandVal = e.detail.value
            ? '<simple-icon-lite icon="'.concat(
                e.detail.value,
                '"></simple-icon-lite>'
              )
            : "";
          /* only update when there is an actual change */

          if (this.range && val !== this.commandVal) {
            this.sendCommand();
          }
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

    return RichTextEditorIconPicker;
  })(
    (0, _richTextEditorPicker.RichTextEditorPickerBehaviors)(
      _litElement.LitElement
    )
  );

exports.RichTextEditorIconPicker = RichTextEditorIconPicker;
window.customElements.define(
  RichTextEditorIconPicker.tag,
  RichTextEditorIconPicker
);

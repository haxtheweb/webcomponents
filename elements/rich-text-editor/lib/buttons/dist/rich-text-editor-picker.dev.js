"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.RichTextEditorPickerBehaviors = exports.RichTextEditorPicker = void 0;

var _litElement = require("lit-element/lit-element.js");

var _richTextEditorButton = require("./rich-text-editor-button.js");

require("@lrnwebcomponents/simple-picker/simple-picker.js");

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
    "\n          :host {\n            --simple-picker-background-color: var(--simple-toolbar-button-bg);\n            --simple-picker-color-active: var(\n              --simple-toolbar-button-hover-color\n            );\n            --simple-picker-background-color-active: var(\n              --simple-toolbar-button-hover-bg\n            );\n            --simple-picker-color-disabled: var(\n              --simple-toolbar-button-disabled-color\n            );\n            --simple-picker-background-color-disabled: var(\n              --simple-toolbar-button-disabled-bg\n            );\n            --simple-picker-border-radius: 0px;\n            --simple-picker-border-width: 0px;\n            --simple-picker-option-size: calc(\n              24px - 2 * var(--simple-picker-sample-padding, 2px)\n            );\n            --simple-picker-icon-size: 16px;\n            --simple-picker-options-border-width: 1px;\n          }\n          #button {\n            margin-top: 0;\n            margin-bottom: 0;\n          }\n        ",
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
    '\n        <simple-picker\n          id="button"\n          ?allow-null="',
    '"\n          class="rtebutton ',
    '"\n          ?disabled="',
    '"\n          controls="',
    '"\n          .options="',
    '"\n          @mouseover="',
    '"\n          @keydown="',
    '"\n          @value-changed="',
    '"\n          tabindex="0"\n          ?title-as-html="',
    '"\n        >\n          ',
    "\n        </simple-picker>\n        ",
    "\n      ",
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
 * RichTextEditorPickerBehaviors
 *
 * @customElement
 * @class
 * @lit-html
 * @lit-element
 * @extends RichTextEditorButtonBehaviors
 */
var RichTextEditorPickerBehaviors = function RichTextEditorPickerBehaviors(
  SuperClass
) {
  return (
    /*#__PURE__*/
    (function (_RichTextEditorButton) {
      _inherits(_class, _RichTextEditorButton);

      _createClass(
        _class,
        [
          {
            key: "render",
            value: function render() {
              return (0, _litElement.html)(
                _templateObject(),
                this.allowNull,
                this.toggled ? "toggled" : "",
                this.disabled,
                _get(_getPrototypeOf(_class.prototype), "controls", this),
                this.options,
                this._pickerFocus,
                this._pickerFocus,
                this._pickerChange,
                this.titleAsHtml,
                _get(_getPrototypeOf(_class.prototype), "labelTemplate", this),
                _get(_getPrototypeOf(_class.prototype), "tooltopTemplate", this)
              );
            },
          },
        ],
        [
          {
            key: "tag",

            /**
             * Store tag name to make it easier to obtain directly.
             */
            get: function get() {
              return "rich-text-editor-picker";
            },
          },
          {
            key: "styles",
            get: function get() {
              return [].concat(
                _toConsumableArray(
                  _get(_getPrototypeOf(_class), "styles", this)
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
                _get(_getPrototypeOf(_class), "properties", this),
                {
                  /**
                   * Allow a null option to be selected?
                   */
                  allowNull: {
                    type: Boolean,
                  },

                  /**
                   * command used for document.execCommand.
                   */
                  command: {
                    type: String,
                  },

                  /**
                   * Optional icon for null value
                   */
                  icon: {
                    type: String,
                  },

                  /**
                   * Renders html as title. (Good for titles with HTML in them.)
                   */
                  titleAsHtml: {
                    type: Boolean,
                  },

                  /**
                   * value of elected options
                   */
                  value: {
                    type: Object,
                  },
                }
              );
            },
          },
        ]
      );

      function _class() {
        var _this;

        _classCallCheck(this, _class);

        _this = _possibleConstructorReturn(
          this,
          _getPrototypeOf(_class).call(this)
        );
        _this.allowNull = false;
        _this.command = "insertHTML";
        _this.label = "Insert link";
        _this.titleAsHtml = false;
        _this.value = null;
        return _this;
      }

      _createClass(_class, [
        {
          key: "firstUpdated",
          value: function firstUpdated(changedProperties) {
            _get(_getPrototypeOf(_class.prototype), "firstUpdated", this).call(
              this,
              changedProperties
            );

            this._setOptions();
          },
          /**
           * overrides RichTextEditorButtonBehaviors
           * toggle button behaviors
           *
           * @param {object} text selected range
           * @returns {boolean} whether button is toggled
           *
           */
        },
        {
          key: "_pickerFocus",

          /**
           * handles picker focus
           * @param {event} e the button tap event
           */
          value: function _pickerFocus(e) {
            e.preventDefault();
          },
          /**
           * handles range changes by getting
           */
        },
        {
          key: "_rangeChanged",
          value: function _rangeChanged() {
            var val = this._getSelection();

            if (this.shadowRoot) {
              if (this.tagsArray.includes(val)) {
                this.shadowRoot.querySelector("#button").value = val;
              } else if (!this.range || this.range.collapsed) {
                this.shadowRoot.querySelector("#button").value = null;
              }
            }

            _get(_getPrototypeOf(_class.prototype), "_rangeChanged", this).call(
              this
            );
          },
          /**
           * override to handle custom options
           */
        },
        {
          key: "_setOptions",
          value: function _setOptions() {
            return (this.options = this._setPickerOptions());
          },
          /**
           * gets a list of icons and load them in a format
           * that simple-picker can take;
           * if no icons are provided, loads a list from iron-meta
           *
           * @param {array} a list of custom icons for picker
           * @returns {array}
           */
        },
        {
          key: "_setPickerOptions",
          value: function _setPickerOptions() {
            var options =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : this.options || [];
            var items = [],
              cols =
                Math.sqrt(options.length) < 11
                  ? Math.ceil(Math.sqrt(options.length))
                  : 10;
            options.forEach(function (option, i) {
              var row = Math.floor(i / cols),
                col = i - row * cols;
              if (!items[row]) items[row] = [];
              items[row][col] = option;
            });
            return items;
          },
          /**
           * Picker change
           */
        },
        {
          key: "_pickerChange",
          value: function _pickerChange(e) {
            var val = this._getSelectionType() || "";
            this.commandVal = e.detail.value || "";
            /* only update when there is an actual change */

            if (this.range && val !== this.commandVal) {
              this.sendCommand();
            }
          },
        },
        {
          key: "isToggled",
          get: function get() {
            return false;
          },
        },
      ]);

      return _class;
    })((0, _richTextEditorButton.RichTextEditorButtonBehaviors)(SuperClass))
  );
};
/**
 * `rich-text-editor-picker`
 * a picker for rich text editor (custom buttons can RichTextEditorPickerBehaviors)
 *
 * @extends RichTextEditorPickerBehaviors
 * @extends LitElement
 * @customElement
 * @lit-html
 * @lit-element
 * @element rich-text-editor-picker
 * @demo ./demo/buttons.html
 */

exports.RichTextEditorPickerBehaviors = RichTextEditorPickerBehaviors;

var RichTextEditorPicker =
  /*#__PURE__*/
  (function (_RichTextEditorPicker) {
    _inherits(RichTextEditorPicker, _RichTextEditorPicker);

    function RichTextEditorPicker() {
      _classCallCheck(this, RichTextEditorPicker);

      return _possibleConstructorReturn(
        this,
        _getPrototypeOf(RichTextEditorPicker).apply(this, arguments)
      );
    }

    return RichTextEditorPicker;
  })(RichTextEditorPickerBehaviors(_litElement.LitElement));

exports.RichTextEditorPicker = RichTextEditorPicker;
window.customElements.define(RichTextEditorPicker.tag, RichTextEditorPicker);

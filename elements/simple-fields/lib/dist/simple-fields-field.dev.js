"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimpleFieldsField = void 0;

var _litElement = require("lit-element/lit-element.js");

var _simpleFieldsContainer = require("./simple-fields-container.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icons.js");

require("@lrnwebcomponents/simple-icon/simple-icon.js");

function _templateObject10() {
  var data = _taggedTemplateLiteral([
    '\n      <textarea\n        aria-invalid="',
    '"\n        ?autofocus="',
    '"\n        @blur="',
    '"\n        class="field box-input"\n        @change="',
    '"\n        @keydown="',
    '"\n        ?disabled="',
    '"\n        @focus="',
    '"\n        ?hidden="',
    '"\n        id="',
    '"\n        @input="',
    '"\n        name="',
    '"\n        ?readonly="',
    '"\n        ?required="',
    '"\n        rows="1"\n        tabindex="0"\n        part="textarea"\n      >\n',
    "</textarea\n      >\n    ",
  ]);

  _templateObject10 = function _templateObject10() {
    return data;
  };

  return data;
}

function _templateObject9() {
  var data = _taggedTemplateLiteral([
    '\n            <option\n              part="select-option"\n              .id="',
    ".",
    '"\n              ?selected="',
    '"\n              .value="',
    '"\n            >\n              ',
    "\n            </option>\n          ",
  ]);

  _templateObject9 = function _templateObject9() {
    return data;
  };

  return data;
}

function _templateObject8() {
  var data = _taggedTemplateLiteral([
    '\n      <select\n        ?autofocus="',
    '"\n        aria-descrbedby="',
    '"\n        aria-invalid="',
    '"\n        @blur="',
    '"\n        @change="',
    '"\n        class="field"\n        ?disabled="',
    '"\n        @focus="',
    '"\n        ?hidden="',
    '"\n        id="',
    '"\n        ?multiple="',
    '"\n        name="',
    '"\n        ?readonly="',
    '"\n        ?required="',
    '"\n        tabindex="0"\n        part="select"\n      >\n        ',
    '\n      </select>\n      <simple-icon-lite icon="arrow-drop-down"></simple-icon-lite>\n    ',
  ]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

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

function _templateObject7() {
  var data = _taggedTemplateLiteral([
    '\n              <div class="option inline" part="option">\n                <label\n                  for="',
    ".",
    '"\n                  class="radio-label"\n                  part="option-label"\n                  >',
    "</label\n                >",
    "\n              </div>\n            ",
  ]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral([
    '\n      <fieldset part="fieldset">\n        <legend\n          class="label-main"\n          ?hidden="',
    '"\n          part="fieldset-legend"\n        >\n          ',
    "",
    '\n        </legend>\n        <div id="options" part="fieldset-options">\n          ',
    "\n        </div>\n        ",
    "\n      </fieldset>\n    ",
  ]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral([
    '\n      <div id="fieldmeta" aria-live="polite" part="field-meta"></div>\n    ',
  ]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral([
    '\n      <div\n        class="',
    '"\n        part="field-main"\n      >\n        ',
    '\n        <div part="field-main-inner">\n          ',
    "\n          ",
    "\n          ",
    "\n        </div>\n      </div>\n    ",
  ]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    '\n              <simple-icon-lite\n                icon="',
    '"\n                @click="',
    '"\n                part="option-icon"\n              >\n              </simple-icon-lite>\n            ',
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n      <span class="input-option" part="option-inner">\n        <input\n          ?autofocus="',
    '"\n          aria-descrbedby="',
    '"\n          .aria-invalid="',
    '"\n          @blur="',
    '"\n          @change="',
    '"\n          ?checked="',
    '"\n          class="field ',
    '"\n          ?disabled="',
    '"\n          @focus="',
    '"\n          ?hidden="',
    '"\n          id="',
    '"\n          @input="',
    '"\n          name="',
    '"\n          .placeholder="',
    '"\n          ?readonly="',
    '"\n          ?required="',
    '"\n          tabindex="0"\n          type="',
    '"\n          value="',
    '"\n          part="option-input"\n        />\n        ',
    "\n      </span>\n    ",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
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
    '\n        fieldset {\n          margin: 0;\n          padding: 0;\n          border: none;\n          background-color: var(--simple-fields-background-color, transparent);\n        }\n        option {\n          border-radius: 0;\n        }\n        option[selected] {\n          background-color: var(\n            --simple-fields-faded-background-color,\n            rgba(0, 0, 0, 0.1)\n          );\n        }\n        legend {\n          padding-inline-start: unset;\n          padding-inline-end: unset;\n        }\n        #options {\n          display: var(--simple-fields-radio-option-display, flex);\n          flex-wrap: var(--simple-fields-radio-option-flex-wrap, wrap);\n        }\n        .option {\n          display: flex;\n          flex-wrap: wrap;\n          align-items: stretch;\n          justify-content: space-between;\n          margin: 0 var(--simple-fields-margin-small, 8px) 0 0;\n        }\n        .option:last-of-type {\n          margin: 0;\n        }\n        .option:focus-within label {\n          color: var(--simple-fields-accent-color, #003f7d);\n          transition: color ease-in-out;\n        }\n        :host([type]) fieldset .border-bottom {\n          display: block;\n        }\n        .box-input:focus {\n          outline: none;\n        }\n        .field-main.inline {\n          align-items: center;\n        }\n        input {\n          background-color: var(--simple-fields-background-color, transparent);\n        }\n        textarea {\n          margin: 0;\n          transition: height 0.5s ease-in-out;\n          box-sizing: border-box;\n          vertical-align: bottom;\n          background-color: var(--simple-fields-background-color, transparent);\n        }\n        select.field {\n          width: calc(100% - 47px);\n          padding-right: 47px;\n          border: none;\n          background-color: var(--simple-fields-background-color, transparent);\n          border-radius: 0;\n          transition: color ease-in-out;\n          -webkit-appearance: none;\n          -moz-appearance: none;\n          appearance: none;\n        }\n        :host([type="select"]) simple-icon-lite {\n          position: absolute;\n          right: 47px;\n        }\n        select:focus,\n        select:focus-within {\n          outline: none;\n        }\n        :host([type="checkbox"]) span,\n        :host([type="radio"]) span {\n          position: relative;\n          flex: 1 0 auto;\n          display: flex;\n          align-items: center;\n        }\n        :host([type="checkbox"]) span:focus-within,\n        :host([type="radio"]) span:focus-within {\n          color: var(--simple-fields-accent-color, #003f7d);\n          outline: 1px dotted var(--simple-fields-accent-color, #003f7d);\n        }\n        :host([type="checkbox"]) label.checkbox-label,\n        :host([type="radio"]) label.radio-label {\n          flex: 0 0 auto;\n        }\n        :host([type="checkbox"]) input,\n        :host([type="radio"]) input,\n        .field-main.inline input[type="checkbox"].field,\n        .field-main.inline input[type="radio"].field {\n          z-index: -1;\n          opacity: 0;\n          min-width: 0;\n          width: 0;\n          margin: 0;\n          flex: 0 1 0px;\n        }\n        :host([type="checkbox"]) simple-icon-lite,\n        :host([type="radio"]) simple-icon-lite {\n          flex: 0 0 auto;\n        }\n        :host([type="checkbox"]) simple-icon-lite:hover,\n        :host([type="radio"]) simple-icon-lite:hover,\n        :host([type="checkbox"]) span:focus-within simple-icon-lite,\n        :host([type="radio"]) span:focus-within simple-icon-lite {\n          color: var(--simple-fields-accent-color, #003f7d);\n        }\n\n        input[type="range"] {\n          width: 100%;\n          height: calc(\n            var(--simple-fields-font-size, 16px) +\n              var(--simple-fields-line-height, 22px)\n          );\n          padding: 0;\n          margin: 0;\n          box-sizing: border-box;\n          -webkit-appearance: none;\n        }\n        input[type="range"]:focus {\n          outline: none;\n        }\n        input[type="range"]::-webkit-slider-runnable-track {\n          width: 100%;\n          height: 16px;\n          cursor: pointer;\n          background: var(--simple-fields-border-color-light, #ccc);\n          border-radius: 8px;\n          transition: all 0.5ms ease-in-out;\n        }\n        :host([error]) input[type="range"]::-webkit-slider-runnable-track {\n          background: var(--simple-fields-faded-error-color, #ff997f);\n          transition: all 0.5ms ease-in-out;\n        }\n        input[type="range"]::-webkit-slider-thumb {\n          height: 20px;\n          width: 20px;\n          border-radius: 50%;\n          background-color: var(--simple-fields-background-color, transparent);\n          box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.6);\n          cursor: pointer;\n          -webkit-appearance: none;\n          margin-top: -2px;\n          transition: all 0.5ms ease-in-out;\n        }\n        input[type="range"][readonly]::-webkit-slider-thumb,\n        input[type="range"][disabled]::-webkit-slider-thumb {\n          cursor: not-allowed;\n        }\n        input[type="range"]:focus::-webkit-slider-thumb {\n          background: var(--simple-fields-accent-color, #3f51b5);\n          transition: all 0.5ms ease-in-out;\n        }\n        :host([error]) input[type="range"]::-webkit-slider-thumb {\n          background: var(--simple-fields-error-color, #dd2c00);\n          transition: all 0.5ms ease-in-out;\n        }\n        input[type="range"][readonly]::-webkit-slider-thumb,\n        input[type="range"][disabled]::-webkit-slider-thumb {\n          background: var(--simple-fields-border-color, #999);\n          cursor: not-allowed;\n          box-shadow: none;\n          transition: all 0.5ms ease-in-out;\n        }\n        input[type="range"]::-moz-range-track {\n          width: 100%;\n          height: 16px;\n          cursor: pointer;\n          background: var(--simple-fields-border-color-light, #ccc);\n          border-radius: 8px;\n          transition: all 0.5ms ease-in-out;\n        }\n        input[type="range"][readonly]::-moz-range-track,\n        input[type="range"][disabled]::-moz-range-track {\n          cursor: not-allowed;\n        }\n        :host([error]) input[type="range"]::-moz-range-track {\n          background: var(--simple-fields-faded-error-color, #ff997f);\n          transition: all 0.5ms ease-in-out;\n        }\n        input[type="range"]::-moz-range-thumb {\n          height: 20px;\n          width: 20px;\n          border-radius: 50%;\n          background: var(--simple-fields-background-color, transparent);\n          box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.6);\n          cursor: pointer;\n          transition: all 0.5ms ease-in-out;\n        }\n        input[type="range"]:focus::-moz-range-thumb {\n          background: var(--simple-fields-accent-color, #3f51b5);\n          transition: all 0.5ms ease-in-out;\n        }\n        :host([error]) input[type="range"]::-moz-range-thumb {\n          background: var(--simple-fields-error-color, #dd2c00);\n          transition: all 0.5ms ease-in-out;\n        }\n        input[type="range"][readonly]::-moz-range-thumb,\n        input[type="range"][disabled]::-moz-range-thumb {\n          background: var(--simple-fields-border-color, #999);\n          cursor: not-allowed;\n          box-shadow: none;\n          transition: all 0.5ms ease-in-out;\n        }\n        input[type="range"]::-ms-track {\n          width: 100%;\n          height: 16px;\n          cursor: pointer;\n          background: transparent;\n          border-color: transparent;\n          color: transparent;\n          transition: all 0.5ms ease-in-out;\n        }\n        input[type="range"][readonly]::-ms-track,\n        input[type="range"][disabled]::-ms-track {\n          cursor: not-allowed;\n        }\n        :host([error]) input[type="range"]::-ms-track {\n          background: var(--simple-fields-faded-error-color, #ff997f);\n          transition: all 0.5ms ease-in-out;\n        }\n        input[type="range"]::-ms-fill-lower {\n          background: var(--simple-fields-border-color-light, #ccc);\n          border-radius: 8px;\n        }\n        input[type="range"]::-ms-fill-upper {\n          background: var(--simple-fields-border-color-light, #ccc);\n          border-radius: 8px;\n        }\n        input[type="range"]::-ms-thumb {\n          height: 20px;\n          width: 20px;\n          border-radius: 50%;\n          background: var(--simple-fields-background-color, transparent);\n          box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.6);\n          cursor: pointer;\n        }\n        input[type="range"][readonly]::-ms-thumb,\n        input[type="range"][disabled]::-ms-thumb {\n          cursor: not-allowed;\n        }\n        input[type="range"]:focus::-ms-thumb {\n          background: var(--simple-fields-accent-color, #3f51b5);\n        }\n        :host([error]) input[type="range"]::-ms-thumb {\n          background: var(--simple-fields-error-color, #dd2c00);\n          transition: all 0.5ms ease-in-out;\n        }\n        input[type="range"][redonly]::-ms-thumb,\n        input[type="range"][disabled]::-ms-thumb {\n          background: var(--simple-fields-border-color, #999);\n          cursor: not-allowed;\n          box-shadow: none;\n          transition: all 0.5ms ease-in-out;\n        }\n        input[type="range"]:focus::-ms-fill-lower {\n          background: var(--simple-fields-border-color-light, #ccc);\n        }\n        input[type="range"]:focus::-ms-fill-upper {\n          background: var(--simple-fields-border-color-light, #ccc);\n        }\n      ',
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
 *`simple-fields-field`
 * HTML inputs (excluding submit, reset, button, and image)
 * with label, description, error massage,
 * and aria-invalid functionality if needed.
 *
 * @group simple-fields
 * @extends simple-fields-container
 * @element simple-fields-field
 * @demo ./demo/field.html
 */
var SimpleFieldsField =
  /*#__PURE__*/
  (function (_SimpleFieldsContaine) {
    _inherits(SimpleFieldsField, _SimpleFieldsContaine);

    _createClass(
      SimpleFieldsField,
      [
        {
          key: "render",
          value: function render() {
            return !this.hasFieldset
              ? _get(
                  _getPrototypeOf(SimpleFieldsField.prototype),
                  "render",
                  this
                ).call(this)
              : this.fieldsetTemplate;
          },
        },
      ],
      [
        {
          key: "tag",
          get: function get() {
            return "simple-fields-field";
          },
        },
        {
          key: "styles",
          get: function get() {
            return [].concat(
              _toConsumableArray(
                _get(_getPrototypeOf(SimpleFieldsField), "styles", this)
              ),
              [(0, _litElement.css)(_templateObject())]
            );
          },
        },
        {
          key: "properties",
          get: function get() {
            return _objectSpread(
              {},
              _get(_getPrototypeOf(SimpleFieldsField), "properties", this),
              {
                /**
                 * Hint for expected file type in file upload controls
                 */
                accept: {
                  type: String,
                },

                /**
                 * Hint for form autofill feature
                 */
                autocomplete: {
                  type: String,
                },

                /**
                 * Automatically focus on field when the page is loaded
                 */
                autofocus: {
                  type: Boolean,
                },

                /**
                 * Media capture input method in file upload controls
                 */
                capture: {
                  type: String,
                },

                /**
                 * a counter text and textareas: "character", "word" or unset for none
                 */
                counter: {
                  type: String,
                },

                /**
                 * Name of form field to use for sending the element's directionality in form submission
                 */
                dirname: {
                  type: String,
                },

                /**
                 * array of options [{value: "key", text: "Text"}] for select, radio options, and checkboxes,
                 * so that they can appear in a prescribed order,
                 * eg. [{value: "b", text: "Option B"}, {value: "a", text: "Option A"}, {value: "c", text: "Option C"}]
                 */
                itemsList: {
                  type: Array,
                  attribute: "items-list",
                },

                /**
                 * Value of the id attribute of the `<datalist>` of autocomplete options
                 */
                list: {
                  type: String,
                },

                /**
                 * Maximum value for numeric field types
                 */
                max: {
                  type: Number,
                },

                /**
                 * Maximum length (number of characters) of `value`
                 */
                maxlength: {
                  type: Number,
                },

                /**
                 * Minimum value for numeric field types
                 */
                min: {
                  type: Number,
                },

                /**
                 * Minimum length (number of characters) of `value`
                 */
                minlength: {
                  type: Number,
                },

                /**
                 * Whether to allow multiple values
                 */
                multiple: {
                  type: Boolean,
                },

                /**
                 * options {value: "Text"}  for select, radio options, and checkboxes,
                 * which are sorted by key,
                 * eg. {a: "Option A", b: "Option B", c: "Option C"}
                 */
                options: {
                  type: Object,
                },

                /**
                 * Content to be appear in the form control when the form control is empty
                 */
                placeholder: {
                  type: String,
                },

                /**
                 * Size of the control
                 */
                size: {
                  type: Number,
                },

                /*
                 * Whether input subject to spell checking by browser/OS as "true", "default", or "false"
                 */
                spellcheck: {
                  type: String,
                },

                /**
                 * Incremental values that are valid
                 */
                step: {
                  type: Number,
                },

                /**
                 * Current value of the form control. Submitted with the form as part of a name/value pair.
                 */
                value: {
                  reflect: true,
                },

                /*
                 * text wrapping for textarea,
                 * "hard": automatically inserts line breaks (CR+LF)
                 * "soft": all line breaks as CR+LF pair
                 * "off" : no wrapping / <textarea> becomes horizontally scrollable
                 */
                wrap: {
                  type: Boolean,
                },
              }
            );
          },
        },
      ]
    );

    function SimpleFieldsField() {
      var _this;

      _classCallCheck(this, SimpleFieldsField);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(SimpleFieldsField).call(this)
      );
      _this.autocomplete = "off";
      _this.autofocus = false;
      _this.multiple = false;
      _this.readonly = false;
      _this.spellcheck = false;
      _this.itemsList = [];
      _this.options = {};
      _this.wrap = false;
      return _this;
    }

    _createClass(SimpleFieldsField, [
      {
        key: "updated",
        value: function updated(changedProperties) {
          var _this2 = this;

          if (!this.field) this._updateField();
          changedProperties.forEach(function (oldValue, propName) {
            if (propName === "id" && !_this2.id)
              _this2.id = _this2._generateUUID();
            if (_this2._getAttributes(_this2.type).includes(propName))
              _this2._updateAttribute(propName);

            if (propName === "value" && _this2.value !== oldValue) {
              if (_this2.field.value !== _this2.value)
                _this2.field.value = _this2.value;

              _this2._fireValueChanged();
            }

            if (
              ["counter", "maxlength", "type"].includes(propName) &&
              ["text", "textarea"].includes(_this2.type)
            )
              _this2._updateCount();

            if (
              (propName === "type" && _this2.type !== oldValue) ||
              ["itemsList", "options"].includes(propName)
            ) {
              _this2._updateField();
            }
          });
        },
      },
      {
        key: "_handleIconClick",
        value: function _handleIconClick(checked, option) {
          this.value = !option
            ? !checked
            : this.type === "radio" && checked
            ? undefined
            : this.type === "radio"
            ? (option || {}).value
            : checked
            ? (this.value || []).filter(function (i) {
                return i !== option.value;
              })
            : [].concat(_toConsumableArray(this.value || []), [
                (option || {}).value,
              ]);

          if (this.multicheck && this.autovalidate) {
            this.error = false;
            this.validate();
          }
        },
      },
      {
        key: "getOptionIcon",
        value: function getOptionIcon(checked) {
          return checked && this.type === "checkbox"
            ? "icons:check-box"
            : this.type === "checkbox"
            ? "icons:check-box-outline-blank"
            : checked
            ? "icons:radio-button-checked"
            : "icons:radio-button-unchecked";
        },
      },
      {
        key: "getInput",
        value: function getInput(option) {
          var _this3 = this;

          var checked = !option
              ? !!this.value
              : this.type === "radio"
              ? this.value === (option || {}).value
              : (this.value || []).includes((option || {}).value),
            icon = this.getOptionIcon(checked);
          return (0, _litElement.html)(
            _templateObject2(),
            this.autofocus,
            this.describedBy || "",
            this.error ? "true" : "false",
            this._onFocusout,
            this._handleFieldChange,
            checked,
            ["checkbox", "color", "file", "radio", "range"].includes(this.type)
              ? ""
              : "box-input",
            this.disabled,
            this._onFocusin,
            this.hidden,
            !option ? this.id : option.value,
            this._handleFieldChange,
            this.id,
            this.placeholder || "",
            this.readonly,
            this.required,
            this.type,
            !option ? this.value : (option || {}).value,
            this.type !== "checkbox" && this.type !== "radio"
              ? ""
              : (0, _litElement.html)(_templateObject3(), icon, function (e) {
                  return _this3._handleIconClick(checked, option);
                })
          );
        },
        /**
         * template for `input` in shadow DOM
         *
         * @readonly
         * @returns {object}
         * @memberof SimpleFieldsField
         */
      },
      {
        key: "_fireValueChanged",

        /**
         * fires when value changes
         * @event value-changed
         */
        value: function _fireValueChanged() {
          this.dispatchEvent(
            new CustomEvent("value-changed", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: this,
            })
          );
        },
        /**
         * handles field changes by field type
         *
         * @memberof SimpleFieldsContainer
         */
      },
      {
        key: "_handleFieldChange",
        value: function _handleFieldChange(e) {
          _get(
            _getPrototypeOf(SimpleFieldsField.prototype),
            "_handleFieldChange",
            this
          ).call(this);

          if (this.multicheck && this.autovalidate) {
            this.error = false;
            this.validate();
          }
        },
        /**
         * gets attributes that will only be set if they are defined
         * @param {string} [type=text] input type
         * @returns {array} list of attributes
         */
      },
      {
        key: "_getAttributes",
        value: function _getAttributes(type) {
          var attributes = {
            checkbox: ["autocomplete", "form", "list"],
            color: ["autocomplete", "form", "list"],
            date: ["autocomplete", "form", "list", "max", "min", "step"],
            "datetime-local": ["form", "list", "max", "min", "step"],
            email: ["autocomplete", "form", "list", "placeholder"],
            file: ["autocomplete", "accept", "capture", "form", "list"],
            hidden: ["autocomplete", "form"],
            month: ["autocomplete", "form", "list", "max", "min", "step"],
            number: ["autocomplete", "form", "list", "max", "min", "step"],
            password: [
              "autocomplete",
              "form",
              "list",
              "maxlength",
              "maxlength",
              "pattern",
              "placeholder",
            ],
            radio: ["autocomplete", "form", "list"],
            range: ["autocomplete", "form", "list", "max", "min", "step"],
            search: [
              "autocomplete",
              "dirname",
              "form",
              "list",
              "maxlength",
              "maxlength",
              "placeholder",
            ],
            select: ["autocomplete", "form", "list", "size"],
            tel: [
              "autocomplete",
              "form",
              "list",
              "maxlength",
              "maxlength",
              "pattern",
              "placeholder",
            ],
            text: [
              "autocomplete",
              "dirname",
              "form",
              "list",
              "maxlength",
              "maxlength",
              "pattern",
              "placeholder",
            ],
            textarea: [
              "autocomplete",
              "autocomplete",
              "form",
              "maxlength",
              "maxlength",
              "placeholder",
              "spellcheck",
              "wrap",
            ],
            time: ["autocomplete", "form", "list", "max", "min", "step"],
            url: [
              "autocomplete",
              "form",
              "list",
              "maxlength",
              "maxlength",
              "placeholder",
            ],
            week: ["autocomplete", "form", "list", "max", "min", "step"],
          };
          return attributes[type];
        },
      },
      {
        key: "_getFieldsetValue",
        value: function _getFieldsetValue() {
          return this.value;
        },
        /**
         * listens for focusout
         * overridden for fields in shadow DOM
         *
         * @param {boolean} [init=true] whether to start observing or disconnect observer
         * @memberof SimpleFieldsField
         */
      },
      {
        key: "_observeAndListen",
        value: function _observeAndListen() {
          var init =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : true;

          if (init) {
            this.addEventListener("click", this.focus);
          } else {
            this.removeEventListener("click", this.focus);
          }
        },
        /**
         * updates field attributes based on field type
         *
         * @param {string} attribute
         * @memberof SimpleFieldsContainer
         */
      },
      {
        key: "_updateAttribute",
        value: function _updateAttribute(attribute) {
          if (
            this.field &&
            this[attribute] !== this.field.getAttribute(attribute)
          ) {
            if (this[attribute]) {
              this.field.setAttribute(attribute, this[attribute]);
            } else {
              this.field.removeAttribute(attribute, this[attribute]);
            }
          }
        },
        /**
         * updates field an type
         *
         * @memberof SimpleFieldsField
         */
      },
      {
        key: "_updateField",
        value: function _updateField() {
          var _this4 = this;

          this.type = this._getValidType(this.type);
          this.field =
            this.shadowRoot &&
            this.shadowRoot.querySelector(this.fieldElementTag)
              ? this.shadowRoot.querySelector(this.fieldElementTag)
              : undefined;

          this._getAttributes(this.type).forEach(function (attr) {
            return _this4._updateAttribute(attr);
          });

          if (this.type !== "select" && this.field)
            this._updateAttribute("value");
          if (this.field && this.__delayedFocus) this.focus();
        },
      },
      {
        key: "hasFieldset",
        get: function get() {
          return (
            (this.type === "radio" || this.type === "checkbox") &&
            !this.noOptions
          );
        },
        /**
         * gets field element tag in shadow DOM
         *
         * @readonly
         * @returns {string}
         * @memberof SimpleFieldsField
         */
      },
      {
        key: "fieldElementTag",
        get: function get() {
          return this.type === "select" ||
            (this.type === "text" && !this.noOptions)
            ? "select"
            : this.type === "textarea"
            ? "textarea"
            : this.hasFieldset
            ? "fieldset"
            : "input";
        },
        /**
         * template label and field
         *
         * @readonly
         * @returns {object}
         * @memberof SimpleFieldsField
         */
      },
      {
        key: "fieldMainTemplate",
        get: function get() {
          return (0, _litElement.html)(
            _templateObject4(),
            this.inline ||
              ["checkbox", "color", "radio"].includes(this.type || "text")
              ? "field-main inline"
              : "field-main",
            this.labelTemplate,
            this.prefixTemplate,
            this.fieldElementTag === "input"
              ? this.inputTemplate
              : this.fieldElementTag === "select"
              ? this.selectTemplate
              : this.fieldElementTag === "textarea"
              ? this.textareaTemplate
              : "",
            this.suffixTemplate
          );
        },
        /**
         *
         * gets field metadata
         *
         * @readonly
         * @returns {object}
         * @memberof SimpleFieldsField
         */
      },
      {
        key: "fieldMeta",
        get: function get() {
          return (0, _litElement.html)(_templateObject5());
        },
        /**
         * template for `fieldset` in shadow DOM
         *
         * @readonly
         * @returns {object}
         * @memberof SimpleFieldsField
         */
      },
      {
        key: "fieldsetTemplate",
        get: function get() {
          var _this5 = this;

          return (0, _litElement.html)(
            _templateObject6(),
            !this.label,
            this.label,
            this.error || this.required ? "*" : "",
            (this.sortedOptions || []).map(function (option) {
              return (0,
              _litElement.html)(_templateObject7(), _this5.id, option.value, option.text, _this5.getInput(option));
            }),
            this.fieldBottom
          );
        },
      },
      {
        key: "inputTemplate",
        get: function get() {
          return this.getInput();
        },
      },
      {
        key: "multicheck",
        get: function get() {
          return this.hasFieldset;
        },
        /**
         * gets whether or not the field has options
         *
         * @readonly
         * @memberof SimpleFieldsField
         */
      },
      {
        key: "noOptions",
        get: function get() {
          return (
            this.itemsList.length < 1 &&
            Object.keys(this.options || {}).length < 1
          );
        },
        /**
         * determines if number of items selected
         * is not between min and max
         *
         * @readonly
         * @memberof SimpleFieldsContainer
         */
      },
      {
        key: "numberError",
        get: function get() {
          var items = this._getFieldValue()
              ? this._getFieldValue().length
              : false,
            min = this.type === "select" || this.multicheck ? this.min : false,
            max = this.type === "select" || this.multicheck ? this.max : false;
          var more = min && items && min > items ? min - items : false,
            less = max && items && max < items ? max - items : more;
          return less;
        },
        /**
         * gets a sorted list of option
         *
         * @readonly
         * @memberof SimpleFieldsField
         */
      },
      {
        key: "sortedOptions",
        get: function get() {
          var _this6 = this;

          var sorted = (this.itemsList || []).map(function (item, i) {
            return _typeof(item) === "object"
              ? item
              : {
                  value: item,
                  text: item,
                };
          });
          Object.keys(this.options || {})
            .sort(function (a, b) {
              return a > b ? 1 : -1;
            })
            .forEach(function (key) {
              return sorted.push({
                value: key,
                text: _this6.options[key],
              });
            });
          return sorted;
        },
        /**
         * template for `select` in shadow DOM
         *
         * @readonly
         * @returns {object}
         * @memberof SimpleFieldsField
         */
      },
      {
        key: "selectTemplate",
        get: function get() {
          var _this7 = this;

          return (0, _litElement.html)(
            _templateObject8(),
            this.autofocus,
            this.describedBy,
            this.error ? "true" : "false",
            this._onFocusout,
            this._handleFieldChange,
            this.disabled,
            this._onFocusin,
            this.hidden,
            this.id,
            this.multiple,
            this.id,
            this.readonly,
            this.required,
            (this.sortedOptions || []).map(function (option) {
              return (0,
              _litElement.html)(_templateObject9(), _this7.id, option.value, _this7.multiple ? _this7.value && _this7.value.includes(option.value) : _this7.value === option.value, option.value, option.text);
            })
          );
        },
        /**
         * overridden mutation observer
         *
         * @readonly
         * @memberof SimpleFieldsField
         */
      },
      {
        key: "slottedFieldObserver",
        get: function get() {},
        /**
         * template for `textarea` in shadow DOM
         *
         * @readonly
         * @returns {object}
         * @memberof SimpleFieldsField
         */
      },
      {
        key: "textareaTemplate",
        get: function get() {
          return (0, _litElement.html)(
            _templateObject10(),
            this.error ? "true" : "false",
            this.autofocus,
            this._onFocusout,
            this._handleFieldChange,
            function (e) {
              return e.stopPropagation();
            },
            this.disabled,
            this._onFocusin,
            this.hidden,
            this.id,
            this._handleFieldChange,
            this.id,
            this.readonly,
            this.required,
            this.value || ""
          );
        },
      },
    ]);

    return SimpleFieldsField;
  })(_simpleFieldsContainer.SimpleFieldsContainer);

exports.SimpleFieldsField = SimpleFieldsField;
window.customElements.define(SimpleFieldsField.tag, SimpleFieldsField);

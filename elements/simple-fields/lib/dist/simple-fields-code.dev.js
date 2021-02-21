"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimpleFieldsCode = void 0;

var _litElement = require("lit-element/lit-element.js");

var _simpleFieldsContainer = require("./simple-fields-container.js");

require("@lrnwebcomponents/code-editor/code-editor.js");

var _utils = require("@lrnwebcomponents/utils/utils.js");

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

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n      <div class="field-main" part="field-main">\n        ',
    '\n        <code-editor\n          ?autofocus="',
    '"\n          ?disabled="',
    '"\n          font-size="',
    '"\n          editor-value="',
    '"\n          theme="',
    '"\n          language="',
    '"\n          mode="',
    '"\n          ?read-only="',
    '"\n          @value-changed="',
    '"\n          @focused-changed="',
    '"\n          @code-editor-focus="',
    '"\n          @code-editor-blur="',
    '"\n          part="editor"\n        >\n        </code-editor>\n        <input name="',
    '" type="hidden" value="',
    '" />\n      </div>\n    ',
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
    "\n        #options {\n          display: var(--simple-fields-radio-option-display, flex);\n          flex-wrap: var(--simple-fields-radio-option-flex-wrap, wrap);\n        }\n        code-editor {\n          margin: 0;\n          transition: height 0.5s ease-in-out;\n          box-sizing: border-box;\n          vertical-align: bottom;\n        }\n        code-editor:focus {\n          outline: none;\n        }\n      ",
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
 *`simple-fields-code`
 * HTML inputs (excluding submit, reset, button, and image)
 * with label, description, error massage,
 * and aria-invalid functionality if needed.
 *
 * @group simple-fields
 * @extends simple-fields-container
 * @element simple-fields-code
 * @demo ./demo/field.html
 */
var SimpleFieldsCode =
  /*#__PURE__*/
  (function (_SimpleFieldsContaine) {
    _inherits(SimpleFieldsCode, _SimpleFieldsContaine);

    _createClass(
      SimpleFieldsCode,
      [
        {
          key: "render",
          value: function render() {
            return !this.hasFieldSet
              ? _get(
                  _getPrototypeOf(SimpleFieldsCode.prototype),
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
            return "simple-fields-code";
          },
        },
        {
          key: "styles",
          get: function get() {
            return [].concat(
              _toConsumableArray(
                _get(_getPrototypeOf(SimpleFieldsCode), "styles", this)
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
              _get(_getPrototypeOf(SimpleFieldsCode), "properties", this),
              {
                /**
                 * Automatically focus on field when the page is loaded
                 */
                autofocus: {
                  type: Boolean,
                },

                /**
                 * changes the value of the editor
                 */
                editorValue: {
                  type: String,
                  attribute: "editor-value",
                },

                /**
                 * Whether the field is hidden
                 */
                focused: {
                  type: Boolean,
                  reflect: true,
                },

                /**
                 * Font-size of editor
                 */
                fontSize: {
                  type: Number,
                  attribute: "font-size",
                },

                /**
                 * language of code-editor
                 */
                language: {
                  type: String,
                },

                /**
                 * mode of code-editor
                 */
                mode: {
                  type: Number,
                },

                /**
                 * Value is not editable
                 */
                readonly: {
                  type: Boolean,
                  reflect: true,
                },

                /**
                 * error message when field is required and has no value
                 */
                requiredMessage: {
                  type: String,
                },

                /**
                 * theme of code-editor
                 */
                theme: {
                  type: Number,
                },

                /**
                 * Current value of the form control. Submitted with the form as part of a name/value pair.
                 */
                value: {
                  reflect: true,
                },
              }
            );
          },
        },
      ]
    );

    function SimpleFieldsCode() {
      var _this;

      _classCallCheck(this, SimpleFieldsCode);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(SimpleFieldsCode).call(this)
      );
      _this.autofocus = false;
      _this.fontSize = 14;
      _this.id = _this._generateUUID();
      _this.language = "html";
      _this.mode = "html";
      _this.readonly = false;
      _this.theme = "auto";
      return _this;
    }

    _createClass(SimpleFieldsCode, [
      {
        key: "disconnectedCallback",
        value: function disconnectedCallback() {
          var _this2 = this;

          this.removeEventListener("click", function (e) {
            return _this2.focus();
          });

          _get(
            _getPrototypeOf(SimpleFieldsCode.prototype),
            "disconnectedCallback",
            this
          ).call(this);
        },
      },
      {
        key: "updated",
        value: function updated(changedProperties) {
          var _this3 = this;

          changedProperties.forEach(function (oldValue, propName) {
            if (propName === "id" && !_this3.id)
              _this3.id = _this3._generateUUID();
            if (propName === "field" && !_this3.field) _this3._updateField();
            if (propName === "value") _this3._fireValueChanged();
          });
        },
        /**
         * template label and field
         *
         * @readonly
         * @returns {object}
         * @memberof SimpleFieldsContainer
         */
      },
      {
        key: "_onChange",

        /**
         * makes handles code-editor changes
         *
         * @memberof SimpleFieldsCode
         */
        value: function _onChange(e) {
          var target = (0, _utils.normalizeEventPath)(e)[0];
          if (!target) return;
          if (this.value !== target.value) this.value = target.value; //this.autoGrow(target);
        },
        /**
         * overridden mutation observer
         *
         * @readonly
         * @memberof SimpleFieldsContainer
         */
      },
      {
        key: "validate",

        /**
         * checks validation constraints and returns error data
         * @memberof SimpleFieldsCode
         */
        value: function validate() {
          if (!this.value && this.required) {
            this.error = true;
            this.errorMessage = this.requiredMessage || "required";
          } // to match container response

          return !this.error;
        },
        /**
         * fires when value changes
         * @event value-changed
         */
      },
      {
        key: "_fireValueChanged",
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
      },
      {
        key: "_onFocusChange",
        value: function _onFocusChange(e) {
          this.focused = e.detail.focused;
        },
        /**
         * listens for focusout
         * overridden for fields in shadow DOM
         *
         * @param {boolean} [init=true] whether to start observing or disconnect observer
         * @memberof SimpleFieldsContainer
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
            this.addEventListener("focusout", this._onFocusout);
            this.addEventListener("focusin", this._onFocusin);
          } else {
            this.removeEventListener("click", this.focus);
            this.removeEventListener("focusout", this._onFocusout);
            this.removeEventListener("focusin", this._onFocusin);
          }
        },
        /**
         * updates field an type
         *
         * @memberof SimpleFieldsCode
         */
      },
      {
        key: "_updateField",
        value: function _updateField() {
          this.field =
            this.shadowRoot && this.shadowRoot.querySelector("code-editor")
              ? this.shadowRoot.querySelector("code-editor")
              : undefined;
        },
        /**
         * generates a unique id
         * @returns {string } unique id
         */
      },
      {
        key: "_generateUUID",
        value: function _generateUUID() {
          return "ss-s-s-s-sss".replace(
            /s/g,
            Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1)
          );
        },
      },
      {
        key: "fieldMainTemplate",
        get: function get() {
          var _this4 = this;

          return (0, _litElement.html)(
            _templateObject2(),
            this.labelTemplate,
            this.autofocus,
            this.disabled,
            this.fontSize,
            this.__editorValue || "",
            this.theme,
            this.language,
            this.mode,
            this.readonly || this.disabled,
            this._onChange,
            this._onFocusChange,
            function (e) {
              return _this4.focused == true;
            },
            function (e) {
              return _this4.focused == false;
            },
            this.id,
            this.value
          );
        },
      },
      {
        key: "slottedFieldObserver",
        get: function get() {},
      },
    ]);

    return SimpleFieldsCode;
  })(_simpleFieldsContainer.SimpleFieldsContainer);

exports.SimpleFieldsCode = SimpleFieldsCode;
window.customElements.define(SimpleFieldsCode.tag, SimpleFieldsCode);

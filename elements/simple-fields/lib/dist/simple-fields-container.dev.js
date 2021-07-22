"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimpleFieldsContainerBehaviors = exports.SimpleFieldsContainer = void 0;

var _litElement = require("lit");

var _simpleFieldsUi = require("./simple-fields-ui.js");

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

function _templateObject10() {
  var data = _taggedTemplateLiteral([
    '\n        <slot name="suffix"></slot>\n        ',
    "\n      ",
  ]);

  _templateObject10 = function _templateObject10() {
    return data;
  };

  return data;
}

function _templateObject9() {
  var data = _taggedTemplateLiteral([
    '\n        <slot name="prefix"></slot>\n        ',
    "\n      ",
  ]);

  _templateObject9 = function _templateObject9() {
    return data;
  };

  return data;
}

function _templateObject8() {
  var data = _taggedTemplateLiteral([
    '\n        <label\n          for="',
    '"\n          class="label-main"\n          ?hidden="',
    '"\n          part="label"\n        >\n          <slot name="label-prefix"></slot>\n          <slot name="label"></slot>\n          ',
    "",
    "\n        </label>\n      ",
  ]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  var data = _taggedTemplateLiteral([
    '\n        <div id="fieldmeta" aria-live="polite" part="field-meta">\n          <slot name="field-meta"></slot>\n        </div>\n      ',
  ]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral([
    '\n        <div\n          class="',
    '"\n          part="field-main"\n        >\n          ',
    '\n          <div part="field-inner">\n            ',
    '\n            <slot name="field"></slot>\n            ',
    "\n          </div>\n        </div>\n      ",
  ]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral([
    '\n        <div class="border-bottom blur"></div>\n        <div class="border-bottom focus"></div>\n        <div id="field-bottom" part="field-bottom">\n          <div id="error-desc" part="field-bottom-inner">\n            ',
    " ",
    "\n          </div>\n          ",
    "\n        </div>\n      ",
  ]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral([
    '\n        <div\n          id="error-message"\n          ?hidden="',
    '"\n          role="alert"\n          part="error-msg"\n        >\n          ',
    "\n        </div>\n      ",
  ]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    '\n        <div id="description" part="field-desc">\n          <slot name="description"></slot>\n          ',
    "\n        </div>\n      ",
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n          :host {\n            display: block;\n          }\n          :host([error]) {\n            color: var(--simple-fields-error-color, #b40000);\n            transition: color 0.3s ease-in-out;\n          }\n          :host([disabled]) {\n            color: var(--simple-fields-disabled-color, #999);\n          }\n          .field-main.inline,\n          .field-main > div,\n          #field-bottom {\n            display: flex;\n            align-items: stretch;\n            justify-content: flex-start;\n          }\n          * {\n            flex: 1 1 auto;\n          }\n          #fieldmeta {\n            text-align: right;\n          }\n          .field,\n          ::slotted([slot="field"]) {\n            width: auto;\n            border: none;\n            color: var(--simple-fields-color, currentColor);\n            background-color: var(--simple-fields-background-color, transparent);\n            transition: opacity ease-in-out;\n            flex: 1 0 auto;\n          }\n          ::slotted([slot="field"]:focus) {\n            outline: none;\n          }\n          :host[inline] ::slotted([slot="field"]:focus),\n          ::slotted([type="checkbox"][slot="radio"]:focus),\n          ::slotted([type="checkbox"][slot="field"]:focus) {\n            outline: unset;\n          }\n          .field-main.inline .field,\n          .field-main.inline ::slotted([slot="field"]) {\n            min-width: var(--simple-fields-detail-line-height, 22px);\n            height: var(--simple-fields-detail-line-height, 22px);\n            margin: 0 var(--simple-fields-margin-small, 8px) 0 0;\n          }\n          .field[disabled],\n          :host([readonly]) ::slotted([slot="field"]) {\n            opacity: var(--simple-fields-disabled-opacity, 0.7);\n            transition: opacity ease-in-out;\n          }\n          .field[readonly],\n          .field[disabled],\n          :host([readonly]) ::slotted([slot="field"]),\n          :host([disabled]) ::slotted([slot="field"]) {\n            cursor: not-allowed;\n            pointer-events: none;\n          }\n          .border-bottom {\n            height: 0;\n          }\n          :host([disabled]) .border-bottom {\n            border-bottom: 1px dashed var(--simple-fields-border-color, #999);\n          }\n          .border-bottom.blur {\n            border-bottom: 1px solid var(--simple-fields-border-color, #999);\n            width: 100%;\n          }\n          .border-bottom.focus {\n            margin: -1px auto 0;\n            width: 0;\n            border-bottom: 2px solid var(--simple-fields-accent-color, #3f51b5);\n            transition: width 0.5s ease-in-out;\n          }\n          :host(:focus-within) .border-bottom.focus {\n            width: 100%;\n            transition: width 0.5s ease-in-out;\n          }\n          :host([type="checkbox"]) .border-bottom,\n          :host([type="color"]) .border-bottom,\n          :host([type="file"]) .border-bottom,\n          :host([type="radio"]) .border-bottom,\n          :host([type="range"]) .border-bottom {\n            display: none;\n          }\n          ::slotted(input) {\n            padding: 0px;\n          }\n          ::slotted(textarea[slot="field"]) {\n            margin: 0;\n            transition: height 0.5s ease-in-out;\n            box-sizing: border-box;\n            vertical-align: bottom;\n          }\n          ::slotted(fieldset[slot="field"]) {\n            margin: 0;\n            padding: 0;\n            border: none;\n            font-size: var(--simple-fields-font-size, 16px);\n            font-family: var(--simple-fields-font-family, sans-serif);\n            line-height: var(--simple-fields-line-height, 22px);\n            display: var(--simple-fields-radio-option-display, block);\n            flex-wrap: var(--simple-fields-radio-option-flex-wrap, wrap);\n            transition: color 0.3s ease-in-out;\n          }\n        ',
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
  var data = _taggedTemplateLiteral([" ", " ", " "]);

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

/**
 * @class SimpleFieldsContainerBehaviors
 */
var SimpleFieldsContainerBehaviors = function SimpleFieldsContainerBehaviors(
  SuperClass
) {
  return (
    /*#__PURE__*/
    (function (_SuperClass) {
      _inherits(_class, _SuperClass);

      _createClass(
        _class,
        [
          {
            key: "render",
            value: function render() {
              return (0, _litElement.html)(
                _templateObject(),
                this.fieldMainTemplate,
                this.fieldBottom
              );
            },
          },
        ],
        [
          {
            key: "tag",
            get: function get() {
              return "simple-fields-container";
            },
          },
          {
            key: "styles",
            get: function get() {
              return [].concat(
                _toConsumableArray(_simpleFieldsUi.SimpleFieldsBaseStyles),
                _toConsumableArray(_simpleFieldsUi.SimpleFieldsLabelStyles),
                _toConsumableArray(
                  _simpleFieldsUi.SimpleFieldsDescriptionStyles
                ),
                [(0, _litElement.css)(_templateObject2())]
              );
            },
          },
          {
            key: "properties",
            get: function get() {
              return {
                /**
                 * Automatically validate field
                 */
                autovalidate: {
                  type: Boolean,
                },

                /**
                 * a counter text and textareas: "character", "word" or unset for none
                 */
                counter: {
                  type: String,
                },

                /**
                 * Optional description of the field (or use slot="description")
                 */
                description: {
                  type: String,
                },

                /**
                 * Whether the form control is disabled
                 */
                disabled: {
                  type: Boolean,
                  reflect: true,
                },

                /**
                 * Optional validation error message to display
                 */
                defaultErrorMessage: {
                  type: String,
                },

                /**
                 * Optional required validation error message to display
                 */
                defaultRequiredMessage: {
                  type: String,
                },

                /**
                 * Whether field has errors
                 */
                error: {
                  type: Boolean,
                  reflect: true,
                },

                /**
                 * Validation error message to display
                 */
                errorMessage: {
                  type: String,
                },

                /**
                 * Whether the field is hidden
                 */
                hidden: {
                  type: Boolean,
                  reflect: true,
                },

                /**
                 * Field element
                 */
                field: {
                  type: Object,
                },

                /**
                 * Unique id
                 */
                id: {
                  type: String,
                  reflect: true,
                },

                /**
                 * Whether field and label should be inline
                 */
                inline: {
                  type: Boolean,
                  reflect: true,
                },

                /**
                 * Label for the field (or use slot="label")
                 */
                label: {
                  type: String,
                },

                /**
                 * Minimum number of checked items in fieldset
                 */
                minchecked: {
                  type: Number,
                },

                /**
                 * Minimum number of checked items in fieldset
                 */
                maxchecked: {
                  type: Number,
                },

                /**
                 * Maximum number of words in textarea
                 */
                maxwords: {
                  type: Number,
                },

                /**
                 * Name of the input form control. Submitted with the form as part of a name/value pair.
                 */
                name: {
                  type: String,
                  reflect: true,
                },

                /**
                 * error message when number of items selected is not between min and max
                 */
                numberMessage: {
                  type: String,
                },

                /**
                 * regex pattern the value must match to be valid
                 */
                pattern: {
                  type: String,
                },

                /**
                 * error message when field does not match pattern
                 */
                patternMessage: {
                  type: String,
                },

                /**
                 * Optional prefix string (or use slot="prefix")
                 */
                prefix: {
                  type: String,
                },

                /**
                 * Value is not editable
                 */
                readonly: {
                  type: Boolean,
                  reflect: true,
                },

                /**
                 * Whether field is required
                 */
                required: {
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
                 * Optional suffix string (or use slot="suffix")
                 */
                suffix: {
                  type: String,
                },

                /**
                 * Type of input form control
                 */
                type: {
                  type: String,
                },

                /**
                 * List of valid field types
                 */
                validTypes: {
                  type: Array,
                },

                /**
                 * Value of field
                 */
                value: {
                  type: Object,
                },

                /**
                 * delays focus even until field is attached
                 */
                __delayedFocus: {
                  type: Boolean,
                },
              };
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
        _this.counter = "none";
        _this.autovalidate = false;
        _this.disabled = false;
        _this.hidden = false;
        _this.error = false;
        _this.id = _this._generateUUID();
        _this.inline = false;
        _this.validTypes = [
          "checkbox",
          "color",
          "date",
          "datetime-local",
          "email",
          "file",
          "fieldset",
          "hidden",
          "month",
          "number",
          "password",
          "radio",
          "range",
          "search",
          "select",
          "tel",
          "text",
          "textarea",
          "time",
          "url",
          "week",
        ];

        _this._observeAndListen();

        _this.addEventListener("click", _this.focus);

        return _this;
      }

      _createClass(_class, [
        {
          key: "disconnectedCallback",
          value: function disconnectedCallback() {
            this.removeEventListener("click", this.focus);

            _get(
              _getPrototypeOf(_class.prototype),
              "disconnectedCallback",
              this
            ).call(this);
          },
          /**
           * makes a field autogrow
           *
           * @memberof SimpleFieldsContainer
           */
        },
        {
          key: "autoGrow",
          value: function autoGrow() {
            var field =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : this.field;

            if (this.field) {
              this.field.style.height = "auto"; // @todo this breaks if we're inside of a tab / element is not visible
              // when value changes

              this.field.style.height = "".concat(
                this.field.scrollHeight,
                "px"
              );
              this.field.style.overflowY = "hidden";
            }
          },
          /**
           * updates slotted field
           *
           * @memberof SimpleFieldsContainer
           */
        },
        {
          key: "firstUpdated",
          value: function firstUpdated(changedProperties) {
            if (_get(_getPrototypeOf(_class.prototype), "firstUpdated", this))
              _get(
                _getPrototypeOf(_class.prototype),
                "firstUpdated",
                this
              ).call(this, changedProperties);

            this._updateField();
          },
          /**
           * updates for slotted input
           * overrride for shadow DOM
           *
           * @param {*} changedProperties
           * @memberof SimpleFieldsContainer
           */
        },
        {
          key: "updated",
          value: function updated(changedProperties) {
            var _this2 = this;

            var errorChanged = false;
            changedProperties.forEach(function (oldValue, propName) {
              if (propName === "error" && _this2.error !== oldValue)
                errorChanged = true;
              if (
                propName === "errorMessage" &&
                _this2.errorMessage !== oldValue
              )
                errorChanged = true;

              if (propName === "error" && _this2.field) {
                _this2.field.setAttribute(
                  "aria-invalid",
                  _this2.error ? "true" : "false"
                );
              }
            });
            if (errorChanged) this._fireErrorChanged();
          },
          /**
           * template for slotted or shadow DOM description
           *
           * @readonly
           * @returns {object}
           * @memberof SimpleFieldsContainer
           */
        },
        {
          key: "focus",

          /**
           * focuses on field
           * @memberof SimpleFieldsContainer
           */
          value: function focus() {
            if (this.field) {
              this.field.focus();
              this.__delayedFocus = false;
            } else {
              this.__delayedFocus = true;
            }
          },
          /**
           * selects all text
           * @memberof SimpleFieldsContainer
           */
        },
        {
          key: "select",
          value: function select() {
            if (
              this.field &&
              (this.type === "text" || this.type === "textarea")
            )
              this.field.select();
          },
          /**
           * replaces a range of text
           * @param {string} replacement string to insert
           * @param {number=selectionStart} start 0-based index first character to replace
           * @param {number=selectionEnd} end 0-based index after last character to replace
           * @param {selectMode} after the text has been replaced:
           * "select" selects the newly inserted text,
           * "start" moves the selection to just before the inserted text,
           * "end" moves the selection to just after the inserted text, and
           * "preserve" attempts to preserve the selection. This is the default.
           * @memberof SimpleFieldsContainer
           */
        },
        {
          key: "setRangeText",
          value: function setRangeText(replacement, start, end, selectMode) {
            if (
              this.field &&
              (this.type === "text" || this.type === "textarea")
            )
              this.field.setRangeText(replacement, start, end, selectMode);
          },
          /**
           * selects a range of text
           * @param {string} replacement string to insert
           * @param {selectionStart} start 0-based index first character
           * @param {selectionEnd} end 0-based index after last character
           * @param {selectMode} selection direction: "forward", "backward", or default "none"
           * @memberof SimpleFieldsContainer
           */
        },
        {
          key: "setSelectionRange",
          value: function setSelectionRange(
            selectionStart,
            selectionEnd,
            selectionDirection
          ) {
            if (
              this.field &&
              (this.type === "text" || this.type === "textarea")
            )
              this.field.setSelectionRange(
                selectionStart,
                selectionEnd,
                selectionDirection
              );
          },
          /**
           * decrements by a multiple of step
           *
           * @param {number} [n=1]
           * @memberof SimpleFieldsContainer
           */
        },
        {
          key: "stepDown",
          value: function stepDown() {
            var n =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : 1;
            if (this.field && this.numeric) this.field.stepDown();
          },
          /**
           * increments by a multiple of step
           *
           * @param {number} [n=1]
           * @memberof SimpleFieldsContainer
           */
        },
        {
          key: "stepUp",
          value: function stepUp() {
            var n =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : 1;
            if (this.field && this.numeric) this.field.stepUp();
          },
          /**
           * checks validation constraints and returns error data
           * @memberof SimpleFieldsContainer
           */
        },
        {
          key: "validate",
          value: function validate() {
            var legend = this.field.querySelector("legend");

            if (this.requiredError) {
              this.error = true;
              this.errorMessage = this.requiredMessage || "required";
            } else if (this.numberError) {
              this.error = true;
              this.errorMessage =
                this.numberMessage ||
                (this.numberError > 0
                  ? "select ".concat(this.numberError, " more")
                  : "select ".concat(0 - this.numberError, " fewer"));
            } else if (this.patternError) {
              this.error = true;
              this.errorMessage = this.patternMessage || "invalid format";
            }

            if (this.hasFieldset && legend) {
              legend.innerHTML = legend.innerHTML.replace(
                /\**\s*$/,
                this.error ? "*" : ""
              );
              legend.style.color = this.error
                ? "var(--simple-fields-error-color, #b40000)"
                : "";
            } // return true if we have no errors
            // return false if we DO have errors

            return !this.error;
          },
          /**
           * fires when error changes
           * @event error-changed
           */
        },
        {
          key: "_fireErrorChanged",
          value: function _fireErrorChanged() {
            this.dispatchEvent(
              new CustomEvent("error-changed", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: this,
              })
            );
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
          key: "_getFieldsetValue",
          value: function _getFieldsetValue() {
            var checked, value;

            if (this.field.querySelector("input[type=radio]")) {
              checked = this.field.querySelector("input:checked");
              value = checked ? checked.value : undefined;
            } else if (this.field.querySelector("input[type=checkbox]")) {
              value = [];
              checked = this.field.querySelectorAll("input:checked");
              checked.forEach(function (input) {
                return value.push(input.value);
              });
            }

            return value;
          },
          /**
           * gets the value of a field based on field type
           *
           * @memberof SimpleFieldsContainer
           */
        },
        {
          key: "_getFieldValue",
          value: function _getFieldValue() {
            var _this3 = this;

            var value;

            if (this.field) {
              if (this.hasFieldset) {
                value = this._getFieldsetValue();
              } else if (this.type === "checkbox") {
                value = this.field.checked ? true : false;
              } else if (this.type === "radio") {
                value = this.field.checked ? true : false;
              } else if (this.type === "select") {
                value = this.multiple
                  ? Object.keys(this.field.selectedOptions).map(function (
                      option
                    ) {
                      return _this3.field.selectedOptions[option].value;
                    })
                  : this.field.selectedOptions[0].value;
              } else {
                value = this.field.value;
              }
            }

            return value;
          },
          /**
           * gets a valid version of a given type
           *
           * @param {string} type
           * @returns {string}
           * @memberof SimpleFieldsContainer
           */
        },
        {
          key: "_getValidType",
          value: function _getValidType(type) {
            if (type === "datetime" && this.validTypes.includes(type)) {
              return "datetime-local";
            } else if (this.validTypes.includes(type)) {
              return type;
            }

            return "text";
          },
          /**
           * handles field changes by field type
           *
           * @memberof SimpleFieldsContainer
           */
        },
        {
          key: "_handleFieldChange",
          value: function _handleFieldChange() {
            if (this.type === "text" || this.type === "textarea")
              this._updateCount();
            if (this.autovalidate) this.validate();
            this.value = this._getFieldValue();
            if (this.type === "textarea") this.autoGrow();
          },
          /**
           * observes slotted field and listens for focusout
           * override for fields in shadow DOM
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
              this.slottedFieldObserver.observe(this, {
                attributeFilter: ["disabled", "readonly", "required", "slot"],
                childlist: true,
              });

              this._updateField();

              this.addEventListener("click", this.focus);
              this.addEventListener("focusout", this._onFocusout);
              this.addEventListener("focusin", this._onFocusin);
            } else {
              this.slottedFieldObserver.disconnect();
              this.removeEventListener("click", this.focus);
              this.removeEventListener("focusout", this._onFocusout);
              this.removeEventListener("focusin", this._onFocusin);
            }
          },
          /**
           * handles focusout validation
           *
           * @memberof SimpleFieldsContainer
           */
        },
        {
          key: "_onFocusin",
          value: function _onFocusin() {
            this.error = false;
          },
          /**
           * handles focusout validation
           *
           * @memberof SimpleFieldsContainer
           */
        },
        {
          key: "_onFocusout",
          value: function _onFocusout() {
            if (this.autovalidate) this.validate();
          },
          /**
           * updates field an type
           *
           * @memberof SimpleFieldsContainer
           */
        },
        {
          key: "_updateField",
          value: function _updateField() {
            var oldfield = this.field;
            this.field =
              this.querySelector && this.querySelector("[slot=field]")
                ? this.querySelector("[slot=field]")
                : undefined;
            this.id = "".concat(this.fieldId || "", "-wrapper");

            if (this.field) {
              var tag = this.field.tagName.toLowerCase(),
                type = this.field.getAttribute("type") || "text";
              this.type = this._getValidType(tag === "input" ? type : tag);
              this.required = this.field.required;
              this.disabled = this.field.disabled;
              this.readonly = this.field.readonly;
              this.field.setAttribute("aria-describedby", "field-bottom");
              /** add event listeners */

              this.addEventListener("change", this._handleFieldChange);
              this.addEventListener("input", this._handleFieldChange);
              /** field type-specific adjustments */

              if (this.type === "select") this.multiple = this.field.multiple;

              if (this.type === "textarea") {
                if (!this.field.getAttribute("rows"))
                  this.field.setAttribute("rows", 1);
                this.field.addEventListener("keydown", function (e) {
                  return e.stopPropagation();
                });
              }

              if (this.type === "fieldset") {
                var legend = this.querySelector("legend");

                if (legend) {
                  legend.style.fontSize =
                    "var(--simple-fields-detail-font-size, 12px)";
                  legend.style.fontFamily =
                    "var(--simple-fields-detail-font-family, sans-serif)";
                  legend.style.lineHeight =
                    "var(--simple-fields-detail-line-height, 22px)";
                  legend.style.paddingInlineStart = 0;
                  legend.style.paddingInlineEnd = 0;
                }

                this.querySelectorAll("label, input").forEach(function (el) {
                  return (el.style.marginRight =
                    "var(--simple-fields-margin, 16px)");
                });
                this.querySelectorAll("label input").forEach(function (el) {
                  return (el.style.marginLeft =
                    "calc(0 - var(--simple-fields-margin, 16px))");
                });
              }
            } else {
              this.disabled = false;
              this.readonly = false;
              this.required = false;
              this.type = undefined;
              /** remove event listeners from old field */

              if (oldfield) {
                if (oldfield.tagName.toLowerCase() === "textarea")
                  oldfield.addEventListener("keydown", function (e) {
                    return e.stopPropagation();
                  });
                oldfield.removeEventListener("change", this._handleFieldChange);
                oldfield.removeEventListener("input", this._handleFieldChange);
              }
            }

            if (this.field && this.__delayedFocus) this.focus();
          },
          /**
           * updates counter and sets maximum word count
           *
           * @memberof SimpleFieldsContainer
           */
        },
        {
          key: "_updateCount",
          value: function _updateCount() {
            var _this4 = this;

            var count = "",
              word = "[\\w\\-\\']+",
              wordcounter = new RegExp(word, "gim"),
              maxlength =
                this.field.getAttribute("maxlength") || this.maxlength || false,
              maxword = this.maxwords || false,
              countmax = this.counter === "word" ? maxword : maxlength,
              regex = new RegExp(".{0,".concat(maxlength || 1, "}"), "g"),
              wordregex = new RegExp(
                "(".concat(word, "\\W*){0,").concat(maxword || 1, "}"),
                "g"
              ),
              matchval = function matchval(regex) {
                return ((_this4.field || {}).value || "").match(regex);
              },
              length = function length() {
                return !_this4.field.value ? 0 : _this4.field.value.length;
              },
              wordlength = function wordlength() {
                return !_this4.field ||
                  !_this4.field.value ||
                  !matchval(wordcounter)
                  ? 0
                  : matchval(wordcounter).length;
              },
              correctLength = function correctLength(length, max, regex) {
                if (
                  length &&
                  max &&
                  max < length &&
                  _this4.field.value.match(regex)
                ) {
                  _this4.field.value = matchval(regex)[0].trim();
                }
              };

            correctLength(length(), maxlength, regex);
            correctLength(wordlength(), maxword, wordregex);
            count = this.counter === "word" ? wordlength() : length();
            if (
              this.counter !== "none" &&
              this.shadowRoot &&
              this.shadowRoot.querySelector("#fieldmeta")
            )
              this.shadowRoot.querySelector("#fieldmeta").innerHTML = countmax
                ? "".concat(count, "/").concat(countmax)
                : count;
          },
        },
        {
          key: "descriptionTemplate",
          get: function get() {
            return (0, _litElement.html)(_templateObject3(), this.description);
          },
          /**
           * template for slotted or shadow DOM error message
           *
           * @readonly
           * @returns {object}
           * @memberof SimpleFieldsContainer
           */
        },
        {
          key: "errorTemplate",
          get: function get() {
            return (0, _litElement.html)(
              _templateObject4(),
              !this.error,
              this.errorMessage
            );
          },
          /**
           *
           * gets bottom (metadata, description, and error message) of a field
           *
           * @readonly
           * @returns {object}
           * @memberof SimpleFieldsContainer
           */
        },
        {
          key: "fieldBottom",
          get: function get() {
            return (0, _litElement.html)(
              _templateObject5(),
              this.descriptionTemplate,
              this.errorTemplate,
              this.fieldMeta
            );
          },
          /**
           * gets field's id
           *
           * @readonly
           * @returns {string}
           * @memberof SimpleFieldsContainer
           */
        },
        {
          key: "fieldId",
          get: function get() {
            return "".concat(this.id || "field", ".input");
          },
          /**
           * template for slotted or shadow DOM label
           *
           * @readonly
           * @returns {object}
           * @memberof SimpleFieldsContainer
           */
        },
        {
          key: "fieldMainTemplate",
          get: function get() {
            return (0, _litElement.html)(
              _templateObject6(),
              this.inline ||
                ["checkbox", "color", "radio"].includes(this.type || "text")
                ? "field-main inline"
                : "field-main",
              this.labelTemplate,
              this.prefixTemplate,
              this.suffixTemplate
            );
          },
          /**
           *
           * gets field metadata
           *
           * @readonly
           * @returns {object}
           * @memberof SimpleFieldsContainer
           */
        },
        {
          key: "fieldMeta",
          get: function get() {
            return (0, _litElement.html)(_templateObject7());
          },
        },
        {
          key: "hasFieldset",
          get: function get() {
            return this.type === "fieldset";
          },
          /**
           * template for slotted or shadow DOM label
           *
           * @readonly
           * @returns {object}
           * @memberof SimpleFieldsContainer
           */
        },
        {
          key: "labelTemplate",
          get: function get() {
            return (0, _litElement.html)(
              _templateObject8(),
              this.fieldId,
              this.type === "fieldset",
              this.label,
              this.error || this.required ? "*" : ""
            );
          },
        },
        {
          key: "multicheck",
          get: function get() {
            return (
              this.hasFieldset &&
              this.field.querySelector("input[type=checkbox]")
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
              min =
                this.type === "select"
                  ? this.min
                  : this.multicheck
                  ? this.minchecked
                  : false,
              max =
                this.type === "select"
                  ? this.max
                  : this.multicheck
                  ? this.maxchecked
                  : false;
            var more = min && items && min > items ? min - items : false,
              less = max && items && max < items ? max - items : more;
            return less;
          },
          /**
           * determines if field is numeric
           *
           * @readonly
           * @returns {boolean}
           * @memberof SimpleFieldsContainer
           */
        },
        {
          key: "numeric",
          get: function get() {
            return [
              "date",
              "month",
              "week",
              "time",
              "datetime-local",
              "number",
              "range",
            ].includes(this.type);
          },
          /**
           * determines if value does not match regex pattern
           *
           * @readonly
           * @memberof SimpleFieldsContainer
           */
        },
        {
          key: "patternError",
          get: function get() {
            var _this5 = this;

            return (
              this.pattern &&
              this.pattern !== "" &&
              this._getFieldValue() &&
              (!this.field.multiple
                ? !this._getFieldValue().match(this.pattern)
                : this._getFieldValue().filter(function (value) {
                    return !value.match(_this5.pattern);
                  }))
            );
          },
          /**
           * template for slotted or shadow DOM prefix
           *
           * @readonly
           * @returns {object}
           * @memberof SimpleFieldsContainer
           */
        },
        {
          key: "prefixTemplate",
          get: function get() {
            return (0, _litElement.html)(_templateObject9(), this.prefix);
          },
          /**
           * determines if field is required and blank
           *
           * @readonly
           * @memberof SimpleFieldsContainer
           */
        },
        {
          key: "requiredError",
          get: function get() {
            return !this._getFieldValue() && this.required;
          },
          /**
           * mutation observer that updates field property with slotted field
           * override for shadow DOM field
           *
           * @readonly
           * @returns {object}
           * @memberof SimpleFieldsContainer
           */
        },
        {
          key: "slottedFieldObserver",
          get: function get() {
            return new MutationObserver(this._updateField);
          },
          /**
           * template for slotted or shadow DOM suffix
           *
           * @readonly
           * @returns {object}
           * @memberof SimpleFieldsContainer
           */
        },
        {
          key: "suffixTemplate",
          get: function get() {
            return (0, _litElement.html)(_templateObject10(), this.suffix);
          },
        },
      ]);

      return _class;
    })(SuperClass)
  );
};
/**
 *`simple-fields-container`
 * Progressive enhanced container HTML fields
 * with label, description, error massage,
 * and aria-invalid functionality if needed.
 *
 * @customElement
 * @group simple-fields
 * @element simple-fields-container
 * @demo ./demo/container.html
 * @class SimpleFieldsContainer
 * @extends {SimpleFieldsContainerBehaviors(LitElement)}
 */

exports.SimpleFieldsContainerBehaviors = SimpleFieldsContainerBehaviors;

var SimpleFieldsContainer =
  /*#__PURE__*/
  (function (_SimpleFieldsContaine) {
    _inherits(SimpleFieldsContainer, _SimpleFieldsContaine);

    function SimpleFieldsContainer() {
      _classCallCheck(this, SimpleFieldsContainer);

      return _possibleConstructorReturn(
        this,
        _getPrototypeOf(SimpleFieldsContainer).apply(this, arguments)
      );
    }

    return SimpleFieldsContainer;
  })(SimpleFieldsContainerBehaviors(_litElement.LitElement));

exports.SimpleFieldsContainer = SimpleFieldsContainer;
window.customElements.define(SimpleFieldsContainer.tag, SimpleFieldsContainer);

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimpleFieldsTagList = void 0;

var _litElement = require("lit-element/lit-element.js");

var _simpleFieldsField = require("./simple-fields-field.js");

var _utils = require("@lrnwebcomponents/utils/utils.js");

require("./simple-tag.js");

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

function _templateObject4() {
  var data = _taggedTemplateLiteral([
    '\n          <simple-tag\n            value="',
    '"\n            @simple-tag-remove-clicked="',
    '"\n          ></simple-tag>\n        ',
  ]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n      ", "\n      ", "\n    "]);

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
    '"\n          class="field box-input"\n          ?disabled="',
    '"\n          @focus="',
    '"\n          ?hidden="',
    '"\n          id="',
    '"\n          @input="',
    '"\n          @keydown="',
    '"\n          @keyup="',
    '"\n          name="',
    '"\n          .placeholder="',
    '"\n          ?readonly="',
    '"\n          ?required="',
    '"\n          tabindex="0"\n          type="',
    '"\n          value="',
    '"\n          part="option-input"\n        />\n    ',
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
    "\n        :host {\n          display: block;\n        }\n        #field-main-inner {\n          align-items: center;\n          flex-wrap: wrap;\n        }\n        simple-tag {\n          flex: 0 1 auto;\n          margin: calc(0.5 * var(--simple-fields-button-padding, 2px)) var(--simple-fields-button-padding, 2px);\n        }\n      ",
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
 *`simple-fields-tag-list`
 * input tags and validate an array of input
 * can return as a string or object based on
 * requirements of the implementing element
 *
 * @customElement
 * @group simple-fields
 * @element simple-fields-code
 * @demo ./demo/field.html
 * @class SimpleFieldsTagList
 * @extends {class SimpleFieldsTagList extends SimpleFieldsFieldBehaviors(LitElement) {
(LitElement)}
 */
var SimpleFieldsTagList =
  /*#__PURE__*/
  (function (_SimpleFieldsFieldBeh) {
    _inherits(SimpleFieldsTagList, _SimpleFieldsFieldBeh);

    _createClass(
      SimpleFieldsTagList,
      [
        {
          key: "render",
          value: function render() {
            return !this.hasFieldSet
              ? _get(
                  _getPrototypeOf(SimpleFieldsTagList.prototype),
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
            return "simple-fields-tag-list";
          },
        },
        {
          key: "styles",
          get: function get() {
            return [].concat(
              _toConsumableArray(
                _get(_getPrototypeOf(SimpleFieldsTagList), "styles", this)
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
              _get(_getPrototypeOf(SimpleFieldsTagList), "properties", this),
              {
                /**
                 * error message when field is required and has no value
                 */
                requiredMessage: {
                  type: String,
                },
                tagList: {
                  type: Array,
                  attribute: "tag-list",
                },

                /**
                 * Current value of the form control. Submitted with the form as part of a name/value pair.
                 */
                value: {
                  reflect: true,
                },
                label: {
                  type: String,
                },
              }
            );
          },
        },
      ]
    );

    function SimpleFieldsTagList() {
      var _this;

      _classCallCheck(this, SimpleFieldsTagList);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(SimpleFieldsTagList).call(this)
      );
      _this.label = "Tags";
      _this.value = "";
      _this.tagList = [];
      _this.id = _this._generateUUID();
      return _this;
    }

    _createClass(SimpleFieldsTagList, [
      {
        key: "disconnectedCallback",
        value: function disconnectedCallback() {
          var _this2 = this;

          this.removeEventListener("click", function (e) {
            return _this2.focus();
          });

          _get(
            _getPrototypeOf(SimpleFieldsTagList.prototype),
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
            if (propName === "value") _this3._fireValueChanged();
          });
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
        key: "getInput",
        value: function getInput() {
          return (0, _litElement.html)(
            _templateObject2(),
            this.autofocus,
            this.describedBy || "",
            this.error ? "true" : "false",
            this._onFocusout,
            this._handleFieldChange,
            this.disabled,
            this._onFocusin,
            this.hidden,
            this.id,
            this._handleFieldChange,
            this._handleKeydown,
            this._handleKeyup,
            this.id,
            this.placeholder || "",
            this.readonly,
            this.required,
            this.type,
            this.value
          );
        },
      },
      {
        key: "removeTag",
        value: function removeTag(e) {
          this.tagList = _toConsumableArray(
            this.tagList.filter(function (i) {
              if (i === e.detail.value) {
                return false;
              }

              return true;
            })
          );
        },
      },
      {
        key: "_handleKeydown",
        value: function _handleKeydown(e) {
          if (
            e.key === "Enter" &&
            this.shadowRoot.querySelector("input").value != ""
          ) {
            this._updateTaglist();
          }
        },
      },
      {
        key: "_handleKeyup",
        value: function _handleKeyup(e) {
          if (
            e.key === "," &&
            this.shadowRoot.querySelector("input").value != ""
          ) {
            this._updateTaglist();
          }
        },
      },
      {
        key: "_updateTaglist",
        value: function _updateTaglist() {
          // @todo prevent same tag from being added twice
          var tagList = this.tagList,
            tag = this.shadowRoot.querySelector("input").value;
          tagList.push(tag.replace(/,$/, "").trim());
          this.tagList = _toConsumableArray(tagList);
          this.shadowRoot.querySelector("input").value = "";
        },
        /**
         * overridden mutation observer
         *
         * @readonly
         * @memberof SimpleFieldsContainerBehaviors
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
        /**
         * listens for focusout
         * overridden for fields in shadow DOM
         *
         * @param {boolean} [init=true] whether to start observing or disconnect observer
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
      },
      {
        key: "prefixTemplate",
        get: function get() {
          var _this4 = this;

          return (0, _litElement.html)(
            _templateObject3(),
            _get(
              _getPrototypeOf(SimpleFieldsTagList.prototype),
              "prefixTemplate",
              this
            ),
            this.tagList.map(function (tag) {
              return (0,
              _litElement.html)(_templateObject4(), tag, _this4.removeTag);
            })
          );
        },
      },
      {
        key: "slottedFieldObserver",
        get: function get() {},
      },
    ]);

    return SimpleFieldsTagList;
  })(
    (0, _simpleFieldsField.SimpleFieldsFieldBehaviors)(_litElement.LitElement)
  );

exports.SimpleFieldsTagList = SimpleFieldsTagList;
window.customElements.define(SimpleFieldsTagList.tag, SimpleFieldsTagList);

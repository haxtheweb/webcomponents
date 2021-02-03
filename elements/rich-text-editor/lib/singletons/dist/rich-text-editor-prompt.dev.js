"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.RichTextEditorPrompt = void 0;

var _litElement = require("lit-element/lit-element.js");

var _richTextEditorButton = require("../buttons/rich-text-editor-button.js");

require("@lrnwebcomponents/simple-popover/simple-popover.js");

require("@lrnwebcomponents/simple-fields/simple-fields.js");

require("./rich-text-editor-selection.js");

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
    "\n        :host {\n          --simple-fields-color: var(--simple-toolbar-focus-color, #000);\n          --simple-fields-invalid-color: var(\n            --simple-toolbar-error-color,\n            #800\n          );\n        }\n        #prompt {\n          display: block;\n          width: 300px;\n          max-width: 300px;\n          --simple-popover-padding: 0px;\n          z-index: 2;\n        }\n        #prompt[hidden] {\n          display: none;\n        }\n        #prompt #form {\n          display: flex;\n          flex-direction: column;\n          align-items: center;\n          justify-content: space-between;\n          z-index: 2;\n        }\n        #formfields {\n          width: calc(100% - 20px);\n          padding: 10px 10px 0;\n          overflow: visible;\n        }\n        #prompt simple-fields-field {\n          padding: 0;\n        }\n        #confirm,\n        #cancel {\n          min-width: unset;\n        }\n        #cancel {\n          color: var(--simple-toolbar-button-color);\n          background-color: var(--simple-toolbar-button-bg);\n        }\n        #cancel:focus,\n        #cancel:hover {\n          color: var(--simple-toolbar-button-hover-color);\n          background-color: var(--simple-toolbar-button-hover-bg);\n        }\n        #confirm {\n          color: var(--simple-toolbar-button-color);\n          background-color: var(--simple-toolbar-button-bg);\n        }\n        #confirm:focus,\n        #confirm:hover {\n          color: var(--simple-toolbar-button-hover-color);\n          background-color: var(--simple-toolbar-button-hover-bg);\n        }\n        .actions {\n          width: calc(100% - 20px);\n          padding: 0 10px 3px;\n          display: flex;\n          align-items: center;\n          justify-content: flex-end;\n        }\n        .confirm-or-cancel {\n          min-width: 40px;\n        }\n      ",
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
    '\n      <simple-popover\n        id="prompt"\n        ?auto="',
    '"\n        for="',
    '"\n        ?hidden="',
    '"\n        position="bottom"\n        position-align="center"\n        .target="',
    '"\n      >\n        <form\n          id="form"\n          @blur="',
    '"\n          @focus="',
    '"\n        >\n          <simple-fields\n            id="formfields"\n            hide-line-numbers\n            .fields="',
    '"\n            @fields-ready="',
    '"\n            .value="',
    '"\n          ></simple-fields>\n          <div class="actions">\n            <rich-text-editor-button\n              id="cancel"\n              controls="',
    '"\n              label="Cancel"\n              icon="clear"\n              @click="',
    '"\n              tabindex="0"\n            >\n            </rich-text-editor-button>\n            <rich-text-editor-button\n              id="confirm"\n              controls="',
    '"\n              @click="',
    '"\n              icon="check"\n              label="OK"\n              tabindex="0"\n            >\n            </rich-text-editor-button>\n          </div>\n        </form>\n      </simple-popover>\n    ',
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
 * `rich-text-editor-prompt`
 * `A utility that manages state of multiple rich-text-prompts on one page.`
 *
 * @element rich-text-editor-prompt
 */
var RichTextEditorPrompt =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(RichTextEditorPrompt, _LitElement);

    _createClass(
      RichTextEditorPrompt,
      [
        {
          key: "render",
          value: function render() {
            return (0, _litElement.html)(
              _templateObject(),
              !this.hidden,
              this.selection ? this.selection.id : "",
              this.hidden,
              this.selection,
              this._handleBlur,
              this._handleFocus,
              this.fields,
              this._handleReady,
              this.value,
              this.selection ? this.selection.id : "",
              this._cancel,
              this.selection ? this.selection.id : "",
              this._confirm
            );
          },
          /**
           * Store tag name to make it easier to obtain directly.
           */
        },
        {
          key: "hidden",
          get: function get() {
            return !this.__opened;
          },
          /**
           * Makes sure there is a utility ready and listening for elements.
           */
        },
      ],
      [
        {
          key: "styles",
          get: function get() {
            return [].concat(
              _toConsumableArray(_richTextEditorButton.RichTextStyles),
              [(0, _litElement.css)(_templateObject2())]
            );
          },
        },
        {
          key: "tag",
          get: function get() {
            return "rich-text-editor-prompt";
          }, // properties available to custom element for data binding
        },
        {
          key: "properties",
          get: function get() {
            return {
              /**
               * fields for prompt popover.
               */
              fields: {
                type: Array,
              },

              /**
               * selected text.
               */
              range: {
                type: Object,
              },

              /**
               * prefilled value of prompt
               */
              value: {
                type: Object,
              },

              /**
               * whether prompt has focus
               */
              __focused: {
                type: Boolean,
              },

              /**
               * whether prompt is hovered
               */
              __hovered: {
                type: Boolean,
              },

              /**
               * whether prompt isopen
               */
              __opened: {
                type: Boolean,
              },
            };
          },
        },
      ]
    );

    function RichTextEditorPrompt() {
      var _this;

      _classCallCheck(this, RichTextEditorPrompt);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(RichTextEditorPrompt).call(this)
      );
      window.addEventListener(
        "rich-text-editor-prompt-open",
        _this.open.bind(_assertThisInitialized(_this))
      ); // sets instance to current instance

      if (!window.RichTextEditorPrompt.instance) {
        window.RichTextEditorPrompt.instance = _assertThisInitialized(_this);
        return _possibleConstructorReturn(_this, _assertThisInitialized(_this));
      }

      return _this;
    }

    _createClass(RichTextEditorPrompt, [
      {
        key: "firstUpdated",
        value: function firstUpdated(changedProperties) {
          var _this2 = this;

          this.selection.addEventListener("change", function (e) {
            return setTimeout(_this2._handleChange(e), 300);
          });
          this.addEventListener("focus", this._handleFocus);
          this.addEventListener("focus", this._handleFocus);
          this.addEventListener("blur", this._handleBlur);
        },
      },
      {
        key: "updated",
        value: function updated(changedProperties) {
          var _this3 = this;

          _get(
            _getPrototypeOf(RichTextEditorPrompt.prototype),
            "updated",
            this
          ).call(this, changedProperties);

          changedProperties.forEach(function (oldValue, propName) {
            if (["__focused", "__hovered", "__opened"].includes(propName))
              setTimeout(_this3._handleChange.bind(_this3), 300);
          });
        },
      },
      {
        key: "_handleReady",
        value: function _handleReady(e) {
          e.detail.focus();
        },
      },
      {
        key: "_handleFocus",
        value: function _handleFocus(e) {
          this.__focused = true;
        },
      },
      {
        key: "_handleBlur",
        value: function _handleBlur(e) {
          this.__focused = false;
        },
      },
      {
        key: "_handleChange",
        value: function _handleChange(e) {
          if (this.__opened && !this.__focused && !this.__hovered)
            this._cancel();
        },
      },
      {
        key: "open",
        value: function open(e) {
          if (e) {
            this.__opened = true;
            this.shadowRoot.querySelector("#cancel").focus();
            this.button = e.detail;
            this.fields = _toConsumableArray(e.detail.fields);
            this.__selection = e.detail.__selection;
            this.selectedNode = e.detail.selectedNode;
            this.value = _objectSpread({}, e.detail.value);
          }
        },
      },
      {
        key: "close",
        value: function close() {
          this.__opened = false;
          this.__focused = false;
          this.button = undefined;
          this.fields = [];
          this.value = {};
        },
        /**
         * Handles cancel button
         * @param {event} e event
         * @returns {void}
         */
      },
      {
        key: "_cancel",
        value: function _cancel(e) {
          if (e) e.preventDefault();
          if (this.button) this.button.cancel();
          this.close();
        },
        /**
         * Handles confirm button
         * @param {event} e event
         * @returns {void}
         */
      },
      {
        key: "_confirm",
        value: function _confirm(e) {
          e.preventDefault();
          this.button.confirm(this.value);
          this.close();
        },
      },
      {
        key: "selection",
        get: function get() {
          return window.RichTextEditorSelection.requestAvailability();
        },
      },
    ]);

    return RichTextEditorPrompt;
  })(_litElement.LitElement);

exports.RichTextEditorPrompt = RichTextEditorPrompt;
window.customElements.define(RichTextEditorPrompt.tag, RichTextEditorPrompt);
// register globally so we can make sure there is only one
window.RichTextEditorPrompt = window.RichTextEditorPrompt || {}; // request if this exists. This helps invoke element existing in dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through same modal

window.RichTextEditorPrompt.requestAvailability = function () {
  if (!window.RichTextEditorPrompt.instance) {
    window.RichTextEditorPrompt.instance = document.createElement(
      "rich-text-editor-prompt"
    );
    document.body.appendChild(window.RichTextEditorPrompt.instance);
  }

  return window.RichTextEditorPrompt.instance;
};

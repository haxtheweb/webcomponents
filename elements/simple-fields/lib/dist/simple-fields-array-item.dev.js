"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimpleFieldsArrayItem = void 0;

var _litElement = require("lit-element/lit-element.js");

var _simpleFieldsFieldset = require("./simple-fields-fieldset.js");

var _simpleFieldsUi = require("./simple-fields-ui.js");

require("@lrnwebcomponents/simple-icon/simple-icon.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icons.js");

require("@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-button.js");

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
    '\n        :host {\n          padding: 0;\n          border-radius: var(--simple-fields-border-radius, 2px);\n          display: block;\n          border: none;\n          transform: rotate(0deg);\n          transition: all 0.5s ease;\n        }\n        :host([disabled]) {\n          opacity: 0.5;\n        }\n        :host([aria-expanded="true"]) {\n          padding: var(--simple-fields-margin, 16px)\n            var(--simple-fields-margin-small, 8px);\n          outline: 1px solid var(--simple-fields-border-color-light, #ccc);\n          transition: all 0.5s ease;\n        }\n        :host([error]) {\n          outline: 1px solid var(--simple-fields-error-color, #dd2c00);\n          transition: border 0.5s ease;\n        }\n        :host(:focus-within) {\n          z-index: 2;\n        }\n        *[aria-controls="content"][disabled] {\n          cursor: not-allowed;\n        }\n        #drag-handle {\n          flex: 0 1 auto;\n        }\n        #preview {\n          flex: 1 0 auto;\n          margin: 0;\n        }\n        #heading,\n        .heading-inner {\n          display: flex;\n          justify-content: space-between;\n          align-items: center;\n        }\n        #content {\n          overflow: hidden;\n          max-height: 0;\n        }\n        :host #content-inner {\n          display: flex;\n          align-items: flex-end;\n          justify-content: space-between;\n          overflow: hidden;\n          max-height: 0;\n          transition: max-height 0.75s ease 0.1s;\n        }\n        :host([aria-expanded="true"]) #content {\n          max-height: 20000vh;\n          transition: max-height 0.75s ease 0.1s;\n        }\n        :host([aria-expanded="true"]) #content-inner {\n          max-height: 20000vh;\n        }\n        #content-inner > * {\n          flex: 1 1 auto;\n        }\n        #remove {\n          flex: 0 0 auto;\n          color: var(--simple-fields-error-color, #ac0000);\n        }\n        #heading {\n          margin-right: calc(0 - var(--simple-fields-margin-small, 8px) / 2);\n        }\n        #expand {\n          margin-left: calc(var(--simple-fields-margin-small, 8px) / 2);\n        }\n        #drag-handle {\n          margin-left: calc(var(--simple-fields-margin-small, 8px) / 2);\n        }\n        :host([aria-expanded=true]) #expand::part(icon) {\n          transform: rotate(90deg);\n          transition: all 0.5s ease;\n        }\n        ::slotted(*:first-child) {\n          margin-top: 0;\n        }\n        ::slotted(*:last-child){\n          margin-bottom: 0;\n        }\n      ',
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
    '\n      <div id="heading" part="heading">\n        <simple-toolbar-button\n          id="drag-handle"\n          controls="',
    '"\n          icon="icons:open-with"\n          label="Reorder this item"\n          ?hidden="',
    '"\n          ?disabled="',
    '"\n          part="drag"\n        >\n        </simple-toolbar-button>\n        <div id="preview" part="preview"><slot name="preview"></slot></div>\n        <simple-toolbar-button\n          id="expand"\n          controls="',
    '"\n          icon="more-vert"\n          label="Toggle expand"\n          @click="',
    '"\n          toggles\n          ?toggled="',
    '"\n          part="expand"\n        >\n        </simple-toolbar-button>\n      </div>\n      <div id="content" part="content">\n        <div id="content-inner" part="content-inner">\n          <div><slot></slot></div>\n          <simple-toolbar-button\n            id="remove"\n            controls="',
    '"\n            icon="delete"\n            label="Remove this item"\n            ?disabled="',
    '"\n            @click="',
    '"\n            part="remove"\n          >\n          </simple-toolbar-button>\n        </div>\n      </div>\n    ',
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
 * `simple-fields-array-item`
 * an accessible expand collapse
 * 
### Styling

`<simple-fields-array-item>` provides the following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--simple-fields-array-item-margin` | margin around simple-fields-array-item | 15px 0
`--simple-fields-array-item-border` | border around simple-fields-array-item | 1px solid
`--simple-fields-array-item-horizontal-padding` | horizontal padding inside simple-fields-array-item | 16px
`--simple-fields-array-item-horizontal-padding-left` | left padding inside simple-fields-array-item | `--simple-fields-array-item-horizontal-padding`
`--simple-fields-array-item-horizontal-padding-right` | right padding inside simple-fields-array-item | `--simple-fields-array-item-horizontal-padding`
`--simple-fields-array-item-vertical-padding` | vertical padding inside simple-fields-array-item | 16px
`--simple-fields-array-item-horizontal-padding-top` | top padding inside simple-fields-array-item | `--simple-fields-array-item-vertical-padding`
`--simple-fields-array-item-horizontal-padding-bottom` | bottom padding inside simple-fields-array-item | --simple-fields-array-item-vertical-padding
`--simple-fields-array-item-border-between` | border between simple-fields-array-item heading and content | --simple-fields-array-item-border
`--simple-fields-array-item-heading-font-weight` | font-weight for simple-fields-array-item heading | bold
`--simple-fields-array-item-heading-color` | text color for simple-fields-array-item heading | unset
`--simple-fields-array-item-heading-background-color` | background-color for simple-fields-array-item heading | unset
 *
 * @group simple-fields
 * @element simple-fields-array-item
 * @demo ./demo/schema.html Schema
 * @demo ./demo/form.html Form
 */
var SimpleFieldsArrayItem =
  /*#__PURE__*/
  (function (_SimpleFieldsFieldset) {
    _inherits(SimpleFieldsArrayItem, _SimpleFieldsFieldset);

    _createClass(
      SimpleFieldsArrayItem,
      [
        {
          key: "render",
          value: function render() {
            var _this2 = this;

            return (0, _litElement.html)(
              _templateObject(),
              this.id,
              !this.sortable,
              this.disabled,
              this.id,
              this.toggle,
              this.expanded,
              this.id,
              this.disabled,
              function (e) {
                return _this2._handleRemove();
              }
            );
          },
        },
      ],
      [
        {
          key: "styles",
          get: function get() {
            return [].concat(
              _toConsumableArray(
                _get(_getPrototypeOf(SimpleFieldsArrayItem), "styles", this)
              ),
              _toConsumableArray(_simpleFieldsUi.SimpleFieldsButtonStyles),
              [(0, _litElement.css)(_templateObject2())]
            );
          },
        },
        {
          key: "tag",
          get: function get() {
            return "simple-fields-array-item";
          },
        },
        {
          key: "properties",
          get: function get() {
            return {
              /**
               * is disabled?
               */
              expanded: {
                type: Boolean,
              },

              /**
               * is disabled?
               */
              disabled: {
                type: Boolean,
                reflect: true,
                attribute: "disabled",
              },

              /**
               * is disabled?
               */
              sortable: {
                type: Boolean,
                reflect: true,
                attribute: "sortable",
              },

              /**
               * is disabled?
               */
              preview: {
                type: Boolean,
              },

              /**
               * fields to preview by
               */
              previewBy: {
                type: Array,
                reflect: true,
                attribute: "preview-by",
              },
              /**
         * fields to sort by
         * /
        sortBy: {
          type: Array,
          reflect: true,
          attribute: "sort-by"
        }*/
            };
          },
        },
      ]
    );

    function SimpleFieldsArrayItem() {
      var _this;

      _classCallCheck(this, SimpleFieldsArrayItem);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(SimpleFieldsArrayItem).call(this)
      );
      _this.disabled = false;
      _this.sortable = false;
      _this.previewBy = []; //this.sortBy = [];

      return _this;
    }

    _createClass(SimpleFieldsArrayItem, [
      {
        key: "connectedCallback",
        value: function connectedCallback() {
          var _this3 = this;

          _get(
            _getPrototypeOf(SimpleFieldsArrayItem.prototype),
            "connectedCallback",
            this
          ).call(this);

          setTimeout(function () {
            /**
             * Fires when constructed, so that parent radio group can listen for it.
             *
             * @event add-item
             */
            _this3.dispatchEvent(
              new CustomEvent("added", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: _this3,
              })
            );
          }, 0);
        },
      },
      {
        key: "updated",
        value: function updated(changedProperties) {
          var _this4 = this;

          changedProperties.forEach(function (oldValue, propName) {
            var expanded = _this4.getAttribute("aria-expanded");

            if (propName === "error")
              _this4.setAttribute("aria-expanded", _this4.error || expanded);
          });
        },
      },
      {
        key: "toggle",

        /**
         * handles individual toggling
         */
        value: function toggle() {
          if (this.getAttribute("aria-expanded") === "true") {
            this.setAttribute("aria-expanded", "false");
          } else {
            this.setAttribute("aria-expanded", "true");
          }
        },
        /**
         * Fires add event
         * @event add
         */
      },
      {
        key: "_handleCopy",
        value: function _handleCopy() {
          this.dispatchEvent(
            new CustomEvent("copy", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: this,
            })
          );
        },
        /**
         * Fires add event
         * @event add
         */
      },
      {
        key: "_handleRemove",
        value: function _handleRemove() {
          this.dispatchEvent(
            new CustomEvent("remove", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: this,
            })
          );
        },
        /**
         * Let the group know that this is gone.
         */
      },
      {
        key: "disconnectedCallback",
        value: function disconnectedCallback() {
          /**
           * Fires when detatched, so that parent radio group will no longer listen for it.
           *
           * @event remoive-item
           */
          this.dispatchEvent(
            new CustomEvent("removed", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: this,
            })
          );

          _get(
            _getPrototypeOf(SimpleFieldsArrayItem.prototype),
            "disconnectedCallback",
            this
          ).call(this);
        },
      },
      {
        key: "slots",
        get: function get() {
          var slots = {};
          this.previewBy.forEach(function (field) {
            return (slots[field] = "preview");
          });
          return slots;
        },
      },
    ]);

    return SimpleFieldsArrayItem;
  })(_simpleFieldsFieldset.SimpleFieldsFieldset);

exports.SimpleFieldsArrayItem = SimpleFieldsArrayItem;
window.customElements.define(SimpleFieldsArrayItem.tag, SimpleFieldsArrayItem);

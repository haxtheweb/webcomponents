"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimpleFieldsArrayItem = void 0;

var _litElement = require("lit-element/lit-element.js");

var _simpleFieldsFieldset = require("./simple-fields-fieldset.js");

var _simpleFieldsUi = require("./simple-fields-ui.js");

var _utils = require("@lrnwebcomponents/utils/utils.js");

require("@lrnwebcomponents/simple-icon/simple-icon.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icons.js");

require("@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-button.js");

require("@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-menu.js");

require("@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-menu-item.js");

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
    '\n        :host {\n          padding: 0;\n          border-radius: var(--simple-fields-border-radius, 2px);\n          display: block;\n          border: none;\n          transform: rotate(0deg);\n          transition: all 0.5s ease;\n          z-index: 1;\n          position: relative;\n        }\n        :host([disabled]) {\n          opacity: 0.5;\n        }\n        :host([aria-expanded="true"]) {\n          padding: var(--simple-fields-margin, 16px)\n            var(--simple-fields-margin-small, 8px);\n          outline: 1px solid var(--simple-fields-border-color-light, #ccc);\n          transition: all 0.5s ease;\n        }\n        :host([error]) {\n          outline: 1px solid var(--simple-fields-error-color, #b40000);\n          transition: border 0.5s ease;\n        }\n        *[aria-controls="content"][disabled] {\n          cursor: not-allowed;\n        }\n        #drag-handle {\n          flex: 0 1 auto;\n          position: relative;\n          overflow: visible;\n        }\n        #preview {\n          flex: 1 0 auto;\n          margin: 0;\n          margin-right: calc(0 - var(--simple-fields-margin-small, 8px) / 2);\n          margin-left: calc(50px + var(--simple-fields-margin-small, 8px) / 2);\n          max-width: calc(\n            100% - 72px - 2 * var(--simple-fields-margin-small, 8px) / 2\n          );\n        }\n        #heading,\n        .heading-inner {\n          display: flex;\n          justify-content: space-between;\n          align-items: flex-start;\n        }\n        #content {\n          overflow: hidden;\n          max-height: 0;\n        }\n        :host #content-inner {\n          display: flex;\n          align-items: flex-end;\n          justify-content: space-between;\n          flex-wrap: wrap;\n          overflow: hidden;\n          max-height: 0;\n          transition: max-height 0.75s ease 0.1s;\n        }\n        :host([aria-expanded="true"]) #content {\n          max-height: 20000vh;\n          transition: max-height 0.75s ease 0.1s;\n        }\n        :host([aria-expanded="true"]) #content-inner {\n          max-height: 20000vh;\n        }\n        #content-inner > * {\n          flex: 1 1 auto;\n        }\n        #copy-delete {\n          display: flex;\n          align-items: stretch;\n          justify-content: flex-end;\n          flex: 1 0 auto;\n        }\n        #copy,\n        #remove {\n          flex: 0 0 auto;\n        }\n        #expand {\n          margin-left: calc(var(--simple-fields-margin-small, 8px) / 2);\n        }\n        #drag-handle {\n          position: absolute;\n          left: 2px;\n          top: 2px;\n          --simple-toolbar-button-white-space: normal !important;\n        }\n        :host([aria-expanded="true"]) #drag-handle {\n          top: var(--simple-fields-margin, 16px);\n          left: var(--simple-fields-margin-small, 8px);\n        }\n        #dropzone {\n          height: 0px;\n        }\n        :host(.dragging) #heading {\n          opacity: 0.5;\n        }\n        :host(.dragging) #content,\n        :host(.dragging) #expand {\n          display: none;\n        }\n        #content:hover,\n        #content:focus-within,\n        #content:hover #content-inner,\n        #content:focus-within #content-inner {\n          overflow: visible;\n        }\n        :host(.dragging) #preview,\n        :host(.droppable) #preview {\n          margin-left: calc(var(--simple-fields-margin-small, 8px) / 2);\n        }\n        :host(.dropzone) #dropzone {\n          background-color: var(\n            --simple-fields-button-focus-background-color,\n            var(--simple-fields-accent-color-light, #d9eaff)\n          );\n          height: 80px;\n        }\n\n        :host([aria-expanded="true"]) #expand::part(icon) {\n          transform: rotate(90deg);\n          transition: all 0.5s ease;\n        }\n        ::slotted([slot="preview"]),\n        ::slotted(*:first-child) {\n          margin-top: 0;\n        }\n        ::slotted([slot="preview"]),\n        ::slotted(*:last-child) {\n          margin-bottom: 0;\n        }\n        :host(:hover),\n        :host(:focus),\n        :host(:focus-within) {\n          z-index: 100000;\n        }\n        :host(.dropzone) {\n          z-index: 1;\n        }\n        [hidden],\n        :host(:first-child) #move-up-outer,\n        :host(:last-child) #move-down-outer,\n        :host(:first-child):last-child #drag-handle {\n          display: none;\n        }\n      ',
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
    '\n      <div id="dropzone"></div>\n      <simple-toolbar-menu\n        id="drag-handle"\n        controls="',
    '"\n        icon="icons:reorder"\n        label="Reorder this item"\n        ?disabled="',
    '"\n        ?hidden="',
    '"\n        part="drag"\n        tooltip-direction="right"\n        @mousedown="',
    '"\n        @mouseup="',
    '"\n      >\n        <simple-toolbar-menu-item id="move-up-outer">\n          <simple-toolbar-button\n            id="move-up"\n            align-horizontal="left"\n            role="menuitem"\n            icon="arrow-upward"\n            show-text-label\n            label="Up"\n            @click="',
    '"\n          >\n          </simple-toolbar-button>\n        </simple-toolbar-menu-item>\n        <simple-toolbar-menu-item id="move-down-outer">\n          <simple-toolbar-button\n            align-horizontal="left"\n            id="move-up"\n            role="menuitem"\n            icon="arrow-downward"\n            show-text-label\n            label="Down"\n            @click="',
    '"\n          >\n          </simple-toolbar-button>\n        </simple-toolbar-menu-item>\n      </simple-toolbar-menu>\n      <div id="heading" part="heading" .item="',
    '">\n        <div id="preview" part="preview"><slot name="preview"></slot></div>\n        <simple-toolbar-button\n          id="expand"\n          controls="',
    '"\n          icon="more-vert"\n          label="Toggle expand"\n          @click="',
    '"\n          toggles\n          ?toggled="',
    '"\n          part="expand"\n          tooltip-direction="left"\n        >\n        </simple-toolbar-button>\n      </div>\n      <div id="content" part="content">\n        <div id="content-inner" part="content-inner">\n          <div><slot></slot></div>\n          <div id="copy-delete">\n            <simple-toolbar-button\n              id="copy"\n              controls="',
    '"\n              icon="content-copy"\n              label="Copy this item"\n              ?disabled="',
    '"\n              @click="',
    '"\n              part="copy"\n              tooltip-direction="left"\n            >\n            </simple-toolbar-button>\n            <simple-toolbar-menu\n              id="remove"\n              icon="delete"\n              label="Remove this item"\n              ?disabled="',
    '"\n              fit-to-visible-bounds\n              part="remove"\n              position-align="end"\n              tooltip-direction="left"\n            >\n              <simple-toolbar-menu-item>\n                <simple-toolbar-button\n                  id="confirm-remove"\n                  class="danger"\n                  align-horizontal="left"\n                  role="menuitem"\n                  show-text-label\n                  controls="',
    '"\n                  icon="delete"\n                  label="Remove"\n                  ?disabled="',
    '"\n                  @click="',
    '"\n                  part="confirm-remove"\n                >\n                </simple-toolbar-button>\n              </simple-toolbar-menu-item>\n            </simple-toolbar-menu>\n          </div>\n        </div>\n      </div>\n    ',
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
 * @customElement
 * @group simple-fields
 * @element simple-fields-array-item
 * @demo ./demo/schema.html Schema
 * @demo ./demo/form.html Form
 * @class SimpleFieldsArrayItem
 * @extends {SimpleFieldsFieldsetBehaviors(LitElement)}
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
              this.disabled,
              this.__dropAccepts || this.__dragging,
              function (e) {
                return (_this2.draggable = "true");
              },
              function (e) {
                return (_this2.draggable = "false");
              },
              this._moveUp,
              this._moveDown,
              this,
              this.id,
              this.toggle,
              this.expanded,
              (this.parentNode || {}).id,
              this.disabled,
              this._handleCopy,
              this.disabled,
              this.id,
              this.disabled,
              this._handleRemove
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
              draggable: {
                type: String,
                reflect: true,
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
              __dragging: {
                type: Boolean,
              },
              __dropAccepts: {
                type: Object,
              },
              __prev: {
                type: Object,
              },
              __next: {
                type: Object,
              },
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
      _this.draggable = "truest";
      _this.previewBy = [];

      _this.addEventListener("dragenter", _this._dragEnter);

      _this.addEventListener("dragleave", _this._dragLeave);

      _this.addEventListener("dragover", _this._dragMoving);

      _this.addEventListener("dragstart", _this._dragStart);

      _this.addEventListener("dragend", _this._dragEnd);

      _this.addEventListener("drop", _this._dragDrop);

      return _this;
    }

    _createClass(SimpleFieldsArrayItem, [
      {
        key: "_dragMoving",
        value: function _dragMoving(e) {
          this.__dragMoving = true;
          e.preventDefault();
        },
        /**
         * When we end dragging ensure we remove the mover class.
         */
      },
      {
        key: "_dragEnd",
        value: function _dragEnd(e) {
          _toConsumableArray(this.parentNode.childNodes).forEach(function (
            item
          ) {
            return item._setDropzone(false);
          });

          this._setDragging(false);
        },
        /**
         * Drag start so we know what target to set
         */
      },
      {
        key: "_dragStart",
        value: function _dragStart(e) {
          var heading = this.shadowRoot.querySelector("#heading");
          e.dataTransfer.setDragImage(heading, 0, 0);

          this._setDragging();

          e.stopPropagation();
          e.stopImmediatePropagation();
        },
        /**
         * Enter an element, meaning we've over it while dragging
         */
      },
      {
        key: "_dragEnter",
        value: function _dragEnter(e) {
          this._setDropzone();
        },
        /**
         * Leaving an element while dragging.
         */
      },
      {
        key: "_dragLeave",
        value: function _dragLeave(e) {
          this._setDropzone(false);
        },
        /**
         * Drop an item onto another
         */
      },
      {
        key: "_dragDrop",
        value: function _dragDrop(e) {
          this._moveBefore(e, this.__dropAccepts, this);
        },
      },
      {
        key: "_moveUp",
        value: function _moveUp(e) {
          var prev = this.previousElementSibling;
          if (!prev) return;

          this._moveBefore(e, this, prev);
        },
      },
      {
        key: "_moveDown",
        value: function _moveDown(e) {
          var next = this.nextElementSibling;
          if (!next) return;

          this._moveBefore(e, this, next.nextElementSibling);
        },
      },
      {
        key: "_moveBefore",
        value: function _moveBefore(e, target, ref) {
          if (!this.parentNode.disabled && target) {
            if (ref) {
              this.parentNode.insertBefore(target, ref);
            } else {
              this.parentNode.append(target);
            }

            _toConsumableArray(this.parentNode.childNodes).forEach(function (
              item
            ) {
              item._setDragging(false);

              item._setDragging(false);
            });

            this.dispatchEvent(
              new CustomEvent("reorder", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: this.parentNode,
              })
            );
          }
        },
      },
      {
        key: "_setDragging",
        value: function _setDragging() {
          var _this3 = this;

          var show =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : true;
          if (!this.parentNode.disabled) this.__dragging = show;

          if (show) {
            _toConsumableArray(this.parentNode.childNodes).forEach(function (
              item
            ) {
              if (item !== _this3) {
                item.__dropAccepts = _this3;
                item.classList.add("droppable");
              }
            });

            this.classList.add("dragging");
          } else {
            _toConsumableArray(this.parentNode.childNodes).forEach(function (
              item
            ) {
              if (item !== _this3) {
                item.__dropAccepts = undefined;
                item.classList.remove("droppable");
              }
            });

            this.classList.remove("dragging");
          }
        },
      },
      {
        key: "_setDropzone",
        value: function _setDropzone() {
          var show =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : true;

          if (show && !this.__dragging && this.__dropAccepts) {
            this.classList.add("dropzone");
          } else {
            this.classList.remove("dropzone");
          }
        },
      },
      {
        key: "connectedCallback",
        value: function connectedCallback() {
          var _this4 = this;

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
            _this4.dispatchEvent(
              new CustomEvent("added", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: _this4,
              })
            );
          }, 0);
        },
      },
      {
        key: "updated",
        value: function updated(changedProperties) {
          var _this5 = this;

          changedProperties.forEach(function (oldValue, propName) {
            var expanded = _this5.getAttribute("aria-expanded");

            if (propName === "error")
              _this5.setAttribute("aria-expanded", _this5.error || expanded);
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
  })(
    (0, _simpleFieldsFieldset.SimpleFieldsFieldsetBehaviors)(
      _litElement.LitElement
    )
  );

exports.SimpleFieldsArrayItem = SimpleFieldsArrayItem;
window.customElements.define(SimpleFieldsArrayItem.tag, SimpleFieldsArrayItem);

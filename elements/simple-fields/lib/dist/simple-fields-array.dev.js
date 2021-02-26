"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimpleFieldsArray = void 0;

var _litElement = require("lit-element/lit-element.js");

var _simpleFieldsFieldset = require("./simple-fields-fieldset.js");

var _simpleFieldsUi = require("./simple-fields-ui.js");

require("@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-button.js");

require("@lrnwebcomponents/simple-icon/simple-icon.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icons.js");

require("./simple-fields-array-item.js");

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

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    "\n        :host([expanded]) #expand::part(icon) {\n          transform: rotate(90deg);\n          transition: all 0.5s ease;\n        }\n        #item-fields {\n          margin: var(--simple-fields-margin-small, 8px) 0;\n          clear: both;\n          z-index: 3;\n        }\n        #top {\n          display: flex;\n          align-items: flex-end;\n          justify-content: flex-end;\n        }\n        #add {\n          float: right;\n        }\n      ",
  ]);

  _templateObject3 = function _templateObject3() {
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

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n      <div id="top" part="top">\n        ',
    '\n        <simple-toolbar-button\n          id="expand"\n          controls="item-fields"\n          icon="more-vert"\n          @click="',
    '"\n          ?toggled="',
    '"\n          toggles\n          show-text-label\n          label="',
    '"\n          part="expand"\n        >\n        </simple-toolbar-button>\n      </div>\n      <div id="item-fields" aria-live="polite" part="items">\n        <slot></slot>\n        <simple-toolbar-button\n          id="add"\n          icon="add"\n          controls="item-fields"\n          @click="',
    '"\n          part="add"\n          icon="more-vert"\n          ?toggled="',
    '"\n          toggles\n          show-text-label\n          label="Add Item"\n        >\n        </simple-toolbar-button>\n      </div>\n    ',
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '\n      <fieldset part="fieldset">',
    "",
    "</fieldset>\n    ",
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
 * `simple-fields-array` takes in a JSON schema of type array and builds a form,
 * exposing a `value` property that represents an array described by the schema.
 *
 * @group simple-fields
 * @extends simple-fields-fieldset
 * @element simple-fields-array
 */
var SimpleFieldsArray =
  /*#__PURE__*/
  (function (_SimpleFieldsFieldset) {
    _inherits(SimpleFieldsArray, _SimpleFieldsFieldset);

    _createClass(
      SimpleFieldsArray,
      [
        {
          key: "render",
          value: function render() {
            return (0, _litElement.html)(
              _templateObject(),
              this.legend,
              this.fields
            );
          },
        },
        {
          key: "fields",
          get: function get() {
            var _this2 = this;

            return (0, _litElement.html)(
              _templateObject2(),
              this.descriptionTemplate,
              function (e) {
                return _this2.toggle();
              },
              this.expanded,
              this.expanded ? "Collapse All" : "Expand All",
              function (e) {
                return _this2._handleAdd();
              },
              this.expanded
            );
          },
        },
      ],
      [
        {
          key: "tag",
          get: function get() {
            return "simple-fields-array";
          },
        },
        {
          key: "styles",
          get: function get() {
            return [].concat(
              _toConsumableArray(
                _get(_getPrototypeOf(SimpleFieldsArray), "styles", this)
              ),
              _toConsumableArray(_simpleFieldsUi.SimpleFieldsButtonStyles),
              [(0, _litElement.css)(_templateObject3())]
            );
          },
        },
        {
          key: "properties",
          get: function get() {
            return _objectSpread(
              {},
              _get(_getPrototypeOf(SimpleFieldsArray), "properties", this),
              {
                count: {
                  type: Number,
                },

                /*
                 * icon when expanded
                 */
                expanded: {
                  type: Boolean,
                  reflect: true,
                },
                __dragging: {
                  type: Boolean,
                },
              }
            );
          },
        },
      ]
    );

    function SimpleFieldsArray() {
      var _this;

      _classCallCheck(this, SimpleFieldsArray);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(SimpleFieldsArray).call(this)
      );
      _this.count = 0;
      _this.expanded = false;
      _this.disableAdd = false;
      return _this;
    }

    _createClass(SimpleFieldsArray, [
      {
        key: "updated",
        value: function updated(changedProperties) {
          var _this3 = this;

          changedProperties.forEach(function (oldValue, propName) {
            if (propName === "expanded")
              _this3
                .querySelectorAll("simple-fields-array-item")
                .forEach(function (item) {
                  return item.setAttribute("aria-expanded", _this3.expanded);
                });
          });
        },
      },
      {
        key: "buildItem",
        value: function buildItem(id) {
          var _this4 = this;

          var item = document.createElement("simple-fields-array-item");
          item.id = id;
          item.expanded = this.expanded;
          item.innerHTML =
            '\n      <slot name="sort"></slot>\n      <slot name="preview"></slot>\n      <slot></slot>';
          this.appendChild(item);
          item.addEventListener("remove", function (e) {
            return _this4._handleRemove(e);
          });
          return item;
        },
        /**
         * Fires add event
         * @event add
         */
      },
      {
        key: "_handleAdd",
        value: function _handleAdd() {
          this.dispatchEvent(
            new CustomEvent("add", {
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
        value: function _handleRemove(e) {
          e.stopPropagation();
          e.stopImmediatePropagation();
          this.dispatchEvent(
            new CustomEvent("remove", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: e.detail,
            })
          );
        },
        /**
         * Collapses the content
         */
      },
      {
        key: "collapse",
        value: function collapse() {
          this.toggle(false);
        },
        /**
         * Expands the content
         */
      },
      {
        key: "expand",
        value: function expand() {
          this.toggle(true);
        },
        /**
         * handles focus
         *
         * @memberof SimpleFieldsArray
         */
      },
      {
        key: "focus",
        value: function focus(index) {
          if (this.childNodes && index) {
            if (this.childNodes.length < index)
              index = this.childNodes.length - 1; // account for delete of 1st item

            if (index == -1) {
              index = 0;
            }

            if (this.childNodes.length != 0) {
              this.childNodes[index].focus();
            }
          } else if (this.shadowRoot) {
            var id = !this.childNodes ? "add" : "expand";
            this.shadowRoot.getElementById(id).focus();
          }
        },
        /**
         * Toggles based on mode
         * @param {boolean} open whether to toggle open
         */
      },
      {
        key: "toggle",
        value: function toggle() {
          var open =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : !this.expanded;
          this.expanded = open;

          this._handleToggle();
        },
        /**
         * Fires toggling events
         */
      },
      {
        key: "_handleToggle",
        value: function _handleToggle() {
          /**
           * Fires when toggled.
           *
           * @event toggle
           */
          this.dispatchEvent(
            new CustomEvent("toggle", {
              detail: this,
            })
          );

          if (this.expanded) {
            /**
             * Fires when expanded.
             *
             * @event expand
             */
            this.dispatchEvent(
              new CustomEvent("expand", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: this,
              })
            );
          } else {
            /**
             * Fires when collapsed.
             *
             * @event collapse
             */
            this.dispatchEvent(
              new CustomEvent("collapse", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: this,
              })
            );
          }
        },
      },
    ]);

    return SimpleFieldsArray;
  })(_simpleFieldsFieldset.SimpleFieldsFieldset);

exports.SimpleFieldsArray = SimpleFieldsArray;
window.customElements.define(SimpleFieldsArray.tag, SimpleFieldsArray);

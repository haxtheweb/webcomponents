"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.A11yCollapseGroup = void 0;

var _litElement = require("lit");

var _a11yCollapse = require("../a11y-collapse.js");

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
    "\n        :host {\n          display: block;\n          margin: var(--a11y-collapse-group-margin, 15px 0);\n          --a11y-collapse-margin: 15px;\n        }\n        :host([hidden]) {\n          display: none;\n        }\n        #heading {\n          font-weight: bold;\n        }\n        .wrapper {\n          border-radius: 0;\n          --a11y-collapse-margin: 0 0;\n          --a11y-collapse-border-between: none;\n        }\n      ",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    ' <div class="wrapper"><slot></slot></div> ',
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
 * `a11y-collapse-group`
 * a group of `a11y-collapse` elements
 * 
### Styling

`<a11y-collapse-group>` provides the following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--a11y-collapse-group-margin` | margin around the a11y-collapse-group | 15px 0
 *
 * @customElement
 * @extends LitElement
 * @see ../a11y-collapse.js
 * @demo ./demo/group.html collapse groups
 */
var A11yCollapseGroup =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(A11yCollapseGroup, _LitElement);

    _createClass(
      A11yCollapseGroup,
      [
        {
          key: "render",
          value: function render() {
            return (0, _litElement.html)(_templateObject());
          },
        },
      ],
      [
        {
          key: "styles",
          get: function get() {
            return [(0, _litElement.css)(_templateObject2())];
          },
        },
      ]
    );

    function A11yCollapseGroup() {
      var _this;

      _classCallCheck(this, A11yCollapseGroup);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(A11yCollapseGroup).call(this)
      );
      _this.globalOptions = {};
      _this.radio = false;
      _this.__items = [];

      _this.addEventListener("a11y-collapse-attached", function (e) {
        e.stopPropagation();
        e.stopImmediatePropagation();

        _this._attachItem(e.detail);
      });

      _this.addEventListener("a11y-collapse-detached", function (e) {
        e.stopPropagation();
        e.stopImmediatePropagation();

        _this._detachItem(e.detail);
      });

      _this.addEventListener("a11y-collapse-click", function (e) {
        e.stopPropagation();
        e.stopImmediatePropagation();

        _this.radioToggle(e.detail);
      });

      _this.addEventListener("toggle", function (e) {
        e.stopPropagation();
        e.stopImmediatePropagation();

        _this.radioToggle(e.detail);
      });

      return _this;
    }

    _createClass(
      A11yCollapseGroup,
      [
        {
          key: "_attachItem",

          /**
           * Adds a11y-collapse item to __items array.
           * @param {object} item an a11y-collapse item
           */
          value: function _attachItem(item) {
            var _this2 = this;

            this.__items.push(item);

            Object.keys(A11yCollapseGroup.properties || {}).forEach(function (
              propName
            ) {
              return _this2._updateItem(item, propName);
            });
          },
          /**
           * Updates a11y-collapse item when properties change
           */
        },
        {
          key: "updated",
          value: function updated(changedProperties) {
            var _this3 = this;

            changedProperties.forEach(function (oldValue, propName) {
              _this3.__items.forEach(function (item) {
                return _this3._updateItem(item, propName, oldValue);
              });
            });
          },
        },
        {
          key: "_updateItem",
          value: function _updateItem(item, propName) {
            var oldValue =
              arguments.length > 2 && arguments[2] !== undefined
                ? arguments[2]
                : undefined;

            if (propName === "globalOptions" || propName === "__items") {
              if (this.globalOptions !== {})
                for (var key in this.globalOptions) {
                  if (this.globalOptions.hasOwnProperty(key)) {
                    item[key] = this.globalOptions[key];
                  }
                }
            } else if (propName === "radio" && this.radio) {
              item.expanded = false;
            } else {
              if (
                this[propName] !== null ||
                _typeof(this[propName]) !==
                  (typeof undefined === "undefined"
                    ? "undefined"
                    : _typeof(undefined))
              )
                item[propName] = this[propName];
            }
          },
          /**
           * Removes a detached item from __items array.
           * @param {object} item an a11y-collapse item
           */
        },
        {
          key: "_detachItem",
          value: function _detachItem(item) {
            if (this.__items && item) {
              for (var i = 0; i < this.__items.length; i++) {
                if (this.__items[i] === item) this.__items.splice(i, 1);
              }
            }
          },
          /**
           * Toggles off all previous choices.
           * @param {object} item an a11y-collapse item
           */
        },
        {
          key: "radioToggle",
          value: function radioToggle(item) {
            if (this.radio && item.expanded) {
              for (var i = 0; i < this.__items.length; i++) {
                if (this.__items[i] !== item) this.__items[i].toggle(false);
              }
            }
          },
        },
        {
          key: "disconnectedCallback",
          value: function disconnectedCallback() {
            var _this4 = this;

            this.removeEventListener("a11y-collapse-click", function (e) {
              e.stopPropagation();

              _this4.radioToggle(e.detail);
            });
            this.removeEventListener("a11y-collapse-attached", function (e) {
              e.stopPropagation();

              _this4.push("__items", e.detail);
            });
            this.removeEventListener("a11y-collapse-detached", function (e) {
              e.stopPropagation();

              _this4._detachItem(e.detail);
            });

            _get(
              _getPrototypeOf(A11yCollapseGroup.prototype),
              "disconnectedCallback",
              this
            ).call(this);
          },
        },
        {
          key: "items",
          get: function get() {
            return this.__items;
          },
        },
      ],
      [
        {
          key: "tag",
          get: function get() {
            return "a11y-collapse-group";
          },
        },
        {
          key: "properties",
          get: function get() {
            return _objectSpread(
              {},
              _get(_getPrototypeOf(A11yCollapseGroup), "properties", this),
              {},
              _a11yCollapse.A11yCollapse.properties,
              {
                /**
                 * an array of globalProperties to override every a11y-collapse item
                 * For example, {"icon": "arrow-drop-down"} would set every item's icon to "arrow-drop-down"
                 */
                globalOptions: {
                  type: Object,
                  attribute: "global-options",
                  reflect: true,
                },

                /**
                 * Acts like a radio button. (Items can only be expanded one at a time.)
                 */
                radio: {
                  type: Boolean,
                  attribute: "radio",
                },

                /**
                 * is radio button
                 */
                __items: {
                  type: Array,
                },
              }
            );
          },
        },
        {
          key: "haxProperties",
          get: function get() {
            return {
              canScale: false,
              canPosition: true,
              canEditSource: true,
              gizmo: {
                title: "Expand Collapse Group",
                description: "A group of expand collapse elements.",
                icon: "view-day",
                color: "grey",
                groups: ["Content", "Presentation", "Collapse"],
              },
              settings: {
                configure: [
                  {
                    property: "radio",
                    title: "Expand only one",
                    description: "Only one item can be expanded.",
                    inputMethod: "boolean",
                  },
                  {
                    property: "disabled",
                    title: "Disabled",
                    description: "Disable items.",
                    inputMethod: "boolean",
                  },
                  {
                    slot: "",
                    title: "Collapse Items",
                    description: "The collapse items.",
                    inputMethod: "code-editor",
                  },
                ],
                advanced: [
                  {
                    property: "hidden",
                    title: "Hidden",
                    inputMethod: "boolean",
                  },
                ],
              },
            };
          },
        },
      ]
    );

    return A11yCollapseGroup;
  })(_litElement.LitElement);

exports.A11yCollapseGroup = A11yCollapseGroup;
window.customElements.define(A11yCollapseGroup.tag, A11yCollapseGroup);

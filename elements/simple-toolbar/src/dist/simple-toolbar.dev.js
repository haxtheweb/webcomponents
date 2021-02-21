"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimpleToolbarBehaviors = exports.SimpleToolbar = void 0;

var _litElement = require("lit-element");

require("./lib/simple-toolbar-more-button.js");

var _simpleToolbarButton = require("./lib/simple-toolbar-button.js");

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

function _templateObject4() {
  var data = _taggedTemplateLiteral([
    "\n          :host {\n            position: relative;\n            display: flex;\n            align-items: flex-start;\n            opacity: 1;\n            z-index: 2;\n            margin: 0;\n            justify-content: space-between;\n            background-color: var(--simple-toolbar-border-bg);\n            font-size: inherit;\n            margin: 0;\n            padding: 0;\n            transition: all 0.5s;\n          }\n          :host([hidden]) {\n            z-index: -1;\n            visibility: hidden;\n            opacity: 0;\n            height: 0;\n          }\n          :host([disabled]) {\n            opacity: 0.6;\n            pointer-events: none;\n          }\n          #buttons {\n            flex-wrap: wrap;\n            display: flex;\n            justify-content: flex-start;\n            flex: 1 1 auto;\n            overflow-y: visible;\n          }\n          #morebutton {\n            flex: 0 0 auto;\n          }\n          ::slotted(.group) {\n            display: flex;\n            flex-wrap: nowrap;\n            justify-content: space-evenly;\n            align-items: stretch;\n            margin: 0;\n            flex: 0 1 auto;\n            overflow-y: visible;\n            border-width: 0px;\n            border-style: solid;\n            padding: var(--simple-toolbar-group-padding, 0 3px);\n            border-color: var(\n              --simple-toolbar-border-color,\n              var(--simple-toolbar-group-border-color, transparent)\n            );\n          }\n          ::slotted(.group:not(:last-child)) {\n            border-right-width: var(\n              --simple-toolbar-group-border-width,\n              var(--simple-toolbar-border-width, 1px)\n            );\n          }\n          ::slotted(*:hover),\n          ::slotted(*:focus-wthin) {\n            z-index: var(--simple-toolbar-focus-z-index, 100);\n          }\n          :host([collapsed]:not([always-expanded]))\n            ::slotted(*[collapse-hide]) {\n            display: none !important;\n          }\n        ",
  ]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    "\n          :host([sticky]) {\n            position: sticky;\n            top: 0;\n          }\n        ",
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n        <div\n          id="buttons"\n          class="',
    '"\n          part="buttons"\n        >\n          <slot></slot>\n        </div>\n        ',
    "\n      ",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    ' <simple-toolbar-more-button\n        id="morebutton"\n        .align-horizontal="',
    '"\n        .align-vertical="',
    '"\n        aria-controls="buttons"\n        class="button"\n        @click="',
    '"\n        @toggle="',
    '"\n        ?hidden=',
    '\n        .icon="',
    '"\n        .icon-position="',
    '"\n        .label="',
    '"\n        .shortcut="',
    '"\n        ?show-text-label="',
    '"\n        ?toggled="',
    '"\n        .toggled-icon="',
    '"\n        .toggled-label="',
    '"\n        .toggled-tooltip="',
    '"\n        .tooltip-direction="',
    '"\n        part="morebutton"\n      >\n      </simple-toolbar-more-button>',
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
 * @customElement
 * @class
 */
var SimpleToolbarBehaviors = function SimpleToolbarBehaviors(SuperClass) {
  return (
    /*#__PURE__*/
    (function (_SuperClass) {
      _inherits(_class, _SuperClass);

      _createClass(
        _class,
        [
          {
            key: "tag",

            /**
             * Store the tag name to make it easier to obtain directly.
             * @notice function name must be here for tooling to operate correctly
             */
            value: function tag() {
              return "simple-toolbar";
            }, // render function for styles
          },
          {
            key: "render",
            // render function for template
            value: function render() {
              return this.toolbarTemplate;
            },
            /**
             * array of rendered buttons
             *
             * @readonly
             * @memberof SimpleToolbar
             */
          },
          {
            key: "buttons",
            get: function get() {
              return this.__buttons;
            },
            /**
             * does toolbar have focus
             *
             * @readonly
             * @memberof SimpleToolbar
             */
          },
          {
            key: "focused",
            get: function get() {
              return this.__focused;
            },
            /**
             * is mouseover toolbar
             *
             * @readonly
             * @memberof SimpleToolbar
             */
          },
          {
            key: "hovered",
            get: function get() {
              return this.__hovered;
            },
            /**
             * more button's template
             *
             * @readonly
             * @memberof SimpleToolbar
             */
          },
          {
            key: "moreButton",
            get: function get() {
              var _this2 = this;

              return (0, _litElement.html)(
                _templateObject(),
                this.alignHorizontal,
                this.alignVertical,
                function (e) {
                  return (_this2.collapsed = !_this2.collapsed);
                },
                function (e) {
                  return (_this2.collapsed = !_this2.collapsed);
                },
                this.collapseDisabled,
                this.icon,
                this.iconPosition,
                this.label,
                this.shortcut,
                this.showTextLabel,
                !this.collapsed,
                this.toggledIcon,
                this.toggledLabel,
                this.toggledTooltip,
                this.tooltipDirection
              );
            },
            /**
             * toolbar element's template
             *
             * @readonly
             * @memberof SimpleToolbar
             */
          },
          {
            key: "toolbarTemplate",
            get: function get() {
              return (0, _litElement.html)(
                _templateObject2(),
                !this.alwaysExpanded && this.collapsed ? "collapsed" : "",
                this.alwaysExpanded ? "" : this.moreButton
              );
            }, // life cycle
          },
        ],
        [
          {
            key: "stickyStyles",
            get: function get() {
              return [(0, _litElement.css)(_templateObject3())];
            }, // render function for styles
          },
          {
            key: "baseStyles",
            get: function get() {
              return [(0, _litElement.css)(_templateObject4())];
            },
          },
          {
            key: "styles",
            get: function get() {
              return [].concat(
                _toConsumableArray(this.baseStyles),
                _toConsumableArray(this.stickyStyles)
              );
            }, // properties available to custom element for data binding
          },
          {
            key: "properties",
            get: function get() {
              return _objectSpread(
                {},
                _simpleToolbarButton.SimpleToolbarGlobalProperties,
                {
                  /**
                   * always expanded so more button is unnecessary?
                   */
                  alwaysExpanded: {
                    name: "alwaysExpanded",
                    type: Boolean,
                    attribute: "always-expanded",
                    reflect: true,
                  },

                  /**
                   * is toolbar collapsed?
                   */
                  collapsed: {
                    name: "collapsed",
                    type: Boolean,
                    attribute: "collapsed",
                    reflect: true,
                  },

                  /**
                   * Custom configuration of toolbar groups and buttons.
                   * (See default value for example using default configuration.)
                   */
                  config: {
                    name: "config",
                    type: Array,
                    attribute: "config",
                  },

                  /**
                   * unique id
                   */
                  id: {
                    name: "id",
                    type: String,
                    attribute: "id",
                    reflect: true,
                  },

                  /**
                   * Optional space-sperated list of keyboard shortcuts for editor
                   * to fire this button, see iron-a11y-keys for more info.
                   */
                  moreShortcuts: {
                    name: "moreShortcuts",
                    attribute: "more-shortcuts",
                    type: Object,
                  },

                  /**
                   * Optional space-sperated list of keyboard shortcuts for editor
                   * to fire this button, see iron-a11y-keys for more info.
                   */
                  shortcutKeys: {
                    name: "shortcutKeys",
                    attribute: "shortcut-keys",
                    type: Object,
                  },

                  /**
                   * Should toolbar stick to top so that it is always visible?
                   */
                  sticky: {
                    name: "sticky",
                    type: Boolean,
                    attribute: "sticky",
                    reflect: true,
                  },

                  /**
                   * raw array of buttons
                   */
                  __buttons: {
                    name: "__buttons",
                    type: Array,
                  },

                  /**
                   * whether there is no need to collapse
                   */
                  collapseDisabled: {
                    type: Boolean,
                    attribute: "collapse-disabled",
                    reflect: true,
                  },

                  /**
                   * whether toolbar has focus
                   */
                  __focused: {
                    name: "__focused",
                    type: Boolean,
                  },

                  /**
                   * whether toolbar is hovered
                   */
                  __hovered: {
                    name: "__hovered",
                    type: Boolean,
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
        _this.collapsed = true;
        _this.collapseDisabled = false;
        _this.config = [];
        _this.__buttons = [];
        _this.__focused = false;
        _this.__hovered = false;
        _this.icon = "more-vert";
        _this.label = "More Buttons";
        _this.toggledLabel = "Fewer Buttons";
        _this.showTextLabel = false;
        _this.shortcut = "ctrl+shift+;";
        _this.sticky = false;
        _this.shortcutKeys = {};

        _this.addEventListener("register-button", _this._handleButtonRegister);

        _this.addEventListener(
          "deregister-button",
          _this._handleButtonDeregister
        );

        _this.addEventListener(
          "update-button-registry",
          _this._handleButtonUpdate
        );

        return _this;
      }
      /**
       * Called every time the element is inserted into the DOM. Useful for
       * running setup code, such as fetching resources or rendering.
       * Generally, you should try to delay work until this time.
       */

      _createClass(_class, [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            _get(
              _getPrototypeOf(_class.prototype),
              "connectedCallback",
              this
            ).call(this);

            if (this.collapsed)
              window.addEventListener("resize", this._handleResize.bind(this));
            this.addEventListener("keypress", this._handleShortcutKeys);
          },
          /**
           * Called every time the element is removed from the DOM. Useful for
           * running clean up code (removing event listeners, etc.).
           */
        },
        {
          key: "disconnectedCallback",
          value: function disconnectedCallback() {
            if (this.collapsed)
              window.removeEventListener(
                "resize",
                this._handleResize.bind(this)
              );

            _get(
              _getPrototypeOf(_class.prototype),
              "disconnectedCallback",
              this
            ).call(this);

            this.addEventListener("keypress", this._handleShortcutKeys);
          },
        },
        {
          key: "firstUpdated",
          value: function firstUpdated(changedProperties) {
            var _this3 = this;

            this.setAttribute("aria-live", "polite");

            this.onfocus = function (e) {
              return (_this3.__focused = true);
            };

            this.onblur = function (e) {
              return (_this3.__focused = false);
            };

            this.onmouseover = function (e) {
              return (_this3.__hovered = true);
            };

            this.onmouseout = function (e) {
              return (_this3.__hovered = false);
            };

            if (_get(_getPrototypeOf(_class.prototype), "firstUpdated", this))
              _get(
                _getPrototypeOf(_class.prototype),
                "firstUpdated",
                this
              ).call(this, changedProperties);
          },
        },
        {
          key: "updated",
          value: function updated(changedProperties) {
            var _this4 = this;

            if (_get(_getPrototypeOf(_class.prototype), "updated", this))
              _get(_getPrototypeOf(_class.prototype), "updated", this).call(
                this,
                changedProperties
              );
            changedProperties.forEach(function (oldValue, propName) {
              if (propName === "config") _this4.updateToolbar();

              if (propName === "collapsed") {
                if (_this4.collapsed) {
                  _this4.resizeToolbar();

                  window.addEventListener(
                    "resize",
                    _this4._handleResize.bind(_this4)
                  );
                } else {
                  window.removeEventListener(
                    "resize",
                    _this4._handleResize.bind(_this4)
                  );
                }
              }

              if (propName === "hidden")
                _this4.setAttribute(
                  "aria-hidden",
                  _this4.hidden ? "true" : "false"
                );
            });
            this.resizeToolbar();
          },
          /**
           * adds a button to a div
           *
           * @param {object} config object containing configuration for a button
           * @param {object} div element that acts as a button group
           * @returns {object} button element
           * @memberof SimpleToolbar
           */
        },
        {
          key: "addButton",
          value: function addButton(config, div) {
            var button = this._renderButton(config);

            div = div || this;
            div.appendChild(button);
            return button;
          },
          /**
           * adds a group of buttons to a parent container
           *
           * @param {object} config object containing configuration for a group of buttons
           * @param {object} container parent node
           * @returns {object} div element as a button group
           * @memberof SimpleToolbar
           */
        },
        {
          key: "addButtonGroup",
          value: function addButtonGroup(config, parent) {
            var _this5 = this;

            var group = this._renderButtonGroup(config);

            (parent || this).appendChild(group);
            config.buttons.forEach(function (buttonConfig) {
              return _this5.addButton(buttonConfig, group);
            });
            return group;
          },
          /**
           * empties toolbar and registered buttons
           *
           * @returns
           * @memberof SimpleToolbar
           */
        },
        {
          key: "clearToolbar",
          value: function clearToolbar() {
            this.innerHTML = "";
            this.__buttons = [];
            this.shortcutKeys = {};
            this.shortcutKeys[this.shortcut] = this.shadowRoot
              ? this.shadowRoot.querySelector("#morebutton")
              : undefined;
          },
          /**
           * removes registered button when moved/removed
           *
           * @param {object} button button node
           * @memberof SimpleToolbar
           */
        },
        {
          key: "deregisterButton",
          value: function deregisterButton(button) {
            var _this6 = this;

            this.__buttons = this.__buttons.filter(function (b) {
              return b !== button;
            });
            (button.shortcutKeys || "").split(" ").forEach(function (key) {
              return delete _this6.shortcutKeys[key];
            });
          },
          /**
           * registers button when appended
           *
           * @param {object} button button node
           * @memberof SimpleToolbar
           */
        },
        {
          key: "registerButton",
          value: function registerButton(button) {
            var _this7 = this;

            this.__buttons.push(button);

            this.__buttons = _toConsumableArray(new Set(this.__buttons));
            (button.shortcutKeys || "").split(" ").forEach(function (key) {
              return (_this7.shortcutKeys[key] = button);
            });
          },
        },
        {
          key: "resizeToolbar",
          value: function resizeToolbar() {
            if (this.alwaysExpanded) return;
            if (!this.collapsed) return;

            var items = _toConsumableArray(this.children || []),
              shown = true;

            items.forEach(function (item) {
              if (item.removeAttribute) item.removeAttribute("collapse-hide");

              if (item.offsetTop && item.offsetTop > 0) {
                item.setAttribute("collapse-hide", true);
                shown = false;
              } else if (!shown) {
                item.setAttribute("collapse-hide", true);
              }
            });
            this.collapseDisabled = shown;
          },
          /**
           * updates registered button, it needed
           *
           * @param {object} button button node
           * @memberof SimpleToolbar
           */
        },
        {
          key: "updateButton",
          value: function updateButton(button) {
            if (button) this.deregisterButton(button);
            if (button) this.registerButton(button);
          },
          /**
           * updates buttons based on change in config
           */
        },
        {
          key: "updateToolbar",
          value: function updateToolbar() {
            var _this8 = this;

            if (!this || !this.config || this.config.length == 0) return;
            this.clearToolbar();
            if (_typeof(this.config) != _typeof([]))
              this.config = JSON.parse(config);
            this.config.forEach(function (config) {
              if (config.type === "button-group") {
                _this8.addButtonGroup(config, _this8);
              } else {
                _this8.addButton(config, _this8);
              }
            });
            this.resizeToolbar();
          },
          /**
           * handles appended button
           *
           * @param {event} e
           */
        },
        {
          key: "_handleButtonRegister",
          value: function _handleButtonRegister(e) {
            e.stopPropagation();
            this.registerButton(e.detail);
            this.resizeToolbar();
          },
          /**
           * handles moved/removed button
           *
           * @param {event} e
           */
        },
        {
          key: "_handleButtonDeregister",
          value: function _handleButtonDeregister(e) {
            e.stopPropagation();
            this.deregisterButton(e.detail);
            this.resizeToolbar();
          },
          /**
           * handles updated button
           *
           * @param {event} e
           */
        },
        {
          key: "_handleButtonUpdate",
          value: function _handleButtonUpdate(e) {
            e.stopPropagation();
            this.updateButton(e.detail);
          },
          /**
           * resizes toolbar on window resize
           *
           */
        },
        {
          key: "_handleResize",
          value: function _handleResize(e) {
            this.resizeToolbar();
          },
          /**
           * handles shortcut keys for buttons
           *
           * @param {event} e
           * @event shortcut-key-pressed
           */
        },
        {
          key: "_handleShortcutKeys",
          value: function _handleShortcutKeys(e) {
            var key = this._shortcutKeysMatch(e);

            if (key) {
              e.preventDefault();

              this.shortcutKeys[key]._handleShortcutKeys(e, key);

              this.dispatchEvent(
                new CustomEvent("shortcut-key-pressed", {
                  bubbles: true,
                  cancelable: true,
                  composed: true,
                  detail: _objectSpread({}, e.detail, {
                    button: this,
                    shortcutKey: this,
                  }),
                })
              );
            }
          },
          /**
           * creates a button element based on config object
           *
           * @param {object} config configuration object
           * @returns {object} button node
           * @memberof SimpleToolbar
           */
        },
        {
          key: "_renderButton",
          value: function _renderButton(config) {
            var button = document.createElement(config.type);
            Object.keys(config).forEach(function (key) {
              return (button[key] = config[key]);
            });
            button.addEventListener("button-command", this._handleButton);
            return button;
          },
          /**
           * creates a div element to contain/group buttons based on config object
           *
           * @param {object} config object containing configuration for a group of buttons
           * @returns {object} div element as a button group
           * @memberof SimpleToolbar
           */
        },
        {
          key: "_renderButtonGroup",
          value: function _renderButtonGroup(config) {
            var group = document.createElement("div");
            group.setAttribute("class", "group");
            Object.keys(config).forEach(function (key) {
              return (group[key] = config[key]);
            });
            return group;
          },
          /**
           * determines if a keyup event matches a shortcut
           *
           * @param {*} keyEvt
           * @returns
           */
        },
        {
          key: "_shortcutKeysMatch",
          value: function _shortcutKeysMatch(keyEvt) {
            var shortcutKey = false;
            Object.keys(this.shortcutKeys || {}).forEach(function (shortcut) {
              var keys = (shortcut || "").toLowerCase().split("+"),
                altKey = keys.includes("alt"),
                ctrlKey = keys.includes("ctrl"),
                metaKey = keys.includes("meta") || keys.includes("cmd"),
                shiftKey = keys.includes("shift"),
                uppercase =
                  keyEvt.shiftKey && keyEvt.code > 65 && keyEvt.code < 91,
                filter = keys
                  .filter(function (key) {
                    return key.length == 1;
                  })
                  .map(function (key) {
                    return !!uppercase ? key.toUpperCase() : key;
                  }),
                key = filter[0],
                match =
                  altKey === keyEvt.altKey &&
                  (ctrlKey === keyEvt.ctrlKey ||
                    ((ctrlKey === window.navigator.platform) === "MacIntel" &&
                      e.metaKey)) &&
                  metaKey === keyEvt.metaKey &&
                  shiftKey === keyEvt.shiftKey &&
                  (keyEvt.key ? keyEvt.key === key : !key);
              if (match) shortcutKey = shortcut;
              return;
            });
            return shortcutKey;
          },
        },
      ]);

      return _class;
    })(SuperClass)
  );
};
/**
 * `simple-toolbar`
 * a customizable toolbar
 *
### Styling

`<simple-toolbar>` provides following custom properties and mixins
for styling:

Custom property | Description | Default
----------------|-------------|----------
--simple-toolbar-border-color | default border color | transparent
--simple-toolbar-border-width | default border width | 1px
--simple-toolbar-group-border-color | border color for button groups | --simple-toolbar-border-color
--simple-toolbar-group-border-width | border width for button groups | --simple-toolbar-border-width
--simple-toolbar-group-padding | padding for button groups | 0 3px
 * 
 * @customElement
 * @extends SimpleToolbarBehaviors
 * @extends LitElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 * @demo demo/grid.html Grid
 * @demo ./demo/buttons.html Buttons
 * @demo ./demo/menu.html Menu
 */

exports.SimpleToolbarBehaviors = SimpleToolbarBehaviors;

var SimpleToolbar =
  /*#__PURE__*/
  (function (_SimpleToolbarBehavio) {
    _inherits(SimpleToolbar, _SimpleToolbarBehavio);

    function SimpleToolbar() {
      _classCallCheck(this, SimpleToolbar);

      return _possibleConstructorReturn(
        this,
        _getPrototypeOf(SimpleToolbar).apply(this, arguments)
      );
    }

    return SimpleToolbar;
  })(SimpleToolbarBehaviors(_litElement.LitElement));

exports.SimpleToolbar = SimpleToolbar;
customElements.define("simple-toolbar", SimpleToolbar);

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimpleToolbarButtonBehaviors = exports.SimpleToolbarButton = exports.SimpleToolbarGlobalProperties = void 0;

var _litElement = require("lit-element/lit-element.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icons.js");

require("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");

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

function _templateObject12() {
  var data = _taggedTemplateLiteral([
    '\n          button[part="button"] {\n            color: var(--simple-toolbar-button-color);\n            border-color: var(\n              --simple-toolbar-button-border-color,\n              var(--simple-toolbar-border-color, transparent)\n            );\n            background-color: var(--simple-toolbar-button-bg, transparent);\n            opacity: var(--simple-toolbar-button-opacity, 1);\n            border-width: var(\n              --simple-toolbar-button-border-width,\n              var(--simple-toolbar-border-width, 1px)\n            );\n            border-radius: var(--simple-toolbar-border-radius, 3px);\n            border-style: solid;\n            text-transform: unset;\n          }\n          button[part="button"][aria-pressed="true"] {\n            color: var(--simple-toolbar-button-toggled-color);\n            border-color: var(--simple-toolbar-button-toggled-border-color);\n            background-color: var(--simple-toolbar-button-toggled-bg);\n            opacity: var(--simple-toolbar-button-toggled-opacity, 0.8);\n          }\n          button[part="button"]:focus,\n          button[part="button"]:hover {\n            color: var(--simple-toolbar-button-hover-color);\n            background-color: var(--simple-toolbar-button-hover-bg);\n            border-color: var(--simple-toolbar-button-hover-border-color);\n            opacity: var(--simple-toolbar-button-hover-opacity, 0.8);\n          }\n          button[part="button"][disabled] {\n            cursor: not-allowed;\n            color: var(--simple-toolbar-button-disabled-color, unset);\n            background-color: var(--simple-toolbar-button-disabled-bg, unset);\n            border-color: var(\n              --simple-toolbar-button-disabled-border-color,\n              unset\n            );\n            opacity: var(--simple-toolbar-button-disabled-opacity, 0.5);\n          }\n        ',
  ]);

  _templateObject12 = function _templateObject12() {
    return data;
  };

  return data;
}

function _templateObject11() {
  var data = _taggedTemplateLiteral([
    '\n          :host {\n            font-family: sans-serif;\n            font-size: 13px;\n            flex: 0 1 auto;\n            min-width: var(\n              --simple-toolbar-button-min-width,\n              var(\n                --simple-toolbar-button-width,\n                var(--simple-toolbar-button-height, 24px)\n              )\n            );\n          }\n          button[part="button"] {\n            font-family: inherit;\n            font-size: inherit;\n            min-width: var(\n              --simple-toolbar-button-min-width,\n              var(\n                --simple-toolbar-button-width,\n                var(--simple-toolbar-button-height, 24px)\n              )\n            );\n            min-height: var(--simple-toolbar-button-height, 24px);\n            padding: var(--simple-toolbar-button-padding, 1px);\n            flex: var(--simple-toolbar-button-flex, 0 0 auto);\n            align-items: var(--simple-toolbar-button-align, center);\n            transition: all 0.5s;\n            justify-content: var(--simple-toolbar-button-justify, space-around);\n          }\n          button[part="button"],\n          :host([icon-position="right"]:not([align-vertical]))\n            button[part="button"] {\n            justify-content: space-evenly;\n          }\n\n          :host([icon-position="top"]) button[part="button"] {\n            flex-direction: column;\n          }\n          :host([icon-position="bottom"]) button[part="button"] {\n            flex-direction: column-reverse;\n          }\n          :host([icon-position="right"]) button[part="button"] {\n            flex-direction: row-reverse;\n          }\n          :host([align-vertical="top"]:not([icon-position]))\n            button[part="button"],\n          :host([align-vertical="top"][icon-position="right"])\n            button[part="button"],\n          :host([align-horizontal="left"][icon-position="top"])\n            button[part="button"],\n          :host([align-horizontal="left"][icon-position="bottom"])\n            button[part="button"] {\n            align-items: flex-start;\n          }\n          :host([align-vertical="bottom"]:not([icon-position]))\n            button[part="button"],\n          :host([align-vertical="bottom"][icon-position="right"])\n            button[part="button"],\n          :host([align-horizontal="right"][icon-position="top"])\n            button[part="button"],\n          :host([align-horizontal="right"][icon-position="bottom"]) {\n            align-items: flex-end;\n          }\n          :host([align-horizontal="left"]:not([icon-position]))\n            button[part="button"],\n          :host([align-horizontal="left"][icon-position="right"])\n            button[part="button"],\n          :host([align-vertical="top"][icon-position="top"])\n            button[part="button"],\n          :host([align-vertical="top"][icon-position="bottom"]) {\n            justify-content: flex-start;\n          }\n          :host([align-horizontal="right"]:not([icon-position]))\n            button[part="button"],\n          :host([align-horizontal="right"][icon-position="right"])\n            button[part="button"],\n          :host([align-vertical="bottom"][icon-position="top"])\n            button[part="button"],\n          :host([align-vertical="bottom"][icon-position="bottom"]) {\n            justify-content: flex-end;\n          }\n          :host([align-vertical="middle"]:not([icon-position]))\n            button[part="button"],\n          :host([align-vertical="middle"][icon-position="right"])\n            button[part="button"],\n          :host([align-horizontal="center"][icon-position="top"])\n            button[part="button"],\n          :host([align-horizontal="center"][icon-position="bottom"]) {\n            align-items: center;\n          }\n          :host([align-horizontal="center"]:not([icon-position]))\n            button[part="button"],\n          :host([align-horizontal="center"][icon-position="right"])\n            button[part="button"],\n          :host([align-vertical="middle"][icon-position="top"])\n            button[part="button"],\n          :host([align-vertical="middle"][icon-position="bottom"]) {\n            justify-content: center;\n          }\n        ',
  ]);

  _templateObject11 = function _templateObject11() {
    return data;
  };

  return data;
}

function _templateObject10() {
  var data = _taggedTemplateLiteral([
    '\n          :host {\n            display: inline-flex;\n            white-space: nowrap;\n            transition: all 0.5s;\n            z-index: 1;\n          }\n          :host(:hover),\n          :host(:focus-wthin) {\n            z-index: var(--simple-toolbar-focus-z-index, 100) !important;\n          }\n          :host([hidden]) {\n            z-index: -1;\n            visibility: hidden;\n            opacity: 0;\n            height: 0;\n            overflow: hidden;\n          }\n          :host([disabled]) {\n            pointer-events: none;\n          }\n          button[part="button"] {\n            display: flex;\n            margin: 0;\n            white-space: nowrap;\n            width: 100%;\n            height: 100%;\n          }\n        ',
  ]);

  _templateObject10 = function _templateObject10() {
    return data;
  };

  return data;
}

function _templateObject9() {
  var data = _taggedTemplateLiteral([
    "\n          simple-tooltip {\n            z-index: -1;\n          }\n          :host(:hover) simple-tooltip,\n          :host(:focus-within) simple-tooltip {\n            z-index: 2;\n          }\n        ",
  ]);

  _templateObject9 = function _templateObject9() {
    return data;
  };

  return data;
}

function _templateObject8() {
  var data = _taggedTemplateLiteral([
    "\n          #icon:not([icon]) {\n            display: none;\n          }\n          #icon[icon] {\n            width: var(\n              --simple-toolbar-button-width,\n              var(--simple-toolbar-button-height, 24px)\n            );\n            height: var(--simple-toolbar-button-height, 24px);\n            flex: 0 0 auto;\n          }\n        ",
  ]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  var data = _taggedTemplateLiteral([
    "\n          #label {\n            padding: 0 var(--simple-toolbar-button-label-padding, 2px);\n            white-space: var(--simple-toolbar-button-label-white-space, normal);\n          }\n          .offscreen {\n            position: absolute;\n            left: -999999px;\n            top: 0;\n            height: 0;\n            width: 0;\n            overflow: hidden;\n          }\n        ",
  ]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral([
    ' <button\n              id="button"\n              class="simple-toolbar-button"\n              ?disabled="',
    '"\n              ?controls="',
    '"\n              @click="',
    '"\n              @keypress="',
    '"\n              tabindex="0"\n              part="button"\n            >\n              ',
    " ",
    "\n            </button>\n            ",
    "",
  ]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral([
    ' <button\n              id="button"\n              aria-pressed="',
    '"\n              class="simple-toolbar-button"\n              ?disabled="',
    '"\n              ?controls="',
    '"\n              @click="',
    '"\n              @keypress="',
    '"\n              tabindex="0"\n              part="button"\n            >\n              ',
    " ",
    "\n            </button>\n            ",
    "",
  ]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral([
    '<simple-tooltip\n            id="tooltip"\n            for="button"\n            position="',
    '"\n            part="tooltip"\n            fit-to-visible-bounds\n            >',
    "</simple-tooltip\n          >",
  ]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    '<span\n            id="label"\n            class="',
    '"\n            part="label"\n            >',
    "</span\n          >",
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '<simple-icon-lite\n            id="icon"\n            aria-hidden="true"\n            icon="',
    '"\n            part="icon"\n          ></simple-icon-lite>',
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["", ""]);

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

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();
  _getRequireWildcardCache = function _getRequireWildcardCache() {
    return cache;
  };
  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }
  if (
    obj === null ||
    (_typeof(obj) !== "object" && typeof obj !== "function")
  ) {
    return { default: obj };
  }
  var cache = _getRequireWildcardCache();
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj["default"] = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
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

var SimpleToolbarGlobalProperties = {
  /**
   * override default centered alignment of button: "left", "right", "justify", default center
   */
  align: {
    attribute: "align",
    reflect: true,
    type: String,
  },

  /**
   * override vertical alignment of button: "top", "bottom", "justify", default middle
   */
  alignVertical: {
    attribute: "align-vertical",
    reflect: true,
    type: String,
  },

  /**
   * is toolbar collapsed?
   */
  disabled: {
    name: "disabled",
    type: Boolean,
    attribute: "disabled",
    reflect: true,
  },

  /**
   * is toolbar collapsed?
   */
  hidden: {
    name: "hidden",
    type: Boolean,
    attribute: "hidden",
    reflect: true,
  },

  /**
   * Optionally place icon at top, bottom, or right of label
   */
  iconPosition: {
    type: String,
    attribute: "icon-position",
    reflect: true,
  },

  /**
   * show text label for more button.
   */
  showTextLabel: {
    name: "showTextLabel",
    type: Boolean,
    attribute: "more-show-text-label",
  },

  /**
   * Direction that the tooltip should flow
   */
  tooltipDirection: {
    type: String,
    attribute: "tooltip-direction",
    reflect: true,
  },
};
exports.SimpleToolbarGlobalProperties = SimpleToolbarGlobalProperties;

var SimpleToolbarButtonBehaviors = function SimpleToolbarButtonBehaviors(
  SuperClass
) {
  return (
    /*#__PURE__*/
    (function (_SuperClass) {
      _inherits(_class, _SuperClass);

      _createClass(_class, null, [
        {
          key: "tag",

          /**
           * Store the tag name to make it easier to obtain directly.
           */
          get: function get() {
            return "simple-toolbar-button";
          },
        },
        {
          key: "properties",
          get: function get() {
            return _objectSpread({}, SimpleToolbarGlobalProperties, {
              /**
               * The `id` of the `simple-toolbar` that the toolbar controls.
               */
              controls: {
                type: String,
                attribute: "controls",
                reflect: true,
              },

              /**
               * Optional iron icon name for the button.
               */
              icon: {
                type: String,
                attribute: "icon",
                reflect: true,
              },

              /**
               * Label for the icon.
               */
              label: {
                type: String,
              },

              /**
               * Optional space-separated list of shortcut keys
               */
              shortcutKeys: {
                attribute: "shortcut-keys",
                type: String,
              },

              /**
               * Show text label even if an icon is named?
               */
              showTextLabel: {
                attribute: "show-text-label",
                type: Boolean,
                reflect: true,
              },

              /**
               * The active selected range, inherited from the toolbar
               */
              target: {
                type: Object,
              },

              /**
               * Optional iron icon name for the button if it is toggled.
               */
              toggledIcon: {
                attribute: "toggled-icon",
                type: String,
              },

              /**
               * Label for the icon, if button is toggled.
               */
              toggledLabel: {
                attribute: "toggled-label",
                type: String,
              },

              /**
               * Can this button toggle?
               */
              toggles: {
                type: Boolean,
              },

              /**
               * Can this button toggle?
               */
              toggled: {
                attribute: "toggled",
                type: Boolean,
              },

              /**
               * Label for the icon, if button is toggled.
               */
              toggledTooltip: {
                attribute: "toggled-tooltip",
                type: String,
              },
            });
          },
        },
      ]);

      function _class() {
        var _this;

        _classCallCheck(this, _class);

        _this = _possibleConstructorReturn(
          this,
          _getPrototypeOf(_class).call(this)
        );
        _this.disabled = false;
        _this.showTextLabel = false;
        _this.toggles = false;
        _this.shortcutKeys = "";
        Promise.resolve().then(function () {
          return _interopRequireWildcard(
            require("@lrnwebcomponents/simple-tooltip/simple-tooltip.js")
          );
        });
        return _this;
      }
      /**
       * gets button element
       *
       * @readonly
       * @memberof SimpleToolbarButton
       */

      _createClass(
        _class,
        [
          {
            key: "updated",
            value: function updated(changedProperties) {
              _get(_getPrototypeOf(_class.prototype), "updated", this).call(
                this,
                changedProperties
              );

              changedProperties.forEach(function (oldValue, propName) {});
            },
            /**
             * Called every time the element is inserted into the DOM. Useful for
             * running setup code, such as fetching resources or rendering.
             * Generally, you should try to delay work until this time.
             */
          },
          {
            key: "connectedCallback",
            value: function connectedCallback() {
              _get(
                _getPrototypeOf(_class.prototype),
                "connectedCallback",
                this
              ).call(this);

              this.dispatchEvent(
                new CustomEvent("register-button", {
                  bubbles: true,
                  cancelable: true,
                  composed: true,
                  detail: this,
                })
              );
            },
            /**
             * life cycle, element is detatched
             */
          },
          {
            key: "disconnectedCallback",
            value: function disconnectedCallback() {
              this.dispatchEvent(
                new CustomEvent("deregister-button", {
                  bubbles: true,
                  cancelable: true,
                  composed: true,
                  detail: this,
                })
              );

              _get(
                _getPrototypeOf(_class.prototype),
                "disconnectedCallback",
                this
              ).call(this);
            },
            /**
             * updates a button value based on whether or not button is toggled
             *
             * @param {string} the value when toggled off
             * @param {string} the value when toggled on
             * @param {boolean} whether the button is toggled
             * @returns {string} the correct value based on
             * whether or not the button is toggled
             */
          },
          {
            key: "_defaultOrToggled",
            value: function _defaultOrToggled(toggledOff, toggledOn) {
              return this._uniqueText(toggledOn) && this.isToggled
                ? toggledOn
                : toggledOff;
            },
            /**
             * handles button click
             *
             * @param {event} e event
             */
          },
          {
            key: "_handleClick",
            value: function _handleClick(e) {
              this.toggle();
            },
            /**
             * customizable event for when shortcut keys are pressed
             *
             * @param {string} key
             */
          },
          {
            key: "_handleShortcutKeys",
            value: function _handleShortcutKeys(e, key) {},
          },
          {
            key: "toggle",
            value: function toggle() {
              if (this.toggles) this.toggled = !this.toggled;
            },
          },
          {
            key: "click",
            value: function click(e) {
              this._handleClick(e);
            },
            /**
             * updates toolbar buttonregistry as needed
             *
             */
          },
          {
            key: "updateButtonRegistry",
            value: function updateButtonRegistry() {
              this.dispatchEvent(
                new CustomEvent("update-button-registry", {
                  bubbles: true,
                  cancelable: true,
                  composed: true,
                  detail: this,
                })
              );
            },
            /**
             * is label specified
             *
             * @readonly
             */
          },
          {
            key: "_uniqueText",

            /**
             * checks to see if a string is unique and not empty
             *
             * @param {string} [string1='']
             * @param {string} [string2='']
             * @returns
             */
            value: function _uniqueText() {
              var string1 =
                arguments.length > 0 && arguments[0] !== undefined
                  ? arguments[0]
                  : "";
              var string2 =
                arguments.length > 1 && arguments[1] !== undefined
                  ? arguments[1]
                  : "";
              return string1.trim() !== string2.trim();
            },
            /**
             * template for button icon
             *
             * @readonly
             */
          },
          {
            key: "render",
            value: function render() {
              return (0, _litElement.html)(
                _templateObject(),
                this.buttonTemplate
              );
            },
            /**
             * styles for offscreen elements
             *
             * @readonly
             * @static
             */
          },
          {
            key: "button",
            get: function get() {
              if (!this.__button)
                this.__button =
                  this.shadowRoot &&
                  this.shadowRoot.querySelector("button[part=button]")
                    ? this.shadowRoot.querySelector("button[part=button]")
                    : undefined;
              return this.__button;
            },
            /**
             * current label based on toggled state
             *
             * @readonly
             * @memberof SimpleToolbarButton
             */
          },
          {
            key: "currentLabel",
            get: function get() {
              return this._defaultOrToggled(
                this.label,
                this.toggledLabel,
                this.isToggled
              );
            },
            /**
             * current icon based on toggled state
             *
             * @readonly
             * @memberof SimpleToolbarButton
             */
          },
          {
            key: "currentIcon",
            get: function get() {
              return this._defaultOrToggled(
                this.icon,
                this.toggledIcon,
                this.isToggled
              );
            },
            /**
             * current label based on toggled state
             *
             * @readonly
             * @memberof SimpleToolbarButton
             */
          },
          {
            key: "currentTooltip",
            get: function get() {
              return this._defaultOrToggled(
                this.tooltip,
                this.toggledTootip,
                this.isToggled
              );
            },
            /**
             * determines if button is toggled
             *
             * @readonly
             * @memberof SimpleToolbarButton
             */
          },
          {
            key: "isToggled",
            get: function get() {
              return this.toggles & this.toggled;
            },
          },
          {
            key: "hasLabel",
            get: function get() {
              return this._uniqueText(this.currentLabel);
            },
            /**
             * is icon specified
             *
             * @readonly
             */
          },
          {
            key: "hasIcon",
            get: function get() {
              return this._uniqueText(this.currentIcon);
            },
            /**
             * is tooltip specified
             *
             * @readonly
             */
          },
          {
            key: "hasTooltip",
            get: function get() {
              return this._uniqueText(this.currentTooltip);
            },
            /**
             * is visible label is needed or specified
             *
             * @readonly
             */
          },
          {
            key: "labelVisible",
            get: function get() {
              return (!this.hasIcon || this.showTextLabel) && this.hasLabel;
            },
            /**
             * is tooltip needed or specified
             *
             * @readonly
             */
          },
          {
            key: "tooltipVisible",
            get: function get() {
              return (
                this.hasTooltip &&
                (!this.labelVisible ||
                  this._uniqueText(this.currentLabel, this.tooltip))
              );
            },
          },
          {
            key: "iconTemplate",
            get: function get() {
              return !this.hasIcon
                ? ""
                : (0, _litElement.html)(_templateObject2(), this.currentIcon);
            },
            /**
             * template for button label
             *
             * @readonly
             */
          },
          {
            key: "labelTemplate",
            get: function get() {
              return !this.hasLabel
                ? ""
                : (0, _litElement.html)(
                    _templateObject3(),
                    this.labelVisible ? "" : "offscreen",
                    this.currentLabel
                  );
            },
            /**
             * template for button tooltip
             *
             * @readonly
             */
          },
          {
            key: "tooltipTemplate",
            get: function get() {
              return !this.tooltipVisible
                ? ""
                : (0, _litElement.html)(
                    _templateObject4(),
                    this.tooltipDirection || "bottom",
                    this.currentLabel
                  );
            },
            /**
             * template for button, based on whether or not the button toggles
             *
             * @readonly
             */
          },
          {
            key: "buttonTemplate",
            get: function get() {
              return this.toggles
                ? (0, _litElement.html)(
                    _templateObject5(),
                    this.isToggled ? "true" : "false",
                    this.disabled,
                    this.controls,
                    this._handleClick,
                    this._handleKeys,
                    this.iconTemplate,
                    this.labelTemplate,
                    this.tooltipTemplate
                  )
                : (0, _litElement.html)(
                    _templateObject6(),
                    this.disabled,
                    this.controls,
                    this._handleClick,
                    this._handleKeys,
                    this.iconTemplate,
                    this.labelTemplate,
                    this.tooltipTemplate
                  );
            },
          },
        ],
        [
          {
            key: "labelStyles",
            get: function get() {
              return [(0, _litElement.css)(_templateObject7())];
            },
            /**
             * styles for button icon
             *
             * @readonly
             * @static
             */
          },
          {
            key: "iconStyles",
            get: function get() {
              return [(0, _litElement.css)(_templateObject8())];
            },
            /**
             * styles for button tooltip
             *
             * @readonly
             * @static
             */
          },
          {
            key: "tooltipStyles",
            get: function get() {
              return [(0, _litElement.css)(_templateObject9())];
            },
            /**
             * these styles are essential to how the button works
             *
             * @readonly
             * @static
             */
          },
          {
            key: "simpleButtonCoreStyles",
            get: function get() {
              return [(0, _litElement.css)(_templateObject10())];
            },
            /**
             * these styles can be extended and overridden if button layout needs to change
             *
             * @readonly
             * @static
             */
          },
          {
            key: "simpleButtonLayoutStyles",
            get: function get() {
              return [(0, _litElement.css)(_templateObject11())];
            },
            /**
             * these styles can be extended and overridden if button colors need to change
             *
             * @readonly
             * @static
             */
          },
          {
            key: "simpleButtonThemeStyles",
            get: function get() {
              return [(0, _litElement.css)(_templateObject12())];
            },
            /**
             * aggregates separate styles
             *
             * @readonly
             * @static
             */
          },
          {
            key: "styles",
            get: function get() {
              return [].concat(
                _toConsumableArray(this.iconStyles),
                _toConsumableArray(this.labelStyles),
                _toConsumableArray(this.tooltipStyles),
                _toConsumableArray(this.simpleButtonCoreStyles),
                _toConsumableArray(this.simpleButtonLayoutStyles),
                _toConsumableArray(this.simpleButtonThemeStyles)
              );
            },
          },
        ]
      );

      return _class;
    })(SuperClass)
  );
};
/**
 * `simple-toolbar-button`
 * a button for rich text editor (custom buttons can extend this)
 *
### Styling

`<simple-toolbar-button>` provides following custom properties and mixins
for styling:

Custom property | Description | Default
----------------|-------------|----------
--simple-toolbar-button-height | button height | 24px
--simple-toolbar-button-flex | flex for button in a toolbar | 0 0 auto
--simple-toolbar-button-min-width | button min-width | --simple-toolbar-button-height
--simple-toolbar-button-padding | button padding | 0
--simple-toolbar-button-opacity | button opacity | 1
--simple-toolbar-button-color | button text color | unset
--simple-toolbar-button-bg | button background color | transparent
--simple-toolbar-button-border-color | button border color | --simple-toolbar-border-color
--simple-toolbar-button-border-width | button border width | --simple-toolbar-border-width
--simple-toolbar-button-border-radius | button border radius | 3px
--simple-toolbar-button-toggled-opacity | button opacity when toggled | 0.8
--simple-toolbar-button-toggled-color | button text color when toggled | unset
--simple-toolbar-button-toggled-bg | button background color when toggled | unset
--simple-toolbar-button-toggled-border-color | button border color when toggled | unset
--simple-toolbar-button-hover-opacity | button opacity when hovered | 0.8
--simple-toolbar-button-hover-color | button text color when hovered | unset
--simple-toolbar-button-hover-bg | button background color when hovered | unset
--simple-toolbar-button-hover-border-color | button border color when hovered | unset
--simple-toolbar-button-disabled-opacity | button opacity when disabled | 0.5
--simple-toolbar-button-disabled-color | button text color when disabled | unset
--simple-toolbar-button-disabled-bg | button background color when disabled | unset
--simple-toolbar-button-disabled-border-color | button border color when disabled | unset
 * 
 * @customElement
 * @extends SimpleToolbarButtonBehaviors
 * @extends LitElement
 * @lit-html
 * @lit-element
 * @demo ./demo/buttons.html
 */

exports.SimpleToolbarButtonBehaviors = SimpleToolbarButtonBehaviors;

var SimpleToolbarButton =
  /*#__PURE__*/
  (function (_SimpleToolbarButtonB) {
    _inherits(SimpleToolbarButton, _SimpleToolbarButtonB);

    function SimpleToolbarButton() {
      _classCallCheck(this, SimpleToolbarButton);

      return _possibleConstructorReturn(
        this,
        _getPrototypeOf(SimpleToolbarButton).apply(this, arguments)
      );
    }

    return SimpleToolbarButton;
  })(SimpleToolbarButtonBehaviors(_litElement.LitElement));

exports.SimpleToolbarButton = SimpleToolbarButton;
window.customElements.define(SimpleToolbarButton.tag, SimpleToolbarButton);

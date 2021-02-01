"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimpleToolbarButtonBehaviors = exports.SimpleToolbarButton = void 0;

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

function _templateObject10() {
  var data = _taggedTemplateLiteral([
    '\n          :host {\n            flex: 0 1 auto;\n            min-width: var(\n              --simple-toolbar-button-min-width,\n              var(--simple-toolbar-button-height, 24px)\n            );\n            white-space: nowrap;\n          }\n          :host([hidden]) {\n            display: none;\n          }\n          #button {\n            min-width: var(\n              --simple-toolbar-button-min-width,\n              var(--simple-toolbar-button-height, 24px)\n            );\n            min-height: var(--simple-toolbar-button-height, 24px);\n            margin: 0;\n            padding: var(--simple-toolbar-button-padding, 0);\n            color: var(--simple-toolbar-button-color);\n            border-color: var(\n              --simple-toolbar-button-border-color,\n              var(--simple-toolbar-border-color, transparent)\n            );\n            background-color: var(--simple-toolbar-button-bg, transparent);\n            opacity: var(--simple-toolbar-button-opacity, 1);\n            border-width: var(\n              --simple-toolbar-button-border-width,\n              var(--simple-toolbar-border-width, 1px)\n            );\n            border-radius: var(--simple-toolbar-border-radius, 3px);\n            border-style: solid;\n            text-transform: unset;\n            display: flex;\n            flex: 0 1 auto;\n            white-space: nowrap;\n            align-items: stretch;\n            transition: all 0.5s;\n          }\n          #button[aria-pressed="true"] {\n            color: var(--simple-toolbar-button-toggled-color);\n            border-color: var(--simple-toolbar-toggled-border-color);\n            background-color: var(--simple-toolbar-button-toggled-bg);\n            opacity: var(--simple-toolbar-button-toggled-opacity, 0.8);\n          }\n          #button:focus,\n          #button:hover {\n            color: var(--simple-toolbar-button-hover-color);\n            background-color: var(--simple-toolbar-button-hover-bg);\n            border-color: var(--simple-toolbar-hover-border-color);\n            opacity: var(--simple-toolbar-button-hover-opacity, 0.8);\n          }\n          #button[disabled] {\n            cursor: not-allowed;\n            color: var(--simple-toolbar-button-disabled-color, unset);\n            background-color: var(--simple-toolbar-button-disabled-bg, unset);\n            opacity: var(--simple-toolbar-button-disabled-opacity, 0.5);\n          }\n        ',
  ]);

  _templateObject10 = function _templateObject10() {
    return data;
  };

  return data;
}

function _templateObject9() {
  var data = _taggedTemplateLiteral([
    "\n          simple-tooltip {\n            z-index: 2;\n          }\n        ",
  ]);

  _templateObject9 = function _templateObject9() {
    return data;
  };

  return data;
}

function _templateObject8() {
  var data = _taggedTemplateLiteral([
    "\n          #icon:not([icon]) {\n            display: none;\n          }\n          #icon[icon] {\n            width: var(\n              --simple-toolbar-button-min-width,\n              var(--simple-toolbar-button-height, 24px)\n            );\n            height: var(--simple-toolbar-button-height, 24px);\n            flex: 0 0 auto;\n          }\n        ",
  ]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  var data = _taggedTemplateLiteral([
    "\n          .offscreen {\n            position: absolute;\n            left: -999999px;\n            top: 0;\n            height: 0;\n            width: 0;\n            overflow: hidden;\n          }\n        ",
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
    '"\n              tabindex="0"\n            >\n              ',
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
    '"\n              tabindex="0"\n            >\n              ',
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
    '<simple-tooltip id="tooltip" for="button"\n        >',
    "</simple-tooltip\n      >",
  ]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    '<span id="label" class="',
    '"\n        >',
    "</span\n      >",
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '<simple-icon-lite\n        id="icon"\n        aria-hidden="true"\n        icon="',
    '"\n      ></simple-icon-lite>',
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
            return {
              /**
               * The `id` of the `simple-toolbar` that the toolbar controls.
               */
              controls: {
                type: String,
                attribute: "controls",
                reflect: true,
              },

              /**
               * Is the button disabled? Default is false.
               */
              disabled: {
                type: Boolean,
                attribute: "disabled",
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
            };
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
              return !!toggledOn && this.isToggled ? toggledOn : toggledOff;
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
                  detail: {
                    button: this,
                  },
                })
              );
            },
          },
          {
            key: "render",
            value: function render() {
              return (0, _litElement.html)(
                _templateObject(),
                this.buttonTemplate
              );
            },
          },
          {
            key: "button",
            get: function get() {
              if (!this.__button)
                this.__button =
                  this.shadowRoot && this.shadowRoot.querySelector("#button")
                    ? this.shadowRoot.querySelector("#button")
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
             * label is offscreen (screenreader-only)
             *
             * @readonly
             * @memberof SimpleToolbarButton
             */
          },
          {
            key: "labelStyle",
            get: function get() {
              return !!this.icon &&
                this.icon !== "" &&
                this.showTextLabel === false
                ? "offscreen"
                : null;
            },
            /**
             * determines if button is toggled
             *
             * @readonly
             */
          },
          {
            key: "isToggled",
            get: function get() {
              return this.toggles & this.toggled;
            },
          },
          {
            key: "iconTemplate",
            get: function get() {
              return (0, _litElement.html)(
                _templateObject2(),
                this.currentIcon
              );
            },
          },
          {
            key: "labelTemplate",
            get: function get() {
              return (0, _litElement.html)(
                _templateObject3(),
                this.labelStyle,
                this.currentLabel
              );
            },
          },
          {
            key: "tooltipTemplate",
            get: function get() {
              return (0, _litElement.html)(
                _templateObject4(),
                this.currentLabel
              );
            },
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
            key: "offScreenStyles",
            get: function get() {
              return [(0, _litElement.css)(_templateObject7())];
            },
          },
          {
            key: "iconStyles",
            get: function get() {
              return [(0, _litElement.css)(_templateObject8())];
            },
          },
          {
            key: "tooltipStyles",
            get: function get() {
              return [(0, _litElement.css)(_templateObject9())];
            },
          },
          {
            key: "buttonStyles",
            get: function get() {
              return [(0, _litElement.css)(_templateObject10())];
            },
          },
          {
            key: "styles",
            get: function get() {
              return [].concat(
                _toConsumableArray(
                  _get(_getPrototypeOf(_class), "styles", this) || []
                ),
                _toConsumableArray(this.buttonStyles),
                _toConsumableArray(this.iconStyles),
                _toConsumableArray(this.offScreenStyles),
                _toConsumableArray(this.tooltipStyles)
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
 * @element simple-toolbar-button
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
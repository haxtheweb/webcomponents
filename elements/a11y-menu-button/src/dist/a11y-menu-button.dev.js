"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.A11yMenuButtonBehaviors = exports.A11yMenuButton = void 0;

var _litElement = require("lit-element/lit-element.js");

require("./lib/a11y-menu-button-item.js");

require("@lrnwebcomponents/absolute-position-behavior/absolute-position-behavior.js");

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

function _templateObject6() {
  var data = _taggedTemplateLiteral(["<slot></slot>"]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral([
    '\n        <button\n          id="menubutton"\n          aria-haspopup="true"\n          aria-controls="menu"\n          aria-expanded="',
    '"\n          part="button"\n        >\n          <slot name="button"></slot>\n        </button>\n      ',
  ]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral([
    '\n        <absolute-position-behavior\n          ?auto="',
    '"\n          for="menubutton"\n          position="',
    '"\n          position-align="',
    '"\n          .offset="',
    '"\n          fit-to-visible-bounds\n          part="menu-outer"\n        >\n          <ul\n            id="menu"\n            role="menu"\n            aria-labelledby="menubutton"\n            ?hidden="',
    '"\n            @mousover="',
    '"\n            @mousout="',
    '"\n            part="menu"\n          >\n            ',
    "\n          </ul>\n        </absolute-position-behavior>\n      ",
  ]);

  _templateObject4 = function _templateObject4() {
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

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    '\n          button[part="button"] {\n            padding: var(--a11y-menu-button-vertical-padding, 2px)\n              var(--a11y-menu-button-horizontal-padding, 5px);\n            text-align: var(--a11y-menu-button-text-align, center);\n            background-color: var(--a11y-menu-button-bg-color, white);\n            color: var(--a11y-menu-button-color, currentColor);\n            background-color: var(--a11y-menu-button-bg-color, white);\n            border-radius: var(--a11y-menu-button-border-radius, 0);\n            border-left: var(--a11y-menu-button-border-left, unset);\n            border-top: var(--a11y-menu-button-border-top, unset);\n            border-right: var(--a11y-menu-button-border-right, unset);\n            border-bottom: var(--a11y-menu-button-border-bottom, unset);\n            border: var(--a11y-menu-button-border, 1px solid #ddd);\n            box-shadow: var(--a11y-menu-button-box-shadow, unset);\n            transition: all 0.25s ease-in-out;\n          }\n          button[part="button"]:focus,\n          button[part="button"]:hover {\n            color: var(\n              --a11y-menu-button-focus-color,\n              var(--a11y-menu-button-color, currentColor)\n            );\n            background-color: var(\n              --a11y-menu-button-focus-bg-color,\n              var(--a11y-menu-button-bg-color, white)\n            );\n            border-left: var(\n              --a11y-menu-button-focus-border-left,\n              var(--a11y-menu-button-border-left, unset)\n            );\n            border-top: var(\n              --a11y-menu-button-focus-border-top,\n              var(--a11y-menu-button-border-top, unset)\n            );\n            border-right: var(\n              --a11y-menu-button-focus-border-right,\n              var(--a11y-menu-button-border-right, unset)\n            );\n            border-bottom: var(\n              --a11y-menu-button-focus-border-bottom,\n              var(--a11y-menu-button-border-bottom, unset)\n            );\n            border: var(\n              --a11y-menu-button-focus-border,\n              var(--a11y-menu-button-border, 1px solid #ddd)\n            );\n            box-shadow: var(\n              --a11y-menu-button-box-shadow,\n              var(--a11y-menu-button-focus-box-shadow, unset)\n            );\n          }\n          :host([expanded]) absolute-position-behavior {\n            width: var(--a11y-menu-button-list-width, unset);\n            height: var(--a11y-menu-button-list-height, unset);\n            border: var(\n              --a11y-menu-button-list-border,\n              var(--a11y-menu-button-border, 1px solid #ddd)\n            );\n            background-color: var(\n              --a11y-menu-button-bg-color,\n              var(--a11y-menu-button-list-bg-color, white)\n            );\n            box-shadow: var(--a11y-menu-button-list-box-shadow, unset);\n          }\n        ',
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n          :host {\n            padding: 0;\n            display: inline-flex;\n            position: relative;\n            z-index: 1;\n          }\n          :host([expanded]) {\n            z-index: var(--a11y-menu-button-focus-z-index, 1000);\n          }\n          button[part="button"] {\n            display: block;\n            text-decoration: inherit;\n            font-family: inherit;\n            font-size: inherit;\n            margin: 0;\n            width: 100%;\n          }\n          absolute-position-behavior {\n            z-index: -1;\n            overflow: hidden;\n          }\n          :host([expanded]) absolute-position-behavior {\n            z-index: var(--a11y-menu-button-focus-z-index, 1000);\n          }\n          :host(:not([expanded])) absolute-position-behavior {\n            border-color: none !important;\n          }\n          ul {\n            margin: 0;\n            padding: 0;\n            list-style: none;\n          }\n        ',
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
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

var A11yMenuButtonBehaviors = function A11yMenuButtonBehaviors(SuperClass) {
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
                this.buttonTemplate,
                this.menuTemplate
              );
            },
          },
        ],
        [
          {
            key: "menuButtonCoreStyles",

            /**
             * the core styles needed to make a menu button
             *
             * @readonly
             * @static
             */
            get: function get() {
              return [(0, _litElement.css)(_templateObject2())];
            },
            /**
             * styles that can be customized by
             * extending and overriding this getter
             *
             * @readonly
             * @static
             */
          },
          {
            key: "menuButtonThemeStyles",
            get: function get() {
              return [(0, _litElement.css)(_templateObject3())];
            },
          },
          {
            key: "styles",
            get: function get() {
              return [].concat(
                _toConsumableArray(this.menuButtonCoreStyles),
                _toConsumableArray(this.menuButtonThemeStyles)
              );
            },
          },
          {
            key: "tag",
            get: function get() {
              return "a11y-menu-button";
            },
          },
          {
            key: "properties",
            get: function get() {
              return {
                /**
                 * Whether toggle is disabled
                 */
                currentItem: {
                  type: Object,
                },

                /**
                 * Whether toggle is disabled
                 */
                disabled: {
                  attribute: "disabled",
                  type: Boolean,
                },

                /**
                 * Whether toggle is disabled
                 */
                expanded: {
                  attribute: "expanded",
                  type: Boolean,
                  reflect: true,
                },

                /**
                 * Whether button is toggled
                 */
                focused: {
                  attribute: "focused",
                  type: Boolean,
                },

                /**
                 * Whether button is toggled
                 */
                hovered: {
                  attribute: "hovered",
                  type: Boolean,
                },

                /**
                 * spacing between top of list and menu button
                 */
                offset: {
                  type: Number,
                  attribute: "offset",
                },

                /**
                 * Positions list to top, right, bottom, left of its content.
                 */
                position: {
                  type: String,
                  attribute: "position",
                  reflect: true,
                },

                /**
                 * Aligns list at start, or end fo target. Default is centered.
                 */
                positionAlign: {
                  type: String,
                  attribute: "position-align",
                  reflect: true,
                },

                /**
                 * menu items in array form to move from prev to next
                 */
                __menuItems: {
                  type: Array,
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
        _this.__menuItems = [];
        _this.position = "bottom";
        _this.positionAlign = "start";
        _this.offset = 0;

        _this.addEventListener("keydown", _this._handleKeydown);

        _this.addEventListener("click", _this._handleClick);

        _this.addEventListener("focus", _this._handleFocus);

        _this.addEventListener("blur", _this._handleBlur);

        _this.addEventListener("mouseover", _this._handleMouseover);

        _this.addEventListener("mouseout", _this._handleMouseout);

        _this.addEventListener(
          "add-a11y-menu-button-item",
          _this._handleAddItem
        );

        _this.addEventListener(
          "remove-a11y-menu-button-item",
          _this._handleRemoveItem
        );

        return _this;
      }
      /**
       * template for dropdown menu
       *
       * @readonly
       */

      _createClass(_class, [
        {
          key: "close",

          /**
           * closes menu
           *
           * @param {boolean} force close even if other items have focus
           * @memberof A11yMenuButton
           */
          value: function close(force) {
            if (force || (!this.focused && !this.hovered)) {
              this.expanded = false;
              /**
               * Fires when menu is closed
               * @event close
               */

              this.dispatchEvent(
                new CustomEvent("close", {
                  bubbles: true,
                  cancelable: true,
                  composed: true,
                  detail: event,
                })
              );
            }
          },
          /**
           * opens menu
           *
           * @memberof A11yMenuButton
           */
        },
        {
          key: "open",
          value: function open() {
            this.expanded = true;
            /**
             * Fires when menu is opened
             * @event close
             */

            this.dispatchEvent(
              new CustomEvent("open", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: event,
              })
            );
          },
          /**
           * gives focus to menu
           *
           * @memberof A11yMenuButton
           */
        },
        {
          key: "focus",
          value: function focus() {
            if (
              this.shadowRoot &&
              this.shadowRoot.querySelector("#menubutton")
            ) {
              this.shadowRoot.querySelector("#menubutton").focus();
            }
          },
          /**
           * focuses on a menu item
           *
           * @param {object} item menu item
           * @memberof A11yMenuButton
           */
        },
        {
          key: "focusOn",
          value: function focusOn(item) {
            item = item || this.firstItem();

            if (item) {
              this.open();
              this.focused = true;
              this.currentItem = item;
              item.focus();
            }
          },
          /**
           * focuses on item based on character pressed
           *
           * @param {string} char character pressed
           * @memberof A11yMenuButton
           */
        },
        {
          key: "focusByCharacter",
          value: function focusByCharacter(_char) {
            var _this2 = this;

            var start,
              index,
              _char = _char.toLowerCase(),
              firstChars = function firstChars(startIndex, _char2) {
                for (var i = startIndex; i < _this2.firstChars.length; i++) {
                  if (_char2 === _this2.firstChars[i]) {
                    return i;
                  }
                }

                return -1;
              }; // Get start index for search based on position of currentItem

            start = this.__menuItems.indexOf(this.currentItem) + 1;

            if (start === this.__menuItems.length) {
              start = 0;
            } // Check remaining slots in menu

            index = firstChars(start, _char); // If not found in remaining slots, check from beginning

            if (index === -1) {
              index = firstChars(0, _char);
            } // If match was found...

            if (index > -1) {
              this.__menuItems[index].focus();
            }
          },
          /**
           * gets first menu item
           *
           * @returns {object}
           * @memberof A11yMenuButton
           */
        },
        {
          key: "firstItem",
          value: function firstItem() {
            return this.querySelector("a11y-menu-button-item");
          },
          /**
           * gets previous menu item
           *
           * @returns {object}
           * @memberof A11yMenuButton
           */
        },
        {
          key: "previousItem",
          value: function previousItem() {
            return this.currentItem
              ? this.currentItem.previousElementSibling
              : undefined;
          },
          /**
           * gets next menu item
           *
           * @returns {object}
           * @memberof A11yMenuButton
           */
        },
        {
          key: "nextItem",
          value: function nextItem() {
            return this.currentItem
              ? this.currentItem.nextElementSibling
              : undefined;
          },
          /**
           * gets last menu item
           *
           * @returns {object}
           * @memberof A11yMenuButton
           */
        },
        {
          key: "lastItem",
          value: function lastItem() {
            return this.querySelector("a11y-menu-button-item:last-child");
          },
          /**
           * when a new menu item is added to slot,
           * updates menu items list and adds event listeners for item
           *
           * @param {event} event
           * @memberof A11yMenuButton
           */
        },
        {
          key: "_handleAddItem",
          value: function _handleAddItem(event) {
            var _this3 = this;

            event.stopPropagation();
            this.__menuItems = this.querySelectorAll("a11y-menu-button-item");

            if (event.detail) {
              event.detail.addEventListener("keydown", function (e) {
                return _this3._handleItemKeydown(e, event.detail);
              });
              event.detail.addEventListener(
                "click",
                this._handleItemClick.bind(this)
              );
              event.detail.addEventListener(
                "focus",
                this._handleFocus.bind(this)
              );
              event.detail.addEventListener(
                "blur",
                this._handleBlur.bind(this)
              );
              event.detail.addEventListener(
                "mouseover",
                this._handleMouseover.bind(this)
              );
              event.detail.addEventListener(
                "mouseout",
                this._handleMouseout.bind(this)
              );
            }
          },
          /**
           * when a new menu item is removed from slot,
           * updates menu items list and removes event listeners for item
           *
           * @param {event} event
           * @memberof A11yMenuButton
           */
        },
        {
          key: "_handleRemoveItem",
          value: function _handleRemoveItem(event) {
            var _this4 = this;

            event.stopPropagation();
            this.__menuItems = this.querySelectorAll("a11y-menu-button-item");

            if (event.detail) {
              event.detail.removeEventListener("keydown", function (e) {
                return _this4._handleItemKeydown(e, event.detail);
              });
              event.detail.removeEventListener(
                "click",
                this._handleItemClick.bind(this)
              );
              event.detail.removeEventListener(
                "focus",
                this._handleFocus.bind(this)
              );
              event.detail.removeEventListener(
                "blur",
                this._handleItemBlur.bind(this)
              );
              event.detail.removeEventListener(
                "mouseover",
                this._handleMouseover.bind(this)
              );
              event.detail.removeEventListener(
                "mouseout",
                this._handleMouseout.bind(this)
              );
            }
          },
          /**
           * when menu item is clicked,
           * focus on menu button and close menu
           *
           * @param {event} event
           * @memberof A11yMenuButton
           */
        },
        {
          key: "_handleItemClick",
          value: function _handleItemClick(event) {
            this.focus();
            this.close(true);
            this.dispatchEvent(
              new CustomEvent("item-click", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: event,
              })
            );
          },
          /**
           * handles menu item keydown
           *
           * @param {event} event
           * @param {object} item
           * @memberof A11yMenuButton
           */
        },
        {
          key: "_handleItemKeydown",
          value: function _handleItemKeydown(event, item) {
            var flag = false,
              _char3 = event.key,
              isPrintableCharacter = function isPrintableCharacter(str) {
                return str.length === 1 && str.match(/\S/);
              };

            if (
              event.ctrlKey ||
              event.altKey ||
              event.metaKey ||
              event.keyCode === this.keyCode.SPACE ||
              event.keyCode === this.keyCode.RETURN
            ) {
              return;
            }

            if (event.shiftKey) {
              if (isPrintableCharacter(_char3)) {
                this.menu.setFocusByFirstCharacter(this, _char3);
                flag = true;
              }

              if (event.keyCode === this.keyCode.TAB) {
                this.focus();
                this.close(true);
              }
            } else {
              switch (event.keyCode) {
                case this.keyCode.ESC:
                  this.focus();
                  this.close(true);
                  flag = true;
                  break;

                case this.keyCode.UP:
                  this.focusOn(this.previousItem() || this.lastItem());
                  flag = true;
                  break;

                case this.keyCode.DOWN:
                  this.focusOn(this.nextItem() || this.firstItem());
                  flag = true;
                  break;

                case this.keyCode.HOME:
                case this.keyCode.PAGEUP:
                  this.currentItem = this.firstItem();
                  flag = true;
                  break;

                case this.keyCode.END:
                case this.keyCode.PAGEDOWN:
                  this.currentItem = this.lastItem();
                  flag = true;
                  break;

                case this.keyCode.TAB:
                  this.focus();
                  this.close(true);
                  break;

                default:
                  if (isPrintableCharacter(_char3)) {
                    this.menu.setFocusByFirstCharacter(this, _char3);
                  }

                  break;
              }
            }

            if (flag) {
              event.stopPropagation();
              event.preventDefault();
            }
          },
          /**
           * handles when menu item loses focus
           *
           * @param {event} event
           * @memberof A11yMenuButton
           */
        },
        {
          key: "_handleItemBlur",
          value: function _handleItemBlur(event) {
            this.focused = false;
            setTimeout(this.close(), 300);
          },
          /**
           * handles menu button keydown
           *
           * @param {event} event
           * @memberof A11yMenuButton
           */
        },
        {
          key: "_handleKeydown",
          value: function _handleKeydown(event) {
            var flag = false;

            switch (event.keyCode) {
              case this.keyCode.SPACE:
              case this.keyCode.RETURN:
              case this.keyCode.DOWN:
                this.focusOn(this.firstItem());
                flag = true;
                break;

              case this.keyCode.UP:
                if (this.popupMenu) {
                  this.focusOn(this.lastItem());
                  flag = true;
                }

                break;

              default:
                break;
            }

            if (flag) {
              event.stopPropagation();
              event.preventDefault();
            }
          },
          /**
           * handles when menu is clicked
           *
           * @param {event} event
           * @memberof A11yMenuButton
           */
        },
        {
          key: "_handleClick",
          value: function _handleClick(event) {
            if (this.expanded) {
              this.close(true);
            } else {
              this.focusOn(this.firstItem());
            }
          },
          /**
           * handles when menu has focus
           *
           * @param {event} event
           * @memberof A11yMenuButton
           */
        },
        {
          key: "_handleFocus",
          value: function _handleFocus(event) {
            this.focused = true;
          },
          /**
           * handles when menu loses focus
           *
           * @param {event} event
           * @memberof A11yMenuButton
           */
        },
        {
          key: "_handleBlur",
          value: function _handleBlur(event) {
            this.focused = false;
          },
          /**
           * handles menu mouseover
           *
           * @param {event} event
           * @memberof A11yMenuButton
           */
        },
        {
          key: "_handleMouseover",
          value: function _handleMouseover(event) {
            this.hovered = true;
            this.open();
          },
          /**
           * handles menu mouseout
           *
           * @param {event} event
           * @memberof A11yMenuButton
           */
        },
        {
          key: "_handleMouseout",
          value: function _handleMouseout(event) {
            this.hovered = false;
            setTimeout(this.close(), 300);
          },
        },
        {
          key: "menuTemplate",
          get: function get() {
            var _this5 = this;

            return (0, _litElement.html)(
              _templateObject4(),
              this.expanded,
              this.position,
              this.positionAlign,
              this.offset,
              !this.expanded,
              function (e) {
                return (_this5.hover = true);
              },
              function (e) {
                return (_this5.hover = false);
              },
              this.listItemTemplate
            );
          },
          /**
           * template for button
           *
           * @readonly
           */
        },
        {
          key: "buttonTemplate",
          get: function get() {
            return (0, _litElement.html)(
              _templateObject5(),
              this.expanded ? "true" : "false"
            );
          },
          /**
           * template for slotted list items
           *
           * @readonly
           */
        },
        {
          key: "listItemTemplate",
          get: function get() {
            return (0, _litElement.html)(_templateObject6());
          },
          /**
           * key code translations as object
           *
           * @readonly
           * @memberof A11yMenuButton
           */
        },
        {
          key: "keyCode",
          get: function get() {
            return {
              TAB: 9,
              RETURN: 13,
              ESC: 27,
              SPACE: 32,
              PAGEUP: 33,
              PAGEDOWN: 34,
              END: 35,
              HOME: 36,
              LEFT: 37,
              UP: 38,
              RIGHT: 39,
              DOWN: 40,
            };
          },
        },
      ]);

      return _class;
    })(SuperClass)
  );
};
/**
 * a11y-menu-button
 * A toggle button for an property in editable-table interface (editable-table.html).
 *
### Styling

`<a11y-menu-button>` provides custom properties for styling:

Custom property | Description | Default
----------------|-------------|----------
--a11y-menu-button-vertical-padding | vertical padding for menu button | 2px
--a11y-menu-button-horizontal-padding | horizontal padding for menu button | 5px
--a11y-menu-button-text-align | text alignment for menu button | center
--a11y-menu-button-bg-color | default background color | white
--a11y-menu-button-color | default text color | black
--a11y-menu-button-box-shadow | menu button box-shadow | unset
--a11y-menu-button-border-radius | menu button border-radius | 0
--a11y-menu-button-border | default border | 1px solid #ddd
--a11y-menu-button-border-left | overrides default left-border | unset
--a11y-menu-button-border-top | overrides default top-border | unset
--a11y-menu-button-border-right | overrides default right-border | unset
--a11y-menu-button-border-bottom | overrides default bottom-border | unset
--a11y-menu-button-focus-bg-color | background color for menu button when focused | --a11y-menu-button-bg-color
--a11y-menu-button-focus-color | text color for menu button when focused | --a11y-menu-button-color
--a11y-menu-button-focus-border | border for menu button when focused | --a11y-menu-button-border
--a11y-menu-button-focus-border-left | menu button left-border when focused | --a11y-menu-button-border-left
--a11y-menu-button-focus-border-top | menu button top-border when focused | --a11y-menu-button-border-top
--a11y-menu-button-focus-border-right | menu button right-border when focused | --a11y-menu-button-border-right
--a11y-menu-button-focus-border-bottom | menu button bottom-border when focused | --a11y-menu-button-border-bottom
--a11y-menu-button-focus-box-shadow | menu button box-shadow when focused | --a11y-menu-button-box-shadow
--a11y-menu-button-list-width | width of menu list | unset
--a11y-menu-button-list-height | height of menu list | unset
--a11y-menu-button-list-left | left position of menu list | 0
--a11y-menu-button-list-top | top position of menu list | unset
--a11y-menu-button-list-bottom | bottom position of menu list | unset
--a11y-menu-button-list-right | right position of menu list | unset
--a11y-menu-button-list-bg-color | overrides default background color for list box | --a11y-menu-button-bg-color
--a11y-menu-button-border | overrides default border for list box | --a11y-menu-button-list-border
--a11y-menu-button-list-box-shadow | overrides default box shadow for list box | unset
 *
 * @demo ./demo/index.html
 * @element a11y-menu-button
 */

exports.A11yMenuButtonBehaviors = A11yMenuButtonBehaviors;

var A11yMenuButton =
  /*#__PURE__*/
  (function (_A11yMenuButtonBehavi) {
    _inherits(A11yMenuButton, _A11yMenuButtonBehavi);

    function A11yMenuButton() {
      _classCallCheck(this, A11yMenuButton);

      return _possibleConstructorReturn(
        this,
        _getPrototypeOf(A11yMenuButton).apply(this, arguments)
      );
    }

    return A11yMenuButton;
  })(A11yMenuButtonBehaviors(_litElement.LitElement));

exports.A11yMenuButton = A11yMenuButton;
window.customElements.define(A11yMenuButton.tag, A11yMenuButton);

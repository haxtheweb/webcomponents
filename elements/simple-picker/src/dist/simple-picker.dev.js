"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimplePicker = void 0;

var _litElement = require("lit-element/lit-element.js");

var _cache = require("lit-html/directives/cache.js");

var _litHtml = require("lit-html/lit-html.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icons.js");

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

function _templateObject5() {
  var data = _taggedTemplateLiteral([" option-", "-", " "]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral([
    '\n        <simple-picker-option\n          @option-focus="',
    '"\n          @set-selected-option="',
    '"\n          ?active="',
    '"\n          ?hide-option-labels="',
    '"\n          ?hidden="',
    '"\n          ?selected="',
    '"\n          ?title-as-html="',
    '"\n          .data="',
    '"\n          .icon="',
    '"\n          .id="option-',
    "-",
    '"\n          .label="',
    '"\n          .style=',
    '\n          aria-selected="',
    '"\n          role="option"\n          tabindex="-1"\n          value="',
    '"\n        >\n        </simple-picker-option>\n      ',
  ]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["", ""]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n        <div class="row" ?hidden="',
    '">\n          ',
    "\n        </div>\n      ",
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

/**
 * `simple-picker`
 * a simple picker for options, icons, etc.
 *
### Styling

`<simple-picker>` provides the following custom properties and mixins
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--simple-picker-display` | default display for simple-picker | inline-flex
`--simple-picker-font-family` | Main font-family. | inherit
`--simple-picker-font-size` | Main font-size. | inherit
`--simple-picker-color` | Main text color. | black
`--simple-picker-color-active` | Color of sample text when button is focused within or hovered. | --simple-picker-color
`--simple-picker-color-disabled` | Disabled text color. | #888
`--simple-picker-background-color` | Background color for button. | #f0f0f0
`--simple-picker-background-color-disabled` | Background color for button when picker is disabled. | #e8e8e8
`--simple-picker-border-radius` | Main border-radius. | 2px
`--simple-picker-border-width` | Default border width. | 1px
`--simple-picker-border-style` | Default border style. | solid
`--simple-picker-border-color` | Default border color. | --simple-picker-color-disabled
`--simple-picker-focus-border-width` | Border width when focused within or hovered. | --simple-picker-border-width
`--simple-picker-focus-border-style` | Border style when focused within or hovered. | --simple-picker-border-style
`--simple-picker-focus-border-color` | Border color when focused within or hovered. | --simple-picker-border-color
`--simple-picker-listbox-border-width` | Border width of listbox. | --simple-picker-border-width
`--simple-picker-listbox-border-style` | Border style of listbox. | --simple-picker-border-style
`--simple-picker-listbox-border-color` | Border color of listbox. | --simple-picker-border-color
`--simple-picker-label-color` | Label text color. | --simple-picker-color
`--simple-picker-float-label-color` | Floating label text color. | --simple-picker-color-disabled
`--simple-picker-float-label-active-color` | Floating label text color when picker is focused or hovered. | --simple-picker-color-disabled
`--simple-picker-icon-transform` | Rotation of arrow icon by default. | rotate(0deg)
`--simple-picker-expanded-icon-transform` | Rotation of arrow icon when picker is expanded. | rotate(0deg)
`--simple-picker-sample-color` | Sample option text color. | --simple-picker-color
`--simple-picker-sample-padding` | Sample option padding. | 2px
`--simple-picker-sample-background-color` | Sample option background-color. | transparent
`--simple-picker-option-size` | Height of option. | 24px
`--simple-picker-option-selected-background-color` | Outline for currently sselected option. | --simple-picker-options-background-color
`--simple-picker-option-active-background-color` | Outline for currently active option. | #aaddff
`--simple-picker-option-padding` | padding within each simple picker option | 2px 10px
`--simple-picker-option-label-padding` | adding within each simple picker option's label | --simple-picker-option-padding
`--simple-picker-options-max-height` | Maximum amount of space listbox can use before scrolling. Use `unset` for now vertical scroll. | 250px
`--simple-picker-options-border-width` | Border width of listbox. | --simple-picker-border-width
`--simple-picker-options-border-style` | Border style of listbox. | --simple-picker-border-style
`--simple-picker-options-border-color` | Border color of listbox. | --simple-picker-border-color
`--simple-picker-options-background-color` | Background color for listbox. | #fff
`--simple-picker-height` | Calculation based on option size, padding, and border. DO NOT EDIT. | --simple-picker-option-size - --simple-picker-sample-padding * 2 - --simple-picker-border-width * 2
 *
 * @demo ./demo/index.html
 * @element simple-picker
 */
var SimplePicker =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(SimplePicker, _LitElement);

    _createClass(SimplePicker, null, [
      {
        key: "tag",

        /* REQUIRED FOR TOOLING DO NOT TOUCH */

        /**
         * Store the tag name to make it easier to obtain directly.
         * @notice function name must be here for tooling to operate correctly
         */
        get: function get() {
          return "simple-picker";
        }, // life cycle
      },
    ]);

    function SimplePicker() {
      var _this;

      _classCallCheck(this, SimplePicker);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(SimplePicker).call(this)
      );
      Promise.resolve().then(function () {
        return _interopRequireWildcard(
          require("./lib/simple-picker-option.js")
        );
      });
      _this.tag = SimplePicker.tag;
      _this.allowNull = false;
      _this.alignRight = false;
      _this.ariaLabelledby = null;
      _this.blockLabel = false;
      _this.disabled = false;
      _this.expanded = false;
      _this.hideOptionLabels = false;
      _this.hideSample = false;
      _this.label = null;
      _this.__options = [[]];
      _this.options = [
        [
          {
            icon: null,
            style: null,
            alt: null,
            value: null,
          },
        ],
      ];
      _this.titleAsHtml = false;
      _this.value = null;
      _this.__activeDesc = "option-0-0";
      _this.__hasLabel = true;
      _this.__selectedOption = {};

      _this.addEventListener("blur", function (e) {
        this.expanded = false;
      }); // map our imported properties json to real props on the element
      // @notice static getter of properties is built via tooling
      // to edit modify src/test-lit-properties.json

      var obj = SimplePicker.properties;

      for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
          if (_this.hasAttribute(p)) {
            _this[p] = _this.getAttribute(p);
          } else {
            if (p.reflect) _this.setAttribute(p, obj[p].value);
            _this[p] = obj[p].value;
          }
        }
      }

      return _this;
    }

    _createClass(SimplePicker, [
      {
        key: "_renderOptions",
        value: function _renderOptions(options) {
          var _this2 = this;

          return (0, _litElement.html)(
            _templateObject(),
            options.map(function (row, rownum) {
              return (0,
              _litElement.html)(_templateObject2(), !_this2._isRowHidden(row), Array.isArray(row) ? _this2._renderRow(row, rownum) : _litHtml.nothing);
            })
          );
        },
      },
      {
        key: "_isRowHidden",
        value: function _isRowHidden(row) {
          var _this3 = this;

          return (
            !Array.isArray(row) ||
            row.filter(function (col) {
              return !!col.value || !_this3.hideNull;
            }).length < 1
          );
        },
      },
      {
        key: "_renderRow",
        value: function _renderRow(row, rownum) {
          var _this4 = this;

          return (0, _litElement.html)(
            _templateObject3(),
            row.map(function (option, colnum) {
              return (0,
              _litElement.html)(_templateObject4(), _this4._handleOptionFocus, _this4._handleSetSelectedOption, "".concat(_this4.__activeDesc) === "option-".concat(rownum, "-").concat(colnum), _this4.hideOptionLabels, _this4.hideNull && !option.value, _this4.value === option.value, _this4.titleAsHtml, _this4.data, option.icon, rownum, colnum, option.alt, option.style, _this4.value === option.value ? "true" : "false", option.value);
            })
          );
        },
      },
      {
        key: "updated",
        value: function updated(changedProperties) {
          var _this5 = this;

          changedProperties.forEach(function (oldValue, propName) {
            if (propName === "value") _this5._valueChanged();
            if (propName === "options") _this5._optionsChanged();
          });
          /**
           * Fires when properties change
           * @event changed
           */

          this.dispatchEvent(
            new CustomEvent("changed", {
              detail: this,
            })
          );
        },
        /**
         * returns value of selected option.
         *
         * @param {array} options array of options
         * @param {string} optionId selected option's id
         * @returns {object} selected option
         */
      },
      {
        key: "_getOption",
        value: function _getOption(options, optionId) {
          if (
            options !== undefined &&
            optionId !== undefined &&
            optionId !== null
          ) {
            var coords = optionId.split("-");
            return options[coords[1]][coords[2]];
          }

          return null;
        },
        /**
         * sets a new active descendant and sets focus on it
         *
         * @param {number} rownum row number to be tested
         * @param {number} colnum column number to be tested
         * @returns {void}
         */
      },
      {
        key: "_goToOption",
        value: function _goToOption(rownum, colnum) {
          var targetId = (0, _litElement.html)(
              _templateObject5(),
              rownum,
              colnum
            ),
            target = this.shadowRoot.querySelector("#" + targetId),
            active = this.shadowRoot.querySelector("#" + this.__activeDesc);

          if (target !== null) {
            target.tabindex = 0; //allow item to be focusable.

            target.focus();
            active.tabindex = -1; //prevent tabbing between options.
          }
        },
        /**
         * handles listbox click event
         * @param {event} e event
         * @returns {void}
         */
      },
      {
        key: "_handleListboxClick",
        value: function _handleListboxClick(e) {
          if (this.disabled) return;
          /**
           * handles listbox click event
           * @event click
           */

          this.dispatchEvent(
            new CustomEvent("click", {
              detail: this,
            })
          );

          this._toggleListbox();
        },
        /**
         * handles listbox mousedown event
         * @param {event} e event
         * @returns {void}
         */
      },
      {
        key: "_handleListboxMousedown",
        value: function _handleListboxMousedown(e) {
          if (this.disabled) return;
          /**
           * fires with listbox mousedown event
           * @event mousedown
           */

          this.dispatchEvent(
            new CustomEvent("mousedown", {
              detail: this,
            })
          );
        },
        /**
         * handles listbox keyboard events
         * @param {event} e event
         * @returns {void}
         */
      },
      {
        key: "_handleListboxKeydown",
        value: function _handleListboxKeydown(e) {
          /**
           * fires with listbox keyboard events
           * @event keydown
           */
          if (this.disabled) return;
          this.dispatchEvent(
            new CustomEvent("keydown", {
              detail: this,
            })
          );

          var coords = this.__activeDesc.split("-"),
            rownum = parseInt(coords[1]),
            colnum = parseInt(coords[2]);

          if (e.keyCode === 32) {
            //spacebar
            e.preventDefault();

            this._toggleListbox();
          } else if (this.expanded && [9, 35, 36, 38, 40].includes(e.keyCode)) {
            e.preventDefault();

            if (e.keyCode === 35) {
              //end
              var lastrow = (this.options || []).length - 1,
                lastcol = this.options[lastrow].length - 1;

              this._goToOption(lastrow, lastcol); //move to last option
            } else if (e.keyCode === 36) {
              //home
              this._goToOption(0, 0); //move to first option
            } else if (e.keyCode === 38) {
              //previous (up arrow)
              if (colnum > 0) {
                this._goToOption(rownum, colnum - 1); //move up to previous column
              } else if (rownum > 0) {
                this._goToOption(
                  rownum - 1,
                  this.options[rownum - 1].length - 1
                ); //move up to end of previous row
              }
            } else if (e.keyCode === 40) {
              //next (down arrow)
              if (colnum < this.options[rownum].length - 1) {
                //move down to next column
                this._goToOption(rownum, colnum + 1);
              } else if (rownum < (this.options || []).length - 1) {
                //move down to beginning of next row
                this._goToOption(rownum + 1, [0]);
              }
            }
          }
        },
        /**
         * handles option focus event and sets active descendant
         * @param {event} e event
         * @returns {void}
         */
      },
      {
        key: "_handleOptionFocus",
        value: function _handleOptionFocus(e) {
          this._setActiveOption(e.detail.id);
        },
        /**
         * sets  active descendant to a given option's id
         * @param {string} id option id
         * @returns {void}
         */
      },
      {
        key: "_setActiveOption",
        value: function _setActiveOption(id) {
          this.__activeDesc = id;
          /**
           * fires when active descendant changes
           * @event option-focus
           */

          this.dispatchEvent(
            new CustomEvent("option-focus", {
              detail: this,
            })
          );
        },
        /**
         * handles change in value
         *
         * @param {object} newValue new value for picker
         * @param {object} oldValue old value for picker
         * @returns {void}
         */
      },
      {
        key: "_valueChanged",
        value: function _valueChanged() {
          this._setSelectedOption();
          /**
           * fires when value changes
           * @event value-changed
           */

          this.dispatchEvent(
            new CustomEvent("value-changed", {
              detail: this,
            })
          );
        },
        /**
         * handles change in options
         * @param {object} newValue new options for picker
         * @param {object} oldValue old options for picker
         * @returns {void}
         */
      },
      {
        key: "_optionsChanged",
        value: function _optionsChanged() {
          this._setSelectedOption();
        },
        /**
         * sets selected option to a given option's id
         * @returns {void}
         */
      },
      {
        key: "_setSelectedOption",
        value: function _setSelectedOption() {
          var sel =
            !this.allowNull &&
            (this.options || []).length > 0 &&
            this.options[0].length > 0
              ? this.options[0][0].value
              : null;

          if (this.options) {
            this.__options =
              typeof this.options === "string"
                ? JSON.parse(this.options)
                : this.options.slice(); //if nulls are allowed, set active descendant to first not null option

            this.__activeDesc = this.allowNull ? "option-0-0" : null;

            for (var i = 0; i < this.__options.length; i++) {
              for (var j = 0; j < this.__options[i].length; j++) {
                //if unset, set active descendant to first not null option
                if (this.value !== null && this.__activeDesc === null)
                  this.__activeDesc = "option-".concat(i, "-").concat(j);

                if (
                  "".concat(this.__options[i][j].value) ===
                  "".concat(this.value)
                ) {
                  //set active descendant to option that matches value
                  this.__activeDesc = "option-".concat(i, "-").concat(j);
                  sel = this.__options[i][j];
                }
              }
            }
          }

          if (sel === null) this.value = null;
          this.__selectedOption = sel;
          /**
           * fires when options or value changes
           * @event change
           */

          this.dispatchEvent(
            new CustomEvent("change", {
              bubbles: true,
              detail: this,
            })
          );
        },
        /**
         * toggles listbox
         *
         * @param {boolean} open whether to open
         * @returns {void}
         */
      },
      {
        key: "_toggleListbox",
        value: function _toggleListbox() {
          var open =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : !this.expanded;
          if (this.disabled) return;
          var active = this.shadowRoot.querySelector("#" + this.__activeDesc);
          this.expanded = open;

          if (open) {
            if (active !== null) active.focus();
            /**
             * fires when listbox is expanded
             * @event expand
             */

            this.dispatchEvent(
              new CustomEvent("expand", {
                detail: this,
              })
            );
          } else {
            if (active !== null) this.value = active.getAttribute("value");
            /**
             * fires when listbox is collapsed
             * @event collapse
             */

            this.dispatchEvent(
              new CustomEvent("collapse", {
                detail: this,
              })
            );
          }
        },
        /**
         * sets options for picker
         *
         * @param {array} options nested array of options
         * @returns {void}
         */
      },
      {
        key: "setOptions",
        value: function setOptions(options) {
          this.set("options", [[]]);
          this.set("options", options);
        },
        /**
         * life cycle, element is removed from DOM
         */
      },
      {
        key: "disconnectedCallback",
        value: function disconnectedCallback() {
          this.removeEventListener("blur", function (e) {
            this.expanded = false;
          });

          _get(
            _getPrototypeOf(SimplePicker.prototype),
            "disconnectedCallback",
            this
          ).call(this);
        },
      },
      {
        key: "hideNull",
        get: function get() {
          return !this.allowNull || this.hideNullOption;
        },
      },
    ]);

    return SimplePicker;
  })(_litElement.LitElement);

exports.SimplePicker = SimplePicker;
window.customElements.define(SimplePicker.tag, SimplePicker);

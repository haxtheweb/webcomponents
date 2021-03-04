"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimplePicker = void 0;

var _litElement = require("lit-element/lit-element.js");

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

function _templateObject4() {
  var data = _taggedTemplateLiteral([
    "\n        :host {\n          display: var(--simple-picker-display, inline-flex);\n          align-items: center;\n          color: var(--simple-picker-color, currentColor);\n          font-family: var(--simple-picker-font-family, inherit);\n          font-size: var(--simple-picker-font-size, inherit);\n          --simple-picker-height: calc(\n            var(--simple-picker-option-size, 24px) +\n              var(--simple-picker-sample-padding, 2px) * 2 +\n              var(--simple-picker-border-width, 1px) * 2\n          );\n          min-height: var(--simple-picker-height);\n          max-height: var(--simple-picker-height);\n        }\n\n        :host([block-label]) {\n          display: block;\n          margin: 0 0 15px;\n          max-height: unset;\n        }\n\n        :host([disabled]) {\n          --simple-picker-color: var(--simple-picker-color-disabled, #888);\n          --simple-picker-background-color: var(\n            --simple-picker-background-color-disabled,\n            #e8e8e8\n          );\n          cursor: not-allowed;\n        }\n\n        :host([hidden]) {\n          display: none;\n        }\n\n        div {\n          margin: unset;\n          padding: unset;\n        }\n\n        label:not([hidden]) {\n          display: flex;\n          align-items: center;\n          padding-right: 5px;\n          font-family: var(--simple-picker-font-family, inherit);\n          color: var(\n            --simple-picker-label-color,\n            var(--simple-picker-color, currentColor)\n          );\n        }\n\n        :host([block-label]) label:not([hidden]) {\n          display: block;\n          padding-right: 0px;\n          color: var(\n            --simple-picker-float-label-color,\n            var(--simple-picker-color-disabled, #888)\n          );\n          transition: all 0.5s;\n          max-height: unset;\n        }\n\n        :host([block-label]:focus-within) label,\n        :host([block-label]:hover) label {\n          color: var(\n            --simple-picker-float-label-active-color,\n            var(--simple-picker-color, currentColor)\n          );\n          transition: all 0.5s;\n        }\n\n        #sample,\n        .rows {\n          margin: 0;\n          padding: 0;\n        }\n\n        #listbox {\n          cursor: pointer;\n          position: relative;\n          flex: 1 0 auto;\n          min-height: var(--simple-picker-height);\n          max-height: var(--simple-picker-height);\n        }\n\n        #sample {\n          display: flex;\n          flex: 1 0 auto;\n          justify-content: space-between;\n          align-items: center;\n          min-height: calc(\n            var(\n                --simple-picker-height - 2 *\n                  var(--simple-picker-sample-padding, 2px)\n              ) - 2 * var(--simple-picker-border-width, 1px)\n          );\n          max-height: calc(\n            var(\n                --simple-picker-height - 2 *\n                  var(--simple-picker-sample-padding, 2px)\n              ) - 2 * var(--simple-picker-border-width, 1px)\n          );\n          padding: var(--simple-picker-sample-padding, 2px);\n          border-radius: var(--simple-picker-border-radius, 2px);\n          color: var(--simple-picker-sample-color, currentColor);\n          background-color: var(--simple-picker-background-color, #f0f0f0);\n          border-width: var(--simple-picker-border-width, 1px);\n          border-style: var(--simple-picker-border-style, solid);\n          border-color: var(\n            --simple-picker-border-color,\n            var(--simple-picker-color-disabled, #888)\n          );\n        }\n\n        :host([hide-sample]) #sample {\n          width: var(--simple-picker-option-size);\n          overflow: visible;\n        }\n\n        :host(:focus-within) #sample {\n          border-width: var(\n            --simple-picker-focus-border-width,\n            var(--simple-picker-border-width, 1px)\n          );\n          border-style: var(\n            --simple-picker-focus-border-style,\n            var(--simple-picker-border-style, solid)\n          );\n          border-color: var(\n            --simple-picker-focus-border-color,\n            var(\n              --simple-picker-border-color,\n              var(--simple-picker-color-disabled, #888)\n            )\n          );\n          transition: all 0.5s;\n        }\n\n        :host(:focus-within) #listbox {\n          border-width: var(\n            --simple-picker-listbox-border-width,\n            var(--simple-picker-border-width, 1px)\n          );\n          border-style: var(\n            --simple-picker-listbox-border-width,\n            var(--simple-picker-border-style, solid)\n          );\n          border-color: var(\n            --simple-picker-listbox-border-width,\n            var(\n              --simple-picker-border-color,\n              var(--simple-picker-color-disabled, #888)\n            )\n          );\n        }\n\n        #listbox:focus-within,\n        :host(:focus-within) #listbox {\n          outline: var(--simple-picker-listbox-outline, unset);\n        }\n\n        #icon {\n          width: var(\n            --simple-picker-icon-size,\n            var(--simple-picker-option-size, 24px)\n          );\n          height: var(\n            --simple-picker-icon-size,\n            var(--simple-picker-option-size, 24px)\n          );\n          --simple-icon-width: var(\n            --simple-picker-icon-size,\n            var(--simple-picker-option-size, 24px)\n          );\n          --simple-icon-height: var(\n            --simple-picker-icon-size,\n            var(--simple-picker-option-size, 24px)\n          );\n          transform: var(--simple-picker-icon-transform, rotate(0deg));\n          transition: transform 0.25s;\n        }\n\n        :host([expanded]) #icon {\n          transform: var(--simple-picker-expanded-icon-transform, rotate(0deg));\n          transition: transform 0.25s;\n        }\n\n        #collapse {\n          display: none;\n          width: 100%;\n          position: absolute;\n          z-index: 2;\n        }\n\n        :host([expanded]:not([disabled])) #collapse {\n          display: block;\n          position: unset;\n          background-color: var(--simple-picker-options-background-color, #fff);\n        }\n\n        .rows {\n          display: block;\n          position: absolute;\n          z-index: 1000;\n          top: calc(\n            var(--simple-picker-option-size, 24px) + 2 *\n              var(--simple-picker-options-border-width)\n          );\n          border-width: var(\n            --simple-picker-options-border-width,\n            var(--simple-picker-border-width, 1px)\n          );\n          border-style: var(\n            --simple-picker-options-border-style,\n            var(--simple-picker-border-style, solid)\n          );\n          border-color: var(\n            --simple-picker-options-border-color,\n            var(\n              --simple-picker-border-color,\n              var(--simple-picker-color-disabled, #888)\n            )\n          );\n          background-color: var(--simple-picker-options-background-color, #fff);\n          max-height: var(--simple-picker-options-max-height, 250px);\n          overflow-y: auto;\n        }\n\n        :host([align-right]) #collapse .rows {\n          left: unset;\n          right: calc(\n            var(\n                --simple-picker-options-border-width,\n                var(--simple-picker-border-width, 1px)\n              ) * 2\n          );\n        }\n\n        .row {\n          display: flex;\n          align-items: stretch;\n          justify-content: space-between;\n        }\n\n        simple-picker-option {\n          z-index: 1;\n          flex: 1 1 auto;\n          justify-content: flex-start;\n          max-height: unset;\n          min-height: var(--simple-picker-option-size, 24px);\n          min-width: var(--simple-picker-option-size, 24px);\n          line-height: var(--simple-picker-option-size, 24px);\n          color: var(--simple-picker-color, currentColor);\n          background-color: var(--simple-picker-options-background-color, #fff);\n          transition: max-height 2s;\n        }\n\n        simple-picker-option[selected] {\n          z-index: 50;\n          color: var(--simple-picker-color, currentColor);\n          background-color: var(\n            --simple-picker-option-selected-background-color,\n            var(--simple-picker-options-background-color, #fff)\n          );\n        }\n\n        simple-picker-option[active] {\n          z-index: 100;\n          cursor: pointer;\n          color: var(--simple-picker-color, currentColor);\n          background-color: var(\n            --simple-picker-option-active-background-color,\n            #aaddff\n          );\n        }\n\n        #sample simple-picker-option {\n          color: var(--simple-picker-color, currentColor);\n          background-color: var(\n            --simple-picker-sample-background-color,\n            transparent\n          );\n          --simple-picker-option-padding: var(\n              --simple-picker-sample-padding,\n              2px\n            )\n            0;\n          border: none;\n        }\n\n        :host([hide-sample]) #sample simple-picker-option {\n          position: absolute;\n          left: -9999px;\n          overflow: hidden;\n          width: 0;\n          height: 0;\n        }\n\n        :host(:focus-within) #sample simple-picker-option,\n        :host(:hover) #sample simple-picker-option {\n          --simple-picker-color: var(\n            --simple-picker-color-active,\n            var(--simple-picker-color, currentColor)\n          );\n        }\n\n        :host(:not([expanded])) #collapse simple-picker-option {\n          max-height: 0;\n          transition: max-height 1.5s;\n        }\n\n        @media screen and (max-width: 600px) {\n          :host {\n            position: static;\n          }\n\n          #collapse {\n            top: 0;\n            margin-top: 0;\n            position: relative;\n          }\n\n          .rows {\n            position: absolute;\n          }\n        }\n      ",
  ]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    '\n                              <simple-picker-option\n                                @option-focus="',
    '"\n                                @set-selected-option="',
    '"\n                                ?active="',
    '"\n                                ?hide-option-labels="',
    '"\n                                ?hidden="',
    '"\n                                ?selected="',
    '"\n                                ?title-as-html="',
    '"\n                                .data="',
    '"\n                                .icon="',
    '"\n                                .id="option-',
    "-",
    '"\n                                .label="',
    '"\n                                .style=',
    '\n                                aria-selected="',
    '"\n                                role="option"\n                                tabindex="-1"\n                                value="',
    '"\n                              >\n                              </simple-picker-option>\n                            ',
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n                    <div class="row">\n                      ',
    "\n                    </div>\n                  ",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    ' <label\n        id="listLabel"\n        for="listbox"\n        .hidden="',
    '"\n      >\n        ',
    '\n      </label>\n      <div\n        id="listbox"\n        .aria-activedescendant="',
    '"\n        .aria-labelledby="',
    '"\n        .disabled="',
    '"\n        role="listbox"\n        tabindex="0"\n        @click="',
    '"\n        @mousedown="',
    '"\n        @keydown="',
    '"\n      >\n        <div id="sample">\n          <simple-picker-option\n            ?hide-option-labels="',
    '"\n            ?title-as-html="',
    '"\n            .icon="',
    '"\n            .label="',
    '"\n            .style=',
    '\n            aria-hidden="true"\n          >\n          </simple-picker-option>\n          <span id="icon"\n            ><simple-icon-lite\n              aria-hidden="true"\n              icon="arrow-drop-down"\n            ></simple-icon-lite\n          ></span>\n        </div>\n        <div id="collapse">\n          <div class="rows">\n            ',
    "\n          </div>\n        </div>\n      </div>",
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

    _createClass(
      SimplePicker,
      [
        {
          key: "render",
          // render function
          value: function render() {
            var _this2 = this;

            return (0, _litElement.html)(
              _templateObject(),
              !this.label || this.label.trim() === "",
              this.label && this.label.trim() !== "" ? this.label.trim() : "",
              this.__activeDesc,
              this.ariaLabelledby,
              this.disabled,
              this._handleListboxClick,
              this._handleListboxMousedown,
              this._handleListboxKeydown,
              this.hideOptionLabels,
              this.titleAsHtml,
              this.__selectedOption ? this.__selectedOption.icon : false,
              this.__selectedOption ? this.__selectedOption.alt : false,
              this.__selectedOption ? this.__selectedOption.style : false,
              this.__options
                ? this.__options.map(function (row, rownum) {
                    return (0, _litElement.html)(
                      _templateObject2(),
                      Array.isArray(row)
                        ? row.map(function (option, colnum) {
                            return (0,
                            _litElement.html)(_templateObject3(), _this2._handleOptionFocus, _this2._handleSetSelectedOption, "".concat(_this2.__activeDesc) === "option-".concat(rownum, "-").concat(colnum), _this2.hideOptionLabels, !_this2.allowNull && !option.value, _this2.value === option.value, _this2.titleAsHtml, _this2.data, option.icon, rownum, colnum, option.alt, option.style, _this2.value === option.value ? "true" : "false", option.value);
                          })
                        : ""
                    );
                  })
                : ""
            );
          }, // properties available to the custom element for data binding
        },
      ],
      [
        {
          key: "styles",
          //styles function
          get: function get() {
            return [(0, _litElement.css)(_templateObject4())];
          },
        },
        {
          key: "properties",
          get: function get() {
            return _objectSpread(
              {},
              _get(_getPrototypeOf(SimplePicker), "properties", this),
              {
                /**
                 * llow a null value?
                 * Default behavior/false will select first option and set value accordingly.
                 */
                allowNull: {
                  type: Boolean,
                  reflect: true,
                  attribute: "allow-null",
                },

                /**
                 * Align right edges of listbox and button?
                 * Default behavior/false aligns to left edges.
                 */
                alignRight: {
                  type: Boolean,
                  reflect: true,
                  attribute: "align-right",
                },

                /**
                 * Optional. Sets aria-labelledby attribute
                 */
                ariaLabelledby: {
                  type: String,
                  attribute: "aria-labelledby",
                },

                /**
                 * Position label above select dropdown?
                 */
                blockLabel: {
                  type: Boolean,
                  reflect: true,
                  attribute: "block-label",
                },

                /**
                 * Is picker disabled?
                 */
                disabled: {
                  type: Boolean,
                  reflect: true,
                },

                /**
                 * Is it expanded?
                 */
                expanded: {
                  type: Boolean,
                  reflect: true,
                  attribute: "expanded",
                },

                /**
                 * Hide option labels? As color-picker or icon-picker, labels may be redundant.
                 * This option would move labels off-screen so that only screen-readers will have them.
                 */
                hideOptionLabels: {
                  type: Boolean,
                  reflect: true,
                  attribute: "hide-option-labels",
                },

                /**
                 * Hide selected item sample?
                 * Default behavior/false shows a sample without expanding menu.
                 */
                hideSample: {
                  type: Boolean,
                  reflect: true,
                  attribute: "hide-sample",
                },

                /**
                 * Optional. Label for picker input
                 */
                label: {
                  type: String,
                },

                /**
        * An array of options for picker, eg.: 
        [
        [
        {
        "icon": "editor:format-paint",      //Optional. Used if picker is used as an icon picker.
        "alt": "Blue",                      //Required for accessibility. Alt text description of choice.
        "style": "background-color: blue;", //Optional. Used to set an option's style.
        ...                                 //Optional. Any other properties that should be captured as part of selected option's value
        },...
        ]
        ]
        */
                options: {
                  type: Array,
                },

                /**
                 * Renders html as title. (Good for titles with HTML in them.)
                 */
                titleAsHtml: {
                  type: Boolean,
                  attribute: "title-as-html",
                },

                /**
                 * An string that stores current value for picker
                 */
                value: {
                  type: String,
                  reflect: true,
                },

                /**
                 * Aria-activedescendant attribute (active option's ID)
                 */
                __activeDesc: {
                  type: String,
                },

                /**
        * An array of options for picker, eg.: `
        [
        [
        {
        "icon": "editor:format-paint",      //Optional. Used if picker is used as an icon picker.
        "alt": "Blue",                      //Required for accessibility. Alt text description of choice.
        "style": "background-color: blue;", //Optional. Used to set an option's style.
        ...                                 //Optional. Any other properties that should be captured as part of selected option's value
        },...
        ]
        ]`
        */
                __options: {
                  type: Array,
                },

                /**
                 * Selected option based on value of picker
                 */
                __selectedOption: {
                  type: Object,
                },
              }
            );
          },
          /**
           * Store the tag name to make it easier to obtain directly.
           * @notice function name must be here for tooling to operate correctly
           */
        },
        {
          key: "tag",
          get: function get() {
            return "simple-picker";
          }, // life cycle
        },
      ]
    );

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
        key: "updated",
        value: function updated(changedProperties) {
          var _this3 = this;

          changedProperties.forEach(function (oldValue, propName) {
            if (propName === "value") _this3._valueChanged();
            if (propName === "options") _this3._optionsChanged();
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
    ]);

    return SimplePicker;
  })(_litElement.LitElement);

exports.SimplePicker = SimplePicker;
window.customElements.define(SimplePicker.tag, SimplePicker);

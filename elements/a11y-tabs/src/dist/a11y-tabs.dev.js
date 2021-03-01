"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.A11yTabs = void 0;

var _litElement = require("lit-element/lit-element.js");

var _responsiveUtilityBehaviors = require("@lrnwebcomponents/responsive-utility/lib/responsive-utility-behaviors.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icons.js");

require("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");

require("./lib/a11y-tab.js");

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

function _templateObject10() {
  var data = _taggedTemplateLiteral([
    '\n      <simple-tooltip for="',
    '-button" part="tooltip">\n        ',
    "\n      </simple-tooltip>\n    ",
  ]);

  _templateObject10 = function _templateObject10() {
    return data;
  };

  return data;
}

function _templateObject9() {
  var data = _taggedTemplateLiteral([
    ' <span class="label" part="label">',
    "</span> ",
  ]);

  _templateObject9 = function _templateObject9() {
    return data;
  };

  return data;
}

function _templateObject8() {
  var data = _taggedTemplateLiteral([
    '\n          <simple-icon-lite\n            class="icon"\n            ?hidden="',
    '"\n            .icon="',
    '"\n            part="icon"\n          >\n          </simple-icon-lite>\n        ',
  ]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  var data = _taggedTemplateLiteral([
    '\n          <simple-icon-lite\n            class="icon"\n            ?hidden="',
    '"\n            .icon="',
    '"\n            .title="',
    '"\n            part="icon"\n          >\n          </simple-icon-lite>\n        ',
  ]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral([
    '\n      <span class="flag-type" ?hidden="',
    '" part="flag">\n        ',
    "\n      </span>\n    ",
  ]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral([
    '\n      <button\n        id="',
    '-button"\n        aria-selected="',
    '"\n        aria-controls="',
    '"\n        class="',
    '"\n        .flag="',
    '"\n        @click="',
    '"\n        @keydown="',
    '"\n        ?disabled="',
    '"\n        tabindex="',
    '"\n        role="tab"\n        part="',
    '"\n      >\n        ',
    " ",
    "\n        ",
    " ",
    "\n      </button>\n      ",
    "\n    ",
  ]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
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
    '\n        :host {\n          font-size: var(--a11y-tabs-font-size, unset);\n          font-family: var(--a11y-tabs-font-family, unset);\n          --a11y-tabs-focus-color: var(--a11y-tabs-color);\n          --a11y-tabs-horizontal-border-radius: var(--a11y-tabs-border-radius, 2px);\n          --a11y-tabs-vertical-border-radius: var(--a11y-tabs-border-radius, 2px);\n          --a11y-tabs-vertical-button-padding: var(--a11y-tabs-button-padding, 4px);\n          --a11y-tabs-horizontal-button-padding: var(--a11y-tabs-button-padding, 4px);\n        }\n        @media screen {\n          :host([vertical]) {\n            border-radius: var(--a11y-tabs-vertical-border-radius,2px);\n            border: 1px solid var(--a11y-tabs-border-color,#ddd);\n          }\n        \n          #content {\n            border: 1px solid var(--a11y-tabs-border-color,#ddd);\n            padding: var(--a11y-tabs-content-padding, 16px);\n            background-color: var(--a11y-tabs-content-background);\n          }\n        \n          #tabs {\n            background-color: var(--a11y-tabs-horizontal-background);\n            font-family: var(--a11y-tabs-tab-font-family, var(--a11y-tabs-font-family, unset));\n            font-size: var(--a11y-tabs-tab-font-size, var(--a11y-tabs-font-size, unset));\n          }\n          \n          :host([vertical]) #tabs {\n            border-left: none;\n            background-color: var(--a11y-tabs-vertical-background);\n            justify-content: var(--a11y-tabs-vertical-justify-tabs);\n          }\n        \n          :host([vertical]) #tabs button {\n            padding: var(--a11y-tabs-vertical-button-padding);\n            border-radius: 0; \n          }\n        \n          :host([vertical]) #content {\n            border: none;\n          }\n          :host(:not([vertical])) #content {\n            border-radius: var(--a11y-tabs-horizontal-border-radius,2px);\n          }\n          \n          #tabs button {\n            text-transform: unset;\n            color: var(--a11y-tabs-faded-color, #333);\n            border: 1px solid var(--a11y-tabs-border-color);\n            background-color: var(--a11y-tabs-faded-background, #f8f8f8);\n            padding: var(--a11y-tabs-horizontal-button-padding);\n            font-weight: var(--a11y-tabs-font-weight, normal);\n            border-radius: var(--a11y-tabs-horizontal-border-radius,2px) var(--a11y-tabs-horizontal-border-radius,2px) 0 0; \n          }\n          \n          button .label {\n            text-decoration: var(--a11y-tabs-text-decoration, none);\n          }\n          \n          :host(:not([vertical])) #tabs button {\n            border-top-color: var(--a11y-tabs-border-accent);\n          }\n          \n          :host(:not([vertical])) #tabs li:not(:first-of-type) button {\n            border-left: none;\n          }\n          \n          :host([vertical]) #tabs button {\n            border-top: none;\n            border-left-color: var(--a11y-tabs-border-accent);\n          }\n          \n          #tabs button:focus,\n          #tabs button:hover {\n            color: var(--a11y-tabs-focus-color);\n            font-weight: var(--a11y-tabs-focus-font-weight, normal);\n          }\n          \n          button:focus .label,\n          button:hover .label {\n            text-decoration: var(--a11y-tabs-focus-text-decoration, underline);\n          }\n          \n          :host(:not([vertical])) #tabs button:focus,\n          :host(:not([vertical])) #tabs button:hover {\n            border-top-color: var(--a11y-tabs-focus-border-accent);\n          }\n          \n          :host([vertical]) #tabs button:focus,\n          :host([vertical]) #tabs button:hover {\n            border-left-color: var(--a11y-tabs-focus-border-accent);\n          }\n          \n          #tabs button[aria-selected="true"] {\n            font-weight: var(--a11y-tabs-selected-font-weight, normal);\n            color: var(--a11y-tabs-selected-color, var(--a11y-tabs-focus-color));\n            background-color: var(--a11y-tabs-background);\n          }\n          \n          button[aria-selected="true"] .label {\n            text-decoration: var(--a11y-tabs-selected-text-decoration, none);\n          }\n          \n          :host(:not([vertical])) #tabs button[aria-selected="true"] {\n            border-bottom-color: var(--a11y-tabs-background);\n            border-top-color: var(--a11y-tabs-selected-border-accent);\n          }\n          \n          :host([vertical]) #tabs button[aria-selected="true"] {\n            border-right-color: var(--a11y-tabs-background);\n            border-left-color: var(--a11y-tabs-selected-border-accent);\n          }\n          \n          #tabs button[disabled] {\n            color: var(--a11y-tabs-disabled-color, #999);\n            background-color: var(--a11y-tabs-disabled-background, #eee);\n          }\n        \n          #tabs button[disabled]:focus,\n          #tabs button[disabled]:hover {\n            color: unset;\n            font-weight: unset;\n          }\n          \n          button[disabled]:focus .label,\n          button[disabled]:hover .label {\n            text-decoration: none;\n          }\n          \n          :host(:not([vertical])) #tabs button[disabled] {\n            border-left-color: var(--a11y-tabs-disabled-border-accent,unset);\n          }\n          \n          :host([vertical]) #tabs button[disabled] {\n            border-top-color: var(--a11y-tabs-disabled-border-accent,unset);\n          }\n        }\n      ',
  ]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    "\n        :host {\n          display: block;\n          height: var(--a11y-tabs-height);\n          overflow: var(--a11y-tabs-overflow); \n        }\n\n        :host([hidden]) {\n          display: none;\n        }\n\n        #tabs {\n          display: none;\n        }\n        @media screen {\n          :host([vertical]) {\n            border-radius: var(--a11y-tabs-vertical-border-radius,2px);\n            display: flex;\n            justify-content: space-between;\n            align-items: stretch;\n          }\n          #content {\n            flex: 1 1 calc(100% - 2 * var(--a11y-tabs-content-padding, 16px));\n            overflow: auto;\n          }\n          #tabs {\n            align-items: stretch;\n            flex-wrap: var(--a11y-tabs-wrap, unset);\n            margin: 0;\n            display: flex;\n            list-style: none;\n            padding: 0;\n            overflow: auto;\n            max-width: 100%;\n            overflow-x: auto;\n            z-index: 1;\n            justify-content: var(--a11y-tabs-horizontal-justify-tabs);\n          }\n          :host([vertical]) #tabs {\n            flex: 0 0 auto;\n            flex-direction: column;\n            overflow-y: auto;\n            max-width: unset;\n            overflow-x: unset;\n            z-index: unset;\n            flex-wrap: var(--a11y-tabs-vertical-wrap);\n          }\n          :host([sticky]) #tabs {\n            position: sticky;\n            top: 0;\n          }   \n          #tabs li {\n            display: flex;\n            align-items: stretch;\n          }\n          :host([full-width]) #tabs li {\n            width: 100%;\n          }\n          :host([vertical]) #tabs li {\n            flex-direction: column;\n          }\n          #tabs .flag-type {\n            position: absolute;\n            left: -99999px;\n            height: 0; \n            overflow: hidden;\n          }\n          :host(:not([vertical])) #content {\n            margin-top: -1px;\n          }\n          #tabs button {\n            width: 100%;\n            min-width: unset;\n            margin: 0;\n          }\n\n          :host([vertical]) #tabs button {\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n          }\n  \n          #tabs button[disabled] {\n            pointer-events: none;\n          }\n    \n          #tabs span.label,\n          #tabs .flag-icon {\n            margin-right: 8px;\n          }\n          \n          :host([icons-only]) #tabs button {\n            justify-content: center;\n          }\n          \n          :host([icons-only]) #tabs span.label {\n            display: none;\n          }\n          \n          :host(:not([icons-only])) #tabs #tabs simple-tooltip {\n            display: none;\n          }\n          simple-icon-lite:not([hidden]) {\n            display: inline-block;\n          }\n          \n          simple-icon-lite[hidden] {\n            display: none;\n          }\n        }\n      ",
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n    <li part="tablist-item">',
    "</li>\n  ",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '\n\n<ul id="tabs" role="tablist" part="tablist">\n  ',
    '\n</ul>\n<div id="content" part="content">\n  <slot></slot>\n</div>',
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
 * `a11y-tabs`
 * an accessible and responsive tabbed interface
 * 
### Styling

`<a11y-tabs>` provides the following custom properties
for styling:

#### General
Custom property | Description | Default
----------------|-------------|----------
`--a11y-tabs-font-family` | font-family | unset
`--a11y-tabs-font-size` | font-size | unset
`--a11y-tabs-border-color` | border | #ddd
`--a11y-tabs-color` | text color | #222
`--a11y-tabs-focus-color` | text color when focused | #000
`--a11y-tabs-margin` |  | 16px 0
`--a11y-tabs-width` | total width | 100%
`--a11y-tabs-height` | total height | unset
`--a11y-tabs-overflow` | default overflow | auto
`--a11y-tabs-overflow-x` | overflow of x-axis | `--a11y-tabs-overflow`
`--a11y-tabs-overflow-y` | overflow of y-axis | `--a11y-tabs-overflow`
`--a11y-tabs-border-radius` | default border radius | 2px
`--a11y-tabs-horizontal-border-radius` | border-radius when horizontal | `--a11y-tabs-border-radius`
`--a11y-tabs-vertical-border-radius` | border-radius when veritcal | `--a11y-tabs-border-radius`
`--a11y-tabs-text-decoration` | default text decoration for tab button | none
`--a11y-tabs-focus-text-decoration` | default text on focus or hover | underline

#### Tab Panel
Custom property | Description | Default
----------------|-------------|----------
`--a11y-tabs-tab-font-family` | font-family | `--a11y-tabs-font-family`
`--a11y-tabs-tab-font-size` | font-size | `--a11y-tabs-font-size`
`--a11y-tabs-font-weight` | default font weight | normal
`--a11y-tabs-selected-font-weight` | font weight of selected tabs | normal
`--a11y-tabs-focus-font-weight` | font weight of focused/hovered tabs | normal
`--a11y-tabs-text-decoration` | default text-decoration | none
`--a11y-tabs-focus-text-decoration` | text-decoration when focused/hovered | underline
`--a11y-tabs-selected-text-decoration` | text-decoration when selected | none
`--a11y-tabs-color` | default text color | #000
`--a11y-tabs-focus-color` | text color of focused/hovered tab | --a11y-tabs-color`
`--a11y-tabs-faded-color` | text color of disabled items |  #333;
`--a11y-tabs-selected-color` | text color of selected tab | `--a11y-tabs-focus-color`
`--a11y-tabs-background` | background for active tab and tab content | white
`--a11y-tabs-faded-background` | background inactive tabs | #eee
`--a11y-tabs-horizontal-background` | background for tabs container when horizontal | unset
`--a11y-tabs-vertical-background` | background for tabs container when vertical | `--a11y-tabs-border-color`
`--a11y-tabs-horizontal-sticky-background` | background for tabs container when sticky and horizontal | `--a11y-tabs-background`
`--a11y-tabs-justify-tabs` | tab justification | flex-start
`--a11y-tabs-vertical-justify-tabs` | tab justification when vertical | `--a11y-tabs-justify-tabs`
`--a11y-tabs-horizontal-justify-tabs` | tab justification when horizontal | `--a11y-tabs-justify-tabs`
`--a11y-tabs-wrap` | tab wrapping | unset
`--a11y-tabs-tab-height` | tab height | `--a11y-tabs-height`
`--a11y-tabs-button-padding` | padding for tabs | 8px
`--a11y-tabs-vertical-button-padding` | padding for tabs when vertical | `--a11y-tabs-button-padding`
`--a11y-tabs-horizontal-button-padding` | padding for tabs when horizontal | `--a11y-tabs-button-padding`
`--a11y-tabs-border-accent` | optional thicker border for top of horizontal tabs or left of vertical tabs (ex. 4px solid blue) | unset
`--a11y-tabs-selected-border-accent` | optional thicker border for top of selected horizontal tab or left of vertical tab | unset
`--a11y-tabs-selected-focus-accent` | optional thicker border for top of focused/hovered horizontal tab or left of vertical tab | unset
`--a11y-tabs-selected-disabled-accent` | optional thicker border for top of disabled horizontal tabs or left of vertical tabs | unset

#### Content Section
Custom property | Description | Default
----------------|-------------|----------
`--a11y-tabs-content-padding` | padding for content of tab | 16px
`--a11y-tabs-content-background` | background color for content of tab | `--a11y-tabs-background`
 *
 * @customElement
 * @extends LitElement
 * @extends ResponsiveUtilityBehaviors
 * @demo ./demo/index.html
 * @demo ./demo/vertical.html Always Vertical
 * @demo ./demo/breakpoints.html Breakpoints
 * @demo ./demo/sticky.html Sticky Tabs
 */
var A11yTabs =
  /*#__PURE__*/
  (function (_ResponsiveUtilityBeh) {
    _inherits(A11yTabs, _ResponsiveUtilityBeh);

    _createClass(
      A11yTabs,
      [
        {
          key: "render",
          // render function
          value: function render() {
            var _this2 = this;

            return (0, _litElement.html)(
              _templateObject(),
              this.tabs.map(function (tab, i) {
                return (0,
                _litElement.html)(_templateObject2(), _this2._tabButton(tab, i));
              })
            );
          }, // haxProperty definition
        },
      ],
      [
        {
          key: "A11yTabsCoreStyles",
          get: function get() {
            return [(0, _litElement.css)(_templateObject3())];
          },
        },
        {
          key: "A11yTabsThemeStyles",
          get: function get() {
            return [(0, _litElement.css)(_templateObject4())];
          }, //styles function
        },
        {
          key: "styles",
          get: function get() {
            return [].concat(
              _toConsumableArray(this.A11yTabsCoreStyles),
              _toConsumableArray(this.A11yTabsThemeStyles)
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
                title: "Tabs",
                description: "A set of tabs.",
                icon: "view-day",
                color: "grey",
                groups: ["Content", "Presentation", "Tabs"],
              },
              settings: {
                configure: [
                  {
                    property: "ariaLabel",
                    title: "Label (for accesibility)",
                    inputMethod: "textfield",
                  },
                  {
                    property: "disabled",
                    title: "Disabled",
                    inputMethod: "boolean",
                  },
                  {
                    property: "hidden",
                    title: "Hidden",
                    inputMethod: "boolean",
                  },
                  {
                    property: "sticky",
                    title: "Sticky.",
                    desc:
                      "Horizontal tabs stick to the top of the window when scrolling.",
                    inputMethod: "boolean",
                  },
                  {
                    property: "layoutBreakpoint",
                    title: "Layout Breakpoint",
                    inputMethod: "Number",
                    descripton:
                      "Optional minimum breakpoint for horizontal layout of tabs. Default is unset (always horizontal). Setting `-1` forces vertical-only mode.",
                  },
                  {
                    property: "iconBreakpoint",
                    title: "Icon Breakpoint",
                    inputMethod: "Number",
                    descripton:
                      "Optional minimum breakpoint for showing tab text with icons. Default is always text with icons (0). Setting to -1 forces icon-only mode.",
                  },
                  {
                    slot: "",
                    title: "Tabs",
                    description: "A series of <a11y-tab/> elements.",
                    inputMethod: "code-editor",
                  },
                ],
                advanced: [
                  {
                    property: "id",
                    title: "Unique ID",
                    inputMethod: "textfield",
                  },
                ],
              },
            };
          }, // properties available to the custom element for data binding
        },
        {
          key: "properties",
          get: function get() {
            return _objectSpread(
              {},
              _get(_getPrototypeOf(A11yTabs), "properties", this),
              {
                ariaLabel: {
                  type: String,
                  reflect: true,
                  attribute: "aria-label",
                },

                /**
                 * id of active tab
                 */
                activeTab: {
                  type: String,
                  reflect: true,
                  attribute: "active-tab",
                },

                /**
                 * if tabs should be full width or not
                 */
                fullWidth: {
                  type: Boolean,
                  reflect: true,
                  attribute: "full-width",
                },

                /**
                 * whether tabbed interface is disabled
                 */
                disabled: {
                  type: Boolean,
                  reflect: true,
                  attribute: "disabled",
                },

                /**
                 * whether tabbed interface is hidden
                 */
                hidden: {
                  type: Boolean,
                  reflect: true,
                  attribute: "hidden",
                },

                /**
                 * Optional minimum breakpoint for showing tab text with icons, or
                 * Default is always text with icons.
                 * `-1` forces icon-only mode.
                 */
                iconBreakpoint: {
                  type: Number,
                  attribute: "icon-breakpoint",
                },

                /**
                 * unique identifier/anchor for tabbed interface
                 */
                id: {
                  type: String,
                  reflect: true,
                },

                /**
                 * Optional minimum breakpoint for horizontal layout of tabs.
                 * Default is unset (always horizontal).
                 * `-1` forces vertical-only mode.
                 */
                layoutBreakpoint: {
                  type: Number,
                  attribute: "layout-breakpoint",
                },

                /**
                 * size of tabs,
                 * where `xs` is smaller breakpoint
                 * and `xs` is larger breakpoint
                 */
                responsiveSize: {
                  type: String,
                  reflect: true,
                  attribute: "responsive-size",
                },

                /**
                 * whether tabs are sticky
                 */
                sticky: {
                  type: Boolean,
                  reflect: true,
                  attribute: "sticky",
                },

                /**
                 * an array of tab data based on slotted `a11y-tab` elements
                 */
                __tabs: {
                  type: Array,
                },

                /**
                 * an array of tab buttons
                 */
                __tabButtons: {
                  type: Array,
                },

                /**
                 * which tab button has ketboard focus
                 */
                __tabFocus: {
                  type: Number,
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
            return "a11y-tabs";
          },
        },
      ]
    );

    function A11yTabs() {
      var _this;

      _classCallCheck(this, A11yTabs);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(A11yTabs).call(this)
      );
      _this.fullWidth = false;
      _this.disableResponsive = false;
      _this.disabled = false;
      _this.hidden = false;
      _this.__tabs = [];
      _this.__tabFocus = 0;

      _this.addEventListener("a11y-tab-changed", function (e) {
        return _this.updateTabs();
      });

      return _this;
    }

    _createClass(A11yTabs, [
      {
        key: "connectedCallback",

        /**
         * life cycle, element is afixed to the DOM
         */
        value: function connectedCallback() {
          _get(
            _getPrototypeOf(A11yTabs.prototype),
            "connectedCallback",
            this
          ).call(this);

          this.updateTabs();
          this.observer.observe(this, {
            attributes: false,
            childList: true,
            subtree: false,
          });
        },
        /**
         * life cycle, element is removed from the DOM
         */
      },
      {
        key: "disconnectedCallback",
        value: function disconnectedCallback() {
          if (this.observer && this.observer.disconnect)
            this.observer.disconnect();

          _get(
            _getPrototypeOf(A11yTabs.prototype),
            "disconnectedCallback",
            this
          ).call(this);
        },
        /**
         * handle updates
         */
      },
      {
        key: "updated",
        value: function updated(changedProperties) {
          var _this3 = this;

          changedProperties.forEach(function (oldValue, propName) {
            if (propName === "id") _this3._idChanged(_this3.id, oldValue);
            if (propName === "activeTab" && _this3.activeTab !== oldValue)
              _this3._activeTabChanged(_this3.activeTab, oldValue);

            if (propName === "responsiveWidth") {
              if (_this3.vertical) {
                _this3.setAttribute("vertical", true);
              } else {
                _this3.removeAttribute("vertical");
              }
            }

            if (
              ["iconsBreakpoint", "responsiveWidth", "__tabs"].includes(
                propName
              )
            ) {
              if (_this3.iconsOnly) {
                _this3.setAttribute("icons-only", true);
              } else {
                _this3.removeAttribute("icons-only");
              }
            }
          });
        },
        /**
         * selects a tab
         * @param {string} id the active tab's id
         */
      },
      {
        key: "selectTab",
        value: function selectTab(id) {
          var tabs = this.querySelectorAll(this.tabQuery);

          if (tabs && tabs.length > 0) {
            var enabled = Object.keys(tabs || [])
                .filter(function (key) {
                  return !tabs[key].disabled;
                })
                .map(function (key) {
                  return tabs[key].id;
                }),
              filtered = enabled.filter(function (tabid) {
                return tabid === id;
              }),
              selected = filtered[0] || enabled[0];
            tabs.forEach(function (tab) {
              tab.inactive = tab.id !== selected;
            });
            this.activeTab = selected;
          }
        },
        /**
         * updates the list of items based on slotted a11y-tab elements
         */
      },
      {
        key: "updateTabs",
        value: function updateTabs(e) {
          this.__tabs = this.querySelectorAll(this.tabQuery);
          this.__tabButtons = this.shadowRoot.querySelectorAll("[role=tab]");
          this.selectTab(this.activeTab);
        },
        /**
         * Observer activeTab for changes
         * @param {string} newValue the new active tab's id
         */
      },
      {
        key: "_activeTabChanged",
        value: function _activeTabChanged(newValue, oldValue) {
          if (newValue !== oldValue) this.selectTab(newValue);
          window.dispatchEvent(
            new CustomEvent("active-tab-changed", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: this,
            })
          );
        },
        /**
         * generates a unique id
         * @returns {string } unique id
         */
      },
      {
        key: "_generateUUID",
        value: function _generateUUID() {
          return "ss-s-s-s-sss".replace(
            /s/g,
            Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1)
          );
        },
        /**
         * handles a tab being tapped and sets the new active tab
         * @param {event} e the tab tap event
         */
      },
      {
        key: "_handleTab",
        value: function _handleTab(tab) {
          if (!tab.disabled) this.activeTab = tab.id;
        },
      },
      {
        key: "_handleKey",
        value: function _handleKey(i, e) {
          var _this4 = this;

          this.__tabFocus = i;

          var focus = function focus() {
            var dir =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : 1;
            _this4.__tabFocus = _this4.__tabFocus + dir; // If we're at the end, go to the start

            if (_this4.__tabFocus >= _this4.buttons.length) {
              _this4.__tabFocus = 0; // If we're at the start, move to the end
            } else if (_this4.__tabFocus < 0) {
              _this4.__tabFocus = _this4.buttons.length - 1;
            }

            if (
              _this4.buttons[_this4.__tabFocus].disabled &&
              _this4.__tabFocus !== i
            )
              focus(dir);
          }; // Move right

          if (e.keyCode === 39 || e.keyCode === 37) {
            this.buttons[i].setAttribute("tabindex", -1);
            focus(e.keyCode === 39 ? 1 : -1);

            if (!this.buttons[this.__tabFocus].disabled) {
              this.buttons[this.__tabFocus].setAttribute("tabindex", 0);

              this.buttons[this.__tabFocus].focus();
            }
          }
        },
        /**
         * ensures that there is always an id for this tabbed interface so that we can link back to the top of it
         * @param {string} newValue the new id
         * @param {string} oldValue the old id
         */
      },
      {
        key: "_idChanged",
        value: function _idChanged(newValue, oldValue) {
          if (!newValue) this.id = "a11y-tabs" + this._generateUUID();
        },
        /**
         * makes tab button
         *
         * @param {object} tab a11y-tab
         * @returns object
         * @memberof A11yTabs
         */
      },
      {
        key: "_tabButton",
        value: function _tabButton(tab, i) {
          var _this5 = this;

          return (0, _litElement.html)(
            _templateObject5(),
            tab.id,
            tab.id === this.activeTab ? "true" : "false",
            tab.id,
            tab.id === this.activeTab && !this.disabled ? "active" : "",
            tab.flag,
            function (e) {
              return _this5._handleTab(tab);
            },
            function (e) {
              return _this5._handleKey(i, e);
            },
            tab.disabled || this.disabled,
            tab.id === this.activeTab ? 0 : -1,
            tab.id === this.activeTab && !this.disabled
              ? "tab-active"
              : this.disabled || tab.disabled
              ? "tab-disabled"
              : "tab",
            this._tabIcon(tab, "flagIcon"),
            this._tabLabel(tab),
            this._tabFlag(tab),
            this._tabIcon(tab, "icon"),
            this._tabTooltip(tab)
          );
        },
        /**
         * makes tab flag
         *
         * @param {string} flag tab's flag
         * @returns object
         * @memberof A11yTabs
         */
      },
      {
        key: "_tabFlag",
        value: function _tabFlag(tab) {
          return (0, _litElement.html)(_templateObject6(), !tab.flag, tab.flag);
        },
        /**
         * makes tab icon
         *
         * @param {string} icon tab's icon
         * @returns object
         * @memberof A11yTabs
         */
      },
      {
        key: "_tabIcon",
        value: function _tabIcon(tab, icon) {
          return tab.flag
            ? (0, _litElement.html)(
                _templateObject7(),
                !tab[icon],
                tab[icon],
                tab.flag
              )
            : (0, _litElement.html)(_templateObject8(), !tab[icon], tab[icon]);
        },
        /**
         * makes tab label
         *
         * @param {string} flag tab's flag
         * @returns object
         * @memberof A11yTabs
         */
      },
      {
        key: "_tabLabel",
        value: function _tabLabel(tab) {
          return (0, _litElement.html)(_templateObject9(), tab.label);
        },
        /**
         * makes tab tooltip
         *
         * @param {string} id tab's unique id
         * @param {label} label tab's label
         * @returns object
         * @memberof A11yTabs
         */
      },
      {
        key: "_tabTooltip",
        value: function _tabTooltip(tab) {
          return (0, _litElement.html)(_templateObject10(), tab.id, tab.label);
        },
      },
      {
        key: "buttons",
        get: function get() {
          return this.__tabButtons;
        },
        /**
         * determines if tabs should show icons only
         * @readonly
         * @returns {boolean}
         */
      },
      {
        key: "iconsOnly",
        get: function get() {
          return (
            this.iconBreakpoint &&
            (this.tabs || []).filter(function (tab) {
              return !tab.icon;
            }).length < 1 &&
            this.responsiveWidth < this.iconBreakpoint
          );
        },
        /**
         * mutation observer for tabs
         * @readonly
         * @returns {object}
         */
      },
      {
        key: "observer",
        get: function get() {
          var _this6 = this;

          var callback = function callback() {
            return _this6.updateTabs();
          };

          return new MutationObserver(callback);
        },
        /**
         * query selector for tabs
         * override this for custom elements that extend a11y-tabs
         *
         * @readonly
         * @memberof A11yTabs
         */
      },
      {
        key: "tabQuery",
        get: function get() {
          return "a11y-tab";
        },
        /**
         * array of tabs
         * @readonly
         * @returns {object}
         */
      },
      {
        key: "tabs",
        get: function get() {
          var _this7 = this;

          return Object.keys(this.__tabs || {}).map(function (i) {
            _this7.__tabs[i].order = i + 1;
            _this7.__tabs[i].total = _this7.__tabs.length;
            return _this7.__tabs[i];
          });
        },
        /**
         * determines whether tabs should be in vertical layout
         * @readonly
         * @returns {boolean}
         */
      },
      {
        key: "vertical",
        get: function get() {
          return (
            this.layoutBreakpoint &&
            this.layoutBreakpoint < this.responsiveWidth
          );
        },
      },
    ]);

    return A11yTabs;
  })(
    (0, _responsiveUtilityBehaviors.ResponsiveUtilityBehaviors)(
      _litElement.LitElement
    )
  );

exports.A11yTabs = A11yTabs;
window.customElements.define(A11yTabs.tag, A11yTabs);

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.A11yTab = void 0;

var _litElement = require("lit");

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

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    "\n        :host {\n          display: block;\n          margin-bottom: var(--a11y-tabs-content-padding);\n          border: 1px solid var(--a11y-tabs-border-color);\n          padding: var(--a11y-tabs-content-padding);\n        }\n        .sr-only {\n          position: absolute;\n          left: -99999px;\n          height: 0;\n          overflow: hidden;\n        }\n        .label-heading {\n          display: flex;\n          align-items: center;\n          color: var(--a11y-tabs-selected-color, var(--a11y-tabs-focus-color));\n          background-color: var(--a11y-tabs-background);\n          font-weight: var(--a11y-tabs-selected-font-weight, normal);\n          border-bottom: 1px solid var(--a11y-tabs-border-color);\n          margin: 0 0 calc(var(--a11y-tabs-content-padding) / 2);\n          padding: 0 0 calc(var(--a11y-tabs-content-padding) / 2);\n          border-radius: var(--a11y-tabs-horizontal-border-radius, 2px)\n            var(--a11y-tabs-horizontal-border-radius, 2px) 0 0;\n        }\n        simple-icon-lite {\n          margin-right: 1em;\n        }\n        @media screen {\n          :host {\n            border: none;\n            height: var(--a11y-tabs-tab-height, --a11y-tabs-height);\n            overflow: var(--a11y-tabs-tab-overflow, --a11y-tabs-overflow);\n            margin-bottom: unset;\n          }\n          :host([inactive]) {\n            display: none;\n          }\n          #content-inner {\n            max-width: 100%;\n            overflow: auto;\n          }\n          .label-heading {\n            display: none;\n          }\n        }\n      ",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '\n      <span class="sr-only">Tab ',
    '</span>\n      <div class="label-heading" part="heading">\n        <simple-icon-lite\n          class="icon"\n          ?hidden="',
    '"\n          .icon="',
    '" \n          part="icon"\n        >\n        </simple-icon-lite>\n        <slot name="label" ?hidden="',
    '"></slot>\n        <div class="label" part="label">',
    '</div>\n      </div>\n      <div id="content-inner" part="content"><slot></slot></div>\n      <span class="sr-only">\n        End of tab ',
    '. Back to <a href="#',
    '">tabs</a>.\n      </span>\n    ',
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
 * `a11y-tab`
 * a single tab within `a11y-tabs`
 * 
### Styling

`<a11y-tab>` provides the following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--a11y-tabs-tab-height` | tab height | `--a11y-tabs-height`
`--a11y-tabs-tab-overflow` | tab overflow | `--a11y-tabs-overflow`
 *
 * @customElement
 * @extends LitElement
 * @see ../a11y-tabs.js
 */
var A11yTab =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(A11yTab, _LitElement);

    _createClass(
      A11yTab,
      [
        {
          key: "render",
          value: function render() {
            return (0, _litElement.html)(
              _templateObject(),
              this.xOfY,
              !this.icon,
              this.icon,
              !this.label,
              this.label,
              this.xOfY,
              this.id
            );
          }, // haxProperty definition
        },
      ],
      [
        {
          key: "styles",
          get: function get() {
            return [(0, _litElement.css)(_templateObject2())];
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
                title: "Tab",
                description: "A single tab.",
                icon: "view-day",
                color: "grey",
                groups: ["Content", "Presentation", "Tabs"],
              },
              settings: {
                configure: [
                  {
                    property: "icon",
                    title: "Tab Icon",
                    inputMethod: "iconpicker",
                  },
                  {
                    property: "disabled",
                    title: "Disabled",
                    inputMethod: "boolean",
                  },
                  {
                    property: "label",
                    title: "Tab Label",
                    inputMethod: "textfield",
                  },
                  {
                    slot: "",
                    title: "Tab Content",
                    description: "A content of the tab.",
                    inputMethod: "code-editor",
                  },
                ],
                advanced: [
                  {
                    property: "id",
                    title: "Unique ID",
                    inputMethod: "textfield",
                  },
                  {
                    property: "flag",
                    title: "Optional Flag Text",
                    inputMethod: "textfield",
                  },
                  {
                    property: "flagIcon",
                    title: "Optional Flag Icon",
                    inputMethod: "iconpicker",
                  },
                ],
              },
            };
          }, // properties available to the custom element for data binding
        },
        {
          key: "properties",
          get: function get() {
            return {
              ariaLabelledby: {
                type: String,
                reflect: true,
                attribute: "aria-labelledby",
              },

              /**
               * optional flag the tab, eg. `new`, `alert`, or `error`
               */
              flag: {
                type: String,
                reflect: true,
              },

              /**
               * optional flag icon the tab, eg. `av:fiber-new`, `icons:warning`, or `icons:error`
               */
              flagIcon: {
                type: String,
                attribute: "flag-icon",
              },

              /**
               * whether the tabbed interface is disabled
               */
              disabled: {
                type: Boolean,
                reflect: true,
                attribute: "disabled",
              },

              /**
               * icon for this tab, eg. `maps:local-airport`, `maps:local-bar`, or `notification:wifi`
               */
              icon: {
                type: String,
              },

              /**
               * the unique identifier and anchor for the tab
               */
              id: {
                type: String,
                reflect: true,
                attribute: "id",
              },

              /**
               * whether the tab is hidden
               */
              inactive: {
                type: Boolean,
                reflect: true,
                attribute: "inactive",
              },

              /**
               * label for the tab
               */
              label: {
                type: String,
              },

              /**
               * order of the tab
               */
              order: {
                type: Number,
              },
              role: {
                type: String,
                reflect: true,
                attribute: "role",
              },

              /**
               * total number of tabs
               */
              tabindex: {
                type: Number,
              },

              /**
               * total number of tabs
               */
              total: {
                type: Number,
              },
            };
          },
        },
      ]
    );

    function A11yTab() {
      var _this;

      _classCallCheck(this, A11yTab);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(A11yTab).call(this)
      );
      _this.disabled = false;
      _this.hidden = false;
      _this.order = 1;
      _this.role = "tabpanel";
      _this.total = 1;
      _this.tabindex = 0;
      _this.flag = "";

      _this.addEventListener("a11y-tab-flag", function (e) {
        return _this.handleFlag(e);
      });

      return _this;
    }
    /**
     * returns mutation observer
     * @readonly
     * @returns {object} MutationObserver to unwrap contents
     */

    _createClass(
      A11yTab,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            _get(
              _getPrototypeOf(A11yTab.prototype),
              "connectedCallback",
              this
            ).call(this);

            this._labelChanged();

            this.observer.observe(this, {
              childList: true,
            });
          },
        },
        {
          key: "disconnectedCallback",
          value: function disconnectedCallback() {
            var _this2 = this;

            this.observer.disconnect();
            this.removeEventListener("a11y-tab-flag", function (e) {
              return _this2.handleFlag(e);
            });

            this._fireTabChanged();

            _get(
              _getPrototypeOf(A11yTab.prototype),
              "disconnectedCallback",
              this
            ).call(this);
          },
          /**
           * @fires a11y-tab-changed
           */
        },
        {
          key: "updated",
          value: function updated(changedProperties) {
            var _this3 = this;

            changedProperties.forEach(function (oldValue, propName) {
              if (["id", "order"].includes(propName) && !_this3.id)
                _this3.id = "tab-".concat(_this3.order);
              if (["label", "order"].includes(propName) && !_this3.label)
                _this3._labelChanged();
              if (propName === "flag") _this3._fireTabChanged();
              if (propName === "flagIcon") _this3._fireTabChanged();
              if (propName === "icon") _this3._fireTabChanged();

              if (propName === "id") {
                _this3.ariaLabelledby = "".concat(_this3.id, "-button");

                _this3._fireTabChanged();
              }

              if (propName === "label") _this3._fireTabChanged();
              if (propName === "disabled" && _this3.disabled)
                _this3._fireTabChanged();
            });
          },
          /**
           * Store the tag name to make it easier to obtain directly.
           */
        },
        {
          key: "_handleFlag",

          /**
           * handles any change in flag
           * @param {event} e the tab change event
           */
          value: function _handleFlag(e) {
            this.flag = e.detail.flag;
            this.flagIcon = e.detail.flagIcon;
          },
          /**
           * handles any change in the label
           */
        },
        {
          key: "_labelChanged",
          value: function _labelChanged() {
            if (!this.label || this.label.trim() === "")
              this.label = this.querySelector('*[slot="label"]')
                ? this.querySelector('*[slot="label"]').innerHTML
                : "Tab ".concat(this.order);
          },
          /**
           * handles any change in the tab attributes
           * @event a11y-tab-changed
           */
        },
        {
          key: "_fireTabChanged",
          value: function _fireTabChanged() {
            this.dispatchEvent(
              new CustomEvent("a11y-tab-changed", {
                bubbles: true,
                cancelable: true,
                composed: false,
                detail: this,
              })
            );
          },
        },
        {
          key: "observer",
          get: function get() {
            var _this4 = this;

            var lc = function lc(e) {
              return _this4._labelChanged();
            };

            return new MutationObserver(lc);
          },
          /**
           * gets x of y string
           *
           * @readonly
           * @returns {string} eg., "1 of 2"
           */
        },
        {
          key: "xOfY",
          get: function get() {
            return "".concat(this.order, " of ").concat(this.total);
          },
        },
      ],
      [
        {
          key: "tag",
          get: function get() {
            return "a11y-tab";
          },
        },
      ]
    );

    return A11yTab;
  })(_litElement.LitElement);

exports.A11yTab = A11yTab;
window.customElements.define(A11yTab.tag, A11yTab);

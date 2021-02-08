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

function _templateObject6() {
  var data = _taggedTemplateLiteral([
    '\n      <simple-tooltip for="',
    '-button"> ',
    " </simple-tooltip>\n    ",
  ]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral([' <span class="label">', "</span> "]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral([
    '\n          <simple-icon-lite\n            class="icon"\n            ?hidden="',
    '"\n            .icon="',
    '"\n          >\n          </simple-icon-lite>\n        ',
  ]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    '\n          <simple-icon-lite\n            class="icon"\n            ?hidden="',
    '"\n            .icon="',
    '"\n            .title="',
    '"\n          >\n          </simple-icon-lite>\n        ',
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n      <span class="flag-type" ?hidden="',
    '"> ',
    " </span>\n    ",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
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
    '"\n        role="tab"\n      >\n        ',
    " ",
    "\n        ",
    " ",
    "\n      </button>\n      ",
    "\n    ",
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

    _createClass(A11yTabs, null, [
      {
        key: "tag",

        /* REQUIRED FOR TOOLING DO NOT TOUCH */

        /**
         * Store the tag name to make it easier to obtain directly.
         * @notice function name must be here for tooling to operate correctly
         */
        get: function get() {
          return "a11y-tabs";
        },
      },
    ]);

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
          var _this2 = this;

          changedProperties.forEach(function (oldValue, propName) {
            if (propName === "id") _this2._idChanged(_this2.id, oldValue);
            if (propName === "activeTab" && _this2.activeTab !== oldValue)
              _this2._activeTabChanged(_this2.activeTab, oldValue);

            if (propName === "responsiveWidth") {
              if (_this2.vertical) {
                _this2.setAttribute("vertical", true);
              } else {
                _this2.removeAttribute("vertical");
              }
            }

            if (
              ["iconsBreakpoint", "responsiveWidth", "__tabs"].includes(
                propName
              )
            ) {
              if (_this2.iconsOnly) {
                _this2.setAttribute("icons-only", true);
              } else {
                _this2.removeAttribute("icons-only");
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
          var _this3 = this;

          this.__tabFocus = i;

          var focus = function focus() {
            var dir =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : 1;
            _this3.__tabFocus = _this3.__tabFocus + dir; // If we're at the end, go to the start

            if (_this3.__tabFocus >= _this3.buttons.length) {
              _this3.__tabFocus = 0; // If we're at the start, move to the end
            } else if (_this3.__tabFocus < 0) {
              _this3.__tabFocus = _this3.buttons.length - 1;
            }

            if (
              _this3.buttons[_this3.__tabFocus].disabled &&
              _this3.__tabFocus !== i
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
          var _this4 = this;

          return (0, _litElement.html)(
            _templateObject(),
            tab.id,
            tab.id === this.activeTab ? "true" : "false",
            tab.id,
            tab.id === this.activeTab && !this.disabled ? "active" : "",
            tab.flag,
            function (e) {
              return _this4._handleTab(tab);
            },
            function (e) {
              return _this4._handleKey(i, e);
            },
            tab.disabled || this.disabled,
            tab.id === this.activeTab ? 0 : -1,
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
          return (0, _litElement.html)(_templateObject2(), !tab.flag, tab.flag);
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
                _templateObject3(),
                !tab[icon],
                tab[icon],
                tab.flag
              )
            : (0, _litElement.html)(_templateObject4(), !tab[icon], tab[icon]);
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
          return (0, _litElement.html)(_templateObject5(), tab.label);
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
          return (0, _litElement.html)(_templateObject6(), tab.id, tab.label);
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
          var _this5 = this;

          var callback = function callback() {
            return _this5.updateTabs();
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
          var _this6 = this;

          return Object.keys(this.__tabs || {}).map(function (i) {
            _this6.__tabs[i].order = i + 1;
            _this6.__tabs[i].total = _this6.__tabs.length;
            return _this6.__tabs[i];
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

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HaxAppBrowser = void 0;

var _litElement = require("lit-element/lit-element.js");

require("./hax-tray-button.js");

var _haxStore = require("./hax-store.js");

var _mobx = require("mobx");

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

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    '\n            <hax-tray-button\n              class="',
    '"\n              show-text-label\n              icon-position="top"\n              index="',
    '"\n              label="',
    '"\n              icon="',
    '"\n              color="',
    '"\n              event-name="search-selected"\n              event-data="',
    '"\n            >\n            </hax-tray-button>\n          ',
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n      <simple-button-grid\n        class="',
    '"\n        always-expanded\n        columns="3"\n      >\n        ',
    '\n      </simple-button-grid>\n      <hax-app-search\n        id="haxappsearch"\n        class="',
    '"\n      ></hax-app-search>\n      <slot></slot>\n    ',
  ]);

  _templateObject2 = function _templateObject2() {
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

function _templateObject() {
  var data = _taggedTemplateLiteral([
    "\n        :host {\n          overflow-y: auto;\n          position: relative;\n        }\n        simple-button-grid {\n          overflow: auto;\n        }\n        simple-button-grid.collapse-hide {\n          max-height: 0 !important;\n          transition: all 0.5s;\n        }\n        .visibility-hidden {\n          z-index: -1;\n          visibility: hidden;\n          opacity: 0;\n          height: 0;\n          transition: all 0.5s;\n        }\n        hax-tray-button {\n          font-size: var(--hax-tray-font-size-xs, 11px);\n          --simple-toolbar-button-bg: var(--hax-toolbar-button-bg, #fff);\n          --simple-toolbar-button-border-color: var(\n            --hax-toolbar-border-color,\n            #ddd\n          );\n          --simple-toolbar-button-hover-color: var(\n            --hax-tray-accent-color,\n            #000\n          );\n          --simple-toolbar-button-hover-border-color: var(\n            --hax-tray-accent-color,\n            #000\n          );\n          --simple-toolbar-button-hover-border-color: var(\n            --hax-tray-accent-color,\n            #000\n          );\n        }\n      ",
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
 * `hax-app-browser`
 * @element hax-app-browser
 *
 * `Browse a list of apps. This provides a listing of our gizmos that we've integrated with.`
 * @microcopy - the mental model for this element
 * - hax-app - expression of how to communicate and visualize a data source
 * - gizmo - silly name for the general public when talking about hax-app and what it provides in the end
 */
var HaxAppBrowser =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(HaxAppBrowser, _LitElement);

    _createClass(HaxAppBrowser, null, [
      {
        key: "styles",
        get: function get() {
          return [(0, _litElement.css)(_templateObject())];
        },
      },
    ]);

    function HaxAppBrowser() {
      var _this;

      _classCallCheck(this, HaxAppBrowser);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(HaxAppBrowser).call(this)
      );

      _this.addEventListener("hax-tray-button-click", function (e) {
        if (e.detail.eventName === "search-selected") {
          _this.searching = true;
          _haxStore.HAXStore.activeApp = (0, _mobx.toJS)(
            _this.appList[e.detail.index]
          );
        } else if (e.detail.eventName === "cancel-search") {
          _this.searching = false;
        }
      });

      _this.searching = false;
      _this.appList = [];
      _this.activeApp = null;
      _this.hasActive = false;
      Promise.resolve().then(function () {
        return _interopRequireWildcard(
          require("@lrnwebcomponents/hax-body/lib/hax-app-search.js")
        );
      });
      Promise.resolve().then(function () {
        return _interopRequireWildcard(
          require("@lrnwebcomponents/simple-toolbar/lib/simple-button-grid.js")
        );
      });
      (0, _mobx.autorun)(function () {
        _this.appList = (0, _mobx.toJS)(_haxStore.HAXStore.appList);
      });
      (0, _mobx.autorun)(function () {
        _this.activeApp = (0, _mobx.toJS)(_haxStore.HAXStore.activeApp);
      });
      return _this;
    }

    _createClass(
      HaxAppBrowser,
      [
        {
          key: "render",
          value: function render() {
            var _this2 = this;

            return (0, _litElement.html)(
              _templateObject2(),
              this.searching ? "collapse-hide" : "",
              this.appList.map(function (app) {
                return (0,
                _litElement.html)(_templateObject3(), _this2.searching ? "visibility-hidden" : "", app.index, app.details.title, app.details.icon, app.details.color, app.index);
              }),
              !this.searching ? "visibility-hidden" : ""
            );
          },
        },
        {
          key: "updated",
          value: function updated(changedProperties) {
            var _this3 = this;

            changedProperties.forEach(function (oldValue, propName) {
              if (propName == "activeApp" && _this3[propName]) {
                _this3._activeAppChanged(_this3[propName], oldValue);
              }

              if (
                propName == "appList" &&
                _this3[propName] &&
                _this3.shadowRoot
              ) {
                _this3.searching = false;
              }
            });
          },
          /**
           * Active app updated, so scroll it into view
           */
        },
        {
          key: "_activeAppChanged",
          value: function _activeAppChanged(newValue, oldValue) {
            if (
              _typeof(oldValue) !==
                (typeof undefined === "undefined"
                  ? "undefined"
                  : _typeof(undefined)) &&
              newValue != null
            ) {
              this.hasActive = true;
            } else {
              this.hasActive = false;
            }
          },
        },
        {
          key: "firstUpdated",
          value: function firstUpdated(changedProperties) {
            if (
              _get(
                _getPrototypeOf(HaxAppBrowser.prototype),
                "firstUpdated",
                this
              )
            ) {
              _get(
                _getPrototypeOf(HaxAppBrowser.prototype),
                "firstUpdated",
                this
              ).call(this, changedProperties);
            } // app list registers early and has no imports so on
            // fast environments it's alreayd loaded

            this.searching = false;
          },
        },
      ],
      [
        {
          key: "tag",
          get: function get() {
            return "hax-app-browser";
          },
        },
        {
          key: "properties",
          get: function get() {
            return {
              /**
               * Search term
               */
              search: {
                type: String,
              },

              /**
               * Searching mode
               */
              searching: {
                type: Boolean,
                reflect: true,
              },

              /**
               * Global activeApp object.
               */
              activeApp: {
                type: Object,
              },

              /**
               * If we have an active, scale everything
               */
              hasActive: {
                reflect: true,
                type: Boolean,
                attribute: "has-active",
              },
              appList: {
                type: Array,
              },
            };
          },
        },
      ]
    );

    return HaxAppBrowser;
  })(_litElement.LitElement);

exports.HaxAppBrowser = HaxAppBrowser;
window.customElements.define(HaxAppBrowser.tag, HaxAppBrowser);

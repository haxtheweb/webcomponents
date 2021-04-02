"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HAX = void 0;

var _haxStore = require("@lrnwebcomponents/hax-body/lib/hax-store.js");

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

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;
  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;
    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }
    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);
      _cache.set(Class, Wrapper);
    }
    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }
    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true,
      },
    });
    return _setPrototypeOf(Wrapper, Class);
  };
  return _wrapNativeSuper(Class);
}

function isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }
  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
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

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
}

/**
 * `h-a-x`
 * @element h-a-x
 * `Single tag to transform authoring`
 *
 * @microcopy - language worth noting:
 *  - HAX - Headless Authoring eXperience
 *  - Body - the editable area that can be worked on and gets saved as a string / blob
 *

 * @demo demo/index.html
 */
var HAX =
  /*#__PURE__*/
  (function (_HTMLElement) {
    _inherits(HAX, _HTMLElement);

    _createClass(
      HAX,
      [
        {
          key: "html",
          // render function
          get: function get() {
            return '\n    <style>@import url("https://fonts.googleapis.com/css?family=Lato:400,700,900|Source+Code+Pro:400,700|Lora:400,400i,700,700i|Playfair+Display:700i,900");\n\n    html,\n    body {\n      margin: 0;\n      width: 100%;\n      font-family: "Lora";\n      font-size: 18px;\n      letter-spacing: -0.03px;\n      line-height: 1.58;\n    }\n    \n    h1,\n    h2,\n    p,\n    i,\n    a,\n    .first-letter,\n    .authorName a {\n      color: rgba(0, 0, 0, 0.84);\n      text-rendering: optimizeLegibility;\n    }\n    \n    hax-body h1,\n    hax-body h2 {\n      font-family: "Playfair Display", serif;\n      font-size: 48px;\n      text-align: left;\n      margin-bottom: 8px;\n      letter-spacing: unset;\n      line-height: unset;\n      margin-top: 0;\n    }\n    hax-body h1 {\n      font-size: 60px;\n    }\n    \n    h3 {\n      font-family: "Lato", sans-serif;\n      font-size: 30px;\n      font-weight: 900;\n      padding: 0;\n      text-align: left;\n      line-height: 34.5px;\n      letter-spacing: -0.45px;\n    }\n    \n    h4 {\n      font-family: "Lato", sans-serif;\n      font-size: 26px;\n      font-weight: 700;\n      color: #555;\n    }\n    \n    h5 {\n      font-family: "Lato", sans-serif;\n      font-size: 22px;\n      font-weight: 700;\n      color: #777;\n    }\n    \n    h6 {\n      font-family: "Lato", sans-serif;\n      font-size: 20px;\n      font-weight: 700;\n      color: #333;\n    }\n    \n    p,\n    i,\n    a {\n      margin-top: 21px;\n    }\n    a {\n      text-decoration: underline;\n    }\n    \n    blockquote {\n      font-family: "Playfair Display", serif;\n      font-size: 30px;\n      font-style: italic;\n      letter-spacing: -0.36px;\n      line-height: 44.4px;\n      overflow-wrap: break-word;\n      margin: 55px 0 33px 0;\n      /* text-align: center; */\n      color: rgba(0, 0, 0, 0.68);\n      padding: 0 0 0 50px;\n    }\n    \n    figcaption {\n      font-family: "Lato", sans-serif;\n      font-size: 16px;\n      font-weight: 400;\n      color: #666;\n    }\n    \n    label {\n      font-family: "Lato", sans-serif;\n      font-size: 16px;\n      font-weight: 700;\n      color: #333;\n    }\n    input, textarea, select {\n      border-radius:6px;\n      border-style:solid;\n      border-width: 2px;\n      padding:6px;\n      border-color:#333;\n    }\n    select option {\n      border-radius:6px;\n      border-style:solid;\n      border-width: 2px;\n      padding:6px;\n      border-color:#333;\n    }\n    \n    \n    \n    input[type=range] {\n      -webkit-appearance: none;\n      margin: 18px 0;\n    }\n    input[type=range]:focus {\n      outline: none;\n    }\n    input[type=range]::-webkit-slider-runnable-track {\n      width: 100%;\n      height: 8px;\n      cursor: pointer;\n      animate: 0.2s;\n      border-radius: 3px;\n    }\n    input[type=range]::-webkit-slider-thumb {\n      border: 2px solid #333333;\n      height: 36px;\n      width: 16px;\n      border-radius: 3px;\n      background: #ffffff;\n      cursor: pointer;\n      -webkit-appearance: none;\n      margin-top: -14px;\n    }\n    input[type=range]:focus::-webkit-slider-runnable-track {\n      background: #ccc;\n    }\n    input[type=range]::-moz-range-track {\n      width: 100%;\n      height: 8.4px;\n      cursor: pointer;\n      animate: 0.2s;\n      background: #ccc;\n      border: 2px solid #333;\n    }\n    input[type=range]::-moz-range-thumb {\n      border: 1px solid #333;\n      height: 36px;\n      width: 16px;\n      border-radius: 3px;\n      background: #ffffff;\n      cursor: pointer;\n    }\n    input[type=range]::-ms-track {\n      width: 100%;\n      height: 8.4px;\n      cursor: pointer;\n      animate: 0.2s;\n      background: transparent;\n      border-color: transparent;\n      border-width: 16px 0;\n      color: transparent;\n    }\n    input[type=range]::-ms-fill-lower {\n      background: #ccc;\n      border: 2px solid #333;\n    }\n    input[type=range]::-ms-fill-upper {\n      background: #ccc;\n      border-radius: 2px;\n    }\n    input[type=range]::-ms-thumb {\n      border: 1px solid #333;\n      height: 36px;\n      width: 16px;\n      border-radius: 3px;\n      background: #ffffff;\n      cursor: pointer;\n    }\n    input[type=range]:focus::-ms-fill-lower {\n      background: #ccc;\n    }\n    input[type=range]:focus::-ms-fill-upper {\n      background: #ccc;\n    }\n    \n    \n    \n    \n    ol ol {\n      list-style-type: lower-alpha;\n      font-size: 16px;\n      color: #444;\n    }\n    ol ol ol {\n      list-style-type: lower-roman;\n      font-size: 14px;\n    }\n    \n    code {\n      font-size: 18px;\n      background: rgba(0, 0, 0, 0.05);\n      border-radius: 2px;\n      padding: 3px 5px;\n      font-family: \'Source Code Pro\', monospace;\n    }\n    pre {\n      font-family: \'Source Code Pro\', monospace;\n    }\n    kbd {\n      font-family: \'Source Code Pro\', monospace;\n      font-weight:700;\n    }\n    samp {\n      font-family: \'Source Code Pro\', monospace;\n    }  \n    </style>\n\n    <hax-body>\n        <slot></slot>\n    </hax-body>';
          },
          /**
           * Store the tag name to make it easier to obtain directly.
           * @notice function name must be here for tooling to operate correctly
           */
        },
      ],
      [
        {
          key: "tag",
          get: function get() {
            return "h-a-x";
          },
          /**
           * HTMLElement
           */
        },
      ]
    );

    function HAX() {
      var _this;

      var delayRender =
        arguments.length > 0 && arguments[0] !== undefined
          ? arguments[0]
          : false;

      _classCallCheck(this, HAX);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(HAX).call(this));
      _this.__rendered = false; // set tag for later use

      _this.tag = HAX.tag;
      _this.template = document.createElement("template");

      _this.attachShadow({
        mode: "open",
      }); // if we shouldn't delay rendering

      if (!delayRender) {
        _this.render();
      } // setup events, only run them once and remove

      window.addEventListener(
        "hax-store-ready",
        _this.storeReady.bind(_assertThisInitialized(_this)),
        {
          once: true,
          passive: true,
        }
      );
      window.addEventListener(
        "hax-store-app-store-loaded",
        _this.appStoreReady.bind(_assertThisInitialized(_this)),
        {
          once: true,
          passive: true,
        }
      ); // dynamically import definitions for all needed tags

      Promise.resolve().then(function () {
        return _interopRequireWildcard(require("./lib/h-a-x-dependencies.js"));
      }); // map events from tray

      window.addEventListener(
        "hax-cancel",
        _this.cancelEvent.bind(_assertThisInitialized(_this))
      );
      window.addEventListener(
        "hax-save",
        _this.saveEvent.bind(_assertThisInitialized(_this))
      );
      return _this;
    }

    _createClass(
      HAX,
      [
        {
          key: "cancelEvent",
          value: function cancelEvent(e) {
            this.importSlotToHaxBody();
          },
        },
        {
          key: "saveEvent",
          value: function saveEvent(e) {
            this.innerHTML = _haxStore.HAXStore.activeHaxBody.haxToContent();
          },
          /**
           * life cycle, element is afixed to the DOM
           */
        },
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            if (
              _get(_getPrototypeOf(HAX.prototype), "connectedCallback", this)
            ) {
              _get(
                _getPrototypeOf(HAX.prototype),
                "connectedCallback",
                this
              ).call(this);
            } // this ensures it's only applied once

            if (!this.__HAXApplied && !window.__HAXApplied) {
              window.__HAXApplied = this.__HAXApplied = this.applyHAX();
            }
          },
          /**
           * Store is ready, now we can pass along the app store definition
           * which HAX will react to an load the data it finds.
           */
        },
        {
          key: "storeReady",
          value: function storeReady(e) {
            var _this2 = this;

            if (e.detail) {
              setTimeout(function () {
                try {
                  var appStore = _objectSpread(
                    {},
                    JSON.parse(_this2.getAttribute("app-store"))
                  );

                  if (_typeof(appStore) === "object") {
                    _haxStore.HAXStore.appStore = appStore;
                  }
                } catch (e) {
                  console.warn(e);
                }

                if (_this2.hidePanelOps === "hide-panel-ops") {
                  _this2.hidePanelOps = true;
                }

                _haxStore.HAXStore.haxTray.hidePanelOps = _this2.hidePanelOps;
                _haxStore.HAXStore.haxTray.offsetMargin = _this2.offsetMargin;
                _haxStore.HAXStore.haxTray.elementAlign = _this2.elementAlign;
              }, 0);
              window.removeEventListener(
                "hax-store-ready",
                this.storeReady.bind(this),
                {
                  once: true,
                  passive: true,
                }
              );
            }
          }, // import into the active body if there's content
          // obtain the nodes that have been assigned to the slot of our element
        },
        {
          key: "importSlotToHaxBody",
          value: function importSlotToHaxBody() {
            var nodes = [];

            if (this.shadowRoot.querySelector("slot")) {
              nodes = this.shadowRoot.querySelector("slot").assignedNodes();
            } else {
              nodes = this.children;
            }

            var body = ""; // loop the nodes and if it has an outerHTML attribute, append as string

            for (var i in nodes) {
              if (
                _typeof(nodes[i].outerHTML) !==
                (typeof undefined === "undefined"
                  ? "undefined"
                  : _typeof(undefined))
              ) {
                body += nodes[i].outerHTML;
              }
            }

            _haxStore.HAXStore.activeHaxBody.importContent(body);
          },
          /**
           * Appstore has been loaded, NOW we can safely do an import
           */
        },
        {
          key: "appStoreReady",
          value: function appStoreReady(e) {
            if (e.detail) {
              this.importSlotToHaxBody();
              window.removeEventListener(
                "hax-store-app-store-loaded",
                this.appStoreReady.bind(this),
                {
                  once: true,
                  passive: true,
                }
              );
            }
          },
        },
        {
          key: "render",
          value: function render() {
            this.__rendered = true;
            this.shadowRoot.innerHTML = null;
            this.template.innerHTML = this.html;
            this.shadowRoot.appendChild(this.template.content.cloneNode(true));
          },
          /**
           * Apply tags to the screen to establish HAX
           */
        },
        {
          key: "applyHAX",
          value: function applyHAX() {
            // store needs to come before anyone else, use it's availability request mechanism
            window.HaxStore.requestAvailability(); // now everyone else

            var tray = document.createElement("hax-tray");
            tray.hidePanelOps = this.hidePanelOps;
            tray.elementAlign = this.elementAlign;
            document.body.appendChild(tray);
            document.body.appendChild(document.createElement("hax-app-picker"));
            document.body.appendChild(
              document.createElement("hax-export-dialog")
            );
            document.body.appendChild(document.createElement("hax-autoloader"));
            return true;
          },
        },
        {
          key: "disconnectedCallback",
          value: function disconnectedCallback() {
            window.removeEventListener(
              "hax-store-ready",
              this.storeReady.bind(this),
              {
                once: true,
                passive: true,
              }
            );
            window.removeEventListener(
              "hax-store-app-store-loaded",
              this.appStoreReady.bind(this),
              {
                once: true,
                passive: true,
              }
            );
            window.removeEventListener(
              "hax-cancel",
              this.cancelEvent.bind(this)
            );
            window.removeEventListener("hax-save", this.saveEvent.bind(this));

            if (
              _get(_getPrototypeOf(HAX.prototype), "disconnectedCallback", this)
            ) {
              _get(
                _getPrototypeOf(HAX.prototype),
                "disconnectedCallback",
                this
              ).call(this);
            }
          },
        },
        {
          key: "attributeChangedCallback",
          value: function attributeChangedCallback(attr, oldValue, newValue) {},
        },
        {
          key: "elementAlign",
          get: function get() {
            return this.getAttribute("element-align");
          },
          set: function set(newValue) {
            if (this.__rendered) {
              this.setAttribute("element-align", newValue); // bind to the hax store global on change

              _haxStore.HAXStore.haxTray.elementAlign = newValue;
            }
          },
        },
        {
          key: "offsetMargin",
          get: function get() {
            return this.getAttribute("offset-margin");
          },
          set: function set(newValue) {
            this.setAttribute("offset-margin", newValue);

            if (this.__rendered) {
              // bind to the hax store global on change
              _haxStore.HAXStore.haxTray.offsetMargin = newValue;
            }
          },
        },
        {
          key: "hidePanelOps",
          get: function get() {
            return this.getAttribute("hide-panel-ops");
          },
          set: function set(newValue) {
            if (newValue) {
              this.setAttribute("hide-panel-ops", "hide-panel-ops");

              if (this.__rendered) {
                // bind to the hax store global on change
                _haxStore.HAXStore.haxTray.hidePanelOps = newValue;
              }
            }
          },
        },
        {
          key: "appStore",
          get: function get() {
            return this.getAttribute("app-store");
          },
          set: function set(newValue) {
            this.setAttribute("app-store", newValue);

            if (this.__rendered) {
              // bind to the hax store global on change
              _haxStore.HAXStore.appStore = _objectSpread(
                {},
                JSON.parse(this.getAttribute("app-store"))
              );
            }
          },
        },
      ],
      [
        {
          key: "observedAttributes",
          get: function get() {
            return [
              "element-align",
              "offset-margin",
              "app-store",
              "hide-panel-ops",
            ];
          },
        },
      ]
    );

    return HAX;
  })(_wrapNativeSuper(HTMLElement));

exports.HAX = HAX;
window.customElements.define("h-a-x", HAX);

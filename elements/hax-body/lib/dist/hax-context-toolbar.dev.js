"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HaxContextToolbar = void 0;

var _litElement = require("lit-element/lit-element.js");

require("@lrnwebcomponents/hax-body/lib/hax-text-context.js");

require("@lrnwebcomponents/hax-body/lib/hax-ce-context.js");

require("@lrnwebcomponents/hax-body/lib/hax-plate-context.js");

require("@lrnwebcomponents/hax-body/lib/hax-context-item.js");

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

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n      <absolute-position-behavior id="top" auto justify \n        position="top" \n        .target="',
    '">\n        <div class="menu">\n          <hax-text-context \n            id="text"\n            class="item ',
    '"\n            .target="',
    '"\n          ></hax-text-context>\n          <hax-ce-context\n            id="ce"\n            class="item ',
    '"\n            .target="',
    '"\n          ></hax-ce-context>\n          <hax-plate-context\n            id="plate"\n            class="item ',
    '"\n          ></hax-plate-context>\n        </div>\n      </absolute-position-behavior>\n      <absolute-position-behavior auto justify \n        position="bottom" \n        .target="',
    '">\n        <hax-context-item\n          icon="icons:add"\n          label="',
    '"\n          show-text-label\n          class="item ',
    " ",
    '"\n        >\n        </hax-context-item>\n      </absolute-position-behavior>\n    ',
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    "\n        :host {\n          width: 100%;\n        } \n        :host *:not(:defined) {\n          display: none !important;\n        }\n        :host(:not(.hax-visible)),\n        .item {\n          visibility: hidden;\n          opacity: 0;\n          z-index: 1000;\n          pointer-events: none;\n          transition: 0.2s top ease-in-out, 0.2s left ease-in-out;\n        }\n        :host(:hover),\n        :host(:focus-within),\n        .item:hover,\n        .item:focus-within {\n          z-index: var(--hax-ui-focus-z-index);\n        }\n        #top .menu {\n          display: flex;\n          width: 100%;\n          align-items: bottom;\n          justify-content: space-between;\n        }\n        #text,\n        #ce {\n          max-width: 280px;\n          flex: 1 1 auto;\n        }\n        #plate,\n        #add {\n          flex: 0 0 auto;\n        }\n        .item-visible, \n        .item-active {\n          visibility: visible;\n          pointer-events: all;\n          opacity: 1;\n        }\n        .item-tracking {\n          position: absolute;\n        }\n      ",
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

var HaxContextToolbar =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(HaxContextToolbar, _LitElement);

    _createClass(HaxContextToolbar, null, [
      {
        key: "styles",

        /**
         * LitElement constructable styles enhancement
         */
        get: function get() {
          return [].concat(
            _toConsumableArray(
              _get(_getPrototypeOf(HaxContextToolbar), "styles", this)
            ),
            [(0, _litElement.css)(_templateObject())]
          );
        },
      },
    ]);

    function HaxContextToolbar() {
      _classCallCheck(this, HaxContextToolbar);

      return _possibleConstructorReturn(
        this,
        _getPrototypeOf(HaxContextToolbar).call(this)
      );
    }

    _createClass(
      HaxContextToolbar,
      [
        {
          key: "render",
          value: function render() {
            return (0, _litElement.html)(
              _templateObject2(),
              this.target || document.body,
              this.textContext ? "item-visible" : "",
              this.target,
              this.ceContext ? "item-visible" : "",
              this.target,
              this.plateContext ? "item-visible" : "",
              this.target || document.body,
              this.addLabel,
              this.addContext ? "item-visible" : "",
              this.trackMouse ? "item-tracking" : ""
            );
          },
        },
        {
          key: "getToolbar",
          value: function getToolbar(id) {
            return this.shadowRoot &&
              this.shadowRoot.querySelector("#".concat(id))
              ? this.shadowRoot.querySelector("#".concat(id))
              : undefined;
          },
        },
        {
          key: "haxVisible",
          get: function get() {
            var visible = this.target && (this.ceContext || this.topVisible);
            this.setAttribute("hax-visible", visible);
            return visible;
          },
        },
        {
          key: "topVisible",
          get: function get() {
            return this.ceContext || this.plateContext || this.textContext;
          },
        },
        {
          key: "topToolbar",
          get: function get() {
            return this.getToolbar("#top");
          },
        },
        {
          key: "bottomToolbar",
          get: function get() {
            return this.getToolbar("#bottom");
          },
        },
      ],
      [
        {
          key: "tag",
          get: function get() {
            return "hax-context-toolbar";
          },
        },
        {
          key: "properties",
          get: function get() {
            var _objectSpread2;

            return _objectSpread(
              {},
              _get(_getPrototypeOf(HaxContextToolbar), "properties", this),
              ((_objectSpread2 = {
                /**
                 * See what's selected
                 */
                target: {
                  type: Object,
                },

                /**
                 * This is an inline context menu
                 */
                addLabel: {
                  type: String,
                },

                /**
                 * This is an inline context menu
                 */
                addContext: {
                  type: Boolean,
                },

                /**
                 * This is an inline context menu
                 */
                plateContext: {
                  type: Boolean,
                  reflect: true,
                },

                /**
                 * This is an inline context menu
                 */
                ceContext: {
                  type: Boolean,
                },
              }),
              _defineProperty(_objectSpread2, "plateContext", {
                type: Boolean,
              }),
              _defineProperty(_objectSpread2, "trackMouse", {
                type: Boolean,
              }),
              _objectSpread2)
            );
          },
        },
      ]
    );

    return HaxContextToolbar;
  })(_litElement.LitElement);
/**
 *
 * @customElement
 * @extends HaxContextToolbar
 * @extends LitElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */

exports.HaxContextToolbar = HaxContextToolbar;
window.customElements.define(HaxContextToolbar.tag, HaxContextToolbar);

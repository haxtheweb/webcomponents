"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HaxPreferencesDialog = void 0;

var _litElement = require("lit-element/lit-element.js");

var _HAXFields = require("@lrnwebcomponents/hax-body-behaviors/lib/HAXFields.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icon-button.js");

require("@lrnwebcomponents/simple-fields/simple-fields.js");

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

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    '<a\n            href="https://haxtheweb.org/"\n            rel="noopener"\n            id="link"\n            target="_blank"\n            >Learn more about HAX</a\n          >',
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n      <div style="height: 100%; overflow: auto;" class="pref-container">\n        <simple-fields\n          id="settingsform"\n          .schematizer="',
    '"\n          .elementizer="',
    '"\n        >\n        </simple-fields>\n      </div>\n      <br>\n      ',
    "\n    ",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    "\n        :host {\n          display: block;\n        }\n        .pref-container {\n          text-align: left;\n        }\n        #link {\n          font-size: 125%;\n          margin: calc(2 * var(--hax-tray-margin,4px)) auto;\n        }\n        simple-icon-button {\n          float: right;\n        }\n      ",
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
 * `hax-preferences-dialog`
 * @element hax-preferences-dialog
 * `Export dialog with all export options and settings provided.`
 */
var HaxPreferencesDialog =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(HaxPreferencesDialog, _LitElement);

    _createClass(HaxPreferencesDialog, null, [
      {
        key: "styles",

        /**
         * LitElement constructable styles enhancement
         */
        get: function get() {
          return [(0, _litElement.css)(_templateObject())];
        },
      },
    ]);

    function HaxPreferencesDialog() {
      var _this;

      _classCallCheck(this, HaxPreferencesDialog);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(HaxPreferencesDialog).call(this)
      );
      _this.hideLink = false;
      _this.title = "Advanced settings"; // JSON schema object needs delayed to ensure page repaints the form

      _this.schema = [
        {
          property: "haxVoiceCommands",
          title: "Voice commands",
          description: "Experimental: Voice based control system",
          inputMethod: "boolean",
          value: false,
        },
      ];
      _this.schemaValues = {
        haxVoiceCommands: false,
      };
      (0, _mobx.autorun)(function () {
        _this.globalPreferences = (0, _mobx.toJS)(
          _haxStore.HAXStore.globalPreferences
        );
        _this.schemaValues = (0, _mobx.toJS)(
          _haxStore.HAXStore.globalPreferences
        );
      });
      return _this;
    }

    _createClass(
      HaxPreferencesDialog,
      [
        {
          key: "closeBtn",
          value: function closeBtn(e) {
            this.dispatchEvent(
              new CustomEvent("hax-tray-button-click", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: {
                  eventName: "open-preferences",
                  index: 0,
                  value: true,
                },
              })
            );
          },
        },
        {
          key: "render",
          value: function render() {
            return (0, _litElement.html)(
              _templateObject2(),
              _HAXFields.HaxSchematizer,
              _HAXFields.HaxElementizer,
              !this.hideLink ? (0, _litElement.html)(_templateObject3()) : ""
            );
          },
        },
        {
          key: "firstUpdated",
          value: function firstUpdated(changedProperties) {
            this.shadowRoot.querySelector(
              "#settingsform"
            ).fields = _toConsumableArray(this.schema);
            this.shadowRoot.querySelector(
              "#settingsform"
            ).value = _objectSpread({}, this.schemaValues);
            this.shadowRoot
              .querySelector("#settingsform")
              .addEventListener(
                "value-changed",
                this.__valueChangedEvent.bind(this)
              );
          },
        },
        {
          key: "__valueChangedEvent",
          value: function __valueChangedEvent(e) {
            if (e.detail.value) {
              _haxStore.HAXStore.globalPreferences = _objectSpread(
                {},
                e.detail.value
              );
            }
          },
          /**
           * force an update of settings
           */
        },
        {
          key: "reloadPreferencesForm",
          value: function reloadPreferencesForm() {
            this.shadowRoot.querySelector(
              "#settingsform"
            ).fields = _toConsumableArray(this.schema);
            this.shadowRoot.querySelector(
              "#settingsform"
            ).value = _objectSpread({}, this.schemaValues);
          },
        },
      ],
      [
        {
          key: "tag",
          get: function get() {
            return "hax-preferences-dialog";
          },
        },
        {
          key: "properties",
          get: function get() {
            return {
              /**
               * Developer prop to hide the link
               */
              hideLink: {
                type: Boolean,
              },

              /**
               * Title.
               */
              title: {
                type: String,
              },

              /**
               * Schema that has all of inputs / manages state
               */
              schema: {
                type: Object,
              },

              /**
               * Preferences managed for everything global about HAX.
               */
              globalPreferences: {
                type: Object,
              },
            };
          },
        },
      ]
    );

    return HaxPreferencesDialog;
  })(_litElement.LitElement);

exports.HaxPreferencesDialog = HaxPreferencesDialog;
window.customElements.define(HaxPreferencesDialog.tag, HaxPreferencesDialog);

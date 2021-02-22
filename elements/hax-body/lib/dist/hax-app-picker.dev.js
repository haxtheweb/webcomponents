"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HaxAppPicker = void 0;

var _litElement = require("lit-element/lit-element.js");

require("@lrnwebcomponents/simple-modal/lib/simple-modal-template.js");

require("./hax-picker.js");

var _haxUiStyles = require("./hax-ui-styles.js");

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
    '\n      <simple-modal-template .title="',
    '" modal-id="hax-picker">\n        <hax-picker slot="content"></hax-picker>\n      </simple-modal-template>\n    ',
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    "\n        :host {\n          display: none;\n        }\n      ",
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
 * `hax-app-picker`
 * `app pop over + picker with options`
 */
var HaxAppPicker =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(HaxAppPicker, _LitElement);

    _createClass(HaxAppPicker, null, [
      {
        key: "styles",
        get: function get() {
          return [].concat(_toConsumableArray(_haxUiStyles.HaxUiSimpleModal), [
            (0, _litElement.css)(_templateObject()),
          ]);
        },
      },
    ]);

    function HaxAppPicker() {
      var _this;

      _classCallCheck(this, HaxAppPicker);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(HaxAppPicker).call(this)
      );
      _this.title = "Select an option";
      return _this;
    }

    _createClass(
      HaxAppPicker,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            _get(
              _getPrototypeOf(HaxAppPicker.prototype),
              "connectedCallback",
              this
            ).call(this);

            window.addEventListener(
              "simple-modal-show",
              this.modalToggle.bind(this)
            );
          },
        },
        {
          key: "disconnectedCallback",
          value: function disconnectedCallback() {
            window.removeEventListener(
              "simple-modal-show",
              this.modalToggle.bind(this)
            );

            _get(
              _getPrototypeOf(HaxAppPicker.prototype),
              "disconnectedCallback",
              this
            ).call(this);
          },
          /**
           * a bit hacky but gets around the cloning element and events issue
           */
        },
        {
          key: "modalToggle",
          value: function modalToggle(e) {
            if (e.detail.id == "hax-picker") {
              // present options AFTER we know the picker has opened :)
              e.detail.elements.content.children[0].buildOptions(
                this.elements,
                this.type,
                this.title,
                this.pickerType,
                this.target
              );
            }
          },
        },
        {
          key: "presentOptions",

          /**
           * Bridge since everything calls here
           */
          value: function presentOptions(elements) {
            var _this2 = this;

            var type =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : "element";
            var title =
              arguments.length > 2 && arguments[2] !== undefined
                ? arguments[2]
                : "Select an option";
            var pickerType =
              arguments.length > 3 && arguments[3] !== undefined
                ? arguments[3]
                : "gizmo";
            var target =
              arguments.length > 4 && arguments[4] !== undefined
                ? arguments[4]
                : window;
            this.elements = elements;
            this.type = type;
            this.title = title;
            this.pickerType = pickerType;
            this.target = target;
            setTimeout(function () {
              _this2.shadowRoot
                .querySelector('[modal-id="hax-picker"]')
                .openModal(target);
            }, 0);
          },
        },
        {
          key: "render",
          value: function render() {
            return (0, _litElement.html)(_templateObject2(), this.title);
          },
        },
        {
          key: "firstUpdated",

          /**
           * Attached to the DOM, now fire that we exist.
           */
          value: function firstUpdated() {
            // fire an event that this is a core piece of the system
            this.dispatchEvent(
              new CustomEvent("hax-register-core-piece", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: {
                  piece: "haxAppPicker",
                  object: this,
                },
              })
            );
          },
        },
      ],
      [
        {
          key: "properties",
          get: function get() {
            return {
              /**
               * Title for the dialog
               */
              title: {
                type: String,
              },
            };
          },
        },
        {
          key: "tag",
          get: function get() {
            return "hax-app-picker";
          },
        },
      ]
    );

    return HaxAppPicker;
  })(_litElement.LitElement);

exports.HaxAppPicker = HaxAppPicker;
window.customElements.define(HaxAppPicker.tag, HaxAppPicker);

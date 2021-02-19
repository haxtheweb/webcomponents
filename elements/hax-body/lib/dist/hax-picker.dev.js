"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HaxPicker = void 0;

var _litElement = require("lit-element/lit-element.js");

require("@lrnwebcomponents/simple-toolbar/lib/simple-button-grid.js");

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
    '\n            <hax-tray-button\n              show-text-label\n              id="picker-item-',
    '"\n              @click="',
    '"\n              data-selected="',
    '"\n              label="',
    '"\n              icon="',
    '"\n              icon-position="top"\n            ></hax-tray-button>\n          ',
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n      <simple-button-grid cols="100px">\n        ',
    "\n      </simple-button-grid>\n    ",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    "\n        simple-button-grid {\n          overflow-y: auto;\n          margin: var(--hax-tray-spacing-sm);\n        }\n      ",
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
 `hax-picker`
 A picker for selecting an item from a list of apps / hax gizmos which require
 a decision to be made. This is used when multiple things match either on upload
 in the add operation of the app or in the gizmo selection to render through,
 such as having multiple ways of presenting an image.

* @demo demo/index.html

@microcopy - the mental model for this element
 - data - this is the app data model for an element which expresses itself to hax
*/
var HaxPicker =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(HaxPicker, _LitElement);

    _createClass(HaxPicker, null, [
      {
        key: "styles",
        get: function get() {
          return [(0, _litElement.css)(_templateObject())];
        },
      },
    ]);

    function HaxPicker() {
      var _this;

      _classCallCheck(this, HaxPicker);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(HaxPicker).call(this)
      );
      _this._elements = [];
      _this.selectionList = [];
      _this.pickerType = "gizmo";
      return _this;
    }

    _createClass(
      HaxPicker,
      [
        {
          key: "render",
          value: function render() {
            var _this2 = this;

            return (0, _litElement.html)(
              _templateObject2(),
              this.selectionList.map(function (element, index) {
                return (0,
                _litElement.html)(_templateObject3(), index, _this2._selected, index, element.title, element.icon);
              })
            );
          },
        },
        {
          key: "buildOptions",

          /**
           * Present options to the user with a modal and selection method that
           * shifts itself to be above everything (stack order)
           * @param  [array] elements  a list of elements for presenting to the user
           * to select between.
           */
          value: function buildOptions(elements) {
            var _this3 = this;

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
            // wipe existing
            this.pickerType = pickerType;
            var tmp = [];

            switch (pickerType) {
              // hax gizmo selector
              case "gizmo":
                for (var i in elements) {
                  elements[i].__type = type;
                  tmp.push({
                    icon: elements[i].gizmo.icon,
                    title: elements[i].gizmo.title,
                    color: elements[i].gizmo.color,
                  });
                }

                break;
              // app selector

              case "app":
                for (var i in elements) {
                  tmp.push({
                    icon: elements[i].details.icon,
                    title: elements[i].details.title,
                    color: elements[i].details.color,
                  });
                }

                break;
              // we don't know what to do with this

              default:
                tmp = elements;
                break;
            }

            this._elements = elements;
            this.selectionList = _toConsumableArray(tmp); // try to focus on option 0

            setTimeout(function () {
              _this3.shadowRoot.querySelector("#picker-item-0").focus();
            }, 50);
          },
          /**
           * Handle the user selecting an app.
           */
        },
        {
          key: "_selected",
          value: function _selected(e) {
            var key = e.target.getAttribute("data-selected");
            e.preventDefault();
            e.stopPropagation();

            if (
              _typeof(this._elements[key]) !==
              (typeof undefined === "undefined"
                ? "undefined"
                : _typeof(undefined))
            ) {
              // haxElement is a unique case
              if (this.pickerType == "gizmo") {
                this._elements[key].replace = true;
                this.dispatchEvent(
                  new CustomEvent("hax-insert-content", {
                    bubbles: true,
                    cancelable: true,
                    composed: true,
                    detail: this._elements[key],
                  })
                );
              } else {
                // bubble this up
                this.dispatchEvent(
                  new CustomEvent("hax-app-picker-selection", {
                    bubbles: true,
                    cancelable: true,
                    composed: true,
                    detail: this._elements[key],
                  })
                );
              }
            }

            this.close();
          },
        },
        {
          key: "close",
          value: function close() {
            window.dispatchEvent(
              new CustomEvent("simple-modal-hide", {
                bubbles: true,
                cancelable: true,
                detail: {},
              })
            );
          },
        },
      ],
      [
        {
          key: "tag",
          get: function get() {
            return "hax-picker";
          },
        },
        {
          key: "properties",
          get: function get() {
            return {
              /**
               * raw element set
               */
              _elements: {
                type: Array,
              },

              /**
               * Refactored list for selection purposes
               */
              selectionList: {
                type: Array,
              },

              /**
               * Allow multiple uses
               */
              pickerType: {
                type: String,
                attribute: "picker-type",
              },
            };
          },
        },
      ]
    );

    return HaxPicker;
  })(_litElement.LitElement);

exports.HaxPicker = HaxPicker;
window.customElements.define(HaxPicker.tag, HaxPicker);

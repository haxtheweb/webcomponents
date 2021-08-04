"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HaxPicker = void 0;

var _litElement = require("lit-element/lit-element.js");

require("@lrnwebcomponents/simple-toolbar/lib/simple-button-grid.js");

var _haxUiStyles = require("./hax-ui-styles.js");

var _haxStore = require("./hax-store.js");

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

function _templateObject4() {
  var data = _taggedTemplateLiteral([
    '\n                <hax-tray-button\n                  show-text-label\n                  id="picker-item-',
    '"\n                  @click="',
    '"\n                  data-selected="',
    '"\n                  ?disabled="',
    '"\n                  label="',
    '"\n                  icon="',
    '"\n                  icon-position="top"\n                ></hax-tray-button>\n              ',
  ]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    ' <div id="filters">\n            <simple-icon-button-lite\n              icon="editable-table:filter',
    '"\n              label="Toggle Filters"\n              tooltip-position="right"\n              @click="',
    '"\n            >\n            </simple-icon-button-lite>\n            <simple-fields-field\n              ?hidden="',
    '"\n              id="hax-gizmo-filters"\n              label="Filters"\n              type="checkbox"\n              .options="',
    '"\n              @value-changed="',
    '"\n            >\n            </simple-fields-field>\n          </div>',
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    "\n      ",
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
    "\n        simple-button-grid {\n          overflow-y: auto;\n          margin: var(--hax-ui-spacing-sm);\n          --simple-button-grid-cols: 100px;\n        }\n        #filters {\n          min-height: 24px;\n        }\n        simple-icon-button-lite {\n          float: right;\n          margin-left: -24px;\n        }\n        simple-fields-field::part(fieldset-legend) {\n          line-height: 24px;\n        }\n        simple-fields-field::part(fieldset-options) {\n          display: grid;\n          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));\n        }\n        simple-fields-field::part(option) {\n          display: flex;\n          flex-wrap: no-wrap;\n          align-items: center;\n          justify-content: space-between;\n          margin: 0 var(--simple-fields-margin-small, 8px);\n          flex-direction: row-reverse;\n        }\n        simple-fields-field::part(option-inner) {\n          flex: 0 0 auto;\n          margin: 0 calc(var(--simple-fields-margin-small, 8px) * 0.5) 0 0;\n        }\n        simple-fields-field::part(option-label) {\n          flex: 1 1 auto;\n          margin: 0;\n          font-size: var(--hax-ui-font-size-sm, 13px);\n        }\n        :host([filter-on]) simple-button-grid {\n          margin-bottom: var(--simple-fields-margin-small, 8px);\n        }\n        :host([filter-on]) #hax-gizmo-filters {\n          margin-bottom: 0;\n        }\n        :host([filter-on]) ::part(fieldset-options) {\n          padding-bottom: var(--simple-fields-margin-small, 8px);\n        }\n      ",
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
          return [].concat(
            _toConsumableArray(_haxUiStyles.HaxComponentStyles),
            [(0, _litElement.css)(_templateObject())]
          );
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
              !!this.keywords
                ? (0, _litElement.html)(
                    _templateObject3(),
                    !this.filterOn ? "" : "-off",
                    function (e) {
                      return (_this2.filterOn = !_this2.filterOn);
                    },
                    !this.filterOn,
                    this.keywords,
                    this._handleFilters
                  )
                : "",
              this.selectionList.map(function (element, index) {
                return !_this2._isFiltered(element.keywords)
                  ? ""
                  : (0, _litElement.html)(
                      _templateObject4(),
                      index,
                      _this2._selected,
                      index,
                      _haxStore.HAXStore.activeGizmo &&
                        _haxStore.HAXStore.activeGizmo.tag == element.tag,
                      element.title,
                      element.icon
                    );
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

            var tmp = [],
              addKeywords = function addKeywords(i) {
                elements[i].gizmo.keywords.forEach(function (keyword) {
                  keyword = (keyword || "").toLowerCase();
                  var sanitized = keyword.replace(/[\s\W]*/, "");
                  if (sanitized.length > 0) _this3.keywords[keyword] = keyword;
                });
              };

            this.keywords = {};

            switch (pickerType) {
              // hax gizmo selector
              case "gizmo":
                for (var i in elements) {
                  elements[i].__type = type;
                  tmp.push({
                    icon: elements[i].gizmo.icon,
                    title: elements[i].gizmo.title,
                    color: elements[i].gizmo.color,
                    tag: elements[i].gizmo.tag,
                    keywords: elements[i].gizmo.keywords,
                  });
                  addKeywords(i);
                }

                break;
              // app selector

              case "app":
                for (var i in elements) {
                  tmp.push({
                    icon: elements[i].details.icon,
                    title: elements[i].details.title,
                    color: elements[i].details.color,
                    tag: elements[i].gizmo.tag,
                    keywords: elements[i].gizmo.keywords,
                  });
                  addKeywords(i);
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
        },
        {
          key: "_handleFilters",
          value: function _handleFilters(e) {
            var filters =
              this.shadowRoot &&
              this.shadowRoot.querySelector("#hax-gizmo-filters")
                ? this.shadowRoot.querySelector("#hax-gizmo-filters")
                : undefined;
            if (filters) this.filters = filters.value;
          },
        },
        {
          key: "_isFiltered",
          value: function _isFiltered(keywords) {
            var i = 0,
              filtered =
                !this.filterOn || !this.filters || this.filters.length < 1;

            while (!filtered && i < this.filters.length) {
              if (keywords.includes(this.filters[i])) filtered = true;
              i++;
            }

            return filtered;
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
              keywords: {
                type: Object,
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
              filters: {
                type: Array,
              },
              filterOn: {
                type: Boolean,
                attribute: "filter-on",
                reflect: true,
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

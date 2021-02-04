"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.EditableTableFilter = void 0;

var _litElement = require("lit-element/lit-element.js");

var _editableTableBehaviors = require("./editable-table-behaviors.js");

require("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icons.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js");

require("@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js");

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
    "\n        #filter-off {\n          opacity: 0.25;\n        }\n        :host(:not([filtered])) .filtered,\n        :host(:not([filtered]):not(:focus):not(:hover)) #filter,\n        :host(:not([filtered]):focus) #filter-off,\n        :host(:not([filtered]):hover) #filter-off,\n        :host([filtered]:not(:focus):not(:hover)) #filter-off,\n        :host([filtered]:focus) #filter,\n        :host([filtered]:hover) #filter {\n          display: none;\n        }\n      ",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
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

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '\n      <button id="button" class="cell-button" @click="',
    '">\n        <span><slot></slot></span>\n        <span class="sr-only" .hidden="',
    '"> (filtered)</span>\n        <span class="sr-only"> Toggle filter.</span>\n        <simple-icon-lite\n          id="filter"\n          icon="editable-table:filter"\n        ></simple-icon-lite>\n        <simple-icon-lite\n          id="filter-off"\n          icon="editable-table:filter-off"\n        ></simple-icon-lite>\n      </button>\n      <simple-tooltip for="button"\n        >Toggle Column ',
    ' filter for "<slot\n        ></slot>"</simple-tooltip\n      >\n    ',
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
 * `editable-table-editor-filter`
 * `Displays a cell in editable-table-display mode (editable-table-display.html) as a filter button.`
 *
 * @demo ./demo/display.html
 * @customElement
 * @extends LitElement
 */
var EditableTableFilter =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(EditableTableFilter, _LitElement);

    _createClass(
      EditableTableFilter,
      [
        {
          key: "render",
          value: function render() {
            return (0, _litElement.html)(
              _templateObject(),
              this._onFilterClicked,
              !this.filtered,
              this.columnIndex
            );
          },
        },
      ],
      [
        {
          key: "styles",
          get: function get() {
            return [].concat(
              _toConsumableArray(
                _get(_getPrototypeOf(EditableTableFilter), "styles", this) || []
              ),
              _toConsumableArray(
                _editableTableBehaviors.editableTableCellStyles
              ),
              [(0, _litElement.css)(_templateObject2())]
            );
          },
        },
        {
          key: "tag",
          get: function get() {
            return "editable-table-filter";
          },
        },
      ]
    );

    function EditableTableFilter() {
      var _this;

      _classCallCheck(this, EditableTableFilter);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(EditableTableFilter).call(this)
      );
      _this.columnIndex = null;
      _this.filtered = false;
      _this.text = "";
      return _this;
    }

    _createClass(
      EditableTableFilter,
      [
        {
          key: "_getPressed",

          /**
           * Listens for button click
           */
          value: function _getPressed(filtered) {
            return filtered ? "true" : "false";
          },
          /**
           * Fires when filter button is clicked
           * @event toggle-filter
           */
        },
        {
          key: "_onFilterClicked",
          value: function _onFilterClicked() {
            this.dispatchEvent(
              new CustomEvent("toggle-filter", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: this,
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
               * Index of column
               */
              columnIndex: {
                type: Number,
                attribute: "column-index",
              },

              /**
               * Whether column is filtered
               */
              filtered: {
                type: Boolean,
                reflect: true,
              },

              /**
               * Column header text
               */
              text: {
                type: String,
              },
            };
          },
        },
      ]
    );

    return EditableTableFilter;
  })(_litElement.LitElement);

exports.EditableTableFilter = EditableTableFilter;
window.customElements.define(EditableTableFilter.tag, EditableTableFilter);

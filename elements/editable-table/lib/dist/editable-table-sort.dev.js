"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.EditableTableSort = void 0;

var _litElement = require("lit-element/lit-element.js");

var _editableTableBehaviors = require("./editable-table-behaviors.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icons.js");

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
  var data = _taggedTemplateLiteral([""]);

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
    '">\n        <slot></slot>\n        <span class="sr-only asc">(ascending)</span>\n        <span class="sr-only desc">(descending)</span>\n        <span class="sr-only"> Toggle sort mode.</span>\n        <simple-icon-lite\n          icon="',
    '"\n        ></simple-icon-lite>\n      </button>\n    ',
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
 * `editable-table-editor-sort`
 * A column header that functions as a three-state sort button (no sort, sort ascending, sort descending) for table-editor-display mode (table-editor-display.html).
 *
 * @demo ./demo/display.html
 * @customElement
 * @extends LitElement
 * @extends editableTableCellStyles
 */
var EditableTableSort =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(EditableTableSort, _LitElement);

    _createClass(
      EditableTableSort,
      [
        {
          key: "render",
          value: function render() {
            return (0, _litElement.html)(
              _templateObject(),
              this._onSortClicked,
              this.sortMode == "asc"
                ? "arrow-drop-up"
                : this.sortMode == "desc"
                ? "arrow-drop-down"
                : "editable-table:sortable"
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
                _get(_getPrototypeOf(EditableTableSort), "styles", this) || []
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
            return "editable-table-sort";
          },
        },
        {
          key: "properties",
          get: function get() {
            return {
              /**
               * Sort ascending, descending or none
               */
              columnIndex: {
                attribute: "column-index",
                type: Number,
                reflect: true,
              },

              /**
               * Sort mode: ascending, descending or none
               */
              sortMode: {
                attribute: "sort-mode",
                type: String,
                reflect: true,
              },

              /**
               * Index of current sort column
               */
              sortColumn: {
                attribute: "sort-column",
                type: Number,
                reflect: true,
              },
            };
          },
        },
      ]
    );

    function EditableTableSort() {
      var _this;

      _classCallCheck(this, EditableTableSort);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(EditableTableSort).call(this)
      );
      _this.sortMode = "none";
      _this.sortColumn = -1;
      return _this;
    }
    /**
     *
     * Whether column is being sorted
     * @readonly
     * @memberof EditableTableSort
     */

    _createClass(EditableTableSort, [
      {
        key: "_onSortClicked",

        /**
         * Fires when sort button is clicked
         * @event change-sort-mode
         */
        value: function _onSortClicked() {
          this.dispatchEvent(
            new CustomEvent("change-sort-mode", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: this,
            })
          );
        },
        /**
         * Changes sort mode
         * @param {string} mode sort mode: `asc` for ascending or `desc` for descending;
         */
      },
      {
        key: "setSortMode",
        value: function setSortMode(mode) {
          this.sortMode = mode;
          this.__checked =
            mode === "asc" ? true : mode === "desc" ? mode : false;
        },
      },
      {
        key: "sorting",
        get: function get() {
          return this.columnIndex === this.sortColumn;
        },
      },
    ]);

    return EditableTableSort;
  })(_litElement.LitElement);

exports.EditableTableSort = EditableTableSort;
window.customElements.define(EditableTableSort.tag, EditableTableSort);

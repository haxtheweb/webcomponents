"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.cellBehaviors = exports.displayBehaviors = exports.dataProperties = exports.displayProperties = exports.editableTableDisplayStyles = exports.editableTableStyles = exports.editableTableCellStyles = void 0;

var _litElement = require("lit-element/lit-element.js");

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

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    '\n    table[sort] .thead .th,\n    table[filter] .tbody .td,\n    table[filter] .tfoot .td {\n      padding-left: 0;\n      padding-right: 0;\n      padding-top: 0;\n      padding-bottom: 0;\n    }\n    caption {\n      padding-top: var(--editable-table-cell-vertical-padding, 10px);\n      padding-bottom: var(--editable-table-cell-vertical-padding, 10px);\n      padding: 0;\n    }\n    caption > div {\n      display: flex;\n      align-items: flex-end;\n      justify-content: space-between;\n    }\n    caption > div > *:not(:last-child) {\n      padding: 0 0 5px;\n    }\n    #column {\n      width: calc(var(--simple-picker-option-size) + 6px);\n      overflow: visible;\n      display: none;\n      margin-left: 10px;\n      --simple-picker-border-width: 1px;\n      --simple-picker-focus-border-width: 1px;\n      --simple-picker-border-color: var(--editable-table-border-color, #999);\n    }\n    .th,\n    .td {\n      padding-top: var(--editable-table-cell-vertical-padding, 10px);\n      padding-bottom: var(--editable-table-cell-vertical-padding, 10px);\n      padding-left: var(--editable-table-cell-horizontal-padding, 6px);\n      padding-right: var(--editable-table-cell-horizontal-padding, 6px);\n    }\n    span.cell {\n      display: block;\n    }\n    @media screen {\n      :host([responsive][responsive-size="xs"]) #column {\n        display: inline-flex;\n      }\n      :host([responsive][responsive-size="xs"]) .th[xs-hidden],\n      :host([responsive][responsive-size="xs"]) .td[xs-hidden] {\n        display: none;\n      }\n    }\n  ',
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n    :host {\n      display: block;\n      width: 100%;\n      max-width: 100%;\n      margin: 15px 0;\n      font-size: var(--editable-table-font-size, unset);\n      font-family: var(--editable-table-font-family, inherit);\n      font-weight: var(--editable-table-medium-weight, 300);\n      color: var(--editable-table-color, #222);\n      background-color: var(--editable-table-bg-color, #fff);\n\n      --simple-picker-font-family: var(\n        --editable-table-secondary-font-family,\n        "Roboto",\n        "Noto",\n        sans-serif\n      );\n      --simple-picker-font-size: var(\n        --editable-table-secondary-font-size,\n        12px\n      );\n      --simple-picker-color: var(--editable-table-color, #222);\n      --simple-picker-background-color: var(--editable-table-bg-color, #fff);\n      --paper-font-caption: {\n        font-family: var(\n          --editable-table-secondary-font-family,\n          "Roboto",\n          "Noto",\n          sans-serif\n        );\n      }\n    }\n    :host([hidden]) {\n      display: none;\n    }\n    .sr-only {\n      position: absolute;\n      left: -9999px;\n      font-size: 0;\n      height: 0;\n      width: 0;\n      overflow: hidden;\n      margin: 0;\n      padding: 0;\n    }\n    table {\n      width: calc(100% - 2 * var(--editable-table-border-width, 1px));\n      display: table;\n      border-collapse: collapse;\n      border-width: var(--editable-table-border-width, 1px);\n      border-style: var(--editable-table-border-style, solid);\n      border-color: var(--editable-table-border-color, #999);\n      font-weight: var(--editable-table-light-weight, 200);\n      color: var(--editable-table-color, #222);\n      background-color: var(--editable-table-bg-color, #fff);\n    }\n    .th,\n    .td {\n      font-weight: var(--editable-table-light-weight, 200);\n      color: var(--editable-table-color, #222);\n      background-color: var(--editable-table-bg-color, #fff);\n    }\n    caption {\n      font-size: var(\n        --editable-table-caption-font-size,\n        var(--editable-table-font-size, unset)\n      );\n      font-weight: var(--editable-table-heavy-weight, 600);\n      color: var(\n        --editable-table-caption-color,\n        var(--editable-table-color, #222)\n      );\n      background-color: var(\n        --editable-table-caption-bg-color,\n        var(--editable-table-bg-color, #fff)\n      );\n      width: 100%;\n    }\n    .tr {\n      display: table-row;\n    }\n    .th-or-td {\n      display: table-cell;\n    }\n    .thead-tr .th {\n      background-color: var(--editable-table-heading-bg-color, #e0e0e0);\n      font-weight: var(--editable-table-heavy-weight, 600);\n      color: var(--editable-table-heading-color, #000);\n    }\n    .tbody-tr .th {\n      font-weight: var(--editable-table-heavy-weight, 600);\n      color: var(--editable-table-heading-color, #000);\n      background-color: var(--editable-table-bg-color, #fff);\n      text-align: left;\n    }\n    *[bordered] .th,\n    *[bordered] .td {\n      border-width: var(--editable-table-border-width, 1px);\n      border-style: var(--editable-table-border-style, solid);\n      border-color: var(--editable-table-border-color, #999);\n    }\n    *[condensed] {\n      --editable-table-cell-vertical-padding: var(\n        --editable-table-cell-vertical-padding-condensed,\n        2px\n      );\n      --editable-table-cell-horizontal-padding: var(\n        --editable-table-cell-horizontal-padding-condensed,\n        4px\n      );\n    }\n    *[striped] .tbody-tr:nth-child(2n + 1) .th-or-td {\n      background-color: var(--editable-table-stripe-bg-color, #f0f0f0);\n    }\n    *[column-striped] .tbody-tr .th-or-td:nth-child(2n),\n    *[column-striped] .tfoot-tr .th-or-td:nth-child(2n) {\n      background-color: var(--editable-table-stripe-bg-color, #f0f0f0);\n    }\n    .tfoot-tr .th,\n    .tfoot-tr .td {\n      border-top: 2px solid var(--editable-table-color, #222);\n      font-weight: var(--editable-table-heavy-weight, 600);\n      color: var(--editable-table-heading-color, #000);\n    }\n    caption,\n    .th-or-td {\n      text-align: left;\n    }\n    *[numeric-styles] .thead-tr .th-or-td[numeric],\n    *[numeric-styles] .tfoot-tr .th-or-td[numeric],\n    *[numeric-styles] .th-or-td[numeric] .cell {\n      text-align: right;\n      --editable-table-cell-justify: flex-end;\n    }\n    *[numeric-styles] .tfoot-tr .th-or-td[negative],\n    *[numeric-styles] .td[negative] .cell {\n      color: var(--editable-table-negative-color, red);\n      --editable-table-cell-color: var(--editable-table-negative-color, red);\n    }\n    editable-table-sort {\n      width: 100%;\n    }\n    button {\n      background-color: transparent;\n      border: none;\n      border-radius: 0;\n    }\n    ::slotted(table) {\n      display: none;\n    }\n    @media screen {\n      :host {\n        overflow-x: auto;\n        width: 100%;\n        max-width: 100%;\n      }\n      :host([responsive]) {\n        overflow-x: visible;\n      }\n    }\n  ',
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    "\n    .cell-button {\n      padding-top: var(--editable-table-cell-vertical-padding, 10px);\n      padding-bottom: var(--editable-table-cell-vertical-padding, 10px);\n      padding-left: var(--editable-table-cell-horizontal-padding, 6px);\n      padding-right: var(--editable-table-cell-horizontal-padding, 6px);\n      margin: 0;\n      width: 100%;\n      display: flex;\n      justify-content: var(--editable-table-cell-justify, space-between);\n      align-items: center;\n      align-content: stretch;\n      font-family: inherit;\n      font-size: inherit;\n      font-weight: inherit;\n      background-color: transparent;\n      border: none;\n      border-radius: 0;\n      color: var(--editable-table-cell-color);\n    }\n    .sr-only {\n      position: absolute;\n      left: -9999px;\n      font-size: 0;\n      height: 0;\n      width: 0;\n      overflow: hidden;\n      margin: 0;\n      padding: 0;\n    }\n  ",
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

/**
 * `editable-table-behaviors`
 * A set of common behaviors for editable-table web components.
 *
 */

/**
 * styling for table cells
 * @const
 * @default
 * @type {array}
 *
 */
var editableTableCellStyles = [(0, _litElement.css)(_templateObject())];
/**
 * styling for table
 * @const
 * @default
 * @type {array}
 */

exports.editableTableCellStyles = editableTableCellStyles;
var editableTableStyles = [(0, _litElement.css)(_templateObject2())];
/**
 * styling for table in display mode
 * @const
 * @default
 * @type {array}
 */

exports.editableTableStyles = editableTableStyles;
var editableTableDisplayStyles = [].concat(editableTableStyles, [
  (0, _litElement.css)(_templateObject3()),
]);
/**
 * List of display-only properties
 * @const
 * @default
 * @type {object}
 */

exports.editableTableDisplayStyles = editableTableDisplayStyles;
var displayProperties = {
  /**
   * Add borders to table and table cells.
   */
  bordered: {
    attribute: "bordered",
    type: Boolean,
  },

  /**
   * Is striped add alternating column striping.
   */
  columnStriped: {
    attribute: "column-striped",
    type: Boolean,
  },

  /**
   * Condense height of table cells.
   */
  condensed: {
    attribute: "condensed",
    type: Boolean,
  },

  /**
   * Right-align numeric values and indicate negative values as red text
   */
  numericStyles: {
    attribute: "numeric-styles",
    type: Boolean,
    reflect: true,
  },

  /**
   * When table is wider than screens,
   * users will select a column to display
   * instead of scrolling across table.
   */
  responsive: {
    attribute: "responsive",
    type: Boolean,
    reflect: true,
  },

  /**
   * Add alternating row striping.
   */
  striped: {
    attribute: "striped",
    type: Boolean,
  },
};
/**
 * List of data manipulation properties
 * @const
 * @default
 * @type {object}
 */

exports.displayProperties = displayProperties;
var dataProperties = {
  /**
   * Allow table to be downloaded as CSV
   */
  downloadable: {
    attribute: "downloadable",
    type: Boolean,
    reflect: true,
  },

  /**
   * Enable filtering by cell value.
   */
  filter: {
    attribute: "filter",
    type: Boolean,
    reflect: true,
  },

  /**
   * Allow table to be printed
   */
  printable: {
    attribute: "printable",
    type: Boolean,
    reflect: true,
  },

  /**
   * Enable sorting by column header.
   */
  sort: {
    attribute: "sort",
    type: Boolean,
    reflect: true,
  },
};
/**
 * behaviors needed to display table in either mode
 * @class
 * @customElement
 */

exports.dataProperties = dataProperties;

var displayBehaviors = function displayBehaviors(SuperClass) {
  return (
    /*#__PURE__*/
    (function (_SuperClass) {
      _inherits(_class, _SuperClass);

      _createClass(_class, null, [
        {
          key: "properties",
          get: function get() {
            return _objectSpread(
              {},
              _get(_getPrototypeOf(_class), "properties", this),
              {},
              displayProperties,
              {},
              dataProperties,
              {
                /**
                 * a table caption
                 */
                caption: {
                  type: String,
                  value: null,
                },

                /**
                 * Display first row as a column header.
                 */
                columnHeader: {
                  attribute: "column-header",
                  type: Boolean,
                },

                /**
                 * Raw data pulled in from csv file.
                 */
                csvData: {
                  type: String,
                  attribute: "csv-data",
                },

                /**
                 * raw data
                 */
                data: {
                  type: Array,
                  notify: true,
                  attribute: "data",
                },

                /**
                 * Location of CSV file.
                 */
                dataCsv: {
                  type: String,
                  attribute: "data-csv",
                },

                /**
                 * Display last row as a column footer.
                 */
                footer: {
                  attribute: "footer",
                  type: Boolean,
                },

                /**
                 * Display first column as a row header.
                 */
                rowHeader: {
                  attribute: "row-header",
                  type: Boolean,
                },
              }
            );
          },
        },
      ]);

      function _class() {
        var _this;

        _classCallCheck(this, _class);

        _this = _possibleConstructorReturn(
          this,
          _getPrototypeOf(_class).call(this)
        );
        _this.columnHeader = false;
        _this.downloadable = false;
        _this.data = [];
        _this.filter = false;
        _this.footer = false;
        _this.rowHeader = false;
        _this.sort = false;
        _this.dataCsv = undefined;
        Object.keys(displayProperties).forEach(function (key) {
          _this[key] = false;
        });

        _this.fetchData();

        return _this;
      }

      _createClass(_class, [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            var _this2 = this;

            _get(
              _getPrototypeOf(_class.prototype),
              "connectedCallback",
              this
            ).call(this);

            this.fetchData();
            setTimeout(function () {
              if (!_this2.dataCsv) _this2.loadSlottedTable();
              _this2.__ready = true;
            }, 0);
          },
        },
        {
          key: "firstUpdated",
          value: function firstUpdated(changedProperties) {
            if (_get(_getPrototypeOf(_class.prototype), "firstUpdated", this))
              _get(
                _getPrototypeOf(_class.prototype),
                "firstUpdated",
                this
              ).call(this, changedProperties);
            this.fetchData();
          },
        },
        {
          key: "updated",
          value: function updated(changedProperties) {
            var _this3 = this;

            if (_get(_getPrototypeOf(_class.prototype), "updated", this))
              _get(_getPrototypeOf(_class.prototype), "updated", this).call(
                this,
                changedProperties
              );
            changedProperties.forEach(function (oldValue, propName) {
              if (propName === "dataCsv") _this3.fetchData();
              if (propName === "csvData") _this3._loadExternalData();
              if (propName === "striped" && _this3.striped)
                _this3.columnStriped = false;
              if (propName === "columnStriped" && _this3.columnStriped)
                _this3.striped = false;
              if (propName == "data")
                _this3._dataChanged(_this3.data, oldValue);
            });
          },
          /**
           * Rows in <thead>
           */
        },
        {
          key: "CSVtoArray",

          /**
           * converts csv string to array
           * @param {string} text CSV string
           * @returns {array} a multidimensional table array
           * Mix of solutions from https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data
           */
          value: function CSVtoArray(text) {
            var p = "",
              row = [""],
              ret = [row],
              i = 0,
              r = 0,
              s = !0,
              l;

            for (l in text) {
              l = text[l];

              if ('"' === l) {
                if (s && l === p) row[i] += l;
                s = !s;
              } else if ("," === l && s) l = row[++i] = "";
              else if ("\n" === l && s) {
                if ("\r" === p) row[i] = row[i].slice(0, -1);
                row = ret[++r] = [(l = "")];
                i = 0;
              } else row[i] += l;

              p = l;
            }

            return ret;
          },
          /**
           * gets table CSV as download
           * @param {string} the title of the media
           */
        },
        {
          key: "download",
          value: function download() {
            var a = document.createElement("a"),
              title =
                this.downloadable && this.caption.trim() != ""
                  ? "Table as CSV"
                  : "".concat(this.caption, " CSV"),
              filename = title.replace(/[^\w\d]/g, ""),
              data = this.getTableCSV();
            a.setAttribute(
              "href",
              "data:text/plain;charset=UTF-8," + encodeURIComponent(data)
            );
            a.setAttribute("download", filename + ".txt");
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            /**
             * Fires when transcript is printed
             * @event csv-downloaded
             */

            this.dispatchEvent(
              new CustomEvent("csv-downloaded", {
                bubbles: true,
                composed: true,
                cancelable: false,
                detail: {
                  table: this,
                  data: data,
                  filename: filename,
                },
              })
            );
          },
          /**
           * prints the active transcript
           * @param {string} the title of the media
           */
        },
        {
          key: "print",
          value: function print() {
            var table = !this.shadowRoot
                ? false
                : this.shadowRoot.querySelector("table"),
              print = !table
                ? false
                : window.open(
                    "",
                    "",
                    "left=0,top=0,width=552,height=477,toolbar=0,scrollbars=0,status =0"
                  );

            if (print) {
              print.document.head.innerHTML += "<style>\n          ".concat(
                editableTableDisplayStyles
                  .map(function (s) {
                    return s.cssText.replace(/:host/g, "table");
                  })
                  .join(" "),
                "\n          table {\n            -webkit-print-color-adjust: exact !important;\n            color-adjust: exact !important;\n          }\n        </style>"
              );
              print.document.body.innerHTML = this.getTableHTML(true);
              print.document.close();
              print.focus();
              print.print();
              print.close();
            }
            /**
             * Fires when transcript is printed
             * @event transcript-printed
             */

            this.dispatchEvent(
              new CustomEvent("table-printed", {
                bubbles: true,
                composed: true,
                cancelable: false,
                detail: this,
              })
            );
          },
          /**
           * fetches data from a csv file
           *
           */
        },
        {
          key: "fetchData",
          value: function fetchData() {
            var _this4 = this;

            if (this.dataCsv && this.dataCsv !== "")
              fetch(this.dataCsv)
                .then(function (response) {
                  return response.text();
                })
                .then(function (data) {
                  _this4.csvData = data;
                })
                ["catch"](function (err) {
                  _this4.loadSlottedTable();
                });
          },
          /**
           * Return table data as plain CSV
           * @returns {string} for CSV
           */
        },
        {
          key: "getTableCSV",
          value: function getTableCSV() {
            var _this5 = this;

            return this.data
              .map(function (row) {
                return row
                  .map(function (cell) {
                    cell = _this5._replaceBlankCell(cell);
                    return _this5._isNumericCell(cell)
                      ? cell.replace(/,/g, "")
                      : '"'.concat(cell.replace(/"/g, '""'), '"');
                  })
                  .join(",");
              })
              .join("\n");
          },
          /**
           * converts str string into HTML
           *
           * @param {string} str html as string
           * @returns {html}
           */
        },
        {
          key: "getHTML",
          value: function getHTML() {
            var str =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : " ";
            this.__tempDiv =
              this.__tempDiv || document.createElement("template");
            this.__tempDiv.innerHTML = str;

            var temp = this.__tempDiv.content.cloneNode(true);

            return temp;
          },
          /**
           * Return table as plain HTML
           * @returns {string} HTML for table
           */
        },
        {
          key: "getTableHTML",
          value: function getTableHTML() {
            var _this6 = this;

            var addStyleClasses =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : false;
            var headers = [],
              body = [],
              footer = [];

            var getTR = function getTR(tr) {
              var open =
                arguments.length > 1 && arguments[1] !== undefined
                  ? arguments[1]
                  : "td";
              var close =
                arguments.length > 2 && arguments[2] !== undefined
                  ? arguments[2]
                  : "td";
              var type =
                arguments.length > 3 && arguments[3] !== undefined
                  ? arguments[3]
                  : "tbody";
              var th = _this6.rowHeader ? tr.slice(0, 1) : [],
                td = _this6.rowHeader ? tr.slice(1) : tr;
              return "\n\t\t<tr"
                .concat(
                  !addStyleClasses ? "" : ' class="'.concat(type, '-tr tr"'),
                  ">"
                )
                .concat(
                  th
                    .map(function (cell) {
                      return '\n\t\t\t<th scope="row"'
                        .concat(
                          !addStyleClasses
                            ? ""
                            : ' class="'.concat(close, ' th-or-td"'),
                          ">"
                        )
                        .concat(_this6._replaceBlankCell(cell), "</th>");
                    })
                    .join("")
                )
                .concat(
                  td
                    .map(function (cell) {
                      return "\n\t\t\t<"
                        .concat(open)
                        .concat(
                          !addStyleClasses
                            ? ""
                            : ' class="'.concat(close, ' th-or-td"'),
                          ">"
                        )
                        .concat(_this6._replaceBlankCell(cell), "</")
                        .concat(close, ">");
                    })
                    .join(""),
                  "\n\t\t</tr>"
                );
            };

            if (this.thead) {
              headers = this.thead.map(function (tr) {
                return getTR(tr, 'th scope="col"', "th", "thead");
              });
            }

            if (this.tbody) {
              body = this.tbody.map(function (tr) {
                return getTR(tr);
              });
            }

            if (this.tfoot) {
              footer = this.tfoot.map(function (tr) {
                return getTR(tr, "td", "td", "tfoot");
              });
            }

            var props = this.getTableProperties();
            var attr = "";
            Object.keys(this.getTableProperties()).forEach(function (i) {
              if (props[i] && Object.keys(displayProperties).includes(i)) {
                var kebabize = function kebabize(str) {
                  return str
                    .split("")
                    .map(function (letter, idx) {
                      return letter.toUpperCase() === letter
                        ? ""
                            .concat(idx !== 0 ? "-" : "")
                            .concat(letter.toLowerCase())
                        : letter;
                    })
                    .join("");
                };

                attr += "".concat(kebabize(i), " ");
              }
            });
            return [
              "<table ".concat(attr, ">"),
              this.caption !== "" &&
              this.caption !== null &&
              this.caption !== "null"
                ? "\n\t<caption"
                    .concat(
                      !addStyleClasses ? "" : ' class="caption"',
                      ">\n\t\t"
                    )
                    .concat(this.caption, "\n\t</caption>")
                : "",
              headers.length > 0
                ? "\n\t<thead"
                    .concat(!addStyleClasses ? "" : ' class="thead"', '">')
                    .concat(headers.join(""), "\n\t</thead>")
                : "",
              body.length > 0
                ? "\n\t<tbody"
                    .concat(!addStyleClasses ? "" : ' class="tbody"', ">")
                    .concat(body.join(""), "\n\t</tbody>")
                : "",
              footer.length > 0
                ? "\n\t<tfoot"
                    .concat(!addStyleClasses ? "" : ' class="tfoot"', ">")
                    .concat(footer.join(""), "\n\t</tfoot>")
                : "",
              "\n</table>",
            ].join("");
          },
          /**
           * return HTML object of table data
           * @returns {object} HTML object for managed table
           */
        },
        {
          key: "getTableHTMLNode",
          value: function getTableHTMLNode() {
            var n = document.createElement("editable-table-display"); // replicate values that we had previously so they get reflected back into DOM

            var props = this.getTableProperties();

            for (var i in props) {
              n[i] = props[i];
            }

            n.innerHTML = this.getTableHTML();
            return n;
          },
          /**
           * Return table data and configuration
           * @returns {object} an object with all table data and configurations
           */
        },
        {
          key: "getTableProperties",
          value: function getTableProperties() {
            var data = {
              bordered: !this.hideBordered && this.bordered,
              caption: this.caption,
              columnHeader: this.columnHeader,
              columnStriped: this.columnStriped,
              condensed: !this.hideCondensed && this.condensed,
              data: this.data,
              downloadable: this.downloadable,
              filter: !this.hideFilter && this.filter,
              footer: this.footer,
              numericStyles: this.numericStyles,
              printable: this.printable,
              rowHeader: this.rowHeader,
              responsive: !this.hideResponsive && this.responsive,
              sort: !this.hideSort && this.sort,
              striped: !this.hideStriped && this.striped,
              summary: this.summary,
            };
            return data;
          },
          /**
           * imports table HTML as data
           * @param {HTMLElement} table table element
           */
        },
        {
          key: "importHTML",
          value: function importHTML(table) {
            var _this7 = this;

            var spans = [],
              data = _toConsumableArray(table.querySelectorAll("tr")).map(
                function (row, rownum) {
                  return _toConsumableArray(row.querySelectorAll("th,td")).map(
                    function (cell, colnum) {
                      var celltype = cell.matches("th") ? "th" : "td",
                        colspan = cell.matches("[colspan]")
                          ? cell.getAttribute("colspan")
                          : false,
                        rowspan = cell.matches("[rowspan]")
                          ? cell.getAttribute("rowspan")
                          : false;

                      if (colspan || rowspan) {
                        spans.push({
                          type: celltype,
                          row: rownum,
                          col: colnum,
                          rows:
                            rowspan && rowspan.trim() !== ""
                              ? parseInt(rowspan.trim())
                              : undefined,
                          cols:
                            colspan && colspan.trim() !== ""
                              ? parseInt(colspan.trim())
                              : undefined,
                        });
                      }

                      return typeof cell.innerHTML === "string"
                        ? cell.innerHTML.trim()
                        : cell.innerHTML;
                    }
                  );
                }
              ); //removes colspans and row spans

            spans.forEach(function (span) {
              if (span.cols)
                for (var i = 1; i < span.cols; i++) {
                  data[span.row].splice(span.col + 1, 0, "&nbsp;");
                }
              if (span.rows)
                for (var _i = 1; _i < span.rows; _i++) {
                  data[span.row + 1].splice(span.col, 0, "&nbsp;");
                }
            });
            if (data.length > 0 && data[0].length > 0) this.data = data;
            this.columnHeader =
              this.columnHeader || table.querySelectorAll("thead").length > 0;
            this.rowHeader =
              this.rowHeader || table.querySelectorAll("tbody th").length > 0;
            this.footer =
              this.footer || table.querySelectorAll("tfoot").length > 0;
            this.caption =
              table.querySelectorAll("caption").length > 0
                ? table.querySelector("caption").innerHTML.trim()
                : undefined;
            Object.keys(displayProperties).forEach(function (key) {
              if (
                table.matches(
                  ".".concat(displayProperties[key].attribute || key)
                )
              )
                _this7[key] = true;
            });
          },
          /**
           * loads table data from slotted HTML
           *
           * @memberof EditableTable
           */
        },
        {
          key: "loadSlottedTable",
          value: function loadSlottedTable() {
            var table = this.children.item(0); // support wrapping editable-table-display tag or primative

            if (table && table.tagName === "EDITABLE-TABLE-DISPLAY") {
              table = table.children.item(0);
            }

            if (
              !!table &&
              table.tagName === "TABLE" &&
              table.children &&
              table.children.length > 0
            ) {
              this.importHTML(table);
            }
          },
          /**
           * Fires when data changed
           * @event change
           * @param {event} event
           */
        },
        {
          key: "_dataChanged",
          value: function _dataChanged(newValue, oldValue) {},
          /*if (
          this.__ready &&
          (!newValue || newValue.length < 1 || newValue[0].length < 1)
        ) {
          this.loadSlottedTable();
        }*/

          /**
           * Sets a cell's negative number style
           * @param {string} cell cell contents
           * @returns {boolean} whether cell contents are numeric and negative
           */
        },
        {
          key: "_isNegative",
          value: function _isNegative(cell) {
            return this._isNumericCell(cell) && cell.trim().indexOf("-") === 0;
          },
          /**
           * Sets a cell's numeric style
           * @param {string} cell cell contents
           * @returns {boolean} whether cell contents are numeric
           */
        },
        {
          key: "_isNumericCell",
          value: function _isNumericCell(cell) {
            return !!cell && !isNaN(cell.trim().replace(/\$/g, ""));
          },
          /**
           * Determines if an entire body column dontains numeric data
           * @param {number} index column index
           * @returns {boolean} if columns contents are numeric
           */
        },
        {
          key: "_isNumericColumn",
          value: function _isNumericColumn(index) {
            var numeric = true;

            for (var i = 0; i < this.tbody.length; i++) {
              if (!this._isNumericCell(this.tbody[i][index])) numeric = false;
            }

            return numeric;
          },
          /**
           * Hides a row if filtered
           *
           * @param {array} tr array of cells
           * @returns {boolean} whether row is filtered
           * @memberof EditableTableDisplay
           */
        },
        {
          key: "_isRowFiltered",
          value: function _isRowFiltered(tr) {
            var filter = (this.filterText || "").trim(),
              cellText =
                this.filterColumn && tr ? tr[this.filterColumn].trim() : "",
              filtered;

            if (!this.filterCaseSensitive) {
              filter = filter.toLowerCase();
              cellText = cellText.toLowerCase();
            }

            filtered = this.filterContains
              ? !cellText.match(filter)
              : cellText !== filter;
            return filtered;
          },
          /**
           * Calculates whether cell is a `<th>` or `<td>`
           * @param {boolean} rowHeader if cell is a rowheader
           * @param {number} index current column number
           * @returns {boolean} whether cell is a `<th>` or `<td>`
           */
        },
        {
          key: "_isRowHeader",
          value: function _isRowHeader(rowHeader, index) {
            return index === 0 && rowHeader;
          },
          /**
           * Convert from csv text to an array in table function
           */
        },
        {
          key: "_loadExternalData",
          value: function _loadExternalData(e) {
            var data = this.CSVtoArray(this.csvData);
            if (data.length > 0 && data[0].length > 0) this.data = data;
            this.columnHeader = true;
          },
          /**
           * replaces a blank cell with "-" for accessibility
           * @param {string} cell cell contents
           * @returns {string} cell contents or "-" if empty
           */
        },
        {
          key: "_replaceBlankCell",
          value: function _replaceBlankCell(cell) {
            return String(cell).trim() === "" ? "-" : cell;
          },
        },
        {
          key: "thead",
          get: function get() {
            return this.columnHeader ? (this.data || []).slice(0, 1) : [];
          },
          /**
           * Rows in <tbody>
           */
        },
        {
          key: "tbody",
          get: function get() {
            return (this.data || []).slice(
              this.columnHeader ? 1 : 0,
              this.footer
                ? (this.data || []).length - 1
                : (this.data || []).length
            );
          },
          /**
           * Rows in <tfoot>
           */
        },
        {
          key: "tfoot",
          get: function get() {
            return this.footer
              ? (this.data || []).slice((this.data || []).length - 1)
              : [];
          },
        },
      ]);

      return _class;
    })(SuperClass)
  );
};
/**
 * behaviors needed for table cells, row headers, and columns
 * @class
 * @customElement
 */

exports.displayBehaviors = displayBehaviors;

var cellBehaviors = function cellBehaviors(SuperClass) {
  return (
    /*#__PURE__*/
    (function (_SuperClass2) {
      _inherits(_class2, _SuperClass2);

      function _class2() {
        _classCallCheck(this, _class2);

        return _possibleConstructorReturn(
          this,
          _getPrototypeOf(_class2).apply(this, arguments)
        );
      }

      _createClass(_class2, [
        {
          key: "_getLabel",

          /**
           * Get row or column label
           * @param {number} index of row or column
           * @param  {boolean} whenther it's a row
           * @returns {string} a row number or a column letter
           */
          value: function _getLabel(index, row) {
            if (row) {
              return index + 1;
            } else {
              var numerals = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
                results = this._getLetter(index).split("-").reverse(),
                label = "";

              for (var i = 0; i < results.length; i++) {
                if (results[i] !== "") label += numerals[results[i]];
              }

              return label;
            }
          },
          /**
           * Converts index to a letter.
           * @param {number} index of row or column
           * @returns {string} a column letter
           */
        },
        {
          key: "_getLetter",
          value: function _getLetter(index) {
            var place = Math.floor(index / 26),
              multiplier = 26 * place,
              remainder = index - multiplier,
              letters = "";
            letters += remainder + "-";

            if (place > 0 && place < 26) {
              letters += place - 1 + "-";
            } else if (place >= 26) {
              letters += this._getLetter(place - 1);
            }

            return letters;
          },
        },
      ]);

      return _class2;
    })(SuperClass)
  );
};

exports.cellBehaviors = cellBehaviors;

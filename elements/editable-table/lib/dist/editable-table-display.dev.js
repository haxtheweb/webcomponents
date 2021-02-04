"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.EditableTableDisplay = void 0;

var _litElement = require("lit-element/lit-element.js");

var _editableTableBehaviors = require("./editable-table-behaviors.js");

var _responsiveUtilityBehaviors = require("@lrnwebcomponents/responsive-utility/lib/responsive-utility-behaviors.js");

require("@lrnwebcomponents/simple-picker/simple-picker.js");

function _templateObject11() {
  var data = _taggedTemplateLiteral([
    '<span class="cell"\n            >',
    "</span\n          >",
  ]);

  _templateObject11 = function _templateObject11() {
    return data;
  };

  return data;
}

function _templateObject10() {
  var data = _taggedTemplateLiteral([
    '\n            <editable-table-filter\n              class="cell"\n              column-index="',
    '"\n              ?filtered="',
    '"\n            >\n              ',
    "\n            </editable-table-filter>\n          ",
  ]);

  _templateObject10 = function _templateObject10() {
    return data;
  };

  return data;
}

function _templateObject9() {
  var data = _taggedTemplateLiteral([
    '<td\n      class="td th-or-td"\n      cell-index="',
    '"\n      ?numeric="',
    '"\n      ?negative="',
    '"\n      ?xs-hidden="',
    '"\n    >\n      ',
    "\n    </td>",
  ]);

  _templateObject9 = function _templateObject9() {
    return data;
  };

  return data;
}

function _templateObject8() {
  var data = _taggedTemplateLiteral([
    '<th\n      class="th th-or-td"\n      cell-index="',
    '"\n      ?numeric="',
    '"\n      scope="row"\n      ?xs-hidden="',
    '"\n    >\n      ',
    "\n    </th>",
  ]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  var data = _taggedTemplateLiteral([
    '\n      <tr class="tr ',
    '">\n        ',
    "\n      </tr>\n    ",
  ]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

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

function _templateObject6() {
  var data = _taggedTemplateLiteral([
    '\n              <tfoot class="tfoot">\n                ',
    "\n              </tfoot>\n            ",
  ]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral([
    '\n                        <editable-table-sort\n                          column-index="',
    '"\n                          sort-column="',
    '"\n                        >\n                          ',
    "\n                        </editable-table-sort>\n                      ",
  ]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral([
    '\n                <th\n                  class="th th-or-td"\n                  cell-index="',
    '"\n                  ?numeric="',
    '"\n                  scope="col"\n                  ?xs-hidden="',
    '"\n                >\n                  ',
    "\n                </th>\n              ",
  ]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    '\n                  <button id="print" @click="',
    '">\n                    <span class="sr-only">Print table.</span>\n                    <simple-icon-lite icon="print"></simple-icon-lite>\n                  </button>\n                  <simple-tooltip\n                    id="print-tooltip"\n                    for="print"\n                    aria-hidden="true"\n                    >Print table.\n                  </simple-tooltip>\n                ',
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n                  <button id="download" @click="',
    '">\n                    <span class="sr-only">Download as CSV.</span>\n                    <simple-icon-lite icon="file-download"></simple-icon-lite>\n                  </button>\n                  <simple-tooltip\n                    id="download-tooltip"\n                    for="download"\n                    aria-hidden="true"\n                    >Download as CSV.\n                  </simple-tooltip>\n                ',
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '\n      <table\n        id="table"\n        ?bordered="',
    '"\n        class="table"\n        ?column-header="',
    '"\n        ?column-striped="',
    '"\n        ?condensed="',
    '"\n        ?filter="',
    '"\n        ?footer="',
    '"\n        ?hidden="',
    '"\n        ?numeric-styles="',
    '"\n        ?row-header="',
    '"\n        ?sort="',
    '"\n        ?striped="',
    '"\n      >\n        <caption>\n          <div>\n            <div>',
    '</div>\n            <simple-picker\n              id="column"\n              align-right\n              aria-label="Select Column"\n              @change="',
    '"\n              hide-sample\n              .options="',
    '"\n              .value="',
    '"\n            >\n            </simple-picker>\n            ',
    "\n            ",
    '\n          </div>\n        </caption>\n        <thead ?hidden="',
    '" class="thead">\n          <tr class="tr thead-tr">\n            ',
    '\n          </tr>\n        </thead>\n        <tbody class="tbody">\n          ',
    "\n        </tbody>\n        ",
    '\n      </table>\n      <div id="htmlImport" hidden><slot></slot></div>\n    ',
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
 * `editable-table-display`
 * `An editor interface for editable-table
 *
 * @demo ./demo/editor.html
 * @customElement
 * @extends displayBehaviors
 * @extends editableTableDisplayStyles
 * @extends ResponsiveUtilityBehaviors
 * @extends LitElement
 */
var EditableTableDisplay =
  /*#__PURE__*/
  (function (_displayBehaviors) {
    _inherits(EditableTableDisplay, _displayBehaviors);

    _createClass(
      EditableTableDisplay,
      [
        {
          key: "render",
          value: function render() {
            var _this2 = this;

            return (0, _litElement.html)(
              _templateObject(),
              this.bordered,
              this.columnHeader,
              this.columnStriped,
              this.condensed,
              this.filter,
              this.footer,
              this.hidden,
              this.numericStyles,
              this.rowHeader,
              this.sort,
              this.striped,
              this.getHTML(this.caption),
              this._selectedChanged,
              this.options,
              this.selected,
              !this.downloadable
                ? ""
                : (0, _litElement.html)(_templateObject2(), this.download),
              !this.printable
                ? ""
                : (0, _litElement.html)(_templateObject3(), this.print),
              !this.columnHeader,
              (this.thead[0] || []).map(function (th, index) {
                return (0,
                _litElement.html)(_templateObject4(), index, _this2._isNumericColumn(index), _this2._isColHidden(index, 1), !_this2.sort ? _this2.getHTML(_this2._replaceBlankCell(th)) : (0, _litElement.html)(_templateObject5(), index, _this2.sortColumn, _this2.getHTML(_this2._replaceBlankCell(th))));
              }),
              this.tbody.map(function (tr) {
                return _this2._isRowFiltered(tr) ? "" : _this2._tbodyTr(tr);
              }),
              !this.footer
                ? ""
                : (0, _litElement.html)(
                    _templateObject6(),
                    this._tbodyTr(this.tfoot[0], true, true)
                  )
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
                _get(_getPrototypeOf(EditableTableDisplay), "styles", this) ||
                  []
              ),
              _toConsumableArray(
                _editableTableBehaviors.editableTableDisplayStyles
              )
            );
          },
        },
        {
          key: "haxProperties",
          get: function get() {
            return {
              type: "element",
              editingElement: {
                tag: "editable-table",
                import: "@lrnwebcomponents/editable-table/editable-table.js",
              },
              canScale: true,
              canPosition: true,
              canEditSource: true,
              gizmo: {
                title: "Enhanced table",
                description: "A table for displaying data",
                icon: "image:grid-on",
                color: "blue-grey",
                groups: ["Content", "Table", "Data"],
                meta: {
                  author: "ELMS:LN",
                },
              },
              settings: {
                configure: [],
                advanced: [],
              },
              demoSchema: [
                {
                  tag: "editable-table-display",
                  content:
                    "<table striped><tr><td>-</td><td>-</td><td>-</td></tr><tr><td>-</td><td>-</td><td>-</td></tr><tr><td>-</td><td>-</td><td>-</td></tr></table>",
                  properties: {},
                },
              ],
            };
          },
        },
        {
          key: "tag",
          get: function get() {
            return "editable-table-display";
          },
        },
        {
          key: "properties",
          get: function get() {
            return _objectSpread(
              {},
              _editableTableBehaviors.displayBehaviors.properties,
              {},
              _responsiveUtilityBehaviors.ResponsiveUtilityBehaviors.properties,
              {
                /**
                 * Index of current filter column
                 */
                filterColumn: {
                  type: Number,
                  attribute: "filter-column",
                },

                /**
                 * whether column only needs to contain filter text
                 * instead of default requiriwhich requires an exact match
                 */
                filterContains: {
                  type: Boolean,
                  attribute: "filter-contains",
                },

                /**
                 * whether filter is case sensitive
                 */
                filterCaseSensitive: {
                  type: Boolean,
                  attribute: "filter-case-sensitive",
                },

                /**
                 * Whether table is filtered
                 */
                filtered: {
                  type: Boolean,
                },

                /**
                 * Text for Filtering
                 */
                filterText: {
                  type: String,
                  attribute: "filter-text",
                },

                /**
                 * Selected column to display when in responsive mode
                 */
                selected: {
                  type: Number,
                },

                /**
                 * Sort mode: ascending, descending or none
                 */
                sortMode: {
                  type: String,
                  attribute: "sort-mode",
                },

                /**
                 * Index of current sort column
                 */
                sortColumn: {
                  type: Number,
                  attribute: "sort-column",
                },
              }
            );
          },
        },
      ]
    );

    function EditableTableDisplay() {
      var _this;

      _classCallCheck(this, EditableTableDisplay);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(EditableTableDisplay).call(this)
      );
      _this.selected = 1;
      _this.sortMode = "none";
      _this.sortColumn = -1;
      _this.filterContains = true;
      Promise.resolve().then(function () {
        return _interopRequireWildcard(require("./editable-table-sort.js"));
      });
      Promise.resolve().then(function () {
        return _interopRequireWildcard(require("./editable-table-filter.js"));
      });
      return _this;
    }

    _createClass(EditableTableDisplay, [
      {
        key: "connectedCallback",
        value: function connectedCallback() {
          var _this3 = this;

          _get(
            _getPrototypeOf(EditableTableDisplay.prototype),
            "connectedCallback",
            this
          ).call(this);

          setTimeout(function () {
            _this3.addEventListener(
              "change-sort-mode",
              _this3._changeSortMode.bind(_this3)
            );

            _this3.addEventListener(
              "toggle-filter",
              _this3.toggleFilter.bind(_this3)
            );
          }, 0);
        },
      },
      {
        key: "disconnectedCallback",
        value: function disconnectedCallback() {
          this.removeEventListener(
            "change-sort-mode",
            this._changeSortMode.bind(this)
          );
          this.removeEventListener(
            "toggle-filter",
            this.toggleFilter.bind(this)
          );

          _get(
            _getPrototypeOf(EditableTableDisplay.prototype),
            "disconnectedCallback",
            this
          ).call(this);
        },
        /**
         *
         * Hides table if it has no data
         * @readonly
         * @memberof EditableTableDisplay
         */
      },
      {
        key: "sortData",

        /**
         * initialize responsive columns menu
         *
         * @param {string} type  sort order ascending: "asc", descending: "desc", or "non"
         * @param {number} column column number
         * @memberof EditableTableDisplay
         */
        value: function sortData(type, column) {
          if (type !== "none" && type !== false) {
            var temp = this.tbody.map(function (row) {
              return [row[column]].concat(_toConsumableArray(row));
            });

            if (type === "asc") {
              temp.sort();
            } else {
              temp.reverse();
            }
          }
        },
        /**
         * Handle filter button click
         *
         * @param {event} e event
         * @memberof EditableTableDisplay
         */
      },
      {
        key: "toggleFilter",
        value: function toggleFilter(e) {
          if (
            e === undefined ||
            (this.filterColumn == e.detail.columnIndex && this.filtered)
          ) {
            this.filtered = false;
            this.filterText = undefined;
            this.filterColumn = undefined;
          } else {
            this.filterText = e.detail.innerHTML;
            this.filterColumn = e.detail.columnIndex;
            this.filtered = true;
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
        value: function _dataChanged(newValue, oldValue) {
          if (!newValue || newValue.length < 1 || newValue[0].length < 1) {
            var table = this.children.item(0);

            if (
              _typeof(table) !==
                (typeof undefined === "undefined"
                  ? "undefined"
                  : _typeof(undefined)) &&
              table !== null &&
              table.tagName === "TABLE"
            ) {
              this.importHTML(table);
            }
          }

          this.dispatchEvent(
            new CustomEvent("change", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: newValue,
            })
          );
        },
        /**
         * Handles sort button click
         * @param {event} e event
         */
      },
      {
        key: "_changeSortMode",
        value: function _changeSortMode(e) {
          if (
            this.sortColumn === e.detail.columnIndex &&
            this.sortMode === "asc"
          ) {
            this.sortMode = "desc";
          } else if (
            this.sortColumn === e.detail.columnIndex &&
            this.sortMode === "desc"
          ) {
            this.sortMode = "none";
          } else {
            this.sortMode = "asc";
            this.sortColumn = e.detail.columnIndex;
          }

          e.detail.setSortMode(this.sortMode);
        },
        /**
         * Determines whether or not a cell is hidden in responsive mode
         * @param {number} index current column number
         * @param {number} selected selected column number
         * @returns {boolean} whether column is hidden (i.e. not selected column)
         */
      },
      {
        key: "_isColHidden",
        value: function _isColHidden(index) {
          var selected =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : 1;
          selected = selected || 1;
          return (
            parseInt(index) !== 0 && parseInt(index) !== parseInt(selected)
          );
        },
        /**
         * Sets a column's cells to filtered when in filtered mode so that filter can toggle
         * @param {number} index current column number
         * @param {number} selected filtered column number
         * @param {boolean} filtered is table in filtered mode
         * @returns {boolean} whether column is filtered
         */
      },
      {
        key: "_isCellFiltered",
        value: function _isCellFiltered(column, filterColumn, filtered) {
          return !!filterColumn && filterColumn === column && filtered;
        },
        /**
         * Handles column  selector change
         */
      },
      {
        key: "_selectedChanged",
        value: function _selectedChanged() {
          this._updateCols();
        },
        /**
         * Handles table change
         */
      },
      {
        key: "_tableChanged",
        value: function _tableChanged() {
          this._updateCols();
        },
        /**
         * table row template
         *
         * @param {array} [row=[]] array of cells
         * @param {boolean} [noFilter=false] has filter buttons
         * @param {boolean} [tfoot=false] is a footer row
         * @returns {html}
         * @memberof EditableTableDisplay
         */
      },
      {
        key: "_tbodyTr",
        value: function _tbodyTr() {
          var _this4 = this;

          var row =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : [];
          var noFilter =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : false;
          var tfoot =
            arguments.length > 2 && arguments[2] !== undefined
              ? arguments[2]
              : false;
          return (0, _litElement.html)(
            _templateObject7(),
            tfoot ? "tfoot-tr" : "tbody-tr",
            row.map(function (cell, index) {
              return _this4._isRowHeader(_this4.rowHeader, index)
                ? _this4._tbodyTh(cell, index)
                : _this4._tbodyTd(cell, index, noFilter);
            })
          );
        },
        /**
         * table header template
         *
         * @param {string} cell cell contents
         * @param {number} index column number
         * @returns {html}
         * @memberof EditableTableDisplay
         */
      },
      {
        key: "_tbodyTh",
        value: function _tbodyTh(cell, index) {
          return (0, _litElement.html)(
            _templateObject8(),
            index,
            this._isNumericColumn(index),
            this._isColHidden(index, 1),
            this.getHTML(this._replaceBlankCell(cell))
          );
        },
        /**
         * table cell template
         *
         * @param {*} cell cell contents
         * @param {*} index column number
         * @param {boolean} [noFilter=false] whether to include a filter button
         * @returns {html}
         * @memberof EditableTableDisplay
         */
      },
      {
        key: "_tbodyTd",
        value: function _tbodyTd(cell, index) {
          var noFilter =
            arguments.length > 2 && arguments[2] !== undefined
              ? arguments[2]
              : false;
          return (0, _litElement.html)(
            _templateObject9(),
            index,
            this._isNumericColumn(index),
            this._isNegative(cell),
            this._isColHidden(index, 1),
            this.filter
              ? (0, _litElement.html)(
                  _templateObject10(),
                  index,
                  this._isCellFiltered(index, this.filterColumn, this.filtered),
                  this.getHTML(this._replaceBlankCell(cell))
                )
              : !noFilter
              ? (0, _litElement.html)(
                  _templateObject11(),
                  this.getHTML(this._replaceBlankCell(cell))
                )
              : this.getHTML(this._replaceBlankCell(cell))
          );
        },
        /**
         * update responsive columns menu
         */
      },
      {
        key: "_updateCols",
        value: function _updateCols() {
          var selected = this.shadowRoot.querySelector("#column").value,
            cols = this.shadowRoot
              .querySelector("#table")
              .querySelectorAll("th,td");

          if (cols.length > 0) {
            for (var i = 0; i < cols.length; i++) {
              var col = cols[i];

              if (this._isColHidden(col.cellIndex, selected)) {
                col.setAttribute("xs-hidden", true);
              } else {
                col.removeAttribute("xs-hidden");
              }
            }
          }
        },
      },
      {
        key: "hidden",
        get: function get() {
          return !this.data || this.data.length < 1 || this.data[0].length < 1;
        },
        /**
         *
         * Gets columns in `<thead>`
         * @readonly
         * @memberof EditableTableDisplay
         */
      },
      {
        key: "options",
        get: function get() {
          var head = this.thead || [[]],
            cols = (head[0] || []).map(function (th, i) {
              return [
                {
                  alt: th,
                  value: i,
                },
              ];
            });
          return cols;
        },
      },
    ]);

    return EditableTableDisplay;
  })(
    (0, _editableTableBehaviors.displayBehaviors)(
      (0, _responsiveUtilityBehaviors.ResponsiveUtilityBehaviors)(
        _litElement.LitElement
      )
    )
  );

exports.EditableTableDisplay = EditableTableDisplay;
window.customElements.define(EditableTableDisplay.tag, EditableTableDisplay);

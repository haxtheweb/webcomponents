"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.EditableTable = void 0;

var _litElement = require("lit-element/lit-element.js");

var _editableTableBehaviors = require("./lib/editable-table-behaviors.js");

require("@lrnwebcomponents/rich-text-editor/rich-text-editor.js");

require("@lrnwebcomponents/rich-text-editor/lib/toolbars/rich-text-editor-toolbar-mini.js");

require("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icons.js");

require("@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js");

require("./lib/editable-table-editor-rowcol.js");

require("./lib/editable-table-editor-toggle.js");

require("./lib/editable-table-display.js");

var _utils = require("@lrnwebcomponents/utils/utils.js");

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

function _templateObject5() {
  var data = _taggedTemplateLiteral([
    '\n        :host {\n          --paper-listbox-background-color: var(\n            --editable-table-rowcol-bg-color\n          );\n        }\n        .filter-icon,\n        .sortable-icon {\n          display: none;\n          opacity: 0.4;\n          width: 24px;\n          height: 24px;\n        }\n        :host([sort]) tbody .tr:first-child .sortable-icon,\n        :host([filter]) tbody .tr:not(:first-of-type) .filter-icon {\n          display: inline-block;\n          opacity: 0.25;\n        }\n        table {\n          min-width: calc(100% - 2.3px);\n          width: unset;\n          height: 1px;\n        }\n        caption {\n          width: 100%;\n          padding: 0;\n          margin: 0;\n          color: var(\n            --editable-table-caption-color,\n            var(--editable-table-color, #222)\n          );\n        }\n        table *:focus,\n        table *:hover,\n        table *:focus-within {\n          z-index: 2;\n        }\n        caption,\n        .th-or-td {\n          border: 1px solid #ddd;\n        }\n        label,\n        .label {\n          color: var(--editable-table-secondary-text-color, #444);\n          font-size: var(--editable-table-secondary-font-size, 12px);\n          font-family: var(\n            --editable-table-secondary-font-family,\n            "Roboto",\n            "Noto",\n            sans-serif\n          );\n        }\n        .field-group {\n          width: 100%;\n          padding: 0;\n          margin: 0;\n          transition: all 2s;\n          color: var(\n            --editable-table-caption-color,\n            var(--editable-table-color, #222)\n          );\n        }\n        .field-group:not([hidden]) {\n          display: flex;\n          flex-wrap: wrap;\n          justify-content: space-between;\n          align-items: center;\n        }\n        caption > *,\n        .field-group > * {\n          margin: 0 2.5px;\n        }\n        caption {\n          position: relative;\n        }\n        .field-group .field-group {\n          width: unset;\n        }\n        th {\n          padding: 0;\n          border-width: var(--editable-table-border-width, 1px);\n          border-style: var(--editable-table-border-style, solid);\n          border-color: var(--editable-table-border-color, #999);\n        }\n        td {\n          margin: 0;\n          padding: 0;\n          position: relative;\n        }\n        rich-text-editor-toolbar-mini {\n          position: absolute;\n          min-width: 200px;\n          height: 0;\n        }\n        rich-text-editor {\n          margin-bottom: 1px;\n          padding: var(--editable-table-row-vertical-padding, 10px)\n            var(--editable-table-row-horizontal-padding, 6px);\n          border: none !important;\n          --rich-text-editor-min-height: 12px;\n        }\n        td #icons {\n          position: absolute;\n          right: 0;\n          top: calc(50% - 12px);\n          width: 24px;\n        }\n        td simple-icon-lite {\n          width: 24px;\n        }\n        th:hover,\n        th:focus-within {\n          background-color: var(\n            --editable-table-rowcol-hover-bg-color,\n            var(--editable-table-heading-bg-color, #e8e8e8)\n          );\n        }\n        .th:first-child {\n          width: 96px;\n        }\n        :host([responsive]) thead th:nth-of-type(3),\n        :host([responsive]) .tr td:nth-of-type(2) {\n          border-right-width: calc(var(--editable-table-border-width) + 5px);\n          border-right-style: double;\n        }\n      ',
  ]);

  _templateObject5 = function _templateObject5() {
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

function _templateObject4() {
  var data = _taggedTemplateLiteral([
    '\n                        <td\n                          class="',
    ' th-or-td"\n                          ?negative="',
    '"\n                          ?numeric="',
    '"\n                          @click="',
    '"\n                        >\n                          <rich-text-editor\n                            autofocus\n                            @editing-disabled="',
    '"\n                            class="cell"\n                            disable-mouseover\n                            toolbar="mini"\n                            id="cell-',
    "-",
    '"\n                            label="',
    '"\n                            rawhtml="',
    '"\n                            type="rich-text-editor-toolbar"\n                          >\n                          </rich-text-editor>\n                          <div id="icons">\n                            <simple-icon-lite\n                              class="sortable-icon"\n                              icon="editable-table:sortable"\n                              aria-hidden="true"\n                            ></simple-icon-lite>\n                            <simple-icon-lite\n                              class="filter-icon"\n                              icon="editable-table:filter-off"\n                            ></simple-icon-lite>\n                          </div>\n                        </td>\n                      ',
  ]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    '\n                  <tr\n                    class="tr ',
    '"\n                  >\n                    <th scope="row">\n                      <editable-table-editor-rowcol\n                        class="cell"\n                        ?condensed="',
    '"\n                        index="',
    '"\n                        row\n                        @rowcol-action="',
    '"\n                      >\n                      </editable-table-editor-rowcol>\n                    </th>\n                    ',
    "\n                  </tr>\n                ",
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n                    <th\n                      class="col-',
    '"\n                      scope="col"\n                      ?numeric="',
    '"\n                    >\n                      <editable-table-editor-rowcol\n                        ?condensed="',
    '"\n                        index="',
    '"\n                        @rowcol-action="',
    '"\n                        @rowcol-menuopen="',
    '"\n                      >\n                      </editable-table-editor-rowcol>\n                    </th>\n                  ',
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '\n      <rich-text-editor-toolbar-mini\n        id="toolbar"\n        .config="',
    '"\n        show="selection"\n      ></rich-text-editor-toolbar-mini>\n      <editable-table-display\n        aria-hidden="',
    '"\n        ?bordered="',
    '"\n        caption="',
    '"\n        ?column-header="',
    '"\n        ?column-striped="',
    '"\n        ?condensed="',
    '"\n        ?downloadable="',
    '"\n        .data="',
    '"\n        ?filter="',
    '"\n        ?footer="',
    '"\n        ?hidden="',
    '"\n        ?numeric-styles="',
    '"\n        ?printable="',
    '"\n        ?responsive="',
    '"\n        ?row-header="',
    '"\n        ?sort="',
    '"\n        ?striped="',
    '"\n      >\n      </editable-table-display>\n      <div\n        ?hidden="',
    '"\n        aria-hidden="',
    '"\n        id="outer"\n      >\n        <div id="inner">\n          <p class="sr-only">Table Editor</p>\n          <table\n            id="table-editmode"\n            ?bordered="',
    '"\n            ?column-header="',
    '"\n            ?column-striped="',
    '"\n            ?condensed="',
    '"\n            ?downloadable="',
    '"\n            ?filter="',
    '"\n            ?footer="',
    '"\n            ?numeric-styles="',
    '"\n            ?printable="',
    '"\n            ?responsive="',
    '"\n            ?row-header="',
    '"\n            ?sort="',
    '"\n            ?striped="',
    '"\n          >\n            <caption>\n              <p class="sr-only">Edit Mode for</p>\n              <rich-text-editor\n                autofocus\n                @editing-disabled="',
    '"\n                toolbar="toolbar"\n                id="caption"\n                label="Caption"\n                placeholder="Name your table by adding a caption here."\n                rawhtml="',
    '"\n                type="rich-text-editor-toolbar-mini"\n              >\n              </rich-text-editor>\n            </caption>\n            <thead>\n              <tr class="tr">\n                <th scope="col">\n                  <span class="sr-only">Row Operations</span>\n                </th>\n                ',
    '\n              </tr>\n            </thead>\n            <tbody id="tbody" class="tbody">\n              ',
    '\n            </tbody>\n          </table>\n        </div>\n        <div class="field-group">\n          <div class="field-group">\n            <div class="label">Headers and footers</div>\n            <editable-table-editor-toggle\n              id="columnHeader"\n              icon="editable-table:column-headers"\n              label="First row has column headers."\n              @change="',
    '"\n              ?toggled="',
    '"\n            >\n            </editable-table-editor-toggle>\n            <editable-table-editor-toggle\n              id="rowHeader"\n              icon="editable-table:row-headers"\n              @change="',
    '"\n              label="First column has row headers."\n              ?toggled="',
    '"\n            >\n            </editable-table-editor-toggle>\n            <editable-table-editor-toggle\n              id="footer"\n              icon="editable-table:footer"\n              label="Last row is a footer."\n              @change="',
    '"\n              ?toggled="',
    '"\n            >\n            </editable-table-editor-toggle>\n          </div>\n          <div class="field-group" ?hidden="',
    '">\n            <div class="label">Display</div>\n            <editable-table-editor-toggle\n              id="bordered"\n              ?disabled="',
    '"\n              ?hidden="',
    '"\n              icon="image:grid-on"\n              label="Borders."\n              @change="',
    '"\n              ?toggled="',
    '"\n            >\n            </editable-table-editor-toggle>\n            <editable-table-editor-toggle\n              id="striped"\n              ?disabled="',
    '"\n              ?hidden="',
    '"\n              icon="editable-table:row-striped"\n              label="Alternating rows."\n              @change="',
    '"\n              ?toggled="',
    '"\n            >\n            </editable-table-editor-toggle>\n            <editable-table-editor-toggle\n              id="columnStriped"\n              ?disabled="',
    '"\n              ?hidden="',
    '"\n              icon="editable-table:col-striped"\n              label="Alternating columns."\n              @change="',
    '"\n              ?toggled="',
    '"\n            >\n            </editable-table-editor-toggle>\n            <editable-table-editor-toggle\n              id="condensed"\n              ?disabled="',
    '"\n              ?hidden="',
    '"\n              icon="editable-table:row-condensed"\n              label="Condensed rows."\n              @change="',
    '"\n              ?toggled="',
    '"\n            >\n            </editable-table-editor-toggle>\n            <editable-table-editor-toggle\n              id="numericStyles"\n              ?disabled="',
    '"\n              ?hidden="',
    '"\n              icon="editable-table:numbers"\n              label="Style numeric cells."\n              @change="',
    '"\n              ?toggled="',
    '"\n            >\n            </editable-table-editor-toggle>\n            <editable-table-editor-toggle\n              id="responsive"\n              ?disabled="',
    '"\n              ?hidden="',
    '"\n              icon="device:devices"\n              label="Adjust width to screen size."\n              @change="',
    '"\n              ?toggled="',
    '"\n            >\n            </editable-table-editor-toggle>\n          </div>\n          <div class="field-group" ?hidden="',
    '">\n            <div class="label">Data</div>\n            <editable-table-editor-toggle\n              id="sort"\n              ?disabled="',
    '"\n              ?hidden="',
    '"\n              label="Column sorting (for tables with column headers)."\n              icon="editable-table:sortable"\n              @change="',
    '"\n              ?toggled="',
    '"\n            >\n            </editable-table-editor-toggle>\n            <editable-table-editor-toggle\n              id="filter"\n              ?disabled="',
    '"\n              ?hidden="',
    '"\n              icon="editable-table:filter"\n              label="Column filtering."\n              @change="',
    '"\n              ?toggled="',
    '"\n            >\n            </editable-table-editor-toggle>\n            <editable-table-editor-toggle\n              id="downloadable"\n              ?disabled="',
    '"\n              ?hidden="',
    '"\n              icon="file-download"\n              label="Allow downloading as CSV."\n              @change="',
    '"\n              ?toggled="',
    '"\n            >\n            </editable-table-editor-toggle>\n            <editable-table-editor-toggle\n              id="printable"\n              ?disabled="',
    '"\n              ?hidden="',
    '"\n              icon="print"\n              label="Allow printing."\n              @change="',
    '"\n              ?toggled="',
    '"\n            >\n            </editable-table-editor-toggle>\n          </div>\n        </div>\n      </div>\n      <div id="htmlImport" hidden><slot></slot></div>\n    ',
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

if (!Element.prototype.replaceWith) {
  Element.prototype.replaceWith = _utils.ReplaceWithPolyfill;
}

if (!CharacterData.prototype.replaceWith) {
  CharacterData.prototype.replaceWith = _utils.ReplaceWithPolyfill;
}

if (!DocumentType.prototype.replaceWith) {
  DocumentType.prototype.replaceWith = _utils.ReplaceWithPolyfill;
}
/**
 * `editable-table`
 * An editor interface for tables that toggles between view mode.
 *
### Styling

`<editable-table>` provides following custom properties and mixins
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--editable-table-font-size` | Main size for  table. | unset;
`--editable-table-secondary-font-size` | Smaller font size for table for minor UI elements. | 12px;
`--editable-table-caption-font-size` | Font size for table caption. | var(--editable-table-font-size);
`--editable-table-font-family` | Main font-family for table. | inherit;
`--editable-table-secondary-font-family` | Secondary font-familt for table's minor UI elements | "Roboto", "Noto", sans-serif;
`--editable-table-light-weight` | lightest table font-weight, for minor UI elements. | 200;
`--editable-table-medium-weight` | default table font-weight. | 300;
`--editable-table-heavy-weight` | heaviest table font-weight, for emphasis and table  caption. | 600;
`--editable-table-color` | table text color. | #222;
`--editable-table-bg-color` | table background color. | #fff;
`--editable-table-caption-color` | caption text color. | var(--editable-table-color);
`--editable-table-caption-bg-color` | caption background color. | #fff;
`--editable-table-heading-color` | row/column heading text color. | #000;
`--editable-table-heading-bg-color` | row/column heading background color. | #e8e8e8;
`--editable-table-stripe-bg-color` | background color for alternating row striping. | #f0f0f0;
`--editable-table-border-width` | border width for table. | 1px;
`--editable-table-border-style` | border style for table. | solid;
`--editable-table-border-color` | border color for table. | #999;
`--editable-table-border` | table border. | var(--editable-table-border-width) var(--editable-table-border-style) var(--editable-table-border-color);
`--editable-table-button-color` | default text color of toggle buttons. | var(--editable-table-border-color);
`--editable-table-button-bg-color` | default background color of toggle buttons. | var(--editable-table-bg-color);
`--editable-table-button-toggled-color` | text color of toggle buttons when toggled. | var(--editable-table-color);
`--editable-table-button-toggled-bg-color` | background color of toggle buttons when toggled. | var(--editable-table-bg-color);
`--editable-table-button-hover-color` | text color of toggle buttons when hovered or focused. | var(--editable-table-button-color);
`--editable-table-button-hover-bg-color` | background color of toggle buttons when hovered or focused. | var(--editable-table-heading-bg-color);
`--editable-table-button-toggled-hover-color` | text color of toggle buttons when toggled and hovered/focused. | var(--editable-table-heading-color);
`--editable-table-button-toggled-hover-bg-color` | background color of toggle buttons when toggled and hovered/focused. | var(--editable-table-heading-bg-color);
`--editable-table-button-disabled-color` | text color of toggle buttons when disabled. | var(--editable-table-border-color);
`--editable-table-button-disabled-bg-color` | background color of toggle buttons when disabled. | var(--editable-table-heading-bg-color);
`--editable-table-row-horizontal-padding` | Default horizontal padding for cells. | 6px;
`--editable-table-row-horizontal-padding-condensed` | Smaller horizontal padding for cells. | 4px;
`--editable-table-row-vertical-padding` | Default vertical padding for cells (determines row hight and whitespace). | 10px;
`--editable-table-row-vertical-padding-condensed` | Smaller vertical padding for cells (determines condensed row hight and whitespace). | 2px;
`--editable-table-style-stripe` | Styles applied to striped rows. | { background-color: var(--editable-table-stripe-bg-color); }
`--editable-table-style-column-header` | Styles applied to column headers. | { font-weight: var(--editable-table-heavy-weight); color: var(--editable-table-heading-color); background-color: var(--editable-table-heading-bg-color); }
`--editable-table-style-row-header` | Styles applied to row headers. | { font-weight: var(--editable-table-heavy-weight); color: var(--editable-table-heading-color); }
`--editable-table-style-footer` | Styles applied to table footer. | { font-weight: var(--editable-table-heavy-weight); color: var(--editable-table-heading-color); border-top: 3px solid var(--editable-table-color); }
 *
 * @demo ./demo/index.html
 * @demo ./demo/editmode.html Edit Mode
 * @demo ./demo/numeric.html Numeric Styles
 * @demo ./demo/display.html Display Only
 * @demo ./demo/importing.html Importing Data
 * @demo ./demo/exporting.html Exporting Data
 * @demo ./demo/advanced.html Advanced Features
 * 
 * @customElement
 * @element editable-table
 * @extends displayBehaviors
 * @extends ResponsiveUtilityBehaviors
 * @extends editableTableStyles
 */

var EditableTable =
  /*#__PURE__*/
  (function (_displayBehaviors) {
    _inherits(EditableTable, _displayBehaviors);

    _createClass(
      EditableTable,
      [
        {
          key: "render",
          value: function render() {
            var _this2 = this;

            return (0, _litElement.html)(
              _templateObject(),
              this.config,
              this.editMode ? "true" : "false",
              this.bordered,
              this.caption,
              this.columnHeader,
              this.columnStriped,
              this.condensed,
              this.downloadable,
              this.data,
              this.filter,
              this.footer,
              this.editMode,
              this.numericStyles,
              this.printable,
              this.responsive,
              this.rowHeader,
              this.sort,
              this.striped,
              !this.editMode,
              !this.editMode ? "true" : "false",
              this.bordered,
              this.columnHeader,
              this.columnStriped,
              this.condensed,
              this.downloadable,
              this.filter,
              this.footer,
              this.numericStyles,
              this.printable,
              this.responsive,
              this.rowHeader,
              this.sort,
              this.striped,
              this._captionChanged,
              this.caption,
              (this.data[0] || []).map(function (cell, th) {
                return (0,
                _litElement.html)(_templateObject2(), th, _this2._isNumericColumn(th), _this2.condensed, th, _this2._handleRowColumnMenu, _this2._handleMenuOpen);
              }),
              this.data.map(function (row, tr) {
                return (0, _litElement.html)(
                  _templateObject3(),
                  tr == 0 && _this2.columnHeader
                    ? "thead-tr"
                    : tr == _this2.data.length - 1 && _this2.footer
                    ? "tfoot-tr"
                    : "tbody-tr",
                  _this2.condensed,
                  tr,
                  _this2._handleRowColumnMenu,
                  (row || []).map(function (cell, td) {
                    return (0, _litElement.html)(
                      _templateObject4(),
                      (td === 0 && _this2.rowHeader) ||
                        (tr == 0 && _this2.columnHeader)
                        ? "th"
                        : "td",
                      _this2._isNegative(cell),
                      _this2._isNumericColumn(td),
                      _this2._onCellClick,
                      function (e) {
                        return _this2._onCellValueChange(e, tr, td);
                      },
                      tr,
                      td,
                      "Cell ".concat(_this2._getLabel(td, false)).concat(tr),
                      cell
                    );
                  })
                );
              }),
              this._onTableSettingChange,
              this.columnHeader,
              this._onTableSettingChange,
              this.rowHeader,
              this._onTableSettingChange,
              this.footer,
              this.hideDisplay,
              this.hideBordered,
              this.hideBordered,
              this._onTableSettingChange,
              this.bordered,
              this.hideStriped,
              this.hideStriped,
              this._onTableSettingChange,
              this.striped,
              this.hideStriped,
              this.hideStriped,
              this._onTableSettingChange,
              this.columnStriped,
              this.hideCondensed,
              this.hideCondensed,
              this._onTableSettingChange,
              this.condensed,
              this.hideNumericStyles,
              this.hideNumericStyles,
              this._onTableSettingChange,
              this.numericStyles,
              this.hideResponsive,
              this.hideResponsive,
              this._onTableSettingChange,
              this.responsive,
              this.hideSortFilter,
              this._isSortDisabled(this.hideSort, this.columnHeader),
              this._isSortDisabled(this.hideSort, this.columnHeader),
              this._onTableSettingChange,
              this.sort,
              this.hideFilter,
              this.hideFilter,
              this._onTableSettingChange,
              this.filter,
              this.hideDownloadable,
              this.hideDownloadable,
              this._onTableSettingChange,
              this.downloadable,
              this.hidePrintable,
              this.hidePrintable,
              this._onTableSettingChange,
              this.printable
            );
          },
        },
        {
          key: "haxHooks",

          /**
           * Support being an editing interface element for HAX
           */
          value: function haxHooks() {
            return {
              activeElementChanged: "haxactiveElementChanged",
            };
          },
          /**
           * allow HAX to toggle edit state when activated
           */
        },
        {
          key: "haxactiveElementChanged",
          value: function haxactiveElementChanged(el, val) {
            // overwrite HAX dom w/ what our editor is supplying
            if (!val) {
              var replacement = this.getTableHTMLNode();

              if (el) {
                el.replaceWith(replacement);
              }

              el = replacement;
            } // aligns state of element w/ HAX if its available

            this.toggleEditMode(val);
            return el;
          },
        },
      ],
      [
        {
          key: "styles",
          get: function get() {
            return [].concat(
              _toConsumableArray(
                _get(_getPrototypeOf(EditableTable), "styles", this) || []
              ),
              _toConsumableArray(_editableTableBehaviors.editableTableStyles),
              [(0, _litElement.css)(_templateObject5())]
            );
          },
        },
        {
          key: "tag",
          get: function get() {
            return "editable-table";
          },
        },
      ]
    );

    function EditableTable() {
      var _this;

      _classCallCheck(this, EditableTable);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(EditableTable).call(this)
      );
      _this.haxUIElement = true;
      _this.editMode = false;
      _this.hideBordered = false;
      _this.hideCondensed = false;
      _this.hideDownloadable = false;
      _this.hideFilter = false;
      _this.hideResponsive = false;
      _this.hidePrintable = false;
      _this.hideSort = false;
      _this.hideStriped = false;
      _this.config = [
        {
          type: "button-group",
          buttons: [
            {
              command: "close",
              icon: "close",
              label: "Close toolbar",
              toggles: false,
              type: "rich-text-editor-button",
            },
          ],
        },
        {
          type: "button-group",
          buttons: [
            {
              command: "bold",
              icon: "editor:format-bold",
              label: "Bold",
              toggles: true,
              type: "rich-text-editor-button",
            },
            {
              command: "italic",
              icon: "editor:format-italic",
              label: "Italics",
              toggles: true,
              type: "rich-text-editor-button",
            },
            {
              command: "removeFormat",
              icon: "editor:format-clear",
              label: "Erase Format",
              type: "rich-text-editor-button",
            },
          ],
        },
        {
          type: "button-group",
          buttons: [
            {
              command: "link",
              icon: "link",
              label: "Link",
              toggledCommand: "unlink",
              toggledIcon: "mdextra:unlink",
              toggledLabel: "Unink",
              toggles: true,
              type: "rich-text-editor-link",
            },
          ],
        },
        {
          label: "Subscript and Superscript",
          buttons: [
            {
              command: "subscript",
              icon: "mdextra:subscript",
              label: "Subscript",
              toggles: true,
              type: "rich-text-editor-button",
            },
            {
              command: "superscript",
              icon: "mdextra:superscript",
              label: "Superscript",
              toggles: true,
              type: "rich-text-editor-button",
            },
          ],
        },
      ];
      return _this;
    }

    _createClass(
      EditableTable,
      [
        {
          key: "deleteColumn",

          /**
           * Delete a column at given index
           * @param {number} index index of column
           */
          value: function deleteColumn(index) {
            var temp = _toConsumableArray(this.data);

            for (var i = 0; i < temp.length; i++) {
              temp[i].splice(index, 1);
            }

            this.data = temp;
          },
          /**
           * Delete a row at given index
           * @param {number} index index of row
           */
        },
        {
          key: "deleteRow",
          value: function deleteRow(index) {
            var temp = _toConsumableArray(this.data);

            temp.splice(index, 1);
            this.data = temp;
          },
          /**
           * Insert a column at given index
           * @param {number} index index of column
           */
        },
        {
          key: "insertColumn",
          value: function insertColumn(index) {
            var temp = _toConsumableArray(this.data);

            for (var i = 0; i < temp.length; i++) {
              temp[i].splice(index, 0, " ");
            }

            this.data = temp;
          },
          /**
           * Insert a row at given index
           * @param {number} index index of row
           */
        },
        {
          key: "insertRow",
          value: function insertRow(index) {
            var temp = _toConsumableArray(this.data),
              temp2 = new Array();

            for (var i = 0; i < temp[0].length; i++) {
              temp2.push(" ");
            }

            temp.splice(index + 1, 0, temp2);
            this.data = temp;
          },
          /**
           * Toggles between edit-mode and display mode.
           * @event toggle-edit-mode
           * @param {boolean} edit Toggle edit mode on? Default is toggle from current mode.
           */
        },
        {
          key: "toggleEditMode",
          value: function toggleEditMode(edit) {
            edit = edit !== undefined ? edit : !this.editMode;
            this.dispatchEvent(
              new CustomEvent("toggle-edit-mode", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: this,
              })
            );

            if (
              edit &&
              this.shadowRoot &&
              this.shadowRoot.querySelector("editable-table-display")
            ) {
              this.shadowRoot
                .querySelector("editable-table-display")
                .toggleFilter();
              this.shadowRoot
                .querySelector("editable-table-display")
                .sortData("none", -1);
              this.shadowRoot.querySelector("#inner").focus();
            } else {
              this.shadowRoot
                .querySelectorAll("rich-text-editor")
                .forEach(function (editor) {
                  editor.disableEditing();
                });
            }

            this.editMode = edit;
          },
          /**
           * Handles when caption paper-input changed
           */
        },
        {
          key: "_captionChanged",
          value: function _captionChanged(e) {
            this.caption = e.detail;
          },
          /**
           * Gets row data for a given row index
           * @param {number} index index of row
           * @param {array} data table data
           * @returns {array} row data
           */
        },
        {
          key: "_getCurrentRow",
          value: function _getCurrentRow(index, data) {
            var row = null;

            if (
              data !== undefined &&
              data !== null &&
              data[index] !== undefined &&
              data[index] !== null
            ) {
              row = data[index];
            }

            return row;
          },
        },
        {
          key: "_handleMenuOpen",
          value: function _handleMenuOpen(e) {
            console.log(e);
          },
          /**
           * Handles row/column menu actions
           * @param {event} e event
           */
        },
        {
          key: "_handleRowColumnMenu",
          value: function _handleRowColumnMenu(e) {
            if (e.detail.insert && e.detail.row) {
              this.insertRow(e.detail.index);
            } else if (e.detail.insert && !e.detail.row) {
              this.insertColumn(e.detail.index);
            } else if (!e.detail.insert && e.detail.row) {
              this.deleteRow(e.detail.index);
            } else {
              this.deleteColumn(e.detail.index);
            }
          },
          /**
           * Tests for first row of data. Workaround to restamp column headers.
           * @param {number} index index of row
           */
        },
        {
          key: "_isFirstRow",
          value: function _isFirstRow(index) {
            return index === 0;
          },
          /**
           * Tests for whether or not to disable sort feature.
           * @param {boolean} hideSort if sort feature be hidden
           * @param {boolean} columnHeader if table has column headers
           */
        },
        {
          key: "_isSortDisabled",
          value: function _isSortDisabled(hideSort, columnHeader) {
            return hideSort || !columnHeader;
          },
          /**
           * Sets focus on cell's textarea if cell is clicked
           * @param {event} e event
           */
        },
        {
          key: "_onCellClick",
          value: function _onCellClick(e) {
            if (e.model && e.model.root && e.model.root.nodeList[0]) {
              e.model.root.nodeList[0].focus();
            }
          },
          /**
           * Updates data when cell value changes
           * @param {event} e event
           */
        },
        {
          key: "_onCellValueChange",
          value: function _onCellValueChange(e, row, col) {
            var temp = this.data.slice();
            temp[row][col] = e.detail;
            this.data = [];
            this.data = temp;
          },
          /**
           * Updates table properties when setting changes
           * @param {event} e event
           */
        },
        {
          key: "_onTableSettingChange",
          value: function _onTableSettingChange(e) {
            this[e.detail.id] = e.detail.toggled;
          },
          /**
           * Makes sure there is always on cell to work from
           */
        },
        {
          key: "_dataChanged",
          value: function _dataChanged(data, oldData) {
            if ((data && data.length < 1) || data[0].length < 1) {
              this.data = [
                ["", "", ""],
                ["", "", ""],
                ["", "", ""],
              ];
            }
          },
          /**
           * Get row or column label
           * @param {number} index of row or column
           * @param  {boolean} whenther it's a row
           * @returns {string} a row number or a column letter
           */
        },
        {
          key: "_getLabel",
          value: function _getLabel(index) {
            var numerals = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
              results = this._getLetter(index).split("-").reverse(),
              label = "";

            for (var i = 0; i < results.length; i++) {
              if (results[i] !== "") label += numerals[results[i]];
            }

            return label;
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
        {
          key: "hideSortFilter",

          /**
           * hides data sorting and filtering feature set
           *
           * @readonly
           * @memberof EditableTable
           */
          get: function get() {
            return this.hideSort && this.hideFilter;
          },
          /**
           * hides display feature set
           *
           * @readonly
           * @memberof EditableTable
           */
        },
        {
          key: "hideDisplay",
          get: function get() {
            return (
              this.hideBordered &&
              this.hideCondensed &&
              this.hideStriped &&
              this.hideNumericStyles &&
              this.hideResponsive
            );
          },
        },
      ],
      [
        {
          key: "properties",
          get: function get() {
            return _objectSpread(
              {},
              _editableTableBehaviors.displayBehaviors.properties,
              {
                /**
                 * text editor config
                 */
                config: {
                  type: Array,
                },

                /**
                 * Is table in edit-mode? Default is false (display mode).
                 */
                editMode: {
                  type: Boolean,
                  attribute: "edit-mode",
                },

                /**
                 * Hide borders table styles menu option
                 */
                hideBordered: {
                  type: Boolean,
                  attribute: "hide-bordered",
                },

                /**
                 * Hide condensed table styles menu option
                 */
                hideCondensed: {
                  type: Boolean,
                  attribute: "hide-condensed",
                },

                /**
                 * Hide downloadable menu option
                 */
                hideDownloadable: {
                  type: Boolean,
                  attribute: "hide-downloadable",
                },

                /**
                 * Hide filtering option.
                 */
                hideFilter: {
                  type: Boolean,
                  attribute: "hide-filter",
                },

                /**
                 * Hide numeric styling option.
                 */
                hideNumericStyles: {
                  type: Boolean,
                  attribute: "hide-numeric-styles",
                },

                /**
                 * Hide printable menu option
                 */
                hidePrintable: {
                  type: Boolean,
                  attribute: "hide-printable",
                },

                /**
                 * Hide responsive table styles menu option
                 */
                hideResponsive: {
                  type: Boolean,
                  attribute: "hide-responsive",
                },

                /**
                 * Hide sorting option.
                 */
                hideSort: {
                  type: Boolean,
                  attribute: "hide-sort",
                },

                /**
                 * Hide striped table styles menu option
                 */
                hideStriped: {
                  type: Boolean,
                  attribute: "hide-striped",
                },
              }
            );
          },
        },
      ]
    );

    return EditableTable;
  })((0, _editableTableBehaviors.displayBehaviors)(_litElement.LitElement));

exports.EditableTable = EditableTable;
window.customElements.define(EditableTable.tag, EditableTable);

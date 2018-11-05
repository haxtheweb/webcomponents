define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@lrnwebcomponents/dropdown-select/dropdown-select.js",
  "../node_modules/@polymer/paper-item/paper-item.js",
  "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js",
  "@lrnwebcomponents/responsive-utility/responsive-utility-behaviors.js",
  "./editable-table-behaviors.js",
  "./editable-table-sort.js",
  "./editable-table-filter.js",
  "./editable-table-styles.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_1d5e51c0e11a11e8b78cd5fdaca14a96() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style is="custom-style" include="editable-table-styles">\n      :host([dark]) .caption {\n        padding: 0.25em 0.25em 0;\n      }\n      :host([bordered]) .table .th,\n      :host([bordered]) .table .td {\n        border: 1px solid var(--editable-table-border-color);\n      }\n      :host([striped]) .table .tbody .tr:nth-child(2n) .th,\n      :host([striped]) .table .tbody .tr:nth-child(2n) .td {\n        @apply --editable-table-style-stripe;\n      }\n      :host([column-header]) .table .thead .tr .th {\n        @apply --editable-table-style-column-header;\n      }\n      :host([row-header]) .table .tbody .tr .th {\n        @apply --editable-table-style-row-header;\n      }\n      :host([footer]) .table .tfoot .tr .th, \n      :host([footer]) .table .tfoot .tr .td {\n        @apply --editable-table-style-footer;\n      }\n    </style>\n    <table id="table" class="table" default-xs-display="">\n      <caption class="caption">\n        <div>\n          <div>[[caption]]</div>\n          <dropdown-select id="column" label$="[[tables.0.label]]" value="1">\n            <template is="dom-repeat" items$="[[thead.0]]" as="col" index-as="index">\n              <template is="dom-if" if="[[columnHeader]]">\n                <paper-item id$="[[index]]" value$="[[index]]">[[col]]</paper-item>\n              </template>\n              <template is="dom-if" if="[[!columnHeader]]">\n                <paper-item id$="[[index]]">Column [[index]]</paper-item>\n              </template>\n            </template>\n          </dropdown-select>\n        </div>\n      </caption>\n      <thead class="thead" hidden="[[!columnHeader]]"> \n        <tr class="tr">\n          <template is="dom-repeat" items$="[[thead.0]]" as="th" index-as="index">\n            <th class="th" scope="col" numeric$="[[_isNumericColumn(index)]]">\n              <template is="dom-if" if="[[sort]]" restamp=""> \n                <editable-table-sort sort-column$="[[sortColumn]]" column-number="[[index]]" text$="[[th]]"></editable-table-sort>\n              </template>\n              <template is="dom-if" if="[[!sort]]" restamp="">[[th]]</template>\n            </th>\n          </template>\n        </tr> \n      </thead>\n      <tbody id="tbody" class="tbody"> \n        <template is="dom-repeat" items$="[[tbody]]" as="tr" filter="{{filterRows(filterColumn,filterText)}}" restamp="">\n          <tr class="tr">\n            <template is="dom-repeat" items$="[[tr]]" as="cell" index-as="index" restamp="">\n              <template is="dom-if" if="[[_isRowHeader(rowHeader,index)]]" restamp="">\n                <th class="th" scope="row" numeric$="[[_isNumericColumn(index)]]">[[cell]]</th>\n              </template>\n              <template is="dom-if" if="[[!_isRowHeader(rowHeader,index)]]" restamp="">\n                <td class="td" numeric$="[[_isNumericColumn(index)]]" negative$="[[_isNegative(cell)]]">\n                  <template is="dom-if" if="[[filter]]" restamp="">\n                    <editable-table-filter column-number="[[index]]" text$="[[cell]]" filtered$="[[_isFiltered(index,filterColumn,filtered)]]"></editable-table-filter>                      \n                  </template>\n                  <template is="dom-if" if="[[!filter]]" restamp=""><span class="cell">[[cell]]</span></template>\n                </td>\n              </template>\n            </template>\n          </tr> \n        </template>\n      </tbody>\n      <template is="dom-if" if="[[footer]]">\n        <tfoot class="tfoot">\n          <tr class="tr">\n            <template is="dom-repeat" items$="[[__tfoot.0]]" as="cell" index-as="index">\n              <template is="dom-if" if="[[_isRowHeader(rowHeader,index)]]">\n                <th class="th" scope="row" numeric$="[[_isNumericColumn(index)]]">[[cell]]</th>\n              </template>\n              <template is="dom-if" if="[[!_isRowHeader(rowHeader,index)]]">\n                <td class="td" numeric$="[[_isNumericColumn(index)]]" negative$="[[_isNegative(cell)]]">[[cell]]</td>\n              </template>\n            </template>\n          </tr> \n        </tfoot>\n      </template>\n    </table>\n'
      ],
      [
        '\n    <style is="custom-style" include="editable-table-styles">\n      :host([dark]) .caption {\n        padding: 0.25em 0.25em 0;\n      }\n      :host([bordered]) .table .th,\n      :host([bordered]) .table .td {\n        border: 1px solid var(--editable-table-border-color);\n      }\n      :host([striped]) .table .tbody .tr:nth-child(2n) .th,\n      :host([striped]) .table .tbody .tr:nth-child(2n) .td {\n        @apply --editable-table-style-stripe;\n      }\n      :host([column-header]) .table .thead .tr .th {\n        @apply --editable-table-style-column-header;\n      }\n      :host([row-header]) .table .tbody .tr .th {\n        @apply --editable-table-style-row-header;\n      }\n      :host([footer]) .table .tfoot .tr .th, \n      :host([footer]) .table .tfoot .tr .td {\n        @apply --editable-table-style-footer;\n      }\n    </style>\n    <table id="table" class="table" default-xs-display="">\n      <caption class="caption">\n        <div>\n          <div>[[caption]]</div>\n          <dropdown-select id="column" label\\$="[[tables.0.label]]" value="1">\n            <template is="dom-repeat" items\\$="[[thead.0]]" as="col" index-as="index">\n              <template is="dom-if" if="[[columnHeader]]">\n                <paper-item id\\$="[[index]]" value\\$="[[index]]">[[col]]</paper-item>\n              </template>\n              <template is="dom-if" if="[[!columnHeader]]">\n                <paper-item id\\$="[[index]]">Column [[index]]</paper-item>\n              </template>\n            </template>\n          </dropdown-select>\n        </div>\n      </caption>\n      <thead class="thead" hidden="[[!columnHeader]]"> \n        <tr class="tr">\n          <template is="dom-repeat" items\\$="[[thead.0]]" as="th" index-as="index">\n            <th class="th" scope="col" numeric\\$="[[_isNumericColumn(index)]]">\n              <template is="dom-if" if="[[sort]]" restamp=""> \n                <editable-table-sort sort-column\\$="[[sortColumn]]" column-number="[[index]]" text\\$="[[th]]"></editable-table-sort>\n              </template>\n              <template is="dom-if" if="[[!sort]]" restamp="">[[th]]</template>\n            </th>\n          </template>\n        </tr> \n      </thead>\n      <tbody id="tbody" class="tbody"> \n        <template is="dom-repeat" items\\$="[[tbody]]" as="tr" filter="{{filterRows(filterColumn,filterText)}}" restamp="">\n          <tr class="tr">\n            <template is="dom-repeat" items\\$="[[tr]]" as="cell" index-as="index" restamp="">\n              <template is="dom-if" if="[[_isRowHeader(rowHeader,index)]]" restamp="">\n                <th class="th" scope="row" numeric\\$="[[_isNumericColumn(index)]]">[[cell]]</th>\n              </template>\n              <template is="dom-if" if="[[!_isRowHeader(rowHeader,index)]]" restamp="">\n                <td class="td" numeric\\$="[[_isNumericColumn(index)]]" negative\\$="[[_isNegative(cell)]]">\n                  <template is="dom-if" if="[[filter]]" restamp="">\n                    <editable-table-filter column-number="[[index]]" text\\$="[[cell]]" filtered\\$="[[_isFiltered(index,filterColumn,filtered)]]"></editable-table-filter>                      \n                  </template>\n                  <template is="dom-if" if="[[!filter]]" restamp=""><span class="cell">[[cell]]</span></template>\n                </td>\n              </template>\n            </template>\n          </tr> \n        </template>\n      </tbody>\n      <template is="dom-if" if="[[footer]]">\n        <tfoot class="tfoot">\n          <tr class="tr">\n            <template is="dom-repeat" items\\$="[[__tfoot.0]]" as="cell" index-as="index">\n              <template is="dom-if" if="[[_isRowHeader(rowHeader,index)]]">\n                <th class="th" scope="row" numeric\\$="[[_isNumericColumn(index)]]">[[cell]]</th>\n              </template>\n              <template is="dom-if" if="[[!_isRowHeader(rowHeader,index)]]">\n                <td class="td" numeric\\$="[[_isNumericColumn(index)]]" negative\\$="[[_isNegative(cell)]]">[[cell]]</td>\n              </template>\n            </template>\n          </tr> \n        </tfoot>\n      </template>\n    </table>\n'
      ]
    );
    _templateObject_1d5e51c0e11a11e8b78cd5fdaca14a96 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_1d5e51c0e11a11e8b78cd5fdaca14a96()
    ),
    is: "editable-table-display",
    listeners: {
      "change-sort-mode": "_changeSortMode",
      "toggle-filter": "toggleFilter",
      "dropdown-select-changed": "_onColumnChange"
    },
    behaviors: [
      ResponsiveUtilityBehaviors,
      simpleColorsBehaviors,
      editableTableBehaviors.displayBehaviors
    ],
    properties: {
      editMode: { type: Boolean, value: !1 },
      filterColumn: { type: Number, value: null },
      filtered: { type: Boolean, value: !1 },
      filterText: { type: String, value: null },
      hideEditMode: { type: Boolean, value: !1 },
      selected: { type: Number, value: 1 },
      sortMode: { type: String, value: "none" },
      sortColumn: { type: Number, value: -1 },
      thead: { type: Array, computed: "_getThead(data,columnHeader)" },
      tbody: { type: Array, computed: "_getTbody(data,columnHeader,footer)" }
    },
    _getTbody: function _getTbody(data, columnHeader, footer) {
      if (data !== void 0 && null !== data && 0 < data.length) {
        var ch = columnHeader ? 1 : 0,
          tbody;
        if (footer) {
          tbody = data.slice(ch, data.length - 1);
          this.__tfoot = data.slice(data.length - 1);
        } else {
          tbody = data.slice(ch, data.length);
          this.__tfoot = [];
        }
        return tbody;
      }
      return [];
    },
    _getThead: function _getThead(data, columnHeader) {
      this;
      if (data !== void 0 && null !== data && 0 < data.length && columnHeader) {
        return data.slice(0, 1);
      }
      return [];
    },
    _isFiltered: function _isFiltered(column, filterColumn, filtered) {
      return null !== filterColumn && filterColumn === column && filtered;
    },
    _isNegative: function _isNegative(cell) {
      return this._isNumeric(cell) && 0 === cell.trim().indexOf("-");
    },
    _isNumeric: function _isNumeric(cell) {
      return null !== cell && !isNaN(cell.trim().replace(/\$/g, ""));
    },
    _isNumericColumn: function _isNumericColumn(col) {
      for (var numeric = !0, i = 0; i < this.tbody.length; i++) {
        if (!this._isNumeric(this.tbody[i][col])) numeric = !1;
      }
      return numeric;
    },
    _isRowHeader: function _isRowHeader(rowHeader, index) {
      return 0 === index && rowHeader;
    },
    _onColumnChange: function _onColumnChange(e) {
      this.selected = e.detail.value;
      this._updateCols(parseInt(e.detail.value));
    },
    _changeSortMode: function _changeSortMode(e) {
      if (
        this.sortColumn === e.detail.columnNumber &&
        "asc" === this.sortMode
      ) {
        this.sortMode = "desc";
      } else if (
        this.sortColumn === e.detail.columnNumber &&
        "desc" === this.sortMode
      ) {
        this.sortMode = "none";
      } else {
        this.sortMode = "asc";
        this.sortColumn = e.detail.columnNumber;
      }
      e.detail.setSortMode(this.sortMode);
      this.sortData(this.sortMode, e.detail.columnNumber);
    },
    _updateCols: function _updateCols(selected) {
      this.$.table.removeAttribute("default-xs-display");
      var cols = this.$.table.querySelectorAll("th,td");
      this.$.table.setAttribute("transition", !0);
      setTimeout(function() {
        for (var i = 0; i < cols.length; i++) {
          var col = cols[i],
            index = col.cellIndex;
          if (0 === index || index === selected) {
            col.removeAttribute("xs-hidden");
          } else {
            col.setAttribute("xs-hidden", !0);
          }
        }
      }, 200);
      this.$.table.removeAttribute("transition");
    },
    filterRows: function filterRows(filterColumn, filterText) {
      if (filterText !== void 0 && null !== filterText) {
        return function(tr) {
          return (
            tr[filterColumn].toLowerCase().trim() ===
            filterText.toLowerCase().trim()
          );
        };
      } else {
        return null;
      }
    },
    sortData: function sortData(type, column) {
      if ("none" !== type && !1 !== type) {
        for (var temp = this.tbody.slice(), i = 0; i < temp.length; i++) {
          temp[i].unshift(temp[i][column]);
        }
        if ("asc" === type) {
          temp.sort();
        } else {
          temp.reverse();
        }
        for (var _i = 0; _i < temp.length; _i++) {
          this.set("tbody." + _i, []);
          this.set("tbody." + _i, temp[_i].slice(1));
        }
      } else {
        for (
          var _temp = this.tbody.slice(), _i2 = 0;
          _i2 < _temp.length;
          _i2++
        ) {
          this.set("data." + (_i2 + 1), []);
          this.set("data." + (_i2 + 1), _temp[_i2].slice());
        }
      }
    },
    toggleFilter: function toggleFilter(e) {
      if (
        e === void 0 ||
        (this.filterColumn == e.detail.columnNumber && this.filtered)
      ) {
        this.filtered = !1;
        this.filterText = null;
        this.filterColumn = null;
      } else {
        this.filterText = e.detail.text;
        this.filterColumn = e.detail.columnNumber;
        this.filtered = !0;
      }
    }
  });
});

import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@lrnwebcomponents/dropdown-select/dropdown-select.js";
import "../node_modules/@polymer/paper-item/paper-item.js";
import "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";
import "../node_modules/@lrnwebcomponents/responsive-utility/lib/responsive-utility-behaviors.js";
import "./editable-table-behaviors.js";
import "./editable-table-sort.js";
import "./editable-table-filter.js";
import "./editable-table-styles.js";
Polymer({
  _template: html`
    <style is="custom-style" include="editable-table-styles">
      :host([dark]) .caption {
        padding: 4px 4px 0;
      }
      :host([bordered]) .table .th,
      :host([bordered]) .table .td {
        border: 1px solid var(--editable-table-border-color);
      }
      :host([striped]) .table .tbody .tr:nth-child(2n) .th,
      :host([striped]) .table .tbody .tr:nth-child(2n) .td {
        @apply --editable-table-style-stripe;
      }
      :host([column-header]) .table .thead .tr .th {
        @apply --editable-table-style-column-header;
      }
      :host([row-header]) .table .tbody .tr .th {
        @apply --editable-table-style-row-header;
      }
      :host([footer]) .table .tfoot .tr .th, 
      :host([footer]) .table .tfoot .tr .td {
        @apply --editable-table-style-footer;
      }
    </style>
    <table id="table" class="table" default-xs-display="">
      <caption class="caption">
        <div>
          <div>[[caption]]</div>
          <dropdown-select id="column" label\$="[[tables.0.label]]" value="1">
            <template is="dom-repeat" items\$="[[thead.0]]" as="col" index-as="index">
              <template is="dom-if" if="[[columnHeader]]">
                <paper-item id\$="[[index]]" value\$="[[index]]">[[col]]</paper-item>
              </template>
              <template is="dom-if" if="[[!columnHeader]]">
                <paper-item id\$="[[index]]">Column [[index]]</paper-item>
              </template>
            </template>
          </dropdown-select>
        </div>
      </caption>
      <thead class="thead" hidden="[[!columnHeader]]"> 
        <tr class="tr">
          <template is="dom-repeat" items\$="[[thead.0]]" as="th" index-as="index">
            <th class="th" scope="col" numeric\$="[[_isNumericColumn(index)]]">
              <template is="dom-if" if="[[sort]]" restamp=""> 
                <editable-table-sort sort-column\$="[[sortColumn]]" column-number="[[index]]" text\$="[[th]]"></editable-table-sort>
              </template>
              <template is="dom-if" if="[[!sort]]" restamp="">[[th]]</template>
            </th>
          </template>
        </tr> 
      </thead>
      <tbody id="tbody" class="tbody"> 
        <template is="dom-repeat" items\$="[[tbody]]" as="tr" filter="{{filterRows(filterColumn,filterText)}}" restamp="">
          <tr class="tr">
            <template is="dom-repeat" items\$="[[tr]]" as="cell" index-as="index" restamp="">
              <template is="dom-if" if="[[_isRowHeader(rowHeader,index)]]" restamp="">
                <th class="th" scope="row" numeric\$="[[_isNumericColumn(index)]]">[[cell]]</th>
              </template>
              <template is="dom-if" if="[[!_isRowHeader(rowHeader,index)]]" restamp="">
                <td class="td" numeric\$="[[_isNumericColumn(index)]]" negative\$="[[_isNegative(cell)]]">
                  <template is="dom-if" if="[[filter]]" restamp="">
                    <editable-table-filter column-number="[[index]]" text\$="[[cell]]" filtered\$="[[_isFiltered(index,filterColumn,filtered)]]"></editable-table-filter>                      
                  </template>
                  <template is="dom-if" if="[[!filter]]" restamp=""><span class="cell">[[cell]]</span></template>
                </td>
              </template>
            </template>
          </tr> 
        </template>
      </tbody>
      <template is="dom-if" if="[[footer]]">
        <tfoot class="tfoot">
          <tr class="tr">
            <template is="dom-repeat" items\$="[[__tfoot.0]]" as="cell" index-as="index">
              <template is="dom-if" if="[[_isRowHeader(rowHeader,index)]]">
                <th class="th" scope="row" numeric\$="[[_isNumericColumn(index)]]">[[cell]]</th>
              </template>
              <template is="dom-if" if="[[!_isRowHeader(rowHeader,index)]]">
                <td class="td" numeric\$="[[_isNumericColumn(index)]]" negative\$="[[_isNegative(cell)]]">[[cell]]</td>
              </template>
            </template>
          </tr> 
        </tfoot>
      </template>
    </table>
`,
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
  _getTbody: function(data, columnHeader, footer) {
    if (data !== void 0 && null !== data && 0 < data.length) {
      let ch = columnHeader ? 1 : 0,
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
  _getThead: function(data, columnHeader) {
    this;
    if (data !== void 0 && null !== data && 0 < data.length && columnHeader) {
      return data.slice(0, 1);
    }
    return [];
  },
  _isFiltered: function(column, filterColumn, filtered) {
    return null !== filterColumn && filterColumn === column && filtered;
  },
  _isNegative: function(cell) {
    return this._isNumeric(cell) && 0 === cell.trim().indexOf("-");
  },
  _isNumeric: function(cell) {
    return null !== cell && !isNaN(cell.trim().replace(/\$/g, ""));
  },
  _isNumericColumn: function(col) {
    let numeric = !0;
    for (let i = 0; i < this.tbody.length; i++) {
      if (!this._isNumeric(this.tbody[i][col])) numeric = !1;
    }
    return numeric;
  },
  _isRowHeader: function(rowHeader, index) {
    return 0 === index && rowHeader;
  },
  _onColumnChange: function(e) {
    this.selected = e.detail.value;
    this._updateCols(parseInt(e.detail.value));
  },
  _changeSortMode: function(e) {
    if (this.sortColumn === e.detail.columnNumber && "asc" === this.sortMode) {
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
  _updateCols: function(selected) {
    this.$.table.removeAttribute("default-xs-display");
    let cols = this.$.table.querySelectorAll("th,td");
    this.$.table.setAttribute("transition", !0);
    setTimeout(function() {
      for (let i = 0; i < cols.length; i++) {
        let col = cols[i],
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
  filterRows: function(filterColumn, filterText) {
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
  sortData: function(type, column) {
    if ("none" !== type && !1 !== type) {
      let temp = this.tbody.slice();
      for (let i = 0; i < temp.length; i++) {
        temp[i].unshift(temp[i][column]);
      }
      if ("asc" === type) {
        temp.sort();
      } else {
        temp.reverse();
      }
      for (let i = 0; i < temp.length; i++) {
        this.set("tbody." + i, []);
        this.set("tbody." + i, temp[i].slice(1));
      }
    } else {
      let temp = this.tbody.slice();
      for (let i = 0; i < temp.length; i++) {
        this.set("data." + (i + 1), []);
        this.set("data." + (i + 1), temp[i].slice());
      }
    }
  },
  toggleFilter: function(e) {
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

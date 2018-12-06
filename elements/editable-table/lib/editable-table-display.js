import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/dropdown-select/dropdown-select.js";
import "@polymer/paper-item/paper-item.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/responsive-utility/lib/responsive-utility-behaviors.js";
import "./editable-table-behaviors.js";
import "./editable-table-sort.js";
import "./editable-table-filter.js";
import "./editable-table-styles.js";
/**
`editable-table-display`

Displays a table with theming, styling, sorting, resonsive, and 
filtering features.  (See editable-table-behaviors.html 
for more information.)

@demo demo/index.html

@microcopy - the mental model for this element
<editable-table-display 
  accent-color="indigo"     //Optional accent color for column headers and border. Default is none. (See https://lrnwebcomponents.github.io/simple-colors/components/simple-colors/)
  bordered                  //Adds borders to table. Default is no border.
  caption="..."             //The caption or title for the table.
  column-header             //Does the table use the first row as a column-header? Default is false.
  condensed                 //Condense the padding above and below the table? Default is false.
  dark                      //Optional dark theme. Default is light theme. (See https://lrnwebcomponents.github.io/simple-colors/components/simple-colors/)
  data='[                   //Table data as an array. For example:
    [ ["..."], ["..."] ],     //This line represents a row with two columns
    [ ["..."], ["..."] ],     //This line represents another row with two columns
    [ ["..."], ["..."] ]      //This line represents a third row with two columns
  ]'
  edit-mode                 //Is the editor in edit mode? Default is false which places the table in display mode. 
  filter                    //Allow table to toggle filtering? When a cell is toggled, only rows that have the same value as that cell will be shown. Default is no filter.
  footer                    //Does the table use the last row as a footer? Default is false.
  row-header                //Does the table use the first column as a row header? Default is false.
  scroll                    //Does the table use scrolling to fit when it is too wide?  Default is false: a responsive layout where only two columns are shown and a dropdown menu controls which column to display.
  sort                      //Does the table allow sorting by column where column headers become sort buttons? Default is false.
  striped                   //Does the table have alternating stipes of shading for its body rows? Default is false.
  summary="...">            //An accessible description of the table, what each row reporesents, and what each column represents.
</editable-table-display>

*/
Polymer({
  _template: html`
    <style is="custom-style" include="editable-table-styles simple-colors">
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
            <template
              is="dom-repeat"
              items\$="[[thead.0]]"
              as="col"
              index-as="index"
            >
              <template is="dom-if" if="[[columnHeader]]">
                <paper-item id\$="[[index]]" value\$="[[index]]"
                  >[[col]]</paper-item
                >
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
          <template
            is="dom-repeat"
            items\$="[[thead.0]]"
            as="th"
            index-as="index"
          >
            <th class="th" scope="col" numeric\$="[[_isNumericColumn(index)]]">
              <template is="dom-if" if="[[sort]]" restamp="">
                <editable-table-sort
                  sort-column\$="[[sortColumn]]"
                  column-number="[[index]]"
                  text\$="[[th]]"
                ></editable-table-sort>
              </template>
              <template is="dom-if" if="[[!sort]]" restamp=""
                >[[th]]</template
              >
            </th>
          </template>
        </tr>
      </thead>
      <tbody id="tbody" class="tbody">
        <template
          is="dom-repeat"
          items\$="[[tbody]]"
          as="tr"
          filter="{{filterRows(filterColumn,filterText)}}"
          restamp=""
        >
          <tr class="tr">
            <template
              is="dom-repeat"
              items\$="[[tr]]"
              as="cell"
              index-as="index"
              restamp=""
            >
              <template
                is="dom-if"
                if="[[_isRowHeader(rowHeader,index)]]"
                restamp=""
              >
                <th
                  class="th"
                  scope="row"
                  numeric\$="[[_isNumericColumn(index)]]"
                >
                  [[cell]]
                </th>
              </template>
              <template
                is="dom-if"
                if="[[!_isRowHeader(rowHeader,index)]]"
                restamp=""
              >
                <td
                  class="td"
                  numeric\$="[[_isNumericColumn(index)]]"
                  negative\$="[[_isNegative(cell)]]"
                >
                  <template is="dom-if" if="[[filter]]" restamp="">
                    <editable-table-filter
                      column-number="[[index]]"
                      text\$="[[cell]]"
                      filtered\$="[[_isFiltered(index,filterColumn,filtered)]]"
                    ></editable-table-filter>
                  </template>
                  <template is="dom-if" if="[[!filter]]" restamp=""
                    ><span class="cell">[[cell]]</span></template
                  >
                </td>
              </template>
            </template>
          </tr>
        </template>
      </tbody>
      <template is="dom-if" if="[[footer]]">
        <tfoot class="tfoot">
          <tr class="tr">
            <template
              is="dom-repeat"
              items\$="[[__tfoot.0]]"
              as="cell"
              index-as="index"
            >
              <template is="dom-if" if="[[_isRowHeader(rowHeader,index)]]">
                <th
                  class="th"
                  scope="row"
                  numeric\$="[[_isNumericColumn(index)]]"
                >
                  [[cell]]
                </th>
              </template>
              <template is="dom-if" if="[[!_isRowHeader(rowHeader,index)]]">
                <td
                  class="td"
                  numeric\$="[[_isNumericColumn(index)]]"
                  negative\$="[[_isNegative(cell)]]"
                >
                  [[cell]]
                </td>
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
    editableTableBehaviors.displayBehaviors
  ],

  properties: {
    /**
     * Is the table in edit mode?
     */
    editMode: {
      type: Boolean,
      value: false
    },
    /**
     * Column for filtering
     */
    filterColumn: {
      type: Number,
      value: null
    },
    /**
     * Is the table filtered
     */
    filtered: {
      type: Boolean,
      value: false
    },
    /**
     * Text for Filtering
     */
    filterText: {
      type: String,
      value: null
    },
    /**
     * Hide edit mode?
     */
    hideEditMode: {
      type: Boolean,
      value: false
    },
    /**
     * The selected table
     */
    selected: {
      type: Number,
      value: 1
    },
    /**
     * Sort mode: ascending, descending or none
     */
    sortMode: {
      type: String,
      value: "none"
    },
    /**
     * The index of the current sort column
     */
    sortColumn: {
      type: Number,
      value: -1
    },
    /**
     * columns in <thead>
     */
    thead: {
      type: Array,
      computed: "_getThead(data,columnHeader)"
    },
    /**
     * rows in <tbody>
     */
    tbody: {
      type: Array,
      computed: "_getTbody(data,columnHeader,footer)"
    }
  },

  /**
   * Geth the rows in <tbody>
   */
  _getTbody: function(data, columnHeader, footer) {
    if (data !== undefined && data !== null && data.length > 0) {
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

  /**
   * Get the columns in <thead>
   */
  _getThead: function(data, columnHeader) {
    let root = this;
    if (
      data !== undefined &&
      data !== null &&
      data.length > 0 &&
      columnHeader
    ) {
      return data.slice(0, 1);
    }
    return [];
  },

  /**
   * sets a column's cells to filtered when in filtered mode so that filter can toggle
   */
  _isFiltered: function(column, filterColumn, filtered) {
    return filterColumn !== null && filterColumn === column && filtered;
  },

  /**
   * sets a cell's numeric style
   */
  _isNegative: function(cell) {
    return this._isNumeric(cell) && cell.trim().indexOf("-") === 0;
  },

  /**
   * sets a cell's numeric style
   */
  _isNumeric: function(cell) {
    return cell !== null && !isNaN(cell.trim().replace(/\$/g, ""));
  },

  /**
   * sets a cell's numeric style
   */
  _isNumericColumn: function(col) {
    let numeric = true;
    for (let i = 0; i < this.tbody.length; i++) {
      if (!this._isNumeric(this.tbody[i][col])) numeric = false;
    }
    return numeric;
  },

  /**
   * Calculate if the cell is a th or td
   */
  _isRowHeader: function(rowHeader, index) {
    return index === 0 && rowHeader;
  },

  /**
   * Handle column dropdown-select change
   */
  _onColumnChange: function(e) {
    this.selected = e.detail.value;
    this._updateCols(parseInt(e.detail.value));
  },

  /**
   * Handle sort button click
   */
  _changeSortMode: function(e) {
    if (this.sortColumn === e.detail.columnNumber && this.sortMode === "asc") {
      this.sortMode = "desc";
    } else if (
      this.sortColumn === e.detail.columnNumber &&
      this.sortMode === "desc"
    ) {
      this.sortMode = "none";
    } else {
      this.sortMode = "asc";
      this.sortColumn = e.detail.columnNumber;
    }
    e.detail.setSortMode(this.sortMode);
    this.sortData(this.sortMode, e.detail.columnNumber);
  },

  /**
   * update the responsive columns menu
   */
  _updateCols: function(selected) {
    this.$.table.removeAttribute("default-xs-display");
    let cols = this.$.table.querySelectorAll("th,td");
    this.$.table.setAttribute("transition", true);
    setTimeout(function() {
      for (let i = 0; i < cols.length; i++) {
        let col = cols[i],
          index = col.cellIndex,
          delay;
        if (index === 0 || index === selected) {
          col.removeAttribute("xs-hidden");
        } else {
          col.setAttribute("xs-hidden", true);
        }
      }
    }, 200);
    this.$.table.removeAttribute("transition");
  },

  /**
   * Handle filter based on collumn and text of cell that is clicked
   */
  filterRows: function(filterColumn, filterText) {
    if (filterText !== undefined && filterText !== null) {
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

  /**
   * initialize the responsive columns menu
   */
  sortData: function(type, column) {
    if (type !== "none" && type !== false) {
      let temp = this.tbody.slice();
      for (let i = 0; i < temp.length; i++) {
        temp[i].unshift(temp[i][column]);
      }
      if (type === "asc") {
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

  /**
   * Handle filter button click
   */
  toggleFilter: function(e) {
    if (
      e === undefined ||
      (this.filterColumn == e.detail.columnNumber && this.filtered)
    ) {
      this.filtered = false;
      this.filterText = null;
      this.filterColumn = null;
    } else {
      this.filterText = e.detail.text;
      this.filterColumn = e.detail.columnNumber;
      this.filtered = true;
    }
  }
});

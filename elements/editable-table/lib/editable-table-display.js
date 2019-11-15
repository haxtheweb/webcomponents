/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
import "@polymer/polymer/lib/elements/dom-if.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@lrnwebcomponents/simple-picker/simple-picker.js";
import { ResponsiveUtilityBehaviors } from "@lrnwebcomponents/responsive-utility/lib/responsive-utility-behaviors.js";
import { displayBehaviors } from "./editable-table-behaviors.js";
import "./editable-table-styles.js";

/**
 * `editable-table-display`
 * ` An editor interface for editable-table`
 * @demo ./demo/editor.html
 *
 * @polymer
 * @customElement
 * @appliesMixin displayBehaviors
 * @appliesMixin ResponsiveUtilityBehaviors
 */
class EditableTableDisplay extends displayBehaviors(
  ResponsiveUtilityBehaviors(PolymerElement)
) {
  static get template() {
    return html`
      <style include="editable-table-styles">
        :host .th-or-td {
          padding: var(--editable-table-cell-padding);
        }
        :host([bordered]) .th {
          border: 1px solid var(--editable-table-border-color);
        }
        :host([striped]) .tbody-tr:nth-child(2n) .th,
        :host([striped]) .tbody-tr:nth-child(2n) .td {
          @apply --editable-table-style-stripe;
        }
        :host([sort]) thead th,
        :host([filter]) tbody td {
          padding: 0;
        }
        :host([column-header]) .thead-tr .th {
          @apply --editable-table-style-column-header;
        }
        :host([row-header]) .tbody-tr .th {
          @apply --editable-table-style-row-header;
        }
        :host([footer]) .tfoot-tr .th,
        :host([footer]) .tfoot-tr .td {
          @apply --editable-table-style-footer;
        }
        #column {
          width: calc(var(--simple-picker-option-size) + 6px);
          overflow: visible;
          display: none;
          margin-left: 10px;
          --simple-picker-border-width: 1px;
          --simple-picker-focus-border-width: 1px;
          --simple-picker-border-color: var(--editable-table-border-color);
        }
        @media screen {
          :host([responsive][responsive-size="xs"]) caption {
            padding: 0;
          }
          :host([responsive][responsive-size="xs"])
            caption
            > div
            > *:not(#column) {
            padding: 0 0 5px;
          }
          :host([responsive][responsive-size="xs"]) caption > div {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
          }
          :host([responsive][responsive-size="xs"]) #column {
            display: inline-flex;
          }
          :host([responsive][responsive-size="xs"]) .th[xs-hidden],
          :host([responsive][responsive-size="xs"]) .td[xs-hidden] {
            display: none;
          }
        }
      </style>
      <iron-ajax
        auto
        url="[[dataCsv]]"
        hidden$="[[!dataCsv]]"
        handle-as="text"
        debounce-duration="500"
        last-response="{{csvData}}"
        on-response="_loadExternalData"
      ></iron-ajax>
      <table id="table" class="table" hidden$="[[hidden]]">
        <caption>
          <div>
            [[caption]]
            <simple-picker
              id="column"
              align-right
              aria-labelledby$="[[tables.0.label]]"
              hide-sample
              value$="{{selected}}"
              on-change="_selectedChanged"
              options="[[options]]"
            >
            </simple-picker>
          </div>
        </caption>
        <thead hidden="[[!columnHeader]]">
          <tr class="tr thead-tr">
            <template
              is="dom-repeat"
              items="[[thead.0]]"
              as="th"
              index-as="index"
              mutable-data
              restamp
            >
              <th
                class="th th-or-td"
                cell-index$="[[index]]"
                numeric$="[[_isNumericColumn(index)]]"
                scope="col"
                xs-hidden$="[[_isColHidden(index,1)]]"
              >
                <template is="dom-if" if="[[sort]]" restamp>
                  <editable-table-sort
                    sort-column$="[[sortColumn]]"
                    column-index="[[index]]"
                    text$="[[_replaceBlankCell(th)]]"
                  ></editable-table-sort>
                </template>
                <template is="dom-if" if="[[!sort]]" restamp
                  >[[_replaceBlankCell(th)]]
                </template>
              </th>
            </template>
          </tr>
        </thead>
        <tbody id="tbody" class="tbody">
          <template
            is="dom-repeat"
            items="[[tbody]]"
            as="tr"
            filter="{{filterRows(filterColumn,filterText)}}"
            mutable-data
            restamp
          >
            <tr class="tr tbody-tr">
              <template
                is="dom-repeat"
                items="[[tr]]"
                as="cell"
                index-as="index"
                mutable-data
                restamp
              >
                <template
                  is="dom-if"
                  if="[[_isRowHeader(rowHeader,index)]]"
                  restamp
                >
                  <th
                    class="th th-or-td"
                    cell-index$="[[index]]"
                    numeric$="[[_isNumericColumn(index)]]"
                    xs-hidden$="[[_isColHidden(index,1)]]"
                    scope="row"
                  >
                    [[_replaceBlankCell(cell)]]
                  </th>
                </template>
                <template
                  is="dom-if"
                  if="[[!_isRowHeader(rowHeader,index)]]"
                  restamp
                >
                  <td
                    class="td cell th-or-td"
                    cell-index$="[[index]]"
                    numeric$="[[_isNumericColumn(index)]]"
                    negative$="[[_isNegative(cell)]]"
                    xs-hidden$="[[_isColHidden(index,1)]]"
                  >
                    <template is="dom-if" if="[[filter]]" restamp>
                      <editable-table-filter
                        column-index="[[index]]"
                        text$="[[_replaceBlankCell(cell)]]"
                        filtered$="[[_isFiltered(index,filterColumn,filtered)]]"
                      ></editable-table-filter>
                    </template>
                    <template is="dom-if" if="[[!filter]]" restamp>
                      <span class="cell">[[_replaceBlankCell(cell)]]</span>
                    </template>
                  </td>
                </template>
              </template>
            </tr>
          </template>
        </tbody>
        <template is="dom-if" if="[[footer]]">
          <tfoot class="tfoot">
            <tr class="tr tfoot-tr">
              <template
                is="dom-repeat"
                items="[[tfoot.0]]"
                as="cell"
                index-as="index"
                mutable-data
                restamp
              >
                <template is="dom-if" if="[[_isRowHeader(rowHeader,index)]]">
                  <th
                    class="th th-or-td"
                    cell-index$="[[index]]"
                    numeric$="[[_isNumericColumn(index)]]"
                    xs-hidden$="[[_isColHidden(index,1)]]"
                    scope="row"
                  >
                    [[_replaceBlankCell(cell)]]
                  </th>
                </template>
                <template is="dom-if" if="[[!_isRowHeader(rowHeader,index)]]">
                  <td
                    class="td cell th-or-td"
                    cell-index$="[[index]]"
                    numeric$="[[_isNumericColumn(index)]]"
                    negative$="[[_isNegative(cell)]]"
                    xs-hidden$="[[_isColHidden(index,1)]]"
                  >
                    [[_replaceBlankCell(cell)]]
                  </td>
                </template>
              </template>
            </tr>
          </tfoot>
        </template>
      </table>
      <div id="htmlImport" hidden><slot></slot></div>
    `;
  }
  static get tag() {
    return "editable-table-display";
  }
  static get properties() {
    return {
      /**
       * Index of the current filter column
       */
      filterColumn: {
        type: Number,
        value: null
      },
      /**
       * Whether table is filtered
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
       * options for the column selector
       */
      options: {
        type: Array,
        computed: "_getTheadOptions(thead)"
      },
      /**
       * Selected column to display when in responsive mode
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
       * Index of the current sort column
       */
      sortColumn: {
        type: Number,
        value: -1
      },
      /**
       * Whether the table is hidden
       */
      hidden: {
        type: Boolean,
        computed: "_hasNoData(data)"
      }
    };
  }

  /**
   * Fires when data changed
   * @event change
   * @param {event} the event
   */
  _dataChanged(newValue, oldValue) {
    if (!newValue || newValue.length < 1 || newValue[0].length < 1) {
      let table = this.children.item(0);
      if (
        typeof table !== typeof undefined &&
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
        detail: newValue
      })
    );
  }

  /**
   * Hides the table if it has no data
   * @param {array} data the table data as an array
   * @returns {boolean} whether the table will be hidden
   */
  _hasNoData(data) {
    return !data || data.length < 1 || data[0].length < 1;
  }

  /**
   * Gets the columns in `<thead>`
   * @param {array} data the table data as an array
   * @param {boolean} columnHeader does the table have a column header
   * @returns {array} the `<thead>`data
   */
  _getTheadOptions(thead) {
    let temp = [];
    if (thead !== undefined && thead !== null && thead.length > 0) {
      for (let i = 1; i < thead[0].length; i++) {
        temp.push([{ alt: thead[0][i], value: i }]);
      }
    }
    return temp;
  }
  /**
   * Determines whether or not a cell is hidden in responsive mode
   * @param {number} index the current column number
   * @param {number} selected the selected column number
   * @returns {boolean} whether the column is hidden (i.e. not the selected column)
   */
  _isColHidden(index, selected = 1) {
    selected = selected || 1;
    return parseInt(index) !== 0 && parseInt(index) !== parseInt(selected);
  }

  /**
   * Sets a column's cells to filtered when in filtered mode so that filter can toggle
   * @param {number} index the current column number
   * @param {number} selected the filtered column number
   * @param {boolean} filtered is the table in filtered mode
   * @returns {boolean} whether the column is filtered
   */
  _isFiltered(column, filterColumn, filtered) {
    return filterColumn !== null && filterColumn === column && filtered;
  }

  /**
   * Sets a cell's negative number style
   * @param {string} cell the cell contents
   * @returns {boolean} whether cell contents are numeric and negative
   */
  _isNegative(cell) {
    return this._isNumeric(cell) && cell.trim().indexOf("-") === 0;
  }

  /**
   * Determines if an entire body column dontains numeric data
   * @param {number} index the column index
   * @returns {boolean} if columns contents are numeric
   */
  _isNumericColumn(index) {
    let numeric = true;
    for (let i = 0; i < this.tbody.length; i++) {
      if (!this._isNumeric(this.tbody[i][index])) numeric = false;
    }
    return numeric;
  }

  /**
   * Calculates whether the cell is a `<th>` or `<td>`
   * @param {boolean} rowHeader if the cell is a rowheader
   * @param {number} index the current column number
   * @returns {boolean} whether the cell is a `<th>` or `<td>`
   */
  _isRowHeader(rowHeader, index) {
    return index === 0 && rowHeader;
  }

  /**
   * Handles table change
   */
  _tableChanged() {
    this._updateCols();
  }

  /**
   * Handles column  selector change
   */
  _selectedChanged() {
    this._updateCols();
  }

  /**
   * Handles sort button click
   * @param {event} e the event
   */
  _changeSortMode(e) {
    if (this.sortColumn === e.detail.columnIndex && this.sortMode === "asc") {
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
    console.log("_changeSortMode", e.detail, this.sortMode);
    this.sortData(this.sortMode, e.detail.columnIndex);
  }

  /**
   * update the responsive columns menu
   */
  _updateCols() {
    let selected = this.shadowRoot.querySelector("#column").value,
      cols = this.shadowRoot.querySelector("#table").querySelectorAll("th,td");
    if (cols.length > 0) {
      for (let i = 0; i < cols.length; i++) {
        let col = cols[i];
        if (this._isColHidden(col.cellIndex, selected)) {
          col.setAttribute("xs-hidden", true);
        } else {
          col.removeAttribute("xs-hidden");
        }
      }
    }
  }

  /**
   * Handle filter based on collumn and text of cell that is clicked
   * @param {number} filterColumn the number of the column to be filtered
   * @param {string} filterText the text that will be filtered
   * @returns
   */
  filterRows(filterColumn, filterText) {
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
  }

  /**
   * initialize the responsive columns menu
   */
  sortData(type, column) {
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
      console.log("sortData", type, column, temp, this.data);
    } else {
      console.log("sortData", type, column, this.data);
    }
  }

  /**
   * Handle filter button click
   */
  toggleFilter(e) {
    if (
      e === undefined ||
      (this.filterColumn == e.detail.columnIndex && this.filtered)
    ) {
      this.filtered = false;
      this.filterText = null;
      this.filterColumn = null;
    } else {
      this.filterText = e.detail.text;
      this.filterColumn = e.detail.columnIndex;
      this.filtered = true;
    }
  }
  constructor() {
    super();
    import("./editable-table-sort.js");
    import("./editable-table-filter.js");
  }
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      this.addEventListener(
        "change-sort-mode",
        this._changeSortMode.bind(this)
      );
      this.addEventListener("toggle-filter", this.toggleFilter.bind(this));
    });
  }
  disconnectedCallback() {
    this.removeEventListener(
      "change-sort-mode",
      this._changeSortMode.bind(this)
    );
    this.removeEventListener("toggle-filter", this.toggleFilter.bind(this));
    super.disconnectedCallback();
  }
}
window.customElements.define(EditableTableDisplay.tag, EditableTableDisplay);
export { EditableTableDisplay };

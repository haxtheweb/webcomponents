/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import {
  displayBehaviors,
  editableTableStyles,
} from "./editable-table-behaviors.js";
import { ResponsiveUtilityBehaviors } from "@lrnwebcomponents/responsive-utility/lib/responsive-utility-behaviors.js";
import "@lrnwebcomponents/simple-picker/simple-picker.js";

/**
 * `editable-table-display`
 * ` An editor interface for editable-table`
 * @demo ./demo/editor.html
 *
 * @polymer
 * @appliesMixin displayBehaviors
 * @element editable-table-display
 * @appliesMixin ResponsiveUtilityBehaviors
 */
class EditableTableDisplay extends displayBehaviors(
  ResponsiveUtilityBehaviors(LitElement)
) {
  static get styles() {
    return [
      ...(super.styles || []),
      ...editableTableStyles,
      css`
        table[sort] .thead .th,
        table[filter] .tbody .td,
        table[filter] .tfoot .td {
          padding-left: 0;
          padding-right: 0;
          padding-top: 0;
          padding-bottom: 0;
        }
        caption {
          padding-top: var(--editable-table-cell-vertical-padding, 10px);
          padding-bottom: var(--editable-table-cell-vertical-padding, 10px);
        }
        #column {
          width: calc(var(--simple-picker-option-size) + 6px);
          overflow: visible;
          display: none;
          margin-left: 10px;
          --simple-picker-border-width: 1px;
          --simple-picker-focus-border-width: 1px;
          --simple-picker-border-color: var(
            --editable-table-border-color,
            #999
          );
        }
        .th,
        .td {
          padding-top: var(--editable-table-cell-vertical-padding, 10px);
          padding-bottom: var(--editable-table-cell-vertical-padding, 10px);
          padding-left: var(--editable-table-cell-horizontal-padding, 6px);
          padding-right: var(--editable-table-cell-horizontal-padding, 6px);
        }
        span.cell {
          display: block;
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
      `,
    ];
  }
  render() {
    return html`
      <table
        id="table"
        ?bordered="${this.bordered}"
        class="table"
        ?column-header="${this.columnHeader}"
        ?column-striped="${this.columnStriped}"
        ?condensed="${this.condensed}"
        ?filter="${this.filter}"
        ?footer="${this.footer}"
        ?hidden="${this.hidden}"
        ?numeric-styles="${this.numericStyles}"
        ?row-header="${this.rowHeader}"
        ?sort="${this.sort}"
        ?striped="${this.striped}"
      >
        <caption>
          <div>
            ${this.getHTML(this.caption)}
            <simple-picker
              id="column"
              align-right
              aria-label="Select Column"
              @change="${this._selectedChanged}"
              hide-sample
              .options="${this.options}"
              .value="${this.selected}"
            >
            </simple-picker>
          </div>
        </caption>
        <thead ?hidden="${!this.columnHeader}" class="thead">
          <tr class="tr thead-tr">
            ${(this.thead[0] || []).map(
              (th, index) => html`
                <th
                  class="th th-or-td"
                  cell-index="${index}"
                  ?numeric="${this._isNumericColumn(index)}"
                  scope="col"
                  ?xs-hidden="${this._isColHidden(index, 1)}"
                >
                  ${!this.sort
                    ? this.getHTML(this._replaceBlankCell(th))
                    : html`
                        <editable-table-sort
                          column-index="${index}"
                          sort-column="${this.sortColumn}"
                        >
                          ${this.getHTML(this._replaceBlankCell(th))}
                        </editable-table-sort>
                      `}
                </th>
              `
            )}
          </tr>
        </thead>
        <tbody class="tbody">
          ${this.tbody.map((tr) =>
            this._isRowFiltered(tr) ? "" : this._tbodyTr(tr)
          )}
        </tbody>
        ${!this.footer
          ? ""
          : html`
              <tfoot class="tfoot">
                ${this._tbodyTr(this.tfoot[0], true, true)}
              </tfoot>
            `}
      </table>
      <div id="htmlImport" hidden><slot></slot></div>
    `;
  }
  static get haxProperties() {
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
  }
  static get tag() {
    return "editable-table-display";
  }
  static get properties() {
    return {
      ...displayBehaviors.properties,
      ...ResponsiveUtilityBehaviors.properties,
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
    };
  }
  constructor() {
    super();
    this.selected = 1;
    this.sortMode = "none";
    this.sortColumn = -1;
    this.filterContains = true;
    import("./editable-table-sort.js");
    import("./editable-table-filter.js");
  }
  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => {
      this.addEventListener(
        "change-sort-mode",
        this._changeSortMode.bind(this)
      );
      this.addEventListener("toggle-filter", this.toggleFilter.bind(this));
    }, 0);
  }
  disconnectedCallback() {
    this.removeEventListener(
      "change-sort-mode",
      this._changeSortMode.bind(this)
    );
    this.removeEventListener("toggle-filter", this.toggleFilter.bind(this));
    super.disconnectedCallback();
  }
  /**
   *
   * Hides table if it has no data
   * @readonly
   * @memberof EditableTableDisplay
   */
  get hidden() {
    return !this.data || this.data.length < 1 || this.data[0].length < 1;
  }

  /**
   *
   * Gets columns in `<thead>`
   * @readonly
   * @memberof EditableTableDisplay
   */
  get options() {
    return (this.thead || []).map((th, i) => {
      return [{ alt: th, value: i }];
    });
  }

  /**
   * Rows in <tbody>
   */
  get tbody() {
    let data = (this.data || []).slice(
        this.columnHeader ? 1 : 0,
        this.footer ? (this.data || []).length - 1 : (this.data || []).length
      ),
      temp;
    if (!this.sortMode || this.sortMode === "none") return data;
    temp = data.sort((a, b) => {
      let aa = a[this.sortColumn || 0],
        bb = b[this.sortColumn || 0],
        swap =
          (this.sortMode === "asc" && aa > bb) ||
          (this.sortMode === "desc" && aa < bb);
      return swap ? 1 : -1;
    });
    return temp;
  }

  /**
   * initialize responsive columns menu
   *
   * @param {string} type  sort order ascending: "asc", descending: "desc", or "non"
   * @param {number} column column number
   * @memberof EditableTableDisplay
   */
  sortData(type, column) {
    if (type !== "none" && type !== false) {
      let temp = this.tbody.map((row) => [row[column], ...row]);
      if (type === "asc") {
        temp.sort();
      } else {
        temp.reverse();
      }
    }
  }

  /**
   * Handle filter button click
   *
   * @param {event} e event
   * @memberof EditableTableDisplay
   */
  toggleFilter(e) {
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
  }

  /**
   * Fires when data changed
   * @event change
   * @param {event} event
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
        detail: newValue,
      })
    );
  }

  /**
   * Handles sort button click
   * @param {event} e event
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
  }

  /**
   * Determines whether or not a cell is hidden in responsive mode
   * @param {number} index current column number
   * @param {number} selected selected column number
   * @returns {boolean} whether column is hidden (i.e. not selected column)
   */
  _isColHidden(index, selected = 1) {
    selected = selected || 1;
    return parseInt(index) !== 0 && parseInt(index) !== parseInt(selected);
  }

  /**
   * Sets a column's cells to filtered when in filtered mode so that filter can toggle
   * @param {number} index current column number
   * @param {number} selected filtered column number
   * @param {boolean} filtered is table in filtered mode
   * @returns {boolean} whether column is filtered
   */
  _isCellFiltered(column, filterColumn, filtered) {
    return !!filterColumn && filterColumn === column && filtered;
  }

  /**
   * Hides a row if filtered
   *
   * @param {array} tr array of cells
   * @returns {boolean} whether row is filtered
   * @memberof EditableTableDisplay
   */
  _isRowFiltered(tr) {
    let filter = (this.filterText || "").trim(),
      cellText = this.filterColumn && tr ? tr[this.filterColumn].trim() : "",
      filtered;
    if (!this.filterCaseSensitive) {
      filter = filter.toLowerCase();
      cellText = cellText.toLowerCase();
    }
    filtered = this.filterContains
      ? !cellText.match(filter)
      : cellText !== filter;
    return filtered;
  }

  /**
   * Calculates whether cell is a `<th>` or `<td>`
   * @param {boolean} rowHeader if cell is a rowheader
   * @param {number} index current column number
   * @returns {boolean} whether cell is a `<th>` or `<td>`
   */
  _isRowHeader(rowHeader, index) {
    return index === 0 && rowHeader;
  }

  /**
   * Handles column  selector change
   */
  _selectedChanged() {
    this._updateCols();
  }

  /**
   * Handles table change
   */
  _tableChanged() {
    this._updateCols();
  }
  /**
   * table row template
   *
   * @param {array} [row=[]] array of cells
   * @param {boolean} [noFilter=false] has filter buttons
   * @param {boolean} [tfoot=false] is a footer row
   * @returns {html}
   * @memberof EditableTableDisplay
   */
  _tbodyTr(row = [], noFilter = false, tfoot = false) {
    return html`
      <tr class="tr ${tfoot ? "tfoot-tr" : "tbody-tr"}">
        ${row.map((cell, index) =>
          this._isRowHeader(this.rowHeader, index)
            ? this._tbodyTh(cell, index)
            : this._tbodyTd(cell, index, noFilter)
        )}
      </tr>
    `;
  }
  /**
   * table header template
   *
   * @param {string} cell cell contents
   * @param {number} index column number
   * @returns {html}
   * @memberof EditableTableDisplay
   */
  _tbodyTh(cell, index) {
    return html` <th
      class="th th-or-td"
      cell-index="${index}"
      ?numeric="${this._isNumericColumn(index)}"
      scope="row"
      ?xs-hidden="${this._isColHidden(index, 1)}"
    >
      ${this.getHTML(this._replaceBlankCell(cell))}
    </th>`;
  }
  /**
   * table cell template
   *
   * @param {*} cell cell contents
   * @param {*} index column number
   * @param {boolean} [noFilter=false] whether to include a filter button
   * @returns {html}
   * @memberof EditableTableDisplay
   */
  _tbodyTd(cell, index, noFilter = false) {
    return html` <td
      class="td th-or-td"
      cell-index="${index}"
      ?numeric="${this._isNumericColumn(index)}"
      ?negative="${this._isNegative(cell)}"
      ?xs-hidden="${this._isColHidden(index, 1)}"
    >
      ${this.filter
        ? html`
            <editable-table-filter
              class="cell"
              column-index="${index}"
              ?filtered="${this._isCellFiltered(
                index,
                this.filterColumn,
                this.filtered
              )}"
            >
              ${this.getHTML(this._replaceBlankCell(cell))}
            </editable-table-filter>
          `
        : !noFilter
        ? html`<span class="cell"
            >${this.getHTML(this._replaceBlankCell(cell))}</span
          >`
        : this.getHTML(this._replaceBlankCell(cell))}
    </td>`;
  }

  /**
   * update responsive columns menu
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
}
window.customElements.define(EditableTableDisplay.tag, EditableTableDisplay);
export { EditableTableDisplay };

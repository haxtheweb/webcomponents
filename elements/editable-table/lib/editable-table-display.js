/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import {
  displayBehaviors,
  editableTableDisplayStyles,
} from "./editable-table-behaviors.js";
import { ResponsiveUtilityBehaviors } from "@lrnwebcomponents/responsive-utility/lib/responsive-utility-behaviors.js";
import "@lrnwebcomponents/simple-picker/simple-picker.js";

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
class EditableTableDisplay extends displayBehaviors(
  ResponsiveUtilityBehaviors(LitElement)
) {
  static get styles() {
    return [...(super.styles || []), ...editableTableDisplayStyles];
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
            <div>${this.getHTML(this.caption)}</div>
            ${!this.disableResponsive
              ? html` <simple-picker
                  id="column"
                  align-right
                  aria-label="Select Column"
                  @change="${this._selectedChanged}"
                  hide-sample
                  .options="${this.options}"
                  .value="${this.selected}"
                >
                </simple-picker>`
              : ``}
            ${!this.downloadable
              ? ""
              : html`
                  <button id="download" @click="${this.download}">
                    <span class="sr-only">Download as CSV.</span>
                    <simple-icon-lite icon="file-download"></simple-icon-lite>
                  </button>
                  <simple-tooltip
                    id="download-tooltip"
                    for="download"
                    aria-hidden="true"
                    >Download as CSV.
                  </simple-tooltip>
                `}
            ${!this.printable
              ? ""
              : html`
                  <button id="print" @click="${this.print}">
                    <span class="sr-only">Print table.</span>
                    <simple-icon-lite icon="print"></simple-icon-lite>
                  </button>
                  <simple-tooltip
                    id="print-tooltip"
                    for="print"
                    aria-hidden="true"
                    >Print table.
                  </simple-tooltip>
                `}
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
    // notice changes and update the data to match
    this._observer = new MutationObserver((mutations) => {
      if (this.shadowRoot) {
        this.importHTML(this.children.item(0));
      }
    });
    this._observer.observe(this, {
      childList: true,
      subtree: true,
    });
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
    let head = this.thead || [[]],
      cols = (head[0] || []).map((th, i) => {
        return [{ alt: th, value: i }];
      });
    return cols;
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
    return html`<th
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
    return html`<td
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

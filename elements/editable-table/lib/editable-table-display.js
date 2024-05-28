/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import {
  displayBehaviors,
  editableTableDisplayStyles,
} from "./editable-table-behaviors.js";
import { ResponsiveUtilityBehaviors } from "@haxtheweb/responsive-utility/lib/responsive-utility-behaviors.js";
import "@haxtheweb/simple-picker/simple-picker.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";

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
  ResponsiveUtilityBehaviors(DDD),
) {
  static get styles() {
    return [
      ...(super.styles || []),
      ...editableTableDisplayStyles,
      css`
        :host([hidden]),
        :host([disabled]) {
          display: none !important;
        }
        [part="caption"] simple-toolbar-button {
          --simple-toolbar-button-bg: var(--editable-table-bg-color, #fff);
          --simple-toolbar-button-toggled-bg: var(
            --editable-table-stripe-bg-color,
            #f0f0f0
          );
          --simple-toolbar-button-hover-bg: var(
            --editable-table-bg-color,
            #fff
          );
          --simple-toolbar-button-border-color: var(
            --editable-table-border-color,
            #999
          );
          --simple-toolbar-button-toggled-border-color: var(
            --editable-table-color,
            #222
          );
          --simple-toolbar-button-hover-border-color: unset;
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
        ?hidden="${this.hidden || this.disabled}"
        ?numeric-styles="${this.numericStyles}"
        ?row-header="${this.rowHeader}"
        ?sort="${this.sort}"
        ?striped="${this.striped}"
        part="table"
      >
        <caption part="caption">
          <div>
            <div>${this.getHTML(this.caption)}</div>
            <div>
              ${!this.downloadable
                ? ""
                : html`
                    <simple-toolbar-button
                      id="download"
                      icon="file-download"
                      label="Download as CSV."
                      @click="${this.download}"
                    >
                    </simple-toolbar-button>
                  `}
              ${!this.printable
                ? ""
                : html`
                    <simple-toolbar-button
                      id="print"
                      icon="print"
                      label="Print Table"
                      @click="${this.print}"
                    >
                    </simple-toolbar-button>
                  `}
            </div>
          </div>
        </caption>
        <thead ?hidden="${!this.columnHeader}" class="thead" part="thead">
          <tr class="tr thead-tr" part="tr">
            ${(this.thead[0] || []).map(
              (th, index) => html`
                <th
                  class="th th-or-td"
                  cell-index="${index}"
                  ?numeric="${this._isNumericColumn(index)}"
                  scope="col"
                  part="th"
                  ?xs-hidden="${this._isColHidden(index, this.selected || 1)}"
                >
                  ${!this.sort
                    ? this.getHTML(this._replaceBlankCell(th))
                    : html`
                        <editable-table-sort
                          column-index="${index}"
                          sort-column="${this.sortColumn}"
                          sort-mode="${this.sortColumn === index
                            ? this.sortMode
                            : "none"}"
                        >
                          ${this.getHTML(this._replaceBlankCell(th))}
                        </editable-table-sort>
                      `}
                  ${!this.disableResponsive &&
                  index > 0 &&
                  this.selected == index
                    ? html` <simple-picker
                          id="simple-picker-${index}"
                          class="column"
                          align-right
                          aria-label="Select Column"
                          @change="${this._selectedChanged}"
                          hide-sample
                          .options="${this.options}"
                          .value="${index}"
                        >
                        </simple-picker>
                        <simple-tooltip
                          position="top"
                          for="simple-picker-${index}"
                          aria-hidden="true"
                          >Select Column</simple-tooltip
                        >`
                    : ``}
                </th>
              `,
            )}
          </tr>
        </thead>
        <tbody class="tbody" part="tbody">
          ${this.sortedTbody.map((tr) =>
            this._isRowFiltered(tr) ? "" : this._tbodyTr(tr),
          )}
        </tbody>
        ${!this.footer
          ? ""
          : html`
              <tfoot class="tfoot" part="tfoot">
                ${this._tbodyTr(this.tfoot[0], true, true)}
              </tfoot>
            `}
      </table>
      <div id="htmlImport" hidden><slot></slot></div>
    `;
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

  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "data")
        this.disabled =
          !this.data || this.data.length < 1 || this.data[0].length < 1;
      if (
        ["disabled", "hidden"].includes(propName) &&
        !this.hidden &&
        !this.disabled
      ) {
        this.toggleFilter();
      }
    });
  }
  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => {
      this.addEventListener(
        "change-sort-mode",
        this._changeSortMode.bind(this),
      );
      this.addEventListener("toggle-filter", this.toggleFilter.bind(this));
    }, 0);
  }
  disconnectedCallback() {
    this.removeEventListener(
      "change-sort-mode",
      this._changeSortMode.bind(this),
    );
    this.removeEventListener("toggle-filter", this.toggleFilter.bind(this));
    super.disconnectedCallback();
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

  get sortedTbody() {
    if (this.sortMode !== "none" && this.sortMode !== false) {
      let temp = this.tbody.map((row) => [row[this.sortColumn], ...row]);
      if (this.sortMode === "asc") {
        temp.sort();
      } else {
        temp.reverse();
      }
      return temp.map((row) => row.slice(1, row.length));
    }
    return this.tbody;
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
      this.filterText = e.detail.text;
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
      }),
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
  _selectedChanged(e) {
    if (!!e.detail.value) this.selected = e.detail.value;
  }

  /**
   * Handles table change
   */
  _tableChanged() {
    this.selected = 1;
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
            : this._tbodyTd(cell, index, noFilter),
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
      ?xs-hidden="${this._isColHidden(index, this.selected || 1)}"
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
      part="td"
      class="td th-or-td"
      cell-index="${index}"
      ?numeric="${this._isNumericColumn(index)}"
      ?negative="${this._isNegative(cell)}"
      ?xs-hidden="${this._isColHidden(index, this.selected || 1)}"
    >
      ${this.filter
        ? html`
            <editable-table-filter
              class="cell"
              column-index="${index}"
              text="${this._replaceBlankCell(cell)}"
              ?toggled="${this._isCellFiltered(
                index,
                this.filterColumn,
                this.filtered,
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
  _updateCols(index) {
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
customElements.define(EditableTableDisplay.tag, EditableTableDisplay);
export { EditableTableDisplay };

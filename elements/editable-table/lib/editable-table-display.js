/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css, nothing } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { displayBehaviors } from "./editable-table-behaviors.js";
import { ResponsiveUtilityBehaviors } from "@haxtheweb/responsive-utility/lib/responsive-utility-behaviors.js";
import "@haxtheweb/simple-picker/simple-picker.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";
import { DDDVariables } from "@haxtheweb/d-d-d/lib/DDDStyles.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import {
  DDDBlockStyles,
  renderDDDBlockHeader,
} from "@haxtheweb/d-d-d/lib/DDDBlock.js";
import { DDDTableStyles } from "@haxtheweb/d-d-d/lib/DDDTable.js";

/**
 * `editable-table-display`
 * `An editor interface for editable-table
 *
 * @demo ./demo/editor.html
 * @customElement
 * @extends displayBehaviors
 * @extends ResponsiveUtilityBehaviors
 * @extends LitElement
 */
class EditableTableDisplay extends I18NMixin(
  displayBehaviors(ResponsiveUtilityBehaviors(DDD)),
) {
  static get styles() {
    return [
      DDDVariables,
      super.styles,
      DDDBlockStyles,
      DDDTableStyles,
      css`
        /* the table takes the shared DDD table look (DDDTable.js); the
           editable-table custom properties still win when they are set */
        :host {
          display: block;
          width: 100%;
          max-width: 100%;
          margin: var(--ddd-spacing-4) 0;
          font-size: var(--editable-table-font-size, unset);
          font-family: var(--editable-table-font-family, inherit);
          color: var(
            --editable-table-color,
            light-dark(
              var(--ddd-theme-default-coalyGray),
              var(--ddd-theme-default-white)
            )
          );
          background-color: var(--editable-table-bg-color, transparent);
        }
        :host([hidden]),
        :host([disabled]) {
          display: none !important;
        }
        @media screen {
          :host([responsive]) {
            overflow-x: visible;
          }
        }
        .offscreen {
          position: absolute;
          inset-inline-start: -9999px;
          font-size: 0;
          height: 0;
          width: 0;
          overflow: hidden;
          margin: 0;
          padding: 0;
        }
        table.ddd-table {
          --ddd-table-color: var(--editable-table-color);
          --ddd-table-background: var(--editable-table-bg-color);
          --ddd-table-font-family: var(--editable-table-font-family);
          --ddd-table-font-size: var(--editable-table-font-size);
          --ddd-table-divider: var(--editable-table-border-color);
          --ddd-table-header-background: var(--editable-table-heading-bg-color);
          --ddd-table-header-color: var(--editable-table-heading-color);
          --ddd-table-row-header-color: var(--editable-table-heading-color);
          --ddd-table-stripe-background: var(--editable-table-stripe-bg-color);
          --ddd-table-caption-color: var(--editable-table-caption-color);
          --ddd-table-cell-padding-block: var(
            --editable-table-cell-vertical-padding
          );
          --ddd-table-cell-padding-inline: var(
            --editable-table-cell-horizontal-padding
          );
          --ddd-table-cell-padding-block-condensed: var(
            --editable-table-cell-vertical-padding-condensed
          );
          --ddd-table-cell-padding-inline-condensed: var(
            --editable-table-cell-horizontal-padding-condensed
          );
          font-weight: var(
            --editable-table-light-weight,
            var(--ddd-font-weight-regular, 400)
          );
        }
        table.ddd-table thead th {
          font-weight: var(
            --editable-table-heavy-weight,
            var(--ddd-font-weight-bold, 700)
          );
        }
        /* numeric-styles keeps its meaning: numeric columns right-aligned
           (now the default) and negative numbers in red */
        table[numeric-styles] .th-or-td[numeric] {
          text-align: end;
          font-variant-numeric: tabular-nums;
        }
        table[numeric-styles] .td[negative] .cell,
        table[numeric-styles] .tfoot-tr .th-or-td[negative] {
          color: var(
            --editable-table-negative-color,
            light-dark(
              var(--ddd-theme-default-original87Pink),
              var(--ddd-theme-default-discoveryCoral)
            )
          );
        }
        span.cell {
          display: block;
        }
        editable-table-sort,
        editable-table-filter {
          text-align: inherit;
        }
        .column {
          width: calc(var(--simple-picker-option-size) + 6px);
          overflow: visible;
          display: none;
          margin-inline-end: 0px;
          --simple-picker-border-width: 1px;
          --simple-picker-focus-border-width: 1px;
          --simple-picker-border-color: var(
            --editable-table-border-color,
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-theme-default-slateGray)
            )
          );
        }
        @media screen {
          :host([responsive][responsive-size="xs"]) .column {
            display: inline-flex;
            width: 30px;
            overflow: visible;
          }
          :host([responsive][responsive-size="xs"]) .th[xs-hidden],
          :host([responsive][responsive-size="xs"]) .td[xs-hidden] {
            display: none;
          }
        }
        .ddd-block-body {
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
          overflow-x: auto;
        }
        .embedded-scroll {
          overflow-x: auto;
        }
        .embedded-actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--ddd-spacing-1);
          margin-bottom: var(--ddd-spacing-2);
        }
        /* the caption is the table's name for assistive technology; the
           block header already shows it, so it is not drawn twice */
        caption.visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        [part="caption"] simple-toolbar-button {
          --simple-toolbar-button-bg: var(
            --editable-table-bg-color,
            light-dark(
              var(--ddd-theme-default-white, #fff),
              var(--ddd-theme-default-coalyGray, #262626)
            )
          );
          --simple-toolbar-button-toggled-bg: var(
            --editable-table-stripe-bg-color,
            light-dark(
              var(--ddd-theme-default-limestoneMaxLight, #f0f0f0),
              var(--ddd-theme-default-black, #000)
            )
          );
          --simple-toolbar-button-hover-bg: var(
            --editable-table-bg-color,
            light-dark(
              var(--ddd-theme-default-white, #fff),
              var(--ddd-theme-default-coalyGray, #262626)
            )
          );
          --simple-toolbar-button-border-color: var(
            --editable-table-border-color,
            light-dark(
              var(--ddd-theme-default-coalyGray, #999),
              var(--ddd-theme-default-limestoneGray, #a2aaad)
            )
          );
          --simple-toolbar-button-toggled-border-color: var(
            --editable-table-color,
            light-dark(
              var(--ddd-theme-default-coalyGray, #222),
              var(--ddd-theme-default-limestoneLight, #e4e5e7)
            )
          );
          --simple-toolbar-button-hover-border-color: unset;
        }
      `,
    ];
  }
  /**
   * Download, copy and print, as round DDD block header actions. The ids
   * match the toolbar buttons these replace.
   */
  _renderBlockActions() {
    const action = (on, id, icon, label, fn) =>
      on
        ? html`<button
            type="button"
            class="ddd-block-action"
            id="${id}"
            aria-label="${label}"
            title="${label}"
            @click="${fn}"
          >
            <simple-icon-lite
              icon="${icon}"
              aria-hidden="true"
            ></simple-icon-lite>
          </button>`
        : nothing;
    return html`${action(
      this.downloadable,
      "download",
      "icons:file-download",
      this.t.downloadAsCsv,
      this.download,
    )}${action(
      this.copyable,
      "copy",
      "icons:content-copy",
      this.t.copyAsCsv,
      this.copy,
    )}${action(
      this.printable,
      "print",
      "icons:print",
      this.t.printTable,
      this.print,
    )}`;
  }

  get _hasCaption() {
    return !!(
      this.caption &&
      this.caption !== "null" &&
      this.caption !== "undefined" &&
      String(this.caption).trim() !== ""
    );
  }

  render() {
    const table = this._renderTable();
    if (this.hideBlockHeader) {
      // embedded in another block: that block's header names the table, so
      // only the actions stay visible, in a small row above it
      return html`${
          this.downloadable || this.copyable || this.printable
            ? html`<div class="embedded-actions">
                ${this._renderBlockActions()}
              </div>`
            : nothing
        }
        <div class="embedded-scroll">${table}</div>
        <div id="htmlImport" hidden><slot></slot></div>`;
    }
    return html`
      <div class="ddd-block" part="frame" role="group" aria-labelledby="hdr">
        ${renderDDDBlockHeader({
          id: "hdr",
          icon: "editor:border-all",
          label: this.t.dataTable,
          title: this._hasCaption ? this.getHTML(this.caption) : "",
          actions:
            this.downloadable || this.copyable || this.printable
              ? this._renderBlockActions()
              : "",
        })}
        <div class="ddd-block-body">${table}</div>
      </div>
      <div id="htmlImport" hidden><slot></slot></div>
    `;
  }

  _renderTable() {
    // which columns hold numbers, worked out once per render for the
    // right-aligned, tabular-digit DDD number style
    const cols = (this.data && this.data[0] ? this.data[0] : []).length;
    this._numberColumns = [];
    for (let i = 0; i < cols; i++) {
      this._numberColumns.push(this._isNumberColumn(i));
    }
    return html`
      <table
        id="table"
        ?bordered="${this.bordered}"
        class="table ddd-table"
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
        <caption part="caption" class="visually-hidden">
          ${this._hasCaption ? this.getHTML(this.caption) : ""}
        </caption>
        <thead ?hidden="${!this.columnHeader}" class="thead" part="thead">
          <tr class="tr thead-tr" part="tr">
            ${(this.thead[0] || []).map(
              (th, index) => html`
                <th
                  class="th th-or-td"
                  cell-index="${index}"
                  ?numeric="${this._isNumericColumn(index)}"
                  ?data-numeric="${this._isNumberCol(index)}"
                  scope="col"
                  part="th"
                  ?xs-hidden="${this._isColHidden(index, this.selected || 1)}"
                >
                  ${
                    !this.sort
                      ? this.getHTML(this._replaceBlankCell(th))
                      : html`
                          <editable-table-sort
                            column-index="${index}"
                            sort-column="${this.sortColumn}"
                            sort-mode="${
                              this.sortColumn === index ? this.sortMode : "none"
                            }"
                          >
                            ${this.getHTML(this._replaceBlankCell(th))}
                          </editable-table-sort>
                        `
                  }
                  ${
                    !this.disableResponsive &&
                    index > 0 &&
                    this.selected == index
                      ? html` <simple-picker
                            id="simple-picker-${index}"
                            class="column"
                            align-right
                            aria-label="${this.t.selectColumn}"
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
                            >${this.t.selectColumn}</simple-tooltip
                          >`
                      : ``
                  }
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
        ${
          !this.footer
            ? ""
            : html`
                <tfoot class="tfoot" part="tfoot">
                  ${this._tbodyTr(this.tfoot[0], true, true)}
                </tfoot>
              `
        }
      </table>
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
       * Render without the DDD block frame and header, for a table embedded
       * in another block that already names it (ics-render, vcf-render): the
       * caption stays the table's accessible name, visually hidden, and
       * download / copy / print show as a small row above the table.
       */
      hideBlockHeader: {
        type: Boolean,
        attribute: "hide-block-header",
        reflect: true,
      },
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
    this.t = this.t || {};
    this.t = {
      ...this.t,
      downloadAsCsv: "Download as CSV.",
      copyAsCsv: "Copy as CSV.",
      printTable: "Print Table",
      selectColumn: "Select Column",
      dataTable: "Data · Table",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../locales/", import.meta.url).href,
    });
    this.hideBlockHeader = false;
    this.selected = 1;
    this.sortMode = "none";
    this.sortColumn = -1;
    this.filterContains = true;
    this.__boundChangeSortMode = this._changeSortMode.bind(this);
    this.__boundToggleFilter = this.toggleFilter.bind(this);
    import("./editable-table-sort.js");
    import("./editable-table-filter.js");
    // notice changes and update the data to match
    this._observer = new MutationObserver((_mutations) => {
      if (this.shadowRoot) {
        // eslint-disable-next-line wc/no-constructor-attributes -- runs inside the observer callback, after construction
        this.importHTML(this.children.item(0));
      }
    });
  }

  willUpdate(changedProperties) {
    if (super.willUpdate) super.willUpdate(changedProperties);
    // Derive disabled from data, and reset filter state when the table
    // becomes visible/enabled, in willUpdate so reactive sets batch into
    // the current update cycle. Setting these in updated() scheduled a
    // redundant second update (Lit change-in-update warning).
    //
    // Only derive disabled from REAL data transitions. Deriving it from
    // the initial empty-data placeholder (the constructor's data = [])
    // disables the table before first paint; when real data then lands and
    // re-enables it, the host flips through display:none (0x0) and back,
    // feeding a resize cycle into responsive-utility's ResizeObserver and
    // the [responsive-size] CSS reflow. With many tables on a page that
    // exhausts the browser resize loop budget and raises a window
    // "ResizeObserver loop completed with undelivered notifications"
    // error (issue #3077). A table that never receives data simply stays
    // enabled and renders its empty markup instead of self-hiding.
    if (changedProperties.has("data")) {
      let old = changedProperties.get("data"),
        wasReal = !!(old && old.length > 0 && old[0] && old[0].length > 0),
        isReal = !!(
          this.data &&
          this.data.length > 0 &&
          this.data[0] &&
          this.data[0].length > 0
        );
      if (wasReal || isReal) {
        this.disabled = !isReal;
      }
    }
    if (
      (changedProperties.has("disabled") || changedProperties.has("hidden")) &&
      !this.hidden &&
      !this.disabled
    ) {
      // Mirror toggleFilter()'s no-argument reset path (the same branch
      // updated() used) without calling the event-handler method itself.
      this.filtered = false;
      this.filterText = undefined;
      this.filterColumn = undefined;
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this._observer.observe(this, {
      childList: true,
      subtree: true,
    });
    this.addEventListener("change-sort-mode", this.__boundChangeSortMode);
    this.addEventListener("toggle-filter", this.__boundToggleFilter);
  }
  disconnectedCallback() {
    this._observer.disconnect();
    this.removeEventListener("change-sort-mode", this.__boundChangeSortMode);
    this.removeEventListener("toggle-filter", this.__boundToggleFilter);
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
      let temp = this.tbody.map((row) => [
        this._sortValue(row[this.sortColumn]),
        ...row,
      ]);
      temp.sort((a, b) => this._compareSortValues(a[0], b[0]));
      if (this.sortMode === "desc") {
        temp.reverse();
      }
      return temp.map((row) => row.slice(1, row.length));
    }
    return this.tbody;
  }

  /**
   * Resolves the value used to sort a cell. Cells may embed an explicit
   * `data-sort-value` attribute (e.g.
   * `<span data-sort-value="1700000000000">6 days ago</span>` or
   * `<span data-sort-value="2097152">2 MB</span>`) so that human-readable,
   * formatted text (relative dates, byte sizes, currency, etc.) sorts by its
   * underlying numeric value instead of alphabetically. Falls back to
   * existing numeric-cell detection, then to a case-insensitive string value.
   * @param {string} cell cell contents (may contain HTML)
   * @returns {number|string} value to compare when sorting
   */
  _sortValue(cell) {
    if (cell === undefined || cell === null) return "";
    let str = String(cell);
    let explicit = this._explicitSortValue(str);
    if (explicit !== undefined) return explicit;
    if (this._isNumericCell(str)) {
      return parseFloat(str.trim().replace(/\$/g, "").replace(/,/g, ""));
    }
    return str.trim().toLowerCase();
  }

  /**
   * Looks for a `data-sort-value` attribute on the cell's markup and returns
   * its parsed value (numeric when possible), or `undefined` when no
   * explicit sort value is present.
   * @param {string} str cell contents as a string, possibly with HTML
   * @returns {number|string|undefined} explicit sort value, if any
   */
  _explicitSortValue(str) {
    if (!str || str.indexOf("data-sort-value") === -1) return undefined;
    let fragment = this.getHTML(str),
      el =
        fragment && fragment.querySelector
          ? fragment.querySelector("[data-sort-value]")
          : null;
    if (!el) return undefined;
    let raw = el.getAttribute("data-sort-value");
    if (raw === null || raw.trim() === "") return undefined;
    return !isNaN(raw.trim())
      ? parseFloat(raw.trim())
      : raw.trim().toLowerCase();
  }

  /**
   * Compares two resolved sort values, numerically when both are numbers,
   * otherwise as case-insensitive, numeric-aware strings.
   * @param {number|string} a first value
   * @param {number|string} b second value
   * @returns {number} negative, zero, or positive per standard compare semantics
   */
  _compareSortValues(a, b) {
    let aIsNum = typeof a === "number" && !isNaN(a),
      bIsNum = typeof b === "number" && !isNaN(b);
    if (aIsNum && bIsNum) return a - b;
    if (aIsNum !== bIsNum) return aIsNum ? -1 : 1;
    return String(a).localeCompare(String(b), undefined, {
      numeric: true,
      sensitivity: "base",
    });
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
  _dataChanged(newValue, _oldValue) {
    if (!newValue || newValue.length < 1 || newValue[0].length < 1) {
      let table =
        this.children && this.children.item ? this.children.item(0) : null;
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
    if (e.detail.value) this.selected = e.detail.value;
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
      ?data-numeric="${this._isNumberCol(index)}"
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
      ?data-numeric="${this._isNumberCol(index)}"
      ?negative="${this._isNegative(cell)}"
      ?xs-hidden="${this._isColHidden(index, this.selected || 1)}"
    >
      ${
        this.filter
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
            : this.getHTML(this._replaceBlankCell(cell))
      }
    </td>`;
  }

  /**
   * Whether a column holds numbers (right-aligned, tabular digits), from
   * the per-render cache with a direct check as the fallback
   * @param {number} index column number
   * @returns {boolean}
   */
  _isNumberCol(index) {
    return this._numberColumns && index < this._numberColumns.length
      ? this._numberColumns[index]
      : this._isNumberColumn(index);
  }

  /**
   * update responsive columns menu
   */
  _updateCols() {
    // the column picker is rendered as class="column" inside #table
    // (id="simple-picker-<index>"), not as id="column"
    let table = this.shadowRoot
        ? this.shadowRoot.querySelector("#table")
        : null,
      picker = table ? table.querySelector(".column") : null;
    if (!table || !picker) return;
    let selected = picker.value,
      cols = table.querySelectorAll("th,td");
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
globalThis.customElements.define(
  EditableTableDisplay.tag,
  EditableTableDisplay,
);
export { EditableTableDisplay };

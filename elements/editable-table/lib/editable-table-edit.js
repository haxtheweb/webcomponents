/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import {
  displayBehaviors,
  editBehaviors,
  editableTableStyles,
} from "./editable-table-behaviors.js";
import "@haxtheweb/rich-text-editor/rich-text-editor.js";
import "@haxtheweb/rich-text-editor/lib/toolbars/rich-text-editor-toolbar-mini.js";
import "@haxtheweb/simple-toolbar/simple-toolbar.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import "./editable-table-editor-rowcol.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-button-group.js";
import { ReplaceWithPolyfill } from "@haxtheweb/utils/utils.js";

if (!Element.prototype.replaceWith) {
  Element.prototype.replaceWith = ReplaceWithPolyfill;
}
if (!CharacterData.prototype.replaceWith) {
  CharacterData.prototype.replaceWith = ReplaceWithPolyfill;
}
if (!DocumentType.prototype.replaceWith) {
  DocumentType.prototype.replaceWith = ReplaceWithPolyfill;
}

/**
 * `editable-table-edit`
 * An editor interface for tables that toggles between view mode.
 *
 * @customElement
 * @element editable-table-edit
 * @extends editBehaviors
 * @extends ResponsiveUtilityBehaviors
 * @extends editableTableStyles
 */
class EditableTableEdit extends editBehaviors(DDD) {
  static get styles() {
    return [
      ...(super.styles || []),
      ...editableTableStyles,
      css`
        :host {
          --paper-listbox-background-color: var(
            --editable-table-rowcol-bg-color
          );
        }
        :host([disabled]) {
          display: none;
          pointer-events: none;
          cursor: not-allowed;
        }
        .filter-icon,
        .sortable-icon {
          display: none;
          opacity: 0.4;
          width: var(--ddd-icon-xxs);
          height: var(--ddd-icon-xxs);
        }
        :host([sort]) tbody .tr:first-child .sortable-icon,
        :host([filter]) tbody .tr:not(:first-of-type) .filter-icon {
          display: inline-block;
          opacity: 0.25;
        }
        table {
          min-width: calc(100% - 2.3px);
          width: unset;
          height: 1px;
        }
        caption {
          width: 100%;
          padding: 0;
          margin: 0;
          color: var(
            --editable-table-caption-color,
            var(--editable-table-color, #222)
          );
        }
        table *[data-expanded="true"] {
          z-index: 2;
        }
        rich-text-editor:not([contenteditable]) {
          z-index: 1 !important;
        }
        caption,
        .th-or-td {
          border: var(--ddd-border-xs);
          border-color: var(--ddd-theme-default-limestoneGray);
        }
        label,
        .label {
          color: var(--editable-table-secondary-text-color, #444);
          font-size: var(
            --editable-table-secondary-font-size,
            var(--ddd-font-size-4xs)
          );
          font-family: var(
            --editable-table-secondary-font-family,
            var(--ddd-font-primary)
          );
          margin-right: 0.5em;
        }
        simple-toolbar {
          width: 100%;
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
        simple-toolbar::part(buttons) {
          align-items: stretch;
          justify-content: space-between;
        }
        .group {
          padding: 0;
          margin: 0;
          transition: all 2s;
          color: var(
            --editable-table-caption-color,
            var(--editable-table-color, #222)
          );
        }
        .group:not([hidden]) {
          display: flex;
          flex: 0 0 auto;
          justify-content: space-around;
          align-items: center;
          margin: 0 var(--ddd-spacing-1);
        }
        caption {
          position: relative;
        }
        caption > * {
          margin: 0 var(--ddd-spacing-1);
        }
        #caption {
          flex: 1 1 auto;
        }
        .caption-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .icons {
          flex: 0 0 auto;
          opacity: 0.25;
        }
        th {
          padding: 0;
          border-width: var(--editable-table-border-width, 1px);
          border-style: var(--editable-table-border-style, solid);
          border-color: var(--editable-table-border-color, #999);
        }
        td {
          margin: 0;
          padding: 0;
          position: relative;
        }
        rich-text-editor-toolbar-mini {
          position: absolute;
          min-width: 200px;
          height: 0;
        }
        rich-text-editor {
          margin-bottom: 1px;
          padding: var(
              --editable-table-cell-vertical-padding,
              var(--ddd-spacing-3)
            )
            var(--editable-table-cell-horizontal-padding, var(--ddd-spacing-2));
          border: none !important;
          margin-right: var(--ddd-spacing-6);
          --rich-text-editor-min-height: 12px;
        }
        rich-text-editor[contenteditable="true"].heightmax {
          overflow-y: auto;
        }
        rich-text-editor:hover,
        rich-text-editor:focus,
        rich-text-editor:focus-within {
          border: none !important;
          outline: none !important;
        }
        td .icon-container {
          position: absolute;
          right: 0;
          top: calc(50% - 12px);
          width: var(--ddd-icon-xxs);
        }
        td simple-icon-lite {
          width: var(--ddd-icon-xxs);
        }
        td:focus-within {
          outline: 1px dotted currentColor;
        }
        .th:first-child {
          width: 96px;
        }
        :host([responsive]) thead th:nth-of-type(3),
        :host([responsive]) .tr td:nth-of-type(2) {
          border-right-width: calc(var(--editable-table-border-width) + 5px);
          border-right-style: double;
        }
        :host(:hover),
        *:hover {
          z-index: 3;
        }
        :host(:focus-within),
        *:focus-within {
          z-index: 4;
        }
        editable-table-editor-rowcol:hover,
        editable-table-editor-rowcol:focus-within {
          z-index: 10000000;
        }
      `,
    ];
  }
  get textEditorToolbar() {
    return html`
      <rich-text-editor-toolbar-mini
        id="editable-table-toolbar"
        .config="${this.config}"
        show="selection"
        part="text-editor-toolbar"
      ></rich-text-editor-toolbar-mini>
    `;
  }
  get columnHeaderButton() {
    return html`
      <simple-toolbar-button
        id="columnHeader"
        icon="editable-table:column-headers"
        label="First row has column headers."
        @button-toggled="${this._onTableSettingChange}"
        part="simple-toolbar-button"
        ?toggled="${this.columnHeader}"
        toggles
      >
      </simple-toolbar-button>
    `;
  }
  get rowHeaderButton() {
    return html`
      <simple-toolbar-button
        id="rowHeader"
        icon="editable-table:row-headers"
        label="First column has row headers."
        @button-toggled="${this._onTableSettingChange}"
        part="simple-toolbar-button"
        ?toggled="${this.rowHeader}"
        toggles
      >
      </simple-toolbar-button>
    `;
  }
  get footerButton() {
    return html`
      <simple-toolbar-button
        id="footer"
        icon="editable-table:footer"
        label="Last row is a footer."
        @button-toggled="${this._onTableSettingChange}"
        part="simple-toolbar-button"
        ?toggled="${this.footer}"
        toggles
      >
      </simple-toolbar-button>
    `;
  }
  get footerButton() {
    return html`
      <simple-toolbar-button
        id="footer"
        icon="editable-table:footer"
        label="Last row is a footer."
        @button-toggled="${this._onTableSettingChange}"
        part="simple-toolbar-button"
        ?toggled="${this.footer}"
        toggles
      >
      </simple-toolbar-button>
    `;
  }
  get headersFootersGroup() {
    return html`
      <div class="group" part="simple-toolbar-section">
        <div class="label" part="simple-toolbar-section-label">
          Headers and footers
        </div>
        ${this.columnHeaderButton} ${this.rowHeaderButton} ${this.footerButton}
      </div>
    `;
  }
  get borderButton() {
    return html`
      <simple-toolbar-button
        id="bordered"
        ?disabled="${this.hideBordered}"
        ?hidden="${this.hideBordered}"
        icon="image:grid-on"
        label="Borders."
        @button-toggled="${this._onTableSettingChange}"
        part="simple-toolbar-button"
        ?toggled="${this.bordered}"
        toggles
      >
      </simple-toolbar-button>
    `;
  }
  get stripeButton() {
    return html`
      <simple-toolbar-button
        id="striped"
        ?disabled="${this.hideStriped}"
        ?hidden="${this.hideStriped}"
        icon="editable-table:row-striped"
        label="Alternating rows."
        @button-toggled="${this._onTableSettingChange}"
        part="simple-toolbar-button"
        ?toggled="${this.striped}"
        toggles
        radio
      >
      </simple-toolbar-button>
    `;
  }
  get columnStripeButton() {
    return html`
      <simple-toolbar-button
        id="columnStriped"
        ?disabled="${this.hideStriped}"
        ?hidden="${this.hideStriped}"
        icon="editable-table:col-striped"
        label="Alternating columns."
        @button-toggled="${this._onTableSettingChange}"
        part="simple-toolbar-button"
        ?toggled="${this.columnStriped}"
        toggles
        radio
      >
      </simple-toolbar-button>
    `;
  }
  get condenseButton() {
    return html`
      <simple-toolbar-button
        id="condensed"
        ?disabled="${this.hideCondensed}"
        ?hidden="${this.hideCondensed}"
        icon="editable-table:row-condensed"
        label="Condensed rows."
        @button-toggled="${this._onTableSettingChange}"
        part="simple-toolbar-button"
        ?toggled="${this.condensed}"
        toggles
      >
      </simple-toolbar-button>
    `;
  }
  get numericStylesButton() {
    return html`
      <simple-toolbar-button
        id="numericStyles"
        ?disabled="${this.hideNumericStyles}"
        ?hidden="${this.hideNumericStyles}"
        icon="editable-table:numbers"
        label="Style numeric cells."
        @button-toggled="${this._onTableSettingChange}"
        part="simple-toolbar-button"
        ?toggled="${this.numericStyles}"
        toggles
      >
      </simple-toolbar-button>
    `;
  }
  get responsiveButton() {
    return html`
      <simple-toolbar-button
        id="responsive"
        ?disabled="${this.hideResponsive}"
        ?hidden="${this.hideResponsive}"
        icon="device:devices"
        label="Adjust width to screen size."
        @button-toggled="${this._onTableSettingChange}"
        part="simple-toolbar-button"
        ?toggled="${this.responsive}"
        toggles
      >
      </simple-toolbar-button>
    `;
  }
  get displayGroup() {
    return html`
      <div
        class="group"
        ?hidden="${this.hideDisplay}"
        part="simple-toolbar-section"
      >
        <div class="label" part="simple-toolbar-section-label">Display</div>
        ${this.borderButton} ${this.condenseButton}
        <simple-toolbar-button-group>
          ${this.stripeButton} ${this.columnStripeButton}
        </simple-toolbar-button-group>
        ${this.numericStylesButton} ${this.responsiveButton}
      </div>
    `;
  }
  get sortButton() {
    return html`
      <simple-toolbar-button
        id="sort"
        ?disabled="${this._isSortDisabled(this.hideSort, this.columnHeader)}"
        ?hidden="${this._isSortDisabled(this.hideSort, this.columnHeader)}"
        label="Column sorting (for tables with column headers)."
        icon="editable-table:sortable"
        @button-toggled="${this._onTableSettingChange}"
        part="simple-toolbar-button"
        ?toggled="${this.sort}"
        toggles
      >
      </simple-toolbar-button>
    `;
  }
  get filterButton() {
    return html`
      <simple-toolbar-button
        id="filter"
        ?disabled="${this.hideFilter}"
        ?hidden="${this.hideFilter}"
        icon="editable-table:filter"
        label="Column filtering."
        @button-toggled="${this._onTableSettingChange}"
        part="simple-toolbar-button"
        ?toggled="${this.filter}"
        toggles
      >
      </simple-toolbar-button>
    `;
  }
  get downloadButton() {
    return html`
      <simple-toolbar-button
        id="downloadable"
        ?disabled="${this.hideDownloadable}"
        ?hidden="${this.hideDownloadable}"
        icon="file-download"
        label="Allow downloading as CSV."
        @button-toggled="${this._onTableSettingChange}"
        part="simple-toolbar-button"
        ?toggled="${this.downloadable}"
        toggles
      >
      </simple-toolbar-button>
    `;
  }
  get printButton() {
    return html`
      <simple-toolbar-button
        id="printable"
        ?disabled="${this.hidePrintable}"
        ?hidden="${this.hidePrintable}"
        icon="print"
        label="Allow printing."
        @button-toggled="${this._onTableSettingChange}"
        part="simple-toolbar-button"
        ?toggled="${this.printable}"
        toggles
      >
      </simple-toolbar-button>
    `;
  }
  get dataGroup() {
    return html`
      <div
        class="group"
        ?hidden="${this.hideSortFilter}"
        part="simple-toolbar-section"
      >
        <div class="label" part="simple-toolbar-section-label">Data</div>
        ${this.sortButton} ${this.filterButton} ${this.downloadButton}
        ${this.printButton}
      </div>
    `;
  }
  get settingsToolbar() {
    return html`
      <simple-toolbar part="simple-toolbar">
        ${this.headersFootersGroup} ${this.displayGroup} ${this.dataGroup}
      </simple-toolbar>
    `;
  }

  get editableCaption() {
    return html`
      <caption>
        <p class="offscreen">Edit Mode for</p>
        <div class="caption-flex">
          <rich-text-editor
            autofocus
            @blur="${this._captionChanged}"
            id="caption"
            label="Caption"
            placeholder="Name your table by adding a caption here."
            rawhtml="${this.caption}"
            toolbar="editable-table-toolbar"
            type="rich-text-editor-toolbar-mini"
          >
          </rich-text-editor>
          <div class="icons">
            ${!this.downloadable
              ? ""
              : html`
                  <simple-icon-lite
                    class="downloadable-icon"
                    icon="file-download"
                    aria-hidden="true"
                  >
                  </simple-icon-lite>
                `}
            ${!this.printable
              ? ""
              : html`
                  <simple-icon-lite
                    calss="printable-icon"
                    icon="print"
                    aria-hidden="true"
                  >
                  </simple-icon-lite>
                `}
          </div>
        </div>
      </caption>
    `;
  }

  columnMenuButton(colIndex) {
    return html`
      <editable-table-editor-rowcol
        ?condensed="${this.condensed}"
        index="${colIndex}"
        @rowcol-action="${this._handleRowColumnMenu}"
        @rowcol-menu-toggle="${this._handleMenuToggle}"
        part="rowcol-menu-button"
      >
      </editable-table-editor-rowcol>
    `;
  }
  editableColumn(colIndex) {
    return html`
      <th
        class="col-${colIndex}"
        scope="col"
        ?numeric="${this._isNumericColumn(colIndex)}"
      >
        ${this.columnMenuButton(colIndex)}
      </th>
    `;
  }
  rowMenuButton(rowIndex) {
    return html`
      <editable-table-editor-rowcol
        class="cell"
        ?condensed="${this.condensed}"
        index="${rowIndex}"
        row
        @rowcol-action="${this._handleRowColumnMenu}"
        part="rowcol-menu-button"
      >
      </editable-table-editor-rowcol>
    `;
  }
  editableRow(rowIndex, rowData) {
    return html`
      <tr
        class="tr ${rowIndex == 0 && this.columnHeader
          ? "thead-tr"
          : rowIndex == this.data.length - 1 && this.footer
            ? "tfoot-tr"
            : "tbody-tr"}"
      >
        <th scope="row">${this.rowMenuButton(rowIndex)}</th>
        ${(rowData || []).map((cellData, colIndex) =>
          this.editableCell(rowIndex, colIndex, cellData),
        )}
      </tr>
    `;
  }
  cellEditor(rowIndex, colIndex, contents) {
    return html`
      <rich-text-editor
        autofocus
        @blur="${(e) => this._onCellValueChange(e, rowIndex, colIndex)}"
        class="cell"
        disable-mouseover
        toolbar="editable-table-toolbar"
        id="cell-${rowIndex}-${colIndex}"
        label="${`Cell ${this._getLabel(colIndex, false)}${rowIndex}`}"
        rawhtml="${contents}"
        type="rich-text-editor-toolbar-mini"
        contenteditable="true"
        role="textbox"
      >
      </rich-text-editor>
    `;
  }
  editableCell(rowIndex, colIndex, contents) {
    return html`
      <td
        class="${(colIndex === 0 && this.rowHeader) ||
        (rowIndex == 0 && this.columnHeader)
          ? "th"
          : "td"} th-or-td"
        ?negative="${this._isNegative(contents)}"
        ?numeric="${this._isNumericColumn(colIndex)}"
        @click="${this._onCellClick}"
      >
        ${this.cellEditor(rowIndex, colIndex, contents)}
        <div class="icon-container">
          <simple-icon-lite
            class="sortable-icon"
            icon="editable-table:sortable"
            aria-hidden="true"
          ></simple-icon-lite>
          <simple-icon-lite
            class="filter-icon"
            icon="editable-table:filter-off"
            aria-hidden="true"
          ></simple-icon-lite>
        </div>
      </td>
    `;
  }
  get editableColumns() {
    return html`
      <thead>
        <tr class="tr">
          <th scope="row">
            <span class="offscreen">Insert/Delete Controls</span>
          </th>
          ${(this.data[0] || []).map((cellData, th) => this.editableColumn(th))}
        </tr>
      </thead>
    `;
  }
  get editableRows() {
    return html`
      <tbody id="tbody" class="tbody">
        ${this.data.map((row, tr) => this.editableRow(tr, row))}
      </tbody>
    `;
  }
  render() {
    return html`
      ${this.textEditorToolbar}
      <p class="offscreen">Table Editor</p>
      <table
        id="table-editmode"
        ?bordered="${this.bordered}"
        ?column-header="${this.columnHeader}"
        ?column-striped="${this.columnStriped}"
        ?condensed="${this.condensed}"
        ?downloadable="${this.downloadable}"
        ?filter="${this.filter}"
        ?footer="${this.footer}"
        ?numeric-styles="${this.numericStyles}"
        ?printable="${this.printable}"
        ?responsive="${this.responsive}"
        ?row-header="${this.rowHeader}"
        ?sort="${this.sort}"
        ?striped="${this.striped}"
        part="table"
      >
        ${this.editableCaption} ${this.editableColumns} ${this.editableRows}
      </table>
      ${this.settingsToolbar}
    `;
  }

  static get tag() {
    return "editable-table-edit";
  }

  constructor() {
    super();
  }

  static get properties() {
    return {
      ...super.properties,
    };
  }

  /**
   * hides data sorting and filtering feature set
   *
   * @readonly
   * @memberof EditableTableEdit
   */
  get hideSortFilter() {
    return this.hideSort && this.hideFilter;
  }
  /**
   * hides display feature set
   *
   * @readonly
   * @memberof EditableTableEdit
   */
  get hideDisplay() {
    return (
      this.hideBordered &&
      this.hideCondensed &&
      this.hideStriped &&
      this.hideNumericStyles &&
      this.hideResponsive
    );
  }

  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "disabled" || propName === "hidden")
        this.disableEditing();
    });
  }

  disableEditing() {
    this.shadowRoot
      .querySelectorAll("rich-text-editor-toolbar-mini")
      .forEach((editor) => {
        editor.disableEditing();
      });

    /**
     * Fires this editor is disabled
     * @event editing-disabled
     */
    this.dispatchEvent(
      new CustomEvent("editing-disabled", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: {
          editor: this,
        },
      }),
    );
  }

  /**
   * Tests for whether or not to disable sort feature.
   * @param {boolean} hideSort if sort feature be hidden
   * @param {boolean} columnHeader if table has column headers
   */
  _isSortDisabled(hideSort, columnHeader) {
    return hideSort || !columnHeader;
  }
  /**
   * Get row or column label
   * @param {number} index of row or column
   * @param  {boolean} whenther it's a row
   * @returns {string} a row number or a column letter
   */
  _getLabel(index) {
    let numerals = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
      results = this._getLetter(index).split("-").reverse(),
      label = "";
    for (let i = 0; i < results.length; i++) {
      if (results[i] !== "") label += numerals[results[i]];
    }
    return label;
  }

  /**
   * Converts index to a letter.
   * @param {number} index of row or column
   * @returns {string} a column letter
   */
  _getLetter(index) {
    let place = Math.floor(index / 26),
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
  }

  /**
   * Delete a column at given index
   * @param {number} index index of column
   */
  deleteColumn(index) {
    let temp = [...this.data];
    for (let i = 0; i < temp.length; i++) {
      temp[i].splice(index, 1);
    }
    this.data = temp;

    this._handleChange("data");

    /**
     * Fires when column is deleted
     * @event column-deleted
     */
    this.dispatchEvent(
      new CustomEvent("column-deleted", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: {
          editor: this,
          data: this.data,
          colNum: index,
        },
      }),
    );
  }

  /**
   * Delete a row at given index
   * @param {number} index index of row
   */
  deleteRow(index) {
    let temp = [...this.data];
    temp.splice(index, 1);
    this.data = temp;

    this._handleChange("data");

    /**
     * Fires when row is deleted
     * @event row-deleted
     */
    this.dispatchEvent(
      new CustomEvent("row-deleted", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: {
          editor: this,
          data: this.data,
          rowNum: index,
        },
      }),
    );
  }
  /**
   * Insert a column at given index
   * @param {number} index index of column
   */
  insertColumn(index) {
    let temp = [...this.data];
    for (let i = 0; i < temp.length; i++) {
      temp[i].splice(index, 0, " ");
    }
    this.data = temp;
    this._handleChange("data");

    /**
     * Fires when column is inserted
     * @event column-inserted
     */
    this.dispatchEvent(
      new CustomEvent("column-inserted", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: {
          editor: this,
          data: this.data,
          colNum: index,
        },
      }),
    );
  }

  /**
   * Insert a row at given index
   * @param {number} index index of row
   */
  insertRow(index) {
    let temp = [...this.data],
      temp2 = new Array();
    for (let i = 0; i < temp[0].length; i++) {
      temp2.push(" ");
    }
    temp.splice(index + 1, 0, temp2);
    this.data = temp;
    this._handleChange("data");

    /**
     * Fires cwhen row is inserted
     * @event row-inserted
     */
    this.dispatchEvent(
      new CustomEvent("row-inserted", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: {
          editor: this,
          data: this.data,
          rowNum: index,
        },
      }),
    );
  }

  changeCell(row, col, val) {
    let temp = this.data.slice();
    temp[row][col] = val;
    this.data = [];
    this.data = temp;
    this._handleChange("data");

    /**
     * Fires when cell value is changed
     * @event cell-changed
     */
    this.dispatchEvent(
      new CustomEvent("cell-changed", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: {
          editor: this,
          data: this.data,
          rowNum: row,
          colNum: col,
        },
      }),
    );
  }

  /**
   * Sets focus on cell's textarea if cell is clicked
   * @param {event} e event
   */
  _onCellClick(e) {
    if (e.model && e.model.root && e.model.root.nodeList[0]) {
      e.model.root.nodeList[0].focus();
    }
  }

  /**
   * Updates data when cell value changes
   * @param {event} e event
   */
  _onCellValueChange(e, row, col) {
    let val =
      !this.shadowRoot || !this.shadowRoot.querySelector(`#cell-${row}-${col}`)
        ? undefined
        : this.shadowRoot.querySelector(`#cell-${row}-${col}`).innerHTML;
    this.changeCell(row, col, val);
  }
  /**
   * Handles when caption paper-input changed
   */
  _captionChanged() {
    let val =
      !this.shadowRoot || !this.shadowRoot.querySelector(`#caption`)
        ? undefined
        : this.shadowRoot.querySelector(`#caption`).innerHTML;
    this.caption = val;
    this._handleChange("caption");

    /**
     * Fires caption is changed
     * @event caption-changed
     */
    this.dispatchEvent(
      new CustomEvent("caption-changed", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: {
          editor: this,
          caption: this.caption,
        },
      }),
    );
  }

  /**
   * Updates table properties when setting changes
   * @param {event} e event
   */
  _onTableSettingChange(e) {
    this[e.detail.id] = e.detail.toggled;
    this._handleChange(e.detail.id);
  }

  /**
   * Makes sure there is always on cell to work from
   */
  _dataChanged(data, oldData) {
    if ((data && data.length < 1) || data[0].length < 1) {
      this.data = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ];
    }
    this._handleChange("data");
  }

  _handleChange(prop) {
    /**
     * Fires this editor is disabled
     * @event change
     */
    this.dispatchEvent(
      new CustomEvent("change", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: prop,
      }),
    );
  }

  /**
   * Handles row/column menu actions
   * @param {event} e event
   */
  _handleRowColumnMenu(e) {
    if (e.detail.insert && e.detail.row) {
      this.insertRow(e.detail.index);
    } else if (e.detail.insert && !e.detail.row) {
      this.insertColumn(e.detail.index);
    } else if (!e.detail.insert && e.detail.row) {
      this.deleteRow(e.detail.index);
    } else {
      this.deleteColumn(e.detail.index);
    }
  }

  _handleMenuToggle(e) {
    if (!e.detail) return;
    e.detail
      .closest("thead,tbody")
      .setAttribute("data-expanded", e.detail.expanded);
    e.detail.closest("tr").setAttribute("data-expanded", e.detail.expanded);
    e.detail.closest("th").setAttribute("data-expanded", e.detail.expanded);
  }

  /**
   * Gets row data for a given row index
   * @param {number} index index of row
   * @param {array} data table data
   * @returns {array} row data
   */
  _getCurrentRow(index, data) {
    let row = null;
    if (
      data !== undefined &&
      data !== null &&
      data[index] !== undefined &&
      data[index] !== null
    ) {
      row = data[index];
    }
    return row;
  }

  /**
   * Tests for first row of data. Workaround to restamp column headers.
   * @param {number} index index of row
   */
  _isFirstRow(index) {
    return index === 0;
  }
}
customElements.define(EditableTableEdit.tag, EditableTableEdit);
export { EditableTableEdit };

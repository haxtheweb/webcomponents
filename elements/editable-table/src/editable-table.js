/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import {
  displayBehaviors,
  editableTableStyles,
} from "./lib/editable-table-behaviors.js";
import "@lrnwebcomponents/rich-text-editor/rich-text-editor.js";
import "@lrnwebcomponents/rich-text-editor/lib/toolbars/rich-text-editor-toolbar-mini.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
import "./lib/editable-table-editor-rowcol.js";
import "./lib/editable-table-editor-toggle.js";
import "./lib/editable-table-display.js";

/**
 * `editable-table`
 * An editor interface for tables that toggles between view mode.
 *
### Styling

`<editable-table>` provides the following custom properties and mixins
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--editable-table-font-size` | Main size for the  table. | unset;
`--editable-table-secondary-font-size` | Smaller font size for the table for minor UI elements. | 12px;
`--editable-table-caption-font-size` | Font size for the table caption. | var(--editable-table-font-size);
`--editable-table-font-family` | Main font-family for the table. | inherit;
`--editable-table-secondary-font-family` | Secondary font-familt for the table's minor UI elements | "Roboto", "Noto", sans-serif;
`--editable-table-light-weight` | The lightest table font-weight, for minor UI elements. | 200;
`--editable-table-medium-weight` | The default table font-weight. | 300;
`--editable-table-heavy-weight` | The heaviest table font-weight, for emphasis and table  caption. | 600;
`--editable-table-color` | The table text color. | #222;
`--editable-table-bg-color` | The table background color. | #fff;
`--editable-table-caption-color` | The caption text color. | var(--editable-table-color);
`--editable-table-caption-bg-color` | The caption background color. | #fff;
`--editable-table-heading-color` | The row/column heading text color. | #000;
`--editable-table-heading-bg-color` | The row/column heading background color. | #e8e8e8;
`--editable-table-stripe-bg-color` | The background color for alternating row striping. | #f0f0f0;
`--editable-table-border-width` | The border width for table. | 1px;
`--editable-table-border-style` | The border style for table. | solid;
`--editable-table-border-color` | The border color for table. | #999;
`--editable-table-border` | The table border. | var(--editable-table-border-width) var(--editable-table-border-style) var(--editable-table-border-color);
`--editable-table-button-color` | The default text color of the toggle buttons. | var(--editable-table-border-color);
`--editable-table-button-bg-color` | The default background color of the toggle buttons. | var(--editable-table-bg-color);
`--editable-table-button-toggled-color` | The text color of the toggle buttons when toggled. | var(--editable-table-color);
`--editable-table-button-toggled-bg-color` | The background color of the toggle buttons when toggled. | var(--editable-table-bg-color);
`--editable-table-button-hover-color` | The text color of the toggle buttons when hovered or focused. | var(--editable-table-button-color);
`--editable-table-button-hover-bg-color` | The background color of the toggle buttons when hovered or focused. | var(--editable-table-heading-bg-color);
`--editable-table-button-toggled-hover-color` | The text color of the toggle buttons when toggled and hovered/focused. | var(--editable-table-heading-color);
`--editable-table-button-toggled-hover-bg-color` | The background color of the toggle buttons when toggled and hovered/focused. | var(--editable-table-heading-bg-color);
`--editable-table-button-disabled-color` | The text color of the toggle buttons when disabled. | var(--editable-table-border-color);
`--editable-table-button-disabled-bg-color` | The background color of the toggle buttons when disabled. | var(--editable-table-heading-bg-color);
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
 * @demo ./demo/display.html Display Only
 * @demo ./demo/importing.html Importing Data
 * @demo ./demo/exporting.html Exporting Data
 * @demo ./demo/advanced.html Advanced Features
 * 
 * @polymer
 * @element editable-table
 * @appliesMixin displayBehaviors
 * @appliesMixin EditBehaviors
 */
class EditableTable extends displayBehaviors(LitElement) {
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
        .filter-icon,
        .sortable-icon {
          display: none;
          opacity: 0.4;
          width: 24px;
          height: 24px;
        }
        :host([sort]) tbody .tr:first-child .sortable-icon,
        :host([filter]) tbody .tr:not(:first-of-type) .filter-icon {
          display: inline-block;
          opacity: 0.25;
        }
        table {
          min-width: calc(100% - 2.3px);
          width: unset;
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
        caption,
        .th-or-td {
          border: 1px solid #ddd;
        }
        label,
        .label {
          color: var(
            --editable-table-secondary-text-color,
            var(--editable-table-border-color, #999)
          );
          font-size: var(--editable-table-secondary-font-size, 12px);
          font-family: var(
            --editable-table-secondary-font-family,
            "Roboto",
            "Noto",
            sans-serif
          );
        }
        .field-group {
          width: 100%;
          padding: 0;
          margin: 0;
          transition: all 2s;
          color: var(
            --editable-table-caption-color,
            var(--editable-table-color, #222)
          );
        }
        .field-group:not([hidden]) {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
        }
        caption > *,
        .field-group > * {
          margin: 0 2.5px;
        }
        caption {
          position: relative;
        }
        .field-group .field-group {
          width: unset;
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
          width: max-content;
          position: relative;
          margin: 0;
        }
        rich-text-editor {
          margin-bottom: 1px;
          min-height: 12px;
          padding: var(
            --editable-table-row-padding,
            var(--editable-table-row-vertical-padding, 10px)
              var(--editable-table-row-horizontal-padding, 6px)
          );
          border: none !important;
        }
        td #icons {
          position: absolute;
          right: 0;
          width: 48px;
          z-index: -1;
        }
        td simple-icon-lite {
          width: 24px;
        }
        th:hover,
        th:focus-within {
          background-color: var(
            --editable-table-rowcol-hover-bg-color,
            var(--editable-table-heading-bg-color, #e8e8e8)
          );
        }
        .th:first-child {
          width: 96px;
        }
        :host([responsive]) thead .th:nth-of-type(3),
        :host([responsive]) .td:nth-of-type(2) {
          border-right-width: calc(var(--editable-table-border-width) + 5px);
          border-right-style: double;
        }
      `,
    ];
  }
  render() {
    return html`
      <editable-table-display
        aria-hidden="${this.editMode ? "true" : "false"}"
        ?bordered="${this.bordered}"
        caption="${this.caption}"
        ?column-header="${this.columnHeader}"
        ?condensed="${this.condensed}"
        .data="${this.data}"
        ?filter="${this.filter}"
        ?footer="${this.footer}"
        ?hidden="${this.editMode}"
        ?responsive="${this.responsive}"
        ?row-header="${this.rowHeader}"
        ?sort="${this.sort}"
        ?striped="${this.striped}"
      >
      </editable-table-display>
      <div
        ?hidden="${!this.editMode}"
        aria-hidden="${!this.editMode ? "true" : "false"}"
        id="outer"
      >
        <div id="inner">
          <p class="sr-only">Table Editor</p>
          <table
            id="table-editmode"
            ?bordered="${this.bordered}"
            ?condensed="${this.condensed}"
            ?striped="${this.striped}"
          >
            <caption>
              <p class="sr-only">Edit Mode for</p>
              <rich-text-editor
                autofocus
                @editing-disabled="${this._captionChanged}"
                toolbar="mini"
                id="caption"
                label="Caption"
                placeholder="Name your table by adding a caption here."
                type="rich-text-editor-toolbar-mini"
              >
                ${this.getHTML(this.caption)}
              </rich-text-editor>
            </caption>
            <thead>
              <tr class="tr">
                <th scope="col">
                  <span class="sr-only">Row Operations</span>
                </th>
                ${(this.data[0] || []).map(
                  (cell, th) => html`
                    <th class="col-${th}" scope="col">
                      <editable-table-editor-rowcol
                        ?condensed="${this.condensed}"
                        index="${th}"
                        @rowcol-action="${this._handleRowColumnMenu}"
                      >
                      </editable-table-editor-rowcol>
                    </th>
                  `
                )}
              </tr>
            </thead>
            <tbody id="tbody">
              ${this.data.map(
                (row, tr) => html`
                  <tr class="tr tbody-tr">
                    <th scope="row">
                      <editable-table-editor-rowcol
                        ?condensed="${this.condensed}"
                        index="${tr}"
                        row
                        @rowcol-action="${this._handleRowColumnMenu}"
                      >
                      </editable-table-editor-rowcol>
                    </th>
                    ${(row || []).map(
                      (cell, td) => html`
                        <td
                          class="${(td === 0 && this.rowHeader) ||
                          (tr == 0 && this.columnHeader)
                            ? "th"
                            : "td"} th-or-td"
                          @click="${this._onCellClick}"
                        >
                          <rich-text-editor
                            autofocus
                            @editing-disabled="${(e) =>
                              this._onCellValueChange(e, tr, td)}"
                            disable-mouseover
                            toolbar="mini"
                            id="cell-${tr}-${td}"
                            label="${this.label}"
                            type="rich-text-editor-toolbar-mini"
                          >
                            ${this.getHTML(cell)}
                          </rich-text-editor>
                          <div id="icons">
                            <simple-icon-lite
                              class="sortable-icon"
                              icon="editable-table:sortable"
                              aria-hidden="true"
                            ></simple-icon-lite>
                            <simple-icon-lite
                              class="filter-icon"
                              icon="editable-table:filter-off"
                            ></simple-icon-lite>
                          </div>
                        </td>
                      `
                    )}
                  </tr>
                `
              )}
            </tbody>
          </table>
        </div>
        <div class="field-group">
          <div class="field-group">
            <div class="label">Headers and footers</div>
            <editable-table-editor-toggle
              id="columnHeader"
              icon="editable-table:column-headers"
              label="First row has column headers."
              @change="${this._onTableSettingChange}"
              ?toggled="${this.columnHeader}"
            >
            </editable-table-editor-toggle>
            <editable-table-editor-toggle
              id="rowHeader"
              icon="editable-table:row-headers"
              @change="${this._onTableSettingChange}"
              label="First column has row headers."
              ?toggled="${this.rowHeader}"
            >
            </editable-table-editor-toggle>
            <editable-table-editor-toggle
              id="footer"
              icon="editable-table:footer"
              label="Last row is a footer."
              @change="${this._onTableSettingChange}"
              ?toggled="${this.footer}"
            >
            </editable-table-editor-toggle>
          </div>
          <div class="field-group" ?hidden="${this.hideDisplay}">
            <div class="label">Display</div>
            <editable-table-editor-toggle
              id="bordered"
              ?disabled="${this.hideBordered}"
              ?hidden="${this.hideBordered}"
              icon="image:grid-on"
              label="Borders."
              @change="${this._onTableSettingChange}"
              ?toggled="${this.bordered}"
            >
            </editable-table-editor-toggle>
            <editable-table-editor-toggle
              id="striped"
              ?disabled="${this.hideStriped}"
              ?hidden="${this.hideStriped}"
              icon="editable-table:row-striped"
              label="Alternating rows."
              @change="${this._onTableSettingChange}"
              ?toggled="${this.striped}"
            >
            </editable-table-editor-toggle>
            <editable-table-editor-toggle
              id="condensed"
              ?disabled="${this.hideCondensed}"
              ?hidden="${this.hideCondensed}"
              icon="editable-table:row-condensed"
              label="Condensed rows."
              @change="${this._onTableSettingChange}"
              ?toggled="${this.condensed}"
            >
            </editable-table-editor-toggle>
            <editable-table-editor-toggle
              id="responsive"
              ?disabled="${this.hideResponsive}"
              ?hidden="${this.hideResponsive}"
              icon="device:devices"
              label="Adjust width to screen size."
              @change="${this._onTableSettingChange}"
              ?toggled="${this.responsive}"
            >
            </editable-table-editor-toggle>
          </div>
          <div class="field-group" ?hidden="${this.hideSortFilter}">
            <div class="label">Data</div>
            <editable-table-editor-toggle
              id="sort"
              ?disabled="${this._isSortDisabled(
                this.hideSort,
                this.columnHeader
              )}"
              ?hidden="${this._isSortDisabled(
                this.hideSort,
                this.columnHeader
              )}"
              label="Column sorting (for tables with column headers)."
              icon="editable-table:sortable"
              @change="${this._onTableSettingChange}"
              ?toggled="${this.sort}"
            >
            </editable-table-editor-toggle>
            <editable-table-editor-toggle
              id="filter"
              ?disabled="${this.hideFilter}"
              ?hidden="${this.hideFilter}"
              icon="editable-table:filter"
              label="Column filtering."
              @change="${this._onTableSettingChange}"
              ?toggled="${this.filter}"
            >
            </editable-table-editor-toggle>
          </div>
        </div>
      </div>
      <div id="htmlImport" hidden><slot></slot></div>
      <rich-text-editor-mini
        id="mini"
        config="${this.config}"
      ></rich-text-editor-mini>
    `;
  }

  static get tag() {
    return "editable-table";
  }
  /**
   * Support being an editing interface element for HAX
   */
  haxHooks() {
    return {
      activeElementChanged: "haxactiveElementChanged",
    };
  }
  /**
   * allow HAX to toggle edit state when activated
   */
  haxactiveElementChanged(el, val) {
    // overwrite the HAX dom w/ what our editor is supplying
    if (!val) {
      let replacement = this.getTableHTMLNode();
      if (el) {
        el.replaceWith(replacement);
      }
      el = replacement;
    }
    // aligns the state of the element w/ HAX if its available
    this.toggleEditMode(val);
    return el;
  }
  constructor() {
    super();
    this.haxUIElement = true;
    this.editMode = false;
    this.hideBordered = false;
    this.hideCondensed = false;
    this.hideFilter = false;
    this.hideSort = false;
    this.hideResponsive = false;
    this.hideStriped = false;
  }
  static get properties() {
    return {
      /**
       * Is the table in edit-mode? Default is false (display mode).
       */
      config: {
        type: Object,
      },
      /**
       * Is the table in edit-mode? Default is false (display mode).
       */
      editMode: {
        type: Boolean,
        attribute: "edit-mode",
      },
      /**
       * Hide the borders table styles menu option
       */
      hideBordered: {
        type: Boolean,
      },
      /**
       * Hide the condensed table styles menu option
       */
      hideCondensed: {
        type: Boolean,
      },
      /**
       * Hide the filtering option.
       */
      hideFilter: {
        type: Boolean,
      },
      /**
       * Hide the sorting option.
       */
      hideSort: {
        type: Boolean,
      },
      /**
       * Hide the responsive table styles menu option
       */
      hideResponsive: {
        type: Boolean,
      },
      /**
       * Hide the striped table styles menu option
       */
      hideStriped: {
        type: Boolean,
      },
    };
  }

  get hideSortFilter() {
    return this.hideSort && this.hideFilter;
  }

  get hideDisplay() {
    return (
      this.hideBordered &&
      this.hideCondensed &&
      this.hideStriped &&
      this.hideResponsive
    );
  }

  /**
   * Delete a column at the given index
   * @param {number} index the index of the column
   */
  deleteColumn(index) {
    for (let i = 0; i < this.data.length; i++) {
      this.splice("data." + i, index, 1);
    }
    let temp = this.data.slice();
    this.data = temp;
  }

  /**
   * Delete a row at the given index
   * @param {number} index the index of the row
   */
  deleteRow(index) {
    this.splice("data", index, 1);
    let temp = this.data.slice();
    this.data = temp;
  }

  /**
   * Insert a column at the given index
   * @param {number} index the index of the column
   */
  insertColumn(index) {
    let temp = this.data.slice();
    for (let i = 0; i < temp.length; i++) {
      temp[i].splice(index, 0, "");
    }
    this.data = temp;
  }

  /**
   * Insert a row at the given index
   * @param {number} index the index of the row
   */
  insertRow(index) {
    let temp = this.data.slice(),
      temp2 = new Array();
    for (let i = 0; i < temp[0].length; i++) {
      temp2.push("");
    }
    temp.splice(index + 1, 0, temp2);
    this.data = temp;
  }
  /**
   * loads table data from slotted HTML
   *
   * @memberof EditableTable
   */
  loadTable() {
    let table = this.children.item(0);
    // support wrapping editable-table-display tag or primative
    if (table && table.tagName === "EDITABLE-TABLE-DISPLAY") {
      table = table.children.item(0);
    }
    if (
      !!table &&
      table.tagName === "TABLE" &&
      table.children &&
      table.children.length > 0
    ) {
      this.importHTML(table);
    } else {
      this.data = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ];
    }
  }

  /**
   * Toggles between edit-mode and display mode.
   * @event toggle-edit-mode
   * @param {boolean} edit Toggle edit mode on? Default is toggle from current mode.
   */
  toggleEditMode(edit) {
    edit = edit !== undefined ? edit : !this.editMode;
    this.dispatchEvent(
      new CustomEvent("toggle-edit-mode", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this,
      })
    );
    if (edit && this.shadowRoot) {
      this.shadowRoot.querySelector("editable-table-display").toggleFilter();
      this.shadowRoot
        .querySelector("editable-table-display")
        .sortData("none", -1);
      this.shadowRoot.querySelector("#inner").focus();
    } else {
      this.shadowRoot.querySelectorAll("rich-text-editor").forEach((editor) => {
        editor.disableEditing();
      });
    }
    this.editMode = edit;
  }

  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => {
      this.loadTable();
      this.__ready = true;
    }, 0);
  }
  /**
   * Handles when the caption paper-input changed
   */
  _captionChanged(e) {
    this.caption = e.detail;
  }

  /**
   * Fires when data changed
   * @event change
   * @param {event} the event
   */
  _dataChanged(newValue, oldValue) {
    if (
      this.__ready &&
      (!newValue || newValue.length < 1 || newValue[0].length < 1)
    ) {
      this.loadTable();
    }
  }

  /**
   * Gets the row data for a given row index
   * @param {number} index the index of the row
   * @param {array} data the table data
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
   * Handles row/column menu actions
   * @param {event} e the event
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

  /**
   * Tests for first row of data. Workaround to restamp column headers.
   * @param {number} index the index of the row
   */
  _isFirstRow(index) {
    return index === 0;
  }

  /**
   * Tests for whether or not to disable the sort feature.
   * @param {boolean} hideSort if sort feature be hidden
   * @param {boolean} columnHeader if table has column headers
   */
  _isSortDisabled(hideSort, columnHeader) {
    return hideSort || !columnHeader;
  }

  /**
   * Sets focus on the cell's textarea if the cell is clicked
   * @param {event} e the event
   */
  _onCellClick(e) {
    if (e.model && e.model.root && e.model.root.nodeList[0]) {
      e.model.root.nodeList[0].focus();
    }
  }

  /**
   * Updates data when cell value changes
   * @param {event} e the event
   */
  _onCellValueChange(e, row, col) {
    let temp = this.data.slice();
    temp[row][col] = e.detail;
    this.data = temp;
  }

  /**
   * Updates table properties when setting changes
   * @param {event} e the event
   */
  _onTableSettingChange(e) {
    this[e.detail.id] = e.detail.toggled;
  }

  /**
   * Makes sure there is always on cell to work from
   */
  _setMinimumData(data) {
    if (data.length < 1 || data[0].length < 1) {
      this.data = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ];
    }
  }
}
window.customElements.define(EditableTable.tag, EditableTable);
export { EditableTable };

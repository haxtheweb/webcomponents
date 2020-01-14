/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/iron-ajax/iron-ajax.js";
import { displayBehaviors } from "./lib/editable-table-behaviors.js";
import "./lib/editable-table-editor-rowcol.js";
import "./lib/editable-table-editor-toggle.js";
import "./lib/editable-table-editor-cell.js";
import "./lib/editable-table-styles.js";
import "./lib/editable-table-display.js";

/**
 * `editable-table`
 * @customElement editable-table
 * `An editor interface for tables that toggles between view mode.`
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
`--editable-table-heading-bg-color` | The row/column heading background color. | #ddd;
`--editable-table-stripe-bg-color` | The background color for alternating row striping. | #eee;
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
`--editable-table-row-horizontal-padding` | Horizontal appding for cells. | 4px;
`--editable-table-row-vertical-padding` | Default vertical padding for cells (determines row hight and whitespace). | 5px;
`--editable-table-row-vertical-padding-condensed` | Smaller vertical padding for cells (determines condensed row hight and whitespace). | 2px;
`--editable-table-row-padding` | Overall default padding for cells. | var(--editable-table-row-vertical-padding) var(--editable-table-row-horizontal-padding);
`--editable-table-row-padding-condensed` | Overall condensed padding for cells. | var(--editable-table-row-vertical-padding-condensed)var(--editable-table-row-horizontal-padding);
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
 * @appliesMixin displayBehaviors
 * @appliesMixin EditBehaviors
 */
class EditableTable extends displayBehaviors(PolymerElement) {
  static get template() {
    return html`
      <style include="editable-table-styles">
        :host {
          --paper-listbox-background-color: var(
            --editable-table-rowcol-bg-color
          );
        }
        :host .filter-icon,
        :host .sortable-icon {
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
        :host table {
          min-width: calc(100% - 2.3px);
          width: unset;
        }
        :host caption {
          width: 100%;
          padding: 0;
          margin: 0;
          color: var(--editable-table-caption-color);
        }
        :host caption,
        :host .th-or-td {
          border: 1px solid #ddd;
        }
        :host label,
        :host .label {
          font-size: var(--editable-table-secondary-font-size);
          font-family: var(--editable-table-secondary-font-family);
        }
        :host .field-group {
          width: 100%;
          padding: 0;
          margin: 0;
          transition: all 2s;
          color: var(--editable-table-caption-color);
        }
        :host .field-group:not([hidden]) {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
        }
        :host caption > *,
        :host .field-group > * {
          margin: 0 2.5px;
        }
        :host .field-group .field-group {
          width: unset;
        }
        :host .th,
        :host th {
          padding: 0;
          vertical-align: center;
          color: var(--editable-table-rowcol-color);
          background-color: var(--editable-table-rowcol-bg-color);
          outline: var(--editable-table-border);
        }
        :host td {
          margin: 0;
          padding: var(--editable-table-cell-padding);
        }
        :host th:hover,
        :host th:focus-within {
          background-color: var(--editable-table-rowcol-hover-bg-color);
        }
        :host .th:first-child {
          width: 96px;
        }
        :host([responsive]) thead .th:nth-of-type(3),
        :host([responsive]) .td:nth-of-type(2) {
          border-right-width: calc(var(--editable-table-border-width) + 5px);
          border-right-style: double;
        }
        :host([bordered]) thead .th:not(:first-child) {
          border-bottom: var(--editable-table-border);
        }
        :host([striped][column-header])
          tbody
          .tr:nth-child(2n + 1):not(:first-of-type)
          .td,
        :host([striped]:not([column-header])) tbody .tr:nth-child(2n) .td {
          @apply --editable-table-style-stripe;
        }
        :host([column-header]) tbody .tr:first-child .td {
          @apply --editable-table-style-column-header;
        }
        :host([row-header]) tbody .tr .td:first-of-type {
          @apply --editable-table-style-row-header;
        }
        :host([footer]) tbody .tr:last-of-type .td {
          @apply --editable-table-style-footer;
        }
      </style>
      <iron-ajax
        auto
        hidden$="[[!dataCsv]]"
        url="[[dataCsv]]"
        handle-as="text"
        debounce-duration="500"
        last-response="{{csvData}}"
        on-response="_loadExternalData"
      ></iron-ajax>
      <editable-table-display
        aria-hidden$="[[editMode]]"
        bordered$="[[bordered]]"
        caption$="[[caption]]"
        column-header$="[[columnHeader]]"
        data="{{data}}"
        condensed$="[[condensed]]"
        filter$="[[filter]]"
        footer$="[[footer]]"
        hidden$="[[editMode]]"
        responsive$="[[responsive]]"
        row-header$="[[rowHeader]]"
        sort$="[[sort]]"
        striped$="[[striped]]"
      >
      </editable-table-display>
      <div id="outer" hidden$="[[!editMode]]" aria-hidden$="[[!editMode]]">
        <div id="inner">
          <p class="sr-only">Table Editor</p>
          <table
            id="table-editmode"
            bordered$="[[bordered]]"
            condensed$="[[condensed]]"
            striped$="[[striped]]"
          >
            <caption>
              <p class="sr-only">Edit Mode for</p>
              <paper-input
                id="caption"
                label="Caption"
                placeholder="A title for the table."
                on-change="_captionChanged"
                value$="{{caption}}"
              >
              </paper-input>
            </caption>
            <thead>
              <tr class="tr">
                <th class="th th-or-td" scope="col">
                  <span class="sr-only">Row Operations</span>
                </th>
                <template
                  id="headers"
                  is="dom-repeat"
                  items="[[data]]"
                  as="row"
                  index-as="tr"
                  mutable-data
                  restamp
                >
                  <template is="dom-if" if="[[_isFirstRow(tr)]]" restamp>
                    <template
                      id="headercols"
                      is="dom-repeat"
                      items="[[row]]"
                      as="cell"
                      index-as="th"
                      mutable-data
                      restamp
                    >
                      <th class="th th-or-td col-[[th]]" scope="col">
                        <editable-table-editor-rowcol
                          index$="[[th]]"
                          condensed$="[[condensed]]"
                          on-rowcol-action="_handleRowColumnMenu"
                        >
                        </editable-table-editor-rowcol>
                      </th>
                    </template>
                  </template>
                </template>
              </tr>
            </thead>
            <tbody id="tbody">
              <template
                id="rows"
                is="dom-repeat"
                items="[[data]]"
                as="row"
                index-as="tr"
                mutable-data
                restamp
              >
                <tr class="tr tbody-tr">
                  <th class="th th-or-td" scope="row">
                    <editable-table-editor-rowcol
                      index$="[[tr]]"
                      condensed$="[[condensed]]"
                      on-rowcol-action="_handleRowColumnMenu"
                      row
                    >
                    </editable-table-editor-rowcol>
                  </th>
                  <template
                    id="columns"
                    index-as="td"
                    is="dom-repeat"
                    items="[[row]]"
                    as="cell"
                    mutable-data
                    restamp
                  >
                    <td class="td th-or-td" on-click="_onCellClick">
                      <editable-table-editor-cell
                        id="cell-[[td]]-[[tr]]"
                        class="cell"
                        column="[[td]]"
                        row="[[tr]]"
                        on-change="_onCellValueChange"
                        value="{{cell}}"
                      >
                        <iron-icon
                          class="sortable-icon"
                          icon="editable-table:sortable"
                          aria-hidden="true"
                        ></iron-icon>
                        <iron-icon
                          class="filter-icon"
                          icon="editable-table:filter-off"
                        ></iron-icon>
                      </editable-table-editor-cell>
                    </td>
                  </template>
                </tr>
              </template>
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
              on-change="_onTableSettingChange"
              toggled$="[[columnHeader]]"
            >
            </editable-table-editor-toggle>
            <editable-table-editor-toggle
              id="rowHeader"
              icon="editable-table:row-headers"
              on-change="_onTableSettingChange"
              label="First column has row headers."
              toggled$="[[rowHeader]]"
            >
            </editable-table-editor-toggle>
            <editable-table-editor-toggle
              id="footer"
              icon="editable-table:footer"
              label="Last row is a footer."
              on-change="_onTableSettingChange"
              toggled$="[[footer]]"
            >
            </editable-table-editor-toggle>
          </div>
          <div class="field-group" hidden$="[[hideDisplay]]">
            <div class="label">Display</div>
            <editable-table-editor-toggle
              id="bordered"
              disabled$="[[hideBordered]]"
              hidden$="[[hideBordered]]"
              icon="image:grid-on"
              label="Borders."
              on-change="_onTableSettingChange"
              toggled$="[[bordered]]"
            >
            </editable-table-editor-toggle>
            <editable-table-editor-toggle
              id="striped"
              disabled$="[[hideStriped]]"
              hidden$="[[hideStriped]]"
              icon="editable-table:row-striped"
              label="Alternating rows."
              on-change="_onTableSettingChange"
              toggled$="[[striped]]"
            >
            </editable-table-editor-toggle>
            <editable-table-editor-toggle
              id="condensed"
              disabled$="[[hideCondensed]]"
              hidden$="[[hideCondensed]]"
              icon="editable-table:row-condensed"
              label="Condensed rows."
              on-change="_onTableSettingChange"
              toggled$="[[condensed]]"
            >
            </editable-table-editor-toggle>
            <editable-table-editor-toggle
              id="responsive"
              disabled$="[[hideResponsive]]"
              hidden$="[[hideResponsive]]"
              icon="device:devices"
              label="Adjust width to screen size."
              on-change="_onTableSettingChange"
              toggled$="[[responsive]]"
            >
            </editable-table-editor-toggle>
          </div>
          <div class="field-group" hidden$="[[hideSortFilter]]">
            <div class="label">Data</div>
            <editable-table-editor-toggle
              id="sort"
              disabled$="[[_isSortDisabled(hideSort,columnHeader)]]"
              hidden$="[[_isSortDisabled(hideSort,columnHeader)]]"
              label="Column sorting (for tables with column headers)."
              icon="editable-table:sortable"
              on-change="_onTableSettingChange"
              toggled$="[[sort]]"
            >
            </editable-table-editor-toggle>
            <editable-table-editor-toggle
              id="filter"
              disabled$="[[hideFilter]]"
              hidden$="[[hideFilter]]"
              icon="editable-table:filter"
              label="Column filtering."
              on-change="_onTableSettingChange"
              toggled$="[[filter]]"
            >
            </editable-table-editor-toggle>
          </div>
        </div>
      </div>
      <div id="htmlImport" hidden><slot></slot></div>
    `;
  }

  static get tag() {
    return "editable-table";
  }
  static get properties() {
    return {
      /**
       * Is the table in edit-mode? Default is false (display mode).
       */
      editMode: {
        type: Boolean,
        value: false
      },
      /**
       * Hide the borders table styles menu option
       */
      hideBordered: {
        type: Boolean,
        value: false
      },
      /**
       * Hide the condensed table styles menu option
       */
      hideCondensed: {
        type: Boolean,
        value: false
      },
      /**
       * Hide the table display menu group
       */
      hideDisplay: {
        type: Boolean,
        computed:
          "_tableDisplayHidden(hideBordered,hideCondensed,hideStriped,hideResponsive)"
      },
      /**
       * Hide the filtering option.
       */
      hideFilter: {
        type: Boolean,
        value: false
      },
      /**
       * Hide the table sorting & filtering menu group
       */
      hideSortFilter: {
        type: Boolean,
        computed: "_tableSortHidden(hideSort,hideFilter)"
      },
      /**
       * Hide the sorting option.
       */
      hideSort: {
        type: Boolean,
        value: false
      },
      /**
       * Hide the responsive table styles menu option
       */
      hideResponsive: {
        type: Boolean,
        value: false
      },
      /**
       * Hide the striped table styles menu option
       */
      hideStriped: {
        type: Boolean,
        value: false
      }
    };
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
    this.set("data", temp);
  }

  /**
   * Delete a row at the given index
   * @param {number} index the index of the row
   */
  deleteRow(index) {
    this.splice("data", index, 1);
    let temp = this.data.slice();
    this.set("data", temp);
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
    this.set("data", temp);
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
    this.set("data", temp);
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
        detail: this
      })
    );
    if (edit) {
      this.shadowRoot.querySelector("editable-table-display").toggleFilter();
      this.shadowRoot
        .querySelector("editable-table-display")
        .sortData("none", -1);
      this.shadowRoot.querySelector("#inner").focus();
    }
    this.editMode = edit;
  }
  /**
   * Handles when the caption paper-input changed
   */
  _captionChanged() {
    this.caption = this.shadowRoot.querySelector("#caption").value;
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
      } else {
        this.set("data", [["", "", ""], ["", "", ""], ["", "", ""]]);
      }
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
  _onCellValueChange(e) {
    let temp = this.data.slice();
    temp[e.detail.row][e.detail.column] = e.detail.value;
    this.set("data", []);
    this.set("data", temp);
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
      this.set("data", [["", "", ""], ["", "", ""], ["", "", ""]]);
    }
  }

  /**
   * Determines if all of the table style choices hidden?
   * @param {boolean} hideBordered is the border toggle hidden
   * @param {boolean} hideCondensed is the condensed toggle hidden
   * @param {boolean} hideStriped is the striped toggle hidden
   * @param {boolean} hideResponsive is the responsive toggle hidden
   * @returns {boolean} whether all of the  display options are hidden
   */
  _tableDisplayHidden(
    hideBordered,
    hideCondensed,
    hideStriped,
    hideResponsive
  ) {
    return hideBordered && hideCondensed && hideStriped && hideResponsive;
  }

  /**
   * Determines if all of the sorting and filtering choices hidden?
   * @param {boolean} hideSort is the sort toggle hidden
   * @param {boolean} hideFilter is the filter toggle hidden
   * @returns {boolean} whether all of the sorting & filtering options are hidden
   */
  _tableSortHidden(hideSort, hideFilter) {
    return hideSort && hideFilter;
  }
}
window.customElements.define(EditableTable.tag, EditableTable);
export { EditableTable };

/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { ResponsiveUtilityBehaviors } from "@lrnwebcomponents/responsive-utility/lib/responsive-utility-behaviors.js";
import {
  displayBehaviors,
  editBehaviors
} from "./lib/editable-table-behaviors.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/paper-toggle-button/paper-toggle-button.js";
import "@polymer/paper-input/paper-input.js";
import "./lib/editable-table-editor-rowcol.js";
import "./lib/editable-table-editor-toggle.js";
import "./lib/editable-table-editor-cell.js";
import "./lib/editable-table-styles.js";
import "./lib/editable-table-display.js";

/**
 * `editable-table`
 * `An editor interface for tables that toggles between view mode (editable-table-display.html) and edit mode (editable-table-editor.html). (See editable-table-behaviors.html for more information.)`
 *
 * @microcopy - language worth noting:
 * ```
 <editable-table 
  bordered                  //Adds borders to table. Default is no border.
  caption="..."             //The caption or title for the table.
  column-header             //Does the table use the first row as a column-header? Default is false.
  condensed                 //Condense the padding above and below the table? Default is false.
  data=[]                      //Table data as an array. For example: 
                            [
                              [ ["..."], ["..."] ],     //This line represents a row with two columns
                              [ ["..."], ["..."] ],     //This line represents another row with two columns
                              [ ["..."], ["..."] ]      //This line represents a third row with two columns
                            ]
  edit-mode                 //Is the editor in edit mode? Default is false which places the table in display mode. 
  filter                    //Allow table to toggle filtering? When a cell is toggled, only rows that have the same value as that cell will be shown. Default is no filter.
  footer                    //Does the table use the last row as a footer? Default is false.
  hide-accent-color         //Hide the accent color dropdown menu? Default is false which enables the menu which changes the accent-color property.
  hide-bordered             //Hide the bordered toggle? Default is false so that a toggle button to control the bordered property.
  hide-condensed            //Hide the condensed toggle? Default is false so that a toggle button to control the condensed property.
  hide-filter               //Hide the filter toggle? Default is false so that a toggle button to control the filter property.
  hide-sort                 //Hide the sort toggle? Default is false so that a toggle button to control the sort property.
  hide-scroll               //Hide the scroll toggle? Default is false so that a toggle button to control the scroll property.
  hide-striped              //Hide the striped toggle? Default is false so that a toggle button to control the striped property.
  row-header                //Does the table use the first column as a row header? Default is false.
  scroll                    //Does the table use scrolling to fit when it is too wide?  Default is false: a responsive layout where only two columns are shown and a dropdown menu controls which column to display.
  sort                      //Does the table allow sorting by column where column headers become sort buttons? Default is false.
  striped>                  //Does the table have alternating stipes of shading for its body rows? Default is false.
</editable-table>```
 *  
 * @demo demo/index.html
 * @demo demo/editor.html Edit Mode
 * @demo demo/display.html Display Mode
 * 
 * @customElement
 * @polymer
 */
class EditableTable extends displayBehaviors(editBehaviors(PolymerElement)) {
  static get template() {
    return html`
      <style include="editable-table-styles">
        :host {
          display: block;
          width: 100%;
        }
        :host caption {
          width: 100%;
          margin-bottom: 0;
        }
        :host label,
        :host .label {
          font-size: var(--editable-table-secondary-font-size);
          font-family: var(--editable-table-secondary-font-family);
        }
        :host .filter-icon,
        :host .sortable-icon {
          display: none;
          opacity: 0.4;
          width: 24px;
          height: 24px;
        }
        :host([sort]) tbody .tr:first-child .sortable-icon {
          display: inline-block;
          opacity: 0.25;
        }
        :host([filter]) tbody .tr:not(:first-of-type) .filter-icon {
          display: inline-block;
          opacity: 0.25;
        }
        :host #table {
          min-width: calc(100% - 2.3px);
          width: unset;
        }
        :host caption,
        :host .th-or-td {
          border: 1px solid #ddd;
        }
        :host .th,
        :host th {
          padding: 0;
          vertical-align: center;
          color: black;
          background-color: #f0f0f0;
          outline: var(--editable-table-border);
        }
        :host .th:first-child {
          width: 96px;
        }
        :host .td {
          vertical-align: top;
        }
        :host([bordered]) .td {
          border: var(--editable-table-border);
        }
        :host([responsive]) thead .th:nth-of-type(3),
        :host([responsive]) .td:nth-of-type(2) {
          border-right-width: calc(var(--editable-table-border-width) + 5px);
          border-right-style: double;
        }
        :host([bordered]) thead .th:not(:first-child) {
          border-bottom: var(--editable-table-border);
        }
        :host([striped][column-header]) tbody .tr:nth-child(2n + 1) .td {
          @apply --editable-table-style-stripe;
        }
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
        :host caption,
        :host .field-group {
          width: 100%;
          padding: 0;
          margin: 0;
          transition: all 2s;
          color: var(--editable-table-caption-color);
        }
        :host .field-group {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        :host caption > *,
        :host .field-group > * {
          margin: 0 2.5px;
        }
        :host .field-group .field-group {
          color: var(--editable-table-caption-color);
          width: unset;
        }
        @media screen {
        }
      </style>
      <editable-table-display
        bordered$="[[bordered]]"
        caption$="[[caption]]"
        column-header$="[[columnHeader]]"
        data="[[data]]"
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
      <div id="table-outer" hidden$="[[!editMode]]">
        <p class="sr-only">Table Editor</p>
        <table
          id="table"
          bordered$="[[bordered]]"
          condensed$="[[condensed]]"
          striped$="[[striped]]"
        >
          <caption>
            <p class="sr-only">Editable Table</p>
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
                        condensed$="[[condensed]]"
                        index$="[[th]]"
                        type="Column"
                      ></editable-table-editor-rowcol>
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
                    condensed$="[[condensed]]"
                    index$="[[tr]]"
                    type="Row"
                  ></editable-table-editor-rowcol>
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
                  <td class="td th-or-td">
                    <editable-table-editor-cell
                      class="cell"
                      row="[[tr]]"
                      column="[[index]]"
                      value$="[[cell]]"
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
        <div class="field-group">
          <div class="field-group">
            <div class="label">Headers and footers</div>
            <editable-table-editor-toggle
              id="columnHeader"
              label-on="First row is column headers."
              label-off="First row is not column headers."
              icon="editable-table:column-headers"
              toggled$="{{columnHeader}}"
              tooltip="Toggle column headers"
            >
            </editable-table-editor-toggle>
            <editable-table-editor-toggle
              id="rowHeader"
              label-on="First column is row headers."
              label-off="First column is not row headers."
              icon="editable-table:row-headers"
              toggled$="{{rowHeader}}"
              tooltip="Toggle row headers"
            >
            </editable-table-editor-toggle>
            <editable-table-editor-toggle
              id="footer"
              label-on="Last row is a footer."
              label-off="Last row is not a footer."
              icon="editable-table:footer"
              toggled$="{{footer}}"
              tooltip="Toggle footer"
            >
            </editable-table-editor-toggle>
          </div>
          <div class="field-group" hidden$="[[hideDisplay]]">
            <div class="label">Display</div>
            <editable-table-editor-toggle
              id="bordered"
              hidden$="[[hideBordered]]"
              label-on="Borders."
              label-off="No borders."
              icon="image:grid-on"
              toggled$="{{bordered}}"
              tooltip="Toggle border"
            >
            </editable-table-editor-toggle>
            <editable-table-editor-toggle
              id="striped"
              hidden$="[[hideStriped]]"
              label-on="Row striping."
              label-off="No row striping."
              icon="editable-table:row-striped"
              toggled$="{{striped}}"
              tooltip="Toggle row striping"
            >
            </editable-table-editor-toggle>
            <editable-table-editor-toggle
              id="condensed"
              hidden$="[[hideCondensed]]"
              label-on="Condensed rows"
              label-off="Condensed rows disabled."
              icon="editable-table:row-condensed"
              toggled$="{{condensed}}"
              tooltip="Toggle condensed rows."
            >
            </editable-table-editor-toggle>
            <editable-table-editor-toggle
              id="responsive"
              hidden$="[[hideResponsive]]"
              label-on="Mobile-friendly mode (as needed)."
              label-off="Mobile-friendly mode disabled."
              icon="device:devices"
              toggled$="{{responsive}}"
              tooltip="Toggle mobile-friendly mode"
            >
            </editable-table-editor-toggle>
          </div>
          <div class="field-group" hidden$="[[hideSortFilter]]">
            <div class="label">Sorting and Filtering</div>
            <editable-table-editor-toggle
              id="sort"
              hidden$="[[hideSort]]"
              label-on="Sorting enabled."
              label-off="Sorting disabled."
              icon="editable-table:sortable"
              toggled$="{{sort}}"
              tooltip="Toggle sort-mode"
            >
            </editable-table-editor-toggle>
            <editable-table-editor-toggle
              id="filter"
              hidden$="[[hideFilter]]"
              label-on="Filtering enabled."
              label-off="Filtering disabled."
              icon="editable-table:filter"
              toggled$="{{filter}}"
              tooltip="Toggle filter-mode"
            >
            </editable-table-editor-toggle>
          </div>
        </div>
      </div>
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
       * Hide the table display menu group
       */
      hideDisplay: {
        type: Boolean,
        computed:
          "_tableDisplayHidden(hideBordered,hideCondensed,hideStriped,hideResponsive)"
      },
      /**
       * Hide the table sorting & filtering menu group
       */
      hideSortFilter: {
        type: Boolean,
        computed: "_tableSortHidden(hideSort,hideFilter)"
      }
    };
  }
  ready() {
    super.ready();
    this.onclick = function(e) {
      let el =
        e.srcElement !== null &&
        e.srcElement.tagName !== null &&
        e.srcElement.tagName.toLowerCase() === "td"
          ? e.srcElement
          : false;
      if (el && el.getElementsByTagName("editable-table-cell") !== null) {
        el.children[0].focus();
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      this.addEventListener("cell-move", this._onCellMove.bind(this));
      this.addEventListener(
        "cell-value-changed",
        this._onCellValueChange.bind(this)
      );
      this.addEventListener("insert-row", this._handleInsertRow.bind(this));
      this.addEventListener(
        "insert-column",
        this._handleInsertColumn.bind(this)
      );
      this.addEventListener("delete-row", this._handleDeleteRow.bind(this));
      this.addEventListener(
        "delete-column",
        this._handleDeleteColumn.bind(this)
      );
      this.addEventListener(
        "editable-table-setting-changed",
        this._onTableSettingChange.bind(this)
      );
    });
  }
  disconnectedCallback() {
    this.removeEventListener("cell-move", this._onCellMove.bind(this));
    this.removeEventListener(
      "cell-value-changed",
      this._onCellValueChange.bind(this)
    );
    this.removeEventListener("insert-row", this._handleInsertRow.bind(this));
    this.removeEventListener(
      "insert-column",
      this._handleInsertColumn.bind(this)
    );
    this.removeEventListener("delete-row", this._handleDeleteRow.bind(this));
    this.removeEventListener(
      "delete-column",
      this._handleDeleteColumn.bind(this)
    );
    this.removeEventListener(
      "editable-table-setting-changed",
      this._onTableSettingChange.bind(this)
    );
    super.disconnectedCallback();
  }

  /**
   * Delete a column at the given index
   */
  deleteColumn(index) {
    if (confirm("Delete entire column?")) {
      for (let i = 0; i < this.data.length; i++) {
        this.splice("data." + i, index, 1);
      }
    }
  }

  /**
   * Delete a row at the given index
   */
  deleteRow(index) {
    if (confirm("Delete entire row?")) {
      this.splice("data", index, 1);
    }
  }

  /**
   * Insert a column at the given index
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
   */
  toggleEditMode(edit) {
    //let temp;
    edit = edit !== undefined ? edit : !this.editMode;
    if (edit) {
      this.shadowRoot.querySelector("editable-table-display").toggleFilter();
      this.shadowRoot.querySelector("editable-table-display").sortData(false);
    }
    this.editMode = edit;
  }
  /**
   * handles when the caption paper-input changed
   */
  _captionChanged() {
    this.caption = this.$.caption.value;
  }

  /**
   * Gets the row data for a given row index
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
   * Handles delete column event
   */
  _handleDeleteColumn(e) {
    this.deleteColumn(e.detail);
  }

  /**
   * Handles delete row event
   */
  _handleDeleteRow(e) {
    this.deleteRow(e.detail);
  }

  /**
   * Handles insert column event
   */
  _handleInsertColumn(e) {
    this.insertColumn(e.detail);
  }

  /**
   * Handles insert row event
   */
  _handleInsertRow(e) {
    this.insertRow(e.detail);
  }

  /**
   * Tests for first row of data. Workaround to restamp column headers.
   */
  _isFirstRow(index) {
    return index === 0;
  }

  /**
   * Move the focus/cursor to the correct cell when navigation keys are pressed
   */
  _onCellMove(e) {
    let dir = e.detail.direction,
      cell = e.detail.cell;
    let row = cell.parentNode,
      body = this.$.tbody;
    let x = Array.prototype.indexOf.call(row.children, cell);
    let y = Array.prototype.indexOf.call(body.children, row);

    if (dir === "down") {
      if (y + 1 < body.children.length - 1) {
        body.children[y + 1].children[x].children[0].setFocus();
      } else {
        this.insertRow(y);
      }
    } else if (dir === "up") {
      if (y > 0) {
        body.children[y - 1].children[x].children[0].setFocus();
      }
    } else if (dir === "right") {
      if (x + 1 < row.children.length - 1) {
        row.children[x + 1].children[0].setFocus();
      } else if (y + 1 < body.children.length - 1) {
        body.children[y + 1].children[1].children[0].setFocus();
      }
    } else if (dir === "left") {
      if (x > 1) {
        row.children[x - 1].children[0].setFocus();
      } else if (y > 0) {
        body.children[y - 2].children[
          body.children[y - 2].children.length - 2
        ].children[0].setFocus();
      }
    }
  }

  /**
   * Updates data when cell value changes
   */
  _onCellValueChange(e) {
    this.set("data." + e.detail.row + "." + e.detail.column, e.detail.value);
  }

  /**
   * Updates table properties when setting changes
   */
  _onTableSettingChange(e) {
    this[e.detail.prop] = e.detail.value;
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
   * Are all of the table style choices hidden?
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
   * Are all of the theme choices hidden?
   */
  _tableSortHidden(hideSort, hideFilter) {
    return hideSort && hideFilter;
  }
}
window.customElements.define(EditableTable.tag, EditableTable);
export { EditableTable };

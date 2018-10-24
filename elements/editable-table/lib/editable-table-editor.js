import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "web-animations-js/web-animations-next-lite.min.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@lrnwebcomponents/dropdown-select/dropdown-select.js";
import "@polymer/iron-autogrow-textarea/iron-autogrow-textarea.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "responsive-utility/responsive-utility-behaviors.js";
import "@polymer/iron-icons/iron-icons.js";
import "a11y-collapse/a11y-collapse.js";
import "./editable-table-behaviors.js";
import "./editable-table-editor-rowcol.js";
import "./editable-table-editor-toggle.js";
import "./editable-table-editor-cell.js";
import "./editable-table-iconset.js";
import "./editable-table-styles.js";
/**
`editable-table-editor`

An editor interface for editable-table (editable-table.html). 
(See editable-table-behaviors.html for more information.)

@demo demo/index.html

@microcopy - the mental model for this element

<editable-table-editor 
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
  filter                    //Allow table to toggle filtering? When a cell is toggled, only rows that have the same value as that cell will be shown. Default is no filter.
  footer                    //Does the table use the last row as a footer? Default is false.
  hide-accent-color           //Hide the accent color dropdown menu? Default is false which enables the menu which changes the accent-color property.
  hide-bordered              //Hide the bordered toggle? Default is false so that a toggle button to control the bordered property.
  hide-condensed             //Hide the condensed toggle? Default is false so that a toggle button to control the condensed property.
  hide-dark-theme             //Hide the dark theme toggle? Default is false so that a toggle button to control the dark property.
  hide-filter                //Hide the filter toggle? Default is false so that a toggle button to control the filter property.
  hide-sort                  //Hide the sort toggle? Default is false so that a toggle button to control the sort property.
  hide-scroll                //Hide the scroll toggle? Default is false so that a toggle button to control the scroll property.
  hide-striped               //Hide the striped toggle? Default is false so that a toggle button to control the striped property.
  row-header                //Does the table use the first column as a row header? Default is false.
  scroll                    //Does the table use scrolling to fit when it is too wide?  Default is false: a responsive layout where only two columns are shown and a dropdown menu controls which column to display.
  sort                      //Does the table allow sorting by column where column headers become sort buttons? Default is false.
  striped                   //Does the table have alternating stipes of shading for its body rows? Default is false.
  summary="...">            //An accessible description of the table, what each row reporesents, and what each column represents.
</editable-table-editor>
*/
Polymer({
  _template: html`
    <style is="custom-style" include="editable-table-styles">
      :host {
        --a11y-collapse-border: 1px solid #ddd;
        --a11y-collapse-horizontal-padding: 0;
        --a11y-collapse: {
          margin: 0em;
        };
        --a11y-collapse-heading-focus: {
          background-color: #f0f0f0;
        };
      }
      :host, 
      :host paper-item {
        font-size: 12pt;
      }
      :host dropdown-select {
        padding: 0;
      }
      :host #accent {
        --paper-input-container: { 
          padding-top: 0; 
        };
      }
      :host[responsive-size="xs"] editable-table-editor-settings {
        padding: 3px 0;
      }
      :host .filter-icon,
      :host .sortable-icon {
        display: none;
        opacity: 0.4;
        width: 24px;
        height: 24px;
      }
      :host[sort] .tbody .tr:first-child .sortable-icon {
        display: inline-block;
        opacity: 0.25;
      }
      :host[filter]:not([sort]) .filter-icon,
      :host[filter][sort] .tbody .tr:not(:first-child) .filter-icon {
        display: inline-block;
        opacity: 0.25;
      }
      :host .field-group {
        width: 100%;
        margin: 0 0 10px;
        padding: 0;
      }
      :host .field-group {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        transition: all 2s;
        flex-wrap: wrap;
      }
      :host .field-group.field-group-stretch {
        align-items: stretch;
      }
      :host .field-group-border {
        border: 1px solid #ddd;
        border-radius: 0.25em;
        padding: 15px;
        margin: 15px;
      }
      :host .field-group-grow {
        flex-grow: 1;
        transition: width 2s;
      }
      :host .field-group-shrink {
        flex-shrink: 1;
        transition: width 2s;
      }
      :host .field-group-label {
       padding-right: 0.5em;
       font-weight: bold;
      }
      :host .field-group label {
        line-height: 30px;
      }
      :host #caption {
        padding: 0em;
        display: inline-block;
        width: unset;
      }
      :host .caption.field-group {
        margin-bottom: 0;
      }
      :host .table .th,
      :host .table .td {
        border: 1px solid #ddd;
      }
      :host .table .th {
        padding: 0;
        vertical-align: center;
        color: black;
        background-color: #f0f0f0;
      }
      :host .table .td {
        vertical-align: top;
        padding: 0.5em 0.25em;
      }
      :host .table .th:first-child {
        width: 6em;
      }
      :host[condensed] .table .th {
        padding: 0;
      }
      :host[condensed] .table .td {
        padding: 0em 0.25em;
      }
      :host .table[bordered] .td {
        border: 1px solid var(--editable-table-border-color);
      }
      :host[dark] table .tbody .th {
        border-right: 1px solid var(--editable-table-bg-color);
      }
      :host[dark] .table .thead .th:not(:first-child) {
        border-bottom: 1px solid var(--editable-table-bg-color);
      }
      :host .table[bordered] .thead .th:not(:first-child) {
        border-bottom: 1px solid var(--editable-table-border-color);
      }
      :host[striped] .table .tr:nth-child(2n+1) .td {
        @apply --editable-table-style-stripe;
      }
      :host[column-header] .table .tbody .tr:first-child .td {
        @apply --editable-table-style-column-header;
      }
      :host[row-header] .table .tbody .tr .td:first-of-type {
        @apply --editable-table-style-row-header;
      }
      :host[footer] .table .tbody .tr:last-of-type .td {
        @apply --editable-table-style-footer;
      }
    </style>
    <p class="sr-only">Table Editor</p>
    <p class="field-group">
      <label aria-hidden="true" class="field-group-label">Table Caption </label>
      <iron-autogrow-textarea id="caption" class="field-group-grow caption" label="Table Caption" placeholder="A title for the table." value\$="{{caption}}">
      </iron-autogrow-textarea>
    </p>
    <p class="field-group">
      <label aria-hidden="true" class="field-group-label">Table Summary (for accessibility) </label>
      <iron-autogrow-textarea id="summary" class="field-group-grow" label="Table Summary (for accessibility)" placeholder="Describe what the table contains. What does each row represent? What does each column represent?" value\$="{{summary}}">
      </iron-autogrow-textarea>
    </p>
    <div id="table-outer">
        <a11y-collapse accordion="" icon="settings" label="show settings" label-expanded="hide settings" tooltip="Show/hide table settings.">
          <div slot="heading" class="field-group-label">Table Settings </div>
          <div class="field-group field-group-stretch">
            <div class="field-group-border field-group-grow">
              <label class="">Headers and Footers: </label>
              <editable-table-editor-toggle label="First Column" prop="rowHeader" tooltip="The first column is a row header." value\$="{{rowHeader}}">
              </editable-table-editor-toggle>
              <editable-table-editor-toggle label="First Row" prop="columnHeader" tooltip="The first row is a column header." value\$="{{columnHeader}}">
              </editable-table-editor-toggle>
              <editable-table-editor-toggle hidden\$="[[hideFooter]]" label="Last Row" prop="footer" tooltip="The last row is a table footer." value\$="{{footer}}">
              </editable-table-editor-toggle>
            </div>
            <div class="field-group-border field-group-grow" hidden\$="[[hideTableTheme]]">
              <label>Theme: </label>
              <div class="field-group-grow">
                <dropdown-select id="accent" label="Accent Color" value\$="{{accentColor}}">
                  <paper-item value="none">None</paper-item>
                  <paper-item value="red">Red</paper-item>
                  <paper-item value="pink">Pink</paper-item>
                  <paper-item value="purple">Purple</paper-item>
                  <paper-item value="deep-purple">Deep Purple</paper-item>
                  <paper-item value="indigo">Indigo</paper-item>
                  <paper-item value="blue">Blue</paper-item>
                  <paper-item value="light-blue">Light Blue</paper-item>
                  <paper-item value="cyan">Cyan</paper-item>
                  <paper-item value="teal">Teal</paper-item>
                  <paper-item value="green">Green</paper-item>
                  <paper-item value="light-green">Light Green</paper-item>
                  <paper-item value="lime">Lime</paper-item>
                  <paper-item value="yellow">Yellow</paper-item>
                  <paper-item value="amber">Amber</paper-item>
                  <paper-item value="orange">Orange</paper-item>
                  <paper-item value="deep-orange">Deep Orange</paper-item>
                  <paper-item value="brown">Deep Orange</paper-item>
                  <paper-item value="blue-grey">Blue-Grey</paper-item>
                </dropdown-select>
              </div>
              <paper-tooltip for="accent">Set an accent color for the table.</paper-tooltip>
              <editable-table-editor-toggle hidden\$="[[hideDarkTheme]]" label="Dark" prop="dark" tooltip="Use the dark theme." value\$="{{dark}}">
              </editable-table-editor-toggle>
            </div>
            <div class="field-group-border field-group-grow" hidden\$="[[hideTableStyles]]">
              <label>Styles: </label>
              <editable-table-editor-toggle hidden\$="[[hideBordered]]" label="Bordered" prop="bordered" tooltip="Add borders to cells." value\$="{{bordered}}">
              </editable-table-editor-toggle>
              <editable-table-editor-toggle hidden\$="[[hideStriped]]" label="Striped" prop="striped" tooltip="Add shading to alternating rows." value\$="{{striped}}">
              </editable-table-editor-toggle>
              <editable-table-editor-toggle hidden\$="[[hideCondensed]]" label="Condensed" prop="condensed" tooltip="Condense cell height." value\$="{{condensed}}">
              </editable-table-editor-toggle>
              <editable-table-editor-toggle hidden\$="[[hideScroll]]" label="Disable Responsive" prop="scroll" tooltip="Disables the default responsive feature." value\$="{{scroll}}">
              </editable-table-editor-toggle>
            </div>
            <div class="field-group-border field-group-grow" hidden\$="[[hideTableSort]]">
              <label>Sorting and Filtering: </label>
              <editable-table-editor-toggle disabled\$="[[!columnHeader]]" hidden\$="[[hideSort]]" label="Enable Sorting" prop="sort" tooltip="When first row is a column header, make the column sortable." value\$="{{sort}}">
              </editable-table-editor-toggle>
              <editable-table-editor-toggle hidden\$="[[hideFilter]]" label="Enable Filters" prop="filter" tooltip="When a cell is clicked toggle a filter based on that cell's value." value\$="{{filter}}">
              </editable-table-editor-toggle> 
            </div>
          </div>
        </a11y-collapse>
      <table id="table" class="table" bordered\$="{{bordered}}" condensed\$="{{condensed}}" striped\$="{{striped}}" summary="Editable table in edit mode. The table body contains fields to edit table data. Each column header contains buttons for editing the column. Each row header contains buttons for editing the row.">
        <caption class="sr-only">Editable Table Data</caption>
        <thead class="thead"> 
          <tr class="tr">
            <th class="th" scope="col"><span class="sr-only">Row Functions</span></th>
            <template id="headers" is="dom-repeat" items="[[data]]" as="row" index-as="tr" restamp="true">
              <template is="dom-if" if="[[_isFirstRow(tr)]]" restamp="true">
                <template id="headercols" is="dom-repeat" items="[[row]]" as="cell" index-as="th" restamp="true">
                  <th class="th" scope="col"><editable-table-editor-rowcol condensed\$="{{condensed}}" index\$="[[th]]" type="Column"></editable-table-editor-rowcol></th> 
                </template>   
              </template>
            </template>
          </tr> 
        </thead>
        <tbody id="tbody" class="tbody"> 
          <template id="rows" is="dom-repeat" items="[[data]]" as="row" index-as="tr" restamp="true">
            <tr class="tr">
              <th class="th" scope="row"><editable-table-editor-rowcol condensed\$="{{condensed}}" index\$="[[tr]]" type="Row"></editable-table-editor-rowcol></th>
              <template id="columns" is="dom-repeat" items="[[row]]" as="cell" restamp="true">
                <td class="td">
                  <editable-table-editor-cell row="[[tr]]" column="[[index]]" value\$="{{cell}}">
                    <iron-icon class="sortable-icon" icon="editable-table:sortable" aria-hidden="true"></iron-icon>
                    <iron-icon class="filter-icon" icon="editable-table:filter-off"></iron-icon>
                  </editable-table-editor-cell>
                </td>
              </template>
            </tr> 
          </template>
        </tbody>
      </table>
    </div>
`,

  is: "editable-table-editor",

  listeners: {
    "cell-move": "_onCellMove",
    "cell-value-changed": "_onCellValueChange",
    "insert-row": "_handleInsertRow",
    "insert-column": "_handleInsertColumn",
    "delete-row": "_handleDeleteRow",
    "delete-column": "_handleDeleteColumn",
    "editable-table-setting-changed": "_onTableSettingChange",
    "dropdown-select-changed": "_onAccentChange"
  },

  behaviors: [
    ResponsiveUtilityBehaviors,
    simpleColorsBehaviors,
    editableTableBehaviors.displayBehaviors,
    editableTableBehaviors.editBehaviors
  ],

  observers: ["_setMinimumData(data)"],

  properties: {
    /**
     * Get accent color and change unspecified to none.
     */
    accentSelected: {
      type: String,
      computed: "_getAccentSelected(accentColor)"
    },
    /**
     * Hide the table styles menu
     */
    hideTableStyles: {
      type: Boolean,
      computed:
        "_tableStylesHidden(hideBordered,hideCondensed,hideStriped,hideScroll)"
    },
    /**
     * Hide the table theme menu
     */
    hideTableTheme: {
      type: Boolean,
      computed: "_tableThemeHidden(hideAccentColor,hideDarkTheme)"
    },
    /**
     * Hide the table sorting & filtering menu
     */
    hideTableSort: {
      type: Boolean,
      computed: "_tableSortHidden(hideSort,hideFilter)"
    }
  },

  /**
   * click detection
   */
  ready: function() {
    this.onclick = function(e) {
      let el =
        e.srcElement !== null &&
        e.srcElement.tagName !== null &&
        e.srcElement.tagName.toLowerCase() === "td"
          ? e.srcElement
          : false;
      if (el && el.getElementsByTagName("editable-table-cell") !== null) {
        console.log(el.children[0]);
        el.children[0].focus();
      }
    };
  },

  /**
   * Get the current accent color
   */
  _getAccentSelected: function(accentColor) {
    return accentColor !== null ? accentColor : "none";
  },

  /**
   * Gets the row data for a given row index
   */
  _getCurrentRow: function(index, data) {
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
  },

  /**
   * Handles delete column event
   */
  _handleDeleteColumn: function(e) {
    this.deleteColumn(e.detail);
  },

  /**
   * Handles delete row event
   */
  _handleDeleteRow: function(e) {
    this.deleteRow(e.detail);
  },

  /**
   * Handles insert column event
   */
  _handleInsertColumn: function(e) {
    this.insertColumn(e.detail);
  },

  /**
   * Handles insert row event
   */
  _handleInsertRow: function(e) {
    this.insertRow(e.detail);
  },

  /**
   * Tests for first row of data. Workaround to restamp column headers.
   */
  _isFirstRow: function(index) {
    return index === 0;
  },

  /**
   * Handle accent dropdown-select change
   */
  _onAccentChange: function(e) {
    this.accentColor = e.detail.value !== "none" ? e.detail.value : null;
  },

  /**
   * Move the focus/cursor to the correct cell when navigation keys are pressed
   */
  _onCellMove: function(e) {
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
  },

  /**
   * Updates data when cell value changes
   */
  _onCellValueChange: function(e) {
    this.set("data." + e.detail.row + "." + e.detail.column, e.detail.value);
  },

  /**
   * Updates table properties when setting changes
   */
  _onTableSettingChange: function(e) {
    this[e.detail.prop] = e.detail.value;
  },

  /**
   * Makes sure there is always on cell to work from
   */
  _setMinimumData: function(data) {
    if (data.length < 1 || data[0].length < 1) {
      this.set("data", [["", "", ""], ["", "", ""], ["", "", ""]]);
    }
  },

  /**
   * Are all of the table style choices hidden?
   */
  _tableStylesHidden: function(
    hideBordered,
    hideCondensed,
    hideStriped,
    hideScroll
  ) {
    return hideBordered && hideCondensed && hideStriped && hideScroll;
  },

  /**
   * Are all of the theme choices hidden?
   */
  _tableThemeHidden: function(hideAccentColor, hideDarkTheme) {
    return hideAccentColor && hideDarkTheme;
  },

  /**
   * Are all of the theme choices hidden?
   */
  _tableSortHidden: function(hideSort, hideFilter) {
    return hideSort && hideFilter;
  },

  /**
   * Delete a column at the given index
   */
  deleteColumn: function(index) {
    if (confirm("Delete entire column?")) {
      for (let i = 0; i < this.data.length; i++) {
        this.splice("data." + i, index, 1);
      }
    }
  },

  /**
   * Delete a row at the given index
   */
  deleteRow: function(index) {
    if (confirm("Delete entire row?")) {
      this.splice("data", index, 1);
    }
  },

  /**
   * Insert a column at the given index
   */
  insertColumn: function(index) {
    let temp = new Array(),
      first = null;
    for (let i = 0; i < this.data.length; i++) {
      this.splice("data." + i, index, 0, "");
    }
  },

  /**
   * Insert a row at the given index
   */
  insertRow: function(index) {
    let temp = new Array();
    for (let i = 0; i < this.data[0].length; i++) {
      temp.push("");
    }
    this.splice("data", index + 1, 0, temp);
  }
});

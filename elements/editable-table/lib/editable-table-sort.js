import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "./editable-table-iconset.js";
/**
`editable-table-sort`

A column header that functions as a three-state sort button 
(no sort, sort ascending, sort descending) for the 
table-editor-display mode (table-editor-display.html).

@demo demo/index.html

@microcopy - the mental model for this element

<editable-table-sort 
  sort-mode="asc"               //The column's sort mode, can be "asc", "desc", or "none". Default is "none".
  sort-column="3"               //The column number of current sort column.
  column-number="2"             //The column number of this button. If this matches the sort-column number, sorting will be turned on.
  text="">                      //The text of the column header
</editable-table-sort>

*/
Polymer({
  _template: html`
    <style is="custom-style">
      :host paper-button {
        padding: 0;
        margin: 0;
        width: 100%;
        min-width: unset;
        display: inline-flex;
        justify-content: space-between;
        align-items:center;
        align-content: stretch;
        text-transform: unset;
      }
      :host paper-button > div {
        flex-grow: 1;
      }
      :host .sr-only {
        position: absolute;
        left: -9999px;
        font-size: 0;
        height: 0;
        width: 0;
        overflow: hidden;
      }
      :host:not([sort-mode="asc"]) .asc,
      :host:not([sort-mode="desc"]) .desc,
      :host:not([sort-mode="none"]) .none,
      :host #asc,
      :host #desc,
      :host[sorting]:not([sort-mode="none"]) #none {
        display: none;
      }
      :host[sorting][sort-mode="asc"] #asc,
      :host[sorting][sort-mode="desc"] #desc {
        display: flex;
      }
    </style>
    <paper-button id="button" class="container">
      [[text]]
      <span class="sr-only asc">(ascending)</span>
      <span class="sr-only desc">(descending)</span>
      <span class="sr-only"> Toggle sort mode.</span>
      <iron-icon id="asc" icon="arrow-drop-up"></iron-icon>
      <iron-icon id="desc" icon="arrow-drop-down"></iron-icon>
      <iron-icon id="none" icon="editable-table:sortable"></iron-icon>
    </paper-button>
`,

  is: "editable-table-sort",

  listeners: {
    tap: "_onSortTapped"
  },

  properties: {
    /**
     * sort ascending, descending or none
     */
    columnNumber: {
      type: Number,
      value: null,
      reflectToAttribute: true
    },
    /**
     * Sort mode: ascending, descending or none
     */
    sortMode: {
      type: String,
      value: "none",
      reflectToAttribute: true
    },
    /**
     * The index of the current sort column
     */
    sortColumn: {
      type: Number,
      value: -1,
      reflectToAttribute: true
    },
    /**
     * If this is the sort column, sorting is on
     */
    sorting: {
      type: Boolean,
      computed: "_isSorting(columnNumber,sortColumn)",
      reflectToAttribute: true
    },
    /**
     * the column header text
     */
    text: {
      type: String,
      value: ""
    }
  },

  /**
   * listen for button tap
   */
  _onSortTapped: function() {
    let root = this;
    root.fire("change-sort-mode", root);
  },

  /**
   * changes the sort mode
   */
  setSortMode: function(mode) {
    this.sortMode = mode;
    this.__checked = mode === "asc" ? true : mode === "desc" ? mode : false;
  },

  /**
   * Is the column number is the same as the current sort column?
   */
  _isSorting: function(columnNumber, sortColumn) {
    return columnNumber === sortColumn;
  }
});

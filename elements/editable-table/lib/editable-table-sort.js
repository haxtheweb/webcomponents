/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { editableTableCellStyles } from "./editable-table-behaviors.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";

/**
 * `editable-table-editor-sort`
 * A column header that functions as a three-state sort button (no sort, sort ascending, sort descending) for the table-editor-display mode (table-editor-display.html).
 *
 * @demo ./demo/display.html
 *
 * @polymer
 * @element editable-table-editor-sort
 */
class EditableTableSort extends LitElement {
  static get styles() {
    return [...(super.styles || []), ...editableTableCellStyles, css``];
  }
  render() {
    return html`
      <button id="button" class="cell-button" @click="${this._onSortClicked}">
        <slot></slot>
        <span class="sr-only asc">(ascending)</span>
        <span class="sr-only desc">(descending)</span>
        <span class="sr-only"> Toggle sort mode.</span>
        <simple-icon-lite
          icon="${this.sortMode == "asc"
            ? "arrow-drop-up"
            : this.sortMode == "desc"
            ? "arrow-drop-down"
            : "editable-table:sortable"}"
        ></simple-icon-lite>
      </button>
    `;
  }

  static get tag() {
    return "editable-table-sort";
  }

  static get properties() {
    return {
      /**
       * Sort ascending, descending or none
       */
      columnIndex: {
        attribute: "column-index",
        type: Number,
        reflect: true,
      },
      /**
       * Sort mode: ascending, descending or none
       */
      sortMode: {
        attribute: "sort-mode",
        type: String,
        reflect: true,
      },
      /**
       * Index of the current sort column
       */
      sortColumn: {
        attribute: "sort-column",
        type: Number,
        reflect: true,
      },
      /**
       * Column header text
       */
      text: {
        type: String,
      },
    };
  }
  constructor() {
    super();
    this.sortMode = "none";
    this.text = "";
    this.sortColumn = -1;
  }
  /**
   *
   * Whether the column is being sorted
   * @readonly
   * @memberof EditableTableSort
   */
  get sorting() {
    return this.columnIndex === this.sortColumn;
  }

  /**
   * Fires when sort button is clicked
   * @event change-sort-mode
   */
  _onSortClicked() {
    this.dispatchEvent(
      new CustomEvent("change-sort-mode", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this,
      })
    );
  }

  /**
   * Changes the sort mode
   * @param {string} mode the sort mode: `asc` for ascending or `desc` for descending;
   */
  setSortMode(mode) {
    this.sortMode = mode;
    this.__checked = mode === "asc" ? true : mode === "desc" ? mode : false;
  }
}
window.customElements.define(EditableTableSort.tag, EditableTableSort);
export { EditableTableSort };

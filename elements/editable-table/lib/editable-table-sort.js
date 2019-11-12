/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "./editable-table-iconset.js";

/**
 * `editable-table-editor-sort`
 * `A column header that functions as a three-state sort button (no sort, sort ascending, sort descending) for the table-editor-display mode (table-editor-display.html).`
 *
 * @demo ./demo/display.html
 *
 * @polymer
 * @customElement
 */
class EditableTableSort extends PolymerElement {
  static get template() {
    return html`
      <style is="custom-style">
        :host paper-button {
          padding: var(--editable-table-cell-padding, 0);
          margin: 0;
          width: auto;
          min-width: unset;
          display: flex;
          justify-content: space-between;
          align-items: center;
          align-content: stretch;
          text-transform: unset;
          font-family: var(--editable-table-font-family);
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
        :host(:not([sort-mode="asc"])) .asc,
        :host(:not([sort-mode="desc"])) .desc,
        :host(:not([sort-mode="none"])) .none,
        :host #asc,
        :host #desc,
        :host([sorting]:not([sort-mode="none"])) #none {
          display: none;
        }
        :host([sorting][sort-mode="asc"]) #asc,
        :host([sorting][sort-mode="desc"]) #desc {
          display: flex;
        }
      </style>
      <paper-button id="button" class="container" on-click="_onSortClicked">
        [[text]] <span class="sr-only asc">(ascending)</span>
        <span class="sr-only desc">(descending)</span>
        <span class="sr-only"> Toggle sort mode.</span>
        <iron-icon id="asc" icon="arrow-drop-up"></iron-icon>
        <iron-icon id="desc" icon="arrow-drop-down"></iron-icon>
        <iron-icon id="none" icon="editable-table:sortable"></iron-icon>
      </paper-button>
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
       * Index of the current sort column
       */
      sortColumn: {
        type: Number,
        value: -1,
        reflectToAttribute: true
      },
      /**
       * Whether the column is being sorted
       */
      sorting: {
        type: Boolean,
        computed: "_isSorting(columnIndex,sortColumn)",
        reflectToAttribute: true
      },
      /**
       * Column header text
       */
      text: {
        type: String,
        value: ""
      }
    };
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
        detail: this
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

  /**
   * Determines if column number is the same as the current sort column
   * @param {number} columnIndex the index of the column
   * @param {number} sortColumn the index of the column being sorted
   * @returns {boolean} whether this column is being sorted
   */
  _isSorting(columnIndex, sortColumn) {
    return columnIndex === sortColumn;
  }
}
window.customElements.define(EditableTableSort.tag, EditableTableSort);
export { EditableTableSort };

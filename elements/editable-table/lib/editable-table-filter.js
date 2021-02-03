/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { editableTableCellStyles } from "./editable-table-behaviors.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";

/**
 * `editable-table-editor-filter`
 * `Displays a cell in editable-table-display mode (editable-table-display.html) as a filter button.`
 *
 * @demo ./demo/display.html
 * @polymer
 * @element editable-table-editor-filter
 */
class EditableTableFilter extends LitElement {
  static get styles() {
    return [
      ...(super.styles || []),
      ...editableTableCellStyles,
      css`
        #filter-off {
          opacity: 0.25;
        }
        :host(:not([filtered])) .filtered,
        :host(:not([filtered]):not(:focus):not(:hover)) #filter,
        :host(:not([filtered]):focus) #filter-off,
        :host(:not([filtered]):hover) #filter-off,
        :host([filtered]:not(:focus):not(:hover)) #filter-off,
        :host([filtered]:focus) #filter,
        :host([filtered]:hover) #filter {
          display: none;
        }
      `,
    ];
  }
  render() {
    return html`
      <button id="button" class="cell-button" @click="${this._onFilterClicked}">
        <span><slot></slot></span>
        <span class="sr-only" .hidden="${!this.filtered}"> (filtered)</span>
        <span class="sr-only"> Toggle filter.</span>
        <simple-icon-lite
          id="filter"
          icon="editable-table:filter"
        ></simple-icon-lite>
        <simple-icon-lite
          id="filter-off"
          icon="editable-table:filter-off"
        ></simple-icon-lite>
      </button>
      <simple-tooltip for="button"
        >Toggle Column ${this.columnIndex} filter for "<slot
        ></slot>"</simple-tooltip
      >
    `;
  }

  static get tag() {
    return "editable-table-filter";
  }
  constructor() {
    super();
    this.columnIndex = null;
    this.filtered = false;
    this.text = "";
  }
  static get properties() {
    return {
      /**
       * Index of column
       */
      columnIndex: {
        type: Number,
        attribute: "column-index",
      },
      /**
       * Whether column is filtered
       */
      filtered: {
        type: Boolean,
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

  /**
   * Listens for button click
   */
  _getPressed(filtered) {
    return filtered ? "true" : "false";
  }

  /**
   * Fires when filter button is clicked
   * @event toggle-filter
   */
  _onFilterClicked() {
    this.dispatchEvent(
      new CustomEvent("toggle-filter", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this,
      })
    );
  }
}
window.customElements.define(EditableTableFilter.tag, EditableTableFilter);
export { EditableTableFilter };

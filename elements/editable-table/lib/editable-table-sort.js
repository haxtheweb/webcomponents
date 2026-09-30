/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { editableTableCellStyles } from "./editable-table-behaviors.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import { SimpleToolbarButtonBehaviors } from "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";

/**
 * `editable-table-editor-sort`
 * A column header that functions as a three-state sort button (no sort, sort ascending, sort descending) for table-editor-display mode (table-editor-display.html).
 *
 * @demo ./demo/display.html
 * @customElement
 * @extends LitElement
 * @extends editableTableCellStyles
 */
class EditableTableSort extends SimpleToolbarButtonBehaviors(DDD) {
  static get styles() {
    return [
      ...(super.styles || []),
      ...editableTableCellStyles,
      css`
        :host {
          display: block;
          font-family: inherit;
          font-size: inherit;
        }
        :host > div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }
        button {
          flex: 0 0 auto !important;
          width: auto !important;
        }
        #cell {
          flex: 1 1 auto !important;
          display: inline-block;
          padding: var(--ddd-spacing-1);
        }
      `,
    ];
  }

  static get tag() {
    return "editable-table-sort";
  }

  static get properties() {
    return {
      ...super.properties,
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
       * Index of current sort column
       */
      sortColumn: {
        attribute: "sort-column",
        type: Number,
        reflect: true,
      },
    };
  }
  render() {
    return html`
      <div>
        <slot id="cell"></slot>
        <span class="offscreen asc">(ascending)</span>
        <span class="offscreen desc">(descending)</span>
        ${super.render()}
      </div>
    `;
  }
  constructor() {
    super();
    this.sortMode = "none";
    this.sortColumn = -1;
    this.toggles = true;
    this.icon = "editable-table:sortable";
    this.label = "Toggle sort mode.";
    this.tooltip = "Toggles sorting by this column.";
    this.describedby = "cell";
  }

  willUpdate(changedProperties) {
    if (super.willUpdate) super.willUpdate(changedProperties);
    // Derive toggled + icon from columnIndex/sortMode/sortColumn in
    // willUpdate so reactive sets batch into the current update cycle.
    // Setting them in updated() scheduled a redundant second update (Lit
    // change-in-update warning).
    if (
      changedProperties.has("columnIndex") ||
      changedProperties.has("sortColumn")
    ) {
      this.toggled = this.columnIndex === this.sortColumn;
    }
    if (
      changedProperties.has("sortMode") ||
      changedProperties.has("columnIndex")
    ) {
      this.icon =
        this.sortMode == "asc"
          ? "arrow-drop-up"
          : this.sortMode == "desc"
            ? "arrow-drop-down"
            : "editable-table:sortable";
    }
  }

  /**
   * Fires when sort button is clicked
   * @event change-sort-mode
   */
  _handleClick() {
    this.dispatchEvent(
      new CustomEvent("change-sort-mode", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this,
      }),
    );
  }
}
globalThis.customElements.define(EditableTableSort.tag, EditableTableSort);
export { EditableTableSort };

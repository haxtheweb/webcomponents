/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import {
  cellBehaviors,
  editableTableCellStyles,
} from "./editable-table-behaviors.js";
import { A11yMenuButton } from "@lrnwebcomponents/a11y-menu-button/a11y-menu-button.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";

/**
 * `editable-table-editor-rowcol`
 * A header label and menu for inserting and deleting a row or a column of the editable-table interface (editable-table.html).
 *
 * @demo ./demo/editor.html
 *
 * @polymer
 * @element editable-table-editor-rowcol
 * @appliesMixin cellBehaviors
 */
class EditableTableEditorRowcol extends cellBehaviors(A11yMenuButton) {
  static get styles() {
    return [
      ...(super.styles || []),
      ...editableTableCellStyles,
      css`
        :host {
          display: block;
          --paper-item-min-height: 24px;
          --a11y-menu-button-border: none;
          --a11y-menu-button-list-border: 1px solid
            var(--editable-table-border-color, #999);
          --a11y-menu-button-vertical-padding: var(
            --editable-table-cell-vertical-padding,
            10px
          );
          --a11y-menu-button-horizontal-padding: var(
            --editable-table-cell-horizontal-padding,
            6px
          );
          --a11y-menu-button-item-focus-bg-color: var(
            --editable-table-heading-bg-color,
            #e8e8e8
          );
          --a11y-menu-button-list-bg-color: var(
            --editable-table-bg-color,
            #fff
          );
        }
        ul,
        absolute-position-behavior {
          width: 100%;
        }
        absolute-position-behavior.row,
        absolute-position-behavior.row ul {
          width: 150px;
        }
        a11y-menu-button-item {
          font-family: var(
            --editable-table-secondary-font-family,
            "Roboto",
            "Noto",
            sans-serif
          );
          color: var(--editable-table-color, #222);
          font-size: var(--editable-table-secondary-font-size, 12px);
        }
      `,
    ];
  }
  render() {
    return html`
      <button
        id="menubutton"
        aria-haspopup="true"
        aria-controls="menu"
        aria-expanded="${this.expanded ? "true" : "false"}"
      >
        <span class="sr-only">${this.type}</span>
        <span id="label">${this.label || ""} </span>
        <span class="sr-only">Menu</span>
        <simple-icon-lite icon="arrow-drop-down"></simple-icon-lite>
      </button>
      <absolute-position-behavior
        ?auto="${this.expanded}"
        class="${this.row ? "row" : "column"}"
        for="menubutton"
        position="${this.row ? "right" : "bottom"}"
        position-align="${this.row ? "start" : "center"}"
        offset="-3"
      >
        <ul
          id="menu"
          role="menu"
          aria-labelledby="menubutton"
          ?hidden="${!this.expanded}"
          @mousover="${(e) => (this.hover = true)}"
          @mousout="${(e) => (this.hover = false)}"
        >
          ${this._getItem()} ${this._getItem(false, true)}
          ${this._getItem(true)}
        </ul>
      </absolute-position-behavior>
    `;
  }
  static get tag() {
    return "editable-table-editor-rowcol";
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * Index of the row or column
       */
      index: {
        type: Number,
      },
      /**
       * Whether the menu button controls a row
       */
      row: {
        type: Boolean,
      },
    };
  }
  /**
   *
   * Gets the first cell that the menu controls
   * @readonly
   * @memberof EditableTableEditorRowcol
   */
  get controls() {
    return this.row ? `cell-0-${this.index}` : `cell-${this.index}-0`;
  }
  /**
   *
   * Gets row or column label based on type
   * @readonly
   * @memberof EditableTableEditorRowcol
   */
  get label() {
    return this.row
      ? this._getLabel(this.index, true)
      : this._getLabel(this.index, false);
  }
  /**
   *
   * get cell label
   * @readonly
   * @memberof EditableTableEditorRowcol
   */
  get labelInfo() {
    return html`<span class="sr-only">${this.label}</span>`;
  }
  /**
   *
   * Gets row or column type
   * @readonly
   * @memberof EditableTableEditorRowcol
   */
  get type() {
    return this.row ? "Row" : "Column";
  }
  /**
   * Fires when  selection is made from menu button
   * @event delete-rowcol
   * @param {number} index the index to perform the action
   * @param {boolean} whether the action is to insert
   */
  rowColAction(index = this.index, insert = true) {
    this.dispatchEvent(
      new CustomEvent("rowcol-action", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          insert: insert,
          row: this.row,
          index: index,
        },
      })
    );
  }
  _getItem(deleteItem = false, after = false) {
    return html` <a11y-menu-button-item
      @click="${deleteItem
        ? this._onDelete
        : after
        ? this._onInsertAfter
        : this._onInsertBefore}"
    >
      ${deleteItem ? "Delete" : "Insert"}
      ${this.type}${deleteItem ? " " : after ? " After " : " Before "}
      ${this.labelInfo}
    </a11y-menu-button-item>`;
  }
  /**
   * Handles when Delete Row/Column is clicked
   * @param {event} e the button event
   */
  _onDelete(e) {
    this.rowColAction(this.index, false);
  }
  /**
   * Handles when Insert Row/Column is clicked
   * @param {event} e the button event
   */
  _onInsertBefore(e) {
    this.rowColAction(this.row ? this.index - 1 : this.index);
  }
  /**
   * Handles when Insert Row/Column After is clicked
   * @param {event} e the button event
   */
  _onInsertAfter(e) {
    this.rowColAction(this.row ? this.index : this.index + 1);
  }
}
window.customElements.define(
  EditableTableEditorRowcol.tag,
  EditableTableEditorRowcol
);
export { EditableTableEditorRowcol };

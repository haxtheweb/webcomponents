/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import {
  cellBehaviors,
  editableTableCellStyles,
} from "./editable-table-behaviors.js";
import "@lrnwebcomponents/a11y-menu-button/a11y-menu-button.js";
import "@lrnwebcomponents/a11y-menu-button/lib/a11y-menu-button-item.js";
import { A11yMenuButton } from "@lrnwebcomponents/a11y-menu-button/a11y-menu-button.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";

/**
 * `editable-table-editor-rowcol`
 * A header label and menu for inserting and deleting a row or a column of editable-table interface (editable-table.html).
 *
 * @demo ./demo/editor.html
 * @customElement
 * @extends cellBehaviors
 * @extends A11yMenuButton
 */
class EditableTableEditorRowcol extends cellBehaviors(A11yMenuButton) {
  static get styles() {
    return [
      ...(super.styles || []),
      ...editableTableCellStyles,
      css`
        :host {
          display: block;
          height: 100%;
          width: 100%;
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
        a11y-menu-button {
          display: block;
          height: 100%;
          width: 100%;
        }
        a11y-menu-button::part(button) {
          font-family: var(
            --editable-table-secondary-font-family,
            "Roboto",
            "Noto",
            sans-serif
          );
          height: 100%;
          width: 100%;
        }
        a11y-menu-button::part(menu-outer) {
          min-width: 150px;
        }
        a11y-menu-button-item::part(button) {
          font-family: var(
            --editable-table-secondary-font-family,
            "Roboto",
            "Noto",
            sans-serif
          );
          color: var(--editable-table-color, #222);
          font-size: var(--editable-table-secondary-font-size, 12px);
          line-height: 150%;
        }
      `,
    ];
  }
  render() {
    return html`
      <a11y-menu-button
        id="menubutton" 
        position="${this.row ? "right" : "bottom"}"
        @open="${this._onOpen}">
        <span class="sr-only" slot="button">${this.type}</span>
        <span id="label" slot="button">${this.label || ""} </span>
        <span class="sr-only" slot="button">Menu</span>
        <simple-icon-lite icon="arrow-drop-down" slot="button"></simple-icon-lite>
          ${this._getItem()} 
          ${this._getItem(false, true)}
          ${this._getItem(true)}
        </ul>
      </a11y-menu-button>
    `;
  }
  static get tag() {
    return "editable-table-editor-rowcol";
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * Index of row or column
       */
      index: {
        type: Number,
      },
      /**
       * Whether menu button controls a row
       */
      row: {
        type: Boolean,
      },
    };
  }
  /**
   *
   * Gets first cell that menu controls
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
   * @param {number} index index to perform action
   * @param {boolean} whether action is to insert
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
    return html`<a11y-menu-button-item
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
  _onOpen(e) {
    this.dispatchEvent(
      new CustomEvent("rowcol-menuopen", {
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
  /**
   * Handles when Delete Row/Column is clicked
   * @param {event} e button event
   */
  _onDelete(e) {
    this.rowColAction(this.index, false);
  }
  /**
   * Handles when Insert Row/Column is clicked
   * @param {event} e button event
   */
  _onInsertBefore(e) {
    this.rowColAction(this.row ? this.index - 1 : this.index);
  }
  /**
   * Handles when Insert Row/Column After is clicked
   * @param {event} e button event
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

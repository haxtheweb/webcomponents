/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import {
  cellBehaviors,
  editableTableCellStyles,
} from "./editable-table-behaviors.js";
import "@haxtheweb/a11y-menu-button/lib/a11y-menu-button-item.js";
import { SimpleToolbarMenuBehaviors } from "@haxtheweb/simple-toolbar/lib/simple-toolbar-menu.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";

/**
 * `editable-table-editor-rowcol`
 * A header label and menu for inserting and deleting a row or a column of editable-table interface (editable-table.html).
 *
 * @demo ./demo/editor.html
 * @customElement
 * @extends cellBehaviors
 * @extends A11yMenuButton
 */
class EditableTableEditorRowcol extends SimpleToolbarMenuBehaviors(
  cellBehaviors(DDD),
) {
  static get styles() {
    return [
      ...(super.styles || []),
      ...editableTableCellStyles,
      css`
        :host {
          display: block;
        }
        :host [part="button"],
        :host [part="button"]:focus,
        :host(:focus-within) [part="button"],
        :host(:hover) [part="button"],
        :host [part="button"]:hover {
          border-radius: 0;
          background-color: transparent;
          border: none;
        }
        [role="menuitem"] {
          --simple-toolbar-button-hover-border-color: transparent;
        }
        [role="menuitem"]::part(button):hover,
        [role="menuitem"]::part(button):focus,
        [role="menuitem"]::part(button):focus-within {
          border: none;
          background-color: var(
            --editable-table-rowcol-hover-bg-color,
            var(--editable-table-stripe-bg-color, #f0f0f0)
          );
        }
      `,
    ];
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
   * Gets row or column type
   * @readonly
   * @memberof EditableTableEditorRowcol
   */
  get type() {
    return this.row ? "Row" : "Column";
  }

  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "index") {
        this.controls = this.row
          ? `cell-0-${this.index}`
          : `cell-${this.index}-0`;
      }
      if (propName === "index" || propName === "row") {
        this.label = this.row
          ? this._getLabel(this.index, true)
          : this._getLabel(this.index, false);
      }
      if (propName === "row") {
        this.position = this.row ? "right" : "bottom";
      }
    });
  }

  get listItemTemplate() {
    return html`
      <slot name="menuitem">
        ${this._getItem()} ${this._getItem(false, true)} ${this._getItem(true)}
      </slot>
      <slot></slot>
    `;
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
      }),
    );
  }
  _getItem(deleteItem = false, after = false) {
    let label = `${deleteItem ? "Delete " : "Insert "}${this.type}${
      deleteItem ? "" : after ? " After " : " Before "
    }`;
    return html` <simple-toolbar-menu-item slot="menuitem">
      <simple-toolbar-button
        role="menuitem"
        label="${label}"
        show-text-label
        align-horizontal="left"
        @button-toggled="${deleteItem
          ? this._onDelete
          : after
            ? this._onInsertAfter
            : this._onInsertBefore}"
      >
      </simple-toolbar-button>
    </simple-toolbar-menu-item>`;
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
customElements.define(EditableTableEditorRowcol.tag, EditableTableEditorRowcol);
export { EditableTableEditorRowcol };

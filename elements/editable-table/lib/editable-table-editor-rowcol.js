/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-menu-button/paper-menu-button.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-listbox/paper-listbox.js";
import "@polymer/paper-item/paper-item.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/iron-icons/iron-icons.js";
import { cellBehaviors } from "./editable-table-behaviors.js";

/**
 * `editable-table-editor-rowcol`
 * `A header label and menu for inserting and deleting a row or a column of the editable-table interface (editable-table.html).`
 *
 * @demo ./demo/editor.html
 *
 * @polymer
 * @customElement
 * @appliesMixin cellBehaviors
 */
class EditableTableEditorRowcol extends cellBehaviors(PolymerElement) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          --paper-item-min-height: 24px;
        }
        :host .sr-only {
          position: absolute;
          left: -9999px;
          font-size: 0;
          height: 0;
          width: 0;
          overflow: hidden;
        }
        :host #label {
          margin: 0;
          padding: 0;
        }
        :host paper-menu-button {
          margin: 0;
          padding: 0;
          width: 100%;
        }
        :host paper-listbox {
          padding: 0;
          background-color: var(--editable-table-bg-color);
        }
        :host paper-button,
        :host paper-item {
          margin: 0;
          text-transform: none;
          background-color: transparent;
          text-align: left;
          font-family: var(--editable-table-secondary-font-family);
          color: var(--editable-table-color);
        }
        :host paper-item {
          font-size: var(--editable-table-secondary-font-size);
        }
        :host paper-button {
          display: block;
          padding-top: var(--editable-table-row-vertical-padding);
          padding-bottom: var(--editable-table-row-vertical-padding);
        }
        :host([condensed]) paper-button {
          padding-top: var(--editable-table-row-vertical-padding-condensed);
          padding-bottom: var(--editable-table-row-vertical-padding-condensed);
        }
      </style>
      <paper-menu-button id="menu">
        <paper-button slot="dropdown-trigger">
          <span class="sr-only">[[_getType(row)]]</span>
          <span id="label">[[label]]</span>
          <span class="sr-only">Menu</span>
          <iron-icon icon="arrow-drop-down"></iron-icon>
        </paper-button>
        <paper-listbox
          slot="dropdown-content"
          label="[_getType(row)]] [[label]] Menu"
        >
          <paper-item role="button" on-click="_onInsertBefore">
            Insert [[_getType(row)]] Before
            <span class="sr-only">[[label]]]</span>
          </paper-item>
          <paper-item role="button" on-click="_onInsertAfter">
            Insert [[_getType(row)]] After
            <span class="sr-only">[[label]]]</span>
          </paper-item>
          <paper-item role="button" on-click="_onDelete">
            Delete [[_getType(row)]]
            <span class="sr-only">[[label]]]</span>
          </paper-item>
        </paper-listbox>
      </paper-menu-button>
      <paper-tooltip for="menu">[[_getType(row)]] [[label]] Menu</paper-tooltip>
    `;
  }
  static get tag() {
    return "editable-table-editor-rowcol";
  }
  static get properties() {
    return {
      /**
       * The cell that the menu controls
       */
      controls: {
        type: String,
        computed: "_getMenuControls(index,row)",
        reflectToAttribute: true
      },
      /**
       * Index of the row or column
       */
      index: {
        type: Number,
        value: null
      },
      /**
       * Label of the row or column
       */
      label: {
        type: String,
        computed: "_getLabel(index,row)"
      },
      /**
       * Whether the menu button controls a row
       */
      row: {
        type: Boolean,
        value: false
      }
    };
  }
  /**
   * Fires Delete Row/Column is clicked
   * @param {boolean} row whether it's row
   * @returns {string} "Row of "Column""
   */
  _getType(row) {
    return row ? "Row" : "Column";
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
          index: index
        }
      })
    );
  }
  /**
   * Gets the first cell that the menu controls
   * @param {number} index the index of thee row or column
   * @param {boolean} row is this menu for a row
   * @returns {string} the id of the first cell that the menu controls
   */
  _getMenuControls(index, row) {
    return row ? `cell-0-${index}` : `cell-${index}-0`;
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

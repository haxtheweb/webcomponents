/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-autogrow-textarea/iron-autogrow-textarea.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
import { cellBehaviors } from "./editable-table-behaviors.js";

/**
 * `editable-table-editor-cell`
 * @customElement editable-table-editor-cell
 * `An editable cell in the editable-table-editor (editable-table-editor.html) interface.`
 *
 * @demo ./demo/editor.html
 *
 * @polymer

 * @appliesMixin cellBehaviors
 */
class EditableTableEditorCell extends cellBehaviors(PolymerElement) {
  static get template() {
    return html`
      <style is="custom-style">
        :host {
          padding: 0;
          margin: 0;
          width: calc(
            100% - var(--editable-table-row-horizontal-padding) -
              var(--editable-table-row-horizontal-padding)
          );
          min-width: unset;
          display: inline-flex;
          justify-content: space-between;
          align-items: center;
          align-content: stretch;
        }
        :host iron-autogrow-textarea {
          width: 100%;
          padding: 0;
          border: none;
          font-weight: unset;
          resize: none;
          -webkit-appearance: none;
          -mozilla-appearance: none;
          flex-grow: 1;
          --iron-autogrow-textarea: {
            padding: 0;
            font-weight: unset;
            border: none;
            resize: none;
            flex-direction: column;
            -webkit-flex-direction: column;
            -webkit-appearance: none;
            -mozilla-appearance: none;
          }
        }
        :host iron-autogrow-textarea > * {
          padding: 0;
          font-weight: unset;
          border: none;
          resize: none;
          flex-direction: column;
          -webkit-flex-direction: column;
          -webkit-appearance: none;
          -mozilla-appearance: none;
        }
      </style>
      <iron-autogrow-textarea
        autofocus
        id="cell"
        label$="[[label]]"
        on-value-changed="_onValueChanged"
        value$="{{value}}"
      >
      </iron-autogrow-textarea>
      <div id="icons"><slot></slot></div>
    `;
  }

  static get tag() {
    return "editable-table-editor-cell";
  }
  static get properties() {
    return {
      /**
       * Cell row
       */
      row: {
        type: Number,
        value: null
      },
      /**
       * Cell column
       */
      column: {
        type: Number,
        value: null
      },
      /**
       * Cell label
       */
      label: {
        type: String,
        computed: "_getCellLabel(column,row)"
      },
      /**
       * Cell contents
       */
      value: {
        type: String,
        value: false
      }
    };
  }

  /**
   * Sets iron-a11y-keys target to this
   */
  ready() {
    super.ready();
    this.cell = this.shadowRoot.querySelector("#cell");
  }

  /**
   * Focuses the on text area
   */
  focus() {
    this.cell.textarea.focus();
  }

  /**
   * Gets the cell label, as in "Cell B2"
   * @param {number} column the column index
   * @param {number} row the row index
   * @returns {string} a label (eg., "Cell B2")
   */
  _getCellLabel(column, row) {
    return (
      this._getLabel(column, false) +
      this._getLabel(row, true) +
      "(editable table cell)"
    );
  }

  /**
   * Fires when cell value changes to notify table
   * @event cell-value-changed
   * @param {event} e the change event
   */
  _onValueChanged(e) {
    this.dispatchEvent(
      new CustomEvent("change", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          row: this.row,
          column: this.column,
          value: e.detail.value
        }
      })
    );
  }

  /**
   * Returns the caret (cursor) position of the specified text field.
   * FROM: https://stackoverflow.com/questions/2897155/get-cursor-position-in-characters-within-a-text-input-field
   * @returns {number} the caret position (value range is 0-oField.value.length).
   */
  getCaretPosition() {
    var caret = 0;
    // IE Support
    if (document.selection) {
      // Set focus on the element
      this.shadowRoot.querySelector("#cell").focus();
      // To get cursor position, get empty selection range
      var sel = document.selection.createRange();
      // Move selection start to 0 position
      sel.moveStart(
        "character",
        -this.shadowRoot.querySelector("#cell").value.length
      );
      // The caret position is selection length
      caret = sel.text.length;
    } else if (
      this.shadowRoot
        .querySelector("#cell")
        .shadowRoot.querySelector("textarea").selectionStart ||
      this.shadowRoot
        .querySelector("#cell")
        .shadowRoot.querySelector("textarea").selectionStart == "0"
    ) {
      caret = this.shadowRoot
        .querySelector("#cell")
        .shadowRoot.querySelector("textarea").selectionStart;
    }
    return caret;
  }

  /**
   * make sure caret is in the correct position
   * @param {number} start the start position of the caret
   * @param {number} end the start position of the caret
   */
  setCaretPosition(start, end) {
    let textarea = this.shadowRoot
      .querySelector("#cell")
      .shadowRoot.querySelector("textarea");
    textarea.focus();
    if (textarea.createTextRange) {
      let range = textarea.createTextRange();
      range.collapse(true);
      range.moveEnd("character", end);
      range.moveStart("character", start);
      range.select();
    } else if (textarea.setSelectionRange) {
      textarea.setSelectionRange(start, end);
      textarea.selectionStart = start;
      textarea.selectionEnd = end;
    }
  }

  /**
   * set focus to textarea and selects text as needed
   * @param {number} start the start position of the caret
   * @param {number} end the start position of the caret
   */
  setFocus(start, end) {
    this.shadowRoot
      .querySelector("#cell")
      .shadowRoot.querySelector("textarea")
      .focus();
    if (start !== undefined && end !== undefined) {
      this.setCaretPosition(start, this.getCaretPosition() - end);
    } else if (start !== undefined && start > -1) {
      this.setCaretPosition(start, start);
    } else if (start == -1 && end !== undefined) {
      this.setCaretPosition(start, this.getCaretPosition() - end);
    } else {
      this.setCaretPosition(0, 0);
    }
  }

  /**
   * fired when using keyboard to navigate left
   * @event cell-move
   */
  _onCellLeft() {
    this.dispatchEvent(
      new CustomEvent("cell-move", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: { cell: this.parentNode, direction: "left" }
      })
    );
  }

  /**
   * fired when using keyboard to navigate right
   * @event cell-move
   */
  _onCellRight() {
    this.dispatchEvent(
      new CustomEvent("cell-move", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: { cell: this.parentNode, direction: "right" }
      })
    );
  }

  /**
   * fired when using keyboard to navigate up
   * @event cell-move
   */
  _onCellAbove() {
    this.dispatchEvent(
      new CustomEvent("cell-move", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: { cell: this.parentNode, direction: "up" }
      })
    );
  }

  /**
   * fired when using keyboard to navigate down
   * @event cell-move
   */
  _onCellBelow() {
    this.dispatchEvent(
      new CustomEvent("cell-move", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: { cell: this.parentNode, direction: "down" }
      })
    );
  }
}
window.customElements.define(
  EditableTableEditorCell.tag,
  EditableTableEditorCell
);
export { EditableTableEditorCell };

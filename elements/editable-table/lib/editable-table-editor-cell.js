import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import "@polymer/iron-autogrow-textarea/iron-autogrow-textarea.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
import { cellBehaviors } from "./editable-table-behaviors.js";
/**
`editable-table-editor-cell`

An editable cell in the editable-table-editor 
(editable-table-editor.html) interface.

* @demo demo/index.html

@microcopy - the mental model for this element

<editable-table-editor-cell 
  row="3"                     //The index of the cell's row
  column="2"                  //The index of the cell's column
  value="">                   //The editable contents of the cell
  <iron-icon class="sortable-icon"icon="editable-table:sortable" aria-hidden="true"></iron-icon>
  <iron-icon class="filter-icon"icon="editable-table:filter-off"></iron-icon>
</editable-table-editor-cell>

*/
class EditableTableEditorCell extends cellBehaviors(PolymerElement) {
  static get template() {
    return html`
      <style is="custom-style">
        :host {
          padding: 0;
          margin: 0;
          width: 100%;
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
        autofocus=""
        id="cell"
        label\$="[[label]]"
        value\$="{{value}}"
      >
      </iron-autogrow-textarea>
      <div id="icons"><slot></slot></div>
      <iron-a11y-keys
        id="down"
        keys="down"
        target\$="[[cell]]"
        on-keys-pressed="_onCellBelow"
      >
      </iron-a11y-keys>
      <iron-a11y-keys
        id="up"
        keys="up"
        target\$="[[cell]]"
        on-keys-pressed="_onCellAbove"
      >
      </iron-a11y-keys>
      <iron-a11y-keys
        id="left"
        keys="left"
        target\$="[[cell]]"
        on-keys-pressed="_onCellLeft"
      >
      </iron-a11y-keys>
      <iron-a11y-keys
        id="right"
        keys="right"
        target\$="[[cell]]"
        on-keys-pressed="_onCellRight"
      >
      </iron-a11y-keys>
    `;
  }

  static get tag() {
    return "editable-table-editor-cell";
  }
  static get properties() {
    return {
      /**
       * cell row
       */
      row: {
        type: Number,
        value: null
      },
      /**
       * cell column
       */
      column: {
        type: Number,
        value: null
      },
      /**
       * cell label
       */
      label: {
        type: String,
        computed: "_getCellLabel(column,row)"
      },
      /**
       * cell contents
       */
      value: {
        type: String,
        value: false,
        reflectToAttribute: true
      }
    };
  }

  /**
   * set iron-a11y-keys target to this
   */
  ready() {
    super.ready();
    afterNextRender(this, function() {
      this.addEventListener(
        "bind-value-changed",
        this._onValueChanged.bind(this)
      );
    });
    this.cell = this.$.cell;
  }
  disconnectedCallback() {
    this.removeEventListener(
      "bind-value-changed",
      this._onValueChanged.bind(this)
    );
    super.disconnectedCallback();
  }

  /**
   * focus the on text area
   */
  focus() {
    this.cell.textarea.focus();
  }

  /**
   * if clicking in td but outside textarea, focus the text area
   */
  _getCellLabel(column, row) {
    return (
      "Cell " + this._getLabel(column, "Column") + this._getLabel(row, "Row")
    );
  }

  /**
   * if clicking in td but outside textarea, focus the text area
   */
  _onValueChanged(e) {
    this.dispatchEvent(
      new CustomEvent("cell-value-changed", {
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
   * FROM: https://stackoverflow.com/questions/2897155/get-cursor-position-in-characters-within-a-text-input-field
   * Returns the caret (cursor) position of the specified text field.
   * Return value range is 0-oField.value.length.
   */
  getCaretPosition() {
    var caret = 0;
    // IE Support
    if (document.selection) {
      // Set focus on the element
      this.$.cell.focus();
      // To get cursor position, get empty selection range
      var sel = document.selection.createRange();
      // Move selection start to 0 position
      sel.moveStart("character", -this.$.cell.value.length);
      // The caret position is selection length
      caret = sel.text.length;
    } else if (
      this.$.cell.shadowRoot.querySelector("textarea").selectionStart ||
      this.$.cell.shadowRoot.querySelector("textarea").selectionStart == "0"
    ) {
      caret = this.$.cell.shadowRoot.querySelector("textarea").selectionStart;
    }
    return caret;
  }

  /**
   * make sure caret is in the correct position
   */
  setCaretPosition(start, end) {
    let textarea = this.$.cell.shadowRoot.querySelector("textarea");
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
   * set focus to textarea
   */
  setFocus(start, end) {
    this.$.cell.shadowRoot.querySelector("textarea").focus();
    if (start !== undefined && end !== undefined) {
      this.setCaretPosition(start, end);
    } else if (start !== undefined) {
      this.setCaretPosition(start, start);
    } else {
      this.setCaretPosition(0, 0);
    }
  }

  /**
   * handle left
   */
  _onCellLeft(e) {
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
   * handle right
   */
  _onCellRight(e) {
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
   * handle up
   */
  _onCellAbove(e) {
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
   * handle down
   */
  _onCellBelow(e) {
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

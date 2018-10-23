import "@polymer/polymer/polymer.js";
import "web-animations-js/web-animations-next-lite.min.js";
import "@polymer/iron-autogrow-textarea/iron-autogrow-textarea.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "./editable-table-behaviors.js";
/**
`editable-table-editor-cell`

An editable cell in the editable-table-editor 
(editable-table-editor.html) interface.

@demo demo/index.html

@microcopy - the mental model for this element

<editable-table-editor-cell 
  row="3"                     //The index of the cell's row
  column="2"                  //The index of the cell's column
  value="">                   //The editable contents of the cell
  <iron-icon class="sortable-icon"icon="editable-table:sortable" aria-hidden="true"></iron-icon>
  <iron-icon class="filter-icon"icon="editable-table:filter-off"></iron-icon>
</editable-table-editor-cell>

*/
Polymer({
  _template: `
    <style is="custom-style">
      :host {
        padding: 0;
        margin: 0;
        width: 100%;
        min-width: unset;
        display: inline-flex;
        justify-content: space-between;
        align-items:center;
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
    <iron-autogrow-textarea autofocus="" id="cell" label\$="[[label]]" value\$="{{value}}">
    </iron-autogrow-textarea>
    <div id="icons"><slot></slot></div>
    <iron-a11y-keys id="down" keys="down" target\$="[[cell]]" on-keys-pressed="_onCellBelow">
    </iron-a11y-keys>
    <iron-a11y-keys id="up" keys="up" target\$="[[cell]]" on-keys-pressed="_onCellAbove">
    </iron-a11y-keys>
    <iron-a11y-keys id="left" keys="left" target\$="[[cell]]" on-keys-pressed="_onCellLeft">
    </iron-a11y-keys>
    <iron-a11y-keys id="right" keys="right" target\$="[[cell]]" on-keys-pressed="_onCellRight">
    </iron-a11y-keys>
`,

  is: "editable-table-editor-cell",
  listeners: { "bind-value-changed": "_onValueChanged" },
  behaviors: [editableTableBehaviors.cellBehaviors],

  properties: {
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
  },

  /**
   * set iron-a11y-keys target to this
   */
  ready: function() {
    this.cell = this.$.cell;
  },

  /**
   * focus the on text area
   */
  focus: function() {
    this.cell.textarea.focus();
  },

  /**
   * if clicking in td but outside textarea, focus the text area
   */
  _getCellLabel: function(column, row) {
    return (
      "Cell " + this._getLabel(column, "Column") + this._getLabel(row, "Row")
    );
  },

  /**
   * if clicking in td but outside textarea, focus the text area
   */
  _onValueChanged: function(e) {
    let root = this;
    root.fire("cell-value-changed", {
      row: root.row,
      column: root.column,
      value: e.detail.value
    });
  },

  /**
   * FROM: https://stackoverflow.com/questions/2897155/get-cursor-position-in-characters-within-a-text-input-field
   * Returns the caret (cursor) position of the specified text field.
   * Return value range is 0-oField.value.length.
   */
  getCaretPosition: function() {
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
      this.$.cell.$$("textarea").selectionStart ||
      this.$.cell.$$("textarea").selectionStart == "0"
    ) {
      caret = this.$.cell.$$("textarea").selectionStart;
    }
    return caret;
  },

  /**
   * make sure caret is in the correct position
   */
  setCaretPosition: function(start, end) {
    let textarea = this.$.cell.$$("textarea");
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
  },

  /**
   * set focus to textarea
   */
  setFocus: function(start, end) {
    this.$.cell.$$("textarea").focus();
    if (start !== undefined && end !== undefined) {
      this.setCaretPosition(start, end);
    } else if (start !== undefined) {
      this.setCaretPosition(start, start);
    } else {
      this.setCaretPosition(0, 0);
    }
  },

  /**
   * handle left
   */
  _onCellLeft: function(e) {
    this.fire("cell-move", { cell: this.parentNode, direction: "left" });
  },

  /**
   * handle right
   */
  _onCellRight: function(e) {
    this.fire("cell-move", { cell: this.parentNode, direction: "right" });
  },

  /**
   * handle up
   */
  _onCellAbove: function(e) {
    this.fire("cell-move", { cell: this.parentNode, direction: "up" });
  },

  /**
   * handle down
   */
  _onCellBelow: function(e) {
    this.fire("cell-move", { cell: this.parentNode, direction: "down" });
  }
});

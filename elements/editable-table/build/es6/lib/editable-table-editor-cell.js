import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/iron-autogrow-textarea/iron-autogrow-textarea.js";
import "../node_modules/@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "./editable-table-behaviors.js";
Polymer({
  _template: html`
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
    row: { type: Number, value: null },
    column: { type: Number, value: null },
    label: { type: String, computed: "_getCellLabel(column,row)" },
    value: { type: String, value: !1, reflectToAttribute: !0 }
  },
  ready: function() {
    this.cell = this.$.cell;
  },
  focus: function() {
    this.cell.textarea.focus();
  },
  _getCellLabel: function(column, row) {
    return (
      "Cell " + this._getLabel(column, "Column") + this._getLabel(row, "Row")
    );
  },
  _onValueChanged: function(e) {
    let root = this;
    root.fire("cell-value-changed", {
      row: root.row,
      column: root.column,
      value: e.detail.value
    });
  },
  getCaretPosition: function() {
    var caret = 0;
    if (document.selection) {
      this.$.cell.focus();
      var sel = document.selection.createRange();
      sel.moveStart("character", -this.$.cell.value.length);
      caret = sel.text.length;
    } else if (
      this.$.cell.shadowRoot.querySelector("textarea").selectionStart ||
      "0" == this.$.cell.shadowRoot.querySelector("textarea").selectionStart
    ) {
      caret = this.$.cell.shadowRoot.querySelector("textarea").selectionStart;
    }
    return caret;
  },
  setCaretPosition: function(start, end) {
    let textarea = this.$.cell.shadowRoot.querySelector("textarea");
    textarea.focus();
    if (textarea.createTextRange) {
      let range = textarea.createTextRange();
      range.collapse(!0);
      range.moveEnd("character", end);
      range.moveStart("character", start);
      range.select();
    } else if (textarea.setSelectionRange) {
      textarea.setSelectionRange(start, end);
      textarea.selectionStart = start;
      textarea.selectionEnd = end;
    }
  },
  setFocus: function(start, end) {
    this.$.cell.shadowRoot.querySelector("textarea").focus();
    if (start !== void 0 && end !== void 0) {
      this.setCaretPosition(start, end);
    } else if (start !== void 0) {
      this.setCaretPosition(start, start);
    } else {
      this.setCaretPosition(0, 0);
    }
  },
  _onCellLeft: function() {
    this.fire("cell-move", { cell: this.parentNode, direction: "left" });
  },
  _onCellRight: function() {
    this.fire("cell-move", { cell: this.parentNode, direction: "right" });
  },
  _onCellAbove: function() {
    this.fire("cell-move", { cell: this.parentNode, direction: "up" });
  },
  _onCellBelow: function() {
    this.fire("cell-move", { cell: this.parentNode, direction: "down" });
  }
});

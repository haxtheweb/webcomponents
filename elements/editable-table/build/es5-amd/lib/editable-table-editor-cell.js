define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/iron-autogrow-textarea/iron-autogrow-textarea.js",
  "../node_modules/@polymer/iron-a11y-keys/iron-a11y-keys.js",
  "./editable-table-behaviors.js"
], function(
  _polymerLegacy,
  _ironAutogrowTextarea,
  _ironA11yKeys,
  _editableTableBehaviors
) {
  "use strict";
  function _templateObject_370a7ec0f32e11e8a76ee1850d2d1763() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style is="custom-style">\n      :host {\n        padding: 0;\n        margin: 0;\n        width: 100%;\n        min-width: unset;\n        display: inline-flex;\n        justify-content: space-between;\n        align-items:center;\n        align-content: stretch;\n      }\n      :host iron-autogrow-textarea {\n        width: 100%;\n        padding: 0;\n        border: none;\n        font-weight: unset;\n        resize: none;\n        -webkit-appearance: none;\n        -mozilla-appearance: none;\n        flex-grow: 1;\n        --iron-autogrow-textarea: {\n          padding: 0;\n          font-weight: unset;\n          border: none;\n          resize: none;\n          flex-direction: column;\n          -webkit-flex-direction: column;\n          -webkit-appearance: none;\n          -mozilla-appearance: none;\n        }\n      }\n      :host iron-autogrow-textarea > * {\n        padding: 0;\n        font-weight: unset;\n        border: none;\n        resize: none;\n        flex-direction: column;\n        -webkit-flex-direction: column;\n        -webkit-appearance: none;\n        -mozilla-appearance: none;\n      }\n    </style>\n    <iron-autogrow-textarea autofocus="" id="cell" label$="[[label]]" value$="{{value}}">\n    </iron-autogrow-textarea>\n    <div id="icons"><slot></slot></div>\n    <iron-a11y-keys id="down" keys="down" target$="[[cell]]" on-keys-pressed="_onCellBelow">\n    </iron-a11y-keys>\n    <iron-a11y-keys id="up" keys="up" target$="[[cell]]" on-keys-pressed="_onCellAbove">\n    </iron-a11y-keys>\n    <iron-a11y-keys id="left" keys="left" target$="[[cell]]" on-keys-pressed="_onCellLeft">\n    </iron-a11y-keys>\n    <iron-a11y-keys id="right" keys="right" target$="[[cell]]" on-keys-pressed="_onCellRight">\n    </iron-a11y-keys>\n'
      ],
      [
        '\n    <style is="custom-style">\n      :host {\n        padding: 0;\n        margin: 0;\n        width: 100%;\n        min-width: unset;\n        display: inline-flex;\n        justify-content: space-between;\n        align-items:center;\n        align-content: stretch;\n      }\n      :host iron-autogrow-textarea {\n        width: 100%;\n        padding: 0;\n        border: none;\n        font-weight: unset;\n        resize: none;\n        -webkit-appearance: none;\n        -mozilla-appearance: none;\n        flex-grow: 1;\n        --iron-autogrow-textarea: {\n          padding: 0;\n          font-weight: unset;\n          border: none;\n          resize: none;\n          flex-direction: column;\n          -webkit-flex-direction: column;\n          -webkit-appearance: none;\n          -mozilla-appearance: none;\n        }\n      }\n      :host iron-autogrow-textarea > * {\n        padding: 0;\n        font-weight: unset;\n        border: none;\n        resize: none;\n        flex-direction: column;\n        -webkit-flex-direction: column;\n        -webkit-appearance: none;\n        -mozilla-appearance: none;\n      }\n    </style>\n    <iron-autogrow-textarea autofocus="" id="cell" label\\$="[[label]]" value\\$="{{value}}">\n    </iron-autogrow-textarea>\n    <div id="icons"><slot></slot></div>\n    <iron-a11y-keys id="down" keys="down" target\\$="[[cell]]" on-keys-pressed="_onCellBelow">\n    </iron-a11y-keys>\n    <iron-a11y-keys id="up" keys="up" target\\$="[[cell]]" on-keys-pressed="_onCellAbove">\n    </iron-a11y-keys>\n    <iron-a11y-keys id="left" keys="left" target\\$="[[cell]]" on-keys-pressed="_onCellLeft">\n    </iron-a11y-keys>\n    <iron-a11y-keys id="right" keys="right" target\\$="[[cell]]" on-keys-pressed="_onCellRight">\n    </iron-a11y-keys>\n'
      ]
    );
    _templateObject_370a7ec0f32e11e8a76ee1850d2d1763 = function _templateObject_370a7ec0f32e11e8a76ee1850d2d1763() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_370a7ec0f32e11e8a76ee1850d2d1763()
    ),
    is: "editable-table-editor-cell",
    listeners: { "bind-value-changed": "_onValueChanged" },
    behaviors: [editableTableBehaviors.cellBehaviors],
    properties: {
      row: { type: Number, value: null },
      column: { type: Number, value: null },
      label: { type: String, computed: "_getCellLabel(column,row)" },
      value: { type: String, value: !1, reflectToAttribute: !0 }
    },
    ready: function ready() {
      this.cell = this.$.cell;
    },
    focus: function focus() {
      this.cell.textarea.focus();
    },
    _getCellLabel: function _getCellLabel(column, row) {
      return (
        "Cell " + this._getLabel(column, "Column") + this._getLabel(row, "Row")
      );
    },
    _onValueChanged: function _onValueChanged(e) {
      var root = this;
      root.fire("cell-value-changed", {
        row: root.row,
        column: root.column,
        value: e.detail.value
      });
    },
    getCaretPosition: function getCaretPosition() {
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
    setCaretPosition: function setCaretPosition(start, end) {
      var textarea = this.$.cell.shadowRoot.querySelector("textarea");
      textarea.focus();
      if (textarea.createTextRange) {
        var range = textarea.createTextRange();
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
    setFocus: function setFocus(start, end) {
      this.$.cell.shadowRoot.querySelector("textarea").focus();
      if (start !== void 0 && end !== void 0) {
        this.setCaretPosition(start, end);
      } else if (start !== void 0) {
        this.setCaretPosition(start, start);
      } else {
        this.setCaretPosition(0, 0);
      }
    },
    _onCellLeft: function _onCellLeft(e) {
      this.fire("cell-move", { cell: this.parentNode, direction: "left" });
    },
    _onCellRight: function _onCellRight(e) {
      this.fire("cell-move", { cell: this.parentNode, direction: "right" });
    },
    _onCellAbove: function _onCellAbove(e) {
      this.fire("cell-move", { cell: this.parentNode, direction: "up" });
    },
    _onCellBelow: function _onCellBelow(e) {
      this.fire("cell-move", { cell: this.parentNode, direction: "down" });
    }
  });
});

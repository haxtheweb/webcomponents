import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/paper-button/paper-button.js";
import "../node_modules/@polymer/iron-icons/iron-icons.js";
import "./editable-table-iconset.js";
Polymer({
  _template: html`
    <style is="custom-style">
      :host paper-button {
        padding: 0;
        margin: 0;
        width: 100%;
        min-width: unset;
        display: inline-flex;
        justify-content: space-between;
        align-items:center;
        align-content: stretch;
        text-transform: unset;
      }
      :host paper-button > div {
        flex-grow: 1;
      }
      :host .sr-only {
        position: absolute;
        left: -9999px;
        font-size: 0;
        height: 0;
        width: 0;
        overflow: hidden;
      }
      :host(:not([sort-mode="asc"])) .asc,
      :host(:not([sort-mode="desc"])) .desc,
      :host(:not([sort-mode="none"])) .none,
      :host #asc,
      :host #desc,
      :host([sorting]:not([sort-mode="none"])) #none {
        display: none;
      }
      :host([sorting][sort-mode="asc"]) #asc,
      :host([sorting][sort-mode="desc"]) #desc {
        display: flex;
      }
    </style>
    <paper-button id="button" class="container">
      [[text]]
      <span class="sr-only asc">(ascending)</span>
      <span class="sr-only desc">(descending)</span>
      <span class="sr-only"> Toggle sort mode.</span>
      <iron-icon id="asc" icon="arrow-drop-up"></iron-icon>
      <iron-icon id="desc" icon="arrow-drop-down"></iron-icon>
      <iron-icon id="none" icon="editable-table:sortable"></iron-icon>
    </paper-button>
`,
  is: "editable-table-sort",
  listeners: { tap: "_onSortTapped" },
  properties: {
    columnNumber: { type: Number, value: null, reflectToAttribute: !0 },
    sortMode: { type: String, value: "none", reflectToAttribute: !0 },
    sortColumn: { type: Number, value: -1, reflectToAttribute: !0 },
    sorting: {
      type: Boolean,
      computed: "_isSorting(columnNumber,sortColumn)",
      reflectToAttribute: !0
    },
    text: { type: String, value: "" }
  },
  _onSortTapped: function() {
    let root = this;
    root.fire("change-sort-mode", root);
  },
  setSortMode: function(mode) {
    this.sortMode = mode;
    this.__checked = "asc" === mode ? !0 : "desc" === mode ? mode : !1;
  },
  _isSorting: function(columnNumber, sortColumn) {
    return columnNumber === sortColumn;
  }
});

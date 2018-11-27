import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/paper-button/paper-button.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
      :host paper-button {
        display: block;
        text-transform: none;
        text-align: left;
      }
    </style>
    <paper-button><slot></slot></paper-button>
`,
  is: "editable-table-editor-insdel",
  listeners: { tap: "_onTap" },
  properties: {
    action: { type: String, value: null },
    index: { type: Number, value: null, reflectToAttribute: !0 },
    before: { type: Boolean, value: !1, reflectToAttribute: !0 },
    type: { type: String, value: null }
  },
  _onTap: function(e) {
    let root = this,
      action = root.action,
      type = root.type,
      before = root.before,
      index = root.index,
      event = action + "-" + type.toLowerCase();
    if ("insert" === action && before && "Row" === type) {
      index--;
    } else if ("insert" === action && !before && "Row" !== type) {
      index++;
    }
    root.fire(event, index);
  }
});

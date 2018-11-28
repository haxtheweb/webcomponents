import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/paper-button/paper-button.js";
import "../node_modules/@polymer/paper-toggle-button/paper-toggle-button.js";
import "../node_modules/@polymer/paper-item/paper-item.js";
import "../node_modules/@polymer/paper-tooltip/paper-tooltip.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
      :host .setting {
        font-size: 95%;
        padding: var(--editable-table-toggle-padding, 8px 0px);
        justify-content: space-between;
        width: 100%;
      }
      :host([disabled]) .setting-text {
        opacity: 0.5;
      }
    </style>
    <div class="setting">
      <div class="setting-control">
        <paper-toggle-button id="button" checked\$="[[value]]" disabled\$="[[disabled]]">[[label]]</paper-toggle-button>
        <paper-tooltip id="tooltip" for="button">[[tooltip]]</paper-tooltip>
      </div>
    </div>
`,
  is: "editable-table-editor-toggle",
  listeners: { change: "_onChange" },
  properties: {
    disabled: { type: Boolean, value: !1, reflectToAttribute: !0 },
    label: { type: String, value: null },
    prop: { type: String, value: null },
    tooltip: { type: String, value: null },
    value: { type: Boolean, value: !1 }
  },
  _onChange: function(e) {
    let root = this;
    if (e.srcElement === this.$.button)
      root.fire("editable-table-setting-changed", {
        prop: this.prop,
        value: e.srcElement.checked
      });
  }
});

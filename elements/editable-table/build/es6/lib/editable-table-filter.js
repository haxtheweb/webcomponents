import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/paper-button/paper-button.js";
import "../node_modules/@polymer/paper-tooltip/paper-tooltip.js";
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
      :host #filter-off {
        opacity: 0.25;
      }
      :host:not([filtered]) .filtered,
      :host:not([filtered]):not(:focus):not(:hover) #filter,
      :host:not([filtered]):focus #filter-off, 
      :host:not([filtered]):hover #filter-off,
      :host[filtered]:not(:focus):not(:hover) #filter-off,
      :host[filtered]:focus #filter, 
      :host[filtered]:hover #filter {
        display: none;
      }
    </style>
    <paper-button id="button" class="container">
      <span>[[text]]</span>
      <span class="sr-only" hidden\$="[[!filtered]]"> (filtered)</span>
      <span class="sr-only"> Toggle filter.</span>
      <iron-icon id="filter" icon="editable-table:filter"></iron-icon>
      <iron-icon id="filter-off" icon="editable-table:filter-off"></iron-icon>
    </paper-button>
    <paper-tooltip for="button">Toggle filter for "[[text]]"</paper-tooltip>
`,
  is: "editable-table-filter",
  listeners: { tap: "_onFilterTapped" },
  properties: {
    columnNumber: { type: Number, value: null },
    filtered: { type: Boolean, value: !1, reflectToAttribute: !0 },
    text: { type: String, value: "" }
  },
  _getPressed: function(filtered) {
    return filtered ? "true" : "false";
  },
  _onFilterTapped: function() {
    let root = this;
    root.fire("toggle-filter", root);
  }
});

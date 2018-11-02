import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/paper-menu-button/paper-menu-button.js";
import "../node_modules/@polymer/paper-button/paper-button.js";
import "../node_modules/@polymer/paper-listbox/paper-listbox.js";
import "../node_modules/@polymer/paper-tooltip/paper-tooltip.js";
import "./editable-table-editor-insdel.js";
import "./editable-table-behaviors.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
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
      :host paper-button {
        margin: 0;
        display: block;
        background-color: transparent;
      }
      :host([condensed]) paper-button {
        padding-top: 0;
        padding-bottom: 0;
      }
    </style>
    <paper-menu-button id="menu">
      <paper-button slot="dropdown-trigger">
        <span id="label">[[label]]</span> <iron-icon icon="arrow-drop-down"></iron-icon>
      </paper-button>
      <paper-listbox slot="dropdown-content" label\$="[[label]]">
        <editable-table-editor-insdel action="insert" index\$="[[index]]" type\$="[[type]]" before="true">Insert [[type]] Before</editable-table-editor-insdel>
        <editable-table-editor-insdel action="insert" index\$="[[index]]" type\$="[[type]]">Insert [[type]] After</editable-table-editor-insdel>
        <editable-table-editor-insdel action="delete" index\$="[[index]]" type\$="[[type]]">Delete [[type]]</editable-table-editor-insdel>
      </paper-listbox>
    </paper-menu-button>
`,
  is: "editable-table-editor-rowcol",
  listeners: { "insdel-tapped": "_onTap" },
  behaviors: [editableTableBehaviors.cellBehaviors],
  properties: {
    index: { type: Number, value: null },
    label: { type: String, computed: "_getLabel(index,type)" },
    type: { type: String, value: null }
  }
});

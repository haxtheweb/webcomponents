import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "./node_modules/@polymer/paper-tooltip/paper-tooltip.js";
import "./node_modules/@polymer/paper-toggle-button/paper-toggle-button.js";
import "./lib/editable-table-behaviors.js";
import "./lib/editable-table-editor.js";
import "./lib/editable-table-display.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        width: 100%;
      }
    </style>
    <paper-tooltip for="button" position="left">Edit this table.</paper-tooltip>
    <template id="display" is="dom-if" if="[[!editMode]]" restamp="true">
      <editable-table-display accent-color\$="[[accentColor]]" bordered\$="[[bordered]]" caption\$="[[caption]]" column-header\$="[[columnHeader]]" dark\$="[[dark]]" data\$="[[data]]" condensed\$="[[condensed]]" filter\$="[[filter]]" footer\$="[[footer]]" row-header\$="[[rowHeader]]" scroll\$="[[scroll]]" sort\$="[[sort]]" striped\$="[[striped]]" summary\$="[[summary]]">
      </editable-table-display>
    </template>
    <template id="editor" is="dom-if" if="[[editMode]]" restamp="true">
      <editable-table-editor accent-color\$="[[accentColor]]" bordered\$="[[bordered]]" caption\$="[[caption]]" column-header\$="[[columnHeader]]" condensed\$="[[condensed]]" dark\$="[[dark]]" data\$="[[data]]" filter\$="[[filter]]" footer\$="[[footer]]" hide-accent-color\$="[[hideAccentColor]]" hide-dark-theme\$="[[hideDarkTheme]]" hide-bordered\$="[[hideBordered]]" hide-condensed\$="[[hideCondensed]]" hide-filter\$="[[hideFilter]]" hide-sort\$="[[hideSort]]" hide-scroll\$="[[hideScroll]]" hide-striped\$="[[hideStriped]]" row-header\$="[[rowHeader]]" scroll\$="[[scroll]]" sort\$="[[sort]]" striped\$="[[striped]]" summary\$="[[summary]]">
      </editable-table-editor>
    </template>
`,
  is: "editable-table",
  behaviors: [
    editableTableBehaviors.displayBehaviors,
    editableTableBehaviors.editBehaviors
  ],
  properties: { editMode: { type: Boolean, value: !1 } },
  toggleEditMode: function(edit) {
    let temp;
    edit = edit !== void 0 ? edit : !this.editMode;
    if (edit) {
      this.querySelector("editable-table-display").toggleFilter();
      this.querySelector("editable-table-display").sortData(!1);
      temp = this.querySelector("editable-table-display").getData();
      console.log(temp);
    } else {
      temp = this.querySelector("editable-table-editor").getData();
    }
    for (prop in temp) {
      if ("data" !== prop) {
        this[prop] = temp[prop];
      } else {
        this.set("data", temp[prop]);
      }
    }
    this.editMode = edit;
  }
});

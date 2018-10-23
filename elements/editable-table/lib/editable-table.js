import "@polymer/polymer/polymer.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/paper-toggle-button/paper-toggle-button.js";
import "./editable-table-behaviors.js";
import "./editable-table-editor.js";
import "./editable-table-display.js";
/**
`editable-table`

An editor interface for tables that toggles between 
view mode (editable-table-display.html) and 
edit mode (editable-table-editor.html). 
(See editable-table-behaviors.html for more information.)

@demo demo/index.html

@microcopy - the mental model for this element

<editable-table 
  accent-color="indigo"     //Optional accent color for column headers and border. Default is none. (See https://lrnwebcomponents.github.io/simple-colors/components/simple-colors/)
  bordered                  //Adds borders to table. Default is no border.
  caption="..."             //The caption or title for the table.
  column-header             //Does the table use the first row as a column-header? Default is false.
  condensed                 //Condense the padding above and below the table? Default is false.
  dark                      //Optional dark theme. Default is light theme. (See https://lrnwebcomponents.github.io/simple-colors/components/simple-colors/)
  data='[                   //Table data as an array. For example:
    [ ["..."], ["..."] ],     //This line represents a row with two columns
    [ ["..."], ["..."] ],     //This line represents another row with two columns
    [ ["..."], ["..."] ]      //This line represents a third row with two columns
  ]'
  edit-mode                 //Is the editor in edit mode? Default is false which places the table in display mode. 
  filter                    //Allow table to toggle filtering? When a cell is toggled, only rows that have the same value as that cell will be shown. Default is no filter.
  footer                    //Does the table use the last row as a footer? Default is false.
  hide-accent-color           //Hide the accent color dropdown menu? Default is false which enables the menu which changes the accent-color property.
  hide-bordered              //Hide the bordered toggle? Default is false so that a toggle button to control the bordered property.
  hide-condensed             //Hide the condensed toggle? Default is false so that a toggle button to control the condensed property.
  hide-dark-theme             //Hide the dark theme toggle? Default is false so that a toggle button to control the dark property.
  hide-filter                //Hide the filter toggle? Default is false so that a toggle button to control the filter property.
  hide-sort                  //Hide the sort toggle? Default is false so that a toggle button to control the sort property.
  hide-scroll                //Hide the scroll toggle? Default is false so that a toggle button to control the scroll property.
  hide-striped               //Hide the striped toggle? Default is false so that a toggle button to control the striped property.
  row-header                //Does the table use the first column as a row header? Default is false.
  scroll                    //Does the table use scrolling to fit when it is too wide?  Default is false: a responsive layout where only two columns are shown and a dropdown menu controls which column to display.
  sort                      //Does the table allow sorting by column where column headers become sort buttons? Default is false.
  striped                   //Does the table have alternating stipes of shading for its body rows? Default is false.
  summary="...">            //An accessible description of the table, what each row reporesents, and what each column represents.
</editable-table>
*/
Polymer({
  _template: `
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

  properties: {
    /**
     * Is the table in edit-mode? Default is false (display mode).
     */
    editMode: {
      type: Boolean,
      value: false
    }
  },

  /**
   * Toggles between edit-mode and display mode.
   */
  toggleEditMode: function(edit) {
    let temp;
    edit = edit !== undefined ? edit : !this.editMode;
    if (edit) {
      this.querySelector("editable-table-display").toggleFilter();
      this.querySelector("editable-table-display").sortData(false);
      temp = this.querySelector("editable-table-display").getData();
      console.log(temp);
    } else {
      temp = this.querySelector("editable-table-editor").getData();
    }
    for (prop in temp) {
      if (prop !== "data") {
        this[prop] = temp[prop];
      } else {
        this.set("data", temp[prop]);
      }
    }
    this.editMode = edit;
  }
});

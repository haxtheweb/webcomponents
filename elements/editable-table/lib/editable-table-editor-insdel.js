import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-button/paper-button.js";
/**
`editable-table-editor-insdel`

A button in the editable-table-editor-rowcol menu 
(editable-table-editor-rowcol.html) that inserts or 
deletes a row or column .

@demo demo/index.html

@microcopy - the mental model for this element
<editable-table-editor-insdel 
  action="insert"               //The action this button performs, as in "insert" or "delete"  
  before                        //If the action is insert, should row or column be inserted before the index? Default is false (after).
  index="1"                     //The index of the row or column where this button is located
  type="Row">                   //The type of menu, as in "Row" or "Column"
  Insert Row Before             //The text of the button
</editable-table-editor-insdel>

*/
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

  listeners: {
    tap: "_onTap"
  },

  properties: {
    /**
     * The action of the menu item
     */
    action: {
      type: String,
      value: null
    },
    /**
     * The index of the row or column
     */
    index: {
      type: Number,
      value: null,
      reflectToAttribute: true
    },
    /**
     * If insert, does it insert before? Default is insert after.
     */
    before: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },
    /**
     * Is it row or column?
     */
    type: {
      type: String,
      value: null
    }
  },

  /**
   * Handle item tap
   */
  _onTap: function(e) {
    let root = this,
      action = root.action,
      type = root.type,
      before = root.before,
      index = root.index,
      event = action + "-" + type.toLowerCase();
    if (action === "insert" && before && type === "Row") {
      index--;
    } else if (action === "insert" && !before && type !== "Row") {
      index++;
    }
    root.fire(event, index);
  }
});

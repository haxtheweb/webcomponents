import "@polymer/polymer/polymer.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-toolbar/paper-toolbar.js";
/**
`hax-editable`

@demo demo/index.html
*/
Polymer({
  _template: `
    <style>
      :host {
        display: block;
      }
      div[contenteditable] {
        position: relative;
        z-index: 11;
      }

    </style>
    <template is="dom-if" if="{{matchType('textfield', type)}}">
      <div contenteditable\$="{{edit}}">
        <content></content>
      </div>
    </template>
    <template is="dom-if" if="{{matchType('html', type)}}">
      <div contenteditable\$="{{edit}}">
        <content></content>
      </div>
    </template>
    <template is="dom-if" if="{{matchType('date', type)}}">
      <div contenteditable\$="{{edit}}">
        <content></content>
      </div>
    </template>
    <template is="dom-if" if="{{matchType('time', type)}}">
      <div contenteditable\$="{{edit}}">
        <content></content>
      </div>
    </template>
`,

  is: "hax-editable",

  properties: {
    /**
     * whether this item is currently in the "edit" state
     */
    edit: {
      type: Boolean
    },
    /**
     * type of field to display the edit mode for
     */
    type: {
      type: String,
      value: "textfield"
    }
  },

  /**
   * Simple boolean output for string comparison of editable element type
   * @param  {string} test     the test case
   * @param  {string} type     the type to match
   * @return {boolean}         if the test case is the same as the type
   */
  matchType: function(test, type) {
    // see if they match
    if (test == type) {
      return true;
    }
    return false;
  }
});

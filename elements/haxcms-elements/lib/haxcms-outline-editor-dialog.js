import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-button/paper-button.js";
/**
`haxcms-outline-editor-dialog`
Dialog for presenting an editable outline

@demo demo/index.html

@microcopy - the mental model for this element

*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
      paper-dialog {
        width: 60%;
        min-height: 60%;
        top: 5%;
        border-radius: 16px;
      }
    </style>
    <paper-dialog id="outlineeditor" opened="{{opened}}" with-backdrop="">
      <paper-dialog-scrollable>
        <lrnsys-outline items="{{items}}" id="outline"></lrnsys-outline>
      </paper-dialog-scrollable>
      <div class="buttons">
        <paper-button id="save" dialog-confirm="" on-tap="_saveTap">Save</paper-button>
        <paper-button id="cancel" dialog-dismiss="">Cancel</paper-button>
      </div>
    </paper-dialog>
`,

  is: "haxcms-outline-editor-dialog",

  properties: {
    /**
     * opened state of the dialog inside here
     */
    opened: {
      type: Boolean,
      notify: true
    },
    /**
     * Outline of items in json outline schema format
     */
    items: {
      type: Array,
      notify: true,
      value: []
    }
  },

  /**
   * Ready life cycle
   */
  ready: function() {
    document.body.addEventListener(
      "json-outline-schema-changed",
      this._manifestChanged.bind(this)
    );
  },
  /**
   * attached life cycle
   */
  attached: function() {
    // state issue but it can miss in timing othewise on first event
    if (typeof window.cmsSiteEditor.jsonOutlineSchema !== typeof undefined) {
      this.set("items", window.cmsSiteEditor.jsonOutlineSchema.items);
    }
  },
  /**
   * detached life cycle
   */
  detached: function() {
    document.body.removeEventListener(
      "json-outline-schema-changed",
      this._manifestChanged.bind(this)
    );
  },
  /**
   * manifest changed, let's get the items only
   */
  _manifestChanged: function(e) {
    if (typeof e.detail.items !== typeof undefined) {
      this.set("items", []);
      this.set("items", e.detail.items);
    }
  },

  /**
   * Save hit, send the message to push up the outline changes.
   */
  _saveTap: function(e) {
    this.fire("haxcms-save-outline", this.items);
  }
});

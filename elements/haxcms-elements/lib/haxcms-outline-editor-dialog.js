import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import * as async from "@polymer/polymer/lib/utils/async.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js";
import "@lrnwebcomponents/outline-designer/outline-designer.js";
/**
 * `haxcms-outline-editor-dialog`
 * `Dialog for presenting an editable outline`
 *
 * @demo demo/index.html
 *
 * @microcopy - the mental model for this element
 */
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>
    <paper-dialog-scrollable>
      <outline-designer manifest="{{manifest}}" edit-mode></outline-designer>
    </paper-dialog-scrollable>
    <div class="buttons">
      <paper-button id="save" dialog-confirm="" on-tap="_saveTap"
        >Save</paper-button
      >
      <paper-button id="cancel" dialog-dismiss="">Cancel</paper-button>
    </div>
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
    manifest: {
      type: Object,
      notify: true
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
    async.microTask.run(() => {
      // state issue but it can miss in timing othewise on first event
      if (typeof window.cmsSiteEditor.jsonOutlineSchema !== typeof undefined) {
        this.set("manifest", window.cmsSiteEditor.jsonOutlineSchema);
        this.notifyPath("manifest.*");
      }
    });
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
      this.set("manifest", []);
      this.set("manifest", e.detail);
      this.notifyPath("manifest.*");
    }
  },

  /**
   * Save hit, send the message to push up the outline changes.
   */
  _saveTap: function(e) {
    this.fire("haxcms-save-outline", this.manifest.items);
  }
});

import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import * as async from "@polymer/polymer/lib/utils/async.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js";
import "@lrnwebcomponents/json-editor/json-editor.js";
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
        height: 50vh;
      }
      .buttons {
        position: absolute;
        bottom: 0;
        z-index: 1000000;
        background-color: var(--simple-modal-titlebar-background, #ddd);
        left: 0;
        right: 0;
      }
    </style>
    <paper-dialog-scrollable>
      <json-editor
        id="editor"
        label="Outline data"
        value="[[manifestItems]]"
      ></json-editor>
    </paper-dialog-scrollable>
    <div class="buttons">
      <paper-button dialog-confirm on-tap="_saveTap">Save</paper-button>
      <paper-button dialog-dismiss>Cancel</paper-button>
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
    },
    /**
     * Stringify'ed representation of items
     */
    manifestItems: {
      type: String
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
    this.$.editor.addEventListener("current-data-changed", e => {
      if (e.detail.value) {
        let outline = window.JSONOutlineSchema.requestAvailability();
        this.set("manifest.items", e.detail.value);
        this.notifyPath("manifest.items.*");
        outline.items = e.detail.value;
        this.manifestItems = JSON.stringify(e.detail.value, null, 2);
      }
    });
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
        this.manifestItems = JSON.stringify(this.manifest.items, null, 2);
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
      this.manifestItems = JSON.stringify(this.manifest.items, null, 2);
    }
  },

  /**
   * Save hit, send the message to push up the outline changes.
   */
  _saveTap: function(e) {
    this.fire("haxcms-save-outline", this.manifest.items);
  }
});

import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js";
import "@lrnwebcomponents/json-editor/json-editor.js";
import "@lrnwebcomponents/editable-outline/editable-outline.js";
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
        height: 60vh;
        width: 60vw;
      }
      .buttons {
        position: absolute;
        bottom: 0;
        z-index: 1000000;
        background-color: var(--simple-modal-titlebar-background, #ddd);
        left: 0;
        right: 0;
      }
      paper-dialog-scrollable {
        padding-bottom: 32px;
      }
    </style>
    <paper-dialog-scrollable>
      <paper-button id="toggle" on-tap="toggleView">[[viewLabel]]</paper-button>
      <editable-outline
        id="outline"
        edit-mode
        hidden$="[[viewMode]]"
        items="[[manifest.items]]"
      ></editable-outline>
      <json-editor
        id="editor"
        label="Outline data"
        value="[[manifestItems]]"
        hidden$="[[!viewMode]]"
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
      type: Object
    },
    /**
     * Stringify'ed representation of items
     */
    manifestItems: {
      type: String
    },
    /**
     * Display label, switch when hitting the toggle button
     */
    viewLabel: {
      type: String,
      computed: "_getViewLabel(viewMode)"
    },
    /**
     * Which edit mode to display
     */
    viewMode: {
      type: Boolean,
      value: false,
      observer: "_viewModeChanged"
    }
  },

  /**
   * Ready life cycle
   */
  ready: function() {
    document.body.addEventListener(
      "json-outline-schema-changed",
      this.__jsonOutlineSchemaChanged.bind(this)
    );
    afterNextRender(this, function() {
      this.$.editor.addEventListener("current-data-changed", e => {
        if (e.detail.value) {
          let outline = window.JSONOutlineSchema.requestAvailability();
          this.set("manifest.items", e.detail.value);
          this.notifyPath("manifest.items.*");
          outline.items = e.detail.value;
          this.manifestItems = JSON.stringify(e.detail.value, null, 2);
          this.$.outline.importJsonOutlineSchemaItems();
        }
      });
    });
  },
  /**
   * attached life cycle
   */
  attached: function() {
    this.__disposer = [];
    autorun(reaction => {
      this.manifest = toJS(store.manifest);
      this.manifestItems = JSON.stringify(this.manifest.items, null, 2);
      this.__disposer.push(reaction);
    });
  },
  /**
   * detached life cycle
   */
  detached: function() {
    document.body.removeEventListener(
      "json-outline-schema-changed",
      this.__jsonOutlineSchemaChanged.bind(this)
    );
    this.$.editor.removeEventListener("current-data-changed", e => {
      if (e.detail.value) {
        let outline = window.JSONOutlineSchema.requestAvailability();
        this.set("manifest.items", e.detail.value);
        this.notifyPath("manifest.items.*");
        outline.items = e.detail.value;
        this.manifestItems = JSON.stringify(e.detail.value, null, 2);
        this.$.outline.importJsonOutlineSchemaItems();
      }
    });
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
  },
  /**
   * Switch view
   */
  toggleView: function(e) {
    this.viewMode = !this.viewMode;
  },
  /**
   * Get the active label
   */
  _getViewLabel: function(mode) {
    if (mode) {
      return "Outline mode";
    } else {
      return "Developer mode";
    }
  },
  /**
   * Ensure that data is correct between the outline and advanced view
   */
  _viewModeChanged: function(newValue, oldValue) {
    // odd I know, but this is the default outline view
    if (!newValue) {
      this.$.outline.importJsonOutlineSchemaItems();
    } else {
      const items = this.$.outline.exportJsonOutlineSchemaItems();
      this.set("manifest.items", []);
      this.set("manifest.items", items);
      this.notifyPath("manifest.items");
      this.manifestItems = JSON.stringify(items, null, 2);
    }
  },
  /**
   * Global JSON Outline Schema changed, let's ensure the items are synced up here
   */
  __jsonOutlineSchemaChanged: function(e) {
    if (typeof e.detail.items !== typeof undefined) {
      this.set("manifest", []);
      this.set("manifest", e.detail);
      this.notifyPath("manifest.*");
      this.manifestItems = JSON.stringify(this.manifest.items, null, 2);
      this.$.outline.importJsonOutlineSchemaItems();
    }
  },

  /**
   * Save hit, send the message to push up the outline changes.
   */
  _saveTap: function(e) {
    const items = this.$.outline.exportJsonOutlineSchemaItems();
    this.set("manifest.items", []);
    this.set("manifest.items", items);
    this.notifyPath("manifest.items");
    this.manifestItems = JSON.stringify(items, null, 2);
    this.fire("haxcms-save-outline", items);
  }
});

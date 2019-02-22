import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-item/paper-item.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/editor-icons.js";
import "@polymer/iron-icons/notification-icons.js";
import "@polymer/iron-icons/av-icons.js";
import "@polymer/iron-icons/device-icons.js";
import "@polymer/iron-icons/image-icons.js";
import "@lrnwebcomponents/simple-icon-picker/simple-icon-picker.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
 * `haxcms-manifest-editor-dialog`
 * `Dialog for presenting an editable manifest of core settings`
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
      #publish {
        min-width: 100px;
        background-color: var(--haxcms-color, #ff4081);
      }
      .buttons {
        margin: 8px 0 8px 0;
      }
      paper-dialog-scrollable {
        padding: 8px 8px 32px 8px;
      }
      paper-button {
        color: var(--simple-colors-default-theme-grey-11);
        margin: 0 5px;
      }
      iron-icon {
        margin-right: 8px;
      }
      simple-icon-picker {
        display: inline-flex;
      }
      label {
        font-size: 14px;
        padding-right: 5px;
        color: var(
          --paper-input-container-label_-_color,
          var(--paper-input-container-color, var(--secondary-text-color, #000))
        );
      }
    </style>
    <paper-dialog-scrollable>
      <paper-input
        id="sitetitle"
        label="Title"
        required=""
        autofocus=""
        value="[[manifest.title]]"
      ></paper-input>
      <paper-input
        id="domain"
        label="Domain"
        value="[[manifest.metadata.domain]]"
      ></paper-input>
      <paper-input
        id="sitedescription"
        label="Description"
        value="[[manifest.description]]"
      ></paper-input>
      <paper-input
        id="siteimage"
        label="Image"
        value="[[manifest.metadata.image]]"
      ></paper-input>
      <label for="sitecolor">Select a color:</label>
      <simple-colors-picker
        id="sitecolor"
        hex-code="[[manifest.metadata.hexCode]]"
      ></simple-colors-picker>
      <simple-picker id="sitetheme" label="Theme"> </simple-picker>
      <label for="siteicon">Select an icon:</label>
      <simple-icon-picker
        id="siteicon"
        hide-option-labels
        value="[[manifest.metadata.icon]]"
      ></simple-icon-picker>
    </paper-dialog-scrollable>
    <div class="buttons">
      <paper-button id="save" dialog-confirm raised on-tap="_saveTap">
        <iron-icon icon="icons:save"></iron-icon>Save
      </paper-button>
      <paper-button id="cancel" dialog-dismiss raised>
        <iron-icon icon="icons:cancel"></iron-icon>Cancel
      </paper-button>
      <paper-button id="publish" dialog-confirm on-tap="_publishTap" raised>
        <iron-icon icon="icons:cloud-upload"></iron-icon>Publish
      </paper-button>
    </div>
  `,
  is: "haxcms-manifest-editor-dialog",
  properties: {
    /**
     * opened state of the dialog inside here
     */
    opened: {
      type: Boolean,
      notify: true
    },
    /**
     * JSON Outline Schema manifest data
     */
    manifest: {
      type: Object,
      notify: true
    }
  },
  created: function() {
    window.addEventListener(
      "json-outline-schema-changed",
      this._manifestSet.bind(this)
    );
  },
  /**
   * Ready life cycle
   */
  ready: function() {
    this.$.sitetheme.options = [
      [
        {
          alt: "Simple blog site",
          value: "simple-blog"
        }
      ],
      [
        {
          alt: "Content outline",
          value: "outline-player"
        }
      ],
      [
        {
          alt: "Developer Theme",
          value: "haxcms-dev-theme"
        }
      ]
    ];
    this.$.sitetheme.value =
      window.cmsSiteEditor.jsonOutlineSchema.metadata.theme;
    // state issue but it can miss in timing othewise on first event
    this.set("manifest", window.cmsSiteEditor.jsonOutlineSchema);
    this.notifyPath("manifest.*");
  },
  /**
   * attached life cycle
   */
  attached: function() {
    this.$.sitecolor.addEventListener("change", this._colorChanged.bind(this));
    this.$.sitetheme.addEventListener("change", this._themeChanged.bind(this));
    setTimeout(() => {
      var evt = document.createEvent("UIEvents");
      evt.initUIEvent("resize", true, false, window, 0);
      window.dispatchEvent(evt);
    }, 100);
  },
  /**
   * detached life cycle
   */
  detached: function() {
    window.removeEventListener(
      "json-outline-schema-changed",
      this._manifestSet.bind(this)
    );
    this.$.sitetheme.removeEventListener(
      "change",
      this._themeChanged.bind(this)
    );
    this.$.sitecolor.removeEventListener(
      "change",
      this._colorChanged.bind(this)
    );
  },

  /**
   * manifest changed globally
   */
  _manifestSet: function(e) {
    if (typeof e.detail.id !== typeof undefined) {
      this.set("manifest", e.detail);
      this.notifyPath("manifest.*");
    }
  },

  /**
   * Use events for real value in theme.
   */
  _themeChanged: function(e) {
    this.set("manifest.metadata.theme", e.detail.value);
    this.notifyPath("manifest.metadata.theme");
  },

  /**
   * Use events for real value in color area.
   */
  _colorChanged: function(e) {
    this.set("manifest.metadata.cssVariable", e.detail.value);
    this.notifyPath("manifest.metadata.cssVariable");
    this.set(
      "manifest.metadata.hexCode",
      SimpleColors.colors[
        e.detail.value
          .replace("--simple-colors-default-theme-", "")
          .replace("-7", "")
      ][6]
    );
    this.notifyPath("manifest.metadata.hexCode");
  },

  /**
   * Publish tap
   */
  _publishTap: function(e) {
    this.fire("haxcms-publish-site", this.manifest);
  },

  /**
   * Save hit, send the message to push up the outline changes.
   */
  _saveTap: function(e) {
    this.set("manifest.title", this.$.sitetitle.value);
    this.notifyPath("manifest.title");
    this.set("manifest.description", this.$.sitedescription.value);
    this.notifyPath("manifest.description");
    this.set("manifest.metadata.image", this.$.siteimage.value);
    this.notifyPath("manifest.metadata.image");
    this.set("manifest.metadata.domain", this.$.domain.value);
    this.notifyPath("manifest.metadata.domain");
    this.set("manifest.metadata.icon", this.$.siteicon.icon);
    this.notifyPath("manifest.metadata.icon");
    this.fire("haxcms-save-site-data", this.manifest);
  }
});

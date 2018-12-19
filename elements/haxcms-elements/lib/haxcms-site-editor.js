/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-fab/paper-fab.js";
import "@polymer/paper-toast/paper-toast.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/iron-icons/editor-icons.js";
import "@lrnwebcomponents/jwt-login/jwt-login.js";
import "@lrnwebcomponents/hax-body/lib/hax-store.js";
import "@lrnwebcomponents/hax-body/hax-body.js";
import "@lrnwebcomponents/hax-body/lib/hax-autoloader.js";
import "@lrnwebcomponents/hax-body/lib/hax-manager.js";
import "@lrnwebcomponents/hax-body/lib/hax-app-picker.js";
import "@lrnwebcomponents/hax-body/lib/hax-app.js";
import "@lrnwebcomponents/hax-body/lib/hax-panel.js";
import "@lrnwebcomponents/hax-body/lib/hax-export-dialog.js";
import "@lrnwebcomponents/hax-body/lib/hax-toolbar.js";
import "./haxcms-outline-editor-dialog.js";
import "./haxcms-manifest-editor-dialog.js";
import "./haxcms-site-editor-ui.js";
/**
 * `haxcms-site-editor`
 * `haxcms editor element that provides all editing capabilities`
 *
 * @demo demo/index.html
 */
Polymer({
  is: "haxcms-site-editor",
  _template: html`
    <style is="custom-style">
      :host {
        display: block;
      }
      #editbutton {
        position: fixed;
        bottom: 0;
        right: 0;
        margin: 16px;
        padding: 2px;
        width: 40px;
        height: 40px;
        visibility: visible;
        opacity: 1;
        transition: all 0.4s ease;
        z-index: 1000;
      }
      #outlinebutton {
        position: fixed;
        bottom: 0;
        right: 46px;
        margin: 16px;
        padding: 2px;
        width: 40px;
        height: 40px;
        visibility: visible;
        opacity: 1;
        transition: all 0.4s ease;
        z-index: 1000;
      }
      :host([edit-mode]) #editbutton {
        width: 100%;
        z-index: 100;
        right: 0;
        bottom: 0;
        border-radius: 0;
        height: 80px;
        margin: 0;
        padding: 8px;
        background-color: var(--paper-blue-500) !important;
      }
      hax-body {
        padding: 48px;
        max-width: 1040px;
        margin: auto;
        display: none;
      }
      :host([edit-mode]) hax-body {
        display: block;
        padding: 0 !important;
      }
    </style>
    <iron-ajax
      headers="{&quot;Authorization&quot;: &quot;Bearer [[jwt]]&quot;}"
      id="pageupdateajax"
      url="[[savePagePath]]"
      method="POST"
      body="[[updatePageData]]"
      content-type="application/json"
      handle-as="json"
      on-response="_handlePageResponse"
    ></iron-ajax>
    <iron-ajax
      headers="{&quot;Authorization&quot;: &quot;Bearer [[jwt]]&quot;}"
      id="outlineupdateajax"
      url="[[saveOutlinePath]]"
      method="POST"
      body="[[updateOutlineData]]"
      content-type="application/json"
      handle-as="json"
      on-response="_handleOutlineResponse"
    ></iron-ajax>
    <iron-ajax
      headers="{&quot;Authorization&quot;: &quot;Bearer [[jwt]]&quot;}"
      id="manifestupdateajax"
      url="[[saveManifestPath]]"
      method="POST"
      body="[[updateManifestData]]"
      content-type="application/json"
      handle-as="json"
      on-response="_handleManifestResponse"
    ></iron-ajax>
    <iron-ajax
      headers="{&quot;Authorization&quot;: &quot;Bearer [[jwt]]&quot;}"
      id="publishajax"
      loading="{{publishing}}"
      url="[[publishPath]]"
      method="POST"
      body="[[publishSiteData]]"
      content-type="application/json"
      handle-as="json"
      on-response="_handlePublishResponse"
    ></iron-ajax>
    <hax-store app-store="[[appStore]]"></hax-store>
    <hax-app-picker></hax-app-picker>
    <hax-body id="body"></hax-body>
    <hax-autoloader hidden></hax-autoloader>
    <hax-panel align="left" hide-panel-ops></hax-panel>
    <hax-manager append-jwt="jwt" id="haxmanager"></hax-manager>
    <hax-export-dialog></hax-export-dialog>
    <haxcms-site-editor-ui
      id="ui"
      active-item="[[activeItem]]"
      manifest="[[manifest]]"
      edit-mode="{{editMode}}"
      outline-edit-mode="{{outlineEditMode}}"
      manifest-edit-mode="{{manifestEditMode}}"
    ></haxcms-site-editor-ui>
    <haxcms-outline-editor-dialog
      id="outlineeditor"
    ></haxcms-outline-editor-dialog>
    <haxcms-manifest-editor-dialog
      id="manifesteditor"
    ></haxcms-manifest-editor-dialog>
    <paper-toast id="toast"> </paper-toast>
    <paper-toast id="publishtoast" duration="0">
      <a href$="[[__publishLink]]" target="_blank"
        ><paper-button
          raised
          style="color:yellow;text-transform: none;font-weight: bold;"
          >[[__publishLabel]]</paper-button
        ></a
      >
    </paper-toast>
  `,
  listeners: {
    "haxcms-save-outline": "saveOutline", // from outlineeditor
    "haxcms-save-site-data": "saveManifest", // from manifesteditor
    "haxcms-publish-site": "publishSite" // from manifesteditor
  },
  properties: {
    /**
     * JSON Web token, it'll come from a global call if it's available
     */
    jwt: {
      type: String
    },
    /**
     * end point for saving page
     */
    savePagePath: {
      type: String
    },
    /**
     * end point for saving manifest
     */
    saveManifestPath: {
      type: String
    },
    /**
     * end point for publishing to surge
     */
    publishPath: {
      type: String
    },
    /**
     * Publishing end point, this has CDN implications so show message
     */
    publishing: {
      type: Boolean,
      observer: "_publishingChanged"
    },
    /**
     * end point for saving outline
     */
    saveOutlinePath: {
      type: String
    },
    /**
     * appStore object from backend
     */
    appStore: {
      type: Object
    },
    /**
     * if the page is in an edit state or not
     */
    editMode: {
      type: Boolean,
      reflectToAttribute: true,
      observer: "_editModeChanged",
      value: false
    },
    /**
     * Outline editing state
     */
    outlineEditMode: {
      type: Boolean,
      reflectToAttribute: true,
      observer: "_outlineEditModeChanged",
      value: false
    },
    /**
     * manifest editing state
     */
    manifestEditMode: {
      type: Boolean,
      reflectToAttribute: true,
      observer: "_manifestEditModeChanged",
      value: false
    },
    /**
     * data as part of the POST to the backend
     */
    updatePageData: {
      type: Object,
      value: {}
    },
    /**
     * published site data
     */
    publishSiteData: {
      type: Object,
      value: {}
    },
    /**
     * data as part of the POST to the backend
     */
    updateOutlineData: {
      type: Object,
      value: {}
    },
    /**
     * data as part of the POST to the backend
     */
    updateManifestData: {
      type: Object,
      value: {}
    },
    /**
     * Active item of the page being worked on, JSON outline schema item format
     */
    activeItem: {
      type: Object,
      notify: true,
      observer: "_activeItemChanged"
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
   * created life cycle
   */
  created: function() {
    document.body.addEventListener(
      "json-outline-schema-active-item-changed",
      this._newActiveItem.bind(this)
    );
    document.body.addEventListener(
      "json-outline-schema-changed",
      this._manifestChanged.bind(this)
    );
    document.body.addEventListener(
      "json-outline-schema-active-body-changed",
      this._bodyChanged.bind(this)
    );
  },
  /**
   * ready life cycle
   */
  ready: function() {
    document.body.appendChild(this.$.toast);
    document.body.appendChild(this.$.publishtoast);
    document.body.appendChild(this.$.ui);
    document.body.appendChild(this.$.outlineeditor);
    document.body.appendChild(this.$.manifesteditor);
  },
  /**
   * attached life cycle
   */
  attached: function() {
    this.$.toast.show("You are logged in, edit tools shown.");
    // get around initial setup state management
    if (typeof this.__body !== typeof undefined) {
      this.$.body.importContent(this.__body);
    }
    // allow for initial setting since this editor gets injected basically
    if (typeof window.cmsSiteEditor.jsonOutlineSchema !== typeof undefined) {
      this.set("manifest", window.cmsSiteEditor.jsonOutlineSchema);
      this.notifyPath("manifest.*");
    }
    if (typeof window.cmsSiteEditor.initialActiveItem !== typeof undefined) {
      this.set("activeItem", window.cmsSiteEditor.initialActiveItem);
      this.notifyPath("activeItem.*");
    }
    this.updateStyles();
  },
  /**
   * Detatched life cycle
   */
  detached: function() {
    document.body.removeEventListener(
      "json-outline-schema-active-item-changed",
      this._newActiveItem.bind(this)
    );
    document.body.removeEventListener(
      "json-outline-schema-changed",
      this._manifestChanged.bind(this)
    );
    document.body.removeEventListener(
      "json-outline-schema-active-body-changed",
      this._bodyChanged.bind(this)
    );
  },
  /**
   * notice publishing callback changing state
   */
  _publishingChanged: function(newValue, oldValue) {
    if (newValue) {
      this.$.toast.duration = 0;
      this.$.toast.show("Publishing...");
    } else if (!newValue && oldValue) {
      this.$.toast.duration = 3000;
    }
  },
  /**
   * react to manifest being changed
   */
  _manifestChanged: function(e) {
    this.set("manifest", {});
    this.set("manifest", e.detail);
    this.notifyPath("manifest.*");
  },
  /**
   * update the internal active item
   */
  _newActiveItem: function(e) {
    this.set("activeItem", e.detail);
    this.notifyPath("activeItem.*");
  },
  /**
   * active item changed
   */
  _activeItemChanged: function(newValue, oldValue) {
    if (newValue) {
      let parts = window.location.pathname.split("/");
      parts.pop();
      let site = parts.pop();
      // set upload manager to point to this location in a more dynamic fashion
      this.$.haxmanager.appendUploadEndPoint =
        "siteName=" + site + "&page=" + newValue.id;
    }
  },
  /**
   * handle update responses for pages and outlines
   */
  _handlePageResponse: function(e) {
    this.$.toast.show("Page saved!");
    this.fire("haxcms-trigger-update-page", true);
  },
  _handleOutlineResponse: function(e) {
    // trigger a refresh of the data in page
    this.$.toast.show("Outline saved!");
    this.fire("haxcms-trigger-update", true);
  },
  _handleManifestResponse: function(e) {
    // trigger a refresh of the data in page
    this.$.toast.show("Site details saved!");
    this.fire("haxcms-trigger-update", true);
  },
  _handlePublishResponse: function(e) {
    console.log(e.detail.response);
    let data = e.detail.response;
    // show the published response
    this.__publishLink = data.url;
    this.__publishLabel = data.label;
    this.$.publishtoast.show(data.response);
  },
  /**
   * Edit state has changed.
   */
  _editModeChanged: function(newValue, oldValue) {
    // was on, now off
    if (!newValue && oldValue) {
      let parts = window.location.pathname.split("/");
      parts.pop();
      let site = parts.pop();
      this.set("updatePageData.siteName", site);
      this.notifyPath("updatePageData.siteName");
      this.set(
        "updatePageData.body",
        window.HaxStore.instance.activeHaxBody.haxToContent()
      );
      this.notifyPath("updatePageData.body");
      this.set("updatePageData.page", this.activeItem.id);
      this.notifyPath("updatePageData.page");
      this.set("updatePageData.jwt", this.jwt);
      this.notifyPath("updatePageData.jwt");
      // send the request
      if (this.savePagePath) {
        this.$.pageupdateajax.generateRequest();
      }
      this.fire("haxcms-save-page", this.activeItem);
    }
  },
  /**
   * Note changes to the outline / structure of the page's items
   */
  _outlineEditModeChanged: function(newValue, oldValue) {
    if (newValue) {
      this.$.outlineeditor.opened = true;
    } else {
      this.$.outlineeditor.opened = false;
    }
  },
  /**
   * Note changes to the outline / structure of the page's items
   */
  _manifestEditModeChanged: function(newValue, oldValue) {
    if (newValue) {
      this.$.manifesteditor.opened = true;
    } else {
      this.$.manifesteditor.opened = false;
    }
  },
  /**
   * Save the outline based on an event firing.
   */
  saveOutline: function(e) {
    let parts = window.location.pathname.split("/");
    parts.pop();
    let site = parts.pop();
    // now let's work on the outline
    this.set("updateOutlineData.siteName", site);
    this.notifyPath("updateOutlineData.siteName");
    this.set("updateOutlineData.items", e.detail);
    this.notifyPath("updateOutlineData.items");
    this.set("updateOutlineData.jwt", this.jwt);
    this.notifyPath("updateOutlineData.jwt");
    if (this.saveOutlinePath) {
      this.$.outlineupdateajax.generateRequest();
    }
  },
  /**
   * Save the outline based on an event firing.
   */
  saveManifest: function(e) {
    let parts = window.location.pathname.split("/");
    parts.pop();
    let site = parts.pop();
    // now let's work on the outline
    this.set("updateManifestData.siteName", site);
    this.notifyPath("updateManifestData.siteName");
    this.set("updateManifestData.manifest", e.detail);
    this.notifyPath("updateManifestData.manifest");
    this.set("updateManifestData.jwt", this.jwt);
    this.notifyPath("updateManifestData.jwt");
    if (this.saveManifestPath) {
      this.$.manifestupdateajax.generateRequest();
    }
  },
  /**
   * Save the outline based on an event firing.
   */
  publishSite: function(e) {
    let parts = window.location.pathname.split("/");
    parts.pop();
    let site = parts.pop();
    this.set("publishSiteData.siteName", site);
    this.notifyPath("publishSiteData.siteName");
    this.set("publishSiteData.jwt", this.jwt);
    this.notifyPath("publishSiteData.jwt");
    if (this.publishPath) {
      this.$.publishajax.generateRequest();
    }
  },
  /**
   * Notice body of content has changed and import into HAX
   */
  _bodyChanged: function(e) {
    window.HaxStore.instance.activeHaxBody.importContent(e.detail);
  }
});

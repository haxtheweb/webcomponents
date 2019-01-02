/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import * as async from "@polymer/polymer/lib/utils/async.js";
import "@polymer/paper-fab/paper-fab.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/iron-icons/editor-icons.js";
import "@lrnwebcomponents/jwt-login/jwt-login.js";
import "@lrnwebcomponents/h-a-x/h-a-x.js";
import "@lrnwebcomponents/simple-toast/simple-toast.js";
import "@lrnwebcomponents/simple-modal/simple-modal.js";
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
      h-a-x {
        padding: 48px;
        max-width: 1040px;
        margin: auto;
        display: none;
      }
      :host([edit-mode]) h-a-x {
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
    <h-a-x app-store$="[[appStore]]"></h-a-x>
    <haxcms-site-editor-ui
      id="ui"
      active-item="[[activeItem]]"
      manifest="[[manifest]]"
      edit-mode="{{editMode}}"
    ></haxcms-site-editor-ui>
  `,
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
   * Break the shadow root for this element (by design)
   */
  _attachDom(dom) {
    this.appendChild(dom);
  },
  /**
   * ready life cycle
   */
  ready: function() {
    window.SimpleToast.requestAvailability();
    window.SimpleModal.requestAvailability();
    window.addEventListener("hax-store-ready", this._storeReadyToGo.bind(this));
    window.addEventListener(
      "json-outline-schema-active-item-changed",
      this._newActiveItem.bind(this)
    );
    window.addEventListener(
      "json-outline-schema-changed",
      this._manifestChanged.bind(this)
    );
    window.addEventListener(
      "json-outline-schema-active-body-changed",
      this._bodyChanged.bind(this)
    );
    window.addEventListener("haxcms-save-outline", this.saveOutline.bind(this));
    window.addEventListener(
      "haxcms-save-site-data",
      this.saveManifest.bind(this)
    );
    window.addEventListener("haxcms-publish-site", this.publishSite.bind(this));
  },
  /**
   * attached life cycle
   */
  attached: function() {
    const evt = new CustomEvent("simple-toast-show", {
      bubbles: true,
      cancelable: true,
      detail: {
        text: "You are logged in, edit tools shown."
      }
    });
    this.dispatchEvent(evt);
    // get around initial setup state management
    if (typeof this.__body !== typeof undefined) {
      window.HaxStore.instance.activeHaxBody.importContent(this.__body);
    }
    async.microTask.run(() => {
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
      if (window.HaxStore.ready) {
        let detail = {
          detail: true
        };
        this._storeReadyToGo(detail);
      }
    });
  },
  /**
   * Detatched life cycle
   */
  detached: function() {
    window.removeEventListener(
      "hax-store-ready",
      this._storeReadyToGo.bind(this)
    );
    window.removeEventListener(
      "haxcms-save-outline",
      this.saveOutline.bind(this)
    );
    window.removeEventListener(
      "haxcms-save-site-data",
      this.saveManifest.bind(this)
    );
    window.removeEventListener(
      "haxcms-publish-site",
      this.publishSite.bind(this)
    );
    window.removeEventListener(
      "json-outline-schema-active-item-changed",
      this._newActiveItem.bind(this)
    );
    window.removeEventListener(
      "json-outline-schema-changed",
      this._manifestChanged.bind(this)
    );
    window.removeEventListener(
      "json-outline-schema-active-body-changed",
      this._bodyChanged.bind(this)
    );
  },
  /**
   * Establish certain global settings in HAX once it claims to be ready to go
   */
  _storeReadyToGo: function(event) {
    if (event.detail) {
      window.HaxStore.instance.haxManager.appendJwt = "jwt";
      window.HaxStore.instance.haxPanel.align = "left";
      window.HaxStore.instance.haxPanel.hidePanelOps = true;
    }
  },
  /**
   * notice publishing callback changing state
   */
  _publishingChanged: function(newValue, oldValue) {
    if (newValue) {
      const evt = new CustomEvent("simple-toast-show", {
        bubbles: true,
        cancelable: true,
        detail: {
          text: "Publishing...",
          duration: 0
        }
      });
      this.dispatchEvent(evt);
    } else if (!newValue && oldValue) {
      const evt = new CustomEvent("simple-toast-show", {
        bubbles: true,
        cancelable: true,
        detail: {
          text: "Publishing...",
          duration: 3000
        }
      });
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
      window.HaxStore.instance.haxManager.appendUploadEndPoint =
        "siteName=" + site + "&page=" + newValue.id;
    }
  },
  /**
   * handle update responses for pages and outlines
   */
  _handlePageResponse: function(e) {
    const evt = new CustomEvent("simple-toast-show", {
      bubbles: true,
      cancelable: true,
      detail: {
        text: "Page saved!",
        duration: 3000
      }
    });
    this.dispatchEvent(evt);
    this.fire("haxcms-trigger-update-page", true);
  },
  _handleOutlineResponse: function(e) {
    // trigger a refresh of the data in page
    const evt = new CustomEvent("simple-toast-show", {
      bubbles: true,
      cancelable: true,
      detail: {
        text: "Outline saved!",
        duration: 3000
      }
    });
    this.dispatchEvent(evt);
    this.fire("haxcms-trigger-update", true);
  },
  _handleManifestResponse: function(e) {
    // trigger a refresh of the data in page
    const evt = new CustomEvent("simple-toast-show", {
      bubbles: true,
      cancelable: true,
      detail: {
        text: "Site details saved!",
        duration: 3000
      }
    });
    this.dispatchEvent(evt);
    this.fire("haxcms-trigger-update", true);
  },
  _handlePublishResponse: function(e) {
    let data = e.detail.response;
    // show the published response
    let content = document.createElement("span");
    content.innerHTML = `
    <a href="${data.url}" target="_blank">
      <paper-button raised style="color:yellow;text-transform: none;font-weight: bold;">
      ${data.label}
      </paper-button>
    </a>`;
    const evt = new CustomEvent("simple-toast-show", {
      bubbles: true,
      cancelable: true,
      detail: {
        text: data.response,
        duration: 0,
        slot: content.cloneNode(true)
      }
    });
    this.dispatchEvent(evt);
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

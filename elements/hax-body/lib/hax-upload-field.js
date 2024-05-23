import { html, css } from "lit";
import { SimpleFieldsUpload } from "@haxtheweb/simple-fields/lib/simple-fields-upload.js";
import { winEventsElement, localStorageGet } from "@haxtheweb/utils/utils.js";
import { HAXStore } from "./hax-store.js";
import { SuperDaemonInstance } from "@haxtheweb/super-daemon/super-daemon.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

class HaxUploadField extends winEventsElement(I18NMixin(SimpleFieldsUpload)) {
  /**
   * HTMLElement life cycle
   */
  constructor() {
    super();
    this.showSources = true;
    this.autocomplete = "on";
    this.__winEvents = {
      "hax-app-picker-selection": "_haxAppPickerSelection", //TODO
    };
    this.t = this.t || {};
    this.t = {
      ...this.t,
      whereUpload: "Where would you like to upload this",
      cantHandle: "Sorry, you don't have a storage location that can handle",
      uploads: "uploads",
      dropMediaHereOr: "drop media here or",
      selectMedia: "Select media",
      upload: "Upload",
      takePhoto: "Take photo",
      recordAudio: "Record audio",
      cancel: "Cancel",
      uploadMedia: "Upload media",
    };
    this.registerLocalization({
      context: this,
      namespace: "hax",
    });
  }

  static get tag() {
    return "hax-upload-field";
  }

  _canUpload() {
    return !this.__allowUpload && HAXStore;
  }

  static get properties() {
    return {
      ...super.properties,
      showSources: {
        type: Boolean,
        reflect: true,
        attribute: "show-sources",
      },
    };
  }
  /**
   * Respond to uploading a file
   */
  _fileAboutToUpload(e) {
    if (this._canUpload()) {
      // cancel the event so we can jump in
      e.preventDefault();
      e.stopPropagation();
      // look for a match as to what gizmo types it supports
      let values = {
        source: e.detail.file.name,
        type: e.detail.file.type,
      };
      // we have no clue what this is.. let's try and guess..
      var type = HAXStore.guessGizmoType(values);
      // find targets that support this type
      let targets = HAXStore.getHaxAppStoreTargets(type);
      // make sure we have targets
      if (targets.length === 1) {
        this._haxAppPickerSelection({ detail: targets[0] });
      } else if (targets.length !== 0) {
        HAXStore.haxAppPicker.presentOptions(
          targets,
          type,
          `${this.t.whereUpload} ${type}?`,
          "app",
        );
      } else {
        HAXStore.toast(`${this.t.cantHandle} ${type} ${this.t.uploads}!`, 5000);
      }
    } else {
      this.__allowUpload = false;
    }
  }
  /**
   * Event for an app being selected from a picker
   * This happens when multiple upload targets support the given type
   */
  _haxAppPickerSelection(e) {
    // details for where to upload the file
    let connection = e.detail.connection;
    this.__appUsed = e.detail;
    this.shadowRoot.querySelector("#fileupload").method =
      connection.operations.add.method;
    let requestEndPoint = connection.protocol + "://" + connection.url;
    // ensure we build a url correctly
    if (requestEndPoint.substr(requestEndPoint.length - 1) != "/") {
      requestEndPoint += "/";
    }
    // support local end point modification
    if (typeof connection.operations.add.endPoint !== typeof undefined) {
      requestEndPoint += connection.operations.add.endPoint;
    }
    // implementation specific tweaks to talk to things like HAXcms and other CMSs
    // that have per load token based authentication
    if (HAXStore.connectionRewrites.appendUploadEndPoint != null) {
      requestEndPoint += "?" + HAXStore.connectionRewrites.appendUploadEndPoint;
    }
    if (HAXStore.connectionRewrites.appendJwt != null) {
      requestEndPoint +=
        "&" +
        HAXStore.connectionRewrites.appendJwt +
        "=" +
        localStorageGet(HAXStore.connectionRewrites.appendJwt);
    }
    this.shadowRoot.querySelector("#fileupload").headers = connection.headers;
    this.shadowRoot.querySelector("#fileupload").target = requestEndPoint;
    // invoke file uploading...
    this.__allowUpload = true;
    this.shadowRoot.querySelector("#fileupload").uploadFiles();
  }
  /**
   * Respond to successful file upload, now inject url into url field and
   * do a gizmo guess from there!
   */
  _fileUploadResponse(e) {
    // convert response to object
    let response = JSON.parse(e.detail.xhr.response);
    // access the app that did the upload
    let map = this.__appUsed.connection.operations.add.resultMap;
    let data = {};
    let item = {};
    // look for the items element to draw our data from at its root
    if (
      typeof this._resolveObjectPath(map.item, response) !== typeof undefined
    ) {
      data = this._resolveObjectPath(map.item, response);
    }
    item.type = map.defaultGizmoType;
    // pull in prop matches
    for (var prop in map.gizmo) {
      item[prop] = this._resolveObjectPath(map.gizmo[prop], data);
    }
    // another sanity check, if we don't have a url but have a source bind that too
    if (
      typeof item.url === typeof undefined &&
      typeof item.source !== typeof undefined
    ) {
      item.url = item.source;
    }
    // gizmo type is also supported in the mapping element itself
    // Think an asset management backend as opposed to a specific
    // type of asset like video. If the item coming across can
    // effectively check what kind of gizmo is required for it
    // to work then we need to support that asset declaring the
    // gizmo type needed
    if (typeof map.gizmo.type !== typeof undefined) {
      item.type = this._resolveObjectPath(map.gizmo.type, data);
    }
    // set the value of the url which will update our URL and notify
    this.shadowRoot.querySelector("#url").value = item.url;
    //TODO need a way to get suggestedResources from HAXStore and then add uploaded resource
    //this.suggestedResources['item.url'] = ''; or this.suggestedResources['item.url'] = { name, icon, type, preview };
  }
  // add button for merlin
  get sources() {
    return html` <simple-toolbar-button
        ?disabled="${this.disabled}"
        label="${this.t.selectMedia}.."
        ?show-text-label="${this.responsiveSize.indexOf("s") < 0}"
        icon="hax:multimedia"
        show-text-label
        @click="${this._clickMediaButton}"
        controls="fieldset"
        part="merlin"
        ?hidden="${!this.showSources}"
      >
      </simple-toolbar-button>
      ${super.sources}`;
  }
  _clickMediaButton(e) {
    var type = "sources";
    if (this.label.toLowerCase().includes("image")) {
      type = "image";
    } else if (this.label.toLowerCase().includes("video")) {
      type = "video";
    } else if (HAXStore.haxTray.activeHaxElement) {
      let tmp = HAXStore.guessGizmoType(
        HAXStore.haxTray.activeHaxElement.properties,
      );
      if (tmp != "*") {
        type = tmp;
      }
    }
    SuperDaemonInstance.runProgram(type);

    //SuperDaemonInstance.appendContext();
    // allows for diverting input back to target
    if (this.tagName.toLowerCase() == "hax-upload-field") {
      SuperDaemonInstance.programTarget = this;
    }
    SuperDaemonInstance.open();
  }
}

customElements.define(HaxUploadField.tag, HaxUploadField);
export { HaxUploadField };

import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-input/paper-input.js";
import "@vaadin/vaadin-upload/vaadin-upload.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "./hax-shared-styles.js";
class HaxUploadField extends PolymerElement {
  static get template() {
    return html`
      <style include="simple-colors hax-shared-styles">
        :host {
          display: block;
          justify-content: flex-start;
          visibility: visible;
          transition: 0.3s all ease;
          box-sizing: border-box;
          pointer-events: all;
        }
        vaadin-upload {
          --primary-color: var(--hax-color-accent1);
          --primary-font-color: #ffffff;
          --dark-primary-color: #ffffff;
          --light-primary-color: var(--hax-color-accent1);
          --error-color: darkred;
          padding: 0;
          margin: 0;
          border: none;
          --vaadin-upload-button-add-wrapper: {
            border: none;
            background-color: var(--hax-color-accent1);
            color: #ffffff;
            display: block;
          }
          --vaadin-upload-buttons-primary: {
            display: block;
            width: 100%;
            flex: unset;
            -webkit-flex: unset;
          }
          --vaadin-upload-button-add: {
            color: #000000;
            display: block;
            flex: unset;
            -webkit-flex: unset;
            text-align: center;
          }
          --vaadin-upload-drop-label: {
            color: #ffffff;
            display: block;
            padding: 0;
            margin: 0;
          }
          --vaadin-upload-drop-label-dragover: {
            color: #ffffff;
          }
          --vaadin-upload-file-list: {
            padding: 0;
            margin: 0;
            color: #ffffff;
          }
          --vaadin-upload-file: {
            color: #ffffff;
          }
        }
        vaadin-upload[dragover] {
          border-color: #396;
        }
        vaadin-upload-file {
          --disabled-text-color: #222222;
        }
        paper-input {
          color: var(--hax-color-text);
        }
      </style>
      <paper-input
        id="url"
        value="{{value}}"
        label="URL"
        type="url"
        auto-validate=""
      ></paper-input>
      <vaadin-upload
        form-data-name="file-upload"
        id="fileupload"
      ></vaadin-upload>
    `;
  }
  static get properties() {
    return {
      value: {
        type: String,
        notify: true
      }
    };
  }
  /**
   * Respond to uploading a file
   */
  _fileAboutToUpload(e) {
    if (!this.__allowUpload) {
      // cancel the event so we can jump in
      e.preventDefault();
      e.stopPropagation();
      // look for a match as to what gizmo types it supports
      let values = {
        source: e.detail.file.name,
        type: e.detail.file.type
      };
      // we have no clue what this is.. let's try and guess..
      var type = window.HaxStore.guessGizmoType(values);
      // find targets that support this type
      let targets = window.HaxStore.getHaxAppStoreTargets(type);
      // make sure we have targets
      if (targets.length === 1) {
        this._haxAppPickerSelection({ detail: targets[0] });
      } else if (targets.length !== 0) {
        window.HaxStore.instance.haxAppPicker.presentOptions(
          targets,
          type,
          "Where would you like to upload this " + type + "?",
          "app"
        );
      } else {
        window.HaxStore.toast(
          "Sorry, you don't have a storage location that can handle " +
            type +
            " uploads!",
          5000
        );
      }
    } else {
      this.__allowUpload = false;
    }
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
    if (
      window.HaxStore.instance.connectionRewrites.appendUploadEndPoint != null
    ) {
      requestEndPoint +=
        "?" + window.HaxStore.instance.connectionRewrites.appendUploadEndPoint;
    }
    if (window.HaxStore.instance.connectionRewrites.appendJwt != null) {
      requestEndPoint +=
        "&" +
        window.HaxStore.instance.connectionRewrites.appendJwt +
        "=" +
        localStorage.getItem(
          window.HaxStore.instance.connectionRewrites.appendJwt
        );
    }
    this.shadowRoot.querySelector("#fileupload").headers = connection.headers;
    this.shadowRoot.querySelector("#fileupload").target = requestEndPoint;
    // invoke file uploading...
    this.__allowUpload = true;
    this.shadowRoot.querySelector("#fileupload").uploadFiles();
  }
  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot
      .querySelector("#fileupload")
      .addEventListener("upload-before", this._fileAboutToUpload.bind(this));
    this.shadowRoot
      .querySelector("#fileupload")
      .addEventListener("upload-response", this._fileUploadResponse.bind(this));
    document.body.addEventListener(
      "hax-app-picker-selection",
      this._haxAppPickerSelection.bind(this)
    );
  }
  disconnectedCallback() {
    this.shadowRoot
      .querySelector("#fileupload")
      .removeEventListener("upload-before", this._fileAboutToUpload.bind(this));
    this.shadowRoot
      .querySelector("#fileupload")
      .removeEventListener(
        "upload-response",
        this._fileUploadResponse.bind(this)
      );
    document.body.removeEventListener(
      "hax-app-picker-selection",
      this._haxAppPickerSelection.bind(this)
    );
    super.disconnectedCallback();
  }
  /**
   * Helper to take a multi-dimensional object and convert
   * it's reference into the real value. This allows for variable input defined
   * in a string to actually hit the deeper part of an object structure.
   */
  _resolveObjectPath(path, obj) {
    return path.split(".").reduce(function(prev, curr) {
      return prev ? prev[curr] : null;
    }, obj || self);
  }
}

window.customElements.define("hax-upload-field", HaxUploadField);
export { HaxUploadField };

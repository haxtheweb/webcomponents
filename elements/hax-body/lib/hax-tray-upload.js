import { LitElement, html, css } from "lit-element/lit-element.js";
import { winEventsElement } from "@lrnwebcomponents/utils/utils.js";
/**
 * @deprecatedApply - required for @apply / invoking @apply css var convention
 */
import "@polymer/polymer/lib/elements/custom-style.js";
class HaxTrayUpload extends winEventsElement(LitElement) {
  static get styles() {
    return [
      css`
        vaadin-upload {
          --primary-color: var(--hax-color-accent1);
          --primary-font-color: #ffffff;
          --dark-primary-color: #ffffff;
          --light-primary-color: var(--hax-color-accent1);
          --error-color: darkred;
          color: #ffffff;
          display: block;
          padding: 16px !important;
        }
        vaadin-upload[dragover] {
          border-color: #396;
        }
        vaadin-upload-file {
          --disabled-text-color: #222222;
        }
        .add-area-content-wrapper {
          padding: 0 4px;
        }
        .add-url-area,
        .add-upload-area {
          margin: 0;
        }
        .url-description {
          color: #000000;
          line-height: 22px;
          font-family: sans-serif;
          letter-spacing: 1px;
        }
      `
    ];
  }
  /**
   * Convention we use
   */
  static get tag() {
    return "hax-tray-upload";
  }
  static get properties() {
    return {
      canSupportUploads: {
        type: Boolean,
        attribute: "can-support-uploads"
      }
    };
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.__winEvents = {
      "hax-store-property-updated": "_haxStorePropertyUpdated",
      "hax-app-picker-selection": "_haxAppPickerSelection",
      "place-holder-file-drop": "_placeHolderFileDrop"
    };
    this.canSupportUploads = false;
    setTimeout(() => {
      import("@polymer/paper-button/paper-button.js");
      import("@polymer/paper-input/paper-input.js");
      import("@vaadin/vaadin-upload/vaadin-upload.js");
    }, 0);
  }
  /**
   * Store updated, sync.
   */
  _haxStorePropertyUpdated(e) {
    if (
      e.detail &&
      e.detail.property === "canSupportUploads"
    ) {
      this[e.detail.property] = e.detail.value;
    }
  }
  /**
   * LitElement render
   */
  render() {
    return html`
      <custom-style>
        <style>
          @import url("https://fonts.googleapis.com/css?family=Noto+Serif");
          paper-input {
            --paper-input-container-label: {
              font-size: 11px;
            }
            --paper-input-container: {
              padding: 0;
            }
          }
          vaadin-upload {
            --vaadin-upload-button-add-wrapper: {
              border: 2px solid #ffffff;
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
              padding: 8px;
            }
            --vaadin-upload-drop-label-dragover: {
              color: #ffffff;
            }
            --vaadin-upload-file-list: {
              padding: 8px;
              margin: 0;
              color: #ffffff;
            }
            --vaadin-upload-file: {
              color: #ffffff;
            }
          }
        </style>
      </custom-style>
      <div class="add-area-content-wrapper">
        <div class="add-url-area">
          <paper-input
            id="url"
            label="URL"
            type="url"
            auto-validate=""
          ></paper-input>
          <div class="url-description">
            Add an existing resource / link
          </div>
        </div>
        <div class="add-upload-area">
          <vaadin-upload
            @upload-before="${this._fileAboutToUpload}"
            @upload-response="${this._fileUploadResponse}"
            form-data-name="file-upload"
            id="fileupload"
            ?hidden="${!this.canSupportUploads}"
          ></vaadin-upload>
        </div>
        <paper-button
          @click="${this.newAssetConfigure}"
          id="newassetconfigure"
          raised=""
          >Configure item</paper-button
        >
      </div>
    `;
  }
  /**
   * Configure asset after upload or URL passed in.
   */
  newAssetConfigure() {
    let values = {
      source: this.shadowRoot.querySelector("#url").value
    };
    // we have no clue what this is.. let's try and guess..
    let type = window.HaxStore.guessGizmoType(values);
    let haxElements = window.HaxStore.guessGizmo(type, values);
    // see if we got anything
    if (haxElements.length > 0) {
      if (haxElements.length === 1) {
        if (typeof haxElements[0].tag !== typeof undefined) {
          this.dispatchEvent(
            new CustomEvent("hax-insert-content", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: haxElements[0]
            })
          );
        }
      } else {
        // hand off to hax-app-picker to deal with the rest of this
        window.HaxStore.instance.haxAppPicker.presentOptions(
          haxElements,
          type,
          "Pick how to present the " + type,
          "gizmo"
        );
      }
    } else {
      window.HaxStore.toast(
        "Sorry, HAX doesn't know how to handle that type of link yet."
      );
    }
  }
  /**
   * A file event was detected from a drag and drop in the interface, most likely
   * from a place-holder tag
   */
  _placeHolderFileDrop(e) {
    // reference the active place holder element since place holders are
    // the only things possible for seeing these
    window.HaxStore.instance.activePlaceHolder = e.detail.placeHolderElement;
    // ! I can't believe this actually works. This takes the event
    // ! that was a drop event else where on the page and then repoints
    // ! it to simulate the drop event using the same event structure that
    // ! would have happened if they had used this element in the first place
    this.shadowRoot.querySelector("#fileupload")._onDrop(e.detail);
  }
  /**
   * Respond to successful file upload, now inject url into url field and
   * do a gizmo guess from there!
   */
  _fileUploadResponse(e) {
    this.editExistingNode = true;
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
    this.shadowRoot.querySelector("#url").value = item.url;
    // @todo put in logic to support the response actually
    // just outright returning a haxElement. This is rare
    // but if the HAX developer has control over the endpoint
    // then they could get HAX to streamline some workflows
    // or by-pass the gizmo selection step to improve UX
    // for end users even further. Examples could be a media
    // management system that has remote rendering (cms-token)
    // or a highly specific endpoint that we know we can only
    // present in one way effectively Box / Google doc viewer.
    this.newAssetConfigure();
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

window.customElements.define(HaxTrayUpload.tag, HaxTrayUpload);
export { HaxTrayUpload };

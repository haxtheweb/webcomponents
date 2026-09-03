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
    // Enable screen recording for hax upload field
    this.noScreenRecord = false;
    this.__winEvents = {
      "hax-app-picker-selection": "_haxAppPickerSelection",
      "jwt-token": "_jwtTokenRefreshed",
    };
    this.t = this.t || {};
    this.t = {
      ...this.t,
      whereUpload: "Where would you like to upload this",
      serverStorageLocationCantHandle: "Server storage location can't handle",
      fileUploadsMustHaveAFileExtension:
        "File uploads must have a file extension",
      uploads: "uploads",
      dropMediaHereOr: "Drop media here or",
      selectMedia: "Select media",
      upload: "Upload",
      takePhoto: "Take photo",
      recordAudio: "Record audio",
      cancel: "Cancel",
      uploadMedia: "Upload media",
      uploadDisabled: "Uploading media is disabled for this site",
    };
    this.registerLocalization({
      context: this,
      namespace: "hax",
    });
  }

  static get tag() {
    return "hax-upload-field";
  }
  _uploadsAllowed() {
    if (HAXStore && typeof HAXStore.platformAllows === "function") {
      return HAXStore.platformAllows("uploadMedia");
    }
    return true;
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
  _resolveUploadJwtValue() {
    // Phase 3 (M1): the access JWT is no longer persisted to localStorage.
    // Read it from the live HAXcms site store when present; fall back to
    // localStorage for non-HAXcms backends that still persist it there.
    if (
      globalThis.HAXCMS &&
      globalThis.HAXCMS.instance &&
      globalThis.HAXCMS.instance.store &&
      typeof globalThis.HAXCMS.instance.store.jwt === "string" &&
      globalThis.HAXCMS.instance.store.jwt !== "" &&
      globalThis.HAXCMS.instance.store.jwt !== "null"
    ) {
      return globalThis.HAXCMS.instance.store.jwt;
    }
    const jwtValue = localStorageGet("jwt");
    return typeof jwtValue === "string" ? jwtValue : "";
  }
  _buildUploadHeaders(connection, jwtValue = "") {
    const headers =
      connection && connection.headers && typeof connection.headers === "object"
        ? { ...connection.headers }
        : {};
    if (
      jwtValue !== "" &&
      !Object.prototype.hasOwnProperty.call(headers, "Authorization") &&
      !Object.prototype.hasOwnProperty.call(headers, "authorization")
    ) {
      headers.Authorization = `Bearer ${jwtValue}`;
    }
    return headers;
  }
  /**
   * Detect the local HAXcms site file store. Both the nodejs and PHP backends
   * build this connection via siteConnectionJSON with details.author
   * "HAXCMS" / details.title "Local files" and an add.endPoint of
   * x/api/v1/files. External app-store providers (YouTube, Unsplash, etc.)
   * only expose browse operations, so they never reach the upload path; any
   * custom provider with its own add operation is treated as external.
   */
  _isLocalHaxcmsStore(app) {
    if (!app || typeof app !== "object") {
      return false;
    }
    const details =
      app.details && typeof app.details === "object" ? app.details : null;
    if (details) {
      const author = String(details.author || "").trim().toLowerCase();
      const title = String(details.title || "").trim().toLowerCase();
      if (author === "haxcms" || title === "local files") {
        return true;
      }
    }
    return false;
  }
  /**
   * Resolve the active node id for v1 file uploads. Prefers the dedicated
   * connectionRewrites.uploadNodeId set by haxcms-site-editor, falling back
   * to parsing nodeId out of the legacy appendUploadEndPoint string.
   */
  _resolveUploadNodeId() {
    if (HAXStore && HAXStore.connectionRewrites) {
      const rewrites = HAXStore.connectionRewrites;
      if (rewrites.uploadNodeId) {
        return String(rewrites.uploadNodeId);
      }
      if (rewrites.appendUploadEndPoint) {
        const match = String(rewrites.appendUploadEndPoint).match(
          /(?:^|&)nodeId=([^&]+)/,
        );
        if (match && match[1]) {
          try {
            return decodeURIComponent(match[1]);
          } catch (err) {
            return match[1];
          }
        }
      }
    }
    return "";
  }
  /**
   * Respond to uploading a file
   */
  _fileAboutToUpload(e) {
    if (!this._uploadsAllowed()) {
      e.preventDefault();
      e.stopPropagation();
      HAXStore.toast(this.t.uploadDisabled, 5000);
      this.__allowUpload = false;
      this.shadowRoot.querySelector("#fileupload").files = [];
      return;
    }
    if (this._canUpload()) {
      // cancel the event so we can jump in
      e.preventDefault();
      e.stopPropagation();
      // look for a match as to what gizmo types it supports
      let values = {
        source: e.detail.file.name,
        type: e.detail.file.type,
      };
      // account for no file type / extension on the upload and block it
      if (e.detail.file.type === "" && !e.detail.file.name.includes(".")) {
        HAXStore.toast(`${this.t.fileUploadsMustHaveAFileExtension}!`, 5000);
        // clear upload because it is never allowed anywhere
        this.shadowRoot.querySelector("#fileupload").files = [];
      } else {
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
          HAXStore.toast(
            `${this.t.serverStorageLocationCantHandle} ${type} ${this.t.uploads}!`,
            5000,
          );
        }
      }
    } else {
      this.__allowUpload = false;
      // Local HAXcms v1 uploads send nodeId as a multipart form field.
      // The target/headers/field-name were wired in _haxAppPickerSelection;
      // here (the "let it proceed" pass) the simple-file-upload FormData is
      // live on e.detail.formData, so append nodeId before it ships.
      const localNodeId = this.__localUploadNodeId;
      if (
        localNodeId &&
        e &&
        e.detail &&
        e.detail.formData &&
        typeof e.detail.formData.append === "function" &&
        !e.defaultPrevented
      ) {
        e.detail.formData.append("nodeId", String(localNodeId));
      }
    }
  }
  /**
   * Event for an app being selected from a picker
   * This happens when multiple upload targets support the given type
   */
  _haxAppPickerSelection(e) {
    if (!this._uploadsAllowed()) {
      this.__allowUpload = false;
      HAXStore.toast(this.t.uploadDisabled, 5000);
      return;
    }
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
    const uploadJwtValue = this._resolveUploadJwtValue();
    const fileUpload = this.shadowRoot.querySelector("#fileupload");
    // Store base endpoint for potential retry after JWT refresh
    this.__baseEndpoint = requestEndPoint;
    // Reset per-upload local-v1 state; _haxAppPickerSelection runs for each
    // upload selection so this stays fresh across target changes.
    this.__localUploadNodeId = "";
    if (this._isLocalHaxcmsStore(e.detail)) {
      // Local HAXcms site store: retarget to the v1 createFile endpoint
      // (POST /x/api/v1/files). The connection already points at
      // x/api/v1/files and carries X-HAXCMS-Site-Token in its headers, so
      // we do NOT append the legacy siteName/nodeId query string. nodeId
      // is sent as a multipart form field instead (see _fileAboutToUpload),
      // and the file is sent under the `upload` field name per the v1 spec.
      fileUpload.formDataName = "upload";
      this.__localUploadNodeId = this._resolveUploadNodeId();
    } else {
      // External app-store provider: preserve the legacy wiring. The file
      // is sent under the default `file-upload` field name and the
      // appendUploadEndPoint query string (siteName/nodeId) is appended.
      fileUpload.formDataName = "file-upload";
      if (HAXStore.connectionRewrites.appendUploadEndPoint != null) {
        requestEndPoint +=
          (requestEndPoint.includes("?") ? "&" : "?") +
          HAXStore.connectionRewrites.appendUploadEndPoint;
      } else if (
        globalThis.store &&
        globalThis.store.manifest &&
        globalThis.store.activeId
      ) {
        // Fallback: try to build parameters from HAXCMSStore if available.
        // This handles cases where appendUploadEndPoint wasn't set yet.
        requestEndPoint +=
          "?siteName=" +
          globalThis.store.manifest.metadata.site.name +
          "&nodeId=" +
          globalThis.store.activeId;
        console.warn(
          "HAXStore.connectionRewrites.appendUploadEndPoint was not set, using fallback from store",
        );
      } else {
        console.error(
          "Cannot determine siteName and nodeId for file upload - appendUploadEndPoint not set and store not available",
        );
      }
    }
    fileUpload.headers = this._buildUploadHeaders(connection, uploadJwtValue);
    fileUpload.target = requestEndPoint;
    // invoke file uploading...
    this.__allowUpload = true;
    setTimeout(() => {
      fileUpload.uploadFiles();
    }, 0);
  }
  /**
   * Handle JWT token refresh
   */
  _jwtTokenRefreshed(e) {
    // If we have a pending upload retry, execute it now
    if (this.__pendingUploadRetry) {
      const fileUpload = this.shadowRoot.querySelector("#fileupload");
      if (fileUpload) {
        // Rebuild the endpoint with the new JWT
        let requestEndPoint = this.__pendingUploadRetry.baseEndpoint;
        const uploadJwtValue = this._resolveUploadJwtValue();
        if (this.__localUploadNodeId) {
          // Local v1 retarget: no appendUploadEndPoint query string; nodeId
          // is re-injected as a multipart form field in _fileAboutToUpload
          // when the retry upload proceeds.
          fileUpload.formDataName = "upload";
        } else if (HAXStore.connectionRewrites.appendUploadEndPoint != null) {
          requestEndPoint +=
            (requestEndPoint.includes("?") ? "&" : "?") +
            HAXStore.connectionRewrites.appendUploadEndPoint;
          fileUpload.formDataName = "file-upload";
        } else {
          // Fallback: try to build parameters from HAXCMSStore if available
          if (
            globalThis.store &&
            globalThis.store.manifest &&
            globalThis.store.activeId
          ) {
            requestEndPoint +=
              "?siteName=" +
              globalThis.store.manifest.metadata.site.name +
              "&nodeId=" +
              globalThis.store.activeId;
          }
          fileUpload.formDataName = "file-upload";
        }
        fileUpload.headers = this._buildUploadHeaders(
          this.__pendingUploadRetry.appUsed
            ? this.__pendingUploadRetry.appUsed.connection
            : null,
          uploadJwtValue,
        );
        fileUpload.target = requestEndPoint;
        // Retry the upload
        this.__allowUpload = true;
        fileUpload.uploadFiles();
      }
      this.__pendingUploadRetry = null;
    }
  }

  /**
   * Respond to successful file upload, now inject url into url field and
   * do a gizmo guess from there!
   */
  _fileUploadResponse(e) {
    // Handle 403 - JWT needs refresh
    if (e.detail.xhr.status === 403) {
      if (!this._uploadsAllowed()) {
        HAXStore.toast(this.t.uploadDisabled, 5000);
        this.__allowUpload = false;
        this.__pendingUploadRetry = null;
        if (this.shadowRoot.querySelector("#fileupload")) {
          this.shadowRoot.querySelector("#fileupload").files = [];
        }
        return;
      }
      // Store upload context for retry after token refresh
      this.__pendingUploadRetry = {
        baseEndpoint: this.__baseEndpoint,
        appUsed: this.__appUsed,
      };
      // Trigger JWT refresh
      globalThis.dispatchEvent(
        new CustomEvent("jwt-login-refresh-token", {
          composed: true,
          bubbles: true,
          cancelable: false,
          detail: {},
        }),
      );
      return;
    }
    // ensure we had a positive response
    if (e.detail.xhr.status === 200) {
      try {
        // convert response to object
        let response = JSON.parse(e.detail.xhr.response);
        let data = {};
        let item = {};
        let map = null;
        // some upload flows can bypass app picker selection and configure
        // endpoint / headers directly, so __appUsed can be undefined
        if (
          this.__appUsed &&
          this.__appUsed.connection &&
          this.__appUsed.connection.operations &&
          this.__appUsed.connection.operations.add &&
          this.__appUsed.connection.operations.add.resultMap
        ) {
          map = this.__appUsed.connection.operations.add.resultMap;
        }
        if (map && map.gizmo && typeof map.gizmo === "object") {
          // look for the items element to draw our data from at its root
          if (
            typeof this._resolveObjectPath(map.item, response) !==
            typeof undefined
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
        } else {
          if (response && typeof response.url === "string" && response.url) {
            item.url = response.url;
          } else if (
            response &&
            response.data &&
            typeof response.data.url === "string" &&
            response.data.url
          ) {
            item.url = response.data.url;
          } else if (
            response &&
            response.data &&
            typeof response.data.file === "string" &&
            response.data.file
          ) {
            item.url = response.data.file;
          }
        }
        // Local HAXcms v1 createFile returns {data:{file:{url, fullUrl, ...}}}
        // where `url` is a site-relative path (matches the browse resultMap's
        // gizmo.source mapping) and `fullUrl` is the absolute path (with
        // cache-buster), used only for preview thumbnails. Keep the relative
        // `url` here so the persisted source stays portable across base path
        // / domain changes instead of breaking when the URL changes.
        // set the value of the url which will update our URL and notify
        if (this.shadowRoot.querySelector("#url") && item.url) {
          this.shadowRoot.querySelector("#url").value = item.url;
        }
        //TODO need a way to get suggestedResources from HAXStore and then add uploaded resource
        //this.suggestedResources['item.url'] = ''; or this.suggestedResources['item.url'] = { name, icon, type, preview };

        // Execute callback if provided (e.g., for set-page-media operation)
        if (
          HAXStore.activePlaceHolderCallback &&
          typeof HAXStore.activePlaceHolderCallback === "function"
        ) {
          HAXStore.activePlaceHolderCallback({
            file: typeof item.url === "string" ? item.url : "",
            item: item,
            response: response,
          });
          // Clear callback after execution
          HAXStore.activePlaceHolderCallback = null;
        }
      } catch (e) {
        console.warn("Error parsing response", e);
      }
      if (this.shadowRoot.querySelector("#url")) {
        // clear the file upload field because it went through so no reason to keep it
        this.shadowRoot.querySelector("#fileupload").files = [];
      }
    }
  }
  // add button for merlin
  get sources() {
    return html` <simple-toolbar-button
        ?disabled="${this.disabled}"
        label="${this.t.selectMedia}.."
        icon="hax:multimedia"
        @click="${this._clickMediaButton}"
        controls="fieldset"
        part="merlin"
        ?hidden="${!this.showSources}"
      >
      </simple-toolbar-button>
      ${super.sources}`;
  }
  valueChanged(e) {
    this.value = e.detail.value;
  }
  _clickMediaButton(e) {
    var type = "";
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
    // `type` is a gizmo type hint (image/video/etc), not free-text search
    // input. Passing it as the `like` argument pre-fills the visible Merlin
    // search box with that literal word, which then also filters the
    // (unrelated) app-search items by title, producing "No results for this
    // term" since none of Merlin's registered search apps have "image" or
    // "video" in their title. Leave the search field empty (mirrors
    // hax-tray.js's working `runProgram("")` pattern) and pass the type
    // through as a value instead so it remains available if a program
    // wants to use it for scoping later.
    SuperDaemonInstance.runProgram("", "/", { type });

    //SuperDaemonInstance.appendContext();
    // allows for diverting input back to target
    if (this.tagName.toLowerCase() == "hax-upload-field") {
      SuperDaemonInstance.programTarget = this;
    }
    SuperDaemonInstance.open();
  }
}

globalThis.customElements.define(HaxUploadField.tag, HaxUploadField);
export { HaxUploadField };

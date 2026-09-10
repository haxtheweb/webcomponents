import { html, css } from "lit";
import { SimpleFieldsUpload } from "@haxtheweb/simple-fields/lib/simple-fields-upload.js";
import { winEventsElement, localStorageGet } from "@haxtheweb/utils/utils.js";
import { HAXStore } from "./hax-store.js";
import { SuperDaemonInstance } from "@haxtheweb/super-daemon/super-daemon.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import "@haxtheweb/a11y-collapse/a11y-collapse.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
// #3028: reuse the real hax-file-actions element (field mode) and its preset
// table as the single source of truth for transforms/compress/scale, instead
// of duplicating the option list here. The op itself reuses the existing
// @site/updateFileByUuid backend.
import { SCALE_PRESETS } from "./hax-file-actions.js";

// Advisory thresholds (recommendations only; never block). See issue #3028.
const COMPRESS_RECOMMEND_SIZE = 256 * 1024;
const RESIZE_RECOMMEND_LONGEST_SIDE = 1200;

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
    // #3028: inline image file-action recommendation state
    this.fileActions = false;
    this.__fileRecs = [];
    this.__lastUploadedFile = null;
    this.__fileActionsBusy = false;
    this.__fileActionsError = "";
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
      imageInfo: "Image info",
      imageActions: "Image actions",
      imageRecommendations: "Image recommendations",
      compressImage: "Compress image",
      resizeTo: "Resize to",
      created: "Created",
      size: "Size",
      dimensions: "Dimensions",
      type: "Type",
      done: "done",
      noFileUuid: "File reference unavailable; re-upload to enable actions.",
      fileOpsUnavailable: "File operations are not available for this site.",
      fileOpFailed: "File operation failed.",
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
      /**
       * #3028: opt-in flag on a haxupload/fileupload schema field. When true,
       * the field surfaces an Image Info panel (size / dimensions / mimetype)
       * with actionable compress/resize icons plus a collapsed Image Actions
       * area offering in-place transform/compress/scale run via
       * @site/updateFileByUuid. Stats + actions hydrate from the field's
       * current value (via @site/listFiles) so they appear for an already-set
       * source, not only after a fresh upload. Default false so nothing
       * changes for existing schemas.
       */
      fileActions: {
        type: Boolean,
        attribute: "file-actions",
        reflect: true,
      },
      __fileRecs: { type: Array, attribute: false },
      __lastUploadedFile: { type: Object, attribute: false },
      __fileActionsBusy: { type: Boolean, attribute: false },
      __fileActionsError: { type: String, attribute: false },
    };
  }
  static get styles() {
    return [
      ...super.styles,
      css`
        .file-actions-wrap {
          margin-top: var(--ddd-spacing-2);
        }
        a11y-collapse.file-actions-collapse,
        a11y-collapse.file-info-collapse {
          margin: 0;
          --a11y-collapse-margin: 0;
          --a11y-collapse-vertical-padding: var(--ddd-spacing-1);
          --a11y-collapse-horizontal-padding: var(--ddd-spacing-2);
        }
        a11y-collapse.file-actions-collapse::part(heading),
        a11y-collapse.file-info-collapse::part(heading) {
          font-weight: var(--ddd-font-weight-medium);
        }
        .file-info-grid {
          display: grid;
          grid-template-columns: max-content 1fr;
          gap: var(--ddd-spacing-1) var(--ddd-spacing-3);
          font-size: var(--ddd-font-size-5xs);
          font-family: var(--ddd-font-navigation);
          padding: var(--ddd-spacing-1) 0;
        }
        .file-info-grid dt {
          font-weight: var(--ddd-font-weight-medium);
        }
        .file-info-grid dd {
          margin: 0;
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
        }
        .info-action-btn {
          --simple-icon-button-background-color: var(--ddd-theme-default-skyBlue);
          --simple-icon-button-border-radius: var(--ddd-radius-sm);
          --simple-icon-button-padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
          --simple-icon-width: var(--ddd-icon-4xs);
          --simple-icon-height: var(--ddd-icon-4xs);
          --simple-icon-color: var(--ddd-theme-default-white);
          color: var(--ddd-theme-default-white);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-5xs);
          font-weight: var(--ddd-font-weight-bold);
          gap: var(--ddd-spacing-1);
        }
        .rec-chips {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-1) 0;
        }
        .rec-chip {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-5xs);
          font-weight: var(--ddd-font-weight-medium);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-3);
          border: var(--ddd-border-sm) solid
            var(--ddd-theme-default-limestoneGray);
          border-radius: var(--ddd-radius-rounded, 999px);
          background: var(--ddd-theme-default-white);
          color: var(--ddd-theme-default-coalyGray);
          cursor: pointer;
        }
        .rec-chip:hover:not(:disabled) {
          border-color: var(--ddd-theme-default-skyBlue);
          color: var(--ddd-theme-default-skyBlue);
        }
        .rec-chip:disabled {
          opacity: 0.6;
          cursor: default;
        }
        .rec-more {
          margin-top: var(--ddd-spacing-2);
        }
        .rec-more simple-fields-field {
          --simple-fields-font-size: var(--ddd-font-size-5xs);
          --simple-fields-select-max-width: 100%;
          margin: 0;
        }
        .rec-status {
          font-size: var(--ddd-font-size-5xs);
          min-height: 1.2em;
          margin-top: var(--ddd-spacing-1);
        }
        .rec-status.error {
          color: var(--ddd-theme-default-error);
        }
      `,
    ];
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
        // #3028: capture uploaded image metadata (uuid / dims / size) so the
        // inline recommendation UI can offer compress / resize run in place via
        // @site/updateFileByUuid.
        if (this.fileActions) {
          this._captureUploadedFileForRecs(response, item);
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
  /**
   * #3028: append the inline image-action collapse after the inherited
   * upload markup. SimpleFieldsUpload.render() renders `${this.fields}` inside
   * a <fieldset>, so extending the fields getter is the single injection point.
   */
  get fields() {
    return html`${super.fields}${this._fileActionsTemplate}`;
  }
  get _fileActionsTemplate() {
    if (!this.fileActions) return html``;
    const f = this.__lastUploadedFile;
    const isImage = !!(f && this._isImageMime(f.type));
    if (!f || !isImage) return html``;
    const recs = this.__fileRecs || [];
    const compressRec = recs.find((r) => r.kind === "compress");
    const resizeRec = recs.find((r) => r.kind === "scale");
    const hasUuid = !!f.uuid;
    return html`
      <div class="file-actions-wrap">
        <a11y-collapse
          class="file-info-collapse"
          heading-button
          accordion
        >
          <span slot="heading">${this.t.imageInfo}</span>
          <dl class="file-info-grid">
            <dt>${this.t.created}</dt>
            <dd>${this._fmtDate(f.dateCreated)}</dd>
            <dt>${this.t.size}</dt>
            <dd>
              ${this._fmtBytes(f.size)}
              ${compressRec
                ? html`<simple-icon-button-lite
                    class="info-action-btn"
                    icon="icons:compress"
                    label="${compressRec.label}"
                    title="${compressRec.label}"
                    ?disabled="${this.__fileActionsBusy}"
                    @click="${() => this._runFileRec(compressRec)}"
                    >90</simple-icon-button-lite
                  >`
                : html``}
            </dd>
            <dt>${this.t.dimensions}</dt>
            <dd>
              ${f.width && f.height
                ? f.width + " \u00d7 " + f.height
                : "\u2014"}
              ${resizeRec
                ? html`<simple-icon-button-lite
                    class="info-action-btn"
                    icon="image:transform"
                    label="${resizeRec.label}"
                    title="${resizeRec.label}"
                    ?disabled="${this.__fileActionsBusy}"
                    @click="${() => this._runFileRec(resizeRec)}"
                  ></simple-icon-button-lite>`
                : html``}
            </dd>
            <dt>${this.t.type}</dt>
            <dd>${f.type || "\u2014"}</dd>
          </dl>
          ${hasUuid
            ? html`<div class="rec-more">
                <hax-file-actions
                  mode="field"
                  selected-count="1"
                  image-count="1"
                  ?can-scale="${!this.__fileActionsBusy}"
                  ?busy="${this.__fileActionsBusy}"
                  @hax-file-action="${this._onInlineFileAction}"
                ></hax-file-actions>
              </div>`
            : html``}
          <div
            class="rec-status ${this.__fileActionsError ? "error" : ""}"
            aria-live="polite"
          >
            ${this.__fileActionsError}
          </div>
        </a11y-collapse>
      </div>
    `;
  }
  /**
   * Preserve SimpleFieldsUpload.updated (value-changed notify + delayed focus)
   * and hydrate stats + uuid from the current field value so the info panel
   * and actions appear for an already-set source, not only after a fresh
   * upload. Recompute recommendations when the value or opt-in flag changes.
   */
  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    if (!this.fileActions) return;
    let hydrate = false;
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "value" || propName === "fileActions") hydrate = true;
    });
    if (hydrate) this._maybeHydrateFromValue();
  }
  /**
   * If the field has a value that we haven't yet hydrated from, resolve the
   * file record (uuid/size/mimetype/dateCreated) via @site/listFiles and read
   * pixel dimensions client-side. If the value is cleared, drop the cache.
   * Skips re-hydration when the value already matches the cached source
   * (e.g. a cache-busting ?t= query appended after an in-place op).
   */
  _maybeHydrateFromValue() {
    const v = typeof this.value === "string" ? this.value : "";
    const norm = this._normalizeSource(v);
    if (!v) {
      if (this.__lastUploadedFile) {
        this.__lastUploadedFile = null;
        this.__fileRecs = [];
      }
      return;
    }
    const cur = this.__lastUploadedFile
      ? this._normalizeSource(this.__lastUploadedFile.source)
      : "";
    if (norm === cur) {
      this._recomputeRecs();
      return;
    }
    this._hydrateFromFileValue(v);
  }
  async _hydrateFromFileValue(value) {
    const norm = this._normalizeSource(value);
    if (!norm) return;
    // For absolute same-origin URLs, drill to the files/... portion so the
    // record matching still aligns with the relative path the API returns.
    const filesPath = this._filesPathFromValue(norm);
    // The @site/listFiles `filename` filter matches against the file's
    // relativePath (no "files/" prefix) and entryName, so strip the prefix
    // for the filter or no results come back. Keep the prefixed `norm` for
    // matching the returned record's url/path (which DO carry "files/").
    const filenameFilter = filesPath.replace(/^files\//, "");
    // Only local site files (relative files/... paths or same-origin URLs
    // containing files/) can be operated on via @site/updateFileByUuid, so
    // only those warrant a listFiles UUID lookup. Remote URLs skip straight
    // to the client-side fallback (dims only, no uuid -> no actions).
    const isLocal = this._isLocalFileValue(norm);
    // Race guard: only the latest hydration call wins.
    const token = (this.__hydrateToken =
      (this.__hydrateToken || 0) + 1);
    const ready = isLocal
      ? await this._waitForSiteOp("@site/listFiles")
      : false;
    if (token !== this.__hydrateToken) return;
    if (
      ready &&
      MicroFrontendRegistry &&
      typeof MicroFrontendRegistry.call === "function"
    ) {
      try {
        const d = await MicroFrontendRegistry.call(
          "@site/listFiles",
          { filename: filenameFilter, "page.limit": 500 },
          null,
          this,
        );
        if (token !== this.__hydrateToken) return;
        if (
          d &&
          d.status === 200 &&
          d.data &&
          Array.isArray(d.data.files)
        ) {
          const rec = d.data.files.find(
            (r) =>
              r &&
              (r.url === filesPath ||
                r.path === filesPath ||
                r.url === norm ||
                r.path === norm ||
                r.url === value ||
                r.path === value),
          );
          if (rec) {
            this.__lastUploadedFile = {
              uuid: rec.uuid || "",
              width: 0,
              height: 0,
              size: rec.size || 0,
              type: rec.mimetype || "",
              dateCreated: rec.dateCreated || 0,
              source: rec.url || rec.path || norm,
              fullUrl: rec.fullUrl || "",
            };
            this._recomputeRecs();
            this._readDimsIntoCache(this.__lastUploadedFile, token);
            return;
          }
        }
      } catch (e) {}
    }
    // Fallback: client-side stats only (no uuid -> actions disabled with a
    // noFileUuid toast). Dims via Image(); size+mimetype via same-origin fetch.
    const mime = this._mimeFromUrl(norm);
    this.__lastUploadedFile = {
      uuid: "",
      width: 0,
      height: 0,
      size: 0,
      type: mime,
      dateCreated: 0,
      source: norm,
      fullUrl: value,
    };
    this._recomputeRecs();
    this._readDimsIntoCache(this.__lastUploadedFile, token);
    try {
      const resp = await fetch(value);
      if (token !== this.__hydrateToken) return;
      if (resp && resp.ok) {
        const blob = await resp.blob();
        if (token !== this.__hydrateToken) return;
        if (
          this.__lastUploadedFile &&
          this.__lastUploadedFile.source === norm
        ) {
          this.__lastUploadedFile.size = (blob && blob.size) || 0;
          if (!this.__lastUploadedFile.type && blob && blob.type) {
            this.__lastUploadedFile.type = blob.type;
          }
          this._recomputeRecs();
        }
      }
    } catch (e) {}
  }
  /**
   * Read pixel dimensions from the cached file's fullUrl (or source) and merge
   * them back if the hydration token is still current (no newer value won).
   */
  _readDimsIntoCache(f, token) {
    const url = (f && (f.fullUrl || f.source)) || "";
    if (!url) return;
    this._readImageDimsFromUrl(url).then((dims) => {
      if (
        token === this.__hydrateToken &&
        this.__lastUploadedFile &&
        this.__lastUploadedFile.source === f.source
      ) {
        this.__lastUploadedFile.width = dims.width;
        this.__lastUploadedFile.height = dims.height;
        this._recomputeRecs();
      }
    });
  }
  /**
   * Strip a cache-busting ?t=<ts> query so a post-op source still matches the
   * cached file's clean relative path.
   */
  _normalizeSource(v) {
    return String(v || "")
      .replace(/[?&]t=\d+/, "")
      .replace(/[?&]$/, "");
  }
  _mimeFromUrl(url) {
    const ext = String(url || "")
      .split("?")[0]
      .split(".")
      .pop()
      .toLowerCase();
    const map = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      svg: "image/svg+xml",
    };
    return map[ext] || "";
  }
  /**
   * Extract the leading "files/..." portion of a value so an absolute
   * same-origin URL (e.g. https://host/sites/x/files/a.jpg) still resolves to
   * its file record via the relative-path listFiles filter. Returns the input
   * unchanged when no files/ segment is present.
   */
  _filesPathFromValue(v) {
    const s = String(v || "");
    const i = s.indexOf("files/");
    if (i === -1) return s;
    return s.substring(i);
  }
  /**
   * True when the value references a local site file: a relative path, or a
   * same-origin absolute URL containing a files/ segment. Remote (cross-origin)
   * URLs return false so we skip the listFiles UUID lookup for them.
   */
  _isLocalFileValue(v) {
    const s = String(v || "");
    if (!s) return false;
    if (s.indexOf("http://") !== 0 && s.indexOf("https://") !== 0) return true;
    if (s.indexOf("files/") === -1) return false;
    try {
      const u = new URL(s, globalThis.location.href);
      return u.origin === globalThis.location.origin;
    } catch (e) {
      return false;
    }
  }
  /**
   * Capture an uploaded image's metadata from the v1 createFile response so
   * the inline UI can operate on it via @site/updateFileByUuid. Falls back to
   * a client-side Image() dimension read when the response omits width/height.
   */
  _captureUploadedFileForRecs(response, item) {
    const fileObj =
      response && response.data && response.data.file ? response.data.file : null;
    if (fileObj && this._isImageMime(fileObj.type)) {
      this.__lastUploadedFile = {
        uuid: fileObj.uuid || "",
        width: fileObj.width || 0,
        height: fileObj.height || 0,
        size: fileObj.size || 0,
        type: fileObj.type || "",
        dateCreated:
          fileObj.dateCreated || Math.floor(Date.now() / 1000),
        source: fileObj.url || (item && item.url) || "",
        fullUrl: fileObj.fullUrl || "",
      };
      const f = this.__lastUploadedFile;
      if ((!f.width || !f.height) && f.fullUrl) {
        this._readImageDimsFromUrl(f.fullUrl).then((dims) => {
          if (
            this.__lastUploadedFile &&
            this.__lastUploadedFile.source === f.source
          ) {
            this.__lastUploadedFile.width = dims.width;
            this.__lastUploadedFile.height = dims.height;
            this._recomputeRecs();
          }
        });
      }
    } else {
      this.__lastUploadedFile = null;
    }
    this._recomputeRecs();
  }
  /**
   * After a successful @site/updateFileByUuid op, refresh the cached uploaded
   * file metadata from the response record (new uuid / size / source) and
   * re-read pixel dimensions so recommendations recompute against the result.
   */
  _refreshUploadedFileFromResponse(d) {
    const fileRec = d && d.data ? d.data.file : null;
    if (!fileRec) return;
    const prev = this.__lastUploadedFile || {};
    const mime = fileRec.mimetype || fileRec.type || prev.type || "";
    this.__lastUploadedFile = {
      uuid: fileRec.uuid || prev.uuid || "",
      width: 0,
      height: 0,
      size: fileRec.size || 0,
      type: mime,
      dateCreated: fileRec.dateCreated || prev.dateCreated || 0,
      source: fileRec.url || fileRec.path || prev.source || "",
      fullUrl: fileRec.fullUrl || prev.fullUrl || "",
    };
    // Recompute immediately so the info panel's size + (!) flag update in
    // real time after a compress op (size drops below the threshold => flag
    // and compress chip disappear) without waiting on the dimension re-read.
    this._recomputeRecs();
    const f = this.__lastUploadedFile;
    if (f.fullUrl) {
      this._readImageDimsFromUrl(f.fullUrl).then((dims) => {
        if (
          this.__lastUploadedFile &&
          this.__lastUploadedFile.source === f.source
        ) {
          this.__lastUploadedFile.width = dims.width;
          this.__lastUploadedFile.height = dims.height;
          this._recomputeRecs();
        }
      });
    }
  }
  /**
   * Build the proactive recommendation list. Only compress / resize are
   * surfaced as chips; the full transform/compress/scale list lives in the
   * embedded <hax-file-actions mode="field"> bar.
   */
  _recomputeRecs() {
    if (!this.fileActions) {
      this.__fileRecs = [];
      return;
    }
    const recs = [];
    const f = this.__lastUploadedFile;
    if (f && this._isImageMime(f.type)) {
      if (f.size && f.size > COMPRESS_RECOMMEND_SIZE) {
        recs.push({ kind: "compress", level: "medium", label: this.t.compressImage });
      }
      if (f.width && f.height) {
        const longest = Math.max(f.width, f.height);
        if (longest > RESIZE_RECOMMEND_LONGEST_SIDE) {
          const key = this._closestScalePreset(longest);
          recs.push({
            kind: "scale",
            size: key,
            label: this.t.resizeTo + " " + SCALE_PRESETS[key].label,
          });
        }
      }
    }
    this.__fileRecs = recs;
  }
  _isImageMime(mime) {
    return (
      typeof mime === "string" &&
      mime.indexOf("image/") === 0 &&
      mime !== "image/svg+xml"
    );
  }
  _closestScalePreset(longest) {
    const keys = ["xs", "sm", "md", "lg", "xl"];
    let chosen = "xl";
    for (let i = 0; i < keys.length; i++) {
      const w = SCALE_PRESETS[keys[i]].width;
      if (w <= longest) chosen = keys[i];
    }
    return chosen;
  }
  _readImageDimsFromUrl(url) {
    return new Promise((resolve) => {
      try {
        const img = new Image();
        img.onload = function () {
          resolve({ width: img.naturalWidth || 0, height: img.naturalHeight || 0 });
        };
        img.onerror = function () {
          resolve({ width: 0, height: 0 });
        };
        img.src = url;
      } catch (e) {
        resolve({ width: 0, height: 0 });
      }
    });
  }
  /**
   * Run a recommendation chip. Compress/scale go through @site/updateFileByUuid.
   */
  _runFileRec(rec) {
    if (this.__fileActionsBusy || !rec) return;
    const f = this.__lastUploadedFile;
    if (!f || !f.uuid) {
      HAXStore.toast(this.t.noFileUuid, 4000);
      return;
    }
    const params = { fileUuid: f.uuid };
    if (rec.kind === "compress") {
      params.operation = "compress";
      params.level = rec.level;
    } else if (rec.kind === "scale") {
      params.operation = "scale";
      params.size = rec.size;
    } else {
      return;
    }
    this._callFileOp(params, rec.label);
  }
  /**
   * Handle a transform/compress/scale/rotate choice from the inline
   * <hax-file-actions mode="field"> bar. Maps the {action, value} event to
   * the @site/updateFileByUuid params and runs the op on the uploaded file.
   */
  _onInlineFileAction(e) {
    if (this.__fileActionsBusy) return;
    const action = e && e.detail ? e.detail.action : "";
    const value = e && e.detail && typeof e.detail.value === "string" ? e.detail.value : "";
    if (!action) return;
    const f = this.__lastUploadedFile;
    if (!f || !f.uuid) {
      HAXStore.toast(this.t.noFileUuid, 4000);
      return;
    }
    const params = { fileUuid: f.uuid };
    if (action === "transform" || action === "rotate") {
      params.operation = value;
    } else if (action === "compress") {
      params.operation = "compress";
      params.level = value;
    } else if (action === "scale") {
      params.operation = "scale";
      params.size = value;
    } else {
      return;
    }
    this._callFileOp(params, action + ":" + value);
  }
  async _callFileOp(params, label) {
    this.__fileActionsBusy = true;
    this.__fileActionsError = "";
    try {
      const ready = await this._waitForSiteOp("@site/updateFileByUuid");
      if (
        !ready ||
        !MicroFrontendRegistry ||
        typeof MicroFrontendRegistry.call !== "function"
      ) {
        this.__fileActionsError = this.t.fileOpsUnavailable;
        HAXStore.toast(this.__fileActionsError, 4000);
        return;
      }
      const d = await MicroFrontendRegistry.call(
        "@site/updateFileByUuid",
        params,
        null,
        this,
      );
      const status = d && d.status ? d.status : 0;
      if (status !== 200) {
        this.__fileActionsError =
          d && d.data && d.data.message ? d.data.message : this.t.fileOpFailed;
        HAXStore.toast(this.__fileActionsError, 4000);
        return;
      }
      HAXStore.toast(label + " \u2014 " + this.t.done, 3000);
      // Refresh the cached file metadata from the op response so a subsequent
      // op uses the new uuid. In-place ops (compress / scale) change the file
      // size, which changes the deterministic uuid; without this the next op
      // would resolve a stale uuid and 404.
      this._refreshUploadedFileFromResponse(d);
      this._reloadSourceCacheBust();
    } catch (e) {
      this.__fileActionsError = this.t.fileOpFailed;
      HAXStore.toast(this.__fileActionsError, 4000);
    } finally {
      this.__fileActionsBusy = false;
    }
  }
  /**
   * Poll until the @site/* operation is registered (the site API registry is
   * populated on site load). Avoids a hax-body -> haxcms-elements dependency
   * on the waitForHAXCMSSiteApiRegistryReady helper.
   */
  async _waitForSiteOp(operationName, timeoutMs = 5000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      if (
        MicroFrontendRegistry &&
        typeof MicroFrontendRegistry.has === "function" &&
        MicroFrontendRegistry.has(operationName)
      ) {
        return true;
      }
      await new Promise((r) => setTimeout(r, 60));
    }
    return false;
  }
  /**
   * After an in-place file op, force the live preview to re-render the
   * transformed image WITHOUT writing the cache-busting ?t= query into the
   * saved content.
   *
   * this.value is what the hax-tray persists into page content, so it must
   * stay clean (no ?t=). For in-place ops the clean path is unchanged, so
   * setting this.value is a no-op and no value-changed fires — the preview
   * would keep showing the stale HTTP-cached bytes. The browser's HTTP cache
   * for the clean URL can't be invalidated from JS, so the only way to force
   * a re-fetch is to change the URL.
   *
   * Solution: poke the <img> elements living in the active node's SHADOW DOM
   * directly with a cache-busted src (?t=<ts>) and leave it there (no revert).
   * Shadow DOM <img> srcs are NOT serialized into saved page content — HAX
   * serializes the light DOM, which carries the clean `source` property —
   * so ?t= never reaches saved content. When the op changed the path (e.g.
   * convert-jpg), setting this.value to the new clean path fires value-changed
   * and the element re-renders with the new URL (fresh, no cache issue), so no
   * poke is needed.
   */
  _reloadSourceCacheBust() {
    const urlField = this.shadowRoot.querySelector("#url");
    const f = this.__lastUploadedFile;
    let clean = f && f.source ? this._normalizeSource(f.source) : "";
    if (!clean) {
      let v = urlField ? urlField.value : "";
      if (!v && typeof this.value === "string") v = this.value;
      clean = this._normalizeSource(v);
    }
    if (!clean) return;
    const prevClean = this._normalizeSource(this.value || "");
    // Always keep this.value + #url clean so saved content never carries ?t=.
    if (urlField) urlField.value = clean;
    this.value = clean;
    // Path-changing ops (e.g. convert-jpg): the new clean path triggers a
    // value-changed → tray writes new source → element re-renders with the
    // new URL (fresh, no cache issue). No shadow-DOM poke needed.
    if (prevClean !== clean) return;
    // In-place ops (compress / scale / sepia / b&w / rotate): path unchanged,
    // so this.value doesn't change and no re-render fires. Poke every <img>
    // in the active node's shadow DOM tree with a cache-busted src so the
    // browser re-fetches the fresh bytes. The ?t= stays on the shadow DOM
    // img only — light DOM serialization reads the clean source property.
    const node = HAXStore && HAXStore.activeNode ? HAXStore.activeNode : null;
    if (!node || !node.shadowRoot) return;
    const ts = Date.now();
    const join = clean.indexOf("?") === -1 ? "?" : "&";
    const busted = clean + join + "t=" + ts;
    this._pokeShadowImgs(node.shadowRoot, busted);
  }
  /**
   * Recursively set src on every <img> in a shadow root tree, piercing
   * nested shadow roots (e.g. media-image → media-image-image → <img>).
   */
  _pokeShadowImgs(root, src) {
    if (!root || typeof root.querySelectorAll !== "function") return;
    const imgs = root.querySelectorAll("img");
    for (let i = 0; i < imgs.length; i++) {
      imgs[i].src = src;
    }
    const all = root.querySelectorAll("*");
    for (let i = 0; i < all.length; i++) {
      if (all[i] && all[i].shadowRoot) {
        this._pokeShadowImgs(all[i].shadowRoot, src);
      }
    }
  }
  /**
   * Format bytes for the Image Info panel (e.g. 312 KB, 1.4 MB).
   */
  _fmtBytes(bytes) {
    const n = typeof bytes === "number" && bytes > 0 ? bytes : 0;
    if (n < 1024) return n + " B";
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KB";
    if (n < 1024 * 1024 * 1024) return (n / (1024 * 1024)).toFixed(1) + " MB";
    return (n / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  }
  /**
   * Format the dateCreated (seconds since epoch, matching the backend
   * FileRecord dateCreated) for the Image Info panel.
   */
  _fmtDate(seconds) {
    const s = typeof seconds === "number" && seconds > 0 ? seconds : 0;
    if (!s) return "\u2014";
    try {
      const d = new Date(s * 1000);
      return d.toLocaleDateString() + " " + d.toLocaleTimeString();
    } catch (e) {
      return "\u2014";
    }
  }
}

globalThis.customElements.define(HaxUploadField.tag, HaxUploadField);
export { HaxUploadField };

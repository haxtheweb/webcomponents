import { html, css } from "lit";
import { keyed } from "lit/directives/keyed.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";
import { autorun, toJS } from "mobx";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { waitForHAXCMSSiteApiRegistryReady } from "@haxtheweb/haxcms-elements/lib/core/utils/haxcms-site-api-registry.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-icon/lib/simple-clipboard-copy-button.js";
import "@haxtheweb/hax-body/lib/hax-upload-field.js";
import "@haxtheweb/editable-table/lib/editable-table-display.js";
import "@haxtheweb/simple-pager/simple-pager.js";
import "@haxtheweb/simple-fields/lib/simple-fields-field.js";
import "@haxtheweb/hax-body/lib/hax-file-actions.js";
import { haxcmsApiMessage } from "./utils/HAXCMSApiMessages.js";

const FILE_TYPE_FILTER_ITEMS = [
  { value: "", text: "All types", key: "allTypes" },
  { value: "image", text: "Images", key: "images" },
  { value: "video", text: "Video", key: "video" },
  { value: "audio", text: "Audio", key: "audio" },
  { value: "application/pdf", text: "PDF" },
];

const COMPRESS_LEVELS = ["light", "medium", "heavy", "maximum"];

const PAGE_SIZE_OPTIONS = [10, 25, 50, 75, 100, 250, 500];

const SCALE_PRESETS = {
  xs: { width: 150, height: 150, label: "150px" },
  sm: { width: 480, height: 480, label: "480px" },
  md: { width: 800, height: 800, label: "800px" },
  lg: { width: 1200, height: 1200, label: "1200px" },
  xl: { width: 1920, height: 1920, label: "1920px" },
};

class HAXCMSFilesAdminDialog extends I18NMixin(DDD) {
  static get tag() {
    return "haxcms-files-admin-dialog";
  }
  static get properties() {
    return {
      rows: { type: Array },
      loading: { type: Boolean, reflect: true },
      busy: { type: Boolean, reflect: true },
      bulkBusy: { type: Boolean, attribute: false },
      selectedRows: { type: Object, attribute: false },
      errorMessage: { type: String },
      method: { type: String },
      siteName: { type: String, attribute: "site-name" },
      nodeId: { type: String, attribute: "node-id" },
      scalePreset: { type: String, attribute: "scale-preset" },
      cacheBustToken: { type: String, attribute: false },
      pageLimit: { type: Number, attribute: "page-limit" },
      pageOffset: { type: Number, attribute: "page-offset" },
      pageTotal: { type: Number, attribute: "page-total" },
      filterType: { type: String, attribute: "filter-type" },
      filterExtension: { type: String, attribute: "filter-extension" },
      filterNameContains: { type: String, attribute: "filter-name-contains" },
    };
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      allTypes: "All types",
      images: "Images",
      video: "Video",
      audio: "Audio",
      timeAgo: "{time} ago",
      month: "month",
      months: "months",
      day: "day",
      days: "days",
      hour: "hour",
      hours: "hours",
      minute: "minute",
      minutes: "minutes",
      second: "second",
      seconds: "seconds",
      unableToLoadFiles: "Unable to load files",
      uploadComplete: "Upload complete",
      unableToRunFileOperation: "Unable to run file operation.",
      fileUuidMissing: "File UUID is missing",
      fileOperationEndpointUnavailable:
        "File operation endpoint is not available",
      fileOperationFailed: "File operation failed",
      fileOperationComplete: "File operation complete",
      fileDeleted: "File deleted",
      fileRenamed: "File renamed",
      imageConvertedToJpg: "Image converted to JPG",
      imageRotated90: "Image rotated 90 degrees",
      imageTransformedSepia: "Image transformed to sepia",
      imageTransformedBlackAndWhite: "Image transformed to black and white",
      scaledTo: "Scaled to {size}",
      compressedLevel: "Compressed ({level})",
      fileDuplicated: "File duplicated",
      processingProgress: "Processing {current} of {total}…",
      bulkSummaryFile: "{verb}: {count} file",
      bulkSummaryFiles: "{verb}: {count} files",
      bulkFailed: "{verb} failed",
      bulkFailedAllFile: "{verb} failed for all {count} file",
      bulkFailedAllFiles: "{verb} failed for all {count} files",
      bulkPartial: "{verb}: {ok} succeeded, {failed} failed",
      onlyRasterScaled: "Only raster images can be scaled.",
      onlyRasterRotated: "Only raster images can be rotated.",
      rotated: "Rotated",
      onlyRasterConvertedJpg: "Only raster images can be converted to JPG.",
      onlyRasterTransformed: "Only raster images can be transformed.",
      transformed: "Transformed",
      onlyRasterCompressed: "Only raster images can be compressed.",
      duplicated: "Duplicated",
      renamePromptSingle:
        "Rename file using letters, numbers, and hyphens. Keep the existing extension.",
      renamePromptMultiple:
        "Rename {count} files. Enter a base name; files will be named base-1, base-2, etc.",
      renameCancelled: "Rename cancelled",
      renamed: "Renamed",
      selectedFilesCount: "{count} selected files",
      deleteConfirm: "Delete {label}? This cannot be undone.",
      deleted: "Deleted",
      bulkOverwriteConfirm:
        "{action} {count} files? This replaces the original files and cannot be undone.",
      actionScale: "Scale",
      actionRotate: "Rotate",
      actionTransform: "Transform",
      actionConvertJpg: "Convert to JPG",
      actionCompress: "Compress",
      noPublicUrl: "No public URL available for the selected file(s).",
      unableToEmbed: "Unable to embed: no active page editor found.",
      insertedSkipped:
        "Inserted {count} file(s); skipped {skipped} without a public URL.",
      insertedIntoPage: "Inserted {count} file(s) into page",
      type: "Type",
      extension: "Extension",
      extensionPlaceholder: "e.g. png",
      nameContains: "Name contains",
      nameContainsPlaceholder: "filename…",
      perPage: "Per page",
      refresh: "Refresh",
      refreshFileList: "Refresh file list",
      loading: "Loading…",
      filesPagination: "Files pagination",
      noFilesFound: "No files found.",
      selectAllFiles: "Select all files",
      preview: "Preview",
      file: "File",
      size: "Size",
      updated: "Updated",
      selectFile: "Select {name}",
      copyPath: "Copy path",
      pathCopied: "Path copied",
      embedInPage: "Embed in page",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../locales/", import.meta.url).href,
    });
    this.rows = [];
    this.loading = false;
    this.busy = false;
    this.errorMessage = "";
    this.siteName = "";
    this.method = "POST";
    this.nodeId = "";
    this.scalePreset = "md";
    this.cacheBustToken = "0";
    this.__cacheBustCounter = 0;
    this.pageLimit = 25;
    this.pageOffset = 0;
    this.pageTotal = 0;
    this.filterType = "";
    this.filterExtension = "";
    this.filterNameContains = "";
    this.bulkBusy = false;
    this.selectedRows = new Set();
    this.__disposer = [];
    this.__boundFileAction = this._onFileAction.bind(this);
    this.__filterDebounceTimer = null;
    this.__boundTableClick = this._handleTableClick.bind(this);
    this.__boundTableChange = this._handleTableChange.bind(this);
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: flex;
          flex-direction: column;
          min-width: min(80vw, 1100px);
          max-height: calc(
            var(--simple-modal-height, 80vh) - var(
                --simple-modal-titlebar-height,
                80px
              ) - var(--ddd-spacing-8, 32px)
          );
          overflow: hidden;
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }
        .shell {
          padding: var(--ddd-spacing-4);
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-3);
          min-height: 0;
          flex: 1;
        }
        .panel {
          border: var(--ddd-border-size-sm) solid
            var(--ddd-theme-default-limestoneGray);
          border-radius: var(--ddd-radius-md);
          padding: var(--ddd-spacing-2);
        }
        .upload-row {
          display: flex;
          flex-wrap: wrap;
          flex-direction: column;
          gap: var(--ddd-spacing-3);
          align-items: start;
        }
        .upload-main {
          width: 100%;
        }
        .upload-main hax-upload-field {
          display: block;
        }
        .ctrl {
          display: flex;
          align-items: center;
        }
        .toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-2);
          align-items: center;
        }
        .toolbar simple-fields-field {
          --simple-fields-font-size: var(--ddd-font-size-5xs);
          --simple-fields-select-max-width: 140px;
          margin: 0;
        }
        .helper {
          font-size: var(--ddd-font-size-5xs);
          color: var(--ddd-theme-default-slateGray);
        }
        .status {
          font-size: var(--ddd-font-size-4xs);
          min-height: 1.2em;
        }
        .status.error {
          color: var(--ddd-theme-default-error);
        }
        .tw {
          border: var(--ddd-border-size-sm) solid
            var(--ddd-theme-default-limestoneGray);
          border-radius: var(--ddd-radius-md);
          overflow: auto;
          flex: 1;
          min-height: 0;
        }
        editable-table-display {
          --ddd-theme-body-font-size: var(--ddd-font-size-6xs);
          --editable-table-font-family: var(--ddd-font-navigation);
          --editable-table-font-size: var(--ddd-font-size-6xs);
          margin: 0;
        }
        simple-pager {
          --simple-pager-font-size: var(--ddd-font-size-6xs);
          margin: 0;
          padding: var(--ddd-spacing-3) 0;
        }
        .table-scroll {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .table-scroll editable-table-display {
          display: block;
          min-width: 760px;
        }
        table {
          width: 100%;
          min-width: 900px;
          border-collapse: collapse;
          font-size: var(--ddd-font-size-4xs);
        }
        thead th {
          text-align: left;
          padding: var(--ddd-spacing-2);
          border-bottom: var(--ddd-border-size-xs) solid
            var(--ddd-theme-default-limestoneGray);
          background: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-coalyGray)
          );
          position: sticky;
          top: 0;
          z-index: 1;
        }
        td {
          padding: var(--ddd-spacing-2);
          border-bottom: var(--ddd-border-size-xs) solid
            var(--ddd-theme-default-limestoneGray);
          vertical-align: middle;
        }
        tr:last-child td {
          border-bottom: none;
        }
        .pw {
          width: 200px;
          max-width: 200px;
          height: 100px;
          max-height: 100px;
          border-radius: var(--ddd-radius-sm);
          border: var(--ddd-border-size-xs) solid
            var(--ddd-theme-default-limestoneGray);
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .pw img {
          width: 100%;
          height: 100%;
          max-width: 200px;
          max-height: 100px;
          object-fit: cover;
          display: block;
        }
        td.pw-col {
          max-width: 200px;
        }
        th:first-child,
        td:first-child {
          width: var(--ddd-spacing-6);
          text-align: center;
        }
        .fn {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
        }
        .fn a {
          text-decoration: none;
          overflow-wrap: anywhere;
        }
        .fp {
          font-size: var(--ddd-font-size-6xs);
          margin-top: var(--ddd-spacing-1);
          overflow-wrap: anywhere;
        }
        .ib {
          --simple-icon-button-border-radius: var(--ddd-radius-sm);
          --simple-icon-button-border: var(--ddd-border-size-xs) solid
            var(--ddd-theme-default-limestoneGray);
          --simple-icon-button-focus-border: var(--ddd-border-size-xs) solid
            light-dark(
              var(--ddd-theme-default-nittanyNavy),
              var(--ddd-theme-default-linkLight)
            );
          --simple-icon-height: var(--ddd-icon-xxs);
          --simple-icon-width: var(--ddd-icon-xxs);
          padding: var(--ddd-spacing-2);
        }
        .empty {
          padding: var(--ddd-spacing-4);
        }
        @media (max-width: 900px) {
          :host {
            min-width: 0;
            width: 100%;
          }
          .upload-row {
            flex-direction: column;
          }
        }
      `,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("hax-file-action", this.__boundFileAction);
    this.__disposer.push(
      autorun(() => {
        const _mobx_val_0 = toJS(store.manifest);
        Promise.resolve().then(() => {
          const m = _mobx_val_0;
          if (m && m.metadata && m.metadata.site && m.metadata.site.name) {
            this.siteName = m.metadata.site.name;
          }
        });
      }),
    );
    this.__disposer.push(
      autorun(() => {
        const _mobx_val_0 = toJS(store.activeItem);
        Promise.resolve().then(() => {
          const ai = _mobx_val_0;
          if (ai && ai.id) {
            this.nodeId = ai.id;
          }
        });
      }),
    );
    // JWT is handled by MicroFrontendRegistry via Authorization header; no body injection needed
    this.refreshFiles();
  }

  disconnectedCallback() {
    this.removeEventListener("hax-file-action", this.__boundFileAction);
    if (this.__filterDebounceTimer) {
      clearTimeout(this.__filterDebounceTimer);
      this.__filterDebounceTimer = null;
    }
    for (let i in this.__disposer) {
      const d = this.__disposer[i];
      if (typeof d === "function") {
        d();
      } else if (d && typeof d.dispose === "function") {
        d.dispose();
      }
    }
    this.__disposer = [];
    super.disconnectedCallback();
  }

  updated(cp) {
    if (super.updated) {
      super.updated(cp);
    }
    if (cp.has("siteName") && this._canList) {
      this.pageOffset = 0;
      this.refreshFiles();
    }
    if (cp.has("busy") && cp.get("busy") === true && !this.busy) {
      this._reloadTableDisplay();
    }
    this._wireTableDelegate();
    if (cp.has("rows") || cp.has("selectedRows")) {
      setTimeout(() => this._syncVisibleCheckboxes(), 0);
    }
  }

  get _canList() {
    return this.siteName !== "";
  }
  get _canUpload() {
    return this.siteName !== "" && this.nodeId !== "";
  }
  get _canOp() {
    return this.siteName !== "";
  }

  _s(v) {
    return typeof v === "string" ? v.trim() : "";
  }

  _normPath(v) {
    const c = this._s(v).replace(/\\/g, "/");
    if (!c) return "";
    if (c.indexOf("files/") === 0) return c;
    const i = c.toLowerCase().indexOf("/files/");
    if (i !== -1) return c.substring(i + 1);
    const j = c.toLowerCase().indexOf("files/");
    if (j !== -1) return c.substring(j);
    return c;
  }

  _baseName(v) {
    const c = this._s(v).split("?")[0];
    if (!c) return "";
    const p = c.split("/");
    return p.length ? p[p.length - 1] : c;
  }
  _nameWithoutExt(v) {
    const c = this._s(v);
    if (!c) return "";
    const i = c.lastIndexOf(".");
    if (i <= 0) return c;
    return c.substring(0, i);
  }
  _dateMs(v) {
    if (typeof v === "number" && Number.isFinite(v) && v > 0) {
      const normalized = v < 1000000000000 ? v * 1000 : v;
      const d = new Date(normalized);
      return Number.isNaN(d.getTime()) ? 0 : normalized;
    }
    if (typeof v !== "string") return 0;
    const c = v.trim();
    if (!c) return 0;
    if (/^[0-9]+$/.test(c)) {
      const i = parseInt(c, 10);
      if (!Number.isNaN(i) && i > 0) {
        const normalized = i < 1000000000000 ? i * 1000 : i;
        const d = new Date(normalized);
        return Number.isNaN(d.getTime()) ? 0 : normalized;
      }
    }
    const d = new Date(c);
    if (Number.isNaN(d.getTime())) return 0;
    return d.getTime();
  }
  _dateValue(v) {
    const ms = this._dateMs(v);
    if (!ms) return "";
    return new Date(ms).toISOString();
  }
  _fmtDate(v) {
    const i = this._dateValue(v);
    if (!i) return "\u2014";
    return i.replace("T", " ").replace("Z", " UTC");
  }
  _fmtRelativeDate(v) {
    const ms = this._dateMs(v);
    if (!ms) return "—";
    const nowMs = Date.now();
    let delta = Math.floor((nowMs - ms) / 1000);
    if (delta < 0) {
      delta = 0;
    }
    const month = 2592000;
    const day = 86400;
    const hour = 3600;
    const minute = 60;
    if (delta >= month) {
      const months = Math.floor(delta / month);
      return this.t.timeAgo.replace(
        "{time}",
        () => `${months} ${months === 1 ? this.t.month : this.t.months}`,
      );
    }
    if (delta >= day) {
      const days = Math.floor(delta / day);
      return this.t.timeAgo.replace(
        "{time}",
        () => `${days} ${days === 1 ? this.t.day : this.t.days}`,
      );
    }
    if (delta >= hour) {
      const hours = Math.floor(delta / hour);
      const minutes = Math.floor((delta % hour) / minute);
      if (minutes > 0) {
        return this.t.timeAgo.replace(
          "{time}",
          () =>
            `${hours} ${hours === 1 ? this.t.hour : this.t.hours} ${minutes} ${minutes === 1 ? this.t.minute : this.t.minutes}`,
        );
      }
      return this.t.timeAgo.replace(
        "{time}",
        () => `${hours} ${hours === 1 ? this.t.hour : this.t.hours}`,
      );
    }
    if (delta >= minute) {
      const minutes = Math.floor(delta / minute);
      const seconds = Math.floor(delta % minute);
      return this.t.timeAgo.replace(
        "{time}",
        () =>
          `${minutes} ${minutes === 1 ? this.t.minute : this.t.minutes} ${seconds} ${seconds === 1 ? this.t.second : this.t.seconds}`,
      );
    }
    return this.t.timeAgo.replace(
      "{time}",
      () => `${delta} ${delta === 1 ? this.t.second : this.t.seconds}`,
    );
  }

  _mime(v) {
    const ext = this._s(v).toLowerCase().split("?")[0].split(".").pop();
    const m = {
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      gif: "image/gif",
      webp: "image/webp",
      svg: "image/svg+xml",
      avif: "image/avif",
      bmp: "image/bmp",
      tif: "image/tiff",
      tiff: "image/tiff",
      mp4: "video/mp4",
      webm: "video/webm",
      mov: "video/quicktime",
      mp3: "audio/mpeg",
      wav: "audio/wav",
      m4a: "audio/mp4",
      pdf: "application/pdf",
    };
    return ext && m[ext] ? m[ext] : "";
  }

  _sz(v) {
    if (typeof v === "number") return v;
    if (typeof v === "string" && v) {
      const n = parseInt(v, 10);
      return Number.isNaN(n) ? 0 : n;
    }
    return 0;
  }

  _fmtBytes(s) {
    let v = this._sz(s);
    if (!v) return "\u2014";
    const u = ["B", "KB", "MB", "GB"];
    let i = 0;
    while (v >= 1024 && i < u.length - 1) {
      v /= 1024;
      i++;
    }
    return `${v.toFixed(v >= 10 || i === 0 ? 0 : 1)} ${u[i]}`;
  }

  _pubUrl(row) {
    const f = this._s(row.fullUrl || "");
    if (f) {
      if (f.indexOf("http") === 0 || f.indexOf("/") === 0) return f;
      return "/" + f.replace(/^\/+/, "");
    }
    const p = this._s(row.path || "");
    return p ? "/" + p.replace(/^\/+/, "") : "";
  }

  _normItem(item, idx) {
    if (!item || typeof item !== "object") return null;
    const p = this._normPath(item.path || item.url || item.file || "");
    if (!p || p.indexOf("files/") !== 0) return null;
    const mt =
      this._s(item.mimetype || item.type || item.mimeType) || this._mime(p);
    const updatedValue =
      item.updated ||
      item.dateUpdated ||
      item.modified ||
      item.lastModified ||
      item.mtime ||
      item.dateCreated ||
      item.created ||
      "";
    const r = {
      id: this._s(item.id) || `${p}-${idx}`,
      path: p,
      uuid: this._s(item.uuid || item.fileUuid || item.id || ""),
      fullUrl: this._s(item.fullUrl || ""),
      name: this._s(item.name) || this._baseName(p),
      mimetype: mt,
      size: this._sz(item.size),
      updated: this._dateValue(updatedValue),
      dateCreated: this._dateValue(item.dateCreated || item.created || ""),
    };
    r.publicUrl = this._pubUrl(r);
    return r;
  }

  _normPayload(d) {
    const arr = d && d.data && Array.isArray(d.data.files) ? d.data.files : [];
    const rows = [];
    arr.forEach((it, i) => {
      const n = this._normItem(it, i);
      if (n) rows.push(n);
    });
    rows.sort((a, b) => a.path.localeCompare(b.path));
    return rows;
  }

  _readPageTotal(response) {
    const data = response && response.data ? response.data : null;
    if (!data) {
      return 0;
    }
    if (typeof data.total === "number") {
      return data.total;
    }
    if (data.page && typeof data.page.total === "number") {
      return data.page.total;
    }
    return 0;
  }

  _onPageChanged(e) {
    if (!e || !e.detail) {
      return;
    }
    this.pageLimit = e.detail.limit;
    this.pageOffset = e.detail.offset;
    this.refreshFiles();
  }

  _debounceFilterRefresh() {
    if (this.__filterDebounceTimer) {
      clearTimeout(this.__filterDebounceTimer);
    }
    this.__filterDebounceTimer = setTimeout(() => {
      this.__filterDebounceTimer = null;
      this.pageOffset = 0;
      this.refreshFiles();
    }, 400);
  }
  _onFilterTypeChanged(e) {
    const value =
      e && e.detail && typeof e.detail.value === "string"
        ? e.detail.value.trim()
        : "";
    if (value === this.filterType) return;
    this.filterType = value;
    this._debounceFilterRefresh();
  }
  _onFilterExtensionChanged(e) {
    const value =
      e && e.detail && typeof e.detail.value === "string"
        ? e.detail.value.trim()
        : "";
    if (value === this.filterExtension) return;
    this.filterExtension = value;
    this._debounceFilterRefresh();
  }
  _onFilterNameContainsChanged(e) {
    const value =
      e && e.detail && typeof e.detail.value === "string"
        ? e.detail.value.trim()
        : "";
    if (value === this.filterNameContains) return;
    this.filterNameContains = value;
    this._debounceFilterRefresh();
  }
  _onFilterKeydown(e, propName) {
    if (e && e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      if (this[propName]) {
        this[propName] = "";
        this._debounceFilterRefresh();
      }
    }
  }
  _onPageSizeChanged(e) {
    const raw =
      e && e.detail && typeof e.detail.value === "string"
        ? e.detail.value.trim()
        : "";
    const parsed = parseInt(raw, 10);
    const next = PAGE_SIZE_OPTIONS.includes(parsed) ? parsed : 25;
    if (next === this.pageLimit) return;
    this.pageLimit = next;
    this.pageOffset = 0;
    this.refreshFiles();
  }

  _isImg(r) {
    return (
      r &&
      typeof r.mimetype === "string" &&
      r.mimetype.toLowerCase().indexOf("image/") === 0
    );
  }
  _canScale(r) {
    return this._isImg(r) && r.mimetype.toLowerCase().indexOf("svg") === -1;
  }
  _canConvertToJpg(r) {
    return this._canScale(r);
  }

  async _rj(resp) {
    try {
      return await resp.json();
    } catch {
      return null;
    }
  }
  _em(resp, d, fb) {
    // backend message, translated by its code when possible (issues#3157)
    const apiText = haxcmsApiMessage(d, "");
    if (apiText) return apiText;
    if (resp && resp.status) return `${fb} (${resp.status})`;
    return fb;
  }
  _requestTableUpdate() {
    if (!this.shadowRoot) return;
    const tableDisplay = this.shadowRoot.querySelector(
      "editable-table-display",
    );
    if (tableDisplay && typeof tableDisplay.requestUpdate === "function") {
      tableDisplay.requestUpdate();
    }
  }
  _reloadTableDisplay() {
    if (!this.shadowRoot) return;
    const tableDisplay = this.shadowRoot.querySelector(
      "editable-table-display",
    );
    if (tableDisplay && typeof tableDisplay.loadSlottedTable === "function") {
      tableDisplay.loadSlottedTable();
    }
  }
  _nextCacheBustToken() {
    this.__cacheBustCounter += 1;
    return `${Date.now()}-${this.__cacheBustCounter}`;
  }
  _withCacheBust(url, token = this.cacheBustToken) {
    const cleanUrl = this._s(url);
    const cleanToken = this._s(token);
    if (!cleanUrl || !cleanToken) return cleanUrl;
    if (/[?&]cb=/.test(cleanUrl)) {
      return cleanUrl.replace(/([?&])cb=[^&]*/g, `$1cb=${cleanToken}`);
    }
    return `${cleanUrl}${cleanUrl.indexOf("?") === -1 ? "?" : "&"}cb=${cleanToken}`;
  }
  _previewUrl(row) {
    if (!row || !row.publicUrl) return "";
    return this._withCacheBust(row.publicUrl, this.cacheBustToken);
  }
  _statusCode(response) {
    if (!response || typeof response !== "object") return 0;
    if (typeof response.status === "number") return response.status;
    if (typeof response.status === "string") {
      const parsed = parseInt(response.status, 10);
      return Number.isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }
  _messageFromResponse(response, fallbackMessage) {
    if (!response || typeof response !== "object") return fallbackMessage;
    const apiText = haxcmsApiMessage(response, "");
    if (apiText) return apiText;
    const status = this._statusCode(response);
    if (status > 0) {
      return `${fallbackMessage} (${status})`;
    }
    return fallbackMessage;
  }
  _rowsRenderKey() {
    return `${this.cacheBustToken}|${this.rows.length}|${this.rows
      .map(
        (row) =>
          `${row.path}:${row.updated || row.dateCreated || ""}:${row.size || 0}`,
      )
      .join("|")}`;
  }

  async refreshFiles() {
    if (!this._canList) return;
    const cacheBustToken = this._nextCacheBustToken();
    this.cacheBustToken = cacheBustToken;
    this._requestTableUpdate();
    this.loading = true;
    this.errorMessage = "";
    try {
      await waitForHAXCMSSiteApiRegistryReady();
      if (
        !MicroFrontendRegistry ||
        typeof MicroFrontendRegistry.call !== "function" ||
        typeof MicroFrontendRegistry.has !== "function" ||
        !MicroFrontendRegistry.has("@site/listFiles")
      ) {
        this.errorMessage = this.t.unableToLoadFiles;
        this.rows = [];
        this.pageTotal = 0;
        return;
      }
      const params = {
        cb: cacheBustToken,
        "page.limit": this.pageLimit,
        "page.offset": this.pageOffset,
      };
      if (this.filterType) {
        params["filter.type"] = this.filterType;
      }
      if (this.filterExtension) {
        params["filter.extension"] = this.filterExtension;
      }
      if (this.filterNameContains) {
        params["filter.nameContains"] = this.filterNameContains;
      }
      const response = await MicroFrontendRegistry.call(
        "@site/listFiles",
        params,
        null,
        this,
      );
      const status = this._statusCode(response);
      if (status !== 200) {
        this.errorMessage = this._messageFromResponse(
          response,
          this.t.unableToLoadFiles,
        );
        this.rows = [];
        this.pageTotal = 0;
        return;
      }
      this.pageTotal = this._readPageTotal(response);
      this.rows = this._normPayload(response);
      this.selectedRows = new Set();
    } catch {
      this.errorMessage = this.t.unableToLoadFiles;
      this.rows = [];
      this.pageTotal = 0;
    } finally {
      this.loading = false;
      this._requestTableUpdate();
    }
  }

  _onHaxUploadValueChanged(e) {
    const value =
      e && e.detail && typeof e.detail.value === "string" ? e.detail.value : "";
    if (!value) return;
    this.errorMessage = "";
    this._msg(this.t.uploadComplete);
    this.refreshFiles();
  }

  _rowKey(row) {
    return row ? this._s(row.uuid || row.id || row.path) : "";
  }
  _isRowSelected(row) {
    return this.selectedRows.has(this._rowKey(row));
  }
  _toggleRowSelected(row, checked) {
    const key = this._rowKey(row);
    if (!key) return;
    const next = new Set(this.selectedRows);
    if (checked) {
      next.add(key);
    } else {
      next.delete(key);
    }
    this.selectedRows = next;
  }
  _toggleSelectAll(checked) {
    if (checked) {
      this.selectedRows = new Set(this.rows.map((r) => this._rowKey(r)));
    } else {
      this.selectedRows = new Set();
    }
  }
  _selectedRowObjects() {
    return this.rows.filter((r) => this.selectedRows.has(this._rowKey(r)));
  }
  _rowByKey(key) {
    const k = this._s(key);
    if (!k) return null;
    return this.rows.find((r) => this._rowKey(r) === k) || null;
  }
  _toggleRowSelectedByKey(key, checked) {
    const k = this._s(key);
    if (!k) return;
    const next = new Set(this.selectedRows);
    if (checked) {
      next.add(k);
    } else {
      next.delete(k);
    }
    this.selectedRows = next;
  }
  _actionTargetFromEvent(e) {
    const path =
      e && typeof e.composedPath === "function" ? e.composedPath() : [];
    for (let i = 0; i < path.length; i++) {
      const candidate = path[i];
      if (
        candidate &&
        typeof candidate.getAttribute === "function" &&
        candidate.getAttribute("data-action")
      ) {
        return candidate;
      }
    }
    return null;
  }
  _tableStyleText() {
    return `
      th[cell-index="0"],
      td[cell-index="0"] {
        width: var(--ddd-spacing-6);
        text-align: center;
      }
      .pw {
        width: 200px;
        max-width: 200px;
        height: 100px;
        max-height: 100px;
        border-radius: var(--ddd-radius-sm);
        border: var(--ddd-border-size-xs) solid
          var(--ddd-theme-default-limestoneGray);
        overflow: hidden;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .pw img {
        width: 200px;
        height: 100px;
        max-width: 200px;
        max-height: 100px;
        object-fit: cover;
        display: block;
      }
      .fn {
        display: flex;
        align-items: center;
        gap: var(--ddd-spacing-1);
      }
      .fn a {
        text-decoration: none;
        overflow-wrap: anywhere;
      }
      .fp {
        font-size: var(--ddd-font-size-6xs);
        margin-top: var(--ddd-spacing-1);
        overflow-wrap: anywhere;
      }
      .ib {
        --simple-icon-button-border-radius: var(--ddd-radius-sm);
        --simple-icon-button-border: var(--ddd-border-size-xs) solid
          var(--ddd-theme-default-limestoneGray);
        --simple-icon-button-focus-border: var(--ddd-border-size-xs) solid
          light-dark(var(--ddd-theme-default-nittanyNavy), var(--ddd-theme-default-linkLight));
        --simple-icon-button-height: var(--ddd-icon-xxs);
        --simple-icon-button-width: var(--ddd-icon-xxs);
        padding: var(--ddd-spacing-2);
      }
    `;
  }
  _wireTableDelegate() {
    if (!this.shadowRoot) return;
    const td = this.shadowRoot.querySelector("editable-table-display");
    if (!td || !td.shadowRoot) return;
    if (!td.__filesDelegateWired) {
      td.__filesDelegateWired = true;
      td.shadowRoot.addEventListener("click", this.__boundTableClick);
      td.shadowRoot.addEventListener("change", this.__boundTableChange);
    }
    if (!td.__filesStyleInjected) {
      td.__filesStyleInjected = true;
      const style = globalThis.document.createElement("style");
      style.setAttribute("data-files-table", "");
      style.textContent = this._tableStyleText();
      td.shadowRoot.appendChild(style);
    }
  }
  _handleTableClick(e) {
    const target = this._actionTargetFromEvent(e);
    if (!target) return;
    const action = target.getAttribute("data-action");
    if (action === "embed") {
      if (typeof e.stopPropagation === "function") {
        e.stopPropagation();
      }
      const row = this._rowByKey(target.getAttribute("data-row-key"));
      if (row) this._embedInPage(row);
      return;
    }
    if (action === "select-all" || action === "select-row") {
      this._applySelection(target, action);
    }
  }
  _handleTableChange(e) {
    const target = this._actionTargetFromEvent(e);
    if (!target) return;
    const action = target.getAttribute("data-action");
    if (action === "select-all" || action === "select-row") {
      this._applySelection(target, action);
    }
  }
  _applySelection(target, action) {
    if (action === "select-all") {
      this._toggleSelectAll(target.checked);
    } else {
      this._toggleRowSelectedByKey(
        target.getAttribute("data-row-key"),
        target.checked,
      );
    }
    this._syncVisibleCheckboxes();
  }
  _syncVisibleCheckboxes() {
    const td =
      this.shadowRoot &&
      this.shadowRoot.querySelector("editable-table-display");
    if (!td || !td.shadowRoot) return;
    const allBox = td.shadowRoot.querySelector(
      'input[data-action="select-all"]',
    );
    if (allBox) {
      allBox.checked =
        this.rows.length > 0 && this.selectedRows.size === this.rows.length;
    }
    const rowBoxes = td.shadowRoot.querySelectorAll(
      'input[data-action="select-row"]',
    );
    rowBoxes.forEach((box) => {
      box.checked = this.selectedRows.has(
        this._s(box.getAttribute("data-row-key")),
      );
    });
  }

  _onFileAction(e) {
    if (!e || !e.detail || this.busy) return;
    const selected = this._selectedRowObjects();
    if (selected.length === 0) return;
    const action = e.detail.action;
    const value = typeof e.detail.value === "string" ? e.detail.value : "";
    if (action === "scale") {
      this._onBulkScale(selected, value);
    } else if (action === "rotate") {
      this._onBulkRotate(selected);
    } else if (action === "transform") {
      this._onBulkTransform(selected, value);
    } else if (action === "compress") {
      this._onBulkCompress(selected, value);
    } else if (action === "duplicate") {
      this._onBulkDuplicate(selected);
    } else if (action === "rename") {
      this._onBulkRename(selected);
    } else if (action === "delete") {
      this._onBulkDelete(selected);
    } else if (action === "insert") {
      this._onBulkInsert(selected, value);
    }
  }
  async _op(row, op, options = {}) {
    const silent = !!(options && options.silent);
    const skipRefresh = !!(options && options.skipRefresh);
    if (!this._canOp) {
      if (!silent) this._msg(this.t.unableToRunFileOperation, true);
      return { ok: false, message: this.t.unableToRunFileOperation };
    }
    if (!silent) this.busy = true;
    this.errorMessage = "";
    try {
      const fileUuid = this._s(row && row.uuid ? row.uuid : "");
      if (!fileUuid) {
        this.errorMessage = this.t.fileUuidMissing;
        if (!silent) this._msg(this.errorMessage, true);
        return { ok: false, message: this.errorMessage };
      }
      await waitForHAXCMSSiteApiRegistryReady();
      const operationName =
        op === "delete" ? "@site/deleteFileByUuid" : "@site/updateFileByUuid";
      if (
        !MicroFrontendRegistry ||
        typeof MicroFrontendRegistry.call !== "function" ||
        typeof MicroFrontendRegistry.has !== "function" ||
        !MicroFrontendRegistry.has(operationName)
      ) {
        this.errorMessage = this.t.fileOperationEndpointUnavailable;
        if (!silent) this._msg(this.errorMessage, true);
        return { ok: false, message: this.errorMessage };
      }
      const params = { fileUuid };
      if (op !== "delete") {
        params.operation = op;
      }
      if (options && typeof options.size === "string" && options.size) {
        params.size = options.size;
      }
      if (options && typeof options.newName === "string" && options.newName) {
        params.newName = options.newName;
      }
      if (options && typeof options.level === "string" && options.level) {
        params.level = options.level;
      }
      const d = await MicroFrontendRegistry.call(
        operationName,
        params,
        null,
        this,
      );
      const status = this._statusCode(d);
      if (status !== 200) {
        this.errorMessage = this._messageFromResponse(
          d,
          this.t.fileOperationFailed,
        );
        if (!silent) this._msg(this.errorMessage, true);
        return { ok: false, message: this.errorMessage };
      }
      let message = this.t.fileOperationComplete;
      if (op === "delete") message = this.t.fileDeleted;
      else if (op === "rename") message = this.t.fileRenamed;
      else if (op === "convert-jpg") message = this.t.imageConvertedToJpg;
      else if (op === "rotate-90") message = this.t.imageRotated90;
      else if (op === "sepia") message = this.t.imageTransformedSepia;
      else if (op === "black-and-white")
        message = this.t.imageTransformedBlackAndWhite;
      else if (op === "scale" && options && options.size)
        message = this.t.scaledTo.replace("{size}", () => options.size);
      else if (op === "compress" && options && options.level)
        message = this.t.compressedLevel.replace(
          "{level}",
          () => options.level,
        );
      else if (op === "duplicate") message = this.t.fileDuplicated;
      if (!silent) this._msg(message);
      if (!skipRefresh) await this.refreshFiles();
      return { ok: true, message };
    } catch {
      this.errorMessage = this.t.fileOperationFailed;
      if (!silent) this._msg(this.errorMessage, true);
      return { ok: false, message: this.errorMessage };
    } finally {
      if (!silent) this.busy = false;
    }
  }

  /**
   * Runs `opFn` sequentially against each row in `rows`, aggregating
   * success/failure counts. For multi-row batches a live "Processing N of M"
   * toast updates as each file is processed (the toast just presents the
   * text; the counting lives here per #3050). When opts.refreshMedia is true,
   * each successful image op also fires HAXStore.refreshMediaSource so every
   * place in the active page currently displaying that file re-fetches the
   * fresh bytes without a page reload.
   */
  async _runBulkOp(rows, opFn, summaryVerb, opts = {}) {
    if (!rows || rows.length === 0) return;
    const refreshMedia = !!(opts && opts.refreshMedia);
    const multi = rows.length > 1;
    this.busy = true;
    this.bulkBusy = true;
    this.errorMessage = "";
    let okCount = 0;
    let failCount = 0;
    let lastError = "";
    try {
      for (let idx = 0; idx < rows.length; idx++) {
        const row = rows[idx];
        if (multi) {
          this._msg(
            this.t.processingProgress
              .replace("{current}", () => idx + 1)
              .replace("{total}", () => rows.length),
          );
        }
        const result = await opFn(row, idx);
        if (result && result.ok) {
          okCount++;
          if (
            refreshMedia &&
            this._isImg(row) &&
            HAXStore &&
            typeof HAXStore.refreshMediaSource === "function"
          ) {
            HAXStore.refreshMediaSource(
              row.publicUrl || row.fullUrl || row.path || "",
            );
          }
        } else {
          failCount++;
          const resultText = haxcmsApiMessage(result, "");
          if (resultText) lastError = resultText;
        }
      }
      await this.refreshFiles();
      if (failCount === 0) {
        this._msg(
          (okCount === 1 ? this.t.bulkSummaryFile : this.t.bulkSummaryFiles)
            .replace("{verb}", () => summaryVerb)
            .replace("{count}", () => okCount),
        );
      } else if (okCount === 0) {
        this.errorMessage =
          lastError || this.t.bulkFailed.replace("{verb}", () => summaryVerb);
        this._msg(
          (failCount === 1
            ? this.t.bulkFailedAllFile
            : this.t.bulkFailedAllFiles
          )
            .replace("{verb}", () => summaryVerb)
            .replace("{count}", () => failCount),
          true,
        );
      } else {
        this._msg(
          this.t.bulkPartial
            .replace("{verb}", () => summaryVerb)
            .replace("{ok}", () => okCount)
            .replace("{failed}", () => failCount),
          true,
        );
      }
    } finally {
      this.busy = false;
      this.bulkBusy = false;
    }
  }

  /**
   * Confirm in-place bulk operations (scale, rotate, transform, compress) that
   * overwrite the original files. Single-file actions are not prompted.
   * Native confirm matches the delete flow: focus is trapped, Escape cancels
   * and the cancel action is the default.
   */
  _confirmBulkOverwrite(count, actionLabel) {
    if (count < 2) return true;
    return !!globalThis.confirm(
      this.t.bulkOverwriteConfirm
        .replace("{action}", () => actionLabel)
        .replace("{count}", () => count),
    );
  }
  async _onBulkScale(rows, size) {
    const normalizedSize = typeof size === "string" ? size.trim() : "";
    if (!normalizedSize || !SCALE_PRESETS[normalizedSize]) return;
    const scalable = rows.filter((r) => this._canScale(r));
    if (scalable.length === 0) {
      this._msg(this.t.onlyRasterScaled, true);
      return;
    }
    if (!this._confirmBulkOverwrite(scalable.length, this.t.actionScale))
      return;
    this.scalePreset = normalizedSize;
    await this._runBulkOp(
      scalable,
      (row) =>
        this._op(row, "scale", {
          size: normalizedSize,
          silent: true,
          skipRefresh: true,
        }),
      this.t.scaledTo.replace("{size}", () => normalizedSize),
      { refreshMedia: true },
    );
  }
  async _onBulkRotate(rows) {
    const scalable = rows.filter((r) => this._canScale(r));
    if (scalable.length === 0) {
      this._msg(this.t.onlyRasterRotated, true);
      return;
    }
    if (!this._confirmBulkOverwrite(scalable.length, this.t.actionRotate))
      return;
    await this._runBulkOp(
      scalable,
      (row) => this._op(row, "rotate-90", { silent: true, skipRefresh: true }),
      this.t.rotated,
      { refreshMedia: true },
    );
  }
  async _onBulkTransform(rows, op) {
    const normalizedOp = typeof op === "string" ? op.trim() : "";
    if (!normalizedOp) return;
    let applicable;
    if (normalizedOp === "convert-jpg") {
      applicable = rows.filter((r) => this._canConvertToJpg(r));
      if (applicable.length === 0) {
        this._msg(this.t.onlyRasterConvertedJpg, true);
        return;
      }
    } else {
      applicable = rows.filter((r) => this._canScale(r));
      if (applicable.length === 0) {
        this._msg(this.t.onlyRasterTransformed, true);
        return;
      }
    }
    // the op below runs on every selected row, so the count is rows.length
    if (
      !this._confirmBulkOverwrite(
        rows.length,
        normalizedOp === "convert-jpg"
          ? this.t.actionConvertJpg
          : this.t.actionTransform,
      )
    )
      return;
    await this._runBulkOp(
      rows,
      (row) => this._op(row, normalizedOp, { silent: true, skipRefresh: true }),
      this.t.transformed,
      { refreshMedia: true },
    );
  }
  async _onBulkCompress(rows, level) {
    const normalizedLevel = typeof level === "string" ? level.trim() : "";
    if (!normalizedLevel || COMPRESS_LEVELS.indexOf(normalizedLevel) === -1)
      return;
    const compressible = rows.filter((r) => this._canScale(r));
    if (compressible.length === 0) {
      this._msg(this.t.onlyRasterCompressed, true);
      return;
    }
    if (!this._confirmBulkOverwrite(compressible.length, this.t.actionCompress))
      return;
    await this._runBulkOp(
      compressible,
      (row) =>
        this._op(row, "compress", {
          level: normalizedLevel,
          silent: true,
          skipRefresh: true,
        }),
      this.t.compressedLevel.replace("{level}", () => normalizedLevel),
      { refreshMedia: true },
    );
  }
  async _onBulkDuplicate(rows) {
    await this._runBulkOp(
      rows,
      (row) => this._op(row, "duplicate", { silent: true, skipRefresh: true }),
      this.t.duplicated,
    );
  }
  async _onBulkRename(rows) {
    const defaultName =
      rows.length === 1
        ? this._nameWithoutExt(rows[0].name || rows[0].path)
        : "";
    const requestedName = globalThis.prompt(
      rows.length === 1
        ? this.t.renamePromptSingle
        : this.t.renamePromptMultiple.replace("{count}", () => rows.length),
      defaultName,
    );
    if (typeof requestedName !== "string") return;
    const baseName = requestedName.trim();
    if (!baseName) {
      this._msg(this.t.renameCancelled, true);
      return;
    }
    await this._runBulkOp(
      rows,
      (row, idx) => {
        const newName = rows.length === 1 ? baseName : `${baseName}-${idx + 1}`;
        return this._op(row, "rename", {
          newName,
          silent: true,
          skipRefresh: true,
        });
      },
      this.t.renamed,
    );
  }
  async _onBulkDelete(rows) {
    const label =
      rows.length === 1
        ? rows[0].path
        : this.t.selectedFilesCount.replace("{count}", () => rows.length);
    if (
      !globalThis.confirm(this.t.deleteConfirm.replace("{label}", () => label))
    )
      return;
    await this._runBulkOp(
      rows,
      (row) => this._op(row, "delete", { silent: true, skipRefresh: true }),
      this.t.deleted,
    );
  }

  _msg(m, err) {
    if (store && typeof store.toast === "function") {
      store.toast(m, 3000, { hat: "construction", fire: err });
      return;
    }
    if (HAXStore && typeof HAXStore.toast === "function")
      HAXStore.toast(m, 3000, "fit-bottom");
  }

  _embedInPage(row) {
    this._onBulkInsert([row], "standalone");
  }

  /**
   * Bulk-aware insert-into-page. Single file: unchanged behavior (one
   * `insertLogicFromValues` call). Multiple images: caller has already
   * chosen gallery vs. standalone via the hax-file-actions select
   * (`insert:gallery` / `insert:standalone`); mixed/non-image multi
   * selections loop `insertLogicFromValues` once per file.
   */
  _onBulkInsert(rows, mode) {
    const insertable = rows.filter((r) => r && r.publicUrl);
    const skipped = rows.length - insertable.length;
    if (insertable.length === 0) {
      this._msg(this.t.noPublicUrl, true);
      return;
    }
    store.editMode = true;
    globalThis.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {},
      }),
    );
    setTimeout(() => {
      if (!HAXStore.activeHaxBody) {
        this._msg(this.t.unableToEmbed, true);
        return;
      }
      if (mode === "gallery") {
        const innerHTML = insertable
          .map(
            (row) =>
              `<media-image source="${row.publicUrl}" alt="${row.name || ""}"></media-image>`,
          )
          .join("");
        HAXStore.activeHaxBody.haxInsert("image-gallery", innerHTML, {
          mode: "grid",
        });
      } else if (mode === "standalone") {
        // Multiple images as individual media-image elements. haxInsert is
        // loop-safe (the store's own _haxStoreInsertMultiple loops it), so we
        // mirror the gallery path instead of insertLogicFromValues, whose
        // auto-gallery/selection logic is fragile in a tight loop.
        insertable.forEach((row) => {
          HAXStore.activeHaxBody.haxInsert("media-image", "", {
            source: row.publicUrl,
            alt: row.name || "",
          });
        });
      } else {
        // Single file (any type) — gizmo guessing inserts non-image types
        // (PDF, video, audio) via their correct element.
        insertable.forEach((row) => {
          HAXStore.insertLogicFromValues(
            { source: row.publicUrl, title: row.name },
            this,
          );
        });
      }
      if (skipped > 0) {
        this._msg(
          this.t.insertedSkipped
            .replace("{count}", () => insertable.length)
            .replace("{skipped}", () => skipped),
          true,
        );
      } else {
        this._msg(
          this.t.insertedIntoPage.replace("{count}", () => insertable.length),
        );
      }
    }, 300);
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // on by default and we don't need this here
    this.shadowRoot.querySelector("hax-upload-field").showSources = false;
  }

  render() {
    return html`
      <div class="shell">
        <div class="panel">
          <div class="upload-row">
            <div class="upload-main">
              <hax-upload-field
                hide-input
                no-camera
                no-voice-record
                no-screen-record
                ?disabled="${!this._canUpload || this.busy}"
                @value-changed="${this._onHaxUploadValueChanged}"
              >
              </hax-upload-field>
            </div>
            <div class="ctrl">
              <div class="toolbar">
                <simple-fields-field
                  label="${this.t.type}"
                  type="select"
                  .value="${this.filterType}"
                  .itemsList="${FILE_TYPE_FILTER_ITEMS.map((item) => ({
                    value: item.value,
                    text:
                      item.key && this.t[item.key]
                        ? this.t[item.key]
                        : item.text,
                  }))}"
                  ?disabled="${this.busy || !this._canList}"
                  @value-changed="${this._onFilterTypeChanged}"
                >
                </simple-fields-field>
                <simple-fields-field
                  label="${this.t.extension}"
                  type="text"
                  placeholder="${this.t.extensionPlaceholder}"
                  .value="${this.filterExtension}"
                  ?disabled="${this.busy || !this._canList}"
                  @value-changed="${this._onFilterExtensionChanged}"
                  @keydown="${(e) =>
                    this._onFilterKeydown(e, "filterExtension")}"
                >
                </simple-fields-field>
                <simple-fields-field
                  label="${this.t.nameContains}"
                  type="text"
                  placeholder="${this.t.nameContainsPlaceholder}"
                  .value="${this.filterNameContains}"
                  ?disabled="${this.busy || !this._canList}"
                  @value-changed="${this._onFilterNameContainsChanged}"
                  @keydown="${(e) =>
                    this._onFilterKeydown(e, "filterNameContains")}"
                >
                </simple-fields-field>
                <simple-fields-field
                  label="${this.t.perPage}"
                  type="select"
                  .value="${String(this.pageLimit)}"
                  .itemsList="${PAGE_SIZE_OPTIONS.map((size) => ({
                    value: String(size),
                    text: String(size),
                  }))}"
                  ?disabled="${this.busy || !this._canList}"
                  @value-changed="${this._onPageSizeChanged}"
                >
                </simple-fields-field>
                <simple-icon-button-lite
                  class="ib"
                  icon="icons:refresh"
                  label="${this.t.refresh}"
                  title="${this.t.refreshFileList}"
                  ?disabled="${this.loading || !this._canList}"
                  @click="${this.refreshFiles}"
                >
                </simple-icon-button-lite>
              </div>
            </div>
          </div>
          <div
            class="status ${this.errorMessage ? "error" : ""}"
            aria-live="polite"
          >
            ${this.loading
              ? this.t.loading
              : this.errorMessage
                ? this.errorMessage
                : ``}
          </div>

          ${this.selectedRows.size > 0
            ? html`
                <hax-file-actions
                  selected-count="${this.selectedRows.size}"
                  image-count="${this._selectedRowObjects().filter((r) =>
                    this._isImg(r),
                  ).length}"
                  ?busy="${this.busy}"
                  ?can-scale="${this._selectedRowObjects().some((r) =>
                    this._canScale(r),
                  )}"
                >
                </hax-file-actions>
              `
            : ""}
          <simple-pager
            mode="full"
            limit="${this.pageLimit}"
            offset="${this.pageOffset}"
            total="${this.pageTotal}"
            count="${this.rows.length}"
            label="${this.t.filesPagination}"
            @page-changed="${this._onPageChanged}"
          ></simple-pager>
        </div>
        <div class="tw">
          ${this.rows.length === 0 && !this.loading
            ? html`<div class="empty">${this.t.noFilesFound}</div>`
            : keyed(
                this._rowsRenderKey(),
                html`
                  <editable-table-display
                    bordered
                    condensed
                    column-header
                    responsive
                    sort
                    striped
                    scroll
                    sort-column="5"
                    sort-mode="desc"
                  >
                    <table>
                      <thead>
                        <tr>
                          <th>
                            <input
                              type="checkbox"
                              aria-label="${this.t.selectAllFiles}"
                              title="${this.t.selectAllFiles}"
                              data-action="select-all"
                              ?disabled="${this.busy}"
                              ?checked="${this.rows.length > 0 &&
                              this.selectedRows.size === this.rows.length}"
                            />
                          </th>
                          <th>${this.t.preview}</th>
                          <th>${this.t.file}</th>
                          <th>${this.t.type}</th>
                          <th>${this.t.size}</th>
                          <th>${this.t.updated}</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${this.rows.map(
                          (r, _i) => html`
                            <tr>
                              <td>
                                <input
                                  type="checkbox"
                                  aria-label="${this.t.selectFile.replace(
                                    "{name}",
                                    () => r.name,
                                  )}"
                                  data-action="select-row"
                                  data-row-key="${this._rowKey(r)}"
                                  ?disabled="${this.busy}"
                                  ?checked="${this._isRowSelected(r)}"
                                />
                              </td>
                              <td class="pw-col">
                                <span class="pw">
                                  ${this._isImg(r) && r.publicUrl
                                    ? html`<img
                                        src="${this._previewUrl(r)}"
                                        alt="${r.name}"
                                        width="200"
                                        height="100"
                                        loading="lazy"
                                        decoding="async"
                                      />`
                                    : html`—`}
                                </span>
                              </td>
                              <td>
                                <div class="fn">
                                  ${r.publicUrl
                                    ? html`<a
                                        href="${r.publicUrl}"
                                        target="_blank"
                                        rel="noopener"
                                        >${r.name}</a
                                      >`
                                    : html`${r.name}`}
                                  <simple-clipboard-copy-button
                                    class="ib"
                                    label="${this.t.copyPath}"
                                    title="${r.path}"
                                    data-cp="${r.path}"
                                    success-message="${this.t.pathCopied}"
                                  >
                                  </simple-clipboard-copy-button>
                                  <simple-icon-button-lite
                                    class="ib"
                                    icon="hax:embed"
                                    label="${this.t.embedInPage}"
                                    title="${this.t.embedInPage}"
                                    data-action="embed"
                                    data-row-key="${this._rowKey(r)}"
                                  >
                                  </simple-icon-button-lite>
                                </div>
                                <div class="fp">${r.path}</div>
                              </td>
                              <td>${r.mimetype || "\u2014"}</td>
                              <td>${this._fmtBytes(r.size)}</td>
                              <td
                                title="${this._fmtDate(
                                  r.updated || r.dateCreated,
                                )}"
                              >
                                <span
                                  data-sort-value="${this._dateMs(
                                    r.updated || r.dateCreated,
                                  )}"
                                >
                                  ${this._fmtRelativeDate(
                                    r.updated || r.dateCreated,
                                  )}
                                </span>
                              </td>
                            </tr>
                          `,
                        )}
                      </tbody>
                    </table>
                  </editable-table-display>
                `,
              )}
        </div>
      </div>
    `;
  }
}

globalThis.customElements.define(
  HAXCMSFilesAdminDialog.tag,
  HAXCMSFilesAdminDialog,
);
export { HAXCMSFilesAdminDialog };

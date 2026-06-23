import { html, css } from "lit";
import { keyed } from "lit/directives/keyed.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";
import { autorun, toJS } from "mobx";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { waitForHAXCMSSiteApiRegistryReady } from "@haxtheweb/haxcms-elements/lib/core/utils/haxcms-site-api-registry.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-icon/lib/simple-clipboard-copy-button.js";
import "@haxtheweb/hax-body/lib/hax-upload-field.js";
import "@haxtheweb/editable-table/lib/editable-table-display.js";
import "./hax-file-actions.js";

const SCALE_PRESETS = {
  xs: { width: 200, height: 150, label: "ddd-xs  200\u00d7150" },
  sm: { width: 320, height: 240, label: "ddd-sm  320\u00d7240" },
  md: { width: 400, height: 300, label: "ddd-md  400\u00d7300" },
  lg: { width: 800, height: 600, label: "ddd-lg  800\u00d7600" },
  xl: { width: 1200, height: 900, label: "ddd-xl  1200\u00d7900" },
};

class HAXCMSFilesAdminDialog extends DDD {
  static get tag() {
    return "haxcms-files-admin-dialog";
  }
  static get properties() {
    return {
      rows: { type: Array },
      loading: { type: Boolean, reflect: true },
      busy: { type: Boolean, reflect: true },
      errorMessage: { type: String },
      method: { type: String },
      jwt: { type: String },
      siteName: { type: String, attribute: "site-name" },
      nodeId: { type: String, attribute: "node-id" },
      scalePreset: { type: String, attribute: "scale-preset" },
      cacheBustToken: { type: String, attribute: false },
    };
  }

  constructor() {
    super();
    this.rows = [];
    this.loading = false;
    this.busy = false;
    this.errorMessage = "";
    this.jwt = "";
    this.siteName = "";
    this.method = "POST";
    this.nodeId = "";
    this.scalePreset = "md";
    this.cacheBustToken = "0";
    this.__cacheBustCounter = 0;
    this.__disposer = [];
    this.__boundFileAction = this._onFileAction.bind(this);
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
          border: var(--ddd-border-sm) solid
            var(--ddd-theme-default-limestoneGray);
          border-radius: var(--ddd-radius-md);
          padding: var(--ddd-spacing-3);
        }
        .upload-row {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-3);
          align-items: start;
        }
        .upload-main {
          flex: 1 1 280px;
          min-width: 260px;
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
          border: var(--ddd-border-sm) solid
            var(--ddd-theme-default-limestoneGray);
          border-radius: var(--ddd-radius-md);
          overflow: auto;
          flex: 1;
          min-height: 0;
        }
        editable-table-display {
          --ddd-theme-body-font-size: var(--ddd-font-size-5xs, 12px);
          --editable-table-font-family: var(--ddd-font-navigation);
          --editable-table-font-size: var(--ddd-font-size-5xs, 12px);
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
          border-bottom: var(--ddd-border-xs) solid
            var(--ddd-theme-default-limestoneGray);
          background: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-charcoalGray)
          );
          position: sticky;
          top: 0;
          z-index: 1;
        }
        td {
          padding: var(--ddd-spacing-2);
          border-bottom: var(--ddd-border-xs) solid
            var(--ddd-theme-default-limestoneGray);
          vertical-align: middle;
        }
        tr:last-child td {
          border-bottom: none;
        }
        .pw {
          width: 200px;
          height: 100px;
          border-radius: var(--ddd-radius-sm);
          border: var(--ddd-border-xs) solid
            var(--ddd-theme-default-limestoneGray);
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .pw img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .fn {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
        }
        .fn a {
          color: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-linkLight)
          );
          text-decoration: none;
          overflow-wrap: anywhere;
        }
        .fp {
          font-size: var(--ddd-font-size-5xs);
          margin-top: var(--ddd-spacing-1);
          color: var(--ddd-theme-default-slateGray);
          overflow-wrap: anywhere;
        }
        .ib {
          --simple-icon-button-border-radius: var(--ddd-radius-sm);
          --simple-icon-button-border: var(--ddd-border-xs) solid
            var(--ddd-theme-default-limestoneGray);
          --simple-icon-button-focus-border: var(--ddd-border-xs) solid
            var(--ddd-theme-default-navy);
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
    for (var i in this.__disposer) {
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
      this.refreshFiles();
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
      return `${months} month${months === 1 ? "" : "s"} ago`;
    }
    if (delta >= day) {
      const days = Math.floor(delta / day);
      return `${days} day${days === 1 ? "" : "s"} ago`;
    }
    if (delta >= hour) {
      const hours = Math.floor(delta / hour);
      const minutes = Math.floor((delta % hour) / minute);
      if (minutes > 0) {
        return `${hours} hour${hours === 1 ? "" : "s"} ${minutes} minute${minutes === 1 ? "" : "s"} ago`;
      }
      return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    }
    if (delta >= minute) {
      const minutes = Math.floor(delta / minute);
      const seconds = Math.floor(delta % minute);
      return `${minutes} minute${minutes === 1 ? "" : "s"} ${seconds} second${seconds === 1 ? "" : "s"} ago`;
    }
    return `${delta} second${delta === 1 ? "" : "s"} ago`;
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
    } catch (e) {
      return null;
    }
  }
  _em(resp, d, fb) {
    if (
      d &&
      d.__failed &&
      typeof d.__failed.message === "string" &&
      d.__failed.message
    )
      return d.__failed.message;
    if (d && typeof d.message === "string" && d.message) return d.message;
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
    if (typeof response.message === "string" && response.message) {
      return response.message;
    }
    if (
      response.data &&
      typeof response.data === "object" &&
      typeof response.data.message === "string" &&
      response.data.message
    ) {
      return response.data.message;
    }
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
        this.errorMessage = "Unable to load files";
        this.rows = [];
        return;
      }
      const response = await MicroFrontendRegistry.call(
        "@site/listFiles",
        {
          cb: cacheBustToken,
        },
        null,
        this,
      );
      const status = this._statusCode(response);
      if (status !== 200) {
        this.errorMessage = this._messageFromResponse(
          response,
          "Unable to load files",
        );
        this.rows = [];
        return;
      }
      this.rows = this._normPayload(response);
    } catch (e) {
      this.errorMessage = "Unable to load files";
      this.rows = [];
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
    this._msg("Upload complete");
    this.refreshFiles();
  }

  _rowByIndex(index) {
    const i = parseInt(index, 10);
    if (Number.isNaN(i) || i < 0 || !this.rows[i]) return null;
    return { index: i, row: this.rows[i] };
  }

  _onFileAction(e) {
    if (!e || !e.detail || this.busy) return;
    const rowData = this._rowByIndex(e.detail.rowIndex);
    if (!rowData) return;
    if (e.detail.action === "scale") {
      this._onScaleAction(rowData.index, e.detail.value);
    } else if (e.detail.action === "rotate") {
      this._onRotateAction(rowData.index, e.detail.value);
    } else if (e.detail.action === "transform") {
      this._onTransformAction(rowData.index, e.detail.value);
    } else if (e.detail.action === "rename") {
      this._onRenameAction(rowData.index);
    } else if (e.detail.action === "delete") {
      this._delete(rowData.index);
    }
  }
  async _op(row, op, options = {}) {
    if (!this._canOp) {
      this._msg("Unable to run file operation.", true);
      return;
    }
    this.busy = true;
    this.errorMessage = "";
    try {
      const fileUuid = this._s(row && row.uuid ? row.uuid : "");
      if (!fileUuid) {
        this.errorMessage = "File UUID is missing";
        this._msg(this.errorMessage, true);
        return;
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
        this.errorMessage = "File operation endpoint is not available";
        this._msg(this.errorMessage, true);
        return;
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
          "File operation failed",
        );
        this._msg(this.errorMessage, true);
        return;
      }
      let message = "File operation complete";
      if (op === "delete") message = "File deleted";
      else if (op === "rename") message = "File renamed";
      else if (op === "convert-jpg") message = "Image converted to JPG";
      else if (op === "rotate-90") message = "Image rotated 90 degrees";
      else if (op === "sepia") message = "Image transformed to sepia";
      else if (op === "black-and-white")
        message = "Image transformed to black and white";
      else if (op === "scale" && options && options.size)
        message = `Scaled to ${options.size}`;
      this._msg(message);
      await this.refreshFiles();
    } catch (e) {
      this.errorMessage = "File operation failed";
      this._msg(this.errorMessage, true);
    } finally {
      this.busy = false;
    }
  }

  async _onScaleAction(index, size) {
    const i = parseInt(index, 10);
    const normalizedSize = typeof size === "string" ? size.trim() : "";
    if (Number.isNaN(i) || i < 0 || !this.rows[i]) return;
    if (!normalizedSize || !SCALE_PRESETS[normalizedSize]) return;
    if (!this._canScale(this.rows[i])) {
      this._msg("Only raster images can be scaled.", true);
      return;
    }
    this.scalePreset = normalizedSize;
    await this._op(this.rows[i], "scale", { size: normalizedSize });
  }
  async _onRotateAction(index, op) {
    const i = parseInt(index, 10);
    const normalizedOp = typeof op === "string" ? op.trim() : "";
    if (Number.isNaN(i) || i < 0 || !this.rows[i]) return;
    if (normalizedOp !== "rotate-90") return;
    if (!this._canScale(this.rows[i])) {
      this._msg("Only raster images can be rotated.", true);
      return;
    }
    await this._op(this.rows[i], normalizedOp);
  }
  async _onTransformAction(index, op) {
    const i = parseInt(index, 10);
    const normalizedOp = typeof op === "string" ? op.trim() : "";
    if (Number.isNaN(i) || i < 0 || !this.rows[i]) return;
    if (!normalizedOp) return;
    if (
      normalizedOp === "convert-jpg" &&
      !this._canConvertToJpg(this.rows[i])
    ) {
      this._msg("Only raster images can be converted to JPG.", true);
      return;
    }
    if (
      (normalizedOp === "sepia" || normalizedOp === "black-and-white") &&
      !this._canScale(this.rows[i])
    ) {
      this._msg("Only raster images can be transformed.", true);
      return;
    }
    await this._op(this.rows[i], normalizedOp);
  }
  async _onRenameAction(index) {
    const i = parseInt(index, 10);
    if (Number.isNaN(i) || i < 0 || !this.rows[i]) return;
    const activeRow = this.rows[i];
    const defaultName = this._nameWithoutExt(activeRow.name || activeRow.path);
    const requestedName = globalThis.prompt(
      "Rename file using letters, numbers, and hyphens. Keep the existing extension.",
      defaultName,
    );
    if (typeof requestedName !== "string") return;
    const normalizedName = requestedName.trim();
    if (!normalizedName) {
      this._msg("Rename cancelled", true);
      return;
    }
    await this._op(activeRow, "rename", { newName: normalizedName });
  }
  async _delete(index) {
    const i = parseInt(index, 10);
    if (Number.isNaN(i) || i < 0 || !this.rows[i]) return;
    if (
      !globalThis.confirm(`Delete ${this.rows[i].path}? This cannot be undone.`)
    )
      return;
    await this._op(this.rows[i], "delete");
  }

  _msg(m, err) {
    if (store && typeof store.toast === "function") {
      store.toast(m, 3000, { hat: err ? "fire" : "construction" });
      return;
    }
    if (HAXStore && typeof HAXStore.toast === "function")
      HAXStore.toast(m, 3000, "fit-bottom");
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
                <simple-icon-button-lite
                  class="ib"
                  icon="icons:refresh"
                  label="Refresh"
                  title="Refresh file list"
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
              ? "Loading\u2026"
              : this.errorMessage
                ? this.errorMessage
                : `${this.rows.length} file(s)`}
          </div>
        </div>
        <div class="tw">
          ${this.rows.length === 0 && !this.loading
            ? html`<div class="empty">No files found.</div>`
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
                  >
                    <table>
                      <thead>
                        <tr>
                          <th>Preview</th>
                          <th>File</th>
                          <th>Type</th>
                          <th>Size</th>
                          <th>Updated</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${this.rows.map(
                          (r, i) => html`
                            <tr>
                              <td>
                                <span class="pw">
                                  ${this._isImg(r) && r.publicUrl
                                    ? html`<img
                                        src="${this._previewUrl(r)}"
                                        alt="${r.name}"
                                        height="100px"
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
                                    label="Copy path"
                                    title="${r.path}"
                                    data-cp="${r.path}"
                                    success-message="Path copied"
                                  >
                                  </simple-clipboard-copy-button>
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
                                ${this._fmtRelativeDate(
                                  r.updated || r.dateCreated,
                                )}
                              </td>
                              <td>
                                <hax-file-actions
                                  row-index="${i}"
                                  path="${r.path}"
                                  scale-preset="${this.scalePreset}"
                                  ?busy="${this.busy}"
                                  ?can-scale="${this._canScale(r)}"
                                >
                                </hax-file-actions>
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

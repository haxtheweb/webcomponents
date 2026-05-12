import { html, css } from "lit";
import { keyed } from "lit/directives/keyed.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/editable-table/editable-table.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";

class HAXCMSFilesAdminDialog extends DDD {
  static get tag() {
    return "haxcms-files-admin-dialog";
  }

  static get properties() {
    return {
      rows: { type: Array },
      textFilter: { type: String, attribute: "text-filter" },
      typeFilter: { type: String, attribute: "type-filter" },
    };
  }

  constructor() {
    super();
    this.rows = [];
    this.textFilter = "";
    this.typeFilter = "any";
    this.__disposer = [];
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          --haxcms-admin-panel-height: calc(
            var(--simple-modal-height, 85vh) -
              var(--simple-modal-titlebar-height, 80px) - var(--ddd-spacing-8, 32px)
          );
          display: flex;
          flex-direction: column;
          min-width: 80vw;
          min-height: min(60vh, var(--haxcms-admin-panel-height));
          height: var(--haxcms-admin-panel-height);
          max-height: var(--haxcms-admin-panel-height);
          overflow: hidden;
          font-family: var(--ddd-font-navigation);
        }
        .panel-shell {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
          padding: var(--ddd-spacing-4);
          gap: var(--ddd-spacing-3);
        }
        .panel-scroll {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          padding-right: var(--ddd-spacing-1);
        }
        .panel {
          border: var(--ddd-border-sm) solid var(--ddd-theme-default-limestoneGray);
          border-radius: var(--ddd-radius-md);
          padding: var(--ddd-spacing-3);
          margin: 0 0 var(--ddd-spacing-3) 0;
        }
        .title {
          margin: 0 0 var(--ddd-spacing-2) 0;
          font-size: var(--ddd-font-size-s);
          font-weight: var(--ddd-font-weight-medium);
        }
        .controls {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-2);
          align-items: end;
        }
        label {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1);
          font-size: var(--ddd-font-size-4xs);
        }
        input,
        select,
        button {
          font: inherit;
        }
        input,
        select {
          border: var(--ddd-border-xs) solid var(--ddd-theme-default-limestoneGray);
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-2);
          min-height: 36px;
          min-width: 180px;
          background: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }
        button {
          border: var(--ddd-border-xs) solid var(--ddd-theme-default-navy);
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          background: var(--ddd-theme-default-skyBlue);
          color: var(--ddd-theme-default-white);
          cursor: pointer;
          min-height: 36px;
        }
        button[disabled] {
          opacity: 0.6;
          cursor: not-allowed;
        }
        editable-table {
          --editable-table-font-family: var(--ddd-font-navigation);
          --editable-table-font-size: var(--ddd-font-size-4xs);
        }
        .table-scroll {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .table-scroll editable-table {
          display: block;
          min-width: 980px;
        }
        .preview-cell {
          min-width: 120px;
        }
        .preview-wrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100px;
          height: 100px;
          max-width: 100px;
          max-height: 100px;
          overflow: hidden;
          border: var(--ddd-border-xs) solid var(--ddd-theme-default-limestoneGray);
          border-radius: var(--ddd-radius-sm);
          background: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-coalyGray)
          );
        }
        .preview-wrap img {
          width: 100px;
          height: 100px;
          max-width: 100px;
          max-height: 100px;
          object-fit: contain;
          border-radius: var(--ddd-radius-sm);
          background: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          display: block;
        }
        .file-name-cell {
          min-width: 230px;
        }
        .file-name-main {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
          min-width: 0;
        }
        .file-name-main span {
          overflow-wrap: anywhere;
        }
        .file-path {
          margin-top: var(--ddd-spacing-1);
          font-size: var(--ddd-font-size-6xs, 0.62rem);
          line-height: var(--ddd-lh-120, 1.2);
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneGray)
          );
          overflow-wrap: anywhere;
        }
        .copy-btn {
          --simple-icon-button-border-radius: var(--ddd-radius-sm);
          --simple-icon-button-border: var(--ddd-border-xs) solid
            var(--ddd-theme-default-limestoneGray);
          --simple-icon-button-focus-border: var(--ddd-border-xs) solid
            var(--ddd-theme-default-navy);
          --simple-icon-button-padding: var(--ddd-spacing-1);
          --simple-icon-height: var(--ddd-icon-3xs);
          --simple-icon-width: var(--ddd-icon-3xs);
          flex: 0 0 auto;
        }
        a {
          color: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-linkLight)
          );
        }
        .empty {
          margin: var(--ddd-spacing-4) 0;
        }
        .sr-only {
          border: 0;
          clip: rect(0, 0, 0, 0);
          height: 1px;
          margin: -1px;
          overflow: hidden;
          padding: 0;
          position: absolute;
          white-space: nowrap;
          width: 1px;
        }
        @media screen and (max-width: 900px) {
          :host {
            min-width: 0;
            width: 100%;
            min-height: 0;
            height: auto;
            max-height: calc(
              100dvh -
                var(
                  --simple-modal-titlebar-mobile-height,
                  var(--simple-modal-titlebar-height, 80px)
                ) -
                var(--ddd-spacing-4, 16px)
            );
            overflow-y: auto;
            overflow-x: auto;
            padding: var(--ddd-spacing-3);
          }
          .panel-shell {
            min-height: auto;
            padding: 0;
          }
          .panel-scroll {
            flex: 0 0 auto;
            min-height: auto;
            overflow-y: visible;
            overflow-x: auto;
            padding-right: 0;
          }
        }
      `,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.__disposer.push(
      autorun(() => {
        const manifest = toJS(store.manifest);
        this.rows = this._buildRows(manifest);
      }),
    );
  }

  disconnectedCallback() {
    for (var i in this.__disposer) {
      const disposer = this.__disposer[i];
      if (typeof disposer === "function") {
        disposer();
      } else if (disposer && typeof disposer.dispose === "function") {
        disposer.dispose();
      }
    }
    this.__disposer = [];
    super.disconnectedCallback();
  }

  _buildRows(manifest) {
    const rowsByKey = {};
    const items = manifest && Array.isArray(manifest.items) ? manifest.items : [];
    items.forEach((item) => {
      const references = this._itemFileReferences(item);
      references.forEach((reference) => {
        this._upsertReferenceRow(rowsByKey, reference, item);
      });
    });
    this._siteFileReferences(manifest).forEach((reference) => {
      this._upsertReferenceRow(rowsByKey, reference, null);
    });
    const rows = Object.keys(rowsByKey).map((key) => {
      const row = rowsByKey[key];
      row.pageRefs.sort((a, b) => a.title.localeCompare(b.title));
      row.pageSearch = row.pageRefs
        .map((page) => page.title.toLowerCase())
        .join(" ");
      row.name = row.name || this._extractFileName(row.url || row.fullUrl);
      row.mimeType = row.mimeType || this._inferMimeType(row);
      row.type = this._normalizeType(row.mimeType);
      row.sizeLabel = this._formatBytes(row.size);
      row.path = row.url || row.fullUrl || "";
      row.previewUrl = row.type === "image" ? row.url || row.fullUrl : "";
      return row;
    });
    rows.sort((a, b) => {
      const left = (a.name || "").toLowerCase();
      const right = (b.name || "").toLowerCase();
      return left.localeCompare(right);
    });
    return rows;
  }

  _upsertReferenceRow(rowsByKey, reference, item) {
    const key = this._rowKey(reference);
    if (!key) {
      return;
    }
    if (!rowsByKey[key]) {
      rowsByKey[key] = {
        key,
        name: reference.name || "",
        mimeType: reference.mimeType || "",
        size: this._normalizeSize(reference.size),
        url: reference.url || "",
        fullUrl: reference.fullUrl || "",
        pageRefs: [],
        siteReferenced: false,
        pageSearch: "",
      };
    }
    const row = rowsByKey[key];
    if (!row.name && reference.name) {
      row.name = reference.name;
    }
    if (!row.mimeType && reference.mimeType) {
      row.mimeType = reference.mimeType;
    }
    if (!row.size && reference.size) {
      row.size = this._normalizeSize(reference.size);
    }
    if (!row.url && reference.url) {
      row.url = reference.url;
    }
    if (!row.fullUrl && reference.fullUrl) {
      row.fullUrl = reference.fullUrl;
    }
    if (item) {
      const pageId = item.id || item.slug || item.title;
      const hasReference = row.pageRefs.some((page) => page.id === pageId);
      if (!hasReference) {
        row.pageRefs.push({
          id: pageId,
          title: item.title || item.slug || "Untitled page",
          slug: item.slug || "",
        });
      }
    } else {
      row.siteReferenced = true;
    }
  }

  _siteFileReferences(manifest) {
    const references = [];
    if (!manifest || !manifest.metadata) {
      return references;
    }
    const metadata = manifest.metadata;
    const site = metadata.site || {};
    const theme = metadata.theme || {};
    if (site.logo) {
      references.push(this._normalizeReference(site.logo));
    }
    if (theme.variables && theme.variables.image) {
      references.push(this._normalizeReference(theme.variables.image));
    }
    if (theme.image) {
      references.push(this._normalizeReference(theme.image));
    }
    if (theme.thumbnail) {
      references.push(this._normalizeReference(theme.thumbnail));
    }
    return references.filter((reference) => !!reference);
  }

  _itemFileReferences(item) {
    const references = [];
    if (!item || !item.metadata) {
      return references;
    }
    const metadata = item.metadata;
    if (Array.isArray(metadata.files)) {
      metadata.files.forEach((entry) => {
        const normalized = this._normalizeReference(entry);
        if (normalized) {
          references.push(normalized);
        }
      });
    }
    if (Array.isArray(metadata.images)) {
      metadata.images.forEach((entry) => {
        const normalized = this._normalizeReference(entry);
        if (normalized) {
          references.push(normalized);
        }
      });
    }
    if (metadata.image) {
      const normalized = this._normalizeReference(metadata.image);
      if (normalized) {
        references.push(normalized);
      }
    }
    return references;
  }

  _normalizeReference(reference) {
    if (!reference) {
      return null;
    }
    if (typeof reference === "string") {
      const url = this._cleanString(reference);
      if (!this._looksLikeFileReference(url)) {
        return null;
      }
      return {
        url,
        fullUrl: "",
        name: this._extractFileName(url),
        mimeType: this._inferMimeType({ url }),
        size: 0,
      };
    }
    if (typeof reference === "object") {
      const url = this._cleanString(reference.url || reference.path);
      const fullUrl = this._cleanString(reference.fullUrl || "");
      const name =
        this._cleanString(reference.name) ||
        this._extractFileName(url || fullUrl || "");
      const mimeType = this._normalizeMimeType(
        reference.type || reference.mimetype || reference.mime,
      );
      if (!this._looksLikeFileReference(url) && !this._looksLikeFileReference(fullUrl)) {
        return null;
      }
      return {
        url,
        fullUrl,
        name,
        mimeType,
        size: this._normalizeSize(reference.size),
      };
    }
    return null;
  }

  _cleanString(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  _looksLikeFileReference(value) {
    const test = this._cleanString(value).toLowerCase();
    if (!test) {
      return false;
    }
    if (test.indexOf("files/") !== -1 || test.indexOf("/files/") !== -1) {
      return true;
    }
    return false;
  }

  _rowKey(reference) {
    const key =
      this._cleanString(reference.url) ||
      this._cleanString(reference.fullUrl) ||
      this._cleanString(reference.name);
    return key.toLowerCase();
  }

  _extractFileName(value) {
    const clean = this._cleanString(value).split("?")[0];
    if (!clean) {
      return "";
    }
    const parts = clean.split("/");
    const name = parts.length > 0 ? parts[parts.length - 1] : clean;
    try {
      return decodeURIComponent(name);
    } catch (e) {
      return name;
    }
  }

  _normalizeMimeType(value) {
    const mime = this._cleanString(value).toLowerCase();
    return mime;
  }

  _inferMimeType(reference) {
    const target = reference.name || reference.url || reference.fullUrl || "";
    const extParts = target.toLowerCase().split("?");
    const extTarget = extParts.length > 0 ? extParts[0] : target.toLowerCase();
    const extension = extTarget.indexOf(".") !== -1 ? extTarget.split(".").pop() : "";
    const mimeMap = {
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
      m4v: "video/mp4",
      webm: "video/webm",
      mov: "video/quicktime",
      ogv: "video/ogg",
      mp3: "audio/mpeg",
      wav: "audio/wav",
      ogg: "audio/ogg",
      m4a: "audio/mp4",
      pdf: "application/pdf",
      txt: "text/plain",
      md: "text/markdown",
      csv: "text/csv",
      json: "application/json",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ppt: "application/vnd.ms-powerpoint",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    };
    return extension && mimeMap[extension] ? mimeMap[extension] : "";
  }

  _normalizeType(value) {
    const lower = (value || "").toLowerCase();
    if (lower.includes("image")) return "image";
    if (lower.includes("video")) return "video";
    if (lower.includes("audio")) return "audio";
    if (lower.includes("pdf")) return "document";
    if (lower.includes("text")) return "document";
    if (lower.includes("application")) return "document";
    return lower || "file";
  }

  _normalizeSize(value) {
    if (typeof value === "number") {
      return value;
    }
    if (typeof value === "string" && value !== "") {
      const n = parseInt(value, 10);
      return Number.isNaN(n) ? 0 : n;
    }
    return 0;
  }

  _formatBytes(size) {
    const sizeValue = this._normalizeSize(size);
    if (!sizeValue) {
      return "";
    }
    const units = ["B", "KB", "MB", "GB"];
    let unitIndex = 0;
    let current = sizeValue;
    while (current >= 1024 && unitIndex < units.length - 1) {
      current = current / 1024;
      unitIndex++;
    }
    const precision = current >= 10 || unitIndex === 0 ? 0 : 1;
    return `${current.toFixed(precision)} ${units[unitIndex]}`;
  }
  _toRelativeFilePath(value) {
    const cleanValue = this._cleanString(value);
    if (!cleanValue) {
      return "";
    }
    const lowered = cleanValue.toLowerCase();
    if (lowered.indexOf("files/") === 0) {
      return cleanValue;
    }
    const filesWithSlashIndex = lowered.indexOf("/files/");
    if (filesWithSlashIndex !== -1) {
      return cleanValue.substring(filesWithSlashIndex + 1);
    }
    const filesIndex = lowered.indexOf("files/");
    if (filesIndex !== -1) {
      return cleanValue.substring(filesIndex);
    }
    return cleanValue;
  }
  _copyPath(row) {
    if (!row) {
      return "";
    }
    const relativePath = this._toRelativeFilePath(row.url || row.path || "");
    if (relativePath) {
      return relativePath;
    }
    return this._toRelativeFilePath(row.fullUrl || "");
  }

  get filteredRows() {
    const txt = (this.textFilter || "").toLowerCase().trim();
    return this.rows.filter((row) => {
      if (this.typeFilter !== "any" && row.type !== this.typeFilter) {
        return false;
      }
      if (!txt) {
        return true;
      }
      return (
        (row.name || "").toLowerCase().includes(txt) ||
        (row.mimeType || "").toLowerCase().includes(txt) ||
        (row.path || "").toLowerCase().includes(txt) ||
        (row.pageSearch || "").includes(txt)
      );
    });
  }

  _onTextFilter(e) {
    this.textFilter = e.target.value;
  }

  _onTypeFilter(e) {
    this.typeFilter = e.target.value;
  }

  _resetFilters() {
    this.textFilter = "";
    this.typeFilter = "any";
  }

  render() {
    return html`
      <div class="panel-shell">
        <div class="panel-scroll">
          <div class="panel">
            <h3 class="title">Show only files where</h3>
            <div class="controls">
              <label>
                Type
                <select .value="${this.typeFilter}" @change="${this._onTypeFilter}">
                  <option value="any">Any</option>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                  <option value="document">Document</option>
                  <option value="file">File</option>
                </select>
              </label>
              <label>
                Text
                <input
                  type="text"
                  .value="${this.textFilter}"
                  @input="${this._onTextFilter}"
                  placeholder="File name, MIME type, page title, or path"
                />
              </label>
              <button
                @click="${this._resetFilters}"
                ?disabled="${!this.textFilter && this.typeFilter === "any"}"
              >
                Reset filters
              </button>
            </div>
          </div>
          ${this.filteredRows.length === 0
            ? html`<div class="empty">No file references found in the manifest.</div>`
            : keyed(
                `${this.typeFilter}|${this.textFilter}|${this.filteredRows.length}`,
                html`<div class="table-scroll">
                  <editable-table
                    bordered
                    condensed
                    column-header
                    sort
                    striped
                    scroll
                    @click="${this.copyFilePath}"
                  >
                    <table>
                      <thead>
                        <tr>
                          <th>Preview</th>
                          <th>File Name</th>
                          <th class="col-mime">MIME Type</th>
                          <th>Referenced By</th>
                          <th class="col-size">Size</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${this.filteredRows.map(
                          (row) => html`
                            <tr>
                              <td class="preview-cell">
                                <span class="preview-wrap">
                                  ${row.previewUrl
                                    ? html`<img
                                        loading="lazy"
                                        decoding="async"
                                        width="100px"
                                        height="100px"
                                        style="display: block; background-color: light-dark(var(--ddd-theme-default-white), var(--ddd-theme-default-coalyGray));"
                                        class="preview-image"
                                        src="${row.previewUrl}"
                                        alt="Preview of ${row.name}"
                                      />`
                                    : html`<span class="sr-only"
                                        >No image preview available</span
                                      >`}
                                </span>
                              </td>
                              <td class="file-name-cell">
                                <div class="file-name-main">
                                  <span>${row.name || "—"} <simple-icon-button-lite title="${this._copyPath(row)}" data-copy-path="${this._copyPath(row)}" label="Copy file path for ${row.name || "file"}" icon="content-copy" class="copy-btn"></simple-icon-button-lite> </span>
                                </div>
                              </td>
                              <td class="col-mime">${row.mimeType || "—"}</td>
                              <td>
                                ${row.pageRefs.length > 0
                                  ? row.pageRefs[0].slug
                                    ? html`<a href="${row.pageRefs[0].slug}"
                                        >${row.pageRefs[0].title}</a
                                      >`
                                    : html`${row.pageRefs[0].title}`
                                  : row.siteReferenced
                                    ? html`Site Settings`
                                    : html`—`}
                              </td>
                              <td class="col-size">${row.sizeLabel || "—"}</td>
                            </tr>
                          `,
                        )}
                      </tbody>
                    </table>
                  </editable-table>
                </div>`,
              )}
        </div>
      </div>
    `;
  }

  async copyFilePath(e) {
    const path =
      e && typeof e.composedPath === "function" ? e.composedPath() : [];
    const copyButton = path.find(
      (node) =>
        node &&
        node.classList &&
        typeof node.classList.contains === "function" &&
        node.classList.contains("copy-btn"),
    );
    if (!copyButton) {
      return;
    }
    const filePath = this._cleanString(
      copyButton.getAttribute("data-copy-path") ||
        copyButton.getAttribute("title"),
    );
    if (!filePath) {
      return;
    }
    let copied = false;
    try {
      if (
        globalThis.navigator &&
        globalThis.navigator.clipboard &&
        globalThis.navigator.clipboard.writeText
      ) {
        await globalThis.navigator.clipboard.writeText(filePath);
        copied = true;
      }
    } catch (e) {
      copied = false;
    }
    if (!copied) {
      try {
        const textArea = globalThis.document.createElement("textarea");
        textArea.value = filePath;
        textArea.setAttribute("readonly", "true");
        textArea.style.position = "absolute";
        textArea.style.left = "-9999px";
        globalThis.document.body.appendChild(textArea);
        textArea.select();
        copied = globalThis.document.execCommand("copy");
        globalThis.document.body.removeChild(textArea);
      } catch (e) {
        copied = false;
      }
    }
    if (copied) {
      HAXStore.toast("File path copied", 3000, "fit-bottom");
    }
  }
}

globalThis.customElements.define(HAXCMSFilesAdminDialog.tag, HAXCMSFilesAdminDialog);

export { HAXCMSFilesAdminDialog };

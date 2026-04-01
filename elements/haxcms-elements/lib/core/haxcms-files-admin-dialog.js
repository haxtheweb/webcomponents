import { html, css } from "lit";
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
      selectedIds: { type: Array },
      textFilter: { type: String, attribute: "text-filter" },
      typeFilter: { type: String, attribute: "type-filter" },
      loading: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.rows = [];
    this.selectedIds = [];
    this.textFilter = "";
    this.typeFilter = "any";
    this.loading = false;
    this.__disposer = [];
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          min-width: 80vw;
          min-height: 70vh;
          overflow: auto;
          padding: var(--ddd-spacing-4);
          font-family: var(--ddd-font-navigation);
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
        .op-btn {
          --simple-icon-button-border-radius: var(--ddd-radius-sm);
          --simple-icon-button-border: var(--ddd-border-xs) solid
            var(--ddd-theme-default-limestoneGray);
          --simple-icon-button-focus-border: var(--ddd-border-xs) solid
            var(--ddd-theme-default-navy);
          --simple-icon-button-padding: var(--ddd-spacing-1);
          --simple-icon-height: var(--ddd-icon-4xs);
          --simple-icon-width: var(--ddd-icon-4xs);
          margin-right: var(--ddd-spacing-1);
        }
        editable-table {
          --editable-table-font-family: var(--ddd-font-navigation);
          --editable-table-font-size: var(--ddd-font-size-4xs);
        }
      `,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    const reaction = autorun(() => {
      toJS(store.manifest);
      this.rows = this.rows.map((row) => ({
        ...row,
        usedIn: this._countFileUsage(row),
      }));
    });
    this.__disposer.push(reaction);
    this.loadFiles();
  }

  disconnectedCallback() {
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    super.disconnectedCallback();
  }

  async loadFiles() {
    this.loading = true;
    try {
      const app = this._getLocalFilesApp();
      const endpoint = app ? this._buildFilesEndpoint(app) : null;
      if (!endpoint) {
        this.rows = [];
        this.loading = false;
        return;
      }
      const response = await fetch(endpoint.url, {
        method: endpoint.method,
      });
      const data = response.ok ? await response.json() : [];
      const list = Array.isArray(data) ? data : data && data.list ? data.list : [];
      this.rows = list.map((item) => this._normalizeFile(item));
      this._syncSelectionToRows();
    } catch (e) {
      this.rows = [];
    }
    this.loading = false;
  }

  _getLocalFilesApp() {
    const editor = store.cmsSiteEditorAvailability();
    if (!editor || !editor.appStore || !editor.appStore.apps) {
      return null;
    }
    const apps = editor.appStore.apps;
    if (!Array.isArray(apps)) {
      return null;
    }
    return (
      apps.find((app) => app.details && app.details.title === "Local files") || null
    );
  }

  _buildFilesEndpoint(app) {
    const browse =
      app.connection && app.connection.operations
        ? app.connection.operations.browse
        : null;
    if (!browse) {
      return null;
    }
    const protocol = app.connection.protocol || "https";
    let url = `${protocol}://${app.connection.url || ""}`;
    if (url.slice(-1) !== "/") {
      url += "/";
    }
    if (browse.endPoint) {
      url += browse.endPoint;
    }
    const params = {};
    Object.assign(params, app.connection.data || {}, browse.data || {});
    if (params.__HAXJWT__) {
      const editor = store.cmsSiteEditorAvailability();
      if (editor && editor.jwt) {
        params.jwt = editor.jwt;
      }
      delete params.__HAXJWT__;
    }
    if (params.__HAXAPPENDUPLOADENDPOINT__) {
      const append = HAXStore.connectionRewrites.appendUploadEndPoint;
      if (append) {
        const extra = new URLSearchParams(append);
        extra.forEach((value, key) => {
          params[key] = value;
        });
      }
      delete params.__HAXAPPENDUPLOADENDPOINT__;
    }
    const qs = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined) {
        qs.set(key, params[key]);
      }
    });
    const query = qs.toString();
    return {
      method: browse.method || "GET",
      url: query ? `${url}?${query}` : url,
    };
  }

  _normalizeFile(item) {
    const id = item.uuid || item.url || item.path || item.name;
    const name = item.name || item.path || item.url || "";
    const type = this._normalizeType(item.type || item.mimetype || item.mime || "");
    const updated = this._toNumber(
      item.updated || item.timestamp || item.modified || item.lastModified,
    );
    const file = {
      id,
      name,
      type,
      url: item.url || item.path || "",
      fullUrl: item.fullUrl || item.url || "",
      updated,
      updatedLabel: this._formatDateForSort(updated),
      usedIn: 0,
      raw: item,
    };
    file.usedIn = this._countFileUsage(file);
    return file;
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

  _toNumber(value) {
    if (typeof value === "number") {
      return value;
    }
    if (typeof value === "string" && value !== "") {
      const n = parseInt(value);
      return Number.isNaN(n) ? 0 : n;
    }
    return 0;
  }

  _formatDateForSort(ts) {
    if (!ts) {
      return "";
    }
    const ms = ts < 1000000000000 ? ts * 1000 : ts;
    const d = new Date(ms);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hrs = String(d.getHours()).padStart(2, "0");
    const mins = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hrs}:${mins}`;
  }

  _countFileUsage(file) {
    const manifest = toJS(store.manifest);
    if (!manifest || !manifest.items) {
      return 0;
    }
    const tests = [file.url, file.fullUrl, file.name].filter((v) => !!v);
    let count = 0;
    manifest.items.forEach((item) => {
      const files = item.metadata && Array.isArray(item.metadata.files)
        ? item.metadata.files
        : [];
      const matched = files.some((entry) =>
        [entry.url, entry.fullUrl, entry.name].some((v) => tests.includes(v)),
      );
      if (matched) {
        count++;
      }
    });
    return count;
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
        row.name.toLowerCase().includes(txt) ||
        row.type.toLowerCase().includes(txt) ||
        row.url.toLowerCase().includes(txt)
      );
    });
  }

  _syncSelectionToRows() {
    const valid = new Set(this.rows.map((row) => row.id));
    this.selectedIds = this.selectedIds.filter((id) => valid.has(id));
  }

  _onTextFilter(e) {
    this.textFilter = e.target.value;
  }

  _onTypeFilter(e) {
    this.typeFilter = e.target.value;
  }

  _onSelectAll(e) {
    this.selectedIds = e.target.checked
      ? this.filteredRows.map((row) => row.id)
      : [];
  }

  _onSelectRow(e) {
    const id = e.target.getAttribute("data-id");
    if (!id) {
      return;
    }
    const set = new Set(this.selectedIds);
    if (e.target.checked) {
      set.add(id);
    } else {
      set.delete(id);
    }
    this.selectedIds = Array.from(set);
  }

  _emitOperation(operation, files) {
    this.dispatchEvent(
      new CustomEvent("haxcms-files-dashboard-operation", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          operation,
          itemIds: files.map((file) => file.id),
          files,
        },
      }),
    );
  }

  _bulkDelete() {
    if (this.selectedIds.length === 0) {
      return;
    }
    if (
      !globalThis.confirm(
        `Delete ${this.selectedIds.length} selected file(s)? This cannot be undone.`,
      )
    ) {
      return;
    }
    const files = this.rows.filter((row) => this.selectedIds.includes(row.id));
    this._emitOperation("delete", files);
  }

  _editFile(file) {
    this._emitOperation("edit", [file]);
  }

  _deleteFile(file) {
    if (!globalThis.confirm(`Delete file "${file.name}"?`)) {
      return;
    }
    this._emitOperation("delete", [file]);
  }

  _openExistingUploadWorkflow() {
    if (HAXStore.haxTray) {
      HAXStore.haxTray.collapsed = false;
      HAXStore.haxTray.trayDetail = "content-add";
    }
    this.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: false,
      }),
    );
  }

  render() {
    const allVisibleSelected =
      this.filteredRows.length > 0 &&
      this.filteredRows.every((row) => this.selectedIds.includes(row.id));
    return html`
      <div class="panel">
        <h3 class="title">Show only items where</h3>
        <div class="controls">
          <label>
            type
            <select .value="${this.typeFilter}" @change="${this._onTypeFilter}">
              <option value="any">any</option>
              <option value="image">image</option>
              <option value="video">video</option>
              <option value="audio">audio</option>
              <option value="document">document</option>
              <option value="file">file</option>
            </select>
          </label>
          <label>
            text
            <input
              type="text"
              .value="${this.textFilter}"
              @input="${this._onTextFilter}"
              placeholder="name, type, url"
            />
          </label>
          <button @click="${this.loadFiles}" ?disabled="${this.loading}">
            ${this.loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>
      <div class="panel" ?hidden="${this.selectedIds.length === 0}">
        <h3 class="title">Update options</h3>
        <div class="controls">
          <button @click="${this._bulkDelete}">Delete selected files</button>
        </div>
      </div>
      <div class="panel">
        <h3 class="title">Bulk upload</h3>
        <div class="controls">
          <button @click="${this._openExistingUploadWorkflow}">
            Open existing upload workflow
          </button>
        </div>
      </div>
      <editable-table bordered condensed column-header filter sort striped scroll>
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  aria-label="Select all files"
                  .checked="${allVisibleSelected}"
                  @change="${this._onSelectAll}"
                />
              </th>
              <th>Title</th>
              <th>Type</th>
              <th>Updated</th>
              <th>Used in</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>
            ${this.filteredRows.map(
              (row) => html`
                <tr>
                  <td>
                    <input
                      type="checkbox"
                      aria-label="Select ${row.name}"
                      data-id="${row.id}"
                      .checked="${this.selectedIds.includes(row.id)}"
                      @change="${this._onSelectRow}"
                    />
                  </td>
                  <td>${row.name}</td>
                  <td>${row.type}</td>
                  <td>${row.updatedLabel}</td>
                  <td>${row.usedIn} place(s)</td>
                  <td>
                    <simple-icon-button-lite
                      class="op-btn"
                      icon="create"
                      label="Edit ${row.name}"
                      @click="${() => this._editFile(row)}"
                    ></simple-icon-button-lite>
                    <simple-icon-button-lite
                      class="op-btn"
                      icon="delete"
                      label="Delete ${row.name}"
                      @click="${() => this._deleteFile(row)}"
                    ></simple-icon-button-lite>
                  </td>
                </tr>
              `,
            )}
          </tbody>
        </table>
      </editable-table>
    `;
  }
}

globalThis.customElements.define(HAXCMSFilesAdminDialog.tag, HAXCMSFilesAdminDialog);

export { HAXCMSFilesAdminDialog };

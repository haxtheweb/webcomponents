import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/editable-table/lib/editable-table-display.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";

class HAXCMSPageRevisionsDialog extends DDD {
  static get tag() {
    return "haxcms-page-revisions-dialog";
  }

  static get properties() {
    return {
      nodeId: { type: String, attribute: "node-id" },
      nodeTitle: { type: String, attribute: "node-title" },
      revisions: { type: Array },
      selectedHash: { type: String, attribute: "selected-hash" },
      selectedRevision: { type: Object, attribute: false },
      previewContent: { type: String, attribute: false },
      loading: { type: Boolean, reflect: true },
      revisionLoading: { type: Boolean, attribute: "revision-loading" },
      restoring: { type: Boolean, reflect: true },
      limit: { type: Number },
      offset: { type: Number },
    };
  }

  constructor() {
    super();
    this.nodeId = "";
    this.nodeTitle = "";
    this.revisions = [];
    this.selectedHash = "";
    this.selectedRevision = null;
    this.previewContent = "";
    this.loading = false;
    this.revisionLoading = false;
    this.restoring = false;
    this.limit = 150;
    this.offset = 0;
    this.__boundRevisionsLoaded = this._onRevisionsLoaded.bind(this);
    this.__boundRevisionLoaded = this._onRevisionLoaded.bind(this);
    this.__boundRevisionRestored = this._onRevisionRestored.bind(this);
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          min-width: min(94vw, 1280px);
          max-height: calc(
            var(--simple-modal-height, 80vh) -
              var(--simple-modal-titlebar-height, 80px) -
              var(--ddd-spacing-8, 32px)
          );
          overflow: hidden;
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }
        .shell {
          display: grid;
          grid-template-rows: minmax(240px, 1fr) minmax(220px, 1fr);
          gap: var(--ddd-spacing-3);
          padding: var(--ddd-spacing-4);
          min-height: 0;
          max-height: 100%;
        }
        .panel {
          border: var(--ddd-border-sm) solid var(--ddd-theme-default-limestoneGray);
          border-radius: var(--ddd-radius-md);
          display: flex;
          flex-direction: column;
          min-height: 0;
          overflow: hidden;
          background: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-charcoalGray)
          );
        }
        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          border-bottom: var(--ddd-border-xs) solid
            var(--ddd-theme-default-limestoneGray);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
        }
        .status {
          font-size: var(--ddd-font-size-5xs);
          color: var(--ddd-theme-default-slateGray);
          padding: 0 var(--ddd-spacing-3) var(--ddd-spacing-2);
        }
        .table-wrap {
          min-height: 0;
          overflow: auto;
          padding: 0 var(--ddd-spacing-2) var(--ddd-spacing-2);
        }
        editable-table-display {
          --ddd-theme-body-font-size: var(--ddd-font-size-5xs, 12px);
          --editable-table-font-family: var(--ddd-font-navigation);
          --editable-table-font-size: var(--ddd-font-size-5xs, 12px);
        }
        table {
          width: 100%;
          min-width: 980px;
          border-collapse: collapse;
        }
        tbody tr.selected {
          background: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
        }
        tbody td {
          vertical-align: top;
        }
        .hash {
          font-family: monospace;
        }
        .message {
          min-width: 240px;
          max-width: 540px;
        }
        .action-cell {
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
        }
        simple-icon-button-lite.action {
          --simple-icon-button-border: var(--ddd-border-xs) solid
            var(--ddd-theme-default-limestoneGray);
          --simple-icon-button-border-radius: var(--ddd-radius-sm);
          --simple-icon-height: var(--ddd-icon-xxs);
          --simple-icon-width: var(--ddd-icon-xxs);
        }
        simple-icon-button-lite.restore {
          color: var(--ddd-theme-default-skyBlue);
        }
        .empty,
        .loading {
          padding: var(--ddd-spacing-3);
          font-size: var(--ddd-font-size-4xs);
        }
        .preview-meta {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-5xs);
          color: var(--ddd-theme-default-slateGray);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          border-bottom: var(--ddd-border-xs) solid
            var(--ddd-theme-default-limestoneGray);
        }
        .preview {
          min-height: 0;
          overflow: auto;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
        }
        pre {
          margin: 0;
          white-space: pre-wrap;
          word-break: break-word;
          font-size: var(--ddd-font-size-6xs);
          line-height: 1.4;
          font-family: monospace;
        }
        @media (max-width: 900px) {
          :host {
            min-width: 0;
            width: 100%;
          }
          .shell {
            grid-template-rows: minmax(220px, 1fr) minmax(180px, 1fr);
          }
          table {
            min-width: 760px;
          }
        }
      `,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    globalThis.addEventListener(
      "haxcms-node-revisions-loaded",
      this.__boundRevisionsLoaded,
    );
    globalThis.addEventListener(
      "haxcms-node-revision-loaded",
      this.__boundRevisionLoaded,
    );
    globalThis.addEventListener(
      "haxcms-node-revision-restored",
      this.__boundRevisionRestored,
    );
  }

  disconnectedCallback() {
    globalThis.removeEventListener(
      "haxcms-node-revisions-loaded",
      this.__boundRevisionsLoaded,
    );
    globalThis.removeEventListener(
      "haxcms-node-revision-loaded",
      this.__boundRevisionLoaded,
    );
    globalThis.removeEventListener(
      "haxcms-node-revision-restored",
      this.__boundRevisionRestored,
    );
    super.disconnectedCallback();
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has("nodeId")) {
      this.revisions = [];
      this.selectedHash = "";
      this.selectedRevision = null;
      this.previewContent = "";
      this._loadRevisions();
    }
  }

  _normalizeNodeId(value) {
    if (typeof value === "string") {
      return value.trim();
    }
    if (typeof value === "number") {
      return String(value);
    }
    return "";
  }

  _loadRevisions() {
    const nodeId = this._normalizeNodeId(this.nodeId);
    if (!nodeId) {
      return;
    }
    this.loading = true;
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-load-node-revisions", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          nodeId: nodeId,
          limit: this.limit,
          offset: this.offset,
          source: "haxcms-page-revisions-dialog",
        },
      }),
    );
  }

  _loadRevision(hash) {
    const nodeId = this._normalizeNodeId(this.nodeId);
    const normalizedHash = this._normalizeNodeId(hash);
    if (!nodeId || !normalizedHash) {
      return;
    }
    this.revisionLoading = true;
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-load-node-revision", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          nodeId: nodeId,
          hash: normalizedHash,
          source: "haxcms-page-revisions-dialog",
        },
      }),
    );
  }

  _requestRestore(hash) {
    const nodeId = this._normalizeNodeId(this.nodeId);
    const normalizedHash = this._normalizeNodeId(hash);
    if (!nodeId || !normalizedHash) {
      return;
    }
    if (!globalThis.confirm("Restore this revision as a new commit?")) {
      return;
    }
    this.restoring = true;
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-restore-node-revision", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          nodeId: nodeId,
          hash: normalizedHash,
          source: "haxcms-page-revisions-dialog",
        },
      }),
    );
  }

  _onRevisionsLoaded(e) {
    const detail = e && e.detail ? e.detail : {};
    const data = detail && detail.data ? detail.data : null;
    if (!data) {
      return;
    }
    const incomingNodeId = this._normalizeNodeId(data.nodeId);
    if (!incomingNodeId || incomingNodeId !== this._normalizeNodeId(this.nodeId)) {
      return;
    }
    this.loading = false;
    this.revisions = Array.isArray(data.revisions) ? data.revisions : [];
    if (typeof data.nodeTitle === "string" && data.nodeTitle.trim() !== "") {
      this.nodeTitle = data.nodeTitle.trim();
    }
    if (this.revisions.length > 0) {
      const selectedExists = this.revisions.some(
        (revision) => revision && revision.hash === this.selectedHash,
      );
      if (!selectedExists) {
        this.selectedHash = this.revisions[0].hash || "";
        if (this.selectedHash) {
          this._loadRevision(this.selectedHash);
        }
      }
    }
  }

  _onRevisionLoaded(e) {
    const detail = e && e.detail ? e.detail : {};
    const data = detail && detail.data ? detail.data : null;
    if (!data) {
      return;
    }
    const incomingNodeId = this._normalizeNodeId(data.nodeId);
    if (!incomingNodeId || incomingNodeId !== this._normalizeNodeId(this.nodeId)) {
      return;
    }
    this.revisionLoading = false;
    this.selectedRevision = data.revision ? data.revision : null;
    if (this.selectedRevision && this.selectedRevision.hash) {
      this.selectedHash = this.selectedRevision.hash;
    }
    this.previewContent = typeof data.content === "string" ? data.content : "";
  }

  _onRevisionRestored(e) {
    const detail = e && e.detail ? e.detail : {};
    const data = detail && detail.data ? detail.data : null;
    if (!data) {
      return;
    }
    const incomingNodeId = this._normalizeNodeId(data.nodeId);
    if (!incomingNodeId || incomingNodeId !== this._normalizeNodeId(this.nodeId)) {
      return;
    }
    this.restoring = false;
    this._loadRevisions();
    if (this.selectedHash) {
      this._loadRevision(this.selectedHash);
    }
  }

  _selectRevision(e) {
    const target = e && e.currentTarget ? e.currentTarget : null;
    if (!target || !target.getAttribute) {
      return;
    }
    const hash = this._normalizeNodeId(target.getAttribute("data-hash"));
    if (!hash) {
      return;
    }
    this.selectedHash = hash;
    this._loadRevision(hash);
  }
  _actionTargetFromEvent(e) {
    const path = e && typeof e.composedPath === "function" ? e.composedPath() : [];
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

  _handleTableActionClick(e) {
    const actionTarget = this._actionTargetFromEvent(e);
    if (!actionTarget) {
      return;
    }
    const hash = this._normalizeNodeId(actionTarget.getAttribute("data-hash"));
    if (!hash) {
      return;
    }
    const action = actionTarget.getAttribute("data-action");
    if (action === "preview") {
      this.selectedHash = hash;
      this._loadRevision(hash);
      return;
    }
    if (action === "restore") {
      this.selectedHash = hash;
      this._requestRestore(hash);
    }
  }

  _restoreFromRow(e) {
    const target = e && e.currentTarget ? e.currentTarget : null;
    if (!target || !target.getAttribute) {
      return;
    }
    const hash = this._normalizeNodeId(target.getAttribute("data-hash"));
    if (!hash) {
      return;
    }
    this.selectedHash = hash;
    this._requestRestore(hash);
  }

  _formatDate(value) {
    if (!value) {
      return "";
    }
    const timestamp = typeof value === "number" ? value : parseInt(value, 10);
    if (!timestamp || isNaN(timestamp)) {
      return "";
    }
    const asMs = timestamp < 1000000000000 ? timestamp * 1000 : timestamp;
    const date = new Date(asMs);
    if (isNaN(date.getTime())) {
      return "";
    }
    return date.toISOString().replace("T", " ").replace("Z", " UTC");
  }

  render() {
    const pageLabel = this.nodeTitle || this.nodeId;
    return html`
      <div class="shell">
        <section class="panel">
          <div class="panel-header">Revisions for ${pageLabel || "page"}</div>
          <div class="status" role="status" aria-live="polite">
            ${this.loading
              ? "Loading revisions…"
              : `${this.revisions.length} revision${this.revisions.length === 1 ? "" : "s"}`}
          </div>
          <div class="table-wrap">
            ${this.revisions.length === 0 && !this.loading
              ? html`<div class="empty">No revisions found.</div>`
              : html`
                  <editable-table-display
                    bordered
                    condensed
                    column-header
                    responsive
                    sort
                    striped
                    scroll
                    @click="${this._handleTableActionClick}"
                  >
                    <table>
                      <thead>
                        <tr>
                          <th>Hash</th>
                          <th>Date</th>
                          <th>Author</th>
                          <th>Email</th>
                          <th>Message</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${this.revisions.map(
                          (revision) => html`
                            <tr
                              class="${this.selectedHash === revision.hash
                                ? "selected"
                                : ""}"
                            >
                              <td class="hash">${revision.shortHash || revision.hash || ""}</td>
                              <td>
                                ${this._formatDate(
                                  revision.timestamp || revision.date || 0,
                                )}
                              </td>
                              <td>${revision.author || ""}</td>
                              <td>${revision.authorEmail || ""}</td>
                              <td class="message">${revision.message || ""}</td>
                              <td class="action-cell">
                                <simple-icon-button-lite
                                  class="action"
                                  icon="icons:visibility"
                                  label="Preview revision"
                                  title="Preview revision"
                                  data-action="preview"
                                  data-hash="${revision.hash || ""}"
                                ></simple-icon-button-lite>
                                <simple-icon-button-lite
                                  class="action restore"
                                  icon="icons:restore"
                                  label="Restore revision"
                                  title="Restore revision as a new commit"
                                  data-action="restore"
                                  data-hash="${revision.hash || ""}"
                                  ?disabled="${this.restoring}"
                                ></simple-icon-button-lite>
                              </td>
                            </tr>
                          `,
                        )}
                      </tbody>
                    </table>
                  </editable-table-display>
                `}
          </div>
        </section>
        <section class="panel">
          <div class="panel-header">Revision preview</div>
          <div class="preview-meta">
            ${this.selectedRevision
              ? html`
                  <span>${this.selectedRevision.hash || ""}</span>
                  <span>${this.selectedRevision.author || ""}</span>
                  <span>${this.selectedRevision.authorEmail || ""}</span>
                  <span>
                    ${this.selectedRevision.date ||
                    this._formatDate(this.selectedRevision.timestamp || 0)}
                  </span>
                `
              : html`<span>Select a revision row to preview content.</span>`}
          </div>
          <div class="preview">
            ${this.revisionLoading
              ? html`<div class="loading">Loading revision preview…</div>`
              : html`<pre>${this.previewContent || ""}</pre>`}
          </div>
        </section>
      </div>
    `;
  }
}

globalThis.customElements.define(
  HAXCMSPageRevisionsDialog.tag,
  HAXCMSPageRevisionsDialog,
);

export { HAXCMSPageRevisionsDialog };

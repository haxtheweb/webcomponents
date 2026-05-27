import { html, css } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
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
      selectedItemMetadata: { type: Object, attribute: false },
      previewContent: { type: String, attribute: false },
      previewMode: {
        type: String,
        attribute: "preview-mode",
        reflect: true,
      },
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
    this.selectedItemMetadata = null;
    this.previewContent = "";
    this.previewMode = "source";
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
          display: block;
          align-items: center;
          justify-content: space-between;
          gap: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          border-bottom: var(--ddd-border-xs) solid
            var(--ddd-theme-default-limestoneGray);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
        }
        .panel-header-title {
          display: inline-flex;
          align-items: center;
          min-width: 0;
          flex: 1 1 auto;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .preview-toggle {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
          flex-shrink: 0;
        }
        simple-icon-button-lite.mode-toggle {
          --simple-icon-button-border: var(--ddd-border-xs) solid
            var(--ddd-theme-default-limestoneGray);
          --simple-icon-button-border-radius: var(--ddd-radius-sm);
          --simple-icon-height: var(--ddd-icon-xxs);
          --simple-icon-width: var(--ddd-icon-xxs);
        }
        simple-icon-button-lite.mode-toggle.active {
          color: var(--ddd-theme-default-skyBlue);
          background-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
        }
        .status {
          font-size: var(--ddd-font-size-5xs);
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
        .preview-details {
          margin: 0;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          border-bottom: var(--ddd-border-xs) solid
            var(--ddd-theme-default-limestoneGray);
        }
        .preview-details summary {
          font-size: var(--ddd-font-size-5xs);
          font-weight: var(--ddd-font-weight-medium);
          cursor: pointer;
        }
        .preview-details[open] summary {
          margin-bottom: var(--ddd-spacing-2);
        }
        .preview-details-empty {
          font-size: var(--ddd-font-size-5xs);
        }
        .details-json {
          margin-top: 0;
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
        .preview-rendered {
          font-size: var(--ddd-font-size-6xs);
          line-height: 1.6;
        }
        .preview-rendered * {
          max-width: 100%;
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
      this.selectedItemMetadata = null;
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
    if (this._isCurrentRevisionHash(normalizedHash)) {
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
    this.selectedItemMetadata =
      data.itemMetadata && typeof data.itemMetadata === "object"
        ? data.itemMetadata
        : null;
    if (this.selectedRevision && this.selectedRevision.hash) {
      this.selectedHash = this.selectedRevision.hash;
    }
    if (
      this.selectedItemMetadata &&
      typeof this.selectedItemMetadata.title === "string" &&
      this.selectedItemMetadata.title.trim() !== ""
    ) {
      this.nodeTitle = this.selectedItemMetadata.title.trim();
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
  _isCurrentRevisionHash(hash) {
    const normalizedHash = this._normalizeNodeId(hash);
    if (!normalizedHash || !Array.isArray(this.revisions) || this.revisions.length === 0) {
      return false;
    }
    const firstRevision = this.revisions[0];
    if (!firstRevision || !firstRevision.hash) {
      return false;
    }
    return this._normalizeNodeId(firstRevision.hash) === normalizedHash;
  }

  _handleTableActionClick(e) {
    const actionTarget = this._actionTargetFromEvent(e);
    if (!actionTarget) {
      return;
    }
    if (actionTarget.hasAttribute("disabled")) {
      return;
    }
    const hash = this._normalizeNodeId(actionTarget.getAttribute("data-hash"));
    if (!hash) {
      return;
    }
    if (this._isCurrentRevisionHash(hash)) {
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
    if (this._isCurrentRevisionHash(hash)) {
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
  _setPreviewMode(e) {
    const target = e && e.currentTarget ? e.currentTarget : null;
    if (!target || !target.getAttribute) {
      return;
    }
    const requestedMode = target.getAttribute("data-preview-mode");
    if (requestedMode === "source" || requestedMode === "rendered") {
      this.previewMode = requestedMode;
    }
  }

  _renderPreviewContent() {
    if (this.revisionLoading) {
      return html`<div class="loading">Loading revision preview…</div>`;
    }
    if (!this.previewContent) {
      return html`<div class="empty">No revision content loaded.</div>`;
    }
    if (this.previewMode === "rendered") {
      return html`<div class="preview-rendered">${unsafeHTML(
        this.previewContent,
      )}</div>`;
    }
    return html`<pre>${this.previewContent}</pre>`;
  }

  render() {
    const pageLabel = this.nodeTitle || this.nodeId;
    const selectedItemMetadata =
      this.selectedItemMetadata && typeof this.selectedItemMetadata === "object"
        ? this.selectedItemMetadata
        : null;
    const selectedTitle =
      selectedItemMetadata &&
      typeof selectedItemMetadata.title === "string" &&
      selectedItemMetadata.title.trim() !== ""
        ? selectedItemMetadata.title.trim()
        : "";
    const previewTitle = selectedTitle || pageLabel || "Revision preview";
    const revisionDetails = {};
    if (this.selectedRevision && typeof this.selectedRevision === "object") {
      revisionDetails.revision = this.selectedRevision;
    }
    if (selectedItemMetadata) {
      revisionDetails.itemMetadata = selectedItemMetadata;
    }
    const revisionDetailsKeys = Object.keys(revisionDetails);
    const revisionDetailsJson =
      revisionDetailsKeys.length > 0
        ? JSON.stringify(revisionDetails, null, 2)
        : "";
    return html`
      <div class="shell">
        <section class="panel">
          <div class="panel-header">
            <span class="panel-header-title"
              >Revisions for ${pageLabel || "page"}</span
            >
          </div>
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
                          (revision, index) => {
                            const isCurrentRevision = index === 0;
                            return html`
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
                                    ?disabled="${isCurrentRevision}"
                                  ></simple-icon-button-lite>
                                  <simple-icon-button-lite
                                    class="action restore"
                                    icon="icons:restore"
                                    label="Restore revision"
                                    title="Restore revision as a new commit"
                                    data-action="restore"
                                    data-hash="${revision.hash || ""}"
                                    ?disabled="${this.restoring || isCurrentRevision}"
                                  ></simple-icon-button-lite>
                                </td>
                              </tr>
                            `;
                          },
                        )}
                      </tbody>
                    </table>
                  </editable-table-display>
                `}
          </div>
          <div class="panel-header">
            <div
              class="preview-toggle"
              role="group"
              aria-label="Revision preview mode"
            >
              <simple-icon-button-lite
                class="mode-toggle ${this.previewMode === "source"
                  ? "active"
                  : ""}"
                icon="code"
                label="HTML source"
                title="Show HTML source"
                data-preview-mode="source"
                aria-pressed="${this.previewMode === "source"
                  ? "true"
                  : "false"}"
                @click="${this._setPreviewMode}"
              ></simple-icon-button-lite>
              <simple-icon-button-lite
                class="mode-toggle ${this.previewMode === "rendered"
                  ? "active"
                  : ""}"
                icon="icons:visibility"
                label="Rendered output"
                title="Show rendered output"
                data-preview-mode="rendered"
                aria-pressed="${this.previewMode === "rendered"
                  ? "true"
                  : "false"}"
                @click="${this._setPreviewMode}"
              ></simple-icon-button-lite>
            </div>
            <span class="panel-header-title" title="${previewTitle}"
              >${previewTitle}</span>
          </div>
          <details class="preview-details">
            <summary>Details</summary>
            ${revisionDetailsJson
              ? html`<pre class="details-json">${revisionDetailsJson}</pre>`
              : html`<div class="preview-details-empty">
                  Select a revision row to load details.
                </div>`}
          </details>
          <div class="preview">${this._renderPreviewContent()}</div>
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

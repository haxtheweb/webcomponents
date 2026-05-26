import { html, css } from "lit";
import { keyed } from "lit/directives/keyed.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/editable-table/lib/editable-table-display.js";
import "@haxtheweb/simple-fields/lib/simple-fields-field.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";

class HAXCMSContentAdminDialog extends DDD {
  static get tag() {
    return "haxcms-content-admin-dialog";
  }

  static get properties() {
    return {
      rows: { type: Array },
      filterField: { type: String, attribute: "filter-field" },
      filterValue: { type: String, attribute: "filter-value" },
      searchMode: { type: String, attribute: "search-mode" },
      searchCaseSensitive: {
        type: Boolean,
        attribute: "search-case-sensitive",
      },
      searchLimit: { type: Number, attribute: "search-limit" },
      searchLoading: { type: Boolean, attribute: "search-loading" },
      searchMatches: { type: Array, attribute: false },
      lastSearchQuery: { type: String, attribute: "last-search-query" },
      operationMode: { type: String, attribute: "operation-mode" },
      replaceValue: { type: String, attribute: "replace-value" },
      replaceLoading: { type: Boolean, attribute: "replace-loading" },
    };
  }

  constructor() {
    super();
    this.rows = [];
    this.filterField = "search";
    this.filterValue = "";
    this.searchMode = "fulltext";
    this.searchCaseSensitive = false;
    this.searchLimit = 25;
    this.searchLoading = false;
    this.searchMatches = null;
    this.lastSearchQuery = "";
    this.operationMode = "search";
    this.replaceValue = "";
    this.replaceLoading = false;
    this.__disposer = [];
    this.__searchResponseHandler = this._onSearchResults.bind(this);
    this.__replaceResponseHandler = this._onReplaceResults.bind(this);
    this.__searchDebounceTimer = null;
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          --haxcms-admin-panel-height: calc(
            var(--simple-modal-height, 85vh) - var(
                --simple-modal-titlebar-height,
                80px
              ) - var(--ddd-spacing-8, 32px)
          );
          display: flex;
          flex-direction: column;
          min-width: 75vw;
          min-height: min(60vh, var(--haxcms-admin-panel-height));
          height: var(--haxcms-admin-panel-height);
          max-height: var(--haxcms-admin-panel-height);
          overflow: hidden;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-5xs, 0.7rem);
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
        .filters {
          border: var(--ddd-border-sm) solid
            var(--ddd-theme-default-limestoneGray);
          border-radius: var(--ddd-radius-md);
          padding: var(--ddd-spacing-3);
          margin: 0 0 var(--ddd-spacing-3) 0;
        }
        .filters-title {
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
        .controls simple-fields-field {
          --simple-fields-font-size: var(--ddd-font-size-4xs);
          --simple-fields-line-height: 1.4;
          --simple-fields-margin: var(--ddd-spacing-1);
          --simple-fields-margin-small: var(--ddd-spacing-1);
          min-width: 180px;
        }
        simple-icon-button-lite.replace-btn {
          --simple-icon-button-border: var(--ddd-border-xs) solid
            var(--ddd-theme-default-navy);
          --simple-icon-button-border-radius: var(--ddd-radius-sm);
          --simple-icon-height: var(--ddd-icon-xxs);
          --simple-icon-width: var(--ddd-icon-xxs);
          color: var(--ddd-theme-default-skyBlue);
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
        .empty {
          margin: var(--ddd-spacing-4) 0;
        }
        .meta {
          margin: 0;
          font-size: var(--ddd-font-size-4xs);
        }
        @media screen and (max-width: 900px) {
          :host {
            min-width: 0;
            width: 100%;
            min-height: 0;
            height: auto;
            max-height: calc(
              100dvh - var(
                  --simple-modal-titlebar-mobile-height,
                  var(--simple-modal-titlebar-height, 80px)
                ) - var(--ddd-spacing-4, 16px)
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
        const items = manifest && manifest.items ? manifest.items : [];
        this.rows = this._buildRows(items);
      }),
    );
    globalThis.addEventListener(
      "haxcms-content-dashboard-search-results",
      this.__searchResponseHandler,
    );
    globalThis.addEventListener(
      "haxcms-content-dashboard-replace-results",
      this.__replaceResponseHandler,
    );
  }

  disconnectedCallback() {
    if (this.__searchDebounceTimer) {
      clearTimeout(this.__searchDebounceTimer);
      this.__searchDebounceTimer = null;
    }
    globalThis.removeEventListener(
      "haxcms-content-dashboard-search-results",
      this.__searchResponseHandler,
    );
    globalThis.removeEventListener(
      "haxcms-content-dashboard-replace-results",
      this.__replaceResponseHandler,
    );
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

  get filteredRows() {
    const value = (this.filterValue || "").toLowerCase().trim();
    const queryMatchesCurrentFilter =
      this.filterField === "search" &&
      this.lastSearchQuery === value &&
      Array.isArray(this.searchMatches);
    const matchedIdSet = queryMatchesCurrentFilter
      ? new Set(this.searchMatches)
      : null;
    return this.rows.filter((row) => {
      if (this.filterField === "visibility") {
        if (this.filterValue === "published" && !row.published) {
          return false;
        }
        if (this.filterValue === "unpublished" && row.published) {
          return false;
        }
        if (this.filterValue === "visible" && !row.visible) {
          return false;
        }
        if (this.filterValue === "not-visible" && row.visible) {
          return false;
        }
        return true;
      }
      if (!value) {
        return true;
      }
      if (this.filterField === "tags") {
        return row.tagsLower.includes(value);
      }
      if (this.filterField === "parents") {
        return row.parentLower.includes(value);
      }
      if (this.filterField === "search") {
        if (matchedIdSet) {
          return matchedIdSet.has(row.id);
        }
        return (
          row.titleLower.includes(value) ||
          row.slugLower.includes(value) ||
          row.parentLower.includes(value) ||
          row.tagsLower.includes(value)
        );
      }
      return true;
    });
  }

  _buildRows(items) {
    const itemMap = {};
    items.forEach((item) => {
      itemMap[item.id] = item;
    });
    return items.map((item) => {
      const metadata = item.metadata || {};
      const parentTitle =
        item.parent && itemMap[item.parent] ? itemMap[item.parent].title : "";
      const tags = this._tagsFromItem(item);
      const published = this._toBoolPublished(metadata.published);
      const visible = this._toBoolVisible(metadata.hideInMenu);
      const updated = this._toNumber(metadata.updated);
      const parentSlug =
        item.parent && itemMap[item.parent]
          ? itemMap[item.parent].slug || ""
          : "";
      return {
        id: item.id,
        title: item.title || "",
        slug: item.slug || "",
        parent: parentTitle,
        parentSlug,
        tags: tags,
        published: published,
        visible: visible,
        statusLabel: published ? "Published" : "Unpublished",
        updated,
        updatedLabel: this._formatRelativeTime(updated),
        titleLower: (item.title || "").toLowerCase(),
        slugLower: (item.slug || "").toLowerCase(),
        parentLower: parentTitle.toLowerCase(),
        tagsLower: tags.toLowerCase(),
      };
    });
  }

  _tagsFromItem(item) {
    const metadata = item.metadata || {};
    if (typeof metadata.tags === "string" && metadata.tags.trim() !== "") {
      return metadata.tags;
    }
    if (
      metadata.contentDetails &&
      metadata.contentDetails.tags &&
      typeof metadata.contentDetails.tags === "object"
    ) {
      return Object.keys(metadata.contentDetails.tags).join(", ");
    }
    return "";
  }

  _toNumber(value) {
    if (typeof value === "number") {
      return value;
    }
    if (typeof value === "string" && value !== "") {
      return parseInt(value);
    }
    return 0;
  }

  _toBoolPublished(value) {
    if (value === false || value === "0" || value === 0) {
      return false;
    }
    return true;
  }

  _toBoolVisible(value) {
    if (value === true || value === "1" || value === 1 || value === "true") {
      return false;
    }
    return true;
  }

  _formatRelativeTime(ts) {
    if (!ts) {
      return "";
    }
    const nowMs = Date.now();
    const ms = ts < 1000000000000 ? ts * 1000 : ts;
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

  _onFilterField(e) {
    this.filterField = e.detail.value;
    if (this.__searchDebounceTimer) {
      clearTimeout(this.__searchDebounceTimer);
      this.__searchDebounceTimer = null;
    }
    this.searchMatches = null;
    this.lastSearchQuery = "";
    this.searchLoading = false;
    this.operationMode = "search";
    this.replaceValue = "";
    this.replaceLoading = false;
    if (this.filterField === "visibility") {
      this.filterValue = "any";
    } else {
      this.filterValue = "";
    }
  }

  _onSearchMode(e) {
    const requestedMode = e.detail.value;
    if (this.operationMode === "replace" && requestedMode === "selector") {
      this.searchMode = "fulltext";
    } else {
      this.searchMode = requestedMode;
    }
    this.searchMatches = null;
    this.lastSearchQuery = "";
    this._debounceSearchRequest();
  }

  _onOperationMode(e) {
    this.operationMode = e.detail.value;
    if (this.operationMode === "replace" && this.searchMode !== "fulltext") {
      this.searchMode = "fulltext";
    }
    this.searchMatches = null;
    this.lastSearchQuery = "";
    this.replaceLoading = false;
    this.replaceValue = "";
    this._debounceSearchRequest();
  }

  _onSearchCaseSensitive(e) {
    this.searchCaseSensitive = e.detail.value === "true";
    this.searchMatches = null;
    this.lastSearchQuery = "";
    this._debounceSearchRequest();
  }

  _onSearchLimit(e) {
    const value = parseInt(e.detail.value);
    if (isNaN(value)) {
      this.searchLimit = 25;
      this._debounceSearchRequest();
      return;
    }
    if (value < 1) {
      this.searchLimit = 1;
      this._debounceSearchRequest();
      return;
    }
    if (value > 200) {
      this.searchLimit = 200;
      this._debounceSearchRequest();
      return;
    }
    this.searchLimit = value;
    this._debounceSearchRequest();
  }

  _debounceSearchRequest() {
    if (this.__searchDebounceTimer) {
      clearTimeout(this.__searchDebounceTimer);
      this.__searchDebounceTimer = null;
    }
    if (this.filterField !== "search") {
      return;
    }
    const query = this.filterValue ? this.filterValue.trim() : "";
    if (!query) {
      this.searchLoading = false;
      this.searchMatches = null;
      this.lastSearchQuery = "";
      return;
    }
    this.__searchDebounceTimer = setTimeout(() => {
      this.__searchDebounceTimer = null;
      this._applySearch();
    }, 600);
  }

  _onSearchInputKeydown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (this.__searchDebounceTimer) {
        clearTimeout(this.__searchDebounceTimer);
        this.__searchDebounceTimer = null;
      }
      this._applySearch();
    }
  }

  _onFilterValue(e) {
    this.filterValue = e.detail.value;
    if (this.filterField === "search") {
      this.searchMatches = null;
      this.lastSearchQuery = "";
      this._debounceSearchRequest();
    }
  }

  _onReplaceValue(e) {
    this.replaceValue = e.detail.value;
  }

  _onSearchResults(e) {
    if (!e.detail) {
      return;
    }
    if (this.filterField !== "search") {
      return;
    }
    const query = e.detail.query
      ? String(e.detail.query).toLowerCase().trim()
      : "";
    const matches = Array.isArray(e.detail.matches) ? e.detail.matches : [];
    const ids = [];
    matches.forEach((match) => {
      if (typeof match === "string") {
        ids.push(match);
      } else if (match && typeof match === "object") {
        if (typeof match.id === "string") {
          ids.push(match.id);
        } else if (typeof match.id === "number") {
          ids.push(String(match.id));
        }
      }
    });
    this.searchLoading = false;
    this.lastSearchQuery = query;
    this.searchMatches = [...new Set(ids)];
  }

  _onReplaceResults(e) {
    this.replaceLoading = false;
    const detail = e && e.detail ? e.detail : {};
    const data = detail && detail.data ? detail.data : {};
    const updatedItems =
      typeof data.updatedItems === "number" ? data.updatedItems : 0;
    const totalReplacements =
      typeof data.totalReplacements === "number" ? data.totalReplacements : 0;
    store.toast(
      `Updated ${updatedItems} page${updatedItems === 1 ? "" : "s"} with ${totalReplacements} replacement${totalReplacements === 1 ? "" : "s"}.`,
      3000,
      { hat: "construction" },
    );
    this._applySearch();
  }

  _searchMatchCount() {
    if (this.filterField !== "search") {
      return 0;
    }
    const query = this.filterValue ? this.filterValue.toLowerCase().trim() : "";
    if (!query || this.lastSearchQuery !== query) {
      return 0;
    }
    if (!Array.isArray(this.searchMatches)) {
      return 0;
    }
    return this.searchMatches.length;
  }

  _canRunReplace() {
    if (this.filterField !== "search" || this.operationMode !== "replace") {
      return false;
    }
    if (this.searchMode !== "fulltext") {
      return false;
    }
    const searchTerm = this.filterValue ? this.filterValue.trim() : "";
    if (searchTerm.length <= 1) {
      return false;
    }
    if (this.searchLoading || this.replaceLoading) {
      return false;
    }
    if (this._searchMatchCount() < 1) {
      return false;
    }
    const replaceLength = this.replaceValue
      ? this.replaceValue.trim().length
      : 0;
    if (replaceLength === 1) {
      return false;
    }
    return replaceLength === 0 || replaceLength > 1;
  }

  _applyReplace() {
    if (!this._canRunReplace()) {
      return;
    }
    const searchTerm = this.filterValue ? this.filterValue.trim() : "";
    const replacement = this.replaceValue ? this.replaceValue.trim() : "";
    const confirmation = globalThis.confirm(
      "This bulk replacement cannot be undone. Continue?",
    );
    if (!confirmation) {
      return;
    }
    let emptyReplacementConfirmed = false;
    if (replacement === "") {
      emptyReplacementConfirmed = globalThis.confirm(
        "Replacement text is empty, so this will remove all matches. Confirm again to continue.",
      );
      if (!emptyReplacementConfirmed) {
        return;
      }
    }
    this.replaceLoading = true;
    this.dispatchEvent(
      new CustomEvent("haxcms-content-dashboard-operation", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          operation: "replace",
          search: searchTerm,
          replace: replacement,
          searchMode: "fulltext",
          searchSelector: false,
          searchField: "content",
          searchCaseSensitive: this.searchCaseSensitive === true,
          replaceConfirm: confirmation,
          replaceDestroyConfirm: emptyReplacementConfirmed,
        },
      }),
    );
  }

  _applySearch() {
    if (this.filterField !== "search") {
      return;
    }
    const query = this.filterValue ? this.filterValue.trim() : "";
    if (!query) {
      return;
    }
    this.searchLoading = true;
    this.searchMatches = null;
    this.lastSearchQuery = query.toLowerCase();
    const searchMode = this.searchMode || "fulltext";
    const selectorMode = searchMode === "selector";
    const detail = {
      operation: "search",
      search: query,
      searchMode,
      searchSelector: selectorMode,
      searchField: "all",
      searchLimit: this.searchLimit,
      searchCaseSensitive: this.searchCaseSensitive === true,
    };
    if (selectorMode) {
      detail.searchField = "content";
    }
    this.dispatchEvent(
      new CustomEvent("haxcms-content-dashboard-operation", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: detail,
      }),
    );
  }

  _searchPlaceholder() {
    if (this.filterField === "tags") {
      return "Tag";
    }
    if (this.filterField === "parents") {
      return "Parent page title";
    }
    if (this.filterField === "search") {
      if (this.searchMode === "selector") {
        return 'Simple selector (example: h2, a[href], img[alt=""])';
      }
      return "Text to find across title, tags, and content";
    }
    return "Filter value";
  }

  render() {
    return html`
      <div class="panel-shell">
        <div class="panel-scroll">
          <div class="filters">
            <h3 class="filters-title">Show only items where</h3>
            <div class="controls">
              <simple-fields-field
                type="select"
                label="Filter by"
                .value="${this.filterField}"
                .itemsList="${[
                  { value: "search", text: "Search content" },
                  { value: "visibility", text: "Visibility" },
                  { value: "tags", text: "Tags" },
                  { value: "parents", text: "Parent page" },
                ]}"
                @value-changed="${this._onFilterField}"
              ></simple-fields-field>
              ${this.filterField === "visibility"
                ? html`<simple-fields-field
                    type="select"
                    label="Value"
                    .value="${this.filterValue}"
                    .itemsList="${[
                      { value: "any", text: "Any" },
                      { value: "published", text: "Published" },
                      { value: "unpublished", text: "Unpublished" },
                      { value: "visible", text: "Visible" },
                      { value: "not-visible", text: "Not visible" },
                    ]}"
                    @value-changed="${this._onFilterValue}"
                  ></simple-fields-field>`
                : html`<simple-fields-field
                    type="text"
                    label="Value"
                    .value="${this.filterValue}"
                    placeholder="${this._searchPlaceholder()}"
                    @value-changed="${this._onFilterValue}"
                    @keydown="${this._onSearchInputKeydown}"
                  ></simple-fields-field>`}
              ${this.filterField === "search"
                ? html`
                    <simple-fields-field
                      type="select"
                      label="Mode"
                      .value="${this.operationMode}"
                      .itemsList="${[
                        { value: "search", text: "Search" },
                        { value: "replace", text: "Search and replace" },
                      ]}"
                      @value-changed="${this._onOperationMode}"
                    ></simple-fields-field>
                    <simple-fields-field
                      type="select"
                      label="Search type"
                      .value="${this.searchMode}"
                      .itemsList="${[
                        { value: "fulltext", text: "Full text" },
                        { value: "selector", text: "Query selector" },
                      ]}"
                      @value-changed="${this._onSearchMode}"
                    ></simple-fields-field>
                    <simple-fields-field
                      type="select"
                      label="Case sensitive"
                      .value="${this.searchCaseSensitive ? "true" : "false"}"
                      .itemsList="${[
                        { value: "false", text: "No" },
                        { value: "true", text: "Yes" },
                      ]}"
                      @value-changed="${this._onSearchCaseSensitive}"
                    ></simple-fields-field>
                    <simple-fields-field
                      type="number"
                      label="Limit"
                      min="1"
                      max="200"
                      .value="${String(this.searchLimit)}"
                      @value-changed="${this._onSearchLimit}"
                    ></simple-fields-field>
                    ${this.operationMode === "replace"
                      ? html`
                          <simple-fields-field
                            type="text"
                            label="Replace with"
                            .value="${this.replaceValue}"
                            placeholder="Replacement phrase (leave empty to remove)"
                            @value-changed="${this._onReplaceValue}"
                          ></simple-fields-field>
                          <simple-icon-button-lite
                            class="replace-btn"
                            icon="find-replace"
                            label="${this.replaceLoading ? "Replacing…" : "Replace"}"
                            ?disabled="${!this._canRunReplace()}"
                            @click="${this._applyReplace}"
                          ></simple-icon-button-lite>
                        `
                      : ``}
                    <p class="meta" role="status" aria-live="polite">
                      ${this.searchLoading
                        ? "Searching…"
                        : `${this._searchMatchCount()} match${this._searchMatchCount() === 1 ? "" : "es"}`}
                    </p>
                  `
                : ``}
            </div>
          </div>
          ${this.filteredRows.length === 0
            ? html`<div class="empty">No matching content found.</div>`
            : keyed(
                `${this.filterField}|${this.filterValue}|${this.filteredRows.length}`,
                html`<div class="table-scroll">
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
                          <th>Title</th>
                          <th>Status</th>
                          <th>Updated</th>
                          <th>Parent</th>
                          <th>Slug</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${this.filteredRows.map(
                          (row) => html`
                            <tr>
                              <td><a href="${row.slug}">${row.title}</a></td>
                              <td>${row.statusLabel}</td>
                              <td>${row.updatedLabel}</td>
                              <td>
                                ${row.parentSlug
                                  ? html`<a href="${row.parentSlug}"
                                      >${row.parent}</a
                                    >`
                                  : html`—`}
                              </td>
                              <td>${row.slug}</td>
                            </tr>
                          `,
                        )}
                      </tbody>
                    </table>
                  </editable-table-display>
                </div>`,
              )}
        </div>
      </div>
    `;
  }
}

globalThis.customElements.define(
  HAXCMSContentAdminDialog.tag,
  HAXCMSContentAdminDialog,
);

export { HAXCMSContentAdminDialog };

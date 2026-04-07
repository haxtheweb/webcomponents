import { html, css } from "lit";
import { keyed } from "lit/directives/keyed.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/editable-table/editable-table.js";

class HAXCMSContentAdminDialog extends DDD {
  static get tag() {
    return "haxcms-content-admin-dialog";
  }

  static get properties() {
    return {
      rows: { type: Array },
      filterField: { type: String, attribute: "filter-field" },
      filterValue: { type: String, attribute: "filter-value" },
      searchLoading: { type: Boolean, attribute: "search-loading" },
      searchMatches: { type: Array, attribute: false },
      lastSearchQuery: { type: String, attribute: "last-search-query" },
    };
  }

  constructor() {
    super();
    this.rows = [];
    this.filterField = "visibility";
    this.filterValue = "any";
    this.searchLoading = false;
    this.searchMatches = null;
    this.lastSearchQuery = "";
    this.__disposer = [];
    this.__searchResponseHandler = this._onSearchResults.bind(this);
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
          border: var(--ddd-border-sm) solid var(--ddd-theme-default-limestoneGray);
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
          --editable-table-font-size: var(--ddd-font-size-5xs, 0.7rem);
        }
        .empty {
          margin: var(--ddd-spacing-4) 0;
        }
      `,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    const reaction = autorun(() => {
      const manifest = toJS(store.manifest);
      const items = manifest && manifest.items ? manifest.items : [];
      this.rows = this._buildRows(items);
    });
    this.__disposer.push(reaction);
    globalThis.addEventListener(
      "haxcms-content-dashboard-search-results",
      this.__searchResponseHandler,
    );
  }

  disconnectedCallback() {
    globalThis.removeEventListener(
      "haxcms-content-dashboard-search-results",
      this.__searchResponseHandler,
    );
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
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
        item.parent && itemMap[item.parent] ? itemMap[item.parent].slug || "" : "";
      return {
        id: item.id,
        title: item.title || "",
        slug: item.slug || "",
        parent: parentTitle,
        parentSlug,
        tags: tags,
        published: published,
        visible: visible,
        statusLabel: published ? "published" : "unpublished",
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
    this.filterField = e.target.value;
    this.searchMatches = null;
    this.lastSearchQuery = "";
    this.searchLoading = false;
    if (this.filterField === "visibility") {
      this.filterValue = "any";
    } else {
      this.filterValue = "";
    }
  }

  _onFilterValue(e) {
    this.filterValue = e.target.value;
    if (this.filterField === "search") {
      this.searchMatches = null;
      this.lastSearchQuery = "";
    }
  }

  _onSearchResults(e) {
    if (!e.detail) {
      return;
    }
    if (this.filterField !== "search") {
      return;
    }
    const query = e.detail.query ? String(e.detail.query).toLowerCase().trim() : "";
    const matches = Array.isArray(e.detail.matches) ? e.detail.matches : [];
    this.searchLoading = false;
    this.lastSearchQuery = query;
    this.searchMatches = matches;
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
    this.dispatchEvent(
      new CustomEvent("haxcms-content-dashboard-operation", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          operation: "search",
          query,
        },
      }),
    );
  }

  _searchPlaceholder() {
    if (this.filterField === "tags") {
      return "tag name";
    }
    if (this.filterField === "parents") {
      return "parent title";
    }
    if (this.filterField === "search") {
      return "title or content (eg: <h2 class..)";
    }
    return "filter value";
  }

  render() {
    return html`
      <div class="panel-shell">
        <div class="panel-scroll">
          <div class="filters">
            <h3 class="filters-title">Show only items where</h3>
            <div class="controls">
              <label>
                filter by
                <select .value="${this.filterField}" @change="${this._onFilterField}">
                  <option value="visibility">visibility</option>
                  <option value="tags">tags</option>
                  <option value="parents">parents</option>
                  <option value="search">search content</option>
                </select>
              </label>
              ${this.filterField === "visibility"
                ? html`<label>
                    value
                    <select .value="${this.filterValue}" @change="${this._onFilterValue}">
                      <option value="any">any</option>
                      <option value="published">published</option>
                      <option value="unpublished">unpublished</option>
                      <option value="visible">visible</option>
                      <option value="not-visible">not visible</option>
                    </select>
                  </label>`
                : html`<label>
                    value
                    <input
                      type="text"
                      .value="${this.filterValue}"
                      @input="${this._onFilterValue}"
                      placeholder="${this._searchPlaceholder()}"
                    />
                  </label>`}
              ${this.filterField === "search"
                ? html`<button
                    @click="${this._applySearch}"
                    ?disabled="${!this.filterValue || this.searchLoading}"
                  >
                    ${this.searchLoading ? "Searching..." : "Search content"}
                  </button>`
                : ``}
            </div>
          </div>
          ${this.filteredRows.length === 0
            ? html`<div class="empty">No matching content found.</div>`
            : keyed(
                `${this.filterField}|${this.filterValue}|${this.filteredRows.length}`,
                html`<editable-table bordered condensed column-header sort striped scroll>
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
                                ? html`<a href="${row.parentSlug}">${row.parent}</a>`
                                : html`—`}
                            </td>
                            <td>${row.slug}</td>
                          </tr>
                        `,
                      )}
                    </tbody>
                  </table>
                </editable-table>`,
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

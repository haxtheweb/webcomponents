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
      selectedIds: { type: Array },
      textFilter: { type: String, attribute: "text-filter" },
      statusFilter: { type: String, attribute: "status-filter" },
      searchText: { type: String, attribute: "search-text" },
    };
  }

  constructor() {
    super();
    this.rows = [];
    this.selectedIds = [];
    this.textFilter = "";
    this.statusFilter = "any";
    this.searchText = "";
    this.__disposer = [];
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          min-width: 75vw;
          min-height: 70vh;
          overflow: auto;
          padding: var(--ddd-spacing-4);
          font-family: var(--ddd-font-navigation);
        }
        .filters,
        .bulk,
        .search {
          border: var(--ddd-border-sm) solid var(--ddd-theme-default-limestoneGray);
          border-radius: var(--ddd-radius-md);
          padding: var(--ddd-spacing-3);
          margin: 0 0 var(--ddd-spacing-3) 0;
        }
        .filters-title,
        .bulk-title,
        .search-title {
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
        .selected-count {
          font-size: var(--ddd-font-size-4xs);
          margin: var(--ddd-spacing-2) 0 0 0;
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
      this._syncSelectionToRows();
    });
    this.__disposer.push(reaction);
  }

  disconnectedCallback() {
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    super.disconnectedCallback();
  }

  get filteredRows() {
    const txt = (this.textFilter || "").toLowerCase().trim();
    return this.rows.filter((row) => {
      if (this.statusFilter === "published" && !row.published) {
        return false;
      }
      if (this.statusFilter === "unpublished" && row.published) {
        return false;
      }
      if (!txt) {
        return true;
      }
      return (
        row.titleLower.includes(txt) ||
        row.slugLower.includes(txt) ||
        row.parentLower.includes(txt) ||
        row.tagsLower.includes(txt)
      );
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
      const updated = this._toNumber(metadata.updated);
      return {
        id: item.id,
        title: item.title || "",
        slug: item.slug || "",
        parent: parentTitle,
        tags: tags,
        published: published,
        statusLabel: published ? "published" : "unpublished",
        updated,
        updatedLabel: this._formatDateForSort(updated),
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

  _formatDateForSort(ts) {
    if (!ts) {
      return "";
    }
    const d = new Date(ts * 1000);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hrs = String(d.getHours()).padStart(2, "0");
    const mins = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hrs}:${mins}`;
  }

  _syncSelectionToRows() {
    const validIds = new Set(this.rows.map((row) => row.id));
    this.selectedIds = this.selectedIds.filter((id) => validIds.has(id));
  }

  _onTextFilter(e) {
    this.textFilter = e.target.value;
  }

  _onStatusFilter(e) {
    this.statusFilter = e.target.value;
  }

  _selectAllVisible() {
    this.selectedIds = this.filteredRows.map((row) => row.id);
  }

  _clearSelection() {
    this.selectedIds = [];
  }

  _onSelectRow(e) {
    const id = e.target.getAttribute("data-id");
    if (!id) {
      return;
    }
    const selected = new Set(this.selectedIds);
    if (e.target.checked) {
      selected.add(id);
    } else {
      selected.delete(id);
    }
    this.selectedIds = Array.from(selected);
  }

  _applyBulkOperation() {
    const select = this.shadowRoot.querySelector("#bulk-action");
    const action = select ? select.value : "";
    if (!action || this.selectedIds.length === 0) {
      return;
    }
    if (
      action === "delete" &&
      !globalThis.confirm(
        `Delete ${this.selectedIds.length} selected item(s)? This cannot be undone.`,
      )
    ) {
      return;
    }
    this.dispatchEvent(
      new CustomEvent("haxcms-content-dashboard-operation", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          operation: action,
          itemIds: [...this.selectedIds],
        },
      }),
    );
  }

  _onSearchText(e) {
    this.searchText = e.target.value;
  }

  _applySearch() {
    if (!this.searchText || this.searchText.trim() === "") {
      return;
    }
    this.dispatchEvent(
      new CustomEvent("haxcms-content-dashboard-operation", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          operation: "search",
          query: this.searchText,
        },
      }),
    );
  }

  render() {
    return html`
      <div class="filters">
        <h3 class="filters-title">Show only items where</h3>
        <div class="controls">
          <label>
            status
            <select .value="${this.statusFilter}" @change="${this._onStatusFilter}">
              <option value="any">any</option>
              <option value="published">published</option>
              <option value="unpublished">unpublished</option>
            </select>
          </label>
          <label>
            text
            <input
              type="text"
              .value="${this.textFilter}"
              @input="${this._onTextFilter}"
              placeholder="title, parent, tags, slug"
            />
          </label>
          <button @click="${this._selectAllVisible}" ?disabled="${this.filteredRows.length === 0}">
            Select all shown
          </button>
          <button @click="${this._clearSelection}" ?disabled="${this.selectedIds.length === 0}">
            Clear selection
          </button>
        </div>
      </div>
      <div class="bulk" ?hidden="${this.selectedIds.length === 0}">
        <h3 class="bulk-title">Update options</h3>
        <div class="controls">
          <label>
            action
            <select id="bulk-action">
              <option value="publish">Publish selected content</option>
              <option value="unpublish">Unpublish selected content</option>
              <option value="delete">Delete selected content</option>
            </select>
          </label>
          <button @click="${this._applyBulkOperation}">Update</button>
        </div>
        <div class="selected-count">${this.selectedIds.length} selected</div>
      </div>
      <div class="search">
        <h3 class="search-title">Search content</h3>
        <div class="controls">
          <label>
            query
            <input type="text" .value="${this.searchText}" @input="${this._onSearchText}" />
          </label>
          <button @click="${this._applySearch}" ?disabled="${!this.searchText}">
            Search
          </button>
        </div>
      </div>
      ${this.filteredRows.length === 0
        ? html`<div class="empty">No matching content found.</div>`
        : keyed(
            `${this.statusFilter}|${this.textFilter}|${this.filteredRows.length}`,
            html`<editable-table bordered condensed column-header sort striped scroll>
              <table>
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Updated</th>
                    <th>Parent</th>
                    <th>Tags</th>
                    <th>Slug</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.filteredRows.map(
                    (row) => html`
                      <tr>
                        <td>
                          <input
                            type="checkbox"
                            aria-label="Select ${row.title}"
                            data-id="${row.id}"
                            .checked="${this.selectedIds.includes(row.id)}"
                            @change="${this._onSelectRow}"
                          />
                        </td>
                        <td><a href="${row.slug}">${row.title}</a></td>
                        <td>${row.statusLabel}</td>
                        <td>${row.updatedLabel}</td>
                        <td>${row.parent}</td>
                        <td>${row.tags}</td>
                        <td>${row.slug}</td>
                      </tr>
                    `,
                  )}
                </tbody>
              </table>
            </editable-table>`,
          )}
    `;
  }
}

globalThis.customElements.define(
  HAXCMSContentAdminDialog.tag,
  HAXCMSContentAdminDialog,
);

export { HAXCMSContentAdminDialog };

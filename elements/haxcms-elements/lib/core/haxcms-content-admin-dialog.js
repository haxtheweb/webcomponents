import { html, css, nothing } from "lit";
import { keyed } from "lit/directives/keyed.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/editable-table/lib/editable-table-display.js";
import "@haxtheweb/simple-fields/lib/simple-fields-field.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-pager/simple-pager.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import {
  HaxUiAdminTokens,
  HaxUiAdminPrimitives,
} from "@haxtheweb/hax-body/lib/hax-ui-styles.js";

// Match the items-per-page choices used by haxcms-files-admin-dialog so the
// content admin's pagination feels consistent with the files admin.
const PAGE_SIZE_OPTIONS = [10, 25, 50, 75, 100, 250, 500];

/**
 * `haxcms-content-admin-dialog`
 * The Content admin section: every page, with search, filters and find /
 * replace across pages. Inside the one admin dialog (haxcms-site-admin) it
 * is a "selection" section: in "Search and replace" mode it reports the
 * matched pages and a Replace action with `haxcms-admin-section-state`, and
 * the shell's action bar calls `runAction("replace")`, which runs the same
 * confirms and fires the same `haxcms-content-dashboard-operation` as the
 * Replace button it replaces (still shown when not in the shell).
 * Opening a page's revisions leaves the shell (Revisions is its own dialog).
 */
class HAXCMSContentAdminDialog extends I18NMixin(DDD) {
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
      pageLimit: { type: Number, attribute: "page-limit" },
      pageOffset: { type: Number, attribute: "page-offset" },
      /** set by haxcms-site-admin: the shell owns the Replace button */
      inShell: { type: Boolean, attribute: "in-shell", reflect: true },
    };
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      noPagesMatch: "No pages match",
      onePageMatches: "1 page matches",
      manyPagesMatch: "{count} pages match",
      published: "Published",
      unpublished: "Unpublished",
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
      bulkReplaceConfirm: "This bulk replacement cannot be undone. Continue?",
      emptyReplacementConfirm:
        "Replacement text is empty, so this will remove all matches. Confirm again to continue.",
      tag: "Tag",
      parentPageTitle: "Parent page title",
      selectorPlaceholder:
        'Simple selector (example: h2, a[href], img[alt=""])',
      fullTextPlaceholder: "Text to find across title, tags, and content",
      filterValue: "Filter value",
      showOnlyItemsWhere: "Show only items where",
      filterBy: "Filter by",
      searchContent: "Search content",
      visibility: "Visibility",
      tags: "Tags",
      parentPage: "Parent page",
      value: "Value",
      any: "Any",
      visible: "Visible",
      notVisible: "Not visible",
      mode: "Mode",
      search: "Search",
      searchAndReplace: "Search and replace",
      searchType: "Search type",
      fullText: "Full text",
      querySelector: "Query selector",
      caseSensitive: "Case sensitive",
      no: "No",
      yes: "Yes",
      perPage: "Per page",
      replaceWith: "Replace with",
      replacementPlaceholder: "Replacement phrase (leave empty to remove)",
      replacing: "Replacing…",
      replace: "Replace",
      searching: "Searching…",
      matchCountSingular: "{count} match",
      matchCountPlural: "{count} matches",
      noMatchingContent: "No matching content found.",
      title: "Title",
      status: "Status",
      updated: "Updated",
      parent: "Parent",
      slug: "Slug",
      actions: "Actions",
      viewRevisions: "View revisions",
      viewPageRevisions: "View page revisions",
      contentPagination: "Content pagination",
      replaceSummary:
        "Updated {pageCount} {pageUnit} with {replacementCount} {replacementUnit}.",
      pageUnit: "page",
      pagesUnit: "pages",
      replacementUnit: "replacement",
      replacementsUnit: "replacements",
      replaceCannotBeUndone: "This bulk replacement cannot be undone.",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../locales/", import.meta.url).href,
    });
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
    this.pageLimit = 25;
    this.pageOffset = 0;
    this.inShell = false;
    this.__disposer = [];
    this.__searchResponseHandler = this._onSearchResults.bind(this);
    this.__replaceResponseHandler = this._onReplaceResults.bind(this);
    this.__triggerUpdateHandler = this.__handleTriggerUpdate.bind(this);
  }

  static get styles() {
    return [
      super.styles,
      ...HaxUiAdminTokens,
      ...HaxUiAdminPrimitives,
      css`
        :host {
          --haxcms-admin-panel-height: calc(
            var(--simple-modal-height, 80vh) - var(
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
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
        }
        :host([in-shell]) {
          display: block;
          min-width: 0;
          min-height: 0;
          height: auto;
          max-height: none;
          overflow: visible;
        }
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }
        simple-icon-lite {
          --simple-icon-width: var(--hax-ui-icon);
          --simple-icon-height: var(--hax-ui-icon);
          --simple-icon-color: currentColor;
          flex: none;
        }
        .panel-shell {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
          padding: var(--ddd-spacing-4, 16px);
          gap: var(--hax-ui-gap-lg);
        }
        :host([in-shell]) .panel-shell {
          padding: var(--hax-ui-gap-lg) var(--ddd-spacing-5, 20px)
            var(--ddd-spacing-6, 24px);
        }
        .panel-scroll {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
        }
        :host([in-shell]) .panel-scroll {
          overflow: visible;
        }
        .filters {
          margin: 0 0 var(--hax-ui-gap-lg) 0;
          padding-bottom: var(--hax-ui-gap-lg);
          border-bottom: 1px solid var(--hax-ui-line);
        }
        .filters-title {
          margin: 0 0 var(--hax-ui-gap-md) 0;
          font-size: var(--hax-ui-admin-font-size);
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .controls {
          display: flex;
          flex-wrap: wrap;
          gap: var(--hax-ui-gap-md);
          align-items: center;
        }
        .seg {
          display: inline-flex;
          height: var(--hax-ui-row-height);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          overflow: hidden;
        }
        .seg button {
          all: unset;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: var(--hax-ui-gap);
          padding: 0 var(--hax-ui-gap-lg);
          font-size: 13px;
          color: var(--hax-ui-text-muted);
        }
        .seg button + button {
          border-left: 1px solid var(--hax-ui-line-strong);
        }
        .seg button:hover {
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-hover);
        }
        .seg button[aria-pressed="true"] {
          font-weight: var(--ddd-font-weight-bold, 700);
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-accent-soft);
        }
        .field {
          display: inline-flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          height: var(--hax-ui-row-height);
          padding: 0 var(--hax-ui-gap-lg);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
          background-color: var(--hax-ui-surface);
        }
        .field:focus-within {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 1px;
        }
        .field input,
        .field select {
          all: unset;
          min-width: 0;
          font-family: var(--ddd-font-primary, sans-serif);
          font-size: var(--hax-ui-admin-font-size);
          color: var(--hax-ui-text);
        }
        .field.query input {
          width: 240px;
        }
        .field.replacement input {
          width: 200px;
        }
        .seg button:focus-visible,
        .btn:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        .btn {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: var(--hax-ui-gap);
          height: var(--hax-ui-row-height);
          padding: 0 var(--hax-ui-gap-lg);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          font-size: 13px;
          font-weight: var(--ddd-font-weight-medium, 500);
          white-space: nowrap;
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
        }
        .btn:hover {
          background-color: var(--hax-ui-hover);
        }
        .btn.danger:not([disabled]) {
          color: var(--hax-ui-danger);
          border-color: var(--hax-ui-danger);
        }
        .btn[disabled] {
          cursor: default;
          color: var(--hax-ui-text-muted);
        }
        .meta {
          margin: 0 0 0 auto;
          font-size: var(--hax-ui-admin-font-size-xs);
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
          color: var(--hax-ui-text-muted);
        }
        .note {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          margin-top: var(--hax-ui-gap-lg);
          padding: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
          border-radius: var(--hax-ui-radius);
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-danger);
          background-color: var(--hax-ui-danger-soft);
        }
        editable-table-display {
          --ddd-theme-body-font-size: var(--hax-ui-admin-font-size-xs);
          --editable-table-font-family: var(--hax-ui-admin-font-family);
          --editable-table-font-size: var(--hax-ui-admin-font-size-xs);
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
        simple-icon-button-lite.row-action {
          --simple-icon-button-border: 1px solid var(--hax-ui-line);
          --simple-icon-button-border-radius: var(--hax-ui-radius);
          --simple-icon-height: var(--hax-ui-icon);
          --simple-icon-width: var(--hax-ui-icon);
        }
        simple-pager {
          --simple-pager-font-size: var(--hax-ui-admin-font-size-xs);
        }
        .empty {
          margin: var(--ddd-spacing-4, 16px) 0;
          color: var(--hax-ui-text-muted);
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
            padding: var(--ddd-spacing-3, 12px);
          }
          :host([in-shell]) {
            max-height: none;
            overflow: visible;
            padding: 0;
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
          }
          .meta {
            margin-left: 0;
          }
        }
      `,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.__disposer.push(
      autorun(() => {
        const _mobx_val_0 = toJS(store.manifest);
        Promise.resolve().then(() => {
          const manifest = _mobx_val_0;
          const items = manifest && manifest.items ? manifest.items : [];
          this.rows = this._buildRows(items);
        });
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
    // haxcms-site-editor-ui dispatches this globally after outline / manifest
    // saves and after the platform settings/manifest detail patches land.
    // The store.manifest autorun picks up the data change, but the slotted
    // <editable-table-display> needs an explicit requestUpdate so the table
    // body re-imports the freshly rendered HTML — mirrors the same hook
    // haxcms-files-admin-dialog uses (_requestTableUpdate) to refresh after
    // an operation so users see the latest rows without re-opening the modal.
    globalThis.addEventListener(
      "haxcms-trigger-update",
      this.__triggerUpdateHandler,
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
    globalThis.removeEventListener(
      "haxcms-trigger-update",
      this.__triggerUpdateHandler,
    );
    for (let i in this.__disposer) {
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

  updated(cp) {
    if (super.updated) {
      super.updated(cp);
    }
    if (
      cp.has("filterField") ||
      cp.has("filterValue") ||
      cp.has("searchMatches") ||
      cp.has("rows")
    ) {
      this.pageOffset = 0;
    }
    if (
      [
        "rows",
        "filterField",
        "filterValue",
        "operationMode",
        "searchMode",
        "searchMatches",
        "lastSearchQuery",
        "searchLoading",
        "replaceValue",
        "replaceLoading",
      ].some((key) => cp.has(key))
    ) {
      this._emitState();
    }
  }

  get _replaceMode() {
    return this.filterField === "search" && this.operationMode === "replace";
  }

  /** the shell's selection bar action: Replace, in Search and replace mode */
  get selectionActions() {
    if (!this._replaceMode) {
      return [];
    }
    return [
      {
        id: "replace",
        label: this.replaceLoading ? this.t.replacing : this.t.replace,
        icon: "",
        danger: true,
        disabled: !this._canRunReplace(),
      },
    ];
  }

  /** words for the shell's selection bar: matched pages, not a selection */
  _selectionText() {
    if (!this._replaceMode) {
      return "";
    }
    const count = this._searchMatchCount();
    if (count === 0) {
      return this.t.noPagesMatch;
    }
    return count === 1
      ? this.t.onePageMatches
      : this.t.manyPagesMatch.replace("{count}", () => count);
  }

  _emitState() {
    this.dispatchEvent(
      new CustomEvent("haxcms-admin-section-state", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: {
          // the pages a replace would change
          selected: this._replaceMode ? this._searchMatchCount() : 0,
          selectionText: this._selectionText(),
          actions: this.selectionActions,
        },
      }),
    );
  }

  /**
   * section contract: run a selection action. "replace" is the old Replace
   * button: same confirms, same haxcms-content-dashboard-operation detail.
   * @param {string} id
   */
  runAction(id) {
    if (id === "replace") {
      this._applyReplace();
    }
  }

  /**
   * section contract: clear what the replace would act on (the text to
   * find, the replacement and the matches)
   */
  clearSelection() {
    if (this.__searchDebounceTimer) {
      clearTimeout(this.__searchDebounceTimer);
      this.__searchDebounceTimer = null;
    }
    this.filterValue = "";
    this.replaceValue = "";
    this.searchMatches = null;
    this.lastSearchQuery = "";
    this.searchLoading = false;
  }

  /** native control change, as the value-changed detail the handlers read */
  _v(e) {
    return { detail: { value: e && e.target ? e.target.value : "" } };
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

  get pagedRows() {
    const start = this.pageOffset;
    return this.filteredRows.slice(start, start + this.pageLimit);
  }

  _onPageChanged(e) {
    if (!e || !e.detail) {
      return;
    }
    this.pageLimit = e.detail.limit;
    this.pageOffset = e.detail.offset;
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
        statusLabel: published ? this.t.published : this.t.unpublished,
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
    if (Array.isArray(metadata.tags) && metadata.tags.length > 0) {
      return metadata.tags.join(", ");
    }
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
    const raw =
      e && e.detail && typeof e.detail.value === "string"
        ? e.detail.value.trim()
        : "";
    const value = parseInt(raw, 10);
    const next =
      !Number.isNaN(value) && PAGE_SIZE_OPTIONS.includes(value) ? value : 25;
    if (next === this.searchLimit && next === this.pageLimit) {
      this._debounceSearchRequest();
      return;
    }
    // Search cap and table page size share the same dropdown so the visible
    // page count matches the server-side fetch cap; whichever callsite
    // (search results vs. simple-pager) the user is looking at when they
    // change the dropdown gets the same value.
    this.searchLimit = next;
    this.pageLimit = next;
    this.pageOffset = 0;
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
      this.t.replaceSummary
        .replace("{pageCount}", () => updatedItems)
        .replace("{pageUnit}", () =>
          updatedItems === 1 ? this.t.pageUnit : this.t.pagesUnit,
        )
        .replace("{replacementCount}", () => totalReplacements)
        .replace("{replacementUnit}", () =>
          totalReplacements === 1
            ? this.t.replacementUnit
            : this.t.replacementsUnit,
        ),
      3000,
      { hat: "construction" },
    );
    this._applySearch();
    // Refresh now that the backend updated page content; the store.manifest
    // autorun rebuilds `this.rows`, so the slotted editable-table-display
    // just needs requestUpdate() to re-import the freshly slotted HTML.
    this._refreshTable();
  }

  /**
   * Forces the slotted <editable-table-display> to re-import its slotted
   * <table> child. Mirrors haxcms-files-admin-dialog._requestTableUpdate().
   * The store.manifest autorun already rebuilds `this.rows` after most
   * operations; this hook only nudges the display element so the rendered
   * tbody reflects the freshly slotted HTML without waiting for the
   * MutationObserver to fire. Deferred via microtask + RAF so the Lit
   * template pass that produced the new slots completes first.
   */
  _refreshTable() {
    if (!this.shadowRoot) return;
    const tableDisplay = this.shadowRoot.querySelector(
      "editable-table-display",
    );
    if (
      tableDisplay &&
      typeof tableDisplay.requestUpdate === "function" &&
      typeof tableDisplay.loadSlottedTable === "function"
    ) {
      Promise.resolve().then(() => {
        requestAnimationFrame(() => {
          tableDisplay.loadSlottedTable();
          tableDisplay.requestUpdate();
        });
      });
    }
  }

  __handleTriggerUpdate() {
    if (!this.shadowRoot) return;
    // Aligns with haxcms-files-admin which calls _requestTableUpdate after
    // an operation lands so the user sees fresh data without re-opening
    // the modal. The autorun on store.manifest has already rebuilt
    // `this.rows` by the time haxcms-trigger-update fires, so this just
    // asks the slotted table to re-import and request a re-render.
    this._refreshTable();
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
    const confirmation = globalThis.confirm(this.t.bulkReplaceConfirm);
    if (!confirmation) {
      return;
    }
    let emptyReplacementConfirmed = false;
    if (replacement === "") {
      emptyReplacementConfirmed = globalThis.confirm(
        this.t.emptyReplacementConfirm,
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
      return this.t.tag;
    }
    if (this.filterField === "parents") {
      return this.t.parentPageTitle;
    }
    if (this.filterField === "search") {
      if (this.searchMode === "selector") {
        return this.t.selectorPlaceholder;
      }
      return this.t.fullTextPlaceholder;
    }
    return this.t.filterValue;
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

  _openRevisions(e) {
    if (e && typeof e.stopPropagation === "function") {
      e.stopPropagation();
    }
    const target = e && e.currentTarget ? e.currentTarget : null;
    if (!target || !target.getAttribute) {
      return;
    }
    const nodeId = target.getAttribute("data-node-id")
      ? target.getAttribute("data-node-id").trim()
      : "";
    const nodeTitle = target.getAttribute("data-node-title")
      ? target.getAttribute("data-node-title")
      : "";
    if (!nodeId) {
      return;
    }
    store.playSound("click");
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-open-page-revisions", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          nodeId: nodeId,
          nodeTitle: nodeTitle,
          source: "content-admin-dialog",
          invokedBy: target,
        },
      }),
    );
  }
  _handleTableActionClick(e) {
    const actionTarget = this._actionTargetFromEvent(e);
    if (
      !actionTarget ||
      actionTarget.getAttribute("data-action") !== "open-revisions"
    ) {
      return;
    }
    if (typeof e.stopPropagation === "function") {
      e.stopPropagation();
    }
    store.playSound("click");
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-open-page-revisions", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          nodeId: actionTarget.getAttribute("data-node-id")
            ? actionTarget.getAttribute("data-node-id").trim()
            : "",
          nodeTitle: actionTarget.getAttribute("data-node-title")
            ? actionTarget.getAttribute("data-node-title")
            : "",
          source: "content-admin-dialog",
          invokedBy: actionTarget,
        },
      }),
    );
  }

  _renderSelect(name, label, value, items, handler) {
    return html`<label class="field">
      <span>${label}</span>
      <select name="${name}" @change="${(e) => handler.call(this, this._v(e))}">
        ${items.map(
          (item) =>
            html`<option
              value="${item.value}"
              ?selected="${String(value) === String(item.value)}"
            >
              ${item.text}
            </option>`,
        )}
      </select>
    </label>`;
  }

  render() {
    return html`
      <div class="panel-shell">
        <div class="panel-scroll">
          <div
            class="filters"
            role="group"
            aria-label="${this.t.showOnlyItemsWhere}"
          >
            ${this.inShell
              ? nothing
              : html`<h3 class="filters-title">
                  ${this.t.showOnlyItemsWhere}
                </h3>`}
            <div class="controls">
              ${this.filterField === "search"
                ? html`<div
                    class="seg"
                    role="group"
                    aria-label="${this.t.mode}"
                  >
                    ${[
                      { value: "search", text: this.t.search },
                      { value: "replace", text: this.t.searchAndReplace },
                    ].map(
                      (item) =>
                        html`<button
                          type="button"
                          data-mode="${item.value}"
                          aria-pressed="${this.operationMode === item.value
                            ? "true"
                            : "false"}"
                          @click="${() =>
                            this.operationMode === item.value
                              ? null
                              : this._onOperationMode({
                                  detail: { value: item.value },
                                })}"
                        >
                          ${item.text}
                        </button>`,
                    )}
                  </div>`
                : nothing}
              ${this._renderSelect(
                "filter-field",
                this.t.filterBy,
                this.filterField,
                [
                  { value: "search", text: this.t.searchContent },
                  { value: "visibility", text: this.t.visibility },
                  { value: "tags", text: this.t.tags },
                  { value: "parents", text: this.t.parentPage },
                ],
                this._onFilterField,
              )}
              ${this.filterField === "visibility"
                ? this._renderSelect(
                    "filter-value",
                    this.t.value,
                    this.filterValue,
                    [
                      { value: "any", text: this.t.any },
                      { value: "published", text: this.t.published },
                      { value: "unpublished", text: this.t.unpublished },
                      { value: "visible", text: this.t.visible },
                      { value: "not-visible", text: this.t.notVisible },
                    ],
                    this._onFilterValue,
                  )
                : html`<label class="field query">
                    <simple-icon-lite
                      icon="icons:search"
                      aria-hidden="true"
                    ></simple-icon-lite>
                    <input
                      type="text"
                      name="filter-value"
                      aria-label="${this.t.value}"
                      placeholder="${this._searchPlaceholder()}"
                      .value="${this.filterValue}"
                      @input="${(e) => this._onFilterValue(this._v(e))}"
                      @keydown="${this._onSearchInputKeydown}"
                    />
                  </label>`}
              ${this.filterField === "search"
                ? html`
                    ${this.operationMode === "replace"
                      ? html`<label class="field replacement">
                          <span>${this.t.replaceWith}</span>
                          <input
                            type="text"
                            name="replace-value"
                            placeholder="${this.t.replacementPlaceholder}"
                            .value="${this.replaceValue}"
                            @input="${(e) => this._onReplaceValue(this._v(e))}"
                          />
                        </label>`
                      : nothing}
                    ${this._renderSelect(
                      "search-mode",
                      this.t.searchType,
                      this.searchMode,
                      [
                        { value: "fulltext", text: this.t.fullText },
                        { value: "selector", text: this.t.querySelector },
                      ],
                      this._onSearchMode,
                    )}
                    ${this._renderSelect(
                      "case-sensitive",
                      this.t.caseSensitive,
                      this.searchCaseSensitive ? "true" : "false",
                      [
                        { value: "false", text: this.t.no },
                        { value: "true", text: this.t.yes },
                      ],
                      this._onSearchCaseSensitive,
                    )}
                    ${this._renderSelect(
                      "search-limit",
                      this.t.perPage,
                      String(this.searchLimit),
                      PAGE_SIZE_OPTIONS.map((size) => ({
                        value: String(size),
                        text: String(size),
                      })),
                      this._onSearchLimit,
                    )}
                    ${this.operationMode === "replace" && !this.inShell
                      ? html`<button
                          type="button"
                          class="btn danger replace-btn"
                          ?disabled="${!this._canRunReplace()}"
                          @click="${this._applyReplace}"
                        >
                          <simple-icon-lite
                            icon="find-replace"
                            aria-hidden="true"
                          ></simple-icon-lite>
                          ${this.replaceLoading
                            ? this.t.replacing
                            : this.t.replace}
                        </button>`
                      : nothing}
                    <p class="meta" role="status" aria-live="polite">
                      ${this.searchLoading
                        ? this.t.searching
                        : (this._searchMatchCount() === 1
                            ? this.t.matchCountSingular
                            : this.t.matchCountPlural
                          ).replace("{count}", () => this._searchMatchCount())}
                    </p>
                  `
                : nothing}
            </div>
            ${this._replaceMode
              ? html`<div class="note" role="note">
                  <simple-icon-lite
                    icon="icons:warning"
                    aria-hidden="true"
                  ></simple-icon-lite>
                  ${this.t.replaceCannotBeUndone}
                </div>`
              : nothing}
          </div>
          ${this.filteredRows.length === 0
            ? html`<div class="empty">${this.t.noMatchingContent}</div>`
            : keyed(
                `${this.filterField}|${this.filterValue}|${this.filteredRows.length}|${this.pageOffset}|${this.pageLimit}`,
                html`<div class="table-scroll">
                  <editable-table-display
                    bordered
                    condensed
                    column-header
                    responsive
                    sort
                    striped
                    scroll
                    sort-column="2"
                    sort-mode="desc"
                    @click="${this._handleTableActionClick}"
                  >
                    <table>
                      <thead>
                        <tr>
                          <th>${this.t.title}</th>
                          <th>${this.t.status}</th>
                          <th>${this.t.updated}</th>
                          <th>${this.t.parent}</th>
                          <th>${this.t.slug}</th>
                          <th>${this.t.actions}</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${this.pagedRows.map(
                          (row) => html`
                            <tr>
                              <td><a href="${row.slug}">${row.title}</a></td>
                              <td>${row.statusLabel}</td>
                              <td>
                                <span data-sort-value="${row.updated}"
                                  >${row.updatedLabel}</span
                                >
                              </td>
                              <td>
                                ${row.parentSlug
                                  ? html`<a href="${row.parentSlug}"
                                      >${row.parent}</a
                                    >`
                                  : html`—`}
                              </td>
                              <td>${row.slug}</td>
                              <td>
                                <simple-icon-button-lite
                                  class="row-action"
                                  icon="icons:history"
                                  label="${this.t.viewRevisions}"
                                  title="${this.t.viewPageRevisions}"
                                  data-action="open-revisions"
                                  data-node-id="${row.id}"
                                  data-node-title="${row.title}"
                                ></simple-icon-button-lite>
                              </td>
                            </tr>
                          `,
                        )}
                      </tbody>
                    </table>
                  </editable-table-display>
                </div>`,
              )}
        </div>
        <simple-pager
          mode="full"
          limit="${this.pageLimit}"
          offset="${this.pageOffset}"
          total="${this.filteredRows.length}"
          count="${this.pagedRows.length}"
          label="${this.t.contentPagination}"
          @page-changed="${this._onPageChanged}"
        ></simple-pager>
      </div>
    `;
  }
}

globalThis.customElements.define(
  HAXCMSContentAdminDialog.tag,
  HAXCMSContentAdminDialog,
);

export { HAXCMSContentAdminDialog };

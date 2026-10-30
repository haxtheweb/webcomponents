import { html, css, nothing } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
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
 * Each matched page has a checkbox (all checked after every search); the
 * bar reports how many are checked, and a Replace with only some checked
 * adds `nodeIds` so the server touches just those pages. With every match
 * checked the event detail is exactly what it always was.
 * Opening a page's revisions leaves the shell (Revisions is its own dialog).
 * The page table is a native table on the HAX UI admin layer: sortable
 * column headers (ascending, descending, site order) sort every filtered
 * page before paging; Updated, newest first, is the default.
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
      /** ids of matched pages a replace will touch (replace mode) */
      _checkedIds: { state: true },
      /** set by haxcms-site-admin: the shell owns the Replace button */
      inShell: { type: Boolean, attribute: "in-shell", reflect: true },
      /** page table sort column key */
      _sortKey: { state: true },
      /** page table sort direction: asc, desc or none (site order) */
      _sortDir: { state: true },
      /** "search" or "replace" when that request could not be sent */
      _searchError: { state: true },
    };
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      noPagesMatch: "No pages match",
      onePageSelected: "{selected} of 1 page selected",
      manyPagesSelected: "{selected} of {count} pages selected",
      selectAllPages: "Select all matching pages",
      selectPage: "Select {title}",
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
      viewRevisionsOf: "View revisions of {title}",
      onePage: "1 page",
      manyPages: "{count} pages",
      someOfPages: "{count} of {total} pages",
      onePageMatches: "1 page matches",
      manyPagesMatch: "{count} pages match",
      noMatches: "No matches",
      rangeOf: "{start}–{end} of {total}",
      previousPage: "Previous page",
      nextPage: "Next page",
      searchingPages: "Searching pages…",
      noPagesYet: "Pages you add show up here",
      noPagesYetHint: "Add a page from the outline to get started.",
      nothingMatchesQuery: "Nothing matches “{query}” yet",
      nothingMatchesFilter: "No pages fit this filter yet",
      emptySearchHint:
        "Try other words, turn off Case sensitive, or change the filter.",
      emptyFilterHint: "Try another value or a different filter.",
      searchFailed: "The search could not run",
      searchFailedHint: "Check your connection, then try again.",
      tryAgain: "Try again",
      replaceFailed:
        "The replacement could not be sent, so no pages changed. Try again.",
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
    this._checkedIds = [];
    this._sortKey = "updated";
    this._sortDir = "desc";
    this._searchError = "";
    this.__disposer = [];
    this.__searchResponseHandler = this._onSearchResults.bind(this);
    this.__replaceResponseHandler = this._onReplaceResults.bind(this);
    this.__triggerUpdateHandler = this.__handleTriggerUpdate.bind(this);
    this.__requestFailedHandler = this._onRequestFailed.bind(this);
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
          /* proposed tokens, written as DDD values until adopted (same
             values as the Reports warning tone) */
          --haxcms-content-warning: light-dark(#8a5300, #ffcf80);
          --haxcms-content-warning-soft: light-dark(
            var(--ddd-theme-default-warningLight, #fff4e5),
            rgba(255, 174, 0, 0.14)
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
        /* in the shell the section fills the body and scrolls its table,
           so the toolbar and the table header stay in view */
        :host([in-shell]) {
          min-width: 0;
          min-height: 0;
          height: 100%;
          max-height: none;
        }
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }
        button,
        input,
        select {
          font-family: inherit;
          font-size: inherit;
          color: inherit;
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
          container: haxcms-content / inline-size;
        }

        /* toolbar: one wrapping row of 32px controls */
        .filters {
          flex: none;
          display: flex;
          flex-direction: column;
          gap: var(--hax-ui-gap-md);
          padding: var(--hax-ui-gap-lg) var(--ddd-spacing-5, 20px);
          border-bottom: 1px solid var(--hax-ui-line);
        }
        .filters-title {
          margin: 0;
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
          flex: none;
          height: var(--hax-ui-row-height);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          overflow: hidden;
        }
        .seg button {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: var(--hax-ui-gap);
          padding: 0 var(--hax-ui-gap-lg);
          font-size: 13px;
          white-space: nowrap;
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
          flex: none;
          gap: var(--hax-ui-gap-md);
          height: var(--hax-ui-row-height);
          min-width: 0;
          padding: 0 var(--hax-ui-gap-md);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          font-size: var(--hax-ui-admin-font-size-xs);
          white-space: nowrap;
          color: var(--hax-ui-text-muted);
          background-color: var(--hax-ui-surface);
        }
        .field:hover {
          border-color: var(--hax-ui-text-muted);
        }
        .field:focus-within {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 1px;
        }
        .field input,
        .field select {
          all: unset;
          min-width: 0;
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          color: var(--hax-ui-text);
        }
        .field select {
          cursor: pointer;
        }
        .field select option {
          color: initial;
          background-color: initial;
        }
        .field input::placeholder {
          color: var(--hax-ui-text-muted);
          opacity: 1;
        }
        .field.query {
          flex: 1 1 240px;
        }
        .field.query input,
        .field.replacement input {
          flex: 1;
          width: 100%;
        }
        .field.replacement {
          flex: 1 1 240px;
          max-width: 420px;
        }
        /* small switch, as in Features */
        .toggle {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          flex: none;
          gap: var(--hax-ui-gap-md);
          height: var(--hax-ui-row-height);
          padding: 0 var(--hax-ui-gap);
          border-radius: var(--hax-ui-radius);
          font-size: 13px;
          white-space: nowrap;
          color: var(--hax-ui-text);
        }
        .toggle .track {
          position: relative;
          flex: none;
          width: 28px;
          height: 16px;
          border-radius: var(--hax-ui-radius-pill);
          background-color: var(--hax-ui-line-strong);
          transition: background-color var(--hax-ui-duration)
            var(--hax-ui-easing);
        }
        .toggle .track::after {
          content: "";
          position: absolute;
          top: 2px;
          left: 2px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: var(--ddd-theme-default-white, #fff);
          transition: left var(--hax-ui-duration) var(--hax-ui-easing);
        }
        .toggle[aria-checked="true"] .track {
          background-color: var(--hax-ui-accent-strong);
        }
        .toggle[aria-checked="true"] .track::after {
          left: 14px;
        }
        .seg button:focus-visible,
        .btn:focus-visible,
        .toggle:focus-visible,
        .iconbtn:focus-visible,
        .sort:focus-visible,
        a:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        .btn {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          flex: none;
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
          border-style: dashed;
          background-color: transparent;
        }
        .iconbtn {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
          display: inline-grid;
          place-items: center;
          flex: none;
          width: 28px;
          height: 28px;
          border-radius: var(--hax-ui-radius);
          color: var(--hax-ui-text-muted);
        }
        .iconbtn:hover {
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-hover);
        }
        .iconbtn[disabled] {
          cursor: default;
          opacity: 0.4;
          background-color: transparent;
        }
        .note {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          min-height: var(--hax-ui-row-height);
          padding: var(--hax-ui-gap) var(--hax-ui-gap-lg);
          border-radius: var(--hax-ui-radius);
          font-size: 13px;
          color: var(--haxcms-content-warning);
          background-color: var(--haxcms-content-warning-soft);
        }
        .note.error {
          color: var(--hax-ui-danger);
          background-color: var(--hax-ui-danger-soft);
        }
        .note .grow {
          flex: 1;
          min-width: 0;
        }
        .note .btn {
          height: calc(var(--hax-ui-row-height) - 6px);
          color: inherit;
          border-color: currentColor;
          background-color: transparent;
        }

        /* results summary with paging on the right */
        .summary {
          flex: none;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          min-height: calc(var(--hax-ui-row-height) + var(--hax-ui-gap-md));
          padding: var(--hax-ui-gap) var(--ddd-spacing-5, 20px);
        }
        .summary .meta {
          flex: 1;
          min-width: 0;
          margin: 0;
          font-size: 13px;
          font-variant-numeric: tabular-nums;
          color: var(--hax-ui-text-muted);
        }
        .summary .meta strong {
          font-weight: var(--ddd-font-weight-bold, 700);
          color: var(--hax-ui-text);
        }
        .paging {
          display: inline-flex;
          align-items: center;
          gap: var(--hax-ui-gap);
          margin-left: auto;
        }
        .paging .range {
          padding: 0 var(--hax-ui-gap-md);
          font-size: 13px;
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
          color: var(--hax-ui-text-muted);
        }
        .field.per-page {
          margin-right: var(--hax-ui-gap);
        }

        /* the page table */
        .table-scroll {
          flex: 1;
          min-height: 0;
          overflow: auto;
          border-top: 1px solid var(--hax-ui-line);
          -webkit-overflow-scrolling: touch;
        }
        .table-scroll[aria-busy="true"] table {
          opacity: 0.55;
        }
        /* DDD gives every table part a border whose color is inherited
           (important), so the line color is set on the table and the
           parts only choose which sides draw */
        table.pages {
          width: 100%;
          min-width: 640px;
          border: 0;
          border-color: var(--hax-ui-line);
          border-collapse: separate;
          border-spacing: 0;
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          color: var(--hax-ui-text);
        }
        table.pages thead,
        table.pages tbody,
        table.pages tr {
          border: 0;
        }
        table.pages th,
        table.pages td {
          height: var(--hax-ui-row-height);
          padding: 0 var(--hax-ui-gap-md);
          border: 0;
          border-bottom: 1px solid;
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          line-height: 1.3;
          text-align: start;
          vertical-align: middle;
          white-space: nowrap;
        }
        table.pages th:first-child,
        table.pages td:first-child {
          padding-left: var(--ddd-spacing-5, 20px);
        }
        table.pages th:last-child,
        table.pages td:last-child {
          padding-right: var(--ddd-spacing-4, 16px);
        }
        table.pages thead th {
          position: sticky;
          top: 0;
          z-index: 1;
          font-size: var(--hax-ui-admin-font-size-xs);
          font-weight: var(--ddd-font-weight-medium, 500);
          color: var(--hax-ui-text-muted);
          background-color: var(--hax-ui-surface);
          border-bottom: 0;
          box-shadow: inset 0 -1px 0 var(--hax-ui-line-strong);
        }
        table.pages tbody tr:hover {
          background-color: var(--hax-ui-hover);
        }
        table.pages tbody tr.checked {
          background-color: var(--hax-ui-accent-soft);
        }
        table.pages th.actions,
        table.pages td.actions {
          width: 1%;
          text-align: end;
        }
        table.pages td.actions {
          padding-top: 0;
          padding-bottom: 0;
        }
        .sort {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: var(--hax-ui-gap);
          height: 24px;
          margin: 0 calc(-1 * var(--hax-ui-gap));
          padding: 0 var(--hax-ui-gap);
          border-radius: var(--hax-ui-radius);
        }
        .sort:hover {
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-hover);
        }
        th[aria-sort] .sort {
          color: var(--hax-ui-text);
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .sort simple-icon-lite {
          --simple-icon-width: 14px;
          --simple-icon-height: 14px;
        }
        .sort .idle {
          opacity: 0;
        }
        .sort:hover .idle,
        .sort:focus-visible .idle {
          opacity: 0.6;
        }
        td.title {
          max-width: 360px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        a.title-link,
        a.parent-link {
          font-size: inherit;
          line-height: inherit;
          background-color: transparent;
        }
        a.title-link {
          font-weight: var(--ddd-font-weight-medium, 500);
          color: var(--hax-ui-accent);
          text-decoration: none;
          border-radius: 2px;
        }
        a.title-link:hover {
          text-decoration: underline;
        }
        a.parent-link {
          font-weight: var(--ddd-font-weight-regular, 400);
          color: var(--hax-ui-text-muted);
          text-decoration: none;
          border-radius: 2px;
        }
        a.parent-link:hover {
          color: var(--hax-ui-text);
          text-decoration: underline;
        }
        td.parent,
        td.slug {
          max-width: 220px;
          overflow: hidden;
          text-overflow: ellipsis;
          color: var(--hax-ui-text-muted);
        }
        table.pages td.mono {
          font-family: var(--ddd-font-mono, ui-monospace, monospace);
          font-size: var(--hax-ui-admin-font-size-xs);
        }
        table.pages td.updated {
          font-variant-numeric: tabular-nums;
          color: var(--hax-ui-text-muted);
        }
        .none {
          color: var(--hax-ui-text-muted);
          opacity: 0.6;
        }
        table.pages .select {
          width: 36px;
          padding-right: 0;
          text-align: center;
        }
        table.pages input[type="checkbox"] {
          width: var(--ddd-icon-4xs, 16px);
          height: var(--ddd-icon-4xs, 16px);
          margin: 0;
          vertical-align: middle;
          cursor: pointer;
          accent-color: var(--hax-ui-accent-strong);
        }
        table.pages input[type="checkbox"]:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }

        /* empty, loading and error states */
        .empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--hax-ui-gap);
          margin: var(--ddd-spacing-5, 20px);
          padding: var(--ddd-spacing-6, 24px) var(--ddd-spacing-4, 16px);
          text-align: center;
          color: var(--hax-ui-text-muted);
          border: 1px dashed var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius-lg);
        }
        .empty simple-icon-lite {
          --simple-icon-width: 24px;
          --simple-icon-height: 24px;
          margin-bottom: var(--hax-ui-gap);
        }
        .empty .lead {
          font-weight: var(--ddd-font-weight-bold, 700);
          color: var(--hax-ui-text);
        }
        .empty .hint {
          font-size: 13px;
        }
        .empty.error {
          color: var(--hax-ui-danger);
          border-color: var(--hax-ui-danger);
          border-style: solid;
          background-color: var(--hax-ui-danger-soft);
        }
        .empty.error .lead {
          color: var(--hax-ui-danger);
        }
        .empty .btn {
          margin-top: var(--hax-ui-gap-md);
        }
        .loading-dot {
          width: 16px;
          height: 16px;
          margin-bottom: var(--hax-ui-gap);
          border: 2px solid var(--hax-ui-line-strong);
          border-top-color: var(--hax-ui-accent-strong);
          border-radius: 50%;
          animation: haxcms-content-spin 0.8s linear infinite;
        }
        @keyframes haxcms-content-spin {
          to {
            transform: rotate(360deg);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .loading-dot {
            animation: none;
          }
          .toggle .track,
          .toggle .track::after {
            transition: none;
          }
        }
        @media (forced-colors: active) {
          .toggle .track {
            border: 1px solid ButtonText;
          }
          .toggle[aria-checked="true"] .track {
            background-color: Highlight;
          }
        }
        @media screen and (max-width: 900px) {
          :host {
            min-width: 0;
            width: 100%;
          }
          .filters,
          .summary {
            padding-left: var(--ddd-spacing-3, 12px);
            padding-right: var(--ddd-spacing-3, 12px);
          }
          table.pages th:first-child,
          table.pages td:first-child {
            padding-left: var(--ddd-spacing-3, 12px);
          }
        }
        /* narrow: the slug column gives way (the title links to it) */
        @container haxcms-content (max-width: 640px) {
          table.pages {
            min-width: 0;
          }
          table.pages th.slug,
          table.pages td.slug {
            display: none;
          }
          td.title {
            max-width: 180px;
          }
          td.parent {
            max-width: 120px;
          }
        }
        @media screen and (max-width: 640px) {
          .field.query,
          .field.replacement {
            flex-basis: 100%;
            max-width: none;
          }
          .paging {
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
    // saves and after the platform settings/manifest detail patches land;
    // the store.manifest autorun picks up the data, this re-renders the table
    globalThis.addEventListener(
      "haxcms-trigger-update",
      this.__triggerUpdateHandler,
    );
    // haxcms-site-editor fires these with the request detail only when the
    // search / replace request could not be sent (no response)
    globalThis.addEventListener(
      "haxcms-content-dashboard-search",
      this.__requestFailedHandler,
    );
    globalThis.addEventListener(
      "haxcms-content-dashboard-replace",
      this.__requestFailedHandler,
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
    globalThis.removeEventListener(
      "haxcms-content-dashboard-search",
      this.__requestFailedHandler,
    );
    globalThis.removeEventListener(
      "haxcms-content-dashboard-replace",
      this.__requestFailedHandler,
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
      cp.has("rows") ||
      cp.has("_sortKey") ||
      cp.has("_sortDir")
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
        "_checkedIds",
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

  /** words for the shell's selection bar: checked of matched pages */
  _selectionText() {
    if (!this._replaceMode) {
      return "";
    }
    const count = this._searchMatchCount();
    if (count === 0) {
      return this.t.noPagesMatch;
    }
    const selected = this._checkedMatchIds().length;
    return (count === 1 ? this.t.onePageSelected : this.t.manyPagesSelected)
      .replace("{selected}", () => selected)
      .replace("{count}", () => count);
  }

  /** ids of the pages the current search matched, in result order */
  _matchedIds() {
    if (this._searchMatchCount() < 1) {
      return [];
    }
    return this.searchMatches;
  }

  /** matched page ids that are checked, in result order */
  _checkedMatchIds() {
    const checked = new Set(this._checkedIds);
    return this._matchedIds().filter((id) => checked.has(id));
  }

  /** whether one matched page is checked for the replace */
  _isChecked(id) {
    return this._checkedIds.includes(id);
  }

  /** check or uncheck one matched page */
  _togglePage(id, checked) {
    const others = this._checkedIds.filter((item) => item !== id);
    this._checkedIds = checked ? [...others, id] : others;
  }

  /** check or uncheck every matched page */
  _toggleAllPages(checked) {
    this._checkedIds = checked ? [...this._matchedIds()] : [];
  }

  _emitState() {
    this.dispatchEvent(
      new CustomEvent("haxcms-admin-section-state", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: {
          // the pages a replace would change: the checked matches
          selected: this._replaceMode ? this._checkedMatchIds().length : 0,
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
   * section contract: uncheck every matched page. The text to find, the
   * replacement and the matches stay as they are.
   */
  clearSelection() {
    this._checkedIds = [];
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
    return this.sortedRows.slice(start, start + this.pageLimit);
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
    this._searchError = "";
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
    // page count matches the server-side fetch cap.
    this.searchLimit = next;
    this.pageLimit = next;
    this.pageOffset = 0;
    this._debounceSearchRequest();
  }

  _debounceSearchRequest() {
    this._searchError = "";
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
    this._searchError = "";
    this.lastSearchQuery = query;
    this.searchMatches = [...new Set(ids)];
    // every search starts with all of its matches checked
    this._checkedIds = [...this.searchMatches];
  }

  _onReplaceResults(e) {
    this.replaceLoading = false;
    this._searchError = "";
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
    this._refreshTable();
  }

  /** re-render the page table; the store.manifest autorun rebuilds rows */
  _refreshTable() {
    this.requestUpdate();
  }

  __handleTriggerUpdate() {
    this._refreshTable();
  }

  /**
   * haxcms-site-editor re-fires the request detail as
   * haxcms-content-dashboard-search / -replace when it got no response:
   * stop the spinner and say so.
   */
  _onRequestFailed(e) {
    const isReplace =
      e && e.type === "haxcms-content-dashboard-replace" ? true : false;
    if (isReplace) {
      if (!this.replaceLoading) {
        return;
      }
      this.replaceLoading = false;
      this._searchError = "replace";
      return;
    }
    if (!this.searchLoading) {
      return;
    }
    this.searchLoading = false;
    this._searchError = "search";
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
    if (this._checkedMatchIds().length < 1) {
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
    const detail = {
      operation: "replace",
      search: searchTerm,
      replace: replacement,
      searchMode: "fulltext",
      searchSelector: false,
      searchField: "content",
      searchCaseSensitive: this.searchCaseSensitive === true,
      replaceConfirm: confirmation,
      replaceDestroyConfirm: emptyReplacementConfirmed,
    };
    // every match checked sends the detail as it always was; only a subset
    // names its pages
    const checkedIds = this._checkedMatchIds();
    if (checkedIds.length < this._matchedIds().length) {
      detail.nodeIds = checkedIds;
    }
    this.replaceLoading = true;
    this._searchError = "";
    this.dispatchEvent(
      new CustomEvent("haxcms-content-dashboard-operation", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: detail,
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
    this._searchError = "";
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

  _renderSelect(name, label, value, items, handler, extraClass = "") {
    return html`<label class="field ${extraClass}">
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

  /** the columns of the page table, in order; key is the sort key */
  get _columns() {
    return [
      { key: "title", label: this.t.title, cls: "title" },
      { key: "status", label: this.t.status, cls: "status" },
      { key: "updated", label: this.t.updated, cls: "updated" },
      { key: "parent", label: this.t.parent, cls: "parent" },
      { key: "slug", label: this.t.slug, cls: "slug" },
    ];
  }

  /**
   * Click on a column header: ascending, then descending, then the site's
   * own order, the cycle editable-table-display used.
   * @param {string} key column key
   */
  _toggleSort(key) {
    this.pageOffset = 0;
    if (this._sortKey === key && this._sortDir === "asc") {
      this._sortDir = "desc";
    } else if (this._sortKey === key && this._sortDir === "desc") {
      this._sortDir = "none";
    } else {
      this._sortKey = key;
      this._sortDir = "asc";
    }
  }

  _sortValueFor(row, key) {
    if (key === "updated") {
      return row.updated || 0;
    }
    if (key === "status") {
      return row.statusLabel;
    }
    return row[key] || "";
  }

  /** filtered rows in the chosen column order, before paging */
  get sortedRows() {
    const rows = this.filteredRows;
    if (!this._sortKey || this._sortDir === "none") {
      return rows;
    }
    const key = this._sortKey;
    const dir = this._sortDir === "desc" ? -1 : 1;
    return rows
      .map((row, index) => ({ row, index }))
      .sort((a, b) => {
        const av = this._sortValueFor(a.row, key);
        const bv = this._sortValueFor(b.row, key);
        let result = 0;
        if (typeof av === "number" && typeof bv === "number") {
          result = av - bv;
        } else {
          result = String(av).localeCompare(String(bv), undefined, {
            numeric: true,
            sensitivity: "base",
          });
        }
        return result === 0 ? a.index - b.index : result * dir;
      })
      .map((item) => item.row);
  }

  _ariaSort(key) {
    if (this._sortKey !== key || this._sortDir === "none") {
      return nothing;
    }
    return this._sortDir === "asc" ? "ascending" : "descending";
  }

  _renderSortHeader(column) {
    const sorted = this._sortKey === column.key && this._sortDir !== "none";
    return html`<th
      scope="col"
      class="${column.cls}"
      aria-sort="${this._ariaSort(column.key)}"
    >
      <button
        type="button"
        class="sort"
        data-sort="${column.key}"
        @click="${() => this._toggleSort(column.key)}"
      >
        ${column.label}
        <simple-icon-lite
          class="${sorted ? "" : "idle"}"
          icon="${sorted && this._sortDir === "desc"
            ? "icons:arrow-downward"
            : "icons:arrow-upward"}"
          aria-hidden="true"
        ></simple-icon-lite>
      </button>
    </th>`;
  }

  /** the full date for an updated timestamp, for the tooltip */
  _fullDate(ts) {
    if (!ts) {
      return "";
    }
    const ms = ts < 1000000000000 ? ts * 1000 : ts;
    const date = new Date(ms);
    if (Number.isNaN(date.getTime())) {
      return "";
    }
    return date.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  _isoDate(ts) {
    if (!ts) {
      return "";
    }
    const ms = ts < 1000000000000 ? ts * 1000 : ts;
    const date = new Date(ms);
    return Number.isNaN(date.getTime()) ? "" : date.toISOString();
  }

  _fill(text, values) {
    let out = text;
    Object.keys(values).forEach((key) => {
      out = out.replace(`{${key}}`, () => values[key]);
    });
    return out;
  }

  /** the results line: how many pages show, or what is happening */
  _summaryText() {
    if (this.searchLoading) {
      return this.t.searching;
    }
    const total = this.rows.length;
    const shown = this.filteredRows.length;
    const query = this.filterValue ? this.filterValue.toLowerCase().trim() : "";
    if (
      this.filterField === "search" &&
      query &&
      this.lastSearchQuery === query &&
      Array.isArray(this.searchMatches)
    ) {
      const count = this._searchMatchCount();
      if (count === 0) {
        return this.t.noMatches;
      }
      return this._fill(
        count === 1 ? this.t.onePageMatches : this.t.manyPagesMatch,
        { count },
      );
    }
    if (shown === total) {
      return this._fill(total === 1 ? this.t.onePage : this.t.manyPages, {
        count: total,
      });
    }
    return this._fill(this.t.someOfPages, { count: shown, total });
  }

  _goToOffset(offset) {
    const total = this.filteredRows.length;
    const max = total > 0 ? Math.floor((total - 1) / this.pageLimit) : 0;
    const next = Math.min(Math.max(offset, 0), max * this.pageLimit);
    this._onPageChanged({
      detail: { limit: this.pageLimit, offset: next },
    });
  }

  _renderPaging() {
    const total = this.filteredRows.length;
    const start = total ? this.pageOffset + 1 : 0;
    const end = Math.min(this.pageOffset + this.pageLimit, total);
    return html`<div
      class="paging"
      role="navigation"
      aria-label="${this.t.contentPagination}"
    >
      ${this._renderSelect(
        "search-limit",
        this.t.perPage,
        String(this.searchLimit),
        PAGE_SIZE_OPTIONS.map((size) => ({
          value: String(size),
          text: String(size),
        })),
        this._onSearchLimit,
        "per-page",
      )}
      ${total > 0
        ? html`<span class="range"
              >${this._fill(this.t.rangeOf, { start, end, total })}</span
            >
            <button
              type="button"
              class="iconbtn page-prev"
              aria-label="${this.t.previousPage}"
              title="${this.t.previousPage}"
              ?disabled="${this.pageOffset <= 0}"
              @click="${() =>
                this._goToOffset(this.pageOffset - this.pageLimit)}"
            >
              <simple-icon-lite
                icon="icons:chevron-left"
                aria-hidden="true"
              ></simple-icon-lite>
            </button>
            <button
              type="button"
              class="iconbtn page-next"
              aria-label="${this.t.nextPage}"
              title="${this.t.nextPage}"
              ?disabled="${end >= total}"
              @click="${() =>
                this._goToOffset(this.pageOffset + this.pageLimit)}"
            >
              <simple-icon-lite
                icon="icons:chevron-right"
                aria-hidden="true"
              ></simple-icon-lite>
            </button>`
        : nothing}
    </div>`;
  }

  /**
   * The page table. In Search and replace mode, with matches, each row gets
   * a checkbox the section owns (live state), and select-all in the header.
   */
  _renderTable() {
    const selectable = this._replaceMode && this._searchMatchCount() > 0;
    const matchCount = this._matchedIds().length;
    const checkedCount = this._checkedMatchIds().length;
    const allChecked = matchCount > 0 && checkedCount === matchCount;
    const someChecked = checkedCount > 0 && !allChecked;
    return html`<table class="pages">
      <thead>
        <tr>
          ${selectable
            ? html`<th scope="col" class="select">
                <input
                  type="checkbox"
                  class="select-all"
                  aria-label="${this.t.selectAllPages}"
                  title="${this.t.selectAllPages}"
                  .checked="${allChecked}"
                  .indeterminate="${someChecked}"
                  @change="${(e) => this._toggleAllPages(e.target.checked)}"
                />
              </th>`
            : nothing}
          ${this._columns.map((column) => this._renderSortHeader(column))}
          <th scope="col" class="actions">
            <span class="hax-ui-sr-only">${this.t.actions}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        ${this.pagedRows.map((row) => {
          const checked = selectable && this._isChecked(row.id);
          return html`<tr class="${checked ? "checked" : ""}">
            ${selectable
              ? html`<td class="select">
                  <input
                    type="checkbox"
                    class="select-page"
                    data-node-id="${row.id}"
                    aria-label="${this.t.selectPage.replace(
                      "{title}",
                      () => row.title,
                    )}"
                    .checked="${this._isChecked(row.id)}"
                    @change="${(e) =>
                      this._togglePage(row.id, e.target.checked)}"
                  />
                </td>`
              : nothing}
            <td class="title" title="${row.title}">
              <a class="title-link" href="${row.slug}">${row.title}</a>
            </td>
            <td class="status">
              <span
                class="hax-ui-pill"
                data-tone="${row.published ? "success" : "neutral"}"
                >${row.statusLabel}</span
              >
            </td>
            <td class="updated">
              ${row.updated
                ? html`<time
                    datetime="${this._isoDate(row.updated)}"
                    title="${this._fullDate(row.updated)}"
                    >${row.updatedLabel}</time
                  >`
                : html`<span class="none" aria-hidden="true">—</span>`}
            </td>
            <td class="parent" title="${row.parent}">
              ${row.parentSlug
                ? html`<a class="parent-link" href="${row.parentSlug}"
                    >${row.parent}</a
                  >`
                : html`<span class="none">—</span>`}
            </td>
            <td class="slug mono" title="${row.slug}">${row.slug}</td>
            <td class="actions">
              <button
                type="button"
                class="iconbtn row-action"
                data-action="open-revisions"
                data-node-id="${row.id}"
                data-node-title="${row.title}"
                aria-label="${this.t.viewRevisionsOf.replace(
                  "{title}",
                  () => row.title,
                )}"
                title="${this.t.viewPageRevisions}"
                @click="${this._openRevisions}"
              >
                <simple-icon-lite
                  icon="icons:history"
                  aria-hidden="true"
                ></simple-icon-lite>
              </button>
            </td>
          </tr>`;
        })}
      </tbody>
    </table>`;
  }

  /** what shows when the table has no rows: loading, error or empty */
  _renderEmpty() {
    if (this._searchError === "search") {
      return html`<div class="empty error" role="alert">
        <simple-icon-lite icon="icons:error-outline" aria-hidden="true">
        </simple-icon-lite>
        <span class="lead">${this.t.searchFailed}</span>
        <span class="hint">${this.t.searchFailedHint}</span>
        <button type="button" class="btn retry" @click="${this._retrySearch}">
          <simple-icon-lite
            icon="icons:refresh"
            aria-hidden="true"
          ></simple-icon-lite>
          ${this.t.tryAgain}
        </button>
      </div>`;
    }
    if (this.searchLoading) {
      return html`<div class="empty loading">
        <span class="loading-dot" aria-hidden="true"></span>
        <span class="lead">${this.t.searchingPages}</span>
      </div>`;
    }
    if (this.rows.length === 0) {
      return html`<div class="empty">
        <simple-icon-lite
          icon="icons:description"
          aria-hidden="true"
        ></simple-icon-lite>
        <span class="lead">${this.t.noPagesYet}</span>
        <span class="hint">${this.t.noPagesYetHint}</span>
      </div>`;
    }
    const query = this.filterValue ? this.filterValue.trim() : "";
    return html`<div class="empty">
      <simple-icon-lite icon="icons:search" aria-hidden="true">
      </simple-icon-lite>
      <span class="lead"
        >${query && this.filterField !== "visibility"
          ? this._fill(this.t.nothingMatchesQuery, { query })
          : this.t.nothingMatchesFilter}</span
      >
      <span class="hint"
        >${this.filterField === "search"
          ? this.t.emptySearchHint
          : this.t.emptyFilterHint}</span
      >
    </div>`;
  }

  _retrySearch() {
    this._searchError = "";
    this._applySearch();
  }

  render() {
    const isSearch = this.filterField === "search";
    const rows = this.filteredRows;
    return html`
      <div class="panel-shell">
        <div
          class="filters"
          role="group"
          aria-label="${this.t.showOnlyItemsWhere}"
        >
          ${this.inShell
            ? nothing
            : html`<h3 class="filters-title">${this.t.showOnlyItemsWhere}</h3>`}
          <div class="controls">
            ${isSearch
              ? html`<div class="seg" role="group" aria-label="${this.t.mode}">
                  ${[
                    {
                      value: "search",
                      text: this.t.search,
                      icon: "icons:search",
                    },
                    {
                      value: "replace",
                      text: this.t.searchAndReplace,
                      icon: "icons:find-replace",
                    },
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
                        <simple-icon-lite
                          icon="${item.icon}"
                          aria-hidden="true"
                        ></simple-icon-lite>
                        ${item.text}
                      </button>`,
                  )}
                </div>`
              : nothing}
            ${this.filterField === "visibility"
              ? nothing
              : html`<label class="field query">
                  <simple-icon-lite
                    icon="icons:search"
                    aria-hidden="true"
                  ></simple-icon-lite>
                  <input
                    type="search"
                    name="filter-value"
                    aria-label="${this.t.value}"
                    placeholder="${this._searchPlaceholder()}"
                    .value="${this.filterValue}"
                    @input="${(e) => this._onFilterValue(this._v(e))}"
                    @keydown="${this._onSearchInputKeydown}"
                  />
                </label>`}
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
              : nothing}
            ${isSearch
              ? html`${this._renderSelect(
                    "search-mode",
                    this.t.searchType,
                    this.searchMode,
                    this.operationMode === "replace"
                      ? [{ value: "fulltext", text: this.t.fullText }]
                      : [
                          { value: "fulltext", text: this.t.fullText },
                          { value: "selector", text: this.t.querySelector },
                        ],
                    this._onSearchMode,
                  )}
                  <button
                    type="button"
                    class="toggle"
                    name="case-sensitive"
                    role="switch"
                    aria-checked="${this.searchCaseSensitive
                      ? "true"
                      : "false"}"
                    @click="${() =>
                      this._onSearchCaseSensitive({
                        detail: {
                          value: this.searchCaseSensitive ? "false" : "true",
                        },
                      })}"
                  >
                    <span class="track" aria-hidden="true"></span>
                    ${this.t.caseSensitive}
                  </button>`
              : nothing}
          </div>
          ${this._replaceMode
            ? html`<div class="controls replace-row">
                  <label class="field replacement">
                    <simple-icon-lite
                      icon="icons:find-replace"
                      aria-hidden="true"
                    ></simple-icon-lite>
                    <span class="hax-ui-sr-only">${this.t.replaceWith}</span>
                    <input
                      type="text"
                      name="replace-value"
                      placeholder="${this.t.replacementPlaceholder}"
                      .value="${this.replaceValue}"
                      @input="${(e) => this._onReplaceValue(this._v(e))}"
                    />
                  </label>
                  ${this.inShell
                    ? nothing
                    : html`<button
                        type="button"
                        class="btn danger replace-btn"
                        ?disabled="${!this._canRunReplace()}"
                        @click="${this._applyReplace}"
                      >
                        <simple-icon-lite
                          icon="icons:find-replace"
                          aria-hidden="true"
                        ></simple-icon-lite>
                        ${this.replaceLoading
                          ? this.t.replacing
                          : this.t.replace}
                      </button>`}
                </div>
                ${this._searchError === "replace"
                  ? html`<div class="note error" role="alert">
                      <simple-icon-lite
                        icon="icons:error-outline"
                        aria-hidden="true"
                      ></simple-icon-lite>
                      <span class="grow">${this.t.replaceFailed}</span>
                    </div>`
                  : html`<div class="note" role="note">
                      <simple-icon-lite
                        icon="icons:warning"
                        aria-hidden="true"
                      ></simple-icon-lite>
                      <span class="grow">${this.t.replaceCannotBeUndone}</span>
                    </div>`}`
            : nothing}
        </div>
        <div class="summary">
          <p class="meta" role="status" aria-live="polite">
            ${this._summaryText()}
          </p>
          ${this._renderPaging()}
        </div>
        <div
          class="table-scroll"
          aria-busy="${this.searchLoading ? "true" : "false"}"
        >
          ${rows.length === 0 || this._searchError === "search"
            ? this._renderEmpty()
            : this._renderTable()}
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

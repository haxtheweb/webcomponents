import {
  actionTargetFromEvent,
  closeChoiceOnEscape,
} from "./utils/haxcms-admin-helpers.js";
import { HaxcmsAdminSectionMixin } from "./admin/HaxcmsAdminSectionMixin.js";
import { html, css, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import {
  HaxUiAdminStyles,
  HaxUiAdminIcons,
} from "@haxtheweb/d-d-d/lib/HaxUiAdminStyles.js";
import {
  AdminRowMenuStyles,
  createRangeSelector,
  handleAdminListKey,
  isAdminRowMenuKey,
  createAdminLongPress,
  matchesAdminShortcut,
  openAdminRowMenu,
  renderAdminRowMenu,
  renderRowMoreButton,
} from "./admin/admin-row-menu.js";
import "./admin/haxcms-admin-add-area.js";
import {
  splitAdminAddFiles,
  adminFileType,
  ADMIN_DOCUMENT_TYPES,
} from "./admin/haxcms-admin-add-area.js";

// Match the items-per-page choices used by haxcms-files-admin-dialog so the
// content admin's pagination feels consistent with the files admin.
const PAGE_SIZE_OPTIONS = [10, 25, 50, 75, 100, 250, 500];
/** below this width the detail panel gives way to the table */
const COMPACT_WIDTH = 860;
/** how long one page's save may take to land before a batch stops */
const BATCH_STEP_TIMEOUT = 20000;
// converting a document and making its page takes longer than a save
const CREATE_STEP_TIMEOUT = 60000;

/** schemes a preview link or image may keep (see _safePreviewUrl) */
const PREVIEW_URL_SCHEMES = ["http", "https", "mailto", "tel"];
/** attributes that carry a URL, checked by the preview cleaner */
const PREVIEW_URL_ATTRIBUTES = [
  "href",
  "src",
  "srcset",
  "xlink:href",
  "action",
  "formaction",
  "poster",
  "background",
  "data",
  "cite",
];

/** keys the item menu shows, bound on the rows (Del as in outline-designer) */
const CONTENT_ROW_SHORTCUTS = {
  delete: {
    key: "Delete",
    keys: [{ key: "Delete" }, { key: "Backspace" }],
  },
};

/**
 * `haxcms-content-admin-dialog`
 * The Content admin section: every page, laid out as every admin panel is
 * (haxtheweb/issues#3180):
 * - toolbar: find only (search text, filter, search type, case sensitive,
 *   per page, paging); it never changes data
 * - workspace: the page table with a selector column (checkbox per page,
 *   select all, Shift+click ranges) and the shared list keyboard model;
 *   clicking a title focuses the page
 * - detail panel: a preview of the focused page and its facts, hidden on
 *   a narrow section
 * - action bar (the shell's, through `haxcms-admin-section-state`): the
 *   checked pages' Replace…, Publish, Unpublish, Show in menu, Hide in menu
 *   and Delete…
 * - item menu: right click, long press, the row ⋯ or Shift+F10
 * Replace… opens a chooser for the replacement (and the text to find when
 * no search is active), then fires the same
 * `haxcms-content-dashboard-operation` it always did: with every searched
 * match checked the detail is unchanged, otherwise it names the checked
 * pages in `nodeIds`. Publish, show / hide and delete send the editor's
 * existing per-page events (`haxcms-save-node-details` with setPublished /
 * setHideInMenu, `haxcms-delete-node`) one page at a time, each waiting
 * for its change to reach the manifest before the next; locked pages are
 * skipped and named in the result.
 * Opening a page's revisions leaves the shell (Revisions is its own dialog).
 */
class HAXCMSContentAdminDialog extends HaxcmsAdminSectionMixin(I18NMixin(DDD)) {
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
      /** the replacement the Replace… chooser sends */
      replaceValue: { type: String, attribute: "replace-value" },
      replaceLoading: { type: Boolean, attribute: "replace-loading" },
      pageLimit: { type: Number, attribute: "page-limit" },
      pageOffset: { type: Number, attribute: "page-offset" },
      /** ids of the checked pages, kept across paging and filtering */
      _checkedIds: { state: true },
      /** the page the detail panel shows */
      _focusId: { state: true },
      /** the open chooser: { action } (Replace…) */
      _choice: { state: true },
      /** the text to find, when Replace… is used without a search */
      _replaceFind: { state: true },
      /** progress words while a batch runs; empty when idle */
      _busyText: { state: true },
      _addMessage: { state: true },
      _addTone: { state: true },
      _refused: { state: true },
      /** the focused page's preview: { id, state, html } */
      _preview: { state: true },
      /** a narrow section: no detail panel */
      compact: { type: Boolean, reflect: true },
      _rowMenuFor: { state: true },
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
    // touch: a long press opens the item menu on iOS too
    this._longPress = createAdminLongPress((e) => this._onRowContextMenu(e));
    this.t = this.t || {};
    this.t = {
      ...this.t,
      noPagesMatch: "No pages match",
      replaceChoose: "Replace…",
      publish: "Publish",
      unpublish: "Unpublish",
      showInMenu: "Show in menu",
      hideInMenu: "Hide in menu",
      deleteChoose: "Delete…",
      find: "Find",
      findPlaceholder: "Text to find in the checked pages",
      replaceInPages: "Replace in {count} checked pages",
      replaceInPage: "Replace in 1 checked page",
      cancel: "Cancel",
      deleteOneConfirm: "Delete “{title}”? This cannot be undone.",
      deleteManyConfirm:
        "Delete {count} selected pages? This cannot be undone.",
      publishing: "Publishing {done} of {count}…",
      unpublishing: "Unpublishing {done} of {count}…",
      showing: "Showing {done} of {count} in the menu…",
      hiding: "Hiding {done} of {count} from the menu…",
      deleting: "Deleting {done} of {count}…",
      oneSelected: "1 selected",
      manySelected: "{count} selected",
      selectedNotShown: "{selected} · {hidden} not shown",
      publishedPages: "Published {count} pages.",
      unpublishedPages: "Unpublished {count} pages.",
      shownPages: "Showed {count} pages in the menu.",
      hiddenPages: "Hid {count} pages from the menu.",
      deletedPages: "Deleted {count} pages.",
      skippedLocked: "Skipped locked: {list}.",
      batchStopped:
        "Stopped at “{title}”: its change did not come back from the server. Pages after it were not changed.",
      hiddenFromMenu: "Hidden in menu",
      locked: "Locked",
      detailsOf: "Details of {title}",
      noPageFocused: "Pick a page to see its preview and details.",
      previewOf: "Preview of {title}",
      previewLoading: "Loading preview…",
      previewUnavailable: "No preview for this page.",
      embeddedContent: "Embedded content",
      description: "Description",
      none: "None",
      actionsFor: "Actions for {title}",
      focusPage: "Show {title} in the details panel",
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
      dropDocuments: "Drop documents here or",
      browseDocuments: "browse",
      dropDocumentsHint:
        "Drop Word, PDF, PowerPoint, Markdown, text or HTML files to make new unpublished pages under the current page",
      makingPage: "Making page {done} of {count}: {name}…",
      madePages: "Made {count} unpublished pages under {parent}.",
      madePage: "Made 1 unpublished page under {parent}.",
      makingStopped: "Stopped at {name}: the page was not made.",
      noParentPage:
        "Open a page first: new pages go under the page you have open.",
      filesGoInFiles: "Images and other files go in Files.",
      turnedAway: "Not made into pages: {list}.",
      openFiles: "Open Files",
      dismiss: "Dismiss",
      pageActions: "Page actions",
      openPage: "Open page",
      includeInReplace: "Include in replace",
      leaveOutOfReplace: "Leave out of replace",
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
    this.replaceValue = "";
    this.replaceLoading = false;
    this.pageLimit = 25;
    this.pageOffset = 0;
    this.inShell = false;
    this._checkedIds = [];
    this._focusId = "";
    this._choice = null;
    this._replaceFind = "";
    this._busyText = "";
    this._addMessage = "";
    this._addTone = "";
    this._refused = [];
    this._preview = null;
    this.compact = false;
    this.__previewCache = new Map();
    this.__range = createRangeSelector();
    this._rowMenuFor = null;
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
      ...HaxUiAdminStyles,
      ...AdminRowMenuStyles,
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
        .local-add {
          display: flex;
          justify-content: flex-end;
          padding: var(--hax-ui-gap-md) var(--ddd-spacing-5, 20px) 0;
        }
        .refused {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          margin: var(--hax-ui-gap-md) var(--ddd-spacing-5, 20px) 0;
        }
        .refused-text {
          flex: 1;
          min-width: 0;
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
          /* the colors of .hax-ui-switch, at the compact size a labelled
             toolbar toggle needs */
          background-color: var(--hax-ui-text-muted);
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
          background-color: var(--hax-ui-surface);
          transition: left var(--hax-ui-duration) var(--hax-ui-easing);
        }
        .toggle[aria-checked="true"] .track {
          background-color: var(--hax-ui-accent-strong);
        }
        .toggle[aria-checked="true"] .track::after {
          left: 14px;
        }
        .toggle:focus-visible,
        .sort:focus-visible,
        a:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        .note {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          min-height: var(--hax-ui-row-height);
          padding: var(--hax-ui-gap) var(--hax-ui-gap-lg);
          border-radius: var(--hax-ui-radius);
          font-size: 13px;
          color: var(--hax-ui-warning);
          background-color: var(--hax-ui-warning-soft);
        }
        .note.error {
          color: var(--hax-ui-danger);
          background-color: var(--hax-ui-danger-soft);
        }
        .note .grow {
          flex: 1;
          min-width: 0;
        }
        /* a button inside a note takes the note's tone */
        .note .hax-ui-btn {
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
        a.parent-link {
          font-size: inherit;
          line-height: inherit;
          background-color: transparent;
        }
        /* a title focuses its page (detail panel), as a file name does */
        .title-btn {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          vertical-align: middle;
          font-weight: var(--ddd-font-weight-medium, 500);
          color: var(--hax-ui-accent);
          border-radius: 2px;
        }
        .title-btn:hover {
          text-decoration: underline;
        }
        .title-btn:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        td.title .lock {
          --simple-icon-width: 14px;
          --simple-icon-height: 14px;
          margin-left: var(--hax-ui-gap);
          vertical-align: middle;
          color: var(--hax-ui-text-muted);
        }
        .hidden-pill {
          margin-left: var(--hax-ui-gap);
        }
        /* with the detail panel open the slug lives there, so the row
           keeps room for its history and item menu */
        table.pages.with-detail th.slug,
        table.pages.with-detail td.slug {
          display: none;
        }
        table.pages tbody tr.focus {
          box-shadow: inset 3px 0 0 var(--hax-ui-accent-strong);
        }
        .row-acts {
          display: inline-flex;
          align-items: center;
          gap: 2px;
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

        /* the table and the detail panel side by side */
        .split {
          flex: 1;
          display: flex;
          min-height: 0;
        }
        .split .table-scroll {
          position: relative;
          min-width: 0;
        }
        .detail {
          width: 300px;
          flex: none;
          display: flex;
          flex-direction: column;
          gap: var(--hax-ui-gap-lg);
          padding: var(--ddd-spacing-4, 16px);
          overflow: auto;
          border-top: 1px solid var(--hax-ui-line);
          border-left: 1px solid var(--hax-ui-line);
        }
        .detail-empty {
          margin: 0;
          color: var(--hax-ui-text-muted);
        }
        .pv {
          margin: 0;
        }
        /* the page drawn at 40%: a picture of it, not a place to work */
        .pv-frame {
          position: relative;
          height: 168px;
          overflow: hidden;
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius);
          background-color: var(--hax-ui-surface);
          pointer-events: none;
          user-select: none;
        }
        .pv-page {
          width: 250%;
          padding: var(--ddd-spacing-4, 16px);
          transform: scale(0.4);
          transform-origin: top left;
          color: var(--hax-ui-text);
        }
        .pv-page img,
        .pv-page video {
          max-width: 100%;
          height: auto;
        }
        .pv-page .pv-embed {
          padding: var(--ddd-spacing-4, 16px);
          border: 1px dashed var(--hax-ui-line-strong);
          color: var(--hax-ui-text-muted);
        }
        .pv-msg {
          display: grid;
          place-items: center;
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
          background-color: var(--hax-ui-sunken);
        }
        .detail-title {
          margin: 0;
          font-size: var(--hax-ui-admin-font-size);
          font-weight: var(--ddd-font-weight-bold, 700);
          overflow-wrap: anywhere;
        }
        .detail-pills {
          display: flex;
          flex-wrap: wrap;
          gap: var(--hax-ui-gap);
        }
        /* DDD draws a dl as a boxed list; here it is a quiet fact list */
        .detail dl {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: var(--hax-ui-gap) var(--hax-ui-gap-lg);
          margin: 0;
          padding: 0;
          border: 0;
          box-shadow: none;
          font-family: var(--hax-ui-admin-font-family);
          font-size: 13px;
          line-height: 1.4;
          color: var(--hax-ui-text);
          background-color: transparent;
        }
        .detail dt,
        .detail dd {
          margin: 0;
          padding: 0;
          border: 0;
          font-family: var(--hax-ui-admin-font-family);
          font-size: 13px;
          line-height: 1.4;
        }
        .detail dt {
          font-weight: var(--ddd-font-weight-regular, 400);
          color: var(--hax-ui-text-muted);
        }
        .detail dd {
          min-width: 0;
          overflow-wrap: anywhere;
        }
        .detail dd.mono {
          font-family: var(--ddd-font-mono, ui-monospace, monospace);
          font-size: var(--hax-ui-admin-font-size-xs);
        }
        .detail-acts {
          display: flex;
          flex-wrap: wrap;
          gap: var(--hax-ui-gap-md);
        }
        a.hax-ui-btn {
          text-decoration: none;
        }
        /* Replace…: sits above the action bar that opened it */
        .choice {
          position: sticky;
          bottom: var(--hax-ui-gap-md);
          z-index: 2;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          margin: var(--hax-ui-gap-md);
          padding: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius-lg);
          background-color: var(--hax-ui-surface);
          box-shadow: var(--hax-ui-shadow-popover);
        }
        .choice-title {
          flex: 1 1 100%;
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .choice .field {
          flex: 1 1 220px;
        }
        .choice .field input {
          flex: 1;
          width: 100%;
        }
        .choice .field input[readonly] {
          color: var(--hax-ui-text-muted);
        }
        .choice-note {
          display: inline-flex;
          align-items: center;
          gap: var(--hax-ui-gap);
          margin-right: auto;
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-warning);
          --simple-icon-width: 14px;
          --simple-icon-height: 14px;
        }
        .choice-opts {
          display: flex;
          gap: var(--hax-ui-gap-md);
        }
        /* outside the shell: the section's own action bar */
        .local-bar {
          flex: none;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          min-height: 56px;
          padding: var(--hax-ui-gap-md) var(--ddd-spacing-5, 20px);
          border-top: 1px solid var(--hax-ui-line);
        }
        .local-status {
          flex: 1;
          min-width: 0;
          font-size: 13px;
          color: var(--hax-ui-text-muted);
        }

        /* empty, loading and error states */
        /* .hax-ui-empty, set in from the table edges */
        .empty {
          margin: var(--ddd-spacing-5, 20px);
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
        .empty .hax-ui-btn {
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
        /* phone: each page is a card row (same markup): title, then
           status and last update, then its parent; history on the right */
        @container haxcms-content (max-width: 520px) {
          table.pages,
          table.pages tbody {
            display: block;
            width: 100%;
          }
          /* the header row becomes a strip of sort buttons (and
             select all, when replacing) */
          table.pages thead {
            display: block;
            position: sticky;
            top: 0;
            z-index: 1;
            background-color: var(--hax-ui-surface);
          }
          table.pages thead tr {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: var(--hax-ui-gap) var(--hax-ui-gap-lg, 12px);
            padding: var(--hax-ui-gap) var(--ddd-spacing-3, 12px);
            border-bottom: 1px solid var(--hax-ui-line-strong);
          }
          table.pages thead th,
          table.pages thead th:first-child {
            display: block;
            position: static;
            height: auto;
            padding: 0;
            border: 0;
          }
          table.pages thead th.slug,
          table.pages thead th.actions {
            display: none;
          }
          table.pages tbody tr {
            display: grid;
            grid-template-columns: auto auto minmax(0, 1fr) auto;
            grid-template-areas:
              "select title title actions"
              "select status updated actions"
              "select parent parent actions";
            column-gap: var(--hax-ui-gap-md, 8px);
            row-gap: 2px;
            align-items: center;
            padding: var(--hax-ui-gap-md, 8px) var(--ddd-spacing-3, 12px);
            border-bottom: 1px solid var(--hax-ui-line);
          }
          table.pages td,
          table.pages td:first-child {
            display: block;
            height: auto;
            min-width: 0;
            max-width: none;
            padding: 0;
            border: 0;
          }
          table.pages td.select {
            grid-area: select;
          }
          table.pages td.title {
            grid-area: title;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-weight: var(--ddd-font-weight-medium, 500);
          }
          table.pages td.status {
            grid-area: status;
          }
          table.pages td.updated {
            grid-area: updated;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: var(--hax-ui-admin-font-size-xs);
            color: var(--hax-ui-text-muted);
          }
          table.pages td.parent {
            grid-area: parent;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: var(--hax-ui-admin-font-size-xs);
            color: var(--hax-ui-text-muted);
          }
          table.pages td.parent .none {
            display: none;
          }
          table.pages td.actions {
            grid-area: actions;
          }
        }
        @media screen and (max-width: 640px) {
          .field.query {
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
    if (typeof globalThis.ResizeObserver === "function") {
      this.__resizeObserver = new globalThis.ResizeObserver((entries) => {
        const entry = entries && entries.length ? entries[0] : null;
        const width = entry ? entry.contentRect.width : this.offsetWidth;
        // 0 while hidden: keep the last layout
        if (width > 0) {
          const next = width < COMPACT_WIDTH;
          if (next !== this.compact) {
            this.compact = next;
          }
        }
      });
      this.__resizeObserver.observe(this);
    }
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
    if (this.__resizeObserver) {
      this.__resizeObserver.disconnect();
      this.__resizeObserver = null;
    }
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
        "searchMode",
        "searchMatches",
        "lastSearchQuery",
        "searchLoading",
        "replaceLoading",
        "_checkedIds",
        "_busyText",
        "_addMessage",
        "pageOffset",
        "pageLimit",
        "_sortKey",
        "_sortDir",
      ].some((key) => cp.has(key))
    ) {
      this._emitState();
    }
    // a checked or focused page that went away (deleted) lets go
    if (cp.has("rows")) {
      const ids = new Set(this.rows.map((row) => row.id));
      const kept = this._checkedIds.filter((id) => ids.has(id));
      if (kept.length !== this._checkedIds.length) {
        this._checkedIds = kept;
      }
      if (this._focusId && !ids.has(this._focusId)) {
        this._focusId = "";
      }
    }
    if (cp.has("_focusId")) {
      this._loadPreview();
    }
    if (cp.has("_choice") && this._choice) {
      this.updateComplete.then(() => {
        const first =
          this.shadowRoot &&
          this.shadowRoot.querySelector(
            ".choice input:not([readonly]), .choice .hax-ui-btn",
          );
        if (first) {
          first.focus();
        }
      });
    }
  }

  /** the shell's action bar: what can be done to the checked pages */
  get selectionActions() {
    const busy = !!this._busyText || this.replaceLoading;
    return [
      {
        id: "replace",
        label: this.replaceLoading ? this.t.replacing : this.t.replaceChoose,
        icon: HaxUiAdminIcons.findReplace,
        danger: false,
        disabled: busy,
      },
      {
        id: "publish",
        label: this.t.publish,
        icon: HaxUiAdminIcons.check,
        danger: false,
        disabled: busy,
      },
      {
        id: "unpublish",
        label: this.t.unpublish,
        icon: HaxUiAdminIcons.close,
        danger: false,
        disabled: busy,
      },
      {
        id: "show",
        label: this.t.showInMenu,
        icon: HaxUiAdminIcons.preview,
        danger: false,
        disabled: busy,
      },
      {
        id: "hide",
        label: this.t.hideInMenu,
        icon: HaxUiAdminIcons.hide,
        danger: false,
        disabled: busy,
      },
      {
        id: "delete",
        label: this.t.deleteChoose,
        icon: HaxUiAdminIcons.delete,
        danger: true,
        disabled: busy,
      },
    ];
  }

  /**
   * words for the bar: a batch's progress while it runs; otherwise the
   * count, saying how many checked pages the filter or paging hides
   */
  _selectionText() {
    if (this._busyText) {
      return this._busyText;
    }
    const count = this._checkedIds.length;
    if (!count) {
      return "";
    }
    const selected =
      count === 1
        ? this.t.oneSelected
        : this._fill(this.t.manySelected, { count: count });
    const shown = new Set(this.pagedRows.map((row) => row.id));
    const hidden = this._checkedIds.filter((id) => !shown.has(id)).length;
    return hidden
      ? this._fill(this.t.selectedNotShown, {
          selected: selected,
          hidden: hidden,
        })
      : selected;
  }

  /** ids of the pages the current search matched, in result order */
  _matchedIds() {
    if (this._searchMatchCount() < 1) {
      return [];
    }
    return this.searchMatches;
  }

  /** checked page ids, in the table's order */
  _checkedRowIds() {
    const checked = new Set(this._checkedIds);
    return this.sortedRows
      .map((row) => row.id)
      .concat(this.rows.map((row) => row.id))
      .filter((id, index, all) => checked.has(id) && all.indexOf(id) === index);
  }

  /** matched page ids that are checked, in result order */
  _checkedMatchIds() {
    const checked = new Set(this._checkedIds);
    return this._matchedIds().filter((id) => checked.has(id));
  }

  /** whether a page is checked */
  _isChecked(id) {
    return this._checkedIds.includes(id);
  }

  /** check or uncheck one page */
  _togglePage(id, checked) {
    const others = this._checkedIds.filter((item) => item !== id);
    this._checkedIds = checked ? [...others, id] : others;
  }

  /** check or uncheck every page the filter shows (every page of it) */
  _toggleAllPages(checked) {
    const shown = this.filteredRows.map((row) => row.id);
    if (checked) {
      this._checkedIds = [...new Set([...this._checkedIds, ...shown])];
    } else {
      const drop = new Set(shown);
      this._checkedIds = this._checkedIds.filter((id) => !drop.has(id));
    }
  }

  /** a checkbox click: Shift+click checks or unchecks the range */
  _onCheckboxClick(e, index, id) {
    const checked = e.target.checked;
    const rows = this.pagedRows;
    this.__range.click(index, checked, e.shiftKey, (i, on) => {
      const row = rows[i];
      if (row) {
        this._togglePage(row.id, on);
      }
    });
    if (checked) {
      this._focusId = id;
    }
  }

  _emitState() {
    this._dispatchSectionState({
      selected: this._checkedIds.length,
      selectionText: this._selectionText(),
      actions: this.selectionActions,
      addArea: this.addArea,
    });
  }

  /**
   * section contract: run an action on the checked pages. Replace… opens
   * its chooser; the others run the editor's per-page saves in turn.
   * @param {string} id
   */
  runAction(id) {
    if (this._busyText || this._checkedIds.length === 0) {
      return;
    }
    switch (id) {
      case "replace":
        this._openReplace();
        break;
      case "publish":
      case "unpublish":
      case "show":
      case "hide":
        this._runDetailsBatch(id);
        break;
      case "delete":
        this._runDeleteBatch();
        break;
      default:
        break;
    }
  }

  /**
   * The add area (area 9): documents dropped or chosen become new
   * unpublished pages under the page open behind the dialog.
   */
  get addArea() {
    return {
      accept: ADMIN_DOCUMENT_TYPES.map((type) => `.${type}`).join(","),
      label: this.t.dropDocuments,
      browseLabel: this.t.browseDocuments,
      hint: this.t.dropDocumentsHint,
      message: this._addMessage,
      tone: this._addTone,
      disabled: !!this._busyText,
      busy: !!this._busyText,
    };
  }

  /** the editor UI that runs Merlin's upload program */
  _editorUI() {
    return store &&
      store.cmsSiteEditor &&
      store.cmsSiteEditor.haxCmsSiteEditorUIElement
      ? store.cmsSiteEditor.haxCmsSiteEditorUIElement
      : null;
  }

  /** resolves with the page the editor made, or null after the timeout */
  _nextCreated(timeout = CREATE_STEP_TIMEOUT) {
    return new Promise((resolve) => {
      let timer = null;
      const done = (e) => {
        globalThis.removeEventListener("haxcms-create-node-success", done);
        clearTimeout(timer);
        resolve(e && e.detail && e.detail.item ? e.detail.item : null);
      };
      globalThis.addEventListener("haxcms-create-node-success", done);
      timer = setTimeout(() => done(null), timeout);
    });
  }

  /**
   * section contract: files from the add area. Each document goes through
   * Merlin's upload program as "new child page" of the page open behind
   * the dialog (processFileContentsBasedOnUserDesire, create-child), one
   * at a time so they land in drop order as siblings, then is set
   * unpublished with the same haxcms-save-node-details Unpublish sends.
   * Images and other files are turned away to Files.
   * @param {{ files: File[] }} detail
   */
  async addFiles(detail) {
    if (this._busyText || !detail) {
      return;
    }
    const { taken, refused } = splitAdminAddFiles(
      detail.files,
      ADMIN_DOCUMENT_TYPES,
    );
    this._refused = refused.map((file) => file.name);
    // what was turned away shows once, in the notice with Open Files
    if (taken.length === 0) {
      this._addMessage = "";
      this._addTone = "";
      return;
    }
    const parent = toJS(store.activeItem);
    const ui = this._editorUI();
    if (!parent || !parent.id || !ui) {
      this._addMessage = this.t.noParentPage;
      this._addTone = "error";
      return;
    }
    this._addMessage = "";
    this._addTone = "";
    const made = [];
    let stoppedAt = null;
    for (let i = 0; i < taken.length; i++) {
      const file = taken[i];
      const type = adminFileType(file);
      this._busyText = this._fill(this.t.makingPage, {
        done: i + 1,
        count: taken.length,
        name: file.name,
      });
      // the values Merlin's upload builds once a file is chosen
      const values = {
        operation: "file-selected",
        contents: ["md", "txt", "html", "htm"].includes(type)
          ? await file.text()
          : "",
        data: file,
        type: type,
        contextItemId: parent.id,
        keepOpen: true,
      };
      const created = this._nextCreated();
      ui.processFileContentsBasedOnUserDesire(values, "create-child");
      const item = await created;
      const id = item && item.id ? String(item.id) : "";
      // in the manifest before the next one, so it is placed after this one
      const landed = id
        ? await this._waitFor(() => this._storeItem(id))
        : false;
      if (!landed) {
        stoppedAt = file;
        break;
      }
      globalThis.dispatchEvent(
        new CustomEvent("haxcms-save-node-details", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: { id: id, operation: "setPublished", published: false },
        }),
      );
      await this._waitFor(() => {
        const now = this._storeItem(id);
        return (
          now &&
          now.metadata &&
          this._toBoolPublished(now.metadata.published) === false
        );
      });
      made.push(id);
    }
    this._busyText = "";
    const parts = [];
    if (made.length) {
      parts.push(
        this._fill(made.length === 1 ? this.t.madePage : this.t.madePages, {
          count: made.length,
          parent: parent.title || "",
        }),
      );
    }
    if (stoppedAt) {
      parts.push(this._fill(this.t.makingStopped, { name: stoppedAt.name }));
    }
    this._addMessage = parts.join(" ");
    this._addTone = stoppedAt ? "error" : "";
    if (made.length) {
      this._checkedIds = made;
      this._focusId = made[0];
    }
  }

  _goToFiles() {
    this.dispatchEvent(
      new CustomEvent("haxcms-site-admin-navigate", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: { route: "files" },
      }),
    );
  }

  /** section contract: uncheck every page; filters and search stay */
  clearSelection() {
    this._checkedIds = [];
    this.__range.reset();
    this._choice = null;
  }

  /** the item a page row stands for, from the live manifest */
  _storeItem(id) {
    return store && typeof store.findItem === "function"
      ? store.findItem(id)
      : null;
  }

  /**
   * Resolves true once `test()` holds, false after the timeout. The editor
   * patches the manifest from each save's response and fires no event of
   * its own, so a batch waits on the manifest before the next page.
   */
  _waitFor(test, timeout = BATCH_STEP_TIMEOUT) {
    return new Promise((resolve) => {
      const started = Date.now();
      const check = () => {
        let ok = false;
        try {
          ok = !!test();
        } catch {
          ok = false;
        }
        if (ok) {
          resolve(true);
        } else if (Date.now() - started >= timeout) {
          resolve(false);
        } else {
          setTimeout(check, 120);
        }
      };
      check();
    });
  }

  /** the checked pages, split into those a batch may change and locked */
  _batchRows() {
    const byId = new Map(this.rows.map((row) => [row.id, row]));
    const rows = this._checkedRowIds()
      .map((id) => byId.get(id))
      .filter((row) => !!row);
    return {
      open: rows.filter((row) => !row.locked),
      locked: rows.filter((row) => row.locked),
    };
  }

  /**
   * Publish, Unpublish, Show in menu, Hide in menu: the editor's
   * haxcms-save-node-details (the Merlin and page menu toggles send the
   * same) for each checked page whose state differs, one page at a time.
   * @param {string} action
   */
  async _runDetailsBatch(action) {
    const plan = {
      publish: {
        field: "published",
        operation: "setPublished",
        value: true,
        current: (row) => row.published,
        progress: this.t.publishing,
        done: this.t.publishedPages,
      },
      unpublish: {
        field: "published",
        operation: "setPublished",
        value: false,
        current: (row) => row.published,
        progress: this.t.unpublishing,
        done: this.t.unpublishedPages,
      },
      show: {
        field: "hideInMenu",
        operation: "setHideInMenu",
        value: false,
        current: (row) => !row.visible,
        progress: this.t.showing,
        done: this.t.shownPages,
      },
      hide: {
        field: "hideInMenu",
        operation: "setHideInMenu",
        value: true,
        current: (row) => !row.visible,
        progress: this.t.hiding,
        done: this.t.hiddenPages,
      },
    }[action];
    const { open, locked } = this._batchRows();
    // the live manifest item says what a page is now (an earlier batch may
    // have changed it); the row is the fallback
    const now = (row) => {
      const item = this._storeItem(row.id);
      if (!item || !item.metadata) {
        return plan.current(row);
      }
      return plan.field === "published"
        ? this._toBoolPublished(item.metadata.published)
        : !this._toBoolVisible(item.metadata.hideInMenu);
    };
    const todo = open.filter((row) => now(row) !== plan.value);
    let done = 0;
    let stoppedAt = null;
    for (let i = 0; i < todo.length; i++) {
      const row = todo[i];
      this._busyText = this._fill(plan.progress, {
        done: i + 1,
        count: todo.length,
      });
      const detail = { id: row.id, operation: plan.operation };
      detail[plan.field] = plan.value;
      globalThis.dispatchEvent(
        new CustomEvent("haxcms-save-node-details", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: detail,
        }),
      );
      const landed = await this._waitFor(() => {
        const item = this._storeItem(row.id);
        const metadata = item && item.metadata ? item.metadata : {};
        return plan.field === "published"
          ? this._toBoolPublished(metadata.published) === plan.value
          : !this._toBoolVisible(metadata.hideInMenu) === plan.value;
      });
      if (!landed) {
        stoppedAt = row;
        break;
      }
      done++;
    }
    this._busyText = "";
    this._finishBatch(plan.done, done, locked, stoppedAt);
  }

  /**
   * Delete…: one confirm for the checked pages, then the editor's
   * haxcms-delete-node for each, waiting for it to leave the manifest.
   */
  async _runDeleteBatch() {
    const { open, locked } = this._batchRows();
    if (open.length === 0) {
      this._finishBatch(this.t.deletedPages, 0, locked, null);
      return;
    }
    const message =
      open.length === 1
        ? this._fill(this.t.deleteOneConfirm, { title: open[0].title })
        : this._fill(this.t.deleteManyConfirm, { count: open.length });
    if (!globalThis.confirm(message)) {
      return;
    }
    let done = 0;
    let stoppedAt = null;
    for (let i = 0; i < open.length; i++) {
      const row = open[i];
      this._busyText = this._fill(this.t.deleting, {
        done: i + 1,
        count: open.length,
      });
      globalThis.dispatchEvent(
        new CustomEvent("haxcms-delete-node", {
          bubbles: true,
          composed: true,
          cancelable: true,
          // keep the admin dialog open between pages
          detail: { item: { id: row.id }, keepOpen: true },
        }),
      );
      const gone = await this._waitFor(() => !this._storeItem(row.id));
      if (!gone) {
        stoppedAt = row;
        break;
      }
      done++;
    }
    this._busyText = "";
    this._finishBatch(this.t.deletedPages, done, locked, stoppedAt);
  }

  /** one toast for a batch: what changed, what was skipped, where it stopped */
  _finishBatch(doneText, count, locked, stoppedAt) {
    const parts = [this._fill(doneText, { count })];
    if (locked.length) {
      parts.push(
        this._fill(this.t.skippedLocked, {
          list: locked.map((row) => row.title).join(", "),
        }),
      );
    }
    if (stoppedAt) {
      parts.push(this._fill(this.t.batchStopped, { title: stoppedAt.title }));
    }
    if (store && typeof store.toast === "function") {
      store.toast(parts.join(" "), 4000, {
        tone: stoppedAt ? "danger" : locked.length ? "warning" : "success",
      });
    }
    this._refreshTable();
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
        locked: !!(metadata.locked === true || metadata.locked === "true"),
        description: item.description || "",
        location: item.location || "",
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
    if (this.filterField === "visibility") {
      this.filterValue = "any";
    } else {
      this.filterValue = "";
    }
  }

  _onSearchMode(e) {
    this.searchMode = e.detail.value;
    this.searchMatches = null;
    this.lastSearchQuery = "";
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
    // a search shows its matches; what is checked stays the person's own
    this.searchMatches = [...new Set(ids)];
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

  /**
   * The text Replace… finds: the toolbar's full text search when there is
   * one, otherwise what the chooser asks for.
   */
  _replaceFindFromSearch() {
    if (this.filterField !== "search" || this.searchMode !== "fulltext") {
      return "";
    }
    return this.filterValue ? this.filterValue.trim() : "";
  }

  _replaceFindText() {
    const fromSearch = this._replaceFindFromSearch();
    return fromSearch || (this._replaceFind ? this._replaceFind.trim() : "");
  }

  _openReplace() {
    this._replaceFind = "";
    this._choice = { action: "replace" };
  }

  _closeChoice() {
    this._choice = null;
  }

  _onChoiceKeydown(e) {
    closeChoiceOnEscape(e, this);
  }

  _canRunReplace() {
    const searchTerm = this._replaceFindText();
    if (searchTerm.length <= 1) {
      return false;
    }
    if (this.searchLoading || this.replaceLoading || this._busyText) {
      return false;
    }
    if (this._checkedIds.length < 1) {
      return false;
    }
    const replaceLength = this.replaceValue
      ? this.replaceValue.trim().length
      : 0;
    return replaceLength !== 1;
  }

  _applyReplace() {
    if (!this._canRunReplace()) {
      return;
    }
    const searchTerm = this._replaceFindText();
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
    // every match of the search checked, and nothing else, sends the detail
    // as it always was; any other selection names its pages
    const matched = this._replaceFindFromSearch() ? this._matchedIds() : [];
    const checked = this._checkedRowIds();
    const sameAsMatches =
      matched.length > 0 &&
      matched.length === checked.length &&
      matched.every((id) => this._checkedIds.includes(id));
    if (!sameAsMatches) {
      detail.nodeIds = matched.length
        ? matched
            .filter((id) => this._checkedIds.includes(id))
            .concat(checked.filter((id) => !matched.includes(id)))
        : checked;
    }
    this._choice = null;
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

  /** the focused page's content, cleaned for an inert preview */
  async _loadPreview() {
    const id = this._focusId;
    const row = id ? this.rows.find((item) => item.id === id) : null;
    if (!row || !row.location) {
      this._preview = row ? { id, state: "none", html: "" } : null;
      return;
    }
    if (this.__previewCache.has(id)) {
      this._preview = { id, state: "ready", html: this.__previewCache.get(id) };
      return;
    }
    this._preview = { id, state: "loading", html: "" };
    let text = null;
    try {
      // the page file, as haxcms-site-builder loads it, relative to the
      // site's base
      const url = new URL(row.location, globalThis.document.baseURI).href;
      const response = await globalThis.fetch(url);
      text = response && response.ok ? await response.text() : null;
    } catch {
      text = null;
    }
    if (this._focusId !== id) {
      return;
    }
    if (text === null) {
      this._preview = { id, state: "none", html: "" };
      return;
    }
    const clean = this._cleanPreview(text);
    this.__previewCache.set(id, clean);
    this._preview = { id, state: "ready", html: clean };
  }

  /**
   * Page HTML for a preview that only shows: no scripts, no inline event
   * handlers or script URLs, and embeds drawn as a labelled box.
   */
  _cleanPreview(text) {
    const doc = new globalThis.DOMParser().parseFromString(
      `<body>${text}</body>`,
      "text/html",
    );
    doc.body
      .querySelectorAll("script, noscript, object, embed, link, meta, base")
      .forEach((node) => node.remove());
    doc.body.querySelectorAll("iframe").forEach((node) => {
      const box = doc.createElement("div");
      box.className = "pv-embed";
      box.textContent = this.t.embeddedContent;
      node.replaceWith(box);
    });
    doc.body.querySelectorAll("*").forEach((node) => {
      [...node.attributes].forEach((attr) => {
        const name = attr.name.toLowerCase();
        if (
          name.indexOf("on") === 0 ||
          name === "srcdoc" ||
          (PREVIEW_URL_ATTRIBUTES.includes(name) &&
            !this._safePreviewUrl(attr.value, node.tagName, name))
        ) {
          node.removeAttribute(attr.name);
        }
      });
    });
    return doc.body.innerHTML;
  }

  /**
   * Whether a URL may stay in the preview. Browsers ignore whitespace and
   * control characters inside a scheme, so those are removed first. Only an
   * allow-list of schemes survives: relative URLs, http(s), mailto and tel,
   * plus a raster data: image on an image (inline pictures in page content).
   * Everything else (javascript:, vbscript:, other data:, unknown schemes)
   * is dropped.
   */
  _safePreviewUrl(raw, tagName, attrName) {
    const value = String(raw || "")
      // eslint-disable-next-line no-control-regex
      .replace(/[\u0000-\u0020\u007f-\u009f]/g, "")
      .toLowerCase();
    const match = value.match(/^([a-z][a-z0-9+.-]*):/);
    if (!match) {
      // no scheme: relative path, fragment or query
      return true;
    }
    const scheme = match[1];
    if (PREVIEW_URL_SCHEMES.includes(scheme)) {
      return true;
    }
    const tag = String(tagName || "").toLowerCase();
    return (
      scheme === "data" &&
      /^data:image\/(png|jpe?g|gif|webp|avif|bmp)[;,]/.test(value) &&
      (tag === "img" || tag === "source") &&
      (attrName === "src" || attrName === "srcset")
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

  /**
   * The item menu: a right click or long press on a row, its ⋯, Shift+F10
   * or the context menu key. A page that is not checked becomes the only
   * checked page first, as in Files, so the menu acts on what the action
   * bar acts on; its items run the same code as the control they mirror.
   */
  _onRowContextMenu(e) {
    // Android's own long-press contextmenu, after ours already opened it
    if (
      e.type === "contextmenu" &&
      e.cancelable &&
      this._longPress.justOpened()
    ) {
      e.preventDefault();
      return;
    }
    const tr = this._menuRow(e);
    if (!tr) {
      return;
    }
    e.preventDefault();
    this._openRowMenu(tr, e);
  }

  /** the table's keys: the item menu, then the shared list model */
  _onTableKeydown(e) {
    if (this._runRowShortcut(e)) {
      return;
    }
    if (isAdminRowMenuKey(e)) {
      const tr = this._menuRow(e);
      if (tr) {
        e.preventDefault();
        this._openRowMenu(tr, e);
      }
      return;
    }
    handleAdminListKey(e, {
      rows: () => [...this.shadowRoot.querySelectorAll("table.pages tbody tr")],
      isChecked: (tr) => this._isChecked(tr.getAttribute("data-node-id")),
      setChecked: (tr, checked) =>
        this._togglePage(tr.getAttribute("data-node-id"), checked),
      selectAll: () => this._toggleAllPages(true),
      clear: () => {
        if (this._choice) {
          this._choice = null;
          return true;
        }
        if (!this._checkedIds.length) {
          return false;
        }
        this.clearSelection();
        return true;
      },
    });
  }

  /** keyboard focus moving onto a row shows it in the detail panel */
  _onTableFocusin(e) {
    const path = e.composedPath ? e.composedPath() : [e.target];
    const tr = path.find(
      (node) => node && node.matches && node.matches("tr[data-node-id]"),
    );
    if (tr) {
      this._focusId = tr.getAttribute("data-node-id");
    }
  }

  /** the row an event is for, unless it came from typing in a field */
  _menuRow(e) {
    const target = e.composedPath ? e.composedPath()[0] : e.target;
    if (!target || !target.closest) {
      return null;
    }
    const tag = target.tagName ? target.tagName.toLowerCase() : "";
    if (tag === "textarea" || (tag === "input" && target.type !== "checkbox")) {
      return null;
    }
    return target.closest("tr[data-node-id]");
  }

  _openRowMenu(tr, e) {
    const id = tr.getAttribute("data-node-id");
    if (!this._isChecked(id) && !this._busyText) {
      this._checkedIds = [id];
    }
    this._focusId = id;
    this._rowMenuFor = id;
    // from the keyboard or the ⋯ the menu opens under that control; a
    // pointer opens it where it was pressed
    const control =
      e.type === "click" && e.currentTarget && e.currentTarget.closest
        ? e.currentTarget
        : e.type === "keydown" && e.target && e.target.closest
          ? e.target
          : tr;
    this.updateComplete.then(() => {
      openAdminRowMenu(
        this.shadowRoot.querySelector(".admin-row-menu"),
        e,
        control,
      );
    });
  }

  /** the control in the row the menu is open for, found when it runs */
  _rowControl(selector) {
    const tr = this.shadowRoot.querySelector(
      `tr[data-node-id="${CSS.escape(this._rowMenuFor || "")}"]`,
    );
    return tr ? tr.querySelector(selector) : null;
  }

  /** go to a page, through the site's own link handling */
  _openPage(slug) {
    if (!slug) {
      return;
    }
    const link = globalThis.document.createElement("a");
    link.href = slug;
    link.hidden = true;
    this.shadowRoot.appendChild(link);
    link.click();
    link.remove();
  }

  _rowMenuItems() {
    const id = this._rowMenuFor;
    const row = id ? this.rows.find((item) => item.id === id) : null;
    if (!row) {
      return [];
    }
    const items = [
      {
        id: "open-page",
        label: this.t.openPage,
        icon: HaxUiAdminIcons.page,
        run: () => this._openPage(row.slug),
      },
      {
        id: "open-revisions",
        label: this.t.viewPageRevisions,
        icon: HaxUiAdminIcons.history,
        run: () => {
          const control = this._rowControl('[data-action="open-revisions"]');
          if (control) {
            control.click();
          }
        },
      },
      { separator: true },
    ];
    this.selectionActions.forEach((action) => {
      items.push(
        Object.assign({}, action, {
          shortcut: CONTENT_ROW_SHORTCUTS[action.id],
          run: () => this.runAction(action.id),
        }),
      );
    });
    return items;
  }

  /**
   * A row shortcut from the item menu (Delete, as in outline-designer): the
   * row becomes the selection first when it is not part of it, as the menu
   * does, then the same runAction runs. Returns true when one ran.
   */
  _runRowShortcut(e) {
    const ids = Object.keys(CONTENT_ROW_SHORTCUTS);
    const id = ids.find((key) =>
      CONTENT_ROW_SHORTCUTS[key].keys.some((k) => matchesAdminShortcut(e, k)),
    );
    if (!id || this._busyText) {
      return false;
    }
    const tr = this._menuRow(e);
    if (!tr) {
      return false;
    }
    const nodeId = tr.getAttribute("data-node-id");
    if (!this._isChecked(nodeId)) {
      this._checkedIds = [nodeId];
    }
    this._focusId = nodeId;
    const action = this.selectionActions.find((a) => a.id === id);
    if (!action || action.disabled || action.soon) {
      return false;
    }
    e.preventDefault();
    this.runAction(id);
    return true;
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
    const actionTarget = actionTargetFromEvent(e);
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
    return html`<label class="field hax-ui-tool-field ${extraClass}">
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
          icon="${
            sorted && this._sortDir === "desc"
              ? HaxUiAdminIcons.moveDown
              : HaxUiAdminIcons.moveUp
          }"
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
      ${
        total > 0
          ? html`<span class="range"
                >${this._fill(this.t.rangeOf, { start, end, total })}</span
              >
              <button
                type="button"
                class="hax-ui-icon-btn page-prev"
                aria-label="${this.t.previousPage}"
                title="${this.t.previousPage}"
                ?disabled="${this.pageOffset <= 0}"
                @click="${() =>
                  this._goToOffset(this.pageOffset - this.pageLimit)}"
              >
                <simple-icon-lite
                  icon="${HaxUiAdminIcons.chevronLeft}"
                  aria-hidden="true"
                ></simple-icon-lite>
              </button>
              <button
                type="button"
                class="hax-ui-icon-btn page-next"
                aria-label="${this.t.nextPage}"
                title="${this.t.nextPage}"
                ?disabled="${end >= total}"
                @click="${() =>
                  this._goToOffset(this.pageOffset + this.pageLimit)}"
              >
                <simple-icon-lite
                  icon="${HaxUiAdminIcons.chevron}"
                  aria-hidden="true"
                ></simple-icon-lite>
              </button>`
          : nothing
      }
    </div>`;
  }

  /**
   * The page table: the selector column, sortable columns, and at the row
   * end page history and the ⋯ item menu.
   */
  _renderTable() {
    const shown = this.filteredRows.map((row) => row.id);
    const checkedShown = shown.filter((id) => this._isChecked(id)).length;
    const allChecked = shown.length > 0 && checkedShown === shown.length;
    const someChecked = checkedShown > 0 && !allChecked;
    const withDetail = !this.compact && this.rows.length > 0;
    return html`<table class="pages ${withDetail ? "with-detail" : ""}">
      <thead>
        <tr>
          <th scope="col" class="select">
            <input
              type="checkbox"
              class="select-all"
              aria-label="${this.t.selectAllPages}"
              title="${this.t.selectAllPages}"
              .checked="${allChecked}"
              .indeterminate="${someChecked}"
              ?disabled="${!!this._busyText}"
              @change="${(e) => this._toggleAllPages(e.target.checked)}"
            />
          </th>
          ${this._columns.map((column) => this._renderSortHeader(column))}
          <th scope="col" class="actions">
            <span class="hax-ui-sr-only">${this.t.actions}</span>
          </th>
        </tr>
      </thead>
      <tbody
        @contextmenu="${this._onRowContextMenu}"
        @pointerdown="${this._longPress.pointerdown}"
        @pointermove="${this._longPress.pointermove}"
        @pointerup="${this._longPress.pointerup}"
        @pointercancel="${this._longPress.pointercancel}"
        @keydown="${this._onTableKeydown}"
        @focusin="${this._onTableFocusin}"
      >
        ${this.pagedRows.map((row, index) => {
          const checked = this._isChecked(row.id);
          return html`<tr
            class="${checked ? "checked" : ""} ${
              row.id === this._focusId ? "focus" : ""
            }"
            data-node-id="${row.id}"
          >
            <td class="select">
              <input
                type="checkbox"
                class="select-page"
                data-node-id="${row.id}"
                aria-label="${this.t.selectPage.replace(
                  "{title}",
                  () => row.title,
                )}"
                .checked="${checked}"
                ?disabled="${!!this._busyText}"
                @click="${(e) => this._onCheckboxClick(e, index, row.id)}"
              />
            </td>
            <td class="title" title="${row.title}">
              <button
                type="button"
                class="title-btn"
                data-node-id="${row.id}"
                aria-label="${this.t.focusPage.replace(
                  "{title}",
                  () => row.title,
                )}"
                @click="${() => {
                  this._focusId = row.id;
                }}"
              >
                ${row.title}
              </button>
              ${
                row.locked
                  ? html`<simple-icon-lite
                      class="lock"
                      icon="${HaxUiAdminIcons.key}"
                      title="${this.t.locked}"
                      aria-label="${this.t.locked}"
                    ></simple-icon-lite>`
                  : nothing
              }
            </td>
            <td class="status">
              <span
                class="hax-ui-pill"
                data-tone="${row.published ? "success" : "neutral"}"
                >${row.statusLabel}</span
              >
              ${
                row.visible
                  ? nothing
                  : html`<span class="hax-ui-pill hidden-pill"
                      >${this.t.hiddenFromMenu}</span
                    >`
              }
            </td>
            <td class="updated">
              ${
                row.updated
                  ? html`<time
                      datetime="${this._isoDate(row.updated)}"
                      title="${this._fullDate(row.updated)}"
                      >${row.updatedLabel}</time
                    >`
                  : html`<span class="none" aria-hidden="true">—</span>`
              }
            </td>
            <td class="parent" title="${row.parent}">
              ${
                row.parentSlug
                  ? html`<a class="parent-link" href="${row.parentSlug}"
                      >${row.parent}</a
                    >`
                  : html`<span class="none">—</span>`
              }
            </td>
            <td class="slug mono" title="${row.slug}">${row.slug}</td>
            <td class="actions">
              <span class="row-acts">
                <button
                  type="button"
                  class="hax-ui-icon-btn row-action"
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
                    icon="${HaxUiAdminIcons.history}"
                    aria-hidden="true"
                  ></simple-icon-lite>
                </button>
                ${renderRowMoreButton(
                  this.t.actionsFor.replace("{title}", () => row.title),
                  (e) => this._openRowMenu(e.currentTarget.closest("tr"), e),
                )}
              </span>
            </td>
          </tr>`;
        })}
      </tbody>
    </table>`;
  }

  /** the detail panel: the focused page's preview, then its facts */
  _renderDetail() {
    const row = this._focusId
      ? this.rows.find((item) => item.id === this._focusId)
      : null;
    if (!row) {
      return html`<aside class="detail" aria-label="${this.t.noPageFocused}">
        <p class="detail-empty">${this.t.noPageFocused}</p>
      </aside>`;
    }
    const preview =
      this._preview && this._preview.id === row.id ? this._preview : null;
    return html`<aside
      class="detail"
      aria-label="${this.t.detailsOf.replace("{title}", () => row.title)}"
    >
      <figure class="pv">
        ${
          preview && preview.state === "ready"
            ? html`<div class="pv-frame" inert aria-hidden="true">
                <div class="pv-page">${unsafeHTML(preview.html)}</div>
              </div>`
            : html`<div class="pv-frame pv-msg">
                ${
                  preview && preview.state === "loading"
                    ? this.t.previewLoading
                    : this.t.previewUnavailable
                }
              </div>`
        }
        <figcaption class="hax-ui-sr-only">
          ${this.t.previewOf.replace("{title}", () => row.title)}
        </figcaption>
      </figure>
      <h3 class="detail-title">${row.title}</h3>
      <div class="detail-pills">
        <span
          class="hax-ui-pill"
          data-tone="${row.published ? "success" : "neutral"}"
          >${row.statusLabel}</span
        >
        ${
          row.visible
            ? nothing
            : html`<span class="hax-ui-pill">${this.t.hiddenFromMenu}</span>`
        }
        ${
          row.locked
            ? html`<span class="hax-ui-pill">${this.t.locked}</span>`
            : nothing
        }
      </div>
      <dl>
        <dt>${this.t.updated}</dt>
        <dd title="${this._fullDate(row.updated)}">
          ${row.updatedLabel || this.t.none}
        </dd>
        <dt>${this.t.parent}</dt>
        <dd>${row.parent || this.t.none}</dd>
        <dt>${this.t.slug}</dt>
        <dd class="mono">${row.slug}</dd>
        <dt>${this.t.description}</dt>
        <dd>${row.description || this.t.none}</dd>
        <dt>${this.t.tags}</dt>
        <dd>${row.tags || this.t.none}</dd>
      </dl>
      <div class="detail-acts">
        <a class="hax-ui-btn open-page" href="${row.slug}">
          <simple-icon-lite
            icon="${HaxUiAdminIcons.page}"
            aria-hidden="true"
          ></simple-icon-lite>
          ${this.t.openPage}
        </a>
        <button
          type="button"
          class="hax-ui-btn detail-revisions"
          data-action="open-revisions"
          data-node-id="${row.id}"
          data-node-title="${row.title}"
          @click="${this._openRevisions}"
        >
          <simple-icon-lite
            icon="${HaxUiAdminIcons.history}"
            aria-hidden="true"
          ></simple-icon-lite>
          ${this.t.viewPageRevisions}
        </button>
      </div>
    </aside>`;
  }

  /** Replace…: the text to find (without a search) and the replacement */
  _renderChoice() {
    const fromSearch = this._replaceFindFromSearch();
    const count = this._checkedIds.length;
    return html`<div
      class="choice"
      role="group"
      aria-labelledby="choice-title"
      @keydown="${this._onChoiceKeydown}"
    >
      <span class="choice-title" id="choice-title"
        >${
          count === 1
            ? this.t.replaceInPage
            : this.t.replaceInPages.replace("{count}", () => count)
        }</span
      >
      <label class="field hax-ui-tool-field choice-find">
        <span>${this.t.find}</span>
        <input
          type="text"
          name="replace-find"
          placeholder="${this.t.findPlaceholder}"
          .value="${fromSearch || this._replaceFind}"
          ?readonly="${!!fromSearch}"
          @input="${(e) => {
            this._replaceFind = e.target.value;
          }}"
        />
      </label>
      <label class="field hax-ui-tool-field choice-replace">
        <span>${this.t.replaceWith}</span>
        <input
          type="text"
          name="replace-value"
          placeholder="${this.t.replacementPlaceholder}"
          .value="${this.replaceValue}"
          @input="${(e) => this._onReplaceValue(this._v(e))}"
          @keydown="${(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              this._applyReplace();
            }
          }}"
        />
      </label>
      <span class="choice-note">
        <simple-icon-lite
          icon="${HaxUiAdminIcons.warning}"
          aria-hidden="true"
        ></simple-icon-lite>
        ${this.t.replaceCannotBeUndone}
      </span>
      <div class="choice-opts">
        <button
          type="button"
          class="hax-ui-btn ghost choice-cancel"
          @click="${this._closeChoice}"
        >
          ${this.t.cancel}
        </button>
        <button
          type="button"
          class="hax-ui-btn danger choice-apply replace-btn"
          ?disabled="${!this._canRunReplace()}"
          @click="${this._applyReplace}"
        >
          <simple-icon-lite
            icon="${HaxUiAdminIcons.findReplace}"
            aria-hidden="true"
          ></simple-icon-lite>
          ${this.t.replace}
        </button>
      </div>
    </div>`;
  }

  /** outside the shell the section draws its own action bar */
  _renderLocalBar() {
    const count = this._checkedIds.length;
    return html`<div class="local-bar">
      <span class="local-status" role="status" aria-live="polite"
        >${this._busyText || this._fill(this.t.manyPages, { count })}</span
      >
      ${this.selectionActions.map(
        (action) =>
          html`<button
            type="button"
            class="hax-ui-btn local-action ${action.danger ? "danger" : ""}"
            data-action="${action.id}"
            ?disabled="${!count || action.disabled}"
            @click="${() => this.runAction(action.id)}"
          >
            ${action.label}
          </button>`,
      )}
    </div>`;
  }

  /** what shows when the table has no rows: loading, error or empty */
  _renderEmpty() {
    if (this._searchError === "search") {
      return html`<div class="hax-ui-empty empty error" role="alert">
        <simple-icon-lite icon="${HaxUiAdminIcons.error}" aria-hidden="true">
        </simple-icon-lite>
        <span class="lead">${this.t.searchFailed}</span>
        <span class="hint">${this.t.searchFailedHint}</span>
        <button
          type="button"
          class="hax-ui-btn retry"
          @click="${this._retrySearch}"
        >
          <simple-icon-lite
            icon="${HaxUiAdminIcons.refresh}"
            aria-hidden="true"
          ></simple-icon-lite>
          ${this.t.tryAgain}
        </button>
      </div>`;
    }
    if (this.searchLoading) {
      return html`<div class="hax-ui-empty empty loading">
        <span class="loading-dot" aria-hidden="true"></span>
        <span class="lead">${this.t.searchingPages}</span>
      </div>`;
    }
    if (this.rows.length === 0) {
      return html`<div class="hax-ui-empty empty">
        <simple-icon-lite
          icon="${HaxUiAdminIcons.page}"
          aria-hidden="true"
        ></simple-icon-lite>
        <span class="lead">${this.t.noPagesYet}</span>
        <span class="hint">${this.t.noPagesYetHint}</span>
      </div>`;
    }
    const query = this.filterValue ? this.filterValue.trim() : "";
    return html`<div class="hax-ui-empty empty">
      <simple-icon-lite icon="${HaxUiAdminIcons.search}" aria-hidden="true">
      </simple-icon-lite>
      <span class="lead"
        >${
          query && this.filterField !== "visibility"
            ? this._fill(this.t.nothingMatchesQuery, { query })
            : this.t.nothingMatchesFilter
        }</span
      >
      <span class="hint"
        >${
          this.filterField === "search"
            ? this.t.emptySearchHint
            : this.t.emptyFilterHint
        }</span
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
        ${
          this.inShell
            ? nothing
            : html`<div class="local-add">
                <haxcms-admin-add-area
                  accept="${this.addArea.accept}"
                  label="${this.addArea.label}"
                  browse-label="${this.addArea.browseLabel}"
                  hint="${this.addArea.hint}"
                  message="${this.addArea.message}"
                  tone="${this.addArea.tone}"
                  ?disabled="${this.addArea.disabled}"
                  ?busy="${this.addArea.busy}"
                  @admin-add-files="${(e) => this.addFiles(e.detail)}"
                ></haxcms-admin-add-area>
              </div>`
        }
        <div
          class="filters"
          role="group"
          aria-label="${this.t.showOnlyItemsWhere}"
        >
          ${
            this.inShell
              ? nothing
              : html`<h3 class="filters-title">
                  ${this.t.showOnlyItemsWhere}
                </h3>`
          }
          <div class="controls">
            ${
              this.filterField === "visibility"
                ? nothing
                : html`<label class="field hax-ui-tool-field grow query">
                    <simple-icon-lite
                      icon="${HaxUiAdminIcons.search}"
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
                  </label>`
            }
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
            ${
              this.filterField === "visibility"
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
                : nothing
            }
            ${
              isSearch
                ? html`${this._renderSelect(
                      "search-mode",
                      this.t.searchType,
                      this.searchMode,
                      [
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
                      aria-checked="${
                        this.searchCaseSensitive ? "true" : "false"
                      }"
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
                : nothing
            }
          </div>
          ${
            this._searchError === "replace"
              ? html`<div class="note error" role="alert">
                  <simple-icon-lite
                    icon="${HaxUiAdminIcons.error}"
                    aria-hidden="true"
                  ></simple-icon-lite>
                  <span class="grow">${this.t.replaceFailed}</span>
                </div>`
              : nothing
          }
        </div>
        ${
          this._refused.length
            ? html`<div class="hax-ui-callout refused" data-tone="warning">
                <simple-icon-lite
                  icon="${HaxUiAdminIcons.warning}"
                  aria-hidden="true"
                ></simple-icon-lite>
                <span class="refused-text"
                  >${this.t.filesGoInFiles}
                  ${this._fill(this.t.turnedAway, {
                    list: this._refused.join(", "),
                  })}</span
                >
                <button
                  type="button"
                  class="hax-ui-btn open-files"
                  @click="${this._goToFiles}"
                >
                  ${this.t.openFiles}
                </button>
                <button
                  type="button"
                  class="hax-ui-icon-btn dismiss-refused"
                  aria-label="${this.t.dismiss}"
                  @click="${() => {
                    this._refused = [];
                  }}"
                >
                  <simple-icon-lite
                    icon="${HaxUiAdminIcons.close}"
                    aria-hidden="true"
                  ></simple-icon-lite>
                </button>
              </div>`
            : nothing
        }
        <div class="summary">
          <p class="meta" role="status" aria-live="polite">
            ${this._summaryText()}
          </p>
          ${this._renderPaging()}
        </div>
        <div class="split">
          <div
            class="table-scroll"
            aria-busy="${
              this.searchLoading || this._busyText ? "true" : "false"
            }"
          >
            ${
              rows.length === 0 || this._searchError === "search"
                ? this._renderEmpty()
                : this._renderTable()
            }
            ${this._choice ? this._renderChoice() : nothing}
          </div>
          ${
            this.compact || this.rows.length === 0
              ? nothing
              : this._renderDetail()
          }
        </div>
        ${this.inShell ? nothing : this._renderLocalBar()}
        ${renderAdminRowMenu(this.t.pageActions, this._rowMenuItems())}
      </div>
    `;
  }
}

globalThis.customElements.define(
  HAXCMSContentAdminDialog.tag,
  HAXCMSContentAdminDialog,
);

export { HAXCMSContentAdminDialog };

import { html, css, nothing } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { store } from "./haxcms-site-store.js";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";
import {
  extractViewsRecords,
  loadHAXCMSViewsSpec,
} from "./utils/haxcms-views-spec-utility.js";
import {
  renderPreview,
  RENDERER_OPTIONS,
} from "./utils/haxcms-views-render-utility.js";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { waitForHAXCMSSiteApiRegistryReady } from "./utils/haxcms-site-api-registry.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import {
  HaxUiAdminTokens,
  HaxUiAdminPrimitives,
} from "@haxtheweb/hax-body/lib/hax-ui-styles.js";
import "@haxtheweb/editable-table/lib/editable-table-display.js";
import "@haxtheweb/collection-list/collection-list.js";
import "@haxtheweb/collection-list/lib/collection-item.js";
import "@haxtheweb/play-list/play-list.js";
import "@haxtheweb/video-player/video-player.js";
import "@haxtheweb/accent-card/accent-card.js";
import "@haxtheweb/a11y-collapse/lib/a11y-collapse-group.js";
import "@haxtheweb/a11y-collapse/a11y-collapse.js";
import "@haxtheweb/a11y-tabs/a11y-tabs.js";
import "@haxtheweb/a11y-tabs/lib/a11y-tab.js";
import "@haxtheweb/lrndesign-timeline/lrndesign-timeline.js";
import "@haxtheweb/lrndesign-chart/lib/lrndesign-bar.js";
import "@haxtheweb/map-menu/map-menu.js";
import "@haxtheweb/image-gallery/image-gallery.js";
import "@haxtheweb/media-playlist/media-playlist.js";
import "@haxtheweb/simple-pager/simple-pager.js";
import { trimTrailingSlashes } from "@haxtheweb/utils/lib/safe-html.js";

/** builder groups, in order; each is a [data-group] the admin rail can open */
const VIEWS_GROUPS = ["source", "show", "filter", "sort"];

/**
 * `haxcms-views-admin-dialog`
 * The Views admin section: build a query against the site API, preview it
 * with a renderer, then embed it in a page or create a page from it.
 * Footer "none" in the one admin dialog (haxcms-site-admin): it saves no
 * settings. With `inShell`, "Embed in page" and "Create as new page" move
 * to the shell header as header actions (`runHeaderAction`); standalone
 * they stay in the query panel.
 *
 * Layout: a builder pane (Source, Show, Filter and Sort groups, each a
 * collapsible `details[data-group]`, then the generated query) and a
 * preview pane (record count, display style, the rendered preview). The
 * panes stack, builder first, when narrow.
 */
class HAXCMSViewsAdminDialog extends I18NMixin(DDD) {
  static get tag() {
    return "haxcms-views-admin-dialog";
  }

  static get properties() {
    return {
      specLoading: { type: Boolean, attribute: "spec-loading" },
      previewLoading: { type: Boolean, attribute: "preview-loading" },
      errorMessage: { type: String, attribute: "error-message" },
      previewErrorMessage: { type: String, attribute: "preview-error-message" },
      entityOptions: { type: Array, attribute: false },
      selectedEntity: { type: String, attribute: "selected-entity" },
      renderer: { type: String },
      queryFields: { type: Array, attribute: false },
      queryValues: { type: Object, attribute: false },
      selectedFields: { type: Array, attribute: false },
      selectedIncludes: { type: Array, attribute: false },
      sortField: { type: String, attribute: "sort-field" },
      sortDescending: { type: Boolean, attribute: "sort-descending" },
      queryUrl: { type: String, attribute: "query-url" },
      queryString: { type: String, attribute: "query-string" },
      previewRecords: { type: Array, attribute: false },
      previewCount: { type: Number, attribute: "preview-count" },
      previewTotal: { type: Number, attribute: "preview-total" },
      specData: { type: Object, attribute: false },
      pageLimit: { type: Number, attribute: "page-limit" },
      pageOffset: { type: Number, attribute: "page-offset" },
      /** set by haxcms-site-admin: page-level actions go in its header */
      inShell: { type: Boolean, attribute: "in-shell", reflect: true },
      /** which builder groups are open, by group key */
      _openGroups: { state: true },
    };
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      noEntitiesFound: "No entities were found in /x/api/v1/entities.",
      unableToLoadViewsMetadata:
        "Unable to load Views metadata from the site API specification.",
      any: "Any",
      noListOperation: "No list operation is defined for this entity.",
      unableToLoadPreview:
        "Unable to load preview results from the generated query.",
      filterableFields: "Filterable: {fields}",
      selectableFields: "Selectable fields: {fields}",
      loadingPreview: "Loading preview…",
      noResultsYet: "No results yet for the current query configuration.",
      copiedToClipboard: "Copied to clipboard",
      typePageTitle: "Type page title to create page",
      default: "Default",
      loadingMetadata: "Loading entity and OpenAPI metadata…",
      dataSource: "Data source",
      entityType: "Entity type",
      displayAs: "Display as",
      fieldSelection: "Field selection",
      fieldsToPresent: "Fields to present",
      includeRelatedResources: "Include related resources",
      sortField: "Sort field",
      sortDescending: "Sort descending",
      filtersQueryParameters: "Filters / query parameters",
      noAdditionalQueryParameters:
        "No additional query parameters are available for this entity endpoint.",
      queryDataFeed: "Query / data feed",
      methodGet: "Method: GET",
      copyUrl: "Copy URL",
      refreshPreview: "Refresh preview",
      embedInPage: "Embed in page",
      copyPathToClipboard: "Copy path to clipboard",
      createAsNewPage: "Create as new page",
      preview: "Preview",
      loading: "Loading…",
      recordsShown: "{count} record(s) shown",
      recordsShownOfTotal: "{count} record(s) shown of {total}",
      previewPagination: "Preview pagination",
      rendererCollection: "Collection",
      rendererTable: "Table",
      rendererGrid: "Grid",
      rendererCarousel: "Carousel",
      rendererImageGallery: "Image Gallery",
      rendererMediaPlaylist: "Media Playlist",
      rendererList: "List",
      rendererContent: "Content",
      rendererAccordion: "Accordion",
      rendererTabs: "Tabs",
      rendererTimeline: "Timeline",
      rendererChart: "Chart",
      rendererTree: "Tree",
      viewsRecordNoTitle: "No results",
      viewsRecordHeading: "Record",
      viewsTitleImage: "{title} image",
      viewsTitlePreview: "{title} preview",
      viewsNoTimelineRecords:
        "No date-oriented records available for timeline rendering.",
      viewsTimelineTitle: "{title} timeline",
      viewsNoChartField: "No numeric field detected for chart rendering.",
      viewsChartingValue: "Charting {value}",
      viewsChartingValueByLabel: "Charting {value} by {label}",
      viewsChartTitle: "{title} chart",
      viewsNoTreeRecords:
        "No hierarchical records available for tree rendering.",
      viewsNoGalleryRecords:
        "No image records available for gallery rendering.",
      viewsNoPlaylistRecords:
        "No media records available for playlist rendering.",
      viewsOpenRecord: "Open record",
      // builder groups and controls
      viewsBuilder: "Query builder",
      groupSource: "Source",
      groupShow: "Show",
      groupFilter: "Filter",
      groupSort: "Sort",
      sourceHelp: "What the view lists",
      fieldsHelp: "Fields each record shows",
      relatedHelp: "Related records to include",
      fieldsCount: "{count} of {total}",
      activeFilters: "{count} active",
      sortBy: "Sort by",
      sortByHelp: "Order of the records",
      sortDirection: "Direction",
      sortDirectionHelp: "Pick a sort field first",
      ascending: "Ascending",
      descending: "Descending",
      query: "Query",
      queryHelp: "The view's path, as embedded in a page",
      copyPath: "Copy path",
      noResultsTitle: "Nothing to show",
      noResultsHint: "Try removing a filter or showing more fields.",
      previewFailed: "Preview failed",
      tryAgain: "Try again",
      cannotLoadViews: "Views could not load",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../locales/", import.meta.url).href,
    });
    this.specLoading = false;
    this.previewLoading = false;
    this.errorMessage = "";
    this.previewErrorMessage = "";
    this.entityOptions = [];
    this.selectedEntity = "";
    this.renderer = "collection";
    this.queryFields = [];
    this.queryValues = {};
    this.selectedFields = [];
    this.selectedIncludes = [];
    this.sortField = "";
    this.sortDescending = false;
    this.queryUrl = "";
    this.queryString = "";
    this.previewRecords = [];
    this.previewCount = 0;
    this.previewTotal = 0;
    this.specData = null;
    this.pageLimit = 25;
    this.pageOffset = 0;
    this._openGroups = {};
    VIEWS_GROUPS.forEach((key) => {
      this._openGroups[key] = true;
    });
    this.__previewDebounce = null;
    this.__previewRequestId = 0;
    this.__previewAbortController = null;
    this.__queryValueChangeLock = false;
    this.__closeModalOnCreateNode = null;
    this.inShell = false;
    this.__stateSignature = "";
  }

  connectedCallback() {
    super.connectedCallback();
    this._loadSpecData();
  }

  disconnectedCallback() {
    if (this.__previewDebounce) {
      clearTimeout(this.__previewDebounce);
      this.__previewDebounce = null;
    }
    this._abortPreviewRequest();
    if (this.__closeModalOnCreateNode) {
      globalThis.removeEventListener(
        "haxcms-create-node",
        this.__closeModalOnCreateNode,
      );
      this.__closeModalOnCreateNode = null;
    }
    super.disconnectedCallback();
  }

  static get styles() {
    return [
      ...super.styles,
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
          --views-builder-width: 380px;
          --views-control-height: var(--ddd-textfield-height-sm, 40px);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          min-height: min(60vh, var(--haxcms-admin-panel-height));
          height: var(--haxcms-admin-panel-height);
          max-height: var(--haxcms-admin-panel-height);
          overflow: hidden;
          container: views / inline-size;
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          line-height: 1.4;
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
        }
        /* in the one admin dialog the shell body sets the height */
        :host([in-shell]) {
          height: 100%;
          min-height: 360px;
          max-height: none;
        }
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }
        .workspace {
          flex: 1;
          min-height: 0;
          display: grid;
          grid-template-columns: var(--views-builder-width) minmax(0, 1fr);
        }

        /* builder pane */
        .builder {
          min-height: 0;
          min-width: 0;
          display: flex;
          flex-direction: column;
          border-right: 1px solid var(--hax-ui-line);
        }
        .groups {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          padding: var(--hax-ui-gap-md) var(--ddd-spacing-4, 16px)
            var(--ddd-spacing-4, 16px);
        }
        /* admin fieldset, not DDD content-scale details: no +/- marker,
           no tinted bar, 32px summary rows */
        details.grp {
          margin: 0;
          padding: 0;
          max-width: none;
          overflow: visible;
          border: 0;
          border-bottom: 1px solid var(--hax-ui-line);
          background-color: transparent;
        }
        details.grp:last-of-type {
          border-bottom: 0;
        }
        details.grp > summary::after,
        details.grp[open] > summary::after {
          content: none;
        }
        details.grp > summary,
        details.grp[open] > summary {
          list-style: none;
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          height: var(--hax-ui-row-height);
          min-height: 0;
          margin: var(--hax-ui-gap-md) calc(-1 * var(--hax-ui-gap-md));
          padding: 0 var(--hax-ui-gap-md);
          border-radius: var(--hax-ui-radius);
          cursor: pointer;
          user-select: none;
          font-size: var(--hax-ui-admin-font-size);
          font-weight: var(--ddd-font-weight-bold, 700);
          line-height: 1.35;
          text-wrap: nowrap;
          color: inherit;
          background-color: transparent;
          filter: none;
          transition: none;
        }
        details.grp > summary::-webkit-details-marker {
          display: none;
        }
        details.grp > summary:hover {
          background-color: var(--hax-ui-hover);
        }
        details.grp > summary:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: -2px;
        }
        summary h3 {
          flex: 1;
          margin: 0;
          font-size: var(--hax-ui-admin-font-size);
          font-weight: inherit;
        }
        summary .chev {
          --simple-icon-width: var(--hax-ui-icon);
          --simple-icon-height: var(--hax-ui-icon);
          --simple-icon-color: currentColor;
          transition: transform var(--hax-ui-duration) var(--hax-ui-easing);
        }
        details[open] > summary .chev {
          transform: rotate(90deg);
        }
        .grp-body {
          padding-bottom: var(--hax-ui-gap-lg);
        }

        /* field rows: bold label and one line of help, control beside */
        .fr {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 200px);
          gap: var(--hax-ui-gap-lg);
          align-items: center;
          padding: var(--hax-ui-gap-md) 0;
        }
        .fr.stack {
          grid-template-columns: minmax(0, 1fr);
          gap: var(--hax-ui-gap-md);
        }
        .fr + .fr {
          border-top: 1px solid var(--hax-ui-line);
        }
        .lab {
          display: block;
          font-weight: var(--ddd-font-weight-bold, 700);
          line-height: 1.3;
        }
        .help {
          display: -webkit-box;
          font-weight: var(--ddd-font-weight-regular, 400);
          margin-top: 2px;
          overflow: hidden;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          font-size: var(--hax-ui-admin-font-size-xs);
          line-height: 1.35;
          color: var(--hax-ui-text-muted);
        }
        select,
        input[type="text"],
        input[type="number"] {
          width: 100%;
          min-width: 0;
          height: var(--views-control-height);
          margin: 0;
          padding: 0 var(--hax-ui-gap-lg);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          font-family: var(--ddd-font-primary, sans-serif);
          font-size: var(--hax-ui-admin-font-size);
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
          color-scheme: inherit;
        }
        select {
          padding-right: var(--hax-ui-gap-md);
          cursor: pointer;
        }
        select:hover,
        input:hover {
          border-color: var(--hax-ui-text-muted);
        }
        select:focus-visible,
        input:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 1px;
        }
        select:disabled {
          cursor: not-allowed;
          opacity: 0.55;
        }

        /* Show: a compact checklist */
        .checks {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0 var(--hax-ui-gap-md);
          margin: 0 calc(-1 * var(--hax-ui-gap-md));
          padding: 0;
          border: 0;
        }
        .checks legend {
          grid-column: 1 / -1;
          float: left;
          width: 100%;
          padding: var(--hax-ui-gap) var(--hax-ui-gap-md);
        }
        .checks + .checks {
          margin-top: var(--hax-ui-gap-md);
        }
        .ck {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          min-width: 0;
          height: var(--hax-ui-row-height);
          padding: 0 var(--hax-ui-gap-md);
          border-radius: var(--hax-ui-radius);
          cursor: pointer;
        }
        .ck:hover {
          background-color: var(--hax-ui-hover);
        }
        .ck span {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .ck input {
          flex: none;
          width: var(--hax-ui-icon);
          height: var(--hax-ui-icon);
          margin: 0;
          accent-color: var(--hax-ui-accent-strong);
          cursor: pointer;
        }
        .ck input:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }

        /* segmented control */
        .seg {
          display: inline-flex;
          width: 100%;
          height: var(--hax-ui-row-height);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          overflow: hidden;
        }
        .seg button {
          all: unset;
          flex: 1;
          min-width: 0;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--hax-ui-gap);
          padding: 0 var(--hax-ui-gap);
          font-family: inherit;
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
        .seg button:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: -2px;
        }
        .seg button:disabled {
          cursor: not-allowed;
          opacity: 0.55;
        }
        .seg simple-icon-lite {
          --simple-icon-width: 14px;
          --simple-icon-height: 14px;
          --simple-icon-color: currentColor;
        }

        /* the generated query, pinned under the groups */
        .query {
          flex: none;
          display: flex;
          flex-direction: column;
          gap: var(--hax-ui-gap-md);
          padding: var(--hax-ui-gap-lg) var(--ddd-spacing-4, 16px);
          border-top: 1px solid var(--hax-ui-line);
          background-color: var(--hax-ui-surface);
        }
        .query-head {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
        }
        .query-head .lab {
          flex: 1;
        }
        .query-row {
          display: flex;
          align-items: flex-start;
          gap: var(--hax-ui-gap-md);
        }
        .query-path {
          flex: 1;
          min-width: 0;
          max-height: calc(4 * 1.5em);
          overflow: auto;
          margin: 0;
          padding: var(--hax-ui-gap) 0;
          border: 0;
          border-radius: 0;
          box-shadow: none;
          font-family: var(--ddd-font-mono, monospace);
          font-size: var(--hax-ui-admin-font-size-xs);
          line-height: 1.5;
          letter-spacing: normal;
          white-space: pre-wrap;
          word-break: break-all;
          color: var(--hax-ui-text-muted);
          background: transparent;
        }
        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: var(--hax-ui-gap-md);
        }
        .btn {
          all: unset;
          box-sizing: border-box;
          flex: none;
          display: inline-flex;
          align-items: center;
          gap: var(--hax-ui-gap);
          height: var(--hax-ui-row-height);
          padding: 0 var(--hax-ui-gap-lg);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          font-family: inherit;
          font-size: 13px;
          font-weight: var(--ddd-font-weight-medium, 500);
          white-space: nowrap;
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
          cursor: pointer;
        }
        .btn.sm {
          height: var(--hax-ui-row-height-compact);
          padding: 0 var(--hax-ui-gap-md);
          font-size: var(--hax-ui-admin-font-size-xs);
        }
        .btn:hover {
          background-color: var(--hax-ui-hover);
        }
        .btn:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        .btn simple-icon-lite {
          --simple-icon-width: var(--hax-ui-icon);
          --simple-icon-height: var(--hax-ui-icon);
          --simple-icon-color: currentColor;
        }
        .btn.sm simple-icon-lite {
          --simple-icon-width: 14px;
          --simple-icon-height: 14px;
        }
        .icon-btn {
          --simple-icon-width: var(--hax-ui-icon);
          --simple-icon-height: var(--hax-ui-icon);
          --simple-icon-button-border-radius: var(--hax-ui-radius);
          --simple-icon-button-focus-color: var(--hax-ui-focus);
          flex: none;
          color: var(--hax-ui-text-muted);
        }
        .icon-btn:hover {
          color: var(--hax-ui-text);
        }

        /* preview pane */
        .preview {
          min-height: 0;
          min-width: 0;
          display: flex;
          flex-direction: column;
          background-color: var(--hax-ui-hover);
        }
        .pv-head {
          flex: none;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
          min-height: calc(var(--hax-ui-row-height) + var(--hax-ui-gap-lg));
          padding: var(--hax-ui-gap-md) var(--ddd-spacing-4, 16px);
          border-bottom: 1px solid var(--hax-ui-line);
          background-color: var(--hax-ui-surface);
        }
        .pv-head h3 {
          margin: 0;
          font-size: var(--hax-ui-admin-font-size);
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .pv-tools {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          margin-left: auto;
        }
        .pv-tools label {
          font-size: 13px;
          color: var(--hax-ui-text-muted);
          white-space: nowrap;
        }
        .pv-tools select {
          width: auto;
          min-width: 148px;
          height: var(--hax-ui-row-height);
        }
        .pv-stage {
          flex: 1;
          min-height: 0;
          overflow: auto;
          padding: var(--ddd-spacing-4, 16px);
        }
        .pv-surface {
          max-width: 960px;
          margin: 0 auto;
          padding: var(--ddd-spacing-4, 16px);
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius-lg);
          background-color: var(--hax-ui-surface);
        }
        .pv-surface simple-pager {
          display: block;
          margin-top: var(--hax-ui-gap-lg);
        }

        /* loading, error and empty states */
        .state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--hax-ui-gap-md);
          min-height: 200px;
          margin: 0;
          padding: var(--ddd-spacing-6, 24px);
          border: 1px dashed var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius-lg);
          text-align: center;
          color: var(--hax-ui-text-muted);
        }
        .state b {
          font-size: 15px;
          color: var(--hax-ui-text);
        }
        .state p {
          margin: 0;
          max-width: 36ch;
        }
        .state simple-icon-lite {
          --simple-icon-width: 24px;
          --simple-icon-height: 24px;
          --simple-icon-color: currentColor;
        }
        .state.error {
          border-style: solid;
          border-color: transparent;
          background-color: var(--hax-ui-danger-soft);
        }
        .state.error b,
        .state.error simple-icon-lite {
          color: var(--hax-ui-danger);
        }
        .state.whole {
          flex: none;
          min-height: 240px;
          margin: var(--ddd-spacing-4, 16px);
        }
        .pv-surface > .state {
          border-color: transparent;
        }
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid var(--hax-ui-line);
          border-top-color: var(--hax-ui-accent-strong);
          border-radius: 50%;
          animation: views-spin 800ms linear infinite;
        }
        @keyframes views-spin {
          to {
            transform: rotate(360deg);
          }
        }
        .none {
          margin: 0;
          padding: var(--hax-ui-gap-md) 0;
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }

        /* renderer output inside the preview surface */
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
        .table-scroll table {
          min-width: 600px;
          width: 100%;
          border-collapse: collapse;
        }
        .table-scroll th,
        .table-scroll td {
          text-align: left;
          vertical-align: top;
          padding: var(--ddd-spacing-2);
          border-bottom: 1px solid var(--hax-ui-line);
          font-size: var(--ddd-font-size-5xs);
        }
        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: var(--ddd-spacing-3);
        }
        .card-grid accent-card {
          width: 100%;
        }
        .card-link {
          font-size: var(--ddd-font-size-4xs);
        }
        .record-html {
          font-size: var(--ddd-font-size-5xs);
          line-height: var(--ddd-lh-150);
          overflow-wrap: anywhere;
        }
        .record-image {
          display: block;
          width: 100%;
          max-height: 220px;
          object-fit: cover;
          border-radius: var(--ddd-radius-sm);
          margin-bottom: var(--ddd-spacing-2);
          border: 1px solid var(--hax-ui-line);
        }
        .record-media {
          display: block;
          width: 100%;
          margin-bottom: var(--ddd-spacing-2);
        }
        .record-media video-player {
          display: block;
          width: 100%;
        }
        .record-element-preview {
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-2);
          margin-bottom: var(--ddd-spacing-2);
          overflow: auto;
        }
        .record-element-preview > * {
          max-width: 100%;
        }
        .result-list {
          margin: 0;
          padding-left: var(--ddd-spacing-4);
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-3);
        }
        .result-list-item {
          margin: 0;
          font-size: var(--ddd-font-size-5xs);
        }
        .result-title {
          margin: 0 0 var(--ddd-spacing-1) 0;
          font-size: var(--ddd-font-size-4xs);
        }
        .content-records {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-4);
        }
        .content-record {
          border-bottom: 1px solid var(--hax-ui-line);
          padding-bottom: var(--ddd-spacing-3);
        }
        .content-record:last-child {
          border-bottom: 0;
          padding-bottom: 0;
        }
        .content-record-title {
          margin: 0 0 var(--ddd-spacing-2) 0;
          font-size: var(--ddd-font-size-s);
        }
        .carousel-shell play-list,
        .playlist-shell play-list {
          display: block;
        }
        .media-gallery {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: var(--ddd-spacing-3);
        }
        .media-gallery-item {
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--ddd-radius-sm);
          overflow: hidden;
          background-color: var(--hax-ui-surface);
        }
        .media-gallery-item img {
          display: block;
          width: 100%;
          height: 180px;
          object-fit: cover;
        }
        .media-gallery-caption {
          display: block;
          padding: var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-5xs);
        }
        .accordion-preview {
          display: block;
        }
        .accordion-preview a11y-collapse {
          --a11y-collapse-margin: 0 0 var(--ddd-spacing-2) 0;
        }
        .tabs-preview a11y-tabs {
          --a11y-tabs-content-padding: var(--ddd-spacing-3);
          --a11y-tabs-button-padding: var(--ddd-spacing-2);
        }
        .timeline-shell lrndesign-timeline {
          display: block;
        }
        .chart-shell lrndesign-bar {
          display: block;
          min-height: 280px;
        }
        .tree-shell {
          min-height: 320px;
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--ddd-radius-sm);
          overflow: hidden;
        }
        .tree-shell map-menu {
          height: 320px;
          --map-menu-gap: var(--ddd-spacing-2);
        }
        @media (prefers-reduced-motion: reduce) {
          summary .chev {
            transition: none;
          }
          .spinner {
            animation-duration: 2400ms;
          }
        }

        /* narrow: the panes stack, builder first, and the page scrolls */
        @container views (max-width: 719px) {
          .workspace {
            grid-template-columns: minmax(0, 1fr);
          }
          .builder {
            border-right: 0;
            border-bottom: 1px solid var(--hax-ui-line);
          }
        }
        @media screen and (max-width: 900px) {
          :host,
          :host([in-shell]) {
            height: auto;
            min-height: 0;
            max-height: none;
            overflow: visible;
          }
          :host(:not([in-shell])) {
            max-height: calc(
              100dvh - var(
                  --simple-modal-titlebar-mobile-height,
                  var(--simple-modal-titlebar-height, 80px)
                ) - var(--ddd-spacing-4, 16px)
            );
            overflow-y: auto;
          }
          .workspace {
            flex: 0 0 auto;
            grid-template-columns: minmax(0, 1fr);
          }
          .builder {
            border-right: 0;
            border-bottom: 1px solid var(--hax-ui-line);
          }
          .groups,
          .pv-stage {
            overflow: visible;
          }
          .pv-stage {
            padding: var(--hax-ui-gap-lg);
          }
          .pv-surface {
            padding: var(--hax-ui-gap-lg);
          }
        }
      `,
    ];
  }

  _cloneData(data) {
    if (typeof data === "undefined") {
      return data;
    }
    if (data === null) {
      return null;
    }
    return JSON.parse(JSON.stringify(data));
  }

  _deepEqual(a, b) {
    if (a === b) {
      return true;
    }
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch {
      return false;
    }
  }

  _safeString(value) {
    if (value === null || typeof value === "undefined") {
      return "";
    }
    return String(value);
  }

  _eventValue(e, fallback = "") {
    if (e && e.detail && typeof e.detail === "object" && "value" in e.detail) {
      return e.detail.value;
    }
    if (
      e &&
      Object.prototype.hasOwnProperty.call(e, "detail") &&
      typeof e.detail !== "undefined" &&
      e.detail !== null &&
      typeof e.detail !== "object"
    ) {
      return e.detail;
    }
    if (e && e.target && typeof e.target === "object" && "value" in e.target) {
      return e.target.value;
    }
    if (e && typeof e.composedPath === "function") {
      const path = e.composedPath();
      for (let i = 0; i < path.length; i++) {
        const node = path[i];
        if (node && typeof node === "object" && "value" in node) {
          return node.value;
        }
      }
    }
    return fallback;
  }

  _normalizeArrayValue(value) {
    if (!Array.isArray(value)) {
      return [];
    }
    return value
      .map((item) => this._safeString(item).trim())
      .filter((item) => item !== "");
  }

  _flattenObject(input = {}, prefix = "", output = {}) {
    const source =
      input && typeof input === "object" && !Array.isArray(input) ? input : {};
    const keys = Object.keys(source);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = source[key];
      const path = prefix ? `${prefix}.${key}` : key;
      if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        Object.keys(value).length > 0
      ) {
        this._flattenObject(value, path, output);
      } else {
        output[path] = value;
      }
    }
    return output;
  }

  _setObjectPath(target = {}, path = "", value = "") {
    const cleanPath = this._safeString(path).trim();
    if (!cleanPath) {
      return target;
    }
    const segments = cleanPath.split(".");
    let pointer = target;
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const isLast = i === segments.length - 1;
      if (isLast) {
        pointer[segment] = value;
      } else {
        if (
          !pointer[segment] ||
          typeof pointer[segment] !== "object" ||
          Array.isArray(pointer[segment])
        ) {
          pointer[segment] = {};
        }
        pointer = pointer[segment];
      }
    }
    return target;
  }

  _selectedEntityConfig() {
    if (
      !this.specData ||
      !this.specData.entityMap ||
      !this.selectedEntity ||
      !Object.prototype.hasOwnProperty.call(
        this.specData.entityMap,
        this.selectedEntity,
      )
    ) {
      return null;
    }
    return this.specData.entityMap[this.selectedEntity];
  }

  _isEntityAllowed(entity) {
    if (!entity || !entity.name) {
      return false;
    }
    const disallowedEntities = {
      user: true,
      site: true,
      region: true,
    };
    const normalizedName = this._safeString(entity.name).toLowerCase();
    return !Object.prototype.hasOwnProperty.call(
      disallowedEntities,
      normalizedName,
    );
  }

  _sortItemsByHierarchy(items) {
    const childrenMap = new Map();
    childrenMap.set(null, []);

    items.forEach((item) => {
      const parent = item.parent || null;
      if (!childrenMap.has(parent)) {
        childrenMap.set(parent, []);
      }
      childrenMap.get(parent).push(item);
    });

    childrenMap.forEach((children) => {
      children.sort((a, b) => (a.order || 0) - (b.order || 0));
    });

    const result = [];
    function traverse(parentId) {
      const children = childrenMap.get(parentId) || [];
      children.forEach((child) => {
        result.push(child);
        traverse(child.id);
      });
    }

    traverse(null);
    return result;
  }

  _manifestPageItems() {
    if (
      !globalThis.HAXCMS ||
      typeof globalThis.HAXCMS.requestAvailability !== "function"
    ) {
      return [];
    }
    const cms = globalThis.HAXCMS.requestAvailability();
    if (
      !cms ||
      !cms.store ||
      typeof cms.store.getManifestItems !== "function"
    ) {
      return [];
    }
    const itemManifest = cms.store.getManifestItems(true);
    if (!Array.isArray(itemManifest)) {
      return [];
    }
    const sortedItems = this._sortItemsByHierarchy(itemManifest);
    const options = [
      {
        value: "",
        text: "-- Any --",
      },
    ];
    sortedItems.forEach((el) => {
      if (!el || !el.id) {
        return;
      }
      let itemBuilder = el;
      let distance = "- ";
      while (itemBuilder && itemBuilder.parent != null) {
        itemBuilder = sortedItems.find((i) => i.id == itemBuilder.parent);
        if (itemBuilder) {
          distance = `--${distance}`;
        }
      }
      options.push({
        value: this._safeString(el.id),
        text: `${distance}${this._safeString(el.title || el.slug || el.id)}`,
      });
    });
    return options;
  }

  _manifestPageOptions() {
    const options = {
      "": "-- Any --",
    };
    const items = this._manifestPageItems();
    items.forEach((item) => {
      if (!item || !item.value) {
        return;
      }
      options[item.value] = item.text;
    });
    return options;
  }

  async _loadSpecData() {
    this.specLoading = true;
    this.errorMessage = "";
    try {
      const specData = await loadHAXCMSViewsSpec();
      this.specData = specData;
      this.entityOptions = (specData.entities || [])
        .filter((entity) => this._isEntityAllowed(entity))
        .map((entity) => ({
          value: entity.name,
          text: entity.title,
        }));
      if (this.entityOptions.length < 1) {
        this.errorMessage = this.t.noEntitiesFound;
        this.previewRecords = [];
        this.specLoading = false;
        return;
      }
      let defaultEntity = this.entityOptions[0].value;
      if (
        specData.entityMap &&
        Object.prototype.hasOwnProperty.call(specData.entityMap, "item")
      ) {
        const itemAllowed = this.entityOptions.find(
          (entity) => entity.value === "item",
        );
        if (itemAllowed) {
          defaultEntity = "item";
        }
      }
      this._applyEntityConfig(defaultEntity);
    } catch {
      this.errorMessage = this.t.unableToLoadViewsMetadata;
      this.previewRecords = [];
    } finally {
      this.specLoading = false;
    }
  }

  _parameterInputMethod(parameter) {
    if (!parameter || !parameter.type) {
      return "textfield";
    }
    if (
      Array.isArray(parameter.enumValues) &&
      parameter.enumValues.length > 0
    ) {
      return "select";
    }
    if (parameter.type === "boolean") {
      return "select";
    }
    if (parameter.type === "integer" || parameter.type === "number") {
      return "number";
    }
    return "textfield";
  }

  _titleFromParameterName(name = "") {
    const label = this._safeString(name)
      .replace(/[._-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return label.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  _queryFieldsForEntity(entityConfig) {
    if (!entityConfig || !Array.isArray(entityConfig.queryParams)) {
      return [];
    }
    const blockedParams = {
      fields: true,
      include: true,
      sort: true,
      format: true,
      "filter.pageType": true,
      "filter.region": true,
      "page.limit": true,
      "page.offset": true,
    };
    return entityConfig.queryParams
      .filter((parameter) => {
        if (!parameter || !parameter.name) {
          return false;
        }
        if (
          Object.prototype.hasOwnProperty.call(blockedParams, parameter.name)
        ) {
          return false;
        }
        return true;
      })
      .map((parameter) => {
        const field = {
          property: parameter.name,
          title: this._titleFromParameterName(parameter.name),
          description: parameter.description || "",
          inputMethod: this._parameterInputMethod(parameter),
          required: parameter.required === true,
        };
        if (
          parameter.name === "filter.parent" ||
          parameter.name === "filter.ancestor"
        ) {
          field.inputMethod = "select";
          field.itemsList = this._manifestPageItems();
          return field;
        }
        if (
          field.inputMethod === "select" &&
          Array.isArray(parameter.enumValues) &&
          parameter.enumValues.length > 0
        ) {
          const options = {};
          parameter.enumValues.forEach((value) => {
            options[value] = value;
          });
          field.options = options;
        }
        if (parameter.type === "boolean") {
          field.options = {
            "": this.t.any,
            true: "true",
            false: "false",
          };
        }
        if (typeof parameter.minimum === "number") {
          field.min = parameter.minimum;
        }
        if (typeof parameter.maximum === "number") {
          field.max = parameter.maximum;
        }
        return field;
      });
  }

  _initialQueryValues(entityConfig) {
    const values = {};
    if (!entityConfig || !Array.isArray(entityConfig.queryParams)) {
      return values;
    }
    const blockedParams = {
      fields: true,
      include: true,
      sort: true,
      format: true,
      "filter.pageType": true,
      "filter.region": true,
      "page.limit": true,
      "page.offset": true,
    };
    entityConfig.queryParams.forEach((parameter) => {
      if (!parameter || !parameter.name) {
        return;
      }
      if (Object.prototype.hasOwnProperty.call(blockedParams, parameter.name)) {
        return;
      }
      if (
        parameter &&
        Object.prototype.hasOwnProperty.call(parameter, "defaultValue") &&
        parameter.defaultValue !== "" &&
        parameter.defaultValue !== null &&
        typeof parameter.defaultValue !== "undefined"
      ) {
        this._setObjectPath(values, parameter.name, parameter.defaultValue);
      }
    });
    return values;
  }

  _applyEntityConfig(entityName = "") {
    if (
      !this.specData ||
      !this.specData.entityMap ||
      !Object.prototype.hasOwnProperty.call(this.specData.entityMap, entityName)
    ) {
      return;
    }
    const entityConfig = this.specData.entityMap[entityName];
    this.__queryValueChangeLock = true;
    this.selectedEntity = entityName;
    this.queryFields = this._queryFieldsForEntity(entityConfig);
    this.queryValues = this._initialQueryValues(entityConfig);
    this.selectedFields = this._normalizeArrayValue(entityConfig.defaultFields);
    this.selectedIncludes = this._syncIncludesFromSelectedFields(
      this.selectedFields,
    );
    this.sortField = "";
    this.sortDescending = false;
    this.previewErrorMessage = "";
    this.previewRecords = [];
    this.previewCount = 0;
    this.previewTotal = 0;
    setTimeout(() => {
      this.__queryValueChangeLock = false;
    }, 0);
    this._schedulePreviewRefresh();
  }

  _syncIncludesFromSelectedFields(selectedFields = []) {
    const entityConfig = this._selectedEntityConfig();
    if (
      !entityConfig ||
      !Array.isArray(entityConfig.includes) ||
      entityConfig.includes.length < 1
    ) {
      return this._normalizeArrayValue(this.selectedIncludes);
    }
    const fields = this._normalizeArrayValue(selectedFields);
    const syncedIncludes = this._normalizeArrayValue(this.selectedIncludes);
    const includeMap = {};
    syncedIncludes.forEach((value) => {
      includeMap[value] = true;
    });
    entityConfig.includes.forEach((includeItem) => {
      const includeName = this._safeString(includeItem).trim();
      if (!includeName) {
        return;
      }
      const includePrefix = `${includeName}.`;
      const includeBracketPrefix = `${includeName}[`;
      for (let i = 0; i < fields.length; i++) {
        const fieldName = fields[i];
        if (
          fieldName === includeName ||
          fieldName.indexOf(includePrefix) === 0 ||
          fieldName.indexOf(includeBracketPrefix) === 0
        ) {
          includeMap[includeName] = true;
          return;
        }
      }
    });
    const normalizedIncludes = [];
    entityConfig.includes.forEach((includeItem) => {
      const includeName = this._safeString(includeItem).trim();
      if (!includeName) {
        return;
      }
      if (includeMap[includeName]) {
        normalizedIncludes.push(includeName);
      }
    });
    Object.keys(includeMap).forEach((includeName) => {
      if (normalizedIncludes.indexOf(includeName) === -1) {
        normalizedIncludes.push(includeName);
      }
    });
    return normalizedIncludes;
  }

  _isEmptyValue(value) {
    if (value === null || typeof value === "undefined") {
      return true;
    }
    if (Array.isArray(value)) {
      return value.length < 1;
    }
    if (typeof value === "string") {
      return value.trim() === "";
    }
    return false;
  }

  _normalizeQueryValue(value) {
    if (Array.isArray(value)) {
      return value
        .map((item) => this._safeString(item).trim())
        .filter((item) => item !== "")
        .join(",");
    }
    if (typeof value === "boolean") {
      return value ? "true" : "false";
    }
    if (typeof value === "number") {
      return String(value);
    }
    if (typeof value === "string") {
      return value.trim();
    }
    return this._safeString(value).trim();
  }

  _buildQueryParams(entityConfig) {
    const params = new URLSearchParams();
    if (!entityConfig) {
      return params;
    }
    const queryParamMap =
      entityConfig.queryParamMap &&
      typeof entityConfig.queryParamMap === "object"
        ? entityConfig.queryParamMap
        : {};
    const flatValues = this._flattenObject(this.queryValues || {});
    const keys = Object.keys(flatValues || {});
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (
        key === "fields" ||
        key === "include" ||
        key === "sort" ||
        key === "format" ||
        key === "page.limit" ||
        key === "page.offset"
      ) {
        continue;
      }
      if (
        Object.keys(queryParamMap).length > 0 &&
        !Object.prototype.hasOwnProperty.call(queryParamMap, key)
      ) {
        continue;
      }
      const normalizedValue = this._normalizeQueryValue(flatValues[key]);
      if (this._isEmptyValue(normalizedValue)) {
        continue;
      }
      params.set(key, normalizedValue);
    }
    if (
      this.selectedFields.length > 0 &&
      Object.prototype.hasOwnProperty.call(queryParamMap, "fields")
    ) {
      params.set("fields", this.selectedFields.join(","));
    }
    if (
      this.selectedIncludes.length > 0 &&
      Object.prototype.hasOwnProperty.call(queryParamMap, "include")
    ) {
      params.set("include", this.selectedIncludes.join(","));
    }
    if (
      this.sortField &&
      Object.prototype.hasOwnProperty.call(queryParamMap, "sort")
    ) {
      params.set(
        "sort",
        this.sortDescending ? `-${this.sortField}` : this.sortField,
      );
    }
    if (Object.prototype.hasOwnProperty.call(queryParamMap, "format")) {
      params.set("format", "json");
    }
    return params;
  }

  _queryParamValues(entityConfig) {
    const params = this._buildQueryParams(entityConfig);
    const values = {};
    if (!params || typeof params.forEach !== "function") {
      return values;
    }
    params.forEach((value, key) => {
      values[key] = value;
    });
    return values;
  }

  _entityOperationName(entityConfig) {
    if (!entityConfig || !entityConfig.listOperationId) {
      return "";
    }
    const operationId = this._safeString(entityConfig.listOperationId).trim();
    if (!operationId) {
      return "";
    }
    return `@site/${operationId}`;
  }

  _entityEndpoint(entityConfig) {
    if (!entityConfig) {
      return "";
    }
    const operationName = this._entityOperationName(entityConfig);
    if (
      operationName &&
      MicroFrontendRegistry &&
      typeof MicroFrontendRegistry.has === "function" &&
      typeof MicroFrontendRegistry.get === "function" &&
      MicroFrontendRegistry.has(operationName)
    ) {
      const operation = MicroFrontendRegistry.get(operationName, true);
      if (operation && operation.endpoint) {
        return this._safeString(operation.endpoint);
      }
    }
    if (entityConfig.listEndpoint) {
      return this._safeString(entityConfig.listEndpoint);
    }
    const apiBasePath =
      this.specData && this.specData.apiBasePath
        ? this.specData.apiBasePath
        : "/x/api";
    return `${apiBasePath}/v1/${entityConfig.name}s`;
  }

  _buildQueryDetails(entityConfig) {
    const operationName = this._entityOperationName(entityConfig);
    const endpoint = this._entityEndpoint(entityConfig);
    const params = this._queryParamValues(entityConfig);
    const queryString = new URLSearchParams(params).toString();
    const queryUrl = queryString ? `${endpoint}?${queryString}` : endpoint;
    return {
      operationName,
      endpoint,
      params,
      queryString,
      queryUrl,
    };
  }
  _normalizePath(path = "/") {
    let normalized = this._safeString(path).trim();
    if (!normalized) {
      return "/";
    }
    if (normalized.charAt(0) !== "/") {
      normalized = `/${normalized}`;
    }
    normalized = normalized.replace(/\/{2,}/g, "/");
    if (normalized.length > 1) {
      normalized = trimTrailingSlashes(normalized);
    }
    if (normalized.charAt(normalized.length - 1) !== "/") {
      normalized = `${normalized}/`;
    }
    return normalized;
  }

  _siteBasePath() {
    let sitePath = "";
    if (
      this.specData &&
      this.specData.apiBasePath &&
      typeof this.specData.apiBasePath === "string"
    ) {
      const apiBasePath = this.specData.apiBasePath;
      const markerIndex = apiBasePath.indexOf("/x/api");
      sitePath = markerIndex > -1 ? apiBasePath.substring(0, markerIndex) : "";
    }
    if (!sitePath && globalThis.document) {
      const baseElement = globalThis.document.querySelector("base");
      if (baseElement) {
        const href = this._safeString(baseElement.getAttribute("href")).trim();
        if (href) {
          try {
            const parsed = new URL(
              href,
              globalThis.location
                ? globalThis.location.origin
                : "http://localhost",
            );
            sitePath = parsed.pathname;
          } catch {
            sitePath = href;
          }
        }
      }
    }
    return this._normalizePath(sitePath || "/");
  }

  _siteBaseHref() {
    const sitePath = this._siteBasePath();
    if (globalThis.location && globalThis.location.origin) {
      return `${globalThis.location.origin}${sitePath}`;
    }
    return sitePath;
  }

  _resolveSiteHref(value = "") {
    const candidate = this._safeString(value).trim();
    if (!candidate) {
      return "";
    }
    if (
      candidate.indexOf("http://") === 0 ||
      candidate.indexOf("https://") === 0
    ) {
      return candidate;
    }
    const siteBaseHref = this._siteBaseHref();
    const siteBasePath = this._siteBasePath();
    let normalizedCandidate = candidate;
    if (normalizedCandidate.charAt(0) === "/") {
      const sitePrefix = siteBasePath.replace(/^\/+/, "");
      const withoutSlash = normalizedCandidate.replace(/^\/+/, "");
      const alreadySiteRelative =
        sitePrefix && withoutSlash.indexOf(sitePrefix) === 0;
      const isApiPath =
        withoutSlash.indexOf("x/api/") === 0 || withoutSlash === "x/api";
      const isInternalXPath = withoutSlash.indexOf("x/") === 0;
      if (!alreadySiteRelative && !isApiPath && !isInternalXPath) {
        normalizedCandidate = withoutSlash;
      }
    }
    try {
      const resolved = new URL(normalizedCandidate, siteBaseHref);
      if (
        globalThis.location &&
        resolved.origin === globalThis.location.origin
      ) {
        return `${resolved.pathname}${resolved.search}${resolved.hash}`;
      }
      return resolved.toString();
    } catch {
      if (normalizedCandidate.charAt(0) !== "/") {
        return `/${normalizedCandidate}`;
      }
      return normalizedCandidate;
    }
  }

  _resolveFetchUrl(url = "") {
    const candidate = this._safeString(url).trim();
    if (!candidate) {
      return "";
    }
    if (
      candidate.indexOf("http://") === 0 ||
      candidate.indexOf("https://") === 0
    ) {
      return candidate;
    }
    try {
      const parsed = new URL(candidate, globalThis.location.origin);
      return parsed.toString();
    } catch {
      return candidate;
    }
  }

  _statusCode(response) {
    if (!response || typeof response !== "object") {
      return 0;
    }
    if (typeof response.status === "number") {
      return response.status;
    }
    if (typeof response.status === "string") {
      const parsed = parseInt(response.status, 10);
      return Number.isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }

  _schedulePreviewRefresh() {
    const entityConfig = this._selectedEntityConfig();
    this.pageOffset = 0;
    const details = this._buildQueryDetails(entityConfig);
    this.queryUrl = details.queryUrl;
    this.queryString = details.queryString;
    if (this.__previewDebounce) {
      clearTimeout(this.__previewDebounce);
      this.__previewDebounce = null;
    }
    this.__previewDebounce = setTimeout(() => {
      this.__previewDebounce = null;
      this._refreshPreview();
    }, 350);
  }

  _abortPreviewRequest() {
    this.__previewRequestId += 1;
    this.__previewAbortController = null;
  }

  async _refreshPreview() {
    const entityConfig = this._selectedEntityConfig();
    if (!entityConfig) {
      this.previewRecords = [];
      this.previewCount = 0;
      this.previewTotal = 0;
      this.previewErrorMessage = "";
      return;
    }
    const queryDetails = this._buildQueryDetails(entityConfig);
    this.queryUrl = queryDetails.queryUrl;
    this.queryString = queryDetails.queryString;
    if (!queryDetails.operationName) {
      this.previewRecords = [];
      this.previewCount = 0;
      this.previewTotal = 0;
      this.previewErrorMessage = this.t.noListOperation;
      return;
    }
    this._abortPreviewRequest();
    this.previewLoading = true;
    this.previewErrorMessage = "";
    const activeRequestId = this.__previewRequestId;
    try {
      await waitForHAXCMSSiteApiRegistryReady();
      if (
        !MicroFrontendRegistry ||
        typeof MicroFrontendRegistry.call !== "function" ||
        typeof MicroFrontendRegistry.has !== "function" ||
        !MicroFrontendRegistry.has(queryDetails.operationName)
      ) {
        throw new Error(
          `Missing registry operation ${queryDetails.operationName}`,
        );
      }
      const previewParams = {
        ...queryDetails.params,
        "page.limit": String(this.pageLimit),
        "page.offset": String(this.pageOffset),
      };
      const payload = await MicroFrontendRegistry.call(
        queryDetails.operationName,
        previewParams,
        null,
        this,
      );
      const status = this._statusCode(payload);
      if (status > 0 && status !== 200) {
        throw new Error(
          `Preview request failed (${status}) for ${queryDetails.operationName}`,
        );
      }
      if (!payload || typeof payload !== "object") {
        throw new Error(
          `Empty preview payload for ${queryDetails.operationName}`,
        );
      }
      if (activeRequestId !== this.__previewRequestId) {
        return;
      }
      const extracted = extractViewsRecords(payload, entityConfig);
      let records = Array.isArray(extracted.records) ? extracted.records : [];
      this.previewRecords = records;
      this.previewCount =
        typeof extracted.count === "number" ? extracted.count : records.length;
      this.previewTotal =
        typeof extracted.total === "number" ? extracted.total : records.length;
    } catch {
      if (activeRequestId !== this.__previewRequestId) {
        return;
      }
      this.previewRecords = [];
      this.previewCount = 0;
      this.previewTotal = 0;
      this.previewErrorMessage = this.t.unableToLoadPreview;
    } finally {
      if (activeRequestId === this.__previewRequestId) {
        this.previewLoading = false;
      }
    }
  }

  _onEntityChanged(e) {
    const value = this._safeString(this._eventValue(e, "")).trim();
    if (!value || value === this.selectedEntity) {
      return;
    }
    this._applyEntityConfig(value);
  }

  _onRendererChanged(e) {
    let value = this._safeString(this._eventValue(e, "collection")).trim();
    if (!value) {
      return;
    }
    if (value === "playlist") {
      value = "carousel";
    }
    if (value === "cards") {
      value = "grid";
    }
    if (value === this.renderer) {
      return;
    }
    this.renderer = value;
    this._schedulePreviewRefresh();
  }

  _onFieldSelectionChanged(e) {
    const value = this._eventValue(e, []);
    const normalized = this._normalizeArrayValue(value);
    if (!this._deepEqual(normalized, this.selectedFields)) {
      this.selectedFields = normalized;
    }
    const syncedIncludes = this._syncIncludesFromSelectedFields(normalized);
    if (!this._deepEqual(syncedIncludes, this.selectedIncludes)) {
      this.selectedIncludes = syncedIncludes;
    }
    this._schedulePreviewRefresh();
  }

  _onIncludeSelectionChanged(e) {
    const value = this._eventValue(e, []);
    const normalized = this._normalizeArrayValue(value);
    if (!this._deepEqual(normalized, this.selectedIncludes)) {
      this.selectedIncludes = normalized;
    }
    this._schedulePreviewRefresh();
  }

  _onSortFieldChanged(e) {
    const nextSortField = this._safeString(this._eventValue(e, "")).trim();
    if (nextSortField === this.sortField) {
      return;
    }
    this.sortField = nextSortField;
    this._schedulePreviewRefresh();
  }

  _onSortDirectionChanged(e) {
    const value = this._eventValue(e, false);
    const nextSortDescending =
      value === true || value === "true" || value === 1 || value === "1";
    if (nextSortDescending === this.sortDescending) {
      return;
    }
    this.sortDescending = nextSortDescending;
    this._schedulePreviewRefresh();
  }

  _onQueryValuesChanged(e) {
    if (this.__queryValueChangeLock) {
      return;
    }
    let incoming = null;
    const filtersForm = this.shadowRoot
      ? this.shadowRoot.querySelector(".filters-form")
      : null;
    if (
      filtersForm &&
      filtersForm.value &&
      typeof filtersForm.value === "object" &&
      !Array.isArray(filtersForm.value)
    ) {
      incoming = this._cloneData(filtersForm.value);
    } else if (
      e &&
      e.detail &&
      e.detail.value &&
      typeof e.detail.value === "object" &&
      !Array.isArray(e.detail.value)
    ) {
      incoming = this._cloneData(e.detail.value);
    } else if (
      e &&
      e.target &&
      e.target.value &&
      typeof e.target.value === "object" &&
      !Array.isArray(e.target.value)
    ) {
      incoming = this._cloneData(e.target.value);
    }
    if (incoming && !this._deepEqual(incoming, this.queryValues)) {
      this.queryValues = incoming;
    }
    this._schedulePreviewRefresh();
  }

  _entityDescription(entityConfig) {
    if (!entityConfig) {
      return "";
    }
    const pieces = [];
    if (entityConfig.description) {
      pieces.push(entityConfig.description);
    }
    if (
      Array.isArray(entityConfig.filterableFields) &&
      entityConfig.filterableFields.length > 0
    ) {
      pieces.push(
        this.t.filterableFields.replace(
          "{fields}",
          () =>
            `${entityConfig.filterableFields.slice(0, 6).join(", ")}${entityConfig.filterableFields.length > 6 ? "…" : ""}`,
        ),
      );
    }
    if (
      Array.isArray(entityConfig.selectableFields) &&
      entityConfig.selectableFields.length > 0
    ) {
      pieces.push(
        this.t.selectableFields.replace(
          "{fields}",
          () =>
            `${entityConfig.selectableFields.slice(0, 8).join(", ")}${entityConfig.selectableFields.length > 8 ? "…" : ""}`,
        ),
      );
    }
    return pieces.join(" ");
  }

  _refreshPreviewTap() {
    this._schedulePreviewRefresh();
  }

  _onPageChanged(e) {
    if (!e || !e.detail) {
      return;
    }
    this.pageLimit = e.detail.limit;
    this.pageOffset = e.detail.offset;
    this._refreshPreview();
  }

  _embedTagMarkup() {
    const src = this.queryString ? `?${this.queryString}` : "";
    return `<site-view src="${src}" renderer="${this.renderer}" entity="${this.selectedEntity}"></site-view>`;
  }

  _copyToClipboard(text = "") {
    /* eslint-disable baseline-js/use-baseline -- writeText works in Chrome, Firefox and Safari; failure is caught */
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        /* eslint-enable baseline-js/use-baseline */
        .then(() => {
          if (store && typeof store.toast === "function") {
            store.toast(this.t.copiedToClipboard, 2000);
          }
        })
        .catch(() => {});
    }
  }

  _copyQueryUrl() {
    this._copyToClipboard(this.queryUrl);
  }

  _copyPath() {
    const path = this.queryString ? `?${this.queryString}` : "";
    this._copyToClipboard(path);
  }

  _embedInPage() {
    store.editMode = true;
    globalThis.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {},
      }),
    );
    setTimeout(() => {
      const haxBody = HAXStore.activeHaxBody;
      if (haxBody) {
        haxBody.haxInsert(
          "site-view",
          "",
          {
            src: this.queryString ? `?${this.queryString}` : "",
            renderer: this.renderer,
            entity: this.selectedEntity,
          },
          null,
        );
      }
    }, 300);
  }

  _createAsNewPage() {
    const markup = this._embedTagMarkup();
    const SuperDaemonInstance =
      globalThis.SuperDaemonManager &&
      globalThis.SuperDaemonManager.requestAvailability();
    if (SuperDaemonInstance) {
      SuperDaemonInstance.waveWand(
        [
          null,
          "CMS",
          { type: "sibling", templateContent: markup },
          "create-page",
          "create-page",
          "",
          this.t.typePageTitle,
        ],
        null,
        null,
      );
    }
    if (this.__closeModalOnCreateNode) {
      globalThis.removeEventListener(
        "haxcms-create-node",
        this.__closeModalOnCreateNode,
      );
    }
    this.__closeModalOnCreateNode = () => {
      globalThis.removeEventListener(
        "haxcms-create-node",
        this.__closeModalOnCreateNode,
      );
      this.__closeModalOnCreateNode = null;
      globalThis.dispatchEvent(
        new CustomEvent("simple-modal-hide", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: {},
        }),
      );
    };
    globalThis.addEventListener(
      "haxcms-create-node",
      this.__closeModalOnCreateNode,
    );
  }

  /**
   * Header actions for the one admin dialog. Both leave the dialog: they
   * are the end of building a view, not a step inside it.
   */
  get headerActions() {
    if (!this.inShell) {
      return [];
    }
    const ready = !!(
      !this.specLoading &&
      !this.errorMessage &&
      this._selectedEntityConfig()
    );
    return [
      {
        id: "embed",
        label: this.t.embedInPage,
        icon: "hax:embed",
        disabled: !ready,
      },
      {
        id: "create-page",
        label: this.t.createAsNewPage,
        icon: "hax:add",
        disabled: !ready,
      },
    ];
  }

  _emitState(force = false) {
    if (!this.inShell) {
      return;
    }
    const headerActions = this.headerActions;
    const signature = JSON.stringify(headerActions);
    if (!force && signature === this.__stateSignature) {
      return;
    }
    this.__stateSignature = signature;
    this.dispatchEvent(
      new CustomEvent("haxcms-admin-section-state", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: { headerActions: headerActions },
      }),
    );
  }

  /**
   * section contract: run a header action
   * @returns {boolean} true when the action ran
   */
  runHeaderAction(id) {
    const action = this.headerActions.find((item) => item.id === id);
    if (!action || action.disabled) {
      return false;
    }
    switch (id) {
      case "embed":
        this._embedInPage();
        return true;
      case "create-page":
        this._createAsNewPage();
        return true;
      default:
        return false;
    }
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (
      changedProperties.has("inShell") ||
      changedProperties.has("specLoading") ||
      changedProperties.has("errorMessage") ||
      changedProperties.has("selectedEntity") ||
      changedProperties.has("specData")
    ) {
      this._emitState();
    }
  }
  _onGroupToggle(key, e) {
    const open = !!(e && e.target && e.target.open);
    if (this._openGroups[key] === open) {
      return;
    }
    this._openGroups = { ...this._openGroups, [key]: open };
  }

  _isGroupOpen(key) {
    return this._openGroups[key] !== false;
  }

  /** same value steps as the simple-fields checkbox list it replaced */
  _toggleListValue(list = [], value = "", checked = false) {
    const current = Array.isArray(list) ? list : [];
    return checked
      ? [...current.filter((item) => item !== value), value]
      : current.filter((item) => item !== value);
  }

  _onFieldToggle(field, checked) {
    this._onFieldSelectionChanged({
      detail: {
        value: this._toggleListValue(this.selectedFields, field, checked),
      },
    });
  }

  _onIncludeToggle(include, checked) {
    this._onIncludeSelectionChanged({
      detail: {
        value: this._toggleListValue(this.selectedIncludes, include, checked),
      },
    });
  }

  _onSortDirection(descending) {
    this._onSortDirectionChanged({ detail: { value: descending } });
  }

  /** one filter control changed: same nested value shape as before */
  _onFilterChanged(property, value) {
    if (this.__queryValueChangeLock) {
      return;
    }
    const next = this._cloneData(this.queryValues || {}) || {};
    this._setObjectPath(next, property, value);
    if (!this._deepEqual(next, this.queryValues)) {
      this.queryValues = next;
    }
    this._schedulePreviewRefresh();
  }

  /** readable form of the path; copying still uses the encoded one */
  _displayPath(path = "") {
    try {
      return decodeURIComponent(path);
    } catch {
      return path;
    }
  }

  _filterLabel(field) {
    const name = this._safeString(field.property).replace(/^filter\./, "");
    return this._titleFromParameterName(name);
  }

  /** page options keep their outline depth as indentation, not dashes */
  _filterSelectOptions(field) {
    if (Array.isArray(field.itemsList)) {
      return field.itemsList.map((item) => {
        if (!item || item.value === "") {
          return { value: "", text: this.t.any };
        }
        const text = this._safeString(item.text);
        const match = text.match(/^(-+)\s/);
        const depth = match ? Math.max(0, (match[1].length - 1) / 2) : 0;
        return {
          value: item.value,
          text: `${"   ".repeat(depth)}${match ? text.substring(match[0].length) : text}`,
        };
      });
    }
    const options = field.options || {};
    return Object.keys(options).map((key) => ({
      value: key,
      text: key === "" ? this.t.any : this._safeString(options[key]),
    }));
  }

  _activeFilterCount() {
    const flat = this._flattenObject(this.queryValues || {});
    return this.queryFields.filter(
      (field) =>
        !this._isEmptyValue(this._normalizeQueryValue(flat[field.property])),
    ).length;
  }

  _renderGroup(key, label, meta, body) {
    return html`<details
      class="grp"
      data-group="${key}"
      ?open="${this._isGroupOpen(key)}"
      @toggle="${(e) => this._onGroupToggle(key, e)}"
    >
      <summary>
        <simple-icon-lite
          class="chev"
          icon="icons:chevron-right"
          aria-hidden="true"
        ></simple-icon-lite>
        <h3>${label}</h3>
        ${meta ? html`<span class="hax-ui-pill">${meta}</span>` : nothing}
      </summary>
      <div class="grp-body">${body}</div>
    </details>`;
  }

  _renderFieldRow(id, label, help, control, stack = false) {
    return html`<div class="fr ${stack ? "stack" : ""}">
      <div>
        <label class="lab" for="${id}" id="${id}-label">${label}</label>
        ${help
          ? html`<span class="help" id="${id}-help" title="${help}"
              >${help}</span
            >`
          : nothing}
      </div>
      ${control}
    </div>`;
  }

  _renderFilterControl(field, id, value) {
    const describedBy = field.description ? `${id}-help` : nothing;
    if (field.inputMethod === "select") {
      return html`<select
        id="${id}"
        data-filter="${field.property}"
        aria-describedby="${describedBy}"
        @change="${(e) =>
          this._onFilterChanged(field.property, e.target.value)}"
      >
        ${this._filterSelectOptions(field).map(
          (option) =>
            html`<option
              value="${option.value}"
              ?selected="${this._safeString(value) ===
              this._safeString(option.value)}"
            >
              ${option.text}
            </option>`,
        )}
      </select>`;
    }
    return html`<input
      id="${id}"
      type="${field.inputMethod === "number" ? "number" : "text"}"
      data-filter="${field.property}"
      inputmode="${field.inputMethod === "number" ? "numeric" : nothing}"
      min="${typeof field.min === "number" ? field.min : nothing}"
      max="${typeof field.max === "number" ? field.max : nothing}"
      .value="${this._safeString(value)}"
      ?required="${field.required}"
      aria-describedby="${describedBy}"
      @input="${(e) => this._onFilterChanged(field.property, e.target.value)}"
    />`;
  }

  _renderChecklist(name, legend, options, selected, onToggle) {
    return html`<fieldset class="checks" data-list="${name}">
      <legend class="lab">
        ${legend.label}<span class="help">${legend.help}</span>
      </legend>
      ${options.map(
        (option) =>
          html`<label class="ck">
            <input
              type="checkbox"
              data-value="${option.value}"
              .checked="${selected.indexOf(option.value) > -1}"
              @change="${(e) => onToggle(option.value, e.target.checked)}"
            /><span>${option.text}</span>
          </label>`,
      )}
    </fieldset>`;
  }

  _renderPreview() {
    if (this.previewLoading) {
      return html`<div class="state" role="status" aria-live="polite">
        <span class="spinner" aria-hidden="true"></span>
        <p>${this.t.loadingPreview}</p>
      </div>`;
    }
    if (this.previewErrorMessage) {
      return html`<div class="state error" role="alert">
        <simple-icon-lite
          icon="icons:error-outline"
          aria-hidden="true"
        ></simple-icon-lite>
        <b>${this.t.previewFailed}</b>
        <p>${this.previewErrorMessage}</p>
        <button
          type="button"
          class="btn"
          data-action="retry-preview"
          @click="${this._refreshPreviewTap}"
        >
          ${this.t.tryAgain}
        </button>
      </div>`;
    }
    if (!Array.isArray(this.previewRecords) || this.previewRecords.length < 1) {
      return html`<div class="state empty-preview" role="status">
        <simple-icon-lite
          icon="icons:search"
          aria-hidden="true"
        ></simple-icon-lite>
        <b>${this.t.noResultsTitle}</b>
        <p>${this.t.noResultsYet} ${this.t.noResultsHint}</p>
      </div>`;
    }
    const renderer =
      this.renderer === "playlist"
        ? "carousel"
        : this.renderer === "cards"
          ? "grid"
          : this.renderer;
    return renderPreview(this.previewRecords, renderer, {
      selectedFields: this.selectedFields,
      selectedEntity: this.selectedEntity,
      resolveHref: this._resolveSiteHref.bind(this),
      t: this.t,
    });
  }

  _previewCountText() {
    if (this.previewLoading) {
      return this.t.loading;
    }
    if (this.previewTotal > this.previewCount) {
      return this.t.recordsShownOfTotal
        .replace("{count}", () => this.previewCount)
        .replace("{total}", () => this.previewTotal);
    }
    return this.t.recordsShown.replace("{count}", () => this.previewCount);
  }

  _renderWholeState() {
    if (this.errorMessage) {
      return html`<div class="state error whole" role="alert">
        <simple-icon-lite
          icon="icons:error-outline"
          aria-hidden="true"
        ></simple-icon-lite>
        <b>${this.t.cannotLoadViews}</b>
        <p>${this.errorMessage}</p>
        <button
          type="button"
          class="btn"
          data-action="retry-spec"
          @click="${this._loadSpecData}"
        >
          ${this.t.tryAgain}
        </button>
      </div>`;
    }
    return html`<div class="state whole" role="status" aria-live="polite">
      <span class="spinner" aria-hidden="true"></span>
      <p>${this.t.loadingMetadata}</p>
    </div>`;
  }

  render() {
    const entityConfig = this._selectedEntityConfig();
    if (this.errorMessage || this.specLoading || !entityConfig) {
      return this._renderWholeState();
    }
    const selectableFieldOptions = Array.isArray(entityConfig.selectableFields)
      ? entityConfig.selectableFields.map((field) => ({
          value: field,
          text: this._titleFromParameterName(field),
        }))
      : [];
    const includeOptions = Array.isArray(entityConfig.includes)
      ? entityConfig.includes.map((field) => ({
          value: field,
          text: this._titleFromParameterName(field),
        }))
      : [];
    const sortFieldOptions = [
      { value: "", text: this.t.default },
      ...(Array.isArray(entityConfig.sortableFields)
        ? entityConfig.sortableFields.map((field) => ({
            value: field,
            text: this._titleFromParameterName(field),
          }))
        : []),
    ];
    const selectedRenderer =
      this.renderer === "playlist"
        ? "carousel"
        : this.renderer === "cards"
          ? "grid"
          : this.renderer;
    const rendererLabels = {
      collection: this.t.rendererCollection,
      table: this.t.rendererTable,
      grid: this.t.rendererGrid,
      carousel: this.t.rendererCarousel,
      "image-gallery": this.t.rendererImageGallery,
      "media-playlist": this.t.rendererMediaPlaylist,
      list: this.t.rendererList,
      content: this.t.rendererContent,
      accordion: this.t.rendererAccordion,
      tabs: this.t.rendererTabs,
      timeline: this.t.rendererTimeline,
      chart: this.t.rendererChart,
      tree: this.t.rendererTree,
    };
    const rendererOptions = RENDERER_OPTIONS.map((option) => ({
      value: option.value,
      text: rendererLabels[option.value] || option.text,
    }));
    const flatValues = this._flattenObject(this.queryValues || {});
    const activeFilters = this._activeFilterCount();
    const sortMeta = this.sortField
      ? `${this._titleFromParameterName(this.sortField)} ${this.sortDescending ? "↓" : "↑"}`
      : this.t.default;
    const path = this.queryString ? `?${this.queryString}` : "";
    return html`
      <div class="workspace">
        <section class="builder" aria-label="${this.t.viewsBuilder}">
          <div class="groups">
            ${this._renderGroup(
              "source",
              this.t.groupSource,
              "",
              this._renderFieldRow(
                "views-entity",
                this.t.dataSource,
                entityConfig.description || this.t.sourceHelp,
                html`<select
                  id="views-entity"
                  data-control="entity"
                  @change="${(e) =>
                    this._onEntityChanged({
                      detail: { value: e.target.value },
                    })}"
                >
                  ${this.entityOptions.map(
                    (option) =>
                      html`<option
                        value="${option.value}"
                        ?selected="${option.value === this.selectedEntity}"
                      >
                        ${option.text}
                      </option>`,
                  )}
                </select>`,
              ),
            )}
            ${this._renderGroup(
              "show",
              this.t.groupShow,
              this.t.fieldsCount
                .replace("{count}", () => this.selectedFields.length)
                .replace("{total}", () => selectableFieldOptions.length),
              html`${this._renderChecklist(
                "fields",
                { label: this.t.fieldsToPresent, help: this.t.fieldsHelp },
                selectableFieldOptions,
                this.selectedFields,
                (value, checked) => this._onFieldToggle(value, checked),
              )}
              ${includeOptions.length > 0
                ? this._renderChecklist(
                    "includes",
                    {
                      label: this.t.includeRelatedResources,
                      help: this.t.relatedHelp,
                    },
                    includeOptions,
                    this.selectedIncludes,
                    (value, checked) => this._onIncludeToggle(value, checked),
                  )
                : nothing}`,
            )}
            ${this._renderGroup(
              "filter",
              this.t.groupFilter,
              activeFilters > 0
                ? this.t.activeFilters.replace("{count}", () => activeFilters)
                : "",
              this.queryFields.length > 0
                ? this.queryFields.map((field) => {
                    const id = `views-filter-${this._safeString(field.property).replace(/[^a-zA-Z0-9_-]/g, "-")}`;
                    return this._renderFieldRow(
                      id,
                      this._filterLabel(field),
                      field.description,
                      this._renderFilterControl(
                        field,
                        id,
                        flatValues[field.property],
                      ),
                    );
                  })
                : html`<p class="none">
                    ${this.t.noAdditionalQueryParameters}
                  </p>`,
            )}
            ${this._renderGroup(
              "sort",
              this.t.groupSort,
              sortMeta,
              html`${this._renderFieldRow(
                "views-sort-field",
                this.t.sortBy,
                this.t.sortByHelp,
                html`<select
                  id="views-sort-field"
                  data-control="sort-field"
                  @change="${(e) =>
                    this._onSortFieldChanged({
                      detail: { value: e.target.value },
                    })}"
                >
                  ${sortFieldOptions.map(
                    (option) =>
                      html`<option
                        value="${option.value}"
                        ?selected="${option.value === this.sortField}"
                      >
                        ${option.text}
                      </option>`,
                  )}
                </select>`,
              )}
              ${this._renderFieldRow(
                "views-sort-direction",
                this.t.sortDirection,
                this.sortField ? "" : this.t.sortDirectionHelp,
                html`<div
                  class="seg"
                  role="group"
                  id="views-sort-direction"
                  aria-labelledby="views-sort-direction-label"
                >
                  ${[
                    {
                      descending: false,
                      text: this.t.ascending,
                      icon: "icons:arrow-upward",
                    },
                    {
                      descending: true,
                      text: this.t.descending,
                      icon: "icons:arrow-downward",
                    },
                  ].map(
                    (item) =>
                      html`<button
                        type="button"
                        data-sort-direction="${item.descending
                          ? "desc"
                          : "asc"}"
                        aria-pressed="${this.sortDescending === item.descending
                          ? "true"
                          : "false"}"
                        ?disabled="${!this.sortField}"
                        @click="${() => this._onSortDirection(item.descending)}"
                      >
                        <simple-icon-lite
                          icon="${item.icon}"
                          aria-hidden="true"
                        ></simple-icon-lite
                        >${item.text}
                      </button>`,
                  )}
                </div>`,
              )}`,
            )}
          </div>
          <div class="query" data-group="query">
            <div class="query-head">
              <span class="lab" id="views-query-label">${this.t.query}</span>
              <span class="hax-ui-pill" title="${this.t.methodGet}">GET</span>
              <simple-icon-button-lite
                class="icon-btn"
                icon="icons:link"
                label="${this.t.copyUrl}"
                title="${this.t.copyUrl}"
                data-action="copy-url"
                @click="${this._copyQueryUrl}"
              ></simple-icon-button-lite>
            </div>
            <div class="query-row">
              <code
                class="query-path"
                aria-labelledby="views-query-label"
                title="${this.queryUrl}"
                >${this._displayPath(path) ||
                this._entityEndpoint(entityConfig)}</code
              >
              <button
                type="button"
                class="btn sm"
                data-action="copy-path"
                aria-label="${this.t.copyPathToClipboard}"
                title="${this.t.copyPathToClipboard}"
                @click="${this._copyPath}"
              >
                <simple-icon-lite
                  icon="icons:content-copy"
                  aria-hidden="true"
                ></simple-icon-lite
                >${this.t.copyPath}
              </button>
            </div>
            ${!this.inShell
              ? html`<div class="actions">
                  <button
                    type="button"
                    class="btn"
                    data-action="embed"
                    @click="${this._embedInPage}"
                  >
                    <simple-icon-lite
                      icon="hax:embed"
                      aria-hidden="true"
                    ></simple-icon-lite
                    >${this.t.embedInPage}
                  </button>
                  <button
                    type="button"
                    class="btn"
                    data-action="create-page"
                    @click="${this._createAsNewPage}"
                  >
                    <simple-icon-lite
                      icon="hax:add"
                      aria-hidden="true"
                    ></simple-icon-lite
                    >${this.t.createAsNewPage}
                  </button>
                </div>`
              : nothing}
          </div>
        </section>
        <section class="preview" aria-labelledby="views-preview-title">
          <div class="pv-head">
            <h3 id="views-preview-title">${this.t.preview}</h3>
            <span
              class="hax-ui-pill"
              data-tone="accent"
              data-count
              aria-live="polite"
              >${this._previewCountText()}</span
            >
            <div class="pv-tools">
              <label for="views-renderer">${this.t.displayAs}</label>
              <select
                id="views-renderer"
                data-control="renderer"
                @change="${(e) =>
                  this._onRendererChanged({
                    detail: { value: e.target.value },
                  })}"
              >
                ${rendererOptions.map(
                  (option) =>
                    html`<option
                      value="${option.value}"
                      ?selected="${option.value === selectedRenderer}"
                    >
                      ${option.text}
                    </option>`,
                )}
              </select>
              <simple-icon-button-lite
                class="icon-btn"
                icon="icons:refresh"
                label="${this.t.refreshPreview}"
                title="${this.t.refreshPreview}"
                data-action="refresh"
                @click="${this._refreshPreviewTap}"
              ></simple-icon-button-lite>
            </div>
          </div>
          <div class="pv-stage">
            <div class="pv-surface">
              ${this._renderPreview()}
              ${this.previewRecords.length > 0 &&
              this.previewTotal > this.previewRecords.length
                ? html`<simple-pager
                    mode="full"
                    limit="${this.pageLimit}"
                    offset="${this.pageOffset}"
                    total="${this.previewTotal}"
                    count="${this.previewRecords.length}"
                    label="${this.t.previewPagination}"
                    @page-changed="${this._onPageChanged}"
                  ></simple-pager>`
                : nothing}
            </div>
          </div>
        </section>
      </div>
    `;
  }
}

globalThis.customElements.define(
  HAXCMSViewsAdminDialog.tag,
  HAXCMSViewsAdminDialog,
);

export { HAXCMSViewsAdminDialog };

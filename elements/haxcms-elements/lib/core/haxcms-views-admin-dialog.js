import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { store } from "./haxcms-site-store.js";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";
import {
  HaxSchematizer,
  HaxElementizer,
} from "@haxtheweb/hax-body-behaviors/lib/HAXFields.js";
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
import "@haxtheweb/simple-fields/simple-fields.js";
import "@haxtheweb/simple-fields/lib/simple-fields-field.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-icon/lib/simple-clipboard-copy-button.js";
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

class HAXCMSViewsAdminDialog extends DDD {
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
      leftPanelWidth: { type: Number, attribute: false },
    };
  }

  constructor() {
    super();
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
    this.leftPanelWidth = 38;
    this.__previewDebounce = null;
    this.__previewRequestId = 0;
    this.__previewAbortController = null;
    this.__queryValueChangeLock = false;
    this.__isResizing = false;
    this.__onResizeMoveBound = this._onResizePointerMove.bind(this);
    this.__onResizeEndBound = this._onResizePointerUp.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this._loadSpecData();
  }

  disconnectedCallback() {
    this._onResizePointerUp();
    if (this.__previewDebounce) {
      clearTimeout(this.__previewDebounce);
      this.__previewDebounce = null;
    }
    this._abortPreviewRequest();
    super.disconnectedCallback();
  }

  static get styles() {
    return [
      ...super.styles,
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
          box-sizing: border-box;
          min-width: 80vw;
          min-height: min(60vh, var(--haxcms-admin-panel-height));
          height: var(--haxcms-admin-panel-height);
          max-height: var(--haxcms-admin-panel-height);
          overflow: hidden;
          padding: var(--ddd-spacing-4);
          gap: var(--ddd-spacing-3);
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          background: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          font-family: var(--ddd-font-navigation);
        }
        .panel-shell {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
          gap: var(--ddd-spacing-3);
        }
        .workspace {
          flex: 1;
          min-height: 0;
          min-width: 0;
          display: grid;
          grid-template-columns:
            minmax(280px, var(--views-left-panel-width, 38%))
            12px minmax(320px, 1fr);
          align-items: stretch;
          gap: 0;
        }
        .left-column {
          min-height: 0;
          min-width: 0;
          overflow-y: auto;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-3);
          padding-right: var(--ddd-spacing-2);
        }
        .right-column {
          min-height: 0;
          min-width: 0;
          display: flex;
          overflow: hidden;
          padding-left: var(--ddd-spacing-2);
        }
        .resize-handle {
          position: relative;
          width: 12px;
          margin: 0 var(--ddd-spacing-1);
          border-radius: var(--ddd-radius-sm);
          cursor: col-resize;
          background: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-primary-7)
          );
          transition: background-color 0.2s ease-in-out;
        }
        .resize-handle::after {
          content: "";
          position: absolute;
          top: 12px;
          bottom: 12px;
          left: 50%;
          width: 2px;
          border-radius: 999px;
          transform: translateX(-50%);
          background: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          opacity: 0.5;
        }
        .resize-handle:hover,
        .resize-handle:focus-visible {
          outline: none;
          background: light-dark(
            var(--ddd-theme-default-futureLime),
            var(--ddd-theme-default-athertonViolet)
          );
        }
        details.group-panel {
          border: var(--ddd-border-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-primary-5)
            );
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          background: light-dark(
            var(--ddd-theme-default-white),
            rgba(0, 0, 0, 0.18)
          );
          width: 100%;
          max-width: none;
          overflow: visible;
        }
        details.group-panel summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--ddd-spacing-2);
          cursor: pointer;
          font-weight: var(--ddd-font-weight-bold);
          font-size: var(--ddd-font-size-4xs);
          line-height: 1.35;
          min-height: var(--ddd-spacing-8);
          padding: var(--ddd-spacing-2) 0;
          margin: 0;
        }
        details.group-panel summary::after,
        details.query-details summary::after {
          margin-left: var(--ddd-spacing-2);
          flex: 0 0 auto;
        }
        details.group-panel > .group-body {
          margin-top: var(--ddd-spacing-1);
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-2);
          overflow: visible;
        }
        .inline-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: var(--ddd-spacing-3);
        }
        .inline-grid.three {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        .note {
          margin: 0;
          font-size: var(--ddd-font-size-4xs);
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        .status,
        .error {
          margin: 0;
          font-size: var(--ddd-font-size-4xs);
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-2);
        }
        .status {
          border: var(--ddd-border-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-primary-5)
            );
          background: light-dark(
            var(--ddd-theme-default-athertonViolet),
            rgba(255, 255, 255, 0.06)
          );
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }
        .error {
          border: var(--ddd-border-xs) solid
            var(--ddd-theme-default-original87Pink);
          color: light-dark(
            var(--ddd-theme-default-original87Pink),
            var(--ddd-theme-default-original87Pink)
          );
          background: light-dark(
            var(--ddd-theme-default-potentialMidnight),
            rgba(255, 255, 255, 0.04)
          );
        }
        simple-fields,
        simple-fields-field {
          --simple-fields-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --simple-fields-background-color: transparent;
          --simple-fields-select-option-background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          --simple-fields-select-option-selected-background-color: light-dark(
            var(--ddd-theme-default-skyBlue),
            var(--ddd-theme-default-potentialMidnight)
          );
          --simple-fields-button-background-color: transparent;
          --simple-icon-width: var(--ddd-icon-xs);
          --simple-icon-height: var(--ddd-icon-xs);
        }
        details.query-details {
          border: var(--ddd-border-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-primary-5)
            );
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          background: light-dark(
            var(--ddd-theme-default-athertonViolet),
            rgba(255, 255, 255, 0.04)
          );
          width: 100%;
          max-width: none;
          overflow: visible;
        }
        details.query-details summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--ddd-spacing-2);
          cursor: pointer;
          font-weight: var(--ddd-font-weight-bold);
          font-size: var(--ddd-font-size-4xs);
          line-height: 1.35;
          min-height: var(--ddd-spacing-8);
          padding: var(--ddd-spacing-2) 0;
          margin: 0;
        }
        .query-copy-row {
          margin-top: var(--ddd-spacing-2);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-2);
        }
        .query-copy-row simple-clipboard-copy-button {
          --simple-icon-button-border-radius: var(--ddd-radius-sm);
          --simple-icon-button-border: var(--ddd-border-xs) solid
            var(--ddd-theme-default-limestoneGray);
          --simple-icon-height: var(--ddd-icon-xxs);
          --simple-icon-width: var(--ddd-icon-xxs);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
        }
        .query-code {
          display: block;
          margin-top: var(--ddd-spacing-2);
          font-family: var(--ddd-font-monospace);
          font-size: var(--ddd-font-size-5xs);
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }
        .preview-shell {
          border: var(--ddd-border-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-primary-5)
            );
          border-radius: var(--ddd-radius-md);
          background: light-dark(
            var(--ddd-theme-default-white),
            rgba(0, 0, 0, 0.2)
          );
          min-height: 220px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
        }
        .preview-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-3);
          border-bottom: var(--ddd-border-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-primary-5)
            );
        }
        .preview-head h3 {
          margin: 0;
          font-size: var(--ddd-font-size-s);
          font-weight: var(--ddd-font-weight-bold);
        }
        .preview-body {
          flex: 1;
          min-height: 0;
          overflow: auto;
          padding: var(--ddd-spacing-3);
        }
        .empty-preview {
          font-size: var(--ddd-font-size-4xs);
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
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
          border-bottom: var(--ddd-border-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-primary-5)
            );
          font-size: var(--ddd-font-size-5xs);
        }
        .card-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
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
          border: var(--ddd-border-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-primary-5)
            );
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
          border: var(--ddd-border-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-primary-5)
            );
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
          border-bottom: var(--ddd-border-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-primary-5)
            );
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
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: var(--ddd-spacing-3);
        }
        .media-gallery-item {
          border: var(--ddd-border-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-primary-5)
            );
          border-radius: var(--ddd-radius-sm);
          overflow: hidden;
          background: light-dark(
            var(--ddd-theme-default-white),
            rgba(255, 255, 255, 0.03)
          );
        }
        .media-gallery-item img {
          display: block;
          width: 100%;
          height: 220px;
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
          border: var(--ddd-border-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-primary-5)
            );
          border-radius: var(--ddd-radius-sm);
          overflow: hidden;
        }
        .tree-shell map-menu {
          height: 320px;
          --map-menu-gap: var(--ddd-spacing-2);
        }
        @media screen and (max-width: 1024px) {
          .workspace {
            grid-template-columns: minmax(0, 1fr);
            gap: var(--ddd-spacing-3);
          }
          .left-column,
          .right-column {
            padding: 0;
          }
          .resize-handle {
            display: none;
          }
          .inline-grid,
          .inline-grid.three {
            grid-template-columns: repeat(1, minmax(0, 1fr));
          }
          .card-grid {
            grid-template-columns: repeat(1, minmax(0, 1fr));
          }
          .media-gallery {
            grid-template-columns: repeat(1, minmax(0, 1fr));
          }
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
            padding: var(--ddd-spacing-3);
          }
          .panel-shell {
            min-height: auto;
          }
          .workspace {
            flex: 0 0 auto;
            min-height: auto;
            overflow: visible;
          }
          .left-column,
          .right-column {
            min-height: auto;
            overflow: visible;
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
    } catch (e) {
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
        this.errorMessage = "No entities were found in /x/api/v1/entities.";
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
    } catch (e) {
      this.errorMessage =
        "Unable to load Views metadata from the site API specification.";
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
            "": "Any",
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
        key === "format"
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
      normalized = normalized.replace(/\/+$/, "");
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
          } catch (e) {
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
    } catch (e) {
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
    } catch (e) {
      return candidate;
    }
  }

  _setLeftPanelWidth(width = 38) {
    const numeric = Number(width);
    if (!Number.isFinite(numeric)) {
      return;
    }
    const clamped = Math.max(24, Math.min(68, numeric));
    if (Math.abs(clamped - this.leftPanelWidth) < 0.2) {
      return;
    }
    this.leftPanelWidth = Number(clamped.toFixed(2));
  }

  _onResizePointerDown(e) {
    if (!e) {
      return;
    }
    if (globalThis.innerWidth && globalThis.innerWidth <= 1024) {
      return;
    }
    e.preventDefault();
    this.__isResizing = true;
    if (globalThis.document && globalThis.document.body) {
      globalThis.document.body.style.cursor = "col-resize";
      globalThis.document.body.style.userSelect = "none";
    }
    globalThis.addEventListener("pointermove", this.__onResizeMoveBound);
    globalThis.addEventListener("pointerup", this.__onResizeEndBound);
  }

  _onResizePointerMove(e) {
    if (!this.__isResizing || !e || !this.shadowRoot) {
      return;
    }
    const workspace = this.shadowRoot.querySelector(".workspace");
    if (!workspace) {
      return;
    }
    const box = workspace.getBoundingClientRect();
    if (!box || !box.width) {
      return;
    }
    const nextWidth = ((e.clientX - box.left) / box.width) * 100;
    this._setLeftPanelWidth(nextWidth);
  }

  _onResizePointerUp() {
    if (!this.__isResizing) {
      return;
    }
    this.__isResizing = false;
    if (globalThis.document && globalThis.document.body) {
      globalThis.document.body.style.cursor = "";
      globalThis.document.body.style.userSelect = "";
    }
    globalThis.removeEventListener("pointermove", this.__onResizeMoveBound);
    globalThis.removeEventListener("pointerup", this.__onResizeEndBound);
  }

  _onResizeKeyDown(e) {
    if (!e) {
      return;
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      this._setLeftPanelWidth(this.leftPanelWidth - 2);
      return;
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      this._setLeftPanelWidth(this.leftPanelWidth + 2);
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
      this.previewErrorMessage =
        "No list operation is defined for this entity.";
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
      const payload = await MicroFrontendRegistry.call(
        queryDetails.operationName,
        queryDetails.params,
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
    } catch (e) {
      if (activeRequestId !== this.__previewRequestId) {
        return;
      }
      this.previewRecords = [];
      this.previewCount = 0;
      this.previewTotal = 0;
      this.previewErrorMessage =
        "Unable to load preview results from the generated query.";
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

  _titleFromParameterName(name = "") {
    const label = this._safeString(name)
      .replace(/[._-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return label.replace(/\b\w/g, (char) => char.toUpperCase());
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
        `Filterable: ${entityConfig.filterableFields.slice(0, 6).join(", ")}${entityConfig.filterableFields.length > 6 ? "…" : ""}`,
      );
    }
    if (
      Array.isArray(entityConfig.selectableFields) &&
      entityConfig.selectableFields.length > 0
    ) {
      pieces.push(
        `Selectable fields: ${entityConfig.selectableFields.slice(0, 8).join(", ")}${entityConfig.selectableFields.length > 8 ? "…" : ""}`,
      );
    }
    return pieces.join(" ");
  }

  _refreshPreviewTap() {
    this._schedulePreviewRefresh();
  }

  _renderPreview() {
    if (this.previewLoading) {
      return html`<p class="status" role="status" aria-live="polite">
        Loading preview…
      </p>`;
    }
    if (this.previewErrorMessage) {
      return html`<p class="error" role="status" aria-live="polite">
        ${this.previewErrorMessage}
      </p>`;
    }
    if (!Array.isArray(this.previewRecords) || this.previewRecords.length < 1) {
      return html`<p class="empty-preview">
        No results yet for the current query configuration.
      </p>`;
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
    });
  }

  _embedTagMarkup() {
    return `<site-view src="${this.queryUrl || ""}" renderer="${this.renderer}" entity="${this.selectedEntity}"></site-view>`;
  }

  _copyEmbedTag() {
    const markup = this._embedTagMarkup();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(markup).catch(() => {});
    }
  }

  _insertAtBottom() {
    store.editMode = true;
    const haxBody = HAXStore.activeHaxBody;
    if (haxBody) {
      haxBody.haxInsert("site-view", "", {
        src: this.queryUrl,
        renderer: this.renderer,
        entity: this.selectedEntity,
      }, null);
    }
    globalThis.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {},
      }),
    );
  }

  _createAsNewPage() {
    const markup = this._embedTagMarkup();
    globalThis.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {},
      }),
    );
    const SuperDaemonInstance =
      globalThis.SuperDaemonManager &&
      globalThis.SuperDaemonManager.requestAvailability();
    if (SuperDaemonInstance) {
      setTimeout(() => {
        SuperDaemonInstance.runProgram(
          null,
          "CMS",
          { type: "sibling", templateContent: markup },
          "create-page",
          "create-page",
          "",
          "Type page title to create page",
        );
        SuperDaemonInstance.open();
      }, 0);
    }
  }

  render() {
    const entityConfig = this._selectedEntityConfig();
    const selectableFieldOptions =
      entityConfig && Array.isArray(entityConfig.selectableFields)
        ? entityConfig.selectableFields.map((field) => ({
            value: field,
            text: this._titleFromParameterName(field),
          }))
        : [];
    const includeOptions =
      entityConfig && Array.isArray(entityConfig.includes)
        ? entityConfig.includes.map((field) => ({
            value: field,
            text: this._titleFromParameterName(field),
          }))
        : [];
    const sortFieldOptions =
      entityConfig && Array.isArray(entityConfig.sortableFields)
        ? [
            { value: "", text: "Default" },
            ...entityConfig.sortableFields.map((field) => ({
              value: field,
              text: this._titleFromParameterName(field),
            })),
          ]
        : [{ value: "", text: "Default" }];
    const selectedRenderer =
      this.renderer === "playlist"
        ? "carousel"
        : this.renderer === "cards"
          ? "grid"
          : this.renderer;
    const rendererOptions = RENDERER_OPTIONS;
    const leftColumnWidth = Number.isFinite(Number(this.leftPanelWidth))
      ? Math.max(24, Math.min(68, Number(this.leftPanelWidth)))
      : 38;
    const workspaceStyle = `--views-left-panel-width: ${leftColumnWidth}%`;
    return html`
      <div class="panel-shell">
        ${this.errorMessage
          ? html`<p class="error" role="status" aria-live="polite">
              ${this.errorMessage}
            </p>`
          : ""}
        ${this.specLoading
          ? html`<p class="status" role="status" aria-live="polite">
              Loading entity and OpenAPI metadata…
            </p>`
          : ""}
        ${!this.errorMessage && entityConfig
          ? html`
              <div class="workspace" style="${workspaceStyle}">
                <div class="left-column">
                  <details class="group-panel" open>
                    <summary>Data source</summary>
                    <div class="group-body">
                      <div class="inline-grid">
                        <simple-fields-field
                          type="select"
                          label="Entity type"
                          .itemsList="${this.entityOptions}"
                          .value="${this.selectedEntity}"
                          @value-changed="${this._onEntityChanged}"
                          @change="${this._onEntityChanged}"
                        ></simple-fields-field>
                        <simple-fields-field
                          type="select"
                          label="Output renderer"
                          .itemsList="${rendererOptions}"
                          .value="${selectedRenderer}"
                          @value-changed="${this._onRendererChanged}"
                          @change="${this._onRendererChanged}"
                        ></simple-fields-field>
                      </div>
                      <p class="note">
                        ${this._entityDescription(entityConfig)}
                      </p>
                    </div>
                  </details>
                  <details class="group-panel" open>
                    <summary>Field selection</summary>
                    <div class="group-body">
                      <simple-fields-field
                        type="checkbox"
                        label="Fields to present"
                        .itemsList="${selectableFieldOptions}"
                        .value="${this.selectedFields}"
                        @value-changed="${this._onFieldSelectionChanged}"
                        @change="${this._onFieldSelectionChanged}"
                      ></simple-fields-field>
                      ${includeOptions.length > 0
                        ? html`
                            <simple-fields-field
                              type="checkbox"
                              label="Include related resources"
                              .itemsList="${includeOptions}"
                              .value="${this.selectedIncludes}"
                              @value-changed="${this
                                ._onIncludeSelectionChanged}"
                              @change="${this._onIncludeSelectionChanged}"
                            ></simple-fields-field>
                          `
                        : ""}
                      <div class="inline-grid">
                        <simple-fields-field
                          type="select"
                          label="Sort field"
                          .itemsList="${sortFieldOptions}"
                          .value="${this.sortField}"
                          @value-changed="${this._onSortFieldChanged}"
                          @change="${this._onSortFieldChanged}"
                        ></simple-fields-field>
                        <simple-fields-field
                          type="checkbox"
                          label="Sort descending"
                          .value="${this.sortDescending}"
                          @value-changed="${this._onSortDirectionChanged}"
                          @change="${this._onSortDirectionChanged}"
                        ></simple-fields-field>
                      </div>
                    </div>
                  </details>
                  <details class="group-panel" open>
                    <summary>Filters / query parameters</summary>
                    <div class="group-body">
                      ${this.queryFields.length > 0
                        ? html`
                            <simple-fields
                              class="filters-form"
                              .fields="${this.queryFields}"
                              .value="${this.queryValues}"
                              .schematizer="${HaxSchematizer}"
                              .elementizer="${HaxElementizer}"
                              @value-changed="${this._onQueryValuesChanged}"
                              @change="${this._onQueryValuesChanged}"
                              @input="${this._onQueryValuesChanged}"
                            ></simple-fields>
                          `
                        : html`<p class="note">
                            No additional query parameters are available for
                            this entity endpoint.
                          </p>`}
                    </div>
                  </details>
                  <details class="query-details" open>
                    <summary>Query / data feed</summary>
                    <div class="query-copy-row">
                      <span class="note">Method: GET</span>
                      <simple-clipboard-copy-button
                        icon="icons:content-copy"
                        label="Copy URL"
                        data-cp="${this.queryUrl}"
                        success-message="Query URL copied"
                      ></simple-clipboard-copy-button>
                      <simple-icon-button-lite
                        icon="icons:refresh"
                        label="Refresh preview"
                        @click="${this._refreshPreviewTap}"
                      ></simple-icon-button-lite>
                    </div>
                    <code class="query-code">${this.queryUrl}</code>
                    <div class="query-actions" style="margin-top: 8px; display: flex; gap: 8px; flex-wrap: wrap;">
                      <simple-clipboard-copy-button
                        icon="hax:embed"
                        label="Copy embed tag"
                        data-cp="${this._embedTagMarkup()}"
                        success-message="Embed tag copied"
                      ></simple-clipboard-copy-button>
                      <simple-icon-button-lite
                        icon="icons:content-paste"
                        label="Insert at bottom"
                        @click="${this._insertAtBottom}"
                      ></simple-icon-button-lite>
                      <simple-icon-button-lite
                        icon="hax:add"
                        label="Create as new page"
                        @click="${this._createAsNewPage}"
                      ></simple-icon-button-lite>
                    </div>
                  </details>
                </div>
                <div
                  class="resize-handle"
                  role="separator"
                  aria-label="Resize controls and preview"
                  aria-orientation="vertical"
                  aria-valuemin="24"
                  aria-valuemax="68"
                  aria-valuenow="${Math.round(leftColumnWidth)}"
                  tabindex="0"
                  @pointerdown="${this._onResizePointerDown}"
                  @keydown="${this._onResizeKeyDown}"
                ></div>
                <div class="right-column">
                  <div class="preview-shell" aria-live="polite">
                    <div class="preview-head">
                      <h3>Preview</h3>
                      <span class="note">
                        ${this.previewLoading
                          ? "Loading…"
                          : `${this.previewCount} record(s) shown${this.previewTotal > this.previewCount ? ` of ${this.previewTotal}` : ""}`}
                      </span>
                    </div>
                    <div class="preview-body">${this._renderPreview()}</div>
                  </div>
                </div>
              </div>
            `
          : ""}
      </div>
    `;
  }
}

globalThis.customElements.define(
  HAXCMSViewsAdminDialog.tag,
  HAXCMSViewsAdminDialog,
);

export { HAXCMSViewsAdminDialog };

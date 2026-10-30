import { html, css, nothing } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { autorun, toJS } from "mobx";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { HAXCMSI18NMixin } from "../utils/HAXCMSI18NMixin.js";
import {
  HaxUiAdminTokens,
  HaxUiAdminPrimitives,
} from "@haxtheweb/hax-body/lib/hax-ui-styles.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import "@haxtheweb/hax-body/lib/hax-element-demo.js";

/**
 * `haxcms-allowed-blocks-ui`
 * UI for selecting blocks in platform settings.
 *
 * Inside the one admin dialog (haxcms-site-admin, `inShell`) it is the Blocks
 * form section: it stages edits, reports them with
 * `haxcms-admin-section-state`, and `save()` fires the same
 * `haxcms-save-allowed-blocks` event and payload as its Save button.
 */
class HAXCMSAllowedBlocksUI extends HAXCMSI18NMixin(DDD) {
  static get tag() {
    return "haxcms-allowed-blocks-ui";
  }

  static get properties() {
    return {
      haxBlocks: { type: Array },
      allowedBlocks: { type: Object },
      allowedBlocksDefined: {
        type: Boolean,
        attribute: "allowed-blocks-defined",
      },
      blockFilter: { type: String, attribute: "block-filter" },
      busy: { type: Boolean, reflect: true },
      inventoryReady: { type: Boolean, attribute: "inventory-ready" },
      activePreview: { type: String, attribute: false },
      isMobile: { type: Boolean, attribute: "is-mobile", reflect: true },
      /** set by haxcms-site-admin: the shell owns the title and Save button */
      inShell: { type: Boolean, attribute: "in-shell", reflect: true },
    };
  }

  constructor() {
    super();
    this.inShell = false;
    this.__baseline = null;
    this.haxBlocks = [];
    this.allowedBlocks = new Set();
    this.allowedBlocksDefined = false;
    this.blockFilter = "";
    this.busy = false;
    this.inventoryReady = false;
    this.activePreview = null;
    this.isMobile = false;
    this.configurableHiddenTags = new Set([
      "mark",
      "ol",
      "ul",
      "blockquote",
      "code",
      "pre",
      "h5",
      "h6",
      "u",
    ]);
    this.__disposer = [];

    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Blocks",
      enabled: "Enabled",
      block: "Block",
      preview: "Preview",
      filterBlocks: "Filter blocks",
      requiredTextNote:
        "Some text tags are required and always enabled (shown disabled).",
      selectAll: "Select all",
      deselectAll: "Deselect all",
      save: "Save",
      noDescription: "No description available.",
      details: "Details",
      loadingInventory: "Loading full block inventory…",
      selectAllButton: "Select All",
      deselectAllButton: "Deselect All",
      selectedOfAvailable: "{selected} selected / {total} available",
      savingBlocksFailed: "Saving blocks failed: {error}",
      changed: "changed",
      blockOn: "{title} on",
      blockOff: "{title} off",
      blocksChanged: "{count} blocks",
      previewOf: "Preview {title}",
      closePreview: "Close preview",
      groupCount: "{selected} of {total} on",
      groupActions: "{category} blocks",
    };

    this.registerLocalization({
      context: this,
      localesPath: new URL("../../../locales/", import.meta.url).href,
    });
  }

  static get styles() {
    return [
      super.styles,
      ...HaxUiAdminTokens,
      ...HaxUiAdminPrimitives,
      css`
        /* standalone (app-hax system blocks): sized to its own modal */
        :host {
          --haxcms-admin-panel-height: calc(
            var(--simple-modal-height, 80vh) - var(
                --simple-modal-titlebar-height,
                80px
              ) - var(--ddd-spacing-8, 32px)
          );
          position: relative;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          min-height: min(60vh, var(--haxcms-admin-panel-height));
          height: var(--haxcms-admin-panel-height);
          max-height: var(--haxcms-admin-panel-height);
          overflow: hidden;
          padding: var(--hax-ui-gap-lg);
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
          color-scheme: var(--hax-ui-color-scheme, inherit);
          flex-shrink: 0;
        }
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }
        :host([busy]) {
          pointer-events: none;
          opacity: 0.8;
        }
        button {
          font-family: inherit;
          color: inherit;
        }
        simple-icon-lite {
          --simple-icon-width: var(--hax-ui-icon);
          --simple-icon-height: var(--hax-ui-icon);
          --simple-icon-color: currentColor;
          flex: none;
        }
        h2 {
          margin: 0 0 var(--hax-ui-gap-lg);
          font-size: 18px;
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .panel-shell {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
        }
        .panel-scroll {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
          overflow-y: auto;
        }

        /* toolbar: filter and the all-blocks buttons */
        .blocks-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
        }
        .block-search {
          flex: 1 1 260px;
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          min-width: 0;
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }
        .block-search label {
          white-space: nowrap;
        }
        input[type="text"] {
          flex: 1;
          min-width: 0;
          max-width: 360px;
          height: var(--hax-ui-row-height);
          padding: 0 var(--hax-ui-gap-lg);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          font-family: inherit;
          font-size: var(--hax-ui-admin-font-size);
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
        }
        input[type="text"]:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 1px;
        }
        .controls {
          display: flex;
          flex-wrap: wrap;
          gap: var(--hax-ui-gap-md);
        }
        .controls simple-icon-button-lite {
          --simple-icon-height: var(--hax-ui-icon);
          --simple-icon-width: var(--hax-ui-icon);
          height: var(--hax-ui-row-height);
          padding: 0 var(--hax-ui-gap-md);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          font-size: 13px;
          color: var(--hax-ui-text);
          background: var(--hax-ui-surface);
        }
        .note {
          margin: var(--hax-ui-gap-md) 0 var(--hax-ui-gap-lg);
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }

        /* categories: one admin fieldset per category, not DDD details */
        .blocks-list {
          display: flex;
          flex-direction: column;
          border-top: 1px solid var(--hax-ui-line);
        }
        details.block-category {
          margin: 0;
          padding: 0;
          max-width: none;
          min-width: 0;
          border: 0;
          border-bottom: 1px solid var(--hax-ui-line);
          border-radius: 0;
          background: transparent;
          overflow: visible;
        }
        details > summary::after,
        details[open] > summary::after {
          content: none;
        }
        summary.block-category-title,
        details[open] > summary.block-category-title {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          list-style: none;
          min-height: 44px;
          margin: 0;
          padding: 0 var(--hax-ui-gap-md);
          border-radius: var(--hax-ui-radius);
          font-size: var(--hax-ui-admin-font-size);
          color: inherit;
          background-color: transparent;
          filter: none;
          transition: none;
          cursor: pointer;
        }
        summary.block-category-title::-webkit-details-marker {
          display: none;
        }
        summary.block-category-title:hover {
          background-color: var(--hax-ui-hover);
        }
        summary.block-category-title:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: calc(-1 * var(--hax-ui-focus-width));
        }
        .summary-leading {
          flex: 1;
          display: inline-flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          min-width: 0;
        }
        .block-category-title h3 {
          margin: 0;
          font-size: var(--hax-ui-admin-font-size);
          font-weight: var(--ddd-font-weight-bold, 700);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .group-count {
          flex: none;
          font-size: var(--hax-ui-admin-font-size-xs);
          font-variant-numeric: tabular-nums;
          color: var(--hax-ui-text-muted);
        }
        .chev {
          color: var(--hax-ui-text-muted);
          transition: transform var(--hax-ui-duration) var(--hax-ui-easing);
        }
        details[open] > summary .chev {
          transform: rotate(90deg);
        }
        .group-tools {
          display: flex;
          justify-content: flex-end;
          gap: var(--hax-ui-gap);
          padding: 0 var(--hax-ui-gap-md) var(--hax-ui-gap);
        }
        .tool {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
          height: 28px;
          padding: 0 var(--hax-ui-gap-md);
          border-radius: var(--hax-ui-radius);
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-accent);
        }
        .tool:hover {
          background-color: var(--hax-ui-hover);
        }
        .tool:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 1px;
        }
        .tool[disabled] {
          cursor: default;
          color: var(--hax-ui-text-muted);
        }

        /* one row per block: checkbox, name and one line, preview */
        .block-list {
          list-style: none;
          margin: 0 0 var(--hax-ui-gap-md);
          padding: 0;
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius);
        }
        .block-row {
          display: grid;
          grid-template-columns: 20px minmax(0, 1fr) auto;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          min-height: 52px;
          padding: var(--hax-ui-gap) var(--hax-ui-gap-md) var(--hax-ui-gap)
            var(--hax-ui-gap-lg);
          border-bottom: 1px solid var(--hax-ui-line);
        }
        .block-row:last-child {
          border-bottom: 0;
        }
        .block-row:hover {
          background-color: var(--hax-ui-hover);
        }
        .block-row.chg {
          background-color: var(--hax-ui-accent-soft);
        }
        .block-row input[type="checkbox"] {
          margin: 0;
          inline-size: 18px;
          block-size: 18px;
          accent-color: var(--hax-ui-accent-strong);
          cursor: pointer;
        }
        .block-row input[type="checkbox"]:disabled {
          cursor: default;
        }
        .block-row input[type="checkbox"]:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        .block-meta {
          display: flex;
          flex-direction: column;
          gap: 1px;
          min-width: 0;
          margin: 0;
          padding: 0;
          font-family: inherit;
          font-size: var(--hax-ui-admin-font-size);
          line-height: 1.3;
          cursor: pointer;
        }
        .block-title {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          min-width: 0;
          font-size: var(--hax-ui-admin-font-size);
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .block-title .name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .block-row.disabled .block-title {
          color: var(--hax-ui-text-muted);
        }
        .block-description {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          padding-left: calc(var(--hax-ui-icon) + var(--hax-ui-gap-md));
          font-size: var(--hax-ui-admin-font-size-xs);
          line-height: 1.35;
          color: var(--hax-ui-text-muted);
        }
        .preview-button {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
          display: grid;
          place-items: center;
          width: 36px;
          height: 36px;
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius);
          color: var(--hax-ui-text);
          background: var(--hax-ui-surface);
        }
        .preview-button:hover {
          background-color: var(--hax-ui-hover);
        }
        .preview-button:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        .preview-button[aria-expanded="true"] {
          border-color: var(--hax-ui-accent-strong);
          background-color: var(--hax-ui-accent-soft);
        }
        .dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          flex: none;
          border-radius: 50%;
          background-color: var(--hax-ui-accent-strong);
        }

        /* preview: a panel beside the button, or a sheet on narrow screens,
           always inside the part of the section you can see */
        .preview-scrim {
          position: absolute;
          inset: 0;
          z-index: 4;
          background: transparent;
        }
        .preview-scrim.sheet {
          background-color: rgba(0, 3, 33, 0.32);
        }
        .preview-panel {
          position: absolute;
          z-index: 5;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius-lg);
          background-color: var(--hax-ui-surface);
          box-shadow: var(--hax-ui-shadow-popover);
        }
        .preview-head {
          flex: none;
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          min-height: 48px;
          padding: 0 var(--hax-ui-gap) 0 var(--hax-ui-gap-lg);
          border-bottom: 1px solid var(--hax-ui-line);
        }
        .preview-head h4 {
          flex: 1;
          margin: 0;
          font-size: var(--hax-ui-admin-font-size);
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .preview-head .close {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
          display: grid;
          place-items: center;
          width: 40px;
          height: 40px;
          border-radius: var(--hax-ui-radius);
        }
        .preview-head .close:hover {
          background-color: var(--hax-ui-hover);
        }
        .preview-head .close:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: -2px;
        }
        .preview-body {
          flex: 1;
          min-height: 0;
          overflow: auto;
          padding: var(--hax-ui-gap-lg);
        }
        .preview-body hax-element-demo {
          display: block;
          max-width: 100%;
        }

        .actions {
          flex-shrink: 0;
          display: flex;
          justify-content: flex-end;
          gap: var(--hax-ui-gap-md);
          padding-top: var(--hax-ui-gap-lg);
          margin-top: var(--hax-ui-gap-lg);
          border-top: 1px solid var(--hax-ui-line);
          background-color: var(--hax-ui-surface);
        }
        button.action {
          height: var(--hax-ui-row-height);
          padding: 0 var(--ddd-spacing-5, 20px);
          border: 1px solid transparent;
          border-radius: var(--hax-ui-radius);
          font-size: 13px;
          font-weight: var(--ddd-font-weight-bold, 700);
          cursor: pointer;
          color: light-dark(
            var(--ddd-theme-default-white, #fff),
            var(--ddd-theme-default-potentialMidnight, #000321)
          );
          background-color: light-dark(
            var(--ddd-theme-default-nittanyNavy, #001e44),
            var(--ddd-theme-default-linkLight, #cce9ff)
          );
        }
        button.action:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }

        /* in the admin dialog the shell owns the title, the scrolling body
           and the action bar */
        :host([in-shell]) {
          display: block;
          height: auto;
          min-height: 0;
          max-height: none;
          overflow: visible;
          padding: var(--hax-ui-gap-lg) var(--ddd-spacing-6, 24px)
            var(--ddd-spacing-8, 32px);
        }
        :host([in-shell]) .panel-scroll {
          overflow: visible;
        }

        @media (max-width: 600px) {
          :host([in-shell]) {
            padding: var(--hax-ui-gap-md) var(--hax-ui-gap-md)
              var(--ddd-spacing-6, 24px);
          }
          .block-search {
            flex-basis: 100%;
          }
          .block-search label {
            position: absolute;
            width: 1px;
            height: 1px;
            overflow: hidden;
            clip: rect(0 0 0 0);
            white-space: nowrap;
          }
          input[type="text"] {
            max-width: none;
          }
          .controls {
            width: 100%;
          }
          .controls simple-icon-button-lite {
            flex: 1;
          }
          .block-row {
            padding-left: var(--hax-ui-gap-md);
          }
          .block-description {
            padding-left: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .chev {
            transition: none;
          }
        }
      `,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    const disposer = autorun(() => {
      const _mobx_val_0 = toJS(HAXStore.gizmoList);
      const _mobx_val_1 = toJS(HAXStore.__appStoreData);
      const _mobx_val_2 = toJS(HAXStore.appStoreLoaded);
      const _mobx_val_3 = toJS(HAXStore.platformConfig);
      Promise.resolve().then(() => {
        const currentGizmos = _mobx_val_0;
        const gizmos = Array.isArray(currentGizmos) ? currentGizmos : [];
        const appStoreData = _mobx_val_1;
        const autoloader =
          appStoreData && appStoreData.autoloader
            ? appStoreData.autoloader
            : null;
        const hasAutoloaderInventory = !!(
          autoloader &&
          ((Array.isArray(autoloader) && autoloader.length > 0) ||
            (!Array.isArray(autoloader) &&
              typeof autoloader === "object" &&
              Object.keys(autoloader).length > 0))
        );
        const appStoreLoaded = !!_mobx_val_2;
        const shouldWaitForStableInventory =
          hasAutoloaderInventory && !appStoreLoaded;
        this.inventoryReady = !shouldWaitForStableInventory;
        const blocksFromGizmos = gizmos.filter(
          (item) =>
            !(
              item.meta &&
              (item.meta.requiresParent ||
                (item.meta.hidden && !this._isConfigurableHiddenTag(item.tag)))
            ),
        );
        let blocks = blocksFromGizmos;
        if (
          !shouldWaitForStableInventory &&
          blocksFromGizmos.length === 0 &&
          hasAutoloaderInventory
        ) {
          blocks = this._blocksFromAutoloaderInventory(autoloader);
        }
        this.haxBlocks = shouldWaitForStableInventory ? [] : blocks;

        const platformConfig = _mobx_val_3;
        const allowedBlocks = platformConfig
          ? platformConfig.allowedBlocks
          : undefined;
        const hasExplicitNoOptionalBlocks = allowedBlocks === null;
        const hasAllowedBlocks =
          (allowedBlocks &&
            typeof allowedBlocks.size === "number" &&
            allowedBlocks.size > 0) ||
          (Array.isArray(allowedBlocks) && allowedBlocks.length > 0);
        this.allowedBlocksDefined =
          hasExplicitNoOptionalBlocks || !!hasAllowedBlocks;

        if (hasExplicitNoOptionalBlocks) {
          this.allowedBlocks = new Set();
        } else if (hasAllowedBlocks) {
          if (allowedBlocks instanceof Set) {
            this.allowedBlocks = new Set(Array.from(allowedBlocks));
          } else if (Array.isArray(allowedBlocks)) {
            this.allowedBlocks = new Set(allowedBlocks);
          } else {
            this.allowedBlocks = new Set();
          }
        } else {
          this.allowedBlocks = new Set(
            blocks
              .filter((item) => !HAXStore.requiredPrimitives.has(item.tag))
              .map((item) => item.tag),
          );
        }
        this._captureBaseline();
      });
    });
    this.__disposer.push(disposer);

    const mobileDisposer = autorun(() => {
      const _mobx_val_0 = toJS(store.isMobile);
      Promise.resolve().then(() => {
        this.isMobile = !!_mobx_val_0;
      });
    });
    this.__disposer.push(mobileDisposer);
  }

  disconnectedCallback() {
    while (this.__disposer.length) {
      const d = this.__disposer.pop();
      if (d && typeof d.dispose === "function") {
        d.dispose();
      }
    }
    super.disconnectedCallback();
  }

  render() {
    const blocks = Array.isArray(this.haxBlocks) ? this.haxBlocks : [];
    const toggleableTotal = blocks.filter(
      (b) => !b.gizmoList && !HAXStore.requiredPrimitives.has(b.tag),
    ).length;
    const toggleableSelected = blocks.filter(
      (b) =>
        !b.gizmoList &&
        !HAXStore.requiredPrimitives.has(b.tag) &&
        this.allowedBlocks.has(b.tag),
    ).length;
    const groupedBlocks = this.inventoryReady
      ? this._groupBlocksByCategory(blocks)
      : [];
    return html`
      <div class="panel-shell">
        <div class="panel-scroll">
          ${this.inShell ? nothing : html`<h2>${this.t.title}</h2>`}
          <div class="section">
            <div class="blocks-meta">
              <div class="block-search">
                <label for="blockFilter">${this.t.filterBlocks}: </label>
                <input
                  id="blockFilter"
                  type="text"
                  placeholder="${this.t.filterBlocks}"
                  .value=${this.blockFilter}
                  ?disabled=${!this.inventoryReady}
                  @input=${this._blockFilterChanged}
                />
              </div>
              <div class="controls">
                <simple-icon-button-lite
                  icon="hax:admin-select-all"
                  label="${this.t.selectAll}"
                  title="${this.t.selectAll}"
                  ?disabled=${!this.inventoryReady}
                  data-category="all-blocks"
                  @click="${this._selectAll}"
                  >${this.t.selectAllButton}</simple-icon-button-lite
                >
                <simple-icon-button-lite
                  icon="hax:admin-select-all"
                  label="${this.t.deselectAll}"
                  title="${this.t.deselectAll}"
                  ?disabled=${!this.inventoryReady}
                  data-category="all-blocks"
                  @click="${this._deselectAll}"
                  >${this.t.deselectAllButton}</simple-icon-button-lite
                >
              </div>
            </div>
            <div class="note">
              ${this.inventoryReady
                ? html`${this.t.selectedOfAvailable
                    .replace("{selected}", () => toggleableSelected)
                    .replace("{total}", () => toggleableTotal)}
                  ${HAXStore.requiredPrimitives.size
                    ? html`<span> • ${this.t.requiredTextNote}</span>`
                    : ""}`
                : html`${this.t.loadingInventory}`}
            </div>
            <div class="blocks-list">
              ${groupedBlocks.map((group) => this._renderGroup(group))}
            </div>
          </div>
        </div>
        ${this.inShell
          ? nothing
          : html`<div class="actions">
              <button
                class="action"
                ?disabled=${this.busy || !this.inventoryReady}
                @click="${this._saveAllowedBlocks}"
              >
                ${this.t.save}
              </button>
            </div>`}
      </div>
      ${this.activePreview ? this._renderPreview() : nothing}
    `;
  }

  _renderGroup(group) {
    const key = this._categoryKey(group.category);
    const toggleable = group.blocks.filter(
      (b) => !HAXStore.requiredPrimitives.has(b.tag),
    );
    const on = toggleable.filter((b) => this.allowedBlocks.has(b.tag)).length;
    const countText = this.t.groupCount
      .replace("{selected}", () => on)
      .replace("{total}", () => toggleable.length);
    return html`
      <details class="block-category" data-group="${key}">
        <summary class="block-category-title">
          <span class="summary-leading">
            <simple-icon-lite
              icon="${this._blockCategoryIcon(group)}"
              aria-hidden="true"
            ></simple-icon-lite>
            <h3>${group.category}</h3>
          </span>
          <span class="group-count">${countText}</span>
          <simple-icon-lite
            class="chev"
            icon="hax:admin-chevron"
            aria-hidden="true"
          ></simple-icon-lite>
        </summary>
        <div
          class="group-tools"
          role="group"
          aria-label="${this.t.groupActions.replace(
            "{category}",
            () => group.category,
          )}"
        >
          <button
            type="button"
            class="tool"
            data-category="${key}"
            ?disabled="${!toggleable.length}"
            @click="${this._selectAll}"
          >
            ${this.t.selectAll}
          </button>
          <button
            type="button"
            class="tool"
            data-category="${key}"
            ?disabled="${!toggleable.length}"
            @click="${this._deselectAll}"
          >
            ${this.t.deselectAll}
          </button>
        </div>
        <ul class="block-list">
          ${group.blocks.map((item) => this._renderBlockRow(item))}
        </ul>
      </details>
    `;
  }

  _renderBlockRow(item) {
    const isDisabled = HAXStore.requiredPrimitives.has(item.tag);
    const checked = this._isBlockChecked(item.tag);
    const rowClass = checked ? "enabled" : "disabled";
    // changed marks belong to the admin dialog's staged save
    const changed = !!this.inShell && this._isBlockChanged(item.tag);
    const description = this._getBlockDescription(item);
    const rowId = this._blockInputId(item.tag);
    return html`
      <li
        class="block-row ${rowClass} ${changed ? "chg" : ""}"
        data-tag="${item.tag}"
      >
        <input
          id="${rowId}"
          type="checkbox"
          data-tag="${item.tag}"
          aria-describedby="${rowId}-desc"
          .checked=${checked}
          ?disabled=${isDisabled}
          @change=${this._checkboxChanged}
        />
        <label class="block-meta" for="${rowId}">
          <span class="block-title">
            ${this._renderChangedDot(changed)}
            <simple-icon-lite
              icon="${item.icon}"
              aria-hidden="true"
            ></simple-icon-lite>
            <span class="name">${item.title}</span>
          </span>
          <span class="block-description" id="${rowId}-desc"
            >${description}</span
          >
        </label>
        <button
          type="button"
          class="preview-button"
          data-tag="${item.tag}"
          aria-label="${this.t.previewOf.replace("{title}", () => item.title)}"
          title="${this.t.preview}"
          aria-haspopup="dialog"
          aria-expanded="${this.activePreview === item.tag ? "true" : "false"}"
          @click="${this._openPreview}"
        >
          <simple-icon-lite
            icon="hax:admin-preview"
            aria-hidden="true"
          ></simple-icon-lite>
        </button>
      </li>
    `;
  }

  /**
   * Where the preview goes: the part of this element you can see right now
   * (inside the dialog body that scrolls it, and the viewport), in this
   * element's own coordinates.
   */
  _visibleBounds() {
    const host = this.getBoundingClientRect();
    let top = Math.max(host.top, 0);
    let bottom = Math.min(host.bottom, globalThis.innerHeight || host.bottom);
    let left = Math.max(host.left, 0);
    let right = Math.min(host.right, globalThis.innerWidth || host.right);
    const scroller = this.assignedSlot ? this.assignedSlot.parentElement : null;
    if (scroller && scroller.getBoundingClientRect) {
      const r = scroller.getBoundingClientRect();
      top = Math.max(top, r.top);
      bottom = Math.min(bottom, r.bottom);
      left = Math.max(left, r.left);
      right = Math.min(right, r.right);
    }
    return {
      top: top - host.top,
      left: left - host.left,
      width: Math.max(0, right - left),
      height: Math.max(0, bottom - top),
    };
  }

  _openPreview(e) {
    const button = e && e.currentTarget ? e.currentTarget : null;
    const tag = button ? button.getAttribute("data-tag") : "";
    if (!tag) {
      return;
    }
    if (this.activePreview === tag) {
      this._closePreview();
      return;
    }
    this.__previewReturn = button;
    const bounds = this._visibleBounds();
    const gap = 8;
    // narrow: a sheet over the visible part of the section; wide: a panel
    // beside the button, kept inside the visible part
    const sheet = bounds.width < 640;
    let place;
    if (sheet) {
      place = {
        sheet: true,
        top: bounds.top + gap,
        left: bounds.left + gap,
        width: bounds.width - gap * 2,
        maxHeight: bounds.height - gap * 2,
      };
    } else {
      const host = this.getBoundingClientRect();
      const b = button.getBoundingClientRect();
      const width = Math.min(380, bounds.width - gap * 2);
      const maxHeight = Math.min(520, bounds.height - gap * 2);
      let left = b.left - host.left - width - gap;
      if (left < bounds.left + gap) {
        left = bounds.left + gap;
      }
      if (left + width > bounds.left + bounds.width - gap) {
        left = bounds.left + bounds.width - gap - width;
      }
      let top = b.top - host.top;
      if (top + maxHeight > bounds.top + bounds.height - gap) {
        top = bounds.top + bounds.height - gap - maxHeight;
      }
      if (top < bounds.top + gap) {
        top = bounds.top + gap;
      }
      place = { sheet: false, top, left, width, maxHeight };
    }
    this.__previewPlace = place;
    this.activePreview = tag;
    this.updateComplete.then(() => {
      const close = this.shadowRoot.querySelector(".preview-panel .close");
      if (close) {
        close.focus();
      }
    });
  }

  _closePreview() {
    const back = this.__previewReturn;
    this.activePreview = null;
    this.__previewReturn = null;
    if (back && typeof back.focus === "function") {
      this.updateComplete.then(() => back.focus());
    }
  }

  _previewKeydown(e) {
    if (e.key === "Escape") {
      e.stopPropagation();
      e.preventDefault();
      this._closePreview();
    }
  }

  _renderPreview() {
    const blocks = Array.isArray(this.haxBlocks) ? this.haxBlocks : [];
    const item = blocks.find((b) => b && b.tag === this.activePreview);
    if (!item) {
      return nothing;
    }
    const place = this.__previewPlace || {
      sheet: true,
      top: 8,
      left: 8,
      width: 320,
      maxHeight: 480,
    };
    const description = this._getBlockDescription(item);
    return html`
      <div
        class="preview-scrim ${place.sheet ? "sheet" : ""}"
        @click="${this._closePreview}"
      ></div>
      <div
        class="preview-panel ${place.sheet ? "sheet" : ""}"
        role="dialog"
        aria-modal="${place.sheet ? "true" : "false"}"
        aria-labelledby="preview-title"
        style="${styleMap({
          top: `${Math.round(place.top)}px`,
          left: `${Math.round(place.left)}px`,
          width: `${Math.round(place.width)}px`,
          maxHeight: `${Math.round(place.maxHeight)}px`,
        })}"
        @keydown="${this._previewKeydown}"
      >
        <div class="preview-head">
          <simple-icon-lite
            icon="${item.icon}"
            aria-hidden="true"
          ></simple-icon-lite>
          <h4 id="preview-title">${item.title}</h4>
          <button
            type="button"
            class="close"
            aria-label="${this.t.closePreview}"
            title="${this.t.closePreview}"
            @click="${this._closePreview}"
          >
            <simple-icon-lite
              icon="close"
              aria-hidden="true"
            ></simple-icon-lite>
          </button>
        </div>
        <div class="preview-body">
          <hax-element-demo
            render-tag="${item.tag}"
            gizmo-title="${item.title}"
            gizmo-description="${description}"
            gizmo-icon="${item.icon}"
          ></hax-element-demo>
        </div>
      </div>
    `;
  }

  _isBlockChecked(tag) {
    if (!tag) {
      return false;
    }
    if (HAXStore.requiredPrimitives.has(tag)) {
      return true;
    }
    return this.allowedBlocks.has(tag);
  }

  _setBlockChecked(tag, checked) {
    if (!tag || HAXStore.requiredPrimitives.has(tag)) {
      return;
    }
    this.allowedBlocksDefined = true;
    if (checked) {
      this.allowedBlocks.add(tag);
    } else {
      this.allowedBlocks.delete(tag);
    }
    this.requestUpdate();
    this._emitState();
  }

  _blockInputId(tag) {
    const safeTag = (tag || "").replace(/[^a-zA-Z0-9-_]/g, "-");
    return `allowed-block-${safeTag}`;
  }

  _isConfigurableHiddenTag(tag) {
    return !!(tag && this.configurableHiddenTags.has(tag));
  }

  _getBlockDescription(item) {
    if (item && item.description) {
      return item.description;
    }
    if (item && item.meta && item.meta.description) {
      return item.meta.description;
    }
    return this.t.noDescription;
  }

  _blocksFromAutoloaderInventory(autoloader) {
    const fallback = [];
    const knownTags = new Set();
    if (!autoloader || typeof autoloader !== "object") {
      return fallback;
    }
    const keys = Object.keys(autoloader);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      let tag = "";
      if (key && isNaN(Number(key))) {
        tag = key;
      } else {
        const value = autoloader[key];
        if (typeof value === "string") {
          tag = value;
        } else if (value && typeof value.tag === "string") {
          tag = value.tag;
        }
      }
      if (typeof tag !== "string") {
        continue;
      }
      tag = tag.trim();
      if (tag === "" || knownTags.has(tag)) {
        continue;
      }
      knownTags.add(tag);
      fallback.push({
        tag: tag,
        title: this._titleFromTag(tag),
        description: "",
        icon: "hax:blocks",
        tags: ["Other"],
        meta: {},
      });
    }
    fallback.sort((a, b) => a.title.localeCompare(b.title));
    return fallback;
  }

  _titleFromTag(tag) {
    if (typeof tag !== "string" || tag.trim() === "") {
      return "";
    }
    return tag
      .trim()
      .split("-")
      .map((word) =>
        word ? `${word.charAt(0).toUpperCase()}${word.slice(1)}` : "",
      )
      .join(" ");
  }

  _checkboxChanged(e) {
    const input = e.currentTarget;
    if (!input || input.type !== "checkbox") return;
    const tag = input.dataset.tag;
    if (!tag) return;
    this._setBlockChecked(tag, !!input.checked);
  }

  _blockFilterChanged(e) {
    this.blockFilter = e && e.target ? e.target.value : "";
  }

  _selectAll(e) {
    const category =
      e && e.currentTarget ? e.currentTarget.dataset.category : null;
    const blocks = Array.isArray(this.haxBlocks) ? this.haxBlocks : [];
    this.allowedBlocksDefined = true;

    if (category === "all-blocks") {
      this.allowedBlocks = new Set(
        blocks
          .filter((item) => !HAXStore.requiredPrimitives.has(item.tag))
          .map((item) => item.tag),
      );
      this.requestUpdate();
      this._emitState();
      return;
    }
    blocks
      .filter(
        (item) => this._categoryKey(this._blockCategory(item)) === category,
      )
      .forEach((item) => {
        if (!HAXStore.requiredPrimitives.has(item.tag)) {
          this.allowedBlocks.add(item.tag);
        }
      });
    this.requestUpdate();
    this._emitState();
  }

  _deselectAll(e) {
    const category =
      e && e.currentTarget ? e.currentTarget.dataset.category : null;
    const blocks = Array.isArray(this.haxBlocks) ? this.haxBlocks : [];
    this.allowedBlocksDefined = true;

    if (category === "all-blocks") {
      this.allowedBlocks = new Set([]);
      this.requestUpdate();
      this._emitState();
      return;
    }
    blocks
      .filter(
        (item) => this._categoryKey(this._blockCategory(item)) === category,
      )
      .forEach((item) => {
        if (!HAXStore.requiredPrimitives.has(item.tag)) {
          this.allowedBlocks.delete(item.tag);
        }
      });
    this.requestUpdate();
    this._emitState();
  }

  _categoryKey(category) {
    return (category || "other").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }
  _blockCategoryIcon(group) {
    const blocks = group && Array.isArray(group.blocks) ? group.blocks : [];
    const itemWithIcon = blocks.find((item) => item && item.icon);
    if (itemWithIcon && itemWithIcon.icon) {
      return itemWithIcon.icon;
    }
    return "hax:blocks";
  }

  _blockCategory(item) {
    if (item && item.meta && item.meta.inlineOnly) {
      return "Inline";
    }
    if (Array.isArray(item.tags) && item.tags.length > 0) {
      return item.tags[0];
    }
    if (HAXStore.requiredPrimitives.has(item.tag)) {
      return "Text";
    }
    return "Other";
  }

  _compareCategories(a, b) {
    const categoryA = a || "Other";
    const categoryB = b || "Other";

    // Writing / Text first, Other last, then alphabetical
    const first = ["Writing", "Text"];
    const last = ["Other"];

    if (first.includes(categoryA) && !first.includes(categoryB)) return -1;
    if (!first.includes(categoryA) && first.includes(categoryB)) return 1;

    if (last.includes(categoryA) && !last.includes(categoryB)) return 1;
    if (!last.includes(categoryA) && last.includes(categoryB)) return -1;

    if (first.includes(categoryA) && first.includes(categoryB)) {
      return first.indexOf(categoryA) - first.indexOf(categoryB);
    }

    if (categoryA < categoryB) return -1;
    if (categoryA > categoryB) return 1;
    return 0;
  }

  _groupBlocksByCategory(items) {
    const filter = this.blockFilter
      ? this.blockFilter.toLowerCase().trim()
      : "";
    const groupMap = {};
    items.forEach((item) => {
      if (filter) {
        const title = item && item.title ? item.title.toLowerCase() : "";
        const tag = item && item.tag ? item.tag.toLowerCase() : "";
        if (!title.includes(filter) && !tag.includes(filter)) {
          return;
        }
      }
      const category = this._blockCategory(item);

      if (!groupMap[category]) {
        groupMap[category] = [];
      }
      groupMap[category].push(item);
    });

    const categories = Object.keys(groupMap);
    categories.sort((a, b) => this._compareCategories(a, b));

    return categories.map((category) => ({
      category,
      blocks: groupMap[category],
    }));
  }

  _allowedBlocksForSave() {
    return Array.from(this.allowedBlocks || [])
      .filter((tag) => !HAXStore.requiredPrimitives.has(tag))
      .sort();
  }

  /** remember what was loaded, so edits can be counted and discarded */
  _captureBaseline() {
    this.__baseline = {
      allowedBlocksDefined: this.allowedBlocksDefined,
      allowedBlocks: Array.from(this.allowedBlocks || []),
    };
    this.__baselineSet = new Set(this.__baseline.allowedBlocks);
    this._emitState();
  }

  _isBlockChanged(tag) {
    if (!this.__baseline || !tag || HAXStore.requiredPrimitives.has(tag)) {
      return false;
    }
    return this.allowedBlocks.has(tag) !== this.__baselineSet.has(tag);
  }

  _renderChangedDot(changed) {
    return changed
      ? html`<span
          class="dot"
          role="img"
          aria-label="${this.t.changed}"
        ></span>`
      : nothing;
  }

  /** human labels of the blocks turned on or off since loading */
  get changedFields() {
    const blocks = Array.isArray(this.haxBlocks) ? this.haxBlocks : [];
    const changed = [];
    blocks.forEach((item) => {
      if (item && this._isBlockChanged(item.tag)) {
        const title = item.title || item.tag;
        changed.push(
          (this.allowedBlocks.has(item.tag)
            ? this.t.blockOn
            : this.t.blockOff
          ).replace("{title}", () => title),
        );
      }
    });
    return changed;
  }

  get canSave() {
    return !!this.inventoryReady && !this.busy;
  }

  _emitState() {
    const changed = this.changedFields;
    // a long list (Select all) is summarised rather than named block by block
    const changes =
      changed.length > 5
        ? [this.t.blocksChanged.replace("{count}", () => changed.length)]
        : changed;
    this.dispatchEvent(
      new CustomEvent("haxcms-admin-section-state", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: {
          dirty: changed.length > 0,
          changes: changes,
          count: changed.length,
          canSave: this.canSave,
        },
      }),
    );
  }

  /** section contract: restore the values that were loaded */
  discard() {
    if (this.__baseline) {
      this.allowedBlocksDefined = this.__baseline.allowedBlocksDefined;
      this.allowedBlocks = new Set(this.__baseline.allowedBlocks);
    }
    this._emitState();
  }

  /**
   * section contract: send the save. Fires the same
   * haxcms-save-allowed-blocks event and payload as the Save button.
   * @returns {boolean} true when a save was sent
   */
  save() {
    if (!this.inventoryReady) {
      HAXStore.toast(this.t.loadingInventory, 3000, {}, "fit-bottom");
      return false;
    }
    if (this.busy) {
      return false;
    }
    let sent = false;
    try {
      this.busy = true;
      const allowedBlocks = this._allowedBlocksForSave();
      const allowedBlocksPayload =
        this.allowedBlocksDefined && allowedBlocks.length === 0
          ? null
          : allowedBlocks;
      this.dispatchEvent(
        new CustomEvent("haxcms-save-allowed-blocks", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: {
            allowedBlocksDefined: this.allowedBlocksDefined,
            allowedBlocks: allowedBlocksPayload,
          },
        }),
      );
      sent = true;

      if (!this.inShell) {
        this.dispatchEvent(
          new CustomEvent("simple-modal-hide", {
            bubbles: true,
            composed: true,
            cancelable: false,
            detail: false,
          }),
        );
      }
    } catch (error) {
      console.error("Saving blocks failed:", error);
      HAXStore.toast(
        this.t.savingBlocksFailed.replace("{error}", () => error.message),
        5000,
        {},
        "fit-bottom",
      );
    }

    this.busy = false;
    return sent;
  }

  /** the standalone Save button */
  _saveAllowedBlocks() {
    this.save();
  }
}

globalThis.customElements.define(
  HAXCMSAllowedBlocksUI.tag,
  HAXCMSAllowedBlocksUI,
);
export { HAXCMSAllowedBlocksUI };

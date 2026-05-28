import { html, css } from "lit";
import { autorun, toJS } from "mobx";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { HAXCMSI18NMixin } from "../utils/HAXCMSI18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-popover/lib/simple-popover-selection.js";
import "@haxtheweb/hax-body/lib/hax-element-demo.js";

/**
 * `haxcms-allowed-blocks-ui`
 * UI for selecting blocks in platform settings
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
    };
  }

  constructor() {
    super();
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
    };

    this.registerLocalization({
      context: this,
      basePath: import.meta.url,
    });
  }

  static get styles() {
    return [
      super.styles,
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
          font-family: var(--ddd-font-primary);
          min-width: 80vw;
          min-height: min(60vh, var(--haxcms-admin-panel-height));
          height: var(--haxcms-admin-panel-height);
          max-height: var(--haxcms-admin-panel-height);
          overflow: hidden;
          padding: var(--ddd-spacing-4);
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          background: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          flex-shrink: 0;
        }

        :host([busy]) {
          pointer-events: none;
          opacity: 0.8;
        }

        h2 {
          margin: 0 0 var(--ddd-spacing-4) 0;
          font-size: var(--ddd-font-size-m);
          font-weight: var(--ddd-font-weight-bold);
        }

        h4 {
          margin: 0;
          font-size: var(--ddd-font-size-xs);
          font-weight: var(--ddd-font-weight-bold);
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
          padding-right: var(--ddd-spacing-1);
        }

        details {
          max-width: 100%;
          min-width: 100%;
          box-sizing: border-box;
        }

        .controls-container {
          display: flex;
          align-items: flex-start;
          gap: var(--ddd-spacing-3);
        }

        .controls {
          flex: 1;
          display: inline-flex;
          gap: var(--ddd-spacing-2);
          align-items: center;
          flex-direction: column;
        }

        .controls simple-icon-button-lite {
          --simple-icon-height: var(--ddd-icon-4xs);
          --simple-icon-width: var(--ddd-icon-4xs);
          border: var(--ddd-border-xs);
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-2);
          background: light-dark(
            var(--ddd-theme-default-white),
            rgba(0, 0, 0, 0.2)
          );
        }

        input[type="text"] {
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-s);
          border: var(--ddd-border-xs);
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-2);
          background: light-dark(
            var(--ddd-theme-default-white),
            rgba(0, 0, 0, 0.25)
          );
          color: inherit;
        }

        .blocks-list {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-4);
        }

        .block-category {
          border: var(--ddd-border-sm);
          border-radius: var(--ddd-radius-md);
          background: light-dark(
            var(--ddd-theme-default-white),
            rgba(0, 0, 0, 0.15)
          );
          padding: var(--ddd-spacing-4);
        }

        .block-category-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--ddd-spacing-3);
          margin-bottom: 0;
          cursor: pointer;
        }
        .block-category[open] .block-category-title {
          margin-bottom: var(--ddd-spacing-3);
        }
        .block-category-title:focus-visible {
          outline: var(--ddd-border-sm) solid var(--ddd-theme-default-skyBlue);
          outline-offset: 2px;
          border-radius: var(--ddd-radius-xs);
        }

        .summary-leading {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
        }

        .block-category-title simple-icon-lite {
          --simple-icon-color: currentColor;
          --simple-icon-height: var(--ddd-icon-3xs, 20px);
          --simple-icon-width: var(--ddd-icon-3xs, 20px);
        }

        .blocks-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--ddd-spacing-3);
          margin-bottom: var(--ddd-spacing-3);
        }

        .block-search {
          flex: 7;
        }

        .table-wrapper {
          flex: 7;
          min-width: 0;
        }

        .block-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          border: var(--ddd-border-xs);
          border-radius: var(--ddd-radius-sm);
          overflow: hidden;
          background: light-dark(
            var(--ddd-theme-default-white),
            rgba(0, 0, 0, 0.12)
          );
        }

        .block-table th,
        .block-table td {
          text-align: left;
          vertical-align: top;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          border-bottom: var(--ddd-border-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-primary-5)
            );
        }

        .block-table tbody tr:last-child td {
          border-bottom: 0;
        }

        .block-row {
          transition:
            opacity 0.2s ease,
            background-color 0.2s ease;
        }

        .block-row.enabled {
          opacity: 1;
          background-color: light-dark(
            rgba(0, 0, 0, 0.02),
            rgba(255, 255, 255, 0.06)
          );
        }

        .block-row.disabled {
          opacity: 0.58;
          background-color: light-dark(
            rgba(0, 0, 0, 0),
            rgba(255, 255, 255, 0.02)
          );
        }

        .block-table th {
          font-size: var(--ddd-font-size-4xs);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-weight: var(--ddd-font-weight-bold);
        }

        .block-table .select-col,
        .block-table .preview-col {
          width: 88px;
          text-align: center;
        }

        .block-table input[type="checkbox"] {
          margin-top: 0;
          inline-size: var(--ddd-icon-xs);
          block-size: var(--ddd-icon-xs);
          cursor: pointer;
        }

        .block-meta {
          display: block;
          cursor: pointer;
        }

        .block-title {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          font-weight: var(--ddd-font-weight-bold);
          cursor: pointer;
        }

        .block-title simple-icon-lite {
          --simple-icon-height: var(--ddd-icon-xs);
          --simple-icon-width: var(--ddd-icon-xs);
        }
        .preview-control {
          display: inline-flex;
          justify-content: center;
        }

        .preview-button {
          --simple-icon-height: var(--ddd-icon-xs);
          --simple-icon-width: var(--ddd-icon-xs);
          --simple-icon-color: currentColor;
          border: var(--ddd-border-xs);
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-1);
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          background: light-dark(
            var(--ddd-theme-default-white),
            rgba(0, 0, 0, 0.2)
          );
        }

        .block-description {
          margin: var(--ddd-spacing-1) 0 0 0;
          font-size: var(--ddd-font-size-3xs);
          line-height: 1.35;
          opacity: 0.92;
        }

        simple-popover-selection.block-preview {
          display: inline-flex;
          justify-content: center;
          --simple-popover-manager-max-width: 320px;
          --simple-popover-manager-min-width: 260px;
        }

        .mobile-chip-controls {
          display: none;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-2);
          margin-bottom: var(--ddd-spacing-3);
        }

        .mobile-chip-controls simple-icon-button-lite {
          --simple-icon-height: var(--ddd-icon-4xs);
          --simple-icon-width: var(--ddd-icon-4xs);
          border: var(--ddd-border-xs);
          border-radius: var(--ddd-radius-sm);
          min-height: 44px;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          background: light-dark(
            var(--ddd-theme-default-white),
            rgba(0, 0, 0, 0.2)
          );
        }

        .mobile-block-list {
          display: none;
          flex-direction: column;
          gap: var(--ddd-spacing-2);
        }

        .block-card {
          border: var(--ddd-border-xs);
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          transition:
            opacity 0.2s ease,
            background-color 0.2s ease;
          cursor: pointer;
          outline: none;
        }

        .block-card.enabled {
          opacity: 1;
          background-color: light-dark(
            rgba(0, 0, 0, 0.02),
            rgba(255, 255, 255, 0.06)
          );
        }

        .block-card.disabled {
          opacity: 0.58;
          background-color: light-dark(
            rgba(0, 0, 0, 0),
            rgba(255, 255, 255, 0.02)
          );
        }

        .block-card:focus-visible {
          outline: 2px solid var(--ddd-theme-default-keystoneYellow);
          outline-offset: 2px;
        }

        .block-card-main {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          min-height: 44px;
        }

        .block-card-main input[type="checkbox"] {
          margin-top: 0;
          inline-size: var(--ddd-icon-xs);
          block-size: var(--ddd-icon-xs);
          cursor: pointer;
        }

        .block-card-details {
          margin-top: var(--ddd-spacing-2);
        }

        .block-card-details summary {
          min-height: 44px;
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: var(--ddd-font-size-4xs);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          font-weight: var(--ddd-font-weight-bold);
        }

        .block-card-preview {
          margin-top: var(--ddd-spacing-2);
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--ddd-spacing-3);
          padding-top: var(--ddd-spacing-4);
          margin-top: var(--ddd-spacing-4);
          border-top: var(--ddd-border-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-primary-5)
            );
          background: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          flex-shrink: 0;
          position: sticky;
          bottom: 0;
          z-index: 2;
        }

        button.action {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-s);
          padding: var(--ddd-spacing-3) var(--ddd-spacing-5);
          border-radius: var(--ddd-radius-sm);
          border: var(--ddd-border-xs);
          cursor: pointer;
          background-color: var(--ddd-theme-default-skyBlue);
          color: var(--ddd-theme-default-white);
        }

        button.action:focus,
        button.action:hover {
          outline: 2px solid var(--ddd-theme-default-keystoneYellow);
        }

        .note {
          margin-top: var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-xs);
          opacity: 0.9;
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
            overflow-x: hidden;
            padding: var(--ddd-spacing-3);
          }
          .panel-shell {
            min-height: auto;
          }
          .panel-scroll {
            flex: 0 0 auto;
            min-height: auto;
            overflow: visible;
            padding-right: 0;
          }

          .blocks-meta {
            flex-direction: column;
            align-items: stretch;
          }

          .controls {
            width: 100%;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: flex-start;
          }

          .controls-container {
            display: block;
          }

          .table-wrapper {
            display: none;
          }

          .mobile-chip-controls {
            display: flex;
          }

          .mobile-block-list {
            display: flex;
          }

          .actions {
            position: sticky;
            bottom: 0;
            padding-bottom: calc(
              var(--ddd-spacing-3) + env(safe-area-inset-bottom, 0px)
            );
          }
        }
      `,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    const disposer = autorun(() => {
      const currentGizmos = toJS(HAXStore.gizmoList);
      const gizmos = Array.isArray(currentGizmos) ? currentGizmos : [];
      const appStoreData = toJS(HAXStore.__appStoreData);
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
      const appStoreLoaded = !!toJS(HAXStore.appStoreLoaded);
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

      const platformConfig = toJS(HAXStore.platformConfig);
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
    });
    this.__disposer.push(disposer);

    const mobileDisposer = autorun(() => {
      this.isMobile = !!toJS(store.isMobile);
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
          <h2>${this.t.title}</h2>
          <div class="section">
            <div class="blocks-meta">
              <div class="block-search">
                <label for="blockFilter">${this.t.filterBlocks}: </label>
                <input
                  id="blockFilter"
                  type="text"
                  .value=${this.blockFilter}
                  ?disabled=${!this.inventoryReady}
                  @input=${this._blockFilterChanged}
                />
              </div>
              <div class="controls">
                <simple-icon-button-lite
                  icon="icons:select-all"
                  label="${this.t.selectAll}"
                  title="${this.t.selectAll}"
                  ?disabled=${!this.inventoryReady}
                  data-category="all-blocks"
                  @click="${this._selectAll}"
                  >Select All</simple-icon-button-lite
                >
                <simple-icon-button-lite
                  icon="icons:select-all"
                  label="${this.t.deselectAll}"
                  title="${this.t.deselectAll}"
                  ?disabled=${!this.inventoryReady}
                  data-category="all-blocks"
                  @click="${this._deselectAll}"
                  >Deselect All</simple-icon-button-lite
                >
              </div>
            </div>
            <div class="note">
              ${this.inventoryReady
                ? html`${toggleableSelected} selected / ${toggleableTotal}
                  available
                  ${HAXStore.requiredPrimitives.size
                    ? html`<span> • ${this.t.requiredTextNote}</span>`
                    : ""}`
                : html`${this.t.loadingInventory}`}
            </div>
            <div class="blocks-list">
              ${groupedBlocks.map(
                (group) => html`
                  <details class="block-category">
                    <summary class="block-category-title">
                      <span class="summary-leading">
                        <simple-icon-lite
                          icon="${this._blockCategoryIcon(group)}"
                          aria-hidden="true"
                        ></simple-icon-lite>
                        <h4>${group.category}</h4>
                      </span>
                    </summary>
                    <div class="controls-container">
                      ${this.isMobile
                        ? html`
                            <div class="mobile-chip-controls">
                              <simple-icon-button-lite
                                icon="icons:select-all"
                                label="${this.t.selectAll}"
                                title="${this.t.selectAll}"
                                data-category="${this._categoryKey(
                                  group.category,
                                )}"
                                @click="${this._selectAll}"
                                >${this.t.selectAll}</simple-icon-button-lite
                              >
                              <simple-icon-button-lite
                                icon="icons:select-all"
                                label="${this.t.deselectAll}"
                                title="${this.t.deselectAll}"
                                data-category="${this._categoryKey(
                                  group.category,
                                )}"
                                @click="${this._deselectAll}"
                                >${this.t.deselectAll}</simple-icon-button-lite
                              >
                            </div>
                            <div class="mobile-block-list">
                              ${group.blocks.map((item) =>
                                this._renderBlockCard(item),
                              )}
                            </div>
                          `
                        : html`
                            <div class="table-wrapper">
                              <table class="block-table">
                                <thead>
                                  <tr>
                                    <th class="select-col">
                                      ${this.t.enabled}
                                    </th>
                                    <th>${this.t.block}</th>
                                    <th class="preview-col">
                                      ${this.t.preview}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  ${group.blocks.map((item) =>
                                    this._renderBlockRow(item),
                                  )}
                                </tbody>
                              </table>
                            </div>
                            <div class="controls">
                              <simple-icon-button-lite
                                icon="icons:select-all"
                                label="${this.t.selectAll}"
                                title="${this.t.selectAll}"
                                data-category="${this._categoryKey(
                                  group.category,
                                )}"
                                @click="${this._selectAll}"
                                >Select All</simple-icon-button-lite
                              >
                              <simple-icon-button-lite
                                icon="icons:select-all"
                                label="${this.t.deselectAll}"
                                title="${this.t.deselectAll}"
                                data-category="${this._categoryKey(
                                  group.category,
                                )}"
                                @click="${this._deselectAll}"
                                >Deselect All</simple-icon-button-lite
                              >
                            </div>
                          `}
                    </div>
                  </details>
                `,
              )}
            </div>
          </div>
        </div>
        <div class="actions">
          <button
            class="action"
            ?disabled=${this.busy || !this.inventoryReady}
            @click="${this._saveAllowedBlocks}"
          >
            ${this.t.save}
          </button>
        </div>
      </div>
    `;
  }

  _renderBlockRow(item) {
    const isDisabled = HAXStore.requiredPrimitives.has(item.tag);
    const checked = this._isBlockChecked(item.tag);
    const rowClass = checked ? "enabled" : "disabled";
    const description = this._getBlockDescription(item);
    const rowId = this._blockInputId(item.tag);
    return html`
      <tr class="block-row ${rowClass}">
        <td class="select-col">
          <input
            id="${rowId}"
            type="checkbox"
            data-tag="${item.tag}"
            .checked=${checked}
            ?disabled=${isDisabled}
            @change=${this._checkboxChanged}
          />
        </td>
        <td>
          <label class="block-meta" for="${rowId}">
            <span class="block-title">
              <simple-icon-lite icon="${item.icon}"></simple-icon-lite>
              <span>${item.title}</span>
            </span>
            <p class="block-description">${description}</p>
          </label>
        </td>
        <td class="preview-col">
          <simple-popover-selection
            class="block-preview"
            data-index="${item.tag}"
            @opened-changed="${this._hoverForPreviewChange}"
            event="hover"
          >
            <span class="preview-control" slot="button">
              <simple-icon-button-lite
                class="preview-button"
                icon="icons:visibility"
                label="${this.t.preview}"
                title="${this.t.preview}"
              ></simple-icon-button-lite>
            </span>
            ${this.activePreview === item.tag
              ? html`
                  <hax-element-demo
                    slot="options"
                    render-tag="${item.tag}"
                    gizmo-title="${item.title}"
                    gizmo-description="${description}"
                    gizmo-icon="${item.icon}"
                  ></hax-element-demo>
                `
              : ""}
          </simple-popover-selection>
        </td>
      </tr>
    `;
  }

  _renderBlockCard(item) {
    const isDisabled = HAXStore.requiredPrimitives.has(item.tag);
    const checked = this._isBlockChecked(item.tag);
    const rowClass = checked ? "block-card enabled" : "block-card disabled";
    const description = this._getBlockDescription(item);
    const rowId = this._blockInputId(item.tag);
    return html`
      <div
        class="${rowClass}"
        data-tag="${item.tag}"
        role="checkbox"
        aria-checked="${checked ? "true" : "false"}"
        tabindex="${isDisabled ? "-1" : "0"}"
        @click="${this._blockCardClicked}"
        @keydown="${this._blockCardKeydown}"
      >
        <div class="block-card-main">
          <input
            id="${rowId}"
            type="checkbox"
            data-tag="${item.tag}"
            data-stop-toggle="true"
            .checked=${checked}
            ?disabled=${isDisabled}
            @click="${this._stopCardToggle}"
            @change=${this._checkboxChanged}
          />
          <label
            class="block-title"
            for="${rowId}"
            data-stop-toggle="true"
            @click="${this._stopCardToggle}"
          >
            <simple-icon-lite icon="${item.icon}"></simple-icon-lite>
            <span>${item.title}</span>
          </label>
        </div>
        <details
          class="block-card-details"
          data-stop-toggle="true"
          @click="${this._stopCardToggle}"
        >
          <summary data-stop-toggle="true">${this.t.details}</summary>
          <p class="block-description">${description}</p>
          <div class="block-card-preview">
            <simple-popover-selection
              class="block-preview"
              data-index="${item.tag}"
              @opened-changed="${this._hoverForPreviewChange}"
              event="click"
            >
              <span class="preview-control" slot="button">
                <simple-icon-button-lite
                  class="preview-button"
                  icon="icons:visibility"
                  label="${this.t.preview}"
                  title="${this.t.preview}"
                  data-stop-toggle="true"
                ></simple-icon-button-lite>
              </span>
              ${this.activePreview === item.tag
                ? html`
                    <hax-element-demo
                      slot="options"
                      render-tag="${item.tag}"
                      gizmo-title="${item.title}"
                      gizmo-description="${description}"
                      gizmo-icon="${item.icon}"
                    ></hax-element-demo>
                  `
                : ""}
            </simple-popover-selection>
          </div>
        </details>
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

  _hoverForPreviewChange(e) {
    const popover = e && e.detail ? e.detail : null;
    if (!popover || !popover.opened) {
      return;
    }
    this.activePreview = popover.dataset.index;
    setTimeout(() => {
      if (popover && typeof popover.openedChanged === "function") {
        popover.openedChanged(true);
      }
    }, 10);
  }
  _isCardInteraction(e) {
    const path = e && e.composedPath ? e.composedPath() : [];
    for (const node of path) {
      if (!node) {
        continue;
      }
      if (
        node.getAttribute &&
        node.getAttribute("data-stop-toggle") === "true"
      ) {
        return true;
      }
      if (!node.tagName) {
        continue;
      }
      const tag = node.tagName.toLowerCase();
      if (
        tag === "input" ||
        tag === "button" ||
        tag === "a" ||
        tag === "summary" ||
        tag === "details" ||
        tag === "simple-icon-button-lite" ||
        tag === "simple-popover-selection"
      ) {
        return true;
      }
    }
    return false;
  }

  _blockCardClicked(e) {
    if (this._isCardInteraction(e)) {
      return;
    }
    const tag = e && e.currentTarget ? e.currentTarget.dataset.tag : null;
    if (!tag) {
      return;
    }
    this._setBlockChecked(tag, !this._isBlockChecked(tag));
  }

  _blockCardKeydown(e) {
    const key = e && e.key ? e.key : "";
    if (key !== " " && key !== "Enter") {
      return;
    }
    if (this._isCardInteraction(e)) {
      return;
    }
    e.preventDefault();
    const tag = e && e.currentTarget ? e.currentTarget.dataset.tag : null;
    if (!tag) {
      return;
    }
    this._setBlockChecked(tag, !this._isBlockChecked(tag));
  }

  _stopCardToggle(e) {
    if (e) {
      e.stopPropagation();
    }
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
  }

  _deselectAll(e) {
    const category =
      e && e.currentTarget ? e.currentTarget.dataset.category : null;
    const blocks = Array.isArray(this.haxBlocks) ? this.haxBlocks : [];
    this.allowedBlocksDefined = true;

    if (category === "all-blocks") {
      this.allowedBlocks = new Set([]);
      this.requestUpdate();
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

  async _saveAllowedBlocks() {
    if (!this.inventoryReady) {
      HAXStore.toast(this.t.loadingInventory, 3000, {}, "fit-bottom");
      return;
    }
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

      this.dispatchEvent(
        new CustomEvent("simple-modal-hide", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: false,
        }),
      );
    } catch (error) {
      console.error("Saving blocks failed:", error);
      HAXStore.toast(
        `Saving blocks failed: ${error.message}`,
        5000,
        {},
        "fit-bottom",
      );
    }

    this.busy = false;
  }
}

globalThis.customElements.define(
  HAXCMSAllowedBlocksUI.tag,
  HAXCMSAllowedBlocksUI,
);
export { HAXCMSAllowedBlocksUI };

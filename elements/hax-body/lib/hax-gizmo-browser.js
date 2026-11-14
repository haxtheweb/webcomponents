/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { guard } from "lit/directives/guard.js";
import { SimpleFilterMixin } from "@haxtheweb/simple-filter/simple-filter.js";
import { haxElementToNode } from "@haxtheweb/utils/utils.js";
import { HAXStore } from "./hax-store.js";
import "./hax-element-demo.js";
import "./hax-tray-button.js";
import { HaxTrayBrowserStyles } from "./hax-tray-browser-styles.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/simple-fields/lib/simple-fields-field.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-toolbar/lib/simple-button-grid.js";
import "@haxtheweb/simple-popover/lib/simple-popover-selection.js";
import "@haxtheweb/a11y-collapse/a11y-collapse.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
/* `hax-gizmo-browser`
 * `Browse a list of gizmos. This provides a listing of custom elements for people to search and select based on what have been defined as gizmos for users to select.`
 * @microcopy - the mental model for this element
 * - gizmo - silly name for the general public when talking about custom elements and what it provides in the end.
 */
class HaxGizmoBrowser extends I18NMixin(SimpleFilterMixin(LitElement)) {
  static get styles() {
    return [
      ...HaxTrayBrowserStyles,
      css`
        :host {
          /* a HAX UI surface: light-dark() tokens follow the HAX UI theme */
          color-scheme: var(--hax-ui-color-scheme);
          display: flex;
          flex-direction: column;
          align-items: stretch;
          flex: 0 1 auto;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
          /* clip, not hidden or auto: the tray scrolls the list, and a
             scroll container here would stop the filter from sticking */
          overflow-x: clip;
          overflow-y: visible;
        }
        :host > * {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }
        simple-popover-selection {
          display: flex;
        }
        /* HAX UI: the filter stays at the top of the list while it scrolls */
        .toolbar-inner {
          position: sticky;
          /* under the tray title bar (and the Blocks / Templates switch,
             when there is one), which also stick */
          top: calc(
            var(--hax-ui-titlebar-height, 48px) +
              var(--hax-gizmo-browser-sticky-offset, 0px)
          );
          z-index: 2;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          padding: var(
              --hax-gizmo-browser-toolbar-padding-top,
              var(--hax-ui-gap-md)
            )
            var(--hax-ui-gap-lg) var(--hax-ui-gap-md);
          background-color: var(--hax-ui-surface);
          border-bottom: 1px solid var(--hax-ui-line);
        }
        #inputfilter {
          margin: 0;
          padding: 0;
          --simple-fields-font-size: var(--hax-ui-admin-font-size);
          --simple-fields-color: var(--hax-ui-text);
          --simple-fields-input-max-width: 100%;
          --simple-fields-row-focus-outline-width: var(--hax-ui-focus-width);
          --simple-fields-row-focus-outline-color: var(--hax-ui-focus);
          --simple-fields-background-color: var(--hax-ui-surface);
        }
        #inputfilter::part(field-main) {
          gap: 0;
        }
        /* a search box: the placeholder names it on screen, the label
           stays for assistive tech */
        #inputfilter::part(label) {
          position: absolute;
          width: 1px;
          height: 1px;
          margin: -1px;
          padding: 0;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
          border: 0;
        }
        #inputfilter::part(field-main-inner) {
          box-sizing: border-box;
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          flex: 1 1 auto;
          min-width: 0;
          height: var(--hax-ui-row-height);
          padding: 0 var(--hax-ui-gap-md);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          background-color: var(--hax-ui-surface);
        }
        #inputfilter::part(field-main-inner):focus-within {
          border-color: var(--hax-ui-accent-strong);
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 1px;
        }
        #inputfilter::part(option-input) {
          box-sizing: border-box;
          flex: 1 1 auto;
          width: 100%;
          min-width: 0;
          height: calc(var(--hax-ui-row-height) - 2px);
          padding: 0;
          border: 0;
          outline: none;
          background-color: transparent;
          color: var(--hax-ui-text);
        }
        #inputfilter::part(option-input)::placeholder {
          color: var(--hax-ui-text-muted);
          font-style: normal;
          opacity: 1;
        }
        #inputfilter simple-icon-lite {
          flex: 0 0 auto;
          color: var(--hax-ui-text-muted);
          --simple-icon-width: var(--hax-ui-icon);
          --simple-icon-height: var(--hax-ui-icon);
        }
        simple-fields-field {
          margin: 0;
          padding: 0;
        }
      `,
    ];
  }
  constructor() {
    super();
    this.activePreview = null;
    this.daemonKeyCombo = null;
    autorun(() => {
      const _mobx_val_0 = toJS(HAXStore.daemonKeyCombo);
      Promise.resolve().then(() => {
        this.daemonKeyCombo = _mobx_val_0;
      });
    });
    this.items = [];
    this.categories = [];
    this.like = "";
    this.value = "";
    this.where = "index";
    this.recentGizmoList = [];
    this.popularGizmoList = [];
    this.t = {
      filterContentTypes: "Filter Blocks",
      recent: "Recent",
      popular: "Popular",
    };
    this.registerLocalization({
      context: this,
      namespace: "hax",
    });
    this.addEventListener("mouseleave", this.closePopover.bind(this));
    this.addEventListener("mouseout", this.closePopover.bind(this));
    autorun(() => {
      const _mobx_val_0 = toJS(HAXStore.recentGizmoList);
      Promise.resolve().then(() => {
        if (HAXStore.editMode) {
          const recent = _mobx_val_0;
          let recentList = [];
          let recentTags = [];
          recent.forEach((gizmo) => {
            if (this._gizmoAllowedInTray(gizmo)) {
              if (!recentTags.includes(gizmo.tag)) {
                recentTags.push(gizmo.tag);
                recentList.push(gizmo);
                // limit to 5, then remove the 1st one
                if (recentList.length > 5) {
                  recentTags.shift();
                  recentList.shift();
                }
              }
            }
          });
          this.recentGizmoList = recentList;
        }
      });
    });
  }
  static get properties() {
    return {
      ...super.properties,
      categories: { type: Array },
      hidden: { type: Boolean, reflect: true },
      recentGizmoList: { type: Array },
      popularGizmoList: { type: Array },
      activePreview: { type: Number },
    };
  }
  closePopover() {
    this.activePreview = null;
    let popover = globalThis.SimplePopoverManager.requestAvailability();
    popover.opened = false;
  }
  _gizmoAllowedInTray(gizmo) {
    if (!gizmo || !gizmo.tag) {
      return false;
    }
    if (
      gizmo.meta &&
      (gizmo.meta.inlineOnly || gizmo.meta.hidden || gizmo.requiresParent)
    ) {
      return false;
    }
    const requiredPrimitives = HAXStore.requiredPrimitives;
    const isRequiredPrimitive =
      requiredPrimitives && requiredPrimitives.has(gizmo.tag);
    if (gizmo.platformRestricted && !isRequiredPrimitive) {
      return false;
    }
    if (!HAXStore.platformAllows(gizmo.tag) && !isRequiredPrimitive) {
      return false;
    }
    return true;
  }
  /**
   * Build a searchable index string for a gizmo, matching the same
   * fields used when indexing the main items list.
   */
  _gizmoSearchIndex(gizmo) {
    let index = (gizmo.title || "") + " " + (gizmo.tag || "");
    if (gizmo.tags) {
      index += " " + gizmo.tags.join(" ");
    }
    if (gizmo.description) {
      index += " " + gizmo.description;
    }
    if (gizmo.meta && gizmo.meta.author) {
      index += " " + gizmo.meta.author;
    }
    return index;
  }
  /**
   * Filter an auxiliary gizmo list (recent / popular) using the same
   * filter query applied to the main block list.
   */
  _filterAuxList(list) {
    if (!this.like) {
      return list;
    }
    const indexed = list.map((gizmo) => ({
      ...gizmo,
      index: this._gizmoSearchIndex(gizmo),
    }));
    return this._computeFiltered(
      indexed,
      "index",
      this.like,
      this.caseSensitive,
      this.multiMatch,
    );
  }
  render() {
    const filteredPopularList = this._filterAuxList(this.popularGizmoList);
    const filteredRecentList = this._filterAuxList(this.recentGizmoList);
    return html`${
      this.hidden
        ? ``
        : html`<div class="toolbar-inner" part="toolbar">
              <simple-fields-field
                id="inputfilter"
                @value-changed="${this.inputfilterChanged}"
                @keydown="${this._inputKeydown}"
                label="${this.t.filterContentTypes}"
                placeholder="${this.t.filterContentTypes}"
                type="text"
                auto-validate=""
                part="filter"
              >
                <simple-icon-lite
                  slot="prefix"
                  icon="hax:admin-search"
                  aria-hidden="true"
                ></simple-icon-lite>
              </simple-fields-field>
            </div>
            <slot name="after-filter"></slot>

            ${
              HAXStore.platformAllows("popularGizmos")
                ? html`<a11y-collapse
                    id="popular"
                    heading="${this.t.popular}"
                    heading-button
                    icon="hax:admin-chevron"
                    expanded
                    ?disabled="${filteredPopularList.length === 0}"
                  >
                    <simple-button-grid columns="3" always-expanded part="grid">
                      ${filteredPopularList.map(
                        (gizmo, i) =>
                          html` <simple-popover-selection
                            data-index="popular-${i}"
                            @opened-changed="${this._hoverForPreviewChange}"
                            event="hover"
                          >
                            <hax-tray-button
                              show-text-label
                              voice-command="insert ${gizmo.title}"
                              draggable="true"
                              @dragstart="${this._dragStart}"
                              index="popular-${i}"
                              label="${gizmo.title}"
                              event-name="insert-tag"
                              event-data="${gizmo.tag}"
                              data-demo-schema="true"
                              icon-position="top"
                              icon="${gizmo.icon}"
                              part="grid-button"
                              slot="button"
                            ></hax-tray-button>
                            ${
                              this.activePreview === `popular-${i}`
                                ? html`
                                    <hax-element-demo
                                      render-tag="${gizmo.tag}"
                                      gizmo-title="${gizmo.title}"
                                      gizmo-description="${gizmo.description || ""}"
                                      gizmo-icon="${gizmo.icon}"
                                      slot="options"
                                    ></hax-element-demo>
                                  `
                                : ``
                            }
                          </simple-popover-selection>`,
                      )}
                    </simple-button-grid>
                  </a11y-collapse>`
                : html``
            }
            ${
              HAXStore.platformAllows("recentGizmos")
                ? html`<a11y-collapse
                    id="recent"
                    heading="${this.t.recent}"
                    heading-button
                    icon="hax:admin-chevron"
                    expanded
                    ?disabled="${filteredRecentList.length === 0}"
                  >
                    <simple-button-grid columns="3" always-expanded part="grid">
                      ${filteredRecentList.map(
                        (gizmo, i) =>
                          html` <simple-popover-selection
                            data-index="${i}"
                            @opened-changed="${this._hoverForPreviewChange}"
                            event="hover"
                          >
                            <hax-tray-button
                              show-text-label
                              voice-command="insert ${gizmo.title}"
                              draggable="true"
                              @dragstart="${this._dragStart}"
                              index="${i}"
                              label="${gizmo.title}"
                              event-name="insert-tag"
                              event-data="${gizmo.tag}"
                              data-demo-schema="true"
                              icon-position="top"
                              icon="${gizmo.icon}"
                              part="grid-button"
                              slot="button"
                            ></hax-tray-button>
                            ${
                              this.activePreview === i.toString()
                                ? html`
                                    <hax-element-demo
                                      render-tag="${gizmo.tag}"
                                      gizmo-title="${gizmo.title}"
                                      gizmo-description="${gizmo.description || ""}"
                                      gizmo-icon="${gizmo.icon}"
                                      slot="options"
                                    ></hax-element-demo>
                                  `
                                : ``
                            }
                          </simple-popover-selection>`,
                      )}
                    </simple-button-grid>
                  </a11y-collapse>`
                : html``
            }
            ${this.categories.map(
              (tag) =>
                html` <a11y-collapse
                  heading="${this.ucfirst(tag)}"
                  heading-button
                  icon="hax:admin-chevron"
                >
                  <simple-button-grid columns="3" always-expanded part="grid">
                    ${guard(
                      [this.filtered, tag, this._activePreviewInCategory(tag)],
                      () =>
                        this.filtered.map(
                          (gizmo, i) =>
                            html`${
                              gizmo && gizmo.tags && gizmo.tags.includes(tag)
                                ? html` <simple-popover-selection
                                    data-index="${i}"
                                    @opened-changed="${this._hoverForPreviewChange}"
                                    event="hover"
                                  >
                                    <hax-tray-button
                                      show-text-label
                                      voice-command="insert ${gizmo.title}"
                                      draggable="true"
                                      @dragstart="${this._dragStart}"
                                      index="${i}"
                                      label="${gizmo.title}"
                                      event-name="insert-tag"
                                      event-data="${gizmo.tag}"
                                      data-demo-schema="true"
                                      icon-position="top"
                                      icon="${gizmo.icon}"
                                      part="grid-button"
                                      slot="button"
                                    ></hax-tray-button>
                                    ${
                                      this.activePreview === i.toString()
                                        ? html`
                                            <hax-element-demo
                                              render-tag="${gizmo.tag}"
                                              gizmo-title="${gizmo.title}"
                                              gizmo-description="${
                                                gizmo.description || ""
                                              }"
                                              gizmo-icon="${gizmo.icon}"
                                              slot="options"
                                            ></hax-element-demo>
                                          `
                                        : ``
                                    }
                                  </simple-popover-selection>`
                                : ``
                            }`,
                        ),
                    )}
                  </simple-button-grid>
                </a11y-collapse>`,
            )} `
    }`;
  }
  static get tag() {
    return "hax-gizmo-browser";
  }
  // react to "opened" changing on the popover
  _hoverForPreviewChange(e) {
    const popover = e.detail;
    // this is open
    if (popover.opened) {
      // Handle both numeric indices and string indices (for popular category)
      this.activePreview = popover.dataset.index;
      // @notice
      // timing hack because the act of opening the element triggers a light dom rebuild
      // in which the element is not yet visible, so we need to wait a tick
      // and then tell the pop up it should look at and re-clone it's light dom
      setTimeout(() => {
        e.detail.openedChanged(true);
      }, 10);
    }
  }
  /**
   * Drag start so we know what target to set
   */
  _dragStart(e) {
    // create the tag
    let schema = HAXStore.haxSchemaFromTag(e.target.eventData);
    let target;
    if (schema.gizmo.tag && schema.demoSchema && schema.demoSchema[0]) {
      target = haxElementToNode(schema.demoSchema[0]);
    } else {
      target = globalThis.document.createElement(e.target.eventData);
    }
    HAXStore.recentGizmoList.push(schema.gizmo);
    HAXStore.__dragTarget = target;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.dropEffect = "move";
    }
    e.stopPropagation();
    e.stopImmediatePropagation();
  }
  inputfilterChanged(e) {
    this.like = e.target.value;
    if (this.like == "") {
      this.collapseAll();
    } else {
      this.expandAll();
    }
  }
  // pressing escape while focused on the filter clears it, matching
  // the same behavior Merlin (super-daemon) uses for its search input
  _inputKeydown(e) {
    if (e.key === "Escape" && e.target.value !== "") {
      e.preventDefault();
      e.stopPropagation();
      e.target.value = "";
    }
  }
  expandAll() {
    this.shadowRoot.querySelectorAll("a11y-collapse").forEach((item) => {
      item.expanded = true;
    });
  }
  collapseAll() {
    this.shadowRoot
      .querySelectorAll("a11y-collapse:not(#recent):not(#popular)")
      .forEach((item) => {
        item.expanded = false;
      });
  }
  willUpdate(changedProperties) {
    if (super.willUpdate) {
      super.willUpdate(changedProperties);
    }
    // Derive categories from items in willUpdate so it batches into the
    // current update cycle. Setting categories in updated() scheduled a
    // redundant second update (Lit change-in-update warning).
    if (changedProperties.has("items") && this.items && this.items.length > 0) {
      this.categories = [...this.updateCategories(this.items)];
    }
  }
  /**
   * The preview a category grid has to show, or null when the active preview
   * belongs to a gizmo outside that category. Category grids are wrapped in
   * guard(), so hovering a button only re-renders the grids that contain the
   * hovered gizmo (and the ones that showed the previous preview) instead of
   * every category x every gizmo.
   */
  _activePreviewInCategory(tag) {
    if (this.activePreview === null || this.activePreview === undefined) {
      return null;
    }
    const gizmo = this.filtered[this.activePreview];
    return gizmo && gizmo.tags && gizmo.tags.includes(tag)
      ? this.activePreview
      : null;
  }
  ucfirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  updateCategories(list) {
    let tags = [];
    list.forEach((gizmo) => {
      if (gizmo.tags && gizmo.tags[0]) {
        if (!tags.includes(gizmo.tags[0])) {
          tags.push(gizmo.tags[0]);
        }
      }
    });

    // Create custom ordering with logical priority
    // Text first, then alphabetical, then Other at the end
    const otherCategory = "Other";

    // Separate Text, Other, and regular categories
    const regularTags = [];
    let hasText = false;
    let hasOther = false;

    tags.forEach((tag) => {
      if (tag === "Text") {
        hasText = true;
      } else if (tag === otherCategory) {
        hasOther = true;
      } else {
        regularTags.push(tag);
      }
    });

    // Sort regular categories alphabetically
    regularTags.sort();

    // Combine in final order: Text first, then alphabetical, then Other
    const orderedTags = [];
    if (hasText) orderedTags.push("Text");
    orderedTags.push(...regularTags);
    if (hasOther) orderedTags.push(otherCategory);
    return orderedTags;
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    autorun(() => {
      const _mobx_val_0 = toJS(HAXStore.gizmoList);
      Promise.resolve().then(() => {
        if (HAXStore.editMode) {
          this.resetList(_mobx_val_0);
        }
      });
    });
    // Initialize popular blocks list
    this._initializePopularBlocks();
  }

  /**
   * Initialize the list of popular blocks with the top 9 most used elements
   */
  _initializePopularBlocks() {
    // Define the most popular HAX blocks based on usage patterns
    const popularTags = [
      "p",
      "h2",
      "video-player",
      "media-image",
      "learning-component",
      "a11y-figure",
      "self-check",
      "stop-note",
    ];

    const sourceList =
      this.items && this.items.length > 0 ? this.items : HAXStore.gizmoList;
    // Wait for HAXStore to be ready and get gizmo list
    if (sourceList && sourceList.length > 0) {
      const popularGizmos = [];
      popularTags.forEach((tag) => {
        const gizmo = sourceList.find((g) => {
          if (!g || g.tag !== tag) {
            return false;
          }
          return this._gizmoAllowedInTray(g);
        });
        if (gizmo) {
          popularGizmos.push(gizmo);
        }
      });
      this.popularGizmoList = popularGizmos;
    } else {
      // If HAXStore isn't ready yet, try again shortly
      setTimeout(() => this._initializePopularBlocks(), 100);
    }
  }
  /**
   * Reset this browser.
   */
  resetList(list) {
    if (list) {
      this.like = "";
      this.value = "";
      const items = list.filter((gizmo) => this._gizmoAllowedInTray(gizmo));
      // build index for improved searchability
      items.map((gizmo, i) => {
        items[i].index = gizmo.title + " " + gizmo.tag;
        if (gizmo.tags) {
          items[i].index += " " + gizmo.tags.join(" ");
        }
        if (gizmo.description) {
          items[i].index += " " + gizmo.description;
        }
        if (gizmo.meta && gizmo.meta.author) {
          items[i].index += " " + gizmo.meta.author;
        }
      });
      this.items = [...items];
      // Update popular blocks when gizmo list changes
      this._initializePopularBlocks();
    }
  }
}
globalThis.customElements.define(HaxGizmoBrowser.tag, HaxGizmoBrowser);
export { HaxGizmoBrowser };

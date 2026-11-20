/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { HaxUiAdminTokens } from "@haxtheweb/d-d-d/lib/HaxUiAdminTokens.js";
import { HaxUiDialogTitlebarStyles } from "@haxtheweb/d-d-d/lib/HaxUiDialogFrame.js";
import { HaxUiAdminSimpleFields } from "@haxtheweb/d-d-d/lib/HaxUiAdminControls.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "web-dialog/index.js";
import "@haxtheweb/simple-fields/lib/simple-fields-field.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "./app-hax-use-case.js";

// Facet groups per tab: [key, how to read the value off an item]. Template
// facets fall through to the theme the template is built on, so "Sidebar"
// finds templates as well as themes.
// every theme is a "Website"; it says nothing about what one is for
const SKIP_USE_CASES = ["Website", "Fun"];
const FACETS = {
  skeleton: ["useCase", "layout", "designSystem", "source"],
  blank: ["useCase", "layout", "designSystem", "inspiredBy"],
};

/**
 * `app-hax-design-browser`
 * Browse every template or theme with search, facets and sort, then hand the
 * pick to the create dialog (`design-chosen` event, detail: the use case item).
 */
export class AppHaxDesignBrowser extends I18NMixin(DDDSuper(LitElement)) {
  static get tag() {
    return "app-hax-design-browser";
  }

  constructor() {
    super();
    this.open = false;
    this.kind = "skeleton";
    this.items = [];
    this.search = "";
    this.sort = "recommended";
    this.selected = {};
    this.narrow = false;
    this.t = {
      browseTitle: "Find a starting point",
      templates: "Templates",
      themes: "Themes",
      close: "Close",
      search: "Search",
      searchTemplates: "Search templates by name, purpose or theme",
      searchThemes: "Search themes by name, purpose or inspiration",
      sortBy: "Sort by",
      recommended: "Recommended",
      alphabetical: "A to Z",
      mostPages: "Most starter pages",
      filters: "Filters",
      useCase: "Use case",
      layout: "Layout",
      designSystem: "Design system",
      inspiredBy: "Inspired by",
      source: "Made by",
      hax: "HAX",
      you: "You",
      yours: "Your organization",
      showing: "Showing {count} of {total}",
      clearAll: "Clear all",
      removeFilter: "Remove filter {value}",
      noMatches: "Nothing matches these filters.",
      builtOn: "Built on {theme}",
      pages: "{count} pages",
      page: "1 page",
      swappable: "Swaps design systems",
      templatesHint:
        "Templates are a theme plus starter pages and content for a purpose.",
      themesHint:
        "Themes start you with one blank Home page; pick a template for starter content.",
    };
    this.registerLocalization({
      context: this,
      namespace: "app-hax",
      basePath: import.meta.url + "/../../../",
    });
  }

  static get properties() {
    return {
      ...super.properties,
      open: { type: Boolean, reflect: true },
      kind: { type: String, reflect: true },
      items: { type: Array },
      search: { type: String },
      sort: { type: String },
      selected: { type: Object },
      narrow: { type: Boolean, reflect: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      ...HaxUiAdminTokens,
      ...HaxUiDialogTitlebarStyles,
      ...HaxUiAdminSimpleFields,
      css`
        :host {
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
        }
        web-dialog {
          --dialog-width: 1120px;
          --dialog-max-width: calc(100vw - var(--ddd-spacing-8, 32px));
          --dialog-max-height: calc(100dvh - var(--ddd-spacing-8, 32px));
          --dialog-border-radius: var(--hax-ui-radius-lg);
          z-index: 1000;
        }
        web-dialog::part(backdrop) {
          background: rgba(0, 0, 0, 0.6);
        }
        web-dialog::part(dialog) {
          background: var(--hax-ui-surface);
          color: var(--hax-ui-text);
          border-radius: var(--hax-ui-radius-lg);
          box-shadow: var(--hax-ui-shadow-popover);
          padding: 0;
          overflow: hidden;
          height: calc(100dvh - var(--ddd-spacing-8, 32px));
          display: flex;
          flex-direction: column;
        }
        .toolbar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          padding: var(--ddd-spacing-3, 12px) var(--ddd-spacing-5, 20px);
          border-bottom: 1px solid var(--hax-ui-line);
        }
        .tabs {
          display: inline-flex;
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          overflow: hidden;
        }
        .tabs button {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
          min-height: 36px;
          padding: 0 var(--ddd-spacing-4, 16px);
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2, 8px);
          color: var(--hax-ui-text);
          font-weight: var(--ddd-font-weight-medium, 500);
        }
        .tabs button + button {
          border-left: 1px solid var(--hax-ui-line-strong);
        }
        .tabs button[aria-selected="true"] {
          background: var(--hax-ui-selected);
          color: var(--hax-ui-text);
          font-weight: var(--ddd-font-weight-bold, 700);
          box-shadow: inset 0 -3px 0 var(--hax-ui-accent-strong);
        }
        .tabs button:hover {
          background: var(--hax-ui-hover);
        }
        .tabs button:focus-visible,
        .chip:focus-visible,
        .clear:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        .count {
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }
        /* fields are simple-fields-field in the shared admin field style
           (HaxUiAdminSimpleFields); each names its own control, so the
           visible words stay outside and the inner label is hidden */
        simple-fields-field.search {
          flex: 1 1 260px;
          min-width: 0;
        }
        simple-fields-field.search::part(label),
        .sort simple-fields-field::part(label) {
          display: none;
        }
        simple-fields-field.search::part(field-main-inner) {
          flex: 1 1 auto;
        }
        .sort {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2, 8px);
          color: var(--hax-ui-text-muted);
        }
        .sort simple-fields-field {
          min-width: 180px;
        }
        .body {
          flex: 1;
          min-height: 0;
          display: grid;
          grid-template-columns: 240px 1fr;
        }
        :host([narrow]) .body {
          grid-template-columns: 1fr;
          overflow-y: auto;
          overscroll-behavior: contain;
        }
        .facets {
          border-right: 1px solid var(--hax-ui-line);
          overflow-y: auto;
          overscroll-behavior: contain;
          padding: var(--ddd-spacing-3, 12px) var(--ddd-spacing-4, 16px);
        }
        :host([narrow]) .facets {
          border-right: 0;
          border-bottom: 1px solid var(--hax-ui-line);
          overflow: visible;
        }
        .facets summary {
          display: none;
        }
        details.facets {
          max-width: none;
        }
        :host([narrow]) .facets summary {
          display: flex;
          align-items: center;
          min-height: 40px;
          padding: 0 var(--ddd-spacing-3, 12px);
          margin-bottom: var(--ddd-spacing-2, 8px);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          background-color: var(--hax-ui-background-color);
          color: var(--hax-ui-text);
          font-size: var(--hax-ui-admin-font-size);
          font-weight: var(--ddd-font-weight-bold, 700);
          filter: none;
        }
        :host([narrow]) details.facets summary:hover,
        :host([narrow]) details.facets summary:focus {
          background-color: var(--hax-ui-hover);
        }
        :host([narrow]) details.facets summary:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        :host([narrow]) details.facets summary::after {
          font-size: var(--hax-ui-admin-font-size);
        }
        fieldset {
          border: 0;
          margin: 0 0 var(--ddd-spacing-4, 16px);
          padding: 0;
        }
        legend {
          padding: 0;
          margin-bottom: var(--ddd-spacing-1, 4px);
          font-size: var(--hax-ui-admin-font-size-xs);
          font-weight: var(--ddd-font-weight-bold, 700);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--hax-ui-text-muted);
        }
        .facet {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2, 8px);
          min-height: 32px;
          cursor: pointer;
          color: var(--hax-ui-text);
        }
        .facet simple-fields-field {
          flex: 1 1 auto;
          min-width: 0;
          --simple-fields-font-family: var(--hax-ui-admin-font-family);
          --simple-fields-font-size: var(--hax-ui-admin-font-size);
          --simple-fields-color: var(--hax-ui-text);
          --simple-fields-accent-color: var(--hax-ui-accent-strong);
          --simple-fields-margin: 0;
          --simple-fields-margin-small: 0;
        }
        /* box first, then its words, like any filter list */
        .facet simple-fields-field::part(field-main) {
          flex-direction: row-reverse;
          justify-content: flex-end;
          gap: var(--ddd-spacing-2, 8px);
        }
        .facet simple-fields-field::part(label) {
          flex: 1 1 auto;
          max-width: none;
          margin: 0;
        }
        .facet simple-fields-field:focus-within {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
          border-radius: var(--hax-ui-radius);
        }
        .facet .n {
          flex: none;
          min-width: 3ch;
          text-align: end;
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }
        .facet.empty simple-fields-field {
          --simple-fields-color: var(--hax-ui-text-muted);
        }
        .results {
          overflow-y: auto;
          overscroll-behavior: contain;
          padding: var(--ddd-spacing-3, 12px) var(--ddd-spacing-5, 20px)
            var(--ddd-spacing-6, 24px);
        }
        :host([narrow]) .results {
          overflow: visible;
        }
        .status {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-2, 8px);
          margin-bottom: var(--ddd-spacing-3, 12px);
        }
        .status p {
          margin: 0;
          color: var(--hax-ui-text-muted);
        }
        .hint {
          margin: 0 0 var(--ddd-spacing-3, 12px);
          color: var(--hax-ui-text-muted);
          font-size: var(--hax-ui-admin-font-size-xs);
        }
        .chip,
        .clear {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-1, 4px);
          min-height: 28px;
          padding: 0 var(--ddd-spacing-2, 8px);
          border-radius: var(--hax-ui-radius-pill);
          font-size: var(--hax-ui-admin-font-size-xs);
        }
        .chip {
          border: 1px solid var(--hax-ui-line-strong);
          background: var(--hax-ui-selected);
          color: var(--hax-ui-text);
          --simple-icon-width: 14px;
          --simple-icon-height: 14px;
        }
        .clear {
          color: var(--hax-ui-text);
          text-decoration: underline;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(176px, 1fr));
          gap: var(--hax-ui-gap-lg);
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .grid li {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1, 4px);
          min-width: 0;
        }
        .grid app-hax-use-case {
          width: 100%;
          --app-hax-use-case-card-width: 100%;
        }
        :host([narrow]) .grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: var(--hax-ui-gap-md);
        }
        .meta {
          margin: 0;
          padding: 0 var(--ddd-spacing-1, 4px);
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
          line-height: 1.4;
        }
        .empty-state {
          margin: var(--ddd-spacing-8, 32px) 0;
          text-align: center;
          color: var(--hax-ui-text-muted);
        }
      `,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this._mq = globalThis.matchMedia("(max-width: 720px)");
    this._onMq = () => {
      this.narrow = this._mq.matches;
    };
    this._mq.addEventListener("change", this._onMq);
    this._onMq();
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has("open") && this.open) {
      this._labelDialog();
    }
  }

  // web-dialog draws its own role="alertdialog" box inside its shadow root;
  // it is a browsing dialog and needs a name screen readers announce
  _labelDialog() {
    const dialog =
      this.shadowRoot && this.shadowRoot.querySelector("web-dialog");
    if (!dialog || !dialog.shadowRoot) return;
    const box = dialog.shadowRoot.querySelector("#dialog");
    if (box) {
      box.setAttribute("role", "dialog");
      box.setAttribute("aria-label", this.t.browseTitle);
    }
  }

  disconnectedCallback() {
    if (this._mq) this._mq.removeEventListener("change", this._onMq);
    super.disconnectedCallback();
  }

  /** Open on a tab ("skeleton" for templates, "blank" for themes). */
  show(kind) {
    this.kind = kind || "skeleton";
    this.selected = {};
    this.search = "";
    this.open = true;
  }

  close() {
    this.open = false;
    this.dispatchEvent(
      new CustomEvent("design-browser-closed", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  _themeFor(item) {
    const od = item.originalData || {};
    const el = item.dataType === "blank" ? item.machineName : od.theme;
    return (
      this.items.find((i) => i.dataType === "blank" && i.machineName === el) ||
      null
    );
  }

  // the value(s) an item has for a facet, read from the theme and skeleton
  // listings; templates read layout and design system off their theme
  _values(item, key) {
    const od = item.originalData || {};
    if (key === "source") {
      // skeleton scopes: user = saved by you, config = installed for your
      // organization, core = shipped with HAX
      if (od.scope === "user") return [this.t.you];
      if (od.scope === "config") return [this.t.yours];
      return [this.t.hax];
    }
    if (key === "useCase") {
      return (Array.isArray(od.category) ? od.category : []).filter(
        (c) => SKIP_USE_CASES.indexOf(c) === -1,
      );
    }
    let src = od;
    if (item.dataType === "skeleton") {
      const th = this._themeFor(item);
      src = th && th.originalData ? th.originalData : {};
      if (!th) return [];
    }
    if (key === "designSystem") return [src.designSystem || "DDD"];
    return src[key] ? [src[key]] : [];
  }

  _matchesSearch(item) {
    const q = this.search.trim().toLowerCase();
    if (!q) return true;
    const od = item.originalData || {};
    const th = item.dataType === "skeleton" ? this._themeFor(item) : null;
    const hay = [
      item.useCaseTitle,
      item.useCaseDescription,
      ...(od.tags || []),
      th ? th.useCaseTitle : "",
      od.inspiredByTheme || "",
      ...FACETS[this.kind].flatMap((k) => this._values(item, k)),
    ]
      .join(" ")
      .toLowerCase();
    return q.split(/\s+/).every((w) => hay.indexOf(w) !== -1);
  }

  _matches(item, skipKey) {
    return Object.keys(this.selected).every((key) => {
      if (key === skipKey) return true;
      const picks = this.selected[key];
      if (!picks || picks.length === 0) return true;
      const vals = this._values(item, key);
      return picks.some((p) => vals.indexOf(p) !== -1);
    });
  }

  get _pool() {
    return this.items.filter((i) => i.dataType === this.kind);
  }

  _sorted(list) {
    const out = [...list];
    if (this.sort === "alpha")
      out.sort((a, b) => a.useCaseTitle.localeCompare(b.useCaseTitle));
    else if (this.sort === "pages")
      out.sort(
        (a, b) =>
          ((b.originalData || {}).pageCount || 1) -
          ((a.originalData || {}).pageCount || 1),
      );
    // "recommended" keeps the dashboard's own priority order
    return out;
  }

  // a checkbox reports its state, so set rather than flip: simple-fields
  // also reports the value it was rendered with
  _setPick(key, value, on) {
    const picks = this.selected[key] || [];
    const has = picks.indexOf(value) !== -1;
    if (on === has) return;
    this.selected = {
      ...this.selected,
      [key]: on ? [...picks, value] : picks.filter((p) => p !== value),
    };
  }

  _toggle(key, value) {
    const picks = [...(this.selected[key] || [])];
    const at = picks.indexOf(value);
    if (at === -1) picks.push(value);
    else picks.splice(at, 1);
    this.selected = { ...this.selected, [key]: picks };
  }

  _choose(item) {
    this.open = false;
    this.dispatchEvent(
      new CustomEvent("design-chosen", {
        bubbles: true,
        composed: true,
        detail: item,
      }),
    );
  }

  _meta(item) {
    const od = item.originalData || {};
    if (item.dataType === "skeleton") {
      const th = this._themeFor(item);
      const bits = [];
      if (th)
        bits.push(this.t.builtOn.replace("{theme}", () => th.useCaseTitle));
      if (typeof od.pageCount === "number") {
        bits.push(
          od.pageCount === 1
            ? this.t.page
            : this.t.pages.replace("{count}", () => od.pageCount),
        );
      }
      return bits.join(" · ");
    }
    const bits = [
      ...this._values(item, "layout"),
      ...this._values(item, "designSystem"),
    ];
    if (od.acceptsDesignSystems) bits.push(this.t.swappable);
    return bits.join(" · ");
  }

  renderFacets(pool) {
    return FACETS[this.kind].map((key) => {
      const values = new Map();
      pool.forEach((item) =>
        this._values(item, key).forEach((v) => values.set(v, 0)),
      );
      // counts honor every other group's picks, so a zero means "would empty the list"
      pool
        .filter((i) => this._matchesSearch(i) && this._matches(i, key))
        .forEach((item) =>
          this._values(item, key).forEach((v) =>
            values.set(v, values.get(v) + 1),
          ),
        );
      if (values.size < 2) return "";
      const picks = this.selected[key] || [];
      return html`
        <fieldset>
          <legend>${this.t[key]}</legend>
          ${[...values.entries()]
            .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
            .map(
              ([v, n]) => html`
                <div
                  class="facet ${n === 0 && picks.indexOf(v) === -1 ? "empty" : ""}"
                >
                  <simple-fields-field
                    type="checkbox"
                    label="${v}"
                    .value=${picks.indexOf(v) !== -1}
                    @value-changed=${(e) =>
                      this._setPick(key, v, e.detail.value === true)}
                  ></simple-fields-field>
                  <span class="n" aria-hidden="true">${n}</span>
                </div>
              `,
            )}
        </fieldset>
      `;
    });
  }

  render() {
    const pool = this._pool;
    const shown = this._sorted(
      pool.filter((i) => this._matchesSearch(i) && this._matches(i)),
    );
    const skCount = this.items.filter((i) => i.dataType === "skeleton").length;
    const thCount = this.items.filter((i) => i.dataType === "blank").length;
    const chips = Object.keys(this.selected).flatMap((k) =>
      (this.selected[k] || []).map((v) => [k, v]),
    );
    return html`
      <web-dialog
        .open=${this.open}
        center
        role="dialog"
        aria-label="${this.t.browseTitle}"
        @close=${() => {
          this.open = false;
        }}
      >
        <div class="hax-ui-dialog-titlebar">
          <h2 class="hax-ui-dialog-title">${this.t.browseTitle}</h2>
          <button
            class="hax-ui-dialog-close"
            aria-label="${this.t.close}"
            @click=${this.close}
          >
            <simple-icon-lite icon="icons:close"></simple-icon-lite>
          </button>
        </div>
        <div class="toolbar">
          <div class="tabs" role="tablist" aria-label="${this.t.browseTitle}">
            <button
              role="tab"
              aria-selected="${this.kind === "skeleton"}"
              @click=${() => {
                this.kind = "skeleton";
                this.selected = {};
              }}
            >
              ${this.t.templates} <span class="count">${skCount}</span>
            </button>
            <button
              role="tab"
              aria-selected="${this.kind === "blank"}"
              @click=${() => {
                this.kind = "blank";
                this.selected = {};
              }}
            >
              ${this.t.themes} <span class="count">${thCount}</span>
            </button>
          </div>
          <simple-fields-field
            class="hax-ui-simple-field compact search"
            type="search"
            label="${this.t.search}"
            placeholder="${
              this.kind === "skeleton"
                ? this.t.searchTemplates
                : this.t.searchThemes
            }"
            .value=${this.search}
            @value-changed=${(e) => {
              this.search = e.detail.value || "";
            }}
          ></simple-fields-field>
          <div class="sort">
            <span aria-hidden="true">${this.t.sortBy}</span>
            <simple-fields-field
              class="hax-ui-simple-field compact"
              type="select"
              label="${this.t.sortBy}"
              .value=${this.sort}
              .itemsList=${[
                { value: "recommended", text: this.t.recommended },
                { value: "alpha", text: this.t.alphabetical },
                ...(this.kind === "skeleton"
                  ? [{ value: "pages", text: this.t.mostPages }]
                  : []),
              ]}
              @value-changed=${(e) => {
                if (e.detail.value) this.sort = e.detail.value;
              }}
            ></simple-fields-field>
          </div>
        </div>
        <div class="body">
          <details class="facets" ?open=${!this.narrow}>
            <summary>
              ${this.t.filters}${chips.length ? ` (${chips.length})` : ""}
            </summary>
            ${this.renderFacets(pool)}
          </details>
          <div class="results" role="tabpanel">
            <p class="hint">
              ${this.kind === "skeleton" ? this.t.templatesHint : this.t.themesHint}
            </p>
            <div class="status">
              <p role="status">
                ${this.t.showing.replace("{count}", () => shown.length).replace("{total}", () => pool.length)}
              </p>
              ${chips.map(
                ([k, v]) =>
                  html` <button
                    class="chip"
                    aria-label="${this.t.removeFilter.replace("{value}", () => v)}"
                    @click=${() => this._toggle(k, v)}
                  >
                    ${v}
                    <simple-icon-lite icon="icons:close"></simple-icon-lite>
                  </button>`,
              )}
              ${
                chips.length || this.search
                  ? html`<button
                      class="clear"
                      @click=${() => {
                        this.selected = {};
                        this.search = "";
                      }}
                    >
                      ${this.t.clearAll}
                    </button>`
                  : ""
              }
            </div>
            ${
              shown.length
                ? html`<ul class="grid">
                    ${shown.map(
                      (item) =>
                        html` <li>
                          <app-hax-use-case
                            .source=${item.useCaseImage || ""}
                            .title=${item.useCaseTitle || ""}
                            .description=${item.useCaseDescription || ""}
                            .demoLink=${item.demoLink || ""}
                            .iconImage=${item.useCaseIcon || []}
                            @click=${() => this._choose(item)}
                          ></app-hax-use-case>
                          <p class="meta">${this._meta(item)}</p>
                        </li>`,
                    )}
                  </ul>`
                : html`<p class="empty-state" role="status">
                    ${this.t.noMatches}
                  </p>`
            }
          </div>
        </div>
      </web-dialog>
    `;
  }
}
customElements.define(AppHaxDesignBrowser.tag, AppHaxDesignBrowser);

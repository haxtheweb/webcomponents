/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import { store } from "../haxcms-site-store.js";
import { toJS } from "mobx";
import { InsightsStyles } from "./insights-styles.js";
import { INSIGHTS_SECTIONS } from "./insights-analyzer.js";
import { loadInsights } from "./insights-loader.js";
import { buildSectionCsv } from "./insights-csv.js";

/**
 * Screens, one element each, loaded when first shown. Each takes
 * `results` (the whole results object), `section` data via `results[id]`,
 * `density`, and fires `insights-open-page` with `{ slug }` to visit a page.
 */
const SECTION_SCREENS = {
  overview: () => import("./sections/insights-overview.js"),
  accessibility: () => import("./sections/insights-accessibility.js"),
  content: () => import("./sections/insights-content.js"),
  links: () => import("./sections/insights-links.js"),
  media: () => import("./sections/insights-media.js"),
  instructional: () => import("./sections/insights-instructional.js"),
  freshness: () => import("./sections/insights-freshness.js"),
  metadata: () => import("./sections/insights-metadata.js"),
  components: () => import("./sections/insights-components.js"),
};

const DENSITY_KEY = "haxcms-site-reports-density";
const DENSITIES = ["compact", "default", "roomy"];

/**
 * The last scan, kept for the page's life so moving between the nine
 * screens (each its own route, so a fresh element) does not rescan. Keyed
 * by scope; Rescan replaces it. Results are never saved anywhere else.
 */
const scanCache = { key: "", results: null, at: 0, promise: null };

/**
 * `haxcms-site-reports`
 * The Reports section of the one admin dialog (haxcms-site-admin): runs the
 * Insights analyzer in the browser over the site's pages and shows one of
 * its nine screens. The dialog's rail lists the screens (each a route); this
 * element draws the controls bar (scope, Rescan, Export CSV, density), the
 * screen, and a status line. Feeds the rail its counts through
 * `haxcms-admin-section-state` `railBadges`.
 * See haxtheweb/issues#3180.
 *
 * @element haxcms-site-reports
 */
class HAXCMSSiteReports extends I18NMixin(LitElement) {
  static get tag() {
    return "haxcms-site-reports";
  }

  static get properties() {
    return {
      /** which screen: one of INSIGHTS_SECTIONS */
      section: { type: String, reflect: true },
      /** a page id to limit the scan to that page and below; "" = site */
      selectedReportId: { type: String, attribute: "selected-report-id" },
      density: { type: String, reflect: true },
      inShell: { type: Boolean, attribute: "in-shell" },
      _scope: { state: true },
      _results: { state: true },
      _status: { state: true },
      _progress: { state: true },
      _error: { state: true },
      _screenReady: { state: true },
    };
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      scope: "Scope",
      wholeSite: "Whole site",
      thisPageAndBelow: "This page and below",
      rescan: "Rescan",
      exportCsv: "Export CSV",
      density: "Row density",
      densityCompact: "Compact",
      densityDefault: "Comfortable",
      densityRoomy: "Roomy",
      scanning: "Scanning {done} of {total}…",
      loadingRules: "Loading rules…",
      scanned:
        "Scanned {pages} pages in your browser {when} · results are not saved",
      justNow: "just now",
      minutesAgo: "{n} min ago",
      scanFailed: "The scan did not finish.",
      tryAgain: "Try again",
      noScreen: "This screen is not available yet.",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../../locales/", import.meta.url).href,
    });
    this.section = "overview";
    this.selectedReportId = "";
    this.inShell = false;
    this.density = "default";
    try {
      const saved = globalThis.localStorage.getItem(DENSITY_KEY);
      if (DENSITIES.indexOf(saved) !== -1) {
        this.density = saved;
      }
    } catch {
      // storage blocked: the default density is fine
    }
    this._scope = "site";
    this._results = null;
    this._status = "idle";
    this._progress = null;
    this._error = "";
    this._screenReady = false;
    this.__abort = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._scope = this.selectedReportId ? "branch" : "site";
    this._scan(false);
  }

  disconnectedCallback() {
    // keep a scan in flight running: the next screen picks it up
    super.disconnectedCallback();
  }

  willUpdate(changed) {
    if (changed.has("section")) {
      this._loadScreen();
    }
  }

  async _loadScreen() {
    this._screenReady = false;
    const id =
      INSIGHTS_SECTIONS.indexOf(this.section) !== -1
        ? this.section
        : "overview";
    const load = SECTION_SCREENS[id];
    try {
      await load();
      this._screenReady = true;
    } catch {
      this._screenReady = false;
      this._error = this.t.noScreen;
    }
  }

  _cacheKey() {
    return this._scope === "branch"
      ? `branch:${this.selectedReportId}`
      : "site";
  }

  async _scan(force) {
    const key = this._cacheKey();
    if (!force && scanCache.key === key && scanCache.results) {
      this._results = scanCache.results;
      this._status = "ready";
      this._emitState();
      return;
    }
    if (!force && scanCache.key === key && scanCache.promise) {
      this._status = "loading";
      try {
        this._results = await scanCache.promise;
        this._status = "ready";
      } catch (e) {
        this._fail(e);
      }
      this._emitState();
      return;
    }
    this._status = "loading";
    this._error = "";
    this._progress = { phase: "spec", done: 0, total: 1 };
    if (this.__abort) {
      this.__abort.abort();
    }
    this.__abort = new AbortController();
    const manifest = toJS(store.manifest);
    const promise = loadInsights({
      scope: this._scope,
      rootId: this._scope === "branch" ? this.selectedReportId : null,
      manifest: manifest,
      signal: this.__abort.signal,
      onProgress: (p) => {
        if (this.isConnected) {
          this._progress = p;
        }
      },
    });
    scanCache.key = key;
    scanCache.results = null;
    scanCache.promise = promise;
    try {
      const results = await promise;
      scanCache.results = results;
      scanCache.at = Date.now();
      scanCache.promise = null;
      this._results = results;
      this._status = "ready";
    } catch (e) {
      scanCache.promise = null;
      scanCache.key = "";
      if (e && e.name === "AbortError") {
        return;
      }
      this._fail(e);
    }
    this._emitState();
  }

  _fail(e) {
    this._status = "error";
    this._error = e && e.message ? e.message : this.t.scanFailed;
  }

  /** counts for the dialog's rail, from results.nav */
  _emitState() {
    const nav = this._results && this._results.nav ? this._results.nav : {};
    const railBadges = {};
    INSIGHTS_SECTIONS.forEach((id) => {
      const route = id === "overview" ? "reports" : `reports-${id}`;
      const entry = nav[id] || {};
      railBadges[route] = {
        badge:
          entry.badge === undefined || entry.badge === null
            ? null
            : entry.badge,
        tone: entry.tone || "",
      };
    });
    this.dispatchEvent(
      new CustomEvent("haxcms-admin-section-state", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: { railBadges: railBadges },
      }),
    );
  }

  _setScope(e) {
    const value = e && e.target ? e.target.value : "site";
    if (value === "branch" && !this.selectedReportId) {
      const active = toJS(store.activeItem);
      this.selectedReportId = active && active.id ? `${active.id}` : "";
    }
    this._scope =
      value === "branch" && this.selectedReportId ? "branch" : "site";
    this._scan(false);
  }

  _setDensity(d) {
    this.density = d;
    try {
      globalThis.localStorage.setItem(DENSITY_KEY, d);
    } catch {
      // storage blocked: density lasts until the dialog closes
    }
  }

  _exportCsv() {
    if (!this._results) {
      return;
    }
    const csv = buildSectionCsv(this.section, this._results);
    if (!csv) {
      return;
    }
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const link = globalThis.document.createElement("a");
    link.href = globalThis.URL.createObjectURL(blob);
    link.download = `insights-${this.section}.csv`;
    globalThis.document.body.appendChild(link);
    link.click();
    globalThis.document.body.removeChild(link);
    globalThis.URL.revokeObjectURL(link.href);
  }

  /** a screen asked to visit a page: close the dialog and go there */
  _openPage(e) {
    const slug = e && e.detail ? e.detail.slug : "";
    if (!slug) {
      return;
    }
    globalThis.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        cancelable: true,
        detail: {},
      }),
    );
    setTimeout(() => {
      globalThis.history.pushState({}, null, slug);
      globalThis.dispatchEvent(new PopStateEvent("popstate"));
    }, 0);
  }

  _statusText() {
    if (this._status === "loading") {
      const p = this._progress || {};
      if (p.phase === "spec" || !p.total) {
        return this.t.loadingRules;
      }
      return this.t.scanning
        .replace("{done}", () => p.done || 0)
        .replace("{total}", () => p.total);
    }
    if (this._status === "error") {
      return this._error || this.t.scanFailed;
    }
    if (this._results) {
      const mins = Math.floor(
        (Date.now() - (scanCache.at || Date.now())) / 60000,
      );
      const when =
        mins < 1
          ? this.t.justNow
          : this.t.minutesAgo.replace("{n}", () => mins);
      const pages =
        this._results.totals && this._results.totals.pages
          ? this._results.totals.pages
          : 0;
      return this.t.scanned
        .replace("{pages}", () => pages)
        .replace("{when}", () => when);
    }
    return "";
  }

  static get styles() {
    return [
      ...InsightsStyles,
      css`
        :host {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 0;
        }
        .ctl {
          flex: none;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          padding: var(--hax-ui-gap-md) var(--ddd-spacing-5, 20px);
          border-bottom: 1px solid var(--hax-ui-line);
          position: sticky;
          top: 0;
          z-index: 2;
          background-color: var(--hax-ui-surface);
        }
        .ctl label {
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }
        .ctl select {
          height: var(--hax-ui-row-height);
          padding: 0 var(--hax-ui-gap-md);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          background-color: var(--hax-ui-surface);
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
          font-size: var(--hax-ui-admin-font-size-xs);
          white-space: nowrap;
        }
        .btn:hover {
          background-color: var(--hax-ui-hover);
        }
        .btn[disabled] {
          cursor: default;
          color: var(--hax-ui-text-muted);
        }
        .grow {
          flex: 1;
        }
        .density {
          display: inline-flex;
          height: var(--hax-ui-row-height);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          overflow: hidden;
        }
        .density button {
          all: unset;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          padding: 0 var(--hax-ui-gap-md);
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }
        .density button + button {
          border-left: 1px solid var(--hax-ui-line-strong);
        }
        .density button[aria-pressed="true"] {
          background-color: var(--hax-ui-accent-soft);
          color: var(--hax-ui-text);
          font-weight: var(--ddd-font-weight-medium, 500);
        }
        .density button:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: calc(-1 * var(--hax-ui-focus-width));
        }
        .screen {
          flex: 1;
          min-height: 0;
          overflow: auto;
          padding: var(--ddd-spacing-4, 16px) var(--ddd-spacing-5, 20px);
        }
        .ftr {
          flex: none;
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-lg);
          min-height: 40px;
          padding: 0 var(--ddd-spacing-5, 20px);
          border-top: 1px solid var(--hax-ui-line);
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }
        .ftr.error {
          color: var(--hax-ui-danger);
        }
        .loading {
          display: flex;
          flex-direction: column;
          gap: var(--hax-ui-gap-md);
          max-width: 420px;
          margin: var(--ddd-spacing-8, 32px) auto;
          text-align: center;
          color: var(--hax-ui-text-muted);
        }
        progress {
          width: 100%;
          accent-color: var(--hax-ui-accent);
        }
      `,
    ];
  }

  render() {
    const busy = this._status === "loading";
    return html`
      <div class="ctl" role="toolbar" aria-label="${this.t.scope}">
        <label for="scope">${this.t.scope}</label>
        <select id="scope" .value="${this._scope}" @change="${this._setScope}">
          <option value="site" ?selected="${this._scope === "site"}">
            ${this.t.wholeSite}
          </option>
          <option value="branch" ?selected="${this._scope === "branch"}">
            ${this.t.thisPageAndBelow}
          </option>
        </select>
        <button
          type="button"
          class="btn rescan"
          ?disabled="${busy}"
          @click="${() => this._scan(true)}"
        >
          <simple-icon-lite
            icon="icons:refresh"
            aria-hidden="true"
          ></simple-icon-lite>
          ${this.t.rescan}
        </button>
        <button
          type="button"
          class="btn export"
          ?disabled="${!this._results}"
          @click="${this._exportCsv}"
        >
          <simple-icon-lite
            icon="icons:file-download"
            aria-hidden="true"
          ></simple-icon-lite>
          ${this.t.exportCsv}
        </button>
        <span class="grow"></span>
        <div class="density" role="group" aria-label="${this.t.density}">
          ${DENSITIES.map(
            (d) =>
              html`<button
                type="button"
                data-density="${d}"
                aria-pressed="${this.density === d ? "true" : "false"}"
                @click="${() => this._setDensity(d)}"
              >
                ${d === "compact"
                  ? this.t.densityCompact
                  : d === "roomy"
                    ? this.t.densityRoomy
                    : this.t.densityDefault}
              </button>`,
          )}
        </div>
      </div>
      <div class="screen" @insights-open-page="${this._openPage}">
        ${this._renderScreen()}
      </div>
      <div
        class="ftr ${this._status === "error" ? "error" : ""}"
        role="${this._status === "error" ? "alert" : "status"}"
        aria-live="polite"
      >
        <span>${this._statusText()}</span>
        ${this._status === "error"
          ? html`<button
              type="button"
              class="btn"
              @click="${() => this._scan(true)}"
            >
              ${this.t.tryAgain}
            </button>`
          : nothing}
      </div>
    `;
  }

  _renderScreen() {
    if (
      this._status === "loading" ||
      (!this._results && this._status !== "error")
    ) {
      const p = this._progress || {};
      return html`<div class="loading">
        <span>${this._statusText()}</span>
        <progress
          max="${p.total || 1}"
          value="${p.total ? p.done || 0 : 0}"
        ></progress>
      </div>`;
    }
    if (!this._results || !this._screenReady) {
      return nothing;
    }
    const id =
      INSIGHTS_SECTIONS.indexOf(this.section) !== -1
        ? this.section
        : "overview";
    switch (id) {
      case "accessibility":
        return html`<insights-accessibility
          .results="${this._results}"
          density="${this.density}"
        ></insights-accessibility>`;
      case "content":
        return html`<insights-content
          .results="${this._results}"
          density="${this.density}"
        ></insights-content>`;
      case "links":
        return html`<insights-links
          .results="${this._results}"
          density="${this.density}"
        ></insights-links>`;
      case "media":
        return html`<insights-media
          .results="${this._results}"
          density="${this.density}"
        ></insights-media>`;
      case "instructional":
        return html`<insights-instructional
          .results="${this._results}"
          density="${this.density}"
        ></insights-instructional>`;
      case "freshness":
        return html`<insights-freshness
          .results="${this._results}"
          density="${this.density}"
        ></insights-freshness>`;
      case "metadata":
        return html`<insights-metadata
          .results="${this._results}"
          density="${this.density}"
        ></insights-metadata>`;
      case "components":
        return html`<insights-components
          .results="${this._results}"
          density="${this.density}"
        ></insights-components>`;
      default:
        return html`<insights-overview
          .results="${this._results}"
          density="${this.density}"
        ></insights-overview>`;
    }
  }
}

globalThis.customElements.define(HAXCMSSiteReports.tag, HAXCMSSiteReports);
export { HAXCMSSiteReports, scanCache as _insightsScanCache };

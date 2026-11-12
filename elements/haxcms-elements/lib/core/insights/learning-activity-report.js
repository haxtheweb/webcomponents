/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { toJS } from "mobx";
import { store } from "../haxcms-site-store.js";
import { HAXCMSI18NMixin } from "../utils/HAXCMSI18NMixin.js";
import {
  DDDBlockStyles,
  renderDDDBlockHeader,
} from "@haxtheweb/d-d-d/lib/DDDBlock.js";
import { DDDTableStyles } from "@haxtheweb/d-d-d/lib/DDDTable.js";
import { DDDChartStyles } from "@haxtheweb/d-d-d/lib/DDDChart.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import {
  LEARNING_ACTIVITY_GROUPS,
  scanLearningActivity,
  vocabularyMap,
} from "./learning-activity-scan.js";

/** pages the By page table lists before "Show all" */
export const PAGES_LIMIT = 10;

/**
 * What the By page table lists. By default only the pages with trackable
 * elements, in outline order, at most limit of them. The full list (all
 * pages with activities, plus the pages without when asked) is grouped by
 * top-level section in outline order.
 * @param {Object[]} rows summary rows in outline order ({ item, counts,
 *   section, sectionTitle })
 * @param {Object} [o] { limit, withNone }
 * @returns {{ shown: Object[], active: number, none: number,
 *   more: boolean, sections: Object[] }} sections: { id, title, rows,
 *   active, trackable }
 */
export function pageTableModel(rows, { limit = PAGES_LIMIT, withNone } = {}) {
  const list = Array.isArray(rows) ? rows : [];
  const active = list.filter((r) => r.counts.total > 0);
  const sections = new Map();
  list.forEach((r) => {
    if (r.counts.total === 0 && !withNone) {
      return;
    }
    const id = r.section || r.item.id;
    if (!sections.has(id)) {
      sections.set(id, {
        id,
        title: r.sectionTitle || r.item.title || "",
        rows: [],
        active: 0,
        trackable: 0,
      });
    }
    const sec = sections.get(id);
    sec.rows.push(r);
    sec.active += r.counts.total > 0 ? 1 : 0;
    sec.trackable += r.counts.total;
  });
  return {
    shown: active.slice(0, limit),
    active: active.length,
    none: list.length - active.length,
    more: active.length > limit,
    sections: Array.from(sections.values()),
  };
}

/**
 * Human name of an element: its HAX gizmo title when HAX has loaded the
 * element, else the tag.
 * @param {string} tag
 */
export function elementTitle(tag) {
  try {
    const hs = globalThis.HaxStore ? globalThis.HaxStore.instance : null;
    const gizmos = hs && hs.gizmoList ? toJS(hs.gizmoList) : [];
    if (Array.isArray(gizmos)) {
      const g = gizmos.find((item) => item && item.tag === tag && item.title);
      if (g) {
        return String(g.title);
      }
    }
    const ce = globalThis.customElements
      ? globalThis.customElements.get(tag)
      : null;
    const hp = ce ? ce.haxProperties : null;
    if (hp && typeof hp === "object" && hp.gizmo && hp.gizmo.title) {
      return String(hp.gizmo.title);
    }
  } catch {
    // fall back to the tag
  }
  return tag;
}

/**
 * `haxcms-learning-activity-report`
 * The Learning activity report of site Insights: what on the selected pages
 * can send learner statements (xAPI), counted from page content against the
 * generated xAPI vocabulary. Works with no learner data; learner results
 * stay an empty state until a server or LRS adapter exists.
 *
 * Self-contained so it can move into a plugin: give it `root-id` (a page id,
 * "" for the whole site) and it scans; call refresh() to scan again.
 * Fires `learning-activity-scanned` with { summary } after each scan.
 *
 * @element haxcms-learning-activity-report
 */
class HAXCMSLearningActivityReport extends HAXCMSI18NMixin(LitElement) {
  static get tag() {
    return "haxcms-learning-activity-report";
  }

  static get properties() {
    return {
      ...super.properties,
      /** page id to report on (that page and below); "" = whole site */
      rootId: { type: String, attribute: "root-id" },
      /** override for page HTML requests (tests); default siteApiFetch */
      fetchImpl: { attribute: false },
      /** override for site.json (tests); default the site store's */
      manifest: { attribute: false },
      /** override for the site root URL (tests); default <base href> */
      baseUrl: { type: String, attribute: "base-url" },
      _summary: { state: true },
      _loading: { state: true },
      _error: { state: true },
      _vocabularyOpen: { state: true },
      _allPages: { state: true },
      _withNone: { state: true },
    };
  }

  constructor() {
    super();
    this.rootId = "";
    this.fetchImpl = null;
    this.manifest = null;
    this.baseUrl = "";
    this._summary = null;
    this._loading = false;
    this._error = "";
    this._vocabularyOpen = false;
    this._allPages = false;
    this._withNone = false;
    this.__scanKey = null;
    this.__scan = null;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      learningActivity: "Learning activity",
      laBlockLabel: "Insights · Learning activity",
      laVocabulary: "Vocabulary",
      laVocabularyTitle: "Trackable element vocabulary",
      laVocabularyIntro:
        "Elements that can send learner statements (xAPI), from the generated vocabulary.",
      laVerbs: "Verbs",
      laResultFields: "Result fields",
      laCountsAsDone: "Counts as done",
      laCountsTowardCompletion: "Counts toward page completion",
      laYes: "Yes",
      laNo: "No",
      laNone: "none",
      laTrackableElements: "Trackable elements",
      laAcrossPages: "across {pages} pages",
      laCountTowardCompletion: "{count} count toward completion",
      laPagesWithActivities: "Pages with activities",
      laPagesHaveNone: "{count} have none",
      laElementTypes: "Element types",
      laThatSendStatements: "that send statements",
      laLearnerCompletion: "Learner completion",
      laNeedsAdapter: "needs a server or LRS adapter",
      laByType: "Trackable elements by type",
      laByPage: "By page",
      laPage: "Page",
      laTrackable: "Trackable",
      laQuestions: "Questions",
      laMedia: "Media",
      laChecklists: "Checklists",
      laGames: "Games",
      laOther: "Other",
      laNotTracked: "0 — not tracked",
      laNothingTrackable: "Nothing on these pages can send learner statements.",
      laLearnerResults: "Learner results",
      laLearnerResultsLater:
        "With a HAXcms server or LRS adapter (later): completion per page, first-try accuracy per question, drop-off points. Nothing about individual learners is shown from data on this device.",
      laScanning: "Scanning pages…",
      laScanFailed: "Could not read the pages ({message})",
      laShowAllPages: "Show all {count} pages with activities",
      laShowFewerPages: "Show fewer pages",
      laPagesWithoutLine: "{count} pages have none",
      laOnePageWithout: "1 page has none",
      laShowPagesWithout: "Show pages without activities",
      laHidePagesWithout: "Hide pages without activities",
      laSectionCounts: "{pages} with activities · {count} trackable",
    };
  }

  static get styles() {
    return [
      DDDBlockStyles,
      DDDTableStyles,
      DDDChartStyles,
      css`
        :host {
          display: block;
          container: la-report / inline-size;
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          font-family: var(--ddd-font-primary);
          --la-line: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          --la-muted: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
          --la-strong: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
          --la-track: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-coalyGray)
          );
          --la-link: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-linkLight)
          );
        }
        .ddd-block {
          --ddd-block-background: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        .body {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-4);
          padding: var(--ddd-spacing-4);
        }
        .panel {
          border: var(--ddd-border-xs);
          border-color: var(--la-line);
          border-radius: var(--ddd-radius-md);
          padding: var(--ddd-spacing-3);
          min-width: 0;
        }
        h3 {
          margin: 0 0 var(--ddd-spacing-2) 0;
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          color: var(--la-strong);
        }
        .status {
          margin: 0;
          font-size: var(--ddd-font-size-5xs);
          color: var(--la-muted);
        }
        .kpis {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: var(--ddd-spacing-3);
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .kpis li {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1);
          border: var(--ddd-border-xs);
          border-color: var(--la-line);
          border-radius: var(--ddd-radius-md);
          padding: var(--ddd-spacing-3);
          min-width: 0;
        }
        .kpi-label {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-6xs);
          font-weight: var(--ddd-font-weight-medium);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--la-muted);
        }
        .kpi-value {
          font-size: var(--ddd-font-size-ms);
          font-weight: var(--ddd-font-weight-bold);
          line-height: var(--ddd-lh-120);
          font-variant-numeric: tabular-nums;
          color: var(--la-strong);
        }
        .kpi-note {
          font-size: var(--ddd-font-size-6xs);
          color: var(--la-muted);
        }
        .columns {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
          gap: var(--ddd-spacing-4);
          align-items: start;
        }
        .bars {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-2);
          margin: 0;
          padding: 0;
          list-style: none;
          font-size: var(--ddd-font-size-6xs);
        }
        .bars li {
          display: grid;
          grid-template-columns: minmax(0, 11em) minmax(0, 1fr) 3em;
          gap: var(--ddd-spacing-2);
          align-items: center;
        }
        .bar-name {
          overflow-wrap: anywhere;
        }
        .bar-track {
          display: block;
          height: var(--ddd-spacing-3);
          border-radius: var(--ddd-radius-xs);
          background-color: var(--la-track);
          overflow: hidden;
        }
        .bar-fill {
          display: block;
          height: 100%;
          background-color: var(--ddd-chart-1);
        }
        [data-group="media"] .bar-fill,
        .legend [data-group="media"]::before {
          background-color: var(--ddd-chart-2);
        }
        [data-group="checklists"] .bar-fill,
        .legend [data-group="checklists"]::before {
          background-color: var(--ddd-chart-3);
        }
        [data-group="games"] .bar-fill,
        .legend [data-group="games"]::before {
          background-color: var(--ddd-chart-4);
        }
        [data-group="other"] .bar-fill,
        .legend [data-group="other"]::before {
          background-color: var(--ddd-chart-8);
        }
        .bar-count {
          text-align: end;
          font-variant-numeric: tabular-nums;
        }
        .legend {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-1) var(--ddd-spacing-3);
          margin: 0 0 var(--ddd-spacing-2) 0;
          padding: 0;
          list-style: none;
          font-size: var(--ddd-font-size-6xs);
          color: var(--la-muted);
        }
        .legend li {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
        }
        .legend li::before {
          content: "";
          width: var(--ddd-spacing-2);
          height: var(--ddd-spacing-2);
          border-radius: var(--ddd-radius-xs);
          background-color: var(--ddd-chart-1);
        }
        .table-scroll {
          overflow-x: auto;
        }
        .ddd-table {
          --ddd-table-font-size: var(--ddd-font-size-6xs);
          min-width: 32em;
        }
        .ddd-table a {
          color: var(--la-link);
          font-weight: var(--ddd-font-weight-bold);
          text-decoration: none;
        }
        .ddd-table a:hover,
        .ddd-table a:focus-visible {
          text-decoration: underline;
        }
        .ddd-table a:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .sr-only {
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
        .sections {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1);
        }
        .section summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-2) 0;
          border-bottom: var(--ddd-border-xs);
          border-color: var(--la-line);
          font-size: var(--ddd-font-size-5xs);
          font-weight: var(--ddd-font-weight-bold);
          color: var(--la-strong);
          cursor: pointer;
        }
        .section summary .name {
          flex: 1 1 auto;
          min-width: 0;
          overflow-wrap: anywhere;
        }
        .section summary .count {
          flex: none;
          font-size: var(--ddd-font-size-6xs);
          font-weight: var(--ddd-font-weight-regular);
          color: var(--la-muted);
        }
        .section .table-scroll {
          padding: var(--ddd-spacing-2) 0 var(--ddd-spacing-3) 0;
        }
        button.more {
          margin: var(--ddd-spacing-2) 0 0 0;
          padding: 0;
          border: 0;
          background: transparent;
          color: var(--la-link);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-6xs);
          font-weight: var(--ddd-font-weight-bold);
          cursor: pointer;
        }
        button.more:hover {
          text-decoration: underline;
        }
        button.more:focus-visible,
        .section summary:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .none-line {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: var(--ddd-spacing-1) var(--ddd-spacing-3);
          margin: var(--ddd-spacing-2) 0 0 0;
          font-size: var(--ddd-font-size-6xs);
          color: var(--la-muted);
        }
        .none-line button.more {
          margin: 0;
        }
        .not-tracked {
          color: var(--la-muted);
        }
        .empty-state {
          border: var(--ddd-border-xs);
          border-style: dashed;
          border-color: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-slateGray)
          );
          border-radius: var(--ddd-radius-md);
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
          font-size: var(--ddd-font-size-5xs);
          color: var(--la-muted);
        }
        .empty-state h3 {
          margin-bottom: var(--ddd-spacing-1);
        }
        .empty-state p {
          margin: 0;
        }
        .vocabulary {
          font-size: var(--ddd-font-size-6xs);
        }
        .vocabulary > p {
          margin: 0 0 var(--ddd-spacing-2) 0;
          color: var(--la-muted);
        }
        .vocabulary ul {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(18em, 1fr));
          gap: var(--ddd-spacing-3);
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .vocabulary li {
          border-top: var(--ddd-border-xs);
          border-color: var(--la-line);
          padding-top: var(--ddd-spacing-2);
        }
        .vocabulary h4 {
          margin: 0;
          font-size: var(--ddd-font-size-5xs);
          color: var(--la-strong);
        }
        .vocabulary code {
          display: block;
          font-family: var(--ddd-font-mono);
          font-weight: var(--ddd-font-weight-regular);
          color: var(--la-muted);
        }
        .vocabulary dl {
          margin: var(--ddd-spacing-1) 0 0 0;
        }
        .vocabulary dt {
          margin-top: var(--ddd-spacing-1);
          font-family: var(--ddd-font-navigation);
          font-weight: var(--ddd-font-weight-medium);
          color: var(--la-muted);
        }
        .vocabulary dd {
          margin: 0;
          overflow-wrap: break-word;
        }
        @container la-report (max-width: 900px) {
          .columns {
            grid-template-columns: minmax(0, 1fr);
          }
        }
        @container la-report (max-width: 600px) {
          .kpis {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .ddd-block-action.has-text {
            padding-inline: 0;
          }
          .ddd-block-action.has-text .action-text {
            position: absolute;
            width: 1px;
            height: 1px;
            margin: -1px;
            overflow: hidden;
            clip: rect(0 0 0 0);
            white-space: nowrap;
          }
          .body {
            padding: var(--ddd-spacing-3);
          }
        }
      `,
    ];
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // after this update, so the scan state change is its own update
    Promise.resolve().then(() => this.refresh(false));
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (
      this.hasUpdated &&
      changedProperties.has("rootId") &&
      changedProperties.get("rootId") !== undefined
    ) {
      this.refresh(false);
    }
  }

  /**
   * Scan the selected pages. Without force, a scan already running for the
   * same pages is reused.
   * @param {boolean} [force]
   */
  refresh(force = true) {
    const key = this.rootId || "";
    if (this.__scan && this.__scanKey === key && (!force || this._loading)) {
      return this.__scan;
    }
    this.__scanKey = key;
    this._loading = true;
    this._error = "";
    const scan = scanLearningActivity({
      rootId: key,
      manifest: this.manifest || undefined,
      fetchImpl: this.fetchImpl || undefined,
      baseUrl: this.baseUrl || undefined,
    })
      .then((summary) => {
        if (this.__scan !== scan) {
          return this._summary;
        }
        this._summary = summary;
        this._loading = false;
        this.dispatchEvent(
          new CustomEvent("learning-activity-scanned", {
            bubbles: true,
            composed: true,
            detail: { summary },
          }),
        );
        return summary;
      })
      .catch((e) => {
        if (this.__scan === scan) {
          this._loading = false;
          this._summary = null;
          this._error = e && e.message ? e.message : String(e);
        }
        return null;
      });
    this.__scan = scan;
    return scan;
  }

  _fmt(template, values) {
    let out = String(template);
    Object.keys(values).forEach((k) => {
      out = out.replace(`{${k}}`, () => String(values[k]));
    });
    return out;
  }

  _groupLabel(group) {
    const labels = {
      questions: this.t.laQuestions,
      media: this.t.laMedia,
      checklists: this.t.laChecklists,
      games: this.t.laGames,
      other: this.t.laOther,
    };
    return labels[group] || group;
  }

  _scopeTitle() {
    if (this.rootId) {
      const item = toJS(store.findItem(this.rootId));
      if (item && item.title) {
        return item.title;
      }
    }
    const m = this.manifest || toJS(store.manifest);
    return (m && m.title) || store.siteTitle || "";
  }

  // human name with the tag under it; just the tag when there is no name
  renderVocabularyName(tag) {
    const title = elementTitle(tag);
    if (title === tag) {
      return html`<code>${tag}</code>`;
    }
    return html`${title} <code>${tag}</code>`;
  }

  _list(values) {
    return values.length ? values.join(", ") : this.t.laNone;
  }

  _yesNo(value) {
    return value ? this.t.laYes : this.t.laNo;
  }

  _toggleVocabulary() {
    this._vocabularyOpen = !this._vocabularyOpen;
  }

  /**
   * A page link: ask the host to open the page (Reports closes the dialog
   * and routes there); with no host the link navigates as usual.
   */
  _pageLinkClicked(e) {
    const slug = e.currentTarget.getAttribute("data-slug") || "";
    const detail = { slug, handled: false };
    this.dispatchEvent(
      new CustomEvent("insights-open-page", {
        bubbles: true,
        composed: true,
        detail,
      }),
    );
    if (detail.handled) {
      e.preventDefault();
    }
  }

  render() {
    return html`<section class="ddd-block" aria-labelledby="la-header">
      ${renderDDDBlockHeader({
        id: "la-header",
        icon: "hax:graph",
        label: this.t.laBlockLabel,
        title: this._scopeTitle() || this.t.learningActivity,
        titleTag: "h2",
        actions: this.renderVocabularyAction(),
      })}
      <div class="ddd-block-body body">
        ${this.renderVocabulary()} ${this.renderStatus()}
        ${this.renderSummary(this._summary)}
        <div class="empty-state">
          <h3>${this.t.laLearnerResults}</h3>
          <p>${this.t.laLearnerResultsLater}</p>
        </div>
      </div>
    </section>`;
  }

  renderVocabularyAction() {
    const open = this._vocabularyOpen ? "true" : "false";
    return html`<button
      type="button"
      class="ddd-block-action has-text"
      aria-expanded="${open}"
      aria-controls="la-vocabulary"
      @click="${this._toggleVocabulary}"
    >
      <simple-icon-lite icon="av:library-books"></simple-icon-lite>
      <span class="action-text">${this.t.laVocabulary}</span>
    </button>`;
  }

  renderStatus() {
    if (this._loading) {
      return html`<p class="status" role="status">${this.t.laScanning}</p>`;
    }
    if (this._error) {
      const text = this._fmt(this.t.laScanFailed, { message: this._error });
      return html`<p class="status" role="alert">${text}</p>`;
    }
    return nothing;
  }

  renderSummary(s) {
    if (!s) {
      return nothing;
    }
    const across = this._fmt(this.t.laAcrossPages, { pages: s.pages });
    const toward = this._fmt(this.t.laCountTowardCompletion, {
      count: s.completion,
    });
    const none = this._fmt(this.t.laPagesHaveNone, {
      count: s.withoutActivities,
    });
    return html`
      <ul class="kpis">
        <li>
          <span class="kpi-label">${this.t.laTrackableElements}</span>
          <span class="kpi-value">${s.total}</span>
          <span class="kpi-note">${across}</span>
          <span class="kpi-note">${toward}</span>
        </li>
        <li>
          <span class="kpi-label">${this.t.laPagesWithActivities}</span>
          <span class="kpi-value">${s.withActivities} / ${s.pages}</span>
          <span class="kpi-note">${none}</span>
        </li>
        <li>
          <span class="kpi-label">${this.t.laElementTypes}</span>
          <span class="kpi-value">${s.types.length}</span>
          <span class="kpi-note">${this.t.laThatSendStatements}</span>
        </li>
        <li>
          <span class="kpi-label">${this.t.laLearnerCompletion}</span>
          <span class="kpi-value">—</span>
          <span class="kpi-note">${this.t.laNeedsAdapter}</span>
        </li>
      </ul>
      <div class="columns">${this.renderByType(s)} ${this.renderByPage(s)}</div>
    `;
  }

  renderByType(s) {
    return html`<div class="panel by-type">
      <h3 id="la-by-type">${this.t.laByType}</h3>
      ${this.renderBars(s)}
    </div>`;
  }

  renderBars(s) {
    if (s.types.length === 0) {
      return html`<p class="status">${this.t.laNothingTrackable}</p>`;
    }
    const max = s.types.reduce((m, t) => Math.max(m, t.count), 0);
    const present = LEARNING_ACTIVITY_GROUPS.filter((g) => s.groups.get(g) > 0);
    return html`
      <ul class="legend">
        ${present.map((g) => this.renderLegendItem(g))}
      </ul>
      <ol class="bars" aria-labelledby="la-by-type">
        ${s.types.map((type) => this.renderBar(type, max))}
      </ol>
    `;
  }

  renderLegendItem(group) {
    return html`<li data-group="${group}">${this._groupLabel(group)}</li>`;
  }

  renderBar(type, max) {
    const width = max ? Math.round((type.count / max) * 100) : 0;
    return html`<li data-group="${type.group}" data-tag="${type.tag}">
      <span class="bar-name"
        >${elementTitle(type.tag)}<span class="sr-only"
          >, ${this._groupLabel(type.group)}</span
        ></span
      >
      <span class="bar-track" aria-hidden="true"
        ><span
          class="bar-fill"
          style="${styleMap({ width: `${width}%` })}"
        ></span
      ></span>
      <span class="bar-count">${type.count}</span>
    </li>`;
  }

  renderByPage(s) {
    const full = this._allPages || this._withNone;
    const model = pageTableModel(s.rows, { withNone: this._withNone });
    let list;
    if (full) {
      list = html`<div class="sections" id="la-pages">
        ${model.sections.map((sec) => this.renderSection(sec))}
      </div>`;
    } else if (model.shown.length) {
      list = html`<div class="table-scroll" id="la-pages">
        ${this.renderPageTable(model.shown, "la-by-page")}
      </div>`;
    } else {
      list = html`<p class="status" id="la-pages">
        ${this.t.laNothingTrackable}
      </p>`;
    }
    return html`<div class="panel by-page">
      <h3 id="la-by-page">${this.t.laByPage}</h3>
      ${list} ${this.renderAllPagesToggle(model)} ${this.renderNoneLine(model)}
    </div>`;
  }

  renderPageTable(rows, labelledBy) {
    return html`<table class="ddd-table" aria-labelledby="${labelledBy}">
      <thead>
        <tr>
          <th scope="col">${this.t.laPage}</th>
          <th scope="col" class="num">${this.t.laTrackable}</th>
          ${LEARNING_ACTIVITY_GROUPS.map((g) => this.renderGroupHeader(g))}
        </tr>
      </thead>
      <tbody>
        ${rows.map((row) => this.renderPageRow(row))}
      </tbody>
    </table>`;
  }

  // one top-level section of the full list; open when it has activities
  renderSection(sec) {
    const counts = this._fmt(this.t.laSectionCounts, {
      pages: sec.active,
      count: sec.trackable,
    });
    const id = `la-section-${sec.id}`;
    return html`<details
      class="section"
      data-section="${sec.id}"
      ?open="${sec.active > 0}"
    >
      <summary>
        <span class="name" id="${id}">${sec.title}</span>
        <span class="count">${counts}</span>
      </summary>
      <div class="table-scroll">${this.renderPageTable(sec.rows, id)}</div>
    </details>`;
  }

  renderAllPagesToggle(model) {
    if (!model.more && !this._allPages) {
      return nothing;
    }
    const text = this._allPages
      ? this.t.laShowFewerPages
      : this._fmt(this.t.laShowAllPages, { count: model.active });
    return html`<button
      type="button"
      class="more all-pages"
      aria-expanded="${this._allPages ? "true" : "false"}"
      aria-controls="la-pages"
      @click="${this._toggleAllPages}"
    >
      ${text}
    </button>`;
  }

  renderNoneLine(model) {
    if (model.none === 0) {
      return nothing;
    }
    const line =
      model.none === 1
        ? this.t.laOnePageWithout
        : this._fmt(this.t.laPagesWithoutLine, { count: model.none });
    const text = this._withNone
      ? this.t.laHidePagesWithout
      : this.t.laShowPagesWithout;
    return html`<p class="none-line">
      <span>${line}</span>
      <button
        type="button"
        class="more with-none"
        aria-expanded="${this._withNone ? "true" : "false"}"
        aria-controls="la-pages"
        @click="${this._toggleWithNone}"
      >
        ${text}
      </button>
    </p>`;
  }

  _toggleAllPages() {
    this._allPages = !this._allPages;
  }

  _toggleWithNone() {
    this._withNone = !this._withNone;
  }

  renderGroupHeader(group) {
    return html`<th scope="col" class="num">${this._groupLabel(group)}</th>`;
  }

  renderPageRow(row) {
    return html`<tr data-page-id="${row.item.id}">
      <th scope="row">${this.renderPageLink(row)}</th>
      ${this.renderPageCounts(row.counts)}
    </tr>`;
  }

  renderPageLink(row) {
    const title = row.item.title || row.item.slug;
    if (!row.href) {
      return title;
    }
    return html`<a
      href="${row.href}"
      data-slug="${row.item.slug || ""}"
      @click="${this._pageLinkClicked}"
      >${title}</a
    >`;
  }

  renderPageCounts(counts) {
    if (counts.total === 0) {
      const span = LEARNING_ACTIVITY_GROUPS.length + 1;
      return html`<td class="not-tracked" colspan="${span}">
        ${this.t.laNotTracked}
      </td>`;
    }
    return html`<td class="num">${counts.total}</td>
      ${LEARNING_ACTIVITY_GROUPS.map(
        (g) => html`<td class="num">${counts.groups.get(g)}</td>`,
      )}`;
  }

  renderVocabulary() {
    if (!this._vocabularyOpen) {
      return nothing;
    }
    const vocab = Array.from(vocabularyMap().values());
    return html`<div
      class="panel vocabulary"
      id="la-vocabulary"
      role="region"
      aria-labelledby="la-vocabulary-title"
    >
      <h3 id="la-vocabulary-title">${this.t.laVocabularyTitle}</h3>
      <p>${this.t.laVocabularyIntro}</p>
      <ul>
        ${vocab.map(
          (v) =>
            html`<li data-tag="${v.tag}">
              <h4>${this.renderVocabularyName(v.tag)}</h4>
              <dl>
                <dt>${this.t.laVerbs}</dt>
                <dd>${this._list(v.verbs)}</dd>
                <dt>${this.t.laResultFields}</dt>
                <dd>${this._list(v.result)}</dd>
                <dt>${this.t.laCountsAsDone}</dt>
                <dd>${v.done || this.t.laNone}</dd>
                <dt>${this.t.laCountsTowardCompletion}</dt>
                <dd>${this._yesNo(v.countsTowardCompletion)}</dd>
              </dl>
            </li>`,
        )}
      </ul>
    </div>`;
  }
}

globalThis.customElements.define(
  HAXCMSLearningActivityReport.tag,
  HAXCMSLearningActivityReport,
);
export { HAXCMSLearningActivityReport };

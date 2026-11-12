/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, nothing } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { toJS } from "mobx";
import { store } from "../../haxcms-site-store.js";
import { InsightsStyles } from "../insights-styles.js";
import "@haxtheweb/instructional-cadence/instructional-cadence.js";
import { analyzeCadence } from "@haxtheweb/instructional-cadence/lib/cadence-model.js";

const DEPTHS = [-1, 0, 1, 2, 3];

/**
 * `insights-cadence`
 * Cadence screen of Reports (Insights): the course's pacing as music, one
 * phrase per lesson and a beat per page, to review and listen to. Draws
 * from the same scan as the other screens (results.content.pages) and the
 * site outline; the scoring lives in instructional-cadence's model.
 * See haxtheweb/issues#3045.
 *
 * @fires insights-open-page - detail `{ slug }` to visit a page
 * @element insights-cadence
 */
class InsightsCadence extends I18NMixin(LitElement) {
  static get tag() {
    return "insights-cadence";
  }

  static get properties() {
    return {
      /** the whole results object from the Insights analyzer */
      results: { type: Object, attribute: false },
      density: { type: String, reflect: true },
      _depth: { state: true },
      _analysis: { state: true },
    };
  }

  constructor() {
    super();
    this.results = null;
    this.density = "default";
    this._depth = -1;
    this._items = [];
    this._rows = [];
    this._analysis = null;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      keyNumbers: "Key numbers",
      flow: "Flow",
      flowNote: "of the five parts, across {n} lessons",
      cadences: "Lessons that close",
      cadencesNote: "end on an authentic cadence",
      rests: "Rests",
      restsNote: "blank pages, played as silence",
      blankPages: "Blank lesson pages",
      blankNote: "no content and nothing below them",
      lessonLevel: "Lessons are at outline level",
      lessonLevelAuto: "Automatic (level {n})",
      lessonLevelN: "Level {n}",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../../../locales/", import.meta.url).href,
    });
  }

  static get styles() {
    return [...InsightsStyles];
  }

  willUpdate(changed) {
    if (changed.has("results")) {
      this._items = this._scannedItems();
      this._rows = this._pageRows();
    }
    if (changed.has("results") || changed.has("_depth")) {
      this._analysis = analyzeCadence(this._items, this._rows, {
        depth: this._depth,
      });
    }
  }

  /** outline items for the pages this scan covered, in site order */
  _scannedItems() {
    const pages =
      this.results && this.results.content && this.results.content.pages
        ? this.results.content.pages
        : [];
    const ids = {};
    pages.forEach((p) => {
      ids[String(p.pageId)] = true;
    });
    const manifest = toJS(store.manifest);
    const items = manifest && manifest.items ? manifest.items : [];
    return items.filter((item) => ids[String(item.id)]);
  }

  /** one row per page in the shape instructional-cadence reads */
  _pageRows() {
    const pages =
      this.results && this.results.content && this.results.content.pages
        ? this.results.content.pages
        : [];
    return pages.map((p) => ({
      id: p.pageId,
      words: p.words,
      images: p.images,
      videos: p.videos,
      embeds: p.embeds,
    }));
  }

  _fmt(text, values) {
    return Object.keys(values).reduce(
      (out, key) => out.replace(`{${key}}`, () => values[key]),
      text,
    );
  }

  _kpi(label, value, note, tone) {
    return html`<div class="kpi" data-tone="${tone || ""}">
      <span class="l">${label}</span>
      <span class="v">${value}</span>
      <span class="l">${note}</span>
    </div>`;
  }

  _openPage(e) {
    const slug = e && e.detail ? e.detail.slug : "";
    if (!slug || /^https?:\/\//.test(slug)) {
      return;
    }
    e.preventDefault();
    this.dispatchEvent(
      new CustomEvent("insights-open-page", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: { slug: slug },
      }),
    );
  }

  _setDepth(e) {
    const value = Number(e && e.target ? e.target.value : -1);
    this._depth = Number.isInteger(value) ? value : -1;
  }

  render() {
    if (!this.results || !this.results.content) {
      return nothing;
    }
    const a = this._analysis;
    const lessons = a ? a.lessons.length : 0;
    const hasLessons = lessons > 0;
    const title =
      store.manifest && store.manifest.title ? store.manifest.title : "";
    return html`<div class="sec">
      ${
        hasLessons
          ? html`<section class="kpis" aria-label="${this.t.keyNumbers}">
              ${this._kpi(
                this.t.flow,
                `${a.flow}%`,
                this._fmt(this.t.flowNote, { n: lessons }),
                a.flow < 60 ? "warning" : "",
              )}
              ${this._kpi(
                this.t.cadences,
                `${a.resolves}/${lessons}`,
                this.t.cadencesNote,
                a.resolves < lessons ? "warning" : "",
              )}
              ${this._kpi(this.t.rests, a.rests, this.t.restsNote, "")}
              ${this._kpi(
                this.t.blankPages,
                a.blankPages.length,
                this.t.blankNote,
                a.blankPages.length ? "danger" : "",
              )}
            </section>`
          : nothing
      }
      <label class="hax-ui-tool-field">
        <span>${this.t.lessonLevel}</span>
        <select
          id="depth"
          .value="${String(this._depth)}"
          @change="${this._setDepth}"
        >
          ${DEPTHS.map(
            (d) =>
              html`<option value="${d}" ?selected="${this._depth === d}">
                ${
                  d === -1
                    ? this._fmt(this.t.lessonLevelAuto, {
                        n: a ? a.depth + 1 : 1,
                      })
                    : this._fmt(this.t.lessonLevelN, { n: d + 1 })
                }
              </option>`,
          )}
        </select>
      </label>
      <instructional-cadence
        hide-stats
        lesson-depth="${this._depth}"
        course-title="${title}"
        .items="${this._items}"
        .rows="${this._rows}"
        @cadence-open-page="${this._openPage}"
      ></instructional-cadence>
    </div>`;
  }
}

globalThis.customElements.define(InsightsCadence.tag, InsightsCadence);
export { InsightsCadence };

/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { InsightsStyles } from "../insights-styles.js";

const LIMIT = 50;
const STATE_TONE = {
  none: "danger",
  worksheet: "success",
  native: "success",
  embed: "accent",
};

/**
 * `insights-instructional`
 * Instructional design screen of Reports (Insights): where practice, media
 * and reading sit across the course, objective verbs by Bloom level, walls
 * of text and what is working well. Counts of blocks and title patterns
 * only. The thresholds in use come from results.thresholds; changing them
 * needs the server, so that shows as Coming soon.
 *
 * @element insights-instructional
 * @fires insights-open-page - { slug } to visit a page
 */
class InsightsInstructional extends I18NMixin(LitElement) {
  static get tag() {
    return "insights-instructional";
  }

  static get properties() {
    return {
      results: { type: Object, attribute: false },
      density: { type: String, reflect: true },
      _expanded: { state: true },
    };
  }

  constructor() {
    super();
    this.results = null;
    this.density = "default";
    this._expanded = {};
    this.t = this.t || {};
    this.t = {
      ...this.t,
      keyNumbers: "Key numbers",
      practicePages: "Practice pages",
      practiceNote: "{pct}% of {n} pages",
      practiceNoteOne: "{pct}% of 1 page",
      nativeChecks: "Native checks",
      nativeNote: "self-check or quiz blocks",
      emptyPractice: "Empty practice pages",
      emptyValue: "{n} of {total}",
      emptyNote: "no embed, worksheet or check",
      weeksNoPractice: "Weeks without practice",
      allWeeksNote: "every week has practice",
      objectives: "Objectives",
      objectivesNote: "{pct}% Remember or Understand",
      activityMap: "Activity map",
      activityHint: "Blocks of each kind per section; 0 is shaded red",
      section: "Section",
      pages: "Pages",
      noSections: "No sections to map yet.",
      practiceList: "Practice pages",
      practiceListHint: "What each practice page contains",
      noPractice: "No pages are titled as practice yet.",
      stateNone: "No practice",
      stateWorksheet: "Worksheet",
      stateNative: "Native check",
      stateEmbed: "Embed",
      empty: "empty",
      practicePerSection: "Practice per section",
      practicePerSectionHint: "Practice pages",
      none: "none",
      weeksList: "Weeks without practice",
      everyWeek: "Every week has at least one practice page.",
      bloom: "Objective verbs",
      bloomHint: "{n} objectives matched to Bloom's verbs",
      bloomHintOne: "1 objective matched to Bloom's verbs",
      noObjectives: "No learning objectives found in objectives cards.",
      objectivesList: "Objectives",
      objective: "Objective",
      verb: "Verb",
      level: "Level",
      page: "Page",
      walls: "Walls of text",
      wallsHint: "Most paragraphs per page",
      noWalls: "No walls of text: every page is short or broken up.",
      wallDetail: "{p} ¶ · {h} · {w}",
      wallNoHeadings: "{p} ¶ · no headings · {w}",
      headingsCount: "{n} headings",
      headingOne: "1 heading",
      wordsCount: "{n} words",
      wordOne: "1 word",
      perHeading: "{n} ¶ per heading",
      noHeadings: "no headings",
      working: "Working well",
      workingHint: "Worth keeping",
      noWorking: "Nothing to highlight yet.",
      openPage: "Open page",
      openPageNamed: "Open page {title}",
      showAll: "Show all {n}",
      showFewer: "Show fewer",
      comingSoon: "Coming soon",
      thresholds: "Thresholds",
      thresholdsTitle: "Thresholds are fixed for now.",
      thresholdsInUse:
        "A wall of text has more than {perHeading} paragraphs per heading; a long page has {longPage} or more paragraphs; a thin page has under {thinWords} words.",
      thresholdsBody: "They will be adjustable per site.",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../../../locales/", import.meta.url).href,
    });
  }

  static get styles() {
    return [
      ...InsightsStyles,
      css`
        table.heat td {
          text-align: center;
          font-variant-numeric: tabular-nums;
        }
        table.heat td[data-l="0"] {
          color: var(--hax-ui-danger);
          background-color: var(--hax-ui-danger-soft);
        }
        table.heat td[data-l="2"] {
          background-color: var(--hax-ui-accent-soft);
        }
        table.heat td[data-l="3"] {
          background-color: var(--hax-ui-accent-soft);
          font-weight: var(--ddd-font-weight-bold, 700);
          box-shadow: inset 0 0 0 2px var(--hax-ui-accent);
        }
        th[scope="row"] {
          position: static;
          font-weight: var(--ddd-font-weight-regular, 400);
          color: var(--hax-ui-text);
          background-color: transparent;
          border-bottom: 1px solid var(--hax-ui-line);
        }
        code {
          font-family: var(--ddd-font-mono, monospace);
          font-size: var(--hax-ui-admin-font-size-xs);
        }
        .stack-col {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-5, 20px);
        }
        .bar .name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .bar .fill[data-tone="muted"] {
          background-color: var(--hax-ui-line-strong);
        }
        .bar .end {
          display: flex;
          justify-content: flex-end;
        }
        .weeks {
          margin-top: var(--hax-ui-gap-lg);
        }
        .findings .n {
          flex: 0 0 48px;
          font-weight: var(--ddd-font-weight-bold, 700);
          font-variant-numeric: tabular-nums;
        }
        .more {
          margin-top: var(--hax-ui-gap-md);
        }
        .soon-panel {
          display: flex;
          flex-wrap: wrap;
          gap: var(--hax-ui-gap-md);
          align-items: center;
        }
        .soon-panel .txt {
          flex: 1;
          min-width: 200px;
        }
        .soon-panel strong {
          color: var(--hax-ui-text);
        }
      `,
    ];
  }

  _fmt(str, map) {
    let out = String(str);
    Object.keys(map).forEach((k) => {
      out = out.replace(`{${k}}`, () => map[k]);
    });
    return out;
  }

  _open(slug) {
    if (!slug) {
      return;
    }
    this.dispatchEvent(
      new CustomEvent("insights-open-page", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: { slug: slug },
      }),
    );
  }

  _openBtn(slug, title) {
    if (!slug) {
      return nothing;
    }
    return html`<button
      type="button"
      class="sbtn open-page"
      data-slug="${slug}"
      aria-label="${this._fmt(this.t.openPageNamed, { title: title })}"
      @click="${() => this._open(slug)}"
    >
      ${this.t.openPage}
    </button>`;
  }

  _p(n, one, many) {
    return n === 1 ? one : this._fmt(many, { n: n });
  }

  _needs(key, own) {
    if (own && own.needs) {
      return own.needs;
    }
    const r = this.results || {};
    return r.unavailable && r.unavailable[key] ? r.unavailable[key].needs : "";
  }

  _limited(key, list) {
    return this._expanded[key] ? list : list.slice(0, LIMIT);
  }

  _moreBtn(key, list) {
    if (list.length <= LIMIT) {
      return nothing;
    }
    const open = !!this._expanded[key];
    return html`<button
      type="button"
      class="sbtn more"
      data-more="${key}"
      aria-expanded="${open ? "true" : "false"}"
      @click="${() => {
        this._expanded = { ...this._expanded, [key]: !open };
      }}"
    >
      ${open ? this.t.showFewer : this._fmt(this.t.showAll, { n: list.length })}
    </button>`;
  }

  _kpi(label, value, note, tone) {
    return html`<div class="kpi" data-tone="${tone || ""}">
      <span class="l">${label}</span>
      <span class="v">${value}</span>
      <span class="l">${note}</span>
    </div>`;
  }

  render() {
    const ins = this.results && this.results.instructional;
    if (!ins) {
      return nothing;
    }
    return html`<div class="sec">
      ${this._renderKpis(ins)} ${this._renderMap(ins)}
      <div class="grid-2">
        ${this._renderPractice(ins)}
        <div class="stack-col">
          ${this._renderPerSection(ins)} ${this._renderBloom(ins)}
        </div>
      </div>
      ${this._renderObjectives(ins)}
      <div class="grid-2">
        ${this._renderWalls(ins)} ${this._renderWorking(ins)}
      </div>
      ${this._renderThresholds(ins)}
    </div>`;
  }

  _renderKpis(ins) {
    const k = ins.kpis || {};
    const pages =
      this.results.totals && this.results.totals.pages
        ? this.results.totals.pages
        : 0;
    const weeks = ins.weeksWithoutPractice || [];
    return html`<section class="kpis" aria-label="${this.t.keyNumbers}">
      ${this._kpi(
        this.t.practicePages,
        k.practicePages,
        this._fmt(pages === 1 ? this.t.practiceNoteOne : this.t.practiceNote, {
          pct: k.practicePct,
          n: pages,
        }),
        "",
      )}
      ${this._kpi(
        this.t.nativeChecks,
        k.nativeChecks,
        this.t.nativeNote,
        k.nativeChecks ? "" : "danger",
      )}
      ${this._kpi(
        this.t.emptyPractice,
        this._fmt(this.t.emptyValue, {
          n: k.emptyPractice,
          total: k.practicePages,
        }),
        this.t.emptyNote,
        k.emptyPractice ? "danger" : "",
      )}
      ${this._kpi(
        this.t.weeksNoPractice,
        k.weeksWithoutPractice,
        weeks.length ? weeks.join(", ") : this.t.allWeeksNote,
        k.weeksWithoutPractice ? "warning" : "",
      )}
      ${this._kpi(
        this.t.objectives,
        k.objectives,
        k.objectives
          ? this._fmt(this.t.objectivesNote, { pct: k.lowerOrderPct })
          : this.t.noObjectives,
        "",
      )}
    </section>`;
  }

  _renderMap(ins) {
    const cols = ins.columns || [];
    const rows = ins.activityMap || [];
    return html`<section class="activity">
      <h3 class="block">
        ${this.t.activityMap}<span class="hint">${this.t.activityHint}</span>
      </h3>
      ${rows.length
        ? html`<div class="tbl-wrap">
            <table class="heat" aria-label="${this.t.activityMap}">
              <thead>
                <tr>
                  <th scope="col">${this.t.section}</th>
                  <th scope="col" class="num">${this.t.pages}</th>
                  ${cols.map(
                    (c) =>
                      html`<th scope="col" data-col="${c.id}">${c.label}</th>`,
                  )}
                </tr>
              </thead>
              <tbody>
                ${rows.map(
                  (m) =>
                    html`<tr data-section="${m.name}">
                      <th scope="row"><code>${m.name}</code></th>
                      <td class="num">${m.pages}</td>
                      ${m.cells.map(
                        (c) =>
                          html`<td data-col="${c.id}" data-l="${c.level}">
                            ${c.count}
                          </td>`,
                      )}
                    </tr>`,
                )}
              </tbody>
            </table>
          </div>`
        : html`<div class="empty">${this.t.noSections}</div>`}
    </section>`;
  }

  _stateLabel(state) {
    return state === "none"
      ? this.t.stateNone
      : state === "worksheet"
        ? this.t.stateWorksheet
        : state === "native"
          ? this.t.stateNative
          : this.t.stateEmbed;
  }

  _renderPractice(ins) {
    const rows = (ins.practice || []).slice().sort((a, b) => {
      const rank = (s) => (s === "none" ? 0 : 1);
      return rank(a.state) - rank(b.state);
    });
    return html`<section class="practice">
      <h3 class="block">
        ${this.t.practiceList}<span class="hint"
          >${this.t.practiceListHint}</span
        >
      </h3>
      ${rows.length
        ? html`<ul class="findings">
              ${this._limited("practice", rows).map(
                (r) =>
                  html`<li data-state="${r.state}">
                    <span class="t"
                      >${r.title}<span class="d"
                        >${r.what === "empty" ? this.t.empty : r.what}</span
                      ></span
                    >
                    <span
                      class="hax-ui-pill"
                      data-tone="${STATE_TONE[r.state] || ""}"
                      >${this._stateLabel(r.state)}</span
                    >
                    ${this._openBtn(r.slug, r.title)}
                  </li>`,
              )}
            </ul>
            ${this._moreBtn("practice", rows)}`
        : html`<div class="empty">${this.t.noPractice}</div>`}
    </section>`;
  }

  _renderPerSection(ins) {
    const rows = ins.practicePerSection || [];
    const weeks = ins.weeksWithoutPractice || [];
    const max = rows.reduce((m, r) => Math.max(m, r.count), 0) || 1;
    return html`<section class="per-section">
      <h3 class="block">
        ${this.t.practicePerSection}<span class="hint"
          >${this.t.practicePerSectionHint}</span
        >
      </h3>
      ${rows.length
        ? html`<div class="bars">
            ${rows.map(
              (r) =>
                html`<div class="bar" data-section="${r.name}">
                  <code class="name" title="${r.name}">${r.name}</code>
                  <div class="track" aria-hidden="true">
                    <div
                      class="fill"
                      style="width: ${Math.round((r.count / max) * 100)}%"
                    ></div>
                  </div>
                  <span class="end"
                    >${r.count
                      ? html`<span class="num">${r.count}</span>`
                      : html`<span class="hax-ui-pill" data-tone="danger"
                          >${this.t.none}</span
                        >`}</span
                  >
                </div>`,
            )}
          </div>`
        : html`<div class="empty">${this.t.noSections}</div>`}
      <div class="weeks">
        <h3 class="block">${this.t.weeksList}</h3>
        ${weeks.length
          ? html`<ul class="findings weeks-list">
              ${weeks.map(
                (w) =>
                  html`<li>
                    <code class="t">${w}</code
                    ><span class="hax-ui-pill" data-tone="warning"
                      >${this.t.none}</span
                    >
                  </li>`,
              )}
            </ul>`
          : html`<div class="empty">${this.t.everyWeek}</div>`}
      </div>
    </section>`;
  }

  _renderBloom(ins) {
    const rows = ins.bloom || [];
    const total = rows.reduce((n, r) => n + r.count, 0);
    const max = rows.reduce((m, r) => Math.max(m, r.count), 0) || 1;
    return html`<section class="bloom">
      <h3 class="block">
        ${this.t.bloom}<span class="hint"
          >${this._p(total, this.t.bloomHintOne, this.t.bloomHint)}</span
        >
      </h3>
      ${total
        ? html`<div class="bars">
            ${rows.map(
              (r) =>
                html`<div class="bar" data-level="${r.level}">
                  <span class="name">${r.level}</span>
                  <div class="track" aria-hidden="true">
                    <div
                      class="fill"
                      data-tone="${r.level === "Unmatched" ? "muted" : ""}"
                      style="width: ${Math.round((r.count / max) * 100)}%"
                    ></div>
                  </div>
                  <span class="num">${r.count}</span>
                </div>`,
            )}
          </div>`
        : html`<div class="empty">${this.t.noObjectives}</div>`}
    </section>`;
  }

  _renderObjectives(ins) {
    const rows = ins.objectives || [];
    return html`<section class="objectives">
      <h3 class="block">${this.t.objectivesList}</h3>
      ${rows.length
        ? html`<div class="tbl-wrap">
              <table aria-label="${this.t.objectivesList}">
                <thead>
                  <tr>
                    <th scope="col">${this.t.objective}</th>
                    <th scope="col">${this.t.verb}</th>
                    <th scope="col">${this.t.level}</th>
                    <th scope="col">${this.t.page}</th>
                  </tr>
                </thead>
                <tbody>
                  ${this._limited("objectives", rows).map(
                    (o) =>
                      html`<tr>
                        <td>${o.text}</td>
                        <td><code>${o.verb}</code></td>
                        <td>
                          <span
                            class="hax-ui-pill"
                            data-tone="${o.level === "Unmatched"
                              ? ""
                              : "accent"}"
                            >${o.level}</span
                          >
                        </td>
                        <td>${o.title} ${this._openBtn(o.slug, o.title)}</td>
                      </tr>`,
                  )}
                </tbody>
              </table>
            </div>
            ${this._moreBtn("objectives", rows)}`
        : html`<div class="empty">${this.t.noObjectives}</div>`}
    </section>`;
  }

  _renderWalls(ins) {
    const rows = ins.walls || [];
    return html`<section class="walls">
      <h3 class="block">
        ${this.t.walls}<span class="hint">${this.t.wallsHint}</span>
      </h3>
      ${rows.length
        ? html`<ul class="findings">
            ${rows.map(
              (r) =>
                html`<li>
                  <span class="t"
                    >${r.title}<span class="d"
                      >${this._fmt(
                        r.headings ? this.t.wallDetail : this.t.wallNoHeadings,
                        {
                          p: r.paragraphs,
                          h: this._p(
                            r.headings,
                            this.t.headingOne,
                            this.t.headingsCount,
                          ),
                          w: this._p(
                            r.words,
                            this.t.wordOne,
                            this.t.wordsCount,
                          ),
                        },
                      )}</span
                    ></span
                  >
                  ${r.warn
                    ? html`<span class="hax-ui-pill" data-tone="warning"
                        >${r.perHeading === null
                          ? this.t.noHeadings
                          : this._fmt(this.t.perHeading, {
                              n: r.perHeading,
                            })}</span
                      >`
                    : nothing}
                  ${this._openBtn(r.slug, r.title)}
                </li>`,
            )}
          </ul>`
        : html`<div class="empty">${this.t.noWalls}</div>`}
    </section>`;
  }

  _renderWorking(ins) {
    const rows = ins.workingWell || [];
    return html`<section class="working">
      <h3 class="block">
        ${this.t.working}<span class="hint">${this.t.workingHint}</span>
      </h3>
      ${rows.length
        ? html`<ul class="findings">
            ${rows.map(
              (r) =>
                html`<li data-id="${r.id}">
                  <span class="n">${r.count}</span>
                  <span class="t"
                    >${r.title}<span class="d">${r.detail}</span></span
                  >
                </li>`,
            )}
          </ul>`
        : html`<div class="empty">${this.t.noWorking}</div>`}
    </section>`;
  }

  _renderThresholds(ins) {
    const needs = this._needs("thresholdSettings", ins.thresholds);
    const th = this.results.thresholds || null;
    return html`<div class="soon-panel thresholds" role="note">
      <span class="hax-ui-pill" data-tone="soon">${this.t.comingSoon}</span>
      <div class="txt">
        <strong>${this.t.thresholdsTitle}</strong>
        ${th
          ? html`<span class="in-use"
              >${this._fmt(this.t.thresholdsInUse, {
                perHeading: th.paragraphsPerHeadingWarn,
                longPage: th.longPageParagraphs,
                thinWords: th.thinMaxWords,
              })}</span
            >`
          : nothing}
        ${this.t.thresholdsBody}
        <span id="threshold-needs">${needs}.</span>
      </div>
      <button
        type="button"
        class="sbtn thresholds-btn"
        aria-disabled="true"
        title="${needs}"
        aria-describedby="threshold-needs"
      >
        ${this.t.thresholds}
      </button>
    </div>`;
  }
}

globalThis.customElements.define(
  InsightsInstructional.tag,
  InsightsInstructional,
);
export { InsightsInstructional };

/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { InsightsStyles } from "../insights-styles.js";

const LIST_LIMIT = 50;

/**
 * `insights-content`
 * Content screen of Reports (Insights): words, paragraphs and headings by
 * section, the longest pages, read time, reading grade and thin pages.
 * See haxtheweb/issues#3180.
 *
 * @fires insights-open-page - detail `{ slug }` to visit a page
 * @element insights-content
 */
class InsightsContent extends I18NMixin(LitElement) {
  static get tag() {
    return "insights-content";
  }

  static get properties() {
    return {
      /** the whole results object from the Insights analyzer */
      results: { type: Object, attribute: false },
      density: { type: String, reflect: true },
      _showAllThin: { state: true },
      _showAllPages: { state: true },
      _showAllSections: { state: true },
    };
  }

  constructor() {
    super();
    this.results = null;
    this.density = "default";
    this._showAllThin = false;
    this._showAllPages = false;
    this._showAllSections = false;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      keyNumbers: "Key numbers",
      pages: "Pages",
      wordsNote: "{n} words",
      wordsNoteOne: "1 word",
      paragraphsPerPage: "Paragraphs / page",
      medianNote: "median {n}",
      noHeadings: "No headings",
      pct: "{n}%",
      ofPages: "{n} of {total} pages",
      ofPagesOne: "{n} of 1 page",
      longNoHeadings: "Long pages, no headings",
      longNoHeadingsNote: "{n}+ paragraphs and no h2–h6",
      thinPages: "Thin pages",
      thinNote: "{blocks} or fewer, under {words} words",
      blockOne: "one block",
      blocks: "{n} blocks",
      longestPage: "Longest page",
      paragraphsShort: "{n} ¶",
      longestNote: "{title}, {words}",
      none: "None",
      bySection: "By section",
      bySectionHint: "Top-level folders in site.json",
      sectionsCaption: "Words, paragraphs and headings per section",
      section: "Section",
      words: "Words",
      paragraphs: "Paragraphs",
      headings: "Headings",
      readMin: "Read min",
      videos: "Videos",
      embeds: "Embeds",
      images: "Images",
      noHeadingsFlag: "{n}, none",
      noHeadingsFlagLabel: "over {n} paragraphs and no headings",
      noSections: "No sections to show.",
      longestPages: "Longest pages",
      longestHint: "Paragraphs; flagged when over {n} per heading",
      perHeading: "{n} per heading",
      noHeadingsSub: "no headings",
      tooLong: "Long",
      tooLongLabel: "more than {n} paragraphs per heading",
      noLongest: "No page has paragraphs yet.",
      readTimePerPage: "Read time per page",
      readTimeHint: "Words ÷ {n} words per minute, rounded up",
      pageCount: "{n} pages",
      pageCountOne: "1 page",
      readability: "Reading grade",
      readabilityHint: "Flesch-Kincaid grade of pages with {n} or more words",
      medianGrade: "Median grade {n} across {scored} pages",
      medianGradeOne: "Grade {n} on the 1 page long enough to score",
      noReadability: "No page has {n} words yet, so none has a reading grade.",
      thinTitle: "Thin pages",
      thinHint: "{blocks} or fewer and under {words} words",
      noThin: "No thin pages: every page has some substance.",
      openPage: "Open page",
      openPageLabel: "Open page: {title}",
      showAll: "Show all {n}",
      everyPage: "Every page",
      everyPageHint: "The numbers behind the sections above",
      pagesCaption: "Content numbers for every page",
      title: "Title",
      grade: "Grade",
      noPages: "No pages scanned.",
      comingSoon: "Coming soon",
      trendsTitle: "Trends",
      trendsBody:
        "Words and pages over time, and what changed since the last scan.",
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
        .meta {
          display: block;
          color: var(--hax-ui-text-muted);
          font-size: var(--hax-ui-admin-font-size-xs);
        }
        .more {
          margin-top: var(--hax-ui-gap-md);
        }
        .cell-bar {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          min-width: 120px;
        }
        .cell-bar .track,
        .longest .track {
          flex: 1;
          height: 10px;
          border-radius: 5px;
          background-color: var(--hax-ui-hover);
          overflow: hidden;
        }
        .cell-bar .fill,
        .longest .fill {
          display: block;
          height: 100%;
          background-color: var(--hax-ui-accent);
        }
        .longest .fill[data-tone="warning"] {
          background-color: var(--insights-warning);
        }
        .longest .track {
          flex: 0 1 140px;
          min-width: 60px;
        }
        .longest .num {
          min-width: 48px;
        }
        .readability-median {
          margin: var(--hax-ui-gap-md) 0 0;
          color: var(--hax-ui-text-muted);
          font-size: var(--hax-ui-admin-font-size-xs);
        }
        .soon-panel strong {
          margin: 0 var(--hax-ui-gap-md);
        }
      `,
    ];
  }

  _f(str, map) {
    let out = String(str);
    Object.keys(map).forEach((k) => {
      out = out.split(`{${k}}`).join(String(map[k]));
    });
    return out;
  }

  _n(value) {
    return typeof value === "number" ? value.toLocaleString() : "0";
  }

  /** singular string when n is 1, else the plural with {n} filled in */
  _p(n, one, many) {
    return n === 1 ? one : this._f(many, { n: this._n(n) });
  }

  /** spec numbers the text describes, from results.thresholds */
  _th() {
    const t = (this.results && this.results.thresholds) || {};
    const v = (k, d) => (typeof t[k] === "number" ? t[k] : d);
    return {
      wpm: v("wordsPerMinute", 200),
      longPage: v("longPageParagraphs", 5),
      perHeading: v("paragraphsPerHeadingWarn", 8),
      thinBlocks: v("thinMaxBlocks", 1),
      thinWords: v("thinMaxWords", 40),
      sectionParagraphs: v("sectionNoHeadingsParagraphs", 10),
      noHeadingsPct: v("noHeadingsWarnPct", 50),
      minWords: v("readabilityMinWords", 100),
    };
  }

  _thinText(str) {
    const th = this._th();
    return this._f(str, {
      blocks: this._p(th.thinBlocks, this.t.blockOne, this.t.blocks),
      words: th.thinWords,
    });
  }

  _openPage(slug) {
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

  _openButton(title, slug) {
    return html`<button
      type="button"
      class="sbtn open-page"
      aria-label="${this._f(this.t.openPageLabel, { title: title })}"
      ?disabled="${!slug}"
      @click="${() => this._openPage(slug)}"
    >
      ${this.t.openPage}
    </button>`;
  }

  render() {
    const r = this.results;
    if (!r || !r.content) {
      return nothing;
    }
    const c = r.content;
    return html`<div class="sec">
      ${this._renderKpis(c)} ${this._renderSections(c)}
      <div class="grid-2">
        ${this._renderLongest(c)} ${this._renderReadTime(c)}
      </div>
      <div class="grid-2">
        ${this._renderThin(c)} ${this._renderReadability(c)}
      </div>
      ${this._renderPages(c)} ${this._renderTrends(c)}
    </div>`;
  }

  _renderKpis(c) {
    const k = c.kpis || {};
    const longest = k.longest;
    const th = this._th();
    const tiles = [
      {
        l: this.t.pages,
        v: this._n(k.pages),
        n: this._p(k.words, this.t.wordsNoteOne, this.t.wordsNote),
      },
      {
        l: this.t.paragraphsPerPage,
        v: this._n(k.paragraphsPerPage),
        n: this._f(this.t.medianNote, { n: this._n(k.paragraphsMedian) }),
      },
      {
        l: this.t.noHeadings,
        v:
          k.noHeadingsPct === null || k.noHeadingsPct === undefined
            ? "–"
            : this._f(this.t.pct, { n: k.noHeadingsPct }),
        n: this._f(k.pages === 1 ? this.t.ofPagesOne : this.t.ofPages, {
          n: this._n(k.noHeadings),
          total: this._n(k.pages),
        }),
        tone: k.noHeadingsPct >= th.noHeadingsPct ? "warning" : "",
      },
      {
        l: this.t.longNoHeadings,
        v: this._n(k.longNoHeadings),
        n: this._f(this.t.longNoHeadingsNote, { n: th.longPage }),
        tone: k.longNoHeadings ? "warning" : "",
      },
      {
        l: this.t.thinPages,
        v: this._n(k.thinPages),
        n: this._thinText(this.t.thinNote),
        tone: k.thinPages ? "warning" : "",
      },
      {
        l: this.t.longestPage,
        v: longest
          ? this._f(this.t.paragraphsShort, { n: longest.paragraphs })
          : this.t.none,
        n: longest
          ? this._f(this.t.longestNote, {
              title: longest.title,
              words: this._p(
                longest.words,
                this.t.wordsNoteOne,
                this.t.wordsNote,
              ),
            })
          : "",
      },
    ];
    return html`<section class="kpis" aria-label="${this.t.keyNumbers}">
      ${tiles.map(
        (t) =>
          html`<div class="kpi" data-tone="${t.tone || ""}">
            <span class="l">${t.l}</span>
            <span class="v">${t.v}</span>
            <span class="l">${t.n}</span>
          </div>`,
      )}
    </section>`;
  }

  _renderSections(c) {
    const rows = c.sections || [];
    const limited = this._showAllSections ? rows : rows.slice(0, LIST_LIMIT);
    const maxP = rows.reduce((m, s) => Math.max(m, s.paragraphs), 0) || 1;
    const flagLabel = this._f(this.t.noHeadingsFlagLabel, {
      n: this._th().sectionParagraphs,
    });
    return html`<section aria-labelledby="by-section">
      <h3 class="block" id="by-section">
        ${this.t.bySection} <span class="hint">${this.t.bySectionHint}</span>
      </h3>
      ${rows.length
        ? html`<div class="tbl-wrap">
            <table class="sections">
              <caption class="sr-only">
                ${this.t.sectionsCaption}
              </caption>
              <thead>
                <tr>
                  <th scope="col">${this.t.section}</th>
                  <th scope="col" class="num">${this.t.pages}</th>
                  <th scope="col" class="num">${this.t.words}</th>
                  <th scope="col">${this.t.paragraphs}</th>
                  <th scope="col" class="num">${this.t.headings}</th>
                  <th scope="col" class="num">${this.t.readMin}</th>
                  <th scope="col" class="num">${this.t.videos}</th>
                  <th scope="col" class="num">${this.t.embeds}</th>
                  <th scope="col" class="num">${this.t.images}</th>
                </tr>
              </thead>
              <tbody>
                ${limited.map(
                  (s) =>
                    html`<tr data-section="${s.name}">
                      <td><code>${s.name}</code></td>
                      <td class="num">${this._n(s.pages)}</td>
                      <td class="num">${this._n(s.words)}</td>
                      <td>
                        <span class="cell-bar"
                          ><span class="track" aria-hidden="true"
                            ><span
                              class="fill"
                              style="width: ${Math.round(
                                (s.paragraphs / maxP) * 100,
                              )}%"
                            ></span></span
                          ><span class="num"
                            >${this._n(s.paragraphs)}</span
                          ></span
                        >
                      </td>
                      <td class="num">
                        ${s.flagged
                          ? html`<span
                              class="hax-ui-pill"
                              data-tone="warning"
                              title="${flagLabel}"
                              >${this._f(this.t.noHeadingsFlag, {
                                n: this._n(s.headings),
                              })}<span class="sr-only"
                                >: ${flagLabel}</span
                              ></span
                            >`
                          : this._n(s.headings)}
                      </td>
                      <td class="num">${this._n(s.readMinutes)}</td>
                      <td class="num">${this._n(s.videos)}</td>
                      <td class="num">${this._n(s.embeds)}</td>
                      <td class="num">${this._n(s.images)}</td>
                    </tr>`,
                )}
              </tbody>
            </table>
          </div>`
        : html`<p class="empty">${this.t.noSections}</p>`}
      ${rows.length > limited.length
        ? html`<button
            type="button"
            class="sbtn more"
            @click="${() => {
              this._showAllSections = true;
            }}"
          >
            ${this._f(this.t.showAll, { n: rows.length })}
          </button>`
        : nothing}
    </section>`;
  }

  _renderLongest(c) {
    const rows = c.longest || [];
    const max = rows.reduce((m, l) => Math.max(m, l.paragraphs), 0) || 1;
    const per = this._th().perHeading;
    const tooLong = this._f(this.t.tooLongLabel, { n: per });
    return html`<section aria-labelledby="longest">
      <h3 class="block" id="longest">
        ${this.t.longestPages}
        <span class="hint">${this._f(this.t.longestHint, { n: per })}</span>
      </h3>
      ${rows.length
        ? html`<ul class="findings longest">
            ${rows.map(
              (l) =>
                html`<li>
                  <span class="t"
                    >${l.title}<span class="d"
                      >${l.perHeading === null
                        ? this.t.noHeadingsSub
                        : this._f(this.t.perHeading, {
                            n: l.perHeading,
                          })}</span
                    ></span
                  >
                  ${l.warn
                    ? html`<span
                        class="hax-ui-pill"
                        data-tone="warning"
                        title="${tooLong}"
                        >${this.t.tooLong}<span class="sr-only"
                          >: ${tooLong}</span
                        ></span
                      >`
                    : nothing}
                  <span class="track" aria-hidden="true"
                    ><span
                      class="fill"
                      data-tone="${l.warn ? "warning" : ""}"
                      style="width: ${Math.round((l.paragraphs / max) * 100)}%"
                    ></span
                  ></span>
                  <span class="num"
                    >${this._f(this.t.paragraphsShort, {
                      n: l.paragraphs,
                    })}</span
                  >
                  ${this._openButton(l.title, l.slug)}
                </li>`,
            )}
          </ul>`
        : html`<p class="empty">${this.t.noLongest}</p>`}
    </section>`;
  }

  _bars(rows, cls) {
    const max = rows.reduce((m, b) => Math.max(m, b.count), 0) || 1;
    return html`<div class="bars ${cls}">
      ${rows.map(
        (b) =>
          html`<div class="bar">
            <span>${b.label}</span>
            <span class="track" aria-hidden="true"
              ><span
                class="fill"
                style="width: ${b.count
                  ? Math.max(Math.round((b.count / max) * 100), 2)
                  : 0}%"
              ></span
            ></span>
            <span class="num"
              >${this._n(b.count)}<span class="sr-only">
                ${b.count === 1
                  ? this.t.pageCountOne
                  : this.t.pageCount.replace("{n}", "")}</span
              ></span
            >
          </div>`,
      )}
    </div>`;
  }

  _renderReadTime(c) {
    const rows = c.readTime || [];
    return html`<section aria-labelledby="read-time">
      <h3 class="block" id="read-time">
        ${this.t.readTimePerPage}
        <span class="hint"
          >${this._f(this.t.readTimeHint, { n: this._th().wpm })}</span
        >
      </h3>
      ${this._bars(rows, "read-time")}
    </section>`;
  }

  _renderReadability(c) {
    const rd = c.readability || {};
    const bands = rd.bands || [];
    const minWords = this._th().minWords;
    return html`<section aria-labelledby="readability">
      <h3 class="block" id="readability">
        ${this.t.readability}
        <span class="hint"
          >${this._f(this.t.readabilityHint, { n: minWords })}</span
        >
      </h3>
      ${rd.scored
        ? html`${this._bars(bands, "readability")}
            <p class="readability-median">
              ${this._f(
                rd.scored === 1 ? this.t.medianGradeOne : this.t.medianGrade,
                { n: rd.median, scored: this._n(rd.scored) },
              )}
            </p>`
        : html`<p class="empty">
            ${this._f(this.t.noReadability, { n: minWords })}
          </p>`}
    </section>`;
  }

  _renderThin(c) {
    const rows = c.thin || [];
    const limited = this._showAllThin ? rows : rows.slice(0, LIST_LIMIT);
    return html`<section aria-labelledby="thin">
      <h3 class="block" id="thin">
        ${this.t.thinTitle}
        <span class="hint">${this._thinText(this.t.thinHint)}</span>
      </h3>
      ${rows.length
        ? html`<ul class="findings thin">
            ${limited.map(
              (t) =>
                html`<li>
                  <span class="t"
                    >${t.title}<span class="d">${t.what}</span></span
                  >
                  ${this._openButton(t.title, t.slug)}
                </li>`,
            )}
          </ul>`
        : html`<p class="empty">${this.t.noThin}</p>`}
      ${rows.length > limited.length
        ? html`<button
            type="button"
            class="sbtn more"
            @click="${() => {
              this._showAllThin = true;
            }}"
          >
            ${this._f(this.t.showAll, { n: rows.length })}
          </button>`
        : nothing}
    </section>`;
  }

  _renderPages(c) {
    const rows = c.pages || [];
    const limited = this._showAllPages ? rows : rows.slice(0, LIST_LIMIT);
    return html`<section aria-labelledby="every-page">
      <h3 class="block" id="every-page">
        ${this.t.everyPage} <span class="hint">${this.t.everyPageHint}</span>
      </h3>
      ${rows.length
        ? html`<div class="tbl-wrap">
            <table class="pages">
              <caption class="sr-only">
                ${this.t.pagesCaption}
              </caption>
              <thead>
                <tr>
                  <th scope="col">${this.t.title}</th>
                  <th scope="col">${this.t.section}</th>
                  <th scope="col" class="num">${this.t.words}</th>
                  <th scope="col" class="num">${this.t.paragraphs}</th>
                  <th scope="col" class="num">${this.t.headings}</th>
                  <th scope="col" class="num">${this.t.readMin}</th>
                  <th scope="col" class="num">${this.t.grade}</th>
                  <th scope="col">
                    <span class="sr-only">${this.t.openPage}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                ${limited.map(
                  (p) =>
                    html`<tr>
                      <td>${p.title}</td>
                      <td><code>${p.section}</code></td>
                      <td class="num">${this._n(p.words)}</td>
                      <td class="num">${this._n(p.paragraphs)}</td>
                      <td class="num">${this._n(p.headings)}</td>
                      <td class="num">${this._n(p.readMinutes)}</td>
                      <td class="num">
                        ${p.grade === null || p.grade === undefined
                          ? "–"
                          : p.grade}
                      </td>
                      <td>${this._openButton(p.title, p.slug)}</td>
                    </tr>`,
                )}
              </tbody>
            </table>
          </div>`
        : html`<p class="empty">${this.t.noPages}</p>`}
      ${rows.length > limited.length
        ? html`<button
            type="button"
            class="sbtn more"
            @click="${() => {
              this._showAllPages = true;
            }}"
          >
            ${this._f(this.t.showAll, { n: rows.length })}
          </button>`
        : nothing}
    </section>`;
  }

  _renderTrends(c) {
    const tr = c.trends;
    if (!tr || tr.available !== false) {
      return nothing;
    }
    return html`<div class="soon-panel trends" role="note">
      <span class="hax-ui-pill" data-tone="soon">${this.t.comingSoon}</span>
      <strong>${this.t.trendsTitle}</strong>
      ${this.t.trendsBody} ${tr.needs}.
    </div>`;
  }
}

globalThis.customElements.define(InsightsContent.tag, InsightsContent);
export { InsightsContent };

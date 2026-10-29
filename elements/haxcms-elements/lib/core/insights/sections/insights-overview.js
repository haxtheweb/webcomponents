/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { InsightsStyles } from "../insights-styles.js";

const SEVERITY_TONE = { error: "danger", warning: "warning", info: "accent" };

function scoreTone(score, th) {
  if (score === null || score === undefined) {
    return "";
  }
  const t = th || {};
  const danger = typeof t.scoreDanger === "number" ? t.scoreDanger : 50;
  const warning = typeof t.scoreWarning === "number" ? t.scoreWarning : 70;
  return score < danger ? "danger" : score < warning ? "warning" : "success";
}

/**
 * `insights-overview`
 * Overview screen of Reports (Insights): site health and its checks, the
 * key numbers, what to fix next, and where the pages live. A finding about
 * one page opens that page; a finding about several pages (or the whole
 * site) opens its screen. See haxtheweb/issues#3180.
 *
 * @fires haxcms-site-admin-navigate - detail `{ route }` to open another
 *   Reports screen
 * @fires insights-open-page - detail `{ slug }` to visit a page
 * @element insights-overview
 */
class InsightsOverview extends I18NMixin(LitElement) {
  static get tag() {
    return "insights-overview";
  }

  static get properties() {
    return {
      /** the whole results object from the Insights analyzer */
      results: { type: Object, attribute: false },
      density: { type: String, reflect: true },
      _allFindings: { state: true },
    };
  }

  constructor() {
    super();
    this.results = null;
    this.density = "default";
    this._allFindings = false;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      keyNumbers: "Key numbers",
      pages: "Pages",
      paragraphsNote: "{n} paragraphs",
      paragraphsNoteOne: "1 paragraph",
      readTime: "Read time",
      wordsNote: "{n} words",
      wordsNoteOne: "1 word",
      hoursMinutes: "{h}h {m}m",
      minutes: "{n} min",
      videos: "Videos",
      onPages: "on {n} pages",
      onPagesOne: "on 1 page",
      practicePages: "Practice pages",
      practiceNote: "titled as practice",
      accessibilityErrors: "Accessibility errors",
      untitledIframesNote: "{n} untitled iframes",
      untitledIframesNoteOne: "1 untitled iframe",
      sinceLastEdit: "Since last edit",
      days: "{n} d",
      noEdits: "No edit dates",
      brokenOutsideLinks: "Broken outside links",
      comingSoon: "Coming soon",
      fixNext: "Fix next",
      fixNextHint: "Severity, then pages affected",
      error: "Error",
      warning: "Warning",
      info: "Info",
      review: "Review",
      reviewLabel: "Review: {title}",
      openPage: "Open page",
      openPageLabel: "Open page: {title}",
      showAllFindings: "Show all {n} findings",
      showFewerFindings: "Show the first {n}",
      nothingToFix: "Nothing to fix: every check passed.",
      siteHealth: "Site health",
      healthHint: "Average of the checks below",
      healthScore: "{n} / 100",
      noScore: "—",
      noScoreLabel: "Not scored",
      nothingToCheckYet: "Nothing to check yet",
      passedOf: "{passed} of {total} {how}",
      noneToCheck: "Nothing to check",
      outsideLinksResolve: "Outside links resolve",
      outsideLinksHow: "Share of outside links that answer",
      wherePagesLive: "Where the {n} pages live",
      wherePagesLiveOne: "Where the 1 page lives",
      foldersHint: "Pages per top-level URL folder",
      openContent: "Content",
      openContentLabel: "Open the Content report",
      folderFlagged: "Check",
      folderFlaggedLabel: "pages not in a named folder",
      noFolders: "No pages to group yet.",
      laterTitle: "Later, with a server-side insights provider",
      laterHistory: "Saved results and history",
      laterSchedule: "Scheduled rescans",
      laterCli: "The same report from the command line",
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
        .score {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(60px, 140px) 48px;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          width: 100%;
        }
        .score .track {
          height: 10px;
          border-radius: 5px;
          background-color: var(--hax-ui-hover);
          overflow: hidden;
        }
        .score .fill {
          height: 100%;
          background-color: var(--hax-ui-accent);
        }
        .score .fill[data-tone="danger"] {
          background-color: var(--hax-ui-danger);
        }
        .score .fill[data-tone="warning"] {
          background-color: var(--insights-warning);
        }
        .score .fill[data-tone="success"] {
          background-color: var(--hax-ui-success);
        }
        .findings .sbtn {
          flex: none;
        }
        .more {
          margin-top: var(--hax-ui-gap-md);
        }
        .folder-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .soon-panel ul {
          margin: var(--hax-ui-gap) 0 0;
          padding-left: var(--ddd-spacing-5, 20px);
        }
        h3.block .grow {
          flex: 1;
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

  /** the one page a finding is about, or null */
  _onePage(f) {
    const list = f.pageList || [];
    return f.pages === 1 && list.length === 1 && list[0].slug ? list[0] : null;
  }

  _readTime(minutes) {
    const m = minutes || 0;
    if (m < 60) {
      return this._f(this.t.minutes, { n: m });
    }
    return this._f(this.t.hoursMinutes, { h: Math.floor(m / 60), m: m % 60 });
  }

  _navigate(section) {
    const route = section === "overview" ? "reports" : `reports-${section}`;
    this.dispatchEvent(
      new CustomEvent("haxcms-site-admin-navigate", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: { route: route },
      }),
    );
  }

  _severityLabel(sev) {
    return sev === "error"
      ? this.t.error
      : sev === "warning"
        ? this.t.warning
        : this.t.info;
  }

  render() {
    const r = this.results;
    if (!r || !r.overview) {
      return nothing;
    }
    const o = r.overview;
    return html`<div class="sec">
      ${this._renderStats(o)}
      <div class="grid-2">
        ${this._renderFixNext(o)} ${this._renderHealth(o)}
      </div>
      ${this._renderFolders(o)} ${this._renderLater(o)}
    </div>`;
  }

  _renderStats(o) {
    const s = o.stats || {};
    const nav = (this.results.nav && this.results.nav.freshness) || {};
    const soon = o.brokenOutsideLinks || {};
    const tiles = [
      {
        l: this.t.pages,
        v: this._n(s.pages),
        n: this._p(
          s.paragraphs,
          this.t.paragraphsNoteOne,
          this.t.paragraphsNote,
        ),
      },
      {
        l: this.t.readTime,
        v: this._readTime(s.readMinutes),
        n: this._p(s.words, this.t.wordsNoteOne, this.t.wordsNote),
      },
      {
        l: this.t.videos,
        v: this._n(s.videos),
        n: this._p(s.videoPages, this.t.onPagesOne, this.t.onPages),
      },
      {
        l: this.t.practicePages,
        v: this._n(s.practicePages),
        n: this.t.practiceNote,
      },
      {
        l: this.t.accessibilityErrors,
        v: this._n(s.accessibilityErrors),
        n: this._p(
          s.untitledIframes,
          this.t.untitledIframesNoteOne,
          this.t.untitledIframesNote,
        ),
        tone: s.accessibilityErrors ? "danger" : "",
      },
      {
        l: this.t.sinceLastEdit,
        v:
          s.daysSinceLastEdit === null || s.daysSinceLastEdit === undefined
            ? "–"
            : this._f(this.t.days, { n: this._n(s.daysSinceLastEdit) }),
        n: s.lastEdit || this.t.noEdits,
        tone: nav.tone || "",
      },
    ];
    return html`<section class="kpis" aria-label="${this.t.keyNumbers}">
      ${tiles.map(
        (k) =>
          html`<div class="kpi" data-tone="${k.tone || ""}">
            <span class="l">${k.l}</span>
            <span class="v">${k.v}</span>
            <span class="l">${k.n}</span>
          </div>`,
      )}
      <div class="kpi soon-tile" data-tone="soon">
        <span class="l">${this.t.brokenOutsideLinks}</span>
        <span class="v"
          ><span class="hax-ui-pill" data-tone="soon"
            >${this.t.comingSoon}</span
          ></span
        >
        <span class="l">${soon.needs || ""}</span>
      </div>
    </section>`;
  }

  _renderFixNext(o) {
    const fixNext = o.fixNext || [];
    const all = o.findings || [];
    const list = this._allFindings ? all : fixNext;
    return html`<section aria-labelledby="fix-next">
      <h3 class="block" id="fix-next">
        ${this.t.fixNext} <span class="hint">${this.t.fixNextHint}</span>
      </h3>
      ${list.length
        ? html`<ul class="findings">
            ${list.map(
              (f) =>
                html`<li>
                  <span
                    class="hax-ui-pill"
                    data-tone="${SEVERITY_TONE[f.severity] || ""}"
                    >${this._severityLabel(f.severity)}</span
                  >
                  <span class="t"
                    >${f.title}${f.detail
                      ? html`<span class="d">${f.detail}</span>`
                      : nothing}</span
                  >
                  ${this._findingButton(f)}
                </li>`,
            )}
          </ul>`
        : html`<p class="empty">${this.t.nothingToFix}</p>`}
      ${all.length > fixNext.length
        ? html`<button
            type="button"
            class="sbtn more"
            aria-expanded="${this._allFindings ? "true" : "false"}"
            @click="${() => {
              this._allFindings = !this._allFindings;
            }}"
          >
            ${this._allFindings
              ? this._f(this.t.showFewerFindings, { n: fixNext.length })
              : this._f(this.t.showAllFindings, { n: all.length })}
          </button>`
        : nothing}
    </section>`;
  }

  _findingButton(f) {
    const page = this._onePage(f);
    if (page) {
      return html`<button
        type="button"
        class="sbtn open-page"
        data-code="${f.code}"
        data-slug="${page.slug}"
        aria-label="${this._f(this.t.openPageLabel, { title: page.title })}"
        @click="${() => this._openPage(page.slug)}"
      >
        ${this.t.openPage}
      </button>`;
    }
    return html`<button
      type="button"
      class="sbtn review"
      data-code="${f.code}"
      data-section="${f.section}"
      aria-label="${this._f(this.t.reviewLabel, { title: f.title })}"
      @click="${() => this._navigate(f.section)}"
    >
      ${this.t.review}
    </button>`;
  }

  _renderHealth(o) {
    const h = o.health || {};
    const checks = h.checks || [];
    const outside = h.outsideLinks || {};
    const th = this.results.thresholds || {};
    const noScore = h.score === null || h.score === undefined;
    const scoreLabel = noScore
      ? this.t.noScore
      : this._f(this.t.healthScore, { n: h.score });
    return html`<section aria-labelledby="site-health">
      <h3 class="block" id="site-health">
        ${this.t.siteHealth}
        <span
          class="hax-ui-pill health-score"
          data-tone="${scoreTone(h.score, th)}"
          title="${noScore ? this.t.noScoreLabel : ""}"
          >${scoreLabel}${noScore
            ? html`<span class="sr-only">${this.t.noScoreLabel}</span>`
            : nothing}</span
        >
        <span class="hint"
          >${noScore ? this.t.nothingToCheckYet : this.t.healthHint}</span
        >
      </h3>
      <ul class="findings">
        ${checks.map(
          (c) =>
            html`<li data-check="${c.id}">
              <div class="score">
                <span class="t"
                  >${c.label}<span class="d"
                    >${c.total
                      ? this._f(this.t.passedOf, {
                          passed: this._n(c.passed),
                          total: this._n(c.total),
                          how: c.total === 1 && c.howOne ? c.howOne : c.how,
                        })
                      : this.t.noneToCheck}</span
                  ></span
                >
                <span class="track" aria-hidden="true"
                  ><span
                    class="fill"
                    data-tone="${scoreTone(c.score, th)}"
                    style="width: ${c.score === null
                      ? 0
                      : Math.max(c.score, 2)}%"
                  ></span
                ></span>
                <span class="num"
                  >${c.score === null ? "–" : `${c.score}%`}</span
                >
              </div>
            </li>`,
        )}
        <li class="soon-row">
          <span class="t"
            >${this.t.outsideLinksResolve}<span class="d"
              >${this.t.outsideLinksHow}</span
            ></span
          >
          <span class="hax-ui-pill" data-tone="soon" title="${outside.needs}"
            >${this.t.comingSoon}</span
          >
          <span class="sr-only">${outside.needs}</span>
        </li>
      </ul>
    </section>`;
  }

  _renderFolders(o) {
    const folders = o.folders || [];
    const max = folders.reduce((m, f) => Math.max(m, f.pages), 0) || 1;
    const total = (o.stats && o.stats.pages) || 0;
    return html`<section aria-labelledby="folders">
      <h3 class="block" id="folders">
        ${this._p(total, this.t.wherePagesLiveOne, this.t.wherePagesLive)}
        <span class="hint grow">${this.t.foldersHint}</span>
        <button
          type="button"
          class="sbtn"
          aria-label="${this.t.openContentLabel}"
          @click="${() => this._navigate("content")}"
        >
          ${this.t.openContent}
        </button>
      </h3>
      ${folders.length
        ? html`<div class="bars folders">
            ${folders.map(
              (f) =>
                html`<div class="bar">
                  <span class="folder-name"
                    ><code>${f.name}</code>${f.flagged
                      ? html` <span
                          class="hax-ui-pill"
                          data-tone="warning"
                          title="${this.t.folderFlaggedLabel}"
                          >${this.t.folderFlagged}<span class="sr-only"
                            >: ${this.t.folderFlaggedLabel}</span
                          ></span
                        >`
                      : nothing}</span
                  >
                  <span class="track" aria-hidden="true"
                    ><span
                      class="fill"
                      data-tone="${f.flagged ? "warning" : ""}"
                      style="width: ${Math.max(
                        Math.round((f.pages / max) * 100),
                        2,
                      )}%"
                    ></span
                  ></span>
                  <span class="num">${this._n(f.pages)}</span>
                </div>`,
            )}
          </div>`
        : html`<p class="empty">${this.t.noFolders}</p>`}
    </section>`;
  }

  _renderLater(o) {
    const items = [
      [this.t.laterHistory, o.savedHistory],
      [this.t.laterSchedule, o.schedule],
      [this.t.laterCli, o.cli],
    ].filter((u) => u[1] && u[1].available === false);
    if (!items.length) {
      return nothing;
    }
    return html`<div class="soon-panel" role="note">
      <span class="hax-ui-pill" data-tone="soon">${this.t.comingSoon}</span>
      <strong>${this.t.laterTitle}</strong>
      <ul>
        ${items.map((u) => html`<li>${u[0]}: ${u[1].needs}</li>`)}
      </ul>
    </div>`;
  }
}

globalThis.customElements.define(InsightsOverview.tag, InsightsOverview);
export { InsightsOverview };

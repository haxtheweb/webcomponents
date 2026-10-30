/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { InsightsStyles } from "../insights-styles.js";

const LIMIT = 50;
/** page buttons shown on a flag before "Show all" */
const FLAG_PAGES = 5;

/**
 * `insights-components`
 * Reports screen: which elements the pages are built from, counted by tag
 * name. Key numbers, HAX elements and plain HTML used (count and pages),
 * markup flags worth a look (each opens the pages it is about), and
 * elements that fit gaps found elsewhere.
 *
 * @element insights-components
 * @fires insights-open-page - { slug } to visit a page
 */
class InsightsComponents extends I18NMixin(LitElement) {
  static get tag() {
    return "insights-components";
  }

  static get properties() {
    return {
      results: { attribute: false },
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
      elements: "Elements",
      countedOn: "counted on {n} pages",
      countedOnOne: "counted on 1 page",
      distinctTags: "Distinct tags",
      distinctNote: "{hax} HAX · {html} HTML",
      haxShare: "HAX share",
      haxShareNote: "{hax} of {all}",
      flags: "Flags",
      flagsNote: "markup worth a look",
      nativeChecks: "Native checks",
      nativeChecksNote: "built-in practice elements",
      haxTitle: "HAX elements",
      htmlTitle: "Plain HTML",
      countAcross: "Count across {n} pages",
      countAcrossOne: "Count across 1 page",
      haxCaption: "HAX elements used, with counts and pages",
      htmlCaption: "Plain HTML elements used, with counts and pages",
      element: "Element",
      uses: "Uses",
      pages: "Pages",
      flagged: "flagged",
      noHax: "No HAX elements counted yet",
      noHtml: "No plain HTML elements counted",
      flagsTitle: "Flags",
      flagsHint: "Markup worth a look",
      stateReview: "Review",
      stateInfo: "Info",
      noFlags: "No markup flags: nothing needs a look",
      unusedTitle: "Not used yet",
      unusedHint: "Elements that fit gaps found elsewhere",
      noUnused: "No gaps found that a new element would fill",
      openPage: "Open page",
      openPageNamed: "Open page {title}",
      flagPages: "Pages for {title}",
      showAll: "Show all {n}",
      showFewer: "Show fewer",
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
        code {
          font-family: var(--ddd-font-mono, monospace);
          font-size: var(--hax-ui-admin-font-size-xs);
        }
        td.use {
          width: 45%;
        }
        .meter {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
        }
        .meter .track {
          flex: 1;
          height: 8px;
          border-radius: 4px;
          background-color: var(--hax-ui-hover);
          overflow: hidden;
        }
        .meter .fill {
          display: block;
          height: 100%;
          background-color: var(--hax-ui-accent);
        }
        .meter .fill[data-tone="warning"] {
          background-color: var(--insights-warning);
        }
        .meter .num {
          min-width: 40px;
        }
        .flagged {
          margin-left: var(--hax-ui-gap);
        }
        .acts {
          display: flex;
          flex-wrap: wrap;
          gap: var(--hax-ui-gap);
        }
        .unused code {
          flex: 0 0 150px;
        }
        .more {
          margin-top: var(--hax-ui-gap-md);
        }
      `,
    ];
  }

  _sec() {
    return this.results && this.results.components
      ? this.results.components
      : null;
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

  _openBtn(title, slug) {
    if (!slug) {
      return nothing;
    }
    return html`<button
      type="button"
      class="sbtn open"
      data-slug="${slug}"
      aria-label="${this.t.openPageNamed.replace("{title}", () => title)}"
      @click="${() => this._openPage(slug)}"
    >
      ${this.t.openPage}
    </button>`;
  }

  _openPageBtn(p) {
    if (!p || !p.slug) {
      return nothing;
    }
    return html`<button
      type="button"
      class="sbtn open"
      data-slug="${p.slug}"
      aria-label="${this.t.openPageNamed.replace("{title}", () => p.title)}"
      @click="${() => this._openPage(p.slug)}"
    >
      ${p.title}
    </button>`;
  }

  _toggle(key) {
    this._expanded = { ...this._expanded, [key]: !this._expanded[key] };
  }

  _limit(key, list) {
    return this._expanded[key] ? list : list.slice(0, LIMIT);
  }

  _moreBtn(key, list) {
    if (list.length <= LIMIT) {
      return nothing;
    }
    return html`<div class="more">
      <button
        type="button"
        class="sbtn show-all"
        aria-expanded="${this._expanded[key] ? "true" : "false"}"
        @click="${() => this._toggle(key)}"
      >
        ${this._expanded[key]
          ? this.t.showFewer
          : this.t.showAll.replace("{n}", () => list.length)}
      </button>
    </div>`;
  }

  _pageCount() {
    return this.results.totals && this.results.totals.pages !== undefined
      ? this.results.totals.pages
      : 0;
  }

  _pagesText(one, many) {
    const n = this._pageCount();
    return n === 1 ? one : many.replace("{n}", () => n);
  }

  /** tags any flag is about, so their rows get the same warning */
  _flaggedTags(sec) {
    const set = {};
    (sec.flags || []).forEach((f) => {
      (f.tags || []).forEach((t) => {
        set[t] = 1;
      });
    });
    return set;
  }

  render() {
    const sec = this._sec();
    if (!sec) {
      return nothing;
    }
    const flagged = this._flaggedTags(sec);
    return html`<div class="sec">
      ${this._renderKpis(sec)}
      <div class="grid-2">
        ${this._renderTags(
          "hax",
          sec.hax || [],
          flagged,
          this.t.haxTitle,
          this.t.haxCaption,
          this.t.noHax,
        )}
        ${this._renderTags(
          "html",
          sec.html || [],
          flagged,
          this.t.htmlTitle,
          this.t.htmlCaption,
          this.t.noHtml,
        )}
      </div>
      ${this._renderFlags(sec)} ${this._renderSuggestions(sec)}
    </div>`;
  }

  _renderKpis(sec) {
    const k = sec.kpis || {};
    const tiles = [
      {
        id: "elements",
        label: this.t.elements,
        value: (k.elements || 0).toLocaleString(),
        note: this._pagesText(this.t.countedOnOne, this.t.countedOn),
        tone: "",
      },
      {
        id: "distinct",
        label: this.t.distinctTags,
        value: k.distinctTags || 0,
        note: this.t.distinctNote
          .replace("{hax}", () => k.distinctHax || 0)
          .replace("{html}", () => k.distinctHtml || 0),
        tone: "",
      },
      {
        id: "share",
        label: this.t.haxShare,
        value:
          k.haxShare === null || k.haxShare === undefined
            ? "–"
            : `${k.haxShare}%`,
        note: this.t.haxShareNote
          .replace("{hax}", () => (k.haxElements || 0).toLocaleString())
          .replace("{all}", () => (k.elements || 0).toLocaleString()),
        tone: "",
      },
      {
        id: "flags",
        label: this.t.flags,
        value: k.flags || 0,
        note: this.t.flagsNote,
        tone: k.flags ? "warning" : "",
      },
      {
        id: "native",
        label: this.t.nativeChecks,
        value: k.nativeChecks || 0,
        note: this.t.nativeChecksNote,
        tone: k.nativeChecks ? "" : "danger",
      },
    ];
    return html`<section class="kpis" aria-label="${this.t.keyNumbers}">
      ${tiles.map(
        (s) =>
          html`<div class="kpi" data-kpi="${s.id}" data-tone="${s.tone}">
            <span class="l">${s.label}</span>
            <span class="v">${s.value}</span>
            <span class="l">${s.note}</span>
          </div>`,
      )}
    </section>`;
  }

  _renderTags(key, rows, flagged, title, caption, emptyText) {
    const shown = this._limit(key, rows);
    const max = rows.reduce((n, r) => Math.max(n, r.count), 0);
    const id = `cp-${key}`;
    return html`<section aria-labelledby="${id}">
      <h3 class="block" id="${id}">
        ${title}<span class="hint"
          >${this._pagesText(this.t.countAcrossOne, this.t.countAcross)}</span
        >
      </h3>
      ${rows.length
        ? html`<div class="tbl-wrap">
              <table class="tags ${key}">
                <caption class="sr-only">
                  ${caption}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">${this.t.element}</th>
                    <th scope="col">${this.t.uses}</th>
                    <th scope="col" class="num">${this.t.pages}</th>
                  </tr>
                </thead>
                <tbody>
                  ${shown.map((r) => {
                    const warn = !!flagged[r.tag];
                    const w = max
                      ? Math.max(Math.round((r.count / max) * 100), 2)
                      : 0;
                    return html`<tr data-tag="${r.tag}">
                      <td>
                        <code>${r.tag}</code>${warn
                          ? html`<span
                              class="hax-ui-pill flagged"
                              data-tone="warning"
                              >${this.t.flagged}</span
                            >`
                          : nothing}
                      </td>
                      <td class="use">
                        <div class="meter">
                          <span class="track" aria-hidden="true"
                            ><span
                              class="fill"
                              data-tone="${warn ? "warning" : ""}"
                              style="width:${w}%"
                            ></span
                          ></span>
                          <span class="num">${r.count.toLocaleString()}</span>
                        </div>
                      </td>
                      <td class="num">${r.pages}</td>
                    </tr>`;
                  })}
                </tbody>
              </table>
            </div>
            ${this._moreBtn(key, rows)}`
        : html`<p class="empty">${emptyText}</p>`}
    </section>`;
  }

  _renderFlags(sec) {
    const flags = sec.flags || [];
    return html`<section aria-labelledby="cp-flags">
      <h3 class="block" id="cp-flags">
        ${this.t.flagsTitle}<span class="hint">${this.t.flagsHint}</span>
      </h3>
      ${flags.length
        ? html`<ul class="findings flags">
            ${flags.map(
              (f) =>
                html`<li data-code="${f.code}">
                  <span
                    class="hax-ui-pill"
                    data-tone="${f.state === "review" ? "warning" : "accent"}"
                    >${f.state === "review"
                      ? this.t.stateReview
                      : this.t.stateInfo}</span
                  >
                  <span class="t"
                    >${f.title}<span class="d">${f.detail}</span></span
                  >
                  ${this._renderFlagPages(f)}
                </li>`,
            )}
          </ul>`
        : html`<p class="empty">${this.t.noFlags}</p>`}
    </section>`;
  }

  _renderFlagPages(f) {
    const list = (f.pageList || []).filter((p) => p.slug);
    if (!list.length) {
      return nothing;
    }
    if (list.length === 1) {
      return html`<span class="acts"
        >${this._openBtn(list[0].title, list[0].slug)}</span
      >`;
    }
    const key = `flag-${f.code}`;
    const open = !!this._expanded[key];
    const shown = open ? list : list.slice(0, FLAG_PAGES);
    return html`<span
      class="acts"
      role="group"
      aria-label="${this.t.flagPages.replace("{title}", () => f.title)}"
    >
      ${shown.map((p) => this._openPageBtn(p))}
      ${list.length > FLAG_PAGES
        ? html`<button
            type="button"
            class="sbtn show-all flag-more"
            aria-expanded="${open ? "true" : "false"}"
            @click="${() => this._toggle(key)}"
          >
            ${open
              ? this.t.showFewer
              : this.t.showAll.replace("{n}", () => list.length)}
          </button>`
        : nothing}
    </span>`;
  }

  _renderSuggestions(sec) {
    const rows = sec.suggestions || [];
    return html`<section aria-labelledby="cp-unused">
      <h3 class="block" id="cp-unused">
        ${this.t.unusedTitle}<span class="hint">${this.t.unusedHint}</span>
      </h3>
      ${rows.length
        ? html`<ul class="findings unused">
            ${rows.map(
              (s) =>
                html`<li data-tag="${s.tag}">
                  <code>${s.tag}</code>
                  <span class="t d">${s.why}</span>
                </li>`,
            )}
          </ul>`
        : html`<p class="empty">${this.t.noUnused}</p>`}
    </section>`;
  }
}

globalThis.customElements.define(InsightsComponents.tag, InsightsComponents);
export { InsightsComponents };

/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { InsightsStyles } from "../insights-styles.js";

const LIMIT = 50;

/** check state -> pill tone */
const STATE_TONE = {
  passes: "success",
  fails: "danger",
  warning: "warning",
  info: "accent",
  notChecked: "soon",
};

/**
 * `insights-metadata`
 * Reports screen: what search engines, link previews and AI tools can read
 * about the site. Key numbers, the checks (robots.txt, llms.txt, readable
 * without JavaScript, license, descriptions, titles…), pages without a
 * description, shared and generic titles, and every page's metadata.
 *
 * @element insights-metadata
 * @fires insights-open-page - { slug } to visit a page
 */
class InsightsMetadata extends I18NMixin(LitElement) {
  static get tag() {
    return "insights-metadata";
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
      readableNoJs: "Readable without JS",
      yes: "Yes",
      no: "No",
      notChecked: "Not checked",
      plainFetch: "plain fetch of one page",
      aiFiles: "AI files",
      aiFilesNote: "llms.txt, site.json + {n} optional",
      noDescription: "No description",
      ofPages: "of {n} pages",
      sharedTitles: "Shared titles",
      sharedTitlesNote: "pages across {n} titles",
      license: "License",
      noLicense: "None",
      notDeclared: "not declared",
      checks: "Checks",
      checksHint:
        "site.json, robots.txt, llms.txt and a no-JS fetch of one page",
      statePasses: "Passes",
      stateFails: "Fails",
      stateWarning: "Warning",
      stateInfo: "Info",
      stateNotChecked: "Not checked",
      noChecks: "No checks ran",
      noDescTitle: "Pages with no description",
      pagesCount: "{n} pages",
      noDescEmpty: "No pages without a description",
      titlesTitle: "Shared and generic titles",
      titlesHint: "Exact matches in site.json",
      sharedLabel: "{n} pages",
      genericLabel: "generic",
      noTitlesEmpty: "No shared or generic titles",
      pagesTitle: "Pages",
      pagesHint: "Description and title checks for every page",
      pagesCaption: "Metadata for each page",
      page: "Page",
      description: "Description",
      sharedTitle: "Shared title",
      genericTitle: "Generic title",
      published: "Published",
      actions: "Actions",
      missing: "Missing",
      present: "Present",
      noPages: "No pages in this scan",
      openPage: "Open page",
      openPageNamed: "Open page {title}",
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
        .checks .hax-ui-pill {
          min-width: 88px;
          justify-content: center;
        }
        .group {
          display: flex;
          flex-direction: column;
          gap: var(--hax-ui-gap);
          width: 100%;
        }
        .group-head {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
        }
        .group-pages {
          list-style: none;
          margin: 0;
          padding: 0 0 0 var(--hax-ui-gap-lg);
          display: flex;
          flex-direction: column;
          gap: var(--hax-ui-gap);
        }
        .group-pages li {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          min-height: 0;
          padding: 0;
          border: 0;
        }
        .more {
          margin-top: var(--hax-ui-gap-md);
        }
        td .warn {
          color: var(--insights-warning);
          font-weight: var(--ddd-font-weight-medium, 500);
        }
      `,
    ];
  }

  _sec() {
    return this.results && this.results.metadata ? this.results.metadata : null;
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

  _pageCount(sec) {
    if (this.results.totals && this.results.totals.pages !== undefined) {
      return this.results.totals.pages;
    }
    return (sec.pages || []).length;
  }

  _page(pageId) {
    const pages = (this._sec() || {}).pages || [];
    return pages.find((p) => p.pageId === pageId) || null;
  }

  render() {
    const sec = this._sec();
    if (!sec) {
      return nothing;
    }
    return html`<div class="sec">
      ${this._renderKpis(sec)} ${this._renderChecks(sec)}
      <div class="grid-2">
        ${this._renderNoDescription(sec)} ${this._renderTitles(sec)}
      </div>
      ${this._renderPages(sec)}
    </div>`;
  }

  _renderKpis(sec) {
    const k = sec.kpis || {};
    const total = this._pageCount(sec);
    const ai = k.aiFiles || null;
    const noJs = k.readableWithoutJs;
    const tiles = [
      {
        id: "nojs",
        label: this.t.readableNoJs,
        value: noJs === true ? this.t.yes : noJs === false ? this.t.no : "–",
        note:
          noJs === null || noJs === undefined
            ? this.t.notChecked
            : this.t.plainFetch,
        tone: noJs === false ? "danger" : "",
      },
      {
        id: "ai",
        label: this.t.aiFiles,
        value: ai ? `${ai.found} / ${ai.total}` : "–",
        note: ai
          ? this.t.aiFilesNote.replace("{n}", () => Math.max(0, ai.total - 2))
          : this.t.notChecked,
        tone: ai && ai.found < ai.total ? "warning" : "",
      },
      {
        id: "nodesc",
        label: this.t.noDescription,
        value: k.noDescription || 0,
        note: this.t.ofPages.replace("{n}", () => total),
        tone: k.noDescription ? "warning" : "",
      },
      {
        id: "shared",
        label: this.t.sharedTitles,
        value: k.sharedTitlePages || 0,
        note: this.t.sharedTitlesNote.replace("{n}", () => k.sharedTitles || 0),
        tone: k.sharedTitlePages ? "warning" : "",
      },
      {
        id: "license",
        label: this.t.license,
        value: k.license || this.t.noLicense,
        note: k.licenseFamily || this.t.notDeclared,
        tone: "",
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

  _stateLabel(state) {
    switch (state) {
      case "passes":
        return this.t.statePasses;
      case "fails":
        return this.t.stateFails;
      case "warning":
        return this.t.stateWarning;
      case "info":
        return this.t.stateInfo;
      default:
        return this.t.stateNotChecked;
    }
  }

  _renderChecks(sec) {
    const checks = sec.checks || [];
    return html`<section aria-labelledby="md-checks">
      <h3 class="block" id="md-checks">
        ${this.t.checks}<span class="hint">${this.t.checksHint}</span>
      </h3>
      ${checks.length
        ? html`<ul class="findings checks">
            ${checks.map(
              (c) =>
                html`<li data-code="${c.code}" data-state="${c.state}">
                  <span
                    class="hax-ui-pill"
                    data-tone="${STATE_TONE[c.state] || "soon"}"
                    >${this._stateLabel(c.state)}</span
                  >
                  <span class="t"
                    >${c.title}<span class="d">${c.detail}</span></span
                  >
                </li>`,
            )}
          </ul>`
        : html`<p class="empty">${this.t.noChecks}</p>`}
    </section>`;
  }

  _renderNoDescription(sec) {
    const rows = sec.noDescription || [];
    const shown = this._limit("nodesc", rows);
    return html`<section aria-labelledby="md-nodesc">
      <h3 class="block" id="md-nodesc">
        ${this.t.noDescTitle}<span class="hint"
          >${this.t.pagesCount.replace("{n}", () => rows.length)}</span
        >
      </h3>
      ${rows.length
        ? html`<ul class="findings nodesc">
              ${shown.map(
                (r) =>
                  html`<li>
                    <span class="t">${r.title}</span>
                    ${this._openBtn(r.title, r.slug)}
                  </li>`,
              )}
            </ul>
            ${this._moreBtn("nodesc", rows)}`
        : html`<p class="empty">${this.t.noDescEmpty}</p>`}
    </section>`;
  }

  _renderTitles(sec) {
    const shared = sec.sharedTitles || [];
    const generic = sec.genericTitles || [];
    const empty = !shared.length && !generic.length;
    return html`<section aria-labelledby="md-titles">
      <h3 class="block" id="md-titles">
        ${this.t.titlesTitle}<span class="hint">${this.t.titlesHint}</span>
      </h3>
      ${empty
        ? html`<p class="empty">${this.t.noTitlesEmpty}</p>`
        : html`<ul class="findings titles">
            ${shared.map(
              (g) =>
                html`<li class="shared">
                  <div class="group">
                    <div class="group-head">
                      <span class="t">“${g.title}”</span>
                      <span class="hax-ui-pill" data-tone="warning"
                        >${this.t.sharedLabel.replace(
                          "{n}",
                          () => g.count,
                        )}</span
                      >
                    </div>
                    <ul class="group-pages">
                      ${(g.pageIds || []).map((id) => {
                        const p = this._page(id);
                        const label = p ? p.slug || p.title : id;
                        return html`<li>
                          <span class="t d">${label}</span>
                          ${p
                            ? this._openBtn(`${p.title} (${label})`, p.slug)
                            : nothing}
                        </li>`;
                      })}
                    </ul>
                  </div>
                </li>`,
            )}
            ${generic.map(
              (r) =>
                html`<li class="generic">
                  <span class="t">“${r.title}”</span>
                  <span class="hax-ui-pill" data-tone="warning"
                    >${this.t.genericLabel}</span
                  >
                  ${this._openBtn(r.title, r.slug)}
                </li>`,
            )}
          </ul>`}
    </section>`;
  }

  _renderPages(sec) {
    const rows = sec.pages || [];
    const shown = this._limit("pages", rows);
    return html`<section aria-labelledby="md-pages">
      <h3 class="block" id="md-pages">
        ${this.t.pagesTitle}<span class="hint">${this.t.pagesHint}</span>
      </h3>
      ${rows.length
        ? html`<div class="tbl-wrap">
              <table class="pages">
                <caption class="sr-only">
                  ${this.t.pagesCaption}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">${this.t.page}</th>
                    <th scope="col">${this.t.description}</th>
                    <th scope="col">${this.t.sharedTitle}</th>
                    <th scope="col">${this.t.genericTitle}</th>
                    <th scope="col">${this.t.published}</th>
                    <th scope="col">
                      <span class="sr-only">${this.t.actions}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${shown.map(
                    (p) =>
                      html`<tr data-page="${p.pageId}">
                        <td>${p.title}</td>
                        <td>
                          ${p.hasDescription
                            ? this.t.present
                            : html`<span class="warn">${this.t.missing}</span>`}
                        </td>
                        <td>
                          ${p.sharedTitle
                            ? html`<span class="warn">${this.t.yes}</span>`
                            : this.t.no}
                        </td>
                        <td>
                          ${p.genericTitle
                            ? html`<span class="warn">${this.t.yes}</span>`
                            : this.t.no}
                        </td>
                        <td>${p.published ? this.t.yes : this.t.no}</td>
                        <td>${this._openBtn(p.title, p.slug)}</td>
                      </tr>`,
                  )}
                </tbody>
              </table>
            </div>
            ${this._moreBtn("pages", rows)}`
        : html`<p class="empty">${this.t.noPages}</p>`}
    </section>`;
  }
}

globalThis.customElements.define(InsightsMetadata.tag, InsightsMetadata);
export { InsightsMetadata };

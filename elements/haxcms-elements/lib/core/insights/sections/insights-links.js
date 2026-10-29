/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { InsightsStyles } from "../insights-styles.js";

const LIMIT = 50;
const FILTERS = ["all", "errors", "warnings", "info"];
const SEVERITY_OF = { errors: "error", warnings: "warning", info: "info" };
const TONE_OF = { error: "danger", warning: "warning", info: "accent" };

/**
 * `insights-links`
 * Link health screen of Reports (Insights): link findings with a severity
 * filter, the pages and hosts the site leans on, and outside links.
 * Outside link status needs a server fetch, so it shows as Coming soon.
 *
 * @element insights-links
 * @fires insights-open-page - { slug } to visit a page
 */
class InsightsLinks extends I18NMixin(LitElement) {
  static get tag() {
    return "insights-links";
  }

  static get properties() {
    return {
      results: { type: Object, attribute: false },
      density: { type: String, reflect: true },
      _filter: { state: true },
      _expanded: { state: true },
    };
  }

  constructor() {
    super();
    this.results = null;
    this.density = "default";
    this._filter = "all";
    this._expanded = {};
    this.t = this.t || {};
    this.t = {
      ...this.t,
      keyNumbers: "Key numbers",
      unnamedLinks: "Unnamed links",
      unnamedNote: "on {n} pages",
      pageNotFound: "Links to missing pages",
      pageNotFoundNote: "internal links with no page",
      rawIds: "Raw item-ID URLs",
      ofPages: "of {n} pages",
      slugMismatch: "Slug differs from title",
      slugMismatchNote: "pages to rename",
      textbookLinks: "Textbook links",
      textbookNote: "on {n} pages",
      embeds: "Embeds",
      embedsNote: "iframes on {n} pages",
      outsideLinks: "Outside links",
      outsideNote: "to {n} hosts",
      autoNaming: "URL auto-naming",
      on: "On",
      off: "Off",
      notSet: "Not set",
      autoNamingNote: "new pages get slugs from titles",
      autoNamingOffNote: "slugs are not made from titles",
      brokenOutside: "Broken outside links",
      comingSoon: "Coming soon",
      findings: "Link findings",
      findingsHint: "From links in page HTML and page addresses in site.json",
      filterFindings: "Filter findings",
      all: "All",
      errors: "Errors",
      warnings: "Warnings",
      info: "Info",
      error: "Error",
      warning: "Warning",
      infoOne: "Info",
      finding: "Finding",
      link: "Link",
      where: "Where",
      fix: "Suggested fix",
      openPage: "Open page",
      openPageNamed: "Open page {title}",
      noFindings:
        "No link findings. Every link has a name and a working address.",
      noFindingsFiltered: "Nothing at this level.",
      showAll: "Show all {n}",
      showFewer: "Show fewer",
      leanOn: "Pages that lean on outside hosts",
      leanOnHint: "Embeds and videos per page",
      noLeanOn: "No pages depend on embeds or outside videos.",
      embedCount: "{n} embeds",
      embedOne: "1 embed",
      videoCount: "{n} videos",
      videoOne: "1 video",
      worksheet: "worksheet",
      hostCount: "{n} hosts",
      hostOne: "1 host",
      embedHosts: "Embed hosts",
      embedHostsHint: "Where iframes load from",
      noEmbedHosts: "No embeds load from other sites.",
      host: "Host",
      count: "Count",
      outsideList: "Outside links by host",
      outsideListHint: "{n} links leave the site",
      noOutside: "No links leave the site.",
      linkStatus: "Outside link status",
      statusHttp: "HTTP status of outside links and embed sources",
      statusRedirects: "Redirect chains and http to https upgrades",
      statusWeekly: "Weekly re-check and newly broken alerts",
      checkOutside: "Check outside links",
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
        .seg {
          display: inline-flex;
          flex-wrap: wrap;
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          overflow: hidden;
          margin-bottom: var(--hax-ui-gap-md);
        }
        .seg button {
          all: unset;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: var(--hax-ui-gap);
          height: calc(var(--insights-row) - 6px);
          padding: 0 var(--hax-ui-gap-md);
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }
        .seg button + button {
          border-left: 1px solid var(--hax-ui-line-strong);
        }
        .seg button[aria-pressed="true"] {
          background-color: var(--hax-ui-accent-soft);
          color: var(--hax-ui-text);
          font-weight: var(--ddd-font-weight-medium, 500);
        }
        .seg button:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: calc(-1 * var(--hax-ui-focus-width));
        }
        code {
          font-family: var(--ddd-font-mono, monospace);
          font-size: var(--hax-ui-admin-font-size-xs);
          word-break: break-all;
        }
        td.fix,
        .muted {
          color: var(--hax-ui-text-muted);
        }
        td.where {
          min-width: 160px;
        }
        .where-cell {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          justify-content: space-between;
        }
        .more {
          margin-top: var(--hax-ui-gap-md);
        }
        .soon-panel ul {
          list-style: none;
          margin: var(--hax-ui-gap-md) 0;
          padding: 0;
        }
        .soon-panel li {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          padding: var(--hax-ui-gap) 0;
        }
        .soon-panel li .t {
          flex: 1;
        }
        .soon-panel .d {
          display: block;
        }
      `,
    ];
  }

  _fmt(str, n) {
    return String(str).replace("{n}", () => n);
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
      aria-label="${this.t.openPageNamed.replace("{title}", () => title)}"
      @click="${() => this._open(slug)}"
    >
      ${this.t.openPage}
    </button>`;
  }

  /** pageId -> slug, from the page rows the analyzer keeps */
  _slugs() {
    const map = {};
    const r = this.results || {};
    const rows =
      (r.content && r.content.pages) || (r.media && r.media.pages) || [];
    rows.forEach((p) => {
      map[p.pageId] = p.slug;
    });
    return map;
  }

  _needs(key, fallback) {
    const r = this.results || {};
    const own = fallback && fallback.needs ? fallback.needs : "";
    if (own) {
      return own;
    }
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
      ${open ? this.t.showFewer : this._fmt(this.t.showAll, list.length)}
    </button>`;
  }

  _kpi(label, value, note, tone) {
    return html`<div class="kpi" data-tone="${tone || ""}">
      <span class="l">${label}</span>
      <span class="v">${value}</span>
      <span class="l">${note}</span>
    </div>`;
  }

  _plural(n, one, many) {
    return n === 1 ? one : this._fmt(many, n);
  }

  render() {
    const links = this.results && this.results.links;
    if (!links) {
      return nothing;
    }
    return html`<div class="sec">
      ${this._renderKpis(links)} ${this._renderFindings(links)}
      <div class="grid-2">
        ${this._renderLeanOn(links)} ${this._renderEmbedHosts(links)}
      </div>
      <div class="grid-2">
        ${this._renderOutside(links)} ${this._renderStatus(links)}
      </div>
    </div>`;
  }

  _renderKpis(links) {
    const k = links.kpis || {};
    const pages =
      this.results.totals && this.results.totals.pages
        ? this.results.totals.pages
        : 0;
    const hosts = links.outsideLinks ? links.outsideLinks.hosts.length : 0;
    const pathauto =
      k.pathauto === true
        ? this.t.on
        : k.pathauto === false
          ? this.t.off
          : this.t.notSet;
    const soonNeeds = this._needs("outsideLinkStatus", links.outsideLinkStatus);
    return html`<section class="kpis" aria-label="${this.t.keyNumbers}">
      ${this._kpi(
        this.t.unnamedLinks,
        k.unnamedLinks,
        this._fmt(this.t.unnamedNote, k.unnamedPages),
        k.unnamedLinks ? "danger" : "",
      )}
      ${this._kpi(
        this.t.pageNotFound,
        k.brokenInternal,
        this.t.pageNotFoundNote,
        k.brokenInternal ? "danger" : "",
      )}
      ${this._kpi(
        this.t.rawIds,
        k.rawIdPages,
        this._fmt(this.t.ofPages, pages),
        k.rawIdPages ? "warning" : "",
      )}
      ${this._kpi(
        this.t.slugMismatch,
        k.slugMismatch,
        this.t.slugMismatchNote,
        k.slugMismatch ? "warning" : "",
      )}
      ${this._kpi(
        this.t.textbookLinks,
        k.textbookLinks,
        this._fmt(this.t.textbookNote, k.textbookPages),
        "",
      )}
      ${this._kpi(
        this.t.embeds,
        k.embeds,
        this._fmt(this.t.embedsNote, k.embedPages),
        "",
      )}
      ${this._kpi(
        this.t.outsideLinks,
        k.outsideLinks,
        this._fmt(this.t.outsideNote, hosts),
        "",
      )}
      ${this._kpi(
        this.t.autoNaming,
        pathauto,
        k.pathauto === false ? this.t.autoNamingOffNote : this.t.autoNamingNote,
        k.pathauto === false ? "warning" : "",
      )}
      <div class="kpi soon-kpi" data-tone="soon" title="${soonNeeds}">
        <span class="l">${this.t.brokenOutside}</span>
        <span class="v"
          ><span class="hax-ui-pill" data-tone="soon"
            >${this.t.comingSoon}</span
          ></span
        >
        <span class="l">${soonNeeds}</span>
      </div>
    </section>`;
  }

  _renderFindings(links) {
    const counts = links.counts || { all: 0, errors: 0, warnings: 0, info: 0 };
    const all = links.findings || [];
    const rows =
      this._filter === "all"
        ? all
        : all.filter((r) => r.severity === SEVERITY_OF[this._filter]);
    const sevWord = {
      error: this.t.error,
      warning: this.t.warning,
      info: this.t.infoOne,
    };
    let body;
    if (!all.length) {
      body = html`<div class="empty">${this.t.noFindings}</div>`;
    } else if (!rows.length) {
      body = html`<div class="empty">${this.t.noFindingsFiltered}</div>`;
    } else {
      body = html`<div class="tbl-wrap">
          <table aria-label="${this.t.findings}">
            <thead>
              <tr>
                <th scope="col">${this.t.finding}</th>
                <th scope="col">${this.t.link}</th>
                <th scope="col">${this.t.where}</th>
                <th scope="col">${this.t.fix}</th>
              </tr>
            </thead>
            <tbody>
              ${this._limited("findings", rows).map(
                (r) =>
                  html`<tr data-code="${r.code}">
                    <td>
                      <span
                        class="hax-ui-pill"
                        data-tone="${TONE_OF[r.severity] || ""}"
                        ><span class="sr-only">${sevWord[r.severity]}: </span
                        >${r.label}</span
                      >
                    </td>
                    <td><code>${r.href}</code></td>
                    <td class="where">
                      <div class="where-cell">
                        <span>${r.page}</span>${this._openBtn(r.slug, r.page)}
                      </div>
                    </td>
                    <td class="fix">${r.fix}</td>
                  </tr>`,
              )}
            </tbody>
          </table>
        </div>
        ${this._moreBtn("findings", rows)}`;
    }
    return html`<section>
      <h3 class="block">
        ${this.t.findings}<span class="hint">${this.t.findingsHint}</span>
      </h3>
      ${all.length
        ? html`<div
            class="seg filters"
            role="group"
            aria-label="${this.t.filterFindings}"
          >
            ${FILTERS.map(
              (f) =>
                html`<button
                  type="button"
                  data-filter="${f}"
                  aria-pressed="${this._filter === f ? "true" : "false"}"
                  @click="${() => {
                    this._filter = f;
                  }}"
                >
                  ${this.t[f]} <span class="num">${counts[f] || 0}</span>
                </button>`,
            )}
          </div>`
        : nothing}
      ${body}
    </section>`;
  }

  _renderLeanOn(links) {
    const rows = links.leanOnHosts || [];
    const slugs = this._slugs();
    return html`<section>
      <h3 class="block">
        ${this.t.leanOn}<span class="hint">${this.t.leanOnHint}</span>
      </h3>
      ${rows.length
        ? html`<ul class="findings lean-on">
            ${rows.map((r) => {
              const parts = [];
              if (r.embeds) {
                parts.push(
                  this._plural(r.embeds, this.t.embedOne, this.t.embedCount),
                );
              }
              if (r.videos) {
                parts.push(
                  this._plural(r.videos, this.t.videoOne, this.t.videoCount),
                );
              }
              if (r.worksheets) {
                parts.push(this.t.worksheet);
              }
              if (r.hosts.length) {
                parts.push(
                  this._plural(
                    r.hosts.length,
                    this.t.hostOne,
                    this.t.hostCount,
                  ),
                );
              }
              return html`<li>
                <span class="t"
                  >${r.title}<span class="d"
                    >${parts.join(" · ")}${r.hosts.length
                      ? html` · ${r.hosts.join(", ")}`
                      : nothing}</span
                  ></span
                >${this._openBtn(slugs[r.pageId], r.title)}
              </li>`;
            })}
          </ul>`
        : html`<div class="empty">${this.t.noLeanOn}</div>`}
    </section>`;
  }

  _hostTable(key, label, rows) {
    return html`<div class="tbl-wrap">
        <table aria-label="${label}">
          <thead>
            <tr>
              <th scope="col">${this.t.host}</th>
              <th scope="col" class="num">${this.t.count}</th>
            </tr>
          </thead>
          <tbody>
            ${this._limited(key, rows).map(
              (h) =>
                html`<tr>
                  <td><code>${h.host}</code></td>
                  <td class="num">${h.count}</td>
                </tr>`,
            )}
          </tbody>
        </table>
      </div>
      ${this._moreBtn(key, rows)}`;
  }

  _renderEmbedHosts(links) {
    const rows = links.embedHosts || [];
    return html`<section class="embed-hosts">
      <h3 class="block">
        ${this.t.embedHosts}<span class="hint">${this.t.embedHostsHint}</span>
      </h3>
      ${rows.length
        ? this._hostTable("embedHosts", this.t.embedHosts, rows)
        : html`<div class="empty">${this.t.noEmbedHosts}</div>`}
    </section>`;
  }

  _renderOutside(links) {
    const out = links.outsideLinks || { total: 0, hosts: [] };
    return html`<section class="outside">
      <h3 class="block">
        ${this.t.outsideList}<span class="hint"
          >${this._fmt(this.t.outsideListHint, out.total)}</span
        >
      </h3>
      ${out.hosts.length
        ? this._hostTable("outside", this.t.outsideList, out.hosts)
        : html`<div class="empty">${this.t.noOutside}</div>`}
    </section>`;
  }

  _renderStatus(links) {
    const needs = this._needs("outsideLinkStatus", links.outsideLinkStatus);
    const schedNeeds = this._needs("schedules", null);
    return html`<section class="link-status">
      <h3 class="block">
        ${this.t.linkStatus}<span class="hax-ui-pill" data-tone="soon"
          >${this.t.comingSoon}</span
        >
      </h3>
      <div class="soon-panel">
        <ul>
          <li>
            <span class="t"
              >${this.t.statusHttp}<span class="d">${needs}</span></span
            ><span class="hax-ui-pill" data-tone="soon"
              >${this.t.comingSoon}</span
            >
          </li>
          <li>
            <span class="t"
              >${this.t.statusRedirects}<span class="d">${needs}</span></span
            ><span class="hax-ui-pill" data-tone="soon"
              >${this.t.comingSoon}</span
            >
          </li>
          ${schedNeeds
            ? html`<li>
                <span class="t"
                  >${this.t.statusWeekly}<span class="d"
                    >${schedNeeds}</span
                  ></span
                ><span class="hax-ui-pill" data-tone="soon"
                  >${this.t.comingSoon}</span
                >
              </li>`
            : nothing}
        </ul>
        <button
          type="button"
          class="sbtn check-outside"
          aria-disabled="true"
          title="${needs}"
          aria-describedby="check-needs"
        >
          ${this.t.checkOutside}
          <span class="hax-ui-pill" data-tone="soon">${this.t.comingSoon}</span>
        </button>
        <span id="check-needs" class="sr-only">${needs}</span>
      </div>
    </section>`;
  }
}

globalThis.customElements.define(InsightsLinks.tag, InsightsLinks);
export { InsightsLinks };

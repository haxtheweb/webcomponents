/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { InsightsStyles } from "../insights-styles.js";
import "../insights-url-replace.js";
import {
  LINK_STATES,
  checkLinks,
  getLinkStatus,
  linkCheckAvailable,
  linkCheckRunning,
  linkStatusSummary,
  onLinkStatusChange,
} from "../insights-link-status.js";

const LIMIT = 50;
const FILTERS = ["all", "errors", "warnings", "info"];
const SEVERITY_OF = { errors: "error", warnings: "warning", info: "info" };
const TONE_OF = { error: "danger", warning: "warning", info: "accent" };

/**
 * `insights-links`
 * Link health screen of Reports (Insights): link findings with a severity
 * filter, the pages and hosts the site leans on, and outside links.
 * Outside link status comes from this site's own server
 * (insights-link-status.js); where there is no server (a published or static
 * copy) it shows what it needs instead.
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
      _canCheck: { state: true },
      _checkProgress: { state: true },
      _checkError: { state: true },
      _statusTick: { state: true },
    };
  }

  constructor() {
    super();
    this.results = null;
    this.density = "default";
    this._filter = "all";
    this._expanded = {};
    this._canCheck = false;
    this._checkProgress = null;
    this._checkError = "";
    this._statusTick = 0;
    this.__unsubscribe = null;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      keyNumbers: "Key numbers",
      unnamedLinks: "Unnamed links",
      unnamedNote: "on {n} pages",
      onPagesOne: "on 1 page",
      pageNotFound: "Links to missing pages",
      pageNotFoundNote: "internal links with no page",
      rawIds: "Raw item-ID URLs",
      ofPages: "of {n} pages",
      ofPagesOne: "of 1 page",
      slugMismatch: "Slug differs from title",
      slugMismatchNote: "pages to rename",
      textbookLinks: "Textbook links",
      textbookNote: "on {n} pages",
      embeds: "Embeds",
      embedsNote: "iframes on {n} pages",
      embedsNoteOne: "iframes on 1 page",
      outsideLinks: "Outside links",
      outsideNote: "to {n} hosts",
      outsideNoteOne: "to 1 host",
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
      outsideListHintOne: "1 link leaves the site",
      noOutside: "No links leave the site.",
      linkStatus: "Outside link status",
      statusHttp: "HTTP status of outside links and embed sources",
      statusRedirects: "Redirect chains and http to https upgrades",
      statusWeekly: "Weekly re-check and newly broken alerts",
      checkOutside: "Check outside links",
      checkAgain: "Check again",
      notCheckedYet: "Not checked yet",
      ofChecked: "of {n} checked",
      ofCheckedOne: "of 1 checked",
      statusIntro:
        "This site's server asks each outside link for its status. Only links in these pages are checked, and nothing else is sent anywhere.",
      checking: "Checking {done} of {total}…",
      checkedAll: "Checked {n} outside links",
      checkedAllOne: "Checked 1 outside link",
      stateBroken: "Broken",
      stateCheck: "Check by hand",
      stateRedirected: "Redirected",
      stateOk: "OK",
      stateSkipped: "Not checked",
      reasonHttp: "HTTP {status}",
      reasonRefused: "Refused an automated check (HTTP {status})",
      reasonTimeout: "Took too long to answer",
      reasonDns: "No such host",
      reasonConnection: "Could not connect",
      reasonTls: "Certificate problem",
      reasonRedirects: "Too many redirects",
      reasonInvalid: "Not a valid address",
      reasonPrivate: "Private address, not checked",
      reasonNotInSite: "Not in these pages",
      reasonDeferred: "Not reached yet",
      movedTo: "Now at {url}",
      morePages: "+{n} more",
      problemsTitle: "Links to fix",
      problemsHint: "Broken, check by hand and redirected",
      problemsCaption: "Outside links that need attention",
      result: "Result",
      noProblems: "Every checked outside link answered.",
      noOutsideToCheck: "No outside links to check.",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../../../locales/", import.meta.url).href,
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this.__unsubscribe = onLinkStatusChange(() => {
      this._statusTick = this._statusTick + 1;
    });
    linkCheckAvailable().then((ok) => {
      this._canCheck = ok;
    });
  }

  disconnectedCallback() {
    if (this.__unsubscribe) {
      this.__unsubscribe();
      this.__unsubscribe = null;
    }
    super.disconnectedCallback();
  }

  /** outside links in this scan: [{ href, host, pages }] */
  _outsideUrls() {
    const links = this.results && this.results.links;
    return links && links.outsideLinks && Array.isArray(links.outsideLinks.urls)
      ? links.outsideLinks.urls
      : [];
  }

  async _checkOutside() {
    const hrefs = this._outsideUrls().map((u) => u.href);
    const summary = linkStatusSummary(hrefs);
    this._checkError = "";
    this._checkProgress = { done: 0, total: hrefs.length };
    const outcome = await checkLinks(hrefs, {
      force: summary.unchecked === 0,
      onProgress: (p) => {
        this._checkProgress = p;
      },
    });
    this._checkProgress = null;
    this._checkError = outcome && outcome.error ? outcome.error : "";
  }

  _stateLabel(state) {
    switch (state) {
      case "broken":
        return this.t.stateBroken;
      case "check":
        return this.t.stateCheck;
      case "redirected":
        return this.t.stateRedirected;
      case "ok":
        return this.t.stateOk;
      default:
        return this.t.stateSkipped;
    }
  }

  _reasonLabel(row) {
    const status =
      row.status === null || row.status === undefined ? "" : row.status;
    switch (row.reason) {
      case "http":
        return this.t.reasonHttp.replace("{status}", () => status);
      case "refused":
        return this.t.reasonRefused.replace("{status}", () => status);
      case "timeout":
        return this.t.reasonTimeout;
      case "dns":
        return this.t.reasonDns;
      case "connection":
        return this.t.reasonConnection;
      case "tls":
        return this.t.reasonTls;
      case "redirects":
        return this.t.reasonRedirects;
      case "invalid":
        return this.t.reasonInvalid;
      case "private":
        return this.t.reasonPrivate;
      case "not-in-site":
        return this.t.reasonNotInSite;
      case "deferred":
        return this.t.reasonDeferred;
      default:
        return row.finalUrl
          ? this.t.movedTo.replace("{url}", () => row.finalUrl)
          : "";
    }
  }

  static get styles() {
    return [
      ...InsightsStyles,
      css`
        /* filters: the shared segmented control, wrapping */
        .filters {
          margin-bottom: var(--hax-ui-gap-md);
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
        .soon-panel .d,
        .soon-list .d,
        .problems .d {
          display: block;
        }
        .soon-list {
          list-style: none;
          margin: var(--hax-ui-gap-md) 0 0;
          padding: 0;
        }
        .soon-list li {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
        }
        .soon-list li .t {
          flex: 1;
        }
        .status-bar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--hax-ui-gap-md);
        }
        .check-error {
          margin: var(--hax-ui-gap-md) 0 0;
        }
        .state-counts {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          gap: var(--hax-ui-gap-md);
          margin: var(--hax-ui-gap-md) 0;
          padding: 0;
        }
        .state-counts li {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap);
        }
        /* the "Links to fix" sub-heading reads like h3.block, a size down */
        h4.sub {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          margin: var(--hax-ui-gap-md) 0;
          font-size: var(--hax-ui-admin-font-size);
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        h4.sub .hint {
          font-weight: var(--ddd-font-weight-regular, 400);
          color: var(--hax-ui-text-muted);
          font-size: var(--hax-ui-admin-font-size-xs);
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
      ${this._renderReplace(links)}
    </div>`;
  }

  _renderReplace(links) {
    const save = links.urlSave || {};
    return html`<insights-url-replace
      .blockUrls="${links.blockUrls || []}"
      note="${save.note || ""}"
      max-pages="${save.maxPagesPerSave || 20}"
      density="${this.density}"
    ></insights-url-replace>`;
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
        this._plural(k.unnamedPages, this.t.onPagesOne, this.t.unnamedNote),
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
        this._plural(pages, this.t.ofPagesOne, this.t.ofPages),
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
        this._plural(k.textbookPages, this.t.onPagesOne, this.t.textbookNote),
        "",
      )}
      ${this._kpi(
        this.t.embeds,
        k.embeds,
        this._plural(k.embedPages, this.t.embedsNoteOne, this.t.embedsNote),
        "",
      )}
      ${this._kpi(
        this.t.outsideLinks,
        k.outsideLinks,
        this._plural(hosts, this.t.outsideNoteOne, this.t.outsideNote),
        "",
      )}
      ${this._kpi(
        this.t.autoNaming,
        pathauto,
        k.pathauto === false ? this.t.autoNamingOffNote : this.t.autoNamingNote,
        k.pathauto === false ? "warning" : "",
      )}
      ${
        this._canCheck
          ? this._brokenKpi()
          : html`<div
              class="kpi soon-kpi"
              data-tone="soon"
              title="${soonNeeds}"
            >
              <span class="l">${this.t.brokenOutside}</span>
              <span class="v"
                ><span class="hax-ui-pill" data-tone="soon"
                  >${this.t.comingSoon}</span
                ></span
              >
              <span class="l">${soonNeeds}</span>
            </div>`
      }
    </section>`;
  }

  _brokenKpi() {
    const summary = linkStatusSummary(this._outsideUrls().map((u) => u.href));
    if (!summary.checked) {
      return this._kpi(this.t.brokenOutside, "–", this.t.notCheckedYet, "");
    }
    return html`<div
      class="kpi broken-kpi"
      data-tone="${summary.broken ? "danger" : ""}"
    >
      <span class="l">${this.t.brokenOutside}</span>
      <span class="v">${summary.broken}</span>
      <span class="l"
        >${this._plural(summary.checked, this.t.ofCheckedOne, this.t.ofChecked)}</span
      >
    </div>`;
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
      body = html`<div class="hax-ui-empty empty">${this.t.noFindings}</div>`;
    } else if (!rows.length) {
      body = html`<div class="hax-ui-empty empty">
        ${this.t.noFindingsFiltered}
      </div>`;
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
      ${
        all.length
          ? html`<div
              class="hax-ui-seg wrap filters"
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
          : nothing
      }
      ${body}
    </section>`;
  }

  _renderLeanOn(links) {
    const rows = links.leanOnHosts || [];
    return html`<section>
      <h3 class="block">
        ${this.t.leanOn}<span class="hint">${this.t.leanOnHint}</span>
      </h3>
      ${
        rows.length
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
                      >${parts.join(" · ")}${
                        r.hosts.length
                          ? html` · ${r.hosts.join(", ")}`
                          : nothing
                      }</span
                    ></span
                  >${this._openBtn(r.slug, r.title)}
                </li>`;
              })}
            </ul>`
          : html`<div class="hax-ui-empty empty">${this.t.noLeanOn}</div>`
      }
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
      ${
        rows.length
          ? this._hostTable("embedHosts", this.t.embedHosts, rows)
          : html`<div class="hax-ui-empty empty">${this.t.noEmbedHosts}</div>`
      }
    </section>`;
  }

  _renderOutside(links) {
    const out = links.outsideLinks || { total: 0, hosts: [] };
    return html`<section class="outside">
      <h3 class="block">
        ${this.t.outsideList}<span class="hint"
          >${this._plural(
            out.total,
            this.t.outsideListHintOne,
            this.t.outsideListHint,
          )}</span
        >
      </h3>
      ${
        out.hosts.length
          ? this._hostTable("outside", this.t.outsideList, out.hosts)
          : html`<div class="hax-ui-empty empty">${this.t.noOutside}</div>`
      }
    </section>`;
  }

  _renderStatus(links) {
    return this._canCheck
      ? this._renderStatusLive(links)
      : this._renderStatusSoon(links);
  }

  _renderStatusLive() {
    const urls = this._outsideUrls();
    const summary = linkStatusSummary(urls.map((u) => u.href));
    const busy = !!this._checkProgress || linkCheckRunning();
    const p = this._checkProgress;
    const schedNeeds = this._needs("schedules", null);
    const problems = urls
      .map((u) => ({ url: u, row: getLinkStatus(u.href) }))
      .filter(
        (x) =>
          x.row &&
          (x.row.state === "broken" ||
            x.row.state === "check" ||
            x.row.state === "redirected" ||
            (x.row.state === "skipped" && x.row.reason === "private")),
      )
      .sort(
        (a, b) =>
          LINK_STATES.indexOf(a.row.state) - LINK_STATES.indexOf(b.row.state) ||
          b.url.pages.length - a.url.pages.length,
      );
    return html`<section
      class="link-status"
      aria-busy="${busy ? "true" : "false"}"
    >
      <h3 class="block">${this.t.linkStatus}</h3>
      <p class="help">${this.t.statusIntro}</p>
      <div class="status-bar">
        <button
          type="button"
          class="sbtn check-outside"
          ?disabled="${busy || !urls.length}"
          @click="${this._checkOutside}"
        >
          ${summary.checked && !summary.unchecked ? this.t.checkAgain : this.t.checkOutside}
        </button>
        <span class="status-text" role="status" aria-live="polite"
          >${
            busy && p
              ? this.t.checking
                  .replace("{done}", () => p.done)
                  .replace("{total}", () => p.total)
              : summary.checked
                ? this._plural(
                    summary.checked,
                    this.t.checkedAllOne,
                    this.t.checkedAll,
                  )
                : !urls.length
                  ? this.t.noOutsideToCheck
                  : ""
          }</span
        >
      </div>
      ${
        this._checkError
          ? html`<p
              class="hax-ui-message check-error"
              data-tone="danger"
              role="alert"
            >
              ${this._checkError}
            </p>`
          : nothing
      }
      ${
        summary.checked
          ? html`<ul class="state-counts" aria-label="${this.t.linkStatus}">
              ${LINK_STATES.map(
                (state) =>
                  html`<li data-state="${state}">
                    <span
                      class="hax-ui-pill"
                      data-tone="${
                        state === "broken"
                          ? "danger"
                          : state === "check" || state === "redirected"
                            ? "warning"
                            : state === "ok"
                              ? "success"
                              : ""
                      }"
                      >${summary[state]}</span
                    >
                    ${this._stateLabel(state)}
                  </li>`,
              )}
            </ul>`
          : nothing
      }
      ${summary.checked ? this._renderProblems(problems) : nothing}
      ${
        schedNeeds
          ? html`<ul class="soon-list">
              <li>
                <span class="t"
                  >${this.t.statusWeekly}<span class="d"
                    >${schedNeeds}</span
                  ></span
                ><span class="hax-ui-pill" data-tone="soon"
                  >${this.t.comingSoon}</span
                >
              </li>
            </ul>`
          : nothing
      }
    </section>`;
  }

  _renderProblems(problems) {
    if (!problems.length) {
      return html`<div class="hax-ui-empty empty no-problems">
        ${this.t.noProblems}
      </div>`;
    }
    return html`<h4 class="sub">
        ${this.t.problemsTitle}<span class="hint">${this.t.problemsHint}</span>
      </h4>
      <div class="tbl-wrap">
        <table class="problems" aria-label="${this.t.problemsCaption}">
          <thead>
            <tr>
              <th scope="col">${this.t.link}</th>
              <th scope="col">${this.t.result}</th>
              <th scope="col">${this.t.where}</th>
            </tr>
          </thead>
          <tbody>
            ${this._limited("problems", problems).map((x) => {
              const first = x.url.pages[0];
              const more = x.url.pages.length - 1;
              return html`<tr data-state="${x.row.state}">
                <td><code>${x.url.href}</code></td>
                <td>
                  <span
                    class="hax-ui-pill"
                    data-tone="${x.row.state === "broken" ? "danger" : "warning"}"
                    >${this._stateLabel(x.row.state)}</span
                  >
                  <span class="d">${this._reasonLabel(x.row)}</span>
                </td>
                <td class="where">
                  ${
                    first
                      ? html`<div class="where-cell">
                          <span
                            >${first.title}${
                              more > 0
                                ? html` <span class="muted"
                                    >${this._fmt(this.t.morePages, more)}</span
                                  >`
                                : nothing
                            }</span
                          >${this._openBtn(first.slug, first.title)}
                        </div>`
                      : nothing
                  }
                </td>
              </tr>`;
            })}
          </tbody>
        </table>
      </div>
      ${this._moreBtn("problems", problems)}`;
  }

  _renderStatusSoon(links) {
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
          ${
            schedNeeds
              ? html`<li>
                  <span class="t"
                    >${this.t.statusWeekly}<span class="d"
                      >${schedNeeds}</span
                    ></span
                  ><span class="hax-ui-pill" data-tone="soon"
                    >${this.t.comingSoon}</span
                  >
                </li>`
              : nothing
          }
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

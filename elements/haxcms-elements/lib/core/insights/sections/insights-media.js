/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { InsightsStyles } from "../insights-styles.js";

const LIMIT = 50;

/**
 * `insights-media`
 * Media screen of Reports (Insights): videos, embeds, images and tables
 * found in page HTML, per page and per section, and how many of them the
 * site.json media index knows about. Video length and rebuilding the index
 * need the server, so they show as Coming soon.
 *
 * @element insights-media
 * @fires insights-open-page - { slug } to visit a page
 */
class InsightsMedia extends I18NMixin(LitElement) {
  static get tag() {
    return "insights-media";
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
      videos: "Videos",
      videosNote: "on {n} of {total} pages",
      embeds: "Embeds",
      embedsNote: "iframes on {n} pages",
      images: "Images",
      tables: "Tables",
      tablesNote: "{n} without header cells",
      noMedia: "No media",
      noMediaNote: "pages of {n}",
      videoMinutes: "Video minutes",
      comingSoon: "Coming soon",
      videosPerPage: "Videos per page",
      pagesHint: "{n} pages",
      videosPerPageLabel: "{label} videos",
      videoPerPageOne: "1 video",
      bucketText: "{label}: {n} pages",
      pagesWithoutMedia: "Pages with no media",
      allHaveMedia: "Every page has a video, embed or image.",
      openPage: "Open page",
      openPageNamed: "Open page {title}",
      showAll: "Show all {n}",
      showFewer: "Show fewer",
      bySection: "Media by section",
      bySectionHint: "Videos, embeds and images",
      section: "Section",
      total: "Total",
      sectionAria: "{name}: {v} videos, {e} embeds, {i} images",
      noSections: "No media in any section yet.",
      mediaIndex: "Media index in site.json",
      mediaIndexHint: "Used by search, link previews and llms.txt",
      media: "Media",
      inHtml: "In page HTML",
      inIndex: "In site.json index",
      gap: "Gap",
      missing: "{n} missing",
      inSync: "In sync",
      rebuildHelp: "Rebuilding re-indexes every page without changing content.",
      rebuildIndex: "Rebuild index",
      lengthTitle: "Video length needs a server lookup.",
      lengthBody:
        "Until then, video counts come from the page HTML and lengths are not shown.",
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
        .cols {
          list-style: none;
          margin: 0;
          padding: var(--hax-ui-gap-md) 0 0;
          display: flex;
          align-items: flex-end;
          gap: var(--hax-ui-gap-lg);
          min-height: 160px;
        }
        .cols li {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--hax-ui-gap);
          font-size: var(--hax-ui-admin-font-size-xs);
          min-width: 0;
        }
        .cols .col {
          width: 100%;
          max-width: 56px;
          border-radius: var(--hax-ui-radius) var(--hax-ui-radius) 0 0;
          background-color: var(--hax-ui-accent);
        }
        .cols .n {
          font-weight: var(--ddd-font-weight-bold, 700);
          font-variant-numeric: tabular-nums;
        }
        .cols .lbl {
          color: var(--hax-ui-text-muted);
          text-align: center;
        }
        .stack {
          display: flex;
          height: 10px;
          border-radius: 5px;
          overflow: hidden;
          background-color: var(--hax-ui-hover);
        }
        .stack span {
          height: 100%;
        }
        .seg-v,
        .key-v {
          background-color: var(--hax-ui-accent);
        }
        .seg-e,
        .key-e {
          background-color: var(--insights-warning);
        }
        .seg-i,
        .key-i {
          background-color: var(--hax-ui-line-strong);
        }
        .legend {
          display: inline-flex;
          gap: var(--hax-ui-gap-md);
          font-weight: var(--ddd-font-weight-regular, 400);
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }
        .legend span {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .legend i {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 2px;
        }
        .sec-name {
          font-family: var(--ddd-font-mono, monospace);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .rebuild {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          margin-top: var(--hax-ui-gap-md);
        }
        .rebuild p.help {
          margin: 0;
        }
        .needs {
          color: var(--hax-ui-text-muted);
          font-size: var(--hax-ui-admin-font-size-xs);
        }
        .more {
          margin-top: var(--hax-ui-gap-md);
        }
        .soon-panel {
          display: flex;
          gap: var(--hax-ui-gap-md);
          align-items: flex-start;
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

  _slugs() {
    const map = {};
    const r = this.results || {};
    const rows =
      (r.media && r.media.pages) || (r.content && r.content.pages) || [];
    rows.forEach((p) => {
      map[p.pageId] = p.slug;
    });
    return map;
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
    const media = this.results && this.results.media;
    if (!media) {
      return nothing;
    }
    return html`<div class="sec">
      ${this._renderKpis(media)}
      <div class="grid-2">
        ${this._renderVpp(media)} ${this._renderNoMedia(media)}
      </div>
      ${this._renderBySection(media)} ${this._renderIndex(media)}
      ${this._renderLengthSoon(media)}
    </div>`;
  }

  _renderKpis(media) {
    const k = media.kpis || {};
    const pages =
      this.results.totals && this.results.totals.pages
        ? this.results.totals.pages
        : 0;
    const byTag = k.imagesByTag || {};
    const tagNote = Object.keys(byTag)
      .sort((a, b) => byTag[b] - byTag[a])
      .map((tag) => `${byTag[tag]} ${tag}`)
      .join(" · ");
    const needs = this._needs("videoDuration", media.videoMinutes);
    return html`<section class="kpis" aria-label="${this.t.keyNumbers}">
      ${this._kpi(
        this.t.videos,
        k.videos,
        this._fmt(this.t.videosNote, { n: k.videoPages, total: pages }),
        "",
      )}
      ${this._kpi(
        this.t.embeds,
        k.embeds,
        this._fmt(this.t.embedsNote, { n: k.embedPages }),
        "",
      )}
      ${this._kpi(this.t.images, k.images, tagNote, "")}
      ${this._kpi(
        this.t.tables,
        k.tables,
        this._fmt(this.t.tablesNote, { n: k.tablesWithoutHeaders }),
        k.tablesWithoutHeaders ? "warning" : "",
      )}
      ${this._kpi(
        this.t.noMedia,
        k.noMedia,
        this._fmt(this.t.noMediaNote, { n: pages }),
        k.noMedia ? "warning" : "",
      )}
      <div class="kpi soon-kpi" data-tone="soon" title="${needs}">
        <span class="l">${this.t.videoMinutes}</span>
        <span class="v"
          ><span class="hax-ui-pill" data-tone="soon"
            >${this.t.comingSoon}</span
          ></span
        >
        <span class="l">${needs}</span>
      </div>
    </section>`;
  }

  _bucketLabel(label) {
    return label === "1"
      ? this.t.videoPerPageOne
      : this._fmt(this.t.videosPerPageLabel, { label: label });
  }

  _renderVpp(media) {
    const buckets = media.videosPerPage || [];
    const max = buckets.reduce((m, b) => Math.max(m, b.count), 0) || 1;
    const pages =
      this.results.totals && this.results.totals.pages
        ? this.results.totals.pages
        : 0;
    return html`<section class="vpp">
      <h3 class="block">
        ${this.t.videosPerPage}<span class="hint"
          >${this._fmt(this.t.pagesHint, { n: pages })}</span
        >
      </h3>
      <ul class="cols" aria-label="${this.t.videosPerPage}">
        ${buckets.map(
          (b) =>
            html`<li data-bucket="${b.label}">
              <span class="sr-only"
                >${this._fmt(this.t.bucketText, {
                  label: this._bucketLabel(b.label),
                  n: b.count,
                })}</span
              >
              <span class="n" aria-hidden="true">${b.count}</span>
              <span
                class="col"
                aria-hidden="true"
                style="height: ${Math.max(
                  Math.round((b.count / max) * 120),
                  b.count ? 4 : 1,
                )}px"
              ></span>
              <span class="lbl" aria-hidden="true"
                >${this._bucketLabel(b.label)}</span
              >
            </li>`,
        )}
      </ul>
    </section>`;
  }

  _renderNoMedia(media) {
    const rows = media.noMedia || [];
    const slugs = this._slugs();
    return html`<section class="no-media">
      <h3 class="block">
        ${this.t.pagesWithoutMedia}<span class="hint"
          >${this._fmt(this.t.pagesHint, { n: rows.length })}</span
        >
      </h3>
      ${rows.length
        ? html`<ul class="findings">
              ${this._limited("noMedia", rows).map(
                (r) =>
                  html`<li>
                    <span class="t">${r.title}</span>${this._openBtn(
                      slugs[r.pageId],
                      r.title,
                    )}
                  </li>`,
              )}
            </ul>
            ${this._moreBtn("noMedia", rows)}`
        : html`<div class="empty">${this.t.allHaveMedia}</div>`}
    </section>`;
  }

  _renderBySection(media) {
    const rows = (media.bySection || []).filter((s) => s.total > 0);
    const max = rows.reduce((m, s) => Math.max(m, s.total), 0) || 1;
    const w = (n) => `${((n / max) * 100).toFixed(1)}%`;
    return html`<section class="by-section">
      <h3 class="block">
        ${this.t.bySection}
        <span class="legend" aria-hidden="true">
          <span><i class="key-v"></i>${this.t.videos}</span>
          <span><i class="key-e"></i>${this.t.embeds}</span>
          <span><i class="key-i"></i>${this.t.images}</span>
        </span>
      </h3>
      ${rows.length
        ? html`<div class="bars">
            ${rows.map(
              (s) =>
                html`<div class="bar">
                  <span class="sec-name" title="${s.name}">${s.name}</span>
                  <div
                    class="stack"
                    role="img"
                    aria-label="${this._fmt(this.t.sectionAria, {
                      name: s.name,
                      v: s.videos,
                      e: s.embeds,
                      i: s.images,
                    })}"
                  >
                    <span class="seg-v" style="width: ${w(s.videos)}"></span>
                    <span class="seg-e" style="width: ${w(s.embeds)}"></span>
                    <span class="seg-i" style="width: ${w(s.images)}"></span>
                  </div>
                  <span class="num">${s.total}</span>
                </div>`,
            )}
          </div>`
        : html`<div class="empty">${this.t.noSections}</div>`}
    </section>`;
  }

  _renderIndex(media) {
    const idx = media.mediaIndex || {};
    const needs = this._needs("mediaIndexRebuild", media.rebuildIndex);
    const row = (label, d) => {
      if (!d) {
        return nothing;
      }
      return html`<tr>
        <th scope="row">${label}</th>
        <td class="num">${d.html}</td>
        <td class="num">${d.index}</td>
        <td>
          ${d.missing
            ? html`<span class="hax-ui-pill" data-tone="warning"
                >${this._fmt(this.t.missing, { n: d.missing })}</span
              >`
            : html`<span class="hax-ui-pill" data-tone="success"
                >${this.t.inSync}</span
              >`}
        </td>
      </tr>`;
    };
    return html`<section class="media-index">
      <h3 class="block">
        ${this.t.mediaIndex}<span class="hint">${this.t.mediaIndexHint}</span>
      </h3>
      <div class="tbl-wrap">
        <table aria-label="${this.t.mediaIndex}">
          <thead>
            <tr>
              <th scope="col">${this.t.media}</th>
              <th scope="col" class="num">${this.t.inHtml}</th>
              <th scope="col" class="num">${this.t.inIndex}</th>
              <th scope="col">${this.t.gap}</th>
            </tr>
          </thead>
          <tbody>
            ${row(this.t.videos, idx.videos)} ${row(this.t.images, idx.images)}
          </tbody>
        </table>
      </div>
      <div class="rebuild">
        <p class="help">${this.t.rebuildHelp}</p>
        <button
          type="button"
          class="sbtn rebuild-index"
          aria-disabled="true"
          title="${needs}"
          aria-describedby="rebuild-needs"
        >
          ${this.t.rebuildIndex}
          <span class="hax-ui-pill" data-tone="soon">${this.t.comingSoon}</span>
        </button>
        <span id="rebuild-needs" class="needs">${needs}</span>
      </div>
    </section>`;
  }

  _renderLengthSoon(media) {
    const needs = this._needs("videoDuration", media.videoMinutes);
    return html`<div class="soon-panel video-length" role="note">
      <span class="hax-ui-pill" data-tone="soon">${this.t.comingSoon}</span>
      <div>
        <strong>${this.t.lengthTitle}</strong> ${needs}. ${this.t.lengthBody}
      </div>
    </div>`;
  }
}

globalThis.customElements.define(InsightsMedia.tag, InsightsMedia);
export { InsightsMedia };

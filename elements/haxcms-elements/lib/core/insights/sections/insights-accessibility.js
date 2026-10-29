/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { InsightsStyles } from "../insights-styles.js";
import { altStatus } from "../insights-analyzer.js";
import { loadInsightsSpec } from "../insights-loader.js";

const LIST_LIMIT = 50;
const ALT_TONE = { fix: "danger", check: "warning", ok: "success" };
const STATE_TONE = { fails: "danger", check: "warning", passes: "success" };

/**
 * `insights-accessibility`
 * Accessibility screen of Reports (Insights): WCAG 2.0 AA checks a script
 * can make from stored HTML, heading order, theme contrast and an alt text
 * review table whose status updates as a person types. Edits stay on this
 * screen; saving many pages at once is not available yet.
 * See haxtheweb/issues#3180.
 *
 * @fires insights-open-page - detail `{ slug }` to visit a page
 * @element insights-accessibility
 */
class InsightsAccessibility extends I18NMixin(LitElement) {
  static get tag() {
    return "insights-accessibility";
  }

  static get properties() {
    return {
      /** the whole results object from the Insights analyzer */
      results: { type: Object, attribute: false },
      density: { type: String, reflect: true },
      /** insights rules; loaded from insights-spec.json when not given */
      spec: { type: Object, attribute: false },
      _edits: { state: true },
      _filter: { state: true },
      _pinned: { state: true },
      _critFilter: { state: true },
      _showAllAlt: { state: true },
      _showAllHeadings: { state: true },
      _announce: { state: true },
    };
  }

  constructor() {
    super();
    this.results = null;
    this.density = "default";
    this.spec = null;
    this._edits = {};
    this._filter = "all";
    this._pinned = {};
    this._critFilter = "all";
    this._showAllAlt = false;
    this._showAllHeadings = false;
    this._announce = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      keyNumbers: "Key numbers",
      errors: "Errors",
      errorsNote: "counted in the checks below",
      imagesToReview: "Images to review",
      imagesToReviewNote: "{fix} to fix · {check} to check",
      ofTotal: "{n} / {total}",
      untitledIframes: "Iframes without title",
      onPages: "on {n} pages",
      onPagesOne: "on 1 page",
      videosWithoutTrack: "Videos without track",
      onYoutube: "{n} on YouTube",
      headingErrors: "Heading errors",
      headingErrorsNote: "pages: {h1} extra h1 · {skips} skipped levels",
      themeContrast: "Theme contrast",
      ratio: "{n}:1",
      contrastNote: "{hex} with white text · {verdict}",
      captionsOnYoutube: "Captions on YouTube",
      comingSoon: "Coming soon",
      altTitle: "Image alt text review",
      altHint: "Pattern checks only. A person decides what the image needs.",
      filterImages: "Filter images",
      all: "All",
      fix: "Fix",
      check: "Check",
      ok: "Looks OK",
      editedNote: "{n} edited, not saved",
      editHint:
        "Type in a field to try a new alt; the status updates as you type",
      discard: "Discard edits",
      saveAlt: "Save alt text",
      notSaved:
        "Edits are not saved yet. They stay on this screen until you leave it; Open page fixes one image now in the editor.",
      altCaption: "Images and their alt text",
      preview: "Preview",
      imageAndPage: "Image and page",
      altText: "Alt text",
      status: "Status",
      actions: "Actions",
      altFor: "Alt text for {file} on {page}",
      noAltAttr: "no alt attribute",
      emptyAlt: 'alt=""',
      characters: "{n} characters",
      characterOne: "1 character",
      altLengthOver: "{n} characters, over {max}",
      edited: "edited",
      insideLink: "inside a link",
      hasCaption: "has caption",
      openPage: "Open page",
      openPageLabel: "Open page: {title}",
      showAll: "Show all {n}",
      noImages: "No images on these pages.",
      noImagesInFilter: "No images in this group.",
      statusChanged: "{file}: {status}, {reason}",
      wcagTitle: "WCAG 2.0 AA checks",
      wcagHint: "Static checks of the stored HTML and site.json",
      filterChecks: "Filter checks",
      fails: "Fails",
      passes: "Passes",
      wcagCaption: "WCAG 2.0 AA success criteria",
      sc: "SC",
      criterion: "Criterion",
      result: "Result",
      found: "What we found",
      how: "How it is counted",
      noChecksInFilter: "No checks in this group.",
      headingTitle: "Heading order errors",
      headingPages: "{n} pages",
      headingPagesOne: "1 page",
      noHeadingErrors:
        "No heading order errors: every page steps down in order.",
      contrastTitle: "Theme contrast",
      contrastHint: "Theme colour against text; AA needs {n}:1",
      white: "White",
      black: "Black",
      textOn: "{fg} text on {bg}",
      themeWhite: "Theme colour with white text",
      themeBlack: "The same colour with dark text",
      dddWhite: "DDD default {name}, if the theme colour is dropped",
      noTheme: "No theme colour set",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../../../locales/", import.meta.url).href,
    });
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.spec) {
      loadInsightsSpec()
        .then((spec) => {
          if (!this.spec) {
            this.spec = spec;
          }
        })
        .catch(() => {
          // without rules, edited rows keep their scanned status
        });
    }
  }

  willUpdate(changed) {
    if (changed.has("results") && changed.get("results") !== undefined) {
      this._edits = {};
      this._pinned = {};
    }
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
        }
        .seg button {
          all: unset;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: var(--hax-ui-gap);
          min-height: calc(var(--insights-row) - 6px);
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
        .toolbar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          margin-bottom: var(--hax-ui-gap-md);
        }
        .toolbar .grow {
          flex: 1;
          min-width: 0;
          color: var(--hax-ui-text-muted);
          font-size: var(--hax-ui-admin-font-size-xs);
        }
        .thumb {
          display: block;
          width: 40px;
          height: 40px;
          object-fit: cover;
          border-radius: var(--hax-ui-radius);
          background-color: var(--hax-ui-hover);
        }
        td {
          padding-top: var(--hax-ui-gap);
          padding-bottom: var(--hax-ui-gap);
        }
        .meta {
          display: block;
          color: var(--hax-ui-text-muted);
          font-size: var(--hax-ui-admin-font-size-xs);
        }
        .alt-input {
          width: 100%;
          min-width: 160px;
          height: calc(var(--insights-row) - 4px);
          padding: 0 var(--hax-ui-gap-md);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          background-color: var(--hax-ui-surface);
        }
        .alt-input[data-tone="danger"] {
          border-color: var(--hax-ui-danger);
        }
        .alt-col {
          width: 36%;
        }
        .file {
          word-break: break-all;
        }
        .note {
          margin: var(--hax-ui-gap-md) 0 0;
          color: var(--hax-ui-text-muted);
          font-size: var(--hax-ui-admin-font-size-xs);
        }
        .more {
          margin-top: var(--hax-ui-gap-md);
        }
        .chips {
          display: inline-flex;
          flex-wrap: wrap;
          gap: var(--hax-ui-gap);
        }
        .swatch {
          flex: none;
          width: 20px;
          height: 20px;
          border-radius: var(--hax-ui-radius);
          box-shadow: inset 0 0 0 1px var(--hax-ui-line-strong);
        }
        td.found {
          white-space: normal;
          min-width: 220px;
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

  _p(n, one, many) {
    return n === 1 ? one : this._f(many, { n: this._n(n) });
  }

  _th(key, fallback) {
    const t = (this.results && this.results.thresholds) || {};
    return typeof t[key] === "number" ? t[key] : fallback;
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

  _altLabel(status) {
    return status === "fix"
      ? this.t.fix
      : status === "check"
        ? this.t.check
        : this.t.ok;
  }

  /** each alt row with its current (possibly edited) alt and live status */
  _altRows() {
    const a = (this.results && this.results.accessibility) || {};
    const rows = a.altRows || [];
    return rows.map((row, i) => {
      const edited = Object.prototype.hasOwnProperty.call(this._edits, i);
      const alt = edited ? this._edits[i] : row.alt;
      let status = row.status;
      let reason = row.reasonText;
      if (edited && this.spec) {
        const st = altStatus(
          alt,
          { inLink: row.inLink, file: row.file },
          this.spec,
        );
        status = st.status;
        reason = st.text;
      }
      return { i, row, alt, edited, status, reason };
    });
  }

  _onAltInput(e, item) {
    const value = e.target.value;
    const orig = item.row.alt;
    const edits = Object.assign({}, this._edits);
    if (value === orig || (orig === null && value === "")) {
      delete edits[item.i];
    } else {
      edits[item.i] = value;
    }
    this._edits = edits;
    this._pinned = Object.assign({}, this._pinned, { [item.i]: true });
    if (this.spec) {
      const next =
        value === orig || (orig === null && value === "")
          ? { status: item.row.status, text: item.row.reasonText }
          : altStatus(
              value,
              { inLink: item.row.inLink, file: item.row.file },
              this.spec,
            );
      if (next.status !== item.status) {
        this._announce = this._f(this.t.statusChanged, {
          file: item.row.file,
          status: this._altLabel(next.status),
          reason: next.text,
        });
      }
    }
  }

  _onAltKeydown(e, item) {
    if (e.key === "Escape" && item.edited) {
      e.preventDefault();
      e.stopPropagation();
      const edits = Object.assign({}, this._edits);
      delete edits[item.i];
      this._edits = edits;
      e.target.value = item.row.alt === null ? "" : item.row.alt;
    }
  }

  _setFilter(id) {
    this._filter = id;
    this._pinned = {};
  }

  render() {
    const r = this.results;
    if (!r || !r.accessibility) {
      return nothing;
    }
    const items = this._altRows();
    return html`<div class="sec">
      ${this._renderKpis(r.accessibility, items)}
      ${this._renderAlt(r.accessibility, items)}
      ${this._renderCriteria(r.accessibility)}
      <div class="grid-2">
        ${this._renderHeadings(r.accessibility)}
        ${this._renderContrast(r.accessibility)}
      </div>
      <div class="sr-only" role="status" aria-live="polite">
        ${this._announce}
      </div>
    </div>`;
  }

  _renderKpis(a, items) {
    const k = a.kpis || {};
    const fix = items.filter((x) => x.status === "fix").length;
    const check = items.filter((x) => x.status === "check").length;
    const tc = k.themeContrast || {};
    const yt = a.youtubeCaptions || {};
    const tiles = [
      {
        l: this.t.errors,
        v: this._n(a.errors),
        n: this.t.errorsNote,
        tone: a.errors ? "danger" : "",
      },
      {
        l: this.t.imagesToReview,
        v: this._f(this.t.ofTotal, {
          n: this._n(fix + check),
          total: this._n(items.length),
        }),
        n: this._f(this.t.imagesToReviewNote, { fix: fix, check: check }),
        tone: fix ? "danger" : check ? "warning" : "",
      },
      {
        l: this.t.untitledIframes,
        v: this._n(k.untitledIframes),
        n: this._p(k.untitledIframePages, this.t.onPagesOne, this.t.onPages),
        tone: k.untitledIframes ? "danger" : "",
      },
      {
        l: this.t.videosWithoutTrack,
        v: this._n(k.videosWithoutTrack),
        n: this._f(this.t.onYoutube, { n: this._n(k.youtubeVideos) }),
        tone: k.videosWithoutTrack ? "warning" : "",
      },
      {
        l: this.t.headingErrors,
        v: this._n(k.headingErrorPages),
        n: this._f(this.t.headingErrorsNote, {
          h1: this._n(k.extraH1Pages),
          skips: this._n(k.skipPages),
        }),
        tone: k.headingErrorPages ? "danger" : "",
      },
      {
        l: this.t.themeContrast,
        v:
          tc.ratio === null || tc.ratio === undefined
            ? "–"
            : this._f(this.t.ratio, { n: tc.ratio }),
        n: this._f(this.t.contrastNote, {
          hex: tc.hex || "",
          verdict: tc.passes ? this.t.passes : this.t.fails,
        }),
        tone: tc.passes ? "" : "danger",
      },
    ];
    return html`<section class="kpis" aria-label="${this.t.keyNumbers}">
      ${tiles.map(
        (t) =>
          html`<div class="kpi" data-tone="${t.tone}">
            <span class="l">${t.l}</span>
            <span class="v">${t.v}</span>
            <span class="l">${t.n}</span>
          </div>`,
      )}
      <div class="kpi" data-tone="soon">
        <span class="l">${this.t.captionsOnYoutube}</span>
        <span class="v"
          ><span class="hax-ui-pill" data-tone="soon"
            >${this.t.comingSoon}</span
          ></span
        >
        <span class="l">${yt.needs || ""}</span>
      </div>
    </section>`;
  }

  _renderAlt(a, items) {
    const counts = { all: items.length, fix: 0, check: 0, ok: 0 };
    items.forEach((x) => {
      counts[x.status]++;
    });
    const shown = items.filter(
      (x) =>
        this._filter === "all" ||
        x.status === this._filter ||
        this._pinned[x.i],
    );
    const limited = this._showAllAlt ? shown : shown.slice(0, LIST_LIMIT);
    const editedCount = Object.keys(this._edits).length;
    const save = a.bulkAltSave || {};
    return html`<section aria-labelledby="alt-title">
      <h3 class="block" id="alt-title">
        ${this.t.altTitle} <span class="hint">${this.t.altHint}</span>
      </h3>
      <div class="toolbar">
        <div
          class="seg alt-filter"
          role="group"
          aria-label="${this.t.filterImages}"
        >
          ${["all", "fix", "check", "ok"].map(
            (id) =>
              html`<button
                type="button"
                data-filter="${id}"
                aria-pressed="${this._filter === id ? "true" : "false"}"
                @click="${() => this._setFilter(id)}"
              >
                ${id === "all" ? this.t.all : this._altLabel(id)}
                <span class="num">${counts[id]}</span>
              </button>`,
          )}
        </div>
        <span class="grow edited-note"
          >${editedCount
            ? this._f(this.t.editedNote, { n: editedCount })
            : this.t.editHint}</span
        >
        <button
          type="button"
          class="sbtn discard"
          ?disabled="${!editedCount}"
          @click="${() => {
            this._edits = {};
            this._announce = "";
          }}"
        >
          ${this.t.discard}
        </button>
        <button
          type="button"
          class="sbtn save-alt"
          disabled
          title="${save.needs || ""}"
          aria-describedby="save-needs"
        >
          ${this.t.saveAlt}
          <span class="hax-ui-pill" data-tone="soon">${this.t.comingSoon}</span>
        </button>
        <span class="sr-only" id="save-needs">${save.needs || ""}</span>
      </div>
      ${!items.length
        ? html`<p class="empty">${this.t.noImages}</p>`
        : !shown.length
          ? html`<p class="empty">${this.t.noImagesInFilter}</p>`
          : html`<div class="tbl-wrap">
              <table class="alt-table">
                <caption class="sr-only">
                  ${this.t.altCaption}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">${this.t.preview}</th>
                    <th scope="col">${this.t.imageAndPage}</th>
                    <th scope="col" class="alt-col">${this.t.altText}</th>
                    <th scope="col">${this.t.status}</th>
                    <th scope="col">
                      <span class="sr-only">${this.t.actions}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${limited.map((x) => this._renderAltRow(x))}
                </tbody>
              </table>
            </div>`}
      ${shown.length > limited.length
        ? html`<button
            type="button"
            class="sbtn more show-all-alt"
            @click="${() => {
              this._showAllAlt = true;
            }}"
          >
            ${this._f(this.t.showAll, { n: shown.length })}
          </button>`
        : nothing}
      <p class="note">${this.t.notSaved}</p>
    </section>`;
  }

  _renderAltRow(x) {
    const row = x.row;
    const value = x.alt === null || x.alt === undefined ? "" : x.alt;
    const extra = [];
    if (row.inLink) {
      extra.push(this.t.insideLink);
    }
    if (row.hasCaption) {
      extra.push(this.t.hasCaption);
    }
    const label = this._f(this.t.altFor, {
      file: row.file,
      page: row.pageTitle,
    });
    return html`<tr data-row="${x.i}" data-status="${x.status}">
      <td>
        <img class="thumb" src="${row.src}" alt="" loading="lazy" />
      </td>
      <td>
        <code class="file">${row.file}</code>
        <span class="meta"
          >${row.pageTitle}${extra.length
            ? ` · ${extra.join(" · ")}`
            : ""}</span
        >
      </td>
      <td>
        <input
          class="alt-input"
          type="text"
          data-tone="${x.status === "fix" ? "danger" : ""}"
          .value="${value}"
          placeholder="${x.alt === null ? this.t.noAltAttr : this.t.emptyAlt}"
          aria-label="${label}"
          aria-describedby="st-${x.i}"
          @input="${(e) => this._onAltInput(e, x)}"
          @keydown="${(e) => this._onAltKeydown(e, x)}"
        />
        <span class="meta"
          >${value.length > this._th("altMaxLength", Infinity)
            ? this._f(this.t.altLengthOver, {
                n: value.length,
                max: this._th("altMaxLength", 0),
              })
            : this._p(
                value.length,
                this.t.characterOne,
                this.t.characters,
              )}${x.edited ? ` · ${this.t.edited}` : ""}</span
        >
      </td>
      <td id="st-${x.i}">
        <span class="hax-ui-pill alt-status" data-tone="${ALT_TONE[x.status]}"
          >${this._altLabel(x.status)}</span
        >
        <span class="meta reason">${x.reason}</span>
      </td>
      <td>
        <button
          type="button"
          class="sbtn open-page"
          aria-label="${this._f(this.t.openPageLabel, {
            title: row.pageTitle,
          })}"
          data-slug="${row.slug}"
          @click="${() => this._openPage(row.slug)}"
        >
          ${this.t.openPage}
        </button>
      </td>
    </tr>`;
  }

  _stateLabel(state) {
    return state === "fails"
      ? this.t.fails
      : state === "check"
        ? this.t.check
        : this.t.passes;
  }

  _renderCriteria(a) {
    const crit = a.criteria || [];
    const counts = { all: crit.length, fails: 0, check: 0, passes: 0 };
    crit.forEach((c) => {
      counts[c.state] = (counts[c.state] || 0) + 1;
    });
    const shown = crit.filter(
      (c) => this._critFilter === "all" || c.state === this._critFilter,
    );
    return html`<section aria-labelledby="wcag-title">
      <h3 class="block" id="wcag-title">
        ${this.t.wcagTitle} <span class="hint">${this.t.wcagHint}</span>
      </h3>
      <div class="toolbar">
        <div
          class="seg crit-filter"
          role="group"
          aria-label="${this.t.filterChecks}"
        >
          ${["all", "fails", "check", "passes"].map(
            (id) =>
              html`<button
                type="button"
                data-filter="${id}"
                aria-pressed="${this._critFilter === id ? "true" : "false"}"
                @click="${() => {
                  this._critFilter = id;
                }}"
              >
                ${id === "all" ? this.t.all : this._stateLabel(id)}
                <span class="num">${counts[id]}</span>
              </button>`,
          )}
        </div>
      </div>
      ${shown.length
        ? html`<div class="tbl-wrap">
            <table class="crit-table">
              <caption class="sr-only">
                ${this.t.wcagCaption}
              </caption>
              <thead>
                <tr>
                  <th scope="col">${this.t.sc}</th>
                  <th scope="col">${this.t.criterion}</th>
                  <th scope="col">${this.t.result}</th>
                  <th scope="col">${this.t.found}</th>
                  <th scope="col">${this.t.how}</th>
                </tr>
              </thead>
              <tbody>
                ${shown.map(
                  (c) =>
                    html`<tr data-sc="${c.sc}">
                      <td><code>${c.sc}</code></td>
                      <td>${c.name}</td>
                      <td>
                        <span
                          class="hax-ui-pill"
                          data-tone="${STATE_TONE[c.state] || ""}"
                          >${this._stateLabel(c.state)}</span
                        >
                      </td>
                      <td class="found">
                        ${c.found}
                        ${c.unavailable && c.unavailable.available === false
                          ? html`<span
                                class="hax-ui-pill"
                                data-tone="soon"
                                title="${c.unavailable.needs}"
                                >${this.t.comingSoon}</span
                              >
                              <span class="meta">${c.unavailable.needs}</span>`
                          : nothing}
                      </td>
                      <td class="meta">${c.how}</td>
                    </tr>`,
                )}
              </tbody>
            </table>
          </div>`
        : html`<p class="empty">${this.t.noChecksInFilter}</p>`}
    </section>`;
  }

  _renderHeadings(a) {
    const rows = a.headingErrors || [];
    const limited = this._showAllHeadings ? rows : rows.slice(0, LIST_LIMIT);
    return html`<section aria-labelledby="heading-title">
      <h3 class="block" id="heading-title">
        ${this.t.headingTitle}
        <span class="hint"
          >${this._p(
            rows.length,
            this.t.headingPagesOne,
            this.t.headingPages,
          )}</span
        >
      </h3>
      ${rows.length
        ? html`<ul class="findings heading-errors">
            ${limited.map(
              (h) =>
                html`<li>
                  <span class="t">${h.title}</span>
                  <span class="chips"
                    >${(h.chips || []).map(
                      (c) =>
                        html`<span class="hax-ui-pill" data-tone="danger"
                          >${c}</span
                        >`,
                    )}</span
                  >
                  <button
                    type="button"
                    class="sbtn open-page"
                    aria-label="${this._f(this.t.openPageLabel, {
                      title: h.title,
                    })}"
                    @click="${() => this._openPage(h.slug)}"
                  >
                    ${this.t.openPage}
                  </button>
                </li>`,
            )}
          </ul>`
        : html`<p class="empty">${this.t.noHeadingErrors}</p>`}
      ${rows.length > limited.length
        ? html`<button
            type="button"
            class="sbtn more"
            @click="${() => {
              this._showAllHeadings = true;
            }}"
          >
            ${this._f(this.t.showAll, { n: rows.length })}
          </button>`
        : nothing}
    </section>`;
  }

  _colourName(hex) {
    const h = String(hex || "").toLowerCase();
    if (h === "#ffffff" || h === "#fff") {
      return this.t.white;
    }
    if (h === "#000000" || h === "#000") {
      return this.t.black;
    }
    return h;
  }

  _renderContrast(a) {
    const rows = a.contrast || [];
    return html`<section aria-labelledby="contrast-title">
      <h3 class="block" id="contrast-title">
        ${this.t.contrastTitle}
        <span class="hint"
          >${this._f(this.t.contrastHint, {
            n: this._th("contrastMinRatio", 4.5),
          })}</span
        >
      </h3>
      <ul class="findings contrast">
        ${rows.map((c) => {
          const note =
            c.id === "themeWhite"
              ? this.t.themeWhite
              : c.id === "themeBlack"
                ? this.t.themeBlack
                : this._f(this.t.dddWhite, { name: c.name || c.bg });
          return html`<li data-contrast="${c.id}">
            <span
              class="swatch"
              aria-hidden="true"
              style="background-color: ${c.bg}"
            ></span>
            <span class="t"
              >${this._f(this.t.textOn, {
                fg: this._colourName(c.fg),
                bg: c.name ? `${c.name} (${c.bg})` : c.bg,
              })}<span class="d">${note}</span></span
            >
            <span class="num"
              >${c.ratio === null
                ? "–"
                : this._f(this.t.ratio, { n: c.ratio })}</span
            >
            <span
              class="hax-ui-pill"
              data-tone="${c.passes ? "success" : "danger"}"
              >${c.passes ? this.t.passes : this.t.fails}</span
            >
          </li>`;
        })}
      </ul>
    </section>`;
  }
}

globalThis.customElements.define(
  InsightsAccessibility.tag,
  InsightsAccessibility,
);
export { InsightsAccessibility };

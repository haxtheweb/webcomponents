/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { InsightsStyles } from "./insights-styles.js";
import "./insights-block-editor.js";

/**
 * The rows of `blockUrls` whose value starts with `find`, as proposals that
 * swap that prefix for `replace`: { rows, proposals } where proposals maps
 * an index into rows to the new URL. Rows whose new URL is the same are
 * left out, and nothing is proposed for an empty `find`.
 * @param {Array} blockUrls `links.blockUrls` from the analyzer
 * @param {string} find
 * @param {string} replace
 */
export function urlReplaceProposals(blockUrls, find, replace) {
  const prefix = String(find || "").trim();
  const next = String(replace || "").trim();
  const rows = [];
  const proposals = {};
  if (prefix === "") {
    return { rows, proposals };
  }
  (blockUrls || []).forEach((row) => {
    const value = row && typeof row.value === "string" ? row.value.trim() : "";
    if (value.indexOf(prefix) !== 0) {
      return;
    }
    const swapped = next + value.slice(prefix.length);
    if (swapped === value || swapped === "") {
      return;
    }
    proposals[rows.length] = swapped;
    rows.push(row);
  });
  return { rows, proposals };
}

/**
 * `insights-url-replace`
 * Links screen of Reports: replace the start of every matching URL the
 * block operations API can change (a href, img src, media-image source,
 * video-player source, iframe src, longdesc, ...), for moving files to a new
 * host or fixing a renamed folder. A person enters the prefix to find and
 * its replacement, reviews old -> new for each element, clears the ones to
 * keep and saves (haxtheweb/issues#3321).
 *
 * @element insights-url-replace
 */
class InsightsUrlReplace extends I18NMixin(LitElement) {
  static get tag() {
    return "insights-url-replace";
  }

  static get properties() {
    return {
      /** `links.blockUrls` from the analyzer */
      blockUrls: { type: Array, attribute: false },
      maxPages: { type: Number, attribute: "max-pages" },
      note: { type: String },
      density: { type: String, reflect: true },
      _find: { state: true },
      _replace: { state: true },
      _result: { state: true },
    };
  }

  constructor() {
    super();
    this.blockUrls = [];
    this.maxPages = 20;
    this.note = "";
    this.density = "default";
    this._find = "";
    this._replace = "";
    this._result = null;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      heading: "Replace URLs",
      hint: "Change the start of matching links and media sources",
      find: "URL starts with",
      findHelp: "For example https://media.example.edu/",
      replace: "Replace with",
      replaceHelp: "Leave empty to make the URLs start with the rest",
      preview: "Find URLs",
      matches: "{n} URLs on {pages} pages start with {find}.",
      matchesOne: "1 URL on 1 page starts with {find}.",
      matchesOnePage: "{n} URLs on 1 page start with {find}.",
      none: "No URLs the site can change start with {find}.",
      value: "Old and new URL",
      save: "Replace URLs",
      caption: "URLs to replace",
      checkFirst:
        "New URLs are not checked before saving; run the outside link check after saving to confirm they answer.",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../../locales/", import.meta.url).href,
    });
  }

  static get styles() {
    return [
      ...InsightsStyles,
      css`
        form {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-end;
          gap: var(--hax-ui-gap-md);
          margin-bottom: var(--hax-ui-gap-md);
        }
        label {
          display: flex;
          flex-direction: column;
          gap: var(--hax-ui-gap);
          flex: 1 1 240px;
          font-size: var(--hax-ui-admin-font-size-xs);
        }
        input {
          height: calc(var(--insights-row) - 4px);
          padding: 0 var(--hax-ui-gap-md);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          background-color: var(--hax-ui-surface);
          font-size: var(--hax-ui-admin-font-size);
        }
        .help {
          color: var(--hax-ui-text-muted);
        }
        .summary {
          margin-bottom: var(--hax-ui-gap-md);
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

  _onSubmit(e) {
    e.preventDefault();
    this._result = Object.assign(
      { find: this._find.trim() },
      urlReplaceProposals(this.blockUrls, this._find, this._replace),
    );
  }

  _summary() {
    const r = this._result;
    if (!r) {
      return nothing;
    }
    const n = r.rows.length;
    const pages = new Set(r.rows.map((row) => row.pageId)).size;
    const text = !n
      ? this._f(this.t.none, { find: r.find })
      : pages === 1
        ? n === 1
          ? this._f(this.t.matchesOne, { find: r.find })
          : this._f(this.t.matchesOnePage, { n: this._n(n), find: r.find })
        : this._f(this.t.matches, {
            n: this._n(n),
            pages: this._n(pages),
            find: r.find,
          });
    return html`<p class="hax-ui-note summary" role="status">${text}</p>`;
  }

  render() {
    const r = this._result;
    return html`<section aria-labelledby="url-replace-title">
      <h3 class="block" id="url-replace-title">
        ${this.t.heading} <span class="hint">${this.t.hint}</span>
      </h3>
      <form @submit="${this._onSubmit}">
        <label
          >${this.t.find}
          <input
            class="find"
            type="text"
            inputmode="url"
            autocomplete="off"
            spellcheck="false"
            .value="${this._find}"
            aria-describedby="find-help"
            @input="${(e) => {
              this._find = e.target.value;
            }}"
          />
          <span class="help" id="find-help">${this.t.findHelp}</span>
        </label>
        <label
          >${this.t.replace}
          <input
            class="replace"
            type="text"
            inputmode="url"
            autocomplete="off"
            spellcheck="false"
            .value="${this._replace}"
            aria-describedby="replace-help"
            @input="${(e) => {
              this._replace = e.target.value;
            }}"
          />
          <span class="help" id="replace-help">${this.t.replaceHelp}</span>
        </label>
        <button
          type="submit"
          class="sbtn find-urls"
          ?disabled="${this._find.trim() === ""}"
        >
          ${this.t.preview}
        </button>
      </form>
      ${this._summary()}
      ${
        r && r.rows.length
          ? html`<insights-block-editor
                .rows="${r.rows}"
                .proposals="${r.proposals}"
                .labels="${{
                  value: this.t.value,
                  save: this.t.save,
                  caption: this.t.caption,
                }}"
                .srcAttributes="${{}}"
                kind="url"
                note="${this.note}"
                max-pages="${this.maxPages}"
                density="${this.density}"
              ></insights-block-editor>
              <p class="hax-ui-note">${this.t.checkFirst}</p>`
          : nothing
      }
    </section>`;
  }
}

globalThis.customElements.define(InsightsUrlReplace.tag, InsightsUrlReplace);
export { InsightsUrlReplace };

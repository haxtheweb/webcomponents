/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css, nothing } from "lit";
import { autorun } from "mobx";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { HAXCMSI18NMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSI18NMixin.js";
import {
  CITATION_STYLES,
  CITATION_STYLE_LABELS,
  buildCitationSource,
  formatCitation,
} from "./lib/site-citation-formats.js";

/**
 * `site-citation`
 * `Generate a copyable APA, MLA, Chicago or BibTeX citation for the current page or whole site from site.json data`
 *
 * Fields used (anything missing is left out of the citation, never invented):
 * page / site title, author, license, created / updated dates and the site
 * domain. See lib/site-citation-formats.js for the exact field mapping.
 *
 * @demo demo/index.html
 * @element site-citation
 */
export class SiteCitation extends HAXCMSI18NMixin(DDD) {
  static get tag() {
    return "site-citation";
  }

  constructor() {
    super();
    this.HAXCMSI18NMixinBase = "../../../";
    this.scope = "page";
    this.format = "apa";
    this.copied = false;
    this.copyFailed = false;
    this._sources = { page: null, site: null };
    this._copyTimer = null;
    this.t = {
      ...this.t,
      cite: "Cite this",
      citationFormat: "Citation format",
      copy: "Copy citation",
      copied: "Citation copied to clipboard",
      copyFailed:
        "Could not copy. Select the citation text and copy it manually.",
      noData: "No citation information is available yet.",
    };
    this.__disposer = this.__disposer ? this.__disposer : [];
    // Only the handful of fields we cite are read inside the autorun, so it
    // re-runs when the manifest or the active page changes, not on every
    // unrelated store write.
    this.__disposer.push(
      autorun(() => {
        const manifest = store.manifest;
        const item = store.activeItem;
        const href = (globalThis.location && globalThis.location.href) || "";
        const base =
          (globalThis.document && globalThis.document.baseURI) || href;
        const strip = (u) => String(u).split("#")[0].split("?")[0];
        const sources = manifest
          ? {
              page: buildCitationSource(manifest, item, {
                scope: "page",
                fallbackUrl: strip(href),
              }),
              site: buildCitationSource(manifest, item, {
                scope: "site",
                fallbackUrl: strip(base),
              }),
            }
          : { page: null, site: null };
        Promise.resolve().then(() => {
          this._sources = sources;
          this.requestUpdate();
        });
      }),
    );
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * What to cite: "page" (the active page) or "site" (the whole site)
       */
      scope: { type: String, reflect: true },
      /**
       * Selected citation style: apa, mla, chicago or bibtex
       */
      format: { type: String, reflect: true },
      copied: { type: Boolean, state: true },
      copyFailed: { type: Boolean, state: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          margin: var(--ddd-spacing-4) 0;
          font-family: var(--ddd-font-primary);
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }
        .wrap {
          border: var(--ddd-border-size-xs, 1px) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-theme-default-slateGray)
            );
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-4);
          background: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
        }
        .controls {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-3);
          margin-bottom: var(--ddd-spacing-3);
        }
        label {
          font-weight: var(--ddd-font-weight-bold, bold);
          font-size: var(--ddd-font-size-4xs);
        }
        select,
        button {
          font: inherit;
          font-size: var(--ddd-font-size-4xs);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          border-radius: var(--ddd-radius-xs, 4px);
          border: var(--ddd-border-size-xs, 1px) solid
            light-dark(
              var(--ddd-theme-default-slateGray),
              var(--ddd-theme-default-limestoneGray)
            );
          color: inherit;
          background: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
        }
        button {
          cursor: pointer;
          color: var(--ddd-theme-default-white);
          background: light-dark(
            var(--ddd-theme-default-beaverBlue),
            var(--ddd-theme-default-skyBlue)
          );
          border-color: transparent;
        }
        button:hover {
          background: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-creekTeal)
          );
        }
        select:focus-visible,
        button:focus-visible {
          outline: var(--ddd-border-size-sm, 2px) solid
            light-dark(
              var(--ddd-theme-default-keystoneYellow),
              var(--ddd-theme-default-futureLime)
            );
          outline-offset: 2px;
        }
        .citation {
          margin: 0;
          padding: var(--ddd-spacing-3);
          border-radius: var(--ddd-radius-xs, 4px);
          background: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-potentialMidnight)
          );
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-150, 1.5);
          overflow-wrap: anywhere;
        }
        .citation.bibtex {
          font-family: var(--ddd-font-navigation, monospace);
          white-space: pre-wrap;
        }
        .status {
          min-height: 1.5em;
          margin-top: var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-4xs);
        }
        .empty {
          font-size: var(--ddd-font-size-4xs);
        }
      `,
    ];
  }

  /**
   * The formatted citation for the current scope and format
   */
  get citation() {
    const source = this._sources[this.scope === "site" ? "site" : "page"];
    if (!source || (!source.title && !source.url)) return null;
    return formatCitation(source, this.format, { accessed: new Date() });
  }

  render() {
    const c = this.citation;
    const id = "format";
    return html`
      <div class="wrap" part="wrap">
        <div class="controls">
          <label for="${id}">${this.t.citationFormat}</label>
          <select id="${id}" @change="${this._formatChanged}">
            ${CITATION_STYLES.map(
              (s) =>
                html`<option
                  value="${s}"
                  ?selected="${s === (c ? c.style : this.format)}"
                >
                  ${CITATION_STYLE_LABELS[s]}
                </option>`,
            )}
          </select>
          <button type="button" @click="${this.copy}" ?disabled="${!c}">
            ${this.t.copy}
          </button>
        </div>
        ${c
          ? html`<p class="citation ${c.style}" part="citation">
              ${c.segments.map((s) =>
                s.italic ? html`<i>${s.text}</i>` : s.text,
              )}
            </p>`
          : html`<p class="empty">${this.t.noData}</p>`}
        <div class="status" role="status" aria-live="polite" aria-atomic="true">
          ${this.copied
            ? this.t.copied
            : this.copyFailed
              ? this.t.copyFailed
              : nothing}
        </div>
      </div>
    `;
  }

  _formatChanged(e) {
    this.format = e.target.value;
    this._clearStatus();
  }

  _clearStatus() {
    clearTimeout(this._copyTimer);
    this.copied = false;
    this.copyFailed = false;
  }

  /**
   * Copy the plain-text citation to the clipboard and announce the result
   * through the aria-live status region.
   */
  async copy() {
    const c = this.citation;
    if (!c) return;
    this._clearStatus();
    let ok = false;
    try {
      /* eslint-disable baseline-js/use-baseline -- writeText works in Chrome, Firefox and Safari; failure is caught */
      if (globalThis.navigator && globalThis.navigator.clipboard) {
        await globalThis.navigator.clipboard.writeText(c.text);
        /* eslint-enable baseline-js/use-baseline */
        ok = true;
      }
    } catch {
      ok = false;
    }
    if (!ok) ok = this._legacyCopy(c.text);
    this.copied = ok;
    this.copyFailed = !ok;
    this._copyTimer = setTimeout(() => this._clearStatus(), 5000);
  }

  _legacyCopy(text) {
    try {
      const doc = globalThis.document;
      const ta = doc.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      doc.body.appendChild(ta);
      ta.select();
      const ok = doc.execCommand("copy");
      doc.body.removeChild(ta);
      return !!ok;
    } catch {
      return false;
    }
  }

  disconnectedCallback() {
    clearTimeout(this._copyTimer);
    for (const d of this.__disposer || []) {
      if (typeof d === "function") d();
    }
    this.__disposer = [];
    super.disconnectedCallback();
  }

  /**
   * HAX properties integration (inline schema)
   */
  static get haxProperties() {
    return {
      canScale: false,
      canEditSource: false,
      contentEditable: false,
      gizmo: {
        title: "Citation",
        description:
          "Copyable APA, MLA, Chicago or BibTeX citation for this page or the whole site, built from site information",
        icon: "editor:format-quote",
        color: "blue",
        tags: ["Other", "citation", "reference", "apa", "mla"],
        handles: [],
        meta: { author: "HAXcms" },
      },
      settings: {
        configure: [
          {
            property: "scope",
            title: "What to cite",
            description: "Cite the current page or the whole site",
            inputMethod: "select",
            options: { page: "This page", site: "Whole site" },
          },
          {
            property: "format",
            title: "Default style",
            description: "Style shown first; visitors can switch styles",
            inputMethod: "select",
            options: {
              apa: "APA",
              mla: "MLA",
              chicago: "Chicago",
              bibtex: "BibTeX",
            },
          },
        ],
        advanced: [],
      },
      demoSchema: [
        {
          tag: this.tag,
          properties: { scope: "page", format: "apa" },
          content: "",
        },
      ],
    };
  }
}

globalThis.customElements.define(SiteCitation.tag, SiteCitation);

/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, svg, nothing } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import {
  vhsBlogCase,
  vhsBlogSpineSize,
  vhsBlogLoadFace,
  vhsBlogGlyphWidth,
  vhsBlogLongestWord,
} from "./vhs-blog-case.js";

const SHAPES = {
  circle: svg`<circle cx="17" cy="17" r="15"></circle>`,
  shield: svg`<path d="M17 2l13 5v9c0 8-6 13-13 16C10 29 4 24 4 16V7z"></path>`,
  triangle: svg`<path d="M17 3l15 28H2z"></path>`,
  star: svg`<path d="M17 2l4 10h11l-9 7 3 11-9-6-9 6 3-11-9-7h11z"></path>`,
  square: svg`<rect x="3" y="3" width="28" height="28" rx="4"></rect>`,
};

/**
 * `vhs-blog-spine`
 * The spine of a generated video case. Purely visual: the theme wraps it in
 * a real link that carries the post title as its accessible name, so this
 * element renders with aria-hidden on its host.
 *
 * @element vhs-blog-spine
 */
export class VhsBlogSpine extends LitElement {
  static get tag() {
    return "vhs-blog-spine";
  }

  static get properties() {
    return {
      caseTitle: { type: String, attribute: "case-title" },
      readtime: { type: String },
      boxset: { type: Boolean, reflect: true },
      seed: { type: Number },
      boxLabel: { type: String, attribute: "box-label" },
      minLabel: { type: String, attribute: "min-label" },
    };
  }

  constructor() {
    super();
    this.caseTitle = "";
    this.readtime = "";
    this.boxset = false;
    this.seed = 0;
    this.boxLabel = "Box set";
    this.minLabel = "min";
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          /* printed artwork: the same in light and dark, like the theme */
          color-scheme: only dark;
          container-type: inline-size;
        }
        .sp {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 60px;
          box-sizing: border-box;
          padding: 6px 8px 6px 0;
          background: var(--vhs-case-bg);
          color: var(--vhs-case-ink);
          border-radius: 3px;
          overflow: hidden;
          border: 2px solid #121212;
          border-width: 4px 2px;
          box-shadow: 0 2px 0 rgba(0, 0, 0, 0.45);
        }
        .sp::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.18),
            rgba(255, 255, 255, 0) 38%,
            rgba(0, 0, 0, 0) 75%,
            rgba(0, 0, 0, 0.16)
          );
        }
        .case-clear {
          border-color: rgba(255, 255, 255, 0.7);
        }
        .case-white {
          border-color: #ececec;
        }
        .case-steel {
          border-radius: 6px;
          border-width: 3px;
          border-color: #9aa0a6;
        }
        .case-slim {
          min-height: 48px;
          border-width: 3px 2px;
        }
        .case-snap {
          border-width: 3px 0 7px 0;
          border-top-color: #c9b48a;
          border-bottom-color: #111;
        }
        :host([boxset]) .sp {
          min-height: 96px;
          border-width: 6px 3px;
        }
        :host([boxset]) .sp::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 10px;
          background: repeating-linear-gradient(
            90deg,
            rgba(0, 0, 0, 0.25) 0 1px,
            transparent 1px 3px
          );
        }
        .art {
          flex: none;
          align-self: stretch;
          width: 48px;
          margin: -6px 0;
        }
        :host([boxset]) .art {
          width: 96px;
        }
        .art-sunburst {
          background: repeating-conic-gradient(
            from 0deg at 50% 110%,
            var(--vhs-case-accent) 0 6deg,
            var(--vhs-case-bg) 6deg 12deg
          );
        }
        .art-horizon {
          background:
            linear-gradient(var(--vhs-case-accent) 0 46%, transparent 46%),
            repeating-linear-gradient(
                90deg,
                var(--vhs-case-ink) 0 1px,
                transparent 1px 10px
              )
              bottom / 100% 54% no-repeat,
            var(--vhs-case-bg);
        }
        .art-stripes {
          background: repeating-linear-gradient(
            135deg,
            var(--vhs-case-accent) 0 6px,
            var(--vhs-case-bg) 6px 12px
          );
        }
        .art-dots {
          background:
            radial-gradient(
                circle,
                var(--vhs-case-accent) 2.5px,
                transparent 3px
              )
              0 0 / 9px 9px,
            var(--vhs-case-bg);
        }
        .art-portrait {
          background:
            radial-gradient(
              circle at 50% 38%,
              var(--vhs-case-accent) 0 26%,
              transparent 27%
            ),
            radial-gradient(
              ellipse at 50% 110%,
              var(--vhs-case-accent) 0 48%,
              transparent 49%
            ),
            var(--vhs-case-bg);
        }
        .lay-split .lead {
          flex: none;
          align-self: stretch;
          width: 14px;
          margin: -6px 0;
          background: var(--vhs-case-accent);
        }
        .lay-band {
          box-shadow:
            inset 0 6px 0 var(--vhs-case-accent),
            inset 0 -6px 0 var(--vhs-case-accent),
            0 2px 0 rgba(0, 0, 0, 0.45);
        }
        .ttl {
          flex: 1;
          min-width: 0;
          padding-left: 12px;
          font-family: var(--vhs-case-family), Impact, sans-serif;
          font-weight: var(--vhs-case-weight);
          font-style: var(--vhs-case-style);
          text-transform: var(--vhs-case-transform);
          letter-spacing: var(--vhs-case-spacing);
          /* the generated size, shrunk (never below 16px) until the longest
             word fits the title area (under half the spine) unbroken */
          font-size: max(
            16px,
            min(
              var(--vhs-case-size),
              calc(46cqi / (var(--vhs-case-longest) * var(--vhs-case-glyph)))
            )
          );
          line-height: 1.05;
          min-width: 50%;
          overflow: hidden;
          position: relative;
          z-index: 1;
        }
        /* a single word too long to fit even at the smallest size wraps
           rather than hiding letters */
        .ttl.squeeze {
          overflow-wrap: break-word;
        }
        .tr-shadow .ttl {
          text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.55);
        }
        .tr-tracked .ttl {
          letter-spacing: 0.12em;
        }
        .t2 {
          color: var(--vhs-case-accent);
        }
        .badge {
          flex: none;
          font-family: "Archivo Black", sans-serif;
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          border: 1.5px solid currentColor;
          padding: 2px 4px;
          line-height: 1.1;
          max-width: 76px;
          text-align: center;
        }
        .bar {
          flex: none;
          width: 26px;
          height: 34px;
          padding: 3px;
          box-sizing: border-box;
          background: #fff;
          background-image: repeating-linear-gradient(
            90deg,
            #111 0 1px,
            transparent 1px 2px,
            #111 2px 4px,
            transparent 4px 5px
          );
          background-clip: content-box;
        }
        .sticker {
          flex: none;
          font-family: "Permanent Marker", cursive;
          font-size: 15px;
          background: var(--vhs-case-sticker);
          color: #1b1b1b;
          padding: 3px 7px;
          border-radius: 3px;
          transform: rotate(var(--vhs-case-tilt));
          box-shadow: 0 1px 0 rgba(0, 0, 0, 0.35);
          white-space: nowrap;
        }
        .studio {
          flex: none;
          width: 34px;
          height: 34px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Archivo Black", sans-serif;
          font-size: 11px;
        }
        .studio svg {
          position: absolute;
          inset: 0;
          width: 34px;
          height: 34px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
        }
        .studio b {
          position: relative;
          font-weight: 400;
        }
        .cat {
          flex: none;
          writing-mode: vertical-rl;
          font-family: "IBM Plex Mono", monospace;
          font-size: 10px;
          letter-spacing: 0.06em;
        }
        /* the title always wins the room on the spine: extras step
           aside as the case gets narrower */
        @container (max-width: 480px) {
          .badge {
            display: none;
          }
        }
        @container (max-width: 420px) {
          .bar {
            display: none;
          }
        }
        @container (max-width: 360px) {
          .cat {
            display: none;
          }
          .art {
            width: 32px;
          }
        }
        @container (max-width: 300px) {
          .studio {
            display: none;
          }
        }
      `,
    ];
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // refit when the spine's width changes or web fonts arrive
    if (globalThis.ResizeObserver) {
      this.__fitWidth = 0;
      this.__resize = new globalThis.ResizeObserver((entries) => {
        const w = Math.round(entries[0].contentRect.width);
        if (w !== this.__fitWidth) {
          this.__fitWidth = w;
          this._fit();
        }
      });
      this.__resize.observe(this);
    }
    const doc = globalThis.document;
    if (doc && doc.fonts && doc.fonts.ready) {
      doc.fonts.ready.then(() => this._fit());
    }
  }

  disconnectedCallback() {
    if (this.__resize) {
      this.__resize.disconnect();
      this.__resize = null;
    }
    super.disconnectedCallback();
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has("caseTitle") || changedProperties.has("seed")) {
      const c = vhsBlogCase(this.caseTitle, this.seed);
      vhsBlogLoadFace(c.family);
      this._fit();
    }
  }

  /**
   * Shrink the title (never below 13px) until every word fits on the spine
   * without breaking; the CSS size is the starting estimate.
   */
  _fit() {
    const el = this.shadowRoot ? this.shadowRoot.querySelector(".ttl") : null;
    if (!el || !el.clientWidth) {
      return;
    }
    el.style.removeProperty("font-size");
    el.classList.remove("squeeze");
    let size = parseFloat(globalThis.getComputedStyle(el).fontSize);
    let guard = 0;
    while (el.scrollWidth > el.clientWidth + 1 && size > 13 && guard < 40) {
      size = size - 1;
      el.style.setProperty("font-size", size + "px");
      guard++;
    }
    if (el.scrollWidth > el.clientWidth + 1) {
      el.classList.add("squeeze");
    }
  }

  render() {
    const c = vhsBlogCase(this.caseTitle, this.seed);
    const len = c.title.length;
    // long titles keep the room for the title; the extras step aside
    const roomy = len <= 24;
    const vars = {
      "--vhs-case-bg": c.bg,
      "--vhs-case-ink": c.ink,
      "--vhs-case-accent": c.accent,
      "--vhs-case-family": `"${c.family}"`,
      "--vhs-case-weight": String(c.weight),
      "--vhs-case-style": c.fontStyle,
      "--vhs-case-transform": c.transform,
      "--vhs-case-spacing": c.letterSpacing,
      "--vhs-case-size": vhsBlogSpineSize(len, c.scale, this.boxset) + "px",
      "--vhs-case-longest": String(vhsBlogLongestWord(c.title)),
      "--vhs-case-glyph": String(vhsBlogGlyphWidth(c)),
      "--vhs-case-sticker": c.sticker,
      "--vhs-case-tilt": c.tilt + "deg",
    };
    const badge = this.boxset ? this.boxLabel : roomy ? c.badge : "";
    return html`
      <div
        class="sp case-${this.boxset ? "keep" : c.caseType} lay-${c.layout} tr-${c.treatment}"
        style=${styleMap(vars)}
        part="spine"
      >
        ${c.layout === "art" ? html`<span class="art art-${c.art}"></span>` : nothing}
        ${c.layout === "split" ? html`<span class="lead"></span>` : nothing}
        <span class="ttl"
          >${c.first}${c.last ? html` <span class="t2">${c.last}</span>` : nothing}</span
        >
        ${badge ? html`<span class="badge">${badge}</span>` : nothing}
        ${c.barcode && roomy ? html`<span class="bar"></span>` : nothing}
        ${
          this.readtime
            ? html`<span class="sticker"
                >${this.readtime} ${this.minLabel}</span
              >`
            : nothing
        }
        <span class="studio">
          <svg viewBox="0 0 34 34" aria-hidden="true">${SHAPES[c.shape]}</svg>
          <b>${c.studioInitials}</b>
        </span>
        ${roomy ? html`<span class="cat">${c.catalog}</span>` : nothing}
      </div>
    `;
  }
}
globalThis.customElements.define(VhsBlogSpine.tag, VhsBlogSpine);

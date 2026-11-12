/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, svg, nothing } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import {
  vhsBlogCase,
  vhsBlogCoverSize,
  vhsBlogLoadFace,
} from "./vhs-blog-case.js";

const SHAPES = {
  circle: svg`<circle cx="17" cy="17" r="15"></circle>`,
  shield: svg`<path d="M17 2l13 5v9c0 8-6 13-13 16C10 29 4 24 4 16V7z"></path>`,
  triangle: svg`<path d="M17 3l15 28H2z"></path>`,
  star: svg`<path d="M17 2l4 10h11l-9 7 3 11-9-6-9 6 3-11-9-7h11z"></path>`,
  square: svg`<rect x="3" y="3" width="28" height="28" rx="4"></rect>`,
};

/**
 * `vhs-blog-cover`
 * The front cover of a generated video case, from the same hash as its
 * spine. Exposed to assistive tech as one image named by the post title.
 *
 * @element vhs-blog-cover
 */
export class VhsBlogCover extends LitElement {
  static get tag() {
    return "vhs-blog-cover";
  }

  static get properties() {
    return {
      caseTitle: { type: String, attribute: "case-title" },
      readtime: { type: String },
      seed: { type: Number },
      presenter: { type: String },
      presentsLabel: { type: String, attribute: "presents-label" },
      ratingLabel: { type: String, attribute: "rating-label" },
      minLabel: { type: String, attribute: "min-label" },
      coverLabel: { type: String, attribute: "cover-label" },
    };
  }

  constructor() {
    super();
    this.caseTitle = "";
    this.readtime = "";
    this.seed = 0;
    this.presenter = "";
    this.presentsLabel = "presents";
    this.ratingLabel = "Accessible to all audiences";
    this.minLabel = "min";
    this.coverLabel = "Cover art for";
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          /* printed artwork: the same in light and dark, like the theme */
          color-scheme: only dark;
        }
        .cv {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 4;
          box-sizing: border-box;
          background: var(--vhs-case-bg);
          color: var(--vhs-case-ink);
          border-radius: 4px 8px 8px 4px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border-left: 12px solid #121212;
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.45);
        }
        .cv::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            115deg,
            rgba(255, 255, 255, 0.22) 0,
            rgba(255, 255, 255, 0.05) 22%,
            rgba(255, 255, 255, 0) 40%
          );
        }
        .case-white {
          border-left-color: #ececec;
        }
        .case-clear {
          border-left-color: rgba(255, 255, 255, 0.75);
        }
        .case-steel {
          border-left-color: #9aa0a6;
        }
        .top {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 14px;
          font-family: "Archivo Narrow", sans-serif;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          position: relative;
          z-index: 1;
        }
        .mark {
          flex: none;
          width: 30px;
          height: 30px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Archivo Black", sans-serif;
          font-size: 10px;
          letter-spacing: 0;
        }
        .mark svg {
          position: absolute;
          inset: 0;
          width: 30px;
          height: 30px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
        }
        .mark b {
          position: relative;
          font-weight: 400;
        }
        .art {
          flex: 1;
          min-height: 0;
          margin: 0 14px;
          border-radius: 2px;
        }
        .art-sunburst {
          background: repeating-conic-gradient(
            from 0deg at 50% 115%,
            var(--vhs-case-accent) 0 5deg,
            var(--vhs-case-bg) 5deg 10deg
          );
        }
        .art-horizon {
          background:
            radial-gradient(
              circle at 50% 62%,
              var(--vhs-case-accent) 0 22%,
              transparent 22.5%
            ),
            linear-gradient(transparent 0 62%, var(--vhs-case-bg) 62%),
            repeating-linear-gradient(
                0deg,
                var(--vhs-case-ink) 0 1px,
                transparent 1px 14px
              )
              bottom / 100% 38% no-repeat,
            repeating-linear-gradient(
                90deg,
                var(--vhs-case-ink) 0 1px,
                transparent 1px 24px
              )
              bottom / 100% 38% no-repeat,
            var(--vhs-case-bg);
        }
        .art-stripes {
          background: repeating-linear-gradient(
            135deg,
            var(--vhs-case-accent) 0 14px,
            var(--vhs-case-bg) 14px 28px
          );
        }
        .art-dots {
          background:
            radial-gradient(
                circle,
                var(--vhs-case-accent) 5px,
                transparent 5.5px
              )
              0 0 / 18px 18px,
            var(--vhs-case-bg);
        }
        .art-portrait {
          background:
            radial-gradient(
              circle at 50% 36%,
              var(--vhs-case-accent) 0 18%,
              transparent 18.5%
            ),
            radial-gradient(
              ellipse at 50% 112%,
              var(--vhs-case-accent) 0 46%,
              transparent 46.5%
            ),
            var(--vhs-case-bg);
        }
        .ribbon {
          position: absolute;
          top: 22px;
          right: -44px;
          transform: rotate(38deg);
          background: var(--vhs-case-ink);
          color: var(--vhs-case-bg);
          font-family: "Archivo Black", sans-serif;
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 4px 48px;
          z-index: 2;
        }
        .ttl {
          padding: 14px 14px 6px;
          font-family: var(--vhs-case-family), Impact, sans-serif;
          font-weight: var(--vhs-case-weight);
          font-style: var(--vhs-case-style);
          text-transform: var(--vhs-case-transform);
          letter-spacing: var(--vhs-case-spacing);
          font-size: var(--vhs-case-size);
          line-height: 1;
          overflow-wrap: break-word;
          hyphens: auto;
          position: relative;
          z-index: 1;
        }
        .tr-shadow .ttl {
          text-shadow: 3px 3px 0 rgba(0, 0, 0, 0.55);
        }
        .tr-tracked .ttl {
          letter-spacing: 0.12em;
        }
        .t2 {
          color: var(--vhs-case-accent);
        }
        .foot {
          display: flex;
          align-items: flex-end;
          gap: 10px;
          padding: 6px 14px 12px;
          position: relative;
          z-index: 1;
        }
        .rating {
          flex: none;
          border: 2px solid currentColor;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 3px 6px 3px 3px;
          font-family: "Archivo Narrow", sans-serif;
          font-weight: 700;
          font-size: 10px;
          line-height: 1.1;
          text-transform: uppercase;
          max-width: 120px;
        }
        .rating b {
          font-family: "Archivo Black", sans-serif;
          font-size: 20px;
          line-height: 1;
          background: var(--vhs-case-ink);
          color: var(--vhs-case-bg);
          padding: 2px 6px;
          font-weight: 400;
        }
        .billing {
          flex: 1;
          min-width: 0;
          font-family: "Archivo Narrow", sans-serif;
          font-weight: 500;
          font-size: 11px;
          line-height: 1.25;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .rt {
          flex: none;
          font-family: "Permanent Marker", cursive;
          font-size: 16px;
          background: var(--vhs-case-sticker);
          color: #1b1b1b;
          padding: 4px 8px;
          border-radius: 3px;
          transform: rotate(var(--vhs-case-tilt));
          white-space: nowrap;
        }
      `,
    ];
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has("caseTitle") || changedProperties.has("seed")) {
      vhsBlogLoadFace(vhsBlogCase(this.caseTitle, this.seed).family);
    }
  }

  render() {
    const c = vhsBlogCase(this.caseTitle, this.seed);
    const vars = {
      "--vhs-case-bg": c.bg,
      "--vhs-case-ink": c.ink,
      "--vhs-case-accent": c.accent,
      "--vhs-case-family": `"${c.family}"`,
      "--vhs-case-weight": String(c.weight),
      "--vhs-case-style": c.fontStyle,
      "--vhs-case-transform": c.transform,
      "--vhs-case-spacing": c.letterSpacing,
      "--vhs-case-size": vhsBlogCoverSize(c.title.length, c.scale) + "px",
      "--vhs-case-sticker": c.sticker,
      "--vhs-case-tilt": c.tilt + "deg",
    };
    return html`
      <div
        class="cv case-${c.caseType} tr-${c.treatment}"
        style=${styleMap(vars)}
        role="img"
        aria-label="${this.coverLabel} ${c.title}"
        part="cover"
      >
        <div class="top">
          <span class="mark">
            <svg viewBox="0 0 34 34" aria-hidden="true">${SHAPES[c.shape]}</svg>
            <b>${c.studioInitials}</b>
          </span>
          <span>${c.studio} ${this.presentsLabel}</span>
        </div>
        ${c.badge ? html`<span class="ribbon">${c.badge}</span>` : nothing}
        <div class="art art-${c.art}"></div>
        <div class="ttl">
          ${c.first}${c.last ? html` <span class="t2">${c.last}</span>` : nothing}
        </div>
        <div class="foot">
          <span class="rating"><b>A</b>${this.ratingLabel}</span>
          <span class="billing"
            >${this.presenter} · ${c.title} · ${c.catalog}</span
          >
          ${
            this.readtime
              ? html`<span class="rt">${this.readtime} ${this.minLabel}</span>`
              : nothing
          }
        </div>
      </div>
    `;
  }
}
globalThis.customElements.define(VhsBlogCover.tag, VhsBlogCover);

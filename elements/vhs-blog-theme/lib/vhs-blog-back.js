/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { vhsBlogCase, vhsBlogLoadFace } from "./vhs-blog-case.js";
import "@haxtheweb/q-r/lib/qr-code.js";

/**
 * `vhs-blog-back`
 * The back of a generated video case: distributor and catalog number, a
 * real QR code that opens the post, the title, the post's description as
 * the blurb, and the running time. Same hash as the cover and spine, so it
 * is always the back of that box. Unlike the cover it is real text, so a
 * screen reader can read it when the box is turned over.
 *
 * @element vhs-blog-back
 */
export class VhsBlogBack extends LitElement {
  static get tag() {
    return "vhs-blog-back";
  }

  static get properties() {
    return {
      caseTitle: { type: String, attribute: "case-title" },
      description: { type: String },
      url: { type: String },
      readtime: { type: String },
      presenter: { type: String },
      seed: { type: Number },
      distributedLabel: { type: String, attribute: "distributed-label" },
      runningTimeLabel: { type: String, attribute: "running-time-label" },
      minLabel: { type: String, attribute: "min-label" },
      publishedLabel: { type: String, attribute: "published-label" },
      qrLabel: { type: String, attribute: "qr-label" },
    };
  }

  constructor() {
    super();
    this.caseTitle = "";
    this.description = "";
    this.url = "";
    this.readtime = "";
    this.presenter = "";
    this.seed = 0;
    this.distributedLabel = "Exclusively distributed by";
    this.runningTimeLabel = "Running time";
    this.minLabel = "min";
    this.publishedLabel = "Published with HAXcms";
    this.qrLabel = "QR code that opens";
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          /* printed artwork: the same in light and dark, like the theme */
          color-scheme: only dark;
        }
        .bk {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 4;
          box-sizing: border-box;
          background: var(--vhs-case-bg);
          color: var(--vhs-case-ink);
          border: 8px solid var(--vhs-case-accent);
          border-radius: 8px 4px 4px 8px;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          overflow: hidden;
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.45);
        }
        .top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
        }
        .small {
          font-family: "Archivo Narrow", sans-serif;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          line-height: 1.35;
          margin: 0;
        }
        .qr {
          flex: none;
          width: 92px;
          background: #ffffff;
          border-radius: 2px;
          padding: 4px;
          box-sizing: border-box;
        }
        .qr::part(code) {
          display: block;
          width: 100%;
          height: auto;
          image-rendering: pixelated;
        }
        h2 {
          margin: 0;
          font-family: var(--vhs-case-family), Impact, sans-serif;
          font-weight: var(--vhs-case-weight);
          font-style: var(--vhs-case-style);
          text-transform: var(--vhs-case-transform);
          letter-spacing: var(--vhs-case-spacing);
          font-size: 30px;
          line-height: 1;
          overflow-wrap: anywhere;
        }
        .t2 {
          color: var(--vhs-case-accent);
        }
        .blurb {
          margin: 0;
          font-family: "Source Serif 4", Georgia, serif;
          font-size: 16px;
          line-height: 1.45;
          display: -webkit-box;
          -webkit-line-clamp: 7;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .foot {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 8px;
          font-family: "Archivo Narrow", sans-serif;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 0.04em;
          line-height: 1.35;
        }
        .fmt {
          flex: none;
          border: 2px solid currentColor;
          padding: 1px 6px;
          font-family: "Archivo Black", sans-serif;
          font-size: 15px;
        }
      `,
    ];
  }

  render() {
    const c = vhsBlogCase(this.caseTitle, this.seed);
    vhsBlogLoadFace(c.family);
    const vars = {
      "--vhs-case-bg": c.bg,
      "--vhs-case-ink": c.ink,
      "--vhs-case-accent": c.accent,
      "--vhs-case-family": `"${c.family}"`,
      "--vhs-case-weight": String(c.weight),
      "--vhs-case-style": c.fontStyle,
      "--vhs-case-transform": c.transform,
      "--vhs-case-spacing": c.letterSpacing,
    };
    return html`
      <div class="bk" style=${styleMap(vars)} part="back">
        <div class="top">
          <p class="small">
            ${this.distributedLabel}<br />${c.studio}<br />${c.catalog}
          </p>
          ${
            this.url
              ? html`<qr-code
                  class="qr"
                  data="${this.url}"
                  alt="${this.qrLabel} ${c.title}"
                  format="svg"
                  modulesize="3"
                  margin="1"
                ></qr-code>`
              : nothing
          }
        </div>
        <h2>
          ${c.first}${c.last ? html` <span class="t2">${c.last}</span>` : nothing}
        </h2>
        ${this.description ? html`<p class="blurb">${this.description}</p>` : nothing}
        <div class="foot">
          <span
            >${
              this.readtime
                ? html`${this.runningTimeLabel} ${this.readtime}
                    ${this.minLabel}<br />`
                : nothing
            }${this.presenter}
            · ${this.publishedLabel}</span
          >
          <span class="fmt" aria-hidden="true">HAX</span>
        </div>
      </div>
    `;
  }
}
globalThis.customElements.define(VhsBlogBack.tag, VhsBlogBack);

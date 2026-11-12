/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { vhsBlogCase, vhsBlogLoadFace } from "./vhs-blog-case.js";

const KEYS = ["eject", "prev", "play", "skip", "next"];
const ICONS = {
  eject: "M12 5l7 9H5zM5 17h14v2H5z",
  prev: "M11 6v12L3 12zM21 6v12l-8-6z",
  play: "M8 5v14l11-7z",
  skip: "M3 6v12l8-6zM13 6v12l8-6z",
  next: "M4 6v12l8-6zM14 6h3v12h-3z",
};

/**
 * `vhs-blog-vcr`
 * A silver top-loading VCR. The "phase" drives the tape load:
 * idle (clock blinks) -> open (lid pops up, cassette above) -> insert
 * (cassette drops in) -> press (lid presses down, PLAY key goes down) ->
 * playing. The piano keys are real buttons; each one fires
 * "vhs-blog-vcr-key" with detail.key of eject, prev, play, skip or next.
 * Disabled keys are listed in "disabled" (space separated).
 *
 * @element vhs-blog-vcr
 */
export class VhsBlogVcr extends LitElement {
  static get tag() {
    return "vhs-blog-vcr";
  }

  static get properties() {
    return {
      phase: { type: String, reflect: true },
      tapeTitle: { type: String, attribute: "tape-title" },
      disabled: { type: String },
      label: { type: String },
      brand: { type: String },
      lidLabel: { type: String, attribute: "lid-label" },
      clockLabel: { type: String, attribute: "clock-label" },
      loadLabel: { type: String, attribute: "load-label" },
      playingLabel: { type: String, attribute: "playing-label" },
      ejectLabel: { type: String, attribute: "eject-label" },
      prevLabel: { type: String, attribute: "prev-label" },
      playLabel: { type: String, attribute: "play-label" },
      skipLabel: { type: String, attribute: "skip-label" },
      nextLabel: { type: String, attribute: "next-label" },
    };
  }

  constructor() {
    super();
    this.phase = "idle";
    this.tapeTitle = "";
    this.disabled = "";
    this.label = "VCR";
    this.brand = "HAXVISION";
    this.lidLabel = "Top load";
    this.clockLabel = "12:00";
    this.loadLabel = "LOAD";
    this.playingLabel = "PLAY";
    this.ejectLabel = "Eject";
    this.prevLabel = "Prev";
    this.playLabel = "Play";
    this.skipLabel = "Skip";
    this.nextLabel = "Next";
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          position: relative;
          /* hardware: the same in light and dark, like the theme */
          color-scheme: only dark;
        }
        .lid {
          position: relative;
          z-index: 3;
          height: 24px;
          border-radius: 6px 6px 0 0;
          background: linear-gradient(180deg, #e9e9e6, #c3c4c0);
          border: 1px solid #8d8e8a;
          border-bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Archivo Narrow", sans-serif;
          font-weight: 700;
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #3a3b38;
        }
        .face {
          position: relative;
          z-index: 4;
          min-height: 86px;
          background: linear-gradient(180deg, #bdbeba, #9fa09c);
          border: 1px solid #7d7e7a;
          border-radius: 0 0 4px 4px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px 16px;
          padding: 8px 16px;
          box-sizing: border-box;
          box-shadow: 0 8px 14px rgba(0, 0, 0, 0.5);
        }
        .brand {
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-family: "Archivo Narrow", sans-serif;
          color: #1d1e1c;
        }
        .brand b {
          font-family: "Archivo Black", sans-serif;
          font-size: 15px;
          letter-spacing: 0.06em;
          font-weight: 400;
        }
        .vfd {
          flex: none;
          min-width: 116px;
          height: 40px;
          border-radius: 4px;
          background: #07120c;
          box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "VT323", monospace;
          font-size: 26px;
          color: #5dff8a;
          text-shadow: 0 0 6px rgba(93, 255, 138, 0.8);
          text-transform: uppercase;
          padding: 0 10px;
          box-sizing: border-box;
        }
        .keys {
          margin-left: auto;
          display: flex;
          gap: 4px;
          align-items: flex-start;
        }
        button {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          background: transparent;
          border: 0;
          padding: 0;
          cursor: pointer;
          color: #1d1e1c;
          font-family: "Archivo Narrow", sans-serif;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          min-width: 52px;
        }
        button:focus-visible {
          outline: 3px solid #1d4ed8;
          outline-offset: 3px;
        }
        button:disabled {
          cursor: default;
          opacity: 0.55;
        }
        .cap {
          width: 48px;
          height: 44px;
          border-radius: 2px 2px 4px 4px;
          background: linear-gradient(180deg, #f2f2ef, #cfd0cc);
          border: 1px solid #6f706c;
          box-shadow: 0 4px 0 #6f706c;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cap svg {
          width: 18px;
          height: 18px;
          fill: currentColor;
        }
        button:not(:disabled):active .cap,
        .down .cap {
          transform: translateY(4px);
          box-shadow: 0 0 0 #6f706c;
          background: linear-gradient(180deg, #d6d7d3, #bebfbb);
        }
        .cas {
          position: absolute;
          z-index: 1;
          left: 50%;
          bottom: 62px;
          width: 310px;
          max-width: 80%;
          height: 46px;
          transform: translate(-50%, -170px);
          border-radius: 4px;
          background: repeating-linear-gradient(
            90deg,
            #161616 0 3px,
            #1f1f1f 3px 6px
          );
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          padding: 0 10px;
          box-sizing: border-box;
          gap: 10px;
          opacity: 0;
          pointer-events: none;
        }
        .cas .lbl {
          flex: 1;
          min-width: 0;
          height: 30px;
          background: var(--vhs-case-bg);
          color: var(--vhs-case-ink);
          border: 2px solid #f5f1e8;
          display: flex;
          align-items: center;
          padding: 0 8px;
          font-family: var(--vhs-case-family), Impact, sans-serif;
          font-weight: var(--vhs-case-weight);
          text-transform: var(--vhs-case-transform);
          font-size: 17px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cas .win {
          flex: none;
          width: 44px;
          height: 18px;
          border-radius: 9px;
          background: #2c2c2c;
          box-shadow: inset 0 0 0 2px #444;
        }
        :host([phase="open"]) .lid,
        :host([phase="insert"]) .lid {
          transform: translateY(-40px);
        }
        :host([phase="press"]) .lid {
          transform: translateY(3px);
        }
        :host([phase="open"]) .cas {
          opacity: 1;
        }
        :host([phase="insert"]) .cas {
          opacity: 1;
          transform: translate(-50%, -14px);
        }
        :host([phase="press"]) .cas,
        :host([phase="playing"]) .cas {
          opacity: 0;
          transform: translate(-50%, 30px);
        }
        @media (prefers-reduced-motion: no-preference) {
          .lid {
            transition: transform 0.3s cubic-bezier(0.3, 1.5, 0.5, 1);
          }
          .cas {
            transition:
              transform 0.6s cubic-bezier(0.3, 0.7, 0.3, 1),
              opacity 0.2s;
          }
          :host([phase="press"]) .cas {
            transition:
              transform 0.25s ease-in,
              opacity 0.25s 0.1s;
          }
          .cap {
            transition:
              transform 0.12s,
              box-shadow 0.12s;
          }
          :host([phase="idle"]) .clock {
            animation: vhs-vcr-blink 1s step-end infinite;
          }
        }
        /* the clock blinks on and off; it is never shown at partial
           strength, so it always keeps its full contrast */
        @keyframes vhs-vcr-blink {
          50% {
            visibility: hidden;
          }
        }
        @media (max-width: 760px) {
          .brand {
            display: none;
          }
          .keys {
            margin-left: 0;
          }
        }
      `,
    ];
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has("tapeTitle") && this.tapeTitle) {
      vhsBlogLoadFace(vhsBlogCase(this.tapeTitle).family);
    }
  }

  _key(key) {
    this.dispatchEvent(
      new CustomEvent("vhs-blog-vcr-key", {
        bubbles: true,
        composed: true,
        detail: { key },
      }),
    );
  }

  _vfd() {
    if (this.phase === "open" || this.phase === "insert") {
      return this.loadLabel;
    }
    if (this.phase === "press" || this.phase === "playing") {
      return "▶ " + this.playingLabel;
    }
    return this.clockLabel;
  }

  render() {
    const c = vhsBlogCase(this.tapeTitle || " ");
    const vars = {
      "--vhs-case-bg": c.bg,
      "--vhs-case-ink": c.ink,
      "--vhs-case-family": `"${c.family}"`,
      "--vhs-case-weight": String(c.weight),
      "--vhs-case-transform": c.transform,
    };
    const off = (this.disabled || "").split(" ");
    const labels = {
      eject: this.ejectLabel,
      prev: this.prevLabel,
      play: this.playLabel,
      skip: this.skipLabel,
      next: this.nextLabel,
    };
    const playDown = this.phase === "press" || this.phase === "playing";
    return html`
      <div class="cas" style=${styleMap(vars)} aria-hidden="true">
        <span class="win"></span><span class="lbl">${this.tapeTitle}</span
        ><span class="win"></span>
      </div>
      <div class="lid" aria-hidden="true">${this.lidLabel}</div>
      <div class="face" role="group" aria-label="${this.label}">
        <div class="brand" aria-hidden="true"><b>${this.brand}</b></div>
        <div class="vfd" role="status">
          <span class="clock">${this._vfd()}</span>
        </div>
        <div class="keys">
          ${KEYS.map(
            (k) => html`
              <button
                type="button"
                class="${k === "play" && playDown ? "down" : ""}"
                ?disabled="${off.includes(k)}"
                @click="${() => this._key(k)}"
              >
                <span class="cap"
                  ><svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="${ICONS[k]}"></path></svg></span
                >${labels[k]}
              </button>
            `,
          )}
        </div>
      </div>
    `;
  }
}
globalThis.customElements.define(VhsBlogVcr.tag, VhsBlogVcr);

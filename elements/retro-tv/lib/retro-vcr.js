/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { RetroKitStyles } from "./retro-kit.js";
import { retroTvLoadFace } from "./retro-tv-program.js";

const ICONS = {
  eject: "M12 5l7 9H5zM5 17h14v2H5z",
  rew: "M11 6v12L3 12zM21 6v12l-8-6z",
  play: "M8 5v14l11-7z",
  skip: "M4 6v12l8-6zM14 6h3v12h-3z",
  ff: "M3 6v12l8-6zM13 6v12l8-6z",
};

/**
 * `retro-vcr`
 * HAXVISION, a dark top-loading VCR with silver piano keys, a green
 * display and a stripe in its HAX TV kit colorway. `phase` drives a tape
 * load: idle (the clock blinks) -> lift (lid up) -> open (cassette over
 * the slot) -> insert (it drops in) -> press (lid down, PLAY goes down)
 * -> playing. rew and ff hold their key down while the host seeks.
 *
 * The keys are real buttons. `keys` picks which (from eject, rew, play,
 * skip, ff); each fires `retro-vcr-key` with detail.key. Keys listed in
 * `disabled` (space separated) are disabled. The cassette label takes
 * --retro-vcr-tape-bg, -ink, -family, -weight and -transform, so a host
 * can print its own label.
 *
 * Its size is set in pixels for a large deck; set `zoom` on it to make it
 * smaller. Motion only runs for people who have not asked for less.
 *
 * @element retro-vcr
 * @fires retro-vcr-key - detail { key }
 */
export class RetroVcr extends LitElement {
  static get tag() {
    return "retro-vcr";
  }

  static get properties() {
    return {
      colorway: { type: String, reflect: true },
      phase: { type: String, reflect: true },
      /** words on the cassette label */
      tapeLabel: { type: String, attribute: "tape-label" },
      /** keys shown, in order, space separated */
      keys: { type: String },
      disabled: { type: String },
      brand: { type: String },
      label: { type: String },
      lidLabel: { type: String, attribute: "lid-label" },
      clockLabel: { type: String, attribute: "clock-label" },
      loadLabel: { type: String, attribute: "load-label" },
      playingLabel: { type: String, attribute: "playing-label" },
      rewWord: { type: String, attribute: "rew-word" },
      ffWord: { type: String, attribute: "ff-word" },
      ejectLabel: { type: String, attribute: "eject-label" },
      rewLabel: { type: String, attribute: "rew-label" },
      playLabel: { type: String, attribute: "play-label" },
      skipLabel: { type: String, attribute: "skip-label" },
      ffLabel: { type: String, attribute: "ff-label" },
      /** what a key does, read after its name ("Rew, previous post") */
      rewHint: { type: String, attribute: "rew-hint" },
      playHint: { type: String, attribute: "play-hint" },
      ffHint: { type: String, attribute: "ff-hint" },
    };
  }

  constructor() {
    super();
    this.colorway = "helmet";
    this.phase = "idle";
    this.tapeLabel = "";
    this.keys = "eject rew play ff";
    this.disabled = "";
    this.brand = "HAXVISION";
    this.label = "VCR";
    this.lidLabel = "Top load";
    this.clockLabel = "12:00";
    this.loadLabel = "LOAD";
    this.playingLabel = "PLAY";
    this.rewWord = "REW";
    this.ffWord = "FF";
    this.ejectLabel = "Eject";
    this.rewLabel = "Rew";
    this.playLabel = "Play";
    this.skipLabel = "Skip";
    this.ffLabel = "FF";
    this.rewHint = "";
    this.playHint = "";
    this.ffHint = "";
  }

  connectedCallback() {
    super.connectedCallback();
    retroTvLoadFace("VT323");
    retroTvLoadFace("Press Start 2P");
  }

  /**
   * Where the cassette waits over the open lid, in viewport pixels, so a
   * tape carried in from elsewhere can land where this deck takes over
   * (phase "open").
   * @returns {DOMRect|null}
   */
  cassetteRect() {
    const cas = this.shadowRoot ? this.shadowRoot.querySelector(".cas") : null;
    return cas ? cas.getBoundingClientRect() : null;
  }

  _key(key) {
    this.dispatchEvent(
      new CustomEvent("retro-vcr-key", {
        bubbles: true,
        composed: true,
        detail: { key },
      }),
    );
  }

  _vfd() {
    const p = this.phase;
    if (p === "lift" || p === "open" || p === "insert") {
      return this.loadLabel;
    }
    if (p === "press" || p === "playing") {
      return `▶ ${this.playingLabel}`;
    }
    if (p === "rew") {
      return `◀◀ ${this.rewWord}`;
    }
    if (p === "ff") {
      return `${this.ffWord} ▶▶`;
    }
    return this.clockLabel;
  }

  static get styles() {
    return [
      RetroKitStyles,
      css`
        :host {
          display: block;
          position: relative;
        }
        :host([hidden]) {
          display: none;
        }
        .lid {
          position: relative;
          z-index: 3;
          height: 24px;
          border: 1px solid #15151a;
          border-bottom: 0;
          border-radius: 6px 6px 0 0;
          background: linear-gradient(180deg, #34343c, #2c2c34);
          display: flex;
          align-items: center;
          justify-content: center;
          font:
            700 11px "Roboto Condensed",
            sans-serif;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #b9bec7;
        }
        .face {
          position: relative;
          z-index: 4;
          min-height: 86px;
          box-sizing: border-box;
          padding: 8px 16px;
          border: 1px solid #0e0e12;
          border-radius: 0 0 4px 4px;
          background: linear-gradient(180deg, #24242b, #1c1c22);
          box-shadow:
            inset 0 -5px 0 var(--retro-kit-body),
            0 8px 14px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px 16px;
        }
        .brand {
          font:
            13px "Press Start 2P",
            monospace;
          letter-spacing: 0.04em;
          color: var(--retro-kit-ink);
        }
        .vfd {
          flex: none;
          min-width: 116px;
          height: 40px;
          box-sizing: border-box;
          padding: 0 10px;
          border-radius: 4px;
          background: #07120c;
          box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          font:
            26px "VT323",
            monospace;
          color: #5dff8a;
          text-shadow: 0 0 6px rgba(93, 255, 138, 0.8);
          text-transform: uppercase;
        }
        .keys {
          margin-left: auto;
          display: flex;
          gap: 4px;
          align-items: flex-start;
        }
        button {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
          min-width: 52px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          font:
            700 12px "Roboto Condensed",
            sans-serif;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #e4e5e7;
        }
        button:focus-visible {
          outline: 3px solid #ffd100;
          outline-offset: 3px;
        }
        button:disabled {
          cursor: default;
          opacity: 0.55;
        }
        .cap {
          width: 48px;
          height: 44px;
          box-sizing: border-box;
          border: 1px solid #0e0e12;
          border-radius: 2px 2px 4px 4px;
          background: linear-gradient(180deg, #b3b8c1, #9aa0aa);
          box-shadow: 0 4px 0 #0e0e12;
          color: #111111;
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
          box-shadow: 0 0 0 #0e0e12;
          background: linear-gradient(180deg, #8f949d, #9aa0aa);
        }
        .cas {
          position: absolute;
          z-index: 1;
          left: 50%;
          bottom: 62px;
          width: 310px;
          max-width: 80%;
          height: 46px;
          box-sizing: border-box;
          padding: 0 10px;
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
          gap: 10px;
          opacity: 0;
          pointer-events: none;
        }
        .cas .lbl {
          flex: 1;
          min-width: 0;
          height: 30px;
          box-sizing: border-box;
          padding: 0 8px;
          border: 2px solid #f5f1e8;
          background: var(--retro-vcr-tape-bg, #f5f1e8);
          color: var(--retro-vcr-tape-ink, #262626);
          display: flex;
          align-items: center;
          font-family:
            var(--retro-vcr-tape-family, "Press Start 2P"), monospace;
          font-weight: var(--retro-vcr-tape-weight, 400);
          text-transform: var(--retro-vcr-tape-transform, uppercase);
          font-size: var(--retro-vcr-tape-size, 12px);
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
        :host([phase="lift"]) .lid,
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
            animation: retro-vcr-blink 1s step-end infinite;
          }
        }
        /* the clock blinks on and off, never at partial strength, so it
           always keeps its full contrast */
        @keyframes retro-vcr-blink {
          50% {
            visibility: hidden;
          }
        }
        @media (forced-colors: active) {
          .cap {
            border-color: ButtonText;
          }
        }
      `,
    ];
  }

  render() {
    const off = (this.disabled || "").split(" ");
    const list = (this.keys || "")
      .split(" ")
      .filter((k) => ICONS[k] !== undefined);
    const labels = {
      eject: this.ejectLabel,
      rew: this.rewLabel,
      play: this.playLabel,
      skip: this.skipLabel,
      ff: this.ffLabel,
    };
    const hints = { rew: this.rewHint, play: this.playHint, ff: this.ffHint };
    const down = {
      play: this.phase === "press" || this.phase === "playing",
      rew: this.phase === "rew",
      ff: this.phase === "ff",
    };
    return html`
      <div class="cas" aria-hidden="true" part="cassette">
        <span class="win"></span><span class="lbl">${this.tapeLabel}</span
        ><span class="win"></span>
      </div>
      <div class="lid" aria-hidden="true">${this.lidLabel}</div>
      <div class="face" role="group" aria-label="${this.label}" part="face">
        <span class="brand" aria-hidden="true">${this.brand}</span>
        <div class="vfd" role="status">
          <span class="clock">${this._vfd()}</span>
        </div>
        <div class="keys">
          ${list.map(
            (k) => html`
              <button
                type="button"
                class="${down[k] ? "down" : ""}"
                ?disabled="${off.includes(k)}"
                aria-label="${
                  hints[k] ? `${labels[k]}, ${hints[k]}` : labels[k]
                }"
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

globalThis.customElements.define(RetroVcr.tag, RetroVcr);

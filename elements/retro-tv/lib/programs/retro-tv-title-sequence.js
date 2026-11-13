/**
 * Copyright 2026 The Pennsylvania State University
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { RetroTvProgram } from "../retro-tv-program.js";

/**
 * `retro-tv-title-sequence`
 * An 80s style title sequence: a synthwave sunset, a chrome title rolling up
 * and a Play cue. Every word comes in through attributes, so the host passes
 * translated text. vhs-blog-theme shows it on channel 3.
 *
 * @element retro-tv-title-sequence
 */
export class RetroTvTitleSequence extends RetroTvProgram {
  static get tag() {
    return "retro-tv-title-sequence";
  }

  static get faces() {
    return ["Russo One", "VT323"];
  }

  static get properties() {
    return {
      ...super.properties,
      crawlTitle: { type: String, attribute: "crawl-title" },
      presenter: { type: String },
      kicker: { type: String },
      runtime: { type: String },
      runtimeLabel: { type: String, attribute: "runtime-label" },
      minLabel: { type: String, attribute: "min-label" },
      playLabel: { type: String, attribute: "play-label" },
      sequenceLabel: { type: String, attribute: "sequence-label" },
      presentsLabel: { type: String, attribute: "presents-label" },
    };
  }

  constructor() {
    super();
    this.crawlTitle = "";
    this.presenter = "";
    this.kicker = "";
    this.runtime = "";
    this.runtimeLabel = "Running time";
    this.minLabel = "min";
    this.playLabel = "Play";
    this.sequenceLabel = "Title sequence for";
    this.presentsLabel = "presents";
  }

  defaultLabel() {
    return `${this.sequenceLabel} ${this.crawlTitle}`;
  }

  defaultName() {
    return this.crawlTitle;
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (
      changedProperties.has("crawlTitle") ||
      changedProperties.has("sequenceLabel")
    ) {
      this.dispatchEvent(
        new CustomEvent("retro-tv-program-updated", { bubbles: true }),
      );
    }
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        .scene {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            #07021a 0,
            #1d0a3f 38%,
            #5b1466 58%,
            #ff4fa3 66%,
            #0b0218 66.2%
          );
        }
        .stars {
          position: absolute;
          inset: 0 0 40% 0;
          background:
            radial-gradient(circle, #fff 1px, transparent 1.5px) 0 0 / 53px 41px,
            radial-gradient(
                circle,
                rgba(255, 255, 255, 0.7) 1px,
                transparent 1.5px
              )
              20px 13px / 71px 59px;
        }
        .sun {
          position: absolute;
          left: 50%;
          top: 30%;
          width: 34%;
          aspect-ratio: 1;
          transform: translateX(-50%);
          border-radius: 50%;
          background: linear-gradient(180deg, #ffd60a, #ff7a1a 55%, #ff4fa3);
          mask: linear-gradient(
            #000 0 55%,
            transparent 55% 59%,
            #000 59% 67%,
            transparent 67% 71%,
            #000 71% 78%,
            transparent 78% 83%,
            #000 83% 88%,
            transparent 88% 94%,
            #000 94%
          );
        }
        .floor {
          position: absolute;
          left: -50%;
          right: -50%;
          bottom: -10%;
          height: 46%;
          transform: perspective(300px) rotateX(62deg);
          transform-origin: 50% 0;
          background:
            repeating-linear-gradient(
              90deg,
              rgba(255, 79, 163, 0.85) 0 2px,
              transparent 2px 60px
            ),
            repeating-linear-gradient(
              0deg,
              rgba(255, 79, 163, 0.85) 0 2px,
              transparent 2px 40px
            ),
            #0b0218;
        }
        .crawl {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
          text-align: center;
          padding: 0 8%;
        }
        .k {
          font-family: "Russo One", sans-serif;
          font-size: var(--retro-tv-kicker-size, clamp(12px, 2vw, 18px));
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #cfe9ff;
          /* a dark backing keeps the kicker lines readable over the sun */
          background: rgba(7, 2, 26, 0.72);
          padding: 2px 10px;
          border-radius: 2px;
        }
        .chrome {
          font-family: "Russo One", sans-serif;
          font-size: var(--retro-tv-title-size, clamp(32px, 6vw, 72px));
          line-height: 0.95;
          text-transform: uppercase;
          font-style: italic;
          overflow-wrap: anywhere;
          color: #f2fbff;
          background: linear-gradient(
            180deg,
            #f2fbff 0,
            #ffffff 42%,
            #c9b8ff 48%,
            #ff9ccf 70%,
            #ffd60a
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 4px 0 #1d0a3f)
            drop-shadow(0 0 14px rgba(255, 79, 163, 0.6));
        }
        @media (prefers-reduced-motion: no-preference) {
          :host(:not([still])) .run-a .scene {
            animation: vhs-fade-a 1.8s linear both;
          }
          :host(:not([still])) .run-b .scene {
            animation: vhs-fade-b 1.8s linear both;
          }
          :host(:not([still])) .run-a .crawl {
            animation: vhs-crawl-a 6.5s cubic-bezier(0.2, 0.7, 0.2, 1) 1.4s both;
          }
          :host(:not([still])) .run-b .crawl {
            animation: vhs-crawl-b 6.5s cubic-bezier(0.2, 0.7, 0.2, 1) 1.4s both;
          }
          :host(:not([still])) .run-a .pl {
            animation: vhs-osd-a 1s steps(2) 7.5s both;
          }
          :host(:not([still])) .run-b .pl {
            animation: vhs-osd-b 1s steps(2) 7.5s both;
          }
          :host(:not([still])) .floor {
            animation: vhs-grid 1.2s linear 7;
          }
        }
        @keyframes vhs-fade-a {
          0%,
          60% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        @keyframes vhs-fade-b {
          0%,
          60% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        @keyframes vhs-crawl-a {
          0% {
            transform: translateY(115%);
          }
          100% {
            transform: translateY(0);
          }
        }
        @keyframes vhs-crawl-b {
          0% {
            transform: translateY(115%);
          }
          100% {
            transform: translateY(0);
          }
        }
        @keyframes vhs-osd-a {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        @keyframes vhs-osd-b {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        @keyframes vhs-grid {
          0% {
            background-position:
              0 0,
              0 0;
          }
          100% {
            background-position:
              0 0,
              0 40px;
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="run-${this._run % 2 === 0 ? "a" : "b"}">
        <div class="scene">
          <div class="stars"></div>
          <div class="sun"></div>
          <div class="floor"></div>
        </div>
        <div class="crawl">
          <span class="k">${this.presenter} ${this.presentsLabel}</span>
          <span class="k">${this.kicker}</span>
          <span class="chrome">${this.crawlTitle}</span>
          ${
            this.runtime
              ? html`<span class="k"
                  >${this.runtimeLabel} ${this.runtime} ${this.minLabel}</span
                >`
              : ""
          }
        </div>
        <span class="osd pl">${this.playLabel} &#9654;</span>
      </div>
    `;
  }
}

globalThis.customElements.define(
  RetroTvTitleSequence.tag,
  RetroTvTitleSequence,
);

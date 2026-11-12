/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";

/**
 * `vhs-blog-tv`
 * An old CRT that powers on and rolls an 80s style title sequence for the
 * active post. All motion is CSS and only runs when the visitor has not
 * asked for reduced motion; otherwise (and after skip()) the final frame
 * shows with no motion. The screen is one image to assistive tech, named
 * by the post title; the real heading lives in the page content.
 * "bare" renders only the screen (for the console cabinet) and "off"
 * shows dark glass until a tape plays.
 *
 * @element vhs-blog-tv
 */
export class VhsBlogTv extends LitElement {
  static get tag() {
    return "vhs-blog-tv";
  }

  static get properties() {
    return {
      crawlTitle: { type: String, attribute: "crawl-title" },
      presenter: { type: String },
      kicker: { type: String },
      runtime: { type: String },
      runtimeLabel: { type: String, attribute: "runtime-label" },
      minLabel: { type: String, attribute: "min-label" },
      playLabel: { type: String, attribute: "play-label" },
      channelLabel: { type: String, attribute: "channel-label" },
      sequenceLabel: { type: String, attribute: "sequence-label" },
      presentsLabel: { type: String, attribute: "presents-label" },
      still: { type: Boolean, reflect: true },
      bare: { type: Boolean, reflect: true },
      off: { type: Boolean, reflect: true },
      offLabel: { type: String, attribute: "off-label" },
      _run: { type: Number, state: true },
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
    this.channelLabel = "CH 03";
    this.sequenceLabel = "Title sequence for";
    this.presentsLabel = "presents";
    this.still = false;
    this.bare = false;
    this.off = false;
    this.offLabel = "The TV is off";
    this._run = 0;
  }

  /**
   * Play the title sequence again from power on.
   */
  replay() {
    this.still = false;
    this._run = this._run + 1;
  }

  /**
   * Jump to the final frame.
   */
  skip() {
    this.still = true;
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          /* printed artwork: the same in light and dark, like the theme */
          color-scheme: only dark;
        }
        .tv {
          display: flex;
          gap: 18px;
          padding: 22px;
          box-sizing: border-box;
          border-radius: 22px;
          background:
            repeating-linear-gradient(
              90deg,
              rgba(0, 0, 0, 0.12) 0 2px,
              transparent 2px 9px,
              rgba(255, 255, 255, 0.04) 9px 10px,
              transparent 10px 17px
            ),
            linear-gradient(180deg, #6b4529, #3b2718);
          box-shadow:
            0 24px 60px rgba(0, 0, 0, 0.6),
            inset 0 2px 0 rgba(255, 255, 255, 0.12);
        }
        .bezel {
          flex: 1;
          min-width: 0;
          background: #1a1a1a;
          border-radius: 18px;
          padding: 18px;
          box-shadow:
            inset 0 0 0 3px #2b2b2b,
            inset 0 6px 18px rgba(0, 0, 0, 0.8);
        }
        .side {
          width: 100px;
          flex: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
          padding-top: 12px;
        }
        .knob {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 30%, #9a9a9a, #3a3a3a 70%);
          box-shadow:
            0 3px 0 #111,
            inset 0 0 0 4px rgba(0, 0, 0, 0.25);
          position: relative;
        }
        .knob::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 6px;
          width: 4px;
          height: 15px;
          margin-left: -2px;
          background: #eee;
          border-radius: 2px;
          transform-origin: 50% 20px;
          transform: rotate(40deg);
        }
        .grille {
          width: 76px;
          flex: 1;
          min-height: 110px;
          border-radius: 8px;
          background:
            radial-gradient(circle, #140d08 2.5px, transparent 3px) 0 0 / 9px
              9px,
            #2a1b10;
        }
        .led {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ff3b3b;
          box-shadow: 0 0 8px #ff3b3b;
        }
        @media (max-width: 700px) {
          .side {
            display: none;
          }
          .tv {
            padding: 12px;
          }
          .bezel {
            padding: 10px;
          }
        }
        .screen {
          position: relative;
          aspect-ratio: 4 / 3;
          container-type: inline-size;
          border-radius: 28px / 36px;
          overflow: hidden;
          background: #000;
        }
        :host([bare]) .screen {
          border-radius: 34px / 42px;
        }
        :host([off]) .screen {
          background: radial-gradient(
            ellipse at 38% 30%,
            #3a403c 0,
            #151816 55%,
            #0a0b0a 100%
          );
        }
        :host([off]) .scene,
        :host([off]) .crawl,
        :host([off]) .noise,
        :host([off]) .osd {
          display: none;
        }
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
          gap: clamp(6px, 2.4cqi, 14px);
          text-align: center;
          padding: 0 8%;
        }
        .k {
          font-family: "Russo One", sans-serif;
          font-size: clamp(9px, 2.6cqi, 18px);
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
          font-size: clamp(22px, 9cqi, 72px);
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
        .osd {
          position: absolute;
          font-family: "VT323", monospace;
          font-size: clamp(14px, 4cqi, 28px);
          color: #5dff8a;
          text-shadow: 0 0 6px rgba(93, 255, 138, 0.8);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .ch {
          top: 6%;
          right: 7%;
        }
        .pl {
          bottom: 6%;
          left: 7%;
        }
        .noise {
          position: absolute;
          inset: 0;
          opacity: 0;
          background:
            repeating-radial-gradient(
              circle at 17% 32%,
              rgba(255, 255, 255, 0.5) 0 1px,
              transparent 1px 3px
            ),
            repeating-radial-gradient(
              circle at 71% 63%,
              rgba(255, 255, 255, 0.35) 0 1px,
              transparent 1px 2px
            ),
            #555;
        }
        .scan {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: repeating-linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.28) 0 1px,
            transparent 1px 3px
          );
        }
        .glass {
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: inherit;
          background:
            radial-gradient(
              ellipse at 50% 50%,
              transparent 55%,
              rgba(0, 0, 0, 0.55) 100%
            ),
            linear-gradient(160deg, rgba(255, 255, 255, 0.12), transparent 30%);
        }
        /* motion only for people who have not asked for less of it, and
           never once the sequence is skipped or the page is being edited */
        @media (prefers-reduced-motion: no-preference) {
          :host(:not([still])) .run-a .screen {
            animation: vhs-pow-a 0.9s ease-out both;
          }
          :host(:not([still])) .run-b .screen {
            animation: vhs-pow-b 0.9s ease-out both;
          }
          :host(:not([still])) .run-a .scene {
            animation: vhs-fade-a 1.8s linear both;
          }
          :host(:not([still])) .run-b .scene {
            animation: vhs-fade-b 1.8s linear both;
          }
          :host(:not([still])) .run-a .noise {
            animation: vhs-noise-a 1.5s steps(8) 0.6s both;
          }
          :host(:not([still])) .run-b .noise {
            animation: vhs-noise-b 1.5s steps(8) 0.6s both;
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
        @keyframes vhs-pow-a {
          0% {
            transform: scale(0, 0.004);
            filter: brightness(4);
          }
          40% {
            transform: scale(1, 0.004);
            filter: brightness(4);
          }
          70% {
            transform: scale(1, 1);
            filter: brightness(2);
          }
          100% {
            transform: scale(1, 1);
            filter: brightness(1);
          }
        }
        @keyframes vhs-pow-b {
          0% {
            transform: scale(0, 0.004);
            filter: brightness(4);
          }
          40% {
            transform: scale(1, 0.004);
            filter: brightness(4);
          }
          70% {
            transform: scale(1, 1);
            filter: brightness(2);
          }
          100% {
            transform: scale(1, 1);
            filter: brightness(1);
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
        @keyframes vhs-noise-a {
          0% {
            opacity: 1;
            background-position:
              0 0,
              0 0;
          }
          50% {
            background-position:
              7px 3px,
              -5px 9px;
          }
          99% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        @keyframes vhs-noise-b {
          0% {
            opacity: 1;
            background-position:
              0 0,
              0 0;
          }
          50% {
            background-position:
              7px 3px,
              -5px 9px;
          }
          99% {
            opacity: 1;
          }
          100% {
            opacity: 0;
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

  _renderScreen() {
    const label = this.off
      ? this.offLabel
      : `${this.sequenceLabel} ${this.crawlTitle}`;
    return html`
      <div class="screen" role="img" aria-label="${label}">
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
        <div class="noise"></div>
        <span class="osd ch">${this.channelLabel}</span>
        <span class="osd pl">${this.playLabel} &#9654;</span>
        <div class="scan"></div>
        <div class="glass"></div>
      </div>
    `;
  }

  render() {
    const run = this._run % 2 === 0 ? "a" : "b";
    if (this.bare) {
      return html`<div class="run-${run}" part="tv">
        ${this._renderScreen()}
      </div>`;
    }
    return html`
      <div class="tv run-${run}" part="tv">
        <div class="bezel">${this._renderScreen()}</div>
        <div class="side" aria-hidden="true">
          <span class="led"></span>
          <span class="knob"></span>
          <span class="knob"></span>
          <span class="grille"></span>
        </div>
      </div>
    `;
  }
}
globalThis.customElements.define(VhsBlogTv.tag, VhsBlogTv);

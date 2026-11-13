/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { RetroTvLocalizedProgram } from "../retro-tv-program.js";

/**
 * `retro-tv-disc`
 * A mid 90s disc console boot that has drifted into a late-night
 * anthology: black and white, a hypnotic spiral turning behind a Future
 * Traveler disc that slowly sinks away, an oscilloscope line drawing
 * across, the picture losing its horizontal hold, a glowing HAX wordmark
 * and a "please stand by" card. With reduced motion it is one still frame.
 *
 * @element retro-tv-disc
 */
export class RetroTvDisc extends RetroTvLocalizedProgram {
  static get tag() {
    return "retro-tv-disc";
  }

  static get faces() {
    return ["Russo One", "Roboto Condensed", "VT323"];
  }

  defaultLabel() {
    return this.t.discLabel;
  }

  defaultName() {
    return this.t.discName;
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          background: #050505;
        }
        /* everything on this channel is in black and white */
        .bw {
          position: absolute;
          inset: 0;
          filter: grayscale(1) contrast(1.15);
        }
        .spiral {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 170%;
          aspect-ratio: 1;
          translate: -50% -50%;
          border-radius: 50%;
          background:
            radial-gradient(circle, transparent 0 8%, #050505 62%),
            repeating-conic-gradient(
              from 0deg,
              #f2f2f2 0deg 9deg,
              #050505 9deg 30deg
            );
          mask: radial-gradient(circle, #000 0 30%, transparent 62%);
          opacity: 0.55;
        }
        .disc {
          position: absolute;
          left: 50%;
          top: 46%;
          width: 34%;
          aspect-ratio: 1;
          translate: -50% -50%;
          box-sizing: border-box;
          padding: 8%;
          border-radius: 50%;
          object-fit: contain;
          background: radial-gradient(
            circle,
            #1a1a1a 0 18%,
            #d9d9d9 19% 21%,
            #2a2a2a 22% 100%
          );
          box-shadow:
            0 0 0 2px rgba(255, 255, 255, 0.35),
            0 0 40px rgba(255, 255, 255, 0.25);
        }
        .scope {
          position: absolute;
          left: 0;
          top: 62%;
          height: 18%;
          width: 100%;
        }
        .scope path {
          fill: none;
          stroke: #e8e8e8;
          stroke-width: 2;
          vector-effect: non-scaling-stroke;
          filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.9));
        }
        .word {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          display: grid;
          justify-items: center;
          gap: 0.35em;
          translate: 0 -50%;
          color: #fff;
          text-align: center;
        }
        .word b {
          font-family: "Russo One", sans-serif;
          font-size: var(--retro-tv-program-title, clamp(18px, 5vw, 56px));
          letter-spacing: 0.12em;
          text-shadow:
            0 0 18px rgba(255, 255, 255, 0.75),
            3px 0 0 rgba(255, 255, 255, 0.25),
            -3px 0 0 rgba(255, 255, 255, 0.25);
        }
        .word span {
          font-family: "Roboto Condensed", sans-serif;
          font-size: var(--retro-tv-program-small, clamp(6px, 1.1vw, 12px));
          letter-spacing: 0.3em;
          text-transform: uppercase;
          opacity: 0.85;
        }
        .card {
          position: absolute;
          left: 50%;
          bottom: 7%;
          translate: -50% 0;
          padding: 0.15em 0.8em;
          border: 1px solid rgba(255, 255, 255, 0.7);
          background: rgba(0, 0, 0, 0.6);
          color: #f2f2f2;
          font-family: "VT323", monospace;
          font-size: var(--retro-tv-program-small, clamp(8px, 1.4vw, 16px));
          letter-spacing: 0.2em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        @media (prefers-reduced-motion: no-preference) {
          :host(:not([still])) .spiral {
            animation: retro-tv-spiral 9s linear infinite;
          }
          :host(:not([still])) .disc {
            animation:
              retro-tv-spin 4s linear infinite,
              retro-tv-sink 7s ease-in-out infinite alternate;
          }
          :host(:not([still])) .scope path {
            animation: retro-tv-scope 2.4s linear infinite;
          }
          :host(:not([still])) .bw {
            animation: retro-tv-hold 6s steps(1) infinite;
          }
          :host(:not([still])) .word b {
            animation: retro-tv-glow 2s ease-in-out infinite alternate;
          }
        }
        @keyframes retro-tv-spiral {
          to {
            rotate: 360deg;
          }
        }
        @keyframes retro-tv-spin {
          to {
            rotate: 360deg;
          }
        }
        @keyframes retro-tv-sink {
          from {
            scale: 1.15;
          }
          to {
            scale: 0.55;
          }
        }
        @keyframes retro-tv-scope {
          from {
            stroke-dashoffset: 0;
          }
          to {
            stroke-dashoffset: -200;
          }
        }
        /* the picture slips its horizontal hold now and then */
        @keyframes retro-tv-hold {
          0%,
          88%,
          100% {
            transform: none;
          }
          90% {
            transform: translateX(-3%) skewX(-4deg);
          }
          92% {
            transform: translateX(4%) skewX(3deg);
          }
          94% {
            transform: translateY(-6%);
          }
        }
        @keyframes retro-tv-glow {
          to {
            text-shadow:
              0 0 28px rgba(255, 255, 255, 0.95),
              5px 0 0 rgba(255, 255, 255, 0.3),
              -5px 0 0 rgba(255, 255, 255, 0.3);
          }
        }
      `,
    ];
  }

  render() {
    return html`<div class="bw">
        <div class="spiral"></div>
        <img
          class="disc"
          src="${
            new URL("../art/future-traveler-wonder-purple.svg", import.meta.url)
              .href
          }"
          alt=""
          width="128"
          height="128"
        />
        <svg
          class="scope"
          viewBox="0 0 200 40"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 20 Q 12.5 2 25 20 T 50 20 T 75 20 T 100 20 T 125 20 T 150 20 T 175 20 T 200 20"
            stroke-dasharray="120 80"
          ></path>
        </svg>
      </div>
      <div class="word"><b>HAX</b><span>${this.t.discLicensed}</span></div>
      <div class="card">${this.t.discStandBy}</div>`;
  }
}

globalThis.customElements.define(RetroTvDisc.tag, RetroTvDisc);

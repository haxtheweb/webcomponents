/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { RetroTvLocalizedProgram } from "../retro-tv-program.js";

/**
 * `retro-tv-disc`
 * A boot screen in the style of a mid 90s disc console: a Future Traveler
 * sticker spins like a disc behind a glowing HAX wordmark.
 *
 * @element retro-tv-disc
 */
export class RetroTvDisc extends RetroTvLocalizedProgram {
  static get tag() {
    return "retro-tv-disc";
  }

  static get faces() {
    return ["Russo One", "Roboto Condensed"];
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
          background: radial-gradient(
            ellipse at center,
            #2b2b2b 0,
            #0d0d0d 70%
          );
        }
        .disc {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 46%;
          aspect-ratio: 1;
          translate: -50% -50%;
          border-radius: 50%;
          opacity: 0.85;
          box-sizing: border-box;
          padding: 8%;
          object-fit: contain;
          box-shadow:
            0 0 0 2px rgba(255, 255, 255, 0.2),
            inset 0 0 0 30px rgba(255, 255, 255, 0.04);
        }
        .word {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 0.4em;
          color: #fff;
          text-align: center;
        }
        .word b {
          font-family: "Russo One", sans-serif;
          font-size: var(--retro-tv-program-title, clamp(18px, 5vw, 56px));
          letter-spacing: 0.12em;
          text-shadow: 0 0 18px rgba(255, 255, 255, 0.7);
        }
        .word span {
          font-family: "Roboto Condensed", sans-serif;
          font-size: var(--retro-tv-program-small, clamp(6px, 1.1vw, 12px));
          letter-spacing: 0.3em;
          text-transform: uppercase;
          opacity: 0.85;
        }
        @media (prefers-reduced-motion: no-preference) {
          :host(:not([still])) .disc {
            animation: retro-tv-spin 4s linear infinite;
          }
          :host(:not([still])) .word b {
            animation: retro-tv-glow 2s ease-in-out infinite alternate;
          }
        }
        @keyframes retro-tv-spin {
          to {
            rotate: 360deg;
          }
        }
        @keyframes retro-tv-glow {
          to {
            text-shadow: 0 0 28px rgba(255, 255, 255, 0.95);
          }
        }
      `,
    ];
  }

  render() {
    return html`<img
        class="disc"
        src="${
          new URL("../art/future-traveler-wonder-purple.svg", import.meta.url)
            .href
        }"
        alt=""
        width="128"
        height="128"
      />
      <div class="word"><b>HAX</b><span>${this.t.discLicensed}</span></div>`;
  }
}

globalThis.customElements.define(RetroTvDisc.tag, RetroTvDisc);

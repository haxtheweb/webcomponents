/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { RetroTvLocalizedProgram } from "../retro-tv-program.js";

/**
 * `retro-tv-sign-on`
 * Channel 1: the station sign-on card. Color bars, the Future Traveler in
 * the station circle, "HAX TV" and the line under it (ten years to lift
 * off, by default). A soft sweep runs down the bars unless motion is off.
 *
 * @element retro-tv-sign-on
 */
export class RetroTvSignOn extends RetroTvLocalizedProgram {
  static get tag() {
    return "retro-tv-sign-on";
  }

  static get faces() {
    return ["Press Start 2P", "VT323"];
  }

  static get properties() {
    return {
      ...super.properties,
      /** the line under HAX TV; defaults to the translated "ten years" line */
      caption: { type: String },
    };
  }

  constructor() {
    super();
    this.caption = "";
  }

  defaultLabel() {
    return this.t.signOnLabel;
  }

  defaultName() {
    return this.t.signOnName;
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          background: #101010;
        }
        /* generic test card bars, then a darker castellation row */
        .bars {
          position: absolute;
          inset: 0 0 26% 0;
          background: linear-gradient(
            90deg,
            #c0c0c0 0 14.28%,
            #c0c000 14.28% 28.57%,
            #00c0c0 28.57% 42.85%,
            #00c000 42.85% 57.14%,
            #c000c0 57.14% 71.42%,
            #c00000 71.42% 85.71%,
            #0000c0 85.71% 100%
          );
        }
        .row {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 14%;
          height: 12%;
          background: linear-gradient(
            90deg,
            #0000c0 0 14.28%,
            #131313 14.28% 28.57%,
            #c000c0 28.57% 42.85%,
            #131313 42.85% 57.14%,
            #00c0c0 57.14% 71.42%,
            #131313 71.42% 85.71%,
            #c0c0c0 85.71% 100%
          );
        }
        .base {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 14%;
          background: linear-gradient(
            90deg,
            #00214c 0 18%,
            #ffffff 18% 36%,
            #32006a 36% 54%,
            #131313 54% 100%
          );
        }
        .sweep {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 12%;
          background: linear-gradient(
            180deg,
            transparent,
            rgba(255, 255, 255, 0.18),
            transparent
          );
          opacity: 0;
        }
        .circle {
          position: absolute;
          left: 50%;
          top: 37%;
          width: 38%;
          aspect-ratio: 1;
          translate: -50% -50%;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #101010;
          box-shadow:
            0 0 0 4px #ffffff,
            0 0 0 7px #101010;
        }
        .circle img {
          width: 66%;
          height: auto;
        }
        .ident {
          position: absolute;
          left: 50%;
          top: 66%;
          translate: -50% -50%;
          display: grid;
          justify-items: center;
          gap: 0.4em;
          padding: 0.45em 0.9em;
          background: #101010;
          color: #ffffff;
          text-align: center;
          white-space: nowrap;
        }
        .ident b {
          font-family: "Press Start 2P", "VT323", monospace;
          font-size: var(--retro-tv-program-title, clamp(12px, 3.2vw, 34px));
          font-weight: 400;
          letter-spacing: 0.08em;
        }
        .ident span {
          font-family: "VT323", monospace;
          font-size: var(--retro-tv-program-small, clamp(8px, 1.5vw, 16px));
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #ffd100;
        }
        @media (prefers-reduced-motion: no-preference) {
          :host(:not([still])) .sweep {
            animation: retro-tv-sweep 5s linear infinite;
          }
        }
        @keyframes retro-tv-sweep {
          0% {
            transform: translateY(-100%);
            opacity: 1;
          }
          100% {
            transform: translateY(800%);
            opacity: 1;
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="bars"></div>
      <div class="row"></div>
      <div class="base"></div>
      <div class="sweep"></div>
      <div class="circle">
        <img
          src="${new URL("../art/future-traveler.png", import.meta.url).href}"
          alt=""
          width="96"
          height="96"
        />
      </div>
      <div class="ident">
        <b>HAX TV</b>
        <span>${this.caption || this.t.signOnCaption}</span>
      </div>
    `;
  }
}

globalThis.customElements.define(RetroTvSignOn.tag, RetroTvSignOn);

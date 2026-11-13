/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { RetroTvLocalizedProgram } from "../retro-tv-program.js";

/**
 * `retro-tv-credits`
 * End credits starring the Future Traveler, with a tape label. Pass
 * `lines` ([{ role, name }]) to write your own credits and `tape` for the
 * label (for example the install date); otherwise the HAX credits roll.
 *
 * @element retro-tv-credits
 */
export class RetroTvCredits extends RetroTvLocalizedProgram {
  static get tag() {
    return "retro-tv-credits";
  }

  static get faces() {
    return ["Russo One", "Roboto Condensed", "VT323"];
  }

  static get properties() {
    return {
      ...super.properties,
      lines: { type: Array },
      tape: { type: String },
    };
  }

  constructor() {
    super();
    this.lines = [];
    this.tape = "";
  }

  defaultLabel() {
    return this.t.creditsLabel;
  }

  defaultName() {
    return this.t.creditsName;
  }

  _lines() {
    if (this.lines && this.lines.length) {
      return this.lines;
    }
    return [
      { role: this.t.creditsStarring, name: this.t.creditsFutureTraveler },
      { role: this.t.creditsWrittenBy, name: this.t.creditsYou },
      {
        role: this.t.creditsBuiltToLast,
        name: this.t.creditsLightOnThePlanet,
      },
      { role: this.t.creditsThanksFor, name: this.t.creditsHaxingTheWeb },
    ];
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          background: #000321;
        }
        .roll {
          position: absolute;
          left: 0;
          right: 0;
          top: 8%;
          text-align: center;
          color: #fff;
          font-family: "Russo One", sans-serif;
          font-size: var(--retro-tv-program-text, clamp(10px, 1.8vw, 18px));
          line-height: 1.5;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .roll p {
          margin: 0 0 1em;
        }
        .roll small {
          display: block;
          font-family: "Roboto Condensed", sans-serif;
          font-size: 0.8em;
          text-transform: none;
          letter-spacing: 0;
          opacity: 0.8;
        }
        img {
          position: absolute;
          z-index: 2;
          width: 24%;
          height: auto;
          right: 6%;
          bottom: 4%;
        }
        .label {
          position: absolute;
          z-index: 3;
          left: 6%;
          bottom: 8%;
          padding: 2px 8px;
          background: #f2f2f4;
          color: #262626;
          font-family: "VT323", monospace;
          font-size: var(--retro-tv-program-small, clamp(10px, 1.6vw, 16px));
          transform: rotate(-3deg);
          box-shadow: 0 2px 0 rgba(0, 0, 0, 0.4);
        }
        @media (prefers-reduced-motion: no-preference) {
          :host(:not([still])) .run-a .roll {
            animation: retro-tv-roll-a 14s linear both;
          }
          :host(:not([still])) .run-b .roll {
            animation: retro-tv-roll-b 14s linear both;
          }
          :host(:not([still])) img {
            animation: retro-tv-hop 1.4s ease-in-out infinite;
          }
        }
        @keyframes retro-tv-roll-a {
          0% {
            transform: translateY(var(--retro-tv-roll-start, 110%));
          }
          100% {
            transform: translateY(-120%);
          }
        }
        @keyframes retro-tv-roll-b {
          0% {
            transform: translateY(var(--retro-tv-roll-start, 110%));
          }
          100% {
            transform: translateY(-120%);
          }
        }
        @keyframes retro-tv-hop {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8%);
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="run-${this._run % 2 === 0 ? "a" : "b"}">
        ${
          this.tape
            ? html`<span class="label"
                >${this.t.creditsTape} ${this.tape}</span
              >`
            : ""
        }
        <div class="roll">
          ${this._lines().map(
            (line) => html`<p><small>${line.role}</small>${line.name}</p>`,
          )}
        </div>
        <img
          src="${new URL("../art/future-traveler.png", import.meta.url).href}"
          alt=""
          width="128"
          height="128"
        />
      </div>
    `;
  }
}

globalThis.customElements.define(RetroTvCredits.tag, RetroTvCredits);

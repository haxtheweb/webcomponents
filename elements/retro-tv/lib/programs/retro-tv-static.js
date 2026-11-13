/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { RetroTvLocalizedProgram } from "../retro-tv-program.js";

// where each character rests when the picture is still, and its path
const HOME = [
  [6, 12, -12],
  [70, 56, 20],
  [34, 4, 8],
  [12, 54, -24],
  [52, 32, 160],
  [80, 10, -8],
  [28, 60, 30],
  [62, 66, -150],
];
const PATHS = ["tumble-a", "tumble-b", "tumble-c", "tumble-d"];

/**
 * `retro-tv-static`
 * No tape: grey static with a cast of rpg-characters tumbling through it
 * and a little RGB glitch. The static moves at a constant average
 * brightness, so it never flashes. The cast loads the first time the
 * program goes on air. `cast` is a list of rpg-character seeds.
 *
 * @element retro-tv-static
 */
export class RetroTvStatic extends RetroTvLocalizedProgram {
  static get tag() {
    return "retro-tv-static";
  }

  static get properties() {
    return {
      ...super.properties,
      /** rpg-character seeds that tumble through the static */
      cast: { type: Array },
      /** words in the box at the bottom */
      offAir: { type: String, attribute: "off-air" },
      _loaded: { type: Boolean, state: true },
    };
  }

  constructor() {
    super();
    this.cast = ["haxtheweb", "future", "traveler", "btopro", "static"];
    this.offAir = "";
    this._loaded = false;
  }

  defaultLabel() {
    return this.t.staticLabel;
  }

  defaultName() {
    return this.t.staticName;
  }

  willUpdate(changedProperties) {
    if (super.willUpdate) {
      super.willUpdate(changedProperties);
    }
    if (changedProperties.has("onAir") && this.onAir && !this._loaded) {
      this._loaded = true;
      import("@haxtheweb/rpg-character/rpg-character.js");
    }
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          background: #5b5d63;
          container-type: inline-size;
        }
        .snow {
          position: absolute;
          left: -50%;
          top: -50%;
          width: 200%;
          height: 200%;
          opacity: 0.55;
        }
        .roll {
          position: absolute;
          left: 0;
          right: 0;
          top: -30%;
          height: 22%;
          background: linear-gradient(
            180deg,
            transparent,
            rgba(255, 255, 255, 0.1) 45%,
            rgba(0, 0, 0, 0.18) 55%,
            transparent
          );
        }
        .bot {
          position: absolute;
          left: var(--bot-x);
          top: var(--bot-y);
          transform: rotate(var(--bot-r));
        }
        @container (max-width: 520px) {
          .bot rpg-character {
            zoom: 0.55;
          }
        }
        @container (max-width: 300px) {
          .bot rpg-character {
            zoom: 0.4;
          }
        }
        .offair {
          position: absolute;
          left: 50%;
          bottom: 9%;
          transform: translateX(-50%);
          padding: 2px 10px;
          white-space: nowrap;
          font-family: "VT323", monospace;
          font-size: clamp(12px, 3.6cqi, 24px);
          letter-spacing: 0.1em;
          color: #ffffff;
          background: rgba(0, 0, 0, 0.72);
        }
        @media (prefers-reduced-motion: no-preference) {
          :host(:not([still])) .snow {
            animation: snow 0.5s steps(5) infinite;
          }
          :host(:not([still])) .roll {
            animation: roll 5s linear infinite;
          }
          :host(:not([still])) .bot {
            animation: var(--bot-path) var(--bot-dur) linear var(--bot-delay)
              infinite;
          }
          :host(:not([still])) .bot rpg-character {
            animation: rgb 2.6s step-end var(--bot-delay) infinite;
          }
        }
        @keyframes snow {
          0% {
            transform: translate(0, 0);
          }
          20% {
            transform: translate(-7%, 4%);
          }
          40% {
            transform: translate(5%, -6%);
          }
          60% {
            transform: translate(-3%, 7%);
          }
          80% {
            transform: translate(8%, 2%);
          }
          100% {
            transform: translate(0, 0);
          }
        }
        @keyframes roll {
          0% {
            top: -30%;
          }
          100% {
            top: 110%;
          }
        }
        @keyframes tumble-a {
          0% {
            left: 2%;
            top: 10%;
            transform: rotate(0);
          }
          25% {
            left: 40%;
            top: 62%;
            transform: rotate(200deg);
          }
          50% {
            left: 78%;
            top: 22%;
            transform: rotate(380deg);
          }
          75% {
            left: 44%;
            top: 2%;
            transform: rotate(560deg);
          }
          100% {
            left: 2%;
            top: 10%;
            transform: rotate(720deg);
          }
        }
        @keyframes tumble-b {
          0% {
            left: 76%;
            top: 60%;
            transform: rotate(0);
          }
          25% {
            left: 48%;
            top: 4%;
            transform: rotate(-170deg);
          }
          50% {
            left: 6%;
            top: 40%;
            transform: rotate(-360deg);
          }
          75% {
            left: 36%;
            top: 64%;
            transform: rotate(-540deg);
          }
          100% {
            left: 76%;
            top: 60%;
            transform: rotate(-720deg);
          }
        }
        @keyframes tumble-c {
          0% {
            left: 30%;
            top: -24%;
            transform: rotate(-30deg);
          }
          100% {
            left: 58%;
            top: 104%;
            transform: rotate(330deg);
          }
        }
        @keyframes tumble-d {
          0% {
            left: -20%;
            top: 44%;
            transform: rotate(0);
          }
          50% {
            left: 46%;
            top: 30%;
            transform: rotate(180deg) scale(1.15);
          }
          100% {
            left: 104%;
            top: 54%;
            transform: rotate(360deg);
          }
        }
        @keyframes rgb {
          0% {
            filter: none;
            transform: none;
          }
          86% {
            filter: drop-shadow(-4px 0 0 #22e4ff) drop-shadow(4px 0 0 #ff2e88);
            transform: translateX(3px);
          }
          92% {
            filter: none;
            transform: none;
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <svg
        class="snow"
        viewBox="0 0 400 300"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <filter id="retro-tv-snow">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.6"
            numOctaves="1"
            stitchTiles="stitch"
          ></feTurbulence>
          <feColorMatrix type="saturate" values="0"></feColorMatrix>
        </filter>
        <rect width="400" height="300" filter="url(#retro-tv-snow)"></rect>
      </svg>
      <div class="roll"></div>
      ${
        this._loaded
          ? (this.cast || []).slice(0, HOME.length).map((seed, i) => {
              const style = [
                `--bot-x:${HOME[i][0]}%`,
                `--bot-y:${HOME[i][1]}%`,
                `--bot-r:${HOME[i][2]}deg`,
                `--bot-path:${PATHS[i % PATHS.length]}`,
                `--bot-dur:${7 + ((i * 3) % 6)}s`,
                `--bot-delay:-${(i * 1.7).toFixed(1)}s`,
              ].join(";");
              return html`<span class="bot" style="${style}"
                ><rpg-character
                  seed="${seed}"
                  height="90"
                  width="72"
                ></rpg-character
              ></span>`;
            })
          : ""
      }
      <span class="offair">${this.offAir || this.t.staticOffAir}</span>
    `;
  }
}

globalThis.customElements.define(RetroTvStatic.tag, RetroTvStatic);

/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { RetroKitStyles } from "./retro-kit.js";
import { retroTvLoadFace } from "./retro-tv-program.js";
import "@haxtheweb/rpg-character/rpg-character.js";

/**
 * `retro-console`
 * The HAX 64: a game deck in a HAX TV kit colorway with a cartridge in the
 * slot. The cartridge has a real cart shape and a colorful label: the
 * game's name over four rpg-character fighters (HAX Melee by default).
 * Power (with a green lamp) and Reset sit on the front left, the "HAX 64"
 * badge on the right in the HAX logo font.
 *
 * Power and Reset are real buttons. Power toggles `power` and fires
 * `retro-console-power` (detail.power); Reset fires `retro-console-reset`.
 *
 * @element retro-console
 * @fires retro-console-power - detail { power }
 * @fires retro-console-reset
 */
export class RetroConsole extends LitElement {
  static get tag() {
    return "retro-console";
  }

  static get properties() {
    return {
      /** helmet (red), goggle (cyan) or bulb (yellow) */
      colorway: { type: String, reflect: true },
      /** whether the console is on (lamp lit) */
      power: { type: Boolean, reflect: true },
      /** the cartridge's game: first word in yellow, the rest in white */
      cartridge: { type: String },
      /** seeds for the four fighters on the cartridge label */
      fighters: { type: Array },
      /** badge on the front */
      brand: { type: String },
      model: { type: String },
      /** accessible names (pass translated text) */
      label: { type: String },
      powerLabel: { type: String, attribute: "power-label" },
      resetLabel: { type: String, attribute: "reset-label" },
    };
  }

  constructor() {
    super();
    this.colorway = "helmet";
    this.power = false;
    this.cartridge = "HAX Melee";
    this.fighters = ["haxtheweb", "btopro", "future", "traveler"];
    this.brand = "HAX";
    this.model = "64";
    this.label = "HAX 64 console";
    this.powerLabel = "Console power";
    this.resetLabel = "Reset the game";
  }

  connectedCallback() {
    super.connectedCallback();
    retroTvLoadFace("Press Start 2P");
  }

  _power() {
    this.power = !this.power;
    this.dispatchEvent(
      new CustomEvent("retro-console-power", {
        bubbles: true,
        composed: true,
        detail: { power: this.power },
      }),
    );
  }

  _reset() {
    this.dispatchEvent(
      new CustomEvent("retro-console-reset", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  static get styles() {
    return [
      RetroKitStyles,
      css`
        :host {
          display: inline-block;
          padding-top: 58px;
        }
        :host([hidden]) {
          display: none;
        }
        .deck {
          position: relative;
          width: 232px;
          max-width: 100%;
          height: 58px;
          border-radius: 9px 9px 12px 12px;
          background: var(--retro-kit-body);
          box-shadow:
            inset 0 2px 0 rgba(255, 255, 255, 0.28),
            inset 0 -6px 0 rgba(0, 0, 0, 0.25),
            0 8px 14px rgba(0, 0, 0, 0.35);
        }
        .slot {
          position: absolute;
          z-index: 2;
          left: 50%;
          top: 5px;
          width: 132px;
          height: 10px;
          transform: translateX(-50%);
          border-radius: 3px;
          background: #121214;
          box-shadow:
            inset 0 2px 3px rgba(0, 0, 0, 0.8),
            0 1px 0 rgba(255, 255, 255, 0.25);
        }
        .cart {
          position: absolute;
          z-index: 1;
          left: 50%;
          top: -56px;
          width: 128px;
          height: 68px;
          transform: translateX(-50%);
          background: linear-gradient(180deg, #4a4d54, #2e3035);
          border-radius: 10px 10px 2px 2px;
          clip-path: polygon(0 12%, 6% 0, 94% 0, 100% 12%, 100% 100%, 0 100%);
          box-shadow: inset 0 2px 0 rgba(255, 255, 255, 0.18);
        }
        .grip {
          position: absolute;
          left: 10px;
          right: 10px;
          top: 4px;
          height: 6px;
          border-radius: 2px;
          background: repeating-linear-gradient(
            90deg,
            rgba(0, 0, 0, 0.45) 0 2px,
            rgba(255, 255, 255, 0.12) 2px 4px
          );
        }
        .label {
          position: absolute;
          left: 8px;
          right: 8px;
          top: 13px;
          height: 42px;
          box-sizing: border-box;
          padding: 3px 0 2px;
          border: 2px solid #f5f1e8;
          border-radius: 2px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          background:
            radial-gradient(circle at 50% 40%, #ffd100 0 18%, transparent 19%),
            conic-gradient(
              from 0deg at 50% 40%,
              #f2665e 0 25%,
              #2fd3e0 0 50%,
              #bc204b 0 75%,
              #ffd100 0
            );
        }
        .ttl {
          white-space: nowrap;
          font:
            8px/1 "Press Start 2P",
            monospace;
          color: #ffffff;
          text-shadow:
            1px 1px 0 #000,
            -1px 1px 0 #000,
            1px -1px 0 #000,
            -1px -1px 0 #000;
        }
        .ttl b {
          font-weight: 400;
          color: #ffd100;
        }
        .fighters {
          display: flex;
          align-items: flex-end;
          gap: 1px;
          height: 20px;
        }
        .fighters rpg-character {
          filter: drop-shadow(1px 1px 0 rgba(0, 0, 0, 0.6));
        }
        .fighters .face-left {
          transform: scaleX(-1);
        }
        .vs {
          align-self: center;
          margin: 0 1px;
          font:
            6px "Press Start 2P",
            monospace;
          color: #ffffff;
          text-shadow:
            1px 1px 0 #000,
            -1px -1px 0 #000;
        }
        .front {
          position: absolute;
          z-index: 3;
          left: 8px;
          right: 8px;
          bottom: 7px;
          height: 28px;
          border-radius: 5px;
          background: var(--retro-kit-plate);
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 0 8px 0 4px;
        }
        .fb {
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }
        button {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
          width: 26px;
          height: 26px;
          display: grid;
          place-items: center;
          border-radius: 3px;
        }
        .cap {
          width: 20px;
          height: 11px;
          border-radius: 2px;
          background: linear-gradient(180deg, #c9ccd2, #8a8f99);
          box-shadow: 0 2px 0 #0a0a0a;
        }
        button:active .cap {
          transform: translateY(1px);
          box-shadow: 0 1px 0 #0a0a0a;
        }
        button:focus-visible {
          outline: 2px solid #ffffff;
        }
        .lamp {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #2f3a32;
          box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.5);
        }
        :host([power]) .lamp {
          background: #5dff8a;
          box-shadow: 0 0 6px #5dff8a;
        }
        .cl {
          font:
            700 6px/1 "Roboto Condensed",
            sans-serif;
          letter-spacing: 0.08em;
          color: var(--retro-kit-plate-ink);
        }
        .badge {
          margin-left: auto;
          display: inline-flex;
          align-items: baseline;
          gap: 3px;
          font:
            9px "Press Start 2P",
            monospace;
          color: var(--retro-kit-ink);
        }
        .badge span {
          font-size: 7px;
          color: var(--retro-kit-plate-ink);
        }
        @media (forced-colors: active) {
          button {
            border: 1px solid ButtonText;
          }
        }
      `,
    ];
  }

  render() {
    const words = (this.cartridge || "").split(" ");
    const first = words.shift();
    const seeds = (this.fighters || []).slice(0, 4);
    return html`
      <div class="deck" role="group" aria-label="${this.label}" part="deck">
        <span class="cart" aria-hidden="true" part="cartridge">
          <span class="grip"></span>
          <span class="label">
            <span class="ttl"><b>${first}</b> ${words.join(" ")}</span>
            <span class="fighters">
              ${seeds.map(
                (s, i) =>
                  html`${i === 2 ? html`<span class="vs">VS</span>` : ""}
                    <rpg-character
                      class="${i >= 2 ? "face-left" : ""}"
                      seed="${s}"
                      height="20"
                      width="16"
                    ></rpg-character>`,
              )}
            </span>
          </span>
        </span>
        <span class="slot" aria-hidden="true"></span>
        <span class="front">
          <span class="fb">
            <button
              type="button"
              aria-pressed="${this.power ? "true" : "false"}"
              aria-label="${this.powerLabel}"
              @click="${this._power}"
            >
              <span class="cap"></span>
            </button>
            <i class="lamp" aria-hidden="true"></i>
            <span class="cl" aria-hidden="true">POWER</span>
          </span>
          <span class="fb">
            <button
              type="button"
              aria-label="${this.resetLabel}"
              @click="${this._reset}"
            >
              <span class="cap"></span>
            </button>
            <span class="cl" aria-hidden="true">RESET</span>
          </span>
          <span class="badge" aria-hidden="true"
            >${this.brand}<span>${this.model}</span></span
          >
        </span>
      </div>
    `;
  }
}

globalThis.customElements.define(RetroConsole.tag, RetroConsole);

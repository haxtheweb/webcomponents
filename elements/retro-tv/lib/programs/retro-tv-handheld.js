/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { RetroTvLocalizedProgram } from "../retro-tv-program.js";

/**
 * `retro-tv-handheld`
 * A boot screen in the style of a late 80s green-screen handheld: a pixel
 * HAX wordmark drops in, then a line under it.
 *
 * @element retro-tv-handheld
 */
export class RetroTvHandheld extends RetroTvLocalizedProgram {
  static get tag() {
    return "retro-tv-handheld";
  }

  static get faces() {
    return ["Press Start 2P"];
  }

  defaultLabel() {
    return this.t.handheldLabel;
  }

  defaultName() {
    return this.t.handheldName;
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          background: #9bbc0f;
        }
        .word {
          position: absolute;
          left: 0;
          right: 0;
          top: 38%;
          text-align: center;
          font-family: "Press Start 2P", "VT323", monospace;
          font-size: var(--retro-tv-program-title, clamp(14px, 4vw, 40px));
          color: #0f380f;
        }
        .sub {
          position: absolute;
          left: 0;
          right: 0;
          top: 58%;
          text-align: center;
          font-family: "Press Start 2P", "VT323", monospace;
          font-size: var(--retro-tv-program-small, clamp(6px, 1.2vw, 12px));
          color: #306230;
        }
        @media (prefers-reduced-motion: no-preference) {
          :host(:not([still])) .run-a .word {
            animation: retro-tv-drop-a 1.4s steps(14) both;
          }
          :host(:not([still])) .run-b .word {
            animation: retro-tv-drop-b 1.4s steps(14) both;
          }
          :host(:not([still])) .run-a .sub {
            animation: retro-tv-show-a 0.3s steps(2) 1.5s both;
          }
          :host(:not([still])) .run-b .sub {
            animation: retro-tv-show-b 0.3s steps(2) 1.5s both;
          }
        }
        @keyframes retro-tv-drop-a {
          from {
            transform: translateY(-260%);
          }
          to {
            transform: translateY(0);
          }
        }
        @keyframes retro-tv-drop-b {
          from {
            transform: translateY(-260%);
          }
          to {
            transform: translateY(0);
          }
        }
        @keyframes retro-tv-show-a {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes retro-tv-show-b {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `,
    ];
  }

  render() {
    return html`<div class="run-${this._run % 2 === 0 ? "a" : "b"}">
      <div class="word">HAX</div>
      <div class="sub">${this.t.handheldSub}</div>
    </div>`;
  }
}

globalThis.customElements.define(RetroTvHandheld.tag, RetroTvHandheld);

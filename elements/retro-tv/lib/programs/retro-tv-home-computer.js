/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { RetroTvLocalizedProgram } from "../retro-tv-program.js";

/**
 * `retro-tv-home-computer`
 * A loading screen in the style of an early 80s home computer: a BASIC
 * prompt types itself out and, while `loading`, the border runs loading
 * stripes. `what` is the name on the LOAD line.
 *
 * @element retro-tv-home-computer
 */
export class RetroTvHomeComputer extends RetroTvLocalizedProgram {
  static get tag() {
    return "retro-tv-home-computer";
  }

  static get faces() {
    return ["VT323"];
  }

  static get properties() {
    return {
      ...super.properties,
      what: { type: String },
      _typed: { type: Number, state: true },
    };
  }

  constructor() {
    super();
    this.what = "HAXCMS";
    this._typed = -1;
    this.__timer = null;
  }

  defaultLabel() {
    return this.t.homeComputerLabel;
  }

  defaultName() {
    return this.t.homeComputerName;
  }

  _text() {
    const what = String(this.what || "").toUpperCase();
    return [
      `    ${this.t.homeComputerBanner}`,
      "",
      ` ${this.t.homeComputerTagline}`,
      "",
      this.t.homeComputerReady,
      `LOAD "${what}",8,1`,
      "",
      `${this.t.homeComputerSearching} ${what}`,
      this.loading ? this.t.homeComputerLoading : this.t.homeComputerReady,
    ].join("\n");
  }

  restart() {
    super.restart();
    clearTimeout(this.__timer);
    if (!this.moving) {
      this._typed = -1;
      return;
    }
    this._typed = 0;
    const step = () => {
      const all = this._text().length;
      if (this._typed < all && this.onAir) {
        this._typed = this._typed + 2;
        this.__timer = setTimeout(step, 22);
      } else {
        this._typed = -1;
      }
    };
    step();
  }

  willUpdate(changedProperties) {
    super.willUpdate(changedProperties);
    if (
      changedProperties.has("loading") &&
      !changedProperties.has("onAir") &&
      this.onAir
    ) {
      this.restart();
    }
  }

  disconnectedCallback() {
    clearTimeout(this.__timer);
    super.disconnectedCallback();
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          background: #8f8bff;
        }
        :host([loading]) {
          background: repeating-linear-gradient(
            0deg,
            #ff5a5a 0 7px,
            #5af0ff 7px 13px,
            #ffe35a 13px 19px,
            #5a5aff 19px 25px
          );
          background-size: 100% 25px;
        }
        .in {
          position: absolute;
          inset: 11% 9%;
          margin: 0;
          background: #3b37c9;
          color: #a9a6ff;
          font-family: "VT323", monospace;
          font-size: var(--retro-tv-program-text, clamp(10px, 2vw, 22px));
          line-height: 1.2;
          padding: 0.4em 0.5em;
          white-space: pre-wrap;
          overflow: hidden;
          text-transform: uppercase;
        }
        .cur {
          display: inline-block;
          width: 0.6em;
          height: 1em;
          background: #a9a6ff;
          vertical-align: -2px;
        }
        @media (prefers-reduced-motion: no-preference) {
          :host([loading]:not([still])) {
            animation: retro-tv-stripes 0.25s steps(4) infinite;
          }
        }
        @keyframes retro-tv-stripes {
          to {
            background-position: 0 25px;
          }
        }
      `,
    ];
  }

  render() {
    const text = this._text();
    const shown = this._typed === -1 ? text : text.slice(0, this._typed);
    return html`<pre class="in">${shown}<span class="cur"></span></pre>`;
  }
}

globalThis.customElements.define(RetroTvHomeComputer.tag, RetroTvHomeComputer);

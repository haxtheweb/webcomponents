/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, svg, nothing } from "lit";
import { retroTvLoadFace } from "./lib/retro-tv-program.js";

const DIAL = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const POWER_ICON = svg`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42A6.92 6.92 0 0 1 19 12c0 3.87-3.13 7-7 7A6.995 6.995 0 0 1 7.58 6.58L6.17 5.17A8.932 8.932 0 0 0 3 12a9 9 0 0 0 18 0c0-2.74-1.23-5.18-3.17-6.83z"></path></svg>`;

/**
 * `retro-tv`
 * An old CRT with channels. Each child with a `channel` attribute is a
 * program; the one whose number matches `channel` is on air and the rest
 * wait off screen. Programs can be any element: the ones in
 * `lib/retro-tv-programs.js` (HAX TV, credits, loading screens, the title
 * sequence) or a plain element with `channel` and `label` attributes.
 *
 * The cabinet is printed artwork, so it looks the same in light and dark.
 * All motion is CSS (or a program's own frame loop) and only runs when the
 * viewer has not asked for reduced motion and `still` is not set.
 *
 * A child with `slot="overlay"` sits over every program, under the glass
 * (a host can keep a banner on screen whatever channel is on).
 *
 * With `controls`, the dial and power button are real buttons (next channel, power) and the
 * screen announces what is on; without it the knobs are decoration.
 *
 * @demo demo/index.html
 * @element retro-tv
 * @fires retro-tv-channel-changed - detail { channel, program }
 * @fires retro-tv-power-changed - detail { power }
 */
export class RetroTv extends LitElement {
  static get tag() {
    return "retro-tv";
  }

  static get properties() {
    return {
      /** channel on air; a program whose `channel` matches is shown */
      channel: { type: Number, reflect: true },
      /** whether the set is on */
      power: { type: Boolean, reflect: true },
      /** no motion: final frames only */
      still: { type: Boolean, reflect: true },
      /** make the knobs working buttons */
      controls: { type: Boolean, reflect: true },
      /** on-screen channel text; defaults to "CH" and the number */
      channelLabel: { type: String, attribute: "channel-label" },
      /** short word before the channel number when channel-label is not set */
      channelPrefix: { type: String, attribute: "channel-prefix" },
      /** fade the on-screen channel number a moment after tuning */
      osdFade: { type: Boolean, attribute: "osd-fade" },
      /** localStorage key that remembers power for this viewer */
      rememberPower: { type: String, attribute: "remember-power" },
      /** accessible names for the controls (pass translated text) */
      nextChannelLabel: { type: String, attribute: "next-channel-label" },
      powerOnLabel: { type: String, attribute: "power-on-label" },
      powerOffLabel: { type: String, attribute: "power-off-label" },
      /** what the screen is called when the set is off */
      offLabel: { type: String, attribute: "off-label" },
      _run: { type: Number, state: true },
      _flash: { type: Boolean, state: true },
      _osdHidden: { type: Boolean, state: true },
    };
  }

  constructor() {
    super();
    this.channel = 3;
    this.power = true;
    this.still = false;
    this.controls = false;
    this.channelLabel = "";
    this.channelPrefix = "CH";
    this.osdFade = false;
    this.rememberPower = "";
    this.nextChannelLabel = "Next channel";
    this.powerOnLabel = "Turn the TV on";
    this.powerOffLabel = "Turn the TV off";
    this.offLabel = "TV is off";
    this._run = 0;
    this._flash = false;
    this._osdHidden = false;
    this.__flashTimer = null;
    this.__osdTimer = null;
    this.__onProgramUpdate = () => this.requestUpdate();
  }

  connectedCallback() {
    super.connectedCallback();
    retroTvLoadFace("VT323");
    this.addEventListener("retro-tv-program-updated", this.__onProgramUpdate);
    if (this.rememberPower) {
      try {
        const saved = globalThis.localStorage.getItem(this.rememberPower);
        if (saved === "off") {
          this.power = false;
        }
      } catch {
        // storage can be missing or blocked; power keeps its attribute
      }
    }
  }

  disconnectedCallback() {
    this.removeEventListener(
      "retro-tv-program-updated",
      this.__onProgramUpdate,
    );
    clearTimeout(this.__flashTimer);
    clearTimeout(this.__osdTimer);
    super.disconnectedCallback();
  }

  /**
   * Programs in channel order.
   * @returns {Array<HTMLElement>}
   */
  get programs() {
    return Array.from(this.children)
      .filter((el) => el.hasAttribute("channel"))
      .sort(
        (a, b) =>
          parseInt(a.getAttribute("channel"), 10) -
          parseInt(b.getAttribute("channel"), 10),
      );
  }

  /**
   * The program on air, if a program has this channel.
   * @returns {HTMLElement|null}
   */
  get program() {
    const ch = Number(this.channel);
    return (
      this.programs.find(
        (el) => parseInt(el.getAttribute("channel"), 10) === ch,
      ) || null
    );
  }

  /**
   * Change to a channel. A short burst of static plays unless motion is off.
   * @param {Number} channel
   */
  tune(channel) {
    this.channel = Number(channel);
  }

  /** Next program, wrapping around. */
  next() {
    this._step(1);
  }

  /** Previous program, wrapping around. */
  previous() {
    this._step(-1);
  }

  _step(dir) {
    const list = this.programs.map((el) =>
      parseInt(el.getAttribute("channel"), 10),
    );
    if (!list.length) {
      return;
    }
    const i = list.indexOf(Number(this.channel));
    const n = i === -1 ? 0 : (i + dir + list.length) % list.length;
    this.tune(list[n]);
  }

  /** Turn the set on or off. */
  togglePower() {
    this.power = !this.power;
  }

  /** Power the picture on again from a dot, and restart the program. */
  replay() {
    this.still = false;
    this._run = this._run + 1;
    const p = this.program;
    if (p && typeof p.restart === "function") {
      p.restart();
    }
  }

  /** Jump to final frames with no motion. */
  skip() {
    this.still = true;
  }

  _reducedMotion() {
    return !!(
      globalThis.matchMedia &&
      globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  willUpdate(changedProperties) {
    if (super.willUpdate) {
      super.willUpdate(changedProperties);
    }
    if (
      changedProperties.has("channel") ||
      changedProperties.has("power") ||
      changedProperties.has("still")
    ) {
      this._syncPrograms();
    }
    const tuned =
      changedProperties.has("channel") &&
      changedProperties.get("channel") !== undefined;
    const powered =
      changedProperties.has("power") &&
      changedProperties.get("power") !== undefined;
    if (tuned) {
      this._showOsd();
      if (!this.still && !this._reducedMotion()) {
        this._flash = true;
        clearTimeout(this.__flashTimer);
        this.__flashTimer = setTimeout(() => {
          this._flash = false;
        }, 280);
      }
    }
    if (powered && this.power) {
      this._run = this._run + 1;
      this._showOsd();
    }
    if (changedProperties.has("osdFade") && this.osdFade) {
      this._showOsd();
    }
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (
      changedProperties.has("channel") &&
      changedProperties.get("channel") !== undefined
    ) {
      this.dispatchEvent(
        new CustomEvent("retro-tv-channel-changed", {
          bubbles: true,
          composed: true,
          detail: { channel: this.channel, program: this.program },
        }),
      );
    }
    if (
      changedProperties.has("power") &&
      changedProperties.get("power") !== undefined
    ) {
      if (this.rememberPower) {
        try {
          globalThis.localStorage.setItem(
            this.rememberPower,
            this.power ? "on" : "off",
          );
        } catch {
          // storage can be missing or blocked
        }
      }
      this.dispatchEvent(
        new CustomEvent("retro-tv-power-changed", {
          bubbles: true,
          composed: true,
          detail: { power: this.power },
        }),
      );
    }
  }

  _showOsd() {
    this._osdHidden = false;
    clearTimeout(this.__osdTimer);
    if (this.osdFade) {
      this.__osdTimer = setTimeout(() => {
        this._osdHidden = true;
      }, 2500);
    }
  }

  /**
   * Put the program on air in the screen slot and tell every program
   * whether it is on and whether to move.
   */
  _syncPrograms() {
    const on = this.power ? this.program : null;
    this.programs.forEach((el) => {
      const isOn = el === on;
      if (isOn) {
        el.setAttribute("slot", "on-air");
        el.setAttribute("on-air", "");
      } else {
        el.removeAttribute("slot");
        el.removeAttribute("on-air");
      }
      if (this.still) {
        el.setAttribute("still", "");
      } else {
        el.removeAttribute("still");
      }
    });
  }

  _onSlotChange() {
    this._syncPrograms();
    this.requestUpdate();
  }

  _screenLabel() {
    if (!this.power) {
      return this.offLabel;
    }
    const p = this.program;
    if (!p) {
      return this._osdText();
    }
    return p.screenLabel || p.getAttribute("label") || this._osdText();
  }

  _osdText() {
    if (this.channelLabel) {
      return this.channelLabel;
    }
    return `${this.channelPrefix} ${String(this.channel).padStart(2, "0")}`;
  }

  /** the channel dial: a ring of numbers and a knob that points at one */
  _renderDial(ch) {
    const style = `--retro-tv-knob-rotate: ${((((ch - 2) % 12) + 12) % 12) * 30}deg`;
    return html`<span class="dial">
      <span class="ring" aria-hidden="true"
        >${DIAL.map(
          (n, i) =>
            html`<span
              class="${n === ch ? "cur" : ""}"
              style="--a: ${i * 30}deg"
              >${n}</span
            >`,
        )}</span
      >${
        this.controls
          ? html`<button
              class="knob"
              type="button"
              style="${style}"
              aria-label="${this.nextChannelLabel}"
              title="${this.nextChannelLabel}"
              @click="${this.next}"
            ></button>`
          : html`<span class="knob" style="${style}" aria-hidden="true"></span>`
      }
    </span>`;
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          /* printed artwork: the same in light and dark */
          color-scheme: only dark;
          --retro-tv-knob-rotate: 40deg;
        }
        :host([hidden]) {
          display: none;
        }
        .tv {
          display: flex;
          gap: var(--retro-tv-gap, 18px);
          padding: var(--retro-tv-padding, 22px);
          box-sizing: border-box;
          border-radius: var(--retro-tv-radius, 22px);
          background:
            repeating-linear-gradient(
              90deg,
              rgba(0, 0, 0, 0.12) 0 2px,
              transparent 2px 9px,
              rgba(255, 255, 255, 0.04) 9px 10px,
              transparent 10px 17px
            ),
            linear-gradient(180deg, #6b4529, #3b2718);
          box-shadow: var(
            --retro-tv-shadow,
            0 24px 60px rgba(0, 0, 0, 0.6),
            inset 0 2px 0 rgba(255, 255, 255, 0.12)
          );
        }
        .bezel {
          flex: 1;
          min-width: 0;
          background: #1a1a1a;
          border-radius: var(--retro-tv-bezel-radius, 18px);
          padding: var(--retro-tv-bezel-padding, 18px);
          box-shadow:
            inset 0 0 0 3px #2b2b2b,
            inset 0 6px 18px rgba(0, 0, 0, 0.8);
        }
        .side {
          width: var(--retro-tv-side-width, 100px);
          flex: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--retro-tv-gap, 18px);
          padding-top: var(--retro-tv-side-padding, 12px);
        }
        /* channel dial: numbers 2 to 13 on the ring, the knob's line
           points at the channel on air */
        .dial {
          position: relative;
          flex: none;
          width: var(--retro-tv-dial-size, 86px);
          height: var(--retro-tv-dial-size, 86px);
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: radial-gradient(circle, #1d1d21 0 62%, #0c0c0e 63% 100%);
          box-shadow:
            inset 0 0 0 1px #45454c,
            0 1px 0 rgba(255, 255, 255, 0.14);
        }
        .ring {
          position: absolute;
          inset: 0;
        }
        .ring span {
          position: absolute;
          left: 50%;
          top: 50%;
          font:
            700 var(--retro-tv-dial-number-size, 9px) / 1 "Roboto Condensed",
            sans-serif;
          color: #c9ccd2;
          transform: translate(-50%, -50%) rotate(var(--a))
            translateY(calc(var(--retro-tv-dial-size, 86px) * -0.4))
            rotate(calc(-1 * var(--a)));
        }
        .ring span.cur {
          color: #ffd100;
        }
        .knob {
          all: unset;
          box-sizing: border-box;
          position: relative;
          width: var(--retro-tv-knob-size, 46px);
          height: var(--retro-tv-knob-size, 46px);
          border-radius: 50%;
          background: radial-gradient(
            circle at 35% 30%,
            #c9ccd2,
            #6b6f77 55%,
            #2f3236 80%
          );
          box-shadow:
            0 3px 0 #111,
            inset 0 0 0 3px rgba(0, 0, 0, 0.25);
        }
        .knob::before {
          content: "";
          position: absolute;
          inset: 15%;
          border-radius: 50%;
          background: repeating-conic-gradient(
            rgba(0, 0, 0, 0.18) 0 6deg,
            transparent 6deg 12deg
          );
        }
        .knob::after {
          content: "";
          position: absolute;
          left: 50%;
          top: -10%;
          width: var(--retro-tv-knob-mark-width, 4px);
          height: 45%;
          margin-left: calc(var(--retro-tv-knob-mark-width, 4px) / -2);
          background: #ffd100;
          box-shadow: 0 0 0 1px #111;
          border-radius: 2px;
          transform-origin: 50% 133%;
          transform: rotate(var(--retro-tv-knob-rotate));
        }
        button.knob,
        .pwr {
          cursor: pointer;
        }
        button.knob:focus-visible,
        .pwr:focus-visible {
          outline: 3px solid #ffd100;
          outline-offset: 3px;
        }
        .slbl {
          margin-top: calc(var(--retro-tv-gap, 18px) / -2);
          font:
            700 var(--retro-tv-side-label-size, 10px) / 1 "Roboto Condensed",
            sans-serif;
          letter-spacing: 0.12em;
          color: #f3e7d3;
        }
        /* power: a push button that glows green while the set is on */
        .pwr {
          all: unset;
          box-sizing: border-box;
          width: var(--retro-tv-power-size, 42px);
          height: var(--retro-tv-power-size, 42px);
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: radial-gradient(circle at 35% 30%, #4a4a50, #18181b 75%);
          box-shadow:
            0 0 0 2px #9aa0aa,
            0 3px 0 #0a0a0a;
        }
        .pwr svg {
          width: 55%;
          height: 55%;
          fill: #59625b;
        }
        :host([power]) .pwr {
          box-shadow:
            0 0 0 2px #5dff8a,
            0 3px 0 #0a0a0a,
            0 0 12px rgba(93, 255, 138, 0.6);
        }
        :host([power]) .pwr svg {
          fill: #5dff8a;
          filter: drop-shadow(0 0 3px rgba(93, 255, 138, 0.9));
        }
        .grille {
          width: var(--retro-tv-grille-width, 76px);
          flex: 1;
          min-height: var(--retro-tv-grille-min-height, 110px);
          border-radius: 8px;
          background:
            radial-gradient(circle, #140d08 2.5px, transparent 3px) 0 0 / 9px
              9px,
            #2a1b10;
        }
        @media (max-width: 700px) {
          .side {
            display: none;
          }
          .tv {
            padding: var(--retro-tv-narrow-padding, 12px);
          }
          .bezel {
            padding: var(--retro-tv-narrow-bezel-padding, 10px);
          }
        }
        .screen {
          position: relative;
          aspect-ratio: 4 / 3;
          border-radius: var(--retro-tv-screen-radius, 28px / 36px);
          overflow: hidden;
          background: #000;
        }
        ::slotted(*) {
          position: absolute;
          inset: 0;
        }
        .osd {
          position: absolute;
          font-family: "VT323", monospace;
          font-size: var(--retro-tv-osd-size, clamp(18px, 2.4vw, 28px));
          color: #5dff8a;
          text-shadow: 0 0 6px rgba(93, 255, 138, 0.8);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .ch {
          top: 6%;
          right: 7%;
        }
        .osd.faded,
        :host(:not([power])) .osd {
          opacity: 0;
        }
        .noise {
          position: absolute;
          inset: 0;
          opacity: 0;
          pointer-events: none;
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
        .noise.flash,
        .screen.empty .noise {
          opacity: 1;
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
        .off {
          position: absolute;
          inset: 0;
          background: #000;
          display: none;
        }
        :host(:not([power])) .off {
          display: block;
        }
        /* motion only for people who have not asked for less of it, and
           never once the picture is still */
        @media (prefers-reduced-motion: no-preference) {
          .osd {
            transition: opacity 0.6s ease-in-out;
          }
          :host(:not([still])) .run-a .screen {
            animation: retro-tv-pow-a 0.9s ease-out both;
          }
          :host(:not([still])) .run-b .screen {
            animation: retro-tv-pow-b 0.9s ease-out both;
          }
          :host(:not([still])) .run-a .noise {
            animation: retro-tv-noise-a 1.5s steps(8) 0.6s both;
          }
          :host(:not([still])) .run-b .noise {
            animation: retro-tv-noise-b 1.5s steps(8) 0.6s both;
          }
          .knob::after {
            transition: transform 0.3s ease-in-out;
          }
          .pwr:active {
            transform: translateY(1px);
          }
        }
        @keyframes retro-tv-pow-a {
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
        @keyframes retro-tv-pow-b {
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
        @keyframes retro-tv-noise-a {
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
        @keyframes retro-tv-noise-b {
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
        @media (forced-colors: active) {
          button.knob,
          .pwr {
            forced-color-adjust: none;
            border: 2px solid ButtonText;
          }
        }
      `,
    ];
  }

  render() {
    const empty = this.power && !this.program;
    const ch = parseInt(this.channel, 10) || 0;
    return html`
      <div class="tv run-${this._run % 2 === 0 ? "a" : "b"}" part="tv">
        <div class="bezel" part="bezel">
          <div
            class="screen ${empty ? "empty" : ""}"
            part="screen"
            role="img"
            aria-label="${this._screenLabel()}"
          >
            <slot name="on-air"></slot>
            <slot name="overlay"></slot>
            <div class="noise ${this._flash ? "flash" : ""}"></div>
            <span class="osd ch ${this._osdHidden ? "faded" : ""}" part="osd"
              >${this._osdText()}</span
            >
            <div class="scan"></div>
            <div class="glass"></div>
            <div class="off"></div>
          </div>
        </div>
        <div
          class="side"
          part="side"
          aria-hidden="${this.controls ? nothing : "true"}"
        >
          ${this._renderDial(ch)}
          <span class="slbl" aria-hidden="true">CHANNEL</span>
          ${
            this.controls
              ? html`<button
                  class="pwr"
                  type="button"
                  aria-label="${
                    this.power ? this.powerOffLabel : this.powerOnLabel
                  }"
                  title="${this.power ? this.powerOffLabel : this.powerOnLabel}"
                  @click="${this.togglePower}"
                >
                  ${POWER_ICON}
                </button>`
              : html`<span class="pwr" aria-hidden="true">${POWER_ICON}</span>`
          }
          <span class="slbl" aria-hidden="true">POWER</span>
          <span class="grille" aria-hidden="true"></span>
        </div>
        <slot hidden @slotchange="${this._onSlotChange}"></slot>
      </div>
    `;
  }
}

globalThis.customElements.define(RetroTv.tag, RetroTv);

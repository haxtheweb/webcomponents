/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { RetroKitStyles, retroKitKey } from "./retro-kit.js";
import { retroTvLoadFace } from "./retro-tv-program.js";

const DPAD = {
  u: "M7 14l5-5 5 5z",
  l: "M14 7l-5 5 5 5z",
  r: "M10 17l5-5-5-5z",
  d: "M7 10l5 5 5-5z",
};

/**
 * `retro-controller`
 * An old-school game pad: D-pad, Select, Start, B and A on a dark faceplate,
 * the body in a HAX TV kit colorway and a small "HAX" at the top right.
 * Every button is a real button named for what it does; pressing one (or
 * calling `press()`) lights it for a moment and fires
 * `retro-controller-press` with detail.button of u, d, l, r, select,
 * start, b or a. Arrow keys and A / B pressed while the pad has focus
 * press its buttons; a host can call `press()` for keys it hears elsewhere
 * so people see what their keyboard did.
 *
 * @element retro-controller
 * @fires retro-controller-press - detail { button }
 */
export class RetroController extends LitElement {
  static get tag() {
    return "retro-controller";
  }

  static get properties() {
    return {
      /** helmet (red), goggle (cyan) or bulb (yellow) */
      colorway: { type: String, reflect: true },
      /** small badge at the top right */
      brand: { type: String },
      /** accessible name of the pad */
      label: { type: String },
      /** accessible names of the buttons: what each one does */
      upLabel: { type: String, attribute: "up-label" },
      downLabel: { type: String, attribute: "down-label" },
      leftLabel: { type: String, attribute: "left-label" },
      rightLabel: { type: String, attribute: "right-label" },
      selectLabel: { type: String, attribute: "select-label" },
      startLabel: { type: String, attribute: "start-label" },
      bLabel: { type: String, attribute: "b-label" },
      aLabel: { type: String, attribute: "a-label" },
      /**
       * Drawn smaller than its buttons can be pressed (a toy in a scene):
       * the whole pad is then one "pick up" button, and picking it up
       * shows it large enough to press (WCAG 2.5.8 target size)
       */
      miniature: { type: Boolean, reflect: true },
      /** accessible name of the pick up button */
      pickupLabel: { type: String, attribute: "pickup-label" },
      /** the pad is picked up (miniature only) */
      held: { type: Boolean, reflect: true },
      _lit: { type: String, state: true },
    };
  }

  constructor() {
    super();
    this.colorway = "helmet";
    this.brand = "HAX";
    this.label = "Game controller";
    this.upLabel = "Up";
    this.downLabel = "Down";
    this.leftLabel = "Left";
    this.rightLabel = "Right";
    this.selectLabel = "Select";
    this.startLabel = "Start";
    this.bLabel = "B";
    this.aLabel = "A";
    this.miniature = false;
    this.held = false;
    this.pickupLabel = "Pick up the controller";
    this._lit = "";
    this.__boundPutDown = this.__putDownOutside.bind(this);
    this.__litTimer = null;
    this.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.held) {
        e.preventDefault();
        this.putDown(true);
        return;
      }
      const k = retroKitKey(e);
      if (k) {
        e.preventDefault();
        this.press(k);
      }
    });
  }

  connectedCallback() {
    super.connectedCallback();
    retroTvLoadFace("Press Start 2P");
  }

  disconnectedCallback() {
    clearTimeout(this.__litTimer);
    globalThis.removeEventListener("pointerdown", this.__boundPutDown, true);
    super.disconnectedCallback();
  }

  /**
   * Press a button: light it and tell the host.
   * @param {String} button u, d, l, r, select, start, b or a
   */
  press(button) {
    this.light(button);
    this.dispatchEvent(
      new CustomEvent("retro-controller-press", {
        bubbles: true,
        composed: true,
        detail: { button },
      }),
    );
  }

  /**
   * Pick a miniature pad up: it is shown large enough to press, and focus
   * moves onto its first button.
   */
  pickUp() {
    if (!this.miniature || this.held) {
      return;
    }
    this.held = true;
    globalThis.addEventListener("pointerdown", this.__boundPutDown, true);
    this.updateComplete.then(() => {
      const first = this.shadowRoot.querySelector(".dpad button");
      if (first) {
        first.focus();
      }
    });
  }
  /**
   * Put a held pad back down.
   * @param {Boolean} refocus return focus to the pick up button
   */
  putDown(refocus = false) {
    if (!this.held) {
      return;
    }
    this.held = false;
    globalThis.removeEventListener("pointerdown", this.__boundPutDown, true);
    if (refocus) {
      this.updateComplete.then(() => {
        const pickup = this.shadowRoot.querySelector(".pickup");
        if (pickup) {
          pickup.focus();
        }
      });
    }
  }
  /** a press outside the held pad puts it down */
  __putDownOutside(e) {
    if (!e.composedPath().includes(this)) {
      this.putDown(false);
    }
  }
  /** focus leaving the held pad puts it down */
  __focusOut(e) {
    if (
      this.held &&
      !this.contains(e.relatedTarget) &&
      !this.shadowRoot.contains(e.relatedTarget)
    ) {
      this.putDown(false);
    }
  }

  /**
   * Light a button for a moment without pressing it.
   * @param {String} button
   */
  light(button) {
    this._lit = button;
    clearTimeout(this.__litTimer);
    this.__litTimer = setTimeout(() => {
      this._lit = "";
    }, 240);
  }

  static get styles() {
    return [
      RetroKitStyles,
      css`
        :host {
          display: block;
          min-width: 290px;
          max-width: 330px;
        }
        :host([hidden]) {
          display: none;
        }
        :host([miniature]) {
          position: relative;
        }
        /* a miniature pad is one button until it is picked up */
        .pickup {
          position: absolute;
          inset: 0;
          z-index: 1;
          border-radius: 10px;
        }
        .pickup:focus-visible {
          outline: 3px solid var(--retro-kit-focus, #ffd60a);
          outline-offset: 2px;
        }
        /* picked up: drawn at a size its buttons can be pressed, over the
           scene, without moving anything around it */
        :host([held]) .ctl {
          position: relative;
          z-index: 2;
          transform: scale(var(--retro-controller-held-scale, 2));
          transform-origin: 50% 100%;
        }
        @media (prefers-reduced-motion: no-preference) {
          .ctl {
            transition: transform 0.15s ease-out;
          }
        }
        .ctl {
          box-sizing: border-box;
          width: 100%;
          padding: 7px;
          border-radius: 10px;
          background: var(--retro-kit-body);
          box-shadow:
            inset 0 2px 0 rgba(255, 255, 255, 0.28),
            inset 0 -4px 0 rgba(0, 0, 0, 0.25),
            0 8px 14px rgba(0, 0, 0, 0.35);
        }
        .plate {
          display: grid;
          grid-template-columns: 72px minmax(0, 1fr) auto;
          grid-template-rows: auto auto;
          column-gap: 8px;
          align-items: center;
          padding: 6px 10px 8px;
          border-radius: 6px;
          background: var(--retro-kit-plate);
        }
        .brand {
          grid-column: 2 / 4;
          grid-row: 1;
          justify-self: end;
          margin-bottom: 4px;
          font:
            10px "Press Start 2P",
            monospace;
          letter-spacing: 0.1em;
          color: var(--retro-kit-ink);
        }
        .dpad {
          grid-column: 1;
          grid-row: 1 / 3;
          display: grid;
          grid-template-columns: repeat(3, 24px);
          grid-template-rows: repeat(3, 24px);
        }
        button {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
        }
        .dpad button,
        .dpad .c {
          display: grid;
          place-items: center;
          background: #8a8f99;
          color: #111111;
        }
        .dpad svg {
          width: 14px;
          height: 14px;
          fill: currentColor;
        }
        .dpad .u {
          grid-area: 1 / 2;
          border-radius: 4px 4px 0 0;
        }
        .dpad .l {
          grid-area: 2 / 1;
          border-radius: 4px 0 0 4px;
        }
        .dpad .r {
          grid-area: 2 / 3;
          border-radius: 0 4px 4px 0;
        }
        .dpad .d {
          grid-area: 3 / 2;
          border-radius: 0 0 4px 4px;
        }
        .dpad .c {
          grid-area: 2 / 2;
        }
        .mid {
          grid-column: 2;
          grid-row: 2;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 34px));
          justify-content: center;
          column-gap: 4px;
          row-gap: 2px;
          padding: 4px 2px;
          border-radius: 4px;
          background: #34343c;
        }
        .ml,
        .al {
          font:
            700 7px "Roboto Condensed",
            sans-serif;
          letter-spacing: 0.08em;
          text-align: center;
          color: var(--retro-kit-plate-ink);
        }
        .al {
          font-size: 9px;
          color: var(--retro-kit-ink);
        }
        .mid button {
          height: 24px;
          display: grid;
          place-items: center;
        }
        .mid button::before {
          content: "";
          width: 24px;
          height: 8px;
          border-radius: 4px;
          background: #a2aaad;
          box-shadow: 0 2px 0 #15151a;
        }
        .ab {
          grid-column: 3;
          grid-row: 2;
          display: grid;
          grid-template-columns: repeat(2, 34px);
          column-gap: 6px;
          row-gap: 2px;
          justify-items: center;
        }
        .well {
          display: grid;
          place-items: center;
          width: 34px;
          height: 34px;
          border-radius: 6px;
          background: #34343c;
        }
        .well button {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: var(--retro-kit-accent);
          box-shadow: 0 3px 0 rgba(0, 0, 0, 0.55);
        }
        button:focus-visible {
          outline: 2px solid #ffffff;
          outline-offset: 2px;
        }
        /* lit: the button just pressed, by pointer, keyboard or the host */
        .dpad button.lit,
        .dpad button:active {
          background: #ffffff;
          box-shadow: 0 0 0 2px var(--retro-kit-ink);
          position: relative;
          z-index: 1;
        }
        .mid button.lit::before {
          background: #ffffff;
          box-shadow: 0 0 0 2px var(--retro-kit-ink);
        }
        .well button.lit {
          filter: brightness(1.3);
          box-shadow:
            0 1px 0 rgba(0, 0, 0, 0.55),
            0 0 0 3px #ffffff;
        }
        @media (prefers-reduced-motion: no-preference) {
          button:active,
          .well button.lit {
            transform: translateY(1px);
          }
        }
        @media (forced-colors: active) {
          button {
            border: 1px solid ButtonText;
          }
          button.lit {
            background: Highlight;
          }
        }
      `,
    ];
  }

  render() {
    const lit = (b) => (this._lit === b ? "lit" : "");
    const dp = (b, name) =>
      html`<button
        type="button"
        class="${b} ${lit(b)}"
        aria-label="${name}"
        @click="${() => this.press(b)}"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="${DPAD[b]}"></path>
        </svg>
      </button>`;
    const btn = (b, name) =>
      html`<button
        type="button"
        class="${lit(b)}"
        aria-label="${name}"
        @click="${() => this.press(b)}"
      ></button>`;
    return html`
      ${
        this.miniature && !this.held
          ? html`<button
              type="button"
              class="pickup"
              aria-label="${this.pickupLabel}"
              aria-expanded="false"
              @click="${this.pickUp}"
            ></button>`
          : ``
      }
      <div
        class="ctl"
        role="group"
        aria-label="${this.label}"
        part="body"
        ?inert="${this.miniature && !this.held}"
        @focusout="${this.__focusOut}"
      >
        <div class="plate">
          <span class="brand" aria-hidden="true">${this.brand}</span>
          <div class="dpad">
            ${dp("u", this.upLabel)} ${dp("l", this.leftLabel)}
            <span class="c" aria-hidden="true"></span>
            ${dp("r", this.rightLabel)} ${dp("d", this.downLabel)}
          </div>
          <div class="mid">
            <span class="ml" aria-hidden="true">SELECT</span>
            <span class="ml" aria-hidden="true">START</span>
            ${btn("select", this.selectLabel)} ${btn("start", this.startLabel)}
          </div>
          <div class="ab">
            <span class="well">${btn("b", this.bLabel)}</span>
            <span class="well">${btn("a", this.aLabel)}</span>
            <span class="al" aria-hidden="true">B</span>
            <span class="al" aria-hidden="true">A</span>
          </div>
        </div>
      </div>
    `;
  }
}

globalThis.customElements.define(RetroController.tag, RetroController);

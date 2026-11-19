/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";

/** where the era you landed on is kept, so every HAX screen shows him in it */
export const HAX_TRAVELER_ERA_KEY = "hax-future-traveler-era";
/** fired on globalThis when one mark changes era, so the others follow */
const ERA_EVENT = "hax-future-traveler-era-changed";

function readEra() {
  try {
    return globalThis.localStorage.getItem(HAX_TRAVELER_ERA_KEY) || "now";
  } catch {
    return "now";
  }
}

function writeEra(era) {
  try {
    if (era === "now") {
      globalThis.localStorage.removeItem(HAX_TRAVELER_ERA_KEY);
    } else {
      globalThis.localStorage.setItem(HAX_TRAVELER_ERA_KEY, era);
    }
  } catch {
    // storage can be off (private windows, sandboxed frames): he just
    // forgets, which is fine for an easter egg
  }
}

function reducedMotion() {
  return !!(
    globalThis.matchMedia &&
    globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * `hax-future-traveler-mark`
 * The HAX mark in the top bar: the Future Traveler. He is decorative (hidden
 * from assistive tech, never a tab stop), but click him and he glitches
 * into the next era he has been to, the same eras the network bar's
 * traveler remixes through, and stays there on every HAX screen until he
 * is clicked again. With reduced motion he swaps without the glitch.
 * The eras (hax-network-bar/lib/hax-future-traveler.js) load only once he
 * is clicked, or when a remembered era needs drawing.
 *
 * @element hax-future-traveler-mark
 */
export class HaxFutureTravelerMark extends LitElement {
  static get tag() {
    return "hax-future-traveler-mark";
  }

  static get properties() {
    return {
      /** the era he is drawn in: an id from HAX_TRAVELER_ERAS, now is today */
      era: { type: String, reflect: true },
      _tearing: { type: Boolean, state: true },
      _eras: { type: Object, state: true },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: inline-grid;
          place-items: center;
          --future-traveler-size: var(
            --simple-icon-width,
            var(--ddd-icon-xs, 32px)
          );
        }
        .ft-host {
          display: inline-grid;
          place-items: center;
        }
      `,
    ];
  }

  constructor() {
    super();
    this.era = readEra();
    this._tearing = false;
    this._eras = null;
    this._follow = (e) => {
      if (e.detail && e.detail.source === this) {
        return;
      }
      const era = e.detail ? e.detail.era : readEra();
      if (era !== this.era) {
        this._tearTo(era || "now");
      }
    };
    this._followStorage = (e) => {
      if (e.key === HAX_TRAVELER_ERA_KEY) {
        this._tearTo(e.newValue || "now");
      }
    };
    this.addEventListener("click", this.remix);
  }

  connectedCallback() {
    super.connectedCallback();
    // decorative: whatever wraps him should say so too, but he says it
    // himself so a new placement can't forget
    this.setAttribute("aria-hidden", "true");
    globalThis.addEventListener(ERA_EVENT, this._follow);
    globalThis.addEventListener("storage", this._followStorage);
  }

  disconnectedCallback() {
    globalThis.removeEventListener(ERA_EVENT, this._follow);
    globalThis.removeEventListener("storage", this._followStorage);
    clearTimeout(this._swapTimer);
    clearTimeout(this._tearTimer);
    super.disconnectedCallback();
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has("era") && this.era !== "now" && !this._eras) {
      this._loadEras();
    }
  }

  async _loadEras() {
    if (!this._eras) {
      const eras =
        await import("@haxtheweb/hax-network-bar/lib/hax-future-traveler.js");
      if (this.shadowRoot && eras.HaxFutureTravelerStyles.styleSheet) {
        this.shadowRoot.adoptedStyleSheets = [
          ...this.shadowRoot.adoptedStyleSheets,
          eras.HaxFutureTravelerStyles.styleSheet,
        ];
      }
      this._eras = eras;
    }
    return this._eras;
  }

  /** tear from the era showing to another: the swap happens mid-glitch */
  _tearTo(era) {
    clearTimeout(this._swapTimer);
    clearTimeout(this._tearTimer);
    if (reducedMotion()) {
      this._tearing = false;
      this.era = era;
      return;
    }
    this._tearing = true;
    this._swapTimer = setTimeout(() => {
      this.era = era;
    }, 150);
    this._tearTimer = setTimeout(() => {
      this._tearing = false;
    }, 330);
  }

  /** click: the next era, remembered */
  async remix() {
    const eras = await this._loadEras();
    const ids = eras.HAX_TRAVELER_ERAS.map((e) => e.id);
    const era = ids[(ids.indexOf(this.era) + 1) % ids.length];
    writeEra(era);
    this._tearTo(era);
    globalThis.dispatchEvent(
      new CustomEvent(ERA_EVENT, { detail: { era: era, source: this } }),
    );
  }

  render() {
    return html`<span class="ft-host ${this._tearing ? "ft-glitch" : ""}"
      >${
        this._eras && this.era !== "now"
          ? this._eras.futureTraveler(this.era)
          : html`<simple-icon-lite
              icon="hax:future-traveler"
              no-colorize
            ></simple-icon-lite>`
      }</span
    >`;
  }
}

globalThis.customElements.define(
  HaxFutureTravelerMark.tag,
  HaxFutureTravelerMark,
);

/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, css } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * Whether the viewer asked for less motion.
 * @returns {Boolean}
 */
export function retroTvReducedMotion() {
  return !!(
    globalThis.matchMedia &&
    globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Load a Google Fonts face once per page, the same way DDD loads its faces.
 * @param {String} family font family name, for example "VT323"
 */
export function retroTvLoadFace(family) {
  const doc = globalThis.document;
  if (!doc || !doc.head || !family) {
    return;
  }
  const href = `https://fonts.googleapis.com/css2?family=${family.replace(
    / /g,
    "+",
  )}&display=swap`;
  const id =
    "retro-tv-font-" + family.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  if (doc.getElementById(id) || doc.querySelector(`link[href="${href}"]`)) {
    return;
  }
  const link = doc.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = href;
  doc.head.appendChild(link);
}

/**
 * Base for a `retro-tv` program. `retro-tv` sets `on-air` on the program it
 * shows and `still` when the picture must not move; a program restarts its
 * sequence each time it goes on air.
 *
 * - `channel` the program's channel number (required for retro-tv to find it)
 * - `label` what assistive tech hears for the screen (screenLabel)
 * - `name` the program's name for a "now playing" line (programName)
 * - `loading` the host is waiting on work; programs that show progress use it
 */
export class RetroTvProgram extends LitElement {
  static get properties() {
    return {
      channel: { type: Number, reflect: true },
      label: { type: String },
      name: { type: String },
      onAir: { type: Boolean, attribute: "on-air", reflect: true },
      still: { type: Boolean, reflect: true },
      loading: { type: Boolean, reflect: true },
      _run: { type: Number, state: true },
    };
  }

  constructor() {
    super();
    this.channel = 0;
    this.label = "";
    this.name = "";
    this.onAir = false;
    this.still = false;
    this.loading = false;
    this._run = 0;
  }

  /** font families this program draws with; loaded when it connects */
  static get faces() {
    return ["VT323"];
  }

  connectedCallback() {
    super.connectedCallback();
    this.constructor.faces.forEach((f) => retroTvLoadFace(f));
  }

  /** what the screen is called while this program is on */
  get screenLabel() {
    return this.label || this.defaultLabel();
  }

  /** the program's name for a "now playing" line */
  get programName() {
    return this.name || this.defaultName();
  }

  defaultLabel() {
    return "";
  }

  defaultName() {
    return "";
  }

  /** whether the program should move right now */
  get moving() {
    return this.onAir && !this.still && !retroTvReducedMotion();
  }

  /** start the sequence again from the top */
  restart() {
    this._run = this._run + 1;
  }

  willUpdate(changedProperties) {
    if (super.willUpdate) {
      super.willUpdate(changedProperties);
    }
    if (changedProperties.has("onAir") && this.onAir) {
      this.restart();
    }
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (
      changedProperties.has("label") ||
      changedProperties.has("name") ||
      changedProperties.has("t")
    ) {
      this.dispatchEvent(
        new CustomEvent("retro-tv-program-updated", { bubbles: true }),
      );
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          position: absolute;
          inset: 0;
          overflow: hidden;
          color-scheme: only dark;
        }
        :host([hidden]) {
          display: none;
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
        .pl {
          bottom: 6%;
          left: 7%;
        }
      `,
    ];
  }
}

/**
 * The words the built-in programs show. English source; translations come
 * from locales/retro-tv.<lang>.json.
 */
export const RETRO_TV_STRINGS = {
  haxTvName: "HAX TV: Future Travelers on the loose",
  haxTvLabel: "Future Travelers bouncing around the screen",
  haxTvLogo: "HAX TV",
  creditsName: "Credits",
  creditsLabel: "End credits starring the Future Traveler",
  creditsTape: "Tape",
  creditsStarring: "Starring",
  creditsFutureTraveler: "Future Traveler",
  creditsWrittenBy: "Written by",
  creditsYou: "You",
  creditsBuiltToLast: "Built to last,",
  creditsLightOnThePlanet: "light on the planet",
  creditsThanksFor: "Thanks for",
  creditsHaxingTheWeb: "HAX'ing the web",
  homeComputerName: "Home computer, 1982",
  homeComputerLabel: "A blue home computer screen loading",
  homeComputerBanner: "**** HAX BASIC V2 ****",
  homeComputerTagline: "READY FOR THE FUTURE",
  homeComputerReady: "READY.",
  homeComputerSearching: "SEARCHING FOR",
  homeComputerLoading: "LOADING",
  handheldName: "Handheld, 1989",
  handheldLabel: "A green handheld screen with HAX dropping in",
  handheldSub: "FUTURE TRAVELER",
  pcName: "PC, 1991",
  pcLabel: "A DOS prompt with a progress bar",
  pcMessage: "Working...",
  discName: "Disc console, 1995",
  discLabel: "A spinning Future Traveler disc with a glowing HAX logo",
  discLicensed: "Licensed by the open web",
};

/**
 * A program with words of its own, translated with the retro-tv locales.
 */
export class RetroTvLocalizedProgram extends I18NMixin(RetroTvProgram) {
  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      ...RETRO_TV_STRINGS,
    };
    this.registerLocalization({
      context: this,
      namespace: "retro-tv",
      localesPath: new URL("../locales/", import.meta.url).href,
    });
  }
}

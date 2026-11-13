/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { keyed } from "lit/directives/keyed.js";
import "@haxtheweb/retro-tv/retro-tv.js";
import "@haxtheweb/retro-tv/lib/programs/retro-tv-title-sequence.js";
import "@haxtheweb/retro-tv/lib/programs/retro-tv-static.js";
import "@haxtheweb/retro-tv/lib/programs/retro-tv-blocks.js";
import "@haxtheweb/retro-tv/lib/programs/retro-tv-sign-on.js";
import "@haxtheweb/retro-tv/lib/programs/retro-tv-credits.js";
import "@haxtheweb/retro-tv/lib/programs/retro-tv-hax-tv.js";
import "@haxtheweb/retro-tv/lib/programs/retro-tv-home-computer.js";
import "@haxtheweb/retro-tv/lib/programs/retro-tv-handheld.js";
import "@haxtheweb/retro-tv/lib/programs/retro-tv-pc.js";
import "@haxtheweb/retro-tv/lib/programs/retro-tv-disc.js";

/** the channels a tunable set flips through, in order: all ten */
const CHANNELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/**
 * `vhs-blog-tv`
 * The VHS Blog's television, built on `retro-tv` like every TV in HAX:
 * channel 3 rolls the 80s title sequence for the active post, channel 4 is
 * static with a cast of rpg-characters tumbling through it, and channel 2
 * is HAX Blocks, the game on the HAX 64 cartridge. The rest of the ten are
 * the HAX TV lineup the installer plays: 1 the sign-on card, 5 credits,
 * 6 HAX TV, and the loading screens on 7 (home computer), 8 (handheld),
 * 9 (PC) and 10 (disc console). All motion is CSS and
 * only runs when the visitor has not asked for reduced motion; otherwise
 * (and after skip()) the final frame shows with no motion.
 *
 * "bare" renders only the screen (for the console cabinet) and "off" shows
 * dark glass. A "tunable" screen is a button that changes channel
 * (1 to 10, and around); with "read-label" set (a post below the set) it
 * fires vhs-blog-tv-read instead, and once the title has rolled a
 * "read-cue" with an arrow points down to the post. "held" stops the picture. "seek" (rew or ff) runs
 * tracking lines while the VCR moves between posts.
 *
 * @element vhs-blog-tv
 * @fires vhs-blog-tv-channel - detail { channel }
 * @fires vhs-blog-tv-read - the screen was pressed while `read-label` is set
 */
export class VhsBlogTv extends LitElement {
  static get tag() {
    return "vhs-blog-tv";
  }

  static get properties() {
    return {
      crawlTitle: { type: String, attribute: "crawl-title" },
      presenter: { type: String },
      kicker: { type: String },
      runtime: { type: String },
      runtimeLabel: { type: String, attribute: "runtime-label" },
      minLabel: { type: String, attribute: "min-label" },
      playLabel: { type: String, attribute: "play-label" },
      channelLabel: { type: String, attribute: "channel-label" },
      sequenceLabel: { type: String, attribute: "sequence-label" },
      presentsLabel: { type: String, attribute: "presents-label" },
      still: { type: Boolean, reflect: true },
      bare: { type: Boolean, reflect: true },
      off: { type: Boolean, reflect: true },
      offLabel: { type: String, attribute: "off-label" },
      tunable: { type: Boolean, reflect: true },
      channel: { type: Number, reflect: true },
      held: { type: Boolean, reflect: true },
      seek: { type: String, reflect: true },
      cast: { type: Array },
      changeLabel: { type: String, attribute: "change-label" },
      staticLabel: { type: String, attribute: "static-label" },
      offAirLabel: { type: String, attribute: "off-air-label" },
      // with a post below the set: the screen reads it instead of tuning,
      // and a cue on screen points down to it
      readLabel: { type: String, attribute: "read-label" },
      readCue: { type: String, attribute: "read-cue" },
      _readRun: { type: Number, state: true },
    };
  }

  constructor() {
    super();
    this.crawlTitle = "";
    this.presenter = "";
    this.kicker = "";
    this.runtime = "";
    this.runtimeLabel = "Running time";
    this.minLabel = "min";
    this.playLabel = "Play";
    this.channelLabel = "CH";
    this.sequenceLabel = "Title sequence for";
    this.presentsLabel = "presents";
    this.still = false;
    this.bare = false;
    this.off = false;
    this.offLabel = "The TV is off";
    this.tunable = false;
    this.channel = 3;
    this.held = false;
    this.seek = "";
    this.cast = [];
    this.changeLabel = "Change channel";
    this.staticLabel = "";
    this.offAirLabel = "";
    this.readLabel = "";
    this.readCue = "READ";
    this._readRun = 0;
  }

  get _tv() {
    return this.shadowRoot && this.shadowRoot.querySelector("retro-tv");
  }

  /**
   * The name of the program on a channel, for a "now playing" line.
   * @param {Number} channel - defaults to the current channel
   * @returns {String}
   */
  programNameFor(channel = this.channel) {
    const ch = Number(channel);
    const p =
      this.shadowRoot &&
      [...this.shadowRoot.querySelectorAll("[channel]")].find(
        (el) =>
          el.tagName !== "RETRO-TV" &&
          Number(el.getAttribute("channel")) === ch,
      );
    return p && p.programName ? p.programName : "";
  }

  get _blocks() {
    return this.shadowRoot && this.shadowRoot.querySelector("retro-tv-blocks");
  }

  /**
   * Play the title sequence again from power on.
   */
  replay() {
    this.still = false;
    this._readRun += 1;
    if (this._tv) {
      this._tv.replay();
    }
  }

  /**
   * Jump to the final frame.
   */
  skip() {
    this.still = true;
  }

  /**
   * Change to the next channel (1 to 10, and around) and tell the page.
   */
  changeChannel() {
    const i = CHANNELS.indexOf(Number(this.channel));
    this.tune(CHANNELS[(i + 1) % CHANNELS.length]);
  }

  /** the screen was pressed with a post below: let the page scroll to it */
  _read() {
    this.dispatchEvent(
      new CustomEvent("vhs-blog-tv-read", { bubbles: true, composed: true }),
    );
  }

  /**
   * Change to a channel and tell the page.
   * @param {Number} channel
   */
  tune(channel) {
    this.channel = Number(channel);
    this.held = false;
    this.dispatchEvent(
      new CustomEvent("vhs-blog-tv-channel", {
        bubbles: true,
        composed: true,
        detail: { channel: this.channel },
      }),
    );
  }

  /**
   * Play a HAX 64 controller button in HAX Blocks.
   * @param {String} button u, d, l, r, select, start, b or a
   */
  press(button) {
    if (this._blocks) {
      this._blocks.press(button);
    }
  }

  /** Start HAX Blocks over. */
  reset() {
    if (this._blocks) {
      this._blocks.reset();
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          /* printed artwork: the same in light and dark, like the theme */
          color-scheme: only dark;
        }
        :host([bare]) retro-tv {
          --retro-tv-screen-radius: 34px / 42px;
        }
        button.screen {
          position: relative;
          display: block;
          width: 100%;
          padding: 0;
          border: 0;
          border-radius: 34px / 42px;
          background: none;
          cursor: pointer;
          font: inherit;
          color: inherit;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
        }
        button.screen:focus-visible {
          outline: 4px solid #ffd60a;
          outline-offset: 6px;
        }
        /* a post below the set: once the title has rolled, a cue on the
           screen points down to it */
        .read {
          position: absolute;
          /* bottom right, across from the title sequence's Play cue */
          inset: auto 7% 7% auto;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 0.2em;
          pointer-events: none;
          font-family: "VT323", monospace;
          font-size: var(--retro-tv-osd-size, clamp(18px, 2.4vw, 28px));
          line-height: 0.9;
          letter-spacing: 0.08em;
          color: #5dff8a;
          text-shadow: 0 0 8px rgba(93, 255, 138, 0.8);
        }
        .read span {
          background: rgba(0, 0, 0, 0.55);
          padding: 2px 12px 0;
        }
        .read svg {
          width: 1em;
          height: 0.75em;
          fill: currentColor;
          filter: drop-shadow(0 0 6px rgba(93, 255, 138, 0.8));
        }
        @media (prefers-reduced-motion: no-preference) {
          /* after the title sequence's Play cue (about 8s in) */
          :host(:not([still])) .read {
            animation: vhs-read-in 0.4s steps(2) 8.2s both;
          }
          :host(:not([still])) .read svg {
            animation: vhs-read-bob 1.1s ease-in-out 8.6s infinite;
          }
        }
        @keyframes vhs-read-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes vhs-read-bob {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(30%);
          }
        }
        /* rewind and fast forward: tracking lines over the picture */
        .seek {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: none;
          align-items: center;
          justify-content: center;
          background: repeating-linear-gradient(
            180deg,
            transparent 0 18%,
            rgba(255, 255, 255, 0.28) 18% 20%,
            transparent 20% 34%,
            rgba(0, 0, 0, 0.35) 34% 37%
          );
        }
        :host([seek="rew"]) .seek,
        :host([seek="ff"]) .seek {
          display: flex;
        }
        .seek span {
          font-family: "VT323", monospace;
          font-size: clamp(28px, 8vw, 96px);
          color: #5dff8a;
          text-shadow: 0 0 8px rgba(93, 255, 138, 0.8);
          background: rgba(0, 0, 0, 0.55);
          padding: 0 16px;
        }
        @media (prefers-reduced-motion: no-preference) {
          .seek {
            animation: vhs-track 0.4s linear infinite;
          }
        }
        @keyframes vhs-track {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 100%;
          }
        }
        @media (forced-colors: active) {
          button.screen {
            border: 2px solid ButtonText;
          }
        }
      `,
    ];
  }

  _label() {
    if (this.off) {
      return this.offLabel;
    }
    const tv = this._tv;
    const p = tv ? tv.program : null;
    return p ? p.screenLabel : `${this.sequenceLabel} ${this.crawlTitle}`;
  }

  render() {
    // inside the tunable button the set is one picture, named by the button
    const set = html`<retro-tv
      aria-hidden="${this.tunable ? "true" : "false"}"
      exportparts="tv, screen"
      ?bare="${this.bare}"
      channel="${this.channel}"
      channel-prefix="${this.channelLabel}"
      ?power="${!this.off}"
      off-label="${this.offLabel}"
      ?still="${this.still || this.held}"
      @retro-tv-program-updated="${() => this.requestUpdate()}"
    >
      <retro-tv-title-sequence
        channel="3"
        crawl-title="${this.crawlTitle}"
        presenter="${this.presenter}"
        kicker="${this.kicker}"
        runtime="${this.runtime}"
        runtime-label="${this.runtimeLabel}"
        min-label="${this.minLabel}"
        play-label="${this.playLabel}"
        sequence-label="${this.sequenceLabel}"
        presents-label="${this.presentsLabel}"
      ></retro-tv-title-sequence>
      <retro-tv-static
        channel="4"
        label="${this.staticLabel}"
        off-air="${this.offAirLabel}"
        .cast="${this.cast}"
      ></retro-tv-static>
      <retro-tv-sign-on channel="1"></retro-tv-sign-on>
      <retro-tv-blocks channel="2"></retro-tv-blocks>
      <retro-tv-credits channel="5"></retro-tv-credits>
      <retro-tv-hax-tv channel="6"></retro-tv-hax-tv>
      <retro-tv-home-computer
        channel="7"
        what="${this.crawlTitle}"
        loading
      ></retro-tv-home-computer>
      <retro-tv-handheld channel="8"></retro-tv-handheld>
      <retro-tv-pc
        channel="9"
        command="PLAY"
        message="${this.crawlTitle}"
        loading
      ></retro-tv-pc>
      <retro-tv-disc channel="10"></retro-tv-disc>
      ${
        this.readLabel && !this.off && !this.seek
          ? keyed(
              this._readRun,
              html`<div class="read" slot="overlay" aria-hidden="true">
                <span>${this.readCue}</span>
                <svg viewBox="0 0 24 16" focusable="false">
                  <path d="M2 2h20L12 14z"></path>
                </svg>
              </div>`,
            )
          : nothing
      }
      <div class="seek" slot="overlay" aria-hidden="true">
        <span>${this.seek === "rew" ? "◀◀" : "▶▶"}</span>
      </div>
    </retro-tv>`;
    if (this.tunable) {
      // the name comes from words in the button, not aria-label, so it
      // never disagrees with text drawn on the screen
      const read = !!this.readLabel;
      return html`<button
        class="screen"
        type="button"
        @click="${read ? this._read : this.changeChannel}"
      >
        <span class="sr-only"
          >${this._label()}. ${read ? this.readLabel : this.changeLabel}</span
        >
        ${set}
      </button>`;
    }
    return set;
  }
}
globalThis.customElements.define(VhsBlogTv.tag, VhsBlogTv);

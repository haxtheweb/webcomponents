/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import "@haxtheweb/retro-tv/retro-tv.js";
import "@haxtheweb/retro-tv/lib/programs/retro-tv-title-sequence.js";
import "@haxtheweb/retro-tv/lib/programs/retro-tv-static.js";
import "@haxtheweb/retro-tv/lib/programs/retro-tv-melee.js";

/** the channels a tunable set flips through, in order */
const CHANNELS = [3, 4, 2];

/**
 * `vhs-blog-tv`
 * The VHS Blog's television, built on `retro-tv` like every TV in HAX:
 * channel 3 rolls the 80s title sequence for the active post, channel 4 is
 * static with a cast of rpg-characters tumbling through it, and channel 2
 * is HAX Melee, the game on the HAX 64 cartridge. All motion is CSS and
 * only runs when the visitor has not asked for reduced motion; otherwise
 * (and after skip()) the final frame shows with no motion.
 *
 * "bare" renders only the screen (for the console cabinet) and "off" shows
 * dark glass. A "tunable" screen is a button that changes channel
 * (3, 4, 2, and around); "held" stops the picture. "seek" (rew or ff) runs
 * tracking lines while the VCR moves between posts.
 *
 * @element vhs-blog-tv
 * @fires vhs-blog-tv-channel - detail { channel }
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
  }

  get _tv() {
    return this.shadowRoot && this.shadowRoot.querySelector("retro-tv");
  }

  get _melee() {
    return this.shadowRoot && this.shadowRoot.querySelector("retro-tv-melee");
  }

  /**
   * Play the title sequence again from power on.
   */
  replay() {
    this.still = false;
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
   * Change to the next channel (3, 4, 2, and around) and tell the page.
   */
  changeChannel() {
    const i = CHANNELS.indexOf(Number(this.channel));
    this.tune(CHANNELS[(i + 1) % CHANNELS.length]);
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
   * Play a HAX 64 controller button in HAX Melee.
   * @param {String} button u, d, l, r, select, start, b or a
   */
  press(button) {
    if (this._melee) {
      this._melee.press(button);
    }
  }

  /** Start HAX Melee over. */
  reset() {
    if (this._melee) {
      this._melee.reset();
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
      <retro-tv-melee channel="2"></retro-tv-melee>
      <div class="seek" slot="overlay" aria-hidden="true">
        <span>${this.seek === "rew" ? "◀◀" : "▶▶"}</span>
      </div>
    </retro-tv>`;
    if (this.tunable) {
      // the name comes from words in the button, not aria-label, so it
      // never disagrees with text drawn on the screen
      return html`<button
        class="screen"
        type="button"
        @click="${this.changeChannel}"
      >
        <span class="sr-only">${this._label()}. ${this.changeLabel}</span>
        ${set}
      </button>`;
    }
    return set;
  }
}
globalThis.customElements.define(VhsBlogTv.tag, VhsBlogTv);

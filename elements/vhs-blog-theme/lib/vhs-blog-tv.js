/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import "@haxtheweb/retro-tv/retro-tv.js";
import "@haxtheweb/retro-tv/lib/programs/retro-tv-title-sequence.js";

/**
 * `vhs-blog-tv`
 * An old CRT that powers on and rolls an 80s style title sequence for the
 * active post. The set is `retro-tv` on channel 3 with the
 * `retro-tv-title-sequence` program; this element keeps the attributes the
 * theme has always passed. All motion is CSS and only runs when the visitor
 * has not asked for reduced motion; otherwise (and after skip()) the final
 * frame shows with no motion. The screen is one image to assistive tech,
 * named by the post title; the real heading lives in the page content.
 *
 * @element vhs-blog-tv
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
    this.channelLabel = "CH 03";
    this.sequenceLabel = "Title sequence for";
    this.presentsLabel = "presents";
    this.still = false;
  }

  get _tv() {
    return this.shadowRoot && this.shadowRoot.querySelector("retro-tv");
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

  static get styles() {
    return [
      css`
        :host {
          display: block;
          /* printed artwork: the same in light and dark, like the theme */
          color-scheme: only dark;
        }
      `,
    ];
  }

  render() {
    return html`
      <retro-tv
        exportparts="tv"
        channel="3"
        channel-label="${this.channelLabel}"
        ?still="${this.still}"
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
      </retro-tv>
    `;
  }
}
globalThis.customElements.define(VhsBlogTv.tag, VhsBlogTv);

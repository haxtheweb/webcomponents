/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import {
  HAX_NETWORK,
  haxNetworkGlyph,
  HaxNetworkGlyphStyles,
} from "@haxtheweb/hax-network-bar/lib/hax-network.js";

// what the chip says for each place in the HAX network: [full, compact, where]
const WORDS = {
  cloud: ["seeTheStory", "story", "onHaxCloud"],
  learn: ["learnHow", "learn", "onLearn"],
  lab: ["joinIn", "lab", "onLab"],
  try: ["tryIt", "try", "onTry"],
  elements: ["seeTheBlock", "block", "onElements"],
  web: ["readMore", "hax", "onWeb"],
};

/**
 * `hax-story-link`
 * `The one button that opens the story behind a claim, on hax.cloud`
 *
 * Put it beside anything that makes a claim: a number, a pillar, a person,
 * an element. `story` is the story's address on hax.cloud (stories/ee450a19,
 * or a web's path such as hax-lab). The label and the mark never change, so
 * people learn it once and recognize it on any site.
 *
 * `site` points the same chip at another place in the HAX network, with that
 * place's own icon from the network bar: `learn` (a tutorial on
 * learn.hax.cloud), `lab` (lab.hax.cloud), `try` (browser.hax.cloud), `elements` (the block gallery)
 * or `web` (haxtheweb.org). `story` is then the path on that site. `named`
 * shows what it is about in the chip itself, for chips that sit in a row.
 *
 * @element hax-story-link
 */
class HaxStoryLink extends I18NMixin(DDD) {
  static get tag() {
    return "hax-story-link";
  }

  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }
  static get properties() {
    return {
      ...super.properties,
      /** address of the story on hax.cloud: stories/<address>, or a web's path */
      story: { type: String },
      /** what the story is about, for people who cannot see what it sits beside */
      about: { type: String },
      /** small chip that reads "Story" */
      compact: { type: Boolean, reflect: true },
      /** which HAX network site it opens: cloud (stories), learn, lab, try, elements or web */
      site: { type: String, reflect: true },
      /** show what it is about in the chip, not only to screen readers */
      named: { type: Boolean, reflect: true },
      /** where stories live, when not the network site's own address */
      base: { type: String },
    };
  }
  constructor() {
    super();
    this.story = "";
    this.about = "";
    this.compact = false;
    this.site = "cloud";
    this.named = false;
    this.base = "";
    this.t = {
      seeTheStory: "See the story",
      story: "Story",
      onHaxCloud: "on hax.cloud",
      learnHow: "Learn how",
      learn: "Learn",
      onLearn: "on learn.hax.cloud",
      joinIn: "Join in",
      lab: "Lab",
      onLab: "on lab.hax.cloud",
      tryIt: "Try it now",
      try: "Try",
      onTry: "on browser.hax.cloud",
      seeTheBlock: "See the block",
      block: "Block",
      onElements: "on webcomponents.hax.cloud",
      readMore: "Read more",
      hax: "HAX",
      onWeb: "on haxtheweb.org",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL(`../locales/${this.tag}.es.json`, import.meta.url).href +
        "/../",
    });
  }
  static get styles() {
    return [
      super.styles,
      HaxNetworkGlyphStyles,
      css`
        :host {
          display: inline-block;
          vertical-align: middle;
          --hsl-ink: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --hsl-surface: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
        }
        a {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          min-height: var(--ddd-spacing-8);
          box-sizing: border-box;
          padding-block: var(--ddd-spacing-1);
          padding-inline: var(--ddd-spacing-1) var(--ddd-spacing-4);
          font-family: var(--ddd-font-navigation, var(--ddd-font-primary));
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          line-height: 1;
          text-decoration: none;
          color: var(--hsl-ink);
          background-color: var(--hsl-surface);
          border: var(--ddd-border-size-sm) solid var(--hsl-ink);
          border-radius: 999px;
        }
        .mark {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: var(--ddd-spacing-6);
          height: var(--ddd-spacing-6);
          border-radius: 50%;
          color: var(--hm-on-brand, var(--hsl-surface));
          background-color: var(--hm-brand, var(--hsl-ink));
          flex: none;
        }
        a {
          --glyph-size: var(--ddd-spacing-4);
        }
        a:hover {
          color: var(--hsl-surface);
          background-color: var(--hsl-ink);
        }
        a:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        :host([compact]) a {
          min-height: var(--ddd-spacing-6);
          padding-block: 0;
          padding-inline: 0 var(--ddd-spacing-3);
          font-size: var(--ddd-font-size-5xs);
          gap: var(--ddd-spacing-1);
        }
        .sr {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
        }
      `,
    ];
  }
  get _site() {
    return Object.prototype.hasOwnProperty.call(WORDS, this.site)
      ? this.site
      : "cloud";
  }
  get href() {
    let base = HAX_NETWORK.properties[this._site].url;
    try {
      const url = new URL(this.base);
      if (url.protocol === "https:" || url.protocol === "http:") {
        base = url.href;
      }
    } catch {
      // keep the network site's own address
    }
    // a story's address (stories/ee450a19) or a path (hax-lab), nothing else
    const path = String(this.story || "").replace(/^\/+/, "");
    base = base.replace(/\/*$/, "/");
    if (!/^[a-z0-9-]+(\/[a-z0-9-]+)*$/.test(path)) return base;
    return base + path;
  }
  render() {
    const words = WORDS[this._site];
    const about = this.about ? `: ${this.about}` : ``;
    return html`<a class="glyph-host" href="${this.href}"
      ><span class="mark">${haxNetworkGlyph(this._site)}</span
      ><span
        >${this.t[this.compact ? words[1] : words[0]]}${
          this.named ? about : ``
        }</span
      ><span class="sr"
        >${this.named ? `` : `${about},`} ${this.t[words[2]]}</span
      ></a
    >`;
  }
}
globalThis.customElements.define(HaxStoryLink.tag, HaxStoryLink);
export { HaxStoryLink };

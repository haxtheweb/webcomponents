/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import {
  haxNetworkGlyph,
  HaxNetworkGlyphStyles,
} from "@haxtheweb/hax-network-bar/lib/hax-network.js";

/**
 * `hax-reel`
 * `Something you click to flip to the next one, like changing the channel`
 *
 * `items` is the list to flip through. Each one is a picture
 * ({ src, alt, name, tags }), an rpg-character ({ character: "seed", name })
 * or a callout ({ callout: "Try it now", site: "try", name }) that draws a
 * HAX network icon over a line of text. Only the one showing is loaded; the
 * next loads when it is asked for.
 *
 * `effect` is how the change looks. `glitch` is the rpg-glitch burst: for a
 * third of a second rows of the old and the new one trade places, the colors
 * split apart, blocks corrupt and scan lines run over it. `channel` is a
 * quick TV flick. Visitors who ask for less motion get a plain swap.
 *
 * With `caption`, the name and tags show under it; with `name-href` the name
 * is a link (the reel also fires `reel-name` first, which a page can cancel
 * to do the scrolling itself).
 *
 * @element hax-reel
 * @fires reel-changed - the reel moved to another item; detail: { index, item }
 * @fires reel-name - the name in the caption was activated; detail: { index, item }
 */
class HaxReel extends I18NMixin(DDD) {
  static get tag() {
    return "hax-reel";
  }
  static get properties() {
    return {
      ...super.properties,
      /** [{ src, alt, name, tags: [] } | { character, name } | { callout, site, name }] */
      items: { type: Array },
      /** which one is showing */
      index: { type: Number, reflect: true },
      /** glitch or channel */
      effect: { type: String, reflect: true },
      /** show the name and tags under it */
      caption: { type: Boolean, reflect: true },
      /** crop to a circle */
      round: { type: Boolean, reflect: true },
      /** what the button does, for people who cannot see it */
      label: { type: String },
      /** where the name in the caption goes */
      nameHref: { type: String, attribute: "name-href" },
      _changing: { type: Boolean, state: true },
      _was: { type: Object, state: true },
      _width: { type: Number, state: true },
    };
  }
  constructor() {
    super();
    this.items = [];
    this.index = 0;
    this.effect = "channel";
    this.caption = false;
    this.round = false;
    this.label = "";
    this.nameHref = "";
    this._changing = false;
    this._was = null;
    this._width = 0;
    this.t = {
      showAnother: "Show another",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("../locales/hax-reel.en.json", import.meta.url).href + "/../",
    });
  }
  static get styles() {
    return [
      super.styles,
      HaxNetworkGlyphStyles,
      css`
        :host {
          display: block;
        }
        button {
          display: block;
          width: 100%;
          padding: 0;
          margin: 0;
          border: none;
          background: none;
          cursor: pointer;
          font: inherit;
          color: inherit;
          border-radius: var(--reel-frame-radius, inherit);
        }
        button:focus-visible {
          outline: var(--ddd-border-size-md) solid currentColor;
          outline-offset: var(--ddd-spacing-1);
        }
        .frame {
          position: relative;
          display: block;
          overflow: hidden;
          border: var(--reel-frame-border, none);
          border-radius: var(--reel-frame-radius, inherit);
          box-shadow: var(--reel-frame-shadow, none);
          box-sizing: border-box;
        }
        :host([round]) .frame,
        :host([round]) button {
          border-radius: 50%;
        }
        .pane {
          display: block;
        }
        .pane.over {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        img {
          display: block;
          width: 100%;
          height: auto;
        }
        :host([round]) img {
          aspect-ratio: 1;
          object-fit: cover;
        }
        /* a character or a callout fills the same box a picture would */
        .fill {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--ddd-spacing-2);
          box-sizing: border-box;
          aspect-ratio: var(--reel-aspect, 1);
          padding: 8%;
          text-align: center;
          color: var(--reel-fill-ink, var(--hm-on-accent, inherit));
          background-color: var(
            --reel-fill,
            var(--hm-accent, var(--ddd-theme-default-keystoneYellow))
          );
          background-image: repeating-linear-gradient(
            135deg,
            transparent 0 14px,
            rgba(255, 255, 255, 0.28) 14px 28px
          );
        }
        /* in a circle, keep the words in the upper part, clear of the edge */
        :host([round]) .fill:not(.who) {
          padding-bottom: 26%;
        }
        .fill.who {
          justify-content: flex-end;
          padding-bottom: 0;
        }
        .fill .glyph-host {
          --glyph-size: 38%;
          display: contents;
        }
        .fill svg.glyph {
          width: 38%;
          height: auto;
        }
        .fill .say {
          font-family: var(--ddd-font-heading, var(--ddd-font-primary));
          font-weight: var(--ddd-font-weight-black);
          font-size: clamp(
            var(--ddd-font-size-4xs),
            11cqw,
            var(--ddd-font-size-l)
          );
          line-height: var(--ddd-lh-120);
          text-wrap: balance;
        }
        .frame {
          container-type: inline-size;
        }

        /* channel: a quick TV flick */
        .changing .now {
          animation: flick 0.42s steps(6, end);
        }
        @keyframes flick {
          0% {
            transform: translateY(0) scaleY(1);
            filter: brightness(1);
          }
          30% {
            transform: translateY(-40%) scaleY(0.2);
            filter: brightness(2.2) saturate(0);
          }
          60% {
            transform: translateY(30%) scaleY(0.4);
            filter: brightness(0.4) saturate(0);
          }
          100% {
            transform: translateY(0) scaleY(1);
            filter: brightness(1);
          }
        }

        /* glitch: rows of the old and the new trade places, colors split,
           blocks corrupt and scan lines run over all of it */
        :host([effect="glitch"]) .changing .now {
          animation: tear 0.36s steps(1, end);
        }
        .was {
          animation: rows 0.36s steps(1, end) forwards;
        }
        .was img {
          image-rendering: pixelated;
        }
        .ghost {
          mix-blend-mode: screen;
          opacity: 0.75;
        }
        .ghost.red {
          filter: sepia(1) saturate(9) hue-rotate(-40deg);
          animation: split-red 0.36s steps(1, end) forwards;
        }
        .ghost.cyan {
          filter: sepia(1) saturate(9) hue-rotate(140deg);
          animation: split-cyan 0.36s steps(1, end) forwards;
        }
        .noise {
          background-image:
            linear-gradient(
              var(--ddd-theme-default-skyBlue),
              var(--ddd-theme-default-skyBlue)
            ),
            linear-gradient(
              var(--ddd-theme-default-original87Pink),
              var(--ddd-theme-default-original87Pink)
            ),
            linear-gradient(
              var(--ddd-theme-default-white),
              var(--ddd-theme-default-white)
            ),
            linear-gradient(
              var(--ddd-theme-default-coalyGray),
              var(--ddd-theme-default-coalyGray)
            ),
            repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.32) 0 1px,
              transparent 1px 3px
            );
          background-repeat: no-repeat, no-repeat, no-repeat, no-repeat, repeat;
          background-size:
            22% 6%,
            14% 9%,
            30% 3%,
            18% 5%,
            auto;
          animation: blocks 0.36s steps(1, end) forwards;
        }
        @keyframes tear {
          0%,
          100% {
            transform: none;
            filter: none;
          }
          14% {
            transform: translateX(3%);
            filter: contrast(1.4) saturate(1.6);
          }
          42% {
            transform: translateX(-4%) skewX(-3deg);
            filter: contrast(1.8);
          }
          71% {
            transform: translateX(2%);
            filter: saturate(2);
          }
        }
        @keyframes rows {
          0% {
            clip-path: polygon(
              0 0,
              100% 0,
              100% 34%,
              0 34%,
              0 34%,
              100% 34%,
              100% 70%,
              0 70%,
              0 70%,
              100% 70%,
              100% 100%,
              0 100%
            );
            transform: none;
          }
          14% {
            clip-path: polygon(
              0 0,
              100% 0,
              100% 22%,
              0 22%,
              0 38%,
              100% 38%,
              100% 61%,
              0 61%,
              0 74%,
              100% 74%,
              100% 100%,
              0 100%
            );
            transform: translateX(-5%);
          }
          28% {
            clip-path: polygon(
              0 8%,
              100% 8%,
              100% 19%,
              0 19%,
              0 44%,
              100% 44%,
              100% 58%,
              0 58%,
              0 83%,
              100% 83%,
              100% 96%,
              0 96%
            );
            transform: translateX(4%);
          }
          42% {
            clip-path: polygon(
              0 0,
              100% 0,
              100% 12%,
              0 12%,
              0 30%,
              100% 30%,
              100% 49%,
              0 49%,
              0 66%,
              100% 66%,
              100% 72%,
              0 72%
            );
            transform: translateX(-8%) scale(1.04);
          }
          57% {
            clip-path: polygon(
              0 15%,
              100% 15%,
              100% 21%,
              0 21%,
              0 52%,
              100% 52%,
              100% 63%,
              0 63%,
              0 88%,
              100% 88%,
              100% 93%,
              0 93%
            );
            transform: translateX(6%);
          }
          71% {
            clip-path: polygon(
              0 40%,
              100% 40%,
              100% 44%,
              0 44%,
              0 77%,
              100% 77%,
              100% 81%,
              0 81%,
              0 81%,
              100% 81%,
              100% 81%,
              0 81%
            );
            transform: translateX(-3%);
          }
          85%,
          100% {
            clip-path: polygon(
              0 0,
              0 0,
              0 0,
              0 0,
              0 0,
              0 0,
              0 0,
              0 0,
              0 0,
              0 0,
              0 0,
              0 0
            );
            transform: none;
          }
        }
        @keyframes split-red {
          0%,
          85%,
          100% {
            opacity: 0;
          }
          14% {
            opacity: 0.75;
            transform: translateX(-4%);
            clip-path: inset(22% 0 62% 0);
          }
          28% {
            opacity: 0.75;
            transform: translateX(5%);
            clip-path: inset(58% 0 17% 0);
          }
          42% {
            opacity: 0.75;
            transform: translateX(-7%);
            clip-path: inset(12% 0 70% 0);
          }
          57% {
            opacity: 0.75;
            transform: translateX(3%);
            clip-path: inset(63% 0 12% 0);
          }
          71% {
            opacity: 0.6;
            transform: translateX(-2%);
            clip-path: inset(0);
          }
        }
        @keyframes split-cyan {
          0%,
          85%,
          100% {
            opacity: 0;
          }
          14% {
            opacity: 0.75;
            transform: translateX(4%);
            clip-path: inset(61% 0 26% 0);
          }
          28% {
            opacity: 0.75;
            transform: translateX(-5%);
            clip-path: inset(19% 0 56% 0);
          }
          42% {
            opacity: 0.75;
            transform: translateX(7%);
            clip-path: inset(49% 0 34% 0);
          }
          57% {
            opacity: 0.75;
            transform: translateX(-3%);
            clip-path: inset(21% 0 48% 0);
          }
          71% {
            opacity: 0.6;
            transform: translateX(2%);
            clip-path: inset(0);
          }
        }
        @keyframes blocks {
          0% {
            opacity: 1;
            background-position:
              8% 20%,
              72% 61%,
              30% 44%,
              90% 12%,
              0 0;
          }
          14% {
            background-position:
              64% 12%,
              12% 70%,
              55% 83%,
              20% 38%,
              0 1px;
          }
          28% {
            background-position:
              20% 58%,
              80% 30%,
              5% 16%,
              60% 74%,
              0 2px;
          }
          42% {
            background-position:
              85% 82%,
              34% 8%,
              70% 52%,
              10% 90%,
              0 0;
          }
          57% {
            background-position:
              40% 34%,
              92% 88%,
              18% 66%,
              48% 22%,
              0 1px;
          }
          71% {
            opacity: 0.7;
            background-position:
              4% 90%,
              58% 46%,
              84% 28%,
              76% 60%,
              0 2px;
          }
          85%,
          100% {
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .changing .now,
          :host([effect="glitch"]) .changing .now {
            animation: none;
          }
        }
        .caption {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-1) var(--ddd-spacing-2);
          margin-top: var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-120);
          text-align: left;
        }
        .sr {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(50%);
        }
        :host(:not([caption])) .caption {
          margin: 0;
        }
        .name {
          font-weight: var(--ddd-font-weight-bold);
        }
        a.name {
          color: inherit;
          display: inline-block;
          min-height: var(--ddd-spacing-6);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-0);
          box-sizing: border-box;
        }
        a.name:focus-visible {
          outline: var(--ddd-border-size-md) solid currentColor;
          outline-offset: var(--ddd-spacing-1);
        }
        .tag {
          font-size: var(--ddd-font-size-5xs);
          border: var(--ddd-border-size-sm) solid currentColor;
          border-radius: 999px;
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
        }
      `,
    ];
  }
  willUpdate(changed) {
    if (super.willUpdate) {
      super.willUpdate(changed);
    }
    if (
      changed.has("items") &&
      Array.isArray(this.items) &&
      this.items.some((item) => item && item.character)
    ) {
      // characters are only loaded by a reel that has one to show
      import("@haxtheweb/rpg-character/rpg-character.js");
      if (!this.__resize && globalThis.ResizeObserver) {
        this.__resize = new globalThis.ResizeObserver((entries) => {
          this._width = Math.round(entries[0].contentRect.width);
        });
        this.__resize.observe(this);
      }
    }
  }
  disconnectedCallback() {
    if (this.__resize) {
      this.__resize.disconnect();
      this.__resize = null;
    }
    clearTimeout(this.__settle);
    super.disconnectedCallback();
  }
  next() {
    const count = Array.isArray(this.items) ? this.items.length : 0;
    if (count < 2 || this._changing) {
      return;
    }
    const to = (this.index + 1) % count;
    const calm = globalThis.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const swap = () => {
      this._was = this.items[this.index];
      this._changing = !calm;
      this.index = to;
      this.dispatchEvent(
        new CustomEvent("reel-changed", {
          bubbles: true,
          composed: true,
          detail: { index: to, item: this.items[to] },
        }),
      );
      this.__settle = setTimeout(
        () => {
          this._changing = false;
          this._was = null;
        },
        this.effect === "glitch" ? 380 : 440,
      );
    };
    if (!this.items[to].src) {
      swap();
      return;
    }
    // load the next picture first, so the change never shows a hole
    const loader = new globalThis.Image();
    loader.onload = swap;
    loader.onerror = swap;
    loader.src = this.items[to].src;
  }
  _name(e) {
    const go = this.dispatchEvent(
      new CustomEvent("reel-name", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: { index: this.index, item: this.items[this.index] },
      }),
    );
    if (!go) {
      e.preventDefault();
    }
  }
  // a place on this page (#id) or a web address, nothing else
  get _nameHref() {
    const href = String(this.nameHref || "");
    return /^#[\w-]*$/.test(href) || /^https?:\/\//.test(href) ? href : "";
  }
  _draw(item) {
    if (item.character) {
      const height = Math.max(60, Math.round((this._width || 200) * 0.8));
      return html`<span class="fill who"
        ><rpg-character
          seed="${item.character}"
          height="${height}"
          width="${Math.round(height * 0.8)}"
        ></rpg-character
      ></span>`;
    }
    if (item.callout) {
      return html`<span class="fill"
        ><span class="glyph-host">${haxNetworkGlyph(item.site)}</span
        ><span class="say">${item.callout}</span></span
      >`;
    }
    return html`<img src="${item.src}" alt="" />`;
  }
  render() {
    const items = Array.isArray(this.items) ? this.items : [];
    const item = items[this.index] || items[0];
    if (!item) {
      return html``;
    }
    const tags = Array.isArray(item.tags) ? item.tags : [];
    const burst = this._changing && this.effect === "glitch" && this._was;
    return html`
      <button
        type="button"
        @click="${this.next}"
        aria-label="${this.label || this.t.showAnother}"
        ?disabled="${items.length < 2}"
      >
        <span class="frame ${this._changing ? "changing" : ""}">
          <span class="pane now">${this._draw(item)}</span>
          ${
            burst
              ? html`<span class="pane over was" aria-hidden="true"
                    >${this._draw(this._was)}</span
                  >${
                    item.src
                      ? html`<span
                            class="pane over ghost red"
                            aria-hidden="true"
                            >${this._draw(item)}</span
                          ><span class="pane over ghost cyan" aria-hidden="true"
                            >${this._draw(item)}</span
                          >`
                      : ``
                  }<span class="pane over noise" aria-hidden="true"></span>`
              : ``
          }
        </span>
      </button>
      <div class="caption" aria-live="polite">
        ${
          this.caption
            ? html`${
                this._nameHref
                  ? html`<a
                      class="name"
                      href="${this._nameHref}"
                      @click="${this._name}"
                      >${item.name}</a
                    >`
                  : html`<span class="name">${item.name}</span>`
              }${tags.map((tag) => html`<span class="tag">${tag}</span>`)}`
            : html`<span class="sr"
                >${item.alt || item.name || item.callout || ""}</span
              >`
        }
      </div>
    `;
  }
}
globalThis.customElements.define(HaxReel.tag, HaxReel);
export { HaxReel };

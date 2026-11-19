/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `hax-reel`
 * `A picture you click to flip to the next one, like changing the channel`
 *
 * `items` is the list of pictures: [{ src, alt, name, tags }]. Only the one
 * showing is loaded; the next loads when it is asked for. `effect` is how the
 * change looks: `glitch` (the picture breaks up into the next) or `channel`
 * (a quick TV flick). With `caption`, the name and tags of the picture show
 * under it. Add to `items` and the reel has more to show.
 *
 * @element hax-reel
 */
class HaxReel extends I18NMixin(DDD) {
  static get tag() {
    return "hax-reel";
  }
  static get properties() {
    return {
      ...super.properties,
      /** [{ src, alt, name, tags: [] }] */
      items: { type: Array },
      /** which picture is showing */
      index: { type: Number, reflect: true },
      /** glitch or channel */
      effect: { type: String, reflect: true },
      /** show the picture's name and tags under it */
      caption: { type: Boolean, reflect: true },
      /** crop the picture to a circle */
      round: { type: Boolean, reflect: true },
      /** what the button does, for people who cannot see it */
      label: { type: String },
      _changing: { type: Boolean, state: true },
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
    this._changing = false;
    this.t = {
      showAnother: "Show another",
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
          border-radius: inherit;
        }
        button {
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
        img {
          display: block;
          width: 100%;
          height: auto;
        }
        :host([round]) img {
          aspect-ratio: 1;
          object-fit: cover;
        }
        .changing img {
          animation: var(--reel-animation, flick) 0.42s steps(6, end);
        }
        :host([effect="glitch"]) .changing img {
          animation-name: glitch;
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
        @keyframes glitch {
          0% {
            clip-path: inset(0 0 0 0);
            transform: translateX(0);
            filter: hue-rotate(0deg);
          }
          20% {
            clip-path: inset(12% 0 58% 0);
            transform: translateX(-6%);
            filter: hue-rotate(90deg) saturate(2);
          }
          40% {
            clip-path: inset(62% 0 8% 0);
            transform: translateX(7%);
            filter: hue-rotate(200deg) saturate(2);
          }
          60% {
            clip-path: inset(30% 0 36% 0);
            transform: translateX(-4%);
            filter: hue-rotate(300deg) contrast(1.6);
          }
          80% {
            clip-path: inset(4% 0 80% 0);
            transform: translateX(3%);
            filter: hue-rotate(40deg);
          }
          100% {
            clip-path: inset(0 0 0 0);
            transform: translateX(0);
            filter: hue-rotate(0deg);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .changing img {
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
        .tag {
          font-size: var(--ddd-font-size-5xs);
          border: var(--ddd-border-size-sm) solid currentColor;
          border-radius: 999px;
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
        }
      `,
    ];
  }
  next() {
    const count = Array.isArray(this.items) ? this.items.length : 0;
    if (count < 2 || this._changing) {
      return;
    }
    const to = (this.index + 1) % count;
    // load the next picture first, so the change never shows a hole
    const loader = new globalThis.Image();
    const swap = () => {
      this._changing = true;
      this.index = to;
      setTimeout(() => {
        this._changing = false;
      }, 440);
    };
    loader.onload = swap;
    loader.onerror = swap;
    loader.src = this.items[to].src;
  }
  render() {
    const items = Array.isArray(this.items) ? this.items : [];
    const item = items[this.index] || items[0];
    if (!item) {
      return html``;
    }
    const tags = Array.isArray(item.tags) ? item.tags : [];
    return html`
      <button
        type="button"
        @click="${this.next}"
        aria-label="${this.label || this.t.showAnother}"
        ?disabled="${items.length < 2}"
      >
        <span class="frame ${this._changing ? "changing" : ""}">
          <img src="${item.src}" alt="" />
        </span>
      </button>
      <div class="caption" aria-live="polite">
        ${
          this.caption
            ? html`<span class="name">${item.name}</span>${tags.map(
                  (tag) => html`<span class="tag">${tag}</span>`,
                )}`
            : html`<span class="sr">${item.alt || item.name || ""}</span>`
        }
      </div>
    `;
  }
}
globalThis.customElements.define(HaxReel.tag, HaxReel);
export { HaxReel };

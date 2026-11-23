/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Section blocks for the HAX marketing site. Each one is a small authorable
 * element: attributes for the fixed parts, a slot for the words.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/rpg-character/rpg-character.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import "@haxtheweb/count-up/count-up.js";
import "@haxtheweb/hax-marketing-theme/lib/hax-story-link.js";

// ink on surface is the one pair that holds under every design system
export const marketingTokens = css`
  :host {
    --hm-ink: light-dark(
      var(--ddd-theme-default-coalyGray),
      var(--ddd-theme-default-white)
    );
    --hm-surface: light-dark(
      var(--ddd-theme-default-white),
      var(--ddd-theme-default-coalyGray)
    );
    --hm-soft: light-dark(
      var(--ddd-theme-default-limestoneMaxLight),
      var(--ddd-theme-default-potentialMidnight)
    );
    --hm-line: light-dark(
      var(--ddd-theme-default-slateGray),
      var(--ddd-theme-default-limestoneLight)
    );
    color: var(--hm-ink);
    font-family: var(--ddd-font-primary);
  }
  :host a.button {
    display: inline-block;
    font-weight: var(--ddd-font-weight-bold);
    font-size: var(--ddd-font-size-4xs);
    text-decoration: none;
    color: var(--hm-on-brand, var(--hm-surface));
    background-color: var(--hm-brand, var(--hm-ink));
    border: var(--ddd-border-size-md) solid var(--hm-edge, var(--hm-ink));
    border-radius: var(--ddd-radius-sm);
    padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
    min-height: var(--ddd-spacing-6);
  }
  :host a.button:hover {
    color: var(--hm-ink);
    background-color: var(--hm-surface);
  }
  a:focus-visible {
    outline: var(--ddd-focus-ring);
    outline-offset: var(--ddd-focus-offset);
  }
`;

const safeLink = (value) => {
  if (!value) {
    return null;
  }
  try {
    const url = new URL(value, globalThis.document.baseURI);
    return url.protocol === "http:" || url.protocol === "https:" ? value : null;
  } catch {
    return null;
  }
};

/**
 * `hax-cast`
 * `A grid for hax-cast-member cards`
 * @element hax-cast
 */
class HaxCast extends DDD {
  static get tag() {
    return "hax-cast";
  }

  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: var(--ddd-spacing-6);
          margin: var(--ddd-spacing-8) var(--ddd-spacing-0);
        }
        @media (max-width: 400px) {
          :host {
            grid-template-columns: 1fr;
          }
        }
      `,
    ];
  }
  render() {
    return html`<slot></slot>`;
  }
}
globalThis.customElements.define(HaxCast.tag, HaxCast);

/**
 * `hax-cast-member`
 * `One audience, played by an rpg-character`
 * @element hax-cast-member
 */
class HaxCastMember extends DDD {
  static get tag() {
    return "hax-cast-member";
  }
  static get properties() {
    return {
      ...super.properties,
      /** who this is, shown as the card heading */
      name: { type: String },
      /** rpg-character preset */
      preset: { type: String },
      /** rpg-character seed */
      seed: { type: String },
      /** where the button goes */
      link: { type: String },
      /** button text */
      label: { type: String },
      /** DDD color name for the stage behind the character */
      color: { type: String },
      _walk: { type: Boolean, state: true },
    };
  }
  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }
  constructor() {
    super();
    this.name = "";
    this.preset = "";
    this.seed = "";
    this.link = "";
    this.label = "";
    this.color = "skyLight";
    this._walk = false;
    // the character walks while the card has the pointer or the focus
    this.addEventListener("pointerenter", () => this._stride(true));
    this.addEventListener("pointerleave", () => this._stride(false));
    this.addEventListener("focusin", () => this._stride(true));
    this.addEventListener("focusout", () => this._stride(false));
  }
  _stride(on) {
    this._walk =
      on && !globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  static get styles() {
    return [
      super.styles,
      marketingTokens,
      css`
        :host {
          display: flex;
          flex-direction: column;
          border: var(--ddd-border-size-md) solid var(--hm-edge, var(--hm-ink));
          border-radius: var(--ddd-radius-lg);
          background-color: var(--hm-surface);
          overflow: hidden;
        }
        .stage {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          padding: var(--ddd-spacing-4) var(--ddd-spacing-4)
            var(--ddd-spacing-0);
          border-bottom: var(--ddd-border-size-md) solid
            var(--hm-edge, var(--hm-ink));
          background-color: var(--stage);
          background-image: repeating-linear-gradient(
            135deg,
            transparent 0 14px,
            rgba(255, 255, 255, 0.28) 14px 28px
          );
        }
        .body {
          display: flex;
          flex-direction: column;
          flex: 1 1 auto;
          gap: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-4);
        }
        h3 {
          font-family: var(--ddd-font-heading, var(--ddd-font-primary));
          font-size: var(--ddd-font-size-s);
          line-height: var(--ddd-lh-120);
          margin: var(--ddd-spacing-0);
        }
        .words {
          flex: 1 1 auto;
          font-size: var(--ddd-font-size-5xs);
          line-height: var(--ddd-lh-140);
        }
        ::slotted(p) {
          margin: var(--ddd-spacing-0);
        }
        .button {
          align-self: flex-start;
        }
        :host {
          transition:
            transform 0.15s ease-out,
            box-shadow 0.15s ease-out;
        }
        :host(:hover),
        :host(:focus-within) {
          transform: translateY(calc(var(--ddd-spacing-1) * -1));
          box-shadow: var(--ddd-spacing-2) var(--ddd-spacing-2)
            var(--ddd-spacing-0) var(--hm-shade, var(--hm-ink));
        }
        /* the way in lights up with the card, so it reads as a button */
        :host(:hover) a.button,
        :host(:focus-within) a.button {
          color: var(--hm-on-accent, var(--hm-ink));
          background-color: var(--hm-accent, var(--hm-surface));
          box-shadow: var(--ddd-spacing-1) var(--ddd-spacing-1)
            var(--ddd-spacing-0) var(--hm-edge, var(--hm-ink));
        }
        @media (prefers-reduced-motion: reduce) {
          :host {
            transition: none;
          }
          :host(:hover),
          :host(:focus-within) {
            transform: none;
          }
        }
      `,
    ];
  }
  render() {
    const link = safeLink(this.link);
    const color = /^[a-zA-Z0-9]+$/.test(this.color) ? this.color : "skyLight";
    return html`
      <div
        class="stage"
        style="--stage: var(--ddd-theme-default-${color})"
        aria-hidden="true"
      >
        <rpg-character
          preset="${this.preset}"
          seed="${this.seed || this.name}"
          height="142"
          width="113"
          ?walking="${this._walk}"
        ></rpg-character>
      </div>
      <div class="body">
        <h3>${this.name}</h3>
        <div class="words"><slot></slot></div>
        ${
          link && this.label
            ? html`<a class="button" href="${link}">${this.label}</a>`
            : ``
        }
      </div>
    `;
  }
}
globalThis.customElements.define(HaxCastMember.tag, HaxCastMember);

/**
 * `hax-pillar`
 * `One of the seven pillars: name, phrase, icon and why it matters`
 * @element hax-pillar
 */
class HaxPillar extends DDD {
  static get tag() {
    return "hax-pillar";
  }
  static get properties() {
    return {
      ...super.properties,
      label: { type: String },
      phrase: { type: String },
      icon: { type: String },
      /** DDD color name for the pillar's cap */
      color: { type: String },
      /** which pillar this is, 1 to 7 */
      order: { type: Number },
      /** small card with no description, for a strip of all seven */
      compact: { type: Boolean, reflect: true },
      link: { type: String },
    };
  }
  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }
  constructor() {
    super();
    this.label = "";
    this.phrase = "";
    this.icon = "";
    this.color = "beaverBlue";
    this.order = 0;
    this.compact = false;
    this.link = "";
  }
  static get styles() {
    return [
      super.styles,
      marketingTokens,
      css`
        :host {
          display: grid;
          grid-template-columns: minmax(120px, 200px) 1fr;
          border: var(--ddd-border-size-md) solid var(--hm-edge, var(--hm-ink));
          border-radius: var(--ddd-radius-lg);
          background-color: var(--hm-surface);
          overflow: hidden;
          margin: var(--ddd-spacing-6) var(--ddd-spacing-0);
        }
        .cap {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-6) var(--ddd-spacing-3);
          min-height: var(--ddd-spacing-24);
          box-sizing: border-box;
          border-inline-end: var(--ddd-border-size-md) solid
            var(--hm-edge, var(--hm-ink));
          background-color: var(--hm-soft);
          border-top: var(--ddd-spacing-4) solid var(--cap);
          border-bottom: var(--ddd-spacing-4) solid var(--cap);
        }
        simple-icon-lite {
          --simple-icon-height: var(--ddd-icon-xl);
          --simple-icon-width: var(--ddd-icon-xl);
          color: var(--hm-ink);
        }
        .num {
          font-family: var(--ddd-font-heading, var(--ddd-font-primary));
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
        }
        .body {
          padding: var(--ddd-spacing-6);
        }
        h2,
        h3 {
          font-family: var(--ddd-font-heading, var(--ddd-font-primary));
          font-size: var(--ddd-font-size-m);
          line-height: var(--ddd-lh-120);
          margin: var(--ddd-spacing-0);
        }
        .phrase {
          font-size: var(--ddd-font-size-xs);
          font-weight: var(--ddd-font-weight-bold);
          line-height: var(--ddd-lh-140);
          margin: var(--ddd-spacing-2) var(--ddd-spacing-0);
        }
        .words {
          font-size: var(--ddd-font-size-3xs);
          line-height: var(--ddd-lh-150);
        }
        ::slotted(p) {
          margin: var(--ddd-spacing-2) var(--ddd-spacing-0) var(--ddd-spacing-0);
        }
        :host([compact]) {
          grid-template-columns: 1fr;
          grid-template-rows: auto 1fr;
          margin: var(--ddd-spacing-0);
          height: 100%;
        }
        /* each pillar's icon has its own small move on hover and focus */
        :host([compact]) simple-icon-lite {
          transition: filter 0.2s ease;
        }
        :host([compact]:hover) simple-icon-lite,
        :host([compact]:focus-within) simple-icon-lite {
          animation: var(--pillar-move, pillar-pop) 0.7s ease-in-out;
          filter: drop-shadow(0 0 6px var(--cap));
        }
        @keyframes pillar-pop {
          50% {
            transform: scale(1.25);
          }
        }
        @keyframes pillar-spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes pillar-shake {
          20%,
          60% {
            transform: translateX(-4px) rotate(-8deg);
          }
          40%,
          80% {
            transform: translateX(4px) rotate(8deg);
          }
        }
        @keyframes pillar-bounce {
          30% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(2px);
          }
        }
        @keyframes pillar-tilt {
          50% {
            transform: rotate(-20deg) scale(1.15);
          }
        }
        @keyframes pillar-flip {
          to {
            transform: rotateY(360deg);
          }
        }
        @keyframes pillar-grow {
          50% {
            transform: scale(1.3) translateY(-4px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          :host([compact]:hover) simple-icon-lite,
          :host([compact]:focus-within) simple-icon-lite {
            animation: none;
          }
        }
        :host([compact]) a {
          text-decoration: none;
        }
        :host([compact]) a::after {
          content: "";
          position: absolute;
          inset: 0;
        }
        :host([compact]) {
          position: relative;
        }
        :host([compact]) .cap {
          border-inline-end: none;
          border-bottom: var(--ddd-border-size-md) solid
            var(--hm-edge, var(--hm-ink));
          padding: var(--ddd-spacing-4) var(--ddd-spacing-2);
        }
        :host([compact]) .body {
          padding: var(--ddd-spacing-3);
        }
        :host([compact]) h3 {
          font-size: var(--ddd-font-size-3xs);
          overflow-wrap: anywhere;
        }
        :host([compact]) .phrase {
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-regular);
        }
        a {
          color: inherit;
          display: inline-block;
          min-height: var(--ddd-spacing-6);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-0);
        }
        @media (max-width: 560px) {
          :host {
            grid-template-columns: 1fr;
          }
          .cap {
            flex-direction: row;
            border-inline-end: none;
            border-bottom: var(--ddd-border-size-md) solid
              var(--hm-edge, var(--hm-ink));
            border-top-width: var(--ddd-spacing-3);
            padding: var(--ddd-spacing-3);
          }
          .cap {
            border-bottom-width: var(--ddd-border-size-md);
            border-bottom-color: var(--hm-ink);
          }
        }
      `,
    ];
  }
  render() {
    const color = /^[a-zA-Z0-9]+$/.test(this.color) ? this.color : "beaverBlue";
    const link = safeLink(this.link);
    const title = link ? html`<a href="${link}">${this.label}</a>` : this.label;
    return html`
      <div
        class="cap"
        style="--cap: var(--ddd-theme-default-${color}); --pillar-move: pillar-${
          ["pop", "spin", "shake", "bounce", "tilt", "flip", "grow"][
            (Math.max(1, this.order) - 1) % 7
          ]
        }"
        aria-hidden="true"
      >
        <simple-icon-lite icon="${this.icon}"></simple-icon-lite>
        ${
          this.order && !this.compact
            ? html`<span class="num">${this.order} of 7</span>`
            : ``
        }
      </div>
      <div class="body">
        ${this.compact ? html`<h3>${title}</h3>` : html`<h2>${title}</h2>`}
        <p class="phrase">${this.phrase}</p>
        ${this.compact ? `` : html`<div class="words"><slot></slot></div>`}
      </div>
    `;
  }
}
globalThis.customElements.define(HaxPillar.tag, HaxPillar);

/**
 * `hax-pillar-strip`
 * `A row for compact hax-pillar cards`
 * @element hax-pillar-strip
 */
class HaxPillarStrip extends DDD {
  static get tag() {
    return "hax-pillar-strip";
  }

  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(128px, 1fr));
          gap: var(--ddd-spacing-3);
          margin: var(--ddd-spacing-8) var(--ddd-spacing-0);
        }
      `,
    ];
  }
  render() {
    return html`<slot></slot>`;
  }
}
globalThis.customElements.define(HaxPillarStrip.tag, HaxPillarStrip);

/**
 * `hax-feature-row`
 * `A screen of the real product beside what it means for you`
 * @element hax-feature-row
 */
class HaxFeatureRow extends DDD {
  static get tag() {
    return "hax-feature-row";
  }
  static get properties() {
    return {
      ...super.properties,
      /** small label above the heading */
      eyebrow: { type: String },
      heading: { type: String },
      image: { type: String },
      alt: { type: String },
      /** picture on the right instead of the left */
      flip: { type: Boolean, reflect: true },
      /** DDD color name for the shadow behind the screen */
      color: { type: String },
    };
  }
  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }
  constructor() {
    super();
    this.eyebrow = "";
    this.heading = "";
    this.image = "";
    this.alt = "";
    this.flip = false;
    this.color = "";
  }
  static get styles() {
    return [
      super.styles,
      marketingTokens,
      css`
        :host {
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
          gap: var(--ddd-spacing-10);
          align-items: center;
          margin: var(--ddd-spacing-16) var(--ddd-spacing-0);
        }
        :host([flip]) .screen {
          order: 2;
        }
        .screen {
          border: var(--ddd-border-size-md) solid var(--hm-edge, var(--hm-ink));
          border-radius: var(--ddd-radius-lg);
          overflow: hidden;
          background-color: var(--hm-surface);
          box-shadow: var(--ddd-spacing-3) var(--ddd-spacing-3)
            var(--ddd-spacing-0) var(--shade);
        }
        .chrome {
          display: flex;
          gap: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          border-bottom: var(--ddd-border-size-md) solid
            var(--hm-edge, var(--hm-ink));
          background-color: var(--hm-soft);
        }
        .chrome span {
          width: var(--ddd-spacing-3);
          height: var(--ddd-spacing-3);
          border-radius: 50%;
          border: var(--ddd-border-size-sm) solid var(--hm-edge, var(--hm-ink));
        }
        img {
          display: block;
          width: 100%;
          height: auto;
        }
        .eyebrow {
          font-family: var(--ddd-font-navigation, var(--ddd-font-primary));
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin: var(--ddd-spacing-0) var(--ddd-spacing-0) var(--ddd-spacing-2);
        }
        h2 {
          font-family: var(--ddd-font-heading, var(--ddd-font-primary));
          font-size: clamp(
            var(--ddd-font-size-m),
            3.2vw,
            var(--ddd-font-size-xl)
          );
          line-height: var(--ddd-lh-120);
          margin: var(--ddd-spacing-0) var(--ddd-spacing-0) var(--ddd-spacing-3);
        }
        .words {
          font-size: var(--ddd-font-size-xs);
          line-height: var(--ddd-lh-150);
        }
        ::slotted(p) {
          margin: var(--ddd-spacing-0) var(--ddd-spacing-0) var(--ddd-spacing-3);
        }
        @media (max-width: 760px) {
          :host {
            grid-template-columns: 1fr;
            gap: var(--ddd-spacing-6);
            margin: var(--ddd-spacing-10) var(--ddd-spacing-0);
          }
          :host([flip]) .screen {
            order: 0;
          }
          .screen {
            box-shadow: var(--ddd-spacing-2) var(--ddd-spacing-2)
              var(--ddd-spacing-0) var(--shade);
            margin-inline-end: var(--ddd-spacing-2);
          }
        }
      `,
    ];
  }
  render() {
    // a named DDD color wins; otherwise the shadow follows the site palette
    const shade = /^[a-zA-Z0-9]+$/.test(this.color)
      ? `var(--ddd-theme-default-${this.color})`
      : this.flip
        ? "var(--hm-shade-2, var(--ddd-theme-default-pughBlue))"
        : "var(--hm-shade, var(--ddd-theme-default-keystoneYellow))";
    return html`
      <div class="screen" style="--shade: ${shade}">
        <div class="chrome" aria-hidden="true">
          <span></span><span></span><span></span>
        </div>
        <img src="${this.image}" alt="${this.alt}" loading="lazy" />
      </div>
      <div>
        ${this.eyebrow ? html`<p class="eyebrow">${this.eyebrow}</p>` : ``}
        <h2>${this.heading}</h2>
        <div class="words"><slot></slot></div>
      </div>
    `;
  }
}
globalThis.customElements.define(HaxFeatureRow.tag, HaxFeatureRow);

/**
 * `hax-stat-strip`
 * `A row of hax-stat numbers`
 * @element hax-stat-strip
 */
class HaxStatStrip extends DDD {
  static get tag() {
    return "hax-stat-strip";
  }

  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }
  static get styles() {
    return [
      super.styles,
      marketingTokens,
      css`
        :host {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
          border: var(--ddd-border-size-md) solid var(--hm-edge, var(--hm-ink));
          border-radius: var(--ddd-radius-lg);
          background-color: var(--hm-edge, var(--hm-ink));
          gap: var(--ddd-border-size-md);
          overflow: hidden;
          margin: var(--ddd-spacing-10) var(--ddd-spacing-0);
        }
      `,
    ];
  }
  render() {
    return html`<slot></slot>`;
  }
}
globalThis.customElements.define(HaxStatStrip.tag, HaxStatStrip);

/**
 * `hax-stat`
 * `One number that counts up, what it counts, and the story behind it`
 * @element hax-stat
 */
class HaxStat extends DDD {
  static get tag() {
    return "hax-stat";
  }
  static get properties() {
    return {
      ...super.properties,
      /** the number to count up to; leave out for words such as "$0" */
      end: { type: Number },
      /** where the count starts */
      start: { type: Number },
      /** shown before and after the number */
      prefix: { type: String },
      suffix: { type: String },
      /** shown instead of a counted number */
      value: { type: String },
      label: { type: String },
      /** address of the story on hax.cloud */
      story: { type: String },
      /**
       * groups thousands with this mark (for example ","); none by default,
       * so a year such as 2016 never reads as 2,016
       */
      separator: { type: String },
    };
  }
  constructor() {
    super();
    this.end = null;
    this.start = 0;
    this.prefix = "";
    this.suffix = "";
    this.value = "";
    this.label = "";
    this.story = "";
    this.separator = "";
  }
  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }
  static get styles() {
    return [
      super.styles,
      marketingTokens,
      css`
        :host {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1);
          background-color: var(--hm-surface);
          padding: var(--ddd-spacing-4) var(--ddd-spacing-5);
        }
        .big {
          display: block;
          font-family: var(--ddd-font-heading, var(--ddd-font-primary));
          font-weight: var(--ddd-font-weight-bold);
          font-size: var(--ddd-font-size-xl);
          line-height: var(--ddd-lh-120);
        }
        count-up {
          display: inline-block;
          --count-up-color: inherit;
          /* the number sits in a sentence here, so count-up's rule above it is not drawn */
          --ddd-accent-color: transparent;
          font: inherit;
        }
        .label {
          flex: 1 1 auto;
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-140);
        }
      `,
    ];
  }
  render() {
    const counted = typeof this.end === "number" && !Number.isNaN(this.end);
    return html`
      <span class="big"
        >${
          counted
            ? html`${this.prefix}<count-up
                  start="${this.start}"
                  end="${this.end}"
                  duration="2"
                  separator="${this.separator || ""}"
                ></count-up
                >${this.suffix}`
            : this.value
        }</span
      >
      <span class="label">${this.label}</span>
      ${
        this.story
          ? html`<hax-story-link
              compact
              story="${this.story}"
              about="${this.label}"
            ></hax-story-link>`
          : ``
      }
    `;
  }
}
globalThis.customElements.define(HaxStat.tag, HaxStat);

/**
 * `hax-versus`
 * `A heading and words on one side, a head-to-head button on the other`
 *
 * Two rpg-characters face each other over the button and butt heads when it
 * is hovered or focused. On a phone the button drops under the words.
 *
 * @element hax-versus
 */
class HaxVersus extends DDD {
  static get tag() {
    return "hax-versus";
  }
  static get properties() {
    return {
      ...super.properties,
      heading: { type: String },
      link: { type: String },
      label: { type: String },
      /** rpg-character seeds for the two sides */
      left: { type: String },
      right: { type: String },
    };
  }
  constructor() {
    super();
    this.heading = "";
    this.link = "";
    this.label = "";
    this.left = "hax";
    this.right = "everyone else";
  }
  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }
  static get styles() {
    return [
      super.styles,
      marketingTokens,
      css`
        :host {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: var(--ddd-spacing-8);
          align-items: center;
          margin: var(--ddd-spacing-16) var(--ddd-spacing-0)
            var(--ddd-spacing-8);
          padding: var(--ddd-spacing-6);
          border: var(--ddd-border-size-md) solid var(--hm-edge, var(--hm-ink));
          border-radius: var(--ddd-radius-lg);
          background-color: var(--hm-soft);
        }
        h2 {
          font-family: var(--ddd-font-heading, var(--ddd-font-primary));
          font-size: clamp(
            var(--ddd-font-size-m),
            3.2vw,
            var(--ddd-font-size-xl)
          );
          line-height: var(--ddd-lh-120);
          margin: var(--ddd-spacing-0) var(--ddd-spacing-0) var(--ddd-spacing-2);
        }
        .words {
          font-size: var(--ddd-font-size-xs);
          line-height: var(--ddd-lh-150);
        }
        ::slotted(p) {
          margin: var(--ddd-spacing-0);
        }
        .go {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--ddd-spacing-2);
          text-decoration: none;
          color: inherit;
          border-radius: var(--ddd-radius-md);
          padding: var(--ddd-spacing-2);
        }
        .ring {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          line-height: 0;
        }
        .ring rpg-character {
          transition: transform 0.2s ease-out;
        }
        .ring rpg-character:last-child {
          transform: scaleX(-1);
        }
        .go:hover .ring rpg-character:first-child,
        .go:focus-visible .ring rpg-character:first-child {
          animation: butt-left 0.6s ease-in-out infinite;
        }
        .go:hover .ring rpg-character:last-child,
        .go:focus-visible .ring rpg-character:last-child {
          animation: butt-right 0.6s ease-in-out infinite;
        }
        @keyframes butt-left {
          0%,
          100% {
            transform: translateX(-6px) rotate(0deg);
          }
          50% {
            transform: translateX(14px) rotate(14deg);
          }
        }
        @keyframes butt-right {
          0%,
          100% {
            transform: scaleX(-1) translateX(-6px) rotate(0deg);
          }
          50% {
            transform: scaleX(-1) translateX(14px) rotate(14deg);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .go:hover .ring rpg-character,
          .go:focus-visible .ring rpg-character {
            animation: none !important;
          }
        }
        .pill {
          font-weight: var(--ddd-font-weight-bold);
          font-size: var(--ddd-font-size-3xs);
          color: var(--hm-on-brand, var(--hm-surface));
          background-color: var(--hm-brand, var(--hm-ink));
          border: var(--ddd-border-size-md) solid var(--hm-edge, var(--hm-ink));
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-3) var(--ddd-spacing-5);
          text-align: center;
        }
        .go:hover .pill {
          color: var(--hm-ink);
          background-color: var(--hm-surface);
        }
        @media (max-width: 720px) {
          :host {
            grid-template-columns: 1fr;
            gap: var(--ddd-spacing-4);
            padding: var(--ddd-spacing-4);
          }
          .go {
            align-items: flex-start;
          }
        }
      `,
    ];
  }
  render() {
    const link = safeLink(this.link);
    return html`
      <div>
        <h2>${this.heading}</h2>
        <div class="words"><slot></slot></div>
      </div>
      ${
        link && this.label
          ? html`<a class="go" href="${link}">
              <span class="ring" aria-hidden="true">
                <rpg-character
                  seed="${this.left}"
                  height="96"
                  width="76"
                ></rpg-character>
                <rpg-character
                  seed="${this.right}"
                  height="96"
                  width="76"
                ></rpg-character>
              </span>
              <span class="pill">${this.label}</span>
            </a>`
          : ``
      }
    `;
  }
}
globalThis.customElements.define(HaxVersus.tag, HaxVersus);

/**
 * `hax-chip`
 * `A small labelled icon, for lists of formats, tools and places`
 * @element hax-chip
 */
class HaxChip extends DDD {
  static get tag() {
    return "hax-chip";
  }
  static get properties() {
    return {
      ...super.properties,
      icon: { type: String },
      label: { type: String },
    };
  }
  constructor() {
    super();
    this.icon = "";
    this.label = "";
  }
  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }
  static get styles() {
    return [
      super.styles,
      marketingTokens,
      css`
        :host {
          display: inline-flex;
          align-items: center;
          vertical-align: middle;
          min-height: var(--ddd-spacing-8);
          box-sizing: border-box;
          gap: var(--ddd-spacing-2);
          margin: var(--ddd-spacing-1);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-3);
          border: var(--ddd-border-size-sm) solid var(--hm-edge, var(--hm-ink));
          border-radius: 999px;
          background-color: var(--hm-surface);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          line-height: var(--ddd-lh-140);
        }
        simple-icon-lite {
          --simple-icon-height: var(--ddd-icon-xxs);
          --simple-icon-width: var(--ddd-icon-xxs);
        }
      `,
    ];
  }
  render() {
    return html`${
      this.icon
        ? html`<simple-icon-lite
            icon="${this.icon}"
            aria-hidden="true"
          ></simple-icon-lite>`
        : ``
    }${this.label}`;
  }
}
globalThis.customElements.define(HaxChip.tag, HaxChip);

export {
  HaxCast,
  HaxCastMember,
  HaxPillar,
  HaxPillarStrip,
  HaxFeatureRow,
  HaxStatStrip,
  HaxStat,
  HaxVersus,
  HaxChip,
  safeLink,
};

/**
 * Copyright 2023 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { DDDAccentMap } from "@haxtheweb/d-d-d/lib/DDDAccent.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";

// background each preset sets; shown through --page-section-preset-bg so
// it gets a dark pair while the saved bg value stays the same
const PRESET_BG = {
  antihero: "var(--ddd-theme-default-limestoneLight)",
  video: "var(--ddd-theme-default-limestoneLight)",
  "antihero-light": "var(--ddd-theme-default-slateMaxLight)",
  lines: "var(--ddd-theme-default-white)",
};
/**
 * `page-section`
 * `A well designed section of a page with many options for marketing purposes`
 * @demo demo/index.html
 * @element page-section
 */
class PageSection extends I18NMixin(DDD) {
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.AbortControllers = new AbortController();
    this.filter = false;
    this.fold = false;
    this.full = false;
    this.scroller = false;
    this.bg = null;
    this.image = null;
    this.accentColor = "blue";
    this.preset = null;
    this.anchor = null;
    // bg / image as the author set them, restored when the preset goes
    // back to custom; and the last values a preset wrote
    this.__authoredBg = null;
    this.__authoredImage = null;
    this.__presetBg = null;
    this.__presetImage = null;
    this.t = {
      scrollerLabel: "Scroll to reveal content",
    };
    this.registerLocalization({
      context: this,
      basePath: import.meta.url,
    });
    // translated default; an authored scroller-label still wins
    this.i18nDefault("scrollerLabel", "scrollerLabel");
  }

  static get properties() {
    return {
      ...super.properties,
      anchor: { type: String },
      scrollerLabel: { type: String, attribute: "scroller-label" },
      filter: { type: Boolean, reflect: true },
      fold: { type: Boolean, reflect: true },
      full: { type: Boolean, reflect: true },
      scroller: { type: Boolean, reflect: true },
      bg: { type: String },
      image: { type: String, reflect: true },
      preset: { type: String, reflect: true },
    };
  }
  /**
   * LitElement style callback
   */
  static get styles() {
    // support for using in other classes
    let styles = [];
    if (super.styles) {
      styles = super.styles;
    }
    return [
      styles,
      css`
        :host {
          display: block;
          /* the page colour: the fold wedge is drawn in it so it blends
             into the page in either colour scheme */
          --page-section-fold-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          --page-section-image-veil: transparent;
        }

        /** presets: each background gets a dark pair */
        :host([preset="antihero"]),
        :host([preset="video"]) {
          --page-section-preset-bg: light-dark(
            var(--ddd-theme-default-limestoneLight),
            color-mix(
              in srgb,
              var(--ddd-theme-default-slateGray) 22%,
              var(--ddd-theme-default-potentialMidnight)
            )
          );
        }
        :host([preset="antihero-light"]) {
          --page-section-preset-bg: light-dark(
            var(--ddd-theme-default-slateMaxLight),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        :host([preset="lines"]) {
          --page-section-preset-bg: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        /* the preset textures are light; in dark mode a veil over them
           keeps the pattern at low contrast */
        :host([preset="antihero"]),
        :host([preset="lines"]) {
          --page-section-image-veil: light-dark(
            transparent,
            color-mix(
              in srgb,
              var(--ddd-theme-default-potentialMidnight) 82%,
              transparent
            )
          );
        }
        :host([preset="antihero"]) section div.text ::slotted(h1),
        :host([preset="antihero"]) section div.text ::slotted(h2),
        :host([preset="antihero"]) section div.text ::slotted(h3) {
          color: light-dark(
            var(--ddd-theme-default-beaverBlue),
            var(--ddd-theme-default-pughBlue)
          );
        }
        :host([image][preset="antihero"]) .scroller,
        :host([image][preset="antihero"]) section div ::slotted(p) {
          color: light-dark(
            var(--ddd-theme-default-beaverBlue),
            var(--ddd-theme-default-skyLight)
          );
        }
        /** lines add texture to blank bg */
        :host([preset="lines"]) section div.text ::slotted(h1),
        :host([preset="lines"]) section div.text ::slotted(h2),
        :host([preset="lines"]) section div.text ::slotted(h3) {
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }
        :host([image][preset="lines"]) .scroller,
        :host([image][preset="lines"]) section div ::slotted(p) {
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }
        /** video can allow visualization to go beyond readability limit bc its watching */

        :host([preset="video"]) .content {
          max-width: 1440px;
        }

        :host([preset="video"]) section div.text ::slotted(video-player) {
          --video-player-color: var(--ddd-theme-default-white);
          --video-player-bg-color: var(--ddd-theme-default-nittanyNavy);
          --video-player-border-color: var(--ddd-theme-default-limestoneLight);
          --video-player-caption-color: var(--ddd-theme-default-white);
          --video-player-hover-color: var(--ddd-theme-default-inventOrange);
          --video-player-hover-bg-color: var(--ddd-theme-default-beaver80);
          --video-player-accent-color: var(--ddd-theme-default-inventOrange);
          --video-player-faded-accent-color: var(--ddd-theme-default-beaver80);
          --video-player-disabled-color: var(--ddd-theme-default-disabled);

          color: var(--ddd-theme-default-beaverBlue);
          font-family: var(--ddd-font-navigation);
        }

        .section {
          height: var(--page-section-height, 100%);
          padding: var(--page-section-padding, 0 var(--ddd-spacing-25));
          position: relative;
          background-position: 50%;
          background-size: cover;
          transition: background-color 1s linear;
        }
        /* veil over the background image (preset textures in dark mode);
           painted above the background, under the content */
        :host([image]) .section {
          box-shadow: inset 0 0 0 100vmax var(--page-section-image-veil);
        }
        :host([full]) .section {
          height: 100vh;
        }

        .content {
          display: flex;
          flex-flow: column;
          justify-content: center;
          height: 100%;
          position: relative;
          z-index: 3;
          padding: var(--page-section-content-padding, 0 15%);
          width: var(--page-section-content-width, 70%);
          max-width: var(--page-section-content-max-width, 1080px);
          margin: 0 auto;
        }

        :host([image]) .scroller {
          color: var(--simple-colors-default-theme-accent-1);
        }
        :host([image][dark]) .scroller {
          color: var(--simple-colors-default-theme-accent-12);
        }
        :host([fold]) .scroller {
          margin-top: calc(var(--ddd-spacing-20) * -1);
        }
        .scroller {
          position: relative;
          margin: 0 auto;
          --simple-icon-width: var(--ddd-icon-xs);
          --simple-icon-height: var(--ddd-icon-xs);
          color: light-dark(
            var(--simple-colors-default-theme-accent-12),
            var(--ddd-theme-default-white)
          );
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          width: var(--ddd-icon-lg);
          height: var(--ddd-icon-lg);
          margin-top: calc(var(--ddd-icon-lg) * -1);
          border: var(--ddd-border-xs);
          border-color: color-mix(in srgb, currentColor 60%, transparent);
          border-radius: var(--ddd-radius-circle);
          background-color: var(--ddd-theme-default-potential0);
          z-index: 11;
          transition: var(--ddd-duration-normal, 0.3s) background-color
            ease-in-out;
          /* a few bounces to hint, then it rests */
          animation: fullwidth-header-bounce 2.8s ease-out 3;
        }
        :host([image]) .scroller {
          background-color: color-mix(
            in srgb,
            var(--ddd-theme-default-potentialMidnight) 35%,
            transparent
          );
        }
        .scroller:focus-within,
        .scroller:focus,
        .scroller:hover {
          border-color: currentColor;
          background-color: color-mix(in srgb, currentColor 15%, transparent);
        }
        @media (prefers-reduced-motion: reduce) {
          .scroller {
            animation: none;
            transition: none;
          }
        }

        @keyframes fullwidth-header-bounce {
          0% {
            transform: translateY(0%);
          }
          12.5% {
            transform: translateY(20%);
          }
          25% {
            transform: translateY(0%);
          }
        }

        simple-tooltip {
          --simple-tooltip-font-size: var(
            --page-section-tooltip-font-size,
            var(--ddd-font-size-s, 16px)
          );
          --simple-tooltip-background: var(
            --page-section-tooltip-background,
            #000000
          );
          --simple-tooltip-opacity: var(--page-section-tooltip-opacity, 0.8);
          --simple-tooltip-text-color: var(
            --page-section-tooltip-text-color,
            white
          );
          --simple-tooltip-delay-in: var(--page-section-tooltip-delay-in, 300);
          --simple-tooltip-delay-out: var(--page-section-tooltip-delay-out, 0);
          --simple-tooltip-duration-in: var(
            --page-section-tooltip-duration-in,
            300
          );
          --simple-tooltip-duration-out: var(
            --page-section-tooltip-duration-out,
            0
          );
        }

        .fold {
          fill: var(--page-section-fold-color);
          bottom: -1px; /* ensures no line clip on smaller devices */
          height: var(--ddd-spacing-25);
          z-index: 10;
          transform: scale(1, 1);
          display: block;
          position: absolute;
          pointer-events: none;
          width: 100%;
          left: 0;
          right: 0;
          margin: 0;
          padding: 0;
          border: 0;
          outline: 0;
          background-color: transparent;
        }

        :host(:not([full])) .section {
          padding-top: var(--ddd-spacing-8);
        }

        :host([fold]:not([full])) .section {
          padding-bottom: var(--ddd-spacing-25);
        }
        :host([scroller]:not([full])) .content {
          padding-bottom: var(--ddd-spacing-25);
        }

        /* Hero styles / types */
        /* @todo add a variable for 'type' of section and to enforce it via reflection here */
        /* specific tag support to react to light dom and force setting */
        :host([large]) section div.text ::slotted(p) {
          font-size: var(--ddd-font-size-m) !important;
        }
        :host([large]) section div.text ::slotted(h1),
        :host([large]) section div.text ::slotted(h2),
        :host([large]) section div.text ::slotted(h3) {
          font-size: var(--ddd-font-size-xxl) !important;
        }

        :host section div.buttons ::slotted(*) {
          margin: 0;
          padding: 0;
        }

        :host section div ::slotted(p) {
          font-size: var(--ddd-font-size-s) !important;
        }
        :host section div ::slotted(hr) {
          border-top-color: var(--ddd-theme-default-skyBlue) !important;
          width: var(--ddd-spacing-21) !important;
        }
        :host section div ::slotted(h1),
        :host section div ::slotted(h2),
        :host section div ::slotted(h3) {
          font-size: var(--ddd-font-size-xl) !important;
          font-style: normal;
          text-transform: none;
          text-decoration: none;
          padding-bottom: var(--ddd-spacing-2) !important;
          margin: 0 !important;
          margin-top: var(--ddd-spacing-4) !important;
          margin-bottom: var(--ddd-spacing-2) !important;
        }
        :host([image]) section div ::slotted(p),
        :host([image]) section div ::slotted(h1) {
          color: var(--simple-colors-default-theme-accent-1);
        }
        :host([image][dark]) section div ::slotted(p),
        :host([image][dark]) section div ::slotted(h1) {
          color: var(--simple-colors-default-theme-accent-12);
        }

        :host section div.entice {
          display: flex;
        }
        :host section div.entice ::slotted(*) {
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          border-radius: var(--ddd-radius-rounded);
          background-color: color-mix(
            in srgb,
            var(--ddd-theme-default-nittanyNavy) 88%,
            transparent
          );
          box-shadow: inset 0 0 0 1px
            light-dark(transparent, var(--ddd-theme-default-slateGray));
          color: var(--ddd-theme-default-white);
          margin: 0 !important;
          margin-bottom: var(--ddd-spacing-4) !important;
          font-size: var(--ddd-font-size-3xs) !important;
        }

        :host section div ::slotted(grid-plate) {
          --grid-plate-item-margin: var(--ddd-spacing-4);
          --grid-plate-item-padding: var(--ddd-spacing-4);
        }

        @media (max-width: 768px) {
          .section {
            padding: var(--page-section-padding, 0 var(--ddd-spacing-5));
          }
          .content {
            padding: var(--page-section-content-padding, 0 5%);
            width: var(--page-section-content-width, 90%);
          }
          :host([large]) section div.text ::slotted(p) {
            font-size: var(--ddd-font-size-s) !important;
          }
          :host([large]) section div.text ::slotted(h1),
          :host([large]) section div.text ::slotted(h2),
          :host([large]) section div.text ::slotted(h3) {
            font-size: var(--ddd-font-size-l) !important;
          }

          :host section div.buttons ::slotted(*) {
            margin: 0;
            padding: 0;
          }

          :host section div ::slotted(grid-plate) {
            --grid-plate-item-margin: var(--ddd-spacing-1);
            --grid-plate-item-padding: var(--ddd-spacing-1);
          }

          :host section div.entice ::slotted(*) {
            padding: var(--ddd-spacing-1);
            margin-bottom: var(--ddd-spacing-2) !important;
            font-size: var(--ddd-font-size-4xs) !important;
          }

          :host section div ::slotted(h1),
          :host section div ::slotted(h2),
          :host section div ::slotted(h3) {
            font-size: var(--ddd-font-size-m) !important;
          }

          :host section div ::slotted(p) {
            font-size: var(--ddd-font-size-xs) !important;
          }

          :host section div ::slotted(hr) {
            border-top-color: var(--ddd-theme-default-skyBlue) !important;
            width: var(--ddd-spacing-10) !important;
          }
          :host([fold]:not([full])) .section {
            padding-bottom: var(--ddd-spacing-20);
          }
          :host([scroller]:not([full])) .content {
            padding-bottom: var(--ddd-spacing-20);
          }
        }
        @media (max-width: 900px) and (orientation: landscape) {
          .fold {
            height: var(--ddd-spacing-22);
          }
          .scroller {
            --simple-icon-width: var(--ddd-icon-xxs);
            --simple-icon-height: var(--ddd-icon-xxs);
            width: var(--ddd-icon-md);
            height: var(--ddd-icon-md);
            margin-top: calc(var(--ddd-icon-md) * -1);
          }
          :host([fold]) .scroller {
            margin-top: calc(var(--ddd-spacing-15) * -1);
          }
        }
      `,
    ];
  }

  cleanAnchor(anchor) {
    return anchor ? anchor.replace(/[^a-zA-Z]+/g, "").toLowerCase() : "";
  }

  videoPlay(_e) {
    this.__presetBg = "var(--ddd-theme-default-coalyGray)";
    this.bg = this.__presetBg;
  }

  videoPause(_e) {
    this.__presetBg = PRESET_BG.video;
    this.bg = this.__presetBg;
  }

  willUpdate(changedProperties) {
    if (super.willUpdate) {
      super.willUpdate(changedProperties);
    }
    // remember what the author set (not what a preset wrote) so choosing
    // "custom" can give it back
    if (changedProperties.has("bg") && this.bg !== this.__presetBg) {
      this.__authoredBg = this.bg;
    }
    if (changedProperties.has("image") && this.image !== this.__presetImage) {
      this.__authoredImage = this.image;
    }
    // presets force certain design consistency; derive the reactive bg and
    // image state in willUpdate so it batches into the current update cycle
    // instead of scheduling a second one (Lit change-in-update warning)
    if (changedProperties.has("preset") && this.preset) {
      // only the video preset listens for play / pause
      this.AbortControllers.abort();
      this.AbortControllers = new AbortController();
      switch (this.preset) {
        case "antihero":
          this._applyPreset(
            PRESET_BG.antihero,
            new URL("./lib/assets/geo-bkg.png", import.meta.url).href,
          );
          break;
        case "video":
          this._applyPreset(PRESET_BG.video, null);
          this.addEventListener("play", this.videoPlay.bind(this), {
            signal: this.AbortControllers.signal,
          });
          this.addEventListener("pause", this.videoPause.bind(this), {
            signal: this.AbortControllers.signal,
          });
          break;
        case "antihero-light":
          this._applyPreset(PRESET_BG["antihero-light"], null);
          break;
        case "lines":
          this._applyPreset(
            PRESET_BG.lines,
            new URL("./lib/assets/texture-lines.svg", import.meta.url).href,
          );
          break;
        case "custom":
          // give back the author's own values where a preset replaced them
          if (this.__presetBg !== null && this.bg === this.__presetBg) {
            this.bg = this.__authoredBg;
          }
          if (
            this.__presetImage !== null &&
            this.image === this.__presetImage
          ) {
            this.image = this.__authoredImage;
          }
          this.__presetBg = null;
          this.__presetImage = null;
          break;
      }
    }
  }

  _applyPreset(bg, image) {
    this.__presetBg = bg;
    this.__presetImage = image;
    this.bg = bg;
    this.image = image;
  }

  updated(changedProperties) {
    // support for setting ID via an anchor prop which can be used in some designs
    if (
      changedProperties.has("anchor") &&
      this.anchor &&
      this.shadowRoot &&
      !this.getAttribute("id")
    ) {
      this.setAttribute("id", this.cleanAnchor(this.anchor));
    }
  }

  /**
   * The colour bg paints: a preset background shows through its light /
   * dark pair, SimpleColors names (blue, light-blue...) map to the DDD
   * accent palette, anything else (hex, rgb, var()) is used as authored.
   */
  bgColor(bg) {
    if (!bg) {
      return bg;
    }
    if (PRESET_BG[this.preset] && bg === PRESET_BG[this.preset]) {
      return `var(--page-section-preset-bg, ${bg})`;
    }
    const name = String(bg).trim().toLowerCase();
    if (Object.prototype.hasOwnProperty.call(DDDAccentMap, name)) {
      return `var(--ddd-theme-default-${DDDAccentMap[name][0]})`;
    }
    return bg;
  }

  bgStyle(bg, filter, image) {
    const color = `background-color: ${this.bgColor(bg)};`;
    // no image, no url(): url("null") would request a file named null
    if (!image) {
      return filter
        ? `${color}background-image:var(--ddd-theme-default-gradient-antihero);`
        : color;
    }
    const url = `url("${String(image).replace(/["\\\n\r]/g, encodeURIComponent)}")`;
    if (filter) {
      return `${color}background-image:var(--ddd-theme-default-gradient-antihero),${url};`;
    }
    return `${color}background-image: ${url};`;
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`
      <section
        class="section"
        style="${this.bgStyle(this.bg, this.filter, this.image)}"
      >
        <div class="content" part="content">
          <div class="text">
            <slot></slot>
          </div>
          <div class="entice">
            <slot name="entice"></slot>
          </div>
          <div class="buttons">
            <slot name="buttons"></slot>
          </div>
        </div>
        ${
          this.scroller
            ? html`<simple-icon-button-lite
                  class="scroller"
                  icon="icons:arrow-downward"
                  id="scroller"
                  @click="${this.scrollToNextTarget}"
                  label="${this.scrollerLabel}"
                ></simple-icon-button-lite
                ><simple-tooltip for="scroller" position="top"
                  >${this.scrollerLabel}</simple-tooltip
                >`
            : ``
        }
        ${
          this.fold
            ? html`<svg
                class="fold"
                viewBox="0 0 1280 140"
                preserveAspectRatio="none"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M640 139L0 0v140h1280V0L640 139z"></path>
              </svg>`
            : ``
        }
      </section>
    `;
  }

  scrollToNextTarget(_e) {
    const nextTarget = this.nextElementSibling;
    if (nextTarget && nextTarget.scrollIntoView) {
      nextTarget.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
  /**
   * Convention we use
   */
  static get tag() {
    return "page-section";
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
  // implement haxHook to be able to inject the style guide things needed
  // if we can do this on the visualized preset selector then this means
  // we can create a pattern in core for the other core attributes
  /*haxHooks() {
    return {
      setupActiveElementForm: "haxsetupActiveElementForm",
    };
  }*/
  /**
   * @note if we ever wanted to show a preview of the preset, this code would
   * help make that possible
   */
  /*  haxsetupActiveElementForm(props) {
      // get the index of the preset key
      let presetKey = props.settings.configure.findIndex(j => j.property === "preset");
      props.settings.configure[presetKey].itemsList.map(item => {
        item.html = html`<strong>${item.text}</strong>`;
      })
    }
  */
}
globalThis.customElements.define(PageSection.tag, PageSection);
export { PageSection };

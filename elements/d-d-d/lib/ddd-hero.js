/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import {
  FRAMING_SIZES,
  FRAMING_FULL_WIDTHS,
  parseFraming,
  framingSource,
  framingFullUrl,
  framingCutUrl,
  framingCutWidths,
} from "./ImageFraming.js";

// the hero's height at each screen size for each Height setting, and the
// width each size is drawn at, for the frames authors frame against
const HERO_SHAPES = {
  tall: { sm: 320, md: 320, lg: 540, xl: 540 },
  medium: { sm: 320, md: 320, lg: 400, xl: 400 },
  short: { sm: 220, md: 220, lg: 280, xl: 280 },
};
const HERO_WIDTHS = { sm: 390, md: 768, lg: 1280, xl: 1920 };

const VIDEO_TYPES = ["mp4", "webm", "ogg"];
const IMAGE_TYPES = ["png", "jpg", "jpeg", "gif", "webp"];
const FADES = ["blue", "bottom", "none"];
const HEIGHTS = ["short", "medium", "tall"];

/**
 * `ddd-hero`
 * A hero: the look of the HAXcms header banner (site-active-media-banner)
 * as a block an author places in page content: an image, GIF or video with an optional
 * heading and text over it, a fade under the text, and a focal point that
 * keeps the subject in view however the hero is cropped. Works in any
 * theme; full-width breaks out of the content column
 * (haxtheweb/issues#2953, haxtheweb/issues#2976).
 *
 * @demo ../demo/ddd-hero.html
 * @element ddd-hero
 */
export class DDDHero extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "ddd-hero";
  }

  constructor() {
    super();
    this.source = "";
    this.alt = "";
    this.heading = "";
    this.fade = "blue";
    this.textPosition = "bottom";
    this.height = "tall";
    this.fullWidth = false;
    this.focalX = 50;
    this.focalY = 50;
    this.framing = "";
    this.previewSize = "";
    this._editing = false;
    this._cutsFailed = false;
    // background motion starts paused when the visitor asks for less motion
    this.playing = !DDDHero.prefersReducedMotion();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      pauseVideo: "Pause background video",
      playVideo: "Play background video",
      frame: "Frame",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../locales/", import.meta.url).href,
    });
  }

  static prefersReducedMotion() {
    return !!(
      globalThis.matchMedia &&
      globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  static get properties() {
    return {
      ...super.properties,
      /** Image, GIF or video file */
      source: { type: String },
      /** Text alternative for an image; leave empty when it is decorative */
      alt: { type: String },
      /** Heading over the media */
      heading: { type: String },
      /** Fade under the text: blue (the header look), bottom, none */
      fade: { type: String },
      /** Where the text sits: bottom or middle */
      textPosition: { type: String, reflect: true, attribute: "text-position" },
      /** short, medium or tall (the header banner's height) */
      height: { type: String, reflect: true },
      /** Run edge to edge instead of sitting in the content column */
      fullWidth: { type: Boolean, reflect: true, attribute: "full-width" },
      /** Focal point, 0-100 from the left */
      focalX: { type: Number, attribute: "focal-x" },
      /** Focal point, 0-100 from the top */
      focalY: { type: Number, attribute: "focal-y" },
      /**
       * How the photo is framed at each screen size, custom sizes only:
       * JSON of { sm|md|lg|xl: { x, y, w, h } } in fractions of the photo.
       * Edited with the image-framing field; see ImageFraming.js.
       */
      framing: { type: String },
      /**
       * Draw one screen size's framing whatever the screen is (the framing
       * dialog's preview); not saved
       */
      previewSize: { type: String, attribute: "preview-size" },
      playing: { type: Boolean, state: true },
      _hasText: { type: Boolean, state: true },
      _editing: { type: Boolean, state: true },
      _cutsFailed: { type: Boolean, state: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          --ddd-hero-height: 540px;
          /* page styles on ddd-hero override these */
          --ddd-hero-fade-color: rgba(30, 64, 124, 0.7);
          --ddd-hero-max-width: 1080px;
          margin-block: var(--ddd-spacing-6);
        }
        :host([height="medium"]) {
          --ddd-hero-height: 400px;
        }
        :host([height="short"]) {
          --ddd-hero-height: 280px;
        }
        /* edge to edge: 100cqi is the nearest container's width (a theme can
           make its content area the container), else the viewport */
        :host([full-width]) {
          width: 100cqi;
          margin-inline: calc(50% - 50cqi);
        }
        .hero {
          position: relative;
          height: var(--ddd-hero-height);
          width: 100%;
          overflow: hidden;
          z-index: 1;
          border-radius: var(--ddd-radius-sm);
        }
        :host([full-width]) .hero {
          border-radius: var(--ddd-radius-0);
        }
        .hero::before {
          position: absolute;
          content: "";
          inset: var(--ddd-spacing-0);
          z-index: 1;
          pointer-events: none;
        }
        .hero[data-fade="blue"]::before {
          background-color: var(--ddd-hero-fade-color);
        }
        .hero[data-fade="bottom"]::before {
          background: linear-gradient(
            to top,
            rgba(0, 3, 33, 0.82) 0%,
            rgba(0, 3, 33, 0.45) 45%,
            rgba(0, 3, 33, 0) 80%
          );
        }
        picture {
          display: contents;
        }
        img,
        video {
          position: absolute;
          inset: var(--ddd-spacing-0);
          object-fit: cover;
          width: 100%;
          height: 100%;
          z-index: -1;
        }
        .content {
          position: relative;
          z-index: 2;
          height: 100%;
          max-width: var(--ddd-hero-max-width);
          margin: 0 auto;
          padding: 0 var(--ddd-spacing-12);
          display: flex;
          align-items: flex-end;
          color: var(--ddd-theme-default-white);
          box-sizing: border-box;
        }
        :host([text-position="middle"]) .content {
          align-items: center;
        }
        .text {
          width: 80%;
          margin-block-end: var(--ddd-spacing-15);
          font-size: var(--ddd-font-size-s);
          line-height: var(--ddd-lh-150);
        }
        :host([text-position="middle"]) .text {
          margin-block-end: var(--ddd-spacing-0);
        }
        h2 {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-l);
          font-weight: var(--ddd-font-weight-bold);
          line-height: normal;
          margin: 0 0 var(--ddd-spacing-5);
          color: inherit;
        }
        ::slotted(*) {
          color: inherit;
          margin-block: 0 var(--ddd-spacing-2);
        }
        .hero[data-has-control] .content {
          padding-inline-end: calc(48px + 2 * var(--ddd-spacing-4));
        }
        .media-control {
          position: absolute;
          inset-block-end: var(--ddd-spacing-4);
          inset-inline-end: var(--ddd-spacing-4);
          z-index: 3;
          inline-size: 48px;
          block-size: 48px;
          color: var(--ddd-theme-default-white);
          --simple-icon-width: var(--ddd-icon-xxs);
          --simple-icon-height: var(--ddd-icon-xxs);
          --simple-icon-button-border-radius: 100%;
          --simple-icon-button-border: var(--ddd-border-size-sm) solid
            rgba(255, 255, 255, 0.65);
          --simple-icon-button-background-color: rgba(0, 30, 68, 0.8);
          --simple-icon-button-focus-background-color: var(
            --ddd-theme-default-nittanyNavy
          );
          --simple-icon-button-focus-opacity: 1;
          --simple-icon-button-focus-color: var(--ddd-theme-default-white);
        }
        .media-control:focus-within {
          outline: var(--ddd-border-size-md) solid
            var(--ddd-theme-default-keystoneYellow);
          outline-offset: 2px;
        }
        @media only screen and (max-width: 899px) {
          :host,
          :host([height="medium"]) {
            --ddd-hero-height: 320px;
          }
          :host([height="short"]) {
            --ddd-hero-height: 220px;
          }
          .content {
            padding: 0 var(--ddd-spacing-5);
          }
          .text {
            width: 100%;
            margin-block-end: var(--ddd-spacing-6);
            font-size: var(--ddd-font-size-4xs);
          }
          h2 {
            font-size: var(--ddd-font-size-xs);
            margin: 0 0 var(--ddd-spacing-2);
          }
        }
      `,
    ];
  }

  /**
   * The file type of the source, without query or hash
   */
  get mediaType() {
    const ext = String(this.source || "")
      .split(/[?#]/)[0]
      .split(".")
      .pop()
      .toLowerCase();
    if (VIDEO_TYPES.includes(ext)) {
      return "video";
    }
    if (IMAGE_TYPES.includes(ext)) {
      return "image";
    }
    return "";
  }

  /**
   * The frames an author frames this hero against: each screen size with
   * the hero's width and height there (used by the image-framing field)
   */
  framingFrames() {
    const heights = HERO_SHAPES[this.height] || HERO_SHAPES.tall;
    return FRAMING_SIZES.map((size) => ({
      ...size,
      width: HERO_WIDTHS[size.id],
      height: heights[size.id],
    }));
  }

  /**
   * Cuts made by the server, when there can be any: a still image under
   * files/, outside the editor, and none of them failed to load
   */
  _useCuts() {
    return (
      !this._editing &&
      !this.previewSize &&
      !this._cutsFailed &&
      this.mediaType === "image" &&
      !!framingSource(this.source)
    );
  }

  /**
   * CSS that shows custom framings without cuts (in the editor, the dialog
   * preview, or when the cuts are missing): per screen size, the photo is
   * scaled and moved so the framed part fills the hero
   */
  _framingCss(custom) {
    const rule = (r) =>
      `img.photo { width: calc(100% / ${r.w}); height: calc(100% / ${r.h}); left: calc(-100% * ${r.x} / ${r.w}); top: calc(-100% * ${r.y} / ${r.h}); inset-inline-end: auto; inset-block-end: auto; object-position: 50% 50%; }`;
    if (this.previewSize) {
      return custom[this.previewSize] ? rule(custom[this.previewSize]) : "";
    }
    return FRAMING_SIZES.filter((size) => custom[size.id])
      .map((size) => `@media ${size.media} { ${rule(custom[size.id])} }`)
      .join("\n");
  }

  _imgError() {
    // a cut that isn't there (an old static copy, a file added by hand):
    // show the original and frame it with CSS instead
    if (this._useCuts()) {
      this._cutsFailed = true;
    }
  }

  _renderImage(position) {
    const custom = parseFraming(this.framing);
    if (this._useCuts()) {
      const fullSet = FRAMING_FULL_WIDTHS.map(
        (w) => `${framingFullUrl(this.source, w)} ${w}w`,
      ).join(", ");
      return html`<picture>
        ${FRAMING_SIZES.filter((size) => custom[size.id]).map(
          (size) =>
            html`<source
              media="${size.media}"
              srcset="
                ${framingCutWidths(size.id)
                  .map(
                    (w) =>
                      `${framingCutUrl(this.source, size.id, custom[size.id], w)} ${w}w`,
                  )
                  .join(", ")}
              "
              sizes="100vw"
            />`,
        )}
        <img
          class="photo"
          src="${this.source}"
          srcset="${fullSet}"
          sizes="100vw"
          alt="${this.alt || ""}"
          style="object-position: ${position}"
          fetchpriority="high"
          @error="${this._imgError}"
        />
      </picture>`;
    }
    const framingCss = this._framingCss(custom);
    // set as a property: Lit doesn't bind inside style text
    return html`<style .textContent="${framingCss}"></style
      ><img
        class="photo"
        src="${this.source}"
        alt="${this.alt || ""}"
        style="object-position: ${position}"
        fetchpriority="high"
      />`;
  }

  /**
   * The fade actually drawn: with text over the media there is always one,
   * so the text keeps its contrast
   */
  _effectiveFade() {
    const fade = FADES.includes(this.fade) ? this.fade : "blue";
    if (fade === "none" && this._hasText) {
      return "bottom";
    }
    return fade;
  }

  _focalPosition() {
    const clamp = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 50;
    };
    return `${clamp(this.focalX)}% ${clamp(this.focalY)}%`;
  }

  _slotChanged(e) {
    const nodes = e.target.assignedNodes({ flatten: true });
    this._slotHasText = nodes.some(
      (node) =>
        node.nodeType === Node.ELEMENT_NODE ||
        (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== ""),
    );
    this._hasText = !!this.heading || this._slotHasText;
  }

  willUpdate(changed) {
    if (super.willUpdate) {
      super.willUpdate(changed);
    }
    if (changed.has("heading")) {
      this._hasText = !!this.heading || !!this._slotHasText;
    }
    if (!HEIGHTS.includes(this.height)) {
      this.height = "tall";
    }
  }

  _toggleVideo() {
    const video = this.shadowRoot.querySelector("video");
    if (this.playing) {
      if (video) {
        video.pause();
      }
      this.playing = false;
    } else {
      if (video) {
        const p = video.play();
        // a blocked play() rejects; ignore it and leave the button as is
        if (p && p.catch) {
          p.catch(() => {});
        }
      }
      this.playing = true;
    }
  }

  render() {
    const type = this.mediaType;
    const position = this._focalPosition();
    return html`<div
      class="hero"
      part="hero"
      data-fade="${this._effectiveFade()}"
      ?data-has-control="${type === "video"}"
    >
      ${type === "image" ? this._renderImage(position) : ``}
      ${
        type === "video"
          ? html`<video
                loop
                muted
                playsinline
                ?autoplay="${this.playing}"
                aria-hidden="true"
                tabindex="-1"
                style="object-position: ${position}"
              >
                <source
                  src="${this.source}"
                  type="video/${this.source
                    .split(/[?#]/)[0]
                    .split(".")
                    .pop()
                    .toLowerCase()}"
                /></video
              ><simple-icon-button-lite
                class="media-control"
                part="media-control"
                icon="${
                  this.playing
                    ? "av:pause-circle-outline"
                    : "av:play-circle-outline"
                }"
                label="${this.playing ? this.t.pauseVideo : this.t.playVideo}"
                @click="${this._toggleVideo}"
              ></simple-icon-button-lite>`
          : ``
      }
      <div class="content" ?hidden="${!this._hasText}">
        <div class="text" part="text">
          ${this.heading ? html`<h2 part="heading">${this.heading}</h2>` : ``}
          <slot @slotchange="${this._slotChanged}"></slot>
        </div>
      </div>
    </div>`;
  }

  /**
   * HAX hooks this element implements
   */
  haxHooks() {
    return {
      gizmoRegistration: "haxgizmoRegistration",
      editModeChanged: "haxeditModeChanged",
      inlineContextMenu: "haxinlineContextMenu",
    };
  }

  /**
   * In the editor the cuts for a new framing don't exist until the page is
   * saved, so framings are drawn with CSS while editing
   */
  haxeditModeChanged(value) {
    this._editing = !!value;
  }

  /**
   * Frame on the block toolbar, for images: opens the framing dialog (the
   * same one the Framing setting opens)
   */
  haxinlineContextMenu(ceMenu) {
    if (this.mediaType !== "image") {
      return;
    }
    ceMenu.ceButtons = [
      {
        icon: "image:crop",
        callback: "haxFrame",
        label: this.t.frame,
      },
    ];
  }

  haxFrame() {
    globalThis.dispatchEvent(
      new CustomEvent("hax-image-framing-open", {
        detail: { element: this, property: "framing" },
      }),
    );
    return true;
  }

  haxgizmoRegistration(_store) {
    globalThis.dispatchEvent(
      new CustomEvent("i18n-manager-register-element", {
        detail: {
          namespace: `ddd-hero.haxProperties`,
          localesPath: new URL(`../locales`, import.meta.url).href,
        },
      }),
    );
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }
}

globalThis.customElements.define(DDDHero.tag, DDDHero);

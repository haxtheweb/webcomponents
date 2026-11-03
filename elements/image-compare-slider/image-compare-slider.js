import { LitElement, html, css, nothing } from "lit";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";
import { IntersectionObserverMixin } from "@haxtheweb/intersection-element/lib/IntersectionObserverMixin.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import {
  DDDBlockStyles,
  renderDDDBlockHeader,
  canDDDBlockFullscreen,
  isDDDBlockFullscreen,
  toggleDDDBlockFullscreen,
  listenDDDBlockFullscreen,
} from "@haxtheweb/d-d-d/lib/DDDBlock.js";
// this block also uses the webkit prefixed full screen API (Safari)
const WEBKIT = { webkit: true };
/**
 * `image-compare-slider`
 * hax-wired a11y-compare-image, in the DDD block frame: header with a
 * "How to use" panel and full screen, the description, then the
 * comparison with its bottom bar.
 * `dark` inverts the slider controls.
 * @demo demo/index.html
 * @element image-compare-slider
 */
const escapeAttr = (value) =>
  String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

class ImageCompareSlider extends I18NMixin(
  IntersectionObserverMixin(SchemaBehaviors(LitElement)),
) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      DDDBlockStyles,
      css`
        :host {
          display: block;
          /* let light-dark() resolve against the user color scheme */
          color-scheme: light dark;
        }
        :host([hidden]) {
          display: none !important;
        }
        .ddd-block {
          --ddd-block-background: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }
        .ddd-block-title h2 {
          margin: 0;
          font: inherit;
          color: inherit;
        }
        /* the slotted heading is the title line; it keeps its own element
           (and stays editable in HAX) but takes the block title look */
        .ddd-block-title ::slotted(*) {
          margin: 0 !important;
          padding: 0 !important;
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          letter-spacing: normal !important;
          text-transform: none !important;
          color: inherit !important;
        }
        .ddd-block-title[hidden],
        .desc[hidden],
        .help[hidden] {
          display: none;
        }
        .help {
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
          border-bottom: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          background-color: light-dark(
            var(--ddd-theme-default-skyMaxLight),
            var(--ddd-theme-default-nittanyNavy)
          );
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-150);
        }
        .help ul {
          margin: var(--ddd-spacing-1) 0 0;
          padding-inline-start: var(--ddd-spacing-5);
        }
        kbd {
          display: inline-block;
          padding: 0 var(--ddd-spacing-1);
          border: var(--ddd-border-xs);
          border-bottom-width: 2px;
          border-color: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-slateGray)
          );
          border-radius: var(--ddd-radius-xs);
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          font-family: var(--ddd-font-navigation);
          font-size: 0.85em;
          line-height: var(--ddd-lh-140);
        }
        .desc {
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4) 0;
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-150);
        }
        /* page paragraph margins would otherwise win over the slot */
        .desc ::slotted(*) {
          margin-block: 0 !important;
        }
        a11y-compare-image {
          --a11y-compare-image-stage-padding: var(--ddd-spacing-4);
          --a11y-compare-image-stage-radius: var(--ddd-radius-sm);
          --a11y-compare-image-max-width: var(
            --image-compare-slider-max-width,
            100%
          );
          --a11y-compare-image-max-height: var(
            --image-compare-slider-max-height,
            600px
          );
        }
        /* full screen: the frame fills the viewport, the image fills the
           height left over and is never cropped */
        .ddd-block.fs,
        .ddd-block:fullscreen {
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          border: 0;
          border-radius: 0;
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        .ddd-block.fs a11y-compare-image,
        .ddd-block:fullscreen a11y-compare-image {
          flex: 1 1 auto;
          min-height: 0;
        }
      `,
    ];
  }
  constructor() {
    super();
    this.opacity = false;
    this.topAlt = "";
    this.bottomAlt = "";
    this.position = 50;
    this.dark = false;
    this._helpOpen = false;
    this._fullscreen = false;
    this._hasHeading = false;
    this._hasDescription = false;
    this._fullscreenChanged = this._fullscreenChanged.bind(this);
    this.t = {
      slideToCompareImages: "Slide to compare images",
      interactiveImageCompare: "Interactive · Image compare",
      howToUse: "How to use",
      fullScreen: "Full screen",
      exitFullScreen: "Exit full screen",
      wipeHelpLead: "Compare the two images with the divider.",
      wipeHelpPointer:
        "Drag the round handle, or click anywhere on the image to move the divider there.",
      fadeHelpLead: "Fade between the two images.",
      fadeHelpPointer:
        "Drag the slider below the image, or click a point on it.",
      keyboard: "Keyboard",
      moveOnePercent: "move 1%",
      pageUp: "Page Up",
      pageDown: "Page Down",
      moveTenPercent: "move 10%",
      home: "Home",
      end: "End",
      jumpToEitherImage: "jump to either image",
    };
    this.registerLocalization({
      context: this,
      basePath: import.meta.url,
    });
  }
  connectedCallback() {
    super.connectedCallback();
    listenDDDBlockFullscreen(this._fullscreenChanged, true, WEBKIT);
  }
  disconnectedCallback() {
    listenDDDBlockFullscreen(this._fullscreenChanged, false, WEBKIT);
    super.disconnectedCallback();
  }
  /**
   * Full screen is offered only where the browser supports it
   */
  get _canFullscreen() {
    return canDDDBlockFullscreen(WEBKIT);
  }
  _fullscreenChanged() {
    const root = this.shadowRoot;
    const frame = root ? root.querySelector(".ddd-block") : null;
    this._fullscreen = isDDDBlockFullscreen(root, frame, WEBKIT);
  }
  /**
   * Put the block frame in and out of full screen
   */
  _toggleFullscreen() {
    const frame = this.shadowRoot.querySelector(".ddd-block");
    toggleDDDBlockFullscreen(frame, this._fullscreen, WEBKIT);
  }
  _toggleHelp() {
    this._helpOpen = !this._helpOpen;
  }
  /**
   * slotchange bubbles up to the title and description wrappers; empty ones
   * are hidden so the frame never shows a blank row
   */
  _slotChanged(e) {
    const slot = e.target;
    if (!slot || !slot.assignedNodes) {
      return;
    }
    const has = slot
      .assignedNodes({ flatten: true })
      .some(
        (n) =>
          n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim() !== ""),
      );
    if (slot.name === "heading") {
      this._hasHeading = has;
    } else if (slot.name === "description") {
      this._hasDescription = has;
    }
  }
  renderHelp() {
    const t = this.t;
    return html`<div
      class="help"
      id="help"
      part="help"
      ?hidden="${!this._helpOpen}"
    >
      <strong>${this.opacity ? t.fadeHelpLead : t.wipeHelpLead}</strong>
      <ul>
        <li>${this.opacity ? t.fadeHelpPointer : t.wipeHelpPointer}</li>
        <li>
          ${t.keyboard}: <kbd>←</kbd> <kbd>→</kbd> ${t.moveOnePercent},
          <kbd>${t.pageUp}</kbd> / <kbd>${t.pageDown}</kbd> ${t.moveTenPercent},
          <kbd>${t.home}</kbd> / <kbd>${t.end}</kbd>
          ${t.jumpToEitherImage}.
        </li>
      </ul>
    </div>`;
  }
  render() {
    const fsLabel = this._fullscreen
      ? this.t.exitFullScreen
      : this.t.fullScreen;
    return html`<div
      class="ddd-block ${this._fullscreen ? "fs" : ""}"
      part="frame"
      role="group"
      aria-labelledby="hdr"
    >
      ${renderDDDBlockHeader({
        id: "hdr",
        icon: "image:compare",
        label: this.t.interactiveImageCompare,
        after: html`<span
          class="ddd-block-title"
          ?hidden="${!this.title && !this._hasHeading}"
          @slotchange="${this._slotChanged}"
          >${this.title ? html`<h2>${this.title}</h2>` : nothing}<slot
            name="heading"
          ></slot
        ></span>`,
        actions: html`<button
            class="ddd-block-action"
            id="help-toggle"
            type="button"
            aria-expanded="${this._helpOpen ? "true" : "false"}"
            aria-controls="help"
            aria-label="${this.t.howToUse}"
            title="${this.t.howToUse}"
            @click="${this._toggleHelp}"
          >
            <simple-icon-lite
              icon="icons:info-outline"
              aria-hidden="true"
            ></simple-icon-lite>
          </button>
          ${
            this._canFullscreen
              ? html`<button
                  class="ddd-block-action"
                  id="fs-toggle"
                  type="button"
                  aria-label="${fsLabel}"
                  title="${fsLabel}"
                  @click="${this._toggleFullscreen}"
                >
                  <simple-icon-lite
                    icon="${
                      this._fullscreen
                        ? "icons:fullscreen-exit"
                        : "icons:fullscreen"
                    }"
                    aria-hidden="true"
                  ></simple-icon-lite>
                </button>`
              : nothing
          }`,
      })}
      ${this.renderHelp()}
      <div
        class="ddd-block-body desc"
        id="description"
        ?hidden="${!this._hasDescription}"
        @slotchange="${this._slotChanged}"
      >
        <slot name="description"></slot>
      </div>
      ${
        this.elementVisible
          ? html`
              <a11y-compare-image
                label="${this.t.slideToCompareImages}"
                ?dark="${this.dark}"
                ?opacity="${this.opacity}"
                ?fit="${this._fullscreen}"
                position="${this.position}"
                data-pulse
              >
                <img
                  slot="bottom"
                  src="${this.bottomSrc}"
                  alt="${this.bottomAlt}"
                  aria-describedby="${this.bottomDescriptionId || "description"}"
                />
                <img
                  slot="top"
                  src="${this.topSrc}"
                  alt="${this.topAlt}"
                  aria-describedby="${this.topDescriptionId || "description"}"
                />
              </a11y-compare-image>
            `
          : nothing
      }
    </div>`;
  }

  static get tag() {
    return "image-compare-slider";
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * invert the slider controls for a dark surface
       */
      dark: {
        type: Boolean,
        reflect: true,
      },
      /**
       * src for top image
       */
      bottomAlt: {
        type: String,
        attribute: "bottom-alt",
      },
      /**
       * aria-describedby for top image
       */
      bottomDescriptionId: {
        type: String,
        attribute: "bottom-description-id",
      },
      /**
       * src for top image
       */
      bottomSrc: {
        type: String,
        attribute: "bottom-src",
      },
      /**
       * mode for the slider: wipe
       */
      opacity: {
        type: Boolean,
      },
      /**
       * mode for the slider: wipe
       */
      position: {
        type: Number,
      },
      /**
       * @deprecated Use `slot=heading`
       */
      title: {
        type: String,
      },
      /**
       * src for top image
       */
      topAlt: {
        type: String,
        attribute: "top-alt",
      },
      /**
       * aria-describedby for top image
       */
      topDescriptionId: {
        type: String,
        attribute: "top-description-id",
      },
      /**
       * src for top image
       */
      topSrc: {
        type: String,
        attribute: "top-src",
      },
      _helpOpen: { type: Boolean, state: true },
      _fullscreen: { type: Boolean, state: true },
      _hasHeading: { type: Boolean, state: true },
      _hasDescription: { type: Boolean, state: true },
    };
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "elementVisible" && this[propName]) {
        import("@haxtheweb/a11y-compare-image/a11y-compare-image.js");
      }
    });
  }
  /**
   * #3050: a file backing the top or bottom image was modified in place.
   * Refresh the live preview by cache-busting the slotted shadow <img> srcs
   * directly so the persisted `topSrc` / `bottomSrc` properties (and saved
   * content) stay clean.
   */
  haxHooks() {
    return {
      progressiveEnhancement: "haxprogressiveEnhancement",
      editModeChanged: "haxeditModeChanged",
      mediaSourceUpdated: "haxmediaSourceUpdated",
    };
  }
  /**
   * Drop the saved fallback while editing; the hook writes a fresh one on save,
   * so a stale copy is never saved next to it.
   */
  haxeditModeChanged(value) {
    if (value) {
      this.querySelectorAll("[data-prog-fallback]").forEach((node) =>
        node.remove(),
      );
    }
  }
  /**
   * Hook for HAX progressive enhancement: the two images for RSS, bots and
   * readers without JavaScript.
   */
  haxprogressiveEnhancement(_el) {
    return [
      [this.topSrc, this.topAlt],
      [this.bottomSrc, this.bottomAlt],
    ]
      .filter(([src]) => src)
      .map(
        ([src, alt]) =>
          `<img data-prog-fallback src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" loading="lazy" />`,
      )
      .join("\n");
  }
  haxmediaSourceUpdated(path, store) {
    if (!path || !store || typeof store._mediaSrcMatches !== "function") {
      return;
    }
    if (
      !store._mediaSrcMatches(this.topSrc, path) &&
      !store._mediaSrcMatches(this.bottomSrc, path)
    ) {
      return;
    }
    store._pokeMatchingImgs(this.shadowRoot, path);
  }
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}
globalThis.customElements.define(ImageCompareSlider.tag, ImageCompareSlider);
export { ImageCompareSlider };

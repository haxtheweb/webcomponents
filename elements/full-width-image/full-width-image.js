/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
/**
 * `full-width-image`
 * `full width image that flows beyond boundaries`
 *
 * @microcopy - language worth noting:
 *  - images are best used when stretched across content
 *
 * @demo demo/index.html
 * @element full-width-image
 */
class FullWidthImage extends I18NMixin(LitElement) {
  //styles function
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none;
        }

        /* width and positioning are unchanged on purpose: the section keeps
           its existing break out behaviour, only the caption band, toggle
           and spacing are styled here */
        #image {
          left: 0;
          right: 0;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          box-sizing: border-box;
          min-height: calc(var(--ddd-spacing-25, 100px) * 3);
          background-repeat: no-repeat;
          background-position: center center;
          background-size: cover;
          width: 100%;
          text-align: start;
        }

        /* the caption overlay is dismissible (and re-showable) via the
           toggle instead of hiding on hover, so it is dismissible,
           hoverable and persistent per WCAG 1.4.13 */
        #captionToggle {
          position: absolute;
          top: var(--ddd-spacing-3, 12px);
          right: var(--ddd-spacing-3, 12px);
          z-index: 2;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          width: var(--ddd-control-height-sm, 40px);
          height: var(--ddd-control-height-sm, 40px);
          margin: var(--ddd-spacing-0, 0);
          padding: var(--ddd-spacing-0, 0);
          border: var(--ddd-border-xs, 1px solid);
          border-color: color-mix(
            in srgb,
            var(--ddd-theme-default-white, #fff) 50%,
            transparent
          );
          border-radius: var(--ddd-radius-circle, 50%);
          background-color: color-mix(
            in srgb,
            var(--ddd-theme-default-potentialMidnight, #000321) 60%,
            transparent
          );
          color: var(--ddd-theme-default-white, #fff);
          cursor: pointer;
          --simple-icon-color: currentColor;
          --simple-icon-width: var(--ddd-icon-3xs, 20px);
          --simple-icon-height: var(--ddd-icon-3xs, 20px);
          transition: background-color var(--ddd-duration-normal, 0.3s)
            ease-in-out;
        }
        #captionToggle:hover,
        #captionToggle[aria-pressed="true"] {
          background-color: color-mix(
            in srgb,
            var(--ddd-theme-default-potentialMidnight, #000321) 85%,
            transparent
          );
          border-color: var(--ddd-theme-default-white, #fff);
        }
        #captionToggle:focus-visible {
          outline: var(--ddd-border-sm, 2px solid);
          outline-color: var(--ddd-theme-default-white, #fff);
          outline-offset: var(--ddd-spacing-1, 4px);
        }

        /* Nittany Navy scrim behind the caption only, so the image shows */
        .wrapper {
          opacity: 1;
          padding: var(--ddd-spacing-12, 48px) var(--ddd-spacing-6, 24px)
            var(--ddd-spacing-5, 20px);
          background-image: linear-gradient(
            180deg,
            transparent,
            color-mix(
              in srgb,
              var(--ddd-theme-default-nittanyNavy, #001e44) 88%,
              transparent
            )
          );
          transition: var(--ddd-duration-normal, 0.3s) all ease-in-out;
        }
        .wrapper[hidden] {
          display: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .wrapper,
          #captionToggle {
            transition: none;
          }
        }

        .caption {
          font-family: var(--ddd-font-primary, sans-serif);
          font-size: var(
            --full-width-image-font-size,
            var(--ddd-font-size-s, 24px)
          );
          font-weight: var(--ddd-font-weight-medium, 500);
          font-style: normal;
          line-height: var(--ddd-lh-140, 1.4);
          color: var(--ddd-theme-default-white, #fff);
          overflow-wrap: anywhere;
        }

        @media (max-width: 600px) {
          #image {
            min-height: calc(var(--ddd-spacing-25, 100px) * 2.2);
          }
          #captionToggle {
            top: var(--ddd-spacing-2, 8px);
            right: var(--ddd-spacing-2, 8px);
          }
          .wrapper {
            padding: var(--ddd-spacing-10, 40px) var(--ddd-spacing-4, 16px)
              var(--ddd-spacing-4, 16px);
          }
          .caption {
            font-size: var(
              --full-width-image-font-size,
              var(--ddd-font-size-3xs, 18px)
            );
          }
        }
      `,
    ];
  }

  // render function
  render() {
    return html` <div id="image">
      <button
        id="captionToggle"
        type="button"
        aria-pressed="${this.captionHidden ? "true" : "false"}"
        aria-label="${this.t.toggleCaption}"
        title="${this.t.toggleCaption}"
        @click="${this._toggleCaption}"
      >
        <simple-icon-lite
          icon="${
            this.captionHidden ? "icons:visibility" : "icons:visibility-off"
          }"
        ></simple-icon-lite>
      </button>
      <div class="wrapper" id="captionWrapper" ?hidden="${this.captionHidden}">
        <div class="caption">
          ${this.caption}
          <slot></slot>
        </div>
      </div>
    </div>`;
  }

  /**
   * toggles the caption overlay; the caption stays visible and hoverable
   * until it is explicitly dismissed (WCAG 1.4.13)
   */
  _toggleCaption() {
    this.captionHidden = !this.captionHidden;
  }

  /**
   * #3050: a file backing this background image was modified in place. Refresh
   * the live preview by cache-busting the #image background-image style
   * directly so the persisted `source` property (and saved content) stays
   * clean.
   */
  haxHooks() {
    return {
      mediaSourceUpdated: "haxmediaSourceUpdated",
    };
  }
  haxmediaSourceUpdated(path, store) {
    if (!path || !store || typeof store._mediaSrcMatches !== "function") {
      return;
    }
    if (!store._mediaSrcMatches(this.source, path)) return;
    const el = this.shadowRoot && this.shadowRoot.querySelector("#image");
    if (!el) return;
    const base = String(this.source).split("?")[0];
    const ts = Date.now();
    const busted = base + (base.indexOf("?") === -1 ? "?" : "&") + "t=" + ts;
    el.style.backgroundImage = `url("${busted}")`;
  }
  // haxProperty definition
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      toggleCaption: "toggle caption",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
    this.captionHidden = false;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      source: {
        type: String,
        reflect: true,
      },
      caption: {
        type: String,
        reflect: true,
      },
      /**
       * whether the caption overlay has been dismissed
       */
      captionHidden: {
        type: Boolean,
        attribute: "caption-hidden",
        reflect: true,
      },
    };
  }

  /**
   * convention
   */
  static get tag() {
    return "full-width-image";
  }
  /**
   * LitElement properties changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "source") {
        this._sourceChanged(this[propName]);
      }
    });
  }

  _sourceChanged(newValue) {
    if (typeof newValue !== typeof undefined) {
      this.shadowRoot.querySelector("#image").style.backgroundImage =
        `url("${newValue}")`;
    }
  }
}
globalThis.customElements.define("full-width-image", FullWidthImage);
export { FullWidthImage };

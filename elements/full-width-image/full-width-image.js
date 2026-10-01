/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
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
class FullWidthImage extends LitElement {
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

        #image {
          left: 0;
          right: 0;
          position: relative;
          background-repeat: no-repeat;
          background-position: center center;
          background-size: cover;
          width: 100%;
          text-align: center;
        }

        /* the caption overlay is dismissible (and re-showable) via the
           toggle instead of hiding on hover, so it is dismissible,
           hoverable and persistent per WCAG 1.4.13 */
        #captionToggle {
          position: absolute;
          top: var(--ddd-spacing-2, 8px);
          right: var(--ddd-spacing-2, 8px);
          z-index: 2;
          color: #fff;
          --simple-icon-button-background-color: rgba(0, 0, 0, 0.6);
        }

        .wrapper {
          opacity: 1;
          background-color: rgba(0, 0, 0, 0.6);
          padding: var(--ddd-spacing-25, 100px);
          height: var(--ddd-spacing-25, 100px);
          transition: 0.3s all ease-in-out;
        }

        @media (prefers-reduced-motion: reduce) {
          .wrapper {
            transition: none;
          }
        }

        .caption {
          padding: var(--ddd-spacing-9, 35px) 0;
          font-size: var(--full-width-image-font-size, 25px);
          line-height: var(--ddd-spacing-10, 40px);
          color: #fff;
          font-style: italic;
        }
      `,
    ];
  }

  // render function
  render() {
    return html` <div id="image">
      <simple-icon-button-lite
        id="captionToggle"
        icon="${this.captionHidden ? "icons:visibility" : "icons:visibility-off"}"
        toggles
        ?toggled="${this.captionHidden}"
        label="toggle caption"
        @click="${this._toggleCaption}"
      ></simple-icon-button-lite>
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

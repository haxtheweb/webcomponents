import { html, css } from "lit";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";
import { IntersectionObserverMixin } from "@haxtheweb/intersection-element/lib/IntersectionObserverMixin.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
/**
 * `image-compare-slider`
 * hax-wired a11y-compare-image
 * @demo demo/index.html
 * @element image-compare-slider
 */
class ImageCompareSlider extends I18NMixin(
  IntersectionObserverMixin(SchemaBehaviors(SimpleColors)),
) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        :host([hidden]) {
          display: none !important;
        }
        a11y-compare-image {
          max-width: var(--image-compare-slider-max-width, 400px);
        }
        a11y-compare-image img {
          max-width: var(--image-compare-slider-max-width, 400px);
          max-height: var(--image-compare-slider-max-height, 600px);
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
    this.accentColor = "blue";
    this.t = {
      slideToCompareImages: "Slide to compare images",
    };
    this.registerLocalization({
      context: this,
      basePath: import.meta.url,
    });
  }
  render() {
    return html`${this.elementVisible
      ? html`
          <a11y-compare-image
            label="${this.t.slideToCompareImages}"
            accent-color="${this.accentColor}"
            ?dark="${this.dark}"
            ?opacity="${this.opacity}"
            position="${this.position}"
          >
            <div slot="heading">
              ${this.title ? html` <h2>${this.title}</h2> ` : ``}
              <slot name="heading"></slot>
            </div>
            <div id="description" slot="description">
              <slot name="description"></slot>
            </div>
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
      : ``}`;
  }

  static get tag() {
    return "image-compare-slider";
  }

  static get properties() {
    return {
      ...super.properties,
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
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}
globalThis.customElements.define(ImageCompareSlider.tag, ImageCompareSlider);
export { ImageCompareSlider };

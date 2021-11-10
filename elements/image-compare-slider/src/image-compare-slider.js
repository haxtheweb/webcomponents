import { html, css } from "lit";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import { IntersectionObserverMixin } from "@lrnwebcomponents/intersection-element/lib/IntersectionObserverMixin.js";
import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
 * `image-compare-slider`
 * hax-wired a11y-compare-image
 * @demo demo/index.html
 * @element image-compare-slider
 */
class ImageCompareSlider extends I18NMixin(
  IntersectionObserverMixin(SchemaBehaviors(SimpleColors))
) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: inline-flex;
        }
        :host([hidden]) {
          display: none !important;
        }
      `,
    ];
  }
  constructor() {
    super();
    this.opacity = false;
    this.position = 50;
    this.accentColor = "blue";
    this.t = {
      slideToCompareImages: "Slide to compare images",
    };
    this.registerLocalization({
      context: this,
      basePath: import.meta.url,
      locales: ["es"],
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
            <div slot="description"><slot name="description"></slot></div>
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
        import("@lrnwebcomponents/a11y-compare-image/a11y-compare-image.js");
      }
    });
  }
  static get haxProperties() {
    return new URL(
      "./lib/image-compare-slider.haxProperties.json",
      import.meta.url
    ).href;
  }
}
window.customElements.define(ImageCompareSlider.tag, ImageCompareSlider);
export { ImageCompareSlider };

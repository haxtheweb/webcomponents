/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { DDDAccentStyles } from "@haxtheweb/d-d-d/lib/DDDAccent.js";
import { IntersectionObserverMixin } from "@haxtheweb/intersection-element/lib/IntersectionObserverMixin.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";

/**
 * `product-offering`
 * `Simple card for displaying product info`
 * @demo demo/index.html
 * @element product-offering
 */
class ProductOffering extends IntersectionObserverMixin(DDD) {
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.alt = "";
    this.accentColor = "blue";
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
      DDDAccentStyles,
      css`
        :host {
          display: block;
          container-type: inline-size;
          padding: var(--product-offering-padding, var(--ddd-spacing-6));
          font-family: var(
            --product-offering-font-family,
            var(--ddd-font-primary, sans-serif)
          );
          --product-offering-accent: var(
            --ddd-accent-color,
            var(--ddd-theme-default-beaverBlue)
          );
          --product-offering-ink: var(
            --ddd-accent-color-ink,
            var(--ddd-theme-default-white)
          );
          --product-offering-heading: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
          color: var(
            --product-offering-text-color,
            light-dark(
              var(--ddd-theme-default-coalyGray),
              var(--ddd-theme-default-limestoneLight)
            )
          );
        }
        /* dark forces the dark scheme, so it also brings its own dark
           surface: light text never lands on a light page */
        :host([dark]) {
          color-scheme: dark;
          background-color: var(
            --product-offering-background-color,
            var(--ddd-theme-default-potentialMidnight)
          );
          border-radius: var(--ddd-radius-sm);
        }
        .container {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: var(--ddd-spacing-4);
          align-items: start;
          padding: var(--ddd-spacing-4) 0;
        }
        .image {
          display: block;
          height: var(--product-offering-image-height, 150px);
          width: var(--product-offering-image-width, 200px);
          max-width: 100%;
          object-fit: cover;
          border-radius: var(--ddd-radius-sm);
        }
        .square {
          min-width: 0;
        }
        .squareTitle {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
        }
        .squareTitle h4 {
          margin: 0;
          color: var(--product-offering-heading);
          font-size: var(--ddd-font-size-3xs);
          line-height: 1.3;
        }
        /* a true circle: equal fixed sides, never stretched by flex */
        .icon-background {
          box-sizing: border-box;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: none;
          width: var(--ddd-spacing-10);
          height: var(--ddd-spacing-10);
          aspect-ratio: 1;
          padding: 0;
          margin: 0;
          border-radius: var(--ddd-radius-circle);
          background-color: var(--product-offering-accent);
          box-shadow: var(--ddd-boxShadow-sm);
          --simple-icon-color: var(--product-offering-ink);
        }
        simple-icon {
          --simple-icon-width: var(--ddd-icon-xxs);
          --simple-icon-height: var(--ddd-icon-xxs);
        }
        .underline {
          border-bottom: var(--ddd-border-md);
          border-bottom-color: var(--product-offering-accent);
          display: inline-block;
        }
        .sqaureDescription {
          color: inherit;
          font-size: var(--ddd-font-size-4xs);
          line-height: 1.5;
          padding: var(--ddd-spacing-2) 0 0;
          padding-inline-start: calc(
            var(--ddd-spacing-10) + var(--ddd-spacing-3)
          );
          margin: 0;
        }
        /* narrow: stack the image above the text instead of overlapping */
        @container (max-width: 480px) {
          .container {
            grid-template-columns: minmax(0, 1fr);
          }
          .image {
            width: 100%;
          }
          .sqaureDescription {
            padding-inline-start: 0;
          }
        }

        /* forced colors drops the chip fill, so the icon takes the system
           text color instead of its hard-coded one */
        @media (forced-colors: active) {
          simple-icon {
            --simple-icon-color: CanvasText;
          }
        }
      `,
    ];
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`
      ${
        this.elementVisible
          ? html` <!-- Container -->
              <div class="container">
                <img
                  class="image"
                  src="${this.source}"
                  alt="${this.alt}"
                  loading="lazy"
                />

                <div class="square">
                  <!-- Icon, Header -->
                  <div class="squareTitle">
                    <!-- icon -->
                    <div class="icon-background">
                      <simple-icon
                        accent-color="${this.accentColor}"
                        ?dark="${this.dark}"
                        .icon="${this.icon}"
                      ></simple-icon>
                    </div>
                    <!-- header -->
                    <h4>
                      <span class="underline">${this._titleOne}</span
                      >&nbsp;<span>${this._titleTwo}</span>
                    </h4>
                  </div>

                  <!-- description -->
                  <div class="sqaureDescription">
                    <slot name="description">${this.description}</slot>
                  </div>
                </div>
              </div>`
          : ``
      }
    `;
  }
  /**
   * Convention we use
   */
  static get tag() {
    return "product-offering";
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * Alternative text for the image.
       */
      alt: { type: String },
      /**
       * Address of the image shown beside the offering.
       */
      source: { type: String },
      /**
       * Icon shown next to the title.
       */
      icon: { type: String },
      /**
       * Title of the offering; its first word is underlined.
       */
      title: { type: String },
      _titleOne: { type: String },
      _titleTwo: { type: String },
      description: { type: String },
    };
  }
  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "title") {
        if (this.title.split(" ").length > 1) {
          const tmp = this.title.split(" ");
          this._titleOne = tmp.shift();
          this._titleTwo = tmp.join(" ");
        } else {
          this._titleOne = this.title;
        }
      }
    });
  }
}
globalThis.customElements.define(ProductOffering.tag, ProductOffering);
export { ProductOffering };

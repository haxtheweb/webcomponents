/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { LrndesignGalleryBehaviors } from "./lrndesign-gallery-behaviors.js";
import "./lrndesign-gallery-zoom.js";
import "./lrndesign-gallery-details.js";
/**
 * `lrndesign-gallery-grid`
 * An element that renders a collection of gallery items into a grid or a single media item into a layout.
 *
 * @element lrndesign-gallery-grid
 * @extends LrndesignGalleryBehaviors
 * @demo ./demo/grid.html demo
 *
 */
class LrndesignGalleryGrid extends LrndesignGalleryBehaviors {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "lrndesign-gallery-grid";
  }
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          margin: 15px 0 0;
          padding: 0;
          max-width: 100%;
          display: block;
        }
        #galleryscreen {
          display: flex;
          flex-wrap: wrap;
        }
        lrndesign-gallery-zoom {
          position: relative;
          width: var(--lrndesign-gallery-grid-thumbnail-xs, 100px);
        }
        :host([responsive-size="sm"]) lrndesign-gallery-zoom {
          width: var(--lrndesign-gallery-grid-thumbnail-sm, 150px);
        }
        :host([responsive-size="md"]) lrndesign-gallery-zoom {
          width: var(--lrndesign-gallery-grid-thumbnail-md, 200px);
        }
        :host([responsive-size="lg"]) lrndesign-gallery-zoom {
          width: var(--lrndesign-gallery-grid-thumbnail-lg, 250px);
        }
        :host([responsive-size="xl"]) lrndesign-gallery-zoom {
          width: var(--lrndesign-gallery-grid-thumbnail-lg, 300px);
        }
        iron-image {
          width: 100%;
        }
        .zoombg,
        .zoomicon {
          top: unset;
          bottom: 5px;
          left: 5px;
        }
      `
    ];
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties
    };
  }

  /**
   * life cycle, element is ready
   */
  constructor() {
    super();
    let target = this.shadowRoot.querySelector("#carouselitem");
    if (this.selected.scroll && target) {
      this._scrollIntoView([this._getParentOffset(target)]);
      if (!this.selected.zoomed) target.focus();
    }
  }

  // render function
  render() {
    return html`
      <article id="grid">
        <h1 id="gallerytitle" ?hidden="${this.galleryTitle}">
          ${this.galleryTitle}
        </h1>
        <div id="gallery-description"><slot></slot></div>
        <p class="sr-only">A list of thumbnail buttons items:</p>
        <div id="galleryscreen">
          ${this.sources.map(
            item => html`
              <lrndesign-gallery-zoom
                id="${item.id}"
                details="${item.details}"
                heading="${item.heading}"
                src="${item.large}"
                tooltip="${item.tooltip}"
                zoom-alt="${item.zoomAlt}"
              >
                <iron-image
                  alt="${item.zoomAlt}"
                  fade
                  sizing="cover"
                  src="${item.thumbnail}"
                  style="${this.imageStyle}"
                >
                </iron-image>
                <div class="zoombg"></div>
                <iron-icon icon="zoom-in" class="zoomicon"></iron-icon>
              </lrndesign-gallery-zoom>
              <simple-tooltip
                for="${item.id}"
                position="bottom"
                controls="zoomtpl"
                >${item.tooltip}</simple-tooltip
              >
            `
          )}
        </div>
        ${this.galleryPrint}
      </article>
    `;
  }

  /**
   * returns the proper padding to maintain image aspect ratio and updates
   *
   * @param {array} an array of items
   * @returns {string} the style based on the first item
   */
  get imageStyle() {
    let img = new Image(),
      padding = 75;
    if (this.items !== undefined && this.items.length > 0) {
      img.src = this.items[0].src;
      if (img.naturalWidth > 0 && img.naturalHeight > 0)
        padding = (100 * img.naturalHeight) / img.naturalWidth;
    }
    return `padding-bottom: ${padding}%;`;
  }

  /**
   * handles gallery-scroll event
   * /
  _handleScroll(item) {
    this._scrollIntoView([this._getParentOffset(this), item.offsetTop]);
  }*/
}
window.customElements.define(LrndesignGalleryGrid.tag, LrndesignGalleryGrid);
export { LrndesignGalleryGrid };

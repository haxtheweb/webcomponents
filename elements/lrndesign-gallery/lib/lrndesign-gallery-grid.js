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
          margin: 15px 0;
          padding: 0;
          max-width: 100%;
          display: block;
        }
        #galleryscreen {
          display: grid;
          grid-gap: 7.5px;
          grid-template-columns: repeat(2, 1fr);
        }
        :host([responsive-size="sm"]) #galleryscreen {
          grid-template-columns: repeat(3, 1fr);
        }
        :host([responsive-size="md"]) #galleryscreen {
          grid-template-columns: repeat(4, 1fr);
        }
        :host([responsive-size="lg"]) #galleryscreen {
          grid-template-columns: repeat(5, 1fr);
        }
        :host([responsive-size="xl"]) #galleryscreen {
          grid-template-columns: repeat(6, 1fr);
        }
        lrndesign-gallery-zoom {
          position: relative;
          width: 100%;
        }
        lrndesign-gallery-zoom img {
          width: 100%;
          transition: outline 0.25s ease-in-out;
          outline: 1px solid var(--lrndesign-gallery-color);
        }
        lrndesign-gallery-zoom:hover img,
        lrndesign-gallery-zoom:focus img,
        lrndesign-gallery-zoom:focus-within img {
          transition: outline 0.25s ease-in-out;
          outline: 2px solid var(--lrndesign-gallery-focus-color);
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
      <div id="grid">
        <p class="sr-only">A list of columns buttons items:</p>
        <div id="galleryscreen">
          ${this.sources.map(
            item => html`
              <lrndesign-gallery-zoom
                .id="${item.id}"
                .details="${item.details}"
                .heading="${item.heading}"
                .src="${item.large}"
                .tooltip="${item.tooltip}"
                .zoom-alt="${item.zoomAlt}"
              >
                <img
                  .alt="${item.alt}"
                  fade
                  sizing="${this.selected.sizing || this.sizing === 'cover' || 'contain'}"
                  .src="${item.src}"
                />
                <div class="zoombg"></div>
                <iron-icon icon="zoom-in" class="zoomicon"></iron-icon>
              </lrndesign-gallery-zoom>
            `
          )}
        </div>
      </div>
    `;
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

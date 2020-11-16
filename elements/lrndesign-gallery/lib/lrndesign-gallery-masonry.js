/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { LrndesignGalleryBehaviors } from "./lrndesign-gallery-behaviors.js";
import "./lrndesign-gallery-zoom.js";
import "./lrndesign-gallery-details.js";
/**
 * `lrndesign-gallery-masonry`
 * An element that renders a collection of gallery items into a grid or a single media item into a layout.
 *
 * @element lrndesign-gallery-masonry
 * @extends LrndesignGalleryBehaviors
 * @demo ./demo/masonry.html demo
 *
 */
class LrndesignGalleryMasonry extends LrndesignGalleryBehaviors {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "lrndesign-gallery-masonry";
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
        #galleryscreen > div {
          display: flex;
          align-items: stretch;
          justify-content: center;
          margin: 20px 0;
        }
        lrndesign-gallery-zoom {
          position: relative;
          margin: 0 10px;
          flex: 0 1 var(--lrndesign-gallery-image-width, 200px);
          max-width: 35%;
          --simple-icon-color: currentColor;
        }
        lrndesign-gallery-zoom,
        lrndesign-gallery-zoom:hover,
        lrndesign-gallery-zoom:focus,
        lrndesign-gallery-zoom:focus-within {
          border: 0px solid transparent;
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
      `,
    ];
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      __aspects: {
        type: Object,
      },
      __columns: {
        type: Array,
      },
      __items: {
        type: Array,
      },
    };
  }

  /**
   * life cycle, element is ready
   */
  constructor() {
    super();
    this.__aspects = {};
    this.__items = [];
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
          ${(this.__items || []).map(
            (row, i) => html`
              <div>
                ${(row.cols || []).map(
                  (col, j) => html`
                    <lrndesign-gallery-zoom
                      .id="${col.id}"
                      .details="${col.details}"
                      .heading="${col.heading}"
                      .src="${col.large}"
                      .tooltip="${col.tooltip}"
                      .zoom-alt="${col.zoomAlt}"
                      style="${this._getStyle(col.aspect, row.aspect)}"
                    >
                      <img
                        .alt="${col.alt}"
                        fade
                        .src="${col.src}"
                        @load="${(e) => this._handleImgLoad(e)}"
                      />
                      <div class="zoombg"></div>
                      <simple-icon
                        icon="zoom-in"
                        class="zoomicon"
                      ></simple-icon>
                    </lrndesign-gallery-zoom>
                  `
                )}
              </div>
            `
          )}
        </div>
      </div>
    `;
  }

  /**
   * handle updates
   */
  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "sources") this._updateItems();
      if (propName === "responsiveSize") this._updateItems();
    });
  }
  _getStyle(aspect, total) {
    let a = `--lrndesign-gallery-image-aspect:${aspect || 100 / 75};`,
      h = `--lrndesign-gallery-image-height:${100 / aspect || 75}%;`,
      w = `--lrndesign-gallery-image-width:${(aspect * 100) / total || 0.75}%`;
    return [a, h, w].join("");
  }
  _handleImgLoad(e) {
    var target = null;
    if (e.path && e.path[0]) {
      target = e.path[0];
    } else if (e.originalTarget) {
      target = e.originalTarget;
    } else {
      target = e.target;
    }
    if (target.naturalWidth > 0) {
      this._updateItems();
    }
  }
  _updateItems() {
    let items = [],
      settings = {
        xs: 2,
        sm: 3,
        md: 4,
        lg: 5,
        xl: 6,
      },
      cols = settings[this.responsiveSize || "xs"],
      rows = Math.ceil(this.sources.length / cols);
    for (let i = 0; i < rows; i++) {
      let row = { aspect: 0, cols: [] };
      console.log("row", i);
      for (
        let j = i * cols;
        j < Math.min(this.sources.length, (i + 1) * cols);
        j++
      ) {
        let item = JSON.parse(JSON.stringify(this.sources[j])),
          img = this.shadowRoot.querySelector(`img[src="${item.src}"]`);
        item.aspect =
          img && img.naturalWidth > 0
            ? img.naturalWidth / img.naturalHeight
            : 100 / 75;
        row.aspect += item.aspect;
        row.cols.push(item);
      }
      items.push(row);
    }
    this.__items = items;
    console.log("this.__items", this.__items);
  }
}
window.customElements.define(
  LrndesignGalleryMasonry.tag,
  LrndesignGalleryMasonry
);
export { LrndesignGalleryMasonry };

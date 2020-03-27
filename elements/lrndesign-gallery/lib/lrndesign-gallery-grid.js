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
 * @customElement lrndesign-gallery-grid
 * @extends LrndesignGalleryBehaviors
 * @demo ./demo/grid.html demo
 * 
 * @microcopy - language worth noting:```
<lrndesign-gallery-grid 
  accent-color="grey"               //optional, the accent color from simple-colors; default is grey
  dark                              //optional, if true, gallery will use the simple-colors dark theme; default is false (fixed-theme)
  id="mygallery1"                   //optional, a unique id for the gallery; if true, you can use the id in anchors to access gallery items on page load
  sources="[]"                      //required, array of image sources
  sizing="contain"                  //optional, "cover" for cropping (default) or "contain" for letterboxing
  title="My Gallery">               //optional, the title of the gallery
  Optional description of the gallery.
</lrndesign-gallery-grid>```
 * where `sources` array is:```
[{
  "alt": "IMAGE ALT TEXT",                          //required
  "details": "TEXT ABOUT IMAGE HERE",               //optional 
  "heading": "IMAGE HEADING HERE",                  //required, the image heading when in zoom mode
  "id": "123"                                       //required, unique id  
  "sizing": "contain",                              //optional, "cover" for cropping (default) or "contain" for letterboxing, default is parent's sizing
  "large": "PATH/TO/LARGE/IMAGE/HERE.JPG",          //optional, larger image for zoom instead of src 
  "src": "PATH/TO/FULL/IMAGE/HERE.JPG",             //required
  "thumbnail": "PATH/TO/THUMBAIL/IMAGE/HERE.JPG",   //required
  "tooltip": "IMAGE TOOLTIP HERE",                  //required, the tooltip for the image thumbnail
  "title": "IMAGE TITLE HERE",                      //optional, the image title when viewed
  "type": "image",                                  //required, "image", "video", "audio", etc.
}]```
 *
 */
class LrndesignGalleryGrid extends LrndesignGalleryBehaviors {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "lrndesign-gallery-grid";
  }
  static get styles(){
    return [
      ...super.styles,
      css`
        :host {
          margin: 15px 0 0;
          padding: 0;
          max-width: 100%;
          display: block;
        }
        :host .gallerythumb div {
          position: relative;
          display: flex;
          align-items: stretch;
        }
        :host .gallerythumb div,
        :host .gallerythumb iron-image {
          width: 100%;
        }
        :host .gallerythumb {
          width: var(--lrndesign-gallery-grid-thumbnail-xs, 100px);
        }
        :host([responsive-size="sm"]) .gallerythumb {
          width: var(--lrndesign-gallery-grid-thumbnail-sm, 150px);
        }
        :host([responsive-size="md"]) .gallerythumb {
          width: var(--lrndesign-gallery-grid-thumbnail-md, 200px);
        }
        :host([responsive-size="lg"]) .gallerythumb {
          width: var(--lrndesign-gallery-grid-thumbnail-lg, 250px);
        }
        :host([responsive-size="xl"]) .gallerythumb {
          width: var(--lrndesign-gallery-grid-thumbnail-lg, 300px);
        }
        :host .gallerythumb iron-icon {
          position: absolute;
          bottom: 7px;
          left: 7px;
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
        <h1 id="gallerytitle" ?hidden="${this.title}">${this.title}</h1>
        <div id="gallery-description"><slot></slot></div>
        <p class="sr-only">A list of thumbnail buttons items:</p>
        <div id="galleryscreen">
          ${this.items.map(item=>html`
            <lrndesign-gallery-zoom
              anchored-item="${this.__anchoredItem}"
              class="gallerythumb"
              details="${item.details}"
              heading="${item.heading}"
              item-id="${item.id}"
              @gallery-scroll="${e=>this._handleScroll(item)}"
              ?scrolled="${item.scroll}"
              src="${item.large}"
              tooltip="${item.tooltip}"
              zoom-alt="${item.zoomAlt}"
              ?zoomed="${item.zoom}"
            >
              <div>
                <iron-image
                  alt="${item.zoomAlt}"
                  fade
                  sizing="cover"
                  src="${item.thumbnail}"
                  style="${this.imageStyle}"
                >
                </iron-image>
              </div>
              <iron-icon icon="zoom-in"></iron-icon>
            </lrndesign-gallery-zoom>
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
   */
  _handleScroll(item) {
    this._scrollIntoView([this._getParentOffset(this), item.offsetTop]);
  }
}
window.customElements.define(LrndesignGalleryGrid.tag, LrndesignGalleryGrid);
export { LrndesignGalleryGrid };

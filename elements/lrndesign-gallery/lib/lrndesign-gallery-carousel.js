/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element/lit-element.js";
import { LrndesignGalleryBehaviors } from "./lrndesign-gallery-behaviors.js";
import "./lrndesign-gallery-details.js";
import "./lrndesign-gallery-zoom.js";

/**
 * `lrndesign-gallery-carousel`
 * An element that renders a collection of gallery items into a carousel or a single media item into a layout.
 *
 * @customElement lrndesign-gallery-carousel
 * @extends LrndesignGalleryBehaviors
 * @demo ./demo/index.html demo
 * 
 * @microcopy - language worth noting:```
 <lrndesign-gallery-carousel 
  accent-color="grey"               //optional, the accent color from simple-colors; default is grey
  dark                              //optional, if true, gallery will use the simple-colors dark theme; default is false (fixed-theme)
  id="mygallery1"                   //optional, a unique id for the gallery; if true, you can use the id in anchors to access gallery items on page load
  sources="[]"                      //required, array of image sources
  sizing="contain"                  //optional, "cover" for cropping (default) or "contain" for letterboxing
  title="My Gallery">               //optional, the title of the gallery
  Optional description of the gallery.
</lrndesign-gallery-carousel>```
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
class LrndesignGalleryCarousel extends LrndesignGalleryBehaviors {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "lrndesign-gallery-carousel";
  }
  static get styles(){
    return [
      ...super.styles,
      css`
        :host {
          margin: 15px 0 0;
          padding: 0;
        }
        :host #carouselitem {
          width: 100%;
          color: var(--lrndesign-gallery-color);
          background-color: var(--lrndesign-gallery-background-color);
          border: 1px solid var(--lrndesign-gallery-border-color);
        }
        :host(:not([responsive-size="xs"]):not([extra-wide])) #carouselitem {
          display: flex;
          justify-content: space-between;
          align-items: stretch;
          border-top: 4px solid var(--lrndesign-gallery-focus-color);
        }
        :host([responsive-size="sm"]:not([extra-wide])) #carouselitem,
        :host([responsive-size="sm"]:not([extra-wide])) #prevnextnav,
        :host([responsive-size="md"]:not([extra-wide])) #carouselitem,
        :host([responsive-size="md"]:not([extra-wide])) #prevnextnav {
          height: 200px;
          max-height: 200px;
        }
        :host([responsive-size="lg"]:not([extra-wide])) #carouselitem,
        :host([responsive-size="lg"]:not([extra-wide])) #prevnextnav {
          height: 300px;
          max-height: 300px;
        }
        :host([responsive-size="xl"]:not([extra-wide])) #carouselitem,
        :host([responsive-size="xl"]:not([extra-wide])) #prevnextnav {
          height: 400px;
          max-height: 400px;
        }
        :host #carouselimage {
          position: relative;
        }
        :host #carouselimage iron-image {
          width: 100%;
          height: 100%;
        }
        :host #prevnextnav {
          left: 0;
          top: 0;
          height: 100%;
          width: 100%;
          position: absolute;
        }
        :host #prevnextnav paper-button {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          left: 50%;
          top: 0;
          width: 50%;
          height: 100%;
          opacity: 0;
          margin: 0;
          border-radius: 0;
          color: var(--lrndesign-gallery-color);
          background-color: var(--lrndesign-gallery-background-color);
          --paper-button-ink-color: var(--lrndesign-gallery-background-color);
          background: var(--lrndesign-gallery-next-bg);
          transition: opacity 0.5s;
        }
        :host #prevnextnav paper-button#carouselprev {
          left: 0;
          justify-content: flex-start;
          background: var(--lrndesign-gallery-prev-bg);
        }
        :host #prevnextnav paper-button[item="-1"] {
          display: none;
        }
        :host #prevnextnav paper-button:focus,
        :host #prevnextnav paper-button:hover {
          opacity: 0.8;
        }
        :host #prevnextnav iron-icon {
          margin: 10%;
        }
        :host lrndesign-gallery-zoom {
          left: 3px;
          bottom: 0;
          z-index: 2;
          position: absolute;
        }
        :host #details {
          flex-grow: 1;
          flex-shrink: 1;
          overflow-y: auto;
        }
        :host([responsive-size="xs"]) #details,
        :host([extra-wide]) #details {
          margin-top: -4px;
          border-top: 4px solid var(--lrndesign-gallery-focus-color);
        }
        :host #details-inner {
          height: 100%;
          display: flex;
          position: relative;
          justify-content: space-between;
          flex-wrap: wrap;
          align-items: stretch;
          align-content: stretch;
        }
        :host #itemdetails,
        :host #thumbnails {
          padding: 20px;
          flex-basis: 100%;
        }
        :host #itemdetails {
          align-self: flex-start;
          flex-grow: 1;
          flex-shrink: 1;
          overflow-y: auto;
        }
        :host #thumbnails {
          align-self: flex-end;
        }
        /*TODO :host .gallerythumb[disabled] {
          @apply --lrndesign-gallery-thumbnail-image-selected;
        }*/
        :host .gallerythumb iron-image {
          width: 40px;
          height: 40px;
        }
        :host([responsive-size="xs"]) .gallerythumb iron-image {
          display: none;
        }
        :host([responsive-size="md"]) .gallerythumb iron-image {
          width: 45px;
          height: 45px;
        }
        :host([responsive-size="lg"]) .gallerythumb iron-image,
        :host([responsive-size="xl"]) .gallerythumb iron-image {
          width: 50px;
          height: 50px;
        }
        :host #itemtitle {
          margin-top: 0;
        }
        :host .x-of-y {
          font-size: 85%;
          font-style: italic;
          text-align: right;
          padding: 0;
          margin: 0;
        }
        :host #xystart,
        :host #xyend {
          position: absolute;
          right: 20px;
          top: 20px;
        }
      `
    ];
  }

  // render function
  render() {
    return html`
      <article id="carousel">
        <h1 id="gallerytitle" ?hidden="${this.title}">${this.title}</h1>
        <div id="gallerydescription">
          <slot></slot>
        </div>
        <p class="sr-only">A carousel of items:</p>
        <div id="galleryscreen">
          <div
            id="carouselitem"
            aspect-ratio="${this.aspectRatio}"
            ?dark="${this.dark}"
            ?extra-wide="${this.extraWide}"
            image-style="${this.__imageStyle}"
            .item="${this.selected}"
            responsive-size="${this.responsiveSize}"
          >
            <p id="xystart" class="sr-only" ?hidden="${this.hideNav}">
              Slide ${this.selected.xofy} selected.
            </p>
            <div id="carouselimage">
              <iron-image
                alt="${this.selected.alt}"
                fade
                id="${this.selected.id}"
                placeholder="${this.selected.thumbnail}"
                sizing="${this.selected.sizing}"
                src="${this.selected.src}"
                style="${this.__imageStyle}"
              >
              </iron-image>
              <lrndesign-gallery-zoom
                details="${this.selected.details}"
                heading="${this.selected.heading}"
                id="galleryzoom"
                item-id="${this.selected.id}"
                src="${this.selected.large}"
                tooltip="${this.selected.tooltip}"
                zoom-alt="${this.selected.alt}"
                ?zoomed="${this.selected.zoom}"
              >
                <iron-icon
                  icon="zoom-in"
                  ?hidden="${!this.icon || this.icon===""}"
                ></iron-icon>
              </lrndesign-gallery-zoom>
              <div id="prevnextnav">
                <paper-button
                  id="carouselprev"
                  aria-controls="${this.__gallery.id}"
                  aria-label="prev"
                  ?hidden="${this.hideNav}"
                  index="${this.selected.prev}"
                  @click="${this._onPrev}"
                  .target="${this.__gallery}"
                  tabindex="-1"
                  title=""
                >
                  <iron-icon icon="chevron-left"></iron-icon>
                </paper-button>
                <simple-tooltip for="carouselprev" position="top"
                  >previous</simple-tooltip
                >
                <paper-button
                  id="carouselnext"
                  aria-controls="${this.__gallery.id}"
                  aria-label="next"
                  ?hidden="${this.hideNav}"
                  index="${this.selected.next}"
                  @click="${this._onNext}"
                  .target="${this.__gallery}"
                  tabindex="-1"
                  title=""
                >
                  <iron-icon icon="chevron-right"></iron-icon>
                </paper-button>
                <simple-tooltip for="carouselnext" position="top"
                  >next</simple-tooltip
                >
              </div>
            </div>
            <div id="details" class="item-info">
              <div id="details-inner">
                <div id="itemdetails">
                  <h2 id="itemtitle" ?hidden="${!this.selected.title || this.selected.title==""}">
                    ${this.selected.title}
                  </h2>
                  <div id="itembody">
                    <lrndesign-gallery-details
                      details="${this.selected.details}"
                    ></lrndesign-gallery-details>
                  </div>
                </div>
                <div id="xyend">
                  <p class="x-of-y" ?hidden="${this.hideNav}">
                    (<span class="sr-only"> End of slide </span>
                    ${this.selected.xofy}<span class="sr-only">.</span>)
                  </p>
                </div>
                <div id="thumbnails" class="item-info">
                  <div id="thumbnails-inner">
                    <div>
                      <p class="sr-only" ?hidden="${this.hideNav}">
                        Slides list:
                      </p>
                      ${this.items.map(item=>html`
                        <paper-button
                          id="${item.id}"
                          aria-controls="${this.__gallery.id}"
                          class="gallerythumb"
                          ?hidden="${this.hideNav}"
                          index="${item.index}"
                          @click="${e=>this._onNavTapped(item)}"
                          ?disabled="${this._isSelected(this.selected,item)}"
                          .target="${item.target}"
                        >
                          <iron-image
                            alt="${item.alt}"
                            fade
                            sizing="cover"
                            src="${item.thumbnail}"
                          >
                          </iron-image>
                        </paper-button>
                        <simple-tooltip
                          for="${item.id}"
                          ?hidden="${this._isSelected(this.selected,item)}"
                          position="top"
                        >
                          ${item.alt}
                        </simple-tooltip>

                      `)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        ${this.galleryPrint}
      </article>
    `;
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
  /**
   * gets whether navigation should be hidden
   *
   * @readonly
   * @memberof LrndesignGalleryCarousel
   */
  get hideNav(){
    return this.items !== undefined ? this.items.length < 2 : true;
  }
  /**
   * go to item by id, or index
   *
   * @param {string} index
   */
  goToItem(index) {
    if (typeof index === "number" && index >= 0 && index < this.items.length) {
      this.selected = this.items[index];
    }
  }

  /**
   * returns index of the previous or next item
   * TODO
   *
   * /
  _getIndex(index, step) {
    return index + step;
  }

  /**
   * when a prev is tapped, goes to the prev item
   */
  _onPrev() {
    this.goToItem(
      parseInt(
        this.shadowRoot.querySelector("#carouselprev").getAttribute("index")
      )
    );
  }

  /**
   * when a next is tapped, goes to the next item
   */
  _onNext() {
    this.goToItem(
      parseInt(
        this.shadowRoot.querySelector("#carouselnext").getAttribute("index")
      )
    );
  }

  /**
   * when a thumbnail is tapped, goes to that item
   */
  _onNavTapped(item) {
    this.goToItem(item.index);
  }
}
window.customElements.define(
  LrndesignGalleryCarousel.tag,
  LrndesignGalleryCarousel
);
export { LrndesignGalleryCarousel };

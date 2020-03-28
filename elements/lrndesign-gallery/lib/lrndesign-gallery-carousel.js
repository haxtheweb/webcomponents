/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import { LrndesignGalleryBehaviors } from "./lrndesign-gallery-behaviors.js";
import "@polymer/iron-image/iron-image.js";
import "@polymer/iron-icons/iron-icons.js";
import "./lrndesign-gallery-zoom.js";

/**
 * `lrndesign-gallery-carousel`
 * An element that renders a collection of gallery items into a carousel or a single media item into a layout.
 *
 * @customElement lrndesign-gallery-carousel
 * @extends LrndesignGalleryBehaviors
 * @demo ./demo/index.html demo
 *
 */
class LrndesignGalleryCarousel extends LrndesignGalleryBehaviors {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "lrndesign-gallery-carousel";
  }
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          margin: 15px 0 0;
          padding: 0;
        }
        #carouselitem {
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
        #carouselimage {
          position: relative;
        }
        #carouselimage iron-image {
          width: 100%;
          height: 100%;
        }
        #prevnextnav {
          left: 0;
          top: 0;
          height: 100%;
          width: 100%;
          position: absolute;
        }
        #prevnextnav button {
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
          border-width: 0;
          border-radius: 0;
          color: var(--lrndesign-gallery-color);
          background-color: var(--lrndesign-gallery-background-color);
          --button-ink-color: var(--lrndesign-gallery-background-color);
          background: var(--lrndesign-gallery-next-bg);
          transition: opacity 0.5s;
        }
        #prevnextnav button[hidden] {
          display: none;
        }
        #prevnextnav button#carouselprev {
          left: 0;
          justify-content: flex-start;
          background: var(--lrndesign-gallery-prev-bg);
        }
        #prevnextnav button[item="-1"] {
          display: none;
        }
        #prevnextnav button:focus,
        #prevnextnav button:hover {
          outline: none;
          opacity: 0.8;
        }
        #prevnextnav button[disabled]:focus,
        #prevnextnav button[disabled]:hover {
          cursor: not-allowed;
          opacity: 0.1;
        }
        #prevnextnav button:focus iron-icon,
        #prevnextnav button:hover iron-icon {
          outline: 1px solid var(--lrndesign-gallery-color);
        }
        #prevnextnav iron-icon {
          margin: 10%;
        }
        lrndesign-gallery-zoom {
          width: 24px;
          height: 24px;
          left: 5px;
          bottom: 5px;
          position: absolute;
        }
        .zoombg,
        .zoomicon {
          top: 0;
          left: 0;
        }
        #details {
          flex-grow: 1;
          flex-shrink: 1;
          overflow-y: auto;
        }
        :host([responsive-size="xs"]) #details,
        :host([extra-wide]) #details {
          margin-top: -4px;
          border-top: 4px solid var(--lrndesign-gallery-focus-color);
        }
        #details-inner {
          height: 100%;
          display: flex;
          position: relative;
          justify-content: space-between;
          flex-wrap: wrap;
          align-items: stretch;
          align-content: stretch;
        }
        #itemdetails,
        #thumbnails {
          padding: 20px;
          flex-basis: 100%;
        }
        #itemdetails {
          align-self: flex-start;
          flex-grow: 1;
          flex-shrink: 1;
          overflow-y: auto;
        }
        #thumbnails {
          align-self: flex-end;
        }
        /*TODO .gallerythumb[disabled] {
          @apply --lrndesign-gallery-thumbnail-image-selected;
        }*/
        .gallerythumb,
        .gallerythumb iron-image {
          width: 40px;
          height: 40px;
          overflow: hidden;
        }
        .gallerythumb:hover,
        .gallerythumb:focus {
          outline: 1px solid var(--lrndesign-gallery-color);
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
        #itemtitle {
          margin-top: 0;
        }
        .x-of-y {
          font-size: 85%;
          font-style: italic;
          text-align: right;
          padding: 0;
          margin: 0;
        }
        #xystart,
        #xyend {
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
        <h1 id="gallerytitle" ?hidden="${this.galleryTitle}">
          ${this.galleryTitle}
        </h1>
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
            image-style="${this.imageStyle}"
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
                style="${this.imageStyle}"
              >
              </iron-image>
              <lrndesign-gallery-zoom
                details="${this.selected.details}"
                heading="${this.selected.heading}"
                id="galleryzoom"
                src="${this.selected.large}"
                tooltip="${this.selected.tooltip}"
                zoom-alt="${this.selected.alt}"
              >
                <div class="zoombg"></div>
                <iron-icon icon="zoom-in" class="zoomicon"></iron-icon>
              </lrndesign-gallery-zoom>
              <simple-tooltip
                for="galleryzoom"
                position="right"
                controls="zoomtpl"
                >${this.selected.tooltip}</simple-tooltip
              >
              <div id="prevnextnav">
                <button
                  id="carouselprev"
                  aria-controls="carousel"
                  aria-label="prev"
                  ?hidden="${this.hideNav}"
                  ?disabled="${!this.selected || this.selected.prev < 0}"
                  @click="${e =>
                    this._itemChanged(this.selected ? this.selected.prev : 0)}"
                  tabindex="-1"
                >
                  <span class="sr-only">Previous</span>
                  <iron-icon icon="chevron-left"></iron-icon>
                </button>
                <simple-tooltip for="carouselprev" position="top"
                  >previous</simple-tooltip
                >
                <button
                  id="carouselnext"
                  aria-controls="carousel"
                  aria-label="next"
                  ?hidden="${this.hideNav}"
                  ?disabled="${!this.selected || this.selected.next < 0}"
                  @click="${e =>
                    this._itemChanged(this.selected ? this.selected.next : 0)}"
                  tabindex="-1"
                >
                  <span class="sr-only">Next</span>
                  <iron-icon icon="chevron-right"></iron-icon>
                </button>
                <simple-tooltip for="carouselnext" position="top"
                  >next</simple-tooltip
                >
              </div>
            </div>
            <div id="details" class="item-info">
              <div id="details-inner">
                <div id="itemdetails">
                  <h2
                    id="itemtitle"
                    ?hidden="${!this.selected.title ||
                      this.selected.title == ""}"
                  >
                    ${this.selected.title}
                  </h2>
                  <div id="itembody">
                    <div id="details">
                      ${this.selected.details || ""}
                    </div>
                  </div>
                </div>
                <div id="xyend" ?hidden="${this.hideNav}">
                  <p class="x-of-y">
                    (<span class="sr-only"> End of slide </span> ${this.selected
                      .xofy}<span class="sr-only">.</span>)
                  </p>
                </div>
                <div id="thumbnails" class="item-info" ?hidden="${this.hideNav}">
                  <div id="thumbnails-inner">
                    <div>
                      <p class="sr-only" ?hidden="${this.hideNav}">
                        Slides list:
                      </p>
                      ${this.sources.map(
                        item => html`
                          <button
                            id="${item.id}"
                            aria-controls="carousel"
                            class="gallerythumb"
                            index="${item.index}"
                            @click="${e => this._itemChanged(item.id)}"
                            ?disabled="${this.selected.id === item.id}"
                          >
                            <iron-image
                              alt="${item.alt}"
                              fade
                              sizing="cover"
                              src="${item.thumbnail}"
                            >
                            </iron-image>
                          </button>
                          <simple-tooltip
                            for="${item.id}"
                            ?hidden="${this.selected.id === item.id}"
                            position="top"
                          >
                            ${item.alt}
                          </simple-tooltip>
                        `
                      )}
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
    /*let target = this.shadowRoot.querySelector("#carouselitem");
    if (this.selected.scroll && target) {
      this._scrollIntoView([this._getParentOffset(target)]);
      if (!this.selected.zoomed) target.focus();
    }*/
  }
  /**
   * gets whether navigation should be hidden
   *
   * @readonly
   * @memberof LrndesignGalleryCarousel
   */
  get hideNav() {
    console.log('hideNav',this,this.sources,this.sources !== undefined ? this.sources.length < 2 : true)
    return this.sources !== undefined ? this.sources.length < 2 : true;
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

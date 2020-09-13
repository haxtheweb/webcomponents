/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import { LrndesignGalleryBehaviors } from "./lrndesign-gallery-behaviors.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "@polymer/iron-image/iron-image.js";
import "@polymer/iron-icons/iron-icons.js";
import "./lrndesign-gallery-zoom.js";
import "./lrndesign-gallery-details.js";

/**
 * `lrndesign-gallery-carousel`
 * An element that renders a collection of gallery items into a carousel or a single media item into a layout.
 *
### Styling

`<lrndesign-gallery-carousel>` provides following custom properties and mixins
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--lrndesign-gallery-color` | text color | --simple-colors-default-theme-grey-12
`--lrndesign-gallery-background-color` | background color | --simple-colors-default-theme-grey-2
`--lrndesign-gallery-border-color` | subtle border color | --simple-colors-default-theme-grey-4
`--lrndesign-gallery-focus-color` | accent color | --simple-colors-default-theme-accent-9
`--lrndesign-gallery-thumbnail-outline` | thumbnail outline color | 1px solid var(--simple-colors-default-theme-grey-12);
`--lrndesign-gallery-dialog-color` | zoom dialog text color | --simple-colors-default-theme-grey-12
`--lrndesign-gallery-dialog-background-color` | zoom dialog background-color | --simple-colors-default-theme-grey-1
`--lrndesign-gallery-dialog-titlebar-color` | zoom dialog title bar text color | --simple-colors-default-theme-grey-1
`--lrndesign-gallery-dialog-titlebar-background-color` | zoom dialog title bar background-color | --simple-colors-default-theme-accent-9
`--lrndesign-gallery-dialog-header-color` | zoom dialog header bar text color | --simple-colors-default-theme-grey-12
`--lrndesign-gallery-dialog-header-background-color` | zoom dialog header bar background-color | --simple-colors-default-theme-grey-2
`--lrndesign-gallery-carousel-next-bg` | gradient on carousel next button | linear-gradient(to right,rgba(255, 255, 255, 0) 0%,rgba(255, 255, 255, 0.5) 50%,rgba(255, 255, 255, 0.7) 70%,rgba(255, 255, 255, 0.9) 90%);
`--lrndesign-gallery-carousel-prev-bg` | gradient on carousel prev button | linear-gradient(to right,rgba(255, 255, 255, 0.9) 10%,rgba(255, 255, 255, 0.7) 30%,rgba(255, 255, 255, 0.5) 50%,rgba(255, 255, 255, 0) 100%);
 *
 * @element lrndesign-gallery-carousel
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
          margin: 15px 0;
          padding: 0;
          --carousel-image-height: unset;
          border: 1px solid var(--lrndesign-gallery-border-color);
        }
        :host([hidden]),
        :host [hidden] {
          display: none !important;
        }
        :host([responsive-size="md"]) {
          --carousel-image-border-top: 4px solid
            var(--lrndesign-gallery-focus-color);
          --lrndesign-gallery-image-height: unset;
          --carousel-image-height: var(--carousel-image-height-md, 200px);
        }
        :host([responsive-size="lg"]) {
          --carousel-image-border-top: 4px solid
            var(--lrndesign-gallery-focus-color);
          --lrndesign-gallery-image-height: unset;
          --carousel-image-height: var(--carousel-image-height-lg, 300px);
        }
        :host([responsive-size="xl"]) {
          --carousel-image-border-top: 4px solid
            var(--lrndesign-gallery-focus-color);
          --lrndesign-gallery-image-height: unset;
          --carousel-image-height: var(--carousel-image-height-xl, 400px);
        }
        :host([responsive-size*="s"]),
        :host([extra-wide]) {
          --carousel-image-height: unset;
          --carousel-image-border-top: unset;
        }
        #carouselitem {
          width: 100%;
          color: var(--lrndesign-gallery-color);
          background-color: var(--lrndesign-gallery-background-color);
          border-top: var(--lrndesign-gallery-border-top);
          --carousel-image-flex: 0 0
            calc(
              var(--carousel-image-height, 200px) *
                var(--lrndesign-gallery-image-aspect, 1.33333333333)
            );
        }
        #carouselimage,
        #carouseltext,
        #thumbnails,
        .prevnextnav,
        :host(:not([responsive-size*="s"]):not([extra-wide])) #carouselitem {
          display: flex;
          justify-content: space-between;
          align-items: stretch;
        }
        #carouselitem,
        #carouselitem > * {
          height: var(--carousel-image-height);
          max-height: var(--carousel-image-height);
        }
        #carouselimage {
          flex: var(--carousel-image-flex);
          position: relative;
        }
        :host([responsive-size*="s"]) #carouselimage,
        :host([extra-wide]) #carouselimage {
          width: 100%;
          padding-top: var(--lrndesign-gallery-image-height, 75%);
        }
        #carouselimage iron-image,
        .prevnextnav {
          position: absolute;
          width: 100%;
          top: 0;
          bottom: 0;
        }
        .prevnextnav {
          align-items: center;
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
        .prevnextnav[hidden] {
          display: none;
        }
        #carouselnext {
          right: 0;
          width: 50%;
        }
        #carouselprev {
          left: 0;
          width: 50%;
          justify-content: flex-start;
          background: var(--lrndesign-gallery-prev-bg);
        }
        .prevnextnav:focus,
        .prevnextnav:hover {
          outline: none;
          opacity: 0.8;
        }
        .prevnextnav[disabled]:focus,
        .prevnextnav[disabled]:hover {
          cursor: not-allowed;
          opacity: 0.1;
        }
        .prevnextnav:focus iron-icon,
        .prevnextnav:hover iron-icon {
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
        lrndesign-gallery-zoom {
          border: 1px solid transparent;
          transition: outline 0.25s ease-in-out;
        }
        lrndesign-gallery-zoom:focus-within,
        lrndesign-gallery-zoom:hover {
          border: 1px solid var(--lrndesign-gallery-color);
          transition: outline 0.25s ease-in-out;
        }
        .zoombg,
        .zoomicon {
          top: 0;
          left: 0;
        }
        #carouseltext {
          position: relative;
          flex-direction: column;
        }
        :host([responsive-size="xs"]) #carouseltext,
        :host([extra-wide]) #carouseltext {
          margin-top: -4px;
          border-top: 4px solid var(--lrndesign-gallery-focus-color);
        }
        #carouseltext > * {
          margin: 10px;
        }
        #carouseltext,
        #details {
          flex: 1 1 auto;
        }
        #itemtitle,
        #thumbails {
          flex: 0 0 auto;
        }
        #itemtitle {
          font-size: 160%;
        }
        #details {
          overflow-y: auto;
        }
        #thumbnails {
          flex-direction: row;
          flex-wrap: wrap;
          flex: 0 0 auto;
          height: 46px;
          justify-content: flex-start;
          overflow-x: auto;
        }
        .gallerythumb,
        .gallerythumb img {
          width: 40px;
          height: 40px;
        }
        .gallerythumb {
          margin: 0 3px;
          background-color: transparent;
          background-image: var(--lrndesign-gallery-thumb-url);
          background-position: center;
          background-repeat: no-repeat;
        }
        .gallerythumb img {
          outline: 1px solid var(--lrndesign-gallery-color);
          transition: all 0.25s ease-in-out;
        }
        .gallerythumb:not([disabled]):hover img,
        .gallerythumb:not([disabled]):focus img {
          width: 42px;
          height: 42px;
          outline: 1px solid var(--lrndesign-gallery-focus-color);
          transition: all 0.25s ease-in-out;
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
          margin: 0;
          position: absolute;
          right: 10px;
          top: 10px;
          font-size: 80%;
        }
      `,
    ];
  }

  // render function
  render() {
    return html`
      <article id="carousel">
        <p class="sr-only">A carousel of items:</p>
        <div
          id="carouselitem"
          ?dark="${this.dark}"
          ?extra-wide="${this.extraWide}"
          responsive-size="${this.responsiveSize}"
        >
          <p id="xystart" class="sr-only">Slide ${this.selected.xofy}.</p>
          <div id="carouselimage">
            <iron-image
              .alt="${this.selected.alt}"
              fade
              aria-describedby="carouseltitle details"
              .placeholder="${this.selected.thumbnail}"
              sizing="${this.selected.sizing ||
              this.sizing === "contain" ||
              "cover"}"
              .src="${this.selected.src}"
            >
            </iron-image>
            <lrndesign-gallery-zoom
              .details="${this.selected.details}"
              .heading="${this.selected.heading}"
              id="galleryzoom"
              .src="${this.selected.large}"
              .tooltip="${this.selected.tooltip}"
              .zoom-alt="${this.selected.alt}"
            >
              <div class="zoombg"></div>
              <iron-icon icon="zoom-in" class="zoomicon"></iron-icon>
            </lrndesign-gallery-zoom>
            <button
              id="carouselprev"
              class="prevnextnav"
              aria-controls="carousel"
              aria-label="prev"
              ?hidden="${this.hideNav}"
              ?disabled="${!this.selected || this.selected.prev < 0}"
              @click="${(e) =>
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
              class="prevnextnav"
              aria-controls="carousel"
              aria-label="next"
              ?hidden="${this.hideNav}"
              ?disabled="${!this.selected || this.selected.next < 0}"
              @click="${(e) =>
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
          <div id="carouseltext" class="item-info">
            <h1
              id="carouseltitle"
              ?hidden="${!this.selected.title || this.selected.title == ""}"
            >
              <lrndesign-gallery-details details="${this.selected.title || ""}">
              </lrndesign-gallery-details>
            </h1>
            <lrndesign-gallery-details
              id="details"
              details="${this.selected.details || ""}"
            >
            </lrndesign-gallery-details>
            <div id="xyend" ?hidden="${this.hideNav}">
              <p class="x-of-y">
                (<span class="sr-only"> End of slide </span> ${this.selected
                  .xofy}<span class="sr-only">.</span>)
              </p>
            </div>
            <div id="thumbnails" class="item-info" ?hidden="${this.hideNav}">
              <p class="sr-only" ?hidden="${this.hideNav}">Slides list:</p>
              ${this.sources.map(
                (item) => html`
                  <button
                    id="${item.id}"
                    aria-controls="carousel"
                    class="gallerythumb"
                    .index="${item.index}"
                    @click="${(e) => this._itemChanged(item.id)}"
                    ?disabled="${this.selected.id === item.id}"
                    .style="--lrndesign-gallery-thumb-url:url(${item.thumbnail});background-size:${item.sizing ||
                    this.sizing ||
                    "cover"};background-position:${item.gravity
                      ? item.gravity.replace("-", " ")
                      : "center"}"
                  >
                    <span class="sr-only"
                      >${item.alt || `Item ${parseInt(item.index) + 1}`}</span
                    >
                  </button>
                  <simple-tooltip
                    .for="${item.id}"
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
      </article>
    `;
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
    };
  }

  /**
   * life cycle, element is ready
   */
  constructor() {
    super();
  }
  /**
   * gets whether navigation should be hidden
   *
   * @readonly
   * @memberof LrndesignGalleryCarousel
   */
  get hideNav() {
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

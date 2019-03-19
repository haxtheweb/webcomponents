/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { LrndesignGalleryBehaviors } from "./lrndesign-gallery-behaviors.js";
import "./lrndesign-gallery-details.js";
import "./lrndesign-gallery-zoom.js";

export { LrndesignGalleryCarousel };
/**
 * `lrndesign-gallery-carousel`
 * `An element that renders a collection of gallery items into a carousel or a single media item into a layout.`
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
 * @customElement
 * @polymer
 * @demo demo/index.html demo
 */
class LrndesignGalleryCarousel extends LrndesignGalleryBehaviors {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "lrndesign-gallery-carousel";
  }

  //get gallery behaviors
  static get behaviors() {
    return [LrndesignGalleryBehaviors];
  }

  // render function
  static get template() {
    return html`
      <style is="custom-style" include="lrndesign-gallery-shared-styles">
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
          overflow-y: scroll;
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
          overflow: scroll;
        }
        :host #thumbnails {
          align-self: flex-end;
        }
        :host .gallerythumb[disabled] {
          @apply --lrndesign-gallery-thumbnail-image-selected;
        }
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
      </style>
      <article id="carousel">
        <template is="dom-if" if="[[_isAttrSet(title)]]">
          <h1 id="gallerytitle">[[title]]</h1>
        </template>
        <div id="gallerydescription"><slot></slot></div>
        <p class="sr-only">A carousel of items:</p>
        <div id="galleryscreen">
          <div
            id="carouselitem"
            aspect-ratio$="[[aspectRatio]]"
            dark$="[[dark]]"
            extra-wide$="[[extraWide]]"
            image-style$="[[__imageStyle]]"
            item="[[selected]]"
            responsive-size$="[[responsiveSize]]"
          >
            <p id="xystart" class="sr-only" hidden$="[[_hideNav(items)]]">
              Slide [[selected.xofy]] selected.
            </p>
            <div id="carouselimage">
              <iron-image
                alt$="[[selected.alt]]"
                fade=""
                id$="[[selected.id]]"
                placeholder$="[[selected.thumbnail]]"
                sizing$="[[selected.sizing]]"
                src$="[[selected.src]]"
                style$="[[__imageStyle]]"
              >
              </iron-image>
              <lrndesign-gallery-zoom
                details$="[[selected.details]]"
                heading$="[[selected.heading]]"
                id="galleryzoom"
                item-id="[[selected.id]]"
                src$="[[selected.large]]"
                tooltip$="[[selected.tooltip]]"
                zoom-alt$="[[selected.alt]]"
                zoomed$="[[selected.zoom]]"
              >
                <iron-icon
                  icon="zoom-in"
                  hidden$="[[!_isAttrSet(icon)]]"
                ></iron-icon>
              </lrndesign-gallery-zoom>
              <div id="prevnextnav">
                <paper-button
                  id="carouselprev"
                  aria-controls$="[[__gallery.id]]"
                  aria-label="prev"
                  hidden$="[[_hideNav(items)]]"
                  index$="[[selected.prev]]"
                  on-tap="_onPrev"
                  target$="[[__gallery]]"
                  tabindex="-1"
                  title=""
                >
                  <iron-icon icon="chevron-left"></iron-icon>
                </paper-button>
                <paper-tooltip for="carouselprev" position="top"
                  >previous</paper-tooltip
                >
                <paper-button
                  id="carouselnext"
                  aria-controls$="[[__gallery.id]]"
                  aria-label="next"
                  hidden$="[[_hideNav(items)]]"
                  index$="[[selected.next]]"
                  on-tap="_onNext"
                  target="[[__gallery]]"
                  tabindex="-1"
                  title=""
                >
                  <iron-icon icon="chevron-right"></iron-icon>
                </paper-button>
                <paper-tooltip for="carouselnext" position="top"
                  >next</paper-tooltip
                >
              </div>
            </div>
            <div id="details" class="item-info">
              <div id="details-inner">
                <div id="itemdetails">
                  <h2 id="itemtitle" hidden="[[!_isAttrSet(selected.title)]]">
                    [[selected.title]]
                  </h2>
                  <div id="itembody">
                    <lrndesign-gallery-details
                      details$="[[selected.details]]"
                    ></lrndesign-gallery-details>
                  </div>
                </div>
                <div id="xyend">
                  <p class="x-of-y" hidden$="[[_hideNav(items)]]">
                    (<span class="sr-only"> End of slide </span>
                    [[selected.xofy]]<span class="sr-only">.</span>)
                  </p>
                </div>
                <div id="thumbnails" class="item-info">
                  <div id="thumbnails-inner">
                    <div>
                      <p class="sr-only" hidden$="[[_hideNav(items)]]">
                        Slides list:
                      </p>
                      <template is="dom-repeat" items="[[items]]" as="item">
                        <paper-button
                          id$="[[item.id]]"
                          aria-controls$="[[__gallery.id]]"
                          class="gallerythumb"
                          hidden$="[[_hideNav(items)]]"
                          index$="[[item.index]]"
                          on-tap="_onNavTapped"
                          disabled$="[[_isSelected(selected,item)]]"
                          target$="[[item.target]]"
                          title
                        >
                          <iron-image
                            alt$="[[item.alt]]"
                            fade
                            sizing="cover"
                            src$="[[item.thumbnail]]"
                          >
                          </iron-image>
                        </paper-button>
                        <paper-tooltip
                          for$="[[item.id]]"
                          hidden$="[[_isSelected(selected,item)]]"
                          position="top"
                        >
                          [[item.alt]]
                        </paper-tooltip>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="galleryprint">
          <template id="printlist" is="dom-repeat" items="[[items]]" as="item">
            <section>
              <template is="dom-if" if="[[_isAttrSet(item.title)]]">
                <h2>[[item.title]]</h2>
              </template>
              <lrndesign-gallery-details
                details$="[[item.details]]"
              ></lrndesign-gallery-details>
              <img
                class="print-image"
                alt$="[[item.alt]]"
                src$="[[item.src]]"
              />
            </section>
          </template>
        </div>
      </article>
    `;
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * height css of iron image (sets aspect ratio in xs or extraWide)
       */
      __imageStyle: {
        type: String,
        computed: "_getImageStyle(extraWide,responsiveSize)"
      }
    };
  }

  /**
   * life cycle, element is ready
   */
  ready() {
    super.ready();
    if (this.selected.scroll) {
      let target = this.$.carouselitem;
      this._scrollIntoView([this._getParentOffset(target)]);
      if (!this.selected.zoomed) target.focus();
    }
  }

  /**
   * go to item by id, or index
   *
   * @param {o}
   */
  goToItem(index) {
    let root = this;
    if (typeof index === "number" && index >= 0 && index < root.items.length) {
      root.selected = root.items[index];
    }
  }

  /**
   * returns the proper padding to maintain image aspect ratio and
   *
   * @param {boolean} whether on not the first image is extra wide
   * @param {string} the responsive size of the gallery, as in 'xs','sm','md','lg', or 'xl'
   * @returns {string} the style for the image
   */
  _getImageStyle(extraWide, responsiveSize) {
    if (extraWide || responsiveSize === "xs") {
      return "padding-bottom: " + 100 / this.aspectRatio + "%;";
    } else {
      if (responsiveSize === "xl") {
        return "width: " + this.aspectRatio * 400 + "px; height: 400px;";
      } else if (responsiveSize === "lg") {
        return "width: " + this.aspectRatio * 300 + "px; height: 300px;";
      } else if (responsiveSize === "md") {
        return "width: " + this.aspectRatio * 200 + "px; height: 200px;";
      } else {
        return "width: " + this.aspectRatio * 200 + "px; height: 200px;";
      }
    }
  }

  /**
   * returns index of the previous or next item
   *
   *
   */
  _getIndex(index, step) {
    return index + step;
  }

  /**
   * gets unique id for carousel and sets it as a target
   */
  _hideNav(items) {
    return items !== undefined ? items.length < 2 : true;
  }

  /**
   * when a prev is tapped, goes to the prev item
   */
  _onPrev(e) {
    this.goToItem(parseInt(this.$.carouselprev.getAttribute("index")));
  }

  /**
   * when a next is tapped, goes to the next item
   */
  _onNext(e) {
    this.goToItem(parseInt(this.$.carouselnext.getAttribute("index")));
  }

  /**
   * when a thumbnail is tapped, goes to that item
   */
  _onNavTapped(e) {
    this.goToItem(e.model.item.index);
  }

  /**
   * updates the item details
   */
  _updateDetails() {
    this.$.itembody.innerHTML = this.item.details;
  }
}
window.customElements.define(
  LrndesignGalleryCarousel.tag,
  LrndesignGalleryCarousel
);

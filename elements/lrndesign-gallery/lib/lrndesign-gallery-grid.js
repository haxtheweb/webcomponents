/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import {} from "@polymer/polymer/lib/utils/render-status.js";
import { LrnDesignGalleryBehaviors } from "./lrndesign-gallery-behaviors.js";

export { LrndesignGalleryGrid };
/**
 * `lrndesign-gallery-grid`
 * `An element that renders a collection of gallery items into a grid or a single media item into a layout.`
 *
 * @microcopy - language worth noting:```
<lrndesign-gallery-grid 
  grid-size = "small"               //optional, can be small, medium, or large.
  items = "[]"                      //required, array of items
  sizing = "contain">               //optional, "cover" for cropping (default) or "contain" for letterboxing
</lrndesign-gallery-grid>```
 * where `items` array is:```
[{
  "alt": "IMAGE ALT TEXT",                          //required
  "details": "TEXT ABOUT IMAGE HERE",               //optional 
  "heading": "IMAGE HEADING HERE",                  //required, the image heading when in zoom mode
  "id": "123"                                       //required, unique id  
  "sizing": "contain",                              //optional, "cover" for cropping (default) or "contain" for letterboxing, default is parent's sizing
  "large": "PATH/TO/LARGE/IMAGE/HERE.JPG",          //optional, larger image for zoom instead of src 
  "next": "3",                                      //required, the index of the next item
  "prev": "1",                                      //required, the index of the previous item
  "src": "PATH/TO/FULL/IMAGE/HERE.JPG",             //required
  "thumbnail": "PATH/TO/THUMBAIL/IMAGE/HERE.JPG",   //required
  "tooltip": "IMAGE TOOLTIP HERE",                  //required, the tooltip for the image thumbnail
  "title": "IMAGE TITLE HERE",                      //optional, the image title when viewed
  "type": "image",                                  //required, "image", "video", "audio", etc.
  "zoom": false                                     //optional, false item should have no zoom option, default is true 
}]```
 *
 * @customElement
 * @polymer
 * @demo demo/index.html demo
 */
class LrndesignGalleryGrid extends LrnDesignGalleryBehaviors {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "lrndesign-gallery-grid";
  }

  // render function
  static get template() {
    return html`
      <style is="custom-style" include="lrndesign-gallery-shared-styles">
        :host {
          margin: 15px 0 0;
          padding: 0;
          max-width: 100%;
        }
        :host .gallerythumb iron-icon {
          position: absolute;
          bottom: 7px;
          left: 7px;
        }
        :host .gallerythumb > div {
          position: relative;
        }
        :host .gallerythumb iron-image {
          width: var(--lrndesign-gallery-grid-thumbnail-xs, 100px);
        }
        :host([responsive-size="sm"]) .gallerythumb iron-image {
          width: var(--lrndesign-gallery-grid-thumbnail-sm, 150px);
        }
        :host([responsive-size="md"]) .gallerythumb iron-image {
          width: var(--lrndesign-gallery-grid-thumbnail-md, 200px);
        }
        :host([responsive-size="lg"]) .gallerythumb iron-image {
          width: var(--lrndesign-gallery-grid-thumbnail-lg, 250px);
        }
        :host([responsive-size="xl"]) .gallerythumb iron-image {
          width: var(--lrndesign-gallery-grid-thumbnail-lg, 300px);
        }
        @media print {
          :host #gallerycarousel {
            display: none;
          }
        }
      </style>
      <article id="gallery">
        <template is="dom-if" if="[[_isAttrSet(title)]]">
          <h1 id="gallery-title">[[title]]</h1>
        </template>
        <div id="gallery-description"><slot name="description"></slot></div>
        <p class="sr-only">A list of thumbnail buttons items:</p>
        <div id="galleryscreen">
          <template id="screenlist" is="dom-repeat" items="[[items]]" as="item">
            <lrndesign-gallery-zoom
              anchored-item="[[__anchoredItem]]"
              class="gallerythumb"
              details$="[[item.details]]"
              heading$="[[item.heading]]"
              item-id="[[item.id]]"
              on-gallery-scroll="_handleScroll"
              scrolled$="[[item.scroll]]"
              src$="[[item.large]]"
              tooltip$="[[item.tooltip]]"
              zoom-alt$="[[item.zoomAlt]]"
              zoomed$="[[item.zoom]]"
            >
              <div>
                <iron-image
                  alt$="[[item.zoomAlt]]"
                  fade
                  sizing="cover"
                  src$="[[item.thumbnail]]"
                  style$="[[_getImageStyle(items)]]"
                >
                </iron-image>
                <iron-icon icon="zoom-in"></iron-icon>
              </div>
            </lrndesign-gallery-zoom>
          </template>
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
       * aspect ratio of media
       */
      imageStyle: {
        type: String,
        computed: "_getImageStyle(items)",
        reflectToAttribute: true
      }
    };
  }

  /**
   * handles gallery-scroll event
   */
  _handleScroll(e) {
    this._scrollIntoView([this._getParentOffset(this), e.path[0].offsetTop]);
  }

  /**
   * returns the proper padding to maintain image aspect ratio and updates
   *
   * @param {array} an array of items
   * @returns {string} the style based on the first item
   */
  _getImageStyle(items = []) {
    let img = new Image(),
      padding = 75;
    if (items !== undefined && items.length > 0) {
      img.src = items[0].src;
      if (img.naturalWidth > 0 && img.naturalHeight > 0)
        padding = (100 * img.naturalHeight) / img.naturalWidth;
    }
    return "padding-bottom: " + padding + "%;";
  }
}
window.customElements.define(LrndesignGalleryGrid.tag, LrndesignGalleryGrid);

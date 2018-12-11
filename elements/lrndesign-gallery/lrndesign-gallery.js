/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/responsive-utility/responsive-utility.js";
import "./lib/lrndesign-gallery-details.js";
import "./lib/lrndesign-gallery-carousel.js";
import "./lib/lrndesign-gallery-grid.js";

export { LrndesignGallery };
/**
 * `lrndesign-gallery`
 * `An element that renders a collection of gallery items into a carousel or a single media item into a layout.`
 *
 * @microcopy - language worth noting:```
  <lrndesign-gallery 
    sources = ""                                    //required array of source data
    sizing = "contain"                              //optional, "cover" for cropping (default) or "contain" for letterboxing
    title = "My Carousel">                          //optional
    OPTIONAL TEXT ABOUT THE CAROUSEL OR GRID HERE.
  </lrndesign-gallery>```
 * where `sources` array is:```
[{
  "alt": "IMAGE ALT TEXT",                          //required
  "details": "TEXT ABOUT IMAGE HERE",               //optional 
  "id": "123"                                       //required, unique id  
  "sizing": "contain",                              //optional, "cover" for cropping (default) or "contain" for letterboxing, default is parent's sizing
  "large": "PATH/TO/LARGE/IMAGE/HERE.JPG",          //optional, larger image for zoom instead of src 
  "src": "PATH/TO/FULL/IMAGE/HERE.JPG",             //required
  "thumbnail": "PATH/TO/THUMBAIL/IMAGE/HERE.JPG",   //required
  "title": "IMAGE TITLE HERE",                      //optional
  "type": "image",                                  //required, "image", "video", "audio", etc.
  "zoom": false                                     //optional, false item should have no zoom option, default is true 
}]```
 *  -
 *
 * @extends SimpleColors
 * @customElement
 * @polymer
 * @demo demo/index.html demo
 */
class LrndesignGallery extends SimpleColors {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "lrndesign-gallery";
  }

  //get player-specifc properties
  static get behaviors() {
    return [SimpleColors];
  }

  // render function
  static get template() {
    return html`
      <style is="custom-style" include="simple-colors">
        :host {
          display: block;
        }
        :host {
          --lrndesign-gallery-color: var(--simple-colors-default-theme-grey-12);
          --lrndesign-gallery-background-color: var(
            --simple-colors-default-theme-grey-2
          );
          --lrndesign-gallery-focus-color: var(
            --simple-colors-default-theme-accent-9
          );
          --lrndesign-gallery-border-color: var(
            --simple-colors-default-theme-grey-4
          );
          --lrndesign-gallery-thumbnail-outline: 1px solid
            var(--simple-colors-default-theme-grey-12);
          --lrndesign-gallery-carousel-next-bg: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.5) 50%,
            rgba(255, 255, 255, 0.7) 70%,
            rgba(255, 255, 255, 0.9) 90%
          );
          --lrndesign-gallery-carousel-prev-bg: linear-gradient(
            to right,
            rgba(255, 255, 255, 0.9) 10%,
            rgba(255, 255, 255, 0.7) 30%,
            rgba(255, 255, 255, 0.5) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          --lrndesign-gallery-thumbnail-size: 100px;
          --lrndesign-gallery-thumbnail-size-sm: 150px;
          --lrndesign-gallery-thumbnail-size-md: 200px;
          --lrndesign-gallery-thumbnail-size-lg: 250px;
          --lrndesign-gallery-thumbnail-size-xl: 300px;
          --lrndesign-gallery-thumbnail-image: {
            display: block;
            border-radius: 3px;
            border: 2px solid transparent;
          }
          --lrndesign-gallery-thumbnail-image-focus: {
            opacity: 0.7;
            border: 2px solid var(--lrndesign-gallery-focus-color);
          }
          --lrndesign-gallery-thumbnail-image-selected: {
            opacity: 0.5;
            cursor: default;
          }
        }
        :host([dark]) {
          --lrndesign-gallery-border-color: var(
            --simple-colors-default-theme-grey-1
          );
          --lrndesign-gallery-carousel-next-bg: linear-gradient(
            to right,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.5) 50%,
            rgba(0, 0, 0, 0.7) 70%,
            rgba(0, 0, 0, 0.9) 90%
          );
          --lrndesign-gallery-carousel-prev-bg: linear-gradient(
            to right,
            rgba(0, 0, 0, 0.9) 10%,
            rgba(0, 0, 0, 0.7) 30%,
            rgba(0, 0, 0, 0.5) 50%,
            rgba(0, 0, 0, 0) 100%
          );
        }
        :host .gallery-print {
          display: none;
        }
        @media print {
          :host .gallery-print {
            margin-top: 15px;
            margin-bottom: 15px;
            display: block;
          }
          :host .gallery-print .print-image {
            max-width: 400px;
            max-height: 400px;
            display: block;
            border: 1px solid #ddd;
            page-break-inside: avoid;
          }
        }
      </style>
      <article>
        <template is="dom-if" if="[[_isAttrSet(title)]]">
          <h1 id="gallery-title">[[title]]</h1>
        </template>
        <div id="gallery-description"><slot name="description"></slot></div>
        <template is="dom-if" if="[[grid]]">
          <lrndesign-gallery-grid
            aspect$="[[aspect]]"
            class="gallery-type"
            id="gallery-grid"
            items$="[[__items]]"
            modal-open$="[[__modalOpen]]"
            responsive-size$="[[responsiveSize]]"
            selected$="[[selected]]"
            sizing$="[[sizing]]"
          >
          </lrndesign-gallery-grid>
        </template>
        <template is="dom-if" if="[[!grid]]">
          <lrndesign-gallery-carousel
            aspect$="[[aspect]]"
            class="gallery-type"
            hide-navigation$="[[__hideNav]]"
            id="gallery-carousel"
            items$="[[__items]]"
            modal-open$="[[__modalOpen]]"
            responsive-size$="[[responsiveSize]]"
            selected$="[[selected]]"
            sizing$="[[sizing]]"
          >
          </lrndesign-gallery-carousel>
        </template>

        <template id="printlist" is="dom-repeat" items="[[items]]" as="item">
          <section class="gallery-print">
            <template is="dom-if" if="[[hasTitle]]">
              <h2>[[item.title]]</h2>
            </template>
            <lrndesign-gallery-details
              details$="[[item.details]]"
            ></lrndesign-gallery-details>
            <img class="print-image" alt$="[[item.alt]]" src$="[[item.src]]" />
          </section>
        </template>
      </article>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * thumbnail grid layout, default is false (carousel layout)
       */
      grid: {
        type: Boolean,
        value: false
      },
      /**
       * array of carousel/grid items
       */
      sources: {
        type: Array,
        value: []
      },
      /**
       * array of carousel/grid items
       */
      items: {
        type: Array,
        computed: "_itemsLoaded(sources,sizing)"
      },
      /*
       * parent size for responsive styling
       */
      responsiveSize: {
        type: String,
        value: "xs",
        reflectToAttribute: true
      },
      /*
       * data for the selected item
       */
      selected: {
        type: Object,
        value: {},
        notify: true,
        reflectToAttribute: true
      },
      /**
       * default sizing: fit screen by cropping (cover)
       * or with letterboxing (contain)
       */
      sizing: {
        type: String,
        value: "cover"
      },
      /**
       * carousel's title
       */
      title: {
        type: String,
        value: null
      },
      /*
       * open modal based on anchor
       */
      __modalOpen: {
        type: Boolean,
        value: false
      }
    };
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    let root = this;
    window.ResponsiveUtility.requestAvailability();
    window.dispatchEvent(
      new CustomEvent("responsive-element", {
        detail: {
          element: root,
          attribute: "responsive-size",
          relativeToParent: true
        }
      })
    );
  }

  /*
   * adds additional properties to gallery
   */
  _itemsLoaded(sources, sizing) {
    let temp = sources.slice(),
      anchor = window.location.hash,
      index = sources.findIndex(
        i => "#" + i.id === anchor.replace("-zoom", "")
      );
    if (sources !== undefined && this.items !== null && sources.length > 0) {
      for (var i in temp) {
        temp[i].index = parseInt(i);
        temp[i].large =
          temp[i].large !== undefined ? temp[i].large : temp[i].src;
        temp[i].next = parseInt(i) + 1 < sources.length ? parseInt(i) + 1 : -1;
        temp[i].prev = parseInt(i) - 1 > -1 ? parseInt(i) - 1 : -1;
        temp[i].sizing = temp[i].sizing !== undefined ? temp[i].sizing : sizing;
        temp[i].tooltip =
          temp[i].title !== undefined ? "Zoom In" : temp[i].title + " Zoom";
        temp[i].thumbnail =
          temp[i].thumbnail !== undefined ? temp[i].thumbnail : temp[i].src;
        temp[i].zoom = temp[i].zoom !== undefined ? temp[i].zoom : true;
        if (!temp[i].zoom) {
          temp[i].heading =
            temp[i].title === undefined ? "Image Information" : temp[i].title;
          temp[i].tooltip =
            temp[i].title === undefined
              ? "View Image Information"
              : temp[i].title + " Information";
        } else {
          temp[i].heading =
            temp[i].title === undefined
              ? "Image Zoom"
              : temp[i].title + " (Image Zoom)";
          temp[i].tooltip =
            temp[i].title === undefined ? "Zoom In" : temp[i].title + " Zoom";
        }
      }
      this.__items = temp;
      this.selected = index > -1 ? this.__items[index] : this.__items[0];
      return this.__items;
    }
  }

  /**
   * returns true if the given attribute is not null
   */
  _isAttrSet(attr) {
    return attr !== null && attr !== undefined;
  }
}
window.customElements.define(LrndesignGallery.tag, LrndesignGallery);

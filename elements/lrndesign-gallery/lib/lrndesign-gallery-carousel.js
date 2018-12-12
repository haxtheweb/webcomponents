/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-image/iron-image.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "./lrndesign-gallery-details.js";

export { LrndesignGalleryCarousel };
/**
 * `lrndesign-gallery-carousel`
 * `An element that renders a collection of gallery items into a carousel or a single media item into a layout.`
 *
 * @microcopy - language worth noting:```
 <lrndesign-gallery-carousel 
  items = "[]"                      //required, array of items
  sizing = "contain">               //optional, "cover" for cropping (default) or "contain" for letterboxing
</lrndesign-gallery-carousel>```
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
class LrndesignGalleryCarousel extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "lrndesign-gallery-carousel";
  }
  // render function
  static get template() {
    return html`
      <style is="custom-style">
        :host {
          display: block;
          margin: 15px 0 0;
          padding: 0;
        }
        :host .sr-only {
          position: absolute;
          left: -999999;
          height: 0;
          width: 0;
          overflow: hidden;
        }
        :host #gallery[hide-navigation] .navigation {
          display: none;
        }
        :host #carousel-item {
          width: 100%;
          color: var(--lrndesign-gallery-color);
          background-color: var(--lrndesign-gallery-background-color);
          border: 1px solid var(--lrndesign-gallery-border-color);
        }
        :host(:not([responsive-size="xs"]):not([extra-wide])) #carousel-item {
          display: flex;
          justify-content: space-between;
          align-items: stretch;
          border-top: 4px solid var(--lrndesign-gallery-focus-color);
        }
        :host #carousel-image {
          position: relative;
        }
        :host #carousel-image iron-image {
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
        :host([responsive-size="sm"]:not([extra-wide])) #carousel-item,
        :host([responsive-size="sm"]:not([extra-wide])) #prevnextnav,
        :host([responsive-size="md"]:not([extra-wide])) #carousel-item,
        :host([responsive-size="md"]:not([extra-wide])) #prevnextnav {
          height: 200px;
          max-height: 200px;
        }
        :host([responsive-size="lg"]:not([extra-wide])) #carousel-item,
        :host([responsive-size="lg"]:not([extra-wide])) #prevnextnav {
          height: 300px;
          max-height: 300px;
        }
        :host([responsive-size="xl"]:not([extra-wide])) #carousel-item,
        :host([responsive-size="xl"]:not([extra-wide])) #prevnextnav {
          height: 400px;
          max-height: 400px;
        }
        :host #prevnextnav paper-button {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          opacity: 0;
          margin: 0;
          border-radius: 0;
          color: var(--lrndesign-gallery-color);
          background-color: var(--lrndesign-gallery-background-color);
          --paper-button-ink-color: var(--lrndesign-gallery-background-color);
          background: var(--lrndesign-gallery-carousel-next-bg);
          transition: opacity 0.5s;
        }
        :host #prevnextnav paper-button[item="-1"] {
          display: none;
        }
        :host #prevnextnav paper-button:focus,
        :host #prevnextnav paper-button:hover {
          opacity: 0.8;
        }
        :host #prevnextnav #carouselprev {
          justify-content: flex-start;
          background: var(--lrndesign-gallery-carousel-prev-bg);
        }
        :host #prevnextnav iron-icon {
          margin: 10%;
        }
        :host lrndesign-gallery-zoom {
          left: 0;
          bottom: 0px;
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
        :host #itemtitle {
          margin-top: 0;
        }
        :host #thumbnails {
          align-self: flex-end;
        }

        @media screen {
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
          :host #prevnextnav paper-button {
            position: absolute;
            left: 0;
            top: 0;
            width: 50%;
            height: 100%;
          }
          :host #prevnextnav #carouselnext {
            left: 50%;
            text-align: right;
          }
          :host #thumbslist {
            overflow-y: auto !important;
          }
          :host .lrndesign-gallery-thumb {
            min-width: unset;
            max-width: 100%;
            padding: 0;
            margin: 0;
            display: inline-block;
            transform: none !important;
            position: static !important;
            cursor: pointer;
          }
          :host .lrndesign-gallery-thumb iron-image {
            width: 40px;
            height: 40px;
            @apply --lrndesign-gallery-thumbnail-image;
          }
          :host([responsive-size="xs"]) .lrndesign-gallery-thumb iron-image {
            display: none;
          }
          :host([responsive-size="md"]) .lrndesign-gallery-thumb iron-image {
            width: 45px;
            height: 45px;
          }
          :host([responsive-size="lg"]) .lrndesign-gallery-thumb iron-image,
          :host([responsive-size="xl"]) .lrndesign-gallery-thumb iron-image {
            width: 50px;
            height: 50px;
          }
          :host .lrndesign-gallery-thumb:focus iron-image,
          :host .lrndesign-gallery-thumb:hover iron-image {
            @apply --lrndesign-gallery-thumbnail-image-focus;
          }
          :host .lrndesign-gallery-thumb[selected="selected"] {
            @apply --lrndesign-gallery-thumbnail-image-selected;
          }
        }
        @media print {
          :host #gallery {
            display: none;
          }
        }
      </style>
      <p class="sr-only navigation">A carousel of items:</p>
      <a id$="[[__timestamp]]"></a>
      <div
        id="gallery"
        tabindex="-1"
        aria-live="polite"
        hide-navigation$="[[__hideNav]]"
      >
        <div
          id="carousel-item"
          aspect-ratio$="[[aspectRatio]]"
          dark$="[[dark]]"
          extra-wide$="[[extraWide]]"
          image-style$="[[imageStyle]]"
          item="[[selected]]"
          responsive-size$="[[responsiveSize]]"
        >
          <p id="xystart" class="sr-only">Slide [[__xOfY]] selected.</p>
          <div id="carousel-image">
            <iron-image
              alt$="[[selected.alt]]"
              fade=""
              id$="[[selected.id]]"
              placeholder$="[[selected.thumbnail]]"
              sizing$="[[selected.sizing]]"
              src$="[[selected.src]]"
              style$="[[imageStyle]]"
            >
            </iron-image>
            <lrndesign-gallery-zoom
              dark$="[[dark]]"
              details$="[[selected.details]]"
              heading$="[[selected.heading]]"
              hidden$="[[!selected.zoom]]"
              icon="zoom-in"
              id="gallery-zoom"
              item-id="[[selected.id]]"
              src$="[[selected.large]]"
              tooltip$="[[selected.tooltip]]"
              zoom-alt$="[[selected.alt]]"
            >
            </lrndesign-gallery-zoom>
            <div id="prevnextnav">
              <paper-button
                id="carouselprev"
                aria-controls$="[[__gallery.id]]"
                aria-label="prev"
                class="navigation"
                hidden$="[[__hideNav]]"
                item$="[[selected.prev]]"
                on-click="_onPrev"
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
                class="navigation"
                hidden$="[[__hideNav]]"
                item$="[[selected.next]]"
                on-click="_onNext"
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
                <p class="x-of-y navigation" hidden$="[[__hideNav]">
                  (<span class="sr-only"> End of slide </span> [[__xOfY]]<span
                    class="sr-only"
                    >.</span
                  >)
                </p>
              </div>
              <div id="thumbnails" class="item-info">
                <div id="thumbnails-inner">
                  <div>
                    <p class="sr-only navigation" hidden$="[[__hideNav]">
                      Slides list:
                    </p>
                    <template is="dom-repeat" items="[[__items]]" as="item">
                      <paper-button
                        class="lrndesign-gallery-thumb"
                        aria-controls$="[[__gallery.id]]"
                        class="navigation"
                        item$="[[item.id]]"
                        on-click="_onNavTapped"
                        selected$="[[_isSelected(selected)]]"
                        target$="[[item.target]]"
                        title$="[[item.alt]]"
                      >
                        <iron-image
                          alt$="[[item.alt]]"
                          class="lrndesign-gallery-thumb-image"
                          fade
                          sizing="cover"
                          src$="[[item.thumbnail]]"
                        >
                        </iron-image>
                      </paper-button>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * aspect ratio of media
       */
      aspectRatio: {
        type: Number,
        value: "1.33333333"
      },
      /**
       * size for responsive CSS
       */
      extraWide: {
        type: Boolean,
        computed: "_getExtraWide(items)",
        reflectToAttribute: true
      },
      /**
       * height css of iron image (sets aspect ratio in xs or extraWide)
       */
      imageStyle: {
        type: String,
        computed: "_getImageStyle(extraWide,responsiveSize)"
      },
      /**
       * array of carousel items
       */
      items: {
        type: Array,
        value: [],
        observer: "_itemsLoaded"
      },
      /**
       * the parent item
       */
      parent: {
        type: Object,
        value: {}
      },
      /**
       * responsive size
       */
      responsiveSize: {
        type: String,
        notify: true
      },
      /**
       * data for the selected item
       */
      selected: {
        type: Object,
        value: {}
      },
      /**
       * default sizing: fit parent by cropping (cover)
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
      }
    };
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.__gallery = this.$.gallery;
    //set a unique identifier so that we can scroll to the item
    this.__timestamp = "gallery-anchor-" + Date.now();
    if (this.__setScroll) {
      document.getElementById(this.__timestamp).scrollIntoView();
    }
  }

  /**
   * go to item by id, or index
   */
  goToItem(selection, setThumbnail, setScroll) {
    let root = this,
      index =
        typeof selection == "number"
          ? selection
          : root.items.findIndex(i => i.id === selection);
    setThumbnail = setThumbnail !== undefined ? setThumbnail : false;
    this.__setScroll = setScroll !== undefined ? setScroll : false;
    if (typeof index === "number" && index >= 0 && index < root.items.length) {
      root.selected = root.items[index];
      root.__xOfY =
        parseInt(root.selected.index + 1) + " of " + root.items.length;
    }
  }

  /**
   * returns the proper padding to maintain image aspect ratio and updates
   */
  _getExtraWide(items) {
    let img = new Image();
    if (items !== undefined && items.length > 0) {
      img.src = items[0].src;
      this.aspectRatio =
        img.naturalWidth > 0 && img.naturalHeight > 0
          ? img.naturalWidth / img.naturalHeight
          : 1.33333333;
      return this.aspectRatio > 2;
    } else {
      return false;
    }
  }

  /**
   * returns the proper padding to maintain image aspect ratio and updates
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
   */
  _getIndex(index, step) {
    return index + step;
  }

  /**
   * sets selected attribute of thumbnail
   */
  _isSelected(selected) {
    return selected ? "selected" : "";
  }

  /**
   * returns true if the given attribute is not null
   */
  _isAttrSet(attr) {
    return attr !== null && attr !== undefined;
  }

  /**
   * gets unique id for carousel and sets it as a target
   */
  _itemsLoaded() {
    let anchor, item, index;
    this.__items = this.items;
    this.__hideNav = this.items !== undefined ? this.items.length < 2 : true;
    anchor = window.location.hash.replace("#", "");
    item = this.items.findIndex(i => i.id === anchor.replace("-zoom", ""));
    index = item !== undefined && item > 0 ? item : 0;
    this.goToItem(index, true, index !== 0);
  }

  /**
   * when a prev is tapped, goes to the prev item
   */
  _onPrev() {
    this.goToItem(parseInt(this.$.carouselprev.getAttribute("item")), false);
  }

  /**
   * when a next is tapped, goes to the next item
   */
  _onNext() {
    this.goToItem(parseInt(this.$.carouselnext.getAttribute("item")), false);
  }

  /**
   * when a thumbnail is tapped, goes to that item
   */
  _onNavTapped(e) {
    this.goToItem(e.model.item.id, true);
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

/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@polymer/iron-image/iron-image.js";
import "@polymer/iron-icons/iron-icons.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";

/**
 * `lerndesign-gallery-behaviors`
 * A set of properties for lerndesign-gallery components.
 *
 * @customElement lerndesign-gallery-behaviors
 * @extends SimpleColors
 *
 * @microcopy - language worth noting:
 *  -
 *
 */
class LrndesignGalleryBehaviors extends SimpleColors {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "lrndesign-gallery-behaviors";
  }
  
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        
        :host([hidden]) {
          display: none;
        }
        :host {
          display: block;
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

          --lrndesign-gallery-dialog-color: var(
            --simple-colors-default-theme-grey-12
          );
          --lrndesign-gallery-dialog-background-color: var(
            --simple-colors-default-theme-grey-1
          );
          --lrndesign-gallery-dialog-titlebar-color: var(
            --simple-colors-default-theme-grey-1
          );
          --lrndesign-gallery-dialog-titlebar-background-color: var(
            --simple-colors-default-theme-accent-9
          );
          --lrndesign-gallery-dialog-header-color: var(
            --simple-colors-default-theme-grey-12
          );
          --lrndesign-gallery-dialog-header-background-color: var(
            --simple-colors-default-theme-grey-2
          );
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
        :host([hidden]) {
          display: none;
        }
        .sr-only {
          position: absolute;
          left: -999999;
          height: 0;
          width: 0;
          overflow: hidden;
        }
        .gallerythumb {
          min-width: unset;
          max-width: 100%;
          padding: 0;
          margin: 0;
          display: inline-block;
          transform: none !important;
          position: static !important;
          cursor: pointer;
        }
        /*TODO
        :host .gallerythumb iron-image {
          @apply --lrndesign-gallery-thumbnail-image;
        }
        :host .gallerythumb:focus iron-image,
        :host .gallerythumb:hover iron-image {
          @apply --lrndesign-gallery-thumbnail-image-focus;
        }*/
        lrndesign-gallery-zoom iron-icon {
          width: 24px;
          height: 24px;
          opacity: 0.5;
          border-radius: 3px;
          color: var(--lrndesign-gallery-color);
          background-color: var(--lrndesign-gallery-dialog-background-color);
          transition: opacity 0.5s;
        }
        lrndesign-gallery-zoom:focus iron-icon,
        lrndesign-gallery-zoom:hover iron-icon {
          opacity: 1;
        }
        #galleryprint {
          display: none;
        }
        @media print {
          #galleryscreen {
            display: none;
          }
          #galleryprint {
            display: block;
          }
          #galleryprint section {
            margin-top: 15px;
            margin-bottom: 15px;
          }
          #galleryprint .print-image {
            max-width: 400px;
            max-height: 400px;
            display: block;
            border: 1px solid #ddd;
            page-break-inside: avoid;
          }
        }
      `
    ];
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      /**
       * a named anchor for the gallery
       */
      anchorData: {
        type: Object
      },
      /**
       * aspect ratio of media
       */
      aspectRatio: {
        type: Number
      },
      /**
       * size for responsive CSS
       */
      extraWide: {
        type: Boolean,
        reflect: true,
        attribute: "extra-wide"
      },
      /**
       * gallery's unique id
       */
      galleryId: {
        type: String
      },
      /**
       * size for responsive CSS
       */
      grid: {
        type: Boolean
      },
      /*
       * parent size for responsive styling
       */
      responsiveSize: {
        type: String,
        reflect: true,
        attribute: "responsive-size"
      },
      /*
       * id of item
       */
      selected: {
        type: Object
      },
      /*
       * array of gallery items
       */
      sources: {
        type: Array
      },
      /**
       * default sizing: fit screen by cropping (cover)
       * or with letterboxing (contain)
       */
      sizing: {
        type: String
      },
      /**
       * gallery's title
       */
      title: {
        type: String
      }
    };
  }

  constructor() {
    super();
    this.aspectRatio = 1.33333333;
    this.extraWide = false;
    this.grid = false;
    this.responsiveSize = "xs";
    this.selected = {};
    this.sizing = "cover";
    this.sources = [];
  }

  
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "selected") console.log("selected",this.selected);
    });
  }

  get galleryPrint() {
    return html`
      <div id="galleryprint">
        ${(this.sources|| []).map(
          item =>
            html`
              <section>
                <h2 ?hidden="${!item.title || item.title === ""}">
                  ${item.title}
                </h2>
                <lrndesign-gallery-details
                  details="${item.details}"
                ></lrndesign-gallery-details>
                <img class="print-image" alt="${item.alt}" src="${item.src}" />
              </section>
            `
        )}
      </div>
    `;
  }

  /**
   * returns the proper padding to maintain image aspect ratio and
   *
   * @readonly
   * @memberof LrndesignGalleryBehaviors
   */
  get imageStyle() {
    console.log('imageStyle');
    console.log('extraWide',this.extraWide);
    console.log('responsiveSize',this.responsiveSize);
    console.log('aspectRatio',this.aspectRatio);
    if (this.extraWide || this.responsiveSize === "xs") {
      return "padding-bottom: " + 100 / this.aspectRatio + "%;";
    } else {
      if (this.responsiveSize === "xl") {
        return "width: " + this.aspectRatio * 400 + "px; height: 400px;";
      } else if (this.responsiveSize === "lg") {
        return "width: " + this.aspectRatio * 300 + "px; height: 300px;";
      } else if (this.responsiveSize === "md") {
        return "width: " + this.aspectRatio * 200 + "px; height: 200px;";
      } else {
        return "width: " + this.aspectRatio * 200 + "px; height: 200px;";
      }
    }
  }

  /**
   * Generate a UUID
   */
  _generateUUID() {
    return "ss-s-s-s-sss".replace(/s/g, 
      Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1));
  }

  /**
   * gets parent node's offset in light DOM
   *
   * @param {object} the node
   * @returns {number} the parent node's offset in pixels
   */
  _getParentOffset(node) {
    let parent = node.parentNode;
    if (
      parent !== undefined &&
      parent !== null &&
      parent.nodeType === Node.DOCUMENT_FRAGMENT_NODE
    ) {
      parent = parent.host;
    }
    return parent.offsetTop;
  }

  _itemChanged(query){
    console.log('_itemChanged',query);
    /**
     * Handles changes in selected item by firing an event to the gallery
     *
     * @event item-changed
     */
    this.dispatchEvent(
      new CustomEvent("item-changed", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: query
      })
    );
  }

  /**
   * tallies the offsets (item and parent) and scrolls to the item
   *
   * @param {array} an array of offsets
   */
  _scrollIntoView(offsets = [0]) {
    window.scrollTo({
      top: offsets.reduce((total, num) => {
        return total + num;
      }),
      behavior: "smooth"
    });
  }
}
window.customElements.define(
  LrndesignGalleryBehaviors.tag,
  LrndesignGalleryBehaviors
);
export { LrndesignGalleryBehaviors };

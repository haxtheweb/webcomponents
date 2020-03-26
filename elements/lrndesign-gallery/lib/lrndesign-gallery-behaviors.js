/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@polymer/iron-image/iron-image.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/paper-button/paper-button.js";
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
        :host .sr-only {
          position: absolute;
          left: -999999;
          height: 0;
          width: 0;
          overflow: hidden;
        }
        :host .gallerythumb {
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
        :host lrndesign-gallery-zoom iron-icon {
          width: 24px;
          height: 24px;
          opacity: 0.5;
          border-radius: 3px;
          color: var(--lrndesign-gallery-color);
          background-color: var(--lrndesign-gallery-dialog-background-color);
          transition: opacity 0.5s;
        }
        :host lrndesign-gallery-zoom:focus iron-icon,
        :host lrndesign-gallery-zoom:hover iron-icon {
          opacity: 1;
        }
        :host #galleryprint {
          display: none;
        }
        @media print {
          :host #galleryscreen {
            display: none;
          }
          :host #galleryprint {
            display: block;
          }
          :host #galleryprint section {
            margin-top: 15px;
            margin-bottom: 15px;
          }
          :host #galleryprint .print-image {
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
      /**
       * array of carousel/grid items
       */
      items: {
        type: Array
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
       * data for the selected item
       */
      selected: {
        type: Object,
        reflect: true,
        attribute: "selected"
      },
      /**
       * default sizing: fit screen by cropping (cover)
       * or with letterboxing (contain)
       */
      sizing: {
        type: String
      },
      /**
       * array of carousel/grid items
       */
      sources: {
        type: Array
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

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      /*TODO if (propName == "selected") this._selectedChanged(this.selected);*/
    });
  }

  get galleryPrint() {
    return html`
      <div id="galleryprint">
        ${this.items.map(
          item =>
            html`
              <section>
                <h2 ?hidden="${!item.title || item.title === ""}">
                  ${this.item.title}
                </h2>
                <lrndesign-gallery-details
                  details="${this.item.details}"
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
   * gets the items array
   *
   * @readonly
   * @memberof LrndesignGalleryBehaviors
   */
  get items() {
    let sources =
      typeof this.sources === "string"
        ? JSON.parse(this.sources)
        : this.sources;
    if (!this.galleryId) this.id = "gallery-" + this._generateUUID();
    if (sources && sources[0]) this._setAspectProperties(this.sources[0].src);
    return (sources || []).map((source, i) =>
      this._getItemData(source, i, sources.length)
    );
  }

  /**
   * gets aspect ratio of an image and
   * determine if aspect ratio is extra wide
   *
   * @param {array}
   */
  _getAnchorData() {
    let temp =
        window.location.hash !== null && window.location.hash !== ""
          ? window.location.hash.replace("#", "").split("---")
          : [],
      anchorGallery = temp.length > 0 ? temp[0] : -1,
      selectedItemId = temp.length > 1 ? temp[1] : -1,
      selectedItemIndex =
        this.sources !== null
          ? this.sources.findIndex(i => i.id === selectedItemId)
          : 1,
      selectedGallery = anchorGallery === this.galleryId,
      zoom = scroll && temp.length > 2 && temp[2] === "zoom";
    return {
      selectedItemId: selectedItemId,
      selectedItemIndex: selectedItemIndex > 0 ? selectedItemIndex : 0,
      selectedGallery: selectedGallery,
      zoom: zoom
    };
  }

  /**
   * get data for an item
   *
   * @param {object} a gallery item
   * @param {number} the index of the item
   * @returns {object} the reformatted gallery item
   */
  _getItemData(item, index, length) {
    if (this.galleryId === null)
      this.galleryId = "gallery-" + this._generateUUID();
    let anchorData = this._getAnchorData(),
      temp = {};
    temp.details = item.details;
    temp.index = index;
    temp.id = this._selfOrDefault(item.id, this.galleryId + "-item-" + index);
    temp.src = item.src;
    temp.large = this._selfOrDefault(item.large, temp.src);
    temp.thumbnail = this._selfOrDefault(item.thumbnail, temp.src);
    temp.xofy = parseInt(index + 1) + " of " + length;
    temp.next = index + 1 < length ? index + 1 : -1;
    temp.prev = index - 1 > -1 ? index - 1 : -1;
    temp.sizing = this._selfOrDefault(item.sizing, this.sizing);
    temp.title = item.title;
    temp.tooltip = this._selfOrDefault(
      temp.title,
      "Full-Sized Image",
      " (Full-Sized)"
    );
    temp.heading = this._selfOrDefault(
      temp.title,
      "Full-Sized Image",
      " (Full-Sized)"
    );
    temp.zoom = anchorData.zoom && anchorData.selectedItemId === temp.id;
    temp.scroll =
      anchorData.selectedGallery && anchorData.selectedItemId === temp.id;
    temp.tooltip = this._selfOrDefault(item.title, "Zoom In", " Zoom");
    if (anchorData.selectedItemIndex === index) {
      this.set("selected", temp);
    }
    return temp;
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

  /**
   * sets selected attribute of thumbnail
   *
   * @param {object} the selected item
   * @param {object} the current item
   * @returns {boolean} whether current item is selected
   */
  _isSelected(selected = {}, item = {}) {
    return selected.id === item.id;
  }

  /**
   * replaces an undefined value
   *
   * @param {object} the value check
   * @param {object} the default value
   * @param {object} the default value
   * @returns {object} the updated value
   */
  _selfOrDefault(val1 = null, val2 = false, append = null) {
    let val3 = val2;
    if (val1 !== undefined && val1 !== null) {
      if (append !== null) {
        val3 = val1 + append;
      } else {
        val3 = val1;
      }
    }
    return val3;
  }

  /**
   * gets aspect ratio of an image and
   * determine if aspect ratio is extra wide
   *
   * @param {array}
   */
  _setAspectProperties(imgSrc) {
    if (imgSrc !== undefined && imgSrc !== null) {
      let img = new Image();
      img.src = imgSrc;
      this.aspectRatio =
        img.naturalWidth > 0 && img.naturalHeight > 0
          ? img.naturalWidth / img.naturalHeight
          : 1.33333333;
      this.extraWide = this.aspectRatio > 2;
    }
  }

  /**
   * Generate a UUID
   */
  _generateUUID() {
    return "ss-s-s-s-sss".replace(/s/g, this._uuidPart);
  }

  _uuidPart() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
}
window.customElements.define(
  LrndesignGalleryBehaviors.tag,
  LrndesignGalleryBehaviors
);
export { LrndesignGalleryBehaviors };

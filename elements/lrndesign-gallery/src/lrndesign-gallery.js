/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import { LrndesignGalleryBehaviors } from "./lib/lrndesign-gallery-behaviors.js";
import "@lrnwebcomponents/responsive-utility/responsive-utility.js";
import "./lib/lrndesign-gallery-carousel.js";
import "./lib/lrndesign-gallery-grid.js";

/**
 * `lrndesign-gallery`
 * displays images as a carousel or grid with the ability to zoom
 *
 * @customElement lrndesign-gallery
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
class LrndesignGallery extends LrndesignGalleryBehaviors {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  tag() {
    return "lrndesign-gallery";
  }

  // life cycle
  constructor() {
    super();
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    window.ResponsiveUtility.requestAvailability();
    window.dispatchEvent(
      new CustomEvent("responsive-element", {
        detail: {
          element: this,
          attribute: "responsive-size",
          relativeToParent: true
        }
      })
    );
  }
  firstUpdated() {
    super.firstUpdated();
    this.anchorData = this._getAnchorData();
    if (this.anchorData.gallery === this.id) {
      this.goToItem(this.anchorData.id);
    } else {
      this.goToItem();
    }
  }

  /**
   * handle updates
   */
  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "id" && !this.id)
        this.id = `gallery-${this._generateUUID()}`;
    });
  }
  /**
   * gets aspect ratio of images
   *
   * @readonly
   * @memberof LrndesignGallery
   */
  get aspect() {
    let items = (this.items || []).filter(item => item.src && item.src != ""),
      src = items && items[0] ? items[0].src : false;
    if (src) {
      let img = new Image();
      img.src = src;
      return img.naturalWidth > 0 && img.naturalHeight > 0
        ? img.naturalWidth / img.naturalHeight
        : 1.33333333;
    } else {
      return 1.33333333;
    }
  }
  /**
   * gets aspect ratio of an image and
   * determine if aspect ratio is extra wide
   *
   * @readonly
   * @memberof LrndesignGallery
   */
  get extra() {
    let ew = this.aspect > 2;
    return ew;
  }

  /**
   * gets items array
   *
   * @readonly
   * @memberof LrndesignGalleryBehaviors
   */
  get items() {
    let sources = this.sources || [],
      items = typeof sources === "string" ? JSON.parse(sources) : sources,
      total = items.length,
      itemData = (items || []).map((item, i) => {
        return {
          details: item.details,
          index: i,
          id: item.id || `gallery-${this.id}-item-${i}`,
          src: item.src,
          large: item.large && item.large !== "" ? item.large : item.src,
          thumbnail:
            item.thumbnail && item.thumbnail != "" ? item.thumbnail : item.src,
          xofy: `${i + 1} of ${total}`,
          next: i + 1 < total ? i + 1 : -1,
          prev: i - 1 > -1 ? i - 1 : -1,
          sizing: item.sizing && item.sizing != "" ? item.sizing : this.sizing,
          title: item.title,
          tooltip: `${item.title || `Image ${i}`} (Zoom In)`,
          heading: `${item.title || `Image ${i}`} (Full-Sized)`
        };
      });
    console.log("items", itemData);
    return itemData;
  }

  /**
   * go to item by id, or index
   *
   * @param {string} query
   */
  goToItem(query) {
    let start = this.items[0] || {};
    if (typeof query === "number" && query >= 0 && query < this.items.length) {
      this.selected = this.items[query] || start;
    } else {
      let matches = this.items.filter(item => item.id === query);
      console.log("matches", query, matches);
      this.selected = matches.length > 0 ? matches[0] : start;
    }
    console.log("goToItem", query, this.selected);
  }

  /**
   * gets aspect ratio of an image and
   * determine if aspect ratio is extra wide
   *
   * @param {array}
   */
  _getAnchorData() {
    let hash =
        window.location.hash !== null && window.location.hash !== ""
          ? window.location.hash.replace("#", "")
          : false,
      data = hash ? hash.split("---") : [];
    console.log("anchor", data, hash);
    return {
      id: data.length > 1 ? data[1] : -1,
      gallery: data.length > 0 ? data[0] : -1,
      zoom: scroll && data.length > 2 && data[2] === "zoom"
    };
  }
}
customElements.define("lrndesign-gallery", LrndesignGallery);
export { LrndesignGallery };

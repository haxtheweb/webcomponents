/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import { LrndesignGalleryBehaviors } from "./lib/lrndesign-gallery-behaviors.js";
import "@lrnwebcomponents/responsive-utility/responsive-utility.js";
import "./lib/lrndesign-gallery-carousel.js";
import "./lib/lrndesign-gallery-grid.js";
import "./lib/lrndesign-gallery-masonry.js";

/**
 * `lrndesign-gallery`
 * displays images as a carousel or grid with the ability to zoom
 *
 * @element lrndesign-gallery
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
  static get tag() {
    return "lrndesign-gallery";
  }

  // life cycle
  constructor() {
    super();
    this.sources = [];
    this.sizing = "cover";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    window.ResponsiveUtility.requestAvailability();
    this.updateGallery();
    this.observer.observe(this, {
      attributes: false,
      childList: true,
      subtree: false,
    });
  }
  disconnectedCallback() {
    if (this.observer && this.observer.disconnect) this.observer.disconnect();
    if (super.disconnectedCallback) super.disconnectedCallback();
  }
  firstUpdated() {
    super.firstUpdated();
    window.dispatchEvent(
      new CustomEvent("responsive-element", {
        detail: {
          element: this,
          attribute: "responsive-size",
          sm: 300,
          md: 600,
          lg: 1000,
          xl: 1500,
        },
      })
    );
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
    let items = (this.items || []).filter((item) => item.src && item.src != ""),
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
          alt: item.alt,
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
          gravity: item.gravity || "center",
          title: item.title,
          tooltip: `${item.title || `Image ${i}`} (Zoom In)`,
          heading: `${item.title || `Image ${i}`} (Full-Sized)`,
        };
      });
    return itemData;
  }

  /**
   * mutation observer for tabs
   * @readonly
   * @returns {object}
   */
  get observer() {
    let callback = () => this.updateGallery();
    return new MutationObserver(callback);
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
      let matches = this.items.filter((item) => item.id === query);
      this.selected = matches.length > 0 ? matches[0] : start;
    }
  }
  updateGallery() {
    let sources = [],
      figures = this.querySelectorAll("figure");
    figures.forEach((figure) => {
      let id = figure.getAttribute("id"),
        img = figure.querySelector("img"),
        sizing = figure.getAttribute("sizing") || this.sizing,
        query = [1, 2, 3, 4, 5, 6]
          .map((num) => `h${num}:first-child`)
          .join(","),
        src =
          img && img.getAttribute("src") ? img.getAttribute("src") : undefined,
        srcset =
          img && img.getAttribute("srcset")
            ? img.getAttribute("srcset").split(",")
            : undefined,
        thumbset = srcset && srcset[0] ? srcset[0].split(" ") : undefined,
        largeset =
          srcset && srcset[srcset.length - 1]
            ? srcset[srcset.length - 1].split(" ")
            : undefined,
        thumbnail = thumbset && thumbset[0] ? thumbset[0] : undefined,
        large = largeset && largeset[0] ? largeset[0] : undefined,
        details = figure.querySelector("figcaption")
          ? figure.querySelector("figcaption").cloneNode(true)
          : undefined,
        alt =
          img && img.getAttribute("alt") ? img.getAttribute("alt") : undefined,
        figheading =
          details && details.querySelector(query)
            ? details.querySelector(query)
            : undefined,
        title = figheading ? figheading.innerHTML : "";
      if (figheading) figheading.remove();
      sources.push({
        alt: alt,
        id: id,
        src: src,
        thumbnail: thumbnail,
        large: large,
        title: title,
        details: details ? details.innerHTML : "",
        sizing: sizing,
      });
    });
    if (sources.length > 0 && (!this.sources || this.sources.length < 1))
      this.sources = sources;
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
    return {
      id: data.length > 1 ? data[1] : -1,
      gallery: data.length > 0 ? data[0] : -1,
      zoom: scroll && data.length > 2 && data[2] === "zoom",
    };
  }
}
customElements.define("lrndesign-gallery", LrndesignGallery);
export { LrndesignGallery };

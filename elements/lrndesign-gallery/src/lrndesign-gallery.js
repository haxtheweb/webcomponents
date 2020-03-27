/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html } from "lit-element";
import { LrndesignGalleryBehaviors } from "./lib/lrndesign-gallery-behaviors.js";
import { ResponsiveUtility } from "@lrnwebcomponents/responsive-utility/responsive-utility.js";
//import "./lib/lrndesign-gallery-carousel.js";
//import "./lib/lrndesign-gallery-grid.js";

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
    /*this.anchorData = this._getAnchorData();
    window.ResponsiveUtility.requestAvailability();
    window.dispatchEvent(
      new CustomEvent("responsive-element", {
        detail: {
          element: this,
          attribute: "responsive-size",
          relativeToParent: true
        }
      })
    );*/
  }

  /**
   * handle updates
   * /
  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "id" && !this.id) this.id = `gallery-${this._generateUUID()}`;
    });
  }
  // static get observedAttributes() {
  //   return [];
  // }
  // disconnectedCallback() {}

  // attributeChangedCallback(attr, oldValue, newValue) {}

  /**
   * gets aspect ratio of images
   *
   * @readonly
   * @memberof LrndesignGallery
   */
  get aspect() {
    return 1.33333333;
    /*
    let items = (this.items || []).filter(item=>item.src && item.src !=""),
    src = items && items[0] ? items[0].src : false;;
    if(src) {
      let img = new Image()
      img.src = src;
      return img.naturalWidth > 0 && img.naturalHeight > 0
          ? img.naturalWidth / img.naturalHeight
          : 1.33333333;
    } else{
      return 1.33333333;
    }*/
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
   * gets the items array
   *
   * @readonly
   * @memberof LrndesignGalleryBehaviors
   */
  get items() {
    return [];
    /*let sources = this.sopurces || [],
      items = typeof this.sources === "string"
        ? JSON.parse(this.sources)
        : this.sources,
    total = items.length;
    return (items || []).map((item, i) => {
      let itemid = item.id || `gallery-${this.id}-item-${i}`,
      itemData = {
        details: item.details,
        index: i,
        id: itemid,
        src: item.src,
        large: item.large && item.large !== "" ? item.large : item.src,
        thumbnail: item.thumbnail && item.thumbnail !="" ? item.thumbnail : item.src,
        xofy: `${i + 1} of ${total}`,
        prev: i + 1 < total ? i + 1 : -1,
        next: i - 1 > -1 ? i - 1 : -1,
        sizing: item.sizing && item.sizing !="" ? item.sizing : this.sizing,
        title: item.title,
        tooltip: `${item.title || `Image ${i}`} (Zoom In)`,
        heading: `${item.title || `Image ${i}`} (Full-Sized)`,
        zoom: this.anchorData.zoom && this.anchorData.selectedItemId === itemid,
        scroll: this.anchorData.selectedGallery && this.anchorData.selectedItemId === itemid
      }
      if (this.anchorData.selectedItemIndex === i) this.selected = itemData;
      return itemData;
    });*/
  }

  /**
   * gets aspect ratio of an image and
   * determine if aspect ratio is extra wide
   *
   * @param {array}
   */
  _getAnchorData() {
    return null;
    /*let temp =
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
    };*/
  }
}
customElements.define("lrndesign-gallery", LrndesignGallery);
export { LrndesignGallery };

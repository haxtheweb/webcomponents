/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { SimpleColorsPolymer } from "@lrnwebcomponents/simple-colors/lib/simple-colors-polymer.js";
import { ResponsiveUtility } from "@lrnwebcomponents/responsive-utility/responsive-utility.js";
import "@polymer/iron-image/iron-image.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/paper-button/paper-button.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "./lrndesign-gallery-shared-styles.js";

/**
 * `lerndesign-gallery-behaviors`
 * @customElement lerndesign-gallery-behaviors
 * `A set of properties for lerndesign-gallery components.`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @extends SimpleColorsPolymer

 * @polymer
 */
class LrndesignGalleryBehaviors extends SimpleColorsPolymer {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "lrndesign-gallery-behaviors";
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * a named anchor for the gallery
       */
      anchorData: {
        type: Object,
        computed: "_getAnchorData()"
      },
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
        value: false,
        reflectToAttribute: true
      },
      /**
       * gallery's unique id
       */
      galleryId: {
        type: String,
        value: null
      },
      /**
       * size for responsive CSS
       */
      grid: {
        type: Boolean,
        value: false
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
       * array of carousel/grid items
       */
      sources: {
        type: Array,
        value: [],
        reflectToAttribute: false
      },
      /**
       * gallery's title
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
  }

  /**
   * calls responsive-utility to get parent's responsive size
   *
   * @param {object} a set of responsive for options, eg: `{element: root, attribute: "responsive-size", relativeToParent: true}`
   */
  _addResponsiveUtility(options) {
    let root = this;
    window.ResponsiveUtility.requestAvailability();
    window.dispatchEvent(
      new CustomEvent("responsive-element", {
        detail:
          options !== undefined
            ? options
            : {
                element: root,
                attribute: "responsive-size",
                relativeToParent: true
              }
      })
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
   * returns true if an attribute is not null
   *
   * @param {object} the attribute to check
   * @returns {boolean} attr !== undefined && attr !== null
   */
  _isAttrSet(attr = null) {
    return attr !== null;
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
   * adds additional properties to gallery
   *
   * @param {array} array of sources
   * @param {sizing} default sizing for the item
   * @returns {array} formatted array of items
   */
  _itemsLoaded(sources, sizing) {
    let root = this,
      img = new Image(),
      temp = [];
    this.set("items", []);
    if (this.galleryId === null) this.id = "gallery-" + this._generateUUID();
    if (sources !== undefined && sources !== null && sources.length > 0) {
      this._setAspectProperties(sources[0].src);
      for (var i in sources) {
        temp[i] = this._getItemData(sources[i], parseInt(i), sources.length);
      }
    }
    return temp;
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
   * returns true if an attribute is set to a value
   *
   * @param {object} the attribute to check
   * @param {object} the value to check
   * @returns {boolean} attr === val
   */

  _testAttribute(attr = null, val = false) {
    return attr === val;
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

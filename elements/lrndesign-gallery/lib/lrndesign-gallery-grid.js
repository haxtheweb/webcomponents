/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "./lrndesign-gallery-zoom.js";

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
class LrndesignGalleryGrid extends PolymerElement {
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
      <style is="custom-style">
        :host {
          display: block;
          margin: 15px 0 0;
          padding: 0;
          max-width: 100%;
        }
        :host .sr-only {
          position: absolute;
          left: -999999;
          height: 0;
          width: 0;
          overflow: hidden;
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
          width: var(--lrndesign-gallery-thumbnail-size);
          @apply --lrndesign-gallery-thumbnail-image;
        }
        :host([responsive-size="sm"]) .lrndesign-gallery-thumb iron-image {
          width: var(--lrndesign-gallery-thumbnail-size-sm, 150px);
        }
        :host([responsive-size="md"]) .lrndesign-gallery-thumb iron-image {
          width: var(--lrndesign-gallery-thumbnail-size-md, 200px);
        }
        :host([responsive-size="lg"]) .lrndesign-gallery-thumb iron-image {
          width: var(--lrndesign-gallery-thumbnail-size-lg, 250px);
        }
        :host([responsive-size="xl"]) .lrndesign-gallery-thumb iron-image {
          width: var(--lrndesign-gallery-thumbnail-size-lg, 300px);
        }
        :host .lrndesign-gallery-thumb:focus iron-image,
        :host .lrndesign-gallery-thumb:hover iron-image {
          @apply --lrndesign-gallery-thumbnail-image-focus;
        }
        @media print {
          :host #gallery {
            display: none;
          }
        }
      </style>
      <p class="sr-only navigation">A list of thumbnail buttons items:</p>
      <div id="gallery" tabindex="-1" aria-live="polite">
        <template is="dom-repeat" items="[[__items]]" as="item">
          <paper-button
            class="lrndesign-gallery-thumb"
            aria-controls="gallery-zoom"
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
              style$="[[imageStyle]]"
            >
            </iron-image>
          </paper-button>
        </template>
      </div>
      <lrndesign-gallery-zoom
        details$="[[selected.details]]"
        heading$="[[selected.heading]]"
        hidden$="[[!selected.zoom]]"
        id="gallery-zoom"
        item-id="[[selected.id]]"
        src$="[[selected.large]]"
        tooltip$="[[selected.tooltip]]"
        zoom-alt$="[[selected.alt]]"
      >
      </lrndesign-gallery-zoom>
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
       * aspect ratio of media
       */
      imageStyle: {
        type: String,
        computed: "_getImageStyle(items)",
        reflectToAttribute: true
      },
      /**
       * array of carousel items
       */
      items: {
        type: Array,
        value: [],
        notify: true,
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
       * data for the selected item
       */
      selected: {
        type: Object,
        notify: true,
        value: {},
        observer: "_selectionChanged"
      },
      /**
       * default sizing: fit container by cropping (cover)
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
  }

  /**
   * gets unique id for carousel and sets it as a target
   */
  _itemsLoaded() {
    this.__items = this.items;
  }

  /**
   * go to item by id, or index
   */
  goToItem(selection) {
    let index =
      typeof selection === "string"
        ? this.items.findIndex(i => i.id === selection)
        : selection;
    if (typeof index === "number" && index >= 0 && index < this.items.length) {
      this.selected = this.items[index];
      //this.shadowRoot.querySelector("#gallery-zoom").toggleDialog();
    }
  }

  /**
   * when a thumbnail is tapped, goes to that item
   */
  _onNavTapped(e) {
    this.goToItem(e.model.item.id);
  }

  /**
   * sets selected attribute of thumbnail
   */
  _isSelected(selected) {
    return selected ? "selected" : "";
  }

  /**
   * allows a grid item to be opened based on an anchor
   */
  _selectionChanged() {
    if (this.__init !== true) {
      let anchor = window.location.hash.replace("#", ""),
        item = anchor.replace("-zoom", "");
      if (this.selected && this.selected.id == item) {
        this.__init = true;
        this.shadowRoot.querySelector("#gallery-zoom").toggleDialog();
        this.$.itembody.innerHTML = this.selected.details;
      }
    }
  }

  /**
   * returns true if the given attribute is not null
   */
  _isAttrSet(attr) {
    return attr !== null && attr !== undefined;
  }

  /**
   * returns the proper padding to maintain image aspect ratio and updates
   */
  _getImageStyle(items) {
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

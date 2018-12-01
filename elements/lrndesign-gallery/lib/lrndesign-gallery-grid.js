import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";

import "./lrndesign-gallery-thumb.js";
import "./lrndesign-gallery-zoom.js";
/**
`lrndesign-gallery-grid`
A LRN element that renders a collection of gallery items into a carousel or a single media item into a layout.

@demo demo/index.html

@microcopy - the mental model for this element
  <lrndesign-gallery-grid 
    grid-size = "small"               //optional, can be small, medium, or large.
    items = "[]"                      //required, array of items
    sizing = "contain"                //optional, "cover" for cropping (default) or "contain" for letterboxing
    theme = "dark">                   //optional, dark or default
  </lrndesign-gallery-grid>

  To load data into carousel:
  <script>
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
    }]

*/
Polymer({
  _template: html`
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
      :host lrndesign-gallery-thumb {
        max-width: 100%;
        width: var(--lrndesign-gallery-thumbnail-size, 100px);
      }
      :host([responsive-size="sm"]) lrndesign-gallery-thumb {
        width: var(--lrndesign-gallery-thumbnail-size-sm, 150px);
      }
      :host([responsive-size="md"]) lrndesign-gallery-thumb {
        width: var(--lrndesign-gallery-thumbnail-size-md, 200px);
      }
      :host([responsive-size="lg"]) lrndesign-gallery-thumb {
        width: var(--lrndesign-gallery-thumbnail-size-lg, 250px);
      }
      :host([responsive-size="xl"]) lrndesign-gallery-thumb {
        width: var(--lrndesign-gallery-thumbnail-size-lg, 300px);
      }
      :host lrndesign-gallery-thumb ::slotted(* > iron-image) {
        /*padding-bottom: 75%;*/
        top: 0px;
        left: 0px;
      }
      :host lrndesign-gallery-thumb:focus ::slotted(*),
      :host lrndesign-gallery-thumb:hover ::slotted(*) {
        opacity: 0.7;
        outline: 1px solid black;
      }
      :host([theme="dark"]) lrndesign-gallery-thumb:focus ::slotted(*),
      :host([theme="dark"]) lrndesign-gallery-thumb:hover ::slotted(*) {
        outline: 1px solid white;
      }
      @media print {
        :host #gallery {
          display: none;
        }
      }
    </style>
    <p class="sr-only navigation">A list of thumbnail buttons items:</p>
    <div id="gallery" tabindex="-1" aria-live="polite">
      <iron-list
        id="thumbslist"
        items="[[__items]]"
        as="item"
        grid=""
        selection-enabled=""
      >
        <template>
          <lrndesign-gallery-thumb
            alt\$="[[item.alt]]"
            class="navigation"
            controls="zoom"
            item="[[item.id]]"
            rounded-edges="false"
            selected\$="[[_isSelected(selected)]]"
            image-style\$="[[imageStyle]]"
            theme\$="[[theme]]"
            thumbnail="[[item.thumbnail]]"
            target\$="[[item.target]]"
          >
          </lrndesign-gallery-thumb>
        </template>
      </iron-list>
    </div>
    <lrndesign-gallery-zoom
      dark\$="[[dark]]"
      details\$="[[selected.details]]"
      heading\$="[[selected.heading]]"
      hidden\$="[[!selected.zoom]]"
      id="gallery-zoom"
      item-id="[[selected.id]]"
      src\$="[[selected.large]]"
      tooltip\$="[[selected.tooltip]]"
      zoom-alt\$="[[selected.alt]]"
    >
    </lrndesign-gallery-zoom>
  `,

  is: "lrndesign-gallery-grid",

  listeners: {
    navTap: "_onNavTapped"
  },

  properties: {
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
     * theme of the carousel: default or dark
     */
    theme: {
      type: String,
      value: "default"
    },
    /**
     * carousel's title
     */
    title: {
      type: String,
      value: null
    }
  },

  /**
   * gets unique id for carousel and sets it as a target
   */
  attached: function() {
    this.__gallery = this.$.gallery;
  },

  /**
   * gets unique id for carousel and sets it as a target
   */
  _itemsLoaded: function() {
    this.__items = this.items;
  },

  /**
   * go to item by id, or index
   */
  goToItem: function(selection) {
    let index =
      typeof selection === "string"
        ? this.items.findIndex(i => i.id === selection)
        : selection;
    if (typeof index === "number" && index >= 0 && index < this.items.length) {
      this.selected = this.items[index];
      this.$.thumbslist.selectItem(this.items[index]);
      this.shadowRoot.querySelector("#gallery-zoom").toggleDialog();
    }
  },

  /**
   * when a thumbnail is tapped, goes to that item
   */
  _onNavTapped: function(e) {
    this.goToItem(e.detail.item);
  },

  /**
   * sets selected attribute of thumbnail
   */
  _isSelected: function(selected) {
    return selected ? "selected" : "";
  },

  /**
   * allows a grid item to be opened based on an anchor
   */
  _selectionChanged: function() {
    if (this.__init !== true) {
      let anchor = window.location.hash.replace("#", ""),
        item = anchor.replace("-zoom", "");
      if (this.selected && this.selected.id == item) {
        this.__init = true;
        this.shadowRoot.querySelector("#gallery-zoom").toggleDialog();
        this.$.itembody.innerHTML = this.selected.details;
      }
    }
  },

  /**
   * returns true if the given attribute is not null
   */
  _isAttrSet: function(attr) {
    return attr !== null && attr !== undefined;
  },

  /**
   * returns the proper padding to maintain image aspect ratio and updates
   */
  _getImageStyle: function(items) {
    let img = new Image(),
      padding = 75;
    if (items !== undefined && items.length > 0) {
      img.src = items[0].src;
      if (img.naturalWidth > 0 && img.naturalHeight > 0)
        padding = (100 * img.naturalHeight) / img.naturalWidth;
    }
    return "padding-bottom: " + padding + "%;";
  }
});

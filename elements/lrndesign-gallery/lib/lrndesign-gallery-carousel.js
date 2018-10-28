import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";

import "./lrndesign-gallery-thumb.js";
import "./lrndesign-gallery-carousel-item.js";
import "./lrndesign-gallery-carousel-prevnext.js";
/**
`lrndesign-gallery-carousel`
A LRN element that renders a collection of gallery items into a carousel or a single media item into a layout.

@demo demo/index.html

@microcopy - the mental model for this element
  <lrndesign-gallery-carousel 
    items = "[]"                      //required, array of items
    sizing = "contain"                //optional, "cover" for cropping (default) or "contain" for letterboxing
    theme = "dark">                   //optional, dark or default
  </lrndesign-gallery-carousel>

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
      @media screen {
        :host .x-of-y {
          font-size: 85%;
          font-style: italic;
          text-align: right;
          padding: 0;
          margin: 0;
        }
        :host #xy-start, 
        :host #xy-end {
          position: absolute;
          right: 20px;
          top: 20px;
        }
        :host lrndesign-gallery-carousel-prevnext {
          position: absolute;
          left: 0;
          top: 0;
          width: 50%;
          height: 100%;
        }
        :host lrndesign-gallery-carousel-prevnext[type="next"] {
          left: 50%;
          text-align: right;
        }
        :host #thumbslist {
          overflow-y: auto !important;
        }
        :host lrndesign-gallery-thumb {
          width: 40px;
          height: 40px;
        }
        :host[responsive-size="xs"] lrndesign-gallery-thumb {
          display: none;
        }
        :host[responsive-size="md"] lrndesign-gallery-thumb {
          width: 45px;
          height: 45px;
        }
        :host[responsive-size="lg"] lrndesign-gallery-thumb,
        :host[responsive-size="xl"] lrndesign-gallery-thumb {
          width: 50px;
          height: 50px;
        }
        :host lrndesign-gallery-thumb[selected="selected"] {
          opacity: 0.5;
          cursor: default;
        }
      }
      @media print {
        :host #gallery {
          display: none;
        }
      }
    </style>
    <p class="sr-only navigation">A carousel of items:</p>
    <a id\$="[[__timestamp]]"></a>
    <div id="gallery" tabindex="-1" aria-live="polite" hide-navigation\$="[[__hideNav]]">
      <lrndesign-gallery-carousel-item id="carousel-item" aspect-ratio\$="[[aspectRatio]]" dark\$="[[dark]]" extra-wide\$="[[extraWide]]" image-style\$="[[imageStyle]]" item="[[selected]]" responsive-size\$="[[responsiveSize]]" theme\$="[[theme]]">
        <div id="xy-start" slot="xy-start">
          <p class="x-of-y navigation" hidden\$="[[__hideNav]">
            </p><p class="sr-only">Slide [[__xOfY]] selected.</p> 
            <p></p>
        </div>
        <div id="xy-end" slot="xy-end">
          <p class="x-of-y navigation" hidden\$="[[__hideNav]">
            (<span class="sr-only"> End of slide </span> [[__xOfY]]<span class="sr-only">.</span>) 
          </p>
        </div>
        <div id="prevnextnav" slot="prevnextnav">
          <lrndesign-gallery-carousel-prevnext class="navigation" controls\$="[[__gallery.id]]" hidden\$="[[__hideNav]" id="carousel-prev" item="[[selected.prev]]" target\$="[[__gallery]]" theme\$="[[theme]]" type="previous">
          </lrndesign-gallery-carousel-prevnext>
          <lrndesign-gallery-carousel-prevnext class="navigation" controls="[[__gallery.id]]" hidden\$="[[__hideNav]" id="carousel-next" item\$="[[selected.next]]" target\$="[[__gallery]]" theme\$="[[theme]]" type="next">
          </lrndesign-gallery-carousel-prevnext>
        </div>
        <div slot="thumbnails">
          <p class="sr-only navigation" hidden\$="[[__hideNav]">Slides list:</p>
          <iron-list id="thumbslist" items="[[__items]]" as="item" grid="" selection-enabled="">
            <template>
              <lrndesign-gallery-thumb alt\$="[[item.alt]]" class="navigation" controls\$="[[__gallery]]" item="[[item.id]]" id="gallery-thumb" rounded-edges="false" selected\$="[[_isSelected(selected)]]" theme\$="[[theme]]" thumbnail="[[item.thumbnail]]" target\$="[[item.target]]">
              </lrndesign-gallery-thumb>
            </template>
          </iron-list>
        </div>
      </lrndesign-gallery-carousel-item>
    </div>
`,

  is: "lrndesign-gallery-carousel",

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
     * dark theme?
     */
    dark: {
      type: Boolean,
      value: false
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
    //set a unique identifier so that we can scroll to the item
    this.__timestamp = "gallery-anchor-" + Date.now();
    if (this.__setScroll) {
      document.getElementById(this.__timestamp).scrollIntoView();
    }
  },

  /**
   * gets unique id for carousel and sets it as a target
   */
  _itemsLoaded: function() {
    let anchor, item, index;
    this.__items = this.items;
    this.__hideNav = this.items !== undefined ? this.items.length < 2 : true;
    anchor = window.location.hash.replace("#", "");
    item = this.items.findIndex(i => i.id === anchor.replace("-zoom", ""));
    index = item !== undefined && item > 0 ? item : 0;
    this.goToItem(index, true, index !== 0);
  },

  /**
   * returns the proper padding to maintain image aspect ratio and updates
   */
  _getExtraWide: function(items) {
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
  },

  /**
   * returns the proper padding to maintain image aspect ratio and updates
   */
  _getImageStyle: function(extraWide, responsiveSize) {
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
  },

  /**
   * go to item by id, or index
   */
  goToItem: function(selection, setThumbnail, setScroll) {
    let root = this,
      index =
        typeof selection == "number"
          ? selection
          : root.items.findIndex(i => i.id === selection);
    setThumbnail = setThumbnail !== undefined ? setThumbnail : false;
    this.__setScroll = setScroll !== undefined ? setScroll : false;
    if (typeof index === "number" && index >= 0 && index < root.items.length) {
      root.selected = root.items[index];
      if (root.$.thumbslist.selectItem === null || setThumbnail) {
        root.$.thumbslist.selectItem(root.items[index]);
      }
      root.__xOfY =
        parseInt(root.selected.index + 1) + " of " + root.items.length;
    }
  },

  /**
   * when a thumbnail is tapped, goes to that item
   */
  _onNavTapped: function(e) {
    this.goToItem(e.detail.item, e.detail.type !== "thumbnail");
    this.$.gallery.focus();
  },

  /**
   * sets selected attribute of thumbnail
   */
  _isSelected: function(selected) {
    return selected ? "selected" : "";
  },

  /**
   * returns true if the given attribute is not null
   */
  _isAttrSet: function(attr) {
    return attr !== null && attr !== undefined;
  }
});

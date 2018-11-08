import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/responsive-utility/responsive-utility.js";
import "./lib/lrndesign-gallery-carousel.js";
import "./lib/lrndesign-gallery-grid.js";
import "./lib/lrndesign-gallery-print.js";
/**
`lrndesign-gallery`
A LRN element that renders a collection of gallery items into a carousel or a single media item into a layout.

@demo demo/index.html

@microcopy - the mental model for this element
  <lrndesign-gallery 
    sources = "[{                                       //required array of source data
      "alt": "IMAGE ALT TEXT",                          //required array of sources
      "details": "TEXT ABOUT IMAGE HERE",               //optional   
      "id": ""                                          //required, unique id
      "large": "PATH/TO/LARGE/IMAGE/HERE.JPG",          //optional, larger image for zoom instead of src 
      "sizing": "contain",                              //optional, "cover" for cropping (default) or "contain" for letterboxing, default is parent's sizing
      "src": "PATH/TO/FULL/IMAGE/HERE.JPG",             //required
      "thumbnail": "PATH/TO/THUMBAIL/IMAGE/HERE.JPG",   //required
      "title": "IMAGE TITLE HERE",                      //optional
      "type": "image",                                  //required, "image", "video", "audio", etc.
      "zoom": false                                     //optional, false item should have no zoom option, default is true 
    }]" 
    sizing = "contain"                //optional, "cover" for cropping (default) or "contain" for letterboxing
    theme = "dark"                    //optional, dark or default
    title = "My Carousel">            //optional
    OPTIONAL TEXT ABOUT THE CAROUSEL OR GRID HERE.
  </lrndesign-gallery>

*/
Polymer({
  _template: html`
    <style is="custom-style">
      :host {
        display: block;
      }
      :host * {
        --lrndesign-gallery-color: var(--simple-colors-foreground1);
        --lrndesign-gallery-background-color: var(--simple-colors-background3);
        --lrndesign-gallery-focus-color: var(--simple-colors-accent-foreground3);
        --lrndesign-gallery-border-color: var(--simple-colors-background5);
        --lrndesign-gallery-rgba-high: rgba(255,255,255,0.7);
        --lrndesign-gallery-rgba-mid: rgba(255,255,255,0.5);
        --lrndesign-gallery-rgba-low: rgba(255,255,255,0.3);
        --lrndesign-gallery-rgba-none: rgba(255,255,255,0);
        --lrndesign-gallery-thumbnail-size: 100px;
        --lrndesign-gallery-thumbnail-size-sm: 150px;
        --lrndesign-gallery-thumbnail-size-md: 200px;
        --lrndesign-gallery-thumbnail-size-lg: 250px;
        --lrndesign-gallery-thumbnail-size-xl: 300px;
      } 
      :host([dark]) * {
        --lrndesign-gallery-border-color: var(--simple-colors-background1);
        --lrndesign-gallery-rgba-high: rgba(0,0,0,0.7);
        --lrndesign-gallery-rgba-mid: rgba(0,0,0,0.5);
        --lrndesign-gallery-rgba-low: rgba(0,0,0,0.3);
        --lrndesign-gallery-rgba-none: rgba(0,0,0,0);
      }
    </style>
    <article>
      <template is="dom-if" if="[[_isAttrSet(title)]]">
        <h1 id="gallery-title">[[title]]</h1>
      </template>
      <div id="gallery-description">
        <slot name="description"></slot>
      </div>
      <template is="dom-if" if="[[grid]]">
        <lrndesign-gallery-grid aspect\$="[[aspect]]" dark\$="[[dark]]" class="gallery-type" id="gallery-grid" items\$="[[__items]]" modal-open\$="[[__modalOpen]]" responsive-size\$="[[responsiveSize]]" selected\$="[[selected]]" sizing\$="[[sizing]]" theme\$="[[theme]]">
        </lrndesign-gallery-grid>
      </template>
      <template is="dom-if" if="[[!grid]]">
        <lrndesign-gallery-carousel aspect\$="[[aspect]]" dark\$="[[dark]]" class="gallery-type" hide-navigation\$="[[__hideNav]]" id="gallery-carousel" items\$="[[__items]]" modal-open\$="[[__modalOpen]]" responsive-size\$="[[responsiveSize]]" selected\$="[[selected]]" sizing\$="[[sizing]]" theme\$="[[theme]]">
        </lrndesign-gallery-carousel>
      </template>
      
      <template id="printlist" is="dom-repeat" items="[[items]]" as="item">
        <lrndesign-gallery-print alt\$="[[item.alt]]" details\$="[[item.details]]" heading\$="[[item.heading]]" id="gallery-print" src\$="[[item.src]]" title\$="[[item.title]]">
        </lrndesign-gallery-print>
      </template>
    </article>
`,

  is: "lrndesign-gallery",
  behaviors: [simpleColorsBehaviors],

  properties: {
    /**
     * thumbnail grid layout, default is false (carousel layout)
     */
    grid: {
      type: Boolean,
      value: false
    },
    /**
     * array of carousel/grid items
     */
    sources: {
      type: Array,
      value: []
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
     * carousel's title
     */
    title: {
      type: String,
      value: null
    },
    /*
     * open modal based on anchor
     */
    __modalOpen: {
      type: Boolean,
      value: false
    }
  },

  attached: function() {
    let root = this;
    window.ResponsiveUtility.requestAvailability();
    root.fire("responsive-element", {
      element: root,
      attribute: "responsive-size"
    });
  },

  /*
   * adds additional properties to gallery
   */
  _itemsLoaded: function(sources, sizing) {
    let temp = sources.slice(),
      anchor = window.location.hash,
      index = sources.findIndex(
        i => "#" + i.id === anchor.replace("-zoom", "")
      );
    if (sources !== undefined && this.items !== null && sources.length > 0) {
      for (var i in temp) {
        temp[i].index = parseInt(i);
        temp[i].large =
          temp[i].large !== undefined ? temp[i].large : temp[i].src;
        temp[i].next = parseInt(i) + 1 < sources.length ? parseInt(i) + 1 : -1;
        temp[i].prev = parseInt(i) - 1 > -1 ? parseInt(i) - 1 : -1;
        temp[i].sizing = temp[i].sizing !== undefined ? temp[i].sizing : sizing;
        temp[i].tooltip =
          temp[i].title !== undefined ? "Zoom In" : temp[i].title + " Zoom";
        temp[i].thumbnail =
          temp[i].thumbnail !== undefined ? temp[i].thumbnail : temp[i].src;
        temp[i].zoom = temp[i].zoom !== undefined ? temp[i].zoom : true;
        if (!temp[i].zoom) {
          temp[i].heading =
            temp[i].title === undefined ? "Image Information" : temp[i].title;
          temp[i].tooltip =
            temp[i].title === undefined
              ? "View Image Information"
              : temp[i].title + " Information";
        } else {
          temp[i].heading =
            temp[i].title === undefined
              ? "Image Zoom"
              : temp[i].title + " (Image Zoom)";
          temp[i].tooltip =
            temp[i].title === undefined ? "Zoom In" : temp[i].title + " Zoom";
        }
      }
      this.__items = temp;
      this.selected = index > -1 ? this.__items[index] : this.__items[0];
      return this.__items;
    }
  },

  /**
   * returns true if the given attribute is not null
   */
  _isAttrSet: function(attr) {
    return attr !== null && attr !== undefined;
  }
});

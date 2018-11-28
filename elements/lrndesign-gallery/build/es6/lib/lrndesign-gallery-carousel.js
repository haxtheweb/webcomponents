import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/iron-list/iron-list.js";
import "./lrndesign-gallery-thumb.js";
import "./lrndesign-gallery-carousel-item.js";
import "./lrndesign-gallery-carousel-prevnext.js";
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
        :host([responsive-size="xs"]) lrndesign-gallery-thumb {
          display: none;
        }
        :host([responsive-size="md"]) lrndesign-gallery-thumb {
          width: 45px;
          height: 45px;
        }
        :host([responsive-size="lg"]) lrndesign-gallery-thumb,
        :host([responsive-size="xl"]) lrndesign-gallery-thumb {
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
  listeners: { navTap: "_onNavTapped" },
  properties: {
    aspectRatio: { type: Number, value: "1.33333333" },
    dark: { type: Boolean, value: !1 },
    extraWide: {
      type: Boolean,
      computed: "_getExtraWide(items)",
      reflectToAttribute: !0
    },
    imageStyle: {
      type: String,
      computed: "_getImageStyle(extraWide,responsiveSize)"
    },
    items: { type: Array, value: [], observer: "_itemsLoaded" },
    parent: { type: Object, value: {} },
    responsiveSize: { type: String, notify: !0 },
    selected: { type: Object, value: {} },
    sizing: { type: String, value: "cover" },
    theme: { type: String, value: "default" },
    title: { type: String, value: null }
  },
  attached: function() {
    this.__gallery = this.$.gallery;
    this.__timestamp = "gallery-anchor-" + Date.now();
    if (this.__setScroll) {
      document.getElementById(this.__timestamp).scrollIntoView();
    }
  },
  _itemsLoaded: function() {
    let anchor, item, index;
    this.__items = this.items;
    this.__hideNav = this.items !== void 0 ? 2 > this.items.length : !0;
    anchor = window.location.hash.replace("#", "");
    item = this.items.findIndex(i => i.id === anchor.replace("-zoom", ""));
    index = item !== void 0 && 0 < item ? item : 0;
    this.goToItem(index, !0, 0 !== index);
  },
  _getExtraWide: function(items) {
    let img = new Image();
    if (items !== void 0 && 0 < items.length) {
      img.src = items[0].src;
      this.aspectRatio =
        0 < img.naturalWidth && 0 < img.naturalHeight
          ? img.naturalWidth / img.naturalHeight
          : 1.33333333;
      return 2 < this.aspectRatio;
    } else {
      return !1;
    }
  },
  _getImageStyle: function(extraWide, responsiveSize) {
    if (extraWide || "xs" === responsiveSize) {
      return "padding-bottom: " + 100 / this.aspectRatio + "%;";
    } else {
      if ("xl" === responsiveSize) {
        return "width: " + 400 * this.aspectRatio + "px; height: 400px;";
      } else if ("lg" === responsiveSize) {
        return "width: " + 300 * this.aspectRatio + "px; height: 300px;";
      } else if ("md" === responsiveSize) {
        return "width: " + 200 * this.aspectRatio + "px; height: 200px;";
      } else {
        return "width: " + 200 * this.aspectRatio + "px; height: 200px;";
      }
    }
  },
  goToItem: function(selection, setThumbnail, setScroll) {
    let root = this,
      index =
        "number" == typeof selection
          ? selection
          : root.items.findIndex(i => i.id === selection);
    setThumbnail = setThumbnail !== void 0 ? setThumbnail : !1;
    this.__setScroll = setScroll !== void 0 ? setScroll : !1;
    if ("number" === typeof index && 0 <= index && index < root.items.length) {
      root.selected = root.items[index];
      if (null === root.$.thumbslist.selectItem || setThumbnail) {
        root.$.thumbslist.selectItem(root.items[index]);
      }
      root.__xOfY =
        parseInt(root.selected.index + 1) + " of " + root.items.length;
    }
  },
  _onNavTapped: function(e) {
    this.goToItem(e.detail.item, "thumbnail" !== e.detail.type);
    this.$.gallery.focus();
  },
  _isSelected: function(selected) {
    return selected ? "selected" : "";
  },
  _isAttrSet: function(attr) {
    return null !== attr && attr !== void 0;
  }
});

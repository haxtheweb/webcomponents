import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "./node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";
import "./lib/lrndesign-gallery-carousel.js";
import "./lib/lrndesign-gallery-grid.js";
import "./lib/lrndesign-gallery-print.js";
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
      :host[dark] * {
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
    grid: { type: Boolean, value: !1 },
    sources: { type: Array, value: [] },
    items: { type: Array, computed: "_itemsLoaded(sources,sizing)" },
    responsiveSize: { type: String, value: "xs", reflectToAttribute: !0 },
    selected: { type: Object, value: {}, notify: !0, reflectToAttribute: !0 },
    sizing: { type: String, value: "cover" },
    title: { type: String, value: null },
    __modalOpen: { type: Boolean, value: !1 }
  },
  attached: function() {
    let root = this;
    window.ResponsiveUtility.requestAvailability();
    root.fire("responsive-element", {
      element: root,
      attribute: "responsive-size"
    });
  },
  _itemsLoaded: function(sources, sizing) {
    let temp = sources.slice(),
      anchor = window.location.hash,
      index = sources.findIndex(
        i => "#" + i.id === anchor.replace("-zoom", "")
      );
    if (sources !== void 0 && null !== this.items && 0 < sources.length) {
      for (i in temp) {
        temp[i].index = parseInt(i);
        temp[i].large = temp[i].large !== void 0 ? temp[i].large : temp[i].src;
        temp[i].next = parseInt(i) + 1 < sources.length ? parseInt(i) + 1 : -1;
        temp[i].prev = -1 < parseInt(i) - 1 ? parseInt(i) - 1 : -1;
        temp[i].sizing = temp[i].sizing !== void 0 ? temp[i].sizing : sizing;
        temp[i].tooltip =
          temp[i].title !== void 0 ? "Zoom In" : temp[i].title + " Zoom";
        temp[i].thumbnail =
          temp[i].thumbnail !== void 0 ? temp[i].thumbnail : temp[i].src;
        temp[i].zoom = temp[i].zoom !== void 0 ? temp[i].zoom : !0;
        if (!temp[i].zoom) {
          temp[i].heading =
            temp[i].title === void 0 ? "Image Information" : temp[i].title;
          temp[i].tooltip =
            temp[i].title === void 0
              ? "View Image Information"
              : temp[i].title + " Information";
        } else {
          temp[i].heading =
            temp[i].title === void 0
              ? "Image Zoom"
              : temp[i].title + " (Image Zoom)";
          temp[i].tooltip =
            temp[i].title === void 0 ? "Zoom In" : temp[i].title + " Zoom";
        }
      }
      this.__items = temp;
      this.selected = -1 < index ? this.__items[index] : this.__items[0];
      return this.__items;
    }
  },
  _isAttrSet: function(attr) {
    return null !== attr && attr !== void 0;
  }
});

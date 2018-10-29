import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "./lrndesign-gallery-thumb.js";
import "./lrndesign-gallery-zoom.js";
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
      :host[responsive-size="sm"] lrndesign-gallery-thumb {
        width: var(--lrndesign-gallery-thumbnail-size-sm, 150px);
      }
      :host[responsive-size="md"] lrndesign-gallery-thumb {
        width: var(--lrndesign-gallery-thumbnail-size-md, 200px);
      }
      :host[responsive-size="lg"] lrndesign-gallery-thumb {
        width: var(--lrndesign-gallery-thumbnail-size-lg, 250px);
      }
      :host[responsive-size="xl"] lrndesign-gallery-thumb {
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
      :host[theme="dark"] lrndesign-gallery-thumb:focus ::slotted(*),
      :host[theme="dark"] lrndesign-gallery-thumb:hover ::slotted(*) {
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
      <iron-list id="thumbslist" items="[[__items]]" as="item" grid="" selection-enabled="">
        <template>
          <lrndesign-gallery-thumb alt\$="[[item.alt]]" class="navigation" controls="zoom" item="[[item.id]]" rounded-edges="false" selected\$="[[_isSelected(selected)]]" image-style\$="[[imageStyle]]" theme\$="[[theme]]" thumbnail="[[item.thumbnail]]" target\$="[[item.target]]">
          </lrndesign-gallery-thumb>
        </template>
      </iron-list>
    </div>
    <lrndesign-gallery-zoom dark\$="[[dark]]" details\$="[[selected.details]]" heading\$="[[selected.heading]]" hidden\$="[[!selected.zoom]]" id="gallery-zoom" item-id="[[selected.id]]" src\$="[[selected.large]]" tooltip\$="[[selected.tooltip]]" zoom-alt\$="[[selected.alt]]">
    </lrndesign-gallery-zoom>
`,
  is: "lrndesign-gallery-grid",
  listeners: { navTap: "_onNavTapped" },
  properties: {
    aspectRatio: { type: Number, value: "1.33333333" },
    imageStyle: {
      type: String,
      computed: "_getImageStyle(items)",
      reflectToAttribute: !0
    },
    items: { type: Array, value: [], notify: !0, observer: "_itemsLoaded" },
    parent: { type: Object, value: {} },
    selected: {
      type: Object,
      notify: !0,
      value: {},
      observer: "_selectionChanged"
    },
    sizing: { type: String, value: "cover" },
    theme: { type: String, value: "default" },
    title: { type: String, value: null }
  },
  attached: function() {
    this.__gallery = this.$.gallery;
  },
  _itemsLoaded: function() {
    this.__items = this.items;
  },
  goToItem: function(selection) {
    let index =
      "string" === typeof selection
        ? this.items.findIndex(i => i.id === selection)
        : selection;
    if ("number" === typeof index && 0 <= index && index < this.items.length) {
      this.selected = this.items[index];
      this.$.thumbslist.selectItem(this.items[index]);
      this.$$("#gallery-zoom").toggleDialog();
    }
  },
  _onNavTapped: function(e) {
    this.goToItem(e.detail.item);
  },
  _isSelected: function(selected) {
    return selected ? "selected" : "";
  },
  _selectionChanged: function() {
    if (!0 !== this.__init) {
      let anchor = window.location.hash.replace("#", ""),
        item = anchor.replace("-zoom", "");
      if (this.selected && this.selected.id == item) {
        this.__init = !0;
        this.$$("#gallery-zoom").toggleDialog();
        this.$.itembody.innerHTML = this.selected.details;
      }
    }
  },
  _isAttrSet: function(attr) {
    return null !== attr && attr !== void 0;
  },
  _getImageStyle: function(items) {
    let img = new Image(),
      padding = 75;
    if (items !== void 0 && 0 < items.length) {
      img.src = items[0].src;
      if (0 < img.naturalWidth && 0 < img.naturalHeight)
        padding = (100 * img.naturalHeight) / img.naturalWidth;
    }
    return "padding-bottom: " + padding + "%;";
  }
});

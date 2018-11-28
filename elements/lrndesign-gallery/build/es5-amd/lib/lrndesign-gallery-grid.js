define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "./lrndesign-gallery-thumb.js",
  "./lrndesign-gallery-zoom.js"
], function(_polymerLegacy, _lrndesignGalleryThumb, _lrndesignGalleryZoom) {
  "use strict";
  function _templateObject_c66e1b30f32e11e8affa37f616c5566e() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style is="custom-style">\n      :host {\n        display: block;\n        margin: 15px 0 0;\n        padding: 0;\n        max-width: 100%;\n      }\n      :host .sr-only {\n        position: absolute;\n        left: -999999;\n        height: 0;\n        width: 0;\n        overflow: hidden;\n      }\n      :host lrndesign-gallery-thumb {\n        max-width: 100%;\n        width: var(--lrndesign-gallery-thumbnail-size, 100px);\n      }\n      :host([responsive-size="sm"]) lrndesign-gallery-thumb {\n        width: var(--lrndesign-gallery-thumbnail-size-sm, 150px);\n      }\n      :host([responsive-size="md"]) lrndesign-gallery-thumb {\n        width: var(--lrndesign-gallery-thumbnail-size-md, 200px);\n      }\n      :host([responsive-size="lg"]) lrndesign-gallery-thumb {\n        width: var(--lrndesign-gallery-thumbnail-size-lg, 250px);\n      }\n      :host([responsive-size="xl"]) lrndesign-gallery-thumb {\n        width: var(--lrndesign-gallery-thumbnail-size-lg, 300px);\n      }\n      :host lrndesign-gallery-thumb ::slotted(* > iron-image) {\n        /*padding-bottom: 75%;*/\n        top: 0px;\n        left: 0px;\n      }\n      :host lrndesign-gallery-thumb:focus ::slotted(*),\n      :host lrndesign-gallery-thumb:hover ::slotted(*) {\n        opacity: 0.7;\n        outline: 1px solid black;\n      }\n      :host([theme="dark"]) lrndesign-gallery-thumb:focus ::slotted(*),\n      :host([theme="dark"]) lrndesign-gallery-thumb:hover ::slotted(*) {\n        outline: 1px solid white;\n      }\n      @media print {\n        :host #gallery {\n          display: none;\n        }\n      }\n    </style>\n    <p class="sr-only navigation">A list of thumbnail buttons items:</p>\n    <div id="gallery" tabindex="-1" aria-live="polite">\n      <iron-list id="thumbslist" items="[[__items]]" as="item" grid="" selection-enabled="">\n        <template>\n          <lrndesign-gallery-thumb alt$="[[item.alt]]" class="navigation" controls="zoom" item="[[item.id]]" rounded-edges="false" selected$="[[_isSelected(selected)]]" image-style$="[[imageStyle]]" theme$="[[theme]]" thumbnail="[[item.thumbnail]]" target$="[[item.target]]">\n          </lrndesign-gallery-thumb>\n        </template>\n      </iron-list>\n    </div>\n    <lrndesign-gallery-zoom dark$="[[dark]]" details$="[[selected.details]]" heading$="[[selected.heading]]" hidden$="[[!selected.zoom]]" id="gallery-zoom" item-id="[[selected.id]]" src$="[[selected.large]]" tooltip$="[[selected.tooltip]]" zoom-alt$="[[selected.alt]]">\n    </lrndesign-gallery-zoom>\n'
      ],
      [
        '\n    <style is="custom-style">\n      :host {\n        display: block;\n        margin: 15px 0 0;\n        padding: 0;\n        max-width: 100%;\n      }\n      :host .sr-only {\n        position: absolute;\n        left: -999999;\n        height: 0;\n        width: 0;\n        overflow: hidden;\n      }\n      :host lrndesign-gallery-thumb {\n        max-width: 100%;\n        width: var(--lrndesign-gallery-thumbnail-size, 100px);\n      }\n      :host([responsive-size="sm"]) lrndesign-gallery-thumb {\n        width: var(--lrndesign-gallery-thumbnail-size-sm, 150px);\n      }\n      :host([responsive-size="md"]) lrndesign-gallery-thumb {\n        width: var(--lrndesign-gallery-thumbnail-size-md, 200px);\n      }\n      :host([responsive-size="lg"]) lrndesign-gallery-thumb {\n        width: var(--lrndesign-gallery-thumbnail-size-lg, 250px);\n      }\n      :host([responsive-size="xl"]) lrndesign-gallery-thumb {\n        width: var(--lrndesign-gallery-thumbnail-size-lg, 300px);\n      }\n      :host lrndesign-gallery-thumb ::slotted(* > iron-image) {\n        /*padding-bottom: 75%;*/\n        top: 0px;\n        left: 0px;\n      }\n      :host lrndesign-gallery-thumb:focus ::slotted(*),\n      :host lrndesign-gallery-thumb:hover ::slotted(*) {\n        opacity: 0.7;\n        outline: 1px solid black;\n      }\n      :host([theme="dark"]) lrndesign-gallery-thumb:focus ::slotted(*),\n      :host([theme="dark"]) lrndesign-gallery-thumb:hover ::slotted(*) {\n        outline: 1px solid white;\n      }\n      @media print {\n        :host #gallery {\n          display: none;\n        }\n      }\n    </style>\n    <p class="sr-only navigation">A list of thumbnail buttons items:</p>\n    <div id="gallery" tabindex="-1" aria-live="polite">\n      <iron-list id="thumbslist" items="[[__items]]" as="item" grid="" selection-enabled="">\n        <template>\n          <lrndesign-gallery-thumb alt\\$="[[item.alt]]" class="navigation" controls="zoom" item="[[item.id]]" rounded-edges="false" selected\\$="[[_isSelected(selected)]]" image-style\\$="[[imageStyle]]" theme\\$="[[theme]]" thumbnail="[[item.thumbnail]]" target\\$="[[item.target]]">\n          </lrndesign-gallery-thumb>\n        </template>\n      </iron-list>\n    </div>\n    <lrndesign-gallery-zoom dark\\$="[[dark]]" details\\$="[[selected.details]]" heading\\$="[[selected.heading]]" hidden\\$="[[!selected.zoom]]" id="gallery-zoom" item-id="[[selected.id]]" src\\$="[[selected.large]]" tooltip\\$="[[selected.tooltip]]" zoom-alt\\$="[[selected.alt]]">\n    </lrndesign-gallery-zoom>\n'
      ]
    );
    _templateObject_c66e1b30f32e11e8affa37f616c5566e = function _templateObject_c66e1b30f32e11e8affa37f616c5566e() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_c66e1b30f32e11e8affa37f616c5566e()
    ),
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
    attached: function attached() {
      this.__gallery = this.$.gallery;
    },
    _itemsLoaded: function _itemsLoaded() {
      this.__items = this.items;
    },
    goToItem: function goToItem(selection) {
      var index =
        "string" === typeof selection
          ? this.items.findIndex(function(i) {
              return i.id === selection;
            })
          : selection;
      if (
        "number" === typeof index &&
        0 <= index &&
        index < this.items.length
      ) {
        this.selected = this.items[index];
        this.$.thumbslist.selectItem(this.items[index]);
        this.shadowRoot.querySelector("#gallery-zoom").toggleDialog();
      }
    },
    _onNavTapped: function _onNavTapped(e) {
      this.goToItem(e.detail.item);
    },
    _isSelected: function _isSelected(selected) {
      return selected ? "selected" : "";
    },
    _selectionChanged: function _selectionChanged() {
      if (!0 !== this.__init) {
        var anchor = window.location.hash.replace("#", ""),
          item = anchor.replace("-zoom", "");
        if (this.selected && this.selected.id == item) {
          this.__init = !0;
          this.shadowRoot.querySelector("#gallery-zoom").toggleDialog();
          this.$.itembody.innerHTML = this.selected.details;
        }
      }
    },
    _isAttrSet: function _isAttrSet(attr) {
      return null !== attr && attr !== void 0;
    },
    _getImageStyle: function _getImageStyle(items) {
      var img = new Image(),
        padding = 75;
      if (items !== void 0 && 0 < items.length) {
        img.src = items[0].src;
        if (0 < img.naturalWidth && 0 < img.naturalHeight)
          padding = (100 * img.naturalHeight) / img.naturalWidth;
      }
      return "padding-bottom: " + padding + "%;";
    }
  });
});

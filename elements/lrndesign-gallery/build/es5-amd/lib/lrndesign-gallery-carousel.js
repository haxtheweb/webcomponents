define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/iron-list/iron-list.js",
  "./lrndesign-gallery-thumb.js",
  "./lrndesign-gallery-carousel-item.js",
  "./lrndesign-gallery-carousel-prevnext.js"
], function(
  _polymerLegacy,
  _ironList,
  _lrndesignGalleryThumb,
  _lrndesignGalleryCarouselItem,
  _lrndesignGalleryCarouselPrevnext
) {
  "use strict";
  function _templateObject_78f90d40f1e611e8a469df06e35415a9() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style is="custom-style">\n      :host {\n        display: block;\n        margin: 15px 0 0;\n        padding: 0;\n      }\n      :host .sr-only {\n        position: absolute;\n        left: -999999;\n        height: 0;\n        width: 0;\n        overflow: hidden;\n      }\n      :host #gallery[hide-navigation] .navigation {\n        display: none;\n      }\n      @media screen {\n        :host .x-of-y {\n          font-size: 85%;\n          font-style: italic;\n          text-align: right;\n          padding: 0;\n          margin: 0;\n        }\n        :host #xy-start, \n        :host #xy-end {\n          position: absolute;\n          right: 20px;\n          top: 20px;\n        }\n        :host lrndesign-gallery-carousel-prevnext {\n          position: absolute;\n          left: 0;\n          top: 0;\n          width: 50%;\n          height: 100%;\n        }\n        :host lrndesign-gallery-carousel-prevnext[type="next"] {\n          left: 50%;\n          text-align: right;\n        }\n        :host #thumbslist {\n          overflow-y: auto !important;\n        }\n        :host lrndesign-gallery-thumb {\n          width: 40px;\n          height: 40px;\n        }\n        :host([responsive-size="xs"]) lrndesign-gallery-thumb {\n          display: none;\n        }\n        :host([responsive-size="md"]) lrndesign-gallery-thumb {\n          width: 45px;\n          height: 45px;\n        }\n        :host([responsive-size="lg"]) lrndesign-gallery-thumb,\n        :host([responsive-size="xl"]) lrndesign-gallery-thumb {\n          width: 50px;\n          height: 50px;\n        }\n        :host lrndesign-gallery-thumb[selected="selected"] {\n          opacity: 0.5;\n          cursor: default;\n        }\n      }\n      @media print {\n        :host #gallery {\n          display: none;\n        }\n      }\n    </style>\n    <p class="sr-only navigation">A carousel of items:</p>\n    <a id$="[[__timestamp]]"></a>\n    <div id="gallery" tabindex="-1" aria-live="polite" hide-navigation$="[[__hideNav]]">\n      <lrndesign-gallery-carousel-item id="carousel-item" aspect-ratio$="[[aspectRatio]]" dark$="[[dark]]" extra-wide$="[[extraWide]]" image-style$="[[imageStyle]]" item="[[selected]]" responsive-size$="[[responsiveSize]]" theme$="[[theme]]">\n        <div id="xy-start" slot="xy-start">\n          <p class="x-of-y navigation" hidden$="[[__hideNav]">\n            </p><p class="sr-only">Slide [[__xOfY]] selected.</p> \n            <p></p>\n        </div>\n        <div id="xy-end" slot="xy-end">\n          <p class="x-of-y navigation" hidden$="[[__hideNav]">\n            (<span class="sr-only"> End of slide </span> [[__xOfY]]<span class="sr-only">.</span>) \n          </p>\n        </div>\n        <div id="prevnextnav" slot="prevnextnav">\n          <lrndesign-gallery-carousel-prevnext class="navigation" controls$="[[__gallery.id]]" hidden$="[[__hideNav]" id="carousel-prev" item="[[selected.prev]]" target$="[[__gallery]]" theme$="[[theme]]" type="previous">\n          </lrndesign-gallery-carousel-prevnext>\n          <lrndesign-gallery-carousel-prevnext class="navigation" controls="[[__gallery.id]]" hidden$="[[__hideNav]" id="carousel-next" item$="[[selected.next]]" target$="[[__gallery]]" theme$="[[theme]]" type="next">\n          </lrndesign-gallery-carousel-prevnext>\n        </div>\n        <div slot="thumbnails">\n          <p class="sr-only navigation" hidden$="[[__hideNav]">Slides list:</p>\n          <iron-list id="thumbslist" items="[[__items]]" as="item" grid="" selection-enabled="">\n            <template>\n              <lrndesign-gallery-thumb alt$="[[item.alt]]" class="navigation" controls$="[[__gallery]]" item="[[item.id]]" id="gallery-thumb" rounded-edges="false" selected$="[[_isSelected(selected)]]" theme$="[[theme]]" thumbnail="[[item.thumbnail]]" target$="[[item.target]]">\n              </lrndesign-gallery-thumb>\n            </template>\n          </iron-list>\n        </div>\n      </lrndesign-gallery-carousel-item>\n    </div>\n'
      ],
      [
        '\n    <style is="custom-style">\n      :host {\n        display: block;\n        margin: 15px 0 0;\n        padding: 0;\n      }\n      :host .sr-only {\n        position: absolute;\n        left: -999999;\n        height: 0;\n        width: 0;\n        overflow: hidden;\n      }\n      :host #gallery[hide-navigation] .navigation {\n        display: none;\n      }\n      @media screen {\n        :host .x-of-y {\n          font-size: 85%;\n          font-style: italic;\n          text-align: right;\n          padding: 0;\n          margin: 0;\n        }\n        :host #xy-start, \n        :host #xy-end {\n          position: absolute;\n          right: 20px;\n          top: 20px;\n        }\n        :host lrndesign-gallery-carousel-prevnext {\n          position: absolute;\n          left: 0;\n          top: 0;\n          width: 50%;\n          height: 100%;\n        }\n        :host lrndesign-gallery-carousel-prevnext[type="next"] {\n          left: 50%;\n          text-align: right;\n        }\n        :host #thumbslist {\n          overflow-y: auto !important;\n        }\n        :host lrndesign-gallery-thumb {\n          width: 40px;\n          height: 40px;\n        }\n        :host([responsive-size="xs"]) lrndesign-gallery-thumb {\n          display: none;\n        }\n        :host([responsive-size="md"]) lrndesign-gallery-thumb {\n          width: 45px;\n          height: 45px;\n        }\n        :host([responsive-size="lg"]) lrndesign-gallery-thumb,\n        :host([responsive-size="xl"]) lrndesign-gallery-thumb {\n          width: 50px;\n          height: 50px;\n        }\n        :host lrndesign-gallery-thumb[selected="selected"] {\n          opacity: 0.5;\n          cursor: default;\n        }\n      }\n      @media print {\n        :host #gallery {\n          display: none;\n        }\n      }\n    </style>\n    <p class="sr-only navigation">A carousel of items:</p>\n    <a id\\$="[[__timestamp]]"></a>\n    <div id="gallery" tabindex="-1" aria-live="polite" hide-navigation\\$="[[__hideNav]]">\n      <lrndesign-gallery-carousel-item id="carousel-item" aspect-ratio\\$="[[aspectRatio]]" dark\\$="[[dark]]" extra-wide\\$="[[extraWide]]" image-style\\$="[[imageStyle]]" item="[[selected]]" responsive-size\\$="[[responsiveSize]]" theme\\$="[[theme]]">\n        <div id="xy-start" slot="xy-start">\n          <p class="x-of-y navigation" hidden\\$="[[__hideNav]">\n            </p><p class="sr-only">Slide [[__xOfY]] selected.</p> \n            <p></p>\n        </div>\n        <div id="xy-end" slot="xy-end">\n          <p class="x-of-y navigation" hidden\\$="[[__hideNav]">\n            (<span class="sr-only"> End of slide </span> [[__xOfY]]<span class="sr-only">.</span>) \n          </p>\n        </div>\n        <div id="prevnextnav" slot="prevnextnav">\n          <lrndesign-gallery-carousel-prevnext class="navigation" controls\\$="[[__gallery.id]]" hidden\\$="[[__hideNav]" id="carousel-prev" item="[[selected.prev]]" target\\$="[[__gallery]]" theme\\$="[[theme]]" type="previous">\n          </lrndesign-gallery-carousel-prevnext>\n          <lrndesign-gallery-carousel-prevnext class="navigation" controls="[[__gallery.id]]" hidden\\$="[[__hideNav]" id="carousel-next" item\\$="[[selected.next]]" target\\$="[[__gallery]]" theme\\$="[[theme]]" type="next">\n          </lrndesign-gallery-carousel-prevnext>\n        </div>\n        <div slot="thumbnails">\n          <p class="sr-only navigation" hidden\\$="[[__hideNav]">Slides list:</p>\n          <iron-list id="thumbslist" items="[[__items]]" as="item" grid="" selection-enabled="">\n            <template>\n              <lrndesign-gallery-thumb alt\\$="[[item.alt]]" class="navigation" controls\\$="[[__gallery]]" item="[[item.id]]" id="gallery-thumb" rounded-edges="false" selected\\$="[[_isSelected(selected)]]" theme\\$="[[theme]]" thumbnail="[[item.thumbnail]]" target\\$="[[item.target]]">\n              </lrndesign-gallery-thumb>\n            </template>\n          </iron-list>\n        </div>\n      </lrndesign-gallery-carousel-item>\n    </div>\n'
      ]
    );
    _templateObject_78f90d40f1e611e8a469df06e35415a9 = function _templateObject_78f90d40f1e611e8a469df06e35415a9() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_78f90d40f1e611e8a469df06e35415a9()
    ),
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
    attached: function attached() {
      this.__gallery = this.$.gallery;
      this.__timestamp = "gallery-anchor-" + Date.now();
      if (this.__setScroll) {
        document.getElementById(this.__timestamp).scrollIntoView();
      }
    },
    _itemsLoaded: function _itemsLoaded() {
      var anchor, item, index;
      this.__items = this.items;
      this.__hideNav = this.items !== void 0 ? 2 > this.items.length : !0;
      anchor = window.location.hash.replace("#", "");
      item = this.items.findIndex(function(i) {
        return i.id === anchor.replace("-zoom", "");
      });
      index = item !== void 0 && 0 < item ? item : 0;
      this.goToItem(index, !0, 0 !== index);
    },
    _getExtraWide: function _getExtraWide(items) {
      var img = new Image();
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
    _getImageStyle: function _getImageStyle(extraWide, responsiveSize) {
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
    goToItem: function goToItem(selection, setThumbnail, setScroll) {
      var root = this,
        index =
          "number" == typeof selection
            ? selection
            : root.items.findIndex(function(i) {
                return i.id === selection;
              });
      setThumbnail = setThumbnail !== void 0 ? setThumbnail : !1;
      this.__setScroll = setScroll !== void 0 ? setScroll : !1;
      if (
        "number" === typeof index &&
        0 <= index &&
        index < root.items.length
      ) {
        root.selected = root.items[index];
        if (null === root.$.thumbslist.selectItem || setThumbnail) {
          root.$.thumbslist.selectItem(root.items[index]);
        }
        root.__xOfY =
          parseInt(root.selected.index + 1) + " of " + root.items.length;
      }
    },
    _onNavTapped: function _onNavTapped(e) {
      this.goToItem(e.detail.item, "thumbnail" !== e.detail.type);
      this.$.gallery.focus();
    },
    _isSelected: function _isSelected(selected) {
      return selected ? "selected" : "";
    },
    _isAttrSet: function _isAttrSet(attr) {
      return null !== attr && attr !== void 0;
    }
  });
});

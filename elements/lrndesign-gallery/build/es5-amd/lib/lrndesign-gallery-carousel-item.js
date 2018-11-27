define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/iron-image/iron-image.js",
  "../node_modules/@polymer/iron-icons/iron-icons.js",
  "./lrndesign-gallery-zoom.js"
], function(_polymerLegacy, _ironImage, _ironIcons, _lrndesignGalleryZoom) {
  "use strict";
  function _templateObject_7ad7df60f1e611e8a469df06e35415a9() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style is="custom-style" include="simple-colors">\n      :host {\n        width: 100%;\n      }\n      :host #gallery-item {\n        width: 100%;\n        color: var(--lrndesign-gallery-color);\n        background-color: var(--lrndesign-gallery-background-color);\n        border: 1px solid var(--lrndesign-gallery-border-color);\n      }\n      :host(:not([responsive-size="xs"]):not([extra-wide])) #gallery-item {\n        display: flex;\n        justify-content: space-between;\n        align-items: stretch;\n        border-top: 4px solid var(--lrndesign-gallery-focus-color);\n      }\n      :host #gallery-image {\n        position: relative;\n      }\n      :host #gallery-image iron-image {\n        width: 100%;\n        height: 100%;\n      }\n      :host #prevnext {\n        left: 0;\n        top: 0;\n        height: 100%;\n        width: 100%;\n        position: absolute;\n      }\n      :host([responsive-size="sm"]:not([extra-wide]))  #gallery-item, \n      :host([responsive-size="sm"]:not([extra-wide])) #prevnext,\n      :host([responsive-size="md"]:not([extra-wide])) #gallery-item, \n      :host([responsive-size="md"]:not([extra-wide])) #prevnext{\n        height: 200px;\n        max-height: 200px;\n      }\n      :host([responsive-size="lg"]:not([extra-wide])) #gallery-item, \n      :host([responsive-size="lg"]:not([extra-wide])) #prevnext{\n        height: 300px;\n        max-height: 300px;\n      }\n      :host([responsive-size="xl"]:not([extra-wide])) #gallery-item, \n      :host([responsive-size="xl"]:not([extra-wide])) #prevnext{\n        height: 400px;\n        max-height: 400px;\n      }\n      :host lrndesign-gallery-zoom {\n        left: 0;\n        bottom: 0px;\n        z-index: 2; \n        position: absolute;\n      }\n      :host #details {\n        flex-grow: 1;\n        flex-shrink: 1;\n        overflow-y: scroll;\n      }\n      :host([responsive-size="xs"]) #details,\n      :host([extra-wide]) #details {\n        margin-top: -4px;\n        border-top: 4px solid var(--lrndesign-gallery-focus-color);\n      }\n      :host #details-inner {\n        height: 100%;\n        display: flex;\n        position: relative;\n        justify-content: space-between;\n        flex-wrap: wrap;\n        align-items: stretch;\n        align-content: stretch;\n      }\n      :host #itemdetails, \n      :host #thumbnails {\n        padding: 20px;\n        flex-basis: 100%;\n      }\n      :host #itemdetails {\n        align-self: flex-start;\n        flex-grow: 1;\n        flex-shrink: 1;\n        overflow: scroll;\n      }\n      :host #itemtitle {\n        margin-top: 0;\n      }\n      :host #thumbnails {\n        align-self: flex-end;\n      }\n    </style>\n    <div id="gallery-item">\n      <slot name="xy-start"></slot>\n      <div id="gallery-image">\n        <iron-image alt$="[[item.alt]]" fade="" id$="[[item.id]]" placeholder$="[[item.thumbnail]]" sizing$="[[item.sizing]]" src$="[[item.src]]" style$="[[imageStyle]]">\n        </iron-image>\n        <lrndesign-gallery-zoom dark$="[[dark]]" details$="[[item.details]]" heading$="[[item.heading]]" hidden$="[[!item.zoom]]" icon="zoom-in" id="gallery-zoom" item-id="[[item.id]]" src$="[[item.large]]" tooltip$="[[item.tooltip]]" zoom-alt$="[[item.alt]]">\n        </lrndesign-gallery-zoom>\n        <div id="prevnext">\n          <slot name="prevnextnav"></slot>\n        </div>\n      </div>\n      <div id="details" class="item-info">\n        <div id="details-inner">\n          <div id="itemdetails">\n            <h2 id="itemtitle" hidden="[[!_isAttrSet(item.title)]]">[[item.title]]</h2>\n            <div id="itembody"></div>\n          </div>\n          <slot id="xyend" name="xy-end"></slot>\n          <div id="thumbnails" class="item-info">\n            <div id="thumbnails-inner">\n              <slot name="thumbnails"></slot>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n'
      ],
      [
        '\n    <style is="custom-style" include="simple-colors">\n      :host {\n        width: 100%;\n      }\n      :host #gallery-item {\n        width: 100%;\n        color: var(--lrndesign-gallery-color);\n        background-color: var(--lrndesign-gallery-background-color);\n        border: 1px solid var(--lrndesign-gallery-border-color);\n      }\n      :host(:not([responsive-size="xs"]):not([extra-wide])) #gallery-item {\n        display: flex;\n        justify-content: space-between;\n        align-items: stretch;\n        border-top: 4px solid var(--lrndesign-gallery-focus-color);\n      }\n      :host #gallery-image {\n        position: relative;\n      }\n      :host #gallery-image iron-image {\n        width: 100%;\n        height: 100%;\n      }\n      :host #prevnext {\n        left: 0;\n        top: 0;\n        height: 100%;\n        width: 100%;\n        position: absolute;\n      }\n      :host([responsive-size="sm"]:not([extra-wide]))  #gallery-item, \n      :host([responsive-size="sm"]:not([extra-wide])) #prevnext,\n      :host([responsive-size="md"]:not([extra-wide])) #gallery-item, \n      :host([responsive-size="md"]:not([extra-wide])) #prevnext{\n        height: 200px;\n        max-height: 200px;\n      }\n      :host([responsive-size="lg"]:not([extra-wide])) #gallery-item, \n      :host([responsive-size="lg"]:not([extra-wide])) #prevnext{\n        height: 300px;\n        max-height: 300px;\n      }\n      :host([responsive-size="xl"]:not([extra-wide])) #gallery-item, \n      :host([responsive-size="xl"]:not([extra-wide])) #prevnext{\n        height: 400px;\n        max-height: 400px;\n      }\n      :host lrndesign-gallery-zoom {\n        left: 0;\n        bottom: 0px;\n        z-index: 2; \n        position: absolute;\n      }\n      :host #details {\n        flex-grow: 1;\n        flex-shrink: 1;\n        overflow-y: scroll;\n      }\n      :host([responsive-size="xs"]) #details,\n      :host([extra-wide]) #details {\n        margin-top: -4px;\n        border-top: 4px solid var(--lrndesign-gallery-focus-color);\n      }\n      :host #details-inner {\n        height: 100%;\n        display: flex;\n        position: relative;\n        justify-content: space-between;\n        flex-wrap: wrap;\n        align-items: stretch;\n        align-content: stretch;\n      }\n      :host #itemdetails, \n      :host #thumbnails {\n        padding: 20px;\n        flex-basis: 100%;\n      }\n      :host #itemdetails {\n        align-self: flex-start;\n        flex-grow: 1;\n        flex-shrink: 1;\n        overflow: scroll;\n      }\n      :host #itemtitle {\n        margin-top: 0;\n      }\n      :host #thumbnails {\n        align-self: flex-end;\n      }\n    </style>\n    <div id="gallery-item">\n      <slot name="xy-start"></slot>\n      <div id="gallery-image">\n        <iron-image alt\\$="[[item.alt]]" fade="" id\\$="[[item.id]]" placeholder\\$="[[item.thumbnail]]" sizing\\$="[[item.sizing]]" src\\$="[[item.src]]" style\\$="[[imageStyle]]">\n        </iron-image>\n        <lrndesign-gallery-zoom dark\\$="[[dark]]" details\\$="[[item.details]]" heading\\$="[[item.heading]]" hidden\\$="[[!item.zoom]]" icon="zoom-in" id="gallery-zoom" item-id="[[item.id]]" src\\$="[[item.large]]" tooltip\\$="[[item.tooltip]]" zoom-alt\\$="[[item.alt]]">\n        </lrndesign-gallery-zoom>\n        <div id="prevnext">\n          <slot name="prevnextnav"></slot>\n        </div>\n      </div>\n      <div id="details" class="item-info">\n        <div id="details-inner">\n          <div id="itemdetails">\n            <h2 id="itemtitle" hidden="[[!_isAttrSet(item.title)]]">[[item.title]]</h2>\n            <div id="itembody"></div>\n          </div>\n          <slot id="xyend" name="xy-end"></slot>\n          <div id="thumbnails" class="item-info">\n            <div id="thumbnails-inner">\n              <slot name="thumbnails"></slot>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n'
      ]
    );
    _templateObject_7ad7df60f1e611e8a469df06e35415a9 = function _templateObject_7ad7df60f1e611e8a469df06e35415a9() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_7ad7df60f1e611e8a469df06e35415a9()
    ),
    is: "lrndesign-gallery-carousel-item",
    properties: {
      dark: { type: Boolean, value: !1 },
      imageStyle: { type: String, value: null },
      item: {
        type: Object,
        value: {},
        notify: !0,
        reflectToAttribute: !0,
        observer: "_updateDetails"
      },
      responsiveSize: { type: String, value: "xs", reflectToAttribute: !0 },
      theme: { type: String, value: "default" }
    },
    _updateDetails: function _updateDetails() {
      this.$.itembody.innerHTML = this.item.details;
    },
    _getIndex: function _getIndex(index, step) {
      return index + step;
    },
    _isAttrSet: function _isAttrSet(attr) {
      return null !== attr && attr !== void 0;
    }
  });
});

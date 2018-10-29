define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@lrnwebcomponents/lrnsys-layout/lib/lrnsys-dialog.js",
  "../node_modules/@lrnwebcomponents/lrnsys-layout/lib/lrnsys-dialog-toolbar-button.js",
  "../node_modules/@lrnwebcomponents/img-pan-zoom/img-pan-zoom.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_cff01440db3411e88913815020501c64() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style is="custom-style">\n      :host #lrnsysdialog ::slotted(#dialogtrigger){\n        --app-toolbar-primary-color: var(--lrndesign-gallery-focus-color);\n        --app-toolbar-secondary-color: rgba(0, 0, 0, 0.7);\n      }\n\n      :host #lrnsysdialog ::slotted(#dialogtrigger) {\n        \n      }\n      :host #lrnsysdialog ::slotted(#dialogtrigger) {\n        text-align: center; \n        padding: 6px;\n        min-width: 30px; \n        color: var(--lrndesign-gallery-color);\n      }\n      :host #inspector ::slotted(app-toolbar) {\n        padding: 0;\n        margin: 0;\n      }\n      :host #lrnsysdialog ::slotted(#dialogtrigger > lrnsys-button-inner) {\n        width: 30px;\n        line-height: 30px;\n        transition: background-color 1s;\n        color: var(--lrndesign-gallery-color);\n        background-color: var(--lrndesign-gallery-rgba-low);\n        border-radius: 3px;\n      }\n      :host #lrnsysdialog ::slotted(#dialogtrigger > lrnsys-button-inner):focus, \n      :host #lrnsysdialog ::slotted(#dialogtrigger > lrnsys-button-inner):hover {\n        color: var(--lrndesign-gallery-focus-color);\n        background-color: var(--lrndesign-gallery-background-color);\n      }\n    </style>\n    <lrnsys-dialog id="lrnsysdialog" dark$="[[dark]]" dynamic-images="" body-append="" title$="[[tooltip]]">\n      <span slot="button"><iron-icon icon$="[[icon]]" hidden$="[[!_isAttrSet(icon)]]"></iron-icon></span>\n      <div slot="toolbar-primary"><span aria-hidden="true">[[heading]]</span></div>\n      <span slot="toolbar-secondary">\n        <lrnsys-dialog-toolbar-button title="Zoom In" icon="zoom-in" id="in"></lrnsys-dialog-toolbar-button>\n        <lrnsys-dialog-toolbar-button title="Zoom Out" icon="zoom-out" id="out"></lrnsys-dialog-toolbar-button>\n      </span>\n      <div slot="header">\n        <h1 style="position: absolute; left: -99999px; top:-1px; height: 0; width: 0; overflow: auto;">\n          [[heading]]\n        </h1>\n      </div>\n      <div>\n        <img-pan-zoom id="img" alt$="[[zoomAlt]]" src$="[[src]]" max-zoom-pixel-ratio="1.5" min-zoom-image-ratio="0.5" zoom-per-click="1.2" zoom-per-scroll="0.6">\n        </img-pan-zoom>\n        <div id="details"></div>\n      </div>\n    </lrnsys-dialog>\n'
      ],
      [
        '\n    <style is="custom-style">\n      :host #lrnsysdialog ::slotted(#dialogtrigger){\n        --app-toolbar-primary-color: var(--lrndesign-gallery-focus-color);\n        --app-toolbar-secondary-color: rgba(0, 0, 0, 0.7);\n      }\n\n      :host #lrnsysdialog ::slotted(#dialogtrigger) {\n        \n      }\n      :host #lrnsysdialog ::slotted(#dialogtrigger) {\n        text-align: center; \n        padding: 6px;\n        min-width: 30px; \n        color: var(--lrndesign-gallery-color);\n      }\n      :host #inspector ::slotted(app-toolbar) {\n        padding: 0;\n        margin: 0;\n      }\n      :host #lrnsysdialog ::slotted(#dialogtrigger > lrnsys-button-inner) {\n        width: 30px;\n        line-height: 30px;\n        transition: background-color 1s;\n        color: var(--lrndesign-gallery-color);\n        background-color: var(--lrndesign-gallery-rgba-low);\n        border-radius: 3px;\n      }\n      :host #lrnsysdialog ::slotted(#dialogtrigger > lrnsys-button-inner):focus, \n      :host #lrnsysdialog ::slotted(#dialogtrigger > lrnsys-button-inner):hover {\n        color: var(--lrndesign-gallery-focus-color);\n        background-color: var(--lrndesign-gallery-background-color);\n      }\n    </style>\n    <lrnsys-dialog id="lrnsysdialog" dark\\$="[[dark]]" dynamic-images="" body-append="" title\\$="[[tooltip]]">\n      <span slot="button"><iron-icon icon\\$="[[icon]]" hidden\\$="[[!_isAttrSet(icon)]]"></iron-icon></span>\n      <div slot="toolbar-primary"><span aria-hidden="true">[[heading]]</span></div>\n      <span slot="toolbar-secondary">\n        <lrnsys-dialog-toolbar-button title="Zoom In" icon="zoom-in" id="in"></lrnsys-dialog-toolbar-button>\n        <lrnsys-dialog-toolbar-button title="Zoom Out" icon="zoom-out" id="out"></lrnsys-dialog-toolbar-button>\n      </span>\n      <div slot="header">\n        <h1 style="position: absolute; left: -99999px; top:-1px; height: 0; width: 0; overflow: auto;">\n          [[heading]]\n        </h1>\n      </div>\n      <div>\n        <img-pan-zoom id="img" alt\\$="[[zoomAlt]]" src\\$="[[src]]" max-zoom-pixel-ratio="1.5" min-zoom-image-ratio="0.5" zoom-per-click="1.2" zoom-per-scroll="0.6">\n        </img-pan-zoom>\n        <div id="details"></div>\n      </div>\n    </lrnsys-dialog>\n'
      ]
    );
    _templateObject_cff01440db3411e88913815020501c64 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)(
    babelHelpers.defineProperty(
      {
        _template: (0, _polymerLegacy.html)(
          _templateObject_cff01440db3411e88913815020501c64()
        ),
        is: "lrndesign-gallery-zoom",
        listeners: { navTap: "_onNavTapped" },
        behaviors: [simpleColorsBehaviors],
        properties: {
          details: { type: String, value: null, observer: "_detailsChanged" },
          heading: { type: String, value: "Image Zoom" },
          icon: { type: String, value: null },
          itemId: { type: String, value: null, observer: "_itemChanged" },
          tooltip: { type: String, value: "Zoom In" },
          src: { type: String, reflectToAttribute: !0 },
          type: { type: String, value: "carousel" },
          zoomAlt: { type: String, value: null }
        },
        attached: function attached() {
          this.$.details.innerHTML = this.details;
          document.body.addEventListener(
            "lrnsys-dialog-changed",
            this._dialogChanged.bind(this)
          );
        },
        _isAttrSet: function _isAttrSet(attr) {
          return null !== attr && attr !== void 0;
        },
        imgZoom: function imgZoom(e) {
          if ("in" == e.detail.id) {
            this.$.img.zoomIn();
          } else {
            this.$.img.zoomOut();
          }
        },
        toggleDialog: function toggleDialog() {
          this.$.lrnsysdialog.toggleDialog();
        },
        _detailsChanged: function _detailsChanged() {
          this.$.details.innerHTML = this.details;
        },
        _dialogChanged: function _dialogChanged(e) {
          if (e.detail === this.$.lrnsysdialog) {
            if (e.detail.$.modal.opened) {
              document.body.addEventListener(
                "dialog-toolbar-button-tapped",
                this.imgZoom.bind(this)
              );
            } else {
              document.body.removeEventListener(
                "dialog-toolbar-button-tapped",
                this.imgZoom.bind(this)
              );
            }
          }
        },
        _itemChanged: function _itemChanged() {
          if (!0 !== this.__init) {
            var anchor = window.location.hash.replace("#", ""),
              item = anchor.replace("-zoom", ""),
              zoom = anchor.endsWith("-zoom");
            if (this.itemId == item && zoom) {
              this.__init = !0;
              this.toggleDialog();
            }
          }
        }
      },
      "_isAttrSet",
      function _isAttrSet(attr) {
        return null !== attr && attr !== void 0;
      }
    )
  );
});

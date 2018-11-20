import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@lrnwebcomponents/lrnsys-layout/lib/lrnsys-dialog.js";
import "../node_modules/@lrnwebcomponents/lrnsys-layout/lib/lrnsys-dialog-toolbar-button.js";
import "../node_modules/@lrnwebcomponents/img-pan-zoom/img-pan-zoom.js";
import "../node_modules/@polymer/iron-icon/iron-icon.js";
import "../node_modules/@polymer/iron-icons/iron-icons.js";
Polymer({
  _template: html`
    <style is="custom-style">
      :host #lrnsysdialog ::slotted(#dialogtrigger){
        --app-toolbar-primary-color: var(--lrndesign-gallery-focus-color);
        --app-toolbar-secondary-color: rgba(0, 0, 0, 0.7);
      }

      :host #lrnsysdialog ::slotted(#dialogtrigger) {
        
      }
      :host #lrnsysdialog ::slotted(#dialogtrigger) {
        text-align: center; 
        padding: 6px;
        min-width: 30px; 
        color: var(--lrndesign-gallery-color);
      }
      :host #inspector ::slotted(app-toolbar) {
        padding: 0;
        margin: 0;
      }
      :host #lrnsysdialog ::slotted(#dialogtrigger > lrnsys-button-inner) {
        width: 30px;
        line-height: 30px;
        transition: background-color 1s;
        color: var(--lrndesign-gallery-color);
        background-color: var(--lrndesign-gallery-rgba-low);
        border-radius: 3px;
      }
      :host #lrnsysdialog ::slotted(#dialogtrigger > lrnsys-button-inner):focus, 
      :host #lrnsysdialog ::slotted(#dialogtrigger > lrnsys-button-inner):hover {
        color: var(--lrndesign-gallery-focus-color);
        background-color: var(--lrndesign-gallery-background-color);
      }
      iron-icon {
        display: inline-block;
        height: 24px;
        width: 24px;
      }
    </style>
    <lrnsys-dialog id="lrnsysdialog" dark$="[[dark]]" dynamic-images body-append title$="[[tooltip]]">
      <span slot="button"><iron-icon icon="[[icon]]" hidden$="[[!_isAttrSet(icon)]]"></iron-icon></span>
      <div slot="toolbar-primary"><span aria-hidden="true">[[heading]]</span></div>
      <span slot="toolbar-secondary">
        <lrnsys-dialog-toolbar-button title="Zoom In" icon="zoom-in" id="in"></lrnsys-dialog-toolbar-button>
        <lrnsys-dialog-toolbar-button title="Zoom Out" icon="zoom-out" id="out"></lrnsys-dialog-toolbar-button>
      </span>
      <div slot="header">
        <h1 style="position: absolute; left: -99999px; top:-1px; height: 0; width: 0; overflow: auto;">
          [[heading]]
        </h1>
      </div>
      <div>
        <img-pan-zoom id="img" alt\$="[[zoomAlt]]" src\$="[[src]]" max-zoom-pixel-ratio="1.5" min-zoom-image-ratio="0.5" zoom-per-click="1.2" zoom-per-scroll="0.6">
        </img-pan-zoom>
        <div id="details"></div> 
      </div>
    </lrnsys-dialog>
`,
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
  attached: function() {
    this.$.details.innerHTML = this.details;
    document.body.addEventListener(
      "lrnsys-dialog-changed",
      this._dialogChanged.bind(this)
    );
  },
  _isAttrSet: function(attr) {
    return null !== attr && attr !== void 0;
  },
  imgZoom: function(e) {
    if ("in" == e.detail.id) {
      this.$.img.zoomIn();
    } else {
      this.$.img.zoomOut();
    }
  },
  toggleDialog: function() {
    this.$.lrnsysdialog.openDialog();
  },
  _detailsChanged: function() {
    this.$.details.innerHTML = this.details;
  },
  _dialogChanged: function(e) {
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
  _itemChanged: function() {
    if (!0 !== this.__init) {
      let anchor = window.location.hash.replace("#", ""),
        item = anchor.replace("-zoom", ""),
        zoom = anchor.endsWith("-zoom");
      if (this.itemId == item && zoom) {
        this.__init = !0;
        this.toggleDialog();
      }
    }
  },
  _isAttrSet: function(attr) {
    return null !== attr && attr !== void 0;
  }
});

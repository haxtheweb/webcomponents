import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/lrnsys-layout/lib/lrnsys-dialog.js";
import "@lrnwebcomponents/lrnsys-layout/lib/lrnsys-dialog-toolbar-button.js";
import "@lrnwebcomponents/img-pan-zoom/img-pan-zoom.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/iron-icons.js";
/**
`lrndesign-gallery-zoom`
A LRN element that renders the zoom feature for the gallery.

@demo demo/index.html

@microcopy - the mental model for this element
  <lrndesign-gallery-zoom 
    controls = "GALLERY-OR-DIALOG-ID"    //required
    heading = "IMAGE NAME">              //required, "next" (default) or "previous"
    item = "0"                           //required, index of the item to view
    target = "DIALOG OBJECT"             //required
    tooltip="ZOOM"                       //optional, text for tooltip
  </lrndesign-gallery-zoom>
*/
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

  listeners: {
    navTap: "_onNavTapped"
  },

  behaviors: [simpleColorsBehaviors],

  properties: {
    /**
     * optional: details for zooming
     */
    details: {
      type: String,
      value: null,
      observer: "_detailsChanged"
    },
    /**
     * heading for the zoom modal
     */
    heading: {
      type: String,
      value: "Image Zoom"
    },
    /**
     * optional: name for iron-icon used to indicate zoom
     */
    icon: {
      type: String,
      value: null
    },
    /**
     * heading for the zoom modal
     */
    itemId: {
      type: String,
      value: null,
      observer: "_itemChanged"
    },
    /**
     * tooltip for the zoom button
     */
    tooltip: {
      type: String,
      value: "Zoom In"
    },
    /**
     * Image source.
     */
    src: {
      type: String,
      reflectToAttribute: true
    },
    /**
     * Carousel or grid
     */
    type: {
      type: String,
      value: "carousel"
    },
    /**
     * gallery item's alt text
     */
    zoomAlt: {
      type: String,
      value: null
    }
  },

  /**
   * attached
   */
  attached: function() {
    this.$.details.innerHTML = this.details;
    document.body.addEventListener(
      "lrnsys-dialog-changed",
      this._dialogChanged.bind(this)
    );
  },

  /**
   * returns true if the given attribute is not null
   */
  _isAttrSet: function(attr) {
    return attr !== null && attr !== undefined;
  },

  /**
   * Zoom in by calling  downstream function.
   */
  imgZoom: function(e) {
    if (e.detail.id == "in") {
      this.$.img.zoomIn();
    } else {
      this.$.img.zoomOut();
    }
  },

  /**
   * Toggles the dialog.
   */
  toggleDialog: function() {
    this.$.lrnsysdialog.openDialog();
  },

  /**
   * updates the details.
   */
  _detailsChanged: function(e) {
    this.$.details.innerHTML = this.details;
  },

  /**
   * Toggles the dialog.
   */
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

  /**
   * Toggles dialog based on anchor
   */
  _itemChanged: function() {
    if (this.__init !== true) {
      let anchor = window.location.hash.replace("#", ""),
        item = anchor.replace("-zoom", ""),
        zoom = anchor.endsWith("-zoom");
      if (this.itemId == item && zoom) {
        this.__init = true;
        this.toggleDialog();
      }
    }
  },

  /**
   * returns true if the given attribute is not null
   */
  _isAttrSet: function(attr) {
    return attr !== null && attr !== undefined;
  }
});

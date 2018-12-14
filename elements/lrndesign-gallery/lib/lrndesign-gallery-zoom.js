/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@lrnwebcomponents/simple-modal/lib/simple-modal-template.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/paper-button/paper-button.js";
import "@lrnwebcomponents/img-pan-zoom/img-pan-zoom.js";

export { LrndesignGalleryZoom };
/**
 * `lrndesign-gallery-zoom`
 * `An element that renders the zoom feature for the gallery.`
 *
 * @microcopy - language worth noting:```
<lrndesign-gallery-zoom 
  controls = "GALLERY-OR-DIALOG-ID"    //required
  heading = "IMAGE NAME">              //required, "next" (default) or "previous"
  item = "0"                           //required, index of the item to view
  target = "DIALOG OBJECT"             //required
  tooltip="ZOOM"                       //optional, text for tooltip
</lrndesign-gallery-zoom>```
 *
 * @customElement
 * @polymer
 */
class LrndesignGalleryZoom extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "lrndesign-gallery-zoom";
  }

  // render function
  static get template() {
    return html`
      <style is="custom-style">
        #zoombtn {
          padding: 0;
          margin: 0;
          min-width: unset;
        }
        #zoombtn iron-icon {
          width: 24px;
          height: 24px;
        }
      </style>
      <paper-button id="zoombtn" label$="[[tooltip]]">
        <iron-icon icon="[[icon]]" hidden$="[[!_isAttrSet(icon)]]"></iron-icon>
      </paper-button>
      <simple-modal-template id="zoomdialog" title$="[[tooltip]]">
        <div slot="header">[[heading]]</div>
        <div slot="subheading">
          <lrnsys-dialog-toolbar-button
            title="Zoom In"
            icon="zoom-in"
            id="in"
          ></lrnsys-dialog-toolbar-button>
          <lrnsys-dialog-toolbar-button
            title="Zoom Out"
            icon="zoom-out"
            id="out"
          ></lrnsys-dialog-toolbar-button>
        </div>
        <div slot="content">
          <img-pan-zoom
            id="img"
            alt$="[[zoomAlt]]"
            src$="[[src]]"
            max-zoom-pixel-ratio="1.5"
            min-zoom-image-ratio="0.5"
            zoom-per-click="1.2"
            zoom-per-scroll="0.6"
          >
          </img-pan-zoom>
          <div id="details">[[details]]</div>
        </div>
      </simple-modal-template>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * optional: details for zooming
       */
      details: {
        type: String,
        value: null
        //observer: "_detailsChanged"
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
        value: null
        //observer: "_itemChanged"
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
    };
  }
  
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.$.zoomdialog.associateEvents(this.$.zoombtn);
  }
  
  /**
   * returns true if the given attribute is not null
   */
  _isAttrSet(attr) {
    return attr !== null && attr !== undefined;
  }

  /**
   * attached
   * /
  attached: function() {
    this.$.details.innerHTML = this.details;
    document.body.addEventListener(
      "lrnsys-dialog-changed",
      this._dialogChanged.bind(this)
    );
  },

  /**
   * returns true if the given attribute is not null
   * /
  _isAttrSet: function(attr) {
    return attr !== null && attr !== undefined;
  },

  /**
   * Zoom in by calling  downstream function.
   * /
  imgZoom: function(e) {
    if (e.detail.id == "in") {
      this.$.img.zoomIn();
    } else {
      this.$.img.zoomOut();
    }
  },

  /**
   * Toggles the dialog.
   * /
  toggleDialog: function() {
    this.$.zoomdialog.openDialog();
  },

  /**
   * updates the details.
   * /
  _detailsChanged: function(e) {
    this.$.details.innerHTML = this.details;
  },

  /**
   * Toggles the dialog.
   * /
  _dialogChanged: function(e) {
    if (e.detail === this.$.zoomdialog) {
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
   * /
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
  },*/
}
window.customElements.define(
  LrndesignGalleryZoom.tag,
  LrndesignGalleryZoom
);
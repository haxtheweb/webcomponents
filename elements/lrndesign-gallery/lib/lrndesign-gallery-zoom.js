/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@lrnwebcomponents/simple-modal/lib/simple-modal-template.js";
import "@polymer/paper-button/paper-button.js";
import "@lrnwebcomponents/img-pan-zoom/img-pan-zoom.js";
import "@polymer/paper-tooltip/paper-tooltip.js";

export { LrndesignGalleryZoom };
/**
 * `lrndesign-gallery-zoom`
 * `An element that renders the zoom feature for the gallery.`
 *
 * @microcopy - language worth noting:```
<lrndesign-gallery-zoom 
  details="Text details about the image." //optional text about the image
  heading$="Image title"                  //required, image dialog title
  item-id="0"                             //required, index of the item to view
  src$="[[item.large]]"                   //required, full-sized image
  tooltip$="[[item.tooltip]]"             //required, tooltip text
  zoom-alt$="[[item.alt]]"                //required, alt text for the image
  tooltip="ZOOM"                       
</lrndesign-gallery-zoom>```
 *
 * CSS Variables: ```
--lrndesign-gallery-dialog-color                        //text color of dialog
--lrndesign-gallery-dialog-background-color             //background-color of dialog
--lrndesign-gallery-dialog-titlebar-color               //text color of dialog titlebar
--lrndesign-gallery-dialog-titlebar-background-color    //background-color of dialog titlebar
--lrndesign-gallery-dialog-header-color                 //text color of dialog header
--lrndesign-gallery-dialog-header-background-color      //background-color of dialog header```
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

  //get gallery behaviors
  static get behaviors() {
    return [LrnDesignGalleryBehaviors];
  }

  // render function
  static get template() {
    return html`
      <style is="custom-style" include="simple-colors">
        :host([hidden]) {
          display: none;
        }
        #zoomdialog {
          --simple-modal-width: 75vw;
          --simple-modal-height: 75vh;
          --simple-modal-titlebar-color: var(
            --lrndesign-gallery-dialog-titlebar-color
          );
          --simple-modal-titlebar-background: var(
            --lrndesign-gallery-dialog-titlebar-background-color
          );
          --simple-modal-header-color: var(
            --lrndesign-gallery-dialog-header-color
          );
          --simple-modal-header-background: var(
            --lrndesign-gallery-dialog-header-background-color
          );
          --simple-modal-content-container-color: var(
            --lrndesign-gallery-dialog-color
          );
          --simple-modal-content-container-background: var(
            --lrndesign-gallery-dialog-background-color
          );
        }
        #zoombtn {
          padding: 0px;
          margin: 0;
          min-width: unset;
        }
      </style>
      <paper-button id="zoombtn" label$="[[tooltip]]" title="">
        <slot></slot>
      </paper-button>
      <paper-tooltip for="zoombtn" position="right">[[tooltip]]</paper-tooltip>
      <simple-modal-template id="zoomdialog" title$="[[heading]]">
        <div
          id="details"
          slot="header"
          hidden$="[[!_isAttrSet(details)]]"
        ></div>
        <div slot="content" hidden$="[[!_isAttrSet(src)]]">
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
          <div>
            Swipe, use a mouse or use the +/- and arrow keys to zoom and pan the
            image above.
          </div>
        </div>
      </simple-modal-template>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
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
       * heading for the zoom modal
       */
      itemId: {
        type: String,
        value: null
        //observer: "_itemChanged"
      },
      /**
       * The zoom modal
       */
      modal: {
        type: Object,
        value: null
      },
      /**
       * scrolled to by default (for grid)?
       */
      scrolled: {
        type: Boolean,
        value: false
      },
      /**
       * Image source.
       */
      src: {
        type: String,
        reflectToAttribute: true
      },
      /**
       * tooltip for the zoom button
       */
      tooltip: {
        type: String,
        value: "Zoom In"
      },
      /**
       * gallery item's alt text
       */
      zoomAlt: {
        type: String,
        value: null
      },
      /**
       * zoomed by default?
       */
      zoomed: {
        type: Boolean,
        value: false
      }
    };
  }

  /**
   * life cycle, element is ready
   */
  ready() {
    super.ready();
    this._detailsChanged();
    this.modal = this.$.zoomdialog.associateEvents(this.$.zoombtn);
    this.$.zoomdialog.associateEvents(this.$.zoombtn, "gallery-zoom");
    if (this.scrolled) {
      this.dispatchEvent(new CustomEvent("gallery-scroll"));
      if (!this.zoomed) this.$.zoombtn.focus();
    }
    if (this.zoomed) {
      this.zoom();
    }
  }

  /**
   * opens the modal
   */
  zoom() {
    let root = this;
    root.$.zoombtn.dispatchEvent(
      new CustomEvent("gallery-zoom", { detail: { root } })
    );
  }

  /**
   * updates the details.
   */
  _detailsChanged(e) {
    this.$.details.innerHTML = this.details;
  }

  /**
   * returns true if the given attribute is not null
   *
   * @param {string} the attribute to test
   * @returns {boolean} if there is a non-null value for the attribute
   */
  _isAttrSet(attr = null) {
    return attr !== null && attr !== undefined;
  }
}
window.customElements.define(LrndesignGalleryZoom.tag, LrndesignGalleryZoom);

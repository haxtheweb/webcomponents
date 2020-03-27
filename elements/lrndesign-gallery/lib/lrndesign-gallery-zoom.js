/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-modal/lib/simple-modal-template.js";
import "@polymer/paper-button/paper-button.js";
import "@lrnwebcomponents/img-pan-zoom/img-pan-zoom.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
/**
 * `lrndesign-gallery-zoom`
 * An element that renders the zoom feature for the gallery.
 * 
 * @customElement lrndesign-gallery-zoom
 *
 * @microcopy - language worth noting:```
<lrndesign-gallery-zoom 
  details="Text details about the image." //optional text about the image
  heading="Image title"                  //required, image dialog title
  item-id="0"                             //required, index of the item to view
  src="${this.item.large}"                   //required, full-sized image
  tooltip="${this.item.tooltip}"             //required, tooltip text
  zoom-alt="${this.item.alt}"                //required, alt text for the image
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
 */
class LrndesignGalleryZoom extends LitElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "lrndesign-gallery-zoom";
  }

  // render function
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        :host([hidden]) {
          display: none;
        }
        :host paper-button {
          width: 100%;
        }
        simple-modal-template[modal-id="zoomdialog"] {
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
        }`
    ];
  }
  render(){
    return html`
      <paper-button
        id="zoombtn"
        label="${this.tooltip}"
        controls="zoomdialog"
        @click="${this.zoom}"
      >
        <slot></slot>
      </paper-button>
      <simple-tooltip for="zoombtn" position="right"
        >${this.tooltip}</simple-tooltip
      >
      <simple-modal-template
        id="zoomtpl"
        modal-id="zoomdialog"
        title="${this.heading}"
      >
        <div
          id="details"
          slot="header"
          ?hidden="${!this.details || this.details===""}"
        ></div>
        <div slot="content" ?hidden="${!this.src || this.src===""}">
          <img-pan-zoom
            id="img"
            alt="${this.zoomAlt}"
            src="${this.src}"
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
       * heading for the zoom modal
       */
      heading: {
        type: String
      },
      /**
       * heading for the zoom modal
       */
      itemId: {
        type: String
        //observer: "_itemChanged"
      },
      /**
       * The zoom modal
       */
      modal: {
        type: Object
      },
      /**
       * scrolled to by default (for grid)?
       */
      scrolled: {
        type: Boolean
      },
      /**
       * Image source.
       */
      src: {
        type: String,
        reflect: true,
        attribute: "src"
      },
      /**
       * tooltip for the zoom button
       */
      tooltip: {
        type: String
      },
      /**
       * gallery item's alt text
       */
      zoomAlt: {
        type: String
      },
      /**
       * zoomed by default?
       */
      zoomed: {
        type: Boolean
      }
    };
  }

  /**
   * life cycle, element is ready
   */
  constructor() {
    super();
    this.heading = "Image Zoom";
    this.scrolled = false;
    this.tooltip = "Zoom In";
    this.zoomed = false;
    this.shadowRoot
      .querySelector("#zoomtpl")
      .associateEvents(this.shadowRoot.querySelector("#zoombtn"));
    if (this.scrolled) {
      this.dispatchEvent(new CustomEvent("gallery-scroll"));
      if (!this.zoomed) this.shadowRoot.querySelector("#zoombtn").focus();
    }
    if (this.zoomed) this.zoom();
  }

  /**
   * opens the modal
   */
  zoom() {
    let event = new CustomEvent("gallery-zoom", { detail: this });
    this.shadowRoot
      .querySelector("#zoombtn")
      .dispatchEvent(event);
  }
}
window.customElements.define(LrndesignGalleryZoom.tag, LrndesignGalleryZoom);
export { LrndesignGalleryZoom };
/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "@lrnwebcomponents/img-view-modal/img-view-modal.js";
import "./lrndesign-gallery-details.js";
/**
 * `lrndesign-gallery-zoom`
 * An element that renders the zoom feature for the gallery.
 * 
 * @element lrndesign-gallery-zoom
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
class LrndesignGalleryZoom extends LitElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "lrndesign-gallery-zoom";
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          background-color: none;
        }
        :host([hidden]) {
          display: none;
        }
        #zoombtn {
          display: block;
          width: 100%;
          padding: 0;
          margin: 0;
          border-width: 0;
          background-color: transparent;
        }
        simple-modal-template[modal-id="zoomdialog"] {
          --img-view-modal-backgroundColor: var(
            --lrndesign-gallery-dialog-background-color
          );
          --img-view-modal-color: var(--lrndesign-gallery-dialog-color);
          --img-view-modal-borderColor: var(
            --lrndesign-gallery-dialog-border-color
          );
          --img-view-modal-toggled-backgroundColor: var(
            --lrndesign-gallery-dialog-toggled-background-color
          );
        }
      `,
    ];
  }
  render() {
    return html`
      <img-view-modal
        .figures="${this.figures}"
        .toolbars="${this.toolbars}"
        title="${this.heading || ""}"
        max-zoom-pixel-ratio="1.5"
        min-zoom-image-ratio="0.5"
        zoom-per-click="1.2"
        zoom-per-scroll="0.6"
      >
        <button id="zoombtn" aria-label="${this.tooltip}">
          <slot></slot>
        </button>
      </img-view-modal>
      <simple-tooltip for="zoombtn" position="right" controls="zoomtpl"
        >${this.tooltip}</simple-tooltip
      >
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * heading for zoom modal
       */
      heading: {
        type: String,
      },

      /**
       * details for zoom modal
       */
      details: {
        type: String,
      },
      /**
       * Image source.
       */
      src: {
        type: String,
        reflect: true,
        attribute: "src",
      },
      /**
       * tooltip for the zoom button
       */
      tooltip: {
        type: String,
      },
      /**
       * gallery item's alt text
       */
      zoomAlt: {
        type: String,
        attribute: "zoom-alt",
      },
    };
  }

  /**
   * life cycle, element is ready
   */
  constructor() {
    super();
    this.heading = "Image Zoom";
    this.details = "";
    this.src = "";
    this.tooltip = "Zoom In";
    this.zoomAlt = "Full-sized Image";
  }

  get figures() {
    return [
      {
        src: this.src,
        info: html`
          <lrndesign-gallery-details
            id="details"
            ?hidden="${!this.details || !this.zoomAlt}"
            details="${this.details || this.zoomAlt}"
          >
          </lrndesign-gallery-details>
        `,
      },
    ];
  }

  get toolbars() {
    return {
      bottom: {
        id: "bottom",
        type: "toolbar-group",
        contents: [
          "homebutton",
          "zoomgroup",
          "pangroup",
          "fullscreenbutton",
          "kbdbutton",
          "infobutton",
        ],
      },
    };
  }

  get button() {
    return this.shadowRoot && this.shadowRoot.querySelector("#zoombtn")
      ? this.shadowRoot.querySelector("#zoombtn")
      : false;
  }
  get modal() {
    return this.shadowRoot && this.shadowRoot.querySelector("#zoomtpl")
      ? this.shadowRoot.querySelector("#zoomtpl")
      : false;
  }

  /**
   * opens the modal
   */
  zoom() {
    if (this.button && this.modal) {
      this.modal.openModal(this.button);
      let event = new CustomEvent("gallery-zoom", { detail: this });
      this.button.dispatchEvent(event);
    }
  }
}
window.customElements.define(LrndesignGalleryZoom.tag, LrndesignGalleryZoom);
export { LrndesignGalleryZoom };

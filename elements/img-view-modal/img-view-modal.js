/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-modal/simple-modal.js";
import { ImgViewViewer } from "./lib/img-view-viewer.js";
import { ImgPanZoom } from "@haxtheweb/img-pan-zoom/img-pan-zoom.js";
// light and dark defaults, matching img-view-viewer, for when no
// --img-view-modal-* color is set
const MODAL_BG =
  "light-dark(var(--ddd-theme-default-white, white), var(--ddd-theme-default-potentialMidnight, #000321))";
const MODAL_FG =
  "light-dark(var(--ddd-theme-default-black, black), var(--ddd-theme-default-white, white))";
const MODAL_BORDER =
  "light-dark(var(--ddd-theme-default-limestoneLight, #ddd), var(--ddd-theme-default-coalyGray, #262626))";
const MODAL_TOGGLED =
  "light-dark(var(--ddd-theme-default-limestoneMaxLight, #eee), var(--ddd-theme-default-slateGray, #314d64))";
/**
 * `img-view-modal`
 * Combines img-pan-zoom and simple-modal for an easy image zoom solution
 *
### Styling

Custom property | Description | Default
----------------|-------------|----------
`--img-view-modal-width` | sets width of modal | 90%
`--img-view-modal-height` | sets height of modal | 90vh
`--img-view-modal-backgroundColor` | background color | light-dark(--ddd-theme-default-white, --ddd-theme-default-potentialMidnight)
`--img-view-modal-color` | text color | light-dark(--ddd-theme-default-black, --ddd-theme-default-white)
`--img-view-modal-borderColor` | border color | light-dark(--ddd-theme-default-limestoneLight, --ddd-theme-default-coalyGray)
`--img-view-modal-toggled-backgroundColor` | background color of toggled buttons and kbd commands | light-dark(--ddd-theme-default-limestoneMaxLight, --ddd-theme-default-slateGray)
 *
 * @demo demo/index.html
 * @element img-view-modal
 * 
 */
class ImgViewModal extends LitElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "img-view-modal";
  }

  static get properties() {
    return {
      ...ImgViewViewer.properties,
      ...ImgPanZoom.properties,
      /**
       * Heading of the modal the image opens in.
       */
      title: { type: String },
      modal: { type: Object },
    };
  }
  static get styles() {
    return css`
      :host {
        display: block;
        --simple-modal-width: var(--img-view-modal-width, 80vw);
        --simple-modal-height: var(--img-view-modal-height, 80vh);
        --simple-modal-titlebar-height: 40px;
        --simple-modal-titlebar-line-height: 40px;
        --simple-modal-titlebar-padding: 0px 5px 0px 15px;
        --simple-modal-titlebar-background: var(
          --img-view-modal-backgroundColor,
          light-dark(
            var(--ddd-theme-default-white, white),
            var(--ddd-theme-default-potentialMidnight, #000321)
          )
        );
        --simple-modal-header-background: var(
          --img-view-modal-backgroundColor,
          light-dark(
            var(--ddd-theme-default-white, white),
            var(--ddd-theme-default-potentialMidnight, #000321)
          )
        );
        --simple-modal-titlebar-color: var(
          --img-view-modal-color,
          light-dark(
            var(--ddd-theme-default-black, black),
            var(--ddd-theme-default-white, white)
          )
        );
        --simple-modal-header-color: var(
          --img-view-modal-color,
          light-dark(
            var(--ddd-theme-default-black, black),
            var(--ddd-theme-default-white, white)
          )
        );
        --simple-modal-header-padding: 0px;
        --simple-modal-content-padding: 0px;
        --simple-modal-buttons-padding: 0px;
        --img-view-viewer-height: calc(
          var(--simple-modal-height) - var(--simple-modal-titlebar-height)
        );
        --img-view-viewer-backgroundColor: var(
          --img-view-modal-backgroundColor,
          light-dark(
            var(--ddd-theme-default-white, white),
            var(--ddd-theme-default-potentialMidnight, #000321)
          )
        );
        --img-view-viewer-color: var(
          --img-view-modal-color,
          light-dark(
            var(--ddd-theme-default-black, black),
            var(--ddd-theme-default-white, white)
          )
        );
        --img-view-viewer-borderColor: var(
          --img-view-modal-borderColor,
          light-dark(
            var(--ddd-theme-default-limestoneLight, #ddd),
            var(--ddd-theme-default-coalyGray, #262626)
          )
        );
        --img-view-viewer-toggled-backgroundColor: var(
          --img-view-modal-toggled-backgroundColor,
          light-dark(
            var(--ddd-theme-default-limestoneMaxLight, #eee),
            var(--ddd-theme-default-slateGray, #314d64)
          )
        );
      }
      :host([hidden]) {
        display: none;
      }
    `;
  }
  constructor() {
    super();
    this.modal = globalThis.SimpleModal.requestAvailability();
    this.addEventListener("click", this.modalOpen);
  }

  render() {
    return html` <slot></slot> `;
  }
  _getCssVar(propName) {
    return getComputedStyle(this).getPropertyValue(propName);
  }

  modalOpen() {
    if (!this.disabled) {
      let evt,
        modalStyles = {
          "--simple-modal-width":
            this._getCssVar("--simple-modal-width") || "80vw",
          "--simple-modal-height":
            this._getCssVar("--simple-modal-height") || "80vh",
          "--simple-modal-titlebar-height":
            this._getCssVar("--simple-modal-titlebar-height") || "40px",
          "--simple-modal-titlebar-line-height":
            this._getCssVar("--simple-modal-titlebar-line-height") || "40px",
          "--simple-modal-titlebar-padding":
            this._getCssVar("--simple-modal-titlebar-padding") ||
            "0px 5px 0px 15px",
          "--simple-modal-titlebar-background":
            this._getCssVar("--simple-modal-titlebar-background") || MODAL_BG,
          "--simple-modal-header-background":
            this._getCssVar("--simple-modal-header-background") || MODAL_BG,
          "--simple-modal-titlebar-color":
            this._getCssVar("--simple-modal-titlebar-color") || MODAL_FG,
          "--simple-modal-header-color":
            this._getCssVar("--simple-modal-header-color") || MODAL_FG,
          "--simple-modal-header-padding":
            this._getCssVar("--simple-modal-header-padding") || "0px",
          "--simple-modal-content-padding":
            this._getCssVar("--simple-modal-content-padding") || "0px",
          "--simple-modal-buttons-padding":
            this._getCssVar("--simple-modal-buttons-padding") || "0px",
        },
        imgStyles = {
          "--img-view-viewer-backgroundColor":
            this._getCssVar("--img-view-viewer-backgroundColor") || MODAL_BG,
          "--img-view-viewer-height":
            "calc(var(--simple-modal-height) - var(--simple-modal-titlebar-height))",
          "--img-view-viewer-color":
            this._getCssVar("--img-view-viewer-color") || MODAL_FG,
          "--img-view-viewer-borderColor":
            this._getCssVar("--img-view-viewer-borderColor") || MODAL_BORDER,
          "--img-view-viewer-toggled-backgroundColor":
            this._getCssVar("--img-view-viewer-toggled-backgroundColor") ||
            MODAL_TOGGLED,
        },
        img = globalThis.document.createElement("img-view-viewer"),
        props = [
          ...Object.keys(ImgViewViewer.properties || {}),
          ...Object.keys(ImgPanZoom.properties || {}),
        ];
      props.forEach((prop) => {
        if (this[prop]) img[prop] = this[prop];
      });
      Object.keys(imgStyles || {}).forEach((key) =>
        img.style.setProperty(key, imgStyles[key]),
      );

      this.dispatchEvent(
        new CustomEvent("modal-button-click", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this,
        }),
      );

      evt = new CustomEvent("simple-modal-show", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: {
          title: this.title || false,
          elements: {
            content: img,
          },
          // merge the dynamic modal styles with the hardcoded layout intent
          // so neither silently overwrites the other (duped styles key)
          styles: {
            ...modalStyles,
            "--simple-modal-width":
              modalStyles["--simple-modal-width"] || "80vw",
            "--simple-modal-max-width": "80vw",
            "--simple-modal-z-index": "100000000",
            "--simple-modal-min-height": "80vh",
          },
          invokedBy: this,
          clone: false,
        },
      });
      this.dispatchEvent(evt);
    }
  }
}
globalThis.customElements.define(ImgViewModal.tag, ImgViewModal);
export { ImgViewModal };

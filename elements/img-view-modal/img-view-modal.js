import { LitElement, html, css } from "lit-element";
import "@lrnwebcomponents/simple-modal/simple-modal.js";
import { ImgViewViewer } from "./lib/img-view-viewer.js";
import { ImgPanZoom } from "@lrnwebcomponents/img-pan-zoom/img-pan-zoom.js";
/**
 * `img-view-modal`
 * Combines img-pan-zoom and simple-modal for an easy image zoom solution
 *
### Styling

Custom property | Description | Default
----------------|-------------|----------
`--img-view-modal-width` | sets width of modal | 90%
`--img-view-modal-height` | sets height of modal | 90vh
`--img-view-modal-backgroundColor` | background color | white
`--img-view-modal-color` | text color | black
`--img-view-modal-borderColor` | border color | #ddd
`--img-view-modal-toggled-backgroundColor` | background color of toggled buttons and kbd commands | #eee
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
      title: { type: String },
      modal: { type: Object }
    };
  }
  static get styles() {
    return css`
      :host {
        display: block;
        --simple-modal-width: var(--img-view-modal-width, 90%);
        --simple-modal-height: var(--img-view-modal-height, 90vh);
        --simple-modal-titlebar-height: 40px;
        --simple-modal-titlebar-line-height: 40px;
        --simple-modal-titlebar-height: 40px;
        --simple-modal-titlebar-padding: 0px 5px 0px 15px;
        --simple-modal-titlebar-background: var(
          --img-view-modal-backgroundColor,
          white
        );
        --simple-modal-header-background: var(
          --img-view-modal-backgroundColor,
          white
        );
        --simple-modal-header-color: var(--img-view-modal-color, black);
        --simple-modal-header-padding: 0px;
        --simple-modal-content-padding: 0px;
        --simple-modal-buttons-padding: 0px;
        --img-view-viewer-height: calc(
          var(--simple-modal-height) - var(--simple-modal-titlebar-height)
        );
        --img-view-viewer-backgroundColor: var(
          --img-view-modal-backgroundColor,
          white
        );
        --img-view-viewer-color: var(--img-view-modal-color, black);
        --img-view-viewer-borderColor: var(--img-view-modal-borderColor, #ddd);
        --img-view-viewer-toggled-backgroundColor: var(
          --img-view-modal-toggled-backgroundColor,
          #eee
        );
      }
      :host([hidden]) {
        display: none;
      }
    `;
  }
  constructor() {
    super();
    this.modal = window.SimpleModal.requestAvailability();
    this.addEventListener("click", this.modalOpen);
  }

  render() {
    return html`
      <slot></slot>
    `;
  }
  _getCssVar(propName) {
    return getComputedStyle(this).getPropertyValue(propName);
  }

  modalOpen() {
    let evt,
      modalStyles = {
        "--simple-modal-width":
          this._getCssVar("--simple-modal-width") || "90%",
        "--simple-modal-height":
          this._getCssVar("--simple-modal-height") || "90vh",
        "--simple-modal-titlebar-height":
          this._getCssVar("--simple-modal-titlebar-height") || "40px",
        "--simple-modal-titlebar-line-height":
          this._getCssVar("--simple-modal-titlebar-line-height") || "40px",
        "--simple-modal-titlebar-height":
          this._getCssVar("--simple-modal-titlebar-height") || "40px",
        "--simple-modal-titlebar-padding":
          this._getCssVar("--simple-modal-titlebar-padding") ||
          "0px 5px 0px 15px",
        "--simple-modal-titlebar-background":
          this._getCssVar("--simple-modal-titlebar-background") || "white",
        "--simple-modal-header-background":
          this._getCssVar("--simple-modal-header-background") || "white",
        "--simple-modal-header-color":
          this._getCssVar("--simple-modal-header-color") || "black",
        "--simple-modal-header-padding":
          this._getCssVar("--simple-modal-header-padding") || "0px",
        "--simple-modal-content-padding":
          this._getCssVar("--simple-modal-content-padding") || "0px",
        "--simple-modal-buttons-padding":
          this._getCssVar("--simple-modal-buttons-padding") || "0px"
      },
      imgStyles = {
        "--img-view-viewer-backgroundColor":
          this._getCssVar("i--mg-view-viewer-backgroundColor") || "white",
        "--img-view-viewer-height":
          "calc(var(--simple-modal-height) - var(--simple-modal-titlebar-height))",
        "--img-view-viewer-color":
          this._getCssVar("--img-view-viewer-color") || "black",
        "--img-view-viewer-borderColor":
          this._getCssVar("--img-view-viewer-borderColor") || "#ddd",
        "--img-view-viewer-toggled-backgroundColor":
          this._getCssVar("--img-view-viewer-toggled-backgroundColor") || "#eee"
      },
      img = document.createElement("img-view-viewer"),
      props = [
        ...Object.keys(ImgViewViewer.properties || {}),
        ...Object.keys(ImgPanZoom.properties || {})
      ];
    props.forEach(prop => {
      if (this[prop]) img[prop] = this[prop];
    });
    Object.keys(imgStyles || {}).forEach(key =>
      img.style.setProperty(key, imgStyles[key])
    );
    console.log("modalOpen",this.figures,this.page);

    this.dispatchEvent(
      new CustomEvent("modal-button-click", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );

    evt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      composed: true,
      cancelable: false,
      detail: {
        title: this.title || false,
        elements: {
          content: img
        },
        styles: modalStyles,
        invokedBy: this,
        clone: false
      }
    });
    this.dispatchEvent(evt);
  }
}
window.customElements.define(ImgViewModal.tag, ImgViewModal);
export { ImgViewModal };

import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `image-inspector`
 * @customElement image-inspector
 * `Zoom, Rotate, Mirror, Download, and View image`
 *
 * @demo demo/index.html
 */
class ImageInspector extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          overflow: hidden;
          --image-inspector-background: #dddddd;
        }

        app-toolbar {
          width: 90%;
          background: var(--image-inspector-background);
          margin: 0 auto;
          padding: 0;
          z-index: 1;
          display: flex;
          text-align: center;
          justify-content: space-evenly;
        }

        lrnsys-button {
          display: inline-flex;
        }

        .top {
          top: 128px;
        }
        .showData {
          display: block;
          z-index: 2;
        }
        exif-data {
          margin: 0 auto;
          justify-content: space-evenly;
          position: absolute;
          display: none;
          margin: 0;
          padding: 0;
        }
        exif-data img {
          margin: 0;
          opacity: 0;
          padding: 0;
          height: 500px;
          pointer-events: none;
        }
      `
    ];
  }
  constructor() {
    super();
    this.degrees = 0;
    this.hoverClass = "blue white-text";
    import("@polymer/app-layout/app-layout.js");
    import("@lrnwebcomponents/img-pan-zoom/img-pan-zoom.js");
    import("@lrnwebcomponents/exif-data/exif-data.js");
    import("@lrnwebcomponents/lrnsys-button/lrnsys-button.js");
    import("@polymer/iron-icons/iron-icons.js");
    import("@polymer/iron-icons/image-icons.js");
  }
  render() {
    return html`
      <app-toolbar>
        <lrnsys-button
          alt="Zoom in"
          icon="zoom-in"
          @click="${this.zoomIn}"
          hover-class="${this.hoverClass}"
        ></lrnsys-button>
        <lrnsys-button
          alt="Zoom out"
          icon="zoom-out"
          @click="${this.zoomOut}"
          hover-class="${this.hoverClass}"
        ></lrnsys-button>
        <lrnsys-button
          alt="Rotate right"
          icon="image:rotate-right"
          @click="${this.rotateRight}"
          hover-class="${this.hoverClass}"
        ></lrnsys-button>
        <lrnsys-button
          alt="Rotate left"
          icon="image:rotate-left"
          @click="${this.rotateLeft}"
          hover-class="${this.hoverClass}"
        ></lrnsys-button>
        <lrnsys-button
          alt="Mirror image"
          icon="image:flip"
          @click="${this.mirrorImage}"
          hover-class="${this.hoverClass}"
        ></lrnsys-button>
        <lrnsys-button
          alt="Open in new window"
          icon="launch"
          href="${this.src}"
          target="_blank"
          hover-class="${this.hoverClass}"
        ></lrnsys-button>
        <lrnsys-button
          alt="EXIF Data"
          icon="image:camera-roll"
          @click="${this.exifDataEvent}"
          hover-class="${this.hoverClass}"
        ></lrnsys-button>
        <slot name="toolbar"></slot>
      </app-toolbar>
      <exif-data id="exif" @click=${this.hideData} no-events>
        <img src="${this.src}" />
      </exif-data>
      <img-pan-zoom id="img" src="${this.src}"></img-pan-zoom>
      <slot></slot>
    `;
  }
  exifDataEvent(e) {
    if (this.shadowRoot.querySelector("#exif").classList.contains("showData")) {
      this.shadowRoot.querySelector("#exif").classList.remove("showData");
    } else {
      this.shadowRoot.querySelector("#exif").classList.add("showData");
      this.shadowRoot.querySelector("#exif").updateExif(true);
    }
  }
  hideData(e) {
    this.shadowRoot.querySelector("#exif").classList.remove("showData");
  }

  static get tag() {
    return "image-inspector";
  }

  static get properties() {
    return {
      /**
       * Image rotation
       */
      degrees: {
        type: Number,
        reflect: true
      },
      /**
       * Image source.
       */
      src: {
        type: String
      },
      /**
       * Hover class for button styling
       */
      hoverClass: {
        type: String,
        attribute: "hover-class"
      }
    };
  }
  firstUpdated() {
    this.__img = this.shadowRoot.querySelector("#img");
    this.shadowRoot.querySelector("#exif").alignTarget = this.__img;
    this.shadowRoot.querySelector("#exif").alignTargetTop = "0px";
  }
  /**
   * Rotate the image to the right.
   */
  rotateRight() {
    // spin 90
    this.degrees += 90;
    this.__img.style.transform = "rotate(" + this.degrees + "deg)";
    this.__img.toggleClass("top");
  }

  /**
   * Rotate the image to the left.
   */
  rotateLeft() {
    // go back 90
    this.degrees += -90;
    this.__img.style.transform = "rotate(" + this.degrees + "deg)";
    this.__img.toggleClass("top");
  }

  /**
   * Flip the image.
   */
  mirrorImage() {
    if (this.__img.style.transform === "scaleX(1)") {
      this.__img.style.transform = "scaleX(-1)";
    } else {
      this.__img.style.transform = "scaleX(1)";
    }
  }

  /**
   * Zoom in by calling  downstream function.
   */
  zoomIn() {
    this.__img.zoomIn();
  }

  /**
   * Zoom out by calling downstream function.
   */
  zoomOut() {
    this.__img.zoomOut();
  }
}
window.customElements.define(ImageInspector.tag, ImageInspector);
export { ImageInspector };

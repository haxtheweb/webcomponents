import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/img-pan-zoom/img-pan-zoom.js";
/**
 * `image-inspector`
 * `Zoom, Rotate, Mirror, Download, and View image`
 * @demo demo/index.html
 * @element image-inspector
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
        }

        simple-icon-button-lite {
          display: inline-flex;
          --simple-icon-width: var(--ddd-icon-xs, 32px);
          --simple-icon-height: var(--ddd-icon-xs, 32px);
          margin: 0 var(--ddd-spacing-1, 4px);
          padding: var(--ddd-spacing-1, 4px);
          border-radius: var(--ddd-radius-0, 0);
          background-color: var(--image-inspector-background-color, light-dark(var(--ddd-theme-default-white, #fdfdfd), var(--ddd-theme-default-coalyGray, #262626)));
          color: var(--image-inspector-color, light-dark(var(--ddd-theme-default-coalyGray, #262626), var(--ddd-theme-default-white, #ffffff)));
          transition: var(--ddd-duration-normal, 0.3s) all var(--ddd-timing-ease, ease-in-out);
          cursor: pointer;
        }
        simple-icon-button-lite:hover,
        simple-icon-button-lite:focus,
        simple-icon-button-lite:active {
          background-color: var(
            --image-inspector-background-color-active,
            light-dark(var(--ddd-theme-default-limestoneLight, #e4e5e7), var(--ddd-theme-default-slateGray, #314d64))
          );
        }

        img-pan-zoom.top-rotated {
          top: var(--ddd-spacing-30, 150px);
          pointer-events: none; /** disable pointer events when rotated bc of HTML canvas issue */
          height: var(--image-inspector-height-rotated, 600px);
        }
        img-pan-zoom {
          --img-pan-zoom-height: var(--image-inspector-height, 600px);
        }
        .wrap {
          justify-content: center;
          display: flex;
        }
        .internal-btn-wrap {
          border: var(--ddd-border-md, 2px) solid var(--image-inspector-border-color, light-dark(var(--ddd-theme-default-coalyGray, #262626), var(--ddd-theme-default-white, #ffffff)));
          background-color: var(--image-inspector-background-color, light-dark(var(--ddd-theme-default-white, #fdfdfd), var(--ddd-theme-default-coalyGray, #262626)));
        }
      `,
    ];
  }
  constructor() {
    super();
    this.noLeft = false;
    this.degrees = 0;
    this.src = "";
  }
  render() {
    return html`
      <div class="wrap">
        <div class="internal-btn-wrap">
          <simple-icon-button-lite
            label="Zoom in"
            icon="zoom-in"
            @click="${this.zoomIn}"
          ></simple-icon-button-lite>
          <simple-icon-button-lite
            label="Zoom out"
            icon="zoom-out"
            @click="${this.zoomOut}"
          ></simple-icon-button-lite>
          <simple-icon-button-lite
            label="Rotate right"
            icon="image:rotate-right"
            @click="${this.rotateRight}"
          ></simple-icon-button-lite>
          <simple-icon-button-lite
            label="Mirror image"
            icon="image:flip"
            @click="${this.mirrorImage}"
          ></simple-icon-button-lite>
          <a
            href="${this.src}"
            target="_blank"
            rel="noopener noreferrer"
            tabindex="-1"
          >
            <simple-icon-button-lite
              label="Open in new window"
              icon="launch"
            ></simple-icon-button-lite>
          </a>
          <slot name="toolbar"></slot>
        </div>
      </div>
      <img-pan-zoom id="img" src="${this.src}"></img-pan-zoom>
      <slot></slot>
    `;
  }

  static get tag() {
    return "image-inspector";
  }

  static get properties() {
    return {
      noLeft: {
        type: Boolean,
        attribute: "no-left",
      },
      /**
       * Image rotation
       */
      degrees: {
        type: Number,
        reflect: true,
      },
      /**
       * Image source.
       */
      src: {
        type: String,
      },
      /**
       * Hover class for button styling
       */
      hoverClass: {
        type: String,
        attribute: "hover-class",
      },
    };
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.__img = this.shadowRoot.querySelector("#img");
  }
  /**
   * Rotate the image to the right.
   */
  rotateRight() {
    // spin 90
    this.degrees += 90;
    this.__img.style.transform = "rotate(" + this.degrees + "deg)";
    if (this.__img.classList.contains("top-rotated")) {
      this.__img.classList.remove("top-rotated");
    } else {
      this.__img.classList.add("top-rotated");
    }
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
globalThis.customElements.define(ImageInspector.tag, ImageInspector);
export { ImageInspector };

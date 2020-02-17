import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
/**
 * `img-pan-zoom` Image pan zoom element
 * Images are preloaded by `img-loader` and a spinner is shown until loaded
 * Deep Zoom Images are supported
 * ### Credits
 * <a href="https://openseadragon.github.io">openSeadragon</a>
 * @demo demo/index.html
 * @customElement img-pan-zoom
 */
class ImgPanZoom extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          position: relative;
          height: 500px;
        }
        #viewer {
          position: relative;
          height: 100%;
          width: 100%;
        }

        hexagon-loader {
          opacity: 0;
          display: block;
          transition: opacity 700ms;
          position: absolute;
          margin: auto;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          z-index: 1;
          height: 70px;
          width: 70px;
        }
        hexagon-loader[hidden] {
          display: none;
        }
        hexagon-loader[loading] {
          opacity: 1;
        }
      `
    ];
  }
  render() {
    return html`
      <!-- Only preload regular images -->
      ${!this.dzi
        ? html`
            ${this.hideSpinner || this.loaded
              ? ``
              : html`
                  <hexagon-loader
                    ?loading=${this.loading || !this.loaded}
                    item-count="4"
                    size="small"
                  ></hexagon-loader>
                `}
            <img-loader
              loaded="${this.loaded}"
              @loaded-changed="${this.loadedChangedEvent}"
              ?loading="${this.loading}"
              @loading-changed="${this.loadingChangedEvent}"
              src="${this.src}"
            ></img-loader>
          `
        : ""}

      <!-- Openseadragon -->
      <div id="viewer"></div>
    `;
  }

  static get tag() {
    return "img-pan-zoom";
  }

  static get properties() {
    return {
      // Image source
      src: {
        type: String
      },
      // Set to true if you are using a deep zoom image
      dzi: {
        type: Boolean
      },
      // Fade in new items added to the viewer
      fadeIn: {
        type: Boolean,
        attribute: "fade-in"
      },
      // loading
      loading: {
        type: Boolean
      },
      // hides spinner
      hideSpinner: {
        type: Boolean,
        attribute: "hide-spinner"
      },
      // loaded
      loaded: {
        type: Boolean
      },
      // Set to false to prevent the appearance of the default navigation controls. Note that if set to false, the customs buttons set by the options zoomInButton, zoomOutButton etc, are rendered inactive.
      showNavigationControl: {
        type: Boolean,
        attribute: "show-navigation-control"
      },
      // Set to true to make the navigator minimap appear.
      showNavigator: {
        type: Boolean,
        attribute: "show-navigator"
      },
      // The "zoom distance" per mouse click or touch tap. Note: Setting this to 1.0 effectively disables the click-to-zoom feature (also see gestureSettings[Mouse|Touch|Pen].clickToZoom/dblClickToZoom).
      zoomPerClick: {
        type: Number,
        attribute: "zoom-per-click"
      },
      // The "zoom distance" per mouse scroll or touch pinch. Note: Setting this to 1.0 effectively disables the mouse-wheel zoom feature (also see gestureSettings[Mouse|Touch|Pen].scrollToZoom}).
      zoomPerScroll: {
        type: Number,
        attribute: "zoom-per-scroll"
      },
      // Specifies the animation duration per each OpenSeadragon.Spring which occur when the image is dragged or zoomed.
      animationTime: {
        type: Number,
        attribute: "animation-time"
      },
      // If true then the 'previous' button will wrap to the last image when viewing the first image and the 'next' button will wrap to the first image when viewing the last image.
      navPrevNextWrap: {
        type: Boolean,
        attribute: "nav-prev-next-wrap"
      },
      // If true then the rotate left/right controls will be displayed as part of the standard controls. This is also subject to the browser support for rotate (e.g. viewer.drawer.canRotate()).
      showRotationControl: {
        type: Boolean,
        attribute: "show-rotation-control"
      },
      // The minimum percentage ( expressed as a number between 0 and 1 ) of the viewport height or width at which the zoom out will be constrained. Setting it to 0, for example will allow you to zoom out infinity.
      minZoomImageRatio: {
        type: Number,
        attribute: "min-zoom-image-ratio"
      },
      // The maximum ratio to allow a zoom-in to affect the highest level pixel ratio. This can be set to Infinity to allow 'infinite' zooming into the image though it is less effective visually if the HTML5 Canvas is not availble on the viewing device.
      maxZoomPixelRatio: {
        type: Number,
        attribute: "max-zoom-pixel-ratio"
      },
      // Constrain during pan
      constrainDuringPan: {
        type: Boolean,
        attribute: "constrain-during-pan"
      },
      // The percentage ( as a number from 0 to 1 ) of the source image which must be kept within the viewport. If the image is dragged beyond that limit, it will 'bounce' back until the minimum visibility ratio is achieved. Setting this to 0 and wrapHorizontal ( or wrapVertical ) to true will provide the effect of an infinitely scrolling viewport.
      visibilityRatio: {
        type: Number,
        attribute: "visibility-ratio"
      }
    };
  }
  // simple path from a url modifier
  pathFromUrl(url) {
    return url.substring(0, url.lastIndexOf("/") + 1);
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.loading = false;
    this.dzi = false;
    this.fadeIn = true;
    this.hideSpinner = false;
    this.showNavigationControl = false;
    this.showNavigator = false;
    this.zoomPerClick = 2.0;
    this.zoomPerScroll = 1.2;
    this.animationTime = 1.2;
    this.navPrevNextWrap = false;
    this.showRotationControl = false;
    this.minZoomImageRatio = 1;
    this.maxZoomPixelRatio = 1.1;
    this.constrainDuringPan = false;
    this.visibilityRatio = 1;
    import("@lrnwebcomponents/hexagon-loader/hexagon-loader.js");
    import("./lib/img-loader.js");
    setTimeout(() => {
      const basePath = this.pathFromUrl(decodeURIComponent(import.meta.url));
      let location = `${basePath}lib/openseadragon/build/openseadragon/openseadragon.min.js`;
      window.addEventListener(
        "es-bridge-openseadragon-loaded",
        this._openseadragonLoaded.bind(this)
      );
      window.ESGlobalBridge.requestAvailability();
      window.ESGlobalBridge.instance.load("openseadragon", location);
    }, 0);
  }
  /**
   * LitElement properties changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "loading") {
        // notify
        this.dispatchEvent(
          new CustomEvent("loading-changed", {
            detail: {
              value: this[propName]
            }
          })
        );
      }
      if (propName == "loaded") {
        this._loadedChanged(this[propName], oldValue);
        // notify
        this.dispatchEvent(
          new CustomEvent("loaded-changed", {
            detail: {
              value: this[propName]
            }
          })
        );
      }
    });
  }
  _openseadragonLoaded() {
    this.__openseadragonLoaded = true;
    if (this.dzi) {
      this._initOpenSeadragon();
    }
  }
  /**
   * life cycle
   */
  connectedCallback() {
    super.connectedCallback();
    this.animationConfig = {
      fade: {
        name: "fade-in-animation",
        node: this.shadowRoot.querySelector("#viewer")
      }
    };
    setTimeout(() => {
      // Init openseadragon if we are using a deep zoom image
      if (this.dzi && this.__openseadragonLoaded) {
        // Add src changed observer
        this._initOpenSeadragon();
      }
    }, 0);
  }
  /**
   * life cycle
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener(
      "es-bridge-openseadragon-loaded",
      this._openseadragonLoaded.bind(this)
    );
  }
  // Init openseadragon
  _initOpenSeadragon() {
    setTimeout(() => {
      var tileSources = this.src;
      if (!this.dzi) {
        tileSources = {
          type: "image",
          url: this.src,
          buildPyramid: false
        };
      }
      this.viewer = new OpenSeadragon({
        element: this.shadowRoot.querySelector("#viewer"),
        visibilityRatio: this.visibilityRatio,
        constrainDuringPan: this.constrainDuringPan,
        showNavigationControl: this.showNavigationControl,
        showNavigator: this.showNavigator,
        zoomPerClick: this.zoomPerClick,
        zoomPerScroll: this.zoomPerScroll,
        animationTime: this.animationTime,
        navPrevNextWrap: this.navPrevNextWrap,
        showRotationControl: this.showRotationControl,
        minZoomImageRatio: this.minZoomImageRatio,
        maxZoomPixelRatio: this.maxZoomPixelRatio,
        tileSources: tileSources
      });
      this.init = true;
    }, 100);
  }

  //Function to destroy the viewer and clean up everything created by OpenSeadragon.
  destroy() {
    this.viewer.destroy();
  }

  // Zoom in
  zoomIn() {
    // TODO: Replace with native openseadragon zoomIn
    var currentZoom = this.viewer.viewport.getZoom();
    var maxZoom = this.viewer.viewport.getMaxZoom();
    var zoomTo = currentZoom + 0.7;
    if (zoomTo < maxZoom) {
      this.viewer.viewport.zoomTo(zoomTo);
    }
  }

  // Zoom out
  zoomOut() {
    // TODO: Replace with openseadragon native zoomOut
    var currentZoom = this.viewer.viewport.getZoom();
    var minZoom = this.viewer.viewport.getMinZoom();
    var zoomTo = currentZoom - 0.7;
    if (zoomTo > minZoom) {
      this.viewer.viewport.zoomTo(zoomTo);
    } else {
      if (minZoom != currentZoom) {
        this.resetZoom();
      }
    }
  }

  // reset zoom
  resetZoom() {
    this.viewer.viewport.goHome();
  }

  _srcChanged() {
    if (this.dzi && this.init) {
      // add tiled image
      this._addTiledImage();
    }
  }
  loadedChangedEvent(e) {
    this.loaded = e.detail.value;
    if (this.loaded) {
      this.loading = false;
    }
  }
  loadingChangedEvent(e) {
    this.loading = e.detail.value;
  }
  // Add loaded images to viewer
  _loadedChanged() {
    if (this.loaded) {
      if (!this.init) {
        this._initOpenSeadragon();
      } else {
        this._addImage();
      }
    }
  }

  _addImage() {
    this.viewer.addSimpleImage({ url: this.src, index: 0, replace: true });
  }

  _addTiledImage() {
    this.viewer.addTiledImage({
      tileSource: this.src,
      index: 0,
      replace: true
    });
  }
}
window.customElements.define(ImgPanZoom.tag, ImgPanZoom);
export { ImgPanZoom };

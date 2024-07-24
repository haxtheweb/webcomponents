import { LitElement, html, css } from "lit";
import "@haxtheweb/es-global-bridge/es-global-bridge.js";
/**
 * `img-pan-zoom` Image pan zoom element
 * Images are preloaded by `img-loader` and a spinner is shown until loaded
 * Deep Zoom Images are supported
 * ### Credits
 * <a href="https://openseadragon.github.io">openSeadragon</a>
 * @demo demo/index.html
 * @element img-pan-zoom
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
          height: var(--img-pan-zoom-height, 500px);
        }
        #viewer {
          position: relative;
          height: 100%;
          width: 100%;
        }
        #loader {
          display: none;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-around;
          width: 100%;
          height: calc(var(--img-pan-zoom-height, 500px) - 100px);
          margin-bottom: calc(100px - var(--img-pan-zoom-height, 500px));
          z-index: 1;
        }
        hexagon-loader {
          position: absolute;
          opacity: 0;
          transition: opacity 700ms;
          margin: auto;
        }
        hexagon-loader[hidden] {
          display: none;
        }
        hexagon-loader[loading] {
          opacity: 1;
        }
      `,
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
                  <div id="loader">
                    <hexagon-loader
                      ?loading=${this.loading || !this.loaded}
                      item-count="4"
                      size="small"
                    ></hexagon-loader>
                  </div>
                `}
            <img-loader
              ?loaded="${this.loaded}"
              @loaded-changed="${this.loadedChangedEvent}"
              ?loading="${this.loading}"
              @loading-changed="${this.loadingChangedEvent}"
              src="${this.src || (this.sources || [])[0]}"
              described-by="${this.describedBy || ""}"
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
      /**
       * image source
       */
      src: {
        type: String,
      },
      /**
       * array of image sources
       */
      sources: {
        type: Array,
      },
      /**
       * if used with multiple images and paged navigation, index of current item
       */
      page: {
        type: Number,
        attribute: "page",
      },
      /**
       * aria-describedby attribute
       */
      describedBy: {
        type: String,
        attribute: "described-by",
      },
      /**
       * Set to true if you are using a deep zoom image
       */
      dzi: {
        type: Boolean,
      },
      /**
       * Fade in new items added to the viewer
       */
      fadeIn: {
        type: Boolean,
        attribute: "fade-in",
      },
      /**
       * whether fullscreen mode is toggled
       */
      fullscreenToggled: {
        type: Boolean,
        attribute: "fullscreen-toggled",
        reflect: true,
      },
      /**
       * whether images is flipped horizontally
       */
      flipToggled: {
        type: Boolean,
        attribute: "flip-toggled",
        reflect: true,
      },
      /**
       * loading
       */
      loading: {
        type: Boolean,
      },
      /**
       * hides spinner
       */
      hideSpinner: {
        type: Boolean,
        attribute: "hide-spinner",
      },
      /**
       * loaded
       */
      loaded: {
        type: Boolean,
      },
      /**
       * Set to false to prevent the appearance of the default
       * navigation controls. Note that if set to false, the customs buttons
       * set by the options zoomInButton, zoomOutButton etc, are rendered inactive.
       */
      showNavigationControl: {
        type: Boolean,
        attribute: "show-navigation-control",
      },
      /**
       * Set to true to make the navigator minimap appear.
       */
      showNavigator: {
        type: Boolean,
        attribute: "show-navigator",
      },
      /**
       * The "zoom distance" per mouse click or touch tap. Note:
       * Setting this to 1.0 effectively disables the click-to-zoom
       * feature (also see gestureSettings[Mouse|Touch|Pen].clickToZoom/dblClickToZoom).
       */
      zoomPerClick: {
        type: Number,
        attribute: "zoom-per-click",
      },
      /**
       * The "zoom distance" per mouse scroll or touch pinch. Note:
       * Setting this to 1.0 effectively disables the mouse-wheel zoom
       * feature (also see gestureSettings[Mouse|Touch|Pen].scrollToZoom}).
       */
      zoomPerScroll: {
        type: Number,
        attribute: "zoom-per-scroll",
      },
      /**
       * Specifies the animation duration per each OpenSeadragon.Spring
       * which occur when the image is dragged or zoomed.
       */
      animationTime: {
        type: Number,
        attribute: "animation-time",
      },
      /**
       * If true then the 'previous' button will wrap to the last image
       * when viewing the first image and the 'next' button will wrap to the
       * first image when viewing the last image.
       */
      navPrevNextWrap: {
        type: Boolean,
        attribute: "nav-prev-next-wrap",
      },
      /**
       * If true then the rotate left/right controls will be displayed as
       * part of the standard controls. This is also subject to the browser
       * support for rotate (e.g. viewer.drawer.canRotate()).
       */
      showRotationControl: {
        type: Boolean,
        attribute: "show-rotation-control",
      },
      /**
       * The minimum percentage ( expressed as a number between 0 and 1 ) of
       * the viewport height or width at which the zoom out will be constrained.
       * Setting it to 0, for example will allow you to zoom out infinity.
       */
      minZoomImageRatio: {
        type: Number,
        attribute: "min-zoom-image-ratio",
      },
      /**
       * The maximum ratio to allow a zoom-in to affect the highest level
       * pixel ratio. This can be set to Infinity to allow 'infinite' zooming
       * into the image though it is less effective visually if the HTML5
       * Canvas is not availble on the viewing device.
       */
      maxZoomPixelRatio: {
        type: Number,
        attribute: "max-zoom-pixel-ratio",
      },
      /**
       * Constrain during pan
       */
      constrainDuringPan: {
        type: Boolean,
        attribute: "constrain-during-pan",
      },
      /**
       * The percentage ( as a number from 0 to 1 ) of the source image
       * which must be kept within the viewport. If the image is dragged
       * beyond that limit, it will 'bounce' back until the minimum
       * visibility ratio is achieved. Setting this to 0 and wrapHorizontal
       * ( or wrapVertical ) to true will provide the effect of an infinitely
       * scrolling viewport.
       */
      visibilityRatio: {
        type: Number,
        attribute: "visibility-ratio",
      },
      /**
       * whether navigator fades when image is not longer being moved
       */
      navigatorAutoFade: {
        type: Boolean,
        attribute: "navigator-auto-fade",
        reflect: true,
      },
      /**
       * where navigator is positioned: "TOP_LEFT", "BOTTOM_RIGHT", "ABSOLUTE", etc. Default is "TOP_RIGHT"
       */
      navigatorPosition: {
        type: String,
        attribute: "navigator-position",
        reflect: true,
      },
      /**
       * if navigator position is "ABSOLUTE", top position for navigator
       */
      navigatorTop: { type: String, attribute: "navigator-top", reflect: true },
      /**
       * if navigator position is "ABSOLUTE", bottom position for navigator
       */
      navigatorBottom: {
        type: String,
        attribute: "navigator-bottom",
        reflect: true,
      },
      /**
       * if navigator position is "ABSOLUTE", left position for navigator
       */
      navigatorLeft: {
        type: String,
        attribute: "navigator-left",
        reflect: true,
      },
      /**
       * if navigator position is "ABSOLUTE", right position for navigator
       */
      navigatorRight: {
        type: String,
        attribute: "navigator-right",
        reflect: true,
      },
      /**
       * height of navigator
       */
      navigatorHeight: {
        type: String,
        attribute: "navigator-height",
        reflect: true,
      },
      /**
       * width of navigator
       */
      navigatorWidth: {
        type: String,
        attribute: "navigator-width",
        reflect: true,
      },
      /**
       * whether navigator window mode is toggled
       */
      navigatorToggled: {
        type: Boolean,
        attribute: "navigator-toggled",
        reflect: true,
      },
      /**
       * displays multiple images as a sequence
       */
      sequenceMode: { type: Boolean, attribute: "sequence-mode" },
      /**
       * preserves viewport when navigating images in sequence mode
       * See https://openseadragon.github.io/examples/tilesource-sequence/
       */
      preserveViewport: { type: Boolean, attribute: "preserve-viewport" },
      /**
       * show reference strip for images in sequence mode.
       * See https://openseadragon.github.io/examples/ui-reference-strip/
       */
      showReferenceStrip: { type: Boolean, attribute: "show-reference-strip" },
      /**
       * orientation of images using reference strip; can be 'horizontal' or 'vertical' (default)
       */
      referenceStripScroll: {
        type: String,
        attribute: "reference-strip-scroll",
      },
      /**
       * id of custom previousButton
       */
      previousButton: { type: String },
      /**
       * id of custom nextButton
       */
      nextButton: { type: String },
      /**
       * id of custom homeButton
       */
      homeButton: { type: String },
      /**
       * id of custom zoomInButton
       */
      zoomInButton: { type: String },
      /**
       * id of custom zoomInButton
       */
      zoomOutButton: { type: String },
      /**
       * id of custom zoomInButton
       */
      fullScreenButton: { type: String },
    };
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.windowControllers = new AbortController();
    this.page = 0;
    this.loading = false;
    this.dzi = false;
    this.fadeIn = true;
    this.hideSpinner = false;
    this.fullscreenToggled = false;
    this.flipToggled = false;
    this.showNavigationControl = false;
    this.showNavigator = false;
    this.navigatorAutoFade = false;
    this.navigatorPosition = false;
    this.navigatorToggled = false;
    this.zoomPerClick = 2.0;
    this.zoomPerScroll = 1.2;
    this.animationTime = 1.2;
    this.navPrevNextWrap = false;
    this.showRotationControl = false;
    this.minZoomImageRatio = 1;
    this.maxZoomPixelRatio = 1.1;
    this.constrainDuringPan = false;
    this.visibilityRatio = 1;
    this.sequenceMode = false;
    this.preserveViewport = false;
    this.showReferenceStrip = false;
    this.referenceStripScroll = "horizontal";

    const basePath = new URL("./img-pan-zoom.js", import.meta.url).href.replace(
      "/img-pan-zoom.js",
      "/",
    );
    let location = `${basePath}lib/openseadragon/openseadragon.min.js`;
    globalThis.addEventListener(
      "es-bridge-openseadragon-loaded",
      this._openseadragonLoaded.bind(this),
      { signal: this.windowControllers.signal },
    );

    globalThis.ESGlobalBridge.requestAvailability().load(
      "openseadragon",
      location,
    );
    import("@haxtheweb/hexagon-loader/hexagon-loader.js");
    import("./lib/img-loader.js");
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
              value: this[propName],
            },
          }),
        );
      }
      if (propName == "loaded") {
        this._loadedChanged(this[propName], oldValue);
        // notify
        this.dispatchEvent(
          new CustomEvent("loaded-changed", {
            detail: {
              value: this[propName],
            },
          }),
        );
      }
      if (propName == "navigatorToggled" && this.viewer)
        this.viewer.navigator.element.style.display = this.navigatorToggled
          ? "inline-block"
          : "none";
      if (propName == "fullscreenToggled") this._setFullscreen();
      if (propName == "flipToggled" && this.viewer && this.viewer.viewport)
        this.viewer.viewport.setFlip(this.flipToggled);
      if (propName == "page" && this.viewer)
        this.viewer.goToPage(
          Math.max(
            0,
            Math.min(this.page, (this.viewer.tileSources || []).length - 1),
          ),
        );
    });
  }
  _openseadragonLoaded() {
    try {
      if (globalThis.OpenSeadragon) {
        this._initOpenSeadragon();
      } else {
        let check = () => {
            if (globalThis.OpenSeadragon) {
              this._initOpenSeadragon();
              clearInterval(interval);
            }
          },
          interval = setInterval(check, 1);
      }
    } catch (e) {
      console.warn(e);
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
        node: this.shadowRoot.querySelector("#viewer"),
      },
    };
    setTimeout(() => {
      // Init openseadragon if we are using a deep zoom image
      if (this.dzi) this._openseadragonLoaded();
    }, 0);
  }
  /**
   * life cycle
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.windowControllers.abort();
  }
  // Init openseadragon
  _initOpenSeadragon() {
    setTimeout(() => {
      var tileSources = [this.src].filter((src) => !!src);
      if (!this.dzi) {
        tileSources = tileSources.map((src) => {
          return {
            type: "image",
            url: src,
            buildPyramid: false,
          };
        });
      }
      if (!this.viewer)
        this.viewer = new OpenSeadragon({
          element: this.shadowRoot.querySelector("#viewer"),
          prefixUrl: `${
            new URL("./img-pan-zoom.js", import.meta.url).href
          }/../lib/openseadragon/images/`,
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
          showNavigationControl: this.showNavigationControl,
          navigatorAutoFade: this.navigatorAutoFade,
          navigatorPosition: this.navigatorPosition,
          navigatorLeft: this.navigatorLeft,
          navigatorTop: this.navigatorTop,
          navigatorRight: this.navigatorRight,
          navigatorBottom: this.navigatorBottom,
          navigatorWidth: this.navigatorWidth,
          navigatorHeight: this.navigatorHeight,
          sequenceMode: this.sequenceMode,
          preserveViewport: this.preserveViewport,
          showReferenceStrip: this.showReferenceStrip,
          referenceStripScroll: this.referenceStripScroll,
          flipped: this.flipToggled,
          previousButton: this.previousButton,
          nextButton: this.nextButton,
          homeButton: this.homeButton,
          fullScreenButton: this.fullScreenButton,
          zoomInButton: this.zoomInButton,
          zoomOutButton: this.zoomOutButton,
          tileSources: tileSources,
        });
      if (this.viewer) {
        this.viewer.goToPage(0);
        this._setFullscreen();
        if (this.viewer.navigator) {
          if (this.viewer.navigator.element)
            this.viewer.navigator.element.style.display = this.navigatorToggled
              ? "inline-block"
              : "none";
        }
      }
      /**
       * @event fires on zoom
       */
      this.viewer.addHandler("zoom", (e) =>
        this.dispatchEvent(
          new CustomEvent("zoom", {
            detail: {
              value: e,
            },
          }),
        ),
      );
      /**
       * @event fires on page
       */
      this.viewer.addHandler("page", (e) =>
        this.dispatchEvent(
          new CustomEvent("page", {
            detail: {
              value: e,
            },
          }),
        ),
      );
      /**
       * @event fires on pan
       */
      this.viewer.addHandler("pan", (e) =>
        this.dispatchEvent(
          new CustomEvent("pan", {
            detail: {
              value: e,
            },
          }),
        ),
      );
      /**
       * @event fires on rotate
       */
      this.viewer.addHandler("rotate", (e) =>
        this.dispatchEvent(
          new CustomEvent("pan", {
            detail: {
              value: e,
            },
          }),
        ),
      );
      /**
       * @event
       */
      this.viewer.addHandler("update-viewport", (e) =>
        this.dispatchEvent(
          new CustomEvent("update-viewport", {
            detail: {
              value: e,
            },
          }),
        ),
      );
      /**
       * @event fires before viewport changes
       */
      this.viewer.addHandler("viewport-changed", (e) =>
        this.dispatchEvent(
          new CustomEvent("viewport-changed", {
            detail: {
              value: e,
            },
          }),
        ),
      );
      this.init = true;
    }, 100);
  }

  /**
   * actually sets the fullscreen using API; can be overridden
   *
   * @param {*} [mode=this.fullscreenToggled]
   * @memberof ImgPanZoom
   */
  _setFullscreen(mode = this.fullscreenToggled) {
    if (this.viewer) this.viewer.setFullScreen(mode);
  }

  //Function to destroy the viewer and clean up everything created by OpenSeadragon.
  destroy() {
    this.viewer.destroy();
  }
  /**
   * sets rotation x degrees
   * @param {number} deg number of degrees
   */
  rotateTo(deg = 90) {
    this.viewer.viewport.setRotation(deg);
  }
  /**
   * rotates x degrees from current rotation
   * @param {number} deg number of degrees
   */
  rotate(deg = 90) {
    this.rotateTo(deg + this.viewer.viewport.getRotation());
  }

  /**
   * pans x,y of viewport size from current position
   * @param {number} fraction of viewport width to pan horizontally
   * @param {number} fraction of viewport height to pan vertically
   */
  pan(dx = 0, dy = 0.2) {
    var home = this.viewer.viewport.getBounds();
    //TODO contranin pan dy = Math.min(home.y, Math.max(0 - home.y, dy));
    this.viewer.viewport.panBy(new OpenSeadragon.Point(dx, dy));
  }

  /**
   * amount to zoom in from current position
   * @param {number}
   */
  zoomIn(z = 0.7) {
    // TODO: Replace with native openseadragon zoomIn
    var currentZoom = this.viewer.viewport.getZoom();
    var maxZoom = this.viewer.viewport.getMaxZoom();
    var zoomTo = currentZoom + z;
    if (zoomTo < maxZoom) {
      this.viewer.viewport.zoomTo(zoomTo);
    }
  }

  /**
   * amount to zoom out from current position
   * @param {number}
   */
  zoomOut(z = 0.7) {
    // TODO: Replace with openseadragon native zoomOut
    var currentZoom = this.viewer.viewport.getZoom();
    var minZoom = this.viewer.viewport.getMinZoom();
    var zoomTo = currentZoom - z;
    if (zoomTo > minZoom) {
      this.viewer.viewport.zoomTo(zoomTo);
    } else {
      if (minZoom != currentZoom) {
        this.resetZoom();
      }
    }
  }
  /**
   * toggles fullscreen mode
   * @param {boolean} mode fullscreen mode
   */
  toggleFullscreen(mode = !this.fullscreenToggled) {
    this.fullscreenToggled = mode;
  }
  /**
   * toggles flip mode
   * @param {boolean} mode fullscreen mode
   */
  toggleFlip(mode = !this.flipToggled) {
    this.flipToggled = mode;
  }

  /**
   * recenters image
   */
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
        setTimeout(() => {
          this._openseadragonLoaded();
        }, 100);
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
      replace: true,
    });
  }
}
customElements.define(ImgPanZoom.tag, ImgPanZoom);
export { ImgPanZoom };

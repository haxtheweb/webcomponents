import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { pathFromUrl } from "@polymer/polymer/lib/utils/resolve-url.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
import "./lib/img-loader.js";
/**
`img-pan-zoom` Image pan zoom element

Images are preloaded by `img-loader` and a spinner is shown until loaded
Deep Zoom Images are supported

### Styling

Custom property | Description | Default
----------------|-------------|----------
`--img-pan-zoom-spinner` | Mixin applied to spinner |
`--img-pan-zoom-spinner-color` | Spinner color | `#2196F3`
`--img-pan-zoom-spinner-width` | Spinner width | `5px`

### Credits

<a href="https://openseadragon.github.io">openSeadragon</a>


@demo demo/index.html
*/
Polymer({
  _template: html`
    <style>
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

      paper-spinner-lite {
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
        --paper-spinner-color: var(--img-pan-zoom-spinner-color, #2196F3);
        --paper-spinner-stroke-width: var(--img-pan-zoom-spinner-width, 5px);
        @apply(--img-pan-zoom-spinner);
      }
      paper-spinner-lite[active] {
        opacity: 1;
      }
    </style>

    <!-- Only preload regular images -->
    <template is="dom-if" if="[[!dzi]]">
      <paper-spinner-lite hidden$="[[hideSpinner]]" active="[[loading]]"></paper-spinner-lite>
      <img-loader loaded="{{loaded}}" loading="{{loading}}" src="[[src]]"></img-loader>
    </template>

    <!-- Openseadragon -->
    <div id="viewer"></div>
`,

  is: "img-pan-zoom",

  properties: {
    // Image source
    src: {
      type: String
    },
    // Set to true if you are using a deep zoom image
    dzi: {
      type: Boolean,
      value: false
    },
    // Fade in new items added to the viewer
    fadeIn: {
      type: Boolean,
      value: true
    },
    // loading
    loading: {
      type: Boolean,
      readonly: true,
      notify: true
    },
    // hides spinner
    hideSpinner: {
      type: Boolean,
      value: false
    },
    // loaded
    loaded: {
      type: Boolean,
      readonly: true,
      notify: true,
      observer: "_loadedChanged"
    },
    // Set to false to prevent the appearance of the default navigation controls. Note that if set to false, the customs buttons set by the options zoomInButton, zoomOutButton etc, are rendered inactive.
    showNavigationControl: {
      type: Boolean,
      value: false
    },
    // Set to true to make the navigator minimap appear.
    showNavigator: {
      type: Boolean,
      value: false
    },
    // The "zoom distance" per mouse click or touch tap. Note: Setting this to 1.0 effectively disables the click-to-zoom feature (also see gestureSettings[Mouse|Touch|Pen].clickToZoom/dblClickToZoom).
    zoomPerClick: {
      type: Number,
      value: 2.0
    },
    // The "zoom distance" per mouse scroll or touch pinch. Note: Setting this to 1.0 effectively disables the mouse-wheel zoom feature (also see gestureSettings[Mouse|Touch|Pen].scrollToZoom}).
    zoomPerScroll: {
      type: Number,
      value: 1.2
    },
    // Specifies the animation duration per each OpenSeadragon.Spring which occur when the image is dragged or zoomed.
    animationTime: {
      type: Number,
      value: 1.2
    },
    // If true then the 'previous' button will wrap to the last image when viewing the first image and the 'next' button will wrap to the first image when viewing the last image.
    navPrevNextWrap: {
      type: Boolean,
      value: false
    },
    // If true then the rotate left/right controls will be displayed as part of the standard controls. This is also subject to the browser support for rotate (e.g. viewer.drawer.canRotate()).
    showRotationControl: {
      type: Boolean,
      value: false
    },
    // The minimum percentage ( expressed as a number between 0 and 1 ) of the viewport height or width at which the zoom out will be constrained. Setting it to 0, for example will allow you to zoom out infinity.
    minZoomImageRatio: {
      type: Number,
      value: 1
    },
    // The maximum ratio to allow a zoom-in to affect the highest level pixel ratio. This can be set to Infinity to allow 'infinite' zooming into the image though it is less effective visually if the HTML5 Canvas is not availble on the viewing device.
    maxZoomPixelRatio: {
      type: Number,
      value: 1.1
    },
    // Constrain during pan
    constrainDuringPan: {
      type: Boolean,
      value: false
    },
    // The percentage ( as a number from 0 to 1 ) of the source image which must be kept within the viewport. If the image is dragged beyond that limit, it will 'bounce' back until the minimum visibility ratio is achieved. Setting this to 0 and wrapHorizontal ( or wrapVertical ) to true will provide the effect of an infinitely scrolling viewport.
    visibilityRatio: {
      type: Number,
      value: 1
    }
  },

  observers: ["_srcChanged(src)"],
  created: function() {
    const name = "openseadragon";
    const basePath = pathFromUrl(import.meta.url);
    const location = `${basePath}../../openseadragon/build/openseadragon/openseadragon.js`;
    window.addEventListener(
      `es-bridge-${name}-loaded`,
      this._openseadragonLoaded.bind(this)
    );
    window.ESGlobalBridge.requestAvailability();
    window.ESGlobalBridge.instance.load(name, location);
  },
  _openseadragonLoaded: function() {
    this.__openseadragonLoaded = true;
    if (this.dzi) {
      this._initOpenSeadragon();
    }
  },
  ready: function() {
    this.animationConfig = {
      fade: {
        name: "fade-in-animation",
        node: this.$.viewer
      }
    };

    // Init openseadragon if we are using a deep zoom image
    if (this.dzi && this.__openseadragonLoaded) {
      // Add src changed observer
      this._initOpenSeadragon();
    }
  },

  // Init openseadragon
  _initOpenSeadragon: function() {
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
        element: this.$.viewer,
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
  },

  //Function to destroy the viewer and clean up everything created by OpenSeadragon.
  destroy: function() {
    this.viewer.destroy();
  },

  // Zoom in
  zoomIn: function() {
    // TODO: Replace with native openseadragon zoomIn
    var currentZoom = this.viewer.viewport.getZoom();
    var maxZoom = this.viewer.viewport.getMaxZoom();
    var zoomTo = currentZoom + 0.7;
    if (zoomTo < maxZoom) {
      this.viewer.viewport.zoomTo(zoomTo);
    }
  },

  // Zoom out
  zoomOut: function() {
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
  },

  // reset zoom
  resetZoom: function() {
    this.viewer.viewport.goHome();
  },

  _srcChanged: function() {
    if (this.dzi && this.init) {
      // add tiled image
      this._addTiledImage();
    }
  },

  // Add loaded images to viewer
  _loadedChanged: function() {
    if (this.loaded) {
      if (!this.init) {
        this._initOpenSeadragon();
      } else {
        this._addImage();
      }
    }
  },

  _addImage: function() {
    this.viewer.addSimpleImage({ url: this.src, index: 0, replace: true });
  },

  _addTiledImage: function() {
    this.viewer.addTiledImage({
      tileSource: this.src,
      index: 0,
      replace: true
    });
  }
});

import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "./lib/img-loader.js";
import "openseadragon/openseadragon.min.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        position: relative;
        height: 500px;
      }
      #viewer{
        position: relative;
        height: 100%;
        width: 100%;
      }

      paper-spinner-lite{
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
      paper-spinner-lite[active]{
        opacity: 1;
      }
      [hidden]{
        display: none;
      }
    </style>

    <!-- Only preload regular images -->
    <template is="dom-if" if="[[!dzi]]">
      <paper-spinner-lite hidden\$="[[hideSpinner]]" active="[[loading]]"></paper-spinner-lite>
      <img-loader loaded="{{loaded}}" loading="{{loading}}" src="[[src]]"></img-loader>
    </template>

    <!-- Openseadragon -->
    <div id="viewer"></div>
`,
  is: "img-pan-zoom",
  properties: {
    src: { type: String },
    dzi: { type: Boolean, value: !1 },
    fadeIn: { type: Boolean, value: !0 },
    loading: { type: Boolean, readonly: !0, notify: !0 },
    hideSpinner: { type: Boolean, value: !1 },
    loaded: {
      type: Boolean,
      readonly: !0,
      notify: !0,
      observer: "_loadedChanged"
    },
    showNavigationControl: { type: Boolean, value: !1 },
    showNavigator: { type: Boolean, value: !1 },
    zoomPerClick: { type: Number, value: 2 },
    zoomPerScroll: { type: Number, value: 1.2 },
    animationTime: { type: Number, value: 1.2 },
    navPrevNextWrap: { type: Boolean, value: !1 },
    showRotationControl: { type: Boolean, value: !1 },
    minZoomImageRatio: { type: Number, value: 1 },
    maxZoomPixelRatio: { type: Number, value: 1.1 },
    constrainDuringPan: { type: Boolean, value: !1 },
    visibilityRatio: { type: Number, value: 1 }
  },
  observers: ["_srcChanged(src)"],
  ready: function() {
    this.animationConfig = {
      fade: { name: "fade-in-animation", node: this.$.viewer }
    };
    if (this.dzi) {
      this._initOpenSeadragon();
    }
  },
  _initOpenSeadragon: function() {
    var tileSources = this.src;
    if (!this.dzi) {
      tileSources = { type: "image", url: this.src, buildPyramid: !1 };
    }
    this.viewer = OpenSeadragon({
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
    this.init = !0;
  },
  destroy: function() {
    this.viewer.destroy();
  },
  zoomIn: function() {
    var currentZoom = this.viewer.viewport.getZoom(),
      maxZoom = this.viewer.viewport.getMaxZoom(),
      zoomTo = currentZoom + 0.7;
    if (zoomTo < maxZoom) {
      this.viewer.viewport.zoomTo(zoomTo);
    }
  },
  zoomOut: function() {
    var currentZoom = this.viewer.viewport.getZoom(),
      minZoom = this.viewer.viewport.getMinZoom(),
      zoomTo = currentZoom - 0.7;
    if (zoomTo > minZoom) {
      this.viewer.viewport.zoomTo(zoomTo);
    } else {
      if (minZoom != currentZoom) {
        this.resetZoom();
      }
    }
  },
  resetZoom: function() {
    this.viewer.viewport.goHome();
  },
  _srcChanged: function() {
    if (this.dzi && this.init) {
      this._addTiledImage();
    }
  },
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
    this.viewer.addSimpleImage({ url: this.src, index: 0, replace: !0 });
  },
  _addTiledImage: function() {
    this.viewer.addTiledImage({ tileSource: this.src, index: 0, replace: !0 });
  }
});

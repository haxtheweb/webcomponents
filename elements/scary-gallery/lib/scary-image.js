import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";

/**
Adapted from PolymerElements/iron-image to simplify the functionality for scary-gallery
and expose naturalWidth and naturalHeight

Original @license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
/**
`scary-image` is an element to be used in `scary-gallery`
adapted from `iron-image`

Usage:

Basically identical to the `<img src="...">` tag:

    <scary-image src="http://lorempixel.com/400/400"></scary-image>

@element scary-image
*/
Polymer({
  _template: html`
    <style>
      :host {
        display: inline-block;
        overflow: hidden;
        position: relative;
      }

      #baseURIAnchor {
        display: none;
      }

      #sizedImgDiv {
        position: absolute;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
        display: block;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      }

      #img {
        display: none;
      }
    </style>

    <a id="baseURIAnchor" href="#"></a>
    <div id="sizedImgDiv" role="img" aria-hidden$="[[_computeImgDivARIAHidden(alt)]]" aria-label$="[[_computeImgDivARIALabel(alt, src)]]"></div>
    <img id="img" on-load="_imgOnLoad" on-error="_imgOnError">
`,

  is: "scary-image",
  properties: {
    /**
     * The URL of an image.
     */
    src: {
      type: String,
      value: ""
    },

    /**
     * A short text alternative for the image.
     */
    alt: {
      type: String,
      value: null
    },

    /**
     * Read-only value that is true when the image is loaded.
     */
    loaded: {
      notify: true,
      readOnly: true,
      type: Boolean,
      value: false
    },

    /**
     * Read-only value that tracks the loading state of the image when the `preload`
     * option is used.
     */
    loading: {
      notify: true,
      readOnly: true,
      type: Boolean,
      value: false
    },

    /**
     * Read-only value that indicates that the last set `src` failed to load.
     */
    error: {
      notify: true,
      readOnly: true,
      type: Boolean,
      value: false
    },

    /**
     * Can be used to set the width of image (e.g. via binding); size may also be
     * set via CSS.
     */
    width: {
      observer: "_widthChanged",
      type: Number,
      value: null
    },

    /**
     * Can be used to set the height of image (e.g. via binding); size may also be
     * set via CSS.
     *
     * @attribute height
     * @type number
     * @default null
     */
    height: {
      observer: "_heightChanged",
      type: Number,
      value: null
    },

    /**
     * Natural width of the loaded image
     */
    naturalWidth: {
      type: Number,
      notify: true,
      computed: "_computeNaturalWidth(loaded)"
    },

    /**
     * Natural height of the loaded image
     */
    naturalHeight: {
      type: Number,
      notify: true,
      computed: "_computeNaturalHeight(loaded)"
    }
  },

  observers: ["_loadStateObserver(src)"],

  created: function() {
    this._resolvedSrc = "";
  },

  _imgOnLoad: function() {
    if (this.$.img.src !== this._resolveSrc(this.src)) {
      return;
    }

    this._setLoading(false);
    this._setLoaded(true);
    this._setError(false);
  },

  _computeNaturalWidth: function(loaded) {
    if (!loaded) {
      return null;
    }
    return this.$.img.naturalWidth;
  },

  _computeNaturalHeight: function(loaded) {
    if (!loaded) {
      return null;
    }
    return this.$.img.naturalHeight;
  },

  _imgOnError: function() {
    if (this.$.img.src !== this._resolveSrc(this.src)) {
      return;
    }

    this.$.img.removeAttribute("src");
    this.$.sizedImgDiv.style.backgroundImage = "";

    this._setLoading(false);
    this._setLoaded(false);
    this._setError(true);
  },

  _computeImgDivARIAHidden: function() {
    return this.alt === "" ? "true" : undefined;
  },

  _computeImgDivARIALabel: function() {
    if (this.alt !== null) {
      return this.alt;
    }

    // that URL x, but '' is the default for src.
    if (this.src === "") {
      return "";
    }

    // NOTE: Use of `URL` was removed here because IE11 doesn't support
    // constructing it. If this ends up being problematic, we should
    // consider reverting and adding the URL polyfill as a dev dependency.
    var resolved = this._resolveSrc(this.src);
    // Remove query parts, get file name.
    return resolved
      .replace(/[?|#].*/g, "")
      .split("/")
      .pop();
  },

  _widthChanged: function() {
    this.style.width = isNaN(this.width) ? this.width : this.width + "px";
  },

  _heightChanged: function() {
    this.style.height = isNaN(this.height) ? this.height : this.height + "px";
  },

  _loadStateObserver: function(src) {
    var newResolvedSrc = this._resolveSrc(src);
    if (newResolvedSrc === this._resolvedSrc) {
      return;
    }
    this._resolvedSrc = newResolvedSrc;

    this.$.img.removeAttribute("src");
    this.$.sizedImgDiv.style.backgroundImage = "";

    if (src === "") {
      this._setLoading(false);
      this._setLoaded(false);
      this._setError(false);
    } else {
      this.$.img.src = this._resolvedSrc;
      this.$.sizedImgDiv.style.backgroundImage =
        'url("' + this._resolvedSrc + '")';

      this._setLoading(true);
      this._setLoaded(false);
      this._setError(false);
    }
  },

  _resolveSrc: function(testSrc) {
    var resolved = this.resolveUrl(testSrc, this.$.baseURIAnchor.href);
    // NOTE: Use of `URL` was removed here because IE11 doesn't support
    // constructing it. If this ends up being problematic, we should
    // consider reverting and adding the URL polyfill as a dev dependency.
    if (resolved[0] === "/") {
      // In IE location.origin might not work
      // https://connect.microsoft.com/IE/feedback/details/1763802/location-origin-is-undefined-in-ie-11-on-windows-10-but-works-on-windows-7
      resolved =
        (location.origin || location.protocol + "//" + location.host) +
        resolved;
    }
    return resolved;
  }
});

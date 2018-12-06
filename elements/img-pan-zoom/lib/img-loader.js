import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";

/*
`img-loader` preloads images

all `img-loader` code comes from <a href="https://github.com/PolymerElements/iron-image/blob/master/iron-image.html">iron image</a>
*/
Polymer({
  _template: html`
    <img id="img" hidden="" src="[[src]]" />
  `,

  is: "img-loader",

  properties: {
    src: {
      observer: "_srcChanged",
      type: String
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
    }
  },

  ready: function() {
    var img = this.$.img;

    img.onload = function() {
      if (this.$.img.src !== this._resolveSrc(this.src)) return;
      this._setLoading(false);
      this._setLoaded(true);
      this._setError(false);
    }.bind(this);

    img.onerror = function() {
      if (this.$.img.src !== this._resolveSrc(this.src)) return;
      this._reset();
      this._setLoading(false);
      this._setLoaded(false);
      this._setError(true);
    }.bind(this);

    this._resolvedSrc = "";
  },

  _srcChanged: function(newSrc, oldSrc) {
    var newResolvedSrc = this._resolveSrc(newSrc);
    if (newResolvedSrc === this._resolvedSrc) return;
    this._resolvedSrc = newResolvedSrc;
    this._reset();
    this._load(newSrc);
  },

  _load: function(src) {
    if (src) {
      this.$.img.src = src;
    } else {
      this.$.img.removeAttribute("src");
    }
    this._setLoading(!!src);
    this._setLoaded(false);
    this._setError(false);
  },

  _reset: function() {
    this.$.img.removeAttribute("src");
    this._setLoading(false);
    this._setLoaded(false);
    this._setError(false);
  },

  _resolveSrc: function(testSrc) {
    var baseURI = /** @type {string} */ (this.ownerDocument.baseURI);
    return new URL(this.resolveUrl(testSrc, baseURI), baseURI).href;
  }
});

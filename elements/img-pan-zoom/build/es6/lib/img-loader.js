import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
Polymer({
  _template: html`
    <img id="img" hidden="" src="[[src]]">
`,
  is: "img-loader",
  properties: {
    src: { observer: "_srcChanged", type: String },
    loaded: { notify: !0, readOnly: !0, type: Boolean, value: !1 },
    loading: { notify: !0, readOnly: !0, type: Boolean, value: !1 },
    error: { notify: !0, readOnly: !0, type: Boolean, value: !1 }
  },
  ready: function() {
    var img = this.$.img;
    img.onload = function() {
      if (this.$.img.src !== this._resolveSrc(this.src)) return;
      this._setLoading(!1);
      this._setLoaded(!0);
      this._setError(!1);
    }.bind(this);
    img.onerror = function() {
      if (this.$.img.src !== this._resolveSrc(this.src)) return;
      this._reset();
      this._setLoading(!1);
      this._setLoaded(!1);
      this._setError(!0);
    }.bind(this);
    this._resolvedSrc = "";
  },
  _srcChanged: function(newSrc) {
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
    this._setLoaded(!1);
    this._setError(!1);
  },
  _reset: function() {
    this.$.img.removeAttribute("src");
    this._setLoading(!1);
    this._setLoaded(!1);
    this._setError(!1);
  },
  _resolveSrc: function(testSrc) {
    var baseURI = this.ownerDocument.baseURI;
    return new URL(this.resolveUrl(testSrc, baseURI), baseURI).href;
  }
});

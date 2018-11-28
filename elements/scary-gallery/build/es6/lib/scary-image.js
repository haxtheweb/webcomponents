import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
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
    src: { type: String, value: "" },
    alt: { type: String, value: null },
    loaded: { notify: !0, readOnly: !0, type: Boolean, value: !1 },
    loading: { notify: !0, readOnly: !0, type: Boolean, value: !1 },
    error: { notify: !0, readOnly: !0, type: Boolean, value: !1 },
    width: { observer: "_widthChanged", type: Number, value: null },
    height: { observer: "_heightChanged", type: Number, value: null },
    naturalWidth: {
      type: Number,
      notify: !0,
      computed: "_computeNaturalWidth(loaded)"
    },
    naturalHeight: {
      type: Number,
      notify: !0,
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
    this._setLoading(!1);
    this._setLoaded(!0);
    this._setError(!1);
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
    this._setLoading(!1);
    this._setLoaded(!1);
    this._setError(!0);
  },
  _computeImgDivARIAHidden: function() {
    return "" === this.alt ? "true" : void 0;
  },
  _computeImgDivARIALabel: function() {
    if (null !== this.alt) {
      return this.alt;
    }
    if ("" === this.src) {
      return "";
    }
    var resolved = this._resolveSrc(this.src);
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
    if ("" === src) {
      this._setLoading(!1);
      this._setLoaded(!1);
      this._setError(!1);
    } else {
      this.$.img.src = this._resolvedSrc;
      this.$.sizedImgDiv.style.backgroundImage =
        'url("' + this._resolvedSrc + '")';
      this._setLoading(!0);
      this._setLoaded(!1);
      this._setError(!1);
    }
  },
  _resolveSrc: function(testSrc) {
    var resolved = this.resolveUrl(testSrc, this.$.baseURIAnchor.href);
    if ("/" === resolved[0]) {
      resolved =
        (location.origin || location.protocol + "//" + location.host) +
        resolved;
    }
    return resolved;
  }
});

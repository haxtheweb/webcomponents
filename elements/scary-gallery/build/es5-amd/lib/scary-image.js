define(["../node_modules/@polymer/polymer/polymer-legacy.js"], function(
  _polymerLegacy
) {
  "use strict";
  function _templateObject_7554c850dea911e8bc921f754805a7b5() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: inline-block;\n        overflow: hidden;\n        position: relative;\n      }\n\n      #baseURIAnchor {\n        display: none;\n      }\n\n      #sizedImgDiv {\n        position: absolute;\n        top: 0px;\n        right: 0px;\n        bottom: 0px;\n        left: 0px;\n        display: block;\n        background-size: cover;\n        background-position: center;\n        background-repeat: no-repeat;\n      }\n\n      #img {\n        display: none;\n      }\n    </style>\n\n    <a id="baseURIAnchor" href="#"></a>\n    <div id="sizedImgDiv" role="img" aria-hidden$="[[_computeImgDivARIAHidden(alt)]]" aria-label$="[[_computeImgDivARIALabel(alt, src)]]"></div>\n    <img id="img" on-load="_imgOnLoad" on-error="_imgOnError">\n'
    ]);
    _templateObject_7554c850dea911e8bc921f754805a7b5 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_7554c850dea911e8bc921f754805a7b5()
    ),
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
    created: function created() {
      this._resolvedSrc = "";
    },
    _imgOnLoad: function _imgOnLoad() {
      if (this.$.img.src !== this._resolveSrc(this.src)) {
        return;
      }
      this._setLoading(!1);
      this._setLoaded(!0);
      this._setError(!1);
    },
    _computeNaturalWidth: function _computeNaturalWidth(loaded) {
      if (!loaded) {
        return null;
      }
      return this.$.img.naturalWidth;
    },
    _computeNaturalHeight: function _computeNaturalHeight(loaded) {
      if (!loaded) {
        return null;
      }
      return this.$.img.naturalHeight;
    },
    _imgOnError: function _imgOnError() {
      if (this.$.img.src !== this._resolveSrc(this.src)) {
        return;
      }
      this.$.img.removeAttribute("src");
      this.$.sizedImgDiv.style.backgroundImage = "";
      this._setLoading(!1);
      this._setLoaded(!1);
      this._setError(!0);
    },
    _computeImgDivARIAHidden: function _computeImgDivARIAHidden() {
      return "" === this.alt ? "true" : void 0;
    },
    _computeImgDivARIALabel: function _computeImgDivARIALabel() {
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
    _widthChanged: function _widthChanged() {
      this.style.width = isNaN(this.width) ? this.width : this.width + "px";
    },
    _heightChanged: function _heightChanged() {
      this.style.height = isNaN(this.height) ? this.height : this.height + "px";
    },
    _loadStateObserver: function _loadStateObserver(src) {
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
    _resolveSrc: function _resolveSrc(testSrc) {
      var resolved = this.resolveUrl(testSrc, this.$.baseURIAnchor.href);
      if ("/" === resolved[0]) {
        resolved =
          (location.origin || location.protocol + "//" + location.host) +
          resolved;
      }
      return resolved;
    }
  });
});

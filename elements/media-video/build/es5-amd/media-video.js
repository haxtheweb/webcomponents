define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js"
], function(_polymerLegacy, _polymerDom) {
  "use strict";
  function _templateObject_116bddd0ecf311e884a17bc0dbf7a515() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <slot></slot>\n"
    ]);
    _templateObject_116bddd0ecf311e884a17bc0dbf7a515 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_116bddd0ecf311e884a17bc0dbf7a515()
    ),
    is: "media-video",
    behaviors: [],
    properties: {},
    ready: function ready() {
      var _this = this,
        videoSrc = this.querySelector("*[data-mediavideo-src]");
      this.addEventListener("click", function(e) {
        e.stopPropagation();
        var target = (0, _polymerDom.dom)(e).localTarget,
          videoContainer = _this.querySelector(".mediavideo"),
          videoPoster = _this.querySelector(".mediavideo-button-container"),
          videoSrc = _this.querySelector("*[data-mediavideo-src]");
        videoPoster.classList.toggle("mediavideo-button-display");
        videoContainer.classList.toggle("mediavideo--is-open");
        if (
          target.classList.contains("poster--image") ||
          target.classList.contains("mediavideo-icon")
        ) {
          setTimeout(function() {
            _this._startIframeVideo(videoSrc);
          }, 500);
        } else {
          _this._stopIframeVideo(videoSrc);
        }
      });
    },
    _startIframeVideo: function _startIframeVideo(video) {
      var videoIframeSrc = video.dataset.mediavideoSrc;
      if (
        0 <= videoIframeSrc.indexOf("youtube") ||
        0 <= videoIframeSrc.indexOf("vimeo")
      ) {
        if (0 <= videoIframeSrc.indexOf("?")) {
          videoIframeSrc += "&autoplay=1";
        } else {
          videoIframeSrc += "?autoplay=1";
        }
      }
      video.setAttribute("src", videoIframeSrc);
    },
    _stopIframeVideo: function _stopIframeVideo(video) {
      video.setAttribute("src", "");
    }
  });
});

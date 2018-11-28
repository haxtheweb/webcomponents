import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
let MediaVideo = Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>
    <slot></slot>
`,
  is: "media-video",
  behaviors: [],
  properties: {},
  ready: function() {
    const videoSrc = this.querySelector("*[data-mediavideo-src]");
    this.addEventListener("click", e => {
      e.stopPropagation();
      const target = dom(e).localTarget,
        videoContainer = this.querySelector(".mediavideo"),
        videoPoster = this.querySelector(".mediavideo-button-container"),
        videoSrc = this.querySelector("*[data-mediavideo-src]");
      videoPoster.classList.toggle("mediavideo-button-display");
      videoContainer.classList.toggle("mediavideo--is-open");
      if (
        target.classList.contains("poster--image") ||
        target.classList.contains("mediavideo-icon")
      ) {
        setTimeout(() => {
          this._startIframeVideo(videoSrc);
        }, 500);
      } else {
        this._stopIframeVideo(videoSrc);
      }
    });
  },
  _startIframeVideo: function(video) {
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
  _stopIframeVideo: function(video) {
    video.setAttribute("src", "");
  }
});
export { MediaVideo };

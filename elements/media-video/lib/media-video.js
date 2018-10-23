import "@polymer/polymer/polymer.js";
Polymer({
  _template: `
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
      const target = Polymer.dom(e).localTarget;
      const videoContainer = this.querySelector(".mediavideo");
      const videoPoster = this.querySelector(".mediavideo-button-container");
      const videoSrc = this.querySelector("*[data-mediavideo-src]");
      videoPoster.classList.toggle("mediavideo-button-display");
      // Add the is-open tag to the base element.
      videoContainer.classList.toggle("mediavideo--is-open");
      if (
        target.classList.contains("poster--image") ||
        target.classList.contains("mediavideo-icon")
      ) {
        // Give the animation enough time to complete.
        setTimeout(() => {
          this._startIframeVideo(videoSrc);
        }, 500);
      } else {
        this._stopIframeVideo(videoSrc);
      }
    });
  },

  _startIframeVideo: function(video) {
    // Start the iframe videos.
    var videoIframeSrc = video.dataset.mediavideoSrc;
    // If it's a youtube or vimeo video then add an autoplay attr on the end
    // of the url.
    if (
      videoIframeSrc.indexOf("youtube") >= 0 ||
      videoIframeSrc.indexOf("vimeo") >= 0
    ) {
      // Find out if we need to fstart the query parameter or add
      // on to an existing one.
      if (videoIframeSrc.indexOf("?") >= 0) {
        videoIframeSrc += "&autoplay=1";
      } else {
        videoIframeSrc += "?autoplay=1";
      }
    }
    // Add it to the source attribute to load the video.
    video.setAttribute("src", videoIframeSrc);
  },

  _stopIframeVideo: function(video) {
    video.setAttribute("src", "");
  }
});

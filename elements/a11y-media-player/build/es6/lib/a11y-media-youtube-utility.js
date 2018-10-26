import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
window.A11yMediaYoutubeUtility = {};
Polymer({ is: "a11y-media-youtube-utility" });
window.A11yMediaYoutubeUtility.instance = null;
window.A11yMediaYoutubeUtility.counter = 0;
window.A11yMediaYoutubeUtility.apiReady = window.YT !== void 0;
window.A11yMediaYoutubeUtility.players = [];
window.A11yMediaYoutubeUtility.requestAvailability = function() {
  if (!window.A11yMediaYoutubeUtility.instance) {
    window.A11yMediaYoutubeUtility.instance = document.createElement(
      "a11y-media-youtube-utility"
    );
    document.body.appendChild(window.A11yMediaYoutubeUtility.instance);
    let api = document.createElement("script");
    api.setAttribute("src", "https://www.youtube.com/iframe_api");
    api.setAttribute("type", "text/javascript");
    document.body.appendChild(api);
    window.onYouTubeIframeAPIReady = function() {
      window.A11yMediaYoutubeUtility.apiReady = !0;
      var event = new CustomEvent("youtube-api-ready");
      document.dispatchEvent(event);
    };
  }
};
window.A11yMediaYoutubeUtility.initYoutubePlayer = function(elem, options) {
  this.counter++;
  let root = this,
    div = document.createElement("div"),
    id = "a11y-media-yt-" + this.counter;
  div.setAttribute("id", id);
  elem.innerHTML = "";
  elem.appendChild(div);
  let iframe = new YT.Player(id, {
    width: options.width,
    height: options.height,
    videoId: options.videoId,
    playerVars: {
      color: "white",
      controls: 0,
      autoplay: options.autoplay,
      disablekb: 1,
      enablejsapi: 1,
      iv_load_policy: 3,
      modestbranding: 1,
      showinfo: 0,
      rel: 0
    }
  });
  iframe.tracks = [];
  iframe.duration = 0;
  iframe.play = function() {
    iframe.playVideo();
  };
  iframe.pause = function() {
    iframe.pauseVideo();
  };
  iframe.seek = function(time) {
    iframe.seekTo(time);
    iframe.pauseVideo();
  };
  iframe.setMute = function(mode) {
    mode ? iframe.mute() : iframe.unMute();
  };
  iframe.seekable = {
    length: 1,
    start: function() {
      return 0;
    },
    end: function() {
      return iframe.duration;
    }
  };
  return iframe;
};

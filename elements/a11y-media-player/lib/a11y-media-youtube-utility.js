import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";

Polymer.A11yMediaYoutubeUtility = Polymer({
  is: "a11y-media-youtube-utility"
});

Polymer.A11yMediaYoutubeUtility.instance = null;

Polymer.A11yMediaYoutubeUtility.counter = 0;

Polymer.A11yMediaYoutubeUtility.apiReady = window.YT !== undefined;

Polymer.A11yMediaYoutubeUtility.players = [];

/**
 * Checks to see if there is an instance available, and if not appends one
 */
Polymer.A11yMediaYoutubeUtility.requestAvailability = function() {
  if (!Polymer.A11yMediaYoutubeUtility.instance) {
    Polymer.A11yMediaYoutubeUtility.instance = document.createElement(
      "a11y-media-youtube-utility"
    );
    document.body.appendChild(Polymer.A11yMediaYoutubeUtility.instance);
    let api = document.createElement("script");
    api.setAttribute("src", "https://www.youtube.com/iframe_api");
    api.setAttribute("type", "text/javascript");
    document.body.appendChild(api);
    window.onYouTubeIframeAPIReady = function() {
      Polymer.A11yMediaYoutubeUtility.apiReady = true;
      var event = new CustomEvent("youtube-api-ready");
      document.dispatchEvent(event);
    };
  }
};

Polymer.A11yMediaYoutubeUtility.initYoutubePlayer = function(
  elem,
  options,
  attached
) {
  this.counter++;
  //get unique id for each youtube iframe
  let root = this,
    div = document.createElement("div"),
    id = "a11y-media-yt-" + this.counter;
  div.setAttribute("id", id);
  elem.innerHTML = "";
  elem.appendChild(div);
  // function to create and init iframe
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

  // add methods and properties to api so that it matches HTML5 video
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
    start: function(index) {
      return 0;
    },
    end: function(index) {
      return iframe.duration;
    }
  };
  // return the iframe so that a11y-media-player can control it
  return iframe;
};

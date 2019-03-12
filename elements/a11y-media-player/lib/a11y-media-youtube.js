/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";

// register globally so we can make sure there is only one
window.A11yMediaYoutube = window.A11yMediaYoutube || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal

window.A11yMediaYoutube.requestAvailability = () => {
  if (!window.A11yMediaYoutube.instance) {
    window.A11yMediaYoutube.instance = document.createElement(
      "a11y-media-youtube"
    );
    document.body.appendChild(window.A11yMediaYoutube.instance);
  }
  return window.A11yMediaYoutube.instance;
};
/**
 * `a11y-media-youtube`
 * `A utility that manages multiple instances of a11y-media-player on a single page.`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 */
class A11yMediaYoutube extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "a11y-media-youtube";
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * whether or not the YouTube API is ready
       */
      apiReady: {
        type: Boolean,
        value: window.YT !== undefined
      },
      /**
       * a counter for creating unique ideas for each YouTube player container
       */
      counter: {
        type: Number,
        value: 0
      }
    };
  }

  /**
   * life cycle, element is afixed to the DOM
   * Makes sure there is a utility ready and listening for elements.
   */
  connectedCallback() {
    super.connectedCallback();
    let root = this,
      api = document.createElement("script");
    api.setAttribute("src", "https://www.youtube.com/iframe_api");
    api.setAttribute("type", "text/javascript");
    document.body.appendChild(api);
    window.onYouTubeIframeAPIReady = () => {
      var event = new CustomEvent("youtube-api-ready");
      root.apiReady = true;
      document.dispatchEvent(event);
    };
  }

  /**
   * initializes the youtube player for a given element
   *
   * @param {options} the YouTube options object, eg. `{ "width": "100%", "height": "100%", "videoId": "NP0mQeLWCCo" }`
   * @returns {options} the YouTube player object
   */
  initYoutubePlayer(options) {
    //get unique id for each youtube iframe
    // function to create and init iframe
    let temp = "a11y-media-yt-",
      div = document.createElement("div"),
      vdata = options.videoId.split(/[\?&]/),
      vid = vdata[0],
      start = null,
      end = null,
      cue = { videoId: vid };
    this.counter++;
    temp += this.counter;
    document.body.appendChild(div);
    div.setAttribute("id", temp);
    let loadVideo = e => {
        for (let i = 1; i < vdata.length; i++) {
          let param = vdata[i].split("=");
          if (param[0] === "t") {
            let hh = param[1].match(/(\d)+h/),
              mm = param[1].match(/(\d)+m/),
              ss = param[1]
                .replace(/\d+h/, "")
                .replace(/\d+m/, "")
                .replace(/s/, "")
                .match(/(\d)+/),
              h = hh !== null && hh.length > 1 ? parseInt(hh[1]) * 360 : 0,
              m = mm !== null && mm.length > 1 ? parseInt(mm[1]) * 60 : 0,
              s = ss !== null && ss.length > 1 ? parseInt(ss[1]) : 0;
            start = parseInt(h + m + s);
          } else if (param[0] === "start") {
            start = parseInt(param[1]);
          } else if (param[0] === "end") {
            end = parseInt(param[1]);
          }
        }
        if (start !== null) {
          start = Math.max(0, start);
          cue.startSeconds = start;
        }
        if (end !== null) {
          end = start !== null ? Math.max(start, end) : Math.max(0, end);
          cue.endSeconds = end;
        }
        e.target.cueVideoById(cue);
      },
      iframe = new YT.Player(temp, {
        width: options.width,
        height: options.height,
        events: { onReady: loadVideo },
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
    iframe.seekable = { length: 0 };
    iframe.duration = 0;
    iframe.paused = true;
    iframe.timeupdate;
    iframe.play = () => {
      if (iframe.playVideo !== undefined) iframe.playVideo();
    };
    iframe.addEventListener("onStateChange", () => {
      iframe.paused = iframe.getPlayerState() !== 1;
      if (iframe.paused) {
        clearInterval(iframe.timeupdate);
      } else {
        iframe.timeupdate = setInterval(() => {
          document.dispatchEvent(
            new CustomEvent("timeupdate", { detail: iframe })
          );
        }, 1);
      }
    });
    iframe.pause = () => {
      if (iframe.pauseVideo !== undefined) iframe.pauseVideo();
    };
    iframe.seek = (time = 0) => {
      if (iframe.seekTo !== undefined) {
        iframe.pause();
        iframe.seekTo(time);
        document.dispatchEvent(
          new CustomEvent("timeupdate", { detail: iframe })
        );
      }
    };
    iframe.setMute = mode => {
      if (iframe.mute !== undefined) mode ? iframe.mute() : iframe.unMute();
    };
    return iframe;
  }
}
window.customElements.define(A11yMediaYoutube.tag, A11yMediaYoutube);
export { A11yMediaYoutube };

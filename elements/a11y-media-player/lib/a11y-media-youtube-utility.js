/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";

// register globally so we can make sure there is only one
window.A11yMediaYoutubeUtility = window.A11yMediaYoutubeUtility || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal

window.A11yMediaYoutubeUtility.requestAvailability = () => {
  if (!window.A11yMediaYoutubeUtility.instance) {
    window.A11yMediaYoutubeUtility.instance = document.createElement(
      "a11y-media-youtube-utility"
    );
    document.body.appendChild(window.A11yMediaYoutubeUtility.instance);
  }
  return window.A11yMediaYoutubeUtility.instance;
};
/**
 * `a11y-media-youtube-utility`
 * `A utility that manages multiple instances of a11y-media-player on a single page.`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 */
class A11yMediaYoutubeUtility extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "a11y-media-youtube-utility";
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      apiReady: {
        type: "Boolean",
        value: window.YT !== undefined
      },
      counter: {
        type: "Number",
        value: 0
      },
      iframes: {
        type: "Object",
        value: {
          content: null,
          push: function(fn) {
            this.content = fn;
          },
          pop: function() {
            this.content.call();
            this.content = null;
          }
        }
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
    window.onYouTubeIframeAPIReady = function() {
      console.log("youtube-api-ready", YT, window.YT !== undefined);
      var event = new CustomEvent("youtube-api-ready");
      root.apiReady = true;
      document.dispatchEvent(event);
    };
  }

  /**
   * initializes the youtube player for a given element
   */
  initYoutubePlayer(options) {
    //get unique id for each youtube iframe
    // function to create and init iframe
    let temp = "a11y-media-yt-",
      div = document.createElement("div");
    this.counter++;
    temp += this.counter;
    document.body.appendChild(div);
    div.setAttribute("id", temp);

    let iframe = new YT.Player(temp, {
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
  }
}
window.customElements.define(
  A11yMediaYoutubeUtility.tag,
  A11yMediaYoutubeUtility
);
export { A11yMediaYoutubeUtility };

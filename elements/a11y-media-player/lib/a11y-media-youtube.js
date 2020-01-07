/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html } from "lit-element/lit-element.js";

/**
 * `a11y-media-youtube`
 * uses YouTubeAPI to create and control an embedded YouTube video.
 * @customElement
 */
class A11yMediaYoutube extends LitElement {
  // properties available to the custom element for data binding

  /**
   * Store the tag name to make it easier to obtain directly.

   */
  static get tag() {
    return "a11y-media-youtube";
  }

  //render function
  render() {
    return html`
      <slot></slot>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      /**
       * a11y-media-youtube unique id
       */
      id: {
        type: String
      },
      /**
       * video loops back to start
       */
      autoplay: {
        type: Boolean
      },
      /**
       * height of the embedded video
       */
      height: {
        type: String
      },
      /**
       * video loops back to start
       */
      loop: {
        type: Boolean
      },
      /**
       * video muted
       */
      muted: {
        type: Boolean
      },
      /**
       * preload settings
       */
      preload: {
        type: String
      },
      /**
       * arrray of tracks
       */
      tracks: {
        type: Array
      },
      /**
       * youTube's unique identifier for the video
       */
      videoId: {
        type: String,
        attribute: "video-id",
        reflect: true
      },
      /**
       * volume between 0 and 100
       */
      volume: {
        type: Number
      },
      /**
       * width of the embedded video
       */
      width: {
        type: String
      },
      /**
       * iframe object
       */
      __iframe: {
        type: Object
      }
    };
  }

  /**
   * life cycle, element is afixed to the DOM
   * Makes sure there is a utility ready and listening for elements.
   */
  constructor() {
    super();
    this.autoplay = false;
    this.height = "100%";
    this.loop = false;
    this.muted = false;
    this.tracks = [];
    this.width = "100%";
    this.__api = null;
    this.__iframe = null;
    this.volume = 7;
  }

  /**
   * returns buffered media
   * @readonly
   * @returns {number} seconds of buffered media
   */
  get buffered() {
    return this.__iframe &&
      this.__iframe.buffered &&
      this.__iframe.buffered.length > 0
      ? this.__iframe.buffered.end(0)
      : -1;
  }

  /**
   * elapsed time of video
   * @readonly
   * @returns {number} time in seconds
   */
  get currentTime() {
    return this.__iframe && this.__iframe.getCurrentTime
      ? this.__iframe.getCurrentTime()
      : undefined;
  }

  /**
   * duration of video
   * @readonly
   * @returns {number} duration in seconds
   */
  get duration() {
    return this.__iframe && this.__iframe.getDuration
      ? this.__iframe.getDuration()
      : 0;
  }

  /**
   * whether video playback is paused
   * @readonly
   * @returns {boolean}
   */
  get paused() {
    return this.__iframe && this.__iframe.getPlayerState
      ? this.__iframe.getPlayerState() !== 1
      : true;
  }

  /**
   * seekable range of video
   * @readonly
   * @returns {object} TimeRanges object
   */
  get seekable() {
    let seekable = { length: 0 };
    if (this.__iframe && this.__iframe.duration && this.__iframe.duration > 0) {
      seekable.length = 1;
      seekable.start = index => this.cue.startSeconds || 0;
      seekable.end = index =>
        this.cue.endSeconds
          ? Math.min(this.cue.endSeconds, this.__iframe.duration)
          : this.__iframe.duration;
    }
    return seekable;
  }

  /**
   * video or video clip
   * @readonly
   * @returns {object} and object with videoId, startSeconds, and stopSeconds
   */
  get cue() {
    let cue = {};
    if (this.videoId) {
      let vdata = this.videoId.split(/[\?&]/);
      cue.videoId = vdata[0];
      cue.startSeconds = 0;
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
          cue.startSeconds = Math.max(0, parseInt(h + m + s));
        } else if (param[0] === "start") {
          cue.startSeconds = Math.max(0, parseInt(param[1]));
        } else if (param[0] === "end") {
          cue.endSeconds = Math.max(cue.startSeconds, parseInt(param[1]));
        }
      }
    }
    return cue;
  }

  /**
   * @param {map} changedProperties the properties that have changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (
        ["id", "autoplay", "height", "width", "videoId", "preload"].includes(
          propName
        )
      )
        this.__iframe = this.newIframe();
      if (propName === "muted") this.setMute(this.muted);
      if (propName === "loop") this.setLoop(this.loop);
      if (propName === "currentTime") this.seek(this.currentTime);
      if (propName === "volume") this.setVolume(this.volume);
    });
  }

  play() {
    if (this.__iframe && this.__iframe.playVideo) this.__iframe.playVideo();
  }

  playbackRate(value) {
    if (this.__iframe && this.__iframe.playVideo)
      this.__iframe.setPlaybackRate(value);
  }

  pause() {
    if (this.__iframe && this.__iframe.pauseVideo) this.__iframe.pauseVideo();
  }

  newIframe() {
    console.log("newIframe", window.YT, this.videoId, this.__api);
    if (window.YT) {
      return this._loadVideo();
    } else if (this.videoId) {
      this._loadApi();
    }
    return null;
  }

  seek(time = 0) {
    let root = this;
    if (this.__iframe && this.__iframe.seekTo) {
      this.__iframe.seekTo(time);
      if (this.paused) {
        let seekupdate = setInterval(() => {
          if (Math.abs(root.__iframe.getCurrentTime() - time) < 1) {
            document.dispatchEvent(
              new CustomEvent("timeupdate", { detail: root })
            );
            clearInterval(seekupdate);
          }
        }, 1);
      }
    }
  }

  setLoop(loop) {
    if (this.__iframe && this.__iframe.setLoop) this.media.setLoop(loop);
  }

  setMute(muted) {
    if (this.__iframe) {
      if (muted && this.__iframe.mute) {
        this.__iframe.mute();
      } else if (this.__iframe.unMute) {
        this.__iframe.unMute();
      }
    }
  }

  setVolume(volume = 7) {
    if (this.__iframe) this.__iframe.setVolume(volume * 10);
  }

  _loadApi() {
    /**
     * Fires when YouTube API is ready
     * @event youtube-api-ready
     */
    window.onYouTubeIframeAPIReady = () => {
      window.dispatchEvent(
        new CustomEvent("youtube-api-ready", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: window.YT
        })
      );
      console.log("youtube-api-ready", this, window);
      if (!this.__iframe) this.__iframe = this.newIframe();
    };

    if (!window.YT) {
      if (!this.__api) {
        let scriptid = "a11y-media-youtube-api",
          ytapi = document.getElementById(scriptid);
        console.log(ytapi);
        if (ytapi) {
          this.__api = ytapi;
        } else {
          this.__api = document.createElement("script");
          this.__api.setAttribute("id", scriptid);
          this.__api.setAttribute("src", "https://www.youtube.com/iframe_api");
          this.__api.setAttribute("type", "text/javascript");
          window.document.body.appendChild(this.__api);
        }
      }
    } else if (!this.__iframe) {
      console.log("youtube-api-ready already", this, window);
      this.__iframe = this.newIframe();
    }
    console.log(
      "_loadApi",
      window.YT,
      this.__api,
      this,
      this.__iframe,
      !this.__iframe
    );
  }

  /**
   * cues video (and optionally preloads) from cue data object {videoId, optional start, optional start}
   *
   * @param {event} e
   */
  _cueVideo(e) {
    let ctr = 0,
      checkDuration;
    e.target.cueVideoById(this.cue);

    if (this.preload !== "none") {
      this.setMute(true);
      this.play();
      checkDuration = setInterval(() => {
        ctr++;
        if (this.duration && this.duration !== 0) {
          this.pause();
          this.setMute(this.muted);
          this._handleTimeupdate();
          clearInterval(checkDuration);
        }
        this.seek(0);
      }, 1);
    }
  }
  _getCaptions(e) {
    console.log(player.getOptions("captions"));
  }

  _removeVideo() {
    if (this.__iframe) {
      this.__iframe.remove;
      this.__iframe.destroy();
    }
    this.innerHTML = "";
  }

  /**
   * Fires as YouTube video time changes
   * @event timeupdate
   */
  _handleTimeupdate() {
    this.dispatchEvent(
      new CustomEvent("timeupdate", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );
  }

  /**
   * initializes the youtube player for a given element
   * See https://developers.google.com/youtube/player_parameters for more information
   *
   * @returns {object} the YouTube player object
   */
  _loadVideo() {
    //get unique id for each youtube iframe
    // function to create and init iframe
    let root = this,
      div = document.createElement("div"),
      divid = `container-${this.id}`,
      iframe = null;
    document.body.appendChild(div);
    div.setAttribute("id", divid);
    this._removeVideo();
    if (this.cue.videoId) {
      let cueVideo = e => root._cueVideo(e),
        getCaptions = e => root._getCaptions(e);
      iframe = new YT.Player(divid, {
        width: root.width,
        height: root.height,
        events: { onReady: cueVideo, onApiChange: getCaptions },
        playerVars: {
          color: "white",
          controls: 0,
          autoplay: root.autoplay,
          disablekb: 1,
          enablejsapi: 1,
          origin: window.location.hostname,
          iv_load_policy: 3,
          modestbranding: 1,
          //todo research playsinline
          rel: 0,
          widget_referrer: window.location.href
        }
      });
      iframe.timeupdate;
      iframe.addEventListener("onStateChange", () => {
        if (root.paused) {
          clearInterval(iframe.timeupdate);
        } else {
          iframe.timeupdate = setInterval(() => root._handleTimeupdate(), 1);
        }
      });
      this.appendChild(iframe.getIframe());
    }
    console.log("_loadVideo", this, iframe, this.cue);
    return iframe;
  }
  disconnectedCallback() {
    this._removeVideo();
    super.disconnectedCallback();
  }
}
window.customElements.define(A11yMediaYoutube.tag, A11yMediaYoutube);
export { A11yMediaYoutube };

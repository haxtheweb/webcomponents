/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";

/**
 * `a11y-media-youtube`
 * uses YouTubeAPI to create and control an embedded YouTube video.
 * @element a11y-media-youtube
 */
class A11yMediaYoutube extends LitElement {
  // properties available to the custom element for data binding

  /**
   * Store the tag name to make it easier to obtain directly.

   */
  static get tag() {
    return "a11y-media-youtube";
  }

  //styles function
  static get styles() {
    return [
      css`
        iframe .ytp-pause-overlay {
          display: none !important;
        }
      `,
    ];
  }

  //render function
  render() {
    return html` <slot></slot> `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      /**
       * a11y-media-youtube unique id
       */
      id: {
        type: String,
      },
      /**
       * video loops back to start
       */
      autoplay: {
        type: Boolean,
      },
      /**
       * height of the embedded video
       */
      height: {
        type: String,
      },
      /**
       * video loops back to start
       */
      loop: {
        type: Boolean,
      },
      /**
       * video muted
       */
      muted: {
        type: Boolean,
      },
      /**
       * preload settings
       */
      preload: {
        type: String,
        attribute: "preload",
        reflect: true,
      },
      /**
       * video playback rate
       */
      playbackRate: {
        type: Number,
      },
      /**
       * youTube's unique identifier for the video
       */
      t: {
        type: Number,
        attribute: "t",
        reflect: true,
      },
      /**
       * youTube's unique identifier for the video
       */
      videoId: {
        type: String,
        attribute: "video-id",
        reflect: true,
      },
      /**
       * volume between 0 and 100
       */
      volume: {
        type: Number,
      },
      /**
       * width of the embedded video
       */
      width: {
        type: String,
      },
      /**
       * video object
       */
      __video: {
        type: Object,
      },
      /**
       * youtube object
       */
      __yt: {
        type: Object,
      },
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
    this.playbackRate = 1;
    this.preload = "metadata";
    this.muted = false;
    this.volume = 0.7;
    this.width = "100%";
    this.__video = null;
    this.__yt = null;
  }
  /**
   * single instance of YouTube iframe script
   * @readonly
   * @returns {object} script tag
   */
  get api() {
    let scriptid = "a11y-media-youtube-api",
      ytapi = window.document.getElementById(scriptid);

    /* only add if script doesn't already exist */
    if (!ytapi) {
      ytapi = document.createElement("script");
      ytapi.setAttribute("id", scriptid);
      ytapi.setAttribute("src", "https://www.youtube.com/iframe_api");
      ytapi.setAttribute("type", "text/javascript");
      window.document.body.appendChild(ytapi);
    }
    return ytapi;
  }

  /**
   * returns buffered media
   * @readonly
   * @returns {number} seconds of buffered media
   */
  get buffered() {
    return this.__yt && this.__yt.buffered && this.__yt.buffered.length > 0
      ? this.__yt.buffered.end(0)
      : -1;
  }

  /**
   * elapsed time of video
   * @readonly
   * @returns {number} time in seconds
   */
  get currentTime() {
    return this.__yt && this.__yt.getCurrentTime
      ? this.__yt.getCurrentTime()
      : undefined;
  }

  /**
   * duration of video
   * @readonly
   * @returns {number} duration in seconds
   */
  get duration() {
    return this.__yt && this.__yt.getDuration ? this.__yt.getDuration() : 0;
  }

  /**
   * whether video playback is paused
   * @readonly
   * @returns {boolean}
   */
  get paused() {
    return this.__yt && this.__yt.getPlayerState
      ? this.__yt.getPlayerState() !== 1
      : true;
  }

  /**
   * seekable range of video
   * @readonly
   * @returns {object} TimeRanges object
   */
  get seekable() {
    let seekable = { length: 0 };
    if (this.duration > 0) {
      seekable.length = 1;
      seekable.start = (index) => 0;
      seekable.end = (index) => this.duration;
    }
    return seekable;
  }

  /**
   * initializes singleton to manage a11y-manager-youtube instances
   */

  init() {
    window.A11yMediaYoutubeManager = window.A11yMediaYoutubeManager || {
      /* gets iframes for all  */
      getIframes: () => {
        window.A11yMediaYoutubeManager.queue.forEach(
          (instance) => (instance.__yt = instance._preloadVideo(true))
        );
        window.A11yMediaYoutubeManager.queue = [];
      },
      queue: [], //array of instances waiting for iframes
    };
    window.A11yMediaYoutubeManager.queue.push(this);
    /* checks for api and either uses it to get iframes or gets it */
    if (window.A11yMediaYoutubeManager.api) {
      if (window.YT) window.A11yMediaYoutubeManager.getIframes();
    } else {
      (window.onYouTubeIframeAPIReady = (e) =>
        window.A11yMediaYoutubeManager.getIframes()),
        (window.A11yMediaYoutubeManager.api = this.api);
    }
  }

  /**
   * @param {map} changedProperties the properties that have changed
   */
  updated(changedProperties) {
    let iframeChanged = false,
      videoChanged = false,
      autoChanged = false;
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "muted") this.setMute(this.muted);
      if (propName === "loop") this.setLoop(this.loop);
      if (propName === "currentTime") this.seek(this.currentTime);
      if (propName === "playbackRate") this.setPlaybackRate(this.playbackRate);
      if (propName === "volume") this.setVolume(this.volume);

      /* reload one batch of changes at a time */
      if (propName === "videoId" && this.videoId && !this.__yt) this.init();
      if (["id", "height", "width", "preload"].includes(propName) && this.__yt)
        iframeChanged = true;

      if (["autoplay", "videoId", "__video"].includes(propName) && this.__video)
        videoChanged = true;

      if (
        ["preload", "t"].includes(propName) &&
        (this.preload === "auto" || this.t)
      )
        autoChanged = true;
    });
    /* reload iframe changes first, video changes will update based on iframe */
    if (iframeChanged) {
      this.__yt = this._preloadVideo(true);
    } else if (videoChanged) {
      this._loadVideo();
      if (autoChanged) this._autoMetadata();
    }
  }
  /**
   * plays video
   */
  play() {
    if (!this.__yt) this.__yt = this._preloadVideo(false);
    if (this.__yt && this.__yt.playVideo) this.__yt.playVideo();
  }

  /**
   * pauses video
   */
  pause() {
    if (this.__yt && this.__yt.pauseVideo) this.__yt.pauseVideo();
  }

  /**
   * seeks video
   * @param {number} time in seconds
   */
  seek(time = 0) {
    let root = this;
    if (this.__yt && this.__yt.seekTo) {
      this.__yt.seekTo(time, true);
    }
  }

  /**
   * sets video looping
   * @param {boolean} whether video should loop after playback finishes
   */
  setLoop(loop) {
    if (this.__yt && this.__yt.setLoop) this.media.setLoop(loop);
  }

  /**
   * mutes or unmutes video
   * @param {boolean} whether the video should be muted
   */
  setMute(muted) {
    if (this.__yt) {
      if (muted && this.__yt.mute) {
        this.__yt.mute();
      } else if (this.__yt.unMute) {
        this.__yt.unMute();
      }
    }
  }

  /**
   * sets playbackRate function
   * @param {number} playback rate X normal speed
   */
  setPlaybackRate(value) {
    if (this.__yt && this.__yt.setPlaybackRate)
      this.__yt.setPlaybackRate(value);
  }

  /**
   * sets video volume
   * @param {number} volume from 1 - 10
   */
  setVolume(volume = 0.7) {
    if (this.__yt) this.__yt.setVolume(volume * 100);
  }
  /**
   * returns time in seconds of a string, such as 00:00:00.0, 0h0m0.0s, or 0hh0mm0.0ss
   * @param {string} time
   * @returns {float} seconds
   */
  _getSeconds(time = 0) {
    let units = time
        .replace(/[hm]{1,2}&?/g, ":0")
        .replace(/[s]{1,2}$/g, "")
        .split(/:/),
      hh = units.length > 2 ? parseInt(units[units.length - 3]) : 0,
      mm = units.length > 1 ? parseInt(units[units.length - 2]) : 0,
      ss = units.length > 0 ? parseFloat(units[units.length - 1]) : 0;
    return hh * 3600 + mm * 60 + ss;
  }

  /**
   * Fires as YouTube video time changes
   * @event timeupdate
   */
  _handleMediaLoaded(e) {
    this.dispatchEvent(
      new CustomEvent("loadedmetadata", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this,
      })
    );
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
        detail: this,
      })
    );
  }

  /**
   * loads metadata by playing a small clip on mute and stopping
   */
  _autoMetadata() {
    let seek = this.t || 0,
      autoplay = this.autoplay;
    this.setMute(true);
    this.__yt.playVideo();
    let timeout = 120000,
      checkDuration = setInterval(() => {
        timeout--;
        //give the video up to 2 minute to attempt preload
        if ((this.duration && this.duration > 0) || timeout <= 0) {
          this.pause();
          this.setMute(this.muted);
          clearInterval(checkDuration);
          this.seek(seek);
          if (autoplay) this.play();
        }
      }, 1);
    this.seek(seek);
  }

  /**
   * loads video (and optionally preloads) from video data object {videoId, optional start timecode, }
   * @param {string} preload mode for preloading: `auto`, `metadata`, `none`
   */
  _loadVideo(preload = this.preload) {
    if (this.videoId) this.__video.cueVideoById({ videoId: this.videoId });
  }

  /**
   * initializes the youtube player for a given element
   * See https://developers.google.com/youtube/player_parameters for more information
   *
   * @returns {object} the YouTube player object
   */
  _preloadVideo(auto = false) {
    let root = this,
      load =
        (!auto || this.preload !== "none") && this.videoId && !this.__video,
      div = document.createElement("div"),
      divid = `container-${this.id}`,
      youtube = null;
    document.body.appendChild(div);
    div.setAttribute("id", divid);

    if (load) {
      let setYT = (e) => (this.__video = e.target),
        port = window.location.port ? `:${window.location.port}` : ``,
        origin = `//${window.location.hostname}${port}`;
      youtube = new YT.Player(divid, {
        width: root.width,
        height: root.height,
        events: { onReady: setYT },
        playerVars: {
          color: "white",
          controls: 0,
          autoplay: root.autoplay,
          disablekb: 1,
          enablejsapi: 1,
          origin: origin,
          iv_load_policy: 3,
          modestbranding: 1,
          //todo research playsinline
          rel: 0,
          widget_referrer: window.location.href,
        },
      });
      youtube.timeupdate;
      youtube.addEventListener("onStateChange", () => {
        if (root.paused) {
          clearInterval(youtube.timeupdate);
        } else {
          youtube.timeupdate = setInterval(() => root._handleTimeupdate(), 1);
        }
      });
      this.appendChild(youtube.getIframe());
      div.remove();
    }
    return youtube;
  }

  /**
   * removes iframe aand resets container
   */
  _removeIframe() {
    if (this.__yt) {
      this.__yt.remove;
      try {
        this.__yt.destroy();
      } catch (e) {
        console.warn(e);
      }
    }
    this.innerHTML = "";
  }

  disconnectedCallback() {
    this._removeIframe();
    super.disconnectedCallback();
  }
}
window.customElements.define(A11yMediaYoutube.tag, A11yMediaYoutube);
export { A11yMediaYoutube };

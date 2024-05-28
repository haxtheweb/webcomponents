/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";

// singleton for youtube frames
globalThis.A11yMediaYoutubeManager = globalThis.A11yMediaYoutubeManager || {
  /* gets iframes for all  */
  getIframes: () => {
    globalThis.A11yMediaYoutubeManager.queue.forEach((instance) => {
      instance.__yt = instance._preloadVideo(true);
    });
    globalThis.A11yMediaYoutubeManager.queue = [];
  },
  queue: [], //array of instances waiting for iframes
};

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
    return html`<slot></slot>`;
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
        attribute: "playback-rate",
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
   * inspired by https://github.com/paulirish/lite-youtube-embed/blob/master/src/lite-yt-embed.js
   */
  static warmConnections() {
    if (A11yMediaYoutube.preconnected) return;

    // The iframe document and most of its subresources come right off youtube.com
    A11yMediaYoutube.addPrefetch(
      "preconnect",
      "https://www.youtube-nocookie.com",
    );
    // The botguard script is fetched off from google.com
    A11yMediaYoutube.addPrefetch("preconnect", "https://www.google.com");

    // Not certain if these ad related domains are in the critical path. Could verify with domain-specific throttling.
    A11yMediaYoutube.addPrefetch(
      "preconnect",
      "https://googleads.g.doubleclick.net",
    );
    A11yMediaYoutube.addPrefetch(
      "preconnect",
      "https://static.doubleclick.net",
    );

    A11yMediaYoutube.preconnected = true;
  }
  /**
   * Add a <link rel={preload | preconnect} ...> to the head
   */
  static addPrefetch(kind, url, as) {
    const linkEl = globalThis.document.createElement("link");
    linkEl.rel = kind;
    linkEl.href = url;
    if (as) {
      linkEl.as = as;
    }
    globalThis.document.head.append(linkEl);
  }
  /**
   * single instance of YouTube iframe script
   * @readonly
   * @returns {object} script tag
   */
  get api() {
    let scriptid = "a11y-media-youtube-api",
      ytapi = globalThis.document.querySelector(`#${scriptid}`);

    /* only add if script doesn't already exist */
    if (!ytapi) {
      ytapi = globalThis.document.createElement("script");
      ytapi.setAttribute("id", scriptid);
      ytapi.setAttribute("src", "https://www.youtube.com/iframe_api");
      ytapi.setAttribute("type", "text/javascript");
      globalThis.document.body.appendChild(ytapi);
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
    globalThis.A11yMediaYoutubeManager.queue.push(this);
    /* checks for api and either uses it to get iframes or gets it */
    if (globalThis.A11yMediaYoutubeManager.api) {
      if (globalThis.YT) globalThis.A11yMediaYoutubeManager.getIframes();
    } else {
      globalThis.onYouTubeIframeAPIReady = (e) => {
        globalThis.A11yMediaYoutubeManager.getIframes();
      };

      globalThis.A11yMediaYoutubeManager.api = this.api;
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
      if (propName === "duration" && this.duration > 0)
        this._handleMediaLoaded();
      if (propName === "loop") this.setLoop(this.loop);
      if (propName === "currentTime") this.seek(this.currentTime);
      if (propName === "playbackRate") this.setPlaybackRate(this.playbackRate);
      if (propName === "volume") this.setVolume(this.volume);

      /* reload one batch of changes at a time */
      if (propName === "videoId" && !!this.videoId && !this.__yt) this.init();
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
    if (
      !!this.__yt &&
      !!this.__yt.playVideo &&
      !!this.__video &&
      !!this.videoId
    ) {
      this.__playQueued = true;
      var yt = this.__yt,
        fn = function () {
          yt.playVideo();
          this.__playQueued = false;
        };
      setTimeout(fn, 1000);
    }
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
    if (this.__yt && this.__yt.setPlaybackRate) {
      this.__yt.setPlaybackRate(Number(value));
    }
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
   * Fires as YouTube after video src is loaded
   * @event mediastatechange
   */
  _handleMediaStateChange(e) {
    this.dispatchEvent(
      new CustomEvent("mediastatechange", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: e,
      }),
    );
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
      }),
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
      }),
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
    if (!!this.videoId) this.__video.cueVideoById({ videoId: this.videoId });
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
      div = globalThis.document.createElement("div"),
      divid = `container-${this.id}`,
      youtube = null;
    globalThis.document.body.appendChild(div);
    div.setAttribute("id", divid);
    if (load) {
      // Warm the connection for the poster image
      A11yMediaYoutube.addPrefetch(
        "preload",
        `https://img.youtube.com/vi/${this.videoId.replace(
          /[\?&].*/,
          "",
        )}/hqdefault.jpg`,
        "image",
      );
      let setYT = (e) => (this.__video = e.target),
        port = globalThis.location.port ? `:${globalThis.location.port}` : ``,
        origin = `${globalThis.location.protocol}//${globalThis.location.hostname}${port}`;
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
          widget_referrer: globalThis.location.href,
        },
      });
      youtube.timeupdate;
      youtube.addEventListener("onStateChange", (e) => {
        if (root.paused) {
          clearInterval(youtube.timeupdate);
        } else {
          youtube.timeupdate = setInterval(() => root._handleTimeupdate(), 1);
        }
        this._handleMediaStateChange(e);
      });
      this.innerHTML = "";
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
  connectedCallback() {
    super.connectedCallback();
    A11yMediaYoutube.warmConnections();
  }
  disconnectedCallback() {
    this._removeIframe();
    super.disconnectedCallback();
  }
}
customElements.define(A11yMediaYoutube.tag, A11yMediaYoutube);
export { A11yMediaYoutube };

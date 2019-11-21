/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { ifDefined } from 'lit-html/directives/if-defined.js';
import "@lrnwebcomponents/anchor-behaviors/anchor-behaviors.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
import { A11yMediaBehaviors } from "./lib/a11y-media-behaviors.js";
import "./lib/a11y-media-state-manager.js";
import "./lib/a11y-media-controls.js";
import "./lib/a11y-media-button.js";
import "./lib/a11y-media-html5.js";
import "./lib/a11y-media-transcript.js";
import "./lib/a11y-media-youtube.js";
/**
 * `a11y-media-player`
 * an accessible video player
 * 
 * @extends A11yMediaBehaviors
 * @extends SimpleColorsPolymer
 * @customElement
 * @demo ./demo/index.html video demo
 * @demo ./demo/audio.html audio demo
 * @demo ./demo/youtube.html YouTube demo
 *
 */
class A11yMediaPlayer extends A11yMediaBehaviors {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  // simple path from a url modifier
  pathFromUrl(url) {
    return url.substring(0, url.lastIndexOf("/") + 1);
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "a11y-media-player";
  }
  
  constructor() {
    super();
    this.audioNoThumb = this._getAudioNoThumb(false,null);
    this.allowConcurrent = false;
    this.darkTranscript = false;
    this.disableFullscreen = false;
    this.disableInteractive = false;
    this.flexLayout = true;
    this.fullscreen = false;
    this.fullscreenButton = false;
    this.hasCaptions = false;
    this.hideElapsedTime = false;
    this.hideTimestamps = false;
    this.hideTranscript = false;
    this.id = null;
    this.media = this.shadowRoot.getElementById("html5");
    this.mediaCaption = this._getMediaCaption(false,"");
    this.mediaLang = "en";
    this.muteUnmute = this._getMuteUnmute(false);
    this.playPause = this._getPlayPause(false);
    this.printCaption = this._getPrintCaption(false,"");
    this.responsiveSize = "xs";
    this.screenfullLoaded = false;
    this.shareLink = this._getShareLink(0);
    this.showCustomCaptions = false;
    this.sources = [];
    this.stackedLayout = false;
    this.sticky = false;
    this.stickyCorner = "top-right";
    this.tracks = [];
    this.__elapsed = null;
    this.__playing = false;
    this.__captionHref = "";
    this.__playerAttached = true;
    this.test = ifDefined(this.crossorigin);
    window.A11yMediaStateManager.requestAvailability();


    import("@polymer/paper-slider/paper-slider.js");
    import("@polymer/iron-icons/iron-icons.js");
    import("@polymer/iron-icons/av-icons.js");
    import("@lrnwebcomponents/a11y-media-player/lib/a11y-media-play-button.js");
    import("@polymer/paper-toast/paper-toast.js");

    const basePath = this.pathFromUrl(decodeURIComponent(import.meta.url));
    const location = `${basePath}lib/screenfull/dist/screenfull.js`;
    window.ESGlobalBridge.requestAvailability();
    window.ESGlobalBridge.instance.load("screenfullLib", location);
    window.addEventListener(
      "es-bridge-screenfullLib-loaded",
      this._onScreenfullLoaded.bind(this)
    );
  }
    
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "__elapsed") this.shareLink = this._getShareLink(this.__elapsed);
      if (propName === "__playing") this.playPause = this._getPlayPause(this.__playing);
      if (propName === "muted") this.muteUnmute = this._getMuteUnmute(this.muted);
      if (propName === "audioOnly" || propName === "thumbnailSrc") this.audioNoThumb = this._getAudioNoThumb(this.audioOnly,this.thumbnailSrc);
      
      if (
        propName === "standAlone" 
        || propName === "hideTranscript"
        || propName === "audioNoThumb"
        || propName === "stackedLayout"
        ) this.flexLayout = !(this.standAlone || this.hideTranscript || this.audioNoThumb || this.stackedLayout);
      
      if (
        propName === "disableFullscreen" 
        || propName === "audioNoThumb"
        || propName === "screenfullLoaded"
        ) this.fullscreenButton = this._getFullscreenButton(this.disableFullscreen,this.audioNoThumb);
    
      if (
        propName === "audioOnly" 
        || propName === "localization"
        || propName === "mediaTitle"
        ) this.mediaCaption = this._getMediaCaption(this.audioOnly,this.mediaTitle);
      
      if (
        propName === "audioOnly" 
        || propName === "localization"
        || propName === "mediaTitle"
        ) this.printCaption = this._getPrintCaption(this.audioOnly,this.mediaTitle);
      
      if (
        propName === "isYoutube" 
        || propName === "audioOnly"
        || propName === "hasCaptions"
        ) this.showCustomCaptions = (this.isYoutube || this.audioOnly) && this.hasCaptions && this.cc;
      
    });
  }

  adoptedCallback(){
    super.adoptedCallback();
    console.log(this,this.parentNode,this.host);

    let root = this,
      aspect = 16 / 9;
    this._addResponsiveUtility();
    if (this.id === null) this.id = "a11y-media-player" + Date.now();
    window.dispatchEvent(new CustomEvent("a11y-player", { detail: this }));
    if (this.isYoutube) this._youTubeRequest();
    if (typeof screenfull === "object") this._onScreenfullLoaded.bind(this);
    this.__playerReady = true;
    this.target = this.shadowRoot.getElementById("transcript");
    this.__status = this._getLocal("loading", "label");
    this.__slider = this.shadowRoot.getElementById("slider");
    this.__slider.min = 0;
    this.__volume = root.muted ? 0 : Math.max(this.volume, 10);
    this.__resumePlaying = false;
    this.__duration = 0;
    this.width = this.width !== null ? this.width : "100%";
    this.style.maxWidth = this.width !== null ? this.width : "100%";
    this._setPlayerHeight(aspect);
    if (this.isYoutube) {
      this._youTubeRequest();
      document.addEventListener("timeupdate", e => {
        if (e.detail === root.media) root._handleTimeUpdate(e);
      });
    } else {
      this.media.media.addEventListener("timeupdate", e => {
        root._handleTimeUpdate(e);
      });
      this._addSourcesAndTracks();
    }
    this.shadowRoot
      .getElementById("transcript")
      .setMedia(this.shadowRoot.getElementById("innerplayer"));
  }

  /**
   * plays the media
   */
  play() {
    if (this.isYoutube && !this.__ytAppended) {
      ytInit();
    } else {
      this.__playing = true;
      this.media.play();
      window.dispatchEvent(new CustomEvent("a11y-player-playing", { detail: this }));
    }
  }

  /**
   * pauses the media
   */
  pause() {
    this.__playing = false;
    this.media.pause();
  }

  /**
   * stops the media
   */
  stop() {
    this.pause();
    this.seek(0);
  }

  /**
   * restarts the media
   */
  restart() {
    this.seek(0);
    this.play();
  }

  /**
   * seeks media backward at a set increment
   *
   * @param {float} the elepsed time, in seconds
   */
  rewind(amt) {
    amt = amt !== undefined ? amt : this.media.duration / 20;
    this.__resumePlaying = this.__playing;
    this.seek(this.media.getCurrentTime() - amt, 0);
    if (this.__resumePlaying) this.play();
    this.__resumePlaying = false;
  }

  /**
   * seeks media forward at a set increment
   *
   * @param {float} the elepsed time, in seconds
   */
  forward(amt) {
    amt = amt !== undefined ? amt : this.media.duration / 20;
    this.__resumePlaying = this.__playing;
    this.seek(this.media.getCurrentTime() + amt);
    if (this.__resumePlaying) this.play();
    this.__resumePlaying = false;
  }

  /**
   * seeks to a specific time
   *
   * @param {float} the time, in seconds, to seek
   */
  seek(time) {
    let seekable =
      this.media !== undefined && this.media !== null
        ? this.media.seekable
        : [];
    if (
      seekable.length > 0 &&
      time >= seekable.start(0) &&
      time <= seekable.end(0)
    ) {
      this.media.seek(time);
    }
  }

  /**
   * selects a specific track by index
   *
   * @param {integer} the index of the track
   */
  selectTrack(index) {
    this.__selectedTrack = index;
    this.shadowRoot.getElementById("html5").selectTrack(index);
  }

  /**
   * set volume of media
   *
   * @param {integer} the volume level from 0-100
   */
  setVolume(value) {
    this.volume = value !== null ? value : 70;
    this.media.setVolume(this.volume);
    this.muted = this.volume === 0;
  }

  /**
   * set speed/playback rate of media
   *
   * @param {float} the playback rate, where 1 = 100%
   */
  setPlaybackRate(value) {
    value = value !== null ? value : 1;
    this.media.setPlaybackRate(value);
  }

  /**
   * toggles captions
   *
   * @param {boolean} Toggle CC on? `true` is on, `false` is off, and `null` toggles based on current state.
   */
  toggleCC(mode) {
    this.cc = mode === undefined ? !this.cc : mode;
    this.shadowRoot.getElementById("html5").setCC(this.cc);
  }

  /**
   * toggles looping
   *
   * @param {boolean} Toggle looping on? `true` is on, `false` is off, and `null` toggles based on current state.
   */
  toggleLoop(mode) {
    if (this.isYoutube) {
    } else {
      this.loop = mode === undefined ? !this.loop : mode;
      this.media.setLoop(this.loop);
    }
  }

  /**
   * toggles mute
   *
   * @param {boolean} Toggle mute on? `true` is on, `false` is off, and `null` toggles based on current state.
   */
  toggleMute(mode) {
    this.muted = mode === undefined ? !this.muted : mode;
    this.__volume = this.muted ? 0 : Math.max(this.volume, 10);
    this.media.setMute(this.muted);
  }

  /**
   * toggles sticky attribute
   *
   * @param {boolean} Toggle sticky mode on? `true` is on, `false` is off, and `null` toggles based on current state.
   */
  toggleSticky(mode) {
    mode = mode === undefined ? !this.sticky : mode;
    this.sticky = mode;
    this.dispatchEvent(new CustomEvent("player-sticky", { detail: this }));
  }

  /**
   * toggles transcript
   *
   * @param {boolean} Toggle transcript on? `true` is on, `false` is off, and `null` toggles based on current state.
   */
  toggleTranscript(mode) {
    mode = mode === undefined ? this.hideTranscript : mode;
    this.hideTranscript = !mode;
    if (
      this.shadowRoot.getElementById("transcript") !== undefined &&
      this.shadowRoot.getElementById("transcript") !== null
    ) {
      this.dispatchEvent(
        new CustomEvent("transcript-toggle", { detail: this })
      );
    }
  }

  /**
   * dynamically adds source and track data
   * from the sources and tracks properties
   * (needed for media-player)
   */
  _appendToPlayer(data, type) {
    if (data !== undefined && data !== null && data !== []) {
      let root = this,
        arr = Array.isArray(data) ? data : JSON.parse(data);
      for (let i = 0; i < arr.length; i++) {
        let el = document.createElement(type);
        if (!this.__captionHref && type === "source")
          this.__captionHref = arr[i].src;
        for (let key in arr[i]) {
          el.setAttribute(key, arr[i][key]);
        }
        root.shadowRoot.getElementById("html5").media.appendChild(el);
      }
    }
  }

  /**
   * sets the height of the player
   * @param {Number} the aspect ratio of the media or its poster thumbnail
   */
  _setPlayerHeight(aspect) {
    this.shadowRoot.getElementById("player").style.height = "unset";
    if (this.audioOnly && this.thumbnailSrc === null && this.height === null) {
      this.shadowRoot.getElementById("player").style.height = "60px";
    } else if (this.height === null) {
      this.shadowRoot.getElementById("player").style.paddingTop =
        100 / aspect + "%";
        this.shadowRoot.getElementById("innerplayer").style.maxWidth =
        "calc(" + aspect * 100 + "vh - " + aspect * 80 + "px)";
    } else {
      this.shadowRoot.getElementById("outerplayer").style.height = this.height;
    }
  }

  /**
   * gets media caption
   *
   * @param {boolean} Is the player set to audio-only?
   * @param {string} the title of the media
   * @returns {string} the media caption
   */
  _getMediaCaption(audioOnly, mediaTitle) {
    let audioLabel = this._getLocal("audio", "label"),
      hasMediaTitle =
        mediaTitle !== undefined && mediaTitle !== null && mediaTitle !== "";
    if (audioOnly && hasMediaTitle) {
      return mediaTitle + " (" + audioLabel + ")";
    } else if (audioOnly) {
      return audioLabel;
    } else if (hasMediaTitle) {
      return mediaTitle;
    } else {
      return null;
    }
  }

  /**
   * set play/pause button
   *
   * @param {boolean} Is the media muted?
   * @param {string} label if button mutes media
   * @param {string} icon if button mutes media
   * @param {string} label if button unmutes media
   * @param {string} icon if button unmutes media
   * @returns {object} an object containing the current state of the play/pause button, eg., `{"label": "mute", "icon": "av:volume-off"}`
   */
  _getMuteUnmute(muted) {
    return muted
      ? {
          label: this._getLocal("unmute", "label"),
          icon: this._getLocal("unmute", "icon"),
          action: "unmute"
        }
      : {
          label: this._getLocal("mute", "label"),
          icon: this._getLocal("mute", "icon"),
          action: "mute"
        };
  }

  /**
   * gets print caption
   *
   * @param {boolean} Is the player set to audio-only?
   * @param {string} the title of the media
   * @returns {string} the media caption when the page is printed
   */
  _getPrintCaption(audioOnly,mediaTitle) {
    let audioLabel = this._getLocal("audio", "label"),
      videoLabel = this._getLocal("video", "label"),
      hasMediaTitle =
        mediaTitle !== undefined && mediaTitle !== null && mediaTitle !== "";
    if (audioOnly && hasMediaTitle) {
      return mediaTitle + " (" + audioLabel + ")";
    } else if (audioOnly) {
      return audioLabel;
    } else if (hasMediaTitle) {
      return mediaTitle + " (" + videoLabel + ")";
    } else {
      return videoLabel;
    }
  }

  /**
   * get thumbanail css based on whether or not the video is playing
   *
   * @param {string} the url for the thumbnail image
   * @returns {string} the string for the style attribute
   */
  _getThumbnailCSS(thumbnailSrc, isYoutube, audioOnly) {
    return thumbnailSrc != null && (isYoutube || audioOnly)
      ? "background-image: url(" + thumbnailSrc + "); background-size: cover;"
      : undefined;
  }

  /**
   * loads a track's cue metadata
   */
  _addSourcesAndTracks() {
    let root = this,
      counter = 0;
    this.audioOnly = this.audioOnly || this.querySelector("audio") !== null;
    this.querySelectorAll("source,track").forEach(node => {
      if (!this.__captionHref && node.tagName === "SOURCE")
      this.__captionHref = node.getAttribute("src");
      this.shadowRoot.getElementById("html5").media.appendChild(node);
    });
    this._appendToPlayer(root.tracks, "track");
    this._appendToPlayer(root.sources, "source");
    this.shadowRoot.getElementById("html5").media.textTracks.onaddtrack = e => {
      root.hasCaptions = true;
      root.hasTranscript = !root.standAlone;
      root._getTrackData(e.track, counter++);
    };
  }

  /**
   * returns true if an attribute is set to a value
   *
   * @param {boolean} Is the media audio only?
   * @param {string} optional: the source URL of the thumbnail image
   * @returns {boolean} Should height of video/thumbnail area be set to 0?
   */
  _getAudioNoThumb(audioOnly, thumbnailSrc) {
    return audioOnly && (thumbnailSrc === null || thumbnailSrc === undefined);
  }

  /**
   * returns whether or not the fullscreen mode should be disabled
   *
   * @param {boolean} Is fullscreen mode set to disabled?
   * @returns {boolean} Should fullscreen disabled?
   */
  _getFullscreenButton(disableFullscreen, audioNoThumb, screenfullLoaded) {
    let root = this;
    if (typeof screenfull === "object") root._onScreenfullLoaded.bind(root);
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) ||
      disableFullscreen ||
      audioNoThumb ||
      !(typeof screenfull === "object")
    ) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * set play/pause button
   *
   * @param {boolean} Is the media playing?
   * @param {string} label if button pauses media
   * @param {string} icon if button pauses media
   * @param {string} label if button plays media
   * @param {string} icon if button plays media
   * @returns {object} an object containing the current state of the play/pause button, eg., `{"label": "Pause", "icon": "av:pause"}`
   */
  _getPlayPause(__playing) {
    return __playing !== false
      ? {
          label: this._getLocal("pause", "label"),
          icon: this._getLocal("pause", "icon"),
          action: "pause"
        }
      : {
          label: this._getLocal("play", "label"),
          icon: this._getLocal("play", "icon"),
          action: "play"
        };
  }
  /**
   * gets the link for sharing the video at a specific timecode
   * @param {boolean} linkable is the video is linkable
   */
  _getShareLink(__elapsed) {
    let url = window.location.href.split(/[#?]/)[0],
      id = this.id ? `?id=${this.id}` : ``,
      elapsed =
        id !== "" && this.__elapsed && this.__elapsed !== 0
          ? `&t=${this.__elapsed}`
          : ``;
    return `${url}${id}${elapsed}`;
  }

  /**
   * loads a track's cue metadata
   */
  _getTrackData(track, id) {
    let root = this,
      selected = track.default === true || this.__selectedTrack === undefined,
      loadCueData;
    if (selected) this.selectTrack(id);
    track.mode = selected && this.cc === true ? "showing" : "hidden";
    loadCueData = setInterval(() => {
      if (
        track.cues !== undefined &&
        track.cues !== null &&
        track.cues.length > 0
      ) {
        clearInterval(loadCueData);
        let cues = Object.keys(track.cues).map(key => {
          return {
            order: track.cues[key].id !== "" ? track.cues[key].id : key,
            seek: track.cues[key].startTime,
            seekEnd: track.cues[key].endTime,
            start: this._getHHMMSS(
              track.cues[key].startTime,
              this.media.duration
            ),
            end: this._getHHMMSS(track.cues[key].endTime, this.media.duration),
            text: track.cues[key].text
          };
        });

        if (this.__tracks === undefined) this.__tracks = [];
        this.push("__tracks", {
          value: id,
          language: track.language,
          text:
            track.label !== undefined
              ? track.label
              : track.language !== undefined
              ? track.language
              : "Track " + id,
          cues: cues
        });
        this.shadowRoot.getElementById("controls").setTracks(this.__tracks);
        this.shadowRoot.getElementById("transcript").setTracks(this.__tracks);
        this.push("__tracks");
        track.oncuechange = e => {
          root.shadowRoot.getElementById("transcript").setActiveCues(
            Object.keys(e.currentTarget.activeCues).map(key => e.currentTarget.activeCues[key].id)
          );
        };
      }
    }, 1);
  }
  /**
   * handles closing the share link toast
   */
  _handleCloseLink() {
    if(this.shadowRoot.getElementById("link") && this.shadowRoot.getElementById("link").close) this.shadowRoot.getElementById("link").close();
    if (this.__resumePlaying) this.play();
    this.__resumePlaying = false;
  }

  /**
   * handles copying the share link
   */
  _handleCopyLink() {
    let el = document.createElement("textarea");
    this.__resumePlaying = this.__playing;
    this.pause;
    el.value = this.shareLink;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    this.shadowRoot.getElementById("link").open();
  }

  /**
   * handles the seek function when a transcript cue is activated
   */
  _handleTranscriptSeek(e) {
    if (
      !this.standAlone &&
      this.shadowRoot.getElementById("transcript") !== undefined &&
      this.shadowRoot.getElementById("transcript") !== null
    ) {
      this.__resumePlaying = this.__playing;
      this.seek(e.detail);
    }
  }

  /**
   * handles media metadata when media is loaded
   */
  _handleMediaLoaded(e) {
    let anchor = window.AnchorBehaviors,
      target = anchor.getTarget(this),
      params = anchor.params,
      aspect = this.media.aspectRatio;
      this._setPlayerHeight(aspect);
      this.shadowRoot.getElementById("playbutton").removeAttribute("disabled");

    // gets and converts video duration
    this._setElapsedTime();
    this._getTrackData(this.shadowRoot.getElementById("html5").media);

    //if this video is part of the page's query string or anchor, seek the video
    if (target === this) this.seek(this._getSeconds(params.t));
  }

  /**
   * determines if there
   *
   * @param {string} the url for the thumbnail image
   * @returns {string} the string for the style attribute
   */
  _hidePlayButton(thumbnailSrc, isYoutube, __elapsed) {
    return (
      (isYoutube && thumbnailSrc === null) ||
      !(__elapsed === undefined || __elapsed === 0)
    );
  }

  /**
   * handles transcript printing
   */
  _handlePrinting(e) {
    this.dispatchEvent(
      new CustomEvent("printing-transcript", { detail: this })
    );
    this.shadowRoot.getElementById("transcript").print(this.mediaTitle);
  }

  /**
   * sets search the simple-search element
   */
  _handleSearchAdded(e) {
    this.search = e.detail;
  }

  /**
   * handles duration slider dragging with a mouse
   */
  _handleSliderStart(e) {
    this.__resumePlaying = !this.paused;
    this.pause();
    this.__seeking = true;
  }

  /**
   * handles duration slider dragging with a mouse
   */
  _handleSliderStop(e) {
    this.seek(this.shadowRoot.getElementById("slider").immediateValue);
    this.__seeking = false;
    if (this.__resumePlaying) {
      this.play();
      this.__resumePlaying = null;
    }
  }

  /**
   * handles time updates
   */
  _handleTimeUpdate(e) {
    //if play exceeds clip length, stop
    if (this.isYoutube && this.media.duration !== this.media.getDuration()) {
      this.__duration = this.media.duration = this.media.getDuration();
      this.disableSeek = false;
      this._addSourcesAndTracks();
      if (
        this.media.seekable &&
        this.media.seekable.length > 0 &&
        this.media.seekable.start(0) !== 0
      ) {
        this.shadowRoot.getElementById("slider").min = this.media.seekable.start(0);
      }
    }
    if (
      this.media.seekable !== undefined &&
      this.media.seekable.length > 0 &&
      this.media.seekable.end(0) <= this.media.getCurrentTime()
    ) {
      this.stop();
      this.__playing = false;
    }
    //prevent slider and cue updates until finished seeking
    this._updateCustomTracks();
    this._setElapsedTime();
  }

  /**
   * handles transcript scroll toggle
   */
  _handleTranscriptScrollToggle(e) {
    this.disableScroll = !this.disableScroll;
  }

  /**
   * Determines if video and transcript are in a flex layout
   *
   * @param {boolean} Is the player in stand-alone mode?
   * @param {boolean} Is the transcript hidden?
   * @param {boolean} Does the media no video or thumbnail image?
   * @param {boolean} Is the layout stacked?
   * @returns {boolean} Is the video in flex layout mode?
   */
  _isFlexLayout(standAlone, hideTranscript, audioNoThumb, stackedLayout) {
    return !standAlone && !hideTranscript && !audioNoThumb && !stackedLayout;
  }

  /**
   * determine which button was clicked and act accordingly
   */
  _onControlsChanged(e) {
    let root = this,
      action = e.detail.action !== undefined ? e.detail.action : e.detail.id;

    if (action === "backward" || action === "rewind") {
      this.rewind();
    } else if (action === "captions") {
      this.toggleCC();
    } else if (action === "transcript" || action === "transcript-toggle") {
      this.toggleTranscript();
    } else if (e.detail.id === "tracks") {
      if (e.detail.value === "") {
        this.toggleCC(false);
      } else {
        this.toggleCC(true);
        this.selectTrack(e.detail.value);
      }
    } else if (action === "forward") {
      this.forward();
    } else if (action === "fullscreen" && this.fullscreenButton) {
      this.toggleTranscript(this.fullscreen);
      screenfull.toggle(this.shadowRoot.getElementById("outerplayer"));
    } else if (action === "loop") {
      this.toggleLoop();
    } else if (action === "mute" || action === "unmute") {
      this.toggleMute();
    } else if (action === "pause") {
      this.pause();
    } else if (action === "play") {
      this.play();
    } else if (action === "restart") {
      this.seek(0);
      this.play();
    } else if (action === "speed") {
      this.setPlaybackRate(e.detail.value);
    } else if (action === "volume") {
      this.setVolume(e.detail.value);
    } else if (action === "linkable") {
      this._handleCopyLink();
    }
  }

  /**
   * sets the element's screenfullLoaded variable to true once screenfull is loaded
   * and adds an event listener for screenfull
   */
  _onScreenfullLoaded() {
    let root = this;
    this.screenfullLoaded = true;

    // handles fullscreen
    if (screenfull) {
      screenfull.on("change", () => {
        if (screenfull.enabled) root.fullscreen = screenfull.isFullscreen;
      });
    }
  }

  /**
   * sets duration, taking into consideration start and stop times
   *
   * @param {integer} seek time in seconds, optional
   * @returns {string} status
   */
  _setElapsedTime() {
    let elapsed =
        this.__seeking === true
          ? this.shadowRoot.getElementById("slider").immediateValue
          : this.media.getCurrentTime() > 0
          ? this.media.getCurrentTime()
          : 0,
      duration = this.media.duration > 0 ? this.media.duration : 0;
    this.__elapsed = elapsed;
    this.__duration = duration;
    if (this.media.seekable !== undefined && this.media.seekable.length > 0) {
      if (this.media.seekable.start(0) !== undefined)
        elapsed -= this.media.seekable.start(0);
      if (this.media.seekable.end(0) !== undefined)
        duration =
          this.media.seekable.end(0) -
          (this.media.seekable.start(0) !== undefined
            ? this.media.seekable.start(0)
            : 0);
    }
    this.__status =
      this._getHHMMSS(elapsed, duration) + "/" + this._getHHMMSS(duration);
  }

  /**
   * Show custom CC (for audio and YouTube)?
   *
   * @param {boolean} Is the media from YouTube?
   * @param {boolean} Is the media audio only?
   * @param {boolean} Does the media have CC tracks?
   * @param {boolean} Are the CC turned on?
   * @returns {boolean} Should the player show custom CC?
   */
  _showCustomCaptions(isYoutube, audioOnly, hasCaptions, cc) {
    return (isYoutube || audioOnly) && hasCaptions && cc;
  }

  /**
   * determines if there
   *
   * @param {string} the url for the thumbnail image
   * @returns {string} the string for the style attribute
   */
  _useYoutubeIframe(thumbnailSrc, isYoutube, __elapsed) {
    return (
      isYoutube &&
      (thumbnailSrc === null || __elapsed === undefined || __elapsed === 0)
    );
  }

  /**
   * gets YouTube iframe
   */
  _youTubeRequest() {
    window.A11yMediaYoutube.requestAvailability();
    let root = this,
      ytUtil = window.A11yMediaYoutube.instance;
    this.disableSeek = true;
    if (this.__playerAttached && this.__playerReady) {
      let ytInit = () => {
          // once metadata is ready on video set it on the media player
          // initialize the YouTube player
          this.media = ytUtil.initYoutubePlayer({
            width: "100%",
            height: "100%",
            videoId: this.youtubeId
          });
          this.__status = this._getLocal("youTubeLoading", "label");
          // move the YouTube iframe to the media player's YouTube container
          this.shadowRoot.getElementById("youtube").appendChild(this.media.a);
          this.__ytAppended = true;
          this._updateCustomTracks();
        },
        checkApi = e => {
          if (ytUtil.apiReady) {
            window.removeEventListener("youtube-api-ready", checkApi);
            if (!root.__ytAppended) {
              ytInit();
            }
          }
        };
      if (ytUtil.apiReady) {
        if (!root.__ytAppended) {
          ytInit();
        }
      } else {
        window.addEventListener("youtube-api-ready", checkApi);
      }
    }
  }

  /**
   * updates custom tracks for youTube
   */
  _updateCustomTracks() {
    if ((this.isYoutube || this.audioOnly) && this.__tracks) {
      let track =
        this.__tracks[
          this.shadowRoot.getElementById("transcript").selectedTranscript
        ],
        active = [],
        caption = "";
      if (
        track !== undefined &&
        track !== null &&
        track.cues !== undefined &&
        track.cues !== null
      ) {
        for (let i = 0; i < track.cues.length; i++) {
          if (
            track.cues[i].seek < this.__elapsed &&
            track.cues[i].seekEnd > this.__elapsed
          ) {
            active.push(track.cues[i].order);
            caption = caption === "" ? track.cues[i].text : caption;
          }
        }
        this.shadowRoot.getElementById("customcctxt").innerText = caption;
        this.shadowRoot.getElementById("transcript").setActiveCues(active);
      }
    }
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    window.removeEventListener(
      "es-bridge-screenfullLib-loaded",
      this._onScreenfullLoaded.bind(this)
    );
    super.disconnectedCallback();
  }
}
window.customElements.define(A11yMediaPlayer.tag, A11yMediaPlayer);
export { A11yMediaPlayer };

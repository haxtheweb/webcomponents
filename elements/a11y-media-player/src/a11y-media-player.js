/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element/lit-element.js";
import { ifDefined } from "lit-element/node_modules/lit-html/directives/if-defined.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
import { A11yMediaBehaviors } from "./lib/a11y-media-behaviors.js";
import "@lrnwebcomponents/simple-search/simple-search.js";
import "./lib/a11y-media-state-manager.js";
import "./lib/a11y-media-controls.js";
import "./lib/a11y-media-button.js";
import "./lib/a11y-media-transcript-cue.js";

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
    this.activeCues = [];
    this.audioNoThumb = this._getAudioNoThumb(false, null);
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
    this.mediaCaption = this._getMediaCaption(false, "");
    this.mediaLang = "en";
    this.muted = false;
    this.printCaption = this._getPrintCaption(false, "");
    this.responsiveSize = "xs";
    this.screenfullLoaded = false;
    this.shareLink = this._getShareLink(0);
    this.showCustomCaptions = false;
    this.sources = [];
    this.stackedLayout = false;
    this.sticky = false;
    this.stickyCorner = "top-right";
    this.tracks = [];
    this.__activeTrack = null;
    this.__cues = [];
    this.__filteredCues = [];
    this.__duration = 0;
    this.__elapsed = null;
    this.__playing = false;
    this.__captionHref = "";
    this.__playerAttached = true;
    this.__status = this._getLocal("loading", "label");
    this.__resumePlaying = false;
    this._setPlayerHeight();

    window.A11yMediaStateManager.requestAvailability();

    import("./lib/a11y-media-transcript.js");
    import("./lib/a11y-media-youtube.js");
    import("@lrnwebcomponents/anchor-behaviors/anchor-behaviors.js");
    import("@polymer/paper-slider/paper-slider.js");
    import("@polymer/iron-icons/iron-icons.js");
    import("@polymer/iron-icons/av-icons.js");
    import("@lrnwebcomponents/a11y-media-player/lib/a11y-media-play-button.js");
    import("@polymer/paper-toast/paper-toast.js");
    if (typeof screenfull === "object") this._onScreenfullLoaded.bind(this);
    const basePath = this.pathFromUrl(decodeURIComponent(import.meta.url));
    const location = `${basePath}lib/screenfull/dist/screenfull.js`;
    window.ESGlobalBridge.requestAvailability();
    window.ESGlobalBridge.instance.load("screenfullLib", location);
    window.addEventListener(
      "es-bridge-screenfullLib-loaded",
      this._onScreenfullLoaded.bind(this)
    );
  }

  connectedCallback() {
    super.connectedCallback();
    let media = this.querySelectorAll("audio,video");
    media.forEach(medium => {
      medium.removeAttribute("autoplay");
      medium.style.width = "100%";
      medium.style.maxWidth = "100%";
    });
    if (media.length > 0) {
      this.media = media[0];
      this.audioOnly = this.media.tagName === "AUDIO";
    } else {
      let media = document.createElement(
        this.querySelectorAll('source[type*="audio"]').length > 0
          ? "audio"
          : "video"
      );
      this.querySelectorAll("source,track").forEach(node => {
        if (node.parentNode === this) media.appendChild(node);
      });
      this.appendChild(media);
      this.media = media;
    }
    this._addResponsiveUtility();
    this.transcript = this.shadowRoot.querySelector("#transcript");
    /**
     * Fires when a new player is ready for a11y-media-state-manager
     * @event a11y-player
     */
    window.dispatchEvent(
      new CustomEvent("a11y-player", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this
      })
    );
    this.__playerReady = true;
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
  /**
   * @param {map} changedProperties the properties that have changed
   */
  firstUpdated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "isYoutube" && this.isYoutube) this._youTubeRequest();
    });
  }

  /**
   * @param {map} changedProperties the properties that have changed
   */

  updated(changedProperties) {
    let notifiedProps = [
      "fullscreenButton",
      "responsiveSize",
      "screenfullLoaded",
      "__elapsed",
      "__playing",
      "__captionHref"
    ];
    changedProperties.forEach((oldValue, propName) => {
      this._updateMediaProperties(propName);
      this._updateCaptionProperties(propName);
      if (propName === "id" && this.id === null)
        this.id = "a11y-media-player" + Date.now();
      if (propName === "cc") this._handleCCChanged();
      if (propName === "muted") this._handleMuteChanged();
      if (propName === "volume") this.setVolume(this.volume);
      if (propName === "__cues") this.hasCaptions = this.__cues.length > 1;
      if (propName === "__elapsed")
        this.shareLink = this._getShareLink(this.__elapsed);
      if (propName === "__playing")
        this.playPause = this._getPlayPause(this.__playing);
      if (
        ["audioNoThumb", "disableFullscreen", "screenfullLoaded"].includes(
          propName
        )
      )
        this.fullscreenButton = this._getFullscreenButton(
          this.disableFullscreen,
          this.audioNoThumb
        );
      if (
        [
          "audioNoThumb",
          "hideTranscript",
          "stackedLayout",
          "standAlone"
        ].includes(propName)
      )
        this.flexLayout = !(
          this.standAlone ||
          this.hideTranscript ||
          this.audioNoThumb ||
          this.stackedLayout
        );
      if (["audioOnly", "hasCaptions", "isYoutube"].includes(propName))
        this.showCustomCaptions =
          (this.isYoutube || this.audioOnly) && this.hasCaptions && this.cc;
      if (["audioOnly", "thumbnailSrc"].includes(propName))
        this.audioNoThumb = this._getAudioNoThumb(
          this.audioOnly,
          this.thumbnailSrc
        );
      if (["fullscreen", "height", "media", "width"].includes(propName))
        this._setPlayerHeight();
      if (["hasCaptions", "standAlone"].includes(propName))
        this.hasTranscript = this.hasCaptions && !this.standAlone;
      if (["selectedTrack", "__cues"].includes(propName))
        this.__filteredCues = this.__cues.filter(
          cue => cue.track === this.selectedTrack
        );

      if (notifiedProps.includes(propName)) {
        this.dispatchEvent(
          new CustomEvent(
            `${propName
              .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
              .toLowerCase()}-changed`,
            { detail: { value: this[propName] } }
          )
        );
      }
    });
  }

  /**
   * handles closed captions change
   */
  _handleCCChanged() {
    console.log("_handleCCChanged", this.selectedTrack, this.cc);
    if (this.selectedTrack && this.cc === true) {
      this.selectedTrack.mode = "showing";
      this.querySelector("video,audio").textTracks.value = this.selectedTrackId;
    } else if (this.selectedTrack) {
      this.selectedTrack.mode = "hidden";
      this.querySelector("video,audio").textTracks.value = "";
    }
    /**
     * Fires when closed caption is toggled
     * @event cc-changed
     */
    window.dispatchEvent(
      new CustomEvent("cc-changed", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this
      })
    );
  }

  /**
   * handles mute change
   */
  _handleMuteChanged() {
    if (this.isYoutube) {
      this.media.setMute(this.muted);
    } else {
      this.media.muted = this.muted;
    }
    /**
     * Fires when closed caption is toggled
     * @event mute-changed
     */
    window.dispatchEvent(
      new CustomEvent("mute-changed", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this
      })
    );
  }

  /**
   * gets the buffered time
   */
  getBufferedTime() {
    return this.media.buffered.length > 0
      ? this.media.buffered.end(0)
      : this.currentTime;
  }
  /**
   * gets download data for the active transcript
   * @param {string} the title of the media
   */
  download(mediaTitle) {
    let a = document.createElement("a"),
      title =
        mediaTitle !== null && mediaTitle !== ""
          ? mediaTitle
          : this._getLocal("transcript", "label"),
      filename =
        mediaTitle !== null && mediaTitle !== ""
          ? mediaTitle.replace(/[^\w\d]/g, "")
          : "Transcript",
      selectedTrack = this.tracks.filter(
        (track, index) => parseInt(this.selectedTranscript) === parseInt(index)
      )[0],
      data = selectedTrack.cues
        .map(cue => `${cue.start} - ${cue.end}: ${cue.text}\n`)
        .join("");
    a.setAttribute(
      "href",
      "data:text/plain;charset=UTF-8," + encodeURIComponent(title + "\n" + data)
    );
    a.setAttribute("download", filename + ".txt");
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  /**
   * prints the active transcript
   * @param {string} the title of the media
   */
  print(mediaTitle) {
    let selectedTrack = this.tracks.filter(
        (track, index) => parseInt(this.selectedTranscript) === parseInt(index)
      )[0],
      cues = selectedTrack.cues
        .map(
          cue => `
        <div style="display: table-row;">
          ${
            this.hideTimestamps
              ? ``
              : `
              <span style="display: table-cell;
                font-size: 80%;
                padding: 0 16px;
                white-space: nowrap;
                font-family: monospace;">
                ${cue.start} - ${cue.end}:
              </span>`
          }
          <span style="display: table-cell; line-height: 200%;">
            ${cue.text}
          </span>
        </div>`
        )
        .join(""),
      title =
        mediaTitle !== null && mediaTitle !== ""
          ? mediaTitle
          : this._getLocal("transcript", "label"),
      print = window.open(
        "",
        "",
        "left=0,top=0,width=552,height=477,toolbar=0,scrollbars=0,status =0"
      );
    print.document.body.innerHTML = `<h1>${title}</h1>${cues}`;
    print.document.close();
    print.focus();
    print.print();
    print.close();
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
      /**
       * Fires when media plays
       * @event play
       */
      window.dispatchEvent(
        new CustomEvent("play", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: this
        })
      );
      /**
       * DEPRECATED: Fires when media plays
       * @event a11y-player-playing
       */
      window.dispatchEvent(
        new CustomEvent("a11y-player-playing", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: this
        })
      );
    }
  }

  /**
   * pauses the media
   */
  pause() {
    this.__playing = false;
    this.media.pause();
    /**
     * Fires when media pauses
     * @event pause
     */
    window.dispatchEvent(
      new CustomEvent("pause", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this
      })
    );
  }

  /**
   * stops the media
   */
  stop() {
    this.pause();
    this.seek(0);
    /**
     * Fires when media stops
     * @event stop
     */
    window.dispatchEvent(
      new CustomEvent("stop", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this
      })
    );
  }

  /**
   * restarts the media
   */
  restart() {
    this.seek(0);
    this.play();
    /**
     * Fires when media retarts
     * @event restart
     */
    window.dispatchEvent(
      new CustomEvent("restart", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this
      })
    );
  }

  /**
   * seeks media backward at a set increment
   * @param {float} the elepsed time, in seconds
   */
  rewind(amt) {
    amt = amt !== undefined ? amt : this.media.duration / 20;
    this.__resumePlaying = this.__playing;
    this.seek(this.media.currentTime - amt, 0);
    if (this.__resumePlaying) this.play();
    this.__resumePlaying = false;
    /**
     * Fires when media moves backward
     * @event backward
     */
    window.dispatchEvent(
      new CustomEvent("backward", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this
      })
    );
  }

  /**
   * seeks media forward at a set increment
   * @param {float} the elepsed time, in seconds
   */
  forward(amt) {
    amt = amt !== undefined ? amt : this.media.duration / 20;
    this.__resumePlaying = this.__playing;
    this.seek(this.media.currentTime + amt);
    if (this.__resumePlaying) this.play();
    this.__resumePlaying = false;
    /**
     * Fires when media moves forward
     * @event forward
     */
    window.dispatchEvent(
      new CustomEvent("forward", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this
      })
    );
  }

  /**
   * seeks to a specific time
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
      if (this.isToutube) {
        this.media.seek(time);
      } else {
        this.media.currentTime = time;
      }
      /**
       * Fires when media seeks
       * @event seek
       */
      window.dispatchEvent(
        new CustomEvent("seek", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: this
        })
      );
    }
  }

  /**
   * selects a specific track by index
   * @param {integer} index track index
   */
  selectTrack(index) {
    if (!index) {
      let defaultTracks = this.tracks.filter(track => track.default === true);
      this.selectedTrack = defaultTracks
        ? defaultTracks[0].track
        : this.tracks[0].track;
    } else {
      this.selectedTrack = this.tracks.filter(
        track => track.value === index
      )[0].track;
    }
    Object.keys(this.media.textTracks).forEach(key => {
      if (this.media.textTracks[key])
        this.media.textTracks[key].mode =
          this.cc && this.media.textTracks[key] === this.selectedTrack
            ? "showing"
            : "hidden";
    });
    /**
     * Fires when video track changes
     * @event track-changed
     */
    window.dispatchEvent(
      new CustomEvent("track-changed", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this
      })
    );
  }

  /**
   * set speed/playback rate of media
   * @param {float} the playback rate, where 1 = 100%
   */
  setPlaybackRate(value) {
    value = value !== null ? value : 1;
    this.media.playbackRate = value !== null ? value : 1;
    /**
     * Fires when video playback rate changes
     * @event playback-rate-changed
     */
    window.dispatchEvent(
      new CustomEvent("playback-rate-changed", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this
      })
    );
  }

  /**
   * set volume of media
   * @param {integer} the volume level from 0-100
   */
  setVolume(value = 7) {
    this.volume = Math.max(0, Math.min(value, 100));
    this.media.volume = value / 100;
    /**
     * Fires when video volume changes
     * @event volume-changed
     */
    window.dispatchEvent(
      new CustomEvent("volume-changed", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this
      })
    );
  }

  /**
   * toggles captions
   * @param {boolean} Toggle CC on? `true` is on, `false` is off, and `null` toggles based on current state.
   */
  toggleCC(mode) {
    console.log("toggleCC", mode, this.cc);
    this.cc = typeof mode === typeof undefined ? !this.cc : mode;
    /**
     * Fires when closed caption is toggled
     * @event cc-toggle
     */
    window.dispatchEvent(
      new CustomEvent("cc-toggle", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this
      })
    );
  }

  /**
   * toggles looping
   * @param {boolean} Toggle looping on? `true` is on, `false` is off, and `null` toggles based on current state.
   */
  toggleLoop(mode) {
    if (this.isYoutube) {
    } else {
      this.loop = mode === undefined ? !this.loop : mode;
      if (this.isYoutube) {
        this.media.setLoop(this.loop);
      } else {
        this.media.loop = mode === true;
      }
    }
    /**
     * Fires when looping is toggled
     * @event loop-toggle
     */
    window.dispatchEvent(
      new CustomEvent("loop-toggle", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this
      })
    );
  }

  /**
   * toggles mute
   * @param {boolean} Toggle mute on? `true` is on, `false` is off, and `null` toggles based on current state.
   */
  toggleMute(mode) {
    this.muted = typeof mode === typeof undefined ? !this.muted : mode;
    /**
     * Fires when mute is toggled
     * @event muted-toggle
     */
    window.dispatchEvent(
      new CustomEvent("muted-toggle", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this
      })
    );
  }

  /**
   * toggles sticky attribute
   * @param {boolean} Toggle sticky mode on? `true` is on, `false` is off, and `null` toggles based on current state.
   */
  toggleSticky(mode) {
    mode = mode === undefined ? !this.sticky : mode;
    this.sticky = mode;
    /**
     * Fires when video video's sticky behavior is toggled
     * @event player-sticky
     */
    this.dispatchEvent(
      new CustomEvent("player-sticky", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this
      })
    );
  }

  /**
   * toggles transcript
   * @param {boolean} Toggle transcript on? `true` is on, `false` is off, and `null` toggles based on current state.
   */
  toggleTranscript(mode) {
    mode = mode === undefined ? this.hideTranscript : mode;
    this.hideTranscript = !mode;
    if (
      this.transcript &&
      this.shadowRoot.querySelector("#transcript") !== null
    ) {
      /**
       * Fires when transcript toggles
       * @event transcript-toggle
       */
      this.dispatchEvent(
        new CustomEvent("transcript-toggle", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: this
        })
      );
    }
  }

  /**
   * loads a track's cue metadata
   */
  _addSourcesAndTracks(media = this.media) {
    let root = this,
      counter = 0;
    media.style.width = "100%";
    media.style.maxWidth = "100%";
    media.setAttribute("preload", "metadata");
    this.__captionHref = media.querySelector("source[src]");
    media.addEventListener("media-loaded", e => root._handleMediaLoaded(e));
    media.addEventListener("timeupdate", e => root._handleTimeUpdate(e));
    media.textTracks.onremovetrack = e => {
      this.tracks.filter(track => track.value !== e.track);
      this.__cues = this.__cues.filter(cue => cue.track !== e.track);
    };
    media.textTracks.onaddtrack = e => {
      if (!root.selectedTrack) root.selectedTrack = e.track;
      let loadCueData = setInterval(() => {
        if (e.track.cues && e.track.cues.length > 0) {
          clearInterval(loadCueData);
          let cues = Object.keys(e.track.cues).map(key => e.track.cues[key]);
          this.__cues = this.__cues.concat(cues).sort((a, b) => {
            let start = a.startTime - b.startTime,
              end = a.endTime - b.endTime;
            return start !== 0 ? start : end !== 0 ? end : a.track - b.track;
          });
        }
      });
    };
    this.selectTrack();
    this.tracks = Object.keys(media.textTracks).map(key => {
      let d = this.media.querySelector("track[default]");
      return {
        default:
          d &&
          d.label == media.textTracks[key].label &&
          d.srclang == media.textTracks[key].language &&
          d.kind == media.textTracks[key].kind,
        value: key,
        track: media.textTracks[key]
      };
    });
  }

  /**
   * returns true if an attribute is set to a value
   * @param {boolean} Is the media audio only?
   * @param {string} optional: the source URL of the thumbnail image
   * @returns {boolean} Should height of video/thumbnail area be set to 0?
   */
  _getAudioNoThumb(audioOnly, thumbnailSrc) {
    return audioOnly && (thumbnailSrc === null || thumbnailSrc === undefined);
  }

  /**
   * returns whether or not the fullscreen mode should be disabled
   * @param {boolean} Is fullscreen mode set to disabled?
   * @returns {boolean} Should fullscreen disabled?
   */
  _getFullscreenButton(disableFullscreen, audioNoThumb, screenfullLoaded) {
    if (typeof screenfull === "object") this._onScreenfullLoaded.bind(this);
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
   * gets media caption
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
   * gets print caption
   * @param {boolean} Is the player set to audio-only?
   * @param {string} the title of the media
   * @returns {string} the media caption when the page is printed
   */
  _getPrintCaption(audioOnly, mediaTitle) {
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
   * get thumbanail css based on whether or not the video is playing
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
   * @param {object} track text track
   * @param {number} id unique identifier
   * /
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

        if (this.tracks === undefined) this.tracks = [];
        this.tracks.push({
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
        track.oncuechange = e => {
          root._setActiveCues(
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
    if (
      this.shadowRoot.querySelector("#link") &&
      this.shadowRoot.querySelector("#link").close
    )
      this.shadowRoot.querySelector("#link").close();
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
    this.shadowRoot.querySelector("#link").open();
  }

  /**
   * handles the seek function when a transcript cue is activated
   *
   * @param {event} e seek event
   */
  _handleCueSeek(cue) {
    if (!this.standAlone && this.transcript) {
      this.__resumePlaying = this.__playing;
      this.seek(cue);
    }
  }

  /**
   * handles transcript printing
   */
  _handleDownload() {
    this.shadowRoot.querySelector("#transcript").download(this.mediaTitle);
    /**
     * Fires when transcript is downloaded
     * @event transcript-downloaded
     */
    this.dispatchEvent(
      new CustomEvent("transcript-downloaded", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this
      })
    );
  }

  /**
   * handles media metadata when media is loaded
   */
  _handleMediaLoaded() {
    let anchor = window.AnchorBehaviors,
      target = anchor.getTarget(this),
      params = anchor.params;
    this._setPlayerHeight();
    this.shadowRoot.querySelector("#playbutton").removeAttribute("disabled");

    // gets and converts video duration
    this._setElapsedTime();
    //this._getTrackData(this.querySelector("video,audio"));

    //if this video is part of the page's query string or anchor, seek the video
    if (target === this) this.seek(this._getSeconds(params.t));
  }

  /**
   * handles transcript printing
   */
  _handlePrint() {
    this.shadowRoot.querySelector("#transcript").print(this.mediaTitle);
    /**
     * Fires when transcript is printed
     * @event transcript-printed
     */
    this.dispatchEvent(
      new CustomEvent("transcript-printed", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this
      })
    );
  }

  /**
   * sets search the simple-search element
   *
   * @param {event} e searchbar event
   */
  _handleSearchAdded(e) {
    this.search = e.detail;
  }

  /**
   * handles duration slider dragging with a mouse
   */
  _handleSliderStart() {
    this.__resumePlaying = this.__playing;
    this.pause();
    this.__seeking = true;
  }

  /**
   * handles duration slider dragging with a mouse
   */
  _handleSliderStop() {
    this.seek(this.shadowRoot.querySelector("#slider").immediateValue);
    this.__seeking = false;
    if (this.__resumePlaying) {
      this.play();
      this.__resumePlaying = false;
    }
  }

  /**
   * handles time updates
   */
  _handleTimeUpdate() {
    //if play exceeds clip length, stop
    if (this.isYoutube && this.media.duration !== this.media.getDuration()) {
      this.__duration = this.media.duration = this.media.getDuration();
      this.__buffered = this.getBufferedTime() || 0;
      while (this.__buffered < this.__duration)
        this.__buffered = this.getBufferedTime();
      this.disableSeek = false;
      if (
        this.media.seekable &&
        this.media.seekable.length > 0 &&
        this.media.seekable.start(0) !== 0
      ) {
        this.shadowRoot.querySelector(
          "#slider"
        ).min = this.media.seekable.start(0);
      }
    }
    if (
      this.media.seekable !== undefined &&
      this.media.seekable.length > 0 &&
      this.media.seekable.end(0) <= this.media.currentTime
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
  _handleTranscriptScroll() {
    this.disableScroll = !this.disableScroll;
  }

  /**
   * hides the playbutton for YouTube media that have no custom thumbnail
   * and for media that are already playing
   * @param {string} thumbnailSrc url for thumbnail image
   * @param {boolean} isYoutube source is YouTube
   * @returns {boolean} whether to hhide media
   */
  _hidePlayButton(thumbnailSrc, isYoutube, __elapsed) {
    return (isYoutube && thumbnailSrc === null) || (__elapsed && __elapsed > 0);
  }

  /**
   * Determines if video and transcript are in a flex layout
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
    let action = e.detail.action !== undefined ? e.detail.action : e.detail.id;

    if (action === "backward" || action === "rewind") {
      this.rewind();
    } else if (action === "captions") {
      this.toggleCC();
    } else if (action === "transcript" || action === "transcript-toggle") {
      this.toggleTranscript();
    } else if (e.detail.id === "tracks") {
      if (this.cc) this.selectTrack(e.detail.value);
    } else if (action === "forward") {
      this.forward();
    } else if (action === "fullscreen" && this.fullscreenButton) {
      this.toggleTranscript(this.fullscreen);
      screenfull.toggle(this.shadowRoot.querySelector("#outerplayer"));
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
      this.volume = e.detail.value;
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
   * updates activeCues array and scrolls to position
   * @param {array} an array of cues
   */
  _setActiveCues(cues) {
    let track = this.shadowRoot.getElementById("track"),
      offset = track !== null && track !== undefined ? track.offsetTop : 0,
      cue = this.shadowRoot.getElementById(
        "track a11y-media-transcript-cue[active]"
      );
    this.activeCues = cues.slice(0);
    if (
      !this.disableScroll &&
      cue !== undefined &&
      cue !== null &&
      this.activeCues !== undefined &&
      cue.getAttribute("order") !== this.activeCues[0]
    ) {
      //javascript scrolling from:  https://stackoverflow.com/questions/8917921/cross-browser-javascript-not-jquery-scroll-to-top-animation#answer-8918062
      let scrollingTo = (element, to, duration) => {
        if (duration <= 0) return;
        var difference = to - element.scrollTop;
        var perTick = (difference / duration) * 10;

        setTimeout(() => {
          element.scrollTop = element.scrollTop + perTick;
          if (element.scrollTop === to) return;
          scrollingTo(element, to, duration - 10);
        }, 10);
      };
      scrollingTo(this, cue.offsetTop - offset, 250);
    }
  }

  /**
   * updates the active track when tracks or selected track changes
   */
  _setActiveTrack() {
    let i = this.selectedTrack ? parseInt(this.selectedTrack) : 0,
      track = this.tracks.filter((track, index) => index === i);
    this.__activeTrack = track && track.length > -1 ? track[0] : null;
  }

  /**
   * sets duration, taking into consideration start and stop times
   * @param {integer} seek time in seconds, optional
   * @returns {string} status
   */
  _setElapsedTime() {
    let elapsed =
        this.__seeking === true
          ? this.shadowRoot.querySelector("#slider").immediateValue
          : this.media.currentTime > 0
          ? this.media.currentTime
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
   * sets the height of the player
   */
  _setPlayerHeight() {
    let aspect =
        this.media && this.media.aspectRatio ? this.media.aspectRatio : 16 / 9,
      player = this.shadowRoot.querySelector("#player"),
      audio =
        this.audioOnly && this.thumbnailSrc === null && this.height === null;
    this.width !== null ? this.width : "100%";
    this.style.maxWidth = this.width;

    if (player) {
      player.style.height = audio ? "60px" : "unset";
      if (this.height === null) {
        player.style.paddingTop = this.fullscreen
          ? `unset`
          : `${100 / aspect}%`;
        this.shadowRoot.querySelector("#innerplayer").style.maxWidth = this
          .fullscreen
          ? `unset`
          : `calc(${aspect * 100}vh - ${aspect * 80}px)`;
      } else {
        this.shadowRoot.querySelector(
          "#outerplayer"
        ).style.height = this.height;
      }
    }
  }

  /**
   * Show custom CC (for audio and YouTube)?
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
   * When relevant player properties change, updates caption below media and print caption above it
   * @param {string} propName the changed property
   */

  _updateCaptionProperties(propName) {
    if (["audioOnly", "localization", "mediaTitle"].includes(propName)) {
      this.mediaCaption = this._getMediaCaption(
        this.audioOnly,
        this.mediaTitle
      );
      this.printCaption = this._getPrintCaption(
        this.audioOnly,
        this.mediaTitle
      );
    }
  }

  /**
   * updates custom tracks for youTube
   */
  _updateCustomTracks() {
    if ((this.isYoutube || this.audioOnly) && this.tracks) {
      let track = this.tracks[this.transcript.selectedTranscript],
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
        this.shadowRoot.querySelector("#customcctxt").innerText = caption;
        this._setActiveCues(active);
      }
    }
  }

  /**
   * sets or removes media attributes
   *
   * @param {string} attr the media attribute
   * @param {} val value
   */
  _updateMediaAttribute(attr, val) {
    if (attr === "cc") console.log("_updateMediaAttribute", attr, val);
    if (val) {
      this.media.setAttribute(attr, val);
    } else {
      this.media.removeAttribute(attr, val);
    }
  }
  /**
   * When relevant player properties change, updates properties of media
   * @param {string} propName the changed property
   */

  _updateMediaProperties(propName) {
    if (this.media && this.media !== null) {
      if (propName === "media") this._addSourcesAndTracks(this.media);
      if (["media", "crossorigin"].includes(propName))
        this._updateMediaAttribute("crossorigin", this.crossorigin);
      if (["media", "mediaLang"].includes(propName))
        this._updateMediaAttribute("lang", this.mediaLang);
      if (["media", "thumbnailSrc"].includes(propName))
        this._updateMediaAttribute("poster", this.thumbnailSrc);
      if (["media", "autoplay"].includes(propName))
        this._updateMediaAttribute("autoplay", this.autoplay);
      if (["media", "cc"].includes(propName))
        this._updateMediaAttribute("cc", this.cc);
      if (["media", "isYoutube"].includes(propName))
        this._updateMediaAttribute("hidden", this.isYoutube);
      if (["media", "playbackRate"].includes(propName))
        this._updateMediaAttribute("playbackRate", this.playbackRate);
      if (["media", "autoplay"].includes(propName))
        this._updateMediaAttribute("autoplay", this.autoplay);
      if (["media", "volume"].includes(propName))
        this._updateMediaAttribute("volume", this.volume);
      if (["media", "muted"].includes(propName))
        this._updateMediaAttribute("muted", this.muted);
      if (["media", "__playing"].includes(propName))
        this._updateMediaAttribute("playing", this.playing);
    }
  }

  /**
   * determines if there
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

    document.addEventListener("timeupdate", e => {
      if (e.detail === root.media) root._handleTimeUpdate(e);
    });
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
          this.shadowRoot.querySelector("#youtube").appendChild(this.media.a);
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
}
window.customElements.define(A11yMediaPlayer.tag, A11yMediaPlayer);
export { A11yMediaPlayer };

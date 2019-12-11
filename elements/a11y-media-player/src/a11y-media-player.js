/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element/lit-element.js";
import { ifDefined } from "lit-element/node_modules/lit-html/directives/if-defined.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/responsive-utility/responsive-utility.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
import "@lrnwebcomponents/simple-search/simple-search.js";
import "./lib/a11y-media-state-manager.js";
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
class A11yMediaPlayer extends SimpleColors {
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
    this.__localizationDefaults = {
      audio: {
        label: "Audio",
        notSupported: "HTML5 video is not supported."
      },
      autoScroll: {
        label: "Scroll Transcript",
        icon: "swap-vert"
      },
      captions: {
        label: "Closed Captions",
        icon: "av:closed-caption",
        off: "Off"
      },
      download: {
        label: "Download Transcript",
        icon: "file-download"
      },
      forward: {
        label: "Forward",
        icon: "av:fast-forward"
      },
      fullscreen: {
        label: "Fullscreen",
        icon: "fullscreen"
      },
      copyLink: {
        label: "Copy Media Link",
        icon: "link"
      },
      closeLink: {
        label: "Close",
        icon: "close"
      },
      loading: {
        label: "Loading..."
      },
      loop: {
        label: "Loop Playback"
      },
      mute: {
        label: "Mute",
        icon: "av:volume-up"
      },
      nextResult: {
        label: "Next",
        icon: "arrow-forward"
      },
      pause: {
        label: "Pause",
        icon: "av:pause"
      },
      play: {
        label: "Play",
        icon: "av:play-arrow"
      },
      prevResult: {
        label: "Previous",
        icon: "arrow-back"
      },
      print: {
        label: "Print Transcript",
        icon: "print"
      },
      restart: {
        label: "Restart",
        icon: "av:replay"
      },
      rewind: {
        label: "Backward",
        icon: "av:fast-rewind"
      },
      search: {
        label: "Search the transcript.",
        icon: "search"
      },
      seekSlider: {
        label: "Seek Slider"
      },
      settings: {
        label: "Settings",
        icon: "settings"
      },
      speed: {
        label: "Speed %"
      },
      transcript: {
        label: "Transcript",
        icon: "description",
        loading: "Loading the transcript(s)...",
        off: "Off",
        skip: "Skip to the transcript."
      },
      unmute: {
        label: "Unmute",
        icon: "av:volume-off"
      },
      video: {
        label: "Video",
        notSupported: "HTML5 video is not supported."
      },
      volume: {
        label: "Volume"
      },
      youTubeLoading: {
        label: "Ready."
      },
      youTubeTranscript: {
        label: "Transcript will load once media plays."
      }
    };
    this.audioOnly = false;
    this.autoplay = false;
    this.allowConcurrent = false;
    this.cc = false;
    this.darkTranscript = false;
    this.disableFullscreen = false;
    this.disableInteractive = false;
    this.disablePrintButton = false;
    this.disableSearch = false;
    this.disableScroll = false;
    this.disableSeek = false;
    this.fullscreen = false;
    this.fullscreenButton = false;
    this.hasCaptions = false;
    this.hasTranscript = false;
    this.height = null;
    this.hideElapsedTime = false;
    this.hideTimestamps = false;
    this.hideTranscript = false;
    this.id = null;
    this.lang = "en";
    this.linkable = false;
    this.localization = {};
    this.loop = false;
    this.manifest = null;
    this.media = null;
    this.mediaTitle = "";
    this.mediaLang = "en";
    this.muted = false;
    this.playbackRate = 1;
    this.search = null;
    this.standAlone = false;
    this.responsiveSize = "xs";
    this.captionsTrack = null;
    this.transcriptTrack = null;
    this.showCustomCaptions = false;
    this.sources = [];
    this.stackedLayout = false;
    this.sticky = false;
    this.stickyCorner = "top-right";
    this.target = null;
    this.tracks = [];
    this.volume = 70;
    this.width = null;
    this.youtubeId = null;
    this.youtube = {};
    this.__activeCues = [];
    this.__audioNoThumb = this._getAudioNoThumb(false, null);
    this.__cues = [];
    this.__captionHref = "";
    this.__captionsOption = -1;
    this.__html5Media = null;
    this.__isYoutube = null;
    this.__filteredCues = [];
    this.__duration = 0;
    this.__elapsed = 0;
    this.__flexLayout = true;
    this.__mediaCaption = this._getMediaCaption(false, "");
    this.__playing = false;
    this.__playerAttached = true;
    this.__printCaption = this._getPrintCaption(false, "");
    this.__screenfullLoaded = false;
    this.__shareLink = this._getShareLink(0);
    this.__status = this._getLocal(this.localization, "loading", "label");
    this.__resumePlaying = false;
    this.__transcriptOption = -1;
    this.__volumeOption = 70;
    this._setPlayerHeight();

    window.A11yMediaStateManager.requestAvailability();
    import("./lib/a11y-media-youtube.js");
    import("@polymer/paper-slider/paper-slider.js");
    import("@polymer/iron-icons/iron-icons.js");
    import("@polymer/iron-icons/av-icons.js");
    import("@polymer/paper-toast/paper-toast.js");
    import("@polymer/paper-listbox/paper-listbox.js");
    import("@polymer/paper-input/paper-input.js");
    import("@polymer/paper-item/paper-item.js");
    import("@polymer/paper-icon-button/paper-icon-button.js");
    import("@polymer/paper-menu-button/paper-menu-button.js");
    import("@polymer/paper-toggle-button/paper-toggle-button.js");
    import("@polymer/paper-tooltip/paper-tooltip.js");
    import("@lrnwebcomponents/dropdown-select/dropdown-select.js");
    import("@lrnwebcomponents/anchor-behaviors/anchor-behaviors.js");
    import("@lrnwebcomponents/a11y-media-player/lib/a11y-media-play-button.js");
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
    console.log(this.share);
    let root = this,
      media = this.querySelectorAll("audio,video");
    media.forEach(medium => {
      medium.removeAttribute("autoplay");
      medium.style.width = "100%";
      medium.style.maxWidth = "100%";
      medium.setAttribute("preload", "metadata");
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
      media.setAttribute("preload", "metadata");
      this.appendChild(media);
      this.media = media;
    }
    /* handle deprecated tracks */
    this.tracks.forEach(track => {
      let node = document.createElement("track");
      Object.keys(track).forEach(key => node.setAttribute(key, track[key]));
      media.appendChild(node);
    });
    /* handle deprecated sources */
    this.sources.forEach(source => {
      let node = document.createElement("source");
      Object.keys(source).forEach(key => node.setAttribute(key, source[key]));
      media.appendChild(node);
    });
    this.__html5Media = this.media;
    this.__html5Media.addEventListener("media-loaded", e =>
      root._handleMediaLoaded(e)
    );
    this.__html5Media.addEventListener("timeupdate", e =>
      root._handleTimeUpdate(e)
    );
    this._addResponsiveUtility();
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
      if (propName === "__isYoutube" && this.__isYoutube)
        this._youTubeRequest();
    });
  }

  /**
   * @param {map} changedProperties the properties that have changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      this._updateMediaProperties(propName);
      this._updateCaptionProperties(propName);
      if (propName === "id" && this.id === null)
        this.id = "a11y-media-player" + Date.now();

      /* updates playback status */
      if (propName === "__elapsed")
        this.__shareLink = this._getShareLink(this.__elapsed);

      /* updates volume */
      if (propName === "muted") this._handleMuteChanged();
      if (propName === "volume") this.setVolume(this.volume);

      /* updates captions */
      if (propName === "__captionsOption") this._captionsOptionChanged();
      if (["cc", "captionsTrack"].includes(propName)) this._captionsChanged();
      if (["audioOnly", "hasCaptions", "__isYoutube"].includes(propName))
        this.showCustomCaptions =
          (this.__isYoutube || this.audioOnly) && this.hasCaptions && this.cc;

      /* updates tranmsctipt */
      if (["hasCaptions", "standAlone"].includes(propName))
        this.hasTranscript = this.hasCaptions && !this.standAlone;
      if (propName === "__transcriptOption") this._transcriptOptionChanged();
      if (["hideTranscript", "transcriptTrack"].includes(propName))
        this._transcriptChanged();
      if (propName === "__cues") this.hasCaptions = this.__cues.length > 1;
      if (["transcriptTrack", "__cues"].includes(propName)) {
        let cues = this.__cues.slice();
        this.__filteredCues = cues.filter(
          cue => cue.track === this.transcriptTrack
        );
      }
      /* updates layout */
      if (
        ["__audioNoThumb", "disableFullscreen", "__screenfullLoaded"].includes(
          propName
        )
      )
        this.fullscreenButton = this._getFullscreenButton(
          this.disableFullscreen,
          this.__audioNoThumb
        );
      if (
        [
          "__audioNoThumb",
          "hideTranscript",
          "stackedLayout",
          "standAlone"
        ].includes(propName)
      )
        this.__flexLayout = !(
          this.standAlone ||
          this.hideTranscript ||
          this.__audioNoThumb ||
          this.stackedLayout
        );
      if (["audioOnly", "thumbnailSrc"].includes(propName))
        this.__audioNoThumb = this._getAudioNoThumb(
          this.audioOnly,
          this.thumbnailSrc
        );
      if (["fullscreen", "height", "media", "width"].includes(propName))
        this._setPlayerHeight();

      this.dispatchEvent(
        new CustomEvent(
          `${propName
            .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
            .toLowerCase()}-changed`,
          { detail: { value: this[propName] } }
        )
      );
    });
  }

  /**
   * updates track mode & `__captionsOption` when `captionsTrack` or `cc` changes
   */
  _captionsChanged() {
    let ccNum = -1;
    Object.keys(this.__html5Media.textTracks).forEach(key => {
      let showing =
        this.cc && this.__html5Media.textTracks[key] === this.captionsTrack;
      this.__html5Media.textTracks[key].mode = showing ? "showing" : "hidden";
      if (showing) ccNum = key;
    });
    this.__captionsOption = ccNum;
  }

  /**
   * updates track mode & `captionsTrack` when `__captionsOption` changes
   */
  _captionsOptionChanged() {
    this.cc = this.__captionsOption > -1;
    Object.keys(this.__html5Media.textTracks).forEach(key => {
      let showing = parseInt(key) == parseInt(this.__captionsOption);
      this.__html5Media.textTracks[key].mode = showing ? "showing" : "hidden";
      if (showing) this.captionsTrack = this.__html5Media.textTracks[key];
    });
  }

  /**
   * updates `__transcriptOption` when `transcriptTrack` or `hide-transcript` changes
   */
  _transcriptChanged() {
    this.__transcriptOption = this.hideTranscript
      ? -1
      : this._getTrackId(this.transcriptTrack);
  }

  /**
   * updates track mode & `transcriptTrack` when `__transcriptOption` changes
   */
  _transcriptOptionChanged() {
    if (this.__transcriptOption > -1)
      this.transcriptTrack = this.__html5Media.textTracks[
        this.__transcriptOption
      ];
    this.hideTranscript = this.__transcriptOption < 0;
  }

  /**
   * handles mute change
   */
  _handleMuteChanged() {
    if (this.__isYoutube) {
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
   * determine which button was clicked and act accordingly
   */
  _handleSettingsChanged(e) {
    if (
      this.shadowRoot &&
      this.shadowRoot.querySelector("#settings") &&
      this.shadowRoot.querySelector("#settings").close &&
      !e.path[0].opened
    )
      this.shadowRoot.querySelector("#settings").close();
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
  download() {
    let a = document.createElement("a"),
      title =
        this.mediaTitle && this.mediaTitle.trim() != ""
          ? `${this.mediaTitle} (${this._getLocal(
              this.localization,
              "transcript",
              "label"
            )})`
          : this._getLocal(this.localization, "transcript", "label"),
      filename = title.replace(/[^\w\d]/g, ""),
      cues = this.transcriptTrack.cues,
      data = Object.keys(cues)
        .map(
          key =>
            `${this._getHHMMSS(cues[key].startTime)} - ${this._getHHMMSS(
              cues[key].endTime
            )}: \t${cues[key].text.replace(/[\n\r\s*]/g, " ")}\n`
        )
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
   * prints the active transcript
   * @param {string} the title of the media
   */
  print() {
    let cues = this.transcriptTrack.cues,
      title =
        this.mediaTitle && this.mediaTitle.trim() != ""
          ? `${this.mediaTitle} (${this._getLocal(
              this.localization,
              "transcript",
              "label"
            )})`
          : this._getLocal(this.localization, "transcript", "label"),
      print = window.open(
        "",
        "",
        "left=0,top=0,width=552,height=477,toolbar=0,scrollbars=0,status =0"
      );
    print.document.body.innerHTML = `
    <h1>${title}</h1>
    ${Object.keys(cues)
      .map(
        key =>
          `<div style="display: table-row;">
        ${
          this.hideTimestamps
            ? ``
            : `
            <span style="display: table-cell;
              font-size: 80%;
              padding: 0 16px;
              white-space: nowrap;
              font-family: monospace;">
              ${this._getHHMMSS(cues[key].startTime)} - 
              ${this._getHHMMSS(cues[key].endTime)}:
            </span>`
        }
        <span style="display: table-cell; line-height: 200%;">
          ${cues[key].text}
        </span>
      </div>`
      )
      .join("")}
    `;
    print.document.close();
    print.focus();
    print.print();
    print.close();

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
   * plays the media
   */
  play() {
    if (this.__isYoutube && !this.__ytAppended) {
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
   * selects a specific transcript track
   * @param {track} track text track
   */
  _getTrack(track) {
    if (!track) {
      let defaultTracks = this.__html5Media.textTracks.filter(
        track => track.default === true
      );
      return defaultTracks
        ? defaultTracks[0].track
        : this.__html5Media.textTracks[0].track;
    }
    return track;
  }

  /**
   * selects a specific track as transcript
   * @param {track} track text track
   */
  selectTranscript(track) {
    this.transcriptTrack = this._getTrack(track);
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
   * toggles fullscreen
   * @param {boolean} Toggle fullscreen on? `true` is on, `false` is off, and `null` toggles based on current state.
   */
  toggleFullscreen(mode) {
    if (screenfull && this.fullscreenButton) {
      this.fullscreen = mode === undefined ? !this.loop : mode;
      this.toggleTranscript(this.fullscreen);
      screenfull.toggle(this.shadowRoot.querySelector("#outerplayer"));

      /**
       * Fires when fullscreen is toggled
       * @event fullscreen-toggle
       */
      window.dispatchEvent(
        new CustomEvent("fullscreen-toggle", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: this
        })
      );
    }
  }

  /**
   * toggles looping
   * @param {boolean} Toggle looping on? `true` is on, `false` is off, and `null` toggles based on current state.
   */
  toggleLoop(mode) {
    this.loop = mode === undefined ? !this.loop : mode;
    if (this.__isYoutube) {
      this.media.setLoop(this.loop);
    } else {
      this.media.loop = mode === true;
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
   * toggles play
   * @param {boolean} Toggle play/pause? `true` is on, `false` is off, and `null` toggles based on current state.
   */
  togglePlay() {
    if (this.playing) {
      this.pause();
    } else {
      this.play();
    }
    /**
     * Fires when play/pause is toggled
     * @event play-toggle
     */
    window.dispatchEvent(
      new CustomEvent("play-toggle", {
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

  /**
   * loads a track's cue metadata
   */
  _addSourcesAndTracks(media = this.media) {
    let root = this;
    media.style.width = "100%";
    media.style.maxWidth = "100%";
    this.__captionHref = this.__html5Media.querySelector("source[src]");
    this.__html5Media.textTracks.onremovetrack = e => {
      this.__html5Media.textTracks.filter(track => track !== e.track);
      this.__cues = this.__cues.filter(cue => cue.track !== e.track);
    };
    this.__html5Media.textTracks.onaddtrack = e => {
      if (this.captionsTrack === null) this.captionsTrack = e.track;
      e.track.mode = "hidden";
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

    let d = this.__html5Media.querySelector("track[default]"),
      defaultTrack =
        Object.keys(this.__html5Media.textTracks).find(key => {
          return (
            d.label === this.__html5Media.textTracks[key].label &&
            d.kind === this.__html5Media.textTracks[key].kind &&
            d.srclang === this.__html5Media.textTracks[key].scrlang
          );
        }) || 0;
    this.captionsTrack = this.__html5Media.textTracks[defaultTrack];
    this.transcriptTrack = this.captionsTrack;
    this._setElapsedTime();
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
  _getFullscreenButton(disableFullscreen, audioNoThumb, __screenfullLoaded) {
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
    let audioLabel = this._getLocal(this.localization, "audio", "label"),
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
    let audioLabel = this._getLocal(this.localization, "audio", "label"),
      videoLabel = this._getLocal(this.localization, "video", "label"),
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
  _getThumbnailCSS(thumbnailSrc, __isYoutube, audioOnly) {
    return thumbnailSrc != null && (__isYoutube || audioOnly)
      ? "background-image: url(" + thumbnailSrc + "); background-size: cover;"
      : undefined;
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
    el.value = this.__shareLink;
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
    if (!this.standAlone) {
      this.__resumePlaying = this.__playing;
      this.seek(cue.startTime);
    }
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

    //if this video is part of the page's query string or anchor, seek the video
    if (target === this) this.seek(this._getSeconds(params.t));
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
    if (this.__isYoutube && this.media.duration !== this.media.getDuration()) {
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
   * gets `key` of given track
   *
   * @param {object} track textTrack
   * @returns {number} key
   */
  _getTrackId(track) {
    return (
      Object.keys(this.__html5Media.textTracks).find(
        key => this.__html5Media.textTracks[key] === track
      ) || -1
    );
  }

  /**
   * handles transcript scroll toggle
   */
  _transcriptScroll() {
    this.disableScroll = !this.disableScroll;
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
    if (this.shadowRoot && this.shadowRoot.querySelector("#settings"))
      this.shadowRoot.querySelector("#settings").close();
  }

  /**
   * sets the element's __screenfullLoaded variable to true once screenfull is loaded
   * and adds an event listener for screenfull
   */
  _onScreenfullLoaded() {
    let root = this;
    this.__screenfullLoaded = true;

    // handles fullscreen
    if (screenfull) {
      screenfull.on("change", () => {
        if (screenfull.enabled) root.fullscreen = screenfull.isFullscreen;
      });
    }
  }

  /**
   * updates __activeCues array and scrolls to position
   * @param {array} an array of cues
   */
  _setActiveCue(e) {
    let cue = e.detail.element,
      transcript = cue.parentNode,
      offset =
        transcript !== null && transcript !== undefined
          ? transcript.offsetTop
          : 0;
    if (!this.disableScroll) {
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
      scrollingTo(cue.parentNode.parentNode, cue.offsetTop - offset, 250);
    }
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
    if (duration > 0)
      this.__status = `${this._getHHMMSS(elapsed, duration)}/${this._getHHMMSS(
        duration
      )}`;
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
  _showCustomCaptions(__isYoutube, audioOnly, hasCaptions, cc) {
    return (__isYoutube || audioOnly) && hasCaptions && cc;
  }
  /**
   * When relevant player properties change, updates caption below media and print caption above it
   * @param {string} propName the changed property
   */

  _updateCaptionProperties(propName) {
    if (["audioOnly", "localization", "mediaTitle"].includes(propName)) {
      this.__mediaCaption = this._getMediaCaption(
        this.audioOnly,
        this.mediaTitle
      );
      this.__printCaption = this._getPrintCaption(
        this.audioOnly,
        this.mediaTitle
      );
    }
  }

  /**
   * updates custom tracks for youTube
   */
  _updateCustomTracks() {
    if ((this.__isYoutube || this.audioOnly) && this.__html5Media.textTracks) {
      let track = this.captionsTrack,
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
      if (["media", "__isYoutube"].includes(propName))
        this._updateMediaAttribute("hidden", this.__isYoutube);
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
  _useYoutubeIframe(thumbnailSrc, __isYoutube, __elapsed) {
    return (
      __isYoutube &&
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
          this.__status = this._getLocal(
            this.localization,
            "youTubeLoading",
            "label"
          );
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
   * returns true if an attribute is not null
   *
   * @param {object} the attribute to check
   * @returns {boolean} attr !== undefined && attr !== null
   */
  _hasAttribute(attr) {
    return attr !== undefined && attr !== null;
  }

  /**
   * returns true if an attribute is set to a value
   *
   * @param {object} the attribute to check
   * @param {object} the value to check
   * @returns {boolean} attr === val
   */

  _testAttribute(attr, val) {
    return attr === val;
  }

  /**
   * calls responsive-utility to get parent's responsive size
   *
   * @param {object} a set of responsive for options, eg: `{element: root, attribute: "responsive-size", relativeToParent: true}`
   */
  _addResponsiveUtility(options) {
    let root = this;
    window.ResponsiveUtility.requestAvailability();
    /**
     * Fires player needs the size of parent container to add responsive styling
     * @event responsive-element
     */
    window.dispatchEvent(
      new CustomEvent("responsive-element", {
        detail:
          options !== undefined
            ? options
            : {
                element: root,
                attribute: "responsive-size",
                relativeToParent: true
              }
      })
    );
  }

  /**
   * converts time in millesconds to HH:MM:SS
   *
   * @param {float} the elapsed time, in seconds
   * @param {float} the duration, in seconds
   * @returns {string} a human-readable string of elapsed time/duration in HH:MM:SS
   *
   */
  _getHHMMSS(val, max) {
    val = parseFloat(val);
    max = max === undefined ? val : parseFloat(max);
    let a = val => {
        return val < 10 ? `0${val}` : val;
      },
      b = (val, i, none) => {
        return max >= i ? a(Math.floor(val / i)) + ":" : none;
      },
      c = val => {
        return val < 100 ? val + "0" : val;
      };
    return (
      b(val, 3600, "") + b(val % 3600, 60, "00:") + a(Math.round(val % 60))
    );
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
   * gets the localization by compaing the localization set to the defaults
   *
   * @param {object} the localization object
   * @param {string} the key to search for
   * @param {string} the subkey to search for
   * @returns {string} the default value for [key][subkey], unless localization[key][subkey] exists
   */
  _getLocal(localization, key, subkey) {
    let local = "";
    if (
      localization !== undefined &&
      localization[key] !== undefined &&
      localization[key][subkey] !== undefined
    ) {
      local = localization[key][subkey];
    } else if (
      this.__localizationDefaults !== undefined &&
      this.__localizationDefaults[key] !== undefined &&
      this.__localizationDefaults[key][subkey] !== undefined
    ) {
      local = this.__localizationDefaults[key][subkey];
    }
    return local;
  }
}
window.customElements.define(A11yMediaPlayer.tag, A11yMediaPlayer);
export { A11yMediaPlayer };

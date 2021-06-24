/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import { SimpleToastStore } from "@lrnwebcomponents/simple-toast/simple-toast.js";
import { FullscreenBehaviors } from "@lrnwebcomponents/fullscreen-behaviors/fullscreen-behaviors.js";
import "@lrnwebcomponents/anchor-behaviors/anchor-behaviors.js";
import "@lrnwebcomponents/responsive-utility/responsive-utility.js";
import { normalizeEventPath } from "@lrnwebcomponents/utils/utils.js";
import "@lrnwebcomponents/absolute-position-behavior/absolute-position-behavior.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "./lib/a11y-media-play-button.js";
import "./lib/a11y-media-state-manager.js";
import "./lib/a11y-media-button.js";
import "./lib/a11y-media-transcript-cue.js";
import "./lib/a11y-media-youtube.js";

/**
 * `a11y-media-player`
 * an accessible video player
 * 
### Styling
`<a11y-media-player>` provides the following basic custom properties
for styling:

#### Basic Styling

Custom property | Description | Default
----------------|-------------|----------
`--a11y-media-color` | default text color | `--simple-colors-default-theme-grey-11`
`--a11y-media-bg-color` | default background color | `--simple-colors-default-theme-grey-2`
`--a11y-media-border-color` | default border color | `--simple-colors-default-theme-grey-3`
`--a11y-media-hover-color` | text color when hovering | `--simple-colors-default-theme-grey-12`
`--a11y-media-hover-bg-color` | background color when hovering | `--simple-colors-default-theme-grey-2`
`--a11y-media-accent-color` | accent color | `--simple-colors-default-theme-accent-9`
`--a11y-media-faded-accent-color` | accent color when faded | `--simple-colors-default-theme-accent-8`
`--a11y-media-disabled-color` | color for disabled items | `--simple-colors-default-theme-grey-5`
`--a11y-media-transcript-color` | default text color of transcript | `--simple-colors-default-theme-grey-7`
`--a11y-media-transcript-bg-color` | default background color of transcript | `--simple-colors-default-theme-grey-1`
`--a11y-media-transcript-accent-color` | default accent color of transcript | `--simple-colors-default-theme-accent-8`
`--a11y-media-transcript-faded-accent-color` | accent color of transcript, faded | `--simple-colors-default-theme-accent-10`
`--a11y-media-transcript-cue-color` | text color of transcript cue | `--simple-colors-fixed-theme-grey-12`
`--a11y-media-transcript-cue-bg-color` | background color of transcript cue  | `--simple-colors-fixed-theme-grey-1`
`--a11y-media-transcript-active-cue-color` | text color of active transcript cue  | `--simple-colors-fixed-theme-grey-12`
`--a11y-media-transcript-active-cue-bg-color` | background color of active transcript cue  | `--simple-colors-fixed-theme-accent-1`
`--a11y-media-transcript-focused-cue-color` | text color of focused transcript cue  | `--simple-colors-fixed-theme-grey-12`
`--a11y-media-transcript-focused-cue-bg-color` | background color of focused transcript cue  | `--simple-colors-fixed-theme-grey-2`
`--a11y-media-transcript-match-color` | text color of matched term in transcript search  | `--simple-colors-fixed-theme-grey-1`
`--a11y-media-transcript-match-bg-color` | background color of matched term in transcript search | `--simple-colors-fixed-theme-accent-10`
`--a11y-media-transcript-match-border-color` | border color of matched term in transcript search | `--simple-colors-fixed-theme-accent-12`

#### Controls
Custom property | Description | Default 
----------------|-------------|----------
`--a11y-media-scrollbar-width` | default width of scrollbars | `5px`
`--a11y-media-controls-font-family` | font-family of controls

#### Buttons
Custom property | Description | Default
----------------|-------------|----------
`--a11y-media-button-color` | button text color | `--a11y-media-color`
`--a11y-media-button-bg-color` | button background color | `--a11y-media-bg-color`
`--a11y-media-button-hover-color` | button text color when hovering | `--a11y-media-accent-color`
`--a11y-media-button-hover-bg-color` | button background color when hovering | `--a11y-media-hover-bg-color`
`--a11y-media-button-disabled-color` | button text color when disabled | `--a11y-media-disabled-color`
`--a11y-media-button-toggle-color` | button text color when toggled | `--a11y-media-faded-accent-color`

#### Sliders
Custom property | Description | Default
----------------|-------------|----------
`--simple-range-input-active-color` | slider color when active | `--a11y-media-accent-color`
`--simple-range-input-secondary-color` | slider color for buffering | `--a11y-media-faded-accent-color`
`--simple-range-input-pin-color` | slider pin color | `--a11y-media-bg-color`
`--simple-range-input-pin-start-color` | slider pin color in start position | `--a11y-media-bg-color`
`--simple-range-input-pin-end-color` | slider pin color in end position | `--a11y-media-bg-color`
`--simple-range-input-knob-color` | slider knob color | `--a11y-media-accent-color`
`--simple-range-input-knob-start-color` | slider knob color in start position | `--a11y-media-accent-color`
`--simple-range-input-knob-end-color` | slider knob color in end position | `--a11y-media-bg-accent-color`
`--simple-range-input-knob-border-color` | slider knob border color | `--a11y-media-accent-color`
`--simple-range-input-knob-start-border-color` | slider knob border color in start position | `--a11y-media-bg-color`
`--simple-range-input-knob-end-border-color` | slider knob border color in end position | `--a11y-media-bg-color`

#### Settings Menu
Custom property | Description | Default
----------------|-------------|----------
`--a11y-media-settings-menu-color` | settings menu text color | `--a11y-media-color`
`--a11y-media-settings-menu-bg-color` | settings menu background color | `--a11y-media-bg-color`
`--a11y-media-settings-menu-hover-color` | settings menu text color when hovering | `--a11y-media-hover-color`
`--a11y-media-settings-menu-hover-bg-color` | settings menu background color when hovering | `--a11y-media-hover-bg-color`

#### Link Sharing Toast
Custom property | Description | Default
----------------|-------------|----------
`--simple-toast-color` | toast text color | `--a11y-media-color`
`--simple-toast-background-color` | toast background color | `--a11y-media-bg-color`
 *
 * @element a11y-media-player
 * @extends SimpleColors
 * @demo ./demo/index.html video demo
 * @demo ./demo/audio.html audio demo
 * @demo ./demo/youtube.html YouTube demo
 */
class A11yMediaPlayer extends FullscreenBehaviors(SimpleColors) {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "a11y-media-player";
  }

  constructor() {
    super();
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
    this.hideElapsedTime = false;
    this.hideTimestamps = false;
    this.hideTranscript = false;
    this.id = null;
    this.lang = "en";
    this.learningMode = false;
    this.linkable = false;
    this.localization = {};
    this.loop = false;
    this.mediaTitle = "";
    this.mediaLang = "en";
    this.muted = false;
    this.preload = "metadata";
    this.playbackRate = 1;
    this.search = null;
    this.standAlone = false;
    this.responsiveSize = "sm";
    this.captionsTrack = null;
    this.transcriptTrack = null;
    this.sources = [];
    this.stackedLayout = false;
    this.sticky = false;
    this.stickyCorner = "top-right";
    this.tracks = [];
    this.volume = 70;
    this.width = null;
    this.youtubeId = null;
    this.__cues = [];
    this.__currentTime = 0;
    this.__captionsOption = -1;
    this.__loadedTracks = null;
    this.__playing = false;
    this.__settingsOpen = false;
    this.__transcriptOption = -1;
    this.querySelectorAll("video,audio").forEach((html5) => {
      html5.addEventListener("loadedmetadata", (e) => {
        this.__preloadedDuration = html5.duration;
      });
    });
    setTimeout(() => {
      import("@lrnwebcomponents/simple-search/simple-search.js");
      import("@lrnwebcomponents/simple-range-input/simple-range-input.js");
      import("@lrnwebcomponents/simple-fields/lib/simple-fields-field.js");
      import("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");
    }, 0);
  }

  /** -------------------------- CALACULATED PROPERTIES ----------------- */

  /**
   * gets anchors from page and uses their timecodes
   * @readonly
   * @returns {number} media width divided by height
   */
  get anchor() {
    let anchor = window.AnchorBehaviors;
    return {
      target: anchor ? anchor.getTarget(this) : false,
      params: anchor ? anchor.params : {},
    };
  }

  /**
   * the aspect ratio of the media, or if unknown, `16/9`
   * @readonly
   * @returns {number} media width divided by height
   */
  get aspect() {
    let aspect =
      this.media && this.media.aspectRatio ? this.media.aspectRatio : 16 / 9;
    this.width !== null ? this.width : "100%";
    this.style.maxWidth = this.width;
    return aspect;
  }

  /**
   * returns true if an attribute is set to a value
   * @readonly
   * @returns {boolean} Should height of audio/thumbnail area be set to 0?
   */
  get audioNoThumb() {
    return (
      this.audioOnly &&
      (this.thumbnailSrc === null || this.thumbnailSrc === undefined)
    );
  }

  /**
   * returns buffered media
   * @readonly
   * @returns {number} seconds of buffered media
   */
  get buffered() {
    return this.media && this.media.buffered && this.media.buffered > 0
      ? this.media.buffered
      : 0;
  }

  /**
   * gets caption cues that should be visible for custom captions
   * @readonly
   * @returns {array} array of cues
   */
  get captionCues() {
    let cues =
      !this.captionsTrack || !this.captionsTrack.cues
        ? []
        : this.isYoutube
        ? Object.keys(this.captionsTrack.cues).map((key) => {
            let cue = this.captionsTrack.cues[key];
            if (
              cue.startTime <= this.currentTime &&
              cue.endTime >= this.currentTime
            )
              return cue;
            return {};
          })
        : this.captionsTrack.activeCues;
    return cues;
  }

  /**
   * gets options for captions picker
   *
   * @readonly
   * @memberof A11yMediaPlayer
   */
  get captionsPicker() {
    let options = {};
    options[-1] = this._getLocal(this.localization, "captions", "off");
    Object.keys(this.loadedTracks.textTracks || {}).forEach((key) => {
      options[key] =
        this.loadedTracks.textTracks[key].label ||
        this.loadedTracks.textTracks[key].language;
    });
    return options;
  }

  /**
   * `key` of selected textTrack based on `captionsTrack` and `cc` values
   */
  get captionsTrackKey() {
    return !this.cc ? -1 : this._getTrackId(this.captionsTrack);
  }

  /**
   * returns cues array
   */
  get cues() {
    return this.__cues;
  }

  /**
   * returns media duration
   * @readonly
   * @returns {number} media duration in seconds
   */
  get duration() {
    let duration =
      this.media && this.media.duration && this.media.duration > 0
        ? this.media.duration
        : this.__preloadedDuration
        ? this.__preloadedDuration
        : 0;
    return duration;
  }

  /**
   * determines if player is in flex-layout mode
   * @returns {boolean} Is the video in flex layout mode?
   */
  get flexLayout() {
    return (
      this.hasCaptions &&
      !this.standAlone &&
      !this.hideTranscript &&
      !this.audioNoThumb &&
      !this.stackedLayout
    );
  }

  /**
   * determines if parent is wide enough for full flex-layout mode
   * @returns {boolean}
   */
  get fullFlex() {
    return (
      this.flexLayout &&
      this.responsiveSize !== "xs" &&
      this.responsiveSize !== "sm"
    );
  }

  get fullscreen() {
    if (this.__fullscreen) {
      this.setAttribute("fullscreen", true);
    } else {
      this.removeAttribute("fullscreen");
    }
    return this.__fullscreen;
  }

  /**
   * whether or not the fullscreen mode is be disabled
   * @returns {boolean}
   */
  get fullscreenButton() {
    let mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    return (
      this.fullscreenEnabled &&
      !mobile &&
      !this.disableFullscreen &&
      !this.audioNoThumb
    );
  }

  /**
   * whether the media has any tracks
   *
   * @readonly
   * @returns {boolean}
   */
  get hasCaptions() {
    return this.cues.length > 1;
  }

  /**
   * whether media is YouTube
   * @readonly
   * @returns {boolean}
   */
  get isYoutube() {
    return this.youtubeId ? true : false;
  }

  /**
   * HTML `audio` or `video` tag where textTracks, if any, can be found
   * @readonly
   * @returns {object} HTML tag
   */
  get loadedTracks() {
    return this.__loadedTracks;
  }

  /**
   * object that contains default localization
   *
   * @readonly
   * @returns {object} default localization object
   */
  get localizationDefaults() {
    return {
      audio: {
        label: "Audio",
        notSupported: "HTML5 video is not supported.",
      },
      autoScroll: {
        label: "Scroll Transcript",
        icon: "swap-vert",
      },
      captions: {
        label: "Closed Captions",
        icon: "av:closed-caption",
        off: "Off",
      },
      download: {
        label: "Download Transcript",
        icon: "file-download",
      },
      forward: {
        label: "Forward",
        icon: "av:fast-forward",
      },
      fullscreen: {
        label: "Fullscreen",
        icon: "fullscreen",
      },
      copyLink: {
        label: "Copy Media Link",
        icon: "link",
      },
      closeLink: {
        label: "Close",
        icon: "close",
      },
      loading: {
        label: "Loading...",
      },
      loop: {
        label: "Loop Playback",
      },
      mute: {
        label: "Mute",
        icon: "av:volume-up",
      },
      nextResult: {
        label: "Next",
        icon: "arrow-forward",
      },
      pause: {
        label: "Pause",
        icon: "av:pause",
      },
      play: {
        label: "Play",
        icon: "av:play-arrow",
      },
      prevResult: {
        label: "Previous",
        icon: "arrow-back",
      },
      print: {
        label: "Print Transcript",
        icon: "print",
      },
      restart: {
        label: "Restart",
        icon: "av:replay",
      },
      rewind: {
        label: "Backward",
        icon: "av:fast-rewind",
      },
      search: {
        label: "Search the transcript.",
        icon: "search",
      },
      seekSlider: {
        label: "Seek Slider",
      },
      settings: {
        label: "Settings",
        icon: "settings",
      },
      speed: {
        label: "Speed %",
      },
      transcript: {
        label: "Transcript",
        icon: "description",
        loading: "Loading the transcript(s)...",
        off: "Off",
        skip: "Skip to the transcript.",
      },
      unmute: {
        label: "Unmute",
        icon: "av:volume-off",
      },
      video: {
        label: "Video",
        notSupported: "HTML5 video is not supported.",
      },
      volume: {
        label: "Volume",
      },
      youTubeLoading: {
        label: "Loading...",
        startLoading: "Press play.",
      },
      youTubeTranscript: {
        label: "Transcript will load once media plays.",
      },
    };
  }

  /**
   * media used for playback
   * @readonly
   */
  get media() {
    return this.isYoutube ? this.youtube : this.loadedTracks;
  }

  /**
   * gets media caption
   * @readonly
   * @returns {string} the media caption
   */
  get mediaCaption() {
    let audioLabel = this._getLocal(this.localization, "audio", "label"),
      hasMediaTitle =
        this.mediaTitle !== undefined &&
        this.mediaTitle !== null &&
        this.mediaTitle !== "";
    if (this.audioOnly && hasMediaTitle) {
      return this.mediaTitle + " (" + audioLabel + ")";
    } else if (this.audioOnly) {
      return audioLabel;
    } else if (hasMediaTitle) {
      return this.mediaTitle;
    } else {
      return undefined;
    }
  }

  /**
   * gets media media time if set
   * @readonly
   * @returns {number} end time in seconds
   */
  get mediaEnd() {
    return this.mediaSeekable && this.media.seekable.end(0)
      ? this.media.seekable.end(0)
      : false;
  }

  /**
   * `style` for `#player-and-controls`
   * @readonly
   * @returns {string} value for style attribute
   */
  get mediaMaxWidth() {
    let maxWidth =
      this.fullscreen || this.audioNoThumb
        ? `unset`
        : `calc(${this.aspect * 100}vh - ${this.aspect * 80}px)`;
    return `max-width:${maxWidth};`;
  }

  /**
   * whether media has a seekable time range
   * @readonly
   * @returns {boolean}
   */
  get mediaSeekable() {
    return this.media && this.media.seekable
      ? this.media.seekable.length > 0
      : false;
  }

  /**
   * gets media start time
   * @readonly
   * @returns {number} start time in seconds
   */
  get mediaStart() {
    return this.mediaSeekable && this.media.seekable.start(0)
      ? this.media.seekable.start(0)
      : 0;
  }

  /**
   * whether media is currently playing
   * @readonly
   * @returns {boolean}
   */
  get playing() {
    return this.__playing;
  }

  /**
   * `style` for `#player`
   * @readonly
   * @returns {string} value for style attribute
   */
  get playerStyle() {
    let height = this.audioNoThumb ? "60px" : "unset",
      paddingTop =
        this.fullscreen || this.audioNoThumb || this.height
          ? `unset`
          : `${100 / this.aspect}%`,
      thumbnail =
        this.poster && (this.isYoutube || this.audioOnly)
          ? `background-image:url(${this.poster});`
          : ``;
    return `height:${height};padding-top:${paddingTop};${thumbnail}`;
  }

  /**
   * `poster`  image for video
   * @readonly
   * @returns {string} url for poster image
   */
  get poster() {
    let thumbnail = this.thumbnailSrc
      ? this.thumbnailSrc
      : this.media && !this.media.poster
      ? this.media.poster
      : false;
    return !this.thumbnailSrc && this.youtubeId
      ? `https://img.youtube.com/vi/${this.youtubeId.replace(
          /[\?&].*/,
          ""
        )}/hqdefault.jpg`
      : thumbnail;
  }

  /**
   * gets print caption
   * @readonly
   * @returns {string} the media caption when the page is printed
   */
  get printCaption() {
    let audioLabel = this._getLocal(this.localization, "audio", "label"),
      videoLabel = this._getLocal(this.localization, "video", "label"),
      hasMediaTitle =
        this.mediaTitle !== undefined &&
        this.mediaTitle !== null &&
        this.mediaTitle !== "";
    if (this.audioOnly && hasMediaTitle) {
      return this.mediaTitle + " (" + audioLabel + ")";
    } else if (this.audioOnly) {
      return audioLabel;
    } else if (hasMediaTitle) {
      return this.mediaTitle + " (" + videoLabel + ")";
    } else {
      return videoLabel;
    }
  }

  /**
   * returns the current playback progress or slider position
   * @readonly
   * @returns {number} media duration in seconds
   */
  get currentTime() {
    let slider = this.shadowRoot
      ? this.shadowRoot.querySelector("#slider")
      : false;
    let currentTime =
      slider && !slider.disabled && slider.dragging
        ? this.shadowRoot.querySelector("#slider").immediateValue
        : this.__currentTime;
    return currentTime;
  }

  /**
   * gets the link for sharing the video at a specific timecode
   * @readonly
   * @returns {string} url for sharing the video
   */
  get shareLink() {
    let url = window.location.href.split(/[#?]/)[0],
      id = this.id ? `?id=${this.id}` : ``,
      currentTime =
        id !== "" && this.currentTime && this.currentTime !== 0
          ? `&t=${this.currentTime}`
          : ``;
    return `${url}${id}${currentTime}`;
  }

  /**
   * Show custom CC (for audio and YouTube)?
   * @returns {boolean} Should the player show custom CC?
   */
  get showCustomCaptions() {
    return (this.isYoutube || this.audioOnly) && this.hasCaptions && this.cc;
  }

  /**
   * gets playback status text
   *
   * @readonly
   * @returns {string} status, as either a localized loading message or progress/duration
   */
  get status() {
    return this.duration > 0
      ? html`
          ${this._getHHMMSS(this.currentTime, this.duration)}/${this._getHHMMSS(
            this.duration
          )}
        `
      : !this.isYoutube
      ? this._getLocal(this.localization, "loading", "label")
      : this.__playing
      ? this._getLocal(this.localization, "youTubeLoading", "label")
      : this._getLocal(this.localization, "youTubeLoading", "startLoading");
  }

  /**
   * Show custom CC (for audio and YouTube)?
   * @returns {boolean} Should the player show custom CC?
   */
  get stickyMode() {
    return this.sticky && this.stickyCorner !== "none";
  }

  /**
   * gets initial timecode parameter
   * @readonly
   * @returns {array} array of cues
   */
  get t() {
    let t = this._getSeconds(
      this.anchor.params.t || this.anchor.params.start || `0s`
    );
    if (this.anchor && this.anchor.target === this) return t;
    if (this.videoData) return this.videoData.t || this.videoData.start;
  }

  /**
   * gets transcript cues that should be visible
   * @readonly
   * @returns {array} array of cues
   */
  get transcriptCues() {
    let cues = !this.cues ? [] : this.cues.slice();
    return cues.filter((cue) => cue.track === this.transcriptTrack);
  }

  /**
   * gets options for transcript picker
   *
   * @readonly
   * @memberof A11yMediaPlayer
   */
  get transcriptPicker() {
    let options = {};
    options[-1] = this._getLocal(this.localization, "transcript", "off");
    Object.keys(this.loadedTracks.textTracks || {}).forEach((key) => {
      options[key] =
        this.loadedTracks.textTracks[key].label ||
        this.loadedTracks.textTracks[key].language;
    });
    return options;
  }

  /**
   * `key` of selected textTrack based on `transcriptTrack` and `hide-transcript` values
   */
  get transcriptTrackKey() {
    return this.hideTranscript ? -1 : this._getTrackId(this.transcriptTrack);
  }

  get videoData() {
    if (this.youtubeId) {
      let videoData = this.youtubeId.split(/[\?\&]/),
        params = {};
      params.videoId = videoData[0];
      videoData.forEach((param, index) => {
        if (index > 0) {
          let data = param.split(/=/);
          params[data[0]] = this._getSeconds(data[1]);
        }
      });
      return params;
    }
  }
  get videoId() {
    if (this.videoData) return this.videoData.videoId;
  }

  /**
   * youtube embed element
   * @readonly
   * @returns {object} a11y-media-youtube element
   */
  get youtube() {
    return this.shadowRoot.querySelector("a11y-media-youtube") !== null
      ? this.shadowRoot.querySelector("a11y-media-youtube")
      : false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.__loadedTracks = this.getloadedTracks();
    this._handleMediaLoaded();
    this.__loadedTracks.addEventListener("loadedmetadata", (e) =>
      this._handleMediaLoaded(e)
    );
    this.__loadedTracks.addEventListener("timeupdate", (e) => {
      this._handleTimeUpdate(e);
    });
    this.__playerReady = true;
  }

  _setAttribute(attr, val) {
    if (!val) {
      this.removeAttribute(attr);
    } else {
      this.setAttribute(attr, val);
    }
  }

  /**
   * @param {map} changedProperties the properties that have changed
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "learningMode") {
        this.disableSeek = this[propName];
        this.hideTranscript = this[propName];
      }
      let change = (params) => params.includes(propName),
        mediaChange = (param) =>
          change(["__loadedTracks", "youtubeId", "media", param]),
        flexChange = change([
          "standAlone",
          "hideTranscript",
          "audioNoThumb",
          "stackedLayout",
          "__cues",
        ]),
        media = this.media ? this.media : this.__loadedTracks;

      if (propName === "id" && this.id === null)
        this.id = "a11y-media-player" + Date.now();

      if (change(["media", "muted"])) this._handleMuteChanged();
      if (change(["media", "volume"])) this.setVolume(this.volume);
      if (change(["media", "autoplay"]) && this.autoplay) this.play();

      /* updates captions */
      if (propName === "__captionsOption") this._captionsOptionChanged();
      if (change(["cc", "captionsTrack"])) this._captionsChanged();

      /* updates layout */
      if (flexChange) this._setAttribute("flex-layout", this.flexLayout);
      if (flexChange || propName === "responsiveSize")
        this._setAttribute("full-flex", this.fullFlex);
      if (change(["sticky", "sticky-corner", "__playing"]))
        this._setAttribute("sticky-mode", this.stickyMode && this.__playing);
      if (change(["height"])) {
        this.style.setProperty(
          "--a11y-media-player-height",
          this.height ? this.height : "unset"
        );
        this.style.setProperty(
          "--a11y-media-transcript-max-height",
          this.height ? "146px" : "unset"
        );
      }

      /* updates media */
      if (this.media !== null) {
        if (mediaChange("cc"))
          this._setAttribute("cc", this.cc, this.__loadedTracks);
        if (mediaChange("isYoutube") && this.__loadedTracks)
          this.__loadedTracks.hidden === this.isYoutube;
        if (mediaChange("mediaLang"))
          this._setAttribute("lang", this.mediaLang, media);
        if (mediaChange("loop")) this._setAttribute("loop", this.loop, media);
        if (mediaChange("playbackRate"))
          this._setAttribute("playbackRate", this.playbackRate, media);
        if (mediaChange("isYoutube"))
          this._setAttribute(
            "poster",
            !this.isYoutube ? this.thumbnailSrc : false,
            this.__loadedTracks
          );
        if (
          change(["isYoutube", "poster", "media", "audioOnly"]) &&
          this.poster &&
          !this.isYoutube &&
          !this.audioOnly &&
          !this.media.poster
        )
          this.media.poster = this.poster;
      }

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
    Object.keys(this.loadedTracks.textTracks).forEach((key) => {
      let showing =
        this.cc && this.loadedTracks.textTracks[key] === this.captionsTrack;
      this.loadedTracks.textTracks[key].mode = showing ? "showing" : "hidden";
      if (showing) ccNum = key;
    });
    this.__captionsOption = ccNum;
  }

  /**
   * updates track mode & `captionsTrack` when `__captionsOption` changes
   */
  _captionsOptionChanged() {
    this.cc = this.__captionsOption > -1;
    Object.keys(this.loadedTracks.textTracks).forEach((key) => {
      let showing = parseInt(key) == parseInt(this.__captionsOption);
      this.loadedTracks.textTracks[key].mode = showing ? "showing" : "hidden";
      if (showing) this.captionsTrack = this.loadedTracks.textTracks[key];
    });
  }

  /**
   * handles mute change
   */
  _handleMuteChanged() {
    this.media.muted = this.muted;
    /**
     * Fires when closed caption is toggled
     * @event mute-changed
     */
    window.dispatchEvent(
      new CustomEvent("mute-changed", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this,
      })
    );
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
          (key) =>
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
        detail: this,
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
        (key) =>
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
        detail: this,
      })
    );
  }

  /**
   * plays the media
   */
  play() {
    this.__playing = true;
    if (this.media && this.media.play) this.media.play();
    /**
     * Fires when media plays
     * @event play
     */
    window.dispatchEvent(
      new CustomEvent("play", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this,
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
        detail: this,
      })
    );
  }

  /**
   * pauses the media
   */
  pause() {
    this.__playing = false;
    if (this.media && this.media.pause) this.media.pause();
    /**
     * Fires when media pauses
     * @event pause
     */
    window.dispatchEvent(
      new CustomEvent("pause", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this,
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
        detail: this,
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
        detail: this,
      })
    );
  }

  /**
   * seeks media backward at a set increment
   * @param {float} the elepsed time, in seconds
   */
  rewind(amt) {
    amt = amt !== undefined ? amt : this.duration / 20;
    this.seek(this.currentTime - amt, 0);
    /**
     * Fires when media moves backward
     * @event backward
     */
    window.dispatchEvent(
      new CustomEvent("backward", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this,
      })
    );
  }

  /**
   * seeks media forward at a set increment
   * @param {float} the elepsed time, in seconds
   */
  forward(amt) {
    amt = amt !== undefined ? amt : this.duration / 20;
    this.seek(this.currentTime + amt);
    /**
     * Fires when media moves forward
     * @event forward
     */
    window.dispatchEvent(
      new CustomEvent("forward", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this,
      })
    );
  }

  /**
   * seeks to a specific time
   * @param {float} the time, in seconds, to seek
   */
  seek(time = 0) {
    if (this.mediaSeekable) {
      this.media.seek(Math.max(0, Math.min(time, this.duration)));
      this._handleTimeUpdate();
      /**
       * Fires when media seeks
       * @event seek
       */
      window.dispatchEvent(
        new CustomEvent("seek", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: this,
        })
      );
    }
  }

  /**
   * selects `captionsTrack` by key and adjusts `cc` accordingly
   */
  selectCaptionByKey(id) {
    id = parseInt(id);
    if (id > -1) this.captionsTrack = this.loadedTracks.textTracks[id];
    this.cc = id > -1;
  }

  /**
   * selects `transcriptTrack` by key and adjusts `hideTranscript` accordingly
   */
  selectTranscriptByKey(id) {
    id = parseInt(id);
    if (id > -1) this.transcriptTrack = this.loadedTracks.textTracks[id];
    this.hideTranscript = id < 0;
  }

  /**
   * media tag where sources and tracks can be found
   * @readonly
   */
  getloadedTracks() {
    let media = this.querySelector("audio,video"),
      crossorigin = media ? media.getAttribute("crossorigin") : undefined,
      primary = null,
      sourceVideo =
        this.source && !this.source && this.source.match(/webm|ogv|mov|mp4$/),
      sourcesVideo =
        (this.sources || []).filter((source) =>
          `${source.type || ""}${source.kind || ""}`.match(/video|mp4|webm|ogv/)
        ).length > 0,
      hasVideo = this.isYoutube || sourceVideo || sourcesVideo;

    if (media) {
      if (!crossorigin) media.setAttribute("crossorigin", this.crossorigin);
      media.removeAttribute("autoplay");
      media.removeAttribute("controls");
      media.setAttribute("preload", "metadata");
    }

    if (!this.youtubeId) {
      let iframeSrc =
          this.querySelector("iframe") && this.querySelector("iframe")
            ? this.querySelector("iframe").src
            : false,
        yt = iframeSrc
          ? iframeSrc.match(/youtube(-\w*)*.com/) ||
            iframeSrc.src.match(/youtu.be/)
          : false;
      if (yt && iframeSrc) {
        this.youtubeId = iframeSrc.replace(/.*\//g, "");
        hasVideo = true;
        this.querySelector("iframe").remove();
      }
    }

    if (!media) {
      primary = document.createElement(
        this.querySelectorAll('source[type*="audio"]').length > 0 || !hasVideo
          ? "audio"
          : "video"
      );
      if (!crossorigin) primary.setAttribute("crossorigin", this.crossorigin);
      primary.setAttribute("preload", "metadata");
      this.querySelectorAll("source,track").forEach((node) => {
        if (node.parentNode === this) primary.appendChild(node);
      });
      this.appendChild(primary);
    } else {
      primary = media;
    }
    this.audioOnly = primary.tagName === "AUDIO";
    primary.style.width = "100%";
    primary.style.maxWidth = "100%";

    /* handle deprecated tracks */
    (this.tracks || []).forEach((track) => {
      let node = document.createElement("track");
      Object.keys(track).forEach((key) => node.setAttribute(key, track[key]));
      primary.appendChild(node);
    });

    /* handle deprecated sources */
    (this.sources || []).forEach((source) => {
      let node = document.createElement("source");
      Object.keys(source).forEach((key) => node.setAttribute(key, source[key]));
      primary.appendChild(node);
    });
    /* provides a seek function for primary media */
    primary.seek = (time) => (primary.currentTime = time);
    this._addSourcesAndTracks(primary, primary);
    return primary;
  }

  /**
   * selects a specific transcript track
   * @param {track} track text track
   */
  _getTrack(track) {
    if (!track) {
      let defaultTracks = this.loadedTracks.textTracks.filter(
        (track) => track.default === true
      );
      return defaultTracks
        ? defaultTracks[0].track
        : this.loadedTracks.textTracks[0].track;
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
        detail: this,
      })
    );
  }

  /**
   * set volume of media
   * @param {integer} the volume level from 0-100
   */
  setVolume(value = 70) {
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
        detail: this,
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
        detail: this,
      })
    );
  }
  /**
   * element to make fullscreen, can be overidden
   *
   * @readonly
   */
  get fullscreenTarget() {
    return this.shadowRoot && this.shadowRoot.querySelector("#player-section")
      ? this.shadowRoot.querySelector("#player-section")
      : this;
  }

  /**
   * toggles fullscreen
   * @param {boolean} Toggle fullscreen on? `true` is on, `false` is off, and `null` toggles based on current state.
   */
  toggleFullscreen(mode) {
    super.toggleFullscreen(mode);

    /**
     * Fires when fullscreen is toggled
     * @event fullscreen-toggle
     */
    window.dispatchEvent(
      new CustomEvent("fullscreen-toggle", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this,
      })
    );
  }

  /**
   * toggles looping
   * @param {boolean} Toggle looping on? `true` is on, `false` is off, and `null` toggles based on current state.
   */
  toggleLoop(mode) {
    this.loop = mode === undefined ? !this.loop : mode;
    this.media.loop = mode === true;

    /**
     * Fires when looping is toggled
     * @event loop-toggle
     */
    window.dispatchEvent(
      new CustomEvent("loop-toggle", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this,
      })
    );
  }

  /**
   * toggles play
   * @param {boolean} Toggle play/pause? `true` is on, `false` is off, and `null` toggles based on current state.
   */
  togglePlay() {
    if (this.__playing) {
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
        detail: this,
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
        detail: this,
      })
    );
  }
  toggleSettings(mode) {
    mode = mode === undefined ? !this.__settingsOpen : mode;
    this.__settingsOpen = mode;
    /**
     * Fires when video's settings menu is toggled
     * @event settings-toggled
     */
    this.dispatchEvent(
      new CustomEvent("settings-toggled", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this,
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
     * Fires when video's sticky behavior is toggled
     * @event player-sticky
     */
    this.dispatchEvent(
      new CustomEvent("player-sticky", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this,
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
        detail: this,
      })
    );
  }

  /**
   * loads a track's cue metadata
   * @param {object} HTML audio or video object
   */
  _addSourcesAndTracks(media) {
    media.style.width = "100%";
    media.style.maxWidth = "100%";
    Object.keys(media.textTracks).forEach((track) =>
      this._onAddTrack(media.textTracks[track])
    );
    media.textTracks.onremovetrack = (e) => this._onRemoveTrack(e.track);
    media.textTracks.onaddtrack = (e) => this._onAddTrack(e.track);

    let d = media.querySelector("track[default]")
        ? media.querySelector("track[default]")
        : media.querySelector("track"),
      defaultTrack =
        Object.keys(media.textTracks).find((key) => {
          return (
            d.label === media.textTracks[key].label &&
            d.kind === media.textTracks[key].kind &&
            d.srclang === media.textTracks[key].scrlang
          );
        }) || 0;
    this.captionsTrack = media.textTracks[defaultTrack];
    this.transcriptTrack = this.captionsTrack;
    this._handleTimeUpdate();
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
  }

  /**
   * handles copying the share link
   */
  _handleCopyLink() {
    let el = document.createElement("textarea");
    this.pause();
    el.value = this.shareLink;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");

    document.body.removeChild(el);
    SimpleToastStore.showSimpleToast({
      detail: {
        duration: 3000,
        text: `Copied to clipboard: ${this.shareLink}`,
      },
    });
  }

  /**
   * handles the seek function when a transcript cue is activated
   *
   * @param {event} e seek event
   */
  _handleCueSeek(cue) {
    if (!this.standAlone) {
      this.seek(cue.startTime);
    }
  }

  /**
   * handles media metadata when media is loaded
   */
  _handleMediaLoaded(e) {
    this._handleTimeUpdate();
    if (!this.youtubeId && this.anchor.target === this) {
      this.seek(
        this._getSeconds(
          this.anchor.params.t || this.anchor.params.start || `0s`
        )
      );
    }
  }

  /**
   * sets search the simple-search element
   * @param {event} e searchbar event
   */
  _handleSearchAdded(e) {
    this.search = e.detail;
  }

  /**
   * handles speed slider change thhat sets playback rate
   * @param {event} e slider event
   */
  _handleSpeedChanged(e) {
    var target = normalizeEventPath(e)[0];
    this.setPlaybackRate(target.value);
  }

  /**
   * handles duration slider dragging with a mouse
   * @param {event} e slider start event
   */
  _handleSliderDragging(e) {
    let slider = this.shadowRoot
      ? this.shadowRoot.querySelector("#slider")
      : false;
    if (slider && !slider.disabled && slider.dragging) {
      if (this.__playing && slider.dragging) {
        let startDrag = setInterval(() => {
          if (!slider.dragging) {
            this.play();
            clearInterval(startDrag);
          }
        });
        this.pause();
      }
    }
  }

  /**
   * handles duration slider dragging with a mouse
   * @param {event} e slider start event
   */
  _handleSliderChanged(e) {
    let slider = this.shadowRoot
      ? this.shadowRoot.querySelector("#slider")
      : false;
    if (!this.playing || slider.immediateValue == this.__currentTime) {
      this.seek(slider.immediateValue);
    }
  }

  /**
   * handles time updates
   */
  _handleTimeUpdate() {
    if (!this.__wait) {
      /* update current time with media's current time property */
      this.__currentTime =
        this.media && this.media.currentTime && this.media.currentTime > 0
          ? this.media.currentTime
          : 0;
      this.__wait = true;
      setTimeout(() => {
        this.__wait = false;
      }, 1000);
    }
  }

  /**
   * gets `key` of given track
   *
   * @param {object} track textTrack
   * @returns {number} key
   */
  _getTrackId(track) {
    return this.loadedTracks
      ? Object.keys(this.loadedTracks.textTracks).find(
          (key) => this.loadedTracks.textTracks[key] === track
        ) || -1
      : -1;
  }

  /**
   * handles volume slider change
   * @param {event} e volume change event
   */
  _handleVolumeChanged(e) {
    var target = normalizeEventPath(e)[0];
    this.volume = target.value;
  }

  /**
   * adds a track's cues to cues array
   * @param {object} textTrack
   */
  _onAddTrack(track) {
    if (this.captionsTrack === null) this.captionsTrack = track;
    if (track) track.mode = "hidden";
    let loadCueData = setInterval(() => {
      if (track.cues && track.cues.length > 0) {
        clearInterval(loadCueData);
        let cues = Object.keys(track.cues).map((key) => track.cues[key]);
        this._onRemoveTrack(track); //prevents duplicate tracks
        this.__cues = this.cues.concat(cues).sort((a, b) => {
          let start = a.startTime - b.startTime,
            end = a.endTime - b.endTime;
          return start !== 0 ? start : end !== 0 ? end : a.track - b.track;
        });
      }
    });
  }

  /**
   * removes a track's cues from cues array
   * @param {object} textTrack
   */
  _onRemoveTrack(track) {
    if (this.loadedTracks && this.loadedTracks.textTracks)
      Object.keys(this.loadedTracks.textTracks).filter(
        (textTrack) => this.loadedTracks.textTracks[textTrack] !== track
      );
    this.__cues = this.cues
      ? this.cues.filter((cue) => cue.track !== track)
      : [];
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.style.setProperty(
      "--a11y-media-transcript-max-height",
      this.height ? "146px" : "unset"
    );
    setTimeout(() => {
      window.ResponsiveUtility.requestAvailability();

      /**
       * Fires player needs the size of parent container to add responsive styling
       * @event responsive-element
       */
      window.dispatchEvent(
        new CustomEvent("responsive-element", {
          detail: {
            element: this,
            attribute: "responsive-size",
            relativeToParent: true,
            sm: 400,
            md: 700,
            lg: 1000,
            xl: 1500,
          },
        })
      );

      window.A11yMediaStateManager.requestAvailability();

      /**
       * Fires when a new player is ready for a11y-media-state-manager
       * @event a11y-player
       */
      window.dispatchEvent(
        new CustomEvent("a11y-player", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: this,
        })
      );
    }, 1000);
  }
  /**
   * on a cue.onenter event scrolls the first active cue to position
   * @param {event} e onenter event
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
   * handles transcript scroll toggle
   * @param {event} e scroll event
   */
  _transcriptScroll(e) {
    this.disableScroll = !this.disableScroll;
  }

  /**
   * converts time in millesconds to HH:MM:SS
   *
   * @param {float} the progress, in seconds
   * @param {float} the duration, in seconds
   * @returns {string} a human-readable string of progress/duration in HH:MM:SS
   *
   */
  _getHHMMSS(val, max) {
    val = parseFloat(val);
    max = max === undefined ? val : parseFloat(max);
    let a = (val) => {
        return val < 10 ? `0${val}` : val;
      },
      b = (val, i, none) => {
        return max >= i ? a(Math.floor(val / i)) + ":" : none;
      },
      c = (val) => {
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
      this.localizationDefaults !== undefined &&
      this.localizationDefaults[key] !== undefined &&
      this.localizationDefaults[key][subkey] !== undefined
    ) {
      local = this.localizationDefaults[key][subkey];
    }
    return local;
  }
}
window.customElements.define(A11yMediaPlayer.tag, A11yMediaPlayer);
export { A11yMediaPlayer };

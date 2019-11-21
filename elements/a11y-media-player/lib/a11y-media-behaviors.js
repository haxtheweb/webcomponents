/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/responsive-utility/responsive-utility.js";

/**
 * `a11y-media-behaviors`
 * `A set of properties common to player and transcript a11y-media components.`
 *
 * @customElement
 */
class A11yMediaBehaviors extends SimpleColors {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "a11y-media-behaviors";
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      /**
       * Is this an audio file?
       */
      audioOnly: {
        attribute: "audio-only",
        type: Boolean,
        reflect: true
      },

      /**
       * autoplay is an option,
       * but generally not recommended for a11y
       */
      autoplay: {
        attribute: "autoplay",
        type: Boolean
      },

      /**
       * show closed captions
       */
      cc: {
        attribute: "cc",
        type: Boolean
      },

      /**
       * disable transcript print button
       */
      disablePrintButton: {
        attribute: "disable-print-button",
        type: Boolean
      },

      /**
       * disable transcript search feature
       */
      disableSearch: {
        attribute: "disable-search",
        type: Boolean
      },

      /**
       * disable autoscrolling as transcript plays
       */
      disableScroll: {
        attribute: "disable-scroll",
        type: Boolean
      },

      /**
       * disables seeking
       */
      disableSeek: {
        attribute: "disable-seek",
        type: Boolean
      },

      /**
       * Does the player have an interactive transcript?
       */
      hasTranscript: {
        attribute: "has-transcript",
        type: Boolean
      },

      /**
       * The height of the media player.
       */
      height: {
        attribute: "height",
        type: String
      },

      /**
       * is YouTube?
       */
      isYoutube: {
        attribute: "is-youtube",
        type: Boolean
      },

      /**
       * Language
       */
      lang: {
        attribute: "lang",
        type: String
      },

      /**
       * has link button
       */
      linkable: {
        attribute: "linkable",
        type: Boolean
      },

      /**
       * custom localization settings
       */
      localization: {
        attribute: "localization",
        type: Object
      },

      /**
       * Loop the video?
       */
      loop: {
        attribute: "loop",
        type: Boolean
      },

      /**
       * Dash.js manifest source?
       */
      manifest: {
        attribute: "manifest",
        type: String
      },

      /**
       * the media to be manipulated
       */
      media: {
        attribute: "media",
        type: Object
      },

      /**
       * optional title of media (shows when printed)
       */
      mediaTitle: {
        attribute: "media-title",
        type: String
      },

      /**
       * Is audio muted?
       */
      muted: {
        attribute: "muted",
        type: Boolean
      },

      /**
       * Playback rate where 1 is normal speed, 0.5 is half-speed, and 2 is double speed
       */
      playbackRate: {
        attribute: "playback-rate",
        type: Number
      },

      /**
       * Is media playing?
       */
      playing: {
        attribute: "playing",
        type: Boolean
      },

      /**
       * play/pause button
       */
      playPause: {
        attribute: "play-pause",
        type: Object
      },

      /**
       * Preload the "sources": auto, metadata (default), or none.
       */
      preload: {
        attribute: "preload",
        type: String
      },

      /**
       * the search tool for the transcript
       */
      search: {
        attribute: "search",
        type: Object
      },

      /**
       * the selected track
       */
      selectedTrack: {
        attribute: "selected-track",
        type: Object
      },

      /**
       * id of the selected track
       */
      selectedTrackId: {
        attribute: "selected-track-id",
        type: Number
      },

      /**
       * Is stand-alone player (without transcript)?
       */
      standAlone: {
        attribute: "stand-alone",
        type: Boolean,
        reflect: true
      },

      /**
       * status
       */
      status: {
        attribute: "status",
        type: String
      },

      /**
       * target of the controls
       */
      target: {
        attribute: "target",
        type: Object
      },
      /**
       * array of tracks and cues
       */
      tracks: {
        attribute: "tracks",
        type: Array
      },

      /**
       * Range is 0 to 100. Default should not be loud enough to overpower screen readers.
       */
      volume: {
        attribute: "volume",
        type: Number
      },

      /**
       * The width of the media player.
       */
      width: {
        attribute: "width",
        type: String
      },

      /**
       * the id for the video
       */
      youtubeId: {
        attribute: "youtube-id",
        type: String
      },
      /**
       * the YouTube player object
       */
      youtube: {
        attribute: "youtube",
        type: Object
      },

      /**
       * default localization settings
       */
      __localizationDefaults: {
        type: Object
      }
    };
  }

  constructor(){
    super();
    this.audioOnly = false;
    this.autoplay = false;
    this.cc = false;
    this.disablePrintButton = false;
    this.disableSearch = false;
    this.disableScroll = false;
    this.disableSeek = false;
    this.hasTranscript = false;
    this.height = null;
    this.lang = "en";
    this.linkable = false;
    this.localization = {};
    /**
     * TODO
     */
    this.__localizationDefaults = {
      "audio":{ 
        "label":"Audio",
        "notSupported": "HTML5 video is not supported." 
      },
      "autoScroll":{
        "label":"Scroll transcript with video.",
        "icon":"swap-vert"
      },
      "captions":{
        "label":"Closed Captions",
        "icon":"av:closed-caption",
        "off":"Off"
      },
      "download":{
        "label":"Download the transcript.",
        "icon":"file-download"
      },
      "forward":{
        "label":"Forward",
        "icon":"av:fast-forward"
      },
      "fullscreen":{
        "label":"Fullscreen",
        "icon":"fullscreen"
      },
      "copyLink":{
        "label":"Copy Media Link",
        "icon":"link"
      },
      "closeLink":{
        "label":"Close",
        "icon":"close"
      },
      "loading":{
        "label":"Loading..."
      },
      "loop":{
        "label":"Loop Playback"
      },
      "mute":{
        "label":"Mute",
        "icon":"av:volume-up"
      },
      "nextResult":{
        "label":"Next",
        "icon":"arrow-forward"
      },
      "pause":{
        "label":"Pause",
        "icon":"av:pause"
      },
      "play":{
        "label":"Play",
        "icon":"av:play-arrow"
      },
      "prevResult":{
        "label":"Previous",
        "icon":"arrow-back"
      },
      "print":{
        "label":"Print the transcript.",
        "icon":"print"
      },
      "restart":{
        "label":"Restart",
        "icon":"av:replay"
      },
      "rewind":{
        "label":"Backward",
        "icon":"av:fast-rewind"
      },
      "search":{
        "label":"Search the transcript.",
        "icon":"search"
      },
      "seekSlider":{
        "label":"Seek Slider"
      },
      "settings":{
        "label":"Settings",
        "icon":"settings"
      },
      "speed":{
        "label":"Speed %"
      },
      "transcript":{
        "label":"Transcript",
        "icon":"description",
        "loading":"Loading the transcript(s)...",
        "skip":"Skip to the transcript."
      },
      "unmute":{
        "label":"Unmute",
        "icon":"av:volume-off"
      },
      "video":{
        "label":"Video",
        "notSupported": "HTML5 video is not supported."
      },
      "volume":{
        "label":"Volume"
      },
      "youTubeLoading":{
        "label":"Ready."
      },
      "youTubeTranscript":{
        "label":"Transcript will load once media plays."
      }
    };
    this.loop = false;
    this.manifest = null;
    this.media = null;
    this.mediaTitle = "";
    this.muted = false;
    this.playbackRate = 1;
    this.playing = false;
    this.preload = "metadata";
    this.search = null;
    this.selectedTrack = null;
    this.selectedTrackId = null;
    this.standAlone = false;
    this.status = "loading...";
    this.target = null;
    this.tracks = null;
    this.volume = 70;
    this.width = null;
    this.youtubeId = null;
    this.youtube= {};
    this.isYoutube = this._hasAttribute(this.youtubeId);
    this.seekSlider = {
      "label": this._getLocal("seekSlider", "label")
    }
    this.playPause = {
      "label": this._getLocal("play", "label"),
      "icon": this._getLocal("play", "icon"),
      "action": "play"
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
    max = max === undefined ? val : max;
    let a = val => {
        return val < 10 ? "0" + val : val;
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
  _getLocal(key, subkey) {
    let local = "",
      localization = this.localization;
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

  /**
   * handles the print transcript button
   */
  _handlePrintClick(e) {
    this.dispatchEvent(new CustomEvent("print-transcript", { detail: this }));
  }

  /**
   * handles the print transcript button
   */
  _handleDownloadClick(e) {
    this.dispatchEvent(
      new CustomEvent("download-transcript", { detail: this })
    );
  }

  /**
   * handles transcript printing
   */
  _handleDownload(e) {
    let root = this;
    root.dispatchEvent(
      new CustomEvent("downloading-transcript", { detail: root })
    );
    root.shadowRoot.querySelector("#transcript").download(root.mediaTitle);
  }

  /**
   * handles transcript printing
   */
  _handlePrinting(e) {
    let root = this;
    root.dispatchEvent(
      new CustomEvent("printing-transcript", { detail: root })
    );
    root.shadowRoot.querySelector("#transcript").print(root.mediaTitle);
  }
}
window.customElements.define(A11yMediaBehaviors.tag, A11yMediaBehaviors);
export { A11yMediaBehaviors };
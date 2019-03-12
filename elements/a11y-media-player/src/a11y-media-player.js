/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { A11yMediaBehaviors } from "./lib/a11y-media-behaviors.js";
import "@polymer/paper-slider/paper-slider.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/av-icons.js";
import "./lib/a11y-media-controls.js";
import "./lib/a11y-media-html5.js";
import "./lib/a11y-media-play-button.js";
import "./lib/a11y-media-transcript.js";
import "./lib/a11y-media-transcript-controls.js";
import "./lib/a11y-media-state-manager.js";
import "./lib/a11y-media-youtube.js";

export { A11yMediaPlayer };
/**
 * `a11y-media-player`
 * An accessible video player
 *
 * @microcopy - the mental model for this element
 * ```
<a11y-media-player
  accent-color$="[[accentColor]]"              // Optional accent color for controls,
                                               // using the following materialize colors:
                                               // red, pink, purple, deep-purple, indigo, blue,
                                               // light blue, cyan, teal, green, light green, lime,
                                              // yellow, amber, orange, deep-orange, and brown.
                                              // Default is null.
  audio-only$="[[audioOnly]]"                 // Is media audio only?
  autoplay$="[[autoplay]]"                    // Is player set to autoplay (not recommended for a11y)?
  cc$="[[cc]]"                                // Are closed captions toggled?
  custom-microcopy$="[[customMicrocopy]]"  // Optional customization or text and icons
  dark$="[[dark]]"  // Is the color scheme dark? Default is light.
  dark-transcript$="[[darkTranscript]]"  // Use dark theme on transcript? Default is false, even when player is dark.
  disable-fullscreen$="[[disableFullscreen]]" // Is full screen mode disabled?
  disable-interactive$="[[disableInteractive]]" // Disable interactive cues?
  fullscreen$="[[fullscreen]]"  // Is full screen mode toggled on?
  height$="[[height]]"  // The height of player
  hide-timestamps$="[[hideTimestamps]]"  // Hide cue timestamps?
  lang$="[[lang]]"  // The language of the media
  loop$="[[loop]]"  // Is video on a loop?
  muted$="[[muted]]"  // Is video muted?
  media-title$="[[mediaTitle]]"  // The title of the media
  playback-rate$="[[playbackRate]]"  // The speed that video plays, default is 1 (for 100%)
  sticky-corner$="[[stickyCorner]]"  // When user scrolls a playing video off-screen,
  which corner will it stick to? Values are:
  top-right (default), top-left, bottom-left, bottom-right,
  and none (to turn sticky off)
  thumbnail-src$="[[thumbnailSrc]]"  // Optional thumbanil/cover image url
  volume$="[[volume]]">  // The initial volume of the video

  <!--video sources and tracks-->
  <source src="/path/to/video.mp4" type="video/mp4">
  <source src="/path/to/video.webm" type="video/webm">
  <track label="English" kind="subtitles" srclang="en" src="path/to/subtitles/en.vtt" default>
  <track label="Deutsch" kind="subtitles" srclang="de" src="path/to/subtitles/de.vtt">
  <track label="Español" kind="subtitles" srclang="es" src="path/to/subtitles/es.vtt">

</a11y-media-player>```
 *
 * Intermediate customization of player:
 * ```
--a11y-media-text-color: text color, default is --simple-colors-default-theme-grey-11
--a11y-media-bg-color: background color, default is --simple-colors-default-theme-grey-2
--a11y-media-hover-color: text color on hover, default is --simple-colors-default-theme-grey-12
--a11y-media-hover-bg-color: background color, default is --simple-colors-default-theme-grey-2
--a11y-media-accent-color: an accent color, default is --simple-colors-default-theme-accent-9
--a11y-media-faded-accent-color: a subtler version of accent color, default is --simple-colors-default-theme-accent-8
--a11y-media-outline-color: border-color of group, default is --a11y-media-bg-color```
 *
 * Intermediate customization of transcript:
 * ```
 --a11y-media-transcript-color: transcript color, default is --simple-colors-default-theme-grey-12
--a11y-media-transcript-bg-color: transcript background color, default is --simple-colors-default-theme-grey-1
--a11y-media-transcript-active-cue-color: transcript active cue color, default is --simple-colors-default-theme-grey-12
--a11y-media-transcript-active-cue-bg-color: transcript active cue background color, default is --simple-colors-default-theme-grey-1
--a11y-media-transcript-focused-cue-color: transcript focused cue color, default is --simple-colors-default-theme-grey-12
--a11y-media-transcript-focused-cue-br-color: transcript focused cue background color, default is --simple-colors-default-theme-accent-1
--a11y-media-transcript-match-color: transcript match color, default is --simple-colors-default-theme-accent-1
--a11y-media-transcript-match-bg-color: transcript match background color, default is --simple-colors-default-theme-grey-12```
 *
 * Advanced styles for settings menu:
 * ```
--a11y-media-settings-menu-color: settings menu text color, default is --a11y-media-text-color
--a11y-media-settings-menu-bg-color: settings menu background color, default is --a11y-media-bg-color
--a11y-media-settings-menu-hover-color: settings menu text color on hover, default is --a11y-media-hover-color
--a11y-media-settings-menu-hover-bg-color: settings menu background color on hover, default is --a11y-media-hover-bg-color```
 *
 * Advanced styles for buttons:
 * ```
--a11y-media-button-color: button text color, default is --a11y-media-text-color
--a11y-media-button-bg-color: button background color, default is --a11y-media-bg-color
--a11y-media-button-hover-color: button text color when focused/hovered, default is --a11y-media-hover-color
--a11y-media-button-hover-bg-color: button background color when focused/hovered, default is --a11y-media-bg-color
--a11y-media-button-toggle-color: button text color when tggled on, default is --a11y-media-faded-accent-color```
 *
 * Advanced styles for toggles:
 * ```
--paper-toggle-button-unchecked-bar-color: color of toggle button when off, default is --a11y-media-color
--paper-toggle-button-unchecked-button-color: color of toggle button when off, default is --a11y-media-color
--paper-toggle-button-checked-bar-color: color of toggle button when on, default is --a11y-media-accent-color
--paper-toggle-button-checked-button-color: color of toggle button when on, default is --a11y-media-accent-color```
 *
 * Advanced styles for sliders:
 * ```
--a11y-media-slider-primary-color: primary slider color, default is --a11y-media-accent-color
--a11y-media-slider-secondary-color: slider buffer color, default is --a11y-media-faded-accent-color
--a11y-media-slider-pin-color: color of the pin that shows slider value, default is --a11y-media-faded-bg-color
--a11y-media-slider-pin-start-color: color of the pin at start default is --a11y-media-faded-bg-color
--a11y-media-slider-pin-end-color: color of the pin at end, default is --a11y-media-faded-bg-color
--a11y-media-slider-knob-color: slider knob color, default is --a11y-media-accent-color
--a11y-media-slider-knob-start-color: slider knob color at start, default is --a11y-media-accent-color
--a11y-media-slider-knob-end-color: slider knob color at end, default is --a11y-media-accent-color
--a11y-media-slider-knob-border-color: slider knob bordercolor, default is --a11y-media-accent-color
--a11y-media-slider-knob-start-border-color: slider knob border color at start, default is --a11y-media-accent-color
--a11y-media-slider-knob-end-border-color: slider knob border color at end, default is --a11y-media-accent-color```
 *
 * @extends A11yMediaBehaviors
 * @polymer
 * @customElement
 * @demo demo/index.html video demo
 * @demo demo/audio.html audio demo
 * @demo demo/youtube.html YouTube demo
 *
 */
class A11yMediaPlayer extends A11yMediaBehaviors {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "a11y-media-player";
  }

  //get player-specific behaviors
  static get behaviors() {
    return [A11yMediaBehaviors];
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    let root = this;
    root.__playerAttached = true;
    window.A11yMediaStateManager.requestAvailability();
    root._addResponsiveUtility();
    window.dispatchEvent(new CustomEvent("a11y-player", { detail: root }));
    if (root.isYoutube) {
      root._youTubeRequest();
    }
  }

  /**
   * sets initial values and loads video or youtube iframe
   */
  ready() {
    super.ready();
    let root = this,
      aspect = 16 / 9,
      tracks = new Array(),
      tdata = new Array(),
      selected = 0;
    root.__playerReady = true;
    root.target = root.shadowRoot.querySelector("#transcript");
    root.__status = root._getLocal("loading", "label");
    root.__slider = root.$.slider;
    root.__volume = root.muted ? 0 : Math.max(this.volume, 10);
    root.__resumePlaying = false;
    root.__showFullscreen =
      !root.disableFullscreen &&
      window.A11yMediaStateManager.screenfullLoaded &&
      screenfull.enabled;
    root.__duration = 0;
    root.$.controls.setStatus(root.__status);
    root.width = root.width !== null ? root.width : "100%";
    root.style.maxWidth = root.width !== null ? root.width : "100%";
    root._setPlayerHeight(aspect);
    if (root.isYoutube) {
      root._youTubeRequest();
      document.addEventListener("timeupdate", e => {
        if (e.detail === root.media) root._handleTimeUpdate(e);
      });
    } else {
      root.media = root.$.html5;
      root.media.media.addEventListener("timeupdate", e => {
        root._handleTimeUpdate(e);
      });
      root._addSourcesAndTracks();
    }
    root.$.transcript.setMedia(root.$.innerplayer);

    // handles fullscreen
    if (root.__showFullscreen) {
      if (window.A11yMediaStateManager.screenfullLoaded)
        screenfull.on("change", () => {
          root.fullscreen = screenfull.isFullscreen;
        });
    }
    root.$.slider.addEventListener("mousedown", e => {
      root._handleSliderStart();
    });
    root.$.slider.addEventListener("mouseup", e => {
      root._handleSliderStop();
    });
    root.$.slider.addEventListener("keydown", e => {
      root._handleSliderStart();
    });
    root.$.slider.addEventListener("keyup", e => {
      root._handleSliderStop();
    });
    root.$.slider.addEventListener("blur", e => {
      root._handleSliderStop();
    });
  }

  /**
   * plays the media
   */
  play() {
    let root = this,
      stopped = !(root.__playing === true);
    root.__playing = true;
    root.media.play();
    window.dispatchEvent(
      new CustomEvent("a11y-player-playing", { detail: root })
    );
  }

  /**
   * pauses the media
   */
  pause() {
    let root = this;
    root.__playing = false;
    root.media.pause();
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
    this.$.html5.selectTrack(index);
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
    this.$.html5.setCC(this.cc);
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
    if (this.$.transcript !== undefined && this.$.transcript !== null) {
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
        for (let key in arr[i]) {
          el.setAttribute(key, arr[i][key]);
        }
        root.$.html5.media.appendChild(el);
      }
    }
  }

  /**
   * sets the height of the player
   * @param {Number} the aspect ratio of the media or its poster thumbnail
   */
  _setPlayerHeight(aspect) {
    let root = this;
    if (root.audioOnly && root.thumbnailSrc === null && root.height === null) {
      root.$.player.style.height = "60px";
    } else if (root.height === null) {
      root.$.player.style.paddingTop = 100 / aspect + "%";
      root.$.innerplayer.style.maxWidth =
        "calc(" + aspect * 100 + "vh - " + aspect * 80 + "px)";
    } else {
      root.$.outerplayer.style.height = root.height;
    }
  }

  /**
   * gets media caption
   *
   * @param {boolean} Is the player set to audio-only?
   * @param {string} the text that indicates this player is audio-only
   * @param {string} the title of the media
   * @returns {string} the media caption
   */
  _getMediaCaption(audioOnly, localization, mediaTitle) {
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
   * @param {string} the text that indicates this player is audio-only
   * @param {string} the text that indicates this player is for video
   * @param {string} the title of the media
   * @returns {string} the media caption when the page is printed
   */
  _getPrintCaption(audioOnly, localization, mediaTitle) {
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
      : null;
  }

  /**
   * loads a track's cue metadata
   */
  _addSourcesAndTracks() {
    let root = this,
      counter = 0;
    root.querySelectorAll("source,track").forEach(node => {
      root.$.html5.media.appendChild(node);
    });
    root._appendToPlayer(root.tracks, "track");
    root._appendToPlayer(root.sources, "source");
    root.$.html5.media.textTracks.onaddtrack = e => {
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
  _getFullscreenButton(disableFullscreen, audioNoThumb) {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) ||
      disableFullscreen ||
      audioNoThumb
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
   * loads a track's cue metadata
   */
  _getTrackData(track, id) {
    let root = this,
      selected = track.default === true || root.__selectedTrack === undefined,
      loadCueData;
    if (selected) root.selectTrack(id);
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
            start: root._getHHMMSS(
              track.cues[key].startTime,
              root.media.duration
            ),
            end: root._getHHMMSS(track.cues[key].endTime, root.media.duration),
            text: track.cues[key].text
          };
        });

        if (root.__tracks === undefined) root.__tracks = [];
        root.push("__tracks", {
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
        root.$.controls.setTracks(root.__tracks);
        root.$.transcript.setTracks(root.__tracks);
        root.push("__tracks");
        track.oncuechange = e => {
          root.$.transcript.setActiveCues(
            Object.keys(e.currentTarget.activeCues).map(key => {
              return e.currentTarget.activeCues[key].id;
            })
          );
        };
      }
    }, 1);
  }

  /**
   * handles the seek function when a transcript cue is activated
   */
  _handleCueSeek(e) {
    let root = this;
    if (
      !root.standAlone &&
      root.$.transcript !== undefined &&
      root.$.transcript !== null
    ) {
      root.__resumePlaying = root.__playing;
      root.seek(e.detail);
    }
  }

  /**
   * handles media metadata when media is loaded
   */
  _handleMediaLoaded(e) {
    let root = this,
      aspect = root.media.aspectRatio;
    root._setPlayerHeight(aspect);
    root.$.playbutton.removeAttribute("disabled");

    // gets and converts video duration
    root._setElapsedTime();
    root._getTrackData(root.$.html5.media);
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
    let root = this;
    root.dispatchEvent(
      new CustomEvent("printing-transcript", { detail: root })
    );
    root.$.transcript.print(root.mediaTitle);
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
    this.seek(this.$.slider.immediateValue);
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
    let root = this;
    //if play exceeds clip length, stop
    if (root.isYoutube && root.media.duration !== root.media.getDuration()) {
      root.__duration = root.media.duration = root.media.getDuration();
      root.disableSeek = false;
      if (root.media.seekable !== undefined && root.media.seekable.length > 0) {
        root.$.slider.min = root.media.seekable.start(0);
      }
      root._addSourcesAndTracks();
    }
    if (
      root.media.seekable !== undefined &&
      root.media.seekable.length > 0 &&
      root.media.seekable.end(0) <= root.media.getCurrentTime()
    ) {
      root.stop();
      root.__playing = false;
    }
    //prevent slider and cue updates until finished seeking
    root._updateCustomTracks();
    root._setElapsedTime();
  }

  /**
   * handles transcript scroll toggle
   */
  _handleTranscriptScrollToggle(e) {
    this.disableScroll = !this.disableScroll;
  }

  /**
   * Does the player have custom CC tracks?
   *
   * @param {boolean} Is the media from YouTube?
   * @param {boolean} Is the media audio only?
   * @param {boolean} Does the media have CC tracks?
   * @returns {boolean} Does the player have custom CC?
   */
  _hasCustomCaptions(isYoutube, audioOnly, hasCaptions) {
    console.log("_showCustomCaptions", this, isYoutube, audioOnly, hasCaptions);
    return (isYoutube || audioOnly) && hasCaptions;
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
      root.rewind();
    } else if (action === "captions") {
      root.toggleCC();
    } else if (action === "transcript" || action === "transcript-toggle") {
      root.toggleTranscript();
    } else if (e.detail.id === "tracks") {
      if (e.detail.value === "") {
        root.toggleCC(false);
      } else {
        root.toggleCC(true);
        root.selectTrack(e.detail.value);
      }
    } else if (action === "forward") {
      root.forward();
    } else if (
      action === "fullscreen" &&
      window.A11yMediaStateManager.screenfullLoaded
    ) {
      root.toggleTranscript(root.fullscreen);
      screenfull.toggle(root.$.outerplayer);
    } else if (action === "loop") {
      root.toggleLoop();
    } else if (action === "mute" || action === "unmute") {
      root.toggleMute();
    } else if (action === "pause") {
      root.pause();
    } else if (action === "play") {
      root.play();
    } else if (action === "restart") {
      root.seek(0);
      root.play();
    } else if (action === "speed") {
      root.setPlaybackRate(e.detail.value);
    } else if (action === "volume") {
      root.setVolume(e.detail.value);
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
          ? this.$.slider.immediateValue
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
    this.$.controls.setStatus(this.__status);
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
    root.disableSeek = true;
    if (root.__playerAttached && root.__playerReady) {
      let ytInit = () => {
          // once metadata is ready on video set it on the media player
          // initialize the YouTube player
          root.media = ytUtil.initYoutubePlayer({
            width: "100%",
            height: "100%",
            videoId: root.youtubeId
          });
          root._addSourcesAndTracks();
          root.__status = root._getLocal("youTubeLoading", "label");
          root.$.controls.setStatus(root.__status);
          // move the YouTube iframe to the media player's YouTube container
          root.$.youtube.appendChild(root.media.a);
          root.__ytAppended = true;
          root._updateCustomTracks();
        },
        checkApi = e => {
          if (ytUtil.apiReady) {
            document.removeEventListener("youtube-api-ready", checkApi);
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
        document.addEventListener("youtube-api-ready", checkApi);
      }
    }
  }

  /**
   * updates custom tracks for youTube
   */
  _updateCustomTracks() {
    if (this._hasCustomCaptions(this.isYoutube, this.audioOnly, this.tracks)) {
      let root = this,
        track = root.tracks[this.$.transcript.selectedTranscript],
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
            track.cues[i].seek < root.__elapsed &&
            track.cues[i].seekEnd > root.__elapsed
          ) {
            active.push(track.cues[i].order);
            caption = caption === "" ? track.cues[i].text : caption;
          }
        }
        root.$.customcctxt.innerText = caption;
        root.$.transcript.setActiveCues(active);
      }
    }
  }
}
/**
 * life cycle, element is removed from the DOM
 */
//disconnectedCallback() {}
window.customElements.define(A11yMediaPlayer.tag, A11yMediaPlayer);

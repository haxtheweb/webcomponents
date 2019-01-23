/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { A11yMediaPlayerBehaviors } from "./lib/a11y-media-player-behaviors.js";
import "@polymer/paper-slider/paper-slider.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/av-icons.js";
import "./lib/screenfull-lib.js";
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
  hide-elapsed-time$="[[hideElapsedTime]]"    // Is elapsed time hidden?
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
 * @extends A11yMediaPlayerBehaviors
 * @polymer
 * @customElement
 * @demo demo/index.html video demo
 * @demo demo/audio.html audio demo
 * @demo demo/youtube.html YouTube demo
 *
 */
class A11yMediaPlayer extends A11yMediaPlayerBehaviors {
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
    return [A11yMediaPlayerBehaviors];
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
    root.__interactive = !root.disableInteractive;
    root.target = root.shadowRoot.querySelector("#transcript");
    root.__status = root.loadingLabel;
    root.__slider = root.$.slider;
    root.__volume = root.muted ? 0 : Math.max(this.volume, 10);
    root.__resumePlaying = false;
    root.__showFullscreen = !this.disableFullscreen && screenfull.enabled;
    root.__duration = 0;
    root.$.controls.setStatus(root.__status);
    root.width = root.width !== null ? root.width : "100%";
    root.style.maxWidth = root.width !== null ? root.width : "100%";
    root._setPlayerHeight(aspect);
    if (root.isYoutube) {
      root._youTubeRequest();
    } else {
      root.media = root.$.html5;
      root._addSourcesAndTracks();
    }
    root.$.transcript.setMedia(root.$.innerplayer);

    // handles fullscreen
    if (root.__showFullscreen) {
      screenfull.on("change", () => {
        this.fullscreen = screenfull.isFullscreen;
      });
    }
  }

  /**
   * plays the media
   */
  play(e) {
    let root = this;
    root.__playing = true;
    if (e === undefined || e.detail === root.$.playbutton) {
      // while playing, update the slider and length
      root.__playProgress = setInterval(() => {
        root.__elapsed =
          root.media.getCurrentTime() > 0 ? root.media.getCurrentTime() : 0;
        root.__duration = root.media.duration > 0 ? root.media.duration : 0;
        root._updateCustomTracks();
        root.__status =
          root._getHHMMSS(root.media.getCurrentTime(), root.__duration) +
          "/" +
          root._getHHMMSS(root.__duration);
        root.$.controls.setStatus(root.__status);
        // if the video reaches the end and is not set to loop, stop
        if (root.__elapsed === root.__duration && !root.loop) {
          root.__playing = false;
          clearInterval(root.__playProgress);
        }

        //updated buffered section of the slider
        root.__buffered = root.media.getBufferedTime;
      }, 1);
      window.dispatchEvent(
        new CustomEvent("a11y-player-playing", { detail: root })
      );
      root.media.play();
    }
  }

  /**
   * pauses the media
   */
  pause() {
    let root = this;
    root.__playing = false;
    root.media.pause();

    //stop updating the slider and length
    clearInterval(root.__playProgress);
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
    amt = amt !== undefined ? amt : 1;
    this.seek(Math.max(this.media.getCurrentTime() - amt, 0));
  }

  /**
   * seeks media forward at a set increment
   *
   * @param {float} the elepsed time, in seconds
   */
  forward(amt) {
    amt = amt !== undefined ? amt : 1;
    this.seek(Math.min(this.media.getCurrentTime() + amt, this.__duration));
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
      this.__elapsed = time;
      this.__status =
        this._getHHMMSS(this.media.getCurrentTime(), this.__duration) +
        "/" +
        this._getHHMMSS(this.__duration);
      this.$.controls.setStatus(this.__status);
      this._updateCustomTracks();
      if (this.__resumePlaying) this.play();
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
    let root = this,
      arr = typeof data === Array ? data : JSON.parse(data);
    if (arr !== undefined && arr !== null) {
      for (let i = 0; i < arr.length; i++) {
        let el = document.createElement(type);
        for (let key in arr[i]) {
          console.log(key, arr[i][key]);
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
    let audioLabel = this._getLocal(localization, "audio", "label"),
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
   *
   * @param {boolean} Is the player set to audio-only?
   * @param {string} the text that indicates this player is audio-only
   * @param {string} the text that indicates this player is for video
   * @param {string} the title of the media
   * @returns {string} the media caption when the page is printed
   */
  _getPrintCaption(audioOnly, localization, mediaTitle) {
    let audioLabel = this._getLocal(localization, "audio", "label"),
      videoLabel = this._getLocal(localization, "video", "label"),
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
    root.querySelectorAll("source,track").forEach(function(node) {
      root.$.html5.media.appendChild(node);
    });
    console.log(root.tracks, root.sources);
    root._appendToPlayer(root.tracks, "track");
    root._appendToPlayer(root.sources, "source");
    root.$.html5.media.textTracks.onaddtrack = function(e) {
      root.hasCaptions = true;
      root.hasTranscript = !root.standAlone;
      root._getTrackData(e.track, counter++);
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
        let cues = Object.keys(track.cues).map(function(key) {
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
        track.oncuechange = function(e) {
          root.$.transcript.setActiveCues(
            Object.keys(e.currentTarget.activeCues).map(function(key) {
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
    root.__duration = root.media.duration > 0 ? root.media.duration : 0;
    root.__status =
      root._getHHMMSS(0, root.media.duration) +
      "/" +
      root._getHHMMSS(root.media.duration);
    root.$.controls.setStatus(root.__status);
    root._getTrackData(root.$.html5.media);
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
  _handleSliderDragging(e) {
    let root = this;
    root._toggleSliderSeek(
      root.$.slider.dragging,
      root.$.slider.immediateValue
    );
  }

  /**
   * handles duration slider dragging with a keyboard
   */
  _handleSliderKeyboard(e) {
    let root = this;
    root._toggleSliderSeek(root.$.slider.focused, root.$.slider.value);
  }

  /**
   * handles transcript scroll toggle
   */
  _handleTranscriptScrollToggle(e) {
    this.disableScroll = !this.disableScroll;
  }

  /**
   * determine which button was clicked and act accordingly
   */
  _onControlsChanged(e) {
    let root = this,
      action = e.detail.action !== undefined ? e.detail.action : e.detail.id;
    if (action === "backward") {
      root.rewind(root.__duration / 20);
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
      root.forward(root.__duration / 20);
    } else if (action === "fullscreen") {
      this.toggleTranscript(this.fullscreen);
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
   * handles slider seeking via mouse or keyboard
   *
   * @param {boolean} Is the slider currently being used to seek?
   * @param {number} the value of the slider
   */
  _toggleSliderSeek(seeking, value) {
    if (seeking) {
      if (this.__playing) this.__resumePlaying = true;
      this.pause();
    } else {
      this.seek(value);
      this.__resumePlaying = false;
    }
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
    root.disableInteractive = true;
    if (root.__playerAttached && root.__playerReady) {
      let ytInit = function() {
          // initialize the YouTube player
          root.media = ytUtil.initYoutubePlayer({
            width: "100%",
            height: "100%",
            videoId: root.youtubeId
          });
          // move the YouTube iframe to the media player's YouTube container
          root.$.youtube.appendChild(root.media.a);
          root.__ytAppended = true;
          root._updateCustomTracks();
          // youtube API doesn't immediately give length of a video
          let int = setInterval(() => {
            if (root.media.getDuration !== undefined) {
              clearInterval(int);
              root.__duration = root.media.duration = root.media.getDuration();
              root.__status =
                root._getHHMMSS(0, root.media.duration) +
                "/" +
                root._getHHMMSS(root.media.duration);
              root.$.controls.setStatus(root.__status);
              root.disableInteractive = !root.__interactive;
              root._addSourcesAndTracks();
            }
          }, 100);
        },
        checkApi = function(e) {
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

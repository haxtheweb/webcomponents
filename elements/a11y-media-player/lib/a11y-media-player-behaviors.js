/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { A11yMediaBehaviors } from "./a11y-media-behaviors.js";

export { A11yMediaPlayerBehaviors };
/**
 * `a11y-media-player-behaviors`
 * `A set of properties for a11y-media components that are NOT used in the transcript components.`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @extends A11yMediaBehaviors
 * @customElement
 * @polymer
 */
class A11yMediaPlayerBehaviors extends A11yMediaBehaviors {
  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * Allow this media to play concurrently with other a11y-media-players?
       * Default is to pause this a11y-media-player when other a11y-media-player starts playing.
       */

      allowConcurrent: {
        name: "allowConcurrent",
        type: "Boolean",
        value: false
      },
      /**
       * Is it an audio player with no thumbnail?
       */
      audioNoThumb: {
        name: "audioNoThumb",
        type: "Boolean",
        computed: "_getAudioNoThumb(audioOnly,thumbnailSrc)"
      },
      /**
       * Is this an audio file?
       */
      audioOnly: {
        name: "audioOnly",
        type: "Boolean",
        value: false,
        reflectToAttribute: true
      },
      /**
       * Use compact controls?
       */
      compactControls: {
        name: "compactControls",
        type: "Boolean",
        computed: "_getCompactControls(responsiveSize)"
      },
      /**
       * crossorigin attribute for <video> and <audio> tags
       */
      crossorigin: {
        name: "crossorigin",
        type: "String",
        value: null,
        reflectToAttribute: true
      },
      /**
       * Use dark theme on transcript? Default is false, even when player is dark.
       */
      darkTranscript: {
        name: "darkTranscript",
        type: "Boolean",
        value: false
      },
      /**
       * disable fullscreen option
       */
      disableFullscreen: {
        name: "disableFullscreen",
        type: "Boolean",
        value: false
      },
      /**
       * disable interactive mode that makes the transcript clickable
       */
      disableInteractive: {
        name: "disableInteractive",
        type: "Boolean",
        value: false
      },
      /**
       * disable transcript search feature
       */
      disableSearch: {
        name: "disableSearch",
        type: "Boolean",
        value: false
      },
      /**
       * disable autoscrolling as transcript plays
       */
      disableScroll: {
        name: "disableScroll",
        type: "Boolean",
        value: false
      },
      /**
       * disable transcript print button
       */
      disablePrintButton: {
        name: "disablePrintButton",
        type: "Boolean",
        value: false
      },
      /**
       * Determines if video and transcript are in a flex layout
       */
      flexLayout: {
        name: "flexLayout",
        type: "Boolean",
        computed:
          "_isFlexLayout(standAlone,hideTranscript,audioNoThumb,stackedLayout)",
        reflectToAttribute: true
      },
      /**
       * Is fullscreen mode?
       */
      fullscreen: {
        name: "fullscreen",
        type: "Boolean",
        value: false
      },
      /**
       * show the FullscreenButton?
       */
      fullscreenButton: {
        name: "fullscreenButton",
        type: "Boolean",
        computed: "_getFullscreenButton(disableFullscreen)",
        notify: true
      },
      /**
       * Does the player have tracks?
       */
      hasCaptions: {
        name: "hasCaptions",
        type: "Boolean",
        value: false
      },
      /**
       * Does the player have an interactive transcript?
       */
      hasTranscript: {
        name: "hasTranscript",
        type: "Boolean",
        value: false
      },
      /**
       * The height of the media player.
       */
      height: {
        name: "height",
        type: "String",
        value: null
      },
      /**
       * Hide elapsed time?
       */
      hideElapsedTime: {
        name: "hideElapsedTime",
        type: "Boolean",
        value: false
      },
      /**
       * initially hide the transcript?
       */
      hideTranscript: {
        name: "hideTranscript",
        type: "Boolean",
        value: false,
        reflectToAttribute: true
      },
      /**
       * show cue's start and end time
       */
      hideTimestamps: {
        name: "hideTimestamps",
        type: "Boolean",
        value: false
      },
      /**
       * the media to be manipulated
       */
      media: {
        name: "media",
        type: "Object",
        value: null
      },
      /**
       * the language of the media (if different from user interface language)
       */
      mediaLang: {
        name: "mediaLang",
        type: "String",
        value: "en"
      },
      /**
       * optional title of media (shows when printed)
       */
      mediaTitle: {
        name: "mediaTitle",
        type: "String",
        value: ""
      },
      /**
       * mute/unmute button
       */
      muteUnmute: {
        name: "muteUnmute",
        type: "Object",
        computed: "_getMuteUnmute(muted,localization)"
      },
      /**
       * Is media playing?
       */
      playing: {
        name: "playing",
        type: "Boolean",
        value: false
      },
      /**
       * play/pause button
       */
      playPause: {
        name: "playPause",
        type: "Object",
        computed: "_getPlayPause(playing,localization)"
      },
      /**
       * Size of the a11y media element for responsive styling
       */
      responsiveSize: {
        name: "responsiveSize",
        type: "String",
        notify: true,
        value: "xs",
        reflectToAttribute: true
      },
      /**
       * the search tool for the transcript
       */
      search: {
        name: "search",
        type: "Object",
        value: null
      },
      /**
       * is YouTube?
       */
      showCustomCaptions: {
        name: "showCustomCaptions",
        type: "Boolean",
        computed: "_showCustomCaptions(isYoutube,audioOnly,hasCaptions,cc)"
      },
      /**
       * stacked layout instead of side-by-side?
       */
      stackedLayout: {
        name: "stackedLayout",
        type: "Boolean",
        value: false
      },
      /**
       * Is stand-alone player (without transcript)?
       */
      standAlone: {
        name: "standAlone",
        type: "Boolean",
        value: false,
        reflectToAttribute: true
      },
      /**
       * target of the controls
       */
      target: {
        name: "target",
        type: "Object",
        value: null
      },
      /**
       * Source of optional thumbnail image
       */
      thumbnailSrc: {
        name: "thumbnailSrc",
        type: "String",
        value: null,
        reflectToAttribute: true
      },
      /**
       * The width of the media player.
       */
      width: {
        name: "width",
        type: "String",
        value: null
      }
    };
  }

  //get player-specifc properties
  static get behaviors() {
    return [A11yMediaBehaviors];
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "a11y-media-player-behaviors";
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
  _getFullscreenButton(disableFullscreen) {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) ||
      disableFullscreen
    ) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * returns true if player is xs or sm and needs to use compact controls
   *
   * @param {string} the size of the player: `xs`,`sm`,`md`,`lg`, or `xl`
   * @returns {boolean} Should the player use compact controls?
   */
  _getCompactControls(responsiveSize) {
    return (
      this._testAttribute(responsiveSize, "xs") ||
      this._testAttribute(responsiveSize, "sm")
    );
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
  _getPlayPause(playing, localization) {
    return playing
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
   * set play/pause button
   *
   * @param {boolean} Is the media muted?
   * @param {string} label if button mutes media
   * @param {string} icon if button mutes media
   * @param {string} label if button unmutes media
   * @param {string} icon if button unmutes media
   * @returns {object} an object containing the current state of the play/pause button, eg., `{"label": "mute", "icon": "av:volume-off"}`
   */
  _getMuteUnmute(muted, localization) {
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
   * Does the player have custom CC tracks?
   *
   * @param {boolean} Is the media from YouTube?
   * @param {boolean} Is the media audio only?
   * @param {boolean} Does the media have CC tracks?
   * @returns {boolean} Does the player have custom CC?
   */
  _hasCustomCaptions(isYoutube, audioOnly, hasCaptions) {
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
}
window.customElements.define(
  A11yMediaPlayerBehaviors.tag,
  A11yMediaPlayerBehaviors
);

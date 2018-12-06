/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { A11yMediaBehaviors } from "./a11y-media-behaviors.js";

export { A11yMediaPlayerProperties };
/**
 * `a11y-media-player-properties`
 * `A set of properties for a11y-media player components.`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @extends A11yMediaBehaviors
 * @customElement
 * @polymer
 */
class A11yMediaPlayerProperties extends A11yMediaBehaviors {
  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * Allow this media to play concurrently with other a11y-media-players?
       * Default is to pause this a11y-media-player when other a11y-media-player starts playing.
       */

      allowConcurrent: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * label/microcopy for audio
       */
      audioLabel: {
        type: String,
        value: "audio"
      },
      /**
       * Is this an audio file?
       */
      audioOnly: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * label for autoscroll button on transcript controls
       */
      autoScrollLabel: {
        type: String,
        value: "auto-scrolling"
      },
      /**
       * icon for autoscroll button on transcript controls
       */
      autoScrollIcon: {
        type: String,
        value: "swap-vert"
      },
      /**
       * icon for closed captions button on player controls
       */
      captionsIcon: {
        type: String,
        value: "av:closed-caption"
      },
      /**
       * label for closed captions button on player controls
       */
      captionsLabel: {
        type: String,
        value: "closed captions"
      },
      /**
       * label for captions drop-down menu on settings menu of player controls
       */
      captionsMenuLabel: {
        type: String,
        value: "Captions"
      },
      /**
       * label for captions off drop-down menu item on settings menu of player controls
       */
      captionsMenuOff: {
        type: String,
        value: "Off"
      },
      /**
       * Use compact controls?
       */
      compactControls: {
        type: Boolean,
        computed: "_getCompactControls(responsiveSize)",
        reflectToAttribute: true
      },
      /**
       * crossorigin attribute for <video> and <audio> tags
       */
      crossorigin: {
        type: String,
        value: null,
        reflectToAttribute: true
      },
      /**
       * Use dark theme on transcript? Default is false, even when player is dark.
       */
      darkTranscript: {
        type: Boolean,
        value: false
      },
      /**
       * disable fullscreen option
       */
      disableFullscreen: {
        type: Boolean,
        value: false
      },
      /**
       * disable interactive mode that makes the transcript clickable
       */
      disableInteractive: {
        type: Boolean,
        value: false
      },
      /**
       * disable transcript search feature
       */
      disableSearch: {
        type: Boolean,
        value: false
      },
      /**
       * disable autoscrolling as transcript plays
       */
      disableScroll: {
        type: Boolean,
        value: false
      },
      /**
       * disable transcript print button
       */
      disablePrintButton: {
        type: Boolean,
        value: false
      },
      /**
       * Determines if video and transcript are in a flex layout
       */
      flexLayout: {
        type: Boolean,
        computed:
          "_isFlexLayout(standAlone,hideTranscript,noHeight,stackedLayout)",
        reflectToAttribute: true
      },
      /**
       * icon for forward button on player controls
       */
      forwardIcon: {
        type: String,
        value: "av:fast-forward"
      },
      /**
       * label for rewind button on player controls
       */
      forwardLabel: {
        type: String,
        value: "forward"
      },
      /**
       * Is fullscreen mode?
       */
      fullscreen: {
        type: Boolean,
        value: false
      },
      /**
       * show the FullscreenButton?
       */
      fullscreenButton: {
        type: Boolean,
        computed: "_getFullscreenButton(disableFullscreen)",
        notify: true
      },
      /**
       * icon for fullscreen button on transcript
       */
      fullscreenIcon: {
        type: String,
        value: "fullscreen"
      },
      /**
       * label for fullscreen button on transcript
       */
      fullscreenLabel: {
        type: String,
        value: "fullscreen"
      },
      /**
       * Does the player have tracks?
       */
      hasCaptions: {
        type: Boolean,
        value: false
      },
      /**
       * Does the player have an interactive transcript?
       */
      hasTranscript: {
        type: Boolean,
        value: false
      },
      /**
       * Hide elapsed time?
       */
      hideElapsedTime: {
        type: Boolean,
        value: false
      },
      /**
       * show cue's start and end time
       */
      hideTimestamps: {
        type: Boolean,
        value: false
      },
      /**
       * label for loading status
       */
      loadingLabel: {
        type: String,
        value: "Loading..."
      },
      /**
       * label for loop menu item on settings menu of player controls
       */
      loopLabel: {
        type: String,
        value: "Loop Playback"
      },
      /**
       * the media to be manipulated
       */
      media: {
        type: Object,
        value: null
      },
      /**
       * optional title of media (shows when printed)
       */
      mediaTitle: {
        type: String,
        value: "",
        reflectToAttribute: true
      },
      /**
       * icon for mute button on player controls
       */
      muteIcon: {
        type: String,
        value: "av:volume-up"
      },
      /**
       * label for fullscreen button on player controls
       */
      muteLabel: {
        type: String,
        value: "mute"
      },
      /**
       * Is it an audio player with no thumbnail?
       */
      noHeight: {
        type: Boolean,
        computed: "_getNoHeight(audioOnly,thumbnailSrc)",
        reflectToAttribute: true
      },
      /**
       * Hide the giant play button?
       */
      noPlayButton: {
        type: Boolean,
        computed: "_noPlayButton(noHeight,isYoutube)"
      },
      /**
       * icon for pause button on player controls
       */
      pauseIcon: {
        type: String,
        value: "av:pause"
      },
      /**
       * label for pause button on player controls
       */
      pauseLabel: {
        type: String,
        value: "pause"
      },
      /**
       * icon for play button on player controls
       */
      playIcon: {
        type: String,
        value: "av:play-arrow"
      },
      /**
       * Is media playing?
       */
      playing: {
        type: Boolean,
        value: false
      },
      /**
       * label for play button on player controls
       */
      playLabel: {
        type: String,
        value: "play"
      },
      /**
       * label for print button on player controls
       */
      printLabel: {
        type: String,
        value: "print transcript"
      },
      /**
       * icon for print button on player controls
       */
      printIcon: {
        type: String,
        value: "print"
      },
      /**
       * Size of the a11y media element for responsive styling
       */
      responsiveSize: {
        type: String,
        notify: true,
        reflectToAttribute: true
      },
      /**
       * icon for restart button on player controls
       */
      restartIcon: {
        type: String,
        value: "av:replay"
      },
      /**
       * label for restart button on player controls
       */
      restartLabel: {
        type: String,
        value: "restart"
      },
      /**
       * icon for rewind button on player controls
       */
      rewindIcon: {
        type: String,
        value: "av:fast-rewind"
      },
      /**
       * label for rewind button on player controls
       */
      rewindLabel: {
        type: String,
        value: "backward"
      },
      /**
       * the search tool for the transcript
       */
      search: {
        type: Object,
        value: null
      },
      /**
       * label for print button on player controls
       */
      searchIcon: {
        type: String,
        value: "search"
      },
      /**
       * label for print button on player controls
       */
      searchLabel: {
        type: String,
        value: "search transcript"
      },
      /**
       * icon for the next button on transcript search
       */
      searchNextButtonIcon: {
        type: String,
        value: "arrow-forward"
      },
      /**
       * label for the next button on transcript search
       */
      searchNextButtonLabel: {
        type: String,
        value: "next result"
      },
      /**
       * label for print button on player controls
       */
      searchNextIcon: {
        type: String,
        value: "arrow-forward"
      },
      /**
       * label for print button on player controls
       */
      searchNextLabel: {
        type: String,
        value: "next result"
      },
      /**
       * icon for the previous button on transcript search
       */
      searchPrevButtonIcon: {
        type: String,
        value: "arrow-back"
      },
      /**
       * label for the previous button on transcript search
       */
      searchPrevButtonLabel: {
        type: String,
        value: "previous result"
      },
      /**
       * label for print button on player controls
       */
      searchPrevIcon: {
        type: String,
        value: "arrow-back"
      },
      /**
       * label for print button on player controls
       */
      searchPrevLabel: {
        type: String,
        value: "previous result"
      },
      /**
       * icon for settings menu on player controls
       */
      settingsIcon: {
        type: String,
        value: "settings"
      },
      /**
       * label for settings menu on player controls
       */
      settingsLabel: {
        type: String,
        value: "settings"
      },
      /**
       * is YouTube?
       */
      showCustomCaptions: {
        type: Boolean,
        computed: "_showCustomCaptions(isYoutube,audioOnly,cc)"
      },
      /**
       * label for skip the transcript link before the transcript
       */
      skipTranscriptLink: {
        type: String,
        value: "Skip the transcript."
      },
      /**
       * label for speed menu item on settings menu of player controls
       */
      speedLabel: {
        type: String,
        value: "Speed %"
      },
      /**
       * stacked layout instead of side-by-side?
       */
      stackedLayout: {
        type: Boolean,
        value: false
      },
      /**
       * Is stand-alone player (without transcript)?
       */
      standAlone: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * target of the controls
       */
      target: {
        type: Object,
        value: null
      },
      /**
       * Source of optional thumbnail image
       */
      thumbnailSrc: {
        type: String,
        value: null,
        reflectToAttribute: true
      },
      /**
       * icon for transcript button on player controls
       */
      transcriptIcon: {
        type: String,
        value: "description"
      },
      /**
       * label for transcript button on player controls
       */
      transcriptLabel: {
        type: String,
        value: "transcript"
      },
      /**
       * label for transcript menu item on settings menu of player controls
       */
      transcriptMenuLabel: {
        type: String,
        value: "Transcript"
      },
      /**
       * the interface UI language
       */
      uiLanguage: {
        type: String,
        value: "en"
      },
      /**
       * icon for unmute button on player controls
       */
      unmuteIcon: {
        type: String,
        value: "av:volume-off"
      },
      /**
       * label for unmute button on player controls
       */
      unmuteLabel: {
        type: String,
        value: "unmute"
      },
      /**
       * label/microcopy for audio
       */
      videoLabel: {
        type: String,
        value: "video"
      },
      /**
       * label for volume slider on player controls
       */
      volumeLabel: {
        type: String,
        value: "volume"
      },
      /**
       * The width of the media player.
       */
      width: {
        type: String,
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
    return "a11y-media-player-properties";
  }

  /**
   * returns true if an attribute is set to a value
   */

  _getNoHeight(audioOnly, thumbnailSrc) {
    return audioOnly && (thumbnailSrc === null || thumbnailSrc === undefined);
  }
  /**
   * returns true if the player has no giant play button
   */

  _noPlayButton(noHeight, isYoutube) {
    return noHeight || isYoutube;
  }

  /**
   * returns true if an attribute is set to a value
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
   */
  _getCompactControls(responsiveSize) {
    return (
      this._testAttribute(responsiveSize, "xs") ||
      this._testAttribute(responsiveSize, "sm")
    );
  }

  /**
   * returns true if an attribute is set to a value
   */
  _testAttribute(attr, val) {
    return attr === val;
  }

  /**
   * show youtube closed captions layer?
   */
  _showCustomCaptions(isYoutube, audioOnly, cc) {
    return (isYoutube || audioOnly) && cc;
  }

  /**
   * Determines if video and transcript are in a flex layout
   */
  _isFlexLayout(standAlone, hideTranscript, noHeight, stackedLayout) {
    return !standAlone && !hideTranscript && !noHeight && !stackedLayout;
  }
}
window.customElements.define(
  A11yMediaPlayerProperties.tag,
  A11yMediaPlayerProperties
);

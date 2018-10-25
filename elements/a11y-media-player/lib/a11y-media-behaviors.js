import "@lrnwebcomponents/responsive-utility/responsive-utility.js";
/**
`a11y-media-behaviors`
A set of behaviors for a11y-media components.
@microcopy - the mental model for this element
 - 
 - 
*/
window.a11yMediaBehaviors = window.a11yMediaBehaviors || {};
window.a11yMediaBehaviors.MediaProps = {
  properties: {
    /**
     * autoplay is an option,
     * but generally not recommended for a11y
     */

    autoplay: {
      type: Boolean,
      value: false
    },
    /**
     * show closed captions
     */
    cc: {
      type: Boolean,
      value: false
    },
    /**
     * The height of the media player.
     */
    height: {
      type: Number,
      value: null
    },
    /**
     * is YouTube?
     */
    isYoutube: {
      type: Boolean,
      computed: "_hasAttribute(youtubeId)"
    },
    /**
     * Language
     */
    lang: {
      type: String,
      value: "en"
    },
    /**
     * Loop the video?
     */
    loop: {
      type: Boolean,
      value: false
    },
    /**
     * Dash.js manifest source?
     */
    manifest: {
      type: String,
      value: null
    },
    /**
     * Is audio muted?
     */
    muted: {
      type: Boolean,
      value: false
    },
    /**
     * Preload the sources: auto, metadata (default), or none.
     */
    preload: {
      type: String,
      value: "metadata"
    },
    /**
     * Playback rate where 1 is normal speed, 0.5 is half-speed, and 2 is double speed
     */
    playbackRate: {
      type: Number,
      value: 1
    },
    /**
     * status
     */
    status: {
      type: String,
      value: "loading..."
    },
    /**
     * the selected track
     */
    selectedTrack: {
      type: Object,
      value: null
    },
    /**
     * id of the selected track
     */
    selectedTrackID: {
      type: Number,
      value: null
    },
    /**
     * array of tracks and cues
     */
    tracks: {
      type: Array,
      value: null
    },
    /**
     * Range is 0 to 100. Default should not be loud enough to overpower screen readers.
     */
    volume: {
      type: Number,
      value: 70
    },
    /**
     * the id for the video
     */
    youtubeId: {
      type: String,
      value: null
    },
    /**
     * the YouTube player object
     */
    youTube: {
      type: Object,
      value: {}
    }
  },
  /**
   * returns true if an attribute is not null
   */

  _hasAttribute: function(attr) {
    return attr !== undefined && attr !== null;
  },
  /**
   * returns true if an attribute is set to a value
   */

  _testAttribute: function(attr, val) {
    return attr === val;
  }
};
window.a11yMediaBehaviors.GeneralFunctions = {
  /**
   * calls responsive-utility to get parent's responsive size
   */

  _addResponsiveUtility: function(data) {
    let root = this,
      data2 =
        data !== undefined
          ? data
          : {
              element: root,
              attribute: "responsive-size",
              relativeToParent: true
            };
    window.ResponsiveUtility.requestAvailability();
    root.fire("responsive-element", data2);
  },
  /**
   * converts time in millesconds to HH:MM:SS
   */
  _getHHMMSS: function(val, max) {
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
  /** TODO - I may not need this
    * converts time in millesconds to HH:MM:SS
  _getSeconds: function(val){
    let total = 0, units = val.split(':').reverse();
    total = units[0] !== undefined && units[0] !== null ? units[0]/1000 : 0; //ms
    total += units[1] !== undefined && units[1] !== null ? units[1] : 0; //ss
    total += units[2] !== undefined && units[2] !== null ? units[2]*60 : 0; //mm
    total += units[3] !== undefined && units[3] !== null ? units[3]*3600 : 0; //hh
    console.log(units,total);
    return total;
  }
    */
};
window.a11yMediaBehaviors.PlayerBehaviors = {
  properties: {
    /**
     * Optional accent color for controls,
     * using the following materialize colors:
     * red, pink, purple, deep-purple, indigo, blue,
     * light blue, cyan, teal, green, light green, lime,
     * yellow, amber, orange, deep-orange, and brown.
     * Default is null.
     */
    accentColor: {
      type: String,
      value: null,
      reflectToAttribute: true
    },
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
     * Is this an audio file?
     */

    audioOnly: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
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
     * Enables darker player.
     */
    dark: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },
    /**
     * disable fullscreen option
     */
    disableFullscreen: {
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
     * Hide the transcript?
     */
    hideTranscript: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
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
     * Is media playing?
     */
    playing: {
      type: Boolean,
      value: false
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
     * is YouTube?
     */
    showCustomCaptions: {
      type: Boolean,
      computed: "_showCustomCaptions(isYoutube,audioOnly,cc)"
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
     * Is the video currently sticky, i.e. it is fixed to the corner when playing but scrolled off screen?
     */
    sticky: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },
    /**
     * When playing but scrolled off screen, to which corner does it stick:
     * top-left, top-right, bottom-left, bottom-right, or none?
     * Default is "top-right". "None" disables stickiness.
     */
    stickyCorner: {
      type: String,
      value: "top-right",
      reflectToAttribute: true
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
     * The width of the media player.
     */
    width: {
      type: String,
      value: null
    },
    /**
     * label/microcopy for audio
     */
    audioLabel: {
      type: String,
      value: "audio"
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
     * the interface UI language
     */
    uiLanguage: {
      type: String,
      value: "en"
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
     * label for play button on player controls
     */
    playLabel: {
      type: String,
      value: "play"
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
     * label for speed menu item on settings menu of player controls
     */
    speedLabel: {
      type: String,
      value: "Speed %"
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
    }
  },
  /**
   * returns true if an attribute is set to a value
   */

  _getNoHeight: function(audioOnly, thumbnailSrc) {
    return audioOnly && (thumbnailSrc === null || thumbnailSrc === undefined);
  },
  /**
   * returns true if the player has no giant play button
   */

  _noPlayButton: function(noHeight, isYoutube) {
    return noHeight || isYoutube;
  },
  /**
   * returns true if an attribute is set to a value
   */

  _getFullscreenButton: function(disableFullscreen) {
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
  },
  /**
   * returns true if player is xs or sm and needs to use compact controls
   */

  _getCompactControls: function(responsiveSize) {
    return (
      this._testAttribute(responsiveSize, "xs") ||
      this._testAttribute(responsiveSize, "sm")
    );
  },
  /**
   * returns true if an attribute is set to a value
   */

  _testAttribute: function(attr, val) {
    return attr === val;
  },
  /**
   * show youtube closed captions layer?
   */

  _showCustomCaptions: function(isYoutube, audioOnly, cc) {
    return (isYoutube || audioOnly) && cc;
  },
  /**
   * Determines if video and transcript are in a flex layout
   */
  _isFlexLayout: function(standAlone, hideTranscript, noHeight, stackedLayout) {
    return !standAlone && !hideTranscript && !noHeight && !stackedLayout;
  }
};
window.a11yMediaBehaviors.TranscriptBehaviors = {
  properties: {
    /**
     * Accent color on controls. Default is blue.
     */

    accentColor: {
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
     * show cue's start and end time
     */
    hideTimestamps: {
      type: Boolean,
      value: false
    },
    /**
     * show cue's start and end time
     */
    media: {
      type: Object,
      value: {}
    },
    /**
     * the search tool for the transcript
     */
    search: {
      type: Object,
      value: null
    },
    /**
     * label for search input  on transcript
     */
    searchLabel: {
      type: String,
      value: "search transcript"
    },
    /**
     * icon for search input on transcript
     */
    searchIcon: {
      type: String,
      value: "search"
    },
    /**
     * label for the next button on transcript search
     */
    searchNextButtonLabel: {
      type: String,
      value: "next result"
    },
    /**
     * icon for the next button on transcript search
     */
    searchNextButtonIcon: {
      type: String,
      value: "arrow-forward"
    },
    /**
     * label for the previous button on transcript search
     */
    searchPrevButtonLabel: {
      type: String,
      value: "previous result"
    },
    /**
     * icon for the previous button on transcript search
     */
    searchPrevButtonIcon: {
      type: String,
      value: "arrow-back"
    },
    /**
     * stacked layout instead of side-by-side?
     */
    stackedLayout: {
      type: Boolean,
      value: false
    },
    /**
     * target of the controls
     */
    target: {
      type: Object,
      value: null
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
     * label for print button on player controls
     */
    searchLabel: {
      type: String,
      value: "search transcript"
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
    searchNextLabel: {
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
    searchPrevLabel: {
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
     * label for skip the transcript link before the transcript
     */
    skipTranscriptLink: {
      type: String,
      value: "Skip the transcript."
    }
  }
};

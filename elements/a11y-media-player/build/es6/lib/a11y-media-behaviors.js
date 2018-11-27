import "../node_modules/@lrnwebcomponents/responsive-utility/responsive-utility.js";
window.a11yMediaBehaviors = window.a11yMediaBehaviors || {};
window.a11yMediaBehaviors.MediaProps = {
  properties: {
    autoplay: { type: Boolean, value: !1 },
    cc: { type: Boolean, value: !1 },
    height: { type: Number, value: null },
    isYoutube: { type: Boolean, computed: "_hasAttribute(youtubeId)" },
    lang: { type: String, value: "en" },
    loop: { type: Boolean, value: !1 },
    manifest: { type: String, value: null },
    muted: { type: Boolean, value: !1 },
    preload: { type: String, value: "metadata" },
    playbackRate: { type: Number, value: 1 },
    status: { type: String, value: "loading..." },
    selectedTrack: { type: Object, value: null },
    selectedTrackID: { type: Number, value: null },
    tracks: { type: Array, value: null },
    volume: { type: Number, value: 70 },
    youtubeId: { type: String, value: null },
    youTube: { type: Object, value: {} }
  },
  _hasAttribute: function(attr) {
    return attr !== void 0 && null !== attr;
  },
  _testAttribute: function(attr, val) {
    return attr === val;
  }
};
window.a11yMediaBehaviors.GeneralFunctions = {
  _addResponsiveUtility: function(data) {
    let root = this,
      data2 =
        data !== void 0
          ? data
          : {
              element: root,
              attribute: "responsive-size",
              relativeToParent: !0
            };
    window.ResponsiveUtility.requestAvailability();
    root.fire("responsive-element", data2);
  },
  _getHHMMSS: function(val, max) {
    max = max === void 0 ? val : max;
    let a = val => {
        return 10 > val ? "0" + val : val;
      },
      b = (val, i, none) => {
        return max >= i ? a(Math.floor(val / i)) + ":" : none;
      },
      c = val => {
        return 100 > val ? val + "0" : val;
      };
    return (
      b(val, 3600, "") + b(val % 3600, 60, "00:") + a(Math.round(val % 60))
    );
  }
};
window.a11yMediaBehaviors.PlayerBehaviors = {
  properties: {
    accentColor: { type: String, value: null, reflectToAttribute: !0 },
    allowConcurrent: { type: Boolean, value: !1, reflectToAttribute: !0 },
    audioOnly: { type: Boolean, value: !1, reflectToAttribute: !0 },
    compactControls: {
      type: Boolean,
      computed: "_getCompactControls(responsiveSize)",
      reflectToAttribute: !0
    },
    crossorigin: { type: String, value: null, reflectToAttribute: !0 },
    dark: { type: Boolean, value: !1, reflectToAttribute: !0 },
    disableFullscreen: { type: Boolean, value: !1 },
    flexLayout: {
      type: Boolean,
      computed:
        "_isFlexLayout(standAlone,hideTranscript,noHeight,stackedLayout)",
      reflectToAttribute: !0
    },
    fullscreen: { type: Boolean, value: !1 },
    fullscreenButton: {
      type: Boolean,
      computed: "_getFullscreenButton(disableFullscreen)",
      notify: !0
    },
    hasCaptions: { type: Boolean, value: !1 },
    hasTranscript: { type: Boolean, value: !1 },
    hideElapsedTime: { type: Boolean, value: !1 },
    hideTranscript: { type: Boolean, value: !1, reflectToAttribute: !0 },
    mediaTitle: { type: String, value: "", reflectToAttribute: !0 },
    noHeight: {
      type: Boolean,
      computed: "_getNoHeight(audioOnly,thumbnailSrc)",
      reflectToAttribute: !0
    },
    noPlayButton: {
      type: Boolean,
      computed: "_noPlayButton(noHeight,isYoutube)"
    },
    playing: { type: Boolean, value: !1 },
    responsiveSize: { type: String, notify: !0, reflectToAttribute: !0 },
    showCustomCaptions: {
      type: Boolean,
      computed: "_showCustomCaptions(isYoutube,audioOnly,cc)"
    },
    standAlone: { type: Boolean, value: !1, reflectToAttribute: !0 },
    sticky: { type: Boolean, value: !1, reflectToAttribute: !0 },
    stickyCorner: { type: String, value: "top-right", reflectToAttribute: !0 },
    thumbnailSrc: { type: String, value: null, reflectToAttribute: !0 },
    width: { type: String, value: null },
    audioLabel: { type: String, value: "audio" },
    captionsIcon: { type: String, value: "av:closed-caption" },
    captionsLabel: { type: String, value: "closed captions" },
    captionsMenuLabel: { type: String, value: "Captions" },
    captionsMenuOff: { type: String, value: "Off" },
    uiLanguage: { type: String, value: "en" },
    forwardIcon: { type: String, value: "av:fast-forward" },
    forwardLabel: { type: String, value: "forward" },
    fullscreenIcon: { type: String, value: "fullscreen" },
    fullscreenLabel: { type: String, value: "fullscreen" },
    loadingLabel: { type: String, value: "Loading..." },
    loopLabel: { type: String, value: "Loop Playback" },
    muteIcon: { type: String, value: "av:volume-up" },
    muteLabel: { type: String, value: "mute" },
    pauseIcon: { type: String, value: "av:pause" },
    pauseLabel: { type: String, value: "pause" },
    playIcon: { type: String, value: "av:play-arrow" },
    playLabel: { type: String, value: "play" },
    restartIcon: { type: String, value: "av:replay" },
    restartLabel: { type: String, value: "restart" },
    rewindIcon: { type: String, value: "av:fast-rewind" },
    rewindLabel: { type: String, value: "backward" },
    settingsIcon: { type: String, value: "settings" },
    settingsLabel: { type: String, value: "settings" },
    speedLabel: { type: String, value: "Speed %" },
    transcriptIcon: { type: String, value: "description" },
    transcriptLabel: { type: String, value: "transcript" },
    transcriptMenuLabel: { type: String, value: "Transcript" },
    unmuteIcon: { type: String, value: "av:volume-off" },
    unmuteLabel: { type: String, value: "unmute" },
    videoLabel: { type: String, value: "video" },
    volumeLabel: { type: String, value: "volume" }
  },
  _getNoHeight: function(audioOnly, thumbnailSrc) {
    return audioOnly && (null === thumbnailSrc || thumbnailSrc === void 0);
  },
  _noPlayButton: function(noHeight, isYoutube) {
    return noHeight || isYoutube;
  },
  _getFullscreenButton: function(disableFullscreen) {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) ||
      disableFullscreen
    ) {
      return !1;
    } else {
      return !0;
    }
  },
  _getCompactControls: function(responsiveSize) {
    return (
      this._testAttribute(responsiveSize, "xs") ||
      this._testAttribute(responsiveSize, "sm")
    );
  },
  _testAttribute: function(attr, val) {
    return attr === val;
  },
  _showCustomCaptions: function(isYoutube, audioOnly, cc) {
    return (isYoutube || audioOnly) && cc;
  },
  _isFlexLayout: function(standAlone, hideTranscript, noHeight, stackedLayout) {
    return !standAlone && !hideTranscript && !noHeight && !stackedLayout;
  }
};
window.a11yMediaBehaviors.TranscriptBehaviors = {
  properties: {
    accentColor: { type: String, value: null, reflectToAttribute: !0 },
    darkTranscript: { type: Boolean, value: !1 },
    disableInteractive: { type: Boolean, value: !1 },
    disableSearch: { type: Boolean, value: !1 },
    disableScroll: { type: Boolean, value: !1 },
    disablePrintButton: { type: Boolean, value: !1 },
    hideTimestamps: { type: Boolean, value: !1 },
    media: { type: Object, value: {} },
    search: { type: Object, value: null },
    searchLabel: { type: String, value: "search transcript" },
    searchIcon: { type: String, value: "search" },
    searchNextButtonLabel: { type: String, value: "next result" },
    searchNextButtonIcon: { type: String, value: "arrow-forward" },
    searchPrevButtonLabel: { type: String, value: "previous result" },
    searchPrevButtonIcon: { type: String, value: "arrow-back" },
    stackedLayout: { type: Boolean, value: !1 },
    target: { type: Object, value: null },
    autoScrollLabel: { type: String, value: "auto-scrolling" },
    autoScrollIcon: { type: String, value: "swap-vert" },
    printLabel: { type: String, value: "print transcript" },
    printIcon: { type: String, value: "print" },
    searchLabel: { type: String, value: "search transcript" },
    searchIcon: { type: String, value: "search" },
    searchNextLabel: { type: String, value: "next result" },
    searchNextIcon: { type: String, value: "arrow-forward" },
    searchPrevLabel: { type: String, value: "previous result" },
    searchPrevIcon: { type: String, value: "arrow-back" },
    skipTranscriptLink: { type: String, value: "Skip the transcript." }
  }
};

define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "./a11y-media-behaviors.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_53a20840dea811e8b5bb1b1785d419ee() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style>\n      #video {\n        width: 100%;\n        max-width: 100%;\n        max-height: 80vh;\n      }\n    </style>\n    <video id="video" autoplay$="[[autoplay]]" crossorigin$="[[crossorigin]]" hidden$="[[audioOnly]]" lang$="[[lang]]" src$="[[manifest]]" preload="metadata">\n      <slot></slot>\n      HTML5 video not supported \n    </video>\n    <audio id="audio" autoplay$="[[autoplay]]" crossorigin$="[[crossorigin]]" hidden$="[[!audioOnly]]" lang$="[[lang]]" src$="[[manifest]]" preload="metadata">\n      <slot></slot>\n      HTML5 audio not supported \n    </audio>\n'
      ],
      [
        '\n    <style>\n      #video {\n        width: 100%;\n        max-width: 100%;\n        max-height: 80vh;\n      }\n    </style>\n    <video id="video" autoplay\\$="[[autoplay]]" crossorigin\\$="[[crossorigin]]" hidden\\$="[[audioOnly]]" lang\\$="[[lang]]" src\\$="[[manifest]]" preload="metadata">\n      <slot></slot>\n      HTML5 video not supported \n    </video>\n    <audio id="audio" autoplay\\$="[[autoplay]]" crossorigin\\$="[[crossorigin]]" hidden\\$="[[!audioOnly]]" lang\\$="[[lang]]" src\\$="[[manifest]]" preload="metadata">\n      <slot></slot>\n      HTML5 audio not supported \n    </audio>\n'
      ]
    );
    _templateObject_53a20840dea811e8b5bb1b1785d419ee = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_53a20840dea811e8b5bb1b1785d419ee()
    ),
    is: "a11y-media-video-loader",
    behaviors: [
      a11yMediaBehaviors.MediaProps,
      a11yMediaBehaviors.GeneralFunctions
    ],
    ready: function ready() {
      var root = this;
      root.media = root.$.video !== void 0 ? root.$.video : root.$.audio;
      root.media.addEventListener("loadedmetadata", function() {
        root.duration = 0 < root.media.duration ? root.media.duration : 0;
        root.tracks = [];
        root.volume = root.muted ? 0 : Math.max(this.volume, 10);
        root.seekable = root.media.seekable;
        root.setVolume(root.volume);
        root.setMute(root.muted, root.volume);
        root.setCC(root.cc);
        root.setLoop(root.loop);
        root.setPlaybackRate(root.playbackRate);
        root.aspectRatio = root.media.videoWidth / root.media.videoHeight;
        root.fire("media-loaded", this);
      });
    },
    getBufferedTime: function getBufferedTime() {
      return 0 < this.media.buffered.length
        ? this.media.buffered.end(0)
        : this.getCurrentTime();
    },
    getCurrentTime: function getCurrentTime() {
      return this.media.currentTime;
    },
    selectTrack: function selectTrack(index) {
      this.selectedTrack = this.media.textTracks[index];
      for (var i = 0; i < this.media.textTracks.length; i++) {
        if (parseInt(index) === i) {
          this.media.textTracks[i].mode = "showing";
        } else if (null !== this.media.textTracks[i]) {
          this.media.textTracks[i].mode = "hidden";
        }
      }
    },
    play: function play() {
      this.media.play();
    },
    pause: function pause() {
      this.media.pause();
    },
    stop: function stop() {
      this.pause();
      this.seek(0);
    },
    restart: function restart() {
      this.seek(0);
      this.play();
    },
    seek: function seek(time) {
      this.media.currentTime = time;
    },
    setCC: function setCC(mode) {
      this.media.cc = mode;
      if (this.selectedTrack !== void 0 && !0 == mode) {
        this.selectedTrack.mode = "showing";
        this.$.video.textTracks.value = this.selectedTrackId;
      } else if (this.selectedTrack !== void 0 && null !== this.selectedTrack) {
        this.selectedTrack.mode = "hidden";
        this.$.video.textTracks.value = "";
      }
    },
    setVolume: function setVolume(value) {
      this.media.volume = value / 100;
    },
    setPlaybackRate: function setPlaybackRate(value) {
      this.media.playbackRate = null !== value ? value : 1;
    },
    setAutoplay: function setAutoplay(mode) {
      this.media.autoplay = mode;
    },
    setLoop: function setLoop(mode) {
      this.media.loop = mode;
    },
    setMute: function setMute(mode) {
      this.media.muted = mode;
    }
  });
});

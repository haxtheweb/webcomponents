import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "./a11y-media-behaviors.js";
Polymer({
  _template: html`
    <style>
      #video {
        width: 100%;
        max-width: 100%;
        max-height: 80vh;
      }
    </style>
    <video id="video" autoplay\$="[[autoplay]]" crossorigin\$="[[crossorigin]]" hidden\$="[[audioOnly]]" lang\$="[[lang]]" src\$="[[manifest]]" preload="metadata">
      <slot></slot>
      HTML5 video not supported 
    </video>
    <audio id="audio" autoplay\$="[[autoplay]]" crossorigin\$="[[crossorigin]]" hidden\$="[[!audioOnly]]" lang\$="[[lang]]" src\$="[[manifest]]" preload="metadata">
      <slot></slot>
      HTML5 audio not supported 
    </audio>
`,
  is: "a11y-media-video-loader",
  behaviors: [
    a11yMediaBehaviors.MediaProps,
    a11yMediaBehaviors.GeneralFunctions
  ],
  ready: function() {
    let root = this;
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
  getBufferedTime: function() {
    return 0 < this.media.buffered.length
      ? this.media.buffered.end(0)
      : this.getCurrentTime();
  },
  getCurrentTime: function() {
    return this.media.currentTime;
  },
  selectTrack: function(index) {
    this.selectedTrack = this.media.textTracks[index];
    for (let i = 0; i < this.media.textTracks.length; i++) {
      if (parseInt(index) === i) {
        this.media.textTracks[i].mode = "showing";
      } else if (null !== this.media.textTracks[i]) {
        this.media.textTracks[i].mode = "hidden";
      }
    }
  },
  play: function() {
    this.media.play();
  },
  pause: function() {
    this.media.pause();
  },
  stop: function() {
    this.pause();
    this.seek(0);
  },
  restart: function() {
    this.seek(0);
    this.play();
  },
  seek: function(time) {
    this.media.currentTime = time;
  },
  setCC: function(mode) {
    this.media.cc = mode;
    if (this.selectedTrack !== void 0 && !0 == mode) {
      this.selectedTrack.mode = "showing";
      this.$.video.textTracks.value = this.selectedTrackId;
    } else if (this.selectedTrack !== void 0 && null !== this.selectedTrack) {
      this.selectedTrack.mode = "hidden";
      this.$.video.textTracks.value = "";
    }
  },
  setVolume: function(value) {
    this.media.volume = value / 100;
  },
  setPlaybackRate: function(value) {
    this.media.playbackRate = null !== value ? value : 1;
  },
  setAutoplay: function(mode) {
    this.media.autoplay = mode;
  },
  setLoop: function(mode) {
    this.media.loop = mode;
  },
  setMute: function(mode) {
    this.media.muted = mode;
  }
});

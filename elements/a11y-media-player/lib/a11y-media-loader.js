import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "./a11y-media-behaviors.js";
/*link rel="import" href="dashjs-lib.html"*/
/**
`a11y-media-loader`
A LRN element

@demo demo/index.html

@microcopy - the mental model for this element

  ```<a11y-media-loader 
    autoplay$="[[autoplay]]"                    // Is player set to autoplay (not recommended for a11y)?
    cc$="[[cc]]"                                // Are closed captions toggled? 
    height$="[[height]]"                        // The height of player
    lang$="[[lang]]"                            // The language of the media
    loop$="[[loop]]"                            // Is video on a loop?
    muted$="[[muted]]"                          // Is video muted?
    playback-rate$="[[playbackRate]]"           // The playback rate of the video
    volume$="[[volume]]"                        // The initial volume of the video
    width$="[[width]]">                         // The width of player
                                                // video source and tracks 
    <source src="/path/to/video.mp4" type="video/mp4">
    <source src="/path/to/video.webm" type="video/webm">
    <track label="English" kind="subtitles" srclang="en" src="path/to/subtitles/en.vtt" default>
    <track label="Deutsch" kind="subtitles" srclang="de" src="path/to/subtitles/de.vtt">
    <track label="Español" kind="subtitles" srclang="es" src="path/to/subtitles/es.vtt">
  </a11y-media-loader>```
*/
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
      HTML5 video not supported 
    </video>
    <audio id="audio" autoplay\$="[[autoplay]]" crossorigin\$="[[crossorigin]]" hidden\$="[[!audioOnly]]" lang\$="[[lang]]" src\$="[[manifest]]" preload="metadata">
      HTML5 audio not supported 
    </audio>
`,

  is: "a11y-media-loader",

  behaviors: [
    a11yMediaBehaviors.MediaProps,
    a11yMediaBehaviors.GeneralFunctions
  ],

  ready: function() {
    let root = this;
    root.media = root.$.video !== undefined ? root.$.video : root.$.audio;
    /*
    //handles multibitrate manifests
    console.log('manifest null?',this.manifest);
    if(this.manifest !== null){
      var dash = dashjs.MediaPlayer().create();
      
      console.log('manifest',this.manifest);
      dash.initialize(root.$.video, this.manifest, true);
    }*/

    // handles loaded metadata
    root.media.addEventListener("loadedmetadata", function() {
      root.duration = root.media.duration > 0 ? root.media.duration : 0;
      root.tracks = [];
      root.volume = root.muted ? 0 : Math.max(this.volume, 10);
      root.seekable = root.media.seekable;
      root.setVolume(root.volume);
      root.setMute(root.muted, root.volume);
      root.setCC(root.cc);
      root.setLoop(root.loop);
      root.setPlaybackRate(root.playbackRate);

      // adjusts aspect ratio
      root.aspectRatio = root.media.videoWidth / root.media.videoHeight;
      root.fire("media-loaded", this);
    });
  },

  /**
   * gets the buffered time
   */
  getBufferedTime: function() {
    return this.media.buffered.length > 0
      ? this.media.buffered.end(0)
      : this.getCurrentTime();
  },

  /**
   * gets the current time
   */
  getCurrentTime: function() {
    return this.media.currentTime;
  },

  /**
   * selects a specific track by index
   */
  selectTrack: function(index) {
    this.selectedTrack = this.media.textTracks[index];
    for (let i = 0; i < this.media.textTracks.length; i++) {
      if (parseInt(index) === i) {
        this.media.textTracks[i].mode = "showing";
      } else if (this.media.textTracks[i] !== null) {
        this.media.textTracks[i].mode = "hidden";
      }
    }
  },

  /**
   * plays the media
   */
  play: function() {
    this.media.play();
  },

  /**
   * pauses the media
   */
  pause: function() {
    this.media.pause();
  },

  /**
   * stops the media
   */
  stop: function() {
    this.pause();
    this.seek(0);
  },

  /**
   * restarts the media
   */
  restart: function() {
    this.seek(0);
    this.play();
  },

  /**
   * seeks to a specific time
   */
  seek: function(time) {
    this.media.currentTime = time;
  },

  /**
   * sets captions
   */
  setCC: function(mode) {
    this.media.cc = mode;
    if (this.selectedTrack !== undefined && mode == true) {
      this.selectedTrack.mode = "showing";
      this.$.video.textTracks.value = this.selectedTrackId;
    } else if (
      this.selectedTrack !== undefined &&
      this.selectedTrack !== null
    ) {
      this.selectedTrack.mode = "hidden";
      this.$.video.textTracks.value = "";
    }
  },

  /**
   * sets volume of media
   */
  setVolume: function(value) {
    this.media.volume = value / 100;
  },

  /**
   * sets speed/playback rate of media
   */
  setPlaybackRate: function(value) {
    this.media.playbackRate = value !== null ? value : 1;
  },

  /**
   * sets autoplay
   */
  setAutoplay: function(mode) {
    this.media.autoplay = mode;
  },

  /**
   * sets looping
   */
  setLoop: function(mode) {
    this.media.loop = mode;
  },

  /**
   * sets mute
   */
  setMute: function(mode, value) {
    this.media.muted = mode;
  }
});

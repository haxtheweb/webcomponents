/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { A11yMediaBehaviors } from "./a11y-media-behaviors.js";

export { A11yMediaHtml5 };
/**
 * `a11y-media-html5`
 * `Loads HTML5 audio or video. `
 *
 * @microcopy - language worth noting:
```<a11y-media-html5>                   
    <source src="/path/to/video.mp4" type="video/mp4">
    <source src="/path/to/video.webm" type="video/webm">
    <track label="English" kind="subtitles" srclang="en" src="path/to/subtitles/en.vtt" default>
    <track label="Deutsch" kind="subtitles" srclang="de" src="path/to/subtitles/de.vtt">
    <track label="Español" kind="subtitles" srclang="es" src="path/to/subtitles/es.vtt">
  </a11y-media-html5>```
 *
 * @extends A11yMediaBehaviors
 * @customElement
 * @polymer
 */
class A11yMediaHtml5 extends A11yMediaBehaviors {
  // properties available to the custom element for data binding
  static get properties() {
    return {
      /*
       * id of element button controls
       */
      controls: {
        type: String,
        value: "video"
      },
      /**
       * crossorigin attribute for <video> and <audio> tags
       */
      crossorigin: {
        type: String,
        value: null
      },
      /*
       * Is it disabled?
       */
      disabled: {
        type: Boolean,
        value: null
      },
      /*
       * iron-icon type
       */
      icon: {
        type: String,
        value: null
      },
      /*
       * button label
       */
      label: {
        type: String,
        value: null
      },
      /**
       * the language of the media (if different from user interface language)
       */
      mediaLang: {
        name: "mediaLang",
        type: String,
        value: "en"
      },
      /*
       * Is it paused?
       */
      paused: {
        type: Boolean,
        value: true
      },
      /*
       * the seekable range of the media
       */
      seekable: {
        type: Object,
        value: {
          length: 0,
          start: null,
          stop: null
        }
      },
      /**
       * Source of optional thumbnail image
       */
      thumbnailSrc: {
        name: "thumbnailSrc",
        type: String,
        value: null,
        reflectToAttribute: true
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.

   */
  static get tag() {
    return "a11y-media-html5";
  }

  //inherit styles from a11y-media-player or a11y-media-transcript
  constructor() {
    super();
  }

  //render function
  static get template() {
    return html`
      <style include="simple-colors-shared-styles-polymer">
        :host {
          height: 100%;
          display: flex;
          align-items: stretch;
          position: relative;
        }
        :host([hidden]) {
          display: none;
        }
        #video {
          width: 100%;
          max-width: 100%;
        }
      </style>
      <video
        id="video"
        aria-hidden$="[[isYoutube]]"
        autoplay$="[[autoplay]]"
        crossorigin$="[[crossorigin]]"
        hidden$="[[audioOnly]]"
        lang$="[[mediaLang]]"
        on-loadedmetadata="_handleMetadata"
        poster$="[[thumbnailSrc]]"
        src$="[[manifest]]"
        preload="metadata"
      >
        HTML5 video not supported
      </video>
      <audio
        id="audio"
        autoplay$="[[autoplay]]"
        crossorigin$="[[crossorigin]]"
        hidden$="[[!audioOnly]]"
        lang$="[[mediaLang]]"
        on-loadedmetadata="_handleMetadata"
        poster$="[[thumbnailSrc]]"
        preload="metadata"
      >
        HTML5 audio not supported
      </audio>
    `;
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * sets target for a11y keys
   */
  ready() {
    super.ready();
    let root = this;
    root.media =
      root.shadowRoot.querySelector("#video") !== undefined && !root.audioOnly
        ? root.shadowRoot.querySelector("#video")
        : root.shadowRoot.querySelector("#audio");
  }

  /**
   * handles the loaded metadata
   */
  _handleMetadata() {
    let root = this;
    root.duration = root.media.duration > 0 ? root.media.duration : 0;
    root.tracks = [];
    root.volume = root.muted ? 0 : Math.max(this.volume, 10);
    root.seekable = root.media.seekable;
    root.setVolume(root.volume);
    root.setMute(root.muted);
    root.setCC(root.cc);
    root.setLoop(root.loop);
    root.setPlaybackRate(root.playbackRate);

    // adjusts aspect ratio
    root.aspectRatio = root.media.videoWidth / root.media.videoHeight;
    root.dispatchEvent(new CustomEvent("media-loaded", { detail: root }));
  }

  /**
   * gets the buffered time
   */
  getBufferedTime() {
    return this.media.buffered.length > 0
      ? this.media.buffered.end(0)
      : this.getCurrentTime();
  }

  /**
   * gets the current time
   *
   * @returns {float} the elapsed time, in seconds
   */
  getCurrentTime() {
    return this.media.currentTime;
  }

  /**
   * plays the media
   */
  play() {
    this.paused = false;
    this.media.play();
  }

  /**
   * pauses the media
   */
  pause() {
    this.paused = true;
    this.media.pause();
  }

  /**
   * selects a specific track by index
   *
   * @param {float} the index of the track
   */
  selectTrack(index) {
    this.selectedTrack = this.media.textTracks[index];
    for (let i = 0; i < this.media.textTracks.length; i++) {
      if (parseInt(index) === i) {
        this.media.textTracks[i].mode = "showing";
      } else if (this.media.textTracks[i] !== null) {
        this.media.textTracks[i].mode = "hidden";
      }
    }
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
   * seeks to a specific time
   */
  seek(time) {
    this.media.currentTime = time;
  }

  /**
   * sets captions
   *
   * @param {boolean} Turn CC on? `true` is on; `false` or `null` is off.
   *
   */
  setCC(mode) {
    this.media.cc = mode === true;
    if (this.selectedTrack !== undefined && mode == true) {
      this.selectedTrack.mode = "showing";
      this.shadowRoot.querySelector(
        "#video"
      ).textTracks.value = this.selectedTrackId;
    } else if (
      this.selectedTrack !== undefined &&
      this.selectedTrack !== null
    ) {
      this.selectedTrack.mode = "hidden";
      this.shadowRoot.querySelector("#video").textTracks.value = "";
    }
  }

  /**
   * sets volume of media
   *
   * @param {integer} the volume level from 0-100
   */
  setVolume(value) {
    this.media.volume = value / 100;
  }

  /**
   * sets speed/playback rate of media
   *
   * @param {float} the playback rate, where 1 = 100%
   */
  setPlaybackRate(value) {
    this.media.playbackRate = value !== null ? value : 1;
  }

  /**
   * sets looping
   *
   * @param {boolean} Turn looping on? `true` is on; `false` or `null` is off.
   */
  setLoop(mode) {
    this.media.loop = mode === true;
  }

  /**
   * sets mute
   *
   * @param {boolean} Turn mute on? `true` is on; `false` or `null` is off.
   */
  setMute(mode) {
    this.media.muted = mode;
  }
}
window.customElements.define(A11yMediaHtml5.tag, A11yMediaHtml5);

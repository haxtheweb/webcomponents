/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { A11yMediaBehaviors } from "./a11y-media-behaviors.js";

export { A11yMediaHtml5 };
/**
 * `a11y-media-html5`
 * loads HTML5 audio or video. 
 *
 * @extends A11yMediaBehaviors
 * @customElement
 */
class A11yMediaHtml5 extends A11yMediaBehaviors {
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      /*
       * id of element button controls
       */
      controls: {
        type: String
      },
      /**
       * crossorigin attribute for <video> and <audio> tags
       */
      crossorigin: {
        type: String
      },
      /*
       * Is it disabled?
       */
      disabled: {
        type: Boolean
      },
      /*
       * iron-icon type
       */
      icon: {
        type: String
      },
      /*
       * button label
       */
      label: {
        type: String
      },
      /**
       * the language of the media (if different from user interface language)
       */
      mediaLang: {
        attribute: "media-lang",
        type: String
      },
      /*
       * Is it paused?
       */
      paused: {
        attribute: "paused",
        type: Boolean
      },
      /*
       * the seekable range of the media
       */
      seekable: {
        attribute: "seekable",
        type: Object
      },
      /**
       * Source of optional thumbnail image
       */
      thumbnailSrc: {
        attribute: "thumbnail-src",
        type: String,
        reflect: true
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
    this.controls = "video";
    this.disabled = false;
    this.icon = "";
    this.label = "";
    this.mediaLang = "en";
    this.paused = true;
    this.seekable = {
      length: 0,
      start: null,
      stop: null
    };
    this.media =
    this.shadowRoot.querySelector("#video") !== undefined && !this.audioOnly
        ? this.shadowRoot.querySelector("#video")
        : this.shadowRoot.querySelector("#audio");
  }

  static get styles() {
    return [
      ...super.styles,
      css`
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
      `
    ];
  }
  render() {
    return html`
      <video
        id="video"
        crossorigin="${ifDefined(this.crossorigin)}"
        lang="${this.mediaLang}"
        poster=${ifDefined(this.thumbnailSrc)}
        preload="metadata"
        @loadedmetadata="${this._handleMetadata}"
        ?autoplay="${this.autoplay}"
        ?cc="${this.cc && !this.audioOnly}"
        ?hidden="${this.audioOnly || this.isYoutube}"
      >
        ${this._getLocal('video','notSupported')}
      </video>
      <audio
        id="audio"
        crossorigin="${ifDefined(this.crossorigin)}"
        lang="${this.mediaLang}"
        poster=${ifDefined(this.thumbnailSrc)}
        preload="metadata"
        @loadedmetadata="${this._handleMetadata}"
        ?autoplay="${this.autoplay}"
        ?cc="${this.cc && this.audioOnly}"
        ?hidden="${!this.audioOnly || this.isYoutube}"
      >
        ${this._getLocal('audio','notSupported')}
      </audio>
    `;
  }

  /**
   * handles the loaded metadata
   */
  _handleMetadata() {
    this.duration = this.media.duration > 0 ? this.media.duration : 0;
    this.tracks = [];
    this.volume = this.muted ? 0 : Math.max(this.volume, 10);
    this.seekable = this.media.seekable;
    this.setVolume(this.volume);
    this.setMute(this.muted);
    this.setCC(this.cc);
    this.setLoop(this.loop);
    this.setPlaybackRate(this.playbackRate);

    // adjusts aspect ratio
    this.aspectRatio = this.media.videoWidth / this.media.videoHeight;
    this.dispatchEvent(new CustomEvent("media-loaded", { detail: this }));
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

/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
/**
 * `awesome-explosion`
 * `An awesome, explosion.`
 *
 * @silly
 * @demo demo/index.html
 * @customElement awesome-explosion
 */
class AwesomeExplosion extends PolymerElement {
  constructor() {
    super();
    setTimeout(() => {
      this.addEventListener("click", this._setPlaySound.bind(this));
      this.addEventListener("mouseover", this._setPlaySound.bind(this));
      this.addEventListener("mouseout", this._setStopSound.bind(this));
    }, 0);
  }
  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
        }
        :host([size="tiny"]) #image {
          width: 80px;
          height: 80px;
        }
        :host([size="small"]) #image {
          width: 160px;
          height: 160px;
        }
        :host([size="medium"]) #image {
          width: 240px;
          height: 240px;
        }
        :host([size="large"]) #image {
          width: 320px;
          height: 320px;
        }
        :host([size="epic"]) #image {
          width: 720px;
          height: 720px;
        }

        :host([color="red"]) #image {
          filter: sepia() saturate(10000%) hue-rotate(30deg);
        }
        :host([color="purple"]) #image {
          filter: sepia() saturate(10000%) hue-rotate(290deg);
        }
        :host([color="blue"]) #image {
          filter: sepia() saturate(10000%) hue-rotate(210deg);
        }
        :host([color="orange"]) #image {
          filter: sepia() saturate(10000%) hue-rotate(320deg);
        }
        :host([color="yellow"]) #image {
          filter: sepia() saturate(10000%) hue-rotate(70deg);
        }
        #image {
          width: 240px;
          height: 240px;
        }
      </style>
      <img loading="lazy" src="[[image]]" id="image" class="image-tag" alt="" />
    `;
  }

  static get tag() {
    return "awesome-explosion";
  }

  static get properties() {
    return {
      /**
       * State is for setting:
       * Possible values: play, pause, stop
       */
      state: {
        type: String,
        value: "stop",
        reflectToAttribute: true
      },
      /**
       * Allow for stopping the sound effect.
       */
      stopped: {
        type: Boolean,
        computed: "_calculateStopped(state)"
      },
      /**
       * Allow for playing the sound effect.
       */
      playing: {
        type: Boolean,
        computed: "_calculatePlaying(state)"
      },
      /**
       * Allow for pausing the sound effect.
       */
      paused: {
        type: Boolean,
        computed: "_calculatePaused(state)"
      },
      /**
       * This allows you to swap out the image
       */
      image: {
        type: String,
        value: "assets/explode.gif",
        reflectToAttribute: true
      },
      /**
       * This allows you to swap out the sound.
       */
      sound: {
        type: String,
        value: "assets/273320__clagnut__fireworks.mp3",
        reflectToAttribute: true
      },
      /**
       * This is the size of the element. Possible values are:
       * tiny, small, medium, large, epic
       */
      size: {
        type: String,
        value: "medium",
        reflectToAttribute: true
      },
      /**
       * This is to change the color of the element. Possible values are:
       * red, blue, orange, yellow
       */
      color: {
        type: String,
        value: "",
        reflectToAttribute: true
      },
      /**
       * Allow for resetting the sound effect.
       */
      resetSound: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      }
    };
  }

  /**
   * calculate if it is stopped
   */
  _calculateStopped(newValue, oldValue) {
    if (newValue == "stop") {
      this.stopped = true;
      if (typeof window.audio !== typeof undefined) {
        window.audio.currentTime = 0;
      }
      this._stopSound();
      this.dispatchEvent(
        new CustomEvent("awesome-event", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: { message: "Sound stopped" }
        })
      );
    } else {
      this.stopped = false;
    }
  }

  /**
   * calculate if it is stopped
   */
  _calculatePlaying(newValue, oldValue) {
    if (newValue == "play") {
      this.playing = true;
      this._playSound();
      this.dispatchEvent(
        new CustomEvent("awesome-event", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: { message: "Sound played" }
        })
      );
    } else {
      this.playing = false;
    }
  }

  /**
   * calculate if it is stopped
   */
  _calculatePaused(newValue, oldValue) {
    if (newValue == "pause") {
      this.paused = true;
      this._stopSound();
      this.dispatchEvent(
        new CustomEvent("awesome-event", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: { message: "Sound paused" }
        })
      );
    } else {
      this.paused = false;
    }
  }

  /**
   * Stop the sound effect.
   */
  _stopSound() {
    if (typeof window.audio !== typeof undefined) {
      window.audio.pause();
      if (this.resetSound) {
        window.audio.currentTime = 0;
      }
    }
  }

  /**
   * Set the state to play from an event.
   */
  _setPlaySound(e) {
    this.state = "play";
  }

  /**
   * Set the state to play from an event.
   */
  _setStopSound(e) {
    this.state = "pause";
  }

  /**
   * Play the sound effect.
   */
  _playSound() {
    if (typeof window.audio === typeof undefined) {
      window.audio = new Audio(this.sound);
    }
    window.audio.play();
  }
}
window.customElements.define(AwesomeExplosion.tag, AwesomeExplosion);
export { AwesomeExplosion };

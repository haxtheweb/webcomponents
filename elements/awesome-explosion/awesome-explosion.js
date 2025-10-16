/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
/**
 * `awesome-explosion`
 * `An awesome, explosion.`
 *
 * @silly
 * @demo demo/index.html
 * @element awesome-explosion
 */
class AwesomeExplosion extends DDDSuper(LitElement) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: inline-block;
          cursor: pointer;
          transition: transform var(--ddd-duration-fast) var(--ddd-timing-ease);
        }
        :host(:hover) {
          transform: scale(1.05);
        }
        :host(:focus-visible) {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }

        /* DDD-based sizing using icon variables */
        :host([size="tiny"]) #image {
          width: var(--ddd-icon-sm);
          height: var(--ddd-icon-sm);
        }
        :host([size="small"]) #image {
          width: var(--ddd-icon-lg);
          height: var(--ddd-icon-lg);
        }
        :host([size="medium"]) #image {
          width: var(--ddd-icon-xl);
          height: var(--ddd-icon-xl);
        }
        :host([size="large"]) #image {
          width: var(--ddd-icon-2xl);
          height: var(--ddd-icon-2xl);
        }
        :host([size="epic"]) #image {
          width: var(--ddd-icon-4xl);
          height: var(--ddd-icon-4xl);
        }

        /* DDD-based color theming with dark mode support */
        :host([color="red"]) #image {
          filter: sepia() saturate(10000%) hue-rotate(30deg) brightness(0.9);
        }
        :host([color="purple"]) #image {
          filter: sepia() saturate(10000%) hue-rotate(290deg) brightness(0.9);
        }
        :host([color="blue"]) #image {
          filter: sepia() saturate(10000%) hue-rotate(210deg) brightness(0.9);
        }
        :host([color="orange"]) #image {
          filter: sepia() saturate(10000%) hue-rotate(320deg) brightness(0.9);
        }
        :host([color="yellow"]) #image {
          filter: sepia() saturate(10000%) hue-rotate(70deg) brightness(0.9);
        }

        /* Dark mode adjustments */
        @media (prefers-color-scheme: dark) {
          :host([color]) #image {
            filter-brightness: 1.2;
          }
        }

        /* Respect reduced motion preference */
        @media (prefers-reduced-motion: reduce) {
          :host {
            transition: none;
          }
          :host(:hover) {
            transform: none;
          }
          #image {
            animation: none !important;
          }
        }

        #image {
          width: var(--ddd-icon-xl);
          height: var(--ddd-icon-xl);
          border-radius: var(--ddd-radius-sm);
          transition: filter var(--ddd-duration-fast) var(--ddd-timing-ease);
        }

        /* Accessibility improvements */
        :host([disabled]) {
          pointer-events: none;
          opacity: var(--ddd-opacity-40);
        }

        .visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        }
      `,
    ];
  }
  constructor() {
    super();
    this.state = "stop";
    this.image = new URL("./assets/explode.gif", import.meta.url).href;
    this.sound = new URL(
      "./assets/273320__clagnut__fireworks.mp3",
      import.meta.url,
    ).href;
    this.size = "medium";
    this.color = "";
    this.resetSound = false;
    this.soundEnabled = true;
    this.disabled = false;
    this.tabIndex = 0;

    // Check for user preferences
    this._checkUserPreferences();

    setTimeout(() => {
      this.addEventListener("click", this._handleClick.bind(this));
      this.addEventListener("keydown", this._handleKeydown.bind(this));

      // Only add hover listeners if sound is enabled and motion is not reduced
      if (
        this.soundEnabled &&
        !globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        this.addEventListener("mouseover", this._handleMouseOver.bind(this));
        this.addEventListener("mouseout", this._handleMouseOut.bind(this));
      }
    }, 0);
  }
  render() {
    return html`
      <img
        loading="lazy"
        src="${this.image}"
        id="image"
        class="image-tag"
        alt="${this._getAltText()}"
        role="button"
        aria-pressed="${this.playing ? "true" : "false"}"
        aria-label="${this._getAriaLabel()}"
      />
      <span class="visually-hidden">
        ${this.soundEnabled
          ? "Click or hover to play explosion sound"
          : "Visual explosion effect (sound disabled)"}
      </span>
    `;
  }

  static get tag() {
    return "awesome-explosion";
  }

  /**
   * HAXSchema for proper integration with the HAX editor
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "state") {
        this.stopped = this._calculateStopped(this.state);
        this.playing = this._calculatePlaying(this.state);
        this.paused = this._calculatePaused(this.state);
      }
    });
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * State is for setting:
       * Possible values: play, pause, stop
       */
      state: {
        type: String,
        reflect: true,
      },
      /**
       * Allow for stopping the sound effect.
       */
      stopped: {
        type: Boolean,
      },
      /**
       * Allow for playing the sound effect.
       */
      playing: {
        type: Boolean,
      },
      /**
       * Allow for pausing the sound effect.
       */
      paused: {
        type: Boolean,
      },
      /**
       * This allows you to swap out the image
       */
      image: {
        type: String,
      },
      /**
       * This allows you to swap out the sound.
       */
      sound: {
        type: String,
      },
      /**
       * This is the size of the element. Possible values are:
       * tiny, small, medium, large, epic
       */
      size: {
        type: String,
        reflect: true,
      },
      /**
       * This is to change the color of the element. Possible values are:
       * red, blue, orange, yellow, purple
       */
      color: {
        type: String,
        reflect: true,
      },
      /**
       * Allow for resetting the sound effect.
       */
      resetSound: {
        type: Boolean,
        reflect: true,
        attribute: "reset-sound",
      },
      /**
       * Enable/disable sound effects globally
       */
      soundEnabled: {
        type: Boolean,
        reflect: true,
        attribute: "sound-enabled",
      },
      /**
       * Disable the entire component
       */
      disabled: {
        type: Boolean,
        reflect: true,
      },
    };
  }

  /**
   * calculate if it is stopped
   */
  _calculateStopped(newValue, oldValue) {
    if (newValue == "stop") {
      this.stopped = true;
      if (typeof globalThis.audio !== typeof undefined) {
        globalThis.audio.currentTime = 0;
      }
      this._stopSound();
      this.dispatchEvent(
        new CustomEvent("awesome-event", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: { message: "Sound stopped" },
        }),
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
          detail: { message: "Sound played" },
        }),
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
          detail: { message: "Sound paused" },
        }),
      );
    } else {
      this.paused = false;
    }
  }

  /**
   * Stop the sound effect.
   */
  _stopSound() {
    if (typeof globalThis.audio !== typeof undefined) {
      globalThis.audio.pause();
      if (this.resetSound) {
        globalThis.audio.currentTime = 0;
      }
    }
  }

  /**
   * Handle click events with accessibility considerations
   */
  _handleClick(e) {
    if (this.disabled) return;

    if (this.state === "play") {
      this.state = "stop";
    } else {
      this.state = "play";
    }
  }

  /**
   * Handle keyboard interactions
   */
  _handleKeydown(e) {
    if (this.disabled) return;

    // Space or Enter key
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      this._handleClick(e);
    }
  }

  /**
   * Handle mouse over with reduced motion consideration
   */
  _handleMouseOver(e) {
    if (this.disabled || !this.soundEnabled) return;

    // Only play on hover if not reduced motion
    if (!globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.state = "play";
    }
  }

  /**
   * Handle mouse out
   */
  _handleMouseOut(e) {
    if (this.disabled) return;
    this.state = "pause";
  }

  /**
   * Check user preferences for accessibility
   */
  _checkUserPreferences() {
    // Check for reduced motion preference
    const prefersReducedMotion = globalThis.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Check for user sound preference (could be stored in localStorage)
    const userSoundPref =
      globalThis.localStorage &&
      globalThis.localStorage.getItem("awesome-explosion-sound-enabled");
    if (userSoundPref !== null) {
      this.soundEnabled = userSoundPref === "true";
    }

    // Disable sound on hover if reduced motion is preferred
    if (prefersReducedMotion) {
      this.soundEnabled = false;
    }
  }

  /**
   * Get appropriate alt text for the image
   */
  _getAltText() {
    const colorText = this.color ? ` ${this.color}` : "";
    const sizeText = this.size !== "medium" ? ` ${this.size}` : "";
    return `${sizeText}${colorText} explosion animation`;
  }

  /**
   * Get appropriate ARIA label
   */
  _getAriaLabel() {
    const stateText = this.playing ? "playing" : "stopped";
    const soundText = this.soundEnabled ? " with sound" : " (muted)";
    return `Explosion animation ${stateText}${soundText}. Click to toggle.`;
  }

  /**
   * Set the state to play from an event.
   */
  _setPlaySound(e) {
    this.state = "play";
  }

  /**
   * Set the state to stop from an event.
   */
  _setStopSound(e) {
    this.state = "pause";
  }

  /**
   * Play the sound effect with accessibility considerations.
   */
  _playSound() {
    if (!this.soundEnabled || this.disabled) return;

    // Respect reduced motion preference
    if (globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    if (typeof globalThis.audio === typeof undefined) {
      globalThis.audio = new Audio(this.sound);
      // Set volume to a reasonable level
      globalThis.audio.volume = 0.2;
    }

    // Catch and handle audio play errors gracefully
    globalThis.audio.play().catch((error) => {
      console.warn("Audio playback failed:", error);
      // Could dispatch an event here to notify parent components
    });
  }
}
globalThis.customElements.define(AwesomeExplosion.tag, AwesomeExplosion);
export { AwesomeExplosion };

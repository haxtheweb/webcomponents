/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
const escapeAttr = (value) =>
  String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/**
 * `music-player`
 * `Visualize different types of music and simple format player`
 *
 * @demo demo/index.html
 * @element music-player
 */
class MusicPlayer extends I18NMixin(LitElement) {
  /**
   * Convention we use
   */
  static get tag() {
    return "music-player";
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.noWaterfall = false;
    this.noVisual = false;
    this.visualizer = "staff";
    this.__playing = false;
    this.t = {
      music: "Music",
      midi: "MIDI",
      play: "Play",
      stop: "Stop",
      playbackStarted: "Playback started",
      playbackFinished: "Playback finished",
      playbackStopped: "Playback stopped",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
  }
  //styles function
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none;
        }
        midi-player {
          display: block;
          width: var(--music-player-midi-player-width, unset);
          margin: var(
            --music-player-midi-player-margin,
            var(--ddd-spacing-1, 4px)
          );
        }
        midi-player::part(time) {
          /* the bundled midi-player dims this label to 0.5 opacity while its
             controls are frozen (still initializing), which drops the text
             below WCAG contrast requirements; keep it fully opaque */
          opacity: 1 !important;
        }
        midi-player::part(control-panel) {
          /* the bundled control panel hardcodes light-only surface colors;
             follow DDD dark mode through its light-dark aware theme tokens */
          background: light-dark(
            var(--ddd-theme-default-limestoneMaxLight, #f2f2f4),
            var(--ddd-theme-default-coalyGray, #262626)
          );
          color: light-dark(
            var(--ddd-theme-default-coalyGray, #262626),
            var(--ddd-theme-default-limestoneMaxLight, #f2f2f4)
          );
        }
        midi-player::part(current-time),
        midi-player::part(total-time) {
          /* the bundled time labels hardcode a light-only text color */
          color: light-dark(
            var(--ddd-theme-default-coalyGray, #262626),
            var(--ddd-theme-default-limestoneMaxLight, #f2f2f4)
          );
        }
        .frame {
          box-sizing: border-box;
          border: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          border-radius: var(--ddd-radius-md);
        }
        .frame-header {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
          padding-block: var(--ddd-spacing-2);
          padding-inline: var(--ddd-spacing-4) var(--ddd-spacing-2);
          border-bottom: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          font-family: var(--ddd-font-primary);
        }
        .frame-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: none;
          width: var(--ddd-icon-xs);
          height: var(--ddd-icon-xs);
          border-radius: var(--ddd-radius-circle);
          background-color: light-dark(
            var(--ddd-theme-default-beaverBlue),
            var(--ddd-theme-default-skyBlue)
          );
          color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          --simple-icon-width: var(--ddd-icon-3xs);
          --simple-icon-height: var(--ddd-icon-3xs);
        }
        .frame-text {
          display: flex;
          flex-direction: column;
          flex: 1 1 auto;
          min-width: 0;
        }
        .frame-label {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        :host(:lang(ar)) .frame-label,
        :host(:lang(fa)) .frame-label,
        :host(:lang(he)) .frame-label,
        :host(:lang(ur)) .frame-label {
          letter-spacing: 0;
        }
        .frame-title {
          font-size: var(--ddd-font-size-xs);
          font-weight: var(--ddd-font-weight-bold);
          line-height: var(--ddd-lh-120);
          overflow-wrap: anywhere;
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
        }
        .frame-body {
          display: block;
        }
        .frame-actions {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          flex: none;
        }
        .frame-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: none;
          box-sizing: border-box;
          width: var(--ddd-control-height-sm);
          height: var(--ddd-control-height-sm);
          margin: 0;
          padding: 0;
          cursor: pointer;
          background-color: transparent;
          border: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          border-radius: var(--ddd-radius-rounded);
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
          --simple-icon-width: var(--ddd-icon-3xs);
          --simple-icon-height: var(--ddd-icon-3xs);
        }
        .frame-action:hover:not([disabled]) {
          border-color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
        }
        .frame-action:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .frame-action[disabled] {
          cursor: not-allowed;
          opacity: 0.5;
        }
        .frame-action[aria-pressed="true"] {
          background-color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
          border-color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
          color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        .screen-reader-text {
          border: 0;
          clip: rect(1px, 1px, 1px, 1px);
          clip-path: inset(50%);
          height: 1px;
          margin: -1px;
          width: 1px;
          overflow: hidden;
          position: absolute !important;
          word-wrap: normal !important;
        }
        :host([no-visual]) midi-visualizer {
          display: none;
        }

        :host([no-waterfall]) midi-visualizer .waterfall-notes-container {
          display: none;
        }
        midi-visualizer .waterfall-visualizer {
          overflow: auto;
        }
      `,
    ];
  }

  // render function
  render() {
    const label = `${this.t.music} · ${this.t.midi}`;
    return html`
      <div class="frame" role="group" aria-label="${label}">
        <div class="frame-header">
          <span class="frame-chip" aria-hidden="true"
            ><simple-icon-lite icon="av:library-music"></simple-icon-lite
          ></span>
          <span class="frame-text">
            <span class="frame-label">${label}</span>
          </span>
          <span class="frame-actions">
            <button
              class="frame-action"
              type="button"
              aria-label="${this.__playing ? this.t.stop : this.t.play}"
              title="${this.__playing ? this.t.stop : this.t.play}"
              ?disabled="${!this.source}"
              @click="${this._togglePlayback}"
            >
              <simple-icon-lite
                icon="${this.__playing ? "av:stop" : "av:play-arrow"}"
                aria-hidden="true"
              ></simple-icon-lite>
            </button>
          </span>
        </div>
        <div class="frame-body">
          <midi-visualizer
            type="${this.visualizer}"
            src="${this.source}"
          ></midi-visualizer>
          <midi-player src="${this.source}" sound-font></midi-player>
          <span class="screen-reader-text" aria-live="polite"></span>
        </div>
      </div>
    `;
  }

  haxHooks() {
    return {
      progressiveEnhancement: "haxprogressiveEnhancement",
    };
  }

  /**
   * Hook for HAX progressive enhancement: a link to the music file, for RSS,
   * bots and readers without JavaScript.
   */
  haxprogressiveEnhancement(_el) {
    return this.source
      ? `<a href="${escapeAttr(this.source)}">Play music</a>`
      : "";
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      source: {
        type: String,
      },
      visualizer: {
        type: String,
      },
      noWaterfall: {
        type: Boolean,
        attribute: "no-waterfall",
        reflect: true,
      },
      noVisual: {
        type: Boolean,
        attribute: "no-visual",
        reflect: true,
      },
    };
  }

  /**
   * LitElement life cycle - 1st updated
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.visualizerElement = this.shadowRoot.querySelector("midi-visualizer");
    this.__wirePlaybackAnnouncements();
    this.__wiringTimer = setTimeout(() => {
      this.__wiringTimer = null;
      import("./lib/html-midi-player.js").then((_module) => {
        // associate the visualizer to the player, but never wire a detached
        // element even when the import resolves late
        if (this.isConnected) {
          this.shadowRoot
            .querySelector("midi-player")
            .addVisualizer(this.visualizerElement);
        }
      });
    }, 0);
  }
  /**
   * Removed from the DOM, cancel the deferred visualizer wiring before it
   * can load the bundled player or wire anything.
   */
  disconnectedCallback() {
    if (this.__wiringTimer) {
      clearTimeout(this.__wiringTimer);
      this.__wiringTimer = null;
    }
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
  }
  /**
   * The bundled player keeps its time labels aria-hidden, so announce
   * playback state changes through a visually hidden live region instead.
   */
  __wirePlaybackAnnouncements() {
    const player = this.shadowRoot.querySelector("midi-player");
    const liveStatus = this.shadowRoot.querySelector(".screen-reader-text");
    if (player && liveStatus) {
      player.addEventListener("start", () => {
        liveStatus.textContent = this.t.playbackStarted;
        this.__playing = true;
        this.requestUpdate();
      });
      player.addEventListener("stop", (e) => {
        liveStatus.textContent =
          e.detail && e.detail.finished
            ? this.t.playbackFinished
            : this.t.playbackStopped;
        this.__playing = false;
        this.requestUpdate();
      });
    }
  }
  /**
   * Header play button: drives the same start / stop methods as the
   * player's own play button so both stay in sync through its events.
   */
  _togglePlayback() {
    const player = this.shadowRoot.querySelector("midi-player");
    if (!player || typeof player.start !== "function") {
      return;
    }
    if (player.playing) {
      player.stop();
    } else {
      player.start();
    }
  }
  /**
   * Attached to the DOM, now fire.
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}
globalThis.customElements.define(MusicPlayer.tag, MusicPlayer);
export { MusicPlayer };

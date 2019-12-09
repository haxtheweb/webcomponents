/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { A11yMediaBehaviors } from "./a11y-media-behaviors.js";
import "./a11y-media-transcript-cue.js";
/**
 * `a11y-media-transcript`
 * a transcript element to pair with a11y-media-player.
 *
 * @extends A11yMediaBehaviors
 * @customElement
 */
class A11yMediaTranscript extends A11yMediaBehaviors {
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      /**
       * disable interactive mode that makes the transcript clickable
       */
      disableInteractive: {
        attribute: "disable-interactive",
        type: Boolean
      },
      /**
       * show cue's start and end time
       */
      hideTimestamps: {
        attribute: "hide-timestamps",
        type: Boolean
      },
      /**
       * Language
       */
      lang: {
        attribute: "lang",
        type: String,
        reflect: true
      },
      /**
       * the id of media
       */
      mediaId: {
        attribute: "media-id",
        type: String
      },
      /**
       * selected transcript track id
       */
      selectedTranscript: {
        attribute: "selected-transcript",
        type: String
      },
      /**
       * the status of the transcript loading
       */
      status: {
        attribute: "status",
        type: String
      },
      /**
       * array of cues
       */
      tracks: {
        type: Array
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.

   */
  static get tag() {
    return "a11y-media-transcript";
  }

  //render function
  static get styles() {
    return [
      ...super.styles,
      css`
        @media print {
          #transcript {
            padding: 0 15px 5px;
            color: #000;
            background-color: #ffffff;
            border-top: 1px solid #aaa;
          }
        }
      `
    ];
  }

  render() {
    return html`
      <a id="transcript-desc" class="sr-only" href="#bottom">
        ${this._getLocal("transcript", "skip")}
      </a>
      <div id="loading" aria-live="polite" class="transcript-from-track">
        ${this.status}
      </div>
      ${this.tracks.map((track, index) => {
        return html`
          <div
            aria-live="polite"
            class="transcript-from-track"
            lang="${track.language}"
            ?active="${this.selectedTranscript &&
              parseInt(this.selectedTranscript) === parseInt(index)}"
          >
            ${track.cues.map(cue => {
              return html`
                <a11y-media-transcript-cue
                  accent-color="${this.accentColor}"
                  controls="${this.mediaId}"
                  end="${cue.end}"
                  order="${cue.order}"
                  role="button"
                  start="${cue.start}"
                  tabindex="0"
                  text="${cue.text}"
                  @click="${e => this._handleCueSeek(cue)}"
                  ?active="${this.activeCues &&
                    this.activeCues.includes(cue.order.toString())}"
                  ?disabled="${this.disableInteractive || this.disableSeek}"
                  ?hide-timestamps="${this.hideTimestamps}"
                >
                </a11y-media-transcript-cue>
              `;
            })}
          </div>
        `;
      })}
      <div id="bottom" class="sr-only"></div>
    `;
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  constructor() {
    super();
    this.activeCues = null;
    this.disableInteractive = false;
    this.hideTimestamps = false;
    this.lang = "en";
    this.mediaId = null;
    this.selectedTranscript = "0";
    this.tracks = [];
    this.status = this._getLocal("transcript", "loading");
    this.tabindex = 0;
    /**
     * Fires when transcript is ready
     * @event transcript-ready
     */
    this.dispatchEvent(new CustomEvent("transcript-ready", { detail: this }));
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "disableInteractive")
        this.tabindex = this._getTabIndex(this.disableInteractive);
      if (
        propName === "localization" ||
        propName === "tracks" ||
        propName === "disableSeek"
      )
        this.status =
          this.tracks.length > 0
            ? ""
            : this.disableSeek
            ? this._getLocal("youTubeTranscript", "loading")
            : this._getLocal("transcript", "loading");
    });
  }

  /**
   * updates activeCues array and scrolls to position
   *
   * @param {array} an array of cues
   */
  setActiveCues(cues) {
    let track = this.shadowRoot.getElementById("track"),
      offset = track !== null && track !== undefined ? track.offsetTop : 0,
      cue = this.shadowRoot.getElementById(
        "track a11y-media-transcript-cue[active]"
      );
    this.activeCues = cues.slice(0);
    if (
      !this.disableScroll &&
      cue !== undefined &&
      cue !== null &&
      this.activeCues !== undefined &&
      cue.getAttribute("order") !== this.activeCues[0]
    ) {
      //javascript scrolling from:  https://stackoverflow.com/questions/8917921/cross-browser-javascript-not-jquery-scroll-to-top-animation#answer-8918062
      let scrollingTo = (element, to, duration) => {
        if (duration <= 0) return;
        var difference = to - element.scrollTop;
        var perTick = (difference / duration) * 10;

        setTimeout(() => {
          element.scrollTop = element.scrollTop + perTick;
          if (element.scrollTop === to) return;
          scrollingTo(element, to, duration - 10);
        }, 10);
      };
      scrollingTo(this, cue.offsetTop - offset, 250);
    }
  }

  /**
   * fires an event when media is associated with the player
   *
   * @param {object} the player
   */
  setMedia(player) {
    this.media = player;
    this.dispatchEvent(new CustomEvent("transcript-ready", { detail: this }));
  }

  /**
   * loads tracks from array
   *
   * @param {array} an array of tracks
   */
  setTracks(tracks) {
    console.log("setTracks", tracks);
    this.tracks = tracks.slice(0);
  }

  /**
   * fires an event when media is associated with the player
   *
   * @param {boolean} Hide transcript? `true` is hidden, `false` is visible, and `null` toggles based on current state.
   */
  toggleHidden(mode) {
    let inner = document.getElementById("inner"),
      active =
        inner !== null && inner !== undefined
          ? inner.querySelector("a11y-media-transcript-cue[active]")
          : null,
      first =
        inner !== null && inner !== undefined
          ? inner.querySelector("a11y-media-transcript-cue")
          : null;
    mode = mode !== undefined ? mode : this.hidden;
    this.hidden = mode;
  }

  /**
   * gets the tab-index of cues based on whether or not interactive cues are disabled
   *
   * @param {boolean} Is the interactive transcript mode disabled?
   * @returns {integer} the tabindex of the cue
   */
  _getTabIndex(disableInteractive) {
    return disableInteractive ? -1 : 0;
  }

  /**
   * forwards the listener for transcript cue click to seek accordingly
   */
  _handleCueSeek(cue) {
    if (!this.disableInteractive) {
      this.dispatchEvent(
        /**
         * Fires when transcript is is being used to seek
         * @event transcript-seek
         */
        new CustomEvent("transcript-seek", { detail: cue.seek })
      );
    }
  }

  /**
   * determines if this is the currently selected transcript to show or hide
   *
   * @param {integer} the index of the transcript
   */
  _isLoading(selectedTranscript, tracks) {
    return (
      selectedTranscript === undefined ||
      selectedTranscript === null ||
      tracks === undefined ||
      tracks === null ||
      tracks.length === 0
    );
  }
}
window.customElements.define(A11yMediaTranscript.tag, A11yMediaTranscript);
export { A11yMediaTranscript };

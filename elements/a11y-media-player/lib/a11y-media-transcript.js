/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { A11yMediaBehaviors } from "./a11y-media-behaviors.js";
import "./a11y-media-transcript-cue.js";

export { A11yMediaTranscript };
/**
 * `a11y-media-transcript`
 * `A transcript element to pair with a11y-media-player.`
 *
 * @microcopy - language worth noting:
```<a11y-media-transcript 
  accent-color$="[[accentColor]]"                 // Optional accent color highlighted cues, 
                                                  // using the following materialize colors: 
                                                  // red, pink, purple, deep-purple, indigo, blue, 
                                                  // light blue, cyan, teal, green, light green, lime, 
                                                  // yellow, amber, orange, deep-orange, and brown. 
                                                  // Default is null. 
  custom-microcopy$="[[customMicrocopy]]"         // Optional customization or text and icons
  disable-interactive$="[[disableInteractive]]"   // Disable interactive transcript cues?
  disable-scroll$="[[disableScroll]]"             // Disable autoscrolling transcript as video plays? 
  disable-search$="[[disableSearch]]"             // Disable transcript search? 
  hide-timestamps$="[[hideTimestamps]]"           // Hide cue timestamps?
  media-id=""                                     // The id of the player
  selected-transcript$="[[selectedTranscript]]">  // The index of the current track
</a11y-media-transcript>```
 *
 * @extends A11yMediaBehaviors
 * @customElement
 * @polymer
 */
class A11yMediaTranscript extends A11yMediaBehaviors {
  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * array of cues
       */
      activeCues: {
        type: Array,
        value: null,
        reflectToAttribute: true,
        notify: true
      },
      /**
       * selected transcript track id
       */
      disableCue: {
        type: Boolean,
        computed: "_areCuesDisabled(disableInteractive,disableSeek)"
      },
      /**
       * disable interactive mode that makes the transcript clickable
       */
      disableInteractive: {
        name: "disableInteractive",
        type: Boolean,
        value: false
      },
      /**
       * show cue's start and end time
       */
      hideTimestamps: {
        name: "hideTimestamps",
        type: Boolean,
        value: false
      },
      /**
       * Language
       */
      lang: {
        type: String,
        value: "en",
        reflectToAttribute: true
      },
      /**
       * the id of media
       */
      mediaId: {
        type: String,
        value: null
      },
      /**
       * tabindex of cues
       */
      tabIndex: {
        type: Number,
        computed: "_getTabIndex(disableInteractive)"
      },
      /**
       * tabindex of cues
       */
      role: {
        type: Number,
        computed: "_getRole(disableInteractive)"
      },
      /**
       * selected transcript track id
       */
      selectedTranscript: {
        type: String,
        value: "0"
      },
      /**
       * the status of the transcript loading
       */
      status: {
        type: String,
        computed: "_stampLoadingStatus(disableSeek)"
      },
      /**
       * array of cues
       */
      tracks: {
        type: Array,
        value: null
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "a11y-media-transcript";
  }

  //get player-specifc properties
  static get behaviors() {
    return [A11yMediaBehaviors];
  }

  //render function
  static get template() {
    return html`
      <style is="custom-style" include="simple-colors">
        :host {
          color: var(--a11y-media-transcript-cue-color);
          background-color: var(--a11y-media-transcript-cue-bg-color);
          border-left: 1px solid var(--a11y-media-transcript-bg-color);
        }
        :host([hidden]) {
          display: none !important;
        }
        :host .transcript-from-track {
          display: none;
          width: calc(100% - 30px);
          padding: 0 15px 15px;
          color: var(--a11y-media-transcript-cue-color);
          background-color: var(--a11y-media-transcript-cue-bg-color);
        }
        :host .transcript-from-track[active] {
          display: table;
        }
        :host .transcript-from-track[active][hideTimestamps] {
          display: block;
        }
        :host .sr-only:not(:focus) {
          position: absolute;
          left: -99999;
          top: 0;
          height: 0;
          width: 0;
          overflow: hidden;
        }
        @media print {
          :host {
            padding: 0 15px 5px;
            color: #000;
            background-color: #ffffff;
            border-top: 1px solid #aaa;
          }
        }
      </style>
      <a id="transcript-desc" class="sr-only" href="#bottom">
        [[_getLocal('transcript','skip')]]
      </a>
      <div
        id="loading"
        active$="[[_isLoading(selectedTranscript, tracks)]]"
        class="transcript-from-track"
      >
        [[status]]
      </div>
      <template id="tracks" is="dom-repeat" items="{{tracks}}" as="track">
        <div
          id="track"
          class="transcript-from-track"
          lang="{{track.language}}"
          active$="[[_isActive(selectedTranscript,index)]]"
        >
          <template is="dom-repeat" items="{{track.cues}}" as="cue">
            <a11y-media-transcript-cue
              accent-color$="[[accentColor]]"
              active-cues$="[[activeCues]]"
              controls$="[[mediaId]]"
              cue$="{{cue}}"
              disabled$="[[disableCue]]"
              disable-search$="[[disableSearch]]"
              hide-timestamps$="[[hideTimestamps]]"
              on-tap="_handleCueSeek"
              order$="{{cue.order}}"
              role="button"
              search="[[search]]"
              tabindex="0"
            >
            </a11y-media-transcript-cue>
          </template>
        </div>
      </template>
      <div id="bottom" class="sr-only"></div>
    `;
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.dispatchEvent(new CustomEvent("transcript-ready", { detail: this }));
  }

  /**
   * sets target for a11y keys
   */
  ready() {
    super.ready();
  }

  /**
   * prints the active transcript
   *
   * @param {string} the title of the media
   */
  print(mediaTitle) {
    let root = this,
      track = root.shadowRoot.querySelector("#track[active]").cloneNode(true),
      css = html`
        <style>
          a11y-media-transcript-cue {
            display: table-row;
            background-color: #fff;
            color: #000;
          }
          a11y-media-transcript-cue[hide-timestamps],
          a11y-media-transcript-cue[hide-timestamps] #text {
            display: inline;
          }
          a11y-media-transcript-cue #text {
            display: table-cell;
            line-height: 200%;
          }
          a11y-media-transcript-cue #time {
            display: table-cell;
            font-size: 80%;
            padding: 0 16px;
            white-space: nowrap;
            font-family: monospace;
          }
          a11y-media-transcript-cue[hide-timestamps] #time {
            display: none;
          }
          a11y-media-transcript-cue [matched] {
            background-color: #fff;
            color: #eee;
            padding: 3px 4px;
            border-radius: 3px;
          }
        </style>
      `,
      h1 = html`
        <h1>Transcript</h1>
      `;
    if (mediaTitle !== undefined) h1.innerHTML = mediaTitle;
    if ((track !== null) & (track !== undefined)) {
      //From https://stackoverflow.com/questions/1071962/how-do-i-print-part-of-a-rendered-html-page-in-javascript#answer-1072151
      let print = window.open(
        "",
        "",
        "left=0,top=0,width=552,height=477,toolbar=0,scrollbars=0,status =0"
      );
      print.document.body.appendChild(css);
      print.document.body.appendChild(h1);
      print.document.body.appendChild(track);
      print.document.close();
      print.focus();
      print.print();
      print.close();
    }
  }

  /**
   * updates activeCues array and scrolls to position
   *
   * @param {array} an array of cues
   */
  setActiveCues(cues) {
    let root = this,
      offset =
        root.shadowRoot.querySelector("#track") !== null &&
        root.shadowRoot.querySelector("#track") !== undefined
          ? root.shadowRoot.querySelector("#track").offsetTop
          : 0,
      cue = root.shadowRoot.querySelector(
        "#track a11y-media-transcript-cue[active]"
      );
    root.set("activeCues", cues.slice(0));
    if (
      !root.disableScroll &&
      cue !== null &&
      cue !== undefined &&
      cue !== this.__activeCue
    ) {
      //javascript scrolling from:  https://stackoverflow.com/questions/8917921/cross-browser-javascript-not-jquery-scroll-to-top-animation#answer-8918062
      let scrollingTo = function(element, to, duration) {
        if (duration <= 0) return;
        var difference = to - element.scrollTop;
        var perTick = (difference / duration) * 10;

        setTimeout(function() {
          element.scrollTop = element.scrollTop + perTick;
          if (element.scrollTop === to) return;
          scrollingTo(element, to, duration - 10);
        }, 10);
      };
      scrollingTo(root, cue.offsetTop - offset, 250);
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
    this.set("tracks", tracks.slice(0));
    this.notifyPath("tracks");
    if (this.tracks !== undefined && this.tracks.length > 0)
      this.$.tracks.render();
  }

  /**
   * fires an event when media is associated with the player
   *
   * @param {boolean} Hide transcript? `true` is hidden, `false` is visible, and `null` toggles based on current state.
   */
  toggleHidden(mode) {
    let root = this,
      inner = document.getElementById("inner"),
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
   * determines if cues should be disabled
   *
   * @param {boolean} Is the interactive transcript mode disabled?
   * @param {boolean} Is seeking disabled?
   * @returns {boolean} if the cue is disabled
   */
  _areCuesDisabled(disableInteractive, disableSeek) {
    return disableInteractive || disableSeek;
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
   * gets the role of cues based on whether or not interactive cues are disabled
   *
   * @param {boolean} Is the interactive transcript mode disabled?
   * @returns {string} the role of the cue, `button` or `null`
   */
  _getRole(disableInteractive) {
    return disableInteractive ? null : "button";
  }

  /**
   * forwards the listener for transcript cue click to seek accordingly
   */
  _handleCueSeek(e) {
    if (!this.disableCue) {
      this.dispatchEvent(new CustomEvent("cue-seek", { detail: e.detail }));
    }
  }

  /**
   * determines if this is the currently selected transcript to show or hide
   *
   * @param {integer} the index of the transcript
   */
  _isActive(selectedTranscript, index) {
    return (
      selectedTranscript !== undefined &&
      selectedTranscript !== null &&
      parseInt(selectedTranscript) === parseInt(index)
    );
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

  _stampLoadingStatus(disableSeek) {
    this.$.loading.innerHTML =
      disableSeek === false
        ? this._getLocal("transcript", "label")
        : this._getLocal("youTubeTranscript", "label");
    return this.$.loading.innerHTML;
  }
}
window.customElements.define(A11yMediaTranscript.tag, A11yMediaTranscript);

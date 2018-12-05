/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { A11yMediaPlayerProperties } from "./a11y-media-player-properties.js";
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
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class A11yMediaTranscript extends A11yMediaPlayerProperties {
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
    return [A11yMediaPlayerProperties];
  }

  //render function
  static get template() {
    return html`
      <style is="custom-style" include="simple-colors">
        :host {
          display: block;
          padding: 15px;
          color: var(--a11y-media-transcript-color);
          background-color: var(--a11y-media-transcript-bg-color);
        }

        :host([hidden]) {
          display: none;
        }
        :host #inner {
          width: 100%;
          display: none;
        }
        :host #inner[active] {
          display: table;
          width: 100%;
        }
        :host #inner[active][hideTimestamps] {
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
      <a id="transcript-desc" href="#bottom" class="sr-only"
        >[[skipTranscriptLink]]</a
      >
      <template id="tracks" is="dom-repeat" items="{{tracks}}" as="track">
        <div
          id="inner"
          class="transcript-from-track"
          lang="{{track.language}}"
          active$="[[track.active]]"
        >
          <template is="dom-repeat" items="{{track.cues}}" as="cue">
            <a11y-media-transcript-cue
              accent-color$="[[accentColor]]"
              active-cues$="[[activeCues]]"
              controls$="[[mediaId]]"
              cue$="{{cue}}"
              disabled$="[[disableInteractive]]"
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
   * fires an event when media is associated with the player
   */
  setMedia(player) {
    this.media = player;
    this.dispatchEvent(new CustomEvent("transcript-ready", { detail: this }));
  }

  /**
   * fires an event when media is associated with the player
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
   * prints the active transcript
   */
  print(mediaTitle) {
    let root = this,
      track = root.shadowRoot.querySelector("#inner[active]"),
      css =
        "a11y-media-transcript-cue{display:table-row;background-color:#fff;color:#000}a11y-media-transcript-cue[hide-timestamps],a11y-media-transcript-cue[hide-timestamps] #text{display:inline}a11y-media-transcript-cue #text{display:table-cell;line-height:200%}a11y-media-transcript-cue #time{display:table-cell;font-size:80%;padding:0 16px;white-space:nowrap;font-family:monospace}a11y-media-transcript-cue[hide-timestamps] #time{display:none}a11y-media-transcript-cue [matched]{background-color:#fff;color:#eee;padding:.16px 4px;border-radius:.16px}";
    mediaTitle = mediaTitle !== undefined ? mediaTitle : "Transcript";
    if ((track !== null) & (track !== undefined)) {
      //From https://stackoverflow.com/questions/1071962/how-do-i-print-part-of-a-rendered-html-page-in-javascript#answer-1072151
      let print = window.open(
          "",
          "",
          "left=0,top=0,width=552,height=477,toolbar=0,scrollbars=0,status =0"
        ),
        node = dom(root).node;
      print.document.write(
        "<style>" +
          css +
          "</style><h1>" +
          mediaTitle +
          "</h1>" +
          track.innerHTML
      );
      print.document.close();
      print.focus();
      print.print();
      print.close();
    }
  }

  /**
   * loads tracks from array
   */
  setTracks(tracks) {
    this.set("tracks", tracks.slice(0));
    this.notifyPath("tracks");
    if (this.tracks !== undefined && this.tracks.length > 0)
      this.$.tracks.render();
  }

  /**
   * updates activeCues array and scrolls to position
   */
  setActiveCues(cues) {
    let root = this,
      offset =
        root.shadowRoot.querySelector("#inner") !== null &&
        root.shadowRoot.querySelector("#inner") !== undefined
          ? root.shadowRoot.querySelector("#inner").offsetTop
          : 0,
      cue = root.shadowRoot.querySelector(
        "#inner a11y-media-transcript-cue[active]"
      );
    root.set("activeCues", cues.slice(0));
    if (!root.disableScroll && (cue !== null) & (cue !== undefined)) {
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
   * gets the tab-index of cues based on whether or not interactive cues are disabled
   */
  _getTabIndex(disableInteractive) {
    return disableInteractive ? -1 : 0;
  }

  /**
   * gets the tab-index of cues based on whether or not interactive cues are disabled
   */
  _getRole(disableInteractive) {
    return disableInteractive ? null : "button";
  }

  /**
   * forwards the listener for transcript cue click to seek accordingly
   */
  _handleCueSeek(e) {
    if (!this.disableInteractive) {
      this.dispatchEvent(new CustomEvent("cue-seek", { detail: e.detail }));
    }
  }

  /**
   * determines if this is the currently selected transcript to show or hide
   */
  setActiveTranscript(index) {
    if (this.tracks !== undefined && this.tracks !== null) {
      for (let i = 0; i < this.tracks.length; i++) {
        if (parseInt(index) === i) {
          this.selectedTranscript = parseInt(index);
          this.set("tracks." + i + ".active", true);
        } else if (this.tracks[i] !== null) {
          this.set("tracks." + i + ".active", false);
        }
        this.notifyPath("tracks." + i + ".active");
      }
    }
    this.$.tracks.render();
  }
}
window.customElements.define(A11yMediaTranscript.tag, A11yMediaTranscript);

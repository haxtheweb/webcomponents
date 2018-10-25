import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "@lrnwebcomponents/responsive-utility/responsive-utility.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "./a11y-media-behaviors.js";
import "./a11y-media-transcript-cue.js";
/**
`a11y-media-transcript`
A transcript element to pair with a11y-media-player

@demo demo/index.html

@microcopy - the mental model for this element
  <a11y-media-transcript 
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
  </a11y-media-transcript>

*/
Polymer({
  _template: html`
    <style is="custom-style">
      :host {
        display: block;
        padding: 15px;
        color: var(--a11y-media-transcript-color);
        background-color: var(--a11y-media-transcript-bg-color);
      }

      :host[hidden] {
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
    <a id="transcript-desc" href="#bottom" class="sr-only">[[skipTranscriptLink]]</a>
    <template id="tracks" is="dom-repeat" items="{{tracks}}" as="track">
      <div id="inner" class="transcript-from-track" lang="{{track.language}}" active\$="[[track.active]]">
        <template is="dom-repeat" items="{{track.cues}}" as="cue">
          <a11y-media-transcript-cue accent-color\$="[[accentColor]]" active-cues\$="[[activeCues]]" controls\$="[[mediaId]]" cue\$="{{cue}}" disabled\$="[[disableInteractive]]" disable-search\$="[[disableSearch]]" hide-timestamps\$="[[hideTimestamps]]" order\$="{{cue.order}}" role="button" search="[[search]]" tabindex="0">
          </a11y-media-transcript-cue>
        </template>
      </div>
    </template>
    <div id="bottom" class="sr-only"></div>
`,

  is: "a11y-media-transcript",

  listeners: {
    "cue-seek": "_onCueSeek"
  },

  behaviors: [
    simpleColorsBehaviors,
    a11yMediaBehaviors.GeneralFunctions,
    a11yMediaBehaviors.TranscriptBehaviors
  ],

  properties: {
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
  },

  /**
   * fires an event to let the page know there is a transcript container
   */
  attached: function() {
    window.SimpleColorsUtility.requestAvailability();
    this.fire("transcript-ready", this);
  },

  /**
   * fires an event when media is associated with the player
   */
  setMedia: function(player) {
    this.media = player;
    this.fire("transcript-ready", this);
  },

  /**
   * fires an event when media is associated with the player
   */
  toggleHidden: function(mode) {
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
  },

  /**
   * prints the active transcript
   */
  print: function(mediaTitle) {
    let root = this,
      track = root.shadowRoot.querySelector("#inner[active]"),
      css =
        "a11y-media-transcript-cue{display:table-row;background-color:#fff;color:#000}a11y-media-transcript-cue[hide-timestamps],a11y-media-transcript-cue[hide-timestamps] #text{display:inline}a11y-media-transcript-cue #text{display:table-cell;line-height:200%}a11y-media-transcript-cue #time{display:table-cell;font-size:80%;padding:0 1em;white-space:nowrap;font-family:monospace}a11y-media-transcript-cue[hide-timestamps] #time{display:none}a11y-media-transcript-cue [matched]{background-color:#fff;color:#eee;padding:.1em .25em;border-radius:.1em}";
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
  },

  /**
   * loads tracks from array
   */
  setTracks: function(tracks) {
    this.set("tracks", tracks.slice(0));
    if (this.tracks !== undefined && this.tracks.length > 0)
      this.$.tracks.render();
  },

  /**
   * updates activeCues array and scrolls to position
   */
  setActiveCues: function(cues) {
    //console.log('setActiveCues',cues);
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
  },

  /**
   * gets the tab-index of cues based on whether or not interactive cues are disabled
   */
  _getTabIndex: function(disableInteractive) {
    return disableInteractive ? -1 : 0;
  },

  /**
   * gets the tab-index of cues based on whether or not interactive cues are disabled
   */
  _getRole: function(disableInteractive) {
    return disableInteractive ? null : "button";
  },

  /**
   * forwards the listener for transcript cue click to seek accordingly
   */
  _onCueSeek: function(e) {
    this.fire("transcript-seek", e.detail);
  },

  /**
   * determines if this is the currently selected transcript to show or hide
   */
  setActiveTranscript: function(index) {
    if (this.tracks !== undefined && this.tracks !== null) {
      for (let i = 0; i < this.tracks.length; i++) {
        if (parseInt(index) === i) {
          this.selectedTranscript = parseInt(index);
          this.set("tracks." + i + ".active", true);
        } else if (this.tracks[i] !== null) {
          this.set("tracks." + i + ".active", false);
        }
      }
    }
    this.$.tracks.render();
  }
});

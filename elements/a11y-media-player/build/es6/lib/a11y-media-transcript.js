import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import "../node_modules/@lrnwebcomponents/responsive-utility/responsive-utility.js";
import "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";
import "./a11y-media-behaviors.js";
import "./a11y-media-transcript-cue.js";
Polymer({
  _template: html`
    <style is="custom-style">
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
  listeners: { "cue-seek": "_onCueSeek" },
  behaviors: [
    simpleColorsBehaviors,
    a11yMediaBehaviors.GeneralFunctions,
    a11yMediaBehaviors.TranscriptBehaviors
  ],
  properties: {
    activeCues: {
      type: Array,
      value: null,
      reflectToAttribute: !0,
      notify: !0
    },
    lang: { type: String, value: "en", reflectToAttribute: !0 },
    mediaId: { type: String, value: null },
    tabIndex: { type: Number, computed: "_getTabIndex(disableInteractive)" },
    role: { type: Number, computed: "_getRole(disableInteractive)" },
    selectedTranscript: { type: String, value: "0" },
    tracks: { type: Array, value: null }
  },
  attached: function() {
    window.SimpleColorsUtility.requestAvailability();
    this.fire("transcript-ready", this);
  },
  setMedia: function(player) {
    this.media = player;
    this.fire("transcript-ready", this);
  },
  toggleHidden: function(mode) {
    let root = this,
      inner = document.getElementById("inner"),
      active =
        null !== inner && inner !== void 0
          ? inner.querySelector("a11y-media-transcript-cue[active]")
          : null,
      first =
        null !== inner && inner !== void 0
          ? inner.querySelector("a11y-media-transcript-cue")
          : null;
    mode = mode !== void 0 ? mode : this.hidden;
    this.hidden = mode;
  },
  print: function(mediaTitle) {
    let root = this,
      track = root.shadowRoot.querySelector("#inner[active]"),
      css =
        "a11y-media-transcript-cue{display:table-row;background-color:#fff;color:#000}a11y-media-transcript-cue[hide-timestamps],a11y-media-transcript-cue[hide-timestamps] #text{display:inline}a11y-media-transcript-cue #text{display:table-cell;line-height:200%}a11y-media-transcript-cue #time{display:table-cell;font-size:80%;padding:0 16px;white-space:nowrap;font-family:monospace}a11y-media-transcript-cue[hide-timestamps] #time{display:none}a11y-media-transcript-cue [matched]{background-color:#fff;color:#eee;padding:.16px 4px;border-radius:.16px}";
    mediaTitle = mediaTitle !== void 0 ? mediaTitle : "Transcript";
    if ((null !== track) & (track !== void 0)) {
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
  setTracks: function(tracks) {
    this.set("tracks", tracks.slice(0));
    this.notifyPath("tracks");
    if (this.tracks !== void 0 && 0 < this.tracks.length)
      this.$.tracks.render();
  },
  setActiveCues: function(cues) {
    let root = this,
      offset =
        null !== root.shadowRoot.querySelector("#inner") &&
        root.shadowRoot.querySelector("#inner") !== void 0
          ? root.shadowRoot.querySelector("#inner").offsetTop
          : 0,
      cue = root.shadowRoot.querySelector(
        "#inner a11y-media-transcript-cue[active]"
      );
    root.set("activeCues", cues.slice(0));
    if (!root.disableScroll && (null !== cue) & (cue !== void 0)) {
      let scrollingTo = function(element, to, duration) {
        if (0 >= duration) return;
        var difference = to - element.scrollTop,
          perTick = 10 * (difference / duration);
        setTimeout(function() {
          element.scrollTop = element.scrollTop + perTick;
          if (element.scrollTop === to) return;
          scrollingTo(element, to, duration - 10);
        }, 10);
      };
      scrollingTo(root, cue.offsetTop - offset, 250);
    }
  },
  _getTabIndex: function(disableInteractive) {
    return disableInteractive ? -1 : 0;
  },
  _getRole: function(disableInteractive) {
    return disableInteractive ? null : "button";
  },
  _onCueSeek: function(e) {
    this.fire("transcript-seek", e.detail);
  },
  setActiveTranscript: function(index) {
    if (this.tracks !== void 0 && null !== this.tracks) {
      for (let i = 0; i < this.tracks.length; i++) {
        if (parseInt(index) === i) {
          this.selectedTranscript = parseInt(index);
          this.set("tracks." + i + ".active", !0);
        } else if (null !== this.tracks[i]) {
          this.set("tracks." + i + ".active", !1);
        }
        this.notifyPath("tracks." + i + ".active");
      }
    }
    this.$.tracks.render();
  }
});

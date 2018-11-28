define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "../node_modules/@lrnwebcomponents/responsive-utility/responsive-utility.js",
  "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js",
  "./a11y-media-behaviors.js",
  "./a11y-media-transcript-cue.js"
], function(
  _polymerLegacy,
  _polymerDom,
  _responsiveUtility,
  _simpleColors,
  _a11yMediaBehaviors,
  _a11yMediaTranscriptCue
) {
  "use strict";
  function _templateObject_a6f89660f32c11e8a7ea035229db3ef1() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style is="custom-style">\n      :host {\n        display: block;\n        padding: 15px;\n        color: var(--a11y-media-transcript-color);\n        background-color: var(--a11y-media-transcript-bg-color);\n      }\n\n      :host([hidden]) {\n        display: none;\n      }\n      :host #inner {\n        width: 100%;\n        display: none;\n      }\n      :host #inner[active] {\n        display: table;\n        width: 100%;\n      }\n      :host #inner[active][hideTimestamps] {\n        display: block;\n      }\n      :host .sr-only:not(:focus) {\n        position: absolute;\n        left: -99999;\n        top: 0;\n        height: 0;\n        width: 0;\n        overflow: hidden;\n      }\n      @media print {\n        :host {\n          padding: 0 15px 5px;\n          color: #000;\n          background-color: #ffffff;\n          border-top: 1px solid #aaa;\n        }\n      }\n    </style>\n    <a id="transcript-desc" href="#bottom" class="sr-only">[[skipTranscriptLink]]</a>\n    <template id="tracks" is="dom-repeat" items="{{tracks}}" as="track">\n      <div id="inner" class="transcript-from-track" lang="{{track.language}}" active$="[[track.active]]">\n        <template is="dom-repeat" items="{{track.cues}}" as="cue">\n          <a11y-media-transcript-cue accent-color$="[[accentColor]]" active-cues$="[[activeCues]]" controls$="[[mediaId]]" cue$="{{cue}}" disabled$="[[disableInteractive]]" disable-search$="[[disableSearch]]" hide-timestamps$="[[hideTimestamps]]" order$="{{cue.order}}" role="button" search="[[search]]" tabindex="0">\n          </a11y-media-transcript-cue>\n        </template>\n      </div>\n    </template>\n    <div id="bottom" class="sr-only"></div>\n'
      ],
      [
        '\n    <style is="custom-style">\n      :host {\n        display: block;\n        padding: 15px;\n        color: var(--a11y-media-transcript-color);\n        background-color: var(--a11y-media-transcript-bg-color);\n      }\n\n      :host([hidden]) {\n        display: none;\n      }\n      :host #inner {\n        width: 100%;\n        display: none;\n      }\n      :host #inner[active] {\n        display: table;\n        width: 100%;\n      }\n      :host #inner[active][hideTimestamps] {\n        display: block;\n      }\n      :host .sr-only:not(:focus) {\n        position: absolute;\n        left: -99999;\n        top: 0;\n        height: 0;\n        width: 0;\n        overflow: hidden;\n      }\n      @media print {\n        :host {\n          padding: 0 15px 5px;\n          color: #000;\n          background-color: #ffffff;\n          border-top: 1px solid #aaa;\n        }\n      }\n    </style>\n    <a id="transcript-desc" href="#bottom" class="sr-only">[[skipTranscriptLink]]</a>\n    <template id="tracks" is="dom-repeat" items="{{tracks}}" as="track">\n      <div id="inner" class="transcript-from-track" lang="{{track.language}}" active\\$="[[track.active]]">\n        <template is="dom-repeat" items="{{track.cues}}" as="cue">\n          <a11y-media-transcript-cue accent-color\\$="[[accentColor]]" active-cues\\$="[[activeCues]]" controls\\$="[[mediaId]]" cue\\$="{{cue}}" disabled\\$="[[disableInteractive]]" disable-search\\$="[[disableSearch]]" hide-timestamps\\$="[[hideTimestamps]]" order\\$="{{cue.order}}" role="button" search="[[search]]" tabindex="0">\n          </a11y-media-transcript-cue>\n        </template>\n      </div>\n    </template>\n    <div id="bottom" class="sr-only"></div>\n'
      ]
    );
    _templateObject_a6f89660f32c11e8a7ea035229db3ef1 = function _templateObject_a6f89660f32c11e8a7ea035229db3ef1() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_a6f89660f32c11e8a7ea035229db3ef1()
    ),
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
    attached: function attached() {
      window.SimpleColorsUtility.requestAvailability();
      this.fire("transcript-ready", this);
    },
    setMedia: function setMedia(player) {
      this.media = player;
      this.fire("transcript-ready", this);
    },
    toggleHidden: function toggleHidden(mode) {
      var root = this,
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
    print: function print(mediaTitle) {
      var root = this,
        track = root.shadowRoot.querySelector("#inner[active]"),
        css =
          "a11y-media-transcript-cue{display:table-row;background-color:#fff;color:#000}a11y-media-transcript-cue[hide-timestamps],a11y-media-transcript-cue[hide-timestamps] #text{display:inline}a11y-media-transcript-cue #text{display:table-cell;line-height:200%}a11y-media-transcript-cue #time{display:table-cell;font-size:80%;padding:0 16px;white-space:nowrap;font-family:monospace}a11y-media-transcript-cue[hide-timestamps] #time{display:none}a11y-media-transcript-cue [matched]{background-color:#fff;color:#eee;padding:.16px 4px;border-radius:.16px}";
      mediaTitle = mediaTitle !== void 0 ? mediaTitle : "Transcript";
      if ((null !== track) & (track !== void 0)) {
        var print = window.open(
            "",
            "",
            "left=0,top=0,width=552,height=477,toolbar=0,scrollbars=0,status =0"
          ),
          node = (0, _polymerDom.dom)(root).node;
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
    setTracks: function setTracks(tracks) {
      this.set("tracks", tracks.slice(0));
      this.notifyPath("tracks");
      if (this.tracks !== void 0 && 0 < this.tracks.length)
        this.$.tracks.render();
    },
    setActiveCues: function setActiveCues(cues) {
      var root = this,
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
        var scrollingTo = function scrollingTo(element, to, duration) {
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
    _getTabIndex: function _getTabIndex(disableInteractive) {
      return disableInteractive ? -1 : 0;
    },
    _getRole: function _getRole(disableInteractive) {
      return disableInteractive ? null : "button";
    },
    _onCueSeek: function _onCueSeek(e) {
      this.fire("transcript-seek", e.detail);
    },
    setActiveTranscript: function setActiveTranscript(index) {
      if (this.tracks !== void 0 && null !== this.tracks) {
        for (var i = 0; i < this.tracks.length; i++) {
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
});

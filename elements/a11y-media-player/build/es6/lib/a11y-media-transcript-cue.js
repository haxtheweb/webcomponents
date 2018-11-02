import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "../node_modules/@lrnwebcomponents/simple-search/lib/simple-search-content.js";
import "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";
Polymer({
  _template: html`
    <style is="custom-style">
      :host {
        cursor: default;
        display: table-row;
        width: 100%;
        color: var(--a11y-media-transcript-color);
        background-color: var(--a11y-media-transcript-bg-color);
        transition: color 0.25s, background-color 0.25s;
      }
      :host([hide-timestamps]) {
        display: inline;
      }
      :host(:not([active]):not([disabled]):active),
      :host(:not([active]):not([disabled]):focus),
      :host(:not([active]):not([disabled]):hover) {
        cursor: pointer;
        color: var(--a11y-media-transcript-focused-cue-color);
        background-color: var(--a11y-media-transcript-focused-cue-bg-color);
        outline: 1px dotted var(--a11y-media-transcript-focused-cue-color);
        @apply --a11y-media-transcript-focused-cue;
      }
      :host([active]) {
        color: var(--a11y-media-transcript-active-cue-color);
        background-color: var(--a11y-media-transcript-active-cue-bg-color);
        @apply --a11y-media-transcript-active-cue;
      }
      :host #text {
        display: table-cell;
        width: 100%;
        line-height: 200%;
      }
      :host([hide-timestamps]) #text {
        display: inline;
      }
      :host #time {
        display: table-cell;
        font-size: 80%;
        padding: 0 1em 0 0;
        white-space: nowrap;
        font-family: monospace;
      }
      :host([hide-timestamps]) #time {
        display: none;
      }
      :host simple-search-content {
        --simple-search-match-text-color: var(--a11y-media-transcript-match-color);
        --simple-search-match-bg-color: var(--a11y-media-transcript-match-bg-color);
        --simple-search-match-border-color:  var(--a11y-media-transcript-match-border-color);
        --simple-search-match: {
          border: none;
          border-radius: 0.25em;
          font-weight: normal;
        };
      }
      @media print {
        :host, :host([active]),
        :host(:not([active]):not([disabled]):active),
        :host(:not([active]):not([disabled]):focus),
        :host(:not([active]):not([disabled]):hover) {
          color: #000000;
          background-color: #ffffff;
        }
      }
    </style>
    <span id="time">[[cue.start]] - [[cue.end]]</span>
    <span id="text">
      <simple-search-content id="content" content="[[cue.text]]"></simple-search-content>
    </span>
    <iron-a11y-keys id="a11y" keys="enter" target\$="[[__target]]" on-keys-pressed="_onClick">
    </iron-a11y-keys>
`,
  is: "a11y-media-transcript-cue",
  listeners: { tap: "_onClick" },
  behaviors: [simpleColorsBehaviors, a11yMediaBehaviors.TranscriptBehaviors],
  properties: {
    active: {
      type: Boolean,
      reflectToAttribute: !0,
      computed: "_getActiveCue(cue,activeCues)",
      notify: !0,
      reflectToAttribute: !0
    },
    activeCues: { type: Array, value: null, notify: !0 },
    cue: { type: Array, value: null },
    disabled: { type: Boolean, value: !1 },
    text: { type: String, value: "" }
  },
  ready: function() {
    let root = this,
      search = root.search;
    if (!root.disabled) {
      root.__target = this;
      root.setAttribute("aria-role", "button");
      root.setAttribute("controls", this.mediaId);
    }
    if (!root.disableSearch && root.search !== void 0 && null !== root.search) {
      root.$.content.enableSearch(search);
    }
  },
  print: function() {},
  _getActiveCue: function(cue, activeCues) {
    return null !== activeCues && activeCues.includes(cue.order.toString())
      ? !0
      : !1;
  },
  _onClick: function() {
    if (!this.disabled) {
      this.fire("cue-seek", this);
    }
  }
});

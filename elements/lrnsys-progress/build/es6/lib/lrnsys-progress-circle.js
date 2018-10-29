import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@lrnwebcomponents/circle-progress/circle-progress.js";
import "../node_modules/@polymer/paper-button/paper-button.js";
import "../node_modules/@polymer/paper-tooltip/paper-tooltip.js";
import "../node_modules/@polymer/paper-spinner/paper-spinner.js";
import "@polymer/neon-animation/neon-animation.js";
import "../node_modules/@polymer/iron-icons/iron-icons.js";
Polymer({
  _template: html`
    <style>
      :host {
        --paper-button-ink-color: var(--lrnsys-progress-color, --paper-green-500);
        display: block;
        transition:
          box-shadow var(--lrnsys-progress-circle-transition, 0.5s) linear,
          color var(--lrnsys-progress-circle-transition, 0.5s) ease-in-out,
          background-color var(--lrnsys-progress-circle-transition, .5s) ease-in-out;
      }
      :host[status='complete'] .circle-wrapper {
        --paper-button-ink-color: var(--lrnsys-progress-complete-color, --paper-green-500);
        box-shadow: 0px 0px 0px .1em var(--lrnsys-progress-complete-color, --paper-green-900);
      }
      :host[status='disabled'] .circle-wrapper {
        box-shadow: none;
      }
      :host[status='available'] .circle-wrapper {
        box-shadow: none;
      }
      :host[active] .circle-wrapper {
        box-shadow: 0px 0px 0px .1em var(--google-grey-500);
      }
      .circle-wrapper {
        border-radius: 100%;
      }
      .button {
        margin: 0;
        padding: 0;
        display: block;
        min-width: 2.5em;
        border-radius: 100%;
      }
      paper-button {
        width: var(--lrnsys-progress-circle-size, 2.5em);
        height: var(--lrnsys-progress-circle-size, 2.5em);
      }
      circle-progress {
        margin: 0;
        --circle-progress-width: var(--lrnsys-progress-circle-size, 2.5em);
        --circle-progress-height: var(--lrnsys-progress-circle-size, 2.5em);
        --circle-progress-stroke-color: var(--lrnsys-progress-color, --paper-green-500);
        --circle-progress-bg-stroke-color: var(--lrnsys-progress-container-color, --google-grey-300);
        --circle-progress-transition: 0.5s;
        --circle-progress-stroke-linecap: square;
        transition:
          color .5s ease-in-out,
          background-color .5s ease-in-out;
      }
      paper-spinner {
        display: block;
        width: var(--lrnsys-progress-spinner-size, 2em);
        height: var(--lrnsys-progress-spinner-size, 2em);
        position: absolute;
        z-index: 1;
        margin: .25em;
        padding: 0;
        visibility: visible;
        opacity: 1;
        transition: visibility 0.4s, opacity 0.4s ease;
      }
      paper-spinner.multi {
        --paper-spinner-layer-1-color: var(--paper-purple-500);
        --paper-spinner-layer-2-color: var(--paper-cyan-500);
        --paper-spinner-layer-3-color: var(--paper-blue-grey-500);
        --paper-spinner-layer-4-color: var(--paper-amber-500);
      }
      /* enforce the browser default even strong; NEVER show this */
      [hidden] {
        visibility: hidden !important;
        opacity: 0 !important;
      }
      .transition {
        opacity: .4;
        width: calc(var(--lrnsys-progress-icon-size, 1.5em) - .5em);
        height: calc(var(--lrnsys-progress-icon-size, 1.5em) - .5em);
      }
      iron-icon {
        visibility: visible;
        opacity: 1;
        transition: width 0.1s linear, height 0.1s linear, visibility 0.4s ease, opacity 0.4s ease;
        width: var(--lrnsys-progress-icon-size, 1.5em);
        height: var(--lrnsys-progress-icon-size, 1.5em);
      }
      .disabled {
        background-color: var(--lrnsys-progress-disabled-color, --google-grey-500);
        color: white;
      }
      .loading {
        background-color: white;
        color: black;
      }
      .finished iron-icon:not(.activeIcon) {
        width: calc(var(--lrnsys-progress-icon-size, 1.5em) - .5em);
        height: calc(var(--lrnsys-progress-icon-size, 1.5em) - .5em);
      }
      .available {
        background-color: var(--lrnsys-progress-active-color, --google-grey-300);
        color: var(--lrnsys-progress-active-text-color, --google-grey-500);
      }
      .activeIcon {
        color: black;
      }
      .complete .activeIcon {
        color: white;
      }
      :host[active] .complete .activeIcon,
      :host[active] .finished .activeIcon {
        color: black;
      }
      .complete,
      .finished {
        background-color: var(--lrnsys-progress-container-color, --paper-green-500);
        color: white;
      }
      :host[active] circle-progress {
        background-color: white;
        color: black;
      }
      .listview-title {
        font-size: 1em;
        padding: 0;
        margin: 0;
      }
      .description-content {
        font-size: .5em;
        font-style: italic;
      }
      .circle-wrapper {
        display: inline-block;
      }
      #listview {
        display: inline-block;
        height: 2em;
        padding: .25em 0;
        margin: 0;
        vertical-align: top;
      }
      .link {
        height: 2.5em;
        width: 100%;
      }
      :host[list-view] .button {
        margin: 0;
        padding: 0;
        display: block;
        min-width: 2.5em;
        border-radius: 0;
      }
    </style>
    <paper-tooltip hidden\$="[[!toolTip]]" for="button" position="bottom" offset="8" animation-delay="0">
      [[label]]
    </paper-tooltip>
    <a href="[[url]]" tabindex="-1" class="link">
    <paper-button id="button" class="button" disabled\$="[[disabled]]" title="[[label]]">
      <span class="circle-wrapper">
      <paper-spinner active\$="[[loading]]" hidden\$="[[!loading]]" class="multi" alt\$="Loading content for [[label]]"></paper-spinner>
        <circle-progress class\$="[[status]]" value="[[value]]" max="[[max]]" stroke-width="[[strokeWidth]]" angle="180">
          <iron-icon id="icon" icon="[[activeIcon]]" hidden\$="[[!activeIcon]]"></iron-icon>
          <slot name="image"></slot>
        </circle-progress>
      </span>
      <span id="listview" hidden\$="[[!listView]]">
          <h3 class="listview-title">[[label]]</h3>
          <div class="description-content">
            <slot name="description"></slot>
            <slot></slot>
          </div>
      </span>
    </paper-button>
  </a>
`,
  is: "lrnsys-progress-circle",
  listeners: {
    "button.tap": "tapEventOn",
    "button.mouseover": "focusOn",
    "button.mouseout": "focusOff",
    "button.focused-changed": "focusEvent"
  },
  properties: {
    value: {
      type: String,
      value: 0,
      reflectToAttribute: !0,
      observer: "_testValueComplete"
    },
    toolTip: { type: Boolean, value: !0, reflectToAttribute: !0 },
    listView: { type: Boolean, value: !0, reflectToAttribute: !0 },
    icon: { type: String, value: 0, reflectToAttribute: !0 },
    iconComplete: { type: String, value: 0, reflectToAttribute: !0 },
    loadingIcon: {
      type: String,
      value: "hourglass-full",
      reflectToAttribute: !0
    },
    finishedIcon: { type: String, value: "thumb-up", reflectToAttribute: !0 },
    activeIcon: {
      type: String,
      notify: !0,
      computed: "_getActiveIcon(icon, iconComplete, status)"
    },
    step: { type: Number, value: 0, reflectToAttribute: !0 },
    active: { type: Boolean, value: !1, reflectToAttribute: !0, notify: !0 },
    status: {
      type: String,
      value: "available",
      reflectToAttribute: !0,
      notify: !0,
      observer: "_statusChange"
    },
    disabled: { type: Boolean, computed: "_disableStatus(status)" },
    loading: { type: Boolean, computed: "_loadingStatus(status)" },
    finished: { type: Boolean, computed: "_finishedStatus(status)" },
    max: { type: String, reflectToAttribute: !0 },
    __chimed: { type: Boolean, value: !1 },
    __finishchimed: { type: Boolean, value: !1 },
    url: { type: String, value: "#", reflectToAttribute: !0 },
    dataUrl: { type: String, value: !1, reflectToAttribute: !0 },
    strokeWidth: { type: Number, value: 4 },
    focusState: { type: Boolean, value: !1 },
    playSound: { type: Boolean, value: !1, reflectToAttribute: !0 },
    playFinishSound: { type: Boolean, value: !1, reflectToAttribute: !0 },
    completeSound: {
      type: String,
      value: "assets/complete.mp3",
      reflectToAttribute: !0
    },
    finishedSound: {
      type: String,
      value: "assets/finished.mp3",
      reflectToAttribute: !0
    },
    _bubbleProgress: { type: Object }
  },
  ready: function() {
    this._bubbleProgress = { 25: !1, 50: !1, 75: !1 };
  },
  _testValueComplete: function(newValue) {
    if (newValue >= this.max && "available" == this.status) {
      this.status = "complete";
    } else if (0.75 <= newValue / this.max && !this._bubbleProgress[75]) {
      this.fire("node-percent-milestone", { percentage: 75 });
      this._bubbleProgress[75] = !0;
    } else if (0.5 <= newValue / this.max && !this._bubbleProgress[50]) {
      this.fire("node-percent-milestone", { percentage: 50 });
      this._bubbleProgress[50] = !0;
    } else if (0.25 <= newValue / this.max && !this._bubbleProgress[25]) {
      this.fire("node-percent-milestone", { percentage: 25 });
      this._bubbleProgress[25] = !0;
    }
  },
  focusEvent: function() {
    if (!this.disabled && "loading" != this.status) {
      if (this.focusState) {
        this.$.icon.icon = this.icon;
        this.$.icon.classList.add("activeIcon");
      } else {
        if ("complete" == this.status || "finished" == this.status) {
          this.$.icon.icon = this.activeIcon;
        }
        this.$.icon.classList.remove("activeIcon");
      }
      this.focusState = !this.focusState;
    }
  },
  focusOn: function() {
    if (!this.disabled && "loading" != this.status) {
      this.$.icon.icon = this.icon;
      this.$.icon.classList.add("activeIcon");
    }
  },
  focusOff: function() {
    if (!this.disabled && "loading" != this.status) {
      if ("complete" == this.status || "finished" == this.status) {
        this.$.icon.icon = this.activeIcon;
      }
      this.$.icon.classList.remove("activeIcon");
    }
  },
  tapEventOn: function(e) {
    this.fire("node-is-active", { node: e });
  },
  _getActiveIcon: function(icon, iconComplete, status) {
    if (typeof icon !== typeof void 0) {
      var tmp = icon;
      if ("loading" == status) {
        tmp = this.loadingIcon;
        this.$.icon.classList.add("transition");
      } else if ("finished" == status) {
        tmp = this.finishedIcon;
      } else if (
        "complete" == status &&
        typeof iconComplete !== typeof void 0
      ) {
        if (this.playSound && !this.__chimed) {
          this._playSound();
        }
        tmp = iconComplete;
      } else {
        this.$.icon.classList.remove("transition");
      }
      return tmp;
    }
    return !1;
  },
  _playSound: function() {
    if ("complete" == this.status) {
      window.audio = new Audio(this.completeSound);
      this.__chimed = !0;
    } else if ("finished" == this.status) {
      window.audio = new Audio(this.finishedSound);
      this.__finishchimed = !0;
    } else {
      window.audio = new Audio();
    }
    window.audio.play();
  },
  _loadingStatus: function(status) {
    if ("loading" == status) {
      return !0;
    }
    return !1;
  },
  _finishedStatus: function(status) {
    if ("finished" == status) {
      if (this.playFinishSound && !this.__finishchimed) {
        this._playSound();
      }
      return !0;
    }
    return !1;
  },
  _statusChange: function(newValue, oldValue) {
    if (typeof oldValue !== typeof void 0 && newValue !== oldValue) {
      this.fire("node-status-change", { status: newValue });
    }
  },
  _disableStatus: function(status) {
    if ("disabled" == status) {
      return !0;
    }
    return !1;
  }
});

define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@lrnwebcomponents/circle-progress/circle-progress.js",
  "../node_modules/@polymer/paper-button/paper-button.js",
  "../node_modules/@polymer/paper-tooltip/paper-tooltip.js",
  "../node_modules/@polymer/paper-spinner/paper-spinner.js",
  "@polymer/neon-animation/neon-animation.js",
  "../node_modules/@polymer/iron-icons/iron-icons.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_1106ae90dea911e8830e5fe658d18137() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style>\n      :host {\n        --paper-button-ink-color: var(--lrnsys-progress-color, --paper-green-500);\n        display: block;\n        transition:\n          box-shadow var(--lrnsys-progress-circle-transition, 0.5s) linear,\n          color var(--lrnsys-progress-circle-transition, 0.5s) ease-in-out,\n          background-color var(--lrnsys-progress-circle-transition, .5s) ease-in-out;\n      }\n      :host([status=\'complete\']) .circle-wrapper {\n        --paper-button-ink-color: var(--lrnsys-progress-complete-color, --paper-green-500);\n        box-shadow: 0px 0px 0px .1em var(--lrnsys-progress-complete-color, --paper-green-900);\n      }\n      :host([status=\'disabled\']) .circle-wrapper {\n        box-shadow: none;\n      }\n      :host([status=\'available\']) .circle-wrapper {\n        box-shadow: none;\n      }\n      :host([active]) .circle-wrapper {\n        box-shadow: 0px 0px 0px .1em var(--google-grey-500);\n      }\n      .circle-wrapper {\n        border-radius: 100%;\n      }\n      .button {\n        margin: 0;\n        padding: 0;\n        display: block;\n        min-width: 2.5em;\n        border-radius: 100%;\n      }\n      paper-button {\n        width: var(--lrnsys-progress-circle-size, 2.5em);\n        height: var(--lrnsys-progress-circle-size, 2.5em);\n      }\n      circle-progress {\n        margin: 0;\n        --circle-progress-width: var(--lrnsys-progress-circle-size, 2.5em);\n        --circle-progress-height: var(--lrnsys-progress-circle-size, 2.5em);\n        --circle-progress-stroke-color: var(--lrnsys-progress-color, --paper-green-500);\n        --circle-progress-bg-stroke-color: var(--lrnsys-progress-container-color, --google-grey-300);\n        --circle-progress-transition: 0.5s;\n        --circle-progress-stroke-linecap: square;\n        transition:\n          color .5s ease-in-out,\n          background-color .5s ease-in-out;\n      }\n      paper-spinner {\n        display: block;\n        width: var(--lrnsys-progress-spinner-size, 2em);\n        height: var(--lrnsys-progress-spinner-size, 2em);\n        position: absolute;\n        z-index: 1;\n        margin: .25em;\n        padding: 0;\n        visibility: visible;\n        opacity: 1;\n        transition: visibility 0.4s, opacity 0.4s ease;\n      }\n      paper-spinner.multi {\n        --paper-spinner-layer-1-color: var(--paper-purple-500);\n        --paper-spinner-layer-2-color: var(--paper-cyan-500);\n        --paper-spinner-layer-3-color: var(--paper-blue-grey-500);\n        --paper-spinner-layer-4-color: var(--paper-amber-500);\n      }\n      /* enforce the browser default even strong; NEVER show this */\n      [hidden] {\n        visibility: hidden !important;\n        opacity: 0 !important;\n      }\n      .transition {\n        opacity: .4;\n        width: calc(var(--lrnsys-progress-icon-size, 1.5em) - .5em);\n        height: calc(var(--lrnsys-progress-icon-size, 1.5em) - .5em);\n      }\n      iron-icon {\n        visibility: visible;\n        opacity: 1;\n        transition: width 0.1s linear, height 0.1s linear, visibility 0.4s ease, opacity 0.4s ease;\n        width: var(--lrnsys-progress-icon-size, 1.5em);\n        height: var(--lrnsys-progress-icon-size, 1.5em);\n      }\n      .disabled {\n        background-color: var(--lrnsys-progress-disabled-color, --google-grey-500);\n        color: white;\n      }\n      .loading {\n        background-color: white;\n        color: black;\n      }\n      .finished iron-icon:not(.activeIcon) {\n        width: calc(var(--lrnsys-progress-icon-size, 1.5em) - .5em);\n        height: calc(var(--lrnsys-progress-icon-size, 1.5em) - .5em);\n      }\n      .available {\n        background-color: var(--lrnsys-progress-active-color, --google-grey-300);\n        color: var(--lrnsys-progress-active-text-color, --google-grey-500);\n      }\n      .activeIcon {\n        color: black;\n      }\n      .complete .activeIcon {\n        color: white;\n      }\n      :host([active]) .complete .activeIcon,\n      :host([active]) .finished .activeIcon {\n        color: black;\n      }\n      .complete,\n      .finished {\n        background-color: var(--lrnsys-progress-container-color, --paper-green-500);\n        color: white;\n      }\n      :host([active]) circle-progress {\n        background-color: white;\n        color: black;\n      }\n      .listview-title {\n        font-size: 1em;\n        padding: 0;\n        margin: 0;\n      }\n      .description-content {\n        font-size: .5em;\n        font-style: italic;\n      }\n      .circle-wrapper {\n        display: inline-block;\n      }\n      #listview {\n        display: inline-block;\n        height: 2em;\n        padding: .25em 0;\n        margin: 0;\n        vertical-align: top;\n      }\n      .link {\n        height: 2.5em;\n        width: 100%;\n      }\n      :host([list-view]) .button {\n        margin: 0;\n        padding: 0;\n        display: block;\n        min-width: 2.5em;\n        border-radius: 0;\n      }\n    </style>\n    <paper-tooltip hidden$="[[!toolTip]]" for="button" position="bottom" offset="8" animation-delay="0">\n      [[label]]\n    </paper-tooltip>\n    <a href="[[url]]" tabindex="-1" class="link">\n    <paper-button id="button" class="button" disabled$="[[disabled]]" title="[[label]]">\n      <span class="circle-wrapper">\n      <paper-spinner active$="[[loading]]" hidden$="[[!loading]]" class="multi" alt$="Loading content for [[label]]"></paper-spinner>\n        <circle-progress class$="[[status]]" value="[[value]]" max="[[max]]" stroke-width="[[strokeWidth]]" angle="180">\n          <iron-icon id="icon" icon="[[activeIcon]]" hidden$="[[!activeIcon]]"></iron-icon>\n          <slot name="image"></slot>\n        </circle-progress>\n      </span>\n      <span id="listview" hidden$="[[!listView]]">\n          <h3 class="listview-title">[[label]]</h3>\n          <div class="description-content">\n            <slot name="description"></slot>\n            <slot></slot>\n          </div>\n      </span>\n    </paper-button>\n  </a>\n'
      ],
      [
        '\n    <style>\n      :host {\n        --paper-button-ink-color: var(--lrnsys-progress-color, --paper-green-500);\n        display: block;\n        transition:\n          box-shadow var(--lrnsys-progress-circle-transition, 0.5s) linear,\n          color var(--lrnsys-progress-circle-transition, 0.5s) ease-in-out,\n          background-color var(--lrnsys-progress-circle-transition, .5s) ease-in-out;\n      }\n      :host([status=\'complete\']) .circle-wrapper {\n        --paper-button-ink-color: var(--lrnsys-progress-complete-color, --paper-green-500);\n        box-shadow: 0px 0px 0px .1em var(--lrnsys-progress-complete-color, --paper-green-900);\n      }\n      :host([status=\'disabled\']) .circle-wrapper {\n        box-shadow: none;\n      }\n      :host([status=\'available\']) .circle-wrapper {\n        box-shadow: none;\n      }\n      :host([active]) .circle-wrapper {\n        box-shadow: 0px 0px 0px .1em var(--google-grey-500);\n      }\n      .circle-wrapper {\n        border-radius: 100%;\n      }\n      .button {\n        margin: 0;\n        padding: 0;\n        display: block;\n        min-width: 2.5em;\n        border-radius: 100%;\n      }\n      paper-button {\n        width: var(--lrnsys-progress-circle-size, 2.5em);\n        height: var(--lrnsys-progress-circle-size, 2.5em);\n      }\n      circle-progress {\n        margin: 0;\n        --circle-progress-width: var(--lrnsys-progress-circle-size, 2.5em);\n        --circle-progress-height: var(--lrnsys-progress-circle-size, 2.5em);\n        --circle-progress-stroke-color: var(--lrnsys-progress-color, --paper-green-500);\n        --circle-progress-bg-stroke-color: var(--lrnsys-progress-container-color, --google-grey-300);\n        --circle-progress-transition: 0.5s;\n        --circle-progress-stroke-linecap: square;\n        transition:\n          color .5s ease-in-out,\n          background-color .5s ease-in-out;\n      }\n      paper-spinner {\n        display: block;\n        width: var(--lrnsys-progress-spinner-size, 2em);\n        height: var(--lrnsys-progress-spinner-size, 2em);\n        position: absolute;\n        z-index: 1;\n        margin: .25em;\n        padding: 0;\n        visibility: visible;\n        opacity: 1;\n        transition: visibility 0.4s, opacity 0.4s ease;\n      }\n      paper-spinner.multi {\n        --paper-spinner-layer-1-color: var(--paper-purple-500);\n        --paper-spinner-layer-2-color: var(--paper-cyan-500);\n        --paper-spinner-layer-3-color: var(--paper-blue-grey-500);\n        --paper-spinner-layer-4-color: var(--paper-amber-500);\n      }\n      /* enforce the browser default even strong; NEVER show this */\n      [hidden] {\n        visibility: hidden !important;\n        opacity: 0 !important;\n      }\n      .transition {\n        opacity: .4;\n        width: calc(var(--lrnsys-progress-icon-size, 1.5em) - .5em);\n        height: calc(var(--lrnsys-progress-icon-size, 1.5em) - .5em);\n      }\n      iron-icon {\n        visibility: visible;\n        opacity: 1;\n        transition: width 0.1s linear, height 0.1s linear, visibility 0.4s ease, opacity 0.4s ease;\n        width: var(--lrnsys-progress-icon-size, 1.5em);\n        height: var(--lrnsys-progress-icon-size, 1.5em);\n      }\n      .disabled {\n        background-color: var(--lrnsys-progress-disabled-color, --google-grey-500);\n        color: white;\n      }\n      .loading {\n        background-color: white;\n        color: black;\n      }\n      .finished iron-icon:not(.activeIcon) {\n        width: calc(var(--lrnsys-progress-icon-size, 1.5em) - .5em);\n        height: calc(var(--lrnsys-progress-icon-size, 1.5em) - .5em);\n      }\n      .available {\n        background-color: var(--lrnsys-progress-active-color, --google-grey-300);\n        color: var(--lrnsys-progress-active-text-color, --google-grey-500);\n      }\n      .activeIcon {\n        color: black;\n      }\n      .complete .activeIcon {\n        color: white;\n      }\n      :host([active]) .complete .activeIcon,\n      :host([active]) .finished .activeIcon {\n        color: black;\n      }\n      .complete,\n      .finished {\n        background-color: var(--lrnsys-progress-container-color, --paper-green-500);\n        color: white;\n      }\n      :host([active]) circle-progress {\n        background-color: white;\n        color: black;\n      }\n      .listview-title {\n        font-size: 1em;\n        padding: 0;\n        margin: 0;\n      }\n      .description-content {\n        font-size: .5em;\n        font-style: italic;\n      }\n      .circle-wrapper {\n        display: inline-block;\n      }\n      #listview {\n        display: inline-block;\n        height: 2em;\n        padding: .25em 0;\n        margin: 0;\n        vertical-align: top;\n      }\n      .link {\n        height: 2.5em;\n        width: 100%;\n      }\n      :host([list-view]) .button {\n        margin: 0;\n        padding: 0;\n        display: block;\n        min-width: 2.5em;\n        border-radius: 0;\n      }\n    </style>\n    <paper-tooltip hidden\\$="[[!toolTip]]" for="button" position="bottom" offset="8" animation-delay="0">\n      [[label]]\n    </paper-tooltip>\n    <a href="[[url]]" tabindex="-1" class="link">\n    <paper-button id="button" class="button" disabled\\$="[[disabled]]" title="[[label]]">\n      <span class="circle-wrapper">\n      <paper-spinner active\\$="[[loading]]" hidden\\$="[[!loading]]" class="multi" alt\\$="Loading content for [[label]]"></paper-spinner>\n        <circle-progress class\\$="[[status]]" value="[[value]]" max="[[max]]" stroke-width="[[strokeWidth]]" angle="180">\n          <iron-icon id="icon" icon="[[activeIcon]]" hidden\\$="[[!activeIcon]]"></iron-icon>\n          <slot name="image"></slot>\n        </circle-progress>\n      </span>\n      <span id="listview" hidden\\$="[[!listView]]">\n          <h3 class="listview-title">[[label]]</h3>\n          <div class="description-content">\n            <slot name="description"></slot>\n            <slot></slot>\n          </div>\n      </span>\n    </paper-button>\n  </a>\n'
      ]
    );
    _templateObject_1106ae90dea911e8830e5fe658d18137 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_1106ae90dea911e8830e5fe658d18137()
    ),
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
    ready: function ready() {
      this._bubbleProgress = { 25: !1, 50: !1, 75: !1 };
    },
    _testValueComplete: function _testValueComplete(newValue) {
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
    focusEvent: function focusEvent() {
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
    focusOn: function focusOn() {
      if (!this.disabled && "loading" != this.status) {
        this.$.icon.icon = this.icon;
        this.$.icon.classList.add("activeIcon");
      }
    },
    focusOff: function focusOff() {
      if (!this.disabled && "loading" != this.status) {
        if ("complete" == this.status || "finished" == this.status) {
          this.$.icon.icon = this.activeIcon;
        }
        this.$.icon.classList.remove("activeIcon");
      }
    },
    tapEventOn: function tapEventOn(e) {
      this.fire("node-is-active", { node: e });
    },
    _getActiveIcon: function _getActiveIcon(icon, iconComplete, status) {
      if (babelHelpers.typeof(icon) !== "undefined") {
        var tmp = icon;
        if ("loading" == status) {
          tmp = this.loadingIcon;
          this.$.icon.classList.add("transition");
        } else if ("finished" == status) {
          tmp = this.finishedIcon;
        } else if (
          "complete" == status &&
          babelHelpers.typeof(iconComplete) !== "undefined"
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
    _playSound: function _playSound() {
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
    _loadingStatus: function _loadingStatus(status) {
      if ("loading" == status) {
        return !0;
      }
      return !1;
    },
    _finishedStatus: function _finishedStatus(status) {
      if ("finished" == status) {
        if (this.playFinishSound && !this.__finishchimed) {
          this._playSound();
        }
        return !0;
      }
      return !1;
    },
    _statusChange: function _statusChange(newValue, oldValue) {
      if (
        babelHelpers.typeof(oldValue) !== "undefined" &&
        newValue !== oldValue
      ) {
        this.fire("node-status-change", { status: newValue });
      }
    },
    _disableStatus: function _disableStatus(status) {
      if ("disabled" == status) {
        return !0;
      }
      return !1;
    }
  });
});

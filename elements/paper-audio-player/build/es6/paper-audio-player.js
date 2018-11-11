import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import { IronA11yKeysBehavior } from "./node_modules/@polymer/iron-a11y-keys-behavior/iron-a11y-keys-behavior.js";
import "./node_modules/@polymer/paper-progress/paper-progress.js";
import "./node_modules/@polymer/iron-icon/iron-icon.js";
import "./node_modules/@polymer/paper-icon-button/paper-icon-button.js";
import "./node_modules/@polymer/paper-ripple/paper-ripple.js";
import "./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "./node_modules/@polymer/iron-iconset-svg/iron-iconset-svg.js";
import "./lib/paper-audio-icons.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        box-sizing: border-box;
        font-family: 'Roboto', 'Noto', sans-serif;
      }

      #wrapper {
        position: relative;
        cursor: pointer;
        height: 50px;
        box-shadow: 0 1px 2px rgba(0,0,0,.3);
      }

      #left,
      #right {
        height: 50px;
        width: 50px;
        position: relative;
      }

      #left {
        background-color:  var(--paper-audio-player-color, blueviolet);
      }

      #right {
        background-color: rgba(255,255,255,.75);
      }

      paper-icon-button,
      iron-icon {
        color: #fff;
      }

      #duration,
      #title,
      #progress2 {
        text-align: center;
        line-height: 50px;
      }

      #duration {
        font-size: 11px;
        color: var(--paper-audio-player-color, blueviolet);
      }

      paper-icon-button,
      iron-icon {
        margin: auto;
      }

      #replay {
        opacity: 0;
        color: var(--paper-audio-player-color, blueviolet);
      }

      #title,
      #progress2 {
        pointer-events: none;
        font-size: 15px;
      }

      #title {
        z-index: 2;
        color: var(--paper-audio-player-color, blueviolet);
      }

      #progress2 {
        width: 0px;
        z-index: 5;
        color: #fff;
        overflow: hidden;
      }

      #center {
        position: relative;
        overflow: hidden;
        background-color: rgba(255,255,255,.75);
      }

      #progress {
        width: 100%;
        transform-origin: left;
        transform: scaleX(0);
        background-color: var(--paper-audio-player-color, blueviolet);
      }

      paper-ripple {
        color: var(--paper-audio-player-color, blueviolet);
      }

      /* On hover */

      :host(:not(.cantplay)) #right:hover #replay {
        opacity: 1;
      }

      #right:hover #duration {
        opacity: 0;
      }

      #left:hover #play,
      #left:hover #pause {
        transform: scale3d(1.1, 1.1, 1.1);
        -ms-transform: scale3d(1.1, 1.1, 1.1);
        -webkit-transform: scale3d(1.1, 1.1, 1.1);
      }

      /* On Error */

      :host(.cantplay) #title {
        font-size: 12px;
      }

      :host(.cantplay) #wrapper {
        cursor: default;
      }

      :host(.cantplay) #play {
        opacity: 0;
      }

      /* Flexbox Helpers */

      .layout-horizontal {
        display: flex;
        display: -webkit-flex;
        display: -ms-flexbox;
        -ms-flex-direction: row;
        -webkit-flex-direction: row;
        flex-direction: row;
      }

      .flex {
        -ms-flex: 1;
        -webkit-flex: 1;
        flex: 1;
      }

      .fit {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      }

      .self-start {
        -ms-align-self: flex-start;
        -webkit-align-self: flex-start;
        align-self: flex-start;
      }

      .self-end {
        -ms-align-self: flex-end;
        -webkit-align-self: flex-end;
        align-self: flex-end;
      }
    </style>
    <div id="wrapper" class="layout-horizontal">
      <div id="left" class="self-start" on-tap="playPause">
        <!-- Icon -->
        <paper-icon-button id="play" icon="paper-audio-icons:play-arrow" class="fit" hidden$="[[ _hidePlayIcon(isPlaying, canBePlayed) ]]" role="button" aria-label="Play Audio" tabindex="-1"></paper-icon-button>
        <paper-icon-button id="pause" icon="paper-audio-icons:pause" class="fit" hidden$="[[ !isPlaying ]]" role="button" aria-label="Pause Audio" tabindex="-1"></paper-icon-button>
        <iron-icon id="error" icon="paper-audio-icons:error-outline" class="fit" hidden$="[[ !error ]]"></iron-icon>
      </div>
      <div id="center" class="flex" on-down="_onDown">
        <!-- Title -->
        <div id="title" class="fit" role="alert">[[title]]</div>
        <!-- Audio HTML5 element -->
        <audio id="audio" src$="[[src]]" preload$="[[ _setPreload(autoPlay, preload) ]]"></audio>
        <!-- Progress bar -->
        <div id="progress" class="fit"></div>
        <paper-ripple></paper-ripple>
        <!-- Secondary white title -->
        <div id="progress2" class="fit">
          <div id="title2" aria-hidden="true">[[title]]</div>
        </div>
      </div>
      <div id="right" class="self-end" on-click="restart">
        <!-- Duration -->
        <div id="duration" class="fit" hidden\$="[[ended]]">
          <span class="fit" role="timer" aria-label="Audio Track Length">[[ _convertSecToMin(timeLeft) ]]</span>
        </div>
        <!-- Icon -->
        <paper-icon-button id="replay" class="fit" icon="paper-audio-icons:replay" tabindex="-1" role="button" aria-label="Replay Audio"></paper-icon-button>
      </div>
    </div>
`,
  is: "paper-audio-player",
  behaviors: [
    IronA11yKeysBehavior,
    HAXBehaviors.PropertiesBehaviors,
    MaterializeCSSBehaviors.ColorBehaviors,
    SchemaBehaviors.Schema
  ],
  hostAttributes: {
    tabindex: 0,
    role: "application",
    "aria-label": "Audio Player",
    "aria-describedby": "title"
  },
  properties: {
    src: { type: String, observer: "_srcChanged" },
    title: { type: String, value: "Click to play this audio file" },
    color: { type: String, observer: "_changeColor" },
    autoPlay: { type: Boolean, value: !1 },
    preload: { type: String, value: "auto" },
    currentTime: { type: Number, value: 0, notify: !0 },
    timeLeft: { type: Number, value: 0 },
    smallSkip: { type: Number, value: 15 },
    largeSkip: { type: Number, value: 60 },
    error: { type: Boolean },
    timeOffset: { type: Number, value: 0 }
  },
  keyBindings: {
    space: "playPause",
    enter: "playPause",
    left: "_skipReverseByInterval",
    right: "_skipReverseByInterval",
    down: "_skipReverseByInterval",
    up: "_skipReverseByInterval"
  },
  attached: function() {
    this.setHaxProperties({
      canScale: !0,
      canPosition: !0,
      canEditSource: !1,
      gizmo: {
        title: "Mini Audio player",
        description: "A very small audio player good for MP3s.",
        icon: "image:music-note",
        color: "green",
        groups: ["Audio", "Media"],
        handles: [
          { type: "audio", source: "src", title: "title", color: "color" }
        ],
        meta: { author: "LRNWebComponents" }
      },
      settings: {
        quick: [
          {
            property: "src",
            title: "Source",
            description: "The URL for this audio file.",
            inputMethod: "textfield",
            icon: "link",
            required: !0,
            validationType: "url"
          },
          {
            property: "title",
            title: "Title",
            description: "Title of this sound track.",
            inputMethod: "textfield",
            icon: "av:video-label",
            required: !1,
            validationType: "text"
          },
          {
            property: "color",
            title: "Color",
            description: "Select the primary color used in the video",
            inputMethod: "colorpicker",
            icon: "editor:format-color-fill"
          }
        ],
        configure: [
          {
            property: "src",
            title: "Source",
            description: "The URL for this audio file.",
            inputMethod: "textfield",
            icon: "link",
            required: !0,
            validationType: "url"
          },
          {
            property: "title",
            title: "Title",
            description: "Title of this sound track.",
            inputMethod: "textfield",
            icon: "av:video-label",
            required: !1,
            validationType: "text"
          },
          {
            property: "color",
            title: "Color",
            description: "Select the primary color used in the video",
            inputMethod: "colorpicker",
            icon: "editor:format-color-fill"
          }
        ],
        advanced: []
      }
    });
    this.$.audio.addEventListener("loadedmetadata", this._onCanPlay.bind(this));
    this.$.audio.addEventListener("playing", this._onPlaying.bind(this));
    this.$.audio.addEventListener("pause", this._onPause.bind(this));
    this.$.audio.addEventListener("ended", this._onEnd.bind(this));
    this.$.audio.addEventListener("error", this._onError.bind(this));
  },
  detached: function() {
    this.$.audio.removeEventListener(
      "loadedmetadata",
      this._onCanPlay.bind(this)
    );
    this.$.audio.removeEventListener("playing", this._onPlaying.bind(this));
    this.$.audio.removeEventListener("pause", this._onPause.bind(this));
    this.$.audio.removeEventListener("ended", this._onEnd.bind(this));
    this.$.audio.removeEventListener("error", this._onError.bind(this));
  },
  ready: function() {
    var player = this;
    player.canBePlayed = !1;
    player.isPlaying = !1;
    player.ended = !1;
    player.error = !1;
    player.$.audio.currentTime = player.timeOffset;
  },
  playPause: function(e) {
    if (!!e) e.preventDefault();
    var player = this;
    if (player.canBePlayed) {
      if (player.isPlaying) {
        player._pause();
      } else {
        player._play();
      }
    } else if ("none" === player.preload) {
      player.$.audio.load();
      player._play();
    }
  },
  _play: function() {
    var player = this;
    player.$.audio.play();
  },
  _pause: function() {
    var player = this;
    player.$.audio.pause();
  },
  restart: function(e) {
    if (!!e) e.preventDefault();
    var player = this;
    player.$.audio.currentTime = 0;
    if (!player.isPlaying) player._play();
  },
  _onCanPlay: function() {
    var player = this;
    player.canBePlayed = !0;
    player.timeLeft = player.$.audio.duration;
    if (0 < player.timeOffset) {
      var percentagePlayed = player.timeOffset / player.$.audio.duration;
      player._updateVisualProgress(percentagePlayed);
    }
    if (player.autoPlay) player._play();
  },
  _onPlaying: function() {
    var player = this;
    player.ended = !1;
    player.isPlaying = !0;
    player.$.replay.style = "";
    player._startProgressTimer();
  },
  _skipReverseByInterval: function(e) {
    if (!!e) e.preventDefault();
    var player = this,
      newTime = 0;
    switch (e.detail.key) {
      case "up":
        if (player.largeSkip < player.timeLeft)
          newTime = player.currentTime + player.largeSkip;
        break;
      case "down":
        if (0 < player.currentTime - player.largeSkip)
          newTime = player.currentTime - player.largeSkip;
        break;
      case "right":
        if (player.smallSkip < player.timeLeft)
          newTime = player.currentTime + player.smallSkip;
        break;
      default:
        if (0 < player.currentTime - player.smallSkip)
          newTime = player.currentTime - player.smallSkip;
    }
    player._updatePlayPosition(newTime);
    if (!player.isPlaying) player._play();
  },
  _startProgressTimer: function() {
    var player = this;
    player.timer = {};
    if (player.timer.sliderUpdateInterval) {
      clearInterval(player.timer.sliderUpdateInterval);
    }
    player.timer.sliderUpdateInterval = setInterval(function() {
      if (player.isPlaying) {
        player.currentTime = player.$.audio.currentTime;
        player.timeLeft = player.$.audio.duration - player.currentTime;
        var percentagePlayed = player.currentTime / player.$.audio.duration;
        player._updateVisualProgress(percentagePlayed);
      } else {
        clearInterval(player.timer.sliderUpdateInterval);
      }
    }, 60);
  },
  _onPause: function() {
    var player = this;
    player.isPlaying = !1;
  },
  _onEnd: function() {
    var player = this;
    player.ended = !0;
    player.isPlaying = !1;
    player.$.replay.style.opacity = 1;
  },
  _onError: function() {
    var player = this;
    player.classList.add("cantplay");
    player.title = "Sorry, can't play track: " + player.title;
    player.error = !0;
    player.setAttribute("aria-invalid", "true");
  },
  _convertSecToMin: function(seconds) {
    var _Mathfloor = Math.floor;
    if (0 === seconds) return "";
    var minutes = _Mathfloor(seconds / 60),
      secondsToCalc = _Mathfloor(seconds % 60) + "";
    return (
      minutes +
      ":" +
      (2 > secondsToCalc.length ? "0" + secondsToCalc : secondsToCalc)
    );
  },
  _onDown: function(e) {
    e.preventDefault();
    var player = this;
    if (player.canBePlayed) {
      player._updateProgressBar(e);
      if (!player.isPlaying) {
        player._play();
      }
    } else if ("none" === player.preload) {
      player.$.audio.load();
      player.$.audio.addEventListener(
        "loadedmetadata",
        function() {
          player._updateProgressBar(e);
          if (!player.isPlaying) {
            player._play();
          }
        },
        !1
      );
    }
  },
  _updateProgressBar: function(e) {
    var player = this,
      x = e.detail.x - player.$.center.getBoundingClientRect().left,
      r =
        (x / player.$.center.getBoundingClientRect().width) *
        player.$.audio.duration;
    this._updatePlayPosition(r);
  },
  _updatePlayPosition: function(newTime) {
    var player = this;
    player.currentTime = player.$.audio.currentTime = newTime;
    var percentagePlayed = player.currentTime / player.$.audio.duration;
    player._updateVisualProgress(percentagePlayed);
  },
  _updateVisualProgress: function(percentagePlayed) {
    var player = this;
    player.$.progress.style.transform = "scaleX(" + percentagePlayed + ")";
    player.$.progress2.style.width = 100 * percentagePlayed + "%";
    player.$.title2.style.width = 100 * (1 / percentagePlayed) + "%";
  },
  _srcChanged: function() {
    var player = this;
    if (player.isPlaying) {
      player._pause();
      player._play();
    }
  },
  _changeColor: function(newValue) {
    var player = this;
    player.$.left.style.backgroundColor = newValue;
    player.$.title.style.color = newValue;
    player.$.duration.style.color = newValue;
    player.$.progress.style.backgroundColor = newValue;
    player.$.replay.style.color = newValue;
  },
  _hidePlayIcon: function(isPlaying, canBePlayed) {
    return isPlaying ? !0 : !(canBePlayed || "none" === this.preload);
  },
  _setPreload: function(autoplay, preload) {
    return autoplay ? "auto" : preload;
  }
});

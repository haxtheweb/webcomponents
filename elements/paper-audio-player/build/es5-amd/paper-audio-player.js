define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@polymer/paper-progress/paper-progress.js",
  "./node_modules/@polymer/iron-icon/iron-icon.js",
  "./node_modules/@polymer/paper-icon-button/paper-icon-button.js",
  "./node_modules/@polymer/paper-ripple/paper-ripple.js",
  "./node_modules/@polymer/iron-a11y-keys-behavior/iron-a11y-keys-behavior.js",
  "./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js",
  "./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js",
  "./lib/paper-audio-icons.js"
], function(
  _polymerLegacy,
  _paperProgress,
  _ironIcon,
  _paperIconButton,
  _paperRipple,
  _ironA11yKeysBehavior
) {
  "use strict";
  function _templateObject_83a675f0dbb811e8954ee3c16fe5d4cf() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style>\n\n      :host {\n        display: block;\n        /*margin: auto 10px;\n        width: 100%;*/\n        box-sizing: border-box;\n        font-family: \'Roboto\', \'Noto\', sans-serif;\n      }\n\n      [hidden] {\n        display: none !important;\n      }\n\n      #wrapper {\n        position: relative;\n        cursor: pointer;\n        height: 50px;\n        box-shadow: 0 1px 2px rgba(0,0,0,.3);\n      }\n\n      #left,\n      #right {\n        height: 50px;\n        width: 50px;\n        position: relative;\n      }\n\n      #left {\n        background-color:  var(--paper-audio-player-color, blueviolet);\n      }\n\n      #right {\n        background-color: rgba(255,255,255,.75);\n      }\n\n      paper-icon-button,\n      iron-icon {\n        color: #fff;\n      }\n\n      #duration,\n      #title,\n      #progress2 {\n        text-align: center;\n        line-height: 50px;\n      }\n\n      #duration {\n        font-size: 11px;\n        color: var(--paper-audio-player-color, blueviolet);\n      }\n\n      paper-icon-button,\n      iron-icon {\n        margin: auto;\n      }\n\n      #replay {\n        opacity: 0;\n        color: var(--paper-audio-player-color, blueviolet);\n      }\n\n      #title,\n      #progress2 {\n        pointer-events: none;\n        font-size: 15px;\n      }\n\n      #title {\n        z-index: 2;\n        color: var(--paper-audio-player-color, blueviolet);\n      }\n\n      #progress2 {\n        width: 0px;\n        z-index: 5;\n        color: #fff;\n        overflow: hidden;\n      }\n\n      #center {\n        position: relative;\n        overflow: hidden;\n        background-color: rgba(255,255,255,.75);\n      }\n\n      #progress {\n        width: 100%;\n        transform-origin: left;\n        transform: scaleX(0);\n        background-color: var(--paper-audio-player-color, blueviolet);\n      }\n\n      paper-ripple {\n        color: var(--paper-audio-player-color, blueviolet);\n      }\n\n      /* On hover */\n\n      :host:not(.cantplay) #right:hover #replay {\n        opacity: 1;\n      }\n\n      #right:hover #duration {\n        opacity: 0;\n      }\n\n      #left:hover #play,\n      #left:hover #pause {\n        transform: scale3d(1.1, 1.1, 1.1);\n        -ms-transform: scale3d(1.1, 1.1, 1.1);\n        -webkit-transform: scale3d(1.1, 1.1, 1.1);\n      }\n\n      /* On Error */\n\n      :host(.cantplay) #title {\n        font-size: 12px;\n      }\n\n      :host(.cantplay) #wrapper {\n        cursor: default;\n      }\n\n      :host(.cantplay) #play {\n        opacity: 0;\n      }\n\n      /* Flexbox Helpers */\n\n      .layout-horizontal {\n        display: flex;\n        display: -webkit-flex;\n        display: -ms-flexbox;\n        -ms-flex-direction: row;\n        -webkit-flex-direction: row;\n        flex-direction: row;\n      }\n\n      .flex {\n        -ms-flex: 1;\n        -webkit-flex: 1;\n        flex: 1;\n      }\n\n      .fit {\n        position: absolute;\n        top: 0;\n        right: 0;\n        bottom: 0;\n        left: 0;\n      }\n\n      .self-start {\n        -ms-align-self: flex-start;\n        -webkit-align-self: flex-start;\n        align-self: flex-start;\n      }\n\n      .self-end {\n        -ms-align-self: flex-end;\n        -webkit-align-self: flex-end;\n        align-self: flex-end;\n      }\n    </style>\n\n    <div id="wrapper" class="layout-horizontal">\n\n      <div id="left" class="self-start" on-tap="playPause">\n\n        <!-- Icon -->\n        <paper-icon-button id="play" icon="paper-audio-icons:play-arrow" class="fit" hidden$="[[ _hidePlayIcon(isPlaying, canBePlayed) ]]" role="button" aria-label="Play Audio" tabindex="-1"></paper-icon-button>\n        <paper-icon-button id="pause" icon="paper-audio-icons:pause" class="fit" hidden$="[[ !isPlaying ]]" role="button" aria-label="Pause Audio" tabindex="-1"></paper-icon-button>\n        <iron-icon id="error" icon="paper-audio-icons:error-outline" class="fit" hidden$="[[ !error ]]"></iron-icon>\n      </div>\n\n      <div id="center" class="flex" on-down="_onDown">\n        <!-- Title -->\n        <div id="title" class="fit" role="alert">[[title]]</div>\n\n        <!-- Audio HTML5 element -->\n        <audio id="audio" src="[[src]]" preload="[[ _setPreload(autoPlay, preload) ]]"></audio>\n\n        <!-- Progress bar -->\n        <div id="progress" class="fit"></div>\n\n        <paper-ripple></paper-ripple>\n\n        <!-- Secondary white title -->\n        <div id="progress2" class="fit">\n          <div id="title2" aria-hidden="true">[[title]]</div>\n        </div>\n      </div>\n\n      <div id="right" class="self-end" on-click="restart">\n\n        <!-- Duration -->\n        <div id="duration" class="fit" hidden$="[[ended]]">\n          <span class="fit" role="timer" aria-label="Audio Track Length">[[ _convertSecToMin(timeLeft) ]]</span>\n        </div>\n\n        <!-- Icon -->\n        <paper-icon-button id="replay" class="fit" icon="paper-audio-icons:replay" tabindex="-1" role="button" aria-label="Replay Audio"></paper-icon-button>\n      </div>\n    </div>\n'
      ],
      [
        '\n    <style>\n\n      :host {\n        display: block;\n        /*margin: auto 10px;\n        width: 100%;*/\n        box-sizing: border-box;\n        font-family: \'Roboto\', \'Noto\', sans-serif;\n      }\n\n      [hidden] {\n        display: none !important;\n      }\n\n      #wrapper {\n        position: relative;\n        cursor: pointer;\n        height: 50px;\n        box-shadow: 0 1px 2px rgba(0,0,0,.3);\n      }\n\n      #left,\n      #right {\n        height: 50px;\n        width: 50px;\n        position: relative;\n      }\n\n      #left {\n        background-color:  var(--paper-audio-player-color, blueviolet);\n      }\n\n      #right {\n        background-color: rgba(255,255,255,.75);\n      }\n\n      paper-icon-button,\n      iron-icon {\n        color: #fff;\n      }\n\n      #duration,\n      #title,\n      #progress2 {\n        text-align: center;\n        line-height: 50px;\n      }\n\n      #duration {\n        font-size: 11px;\n        color: var(--paper-audio-player-color, blueviolet);\n      }\n\n      paper-icon-button,\n      iron-icon {\n        margin: auto;\n      }\n\n      #replay {\n        opacity: 0;\n        color: var(--paper-audio-player-color, blueviolet);\n      }\n\n      #title,\n      #progress2 {\n        pointer-events: none;\n        font-size: 15px;\n      }\n\n      #title {\n        z-index: 2;\n        color: var(--paper-audio-player-color, blueviolet);\n      }\n\n      #progress2 {\n        width: 0px;\n        z-index: 5;\n        color: #fff;\n        overflow: hidden;\n      }\n\n      #center {\n        position: relative;\n        overflow: hidden;\n        background-color: rgba(255,255,255,.75);\n      }\n\n      #progress {\n        width: 100%;\n        transform-origin: left;\n        transform: scaleX(0);\n        background-color: var(--paper-audio-player-color, blueviolet);\n      }\n\n      paper-ripple {\n        color: var(--paper-audio-player-color, blueviolet);\n      }\n\n      /* On hover */\n\n      :host:not(.cantplay) #right:hover #replay {\n        opacity: 1;\n      }\n\n      #right:hover #duration {\n        opacity: 0;\n      }\n\n      #left:hover #play,\n      #left:hover #pause {\n        transform: scale3d(1.1, 1.1, 1.1);\n        -ms-transform: scale3d(1.1, 1.1, 1.1);\n        -webkit-transform: scale3d(1.1, 1.1, 1.1);\n      }\n\n      /* On Error */\n\n      :host(.cantplay) #title {\n        font-size: 12px;\n      }\n\n      :host(.cantplay) #wrapper {\n        cursor: default;\n      }\n\n      :host(.cantplay) #play {\n        opacity: 0;\n      }\n\n      /* Flexbox Helpers */\n\n      .layout-horizontal {\n        display: flex;\n        display: -webkit-flex;\n        display: -ms-flexbox;\n        -ms-flex-direction: row;\n        -webkit-flex-direction: row;\n        flex-direction: row;\n      }\n\n      .flex {\n        -ms-flex: 1;\n        -webkit-flex: 1;\n        flex: 1;\n      }\n\n      .fit {\n        position: absolute;\n        top: 0;\n        right: 0;\n        bottom: 0;\n        left: 0;\n      }\n\n      .self-start {\n        -ms-align-self: flex-start;\n        -webkit-align-self: flex-start;\n        align-self: flex-start;\n      }\n\n      .self-end {\n        -ms-align-self: flex-end;\n        -webkit-align-self: flex-end;\n        align-self: flex-end;\n      }\n    </style>\n\n    <div id="wrapper" class="layout-horizontal">\n\n      <div id="left" class="self-start" on-tap="playPause">\n\n        <!-- Icon -->\n        <paper-icon-button id="play" icon="paper-audio-icons:play-arrow" class="fit" hidden\\$="[[ _hidePlayIcon(isPlaying, canBePlayed) ]]" role="button" aria-label="Play Audio" tabindex="-1"></paper-icon-button>\n        <paper-icon-button id="pause" icon="paper-audio-icons:pause" class="fit" hidden\\$="[[ !isPlaying ]]" role="button" aria-label="Pause Audio" tabindex="-1"></paper-icon-button>\n        <iron-icon id="error" icon="paper-audio-icons:error-outline" class="fit" hidden\\$="[[ !error ]]"></iron-icon>\n      </div>\n\n      <div id="center" class="flex" on-down="_onDown">\n        <!-- Title -->\n        <div id="title" class="fit" role="alert">[[title]]</div>\n\n        <!-- Audio HTML5 element -->\n        <audio id="audio" src="[[src]]" preload="[[ _setPreload(autoPlay, preload) ]]"></audio>\n\n        <!-- Progress bar -->\n        <div id="progress" class="fit"></div>\n\n        <paper-ripple></paper-ripple>\n\n        <!-- Secondary white title -->\n        <div id="progress2" class="fit">\n          <div id="title2" aria-hidden="true">[[title]]</div>\n        </div>\n      </div>\n\n      <div id="right" class="self-end" on-click="restart">\n\n        <!-- Duration -->\n        <div id="duration" class="fit" hidden\\$="[[ended]]">\n          <span class="fit" role="timer" aria-label="Audio Track Length">[[ _convertSecToMin(timeLeft) ]]</span>\n        </div>\n\n        <!-- Icon -->\n        <paper-icon-button id="replay" class="fit" icon="paper-audio-icons:replay" tabindex="-1" role="button" aria-label="Replay Audio"></paper-icon-button>\n      </div>\n    </div>\n'
      ]
    );
    _templateObject_83a675f0dbb811e8954ee3c16fe5d4cf = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_83a675f0dbb811e8954ee3c16fe5d4cf()
    ),
    is: "paper-audio-player",
    behaviors: [
      _ironA11yKeysBehavior.IronA11yKeysBehavior,
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
      timeOffset: { type: Number, value: 0 },
      gaId: { type: String }
    },
    listeners: {
      "audio.loadedmetadata": "_onCanPlay",
      "audio.playing": "_onPlaying",
      "audio.pause": "_onPause",
      "audio.ended": "_onEnd",
      "audio.error": "_onError"
    },
    keyBindings: {
      space: "playPause",
      enter: "playPause",
      left: "_skipReverseByInterval",
      right: "_skipReverseByInterval",
      down: "_skipReverseByInterval",
      up: "_skipReverseByInterval"
    },
    attached: function attached() {
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
    },
    ready: function ready() {
      var player = this;
      player.canBePlayed = !1;
      player.isPlaying = !1;
      player.ended = !1;
      player.error = !1;
      player.$.audio.currentTime = player.timeOffset;
      if (!!player.gaId) player._setupGATracking();
    },
    playPause: function playPause(e) {
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
    _play: function _play() {
      var player = this;
      player.$.audio.play();
      if (!!player.gaId) this._dispatchGAEvent("Play");
    },
    _pause: function _pause() {
      var player = this;
      player.$.audio.pause();
      if (!!player.gaId) this._dispatchGAEvent("Pause");
    },
    restart: function restart(e) {
      if (!!e) e.preventDefault();
      var player = this;
      player.$.audio.currentTime = 0;
      if (!player.isPlaying) player._play();
    },
    _onCanPlay: function _onCanPlay() {
      var player = this;
      player.canBePlayed = !0;
      player.timeLeft = player.$.audio.duration;
      if (0 < player.timeOffset) {
        var percentagePlayed = player.timeOffset / player.$.audio.duration;
        player._updateVisualProgress(percentagePlayed);
      }
      if (player.autoPlay) player._play();
    },
    _onPlaying: function _onPlaying() {
      var player = this;
      player.ended = !1;
      player.isPlaying = !0;
      player.$.replay.style = "";
      player._startProgressTimer();
    },
    _skipReverseByInterval: function _skipReverseByInterval(e) {
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
    _startProgressTimer: function _startProgressTimer() {
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
    _onPause: function _onPause() {
      var player = this;
      player.isPlaying = !1;
    },
    _onEnd: function _onEnd() {
      var player = this;
      player.ended = !0;
      player.isPlaying = !1;
      player.$.replay.style.opacity = 1;
      if (!!player.gaId) this._dispatchGAEvent("Ended");
    },
    _onError: function _onError() {
      var player = this;
      player.classList.add("cantplay");
      player.title = "Sorry, can't play track: " + player.title;
      player.error = !0;
      player.setAttribute("aria-invalid", "true");
    },
    _convertSecToMin: function _convertSecToMin(seconds) {
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
    _onDown: function _onDown(e) {
      e.preventDefault();
      var player = this;
      if (player.canBePlayed) {
        player._updateProgressBar(e);
        if (!player.isPlaying) {
          player._play();
        } else {
          if (!!player.gaId) this._dispatchGAEvent("Scrub");
        }
      } else if ("none" === player.preload) {
        player.$.audio.load();
        player.$.audio.addEventListener(
          "loadedmetadata",
          function() {
            player._updateProgressBar(e);
            if (!player.isPlaying) {
              player._play();
            } else {
              if (!!player.gaId) this._dispatchGAEvent("Scrub");
            }
          },
          !1
        );
      }
    },
    _updateProgressBar: function _updateProgressBar(e) {
      var player = this,
        x = e.detail.x - player.$.center.getBoundingClientRect().left,
        r =
          (x / player.$.center.getBoundingClientRect().width) *
          player.$.audio.duration;
      this._updatePlayPosition(r);
    },
    _updatePlayPosition: function _updatePlayPosition(newTime) {
      var player = this;
      player.currentTime = player.$.audio.currentTime = newTime;
      var percentagePlayed = player.currentTime / player.$.audio.duration;
      player._updateVisualProgress(percentagePlayed);
    },
    _updateVisualProgress: function _updateVisualProgress(percentagePlayed) {
      var player = this;
      player.$.progress.style.transform = "scaleX(" + percentagePlayed + ")";
      player.$.progress2.style.width = 100 * percentagePlayed + "%";
      player.$.title2.style.width = 100 * (1 / percentagePlayed) + "%";
    },
    _srcChanged: function _srcChanged() {
      var player = this;
      if (player.isPlaying) {
        player._pause();
        player._play();
      }
    },
    _changeColor: function _changeColor(newValue) {
      var player = this;
      player.$.left.style.backgroundColor = newValue;
      player.$.title.style.color = newValue;
      player.$.duration.style.color = newValue;
      player.$.progress.style.backgroundColor = newValue;
      player.$.replay.style.color = newValue;
    },
    _hidePlayIcon: function _hidePlayIcon(isPlaying, canBePlayed) {
      return isPlaying ? !0 : !(canBePlayed || "none" === this.preload);
    },
    _setPreload: function _setPreload(autoplay, preload) {
      return autoplay ? "auto" : preload;
    },
    _dispatchGAEvent: function _dispatchGAEvent(action) {
      var player = this;
      window.ga("audioTracker.send", "event", {
        eventCategory: "Paper Audio Player",
        eventAction: action,
        eventLabel: !!player.title ? player.title : player.src,
        eventValue: player.$.audio.currentTime
      });
    },
    _setupGATracking: function _setupGATracking() {
      var player = this;
      if (window) {
        if (!window.ga) {
          (function(i, s, o, g, r, a, m) {
            i.GoogleAnalyticsObject = r;
            (i[r] =
              i[r] ||
              function() {
                (i[r].q = i[r].q || []).push(arguments);
              }),
              (i[r].l = 1 * new Date());
            (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m);
          })(
            window,
            document,
            "script",
            "https://www.google-analytics.com/analytics.js",
            "ga"
          );
        }
        window.ga("create", player.gaId, "auto", "audioTracker");
      }
    }
  });
});

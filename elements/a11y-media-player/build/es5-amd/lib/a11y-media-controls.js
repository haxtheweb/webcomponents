define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/paper-slider/paper-slider.js",
  "../node_modules/@polymer/paper-listbox/paper-listbox.js",
  "../node_modules/@polymer/paper-item/paper-item.js",
  "../node_modules/@polymer/paper-tooltip/paper-tooltip.js",
  "../node_modules/@polymer/paper-menu-button/paper-menu-button.js",
  "../node_modules/@polymer/paper-toggle-button/paper-toggle-button.js",
  "../node_modules/@lrnwebcomponents/dropdown-select/dropdown-select.js",
  "./a11y-media-behaviors.js",
  "./a11y-media-button.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_ea98b060e11811e890362723497a45ce() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style is="custom-style">\n      :host {\n        display: block;\n        width: 100%;\n        max-width: 100%;\n        position: relative;\n        height: 44px;\n        color: var(--a11y-media-color);\n        background-color: var(--a11y-media-bg-color);\n        --paper-listbox-background-color: var(--a11y-media-button-bg-color);\n        --paper-listbox-color: var(--a11y-media-button-color);\n        --paper-listbox: {\n          padding: 0;\n        };\n        --paper-menu-button-dropdown-background: var(--a11y-media-button-bg-color);\n        --paper-menu-button: {\n          background-color: var(--a11y-media-button-bg-color);\n          color: var(--a11y-media-button-color);\n        };\n        --paper-menu-button-dropdown: {\n          background-color: var(--a11y-media-button-bg-color);\n          color: var(--a11y-media-button-color);\n          margin-top: 0 !important;\n          margin-bottom: 0 !important;\n        };\n        --paper-item-selected: {\n          color: var(--a11y-media-button-hover-color);\n        };\n        --paper-item-focused: {\n          color: var(--a11y-media-button-hover-color);\n        };\n        --primary-text-color: var(--a11y-media-button-color);\n      }\n      :host > #controls-left {\n        position: absolute;\n        left: 0;\n        min-width: 200px;\n      }\n      :host > #controls-right {\n        position: absolute;\n        right: 0;\n        top: -2px;\n      }\n      :host paper-menu-button,\n      :host dropdown-select {\n        padding: 0;\n      }\n      :host paper-icon-button {\n        background-color: var(--a11y-media-button-bg-color);\n        color: var(--a11y-media-button-color);\n      }\n      :host paper-icon-button:active,\n      :host paper-icon-button:focus,\n      :host paper-icon-button:hover {\n        background-color: var(--a11y-media-button-bg-color);\n        color: var(--a11y-media-button-color);\n      }\n      :host paper-item {\n        min-height: 40;\n      } \n      :host paper-slider {\n        @apply(--a11y-media-slider);\n      }\n      :host .play-status, \n      :host paper-icon-button {\n        border: none;\n        position: relative;\n      }\n      :host .play-status {\n        font-size: 85%;\n      }\n      :host .play-status.control-bar {\n        padding: 8px 13px 8px;\n      }\n      :host([hide-play-status]) .play-status {\n        display: none;\n      }\n      :host(:not([has-captions])) .captions {\n        display: none;\n      }\n      :host(:not([has-transcript])) .transcript,\n      :host(.stand-alone) .transcript {\n        display: none;\n      }\n      :host .setting {\n        display: flex;\n        justify-content: space-between;\n        width: 100%;\n      }\n      :host .setting-text {\n        min-width: 100px;\n      }\n      :host .setting-control {\n        max-width: 100px;\n      }\n      :host .setting-slider {\n        width: 130px;\n        margin-left: -15px;\n        margin-right: -15px;\n        @apply(--a11y-media-slider);\n      }\n      :host #speed {\n        --paper-slider-knob-start-color: var(--a11y-media-accent-color);\n        --paper-slider-knob-start-border-color: var(--a11y-media-accent-color);\n        --paper-slider-knob-end-color: var(--a11y-media-accent-color);\n        --paper-slider-knob-end-border-color: var(--a11y-media-accent-color);\n      }\n      :host #showvolume {\n        display: inline;\n        position: relative;\n      }\n      :host #volume {\n        z-index: 1;\n        position: absolute;\n        left: 0px;\n        top: -8px;\n        width: 0;\n        overflow: hidden;\n        transition: width 0.5s;\n        z-index: 3;\n        background-color: var(--a11y-media-button-bg-color);\n        --paper-slider-knob-end-color: var(--a11y-media-accent-color);\n        --paper-slider-knob-end-border-color: var(--a11y-media-accent-color);\n      }\n      :host #volume:active,\n      :host #volume:focus,\n      :host #volume:hover,\n      :host #volume.focus,\n      :host #showvolume:active #volume,\n      :host #showvolume:focus #volume,\n      :host #showvolume:hover #volume {\n        overflow: visible;\n        width: 100px;\n      }\n      :host([responsive-size="xs"]) #volume:active,\n      :host([responsive-size="xs"]) #volume:focus,\n      :host([responsive-size="xs"]) #volume:hover,\n      :host([responsive-size="xs"]) #volume.focus,\n      :host([responsive-size="xs"]) #showvolume:active #volume,\n      :host([responsive-size="xs"]) #showvolume:focus #volume,\n      :host([responsive-size="xs"]) #showvolume:hover #volume {\n        top: -35px\n        border-radius: 0.25em;\n      }\n      :host .sr-only {\n        position: absolute;\n        left: -99999;\n        top: 0;\n        height: 0;\n        width: 0;\n        overflow: hidden;\n      }\n    </style>\n    <div id="controls-left">\n      <a11y-media-button icon="[[playPause.icon]]" label="[[playPause.label]]"></a11y-media-button>\n      <a11y-media-button disabled$="[[compactControls]]" hidden$="[[compactControls]]" icon="[[rewindIcon]]" label="[[rewindLabel]]"></a11y-media-button>\n      <a11y-media-button disabled$="[[compactControls]]" hidden$="[[compactControls]]" icon="[[forwardIcon]]" label="[[forwardLabel]]"></a11y-media-button>\n      <a11y-media-button disabled$="[[compactControls]]" hidden$="[[compactControls]]" icon="[[restartIcon]]" label="[[restartLabel]]"></a11y-media-button>\n      <div id="showvolume">\n        <a11y-media-button id="mute" icon="[[muteUnmute.icon]]" label="[[muteUnmute.label]]"></a11y-media-button>\n        <span id="volume-slider-label" class="sr-only">[[volumeLabel]]</span>\n        <paper-slider aria-labelledby="volume-slider-label" id="volume" min="0" max="100" pin="" step="10" value$="[[volume]]"></paper-slider>\n      </div>\n      <span class="play-status control-bar" hidden$="[[compactControls]]">\n        <span id="statbar"></span>\n      </span>\n    </div>\n    <div id="controls-right">\n      <a11y-media-button class="captions" hidden="[[audioOnly]]" icon="[[captionsIcon]]" label="[[captionsLabel]]" toggle="[[cc]]">\n      </a11y-media-button>\n      <a11y-media-button class="transcript" controls="transcript" hidden$="[[compactControls]]" disabled$="[[compactControls]]" icon="[[transcriptIcon]]" label="[[transcriptLabel]]" toggle="[[!hideTranscript]]">\n      </a11y-media-button>\n      <paper-menu-button id="settings" allow-outside-scroll="" vertical-align="bottom" horizontal-align="right" ignore-select="">\n        <paper-icon-button icon$="[[settingsIcon]]" slot="dropdown-trigger" alt="[[settingsLabel]]"></paper-icon-button>\n        <paper-listbox id="settingslist" slot="dropdown-content">\n          <paper-item class="captions">\n            <div class="setting">\n              <div class="setting-text">[[captionsMenuLabel]]</div>\n              <div class="setting-control">\n                <dropdown-select id="tracks" no-label-float="" value="">\n                  <paper-item value="">[[captionsMenuOff]]</paper-item>\n                  <template is="dom-repeat" items="{{tracks}}" as="option">\n                    <paper-item value$="{{option.value}}">{{option.text}}</paper-item>\n                  </template>\n                </dropdown-select>\n              </div>\n            </div>\n          </paper-item>\n          <paper-item hidden$="[[!compactControls]]" class="transcript">\n            <div class="setting">\n              <div id="transcript-label" class="setting-text">\n                [[transcriptMenuLabel]]\n              </div>\n              <div class="setting-control">\n                <paper-toggle-button id="transcript-toggle" aria-labelledby="transcript-label" checked$="[[!hideTranscript]]" controls="transcript" disabled$="[[!compactControls]]">\n                </paper-toggle-button>\n              </div>\n            </div>\n          </paper-item>\n          <paper-item>\n            <div class="setting">\n              <div id="speed-label" class="setting-text">[[speedLabel]]</div>\n              <div class="setting-control">\n                <paper-slider id="speed" aria-labelledby="speed-label" class="setting-slider" label="tracks" min="0.5" max="4" pin="" step="0.5" tab-index="-1" value$="[[playbackRate]]"></paper-slider>\n              </div>\n            </div>\n          </paper-item>\n          <paper-item>\n            <div class="setting">\n              <div id="loop-label" class="setting-text">[[loopLabel]]</div>\n              <div class="setting-control">\n                <paper-toggle-button id="loop" aria-labelledby="loop-label" checked$="[[loop]]"></paper-toggle-button>\n              </div>\n            </div>\n          </paper-item>\n          <paper-item hidden$="[[!compactControls]]">\n            <span class="play-status settings-menu">\n              <span id="statmenu"></span>\n            </span>\n          </paper-item>\n        </paper-listbox>\n      </paper-menu-button>\n      <paper-tooltip for="settings">[[settingsLabel]]</paper-tooltip>\n      <template is="dom-if" if="[[fullscreenButton]]">\n        <template is="dom-if" if="[[!noHeight]]">\n          <a11y-media-button icon="[[fullscreenIcon]]" label="[[fullscreenLabel]]" toggle="[[fullscreen]]" step="1">\n          </a11y-media-button>\n        </template>\n      </template>\n    </div>\n'
      ],
      [
        '\n    <style is="custom-style">\n      :host {\n        display: block;\n        width: 100%;\n        max-width: 100%;\n        position: relative;\n        height: 44px;\n        color: var(--a11y-media-color);\n        background-color: var(--a11y-media-bg-color);\n        --paper-listbox-background-color: var(--a11y-media-button-bg-color);\n        --paper-listbox-color: var(--a11y-media-button-color);\n        --paper-listbox: {\n          padding: 0;\n        };\n        --paper-menu-button-dropdown-background: var(--a11y-media-button-bg-color);\n        --paper-menu-button: {\n          background-color: var(--a11y-media-button-bg-color);\n          color: var(--a11y-media-button-color);\n        };\n        --paper-menu-button-dropdown: {\n          background-color: var(--a11y-media-button-bg-color);\n          color: var(--a11y-media-button-color);\n          margin-top: 0 !important;\n          margin-bottom: 0 !important;\n        };\n        --paper-item-selected: {\n          color: var(--a11y-media-button-hover-color);\n        };\n        --paper-item-focused: {\n          color: var(--a11y-media-button-hover-color);\n        };\n        --primary-text-color: var(--a11y-media-button-color);\n      }\n      :host > #controls-left {\n        position: absolute;\n        left: 0;\n        min-width: 200px;\n      }\n      :host > #controls-right {\n        position: absolute;\n        right: 0;\n        top: -2px;\n      }\n      :host paper-menu-button,\n      :host dropdown-select {\n        padding: 0;\n      }\n      :host paper-icon-button {\n        background-color: var(--a11y-media-button-bg-color);\n        color: var(--a11y-media-button-color);\n      }\n      :host paper-icon-button:active,\n      :host paper-icon-button:focus,\n      :host paper-icon-button:hover {\n        background-color: var(--a11y-media-button-bg-color);\n        color: var(--a11y-media-button-color);\n      }\n      :host paper-item {\n        min-height: 40;\n      } \n      :host paper-slider {\n        @apply(--a11y-media-slider);\n      }\n      :host .play-status, \n      :host paper-icon-button {\n        border: none;\n        position: relative;\n      }\n      :host .play-status {\n        font-size: 85%;\n      }\n      :host .play-status.control-bar {\n        padding: 8px 13px 8px;\n      }\n      :host([hide-play-status]) .play-status {\n        display: none;\n      }\n      :host(:not([has-captions])) .captions {\n        display: none;\n      }\n      :host(:not([has-transcript])) .transcript,\n      :host(.stand-alone) .transcript {\n        display: none;\n      }\n      :host .setting {\n        display: flex;\n        justify-content: space-between;\n        width: 100%;\n      }\n      :host .setting-text {\n        min-width: 100px;\n      }\n      :host .setting-control {\n        max-width: 100px;\n      }\n      :host .setting-slider {\n        width: 130px;\n        margin-left: -15px;\n        margin-right: -15px;\n        @apply(--a11y-media-slider);\n      }\n      :host #speed {\n        --paper-slider-knob-start-color: var(--a11y-media-accent-color);\n        --paper-slider-knob-start-border-color: var(--a11y-media-accent-color);\n        --paper-slider-knob-end-color: var(--a11y-media-accent-color);\n        --paper-slider-knob-end-border-color: var(--a11y-media-accent-color);\n      }\n      :host #showvolume {\n        display: inline;\n        position: relative;\n      }\n      :host #volume {\n        z-index: 1;\n        position: absolute;\n        left: 0px;\n        top: -8px;\n        width: 0;\n        overflow: hidden;\n        transition: width 0.5s;\n        z-index: 3;\n        background-color: var(--a11y-media-button-bg-color);\n        --paper-slider-knob-end-color: var(--a11y-media-accent-color);\n        --paper-slider-knob-end-border-color: var(--a11y-media-accent-color);\n      }\n      :host #volume:active,\n      :host #volume:focus,\n      :host #volume:hover,\n      :host #volume.focus,\n      :host #showvolume:active #volume,\n      :host #showvolume:focus #volume,\n      :host #showvolume:hover #volume {\n        overflow: visible;\n        width: 100px;\n      }\n      :host([responsive-size="xs"]) #volume:active,\n      :host([responsive-size="xs"]) #volume:focus,\n      :host([responsive-size="xs"]) #volume:hover,\n      :host([responsive-size="xs"]) #volume.focus,\n      :host([responsive-size="xs"]) #showvolume:active #volume,\n      :host([responsive-size="xs"]) #showvolume:focus #volume,\n      :host([responsive-size="xs"]) #showvolume:hover #volume {\n        top: -35px\n        border-radius: 0.25em;\n      }\n      :host .sr-only {\n        position: absolute;\n        left: -99999;\n        top: 0;\n        height: 0;\n        width: 0;\n        overflow: hidden;\n      }\n    </style>\n    <div id="controls-left">\n      <a11y-media-button icon="[[playPause.icon]]" label="[[playPause.label]]"></a11y-media-button>\n      <a11y-media-button disabled\\$="[[compactControls]]" hidden\\$="[[compactControls]]" icon="[[rewindIcon]]" label="[[rewindLabel]]"></a11y-media-button>\n      <a11y-media-button disabled\\$="[[compactControls]]" hidden\\$="[[compactControls]]" icon="[[forwardIcon]]" label="[[forwardLabel]]"></a11y-media-button>\n      <a11y-media-button disabled\\$="[[compactControls]]" hidden\\$="[[compactControls]]" icon="[[restartIcon]]" label="[[restartLabel]]"></a11y-media-button>\n      <div id="showvolume">\n        <a11y-media-button id="mute" icon="[[muteUnmute.icon]]" label="[[muteUnmute.label]]"></a11y-media-button>\n        <span id="volume-slider-label" class="sr-only">[[volumeLabel]]</span>\n        <paper-slider aria-labelledby="volume-slider-label" id="volume" min="0" max="100" pin="" step="10" value\\$="[[volume]]"></paper-slider>\n      </div>\n      <span class="play-status control-bar" hidden\\$="[[compactControls]]">\n        <span id="statbar"></span>\n      </span>\n    </div>\n    <div id="controls-right">\n      <a11y-media-button class="captions" hidden="[[audioOnly]]" icon="[[captionsIcon]]" label="[[captionsLabel]]" toggle="[[cc]]">\n      </a11y-media-button>\n      <a11y-media-button class="transcript" controls="transcript" hidden\\$="[[compactControls]]" disabled\\$="[[compactControls]]" icon="[[transcriptIcon]]" label="[[transcriptLabel]]" toggle="[[!hideTranscript]]">\n      </a11y-media-button>\n      <paper-menu-button id="settings" allow-outside-scroll="" vertical-align="bottom" horizontal-align="right" ignore-select="">\n        <paper-icon-button icon\\$="[[settingsIcon]]" slot="dropdown-trigger" alt="[[settingsLabel]]"></paper-icon-button>\n        <paper-listbox id="settingslist" slot="dropdown-content">\n          <paper-item class="captions">\n            <div class="setting">\n              <div class="setting-text">[[captionsMenuLabel]]</div>\n              <div class="setting-control">\n                <dropdown-select id="tracks" no-label-float="" value="">\n                  <paper-item value="">[[captionsMenuOff]]</paper-item>\n                  <template is="dom-repeat" items="{{tracks}}" as="option">\n                    <paper-item value\\$="{{option.value}}">{{option.text}}</paper-item>\n                  </template>\n                </dropdown-select>\n              </div>\n            </div>\n          </paper-item>\n          <paper-item hidden\\$="[[!compactControls]]" class="transcript">\n            <div class="setting">\n              <div id="transcript-label" class="setting-text">\n                [[transcriptMenuLabel]]\n              </div>\n              <div class="setting-control">\n                <paper-toggle-button id="transcript-toggle" aria-labelledby="transcript-label" checked\\$="[[!hideTranscript]]" controls="transcript" disabled\\$="[[!compactControls]]">\n                </paper-toggle-button>\n              </div>\n            </div>\n          </paper-item>\n          <paper-item>\n            <div class="setting">\n              <div id="speed-label" class="setting-text">[[speedLabel]]</div>\n              <div class="setting-control">\n                <paper-slider id="speed" aria-labelledby="speed-label" class="setting-slider" label="tracks" min="0.5" max="4" pin="" step="0.5" tab-index="-1" value\\$="[[playbackRate]]"></paper-slider>\n              </div>\n            </div>\n          </paper-item>\n          <paper-item>\n            <div class="setting">\n              <div id="loop-label" class="setting-text">[[loopLabel]]</div>\n              <div class="setting-control">\n                <paper-toggle-button id="loop" aria-labelledby="loop-label" checked\\$="[[loop]]"></paper-toggle-button>\n              </div>\n            </div>\n          </paper-item>\n          <paper-item hidden\\$="[[!compactControls]]">\n            <span class="play-status settings-menu">\n              <span id="statmenu"></span>\n            </span>\n          </paper-item>\n        </paper-listbox>\n      </paper-menu-button>\n      <paper-tooltip for="settings">[[settingsLabel]]</paper-tooltip>\n      <template is="dom-if" if="[[fullscreenButton]]">\n        <template is="dom-if" if="[[!noHeight]]">\n          <a11y-media-button icon="[[fullscreenIcon]]" label="[[fullscreenLabel]]" toggle="[[fullscreen]]" step="1">\n          </a11y-media-button>\n        </template>\n      </template>\n    </div>\n'
      ]
    );
    _templateObject_ea98b060e11811e890362723497a45ce = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_ea98b060e11811e890362723497a45ce()
    ),
    is: "a11y-media-controls",
    behaviors: [
      a11yMediaBehaviors.MediaProps,
      a11yMediaBehaviors.GeneralFunctions,
      a11yMediaBehaviors.PlayerBehaviors
    ],
    listeners: {
      "button-clicked": "_onButtonClick",
      change: "_onSettingsChanged"
    },
    properties: {
      playPause: {
        type: Object,
        computed:
          "_getPlayPause(playing,pauseLabel,pauseIcon,playLabel,playIcon)"
      },
      muteUnmute: {
        type: Object,
        computed:
          "_getMuteUnmute(muted,muteLabel,muteIcon,unmuteLabel,unmuteIcon)"
      }
    },
    attached: function attached() {
      var root = this;
      root._addResponsiveUtility({
        element: root,
        attribute: "responsive-size",
        relativeToParent: !0,
        sm: 300,
        md: 600,
        lg: 900,
        xl: 1200
      });
    },
    ready: function ready() {
      var root = this;
      root.$.tracks.addEventListener("change", function(e) {
        if (null !== root.__selectedTrack) {
          if ("" !== e.detail.value) {
            root.fire("select-track", { control: this, value: e.detail.value });
            root.fire("toggle-cc", { control: this, value: !0 });
          } else {
            root.fire("toggle-cc", { control: this, value: !1 });
          }
        }
      });
      root.$.settings.addEventListener("iron-activate", function(e) {
        if (e.target == root.$.settingslist) e.preventDefault();
      });
      root.$.settings.addEventListener("iron-select", function(e) {
        e.preventDefault();
      });
      root.$.mute.$.button.onfocus = function() {
        root.$.volume.classList.add("focus");
      };
      root.$.mute.$.button.onblur = function() {
        root.$.volume.classList.remove("focus");
      };
    },
    setStatus: function setStatus(time) {
      this.$.statbar.innerText = time;
      this.$.statmenu.innerText = time;
    },
    setTracks: function setTracks(tracks) {
      this.set("tracks", tracks.slice(0));
    },
    _getPlayPause: function _getPlayPause(
      playing,
      pauseLabel,
      pauseIcon,
      playLabel,
      playIcon
    ) {
      return playing
        ? { label: pauseLabel, icon: pauseIcon }
        : { label: playLabel, icon: playIcon };
    },
    _getMuteUnmute: function _getMuteUnmute(
      muted,
      muteLabel,
      muteIcon,
      unmuteLabel,
      unmuteIcon
    ) {
      return muted
        ? { label: unmuteLabel, icon: unmuteIcon }
        : { label: muteLabel, icon: muteIcon };
    },
    _onButtonClick: function _onButtonClick(e) {
      this.fire("controls-change", e.detail);
    },
    _onSettingsChanged: function _onSettingsChanged(e) {
      this.fire("controls-change", e.target);
    }
  });
});

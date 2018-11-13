import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/paper-slider/paper-slider.js";
import "../node_modules/@polymer/paper-listbox/paper-listbox.js";
import "../node_modules/@polymer/paper-item/paper-item.js";
import "../node_modules/@polymer/paper-tooltip/paper-tooltip.js";
import "../node_modules/@polymer/paper-menu-button/paper-menu-button.js";
import "../node_modules/@polymer/paper-toggle-button/paper-toggle-button.js";
import "../node_modules/@lrnwebcomponents/dropdown-select/dropdown-select.js";
import "./a11y-media-behaviors.js";
import "./a11y-media-button.js";
Polymer({
  _template: html`
    <style is="custom-style">
      :host {
        display: block;
        width: 100%;
        max-width: 100%;
        position: relative;
        height: 44px;
        color: var(--a11y-media-color);
        background-color: var(--a11y-media-bg-color);
        --paper-listbox-background-color: var(--a11y-media-button-bg-color);
        --paper-listbox-color: var(--a11y-media-button-color);
        --paper-listbox: {
          padding: 0;
        };
        --paper-menu-button-dropdown-background: var(--a11y-media-button-bg-color);
        --paper-menu-button: {
          background-color: var(--a11y-media-button-bg-color);
          color: var(--a11y-media-button-color);
        };
        --paper-menu-button-dropdown: {
          background-color: var(--a11y-media-button-bg-color);
          color: var(--a11y-media-button-color);
          margin-top: 0 !important;
          margin-bottom: 0 !important;
        };
        --paper-item-selected: {
          color: var(--a11y-media-button-hover-color);
        };
        --paper-item-focused: {
          color: var(--a11y-media-button-hover-color);
        };
        --primary-text-color: var(--a11y-media-button-color);
      }
      :host > #controls-left {
        position: absolute;
        left: 0;
        min-width: 200px;
      }
      :host > #controls-right {
        position: absolute;
        right: 0;
        top: -2px;
      }
      :host paper-menu-button,
      :host dropdown-select {
        padding: 0;
      }
      :host paper-icon-button {
        background-color: var(--a11y-media-button-bg-color);
        color: var(--a11y-media-button-color);
      }
      :host paper-icon-button:active,
      :host paper-icon-button:focus,
      :host paper-icon-button:hover {
        background-color: var(--a11y-media-button-bg-color);
        color: var(--a11y-media-button-color);
      }
      :host paper-item {
        min-height: 40;
      } 
      :host paper-slider {
        @apply --a11y-media-slider;
      }
      :host .play-status, 
      :host paper-icon-button {
        border: none;
        position: relative;
      }
      :host .play-status {
        font-size: 85%;
      }
      :host .play-status.control-bar {
        padding: 8px 13px 8px;
      }
      :host([hide-play-status]) .play-status {
        display: none;
      }
      :host(:not([has-captions])) .captions {
        display: none;
      }
      :host(:not([has-transcript])) .transcript,
      :host(.stand-alone) .transcript {
        display: none;
      }
      :host .setting {
        display: flex;
        justify-content: space-between;
        width: 100%;
      }
      :host .setting-text {
        min-width: 100px;
      }
      :host .setting-control {
        max-width: 100px;
      }
      :host .setting-slider {
        width: 130px;
        margin-left: -15px;
        margin-right: -15px;
        @apply --a11y-media-slider;
      }
      :host #speed {
        --paper-slider-knob-start-color: var(--a11y-media-accent-color);
        --paper-slider-knob-start-border-color: var(--a11y-media-accent-color);
        --paper-slider-knob-end-color: var(--a11y-media-accent-color);
        --paper-slider-knob-end-border-color: var(--a11y-media-accent-color);
      }
      :host #showvolume {
        display: inline;
        position: relative;
      }
      :host #volume {
        z-index: 1;
        position: absolute;
        left: 0px;
        top: -8px;
        width: 0;
        overflow: hidden;
        transition: width 0.5s;
        z-index: 3;
        background-color: var(--a11y-media-button-bg-color);
        --paper-slider-knob-end-color: var(--a11y-media-accent-color);
        --paper-slider-knob-end-border-color: var(--a11y-media-accent-color);
      }
      :host #volume:active,
      :host #volume:focus,
      :host #volume:hover,
      :host #volume.focus,
      :host #showvolume:active #volume,
      :host #showvolume:focus #volume,
      :host #showvolume:hover #volume {
        overflow: visible;
        width: 100px;
      }
      :host([responsive-size="xs"]) #volume:active,
      :host([responsive-size="xs"]) #volume:focus,
      :host([responsive-size="xs"]) #volume:hover,
      :host([responsive-size="xs"]) #volume.focus,
      :host([responsive-size="xs"]) #showvolume:active #volume,
      :host([responsive-size="xs"]) #showvolume:focus #volume,
      :host([responsive-size="xs"]) #showvolume:hover #volume {
        top: -35px
        border-radius: 4px;
      }
      :host .sr-only {
        position: absolute;
        left: -99999;
        top: 0;
        height: 0;
        width: 0;
        overflow: hidden;
      }
    </style>
    <div id="controls-left">
      <a11y-media-button icon="[[playPause.icon]]" label="[[playPause.label]]"></a11y-media-button>
      <a11y-media-button disabled\$="[[compactControls]]" hidden\$="[[compactControls]]" icon="[[rewindIcon]]" label="[[rewindLabel]]"></a11y-media-button>
      <a11y-media-button disabled\$="[[compactControls]]" hidden\$="[[compactControls]]" icon="[[forwardIcon]]" label="[[forwardLabel]]"></a11y-media-button>
      <a11y-media-button disabled\$="[[compactControls]]" hidden\$="[[compactControls]]" icon="[[restartIcon]]" label="[[restartLabel]]"></a11y-media-button>
      <div id="showvolume">
        <a11y-media-button id="mute" icon="[[muteUnmute.icon]]" label="[[muteUnmute.label]]"></a11y-media-button>
        <span id="volume-slider-label" class="sr-only">[[volumeLabel]]</span>
        <paper-slider aria-labelledby="volume-slider-label" id="volume" min="0" max="100" pin="" step="10" value\$="[[volume]]"></paper-slider>
      </div>
      <span class="play-status control-bar" hidden\$="[[compactControls]]">
        <span id="statbar"></span>
      </span>
    </div>
    <div id="controls-right">
      <a11y-media-button class="captions" hidden="[[audioOnly]]" icon="[[captionsIcon]]" label="[[captionsLabel]]" toggle="[[cc]]">
      </a11y-media-button>
      <a11y-media-button class="transcript" controls="transcript" hidden\$="[[compactControls]]" disabled\$="[[compactControls]]" icon="[[transcriptIcon]]" label="[[transcriptLabel]]" toggle="[[!hideTranscript]]">
      </a11y-media-button>
      <paper-menu-button id="settings" allow-outside-scroll="" vertical-align="bottom" horizontal-align="right" ignore-select="">
        <paper-icon-button icon\$="[[settingsIcon]]" slot="dropdown-trigger" alt="[[settingsLabel]]"></paper-icon-button>
        <paper-listbox id="settingslist" slot="dropdown-content">
          <paper-item class="captions">
            <div class="setting">
              <div class="setting-text">[[captionsMenuLabel]]</div>
              <div class="setting-control">
                <dropdown-select id="tracks" no-label-float="" value="">
                  <paper-item value="">[[captionsMenuOff]]</paper-item>
                  <template is="dom-repeat" items="{{tracks}}" as="option">
                    <paper-item value\$="{{option.value}}">{{option.text}}</paper-item>
                  </template>
                </dropdown-select>
              </div>
            </div>
          </paper-item>
          <paper-item hidden\$="[[!compactControls]]" class="transcript">
            <div class="setting">
              <div id="transcript-label" class="setting-text">
                [[transcriptMenuLabel]]
              </div>
              <div class="setting-control">
                <paper-toggle-button id="transcript-toggle" aria-labelledby="transcript-label" checked\$="[[!hideTranscript]]" controls="transcript" disabled\$="[[!compactControls]]">
                </paper-toggle-button>
              </div>
            </div>
          </paper-item>
          <paper-item>
            <div class="setting">
              <div id="speed-label" class="setting-text">[[speedLabel]]</div>
              <div class="setting-control">
                <paper-slider id="speed" aria-labelledby="speed-label" class="setting-slider" label="tracks" min="0.5" max="4" pin="" step="0.5" tab-index="-1" value\$="[[playbackRate]]"></paper-slider>
              </div>
            </div>
          </paper-item>
          <paper-item>
            <div class="setting">
              <div id="loop-label" class="setting-text">[[loopLabel]]</div>
              <div class="setting-control">
                <paper-toggle-button id="loop" aria-labelledby="loop-label" checked\$="[[loop]]"></paper-toggle-button>
              </div>
            </div>
          </paper-item>
          <paper-item hidden\$="[[!compactControls]]">
            <span class="play-status settings-menu">
              <span id="statmenu"></span>
            </span>
          </paper-item>
        </paper-listbox>
      </paper-menu-button>
      <paper-tooltip for="settings">[[settingsLabel]]</paper-tooltip>
      <template is="dom-if" if="[[fullscreenButton]]">
        <template is="dom-if" if="[[!noHeight]]">
          <a11y-media-button icon="[[fullscreenIcon]]" label="[[fullscreenLabel]]" toggle="[[fullscreen]]" step="1">
          </a11y-media-button>
        </template>
      </template>
    </div>
`,
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
      computed: "_getPlayPause(playing,pauseLabel,pauseIcon,playLabel,playIcon)"
    },
    muteUnmute: {
      type: Object,
      computed:
        "_getMuteUnmute(muted,muteLabel,muteIcon,unmuteLabel,unmuteIcon)"
    }
  },
  attached: function() {
    let root = this;
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
  ready: function() {
    let root = this;
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
    root.$.settings.addEventListener("iron-activate", e => {
      if (e.target == root.$.settingslist) e.preventDefault();
    });
    root.$.settings.addEventListener("iron-select", e => {
      e.preventDefault();
    });
    root.$.mute.$.button.onfocus = function() {
      root.$.volume.classList.add("focus");
    };
    root.$.mute.$.button.onblur = function() {
      root.$.volume.classList.remove("focus");
    };
  },
  setStatus: function(time) {
    this.$.statbar.innerText = time;
    this.$.statmenu.innerText = time;
  },
  setTracks: function(tracks) {
    this.set("tracks", tracks.slice(0));
  },
  _getPlayPause: function(playing, pauseLabel, pauseIcon, playLabel, playIcon) {
    return playing
      ? { label: pauseLabel, icon: pauseIcon }
      : { label: playLabel, icon: playIcon };
  },
  _getMuteUnmute: function(
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
  _onButtonClick: function(e) {
    this.fire("controls-change", e.detail);
  },
  _onSettingsChanged: function(e) {
    this.fire("controls-change", e.target);
  }
});

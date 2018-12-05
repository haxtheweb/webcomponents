/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { A11yMediaPlayerProperties } from "./a11y-media-player-properties.js";
import "@polymer/paper-menu-button/paper-menu-button.js";
import "@polymer/paper-listbox/paper-listbox.js";
import "@polymer/paper-item/paper-item.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-toggle-button/paper-toggle-button.js";
import "@lrnwebcomponents/dropdown-select/dropdown-select.js";
import "@polymer/paper-slider/paper-slider.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "./a11y-media-button.js";

export { A11yMediaControls };
/**
 * `a11y-media-controls`
 * `The controls bar for the a11y-media-player.`
 *
 * @microcopy - language worth noting:
```<a11y-media-button 
  accent-color$="[[accentColor]]"             // Optional accent color for controls, 
                                              // using the following materialize colors: 
                                              // red, pink, purple, deep-purple, indigo, blue, 
                                              // light blue, cyan, teal, green, light green, lime, 
                                              // yellow, amber, orange, deep-orange, and brown. 
                                              // Default is null. 
  allow-fullscreen$="[[allowFullscreen]]"     // Allow fullscreen mode?
  audio-only$="[[audioOnly]]"                 // Is media audio only?
  autoplay$="[[autoplay]]"                    // Is player set to autoplay (not recommended for a11y)?
  cc$="[[cc]]"                                // Are closed captions toggled?
  dark$="[[dark]]"                            // Is the color scheme dark? Default is light.    
  disableFullscreen$="[[disableFullscreen]]"  // Is full screen mode disabled?
  fullscreen$="[[fullscreen]]"                // Is full screen mode toggled on?
  hide-elapsed-time$="[[hideElapsedTime]]"    // Is elapsed time hidden?
  loop$="[[loop]]"                            // Is video on a loop?
  microcopy$="[[microcopy]]"                  // Optional customization or text and icons
  muted$="[[muted]]"                          // Is video muted?
  responsive-size$="[[responsiveSize]]"       // The size of the player determines how controls are displayed
  volume$="[[volume]]">                       // The initial volume of the video
</a11y-media-button>```
 *
 * @extends A11yMediaPlayerProperties
 * @customElement
 * @polymer
 */
class A11yMediaControls extends A11yMediaPlayerProperties {
  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * play/pause button
       */
      playPause: {
        type: Object,
        computed:
          "_getPlayPause(playing,pauseLabel,pauseIcon,playLabel,playIcon)"
      },
      /**
       * mute/unmute button
       */
      muteUnmute: {
        type: Object,
        computed:
          "_getMuteUnmute(muted,muteLabel,muteIcon,unmuteLabel,unmuteIcon)"
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "a11y-media-controls";
  }

  //get player-specifc properties
  static get behaviors() {
    return [A11yMediaPlayerProperties];
  }

  //render function
  static get template() {
    return html`
      <style is="custom-style">
        :host {
          display: block;
          width: 100%;
          max-width: 100%;
          position: relative;
          height: 44px;
          color: var(--a11y-media-color);
          background-color: var(--a11y-media-bg-color);
          --paper-listbox-background-color: var(--a11y-media-controls-bg-color);
          --paper-listbox-color: var(--a11y-media-controls-color);
          --paper-listbox: {
            padding: 0;
          };
          --paper-menu-button-dropdown-background: var(--a11y-media-controls-bg-color);
          --paper-menu-button: {
            background-color: var(--a11y-media-controls-bg-color);
            color: var(--a11y-media-controls-color);
          };
          --paper-menu-button-dropdown: {
            background-color: var(--a11y-media-controls-bg-color);
            color: var(--a11y-media-controls-color);
            margin-top: 0 !important;
            margin-bottom: 0 !important;
          };
          --paper-item-selected: {
            color: var(--a11y-media-controls-hover-color);
          };
          --paper-item-focused: {
            color: var(--a11y-media-controls-hover-color);
          };
          --primary-text-color: var(--a11y-media-controls-color);
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
          background-color: var(--a11y-media-controls-bg-color);
          color: var(--a11y-media-controls-color);
        }
        :host paper-icon-button:active,
        :host paper-icon-button:focus,
        :host paper-icon-button:hover {
          background-color: var(--a11y-media-controls-bg-color);
          color: var(--a11y-media-controls-color);
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
          background-color: var(--a11y-media-controls-bg-color);
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
        <a11y-media-button
          icon="[[playPause.icon]]"
          label="[[playPause.label]]"
          on-tap="_onButtonTap"
        ></a11y-media-button>
        <a11y-media-button
          disabled$="[[compactControls]]"
          hidden$="[[compactControls]]"
          icon="[[rewindIcon]]"
          label="[[rewindLabel]]"
          on-tap="_onButtonTap"
        ></a11y-media-button>
        <a11y-media-button
          disabled$="[[compactControls]]"
          hidden$="[[compactControls]]"
          icon="[[forwardIcon]]"
          label="[[forwardLabel]]"
          on-tap="_onButtonTap"
        ></a11y-media-button>
        <a11y-media-button
          disabled$="[[compactControls]]"
          hidden$="[[compactControls]]"
          icon="[[restartIcon]]"
          label="[[restartLabel]]"
          on-tap="_onButtonTap"
        ></a11y-media-button>
        <div id="showvolume">
          <a11y-media-button
            id="mute"
            icon="[[muteUnmute.icon]]"
            label="[[muteUnmute.label]]"
            on-tap="_onButtonTap"
          ></a11y-media-button>
          <span id="volume-slider-label" class="sr-only">[[volumeLabel]]</span>
          <paper-slider
            aria-labelledby="volume-slider-label"
            id="volume"
            min="0"
            max="100"
            on-change="_onSettingsChanged"
            pin=""
            step="10"
            value$="[[volume]]"
          ></paper-slider>
        </div>
        <span class="play-status control-bar" hidden$="[[compactControls]]">
          <span id="statbar"></span>
        </span>
      </div>
      <div id="controls-right">
        <a11y-media-button
          class="captions"
          hidden="[[audioOnly]]"
          icon="[[captionsIcon]]"
          label="[[captionsLabel]]"
          on-tap="_onButtonTap"
          toggle="[[cc]]"
        >
        </a11y-media-button>
        <a11y-media-button
          class="transcript"
          controls="transcript"
          hidden$="[[compactControls]]"
          disabled$="[[compactControls]]"
          icon="[[transcriptIcon]]"
          label="[[transcriptLabel]]"
          on-tap="_onButtonTap"
          toggle="[[!hideTranscript]]"
        >
        </a11y-media-button>
        <paper-menu-button
          id="settings"
          allow-outside-scroll=""
          horizontal-align="right"
          ignore-select=""
          on-change="_onSettingsChanged"
          on-iron-activate="_handleSettingsActivate"
          on-iron-select="_handleSettingsSelect"
          vertical-align="bottom"
        >
          <paper-icon-button
            icon$="[[settingsIcon]]"
            slot="dropdown-trigger"
            alt="[[settingsLabel]]"
          ></paper-icon-button>
          <paper-listbox id="settingslist" slot="dropdown-content">
            <paper-item class="captions">
              <div class="setting">
                <div class="setting-text">[[captionsMenuLabel]]</div>
                <div class="setting-control">
                  <dropdown-select
                    id="tracks"
                    no-label-float=""
                    on-change="_handleTrackChange"
                    value=""
                  >
                    <paper-item value="">[[captionsMenuOff]]</paper-item>
                    <template is="dom-repeat" items="{{tracks}}" as="option">
                      <paper-item value$="{{option.value}}"
                        >{{option.text}}</paper-item
                      >
                    </template>
                  </dropdown-select>
                </div>
              </div>
            </paper-item>
            <paper-item hidden$="[[!compactControls]]" class="transcript">
              <div class="setting">
                <div id="transcript-label" class="setting-text">
                  [[transcriptMenuLabel]]
                </div>
                <div class="setting-control">
                  <paper-toggle-button
                    id="transcript-toggle"
                    aria-labelledby="transcript-label"
                    checked$="[[!hideTranscript]]"
                    controls="transcript"
                    disabled$="[[!compactControls]]"
                  >
                  </paper-toggle-button>
                </div>
              </div>
            </paper-item>
            <paper-item>
              <div class="setting">
                <div id="speed-label" class="setting-text">[[speedLabel]]</div>
                <div class="setting-control">
                  <paper-slider
                    id="speed"
                    aria-labelledby="speed-label"
                    class="setting-slider"
                    label="tracks"
                    min="0.5"
                    max="4"
                    pin=""
                    step="0.5"
                    tab-index="-1"
                    value$="[[playbackRate]]"
                  ></paper-slider>
                </div>
              </div>
            </paper-item>
            <paper-item>
              <div class="setting">
                <div id="loop-label" class="setting-text">[[loopLabel]]</div>
                <div class="setting-control">
                  <paper-toggle-button
                    id="loop"
                    aria-labelledby="loop-label"
                    checked$="[[loop]]"
                  ></paper-toggle-button>
                </div>
              </div>
            </paper-item>
            <paper-item hidden$="[[!compactControls]]">
              <span class="play-status settings-menu">
                <span id="statmenu"></span>
              </span>
            </paper-item>
          </paper-listbox>
        </paper-menu-button>
        <paper-tooltip for="settings">[[settingsLabel]]</paper-tooltip>
        <template is="dom-if" if="[[fullscreenButton]]">
          <template is="dom-if" if="[[!noHeight]]">
            <a11y-media-button
              icon="[[fullscreenIcon]]"
              label="[[fullscreenLabel]]"
              on-tap="_onButtonTap"
              toggle="[[fullscreen]]"
              step="1"
            >
            </a11y-media-button>
          </template>
        </template>
      </div>
    `;
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    let root = this;
    root._addResponsiveUtility({
      element: root,
      attribute: "responsive-size",
      relativeToParent: true,
      sm: 300,
      md: 600,
      lg: 900,
      xl: 1200
    });
  }

  /**
   * sets target for a11y keys
   */
  ready() {
    super.ready();
    let root = this;
    // when the mute button is in focus,
    // add focus class to make the volume slider appear
    root.$.mute.$.button.onfocus = function() {
      root.$.volume.classList.add("focus");
    };
    // when the mute button is blurred,
    // remove focus class to make the volume slider disappear
    root.$.mute.$.button.onblur = function() {
      root.$.volume.classList.remove("focus");
    };
  }

  /**
   * updates the time/length
   */
  setStatus(time) {
    this.$.statbar.innerText = time;
    this.$.statmenu.innerText = time;
  }

  /**
   * loads tracks from array
   */
  setTracks(tracks) {
    this.set("tracks", []);
    this.set("tracks", tracks.slice(0));
  }

  /**
   * set play/pause button
   */
  _getPlayPause(playing, pauseLabel, pauseIcon, playLabel, playIcon) {
    return playing
      ? { label: pauseLabel, icon: pauseIcon }
      : { label: playLabel, icon: playIcon };
  }

  /**
   * set play/pause button
   */
  _getMuteUnmute(muted, muteLabel, muteIcon, unmuteLabel, unmuteIcon) {
    return muted
      ? { label: unmuteLabel, icon: unmuteIcon }
      : { label: muteLabel, icon: muteIcon };
  }

  /**
   * handles when the tracks dropdown selection changes
   * (when the tracks dropdown-select changes, update track and CC button)
   */
  _handleTrackChange(e) {
    let root = this;
    if (root.__selectedTrack !== null) {
      if (e.detail.value !== "") {
        root.dispatchEvent(
          new CustomEvent("select-track", {
            detail: { control: root, value: e.detail.value }
          })
        );
        root.dispatchEvent(
          new CustomEvent("toggle-cc", {
            detail: { control: root, value: true }
          })
        );
      } else {
        root.dispatchEvent(
          new CustomEvent("toggle-cc", {
            detail: { control: root, value: false }
          })
        );
      }
    }
  }

  /**
   * prevent settings menu from being closed before action is taken
   */
  _handleSettingsSelect(e) {
    //e.preventDefault();
  }

  /**
   * prevent settings menu from being closed before action is taken
   */
  _handleSettingsActivate(e) {
    //if (e.target == this.$.settingslist) e.preventDefault();
  }
  /**
   * determine which button was clicked and act accordingly
   */
  _onButtonTap(e) {
    this.dispatchEvent(
      new CustomEvent("controls-change", { detail: e.detail })
    );
  }

  /**
   * determine which button was clicked and act accordingly
   */
  _onSettingsChanged(e) {
    this.dispatchEvent(
      new CustomEvent("controls-change", { detail: e.target })
    );
  }
}
window.customElements.define(A11yMediaControls.tag, A11yMediaControls);

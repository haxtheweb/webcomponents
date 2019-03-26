/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { A11yMediaBehaviors } from "./a11y-media-behaviors.js";
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
 *
 * @extends A11yMediaBehaviors
 * @customElement
 * @polymer
 */
class A11yMediaControls extends A11yMediaBehaviors {
  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * Use compact controls?
       */
      compactControls: {
        name: "compactControls",
        type: Boolean,
        computed: "_getCompactControls(responsiveSize)"
      },
      /**
       * Is the player a fixed height (iframe mode) so that theure is no transcript toggle?
       */
      fixedHeight: {
        type: Boolean,
        value: false
      },
      /**
       * Is fullscreen mode?
       */
      fullscreen: {
        name: "fullscreen",
        type: Boolean,
        value: false
      },
      /**
       * show the FullscreenButton?
       */
      fullscreenButton: {
        name: "fullscreenButton",
        type: Boolean,
        value: false,
        nofity: true
      },

      /**
       * Does the player have tracks?
       */
      hasCaptions: {
        name: "hasCaptions",
        type: Boolean,
        value: false,
        notify: true
      },

      /**
       * initially hide the transcript?
       */
      hideTranscript: {
        name: "hideTranscript",
        type: Boolean,
        value: false
      },
      /**
       * hide the transcript toggle menu item?
       */
      hideTranscriptButton: {
        type: Boolean,
        computed: "_hideTranscriptButton(noTranscriptToggle,compactControls)"
      },
      /**
       * mute/unmute button
       */
      muteUnmute: {
        name: "muteUnmute",
        type: Object
      },
      /**
       * hide the print transcript feature available?
       */
      noPrinting: {
        type: Boolean,
        computed: "_noPrinting(standAlone,fixedHeight)"
      },
      /**
       * Is the transctipt toggle feature available?
       */
      noTranscriptToggle: {
        type: Boolean,
        computed: "_noTranscriptToggle(standAlone,fixedHeight,hasTranscript)"
      },
      /**
       * Size of the a11y media element for responsive styling
       */
      responsiveSize: {
        name: "responsiveSize",
        type: String,
        notify: true,
        value: "xs",
        reflectToAttribute: true
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
    return [A11yMediaBehaviors];
  }

  //render function
  static get template() {
    return html`
      <style is="custom-style">
        :host {
          display: block;
          width: 100%;
          max-width: 100%;
          height: 44px;
          max-height: 44px;
          position: relative;
          color: var(--a11y-media-color);
          --primary-text-color: var(--a11y-media-settings-menu-color);
          --paper-menu-button-dropdown-background: var(--a11y-media-settings-menu-bg-color);
          --paper-listbox-background-color: var(--a11y-media-settings-menu-bg-color);
          --paper-listbox-color: var(--a11y-media-settings-menu-color);
          --paper-listbox: {
            padding: 0;
          };
          --paper-menu-button: {
            background-color: var(--a11y-media-settings-menu-bg-color);
            color: var(--a11y-media-settings-menu-color);
          };
          --paper-menu-button-dropdown: {
            background-color: var(--a11y-media-settings-menu-bg-color);
            color: var(--a11y-media-settings-menu-color);
            margin-top: 0 !important;
            margin-bottom: 0 !important;
          };
          --paper-item-selected: {
            color: var(--a11y-media-settings-menu-hover-color);
          };
          --paper-item-focused: {
            color: var(--a11y-media-settings-menu-hover-color);
          };
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
          background-color: var(--a11y-media-settings-menu-bg-color);
          color: var(--a11y-media-settings-menu-color);
        }
        :host paper-icon-button:active,
        :host paper-icon-button:focus,
        :host paper-icon-button:hover {
          background-color: var(--a11y-media-settings-menu-bg-color);
          color: var(--a11y-media-settings-menu-color);
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
        :host .setting {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        :host .setting-text {
          min-width: 125px;
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
          left: 30px;
          top: -5px;
          width: 0;
          overflow: hidden;
          transition: width 0.5s;
          z-index: 3;
          background-color: var(--a11y-media-bg-color);
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
          action$="[[playPause.action]]"
          icon$="[[playPause.icon]]"
          label$="[[playPause.label]]"
          on-tap="_onButtonTap"
        ></a11y-media-button>
        <a11y-media-button
          action="rewind"
          disabled$="[[disableSeek]]"
          hidden$="[[compactControls]]"
          icon$="[[_getLocal('rewind','icon')]]"
          label$="[[_getLocal('rewind','label')]]"
          on-tap="_onButtonTap"
        ></a11y-media-button>
        <a11y-media-button
          action="forward"
          disabled$="[[disableSeek]]"
          hidden$="[[compactControls]]"
          icon$="[[_getLocal('forward','icon')]]"
          label$="[[_getLocal('forward','label')]]"
          on-tap="_onButtonTap"
        ></a11y-media-button>
        <a11y-media-button
          action="restart"
          disabled$="[[disableSeek]]"
          hidden$="[[compactControls]]"
          icon$="[[_getLocal('restart','icon')]]"
          label$="[[_getLocal('restart','label')]]"
          on-tap="_onButtonTap"
        ></a11y-media-button>
        <div id="showvolume">
          <a11y-media-button
            id="mute"
            action$="[[muteUnmute.action]]"
            icon$="[[muteUnmute.icon]]"
            label$="[[muteUnmute.label]]"
            on-tap="_onButtonTap"
          ></a11y-media-button>
          <paper-slider
            id="volume"
            aria-labelledby="volume-slider-label"
            label$="[[volumeLabel]]"
            min="0"
            max="100"
            on-change="_onSettingsChanged"
            pin
            step="10"
            value$="[[volume]]"
          ></paper-slider>
        </div>
        <span class="play-status control-bar">
          <span id="statbar"></span>
        </span>
      </div>
      <div id="controls-right">
        <a11y-media-button
          action="captions"
          disabled$="[[!hasCaptions]]"
          hidden$="[[!hasCaptions]]"
          icon$="[[_getLocal('captions','icon')]]"
          label$="[[_getLocal('captions','label')]]"
          on-tap="_onButtonTap"
          toggle$="[[cc]]"
        >
        </a11y-media-button>
        <a11y-media-button
          action="transcript"
          controls="transcript"
          disabled$="[[hideTranscriptButton]]"
          hidden$="[[hideTranscriptButton]]"
          icon$="[[_getLocal('transcript','icon')]]"
          label$="[[_getLocal('transcript','label')]]"
          on-tap="_onButtonTap"
          toggle$="[[hideTranscript]]"
        >
        </a11y-media-button>
        <a11y-media-button
          action="print"
          disabled$="[[noPrinting]]"
          hidden$="[[noPrinting]]"
          icon$="[[_getLocal('print','icon')]]"
          label="[[_getLocal('print','label')]]"
          on-tap="_handlePrintClick"
        >
        </a11y-media-button>
        <template is="dom-if" if="[[fullscreenButton]]">
          <a11y-media-button
            action="fullscreen"
            hidden$="[[audioNoThumb]]"
            icon$="[[_getLocal('fullscreen','icon')]]"
            label$="[[_getLocal('fullscreen','label')]]"
            on-tap="_onButtonTap"
            toggle$="[[fullscreen]]"
            step="1"
          >
          </a11y-media-button>
        </template>
        <paper-menu-button
          id="settings"
          allow-outside-scroll
          horizontal-align="right"
          ignore-select
          on-change="_onSettingsChanged"
          on-iron-activate="_handleSettingsActivate"
          on-iron-select="_handleSettingsSelect"
          vertical-align="bottom"
        >
          <paper-icon-button
            action="settings"
            alt$="[[_getLocal('settings','label')]]"
            icon$="[[_getLocal('settings','icon')]]"
            slot="dropdown-trigger"
          >
          </paper-icon-button>
          <paper-listbox id="settingslist" slot="dropdown-content">
            <paper-item hidden$="[[!hasCaptions]]">
              <div class="setting">
                <div class="setting-text">
                  [[_getLocal('captions','label')]]
                </div>
                <div class="setting-control">
                  <dropdown-select
                    id="tracks"
                    disabled$="[[!hasCaptions]]"
                    no-label-float
                    on-change="_handleTrackChange"
                    value
                  >
                    <paper-item value=""
                      >[[_getLocal('captions','off')]]</paper-item
                    >
                    <template is="dom-repeat" items="{{tracks}}" as="option">
                      <paper-item value$="{{option.value}}"
                        >{{option.text}}</paper-item
                      >
                    </template>
                  </dropdown-select>
                </div>
              </div>
            </paper-item>
            <paper-item hidden$="[[noTranscriptToggle]]">
              <div class="setting">
                <div id="transcript-label" class="setting-text">
                  [[_getLocal('transcript','label')]]
                </div>
                <div class="setting-control">
                  <paper-toggle-button
                    id="transcript-toggle"
                    aria-labelledby="transcript-label"
                    checked$="[[!hideTranscript]]"
                    controls="transcript"
                    disabled$="[[noTranscriptToggle]]"
                  >
                  </paper-toggle-button>
                </div>
              </div>
            </paper-item>
            <paper-item>
              <div class="setting">
                <div id="loop-label" class="setting-text">
                  [[_getLocal('loop','label')]]
                </div>
                <div class="setting-control">
                  <paper-toggle-button
                    id="loop"
                    aria-labelledby="loop-label"
                    checked$="[[loop]]"
                  ></paper-toggle-button>
                </div>
              </div>
            </paper-item>
            <paper-item>
              <div class="setting">
                <div id="speed-label" class="setting-text">
                  [[_getLocal('speed','label')]]
                </div>
                <div class="setting-control">
                  <paper-slider
                    id="speed"
                    aria-labelledby="speed-label"
                    class="setting-slider"
                    min="0.5"
                    max="4"
                    pin
                    step="0.5"
                    tab-index="-1"
                    value$="[[playbackRate]]"
                  ></paper-slider>
                </div>
              </div>
            </paper-item>
          </paper-listbox>
        </paper-menu-button>
        <paper-tooltip for="settings">
          [[_getLocal('settings','label')]]
        </paper-tooltip>
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
   * updates the play status of the media
   *
   * @param {string} the status, eg., `Loading...` or `00:02:01/00:11:43`
   */
  setStatus(status) {
    this.$.statbar.innerText = status;
  }

  /**
   * loads tracks from array
   *
   * @param {object} the tracks of the media
   */
  setTracks(tracks) {
    this.set("tracks", []);
    this.set("tracks", tracks.slice(0));
  }

  /**
   * returns true if player is xs or sm and needs to use compact controls
   *
   * @param {string} the size of the player: `xs`,`sm`,`md`,`lg`, or `xl`
   * @returns {boolean} Should the player use compact controls?
   */
  _getCompactControls(responsiveSize) {
    return (
      this._testAttribute(responsiveSize, "xs") ||
      this._testAttribute(responsiveSize, "sm")
    );
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
    this.$.settings.close();
  }

  /**
   * determine which button was clicked and act accordingly
   */
  _onSettingsChanged(e) {
    this.dispatchEvent(
      new CustomEvent("controls-change", { detail: e.target })
    );
    this.$.settings.close();
  }

  /**
   * Determines if the transcript button should be hidden.
   *
   * @param {boolean} Is this feature available?
   * @param {boolean} Is the player too small to fit the extra controls?
   * @returns {boolean} Show the transcript button?
   */
  _hideTranscriptButton(noTranscriptToggle, compactControls) {
    return noTranscriptToggle || compactControls;
  }

  /**
   * Determines if the print transcript feature is available from the controls.
   *
   * @param {boolean} Is the player in stand-alone mode?
   * @param {boolean} Is the player in fixed-height/iframe mode?
   * @returns {boolean} Should print transcript be unavailable from controls?
   */
  _noPrinting(standAlone, fixedHeight) {
    return standAlone || !fixedHeight;
  }

  /**
   * Determines if the transcript toggle feature is available.
   *
   * @param {boolean} Is the player in stand-alone mode?
   * @param {boolean} Is the player in fixed-height/iframe mode?
   * @returns {boolean} Should transcript toggle be unavailable?
   */
  _noTranscriptToggle(standAlone, fixedHeight, hasTranscript) {
    return standAlone || fixedHeight || !hasTranscript;
  }
}
window.customElements.define(A11yMediaControls.tag, A11yMediaControls);

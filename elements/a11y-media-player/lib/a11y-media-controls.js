/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element/lit-element.js";
import { A11yMediaBehaviors } from "./a11y-media-behaviors.js";
import "@polymer/paper-menu-button/paper-menu-button.js";
import "@polymer/paper-slider/paper-slider.js";
import "@lrnwebcomponents/dropdown-select/dropdown-select.js";
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
      ...super.properties,
      /**
       * Use compact controls?
       */
      compactControls: {
        attribute: "compact-controls",
        type: Boolean
      },
      /**
       * Is the player a fixed height (iframe mode) so that theure is no transcript toggle?
       */
      fixedHeight: {
        attribute: "fixed-height",
        type: Boolean
      },
      /**
       * Is fullscreen mode?
       */
      fullscreen: {
        attribute: "fullscreen",
        type: Boolean
      },
      /**
       * show the FullscreenButton?
       */
      fullscreenButton: {
        attribute: "fullscreen-button",
        type: Boolean
      },
      /**
       * Does the player have tracks?
       */
      hasCaptions: {
        attribute: "has-captions",
        type: Boolean
      },
      /**
       * initially hide the transcript?
       */
      hideTranscript: {
        attribute: "hide-transcript",
        type: Boolean
      },
      /**
       * hide the transcript toggle menu item?
       */
      hideTranscriptButton: {
        attribute: "hide-transcript-button",
        type: Boolean
      },
      /**
       * url for deeplinking
       */
      linkUrl: {
        attribute: "link-url",
        type: String
      },
      /**
       * hide the print transcript feature available?
       */
      noPrinting: {
        attribute: "no-printing",
        type: Boolean
      },
      /**
       * Is the transctipt toggle feature available?
       */
      noTranscriptToggle: {
        attribute: "no-transcript-toggle",
        type: Boolean
      },
      /**
       * Size of the a11y media element for responsive styling
       */
      responsiveSize: {
        attribute: "responsive-size",
        type: String,
        reflect: true
      },
      /**
       * show volume slider
       */
      __volumeSlider: {
        type: Boolean
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
  //inherit styles from a11y-media-player
  constructor() {
    super();
    this.compactControls = true;
    this.fixedHeight = false;
    this.fullscreen = false;
    this.fullscreenButton = false;
    this.hasCaptions = false;
    this.hideTranscript = false;
    this.hideTranscriptButton = true;
    this.linkUrl = "test";
    this.noPrinting = true;
    this.noTranscriptToggle = true;
    this.responsiveSize = "xs";
    this.status = this._getLocal("loading", "label");
    this.tracks = [];
    this.__volumeSlider = false;
    this._addResponsiveUtility({
      element: this,
      attribute: "responsive-size",
      relativeToParent: true,
      sm: 300,
      md: 600,
      lg: 900,
      xl: 1200
    });

    import("@polymer/paper-listbox/paper-listbox.js");
    import("@polymer/paper-input/paper-input.js");
    import("@polymer/paper-item/paper-item.js");
    import("@polymer/paper-icon-button/paper-icon-button.js");
    import("@polymer/paper-toggle-button/paper-toggle-button.js");
    import("@polymer/paper-tooltip/paper-tooltip.js");
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "localization")
        this.status = this._getLocal("loading", "label");
      if (propName === "responsiveSize")
        this.compactControls = ["xs", "sm"].includes(this.responsiveSize);
      if (["muted", "volume", "localization"].includes(propName))
        this.muteUnmute = this._getMuteUnmute(this.muted, this.volume);
      if (["playing", "localization"].includes(propName))
        this.playPause = this._getPlayPause(this.playing);
      if (["noTranscriptToggle", "compactControls"].includes(propName))
        this.hideTranscriptButton =
          this.noTranscriptToggle || this.compactControls;
      if (["standAlone", "fixedHeight"].includes(propName))
        this.noPrinting = this.standAlone || !this.fixedHeight;
      if (["standAlone", "fixedHeight", "hasTranscript"].includes(propName))
        this.noTranscriptToggle =
          this.standAlone || this.fixedHeight || !this.hasTranscript;
    });
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          width: 100%;
          max-width: 100%;
          height: 44px;
          max-height: 44px;
          position: relative;
          color: var(--a11y-media-color);
          --primary-text-color: var(--a11y-media-settings-menu-color);
          --paper-menu-button-dropdown-background: var(
            --a11y-media-settings-menu-bg-color
          );
          --paper-listbox-background-color: var(
            --a11y-media-settings-menu-bg-color
          );
          --paper-listbox-color: var(--a11y-media-settings-menu-color);
          --paper-listbox: {
            padding: 0;
          }
          --paper-menu-button: {
            background-color: var(--a11y-media-settings-menu-bg-color);
            color: var(--a11y-media-settings-menu-color);
          }
          --paper-menu-button-dropdown: {
            background-color: var(--a11y-media-settings-menu-bg-color);
            color: var(--a11y-media-settings-menu-color);
            margin-top: 0 !important;
            margin-bottom: 0 !important;
          }
          --paper-item-selected: {
            color: var(--a11y-media-settings-menu-hover-color);
          }
          --paper-item-focused: {
            color: var(--a11y-media-settings-menu-hover-color);
          }
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
        paper-menu-button,
        dropdown-select {
          padding: 0;
        }
        paper-icon-button {
          background-color: var(--a11y-media-settings-menu-bg-color);
          color: var(--a11y-media-settings-menu-color);
        }
        paper-icon-button:active,
        paper-icon-button:focus,
        paper-icon-button:hover {
          background-color: var(--a11y-media-settings-menu-bg-color);
          color: var(--a11y-media-settings-menu-color);
        }
        paper-item {
          min-height: 40;
        }
        .play-status,
        paper-icon-button {
          border: none;
          position: relative;
        }
        .play-status {
          font-size: 85%;
        }
        .play-status.control-bar {
          padding: 8px 13px 8px;
        }
        :host([hide-play-status]) .play-status {
          display: none;
        }
        .setting {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        .setting-text {
          min-width: 125px;
        }
        .setting-control {
          max-width: 100px;
        }
        .setting-slider {
          width: 130px;
          margin-left: -15px;
          margin-right: -15px;
        }
        #speed {
          --paper-slider-knob-start-color: var(--a11y-media-accent-color);
          --paper-slider-knob-start-border-color: var(
            --a11y-media-accent-color
          );
          --paper-slider-knob-end-color: var(--a11y-media-accent-color);
          --paper-slider-knob-end-border-color: var(--a11y-media-accent-color);
        }
        #showvolume {
          display: inline;
          position: relative;
        }
        #volume {
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
        #volume:active,
        #volume:focus,
        #volume:hover,
        #volume.focus,
        #showvolume:active #volume,
        #showvolume:focus #volume,
        #showvolume:hover #volume {
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
          top: -35px;
          border-radius: 4px;
        }
        .sr-only {
          position: absolute;
          left: -99999;
          top: 0;
          height: 0;
          width: 0;
          overflow: hidden;
        }
        paper-tooltip:not(:defined) {
          display: none;
        }
      `
    ];
  }
  render() {
    return html`
      <div id="controls-left">
        <a11y-media-button
          action="${this.playPause.action}"
          icon="${this.playPause.icon}"
          label="${this.playPause.label}"
          @click-details="${this._handleA11yMediaButton}"
        ></a11y-media-button>
        <a11y-media-button
          action="rewind"
          icon="${this._getLocal("rewind", "icon")}"
          label="${this._getLocal("rewind", "label")}"
          ?disabled="${this.disableSeek}"
          ?hidden="${this.compactControls}"
          @click-details="${this._handleA11yMediaButton}"
        ></a11y-media-button>
        <a11y-media-button
          action="forward"
          icon="${this._getLocal("forward", "icon")}"
          label="${this._getLocal("forward", "label")}"
          ?disabled="${this.disableSeek}"
          ?hidden="${this.compactControls}"
          @click-details="${this._handleA11yMediaButton}"
        ></a11y-media-button>
        <a11y-media-button
          action="restart"
          icon="${this._getLocal("restart", "icon")}"
          label="${this._getLocal("restart", "label")}"
          ?disabled="${this.disableSeek}"
          ?hidden="${this.compactControls}"
          @click-details="${this._handleA11yMediaButton}"
        ></a11y-media-button>
        <div id="showvolume">
          <a11y-media-button
            id="mute"
            action="${this.muteUnmute.action}"
            icon="${this.muteUnmute.icon}"
            label="${this.muteUnmute.label}"
            @click-details="${this._handleA11yMediaButton}"
            @focus="${e => this.__volumeSlider === true}"
            @blur="${e => this.__volumeSlider === false}"
          ></a11y-media-button>
          <paper-slider
            id="volume"
            aria-labelledby="volume-slider-label"
            label="${this.volumeLabel}"
            min="0"
            max="100"
            pin
            step="10"
            .value="${this.muted ? 0 : this.volume}"
            ?focus="${this.__volumeSlider}"
            @change="${this._onSettingsChanged}"
          ></paper-slider>
        </div>
        <span aria-live="polite" class="play-status control-bar">
          <span id="statbar">${this.status}</span>
        </span>
      </div>
      <div id="controls-right">
        <a11y-media-button
          action="captions"
          icon="${this._getLocal("captions", "icon")}"
          label="${this._getLocal("captions", "label")}"
          ?disabled="${!this.hasCaptions}"
          ?hidden="${!this.hasCaptions}"
          ?toggle="${this.cc}"
          @click-details="${this._handleA11yMediaButton}"
        >
        </a11y-media-button>
        <a11y-media-button
          action="transcript"
          controls="transcript"
          icon="${this._getLocal("transcript", "icon")}"
          label="${this._getLocal("transcript", "label")}"
          ?disabled="${this.hideTranscriptButton}"
          ?hidden="${this.hideTranscriptButton}"
          ?toggle="${this.hideTranscript}"
          @click-details="${this._handleA11yMediaButton}"
        >
        </a11y-media-button>
        <a11y-media-button
          action="linkable"
          icon="${this._getLocal("copyLink", "icon")}"
          label="${this._getLocal("copyLink", "label")}"
          ?disabled="${!this.linkable}"
          ?hidden="${!this.linkable}"
          @click-details="${this._handleA11yMediaButton}"
        ></a11y-media-button>
        <a11y-media-button
          action="print"
          icon="${this._getLocal("print", "icon")}"
          label="${this._getLocal("print", "label")}"
          ?disabled="${this.noPrinting}"
          ?hidden="${this.noPrinting}"
          @click="${this._handlePrintClick}"
        >
        </a11y-media-button>
        <a11y-media-button
          action="download"
          icon="${this._getLocal("download", "icon")}"
          label="${this._getLocal("download", "label")}"
          ?disabled="${this.noPrinting}"
          ?hidden="${this.noPrinting}"
          @click="${this._handleDownloadClick}"
        >
        </a11y-media-button>
        <a11y-media-button
          action="fullscreen"
          step="1"
          icon="${this._getLocal("fullscreen", "icon")}"
          label="${this._getLocal("fullscreen", "label")}"
          ?hidden="${this.audioNoThumb || !this.fullscreenButton}"
          ?disabled="${!this.fullscreenButton}"
          ?toggle="${this.fullscreen}"
          @click-details="${this._handleA11yMediaButton}"
        >
        </a11y-media-button>
        <paper-menu-button
          id="settings"
          allow-outside-scroll
          horizontal-align="right"
          ignore-select
          vertical-align="bottom"
          @change="${this._onSettingsChanged}"
          @iron-activate="${this._handleSettingsActivate}"
          @iron-select="${this._handleSettingsSelect}"
        >
          <paper-icon-button
            action="settings"
            alt="${this._getLocal("settings", "label")}"
            icon="${this._getLocal("settings", "icon")}"
            slot="dropdown-trigger"
          >
          </paper-icon-button>
          <paper-listbox id="settingslist" slot="dropdown-content">
            <paper-item ?hidden="${!this.hasCaptions}">
              <div class="setting">
                <div class="setting-text">
                  ${this._getLocal("captions", "label")}
                </div>
                <div class="setting-control">
                  <dropdown-select
                    id="tracks"
                    no-label-float
                    value=""
                    ?disabled="${!this.hasCaptions}"
                    @change="${this._onSettingsChanged}"
                  >
                    <paper-item value=""
                      >${this._getLocal("captions", "off")}</paper-item
                    >
                    ${this.tracks.map(option => {
                      return html`
                        <paper-item value="${option.value}">
                          ${option.track.label || option.track.language}
                        </paper-item>
                      `;
                    })}
                  </dropdown-select>
                </div>
              </div>
            </paper-item>
            <paper-item ?hidden="${this.noTranscriptToggle}">
              <div class="setting">
                <div id="transcript-label" class="setting-text">
                  ${this._getLocal("transcript", "label")}
                </div>
                <div class="setting-control">
                  <paper-toggle-button
                    id="transcript-toggle"
                    aria-labelledby="transcript-label"
                    controls="transcript"
                    ?checked="${!this.hideTranscript}"
                    ?disabled="${this.noTranscriptToggle}"
                  >
                  </paper-toggle-button>
                </div>
              </div>
            </paper-item>
            <paper-item>
              <div class="setting">
                <div id="loop-label" class="setting-text">
                  ${this._getLocal("loop", "label")}
                </div>
                <div class="setting-control">
                  <paper-toggle-button
                    id="loop"
                    aria-labelledby="loop-label"
                    ?checked="${this.loop}"
                  ></paper-toggle-button>
                </div>
              </div>
            </paper-item>
            <paper-item>
              <div class="setting">
                <div id="speed-label" class="setting-text">
                  ${this._getLocal("speed", "label")}
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
                    tabindex="-1"
                    .value="${this.playbackRate}"
                  ></paper-slider>
                </div>
              </div>
            </paper-item>
          </paper-listbox>
        </paper-menu-button>
        <paper-tooltip for="settings">
          ${this._getLocal("settings", "label")}
        </paper-tooltip>
      </div>
    `;
  }

  /**
   * determine which button was clicked and act accordingly
   */
  _handleA11yMediaButton(e) {
    /**
     * Fires when a change is made via controls
     * @event controls-change
     */
    this.dispatchEvent(
      new CustomEvent("controls-change", { detail: e.detail })
    );
    this.shadowRoot.querySelector("#settings").close();
  }

  /**
   * determine which button was clicked and act accordingly
   */
  _onSettingsChanged(e) {
    this.dispatchEvent(
      new CustomEvent("controls-change", { detail: e.target })
    );
    this.shadowRoot.querySelector("#settings").close();
  }
}
window.customElements.define(A11yMediaControls.tag, A11yMediaControls);

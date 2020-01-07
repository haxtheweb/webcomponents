/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element/lit-element.js";
import { ifDefined } from "lit-element/node_modules/lit-html/directives/if-defined.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/responsive-utility/responsive-utility.js";
import "@lrnwebcomponents/anchor-behaviors/anchor-behaviors.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
import "@lrnwebcomponents/simple-search/simple-search.js";
import "./lib/a11y-media-state-manager.js";
import "./lib/a11y-media-button.js";
import "./lib/a11y-media-transcript-cue.js";

/**
 * `a11y-media-player`
 * an accessible video player
 *
 * @extends A11yMediaBehaviors
 * @extends SimpleColorsPolymer
 * @customElement
 * @demo ./demo/index.html video demo
 * @demo ./demo/audio.html audio demo
 * @demo ./demo/youtube.html YouTube demo
 *
 */
class A11yMediaPlayer extends SimpleColors {
  //styles function
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          width: calc(100% - 2px);
          border: 1px solid var(--simple-colors-default-theme-grey-3);
          --a11y-media-color: var(--simple-colors-default-theme-grey-11);
          --a11y-media-bg-color: var(--simple-colors-default-theme-grey-2);
          --a11y-media-hover-color: var(--simple-colors-default-theme-grey-12);
          --a11y-media-hover-bg-color: var(
            --simple-colors-default-theme-grey-2
          );
          --a11y-media-accent-color: var(
            --simple-colors-default-theme-accent-9
          );
          --a11y-media-faded-accent-color: var(
            --simple-colors-default-theme-accent-8
          );
          --paper-toast-color: var(--simple-colors-default-theme-grey-11);
          --paper-toast-background-color: var(
            --simple-colors-default-theme-grey-2
          );

          --a11y-media-settings-menu-color: var(--a11y-media-color);
          --a11y-media-settings-menu-bg-color: var(--a11y-media-bg-color);
          --a11y-media-settings-menu-hover-color: var(--a11y-media-hover-color);
          --a11y-media-settings-menu-hover-bg-color: var(
            --a11y-media-hover-bg-color
          );

          --a11y-media-button-color: var(--a11y-media-color);
          --a11y-media-button-bg-color: var(--a11y-media-bg-color);
          --a11y-media-button-hover-color: var(--a11y-media-accent-color);
          --a11y-media-button-hover-bg-color: var(--a11y-media-hover-bg-color);
          --a11y-media-button-toggle-color: var(
            --a11y-media-faded-accent-color
          );

          --paper-toggle-button-unchecked-bar-color: var(--a11y-media-color);
          --paper-toggle-button-unchecked-button-color: var(--a11y-media-color);
          --paper-toggle-button-checked-bar-color: var(
            --a11y-media-accent-color
          );
          --paper-toggle-button-checked-button-color: var(
            --a11y-media-accent-color
          );

          --paper-slider-active-color: var(--a11y-media-accent-color);
          --paper-slider-secondary-color: var(--a11y-media-faded-accent-color);
          --paper-slider-pin-color: var(--a11y-media-faded-bg-color);
          --paper-slider-pin-start-color: var(--a11y-media-faded-bg-color);
          --paper-slider-pin-end-color: var(--a11y-media-faded-bg-color);
          --paper-slider-knob-color: var(--a11y-media-accent-color);
          --paper-slider-knob-start-color: var(--a11y-media-bg-color);
          --paper-slider-knob-end-color: var(--a11y-media-bg-color);
          --paper-slider-knob-border-color: var(--a11y-media-accent-color);
          --paper-slider-knob-start-border-color: var(--a11y-media-bg-color);
          --paper-slider-knob-end-border-color: var(--a11y-media-bg-color);

          --a11y-media-transcript-color: var(
            --simple-colors-default-theme-grey-7
          );
          --a11y-media-transcript-bg-color: var(
            --simple-colors-default-theme-grey-1
          );
          --a11y-media-transcript-accent-color: var(
            --simple-colors-default-theme-accent-8
          );
          --a11y-media-transcript-faded-accent-color: var(
            --simple-colors-default-theme-accent-10
          );
          --a11y-media-transcript-cue-color: var(
            --simple-colors-fixed-theme-grey-12
          );
          --a11y-media-transcript-cue-bg-color: var(
            --simple-colors-fixed-theme-grey-1
          );
          --a11y-media-transcript-active-cue-color: var(
            --simple-colors-fixed-theme-grey-12
          );
          --a11y-media-transcript-active-cue-bg-color: var(
            --simple-colors-fixed-theme-accent-1
          );
          --a11y-media-transcript-focused-cue-color: var(
            --simple-colors-fixed-theme-grey-12
          );
          --a11y-media-transcript-focused-cue-bg-color: var(
            --simple-colors-fixed-theme-grey-2
          );
          --a11y-media-transcript-match-color: var(
            --simple-colors-fixed-theme-grey-1
          );
          --a11y-media-transcript-match-bg-color: var(
            --simple-colors-fixed-theme-accent-10
          );
          --a11y-media-transcript-match-border-color: var(
            --simple-colors-fixed-theme-accent-12
          );
        }
        :host([dark]) {
          border: 1px solid var(--simple-colors-default-theme-grey-1);
        }
        :host([dark-transcript]) {
          --a11y-media-transcript-bg-color: var(
            --simple-colors-dark-theme-grey-1
          );
          --a11y-media-transcript-cue-color: var(
            --simple-colors-dark-theme-grey-12
          );
          --a11y-media-transcript-cue-bg-color: var(
            --simple-colors-dark-theme-grey-1
          );
          --a11y-media-transcript-active-cue-color: var(
            --simple-colors-dark-theme-accent-10
          );
          --a11y-media-transcript-active-cue-bg-color: var(
            --simple-colors-dark-theme-grey-1
          );
          --a11y-media-transcript-match-color: var(
            --simple-colors-dark-theme-grey-1
          );
          --a11y-media-transcript-match-bg-color: var(
            --simple-colors-dark-theme-accent-10
          );
          --a11y-media-transcript-match-border-color: var(
            --simple-colors-dark-theme-accent-12
          );
          --a11y-media-transcript-focused-cue-color: var(
            --simple-colors-dark-theme-grey-12
          );
          --a11y-media-transcript-focused-cue-bg-color: var(
            --simple-colors-dark-theme-grey-2
          );
        }
        :host,
        #outerplayer {
          color: var(--simple-colors-default-theme-grey-12);
          background-color: var(--simple-colors-default-theme-grey-2);
        }
        :host > * {
          transition: all 0.5s;
        }
        :host,
        #outerplayer,
        #player,
        #outertranscript,
        #innertranscript {
          display: flex;
          flex-flow: column;
          align-items: stretch;
          align-content: stretch;
        }
        #captionlink:link {
          text-decoration: none;
        }
        :host([hidden]),
        *[hidden] {
          display: none !important;
        }
        #innerplayer,
        #player,
        #player > *,
        #customcc,
        #customcctxt,
        #slider,
        #controls,
        #outertranscript,
        #innertranscript {
          width: 100%;
        }
        #innertranscript > * {
          width: calc(100% - 1px);
        }
        :host > *,
        #innerplayer,
        #player,
        #player > *,
        #customcctxt {
          flex: 1 1 auto;
        }
        #controls,
        #searchbar {
          flex: 0 0 44px;
        }
        #innerplayer {
          margin: 0 auto;
          display: flex;
        }
        #player {
          height: 400px;
          position: relative;
          background-size: cover;
          background-position: center;
        }
        #player > * {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
        }
        #playbutton,
        #slider,
        #controls {
          z-index: 2;
        }
        #html5 {
          display: flex;
          align-items: center;
        }
        :host([audio-only]) #playbutton {
          opacity: 0;
        }
        #slider {
          flex: 0 0 32px;
          height: 32px;
        }
        a11y-media-youtube {
          opacity: 0;
        }
        a11y-media-youtube.progress {
          opacity: 1;
          transition: opacity 0.5s;
        }
        #customcc:not([hidden]) {
          font-size: 20px;
          transition: font-size 0.25s;
          display: flex;
        }
        #customcctxt:not(:empty) {
          align-self: flex-end;
          font-family: sans-serif;
          color: white;
          margin: 4px 10px;
          padding: 0.15em 4px;
          background-color: black;
          background-color: rgba(0, 0, 0, 0.8);
          transition: all 0.5s;
        }
        :host([audio-only]:not([thumbnail-src])) #customcctxt {
          align-self: center;
          color: var(--a11y-media-color);
          background-color: transparent;
        }
        #controls {
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
        #controls-left {
          position: absolute;
          left: 0;
          min-width: 200px;
        }
        #controls-right {
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
          display: inline-block;
          position: relative;
        }
        #volume {
          position: absolute;
          left: 30px;
          top: 0px;
          width: 0;
          height: 40px;
          overflow: hidden;
          transition: width 0.5s;
          z-index: 3;
          border-radius: 4px;
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
          top: 0px;
        }
        #printthumb {
          width: 100%;
          margin: 0;
          display: block;
          border-top: 1px solid #aaaaaa;
        }
        .media-caption:not(:empty) {
          width: calc(100% - 30px);
          padding: 5px 15px;
        }
        .media-type {
          font-style: italic;
        }
        #searchbar {
          display: flex;
          align-items: stretch;
          justify-content: space-between;
          height: 44px;
          max-height: 44px;
          min-height: 44px;
          width: 100%;
          color: var(--a11y-media-color);
          background-color: var(--a11y-media-transcript-bg-color);
          --a11y-media-button-bg-color: var(--a11y-media-transcript-bg-color);
          --a11y-media-button-hover-bg-color: var(
            --a11y-media-transcript-bg-color
          );
          --simple-search-input-text-color: var(--a11y-media-color);
          --simple-search-input-line-color: var(--a11y-media-accent-color);
          --simple-search-input-placeholder-color: var(
            --a11y-media-transcript-color
          );
          --simple-search-button-color: var(--a11y-media-accent-color);
          --simple-search-button-hover-color: var(
            --a11y-media-faded-accent-color
          );
          --simple-search-button-bg-color: var(--a11y-media-bg-color);
          --simple-search-button-border-color: var(--a11y-media-bg-color);
          --simple-search-button-hover-border-color: var(--a11y-media-bg-color);
          --simple-search-button-disabled-color: var(
            --simple-colors-default-theme-grey-5
          );
          --simple-search-button-disabled-bg-color: var(
            --simple-colors-default-theme-grey-2
          );
          --simple-search-button-disabled-border-color: var(
            --simple-colors-default-theme-grey-3
          );
          --paper-input-container-input-color: var(--a11y-media-color);
          --simple-search-padding: 0 15px;
        }
        #searching {
          flex-grow: 2;
        }
        #autoscroll {
          padding-right: 8px;
        }
        #scrolling,
        #printing {
          display: flex;
          align-items: center;
        }
        #outertranscript {
          padding: 0 1px 0 0;
        }
        #innertranscript {
          flex: 1 0 194px;
        }
        #transcript {
          flex: 1 0 150px;
          overflow-y: scroll;
          color: var(--a11y-media-transcript-cue-color);
          background-color: var(--a11y-media-transcript-cue-bg-color);
          border-left: 1px solid var(--a11y-media-transcript-bg-color);
        }
        .transcript-from-track {
          display: table;
          width: calc(100% - 30px);
          padding: 0 15px 15px;
          color: var(--a11y-media-transcript-cue-color);
          background-color: var(--a11y-media-transcript-cue-bg-color);
        }
        .transcript-from-track[hideTimestamps] {
          display: block;
        }
        .sr-only {
          position: absolute;
          left: -9999px;
          font-size: 0;
          height: 0;
          width: 0;
          overflow: hidden;
        }
        paper-menu-button:not(:defined) paper-listbox,
        paper-listbox:not(:defined),
        paper-tooltip:not(:defined),
        paper-toast:not(:defined) {
          display: none;
        }
        @media screen {
          :host([flex-layout]:not([responsive-size="xs"])) {
            flex-flow: row;
            padding: 0;
          }
          :host([flex-layout]:not([responsive-size="xs"])) #outerplayer {
            flex: 1 0 auto;
          }
          #printthumb,
          :host([height]) #outertranscript,
          :host([stand-alone]) #outertranscript,
          :host([hide-transcript]) #outertranscript {
            display: none;
          }
          :host([sticky]:not([sticky-corner="none"])) #outerplayer {
            position: fixed;
            top: 5px;
            right: 5px;
            width: 200px;
            max-width: 200px;
            z-index: 999999;
            border: 1px solid var(--a11y-media-bg-color);
            box-shadow: 1px 1px 20px 1px rgba(125, 125, 125);
            border-radius: 3.2px;
          }
          :host([dark][sticky]:not([sticky-corner="none"])) #outerplayer {
            border: 1px solid var(--a11y-media-bg-color);
          }
          :host([sticky][sticky-corner="top-left"]) #outerplayer {
            right: unset;
            left: 5px;
          }
          :host([flex-layout]:not([responsive-size="xs"])) > div {
            width: 50%;
            flex: 1 1 auto;
          }
          #innertranscript {
            position: relative;
          }
          :host([hide-transcript]) #outerplayer {
            min-width: 50%;
            max-width: 100%;
          }
          :host([hide-transcript]) #outertranscript {
            display: none;
          }
          :host(:not([no-height]):not([stacked-layout]):not([responsive-size="xs"]))
            #transcript {
            position: absolute;
            top: 44px;
            left: 0;
            right: 0;
            bottom: 0;
            overflow-y: scroll;
          }
          :host(:not([no-height]):not([stacked-layout]):not([responsive-size="xs"]))
            #innerplayer.totop {
            position: absolute;
            top: 0;
            left: 0;
            width: 200px !important;
            z-index: 9999;
          }
          :host([sticky][sticky-corner="bottom-left"]) #innerplayer {
            top: unset;
            right: unset;
            bottom: 5px;
          }
          :host([sticky][sticky-corner="bottom-right"]) #innerplayer {
            top: unset;
            bottom: 5px;
          }
          :host([sticky]:not([sticky-corner="none"]):not([no-height]):not([stacked-layout]):not([responsive-size="xs"]))
            #controls {
            display: none;
          }
          :host([responsive-size="lg"]) #customcc {
            font-size: 16px;
          }
          :host([responsive-size="md"]) #customcc,
          :host([flex-layout][responsive-size="xl"]) #customcc {
            font-size: 14px;
          }
          :host([responsive-size="sm"]) #customcc,
          :host([flex-layout][responsive-size="lg"]) #customcc {
            font-size: 12px;
          }
          :host([responsive-size="xs"]) #customcc,
          :host([flex-layout][responsive-size="md"]) #customcc,
          :host([flex-layout][responsive-size="sm"]) #customcc {
            font-size: 10px;
          }
          :host([sticky]:not([sticky-corner="none"])) #customcc {
            display: none;
          }
          .media-caption {
            color: var(--a11y-media-bg-color);
            background-color: var(--a11y-media-accent-color);
          }
          #audio-only {
            text-align: center;
            font-style: italic;
            width: 100%;
            line-height: 160%;
          }
          .print-only {
            display: none;
          }
        }

        @media print {
          :host,
          :host([dark]) {
            outline: 1px solid #aaaaaa;
            background-color: #ffffff;
          }
          .screen-only,
          #searchbar,
          #printthumb:not([src]),
          :host(:not([thumbnail-src])) #player {
            display: none;
          }
          .media-caption {
            background-color: #cccccc;
            color: #000000;
            font-size: 120%;
          }
          #transcript {
            padding: 0 15px 5px;
            color: #000;
            background-color: #ffffff;
            border-top: 1px solid #aaa;
          }
        }
      `
    ];
  }
  // render function
  render() {
    return html`
      <div class="sr-only" ?hidden="${this.mediaCaption === undefined}">
        ${this.mediaCaption}
      </div>
      <div id="outerplayer" flex-layout="${this.flexLayout}">
        <div id="innerplayer" .style="${this.innerplayerStyle}">
          <div id="player" .style="${this.playerStyle}">
            <a11y-media-play-button
              id="playbutton"
              action="${this.playing ? "pause" : "play"}"
              label="${this._getLocal(
                this.localization,
                this.playing ? "pause" : "play",
                "label"
              )}"
              @button-click="${e => this.togglePlay()}"
              ?audio-only="${this.audioOnly}"
              ?disabled="${this.audioNoThumb || !this.__duration > 0}"
            >
            </a11y-media-play-button>
            <div id="html5">
              <slot></slot>
            </div>
            <a11y-media-youtube
              id="youtube-${this.id}"
              class="${this.progress ? `progress` : ``}"
              lang="${this.mediaLang}"
              video-id="${this.youtubeId}"
              @timeupdate="${this._handleTimeUpdate}"
              ?hidden=${!this.isYoutube}
            >
            </a11y-media-youtube>
            <div
              id="customcc"
              aria-live="polite"
              class="screen-only"
              ?hidden="${!this.showCustomCaptions}"
            >
              <div id="customcctxt">
                ${Object.keys(this.captionCues).map(
                  key =>
                    html`
                      ${this.captionCues[key].text}
                    `
                )}
              </div>
            </div>
          </div>
        </div>
        <paper-slider
          id="slider"
          class="screen-only"
          label="${this._getLocal(this.localization, "seekSlider", "label")}"
          min="${this.isYoutube && this.mediaStart ? this.mediaStart : 0}"
          max="${this.duration}"
          secondary-progress="${this.buffered}"
          @mousedown="${this._handleSliderStart}"
          @mouseup="${this._handleSliderStop}"
          @keyup="${this._handleSliderStop}"
          @keydown="${this._handleSliderStart}"
          @blur="${this._handleSliderStop}"
          .value="${this.elapsed}"
          ?disabled="${this.disableSeek || this.duration === 0}"
        >
        </paper-slider>
        <div id="controls" controls="innerplayer">
          <div id="controls-left">
            <a11y-media-button
              icon="${this._getLocal(
                this.localization,
                this.playing ? "pause" : "play",
                "icon"
              )}"
              label="${this._getLocal(
                this.localization,
                this.playing ? "pause" : "play",
                "label"
              )}"
              @click="${e => this.togglePlay()}"
            ></a11y-media-button>
            <a11y-media-button
              icon="${this._getLocal(this.localization, "rewind", "icon")}"
              label="${this._getLocal(this.localization, "rewind", "label")}"
              ?disabled="${this.disableSeek}"
              ?hidden="${this.responsiveSize === "xs"}"
              @click="${e => this.rewind()}"
            ></a11y-media-button>
            <a11y-media-button
              icon="${this._getLocal(this.localization, "forward", "icon")}"
              label="${this._getLocal(this.localization, "forward", "label")}"
              ?disabled="${this.disableSeek}"
              ?hidden="${this.responsiveSize === "xs"}"
              @click="${e => this.forward()}"
            ></a11y-media-button>
            <a11y-media-button
              icon="${this._getLocal(this.localization, "restart", "icon")}"
              label="${this._getLocal(this.localization, "restart", "label")}"
              ?disabled="${this.disableSeek}"
              ?hidden="${this.responsiveSize === "xs"}"
              @click="${e => this.restart()}"
            ></a11y-media-button>
            <div
              id="showvolume"
              @focus="${e => (this.__volumeSlider = true)}"
              @blur="${e => (this.__volumeSlider = false)}"
            >
              <a11y-media-button
                id="mute"
                icon="${this._getLocal(
                  this.localization,
                  this.muted ? "unmute" : "mute",
                  "icon"
                )}"
                label="${this._getLocal(
                  this.localization,
                  this.muted ? "unmute" : "mute",
                  "label"
                )}"
                @click="${e => this.toggleMute()}"
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
                @change="${e => (this.volume = e.detail.value)}"
              ></paper-slider>
            </div>
            <span aria-live="polite" class="play-status control-bar">
              <span id="statbar">${this.status}</span>
            </span>
          </div>
          <div id="controls-right">
            <a11y-media-button
              icon="${this._getLocal(this.localization, "captions", "icon")}"
              label="${this._getLocal(this.localization, "captions", "label")}"
              ?disabled="${!this.hasCaptions}"
              ?hidden="${!this.hasCaptions}"
              ?toggle="${this.captionsTrackKey > -1}"
              @click="${e => this.toggleCC()}"
            >
            </a11y-media-button>
            <a11y-media-button
              controls="transcript"
              icon="${this._getLocal(this.localization, "transcript", "icon")}"
              label="${this._getLocal(
                this.localization,
                "transcript",
                "label"
              )}"
              ?disabled="${this.hideTranscriptButton}"
              ?hidden="${this.hideTranscriptButton}"
              ?toggle="${this.transcriptTrackKey > -1}"
              @click="${e => this.toggleTranscript()}"
            >
            </a11y-media-button>
            <a11y-media-button
              icon="${this._getLocal(this.localization, "copyLink", "icon")}"
              label="${this._getLocal(this.localization, "copyLink", "label")}"
              ?disabled="${!this.linkable}"
              ?hidden="${!this.linkable}"
              @click="${this._handleCopyLink}"
            ></a11y-media-button>
            <a11y-media-button
              step="1"
              icon="${this._getLocal(this.localization, "fullscreen", "icon")}"
              label="${this._getLocal(
                this.localization,
                "fullscreen",
                "label"
              )}"
              ?disabled="${this.fullscreenButton}"
              ?hidden="${this.audioNoThumb || !this.fullscreenButton}"
              ?toggle="${this.fullscreen}"
              @click="${e => this.toggleFullscreen()}"
            >
            </a11y-media-button>
            <paper-menu-button
              id="settings"
              allow-outside-scroll
              horizontal-align="right"
              ignore-select
              vertical-align="bottom"
              @change="${this._handleSettingsChanged}"
            >
              <paper-icon-button
                id="settings-button"
                action="settings"
                alt="${this._getLocal(this.localization, "settings", "label")}"
                icon="${this._getLocal(this.localization, "settings", "icon")}"
                slot="dropdown-trigger"
              >
              </paper-icon-button>
              <paper-tooltip for="settings-button">
                ${this._getLocal(this.localization, "settings", "label")}
              </paper-tooltip>

              <paper-listbox id="settingslist" slot="dropdown-content">
                <paper-item ?hidden="${!this.hasCaptions}">
                  <div class="setting">
                    <div class="setting-text">
                      ${this._getLocal(this.localization, "captions", "label")}
                    </div>
                    <div class="setting-control">
                      <dropdown-select
                        id="cc_tracks"
                        no-label-float
                        value="${this.captionsTrackKey}"
                        ?hidden="${!this.hasCaptions}"
                        ?disabled="${!this.hasCaptions}"
                        @value-changed="${e =>
                          this.selectCaptionByKey(e.detail.value)}}"
                      >
                        <paper-item value="-1"
                          >${this._getLocal(
                            this.localization,
                            "captions",
                            "off"
                          )}</paper-item
                        >
                        ${!this.loadedTracks
                          ? ``
                          : Object.keys(this.loadedTracks.textTracks).map(
                              key => {
                                return html`
                                  <paper-item value="${key}">
                                    ${this.loadedTracks.textTracks[key].label ||
                                      this.loadedTracks.textTracks.language}
                                  </paper-item>
                                `;
                              }
                            )}
                      </dropdown-select>
                    </div>
                  </div>
                </paper-item>
                <paper-item ?hidden="${!this.hasCaptions}">
                  <div class="setting">
                    <div class="setting-text">
                      ${this._getLocal(
                        this.localization,
                        "transcript",
                        "label"
                      )}
                    </div>
                    <div class="setting-control">
                      <dropdown-select
                        id="transcript_tracks"
                        no-label-float
                        value="${this.transcriptTrackKey}"
                        ?hidden="${!this.hasCaptions}"
                        ?disabled="${!this.hasCaptions}"
                        @value-changed="${e =>
                          this.selectTranscriptByKey(e.detail.value)}"
                      >
                        <paper-item value="-1"
                          >${this._getLocal(
                            this.localization,
                            "transcript",
                            "off"
                          )}</paper-item
                        >
                        ${!this.loadedTracks
                          ? ``
                          : Object.keys(this.loadedTracks.textTracks).map(
                              key => {
                                return html`
                                  <paper-item value="${key}">
                                    ${this.loadedTracks.textTracks[key].label ||
                                      this.loadedTracks.textTracks.language}
                                  </paper-item>
                                `;
                              }
                            )}
                      </dropdown-select>
                    </div>
                  </div>
                </paper-item>
                <paper-item ?hidden="${this.noTranscriptToggle}">
                  <div class="setting">
                    <div id="transcript-label" class="setting-text">
                      ${this._getLocal(
                        this.localization,
                        "transcript",
                        "label"
                      )}
                    </div>
                    <div class="setting-control">
                      <paper-toggle-button
                        id="transcript-toggle"
                        aria-labelledby="transcript-label"
                        controls="transcript"
                        ?checked="${!this.hideTranscript}"
                        ?disabled="${this.noTranscriptToggle}"
                        @change="${e => this.toggleTranscript()}"
                      >
                      </paper-toggle-button>
                    </div>
                  </div>
                </paper-item>
                <paper-item>
                  <div class="setting">
                    <div id="print-label" class="setting-text">
                      ${this._getLocal(this.localization, "print", "label")}
                    </div>
                    <div class="setting-control">
                      <a11y-media-button
                        aria-labelledby="print-label"
                        icon="${this._getLocal(
                          this.localization,
                          "print",
                          "icon"
                        )}"
                        ?disabled="${this.noPrinting}"
                        ?hidden="${this.noPrinting}"
                        @click="${this.print}"
                      >
                      </a11y-media-button>
                    </div>
                  </div>
                </paper-item>
                <paper-item>
                  <div class="setting">
                    <div id="download-label" class="setting-text">
                      ${this._getLocal(this.localization, "download", "label")}
                    </div>
                    <div class="setting-control">
                      <a11y-media-button
                        aria-labelledby="download-label"
                        icon="${this._getLocal(
                          this.localization,
                          "download",
                          "icon"
                        )}"
                        ?disabled="${this.noPrinting}"
                        ?hidden="${this.noPrinting}"
                        @click="${this.download}"
                      >
                      </a11y-media-button>
                    </div>
                  </div>
                </paper-item>
                <paper-item>
                  <div class="setting">
                    <div id="loop-label" class="setting-text">
                      ${this._getLocal(this.localization, "loop", "label")}
                    </div>
                    <div class="setting-control">
                      <paper-toggle-button
                        id="loop"
                        aria-labelledby="loop-label"
                        @change="${e => this.toggleLoop()}"
                        ?checked="${this.loop}"
                      ></paper-toggle-button>
                    </div>
                  </div>
                </paper-item>
                <paper-item>
                  <div class="setting">
                    <div id="speed-label" class="setting-text">
                      ${this._getLocal(this.localization, "speed", "label")}
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
                        @change="${e => this.setPlaybackRate(e.path[0].value)}"
                      ></paper-slider>
                    </div>
                  </div>
                </paper-item>
              </paper-listbox>
            </paper-menu-button>
          </div>
        </div>
        <div
          aria-hidden="true"
          class="screen-only media-caption"
          ?hidden="${!this.mediaCaption}"
        >
          ${this.mediaCaption}
        </div>
        <div class="print-only media-caption">${this.printCaption}</div>
      </div>
      <img
        id="printthumb"
        aria-hidden="true"
        src="${ifDefined(this.thumbnailSrc)}"
      />
      <div id="outertranscript" ?hidden="${this.standAlone}">
        <div id="innertranscript" ?hidden="${this.hideTranscript}">
          <div id="searchbar">
            <div id="searching">
              <simple-search
                id="simplesearch"
                controls="transcript"
                no-label-float
                next-button-icon="${this._getLocal(
                  this.localization,
                  "nextResult",
                  "icon"
                )}"
                next-button-label="${this._getLocal(
                  this.localization,
                  "nextResult",
                  "label"
                )}"
                prev-button-icon="${this._getLocal(
                  this.localization,
                  "prevResult",
                  "icon"
                )}"
                prev-button-label="${this._getLocal(
                  this.localization,
                  "prevResult",
                  "label"
                )}"
                search-input-icon="${this._getLocal(
                  this.localization,
                  "search",
                  "icon"
                )}"
                search-input-label="${this._getLocal(
                  this.localization,
                  "search",
                  "label"
                )}"
                selector=".searchable"
                ?disabled="${this.disableSearch}"
                ?hidden="${this.disableSearch}"
              >
              </simple-search>
            </div>
            <div id="scrolling">
              <a11y-media-button
                id="scroll"
                controls="transcript"
                icon="${this._getLocal(
                  this.localization,
                  "autoScroll",
                  "icon"
                )}"
                label="${this._getLocal(
                  this.localization,
                  "autoScroll",
                  "label"
                )}"
                ?toggle="${!this.disableScroll}"
                @click="${e => (this.disableScroll = !this.disableScroll)}"
              >
              </a11y-media-button>
            </div>
            <div
              id="printing"
              ?hidden="${this.disablePrintButton}"
              ?disabled="${this.disablePrintButton}"
            >
              <a11y-media-button
                id="download"
                controls="transcript"
                icon="${this._getLocal(this.localization, "download", "icon")}"
                label="${this._getLocal(
                  this.localization,
                  "download",
                  "label"
                )}"
                @click="${this.download}"
              >
              </a11y-media-button>
              <a11y-media-button
                id="print"
                controls="transcript"
                icon="${this._getLocal(this.localization, "print", "icon")}"
                label="${this._getLocal(this.localization, "print", "label")}"
                @click="${this.print}"
              >
              </a11y-media-button>
            </div>
          </div>
          <div id="transcript" aria-live="polite">
            <a id="transcript-desc" class="sr-only" href="#bottom">
              ${this._getLocal(this.localization, "transcript", "skip")}
            </a>
            ${this.transcriptCues.length > 0
              ? html`
                  <div class="transcript-from-track">
                    ${this.transcriptCues.map((cue, index) => {
                      return html`
                        <a11y-media-transcript-cue
                          controls="html5"
                          end="${this._getHHMMSS(
                            cue.endTime,
                            this.media.duration
                          )}"
                          lang="${cue.track.language}"
                          role="button"
                          start="${this._getHHMMSS(
                            cue.startTime,
                            this.media.duration
                          )}"
                          tabindex="0"
                          @click="${e => this._handleCueSeek(cue)}"
                          @active-changed="${this._setActiveCue}"
                          ?active="${cue.track.activeCues &&
                            cue.track.activeCues[0] === cue}"
                          ?disabled="${this.disableInteractive ||
                            this.disableSeek}"
                          ?hide-timestamps="${this.hideTimestamps}"
                        >
                          <span class="searchable">${cue.text}</span>
                        </a11y-media-transcript-cue>
                      `;
                    })}
                  </div>
                `
              : html`
                  <div id="loading" class="transcript-from-track">
                    ${this.status}
                  </div>
                `}
          </div>
        </div>
      </div>
      <paper-toast
        id="link"
        duration="5000"
        text="Copied to clipboard: ${this.shareLink}"
        ?disabled="${!this.linkable}"
        ?hidden="${!this.linkable}"
      >
        <a11y-media-button
          action="linkable"
          icon="${this._getLocal(this.localization, "closeLink", "icon")}"
          label="${this._getLocal(this.localization, "closeLink", "label")}"
          tooltip-position="top"
          @click="${this._handleCloseLink}"
        ></a11y-media-button>
      </paper-toast>
      <div id="bottom" class="sr-only"></div>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      /**
       * Allow this media to play concurrently with other a11y-media-players?
       * Default is to pause this a11y-media-player when other a11y-media-player starts playing.
       */

      allowConcurrent: {
        attribute: "allow-concurrent",
        type: Boolean
      },
      /**
       * Is this an audio file?
       */
      audioOnly: {
        attribute: "audio-only",
        type: Boolean,
        reflect: true
      },
      /**
       * autoplay is an option,
       * but generally not recommended for a11y
       */
      autoplay: {
        attribute: "autoplay",
        type: Boolean
      },
      /**
       * the selected track
       */
      captionsTrack: {
        attribute: "captions-track",
        type: Object
      },
      /**
       * show closed captions
       */
      cc: {
        attribute: "cc",
        type: Boolean
      },
      /**
       * show closed captions
       */
      currentTime: {
        type: Number
      },
      /**
       * crossorigin attribute for <video> and <audio> tags
       */
      crossorigin: {
        attribute: "crossorigin",
        type: String
      },
      /**
       * disable transcript print button
       */
      disablePrintButton: {
        attribute: "disable-print-button",
        type: Boolean
      },
      /**
       * disable transcript search feature
       */
      disableSearch: {
        attribute: "disable-search",
        type: Boolean
      },
      /**
       * disable autoscrolling as transcript plays
       */
      disableScroll: {
        attribute: "disable-scroll",
        type: Boolean
      },
      /**
       * disables seeking
       */
      disableSeek: {
        attribute: "disable-seek",
        type: Boolean
      },
      /**
       * Use dark theme on transcript? Default is false, even when player is dark.
       */
      darkTranscript: {
        attribute: "dark-transcript",
        type: Boolean
      },
      /**
       * disable fullscreen option
       */
      disableFullscreen: {
        attribute: "disable-fullscreen",
        type: Boolean
      },
      /**
       * disable interactive mode that makes the transcript clickable
       */
      disableInteractive: {
        attribute: "disable-interactive",
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
       * The height of the media player.
       */
      height: {
        attribute: "height",
        type: String
      },
      /**
       * Hide elapsed time?
       */
      hideElapsedTime: {
        attribute: "hide-elapsed-time",
        type: Boolean
      },
      /**
       * show cue's start and end time
       */
      hideTimestamps: {
        attribute: "hide-timestamps",
        type: Boolean
      },
      /**
       * initially hide the transcript?
       */
      hideTranscript: {
        attribute: "hide-transcript",
        type: Boolean,
        reflect: true
      },
      /**
       * initially hide the transcript?
       */
      id: {
        attribute: "id",
        type: String,
        reflect: true
      },
      /**
       * Language
       */
      lang: {
        attribute: "lang",
        type: String
      },
      /**
       * has link button
       */
      linkable: {
        attribute: "linkable",
        type: Boolean
      },
      /**
       * custom localization settings
       */
      localization: {
        attribute: "localization",
        type: Object
      },
      /**
       * Loop the video?
       */
      loop: {
        attribute: "loop",
        type: Boolean
      },
      /**
   * Dash.js manifest source?
   * /
  "manifest": {
    "attribute": "manifest",
    "type": String
  },
  /**
   * the language of the media (if different from user interface language)
   */
      mediaLang: {
        attribute: "media-lang",
        type: String
      },
      /**
       * optional title of media (shows when printed)
       */
      mediaTitle: {
        attribute: "media-title",
        type: String
      },
      /**
       * Is audio muted?
       */
      muted: {
        attribute: "muted",
        type: Boolean
      },
      /**
       * Playback rate where 1 is normal speed, 0.5 is half-speed, and 2 is double speed
       */
      playbackRate: {
        attribute: "playback-rate",
        type: Number
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
       * the search tool for the transcript
       */
      search: {
        attribute: "search",
        type: Object
      },
      /**
       * Is stand-alone player (without transcript)?
       */
      standAlone: {
        attribute: "stand-alone",
        type: Boolean,
        reflect: true
      },
      /**
       * DEPRECATED: array ouf sources
       */
      sources: {
        attribute: "sources",
        type: Array
      },
      /**
       * stacked layout instead of side-by-side?
       */
      stackedLayout: {
        attribute: "stacked-layout",
        type: Boolean
      },
      /**
       * Is the video currently sticky, i.e. it is fixed to the corner when playing but scrolled off screen?
       */
      sticky: {
        attribute: "sticky",
        type: Boolean,
        reflect: true
      },
      /**
       * When playing but scrolled off screen, to which corner does it "stick":
       * top-left, top-right, bottom-left, bottom-right, or none?
       * Default is "top-right". "None" disables stickiness.
       */
      stickyCorner: {
        attribute: "sticky-corner",
        type: String,
        reflect: true
      },
      /**
       * Source of optional thumbnail image
       */
      thumbnailSrc: {
        attribute: "thumbnail-src",
        type: String,
        reflect: true
      },
      /**
       * DEPRECATED: array of tracks.
       */
      tracks: {
        attribute: "tracks",
        type: Array
      },
      /**
       * the selected track for the transcript
       */
      transcriptTrack: {
        attribute: "transcript-track",
        type: Object
      },
      /**
       * Range is 0 to 100. Default should not be loud enough to overpower screen readers.
       */
      volume: {
        attribute: "volume",
        type: Number
      },
      /**
       * The width of the media player.
       */
      width: {
        attribute: "width",
        type: String
      },
      /**
       * the id for the video
       */
      youtubeId: {
        attribute: "youtube-id",
        type: String
      },
      /**
       * array of cues provided to readOnly `get cues`
       */
      __cues: {
        type: Array
      },
      /**
       * media captions/transcript tracks array  provided to readOnly `get loadedTracks`
       */
      __loadedTracks: {
        type: Object
      },
      /**
       * media playing status readOnly `get playing`
       */
      __playing: {
        type: Boolean
      },
      /**
       * Has screenfull loaded?
       */
      __screenfullLoaded: {
        type: Boolean
      }
    };
  }

  // simple path from a url modifier
  pathFromUrl(url) {
    return url.substring(0, url.lastIndexOf("/") + 1);
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "a11y-media-player";
  }

  constructor() {
    super();
    this.audioOnly = false;
    this.autoplay = false;
    this.allowConcurrent = false;
    this.cc = false;
    this.currentTime = 0;
    this.darkTranscript = false;
    this.disableFullscreen = false;
    this.disableInteractive = false;
    this.disablePrintButton = false;
    this.disableSearch = false;
    this.disableScroll = false;
    this.disableSeek = false;
    this.fullscreen = false;
    this.height = null;
    this.hideElapsedTime = false;
    this.hideTimestamps = false;
    this.hideTranscript = false;
    this.id = null;
    this.lang = "en";
    this.linkable = false;
    this.localization = {};
    this.loop = false;
    this.mediaTitle = "";
    this.mediaLang = "en";
    this.muted = false;
    this.preload = "metadata";
    this.playbackRate = 1;
    this.search = null;
    this.standAlone = false;
    this.responsiveSize = "xs";
    this.captionsTrack = null;
    this.transcriptTrack = null;
    this.sources = [];
    this.stackedLayout = false;
    this.sticky = false;
    this.stickyCorner = "top-right";
    this.thumbnailSrc = null;
    this.tracks = [];
    this.volume = 70;
    this.width = null;
    this.youtubeId = null;
    this.__cues = [];
    this.__captionsOption = -1;
    this.__loadedTracks = null;
    this.__playing = false;
    this.__screenfullLoaded = false;
    this.__resumePlaying = false;
    this.__transcriptOption = -1;

    window.A11yMediaStateManager.requestAvailability();
    import("./lib/a11y-media-youtube.js");
    import("@polymer/paper-slider/paper-slider.js");
    import("@polymer/iron-icons/iron-icons.js");
    import("@polymer/iron-icons/av-icons.js");
    import("@polymer/paper-toast/paper-toast.js");
    import("@polymer/paper-listbox/paper-listbox.js");
    import("@polymer/paper-input/paper-input.js");
    import("@polymer/paper-item/paper-item.js");
    import("@polymer/paper-icon-button/paper-icon-button.js");
    import("@polymer/paper-menu-button/paper-menu-button.js");
    import("@polymer/paper-toggle-button/paper-toggle-button.js");
    import("@polymer/paper-tooltip/paper-tooltip.js");
    import("@lrnwebcomponents/dropdown-select/dropdown-select.js");
    import("@lrnwebcomponents/a11y-media-player/lib/a11y-media-play-button.js");
    if (typeof screenfull === "object") this._onScreenfullLoaded.bind(this);
    const basePath = this.pathFromUrl(decodeURIComponent(import.meta.url));
    const location = `${basePath}lib/screenfull/dist/screenfull.js`;
    window.ESGlobalBridge.requestAvailability();
    window.ESGlobalBridge.instance.load("screenfullLib", location);
    window.addEventListener(
      "es-bridge-screenfullLib-loaded",
      this._onScreenfullLoaded.bind(this)
    );
  }

  /** -------------------------- CALACULATED PROPERTIES ----------------- */
  /**
   * the aspect ratio of the media, or if unknown, `16/9`
   * @readonly
   * @returns {number} media width divided by height
   */
  get aspect() {
    let aspect =
      this.media && this.media.aspectRatio ? this.media.aspectRatio : 16 / 9;
    this.width !== null ? this.width : "100%";
    this.style.maxWidth = this.width;
    return aspect;
  }

  /**
   * returns true if an attribute is set to a value
   * @readonly
   * @returns {boolean} Should height of audio/thumbnail area be set to 0?
   */
  get audioNoThumb() {
    return (
      this.audioOnly &&
      (this.thumbnailSrc === null || this.thumbnailSrc === undefined)
    );
  }

  /**
   * returns buffered media
   * @readonly
   * @returns {number} seconds of buffered media
   */
  get buffered() {
    return this.media && this.media.buffered && this.media.buffered > 0
      ? this.media.buffered
      : 0;
  }

  /**
   * gets caption cues that should be visible for custom captions
   * @readonly
   * @returns {array} array of cues
   */
  get captionCues() {
    let cues =
      this.captionsTrack && this.captionsTrack.activeCues
        ? this.captionsTrack.activeCues
        : [];
    return cues;
  }

  /**
   * `key` of selected textTrack based on `captionsTrack` and `cc` values
   */
  get captionsTrackKey() {
    return !this.cc ? -1 : this._getTrackId(this.captionsTrack);
  }

  /**
   * returns cues array
   */
  get cues() {
    return this.__cues;
  }

  /**
   * returns media duration
   * @readonly
   * @returns {number} media duration in seconds
   */
  get duration() {
    let duration =
      this.media && this.mediaEnd
        ? this.mediaEnd - this.mediaStart
        : this.media.duration && this.media.duration > 0
        ? this.media.duration
        : 0;
    return duration;
  }

  /**
   * determines if player is in flex-layout mode
   * @returns {boolean} Is the video in flex layout mode?
   */
  get flexLayout() {
    if (
      !this.standAlone &&
      !this.hideTranscript &&
      !this.audioNoThumb &&
      !this.stackedLayout
    ) {
      this.setAttribute("flex-layout", true);
      return true;
    } else {
      this.removeAttribute("flex-layout");
      return true;
    }
  }

  /**
   * whether or not the fullscreen mode is be disabled
   * @returns {boolean}
   */
  get fullscreenButton() {
    if (typeof screenfull === "object") this._onScreenfullLoaded.bind(this);
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) ||
      this.disableFullscreen ||
      this.audioNoThumb ||
      !(typeof screenfull === "object")
    ) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * whether the media has any tracks
   *
   * @readonly
   * @returns {boolean}
   */
  get hasCaptions() {
    return this.cues.length > 1;
  }

  /**
   * `style` for `#innerplayer`
   * @readonly
   * @returns {string} value for style attribute
   */
  get innerplayerStyle() {
    let maxWidth = this.fullscreen
      ? `unset`
      : `calc(${this.aspect * 100}vh - ${this.aspect * 80}px)`;
    return `max-width:${maxWidth};`;
  }

  /**
   * whether media is YouTube
   * @readonly
   * @returns {boolean}
   */
  get isYoutube() {
    return this.youtubeId ? true : false;
  }

  /**
   * HTML `audio` or `video` tag where textTracks, if any, can be found
   * @readonly
   * @returns {object} HTML tag
   */
  get loadedTracks() {
    return this.__loadedTracks;
  }

  /**
   * object that contains default localization
   *
   * @readonly
   * @returns {object} default localization object
   */
  get localizationDefaults() {
    return {
      audio: {
        label: "Audio",
        notSupported: "HTML5 video is not supported."
      },
      autoScroll: {
        label: "Scroll Transcript",
        icon: "swap-vert"
      },
      captions: {
        label: "Closed Captions",
        icon: "av:closed-caption",
        off: "Off"
      },
      download: {
        label: "Download Transcript",
        icon: "file-download"
      },
      forward: {
        label: "Forward",
        icon: "av:fast-forward"
      },
      fullscreen: {
        label: "Fullscreen",
        icon: "fullscreen"
      },
      copyLink: {
        label: "Copy Media Link",
        icon: "link"
      },
      closeLink: {
        label: "Close",
        icon: "close"
      },
      loading: {
        label: "Loading..."
      },
      loop: {
        label: "Loop Playback"
      },
      mute: {
        label: "Mute",
        icon: "av:volume-up"
      },
      nextResult: {
        label: "Next",
        icon: "arrow-forward"
      },
      pause: {
        label: "Pause",
        icon: "av:pause"
      },
      play: {
        label: "Play",
        icon: "av:play-arrow"
      },
      prevResult: {
        label: "Previous",
        icon: "arrow-back"
      },
      print: {
        label: "Print Transcript",
        icon: "print"
      },
      restart: {
        label: "Restart",
        icon: "av:replay"
      },
      rewind: {
        label: "Backward",
        icon: "av:fast-rewind"
      },
      search: {
        label: "Search the transcript.",
        icon: "search"
      },
      seekSlider: {
        label: "Seek Slider"
      },
      settings: {
        label: "Settings",
        icon: "settings"
      },
      speed: {
        label: "Speed %"
      },
      transcript: {
        label: "Transcript",
        icon: "description",
        loading: "Loading the transcript(s)...",
        off: "Off",
        skip: "Skip to the transcript."
      },
      unmute: {
        label: "Unmute",
        icon: "av:volume-off"
      },
      video: {
        label: "Video",
        notSupported: "HTML5 video is not supported."
      },
      volume: {
        label: "Volume"
      },
      youTubeLoading: {
        label: "Ready."
      },
      youTubeTranscript: {
        label: "Transcript will load once media plays."
      }
    };
  }

  /**
   * media used for playback
   * @readonly
   */
  get media() {
    return this.isYoutube ? this.youtube : this.loadedTracks;
  }

  /**
   * gets media caption
   * @readonly
   * @returns {string} the media caption
   */
  get mediaCaption() {
    let audioLabel = this._getLocal(this.localization, "audio", "label"),
      hasMediaTitle =
        this.mediaTitle !== undefined &&
        this.mediaTitle !== null &&
        this.mediaTitle !== "";
    if (this.audioOnly && hasMediaTitle) {
      return this.mediaTitle + " (" + audioLabel + ")";
    } else if (this.audioOnly) {
      return audioLabel;
    } else if (hasMediaTitle) {
      return this.mediaTitle;
    } else {
      return undefined;
    }
  }

  /**
   * gets media media time if set
   * @readonly
   * @returns {number} end time in seconds
   */
  get mediaEnd() {
    return this.mediaSeekable && this.media.seekable.end(0)
      ? this.media.seekable.end(0)
      : false;
  }

  /**
   * whether media has a seekable time range
   * @readonly
   * @returns {boolean}
   */
  get mediaSeekable() {
    return this.media && this.media.seekable
      ? this.media.seekable.length > 0
      : false;
  }

  /**
   * gets media start time
   * @readonly
   * @returns {number} start time in seconds
   */
  get mediaStart() {
    return this.mediaSeekable && this.media.seekable.start(0)
      ? this.media.seekable.start(0)
      : 0;
  }

  /**
   * whether media is currently playing
   * @readonly
   * @returns {boolean}
   */
  get playing() {
    return this.__playing;
  }

  /**
   * `style` for `#player`
   * @readonly
   * @returns {string} value for style attribute
   */
  get playerStyle() {
    let audio = this.audioOnly && !this.thumbnailSrc && !this.height,
      height = audio ? "60px" : "unset",
      paddingTop = this.fullscreen ? `unset` : `${100 / this.aspect}%`,
      thumbnail =
        this.thumbnailSrc && (this.youtubeId || this.audioOnly)
          ? this.thumbnailSrc
          : this.youtubeId
          ? `https://img.youtube.com/vi/${this.youtubeId.replace(
              /[\?&].*/
            )}/hqdefault.jpg`
          : "none";
    return `height:${height};padding-top:${paddingTop};background-image:url(${thumbnail});`;
  }

  /**
   * gets print caption
   * @readonly
   * @returns {string} the media caption when the page is printed
   */
  get printCaption() {
    let audioLabel = this._getLocal(this.localization, "audio", "label"),
      videoLabel = this._getLocal(this.localization, "video", "label"),
      hasMediaTitle =
        this.mediaTitle !== undefined &&
        this.mediaTitle !== null &&
        this.mediaTitle !== "";
    if (this.audioOnly && hasMediaTitle) {
      return this.mediaTitle + " (" + audioLabel + ")";
    } else if (this.audioOnly) {
      return audioLabel;
    } else if (hasMediaTitle) {
      return this.mediaTitle + " (" + videoLabel + ")";
    } else {
      return videoLabel;
    }
  }

  /**
   * returns the current playback progress or slider position
   * @readonly
   * @returns {number} media duration in seconds
   */
  get progress() {
    let progress =
      this.__seeking === true
        ? this.shadowRoot.querySelector("#slider").immediateValue
        : this.currentTime;
    return progress - this.mediaStart;
  }

  /**
   * gets transcript cues that should be visible
   * @readonly
   * @returns {array} array of cues
   */
  get transcriptCues() {
    let cues = this.cues.slice();
    return cues.filter(cue => cue.track === this.transcriptTrack);
  }

  /**
   * `key` of selected textTrack based on `transcriptTrack` and `hide-transcript` values
   */
  get transcriptTrackKey() {
    return this.hideTranscript ? -1 : this._getTrackId(this.transcriptTrack);
  }

  /**
   * gets the link for sharing the video at a specific timecode
   * @readonly
   * @returns {string} url for sharing the video
   */
  get shareLink() {
    let url = window.location.href.split(/[#?]/)[0],
      id = this.id ? `?id=${this.id}` : ``,
      progress =
        id !== "" && this.progress && this.progress !== 0
          ? `&t=${this.progress}`
          : ``;
    return `${url}${id}${progress}`;
  }

  /**
   * Show custom CC (for audio and YouTube)?
   * @returns {boolean} Should the player show custom CC?
   */
  get showCustomCaptions() {
    return (this.isYoutube || this.audioOnly) && this.hasCaptions && this.cc;
  }

  /**
   * gets playback status text
   *
   * @readonly
   * @returns {string} status, as either a localized loading message or progress/duration
   */
  get status() {
    return this.duration > 0
      ? html`
          ${this._getHHMMSS(this.progress, this.duration)}/${this._getHHMMSS(
            this.duration
          )}
        `
      : this.isYoutube
      ? this._getLocal(this.localization, "youTubeLoading", "label")
      : this._getLocal(this.localization, "loading", "label");
  }

  get youtube() {
    return this.shadowRoot.querySelector("a11y-media-youtube") !== null
      ? this.shadowRoot.querySelector("a11y-media-youtube")
      : false;
  }

  connectedCallback() {
    let root = this;
    super.connectedCallback();
    this.__loadedTracks = this.getloadedTracks();
    this._handleMediaLoaded();
    this.__loadedTracks.addEventListener("loadedmetadata", e =>
      root._handleMediaLoaded(e)
    );
    this.__loadedTracks.addEventListener("timeupdate", e =>
      root._handleTimeUpdate(e)
    );
    this._addResponsiveUtility();
    /**
     * Fires when a new player is ready for a11y-media-state-manager
     * @event a11y-player
     */
    window.dispatchEvent(
      new CustomEvent("a11y-player", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this
      })
    );
    this.__playerReady = true;
  }

  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    window.removeEventListener(
      "es-bridge-screenfullLib-loaded",
      this._onScreenfullLoaded.bind(this)
    );
    super.disconnectedCallback();
  }

  /**
   * @param {map} changedProperties the properties that have changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      //console.log('updated',propName,oldValue);
      if (this.media) this._updateMediaProperties(propName);
      if (propName === "id" && this.id === null)
        this.id = "a11y-media-player" + Date.now();

      /* updates captions */
      if (propName === "__captionsOption") this._captionsOptionChanged();
      if (["cc", "captionsTrack"].includes(propName)) this._captionsChanged();
      if (
        propName === "currentTime" &&
        this.currentTime !== this.media.currentTime
      )
        this.seek(this.currentTime);

      this.dispatchEvent(
        new CustomEvent(
          `${propName
            .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
            .toLowerCase()}-changed`,
          { detail: { value: this[propName] } }
        )
      );
    });
  }

  /**
   * updates track mode & `__captionsOption` when `captionsTrack` or `cc` changes
   */
  _captionsChanged() {
    let ccNum = -1;
    Object.keys(this.loadedTracks.textTracks).forEach(key => {
      let showing =
        this.cc && this.loadedTracks.textTracks[key] === this.captionsTrack;
      this.loadedTracks.textTracks[key].mode = showing ? "showing" : "hidden";
      if (showing) ccNum = key;
    });
    this.__captionsOption = ccNum;
  }

  /**
   * updates track mode & `captionsTrack` when `__captionsOption` changes
   */
  _captionsOptionChanged() {
    this.cc = this.__captionsOption > -1;
    Object.keys(this.loadedTracks.textTracks).forEach(key => {
      let showing = parseInt(key) == parseInt(this.__captionsOption);
      this.loadedTracks.textTracks[key].mode = showing ? "showing" : "hidden";
      if (showing) this.captionsTrack = this.loadedTracks.textTracks[key];
    });
  }

  /**
   * handles mute change
   */
  _handleMuteChanged() {
    this.media.muted = this.muted;
    /**
     * Fires when closed caption is toggled
     * @event mute-changed
     */
    window.dispatchEvent(
      new CustomEvent("mute-changed", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this
      })
    );
  }

  /**
   * determine which button was clicked and act accordingly
   */
  _handleSettingsChanged(e) {
    if (
      this.shadowRoot &&
      this.shadowRoot.querySelector("#settings") &&
      this.shadowRoot.querySelector("#settings").close &&
      !e.path[0].opened
    )
      this.shadowRoot.querySelector("#settings").close();
  }

  /**
   * gets download data for the active transcript
   * @param {string} the title of the media
   */
  download() {
    let a = document.createElement("a"),
      title =
        this.mediaTitle && this.mediaTitle.trim() != ""
          ? `${this.mediaTitle} (${this._getLocal(
              this.localization,
              "transcript",
              "label"
            )})`
          : this._getLocal(this.localization, "transcript", "label"),
      filename = title.replace(/[^\w\d]/g, ""),
      cues = this.transcriptTrack.cues,
      data = Object.keys(cues)
        .map(
          key =>
            `${this._getHHMMSS(cues[key].startTime)} - ${this._getHHMMSS(
              cues[key].endTime
            )}: \t${cues[key].text.replace(/[\n\r\s*]/g, " ")}\n`
        )
        .join("");
    a.setAttribute(
      "href",
      "data:text/plain;charset=UTF-8," + encodeURIComponent(title + "\n" + data)
    );
    a.setAttribute("download", filename + ".txt");
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    /**
     * Fires when transcript is downloaded
     * @event transcript-downloaded
     */
    this.dispatchEvent(
      new CustomEvent("transcript-downloaded", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this
      })
    );
  }

  /**
   * prints the active transcript
   * @param {string} the title of the media
   */
  print() {
    let cues = this.transcriptTrack.cues,
      title =
        this.mediaTitle && this.mediaTitle.trim() != ""
          ? `${this.mediaTitle} (${this._getLocal(
              this.localization,
              "transcript",
              "label"
            )})`
          : this._getLocal(this.localization, "transcript", "label"),
      print = window.open(
        "",
        "",
        "left=0,top=0,width=552,height=477,toolbar=0,scrollbars=0,status =0"
      );
    print.document.body.innerHTML = `
    <h1>${title}</h1>
    ${Object.keys(cues)
      .map(
        key =>
          `<div style="display: table-row;">
        ${
          this.hideTimestamps
            ? ``
            : `
            <span style="display: table-cell;
              font-size: 80%;
              padding: 0 16px;
              white-space: nowrap;
              font-family: monospace;">
              ${this._getHHMMSS(cues[key].startTime)} - 
              ${this._getHHMMSS(cues[key].endTime)}:
            </span>`
        }
        <span style="display: table-cell; line-height: 200%;">
          ${cues[key].text}
        </span>
      </div>`
      )
      .join("")}
    `;
    print.document.close();
    print.focus();
    print.print();
    print.close();

    /**
     * Fires when transcript is printed
     * @event transcript-printed
     */
    this.dispatchEvent(
      new CustomEvent("transcript-printed", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this
      })
    );
  }

  /**
   * plays the media
   */
  play() {
    this.__playing = true;
    if (this.media && this.media.play) this.media.play();
    /**
     * Fires when media plays
     * @event play
     */
    window.dispatchEvent(
      new CustomEvent("play", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this
      })
    );
    /**
     * DEPRECATED: Fires when media plays
     * @event a11y-player-playing
     */
    window.dispatchEvent(
      new CustomEvent("a11y-player-playing", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this
      })
    );
  }

  /**
   * pauses the media
   */
  pause() {
    this.__playing = false;
    if (this.media && this.media.pause) this.media.pause();
    /**
     * Fires when media pauses
     * @event pause
     */
    window.dispatchEvent(
      new CustomEvent("pause", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this
      })
    );
  }

  /**
   * stops the media
   */
  stop() {
    this.pause();
    this.seek(0);
    /**
     * Fires when media stops
     * @event stop
     */
    window.dispatchEvent(
      new CustomEvent("stop", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this
      })
    );
  }

  /**
   * restarts the media
   */
  restart() {
    this.seek(0);
    this.play();
    /**
     * Fires when media retarts
     * @event restart
     */
    window.dispatchEvent(
      new CustomEvent("restart", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this
      })
    );
  }

  /**
   * seeks media backward at a set increment
   * @param {float} the elepsed time, in seconds
   */
  rewind(amt) {
    amt = amt !== undefined ? amt : this.media.duration / 20;
    this.__resumePlaying = this.playing;
    this.seek(this.media.currentTime - amt, 0);
    if (this.__resumePlaying) this.play();
    this.__resumePlaying = false;
    /**
     * Fires when media moves backward
     * @event backward
     */
    window.dispatchEvent(
      new CustomEvent("backward", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this
      })
    );
  }

  /**
   * seeks media forward at a set increment
   * @param {float} the elepsed time, in seconds
   */
  forward(amt) {
    amt = amt !== undefined ? amt : this.media.duration / 20;
    this.__resumePlaying = this.playing;
    this.seek(this.media.currentTime + amt);
    if (this.__resumePlaying) this.play();
    this.__resumePlaying = false;
    /**
     * Fires when media moves forward
     * @event forward
     */
    window.dispatchEvent(
      new CustomEvent("forward", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this
      })
    );
  }

  /**
   * seeks to a specific time
   * @param {float} the time, in seconds, to seek
   */
  seek(time) {
    if (
      (this.mediaSeekable &&
        time >= this.mediaStart &&
        time <= this.mediaEnd) ||
      this.duration
    ) {
      this.media.seek(time);
      /**
       * Fires when media seeks
       * @event seek
       */
      window.dispatchEvent(
        new CustomEvent("seek", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: this
        })
      );
    }
  }

  /**
   * selects `captionsTrack` by key and adjusts `cc` accordingly
   */
  selectCaptionByKey(id) {
    id = parseInt(id);
    if (id > -1) this.captionsTrack = this.loadedTracks.textTracks[id];
    this.cc = id > -1;
  }

  /**
   * selects `transcriptTrack` by key and adjusts `hideTranscript` accordingly
   */
  selectTranscriptByKey(id) {
    id = parseInt(id);
    if (id > -1) this.transcriptTrack = this.loadedTracks.textTracks[id];
    this.hideTranscript = id < 0;
  }

  /**
   * media tag where sources and tracks can be found
   * @readonly
   */
  getloadedTracks() {
    let media = this.querySelectorAll("audio,video"),
      primary = null;
    media.forEach(medium => {
      medium.removeAttribute("autoplay");
      medium.setAttribute("preload", this.preload);
    });

    if (media.length > 0) {
      primary = media[0];
      this.audioOnly = primary.tagName === "AUDIO";
    } else {
      primary = document.createElement(
        this.querySelectorAll('source[type*="audio"]').length > 0
          ? "audio"
          : "video"
      );
      this.querySelectorAll("source,track").forEach(node => {
        if (node.parentNode === this) primary.appendChild(node);
      });
      primary.setAttribute("preload", "metadata");
      this.appendChild(primary);
    }
    primary.style.width = "100%";
    primary.style.maxWidth = "100%";

    /* handle deprecated tracks */
    this.tracks.forEach(track => {
      let node = document.createElement("track");
      Object.keys(track).forEach(key => node.setAttribute(key, track[key]));
      primary.appendChild(node);
    });

    /* handle deprecated sources */
    this.sources.forEach(source => {
      let node = document.createElement("source");
      Object.keys(source).forEach(key => node.setAttribute(key, source[key]));
      primary.appendChild(node);
    });
    /* provides a seek function for primary media */
    primary.seek = time => (primary.currentTime = time);
    return primary;
  }
  /**
   *
   *
   * @param {*} id
   * @param {*} thumb
   * @returns
   * @memberof A11yMediaPlayer
   */
  _getSrcDoc(id, thumb) {
    return !id
      ? ``
      : `<style>
        *{padding:0;margin:0;overflow:hidden}
        html,body{height:100%}
        img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}
        span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}
        </style><a href=https://www.youtube.com/embed/${id}?autoplay=1></a>`;
  }

  /**
   * selects a specific transcript track
   * @param {track} track text track
   */
  _getTrack(track) {
    if (!track) {
      let defaultTracks = this.loadedTracks.textTracks.filter(
        track => track.default === true
      );
      return defaultTracks
        ? defaultTracks[0].track
        : this.loadedTracks.textTracks[0].track;
    }
    return track;
  }

  /**
   * selects a specific track as transcript
   * @param {track} track text track
   */
  selectTranscript(track) {
    this.transcriptTrack = this._getTrack(track);
  }

  /**
   * set speed/playback rate of media
   * @param {float} the playback rate, where 1 = 100%
   */
  setPlaybackRate(value) {
    value = value !== null ? value : 1;
    this.media.playbackRate = value !== null ? value : 1;
    /**
     * Fires when video playback rate changes
     * @event playback-rate-changed
     */
    window.dispatchEvent(
      new CustomEvent("playback-rate-changed", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this
      })
    );
  }

  /**
   * set volume of media
   * @param {integer} the volume level from 0-100
   */
  setVolume(value = 7) {
    this.volume = Math.max(0, Math.min(value, 100));
    this.media.volume = value / 100;
    /**
     * Fires when video volume changes
     * @event volume-changed
     */
    window.dispatchEvent(
      new CustomEvent("volume-changed", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this
      })
    );
  }

  /**
   * toggles captions
   * @param {boolean} Toggle CC on? `true` is on, `false` is off, and `null` toggles based on current state.
   */
  toggleCC(mode) {
    this.cc = typeof mode === typeof undefined ? !this.cc : mode;

    /**
     * Fires when closed caption is toggled
     * @event cc-toggle
     */
    window.dispatchEvent(
      new CustomEvent("cc-toggle", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this
      })
    );
  }

  /**
   * toggles fullscreen
   * @param {boolean} Toggle fullscreen on? `true` is on, `false` is off, and `null` toggles based on current state.
   */
  toggleFullscreen(mode) {
    if (screenfull && this.fullscreenButton) {
      this.fullscreen = mode === undefined ? !this.loop : mode;
      this.toggleTranscript(this.fullscreen);
      screenfull.toggle(this.shadowRoot.querySelector("#outerplayer"));

      /**
       * Fires when fullscreen is toggled
       * @event fullscreen-toggle
       */
      window.dispatchEvent(
        new CustomEvent("fullscreen-toggle", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: this
        })
      );
    }
  }

  /**
   * toggles looping
   * @param {boolean} Toggle looping on? `true` is on, `false` is off, and `null` toggles based on current state.
   */
  toggleLoop(mode) {
    this.loop = mode === undefined ? !this.loop : mode;
    this.media.loop = mode === true;

    /**
     * Fires when looping is toggled
     * @event loop-toggle
     */
    window.dispatchEvent(
      new CustomEvent("loop-toggle", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this
      })
    );
  }

  /**
   * toggles play
   * @param {boolean} Toggle play/pause? `true` is on, `false` is off, and `null` toggles based on current state.
   */
  togglePlay() {
    if (this.playing) {
      this.pause();
    } else {
      this.play();
    }
    /**
     * Fires when play/pause is toggled
     * @event play-toggle
     */
    window.dispatchEvent(
      new CustomEvent("play-toggle", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this
      })
    );
  }

  /**
   * toggles mute
   * @param {boolean} Toggle mute on? `true` is on, `false` is off, and `null` toggles based on current state.
   */
  toggleMute(mode) {
    this.muted = typeof mode === typeof undefined ? !this.muted : mode;
    /**
     * Fires when mute is toggled
     * @event muted-toggle
     */
    window.dispatchEvent(
      new CustomEvent("muted-toggle", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this
      })
    );
  }

  /**
   * toggles sticky attribute
   * @param {boolean} Toggle sticky mode on? `true` is on, `false` is off, and `null` toggles based on current state.
   */
  toggleSticky(mode) {
    mode = mode === undefined ? !this.sticky : mode;
    this.sticky = mode;
    /**
     * Fires when video video's sticky behavior is toggled
     * @event player-sticky
     */
    this.dispatchEvent(
      new CustomEvent("player-sticky", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this
      })
    );
  }

  /**
   * toggles transcript
   * @param {boolean} Toggle transcript on? `true` is on, `false` is off, and `null` toggles based on current state.
   */
  toggleTranscript(mode) {
    mode = mode === undefined ? this.hideTranscript : mode;
    this.hideTranscript = !mode;
    /**
     * Fires when transcript toggles
     * @event transcript-toggle
     */
    this.dispatchEvent(
      new CustomEvent("transcript-toggle", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this
      })
    );
  }

  /**
   * loads a track's cue metadata
   */
  _addSourcesAndTracks(media) {
    media.style.width = "100%";
    media.style.maxWidth = "100%";
    this.loadedTracks.textTracks.onremovetrack = e => {
      this.loadedTracks.textTracks.filter(track => track !== e.track);
      this.__cues = this.cues.filter(cue => cue.track !== e.track);
    };
    this.loadedTracks.textTracks.onaddtrack = e => {
      if (this.captionsTrack === null) this.captionsTrack = e.track;
      e.track.mode = "hidden";
      let loadCueData = setInterval(() => {
        if (e.track.cues && e.track.cues.length > 0) {
          clearInterval(loadCueData);
          let cues = Object.keys(e.track.cues).map(key => e.track.cues[key]);
          this.__cues = this.cues.concat(cues).sort((a, b) => {
            let start = a.startTime - b.startTime,
              end = a.endTime - b.endTime;
            return start !== 0 ? start : end !== 0 ? end : a.track - b.track;
          });
        }
      });
    };

    let d = this.loadedTracks.querySelector("track[default]"),
      defaultTrack =
        Object.keys(this.loadedTracks.textTracks).find(key => {
          return (
            d.label === this.loadedTracks.textTracks[key].label &&
            d.kind === this.loadedTracks.textTracks[key].kind &&
            d.srclang === this.loadedTracks.textTracks[key].scrlang
          );
        }) || 0;
    this.captionsTrack = this.loadedTracks.textTracks[defaultTrack];
    this.transcriptTrack = this.captionsTrack;
    this._handleTimeUpdate();
  }

  /**
   * handles closing the share link toast
   */
  _handleCloseLink() {
    if (
      this.shadowRoot.querySelector("#link") &&
      this.shadowRoot.querySelector("#link").close
    )
      this.shadowRoot.querySelector("#link").close();
    if (this.__resumePlaying) this.play();
    this.__resumePlaying = false;
  }

  /**
   * handles copying the share link
   */
  _handleCopyLink() {
    let el = document.createElement("textarea");
    this.__resumePlaying = this.playing;
    this.pause;
    el.value = this.shareLink;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    this.shadowRoot.querySelector("#link").open();
  }

  /**
   * handles the seek function when a transcript cue is activated
   *
   * @param {event} e seek event
   */
  _handleCueSeek(cue) {
    if (!this.standAlone) {
      this.__resumePlaying = this.playing;
      this.seek(cue.startTime);
    }
  }

  /**
   * handles media metadata when media is loaded
   */
  _handleMediaLoaded() {
    let anchor = window.AnchorBehaviors,
      target = anchor.getTarget(this),
      params = anchor.params;
    this._handleTimeUpdate();
    /* if this video is part of the page's query string or anchor, seek the video */
    if (target === this) this.seek(this._getSeconds(params.t));
  }

  /**
   * sets search the simple-search element
   *
   * @param {event} e searchbar event
   */
  _handleSearchAdded(e) {
    this.search = e.detail;
  }

  /**
   * handles duration slider dragging with a mouse
   */
  _handleSliderStart() {
    this.__resumePlaying = this.playing;
    this.pause();
    this.__seeking = true;
  }

  /**
   * handles duration slider dragging with a mouse
   */
  _handleSliderStop() {
    this.seek(this.shadowRoot.querySelector("#slider").immediateValue);
    this.__seeking = false;
    if (this.__resumePlaying) {
      this.play();
      this.__resumePlaying = false;
    }
  }

  /**
   * handles time updates
   */
  _handleTimeUpdate() {
    //disable seeking until buffered
    //this.disableSeek = (this.youtube && this.buffered < this.duration);

    /* update current time with media's current time property */
    this.currentTime =
      this.media && this.media.currentTime && this.media.currentTime > 0
        ? this.media.currentTime
        : 0;
    /* ensure that playback does not go beyond clip stat and end boundaries */
    if (
      (this.mediaEnd && this.mediaEnd <= this.elapsed) ||
      this.mediaStart >= this.duration
    ) {
      this.stop();
      this.__playing = false;
    }
  }

  /**
   * gets `key` of given track
   *
   * @param {object} track textTrack
   * @returns {number} key
   */
  _getTrackId(track) {
    return (
      Object.keys(this.loadedTracks.textTracks).find(
        key => this.loadedTracks.textTracks[key] === track
      ) || -1
    );
  }

  /**
   * handles transcript scroll toggle
   */
  _transcriptScroll() {
    this.disableScroll = !this.disableScroll;
  }

  /**
   * determine which button was clicked and act accordingly
   */
  _onControlsChanged(e) {
    if (this.shadowRoot && this.shadowRoot.querySelector("#settings"))
      this.shadowRoot.querySelector("#settings").close();
  }

  /**
   * sets the element's __screenfullLoaded variable to true once screenfull is loaded
   * and adds an event listener for screenfull
   */
  _onScreenfullLoaded() {
    let root = this;
    this.__screenfullLoaded = true;

    // handles fullscreen
    if (screenfull) {
      screenfull.on("change", () => {
        if (screenfull.enabled) root.fullscreen = screenfull.isFullscreen;
      });
    }
  }

  /**
   * on a cue.onenter event scrolls the first active cue to position
   * @param {event} e onenter event
   */
  _setActiveCue(e) {
    let cue = e.detail.element,
      transcript = cue.parentNode,
      offset =
        transcript !== null && transcript !== undefined
          ? transcript.offsetTop
          : 0;
    if (!this.disableScroll) {
      //javascript scrolling from:  https://stackoverflow.com/questions/8917921/cross-browser-javascript-not-jquery-scroll-to-top-animation#answer-8918062
      let scrollingTo = (element, to, duration) => {
        if (duration <= 0) return;
        var difference = to - element.scrollTop;
        var perTick = (difference / duration) * 10;

        setTimeout(() => {
          element.scrollTop = element.scrollTop + perTick;
          if (element.scrollTop === to) return;
          scrollingTo(element, to, duration - 10);
        }, 10);
      };
      scrollingTo(cue.parentNode.parentNode, cue.offsetTop - offset, 250);
    }
  }

  /**
   * When relevant player properties change, updates properties of media
   * @param {string} propName the changed property
   */

  _updateMediaProperties(propName) {
    let setAttr = (attr, val = this[attr], yt = true) => {
      if (["__loadedTracks", "youtubeId", "media", attr].includes(propName)) {
        let media = yt && this.media ? this.media : this.__loadedTracks;
        if (val && this.media !== null) {
          media.setAttribute(attr, val);
        } else {
          media.removeAttribute(attr, val);
        }
      }
    };

    setAttr("cc", this.cc, false);
    setAttr("crossorigin");
    setAttr("hidden", this.isYoutube, false);
    setAttr("lang", this.mediaLang);
    setAttr("loop");
    setAttr("playbackRate");
    setAttr("poster", this.thumbnailSrc && this.isYoutube);
    if (propName === "__loadedTracks")
      this._addSourcesAndTracks(this.loadedTracks);
    if (["media", "muted"].includes(propName)) this._handleMuteChanged();
    if (["media", "volume"].includes(propName)) this.setVolume(this.volume);
    if (["media", "autoplay"].includes(propName) && this.autoplay) this.play();
  }

  /**
   * calls responsive-utility to get parent's responsive size
   *
   * @param {object} a set of responsive for options, eg: `{element: root, attribute: "responsive-size", relativeToParent: true}`
   */
  _addResponsiveUtility(options) {
    let root = this;
    window.ResponsiveUtility.requestAvailability();
    /**
     * Fires player needs the size of parent container to add responsive styling
     * @event responsive-element
     */
    window.dispatchEvent(
      new CustomEvent("responsive-element", {
        detail:
          options !== undefined
            ? options
            : {
                element: root,
                attribute: "responsive-size",
                relativeToParent: true
              }
      })
    );
  }

  /**
   * converts time in millesconds to HH:MM:SS
   *
   * @param {float} the elapsed time, in seconds
   * @param {float} the duration, in seconds
   * @returns {string} a human-readable string of elapsed time/duration in HH:MM:SS
   *
   */
  _getHHMMSS(val, max) {
    val = parseFloat(val);
    max = max === undefined ? val : parseFloat(max);
    let a = val => {
        return val < 10 ? `0${val}` : val;
      },
      b = (val, i, none) => {
        return max >= i ? a(Math.floor(val / i)) + ":" : none;
      },
      c = val => {
        return val < 100 ? val + "0" : val;
      };
    return (
      b(val, 3600, "") + b(val % 3600, 60, "00:") + a(Math.round(val % 60))
    );
  }
  /**
   * returns time in seconds of a string, such as 00:00:00.0, 0h0m0.0s, or 0hh0mm0.0ss
   * @param {string} time
   * @returns {float} seconds
   */
  _getSeconds(time = 0) {
    let units = time
        .replace(/[hm]{1,2}&?/g, ":0")
        .replace(/[s]{1,2}$/g, "")
        .split(/:/),
      hh = units.length > 2 ? parseInt(units[units.length - 3]) : 0,
      mm = units.length > 1 ? parseInt(units[units.length - 2]) : 0,
      ss = units.length > 0 ? parseFloat(units[units.length - 1]) : 0;
    return hh * 3600 + mm * 60 + ss;
  }

  /**
   * gets the localization by compaing the localization set to the defaults
   *
   * @param {object} the localization object
   * @param {string} the key to search for
   * @param {string} the subkey to search for
   * @returns {string} the default value for [key][subkey], unless localization[key][subkey] exists
   */
  _getLocal(localization, key, subkey) {
    let local = "";
    if (
      localization !== undefined &&
      localization[key] !== undefined &&
      localization[key][subkey] !== undefined
    ) {
      local = localization[key][subkey];
    } else if (
      this.localizationDefaults !== undefined &&
      this.localizationDefaults[key] !== undefined &&
      this.localizationDefaults[key][subkey] !== undefined
    ) {
      local = this.localizationDefaults[key][subkey];
    }
    return local;
  }
}
window.customElements.define(A11yMediaPlayer.tag, A11yMediaPlayer);
export { A11yMediaPlayer };

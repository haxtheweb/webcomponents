/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { A11yMediaPlayerProperties } from "./lib/a11y-media-player-properties.js";
import "@polymer/paper-slider/paper-slider.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/av-icons.js";
import "./lib/screenfull-lib.js";
import "./lib/a11y-media-controls.js";
import "./lib/a11y-media-loader.js";
import "./lib/a11y-media-play-button.js";
import "./lib/a11y-media-transcript.js";
import "./lib/a11y-media-transcript-controls.js";
import "./lib/a11y-media-utility.js";
import "./lib/a11y-media-youtube-utility.js";

export { A11yMediaPlayer };
/**
 * `a11y-media-player`
 * An accessible video player
 *
 * @microcopy - the mental model for this element
 * ```
<a11y-media-player
  accent-color$="[[accentColor]]"              // Optional accent color for controls,
                                               // using the following materialize colors:
                                               // red, pink, purple, deep-purple, indigo, blue,
                                               // light blue, cyan, teal, green, light green, lime,
                                              // yellow, amber, orange, deep-orange, and brown.
                                              // Default is null.
  audio-only$="[[audioOnly]]"                 // Is media audio only?
  autoplay$="[[autoplay]]"                    // Is player set to autoplay (not recommended for a11y)?
  cc$="[[cc]]"                                // Are closed captions toggled?
  custom-microcopy$="[[customMicrocopy]]"  // Optional customization or text and icons
  dark$="[[dark]]"  // Is the color scheme dark? Default is light.
  dark-transcript$="[[darkTranscript]]"  // Use dark theme on transcript? Default is false, even when player is dark.
  disable-fullscreen$="[[disableFullscreen]]" // Is full screen mode disabled?
  disable-interactive$="[[disableInteractive]]" // Disable interactive cues?
  fullscreen$="[[fullscreen]]"  // Is full screen mode toggled on?
  height$="[[height]]"  // The height of player
  hide-elapsed-time$="[[hideElapsedTime]]"    // Is elapsed time hidden?
  hide-timestamps$="[[hideTimestamps]]"  // Hide cue timestamps?
  lang$="[[lang]]"  // The language of the media
  loop$="[[loop]]"  // Is video on a loop?
  muted$="[[muted]]"  // Is video muted?
  media-title$="[[mediaTitle]]"  // The title of the media
  playback-rate$="[[playbackRate]]"  // The speed that video plays, default is 1 (for 100%)
  sticky-corner$="[[stickyCorner]]"  // When user scrolls a playing video off-screen,
  which corner will it stick to? Values are:
  top-right (default), top-left, bottom-left, bottom-right,
  and none (to turn sticky off)
  thumbnail-src$="[[thumbnailSrc]]"  // Optional thumbanil/cover image url
  volume$="[[volume]]">  // The initial volume of the video

  <!--video sources and tracks-->
  <source src="/path/to/video.mp4" type="video/mp4">
  <source src="/path/to/video.webm" type="video/webm">
  <track label="English" kind="subtitles" srclang="en" src="path/to/subtitles/en.vtt" default>
  <track label="Deutsch" kind="subtitles" srclang="de" src="path/to/subtitles/de.vtt">
  <track label="Español" kind="subtitles" srclang="es" src="path/to/subtitles/es.vtt">

</a11y-media-player>```
 *
 * Intermediate customization of player:
 * ```
--a11y-media-text-color: text color, default is --simple-colors-default-theme-grey-11
--a11y-media-bg-color: background color, default is --simple-colors-default-theme-grey-2
--a11y-media-hover-color: text color on hover, default is --simple-colors-default-theme-grey-12
--a11y-media-hover-bg-color: background color, default is --simple-colors-default-theme-grey-2
--a11y-media-accent-color: an accent color, default is --simple-colors-default-theme-accent-9
--a11y-media-faded-accent-color: a subtler version of accent color, default is --simple-colors-default-theme-accent-8
--a11y-media-outline-color: border-color of group, default is --a11y-media-bg-color```
 *
 * Intermediate customization of transcript:
 * ```
 --a11y-media-transcript-color: transcript color, default is --simple-colors-default-theme-grey-12
--a11y-media-transcript-bg-color: transcript background color, default is --simple-colors-default-theme-grey-1
--a11y-media-transcript-active-cue-color: transcript active cue color, default is --simple-colors-default-theme-grey-12
--a11y-media-transcript-active-cue-bg-color: transcript active cue background color, default is --simple-colors-default-theme-grey-1
--a11y-media-transcript-focused-cue-color: transcript focused cue color, default is --simple-colors-default-theme-grey-12
--a11y-media-transcript-focused-cue-br-color: transcript focused cue background color, default is --simple-colors-default-theme-accent-1
--a11y-media-transcript-match-color: transcript match color, default is --simple-colors-default-theme-accent-1
--a11y-media-transcript-match-bg-color: transcript match background color, default is --simple-colors-default-theme-grey-12```
 *
 * Advanced styles for settings menu:
 * ```
--a11y-media-settings-menu-color: settings menu text color, default is --a11y-media-text-color
--a11y-media-settings-menu-bg-color: settings menu background color, default is --a11y-media-bg-color
--a11y-media-settings-menu-hover-color: settings menu text color on hover, default is --a11y-media-hover-color
--a11y-media-settings-menu-hover-bg-color: settings menu background color on hover, default is --a11y-media-hover-bg-color```
 *
 * Advanced styles for buttons:
 * ```
--a11y-media-button-color: button text color, default is --a11y-media-text-color
--a11y-media-button-bg-color: button background color, default is --a11y-media-bg-color
--a11y-media-button-hover-color: button text color when focused/hovered, default is --a11y-media-hover-color
--a11y-media-button-hover-bg-color: button background color when focused/hovered, default is --a11y-media-bg-color
--a11y-media-button-toggle-color: button text color when tggled on, default is --a11y-media-faded-accent-color```
 *
 * Advanced styles for toggles:
 * ```
--paper-toggle-button-unchecked-bar-color: color of toggle button when off, default is --a11y-media-color
--paper-toggle-button-unchecked-button-color: color of toggle button when off, default is --a11y-media-color
--paper-toggle-button-checked-bar-color: color of toggle button when on, default is --a11y-media-accent-color
--paper-toggle-button-checked-button-color: color of toggle button when on, default is --a11y-media-accent-color```
 *
 * Advanced styles for sliders:
 * ```
--a11y-media-slider-primary-color: primary slider color, default is --a11y-media-accent-color
--a11y-media-slider-secondary-color: slider buffer color, default is --a11y-media-faded-accent-color
--a11y-media-slider-pin-color: color of the pin that shows slider value, default is --a11y-media-faded-bg-color
--a11y-media-slider-pin-start-color: color of the pin at start default is --a11y-media-faded-bg-color
--a11y-media-slider-pin-end-color: color of the pin at end, default is --a11y-media-faded-bg-color
--a11y-media-slider-knob-color: slider knob color, default is --a11y-media-accent-color
--a11y-media-slider-knob-start-color: slider knob color at start, default is --a11y-media-accent-color
--a11y-media-slider-knob-end-color: slider knob color at end, default is --a11y-media-accent-color
--a11y-media-slider-knob-border-color: slider knob bordercolor, default is --a11y-media-accent-color
--a11y-media-slider-knob-start-border-color: slider knob border color at start, default is --a11y-media-accent-color
--a11y-media-slider-knob-end-border-color: slider knob border color at end, default is --a11y-media-accent-color```
 *
 * @extends A11yMediaPlayerProperties
 * @polymer
 * @customElement
 * @demo demo/index.html video demo
 * @demo demo/audio.html audio demo
 * @demo demo/youtube.html YouTube demo
 *
 */
class A11yMediaPlayer extends A11yMediaPlayerProperties {
  // render function
  static get template() {
    return html`
      <style>
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
            --simple-colors-light-theme-grey-12
          );
          --a11y-media-transcript-cue-bg-color: var(
            --simple-colors-light-theme-grey-1
          );
          --a11y-media-transcript-active-cue-color: var(
            --simple-colors-light-theme-grey-12
          );
          --a11y-media-transcript-active-cue-bg-color: var(
            --simple-colors-light-theme-accent-1
          );
          --a11y-media-transcript-focused-cue-color: var(
            --simple-colors-light-theme-grey-12
          );
          --a11y-media-transcript-focused-cue-bg-color: var(
            --simple-colors-light-theme-grey-2
          );
          --a11y-media-transcript-match-color: var(
            --simple-colors-light-theme-grey-1
          );
          --a11y-media-transcript-match-bg-color: var(
            --simple-colors-light-theme-accent-10
          );
          --a11y-media-transcript-match-border-color: var(
            --simple-colors-light-theme-accent-12
          );
        }
        :host([dark]) {
          outline: 1px solid var(--simple-colors-default-theme-grey-1);
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
        :host #outerplayer {
          color: var(--simple-colors-default-theme-grey-12);
          background-color: var(--simple-colors-default-theme-grey-2);
        }
        :host > * {
          flex: 1 1 auto;
          transition: all 0.5s;
        }
        :host,
        :host #outerplayer,
        :host #sources {
          display: flex;
          flex-flow: column;
          align-items: stretch;
          align-content: stretch;
        }
        :host #player {
          margin: 0 auto;
        }
        :host #player,
        :host #sources,
        :host #slider,
        :host #controls {
          width: 100%;
        }
        :host #sources {
          flex: 1 1 auto;
          position: relative;
        }
        :host #sources > * {
          position: absolute;
          top: 0;
          left: 0;
          flex: 1 1 auto;
          width: 100%;
          height: 100%;
          max-height: calc(100vh - 100px);
        }
        :host #playbutton {
          z-index: 2;
        }
        :host([audio-only]) #playbutton {
          opacity: 0;
        }
        :host #slider {
          flex: 0 0 32px;
          height: 32px;
          z-index: 1000;
        }
        :host #controls {
          flex: 0 0 44px;
          z-index: 2 !important;
        }

        :host #youtube {
          opacity: 0;
        }
        :host #youtube[elapsed] {
          opacity: 1;
          transition: opacity 0.5s;
        }
        :host #customcc:not([hidden]) {
          font-size: 20px;
          width: 100%;
          height: 100%;
          transition: font-size 0.25s;
          display: flex;
        }
        :host #customcctxt:not(:empty) {
          width: 100%;
          flex: 1 1 auto;
          align-self: flex-end;
          font-family: sans-serif;
          color: white;
          margin: 4px 10px;
          padding: 0.15em 4px;
          transition: all 0.5s;
          background-color: black;
          background-color: rgba(0, 0, 0, 0.8);
        }
        :host([audio-only]:not([thumbnail-src])) #customcctxt {
          align-self: center;
          color: var(--a11y-media-color);
          background-color: transparent;
        }
        :host #printthumb {
          width: 100%;
          margin: 0;
          display: block;
          border-top: 1px solid #aaaaaa;
        }
        :host .sr-only {
          position: absolute;
          left: -9999px;
          font-size: 0;
          height: 0;
          width: 0;
          overflow: hidden;
        }
        :host .media-caption:not(:empty) {
          width: calc(100% - 30px);
          padding: 5px 15px;
        }
        :host .media-type {
          font-style: italic;
        }
        @media screen {
          :host([flex-layout]:not([responsive-size*="s"])) {
            flex-flow: row;
            padding: 0;
          }
          :host #printthumb {
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
          :host([flex-layout]:not([responsive-size*="s"])) > div {
            width: 50%;
            flex: 1 1 auto;
          }
          :host #innertranscript {
            position: relative;
            height: 100%;
          }
          :host([hide-transcript]) #outerplayer {
            min-width: 50%;
            max-width: 100%;
          }
          :host([hide-transcript]) #outertranscript {
            display: none;
          }
          :host(:not([no-height]):not([stacked-layout]):not([responsive-size*="s"]))
            #transcript {
            position: absolute;
            top: 44px;
            left: 0;
            right: 0;
            bottom: 0;
            overflow-y: scroll;
          }
          :host(:not([no-height]):not([stacked-layout]):not([responsive-size*="s"]))
            #player.totop {
            position: absolute;
            top: 0;
            left: 0;
            width: 200px !important;
            z-index: 9999;
          }
          :host([sticky][sticky-corner="bottom-left"]) #player {
            top: unset;
            right: unset;
            bottom: 5px;
          }
          :host([sticky][sticky-corner="bottom-right"]) #player {
            top: unset;
            bottom: 5px;
          }
          :host([sticky]:not([sticky-corner="none"]):not([no-height]):not([stacked-layout]):not([responsive-size*="s"]))
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
          :host .media-caption {
            color: var(--a11y-media-bg-color);
            background-color: var(--a11y-media-accent-color);
          }
          :host #audio-only {
            text-align: center;
            font-style: italic;
            width: 100%;
            line-height: 160%;
          }
          :host .print-only {
            display: none;
          }
        }

        @media print {
          :host,
          :host([dark]) {
            outline: 1px solid #aaaaaa;
            background-color: #ffffff;
          }
          :host .screen-only,
          :host #printthumb:not([src]),
          :host(:not([thumbnail-src])) #sources {
            display: none;
          }
          :host #searchbar {
            display: none;
          }
          :host .media-caption {
            background-color: #cccccc;
            color: #000000;
            font-size: 120%;
          }
        }
      </style>
      <style is="custom-style" include="simple-colors"></style>

      <div class="sr-only">[[mediaCaption]]</div>
      <div id="outerplayer" lang$="[[uiLanguage]]">
        <div id="player">
          <div
            id="sources"
            style$="[[_getThumbnailCSS(thumbnailSrc,isYoutube,audioOnly)]]"
          >
            <a11y-media-play-button
              id="playbutton"
              audio-only$="[[audioOnly]]"
              disabled="true"
              elapsed$="[[_hidePlayButton(thumbnailSrc, isYoutube, __elapsed)]]"
              hidden$="[[noHeight]]"
              disabled$="[[noHeight]]"
              on-controls-change="_onControlsChanged"
              pause-label$="[[pauseLabel]]"
              play-label$="[[playLabel]]"
            >
            </a11y-media-play-button>
            <a11y-media-loader
              id="loader"
              audio-only$="[[audioOnly]]"
              autoplay$="[[autoplay]]"
              cc$="[[cc]]"
              crossorigin$="[[crossorigin]]"
              hidden$="[[isYoutube]]"
              lang$="[[lang]]"
              loop$="[[loop]]"
              muted$="[[muted]]"
              manifest$="[[manifest]]"
              on-media-loaded="_handleMediaLoaded"
              playing$="[[__playing]]"
              playback-rate$="[[playbackRate]]"
              thumbnail-src$="[[thumbnailSrc]]"
              preload$="[[preload]]"
              volume$="[[volume]]"
            >
              <slot></slot>
            </a11y-media-loader>
            <div
              id="youtube"
              elapsed$="[[__elapsed]]"
              video-id$="[[videoId]]"
            ></div>
            <div
              id="customcc"
              class="screen-only"
              hidden$="[[!showCustomCaptions]]"
            >
              <div id="customcctxt"></div>
            </div>
          </div>
        </div>
        <paper-slider
          id="slider"
          class="screen-only"
          max$="[[__duration]]"
          on-dragging-changed="_handleSliderDragging"
          on-focused-changed="_handleSliderKeyboard"
          pin=""
          secondary-progress$="[[__buffered]]"
          value$="[[__elapsed]]"
        >
        </paper-slider>
        <a11y-media-controls
          id="controls"
          audio-only$="[[audioOnly]]"
          audio-label$="[[audioLabel]]"
          captions-icon$="[[captionsIcon]]"
          captions-label$="[[captionsLabel]]"
          captions-menu-label$="[[captionsMenuLabel]]"
          captions-menu-off$="[[captionsMenuOff]]"
          cc$="[[cc]]"
          forward-icon$="[[forwardIcon]]"
          forward-label$="[[forwardLabel]]"
          fullscreen-icon$="[[fullscreenIcon]]"
          fullscreen-label$="[[fullscreenLabel]]"
          has-captions$="[[hasCaptions]]"
          has-transcript$="[[hasTranscript]]"
          lang$="[[uiLanguage]]"
          loop-icon$="[[loopIcon]]"
          loop-label$="[[loopLabel]]"
          mute-icon$="[[muteIcon]]"
          mute-label$="[[muteLabel]]"
          muted$="[[muted]]"
          on-controls-change="_onControlsChanged"
          pause-icon$="[[pauseIcon]]"
          pause-label$="[[pauseLabel]]"
          play-icon$="[[playIcon]]"
          play-label$="[[playLabel]]"
          playing$="[[__playing]]"
          restart-icon$="[[restartIcon]]"
          restart-label$="[[restartLabel]]"
          rewind-icon$="[[rewindIcon]]"
          rewind-label$="[[rewindLabel]]"
          search-transcript$="[[searchTranscript]]"
          settings-icon$="[[settingsIcon]]"
          settings-label$="[[settingsLabel]]"
          speed-label$="[[speedLabel]]"
          stand-alone$="[[standAlone]]"
          transcript-icon$="[[transcriptIcon]]"
          transcript-label$="[[transcriptLabel]]"
          transcript-menu-label$="[[transcriptMenuLabel]]"
          unmute-icon$="[[unmuteIcon]]"
          unmute-label$="[[unmuteLabel]]"
          video-label$="[[videoLabel]]"
          volume="[[__volume]]"
          volume-icon$="[[volumeIcon]]"
          volume-label$="[[volumeLabel]]"
        >
        </a11y-media-controls>
        <div
          class="screen-only media-caption"
          aria-hidden="true"
          hidden$="[[!_hasAttribute(mediaCaption)]]"
        >
          [[mediaCaption]]
        </div>
        <div class="print-only media-caption">[[printCaption]]</div>
      </div>
      <img id="printthumb" aria-hidden="true" src$="[[thumbnailSrc]]" />
      <div id="outertranscript" hidden$="[[standAlone]]" lang$="[[uiLanguage]]">
        <div id="innertranscript">
          <a11y-media-transcript-controls
            id="tcontrols"
            accent-color$="[[accentColor]]"
            auto-scroll-icon$="[[autoScrollIcon]]"
            auto-scroll-label$="[[autoScrollLabel]]"
            dark$="[[darkTranscript]]"
            disable-print-button$="[[disablePrintButton]]"
            disable-scroll$="[[disableScroll]]"
            disable-search$="[[disableSearch]]"
            lang$="[[uiLanguage]]"
            on-searchbar-added="_handleSearchAdded"
            on-toggle-scroll="_handleTranscriptScrollToggle"
            on-print-transcript="_handlePrinting"
            print-icon$="[[printIcon]]"
            print-label$="[[printLabel]]"
            stand-alone$="[[standAlone]]"
            search-label$="[[searchLabel]]"
            search-prev-label$="[[searchPrevLabel]]"
            search-prev-icon$="[[searchPrevIcon]]"
            search-next-label$="[[searchNextLabel]]"
            search-next-icon$="[[searchNextIcon]]"
            skip-transcript-link$="[[skipTranscriptLink]]"
          >
          </a11y-media-transcript-controls>
          <a11y-media-transcript
            id="transcript"
            accent-color$="[[accentColor]]"
            dark$="[[darkTranscript]]"
            disable-scroll$="[[disableScroll]]"
            disable-search$="[[disableSearch]]"
            disable-interactive$="[[disableInteractive]]"
            hide-timestamps$="[[hideTimestamps]]"
            on-cue-seek="_handleCueSeek"
            search="[[search]]"
          >
          </a11y-media-transcript>
        </div>
      </div>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * The default media caption if none is given.
       */
      mediaCaption: {
        type: "String",
        computed: "_getMediaCaption(audioOnly,audioLabel,mediaTitle)"
      },
      /**
       * The media caption that displays when the page is printed.
       */
      printCaption: {
        type: "String",
        computed: "_getPrintCaption(audioOnly,audioLabel,videoLabel,mediaTitle)"
      },
      /**
       * is YouTube?
       */
      showCustomCaptions: {
        type: "Boolean",
        computed: "_showCustomCaptions(isYoutube,audioOnly,hasCaptions,cc)"
      },
      /**
       * Optional array ouf sources.
       */
      sources: {
        type: "Array",
        value: []
      },
      /**
       * Is the video currently sticky, i.e. it is fixed to the corner when playing but scrolled off screen?
       */
      sticky: {
        type: "Boolean",
        value: false,
        reflectToAttribute: true
      },
      /**
       * When playing but scrolled off screen, to which corner does it "stick":
       * top-left, top-right, bottom-left, bottom-right, or none?
       * Default is "top-right". "None" disables stickiness.
       */
      stickyCorner: {
        type: "String",
        value: "top-right",
        reflectToAttribute: true
      },
      /**
       * Optional array ouf tracks.
       */
      tracks: {
        type: "Array",
        value: []
      },
      /**
       * Notice if the video is playing
       */
      __playing: {
        type: "Boolean",
        value: false,
        notify: true,
        reflectToAttribute: true
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "a11y-media-player";
  }

  //get player-specific behaviors
  static get behaviors() {
    return [A11yMediaPlayerProperties];
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    let root = this;
    root.__playerAttached = true;
    window.A11yMediaUtility.requestAvailability();
    root._addResponsiveUtility();
    window.dispatchEvent(new CustomEvent("a11y-player", { detail: root }));
    if (root.isYoutube) {
      window.A11yMediaYoutubeUtility.requestAvailability();
      root._youTubeRequest();
    }
  }

  /**
   * sets initial values and loads video or youtube iframe
   */
  ready() {
    super.ready();
    let root = this,
      aspect = 16 / 9,
      tracks = new Array();
    root.__playerReady = true;
    root.__interactive = !root.disableInteractive;
    root.target = root.shadowRoot.querySelector("#transcript");
    root.__status = root.loadingLabel;
    root.__slider = root.$.slider;
    root.__volume = root.muted ? 0 : Math.max(this.volume, 10);
    root.__resumePlaying = false;
    root.__showFullscreen = !this.disableFullscreen && screenfull.enabled;
    root.__duration = 0;
    root.$.controls.setStatus(root.__status);
    root.width = root.width !== null ? root.width : "100%";
    root.style.maxWidth = root.width !== null ? root.width : "100%";
    root._setPlayerHeight(aspect);
    root.querySelectorAll("source,track").forEach(function(node) {
      root.$.loader.media.appendChild(node);
    });
    this._appendToPlayer(this.sources, "source");
    this._appendToPlayer(this.tracks, "track");
    if (this.isYoutube) {
      root.disableInteractive = true;
      this._youTubeRequest();
    } else {
      root.media = root.$.loader;
    }
    root.$.transcript.setMedia(root.$.player);

    // handles fullscreen
    if (root.__showFullscreen) {
      screenfull.on("change", () => {
        this.fullscreen = screenfull.isFullscreen;
      });
    }
  }

  /**
   * plays the media
   */
  play(e) {
    let root = this;
    root.__playing = true;
    if (e === undefined || e.detail === root.$.playbutton) {
      // while playing, update the slider and length
      root.__playProgress = setInterval(() => {
        root.__elapsed =
          root.media.getCurrentTime() > 0 ? root.media.getCurrentTime() : 0;
        root.__duration = root.media.duration > 0 ? root.media.duration : 0;
        root._updateCustomTracks();
        root.__status =
          root._getHHMMSS(root.media.getCurrentTime(), root.__duration) +
          "/" +
          root._getHHMMSS(root.__duration);
        root.$.controls.setStatus(root.__status);
        // if the video reaches the end and is not set to loop, stop
        if (root.__elapsed === root.__duration && !root.loop) {
          root.__playing = false;
          clearInterval(root.__playProgress);
        }

        //updated buffered section of the slider
        root.__buffered = root.media.getBufferedTime;
      }, 1);
      window.dispatchEvent(
        new CustomEvent("a11y-player-playing", { detail: root })
      );
      root.media.play();
    }
  }

  /**
   * pauses the media
   */
  pause() {
    let root = this;
    root.__playing = false;
    root.media.pause();

    //stop updating the slider and length
    clearInterval(root.__playProgress);
  }

  /**
   * stops the media
   */
  stop() {
    this.pause();
    this.seek(0);
  }

  /**
   * restarts the media
   */
  restart() {
    this.seek(0);
    this.play();
  }

  /**
   * seeks media backward at a set increment
   *
   * @param {float} the elepsed time, in seconds
   */
  rewind(amt) {
    amt = amt !== undefined ? amt : 1;
    this.seek(Math.max(this.media.getCurrentTime() - amt, 0));
  }

  /**
   * seeks media forward at a set increment
   *
   * @param {float} the elepsed time, in seconds
   */
  forward(amt) {
    amt = amt !== undefined ? amt : 1;
    this.seek(Math.min(this.media.getCurrentTime() + amt, this.__duration));
  }

  /**
   * seeks to a specific time
   *
   * @param {float} the time, in seconds, to seek
   */
  seek(time) {
    let seekable =
      this.media !== undefined && this.media !== null
        ? this.media.seekable
        : [];
    if (
      seekable.length > 0 &&
      time >= seekable.start(0) &&
      time <= seekable.end(0)
    ) {
      this.media.seek(time);
      this.__elapsed = time;
      this.__status =
        this._getHHMMSS(this.media.getCurrentTime(), this.__duration) +
        "/" +
        this._getHHMMSS(this.__duration);
      this.$.controls.setStatus(this.__status);
      this._updateCustomTracks();
      if (this.__resumePlaying) this.play();
    }
  }

  /**
   * selects a specific track by index
   *
   * @param {integer} the index of the track
   */
  selectTrack(index) {
    this.$.loader.selectTrack(index);
    this.$.transcript.setActiveTranscript(index);
  }

  /**
   * set volume of media
   *
   * @param {integer} the volume level from 0-100
   */
  setVolume(value) {
    this.volume = value !== null ? value : 70;
    this.media.setVolume(this.volume);
    this.muted = this.volume === 0;
  }

  /**
   * set speed/playback rate of media
   *
   * @param {float} the playback rate, where 1 = 100%
   */
  setPlaybackRate(value) {
    value = value !== null ? value : 1;
    this.media.setPlaybackRate(value);
  }

  /**
   * toggles captions
   *
   * @param {boolean} Toggle CC on? `true` is on, `false` is off, and `null` toggles based on current state.
   */
  toggleCC(mode) {
    this.cc = mode === undefined ? !this.cc : mode;
    this.$.loader.setCC(this.cc);
  }

  /**
   * toggles looping
   *
   * @param {boolean} Toggle looping on? `true` is on, `false` is off, and `null` toggles based on current state.
   */
  toggleLoop(mode) {
    if (this.isYoutube) {
    } else {
      this.loop = mode === undefined ? !this.loop : mode;
      this.media.setLoop(this.loop);
    }
  }

  /**
   * toggles mute
   *
   * @param {boolean} Toggle mute on? `true` is on, `false` is off, and `null` toggles based on current state.
   */
  toggleMute(mode) {
    this.muted = mode === undefined ? !this.muted : mode;
    this.__volume = this.muted ? 0 : Math.max(this.volume, 10);
    this.media.setMute(this.muted);
  }

  /**
   * toggles sticky attribute
   *
   * @param {boolean} Toggle sticky mode on? `true` is on, `false` is off, and `null` toggles based on current state.
   */
  toggleSticky(mode) {
    mode = mode === undefined ? !this.sticky : mode;
    this.sticky = mode;
    this.dispatchEvent(new CustomEvent("player-sticky", { detail: this }));
  }

  /**
   * toggles transcript
   *
   * @param {boolean} Toggle transcript on? `true` is on, `false` is off, and `null` toggles based on current state.
   */
  toggleTranscript(mode) {
    mode = mode === undefined ? this.hideTranscript : mode;
    this.hideTranscript = !mode;
    if (this.$.transcript !== undefined && this.$.transcript !== null) {
      this.dispatchEvent(
        new CustomEvent("transcript-toggle", { detail: this })
      );
      this.$.transcript.toggleHidden(this.hideTranscript);
    }
  }

  /**
   * dynamically adds source and track data
   * from the sources and tracks properties
   * (needed for media-player)
   */
  _appendToPlayer(data, type) {
    let root = this;
    if (data !== undefined && data !== null && data.length > 0) {
      data.forEach(item => {
        let el = document.createElement(type);
        for (let key in item) {
          el.setAttribute(key, item[key]);
        }
        root.$.loader.media.appendChild(el);
      });
    }
  }

  /**
   * sets the height of the player
   * @param {Number} the aspect ratio of the media or its poster thumbnail
   */
  _setPlayerHeight(aspect) {
    let root = this;
    if (root.audioOnly && root.thumbnailSrc === null && root.height === null) {
      root.$.sources.style.height = "60px";
    } else if (root.height === null) {
      root.$.sources.style.paddingTop = 100 / aspect + "%";
      root.$.player.style.maxWidth =
        "calc(" + aspect * 100 + "vh - " + aspect * 80 + "px)";
    } else {
      root.$.outerplayer.style.height = root.height;
    }
  }

  /**
   * gets media caption
   *
   * @param {boolean} Is the player set to audio-only?
   * @param {string} the text that indicates this player is audio-only
   * @param {string} the title of the media
   * @returns {string} the media caption
   */
  _getMediaCaption(audioOnly, audioLabel, mediaTitle) {
    let hasMediaTitle =
      mediaTitle !== undefined && mediaTitle !== null && mediaTitle !== "";
    if (audioOnly && hasMediaTitle) {
      return mediaTitle + " (" + audioLabel + ")";
    } else if (audioOnly) {
      return audioLabel;
    } else if (hasMediaTitle) {
      return mediaTitle;
    } else {
      return null;
    }
  }

  /**
   * gets print caption
   *
   * @param {boolean} Is the player set to audio-only?
   * @param {string} the text that indicates this player is audio-only
   * @param {string} the text that indicates this player is for video
   * @param {string} the title of the media
   * @returns {string} the media caption when the page is printed
   */
  _getPrintCaption(audioOnly, audioLabel, videoLabel, mediaTitle) {
    let hasMediaTitle =
      mediaTitle !== undefined && mediaTitle !== null && mediaTitle !== "";
    if (audioOnly && hasMediaTitle) {
      return mediaTitle + " (" + audioLabel + ")";
    } else if (audioOnly) {
      return audioLabel;
    } else if (hasMediaTitle) {
      return mediaTitle + " (" + videoLabel + ")";
    } else {
      return videoLabel;
    }
  }

  /**
   * get thumbanail css based on whether or not the video is playing
   *
   * @param {string} the url for the thumbnail image
   * @returns {string} the string for the style attribute
   */
  _getThumbnailCSS(thumbnailSrc, isYoutube, audioOnly) {
    return thumbnailSrc != null && (isYoutube || audioOnly)
      ? "background-image: url(" + thumbnailSrc + "); background-size: cover;"
      : null;
  }

  /**
   * loads track metadata
   */
  _getTrackData() {
    // gets cues from tracks
    let root = this,
      media = root.$.loader.media,
      tdata = new Array(),
      selected = 0;
    root.hasTranscript = !root.standAlone;
    // hides the video subtitles and captions and adds them to the tracks dropdown-select
    //gets and updates track metadata
    for (let i = 0; i < media.textTracks.length; i++) {
      if (media.textTracks[i] !== null) {
        let track = media.textTracks[i],
          tidata = {},
          loaded = track.cues !== undefined,
          complete = 0,
          label = track.label,
          lang = track.language,
          text =
            label !== undefined
              ? label
              : lang !== undefined
              ? lang
              : "Track " + i,
          cues,
          loadCueData = setInterval(() => {
            track.mode = "showing";
            if (track.cues !== undefined && track.cues.length > 0) {
              track.mode = "hidden";
              getCueData();
              clearInterval(loadCueData);
            }
          }, 1),
          getCueData = function() {
            track.mode = "hidden";

            let cues = Object.keys(track.cues).map(function(key) {
              return {
                order: track.cues[key].id !== "" ? track.cues[key].id : key,
                seek: track.cues[key].startTime,
                seekEnd: track.cues[key].endTime,
                start: root._getHHMMSS(
                  track.cues[key].startTime,
                  root.media.duration
                ),
                end: root._getHHMMSS(
                  track.cues[key].endTime,
                  root.media.duration
                ),
                text: track.cues[key].text
              };
            });
            tidata = {
              text: text,
              language: lang,
              value: i,
              cues: cues
            };
            tdata.push(tidata);
            root.set("tracks", tdata);
            root.$.controls.setTracks(tdata);
            root.$.transcript.setTracks(tdata);
            root.selectTrack(track.default ? i : 0);

            track.oncuechange = function(e) {
              root.$.transcript.setActiveCues(
                Object.keys(e.currentTarget.activeCues).map(function(key) {
                  return e.currentTarget.activeCues[key].id;
                })
              );
            };
          };
      }
    }
    if (media.textTracks.length > 0) {
      root.hasCaptions = true;
    } else {
      root.standAlone = true;
    }
  }

  /**
   * handles the seek function when a transcript cue is activated
   */
  _handleCueSeek(e) {
    let root = this;
    if (
      !root.standAlone &&
      root.$.transcript !== undefined &&
      root.$.transcript !== null
    ) {
      root.__resumePlaying = root.__playing;
      root.seek(e.detail);
    }
  }

  /**
   * handles media metadata when media is loaded
   */
  _handleMediaLoaded(e) {
    let root = this,
      aspect = root.media.aspectRatio;
    root._setPlayerHeight(aspect);
    root.$.playbutton.removeAttribute("disabled");

    // gets and converts video duration
    root.__duration = root.media.duration > 0 ? root.media.duration : 0;
    root.__status =
      root._getHHMMSS(0, root.media.duration) +
      "/" +
      root._getHHMMSS(root.media.duration);
    root.$.controls.setStatus(root.__status);
    root._getTrackData(root.$.loader.media);
  }

  /**
   * handles transcript printing
   */
  _handlePrinting(e) {
    let root = this;
    root.dispatchEvent(
      new CustomEvent("printing-transcript", { detail: root })
    );
    root.$.transcript.print(root.mediaTitle);
  }

  /**
   * sets search the simple-search element
   */
  _handleSearchAdded(e) {
    this.search = e.detail;
  }
  /**
   * handles duration slider dragging with a mouse
   */
  _handleSliderDragging(e) {
    let root = this;
    root._toggleSliderSeek(
      root.$.slider.dragging,
      root.$.slider.immediateValue
    );
  }

  /**
   * handles duration slider dragging with a keyboard
   */
  _handleSliderKeyboard(e) {
    let root = this;
    root._toggleSliderSeek(root.$.slider.focused, root.$.slider.value);
  }

  /**
   * handles transcript scroll toggle
   */
  _handleTranscriptScrollToggle(e) {
    this.disableScroll = !this.disableScroll;
  }

  /**
   * determine which button was clicked and act accordingly
   */
  _onControlsChanged(e) {
    let root = this,
      action = e.detail.label !== undefined ? e.detail.label : e.detail.id;
    if (action === "backward" || action === root.rewindLabel) {
      root.rewind(root.__duration / 20);
    } else if (
      action === "closed captions" ||
      action === "captions" ||
      action === root.captionsLabel ||
      action === root.captionsMenuLabel
    ) {
      root.toggleCC();
    } else if (
      action === "transcript" ||
      action === "transcript-toggle" ||
      action === root.transcriptLabel ||
      action === root.transcriptMenuLabel
    ) {
      root.toggleTranscript();
    } else if (e.detail.id === "tracks") {
      if (e.detail.value === "") {
        root.toggleCC(false);
      } else {
        root.toggleCC(true);
        root.selectTrack(e.detail.value);
      }
    } else if (action === "forward" || action === root.forwardLabel) {
      root.forward(root.__duration / 20);
    } else if (action === "full screen" || action === root.fullscreenLabel) {
      this.toggleTranscript(this.fullscreen);
      screenfull.toggle(root.$.outerplayer);
    } else if (action === "loop" || action === root.loopLabel) {
      root.toggleLoop();
    } else if (
      action === "mute" ||
      action === "unmute" ||
      action === root.muteLabel ||
      action === root.unmuteLabel
    ) {
      root.toggleMute();
    } else if (action === "pause" || action === root.pauseLabel) {
      root.pause();
    } else if (action === "play" || action === root.playLabel) {
      root.play();
    } else if (action === "restart" || action === root.restartLabel) {
      root.seek(0);
      root.play();
    } else if (action === "speed" || action === root.speedLabel) {
      root.setPlaybackRate(e.detail.value);
    } else if (action === "volume" || action === root.volumeLabel) {
      root.setVolume(e.detail.value);
    }
  }

  /**
   * determines if there
   *
   * @param {string} the url for the thumbnail image
   * @returns {string} the string for the style attribute
   */
  _hidePlayButton(thumbnailSrc, isYoutube, __elapsed) {
    return (
      (isYoutube && thumbnailSrc === null) ||
      !(__elapsed === undefined || __elapsed === 0)
    );
  }

  /**
   * Show custom CC (for audio and YouTube)?
   *
   * @param {boolean} Is the media from YouTube?
   * @param {boolean} Is the media audio only?
   * @param {boolean} Does the media have CC tracks?
   * @param {boolean} Are the CC turned on?
   * @returns {boolean} Should the player show custom CC?
   */
  _showCustomCaptions(isYoutube, audioOnly, hasCaptions, cc) {
    return (isYoutube || audioOnly) && hasCaptions && cc;
  }

  /**
   * handles slider seeking via mouse or keyboard
   *
   * @param {boolean} Is the slider currently being used to seek?
   * @param {number} the value of the slider
   */
  _toggleSliderSeek(seeking, value) {
    if (seeking) {
      if (this.__playing) this.__resumePlaying = true;
      this.pause();
    } else {
      this.seek(value);
      this.__resumePlaying = false;
    }
  }

  /**
   * determines if there
   *
   * @param {string} the url for the thumbnail image
   * @returns {string} the string for the style attribute
   */
  _useYoutubeIframe(thumbnailSrc, isYoutube, __elapsed) {
    return (
      isYoutube &&
      (thumbnailSrc === null || __elapsed === undefined || __elapsed === 0)
    );
  }

  /**
   * gets YouTube iframe
   */
  _youTubeRequest() {
    let root = this,
      ytUtil = window.A11yMediaYoutubeUtility.instance;
    if (root.__playerAttached && root.__playerReady) {
      let ytInit = function() {
          // initialize the YouTube player
          root.media = ytUtil.initYoutubePlayer({
            width: "100%",
            height: "100%",
            videoId: root.youtubeId
          });
          // move the YouTube iframe to the media player's YouTube container
          root.$.youtube.appendChild(root.media.a);
          root.__ytAppended = true;
          root._getTrackData(root.$.loader.media);
          root._updateCustomTracks();
          // youtube API doesn't immediately give length of a video
          let int = setInterval(() => {
            if (root.media.getDuration !== undefined) {
              clearInterval(int);
              root.__duration = root.media.duration = root.media.getDuration();
              root.__status =
                root._getHHMMSS(0, root.media.duration) +
                "/" +
                root._getHHMMSS(root.media.duration);
              root.$.controls.setStatus(root.__status);
              root.disableInteractive = !root.__interactive;
            }
          }, 100);
        },
        checkApi = function(e) {
          if (ytUtil.apiReady) {
            document.removeEventListener("youtube-api-ready", checkApi);
            if (!root.__ytAppended) {
              ytInit();
            }
          }
        };
      if (ytUtil.apiReady) {
        if (!root.__ytAppended) {
          ytInit();
        }
      } else {
        document.addEventListener("youtube-api-ready", checkApi);
      }
    }
  }

  /**
   * updates custom tracks for youTube
   */
  _updateCustomTracks() {
    if (this._hasCustomCaptions(this.isYoutube, this.audioOnly, this.tracks)) {
      let root = this,
        track = root.tracks[this.$.transcript.selectedTranscript],
        active = [],
        caption = "";
      if (
        track !== undefined &&
        track !== null &&
        track.cues !== undefined &&
        track.cues !== null
      ) {
        for (let i = 0; i < track.cues.length; i++) {
          if (
            track.cues[i].seek < root.__elapsed &&
            track.cues[i].seekEnd > root.__elapsed
          ) {
            active.push(track.cues[i].order);
            caption = caption === "" ? track.cues[i].text : caption;
          }
        }
        root.$.customcctxt.innerText = caption;
        root.$.transcript.setActiveCues(active);
      }
    }
  }
}
/**
 * life cycle, element is removed from the DOM
 */
//disconnectedCallback() {}
window.customElements.define(A11yMediaPlayer.tag, A11yMediaPlayer);

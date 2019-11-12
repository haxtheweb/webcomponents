/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { A11yMediaBehaviors } from "./lib/a11y-media-behaviors.js";
import { SimpleColorsPolymer } from "@lrnwebcomponents/simple-colors/lib/simple-colors-polymer.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
import "@lrnwebcomponents/anchor-behaviors/anchor-behaviors.js";
import "@polymer/paper-toast/paper-toast.js";
import "./lib/a11y-media-state-manager.js";
import "./lib/a11y-media-controls.js";
import "./lib/a11y-media-button.js";
import "./lib/a11y-media-html5.js";
import "./lib/a11y-media-transcript.js";
import "./lib/a11y-media-transcript-controls.js";
import "./lib/a11y-media-youtube.js";
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
 * @extends A11yMediaBehaviors
 * @extends SimpleColorsPolymer
 * @polymer
 * @customElement
 * @demo demo/index.html video demo
 * @demo demo/audio.html audio demo
 * @demo demo/youtube.html YouTube demo
 *
 */
class A11yMediaPlayer extends A11yMediaBehaviors {
  
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
  --a11y-media-hover-bg-color: var(--simple-colors-default-theme-grey-2);
  --a11y-media-accent-color: var(--simple-colors-default-theme-accent-9);
  --a11y-media-faded-accent-color: var(--simple-colors-default-theme-accent-8);
  --paper-toast-color: var(--simple-colors-default-theme-grey-11);
  --paper-toast-background-color: var(--simple-colors-default-theme-grey-2);

  
  --a11y-media-settings-menu-color: var(--a11y-media-color);
  --a11y-media-settings-menu-bg-color: var(--a11y-media-bg-color);
  --a11y-media-settings-menu-hover-color: var(--a11y-media-hover-color);
  --a11y-media-settings-menu-hover-bg-color: var(--a11y-media-hover-bg-color);

  
  --a11y-media-button-color: var(--a11y-media-color);
  --a11y-media-button-bg-color: var(--a11y-media-bg-color);
  --a11y-media-button-hover-color: var(--a11y-media-accent-color);
  --a11y-media-button-hover-bg-color: var(--a11y-media-hover-bg-color);
  --a11y-media-button-toggle-color: var(--a11y-media-faded-accent-color);

  
  --paper-toggle-button-unchecked-bar-color: var(--a11y-media-color);
  --paper-toggle-button-unchecked-button-color: var(--a11y-media-color);
  --paper-toggle-button-checked-bar-color: var(--a11y-media-accent-color);
  --paper-toggle-button-checked-button-color: var(--a11y-media-accent-color);

  
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
  
  
  --a11y-media-transcript-color: var(--simple-colors-default-theme-grey-7);
  --a11y-media-transcript-bg-color: var(--simple-colors-default-theme-grey-1);
  --a11y-media-transcript-accent-color: var(--simple-colors-default-theme-accent-8);
  --a11y-media-transcript-faded-accent-color: var(--simple-colors-default-theme-accent-10);
  --a11y-media-transcript-cue-color: var(--simple-colors-fixed-theme-grey-12);
  --a11y-media-transcript-cue-bg-color: var(--simple-colors-fixed-theme-grey-1);
  --a11y-media-transcript-active-cue-color: var(--simple-colors-fixed-theme-grey-12);
  --a11y-media-transcript-active-cue-bg-color: var(--simple-colors-fixed-theme-accent-1);
  --a11y-media-transcript-focused-cue-color: var(--simple-colors-fixed-theme-grey-12);
  --a11y-media-transcript-focused-cue-bg-color: var(--simple-colors-fixed-theme-grey-2);
  --a11y-media-transcript-match-color: var(--simple-colors-fixed-theme-grey-1);
  --a11y-media-transcript-match-bg-color: var(--simple-colors-fixed-theme-accent-10);
  --a11y-media-transcript-match-border-color: var(--simple-colors-fixed-theme-accent-12);
}
:host([dark]) {
  border: 1px solid var(--simple-colors-default-theme-grey-1);
}
:host([dark-transcript]) {
  --a11y-media-transcript-bg-color: var(--simple-colors-dark-theme-grey-1);
  --a11y-media-transcript-cue-color: var(--simple-colors-dark-theme-grey-12);
  --a11y-media-transcript-cue-bg-color: var(--simple-colors-dark-theme-grey-1);
  --a11y-media-transcript-active-cue-color: var(--simple-colors-dark-theme-accent-10);
  --a11y-media-transcript-active-cue-bg-color: var(--simple-colors-dark-theme-grey-1);
  --a11y-media-transcript-match-color: var(--simple-colors-dark-theme-grey-1);
  --a11y-media-transcript-match-bg-color: var(--simple-colors-dark-theme-accent-10);
  --a11y-media-transcript-match-border-color: var(--simple-colors-dark-theme-accent-12);
  --a11y-media-transcript-focused-cue-color: var(--simple-colors-dark-theme-grey-12);
  --a11y-media-transcript-focused-cue-bg-color: var(--simple-colors-dark-theme-grey-2);
}
:host,
:host #outerplayer {
  color: var(--simple-colors-default-theme-grey-12);
  background-color: var(--simple-colors-default-theme-grey-2);
}
:host > * {
  transition: all 0.5s;
}
:host,
:host #outerplayer,
:host #player,
:host #outertranscript,
:host #innertranscript {
  display: flex;
  flex-flow: column;
  align-items: stretch;
  align-content: stretch;
} 
:host #captionlink:link {
  text-decoration: none;
}
:host #innerplayer {
  display: flex;
}
:host([hidden]),
:host *[hidden] {
  display: none !important;
}
:host #innerplayer,
:host #player, 
:host #player > *,
:host #customcc,
:host #customcctxt,
:host #slider,
:host #controls,
:host #outertranscript,
:host #innertranscript {
  width: 100%;
}
:host #innertranscript > * {
  width: calc(100% - 1px);
}
:host > *,
:host #innerplayer,
:host #player,
:host #player > *,
:host #customcctxt {
  flex: 1 1 auto;
}
:host #controls,
:host #tcontrols {
  flex: 0 0 44px;
}
:host #innerplayer {
  margin: 0 auto;
}
:host #player {
  height: 400px;
  position: relative;
}
:host #player > * {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
}
:host #playbutton,
:host #slider,
:host #controls {
  z-index: 2;
}
:host([audio-only]) #playbutton {
  opacity: 0;
}
:host #slider {
  flex: 0 0 32px;
  height: 32px;
}
:host([thumbnail-src]) #youtube {
  opacity: 0;
}
:host #youtube[elapsed] {
  opacity: 1;
  transition: opacity 0.5s;
}
:host #customcc:not([hidden]) {
  font-size: 20px;
  transition: font-size 0.25s;
  display: flex;
}
:host #customcctxt:not(:empty) {
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
:host #printthumb {
  width: 100%;
  margin: 0;
  display: block;
  border-top: 1px solid #aaaaaa;
}
:host .media-caption:not(:empty) {
  width: calc(100% - 30px);
  padding: 5px 15px;
}
:host .media-type {
  font-style: italic;
}
:host #outertranscript {
  padding: 0 1px 0 0;
}
:host #innertranscript {
  flex: 1 0 194px;
}
:host #transcript {
  flex: 1 0 150px;
  overflow-y: scroll;
}
:host .sr-only {
  position: absolute;
  left: -9999px;
  font-size: 0;
  height: 0;
  width: 0;
  overflow: hidden;
}
@media screen {
  :host([flex-layout]:not([responsive-size="xs"])) {
    flex-flow: row;
    padding: 0;
  }
  :host([flex-layout]:not([responsive-size="xs"])) #outerplayer {
    flex: 1 0 auto;
  }
  :host #printthumb,
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
  :host #innertranscript {
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
  :host(:not([thumbnail-src])) #player {
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
<style include="simple-colors-shared-styles-polymer"></style>
  <div class="sr-only">
      <a href$="[[__captionHref]]">[[mediaCaption]]</a>
  </div>
  <div id="outerplayer">
    <div id="innerplayer">
      <div id="player"
        style$="[[_getThumbnailCSS(thumbnailSrc,isYoutube,audioOnly)]]">
        <a11y-media-play-button
          id="playbutton"
          action$="[[playPause.action]]"
          audio-only$="[[audioOnly]]"
          disabled="true"
          elapsed$="[[_hidePlayButton(thumbnailSrc, isYoutube, __elapsed)]]"
          hidden$="[[audioNoThumb]]"
          disabled$="[[audioNoThumb]]"
          on-controls-change="_onControlsChanged"
          localization$="[[localization]]">
        </a11y-media-play-button>
        <a11y-media-html5
          id="html5"
          audio-only$="[[audioOnly]]"
          autoplay$="[[autoplay]]"
          cc$="[[cc]]"
          crossorigin$="[[crossorigin]]"
          hidden$="[[isYoutube]]"
          media-lang$="[[mediaLang]]"
          loop$="[[loop]]"
          muted$="[[muted]]"
          manifest$="[[manifest]]"
          on-media-loaded="_handleMediaLoaded"
          ontimeupdate="_handleTimeUpdate"
          playing$="[[__playing]]"
          playback-rate$="[[playbackRate]]"
          thumbnail-src$="[[thumbnailSrc]]"
          preload$="[[preload]]"
          volume$="[[volume]]"
        >
          <slot></slot>
        </a11y-media-html5>
        <div id="youtube" 
          elapsed$="[[__elapsed]]" 
          lang$="[[mediaLang]]"
          video-id$="[[videoId]]">
        </div>
        <div id="customcc" 
          aria-live="polite"
          class="screen-only" 
          hidden$="[[!showCustomCaptions]]">
          <div id="customcctxt"></div>
        </div>
      </div>
    </div>
    <paper-slider id="slider"
      class="screen-only"
      disabled$="[[disableSeek]]"
      label$="[[seekSlider.label]]"
      min="0"
      max="[[__duration]]"
      on-mousedown="_handleSliderStart"
      on-mouseup="_handleSliderStop"
      on-keyup="_handleSliderStop"
      on-keydown="_handleSliderStart"
      on-blur="_handleSliderStop"
      secondary-progress="[[__buffered]]"
      value="[[__elapsed]]"
    >
    </paper-slider>
    <a11y-media-controls id="controls"
      cc$="[[cc]]"
      disable-seek$="[[disableSeek]]"
      fixed-height$="[[height]]"
      fullscreen$="[[fullscreen]]"
      fullscreen-button$="[[fullscreenButton]]"
      has-captions$="[[hasCaptions]]"
      has-transcript$="[[hasTranscript]]"
      hide-transcript$="[[hideTranscript]]"
      linkable$="[[linkable]]"
      mute-unmute="[[muteUnmute]]"
      on-controls-change="_onControlsChanged"
      on-print-transcript="_handlePrinting"
      on-download-transcript="_handleDownload"
      responsive-size$="[[responsiveSize]]"
      play-pause="[[playPause]]"
      stand-alone$="[[standAlone]]"
      volume="[[__volume]]">
    </a11y-media-controls>
    <a id="captionlink" href$="[[__captionHref]]">
      <div
        aria-hidden="true"
        class="screen-only media-caption"
        hidden$="[[!_hasAttribute(mediaCaption)]]">
        [[mediaCaption]]
      </div>
    </a>
    <div class="print-only media-caption">[[printCaption]]</div>
  </div>
  <img id="printthumb" aria-hidden="true" src$="[[thumbnailSrc]]" />
  <div id="outertranscript" hidden$="[[standAlone]]">
    <div id="innertranscript" hidden$="[[hideTranscript]]">
      <a11y-media-transcript-controls id="tcontrols"
        accent-color$="[[accentColor]]"
        localization$="[[localization]]"
        dark$="[[darkTranscript]]"
        disable-print-button$="[[disablePrintButton]]"
        disable-scroll$="[[disableScroll]]"
        disable-search$="[[disableSearch]]"
        has-transcript$="[[hasTranscript]]"
        localization$="[[localization]]"
        on-searchbar-added="_handleSearchAdded"
        on-toggle-scroll="_handleTranscriptScrollToggle"
        on-print-transcript="_handlePrinting"
        on-download-transcript="_handleDownload"
        stand-alone$="[[standAlone]]">
      </a11y-media-transcript-controls>
      <a11y-media-transcript id="transcript" 
        accent-color$="[[accentColor]]"
        dark$="[[darkTranscript]]"
        disable-scroll$="[[disableScroll]]"
        disable-search$="[[disableSearch]]"
        disable-seek$="[[disableSeek]]"
        disable-interactive$="[[disableInteractive]]"
        hide-timestamps$="[[hideTimestamps]]"
        media-id$="[[id]]"
        on-transcript-seek="_handleTranscriptSeek"
        localization$="[[localization]]"
        search="[[search]]"
        selected-transcript$="[[__selectedTrack]]">
      </a11y-media-transcript>
    </div>
  </div>
  <paper-toast id="link" 
    disabled$="[[!linkable]]" 
    hidden$="[[!linkable]]" 
    duration="5000" 
    text="Copied to clipboard: [[shareLink]]">
    <a11y-media-button
      action="linkable"
      icon="[[_getLocal('closeLink','icon')]]"
      label="[[_getLocal('closeLink','label')]]"
      on-click="_handleCloseLink"
      tooltip-position="top"
    ></a11y-media-button>
  </paper-toast>`;
  }

  // properties available to the custom element for data binding
    static get properties() {
    
    return {
  
  ...super.properties,
  
  /**
   * Allow this media to play concurrently with other a11y-media-players?
   * Default is to pause this a11y-media-player when other a11y-media-player starts playing.
   */

  "allowConcurrent": {
    "name": "allowConcurrent",
    "type": Boolean,
    "value": false
  },
  /**
   * Is it an audio player with no thumbnail?
   */
  "audioNoThumb": {
    "name": "audioNoThumb",
    "type": Boolean,
    "computed": "_getAudioNoThumb(audioOnly,thumbnailSrc)"
  },
  /**
   * Use dark theme on transcript? Default is false, even when player is dark.
   */
  "darkTranscript": {
    "name": "darkTranscript",
    "type": Boolean,
    "value": false
  },
  /**
   * crossorigin attribute for <video> and <audio> tags
   */
  "crossorigin": {
    "type": String,
    "value": null
  },
  /**
   * disable fullscreen option
   */
  "disableFullscreen": {
    "name": "disableFullscreen",
    "type": Boolean,
    "value": false
  },
  /**
   * disable interactive mode that makes the transcript clickable
   */
  "disableInteractive": {
    "name": "disableInteractive",
    "type": Boolean,
    "value": false
  },
  /**
   * Determines if video and transcript are in a flex layout
   */
  "flexLayout": {
    "name": "flexLayout",
    "type": Boolean,
    "computed": "_isFlexLayout(standAlone,hideTranscript,audioNoThumb,stackedLayout)",
    "reflectToAttribute": true
  },
  /**
   * Is fullscreen mode?
   */
  "fullscreen": {
    "name": "fullscreen",
    "type": Boolean,
    "value": false
  },
  /**
   * show the FullscreenButton?
   */
  "fullscreenButton": {
    "name": "fullscreenButton",
    "type": Boolean,
    "computed": "_getFullscreenButton(disableFullscreen,audioNoThumb,screenfullLoaded)",
    "notify": true
  },
  /**
   * Does the player have tracks?
   */
  "hasCaptions": {
    "name": "hasCaptions",
    "type": Boolean,
    "value": false
  },
  /**
   * Hide elapsed time?
   */
  "hideElapsedTime": {
    "name": "hideElapsedTime",
    "type": Boolean,
    "value": false
  },
  /**
   * show cue's start and end time
   */
  "hideTimestamps": {
    "name": "hideTimestamps",
    "type": Boolean,
    "value": false
  },
  /**
   * initially hide the transcript?
   */
  "hideTranscript": {
    "name": "hideTranscript",
    "type": Boolean,
    "value": false,
    "reflectToAttribute": true
  },
  /**
   * initially hide the transcript?
   */
  "id": {
    "name": "id",
    "type": String,
    "value": null,
    "reflectToAttribute": true
  },
  /**
   * The default media caption if none is given.
   */
  "mediaCaption": {
    "name": "mediaCaption",
    "type": String,
    "computed": "_getMediaCaption(audioOnly,localization,mediaTitle)"
  },
  /**
   * the language of the media (if different from user interface language)
   */
  "mediaLang": {
    "name": "mediaLang",
    "type": String,
    "value": "en"
  },
  /**
   * mute/unmute button
   */
  "muteUnmute": {
    "name": "muteUnmute",
    "type": Object,
    "computed": "_getMuteUnmute(muted)"
  },
  /**
   * The media caption that displays when the page is printed.
   */
  "printCaption": {
    "name": "printCaption",
    "type": String,
    "computed": "_getPrintCaption(audioOnly,audioLabel,videoLabel,mediaTitle)"
  },
  /**
   * Size of the a11y media element for responsive styling
   */
  "responsiveSize": {
    "name": "responsiveSize",
    "type": String,
    "notify": true,
    "value": "xs",
    "reflectToAttribute": true
  },
  /**
   * Has screenfull loaded?
   */
  "screenfullLoaded": {
    "name": "screenfullLoaded",
    "type": Boolean,
    "value": false,
    "notify": true
  },
  /**
   * Has screenfull loaded?
   */
  "shareLink": {
    "name": "shareLink",
    "type": String,
    "computed": "_getShareLink(__elapsed)"
  },

  /**
   * is YouTube?
   */
  "showCustomCaptions": {
    "name": "showCustomCaptions",
    "type": Boolean,
    "computed": "_showCustomCaptions(isYoutube, audioOnly, hasCaptions, cc)"
  },
  /**
   * Optional array ouf sources.
   */
  "sources": {
    "name": "sources",
    "type": Array,
    "value": []
  },
  /**
   * stacked layout instead of side-by-side?
   */
  "stackedLayout": {
    "name": "stackedLayout",
    "type": Boolean,
    "value": false
  },
  /**
   * Is the video currently sticky, i.e. it is fixed to the corner when playing but scrolled off screen?
   */
  "sticky": {
    "name": "sticky",
    "type": Boolean,
    "value": false,
    "reflectToAttribute": true
  },
  /**
   * When playing but scrolled off screen, to which corner does it "stick":
   * top-left, top-right, bottom-left, bottom-right, or none?
   * Default is "top-right". "None" disables stickiness.
   */
  "stickyCorner": {
    "name": "stickyCorner",
    "type": String,
    "value": "top-right",
    "reflectToAttribute": true
  },
  /**
   * Source of optional thumbnail image
   */
  "thumbnailSrc": {
    "name": "thumbnailSrc",
    "type": String,
    "value": null,
    "reflectToAttribute": true
  },
  /**
   * Optional array ouf tracks.
   */
  "tracks": {
    "name": "tracks",
    "type": Array,
    "value": []
  },
  /**
   * play/pause button
   */
  "playPause": {
    "name": "playPause",
    "type": Object,
    "computed": "_getPlayPause(__playing)"
  },
  /**
   * Notice if the elapsed time changes
   */
  "__elapsed": {
    "name": "__elapsed",
    "type": Number,
    "value": null,
    "notify": true
  },
  /**
   * Notice if the video is playing
   */
  "__playing": {
    "name": "__playing",
    "type": Boolean,
    "value": false,
    "notify": true,
    "reflectToAttribute": true
  },
  /**
   * Notice if the video is playing
   */
  "__captionHref": {
    "name": "__captionHref",
    "type": String,
    "value": null,
    "notify": true
  }
}
;
  }

  constructor() {
    super();
    import("@polymer/paper-slider/paper-slider.js");
    import("@polymer/iron-icons/iron-icons.js");
    import("@polymer/iron-icons/av-icons.js");
    import("@lrnwebcomponents/a11y-media-player/lib/a11y-media-play-button.js");
    const basePath = this.pathFromUrl(decodeURIComponent(import.meta.url));
    const location = `${basePath}lib/screenfull/dist/screenfull.js`;
    window.ESGlobalBridge.requestAvailability();
    window.ESGlobalBridge.instance.load("screenfullLib", location);
    window.addEventListener(
      "es-bridge-screenfullLib-loaded",
      this._onScreenfullLoaded.bind(this)
    );
    this.__playerAttached = true;
    window.A11yMediaStateManager.requestAvailability();
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

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this._addResponsiveUtility();
    if (this.id === null) this.id = "a11y-media-player" + Date.now();
    window.dispatchEvent(new CustomEvent("a11y-player", { detail: this }));
    if (this.isYoutube) {
      this._youTubeRequest();
    }
  }

  /**
   * sets initial values and loads video or youtube iframe
   */
  ready() {
    super.ready();
    let root = this,
      aspect = 16 / 9,
      tracks = new Array(),
      tdata = new Array(),
      selected = 0;
    if (typeof screenfull === "object") root._onScreenfullLoaded.bind(root);
    root.__playerReady = true;
    root.target = root.shadowRoot.querySelector("#transcript");
    root.__status = root._getLocal("loading", "label");
    root.__slider = root.shadowRoot.querySelector("#slider");
    root.__slider.min = 0;
    root.__volume = root.muted ? 0 : Math.max(this.volume, 10);
    root.__resumePlaying = false;
    root.__duration = 0;
    root.shadowRoot.querySelector("#controls").setStatus(root.__status);
    root.width = root.width !== null ? root.width : "100%";
    root.style.maxWidth = root.width !== null ? root.width : "100%";
    root._setPlayerHeight(aspect);
    if (root.isYoutube) {
      root._youTubeRequest();
      document.addEventListener("timeupdate", e => {
        if (e.detail === root.media) root._handleTimeUpdate(e);
      });
    } else {
      root.media = root.shadowRoot.querySelector("#html5");
      root.media.media.addEventListener("timeupdate", e => {
        root._handleTimeUpdate(e);
      });
      root._addSourcesAndTracks();
    }
    root.shadowRoot
      .querySelector("#transcript")
      .setMedia(root.shadowRoot.querySelector("#innerplayer"));
  }

  /**
   * plays the media
   */
  play() {
    let root = this,
      stopped = !(root.__playing === true);
    if (root.isYoutube && !root.__ytAppended) {
      ytInit();
    } else {
      root.__playing = true;
      root.media.play();
      window.dispatchEvent(
        new CustomEvent("a11y-player-playing", { detail: root })
      );
    }
  }

  /**
   * pauses the media
   */
  pause() {
    let root = this;
    root.__playing = false;
    root.media.pause();
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
    amt = amt !== undefined ? amt : this.media.duration / 20;
    this.__resumePlaying = this.__playing;
    this.seek(this.media.getCurrentTime() - amt, 0);
    if (this.__resumePlaying) this.play();
    this.__resumePlaying = false;
  }

  /**
   * seeks media forward at a set increment
   *
   * @param {float} the elepsed time, in seconds
   */
  forward(amt) {
    amt = amt !== undefined ? amt : this.media.duration / 20;
    this.__resumePlaying = this.__playing;
    this.seek(this.media.getCurrentTime() + amt);
    if (this.__resumePlaying) this.play();
    this.__resumePlaying = false;
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
    }
  }

  /**
   * selects a specific track by index
   *
   * @param {integer} the index of the track
   */
  selectTrack(index) {
    this.__selectedTrack = index;
    this.shadowRoot.querySelector("#html5").selectTrack(index);
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
    this.shadowRoot.querySelector("#html5").setCC(this.cc);
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
    if (
      this.shadowRoot.querySelector("#transcript") !== undefined &&
      this.shadowRoot.querySelector("#transcript") !== null
    ) {
      this.dispatchEvent(
        new CustomEvent("transcript-toggle", { detail: this })
      );
    }
  }

  /**
   * dynamically adds source and track data
   * from the sources and tracks properties
   * (needed for media-player)
   */
  _appendToPlayer(data, type) {
    if (data !== undefined && data !== null && data !== []) {
      let root = this,
        arr = Array.isArray(data) ? data : JSON.parse(data);
      for (let i = 0; i < arr.length; i++) {
        let el = document.createElement(type);
        if (!this.__captionHref && type === "source")
          this.__captionHref = arr[i].src;
        for (let key in arr[i]) {
          el.setAttribute(key, arr[i][key]);
        }
        root.shadowRoot.querySelector("#html5").media.appendChild(el);
      }
    }
  }

  /**
   * sets the height of the player
   * @param {Number} the aspect ratio of the media or its poster thumbnail
   */
  _setPlayerHeight(aspect) {
    let root = this;
    root.shadowRoot.querySelector("#player").style.height = "unset";
    if (root.audioOnly && root.thumbnailSrc === null && root.height === null) {
      root.shadowRoot.querySelector("#player").style.height = "60px";
    } else if (root.height === null) {
      root.shadowRoot.querySelector("#player").style.paddingTop =
        100 / aspect + "%";
      root.shadowRoot.querySelector("#innerplayer").style.maxWidth =
        "calc(" + aspect * 100 + "vh - " + aspect * 80 + "px)";
    } else {
      root.shadowRoot.querySelector("#outerplayer").style.height = root.height;
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
  _getMediaCaption(audioOnly, localization, mediaTitle) {
    let audioLabel = this._getLocal("audio", "label"),
      hasMediaTitle =
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
   * set play/pause button
   *
   * @param {boolean} Is the media muted?
   * @param {string} label if button mutes media
   * @param {string} icon if button mutes media
   * @param {string} label if button unmutes media
   * @param {string} icon if button unmutes media
   * @returns {object} an object containing the current state of the play/pause button, eg., `{"label": "mute", "icon": "av:volume-off"}`
   */
  _getMuteUnmute(muted) {
    return muted
      ? {
          label: this._getLocal("unmute", "label"),
          icon: this._getLocal("unmute", "icon"),
          action: "unmute"
        }
      : {
          label: this._getLocal("mute", "label"),
          icon: this._getLocal("mute", "icon"),
          action: "mute"
        };
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
  _getPrintCaption(audioOnly, localization, mediaTitle) {
    let audioLabel = this._getLocal("audio", "label"),
      videoLabel = this._getLocal("video", "label"),
      hasMediaTitle =
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
   * loads a track's cue metadata
   */
  _addSourcesAndTracks() {
    let root = this,
      counter = 0;
    root.audioOnly = root.audioOnly || root.querySelector("audio") !== null;
    root.querySelectorAll("source,track").forEach(node => {
      if (!root.__captionHref && node.tagName === "SOURCE")
        root.__captionHref = node.getAttribute("src");
      root.shadowRoot.querySelector("#html5").media.appendChild(node);
    });
    root._appendToPlayer(root.tracks, "track");
    root._appendToPlayer(root.sources, "source");
    root.shadowRoot.querySelector("#html5").media.textTracks.onaddtrack = e => {
      root.hasCaptions = true;
      root.hasTranscript = !root.standAlone;
      root._getTrackData(e.track, counter++);
    };
  }

  /**
   * returns true if an attribute is set to a value
   *
   * @param {boolean} Is the media audio only?
   * @param {string} optional: the source URL of the thumbnail image
   * @returns {boolean} Should height of video/thumbnail area be set to 0?
   */
  _getAudioNoThumb(audioOnly, thumbnailSrc) {
    return audioOnly && (thumbnailSrc === null || thumbnailSrc === undefined);
  }

  /**
   * returns whether or not the fullscreen mode should be disabled
   *
   * @param {boolean} Is fullscreen mode set to disabled?
   * @returns {boolean} Should fullscreen disabled?
   */
  _getFullscreenButton(disableFullscreen, audioNoThumb, screenfullLoaded) {
    let root = this;
    if (typeof screenfull === "object") root._onScreenfullLoaded.bind(root);
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) ||
      disableFullscreen ||
      audioNoThumb ||
      !(typeof screenfull === "object")
    ) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * set play/pause button
   *
   * @param {boolean} Is the media playing?
   * @param {string} label if button pauses media
   * @param {string} icon if button pauses media
   * @param {string} label if button plays media
   * @param {string} icon if button plays media
   * @returns {object} an object containing the current state of the play/pause button, eg., `{"label": "Pause", "icon": "av:pause"}`
   */
  _getPlayPause(__playing) {
    return __playing !== false
      ? {
          label: this._getLocal("pause", "label"),
          icon: this._getLocal("pause", "icon"),
          action: "pause"
        }
      : {
          label: this._getLocal("play", "label"),
          icon: this._getLocal("play", "icon"),
          action: "play"
        };
  }
  /**
   * gets the link for sharing the video at a specific timecode
   * @param {boolean} linkable is the video is linkable
   */
  _getShareLink(__elapsed) {
    let url = window.location.href.split(/[#?]/)[0],
      id = this.id ? `?id=${this.id}` : ``,
      elapsed =
        id !== "" && this.__elapsed && this.__elapsed !== 0
          ? `&t=${this.__elapsed}`
          : ``;
    return `${url}${id}${elapsed}`;
  }

  /**
   * loads a track's cue metadata
   */
  _getTrackData(track, id) {
    let root = this,
      selected = track.default === true || root.__selectedTrack === undefined,
      loadCueData;
    if (selected) root.selectTrack(id);
    track.mode = selected && this.cc === true ? "showing" : "hidden";
    loadCueData = setInterval(() => {
      if (
        track.cues !== undefined &&
        track.cues !== null &&
        track.cues.length > 0
      ) {
        clearInterval(loadCueData);
        let cues = Object.keys(track.cues).map(key => {
          return {
            order: track.cues[key].id !== "" ? track.cues[key].id : key,
            seek: track.cues[key].startTime,
            seekEnd: track.cues[key].endTime,
            start: root._getHHMMSS(
              track.cues[key].startTime,
              root.media.duration
            ),
            end: root._getHHMMSS(track.cues[key].endTime, root.media.duration),
            text: track.cues[key].text
          };
        });

        if (root.__tracks === undefined) root.__tracks = [];
        root.push("__tracks", {
          value: id,
          language: track.language,
          text:
            track.label !== undefined
              ? track.label
              : track.language !== undefined
              ? track.language
              : "Track " + id,
          cues: cues
        });
        root.shadowRoot.querySelector("#controls").setTracks(root.__tracks);
        root.shadowRoot.querySelector("#transcript").setTracks(root.__tracks);
        root.push("__tracks");
        track.oncuechange = e => {
          root.shadowRoot.querySelector("#transcript").setActiveCues(
            Object.keys(e.currentTarget.activeCues).map(key => {
              return e.currentTarget.activeCues[key].id;
            })
          );
        };
      }
    }, 1);
  }
  /**
   * handles closing the share link toast
   */
  _handleCloseLink() {
    this.shadowRoot.querySelector("#link").close();
    if (this.__resumePlaying) this.play();
    this.__resumePlaying = false;
  }

  /**
   * handles copying the share link
   */
  _handleCopyLink() {
    let el = document.createElement("textarea");
    this.__resumePlaying = this.__playing;
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
   */
  _handleTranscriptSeek(e) {
    let root = this;
    if (
      !root.standAlone &&
      root.shadowRoot.querySelector("#transcript") !== undefined &&
      root.shadowRoot.querySelector("#transcript") !== null
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
      anchor = window.AnchorBehaviors,
      target = anchor.getTarget(this),
      params = anchor.params,
      aspect = root.media.aspectRatio;
    root._setPlayerHeight(aspect);
    root.shadowRoot.querySelector("#playbutton").removeAttribute("disabled");

    // gets and converts video duration
    root._setElapsedTime();
    root._getTrackData(root.shadowRoot.querySelector("#html5").media);

    //if this video is part of the page's query string or anchor, seek the video
    if (target === this) this.seek(this._getSeconds(params.t));
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
   * handles transcript printing
   */
  _handlePrinting(e) {
    let root = this;
    root.dispatchEvent(
      new CustomEvent("printing-transcript", { detail: root })
    );
    root.shadowRoot.querySelector("#transcript").print(root.mediaTitle);
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
  _handleSliderStart(e) {
    this.__resumePlaying = !this.paused;
    this.pause();
    this.__seeking = true;
  }

  /**
   * handles duration slider dragging with a mouse
   */
  _handleSliderStop(e) {
    this.seek(this.shadowRoot.querySelector("#slider").immediateValue);
    this.__seeking = false;
    if (this.__resumePlaying) {
      this.play();
      this.__resumePlaying = null;
    }
  }

  /**
   * handles time updates
   */
  _handleTimeUpdate(e) {
    let root = this;
    //if play exceeds clip length, stop
    if (root.isYoutube && root.media.duration !== root.media.getDuration()) {
      root.__duration = root.media.duration = root.media.getDuration();
      root.disableSeek = false;
      root._addSourcesAndTracks();
      if (
        root.media.seekable &&
        root.media.seekable.length > 0 &&
        root.media.seekable.start(0) !== 0
      ) {
        root.shadowRoot.querySelector(
          "#slider"
        ).min = root.media.seekable.start(0);
      }
    }
    if (
      root.media.seekable !== undefined &&
      root.media.seekable.length > 0 &&
      root.media.seekable.end(0) <= root.media.getCurrentTime()
    ) {
      root.stop();
      root.__playing = false;
    }
    //prevent slider and cue updates until finished seeking
    root._updateCustomTracks();
    root._setElapsedTime();
  }

  /**
   * handles transcript scroll toggle
   */
  _handleTranscriptScrollToggle(e) {
    this.disableScroll = !this.disableScroll;
  }

  /**
   * Determines if video and transcript are in a flex layout
   *
   * @param {boolean} Is the player in stand-alone mode?
   * @param {boolean} Is the transcript hidden?
   * @param {boolean} Does the media no video or thumbnail image?
   * @param {boolean} Is the layout stacked?
   * @returns {boolean} Is the video in flex layout mode?
   */
  _isFlexLayout(standAlone, hideTranscript, audioNoThumb, stackedLayout) {
    return !standAlone && !hideTranscript && !audioNoThumb && !stackedLayout;
  }

  /**
   * determine which button was clicked and act accordingly
   */
  _onControlsChanged(e) {
    let root = this,
      action = e.detail.action !== undefined ? e.detail.action : e.detail.id;

    if (action === "backward" || action === "rewind") {
      root.rewind();
    } else if (action === "captions") {
      root.toggleCC();
    } else if (action === "transcript" || action === "transcript-toggle") {
      root.toggleTranscript();
    } else if (e.detail.id === "tracks") {
      if (e.detail.value === "") {
        root.toggleCC(false);
      } else {
        root.toggleCC(true);
        root.selectTrack(e.detail.value);
      }
    } else if (action === "forward") {
      root.forward();
    } else if (action === "fullscreen" && root.fullscreenButton) {
      root.toggleTranscript(root.fullscreen);
      screenfull.toggle(root.shadowRoot.querySelector("#outerplayer"));
    } else if (action === "loop") {
      root.toggleLoop();
    } else if (action === "mute" || action === "unmute") {
      root.toggleMute();
    } else if (action === "pause") {
      root.pause();
    } else if (action === "play") {
      root.play();
    } else if (action === "restart") {
      root.seek(0);
      root.play();
    } else if (action === "speed") {
      root.setPlaybackRate(e.detail.value);
    } else if (action === "volume") {
      root.setVolume(e.detail.value);
    } else if (action === "linkable") {
      root._handleCopyLink();
    }
  }

  /**
   * sets the element's screenfullLoaded variable to true once screenfull is loaded
   * and adds an event listener for screenfull
   */
  _onScreenfullLoaded() {
    let root = this;
    root.screenfullLoaded = true;

    // handles fullscreen
    if (screenfull) {
      screenfull.on("change", () => {
        if (screenfull.enabled) root.fullscreen = screenfull.isFullscreen;
      });
    }
  }

  /**
   * sets duration, taking into consideration start and stop times
   *
   * @param {integer} seek time in seconds, optional
   * @returns {string} status
   */
  _setElapsedTime() {
    let elapsed =
        this.__seeking === true
          ? this.shadowRoot.querySelector("#slider").immediateValue
          : this.media.getCurrentTime() > 0
          ? this.media.getCurrentTime()
          : 0,
      duration = this.media.duration > 0 ? this.media.duration : 0;
    this.__elapsed = elapsed;
    this.__duration = duration;
    if (this.media.seekable !== undefined && this.media.seekable.length > 0) {
      if (this.media.seekable.start(0) !== undefined)
        elapsed -= this.media.seekable.start(0);
      if (this.media.seekable.end(0) !== undefined)
        duration =
          this.media.seekable.end(0) -
          (this.media.seekable.start(0) !== undefined
            ? this.media.seekable.start(0)
            : 0);
    }
    this.__status =
      this._getHHMMSS(elapsed, duration) + "/" + this._getHHMMSS(duration);
    this.shadowRoot.querySelector("#controls").setStatus(this.__status);
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
    window.A11yMediaYoutube.requestAvailability();
    let root = this,
      ytUtil = window.A11yMediaYoutube.instance;
    root.disableSeek = true;
    if (root.__playerAttached && root.__playerReady) {
      let ytInit = () => {
          // once metadata is ready on video set it on the media player
          // initialize the YouTube player
          root.media = ytUtil.initYoutubePlayer({
            width: "100%",
            height: "100%",
            videoId: root.youtubeId
          });
          root.__status = root._getLocal("youTubeLoading", "label");
          root.shadowRoot.querySelector("#controls").setStatus(root.__status);
          // move the YouTube iframe to the media player's YouTube container
          root.shadowRoot.querySelector("#youtube").appendChild(root.media.a);
          root.__ytAppended = true;
          root._updateCustomTracks();
        },
        checkApi = e => {
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
    if ((this.isYoutube || this.audioOnly) && this.__tracks) {
      let root = this,
        track =
          root.__tracks[
            this.shadowRoot.querySelector("#transcript").selectedTranscript
          ],
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
        root.shadowRoot.querySelector("#customcctxt").innerText = caption;
        root.shadowRoot.querySelector("#transcript").setActiveCues(active);
      }
    }
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
}
window.customElements.define(A11yMediaPlayer.tag, A11yMediaPlayer);
export { A11yMediaPlayer };

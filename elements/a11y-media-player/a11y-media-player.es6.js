/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html}from"./node_modules/@polymer/polymer/polymer-element.js";import{afterNextRender}from"./node_modules/@polymer/polymer/lib/utils/render-status.js";import{A11yMediaBehaviors}from"./lib/a11y-media-behaviors.js";import{pathFromUrl}from"./node_modules/@polymer/polymer/lib/utils/resolve-url.js";import"./node_modules/@lrnwebcomponents/es-global-bridge/es-global-bridge.js";import"./lib/a11y-media-state-manager.js";import"./lib/a11y-media-controls.js";import"./lib/a11y-media-html5.js";import"./lib/a11y-media-transcript.js";import"./lib/a11y-media-transcript-controls.js";import"./lib/a11y-media-youtube.js";/**
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
 * @polymer
 * @customElement
 * @demo demo/index.html video demo
 * @demo demo/audio.html audio demo
 * @demo demo/youtube.html YouTube demo
 *
 */class A11yMediaPlayer extends A11yMediaBehaviors{// render function
static get template(){return html`
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
}</style>
<style include="simple-colors"></style>
  <div class="sr-only">[[mediaCaption]]</div>
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
      label="[[seekSlider.label]]"
      max$="[[__duration]]"
      secondary-progress$="[[__buffered]]"
      value$="[[__elapsed]]"
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
      mute-unmute="[[muteUnmute]]"
      on-controls-change="_onControlsChanged"
      on-print-transcript="_handlePrinting"
      on-download-transcript="_handleDownload"
      responsive-size$="[[responsiveSize]]"
      play-pause="[[playPause]]"
      stand-alone$="[[standAlone]]"
      volume="[[__volume]]">
    </a11y-media-controls>
    <div
      aria-hidden="true"
      class="screen-only media-caption"
      hidden$="[[!_hasAttribute(mediaCaption)]]">
      [[mediaCaption]]
    </div>
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
  </div>`}// properties available to the custom element for data binding
static get properties(){return{/**
   * Allow this media to play concurrently with other a11y-media-players?
   * Default is to pause this a11y-media-player when other a11y-media-player starts playing.
   */allowConcurrent:{name:"allowConcurrent",type:"Boolean",value:!1},/**
   * Is it an audio player with no thumbnail?
   */audioNoThumb:{name:"audioNoThumb",type:"Boolean",computed:"_getAudioNoThumb(audioOnly,thumbnailSrc)"},/**
   * Use dark theme on transcript? Default is false, even when player is dark.
   */darkTranscript:{name:"darkTranscript",type:"Boolean",value:!1},/**
   * disable fullscreen option
   */disableFullscreen:{name:"disableFullscreen",type:"Boolean",value:!1},/**
   * disable interactive mode that makes the transcript clickable
   */disableInteractive:{name:"disableInteractive",type:"Boolean",value:!1},/**
   * Determines if video and transcript are in a flex layout
   */flexLayout:{name:"flexLayout",type:"Boolean",computed:"_isFlexLayout(standAlone,hideTranscript,audioNoThumb,stackedLayout)",reflectToAttribute:!0},/**
   * Is fullscreen mode?
   */fullscreen:{name:"fullscreen",type:"Boolean",value:!1},/**
   * show the FullscreenButton?
   */fullscreenButton:{name:"fullscreenButton",type:"Boolean",computed:"_getFullscreenButton(disableFullscreen,audioNoThumb,screenfullLoaded)",notify:!0},/**
   * Does the player have tracks?
   */hasCaptions:{name:"hasCaptions",type:"Boolean",value:!1},/**
   * Hide elapsed time?
   */hideElapsedTime:{name:"hideElapsedTime",type:"Boolean",value:!1},/**
   * show cue's start and end time
   */hideTimestamps:{name:"hideTimestamps",type:"Boolean",value:!1},/**
   * initially hide the transcript?
   */hideTranscript:{name:"hideTranscript",type:"Boolean",value:!1,reflectToAttribute:!0},/**
   * initially hide the transcript?
   */id:{name:"id",type:"String",value:null,reflectToAttribute:!0},/**
   * The default media caption if none is given.
   */mediaCaption:{name:"mediaCaption",type:"String",computed:"_getMediaCaption(audioOnly,localization,mediaTitle)"},/**
   * the language of the media (if different from user interface language)
   */mediaLang:{name:"mediaLang",type:"String",value:"en"},/**
   * mute/unmute button
   */muteUnmute:{name:"muteUnmute",type:"Object",computed:"_getMuteUnmute(muted)"},/**
   * The media caption that displays when the page is printed.
   */printCaption:{name:"printCaption",type:"String",computed:"_getPrintCaption(audioOnly,audioLabel,videoLabel,mediaTitle)"},/**
   * Size of the a11y media element for responsive styling
   */responsiveSize:{name:"responsiveSize",type:"String",notify:!0,value:"xs",reflectToAttribute:!0},/**
   * Has screenfull loaded?
   */screenfullLoaded:{name:"screenfullLoaded",type:"Boolean",value:!1,notify:!0},/**
   * is YouTube?
   */showCustomCaptions:{name:"showCustomCaptions",type:"Boolean",computed:"_showCustomCaptions(isYoutube, audioOnly, hasCaptions, cc)"},/**
   * Optional array ouf sources.
   */sources:{name:"sources",type:"Array",value:[]},/**
   * stacked layout instead of side-by-side?
   */stackedLayout:{name:"stackedLayout",type:"Boolean",value:!1},/**
   * Is the video currently sticky, i.e. it is fixed to the corner when playing but scrolled off screen?
   */sticky:{name:"sticky",type:"Boolean",value:!1,reflectToAttribute:!0},/**
   * When playing but scrolled off screen, to which corner does it "stick":
   * top-left, top-right, bottom-left, bottom-right, or none?
   * Default is "top-right". "None" disables stickiness.
   */stickyCorner:{name:"stickyCorner",type:"String",value:"top-right",reflectToAttribute:!0},/**
   * Source of optional thumbnail image
   */thumbnailSrc:{name:"thumbnailSrc",type:"String",value:null,reflectToAttribute:!0},/**
   * Optional array ouf tracks.
   */tracks:{name:"tracks",type:"Array",value:[]},/**
   * play/pause button
   */playPause:{name:"playPause",type:"Object",computed:"_getPlayPause(__playing)"},/**
   * Notice if the video is playing
   */__playing:{name:"__playing",type:"Boolean",value:!1,notify:!0,reflectToAttribute:!0}}}constructor(){super();import("./node_modules/@polymer/paper-slider/paper-slider.js");import("./node_modules/@polymer/iron-icons/iron-icons.js");import("./node_modules/@polymer/iron-icons/av-icons.js");import("./node_modules/@lrnwebcomponents/a11y-media-player/lib/a11y-media-play-button.js");const basePath=pathFromUrl(decodeURIComponent(import.meta.url)),location=`${basePath}lib/screenfull/dist/screenfull.js`;window.ESGlobalBridge.requestAvailability();window.ESGlobalBridge.instance.load("screenfullLib",location);window.addEventListener("es-bridge-screenfullLib-loaded",this._onScreenfullLoaded.bind(this));this.__playerAttached=!0;window.A11yMediaStateManager.requestAvailability()}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */static get tag(){return"a11y-media-player"}//get player-specific behaviors
static get behaviors(){return[A11yMediaBehaviors]}/**
   * life cycle, element is afixed to the DOM
   */connectedCallback(){super.connectedCallback();this._addResponsiveUtility();window.dispatchEvent(new CustomEvent("a11y-player",{detail:this}));if(this.isYoutube){this._youTubeRequest()}}/**
   * sets initial values and loads video or youtube iframe
   */ready(){super.ready();let root=this,aspect=16/9,tracks=[],tdata=[],selected=0;if("object"===typeof screenfull)root._onScreenfullLoaded.bind(root);if(null===root.id)root.id="a11y-media-player"+Date.now();root.__playerReady=!0;root.target=root.shadowRoot.querySelector("#transcript");root.__status=root._getLocal("loading","label");root.__slider=root.$.slider;root.__volume=root.muted?0:Math.max(this.volume,10);root.__resumePlaying=!1;root.__duration=0;root.$.controls.setStatus(root.__status);root.width=null!==root.width?root.width:"100%";root.style.maxWidth=null!==root.width?root.width:"100%";root._setPlayerHeight(aspect);if(root.isYoutube){root._youTubeRequest();document.addEventListener("timeupdate",e=>{if(e.detail===root.media)root._handleTimeUpdate(e)})}else{root.media=root.$.html5;root.media.media.addEventListener("timeupdate",e=>{root._handleTimeUpdate(e)});root._addSourcesAndTracks()}root.$.transcript.setMedia(root.$.innerplayer);afterNextRender(this,function(){this.shadowRoot.querySelector("#slider").addEventListener("mousedown",this._handleSliderStart.bind(this));this.shadowRoot.querySelector("#slider").addEventListener("mouseup",this._handleSliderStop.bind(this));this.shadowRoot.querySelector("#slider").addEventListener("keydown",this._handleSliderStart.bind(this));this.shadowRoot.querySelector("#slider").addEventListener("keyup",this._handleSliderStop.bind(this));this.shadowRoot.querySelector("#slider").addEventListener("blur",this._handleSliderStop.bind(this))})}/**
   * plays the media
   */play(){let root=this,stopped=!(!0===root.__playing);root.__playing=!0;root.media.play();window.dispatchEvent(new CustomEvent("a11y-player-playing",{detail:root}))}/**
   * pauses the media
   */pause(){let root=this;root.__playing=!1;root.media.pause()}/**
   * stops the media
   */stop(){this.pause();this.seek(0)}/**
   * restarts the media
   */restart(){this.seek(0);this.play()}/**
   * seeks media backward at a set increment
   *
   * @param {float} the elepsed time, in seconds
   */rewind(amt){amt=amt!==void 0?amt:this.media.duration/20;this.__resumePlaying=this.__playing;this.seek(this.media.getCurrentTime()-amt,0);if(this.__resumePlaying)this.play();this.__resumePlaying=!1}/**
   * seeks media forward at a set increment
   *
   * @param {float} the elepsed time, in seconds
   */forward(amt){amt=amt!==void 0?amt:this.media.duration/20;this.__resumePlaying=this.__playing;this.seek(this.media.getCurrentTime()+amt);if(this.__resumePlaying)this.play();this.__resumePlaying=!1}/**
   * seeks to a specific time
   *
   * @param {float} the time, in seconds, to seek
   */seek(time){let seekable=this.media!==void 0&&null!==this.media?this.media.seekable:[];if(0<seekable.length&&time>=seekable.start(0)&&time<=seekable.end(0)){this.media.seek(time)}}/**
   * selects a specific track by index
   *
   * @param {integer} the index of the track
   */selectTrack(index){this.__selectedTrack=index;this.$.html5.selectTrack(index)}/**
   * set volume of media
   *
   * @param {integer} the volume level from 0-100
   */setVolume(value){this.volume=null!==value?value:70;this.media.setVolume(this.volume);this.muted=0===this.volume}/**
   * set speed/playback rate of media
   *
   * @param {float} the playback rate, where 1 = 100%
   */setPlaybackRate(value){value=null!==value?value:1;this.media.setPlaybackRate(value)}/**
   * toggles captions
   *
   * @param {boolean} Toggle CC on? `true` is on, `false` is off, and `null` toggles based on current state.
   */toggleCC(mode){this.cc=mode===void 0?!this.cc:mode;this.$.html5.setCC(this.cc)}/**
   * toggles looping
   *
   * @param {boolean} Toggle looping on? `true` is on, `false` is off, and `null` toggles based on current state.
   */toggleLoop(mode){if(this.isYoutube){}else{this.loop=mode===void 0?!this.loop:mode;this.media.setLoop(this.loop)}}/**
   * toggles mute
   *
   * @param {boolean} Toggle mute on? `true` is on, `false` is off, and `null` toggles based on current state.
   */toggleMute(mode){this.muted=mode===void 0?!this.muted:mode;this.__volume=this.muted?0:Math.max(this.volume,10);this.media.setMute(this.muted)}/**
   * toggles sticky attribute
   *
   * @param {boolean} Toggle sticky mode on? `true` is on, `false` is off, and `null` toggles based on current state.
   */toggleSticky(mode){mode=mode===void 0?!this.sticky:mode;this.sticky=mode;this.dispatchEvent(new CustomEvent("player-sticky",{detail:this}))}/**
   * toggles transcript
   *
   * @param {boolean} Toggle transcript on? `true` is on, `false` is off, and `null` toggles based on current state.
   */toggleTranscript(mode){mode=mode===void 0?this.hideTranscript:mode;this.hideTranscript=!mode;if(this.$.transcript!==void 0&&null!==this.$.transcript){this.dispatchEvent(new CustomEvent("transcript-toggle",{detail:this}))}}/**
   * dynamically adds source and track data
   * from the sources and tracks properties
   * (needed for media-player)
   */_appendToPlayer(data,type){if(data!==void 0&&null!==data&&[]!==data){let root=this,arr=Array.isArray(data)?data:JSON.parse(data);for(let i=0,el;i<arr.length;i++){el=document.createElement(type);for(let key in arr[i]){el.setAttribute(key,arr[i][key])}root.$.html5.media.appendChild(el)}}}/**
   * sets the height of the player
   * @param {Number} the aspect ratio of the media or its poster thumbnail
   */_setPlayerHeight(aspect){let root=this;if(root.audioOnly&&null===root.thumbnailSrc&&null===root.height){root.$.player.style.height="60px"}else if(null===root.height){root.$.player.style.paddingTop=100/aspect+"%";root.$.innerplayer.style.maxWidth="calc("+100*aspect+"vh - "+80*aspect+"px)"}else{root.$.outerplayer.style.height=root.height}}/**
   * gets media caption
   *
   * @param {boolean} Is the player set to audio-only?
   * @param {string} the text that indicates this player is audio-only
   * @param {string} the title of the media
   * @returns {string} the media caption
   */_getMediaCaption(audioOnly,localization,mediaTitle){let audioLabel=this._getLocal("audio","label"),hasMediaTitle=mediaTitle!==void 0&&null!==mediaTitle&&""!==mediaTitle;if(audioOnly&&hasMediaTitle){return mediaTitle+" ("+audioLabel+")"}else if(audioOnly){return audioLabel}else if(hasMediaTitle){return mediaTitle}else{return null}}/**
   * set play/pause button
   *
   * @param {boolean} Is the media muted?
   * @param {string} label if button mutes media
   * @param {string} icon if button mutes media
   * @param {string} label if button unmutes media
   * @param {string} icon if button unmutes media
   * @returns {object} an object containing the current state of the play/pause button, eg., `{"label": "mute", "icon": "av:volume-off"}`
   */_getMuteUnmute(muted){return muted?{label:this._getLocal("unmute","label"),icon:this._getLocal("unmute","icon"),action:"unmute"}:{label:this._getLocal("mute","label"),icon:this._getLocal("mute","icon"),action:"mute"}}/**
   * gets print caption
   *
   * @param {boolean} Is the player set to audio-only?
   * @param {string} the text that indicates this player is audio-only
   * @param {string} the text that indicates this player is for video
   * @param {string} the title of the media
   * @returns {string} the media caption when the page is printed
   */_getPrintCaption(audioOnly,localization,mediaTitle){let audioLabel=this._getLocal("audio","label"),videoLabel=this._getLocal("video","label"),hasMediaTitle=mediaTitle!==void 0&&null!==mediaTitle&&""!==mediaTitle;if(audioOnly&&hasMediaTitle){return mediaTitle+" ("+audioLabel+")"}else if(audioOnly){return audioLabel}else if(hasMediaTitle){return mediaTitle+" ("+videoLabel+")"}else{return videoLabel}}/**
   * get thumbanail css based on whether or not the video is playing
   *
   * @param {string} the url for the thumbnail image
   * @returns {string} the string for the style attribute
   */_getThumbnailCSS(thumbnailSrc,isYoutube,audioOnly){return null!=thumbnailSrc&&(isYoutube||audioOnly)?"background-image: url("+thumbnailSrc+"); background-size: cover;":null}/**
   * loads a track's cue metadata
   */_addSourcesAndTracks(){let root=this,counter=0;root.querySelectorAll("source,track").forEach(node=>{root.$.html5.media.appendChild(node)});root._appendToPlayer(root.tracks,"track");root._appendToPlayer(root.sources,"source");root.$.html5.media.textTracks.onaddtrack=e=>{root.hasCaptions=!0;root.hasTranscript=!root.standAlone;root._getTrackData(e.track,counter++)}}/**
   * returns true if an attribute is set to a value
   *
   * @param {boolean} Is the media audio only?
   * @param {string} optional: the source URL of the thumbnail image
   * @returns {boolean} Should height of video/thumbnail area be set to 0?
   */_getAudioNoThumb(audioOnly,thumbnailSrc){return audioOnly&&(null===thumbnailSrc||thumbnailSrc===void 0)}/**
   * returns whether or not the fullscreen mode should be disabled
   *
   * @param {boolean} Is fullscreen mode set to disabled?
   * @returns {boolean} Should fullscreen disabled?
   */_getFullscreenButton(disableFullscreen,audioNoThumb,screenfullLoaded){if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)||disableFullscreen||audioNoThumb||!screenfullLoaded){return!1}else{return!0}}/**
   * set play/pause button
   *
   * @param {boolean} Is the media playing?
   * @param {string} label if button pauses media
   * @param {string} icon if button pauses media
   * @param {string} label if button plays media
   * @param {string} icon if button plays media
   * @returns {object} an object containing the current state of the play/pause button, eg., `{"label": "Pause", "icon": "av:pause"}`
   */_getPlayPause(__playing){return!1!==__playing?{label:this._getLocal("pause","label"),icon:this._getLocal("pause","icon"),action:"pause"}:{label:this._getLocal("play","label"),icon:this._getLocal("play","icon"),action:"play"}}/**
   * loads a track's cue metadata
   */_getTrackData(track,id){let root=this,selected=!0===track.default||root.__selectedTrack===void 0,loadCueData;if(selected)root.selectTrack(id);track.mode=selected&&!0===this.cc?"showing":"hidden";loadCueData=setInterval(()=>{if(track.cues!==void 0&&null!==track.cues&&0<track.cues.length){clearInterval(loadCueData);let cues=Object.keys(track.cues).map(key=>{return{order:""!==track.cues[key].id?track.cues[key].id:key,seek:track.cues[key].startTime,seekEnd:track.cues[key].endTime,start:root._getHHMMSS(track.cues[key].startTime,root.media.duration),end:root._getHHMMSS(track.cues[key].endTime,root.media.duration),text:track.cues[key].text}});if(root.__tracks===void 0)root.__tracks=[];root.push("__tracks",{value:id,language:track.language,text:track.label!==void 0?track.label:track.language!==void 0?track.language:"Track "+id,cues:cues});root.$.controls.setTracks(root.__tracks);root.$.transcript.setTracks(root.__tracks);root.push("__tracks");track.oncuechange=e=>{root.$.transcript.setActiveCues(Object.keys(e.currentTarget.activeCues).map(key=>{return e.currentTarget.activeCues[key].id}))}}},1)}/**
   * handles the seek function when a transcript cue is activated
   */_handleTranscriptSeek(e){let root=this;if(!root.standAlone&&root.$.transcript!==void 0&&null!==root.$.transcript){root.__resumePlaying=root.__playing;root.seek(e.detail)}}/**
   * handles media metadata when media is loaded
   */_handleMediaLoaded(e){let root=this,aspect=root.media.aspectRatio;root._setPlayerHeight(aspect);root.$.playbutton.removeAttribute("disabled");// gets and converts video duration
root._setElapsedTime();root._getTrackData(root.$.html5.media)}/**
   * determines if there
   *
   * @param {string} the url for the thumbnail image
   * @returns {string} the string for the style attribute
   */_hidePlayButton(thumbnailSrc,isYoutube,__elapsed){return isYoutube&&null===thumbnailSrc||!(__elapsed===void 0||0===__elapsed)}/**
   * handles transcript printing
   */_handlePrinting(e){let root=this;root.dispatchEvent(new CustomEvent("printing-transcript",{detail:root}));root.$.transcript.print(root.mediaTitle)}/**
   * sets search the simple-search element
   */_handleSearchAdded(e){this.search=e.detail}/**
   * handles duration slider dragging with a mouse
   */_handleSliderStart(e){this.__resumePlaying=!this.paused;this.pause();this.__seeking=!0}/**
   * handles duration slider dragging with a mouse
   */_handleSliderStop(e){this.seek(this.$.slider.immediateValue);this.__seeking=!1;if(this.__resumePlaying){this.play();this.__resumePlaying=null}}/**
   * handles time updates
   */_handleTimeUpdate(e){let root=this;//if play exceeds clip length, stop
if(root.isYoutube&&root.media.duration!==root.media.getDuration()){root.__duration=root.media.duration=root.media.getDuration();root.disableSeek=!1;root._addSourcesAndTracks();if(root.media.seekable!==void 0&&0<root.media.seekable.length){root.$.slider.min=root.media.seekable.start(0)}}if(root.media.seekable!==void 0&&0<root.media.seekable.length&&root.media.seekable.end(0)<=root.media.getCurrentTime()){root.stop();root.__playing=!1}//prevent slider and cue updates until finished seeking
root._updateCustomTracks();root._setElapsedTime()}/**
   * handles transcript scroll toggle
   */_handleTranscriptScrollToggle(e){this.disableScroll=!this.disableScroll}/**
   * Determines if video and transcript are in a flex layout
   *
   * @param {boolean} Is the player in stand-alone mode?
   * @param {boolean} Is the transcript hidden?
   * @param {boolean} Does the media no video or thumbnail image?
   * @param {boolean} Is the layout stacked?
   * @returns {boolean} Is the video in flex layout mode?
   */_isFlexLayout(standAlone,hideTranscript,audioNoThumb,stackedLayout){return!standAlone&&!hideTranscript&&!audioNoThumb&&!stackedLayout}/**
   * determine which button was clicked and act accordingly
   */_onControlsChanged(e){let root=this,action=e.detail.action!==void 0?e.detail.action:e.detail.id;if("backward"===action||"rewind"===action){root.rewind()}else if("captions"===action){root.toggleCC()}else if("transcript"===action||"transcript-toggle"===action){root.toggleTranscript()}else if("tracks"===e.detail.id){if(""===e.detail.value){root.toggleCC(!1)}else{root.toggleCC(!0);root.selectTrack(e.detail.value)}}else if("forward"===action){root.forward()}else if("fullscreen"===action&&root.fullscreenButton){root.toggleTranscript(root.fullscreen);screenfull.toggle(root.$.outerplayer)}else if("loop"===action){root.toggleLoop()}else if("mute"===action||"unmute"===action){root.toggleMute()}else if("pause"===action){root.pause()}else if("play"===action){root.play()}else if("restart"===action){root.seek(0);root.play()}else if("speed"===action){root.setPlaybackRate(e.detail.value)}else if("volume"===action){root.setVolume(e.detail.value)}}/**
   * sets the element's screenfullLoaded variable to true once screenfull is loaded
   * and adds an event listener for screenfull
   */_onScreenfullLoaded(){let root=this;root.screenfullLoaded=!0;// handles fullscreen
if(screenfull){screenfull.on("change",()=>{if(screenfull.enabled)root.fullscreen=screenfull.isFullscreen})}}/**
   * sets duration, taking into consideration start and stop times
   *
   * @param {integer} seek time in seconds, optional
   * @returns {string} status
   */_setElapsedTime(){let elapsed=!0===this.__seeking?this.$.slider.immediateValue:0<this.media.getCurrentTime()?this.media.getCurrentTime():0,duration=0<this.media.duration?this.media.duration:0;this.__elapsed=elapsed;this.__duration=duration;if(this.media.seekable!==void 0&&0<this.media.seekable.length){if(this.media.seekable.start(0)!==void 0)elapsed-=this.media.seekable.start(0);if(this.media.seekable.end(0)!==void 0)duration=this.media.seekable.end(0)-(this.media.seekable.start(0)!==void 0?this.media.seekable.start(0):0)}this.__status=this._getHHMMSS(elapsed,duration)+"/"+this._getHHMMSS(duration);this.$.controls.setStatus(this.__status)}/**
   * Show custom CC (for audio and YouTube)?
   *
   * @param {boolean} Is the media from YouTube?
   * @param {boolean} Is the media audio only?
   * @param {boolean} Does the media have CC tracks?
   * @param {boolean} Are the CC turned on?
   * @returns {boolean} Should the player show custom CC?
   */_showCustomCaptions(isYoutube,audioOnly,hasCaptions,cc){return(isYoutube||audioOnly)&&hasCaptions&&cc}/**
   * determines if there
   *
   * @param {string} the url for the thumbnail image
   * @returns {string} the string for the style attribute
   */_useYoutubeIframe(thumbnailSrc,isYoutube,__elapsed){return isYoutube&&(null===thumbnailSrc||__elapsed===void 0||0===__elapsed)}/**
   * gets YouTube iframe
   */_youTubeRequest(){window.A11yMediaYoutube.requestAvailability();let root=this,ytUtil=window.A11yMediaYoutube.instance;root.disableSeek=!0;if(root.__playerAttached&&root.__playerReady){let ytInit=()=>{// once metadata is ready on video set it on the media player
// initialize the YouTube player
root.media=ytUtil.initYoutubePlayer({width:"100%",height:"100%",videoId:root.youtubeId});root.__status=root._getLocal("youTubeLoading","label");root.$.controls.setStatus(root.__status);// move the YouTube iframe to the media player's YouTube container
root.$.youtube.appendChild(root.media.a);root.__ytAppended=!0;root._updateCustomTracks()},checkApi=e=>{if(ytUtil.apiReady){document.removeEventListener("youtube-api-ready",checkApi);if(!root.__ytAppended){ytInit()}}};if(ytUtil.apiReady){if(!root.__ytAppended){ytInit()}}else{document.addEventListener("youtube-api-ready",checkApi)}}}/**
   * updates custom tracks for youTube
   */_updateCustomTracks(){if((this.isYoutube||this.audioOnly)&&this.__tracks){let root=this,track=root.__tracks[this.$.transcript.selectedTranscript],active=[],caption="";if(track!==void 0&&null!==track&&track.cues!==void 0&&null!==track.cues){for(let i=0;i<track.cues.length;i++){if(track.cues[i].seek<root.__elapsed&&track.cues[i].seekEnd>root.__elapsed){active.push(track.cues[i].order);caption=""===caption?track.cues[i].text:caption}}root.$.customcctxt.innerText=caption;root.$.transcript.setActiveCues(active)}}}/**
   * life cycle, element is removed from the DOM
   */disconnectedCallback(){this.shadowRoot.querySelector("#slider").removeEventListener("mousedown",this._handleSliderStart.bind(this));this.shadowRoot.querySelector("#slider").removeEventListener("mouseup",this._handleSliderStop.bind(this));this.shadowRoot.querySelector("#slider").removeEventListener("keydown",this._handleSliderStart.bind(this));this.shadowRoot.querySelector("#slider").removeEventListener("keyup",this._handleSliderStop.bind(this));this.shadowRoot.querySelector("#slider").removeEventListener("blur",this._handleSliderStop.bind(this));window.removeEventListener("es-bridge-screenfullLib-loaded",this._onScreenfullLoaded.bind(this));super.disconnectedCallback()}}window.customElements.define(A11yMediaPlayer.tag,A11yMediaPlayer);export{A11yMediaPlayer};
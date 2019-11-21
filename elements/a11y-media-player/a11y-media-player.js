/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { ifDefined } from 'lit-html/directives/if-defined.js';
import "@lrnwebcomponents/anchor-behaviors/anchor-behaviors.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
import { A11yMediaBehaviors } from "./lib/a11y-media-behaviors.js";
import "./lib/a11y-media-state-manager.js";
import "./lib/a11y-media-controls.js";
import "./lib/a11y-media-button.js";
import "./lib/a11y-media-html5.js";
import "./lib/a11y-media-transcript.js";
import "./lib/a11y-media-youtube.js";
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
class A11yMediaPlayer extends A11yMediaBehaviors {
  
  //styles function
  static get styles() {
    return  [
      css`
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
#innerplayer {
  display: flex;
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
}
#player {
  height: 400px;
  position: relative;
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
:host([audio-only]) #playbutton {
  opacity: 0;
}
#slider {
  flex: 0 0 32px;
  height: 32px;
}
:host([thumbnail-src]) #youtube {
  opacity: 0;
}
#youtube[elapsed] {
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
}
.sr-only {
  position: absolute;
  left: -9999px;
  font-size: 0;
  height: 0;
  width: 0;
  overflow: hidden;
}
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
}
      `
    ];
  }
  // render function
  render() {
    return html`

<div class="sr-only">
  <a href="${ifDefined(this.test)}">${this.mediaCaption}</a>
</div>
<div id="outerplayer">
  <div id="innerplayer">
    <div id="player"
      .style="${this._getThumbnailCSS(this.thumbnailSrc,this.isYoutube,this.audioOnly)}">
      <a11y-media-play-button
        id="playbutton"
        action="${this.playPause.action}"
        disabled="true"
        label="${this.playPause.label}"
        @controls-change="${this._onControlsChanged}"
        .localization="${this.localization}"
        ?audio-only="${this.audioOnly}"
        ?disabled="${this.audioNoThumb}"
        ?hidden="${this._hidePlayButton(this.thumbnailSrc, this.isYoutube, this.__elapsed)}">
      </a11y-media-play-button>
      <a11y-media-html5
        id="html5"
        crossorigin="${ifDefined(this.crossorigin)}"
        media-lang="${this.mediaLang}"
        playback-rate="${this.playbackRate}"
        preload="${this.preload}"
        thumbnail-src="${ifDefined(this.thumbnailSrc)}"
        volume="${this.volume}"
        @media-loaded="${this._handleMediaLoaded}"
        @timeupdate="${this._handleTimeUpdate}"
        ?audio-only="${this.audioOnly}"
        ?autoplay="${this.autoplay}"
        ?cc="${this.cc}"
        ?hidden="${this.isYoutube}"
        ?loop="${this.loop}"
        ?muted="${this.muted}"
        ?playing="${this.__playing}"
      >
        <slot></slot>
      </a11y-media-html5>
      <div id="youtube" 
        lang="${this.mediaLang}"
        video-id="${this.videoId}"
        .elapsed="${this.__elapsed || false}" >
      </div>
      <div id="customcc" 
        aria-live="polite"
        class="screen-only" 
        ?hidden="${!this.showCustomCaptions}">
        <div id="customcctxt"></div>
      </div>
    </div>
  </div>
  <paper-slider id="slider"
    class="screen-only"
    label="${this.seekSlider.label}"
    min="0"
    max="${this.__duration}"
    secondary-progress="${this.__buffered}"
    @mousedown="${this._handleSliderStart}"
    @mouseup="${this._handleSliderStop}"
    @keyup="${this._handleSliderStop}"
    @keydown="${this._handleSliderStart}"
    @blur="${this._handleSliderStop}"
    .value="${this.__elapsed}"
    ?disabled="${this.disableSeek}"
  >
  </paper-slider>
  <a11y-media-controls id="controls"
    responsive-size="${this.responsiveSize}"
    volume="${this.__volume}"
    @controls-change="${this._onControlsChanged}"
    @print-transcript="${this._handlePrinting}"
    @download-transcript="${this._handleDownload}"
    .mute-unmute="${this.muteUnmute}"
    .play-pause="${this.playPause}"
    .status="${this.status}"
    ?cc="${this.cc}"
    ?disable-seek="${this.disableSeek}"
    ?fixed-height="${this.height}"
    ?fullscreen="${this.fullscreen}"
    ?fullscreen-button="${this.fullscreenButton}"
    ?has-captions="${this.hasCaptions}"
    ?has-transcript="${this.hasTranscript}"
    ?hide-transcript="${this.hideTranscript}"
    ?linkable="${this.linkable}"
    ?stand-alone="${this.standAlone}">
  </a11y-media-controls>
  <a id="captionlink" href="${ifDefined(this.__captionHref)}">
    <div
      aria-hidden="true"
      class="screen-only media-caption"
      ?hidden="${!this._hasAttribute(this.mediaCaption)}">
      ${this.mediaCaption}
    </div>
  </a>
  <div class="print-only media-caption">${this.printCaption}</div>
</div>
<img id="printthumb" aria-hidden="true" src="${ifDefined(this.thumbnailSrc)}" />
<div id="outertranscript" ?hidden="${this.standAlone}">
  <div id="innertranscript" ?hidden="${this.hideTranscript}">
    <div id="searchbar">
      <div id="searching">
        <simple-search
          id="simplesearch"
          controls="transcript"
          no-label-float
          next-button-icon="${this._getLocal('nextResult','icon')}"
          next-button-label="${this._getLocal('nextResult','label')}"
          prev-button-icon="${this._getLocal('prevResult','icon')}"
          prev-button-label="${this._getLocal('prevResult','label')}"
          search-input-icon="${this._getLocal('search','icon')}"
          search-input-label="${this._getLocal('search','label')}"
          ?disabled="${this.disableSearch}"
          ?hidden="${this.disableSearch}"
        >
        </simple-search>
      </div>
      <div id="scrolling">
        <a11y-media-button
          id="scroll"
          controls="transcript"
          icon="${this._getLocal('autoScroll','icon')}"
          label="${this._getLocal('autoScroll','label')}"
          @click="${this._handleScrollClick}"
          ?toggle="${!this.disableScroll}">
        </a11y-media-button>
      </div>
      <div id="printing"
        ?hidden="${this.disablePrintButton}"
        ?disabled="${this.disablePrintButton}">
        <a11y-media-button
          id="download"
          controls="transcript"
          icon="${this._getLocal('download','icon')}"
          label="${this._getLocal('download','label')}"
          @click="${this._handleDownloadClick}">
        </a11y-media-button>
        <a11y-media-button
          id="print"
          controls="transcript"
          icon="${this._getLocal('print','icon')}"
          label="${this._getLocal('print','label')}"
          @click="${this._handlePrintClick}">
        </a11y-media-button>
      </div>
    </div>
    <a11y-media-transcript id="transcript" 
      accent-color="${this.accentColor}"
      media-id="${this.id}"
      @transcript-seek="${this._handleTranscriptSeek}"
      .localization="${this.localization}"
      .selected-transcript="${this.__selectedTrack}"
      ?dark="${this.darkTranscript}"
      ?disable-scroll="${this.disableScroll}"
      ?disable-seek="${this.disableSeek}"
      ?disable-interactive="${this.disableInteractive}"
      ?hide-timestamps="${this.hideTimestamps}">
    </a11y-media-transcript>
  </div>
</div>
<paper-toast id="link" 
  duration="5000" 
  text="Copied to clipboard: ${this.shareLink}"
  ?disabled="${!this.linkable}" 
  ?hidden="${!this.linkable}">
  <a11y-media-button
    action="linkable"
    icon="${this._getLocal('closeLink','icon')}"
    label="${this._getLocal('closeLink','label')}"
    @click="${this._handleCloseLink}"
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
    "attribute": "allow-concurrent",
    "type": Boolean
  },
  /**
   * Is it an audio player with no thumbnail?
   */
  "audioNoThumb": {
    "attribute": "audio-no-thumb",
    "type": Boolean
  },
  /**
   * Use dark theme on transcript? Default is false, even when player is dark.
   */
  "darkTranscript": {
    "attribute": "dark-transcript",
    "type": Boolean
  },
  /**
   * crossorigin attribute for <video> and <audio> tags
   */
  "crossorigin": {
    "attribute": "crossorigin",
    "type": String
  },
  /**
   * disable fullscreen option
   */
  "disableFullscreen": {
    "attribute": "disable-fullscreen",
    "type": Boolean
  },
  /**
   * disable interactive mode that makes the transcript clickable
   */
  "disableInteractive": {
    "attribute": "disable-interactive",
    "type": Boolean
  },
  /**
   * Determines if video and transcript are in a flex layout
   */
  "flexLayout": {
    "attribute": "flex-layout",
    "type": Boolean,
    "reflect": true
  },
  /**
   * Is fullscreen mode?
   */
  "fullscreen": {
    "attribute": "fullscreen",
    "type": Boolean
  },
  /**
   * show the FullscreenButton?
   */
  "fullscreenButton": {
    "attribute": "fullscreen-button",
    "type": Boolean,
    "notify": true
  },
  /**
   * Does the player have tracks?
   */
  "hasCaptions": {
    "attribute": "has-captions",
    "type": Boolean
  },
  /**
   * Hide elapsed time?
   */
  "hideElapsedTime": {
    "attribute": "hide-elapsed-time",
    "type": Boolean
  },
  /**
   * show cue's start and end time
   */
  "hideTimestamps": {
    "attribute": "hide-timestamps",
    "type": Boolean
  },
  /**
   * initially hide the transcript?
   */
  "hideTranscript": {
    "attribute": "hide-transcript",
    "type": Boolean,
    "reflect": true
  },
  /**
   * initially hide the transcript?
   */
  "id": {
    "attribute": "id",
    "type": String,
    "reflect": true
  },
  /**
   * The default media caption if none is given.
   */
  "mediaCaption": {
    "attribute": "media-caption",
    "type": String
  },
  /**
   * the language of the media (if different from user interface language)
   */
  "mediaLang": {
    "attribute": "media-lang",
    "type": String
  },
  /**
   * mute/unmute button
   */
  "muteUnmute": {
    "attribute": "mute-unmute",
    "type": Object
  },
  /**
   * The media caption that displays when the page is printed.
   */
  "printCaption": {
    "attribute": "print-caption",
    "type": String
  },
  /**
   * Size of the a11y media element for responsive styling
   */
  "responsiveSize": {
    "attribute": "responsive-size",
    "type": String,
    "notify": true,
    "reflect": true
  },
  /**
   * Has screenfull loaded?
   */
  "screenfullLoaded": {
    "attribute": "screenfull-loaded",
    "type": Boolean,
    "notify": true
  },
  /**
   * Has screenfull loaded?
   */
  "shareLink": {
    "attribute": "share-link",
    "type": String
  },

  /**
   * is YouTube?
   */
  "showCustomCaptions": {
    "attribute": "showCustom-captions",
    "type": Boolean
  },
  /**
   * Optional array ouf sources.
   */
  "sources": {
    "attribute": "sources",
    "type": Array
  },
  /**
   * stacked layout instead of side-by-side?
   */
  "stackedLayout": {
    "attribute": "stacked-layout",
    "type": Boolean
  },
  /**
   * Is the video currently sticky, i.e. it is fixed to the corner when playing but scrolled off screen?
   */
  "sticky": {
    "attribute": "sticky",
    "type": Boolean,
    "reflect": true
  },
  /**
   * When playing but scrolled off screen, to which corner does it "stick":
   * top-left, top-right, bottom-left, bottom-right, or none?
   * Default is "top-right". "None" disables stickiness.
   */
  "stickyCorner": {
    "attribute": "sticky-corner",
    "type": String,
    "reflect": true
  },
  /**
   * Source of optional thumbnail image
   */
  "thumbnailSrc": {
    "attribute": "thumbnail-src",
    "type": String,
    "reflect": true
  },
  /**
   * Optional array ouf tracks.
   */
  "tracks": {
    "attribute": "tracks",
    "type": Array
  },
  /**
   * play/pause button
   */
  "playPause": {
    "attribute": "playPause",
    "type": Object
  },
  /**
   * Notice if the elapsed time changes
   */
  "__elapsed": {
    "type": Number,
    "notify": true
  },
  /**
   * Notice if the video is playing
   */
  "__playing": {
    "type": Boolean,
    "notify": true
  },
  /**
   * Notice if the video is playing
   */
  "__captionHref": {
    "type": String,
    "notify": true
  }
}
;
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
    this.audioNoThumb = this._getAudioNoThumb(false,null);
    this.allowConcurrent = false;
    this.darkTranscript = false;
    this.disableFullscreen = false;
    this.disableInteractive = false;
    this.flexLayout = true;
    this.fullscreen = false;
    this.fullscreenButton = false;
    this.hasCaptions = false;
    this.hideElapsedTime = false;
    this.hideTimestamps = false;
    this.hideTranscript = false;
    this.id = null;
    this.media = this.shadowRoot.getElementById("html5");
    this.mediaCaption = this._getMediaCaption(false,"");
    this.mediaLang = "en";
    this.muteUnmute = this._getMuteUnmute(false);
    this.playPause = this._getPlayPause(false);
    this.printCaption = this._getPrintCaption(false,"");
    this.responsiveSize = "xs";
    this.screenfullLoaded = false;
    this.shareLink = this._getShareLink(0);
    this.showCustomCaptions = false;
    this.sources = [];
    this.stackedLayout = false;
    this.sticky = false;
    this.stickyCorner = "top-right";
    this.tracks = [];
    this.__elapsed = null;
    this.__playing = false;
    this.__captionHref = "";
    this.__playerAttached = true;
    this.test = ifDefined(this.crossorigin);
    window.A11yMediaStateManager.requestAvailability();


    import("@polymer/paper-slider/paper-slider.js");
    import("@polymer/iron-icons/iron-icons.js");
    import("@polymer/iron-icons/av-icons.js");
    import("@lrnwebcomponents/a11y-media-player/lib/a11y-media-play-button.js");
    import("@polymer/paper-toast/paper-toast.js");

    const basePath = this.pathFromUrl(decodeURIComponent(import.meta.url));
    const location = `${basePath}lib/screenfull/dist/screenfull.js`;
    window.ESGlobalBridge.requestAvailability();
    window.ESGlobalBridge.instance.load("screenfullLib", location);
    window.addEventListener(
      "es-bridge-screenfullLib-loaded",
      this._onScreenfullLoaded.bind(this)
    );
  }
    
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "__elapsed") this.shareLink = this._getShareLink(this.__elapsed);
      if (propName === "__playing") this.playPause = this._getPlayPause(this.__playing);
      if (propName === "muted") this.muteUnmute = this._getMuteUnmute(this.muted);
      if (propName === "audioOnly" || propName === "thumbnailSrc") this.audioNoThumb = this._getAudioNoThumb(this.audioOnly,this.thumbnailSrc);
      
      if (
        propName === "standAlone" 
        || propName === "hideTranscript"
        || propName === "audioNoThumb"
        || propName === "stackedLayout"
        ) this.flexLayout = !(this.standAlone || this.hideTranscript || this.audioNoThumb || this.stackedLayout);
      
      if (
        propName === "disableFullscreen" 
        || propName === "audioNoThumb"
        || propName === "screenfullLoaded"
        ) this.fullscreenButton = this._getFullscreenButton(this.disableFullscreen,this.audioNoThumb);
    
      if (
        propName === "audioOnly" 
        || propName === "localization"
        || propName === "mediaTitle"
        ) this.mediaCaption = this._getMediaCaption(this.audioOnly,this.mediaTitle);
      
      if (
        propName === "audioOnly" 
        || propName === "localization"
        || propName === "mediaTitle"
        ) this.printCaption = this._getPrintCaption(this.audioOnly,this.mediaTitle);
      
      if (
        propName === "isYoutube" 
        || propName === "audioOnly"
        || propName === "hasCaptions"
        ) this.showCustomCaptions = (this.isYoutube || this.audioOnly) && this.hasCaptions && this.cc;
      
    });
  }

  adoptedCallback(){
    super.adoptedCallback();
    console.log(this,this.parentNode,this.host);

    let root = this,
      aspect = 16 / 9;
    this._addResponsiveUtility();
    if (this.id === null) this.id = "a11y-media-player" + Date.now();
    window.dispatchEvent(new CustomEvent("a11y-player", { detail: this }));
    if (this.isYoutube) this._youTubeRequest();
    if (typeof screenfull === "object") this._onScreenfullLoaded.bind(this);
    this.__playerReady = true;
    this.target = this.shadowRoot.getElementById("transcript");
    this.__status = this._getLocal("loading", "label");
    this.__slider = this.shadowRoot.getElementById("slider");
    this.__slider.min = 0;
    this.__volume = root.muted ? 0 : Math.max(this.volume, 10);
    this.__resumePlaying = false;
    this.__duration = 0;
    this.width = this.width !== null ? this.width : "100%";
    this.style.maxWidth = this.width !== null ? this.width : "100%";
    this._setPlayerHeight(aspect);
    if (this.isYoutube) {
      this._youTubeRequest();
      document.addEventListener("timeupdate", e => {
        if (e.detail === root.media) root._handleTimeUpdate(e);
      });
    } else {
      this.media.media.addEventListener("timeupdate", e => {
        root._handleTimeUpdate(e);
      });
      this._addSourcesAndTracks();
    }
    this.shadowRoot
      .getElementById("transcript")
      .setMedia(this.shadowRoot.getElementById("innerplayer"));
  }

  /**
   * plays the media
   */
  play() {
    if (this.isYoutube && !this.__ytAppended) {
      ytInit();
    } else {
      this.__playing = true;
      this.media.play();
      window.dispatchEvent(new CustomEvent("a11y-player-playing", { detail: this }));
    }
  }

  /**
   * pauses the media
   */
  pause() {
    this.__playing = false;
    this.media.pause();
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
    this.shadowRoot.getElementById("html5").selectTrack(index);
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
    this.shadowRoot.getElementById("html5").setCC(this.cc);
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
      this.shadowRoot.getElementById("transcript") !== undefined &&
      this.shadowRoot.getElementById("transcript") !== null
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
        root.shadowRoot.getElementById("html5").media.appendChild(el);
      }
    }
  }

  /**
   * sets the height of the player
   * @param {Number} the aspect ratio of the media or its poster thumbnail
   */
  _setPlayerHeight(aspect) {
    this.shadowRoot.getElementById("player").style.height = "unset";
    if (this.audioOnly && this.thumbnailSrc === null && this.height === null) {
      this.shadowRoot.getElementById("player").style.height = "60px";
    } else if (this.height === null) {
      this.shadowRoot.getElementById("player").style.paddingTop =
        100 / aspect + "%";
        this.shadowRoot.getElementById("innerplayer").style.maxWidth =
        "calc(" + aspect * 100 + "vh - " + aspect * 80 + "px)";
    } else {
      this.shadowRoot.getElementById("outerplayer").style.height = this.height;
    }
  }

  /**
   * gets media caption
   *
   * @param {boolean} Is the player set to audio-only?
   * @param {string} the title of the media
   * @returns {string} the media caption
   */
  _getMediaCaption(audioOnly, mediaTitle) {
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
   * @param {string} the title of the media
   * @returns {string} the media caption when the page is printed
   */
  _getPrintCaption(audioOnly,mediaTitle) {
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
      : undefined;
  }

  /**
   * loads a track's cue metadata
   */
  _addSourcesAndTracks() {
    let root = this,
      counter = 0;
    this.audioOnly = this.audioOnly || this.querySelector("audio") !== null;
    this.querySelectorAll("source,track").forEach(node => {
      if (!this.__captionHref && node.tagName === "SOURCE")
      this.__captionHref = node.getAttribute("src");
      this.shadowRoot.getElementById("html5").media.appendChild(node);
    });
    this._appendToPlayer(root.tracks, "track");
    this._appendToPlayer(root.sources, "source");
    this.shadowRoot.getElementById("html5").media.textTracks.onaddtrack = e => {
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
      selected = track.default === true || this.__selectedTrack === undefined,
      loadCueData;
    if (selected) this.selectTrack(id);
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
            start: this._getHHMMSS(
              track.cues[key].startTime,
              this.media.duration
            ),
            end: this._getHHMMSS(track.cues[key].endTime, this.media.duration),
            text: track.cues[key].text
          };
        });

        if (this.__tracks === undefined) this.__tracks = [];
        this.push("__tracks", {
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
        this.shadowRoot.getElementById("controls").setTracks(this.__tracks);
        this.shadowRoot.getElementById("transcript").setTracks(this.__tracks);
        this.push("__tracks");
        track.oncuechange = e => {
          root.shadowRoot.getElementById("transcript").setActiveCues(
            Object.keys(e.currentTarget.activeCues).map(key => e.currentTarget.activeCues[key].id)
          );
        };
      }
    }, 1);
  }
  /**
   * handles closing the share link toast
   */
  _handleCloseLink() {
    if(this.shadowRoot.getElementById("link") && this.shadowRoot.getElementById("link").close) this.shadowRoot.getElementById("link").close();
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
    this.shadowRoot.getElementById("link").open();
  }

  /**
   * handles the seek function when a transcript cue is activated
   */
  _handleTranscriptSeek(e) {
    if (
      !this.standAlone &&
      this.shadowRoot.getElementById("transcript") !== undefined &&
      this.shadowRoot.getElementById("transcript") !== null
    ) {
      this.__resumePlaying = this.__playing;
      this.seek(e.detail);
    }
  }

  /**
   * handles media metadata when media is loaded
   */
  _handleMediaLoaded(e) {
    let anchor = window.AnchorBehaviors,
      target = anchor.getTarget(this),
      params = anchor.params,
      aspect = this.media.aspectRatio;
      this._setPlayerHeight(aspect);
      this.shadowRoot.getElementById("playbutton").removeAttribute("disabled");

    // gets and converts video duration
    this._setElapsedTime();
    this._getTrackData(this.shadowRoot.getElementById("html5").media);

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
    this.dispatchEvent(
      new CustomEvent("printing-transcript", { detail: this })
    );
    this.shadowRoot.getElementById("transcript").print(this.mediaTitle);
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
    this.seek(this.shadowRoot.getElementById("slider").immediateValue);
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
    //if play exceeds clip length, stop
    if (this.isYoutube && this.media.duration !== this.media.getDuration()) {
      this.__duration = this.media.duration = this.media.getDuration();
      this.disableSeek = false;
      this._addSourcesAndTracks();
      if (
        this.media.seekable &&
        this.media.seekable.length > 0 &&
        this.media.seekable.start(0) !== 0
      ) {
        this.shadowRoot.getElementById("slider").min = this.media.seekable.start(0);
      }
    }
    if (
      this.media.seekable !== undefined &&
      this.media.seekable.length > 0 &&
      this.media.seekable.end(0) <= this.media.getCurrentTime()
    ) {
      this.stop();
      this.__playing = false;
    }
    //prevent slider and cue updates until finished seeking
    this._updateCustomTracks();
    this._setElapsedTime();
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
      this.rewind();
    } else if (action === "captions") {
      this.toggleCC();
    } else if (action === "transcript" || action === "transcript-toggle") {
      this.toggleTranscript();
    } else if (e.detail.id === "tracks") {
      if (e.detail.value === "") {
        this.toggleCC(false);
      } else {
        this.toggleCC(true);
        this.selectTrack(e.detail.value);
      }
    } else if (action === "forward") {
      this.forward();
    } else if (action === "fullscreen" && this.fullscreenButton) {
      this.toggleTranscript(this.fullscreen);
      screenfull.toggle(this.shadowRoot.getElementById("outerplayer"));
    } else if (action === "loop") {
      this.toggleLoop();
    } else if (action === "mute" || action === "unmute") {
      this.toggleMute();
    } else if (action === "pause") {
      this.pause();
    } else if (action === "play") {
      this.play();
    } else if (action === "restart") {
      this.seek(0);
      this.play();
    } else if (action === "speed") {
      this.setPlaybackRate(e.detail.value);
    } else if (action === "volume") {
      this.setVolume(e.detail.value);
    } else if (action === "linkable") {
      this._handleCopyLink();
    }
  }

  /**
   * sets the element's screenfullLoaded variable to true once screenfull is loaded
   * and adds an event listener for screenfull
   */
  _onScreenfullLoaded() {
    let root = this;
    this.screenfullLoaded = true;

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
          ? this.shadowRoot.getElementById("slider").immediateValue
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
    this.disableSeek = true;
    if (this.__playerAttached && this.__playerReady) {
      let ytInit = () => {
          // once metadata is ready on video set it on the media player
          // initialize the YouTube player
          this.media = ytUtil.initYoutubePlayer({
            width: "100%",
            height: "100%",
            videoId: this.youtubeId
          });
          this.__status = this._getLocal("youTubeLoading", "label");
          // move the YouTube iframe to the media player's YouTube container
          this.shadowRoot.getElementById("youtube").appendChild(this.media.a);
          this.__ytAppended = true;
          this._updateCustomTracks();
        },
        checkApi = e => {
          if (ytUtil.apiReady) {
            window.removeEventListener("youtube-api-ready", checkApi);
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
        window.addEventListener("youtube-api-ready", checkApi);
      }
    }
  }

  /**
   * updates custom tracks for youTube
   */
  _updateCustomTracks() {
    if ((this.isYoutube || this.audioOnly) && this.__tracks) {
      let track =
        this.__tracks[
          this.shadowRoot.getElementById("transcript").selectedTranscript
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
            track.cues[i].seek < this.__elapsed &&
            track.cues[i].seekEnd > this.__elapsed
          ) {
            active.push(track.cues[i].order);
            caption = caption === "" ? track.cues[i].text : caption;
          }
        }
        this.shadowRoot.getElementById("customcctxt").innerText = caption;
        this.shadowRoot.getElementById("transcript").setActiveCues(active);
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

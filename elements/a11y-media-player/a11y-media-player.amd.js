define(["exports","meta","require","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@polymer/polymer/lib/utils/render-status.js","./lib/a11y-media-behaviors.js","./node_modules/@polymer/polymer/lib/utils/resolve-url.js","./node_modules/@lrnwebcomponents/es-global-bridge/es-global-bridge.js","./lib/a11y-media-state-manager.js","./lib/a11y-media-controls.js","./lib/a11y-media-html5.js","./lib/a11y-media-transcript.js","./lib/a11y-media-transcript-controls.js","./lib/a11y-media-youtube.js"],function(_exports,meta,_require,_polymerElement,_renderStatus,_a11yMediaBehaviors,_resolveUrl,_esGlobalBridge,_a11yMediaStateManager,_a11yMediaControls,_a11yMediaHtml,_a11yMediaTranscript,_a11yMediaTranscriptControls,_a11yMediaYoutube){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.A11yMediaPlayer=void 0;meta=babelHelpers.interopRequireWildcard(meta);_require=babelHelpers.interopRequireWildcard(_require);function _templateObject_f820369081c211e99dac0f03cca07fc9(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>\n:host {\n  display: block;\n  width: calc(100% - 2px);\n  border: 1px solid var(--simple-colors-default-theme-grey-3);\n  --a11y-media-color: var(--simple-colors-default-theme-grey-11);\n  --a11y-media-bg-color: var(--simple-colors-default-theme-grey-2);\n  --a11y-media-hover-color: var(--simple-colors-default-theme-grey-12);\n  --a11y-media-hover-bg-color: var(--simple-colors-default-theme-grey-2);\n  --a11y-media-accent-color: var(--simple-colors-default-theme-accent-9);\n  --a11y-media-faded-accent-color: var(--simple-colors-default-theme-accent-8);\n\n  \n  --a11y-media-settings-menu-color: var(--a11y-media-color);\n  --a11y-media-settings-menu-bg-color: var(--a11y-media-bg-color);\n  --a11y-media-settings-menu-hover-color: var(--a11y-media-hover-color);\n  --a11y-media-settings-menu-hover-bg-color: var(--a11y-media-hover-bg-color);\n\n  \n  --a11y-media-button-color: var(--a11y-media-color);\n  --a11y-media-button-bg-color: var(--a11y-media-bg-color);\n  --a11y-media-button-hover-color: var(--a11y-media-accent-color);\n  --a11y-media-button-hover-bg-color: var(--a11y-media-hover-bg-color);\n  --a11y-media-button-toggle-color: var(--a11y-media-faded-accent-color);\n\n  \n  --paper-toggle-button-unchecked-bar-color: var(--a11y-media-color);\n  --paper-toggle-button-unchecked-button-color: var(--a11y-media-color);\n  --paper-toggle-button-checked-bar-color: var(--a11y-media-accent-color);\n  --paper-toggle-button-checked-button-color: var(--a11y-media-accent-color);\n\n  \n  --paper-slider-active-color: var(--a11y-media-accent-color);\n  --paper-slider-secondary-color: var(--a11y-media-faded-accent-color);\n  --paper-slider-pin-color: var(--a11y-media-faded-bg-color);\n  --paper-slider-pin-start-color: var(--a11y-media-faded-bg-color);\n  --paper-slider-pin-end-color: var(--a11y-media-faded-bg-color);\n  --paper-slider-knob-color: var(--a11y-media-accent-color);\n  --paper-slider-knob-start-color: var(--a11y-media-bg-color);\n  --paper-slider-knob-end-color: var(--a11y-media-bg-color);\n  --paper-slider-knob-border-color: var(--a11y-media-accent-color);\n  --paper-slider-knob-start-border-color: var(--a11y-media-bg-color);\n  --paper-slider-knob-end-border-color: var(--a11y-media-bg-color);\n  \n  \n  --a11y-media-transcript-color: var(--simple-colors-default-theme-grey-7);\n  --a11y-media-transcript-bg-color: var(--simple-colors-default-theme-grey-1);\n  --a11y-media-transcript-accent-color: var(--simple-colors-default-theme-accent-8);\n  --a11y-media-transcript-faded-accent-color: var(--simple-colors-default-theme-accent-10);\n  --a11y-media-transcript-cue-color: var(--simple-colors-fixed-theme-grey-12);\n  --a11y-media-transcript-cue-bg-color: var(--simple-colors-fixed-theme-grey-1);\n  --a11y-media-transcript-active-cue-color: var(--simple-colors-fixed-theme-grey-12);\n  --a11y-media-transcript-active-cue-bg-color: var(--simple-colors-fixed-theme-accent-1);\n  --a11y-media-transcript-focused-cue-color: var(--simple-colors-fixed-theme-grey-12);\n  --a11y-media-transcript-focused-cue-bg-color: var(--simple-colors-fixed-theme-grey-2);\n  --a11y-media-transcript-match-color: var(--simple-colors-fixed-theme-grey-1);\n  --a11y-media-transcript-match-bg-color: var(--simple-colors-fixed-theme-accent-10);\n  --a11y-media-transcript-match-border-color: var(--simple-colors-fixed-theme-accent-12);\n}\n:host([dark]) {\n  border: 1px solid var(--simple-colors-default-theme-grey-1);\n}\n:host([dark-transcript]) {\n  --a11y-media-transcript-bg-color: var(--simple-colors-dark-theme-grey-1);\n  --a11y-media-transcript-cue-color: var(--simple-colors-dark-theme-grey-12);\n  --a11y-media-transcript-cue-bg-color: var(--simple-colors-dark-theme-grey-1);\n  --a11y-media-transcript-active-cue-color: var(--simple-colors-dark-theme-accent-10);\n  --a11y-media-transcript-active-cue-bg-color: var(--simple-colors-dark-theme-grey-1);\n  --a11y-media-transcript-match-color: var(--simple-colors-dark-theme-grey-1);\n  --a11y-media-transcript-match-bg-color: var(--simple-colors-dark-theme-accent-10);\n  --a11y-media-transcript-match-border-color: var(--simple-colors-dark-theme-accent-12);\n  --a11y-media-transcript-focused-cue-color: var(--simple-colors-dark-theme-grey-12);\n  --a11y-media-transcript-focused-cue-bg-color: var(--simple-colors-dark-theme-grey-2);\n}\n:host,\n:host #outerplayer {\n  color: var(--simple-colors-default-theme-grey-12);\n  background-color: var(--simple-colors-default-theme-grey-2);\n}\n:host > * {\n  transition: all 0.5s;\n}\n:host,\n:host #outerplayer,\n:host #player,\n:host #outertranscript,\n:host #innertranscript {\n  display: flex;\n  flex-flow: column;\n  align-items: stretch;\n  align-content: stretch;\n} \n:host #innerplayer {\n  display: flex;\n}\n:host([hidden]),\n:host *[hidden] {\n  display: none !important;\n}\n:host #innerplayer,\n:host #player, \n:host #player > *,\n:host #customcc,\n:host #customcctxt,\n:host #slider,\n:host #controls,\n:host #outertranscript,\n:host #innertranscript {\n  width: 100%;\n}\n:host #innertranscript > * {\n  width: calc(100% - 1px);\n}\n:host > *,\n:host #innerplayer,\n:host #player,\n:host #player > *,\n:host #customcctxt {\n  flex: 1 1 auto;\n}\n:host #controls,\n:host #tcontrols {\n  flex: 0 0 44px;\n}\n:host #innerplayer {\n  margin: 0 auto;\n}\n:host #player {\n  position: relative;\n}\n:host #player > * {\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 100%;\n}\n:host #playbutton,\n:host #slider,\n:host #controls {\n  z-index: 2;\n}\n:host([audio-only]) #playbutton {\n  opacity: 0;\n}\n:host #slider {\n  flex: 0 0 32px;\n  height: 32px;\n}\n:host([thumbnail-src]) #youtube {\n  opacity: 0;\n}\n:host #youtube[elapsed] {\n  opacity: 1;\n  transition: opacity 0.5s;\n}\n:host #customcc:not([hidden]) {\n  font-size: 20px;\n  transition: font-size 0.25s;\n  display: flex;\n}\n:host #customcctxt:not(:empty) {\n  align-self: flex-end;\n  font-family: sans-serif;\n  color: white;\n  margin: 4px 10px;\n  padding: 0.15em 4px;\n  background-color: black;\n  background-color: rgba(0, 0, 0, 0.8);\n  transition: all 0.5s;\n}\n:host([audio-only]:not([thumbnail-src])) #customcctxt {\n  align-self: center;\n  color: var(--a11y-media-color);\n  background-color: transparent;\n}\n:host #printthumb {\n  width: 100%;\n  margin: 0;\n  display: block;\n  border-top: 1px solid #aaaaaa;\n}\n:host .media-caption:not(:empty) {\n  width: calc(100% - 30px);\n  padding: 5px 15px;\n}\n:host .media-type {\n  font-style: italic;\n}\n:host #outertranscript {\n  padding: 0 1px 0 0;\n}\n:host #innertranscript {\n  flex: 1 0 194px;\n}\n:host #transcript {\n  flex: 1 0 150px;\n  overflow-y: scroll;\n}\n:host .sr-only {\n  position: absolute;\n  left: -9999px;\n  font-size: 0;\n  height: 0;\n  width: 0;\n  overflow: hidden;\n}\n@media screen {\n  :host([flex-layout]:not([responsive-size=\"xs\"])) {\n    flex-flow: row;\n    padding: 0;\n  }\n  :host([flex-layout]:not([responsive-size=\"xs\"])) #outerplayer {\n    flex: 1 0 auto;\n  }\n  :host #printthumb,\n  :host([height]) #outertranscript,\n  :host([stand-alone]) #outertranscript,\n  :host([hide-transcript]) #outertranscript {\n    display: none;\n  }\n  :host([sticky]:not([sticky-corner=\"none\"])) #outerplayer {\n    position: fixed;\n    top: 5px;\n    right: 5px;\n    width: 200px;\n    max-width: 200px;\n    z-index: 999999;\n    border: 1px solid var(--a11y-media-bg-color);\n    box-shadow: 1px 1px 20px 1px rgba(125, 125, 125);\n    border-radius: 3.2px;\n  }\n  :host([dark][sticky]:not([sticky-corner=\"none\"])) #outerplayer {\n    border: 1px solid var(--a11y-media-bg-color);\n  }\n  :host([sticky][sticky-corner=\"top-left\"]) #outerplayer {\n    right: unset;\n    left: 5px;\n  }\n  :host([flex-layout]:not([responsive-size=\"xs\"])) > div {\n    width: 50%;\n    flex: 1 1 auto;\n  }\n  :host #innertranscript {\n    position: relative;\n  }\n  :host([hide-transcript]) #outerplayer {\n    min-width: 50%;\n    max-width: 100%;\n  }\n  :host([hide-transcript]) #outertranscript {\n    display: none;\n  }\n  :host(:not([no-height]):not([stacked-layout]):not([responsive-size=\"xs\"]))\n    #transcript {\n    position: absolute;\n    top: 44px;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    overflow-y: scroll;\n  }\n  :host(:not([no-height]):not([stacked-layout]):not([responsive-size=\"xs\"]))\n    #innerplayer.totop {\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 200px !important;\n    z-index: 9999;\n  }\n  :host([sticky][sticky-corner=\"bottom-left\"]) #innerplayer {\n    top: unset;\n    right: unset;\n    bottom: 5px;\n  }\n  :host([sticky][sticky-corner=\"bottom-right\"]) #innerplayer {\n    top: unset;\n    bottom: 5px;\n  }\n  :host([sticky]:not([sticky-corner=\"none\"]):not([no-height]):not([stacked-layout]):not([responsive-size=\"xs\"]))\n    #controls {\n    display: none;\n  }\n  :host([responsive-size=\"lg\"]) #customcc {\n    font-size: 16px;\n  }\n  :host([responsive-size=\"md\"]) #customcc,\n  :host([flex-layout][responsive-size=\"xl\"]) #customcc {\n    font-size: 14px;\n  }\n  :host([responsive-size=\"sm\"]) #customcc,\n  :host([flex-layout][responsive-size=\"lg\"]) #customcc {\n    font-size: 12px;\n  }\n  :host([responsive-size=\"xs\"]) #customcc,\n  :host([flex-layout][responsive-size=\"md\"]) #customcc,\n  :host([flex-layout][responsive-size=\"sm\"]) #customcc {\n    font-size: 10px;\n  }\n  :host([sticky]:not([sticky-corner=\"none\"])) #customcc {\n    display: none;\n  }\n  :host .media-caption {\n    color: var(--a11y-media-bg-color);\n    background-color: var(--a11y-media-accent-color);\n  }\n  :host #audio-only {\n    text-align: center;\n    font-style: italic;\n    width: 100%;\n    line-height: 160%;\n  }\n  :host .print-only {\n    display: none;\n  }\n}\n\n@media print {\n  :host,\n  :host([dark]) {\n    outline: 1px solid #aaaaaa;\n    background-color: #ffffff;\n  }\n  :host .screen-only,\n  :host #printthumb:not([src]),\n  :host(:not([thumbnail-src])) #player {\n    display: none;\n  }\n  :host #searchbar {\n    display: none;\n  }\n  :host .media-caption {\n    background-color: #cccccc;\n    color: #000000;\n    font-size: 120%;\n  }\n}</style>\n<div class=\"sr-only\">[[mediaCaption]]</div>\n  <div id=\"outerplayer\">\n    <div id=\"innerplayer\">\n      <div id=\"player\"\n        style$=\"[[_getThumbnailCSS(thumbnailSrc,isYoutube,audioOnly)]]\">\n        <a11y-media-play-button\n          id=\"playbutton\"\n          action$=\"[[playPause.action]]\"\n          audio-only$=\"[[audioOnly]]\"\n          disabled=\"true\"\n          elapsed$=\"[[_hidePlayButton(thumbnailSrc, isYoutube, __elapsed)]]\"\n          hidden$=\"[[audioNoThumb]]\"\n          disabled$=\"[[audioNoThumb]]\"\n          on-controls-change=\"_onControlsChanged\"\n          localization$=\"[[localization]]\">\n        </a11y-media-play-button>\n        <a11y-media-html5\n          id=\"html5\"\n          audio-only$=\"[[audioOnly]]\"\n          autoplay$=\"[[autoplay]]\"\n          cc$=\"[[cc]]\"\n          crossorigin$=\"[[crossorigin]]\"\n          hidden$=\"[[isYoutube]]\"\n          media-lang$=\"[[mediaLang]]\"\n          loop$=\"[[loop]]\"\n          muted$=\"[[muted]]\"\n          manifest$=\"[[manifest]]\"\n          on-media-loaded=\"_handleMediaLoaded\"\n          ontimeupdate=\"_handleTimeUpdate\"\n          playing$=\"[[__playing]]\"\n          playback-rate$=\"[[playbackRate]]\"\n          thumbnail-src$=\"[[thumbnailSrc]]\"\n          preload$=\"[[preload]]\"\n          volume$=\"[[volume]]\"\n        >\n          <slot></slot>\n        </a11y-media-html5>\n        <div id=\"youtube\" \n          elapsed$=\"[[__elapsed]]\" \n          lang$=\"[[mediaLang]]\"\n          video-id$=\"[[videoId]]\">\n        </div>\n        <div id=\"customcc\" \n          aria-live=\"polite\"\n          class=\"screen-only\" \n          hidden$=\"[[!showCustomCaptions]]\">\n          <div id=\"customcctxt\"></div>\n        </div>\n      </div>\n    </div>\n    <paper-slider id=\"slider\"\n      class=\"screen-only\"\n      disabled$=\"[[disableSeek]]\"\n      label$=\"[[seekSlider.label]]\"\n      min=\"0\"\n      max=\"[[__duration]]\"\n      on-mousedown=\"_handleSliderStart\"\n      on-mouseup=\"_handleSliderStop\"\n      on-keyup=\"_handleSliderStop\"\n      on-keydown=\"_handleSliderStart\"\n      on-blur=\"_handleSliderStop\"\n      secondary-progress=\"[[__buffered]]\"\n      value=\"[[__elapsed]]\"\n    >\n    </paper-slider>\n    <a11y-media-controls id=\"controls\"\n      cc$=\"[[cc]]\"\n      disable-seek$=\"[[disableSeek]]\"\n      fixed-height$=\"[[height]]\"\n      fullscreen$=\"[[fullscreen]]\"\n      fullscreen-button$=\"[[fullscreenButton]]\"\n      has-captions$=\"[[hasCaptions]]\"\n      has-transcript$=\"[[hasTranscript]]\"\n      hide-transcript$=\"[[hideTranscript]]\"\n      mute-unmute=\"[[muteUnmute]]\"\n      on-controls-change=\"_onControlsChanged\"\n      on-print-transcript=\"_handlePrinting\"\n      on-download-transcript=\"_handleDownload\"\n      responsive-size$=\"[[responsiveSize]]\"\n      play-pause=\"[[playPause]]\"\n      stand-alone$=\"[[standAlone]]\"\n      volume=\"[[__volume]]\">\n    </a11y-media-controls>\n    <div\n      aria-hidden=\"true\"\n      class=\"screen-only media-caption\"\n      hidden$=\"[[!_hasAttribute(mediaCaption)]]\">\n      [[mediaCaption]]\n    </div>\n    <div class=\"print-only media-caption\">[[printCaption]]</div>\n  </div>\n  <img id=\"printthumb\" aria-hidden=\"true\" src$=\"[[thumbnailSrc]]\" />\n  <div id=\"outertranscript\" hidden$=\"[[standAlone]]\">\n    <div id=\"innertranscript\" hidden$=\"[[hideTranscript]]\">\n      <a11y-media-transcript-controls id=\"tcontrols\"\n        accent-color$=\"[[accentColor]]\"\n        localization$=\"[[localization]]\"\n        dark$=\"[[darkTranscript]]\"\n        disable-print-button$=\"[[disablePrintButton]]\"\n        disable-scroll$=\"[[disableScroll]]\"\n        disable-search$=\"[[disableSearch]]\"\n        has-transcript$=\"[[hasTranscript]]\"\n        localization$=\"[[localization]]\"\n        on-searchbar-added=\"_handleSearchAdded\"\n        on-toggle-scroll=\"_handleTranscriptScrollToggle\"\n        on-print-transcript=\"_handlePrinting\"\n        on-download-transcript=\"_handleDownload\"\n        stand-alone$=\"[[standAlone]]\">\n      </a11y-media-transcript-controls>\n      <a11y-media-transcript id=\"transcript\" \n        accent-color$=\"[[accentColor]]\"\n        dark$=\"[[darkTranscript]]\"\n        disable-scroll$=\"[[disableScroll]]\"\n        disable-search$=\"[[disableSearch]]\"\n        disable-seek$=\"[[disableSeek]]\"\n        disable-interactive$=\"[[disableInteractive]]\"\n        hide-timestamps$=\"[[hideTimestamps]]\"\n        media-id$=\"[[id]]\"\n        on-transcript-seek=\"_handleTranscriptSeek\"\n        localization$=\"[[localization]]\"\n        search=\"[[search]]\"\n        selected-transcript$=\"[[__selectedTrack]]\">\n      </a11y-media-transcript>\n    </div>\n  </div>"]);_templateObject_f820369081c211e99dac0f03cca07fc9=function _templateObject_f820369081c211e99dac0f03cca07fc9(){return data};return data}/**
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
 */var A11yMediaPlayer=/*#__PURE__*/function(_A11yMediaBehaviors){babelHelpers.inherits(A11yMediaPlayer,_A11yMediaBehaviors);babelHelpers.createClass(A11yMediaPlayer,null,[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_f820369081c211e99dac0f03cca07fc9())}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{/**
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
   */__playing:{name:"__playing",type:"Boolean",value:!1,notify:!0,reflectToAttribute:!0}}}}]);function A11yMediaPlayer(){var _this;babelHelpers.classCallCheck(this,A11yMediaPlayer);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(A11yMediaPlayer).call(this));new Promise(function(res,rej){return _require.default(["./node_modules/@polymer/paper-slider/paper-slider.js"],res,rej)});new Promise(function(res,rej){return _require.default(["./node_modules/@polymer/iron-icons/iron-icons.js"],res,rej)});new Promise(function(res,rej){return _require.default(["./node_modules/@polymer/iron-icons/av-icons.js"],res,rej)});new Promise(function(res,rej){return _require.default(["./node_modules/@lrnwebcomponents/a11y-media-player/lib/a11y-media-play-button.js"],res,rej)});var basePath=(0,_resolveUrl.pathFromUrl)(decodeURIComponent(meta.url)),location="".concat(basePath,"lib/screenfull/dist/screenfull.js");window.ESGlobalBridge.requestAvailability();window.ESGlobalBridge.instance.load("screenfullLib",location);window.addEventListener("es-bridge-screenfullLib-loaded",_this._onScreenfullLoaded.bind(babelHelpers.assertThisInitialized(_this)));_this.__playerAttached=!0;window.A11yMediaStateManager.requestAvailability();return _this}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */babelHelpers.createClass(A11yMediaPlayer,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(A11yMediaPlayer.prototype),"connectedCallback",this).call(this);this._addResponsiveUtility();window.dispatchEvent(new CustomEvent("a11y-player",{detail:this}));if(this.isYoutube){this._youTubeRequest()}}/**
   * sets initial values and loads video or youtube iframe
   */},{key:"ready",value:function ready(){babelHelpers.get(babelHelpers.getPrototypeOf(A11yMediaPlayer.prototype),"ready",this).call(this);var root=this,aspect=16/9,tracks=[],tdata=[],selected=0;if("object"===("undefined"===typeof screenfull?"undefined":babelHelpers.typeof(screenfull)))root._onScreenfullLoaded.bind(root);if(null===root.id)root.id="a11y-media-player"+Date.now();root.__playerReady=!0;root.target=root.shadowRoot.querySelector("#transcript");root.__status=root._getLocal("loading","label");root.__slider=root.$.slider;root.__slider.min=0;root.__volume=root.muted?0:Math.max(this.volume,10);root.__resumePlaying=!1;root.__duration=0;root.$.controls.setStatus(root.__status);root.width=null!==root.width?root.width:"100%";root.style.maxWidth=null!==root.width?root.width:"100%";root._setPlayerHeight(aspect);if(root.isYoutube){root._youTubeRequest();document.addEventListener("timeupdate",function(e){if(e.detail===root.media)root._handleTimeUpdate(e)})}else{root.media=root.$.html5;root.media.media.addEventListener("timeupdate",function(e){root._handleTimeUpdate(e)});root._addSourcesAndTracks()}root.$.transcript.setMedia(root.$.innerplayer)}/**
   * plays the media
   */},{key:"play",value:function play(){var root=this,stopped=!(!0===root.__playing);root.__playing=!0;root.media.play();window.dispatchEvent(new CustomEvent("a11y-player-playing",{detail:root}))}/**
   * pauses the media
   */},{key:"pause",value:function pause(){var root=this;root.__playing=!1;root.media.pause()}/**
   * stops the media
   */},{key:"stop",value:function stop(){this.pause();this.seek(0)}/**
   * restarts the media
   */},{key:"restart",value:function restart(){this.seek(0);this.play()}/**
   * seeks media backward at a set increment
   *
   * @param {float} the elepsed time, in seconds
   */},{key:"rewind",value:function rewind(amt){amt=amt!==void 0?amt:this.media.duration/20;this.__resumePlaying=this.__playing;this.seek(this.media.getCurrentTime()-amt,0);if(this.__resumePlaying)this.play();this.__resumePlaying=!1}/**
   * seeks media forward at a set increment
   *
   * @param {float} the elepsed time, in seconds
   */},{key:"forward",value:function forward(amt){amt=amt!==void 0?amt:this.media.duration/20;this.__resumePlaying=this.__playing;this.seek(this.media.getCurrentTime()+amt);if(this.__resumePlaying)this.play();this.__resumePlaying=!1}/**
   * seeks to a specific time
   *
   * @param {float} the time, in seconds, to seek
   */},{key:"seek",value:function seek(time){var seekable=this.media!==void 0&&null!==this.media?this.media.seekable:[];if(0<seekable.length&&time>=seekable.start(0)&&time<=seekable.end(0)){this.media.seek(time)}}/**
   * selects a specific track by index
   *
   * @param {integer} the index of the track
   */},{key:"selectTrack",value:function selectTrack(index){this.__selectedTrack=index;this.$.html5.selectTrack(index)}/**
   * set volume of media
   *
   * @param {integer} the volume level from 0-100
   */},{key:"setVolume",value:function setVolume(value){this.volume=null!==value?value:70;this.media.setVolume(this.volume);this.muted=0===this.volume}/**
   * set speed/playback rate of media
   *
   * @param {float} the playback rate, where 1 = 100%
   */},{key:"setPlaybackRate",value:function setPlaybackRate(value){value=null!==value?value:1;this.media.setPlaybackRate(value)}/**
   * toggles captions
   *
   * @param {boolean} Toggle CC on? `true` is on, `false` is off, and `null` toggles based on current state.
   */},{key:"toggleCC",value:function toggleCC(mode){this.cc=mode===void 0?!this.cc:mode;this.$.html5.setCC(this.cc)}/**
   * toggles looping
   *
   * @param {boolean} Toggle looping on? `true` is on, `false` is off, and `null` toggles based on current state.
   */},{key:"toggleLoop",value:function toggleLoop(mode){if(this.isYoutube){}else{this.loop=mode===void 0?!this.loop:mode;this.media.setLoop(this.loop)}}/**
   * toggles mute
   *
   * @param {boolean} Toggle mute on? `true` is on, `false` is off, and `null` toggles based on current state.
   */},{key:"toggleMute",value:function toggleMute(mode){this.muted=mode===void 0?!this.muted:mode;this.__volume=this.muted?0:Math.max(this.volume,10);this.media.setMute(this.muted)}/**
   * toggles sticky attribute
   *
   * @param {boolean} Toggle sticky mode on? `true` is on, `false` is off, and `null` toggles based on current state.
   */},{key:"toggleSticky",value:function toggleSticky(mode){mode=mode===void 0?!this.sticky:mode;this.sticky=mode;this.dispatchEvent(new CustomEvent("player-sticky",{detail:this}))}/**
   * toggles transcript
   *
   * @param {boolean} Toggle transcript on? `true` is on, `false` is off, and `null` toggles based on current state.
   */},{key:"toggleTranscript",value:function toggleTranscript(mode){mode=mode===void 0?this.hideTranscript:mode;this.hideTranscript=!mode;if(this.$.transcript!==void 0&&null!==this.$.transcript){this.dispatchEvent(new CustomEvent("transcript-toggle",{detail:this}))}}/**
   * dynamically adds source and track data
   * from the sources and tracks properties
   * (needed for media-player)
   */},{key:"_appendToPlayer",value:function _appendToPlayer(data,type){if(data!==void 0&&null!==data&&[]!==data){for(var root=this,arr=Array.isArray(data)?data:JSON.parse(data),i=0,el;i<arr.length;i++){el=document.createElement(type);for(var key in arr[i]){el.setAttribute(key,arr[i][key])}root.$.html5.media.appendChild(el)}}}/**
   * sets the height of the player
   * @param {Number} the aspect ratio of the media or its poster thumbnail
   */},{key:"_setPlayerHeight",value:function _setPlayerHeight(aspect){var root=this;if(root.audioOnly&&null===root.thumbnailSrc&&null===root.height){root.$.player.style.height="60px"}else if(null===root.height){root.$.player.style.paddingTop=100/aspect+"%";root.$.innerplayer.style.maxWidth="calc("+100*aspect+"vh - "+80*aspect+"px)"}else{root.$.outerplayer.style.height=root.height}}/**
   * gets media caption
   *
   * @param {boolean} Is the player set to audio-only?
   * @param {string} the text that indicates this player is audio-only
   * @param {string} the title of the media
   * @returns {string} the media caption
   */},{key:"_getMediaCaption",value:function _getMediaCaption(audioOnly,localization,mediaTitle){var audioLabel=this._getLocal("audio","label"),hasMediaTitle=mediaTitle!==void 0&&null!==mediaTitle&&""!==mediaTitle;if(audioOnly&&hasMediaTitle){return mediaTitle+" ("+audioLabel+")"}else if(audioOnly){return audioLabel}else if(hasMediaTitle){return mediaTitle}else{return null}}/**
   * set play/pause button
   *
   * @param {boolean} Is the media muted?
   * @param {string} label if button mutes media
   * @param {string} icon if button mutes media
   * @param {string} label if button unmutes media
   * @param {string} icon if button unmutes media
   * @returns {object} an object containing the current state of the play/pause button, eg., `{"label": "mute", "icon": "av:volume-off"}`
   */},{key:"_getMuteUnmute",value:function _getMuteUnmute(muted){return muted?{label:this._getLocal("unmute","label"),icon:this._getLocal("unmute","icon"),action:"unmute"}:{label:this._getLocal("mute","label"),icon:this._getLocal("mute","icon"),action:"mute"}}/**
   * gets print caption
   *
   * @param {boolean} Is the player set to audio-only?
   * @param {string} the text that indicates this player is audio-only
   * @param {string} the text that indicates this player is for video
   * @param {string} the title of the media
   * @returns {string} the media caption when the page is printed
   */},{key:"_getPrintCaption",value:function _getPrintCaption(audioOnly,localization,mediaTitle){var audioLabel=this._getLocal("audio","label"),videoLabel=this._getLocal("video","label"),hasMediaTitle=mediaTitle!==void 0&&null!==mediaTitle&&""!==mediaTitle;if(audioOnly&&hasMediaTitle){return mediaTitle+" ("+audioLabel+")"}else if(audioOnly){return audioLabel}else if(hasMediaTitle){return mediaTitle+" ("+videoLabel+")"}else{return videoLabel}}/**
   * get thumbanail css based on whether or not the video is playing
   *
   * @param {string} the url for the thumbnail image
   * @returns {string} the string for the style attribute
   */},{key:"_getThumbnailCSS",value:function _getThumbnailCSS(thumbnailSrc,isYoutube,audioOnly){return null!=thumbnailSrc&&(isYoutube||audioOnly)?"background-image: url("+thumbnailSrc+"); background-size: cover;":null}/**
   * loads a track's cue metadata
   */},{key:"_addSourcesAndTracks",value:function _addSourcesAndTracks(){var root=this,counter=0;root.querySelectorAll("source,track").forEach(function(node){root.$.html5.media.appendChild(node)});root._appendToPlayer(root.tracks,"track");root._appendToPlayer(root.sources,"source");root.$.html5.media.textTracks.onaddtrack=function(e){root.hasCaptions=!0;root.hasTranscript=!root.standAlone;root._getTrackData(e.track,counter++)}}/**
   * returns true if an attribute is set to a value
   *
   * @param {boolean} Is the media audio only?
   * @param {string} optional: the source URL of the thumbnail image
   * @returns {boolean} Should height of video/thumbnail area be set to 0?
   */},{key:"_getAudioNoThumb",value:function _getAudioNoThumb(audioOnly,thumbnailSrc){return audioOnly&&(null===thumbnailSrc||thumbnailSrc===void 0)}/**
   * returns whether or not the fullscreen mode should be disabled
   *
   * @param {boolean} Is fullscreen mode set to disabled?
   * @returns {boolean} Should fullscreen disabled?
   */},{key:"_getFullscreenButton",value:function _getFullscreenButton(disableFullscreen,audioNoThumb,screenfullLoaded){if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)||disableFullscreen||audioNoThumb||!screenfullLoaded){return!1}else{return!0}}/**
   * set play/pause button
   *
   * @param {boolean} Is the media playing?
   * @param {string} label if button pauses media
   * @param {string} icon if button pauses media
   * @param {string} label if button plays media
   * @param {string} icon if button plays media
   * @returns {object} an object containing the current state of the play/pause button, eg., `{"label": "Pause", "icon": "av:pause"}`
   */},{key:"_getPlayPause",value:function _getPlayPause(__playing){return!1!==__playing?{label:this._getLocal("pause","label"),icon:this._getLocal("pause","icon"),action:"pause"}:{label:this._getLocal("play","label"),icon:this._getLocal("play","icon"),action:"play"}}/**
   * loads a track's cue metadata
   */},{key:"_getTrackData",value:function _getTrackData(track,id){var root=this,selected=!0===track.default||root.__selectedTrack===void 0,loadCueData;if(selected)root.selectTrack(id);track.mode=selected&&!0===this.cc?"showing":"hidden";loadCueData=setInterval(function(){if(track.cues!==void 0&&null!==track.cues&&0<track.cues.length){clearInterval(loadCueData);var cues=Object.keys(track.cues).map(function(key){return{order:""!==track.cues[key].id?track.cues[key].id:key,seek:track.cues[key].startTime,seekEnd:track.cues[key].endTime,start:root._getHHMMSS(track.cues[key].startTime,root.media.duration),end:root._getHHMMSS(track.cues[key].endTime,root.media.duration),text:track.cues[key].text}});if(root.__tracks===void 0)root.__tracks=[];root.push("__tracks",{value:id,language:track.language,text:track.label!==void 0?track.label:track.language!==void 0?track.language:"Track "+id,cues:cues});root.$.controls.setTracks(root.__tracks);root.$.transcript.setTracks(root.__tracks);root.push("__tracks");track.oncuechange=function(e){root.$.transcript.setActiveCues(Object.keys(e.currentTarget.activeCues).map(function(key){return e.currentTarget.activeCues[key].id}))}}},1)}/**
   * handles the seek function when a transcript cue is activated
   */},{key:"_handleTranscriptSeek",value:function _handleTranscriptSeek(e){var root=this;if(!root.standAlone&&root.$.transcript!==void 0&&null!==root.$.transcript){root.__resumePlaying=root.__playing;root.seek(e.detail)}}/**
   * handles media metadata when media is loaded
   */},{key:"_handleMediaLoaded",value:function _handleMediaLoaded(e){var root=this,aspect=root.media.aspectRatio;root._setPlayerHeight(aspect);root.$.playbutton.removeAttribute("disabled");// gets and converts video duration
root._setElapsedTime();root._getTrackData(root.$.html5.media)}/**
   * determines if there
   *
   * @param {string} the url for the thumbnail image
   * @returns {string} the string for the style attribute
   */},{key:"_hidePlayButton",value:function _hidePlayButton(thumbnailSrc,isYoutube,__elapsed){return isYoutube&&null===thumbnailSrc||!(__elapsed===void 0||0===__elapsed)}/**
   * handles transcript printing
   */},{key:"_handlePrinting",value:function _handlePrinting(e){var root=this;root.dispatchEvent(new CustomEvent("printing-transcript",{detail:root}));root.$.transcript.print(root.mediaTitle)}/**
   * sets search the simple-search element
   */},{key:"_handleSearchAdded",value:function _handleSearchAdded(e){this.search=e.detail}/**
   * handles duration slider dragging with a mouse
   */},{key:"_handleSliderStart",value:function _handleSliderStart(e){this.__resumePlaying=!this.paused;this.pause();this.__seeking=!0}/**
   * handles duration slider dragging with a mouse
   */},{key:"_handleSliderStop",value:function _handleSliderStop(e){this.seek(this.$.slider.immediateValue);this.__seeking=!1;if(this.__resumePlaying){this.play();this.__resumePlaying=null}}/**
   * handles time updates
   */},{key:"_handleTimeUpdate",value:function _handleTimeUpdate(e){var root=this;//if play exceeds clip length, stop
if(root.isYoutube&&root.media.duration!==root.media.getDuration()){root.__duration=root.media.duration=root.media.getDuration();root.disableSeek=!1;root._addSourcesAndTracks();if(root.media.seekable&&0<root.media.seekable.length&&0!==root.media.seekable.start(0)){root.$.slider.min=root.media.seekable.start(0)}}if(root.media.seekable!==void 0&&0<root.media.seekable.length&&root.media.seekable.end(0)<=root.media.getCurrentTime()){root.stop();root.__playing=!1}//prevent slider and cue updates until finished seeking
root._updateCustomTracks();root._setElapsedTime()}/**
   * handles transcript scroll toggle
   */},{key:"_handleTranscriptScrollToggle",value:function _handleTranscriptScrollToggle(e){this.disableScroll=!this.disableScroll}/**
   * Determines if video and transcript are in a flex layout
   *
   * @param {boolean} Is the player in stand-alone mode?
   * @param {boolean} Is the transcript hidden?
   * @param {boolean} Does the media no video or thumbnail image?
   * @param {boolean} Is the layout stacked?
   * @returns {boolean} Is the video in flex layout mode?
   */},{key:"_isFlexLayout",value:function _isFlexLayout(standAlone,hideTranscript,audioNoThumb,stackedLayout){return!standAlone&&!hideTranscript&&!audioNoThumb&&!stackedLayout}/**
   * determine which button was clicked and act accordingly
   */},{key:"_onControlsChanged",value:function _onControlsChanged(e){var root=this,action=e.detail.action!==void 0?e.detail.action:e.detail.id;if("backward"===action||"rewind"===action){root.rewind()}else if("captions"===action){root.toggleCC()}else if("transcript"===action||"transcript-toggle"===action){root.toggleTranscript()}else if("tracks"===e.detail.id){if(""===e.detail.value){root.toggleCC(!1)}else{root.toggleCC(!0);root.selectTrack(e.detail.value)}}else if("forward"===action){root.forward()}else if("fullscreen"===action&&root.fullscreenButton){root.toggleTranscript(root.fullscreen);screenfull.toggle(root.$.outerplayer)}else if("loop"===action){root.toggleLoop()}else if("mute"===action||"unmute"===action){root.toggleMute()}else if("pause"===action){root.pause()}else if("play"===action){root.play()}else if("restart"===action){root.seek(0);root.play()}else if("speed"===action){root.setPlaybackRate(e.detail.value)}else if("volume"===action){root.setVolume(e.detail.value)}}/**
   * sets the element's screenfullLoaded variable to true once screenfull is loaded
   * and adds an event listener for screenfull
   */},{key:"_onScreenfullLoaded",value:function _onScreenfullLoaded(){var root=this;root.screenfullLoaded=!0;// handles fullscreen
if(screenfull){screenfull.on("change",function(){if(screenfull.enabled)root.fullscreen=screenfull.isFullscreen})}}/**
   * sets duration, taking into consideration start and stop times
   *
   * @param {integer} seek time in seconds, optional
   * @returns {string} status
   */},{key:"_setElapsedTime",value:function _setElapsedTime(){var elapsed=!0===this.__seeking?this.$.slider.immediateValue:0<this.media.getCurrentTime()?this.media.getCurrentTime():0,duration=0<this.media.duration?this.media.duration:0;this.__elapsed=elapsed;this.__duration=duration;if(this.media.seekable!==void 0&&0<this.media.seekable.length){if(this.media.seekable.start(0)!==void 0)elapsed-=this.media.seekable.start(0);if(this.media.seekable.end(0)!==void 0)duration=this.media.seekable.end(0)-(this.media.seekable.start(0)!==void 0?this.media.seekable.start(0):0)}this.__status=this._getHHMMSS(elapsed,duration)+"/"+this._getHHMMSS(duration);this.$.controls.setStatus(this.__status)}/**
   * Show custom CC (for audio and YouTube)?
   *
   * @param {boolean} Is the media from YouTube?
   * @param {boolean} Is the media audio only?
   * @param {boolean} Does the media have CC tracks?
   * @param {boolean} Are the CC turned on?
   * @returns {boolean} Should the player show custom CC?
   */},{key:"_showCustomCaptions",value:function _showCustomCaptions(isYoutube,audioOnly,hasCaptions,cc){return(isYoutube||audioOnly)&&hasCaptions&&cc}/**
   * determines if there
   *
   * @param {string} the url for the thumbnail image
   * @returns {string} the string for the style attribute
   */},{key:"_useYoutubeIframe",value:function _useYoutubeIframe(thumbnailSrc,isYoutube,__elapsed){return isYoutube&&(null===thumbnailSrc||__elapsed===void 0||0===__elapsed)}/**
   * gets YouTube iframe
   */},{key:"_youTubeRequest",value:function _youTubeRequest(){window.A11yMediaYoutube.requestAvailability();var root=this,ytUtil=window.A11yMediaYoutube.instance;root.disableSeek=!0;if(root.__playerAttached&&root.__playerReady){var ytInit=function ytInit(){// once metadata is ready on video set it on the media player
// initialize the YouTube player
root.media=ytUtil.initYoutubePlayer({width:"100%",height:"100%",videoId:root.youtubeId});root.__status=root._getLocal("youTubeLoading","label");root.$.controls.setStatus(root.__status);// move the YouTube iframe to the media player's YouTube container
root.$.youtube.appendChild(root.media.a);root.__ytAppended=!0;root._updateCustomTracks()},checkApi=function checkApi(e){if(ytUtil.apiReady){document.removeEventListener("youtube-api-ready",checkApi);if(!root.__ytAppended){ytInit()}}};if(ytUtil.apiReady){if(!root.__ytAppended){ytInit()}}else{document.addEventListener("youtube-api-ready",checkApi)}}}/**
   * updates custom tracks for youTube
   */},{key:"_updateCustomTracks",value:function _updateCustomTracks(){if((this.isYoutube||this.audioOnly)&&this.__tracks){var root=this,track=root.__tracks[this.$.transcript.selectedTranscript],active=[],caption="";if(track!==void 0&&null!==track&&track.cues!==void 0&&null!==track.cues){for(var i=0;i<track.cues.length;i++){if(track.cues[i].seek<root.__elapsed&&track.cues[i].seekEnd>root.__elapsed){active.push(track.cues[i].order);caption=""===caption?track.cues[i].text:caption}}root.$.customcctxt.innerText=caption;root.$.transcript.setActiveCues(active)}}}/**
   * life cycle, element is removed from the DOM
   */},{key:"disconnectedCallback",value:function disconnectedCallback(){window.removeEventListener("es-bridge-screenfullLib-loaded",this._onScreenfullLoaded.bind(this));babelHelpers.get(babelHelpers.getPrototypeOf(A11yMediaPlayer.prototype),"disconnectedCallback",this).call(this)}}],[{key:"tag",get:function get(){return"a11y-media-player"}//get player-specific behaviors
},{key:"behaviors",get:function get(){return[_a11yMediaBehaviors.A11yMediaBehaviors]}}]);return A11yMediaPlayer}(_a11yMediaBehaviors.A11yMediaBehaviors);_exports.A11yMediaPlayer=A11yMediaPlayer;window.customElements.define(A11yMediaPlayer.tag,A11yMediaPlayer)});
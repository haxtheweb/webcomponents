/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { FullscreenBehaviors } from "@haxtheweb/fullscreen-behaviors/fullscreen-behaviors.js";
import "@haxtheweb/anchor-behaviors/anchor-behaviors.js";
import "@haxtheweb/responsive-utility/responsive-utility.js";
import { normalizeEventPath } from "@haxtheweb/utils/utils.js";
import "@haxtheweb/absolute-position-behavior/absolute-position-behavior.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import "@haxtheweb/simple-search/simple-search.js";
import "@haxtheweb/simple-range-input/simple-range-input.js";
import "@haxtheweb/simple-fields/lib/simple-fields-field.js";
import "./lib/a11y-media-play-button.js";
import "./lib/a11y-media-state-manager.js";
import "./lib/a11y-media-button.js";
import "./lib/a11y-media-transcript-cue.js";
import "./lib/a11y-media-youtube.js";

/**
  * `a11y-media-player`
  * an accessible video player
  * 
 ### Styling
 `<a11y-media-player>` provides the following basic custom properties
 for styling:
 
 #### Basic Styling
 
 Custom property | Description | Default
 ----------------|-------------|----------
 `--a11y-media-color` | default text color | `--simple-colors-default-theme-grey-11`
 `--a11y-media-bg-color` | default background color | `--simple-colors-default-theme-grey-2`
 `--a11y-media-border-color` | default border color | `--simple-colors-default-theme-grey-3`
 `--a11y-media-hover-color` | text color when hovering | `--simple-colors-default-theme-grey-12`
 `--a11y-media-hover-bg-color` | background color when hovering | `--simple-colors-default-theme-grey-2`
 `--a11y-media-accent-color` | accent color | `--simple-colors-default-theme-accent-9`
 `--a11y-media-faded-accent-color` | accent color when faded | `--simple-colors-default-theme-accent-8`
 `--a11y-media-disabled-color` | color for disabled items | `--simple-colors-default-theme-grey-5`
 `--a11y-media-transcript-color` | default text color of transcript | `--simple-colors-default-theme-grey-7`
 `--a11y-media-transcript-bg-color` | default background color of transcript | `--simple-colors-default-theme-grey-1`
 `--a11y-media-transcript-accent-color` | default accent color of transcript | `--simple-colors-default-theme-accent-8`
 `--a11y-media-transcript-faded-accent-color` | accent color of transcript, faded | `--simple-colors-default-theme-accent-10`
 `--a11y-media-transcript-cue-color` | text color of transcript cue | `--simple-colors-fixed-theme-grey-12`
 `--a11y-media-transcript-cue-bg-color` | background color of transcript cue  | `--simple-colors-fixed-theme-grey-1`
 `--a11y-media-transcript-active-cue-color` | text color of active transcript cue  | `--simple-colors-fixed-theme-grey-12`
 `--a11y-media-transcript-active-cue-bg-color` | background color of active transcript cue  | `--simple-colors-fixed-theme-accent-1`
 `--a11y-media-transcript-focused-cue-color` | text color of focused transcript cue  | `--simple-colors-fixed-theme-grey-12`
 `--a11y-media-transcript-focused-cue-bg-color` | background color of focused transcript cue  | `--simple-colors-fixed-theme-grey-2`
 `--a11y-media-transcript-match-color` | text color of matched term in transcript search  | `--simple-colors-fixed-theme-grey-1`
 `--a11y-media-transcript-match-bg-color` | background color of matched term in transcript search | `--simple-colors-fixed-theme-accent-10`
 `--a11y-media-transcript-match-border-color` | border color of matched term in transcript search | `--simple-colors-fixed-theme-accent-12`
 
 #### Controls
 Custom property | Description | Default 
 ----------------|-------------|----------
 `--a11y-media-scrollbar-width` | default width of scrollbars | `5px`
 `--a11y-media-controls-font-family` | font-family of controls
 
 #### Buttons
 Custom property | Description | Default
 ----------------|-------------|----------
 `--a11y-media-button-color` | button text color | `--a11y-media-color`
 `--a11y-media-button-bg-color` | button background color | `--a11y-media-bg-color`
 `--a11y-media-button-hover-color` | button text color when hovering | `--a11y-media-accent-color`
 `--a11y-media-button-hover-bg-color` | button background color when hovering | `--a11y-media-hover-bg-color`
 `--a11y-media-button-disabled-color` | button text color when disabled | `--a11y-media-disabled-color`
 `--a11y-media-button-toggle-color` | button text color when toggled | `--a11y-media-faded-accent-color`
 
 #### Sliders
 Custom property | Description | Default
 ----------------|-------------|----------
 `--simple-range-input-active-color` | slider color when active | `--a11y-media-accent-color`
 `--simple-range-input-secondary-color` | slider color for buffering | `--a11y-media-faded-accent-color`
 `--simple-range-input-pin-color` | slider pin color | `--a11y-media-bg-color`
 `--simple-range-input-pin-start-color` | slider pin color in start position | `--a11y-media-bg-color`
 `--simple-range-input-pin-end-color` | slider pin color in end position | `--a11y-media-bg-color`
 `--simple-range-input-knob-color` | slider knob color | `--a11y-media-accent-color`
 `--simple-range-input-knob-start-color` | slider knob color in start position | `--a11y-media-accent-color`
 `--simple-range-input-knob-end-color` | slider knob color in end position | `--a11y-media-bg-accent-color`
 `--simple-range-input-knob-border-color` | slider knob border color | `--a11y-media-accent-color`
 `--simple-range-input-knob-start-border-color` | slider knob border color in start position | `--a11y-media-bg-color`
 `--simple-range-input-knob-end-border-color` | slider knob border color in end position | `--a11y-media-bg-color`
 
 #### Settings Menu
 Custom property | Description | Default
 ----------------|-------------|----------
 `--a11y-media-settings-menu-color` | settings menu text color | `--a11y-media-color`
 `--a11y-media-settings-menu-bg-color` | settings menu background color | `--a11y-media-bg-color`
 `--a11y-media-settings-menu-hover-color` | settings menu text color when hovering | `--a11y-media-hover-color`
 `--a11y-media-settings-menu-hover-bg-color` | settings menu background color when hovering | `--a11y-media-hover-bg-color`
 
 #### Link Sharing Toast
 Custom property | Description | Default
 ----------------|-------------|----------
 `--simple-toast-color` | toast text color | `--a11y-media-color`
 `--simple-toast-background-color` | toast background color | `--a11y-media-bg-color`
  *
  * @element a11y-media-player
  * @extends DDD
  * @demo ./demo/index.html video demo
  * @demo ./demo/audio.html audio demo
  * @demo ./demo/youtube.html YouTube demo
  */
class A11yMediaPlayer extends FullscreenBehaviors(DDD) {
  //styles function
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          overflow: hidden;
          width: calc(100% - 2px);
          font-family: var(--ddd-font-navigation);
          --a11y-media-controls-font-family: var(--ddd-font-navigation);
          --a11y-media-player-height: unset;
          --a11y-media-color: var(
            --simple-colors-default-theme-grey-11,
            #111111
          );
          --a11y-media-bg-color: var(
            --simple-colors-default-theme-grey-2,
            #eeeeee
          );
          --a11y-media-border-color: var(
            --simple-colors-default-theme-grey-3,
            #dddddd
          );
          --a11y-media-hover-color: var(
            --simple-colors-default-theme-grey-12,
            #000000
          );
          --a11y-media-hover-bg-color: var(
            --simple-colors-default-theme-grey-2,
            #eeeeee
          );
          --a11y-media-accent-color: var(
            --simple-colors-default-theme-accent-9,
            #333333
          );
          --a11y-media-faded-accent-color: var(
            --simple-colors-default-theme-accent-8,
            #444444
          );
          --a11y-media-disabled-color: var(
            --simple-colors-default-theme-grey-5,
            #bbbbbb
          );
          border: 1px solid
            var(
              --a11y-media-border-color,
              var(--simple-colors-default-theme-grey-3)
            );

          --a11y-media-settings-menu-color: var(--a11y-media-color);
          --a11y-media-settings-menu-bg-color: var(--a11y-media-bg-color);
          --a11y-media-settings-menu-hover-color: var(--a11y-media-hover-color);
          --a11y-media-settings-menu-hover-bg-color: var(
            --a11y-media-hover-bg-color
          );
          --simple-fields-accent-color: var(--a11y-media-accent-color);
          --simple-fields-background-color: var(--a11y-media-bg-color);
          --simple-fields-color: var(--a11y-media-color);
          --simple-fields-border-color: var(--a11y-media-border-color);
          --simple-fields-border-color-light: var(
            --a11y-media-border-color-light,
            var(--a11y-media-border-color)
          );

          --a11y-media-button-color: var(--a11y-media-color);
          --a11y-media-button-bg-color: var(--a11y-media-bg-color);
          --a11y-media-button-hover-color: var(--a11y-media-accent-color);
          --a11y-media-button-hover-bg-color: var(--a11y-media-hover-bg-color);
          --a11y-media-button-disabled-color: var(--a11y-media-disabled-color);
          --a11y-media-button-toggle-color: var(
            --a11y-media-faded-accent-color
          );

          --simple-range-input-bg: var(--a11y-media-accent-color);
          --simple-range-input-color: var(--a11y-media-color);
          --simple-range-input-track-height: 4px;
          --simple-range-input-pin-height: 10px;

          --simple-toast-color: var(--a11y-media-color);
          --simple-toast-background-color: var(--a11y-media-bg-color);

          --a11y-media-transcript-color: var(
            --simple-colors-default-theme-grey-7,
            #666666
          );
          --a11y-media-transcript-bg-color: var(
            --simple-colors-default-theme-grey-1,
            #ffffff
          );
          --a11y-media-transcript-accent-color: var(
            --simple-colors-default-theme-accent-8,
            #444444
          );
          --a11y-media-transcript-faded-accent-color: var(
            --simple-colors-default-theme-accent-10,
            #222222
          );
          --a11y-media-transcript-cue-color: var(
            --simple-colors-fixed-theme-grey-12,
            #000000
          );
          --a11y-media-transcript-cue-bg-color: var(
            --simple-colors-fixed-theme-grey-1,
            #ffffff
          );
          --a11y-media-transcript-active-cue-color: var(
            --simple-colors-fixed-theme-grey-12,
            #000000
          );
          --a11y-media-transcript-active-cue-bg-color: var(
            --simple-colors-fixed-theme-accent-1,
            #ffffff
          );
          --a11y-media-transcript-focused-cue-color: var(
            --simple-colors-fixed-theme-grey-12,
            #000000
          );
          --a11y-media-transcript-focused-cue-bg-color: var(
            --simple-colors-fixed-theme-grey-2,
            #eeeeee
          );
          --a11y-media-transcript-match-color: var(
            --simple-colors-fixed-theme-grey-1,
            #ffffff
          );
          --a11y-media-transcript-match-bg-color: var(
            --simple-colors-fixed-theme-accent-10,
            #222222
          );
          --a11y-media-transcript-match-border-color: var(
            --simple-colors-fixed-theme-accent-12,
            #000000
          );
        }

        :host([dark]) {
          border: 1px solid var(--simple-colors-default-theme-grey-1, #000000);
        }

        :host([dark-transcript]) {
          --a11y-media-transcript-bg-color: var(
            --simple-colors-dark-theme-grey-1,
            #000000
          );
          --a11y-media-transcript-cue-color: var(
            --simple-colors-dark-theme-grey-12,
            #ffffff
          );
          --a11y-media-transcript-cue-bg-color: var(
            --simple-colors-dark-theme-grey-1,
            #000000
          );
          --a11y-media-transcript-active-cue-color: var(
            --simple-colors-dark-theme-accent-10,
            #dddddd
          );
          --a11y-media-transcript-active-cue-bg-color: var(
            --simple-colors-dark-theme-grey-1,
            #000000
          );
          --a11y-media-transcript-match-color: var(
            --simple-colors-dark-theme-grey-1,
            #000000
          );
          --a11y-media-transcript-match-bg-color: var(
            --simple-colors-dark-theme-accent-10,
            #dddddd
          );
          --a11y-media-transcript-match-border-color: var(
            --simple-colors-dark-theme-accent-12,
            #ffffff
          );
          --a11y-media-transcript-focused-cue-color: var(
            --simple-colors-dark-theme-grey-12,
            #ffffff
          );
          --a11y-media-transcript-focused-cue-bg-color: var(
            --simple-colors-dark-theme-grey-2,
            #111111
          );
        }

        :host *::-webkit-scrollbar {
          width: var(--a11y-media-scrollbar-width, 5px);
        }

        :host([hidden]),
        *[hidden] {
          display: none !important;
        }

        :host([height]) {
          height: calc(var(--a11y-media-player-height) - 2px);
          max-height: calc(var(--a11y-media-player-height) - 2px);
          overflow: unset;
        }

        :host([height]) #player-section {
          max-height: var(--a11y-media-player-height);
        }

        :host([height]) #player-and-controls {
          max-height: calc(100% - 32px - 44px);
        }

        :host([height]) #player {
          height: calc(100% - 32px - 44px);
          padding-top: unset;
        }

        :host,
        #player-section {
          color: var(--a11y-media-hover-color);
          background-color: var(--a11y-media-bg-color);
        }

        :host > * {
          transition: all 0.5s;
        }

        :host,
        #player-section,
        #player,
        #transcript-section,
        #transcript-and-controls {
          display: flex;
          flex-flow: column;
          align-items: stretch;
          align-content: stretch;
        }

        #captionlink:link {
          text-decoration: none;
        }

        #player-and-controls,
        #player,
        #player > *,
        #cc-custom,
        #cc-text,
        #slider,
        #controls,
        #player-section,
        #transcript-section,
        #transcript-and-controls {
          width: 100%;
        }

        #transcript-and-controls > * {
          width: calc(100% - 1px);
        }

        :host > *,
        #player-and-controls,
        #player,
        #player > *,
        #cc-text {
          flex: 1 1 auto;
        }

        #controls,
        #searchbar {
          flex: 0 0 44px;
        }

        #player-and-controls {
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
          min-width: 100px;
          display: flex;
          align-items: stretch;
        }

        :host([audio-only]) #playbutton {
          opacity: 0;
        }

        #slider {
          flex: 0 0 32px;
          height: 32px;
          background-color: var(--a11y-media-bg-color);
          --simple-range-input-pin-height: 15px;
        }

        a11y-media-youtube {
          opacity: 1;
          transition: opacity 0.5s;
        }

        a11y-media-youtube.hidden {
          opacity: 0;
        }

        #cc-custom:not([hidden]) {
          font-size: 20px;
          transition: font-size 0.25s;
          display: flex;
        }

        #cc-text {
          align-self: flex-end;
          font-family: sans-serif;
          color: white;
          margin: 4px 10px;
          padding: 0.15em 4px;
          background-color: black;
          background-color: rgba(0, 0, 0, 0.8);
          transition: all 0.5s;
        }

        #player-and-controls[audio-no-thumb] #cc-text {
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
          background-color: var(--a11y-media-bg-color);
          --primary-text-color: var(--a11y-media-settings-menu-color);
        }

        #controls-left {
          position: absolute;
          left: 0;
          min-width: 200px;
        }

        #controls-right {
          position: absolute;
          right: 0;
          top: 0;
        }

        absolute-position-behavior {
          background-color: var(--a11y-media-settings-menu-bg-color);
          color: var(--a11y-media-settings-menu-color);
          border: 1px solid
            var(
              --a11y-media-border-color,
              var(--simple-colors-default-theme-grey-3)
            );
          max-height: 200px;
          overflow-y: scroll;
          overflow-x: hidden;
        }

        absolute-position-behavior::-webkit-scrollbar-track {
          background-color: var(--a11y-media-settings-menu-bg-color);
        }

        absolute-position-behavior::-webkit-scrollbar-thumb {
          background-color: var(--a11y-media-settings-menu-color);
        }

        absolute-position-behavior .setting {
          min-height: 42px;
          padding: 2px 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        absolute-position-behavior simple-field-field {
          margin-top: 0 !important;
          margin-bottom: 0 !important;
          background-color: var(--a11y-media-settings-menu-bg-color);
          color: var(--a11y-media-settings-menu-color);
        }

        .setting-text {
          margin-right: 1em;
          font-family: var(--a11y-media-controls-font-family);
        }

        .setting-control {
          max-width: 110px;
        }

        .setting-slider {
          flex: 0 0 110px;
          margin-left: -15px;
          margin-right: -15px;
        }

        #loop {
          flex: 0 0 40px;
        }

        #loop-label {
          flex: 1 1 auto;
        }

        .play-status {
          border: none;
          position: relative;
          font-size: 85%;
          font-family: var(--a11y-media-controls-font-family);
        }

        .play-status.control-bar {
          padding: 8px 13px 8px;
        }

        :host([hide-play-status]) .play-status {
          display: none;
        }

        #volume-and-mute {
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
        }

        #volume:active,
        #volume:focus,
        #volume:hover,
        #volume.focus,
        #volume-and-mute:active #volume,
        #volume-and-mute:focus #volume,
        #volume-and-mute:hover #volume {
          overflow: visible;
          width: 100px;
        }

        :host([responsive-size="xs"]) #volume:active,
        :host([responsive-size="xs"]) #volume:focus,
        :host([responsive-size="xs"]) #volume:hover,
        :host([responsive-size="xs"]) #volume.focus,
        :host([responsive-size="xs"]) #volume-and-mute:active #volume,
        :host([responsive-size="xs"]) #volume-and-mute:focus #volume,
        :host([responsive-size="xs"]) #volume-and-mute:hover #volume,
        :host([width]) #volume:active,
        :host([width]) #volume:focus,
        :host([width]) #volume:hover,
        :host([width]) #volume.focus,
        :host([width]) #volume-and-mute:active #volume,
        :host([width]) #volume-and-mute:focus #volume,
        :host([width]) #volume-and-mute:hover #volume {
          top: 0px;
        }

        #print-thumbnail {
          width: 100%;
          margin: 0;
          display: block;
          border-top: 1px solid #aaaaaa;
        }

        .media-caption:not(:empty) {
          padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
          font-size: var(--ddd-font-size-xs);
          font-weight: bold;
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
          --simple-fields-color: var(--a11y-media-color);
          --a11y-media-button-bg-color: var(--a11y-media-transcript-bg-color);
          --a11y-media-button-hover-bg-color: var(
            --a11y-media-transcript-bg-color
          );
          --simple-search-input-background-color: var(
            --a11y-media-transcript-bg-color
          );
          --simple-search-input-text-color: var(--a11y-media-color);
          --simple-search-input-line-color: var(--a11y-media-accent-color);
          --simple-search-input-placeholder-color: var(--a11y-media-color);
          --simple-search-button-color: var(--a11y-media-accent-color);
          --simple-search-button-hover-color: var(
            --a11y-media-faded-accent-color
          );
          --simple-search-button-bg-color: var(
            --a11y-media-transcript-bg-color
          );
          --simple-search-button-border-color: var(
            --a11y-media-transcript-bg-color
          );
          --simple-search-button-hover-border-color: var(
            --a11y-media-transcript-bg-color
          );
          --simple-search-button-disabled-color: var(
            --a11y-media-disabled-color
          );
          --simple-search-button-disabled-bg-color: var(
            --a11y-media-transcript-bg-color
          );
          --simple-search-button-disabled-border-color: var(
            --a11y-media-border-color
          );
          --simple-search-padding: 0 15px;
        }

        :host([dark]) #searchbar {
          background-color: var(--a11y-media-bg-color);
          --a11y-media-button-bg-color: var(--a11y-media-bg-color);
          --a11y-media-button-hover-bg-color: var(--a11y-media-bg-color);
          --simple-search-input-background-color: var(--a11y-media-bg-color);
          --simple-search-button-bg-color: var(--a11y-media-bg-color);
          --simple-search-button-border-color: var(--a11y-media-bg-color);
          --simple-search-button-hover-border-color: var(--a11y-media-bg-color);
          --simple-search-button-disabled-bg-color: var(--a11y-media-bg-color);
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

        #transcript-section {
          padding: 0 1px 0 0;
        }

        #transcript-and-controls {
          flex: 1 0 194px;
        }

        #transcript {
          flex: 1 0 150px;
          max-height: var(--a11y-media-transcript-max-height, unset);
          overflow-y: scroll;
          color: var(--a11y-media-transcript-cue-color);
          background-color: var(--a11y-media-transcript-cue-bg-color);
          border-left: 1px solid var(--a11y-media-transcript-bg-color);
        }

        #transcript::-webkit-scrollbar-track {
          background-color: var(--a11y-media-transcript-cue-bg-color);
        }

        #transcript::-webkit-scrollbar-thumb {
          background-color: var(--a11y-media-transcript-cue-color);
        }

        .transcript-from-track {
          display: table;
          width: calc(100% - 30px);
          padding: 0 15px 15px;
          color: var(--a11y-media-transcript-cue-color);
          background-color: var(--a11y-media-transcript-cue-bg-color);
          font-size: var(--a11y-media-transcript-cue-font-size, 14px);
          line-height: var(--a11y-media-transcript-cue-line-height, 28px);
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

        absolute-position-behavior:not(:defined),
        simple-tooltip:not(:defined) {
          display: none;
        }

        ::slotted(iframe) {
          display: none;
        }
        @media screen {
          :host([full-flex]) {
            flex-flow: row;
            padding: 0;
          }

          :host([full-flex]) #player-section {
            max-width: 50%;
            flex: 1 0 auto;
          }

          :host([full-flex]) #transcript-section {
            min-width: 50%;
            flex: 0 1 auto;
          }

          :host([full-flex]) #transcript {
            position: absolute;
            top: 44px;
            left: 0;
            right: 0;
            bottom: 0;
            overflow-y: scroll;
          }

          #transcript-and-controls {
            position: relative;
          }

          :host([sticky-mode]) #player-section {
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

          :host([fullscreen]) #player-section {
            width: 100%;
            height: 100vh;
            max-width: 100vw;
            position: absolute;
            position: sticky;
            left: 0;
            top: 0;
            z-index: 100000;
            transition: all 0.5s;
          }

          :host([dark][sticky-mode]) #player-section {
            border: 1px solid var(--a11y-media-bg-color);
          }

          :host([sticky][sticky-corner="top-left"]) #player-section {
            right: unset;
            left: 5px;
          }

          :host(
              :not([no-height]):not([stacked-layout]):not(
                  [responsive-size="xs"]
                ):not([responsive-size="sm"])
            )
            #player-and-controls.totop {
            position: absolute;
            top: 0;
            left: 0;
            width: 200px !important;
            z-index: 9999;
          }

          :host([sticky][sticky-corner="bottom-left"]) #player-and-controls {
            top: unset;
            right: unset;
            bottom: 5px;
          }

          :host([sticky][sticky-corner="bottom-right"]) #player-and-controls {
            top: unset;
            bottom: 5px;
          }

          :host([sticky-mode]) .screen-only.media-caption,
          :host([responsive-size="xs"]) .screen-only.media-caption {
            display: none;
          }

          :host([sticky-mode]) #player-and-controls[audio-no-thumb] {
            max-height: 0px;
            overflow: hidden;
          }

          :host([sticky-mode]) .hide-sticky,
          :host([sticky-mode]) .hide-full-xs,
          :host([sticky-mode]) .hide-full-sm,
          :host([sticky-mode]) .hide-flex,
          :host([width]) .hide-full-xs,
          :host([width]) .hide-full-sm,
          :host([width]) .hide-full-flex,
          :host([responsive-size="xs"]) .hide-full-xs,
          :host([responsive-size="xs"]) .hide-full-sm,
          :host([responsive-size="xs"]) .hide-full-flex,
          :host([responsive-size="sm"]) .hide-full-sm,
          :host([responsive-size="sm"]) .hide-full-flex,
          :host([flex-layout]) .hide-flex {
            display: none;
          }

          :host([responsive-size="xl"]) #cc-custom {
            font-size: 16px;
          }

          :host([responsive-size="lg"]) #cc-custom,
          :host([flex-layout][responsive-size="xl"]) #cc-custom {
            font-size: 14px;
          }

          :host([responsive-size="md"]) #cc-custom,
          :host([flex-layout][responsive-size="lg"]) #cc-custom {
            font-size: 12px;
          }

          :host([responsive-size="xs"]) #cc-custom,
          :host([width]) #cc-custom,
          :host([flex-layout][responsive-size="md"]) #cc-custom,
          :host([flex-layout][responsive-size="sm"]) #cc-custom {
            font-size: 10px;
          }

          :host([sticky-mode]) #cc-custom,
          :host([flex-layout][width]) #cc-custom,
          :host([flex-layout][responsive-size="xs"]) #cc-custom {
            display: none;
          }

          .media-caption {
            color: var(--a11y-media-caption-color, var(--a11y-media-bg-color));
            background-color: var(--a11y-media-accent-color);
          }

          #audio-only {
            text-align: center;
            font-style: italic;
            width: 100%;
            line-height: 160%;
          }

          #print-thumbnail,
          .print-only {
            width: 0;
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
          #print-thumbnail:not([src]),
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
      `,
    ];
  }

  // render function
  render() {
    return html` <div class="sr-only" ?hidden="${!this.mediaCaption}">
        ${this.mediaCaption}
      </div>
      <div id="player-section">
        <div
          id="player-and-controls"
          .style="${this.mediaMaxWidth}"
          ?audio-no-thumb="${this.audioNoThumb}"
        >
          <div id="player" .style="${this.playerStyle}">
            <a11y-media-play-button
              id="playbutton"
              action="${this.__playing ? "pause" : "play"}"
              label="${this._getLocal(
                this.localization,
                this.__playing ? "pause" : "play",
                "label",
              )}"
              @button-click="${this.togglePlay}"
              ?audio-only="${this.audioOnly}"
              ?disabled="${this.audioNoThumb}"
              youtube-id="${this.youtubeId}"
            >
            </a11y-media-play-button>
            <div id="html5">
              <slot></slot>
            </div>
            ${this.videoId && this.__playerReady
              ? html`
                  <a11y-media-youtube
                    id="youtube-${this.id}"
                    class="${this.__currentTime > 0.3 || this.__seeking
                      ? ``
                      : `hidden`}"
                    lang="${this.mediaLang}"
                    preload="${this.t ? "auto" : this.preload}"
                    .t="${this.t}"
                    video-id="${this.videoId}"
                    playback-rate="${this.playbackRate}"
                    @timeupdate="${this._handleTimeUpdate}"
                    ?hidden=${!this.isYoutube}
                  >
                  </a11y-media-youtube>
                `
              : ``}
            ${Object.keys(this.captionCues || []).length === 0 ||
            !this.showCustomCaptions
              ? html``
              : html`
                  <div id="cc-custom" aria-live="polite" class="screen-only">
                    <div id="cc-text">
                      ${!this.captionCues
                        ? ``
                        : Object.keys(this.captionCues).map(
                            (key) =>
                              html`${this.captionCues[key].text
                                ? this.captionCues[key].text
                                : ""}`,
                          )}
                    </div>
                  </div>
                `}
          </div>
        </div>
        <div id="progresslabel" class="sr-only">
          ${this._getLocal(this.localization, "seekSlider", "label")}
        </div>
        <simple-range-input
          id="slider"
          class="screen-only"
          aria-labelledby="progresslabel"
          min="0"
          .max="${this.duration}"
          step="1"
          @value-changed="${this._handleSliderChanged}"
          @immediate-value-changed="${this._handleSliderDragging}"
          .value="${this.__currentTime}"
          ?disabled="${this.disableSeek}"
        >
        </simple-range-input>
        <div id="controls" controls="innerplayer">
          <div id="controls-left">
            <a11y-media-button
              accent-color="${this.accentColor}"
              ?dark="${this.dark}"
              icon="${this._getLocal(
                this.localization,
                this.__playing ? "pause" : "play",
                "icon",
              )}"
              label="${this._getLocal(
                this.localization,
                this.__playing ? "pause" : "play",
                "label",
              )}"
              @click="${this.togglePlay}"
            ></a11y-media-button>
            <a11y-media-button
              accent-color="${this.accentColor}"
              ?dark="${this.dark}"
              class="hide-flex hide-full-xs"
              icon="${this._getLocal(this.localization, "rewind", "icon")}"
              label="${this._getLocal(this.localization, "rewind", "label")}"
              ?disabled="${this.disableSeek || this.currentTime <= 0}"
              ?hidden="${this.disableSeek}"
              @click="${(e) => {
                this.rewind();
              }}"
            ></a11y-media-button>
            <a11y-media-button
              accent-color="${this.accentColor}"
              ?dark="${this.dark}"
              class="hide-flex hide-full-xs"
              icon="${this._getLocal(this.localization, "forward", "icon")}"
              label="${this._getLocal(this.localization, "forward", "label")}"
              ?disabled="${this.disableSeek ||
              this.currentTime >= this.duration}"
              ?hidden="${this.disableSeek}"
              @click="${(e) => {
                this.forward();
              }}"
            ></a11y-media-button>
            <a11y-media-button
              accent-color="${this.accentColor}"
              ?dark="${this.dark}"
              class="hide-flex"
              icon="${this._getLocal(this.localization, "restart", "icon")}"
              label="${this._getLocal(this.localization, "restart", "label")}"
              ?disabled="${this.disableSeek}"
              ?hidden="${this.responsiveSize === "xs" ||
              this.responsiveSize === "sm" ||
              this.disableSeek}"
              @click="${this.restart}"
            ></a11y-media-button>
            <div
              id="volume-and-mute"
              @focus="${(e) => (this.__volumeSlider = true)}"
              @blur="${(e) => (this.__volumeSlider = false)}"
            >
              <a11y-media-button
                accent-color="${this.accentColor}"
                ?dark="${this.dark}"
                id="mute"
                icon="${this._getLocal(
                  this.localization,
                  this.muted ? "unmute" : "mute",
                  "icon",
                )}"
                label="${this._getLocal(
                  this.localization,
                  this.muted ? "unmute" : "mute",
                  "label",
                )}"
                @click="${(e) => {
                  this.toggleMute();
                }}"
              ></a11y-media-button>
              <simple-range-input
                id="volume"
                accent-color="${this.accentColor}"
                ?dark="${this.dark}"
                aria-labelledby="volume-slider-label"
                label="${this._getLocal(this.localization, "volume", "label")}"
                min="0"
                max="100"
                pin
                step="10"
                value="${this.muted ? 0 : this.volume}"
                @value-changed="${this._handleVolumeChanged}"
                ?hidden="${this.responsiveSize === "xs"}"
              ></simple-range-input>
            </div>
            <span
              aria-live="polite"
              class="play-status control-bar hide-full-xs"
            >
              <span id="statbar">${this.status}</span>
            </span>
          </div>
          <div id="controls-right">
            <a11y-media-button
              accent-color="${this.accentColor}"
              ?dark="${this.dark}"
              icon="${this._getLocal(this.localization, "captions", "icon")}"
              label="${this._getLocal(this.localization, "captions", "label")}"
              ?disabled="${!this.hasCaptions}"
              ?hidden="${!this.hasCaptions}"
              ?toggle="${this.captionsTrackKey > -1}"
              @click="${(e) => this.toggleCC()}"
            >
            </a11y-media-button>
            <a11y-media-button
              accent-color="${this.accentColor}"
              ?dark="${this.dark}"
              class="hide-full-xs"
              controls="transcript"
              icon="${this._getLocal(this.localization, "transcript", "icon")}"
              label="${this._getLocal(
                this.localization,
                "transcript",
                "label",
              )}"
              ?disabled="${!this.hasCaptions || this.learningMode}"
              ?hidden="${!this.hasCaptions ||
              this.standAlone ||
              (this.height && this.responsiveSize.indexOf("s") > -1) ||
              this.learningMode}"
              ?toggle="${this.transcriptTrackKey > -1}"
              @click="${(e) => this.toggleTranscript()}"
            >
            </a11y-media-button>
            <a11y-media-button
              accent-color="${this.accentColor}"
              ?dark="${this.dark}"
              class="hide-full-sm"
              icon="${this._getLocal(this.localization, "copyLink", "icon")}"
              label="${this._getLocal(this.localization, "copyLink", "label")}"
              ?disabled="${!this.linkable || this.learningMode}"
              ?hidden="${!this.linkable || this.learningMode}"
              @click="${this._handleCopyLink}"
            ></a11y-media-button>
            <a11y-media-button
              accent-color="${this.accentColor}"
              ?dark="${this.dark}"
              icon="${this._getLocal(this.localization, "fullscreen", "icon")}"
              label="${this._getLocal(
                this.localization,
                "fullscreen",
                "label",
              )}"
              ?hidden="${this.audioNoThumb || !this.fullscreenButton}"
              ?toggle="${this.fullscreen}"
              @click="${(e) => this.toggleFullscreen()}"
            >
            </a11y-media-button>
            <a11y-media-button
              accent-color="${this.accentColor}"
              ?dark="${this.dark}"
              id="settings-button"
              class="hide-sticky"
              controls="settings"
              icon="${this._getLocal(this.localization, "settings", "icon")}"
              label="${this._getLocal(this.localization, "settings", "label")}"
              @click="${(e) => this.toggleSettings()}"
            ></a11y-media-button>
            ${this.isYoutube
              ? html` <a11y-media-button
                  accent-color="${this.accentColor}"
                  ?dark="${this.dark}"
                  class="hide-sticky"
                  icon="mdi-social:youtube"
                  label="Open on YouTube"
                  ?hidden="${this.learningMode || this.hideYoutubeLink}"
                  @click="${this.goToYoutube}"
                ></a11y-media-button>`
              : ``}
          </div>
          <absolute-position-behavior
            id="settings"
            auto
            fit-to-visible-bounds
            for="settings-button"
            offset="10"
            position-align="end"
            position="top"
            ?hidden="${!this.__settingsOpen}"
          >
            <div class="setting" ?hidden="${!this.hasCaptions}">
              <div class="setting-text">
                ${this._getLocal(this.localization, "captions", "label")}
              </div>
              <simple-fields-field
                id="cc_tracks"
                class="setting-control"
                value="${this.captionsTrackKey}"
                .options="${this.captionsPicker}"
                ?hidden="${!this.hasCaptions}"
                ?disabled="${!this.hasCaptions}"
                @value-changed="${this.selectCaptionByKeyEvent}"
                type="select"
              >
              </simple-fields-field>
            </div>
            <div
              class="setting"
              ?hidden="${!this.hasCaptions || this.learningMode}"
            >
              <div class="setting-text">
                ${this._getLocal(this.localization, "transcript", "label")}
              </div>
              <simple-fields-field
                id="transcript_tracks"
                class="setting-control"
                .value="${this.transcriptTrackKey}"
                .options="${this.transcriptPicker}"
                ?hidden="${!this.hasCaptions || this.learningMode}"
                ?disabled="${!this.hasCaptions || this.learningMode}"
                @value-changed="${this.selectTranscriptByKeyEvent}"
                type="select"
              >
              </simple-fields-field>
            </div>
            <div
              class="setting"
              ?hidden="${!this.hasCaptions || this.learningMode}"
            >
              <div id="print-label" class="setting-text">
                ${this._getLocal(this.localization, "print", "label")}
              </div>
              <a11y-media-button
                accent-color="${this.accentColor}"
                ?dark="${this.dark}"
                aria-labelledby="print-label"
                class="setting-control"
                icon="${this._getLocal(this.localization, "print", "icon")}"
                ?disabled="${this.noPrinting || this.learningMode}"
                ?hidden="${this.noPrinting || this.learningMode}"
                @click="${this.print}"
              >
              </a11y-media-button>
            </div>
            <div
              class="setting"
              ?hidden="${!this.hasCaptions || this.learningMode}"
            >
              <div id="download-label" class="setting-text">
                ${this._getLocal(this.localization, "download", "label")}
              </div>
              <a11y-media-button
                accent-color="${this.accentColor}"
                ?dark="${this.dark}"
                aria-labelledby="download-label"
                class="setting-control"
                icon="${this._getLocal(this.localization, "download", "icon")}"
                ?disabled="${this.noPrinting || this.learningMode}"
                ?hidden="${this.noPrinting || this.learningMode}"
                @click="${this.download}"
              >
              </a11y-media-button>
            </div>
            <div class="setting">
              <div id="loop-label" class="setting-text">
                ${this._getLocal(this.localization, "loop", "label")}
              </div>
              <simple-fields-field
                type="checkbox"
                id="loop"
                class="setting-control"
                aria-labelledby="loop-label"
                @value-change="${this.toggleLoop}"
                ?value="${this.loop}"
              >
              </simple-fields-field>
            </div>
            <div class="setting">
              <div id="speed-label" class="setting-text">
                ${this._getLocal(this.localization, "speed", "label")}
              </div>
              <simple-range-input
                id="speed"
                aria-labelledby="speed-label"
                class="setting-slider setting-control"
                min="0.5"
                max="2.5"
                pin
                step="0.25"
                value="${this.playbackRate}"
                @value-changed="${this._handleSpeedChanged}"
              >
              </simple-range-input>
            </div>
          </absolute-position-behavior>
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
      ${this.poster
        ? html`<img
            id="print-thumbnail"
            aria-hidden="true"
            .src="${this.poster}"
          />`
        : ``}
      <div
        id="transcript-section"
        ?hidden="${this.standAlone || !this.hasCaptions}"
      >
        <div id="transcript-and-controls" ?hidden="${this.hideTranscript}">
          <div id="searchbar">
            <div id="searching">
              <simple-search
                id="simplesearch"
                controls="transcript"
                next-button-icon="${this._getLocal(
                  this.localization,
                  "nextResult",
                  "icon",
                )}"
                next-button-label="${this._getLocal(
                  this.localization,
                  "nextResult",
                  "label",
                )}"
                prev-button-icon="${this._getLocal(
                  this.localization,
                  "prevResult",
                  "icon",
                )}"
                prev-button-label="${this._getLocal(
                  this.localization,
                  "prevResult",
                  "label",
                )}"
                search-input-icon="${this._getLocal(
                  this.localization,
                  "search",
                  "icon",
                )}"
                search-input-label="${this._getLocal(
                  this.localization,
                  "search",
                  "label",
                )}"
                selector=".searchable"
                ?disabled="${this.disableSearch}"
                ?hidden="${this.disableSearch}"
              >
              </simple-search>
            </div>
            <div id="scrolling">
              <a11y-media-button
                accent-color="${this.accentColor}"
                ?dark="${this.dark}"
                id="scroll"
                controls="transcript"
                icon="${this._getLocal(
                  this.localization,
                  "autoScroll",
                  "icon",
                )}"
                label="${this._getLocal(
                  this.localization,
                  "autoScroll",
                  "label",
                )}"
                ?toggle="${!this.disableScroll}"
                @click="${(e) => (this.disableScroll = !this.disableScroll)}"
              >
              </a11y-media-button>
            </div>
            <div
              id="printing"
              ?hidden="${this.disablePrintButton}"
              ?disabled="${this.disablePrintButton}"
            >
              <a11y-media-button
                accent-color="${this.accentColor}"
                ?dark="${this.dark}"
                id="download"
                controls="transcript"
                icon="${this._getLocal(this.localization, "download", "icon")}"
                label="${this._getLocal(
                  this.localization,
                  "download",
                  "label",
                )}"
                @click="${this.download}"
              >
              </a11y-media-button>
              <a11y-media-button
                accent-color="${this.accentColor}"
                ?dark="${this.dark}"
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
                            this.media.duration,
                          )}"
                          lang="${cue.track.language}"
                          role="button"
                          start="${this._getHHMMSS(
                            cue.endTime,
                            this.media.duration,
                          )}"
                          tabindex="0"
                          @click="${(e) => this._handleCueSeek(cue)}"
                          @active-changed="${this._setActiveCue}"
                          ?active="${cue.track.activeCues &&
                          cue.track.activeCues[0] === cue}"
                          ?disabled="${this.disableInteractive ||
                          this.disableSeek ||
                          this.duration === 0}"
                          ?hide-timestamps="${this.hideTimestamps}"
                        >
                          <span class="searchable">${cue.text}</span>
                        </a11y-media-transcript-cue>
                      `;
                    })}
                  </div>
                `
              : html` <div id="loading" class="transcript-from-track">
                  ${this.status}
                </div>`}
          </div>
        </div>
      </div>
      <div id="bottom" class="sr-only"></div>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      __playerReady: { type: Boolean },
      /**
       * Allow this media to play concurrently with other a11y-media-players?
       * Default is to pause this a11y-media-player when other a11y-media-player starts playing.
       */

      allowConcurrent: {
        attribute: "allow-concurrent",
        type: Boolean,
      },
      /**
       * Is this an audio file?
       */
      audioOnly: {
        attribute: "audio-only",
        type: Boolean,
        reflect: true,
      },
      /**
       * autoplay is an option,
       * but generally not recommended for a11y
       */
      autoplay: {
        attribute: "autoplay",
        type: Boolean,
      },
      /**
       * the selected track
       */
      captionsTrack: {
        attribute: "captions-track",
        type: Object,
      },
      /**
       * show closed captions
       */
      cc: {
        attribute: "cc",
        type: Boolean,
      },
      /**
       * current time for video playback
       */
      currentTime: {
        type: Number,
      },
      /**
       * crossorigin attribute for <video> and <audio> tags
       */
      crossorigin: {
        attribute: "crossorigin",
        type: String,
      },
      /**
       * disable transcript print button
       */
      disablePrintButton: {
        attribute: "disable-print-button",
        type: Boolean,
      },
      /**
       * disable transcript search feature
       */
      disableSearch: {
        attribute: "disable-search",
        type: Boolean,
      },
      /**
       * disable autoscrolling as transcript plays
       */
      disableScroll: {
        attribute: "disable-scroll",
        type: Boolean,
      },
      /**
       * disables seeking
       */
      disableSeek: {
        attribute: "disable-seek",
        type: Boolean,
      },
      /**
       * Use dark theme on transcript? Default is false, even when player is dark.
       */
      darkTranscript: {
        attribute: "dark-transcript",
        type: Boolean,
      },
      /**
       * disable fullscreen option
       */
      disableFullscreen: {
        attribute: "disable-fullscreen",
        type: Boolean,
      },
      /**
       * disable interactive mode that makes the transcript clickable
       */
      disableInteractive: {
        attribute: "disable-interactive",
        type: Boolean,
      },
      /**
       * The height of the media player.
       */
      height: {
        attribute: "height",
        type: String,
      },
      /**
       * Hide elapsed time?
       */
      hideElapsedTime: {
        attribute: "hide-elapsed-time",
        type: Boolean,
      },
      /**
       * show cue's start and end time
       */
      hideTimestamps: {
        attribute: "hide-timestamps",
        type: Boolean,
      },
      /**
       * initially hide the transcript?
       */
      hideTranscript: {
        attribute: "hide-transcript",
        type: Boolean,
        reflect: true,
      },
      /**
       * initially hide the transcript?
       */
      id: {
        attribute: "id",
        type: String,
        reflect: true,
      },
      /**
       * Language
       */
      lang: {
        attribute: "lang",
        type: String,
      },
      /**
       * Learning mode
       */
      learningMode: {
        attribute: "learning-mode",
        type: Boolean,
      },
      /**
       * has link button
       */
      linkable: {
        attribute: "linkable",
        type: Boolean,
      },
      /**
       * custom localization settings
       */
      localization: {
        attribute: "localization",
        type: Object,
      },
      /**
       * Loop the video?
       */
      loop: {
        attribute: "loop",
        type: Boolean,
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
        type: String,
      },
      /**
       * optional title of media (shows when printed)
       */
      mediaTitle: {
        attribute: "media-title",
        type: String,
      },
      /**
       * Is audio muted?
       */
      muted: {
        attribute: "muted",
        type: Boolean,
      },
      /**
       * Open on YouTube button
       */
      hideYoutubeLink: {
        type: Boolean,
        attribute: "hide-youtube-link",
      },
      /**
       * Playback rate where `1` is normal speed, `0.`5 is half-speed, and `2` is double speed
       */
      playbackRate: {
        attribute: "playback-rate",
        type: Number,
      },
      /**
       * Preload `none`, `metadata`, or `auto`.
       */
      preload: {
        attribute: "preload",
        type: String,
        reflect: true,
      },
      /**
       * Size of the a11y media element for responsive styling
       */
      responsiveSize: {
        attribute: "responsive-size",
        type: String,
        reflect: true,
      },
      /**
       * the search tool for the transcript
       */
      search: {
        attribute: "search",
        type: Object,
      },
      /**
       * Is stand-alone player (without transcript)?
       */
      standAlone: {
        attribute: "stand-alone",
        type: Boolean,
        reflect: true,
      },
      source: {
        type: String,
        reflect: true,
      },
      /**
       * DEPRECATED: array ouf sources
       */
      sources: {
        attribute: "sources",
        type: Array,
      },
      /**
       * stacked layout instead of side-by-side?
       */
      stackedLayout: {
        attribute: "stacked-layout",
        type: Boolean,
      },
      /**
       * Is the video currently sticky, i.e. it is fixed to the corner when playing but scrolled off screen?
       */
      sticky: {
        attribute: "sticky",
        type: Boolean,
        reflect: true,
      },
      /**
       * When playing but scrolled off screen, to which corner does it "stick":
       * top-left, top-right, bottom-left, bottom-right, or none?
       * Default is "top-right". "None" disables stickiness.
       */
      stickyCorner: {
        attribute: "sticky-corner",
        type: String,
        reflect: true,
      },
      /**
       * Source of optional thumbnail image
       * Highly recommended for Safari.
       */
      thumbnailSrc: {
        attribute: "thumbnail-src",
        type: String,
        reflect: true,
      },
      /**
       * DEPRECATED: array of tracks.
       */
      tracks: {
        attribute: "tracks",
        type: Array,
      },
      /**
       * the selected track for the transcript
       */
      transcriptTrack: {
        attribute: "transcript-track",
        type: Object,
      },
      /**
       * Range is 0 to 100. Default should not be loud enough to overpower screen readers.
       */
      volume: {
        attribute: "volume",
        type: Number,
      },
      /**
       * The width of the media player.
       */
      width: {
        attribute: "width",
        type: String,
      },
      /**
       * the id for the video
       */
      youtubeId: {
        attribute: "youtube-id",
        reflect: true,
        type: String,
      },
      /**
       * current playback in seconds
       */
      __currentTime: {
        type: Number,
      },
      /**
       * the index of the selected closed captions
       */
      __captionsOption: {
        type: Number,
      },
      /**
       * array of cues provided to readOnly `get cues`
       */
      __cues: {
        type: Array,
      },
      /**
       * media captions/transcript tracks array  provided to readOnly `get loadedTracks`
       */
      __loadedTracks: {
        type: Object,
      },
      /**
       * media playing status readOnly `get playing`
       */
      __playing: {
        type: Boolean,
      },
      /**
       * temporarily duration in seconds until fully loaded
       */
      __preloadedDuration: {
        type: Number,
      },
      /**
       * Is settings menu toggle open?
       */
      __settingsOpen: {
        type: Boolean,
      },
      /**
       * the index of the selected transcript
       */
      __transcriptOption: {
        type: Number,
      },
    };
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
    globalThis.ResponsiveUtility.requestAvailability();
    globalThis.A11yMediaStateManager.requestAvailability();
    this.__playerReady = false;
    this.audioOnly = false;
    this.autoplay = false;
    this.allowConcurrent = false;
    this.cc = false;
    this.darkTranscript = false;
    this.disableFullscreen = false;
    this.disableInteractive = false;
    this.disablePrintButton = false;
    this.disableSearch = false;
    this.disableScroll = false;
    this.disableSeek = false;
    this.hideElapsedTime = false;
    this.hideTimestamps = false;
    this.hideTranscript = false;
    this.id = null;
    this.lang = "en";
    this.learningMode = false;
    this.linkable = false;
    this.localization = {};
    this.loop = false;
    this.mediaTitle = "";
    this.mediaLang = "en";
    this.muted = false;
    this.hideYoutubeLink = false;
    this.preload = "metadata";
    this.playbackRate = 1;
    this.search = null;
    this.standAlone = false;
    this.responsiveSize = "sm";
    this.captionsTrack = null;
    this.transcriptTrack = null;
    this.sources = [];
    this.stackedLayout = false;
    this.sticky = false;
    this.stickyCorner = "top-right";
    this.tracks = [];
    this.volume = 70;
    this.width = null;
    this.youtubeId = null;
    this.__cues = [];
    this.__currentTime = 0;
    this.__captionsOption = -1;
    this.__loadedTracks = null;
    this.__playing = false;
    this.__settingsOpen = false;
    this.__transcriptOption = -1;
    this.querySelectorAll("video,audio").forEach((html5) => {
      html5.addEventListener("loadedmetadata", (e) => {
        this.__preloadedDuration = html5.duration;
      });
    });
  }

  /** -------------------------- CALACULATED PROPERTIES ----------------- */

  /**
   * gets anchors from page and uses their timecodes
   * @readonly
   * @returns {number} media width divided by height
   */
  get anchor() {
    let anchor = globalThis.AnchorBehaviors;
    return {
      target: anchor ? anchor.getTarget(this) : false,
      params: anchor ? anchor.params : {},
    };
  }

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
      !this.captionsTrack || !this.captionsTrack.cues
        ? []
        : this.isYoutube
          ? Object.keys(this.captionsTrack.cues).map((key) => {
              let cue = this.captionsTrack.cues[key];
              if (
                cue.startTime <= this.currentTime &&
                cue.endTime >= this.currentTime
              )
                return cue;
              return {};
            })
          : this.captionsTrack.activeCues;
    return cues;
  }

  /**
   * gets options for captions picker
   *
   * @readonly
   * @memberof A11yMediaPlayer
   */
  get captionsPicker() {
    let options = {};
    options[-1] = this._getLocal(this.localization, "captions", "off");
    Object.keys(
      this.loadedTracks && this.loadedTracks.textTracks
        ? this.loadedTracks.textTracks
        : {},
    ).forEach((key) => {
      options[key] =
        this.loadedTracks.textTracks[key].label ||
        this.loadedTracks.textTracks[key].language;
    });
    return options;
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
      this.media && this.media.duration && this.media.duration > 0
        ? this.media.duration
        : this.__preloadedDuration
          ? this.__preloadedDuration
          : 0;
    return duration;
  }

  /**
   * determines if player is in flex-layout mode
   * @returns {boolean} Is the video in flex layout mode?
   */
  get flexLayout() {
    return (
      this.hasCaptions &&
      !this.standAlone &&
      !this.hideTranscript &&
      !this.audioNoThumb &&
      !this.stackedLayout
    );
  }

  /**
   * determines if parent is wide enough for full flex-layout mode
   * @returns {boolean}
   */
  get fullFlex() {
    return (
      this.flexLayout &&
      this.responsiveSize !== "xs" &&
      this.responsiveSize !== "sm"
    );
  }

  /**
   * whether or not the fullscreen mode is be disabled
   * @returns {boolean}
   */
  get fullscreenButton() {
    return (
      this.fullscreenEnabled && !this.disableFullscreen && !this.audioNoThumb
    );
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
        notSupported: "HTML5 video is not supported.",
      },
      autoScroll: {
        label: "Scroll Transcript",
        icon: "swap-vert",
      },
      captions: {
        label: "Closed Captions",
        icon: "av:closed-caption",
        off: "Off",
      },
      download: {
        label: "Download Transcript",
        icon: "file-download",
      },
      forward: {
        label: "Forward",
        icon: "av:fast-forward",
      },
      fullscreen: {
        label: "Fullscreen",
        icon: "fullscreen",
      },
      copyLink: {
        label: "Copy Media Link",
        icon: "link",
      },
      closeLink: {
        label: "Close",
        icon: "close",
      },
      loading: {
        label: "Loading...",
      },
      loop: {
        label: "Loop Playback",
      },
      mute: {
        label: "Mute",
        icon: "av:volume-up",
      },
      nextResult: {
        label: "Next",
        icon: "arrow-forward",
      },
      pause: {
        label: "Pause",
        icon: "av:pause",
      },
      play: {
        label: "Play",
        icon: "av:play-arrow",
      },
      prevResult: {
        label: "Previous",
        icon: "arrow-back",
      },
      print: {
        label: "Print Transcript",
        icon: "print",
      },
      restart: {
        label: "Restart",
        icon: "av:replay",
      },
      rewind: {
        label: "Backward",
        icon: "av:fast-rewind",
      },
      search: {
        label: "Search the transcript.",
        icon: "search",
      },
      seekSlider: {
        label: "Seek Slider",
      },
      settings: {
        label: "Settings",
        icon: "settings",
      },
      speed: {
        label: "Speed %",
      },
      transcript: {
        label: "Transcript",
        icon: "description",
        loading: "Loading the transcript(s)...",
        off: "Off",
        skip: "Skip to the transcript.",
      },
      unmute: {
        label: "Unmute",
        icon: "av:volume-off",
      },
      video: {
        label: "Video",
        notSupported: "HTML5 video is not supported.",
      },
      volume: {
        label: "Volume",
      },
      youTubeLoading: {
        label: "Loading...",
        startLoading: "Press play.",
      },
      youTubeTranscript: {
        label: "Transcript will load once media plays.",
      },
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
   * `style` for `#player-and-controls`
   * @readonly
   * @returns {string} value for style attribute
   */
  get mediaMaxWidth() {
    let maxWidth =
      this.fullscreen || this.audioNoThumb
        ? `unset`
        : `calc(${this.aspect * 100}vh - ${this.aspect * 80}px)`;
    return `max-width:${maxWidth};`;
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
    let height = this.audioNoThumb ? "60px" : "unset",
      paddingTop =
        this.fullscreen || this.audioNoThumb || this.audioOnly || this.height
          ? `unset`
          : `${100 / this.aspect}%`,
      thumbnail =
        this.poster && (this.isYoutube || this.audioOnly)
          ? `background-image:url('${this.poster}');`
          : ``;
    return `height:${height};padding-top:${paddingTop};${thumbnail}`;
  }

  /**
   * `poster`  image for video
   * @readonly
   * @returns {string} url for poster image
   */
  get poster() {
    let thumbnail = this.thumbnailSrc
      ? this.thumbnailSrc
      : this.media && !this.media.poster
        ? this.media.poster
        : false;
    return !this.thumbnailSrc && this.youtubeId
      ? `https://img.youtube.com/vi/${this.youtubeId.replace(
          /[\?&].*/,
          "",
        )}/hqdefault.jpg`
      : thumbnail;
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
  get currentTime() {
    let slider = this.shadowRoot
      ? this.shadowRoot.querySelector("#slider")
      : false;
    let currentTime =
      slider && !slider.disabled && slider.dragging
        ? this.shadowRoot.querySelector("#slider").immediateValue
        : this.__currentTime;
    return currentTime;
  }

  /**
   * gets the link for sharing the video at a specific timecode
   * @readonly
   * @returns {string} url for sharing the video
   */
  get shareLink() {
    let url = globalThis.location.href.split(/[#?]/)[0],
      id = this.id ? `?id=${this.id}` : ``,
      currentTime =
        id !== "" && this.currentTime && this.currentTime !== 0
          ? `&t=${this.currentTime}`
          : ``;
    return `${url}${id}${currentTime}`;
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
          ${this._getHHMMSS(this.currentTime, this.duration)}/${this._getHHMMSS(
            this.duration,
          )}
        `
      : !this.isYoutube
        ? this._getLocal(this.localization, "loading", "label")
        : this.__playing
          ? this._getLocal(this.localization, "youTubeLoading", "label")
          : this._getLocal(this.localization, "youTubeLoading", "startLoading");
  }

  /**
   * Show custom CC (for audio and YouTube)?
   * @returns {boolean} Should the player show custom CC?
   */
  get stickyMode() {
    return this.sticky && this.stickyCorner !== "none";
  }

  /**
   * gets initial timecode parameter
   * @readonly
   * @returns {array} array of cues
   */
  get t() {
    let t = this._getSeconds(
      this.anchor.params.t || this.anchor.params.start || `0s`,
    );
    if (this.anchor && this.anchor.target === this) return t;
    if (this.videoData) return this.videoData.t || this.videoData.start;
  }

  /**
   * gets transcript cues that should be visible
   * @readonly
   * @returns {array} array of cues
   */
  get transcriptCues() {
    let cues = !this.cues ? [] : this.cues.slice();
    return cues.filter((cue) => cue.track === this.transcriptTrack);
  }

  /**
   * gets options for transcript picker
   *
   * @readonly
   * @memberof A11yMediaPlayer
   */
  get transcriptPicker() {
    let options = {};
    options[-1] = this._getLocal(this.localization, "transcript", "off");
    Object.keys(
      this.loadedTracks && this.loadedTracks.textTracks
        ? this.loadedTracks.textTracks
        : {},
    ).forEach((key) => {
      options[key] =
        this.loadedTracks.textTracks[key].label ||
        this.loadedTracks.textTracks[key].language;
    });
    return options;
  }

  /**
   * `key` of selected textTrack based on `transcriptTrack` and `hide-transcript` values
   */
  get transcriptTrackKey() {
    return this.hideTranscript ? -1 : this._getTrackId(this.transcriptTrack);
  }

  get videoData() {
    if (this.youtubeId) {
      let videoData = this.youtubeId.split(/[\?\&]/),
        params = {};
      params.videoId = videoData[0];
      videoData.forEach((param, index) => {
        if (index > 0) {
          let data = param.split(/=/);
          params[data[0]] = this._getSeconds(data[1]);
        }
      });
      return params;
    }
  }
  get videoId() {
    if (this.videoData) return this.videoData.videoId;
  }

  /**
   * youtube embed element
   * @readonly
   * @returns {object} a11y-media-youtube element
   */
  get youtube() {
    return this.shadowRoot.querySelector("a11y-media-youtube") !== null
      ? this.shadowRoot.querySelector("a11y-media-youtube")
      : false;
  }

  _setAttribute(attr, val) {
    if (!val) {
      this.removeAttribute(attr);
    } else {
      this.setAttribute(attr, val);
    }
  }

  /**
   * @param {map} changedProperties the properties that have changed
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "learningMode"  && typeof oldValue !== "undefined") {
        this.disableSeek = this[propName];
        this.hideTranscript = this[propName];
      }
      let change = (params) => params.includes(propName),
        mediaChange = (param) =>
          change(["__loadedTracks", "youtubeId", "media", param]),
        flexChange = change([
          "standAlone",
          "hideTranscript",
          "audioNoThumb",
          "stackedLayout",
          "__cues",
        ]),
        media = this.media ? this.media : this.__loadedTracks;

      if (propName === "id" && this.id === null)
        this.id = "a11y-media-player" + Date.now();

      if (change(["media", "muted"])) this._handleMuteChanged();
      if (change(["media", "volume"])) this.setVolume(this.volume);
      if (change(["media", "autoplay"]) && this.autoplay) this.play();

      /* updates captions */
      if (propName === "__captionsOption") this._captionsOptionChanged();
      if (change(["cc", "captionsTrack"])) this._captionsChanged();

      /* updates layout */
      if (flexChange) this._setAttribute("flex-layout", this.flexLayout);
      if (flexChange || propName === "responsiveSize")
        this._setAttribute("full-flex", this.fullFlex);
      if (change(["sticky", "sticky-corner", "__playing"]))
        this._setAttribute("sticky-mode", this.stickyMode && this.__playing);
      if (change(["height"])) {
        this.style.setProperty(
          "--a11y-media-player-height",
          this.height ? this.height : "unset",
        );
        this.style.setProperty(
          "--a11y-media-transcript-max-height",
          this.height ? "146px" : "unset",
        );
      }

      /* updates media */
      if (this.media !== null) {
        if (mediaChange("cc"))
          this._setAttribute("cc", this.cc, this.__loadedTracks);
        if (mediaChange("isYoutube") && this.__loadedTracks)
          this.__loadedTracks.hidden === this.isYoutube;
        if (mediaChange("mediaLang"))
          this._setAttribute("lang", this.mediaLang, media);
        if (mediaChange("loop")) this._setAttribute("loop", this.loop, media);
        if (mediaChange("playbackRate"))
          this._setAttribute("playbackRate", this.playbackRate, media);
        if (mediaChange("isYoutube"))
          this._setAttribute(
            "poster",
            !this.isYoutube ? this.thumbnailSrc : false,
            this.__loadedTracks,
          );
        if (
          change(["isYoutube", "poster", "media", "audioOnly"]) &&
          this.poster &&
          !this.isYoutube &&
          !this.audioOnly &&
          !this.media.poster
        )
          this.media.poster = this.poster;
      }

      this.dispatchEvent(
        new CustomEvent(
          `${propName
            .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
            .toLowerCase()}-changed`,
          { detail: { value: this[propName] } },
        ),
      );
    });
  }

  /**
   * updates track mode & `__captionsOption` when `captionsTrack` or `cc` changes
   */
  _captionsChanged() {
    let ccNum = -1;
    Object.keys(this.loadedTracks.textTracks).forEach((key) => {
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
    Object.keys(this.loadedTracks.textTracks).forEach((key) => {
      let showing = parseInt(key) == parseInt(this.__captionsOption);
      this.loadedTracks.textTracks[key].mode = showing ? "showing" : "hidden";
      if (showing) this.captionsTrack = this.loadedTracks.textTracks[key];
    });
  }

  /**
   * handles mute change
   */
  _handleMuteChanged() {
    if (this.media) {
      this.media.muted = this.muted;
    }
    /**
     * Fires when closed caption is toggled
     * @event mute-changed
     */
    this.dispatchEvent(
      new CustomEvent("mute-changed", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this,
      }),
    );
  }

  /**
   * gets download data for the active transcript
   * @param {string} the title of the media
   */
  download() {
    let a = globalThis.document.createElement("a"),
      title =
        this.mediaTitle && this.mediaTitle.trim() != ""
          ? `${this.mediaTitle} (${this._getLocal(
              this.localization,
              "transcript",
              "label",
            )})`
          : this._getLocal(this.localization, "transcript", "label"),
      filename = title.replace(/[^\w\d]/g, ""),
      cues = this.transcriptTrack.cues,
      data = Object.keys(cues)
        .map(
          (key) =>
            `${this._getHHMMSS(cues[key].startTime)} - ${this._getHHMMSS(
              cues[key].endTime,
            )}: \t${cues[key].text.replace(/[\n\r\s*]/g, " ")}\n`,
        )
        .join("");
    a.setAttribute(
      "href",
      "data:text/plain;charset=UTF-8," +
        encodeURIComponent(title + "\n" + data),
    );
    a.setAttribute("download", filename + ".txt");
    a.style.display = "none";
    globalThis.document.body.appendChild(a);
    a.click();
    globalThis.document.body.removeChild(a);
    /**
     * Fires when transcript is downloaded
     * @event transcript-downloaded
     */
    this.dispatchEvent(
      new CustomEvent("transcript-downloaded", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this,
      }),
    );
  }

  /**
   * takes the user to YouTube
   */
  goToYoutube() {
    globalThis.open(`https://www.youtube.com/watch?v=${this.youtubeId}`);
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
              "label",
            )})`
          : this._getLocal(this.localization, "transcript", "label"),
      print = globalThis.open(
        "",
        "",
        "left=0,top=0,width=552,height=477,toolbar=0,scrollbars=0,status =0",
      );
    print.document.body.innerHTML = `
     <h1>${title}</h1>
     ${Object.keys(cues)
       .map(
         (key) =>
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
       </div>`,
       )
       .join("")}
     `;
    print.document.close();
    print.focus();
    print.print();
    print.addEventListener("afterprint", (event) => {
      print.close();
    });

    /**
     * Fires when transcript is printed
     * @event transcript-printed
     */
    this.dispatchEvent(
      new CustomEvent("transcript-printed", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this,
      }),
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
    this.dispatchEvent(
      new CustomEvent("play", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this,
      }),
    );
    /**
     * DEPRECATED: Fires when media plays
     * @event a11y-player-playing
     */
    this.dispatchEvent(
      new CustomEvent("a11y-player-playing", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this,
      }),
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
    this.dispatchEvent(
      new CustomEvent("pause", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this,
      }),
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
    this.dispatchEvent(
      new CustomEvent("stop", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this,
      }),
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
    this.dispatchEvent(
      new CustomEvent("restart", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this,
      }),
    );
  }

  /**
   * seeks media backward at a set increment
   * @param {float} the elepsed time, in seconds
   */
  rewind(amt) {
    amt = amt !== undefined ? amt : this.duration / 20;
    this.seek(this.currentTime - amt, 0);
    /**
     * Fires when media moves backward
     * @event backward
     */
    this.dispatchEvent(
      new CustomEvent("backward", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this,
      }),
    );
  }

  /**
   * seeks media forward at a set increment
   * @param {float} the elepsed time, in seconds
   */
  forward(amt) {
    amt = amt !== undefined ? amt : this.duration / 20;
    this.seek(this.currentTime + amt);
    /**
     * Fires when media moves forward
     * @event forward
     */
    this.dispatchEvent(
      new CustomEvent("forward", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this,
      }),
    );
  }

  /**
   * seeks to a specific time
   * @param {float} the time, in seconds, to seek
   */
  seek(time = 0) {
    if (this.mediaSeekable) {
      this.media.seek(Math.max(0, Math.min(time, this.duration)));
      this._handleTimeUpdate();
      /**
       * Fires when media seeks
       * @event seek
       */
      this.dispatchEvent(
        new CustomEvent("seek", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: this,
        }),
      );
    }
  }

  /**
   * Event version for Lit version requirements
   */
  selectCaptionByKeyEvent(e) {
    this.selectCaptionByKey(e.detail.value);
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
   * Event version for Lit version requirements
   */
  selectTranscriptByKeyEvent(e) {
    if (this.__playerReady && this.__settingsOpen) {
      this.selectTranscriptByKey(e.detail.value);
    }
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
    let media = this.querySelector("audio,video"),
      crossorigin = media ? media.getAttribute("crossorigin") : undefined,
      primary = null,
      sourceVideo =
        this.source && !this.source && this.source.match(/webm|ogv|mov|mp4$/),
      sourcesVideo =
        (this.sources || []).filter((source) =>
          `${source.type || ""}${source.kind || ""}`.match(
            /video|mp4|webm|ogv/,
          ),
        ).length > 0,
      hasVideo = this.isYoutube || sourceVideo || sourcesVideo;

    if (media) {
      if (!crossorigin) media.setAttribute("crossorigin", this.crossorigin);
      media.removeAttribute("autoplay");
      media.removeAttribute("controls");
      media.setAttribute("preload", "metadata");
    }

    if (!this.youtubeId) {
      let iframeSrc =
          this.querySelector("iframe") && this.querySelector("iframe")
            ? this.querySelector("iframe").src
            : false,
        yt = iframeSrc
          ? iframeSrc.match(/youtube(-\w*)*.com/) ||
            iframeSrc.src.match(/youtu.be/)
          : false;
      if (yt && iframeSrc) {
        this.youtubeId = iframeSrc.replace(/.*\//g, "");
        hasVideo = true;
        this.querySelector("iframe").remove();
      }
    }

    if (!media) {
      primary = globalThis.document.createElement(
        this.querySelectorAll('source[type*="audio"]').length > 0 || !hasVideo
          ? "audio"
          : "video",
      );
      if (!crossorigin) primary.setAttribute("crossorigin", this.crossorigin);
      primary.setAttribute("preload", "metadata");
      this.querySelectorAll("source,track").forEach((node) => {
        if (node.parentNode === this) primary.appendChild(node);
      });
      this.appendChild(primary);
    } else {
      primary = media;
    }
    this.audioOnly = primary.tagName === "AUDIO";
    primary.style.width = "100%";
    primary.style.maxWidth = "100%";

    /* handle deprecated tracks */
    (this.tracks || []).forEach((track) => {
      let node = globalThis.document.createElement("track");
      Object.keys(track).forEach((key) => node.setAttribute(key, track[key]));
      primary.appendChild(node);
    });

    /* handle deprecated sources */
    (this.sources || []).forEach((source) => {
      let node = globalThis.document.createElement("source");
      Object.keys(source).forEach((key) => node.setAttribute(key, source[key]));
      primary.appendChild(node);
    });
    /* provides a seek function for primary media */
    primary.seek = (time) => (primary.currentTime = time);
    this._addSourcesAndTracks(primary, primary);
    return primary;
  }

  /**
   * selects a specific transcript track
   * @param {track} track text track
   */
  _getTrack(track) {
    if (!track) {
      let defaultTracks = this.loadedTracks.textTracks.filter(
        (track) => track.default === true,
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
    globalThis.dispatchEvent(
      new CustomEvent("playback-rate-changed", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this,
      }),
    );
  }

  /**
   * set volume of media
   * @param {integer} the volume level from 0-100
   */
  setVolume(value = 70) {
    this.volume = Math.max(0, Math.min(value, 100));
    if (this.media) {
      this.media.volume = value / 100;
    }
    /**
     * Fires when video volume changes
     * @event volume-changed
     */
    globalThis.dispatchEvent(
      new CustomEvent("volume-changed", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this,
      }),
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
    globalThis.dispatchEvent(
      new CustomEvent("cc-toggle", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this,
      }),
    );
  }
  /**
   * element to make fullscreen, can be overidden
   *
   * @readonly
   */
  get fullscreenTarget() {
    return this.shadowRoot && this.shadowRoot.querySelector("#player-section")
      ? this.shadowRoot.querySelector("#player-section")
      : this;
  }

  /**
   * toggles fullscreen
   * @param {boolean} Toggle fullscreen on? `true` is on, `false` is off, and `null` toggles based on current state.
   */
  toggleFullscreen(mode) {
    super.toggleFullscreen(mode);

    /**
     * Fires when fullscreen is toggled
     * @event fullscreen-toggle
     */
    globalThis.dispatchEvent(
      new CustomEvent("fullscreen-toggle", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this,
      }),
    );
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
    globalThis.dispatchEvent(
      new CustomEvent("loop-toggle", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this,
      }),
    );
  }

  /**
   * toggles play
   * @param {boolean} Toggle play/pause? `true` is on, `false` is off, and `null` toggles based on current state.
   */
  togglePlay() {
    if (this.__playing) {
      this.pause();
    } else {
      this.play();
    }
    /**
     * Fires when play/pause is toggled
     * @event play-toggle
     */
    globalThis.dispatchEvent(
      new CustomEvent("play-toggle", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this,
      }),
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
    globalThis.dispatchEvent(
      new CustomEvent("muted-toggle", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this,
      }),
    );
  }
  toggleSettings(mode) {
    mode = mode === undefined ? !this.__settingsOpen : mode;
    this.__settingsOpen = mode;
    /**
     * Fires when video's settings menu is toggled
     * @event settings-toggled
     */
    this.dispatchEvent(
      new CustomEvent("settings-toggled", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this,
      }),
    );
  }

  /**
   * toggles sticky attribute
   * @param {boolean} Toggle sticky mode on? `true` is on, `false` is off, and `null` toggles based on current state.
   */
  toggleSticky(mode) {
    mode = mode === undefined ? !this.sticky : mode;
    //only toggle if not already in correct mode
    if (this.sticky === mode) return;
    this.sticky = mode;
    /**
     * Fires when video's sticky behavior is toggled
     * @event player-sticky
     */
    this.dispatchEvent(
      new CustomEvent("player-sticky", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this,
      }),
    );
  }

  /**
   * toggles transcript
   * @param {boolean} Toggle transcript on? `true` is on, `false` is off, and `null` toggles based on current state.
   */
  toggleTranscript(mode) {
    mode = mode === undefined ? this.hideTranscript : mode;
    if (mode && !this.selectTranscriptByKey > -1) this.selectTranscriptByKey(0);
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
        detail: this,
      }),
    );
  }

  /**
   * loads a track's cue metadata
   * @param {object} HTML audio or video object
   */
  _addSourcesAndTracks(media) {
    media.style.width = "100%";
    media.style.maxWidth = "100%";
    Object.keys(media.textTracks).forEach((track) =>
      this._onAddTrack(media.textTracks[track]),
    );
    media.textTracks.onremovetrack = (e) => this._onRemoveTrack(e.track);
    media.textTracks.onaddtrack = (e) => this._onAddTrack(e.track);

    let d = media.querySelector("track[default]")
        ? media.querySelector("track[default]")
        : media.querySelector("track"),
      defaultTrack =
        Object.keys(media.textTracks).find((key) => {
          return (
            d.label === media.textTracks[key].label &&
            d.kind === media.textTracks[key].kind &&
            d.srclang === media.textTracks[key].scrlang
          );
        }) || 0;
    this.captionsTrack = media.textTracks[defaultTrack];
    if (!this.hideTranscript) this.transcriptTrack = this.captionsTrack;
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
  }

  /**
   * handles copying the share link
   */
  _handleCopyLink() {
    let el = globalThis.document.createElement("textarea");
    this.pause();
    el.value = this.shareLink;
    globalThis.document.body.appendChild(el);
    el.select();
    globalThis.document.execCommand("copy");

    globalThis.document.body.removeChild(el);
    globalThis.SimpleToast.requestAvailability().showSimpleToast({
      detail: {
        duration: 3000,
        text: `Copied to clipboard: ${this.shareLink}`,
      },
    });
  }

  /**
   * handles the seek function when a transcript cue is activated
   *
   * @param {event} e seek event
   */
  _handleCueSeek(cue) {
    if (!this.standAlone) {
      this.seek(cue.startTime);
    }
  }

  /**
   * handles media metadata when media is loaded
   */
  _handleMediaLoaded(e) {
    this._handleTimeUpdate();
    if (!this.youtubeId && this.anchor.target === this) {
      this.seek(
        this._getSeconds(
          this.anchor.params.t || this.anchor.params.start || `0s`,
        ),
      );
    }
  }

  /**
   * sets search the simple-search element
   * @param {event} e searchbar event
   */
  _handleSearchAdded(e) {
    this.search = e.detail;
  }

  /**
   * handles speed slider change thhat sets playback rate
   * @param {event} e slider event
   */
  _handleSpeedChanged(e) {
    var target = normalizeEventPath(e)[0];
    this.setPlaybackRate(target.value);
  }

  /**
   * handles duration slider dragging with a mouse
   * @param {event} e slider start event
   */
  _handleSliderDragging(e) {
    let slider = this.shadowRoot
      ? this.shadowRoot.querySelector("#slider")
      : false;
    if (slider && !slider.disabled && slider.dragging) {
      if (this.__playing && slider.dragging) {
        let startDrag = setInterval(() => {
          if (!slider.dragging) {
            this.play();
            clearInterval(startDrag);
          }
        });
        this.pause();
      }
    }
  }

  /**
   * handles duration slider dragging with a mouse
   * @param {event} e slider start event
   */
  _handleSliderChanged(e) {
    let slider = this.shadowRoot
      ? this.shadowRoot.querySelector("#slider")
      : false;
    if (!this.playing || slider.immediateValue == this.__currentTime) {
      this.seek(slider.immediateValue);
    }
  }

  /**
   * handles time updates
   */
  _handleTimeUpdate() {
    if (!this.__wait) {
      /* update current time with media's current time property */
      this.__currentTime =
        this.media && this.media.currentTime && this.media.currentTime > 0
          ? this.media.currentTime
          : 0;
      this.__wait = true;
      setTimeout(() => {
        this.__wait = false;
      }, 1000);
    }
  }

  /**
   * gets `key` of given track
   *
   * @param {object} track textTrack
   * @returns {number} key
   */
  _getTrackId(track) {
    return this.loadedTracks
      ? Object.keys(this.loadedTracks.textTracks).find(
          (key) => this.loadedTracks.textTracks[key] === track,
        ) || -1
      : -1;
  }

  /**
   * handles volume slider change
   * @param {event} e volume change event
   */
  _handleVolumeChanged(e) {
    var target = normalizeEventPath(e)[0];
    this.volume = target.value;
  }

  /**
   * adds a track's cues to cues array
   * @param {object} textTrack
   */
  _onAddTrack(track) {
    if (this.captionsTrack === null) this.captionsTrack = track;
    if (track) track.mode = "hidden";
    let loadCueData = setInterval(() => {
      if (track.cues && track.cues.length > 0) {
        clearInterval(loadCueData);
        let cues = Object.keys(track.cues).map((key) => track.cues[key]);
        this._onRemoveTrack(track); //prevents duplicate tracks
        this.__cues = this.cues.concat(cues).sort((a, b) => {
          let start = a.startTime - b.startTime,
            end = a.endTime - b.endTime;
          return start !== 0 ? start : end !== 0 ? end : a.track - b.track;
        });
      }
    });
  }

  /**
   * removes a track's cues from cues array
   * @param {object} textTrack
   */
  _onRemoveTrack(track) {
    if (this.loadedTracks && this.loadedTracks.textTracks)
      Object.keys(this.loadedTracks.textTracks).filter(
        (textTrack) => this.loadedTracks.textTracks[textTrack] !== track,
      );
    this.__cues = this.cues
      ? this.cues.filter((cue) => cue.track !== track)
      : [];
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.style.setProperty(
      "--a11y-media-transcript-max-height",
      this.height ? "146px" : "unset",
    );
    this.__loadedTracks = this.getloadedTracks();
    this._handleMediaLoaded();
    this.__loadedTracks.addEventListener("loadedmetadata", (e) =>
      this._handleMediaLoaded(e),
    );
    this.__loadedTracks.addEventListener("timeupdate", (e) => {
      this._handleTimeUpdate(e);
    });
    /**
     * Fires player needs the size of parent container to add responsive styling
     * @event responsive-element
     */
    globalThis.dispatchEvent(
      new CustomEvent("responsive-element", {
        detail: {
          element: this,
          attribute: "responsive-size",
          relativeToParent: true,
          sm: 400,
          md: 700,
          lg: 1000,
          xl: 1500,
        },
      }),
    );
    /**
     * Fires when a new player is ready for a11y-media-state-manager
     * @event a11y-player
     */
    globalThis.dispatchEvent(
      new CustomEvent("a11y-player", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this,
      }),
    );
    this.__playerReady = true;
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
   * handles transcript scroll toggle
   * @param {event} e scroll event
   */
  _transcriptScroll(e) {
    this.disableScroll = !this.disableScroll;
  }

  /**
   * converts time in millesconds to HH:MM:SS
   *
   * @param {float} the progress, in seconds
   * @param {float} the duration, in seconds
   * @returns {string} a human-readable string of progress/duration in HH:MM:SS
   *
   */
  _getHHMMSS(val, max) {
    val = parseFloat(val);
    max = max === undefined ? val : parseFloat(max);
    let a = (val) => {
        return val < 10 ? `0${val}` : val;
      },
      b = (val, i, none) => {
        return max >= i ? a(Math.floor(val / i)) + ":" : none;
      },
      c = (val) => {
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
customElements.define(A11yMediaPlayer.tag, A11yMediaPlayer);
export { A11yMediaPlayer };

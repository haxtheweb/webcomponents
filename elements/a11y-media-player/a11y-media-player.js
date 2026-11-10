/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css, nothing } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import {
  DDDBlockStyles,
  renderDDDBlockHeader,
} from "@haxtheweb/d-d-d/lib/DDDBlock.js";
import { DDDAccentStyles } from "@haxtheweb/d-d-d/lib/DDDAccent.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import { FullscreenBehaviors } from "@haxtheweb/fullscreen-behaviors/fullscreen-behaviors.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";
import "@haxtheweb/anchor-behaviors/anchor-behaviors.js";
import "@haxtheweb/responsive-utility/responsive-utility.js";
import { normalizeEventPath } from "@haxtheweb/utils/lib/events.js";
import {
  activityId,
  buildStatement,
  xapiDuration,
  XAPI_ACTIVITY_TYPES,
  XAPI_EXTENSIONS,
} from "@haxtheweb/user-action/lib/xapi.js";

// learner data milestones, as the share of the media actually watched.
// Completion is 95%, not 100%: YouTube often stops reporting time a moment
// before the very end, so an exact 100% may never be reached.
export const MEDIA_WATCH_HALF = 0.5;
export const MEDIA_WATCH_DONE = 0.95;
// the largest jump in media time still counted as watching; anything bigger
// is a seek (YouTube reports every 250ms, HTML5 every ~250ms, fast playback
// at 2x moves about 0.5s between reports)
const MEDIA_WATCH_MAX_STEP = 3;
// playing on into the end of the media completes it once at least this
// share was actually watched (a few seconds can go unreported: background
// tabs, stalls, YouTube stopping its reports just before the end); seeking
// to the end and letting it run out does not reach it
export const MEDIA_WATCH_END_MIN = 0.8;
// the end of the media: its last 5%, at least 1 and at most 3 seconds
const MEDIA_END_WINDOW_MIN = 1;
const MEDIA_END_WINDOW_MAX = 3;
// xAPI video profile extension: share of the media watched, 0 to 1
export const XAPI_MEDIA_PROGRESS =
  "https://w3id.org/xapi/video/extensions/progress";
// learner profile / browser storage key for the viewer's transcript placement
export const A11Y_MEDIA_LAYOUT_PREFERENCE = "a11y-media-transcript-layout";
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
import { removeThroughLast } from "@haxtheweb/utils/lib/safe-html.js";
import { whenIdle } from "@haxtheweb/utils/lib/idle.js";

/**
 * Plain readable text for a WebVTT cue. Cue text can carry markup such as
 * voice spans (<v Speaker>...</v>), class spans and timestamp tags, which
 * must not be shown to the reader. The browser's own cue parser is used when
 * available; otherwise tags are dropped by a single linear scan and the
 * common character references are decoded.
 * @param {object} cue a VTTCue / TextTrackCue, or any object with `text`
 * @returns {string}
 */
export function cueToText(cue) {
  if (!cue) {
    return "";
  }
  if (typeof cue.getCueAsHTML === "function") {
    try {
      const fragment = cue.getCueAsHTML();
      if (fragment && typeof fragment.textContent === "string") {
        return fragment.textContent;
      }
    } catch {
      // fall through to the manual scan
    }
  }
  return stripCueTags(typeof cue.text === "string" ? cue.text : "");
}

/**
 * Drop WebVTT cue tags and decode the character references WebVTT allows.
 * @param {string} text raw cue text
 * @returns {string}
 */
export function stripCueTags(text) {
  let out = "";
  let inTag = false;
  for (const ch of String(text)) {
    if (ch === "<") {
      inTag = true;
    } else if (inTag) {
      if (ch === ">") {
        inTag = false;
      }
    } else {
      out += ch;
    }
  }
  // decode &amp; last so an encoded entity is never decoded twice
  return out
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&lrm;/g, "‎")
    .replace(/&rlm;/g, "‏")
    .replace(/&amp;/g, "&");
}

/**
 * Escape text for insertion into an HTML string.
 * @param {string} text
 * @returns {string}
 */
function escapeHTML(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

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
`--a11y-media-color` | default text color | `light-dark(--ddd-theme-default-coalyGray, --ddd-theme-default-white)`
`--a11y-media-bg-color` | default background color | `light-dark(--ddd-theme-default-limestoneMaxLight, --ddd-theme-default-potentialMidnight)`
`--a11y-media-border-color` | default border color | `light-dark(--ddd-theme-default-limestoneLight, --ddd-theme-default-coalyGray)`
`--a11y-media-hover-color` | text color when hovering | `light-dark(--ddd-theme-default-black, --ddd-theme-default-white)`
`--a11y-media-hover-bg-color` | background color when hovering | `light-dark(--ddd-theme-default-limestoneMaxLight, --ddd-theme-default-potentialMidnight)`
`--a11y-media-accent-color` | accent color | `light-dark(--simple-colors-default-theme-accent-9, --simple-colors-dark-theme-accent-9)`
`--a11y-media-faded-accent-color` | accent color when faded | `light-dark(--simple-colors-default-theme-accent-8, --simple-colors-dark-theme-accent-8)`
`--a11y-media-disabled-color` | color for disabled items | `light-dark(--ddd-theme-default-limestoneGray, --ddd-theme-default-coalyGray)`
`--a11y-media-transcript-color` | default text color of transcript | `light-dark(--ddd-theme-default-coalyGray, --ddd-theme-default-white)`
`--a11y-media-transcript-bg-color` | default background color of transcript | `light-dark(--ddd-theme-default-white, --ddd-theme-default-potentialMidnight)`
`--a11y-media-transcript-accent-color` | default accent color of transcript | `light-dark(--simple-colors-default-theme-accent-8, --simple-colors-dark-theme-accent-8)`
`--a11y-media-transcript-faded-accent-color` | accent color of transcript, faded | `light-dark(--simple-colors-default-theme-accent-10, --simple-colors-dark-theme-accent-10)`
`--a11y-media-transcript-cue-color` | text color of transcript cue | `--ddd-theme-default-black`
`--a11y-media-transcript-cue-bg-color` | background color of transcript cue  | `--ddd-theme-default-white`
`--a11y-media-transcript-active-cue-color` | text color of active transcript cue  | `--ddd-theme-default-black`
`--a11y-media-transcript-active-cue-bg-color` | background color of active transcript cue  | `--ddd-theme-default-white`
`--a11y-media-transcript-focused-cue-color` | text color of focused transcript cue  | `--ddd-theme-default-black`
`--a11y-media-transcript-focused-cue-bg-color` | background color of focused transcript cue  | `--ddd-theme-default-limestoneMaxLight`
`--a11y-media-transcript-match-color` | text color of matched term in transcript search  | `--ddd-theme-default-white`
`--a11y-media-transcript-match-bg-color` | background color of matched term in transcript search  | `--ddd-theme-default-black`
`--a11y-media-transcript-match-border-color` | border color of matched term in transcript search  | `--ddd-theme-default-black`
`--a11y-media-caption-color` | caption text color on the accent | `light-dark(--ddd-theme-default-white, --ddd-theme-default-black)`
 
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
  * @demo demo/index.html video demo
  * @demo ./demo/youtube.html YouTube demo
  */
class A11yMediaPlayer extends SchemaBehaviors(
  I18NMixin(FullscreenBehaviors(DDD)),
) {
  //styles function
  static get styles() {
    return [
      super.styles,
      DDDBlockStyles,
      DDDAccentStyles,
      css`
        :host {
          display: block;
          box-sizing: border-box;
          overflow: clip;
          /* a page or HAX alignment setting on a wrapper never centers the
             header, controls or transcript */
          text-align: start;
          font-family: var(--ddd-font-navigation);
          color: var(--a11y-media-color);
          background-color: var(--a11y-media-bg-color);
          border: var(--ddd-border-xs);
          border-color: var(--a11y-media-border-color);
          border-radius: var(--ddd-radius-md);
          --a11y-media-controls-font-family: var(--ddd-font-navigation);
          --a11y-media-player-height: unset;
          /* surface and text follow the page color scheme (light-dark) */
          --a11y-media-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --a11y-media-bg-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          --a11y-media-border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          --a11y-media-hover-color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
          --a11y-media-hover-bg-color: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-slateGray)
          );
          /* accent cascade: local accent-color (DDDAccentStyles), then the
             theme palette (data-primary), then the default DDD blue. Only
             the header chip and the seek fill / pin use it. */
          --a11y-media-accent-color: var(
            --ddd-accent-color,
            var(
              --ddd-theme-primary,
              light-dark(
                var(--ddd-theme-default-beaverBlue),
                var(--ddd-theme-default-skyBlue)
              )
            )
          );
          --a11y-media-accent-ink: var(
            --ddd-accent-color-ink,
            var(
              --ddd-theme-bgContrast,
              var(
                --lowContrast-override,
                light-dark(
                  var(--ddd-theme-default-white),
                  var(--ddd-theme-default-potentialMidnight)
                )
              )
            )
          );
          --a11y-media-faded-accent-color: var(--a11y-media-border-color);
          --a11y-media-disabled-color: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-slateLight)
          );
          --a11y-media-pressed-bg-color: light-dark(
            var(--ddd-theme-default-slateMaxLight),
            var(--ddd-theme-default-slateGray)
          );
          --a11y-media-pressed-border-color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
          --a11y-media-muted-color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );

          --a11y-media-settings-menu-color: var(--a11y-media-color);
          --a11y-media-settings-menu-bg-color: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-potentialMidnight)
          );
          --a11y-media-settings-menu-hover-color: var(--a11y-media-hover-color);
          --a11y-media-settings-menu-hover-bg-color: var(
            --a11y-media-hover-bg-color
          );
          --simple-fields-accent-color: var(--a11y-media-color);
          --simple-fields-background-color: transparent;
          --simple-fields-color: var(--a11y-media-color);
          --simple-fields-border-color: var(--a11y-media-border-color);
          --simple-fields-border-color-light: var(
            --a11y-media-border-color-light,
            var(--a11y-media-border-color)
          );

          /* controls are neutral; they never take the accent */
          --a11y-media-button-color: var(--a11y-media-color);
          --a11y-media-button-bg-color: transparent;
          --a11y-media-button-hover-color: var(--a11y-media-hover-color);
          --a11y-media-button-hover-bg-color: var(--a11y-media-hover-bg-color);
          --a11y-media-button-disabled-color: var(--a11y-media-disabled-color);
          --a11y-media-button-toggle-color: var(--a11y-media-hover-color);
          --a11y-media-button-toggle-bg-color: var(
            --a11y-media-pressed-bg-color
          );
          --a11y-media-button-border-radius: var(--ddd-radius-circle);

          /* sliders other than the seek slider stay neutral too */
          --simple-range-input-bg: var(--a11y-media-border-color);
          --simple-range-input-color: var(--a11y-media-color);
          --simple-range-input-track-height: var(--ddd-spacing-1);
          --simple-range-input-pin-height: var(--ddd-spacing-4);
          --simple-range-input-track-border-radius: var(--ddd-radius-rounded);

          --simple-toast-color: var(--a11y-media-color);
          --simple-toast-background-color: var(--a11y-media-bg-color);

          --a11y-media-transcript-color: var(--a11y-media-color);
          --a11y-media-transcript-bg-color: transparent;
          --a11y-media-transcript-accent-color: var(--a11y-media-color);
          --a11y-media-transcript-faded-accent-color: var(
            --a11y-media-muted-color
          );
          --a11y-media-transcript-cue-color: var(--a11y-media-color);
          --a11y-media-transcript-cue-bg-color: transparent;
          --a11y-media-transcript-active-cue-color: var(
            --a11y-media-hover-color
          );
          --a11y-media-transcript-active-cue-bg-color: light-dark(
            var(--ddd-theme-default-slateMaxLight),
            var(--ddd-theme-default-nittanyNavy)
          );
          --a11y-media-transcript-focused-cue-color: var(
            --a11y-media-hover-color
          );
          --a11y-media-transcript-focused-cue-bg-color: var(
            --a11y-media-hover-bg-color
          );
          --a11y-media-transcript-match-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          --a11y-media-transcript-match-bg-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-limestoneLight)
          );
          --a11y-media-transcript-match-border-color: var(
            --a11y-media-transcript-match-bg-color
          );
          --a11y-media-caption-color: var(--a11y-media-accent-ink);

          /* the header chip takes the accent (or palette) */
          --ddd-block-chip-background: var(--a11y-media-accent-color);
          --ddd-block-chip-color: var(--a11y-media-accent-ink);
        }

        /* accent-color defaults to grey (SimpleColors), which means no
           accent was picked: fall back to the palette / DDD default */
        :host(:not([accent-color])),
        :host([accent-color="grey"]),
        :host([accent-color=""]),
        :host([accent-color="undefined"]),
        :host([accent-color="null"]) {
          --ddd-accent-color: initial;
          --ddd-accent-color-ink: initial;
          --ddd-accent-color-tint: initial;
          --ddd-block-accent: initial;
        }

        /* dark: the whole player uses the dark side of every light-dark pair */
        :host([dark]) {
          color-scheme: dark;
        }

        :host *::-webkit-scrollbar {
          width: var(--a11y-media-scrollbar-width, 5px);
        }

        :host([hidden]),
        *[hidden] {
          display: none !important;
        }

        .ddd-block-header {
          background-color: var(--a11y-media-bg-color);
        }

        /* header actions: neutral, round, DDD block action pattern */
        .ddd-block-action {
          color: var(--a11y-media-color);
          --simple-icon-width: var(--ddd-icon-3xs);
          --simple-icon-height: var(--ddd-icon-3xs);
        }
        .ddd-block-action[aria-pressed="true"],
        .ddd-block-action[aria-expanded="true"] {
          border-color: var(--a11y-media-pressed-border-color);
          background-color: var(--a11y-media-pressed-bg-color);
          color: var(--a11y-media-hover-color);
        }

        /* settings tray: a panel under the block header */
        #settings {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-3) var(--ddd-spacing-5);
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
          border-bottom: var(--ddd-border-xs);
          border-color: var(--a11y-media-border-color);
          color: var(--a11y-media-settings-menu-color);
          background-color: var(--a11y-media-settings-menu-bg-color);
          font-family: var(--a11y-media-controls-font-family);
        }
        .tray-group {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-1);
        }
        .tray-sub {
          display: inline-flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-1);
          margin-inline-start: var(--ddd-spacing-2);
        }
        .tray-label {
          margin-inline-end: var(--ddd-spacing-1);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
        }
        .seg {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
          box-sizing: border-box;
          min-height: var(--ddd-spacing-8);
          margin: 0;
          padding: 0 var(--ddd-spacing-3);
          border: var(--ddd-border-xs);
          border-color: var(--a11y-media-border-color);
          border-radius: var(--ddd-radius-rounded);
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          color: var(--a11y-media-color);
          font-family: var(--a11y-media-controls-font-family);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-120);
          cursor: pointer;
          --simple-icon-width: var(--ddd-icon-4xs);
          --simple-icon-height: var(--ddd-icon-4xs);
        }
        .seg:hover {
          border-color: var(--a11y-media-pressed-border-color);
        }
        .seg[aria-pressed="true"] {
          border-color: var(--a11y-media-pressed-border-color);
          background-color: var(--a11y-media-pressed-bg-color);
          font-weight: var(--ddd-font-weight-bold);
        }
        .seg[disabled] {
          border-style: dashed;
          cursor: default;
          opacity: 0.6;
        }
        .seg:focus-visible,
        .bar-btn:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        #speed {
          flex: 0 0 calc(var(--ddd-spacing-24) + var(--ddd-spacing-6));
        }
        .speed-value {
          min-width: var(--ddd-spacing-10);
          font-size: var(--ddd-font-size-4xs);
          font-variant-numeric: tabular-nums;
        }

        /* media and transcript: one column (below) or two (side) */
        #body {
          display: flex;
          flex-direction: column;
        }
        :host([full-flex]) #body {
          display: grid;
          grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
        }
        :host([full-flex]) #body[data-side="left"] {
          grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
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

        #player-section {
          color: var(--a11y-media-color);
          background-color: var(--a11y-media-bg-color);
        }

        :host > * {
          transition: all var(--ddd-duration-slow, 0.6s) ease-in-out;
        }

        #player-section,
        #player,
        #transcript-section,
        #transcript-and-controls {
          display: flex;
          flex-flow: column;
          align-items: stretch;
          align-content: stretch;
          min-width: 0;
        }

        #captionlink:link {
          text-decoration: none;
        }

        #player-and-controls,
        #player,
        #player > *,
        #cc-custom,
        #cc-text,
        #controls,
        #player-section,
        #transcript-section,
        #transcript-and-controls {
          width: 100%;
        }

        #player-and-controls,
        #player,
        #player > *,
        #cc-text {
          flex: 1 1 auto;
        }

        #player-and-controls {
          margin: 0 auto;
          display: flex;
        }

        #player {
          height: 400px;
          position: relative;
          background-color: var(--ddd-theme-default-potentialMidnight);
          background-size: cover;
          background-position: center;
        }

        #player-and-controls[audio-no-thumb] #player {
          background-color: transparent;
        }
        /* audio without a picture has no screen: the strip only opens to
           show captions */
        #player-and-controls[audio-no-thumb] #player:not(:has(#cc-custom)) {
          height: 0 !important;
          min-height: 0;
          overflow: hidden;
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

        /* seek slider: the accent fills the watched part and the pin */
        #slider {
          box-sizing: border-box;
          width: calc(100% - var(--ddd-spacing-6));
          margin: var(--ddd-spacing-3) var(--ddd-spacing-3) 0;
          --a11y-media-track-color: var(--a11y-media-border-color);
          --simple-range-input-color: var(--a11y-media-accent-color);
          --simple-range-input-bg: linear-gradient(
            to right,
            var(--a11y-media-accent-color) 0 var(--a11y-media-seek-pct, 0%),
            var(--a11y-media-track-color) var(--a11y-media-seek-pct, 0%) 100%
          );
        }
        :host(:dir(rtl)) #slider {
          --simple-range-input-bg: linear-gradient(
            to left,
            var(--a11y-media-accent-color) 0 var(--a11y-media-seek-pct, 0%),
            var(--a11y-media-track-color) var(--a11y-media-seek-pct, 0%) 100%
          );
        }

        a11y-media-youtube {
          opacity: 1;
          transition: opacity var(--ddd-duration-slow, 0.6s);
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
          transition: all var(--ddd-duration-slow, 0.6s) ease-in-out;
        }

        #player-and-controls[audio-no-thumb] #cc-text {
          align-self: center;
          color: var(--a11y-media-color);
          background-color: transparent;
        }

        /* control bar under the media: play, back, forward, mute, time */
        #controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--ddd-spacing-1);
          box-sizing: border-box;
          max-width: 100%;
          min-height: var(--ddd-control-height-sm);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
          position: relative;
          color: var(--a11y-media-color);
          background-color: var(--a11y-media-bg-color);
          --primary-text-color: var(--a11y-media-settings-menu-color);
        }

        #controls-left {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
          min-width: 0;
        }

        .play-status {
          border: none;
          position: relative;
          font-size: var(--ddd-font-size-4xs);
          font-family: var(--a11y-media-controls-font-family);
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
        }

        .play-status.control-bar {
          padding: 0 var(--ddd-spacing-2);
        }

        :host([hide-play-status]) .play-status {
          display: none;
        }

        #volume-and-mute {
          display: inline-flex;
          position: relative;
        }

        #volume {
          position: absolute;
          left: var(--ddd-spacing-10);
          top: 0;
          width: 0;
          height: var(--ddd-control-height-sm);
          overflow: hidden;
          transition: width var(--ddd-duration-slow, 0.6s);
          z-index: 3;
          border-radius: var(--ddd-radius-rounded);
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

        /* transcript: search row, then the cues */
        #transcript-section {
          border-top: var(--ddd-border-xs);
          border-color: var(--a11y-media-border-color);
          color: var(--a11y-media-transcript-color);
          background-color: var(--a11y-media-bg-color);
        }
        :host([full-flex]) #transcript-section {
          /* the media column sets the height; the transcript scrolls */
          contain: size;
          min-height: 0;
          border-top: none;
          border-inline-start: var(--ddd-border-xs);
          border-color: var(--a11y-media-border-color);
        }
        :host([full-flex]) #body[data-side="left"] #transcript-section {
          order: -1;
          border-inline-start: none;
          border-inline-end: var(--ddd-border-xs);
          border-color: var(--a11y-media-border-color);
        }
        :host([dark-transcript]) #transcript-section {
          color-scheme: dark;
        }

        #transcript-and-controls {
          flex: 1 1 auto;
          min-height: 0;
        }

        #searchbar {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
          padding: var(--ddd-spacing-2);
          border-bottom: var(--ddd-border-xs);
          border-color: var(--a11y-media-border-color);
          color: var(--a11y-media-color);
          background-color: var(--a11y-media-transcript-bg-color);
        }

        #searching {
          flex: 1 1 auto;
          min-width: 0;
        }

        /* the search field: rounded, readable on light and dark */
        #simplesearch {
          align-items: center;
          box-sizing: border-box;
          min-height: var(--ddd-control-height-sm);
          padding-inline: var(--ddd-spacing-3) var(--ddd-spacing-1);
          border: var(--ddd-border-xs);
          border-color: var(--a11y-media-border-color);
          border-radius: var(--ddd-radius-rounded);
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          color: var(--a11y-media-color);
          --simple-search-input-background-color: transparent;
          --simple-search-input-text-color: var(--a11y-media-color);
          --simple-search-input-line-color: transparent;
          --simple-search-input-placeholder-color: var(
            --a11y-media-muted-color
          );
          --simple-search-button-color: var(--a11y-media-color);
          --simple-search-button-hover-color: var(--a11y-media-hover-color);
          --simple-search-button-bg-color: transparent;
          --simple-search-button-hover-bg-color: var(
            --a11y-media-hover-bg-color
          );
          --simple-search-button-border-color: transparent;
          --simple-search-button-hover-border-color: transparent;
          --simple-search-button-disabled-color: var(
            --a11y-media-disabled-color
          );
          --simple-search-button-disabled-bg-color: transparent;
          --simple-search-button-disabled-border-color: transparent;
          --simple-fields-border-color: transparent;
          --simple-fields-border-color-light: transparent;
          --simple-fields-accent-color: var(--a11y-media-color);
          --simple-fields-input-max-width: 100%;
          --simple-fields-font-size: var(--ddd-font-size-4xs);
          --simple-fields-placeholder-font-style: normal;
          --simple-fields-placeholder-opacity: 1;
          --simple-fields-placeholder-focus-opacity: 1;
          --simple-fields-placeholder-color: var(--a11y-media-muted-color);
          --simple-fields-placeholder-focus-color: var(
            --a11y-media-muted-color
          );
          --simple-fields-margin: 0;
          --simple-fields-margin-small: 0;
        }
        #simplesearch:focus-within {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }

        /* round neutral buttons in the transcript search row */
        .bar-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: none;
          box-sizing: border-box;
          width: var(--ddd-control-height-sm);
          height: var(--ddd-control-height-sm);
          margin: 0;
          padding: 0;
          border: var(--ddd-border-xs);
          border-color: transparent;
          border-radius: var(--ddd-radius-circle);
          background-color: transparent;
          color: var(--a11y-media-color);
          cursor: pointer;
          --simple-icon-width: var(--ddd-icon-3xs);
          --simple-icon-height: var(--ddd-icon-3xs);
        }
        .bar-btn:hover {
          background-color: var(--a11y-media-hover-bg-color);
          color: var(--a11y-media-hover-color);
        }

        #transcript {
          flex: 1 1 auto;
          min-height: 0;
          max-height: var(
            --a11y-media-transcript-max-height,
            calc(var(--ddd-spacing-24) * 2 + var(--ddd-spacing-12))
          );
          overflow-y: auto;
          color: var(--a11y-media-transcript-cue-color);
          background-color: var(--a11y-media-transcript-cue-bg-color);
        }
        :host([full-flex]) #transcript {
          max-height: none;
          flex-basis: 0;
        }

        #transcript::-webkit-scrollbar-track {
          background-color: var(--a11y-media-bg-color);
        }

        #transcript::-webkit-scrollbar-thumb {
          background-color: var(--a11y-media-border-color);
        }

        .transcript-from-track {
          display: block;
          padding: var(--ddd-spacing-1) 0;
          color: var(--a11y-media-transcript-cue-color);
        }

        #loading.transcript-from-track {
          padding: var(--ddd-spacing-3);
          font-size: var(--ddd-font-size-5xs);
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
            transition: all var(--ddd-duration-slow, 0.6s) ease-in-out;
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

          /* the block header shows the title, so the caption bar under the
             controls is kept for print and for styling hooks only */
          .screen-only.media-caption {
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
            color: var(--a11y-media-caption-color);
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

        @media (prefers-reduced-motion: reduce) {
          :host > *,
          #volume,
          #cc-custom,
          #cc-text,
          a11y-media-youtube {
            transition: none;
          }
        }

        @media print {
          :host,
          :host([dark]) {
            outline: 1px solid #aaaaaa;
            background-color: #ffffff;
            color-scheme: light;
          }

          .screen-only,
          .ddd-block-actions,
          #settings,
          #searchbar,
          #print-thumbnail:not([src]),
          :host(:not([thumbnail-src])) #player {
            display: none;
          }

          #body {
            display: block;
          }

          .media-caption {
            background-color: #cccccc;
            color: #000000;
            font-size: 120%;
          }

          #transcript {
            max-height: none;
            padding: 0 15px 5px;
            color: #000;
            background-color: #ffffff;
            border-top: 1px solid #aaa;
          }
        }
      `,
    ];
  }

  /**
   * One round header action (DDD block action pattern)
   * @param {Object} o id, icon, label, onClick, pressed, expanded,
   *   controls, hidden, disabled
   */
  _renderHeaderAction(o) {
    return html`<button
      type="button"
      class="ddd-block-action"
      id="${o.id}"
      data-action="${o.action}"
      aria-label="${o.label}"
      title="${o.label}"
      aria-pressed="${
        typeof o.pressed === "boolean" ? String(o.pressed) : nothing
      }"
      aria-expanded="${
        typeof o.expanded === "boolean" ? String(o.expanded) : nothing
      }"
      aria-controls="${o.controls || nothing}"
      ?hidden="${o.hidden}"
      ?disabled="${o.disabled}"
      @click="${o.onClick}"
    >
      <simple-icon-lite icon="${o.icon}" aria-hidden="true"></simple-icon-lite>
    </button>`;
  }

  /**
   * One pill button in the settings tray
   */
  _renderTrayButton(o) {
    return html`<button
      type="button"
      class="seg"
      id="${o.id || nothing}"
      data-action="${o.action || nothing}"
      data-value="${typeof o.value === "undefined" ? nothing : o.value}"
      aria-pressed="${
        typeof o.pressed === "boolean" ? String(o.pressed) : nothing
      }"
      ?hidden="${o.hidden}"
      ?disabled="${o.disabled}"
      @click="${o.onClick}"
    >
      ${
        o.icon
          ? html`<simple-icon-lite
              icon="${o.icon}"
              aria-hidden="true"
            ></simple-icon-lite>`
          : nothing
      }<span>${o.label}</span>
    </button>`;
  }

  /**
   * Visibility rules shared by the header actions and their tray copies
   */
  get _actionState() {
    const narrow = this._narrow;
    const noTranscript = !this.hasCaptions || this.learningMode;
    return {
      narrow,
      cc: !this.hasCaptions,
      transcript:
        !this.hasCaptions ||
        this.standAlone ||
        !!(this.height && narrow) ||
        this.learningMode,
      download: noTranscript || this.disablePrintButton,
      print: noTranscript || this.disablePrintButton,
      audioDescription: !this.audioDescriptionSource,
      // the share link follows linkable only (learning mode no longer
      // hides it; it keeps the viewer on the page)
      copyLink: !this.linkable,
      youtube: !this.isYoutube || this.learningMode || this.hideYoutubeLink,
      fullscreen: !this.fullscreenButton,
    };
  }

  /**
   * The actions that sit in the header at desktop widths and move to the
   * top of the settings tray at small widths, in order
   */
  get _movableActions() {
    const s = this._actionState;
    const actions = [
      {
        key: "cc",
        action: "captions",
        icon: "av:closed-caption",
        label: this.t.captionsLabel,
        pressed: this.captionsTrackKey > -1,
        hidden: s.cc,
        onClick: () => this.toggleCC(),
      },
      {
        key: "transcript",
        action: "transcript",
        icon: "description",
        label: this.t.transcriptLabel,
        pressed: !this.hideTranscript,
        controls: "transcript-section",
        hidden: s.transcript,
        onClick: () => this.toggleTranscript(),
      },
      {
        key: "download",
        action: "download",
        icon: "icons:file-download",
        label: this.t.downloadLabel,
        hidden: s.download,
        onClick: () => this.download(),
      },
      {
        key: "print",
        action: "print",
        icon: "print",
        label: this.t.printLabel,
        hidden: s.print,
        onClick: () => this.print(),
      },
      {
        key: "audio-description",
        action: "audio-description",
        icon: "av:audio-descriptive-track",
        label: this.t.audioDescriptionLabel,
        pressed: !!this.audioDescriptionEnabled,
        hidden: s.audioDescription,
        disabled: s.audioDescription,
        onClick: () => this._handleAudioDescriptionButtonClick(),
      },
      {
        key: "copy-link",
        action: "copy-link",
        icon: "link",
        label: this.t.copyLinkLabel,
        hidden: s.copyLink,
        disabled: s.copyLink,
        onClick: () => this._handleCopyLink(),
      },
      {
        key: "youtube",
        action: "youtube",
        icon: "mdi-social:youtube",
        label: this.t.openOnYouTube,
        hidden: s.youtube,
        onClick: () => this.goToYoutube(),
      },
    ];
    // Open on YouTube only exists for YouTube media, as before
    return actions.filter((a) => a.key !== "youtube" || this.isYoutube);
  }

  /**
   * Header actions, left to right: Closed Captions, Transcript, Download
   * Transcript, Print Transcript, Audio Description, Copy Media Link, Open
   * on YouTube (each only when it applies), Settings, Fullscreen. At small
   * widths only Settings and Fullscreen stay here; the rest move into the
   * top of the settings tray.
   */
  _renderHeaderActions() {
    const s = this._actionState;
    return html`${this._movableActions.map((a) =>
      this._renderHeaderAction({
        ...a,
        id: `header-${a.key}`,
        hidden: a.hidden || s.narrow,
      }),
    )}${this._renderHeaderAction({
      id: "settings-button",
      action: "settings",
      icon: "settings",
      label: this.t.settingsLabel,
      expanded: !!this.__settingsOpen,
      controls: "settings",
      onClick: () => this.toggleSettings(),
    })}${this._renderHeaderAction({
      id: "header-fullscreen",
      action: "fullscreen",
      icon: "fullscreen",
      label: this.t.fullscreenLabel,
      pressed: !!this.fullscreen,
      hidden: s.fullscreen,
      onClick: () => this.toggleFullscreen(),
    })}`;
  }

  /**
   * Track keys of the loaded text tracks, without the "Off" (-1) entry
   */
  _trackKeys(picker) {
    return Object.keys(picker || {}).filter((key) => key !== "-1");
  }

  /**
   * Settings tray: (small widths: captions, transcript, download, print),
   * layout, transcript track, captions track, speed, scroll and loop
   */
  _renderSettingsTray() {
    const s = this._actionState;
    const layoutHidden = !this._layoutChoiceAvailable;
    const layout = this.transcriptLayout;
    const side = this.transcriptSide;
    const transcriptKey = String(this.transcriptTrackKey);
    const captionsKey = String(this.captionsTrackKey);
    const transcriptPicker = this.transcriptPicker;
    const captionsPicker = this.captionsPicker;
    const speed = Math.round(Number(this.playbackRate || 1) * 100);
    return html`<div
      id="settings"
      class="tray"
      role="group"
      aria-label="${this.t.settingsLabel}"
      ?hidden="${!this.__settingsOpen}"
    >
      <div
        class="tray-group tray-actions"
        ?hidden="${!s.narrow || this._movableActions.every((a) => a.hidden)}"
      >
        ${this._movableActions.map((a) =>
          this._renderTrayButton({ ...a, id: `tray-${a.key}` }),
        )}
      </div>
      <div
        class="tray-group tray-layout"
        role="group"
        aria-labelledby="tray-layout-label"
        ?hidden="${layoutHidden}"
      >
        <span class="tray-label" id="tray-layout-label"
          >${this.t.layoutLabel}</span
        >
        ${this._renderTrayButton({
          action: "layout",
          value: "side",
          icon: "icons:view-column",
          label: this.t.sideLabel,
          pressed: layout === "side",
          onClick: () => this._setTranscriptLayout("side"),
        })}
        ${this._renderTrayButton({
          action: "layout",
          value: "below",
          icon: "icons:view-agenda",
          label: this.t.belowLabel,
          pressed: layout === "below",
          onClick: () => this._setTranscriptLayout("below"),
        })}
        <span
          class="tray-sub"
          role="group"
          aria-label="${this.t.sideLabel}"
          ?hidden="${layout !== "side"}"
        >
          ${this._renderTrayButton({
            action: "side",
            value: "left",
            label: this.t.leftLabel,
            pressed: side === "left",
            onClick: () => this._setTranscriptLayout("side", "left"),
          })}
          ${this._renderTrayButton({
            action: "side",
            value: "right",
            label: this.t.rightLabel,
            pressed: side === "right",
            onClick: () => this._setTranscriptLayout("side", "right"),
          })}
        </span>
      </div>
      <div
        class="tray-group tray-transcript"
        role="group"
        aria-labelledby="tray-transcript-label"
        ?hidden="${!this.hasCaptions || this.learningMode || this.standAlone}"
      >
        <span class="tray-label" id="tray-transcript-label"
          >${this.t.transcriptLabel}</span
        >
        ${this._renderTrayButton({
          action: "transcript-track",
          value: "-1",
          label: this._getTranslation("transcriptOff", "Off"),
          pressed: transcriptKey === "-1",
          onClick: () => this.selectTranscriptByKey(-1),
        })}
        ${this._trackKeys(transcriptPicker).map((key) =>
          this._renderTrayButton({
            action: "transcript-track",
            value: key,
            label: transcriptPicker[key],
            pressed: transcriptKey === key,
            onClick: () => this.selectTranscriptByKey(key),
          }),
        )}
      </div>
      <div
        class="tray-group tray-captions"
        role="group"
        aria-labelledby="tray-captions-label"
        ?hidden="${!this.hasCaptions}"
      >
        <span class="tray-label" id="tray-captions-label"
          >${this.t.captionsLabel}</span
        >
        ${this._renderTrayButton({
          action: "captions-track",
          value: "-1",
          label: this.t.captionsOff,
          pressed: captionsKey === "-1",
          onClick: () => this.selectCaptionByKey(-1),
        })}
        ${this._trackKeys(captionsPicker).map((key) =>
          this._renderTrayButton({
            action: "captions-track",
            value: key,
            label: captionsPicker[key],
            pressed: captionsKey === key,
            onClick: () => this.selectCaptionByKey(key),
          }),
        )}
      </div>
      <div class="tray-group tray-speed">
        <span class="tray-label" id="speed-label">${this.t.speedLabel}</span>
        <simple-range-input
          id="speed"
          aria-labelledby="speed-label"
          label="${this.t.speedLabel}"
          class="setting-slider setting-control"
          min="0.5"
          max="2.5"
          step="0.25"
          value="${this.playbackRate}"
          @value-changed="${this._handleSpeedChanged}"
        >
        </simple-range-input>
        <output class="speed-value" for="speed">${speed}%</output>
      </div>
      <div class="tray-group tray-toggles">
        ${this._renderTrayButton({
          id: "scroll",
          action: "scroll",
          icon: "icons:unfold-more",
          label: this.t.autoScrollLabel,
          pressed: !this.disableScroll,
          hidden: !this.hasCaptions || this.standAlone || this.learningMode,
          onClick: () => this._transcriptScroll(),
        })}
        ${this._renderTrayButton({
          id: "loop",
          action: "loop",
          icon: "av:loop",
          label: this.t.loopLabel,
          pressed: !!this.loop,
          onClick: () => this.toggleLoop(!this.loop),
        })}
      </div>
    </div>`;
  }

  // render function
  render() {
    const seekPct =
      this.duration > 0
        ? Math.max(0, Math.min(100, (this.currentTime / this.duration) * 100))
        : 0;
    return html` <meta property="oer:name" content="${this.mediaTitle}" />
      <meta property="oer:uri" content="${this.source}" />
      <div class="sr-only" ?hidden="${!this.mediaCaption}">
        ${this.mediaCaption}
      </div>
      ${renderDDDBlockHeader({
        icon: this.audioOnly ? "av:equalizer" : "av:play-arrow",
        label: this._blockLabel,
        title: this.mediaTitle,
        part: "media-header",
        actions: this._renderHeaderActions(),
      })}
      ${this._renderSettingsTray()}
      <div
        id="body"
        data-layout="${this._effectiveLayout}"
        data-side="${this.transcriptSide}"
      >
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
                label="${
                  this.__playing
                    ? this.t && this.t.pauseLabel
                      ? this.t.pauseLabel
                      : "Pause"
                    : this.t && this.t.playLabel
                      ? this.t.playLabel
                      : "Play"
                }"
                @button-click="${this.togglePlay}"
                ?audio-only="${this.audioOnly}"
                ?disabled="${this.audioNoThumb}"
                youtube-id="${this.youtubeId}"
              >
              </a11y-media-play-button>
              <div id="html5">
                <slot></slot>
              </div>
              ${
                this.videoId && this.__playerReady && this.__youtubeWanted
                  ? html`
                      <a11y-media-youtube
                        id="youtube-${this.id}"
                        ?autoplay="${this.__youtubePlayOnLoad}"
                        .volume="${this.volume}"
                        .muted="${this.muted}"
                        class="${
                          this.__currentTime > 0.3 || this.__seeking
                            ? ``
                            : `hidden`
                        }"
                        lang="${this.mediaLang}"
                        preload="${this.preload}"
                        video-id="${this.videoId}"
                        playback-rate="${this.playbackRate}"
                        @timeupdate="${this._handleTimeUpdate}"
                        @loadedmetadata="${this._handleMediaLoaded}"
                        @ended="${this._handleMediaEnded}"
                        @mediastatechange="${this._handleYoutubeState}"
                      >
                      </a11y-media-youtube>
                    `
                  : ``
              }
              ${
                Object.keys(this.captionCues || []).length === 0 ||
                !this.showCustomCaptions
                  ? html``
                  : html`
                      <div
                        id="cc-custom"
                        aria-live="polite"
                        class="screen-only"
                      >
                        <div id="cc-text">
                          ${
                            !this.captionCues
                              ? ``
                              : Object.keys(this.captionCues).map(
                                  (key) =>
                                    html`${cueToText(this.captionCues[key])}`,
                                )
                          }
                        </div>
                      </div>
                    `
              }
            </div>
          </div>
          <div id="progresslabel" class="sr-only">
            ${this.t.seekSliderLabel}
          </div>
          <simple-range-input
            id="slider"
            class="screen-only"
            aria-labelledby="progresslabel"
            label="${this.t.seekSliderLabel}"
            min="0"
            .max="${this.duration}"
            step="1"
            style="--a11y-media-seek-pct: ${seekPct}%"
            @value-changed="${this._handleSliderChanged}"
            @immediate-value-changed="${this._handleSliderDragging}"
            .value="${this.__currentTime}"
            ?disabled="${this._seekLocked}"
          >
          </simple-range-input>
          <div id="controls" class="screen-only" controls="innerplayer">
            <div id="controls-left">
              <a11y-media-button
                accent-color="${this.accentColor}"
                ?dark="${this.dark}"
                icon="${this.__playing ? "av:pause" : "av:play-arrow"}"
                label="${this.__playing ? this.t.pauseLabel : this.t.playLabel}"
                tooltip-position="top"
                @click="${this.togglePlay}"
              ></a11y-media-button>
              <a11y-media-button
                accent-color="${this.accentColor}"
                ?dark="${this.dark}"
                class="hide-full-xs"
                icon="av:fast-rewind"
                label="${this.t.rewindLabel}"
                tooltip-position="top"
                ?disabled="${this._seekLocked || this.currentTime <= 0}"
                ?hidden="${this._seekLocked}"
                @click="${(_e) => {
                  this.rewind();
                }}"
              ></a11y-media-button>
              <a11y-media-button
                accent-color="${this.accentColor}"
                ?dark="${this.dark}"
                class="hide-full-xs"
                icon="av:fast-forward"
                label="${this.t.forwardLabel}"
                tooltip-position="top"
                ?disabled="${
                  this._seekLocked || this.currentTime >= this.duration
                }"
                ?hidden="${this._seekLocked}"
                @click="${(_e) => {
                  this.forward();
                }}"
              ></a11y-media-button>
              <a11y-media-button
                accent-color="${this.accentColor}"
                ?dark="${this.dark}"
                class="hide-flex"
                icon="av:replay"
                label="${this.t.restartLabel}"
                tooltip-position="top"
                ?disabled="${this._seekLocked}"
                ?hidden="${
                  this.responsiveSize === "xs" ||
                  this.responsiveSize === "sm" ||
                  this._seekLocked
                }"
                @click="${this.restart}"
              ></a11y-media-button>
              <div
                id="volume-and-mute"
                @focus="${(_e) => (this.__volumeSlider = true)}"
                @blur="${(_e) => (this.__volumeSlider = false)}"
              >
                <a11y-media-button
                  accent-color="${this.accentColor}"
                  ?dark="${this.dark}"
                  id="mute"
                  icon="${this.muted ? "av:volume-off" : "av:volume-up"}"
                  label="${this.muted ? this.t.unmuteLabel : this.t.muteLabel}"
                  tooltip-position="top"
                  @click="${(_e) => {
                    this.toggleMute();
                  }}"
                ></a11y-media-button>
                <simple-range-input
                  id="volume"
                  accent-color="${this.accentColor}"
                  ?dark="${this.dark}"
                  aria-labelledby="volume-slider-label"
                  label="${this.t.volumeLabel}"
                  min="0"
                  max="100"
                  pin
                  step="10"
                  value="${this.muted ? 0 : this.volume}"
                  @value-changed="${this._handleVolumeChanged}"
                  ?hidden="${this.responsiveSize === "xs"}"
                ></simple-range-input>
              </div>
              <span aria-live="polite" class="play-status control-bar">
                <span id="statbar">${this.status}</span>
              </span>
            </div>
          </div>
          <div
            aria-hidden="true"
            class="screen-only media-caption"
            part="media-caption"
            ?hidden="${!this.mediaCaption}"
          >
            ${this.mediaCaption}
          </div>
          <div class="print-only media-caption">${this.printCaption}</div>
        </div>
        ${
          this.poster
            ? html`<img
                id="print-thumbnail"
                aria-hidden="true"
                src="${this.poster}"
              />`
            : ``
        }
        <div
          id="transcript-section"
          ?hidden="${this.standAlone || !this.hasCaptions || this.hideTranscript}"
        >
          <div id="transcript-and-controls" ?hidden="${this.hideTranscript}">
            <div id="searchbar">
              <div id="searching">
                <simple-search
                  id="simplesearch"
                  controls="transcript"
                  placeholder="${this.t.searchLabel}"
                  next-button-icon="hardware:keyboard-arrow-down"
                  next-button-label="${this.t.nextResultLabel}"
                  prev-button-icon="hardware:keyboard-arrow-up"
                  prev-button-label="${this.t.prevResultLabel}"
                  search-input-icon="search"
                  search-input-label="${this.t.searchLabel}"
                  selector=".searchable"
                  ?disabled="${this.disableSearch}"
                  ?hidden="${this.disableSearch}"
                >
                </simple-search>
              </div>
              <button
                type="button"
                class="bar-btn"
                id="hide-transcript-button"
                aria-label="${this.t.hideTranscriptLabel}"
                title="${this.t.hideTranscriptLabel}"
                aria-controls="transcript-section"
                @click="${(_e) => this.toggleTranscript(false)}"
              >
                <simple-icon-lite
                  icon="icons:unfold-less"
                  aria-hidden="true"
                ></simple-icon-lite>
              </button>
            </div>
            <div id="transcript" aria-live="polite">
              <a id="transcript-desc" class="sr-only" href="#bottom">
                ${this.t.transcriptSkip}
              </a>
              ${
                this.transcriptCues.length > 0
                  ? html`
                      <div class="transcript-from-track">
                        ${this.transcriptCues.map((cue, _index) => {
                          return html`
                            <a11y-media-transcript-cue
                              controls="html5"
                              end="${this._cueTime(cue.endTime)}"
                              lang="${cue.track.language}"
                              role="button"
                              start="${this._cueTime(cue.startTime)}"
                              tabindex="${
                                this.disableInteractive ||
                                this._seekLocked ||
                                this.duration === 0
                                  ? -1
                                  : 0
                              }"
                              @click="${(_e) => this._handleCueSeek(cue)}"
                              @keydown="${(e) => this._handleCueKeydown(e, cue)}"
                              @active-changed="${this._setActiveCue}"
                              ?active="${
                                cue.track.activeCues &&
                                cue.track.activeCues[0] === cue
                              }"
                              ?disabled="${
                                this.disableInteractive ||
                                this._seekLocked ||
                                this.duration === 0
                              }"
                              ?hide-timestamps="${this.hideTimestamps}"
                            >
                              <span class="searchable">${cueToText(cue)}</span>
                            </a11y-media-transcript-cue>
                          `;
                        })}
                      </div>
                    `
                  : html` <div id="loading" class="transcript-from-track">
                      ${this.status}
                    </div>`
              }
            </div>
          </div>
        </div>
      </div>
      <div id="bottom" class="sr-only"></div>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      /**
       * OER Schema type. Reflected (rather than set in firstUpdated) so it is
       * also in server rendered HTML.
       */
      typeof: { type: String, reflect: true },
      __playerReady: { type: Boolean },
      __youtubeWanted: { type: Boolean },
      __youtubePlayOnLoad: { type: Boolean },
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
       */
      manifest: {
        attribute: "manifest",
        type: String,
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
      /**
       * URL to audio description track (MP3 file)
       */
      audioDescriptionSource: {
        type: String,
        attribute: "audio-description-source",
        reflect: true,
      },
      /**
       * Whether audio description is currently enabled
       */
      audioDescriptionEnabled: {
        type: Boolean,
        attribute: "audio-description-enabled",
        reflect: true,
      },
      /**
       * the viewer's transcript placement ("side" or "below"), remembered
       * per browser; null until the viewer picks one
       */
      __transcriptLayout: {
        type: String,
        attribute: false,
      },
      /**
       * the viewer's side for the transcript ("left" or "right")
       */
      __transcriptSide: {
        type: String,
        attribute: false,
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
  /**
   * xAPI statements this element sends (see scripts/generate-xapi-vocabulary.mjs)
   */
  static get xapiVocabulary() {
    return {
      tag: "a11y-media-player",
      event: "user-engagement",
      verbs: ["attempted", "progressed", "completed"],
      objectType: "http://adlnet.gov/expapi/activities/media",
      result: [
        "completion",
        "duration",
        "extensions.https://w3id.org/xapi/video/extensions/progress",
      ],
      countsTowardCompletion: true,
      done: "95% of the media actually watched, or played on into the end after watching 80% (seeking ahead does not count)",
    };
  }

  /**
   * Helper method to safely access translation strings
   * @param {string} key - The translation key to access
   * @param {string} fallback - The fallback string to use if translation is not available
   * @returns {string} The translated string or fallback
   */
  _getTranslation(key, fallback) {
    return this.t && this.t[key] ? this.t[key] : fallback;
  }

  constructor() {
    super();
    this.typeof = "oer:MediaObject";
    globalThis.ResponsiveUtility.requestAvailability();
    globalThis.A11yMediaStateManager.requestAvailability();
    this.__playerReady = false;
    // the YouTube player (its API script and embed iframe) is created when
    // the browser is idle after this player is ready, or right away when
    // someone presses play; until then the thumbnail and play button show
    this.__youtubeWanted = false;
    this.__youtubePlayOnLoad = false;
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
    // Set up translation system
    this.t = this.t || {};
    this.t = {
      ...this.t,
      audioLabel: "Audio",
      audioNotSupported: "HTML5 video is not supported.",
      autoScrollLabel: "Scroll Transcript",
      captionsLabel: "Closed Captions",
      captionsOff: "Off",
      downloadLabel: "Download Transcript",
      forwardLabel: "Forward",
      fullscreenLabel: "Fullscreen",
      copyLinkLabel: "Copy Media Link",
      closeLinkLabel: "Close",
      loadingLabel: "Loading...",
      loopLabel: "Loop Playback",
      muteLabel: "Mute",
      nextResultLabel: "Next",
      pauseLabel: "Pause",
      playLabel: "Play",
      prevResultLabel: "Previous",
      printLabel: "Print Transcript",
      restartLabel: "Restart",
      rewindLabel: "Backward",
      searchLabel: "Search the transcript.",
      seekSliderLabel: "Seek Slider",
      settingsLabel: "Settings",
      speedLabel: "Speed %",
      transcriptLabel: "Transcript",
      transcriptLoading: "Loading the transcript(s)...",
      transcriptOff: "Off",
      transcriptSkip: "Skip to the transcript.",
      unmuteLabel: "Unmute",
      videoLabel: "Video",
      videoNotSupported: "HTML5 video is not supported.",
      volumeLabel: "Volume",
      youTubeLoadingLabel: "Loading...",
      youTubeStartLoading: "Press play.",
      youTubeTranscriptLabel: "Transcript will load once media plays.",
      openOnYouTube: "Open on YouTube",
      audioDescriptionLabel: "Audio Description",
      interactiveLabel: "interactive",
      layoutLabel: "Layout",
      sideLabel: "Side",
      belowLabel: "Below",
      leftLabel: "Left",
      rightLabel: "Right",
      hideTranscriptLabel: "Hide transcript",
    };
    this.registerLocalization({
      context: this,
      basePath: import.meta.url,
    });
    this.loop = false;
    this.audioDescriptionSource = "";
    this.audioDescriptionEnabled = false;
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
    this._resetWatched();
    this.__settingsOpen = false;
    this.__transcriptOption = -1;
    this.__transcriptLayout = null;
    this.__transcriptSide = "right";
    this._layoutPreferenceHandler = this._onLayoutPreference.bind(this);
    // global listeners for settings menu ESC and click-away behavior
    this._settingsKeydownHandler = this._onSettingsKeydown.bind(this);
    this._settingsClickHandler = this._onSettingsDocumentClick.bind(this);
    if (globalThis.addEventListener) {
      globalThis.addEventListener(
        "keydown",
        this._settingsKeydownHandler,
        true,
      );
    }
    globalThis.addEventListener &&
      globalThis.addEventListener("click", this._settingsClickHandler, true);
    (this.querySelectorAll ? this.querySelectorAll("video,audio") : []).forEach(
      (html5) => {
        html5.addEventListener("loadedmetadata", (_e) => {
          // only keep a real duration; sourceless media reports NaN
          if (isFinite(html5.duration) && html5.duration > 0) {
            this.__preloadedDuration = html5.duration;
          }
        });
      },
    );
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
    if (this.style) this.style.maxWidth = this.width;
    return aspect;
  }

  /**
   * returns true if an attribute is set to a value
   * @readonly
   * @returns {boolean} Should height of audio/thumbnail area be set to 0?
   */
  get audioNoThumb() {
    return this.audioOnly && !this._hasThumbnail;
  }

  /**
   * whether a real thumbnail was given; wrappers that bind an unset value
   * pass an empty string (or the text "undefined" / "null")
   * @returns {boolean}
   */
  get _hasThumbnail() {
    return (
      typeof this.thumbnailSrc === "string" &&
      this.thumbnailSrc.trim() !== "" &&
      this.thumbnailSrc !== "undefined" &&
      this.thumbnailSrc !== "null"
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
    options[-1] = this.t.captionsOff;
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
      this.transcriptLayout === "side"
    );
  }

  /**
   * seeking is locked (disable-seek, or learning mode)
   * @returns {boolean}
   */
  get _seekLocked() {
    // learning mode always locks seeking, whichever way it was set
    return !!(this.disableSeek || this.learningMode);
  }

  /**
   * whether the player is at a small width (DDD sm and below), where the
   * transcript always sits below and the header keeps only Settings and
   * Fullscreen
   * @returns {boolean}
   */
  get _narrow() {
    return this.responsiveSize === "xs" || this.responsiveSize === "sm";
  }

  /**
   * where the viewer wants the transcript: "side" or "below". Until the
   * viewer picks, stacked-layout decides (below) and otherwise side.
   * @returns {string}
   */
  get transcriptLayout() {
    if (
      this.__transcriptLayout === "side" ||
      this.__transcriptLayout === "below"
    ) {
      return this.__transcriptLayout;
    }
    return this.stackedLayout ? "below" : "side";
  }

  /**
   * which side the transcript sits on in the side layout: "left" or "right"
   * @returns {string}
   */
  get transcriptSide() {
    return this.__transcriptSide === "left" ? "left" : "right";
  }

  /**
   * the layout actually shown: small widths and audio without a picture
   * always put the transcript below
   * @returns {string}
   */
  get _effectiveLayout() {
    return this.fullFlex ? "side" : "below";
  }

  /**
   * whether the Layout choice is offered in the settings tray
   * @returns {boolean}
   */
  get _layoutChoiceAvailable() {
    return (
      !this._narrow &&
      this.hasCaptions &&
      !this.standAlone &&
      !this.audioNoThumb &&
      !this.learningMode
    );
  }

  /**
   * block header label, e.g. "Video · interactive"
   * @returns {string}
   */
  get _blockLabel() {
    const type = this.audioOnly
      ? this._getTranslation("audioLabel", "Audio")
      : this._getTranslation("videoLabel", "Video");
    return `${type} · ${this._getTranslation("interactiveLabel", "interactive")}`;
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
    let audioLabel = this._getTranslation("audioLabel", "Audio"),
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
      // audio with a thumbnail shows it in the same 16 / 9 frame as video
      paddingTop =
        this.fullscreen || this.audioNoThumb || this.height
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
          /[?&].*/,
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
    let audioLabel = this._getTranslation("audioLabel", "Audio"),
      videoLabel = this._getTranslation("videoLabel", "Video"),
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
    let slider = this.__sliderEl;
    let currentTime =
      slider && !slider.disabled && slider.dragging
        ? slider.immediateValue
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
        ? this._getTranslation("loadingLabel", "Loading...")
        : this.__playing
          ? this._getTranslation("youTubeLoadingLabel", "Loading...")
          : this._getTranslation("youTubeStartLoading", "Press play.");
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
   * @returns {number} timecode in seconds
   */
  get initialTimecode() {
    let t = this._getSeconds(
      this.anchor.params.t || this.anchor.params.start || `0s`,
    );
    if (this.anchor && this.anchor.target === this) return t;
    if (this.videoData) return this.videoData.t || this.videoData.start;
    return undefined;
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
    options[-1] = this._getTranslation("transcriptOff", "Off");
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
      let videoData = this.youtubeId.split(/[?&]/),
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
    return undefined;
  }
  get videoId() {
    if (this.videoData) return this.videoData.videoId;
    return undefined;
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

  _setAttribute(attr, val, media) {
    media = media || this;
    if (!val) {
      media.removeAttribute(attr);
    } else {
      media.setAttribute(attr, val);
    }
  }

  /**
   * @param {map} changedProperties the properties that have changed
   */
  willUpdate(changedProperties) {
    if (super.willUpdate) {
      super.willUpdate(changedProperties);
    }
    // Derive reactive state in willUpdate so it batches into the current
    // update cycle. Setting these in updated() scheduled a redundant second
    // update (Lit change-in-update warning). The captions handlers stay in
    // updated() because they depend on this.loadedTracks (assigned in
    // firstUpdated); running them pre-render would throw on the first update.
    changedProperties.forEach((oldValue, propName) => {
      // learning mode locks seeking and the transcript; it also applies
      // when the player is created with it on (HAX content saved with it),
      // not only when it is switched later
      if (
        propName === "learningMode" &&
        (typeof oldValue !== "undefined" || this.learningMode)
      ) {
        this.disableSeek = this[propName];
        this.hideTranscript = this[propName];
      }
      // Captions handlers: move to willUpdate so __captionsOption / cc /
      // captionsTrack reactive sets batch into the current update cycle.
      // Guard on this.loadedTracks (assigned in firstUpdated) — these props
      // don't change on the first update (they're set by user interaction),
      // so the guard is inherently satisfied on every update that reaches
      // here. Setting them in updated() scheduled a redundant second update
      // (Lit change-in-update warning).
      if (changedProperties.has("__captionsOption") && this.loadedTracks) {
        this._captionsOptionChanged();
      }
      if (
        (changedProperties.has("cc") ||
          changedProperties.has("captionsTrack")) &&
        this.loadedTracks
      ) {
        this._captionsChanged();
      }
      // showing the transcript (hide-transcript turned off in HAX, or the
      // Transcript toggle) needs a track; pick the captions / default one
      // so it never sits on the loading message
      if (
        propName === "hideTranscript" &&
        !this.hideTranscript &&
        !this.transcriptTrack &&
        this.loadedTracks &&
        this.loadedTracks.textTracks &&
        this.loadedTracks.textTracks.length > 0
      ) {
        this.transcriptTrack = this.captionsTrack || this._getTrack();
      }
      if (propName === "id" && this.id === null) {
        this.id = "a11y-media-player" + Date.now();
        // generated per page load, so it must not key learner data
        this._xapiGeneratedId = this.id;
      }
    });
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      let change = (params) => params.includes(propName),
        mediaChange = (param) =>
          change(["__loadedTracks", "youtubeId", "media", param]),
        flexChange = change([
          "standAlone",
          "hideTranscript",
          "audioNoThumb",
          "stackedLayout",
          "__cues",
          "__transcriptLayout",
          "audioOnly",
          "thumbnailSrc",
        ]),
        media = this.media ? this.media : this.__loadedTracks;

      if (change(["source", "sources"])) {
        this._updateMediaSource();
      }
      // new media is a new activity: start counting what is watched again.
      // Only when the media really changed: a wrapper (video-player) passes
      // a new sources array on every render, and resetting on that wiped
      // what was watched each time the wrapper re-rendered (play / pause).
      if (change(["source", "sources", "youtubeId"])) {
        const key = this._mediaKey();
        if (this.__mediaKey !== undefined && key !== this.__mediaKey) {
          this._resetWatched();
        }
        this.__mediaKey = key;
      }
      // text tracks given as a property (video-player tracks / track) are
      // kept in step with the media element when they change
      if (change(["tracks"]) && this.__loadedTracks) {
        this._syncTracks();
      }
      if (change(["crossorigin"]) && this.__loadedTracks && this.crossorigin) {
        if (
          this.__loadedTracks.getAttribute("crossorigin") !== this.crossorigin
        ) {
          this.__loadedTracks.setAttribute("crossorigin", this.crossorigin);
          if (!this.__playing && this.__loadedTracks.load) {
            this.__loadedTracks.load();
          }
        }
      }

      if (change(["media", "muted"])) this._handleMuteChanged();
      if (change(["media", "volume"])) this.setVolume(this.volume);
      if (change(["media", "autoplay"]) && this.autoplay) this.play();

      // NOTE: captions handlers (_captionsChanged / _captionsOptionChanged)
      // now run in willUpdate above so their reactive sets (__captionsOption,
      // cc, captionsTrack) batch into the current update cycle. Do NOT call
      // them here — doing so would re-set those reactive props post-render
      // and schedule a redundant second update (Lit change-in-update warning).

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
        this._setTranscriptMaxHeight();
      }

      /* updates media */
      if (this.media !== null) {
        if (mediaChange("cc"))
          this._setAttribute("cc", this.cc, this.__loadedTracks);
        if (mediaChange("isYoutube") && this.__loadedTracks)
          this.__loadedTracks.hidden = this.isYoutube;
        if (mediaChange("mediaLang"))
          this._setAttribute("lang", this.mediaLang, media);
        if (mediaChange("loop")) this._setAttribute("loop", this.loop, media);
        if (mediaChange("playbackRate"))
          this._setAttribute("playbackRate", this.playbackRate, media);
        if (mediaChange("isYoutube") || change(["thumbnailSrc"]))
          this._setAttribute(
            "poster",
            !this.isYoutube && this._hasThumbnail ? this.thumbnailSrc : false,
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
      let showing = parseInt(key) === parseInt(this.__captionsOption);
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
        this.mediaTitle && this.mediaTitle.trim() !== ""
          ? `${this.mediaTitle} (${this.t.transcriptLabel})`
          : this.t.transcriptLabel,
      filename = title.replace(/[^\w\d]/g, ""),
      track = this.transcriptTrack || this.captionsTrack,
      cues = track && track.cues ? track.cues : {},
      data = Object.keys(cues)
        .map(
          (key) =>
            `${this._getHHMMSS(cues[key].startTime)} - ${this._getHHMMSS(
              cues[key].endTime,
            )}: \t${cueToText(cues[key]).replace(/[\n\r\s*]/g, " ")}\n`,
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
    let track = this.transcriptTrack || this.captionsTrack,
      cues = track && track.cues ? track.cues : {},
      title =
        this.mediaTitle && this.mediaTitle.trim() !== ""
          ? `${this.mediaTitle} (${this.t.transcriptLabel})`
          : this.t.transcriptLabel,
      print = globalThis.open(
        "",
        "",
        "left=0,top=0,width=552,height=477,toolbar=0,scrollbars=0,status =0",
      );
    print.document.body.innerHTML = `
     <h1>${escapeHTML(title)}</h1>
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
               font-family: var(--ddd-font-mono, monospace);">
               ${this._getHHMMSS(cues[key].startTime)} - 
               ${this._getHHMMSS(cues[key].endTime)}:
             </span>`
         }
         <span style="display: table-cell; line-height: 200%;">
           ${escapeHTML(cueToText(cues[key]))}
         </span>
       </div>`,
       )
       .join("")}
     `;
    print.document.close();
    print.focus();
    print.print();
    print.addEventListener("afterprint", (_event) => {
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
    if (this.isYoutube && !this.youtube) {
      // nothing to play yet: create the YouTube player and start it once
      // it is ready
      this.__youtubePlayOnLoad = true;
      this.__youtubeWanted = true;
    }
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
    if (!this.media) return;

    // Clamp the requested time to a sane range when duration is known.
    const hasDuration =
      typeof this.duration === "number" && !isNaN(this.duration);
    const safeTime = hasDuration
      ? Math.max(0, Math.min(time, this.duration))
      : Math.max(0, time || 0);

    if (isNaN(safeTime)) return;

    // Mark a seek in flight so _handleTimeUpdate ignores stale media time
    // until the seek settles. Time-bounded so pin updates always resume.
    this.__seeking = true;
    clearTimeout(this.__seekingFallback);
    this.__seekingFallback = setTimeout(() => {
      this.__seeking = false;
    }, 300);

    if (this.mediaSeekable && typeof this.media.seek === "function") {
      // Normal path when the browser reports a seekable range
      this.media.seek(safeTime);
    } else {
      // Fallback for environments (often local/dev) where seekable is empty:
      // attempt to move the playback head directly so the UI doesn't feel broken.
      try {
        this.media.currentTime = safeTime;
      } catch {
        // Some environments may still refuse manual seeking; in that case just bail.
        this.__seeking = false;
        clearTimeout(this.__seekingFallback);
        return;
      }
    }

    // Reflect the requested time immediately so the pin jumps without waiting
    // for the next media timeupdate.
    this.__currentTime = safeTime;
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
      sourceVideo = this.source && this.source.match(/webm|ogv|mov|mp4$/),
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
          ? iframeSrc.match(/youtube(?:-nocookie)?\.com/) ||
            iframeSrc.match(/youtu\.be/)
          : false;
      if (yt && iframeSrc) {
        this.youtubeId = removeThroughLast(iframeSrc, "/");
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
    this._appendTracks(primary);

    /* handle deprecated sources */
    (this.sources || []).forEach((source) => {
      let node = globalThis.document.createElement("source");
      Object.keys(source).forEach((key) => node.setAttribute(key, source[key]));
      primary.appendChild(node);
    });
    /* provides a seek function for primary media */
    primary.seek = (time) => (primary.currentTime = time);
    this._addSourcesAndTracks(primary, primary);
    // Force the media to start loading so that seeking works. Without this,
    // preload="metadata" only loads metadata and setting currentTime (seeking
    // while paused) silently fails — the pin shows the right place but the
    // media actually stays at 0, so play() restarts from the beginning.
    primary.load();
    return primary;
  }

  /**
   * adds a <track> to the media element for each entry of the tracks
   * property, marked so they can be replaced when tracks changes
   * @param {object} media HTML audio or video element
   */
  _appendTracks(media) {
    (this.tracks || []).forEach((track) => {
      let node = globalThis.document.createElement("track");
      Object.keys(track || {}).forEach((key) =>
        node.setAttribute(key, track[key]),
      );
      node.setAttribute("data-a11y-media-track", "");
      media.appendChild(node);
    });
    this.__syncedTracks = JSON.stringify(this.tracks || []);
  }

  /**
   * replaces the tracks added from the tracks property when it changes
   * (a HAX edit of video-player tracks / track), so the captions and
   * transcript show the new files right away
   */
  _syncTracks() {
    const media = this.__loadedTracks;
    const next = JSON.stringify(this.tracks || []);
    if (!media || next === this.__syncedTracks) return;
    media
      .querySelectorAll("track[data-a11y-media-track]")
      .forEach((node) => node.remove());
    // the replaced tracks were the selected ones; the first new track takes
    // over (see _onAddTrack)
    this.captionsTrack = null;
    this.transcriptTrack = null;
    this.__cues = [];
    this._appendTracks(media);
  }

  /**
   * what identifies the media being played, for learner data
   * @returns {string}
   */
  _mediaKey() {
    const srcs = (Array.isArray(this.sources) ? this.sources : []).map(
      (s) => (s && s.src) || "",
    );
    return [this.youtubeId || "", this.source || ""].concat(srcs).join("|");
  }

  _updateMediaSource() {
    if (!this.__loadedTracks) return;
    const media = this.__loadedTracks;

    // Build the desired list of source srcs from the sources array.
    // video-player.sourceProperties returns a fresh array reference on every
    // render, which makes Lit fire `updated` for `sources` even when the
    // actual sources have not changed. Without this guard we would call
    // media.load() on every render and constantly reset playback.
    const desiredSrcs =
      this.sources && Array.isArray(this.sources)
        ? this.sources.map((s) => s.src || "")
        : [];
    const currentSrcs = Array.from(media.querySelectorAll("source")).map(
      (s) => s.getAttribute("src") || "",
    );

    const same =
      desiredSrcs.length === currentSrcs.length &&
      desiredSrcs.every((s, i) => s === currentSrcs[i]);
    if (same) return;

    // Clear existing src and child sources
    media.removeAttribute("src");
    media.querySelectorAll("source").forEach((node) => node.remove());

    // Re-add sources from sources array
    if (this.sources && Array.isArray(this.sources)) {
      this.sources.forEach((source) => {
        let node = globalThis.document.createElement("source");
        Object.keys(source).forEach((key) =>
          node.setAttribute(key, source[key]),
        );
        media.appendChild(node);
      });
    }

    media.load();
  }

  /**
   * selects a specific transcript track
   * @param {track} track text track
   */
  _getTrack(track) {
    if (!track) {
      // TextTrackList has no Array methods, so convert it first; real
      // TextTracks have no .track property (wrappers do), so only unwrap
      // when present
      let tracks = Array.from(this.loadedTracks.textTracks),
        defaultTracks = tracks.filter((track) => track.default === true),
        selected = defaultTracks.length > 0 ? defaultTracks[0] : tracks[0];
      return selected && selected.track ? selected.track : selected;
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
      // this.volume is already clamped to 0-100; writing the raw value
      // would throw an IndexSizeError on real media elements
      this.media.volume = this.volume / 100;
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
   * Handle audio description toggle from settings checkbox
   */
  _toggleAudioDescription(e) {
    if (e.detail && e.detail.value !== undefined) {
      this.audioDescriptionEnabled = e.detail.value;
      /**
       * Fires when audio description is toggled
       * @event audio-description-toggle
       */
      this.dispatchEvent(
        new CustomEvent("audio-description-toggle", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: {
            audioDescriptionEnabled: this.audioDescriptionEnabled,
          },
        }),
      );
    }
  }

  /**
   * Handle audio description toggle from main controls button
   */
  _handleAudioDescriptionButtonClick() {
    const wasEnabled = this.audioDescriptionEnabled;
    const fakeEvent = {
      detail: {
        value: !wasEnabled,
      },
    };
    this._toggleAudioDescription(fakeEvent);
    // If we just enabled audio description and media is not playing,
    // start playback so the AD track actually plays.
    if (!wasEnabled && !this.__playing) {
      this.togglePlay();
    }
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
            d.srclang === media.textTracks[key].language
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
    // textContent (not .value): a new textarea shows its text as its value,
    // and this keeps the link a plain string to static analysis
    el.textContent = this.shareLink;
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
      // For video, clicking a transcript cue should fully initiate playback,
      // not just reposition while leaving the play scrim visible over the
      // iframe. For audio-only, auto-playing on every cue click can surprise
      // the user (and restart the track), so only auto-play for video.
      if (!this.__playing && !this.audioOnly) {
        this.play();
      }
    }
  }

  /**
   * handles keyboard activation of a transcript cue
   * (custom element with role="button" does not activate on Enter/Space automatically)
   *
   * @param {event} e keydown event
   * @param {object} cue cue to seek to
   */
  _handleCueKeydown(e, cue) {
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      this._handleCueSeek(cue);
    }
  }

  /**
   * handles media ending: stop and reset to the start so the UI doesn't hang
   * near the end with __playing stuck true. Native HTML5 fires `ended`; the
   * YouTube bridge dispatches a matching `ended` for YT state 0. When looping
   * is enabled, restart playback instead (HTML5 loops natively and never
   * reaches this branch; for YouTube this provides single-video looping).
   */
  _handleMediaEnded() {
    // reaching the end only completes the media when it was watched; the
    // last time report before the end is counted first
    this._trackWatched();
    // the player itself reports the end: completes when it was watched
    this._completeAtEnd();
    if (this.loop) {
      this.seek(0);
      this.play();
      return;
    }
    this.pause();
    this.seek(0);
  }

  /**
   * Learner data: forget what was watched (new media, new visit)
   */
  _resetWatched() {
    this.__watched = new Set();
    this.__watchLast = null;
    this.__watchSent = {};
    this.__playedToEnd = false;
    this.__reportedEnd = false;
  }

  /**
   * Learner data: the player stopped at its end (HTML5 ended, YouTube
   * ENDED, or a pause / stop within the last second). The seconds after
   * the last time report count when that report was already in the last
   * stretch (so playing out the end counts, jumping there does not), then
   * completion is checked; at least MEDIA_WATCH_END_MIN must be watched.
   */
  _completeAtEnd() {
    if (!this.__watched) return;
    const d = Number(this.duration);
    if (!isFinite(d) || d <= 0) return;
    const last = Number(this.__watchLast);
    if (this.__watchLast !== null && isFinite(last) && this._isAtEnd(last)) {
      for (let sec = Math.floor(last); sec <= Math.ceil(d) - 1; sec++) {
        this.__watched.add(sec);
      }
    }
    this.__reportedEnd = true;
    this._checkWatched();
  }

  /**
   * Learner data: the media paused or stopped; at its very end (the last
   * second) that is the same as reaching the end
   */
  _handleMediaStopped() {
    const media = this.media;
    const t = media ? Number(media.currentTime) : NaN;
    const d = Number(this.duration);
    if (!isFinite(t) || !isFinite(d) || d <= 0) return;
    if (t >= d - MEDIA_END_WINDOW_MIN) {
      // the last report up to this point counts like any other
      this._trackWatched(true);
      this._completeAtEnd();
    }
  }

  /**
   * YouTube player state: 2 is paused (0, ended, arrives as an ended
   * event)
   * @param {CustomEvent} e mediastatechange from a11y-media-youtube
   */
  _handleYoutubeState(e) {
    const state = e && e.detail ? e.detail.data : undefined;
    if (state === 2) {
      this._handleMediaStopped();
    }
  }

  /**
   * Learner data: whether a time is in the last stretch of the media (its
   * last 5%, between 1 and 3 seconds)
   * @param {number} t time in seconds
   * @returns {boolean}
   */
  _isAtEnd(t) {
    const d = Number(this.duration);
    if (!isFinite(d) || d <= 0) {
      return false;
    }
    const window = Math.max(
      MEDIA_END_WINDOW_MIN,
      Math.min(MEDIA_END_WINDOW_MAX, d * 0.05),
    );
    return t >= d - window;
  }

  /**
   * Learner data: count the media time actually watched. Called on every
   * time report. Only playback that moves forward in small steps counts, so
   * seeking or scrubbing ahead never adds to it, and each second counts once
   * however often it is replayed. Sends the milestones when reached.
   */
  _trackWatched(stopped = false) {
    const media = this.media;
    const raw = media ? Number(media.currentTime) : 0;
    const t = isFinite(raw) && raw > 0 ? raw : 0;
    const last = this.__watchLast;
    this.__watchLast = t;
    // stopped: the report that comes with a pause / stop at the end
    const playing =
      stopped || this.__playing || !!(media && media.paused === false);
    if (!playing || this.__seeking || last === null) {
      return;
    }
    const step = t - last;
    if (step <= 0 || step > MEDIA_WATCH_MAX_STEP) {
      return;
    }
    for (let sec = Math.floor(last); sec <= Math.floor(t); sec++) {
      this.__watched.add(sec);
    }
    // playback ran on into the end: the final (partial) seconds count even
    // when no report arrives for them
    if (this._isAtEnd(t)) {
      this.__playedToEnd = true;
      const d = Number(this.duration);
      // within the last second: the final partial second is played too
      if (t >= d - MEDIA_END_WINDOW_MIN) {
        for (let sec = Math.floor(t); sec <= Math.ceil(d) - 1; sec++) {
          this.__watched.add(sec);
        }
      }
    }
    this._checkWatched();
  }

  /**
   * Learner data: share of the media watched, 0 to 1, or null when the
   * duration is not known (still loading, live streams)
   */
  get watchedShare() {
    const d = Number(this.duration);
    if (!isFinite(d) || d <= 0 || !this.__watched) {
      return null;
    }
    return Math.min(1, this.__watched.size / Math.ceil(d));
  }

  /**
   * Learner data: send start, half way and done once each per visit
   */
  _checkWatched() {
    const sent = this.__watchSent;
    if (!sent.attempted && this.__watched.size) {
      sent.attempted = true;
      this._announceMedia("attempted");
    }
    const share = this.watchedShare;
    if (share === null) {
      return;
    }
    if (!sent.progressed && share >= MEDIA_WATCH_HALF) {
      sent.progressed = true;
      this._announceMedia("progressed", share);
    }
    if (
      !sent.completed &&
      (share >= MEDIA_WATCH_DONE ||
        ((this.__playedToEnd || this.__reportedEnd) &&
          share >= MEDIA_WATCH_END_MIN))
    ) {
      // xAPI order: a completion always follows a progressed statement
      if (!sent.progressed) {
        sent.progressed = true;
        this._announceMedia("progressed", share);
      }
      sent.completed = true;
      this._announceEnded();
    }
  }

  /**
   * Learner data: the media was watched (95% or more, or played on into
   * the end after watching at least 80%). Fires user-engagement (verb
   * completed, with an xAPI statement and progress 1) once per visit.
   */
  _announceEnded() {
    // completed is the whole media: progress 1 (the duration in the
    // statement still says how much was actually watched)
    this._announceMedia("completed", 1);
  }

  /**
   * Learner data: one user-engagement event with an xAPI statement about
   * this media. When the player sits inside video-player or audio-player,
   * that element is the activity.
   * @param {string} verb attempted, progressed or completed
   * @param {number|null} [share] share of the media watched, 0 to 1
   */
  _announceMedia(verb, share) {
    const wrappers = ["video-player", "audio-player"];
    const root = this.getRootNode ? this.getRootNode() : null;
    const parent = this.parentElement;
    // rendered by the wrapper (shadow) or authored inside it (legacy light
    // DOM markup): either way the wrapper is the activity on the page
    const host =
      root && root.host && wrappers.includes(root.host.tagName.toLowerCase())
        ? root.host
        : parent && wrappers.includes(parent.tagName.toLowerCase())
          ? parent
          : this;
    const tag = host.tagName.toLowerCase();
    const name = this.mediaTitle || host.getAttribute("title") || tag;
    const fingerprint =
      host.source || host.getAttribute("source") || this.mediaTitle || "";
    const done = verb === "completed";
    let result;
    if (verb !== "attempted") {
      result = {
        completion: done,
        duration: xapiDuration(this.__watched.size * 1000),
      };
      if (typeof share === "number") {
        result.extensions = {
          [XAPI_MEDIA_PROGRESS]: Math.round(share * 100) / 100,
        };
      }
    }
    const detail = {
      activityDisplay: verb,
      objectName: name,
      statement: buildStatement({
        verb,
        object: {
          id: activityId(
            host,
            typeof host.xapiFingerprint === "function"
              ? host.xapiFingerprint()
              : fingerprint,
          ),
          name,
          type: XAPI_ACTIVITY_TYPES.media,
        },
        result,
        context: { extensions: { [XAPI_EXTENSIONS.element]: tag } },
      }),
    };
    if (verb !== "attempted") {
      detail.resultCompletion = done;
    }
    this.dispatchEvent(
      new CustomEvent("user-engagement", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail,
      }),
    );
  }

  /**
   * handles media metadata when media is loaded
   */
  _handleMediaLoaded(_e) {
    // the duration is known now: keep it reactive so the seek slider gets
    // its range right away (it is not otherwise redrawn until playback)
    const d = this.media ? Number(this.media.duration) : NaN;
    if (isFinite(d) && d > 0 && d !== this.__preloadedDuration) {
      this.__preloadedDuration = d;
    }
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
    let target = normalizeEventPath(e)[0];
    const value = Number(target.value);
    // the slider echoes the value it was just given; nothing changed
    if (
      value === Number(this.playbackRate) &&
      this.media &&
      Number(this.media.playbackRate) === value
    ) {
      return;
    }
    // keep playbackRate in step so the tray shows the speed and YouTube,
    // which reads playbackRate, follows it too
    if (!isNaN(value)) {
      this.playbackRate = value;
    }
    this.setPlaybackRate(target.value);
  }

  /**
   * handles duration slider dragging with a mouse
   * @param {event} e slider start event
   */
  _handleSliderDragging(_e) {
    let slider = this.__sliderEl;
    if (!slider || slider.disabled || !slider.dragging) return;
    // Only pause-on-drag-start if actually playing; remember to resume on
    // release so we don't force playback on a paused scrub.
    if (this.__playing) {
      this.__resumeOnRelease = true;
      this.pause();
      // Resume on the next pointer up (anywhere) or slider blur so we don't
      // leak a polling interval. Listeners are one-shot and clean themselves up.
      let resume = () => {
        if (this.__resumeOnRelease) {
          this.__resumeOnRelease = false;
          this.play();
        }
        globalThis.removeEventListener("pointerup", resume);
        if (slider) slider.removeEventListener("blur", resume);
      };
      globalThis.addEventListener &&
        globalThis.addEventListener("pointerup", resume);
      if (slider) slider.addEventListener("blur", resume);
    }
  }

  /**
   * handles duration slider dragging with a mouse
   * @param {event} e slider start event
   */
  _handleSliderChanged(e) {
    // simple-range-input dispatches `value-changed` for BOTH user commits
    // (drag release / track click) AND programmatic value syncs from our
    // render binding `.value="${this.__currentTime}"`. The programmatic
    // sync's detail.value is exactly the __currentTime we just rendered, so
    // seeking on it would yank playback back to a stale immediateValue every
    // timeupdate tick (a feedback loop that looked like the video looping one
    // frame). Skip when the committed value matches current time; only seek on
    // a genuine user commit whose value differs.
    const v = e && e.detail ? Number(e.detail.value) : NaN;
    if (isNaN(v) || v === this.__currentTime) return;
    this.seek(v);
  }

  /**
   * handles time updates
   */
  _handleTimeUpdate() {
    // learner data reads every report, before the paint coalescing below
    this._trackWatched();
    // Coalesce rapid timeupdate events into a single per-frame read so the
    // progress pin updates aligned to paint instead of once per second.
    if (this.__timeUpdateRaf) return;
    this.__timeUpdateRaf = globalThis.requestAnimationFrame(() => {
      this.__timeUpdateRaf = null;
      // While a seek is in flight, ignore media-driven time so the pin does
      // not snap back to a stale value before the seek settles. __seeking is
      // time-bounded in seek() so updates always resume.
      if (this.__seeking) return;
      const mediaTime =
        this.media && this.media.currentTime && this.media.currentTime > 0
          ? this.media.currentTime
          : 0;
      // __currentTime is a reactive Lit property, so every write re-renders
      // the whole player template. Writing it at rAF cadence (~60fps) thrashes
      // Lit and can break ChildPart commits (lit-html "no parentNode" errors),
      // which in turn wedges subsequent updates so the pin appears stuck.
      // Quantize to 4Hz (0.25s) so we only re-render when the displayed time
      // would actually change — smooth enough for a progress pin, ~4 renders/s.
      if (Math.round(mediaTime * 4) !== Math.round(this.__currentTime * 4)) {
        this.__currentTime = mediaTime;
      }
    });
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
    let target = normalizeEventPath(e)[0];
    this.volume = target.value;
  }

  /**
   * adds a track's cues to cues array
   * @param {object} textTrack
   */
  _onAddTrack(track) {
    if (this.captionsTrack === null) this.captionsTrack = track;
    // a track that replaced the old ones (tracks changed) also becomes the
    // transcript while the transcript is showing
    if (this.transcriptTrack === null && !this.hideTranscript) {
      this.transcriptTrack = track;
    }
    if (track) track.mode = "hidden";
    // the <track> element behind this text track, when there is one: its
    // cues arrive while the file is parsed, so they are read once it has
    // finished loading (reading at the first cue kept only part of them)
    const media = this.__loadedTracks;
    const trackEl =
      media && media.querySelectorAll
        ? Array.from(media.querySelectorAll("track")).find(
            (node) => node.track === track,
          )
        : null;
    let loadCueData = setInterval(() => {
      if (trackEl && trackEl.readyState === 3) {
        // the file failed to load; there are no cues to read
        clearInterval(loadCueData);
        return;
      }
      const loaded = !trackEl || trackEl.readyState === 2;
      if (loaded && track.cues && track.cues.length > 0) {
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
    // Cache the slider element so currentTime reads and slider handlers don't
    // re-query the shadow root on every call.
    this.__sliderEl = this.shadowRoot
      ? this.shadowRoot.querySelector("#slider")
      : null;
    this._setTranscriptMaxHeight();
    this.__loadedTracks = this.getloadedTracks();
    this._handleMediaLoaded();
    this.__loadedTracks.addEventListener("loadedmetadata", (e) =>
      this._handleMediaLoaded(e),
    );
    this.__loadedTracks.addEventListener("durationchange", (e) =>
      this._handleMediaLoaded(e),
    );
    this.__loadedTracks.addEventListener("timeupdate", (e) => {
      this._handleTimeUpdate(e);
    });
    // Native HTML5 media fires `ended` at the end of playback; the YouTube
    // bridge dispatches a matching `ended` event for YT state 0. Without an
    // ended handler, __playing stays true and the pin freezes ~1s before the
    // end (the last timeupdate sample before the interval clears).
    this.__loadedTracks.addEventListener("ended", (e) => {
      this._handleMediaEnded(e);
    });
    // a pause (or stop) at the very end counts as reaching the end
    this.__loadedTracks.addEventListener("pause", () => {
      this._handleMediaStopped();
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
    if (!this.__youtubeWanted) {
      whenIdle(
        () => {
          this.__youtubeWanted = true;
        },
        { timeout: 4000, fallbackDelay: 1500 },
      );
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
        let difference = to - element.scrollTop;
        let perTick = (difference / duration) * 10;

        setTimeout(() => {
          element.scrollTop = element.scrollTop + perTick;
          if (element.scrollTop === to) return;
          scrollingTo(element, to, duration - 10);
        }, 10);
      };
      const reduceMotion =
        globalThis.matchMedia &&
        globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        // reduced motion: jump to the cue instead of animating there
        cue.parentNode.parentNode.scrollTop = cue.offsetTop - offset;
      } else {
        scrollingTo(cue.parentNode.parentNode, cue.offsetTop - offset, 250);
      }
    }
  }

  /**
   * handles transcript scroll toggle
   * @param {event} e scroll event
   */
  _transcriptScroll(_e) {
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
      };
    return (
      b(val, 3600, "") + b(val % 3600, 60, "00:") + a(Math.round(val % 60))
    );
  }

  /**
   * HH:MM:SS for a transcript cue, padded to the media duration; a duration
   * that is not known yet never drops the minutes or hours of the cue
   * @param {number} time cue time in seconds
   * @returns {string}
   */
  _cueTime(time) {
    const duration = this.media ? Number(this.media.duration) : NaN;
    return this._getHHMMSS(
      time,
      isFinite(duration) ? Math.max(duration, time) : time,
    );
  }

  /**
   * Handle ESC key to close settings when open
   */
  _onSettingsKeydown(event) {
    if (!this.__settingsOpen) return;
    let key = event.key || event.code || "";
    if (key === "Escape" || key === "Esc" || event.keyCode === 27) {
      // focus goes back to the Settings button when it was in the tray
      const path = event.composedPath ? event.composedPath() : [];
      const tray = this.shadowRoot
        ? this.shadowRoot.querySelector("#settings")
        : null;
      const inTray = tray && path.includes(tray);
      this.toggleSettings(false);
      if (inTray) {
        const button = this.shadowRoot.querySelector("#settings-button");
        if (button) button.focus();
      }
      event.stopPropagation();
      event.preventDefault();
    }
  }

  /**
   * Handle click-away to close settings when user clicks outside
   */
  _onSettingsDocumentClick(event) {
    if (!this.__settingsOpen) return;
    let path = event.composedPath
      ? event.composedPath()
      : normalizeEventPath(event) || [];
    let settingsEl = this.shadowRoot
      ? this.shadowRoot.querySelector("#settings")
      : null;
    let settingsButton = this.shadowRoot
      ? this.shadowRoot.querySelector("#settings-button")
      : null;
    let isInside = false;
    for (let i = 0; i < path.length; i++) {
      let node = path[i];
      if (node === this || node === settingsEl || node === settingsButton) {
        isInside = true;
        break;
      }
    }
    if (!isInside) {
      this.toggleSettings(false);
    }
  }

  /**
   * returns time in seconds of a string, such as 00:00:00.0, 0h0m0.0s, or 0hh0mm0.0ss
   * @param {string} time
   * @returns {float} seconds
   */
  _getSeconds(time = 0) {
    let units = String(time)
        .replace(/[hm]{1,2}&?/g, ":0")
        .replace(/[s]{1,2}$/g, "")
        .split(/:/),
      hh = units.length > 2 ? parseInt(units[units.length - 3]) : 0,
      mm = units.length > 1 ? parseInt(units[units.length - 2]) : 0,
      ss = units.length > 0 ? parseFloat(units[units.length - 1]) : 0;
    return hh * 3600 + mm * 60 + ss;
  }

  /**
   * a set height keeps the transcript short; otherwise the layout decides
   * (it scrolls beside the media, or below it up to a set height)
   */
  _setTranscriptMaxHeight() {
    if (this.height) {
      this.style.setProperty("--a11y-media-transcript-max-height", "146px");
    } else {
      this.style.removeProperty("--a11y-media-transcript-max-height");
    }
  }

  /**
   * the viewer picks where the transcript goes; remembered per browser and
   * followed by the other players on the page
   * @param {string} layout "side" or "below"
   * @param {string} [side] "left" or "right" (side layout)
   */
  _setTranscriptLayout(layout, side) {
    if (layout !== "side" && layout !== "below") return;
    this.__transcriptLayout = layout;
    if (side === "left" || side === "right") {
      this.__transcriptSide = side;
    }
    // picking a place for the transcript shows it
    if (this.hideTranscript && this.hasCaptions && !this.learningMode) {
      this.toggleTranscript(true);
    }
    this._writeLayoutPreference();
  }

  // user-scaffold singleton when the page has one; never imported here so
  // a player on its own page does not load it
  _learnerProfile() {
    const us = globalThis.UserScaffold;
    const inst = us && us.instance;
    return inst &&
      typeof inst.readPreference === "function" &&
      typeof inst.writePreference === "function"
      ? inst
      : null;
  }

  /**
   * reads the viewer's transcript placement: the learner profile first,
   * then this browser's storage
   * @returns {object|null} { layout, side }
   */
  _readLayoutPreference() {
    let pref = null;
    const profile = this._learnerProfile();
    if (profile) {
      try {
        pref = profile.readPreference(A11Y_MEDIA_LAYOUT_PREFERENCE, null);
      } catch {
        pref = null;
      }
    }
    if (!pref) {
      try {
        const stored = globalThis.localStorage
          ? globalThis.localStorage.getItem(A11Y_MEDIA_LAYOUT_PREFERENCE)
          : null;
        pref = stored ? JSON.parse(stored) : null;
      } catch {
        pref = null;
      }
    }
    return pref && typeof pref === "object" ? pref : null;
  }

  /**
   * applies a saved { layout, side } placement
   * @param {object|null} pref
   */
  _applyLayoutPreference(pref) {
    if (!pref) return;
    if (pref.layout === "side" || pref.layout === "below") {
      this.__transcriptLayout = pref.layout;
    }
    if (pref.side === "left" || pref.side === "right") {
      this.__transcriptSide = pref.side;
    }
  }

  /**
   * saves the viewer's transcript placement and tells the other players
   */
  _writeLayoutPreference() {
    const pref = {
      layout: this.transcriptLayout,
      side: this.transcriptSide,
    };
    try {
      if (globalThis.localStorage) {
        globalThis.localStorage.setItem(
          A11Y_MEDIA_LAYOUT_PREFERENCE,
          JSON.stringify(pref),
        );
      }
    } catch {
      // storage is blocked or full; the choice just is not remembered
    }
    const profile = this._learnerProfile();
    if (profile) {
      try {
        profile.writePreference(A11Y_MEDIA_LAYOUT_PREFERENCE, pref);
      } catch {
        // the profile could not save; this browser's storage still has it
      }
    }
    if (globalThis.dispatchEvent) {
      globalThis.dispatchEvent(
        new CustomEvent("a11y-media-layout-preference", {
          detail: { source: this, preference: pref },
        }),
      );
    }
  }

  /**
   * another player on the page changed the transcript placement
   */
  _onLayoutPreference(e) {
    if (e && e.detail && e.detail.source !== this) {
      this._applyLayoutPreference(e.detail.preference);
    }
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    this._applyLayoutPreference(this._readLayoutPreference());
    if (globalThis.addEventListener) {
      globalThis.addEventListener(
        "a11y-media-layout-preference",
        this._layoutPreferenceHandler,
      );
    }
  }

  disconnectedCallback() {
    if (globalThis.removeEventListener) {
      globalThis.removeEventListener(
        "a11y-media-layout-preference",
        this._layoutPreferenceHandler,
      );
    }
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    if (this.__timeUpdateRaf) {
      globalThis.cancelAnimationFrame(this.__timeUpdateRaf);
      this.__timeUpdateRaf = null;
    }
    if (this.__seekingFallback) {
      clearTimeout(this.__seekingFallback);
      this.__seekingFallback = null;
    }
    this.__sliderEl = null;
    if (this._settingsKeydownHandler) {
      globalThis.removeEventListener(
        "keydown",
        this._settingsKeydownHandler,
        true,
      );
    }
    if (this._settingsClickHandler) {
      globalThis.removeEventListener("click", this._settingsClickHandler, true);
    }
  }
}
globalThis.customElements.define(A11yMediaPlayer.tag, A11yMediaPlayer);
export { A11yMediaPlayer };

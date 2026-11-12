/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";

/**
 * Short form of a cue start time: "0s", "4s", "1m 20s", "1h 2m".
 * Takes seconds or an "HH:MM:SS" / "MM:SS" string (the cue start attribute).
 * @param {number|string} value
 * @returns {string} "" when there is no time
 */
export function shortCueTime(value) {
  let secs = 0;
  if (typeof value === "number") {
    secs = value;
  } else {
    const text = String(value === undefined || value === null ? "" : value);
    if (text.trim() === "") {
      return "";
    }
    text
      .trim()
      .split(":")
      .forEach((part) => {
        const n = parseFloat(part);
        secs = secs * 60 + (isFinite(n) ? n : 0);
      });
  }
  if (!isFinite(secs) || secs < 0) {
    secs = 0;
  }
  secs = Math.floor(secs);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const sec = secs % 60;
  const out = [];
  if (h) out.push(`${h}h`);
  if (m) out.push(`${m}m`);
  if (sec || out.length === 0) out.push(`${sec}s`);
  return out.join(" ");
}

/**
 * `a11y-media-transcript-cue`
 * a single cue in a11y-media-transcriptas static text or as an button that controls media.
 * 
 * Custom styles:
```--a11y-media-transcript-bg-color: background color of the transcript, default is #ffffff
--a11y-media-transcript-text-color: color of the transcript text, default is #000000```
 *   
 * Custom styles for focused cue:
```--a11y-media-transcript-focused-cue-text: color of the focused cue text, default is --a11y-media-transcript-text-color
--a11y-media-transcript-focused-cue-bg: background color of the focused cue, default is --a11y-media-transcript-bg-color
--a11y-media-transcript-focused-cue-weight: font-weight of the focused cue, default is bold```
 *   
 * Custom styles for active cue:
```--a11y-media-transcript-active-cue-text: color of the active cue text, default is --a11y-media-transcript-text-color
--a11y-media-transcript-active-cue-bg: background color of the active cue, default is #ccfffd
--a11y-media-transcript-active-cue-weight: font-weight of the active cue, default is normal```
 *
 * @element a11y-media-transcript-cue
 */
class A11yMediaTranscriptCue extends LitElement {
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      /**
       * whether to hide the timestamps
       */
      active: {
        attribute: "active",
        type: Boolean,
        reflect: true,
      },
      /**
       * whether to hide the timestamps
       */
      disabled: {
        attribute: "disabled",
        type: Boolean,
        reflect: true,
      },
      /**
       * cue end time
       */
      end: {
        type: String,
      },
      /**
       * whether to hide the timestamps
       */
      hideTimestamps: {
        attribute: "hide-timestamps",
        type: Boolean,
        reflect: true,
      },
      /**
       * cue start time
       */
      start: {
        type: String,
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.

   */
  static get tag() {
    return "a11y-media-transcript-cue";
  }

  //inherit styles from a11y-media-player or a11y-media-transcript
  constructor() {
    super();
    this.active = false;
    this.disabled = false;
    this.hideTimestamps = false;
    this.start = "";
    this.end = "";
  }

  //render function
  static get styles() {
    return [
      css`
        :host {
          cursor: default;
          display: block;
          box-sizing: border-box;
          width: 100%;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          border-inline-start: var(--ddd-border-size-md) solid transparent;
          color: var(--a11y-media-transcript-cue-color, inherit);
          background-color: var(
            --a11y-media-transcript-cue-bg-color,
            transparent
          );
          font-size: var(
            --a11y-media-transcript-cue-font-size,
            var(--ddd-font-size-5xs)
          );
          line-height: var(
            --a11y-media-transcript-cue-line-height,
            var(--ddd-lh-140)
          );
          transition:
            color 0.25s,
            background-color 0.25s;
          --simple-search-match-text-color: var(
            --a11y-media-transcript-match-color
          );
          --simple-search-match-bg-color: var(
            --a11y-media-transcript-match-bg-color
          );
          --simple-search-match-border-color: var(
            --a11y-media-transcript-match-border-color
          );
          --simple-search-match-border: none;
          --simple-search-match-border-radius: 4px;
          --simple-search-match-font-weight: normal;
        }
        /* the whole cue highlights on hover / focus, and it is one button
           that seeks to its start */
        :host(:not([disabled]):hover),
        :host(:not([disabled]):focus) {
          cursor: pointer;
          color: var(--a11y-media-transcript-focused-cue-color, inherit);
          background-color: var(
            --a11y-media-transcript-focused-cue-bg-color,
            transparent
          );
        }
        :host(:focus-visible) {
          outline: var(--ddd-focus-ring);
          outline-offset: calc(-1 * var(--ddd-focus-offset));
        }
        /* the active cue: tinted background, an edge in the accent and a
           heavier weight, so it never relies on colour alone */
        :host([active]) {
          color: var(--a11y-media-transcript-active-cue-color, inherit);
          background-color: var(
            --a11y-media-transcript-active-cue-bg-color,
            transparent
          );
          border-inline-start-color: var(
            --a11y-media-transcript-active-cue-border-color,
            var(--a11y-media-accent-color, currentColor)
          );
          font-weight: var(--ddd-font-weight-medium);
        }
        #text {
          display: block;
          width: 100%;
        }
        /* start time only, short form, small type above the text */
        #time {
          display: block;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-6xs);
          font-weight: var(--ddd-font-weight-medium);
          font-variant-numeric: tabular-nums;
          line-height: var(--ddd-lh-140);
          white-space: nowrap;
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        :host(:not([disabled]):hover) #time,
        :host([active]) #time {
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
        }
        :host([hide-timestamps]) #time {
          display: none;
        }
        @media (prefers-reduced-motion: reduce) {
          :host {
            transition: none;
          }
        }
        @media print {
          :host,
          :host([active]),
          :host(:not([active]):not([disabled]):active),
          :host(:not([active]):not([disabled]):focus),
          :host(:not([active]):not([disabled]):hover) {
            color: #000000;
            background-color: #ffffff;
          }
        }
      `,
    ];
  }
  render() {
    return html`
      <span id="time">${shortCueTime(this.start)}</span>
      <span id="text">
        <slot></slot>
      </span>
    `;
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "active" && this.active)
        this.dispatchEvent(
          new CustomEvent("active-changed", {
            detail: {
              element: this,
              oldValue: oldValue,
              value: this.active,
            },
          }),
        );
    });
  }
}
globalThis.customElements.define(
  A11yMediaTranscriptCue.tag,
  A11yMediaTranscriptCue,
);
export { A11yMediaTranscriptCue };

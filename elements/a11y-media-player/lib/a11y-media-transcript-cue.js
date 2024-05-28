/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-search/lib/simple-search-content.js";

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
          display: table-row;
          width: 100%;
          color: var(--a11y-media-transcript-cue-color);
          background-color: var(--a11y-media-transcript-cue-bg-color);
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
        :host([hide-timestamps]) {
          display: inline;
        }
        :host(:not([active]):not([disabled]):active),
        :host(:not([active]):not([disabled]):focus),
        :host(:not([active]):not([disabled]):hover) {
          cursor: pointer;
          color: var(--a11y-media-transcript-focused-cue-color);
          background-color: var(--a11y-media-transcript-focused-cue-bg-color);
          outline: 1px dotted var(--a11y-media-transcript-focused-cue-color);
        }
        :host([active]) {
          color: var(--a11y-media-transcript-active-cue-color);
          background-color: var(--a11y-media-transcript-active-cue-bg-color);
        }
        #text {
          display: table-cell;
          width: 100%;
          line-height: 200%;
        }
        :host([hide-timestamps]) #text {
          display: inline;
        }
        #time {
          display: table-cell;
          font-size: 80%;
          padding: 0 16px 0 0;
          white-space: nowrap;
          font-family: monospace;
        }
        :host([hide-timestamps]) #time {
          display: none;
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
      <span id="time"> ${this.start} - ${this.end} </span>
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
customElements.define(A11yMediaTranscriptCue.tag, A11yMediaTranscriptCue);
export { A11yMediaTranscriptCue };

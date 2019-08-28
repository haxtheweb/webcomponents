/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { A11yMediaBehaviors } from "./a11y-media-behaviors.js";
import "@lrnwebcomponents/simple-search/lib/simple-search-content.js";

export { A11yMediaTranscriptCue };
/**
 * `a11y-media-transcript-cue`
 * `A single cue in a11y-media-transcriptas static text or as an button that controls media.`
 *
 * @microcopy - language worth noting:
```<a11y-media-transcript-cue 
  active-cues$="[[activeCues]]"                   // An array of the currently active cues
  cue$="[[cue]]"                                  // An array of cue data
  order$="[[cue.order]]"                          // The index of the current cue
  disable-interactive$="[[disableInteractive]]"   // Is cue interactive? 
  controls$="[[mediaId]]"                         // The id of the a11y-media-player element
  hide-timestamps$="[[hideTimestamps]]" >         // Hide cue timestamp?
</a11y-media-transcript-cue>```
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
 * @extends A11yMediaBehaviors
 * @customElement
 * @polymer
 */
class A11yMediaTranscriptCue extends A11yMediaBehaviors {
  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * is cue active
       */
      active: {
        type: Boolean,
        reflectToAttribute: true,
        computed: "_getActiveCue(cue,activeCues)",
        notify: true,
        reflectToAttribute: true
      },
      /**
       * array of currently active cues
       */
      activeCues: {
        type: Array,
        value: null,
        notify: true
      },
      /**
       * array of cue data
       */
      cue: {
        type: Array,
        value: null
      },
      /**
       * disable interactive mode that makes the transcript clickable
       */
      disabled: {
        type: Boolean,
        value: false
      },
      /**
       * parsed cue text
       */
      text: {
        type: String,
        value: ""
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "a11y-media-transcript-cue";
  }

  //inherit styles from a11y-media-player or a11y-media-transcript
  constructor() {
    super();
  }

  //render function
  static get template() {
    return html`
      <style is="custom-style" include="simple-colors-shared-styles">
        :host {
          cursor: default;
          display: table-row;
          width: 100%;
          color: var(--a11y-media-transcript-cue-color);
          background-color: var(--a11y-media-transcript-cue-bg-color);
          transition: color 0.25s, background-color 0.25s;
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
          @apply --a11y-media-transcript-focused-cue;
        }
        :host([active]) {
          color: var(--a11y-media-transcript-active-cue-color);
          background-color: var(--a11y-media-transcript-active-cue-bg-color);
          @apply --a11y-media-transcript-active-cue;
        }
        :host #text {
          display: table-cell;
          width: 100%;
          line-height: 200%;
        }
        :host([hide-timestamps]) #text {
          display: inline;
        }
        :host #time {
          display: table-cell;
          font-size: 80%;
          padding: 0 16px 0 0;
          white-space: nowrap;
          font-family: monospace;
        }
        :host([hide-timestamps]) #time {
          display: none;
        }
        :host simple-search-content {
          --simple-search-match-text-color: var(
            --a11y-media-transcript-match-color
          );
          --simple-search-match-bg-color: var(
            --a11y-media-transcript-match-bg-color
          );
          --simple-search-match-border-color: var(
            --a11y-media-transcript-match-border-color
          );
          --simple-search-match: {
            border: none;
            border-radius: 4px;
            font-weight: normal;
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
      </style>
      <span id="time">[[cue.start]] - [[cue.end]]</span>
      <span id="text">
        <simple-search-content id="content" content="[[cue.text]]">
          [[cue.text]]
        </simple-search-content>
      </span>
    `;
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * sets target for a11y keys
   */
  ready() {
    super.ready();
    let root = this,
      search = root.search;
    if (!root.disabled) {
      root.__target = this;
      root.setAttribute("aria-role", "button");
      root.setAttribute("controls", this.mediaId);
    }
    if (
      !root.disableSearch &&
      root.search !== undefined &&
      root.search !== null
    ) {
      root.$.content.enableSearch(search);
    }
    root.addEventListener("click", root._handleTap);
  }

  /**
   * gets the active cue for styling
   *
   * @param {object} the current cue object
   * @param {array} an array of all active cues
   * @returns {boolean} Is the cue active?
   */
  _getActiveCue(cue, activeCues) {
    return activeCues !== null && activeCues.includes(cue.order.toString())
      ? true
      : false;
  }

  /**
   * handles tap
   */
  _handleTap(e) {
    let root = this;
    this.dispatchEvent(new CustomEvent("cue-seek", { detail: root.cue.seek }));
  }
}
window.customElements.define(
  A11yMediaTranscriptCue.tag,
  A11yMediaTranscriptCue
);

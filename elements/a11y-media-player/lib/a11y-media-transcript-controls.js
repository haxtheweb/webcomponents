/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { A11yMediaBehaviors } from "./a11y-media-behaviors.js";
import "@lrnwebcomponents/simple-search/simple-search.js";
import "./a11y-media-button.js";

export { A11yMediaTranscriptControls };
/**
 * `a11y-media-transcript-controls`
 * `A controls for the transcript element.`
 *
 * @microcopy - language worth noting:
```<a11y-media-transcript-controls 
  accent-color$="[[accentColor]]"                 // Optional accent color highlighted cues, 
                                                  // using the following materialize colors: 
                                                  // red, pink, purple, deep-purple, indigo, blue, 
                                                  // light blue, cyan, teal, green, light green, lime, 
                                                  // yellow, amber, orange, deep-orange, and brown. 
                                                  // Default is null. 
  custom-microcopy$="[[customMicrocopy]]"         // Optional customization or text and icons
  disable-print-button$="[[disablePrintButton]]"  // Disable the print button?
  disable-scroll$="[[disableScroll]]"             // Disable autoscrolling transcript as video plays? 
  disable-search$="[[disableSearch]]"             // Disable transcript search? 
</a11y-media-transcript-controls>```
 *
 * @extends A11yMediaBehaviors
 * @customElement
 * @polymer
 */
class A11yMediaTranscriptControls extends A11yMediaBehaviors {
  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * target of the controls
       */
      target: {
        type: Object,
        value: null
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "a11y-media-transcript-controls";
  }

  //get player-specifc properties
  static get behaviors() {
    return [A11yMediaBehaviors];
  }

  //render function
  static get template() {
    return html`
      <style is="custom-style" include="simple-colors">
        :host {
          display: flex;
          height: 44px;
          max-height: 44px;
          min-height: 44px;
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
          --simple-search-container: {
            padding: 0 15px;
          }
        }
        :host #searchbar {
          display: flex;
          align-items: stretch;
          justify-content: space-between;
          width: 100%;
        }
        :host #searching {
          flex-grow: 2;
        }
        :host #autoscroll {
          padding-right: 8px;
        }
        :host #scrolling,
        :host #printing {
          display: flex;
          align-items: center;
        }
        @media print {
          :host {
            display: none;
          }
        }
      </style>
      <div id="searchbar">
        <div id="searching">
          <simple-search
            id="simplesearch"
            controls="transcript"
            disabled$="[[disableSearch]]"
            hidden$="[[disableSearch]]"
            no-label-float
            next-button-icon$="[[_getLocal('nextResult','icon')]]"
            next-button-label$="[[_getLocal('nextResult','label')]]"
            prev-button-icon$="[[_getLocal('prevResult','icon')]]"
            prev-button-label$="[[_getLocal('prevResult','label')]]"
            search-input-icon$="[[_getLocal('search','icon')]]"
            search-input-label$="[[_getLocal('search','label')]]"
            target="[[target]]"
          >
          </simple-search>
        </div>
        <div id="scrolling">
          <a11y-media-button
            id="scroll"
            controls="transcript"
            icon="[[_getLocal('autoScroll','icon')]]"
            label="[[_getLocal('autoScroll','label')]]"
            on-tap="_handleScrollClick"
            toggle$="[[!disableScroll]]"
          >
          </a11y-media-button>
        </div>
        <div
          id="printing"
          hidden$="[[disablePrintButton]]"
          disabled$="[[disablePrintButton]]"
        >
          <a11y-media-button
            id="download"
            controls="transcript"
            icon$="[[_getLocal('download','icon')]]"
            label="[[_getLocal('download','label')]]"
            on-tap="_handleDownloadClick"
          >
          </a11y-media-button>
          <a11y-media-button
            id="print"
            controls="transcript"
            icon$="[[_getLocal('print','icon')]]"
            label="[[_getLocal('print','label')]]"
            on-tap="_handlePrintClick"
          >
          </a11y-media-button>
        </div>
      </div>
    `;
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    let root = this;
    root.search = root.$.simplesearch;
    root.dispatchEvent(
      new CustomEvent("searchbar-added", { detail: root.search })
    );
  }

  /**
   * handles the transcript scroll button toggle
   */
  _handleScrollClick(e) {
    this.dispatchEvent(new CustomEvent("toggle-scroll", { detail: this }));
  }
}
window.customElements.define(
  A11yMediaTranscriptControls.tag,
  A11yMediaTranscriptControls
);

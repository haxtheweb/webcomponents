/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { A11yMediaPlayerProperties } from "./a11y-media-player-properties.js";
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
 * @extends A11yMediaPlayerProperties
 * @customElement
 * @polymer
 */
class A11yMediaTranscriptControls extends A11yMediaPlayerProperties {
  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * Language
       */
      lang: {
        type: String,
        value: "en",
        reflectToAttribute: true
      },
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
    return [A11yMediaPlayerProperties];
  }

  //render function
  static get template() {
    return html`
      <style is="custom-style" include="simple-colors">
        :host {
          background-color: var(--a11y-media-transcript-bg-color);
          color: var(--a11y-media-transcript-text-color);
          --a11y-media-button-color: var(--a11y-media-transcript-color);
          --a11y-media-button-bg-color: var(--a11y-media-transcript-bg-color);
          --a11y-media-button-toggle-color: var(
            --a11y-media-transcript-accent-color
          );
          --a11y-media-button-hover-color: var(
            --a11y-media-transcript-faded-accent-color
          );
          --a11y-media-button-hover-bg-color: var(
            --a11y-media-transcript-bg-color
          );
          --simple-search-input-color: var(--a11y-media-transcript-color);
          --simple-search-input-line-color: var(
            --a11y-media-transcript-accent-color
          );
          --simple-search-input-placeholder-color: var(
            --a11y-media-transcript-color
          );
          --simple-search-button-color: var(
            --a11y-media-transcript-accent-color
          );
          --simple-search-button-hover-color: var(
            --a11y-media-transcript-faded-accent-color
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
            --simple-colors-default-theme-grey-5
          );
          --simple-search-button-disabled-bg-color: var(
            --simple-colors-default-theme-grey-2
          );
          --simple-search-button-disabled-border-color: var(
            --simple-colors-default-theme-grey-3
          );
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
            disabled$="[[disableSearch]]"
            controls="transcript"
            hidden$="[[disableSearch]]"
            no-label-float=""
            next-button-icon$="[[searchNextIcon]]"
            next-button-label$="[[searchNextLabel]]"
            prev-button-icon$="[[searchPrevIcon]]"
            prev-button-label$="[[searchPrevLabel]]"
            search-input-icon$="[[searchIcon]]"
            search-input-label$="[[searchLabel]]"
            target="[[target]]"
          >
          </simple-search>
        </div>
        <div id="scrolling">
          <a11y-media-button
            id="scroll"
            controls="transcript"
            icon="[[autoScrollIcon]]"
            label="[[autoScrollLabel]]"
            on-click="_handleScrollClick"
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
            controls="transcript"
            id="print"
            icon="[[printIcon]]"
            on-click="_handlePrintClick"
            label="[[printLabel]]"
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

  /**
   * handles the print transcript button
   */
  _handlePrintClick(e) {
    this.dispatchEvent(new CustomEvent("print-transcript", { detail: this }));
  }
}
window.customElements.define(
  A11yMediaTranscriptControls.tag,
  A11yMediaTranscriptControls
);

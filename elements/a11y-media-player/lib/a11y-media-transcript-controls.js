/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element/lit-element.js";
import { A11yMediaBehaviors } from "./a11y-media-behaviors.js";
import "@lrnwebcomponents/simple-search/simple-search.js";
import "./a11y-media-button.js";

/**
 * `a11y-media-transcript-controls`
 * A controls for the transcript element.
 *
 * @extends A11yMediaBehaviors
 * @customElement
 */
class A11yMediaTranscriptControls extends A11yMediaBehaviors {
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      /**
       * target of the controls
       */
      search: {
        type: Object
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.

   */
  static get tag() {
    return "a11y-media-transcript-controls";
  }

  //inherit styles from a11y-media-player or a11y-media-transcript
  constructor() {
    super();
    this.search = this.shadowRoot.querySelector("#simplesearch");
    this.dispatchEvent(
      new CustomEvent("searchbar-added", { detail: this.search })
    );
  }

  //render function
  static get styles() {
    return [
      ...super.styles,
      css`
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
          --simple-search-padding: 0 15px;
        }
        #searchbar {
          display: flex;
          align-items: stretch;
          justify-content: space-between;
          width: 100%;
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
        @media print {
          :host {
            display: none;
          }
        }
      `
    ];
  }
  render() {
    return html`
      <div id="searchbar">
        <div id="searching">
          <simple-search id="simplesearch"
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
            ?toggle="${!this.disableScroll}"
          >
          </a11y-media-button>
        </div>
        <div
          id="printing"
          ?hidden="${this.disablePrintButton}"
          ?disabled="${this.disablePrintButton}"
        >
          <a11y-media-button
            id="download"
            controls="transcript"
            icon="${this._getLocal('download','icon')}"
            label="${this._getLocal('download','label')}"
            @click="${this._handleDownloadClick}"
          >
          </a11y-media-button>
          <a11y-media-button
            id="print"
            controls="transcript"
            icon="${this._getLocal('print','icon')}"
            label="${this._getLocal('print','label')}"
            @click="${this._handlePrintClick}"
          >
          </a11y-media-button>
        </div>
      </div>
    `;
  }

  /**
   * handles the transcript scroll button toggle
   */
  _handleScrollClick(e) {
    this.dispatchEvent(new CustomEvent("toggle-scroll", { detail: this }));
  }

  /**
   * handles the transcript scroll button toggle
   */
  _handlePrintClick(e) {
    this.dispatchEvent(new CustomEvent("print-transcript", { detail: this }));
  }

  /**
   * handles the transcript scroll button toggle
   */
  _handleDownloadClick(e) {
    this.dispatchEvent(new CustomEvent("download-transcript", { detail: this }));
  }
}
window.customElements.define(
  A11yMediaTranscriptControls.tag,
  A11yMediaTranscriptControls
);

export { A11yMediaTranscriptControls };

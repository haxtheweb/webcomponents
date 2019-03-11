/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/hax-body/lib/hax-shared-styles.js";
import { HAXCMSTheme } from "./HAXCMSThemeWiring.js";
/**
 * `haxcms-slide-theme`
 * `A simple slide playing theme`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class HAXCMSSlideTheme extends HAXCMSTheme(PolymerElement) {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "haxcms-slide-theme";
  }
  // render function
  static get template() {
    return html`
      <style include="simple-colors hax-shared-styles">
        :host {
          display: block;
        }
        /**
         * Hide the slotted content during edit mode. This must be here to work.
         */
        :host([edit-mode]) #slot {
          display: none;
        }
        .active-slide {
          width: 100vw;
          padding: 16px;
          margin: 0;
          position: fixed;
          top: 0;
          bottom: 60px;
          overflow: scroll;
          border-bottom: 4px solid var(--haxcms-color, black);
        }
        .controls:hover {
          background-color: rgba(0, 0, 0, 1);
        }
        .controls {
          transition: all 0.2s ease-in-out;
          z-index: 100000;
          position: fixed;
          bottom: 0;
          left: 0;
          background-color: rgba(0, 0, 0, 0.8);
          color: white;
          display: flex;
          height: 40px;
          width: 200px;
          justify-content: center;
          vertical-align: middle;
          line-height: 40px;
          font-size: 16px;
        }
        .title {
          font-size: 28px;
          vertical-align: middle;
          display: flex;
          justify-content: center;
          position: fixed;
          height: 60px;
          left: 0;
          right: 0;
        }
        .bottom-wrapper {
          position: fixed;
          bottom: 0;
          height: 60px;
        }
      </style>
      <div class="active-slide">
        <h1>[[activeItem.title]]</h1>
        <div id="contentcontainer">
          <div id="slot"><slot></slot></div>
        </div>
      </div>
      <div class="bottom-wrapper">
        <div class="controls">
          <paper-icon-button
            id="prev"
            icon="icons:chevron-left"
            disabled="[[disablePrevPage(activeManifestIndex)]]"
            on-click="prevPage"
          >
          </paper-icon-button>
          <paper-tooltip for="prev" offset="16" position="top">
            Previous slide
          </paper-tooltip>
          <div>[[__pageCounter]] / [[manifest.items.length]]</div>
          <paper-icon-button
            id="next"
            icon="icons:chevron-right"
            disabled="[[disableNextPage(activeManifestIndex)]]"
            on-click="nextPage"
          >
          </paper-icon-button>
          <paper-tooltip for="next" offset="16" position="top">
            Next slide
          </paper-tooltip>
        </div>
        <div class="title">[[manifest.title]]</div>
      </div>
    `;
  }
  /**
   * Mix in an opened status
   */
  static get properties() {
    let props = super.properties;
    props.__pageCounter = {
      type: Number,
      notify: true
    };
    return props;
  }
  connectedCallback() {
    super.connectedCallback();
    this.__pageCounter = 1 + this.activeManifestIndex;
  }
  prevPage(e) {
    super.prevPage(e);
    this.__pageCounter--;
  }
  nextPage(e) {
    super.nextPage(e);
    this.__pageCounter++;
  }
}
window.customElements.define(HAXCMSSlideTheme.tag, HAXCMSSlideTheme);
export { HAXCMSSlideTheme };

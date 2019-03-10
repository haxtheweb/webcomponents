/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/hax-body/lib/hax-shared-styles.js";
import { HAXCMSTheme } from "@lrnwebcomponents/haxcms-elements/lib/HAXCMSThemeWiring.js";
/**
 * `learn-two-theme`
 * `Learn2 theme for HAXcms`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class LearnTwoTheme extends HAXCMSTheme(PolymerElement) {
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none;
        }

        :host([edit-mode]) #slot {
          display: none;
        }
      </style>
      <style include="simple-colors hax-shared-styles"></style>
      <div id="contentcontainer">
        <div id="slot">
          <slot></slot>
        </div>
      </div>
      <paper-icon-button
        id="prev"
        icon="icons:chevron-left"
        disabled="[[disablePrevPage(activeManifestIndex)]]"
        on-click="prevPage"
      >
      </paper-icon-button>
      <paper-tooltip for="prev" offset="16" position="top">
        Previous page
      </paper-tooltip>
      <paper-icon-button
        id="next"
        icon="icons:chevron-right"
        disabled="[[disableNextPage(activeManifestIndex)]]"
        on-click="nextPage"
      >
      </paper-icon-button>
      <paper-tooltip for="next" offset="16" position="top">
        Next page
      </paper-tooltip>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {};
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "learn-two-theme";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }
  /**
   * Previous page to hook into when prev is hit
   */
  prevPage(e) {
    super.prevPage(e);
  }
  /**
   * Next page to hook into when next is hit
   */
  nextPage(e) {
    super.nextPage(e);
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(LearnTwoTheme.tag, LearnTwoTheme);
export { LearnTwoTheme };

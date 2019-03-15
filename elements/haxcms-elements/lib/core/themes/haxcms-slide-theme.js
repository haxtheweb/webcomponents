/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXCMSTheme } from "@lrnwebcomponents/haxcms-elements/lib/theme/HAXCMSThemeWiring.js";
import "@lrnwebcomponents/haxcms-elements/lib/theme/site-pieces/site-title.js";
import "@lrnwebcomponents/haxcms-elements/lib/theme/navigation/site-menu-button.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/hax-body/lib/hax-shared-styles.js";
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
          height: 60px;
          width: 200px;
          line-height: 60px;
          justify-content: center;
          vertical-align: middle;
          height: 60px;
          font-size: 16px;
        }
        .counter {
          width: 100px;
          justify-content: center;
          vertical-align: middle;
          display: inline-flex;
        }
        site-menu-button {
          --site-menu-button-link: {
            color: #ffffff;
          }
          --site-menu-button-button: {
            height: 60px;
            width: 60px;
            padding: 0;
            margin: 0;
            line-height: 60px;
          }
          --site-menu-button-button-hover: {
            color: var(--haxcms-color, yellow);
          }
        }
        site-menu-button:hover,
        site-menu-button:focus,
        site-menu-button:active {
          outline: 1px dashed var(--haxcms-color, yellow);
          outline-offset: -1px;
        }
        site-title {
          vertical-align: middle;
          display: flex;
          justify-content: center;
          position: fixed;
          height: 60px;
          left: 0;
          right: 0;
          --site-title-link: {
            text-decoration: none;
          }
          --site-title-heading: {
            color: black;
            font-size: 28px;
            margin: 0;
            padding: 0;
          }
        }
        .bottom-wrapper {
          position: fixed;
          bottom: 0;
          height: 60px;
        }
      </style>
      <div class="active-slide">
        <site-active-title></site-active-title>
        <div id="contentcontainer">
          <div id="slot"><slot></slot></div>
        </div>
      </div>
      <div class="bottom-wrapper">
        <div class="controls">
          <site-menu-button
            type="prev"
            label="Previous"
            position="top"
          ></site-menu-button>
          <div class="counter">
            [[activeManifestIndexCounter]] / [[manifest.items.length]]
          </div>
          <site-menu-button
            type="next"
            label="Next"
            position="top"
          ></site-menu-button>
        </div>
        <site-title></site-title>
      </div>
    `;
  }
}
window.customElements.define(HAXCMSSlideTheme.tag, HAXCMSSlideTheme);
export { HAXCMSSlideTheme };

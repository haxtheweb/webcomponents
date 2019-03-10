/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@polymer/app-layout/app-drawer/app-drawer.js";
import "@polymer/app-layout/app-drawer-layout/app-drawer-layout.js";
import "@lrnwebcomponents/map-menu/map-menu.js";
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

        #contentcontainer {
          padding: 48px 96px;
        }

        .header {
          background: #747474;
          color: #fff;
          text-align: center;
          padding: 0rem 1rem 2rem 1rem;
        }
        .header a {
          display: inline-block;
          color: #fafafa;
          text-decoration: none;
        }
        map-menu {
          background-color: #383f45;
          --map-menu-active-color: rgba(255, 255, 255, 0.9);
          color: #ffffff;
          padding: 25px 0 15px;
          height: calc(100vh - 80px);
          --map-menu-container: {
            padding: 0;
          }
        }
        map-menu::-webkit-scrollbar-track {
          -webkit-box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.3);
          border-radius: 0;
          background-color: #fafafa;
        }
        map-menu::-webkit-scrollbar {
          width: 4px;
          background-color: #fafafa;
        }
        map-menu::-webkit-scrollbar-thumb {
          border-radius: 2px;
          -webkit-box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.3);
          background-color: #444444;
        }

        .arrow-floats {
          background-color: rgba(0, 0, 0, 0);
          position: fixed;
          top: 0;
          bottom: 0;
          left: 254px;
          width: 96px;
          height: 100vh;
          border: none;
          cursor: pointer;
          display: table;
          text-align: center;
          border-radius: 0;
          -webkit-border-radius: 0;
          -moz-border-radius: 0;
          -ms-border-radius: 0;
          -o-border-radius: 0;
          transition: 0.2s all ease-in-out;
          -webkit-transition: 0.2s all ease-in-out;
          -moz-transition: 0.2s all ease-in-out;
          -ms-transition: 0.2s all ease-in-out;
          -o-transition: 0.2s all ease-in-out;
        }
        .arrow-floats:hover,
        .arrow-floats:active,
        .arrow-floats:focus {
          background-color: rgba(0, 0, 0, 0.2);
        }
        .nav-next {
          right: 0;
          left: unset;
        }
      </style>
      <custom-style>
        <style>
          body {
            font-family: "Muli", "Helvetica", "Tahoma", "Geneva", "Arial",
              sans-serif;
            letter-spacing: -0.03rem;
          }
        </style>
      </custom-style>
      <style include="simple-colors"></style>
      <app-drawer-layout>
        <app-drawer id="drawer" swipe-open="" slot="drawer">
          <div class="header-wrapper">
            <div class="header">
              <a href="/">
                <h2 class="outline-title">[[manifest.title]]</h2>
              </a>
            </div>
          </div>
          <map-menu
            id="menu"
            selected="[[activeManifestIndex]]"
            manifest="[[manifest]]"
            active-indicator
            auto-scroll
          ></map-menu>
        </app-drawer>
        <div>
          <paper-icon-button
            id="prev"
            noink
            icon="icons:chevron-left"
            disabled="[[disablePrevPage(activeManifestIndex)]]"
            on-click="prevPage"
            class="arrow-floats"
          >
          </paper-icon-button>
          <paper-tooltip for="prev" offset="16" position="right">
            Previous page
          </paper-tooltip>
          <div id="contentcontainer">
            <div id="slot">
              <slot></slot>
            </div>
          </div>
          <paper-icon-button
            id="next"
            noink
            icon="icons:chevron-right"
            disabled="[[disableNextPage(activeManifestIndex)]]"
            on-click="nextPage"
            class="arrow-floats nav-next"
          >
          </paper-icon-button>
          <paper-tooltip for="next" offset="16" position="left">
            Next page
          </paper-tooltip>
        </div>
      </app-drawer-layout>
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

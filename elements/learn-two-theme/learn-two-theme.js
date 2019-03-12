/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@polymer/app-layout/app-drawer/app-drawer.js";
import "@polymer/app-layout/app-drawer-layout/app-drawer-layout.js";
import "@lrnwebcomponents/map-menu/map-menu.js";
import "@lrnwebcomponents/haxcms-elements/lib/theme/site-breadcrumb.js";
import "@lrnwebcomponents/haxcms-elements/lib/theme/site-rss.js";
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
          font-family: "Muli", "Helvetica", "Tahoma", "Geneva", "Arial",
            sans-serif;
          letter-spacing: -0.03rem;
          font-weight: 400;
        }
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: "Montserrat", "Helvetica", "Tahoma", "Geneva", "Arial",
            sans-serif;
          font-weight: 400;
          text-rendering: optimizeLegibility;
          line-height: 150%;
          letter-spacing: 0;
        }

        :host([hidden]) {
          display: none;
        }

        :host([edit-mode]) #slot {
          display: none;
        }

        #contentcontainer {
          background: #fafafa;
          padding: 48px 96px;
        }

        .header {
          background: #747474;
          color: #fafafa;
          text-align: center;
          padding: 0rem 1rem 2rem 1rem;
        }
        .header a {
          display: inline-block;
          color: #fafafa;
          text-decoration: none;
        }
        .title {
          font-family: "Montserrat", "Helvetica", "Tahoma", "Geneva", "Arial",
            sans-serif;
          font-size: 52px;
          letter-spacing: -3px;
          line-height: 78px;
          margin-bottom: 27.2px;
          margin-top: 13.6px;
          text-align: center;
          text-rendering: optimizelegibility;
          font-weight: 100;
        }
        .outline-title {
          margin: 2rem 0 0;
          position: relative;
          line-height: 2;
          font-size: 1.4rem;
        }
        map-menu {
          background-color: #383f45;
          color: #ffffff;
          padding: 25px 0 15px;
          height: auto;
          max-height: calc(100vh - 200px);
          --map-menu-active-color: #ffffff;
          --map-menu-container: {
            padding: 0;
            background-color: #2d3237;
          }
          --map-menu-item-active-item: {
            color: #2d3237;
          }
        }

        map-menu::-webkit-scrollbar-track {
          -webkit-box-shadow: inset 0 0 4px rgba(56, 63, 69, 0.9);
          border-radius: 0;
          background-color: #383f45;
        }
        map-menu::-webkit-scrollbar {
          width: 2px;
          background-color: #383f45;
        }
        map-menu::-webkit-scrollbar-thumb {
          border-radius: 1px;
          -webkit-box-shadow: inset 0 0 4px #747474;
          background-color: #383f45;
        }
        app-drawer-layout {
          min-height: 100vh;
          min-height: -moz-available;
          min-height: -webkit-fill-available;
          min-height: fill-available;
          --app-drawer-width: 300px;
          --app-drawer-scrim-background: rgba(80, 80, 80, 0.8);
          --app-drawer-width: 300px;
          --app-drawer-content-container: {
            overflow: hidden;
            background-color: #383f45;
          }
        }
        .rss-buttons {
          justify-content: space-evenly;
          display: flex;
        }

        app-drawer {
          box-shadow: 0 0 6px -3px var(--haxcms-color, black);
          overflow: hidden;
          width: 300px;
        }
        app-drawer-layout[narrow] #contentcontainer {
          padding: 0 16px;
        }
        #menubutton,
        #menubutton2 {
          display: none;
        }
        app-drawer-layout[narrow] #menubutton {
          display: block;
        }
        app-drawer-layout[narrow] #menubutton2 {
          display: block;
          position: absolute;
        }
        app-drawer-layout[narrow] .header {
          padding: 0;
        }

        .arrow-floats {
          background-color: rgba(0, 0, 0, 0);
          position: fixed;
          top: 0;
          bottom: 0;
          left: 300px;
          width: 64px;
          height: 100vh;
          border-radius: 0;
          transition: 0.4s all ease-in-out;
          transition-delay: 0.2s;
          margin: 0;
          padding: 0;
          opacity: 0.8;
          -webkit-transition: 0.4s all ease-in-out;
          -moz-transition: 0.4s all ease-in-out;
          -ms-transition: 0.4s all ease-in-out;
          -o-transition: 0.4s all ease-in-out;
        }
        .arrow-floats iron-icon {
          width: 64px;
          height: 64px;
          display: contents;
        }
        .arrow-floats:hover,
        .arrow-floats:active,
        .arrow-floats:focus {
          opacity: 1;
          background-color: rgba(0, 0, 0, 0.1);
        }
        app-drawer-layout[narrow] map-menu {
          max-height: calc(100vh - 160px);
        }
        app-drawer-layout[narrow] .arrow-floats {
          background-color: transparent !important;
          bottom: 0;
          top: unset;
          width: 64px;
          height: 64px;
        }
        #next {
          right: 0;
          left: unset;
        }
        app-drawer-layout[narrow] #prev {
          left: unset;
        }
        :host([opened]) app-drawer-layout[narrow] #prev,
        :host([opened]) app-drawer-layout[narrow] #next {
          display: none;
        }
        paper-tooltip {
          --paper-tooltip-background: #000000;
          --paper-tooltip-opacity: 1;
          --paper-tooltip-text-color: #ffffff;
          --paper-tooltip-delay-in: 0;
          --paper-tooltip: {
            border-radius: 0;
          }
        }
      </style>
      <custom-style>
        <style>
          body {
            font-family: "Muli", "Helvetica", "Tahoma", "Geneva", "Arial",
              sans-serif;
            letter-spacing: -0.03rem;
            font-weight: 400;
            background-color: #fafafa;
          }
          h1,
          h2,
          h3,
          h4,
          h5,
          h6 {
            font-family: "Montserrat", "Helvetica", "Tahoma", "Geneva", "Arial",
              sans-serif;
            font-weight: 400;
            text-rendering: optimizeLegibility;
            line-height: 150%;
            letter-spacing: 0;
          }
        </style>
      </custom-style>
      <link
        rel="stylesheet"
        type="text/css"
        crossorigin="anonymous"
        href="https://fonts.googleapis.com/css?family=Montserrat:400|Muli:300,400|Inconsolata"
      />
      <style include="simple-colors"></style>
      <app-drawer-layout>
        <paper-icon-button
          id="menubutton"
          icon="menu"
          on-tap="toggleDrawer"
        ></paper-icon-button>
        <app-drawer id="drawer" swipe-open slot="drawer" opened="{{opened}}">
          <paper-icon-button
            id="menubutton2"
            icon="menu"
            on-tap="toggleDrawer"
          ></paper-icon-button>
          <div class="header-wrapper">
            <div class="header">
              <a href="/">
                <h1 class="outline-title">[[manifest.title]]</h1>
              </a>
            </div>
          </div>
          <map-menu
            id="menu"
            selected="[[selected]]"
            manifest="[[manifest]]"
            active-indicator
            auto-scroll
          ></map-menu>
          <div class="rss-buttons">
            <site-rss type="atom"></site-rss>
            <site-rss type="rss"></site-rss>
          </div>
        </app-drawer>
        <div>
          <paper-button
            id="prev"
            noink
            on-click="prevPage"
            disabled$="[[disablePrevPage(activeManifestIndex)]]"
            class="arrow-floats"
          >
            <iron-icon icon="icons:chevron-left"> </iron-icon>
          </paper-button>
          <paper-tooltip for="prev" offset="8" position="right">
            Previous page
          </paper-tooltip>
          <div id="contentcontainer">
            <site-breadcrumb></site-breadcrumb>
            <h2 class="title">[[activeItem.title]]</h2>
            <div id="slot">
              <slot></slot>
            </div>
          </div>
          <paper-button
            id="next"
            noink
            on-click="nextPage"
            disabled="[[disableNextPage(activeManifestIndex)]]"
            class="arrow-floats"
          >
            <iron-icon icon="icons:chevron-right"></iron-icon>
          </paper-button>
          <paper-tooltip for="next" offset="8" position="left">
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
    this.$.menu.addEventListener(
      "active-item",
      this.mapMenuActiveChanged.bind(this)
    );
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.$.menu.removeEventListener(
      "active-item",
      this.mapMenuActiveChanged.bind(this)
    );
  }
  /**
   * Mix in an opened status
   */
  static get properties() {
    let props = super.properties;
    props.opened = {
      type: Boolean,
      reflectToAttribute: true
    };
    return props;
  }
  /**
   * When map menu changes let's set a track icon internal to it.
   */
  mapMenuActiveChanged(e) {
    // update the UI directly
    e.detail.trackIcon = "icons:check";
    // now work on the user data object in the theme layer
    let userData = JSON.parse(window.localStorage.getItem("HAXCMSSystemData"));
    userData.manifests[this.manifest.id].accessData[e.detail.id] = {
      timestamp: Math.floor(Date.now() / 1000),
      trackIcon: "icons:check"
    };
    for (var i in this.manifest.items) {
      if (this.manifest.items[i].id === e.detail.id) {
        this.manifest.items[i].metadata.accessData =
          userData.manifests[this.manifest.id].accessData[e.detail.id];
      }
    }
    // save this back to the system data
    window.localStorage.setItem("HAXCMSSystemData", JSON.stringify(userData));
  }
  toggleDrawer(e) {
    this.$.drawer.toggle();
  }
}
window.customElements.define(LearnTwoTheme.tag, LearnTwoTheme);
export { LearnTwoTheme };

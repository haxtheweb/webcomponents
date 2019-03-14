/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXCMSTheme } from "@lrnwebcomponents/haxcms-elements/lib/HAXCMSThemeWiring.js";
import "@lrnwebcomponents/haxcms-elements/lib/theme/navigation/site-breadcrumb.js";
import "@lrnwebcomponents/haxcms-elements/lib/theme/active-pieces/site-active-title.js";
import "@lrnwebcomponents/haxcms-elements/lib/theme/site-pieces/site-title.js";
import "@lrnwebcomponents/haxcms-elements/lib/theme/site-pieces/site-rss-button.js";
import "@lrnwebcomponents/haxcms-elements/lib/theme/navigation/site-menu.js";
import "@lrnwebcomponents/haxcms-elements/lib/theme/navigation/site-menu-button.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@polymer/app-layout/app-drawer/app-drawer.js";
import "@polymer/app-layout/app-drawer-layout/app-drawer-layout.js";
import "@polymer/paper-icon-button/paper-icon-button.js";

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
          background: #fafafa;
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

        site-active-title {
          --site-active-title-heading: {
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
        }
        site-title {
          position: relative;
          overflow: hidden;
          --site-title-link: {
            display: inline-block;
            color: #fafafa;
            text-decoration: none;
          }
          --site-title-heading: {
            font-family: "Montserrat", "Helvetica", "Tahoma", "Geneva", "Arial",
              sans-serif;
            font-size: 28px;
            margin: 0;
            padding: 0;
            letter-spacing: -3px;
            line-height: 78px;
            text-align: center;
            text-rendering: optimizelegibility;
            font-weight: 100;
          }
        }
        site-menu {
          background-color: #383f45;
          color: #ffffff;
          padding: 0;
          overflow: scroll;
          max-height: calc(100vh - 200px);
          --site-menu-active-color: #ffffff;
          --site-menu: {
            background-color: #383f45;
            color: #ffffff;
          }
          --site-menu-container: {
            padding: 0;
            background-color: #2d3237;
          }
          --site-menu-item-active-item: {
            color: #2d3237;
          }
        }

        site-menu::-webkit-scrollbar-track {
          -webkit-box-shadow: inset 0 0 4px rgba(56, 63, 69, 0.9);
          border-radius: 0;
          background-color: #383f45;
        }
        site-menu::-webkit-scrollbar {
          width: 2px;
          background-color: #383f45;
        }
        site-menu::-webkit-scrollbar-thumb {
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
        site-menu-button {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 300px;
          --site-menu-button-icon: {
            width: 64px;
            height: 64px;
            display: contents;
            color: #2d3237;
          }
          --site-menu-button-button: {
            background-color: rgba(0, 0, 0, 0);
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
        }
        site-menu-button:not([disabled]):hover,
        site-menu-button:not([disabled]):active,
        site-menu-button:not([disabled]):focus {
          opacity: 1;
          background-color: rgba(0, 0, 0, 0.1);
        }
        app-drawer-layout[narrow] site-menu {
          max-height: calc(100vh - 160px);
        }
        app-drawer-layout[narrow] site-menu-button {
          bottom: 0;
          top: unset;
          --site-menu-button-button: {
            background-color: transparent !important;
            width: 64px;
            height: 64px;
          }
        }
        site-menu-button[type="next"] {
          right: 0;
          left: unset;
        }
        app-drawer-layout[narrow] site-menu-button[type="prev"] {
          left: unset;
        }
        :host([opened]) app-drawer-layout[narrow] site-menu-button[type="prev"],
        :host([opened])
          app-drawer-layout[narrow]
          site-menu-button[type="next"] {
          display: none;
        }
      </style>
      <custom-style>
        <style>
          html,
          body {
            background-color: #fafafa;
          }
        </style>
      </custom-style>
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
              <site-title></site-title>
            </div>
          </div>
          <site-menu></site-menu>
          <div class="rss-buttons">
            <site-rss-button type="atom"></site-rss-button>
            <site-rss-button type="rss"></site-rss-button>
          </div>
        </app-drawer>
        <div>
          <site-menu-button type="prev"></site-menu-button>
          <div id="contentcontainer">
            <site-breadcrumb></site-breadcrumb>
            <site-active-title></site-active-title>
            <div id="slot">
              <slot></slot>
            </div>
          </div>
          <site-menu-button type="next"></site-menu-button>
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
  toggleDrawer(e) {
    this.$.drawer.toggle();
  }
}
window.customElements.define(LearnTwoTheme.tag, LearnTwoTheme);
export { LearnTwoTheme };

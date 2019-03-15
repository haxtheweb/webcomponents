/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXCMSTheme } from "@lrnwebcomponents/haxcms-elements/lib/theme/HAXCMSThemeWiring.js";
import "@lrnwebcomponents/grid-plate/grid-plate.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/haxcms-elements/lib/theme/active-pieces/site-active-title.js";
import "@lrnwebcomponents/haxcms-elements/lib/theme/blocks/site-children-block.js";
import "@lrnwebcomponents/haxcms-elements/lib/theme/navigation/site-breadcrumb.js";
import "@lrnwebcomponents/haxcms-elements/lib/theme/navigation/site-top-menu.js";
import "@lrnwebcomponents/haxcms-elements/lib/theme/site-pieces/site-rss-button.js";
import "@lrnwebcomponents/haxcms-elements/lib/theme/site-pieces/site-title.js";
/**
 * `haxcms-basic-theme`
 * `An incredibly basic theme. Great starting point for new site discussions.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class HAXCMSBasicTheme extends HAXCMSTheme(PolymerElement) {
  // render function
  static get template() {
    return html`
      <style include="simple-colors">
        :host {
          display: block;
          background-color: white;
        }
        .container {
          margin: 24px auto;
          max-width: 1280px;
          width: 90%;
        }
        site-breadcrumb {
          margin-left: 16px;
        }
        /**
         * Hide the slotted content during edit mode. This must be here to work.
         */
        :host([edit-mode]) #slot {
          display: none;
        }
        site-top-menu {
          --site-top-menu-bg: #37474f;
          --site-top-menu-link-color: #ffffff;
          --site-top-menu-indicator-color: #ffffff;
          --site-top-menu-link-active-color: yellow;
          --site-top-menu-indicator-arrow: 8px;
        }
        site-children-block {
          --site-children-block-button: {
            color: #ffffff;
          }
          --site-children-block-button-active: {
            background-color: #37474f;
            color: yellow;
          }
        }
        .left-col {
          min-height: 250px;
          border: 2px solid black;
          background-color: #37474f;
          color: white;
          padding: 16px;
        }
        site-active-title {
          --site-active-title-heading: {
            font-family: "Montserrat", "Helvetica", "Tahoma", "Geneva", "Arial",
              sans-serif;
            font-size: 16px;
            line-height: 16px;
            margin-bottom: 8px;
            text-rendering: optimizelegibility;
            font-weight: 600;
            color: white;
          }
        }
        site-title {
          position: relative;
          overflow: hidden;
          height: 50px;
          --site-title-link: {
            display: inline-block;
            color: #fafafa;
            text-decoration: none;
          }
          --site-title-heading: {
            font-family: "Montserrat", "Helvetica", "Tahoma", "Geneva", "Arial",
              sans-serif;
            font-size: 26px;
            margin: 4px 16px 4px 0px;
            padding: 8px 0;
            text-align: center;
            font-weight: 100;
          }
        }
        .buttons {
          margin-top: 16px;
          display: flex;
        }
        .buttons site-rss-button {
          display: inline-flex;
        }
      </style>
      <site-top-menu noink indicator="arrow" arrow-size="8">
        <site-title slot="prefix" class="spacing"></site-title>
      </site-top-menu>
      <div id="contentcontainer" class="container">
        <site-breadcrumb></site-breadcrumb>
        <grid-plate layout="1-3">
          <div slot="col-1" class="left-col">
            <site-active-title></site-active-title>
            <site-children-block></site-children-block>
            <div class="buttons">
              <site-rss-button type="atom"></site-rss-button>
              <site-rss-button type="rss"></site-rss-button>
            </div>
          </div>
          <div slot="col-2">
            <div id="slot"><slot></slot></div>
          </div>
        </grid-plate>
      </div>
    `;
  }
}
window.customElements.define("haxcms-basic-theme", HAXCMSBasicTheme);
export { HAXCMSBasicTheme };

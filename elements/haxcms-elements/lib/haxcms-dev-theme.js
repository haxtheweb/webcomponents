/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import { HAXCMSTheme } from "@lrnwebcomponents/haxcms-elements/lib/HAXCMSThemeWiring.js";
import "@polymer/paper-card/paper-card.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-list/iron-list.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/hax-body/lib/hax-shared-styles.js";
import "@lrnwebcomponents/haxcms-elements/lib/theme/active-pieces/site-active-title.js";
import "@lrnwebcomponents/haxcms-elements/lib/theme/blocks/block-active-children.js";
import "@lrnwebcomponents/haxcms-elements/lib/theme/navigation/site-breadcrumb.js";
import "@lrnwebcomponents/haxcms-elements/lib/theme/navigation/site-menu.js";
import "@lrnwebcomponents/haxcms-elements/lib/theme/navigation/site-menu-button.js";
import "@lrnwebcomponents/haxcms-elements/lib/theme/navigation/site-top-menu.js";
import "@lrnwebcomponents/haxcms-elements/lib/theme/query/site-query.js";
import "@lrnwebcomponents/haxcms-elements/lib/theme/query/site-render-query.js";
import "@lrnwebcomponents/haxcms-elements/lib/theme/query/site-query-menu-slice.js";
import "@lrnwebcomponents/haxcms-elements/lib/theme/site-pieces/site-rss-button.js";
import "@lrnwebcomponents/haxcms-elements/lib/theme/site-pieces/site-title.js";
/**
 * `haxcms-dev-theme`
 * `A theme intended as the starting point to fork from and build new themes for HAXCMS
 *  which allows you to build things that just work using JSON Outline Schema as it's "backend"
 * and then IF hax is around it'll show up :)`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class HAXCMSDevTheme extends HAXCMSTheme(PolymerElement) {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "haxcms-dev-theme";
  }
  // render function
  static get template() {
    return html`
      <style include="simple-colors hax-shared-styles">
        :host {
          display: block;
          /* theme color which is dictated by the manifest */
          background-color: var(--haxcms-color, black);
        }
        site-query.cardlist {
          --site-query-iron-list: {
            padding: 16px;
            margin: 0 auto;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
          }
        }
        paper-card {
          width: 200px;
          color: black;
          background-color: blue;
          padding: 8px;
          font-size: 10px;
        }
        /**
         * Hide the slotted content during edit mode. This must be here to work.
         */
        :host([edit-mode]) #slot {
          display: none;
        }
        .manifest,
        .activeitem {
          width: 49%;
          min-height: 300px;
          height: 300px;
          overflow: scroll;
          border: 4px solid black;
          margin: 0;
          padding: 0;
          display: inline-block;
          vertical-align: text-top;
        }
        .buttons {
          display: flex;
        }
        site-top-menu {
          --site-top-menu-bg: #37474f;
          --site-top-menu-link-color: #ffffff;
          --site-top-menu-indicator-color: var(--haxcms-color, #ffffff);
          --site-top-menu-link-active-color: yellow;
          --site-top-menu-indicator-arrow: 8px;
        }
        .spacing paper-button {
          min-width: unset;
          text-transform: unset;
          background-color: var(--haxcms-color, #000000);
          color: #ffffff;
          margin: 0;
          border-radius: 0;
        }
        .spacing .indent {
          display: inline-flex;
        }
        .indent-1 {
          margin: 8px;
        }
        .indent-2 {
          margin: 16px;
        }
        .indent-3 {
          margin: 24px;
        }
        .indent-4 {
          margin: 32px;
        }
        .indent-5 {
          margin: 40px;
        }
        .indent-6 {
          margin: 48px;
        }
      </style>
      <site-top-menu noink indicator="arrow" arrow-size="8">
        <div slot="suffix" class="spacing">
          <a
            rel="noopener noreferrer"
            target="_blank"
            tabindex="-1"
            href="https://github.com/elmsln/HAXcms"
            data-title="Get it. Got it? Good."
          >
            <paper-button noink>Get HAXcms</paper-button>
          </a>
        </div>
      </site-top-menu>
      <site-query-menu-slice
        result="{{__items}}"
        start="1"
        end="10"
      ></site-query-menu-slice>
      <dom-repeat items="[[__items]]">
        <template>
          <div class="spacing">
            <div class$="indent indent-[[item.indent]]"></div>
            <a
              data-id$="[[item.id]]"
              class="link"
              tabindex="-1"
              href$="[[item.location]]"
              ><paper-button noink="[[noink]]">[[item.title]]</paper-button></a
            >
          </div>
        </template>
      </dom-repeat>
      <h1 style="margin:0;">HAXCMS DEVELOPMENT THEME</h1>
      <site-title></site-title>
      <div class="buttons">
        <site-menu-button type="prev"></site-menu-button>
        <site-menu-button type="next"></site-menu-button>
        <paper-button id="unset" on-tap="resetActive"
          >Unset activeItem</paper-button
        >
        <site-rss-button type="atom"></site-rss-button>
        <site-rss-button type="rss"></site-rss-button>
      </div>
      <div class="manifest">
        <h2>title: [[manifest.title]]</h2>
        <div>description: [[manifest.description]]</div>
        <div>
          icon: <iron-icon icon="[[manifest.metadata.icon]]"></iron-icon>
        </div>
        <div>
          image:
          <img
            src$="[[manifest.metadata.image]]"
            height="200px"
            width="200px"
          />
        </div>
      </div>
      <div class="activeitem">
        <site-breadcrumb></site-breadcrumb>
        <h2>ACTIVE ITEM</h2>
        <site-active-title></site-active-title>
        <div id="contentcontainer">
          <div id="slot"><slot></slot></div>
        </div>
      </div>
      <site-render-query class="cardlist" grid on-tap="_itemTapped">
        <template>
          <div style="padding:8px;">
            <paper-card
              heading="[[item.title]]"
              image="[[item.metadata.image]]"
              elevation="1"
              animated-shadow="false"
            >
              <div class="card-content">
                <div>description: [[item.description]]</div>
                <div>location: [[item.location]]</div>
                <div>changed: [[item.metadata.updated]]</div>
              </div>
              <div class="card-actions">
                <a tabindex="-1" href$="[[item.location]]"
                  ><paper-button data-id$="[[item.id]]"
                    >Set as active</paper-button
                  ></a
                >
              </div>
            </paper-card>
          </div>
        </template>
      </site-render-query>
      <site-menu></site-menu>
    `;
  }
  /**
   * Item tapped, let's set it as active by searching the manifest array
   * Your theme is in charge of ensuring that when activeItem needs changed
   * that it ensures that happens
   */
  _itemTapped(e) {
    var normalizedEvent = dom(e);
    var local = normalizedEvent.localTarget;
    var activeId = local.getAttribute("data-id");
    if (
      local.tagName === "PAPER-BUTTON" &&
      typeof activeId !== typeof undefined
    ) {
      // console log these so you can debug easily as you build out
      console.log(this.manifest);
    }
  }
}
window.customElements.define(HAXCMSDevTheme.tag, HAXCMSDevTheme);
export { HAXCMSDevTheme };

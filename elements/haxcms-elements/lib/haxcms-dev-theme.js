/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "@polymer/paper-card/paper-card.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-list/iron-list.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/hax-body/lib/hax-shared-styles.js";
import { HAXCMSTheme } from "./HAXCMSThemeWiring.js";
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
        iron-list {
          padding: 16px;
          margin: 0 auto;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
        }
        paper-card {
          width: 200px;
          color: black;
          background-color: white;
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
      </style>
      <h1 style="margin:0;">HAXCMS DEVELOPMENT THEME</h1>
      <div>
        <paper-button
          disabled="[[disablePrevPage(activeManifestIndex)]]"
          on-click="prevPage"
          >Previous
        </paper-button>
        <paper-button
          disabled="[[disableNextPage(activeManifestIndex)]]"
          on-click="nextPage"
          >Next
        </paper-button>
        <paper-button id="unset" on-tap="resetActive"
          >Unset activeItem</paper-button
        >
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
        <h2>ACTIVE ITEM</h2>
        <div>[[activeItem.title]]</div>
        <div id="contentcontainer">
          <div id="slot"><slot></slot></div>
        </div>
      </div>
      <iron-list id="list" items="[[manifest.items]]" grid on-tap="_itemTapped">
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
                    >Click to set activeItem</paper-button
                  ></a
                >
              </div>
            </paper-card>
          </div>
        </template>
      </iron-list>
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
      console.log(this.setActiveItemFromID(activeId));
    }
  }
}
window.customElements.define(HAXCMSDevTheme.tag, HAXCMSDevTheme);
export { HAXCMSDevTheme };

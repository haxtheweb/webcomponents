/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "@polymer/paper-card/paper-card.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-list/iron-list.js";
import "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/hax-body/lib/hax-shared-styles.js";
import { HAXCMSThemeWiring } from "./HAXCMSThemeWiring.js";
import { store } from "./haxcms-site-store.js";
import { autorun, toJS } from "mobx";
/**
 * `haxcms-dev-theme`
 * `A theme intended as the starting point to fork from and build new themes for HAXCMS
 *  which allows you to build things that just work using JSON Outline Schema as it's "backend"
 * and then IF hax is around it'll show up :)`
 *
 * @demo demo/index.html
 */
Polymer({
  is: "haxcms-dev-theme",
  _template: html`
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
        width: 48%;
        margin: 0;
        padding: 0;
        display: inline-block;
        vertical-align: text-top;
      }
    </style>
    <h1 style="margin:0;">HAXCMS DEVELOPMENT THEME</h1>
    <iron-list id="list" items="[[manifest.items]]" grid>
      <template>
        <div style="padding:16px;">
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
    <div class="manifest">
      <h2>title: [[manifest.title]]</h2>
      <div>description: [[manifest.description]]</div>
      <div>icon: <iron-icon icon="[[manifest.metadata.icon]]"></iron-icon></div>
      <div>
        image:
        <img src$="[[manifest.metadata.image]]" height="200px" width="200px" />
      </div>
    </div>
    <div class="activeitem">
      <paper-button id="unset">Unset activeItem</paper-button>
      <h2>ACTIVE ITEM</h2>
      <div>[[activeItem.title]]</div>
      <div id="contentcontainer">
        <div id="slot"><slot></slot></div>
      </div>
    </div>
  `,
  behaviors: [SchemaBehaviors.Schema],
  properties: {
    /**
     * editting state for the page
     */
    editMode: {
      type: Boolean,
      reflectToAttribute: true
    },
    /**
     * Active item which is in JSON Outline Schema
     */
    activeItem: {
      type: Object
    },
    /**
     * a manifest json file decoded, in JSON Outline Schema format
     */
    manifest: {
      type: Object
    }
  },
  /**
   * created life cycle
   */
  created: function() {
    this.HAXCMSThemeWiring = new HAXCMSThemeWiring(this);
  },
  /**
   * ready life cycle
   */
  ready: function() {
    this.HAXCMSThemeWiring.connect(this, this.$.contentcontainer);
    this.$.list.addEventListener("tap", this._itemTapped.bind(this));
    this.$.unset.addEventListener("tap", this._unsetTapped.bind(this));
  },
  /**
   * attached life cycle
   */
  attached: function() {
    this.__disposer = autorun(() => {
      this.manifest = toJS(store.routerManifest);
    });
  },
  /**
   * detatched life cycle
   */
  detached: function() {
    this.HAXCMSThemeWiring.disconnect(this);
    this.__disposer();
    this.$.list.removeEventListener("tap", this._itemTapped.bind(this));
    this.$.unset.removeEventListener("tap", this._unsetTapped.bind(this));
  },
  /**
   * Item tapped, let's set it as active by searching the manifest array
   * Your theme is in charge of ensuring that when activeItem needs changed
   * that it ensures that happens
   */
  _itemTapped: function(e) {
    var normalizedEvent = dom(e);
    var local = normalizedEvent.localTarget;
    var activeId = local.getAttribute("data-id");
    if (
      local.tagName === "PAPER-BUTTON" &&
      typeof activeId !== typeof undefined
    ) {
      const item = this.manifest.items
        .filter((d, i) => {
          if (activeId === d.id) {
            return d;
          }
        })
        .pop();
      // console log these so you can debug easily as you build out
      console.log(this.manifest);
      console.log(item);
    }
  },
  /**
   * Settings activeItem to nothing will ensure that state goes back to nothing active
   * and then other options appear
   */
  _unsetTapped: function(e) {
    window.history.pushState(null, null, store.location.baseUrl);
    window.dispatchEvent(new PopStateEvent("popstate"));
    this.fire("json-outline-schema-active-item-changed", {});
  }
});

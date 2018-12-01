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
import "./haxcms-theme-behavior.js";
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
    <style is="custom-style" include="simple-colors">
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
              <paper-button data-id$="[[item.id]]"
                >Click to set activeItem</paper-button
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
  behaviors: [SchemaBehaviors.Schema, HAXCMSBehaviors.Theme],
  properties: {
    // The behavior gives you editMode, activeItem and manifest
    // You can add whatever else you need here
  },
  /**
   * Ready life cycle
   */
  ready: function() {
    // required so that HAX is injected when available
    this.setupHAXTheme();
  },
  attached: function() {
    this.$.list.addEventListener("tap", this._itemTapped.bind(this));
    this.$.unset.addEventListener("tap", this._unsetTapped.bind(this));
  },
  /**
   * Detatched life cycle
   */
  detached: function() {
    // this helps with cleaning things up if the theme is changed
    this.setupHAXTheme(false);
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
      this.fire("json-outline-schema-active-item-changed", item);
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
    this.fire("json-outline-schema-active-item-changed", {});
  }
});

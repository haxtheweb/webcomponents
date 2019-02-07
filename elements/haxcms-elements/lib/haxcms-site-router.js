import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import * as async from "@polymer/polymer/lib/utils/async.js";
import { Router } from "@vaadin/router";
import { autorun } from "mobx";
import { store } from "./haxcms-site-store";

/**
 * `haxcms-site-router`
 * `front-end router for haxcms`
 * @demo demo/index.html
 * @microcopy - the mental model for this element
 * - This is a factory element, it doesn't do much on its own visually
 * - it loads a site.json file and then utilizes this data in order to construct
 *   what theme it should load (element) in order to get everything off and running
 */
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>
  `,

  is: "haxcms-site-router",

  properties: {
    /**
     * Manifest from file
     */
    manifest: {
      type: Object,
      notify: true,
      observer: "_manifestChanged"
    },
    baseURI: {
      type: String
    }
  },

  /**
   * ready life cycle
   */
  created: function() {
    autorun(() => {
      this._manifestChanged(store.routerManifest);
    });
    window.addEventListener(
      "vaadin-router-location-changed",
      this._routerLocationChanged.bind(this)
    );
    // window.addEventListener(
    //   "json-outline-schema-changed",
    //   this._jsonOutlineSchemaChangedHandler.bind(this)
    // );
    // window.addEventListener(
    //   "json-outline-schema-active-item-changed",
    //   this._jsonOutlineSchemaActiveItemChangedHandler.bind(this)
    // );
    // window.addEventListener(
    //   "haxcms-site-router-location-subscribe",
    //   this._haxcmsSiteRouterLocationSubscribe.bind(this)
    // );
  },
  attached: function() {},
  /**
   * Detached life cycle
   */
  detached: function() {
    window.removeEventListener(
      "vaadin-router-location-changed",
      this._routerLocationChanged.bind(this)
    );
    // window.rem(
    //   "json-outline-schema-changed",
    //   this._jsonOutlineSchemaChangedHandler.bind(this)
    // );
    // window.addEventListener(
    //   "json-outline-schema-active-item-changed",
    //   this._jsonOutlineSchemaActiveItemChangedHandler.bind(this)
    // );
    // window.addEventListener(
    //   "haxcms-site-router-location-subscribe",
    //   this._haxcmsSiteRouterLocationSubscribe.bind(this)
    // );
  },

  /**
   * notice changes to the maifest and publish a new verion of the
   * router manifest on the event bus.
   */
  _manifestChanged: function(routerManifest) {
    if (routerManifest) {
      // rebuild the router
      this._updateRouter(routerManifest);
    }
  },

  /**
   * Update the router based on a manifest.
   * This should not be called directly. Use the
   * 'haxcms-router-manifest-changed' event
   *
   * @param {object} manifest
   */
  _updateRouter: function(manifest) {
    if (!manifest || typeof manifest.items === "undefined") return;
    let options = {};
    if (this.baseURI) {
      options.baseUrl = this.baseURI;
    }
    const router = new Router(this, options);
    const routerItems = manifest.items.map(i => {
      return {
        path: i.location,
        name: i.id,
        component: "haxcms-site-router-location"
      };
    });
    router.setRoutes([
      ...routerItems,
      { path: "/", component: "haxcms-site-router-location", name: "home" },
      { path: "/(.*)", component: "haxcms-site-router-location", name: "404" }
    ]);
  },

  /**
   * React to page changes in the vaadin router and convert it
   * to a "haxcms-active-item-changed" event.
   * @param {event} e
   */
  _routerLocationChanged: function(e) {
    //store local state
    store.location = e.detail.location;
  },

  /**
   * Listen to changes to the root manifest update the local
   * state.
   * @param {event} e
   */
  _jsonOutlineSchemaChangedHandler: function(e) {
    const manifest = e.detail;
    this.manifest = {};
    this.manifest = manifest;
  },

  /**
   * White label JSON Outline Schema Event
   *
   * Subscribe to Active event changes.
   *
   * @param {event} e
   */
  _jsonOutlineSchemaActiveItemChangedHandler: function(e) {
    window.dispatchEvent(
      new CustomEvent("haxcms-site-router-active-item-changed", {
        detail: e.detail
      })
    );
  },

  /**
   * Event Handler for 'haxcms-router-location-changed-subscribe'
   */
  _haxcmsSiteRouterLocationSubscribe: function(e) {
    const defaultOptions = {
      setup: false
    };
    // combine default options and the subscription from the request
    const subscription = Object.assign({}, defaultOptions, e.detail);
    if (typeof subscription.callback === "undefined") {
      console.error(
        "No callback provided on haxcms-site-router-location-subscribe."
      );
      return;
    }
    if (typeof subscription.scope === "undefined") {
      console.error(
        "No scope provided on haxcms-site-router-location-subscribe."
      );
      return;
    }
    // dynaimcally add the event listener for more router manifest changes
    subscription.scope.addEventListener(
      "haxcms-site-router-location-changed",
      subscription.scope[subscription.callback]
    );
    // if setup option is true then manually trigger the callback
    if (subscription.setup) {
      // create a synthetic event and send directly to the scope
      const syntheticEvent = new CustomEvent(
        "haxcms-site-router-location-changed",
        {
          detail: this._location
        }
      );
      // manually call the change event
      subscription.scope[subscription.callback](syntheticEvent);
    }
  }
});

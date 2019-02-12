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
    baseUri: {
      type: String
    }
  },

  /**
   * ready life cycle
   */
  created: function() {
    /**
     * Subscribe to changes in the manifest
     */
    autorun(() => {
      this._manifestChanged(store.routerManifest);
    });
    window.addEventListener(
      "vaadin-router-location-changed",
      this._routerLocationChanged.bind(this)
    );
  },

  /**
   * Detached life cycle
   */
  detached: function() {
    window.removeEventListener(
      "vaadin-router-location-changed",
      this._routerLocationChanged.bind(this)
    );
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
    if (this.baseUri) {
      options.baseUrl = this.baseUri;
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
   * to a change in the mobx store.
   * @param {event} e
   */
  _routerLocationChanged: function(e) {
    //store local state
    store.location = e.detail.location;
  }
});

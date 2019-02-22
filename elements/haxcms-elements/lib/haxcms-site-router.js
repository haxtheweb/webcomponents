import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
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
    <slot></slot>
  `,

  is: "haxcms-site-router",

  properties: {
    baseURI: {
      type: String
    }
  },

  /**
   * ready life cycle
   */
  created: function() {
    // create router
    let options = {};
    if (this.baseURI) {
      options.baseUrl = this.baseURI;
    }
    this.router = new Router(this, options);
    /**
     * Subscribe to changes in the manifest
     */
    autorun(() => {
      this._updateRouter(store.routerManifest);
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
   * Update the router based on a manifest.
   * This should not be called directly. Use the
   * 'haxcms-router-manifest-changed' event
   *
   * @param {object} manifest
   */
  _updateRouter: function(manifest) {
    if (!manifest || typeof manifest.items === "undefined") return;
    const routerItems = manifest.items.map(i => {
      return {
        path: i.location,
        name: i.id,
        component: `fake-${i.id}-e`
      };
    });
    this.router.setRoutes([
      ...routerItems,
      { path: "/", component: "fake-home-e", name: "home" },
      { path: "/(.*)", component: "fake-404-e", name: "404" }
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

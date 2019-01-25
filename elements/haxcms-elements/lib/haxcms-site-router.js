import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import * as async from "@polymer/polymer/lib/utils/async.js";
import { Router } from "@vaadin/router";

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
    window.addEventListener(
      "vaadin-router-location-changed",
      this._routerLocationChanged.bind(this)
    );
    window.addEventListener(
      "haxcms-router-manifest-changed",
      this._haxcmsRouterManifestChanged.bind(this)
    );
    window.addEventListener(
      "haxcms-router-manifest-subscribe",
      this._haxcmsRouterManifestSubscribe.bind(this)
    );
    window.addEventListener(
      "json-outline-schema-changed",
      this._jsonOutlineSchemaChangedHandler.bind(this)
    );
  },
  attached: function() {},
  /**
   * Detached life cycle
   */
  detached: function() {
    window.addEventListener(
      "vaadin-router-location-changed",
      this._routerLocationChanged.bind(this)
    );
    window.addEventListener(
      "haxcms-router-manifest-changed",
      this._haxcmsRouterManifestChanged.bind(this)
    );
    window.addEventListener(
      "haxcms-router-manifest-subscribe",
      this._haxcmsRouterManifestSubscribe.bind(this)
    );
  },

  /**
   * Event Handler for 'haxcms-router-manifest-subscribe'
   *
   * @example
   * const options = {}
   * options.callback = '_routerManifestChanged'
   * options.scope = this
   * options.setup = true
   * window.dispatchEvent(new CustomEvent('haxcms-router-manifest-subscribe', options))
   *
   *
   *
   * @param {string} callback function name that should be called on scope
   * @param {DOM} scope dom element that will be called
   * @param {boolean} setup should this callback be initial triggered (default: false)
   */
  _haxcmsRouterManifestSubscribe: function(e) {
    const defaultOptions = {
      setup: false
    };
    // combine default options and the subscription from the request
    const subscription = Object.assign({}, defaultOptions, e.detail);
    if (typeof subscription.callback === "undefined") {
      console.error(
        "No callback provided on haxcms-router-manifest-subscribe."
      );
      return;
    }
    if (typeof subscription.scope === "undefined") {
      console.error("No scope provided on haxcms-router-manifest-subscribe.");
      return;
    }
    // dynaimcally add the event listener for more router manifest changes
    subscription.scope.addEventListener(
      "haxcms-router-manifest-updated",
      subscription.scope[subscription.callback]
    );
    // if setup option is true then manually trigger the callback
    if (subscription.setup) {
      const routerManifest = this._createManifestRouterInstance(this.manifest);
      // create a synthetic event and send directly to the scope
      const syntheticEvent = new CustomEvent("haxcms-router-manifest-changed", {
        detail: routerManifest
      });
      // manually call the change event
      subscription.scope[subscription.callback](syntheticEvent);
    }
  },

  /**
   * notice changes to the maifest and publish a new verion of the
   * router manifest on the event bus.
   */
  _manifestChanged: function(newValue, oldValue) {
    if (newValue) {
      // normalize the manifest for the router
      const routerManifest = this._createManifestRouterInstance(newValue);
      // disptach a change event
      window.dispatchEvent(
        new CustomEvent("haxcms-router-manifest-changed", {
          detail: routerManifest
        })
      );
    }
  },

  /**
   * Returns a normalized router manifest based on a manifest
   * @param {object} manifest
   * @return routerManifest
   */
  _createManifestRouterInstance: function(manifest) {
    if (
      typeof manifest !== "undefined" &&
      typeof manifest.items !== "undefined"
    ) {
      const manifestItems = manifest.items.map(i => {
        let location = i.location
          .replace("pages/", "")
          .replace("/index.html", "");
        return Object.assign({}, i, { location: location });
      });
      // create a new router manifest object
      return Object.assign({}, manifest, {
        items: manifestItems
      });
    }
  },

  /**
   * Event handler for 'haxcms-router-manifest-changed'
   * Update the router so it can build new routes
   * @param {event} e
   */
  _haxcmsRouterManifestChanged: function(e) {
    this._updateRouter(e.detail);
  },

  /**
   * Update the router based on a manifest.
   * This should not be called directly. Use the
   * 'haxcms-router-manifest-changed' event
   *
   * @param {object} manifest
   */
  _updateRouter: function(manifest) {
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
      { path: "/(.*)", component: "haxcms-site-router-location", name: "404" }
    ]);
  },

  /**
   * React to page changes in the vaadin router and convert it
   * to a "haxcms-active-item-changed" event.
   * @param {event} e
   */
  _routerLocationChanged: function(e) {
    const activeItem = e.detail.location.route.name;
    console.log("activeItem:", activeItem);
    let find = this.manifest.items.filter(item => {
      if (item.id !== activeItem) {
        return false;
      }
      return true;
    });
    // if we found one, make it the active page
    if (find.length > 0) {
      let found = find.pop();
      async.microTask.run(() => {
        setTimeout(() => {
          if (typeof window.cmsSiteEditor !== typeof undefined) {
            window.cmsSiteEditor.initialActiveItem = found;
          }
          this.fire("haxcms-active-item-changed", found);
        }, 150);
      });
    }
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
  }
});

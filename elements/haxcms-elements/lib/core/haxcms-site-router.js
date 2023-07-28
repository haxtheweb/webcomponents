import { Router } from "@vaadin/router";
import { autorun } from "mobx";
import { store } from "./haxcms-site-store.js";
/**
 * `haxcms-site-router`
 * `front-end router for haxcms`
 */
class HAXCMSSiteRouter extends HTMLElement {
  get baseURI() {
    return this.getAttribute("base-uri");
  }
  set baseURI($value) {
    this.setAttribute("base-uri", $value);
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "haxcms-site-router";
  }
  /**
   * ready life cycle
   */
  constructor() {
    super();
    this.windowControllers = new AbortController();
    window.HAXCMS.requestAvailability().storePieces.siteRouter = this;
    // create router
    let options = {};
    if (this.baseURI) {
      options.baseUrl = this.baseURI;
    }
    this.router = new Router(this, options);
    /**
     * Subscribe to changes in the manifest
     */
    this.__disposer = this.__disposer ? this.__disposer : [];
    autorun((reaction) => {
      this._updateRouter(store.routerManifest);
      this.__disposer.push(reaction);
    });

    window.addEventListener(
      "vaadin-router-location-changed",
      this._routerLocationChanged.bind(this),
      { signal: this.windowControllers.signal }
    );
    window.addEventListener(
      "haxcms-site-router-add",
      this.addRoutesEvent.bind(this),
      { signal: this.windowControllers.signal }
    );
  }
  /**
   * Detached life cycle
   */
  disconnectedCallback() {
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    this.windowControllers.abort();
  }
  addRoutesEvent(e) {
    this.addRoutes(e.detail);
  }
  addRoutes(pathAry) {
    this.router.addRoutes(pathAry);
  }

  /**
   * Update the router based on a manifest.
   * This should not be called directly. Use the store to change store.routerManifest
   *
   * @param {object} routerManifest
   */
  _updateRouter(routerManifest) {
    if (!routerManifest || typeof routerManifest.items === "undefined") return;
    const routerItems = routerManifest.items.map((i) => {
      return {
        path: i.slug,
        name: i.id,
        component: `fake-${i.id}-e`,
      };
    });
    this.router.setRoutes([
      ...routerItems,
      { path: "/", component: "fake-home-e", name: "home" },
      { path: "/(.*)", component: "fake-404-e", name: "404" },
    ]);
  }
  // validate that a route exists
  lookupRoute(routeName = null) {
    if  (routeName && store.routerManifest && store.routerManifest.items && store.routerManifest.items.filter((i) => i.slug === routeName).length > 0) {
      return store.routerManifest.items.filter((i) => i.slug === routeName);
    }
    return false
  }
  /**
   * React to page changes in the vaadin router and convert it
   * to a change in the mobx store.
   * @param {event} e
   */
  _routerLocationChanged(e) {
    // need to store this separate from location bc it's possible to hit routes that are in the system
    // while location is assuming routes within the system itself
    store.currentRouterLocation = e.detail.location;
    // ignore 404s for files and assets as we actually might be reequesting those in page
    if (e.detail.location.route.name === "404" && (e.detail.location.params[0].startsWith("files/") || e.detail.location.params[0].startsWith("assets/"))) {
      // go to the file, if it's a miss that's not our app's concern
      window.location = e.detail.location.pathname;
    }
    // PWAs on static domains need to be able to handle 404s which redirect to ?p=/slug bc of our handles
    // this is ONLY used for initial page hit at these locations
    else if (e.detail.location.route.name === "home" && e.detail.location.search.startsWith('?p=/') && this.lookupRoute(e.detail.location.search.replace('?p=/', ''))) {
      let item = this.lookupRoute(e.detail.location.search.replace('?p=/', ''))[0];
      store.activeId = item.id;
      window.history.replaceState({}, null, e.detail.location.search.replace('?p=/', ''));
    }
    else {
      store.location = e.detail.location;
    }
  }
}

customElements.define(HAXCMSSiteRouter.tag, HAXCMSSiteRouter);
export { HAXCMSSiteRouter };

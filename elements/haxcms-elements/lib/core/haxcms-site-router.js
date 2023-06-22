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
    // create router
    let options = {};
    if (this.baseURI) {
      options.baseUrl = this.baseURI;
    }
    this.router = new Router(this, options);
    /**
     * Subscribe to changes in the manifest
     */
    this.__disposer = autorun(() => {
      this._updateRouter(store.routerManifest);
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
    this.__disposer.dispose();
    this.windowControllers.abort();
    super.disconnectedCallback();
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

  /**
   * React to page changes in the vaadin router and convert it
   * to a change in the mobx store.
   * @param {event} e
   */
  _routerLocationChanged(e) {
    store.location = e.detail.location;
  }
}

customElements.define(HAXCMSSiteRouter.tag, HAXCMSSiteRouter);
export { HAXCMSSiteRouter };

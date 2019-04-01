import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { Router } from "@vaadin/router";
import { autorun } from "mobx";
import { store } from "./haxcms-site-store.js";
/**
 * `haxcms-site-router`
 * `front-end router for haxcms`
 */
class HAXCMSSiteRouter extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "haxcms-site-router";
  }
  // render function
  static get template() {
    return html`
      <slot></slot>
    `;
  }
  static get properties() {
    return {
      baseURI: {
        type: String
      }
    };
  }
  /**
   * ready life cycle
   */
  constructor() {
    super();
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
      this._routerLocationChanged.bind(this)
    );
  }

  /**
   * Detached life cycle
   */
  disconnectedCallback() {
    this.__disposer();
    window.removeEventListener(
      "vaadin-router-location-changed",
      this._routerLocationChanged.bind(this)
    );
    super.disconnectedCallback();
  }

  /**
   * Update the router based on a manifest.
   * This should not be called directly. Use the
   * 'haxcms-router-manifest-changed' event
   *
   * @param {object} routerManifest
   */
  _updateRouter(routerManifest) {
    if (!routerManifest || typeof routerManifest.items === "undefined") return;
    const routerItems = routerManifest.items.map(i => {
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
  }

  /**
   * React to page changes in the vaadin router and convert it
   * to a change in the mobx store.
   * @param {event} e
   */
  _routerLocationChanged(e) {
    // store local state
    store.location = e.detail.location;
  }
}

window.customElements.define(HAXCMSSiteRouter.tag, HAXCMSSiteRouter);
export { HAXCMSSiteRouter };

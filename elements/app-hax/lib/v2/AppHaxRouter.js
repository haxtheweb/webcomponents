import { HaxRouter } from "@haxtheweb/haxcms-elements/lib/core/hax-router.js";
import { autorun, toJS } from "mobx";
import { store } from "./AppHaxStore.js";

/**
 * `app-hax-router`
 */
export class AppHaxRouter extends HTMLElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   */

  static get tag() {
    return "app-hax-router";
  }
  /**
   * ready life cycle
   */

  constructor() {
    super();
    // create router
    const options = {};
    if (this.baseURI) {
      options.baseUrl = this.baseURI;
    }
    this.windowControllers = new AbortController();
    this.router = new HaxRouter(this, options);
    autorun(() => {
      const _mobx_val_0 = toJS(store.routes);
      Promise.resolve().then(() => {
        this._updateRouter(_mobx_val_0);
      });
    });
    autorun(() => {
      const _mobx_val_0 = toJS(store.manifest);
      const _mobx_val_1 = toJS(store.AppHaxAPI.basePath);
      Promise.resolve().then(() => {
        const manifest = _mobx_val_0;
        const baseURI = _mobx_val_1;
        if (manifest && manifest.items && manifest.items.length > 0) {
          const siteItemRoutes = manifest.items.map((i) => {
            return {
              path: i.slug.replace(baseURI, ""), // replacement of the basePath ensures routes match in haxiam / subdirs
              slug: i.slug,
              name: i.id,
              component: `fake-${i.id}-e`,
            };
          });
          store.routes = [...siteItemRoutes].concat(store.baseRoutes);
        }
      });
    });
  }

  connectedCallback() {
    globalThis.addEventListener(
      "hax-router-location-changed",
      this._routerLocationChanged.bind(this),
      { signal: this.windowControllers.signal },
    );
  }
  /**
   * Detached life cycle
   */

  disconnectedCallback() {
    this.windowControllers.abort();
  }

  /**
   * Update the router based on a manifest.
   */
  _updateRouter(routerItems) {
    this.router.setRoutes([...routerItems]);
  }
  /**
   * React to page changes in the router and convert it
   * to a change in the mobx store.
   * @param {event} e
   */

  // eslint-disable-next-line class-methods-use-this
  _routerLocationChanged(e) {
    store.location = e.detail.location;
  }
}
customElements.define(AppHaxRouter.tag, AppHaxRouter);

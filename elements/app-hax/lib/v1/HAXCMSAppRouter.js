import { Router } from '@vaadin/router';
import { autorun, toJS } from 'mobx';
import { store } from './HAXCMSAppStore.js';

/**
 * `haxcms-app-router`
 */
export class HAXCMSAppRouter extends HTMLElement {
  get baseURI() {
    return this.getAttribute('base-uri');
  }

  set baseURI($value) {
    this.setAttribute('base-uri', $value);
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */

  static get tag() {
    return 'haxcms-app-router';
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
    this.router = new Router(this, options);
    autorun(() => {
      this._updateRouter(toJS(store.routes));
    });
  }

  connectedCallback() {
    window.addEventListener(
      'vaadin-router-location-changed',
      this._routerLocationChanged.bind(this)
    );
  }
  /**
   * Detached life cycle
   */

  disconnectedCallback() {
    window.removeEventListener(
      'vaadin-router-location-changed',
      this._routerLocationChanged.bind(this)
    );
  }

  /**
   * Update the router based on a manifest.
   */
  _updateRouter(routerItems) {
    this.router.setRoutes([
      ...routerItems,
      { path: '/', component: 'fake-home-e', name: 'home' },
      { path: '/(.*)', component: 'fake-404-e', name: '404' },
    ]);
  }
  /**
   * React to page changes in the vaadin router and convert it
   * to a change in the mobx store.
   * @param {event} e
   */

  // eslint-disable-next-line class-methods-use-this
  _routerLocationChanged(e) {
    store.location = e.detail.location;
  }
}
customElements.define(HAXCMSAppRouter.tag, HAXCMSAppRouter);

/**
 * Copyright 2025 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { HAXCMSI18NMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSI18NMixin.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";

/**
 * `site-random-route`
 * `Route for randomly selecting and navigating to a published page`
 *
 */
export class SiteRandomRoute extends HAXCMSI18NMixin(DDD) {
  static get tag() {
    return "site-random-route";
  }

  constructor() {
    super();
    this.windowControllers = new AbortController();
    this.HAXCMSI18NMixinBase = "../../../";
    this.t.random = "Random Page";
    this.t.navigating = "Taking you to a random page...";
    this.t.noPages = "No published pages found";
    
    // Perform the random selection and redirection immediately
    this.performRandomRedirect();
  }

  /**
   * Get a random published page from the manifest
   */
  getRandomPage() {
    if (!store.routerManifest || !store.routerManifest.items) {
      return null;
    }

    // Get all published pages from the manifest
    // routerManifest already filters out unpublished pages when user is not logged in
    const publishedPages = store.routerManifest.items.filter((item) => {
      // Additional check to ensure we only get truly published items
      // The routerManifest handles most filtering, but we want to be extra careful
      if (item.metadata && item.metadata.published === false) {
        return false;
      }
      // Don't include internal routes or pages without proper slugs
      if (!item.slug || item._internalRoute || item.slug.startsWith('x/')) {
        return false;
      }
      return true;
    });

    if (publishedPages.length === 0) {
      console.warn('No published pages found for random selection');
      return null;
    }

    // Select a random page
    const randomIndex = Math.floor(Math.random() * publishedPages.length);
    return publishedPages[randomIndex];
  }

  /**
   * Perform the random redirect immediately
   */
  performRandomRedirect() {
    const randomPage = this.getRandomPage();
    
    if (!randomPage) {
      // No published pages found, stay on the random route
      return;
    }
    
    // Navigate to the random page using history API
    // Use pushState to allow back button to work properly
    globalThis.history.pushState({}, '', randomPage.slug);
    
    // Trigger a popstate event to notify the router
    globalThis.dispatchEvent(new PopStateEvent('popstate'));
  }

  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    this.windowControllers.abort();
    super.disconnectedCallback();
  }

  render() {
    // This should rarely be seen since we redirect immediately,
    // but provide feedback for edge cases
    const randomPage = this.getRandomPage();

    return html`
      <div role="status" aria-live="polite">
        ${!randomPage
          ? html`<p>${this.t.noPages}</p>`
          : html`<p>${this.t.navigating}</p>`
        }
      </div>
    `;
  }

  static get properties() {
    return {
      ...super.properties,
    };
  }
}

globalThis.customElements.define(SiteRandomRoute.tag, SiteRandomRoute);

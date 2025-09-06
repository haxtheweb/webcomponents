/**
 * Copyright 2025 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { HAXCMSI18NMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSI18NMixin.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";

/**
 * `site-home-route`
 * `Route for navigating to the configured homepage or first page in site`
 *
 */
export class SiteHomeRoute extends HAXCMSI18NMixin(DDD) {
  static get tag() {
    return "site-home-route";
  }

  constructor() {
    super();
    this.windowControllers = new AbortController();
    this.HAXCMSI18NMixinBase = "../../../";
    this.t.home = "Home Page";
    this.t.navigating = "Taking you to the home page...";
    this.t.noPages = "No pages found";

    // Perform the home redirect immediately
    this.performHomeRedirect();
  }

  /**
   * Get the configured homepage or first page from the manifest
   */
  getHomePage() {
    if (!store.routerManifest || !store.routerManifest.items) {
      return null;
    }

    // Check if there's a configured homePageId in the manifest
    const manifest = store.manifest;
    if (
      manifest &&
      manifest.metadata &&
      manifest.metadata.site &&
      manifest.metadata.site.homePageId &&
      manifest.metadata.site.homePageId !== ""
    ) {
      const homePageId = manifest.metadata.site.homePageId;

      // Find the page with the configured home page ID
      const homePage = store.routerManifest.items.find(
        (item) => item.id === homePageId,
      );

      // If the configured home page exists and is valid, use it
      if (
        homePage &&
        homePage.slug &&
        !homePage._internalRoute &&
        !homePage.slug.startsWith("x/")
      ) {
        // Verify page is published (if user is not logged in)
        if (
          homePage.metadata &&
          homePage.metadata.published === false &&
          !store.isLoggedIn
        ) {
          console.warn(
            "Configured home page is not published, falling back to first page",
          );
        } else {
          return homePage;
        }
      } else {
        console.warn(
          "Configured home page ID does not exist in manifest, falling back to first page",
        );
      }
    }

    // Fall back to first page in the site outline
    const publishedPages = store.routerManifest.items.filter((item) => {
      // Don't include internal routes or pages without proper slugs
      if (!item.slug || item._internalRoute || item.slug.startsWith("x/")) {
        return false;
      }
      // If user is not logged in, filter out unpublished pages
      if (
        !store.isLoggedIn &&
        item.metadata &&
        item.metadata.published === false
      ) {
        return false;
      }
      return true;
    });

    if (publishedPages.length === 0) {
      console.warn("No published pages found for home redirect");
      return null;
    }

    // Return the first page in the site outline
    return publishedPages[0];
  }

  /**
   * Perform the home redirect immediately
   */
  performHomeRedirect() {
    const homePage = this.getHomePage();

    if (!homePage) {
      // No pages found, stay on the home route
      return;
    }

    // Navigate to the home page using history API
    // Use pushState to allow back button to work properly
    globalThis.history.pushState({}, "", homePage.slug);

    // Trigger a popstate event to notify the router
    globalThis.dispatchEvent(new PopStateEvent("popstate"));
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
    const homePage = this.getHomePage();

    return html`
      <div role="status" aria-live="polite">
        ${!homePage
          ? html`<p>${this.t.noPages}</p>`
          : html`<p>${this.t.navigating}</p>`}
      </div>
    `;
  }

  static get properties() {
    return {
      ...super.properties,
    };
  }
}

globalThis.customElements.define(SiteHomeRoute.tag, SiteHomeRoute);

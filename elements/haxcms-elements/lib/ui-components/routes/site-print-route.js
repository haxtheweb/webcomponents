/**
 * Copyright 2025 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { HAXCMSI18NMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSI18NMixin.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { autorun, toJS } from "mobx";

/**
 * `site-print-route`
 * `Route for switching to print mode using the haxcms-print-theme`
 * Usage: x/print?page=some-page-slug
 */
export class SitePrintRoute extends HAXCMSI18NMixin(DDD) {
  static get tag() {
    return "site-print-route";
  }

  constructor() {
    super();
    this.windowControllers = new AbortController();
    this.HAXCMSI18NMixinBase = "../../../";
    this.t.print = "Print";
    this.t.redirectingToPrint = "Redirecting to print mode...";
    this.t.noPageSpecified = "No page specified for printing";
    this.t.pageNotFound = "The specified page could not be found";

    // Redirect immediately using the existing format=print-page functionality
    this.redirectToPrintMode();
  }

  /**
   * Get the page slug from URL parameters
   */
  getPageSlugFromUrl() {
    const urlParams = new URLSearchParams(globalThis.location.search);
    return urlParams.get("page");
  }

  /**
   * Validate that the specified page exists in the manifest
   */
  validatePage(slug) {
    if (!slug || !store.routerManifest || !store.routerManifest.items) {
      return null;
    }

    // Find the page in the manifest
    const page = store.routerManifest.items.find((item) => {
      return (
        item.slug === slug &&
        !item._internalRoute &&
        !item.slug.startsWith("x/")
      );
    });

    if (!page) {
      return null;
    }

    // Check if page is published (if user is not logged in)
    if (
      !store.isLoggedIn &&
      page.metadata &&
      page.metadata.published === false
    ) {
      return null;
    }

    return page;
  }

  /**
   * Get fallback page (home page) if no page is specified
   */
  getFallbackPage() {
    if (store.routerManifest && store.routerManifest.items) {
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

      if (publishedPages.length > 0) {
        return publishedPages[0]; // Return first available page
      }
    }
    return null;
  }

  /**
   * Redirect to print mode using the existing format=print-page functionality
   */
  redirectToPrintMode() {
    const pageSlug = this.getPageSlugFromUrl();
    let targetPage = null;

    if (pageSlug) {
      // Try to find the specified page
      targetPage = this.validatePage(pageSlug);
      if (!targetPage) {
        console.warn(`Page not found or not accessible: ${pageSlug}`);
        this.errorMessage = this.t.pageNotFound;
        return;
      }
    } else {
      // No page specified, use fallback
      targetPage = this.getFallbackPage();
      if (!targetPage) {
        console.warn("No pages available for printing");
        this.errorMessage = this.t.noPageSpecified;
        return;
      }
    }
    
    // Construct the URL with format=print-page parameter
    const printUrl = `${targetPage.slug}?format=print-page`;
    
    // Redirect to the print version
    globalThis.location.href = printUrl;
  }

  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    this.windowControllers.abort();
    super.disconnectedCallback();
  }

  render() {
    if (this.errorMessage) {
      return html`
        <div role="alert" aria-live="assertive">
          <h2>Print Error</h2>
          <p>${this.errorMessage}</p>
          <p>You can try:</p>
          <ul>
            <li>Going back to a specific page and using the print function there</li>
            <li>Using the format: <code>x/print?page=your-page-slug</code></li>
            <li>Checking that the page exists and is published</li>
          </ul>
        </div>
      `;
    }

    return html`
      <div role="status" aria-live="polite">
        <h2>${this.t.print}</h2>
        <p>${this.t.redirectingToPrint}</p>
      </div>
    `;
  }

  static get properties() {
    return {
      ...super.properties,
      errorMessage: { type: String },
    };
  }
}

globalThis.customElements.define(SitePrintRoute.tag, SitePrintRoute);

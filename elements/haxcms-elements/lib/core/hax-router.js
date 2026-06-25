/**
 * `hax-router`
 * Lightweight router replacement for router
 * Implements only the API surface used by HAXcms and app-hax.
 */
export class HaxRouter {
  constructor(outlet, options = {}) {
    this.outlet = outlet;
    this.baseUrl =
      options.baseUrl !== undefined
        ? options.baseUrl
        : this._getDefaultBaseUrl();
    this.routes = [];
    this._clickHandler = this._onClick.bind(this);
    globalThis.addEventListener("popstate", this._onPopstate.bind(this));
    if (globalThis.document) {
      globalThis.document.addEventListener(
        "click",
        this._clickHandler,
      );
    }
  }

  /**
   * Match Router default: derive baseUrl from <base href> if present
   */
  _getDefaultBaseUrl() {
    if (globalThis.document && globalThis.document.head) {
      const baseElement = globalThis.document.head.querySelector("base");
      if (baseElement) {
        const baseHref = baseElement.getAttribute("href");
        if (baseHref) {
          const url = new URL(baseHref, globalThis.document.URL);
          return url.pathname.replace(/[^\/]*$/, "");
        }
      }
    }
    return "";
  }

  /**
   * Intercept clicks on <a> tags to enable client-side navigation.
   * Uses composedPath to handle shadow DOM retargeting.
   */
  _onClick(event) {
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

    // Use composedPath so we can find the <a> even inside shadow DOM
    const path = event.composedPath ? event.composedPath() : [event.target];
    let anchor = null;
    for (const el of path) {
      if (el instanceof HTMLElement && el.tagName === "A") {
        anchor = el;
        break;
      }
      if (el === globalThis.document || el === globalThis.window) break;
    }
    if (!anchor) return;

    if (anchor.target && anchor.target !== "_self") return;
    if (anchor.hasAttribute("download")) return;
    if (anchor.hasAttribute("router-ignore")) return;

    const href = anchor.getAttribute("href");
    if (!href) return;

    const origin = globalThis.location.origin;
    let url;
    try {
      url = new URL(href, anchor.baseURI || globalThis.document.baseURI || globalThis.location.href);
    } catch (e) {
      return;
    }

    if (url.origin !== origin) return;

    // If this is just a fragment on the current page, let the browser handle it
    if (url.pathname === globalThis.location.pathname && url.hash) return;

    event.preventDefault();
    globalThis.history.pushState(null, "", url.pathname + url.search + url.hash);
    globalThis.scrollTo(0, 0);
    this._resolve();
  }

  /**
   * Get pathname with baseUrl stripped
   */
  _getCleanPathname() {
    let pathname = globalThis.location.pathname;
    if (this.baseUrl && this.baseUrl !== "/") {
      if (pathname.startsWith(this.baseUrl)) {
        pathname = pathname.slice(this.baseUrl.length);
        if (!pathname.startsWith("/")) {
          pathname = "/" + pathname;
        }
      }
    }
    return pathname;
  }

  /**
   * Match pathname against defined routes
   */
  _matchRoute(pathname) {
    if (!pathname.startsWith("/")) {
      pathname = "/" + pathname;
    }

    for (const route of this.routes) {
      const routePath = route.path;

      // Handle root match
      if (routePath === "/" || routePath === "") {
        if (pathname === "/" || pathname === "") {
          return { route, params: [] };
        }
      }

      const normalizedRoutePath = routePath.startsWith("/")
        ? routePath
        : "/" + routePath;

      // Exact match
      if (normalizedRoutePath === pathname) {
        return { route, params: [] };
      }

      // Wildcard: /(.*) or /(.*)?
      if (
        normalizedRoutePath === "/(.*)" ||
        normalizedRoutePath === "/(.*)?"
      ) {
        const remaining = pathname === "/" ? "" : pathname.slice(1);
        return { route, params: [remaining] };
      }

      // Parameterized routes (future-proofing)
      if (normalizedRoutePath.includes(":")) {
        const regexPath = normalizedRoutePath.replace(/:([^/]+)/g, "([^/]+)");
        const regex = new RegExp(`^${regexPath}$`);
        const match = pathname.match(regex);
        if (match) {
          return { route, params: match.slice(1) };
        }
      }
    }

    // Fallback to 404 if available
    const notFoundRoute = this.routes.find((r) => {
      const p = (r.path || "").startsWith("/") ? r.path : "/" + r.path;
      return p === "/(.*)" || p === "/(.*)?";
    });

    if (notFoundRoute) {
      const remaining = pathname === "/" ? "" : pathname.slice(1);
      return { route: notFoundRoute, params: [remaining] };
    }

    return null;
  }

  /**
   * Resolve current location and dispatch event
   */
  _resolve() {
    if (!this.routes.length) return;

    const pathname = this._getCleanPathname();
    const match = this._matchRoute(pathname);

    if (match) {
      const location = {
        pathname: globalThis.location.pathname,
        search: globalThis.location.search,
        baseUrl: this.baseUrl,
        route: match.route,
        params: match.params,
      };

      globalThis.dispatchEvent(
        new CustomEvent("hax-router-location-changed", {
          detail: { location },
        }),
      );
    }
  }

  setRoutes(routes) {
    this.routes = [...routes];
    this._resolve();
  }

  addRoutes(routes) {
    this.routes = [...this.routes, ...routes];
    this._resolve();
  }

  _onPopstate() {
    this._resolve();
  }
}

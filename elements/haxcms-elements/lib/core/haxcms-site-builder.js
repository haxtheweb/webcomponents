/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
// deep imports keep the whole utils barrel off the first-paint path
import { encapScript, findTagsInHTML } from "@haxtheweb/utils/lib/safe-html.js";
import { wipeSlot } from "@haxtheweb/utils/lib/slot.js";
import { varExists } from "@haxtheweb/utils/lib/object-path.js";
import {
  localStorageSet,
  localStorageGet,
} from "@haxtheweb/utils/lib/storage.js";
import { buildPageContentHTML } from "./utils/page-content-html.js";
import {
  neutralizeStrayScripts,
  sanitizeNodeTree,
} from "@haxtheweb/utils/lib/sanitize.js";
import { autorun, toJS } from "mobx";
import { store, HAXcmsStore } from "./haxcms-site-store.js";
import "./haxcms-site-router.js";
import "@haxtheweb/simple-progress/simple-progress.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { whenIdle } from "@haxtheweb/utils/lib/idle.js";
import "@haxtheweb/replace-tag/replace-tag.js";
// toggle store darkmode
function darkToggle(e) {
  if (e.matches) {
    // dark mode
    store.darkMode = true;
  } else {
    // light mode
    store.darkMode = false;
  }
}
/**
 * `haxcms-site-builder`
 * `build the site and everything off of this`
 * @microcopy - the mental model for this element
 * - This is a factory element, it doesn't do much on its own visually
 * - it loads a site.json file and then utilizes this data in order to construct
 *   what theme it should load (element) in order to get everything off and running
 */
class HAXCMSSiteBuilder extends I18NMixin(LitElement) {
  static get styles() {
    return [
      css`
        :host {
          display: block;
          position: relative;
        }
        :host([is-logged-in]:not([preview-mode])) {
          max-height: calc(100vh - 56px);
        }
        :host #slot {
          opacity: 0;
          visibility: hidden;
          transition: opacity var(--ddd-duration-normal, 0.3s) ease-in-out;
        }
        :host([theme-loaded]) #slot {
          opacity: 1;
          visibility: visible;
        }
        simple-progress {
          display: block;
          width: 100%;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background-color: transparent;
          z-index: 1000;
          --simple-progress-active-color: var(
            --haxcms-color,
            rgba(255, 255, 255, 0.5)
          );
        }
        simple-progress[disabled] {
          display: none;
        }

        /* nothing moves with prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          :host,
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            transition-delay: 0ms !important;
          }
        }
      `,
    ];
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "haxcms-site-builder";
  }
  // render function
  render() {
    return html`
      <haxcms-site-router base-uri="${this.baseURI}"></haxcms-site-router>
      <simple-progress .disabled="${!this.loading}"></simple-progress>
      <div id="slot"><slot></slot></div>
      <slot name="haxcms-site-editor-ui-prefix-avatar"></slot>
      <slot name="haxcms-site-editor-ui-prefix-buttons"></slot>
      <slot name="haxcms-site-editor-ui-suffix-buttons"></slot>
      <slot name="haxcms-site-editor-ui-main-menu"></slot>
      <slot name="haxcms-site-editor-ui-topbar-character-button"></slot>
    `;
  }
  /**
   * Convert HTML into HAX Elements without HAXStore dependency
   * Similar to HAXStore.htmlToHaxElements but works for all users
   */
  async htmlToHaxElements(html) {
    let elements = [];
    let fragment = globalThis.document.createElement("div");
    fragment.innerHTML = html;

    // Test that this is valid HTML and has children
    if (fragment.children) {
      const children = fragment.children;
      // only needed here (style guide / template parsing), never for first paint
      const { nodeToHaxElement } = await import("@haxtheweb/utils/utils.js");
      // Loop over the new nodes and convert each to HAXElement
      for (let i = 0; i < children.length; i++) {
        if (typeof children[i].tagName !== typeof undefined) {
          // Use nodeToHaxElement from utils - no validation filtering
          elements.push(await nodeToHaxElement(children[i], null));
        }
      }
    }
    return elements;
  }

  /**
   * Get available style guide templates for a given tag name
   * Returns array of template options with id and name for HAX configure forms
   */
  async getStyleGuideTemplates(tagName, preloadedContent = null) {
    try {
      // Use preloaded content if provided, otherwise load from store
      const styleGuideContent =
        preloadedContent || (await store.loadStyleGuideContent());
      if (!styleGuideContent) {
        return [];
      }

      // Convert style guide content to HAX schema elements
      const styleGuideElements =
        await this.htmlToHaxElements(styleGuideContent);

      const templates = [];

      for (const styleElement of styleGuideElements) {
        // Look for page-template elements
        if (styleElement && styleElement.tag === "page-template") {
          // Get the actual content element inside the page-template
          if (styleElement.content) {
            const templateContentElement = await this.htmlToHaxElements(
              styleElement.content,
            );
            if (
              templateContentElement &&
              templateContentElement.length > 0 &&
              templateContentElement[0].tag === tagName
            ) {
              // Extract template information
              const templateId =
                styleElement.properties && styleElement.properties.id;
              const templateName =
                styleElement.properties && styleElement.properties.name;

              if (templateId && templateName) {
                templates.push({
                  value: templateId,
                  text: templateName,
                });
              }
            }
          }
        }
      }

      return templates;
    } catch (error) {
      console.warn("Failed to get style guide templates:", error);
      return [];
    }
  }

  /**
   * Simple "two way" data binding from the element below via events
   */
  _updateManifest(data) {
    this.manifest = { ...data };
  }
  hashCode(s) {
    return s.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
  }
  // normalize the application of IDs so that we can target parts
  // of the page for scroll and referencing in general via URL hash
  nodeNormalizeIDs(node) {
    if (
      node.tagName &&
      node.getAttribute("id") == null &&
      ["H1", "H2", "H3", "H4", "H5", "H6"].includes(node.tagName)
    ) {
      if (node.getAttribute("resource")) {
        node.setAttribute("id", node.getAttribute("resource"));
      } else {
        let id =
          node.tagName.toLowerCase() + "-" + this.hashCode(node.innerText);
        node.setAttribute("id", id);
      }
    }
  }
  _runPendingPageLoad(previousLocation = null, previousItemId = null) {
    const currentItem = toJS(store.activeItem);
    const currentItemId = currentItem && currentItem.id ? currentItem.id : null;
    if (
      this.__pendingPageLoad ||
      (this.activeItemLocation &&
        this.activeItemLocation !== previousLocation) ||
      (currentItemId && previousItemId && currentItemId !== previousItemId)
    ) {
      this.__pendingPageLoad = false;
      this.loadPageData();
    }
  }
  _updateActiveItemContent(data, activeItem = null) {
    if (data) {
      // security: parse page HTML in an inert document (no browsing context)
      // so nothing in it runs or loads while ids are normalized; the live
      // insert happens later in _activeItemContentChanged after sanitizing
      const inert = globalThis.document.implementation.createHTMLDocument("");
      let tmp = inert.createElement("div");
      tmp.innerHTML = data;
      for (const node of tmp.childNodes) {
        this.nodeNormalizeIDs(node);
      }
      data = tmp.innerHTML;
      // cheat to ensure we get a rebuild of the content in case
      // they only modified page title / other page-break based details
      this.__pageContent = data;
      const resolvedActiveItem = activeItem
        ? activeItem
        : toJS(store.activeItem);
      if (resolvedActiveItem && resolvedActiveItem.id) {
        this.__pageContentOwner = resolvedActiveItem.id;
      }
      this._activeItemContentChanged(this.__pageContent, resolvedActiveItem);
      this._flushAfterFirstContent();
    }
    // punt, we didn't find anything
    else if (
      store.cmsSiteEditorBackend.instance &&
      store.cmsSiteEditorBackend.instance.updateActiveItemContent
    ) {
      store.cmsSiteEditorBackend.instance.updateActiveItemContent();
    }
  }
  display404Error() {
    if (store.themeElement) {
      // security: the requested route is attacker controlled (it is the URL
      // that was not found), so build this with text nodes and encode it for
      // the search link instead of interpolating it into HTML
      const route = String(store.getInternalRoute() || "");
      const doc = globalThis.document;
      let frag = doc.createDocumentFragment();
      let p = doc.createElement("p");
      let strong = doc.createElement("strong");
      strong.textContent = route;
      p.appendChild(strong);
      p.appendChild(
        doc.createTextNode(
          ` ${this.t.couldNotBeLocated}. ${this.t.hereAreSomePossibleRemedies}`,
        ),
      );
      let ul = doc.createElement("ul");
      let searchLi = doc.createElement("li");
      let searchLink = doc.createElement("a");
      searchLink.setAttribute(
        "href",
        "x/displays/search?search=" + encodeURIComponent(route),
      );
      searchLink.textContent =
        this.t.useSearchToLocateTheContentYouAreLookingFor;
      searchLi.appendChild(searchLink);
      ul.appendChild(searchLi);
      let homeLi = doc.createElement("li");
      let homeLink = doc.createElement("a");
      homeLink.setAttribute("href", "./");
      homeLink.textContent = this.t.goToTheHomePage;
      homeLi.appendChild(homeLink);
      ul.appendChild(homeLi);
      let menuLi = doc.createElement("li");
      menuLi.textContent = this.t.navigateToAnotherPageInTheMenu;
      ul.appendChild(menuLi);
      // the HTML parser closed the <p> before the <ul>; keep that structure
      frag.appendChild(p);
      frag.appendChild(ul);
      wipeSlot(store.themeElement, "*");
      store.themeElement.appendChild(frag);
      this._setThemeBusyState(false);
    }
  }
  // interenal routes supply their own component which we render
  renderInternalRoute() {
    if (store.themeElement) {
      let frag = globalThis.document.createDocumentFragment();
      if (store.activeItem.component) {
        import(`../ui-components/routes/${store.activeItem.component}.js`).then(
          () => {
            let el = globalThis.document.createElement(
              store.activeItem.component,
            );
            frag.appendChild(el);
            wipeSlot(store.themeElement, "*");
            store.themeElement.appendChild(frag);
            this._setThemeBusyState(false);
          },
        );
      } else {
        this._setThemeBusyState(false);
      }
    }
  }
  /**
   * Load Page data
   */
  async loadPageData() {
    // file required or we have nothing; other two mixed in for pathing
    if (!this.activeItemLocation) {
      return;
    }
    // queue requests while one is in-flight so route switching stays responsive
    if (this.loading) {
      this.__pendingPageLoad = true;
      return;
    }
    this.loading = true;
    this.__pendingPageLoad = false;
    this._setThemeBusyState(true);
    const requestedLocation = this.activeItemLocation;
    const requestedItem = toJS(store.activeItem);
    const requestedItemId =
      requestedItem && requestedItem.id ? requestedItem.id : null;
    let url = `${this.outlineLocation}${requestedLocation}`;
    // a revalidation found newer site.json; make sure this page body is
    // newer too instead of trusting an HTTP-cached copy
    let fetchOptions = {};
    let pageStamp = this._timeStamp;
    if (this.__freshNextPage) {
      this.__freshNextPage = false;
      fetchOptions = { cache: "no-store" };
      if (!pageStamp) {
        pageStamp = Date.now();
      }
    }
    if (pageStamp) {
      if (url.indexOf("?") !== -1) {
        url += `&${pageStamp}`;
      } else {
        url += `?${pageStamp}`;
      }
    }
    if (requestedLocation === "hax-internal-route.html") {
      this.renderInternalRoute();
      this.loading = false;
      this._runPendingPageLoad(requestedLocation, requestedItemId);
    } else {
      await fetch(url, fetchOptions)
        .then((response) => {
          if (response.ok) {
            return response.text();
          } else {
            this.display404Error();
            this.loading = false;
            this._runPendingPageLoad(requestedLocation, requestedItemId);
            return null;
          }
        })
        .then((data) => {
          if (data === null || typeof data === typeof undefined) {
            return;
          }
          const currentItem = toJS(store.activeItem);
          const locationUnchanged =
            this.activeItemLocation === requestedLocation;
          const itemUnchanged =
            requestedItemId === null ||
            (currentItem &&
              currentItem.id &&
              currentItem.id === requestedItemId);
          if (locationUnchanged && itemUnchanged) {
            this._updateActiveItemContent(data, currentItem);
          }
          this.loading = false;
          this._runPendingPageLoad(requestedLocation, requestedItemId);
        })
        .catch((err) => {
          this.loading = false;
          this._setThemeBusyState(false);
          this._runPendingPageLoad(requestedLocation, requestedItemId);
          this.lastErrorChanged(err);
        });
    }
  }
  /**
   * Load JSON Outline Schema / site.json format
   */
  async loadJOSData() {
    // file required or we have nothing; other two mixed in for pathing
    if (this.file) {
      this.loading = true;
      let url = `${this.outlineLocation}${this.file}`;
      try {
        // if this is successful it means we were handed a JSON blob of the site itself
        let data = JSON.parse(this.file);
        this._updateManifest(data);
        this.loading = false;
      } catch {
        // weird looking but this is the typical use-case in which
        // we got a file path and try to load it because the above silently failed
        if (this._timeStamp && this._timeStamp != "") {
          if (url.indexOf("?") !== -1) {
            url += `&${this._timeStamp}`;
          } else {
            url += `?${this._timeStamp}`;
          }
        }
        // no-cache revalidates with the server, so an HTTP-cached copy is
        // never used unchecked; the very first request (no timestamp)
        // matches a <link rel="preload"> of the same URL in the page shell
        let headers = { cache: "no-cache" };
        await fetch(url, headers)
          .then((response) => {
            if (response.ok) {
              return response.text();
            }
          })
          .then((text) => {
            if (typeof text === "string") {
              this.__manifestText = text;
              this._updateManifest(JSON.parse(text));
              this._scheduleManifestRevalidation();
            }
            this.loading = false;
          })
          .catch((err) => {
            this.lastErrorChanged(err);
          });
      }
    }
  }
  /**
   * Once, after first paint and when the browser is idle, ask the server for
   * site.json again with no caching at all. The first load may have been
   * served from a preload or an intermediate cache; if the server copy is
   * different, apply it and refetch the active page fresh. Logged-in users
   * already refetch with a fresh timestamp when login is detected, so
   * editing always starts from the latest copy.
   */
  _scheduleManifestRevalidation() {
    if (this.__manifestRevalidationScheduled) {
      return;
    }
    this.__manifestRevalidationScheduled = true;
    this._afterFirstContent(() => this._revalidateManifest(), 5000);
  }
  async _revalidateManifest() {
    // logged in: the login autorun already forced a fresh timestamped load
    if (!this.file || this.isLoggedIn || this._timeStamp) {
      return false;
    }
    // same URL as the first load, revalidated: the browser sends
    // If-None-Match / If-Modified-Since and an unchanged site.json comes back
    // as a 304, instead of downloading the whole manifest again (it used to
    // be no-store + a timestamp: a full second copy on every page load).
    // no-cache also makes intermediate caches check with the server.
    const url = `${this.outlineLocation}${this.file}`;
    try {
      const response = await fetch(url, { cache: "no-cache" });
      if (!response.ok) {
        return false;
      }
      const text = await response.text();
      // a login or editor save may have landed while we waited
      if (this.isLoggedIn || this._timeStamp || text === this.__manifestText) {
        return false;
      }
      const data = JSON.parse(text);
      this.__manifestText = text;
      this.__freshNextPage = true;
      this._updateManifest(data);
      this.loadPageData();
      return true;
    } catch (err) {
      // the copy on screen stays; this check is best-effort
      console.warn(err);
      return false;
    }
  }
  /**
   * Run work only after the first page body is on screen, then when the
   * browser is idle (capped by `timeout`), so it never competes with the
   * requests and rendering of first paint. A 10 second cap covers pages
   * that never render a body (404s, internal routes, errors).
   */
  _afterFirstContent(callback, timeout = 5000) {
    const run = () => whenIdle(callback, { timeout, fallbackDelay: 500 });
    if (this.__firstContentDone) {
      run();
      return;
    }
    if (!this.__afterFirstContentQueue) {
      this.__afterFirstContentQueue = [];
      setTimeout(() => this._flushAfterFirstContent(), 10000);
    }
    this.__afterFirstContentQueue.push(run);
  }
  _flushAfterFirstContent() {
    if (this.__firstContentDone) {
      return;
    }
    this.__firstContentDone = true;
    const queue = this.__afterFirstContentQueue || [];
    this.__afterFirstContentQueue = [];
    // one more frame so the new body has painted before idle work starts
    globalThis.requestAnimationFrame(() => queue.forEach((run) => run()));
  }
  /**
   * The toast (and the RPG character it draws) is not needed for first
   * paint. Load it the first time anything asks for a toast, or when the
   * browser is idle, then hand it whatever was asked for in the meantime.
   */
  _installLazyToast() {
    if (globalThis.HAXCMSToast && globalThis.HAXCMSToast.instance) {
      return;
    }
    const queued = [];
    let loading = null;
    const events = ["haxcms-toast-show", "haxcms-toast-hide"];
    const capture = (e) => {
      if (globalThis.HAXCMSToast && globalThis.HAXCMSToast.instance) {
        return;
      }
      // nothing is showing yet, so a hide (the router sends one on every
      // route change) only matters if it follows a queued show
      if (e.type === "haxcms-toast-hide" && queued.length === 0) {
        return;
      }
      queued.push(e);
      load();
    };
    const load = () => {
      if (!loading) {
        loading = import("./haxcms-toast.js")
          .then((mod) => {
            events.forEach((name) =>
              globalThis.removeEventListener(name, capture),
            );
            const toast = mod.HAXCMSToastInstance;
            queued.forEach((e) => {
              if (e.type === "haxcms-toast-show") {
                toast.showSimpleToast(e);
              } else {
                toast.hideSimpleToast(e);
              }
            });
            queued.length = 0;
          })
          .catch((error) => {
            console.warn(error);
          });
      }
      return loading;
    };
    events.forEach((name) =>
      globalThis.addEventListener(name, capture, {
        signal: this.windowControllers.signal,
      }),
    );
    this._afterFirstContent(load, 8000);
  }
  /**
   * A published (or 11ty) site with no connection settings never gets an
   * editor, so the editor builder and the site API registry it pulls in
   * are skipped there.
   */
  _needsEditorBuilder() {
    const context = HAXcmsStore.getApplicationContext();
    if (!["published", "11ty"].includes(context)) {
      return true;
    }
    return (
      globalThis.appSettings &&
      typeof globalThis.appSettings === "object" &&
      Object.keys(globalThis.appSettings).length > 0
    );
  }
  /**
   * life cycle willUpdate — handle theme/manifest derivation + notify events
   * before render so reactive sets (themeLoaded) batch into the current
   * update cycle instead of scheduling a redundant second update (Lit
   * change-in-update warning). These handlers have NO dependency on
   * __ready (themeData/themeName arrive via autorun after firstUpdated),
   * so they are safe to run pre-render.
   */
  willUpdate(changedProperties) {
    if (super.willUpdate) {
      super.willUpdate(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "themeData") {
        this._themeChanged(this[propName], oldValue);
      } else if (propName == "themeName") {
        this._themeNameChanged(this[propName], oldValue);
      } else if (propName == "outlineLocation") {
        // fire an to match notify
        this.dispatchEvent(
          new CustomEvent("outline-location-changed", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: this[propName],
          }),
        );
      } else if (propName == "manifest") {
        // fire an to match notify
        this.dispatchEvent(
          new CustomEvent("manifest-changed", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: this[propName],
          }),
        );
        this._manifestChanged(this[propName], oldValue);
      }
    });
  }
  /**
   * life cycle updated — load triggers MUST live here (not willUpdate)
   * because they are gated on this.__ready, which is set in firstUpdated.
   * Lit runs willUpdate BEFORE firstUpdated, so a first-cycle load decision
   * in willUpdate sees __ready === false and skips — permanently missing
   * the initial site.json fetch when outlineLocation/file arrive in the
   * first update batch (the ~1-in-3 blank-screen regression). updated()
   * runs AFTER firstUpdated, so __ready is reliably true here.
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    // track these so we can debounce if multiple values updated at once
    let loadOutline = false;
    let loadPage = false;
    changedProperties.forEach((oldValue, propName) => {
      if (
        ["outlineLocation", "activeItemLocation"].includes(propName) &&
        this[propName] != ""
      ) {
        loadPage = true;
      }
      if (
        ["outlineLocation", "file"].includes(propName) &&
        this[propName] != ""
      ) {
        loadOutline = true;
      }
      if (propName == "_timeStamp" && this[propName]) {
        loadOutline = true;
        loadPage = true;
      }
    });
    // the first timestamped load after login is the copy edits start from:
    // site.json first, then the page body (a page load asked for while
    // site.json is in flight is only queued), and the editor UI waits on it
    if (
      this.__resolveFreshManifest &&
      this.isLoggedIn &&
      this._timeStamp &&
      changedProperties.has("_timeStamp") &&
      this.__ready
    ) {
      const resolve = this.__resolveFreshManifest;
      this.__resolveFreshManifest = null;
      this.loadJOSData()
        .then(() => this.loadPageData())
        .then(resolve, resolve);
      return;
    }
    if (loadOutline && this.__ready) {
      this.loadJOSData();
    }
    if (loadPage && this.__ready) {
      this.loadPageData();
    }
  }
  static get properties() {
    return {
      ...super.properties,
      t: {
        type: Object,
      },
      activeItemLocation: {
        type: String,
        attribute: "active-item-location",
      },
      disableFeatures: {
        type: String,
        reflect: true,
        attribute: "disable-features",
      },
      _timeStamp: {
        type: String,
      },
      isLoggedIn: {
        type: Boolean,
        reflect: true,
        attribute: "is-logged-in",
      },
      /**
       * logged in, but drawing the site as a visitor sees it
       */
      previewMode: {
        type: Boolean,
        reflect: true,
        attribute: "preview-mode",
      },
      /**
       * queryParams
       */
      queryParams: {
        type: Object,
      },
      /**
       * Loading status of the page to render.
       */
      loading: {
        type: Boolean,
        reflect: true,
      },
      /**
       * support for alternate locations.
       */
      outlineLocation: {
        type: String,
        attribute: "outline-location",
      },
      /**
       * Manifest from file
       */
      manifest: {
        type: Object,
      },
      /**
       * Theme, used to boot a design element
       */
      themeData: {
        type: Object,
      },
      /**
       * Theme name, which we then use to setup the theme
       */
      themeName: {
        type: String,
      },
      /**
       * Imported items so we can allow theme flipping dynamically
       */
      __imported: {
        type: Object,
      },
      /**
       * theme loaded to indicate to the theme we have a theme ready to go
       */
      themeLoaded: {
        type: Boolean,
        reflect: true,
        attribute: "theme-loaded",
      },
      /**
       * Location of the site.json file
       */
      file: {
        type: String,
      },
      /**
       * Injected by HAXcms
       */
      baseURI: {
        type: String,
        attribute: "base-uri",
      },
    };
  }
  _themeNameChanged(newValue, oldValue) {
    if (newValue) {
      // drop old theme element if there is one
      if (
        store.themeElement &&
        newValue != oldValue &&
        store.themeElement.tagName.toLowerCase() != newValue
      ) {
        store.themeElement.remove();
      }
      // wipe out what we got
      wipeSlot(this, "*");
      store.themeElement = globalThis.document.createElement(newValue);
      // apply a class so that we can write generic CSS selectors in integrations
      store.themeElement.classList.add("haxcms-theme-element");
      this._applyThemePalette(store.themeElement, this.themeData);
      this.appendChild(store.themeElement);
      this._scheduleThemePaletteReapply(this.themeData);
    }
  }

  _getThemePalette(themeData) {
    let palette = null;
    if (
      themeData &&
      themeData.variables &&
      typeof themeData.variables.palette !== typeof undefined &&
      themeData.variables.palette !== null
    ) {
      palette = String(themeData.variables.palette).trim();
    }
    if (
      (palette === null || palette === "") &&
      store.manifest &&
      store.manifest.metadata &&
      store.manifest.metadata.theme &&
      store.manifest.metadata.theme.variables &&
      typeof store.manifest.metadata.theme.variables.palette !==
        typeof undefined &&
      store.manifest.metadata.theme.variables.palette !== null
    ) {
      palette = String(store.manifest.metadata.theme.variables.palette).trim();
    }
    // fallback to the theme's own default when the site has no palette defined
    if (
      (palette === null || palette === "") &&
      store.themeElement &&
      typeof store.themeElement.dataPalette !== typeof undefined &&
      store.themeElement.dataPalette !== null
    ) {
      palette = String(store.themeElement.dataPalette).trim();
    }
    return palette;
  }

  _applyThemePalette(themeElement, themeData, forceReapply = false) {
    if (!themeElement) {
      return;
    }
    const palette = this._getThemePalette(themeData);
    if (palette) {
      const normalizedPalette = String(palette).trim();
      if (
        forceReapply &&
        themeElement.getAttribute("data-palette") === normalizedPalette
      ) {
        themeElement.removeAttribute("data-palette");
      }
      themeElement.setAttribute("data-palette", normalizedPalette);
      this._ensureDDDPaletteStyles();
    } else {
      themeElement.removeAttribute("data-palette");
    }
  }

  _ensureDDDPaletteStyles() {
    if (
      globalThis.DesignSystemManager &&
      globalThis.DesignSystemManager.requestAvailability
    ) {
      const designSystemManager =
        globalThis.DesignSystemManager.requestAvailability();
      if (
        designSystemManager &&
        designSystemManager.systems &&
        designSystemManager.systems.ddd
      ) {
        designSystemManager.active = "ddd";
      }
    }
  }

  _scheduleThemePaletteReapply(themeData, delay = 80) {
    this.__themePaletteReapplyStamp = this.__themePaletteReapplyStamp + 1;
    const stamp = this.__themePaletteReapplyStamp;
    if (this.__themePaletteReapplyTimer) {
      clearTimeout(this.__themePaletteReapplyTimer);
    }
    this.__themePaletteReapplyTimer = setTimeout(() => {
      if (stamp !== this.__themePaletteReapplyStamp) {
        return;
      }
      this._applyThemePalette(store.themeElement, themeData, true);
    }, delay);
  }

  _setThemeBusyState(isBusy) {
    if (store.themeElement) {
      if (isBusy) {
        store.themeElement.setAttribute("aria-busy", "true");
      } else {
        store.themeElement.removeAttribute("aria-busy");
      }
    }
  }

  _clearStaleThemePresentation() {
    this.__pageContent = "";
    this.__pageContentOwner = null;
    if (store.themeElement) {
      wipeSlot(store.themeElement, "*");
    }
    this._setThemeBusyState(true);
  }

  /**
   * Alert there was an internal error in getting the file
   */
  lastErrorChanged(e) {
    if (e) {
      console.error(e);
      // not every error has a value if it just failed
      if (e.detail && e.detail.value) {
        // if we force reloads then let's do it now
        if (
          globalThis &&
          globalThis.location &&
          globalThis.appSettings &&
          globalThis.appSettings.reloadOnError
        ) {
          globalThis.location.reload();
        }
        store.toast(
          e.detail.value.status + " " + e.detail.value.statusText,
          5000,
          { fire: true },
        );
      } else {
        // no detail is bad, this implies a server level connection error
        // if we force reloads then let's do it now
        if (
          globalThis &&
          globalThis.location &&
          globalThis.appSettings &&
          globalThis.appSettings.reloadOnError
        ) {
          globalThis.location.reload();
        }
      }
    }
  }
  /**
   * ready life cycle
   */
  constructor() {
    super();
    this.__pageContent = "";
    this.__pageContentOwner = null;
    this.__activeItemId = null;
    this.__pendingPageLoad = false;
    this.windowControllers = new AbortController();
    this.t = {
      ...super.t,
      pageNotFound: "Page not found",
      navigateToAnotherPageInTheMenu: "Navigate to another page in the menu",
      couldNotBeLocated: "could not be located",
      hereAreSomePossibleRemedies: "Here are some possible remedies:",
      useSearchToLocateTheContentYouAreLookingFor:
        "Use Search to locate the content you are looking for",
      goToTheHomePage: "Go to the home page",
      redirectHint:
        "If the redirect doesn't work, please click the link above.",
      styleGuideTemplate: "Template",
      styleGuideTemplateDescription:
        "Choose a predefined style template for this element",
      styleGuideTemplateCustom: "Custom",
    };
    this.registerLocalization({
      context: this,
      namespace: "haxcms",
      localesPath: new URL(
        "../../locales/haxcms.es.json",
        import.meta.url,
      ).href.replace("/haxcms.es.json", "/"),
      // Remove locales array to rely on manifest-based detection
    });
    // first load uses the URL exactly as the page shell gives it so a
    // <link rel="preload"> of site.json / the active page is reused;
    // freshness comes from no-cache + the idle revalidation, and logged-in
    // users get a timestamped reload as soon as login is detected
    this._timeStamp = "";
    // resolves once a logged-in user has a fresh (timestamped) site.json and
    // page; the editor builder waits on it before showing the editor UI.
    // Capped so a slow or failed request never keeps the editor away.
    this.freshManifestReady = new Promise((resolve) => {
      this.__resolveFreshManifest = resolve;
    });
    this.disableFeatures = "";
    this.isLoggedIn = false;
    this.previewMode = false;
    this.__disposer = [];
    this.queryParams = {};
    this.loading = false;
    this.__imported = {};
    this.themeLoaded = false;
    this.__themePaletteReapplyTimer = null;
    this.__themePaletteReapplyStamp = 0;
    this.outlineLocation = "";
    this.activeItemLocation = "";
    if (HAXcmsStore.storePieces) {
      HAXcmsStore.storePieces.siteBuilder = this;
    }
    // support initial setup stuff with slots
    for (let i in this.children) {
      if (this.children[i].tagName && this.children[i].getAttribute("slot")) {
        const item = this.children[i].cloneNode(true);
        let key = item.getAttribute("slot");
        switch (key) {
          case "haxcms-site-editor-ui-prefix-avatar":
          case "haxcms-site-editor-ui-prefix-buttons":
          case "haxcms-site-editor-ui-suffix-buttons":
          case "haxcms-site-editor-ui-main-menu":
          case "haxcms-site-editor-ui-topbar-character-button":
            store.setupSlots[key].push(item);
            break;
        }
      }
    }
    globalThis.addEventListener &&
      globalThis.addEventListener(
        "hax-store-ready",
        this.storeReady.bind(this),
        {
          signal: this.windowControllers.signal,
        },
      );

    globalThis.addEventListener &&
      globalThis.addEventListener(
        "haxcms-trigger-update",
        this._triggerUpdatedData.bind(this),
        { signal: this.windowControllers.signal },
      );

    globalThis.addEventListener &&
      globalThis.addEventListener(
        "haxcms-trigger-update-node",
        this._triggerUpdatedNode.bind(this),
        { signal: this.windowControllers.signal },
      );
    // in-case we miss the initial state as opposed to a change event.
    // Only apply the platform preference on a first-ever visit (no stored
    // choice) so we never clobber an explicit light/dark override.
    if (localStorageGet("app-hax-darkMode", null) === null) {
      store.darkMode = globalThis.matchMedia
        ? globalThis.matchMedia("(prefers-color-scheme: dark)").matches
        : false;
    }
    // change is if platform / browser preference changes while using
    const darkQuery = globalThis.matchMedia
      ? globalThis.matchMedia("(prefers-color-scheme: dark)")
      : null;
    if (darkQuery) {
      darkQuery.addEventListener("change", darkToggle, {
        signal: this.windowControllers.signal,
      });
    }

    autorun(() => {
      const _mobx_val_0 = toJS(store.darkMode);
      const _mobx_val_1 = toJS(store.darkMode);
      Promise.resolve().then(() => {
        // preview's light / dark switch is for the preview only; never save it
        if (!store.previewMode && !store.inPreviewFrame) {
          localStorageSet("app-hax-darkMode", _mobx_val_0);
        }
        if (_mobx_val_1) {
          globalThis.document.body.classList.add("dark-mode");
        } else {
          globalThis.document.body.classList.remove("dark-mode");
        }
      });
    });
    autorun(() => {
      const _mobx_val_0 = toJS(store.previewMode);
      Promise.resolve().then(() => {
        this.previewMode = _mobx_val_0;
      });
    });
    autorun(() => {
      const _mobx_val_0 = toJS(store.isLoggedIn);
      Promise.resolve().then(() => {
        const isLoggedIn = _mobx_val_0;
        if (this.isLoggedIn !== isLoggedIn) {
          this.isLoggedIn = isLoggedIn;
        }
        const tstamp = Math.floor(Date.now() / 1000);
        if (this.isLoggedIn && !this.loggedInTime) {
          this.loggedInTime = tstamp;
          this._timeStamp = this.loggedInTime;
          // idle-warm the HAX editor closure so entering edit mode (or the
          // system dashboard) is near-instant for logged-in users instead of
          // a cold multi-second import chain. No-op for anonymous visitors.
          this._scheduleEditorWarmup();
        }
      });
    });
  }

  displayConsoleWarning() {
    setTimeout(() => {
      const headStyle =
        "color: white; font-weight: bold; font-size: 5em;font-family: arial; background-color: darkred; border: 5px solid white; border: 5px solid white;";
      const bodyStyle =
        "font-size: 1.5em; font-family: arial; color: white; background-color: darkred; ";
      console.warn("%c⚠️STOP⚠️", headStyle);
      console.warn(
        '%cThis is a browser feature intended for developers. If someone told you to copy and paste something here to enable a hidden feature or "hack" someone\'s account, it is a scam and will give them access to your account.',
        bodyStyle,
      );
    }, 3500);
  }
  // how to get involved with the project, right in the core
  displayConsoleLearnMore() {
    setTimeout(() => {
      const headStyle =
        "color: white; font-weight: bold; padding: 10px; font-size: 5em;font-family: arial; background-color: black; border: 5px solid white; border: 5px solid white; font-style: italic;";
      const bodyStyle =
        "color: white; background-color: black; font-size: 1.5em; font-family: arial; padding: 10px;";
      console.log("%c👩‍💻HAXcms🧑‍💻", headStyle);
      console.log(
        "%cThis site was created using HAXcms.\nLearn more about HAXcms at https://hax.psu.edu/.",
        bodyStyle,
      );
    }, 3000);
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.displayConsoleLearnMore();
    this.__ready = true;
    store.appReady = true;
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-ready", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this,
      }),
    );
    // toast loads on first use or on idle, never on the first-paint path
    this._installLazyToast();
    // dyanmcially import the editor builder which figures out if we should have one
    if (this._needsEditorBuilder()) {
      // prettier-ignore
      import(
        "@haxtheweb/haxcms-elements/lib/core/haxcms-editor-builder.js"
      )
        .then((_response) => {
          this.editorBuilder = globalThis.document.createElement("haxcms-editor-builder");
          // attach editor builder after we've appended to the screen
          if (this.parentNode) {
            this.parentNode.insertBefore(this.editorBuilder, this);
          }
          else {
            globalThis.document.body.appendChild(this.editorBuilder);
          }
          // freshness for every context comes from the idle revalidation
          // (and, once logged in, the timestamped reload); no unconditional
          // second download of site.json and the page here
        })
        .catch((error) => {
          /* Error handling */
          console.warn(error);
        });
    }
    globalThis.dispatchEvent(new Event("resize"));
    // haxtheweb/issues#3104: public, read-only WebMCP tools for browser
    // agents. Only loaded where the browser supports WebMCP; the module
    // itself withdraws the tools when someone logs in or opens the editor.
    // Deferred to idle time: agent tooling is never needed for first paint.
    if (globalThis.document && globalThis.document.modelContext) {
      whenIdle(() => {
        if (!this.isConnected) {
          return;
        }
        import("./utils/HAXCMSWebMCP.js")
          .then(({ initHAXcmsWebMCP }) => {
            this.__disposer.push(initHAXcmsWebMCP(store));
          })
          .catch(() => {});
      });
    }
    setTimeout(() => {
      this.__disposer.push(
        autorun((_reaction) => {
          const _mobx_val_0 = toJS(store.themeData);
          Promise.resolve().then(() => {
            const themeData = _mobx_val_0;
            if (themeData && this.themeData !== themeData) {
              this.themeData = themeData;
            }
            if (themeData) {
              // special support for "format" in the URL dictating the possible output format
              // this is for a11y, mobile, print and other possible output modes
              const urlParams = new URLSearchParams(globalThis.location.search);
              const formatParam = urlParams.get("format");
              const format = formatParam ? formatParam.toLowerCase() : null;
              if (format != null) {
                switch (format) {
                  case "print-page":
                    themeData.element = "haxcms-print-theme";
                    break;
                  case "json":
                  case "yaml":
                  case "md":
                  case "xml":
                    // dynamically import the JSON theme
                    import("./themes/haxcms-json-theme.js");
                    themeData.element = "haxcms-json-theme";
                    break;
                }
              }
              const disableFeatures = urlParams.get("disable-features");
              if (
                disableFeatures != null &&
                this.disableFeatures !== disableFeatures
              ) {
                this.disableFeatures = disableFeatures;
              }
            }
            if (
              themeData &&
              themeData.element !== this.themeName &&
              themeData.element != null
            ) {
              this.themeName = themeData.element;
            }
          });
        }),
      );
      this.__disposer.push(
        autorun((_reaction) => {
          const _mobx_val_0 = toJS(store.activeItem);
          Promise.resolve().then(() => {
            const activeItem = _mobx_val_0;
            if (!activeItem || !activeItem.id) {
              this.__activeItemId = null;
            } else if (activeItem.id !== this.__activeItemId) {
              this.__activeItemId = activeItem.id;
              if (this.__pageContentOwner !== activeItem.id) {
                this._clearStaleThemePresentation();
              }
            }
            // often, active item is in the process of being updated on a page save
            // this generates potential delay in presentation of the node, leading to the
            // a short time where activeItem is not accurate while manifest is being rebuilt
            if (
              activeItem &&
              activeItem.id &&
              this.__pageContent &&
              this.__pageContentOwner === activeItem.id
            ) {
              this._activeItemContentChanged(this.__pageContent, activeItem);
            }
            if (
              activeItem &&
              activeItem.location &&
              this.activeItemLocation !== activeItem.location
            ) {
              this.activeItemLocation = activeItem.location;
            }
          });
        }),
      );
    }, 0);
  }
  /**
   * Detached life cycle
   */
  disconnectedCallback() {
    if (this.__themePaletteReapplyTimer) {
      clearTimeout(this.__themePaletteReapplyTimer);
      this.__themePaletteReapplyTimer = null;
    }
    for (let i in this.__disposer) {
      const disposer = this.__disposer[i];
      if (typeof disposer === "function") {
        disposer();
      } else if (disposer && typeof disposer.dispose === "function") {
        disposer.dispose();
      }
    }
    this.__disposer = [];
    this.windowControllers.abort();
    super.disconnectedCallback();
  }
  storeReady(_e) {
    // append UI element to body to avoid stack order issues
    if (
      store.cmsSiteEditor &&
      store.cmsSiteEditor.instance &&
      globalThis.HaxStore.requestAvailability().activeHaxBody &&
      store.activeItemContent
    ) {
      globalThis.HaxStore.requestAvailability().activeHaxBody.importContent(
        store.activeItemContent,
      );
    }
  }
  /**
   * Tags that should never be wrapped in replace-tag. These are tags whose
   * definitions are effectively free by the time this runs (their
   * dependencies - lit, mobx, the haxcms store, DDD, simple-icon - are
   * already loaded as part of core site building) and/or that render no
   * visible content for anonymous users, so gating them behind
   * replace-tag's low-performance "click to load" UX only confuses users
   * with a placeholder for something that isn't actually visible.
   * See haxtheweb/issues#2989.
   */
  static get replaceTagExcludedTags() {
    return ["page-break"];
  }
  /**
   * Find custom element tags and replace with replace-tag for performance gains based on device context
   */
  replaceTagReplacement(html) {
    // all closing tags
    let myRegexp = /<(\w+?-\w*.*)\s*?>/gim;
    // execute 1st match
    let match = myRegexp.exec(html);
    while (match != null) {
      let tag = match[1].replace(/[<>]/g, "");
      if (tag.indexOf(" ")) {
        tag = tag.split(" ")[0];
      }
      // a tag name only holds name characters, never quotes or markup, and
      // it is written into an attribute below
      tag = tag.replace(/[^\w.-]/g, "");
      // replace the matching custom element tag name with replace-tag
      // unless it's in the exclusion list (see replaceTagExcludedTags)
      if (
        tag.indexOf("-") !== -1 &&
        !HAXCMSSiteBuilder.replaceTagExcludedTags.includes(tag)
      ) {
        // shift the replacement over to with; leave everything else the same
        html = html.replace("<" + tag, '<replace-tag with="' + tag + '" ');
        // ensure a matching closing tag is also updated
        html = html.replace("</" + tag + ">", "</replace-tag>");
      }
      // execute again, which processes the next tag
      match = myRegexp.exec(html);
    }
    return html;
  }
  /**
   * Resolves once the theme element is defined and has rendered once, so the
   * page content goes straight into its final layout. Capped so a theme that
   * fails to load never keeps the content away. The short delay keeps the
   * old "insert on the next task" timing when the theme is already there.
   * @param {HTMLElement} themeElement
   * @returns {Promise<void>}
   */
  _whenThemeReady(themeElement) {
    const nextTask = () => new Promise((resolve) => setTimeout(resolve, 5));
    if (!themeElement || !themeElement.localName) {
      return nextTask();
    }
    const tag = themeElement.localName;
    const cap = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const defined = globalThis.customElements.get(tag)
      ? Promise.resolve()
      : Promise.race([globalThis.customElements.whenDefined(tag), cap(5000)]);
    return defined
      .then(() => {
        const rendered = themeElement.updateComplete;
        if (rendered && typeof rendered.then === "function") {
          return Promise.race([rendered, cap(1000)]);
        }
      })
      .then(nextTask, nextTask);
  }
  /**
   * React to content being loaded from a page.
   */
  async _activeItemContentChanged(newValue, activeItem) {
    let htmlcontent = newValue;
    if (htmlcontent !== null && activeItem && activeItem.metadata) {
      // page-break + content (+ link-out hint), assembled in an inert
      // document so no element is constructed just to be serialized
      htmlcontent = buildPageContentHTML(htmlcontent, activeItem, {
        pageBreakHidden: store.platformAllows("pageBreak") === false,
        redirectHint: this.t.redirectHint,
      });

      // Previously, style-guide-driven defaults were applied here.
      // That behavior has been removed so page content renders as-is.

      htmlcontent = encapScript(htmlcontent);
      wipeSlot(store.themeElement, "*");
      store.activeItemContent = htmlcontent;
      // insert the content as quickly as possible, then work on the dynamic
      // imports. The theme must be defined (and rendered once) first: content
      // placed into a theme that is still loading is laid out in the fallback
      // box, then jumps into the theme's own layout, which is the largest
      // layout shift of a first load.
      const insertTheme = store.themeElement;
      // tells the theme's own fallback insert (HAXCMSThemeWiring) that this
      // content is on its way, so it doesn't put it in first: that copy skips
      // the replace-tag pass and the active-body-changed event
      if (insertTheme) {
        insertTheme.__haxcmsContentPending = true;
      }
      this._whenThemeReady(insertTheme).then(() => {
        if (insertTheme) {
          insertTheme.__haxcmsContentPending = false;
        }
        // the theme can be torn down (or swapped) before this deferred insert
        // runs; there is nothing to insert into then, and the rest of this
        // callback is about that theme's content, so stop here
        if (!store.themeElement || store.themeElement !== insertTheme) {
          return;
        }
        // a newer page took over while the theme was loading
        if (store.activeItemContent !== htmlcontent) {
          return;
        }
        if (store.themeElement.childNodes.length === 0) {
          let frag = document
            .createRange()
            .createContextualFragment(this.replaceTagReplacement(htmlcontent));
          // createContextualFragment scripts run once connected; encapScript
          // is a string pass, so also drop any script it let through
          neutralizeStrayScripts(frag);
          // security: strip inline event handlers, javascript: URLs, iframe
          // srcdoc, <base> and <meta> before this touches the live page. The
          // editor already runs this same pass on import, so authored content
          // (custom elements, data attributes, <template> in code-sample,
          // iframes with http(s) src) renders unchanged.
          sanitizeNodeTree(frag);
          store.themeElement.appendChild(frag);
          this.dispatchEvent(
            new CustomEvent("json-outline-schema-active-body-changed", {
              bubbles: true,
              composed: true,
              cancelable: false,
              detail: htmlcontent,
            }),
          );
        }
        this._setThemeBusyState(false);
        // if there are, dynamically import them but only if we don't have a global manager
        if (
          !globalThis.WCAutoload &&
          varExists(this.manifest, "metadata.node.dynamicElementLoader")
        ) {
          let tagsFound = findTagsInHTML(htmlcontent);
          const basePath =
            new URL("../../locales/haxcms.es.json", import.meta.url).href +
            "/../";
          for (let i in tagsFound) {
            const tagName = tagsFound[i];
            if (
              this.manifest.metadata.node.dynamicElementLoader[tagName] &&
              !globalThis.customElements.get(tagName)
            ) {
              // prettier-ignore
              import(
                `${basePath}../../../../${this.manifest.metadata.node.dynamicElementLoader[tagName]}`
              )
                .then((_response) => {
                  //console.warn(tagName + ' dynamic import');
                })
                .catch((error) => {
                  /* Error handling */
                  console.warn(error);
                });
            }
          }
        } else if (globalThis.WCAutoload) {
          // process() is fire-and-forget and takes the fast path once the
          // registry file is processed; call it directly instead of an
          // extra setTimeout(0) hop (manual process() contract unchanged).
          globalThis.WCAutoload.process();
        }
      });
    }
  }

  /**
   * got a message that we need to update our json manifest data
   */
  _triggerUpdatedData(_e) {
    // get fresh data if not published; milliseconds, so two updates in the
    // same second (a bulk delete's pages) each fetch the manifest again
    if (this.isLoggedIn) {
      this._timeStamp = Date.now();
    } else {
      this._timeStamp = "";
    }
  }

  /**
   * got a message that we need to update our page content
   */
  _triggerUpdatedNode(_e) {
    this.loadPageData();
  }
  /**
   * notice manifest changes and ensure slot is rebuilt.
   */
  _manifestChanged(newValue, _oldValue) {
    if (newValue && newValue.metadata && newValue.items) {
      store.loadManifest(newValue, this);
    }
  }
  /**
   * notice theme changes and ensure slot is rebuilt.
   */
  _themeChanged(newValue, _oldValue) {
    if (newValue) {
      this._applyThemePalette(store.themeElement, newValue);
      this._scheduleThemePaletteReapply(newValue);
      this.themeLoaded = false;
      let theme = newValue;
      // create the 'theme' as a new element
      // weird but definition already here so we should be able
      // to just use this without an import, it's possible..
      if (
        typeof this.__imported[theme.element] !== typeof undefined ||
        globalThis.customElements.get(theme.element)
      ) {
        // already registered (ex: a demo or page that imported the theme
        // itself), so there is nothing to import; reveal the slot
        this.__imported[theme.element] = theme.element;
        this.themeLoaded = true;
      } else {
        // global will handle this
        if (globalThis.WCAutoload) {
          this.__imported[theme.element] = theme.element;
          this.themeLoaded = true;
          setTimeout(() => {
            globalThis.WCAutoload.process();
          }, 5);
        } else {
          // import the reference to the item dynamically, if we can
          try {
            // prettier-ignore
            import(new URL("./../../../../../" + newValue.path, import.meta.url).href).then((_e) => {
              // add it into ourselves so it unpacks and we kick this off!
              this.__imported[theme.element] = theme.element;
              this.themeLoaded = true;
            }).catch((err) => {
              // the path did not resolve from here (ex: monorepo demos served
              // from the repo root). Rather than leaving the slot hidden
              // forever, reveal the theme once something else defines it.
              console.warn(`haxcms-site-builder: could not import theme ${theme.element} from ${newValue.path}`, err);
              globalThis.customElements.whenDefined(theme.element).then(() => {
                this.__imported[theme.element] = theme.element;
                this.themeLoaded = true;
              });
            });
          } catch {
            // error in the event this is a double registration
            // also strange to be able to reach this but technically possible
            this.themeLoaded = true;
          }
        }
      }
    }
  }
  /**
   * Idle-warm the HAX editor closure for logged-in users so entering edit
   * mode (or the system dashboard) is near-instant instead of a cold
   * multi-second import chain. Runs via requestIdleCallback after first
   * login, fetches the server-side wc-registry-graph.json (small, and only
   * for logged-in users -- never taxes anonymous visitors), BFSes the
   * transitive closure of the editor entry tags, and injects modulepreload
   * links for paths not already preloaded. No-ops gracefully when the graph
   * is absent (older CDN builds / older backends) or on any error.
   */
  _scheduleEditorWarmup() {
    // only for logged-in users; anonymous visitors never pay this cost
    if (!store.isLoggedIn) {
      return;
    }
    const run = () => {
      try {
        // This warmup only makes sense when wc-autoload / dynamic-import-
        // registry (the "magic script" tag autoloader) is actually driving
        // the editor's lazy load -- the tag graph (wc-registry-graph.json)
        // and basePath resolution it depends on are both products of that
        // mechanism. Sites/backends that don't load wc-autoload (e.g. a
        // bundler or import-map based setup that imports the editor
        // directly) have no equivalent path convention to warm against, so
        // guessing one (e.g. a hardcoded "./build/es6/node_modules/") would
        // just risk emitting bogus preloads/404s for those setups. No-op
        // when wc-autoload isn't present rather than fabricate a basePath.
        if (
          !globalThis.WCAutoload ||
          !globalThis.WCAutoload.requestAvailability
        ) {
          return;
        }
        const loader = globalThis.WCAutoload.requestAvailability();
        // basePath here already resolves to the full module base (e.g.
        // ".../build/es6/node_modules/"), matching what
        // DynamicImportRegistry.getPathToTag()/loadDefinition() prepend to
        // registry-relative paths. Do NOT re-append "build/es6/node_modules/"
        // when building hrefs below -- that previously produced doubled
        // "build/es6/node_modules/build/es6/node_modules/" 404s for
        // logged-in users.
        const basePath =
          (loader && loader.registry && loader.registry.basePath) ||
          globalThis.WCAutoloadBasePath ||
          globalThis.WCGlobalBasePath ||
          null;
        if (!basePath) {
          return;
        }
        // derive the graph URL from the registry file URL (site root) rather
        // than the module basePath, since wc-registry-graph.json lives next
        // to wc-registry.json, not inside build/es6/node_modules/
        // wc-autoload.js rewraps WCAutoloadRegistryFile into an array after
        // the initial string assignment in build.js, so coerce to a single
        // string here before deriving the graph URL; otherwise Array.indexOf
        // misses the substring (falling back to the wrong node_modules path)
        // and Array.replace would throw.
        let registryFile = globalThis.WCAutoloadRegistryFile || "";
        if (Array.isArray(registryFile)) {
          registryFile = registryFile.length ? registryFile[0] : "";
        }
        registryFile = String(registryFile);
        let graphUrl = "";
        if (registryFile && registryFile.indexOf("wc-registry.json") !== -1) {
          graphUrl = registryFile.replace(
            /wc-registry\.json$/,
            "wc-registry-graph.json",
          );
        } else {
          graphUrl = basePath + "wc-registry-graph.json";
        }
        fetch(graphUrl)
          .then((r) => r.json())
          .then((graph) => {
            if (!graph || !graph.paths || !graph.adj || !graph.tags) {
              return;
            }
            const editorTags = [
              "hax-body",
              "hax-tray",
              "hax-store",
              "haxcms-site-editor-ui",
            ];
            const seen = new Set();
            const queue = [];
            for (let i = 0; i < editorTags.length; i++) {
              const idx = graph.tags[editorTags[i]];
              if (idx !== undefined && !seen.has(idx)) {
                seen.add(idx);
                queue.push(idx);
              }
            }
            // BFS the closure, capped so we don't over-preload
            const cap = 40;
            const ordered = [];
            while (queue.length && ordered.length < cap) {
              const idx = queue.shift();
              ordered.push(idx);
              const imports = graph.adj[String(idx)];
              if (Array.isArray(imports)) {
                for (let j = 0; j < imports.length; j++) {
                  const impIdx = imports[j];
                  if (!seen.has(impIdx)) {
                    seen.add(impIdx);
                    queue.push(impIdx);
                  }
                }
              }
            }
            const head = globalThis.document.head;
            if (!head) {
              return;
            }
            const existing = new Set();
            head.querySelectorAll('link[rel="modulepreload"]').forEach((l) => {
              const href = l.getAttribute("href");
              if (href) {
                existing.add(href);
              }
            });
            for (let i = 0; i < ordered.length; i++) {
              const p = graph.paths[ordered[i]];
              if (!p) {
                continue;
              }
              const href = basePath + p;
              if (existing.has(href)) {
                continue;
              }
              const link = globalThis.document.createElement("link");
              link.rel = "modulepreload";
              link.href = href;
              link.setAttribute("crossorigin", "anonymous");
              link.setAttribute("data-hax-editor-warmup", "");
              head.appendChild(link);
            }
          })
          .catch(() => {
            /* graph absent on older builds -- no-op */
          });
      } catch {
        /* never let warmup break rendering */
      }
    };
    whenIdle(run, { timeout: 3000 });
  }

  /**
   * Style guide integration for HAX - adds template selector when templates are available
   * This is called by HaxStore's designSystemHAXProperties method
   */
  async addStyleGuideTemplateSelector(props, tag) {
    try {
      // Get available templates for this tag
      const templates = await this.getStyleGuideTemplates(tag);

      // If templates exist, add a template selector to the configure section
      if (templates && templates.length > 0) {
        // Create template selector field
        const templateField = {
          attribute: "data-haxsg-id",
          title: this.t.styleGuideTemplate,
          description: this.t.styleGuideTemplateDescription,
          inputMethod: "select",
          icon: "icons:style",
          options: {
            "": this.t.styleGuideTemplateCustom,
          },
        };

        // Add template options
        for (const template of templates) {
          templateField.options[template.value] = template.text;
        }

        // Ensure configure array exists
        if (!props.settings) {
          props.settings = {};
        }
        if (!props.settings.configure) {
          props.settings.configure = [];
        }

        // Add template field to the beginning of configure section
        props.settings.configure.unshift(templateField);
      }
    } catch (error) {
      console.warn("Failed to add template selector to HAX properties:", error);
    }

    return props;
  }
}
// this global allows a backdoor into activating the HAXcms editor UI
// this is only going to be visually enabled but it won't actually
// be able to talk to the backend correctly bc the JWT won't exist
// the endpoints are also fictional. also useful for testing purposes
globalThis.HAXme = function (context = null) {
  if (context == null) {
    // fake a demo
    context = "demo";
    // fake endpoints
    globalThis.appSettings = {
      login: "dist/dev/login.json",
      logout: "dist/dev/logout.json",
      getSiteFieldsPath: "dist/dev/getSiteFieldsPath.json",
      getFormToken: "adskjadshjudfu823u823u8fu8fij",
      appStore: {
        url: "dist/dev/appstore.json",
      },
      jwt: "made-up-thing",
      // add your custom theme here if testing locally and wanting to emulate the theme selector
      // this isn't really nessecary though
      themes: {
        "haxcms-dev-theme": {
          element: "haxcms-dev-theme",
          path: "@haxtheweb/haxcms-elements/lib/haxcms-dev-theme.js",
          name: "Developer theme",
        },
      },
    };
  }
  if (context == "demo") {
    globalThis.HAXCMSContext = "demo";
  }
  // apply context
  if (globalThis.document.body) {
    globalThis.document.body.querySelector(
      "haxcms-editor-builder",
    ).__appliedContext = false;
    globalThis.document.body
      .querySelector("haxcms-editor-builder")
      .applyContext(context);
  }
};

globalThis.customElements.define(HAXCMSSiteBuilder.tag, HAXCMSSiteBuilder);
export { HAXCMSSiteBuilder };

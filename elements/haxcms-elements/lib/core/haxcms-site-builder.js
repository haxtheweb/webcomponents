import { LitElement, html, css } from "lit";
import {
  encapScript,
  findTagsInHTML,
  wipeSlot,
  varExists,
  localStorageSet,
  localStorageGet,
  nodeToHaxElement,
  haxElementToNode,
  sanitizeURLValue,
} from "@haxtheweb/utils/utils.js";
import { autorun, toJS } from "mobx";
import { store, HAXcmsStore } from "./haxcms-site-store.js";
import "./haxcms-site-router.js";
import "@haxtheweb/simple-progress/simple-progress.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
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
        :host([is-logged-in]) {
          max-height: calc(100vh - 56px);
        }
        :host #slot {
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.2s ease-in-out;
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
      <site-ai-chat></site-ai-chat>
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
  _updateLoading(e) {
    this.loading = e.detail.value;
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
      let tmp = globalThis.document.createElement("div");
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
      let frag = globalThis.document.createDocumentFragment();
      let p = globalThis.document.createElement("p");
      p.innerHTML = `<strong>${store.getInternalRoute()}</strong> ${
        this.t.couldNotBeLocated
      }. ${this.t.hereAreSomePossibleRemedies}
      <ul>
        <li><a href="x/displays/search?search=${store.getInternalRoute()}">${
          this.t.useSearchToLocateTheContentYouAreLookingFor
        }</a></li>
        <li><a href="./">${this.t.goToTheHomePage}</a></li>
        <li>${this.t.navigateToAnotherPageInTheMenu}</li>
      </ul>`;
      frag.appendChild(p);
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
    if (this._timeStamp) {
      if (url.indexOf("?") != -1) {
        url += `&${this._timeStamp}`;
      } else {
        url += `?${this._timeStamp}`;
      }
    }
    if (requestedLocation === "hax-internal-route.html") {
      this.renderInternalRoute();
      this.loading = false;
      this._runPendingPageLoad(requestedLocation, requestedItemId);
    } else {
      await fetch(url)
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
      } catch (e) {
        // weird looking but this is the typical use-case in which
        // we got a file path and try to load it because the above silently failed
        if (this._timeStamp && this._timeStamp != "") {
          if (url.indexOf("?") != -1) {
            url += `&${this._timeStamp}`;
          } else {
            url += `?${this._timeStamp}`;
          }
        }
        var headers = { cache: "no-cache" };
        await fetch(url, headers)
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
          })
          .then((data) => {
            this._updateManifest(data);
            this.loading = false;
          })
          .catch((err) => {
            this.lastErrorChanged(err);
          });
      }
    }
  }
  /**
   * life cycle updated
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
    this._timeStamp = Math.floor(Date.now() / 1000);
    this.disableFeatures = "";
    this.isLoggedIn = false;
    this.__disposer = [];
    this.queryParams = {};
    this.loading = false;
    this.__imported = {};
    this.themeLoaded = false;
    this.__themePaletteReapplyTimer = null;
    this.__themePaletteReapplyStamp = 0;
    this.outlineLocation = "";
    this.activeItemLocation = "";
    HAXcmsStore.storePieces.siteBuilder = this;
    // support initial setup stuff with slots
    for (var i in this.children) {
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
    globalThis.addEventListener("hax-store-ready", this.storeReady.bind(this), {
      signal: this.windowControllers.signal,
    });

    globalThis.addEventListener(
      "haxcms-trigger-update",
      this._triggerUpdatedData.bind(this),
      { signal: this.windowControllers.signal },
    );

    globalThis.addEventListener(
      "haxcms-trigger-update-node",
      this._triggerUpdatedNode.bind(this),
      { signal: this.windowControllers.signal },
    );
    // in-case we miss the initial state as opposed to a change event
    if (globalThis.matchMedia("(prefers-color-scheme: dark)").matches) {
      store.darkMode = true;
    }
    // change is if platform / browser preference changes while using
    globalThis
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", darkToggle, {
        signal: this.windowControllers.signal,
      });

    autorun(() => {
      const _mobx_val_0 = toJS(store.darkMode);
      const _mobx_val_1 = toJS(store.darkMode);
      Promise.resolve().then(() => {
        localStorageSet("app-hax-darkMode", _mobx_val_0);
        if (_mobx_val_1) {
          globalThis.document.body.classList.add("dark-mode");
        } else {
          globalThis.document.body.classList.remove("dark-mode");
        }
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
    // dyanmcially import the editor builder which figures out if we should have one
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/core/haxcms-editor-builder.js"
    )
      .then((response) => {
        import("./haxcms-toast.js");

        this.editorBuilder = globalThis.document.createElement("haxcms-editor-builder");
        // attach editor builder after we've appended to the screen
        if (this.parentNode) {
          this.parentNode.insertBefore(this.editorBuilder, this);
        }
        else {
          globalThis.document.body.appendChild(this.editorBuilder);
        }
        // get fresh data if not published / demo which is a form of published
        if (
          HAXcmsStore.getApplicationContext() !==
          "published"
        ) {
          this._timeStamp = Math.floor(Date.now() / 1000);
        } else {
          this._timeStamp = "";
        }
      })
      .catch((error) => {
        /* Error handling */
        console.warn(error);
      });
    globalThis.dispatchEvent(new Event("resize"));
    setTimeout(() => {
      this.__disposer.push(
        autorun((reaction) => {
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
        autorun((reaction) => {
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
    for (var i in this.__disposer) {
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
  storeReady(e) {
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
   * Find custom element tags and replace with replace-tag for performance gains based on device context
   */
  replaceTagReplacement(html) {
    // all closing tags
    var myRegexp = /\<(\w+?\-\w*.*)\s*?\>/gim;
    // execute 1st match
    var match = myRegexp.exec(html);
    while (match != null) {
      let tag = match[1].replace("<", "").replace(">", "");
      if (tag.indexOf(" ")) {
        tag = tag.split(" ")[0];
      }
      // replace the matching custom element tag name with replace-tag
      if (tag.indexOf("-") != -1) {
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
   * React to content being loaded from a page.
   */
  async _activeItemContentChanged(newValue, activeItem) {
    var htmlcontent = newValue;
    if (htmlcontent !== null && activeItem && activeItem.metadata) {
      // Check if page-break should be hidden by platform configuration
      const pageBreakHidden = store.platformAllows("pageBreak") === false;
      const setAttrIfValue = (el, name, value) => {
        if (
          typeof value !== typeof undefined &&
          value !== null &&
          String(value) !== ""
        ) {
          el.setAttribute(name, String(value));
        }
      };
      // force a page break w/ the relevant details in code
      // this allows the UI to be modified
      // required fields followed by optional fields if defined
      const wrapper = globalThis.document.createElement("div");
      const pageBreak = globalThis.document.createElement("page-break");
      pageBreak.setAttribute("break-type", "site");
      setAttrIfValue(pageBreak, "title", activeItem.title);
      setAttrIfValue(pageBreak, "parent", activeItem.parent);
      setAttrIfValue(pageBreak, "item-id", activeItem.id);
      setAttrIfValue(pageBreak, "slug", activeItem.slug);
      setAttrIfValue(pageBreak, "description", activeItem.description);
      setAttrIfValue(pageBreak, "order", activeItem.order);
      setAttrIfValue(pageBreak, "page-type", activeItem.metadata.pageType);
      setAttrIfValue(pageBreak, "tags", activeItem.metadata.tags);
      setAttrIfValue(
        pageBreak,
        "related-items",
        activeItem.metadata.relatedItems,
      );
      setAttrIfValue(pageBreak, "image", activeItem.metadata.image);
      setAttrIfValue(pageBreak, "icon", activeItem.metadata.icon);
      setAttrIfValue(
        pageBreak,
        "accent-color",
        activeItem.metadata.accentColor,
      );
      if (activeItem.metadata.theme && activeItem.metadata.theme.key) {
        pageBreak.setAttribute(
          "developer-theme",
          activeItem.metadata.theme.key,
        );
      }
      const safeLinkUrl = sanitizeURLValue(activeItem.metadata.linkUrl, "");
      setAttrIfValue(pageBreak, "link-url", safeLinkUrl);
      setAttrIfValue(pageBreak, "link-target", activeItem.metadata.linkTarget);
      if (activeItem.metadata.hideInMenu) {
        pageBreak.setAttribute("hide-in-menu", "hide-in-menu");
      }
      if (activeItem.metadata.locked) {
        pageBreak.setAttribute("locked", "locked");
      }
      if (pageBreakHidden) {
        pageBreak.setAttribute("platform-hidden", "platform-hidden");
      }
      if (activeItem.metadata.published !== false) {
        pageBreak.setAttribute("published", "published");
      }
      wrapper.appendChild(pageBreak);
      const contentFragment = globalThis.document
        .createRange()
        .createContextualFragment(htmlcontent);
      wrapper.appendChild(contentFragment);

      // If this page has a link URL configured and the user is not logged in,
      // append simple redirect messaging for a better user experience
      if (safeLinkUrl) {
        const linkTargetCandidates = ["_self", "_blank", "_parent", "_top"];
        const linkTarget = linkTargetCandidates.includes(
          activeItem.metadata.linkTarget,
        )
          ? activeItem.metadata.linkTarget
          : "_self";
        const linkParagraph = globalThis.document.createElement("p");
        const link = globalThis.document.createElement("a");
        link.setAttribute("href", String(safeLinkUrl));
        link.setAttribute("target", String(linkTarget));
        link.setAttribute("rel", "noopener noreferrer");
        link.textContent = String(safeLinkUrl);
        linkParagraph.appendChild(link);
        const hintParagraph = globalThis.document.createElement("p");
        const hint = globalThis.document.createElement("small");
        hint.textContent =
          "If the redirect doesn't work, please click the link above.";
        hintParagraph.appendChild(hint);
        wrapper.appendChild(linkParagraph);
        wrapper.appendChild(hintParagraph);
      }
      htmlcontent = wrapper.innerHTML;

      // Previously, style-guide-driven defaults were applied here.
      // That behavior has been removed so page content renders as-is.

      htmlcontent = encapScript(htmlcontent);
      wipeSlot(store.themeElement, "*");
      store.activeItemContent = htmlcontent;
      // insert the content as quickly as possible, then work on the dynamic imports
      setTimeout(() => {
        if (store.themeElement.childNodes.length === 0) {
          let frag = document
            .createRange()
            .createContextualFragment(this.replaceTagReplacement(htmlcontent));
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
          for (var i in tagsFound) {
            const tagName = tagsFound[i];
            if (
              this.manifest.metadata.node.dynamicElementLoader[tagName] &&
              !globalThis.customElements.get(tagName)
            ) {
              // prettier-ignore
              import(
                `${basePath}../../../../${this.manifest.metadata.node.dynamicElementLoader[tagName]}`
              )
                .then((response) => {
                  //console.warn(tagName + ' dynamic import');
                })
                .catch((error) => {
                  /* Error handling */
                  console.warn(error);
                });
            }
          }
        } else if (globalThis.WCAutoload) {
          setTimeout(() => {
            globalThis.WCAutoload.process();
          }, 0);
        }
      }, 5);
    }
  }

  /**
   * got a message that we need to update our json manifest data
   */
  _triggerUpdatedData(e) {
    // get fresh data if not published
    if (this.isLoggedIn) {
      this._timeStamp = Math.floor(Date.now() / 1000);
    } else {
      this._timeStamp = "";
    }
  }

  /**
   * got a message that we need to update our page content
   */
  _triggerUpdatedNode(e) {
    this.loadPageData();
  }
  /**
   * notice manifest changes and ensure slot is rebuilt.
   */
  _manifestChanged(newValue, oldValue) {
    if (newValue && newValue.metadata && newValue.items) {
      store.loadManifest(newValue, this);
    }
  }
  /**
   * notice theme changes and ensure slot is rebuilt.
   */
  _themeChanged(newValue, oldValue) {
    if (newValue) {
      this._applyThemePalette(store.themeElement, newValue);
      this._scheduleThemePaletteReapply(newValue);
      this.themeLoaded = false;
      let theme = newValue;
      // create the 'theme' as a new element
      // weird but definition already here so we should be able
      // to just use this without an import, it's possible..
      if (typeof this.__imported[theme.element] !== typeof undefined) {
        this.themeLoaded = true;
      } else {
        // global will handle this
        if (globalThis.WCAutoload) {
          this.__imported[theme.element] = theme.element;
          this.themeLoaded = true;
          setTimeout(() => {
            globalThis.WCAutoload.process();
            globalThis.dispatchEvent(
              new CustomEvent("haxcms-theme-ready", {
                bubbles: true,
                composed: true,
                cancelable: false,
                detail: this,
              }),
            );
          }, 5);
        } else {
          // import the reference to the item dynamically, if we can
          try {
            // prettier-ignore
            import(new URL("./../../../../../" + newValue.path, import.meta.url).href).then((e) => {
              // add it into ourselves so it unpacks and we kick this off!
              this.__imported[theme.element] = theme.element;
              this.themeLoaded = true;
            });
          } catch (err) {
            // error in the event this is a double registration
            // also strange to be able to reach this but technically possible
            this.themeLoaded = true;
          }
        }
      }
    }
  }

  /**
   * Style guide integration for HAX - adds template selector when templates are available
   * This should be called by HaxStore's designSystemHAXProperties method
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
          title: "Template",
          description: "Choose a predefined style template for this element",
          inputMethod: "select",
          icon: "icons:style",
          options: {
            "": "Custom",
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

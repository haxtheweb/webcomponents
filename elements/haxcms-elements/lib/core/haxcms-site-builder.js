import { LitElement, html, css } from "lit";
import {
  encapScript,
  findTagsInHTML,
  wipeSlot,
  varExists,
  localStorageSet,
  nodeToHaxElement,
  haxElementToNode,
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
          opacity: 0.2;
          visibility: hidden;
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
  async getStyleGuideTemplates(tagName) {
    try {
      // Load style guide content from the store
      const styleGuideContent = await store.loadStyleGuideContent();
      if (!styleGuideContent) {
        return [];
      }
      
      // Convert style guide content to HAXSchema elements
      const styleGuideElements = await this.htmlToHaxElements(styleGuideContent);
      
      const templates = [];
      
      for (const styleElement of styleGuideElements) {
        // Look for page-template elements
        if (styleElement && styleElement.tag === 'page-template') {
          // Get the actual content element inside the page-template
          if (styleElement.content) {
            const templateContentElement = await this.htmlToHaxElements(styleElement.content);
            if (templateContentElement && templateContentElement.length > 0 && 
                templateContentElement[0].tag === tagName) {
              // Extract template information
              const templateId = styleElement.properties && styleElement.properties.id;
              const templateName = styleElement.properties && styleElement.properties.name;
              
              if (templateId && templateName) {
                templates.push({
                  value: templateId,
                  text: templateName
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
   * Apply style guide schema merging to HAX elements
   * Loads style guide content and merges properties into content elements
   */
  async applyStyleGuide(haxElements) {
    try {
      // 1. Load style guide content from the store
      const styleGuideContent = await store.loadStyleGuideContent();
      if (!styleGuideContent) {
        return haxElements;
      }
      
      // 2. Convert style guide content to HAXSchema elements
      const styleGuideElements = await this.htmlToHaxElements(styleGuideContent);
      
      // 3. Create a mapping of tag names to design attributes from page-template elements
      const styleGuideMap = new Map();
      
      // Define which attributes are design-based and should be applied
      // This includes all DDD data attributes and SimpleColors accent-color
      const designAttributes = new Set([
        // DDD primary design attributes
        'data-primary', 'data-accent',
        // DDD font attributes
        'data-font-family', 'data-font-weight', 'data-font-size',
        // DDD spacing attributes  
        'data-padding', 'data-margin', 'data-text-align', 'data-float-position',
        // DDD design treatment attributes
        'data-design-treatment', 'data-instructional-action',
        // DDD border attributes
        'data-border', 'data-border-radius',
        // DDD shadow attributes
        'data-box-shadow',
        // DDD width attributes
        'data-width',
        // SimpleColors accent-color (historical)
        'accent-color'
      ]);
      
      for (const styleElement of styleGuideElements) {
        // Look for page-template elements
        if (styleElement && styleElement.tag === 'page-template') {
          // Check if this template should be used as default
          const enforceStyles = styleElement.properties && 
                              styleElement.properties['enforce-styles'];
          if (enforceStyles && styleElement.content) {
            // Get the actual content element inside the page-template
            const templateContentElement = await this.htmlToHaxElements(styleElement.content);
            if (templateContentElement && templateContentElement.length > 0 && templateContentElement[0].tag) {
              const tagName = templateContentElement[0].tag;
              // Extract only design-related properties
              const designProperties = {};
              if (templateContentElement[0].properties) {
                for (const [key, value] of Object.entries(templateContentElement[0].properties)) {
                  if (designAttributes.has(key)) {
                    designProperties[key] = value;
                  }
                }
              }
              
              // Only store if we have design properties to apply
              if (Object.keys(designProperties).length > 0) {
                styleGuideMap.set(tagName, {
                  properties: designProperties
                });
              }
            }
          }
        }
      }      
      // 4. Apply style guide properties to matching content elements
      const processedElements = haxElements.map(element => {
        if (element && element.tag && styleGuideMap.has(element.tag)) {
          const styleGuide = styleGuideMap.get(element.tag);
          
          // Only apply design attributes that are not already set on the element
          // This preserves existing content properties and functional attributes
          const currentProperties = element.properties || {};
          const enhancedProperties = { ...currentProperties };
          
          // Add design attributes from style guide only if not already present
          for (const [key, value] of Object.entries(styleGuide.properties)) {
            if (!(key in currentProperties)) {
              enhancedProperties[key] = value;
            }
          }
          
          return {
            ...element,
            properties: enhancedProperties
          };
        }
        
        return element;
      });
      
      return processedElements;
      
    } catch (error) {
      console.warn("Style guide processing failed, returning original elements:", error);
      return haxElements;
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
  _updateActiveItemContent(data) {
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
      this._activeItemContentChanged(
        this.__pageContent,
        toJS(store.activeItem),
      );
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
        <li><a href="x/search?search=${store.getInternalRoute()}">${
          this.t.useSearchToLocateTheContentYouAreLookingFor
        }</a></li>
        <li><a href="./">${this.t.goToTheHomePage}</a></li>
        <li>${this.t.navigateToAnotherPageInTheMenu}</li>
      </ul>`;
      frag.appendChild(p);
      wipeSlot(store.themeElement, "*");
      store.themeElement.appendChild(frag);
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
          },
        );
      }
    }
  }
  /**
   * Load Page data
   */
  async loadPageData() {
    // file required or we have nothing; other two mixed in for pathing
    if (this.activeItemLocation && !this.loading) {
      this.loading = true;
      let url = `${this.outlineLocation}${this.activeItemLocation}`;
      if (this._timeStamp) {
        if (url.indexOf("?") != -1) {
          url += `&${this._timeStamp}`;
        } else {
          url += `?${this._timeStamp}`;
        }
      }
      if (this.activeItemLocation === "hax-internal-route.html") {
        this.renderInternalRoute();
        this.loading = false;
      } else {
        await fetch(url)
          .then((response) => {
            if (response.ok) {
              return response.text();
            } else {
              this.display404Error();
            }
          })
          .then((data) => {
            this._updateActiveItemContent(data);
            this.loading = false;
          })
          .catch((err) => {
            this.lastErrorChanged(err);
          });
      }
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
  _themeNameChanged(newValue) {
    if (newValue) {
      // drop old theme element if there is one
      if (store.themeElement) {
        store.themeElement.remove();
      }
      // wipe out what we got
      wipeSlot(this, "*");
      store.themeElement = globalThis.document.createElement(newValue);
      // apply a class so that we can write generic CSS selectors in integrations
      store.themeElement.classList.add("haxcms-theme-element");
      this.appendChild(store.themeElement);
    }
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
      locales: ["es"],
    });
    this._timeStamp = Math.floor(Date.now() / 1000);
    this.disableFeatures = "";
    this.isLoggedIn = false;
    this.__disposer = [];
    this.queryParams = {};
    this.loading = false;
    this.__imported = {};
    this.themeLoaded = false;
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
      localStorageSet("app-hax-darkMode", toJS(store.darkMode));
      if (toJS(store.darkMode)) {
        globalThis.document.body.classList.add("dark-mode");
      } else {
        globalThis.document.body.classList.remove("dark-mode");
      }
    });
    autorun(() => {
      this.isLoggedIn = toJS(store.isLoggedIn);
      const tstamp = Math.floor(Date.now() / 1000);
      if (this.isLoggedIn && !this.loggedInTime) {
        this.loggedInTime = tstamp;
        this._timeStamp = this.loggedInTime;
      }
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
      autorun((reaction) => {
        this.themeData = toJS(store.themeData);
        if (this.themeData) {
          // special support for "format" in the URL dictating the possible output format
          // this is for a11y, mobile, print and other possible output modes
          const urlParams = new URLSearchParams(globalThis.location.search);
          const format = urlParams.get("format");
          if (format != null) {
            switch (format) {
              case "print-page":
                this.themeData.element = "haxcms-print-theme";
                break;
            }
          }
          const disableFeatures = urlParams.get("disable-features");
          if (disableFeatures != null) {
            this.disableFeatures = disableFeatures;
          }
        }
        if (this.themeData && this.themeData.element !== this.themeName) {
          this.themeName = this.themeData.element;
        }
        this.__disposer.push(reaction);
      });
      autorun((reaction) => {
        const activeItem = toJS(store.activeItem);
        // often, active item is in the process of being updated on a page save
        // this generates potential delay in presentation of the node, leading to the
        // a short time where activeItem is not accurate while manifest is being rebuilt
        if (activeItem && this.__pageContent) {
          this._activeItemContentChanged(this.__pageContent, activeItem);
        }
        if (activeItem && activeItem.location) {
          this.activeItemLocation = activeItem.location;
          this.loadPageData();
        }
        this.__disposer.push(reaction);
      });
    }, 0);
  }
  /**
   * Detached life cycle
   */
  disconnectedCallback() {
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
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
      // force a page break w/ the relevant details in code
      // this allows the UI to be modified
      // required fields followed by optional fields if defined
      htmlcontent = `<page-break
      break-type="site"
      title="${activeItem.title}"
      parent="${activeItem.parent}"
      item-id="${activeItem.id}"
      slug="${activeItem.slug}"
      description="${activeItem.description}"
      order="${activeItem.order}"
      ${activeItem.metadata.pageType ? `page-type="${activeItem.metadata.pageType}"` : ``}
      ${activeItem.metadata.tags ? `tags="${activeItem.metadata.tags}"` : ``}
      ${activeItem.metadata.hideInMenu ? `hide-in-menu="hide-in-menu"` : ``}
      ${activeItem.metadata.relatedItems ? `related-items="${activeItem.metadata.relatedItems}"` : ``}
      ${activeItem.metadata.image ? `image="${activeItem.metadata.image}"` : ``}
      ${activeItem.metadata.icon ? `icon="${activeItem.metadata.icon}"` : ``}
      ${activeItem.metadata.accentColor ? `accent-color="${activeItem.metadata.accentColor}"` : ``}
      ${activeItem.metadata.theme && activeItem.metadata.theme.key ? `developer-theme="${activeItem.metadata.theme.key}"` : ``}
      ${activeItem.metadata.locked ? 'locked="locked"' : ""}
      ${activeItem.metadata.published === false ? "" : 'published="published"'} ></page-break>${htmlcontent}`;
      
      // Convert HTML to HAXSchema for processing
      try {        
        // Convert the content to HAXSchema elements
        const contentHaxElements = await this.htmlToHaxElements(htmlcontent);
        // Apply style guide merging - placeholder for future implementation
        const processedHaxElements = await this.applyStyleGuide(contentHaxElements);
        // Convert back to HTML
        let processedHtml = "";
        for (let element of processedHaxElements) {
          const elementNode = haxElementToNode(element);
          processedHtml += elementNode.outerHTML;
        }
        htmlcontent = processedHtml;
      } catch (error) {
        console.warn("HAXSchema processing failed, using original content:", error);
        // Continue with original htmlcontent if processing fails
      }
      
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
            "": "Custom"
          }
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
      saveNodePath: "dist/dev/saveNode.json",
      saveManifestPath: "dist/dev/saveManifestPath.json",
      createNodePath: "dist/dev/saveNode.json",
      deleteNodePath: "dist/dev/saveNode.json",
      saveOutlinePath: "dist/dev/saveNode.json",
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

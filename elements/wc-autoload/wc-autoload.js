/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 */
import "@haxtheweb/dynamic-import-registry/dynamic-import-registry.js";
// register globally so we can make sure there is only one
globalThis.WCAutoload = globalThis.WCAutoload || {};
globalThis.WCAutoloadRegistry = globalThis.WCAutoloadRegistry || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal
globalThis.WCAutoload.requestAvailability = () => {
  if (!globalThis.WCAutoload.instance) {
    globalThis.WCAutoload.instance =
      globalThis.document.createElement("wc-autoload");
    globalThis.document.body.appendChild(globalThis.WCAutoload.instance);
  }
  return globalThis.WCAutoload.instance;
};

/**
 * wrapper on fetch that allows for retrying
 */
const fetch_retry = async (url, options, n) => {
  for (let i = 0; i < n; i++) {
    try {
      return await fetch(url, options);
    } catch (err) {
      const isLastAttempt = i + 1 === n;
      if (isLastAttempt) throw err;
    }
  }
};

/**
 * process the loading event in case we need to ensure timing is
 * better handled downstream.
 */
globalThis.WCAutoload.process = (e) => {
  return new Promise((resolve, reject) => {
    // find the loader
    var loader = globalThis.WCAutoload.requestAvailability();
    loader.loaded = true;
    var list = {};
    // microtask timing to ensure window settings are accepted
    if (globalThis.WCAutoloadRegistryFileProcessed) {
      // mutation observer will pick up changes after initial load
      // but this gets us at load time with fallback support for legacy
      let target = document;
      if (loader.target) {
        target = loader.target;
        loader.processNewElement(target);
      }
      // hack to convert children into array
      target.querySelectorAll("*").forEach((el) => {
        if (el.tagName && !list[el.tagName]) {
          loader.processNewElement(el);
          list[el.tagName] = el.tagName;
        }
      });
      resolve("autoloader already processed");
    } else {
      setTimeout(async () => {
        // set the basePath if it exists
        if (globalThis.WCAutoloadBasePath) {
          loader.registry.basePath = globalThis.WCAutoloadBasePath;
        } else if (globalThis.WCGlobalBasePath) {
          loader.registry.basePath = globalThis.WCGlobalBasePath;
        }
        if (
          globalThis.WCAutoloadRegistryFile &&
          !globalThis.WCAutoloadRegistryFileProcessed
        ) {
          // support single string or multiple registries
          if (typeof globalThis.WCAutoloadRegistryFile === "string") {
            globalThis.WCAutoloadRegistryFile = [
              globalThis.WCAutoloadRegistryFile,
            ];
          }
          for (var i = 0; i < globalThis.WCAutoloadRegistryFile.length; i++) {
            await fetch_retry(
              globalThis.WCAutoloadRegistryFile[i],
              { priority: "high" },
              3,
            )
              .then(function (response) {
                return response.json();
              })
              .then(function (data) {
                globalThis.WCAutoloadRegistryFileProcessed = true;
                globalThis.WCAutoloadRegistry = {
                  ...globalThis.WCAutoloadRegistry,
                  ...data,
                };
              });
          }
        }
        // build out the registry via events translated from object
        if (globalThis.WCAutoloadRegistry) {
          for (var i in globalThis.WCAutoloadRegistry) {
            loader.registry.register({
              tag: i,
              path: globalThis.WCAutoloadRegistry[i],
            });
          }
        }
        let target = document;
        if (loader.target) {
          target = loader.target;
          loader.processNewElement(target);
        }
        // mutation observer will pick up changes after initial load
        // but this gets us at load time with fallback support for legacy
        target.querySelectorAll("*").forEach((el) => {
          if (el.tagName && !list[el.tagName]) {
            loader.processNewElement(el);
            list[el.tagName] = el.tagName;
          }
        });
        resolve("autoloader processed on the fly");
      }, 0);
    }
  });
};
// forces self appending which kicks all this off but AFTER dom is loaded
// function based allows for fallbacks due to timing on legacy browsers
globalThis.addEventListener("load", globalThis.WCAutoload.process);

// edge case; definition to load comes in AFTER we have loaded the page
// and MutationObserver doesn't pick up the tag being there
// this could be the result of a slow page load for example
// in these cases; see the event of the item being in the registry
globalThis.WCAutoload.postLoaded = (e) => {
  setTimeout(() => {
    let loader = globalThis.WCAutoload.requestAvailability();
    if (
      loader.loaded &&
      globalThis.document.querySelectorAll(e.detail.tag).length > 0
    ) {
      loader.registry.loadDefinition(e.detail.tag);
    }
  }, 0);
};
// listen for new tags being registered
globalThis.addEventListener(
  "dynamic-import-registry--new-registration",
  globalThis.WCAutoload.postLoaded,
);
/**
 * `wc-registry`
 * `optionally build the registry from the innerHTML of an element`
 *
 * @demo demo/index.html Baseline example
 * @demo demo/elmsln.html ELMS:LN integration
 * @demo demo/cantvas.html Cantvas integration example (token)
 * @demo demo/multiple-registries.html Multiple registries
 * @element wc-registry
 */
class WcRegistry extends HTMLElement {
  /**
   * This is a convention, not the standard
   */
  static get tag() {
    return "wc-registry";
  }
  constructor() {
    super();
    this.loader = globalThis.WCAutoload.requestAvailability();
  }
  connectedCallback() {
    setTimeout(() => {
      if (this.children.length > 0 && this.children[0].tagName == "TEMPLATE") {
        // we don't trust no JS blobs :p
        try {
          let jsonList = JSON.parse(this.children[0].content.textContent);
          // register these items on the fly
          for (var i in jsonList) {
            this.loader.registry.register({
              tag: i,
              path: jsonList[i],
            });
          }
        } catch (e) {
          console.warn(e);
        }
      }
    }, 0);
  }
}
customElements.define(WcRegistry.tag, WcRegistry);
/**
 * `wc-autoload`
 * `automatically load new tags in the dom`
 * @demo demo/index.html
 * @element wc-autoload
 */
class WcAutoload extends HTMLElement {
  /**
   * This is a convention, not the standard
   */
  static get tag() {
    return "wc-autoload";
  }
  constructor() {
    super();
    this.loaded = false;
    this.registry = globalThis.DynamicImportRegistry.requestAvailability();
    this.options = {
      childList: true,
      subtree: true,
    };
  }
  connectedCallback() {
    // listen for changes and then process any new node that has a tag name
    this._mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          this.processNewElement(node);
        });
      });
    });
    // support window target
    if (globalThis.WCAutoloadOptions) {
      this.options = globalThis.WCAutoloadOptions;
    }
    setTimeout(() => {
      // support window target
      if (globalThis.WCAutoloadTarget) {
        this.target = globalThis.WCAutoloadTarget;
      } else {
        this.target = globalThis.document.body;
      }
      // listen on the body and deep children as well
      this._mutationObserver.observe(this.target, this.options);
    }, 0);
  }
  disconnectedCallback() {
    this._mutationObserver.disconnect();
  }
  /**
   * Process new elements
   */
  processNewElement(node) {
    // skip checks for self
    if (
      node.tagName &&
      node.tagName.includes("-") &&
      node.tagName != "DYNAMIC-IMPORT-REGISTRY" &&
      node.tagName != "WC-REGISTRY" &&
      node.tagName != "WC-AUTOLOAD"
    ) {
      this.registry.loadDefinition(node.tagName);
    }
  }
}
customElements.define(WcAutoload.tag, WcAutoload);
export { WcAutoload };

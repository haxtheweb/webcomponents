/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
// register globally so we can make sure there is only one
globalThis.DynamicImportRegistry = globalThis.DynamicImportRegistry || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal
globalThis.DynamicImportRegistry.requestAvailability = () => {
  if (
    !globalThis.DynamicImportRegistry.instance &&
    globalThis.document &&
    globalThis.document.body
  ) {
    globalThis.DynamicImportRegistry.instance =
      globalThis.document.createElement("dynamic-import-registry");
    globalThis.document.body.appendChild(
      globalThis.DynamicImportRegistry.instance,
    );
  }
  return globalThis.DynamicImportRegistry.instance;
};
/**
 * `dynamic-import-registry`
 * `maintain manage the registration and usage of dynamic imports`
 * @demo demo/index.html
 * @element dynamic-import-registry
 */
class DynamicImportRegistry extends HTMLElement {
  static get tag() {
    return "dynamic-import-registry";
  }
  constructor(delayRender = false) {
    super();
    this.windowControllers = new AbortController();
    // object for tracking what the registry is
    this.list = {};
    this.__loaded = {};
    this.basePath =
      new URL("./dynamic-import-registry.js", import.meta.url).href +
      "/../../../";
    if (globalThis.WCAutoloadBasePath) {
      this.basePath = globalThis.WCAutoloadBasePath;
    } else if (globalThis.WCGlobalBasePath) {
      this.basePath = globalThis.WCGlobalBasePath;
    }
  }
  connectedCallback() {
    globalThis.addEventListener(
      "dynamic-import-registry--register",
      this.registerDefinitionEvent.bind(this),
      { signal: this.windowControllers.signal },
    );
  }
  disconnectedCallback() {
    this.windowControllers.abort();
  }
  register(item) {
    // validate with basic test
    if (item.tag && item.path) {
      if (!this.list[item.tag]) {
        this.list[item.tag] = item.path;
      }
    } else {
      console.warn(
        "DynamicImportRegistry: registration requires tag and path be set",
      );
    }
  }
  /**
   * This doesn't actually do the import, it just holds the definition
   */
  registerDefinitionEvent(e) {
    // validate with basic test
    if (e.detail.tag && e.detail.path) {
      this.register(e.detail);
    }
  }
  // returns path to tag from registry
  getPathToTag(tag) {
    if (this.list && tag && this.list[tag]) {
      return `${this.basePath}${this.list[tag]}`;
    }
    return false;
  }
  /**
   * This implements the definition with checks to ensure it need not run
   */
  async loadDefinition(tag) {
    // must be lowercase
    tag = tag.toLowerCase();
    // only import if we already had it
    if (
      !globalThis.customElements.get(tag) &&
      this.list[tag] &&
      !this.__loaded[tag]
    ) {
      // let's assume it's there cause we got here
      // this can help things on polyfill environments
      this.__loaded[tag] = true;
      try {
        return await import(`${this.basePath}${this.list[tag]}`).then(
          (module) => {
            // dispatch custom event in case anyone cares
            this.dispatchEvent(
              new CustomEvent("dynamic-import-registry-loaded", {
                detail: {
                  tag: tag,
                  path: this.list[tag],
                  module: module,
                },
              }),
            );
          },
        );
      } catch (e) {
        console.warn(`${this.basePath}${this.list[tag]}`);
        console.warn(e);
        // fire on error too
        this.dispatchEvent(
          new CustomEvent("dynamic-import-registry-failure", {
            detail: {
              tag: tag,
              path: this.list[tag],
              module: null,
            },
          }),
        );
        return false;
      }
    }
  }
}
customElements.define(DynamicImportRegistry.tag, DynamicImportRegistry);
export { DynamicImportRegistry };

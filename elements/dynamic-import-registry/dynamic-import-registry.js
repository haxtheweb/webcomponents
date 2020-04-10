/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
// register globally so we can make sure there is only one
window.DynamicImportRegistry = window.DynamicImportRegistry || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal
window.DynamicImportRegistry.requestAvailability = () => {
  if (!window.DynamicImportRegistry.instance) {
    window.DynamicImportRegistry.instance = document.createElement(
      "dynamic-import-registry"
    );
    document.body.appendChild(window.DynamicImportRegistry.instance);
  }
  return window.DynamicImportRegistry.instance;
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
    // object for tracking what the registry is
    this.list = {};
    this.__loaded = {};
    this.basePath =
      this.pathFromUrl(decodeURIComponent(import.meta.url)) + "../../";
  }
  connectedCallback() {
    window.addEventListener(
      "dynamic-import-registry--register",
      this.registerDefinitionEvent.bind(this)
    );
  }
  disconnectedCallback() {
    window.removeEventListener(
      "dynamic-import-registry--register",
      this.registerDefinitionEvent.bind(this)
    );
  }
  register(item) {
    // validate with basic test
    if (item.tag && item.path) {
      if (!this.list[item.tag]) {
        this.list[item.tag] = item.path;
      }
    } else {
      console.warn(
        "DynamicImportRegistry: registration requires tag and path be set"
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
  /**
   * This implements the definition with checks to ensure it need not run
   */
  async loadDefinition(tag) {
    // must be lowercase
    tag = tag.toLowerCase();
    // only import if we already had it
    if (
      !window.customElements.get(tag) &&
      this.list[tag] &&
      !this.__loaded[tag]
    ) {
      // let's assume it's there cause we got here
      // this can help things on polyfill environments
      this.__loaded[tag] = true;
      try {
        await import(`${this.basePath}${this.list[tag]}`).then(module => {
          // dispatch custom event in case anyone cares
          this.dispatchEvent(
            new CustomEvent("dynamic-import-registry-loaded", {
              detail: {
                tag: tag,
                path: this.list[tag],
                module: module
              }
            })
          );
        });
      } catch (e) {
        console.warn(e);
        // fire on error too
        this.dispatchEvent(
          new CustomEvent("dynamic-import-registry-failure", {
            detail: {
              tag: tag,
              path: this.list[tag],
              module: null
            }
          })
        );
      }
    }
  }
  // simple path from a url modifier
  pathFromUrl(url) {
    return url.substring(0, url.lastIndexOf("/") + 1);
  }
}
window.customElements.define(DynamicImportRegistry.tag, DynamicImportRegistry);
export { DynamicImportRegistry };

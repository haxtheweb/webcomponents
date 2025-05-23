/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
/**
 * `lazy-import-discover`
 * @element lazy-import-discover
 * `Break peoples' brains on simplifying webcomponent integrations`
 *
 * @microcopy - language worth noting:
 *  -
 *

 * @demo demo/index.html
 */
class LazyImportDiscover extends HTMLElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "lazy-import-discover";
  }
  /**
   * life cycle
   */
  constructor(delayRender = false) {
    super();
    // set tag for later use
    this.tag = LazyImportDiscover.tag;
  }
  get base() {
    return this.getAttribute("base");
  }
  set base(value) {
    if (value != null && this.__ready) {
      this.setAttribute("base", value);
    }
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    this.__ready = true;
    var dyn = "";
    if (this.base == null) {
      this.base = "../node_modules";
    }
    globalThis.document
      .querySelectorAll(":not(:defined)")
      .forEach((el, index) => {
        let t = el.tagName.toLowerCase();
        let path = `@haxtheweb/${t}/${t}.js`;
        if (el.getAttribute("data-wc-def") != null) {
          path = el.getAttribute("data-wc-def");
        }
        if (t !== "style") {
          dyn += `import('${this.base}/${path}');\n`;
        }
      });
    let s = globalThis.document.createElement("script");
    s.type = "module";
    s.innerText = dyn;
    globalThis.document.head.appendChild(s);
  }

  static get observedAttributes() {
    return ["base"];
  }
  attributeChangedCallback(attr, oldValue, newValue) {
    if (attr === "base" && newValue) {
      console.warn("base changed");
    }
  }
}
globalThis.customElements.define(LazyImportDiscover.tag, LazyImportDiscover);
export { LazyImportDiscover };

// self append. this is beyond trippy but the window loading will actually self invoke
globalThis.addEventListener("DOMContentLoaded", (event) => {
  var el = globalThis.document.createElement(LazyImportDiscover.tag);
  if (globalThis.LazyImportBase) {
    el.setAttribute("base", globalThis.LazyImportBase);
  }
  globalThis.document.body.appendChild(el);
});

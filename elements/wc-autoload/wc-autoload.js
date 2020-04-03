/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import "@lrnwebcomponents/dynamic-import-registry/dynamic-import-registry.js";
// register globally so we can make sure there is only one
window.WCAutoload = window.WCAutoload || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal
window.WCAutoload.requestAvailability = () => {
  if (!window.WCAutoload.instance) {
    window.WCAutoload.instance = document.createElement(
      "wc-autoload"
    );
    document.body.appendChild(window.WCAutoload.instance);
  }
  return window.WCAutoload.instance;
};
// forces self appending
window.WCAutoload.requestAvailability();
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
    this.registry = window.DynamicImportRegistry.requestAvailability();
    this.list = window.WCAutoload.registry;
  }
  connectedCallback() {
    this._mutationObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.tagName) {
            this.processNewElement(node);
          }
        });
      });
    });
    this._mutationObserver.observe(document.querySelector("body"), {
      childList: true,
      subtree: true
    });
  }
  processElementList(list) {
    for (var i = 0; i < list.length; i++) {
      this.processNewElement(list[i]);
    }
  }
  disconnectedCallback() {
    this._mutationObserver.disconnect();
  }
  /**
   * Process new elements
   */
  processNewElement(node) {
    this.registry.loadDefinition(node.tagName);
  }
}
window.customElements.define(WcAutoload.tag, WcAutoload);
export { WcAutoload };

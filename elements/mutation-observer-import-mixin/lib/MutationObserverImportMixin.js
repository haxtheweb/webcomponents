/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import "@haxtheweb/dynamic-import-registry/dynamic-import-registry.js";
/**
 * `MutationObserverImportMixin`
 * `Super class to do imports of new custom elements on the fly`
 */
const MutationObserverImportMixin = function (SuperClass) {
  // SuperClass so we can write any web component library / base class
  return class extends SuperClass {
    constructor() {
      super();
      globalThis.DynamicImportRegistry.requestAvailability();
    }
    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      this._mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.tagName) {
              this.processNewElement(node);
            }
          });
        });
      });
      this._mutationObserver.observe(this, {
        childList: true,
      });
    }
    processElementList(list) {
      for (var i = 0; i < list.length; i++) {
        this.processNewElement(list[i]);
      }
    }
    disconnectedCallback() {
      this._mutationObserver.disconnect();
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
    }
    /**
     * Process new elements
     */
    processNewElement(node) {
      let registry = globalThis.DynamicImportRegistry.requestAvailability();
      registry.loadDefinition(node.tagName);
    }
  };
};
export { MutationObserverImportMixin };

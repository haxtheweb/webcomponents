/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { MutationObserverImportMixin } from "./lib/MutationObserverImportMixin.js";
/**
 * `mutation-observer-import-mixin`
 * `a SuperClass mixin that dynamically imports undefined custom element definitions`
 * @demo demo/index.html
 * @element mutation-observer-import-mixin
 */
class MutationObserverImportElement extends MutationObserverImportMixin(HTMLElement) {
  static get tag() {
    return "mutation-observer-import";
  }
  connectedCallback() {
    super.connectedCallback();
    this.processElementList(this.children);
  }
}
customElements.define(
  MutationObserverImportElement.tag,
  MutationObserverImportElement
);
export { MutationObserverImportElement };

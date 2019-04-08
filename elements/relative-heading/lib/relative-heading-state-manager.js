/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";

// register globally so we can make sure there is only one
window.RelativeHeadingStateManager = window.RelativeHeadingStateManager || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal
window.RelativeHeadingStateManager.requestAvailability = () => {
  if (!window.RelativeHeadingStateManager.instance) {
    window.RelativeHeadingStateManager.instance = document.createElement(
      "relative-heading-state-manager"
    );
    document.body.appendChild(window.RelativeHeadingStateManager.instance);
  }
  return window.RelativeHeadingStateManager.instance;
};
/**
 * `relative-heading-state-manager`
 * `A utility that determines headings relative to their parents.`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 */
class RelativeHeadingStateManager extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "relative-heading-state-manager";
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {};
  }

  /**
   * Makes sure there is a utility ready and listening for elements.
   */
  constructor() {
    super();
    let root = this;

    // sets the instance to the current instance
    if (!window.RelativeHeadingStateManager.instance) {
      window.RelativeHeadingStateManager.instance = this;
      window.addEventListener("set-relative-heading", e => {
        root.setRelativeHeading(e);
      });
      return this;
    }
  }

  /**
   * geta target and parent & adds target to parent's children
   */
  setRelativeHeading(e) {}

  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    let root = this;
    window.addEventListener("set-relative-heading", e => {
      root.setRelativeHeading(e);
    });
  }
}
window.customElements.define(
  RelativeHeadingStateManager.tag,
  RelativeHeadingStateManager
);
export { RelativeHeadingStateManager };

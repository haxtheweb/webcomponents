/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
/**
 * @deprecatedApply - required for @apply / invoking @apply css var convention
 */
import "@polymer/polymer/lib/elements/custom-style.js";
/**
 * `scroll-button`
 * `button to scroll to an area or back to top`
 * @demo demo/index.html
 * @element scroll-button
 */
class ScrollButton extends LitElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */
  constructor() {
    super();
    this.icon = "icons:expand-less";
    this.label = "Scroll to top";
    this.position = "top";
    import("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "scroll-button";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  scrollEvent(e) {
    if (this.target) {
      this.target.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }
}
window.customElements.define(ScrollButton.tag, ScrollButton);
export { ScrollButton };

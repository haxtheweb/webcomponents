/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/iron-icons/iron-icons.js";
/**
 * `scroll-button`
 * `button to scroll to an area or back to top`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class ScrollButton extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

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
  connectedCallback() {
    super.connectedCallback();
    this.$.btn.addEventListener("click", e => {
      if (this.target) {
        this.target.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest"
        });
      } else {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth"
        });
      }
    });
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setup(ScrollButton.haxProperties, ScrollButton.tag, this);
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    this.$.btn.removeEventListener("click", e => {
      if (this.target) {
        this.target.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest"
        });
      } else {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth"
        });
      }
    });
    super.disconnectedCallback();
  }
}
window.customElements.define(ScrollButton.tag, ScrollButton);
export { ScrollButton };

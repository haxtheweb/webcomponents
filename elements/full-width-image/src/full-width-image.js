/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
/**
 * `full-width-image`
 * `full width image that flows beyond boundaries`
 *
 * @microcopy - language worth noting:
 *  - images are best used when stretched across content
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class FullWidthImage extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "full-width-image";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setup(
      FullWidthImage.haxProperties,
      FullWidthImage.tag,
      this
    );
  }
  // Observer source for changes
  _sourceChanged(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      this.$.image.style.backgroundImage = `url("${newValue}")`;
    }
  }
}
window.customElements.define("full-width-image", FullWidthImage);
export { FullWidthImage };

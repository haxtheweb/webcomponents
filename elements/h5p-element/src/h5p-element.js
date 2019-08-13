/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "h5p-standalone/src/js/h5pintegration.es6";
/**
 * `h5p-element`
 * `h5p wrapper for loading and presenting .h5p files`
 *
 * @microcopy - language worth noting:
 *  - h5p is it's own eco system, we're just trying to wrap it a bit
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
class H5PElement extends LitElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  tag() {
    return "h5p-element";
  }
  /**
   * Register CSS styles
   */
  static get styles() {
    return ["h5p-standalone/src/styles/h5p.css"];
  }

  // life cycle
  constructor() {
    super();
    // make a random ID for the targeting
    this.contentId = this.generateUUID();
  }
  generateUUID() {
    return "item-sss-ss-ss".replace(/s/g, this._uuidPart);
  }
  _uuidPart() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    (function($) {
      $(function() {
        $(".h5p-container").h5p({
          frameJs: "../dist/js/h5p-standalone-frame.min.js",
          frameCss: "../dist/styles/h5p.css",
          h5pContent: "../workspace"
        });
      });
    })(H5P.jQuery);
    this.classList.add("h5p-content", "h5p-frame");
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setup(H5PElement.haxProperties, H5PElement.tag, this);
  }
  /**
   * life cycle, element removed from DOM
   */
  disconnectedCallback() {
    super.disconnectedCallback();
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {});
  }
}
customElements.define("h5p-element", H5PElement);
export { H5PElement };
var H5P = H5P || {};
H5P.externalEmbed = false;

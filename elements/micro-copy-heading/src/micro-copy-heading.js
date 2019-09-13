/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import {
  LitElement,
  html,
  css,
  customElement,
  property
} from "lit-element/lit-element.js";
/**
 * `micro-copy-heading`
 * `small call to action / attention that acts as a heading too`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @lit-element
 * @demo demo/index.html
 */
class MicroCopyHeading extends LitElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "micro-copy-heading";
  }

  // life cycle
  constructor() {
    super();
    this.tag = MicroCopyHeading.tag;
    // map our imported properties json to real props on the element
    // @notice static getter of properties is built via tooling
    // to edit modify src/micro-copy-heading-properties.json
    let obj = MicroCopyHeading.properties;
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        if (this.hasAttribute(p)) {
          this[p] = this.getAttribute(p);
        } else {
          this.setAttribute(p, obj[p].value);
          this[p] = obj[p].value;
        }
      }
    }
  }
}
customElements.define(MicroCopyHeading.tag, MicroCopyHeading);
export { MicroCopyHeading };

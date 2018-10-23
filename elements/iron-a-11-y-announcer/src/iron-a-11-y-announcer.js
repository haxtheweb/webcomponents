/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
export { IronA11YAnnouncer };
/**
 * `iron-a-11-y-announcer`
 * `Automated conversion of iron-a11y-announcer/`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class IronA11YAnnouncer extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "iron-a-11-y-announcer";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setHaxProperties(
      IronA11YAnnouncer.haxProperties,
      IronA11YAnnouncer.tag,
      this
    );
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(IronA11YAnnouncer.tag, IronA11YAnnouncer);

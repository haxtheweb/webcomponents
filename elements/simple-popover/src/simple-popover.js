/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import { AbsolutePositionBehavior } from "@lrnwebcomponents/absolute-position-behavior/absolute-position-behavior.js";
/**
 * `simple-popover`
 * `A popover alertdialog that is positioned next to a target element`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SimplePopover extends AbsolutePositionBehavior {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-popover";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setup(SimplePopover.haxProperties, SimplePopover.tag, this);
  }
  /**
   * sets pointer position based on popover and target middles
   *
   * @param {object} positions object that contains postions for popover and target
   * @returns {string} a string with margin styles to offset pointer
   */
  _getMargins(positions) {
    let style = "",
      v =
        positions.target.top +
        positions.target.height / 2 -
        positions.self.top -
        positions.self.height / 2 -
        10,
      h =
        positions.target.left +
        positions.target.width / 2 -
        positions.self.left -
        positions.self.width / 2 -
        10;
    switch (this.position) {
      case "left":
        style = `margin: ${v}px 0 0 -1px;`;
        break;
      case "right":
        style = `margin: ${v}px 0 -1px 0;`;
        break;
      case "top":
        style = `margin: -0.5 0 0 -1px ${h}px;`;
        break;
      default:
        style = `margin: 0 0 -1px ${h}px;`;
    }
    return style;
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(SimplePopover.tag, SimplePopover);
export { SimplePopover };

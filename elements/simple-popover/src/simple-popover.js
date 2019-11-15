/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { AbsolutePositionBehavior } from "@lrnwebcomponents/absolute-position-behavior/absolute-position-behavior.js";
/**
 * `simple-popover`
 * a popover alertdialog that is positioned next to a target element
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @demo ./demo/index.html
 */
class SimplePopover extends AbsolutePositionBehavior {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */
  constructor() {
    super();
    this.offset = -10;
    this.fitToVisibleBounds = true;
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-popover";
  }
  /**
   * sets pointer position based on popover and target middles
   *
   * @param {object} positions object that contains postions for popover and target
   * @returns {string} a string with margin styles to offset pointer
   */
  _getMargins(positions) {
    if (positions && positions.target) {
      let self = this.getBoundingClientRect(),
        h = this.position === "bottom" || this.position === "top",
        max = h ? self.width : self.height,
        sStart = h ? self.left : self.top,
        tStart = h ? positions.target.left : positions.target.top,
        tHalf = h ? positions.target.width / 2 : positions.target.height / 2,
        center = tStart + tHalf - 10,
        margin = Math.min(max - 20, Math.max(0, center - sStart)),
        style = h ? `margin: 0 0 0 ${margin}px;` : `margin: ${margin}px 0 0 0;`;
      return style;
    }
    return ``;
  }
}
window.customElements.define(SimplePopover.tag, SimplePopover);
export { SimplePopover };

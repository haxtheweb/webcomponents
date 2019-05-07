/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "./lib/absolute-position-state-manager";

/**
 * `absolute-position-behavior`
 * `Abstracting the positioning behavior from paper-tooltip to be resusable in other elements`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class AbsolutePositionBehavior extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "absolute-position-behavior";
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * life cycle, element is ready
   */
  ready() {
    super.ready();
    let root = this;
    root.__observe = false;
    root.__manager = window.AbsolutePositionStateManager.requestAvailability();
    if (root.auto !== false) root.setPosition();
  }
  /**
   * Registers the element with AbsolutePositionStateManager
   */
  setPosition() {
    let root = this;
    root.__observe = true;
    root.__manager.loadElement(root);
  }

  /**
   * Unregisters the element with AbsolutePositionStateManager
   */
  unsetPosition() {
    let root = this;
    root.__observe = false;
    root.__manager.unloadElement(root);
  }

  /**
   * Updates  the element's position
   */
  updatePosition() {
    let root = this;
    if (root.__observe === true) {
      root.__manager.positionElement(root);
    }
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    this.unsetPosition();
    super.disconnectedCallback();
  }
}
window.customElements.define(
  AbsolutePositionBehavior.tag,
  AbsolutePositionBehavior
);
export { AbsolutePositionBehavior };

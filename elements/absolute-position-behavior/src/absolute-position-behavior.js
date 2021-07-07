/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import "./lib/absolute-position-state-manager.js";
/**
 * @customElement
 * @class
 */
const AbsolutePositionBehaviorClass = function (SuperClass) {
  return class extends SuperClass {
    /* REQUIRED FOR TOOLING DO NOT TOUCH */

    /**
     * Store tag name to make it easier to obtain directly.
     * @notice function name must be here for tooling to operate correctly
     */
    static get tag() {
      return "absolute-position-behavior";
    }

    constructor() {
      super();
      this.auto = false;
      this.fitToVisibleBounds = false;
      this.for = null;
      this.offset = 0;
      this.position = "bottom";
      this.target = null;
      this.__positions = {};
      this.__observe = false;
      this.__manager = window.AbsolutePositionStateManager.requestAvailability();
    }

    updated(changedProperties) {
      changedProperties.forEach((oldValue, propName) => {
        if (propName === "auto" && this.auto) this.setPosition();
        if (propName === "auto" && !this.auto) this.unsetPosition();
        if (propName === "fitToVisibleBounds") this.updatePosition();
        if (propName === "for") this.updatePosition();
        if (propName === "offset") this.updatePosition();
        if (propName === "position") this.updatePosition();
        if (propName === "justify") this.updatePosition();
        if (propName === "positionAlign") this.updatePosition();
        if (propName === "target") this.updatePosition();
        if (propName === "hidden") this.updatePosition();
      });
    }

    /**
     * Registers element with AbsolutePositionStateManager
     * @returns {void}
     */
    setPosition() {
      this.__observe = true;
      this.__manager.loadElement(this);
    }

    /**
     * Unregisters element with AbsolutePositionStateManager
     * @returns {void}
     */
    unsetPosition() {
      this.__observe = false;
      this.__manager.unloadElement(this);
    }

    /**
     * Updates  element's position
     * @returns {void}
     */
    updatePosition() {
      if (this.__observe === true) {
        this.__manager.positionElement(this);
      }
    }
    /**
     * life cycle, element is removed from DOM
     * @returns {void}
     */
    disconnectedCallback() {
      this.unsetPosition();
      super.disconnectedCallback();
    }
  };
};

/**
 * `absolute-position-behavior`
 * abstracts absolute positioning behavior to be resusable in other elements
 * @demo ./demo/index.html
 * @element absolute-position-behavior
 */
class AbsolutePositionBehavior extends AbsolutePositionBehaviorClass(
  LitElement
) {}
window.customElements.define(
  AbsolutePositionBehavior.tag,
  AbsolutePositionBehavior
);
export { AbsolutePositionBehaviorClass, AbsolutePositionBehavior };

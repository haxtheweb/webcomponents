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
<<<<<<< HEAD
      this.sticky = false;
=======
      this.hidden = false;
>>>>>>> master
      this.__positions = {};
      this.__observe = false;
    }

    updated(changedProperties) {
<<<<<<< HEAD
      let updatePosition = false;
      changedProperties.forEach((oldValue, propName) => {
        if (propName === "auto" && this.auto) this.setPosition();
        if (propName === "auto" && !this.auto) this.unsetPosition();
        if (
          [
            "fitToVisibleBounds",
            "for",
            "offset",
            "position",
            "justify",
            "positionAlign",
            "target",
            "hidden",
            "sticky",
          ].includes(propName) &&
          this[propName] !== oldValue
        )
          updatePosition = true;
      });
      if (updatePosition) console.log(changedProperties, this.target);
      if (updatePosition) this.updatePosition();
=======
      if (this.shadowRoot && !this.hidden) {
        changedProperties.forEach((oldValue, propName) => {
          if (propName === "auto" && this.auto) this.setPosition();
          if (propName === "auto" && !this.auto) this.unsetPosition();
          if (propName === "fitToVisibleBounds") this.updatePosition();
          if (propName === "for") this.updatePosition();
          if (propName === "offset") this.updatePosition();
          if (propName === "position") this.updatePosition();
          if (propName === "positionAlign") this.updatePosition();
          if (propName === "target") this.updatePosition();
          if (propName === "hidden") this.updatePosition();
        });
      }
>>>>>>> master
    }

    /**
     * Registers element with AbsolutePositionStateManager
     * @returns {void}
     */
    setPosition() {
      this.__observe = true;
      window.AbsolutePositionStateManager.requestAvailability().loadElement(
        this
      );
    }

    /**
     * Unregisters element with AbsolutePositionStateManager
     * @returns {void}
     */
    unsetPosition() {
      this.__observe = false;
      window.AbsolutePositionStateManager.requestAvailability().unloadElement(
        this
      );
    }

    /**
     * Updates  element's position
     * @returns {void}
     */
    updatePosition() {
<<<<<<< HEAD
      if (!this.auto || this.__observe === true) {
        this.__manager.positionElement(this);
=======
      if (this.__observe === true) {
        window.AbsolutePositionStateManager.requestAvailability().positionElement(
          this
        );
>>>>>>> master
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

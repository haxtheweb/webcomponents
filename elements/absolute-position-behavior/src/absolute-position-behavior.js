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
    //styles function
    static get styles() {
      let styles = [];
      if (super.styles) {
        styles = super.styles;
      }
      return [
        styles,
        css`
          :host {
            display: inline-block;
            z-index: 99999999999;
            position: absolute;
          }

          :host([hidden]) {
            display: none;
          }
        `,
      ];
    }

    // render function
    render() {
      return html` <slot></slot>`;
    }

    // properties available to the custom element for data binding
    static get properties() {
      return {
        ...super.properties,

        /**
         * Element has absolututely positioned children, such as menus
         * and tooltips that are allowed to overlap the target
         */
        allowOverlap: {
          type: Boolean,
          attribute: "allow-overlap",
        },
        /**
         * Element is positioned from connected to disconnected?
         * Otherwise setPosition and unsetPosition must be called manually.
         */
        auto: {
          type: Boolean,
          attribute: "auto",
        },
        /**
         * If true, no parts of the tooltip will ever be shown offscreen.
         */
        fitToVisibleBounds: {
          type: Boolean,
          attribute: "fit-to-visible-bounds",
        },
        /**
         * If true, no parts of the tooltip will ever be shown offscreen.
         */
        hidden: {
          type: Boolean,
          reflect: true,
          attribute: "hidden",
        },
        /**
         * The id of the element that the tooltip is anchored to. This element
         * must be a sibling of the tooltip. If this property is not set,
         * then the tooltip will be centered to the parent node containing it.
         */
        for: {
          type: String,
          attribute: "for",
          reflect: true,
        },
        /**
         * The spacing between the top of the tooltip and the element it is
         * anchored to.
         */
        offset: {
          type: Number,
          attribute: "offset",
        },
        /**
         * Stays on screen while target is on screen
         */
        sticky: {
          type: Boolean,
          attribute: "sticky",
          reflect: true,
        },
        /**
         * Positions the tooltip to the top, right, bottom, left of its content.
         */
        position: {
          type: String,
          attribute: "position",
          reflect: true,
        },
        /**
         * Aligns at the start, or end fo target. Default is centered.
         */
        positionAlign: {
          type: String,
          attribute: "position-align",
          reflect: true,
        },
        justify: {
          type: Boolean,
          reflect: true,
          attribute: "justify",
        },
        /**
         * The actual target element
         */
        target: {
          type: Object,
        },
        /**
         * The element's style
         */
        __positions: {
          type: Object,
        },
      };
    }

    /**
     * Store tag name to make it easier to obtain directly.
     * @notice function name must be here for tooling to operate correctly
     */
    static get tag() {
      return "absolute-position-behavior";
    }

    constructor() {
      super();
      this._ticking = false;
      this.scrollTarget = globalThis;
      this.auto = false;
      this.fitToVisibleBounds = false;
      this.for = null;
      this.offset = 0;
      this.position = "bottom";
      this.target = null;
      this.sticky = false;
      this.hidden = false;
      this.__positions = {};
      this.__observe = false;
    }

    updated(changedProperties) {
      if (super.updated) {
        super.updated(changedProperties);
      }
      let updatePosition = false;
      if (this.shadowRoot && !this.hidden) {
        changedProperties.forEach((oldValue, propName) => {
          if (propName === "auto" && this.auto) this.setPosition();
          if (propName === "auto" && !this.auto) this.unsetPosition();
          if (
            [
              "allowOverlap",
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
        if (updatePosition) this.updatePosition();
      }
    }

    /**
     * Registers element with AbsolutePositionStateManager
     * @returns {void}
     */
    setPosition() {
      this.__observe = true;
      globalThis.AbsolutePositionStateManager.requestAvailability().loadElement(
        this,
      );
    }

    /**
     * Unregisters element with AbsolutePositionStateManager
     * @returns {void}
     */
    unsetPosition() {
      this.__observe = false;
      globalThis.AbsolutePositionStateManager.requestAvailability().unloadElement(
        this,
      );
    }

    /**
     * Updates  element's position
     * @returns {void}
     */
    updatePosition() {
      if (!this.hidden && this.auto && this.__observe == false) {
        globalThis.AbsolutePositionStateManager.requestAvailability().loadElement(
          this,
        );
      }
      if (!this.auto || this.__observe === true) {
        globalThis.AbsolutePositionStateManager.requestAvailability().positionElement(
          this,
        );
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
  LitElement,
) {}
customElements.define(AbsolutePositionBehavior.tag, AbsolutePositionBehavior);
export { AbsolutePositionBehaviorClass, AbsolutePositionBehavior };

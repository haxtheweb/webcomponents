/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-resizable-behavior/iron-resizable-behavior.js";

// register globally so we can make sure there is only one
window.AbsolutePositionStateManager = window.AbsolutePositionStateManager || {};
// request if this exists. This helps invoke the el existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal
window.AbsolutePositionStateManager.requestAvailability = () => {
  if (!window.AbsolutePositionStateManager.instance) {
    window.AbsolutePositionStateManager.instance = document.createElement(
      "absolute-position-state-manager"
    );
    document.body.appendChild(window.AbsolutePositionStateManager.instance);
  }
  return window.AbsolutePositionStateManager.instance;
};
/**
 * `absolute-position-state-manager`
 * `A utility that manages the state of multiple a11y-media-players on a single page.`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 */
class AbsolutePositionStateManager extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "absolute-position-state-manager";
  }

  // properties available to the custom el for data binding
  static get properties() {
    return {
      /**
       * Stores an array of all the players on the page.
       */
      els: {
        type: Array,
        value: []
      }
    };
  }

  /**
   * Makes sure there is a utility ready and listening for els.
   */
  constructor() {
    super();
    let root = this;

    // sets the instance to the current instance
    if (!window.AbsolutePositionStateManager.instance) {
      window.AbsolutePositionStateManager.instance = this;
      return this;
    }
  }

  /**
   * life cycle, el is afixed to the DOM
   * Makes sure there is a utility ready and listening for els.
   */
  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Loads el into array
   */
  loadElement(el) {
    let root = this;
    root.__on = root.__on !== undefined ? root.__on : false;
    root.els.push(el);
    root.positionElement(el);
    if (!root.__on) root.addEventListeners();
    root.__on = true;
  }

  /**
   * Unloads el from array
   */
  unloadElement(el) {
    let root = this;
    root.els.filter(el => el === el);
    root.__on = root.els > 0;
    if (!root.__on) root.removeEventListeners();
  }

  /**
   * Adds event listeners
   */
  addEventListeners() {
    let root = this;
    root.__timeout = false;
    root.updateElements();
    document.addEventListener("load", root.updateElements());
    window.addEventListener("resize", function() {
      clearTimeout(root.__timeout);
      root.__timeout = setTimeout(root.updateElements(), 250);
    });
    root.__observer = new MutationObserver(function(mutations) {
      root.checkMutations(mutations);
    });
    root.__observer.observe(document, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  /**
   * Checks if there are any chances other than to
   * the element's position and updates accordioning.
   * This is needed so that positioning the elements
   * doesn't trigger an infinite loop of updates.
   *
   * @param {array} mutation records
   * @return {void}
   */
  checkMutations(mutations) {
    let update = false;

    mutations.forEach(mutation => {
      if (update) return;
      update =
        update ||
        !(
          mutation.type === "attributes" &&
          mutation.attributeName === "style" &&
          this.els.includes(mutation.target)
        );
    });
    if (update) this.updateElements();
  }

  /**
   * Returns the target el that this el is anchored to. It is
   * either the el given by the `for` attribute, or the immediate parent
   * of the el.
   *
   * @param {object} element using absolute-position behavior
   * @return {object} target element for positioning
   */
  findTarget(el) {
    let selector = "#" + el.for,
      docQuery =
        document.querySelectorAll(selector).length === 1
          ? document.querySelector(selector)
          : null,
      target = el.target || docQuery,
      ancestor = el;

    /**
     * Use `target` object if specified.
     * If not, query the document for elements with the id specified in the `for` attribute.
     * If there is more than one element that matches, find the closest matching element.
     */
    while (
      el.for !== undefined &&
      target === null &&
      ancestor !== null &&
      ancestor !== document
    ) {
      ancestor = ancestor.parentNode;
      if (ancestor.nodeType === 11) ancestor = ancestor.host;
      target = ancestor ? ancestor.querySelector(selector) : null;
    }
    return target;
  }

  /**
   * Removes event listeners
   * @return {void}
   */
  removeEventListeners() {
    let root = this;
    document.removeEventListener("load", root.updateElements());
    window.removeEventListener("resize", function() {
      clearTimeout(root.__timeout);
      root.__timeout = setTimeout(root.updateElements(), 250);
    });
    if (root.__observer) {
      root.__observer.disconnect();
    }
  }

  /**
   * Updates position for all elements on the page.
   * @return {void}
   */
  updateElements() {
    let root = this;
    root.els.forEach(el => {
      root.positionElement(el);
    });
  }

  /**
   * Gets an updated position based on target.
   * @param {object} the element using absolute-position behavior
   * @return {void}
   */
  positionElement(el) {
    let target = this.findTarget(el);
    if (!target || !el.offsetParent) return;
    let offset = el.offset,
      parentRect = el.offsetParent.getBoundingClientRect(),
      targetRect = target.getBoundingClientRect(),
      elRect = el.getBoundingClientRect(),
      centerOffset = (targetRect.width - elRect.width) / 2,
      middleOffset = (targetRect.height - elRect.height) / 2,
      fitToBounds = (coord, min, max) => {
        console.log("fitToBounds", coord, min, max);
        return el.fitToVisibleBounds
          ? Math.max(min, Math.min(max, coord))
          : coord;
      },
      fitOrFlip = (coord, min, max) => {
        if (el.fitToVisibleBounds) {
          if (coord < min) {
            if (el.position === "left") {
              el.postition = "right";
              coord = targetRect.right;
            } else {
              el.postition = "bottom";
              coord = targetRect.bottom;
            }
          } else if (coord > max) {
            if (el.position === "right") {
              el.postition = "left";
              coord = targetRect.left;
            } else {
              el.postition = "top";
              coord = targetRect.top;
            }
          }
        }
        return coord;
      };
    el.style.position = "absolute";
    switch (el.position) {
      case "top":
        el.style.left =
          fitToBounds(
            targetRect.left + centerOffset,
            parentRect.left,
            parentRect.right - elRect.width - parentRect.left + offset
          ) + "px";
        el.style.top =
          fitOrFlip(
            targetRect.top - elRect.height - offset,
            parentRect.top,
            parentRect.bottom - elRect.height
          ) + "px";
        break;
      case "bottom":
        console.log(
          "left",
          targetRect.left,
          centerOffset,
          parentRect.left,
          elRect.width,
          offset
        );
        el.style.left =
          fitToBounds(
            targetRect.left + centerOffset,
            parentRect.left,
            parentRect.right - elRect.width - parentRect.left + offset
          ) + "px";
        console.log("top", targetRect.top, parentRect.top, elRect.height);
        el.style.top =
          fitOrFlip(
            targetRect.bottom + offset,
            parentRect.top,
            parentRect.bottom - elRect.height
          ) + "px";
        break;
      case "left":
        el.style.left =
          fitOrFlip(
            targetRect.left - offset,
            targetRect.left - elRect.width - offset,
            parentRect.left,
            parentRect.right - elRect.width
          ) + "px";
        el.style.top =
          fitToBounds(
            targetRect.top + middleOffset,
            parentRect.top,
            parentRect.bottom - elRect.height - parentRect.top + offset
          ) + "px";
        break;
      case "right":
        el.style.left =
          fitOrFlip(
            targetRect.left - elRect.width + offset,
            parentRect.left,
            parentRect.right - elRect.width
          ) + "px";
        el.style.top =
          fitToBounds(
            targetRect.top + middleOffset,
            parentRect.top,
            parentRect.bottom - elRect.height - parentRect.top + offset
          ) + "px";
        break;
    }
    console.log(
      "positionElement",
      target,
      targetRect,
      el,
      el.offsetParent,
      parentRect,
      elRect,
      el.fitToVisibleBounds
    );
    //provide positions for el and target (in case furthor positioning adjustments are needed)
    el.__positions = {
      self: elRect,
      parent: parentRect,
      target: targetRect
    };
  }

  /**
   * life cycle, el is removed from the DOM
   */
  disconnectedCallback() {
    this.removeEventListeners();
    super.disconnectedCallback();
  }
}
window.customElements.define(
  AbsolutePositionStateManager.tag,
  AbsolutePositionStateManager
);
export { AbsolutePositionStateManager };

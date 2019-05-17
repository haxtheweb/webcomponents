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
      elLeft,
      elTop,
      styleLeft,
      styleRight,
      styleTop,
      styleBottom;
    switch (el.position) {
      case "top":
        elLeft = targetRect.left + centerOffset;
        elTop = targetRect.top - elRect.height - offset;
        break;
      case "bottom":
        elLeft = targetRect.left + centerOffset;
        elTop = targetRect.top + targetRect.height + offset;
        break;
      case "left":
        elLeft = targetRect.left - elRect.width - offset;
        elTop = targetRect.top + middleOffset;
        break;
      case "right":
        elLeft = targetRect.left + targetRect.width + offset;
        elTop = targetRect.top + middleOffset;
        break;
    }
    el.style.position = "absolute";
    // TODO(noms): This should use IronFitBehavior if possible.
    styleLeft = elLeft + "px";
    styleTop = elTop + "px";
    if (el.fitToVisibleBounds) {
      /// if the left side is off-screen
      if (
        elLeft - offset < parentRect.left ||
        elRect.width > parentRect.width
      ) {
        styleLeft = parentRect.left + "px";
        /// if the right side is off-screen
      } else if (elRect.right > parentRect.right) {
        styleLeft = targetRect.right - elRect.width + "px";
      }
      //if the top is off screen
      if (
        elTop - offset < parentRect.top ||
        elRect.height > parentRect.height
      ) {
        styleTop = parentRect.top + "px";
        // if the bottom is off screen
      } else if (elRect.bottom > parentRect.bottom) {
        styleLeft = targetRect.bottom - elRect.height + "px";
      }
    }
    el.style.left = styleLeft;
    el.style.top = styleTop;
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

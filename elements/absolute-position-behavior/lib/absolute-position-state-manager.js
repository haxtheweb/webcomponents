/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement } from "lit-element/lit-element.js";
import "@polymer/iron-resizable-behavior/iron-resizable-behavior.js";

// register globally so we can make sure there is only one
window.AbsolutePositionStateManager = window.AbsolutePositionStateManager || {};
// request if this exists. This helps invoke element existing in dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through same modal
window.AbsolutePositionStateManager.requestAvailability = () => {
  if (!window.AbsolutePositionStateManager.instance) {
    window.AbsolutePositionStateManager.instance = document.createElement(
      "absolute-position-state-manager"
    );
    let instance = window.AbsolutePositionStateManager.instance;
    document.body.appendChild(instance);
  }
  return window.AbsolutePositionStateManager.instance;
};
/**
 * `absolute-position-state-manager`
 * manages state of multiple absolute-positioned elements on a page
 *
 * @customElement absolute-position-state-manager
 */
class AbsolutePositionStateManager extends LitElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "absolute-position-state-manager";
  }

  // properties available to custom element for data binding
  static get properties() {
    return {
      /**
       * Stores an array of all elements using manager.
       */
      elements: {
        type: Array
      },
      /**
       * mutation observer
       */
      __observer: {
        type: Object
      },
      /**
       * resize timeout
       */
      __timeout: {
        type: Object
      }
    };
  }

  /**
   * Makes sure there is a utility ready and listening for elements.
   */
  constructor() {
    super();
    this.elements = [];
    this.__timeout = false;
    this.__observer = new MutationObserver(mutations =>
      this.checkMutations(mutations)
    );
  }

  /**
   * Loads element into array
   * @param {object} element to be added
   */
  loadElement(el) {
    //only have event listeners when there are elements using manager
    if (this.elements.length < 1) {
      this.__observer.observe(document, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true
      });
      this.updateElements();
      document.addEventListener("load", this.updateElements);
      window.addEventListener("resize", this._handleResize);
    }
    this.elements.push(el);
    this.positionElement(el);
  }

  /**
   * Unloads element from array
   * @param {object} element to be removed
   */
  unloadElement(el) {
    this.elements.filter(element => element === el);
    if (this.elements.length < 1) this.removeEventListeners();
  }

  /**
   * handles resize event
   */
  _handleResize() {
    if (this.__timeout) clearTimeout(this.__timeout);
    this.__timeout = setTimeout(
      window.AbsolutePositionStateManager.instance.updateElements(),
      250
    );
  }

  /**
   * Checks if there are any chances other than to
   * element's position and updates accordioning.
   * This is needed so that positioning elements
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
          this.elements.includes(mutation.target)
        );
    });
    if (update) this.updateElements();
  }

  /**
   * Returns target element that this element is anchored to. It is
   * either element given by `for` attribute, or immediate parent
   * of element.
   *
   * Uses `target` object if specified.
   * If not, queries document for elements with id specified in `for` attribute.
   * If there is more than one element that matches, gets closest matching element.
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
    if (this.__observer && this.__observer.disconnect)
      this.__observer.disconnect();
    document.removeEventListener("load", this.updateElements);
    window.removeEventListener("resize", this._handleResize);
  }

  /**
   * Updates position for all elements on page.
   * @return {void}
   */
  updateElements() {
    this.elements.forEach(element => this.positionElement(element));
  }

  /**
   * Gets an updated position based on target.
   * @param {object} element using absolute-position behavior
   * @return {void}
   */
  positionElement(el) {
    let target = this.findTarget(el);
    if (!target || !el.offsetParent) return;
    let offset = el.offset,
      parentRect = el.offsetParent.getBoundingClientRect(),
      targetRect = target.getBoundingClientRect(),
      elRect = el.getBoundingClientRect(),
      vertical = position => {
        //place element before vertically?
        return position !== "left" && position !== "right";
      },
      before = position => {
        //place element before target?
        return position === "left" || position === "top";
      },
      /**
       * ;
       *
       */
      fitToBounds = () => {
        //fits element within parent's boundaries
        let pos1 = vertical(el.position) ? "left" : "top",
          pos2 = vertical(el.position) ? "right" : "bottom",
          getRect = rect => {
            return vertical(el.position) ? rect.width : rect.height;
          },
          coord =
            targetRect[pos1] - getRect(elRect) / 2 + getRect(targetRect) / 2,
          min = parentRect[pos1],
          max = parentRect[pos2] - getRect(elRect);
        return el.fitToVisibleBounds
          ? Math.max(min, Math.min(max, coord)) + "px"
          : coord + "px"; //if element size > parent, align where parent begins
      },
      getCoord = () => {
        //adds or subtracts offset from target based on position
        return el.position === "top"
          ? targetRect.top - elRect.height - offset + "px"
          : el.position === "left"
          ? targetRect.left - elRect.width - offset + "px"
          : targetRect[el.position] + offset + "px";
      },
      isFit = position => {
        //determines if room for element between parent and target
        let size = vertical(position)
          ? elRect.height + offset
          : elRect.width + offset;
        return before(position)
          ? targetRect[position] - parentRect[position] > size
          : parentRect[position] - targetRect[position] > size; //if no room, return original position
      };
    let flip = el.fitToVisibleBounds !== false && !isFit(el.position),
      flipData = {
        top: ["bottom", "left", "right"],
        left: ["right", "top", "bottom"],
        bottom: ["top", "right", "left"],
        right: ["left", "bottom", "top"]
      };
    /*
     * fits element according to specified postion,
     * or finds an alternative position that fits
     */
    if (flip && isFit(flipData[el.position][0])) {
      el.position = flipData[el.position][0];
    } else if (flip && isFit(flipData[el.position][1])) {
      el.position = flipData[el.position][1];
    } else if (flip && isFit(flipData[el.position][2])) {
      el.position = flipData[el.position][2];
    } else {
      el.style.position = "absolute";
      el.style.top = vertical(el.position) ? getCoord() : fitToBounds();
      el.style.left = vertical(el.position) ? fitToBounds() : getCoord();
      //provide positions for element and target (in case furthor positioning adjustments are needed)
      el.__positions = {
        self: elRect,
        parent: parentRect,
        target: targetRect
      };
    }
  }

  /**
   * life cycle, element is removed from DOM
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

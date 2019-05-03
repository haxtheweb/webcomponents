/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-resizable-behavior/iron-resizable-behavior.js";

// register globally so we can make sure there is only one
window.AbsolutePositionStateManager = window.AbsolutePositionStateManager || {};
// request if this exists. This helps invoke the element existing in the dom
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

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * Stores an array of all the players on the page.
       */
      elements: {
        type: Array,
        value: []
      }
    };
  }

  /**
   * Makes sure there is a utility ready and listening for elements.
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
   * life cycle, element is afixed to the DOM
   * Makes sure there is a utility ready and listening for elements.
   */
  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Loads element into array
   */
  loadElement(el) {
    let root = this;
    root.__on = root.__on !== undefined ? root.__on : false;
    root.elements.push(el);
    root.updatePosition(el);
    if (!root.__on) root.addEventListeners();
    root.__on = true;
  }

  /**
   * Unloads element from array
   */
  unloadElement(el) {
    let root = this;
    root.elements.filter(element => element === el);
    root.__on = root.elements > 0;
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
      root.updateElements();
    });
    root.__observer.observe(document, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  /**
   * Returns the target element that this tooltip is anchored to. It is
   * either the element given by the `for` attribute, or the immediate parent
   * of the tooltip.
   *
   * @type {Node}
   */
  findTarget(el) {
    let target;
    let parentNode = this.parentNode;
    console.log("findTarget", el, el.target, parentNode);
    if (el.target) {
      target = el.target;
      console.log("target", el.target);
    } else if (el.for) {
      target = parentNode.querySelector("#" + el.for);
      console.log("for", el.for, target);
    } else {
      let ownerRoot = el.shadowRoot;
      target =
        parentNode.nodeType == Node.DOCUMENT_FRAGMENT_NODE
          ? ownerRoot.host
          : parentNode;
      console.log("for", ownerRoot, target);
    }
    return target;
  }

  /**
   * Removes event listeners
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
   * stops all other players on the page
   */
  updateElements() {
    let root = this;
    root.elements.forEach(element => {
      root.updatePosition(element);
    });
  }

  /**
   * @return {void}
   */
  updatePosition(element) {
    let target = this.findTarget(element);
    if (!target || !element.offsetParent) return;
    var offset = element.offset;
    var parentRect = element.offsetParent.getBoundingClientRect();
    var targetRect = target.getBoundingClientRect();
    var elementRect = element.getBoundingClientRect();
    var horizontalCenterOffset = (targetRect.width - elementRect.width) / 2;
    var verticalCenterOffset = (targetRect.height - elementRect.height) / 2;
    console.log("updatePosition", element, target);
    //var targetLeft = targetRect.left - parentRect.left;
    //var targetTop = targetRect.top - parentRect.top;
    var tooltipLeft, tooltipTop;
    switch (element.position) {
      case "top":
        tooltipLeft = targetRect.left + horizontalCenterOffset;
        tooltipTop = targetRect.top - elementRect.height - offset;
        break;
      case "bottom":
        tooltipLeft = targetRect.left + horizontalCenterOffset;
        tooltipTop = targetRect.top + targetRect.height + offset;
        break;
      case "left":
        tooltipLeft = targetRect.left - elementRect.width - offset;
        tooltipTop = targetRect.top + verticalCenterOffset;
        break;
      case "right":
        tooltipLeft = targetRect.left + targetRect.width + offset;
        tooltipTop = targetRect.top + verticalCenterOffset;
        break;
    }
    element.style.position = "absolute";
    // TODO(noms): This should use IronFitBehavior if possible.
    if (element.fitToVisibleBounds) {
      // Clip the left/right side
      if (
        parentRect.left + tooltipLeft + elementRect.width >
        window.innerWidth
      ) {
        element.style.right = "0px";
        element.style.left = "auto";
      } else {
        element.style.left = Math.max(0, tooltipLeft) + "px";
        element.style.right = "auto";
      }
      // Clip the top/bottom side.
      if (
        parentRect.top + tooltipTop + elementRect.height >
        window.innerHeight
      ) {
        element.style.bottom =
          parentRect.height - targetRect.top + offset + "px";
        element.style.top = "auto";
      } else {
        element.style.top = Math.max(-parentRect.top, tooltipTop) + "px";
        element.style.bottom = "auto";
      }
    } else {
      element.style.left = tooltipLeft + "px";
      element.style.top = tooltipTop + "px";
    }
    //provide positions for element and target (in case furthor positioning adjustments are needed)
    element.__positions = {
      self: elementRect,
      target: targetRect
    };
  }

  /**
   * life cycle, element is removed from the DOM
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

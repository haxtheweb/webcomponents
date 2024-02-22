/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement } from "lit";

// register globally so we can make sure there is only one
globalThis.AbsolutePositionStateManager =
  globalThis.AbsolutePositionStateManager || {};
// request if this exists. This helps invoke element existing in dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through same modal
globalThis.AbsolutePositionStateManager.requestAvailability = () => {
  if (
    !globalThis.AbsolutePositionStateManager.instance &&
    globalThis.document
  ) {
    globalThis.AbsolutePositionStateManager.instance =
      globalThis.document.createElement("absolute-position-state-manager");
    let instance = globalThis.AbsolutePositionStateManager.instance;
    globalThis.document.body.appendChild(instance);
  }
  return globalThis.AbsolutePositionStateManager.instance;
};
/**
 * `absolute-position-state-manager`
 * manages state of multiple absolute-positioned elements on a page
 *
 * @element absolute-position-state-manager
 */
class AbsolutePositionStateManager extends LitElement {
  /**
   * Store tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "absolute-position-state-manager";
  }

  // properties available to custom element for data binding
  static get properties() {
    return {
      scrollTarget: {
        type: Object,
      },
      /**
       * Stores an array of all elements using manager.
       */
      elements: {
        type: Array,
      },
      /**
       * mutation observer
       */
      __observer: {
        type: Object,
      },
      /**
       * resize timeout
       */
      __timeout: {
        type: Object,
      },
      /**
       * resize timeout
       */
      __timeout2: {
        type: Object,
      },
    };
  }

  /**
   * Makes sure there is a utility ready and listening for elements.
   */
  constructor() {
    super();
    this.windowControllers = new AbortController();
    this.elements = [];
    this.__timeout = false;
    this.__observer = new MutationObserver((mutations) =>
      this.checkMutations(mutations),
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
        characterData: true,
      });
      this.updateElements();
      this.windowControllers = new AbortController();
      globalThis.document.addEventListener(
        "load",
        this.updateElements.bind(this),
        {
          signal: this.windowControllers.signal,
        },
      );
      globalThis.addEventListener("resize", this._handleResize.bind(this), {
        signal: this.windowControllers.signal,
      });
    }
    if (this.elements.filter((element) => element === el).length < 1) {
      this.elements.push(el);
      el.style.top = 0;
      el.style.left = 0;
    }
    this.positionElement(el);
  }

  /**
   * Unloads element from array
   * @param {object} element to be removed
   */
  unloadElement(el) {
    this.elements = this.elements.filter((element) => element !== el);
    if (this.elements.length < 1) this.removeEventListeners();
  }

  /**
   * handles resize event
   */
  _handleScroll() {
    if (this.__timeout2) clearTimeout(this.__timeout2);
    this.__timeout2 = setTimeout(
      globalThis.AbsolutePositionStateManager.instance.updateStickyElements(),
      1000,
    );
  }

  /**
   * handles resize event
   */
  _handleResize() {
    if (this.__timeout) clearTimeout(this.__timeout);
    this.__timeout = setTimeout(
      globalThis.AbsolutePositionStateManager.instance.updateElements(),
      250,
    );
  }

  /**
   * Checks if there are any changes other than to
   * element's position and update accordioningly.
   * This is needed so that positioning elements
   * doesn't trigger an infinite loop of updates.
   *
   * @param {array} mutation records
   * @return {void}
   */
  checkMutations(mutations) {
    let update = false;

    mutations.forEach((mutation) => {
      if (update) return;
      update =
        update ||
        !(
          mutation.type === "attributes" &&
          mutation.attributeName === "style" &&
          this.elements.includes(mutation.target)
        );
    });
    if (update) {
      if (this.__timeout) clearTimeout(this.__timeout);
      this.__timeout = setTimeout(
        globalThis.AbsolutePositionStateManager.instance.updateElements(),
        250,
      );
    }
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
      target = el.target,
      ancestor = el;

    while (
      !!el.for &&
      !target &&
      !!ancestor &&
      !!ancestor.parentNode &&
      ancestor !== document
    ) {
      ancestor = ancestor.parentNode;
      target = ancestor ? ancestor.querySelector(selector) : undefined;
      if (ancestor.nodeType === 11) ancestor = ancestor.host;
      target = !target && ancestor ? ancestor.querySelector(selector) : target;
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
    this.windowControllers.abort();
    if (this.__watchSticky && this.scrollTarget)
      this.scrollTarget.removeEventListener("scroll", this._handleScroll);
  }

  /**
   * Updates position for all elements on page.
   * @return {void}
   */
  updateElements() {
    this.elements.forEach((element) => this.positionElement(element));
    this.loadSticky();
  }
  /**
   * Updates position for all elements on page.
   * @return {void}
   */
  updateStickyElements() {
    this.elements.forEach((element) => {
      if (element.sticky) this.positionElement(element);
    });
  }

  /**
   * Only listen for scrolling if there is a sticky element
   * @return {void}
   */
  loadSticky() {
    //only have event listeners when there are elements using manager
    if (
      !this.__watchSticky &&
      this.elements.filter((el) => el.sticky).length > 0 &&
      this.scrollTarget
    ) {
      this.__watchSticky = true;
      this.scrollTarget.addEventListener("scroll", this._handleScroll, {
        passive: true,
      });
    } else if (
      this.__watchSticky &&
      this.elements.filter((el) => el.sticky).length < 1 &&
      this.scrollTarget
    ) {
      this.scrollTarget.removeEventListener("scroll", this._handleScroll, {
        passive: true,
      });
      this.__watchSticky = false;
    }
  }

  _getParentNode(node) {
    let parent = node.parentNode;
    if (
      parent !== undefined &&
      parent !== null &&
      parent.nodeType === Node.DOCUMENT_FRAGMENT_NODE
    ) {
      parent = parent.host;
    }
    return parent;
  }

  /**
   * Gets an updated position based on target.
   * @param {object} element using absolute-position behavior
   * @return {void}
   */
  positionElement(el) {
    //set up element's default position
    if (!el.position) {
      el.position = "bottom";
    }
    el.style.position = "absolute";
    if (!el.style.top) el.style.top = "0px";
    if (!el.style.left) el.style.left = "0px";

    //continue only if there is a target and a parent
    let target = this.findTarget(el);
    let parent = el.offsetParent;
    let t =
      target && target.getBoundingClientRect
        ? target.getBoundingClientRect()
        : {};
    if (!target || !parent) return;
    //if justify is set, re-adjust element to
    //target width before getting other dimensions
    if (el.justify) el.style.width = `${t.width}px`;
    //get body, parent, and element dimensions
    let w = globalThis.document.body.getBoundingClientRect(),
      p = parent.getBoundingClientRect(),
      e = el.getBoundingClientRect(),
      //optional offset property
      offset = parseFloat(el.offset),
      //converts a value in px to a float
      pxToNum = (px) => parseFloat(px.replace("px", "")),
      //place element before vertically?
      vertical = (pos = el.position) => pos !== "left" && pos !== "right",
      //place element before target?
      before = (pos = el.position) => pos === "left" || pos === "top",
      /**
       * aligns horizontally if position is vertical
       * or aligns vertically if position is horizontal
       */
      setAlign = (v = vertical(el.position)) => {
        //fits element within parent's boundaries
        let min = v
            ? pxToNum(el.style.left) - e.left
            : pxToNum(el.style.top) - e.top,
          startAt = v ? "left" : "top",
          distance = (rect) => (v ? rect.width : rect.height),
          max = min + distance(w) - distance(e),
          align = min,
          bounds;
        if (el.positionAlign === "end") {
          align += t[startAt] - distance(e) + distance(t);
        } else if (el.positionAlign === "start") {
          align += t[startAt];
        } else {
          align += t[startAt] - distance(e) / 2 + distance(t) / 2;
        }
        bounds = el.fitToVisibleBounds
          ? Math.max(min, Math.min(max, align))
          : align; //if element size > parent, align where parent begins

        return bounds;
      },
      //gets coordinate for top ot left position
      getCoord = (pos = el.position) => {
        let coord,
          adjust = vertical(pos)
            ? pxToNum(el.style.top) - e.top
            : pxToNum(el.style.left) - e.left,
          //determine whether overflowed content should be part of height/width calculations
          eh =
            !el.allowOverlap &&
            globalThis.getComputedStyle(el, null).overflowY == "visible"
              ? Math.max(e.height, el.scrollHeight)
              : e.height,
          ew =
            !el.allowOverlap &&
            globalThis.getComputedStyle(el, null).overflowX == "visible"
              ? Math.max(e.width, el.scrollWidth)
              : e.width;
        //calculate coordinate based on position property,
        // offset property, and whether overflowed conent should overlap the target
        coord =
          pos === "top"
            ? t.top + adjust - eh - offset
            : pos === "left"
              ? t.left + adjust - ew - offset
              : t[pos] + adjust + offset;
        return coord;
      },
      //determines if element fits on screen in the desired position
      isFit = (pos = el.position) => {
        //determines if room for element between parent and target
        let distance = (rect) =>
          vertical(pos) ? e.height + offset : e.width + offset;
        return before(pos)
          ? t[pos] - w[pos] > distance
          : w[pos] - t[pos] > distance; //if no room, return original position
      },
      //should element's position flip to fit element within bounds
      flip = el.fitToVisibleBounds !== false && !isFit(el.position),
      //if position needs to be flipped, order of preference for new position
      flipData = {
        top: ["bottom", "left", "right"],
        left: ["right", "top", "bottom"],
        bottom: ["top", "right", "left"],
        right: ["left", "bottom", "top"],
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
    }
    //get top and left positions
    let tt = vertical(el.position) ? getCoord() : setAlign(),
      ll = vertical(el.position) ? setAlign() : getCoord();
    //if element is sticky, adjust top posiiton accordingly
    if (el.sticky) {
      let scrollTop =
          globalThis.pageYOffset ||
          (
            globalThis.document.documentElement ||
            globalThis.document.body.parentNode ||
            globalThis.document.body
          ).scrollTop,
        maxH = globalThis.innerHeight,
        eheight =
          e.height === 0 && el.children && el.children[0]
            ? el.children[0].offsetHeight
            : e.height,
        stickyT = t.top - e.height < 0 && t.top + t.height > 20 + eheight,
        stickyB = t.top + t.height + e.height > maxH && t.top < maxH - eheight;
      if (el.position === "top" && stickyT)
        tt = scrollTop - parent.offsetTop + (eheight - e.height);
      if (el.position === "bottom" && stickyB)
        tt = scrollTop + maxH - parent.offsetTop - eheight;
    }
    //set top and left positions
    el.style.top = tt + "px";
    el.style.left = ll + "px";
    //provide positions for element and target (in case furthor positioning adjustments are needed)
    el.__positions = {
      self: e,
      parent: p,
      target: t,
    };
  }

  /**
   * life cycle, element is removed from DOM
   */
  disconnectedCallback() {
    this.removeEventListeners();
    super.disconnectedCallback();
  }
}
customElements.define(
  AbsolutePositionStateManager.tag,
  AbsolutePositionStateManager,
);
export { AbsolutePositionStateManager };

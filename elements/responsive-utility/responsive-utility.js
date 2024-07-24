import { LitElement, html, css } from "lit";
import { ResizeObserver } from "@juggle/resize-observer";

/**
 * `responsive-utility`
 * A singleton that manages responsive resize events for elements that invoke it.
 *
 * @element responsive-utility
 * @extends IronResizableBehavior
 * @demo ./index.html
 */

globalThis.ResponsiveUtility = {};

globalThis.ResponsiveUtility.instance = null;
class ResponsiveUtility extends LitElement {
  render() {
    return html` <slot></slot> `;
  }
  static get tag() {
    return "responsive-utility";
  }

  /**
   * adds a responsive element to the details array
   *
   * @param {event} e event to add responsive element
   * @memberof ResponsiveUtility
   */
  responiveElementEvent(e) {
    let detail = {
      element: e.detail.element,
      attribute: e.detail.attribute || "responsive-size",
      sm: e.detail.sm || 900,
      md: e.detail.md || 1200,
      lg: e.detail.lg || 1500,
      xl: e.detail.xl || 1800,
      custom: e.detail.custom || "responsive-width",
    };
    detail.observer = this._getObserver(detail);
    detail.observer.observe(detail.element);
    this.details.push(detail);
    globalThis.ResponsiveUtility.setSize(detail);
  }

  _getObserver(detail) {
    return new ResizeObserver((en) =>
      en.forEach((e) =>
        globalThis.ResponsiveUtility.setSize(
          detail,
          e.contentBoxSize || e.borderBoxSize || e.contentRect || e.target
            ? e.target.offsetWidth
            : 0,
        ),
      ),
    );
  }
  /**
   * deletes the responsive element from the details array
   * @param {event} e event to add responsive element
   */
  deleteResponiveElementEvent(e) {
    this.details = this.details.filter((detail) => e.detail !== detail);
  }
  /**
   * An array of objects. Each object is contains data about an element
   * that will be updated with responsive values.
   *
   * To add an element to this array, fire a 'responsive-element' event
   * with the following data:
   *
   * {
   *   "element": (the element itself),
   *   "attribute": (the attribute that will be set with the size),
   *   "sm": (optional custom sm breakpoint, default is 900),
   *   "md": (optional custom md breakpoint, default is 1200),
   *   "lg": (optional custom lg breakpoint, default is 1500),
   *   "xl": (optional custom xl breakpoint, default is 1800),
   * }
   *
   */
  /**
   * Makes sure there is a utility ready and listening for elements.
   */
  constructor() {
    super();
    this.details = [];
    globalThis.addEventListener(
      "responsive-element",
      this.responiveElementEvent.bind(this),
    );

    /* handle element deregistration */
    globalThis.addEventListener(
      "delete-responsive-element",
      this.deleteResponiveElementEvent.bind(this),
    );
    if (globalThis.ResponsiveUtility.instance == null)
      globalThis.ResponsiveUtility.instance = this;
  }
}
customElements.define(ResponsiveUtility.tag, ResponsiveUtility);
export { ResponsiveUtility };

/**
 * Checks to see if there is an instance available, and if not appends one
 */
globalThis.ResponsiveUtility.requestAvailability = () => {
  if (
    globalThis.ResponsiveUtility.instance == null &&
    globalThis.document &&
    globalThis.document.body
  ) {
    globalThis.ResponsiveUtility.instance =
      globalThis.document.createElement("responsive-utility");
    globalThis.document.body.appendChild(globalThis.ResponsiveUtility.instance);
  }
  return globalThis.ResponsiveUtility.instance;
};
/**
 * Sets responsive size based on detail provided by reponsive element
 * @param {object} detail object with element details, as in {
 *   "element": (the element itself),
 *   "attribute": (the attribute that will be set with the size),
 *   "sm": (optional custom sm breakpoint, default is 900),
 *   "md": (optional custom md breakpoint, default is 1200),
 *   "lg": (optional custom lg breakpoint, default is 1500),
 *   "xl": (optional custom xl breakpoint, default is 1800),
 * }
 */
globalThis.ResponsiveUtility.setSize = (detail, width = 0) => {
  let size,
    el = detail.element,
    attr = detail.attribute,
    custom = detail.custom;
  if (width < detail.sm) {
    size = "xs";
  } else if (width < detail.md) {
    size = "sm";
  } else if (width < detail.lg) {
    size = "md";
  } else if (width < detail.xl) {
    size = "lg";
  } else {
    size = "xl";
  }
  if (!el.getAttribute(custom) || width !== el.getAttribute(custom))
    el.setAttribute(custom, width);
  if (!el.getAttribute(attr) || size !== el.getAttribute(attr))
    el.setAttribute(attr, size);
};

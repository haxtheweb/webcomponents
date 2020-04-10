import { LitElement, html, css } from "lit-element/lit-element.js";
import { ResizeObserver } from "@juggle/resize-observer";

/**
 * `responsive-utility`
 * A singleton that manages responsive resize events for elements that invoke it.
 *
 * @element responsive-utility
 * @extends IronResizableBehavior
 * @demo ./index.html
 */

window.ResponsiveUtility = {};

window.ResponsiveUtility.instance = null;
class ResponsiveUtility extends LitElement {
  render() {
    return html`
      <slot></slot>
    `;
  }
  static get tag() {
    return "responsive-utility";
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * Array of details provided by responsive elements
       */
      details: {
        type: Array
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    /* handle element registration */
    window.addEventListener(
      "responsive-element",
      this.responiveElementEvent.bind(this)
    );
    /* handle element deregistration */
    window.addEventListener(
      "delete-responsive-element",
      this.deleteResponiveElementEvent.bind(this)
    );
  }
  disconnectedCallback() {
    window.removeEventListener(
      "responsive-element",
      this.responiveElementEvent.bind(this)
    );
    /* handle element deregistration */
    window.removeEventListener(
      "delete-responsive-element",
      this.deleteResponiveElementEvent.bind(this)
    );
    super.disconnectedCallback();
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
      xl: e.detail.xl || 1800
    };
    detail.observer = this._getObserver(detail);
    detail.observer.observe(detail.element);
    this.details.push(detail);
    window.ResponsiveUtility.setSize(detail);
  }

  _getObserver(detail) {
    return new ResizeObserver(en =>
      en.forEach(e =>
        window.ResponsiveUtility.setSize(
          detail,
          e.contentBoxSize || e.borderBoxSize || e.contentRect || e.target
            ? e.target.offsetWidth
            : 0
        )
      )
    );
  }
  /**
   * deletes the responsive element from the details array
   * @param {event} e event to add responsive element
   */
  deleteResponiveElementEvent(e) {
    this.details = this.details.filter(detail => e.detail !== detail);
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
    if (window.ResponsiveUtility.instance == null)
      window.ResponsiveUtility.instance = this;
  }
}
window.customElements.define(ResponsiveUtility.tag, ResponsiveUtility);
export { ResponsiveUtility };

/**
 * Checks to see if there is an instance available, and if not appends one
 */
window.ResponsiveUtility.requestAvailability = () => {
  if (window.ResponsiveUtility.instance == null) {
    window.ResponsiveUtility.instance = document.createElement(
      "responsive-utility"
    );
  }
  document.body.appendChild(window.ResponsiveUtility.instance);
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
window.ResponsiveUtility.setSize = (detail, width = 0) => {
  let size,
    el = detail.element,
    attr = detail.attribute;
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
  if (!el.getAttribute(attr) || size !== el.getAttribute(attr))
    el.setAttribute(attr, size);
};

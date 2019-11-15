import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import * as async from "@polymer/polymer/lib/utils/async.js";
import { IronResizableBehavior } from "@polymer/iron-resizable-behavior/iron-resizable-behavior.js";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class.js";
window.ResponsiveUtility = {};
window.ResponsiveUtility.instance = null;
class ResponsiveUtility extends mixinBehaviors(
  [IronResizableBehavior],
  PolymerElement
) {
  static get template() {
    return html`
      <style>
        :host {
          display: inline;
        }
      </style>
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
       * Stores
       */
      details: {
        type: Array,
        value: []
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      this.addEventListener("iron-resize", this._onIronResize.bind(this));
    });
  }
  disconnectedCallback() {
    let root = this;
    this.removeEventListener("iron-resize", this._onIronResize.bind(this));
    window.removeEventListener("responsive-element", e => {
      let detail = {
        element: e.detail.element,
        attribute:
          e.detail.attribute !== undefined && e.detail.attribute !== null
            ? e.detail.attribute
            : "responsive-size",
        relativeToParent:
          e.detail.relativeToParent !== undefined &&
          e.detail.relativeToParent !== null
            ? e.detail.relativeToParent
            : true,
        sm:
          e.detail.sm !== undefined && e.detail.sm !== null ? e.detail.sm : 900,
        md:
          e.detail.md !== undefined && e.detail.md !== null
            ? e.detail.md
            : 1200,
        lg:
          e.detail.lg !== undefined && e.detail.lg !== null
            ? e.detail.lg
            : 1500,
        xl:
          e.detail.xl !== undefined && e.detail.xl !== null ? e.detail.lg : 1800
      };
      if ("ResizeObserver" in window && detail.relativeToParent === true) {
        let resize = new ResizeObserver(function() {
            window.ResponsiveUtility.setSize(detail);
          }),
          observable =
            e.detail.parentNode !== undefined && e.detail.parentNode !== null
              ? e.detail.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE
                ? e.detail.element.parentNode.host
                : e.detail.element.parentNode
              : e.detail.element;
        resize.observe(observable);
      }
      root.push("details", detail);
      window.ResponsiveUtility.setSize(detail);
    });
    /* handle element deregistration */
    window.removeEventListener("delete-responsive-element", e => {
      for (let i = 0; i < this.details.length; i++) {
        if (e.detail === detail[i]) root.splice("details", i, 1);
      }
    });
    super.disconnectedCallback();
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
   *   "relativeToParent": (true for @element query instead of @media query),
   *   "sm": (optional custom sm breakpoint, default is 600),
   *   "md": (optional custom md breakpoint, default is 900),
   *   "lg": (optional custom lg breakpoint, default is 1200),
   *   "xl": (optional custom xl breakpoint, default is 1500),
   * }
   *
   */
  /**
   * Makes sure there is a utility ready and listening for elements.
   */
  constructor() {
    super();
    let root = this;
    if (window.ResponsiveUtility.instance == null) {
      window.ResponsiveUtility.instance = root;
    }
    /* handle element registration */
    window.addEventListener("responsive-element", e => {
      let detail = {
        element: e.detail.element,
        attribute:
          e.detail.attribute !== undefined && e.detail.attribute !== null
            ? e.detail.attribute
            : "responsive-size",
        relativeToParent:
          e.detail.relativeToParent !== undefined &&
          e.detail.relativeToParent !== null
            ? e.detail.relativeToParent
            : true,
        sm:
          e.detail.sm !== undefined && e.detail.sm !== null ? e.detail.sm : 900,
        md:
          e.detail.md !== undefined && e.detail.md !== null
            ? e.detail.md
            : 1200,
        lg:
          e.detail.lg !== undefined && e.detail.lg !== null
            ? e.detail.lg
            : 1500,
        xl:
          e.detail.xl !== undefined && e.detail.xl !== null ? e.detail.lg : 1800
      };
      if ("ResizeObserver" in window && detail.relativeToParent === true) {
        let resize = new ResizeObserver(function() {
            window.ResponsiveUtility.setSize(detail);
          }),
          observable =
            e.detail.parentNode !== undefined && e.detail.parentNode !== null
              ? e.detail.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE
                ? e.detail.element.parentNode.host
                : e.detail.element.parentNode
              : e.detail.element;
        resize.observe(observable);
      }
      root.push("details", detail);
      window.ResponsiveUtility.setSize(detail);
    });
    /* handle element deregistration */
    window.addEventListener("delete-responsive-element", e => {
      for (let i = 0; i < this.details.length; i++) {
        if (e.detail === detail[i]) root.splice("details", i, 1);
      }
    });
  }

  /**
   * On resize, sets sizes of any detail element that has changed.
   */
  _onIronResize() {
    for (let i = 0; i < this.details.length; i++) {
      window.ResponsiveUtility.setSize(this.details[i]);
    }
  }
}
window.customElements.define(ResponsiveUtility.tag, ResponsiveUtility);
export { ResponsiveUtility };

/**
 * Checks to see if there is an instance available, and if not appends one
 */
window.ResponsiveUtility.requestAvailability = function() {
  if (window.ResponsiveUtility.instance == null) {
    window.ResponsiveUtility.instance = document.createElement(
      "responsive-utility"
    );
  }
  document.body.appendChild(window.ResponsiveUtility.instance);
};
/**
 * Sets responsive size of detail.
 */
window.ResponsiveUtility.setSize = function(detail) {
  let size,
    width = window.ResponsiveUtility._getWidth(detail);
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
  if (
    detail.element.getAttribute(detail.attribute) === undefined ||
    size !== detail.element.getAttribute(detail.attribute)
  ) {
    detail.element.setAttribute(detail.attribute, size);
  }
};
/**
 * Returns width of detail.
 *
 * @param {object} the HTML element to check
 * @returns {number} the width of the element or its parent node
 */
window.ResponsiveUtility._getWidth = function(detail) {
  let el = detail.element;
  if (detail.relativeToParent === true) {
    if (
      el.offsetWidth !== undefined &&
      el.offsetWidth !== null &&
      el.offsetWidth > 0
    ) {
      return el.offsetWidth;
    } else if (el.parentNode !== null) {
      return el.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE
        ? el.parentNode.host.offsetWidth
        : el.parentNode.offsetWidth;
    }
  }
  return window.outerWidth;
};

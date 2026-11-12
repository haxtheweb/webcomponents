/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html } from "lit";

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
      // fallback mirrors DDDBreakpoints (d-d-d/lib/DDDLayout.js); kept as
      // literals so this utility never requires the DDD stack
      sm: e.detail.sm || 600,
      md: e.detail.md || 900,
      lg: e.detail.lg || 1200,
      xl: e.detail.xl || 1440,
      custom: e.detail.custom || "responsive-width",
    };
    // one registration per element: a second one replaces the first rather
    // than stacking another ResizeObserver on the same element
    if (detail.element) {
      this.deleteResponiveElementEvent({
        detail: { element: detail.element },
      });
    }
    detail.observer = this._getObserver(detail);
    if (detail.observer && detail.element) {
      detail.observer.observe(detail.element);
    }
    this.details.push(detail);
    globalThis.ResponsiveUtility.setSize(
      detail,
      detail.element ? detail.element.offsetWidth : 0,
    );
  }

  _getObserver(detail) {
    if (typeof globalThis.ResizeObserver !== "function") {
      return null;
    }
    return new globalThis.ResizeObserver((entries) =>
      entries.forEach((entry) => {
        const width =
          entry && entry.contentRect && entry.contentRect.width
            ? entry.contentRect.width
            : entry && entry.target
              ? entry.target.offsetWidth
              : 0;
        globalThis.ResponsiveUtility.setSize(detail, width);
      }),
    );
  }
  __handleResizeFallback() {
    this.details.forEach((detail) => {
      if (detail && detail.element) {
        globalThis.ResponsiveUtility.setSize(
          detail,
          detail.element.offsetWidth || 0,
        );
      }
    });
  }
  /**
   * deletes the responsive element from the details array
   * @param {event} e event to add responsive element
   */
  deleteResponiveElementEvent(e) {
    let detailsToDelete = this.details.filter((detail) => {
      if (e.detail === detail) {
        return true;
      }
      if (e.detail && e.detail.element && detail.element === e.detail.element) {
        return true;
      }
      if (e.detail === detail.element) {
        return true;
      }
      return false;
    });
    detailsToDelete.forEach((detail) => {
      if (detail.observer && detail.element) {
        detail.observer.unobserve(detail.element);
      }
      if (detail.observer) {
        detail.observer.disconnect();
      }
    });
    this.details = this.details.filter(
      (detail) => !detailsToDelete.includes(detail),
    );
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
    this.__resizeFallbackHandler = this.__handleResizeFallback.bind(this);
    if (typeof globalThis.ResizeObserver !== "function") {
      if (globalThis.addEventListener) {
        globalThis.addEventListener &&
          globalThis.addEventListener("resize", this.__resizeFallbackHandler);
      }
    }
    if (globalThis.addEventListener) {
      globalThis.addEventListener &&
        globalThis.addEventListener(
          "responsive-element",
          this.responiveElementEvent.bind(this),
        );
    }

    /* handle element deregistration */
    globalThis.addEventListener &&
      globalThis.addEventListener(
        "delete-responsive-element",
        this.deleteResponiveElementEvent.bind(this),
      );
    if (globalThis.ResponsiveUtility.instance == null)
      globalThis.ResponsiveUtility.instance = this;
  }
  disconnectedCallback() {
    if (this.__resizeFallbackHandler) {
      globalThis.removeEventListener("resize", this.__resizeFallbackHandler);
    }
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
  }
}
globalThis.customElements.define(ResponsiveUtility.tag, ResponsiveUtility);
export { ResponsiveUtility };

// What each element registered with, so it can register again after being
// moved or re-added. Weak: holds nothing alive on its own.
const registrations = new WeakMap();

/**
 * Register an element for responsive sizing (fires `responsive-element`) and
 * remember the request. Pair with unregisterResponsiveElement in
 * disconnectedCallback and reregisterResponsiveElement in connectedCallback:
 * the utility keeps a ResizeObserver on every registered element, and that
 * observer keeps the element alive until it is unregistered.
 * @param {object} detail same shape as the `responsive-element` event detail
 * @param {object} [options]
 * @param {EventTarget} [options.target] where the event is dispatched
 *   (default globalThis)
 * @param {object} [options.eventInit] extra CustomEvent init such as
 *   bubbles / composed, for elements whose event contract includes them
 */
export function registerResponsiveElement(detail, options = {}) {
  if (!detail || !detail.element) {
    return;
  }
  // removed before a deferred registration ran: remember the request and
  // register when it is connected again, instead of observing a detached node
  if (detail.element.isConnected === false) {
    registrations.set(detail.element, {
      detail: detail,
      options: options,
      active: false,
    });
    return;
  }
  registrations.set(detail.element, {
    detail: detail,
    options: options,
    active: true,
  });
  // make sure the singleton exists and is listening before the event fires
  globalThis.ResponsiveUtility.requestAvailability();
  const target = options && options.target ? options.target : globalThis;
  const eventInit = options && options.eventInit ? options.eventInit : {};
  target.dispatchEvent(
    new CustomEvent("responsive-element", { ...eventInit, detail: detail }),
  );
}
/**
 * Stop observing an element (fires `delete-responsive-element`). Safe to call
 * for elements that never registered.
 * @param {HTMLElement} element
 */
export function unregisterResponsiveElement(element) {
  const record = registrations.get(element);
  if (!record || !record.active) {
    return;
  }
  record.active = false;
  globalThis.dispatchEvent(
    new CustomEvent("delete-responsive-element", {
      detail: { element: element },
    }),
  );
}
/**
 * Register again with the remembered request, if the element registered
 * before and was unregistered since (moved, or removed and re-added).
 * @param {HTMLElement} element
 */
export function reregisterResponsiveElement(element) {
  const record = registrations.get(element);
  if (!record || record.active) {
    return;
  }
  registerResponsiveElement(record.detail, record.options);
}
globalThis.ResponsiveUtility.registerResponsiveElement =
  registerResponsiveElement;
globalThis.ResponsiveUtility.unregisterResponsiveElement =
  unregisterResponsiveElement;
globalThis.ResponsiveUtility.reregisterResponsiveElement =
  reregisterResponsiveElement;

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
    if (globalThis.document && globalThis.document.body) {
      globalThis.document.body.appendChild(
        globalThis.ResponsiveUtility.instance,
      );
    }
  } else if (!globalThis.ResponsiveUtility.instance && globalThis.document) {
    // no body to attach to (server side render): a detached instance still
    // answers importers that use the singleton at import time
    globalThis.ResponsiveUtility.instance = new ResponsiveUtility();
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
  width = Math.round(width);
  // only write an attribute on a real change: the old loose comparison of
  // the rounded number against the attribute string was always unequal, so
  // every resize re-set both attributes and re-fired attribute changes
  if (el.getAttribute(custom) !== `${width}`) el.setAttribute(custom, width);
  if (el.getAttribute(attr) !== size) el.setAttribute(attr, size);
};

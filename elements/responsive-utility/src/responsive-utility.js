import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import * as async from "@polymer/polymer/lib/utils/async.js";
import { IronResizableBehavior } from "@polymer/iron-resizable-behavior/iron-resizable-behavior.js";

window.ResponsiveUtility = {};
window.ResponsiveUtility.instance = null;
Polymer({
  _template: html`
    <style>
      :host {
        display: inline;
      }
    </style>
    <slot></slot>
`,

  is: "responsive-utility",

  behaviors: [IronResizableBehavior],

  listeners: {
    "iron-resize": "_onIronResize"
  },

  properties: {
    /**
     * Stores
     */
    targets: {
      type: Array,
      value: []
    }
  },

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
  created: function() {
    let root = this;
    if (window.ResponsiveUtility.instance == null) {
      window.ResponsiveUtility.instance = root;
    }
    /* handle element registration */
    document.body.addEventListener("responsive-element", function(e) {
      let relative =
        e.detail.relativeToParent !== undefined &&
        e.detail.relativeToParent !== null
          ? e.detail.relativeToParent
          : true;
      if ("ResizeObserver" in window && relative.relativeToParent === true) {
        let parent = e.detail.element.parentNode,
          resize = new ResizeObserver(function() {
            window.ResponsiveUtility.setSize(e.detail);
          });
        if (parent.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
          parent = parent.host;
        }
        resize.observe(parent);
      }
      root.push("targets", e.detail);
      window.ResponsiveUtility.setSize(e.detail);
    });
    /* handle element deregistration */
    document.body.addEventListener("delete-responsive-element", function(e) {
      for (let i = 0; i < this.targets.length; i++) {
        if (e.detail === target[i]) root.splice("targets", i, 1);
      }
    });
  },

  /**
   * On resize, sets sizes of any target element that has changed.
   */
  _onIronResize: function() {
    for (let i = 0; i < this.targets.length; i++) {
      window.ResponsiveUtility.setSize(this.targets[i]);
    }
  }
});

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
 * Sets responsive size of target.
 */
window.ResponsiveUtility.setSize = function(target) {
  let element = target.element;
  let attribute =
    target.attribute !== undefined && target.attribute !== null
      ? target.attribute
      : "responsive-size";
  let size = window.ResponsiveUtility.getSize(target);
  if (
    element.getAttribute(attribute) === undefined ||
    size !== element.getAttribute(attribute)
  ) {
    element.setAttribute(attribute, size);
  }
};
/**
 * Returns responsive size of target.
 */
window.ResponsiveUtility.getSize = function(target) {
  let relative =
    target.relativeToParent !== undefined && target.relativeToParent !== null
      ? target.relativeToParent
      : true;
  let getWidth = function() {
      if (target.element.parentNode !== null && relative === true) {
        if (
          target.element.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE
        ) {
          return target.element.parentNode.host.offsetWidth;
        }
        return target.element.parentNode.offsetWidth;
      }
      return window.outerWidth;
    },
    testBreakpoint = function(width, breakpoint, def) {
      let val =
        breakpoint !== undefined && breakpoint !== null ? breakpoint : def;
      return width < val;
    },
    size,
    width = getWidth();
  if (testBreakpoint(width, target.sm, 600)) {
    size = "xs";
  } else if (testBreakpoint(width, target.md, 900)) {
    size = "sm";
  } else if (testBreakpoint(width, target.lg, 1200)) {
    size = "md";
  } else if (testBreakpoint(width, target.xl, 1200)) {
    size = "lg";
  } else {
    size = "xl";
  }
  return size;
};

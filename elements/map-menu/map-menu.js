/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/smooth-scroll/smooth-scroll.js";
import "./lib/map-menu-container.js";
import "./lib/map-menu-builder.js";
/**
 * `map-menu`
 * `A series of elements that generate a hierarchical menu`
 *
 * @demo demo/index.html
 */
let MapMenu = Polymer({
  _template: html`
    <style>
      :host {
        --map-menu-active-color: rgba(0, 0, 0, 0.1);
        display: block;
        overflow-y: scroll;
        position: relative;
        height: 100%;
      }

      #activeIndicator {
        background: var(--map-menu-active-color);
        transition: all 0.3s ease-in-out;
        position: absolute;
      }

      map-menu-container {
        padding: 32px;
        @apply --map-menu-container;
      }

      /* turn default active color if indicator is on */
      :host([active-indicator]) map-menu-builder {
        --map-menu-active-color: transparent;
      }
    </style>
    <div id="itemslist">
      <map-menu-container>
        <div id="activeIndicator"></div>
        <map-menu-builder id="builder" items="[[items]]"></map-menu-builder>
      </map-menu-container>
    </div>
    <smooth-scroll id="smoothScroll"></smooth-scroll>
  `,

  is: "map-menu",

  properties: {
    title: {
      type: String,
      value: "Content Outline"
    },
    data: {
      type: Array,
      value: null
    },
    /**
     * Support for JSON Outline Schema manifest format
     */
    manifest: {
      type: Object,
      notify: true,
      observer: "_manifestChanged"
    },
    items: {
      type: Array,
      value: null,
      notify: true
    },
    /**
     * Current selected item.
     */
    selected: {
      type: String,
      notify: true,
      observer: "__selectedChanged"
    },
    /**
     * Auto scroll an active element if not in view
     */
    autoScroll: {
      type: Boolean,
      value: false
    },
    /**
     * Show active indicator animation
     */
    activeIndicator: {
      type: Boolean,
      value: false
    }
  },

  observers: ["_dataChanged(data)"],

  listeners: {
    "link-clicked": "__linkClickedHandler",
    "child-attached": "__childAttached",
    "toggle-updated": "__toggleUpdated"
  },

  __selectedChanged: function(newSelected, oldSelected) {
    if (newSelected !== oldSelected) {
      this.refreshActiveChildren(newSelected);
    }
  },

  /**
   * Set and unset active properties on children
   * @param {string} activeItem
   * @param {number} timeoutTime
   */
  refreshActiveChildren: function(activeItem, timeoutTime = 100) {
    // find active items and unactivate them
    const oldActiveItem = this.querySelector("[active]");

    if (activeItem && activeItem !== "") {
      const newActiveItem = this.querySelector(`#${activeItem}`);
      if (newActiveItem) {
        // set the new active attribute to the item
        newActiveItem.setAttribute("active", true);
        // move the highlight thingy
        if (this.activeIndicator) {
          this.__updateActiveIndicator(newActiveItem, timeoutTime);
        }
        // if auto scroll enabled then scroll element into view
        if (this.autoScroll) {
          // kick off smooth scroll
          this.$.smoothScroll.scroll(newActiveItem, {
            duration: 300,
            scrollElement: this
          });
        }
      }
    }

    if (oldActiveItem) {
      oldActiveItem.removeAttribute("active");
    }
  },

  _manifestChanged: function(newValue, oldValue) {
    if (newValue) {
      this.set("data", newValue.items);
    }
  },
  /**
   * Set data property
   */
  setData: function(data) {
    this.set("data", []);
    this.set("data", data);
  },

  /**
   * Convert data from a linear array
   * to a nested array for template rendering
   */
  _dataChanged: function(data) {
    const items = [];
    if (!data) return;
    // find parents
    data.forEach(element => {
      // find top level parents
      if (!element.parent) {
        items.push(element);
      }
    });
    // Recursively find and set children
    items.forEach((item, i) => {
      this._setChildren(item, data);
    });
    // Update items array
    this.set("items", []);
    this.set("items", items);
  },

  /**
   * Recursively search through a data to find children
   * of a specified item.
   * @param {object} item item of an array to search on. Passed by reference.
   * @param {array} data linear array of the data set.
   * @return {void}
   */
  _setChildren: function(item, data) {
    // find all children
    const children = data.filter(d => item.id === d.parent);
    item.children = children;
    if (item.children.length > 0) {
      item.children.forEach(child => {
        // recursively call itself
        this._setChildren(child, data);
      });
    }
  },

  /**
   * Determine if a menu item has children
   */
  __hasChildren: function(item) {
    return item.children.length > 0;
  },

  /**
   * asdf
   */
  __linkClickedHandler: function(e) {
    this.selected = e.detail.id;
    this.fire("selected", e.detail.id);
  },

  /**
   * When the children are attached find out if they
   * have the same id as a selected and
   */
  __childAttached: function(e) {
    const childId = e.detail.id;
    if (childId === this.selected) {
      this.refreshActiveChildren(this.selected);
    }
  },

  /**
   * When a user clicks the toggle button to collapse or
   * expand a submenu, this event gets triggered after
   * the animation has been triggered
   */
  __toggleUpdated: function(e) {
    this.refreshActiveChildren(this.selected, 300);
  },

  /**
   * Find out if
   */
  __isInViewport: function(element) {
    const scrollParent = this.__getScrollParent(element);
    if (!scrollParent) return false;

    var elementTop = element.offsetTop;
    var elementBottom = elementTop + element.offsetHeight;
    var viewportTop = scrollParent.offsetTop;
    var viewportBottom = viewportTop + scrollParent.offsetHeight;
    return elementBottom > viewportTop && elementTop < viewportBottom;
  },

  /**
   * Get scroll parent
   */
  __getScrollParent: function(node) {
    if (node == null) {
      return null;
    }

    if (node.scrollHeight > node.clientHeight) {
      return node;
    } else {
      return this.__getScrollParent(node.parentNode);
    }
  },

  /**
   * Move the highlight widget over active element
   */
  __updateActiveIndicator: function(element, timeoutTime = 100) {
    // run it through to set time just to let stuff set up
    setTimeout(() => {
      const activeIndicator = this.$.activeIndicator;
      const elementIsHidden = this.__parentsHidden(element);
      const left = element.offsetLeft;
      const bottom = element.offsetBottom;
      const top = element.offsetTop;
      const width = element.offsetWidth;
      // if the element is hidden the set the indicator height to zero to make it disapear
      const height = !elementIsHidden ? element.offsetHeight : 0;
      // if the height is zero then make the timeoutTime faster
      timeoutTime = height > 0 ? timeoutTime : 10;
      activeIndicator.setAttribute(
        "style",
        `width:${width}px;height:${height}px;top:${top}px;left:${left}px`
      );
    }, timeoutTime);
  },

  /**
   * Find out if any parents of the item are collapsed
   */
  __parentsHidden: function(node) {
    // get the parent node
    const parent = node.parentNode;
    // bail if we have no node to work with
    if (parent == null) return null;
    // if we found a submenu check if it is hidden
    if (parent.tagName === "MAP-MENU-SUBMENU") {
      // if open is set to false then we have
      // found a hidden parent
      if (!parent.opened) return true;
    }
    // wrap up and exit if we came all the way back to map-menu
    if (parent.tagName === "MAP-MENU") return false;
    // if we got all the way here then we need recursively run this
    // against the parent node
    return this.__parentsHidden(parent);
  }
});
export { MapMenu };

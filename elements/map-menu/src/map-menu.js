/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import "@lrnwebcomponents/smooth-scroll/smooth-scroll.js";
import "@lrnwebcomponents/map-menu/lib/map-menu-builder.js";

/**
 * `map-menu`
 * `A series of elements that generate a hierarchical menu`
 *
 * @demo demo/index.html
 */
class MapMenu extends PolymerElement {
  constructor() {
    super();
    import("@lrnwebcomponents/map-menu/lib/map-menu-container.js");
  }
  static get template() {
    return html`
      <style>
        :host {
          --map-menu-active-color: rgba(0, 0, 0, 0.1);
          --map-menu-size: 1;
          --map-menu-font-size: 16px;
          display: block;
          overflow-y: scroll;
          position: relative;
          height: 100%;
          transition: 0.2s linear all;
          opacity: 1;
          background-color: transparent;
        }

        #itemslist {
          @apply --map-menu-items-list;
        }

        #activeIndicator {
          background: var(--map-menu-active-color);
          transition: all 0.3s ease-in-out;
          position: absolute;
          @apply --map-menu-active-indicator;
        }

        map-menu-container {
          padding: var(--map-menu-container-padding, 0);
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
          <map-menu-builder
            id="builder"
            items="[[items]]"
            selected="[[selected]]"
          ></map-menu-builder>
        </map-menu-container>
      </div>
      <smooth-scroll id="smoothScroll"></smooth-scroll>
    `;
  }

  static get tag() {
    return "map-menu";
  }

  static get properties() {
    return {
      disabled: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
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
        notify: true
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
    };
  }
  ready() {
    super.ready();
    afterNextRender(this, function() {
      this.addEventListener(
        "link-clicked",
        this.__linkClickedHandler.bind(this)
      );
      this.addEventListener("toggle-updated", this.__toggleUpdated.bind(this));
      this.addEventListener("active-item", this.__activeItemHandler.bind(this));
      this.addEventListener(
        "map-meu-item-hidden-check",
        this._mapMeuItemHiddenCheckHandler.bind(this)
      );
    });
  }
  static get observers() {
    return ["_dataChanged(data)"];
  }
  __activeItemHandler(e) {
    const target = e.detail;
    this.refreshActiveChildren(target);
  }

  _mapMeuItemHiddenCheckHandler(e) {
    const action = e.detail.action;
    const target = e.detail.target;
    const hiddenChild = e.detail.hiddenChild;
    if (action === "closed" && hiddenChild === true) {
      this.__updateActiveIndicator(this._activeItem, 200, true);
    } else {
      this.__updateActiveIndicator(this._activeItem, 200, false);
    }
  }

  /**
   * Set and unset active properties on children
   * @param {string} activeItem
   * @param {number} timeoutTime
   */
  refreshActiveChildren(activeItem, timeoutTime = 200) {
    const oldActiveItem = this._activeItem;
    const newActiveItem = activeItem;

    if (newActiveItem && newActiveItem !== "") {
      // set the new active attribute to the item
      newActiveItem.setAttribute("active", true);
      // move the highlight thingy
      if (this.activeIndicator) {
        this.__updateActiveIndicator(newActiveItem, timeoutTime);
      }
      // if auto scroll enabled then scroll element into view
      if (this.autoScroll) {
        // kick off smooth scroll
        this.shadowRoot.querySelector("#smoothScroll").scroll(newActiveItem, {
          duration: 300,
          scrollElement: this
        });
      }
    }

    if (oldActiveItem) {
      oldActiveItem.removeAttribute("active");
      this.__updateActiveIndicator(newActiveItem, timeoutTime);
    }

    this._activeItem = newActiveItem;
  }

  _manifestChanged(newValue, oldValue) {
    if (newValue) {
      this.set("data", newValue.items);
    }
  }

  /**
   * Set data property
   */
  setData(data) {
    this.set("data", []);
    this.set("data", data);
  }

  /**
   * Convert data from a linear array
   * to a nested array for template rendering
   */
  _dataChanged(data) {
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
  }

  /**
   * Recursively search through a data to find children
   * of a specified item.
   * @param {object} item item of an array to search on. Passed by reference.
   * @param {array} data linear array of the data set.
   * @return {void}
   */
  _setChildren(item, data) {
    // find all children
    const children = data.filter(d => item.id === d.parent);
    item.children = children;
    if (item.children.length > 0) {
      item.children.forEach(child => {
        // recursively call itself
        this._setChildren(child, data);
      });
    }
  }

  /**
   * Determine if a menu item has children
   */
  __hasChildren(item) {
    return item.children.length > 0;
  }

  /**
   * asdf
   */
  __linkClickedHandler(e) {
    this.selected = e.detail.id;
    this.dispatchEvent(
      new CustomEvent("selected", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: e.detail.id
      })
    );
  }

  /**
   * When a user clicks the toggle button to collapse or
   * expand a submenu, this event gets triggered after
   * the animation has been triggered
   */
  __toggleUpdated(e) {
    const action = e.detail.opened ? "opened" : "closed";
    const target = e.path[0];
    if (typeof this._activeItem !== "undefined") {
      this._activeItem.dispatchEvent(
        new CustomEvent("map-menu-item-hidden-check", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: Object.assign(
            {},
            {
              action: action,
              target: target
            }
          )
        })
      );
    }
  }

  /**
   * Find out if
   */
  __isInViewport(element) {
    const scrollParent = this.__getScrollParent(element);
    if (!scrollParent) return false;

    var elementTop = element.offsetTop;
    var elementBottom = elementTop + element.offsetHeight;
    var viewportTop = scrollParent.offsetTop;
    var viewportBottom = viewportTop + scrollParent.offsetHeight;
    return elementBottom > viewportTop && elementTop < viewportBottom;
  }

  /**
   * Get scroll parent
   */
  __getScrollParent(node) {
    if (node == null) {
      return null;
    }

    if (node.scrollHeight > node.clientHeight) {
      return node;
    } else {
      return this.__getScrollParent(node.parentNode);
    }
  }

  /**
   * Move the highlight widget over active element
   */
  __updateActiveIndicator(element, timeoutTime = 200, hidden = false) {
    // run it through to set time just to let stuff set up
    setTimeout(() => {
      const activeIndicator = this.shadowRoot.querySelector("#activeIndicator");
      const left = element.offsetLeft;
      const bottom = element.offsetBottom;
      const top = element.offsetTop;
      const width = element.offsetWidth;
      // if the element is hidden the set the indicator height to zero to make it disapear
      const height = !hidden ? element.offsetHeight : 0;
      // if the height is zero then make the timeoutTime faster
      timeoutTime = height > 0 ? timeoutTime : 10;
      activeIndicator.setAttribute(
        "style",
        `width:${width}px;height:${height}px;top:${top}px;left:${left}px`
      );
    }, timeoutTime);
  }
  /**
   * Find out if any parents of the item are collapsed
   */
  __parentsHidden(node) {
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
}
window.customElements.define(MapMenu.tag, MapMenu);
export { MapMenu };

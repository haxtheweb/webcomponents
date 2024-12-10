/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import "@haxtheweb/map-menu/lib/map-menu-builder.js";
import "@haxtheweb/map-menu/lib/map-menu-container.js";
import { normalizeEventPath } from "@haxtheweb/utils/utils.js";

/**
 * `map-menu`
 * `A series of elements that generate a hierarchical menu`
 *
 * @demo demo/index.html
 * @element map-menu
 */
class MapMenu extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          --map-menu-item-icon-height: 18px;
          --map-menu-item-active-item-color: rgba(100, 100, 255, 0.1);
          --map-menu-item-button-height: 20px;
          --map-menu-item-height: 20px;
          --map-menu-gap: 10px;
          display: block;
          overflow-y: scroll;
          position: relative;
          height: 100%;
          transition: all 0.1s ease-in-out;
          opacity: 1;
          background-color: transparent;
        }
        :host([is-flex]){
          --map-menu-after-width: 0px;
          z-index: 100;
        }

        #itemslist {
          display: var(--map-menu-items-list-display);
          flex-direction: var(--map-menu-items-list-flex-direction);
          flex: var(--map-menu-items-list-flex);
        }
        #activeindicator {
          background: var(--map-menu-item-active-item-color);
          transition: all 0.1s ease-in-out;
          position: absolute;
          pointer-events: none;
          z-index: -1;
          width: calc(100% + (2 * var(--map-menu-gap)));
          margin-left: calc(-2 * var(--map-menu-gap));
        }

        /* Menu Conditions */
        /* Layer 1 */
        :host([is-flex]) map-menu-builder {
          width: 100%;
          position: absolute;
        }
        :host([is-flex][is-horizontal]) map-menu-builder {
          position: static;
        }
        :host([is-flex]) map-menu-builder .wrapper {
          background-color: var(--map-menu-parent-background-color);
          width: var(--map-menu-parent-width);
          padding: var(--map-menu-parent-padding);
          margin: var(--map-menu-parent-margin);
          position: relative;
          max-width: 100%;
        }
        :host([is-flex][is-horizontal]) map-menu-builder .wrapper {
          background-color: var(--map-menu-parent-background-color);
          width: var(--map-menu-parent-width, 100%);
          padding: var(--map-menu-parent-padding);
          margin: var(--map-menu-parent-margin);
          display: inline-flex;
          justify-content: center;
          align-items: center;
        }

        :host([is-flex]) map-menu-builder map-menu-item,
        :host([is-flex]) map-menu-builder map-menu-submenu {
          color: var(--map-menu-layer-1-font-color);
          padding: var(--map-menu-layer-1-padding);
          margin: var(--map-menu-layer-1-margin);
          --map-menu-text-transform: var(--map-menu-layer-1-text-transform, uppercase);
        }

        :host([is-flex][is-horizontal]) map-menu-builder map-menu-item,
        :host([is-flex][is-horizontal]) map-menu-builder map-menu-submenu {
          border-left: 0;

          color: var(--map-menu-layer-1-font-color);
          border-bottom: var(--map-menu-layer-1-bottom-border, 4px transparent solid);
        }

        :host([is-flex][is-horizontal]) map-menu-builder map-menu-submenu:hover,
        :host([is-flex][is-horizontal]) map-menu-builder map-menu-submenu:active,
        :host([is-flex][is-horizontal]) map-menu-builder map-menu-submenu:focus {
          border-bottom: var(--map-menu-layer-1-bottom-border-active, 4px transparent solid);
        }

        /* Layer 2 */
        :host([is-flex]) map-menu-builder map-menu-builder {
          position: static;
        }

        :host([is-flex]) map-menu-builder map-menu-builder .wrapper{
          padding: 0;
          margin: 0 12px;
        }

        :host([is-flex][is-horizontal]) map-menu-builder map-menu-builder  {
          position: absolute;
          left: 0;
          width: 100%;

          margin: var(--map-menu-layer-2-vertical-margin, 4px 0px);
          padding: var(--map-menu-layer-2-vertical-padding, 28px 0px 40px);
          background-color: var(--map-menu-layer-2-background-color, white);
        }

        :host([is-flex][is-horizontal]) map-menu-builder map-menu-builder .wrapper{
          background-color: transparent;
          max-width: 100%;
          display: grid;
          width: fit-content;
          grid-template-columns: repeat(4, 232px);
          grid-template-rows: repeat(10, min-content) 1fr;
          align-items: start;

          margin: var(--map-menu-layer-2-horizontal-margin, 0 auto);
          padding: var(--map-menu-layer-2-horizontal-padding, 0 46px);
        }

        map-menu-builder map-menu-builder map-menu-item,
        map-menu-builder map-menu-builder map-menu-submenu {
          border-left: 2px solid
            var(--map-menu-item-a-active-background-color, black);
          margin-left: calc(var(--map-menu-gap) + 2px);
        }

        :host([is-flex]) map-menu-builder map-menu-builder map-menu-item,
        :host([is-flex]) map-menu-builder map-menu-builder map-menu-submenu {
          border: none;
          margin: 0;
          padding: 0;

          color: var(--map-menu-layer-2-font-color, #262626);
          --map-menu-header-button-padding: 10px 20px;
          --map-menu-header-title-margin: 0;
          --map-menu-item-a-active-color: var(--map-menu-layer-2-active-color, #262626);
          --map-menu-text-transform: var(--map-menu-layer-2-text-transform, uppercase);
        }

        :host([is-flex][is-horizontal]) map-menu-builder map-menu-builder map-menu-item,
        :host([is-flex][is-horizontal]) map-menu-builder map-menu-builder map-menu-submenu {
          border: none;
          margin: none;
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;

          color: var(--map-menu-layer-2-font-color, #001e44);
          --map-menu-item-a-active-color: var(--map-menu-layer-2-active-color, #262626);
          --map-menu-text-transform: var(--map-menu-layer-2-text-transform, uppercase);
          --map-menu-font-weight: var(--map-menu-layer-2-font-weight, 700);
        }
         
        :host([is-flex][is-horizontal]) map-menu-builder map-menu-builder map-menu-submenu {
          order: 0;
          grid-row-end: span 20;
        }
        :host([is-flex][is-horizontal]) map-menu-builder map-menu-builder map-menu-builder map-menu-item:nth-child(n+10) {
          display: none;
        }
        :host([is-flex][is-horizontal]) map-menu-builder map-menu-builder map-menu-submenu ~ map-menu-item {
          align-self: start;
          order: 1;
          grid-auto-flow: row;
        }

        :host([is-flex][is-horizontal]) map-menu-builder map-menu-builder map-menu-submenu:hover,
        :host([is-flex][is-horizontal]) map-menu-builder map-menu-builder map-menu-submenu:active,
        :host([is-flex][is-horizontal]) map-menu-builder map-menu-builder map-menu-submenu:focus {
          border-bottom: var(--map-menu-layer-2-bottom-border-active, var(--map-menu-layer-1-bottom-border-active, none));
        }

        /* Layer 3 */
        :host([is-flex]) map-menu-builder map-menu-builder map-menu-builder {
          position: relative;
          background-color: transparent;
        }

        :host([is-flex][is-horizontal]) map-menu-builder map-menu-builder map-menu-builder  {
          position: relative;
          margin: 0;
          padding: 0;
        }

        :host([is-flex]) map-menu-builder map-menu-builder map-menu-builder .wrapper {          
          display: inline-flex;
          flex-direction: column;
          flex-wrap: wrap;
        }

        :host([is-flex][is-horizontal]) map-menu-builder map-menu-builder map-menu-builder .wrapper {          
          border-left: none;
          margin: 0;
          padding: 0;
          display: inline-flex;
          flex-direction: column;
          flex-wrap: wrap;

          margin: var(--map-menu-layer-3-horizontal-margin, none);
          padding: var(--map-menu-layer-3-horizontal-padding, none);
        }

        map-menu-builder map-menu-builder map-menu-builder map-menu-item,
        map-menu-builder map-menu-builder map-menu-builder map-menu-submenu {
          border-left: 2px solid
            var(--map-menu-item-a-active-background-color, black);
          margin-left: calc(var(--map-menu-gap) + 2px);
        }

        :host([is-flex]) map-menu-builder map-menu-builder map-menu-builder map-menu-item,
        :host([is-flex]) map-menu-builder map-menu-builder map-menu-builder map-menu-submenu {
          border: none;
          --map-menu-header-button-padding: 10px 20px;
        }

        :host([is-flex][is-horizontal]) map-menu-builder map-menu-builder map-menu-builder map-menu-item,
        :host([is-flex][is-horizontal]) map-menu-builder map-menu-builder map-menu-builder map-menu-submenu {
          --map-menu-text-transform: var(--map-menu-layer-3-text-transform, none);
          --map-menu-font-weight: var(--map-menu-layer-3-font-weight, 400);
          --map-menu-header-a-text-decoration-hover: var(--map-menu-layer-3-text-decoration, none);
          --map-menu-item-a-active-background-color: var(--map-menu-layer-3-active-background-color,#e4e5e7)
        }

        :host([is-flex][is-horizontal]) map-menu-builder map-menu-builder map-menu-builder map-menu-submenu:hover,
        :host([is-flex][is-horizontal]) map-menu-builder map-menu-builder map-menu-builder map-menu-submenu:active,
        :host([is-flex][is-horizontal]) map-menu-builder map-menu-builder map-menu-builder map-menu-submenu:focus {
          border-bottom: var(--map-menu-layer-3-bottom-border-active, var(--map-menu-layer-2-bottom-border-active, none));
        }

        /* Layer 4 */
        map-menu-builder
          map-menu-builder
          map-menu-builder
          map-menu-builder
          map-menu-item,
        map-menu-builder
          map-menu-builder
          map-menu-builder
          map-menu-builder
          map-menu-submenu {
          border-left: 2px solid
            var(--map-menu-item-a-active-background-color, black);
          margin-left: calc(var(--map-menu-gap) + 2px);
        }
        :host([is-flex]) map-menu-builder
          map-menu-builder
          map-menu-builder
          map-menu-builder
          map-menu-item,
        :host([is-flex]) map-menu-builder
          map-menu-builder
          map-menu-builder
          map-menu-builder
          map-menu-submenu {
          border-left: none;
          margin-left: none;
        }

        /* Layer 5 */
        map-menu-builder
          map-menu-builder
          map-menu-builder
          map-menu-builder
          map-menu-builder
          map-menu-item,
        map-menu-builder
          map-menu-builder
          map-menu-builder
          map-menu-builder
          map-menu-builder
          map-menu-submenu {
          border-left: 2px solid
            var(--map-menu-item-a-active-background-color, black);
          margin-left: calc(var(--map-menu-gap) + 2px);
        }
        :host([is-flex]) map-menu-builder
          map-menu-builder
          map-menu-builder
          map-menu-builder
          map-menu-builder
          map-menu-item,
        :host([is-flex]) map-menu-builder
          map-menu-builder
          map-menu-builder
          map-menu-builder
          map-menu-builder
          map-menu-submenu {
          border-left: none;
          margin-left: none;
        }

        map-menu-container {
          padding: var(--map-menu-container-padding, 0);
          display: var(--map-menu-container-display);
          flex-direction: var(--map-menu-container-flex-direction);
          flex: var(--map-menu-container-flex);
          background-color: var(--map-menu-container-background-color);
          color: var(--map-menu-container-color);
        }

        /* turn default active color if indicator is on */
        :host([active-indicator]) map-menu-builder {
          --map-menu-item-active-item-color: transparent;
        }
      `,
    ];
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.editControls = false;
    this.isFlex = false;
    this.isHorizontal = false;
    this.maxDepth = 5;
    this.disabled = false;
    this.title = "Content outline";
    this.data = null;
    this.items = [];
    this.autoScroll = false;
    this.activeIndicator = false;
    setTimeout(() => {
      this.addEventListener(
        "link-clicked",
        this.__linkClickedHandler.bind(this),
      );
      this.addEventListener("toggle-updated", this.__toggleUpdated.bind(this));
      this.addEventListener("active-item", this.__activeItemHandler.bind(this));
      this.addEventListener("opened-changed", this.__openChanged.bind(this));
      this.addEventListener(
        "map-meu-item-hidden-check",
        this._mapMeuItemHiddenCheckHandler.bind(this),
      );
    }, 0);
  }
  /**
   * LitElement life cycle - render
   */
  render() {
    return html`
      <div id="itemslist">
        <map-menu-container>
          <div id="activeindicator"></div>
          <map-menu-builder
            id="builder"
            ?edit-controls="${this.editControls}"
            ?is-horizontal="${this.isHorizontal}"
            max-depth="${this.maxDepth}"
            .items="${this.items}"
            .selected="${this.selected}"
          ></map-menu-builder>
        </map-menu-container>
      </div>
    `;
  }

  static get tag() {
    return "map-menu";
  }

  static get properties() {
    return {
      disabled: {
        type: Boolean,
        reflect: true,
      },
      editControls: {
        type: Boolean,
        attribute: "edit-controls",
      },
      isFlex: {
        type: Boolean,
        attribute: "is-flex",
      },
      isHorizontal: {
        type: Boolean,
        attribute: "is-horizontal",
        reflect: true,
      },
      maxDepth: {
        type: Number,
        attribute: "max-depth",
      },
      title: {
        type: String,
      },
      data: {
        type: Array,
      },
      /**
       * Support for JSON Outline Schema manifest format
       */
      manifest: {
        type: Object,
      },
      items: {
        type: Array,
      },
      /**
       * Current selected item.
       */
      selected: {
        type: String,
      },
      activeItem: {
        type: Object,
      },
      /**
       * Auto scroll an active element if not in view
       */
      autoScroll: {
        type: Boolean,
        attribute: "auto-scroll",
      },
      /**
       * Show active indicator animation
       */
      activeIndicator: {
        type: Boolean,
        reflect: true,
        attribute: "active-indicator",
      },
    };
  }
  /**
   * LitElement life cycle - properties changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "data") {
        this._dataChanged(this[propName]);
      }
      if (propName == "manifest") {
        this._manifestChanged(this[propName]);
      }
      if (propName == "activeItem") {
        this.refreshActiveChildren(this[propName], oldValue);
      }
      // notify
      if (["manifest", "items", "selected"].includes(propName)) {
        this.dispatchEvent(
          new CustomEvent(`${propName}-changed`, {
            detail: {
              value: this[propName],
            },
          }),
        );
      }
    });
  }

  /**
   * Listen for submenu collapse events and close all other submenus
   */
  __openChanged(e){
    e.stopImmediatePropagation();
    e.preventDefault();
    e.stopPropagation();
    if(this.shadowRoot && this.isHorizontal){
      this.shadowRoot.querySelectorAll('map-menu-submenu').forEach( submenu => {
        if(submenu.isNested == false){
          if(submenu.hovered == false){
            submenu.opened = false;
          }
        }
      });
    }
  }

  __activeItemHandler(e) {
    this.activeItem = e.detail;
  }

  _mapMeuItemHiddenCheckHandler(e) {
    const action = e.detail.action;
    const hiddenChild = e.detail.hiddenChild;
    if (action === "closed" && hiddenChild === true) {
      this.__updateActiveIndicator(this.activeItem, true);
    } else {
      this.__updateActiveIndicator(this.activeItem, false);
    }
  }

  /**
   * Set and unset active properties on children
   * @param {string} activeItem
   */
  refreshActiveChildren(newValue, oldValue) {
    if (newValue) {
      // set the new active attribute to the item
      newValue.setAttribute("active", "active");
      // move the highlight thingy
      if (this.activeIndicator) {
        this.__updateActiveIndicator(newValue);
      }
      // if auto scroll enabled then scroll element into view
      if (this.autoScroll) {
        // kick off smooth scroll
        this.__scrollHandler(newValue, {
          duration: 50,
          delay: 0,
          scrollElement: this,
        });
      }
    }

    if (oldValue) {
      oldValue.removeAttribute("active");
      this.__updateActiveIndicator(newValue);
    }
  }
  __scrollHandler(target, options) {
    // define default options
    const defaultOptions = {
      align: "top",
      delay: 0,
      duration: 300,
      scrollElement: window,
    };
    // combine default and user defined options
    const _options = Object.assign({}, defaultOptions, options);
    // get the bound client
    const targetPosition = target.getBoundingClientRect();
    // get the scroll Element position
    const scrollElementPosition =
      _options.scrollElement.getBoundingClientRect();
    // get the height of the scroll Element
    const scrollElementHeight =
      _options.scrollElement.getBoundingClientRect().bottom -
      _options.scrollElement.getBoundingClientRect().top;
    // get the height of the element target
    const targetHeight = targetPosition.bottom - targetPosition.top;
    // get the offset of the scroll Element
    const startPosition = _options.scrollElement.scrollTop;
    // get the distance between the top of the scroll and the top of the bounding rectangles
    let distance =
      target.getBoundingClientRect().top -
      _options.scrollElement.getBoundingClientRect().top;
    /**
     * @todo weird trick to position the scroll over the target
     * I'm still not sure why this works :)
     */
    distance = distance - scrollElementHeight / 2;
    // see where the user wants to align the scroll
    switch (_options.align) {
      case "center":
        distance = distance + targetHeight / 2;
        break;
      case "bottom":
        distance = distance + targetHeight;
        break;
      default:
        break;
    }
    // record start time
    let startTime = null;
    // internal animation function
    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      let timeElapsed = currentTime - startTime;
      let run = ease(timeElapsed, startPosition, distance, _options.duration);
      _options.scrollElement.scrollTop = run;
      if (timeElapsed < _options.duration) requestAnimationFrame(animation);
    }
    // define a ease-in-out
    function ease(t, b, c, d) {
      if ((t /= d / 2) < 1) return (c / 2) * t * t + b;
      return (-c / 2) * (--t * (t - 2) - 1) + b;
    }
    // start animation
    requestAnimationFrame(animation);
  }

  _manifestChanged(newValue) {
    if (newValue) {
      this.data = newValue.items;
    }
  }
  /**
   * Convert data from a linear array
   * to a nested array for template rendering
   */
  _dataChanged(data) {
    const items = [];
    if (!data) return;
    // find parents
    data.forEach((element) => {
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
    this.items = [...items];
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
    const children = data.filter((d) => item.id === d.parent);
    item.children = children;
    if (item.children.length > 0) {
      item.children.forEach((child) => {
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
        detail: e.detail.id,
      }),
    );
  }

  /**
   * When a user clicks the toggle button to collapse or
   * expand a submenu, this event gets triggered after
   * the animation has been triggered
   */
  __toggleUpdated(e) {
    const action = e.detail.opened ? "opened" : "closed";
    const target = normalizeEventPath(e)[0];
    if (typeof this.activeItem !== "undefined") {
      this.__updateActiveIndicator(this.activeItem, false);
      this.activeItem.dispatchEvent(
        new CustomEvent("map-menu-item-hidden-check", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: Object.assign(
            {},
            {
              action: action,
              target: target,
            },
          ),
        }),
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
  __updateActiveIndicator(element, hidden = false) {
    // run it through to set time just to let stuff set up
    setTimeout(() => {
      const activeindicator = this.shadowRoot.querySelector("#activeindicator");
      const top = element.offsetTop;
      // if the element is hidden the set the indicator height to zero to make it disapear
      const height = !hidden ? element.offsetHeight : 0;
      activeindicator.setAttribute("style", `height:${height}px;top:${top}px;`);
    }, 200);
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
customElements.define(MapMenu.tag, MapMenu);
export { MapMenu };

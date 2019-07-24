/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/responsive-utility/responsive-utility.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "./lib/a11y-tab.js";
/**
 * `a11y-tabs`
 * `accessible and responsive tabbed interface`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class A11yTabs extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "a11y-tabs";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    let root = this,
      callback = function(mutationsList, observer) {
        root.updateItems();
      };
    this.updateItems();
    this.__observer = new MutationObserver(callback);
    this.__observer.observe(this, {
      attributes: false,
      childList: true,
      subtree: false
    });
    this.addEventListener("a11y-tab-changed", function(e) {
      root.updateItems();
    });
    window.ResponsiveUtility.requestAvailability();
    this._breakpointChanged();
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    let root = this;
    if (this.__observer && this.__observer.disconnect)
      this.__observer.disconnect();
    this.removeEventListener("a11y-tab-changed", function(e) {
      root.updateItems();
    });
    window.dispatchEvent(
      new CustomEvent("responsive-element-deleted", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: root
      })
    );
    super.disconnectedCallback();
  }
  /**
   * selects a tab
   * @param {string} id the active tab's id
   */
  selectTab(id) {
    let tabs = this.querySelectorAll("a11y-tab"),
      selected =
        id && this.querySelector(`a11y-tab#${id}`)
          ? this.querySelector(`a11y-tab#${id}`)
          : this.querySelector("a11y-tab");
    if (selected && selected.id !== id) {
      this.activeTab = selected.id;
      return;
    } else if (tabs && tabs.length > 0) {
      tabs.forEach(tab => {
        tab.hidden = tab.id !== id;
      });
    }
  }
  /**
   * updates the list of items based on slotted a11y-tab elements
   */
  updateItems(e) {
    this.set("__items", []);
    let tabs = this.querySelectorAll("a11y-tab"),
      ctr = 1;
    this.__hasIcons = true;
    if (!this.id) this.id = this._generateUUID();
    if (tabs && tabs.length > 0)
      tabs.forEach(tab => {
        this.push("__items", {
          id: tab.id || `tab-${ctr}`,
          flag: tab.flag,
          flagIcon: tab.flagIcon,
          icon: tab.icon,
          label: tab.label || `Tab ${ctr}`
        });
        if (!tab.icon) this.__hasIcons = false;
        tab.__xOfY = `${ctr} of ${tabs.length}`;
        tab.__toTop = this.id;
      });
    this.selectTab(this.activeTab);
  }
  /**
   * Observer activeTab for changes
   * @param {string} newValue the new active tab's id
   */
  _activeTabChanged(newValue) {
    this.selectTab(newValue);
  }
  /**
   * handles any breakpoint changes
   * @param {event} e the tab change event
   */
  _breakpointChanged(e) {
    let root = this,
      v = this.layoutBreakpoint > -1 ? this.layoutBreakpoint : 0,
      i = this.iconBreakpoint > -1 ? this.iconBreakpoint : 0,
      sm = i > v ? v : i,
      md = i > v ? i : v,
      lg = Math.max(i, v) + 1,
      xl = Math.max(i, v) + 2;
    window.dispatchEvent(
      new CustomEvent("responsive-element-deleted", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: root
      })
    );
    window.dispatchEvent(
      new CustomEvent("responsive-element", {
        detail: {
          element: root,
          attribute: "responsive-size",
          relativeToParent: true,
          sm: sm,
          md: md,
          lg: lg,
          xl: xl
        }
      })
    );
  }
  /**
   * generates a unique id
   * @returns {string } unique id
   */
  _generateUUID() {
    return "ss-s-s-s-sss".replace(
      /s/g,
      Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    );
  }
  /**
   * handles a tab being tapped and sets the new active tab
   * @param {event} e the tab tap event
   */
  _handleTab(e) {
    if (e.model && e.model.__data && e.model.__data.tab)
      this.activeTab = e.model.__data.tab.id;
  }
  /**
   * ensures that there is always an id for this tabbed interface so that we can link back to the top of it
   * @param {string} newValue the new id
   * @param {string} oldValue the old id
   */
  _idChanged(newValue, oldValue) {
    if (!newValue) this.id = "a11y-tabs" + this._generateUUID();
  }
  /**
   * determines if a given tab is active
   * @param {string} id the tab's id
   * @param {string} activeTab the active tab's id
   * @returns {boolean} if a given tab is active
   */
  _isActiveTab(id, activeTab) {
    return id === activeTab;
  }
  /**
   * determines if tabs should be in a vertical layout
   * @param {number} icon breakpoint for icon-only view
   * @param {number} layout breakpoint for vertical layout
   * @param {string} size the responsive size
   * @returns {boolean} if tabs should be in a vertical layout
   */
  _isVertical(icon, layout, size) {
    return layout === -1 || icon > layout
      ? size === "xs"
      : size.indexOf("s") > -1;
  }
  /**
   * determines if tabs should show icons only
   * @param {boolean} hasIcons does every tab have an icon?
   * @param {number} icon breakpoint for icon-only view
   * @param {number} layout breakpoint for vertical layout
   * @param {string} size the responsive size
   * @returns {boolean} if tabs should be in a vertical layout
   */
  _showIcons(hasIcons, icon, layout, size) {
    return (
      hasIcons &&
      icon !== -1 &&
      (size === "xs" || (icon > layout && size === "sm"))
    );
  }
}
window.customElements.define(A11yTabs.tag, A11yTabs);
export { A11yTabs };

/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/responsive-utility/responsive-utility.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "./lib/a11y-tab.js";
/**
 * `a11y-tabs`
 * an accessible and responsive tabbed interface
 * 
### Styling

`<a11y-tabs>` provides the following custom properties
for styling:

#### General
Custom property | Description | Default
----------------|-------------|----------
`--a11y-tabs-border-color` | border | #ddd
`--a11y-tabs-color` | text color | #222
`--a11y-tabs-focus-color` | text color when focused | #000
`--a11y-tabs-margin` |  | 16px 0
`--a11y-tabs-width` | total width | 100%
`--a11y-tabs-height` | total height | unset
`--a11y-tabs-overflow` | default overflow | auto
`--a11y-tabs-overflow-x` | overflow of x-axis | `--a11y-tabs-overflow`
`--a11y-tabs-overflow-y` | overflow of y-axis | `--a11y-tabs-overflow`
`--a11y-tabs-border-radius` | default border radius | 2px
`--a11y-tabs-horizontal-border-radius` | border-radius when horizontal | `--a11y-tabs-border-radius`
`--a11y-tabs-vertical-border-radius` | border-radius when veritcal | `--a11y-tabs-border-radius`

#### Tab Section
Custom property | Description | Default
----------------|-------------|----------
`--a11y-tabs-background` | background for active tab and tab content | white
`--a11y-tabs-faded-background` | background inactive tabs | #eee
`--a11y-tabs-horizontal-background` | background for tabs container when horizontal | unset
`--a11y-tabs-vertical-background` | background for tabs container when vertical | `--a11y-tabs-border-color`
`--a11y-tabs-horizontal-sticky-background` | background for tabs container when sticky and horizontal | `--a11y-tabs-background`
`--a11y-tabs-justify-tabs` | tab justification | flex-start
`--a11y-tabs-vertical-justify-tabs` | tab justification when vertical | `--a11y-tabs-justify-tabs`
`--a11y-tabs-horizontal-justify-tabs` | tab justification when horizontal | `--a11y-tabs-justify-tabs`
`--a11y-tabs-wrap` | tab wrapping | unset
`--a11y-tabs-tab-height` | tab height | `--a11y-tabs-height`
`--a11y-tabs-button-padding` | padding for tabs | 8px
`--a11y-tabs-vertical-button-padding` | padding for tabs when vertical | `--a11y-tabs-button-padding`
`--a11y-tabs-horizontal-button-padding` | padding for tabs when horizontal | `--a11y-tabs-button-padding`

#### Content Section
Custom property | Description | Default
----------------|-------------|----------
`--a11y-tabs-content-padding` | padding for content of tab | 16px
`--a11y-tabs-content-background` | background color for content of tab | `--a11y-tabs-background`
 *
 * @demo ./demo/index.html
 * @demo ./demo/vertical.html Always Vertical
 * @demo ./demo/horizontal.html Always Horizontal
 * @customElement a11y-tabs
 */
class A11yTabs extends LitElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "a11y-tabs";
  }
  constructor() {
    super();
    this.disabled = false;
    this.hidden = false;
    this.iconBreakpoint = 400;
    this.layoutBreakpoint = 600;
    this.forceHorizontal = false;
    this.responsiveSize = "xs";
    this.vertical = false;
    this.__tabs = [];
    window.ResponsiveUtility.requestAvailability();
  }
  /**
   * mutation objserver for tabs
   * @readonly
   * @returns {object}
   */
  get observer() {
    let callback = () => this.updateTabs();
    return new MutationObserver(callback);
  }

  /**
   * array of tabs
   * @readonly
   * @returns {object}
   */
  get tabs() {
    return this.__tabs ? Object.keys(this.__tabs).map(i => this.__tabs[i]) : [];
  }
  /**
   * determines if tabs should show icons only
   * @readonly
   * @returns {boolean}
   */
  get iconClass() {
    let horizontal = !this.vertical && this.responsiveSize.indexOf("s") > -1,
      vertical = this.vertical && this.responsiveSize === "xs",
      breakpoints =
        this.iconBreakpoint > this.layoutBreakpoint &&
        this.responsiveSize === "sm";
    return this.hasIcons && (horizontal || vertical || breakpoints)
      ? "icons-only"
      : "label-and-icons";
  }
  /**
   * determines if all tabs have icons
   * @readonly
   * @returns {boolean}
   */
  get hasIcons() {
    let hasIcons = true;
    if (!this.id) this.id = this._generateUUID();
    if (this.__tabs && this.__tabs.length > 0)
      this.__tabs.forEach((tab, index) => {
        if (!tab.icon) hasIcons = false;
        tab.order = index + 1;
        tab.total = this.__tabs.length;
      });
    return hasIcons;
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.updateTabs();
    this._breakpointChanged();
    this.observer.observe(this, {
      attributes: false,
      childList: true,
      subtree: false
    });
    this.addEventListener("a11y-tab-changed", e => this.updateTabs());
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    if (this.observer && this.observer.disconnect) this.observer.disconnect();
    this.removeEventListener("a11y-tab-changed", e => this.updateTabs());
    this._unsetBreakpoints();
    super.disconnectedCallback();
  }

  /**
   * handle updates
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "id") this._idChanged(this.id, oldValue);
      if (propName === "activeTab") this._activeTabChanged(this.activeTab,oldValue);
      if (propName === "iconBreakpoint") this._breakpointChanged();
      if (propName === "layoutBreakpoint") this._breakpointChanged();
      if (propName === "responsiveSize") this._setVertical();
    });
  }
  /**
   * selects a tab
   * @param {string} id the active tab's id
   */
  selectTab(id) {
    let tabs = this.querySelectorAll("a11y-tab"),
      filtered = Object.keys(tabs || []).filter(tab=> tabs[tab].id === id),
      selected =
        filtered[0] && tabs[filtered[0]]
          ? tabs[filtered[0]]
          : tabs[0];
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
  updateTabs(e) {
    this.__tabs = this.querySelectorAll("a11y-tab");
    this.selectTab(this.activeTab);
  }
  /**
   * Observer activeTab for changes
   * @param {string} newValue the new active tab's id
   */
  _activeTabChanged(newValue,oldValue) {
    if(newValue !== oldValue)
      this.selectTab(newValue);
  }
  /**
   * handles any breakpoint changes
   * @param {event} e the tab change event
   */
  _breakpointChanged() {
    this._unsetBreakpoints();
    this._setBreakpoints();
    this._setVertical();
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
  _handleTab(tab) {
    if (!tab.disabled) this.activeTab = tab.id;
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
   * Fires when element is ready to request  breakpoint tracking from repsonsive  utility.
   *
   * @event responsive-element
   */
  _setBreakpoints() {
    let v = this.layoutBreakpoint > -1 ? this.layoutBreakpoint : 0,
      i = this.iconBreakpoint > -1 ? this.iconBreakpoint : 0,
      sm = i > v ? v : i,
      md = i > v ? i : v,
      lg = Math.max(i, v) + 1,
      xl = Math.max(i, v) + 2;
    window.dispatchEvent(
      new CustomEvent("responsive-element", {
        detail: {
          element: this,
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
   * determines if tabs should be in a vertical layout
   * @param {number} icon breakpoint for icon-only view
   * @param {number} layout breakpoint for vertical layout
   * @param {string} size the responsive size
   */
  _setVertical() {
    this.vertical =
      this.layoutBreakpoint === -1 ||
      (this.iconBreakpoint > this.layoutBreakpoint
        ? this.responsiveSize === "xs"
        : this.responsiveSize.indexOf("s") > -1);
  }
  /**
   * Fires when element is rno longer needs specific breakpoints tracked.
   *
   * @event responsive-element-deleted
   */
  _unsetBreakpoints() {
    window.dispatchEvent(
      new CustomEvent("responsive-element-deleted", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );
  }
}
window.customElements.define(A11yTabs.tag, A11yTabs);
export { A11yTabs };

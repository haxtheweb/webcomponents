/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { ResponsiveUtilityBehaviors } from "@lrnwebcomponents/responsive-utility/lib/responsive-utility-behaviors.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
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
`--a11y-tabs-font-family` | font-family | unset
`--a11y-tabs-font-size` | font-size | unset
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
`--a11y-tabs-text-decoration` | default text decoration for tab button | none
`--a11y-tabs-focus-text-decoration` | default text on focus or hover | underline

#### Tab Panel
Custom property | Description | Default
----------------|-------------|----------
`--a11y-tabs-tab-font-family` | font-family | `--a11y-tabs-font-family`
`--a11y-tabs-tab-font-size` | font-size | `--a11y-tabs-font-size`
`--a11y-tabs-font-weight` | default font weight | normal
`--a11y-tabs-selected-font-weight` | font weight of selected tabs | normal
`--a11y-tabs-focus-font-weight` | font weight of focused/hovered tabs | normal
`--a11y-tabs-text-decoration` | default text-decoration | none
`--a11y-tabs-focus-text-decoration` | text-decoration when focused/hovered | underline
`--a11y-tabs-selected-text-decoration` | text-decoration when selected | none
`--a11y-tabs-color` | default text color | #000
`--a11y-tabs-focus-color` | text color of focused/hovered tab | --a11y-tabs-color`
`--a11y-tabs-faded-color` | text color of disabled items |  #333;
`--a11y-tabs-selected-color` | text color of selected tab | `--a11y-tabs-focus-color`
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
`--a11y-tabs-border-accent` | optional thicker border for top of horizontal tabs or left of vertical tabs (ex. 4px solid blue) | unset
`--a11y-tabs-selected-border-accent` | optional thicker border for top of selected horizontal tab or left of vertical tab | unset
`--a11y-tabs-selected-focus-accent` | optional thicker border for top of focused/hovered horizontal tab or left of vertical tab | unset
`--a11y-tabs-selected-disabled-accent` | optional thicker border for top of disabled horizontal tabs or left of vertical tabs | unset

#### Content Section
Custom property | Description | Default
----------------|-------------|----------
`--a11y-tabs-content-padding` | padding for content of tab | 16px
`--a11y-tabs-content-background` | background color for content of tab | `--a11y-tabs-background`
 *
 * @demo ./demo/index.html
 * @demo ./demo/vertical.html Always Vertical
 * @demo ./demo/breakpoints.html Breakpoints
 * @demo ./demo/sticky.html Sticky Tabs
 * @element a11y-tabs
 */
class A11yTabs extends ResponsiveUtilityBehaviors(LitElement) {
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
    this.fullWidth = false;
    this.disableResponsive = false;
    this.disabled = false;
    this.hidden = false;
    this.__tabs = [];
    this.__tabFocus = 0;
    this.addEventListener("a11y-tab-changed", (e) => this.updateTabs());
  }
  get buttons() {
    return this.__tabButtons;
  }
  /**
   * determines if tabs should show icons only
   * @readonly
   * @returns {boolean}
   */
  get iconsOnly() {
    return (
      this.iconBreakpoint &&
      (this.tabs || []).filter((tab) => !tab.icon).length < 1 &&
      this.responsiveWidth < this.iconBreakpoint
    );
  }

  /**
   * mutation observer for tabs
   * @readonly
   * @returns {object}
   */
  get observer() {
    let callback = () => this.updateTabs();
    return new MutationObserver(callback);
  }

  /**
   * query selector for tabs
   * override this for custom elements that extend a11y-tabs
   *
   * @readonly
   * @memberof A11yTabs
   */
  get tabQuery() {
    return "a11y-tab";
  }

  /**
   * array of tabs
   * @readonly
   * @returns {object}
   */
  get tabs() {
    return Object.keys(this.__tabs || {}).map((i) => {
      this.__tabs[i].order = i + 1;
      this.__tabs[i].total = this.__tabs.length;
      return this.__tabs[i];
    });
  }

  /**
   * determines whether tabs should be in vertical layout
   * @readonly
   * @returns {boolean}
   */
  get vertical() {
    return (
      this.layoutBreakpoint && this.layoutBreakpoint < this.responsiveWidth
    );
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.updateTabs();
    this.observer.observe(this, {
      attributes: false,
      childList: true,
      subtree: false,
    });
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    if (this.observer && this.observer.disconnect) this.observer.disconnect();
    super.disconnectedCallback();
  }

  /**
   * handle updates
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "id") this._idChanged(this.id, oldValue);
      if (propName === "activeTab" && this.activeTab !== oldValue)
        this._activeTabChanged(this.activeTab, oldValue);
      if (propName === "responsiveWidth") {
        if (this.vertical) {
          this.setAttribute("vertical", true);
        } else {
          this.removeAttribute("vertical");
        }
      }
      if (["iconsBreakpoint", "responsiveWidth", "__tabs"].includes(propName)) {
        if (this.iconsOnly) {
          this.setAttribute("icons-only", true);
        } else {
          this.removeAttribute("icons-only");
        }
      }
    });
  }
  /**
   * selects a tab
   * @param {string} id the active tab's id
   */
  selectTab(id) {
    let tabs = this.querySelectorAll(this.tabQuery);
    if (tabs && tabs.length > 0) {
      let enabled = Object.keys(tabs || [])
          .filter((key) => !tabs[key].disabled)
          .map((key) => tabs[key].id),
        filtered = enabled.filter((tabid) => tabid === id),
        selected = filtered[0] || enabled[0];
      tabs.forEach((tab) => {
        tab.hidden = tab.id !== selected;
      });
      this.activeTab = selected;
    }
  }
  /**
   * updates the list of items based on slotted a11y-tab elements
   */
  updateTabs(e) {
    this.__tabs = this.querySelectorAll(this.tabQuery);
    this.__tabButtons = this.shadowRoot.querySelectorAll("[role=tab]");
    this.selectTab(this.activeTab);
  }
  /**
   * Observer activeTab for changes
   * @param {string} newValue the new active tab's id
   */
  _activeTabChanged(newValue, oldValue) {
    if (newValue !== oldValue) this.selectTab(newValue);
    window.dispatchEvent(
      new CustomEvent("active-tab-changed", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this,
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
  _handleTab(tab) {
    if (!tab.disabled) this.activeTab = tab.id;
  }
  _handleKey(i, e) {
    this.__tabFocus = i;
    let focus = (dir = 1) => {
      this.__tabFocus = this.__tabFocus + dir;
      // If we're at the end, go to the start
      if (this.__tabFocus >= this.buttons.length) {
        this.__tabFocus = 0;
        // If we're at the start, move to the end
      } else if (this.__tabFocus < 0) {
        this.__tabFocus = this.buttons.length - 1;
      }
      if (this.buttons[this.__tabFocus].disabled && this.__tabFocus !== i)
        focus(dir);
    };
    // Move right
    if (e.keyCode === 39 || e.keyCode === 37) {
      this.buttons[i].setAttribute("tabindex", -1);
      focus(e.keyCode === 39 ? 1 : -1);
      if (!this.buttons[this.__tabFocus].disabled) {
        this.buttons[this.__tabFocus].setAttribute("tabindex", 0);
        this.buttons[this.__tabFocus].focus();
      }
    }
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
   * makes tab button
   *
   * @param {object} tab a11y-tab
   * @returns object
   * @memberof A11yTabs
   */
  _tabButton(tab, i) {
    return html`
      <button
        id="${tab.id}-button"
        aria-selected="${tab.id === this.activeTab ? "true" : "false"}"
        aria-controls="${tab.id}"
        class="${tab.id === this.activeTab && !this.disabled ? "active" : ""}"
        .flag="${tab.flag}"
        @click="${(e) => this._handleTab(tab)}"
        @keydown="${(e) => this._handleKey(i, e)}"
        ?disabled="${tab.disabled || this.disabled}"
        tabindex="${tab.id === this.activeTab ? 0 : -1}"
        role="tab"
      >
        ${this._tabIcon(tab, "flagIcon")} ${this._tabLabel(tab)}
        ${this._tabFlag(tab)} ${this._tabIcon(tab, "icon")}
      </button>
      ${this._tabTooltip(tab)}
    `;
  }

  /**
   * makes tab flag
   *
   * @param {string} flag tab's flag
   * @returns object
   * @memberof A11yTabs
   */
  _tabFlag(tab) {
    return html`
      <span class="flag-type" ?hidden="${!tab.flag}"> ${tab.flag} </span>
    `;
  }

  /**
   * makes tab icon
   *
   * @param {string} icon tab's icon
   * @returns object
   * @memberof A11yTabs
   */
  _tabIcon(tab, icon) {
    return tab.flag
      ? html`
          <simple-icon-lite
            class="icon"
            ?hidden="${!tab[icon]}"
            .icon="${tab[icon]}"
            .title="${tab.flag}"
          >
          </simple-icon-lite>
        `
      : html`
          <simple-icon-lite
            class="icon"
            ?hidden="${!tab[icon]}"
            .icon="${tab[icon]}"
          >
          </simple-icon-lite>
        `;
  }

  /**
   * makes tab label
   *
   * @param {string} flag tab's flag
   * @returns object
   * @memberof A11yTabs
   */
  _tabLabel(tab) {
    return html` <span class="label">${tab.label}</span> `;
  }

  /**
   * makes tab tooltip
   *
   * @param {string} id tab's unique id
   * @param {label} label tab's label
   * @returns object
   * @memberof A11yTabs
   */
  _tabTooltip(tab) {
    return html`
      <simple-tooltip for="${tab.id}-button"> ${tab.label} </simple-tooltip>
    `;
  }
}
window.customElements.define(A11yTabs.tag, A11yTabs);
export { A11yTabs };

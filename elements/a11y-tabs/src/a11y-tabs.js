/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { ResponsiveUtilityBehaviors } from "@haxtheweb/responsive-utility/lib/responsive-utility-behaviors.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
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
 * @customElement
 * @extends LitElement
 * @extends ResponsiveUtilityBehaviors
 * @demo ./demo/index.html
 * @demo ./demo/vertical.html Always Vertical
 * @demo ./demo/breakpoints.html Breakpoints
 * @demo ./demo/sticky.html Sticky Tabs
 */
class A11yTabs extends ResponsiveUtilityBehaviors(LitElement) {
  static get A11yTabsCoreStyles() {
    return [
      css`
        :host {
          display: block;
          height: var(--a11y-tabs-height);
          overflow: var(--a11y-tabs-overflow);
        }

        :host([hidden]) {
          display: none;
        }

        #tabs {
          display: none;
        }
        @media screen {
          :host([vertical]) {
            border-radius: var(--a11y-tabs-vertical-border-radius, 2px);
            display: flex;
            justify-content: space-between;
            align-items: stretch;
          }
          #content {
            flex: 1 1 calc(100% - 2 * var(--a11y-tabs-content-padding, 16px));
            overflow: auto;
          }
          #tabs {
            align-items: stretch;
            flex-wrap: var(--a11y-tabs-wrap, unset);
            margin: 0;
            display: flex;
            list-style: none;
            padding: 0;
            overflow: auto;
            max-width: 100%;
            overflow-x: auto;
            z-index: 1;
            justify-content: var(--a11y-tabs-horizontal-justify-tabs);
          }
          :host([vertical]) #tabs {
            flex: 0 0 auto;
            flex-direction: column;
            overflow-y: auto;
            max-width: unset;
            overflow-x: unset;
            z-index: unset;
            flex-wrap: var(--a11y-tabs-vertical-wrap);
          }
          :host([sticky]) #tabs {
            position: sticky;
            top: 0;
          }
          #tabs li {
            display: flex;
            align-items: stretch;
          }
          :host([full-width]) #tabs li {
            width: 100%;
          }
          :host([vertical]) #tabs li {
            flex-direction: column;
          }
          #tabs .flag-type {
            position: absolute;
            left: -99999px;
            height: 0;
            overflow: hidden;
          }
          :host(:not([vertical])) #content {
            margin-top: -1px;
          }
          #tabs button {
            width: 100%;
            min-width: unset;
            margin: 0;
          }

          :host([vertical]) #tabs button {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          #tabs button[disabled] {
            pointer-events: none;
          }

          #tabs span.label,
          #tabs .flag-icon {
            margin-right: 8px;
          }

          :host([icons-only]) #tabs button {
            justify-content: center;
          }

          :host([icons-only]) #tabs span.label {
            display: none;
          }

          :host(:not([icons-only])) #tabs #tabs simple-tooltip {
            display: none;
          }
          simple-icon-lite:not([hidden]) {
            display: inline-block;
          }

          simple-icon-lite[hidden] {
            display: none;
          }
        }
      `,
    ];
  }
  static get A11yTabsThemeStyles() {
    return [
      css`
        :host {
          font-size: var(--a11y-tabs-font-size, unset);
          font-family: var(--a11y-tabs-font-family, unset);
          --a11y-tabs-focus-color: var(--a11y-tabs-color);
          --a11y-tabs-horizontal-border-radius: var(
            --a11y-tabs-border-radius,
            2px
          );
          --a11y-tabs-vertical-border-radius: var(
            --a11y-tabs-border-radius,
            2px
          );
          --a11y-tabs-vertical-button-padding: var(
            --a11y-tabs-button-padding,
            4px
          );
          --a11y-tabs-horizontal-button-padding: var(
            --a11y-tabs-button-padding,
            4px
          );
        }
        @media screen {
          :host([vertical]) {
            border-radius: var(--a11y-tabs-vertical-border-radius, 2px);
            border: 1px solid var(--a11y-tabs-border-color, #ddd);
          }

          #content {
            border: 1px solid var(--a11y-tabs-border-color, #ddd);
            padding: var(--a11y-tabs-content-padding, 16px);
            background-color: var(--a11y-tabs-content-background);
          }

          #tabs {
            background-color: var(--a11y-tabs-horizontal-background);
            font-family: var(
              --a11y-tabs-tab-font-family,
              var(--a11y-tabs-font-family, unset)
            );
            font-size: var(
              --a11y-tabs-tab-font-size,
              var(--a11y-tabs-font-size, unset)
            );
          }

          :host([vertical]) #tabs {
            border-left: none;
            background-color: var(--a11y-tabs-vertical-background);
            justify-content: var(--a11y-tabs-vertical-justify-tabs);
          }

          :host([vertical]) #tabs button {
            padding: var(--a11y-tabs-vertical-button-padding);
            border-radius: 0;
          }

          :host([vertical]) #content {
            border: none;
          }
          :host(:not([vertical])) #content {
            border-radius: var(--a11y-tabs-horizontal-border-radius, 2px);
          }

          #tabs button {
            text-transform: unset;
            color: var(--a11y-tabs-faded-color, #333);
            border: 1px solid var(--a11y-tabs-border-color);
            background-color: var(--a11y-tabs-faded-background, #f8f8f8);
            padding: var(--a11y-tabs-horizontal-button-padding);
            font-weight: var(--a11y-tabs-font-weight, normal);
            border-radius: var(--a11y-tabs-horizontal-border-radius, 2px)
              var(--a11y-tabs-horizontal-border-radius, 2px) 0 0;
          }

          button .label {
            text-decoration: var(--a11y-tabs-text-decoration, none);
          }

          :host(:not([vertical])) #tabs button {
            border-top-color: var(--a11y-tabs-border-accent);
          }

          :host(:not([vertical])) #tabs li:not(:first-of-type) button {
            border-left: none;
          }

          :host([vertical]) #tabs button {
            border-top: none;
            border-left-color: var(--a11y-tabs-border-accent);
          }

          #tabs button:focus,
          #tabs button:hover {
            color: var(--a11y-tabs-focus-color);
            font-weight: var(--a11y-tabs-focus-font-weight, normal);
          }

          button:focus .label,
          button:hover .label {
            text-decoration: var(--a11y-tabs-focus-text-decoration, underline);
          }

          :host(:not([vertical])) #tabs button:focus,
          :host(:not([vertical])) #tabs button:hover {
            border-top-color: var(--a11y-tabs-focus-border-accent);
          }

          :host([vertical]) #tabs button:focus,
          :host([vertical]) #tabs button:hover {
            border-left-color: var(--a11y-tabs-focus-border-accent);
          }

          #tabs button[aria-selected="true"] {
            font-weight: var(--a11y-tabs-selected-font-weight, normal);
            color: var(
              --a11y-tabs-selected-color,
              var(--a11y-tabs-focus-color)
            );
            background-color: var(--a11y-tabs-background);
          }

          button[aria-selected="true"] .label {
            text-decoration: var(--a11y-tabs-selected-text-decoration, none);
          }

          :host(:not([vertical])) #tabs button[aria-selected="true"] {
            border-bottom-color: var(--a11y-tabs-background);
            border-top-color: var(--a11y-tabs-selected-border-accent);
          }

          :host([vertical]) #tabs button[aria-selected="true"] {
            border-right-color: var(--a11y-tabs-background);
            border-left-color: var(--a11y-tabs-selected-border-accent);
          }

          #tabs button[disabled] {
            color: var(--a11y-tabs-disabled-color, #999);
            background-color: var(--a11y-tabs-disabled-background, #eee);
          }

          #tabs button[disabled]:focus,
          #tabs button[disabled]:hover {
            color: unset;
            font-weight: unset;
          }

          button[disabled]:focus .label,
          button[disabled]:hover .label {
            text-decoration: none;
          }

          :host(:not([vertical])) #tabs button[disabled] {
            border-left-color: var(--a11y-tabs-disabled-border-accent, unset);
          }

          :host([vertical]) #tabs button[disabled] {
            border-top-color: var(--a11y-tabs-disabled-border-accent, unset);
          }
        }
      `,
    ];
  }
  //styles function
  static get styles() {
    return [...this.A11yTabsCoreStyles, ...this.A11yTabsThemeStyles];
  }

  // render function
  render() {
    return html` <ul id="tabs" role="tablist" part="tablist">
        ${this.tabs.map(
          (tab, i) => html`
            <li part="tablist-item">${this._tabButton(tab, i)}</li>
          `,
        )}
      </ul>
      <div id="content" part="content">
        <slot></slot>
      </div>`;
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      ariaLabel: {
        type: String,
        reflect: true,
        attribute: "aria-label",
      },
      /**
       * id of active tab
       */
      activeTab: {
        type: String,
        reflect: true,
        attribute: "active-tab",
      },
      /**
       * if tabs should be full width or not
       */
      fullWidth: {
        type: Boolean,
        reflect: true,
        attribute: "full-width",
      },
      /**
       * whether tabbed interface is disabled
       */
      disabled: {
        type: Boolean,
        reflect: true,
        attribute: "disabled",
      },
      /**
       * whether tabbed interface is hidden
       */
      hidden: {
        type: Boolean,
        reflect: true,
        attribute: "hidden",
      },
      /**
       * Optional minimum breakpoint for showing tab text with icons, or
       * Default is always text with icons.
       * `-1` forces icon-only mode.
       */
      iconBreakpoint: {
        type: Number,
        attribute: "icon-breakpoint",
      },
      /**
       * unique identifier/anchor for tabbed interface
       */
      id: {
        type: String,
        reflect: true,
      },
      /**
       * Optional minimum breakpoint for horizontal layout of tabs.
       * Default is unset (always horizontal).
       * `-1` forces vertical-only mode.
       */
      layoutBreakpoint: {
        type: Number,
        attribute: "layout-breakpoint",
      },
      /**
       * size of tabs,
       * where `xs` is smaller breakpoint
       * and `xs` is larger breakpoint
       */
      responsiveSize: {
        type: String,
        reflect: true,
        attribute: "responsive-size",
      },
      /**
       * whether tabs are sticky
       */
      sticky: {
        type: Boolean,
        reflect: true,
        attribute: "sticky",
      },
      /**
       * an array of tab data based on slotted `a11y-tab` elements
       */
      __tabs: {
        type: Array,
      },
      /**
       * an array of tab buttons
       */
      __tabButtons: {
        type: Array,
      },
      /**
       * which tab button has ketboard focus
       */
      __tabFocus: {
        type: Number,
      },
    };
  }

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
    this.observer.observe(this, {
      attributes: false,
      childList: true,
      subtree: false,
    });
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // ensure state is accurate internally after setup
    setTimeout(() => {
      this.updateTabs();
    }, 0);
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
        tab.inactive = tab.id !== selected;
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
    // global response when local is not enough
    globalThis.dispatchEvent(
      new CustomEvent("a11y-tabs-active-changed", {
        cancelable: true,
        detail: this,
      }),
    );
    // local event response
    this.dispatchEvent(
      new CustomEvent("a11y-tabs-active-changed", {
        detail: this,
      }),
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
        .substring(1),
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
    // see if there are buttons loaded after the fact
    if (this.buttons.length === 0) {
      this.updateTabs();
    }
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
      this.buttons[this.__tabFocus].setAttribute("tabindex", -1);
      focus(e.keyCode === 39 ? 1 : -1);
      if (!this.buttons[this.__tabFocus].disabled) {
        this.buttons[this.__tabFocus].setAttribute("tabindex", 0);
        this.buttons[this.__tabFocus].focus();
      }
      // keyCode is something this menu is responding to, don't propagate event
      e.preventDefault();
      e.stopPropagation();
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
        part="${tab.id === this.activeTab && !this.disabled
          ? "tab-active"
          : this.disabled || tab.disabled
            ? "tab-disabled"
            : ""} tab tab-${tab.id}"
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
      <span class="flag-type" ?hidden="${!tab.flag}" part="flag">
        ${tab.flag}
      </span>
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
            part="icon"
          >
          </simple-icon-lite>
        `
      : html`
          <simple-icon-lite
            class="icon"
            ?hidden="${!tab[icon]}"
            .icon="${tab[icon]}"
            part="icon"
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
    return html` <span class="label" part="label">${tab.label}</span> `;
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
      <simple-tooltip for="${tab.id}-button" part="tooltip">
        ${tab.label}
      </simple-tooltip>
    `;
  }
}
customElements.define(A11yTabs.tag, A11yTabs);
export { A11yTabs };

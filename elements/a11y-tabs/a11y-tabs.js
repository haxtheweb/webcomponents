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
  
  //styles function
  static get styles() {
    return  [
      
      css`
:host {
  display: block;
  --a11y-tabs-width: 100%;
  --a11y-tabs-background: white;
  --a11y-tabs-border-color: #ddd;
  --a11y-tabs-color: #222;
  --a11y-tabs-focus-color: #000;
  --a11y-tabs-faded-background: #eee;
  --a11y-tabs-border-radius: 2px;
  --a11y-tabs-horizontal-border-radius: var(--a11y-tabs-border-radius);
  --a11y-tabs-vertical-border-radius: var(--a11y-tabs-border-radius);
  --a11y-tabs-content-background: var(--a11y-tabs-background);
  --a11y-tabs-content-padding: 16px;
  --a11y-tabs-justify-tabs: flex-start;
  --a11y-tabs-horizontal-justify-tabs: var(--a11y-tabs-justify-tabs, flex-start);
  --a11y-tabs-vertical-justify-tabs: var(--a11y-tabs-justify-tabs, flex-start);
  --a11y-tabs-wrap: unset;
  --a11y-tabs-vertical-wrap: var(--a11y-tabs-wrap, unset);
  --a11y-tabs-horizontal-background: unset;
  --a11y-tabs-horizontal-sticky-background: var(--a11y-tabs-background);
  --a11y-tabs-vertical-background: var(--a11y-tabs-border-color, #ddd);
  --a11y-tabs-button-padding: 8px;
  --a11y-tabs-horizontal-button-padding: var(--a11y-tabs-button-padding);
  --a11y-tabs-vertical-button-padding: var(--a11y-tabs-button-padding);
  height: var(--a11y-tabs-height, unset);
  margin: var(--a11y-tabs-margin, 16px 0);
  overflow: var(--a11y-tabs-overflow, auto);
  overflow-x: var(--a11y-tabs-overflow-x,var(--a11y-tabs-overflow));
  overflow-y: var(--a11y-tabs-overflow-y,var(--a11y-tabs-overflow));
  max-width: 100%;
}

:host([sticky]) {
  position: relative;
  overflow-y: visible;
}

:host([vertical]) {
  border: 1px solid var(--a11y-tabs-border-color);
  border-radius: var(--a11y-tabs-vertical-border-radius);
  display: flex;
  justify-content: space-between;
  align-items: stretch;
}

:host([hidden]) {
  display: none;
}

:host #tabs {
  align-items: stretch;
  flex-wrap: var(--a11y-tabs-wrap, unset);
  margin: 0;
  display: flex;
  list-style: none;
  padding: 0;
  overflow: auto;
}

:host([vertical]) #tabs {
  border-left: none;
  flex: 0 0 auto;
  flex-direction: column;
  overflow-y: auto;
  background-color: var(--a11y-tabs-vertical-background);
  justify-content: var(--a11y-tabs-vertical-justify-tabs);
  flex-wrap: var(--a11y-tabs-vertical-wrap);
}

:host(:not([vertical])) #tabs {
  z-index: 1;
  max-width: 100%;
  overflow-x: auto;
  background-color: var(--a11y-tabs-horizontal-background);
  justify-content: var(--a11y-tabs-horizontal-justify-tabs);
}

:host([sticky]) #tabs {
  position: sticky;
}

:host([sticky][vertical]) #tabs {
  left: 0;
}

:host([sticky]:not([vertical])) #tabs {
  top: 0;
  background-color: var(--a11y-tabs-horizontal-sticky-background);
}

:host #tabs li {
  display: flex;
  align-items: stretch;
}

:host([vertical]) #tabs li {
  flex-direction: column;
}

:host #tabs .flag-type {
  position: absolute;
  left: -99999px;
  height: 0; 
  overflow: hidden;
}

:host #content {
  padding: var(--a11y-tabs-content-padding);
  background-color: var(--a11y-tabs-content-background);
  border: 1px solid var(--a11y-tabs-border-color);
  flex: 1 1 calc(100% - 2 * var(--a11y-tabs-content-padding));
  overflow: auto;
}

:host([vertical]) #content {
  border: none;
}

:host(:not([vertical])) #content {
  border-radius: var(--a11y-tabs-horizontal-border-radius);
  margin-top: -1px;
}

:host #tabs paper-button {
  margin: 0;
  text-transform: unset;
  color: var(--a11y-tabs-color);
  background-color: var(--a11y-tabs-faded-background);
  border: 1px solid var(--a11y-tabs-border-color);
  padding: var(--a11y-tabs-button-padding);
}

:host([vertical]) #tabs paper-button {
  border-top: none;
  border-left: none;
  border-radius: 0; 
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--a11y-tabs-vertical-button-padding);
}

:host(:not([vertical])) #tabs paper-button {
  border-bottom: none;
  border-radius: var(--a11y-tabs-horizontal-border-radius) var(--a11y-tabs-horizontal-border-radius) 0 0; 
  padding: var(--a11y-tabs-horizontal-button-padding);
}

:host(:not([vertical])) #tabs li:not(:first-of-type) paper-button {
  border-left: none;
}

:host  #tabs paper-button:active,
:host #tabs paper-button:focus,
:host #tabs paper-button:hover {
  color: var(--a11y-tabs-focus-color);
  background-color: var(--a11y-tabs-faded-background);
}

:host #tabs paper-button.active[disabled] {
  color: var(--a11y-tabs-focus-color);
  background-color: var(--a11y-tabs-background);
  opacity: 1;
}

:host #tabs paper-button:not(.active)[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

:host([vertical]) #tabs paper-button[disabled] {
  border-right-color: var(--a11y-tabs-background);
}

:host(:not([vertical])) #tabs paper-button[disabled] {
  border-bottom: 1px solid var(--a11y-tabs-background);
}

:host #tabs span.label,
:host #tabs .flag-icon {
  margin-right: 8px;
}

:host #tabs.icons-only paper-button {
  justify-content: center;
}

:host #tabs.icons-only span.label {
  display: none;
}

:host #tabs:not(.icons-only) simple-tooltip {
  display: none;
}
      `
    ];
  }

// render function
  render() {
    return html`

<ul id="tabs" .class="${this.iconClass}">
  ${this.tabs.map((tab,i) => html`
    <li>
      <paper-button 
        id="${tab.id}-button" 
        controls="${tab.id}" 
        class="${tab.id === this.activeTab ? 'active': ''}"
        @click="${(e) => this._handleTab(tab)}"
        ?disabled="${tab.id === this.activeTab || tab.disabled}" 
        .flag="${tab.flag}">
        <iron-icon 
          class="flag-icon" 
          ?hidden="${!tab.flagIcon}" 
          .icon="${tab.flagIcon}">
        </iron-icon>
        <span class="label">${tab.label}</span> 
        <span 
          class="flag-type" 
          ?hidden="${!tab.flag}">
          ${tab.flag}
        </span>
        <iron-icon 
          class="icon" 
          ?hidden="${!tab.icon}" 
          .icon="${tab.icon}">
        </iron-icon>
      </paper-button>
      <simple-tooltip for="${tab.id}-button">${tab.label}</simple-tooltip>
    </li>
  `)}
</ul>
<div id="content">
  <slot></slot>
</div>`;
  }

  // haxProperty definition
  static get haxProperties() {
    return {}
;
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
  
  ...super.properties,
  
  /**
   * the id of the active tab
   */
  "activeTab": {
    "type": String,
    "attribute": "active-tab"
  },
  /**
   * whether the tabbed interface is disabled
   */
  "disabled": {
    "type": Boolean,
    "reflect": true
  },
  /**
   * whether the tabbed interface is hidden
   */
  "hidden": {
    "type": Boolean,
    "reflect": true
  },
  /**
   * the minimum breakpoint for showing tab text with icons, or
   * - use `0` to always show icons only
   * - use `-1` to always show text with icons
   */
  "iconBreakpoint": {
    "type": Number,
    "attribute": "icon-breakpoint"
  },
  /**
   * unique identifier/anchor for the tabbed interface
   */
  "id": {
    "type": String,
    "reflect": true
  },
  /**
   * the minimum breakpoint for horizontal layout of tabs, or
   * - use `0` for horizontal-only
   * - use `-1` for vertical-only
   */
  "layoutBreakpoint": {
    "type": Number,
    "attribute": "layout-breakpoint"
  },
  /**
   * the size of the tabs,
   * where `xs` is the smaller breakpoint
   * and `xs` is the larger breakpoint
   */
  "responsiveSize": {
    "type": String,
    "reflect": true,
    "attribute": "responsive-size"
  },
  /**
   * whether the tabs are sticky
   */
  "sticky": {
    "type": Boolean,
    "reflect": true,
    "attribute": "sticky"
  },
  /**
   * whether the tabbed interface is in vertical layout mode
   */
  "vertical": {
    "type": Boolean,
    "reflect": true,
    "attribute": "vertical"
  },
  /**
   * an array of tab data based on slotted `a11y-tab` elements
   */
  "__tabs": {
    "type": Array
  }
}
;
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
      if (propName === "activeTab")
        this._activeTabChanged(this.activeTab, oldValue);
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
      filtered = Object.keys(tabs || []).filter(tab => tabs[tab].id === id),
      selected = filtered[0] && tabs[filtered[0]] ? tabs[filtered[0]] : tabs[0];
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
  _activeTabChanged(newValue, oldValue) {
    if (newValue !== oldValue) this.selectTab(newValue);
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

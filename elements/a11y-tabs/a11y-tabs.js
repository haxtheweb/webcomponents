/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { ResponsiveUtilityBehaviors } from "@lrnwebcomponents/responsive-utility/lib/responsive-utility-behaviors.js";
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

#### Tab Section
Custom property | Description | Default
----------------|-------------|----------
`--a11y-tabs-tab-font-family` | font-family | `--a11y-tabs-font-family`
`--a11y-tabs-tab-font-size` | font-size | `--a11y-tabs-font-size`
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
 * @demo ./demo/breakpoints.html Breakpoints
 * @demo ./demo/sticky.html Sticky Tabs
 * @element a11y-tabs
 */
class A11yTabs extends ResponsiveUtilityBehaviors(LitElement) {
  
  //styles function
  static get styles() {
    return  [
      
      css`
:host {
  display: block;
  height: var(--a11y-tabs-height);
  overflow: var(--a11y-tabs-overflow);
  font-size: var(--a11y-tabs-font-size, unset);
  font-family: var(--a11y-tabs-font-family, unset);
  --a11y-tabs-width: 100%;
  --a11y-tabs-background: white;
  --a11y-tabs-border-color: #ddd;
  --a11y-tabs-color: #000;
  --a11y-tabs-faded-color: #333;
  --a11y-tabs-focus-color: var(-a11y-tabs-color);
  --a11y-tabs-faded-background: #f8f8f8;
  --a11y-tabs-disabled-color: #999;
  --a11y-tabs-disabled-background: #eee;
  --a11y-tabs-border-radius: 2px;
  --a11y-tabs-horizontal-background: var(--a11y-tabs-background, white);
  --a11y-tabs-horizontal-border-radius: var(--a11y-tabs-border-radius, 2px);
  --a11y-tabs-vertical-border-radius: var(--a11y-tabs-border-radius, 2px);
  --a11y-tabs-content-background: var(--a11y-tabs-background, white);
  --a11y-tabs-content-padding: 16px;
  --a11y-tabs-button-padding: 8px;
  --a11y-tabs-vertical-button-padding: var(--a11y-tabs-button-padding, 8px);
  --a11y-tabs-horizontal-border-radius: unset;
  --a11y-tabs-vertical-border-radius: unset;
  --a11y-tabs-horizontal-button-padding: var(--a11y-tabs-button-padding, 8px);
  --a11y-tabs-width: auto;
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
  max-width: 100%;
  overflow-x: auto;
  z-index: 1;
  justify-content: var(--a11y-tabs-horizontal-justify-tabs);
  background-color: var(--a11y-tabs-horizontal-background);
  font-family: var(--a11y-tabs-tab-font-family, var(--a11y-tabs-font-family, unset));
  font-size: var(--a11y-tabs-tab-font-size, var(--a11y-tabs-font-size, unset));
}

:host([vertical]) #tabs {
  border-left: none;
  flex: 0 0 auto;
  flex-direction: column;
  overflow-y: auto;
  max-width: unset;
  overflow-x: unset;
  z-index: unset;
  background-color: var(--a11y-tabs-vertical-background);
  justify-content: var(--a11y-tabs-vertical-justify-tabs);
  flex-wrap: var(--a11y-tabs-vertical-wrap);
}

:host([sticky]) #tabs {
  position: sticky;
  top: 0;
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
  color: var(--a11y-tabs-faded-color);
  border: 1px solid var(--a11y-tabs-border-color);
  background-color: var(--a11y-tabs-faded-background);
  padding: var(--a11y-tabs-horizontal-button-padding);
  border-radius: var(--a11y-tabs-horizontal-border-radius) var(--a11y-tabs-horizontal-border-radius) 0 0; 
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

:host(:not([vertical])) #tabs li:not(:first-of-type) paper-button {
  border-left: none;
}

:host #tabs paper-button:active,
:host #tabs paper-button:focus,
:host #tabs paper-button:hover {
  color: var(--a11y-tabs-focus-color);
}

:host #tabs paper-button.active[disabled] {
  color: var(--a11y-tabs-focus-color);
  background-color: var(--a11y-tabs-background);
}

:host(:not([vertical])) #tabs paper-button.active {
  border-bottom: var(--a11y-tabs-background);
}

:host([vertical]) #tabs paper-button.active {
  border-right: var(--a11y-tabs-background);
}

:host #tabs paper-button:not(.active)[disabled] {
  color: var(--a11y-tabs-disabled-color);
  background-color: var(--a11y-tabs-disabled-background);
  cursor: not-allowed;
}

:host #tabs span.label,
:host #tabs .flag-icon {
  margin-right: 8px;
}

:host([icons-only]) #tabs paper-button {
  justify-content: center;
}

:host([icons-only]) #tabs span.label {
  display: none;
}

:host(:not([icons-only])) #tabs #tabs simple-tooltip {
  display: none;
}
      `
    ];
  }

// render function
  render() {
    return html`

<ul id="tabs">
  ${this.tabs.map((tab,i) => html`
    <li>${this._tabButton(tab)}</li>
  `)}
</ul>
<div id="content">
  <slot></slot>
</div>`;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
  "canScale": false,
  "canPosition": true,
  "canEditSource": false,
  "gizmo": {
    "title": "Tabs",
    "description": "A set of tabs.",
    "icon": "view-day",
    "color": "grey",
    "groups": ["Content", "Presentation", "Tabs"]
  },
  "settings": {
    "quick": [
      {
        "property": "disabled",
        "title": "Disabled",
        "inputMethod": "boolean"
      },
      {
        "property": "hidden",
        "title": "Hidden",
        "inputMethod": "boolean"
      },
      {
        "property": "sticky",
        "title": "Sticky",
        "desc": "Horizontal tabs stick to the top of the window when scrolling.",
        "inputMethod": "boolean"
      }
    ],
    "configure": [
      {
        "property": "disabled",
        "title": "Disabled",
        "inputMethod": "boolean"
      },
      {
        "property": "hidden",
        "title": "Hidden",
        "inputMethod": "boolean"
      },
      {
        "property": "sticky",
        "title": "Sticky.",
        "desc": "Horizontal tabs stick to the top of the window when scrolling.",
        "inputMethod": "boolean"
      },
      {
        "property": "layoutBreakpoint",
        "title": "Layout Breakpoint",
        "inputMethod": "Number",
        "descripton": "Optional minimum breakpoint for horizontal layout of tabs. Default is unset (always horizontal). Setting `-1` forces vertical-only mode."
      },
      {
        "property": "iconBreakpoint",
        "title": "Icon Breakpoint",
        "inputMethod": "Number",
        "descripton": "Optional minimum breakpoint for showing tab text with icons. Default is always text with icons (0). Setting to -1 forces icon-only mode."
      },
      {
        "slot": "",
        "title": "Tabs",
        "description": "A series of <a11y-tab/> elements.",
        "inputMethod": "code-editor"
      }
    ],
    "advanced": [
      {
        "property": "id",
        "title": "Unique ID",
        "inputMethod": "textfield"
      },

    ]
  }
};
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
    "reflect": true,
    "attribute": "active-tab"
  },
  /**
   * whether the tabbed interface is disabled
   */
  "disabled": {
    "type": Boolean,
    "reflect": true,
    "attribute": "disabled"
  },
  /**
   * whether the tabbed interface is hidden
   */
  "hidden": {
    "type": Boolean,
    "reflect": true,
    "attribute": "hidden"
  },
  /**
   * Optional minimum breakpoint for showing tab text with icons, or
   * Default is always text with icons.
   * `-1` forces icon-only mode.
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
   * Optional minimum breakpoint for horizontal layout of tabs.
   * Default is unset (always horizontal).
   * `-1` forces vertical-only mode.
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
    this.__tabs = [];
  }
  /**
   * determines if tabs should show icons only
   * @readonly
   * @returns {boolean}
   */
  get iconsOnly() {
    return (
      this.iconBreakpoint &&
      (this.tabs || []).filter(tab => !tab.icon).length < 1 &&
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
    return Object.keys(this.__tabs || {}).map(i => {
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
    super.disconnectedCallback();
  }

  firstUpdated() {
    if (super.firstUpdated()) super.firstUpdated();
    window.ResponsiveUtility.requestAvailability();
    window.dispatchEvent(
      new CustomEvent("responsive-element", { detail: { element: this } })
    );
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
          .filter(key => !tabs[key].disabled)
          .map(key => tabs[key].id),
        filtered = enabled.filter(tabid => tabid === id),
        selected = filtered[0] || enabled[0];
      tabs.forEach(tab => {
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
        detail: this
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
  _tabButton(tab) {
    return html`
      <paper-button
        id="${tab.id}-button"
        controls="${tab.id}"
        class="${(tab.id === this.activeTab) && !this.disabled ? "active" : ""}"
        @click="${e => this._handleTab(tab)}"
        ?disabled="${tab.id === this.activeTab || tab.disabled || this.disabled}"
        .flag="${tab.flag}">
        ${this._tabIcon(tab, "flagIcon")} ${this._tabLabel(tab)}
        ${this._tabFlag(tab)} ${this._tabIcon(tab, "icon")}
      </paper-button>
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
      <span class="flag-type" ?hidden="${!tab.flag}">
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
    return html`
      <iron-icon
        class="icon"
        ?hidden="${!tab[icon]}"
        .icon="${tab[icon]}"
        .title="${tab[flag]}">
      </iron-icon>
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
    return html`
      <span class="label">${tab.label}</span>
    `;
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
      <simple-tooltip for="${tab.id}-button">
        ${tab.label}
      </simple-tooltip>
    `;
  }
}
window.customElements.define(A11yTabs.tag, A11yTabs);
export { A11yTabs };

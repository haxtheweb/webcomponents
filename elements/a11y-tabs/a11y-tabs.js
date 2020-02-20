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

Custom property | Description | Default
----------------|-------------|----------
`--a11y-tabs-tab-height` | tab height | `--a11y-tabs-height`
 *
 * @customElement a11y-tabs
 * @demo ./demo/index.html
 */
class A11yTabs extends LitElement {
  
  //styles function
  static get styles() {
    return  [
      
      css`
:host {
  display: block;
  --a11y-tabs-border-radius: 2px;
  --a11y-tabs-justify-tabs: flex-start;
  --ally-tabs-wrap: unset;
  --a11y-tabs-background: white;
  --a11y-tabs-border-color: #ddd;
  --a11y-tabs-color: #222;
  --a11y-tabs-focus-color: #000;
  --a11y-tabs-faded-background: #eee;
  --a11y-tabs-content-padding: 16px;
  --a11y-tabs-button-padding: 0.7em 0.57em;
  --a11y-tabs-vertical-button-padding: unset;
  --a11y-tabs-horizontal-border-radius: unset;
  --a11y-tabs-vertical-border-radius: unset;
  --a11y-tabs-horizontal-button-padding: 2px 5px;
  height: var(--a11y-tabs-height);
  overflow: var(--a11y-tabs-overflow);
}
:host([vertical]) {
  border: 1px solid var(--a11y-tabs-border-color);
  border-radius: var(--a11y-tabs-vertical-border-radius, var(--a11y-tabs-border-radius));
  display: flex;
  justify-content: space-between;
  align-items: stretch;
}
:host([hidden]) {
  display: none;
}
:host #tabs {
  align-items: stretch;
  flex-wrap: var(--ally-tabs-wrap, unset);
  margin: 0;
  display: flex;
  list-style: none;
  padding: 0;
}
:host([vertical]) #tabs {
  background-color: var(--a11y-tabs-border-color);
  justify-content: var(--a11y-tabs-vertical-justify-tabs, var(--a11y-tabs-justify-tabs, flex-start));
  flex-wrap: var(--ally-tabs-vertical-wrap, var(--ally-tabs-wrap, unset));
  border-left: none;
  flex: 0 1 auto;
  flex-direction: column;
}
:host(:not([vertical])) #tabs {
  justify-content: var(--a11y-tabs-horizontal-justify-tabs, var(--a11y-tabs-justify-tabs, flex-start));
}
:host #tabs .flag-type {
  position: absolute;
  left: -99999px;
  height: 0; 
  overflow: hidden;
}
:host #content {
  padding: var(--a11y-tabs-content-padding);
  background-color: var(--a11y-tabs-background);
  border: 1px solid var(--a11y-tabs-border-color);
}
:host([vertical]) #content {
  flex: 1 0 auto;
  border: none;
}
:host(:not([vertical])) #content {
  border-radius: var(--a11y-tabs-horizontal-border-radius, var(--a11y-tabs-border-radius));
  margin-top: -1px;
}
:host #tabs paper-button {
  margin: 0;
  text-transform: unset;
  color: var(--a11y-tabs-color);
  background-color: var(--a11y-tabs-faded-background);
  border: 1px solid var(--a11y-tabs-border-color);
  padding: var(--a11y-tabs-button-padding, 0.7em 0.57em);
}
:host([vertical]) #tabs paper-button {
  border-top: none;
  border-left: none;
  border-radius: 0; 
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--a11y-tabs-vertical-button-padding, var(--a11y-tabs-button-padding));
}
:host(:not([vertical])) #tabs paper-button {
  width: 100%;
  border-bottom: none;
  border-radius: 
    var(--a11y-tabs-horizontal-border-radius, var(--a11y-tabs-border-radius))
    var(--a11y-tabs-horizontal-border-radius, var(--a11y-tabs-border-radius))
    0 
    0; 
  padding: var(--a11y-tabs-horizontal-button-padding, var(--a11y-tabs-button-padding));
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
:host #tabs paper-button[disabled] {
  color: var(--a11y-tabs-focus-color);
  background-color: var(--a11y-tabs-background);
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
  display:none;
}
:host #tabs:not(.icons-only) simple-tooltip {
  display:none;
}
      `
    ];
  }

// render function
  render() {
    return html`

<ul id="tabs" .class="${this._showIcons(
  this.__hasIcons, 
  this.iconBreakpoint, 
  this.layoutBreakpoint, 
  this.responsiveSize
)}">
  ${this.__items.map(tab => html`
    <li>
      <paper-button 
        id="${tab.id}-button" 
        controls="${tab.id}" 
        @click="${(e) => this._handleTab(`${tab.id}`)}"
        ?disabled="${tab.id === this.activeTab}" 
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
   * whether the tabbed interface is in vertical layout mode
   */
  "vertical": {
    "type": Boolean,
    "reflect": true
  },
  /**
   * whether the tabbed interface has icons for each tab
   */
  "__hasIcons": {
    "type": Boolean
  },
  /**
   * an array of tab data based on slotted `a11y-tab` elements
   */
  "__items": {
    "type": Array
  },
  /**
   * a mutation observer to monitor slotted `a11y-tab` elements
   */
  "__observer": {
    "type": Object
  },
  "forceHorizontal": {
    "type": Boolean,
    "attribute": "force-horizontal"
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
    let callback = (mutationsList, observer) => this.updateItems();
    this.activeTab = null;
    this.disabled = false;
    this.hidden = false;
    this.iconBreakpoint = 400;
    this.id = null;
    this.layoutBreakpoint = 600;
    this.forceHorizontal = false;
    this.responsiveSize = "xs";
    this.vertical = false;
    this.__hasIcons = false;
    this.__items = [];
    this.updateItems();
    this.__observer = new MutationObserver(callback);
    this._breakpointChanged();
    window.ResponsiveUtility.requestAvailability();
    this.__observer.observe(this, {
      attributes: false,
      childList: true,
      subtree: false
    });
    this.addEventListener("a11y-tab-changed", e => this.updateItems());
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    if (this.__observer && this.__observer.disconnect)
      this.__observer.disconnect();
    this.removeEventListener("a11y-tab-changed", e => this.updateItems());
    this._unsetBreakpoints();
    super.disconnectedCallback();
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "id") this._idChanged(this.id, oldValue);
      if (propName === "activeTab") this.selectTab(this.activeTab);
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
    this.__items = [];
    let tabs = this.querySelectorAll("a11y-tab"),
      ctr = 1;
    this.__hasIcons = true;
    if (!this.id) this.id = this._generateUUID();
    if (tabs && tabs.length > 0)
      tabs.forEach(tab => {
        this.__items.push({
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
  _handleTab(id) {
    this.activeTab = id;
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
    if (this.forceHorizontal) {
      this.vertical = false;
    } else {
      this.vertical =
        this.layoutBreakpoint === -1 ||
        this.iconBreakpoint > this.layoutBreakpoint
          ? this.responsiveSize === "xs"
          : this.responsiveSize.indexOf("s") > -1;
    }
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
    return hasIcons &&
      icon !== -1 &&
      (size === "xs" || (icon > layout && size === "sm"))
      ? "icons-only"
      : "";
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

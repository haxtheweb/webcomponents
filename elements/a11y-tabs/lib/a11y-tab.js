/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/iron-icons/iron-icons.js";
/**
 * `a11y-tab`
 * a single tab within `a11y-tabs`
 * 
### Styling

`<a11y-tab>` provides the following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--a11y-tabs-tab-height` | tab height | `--a11y-tabs-height`
`--a11y-tabs-tab-overflow` | tab overflow | `--a11y-tabs-overflow`
 *
 * @customElement
 * @demo ./demo/index.html
 * @see ../a11y-tabs.js
 */
class A11yTab extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
          height: var(--a11y-tabs-tab-height, --a11y-tabs-height);
          overflow: var(--a11y-tabs-tab-overflow, --a11y-tabs-overflow);
        }
        :host([hidden]) {
          display: none;
        }
        .sr-only {
          position: absolute;
          left: -99999px;
          height: 0;
          overflow: hidden;
        }
      `
    ];
  }
  render() {
    return html`
      <span class="sr-only">Tab ${this.__xOfY}</span>
      <slot></slot>
      <span class="sr-only"
        >End of tab ${this.__xOfY}. Back to
        <a href="${this.__toTop}">tabs</a>.</span
      >
    `;
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * optional flag the tab, eg. `new`, `alert`, or `error`
       */
      flag: {
        type: String,
        reflect: true
      },
      /**
       * optional flag icon the tab, eg. `av:fiber-new`, `icons:warning`, or `icons:error`
       */
      flagIcon: {
        type: String,
        attribute: "flag-icon"
      },
      /**
       * whether the tab is hidden
       */
      hidden: {
        type: Boolean,
        reflect: true
      },
      /**
       * icon for this tab, eg. `maps:local-airport`, `maps:local-bar`, or `notification:wifi`
       */
      icon: {
        type: String
      },
      /**
       * the unique identifier and anchor for the tab
       */
      id: {
        type: String
      },
      /**
       * label for the tab
       */
      label: {
        type: String
      },
      /**
       * the anchor back to the top of the tab list (`a11y-tabs` id)
       */
      __toTop: {
        type: String
      },
      /**
       * tab x of y text, eg. `2 of 3`
       */
      __xOfY: {
        type: String
      }
    };
  }
  constructor() {
    super();
    this.flag = null;
    this.flagIcon = null;
    this.hidden = false;
    this.icon = null;
    this.id = null;
    this.label = null;
    this.__xOfY = null;
    this.__toTop = null;
    this.addEventListener("a11y-tab-flag", e => this.handleFlag(e));
  }

  disconnectedCallback() {
    this.removeEventListener("a11y-tab-flag", e => this.handleFlag(e));
    super.disconnectedCallback();
  }
  /**
   * @fires a11y-tab-changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "flag") this._tabChanged();
      if (propName === "flagIcon") this._tabChanged();
      if (propName === "icon") this._tabChanged();
      if (propName === "id") this._tabChanged();
      if (propName === "label") this._tabChanged();
    });
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "a11y-tab";
  }
  /**
   * handles any change in flag
   * @param {event} e the tab change event
   */
  _handleFlag(e) {
    this.flag = e.detail.flag;
    this.flagIcon = e.detail.flagIcon;
  }
  /**
   * handles any change in the tab attributes
   */
  _tabChanged() {
    /**
     * handles any change in the tab attributes
     *
     * @event a11y-tab-changed
     */
    this.dispatchEvent(
      new CustomEvent("a11y-tab-changed", {
        bubbles: true,
        cancelable: true,
        composed: false,
        detail: this
      })
    );
  }
}
window.customElements.define(A11yTab.tag, A11yTab);
export { A11yTab };
